// translate.ts — paragraph-level English → Chinese translation, batched and cached.

import type { DraftArticle, DraftParagraph } from "./parse.ts";
import { chatCompletion } from "./openai.ts";
import { cacheGet, cacheSet, cacheFlush, hashKey } from "./cache.ts";

const SYSTEM_PROMPT = `你是一名专业的科技英中翻译，目标读者是中文母语的英语学习者。请遵守：
1. 严格按段落翻译，每个英文段落对应一段中文。
2. 保持原文语气与信息密度。允许略简化口水词，但不能丢失要点。
3. 人名 / 公司名 / 产品名 / 代码 / URL 一律保留英文原文，不音译。
4. 保留专业术语（API、agent、token、stablecoin 等）的英文，可在第一次出现时附中文括注。
5. 输出仅包含中文译文，每段独立一行，按输入顺序，不要写"段落 1:"之类前缀，不要解释。`;

const BATCH_SIZE = 8; // paragraphs per request

interface TranslationCacheEntry {
  zh: string;
  model: string;
}

export async function translateArticles(
  articles: DraftArticle[],
  options: { onProgress?: (done: number, total: number) => void } = {},
): Promise<void> {
  const totalParas = articles.reduce((n, a) => n + a.paragraphs.length, 0);
  let done = 0;

  for (const article of articles) {
    // Group paragraphs into batches of uncached ones.
    const pending: DraftParagraph[] = [];
    for (const p of article.paragraphs) {
      const key = hashKey(p.text);
      const hit = cacheGet<TranslationCacheEntry>("translate", key);
      if (hit) {
        (p as DraftParagraph & { zh?: string }).zh = hit.zh;
        done++;
        options.onProgress?.(done, totalParas);
      } else {
        pending.push(p);
      }
    }
    if (!pending.length) continue;

    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
      const batch = pending.slice(i, i + BATCH_SIZE);
      const numbered = batch.map((p, idx) => `[${idx + 1}] ${p.text}`).join("\n\n");
      const out = await chatCompletion({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content:
              `请翻译以下 ${batch.length} 段英文为中文，每段一行，按 [1] [2] ... 顺序输出，行首保留方括号编号：\n\n` +
              numbered,
          },
        ],
        temperature: 0.2,
        maxTokens: 4096,
      });
      const lines = parseNumberedResponse(out, batch.length);
      for (let j = 0; j < batch.length; j++) {
        const para = batch[j];
        if (!para) continue;
        const zh = lines[j]?.trim() || "（翻译缺失）";
        (para as DraftParagraph & { zh?: string }).zh = zh;
        cacheSet<TranslationCacheEntry>("translate", hashKey(para.text), {
          zh,
          model: process.env["OPENAI_MODEL"] ?? "unknown",
        });
        done++;
        options.onProgress?.(done, totalParas);
      }
      // Flush cache after every batch so a crash doesn't lose translation progress.
      cacheFlush();
    }
  }
}

function parseNumberedResponse(text: string, expected: number): string[] {
  // Match "[1] xxx" "[2] xxx" — robust to extra whitespace / line breaks within a paragraph.
  const re = /\[(\d+)\]\s*([\s\S]*?)(?=\n\s*\[\d+\]|$)/g;
  const out: string[] = new Array(expected).fill("");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const idx = Number(m[1]) - 1;
    if (idx >= 0 && idx < expected) {
      out[idx] = (m[2] ?? "").trim();
    }
  }
  // If the model ignored numbering, fallback: split on blank lines.
  if (out.every((s) => !s)) {
    const blocks = text.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
    for (let i = 0; i < expected; i++) {
      out[i] = blocks[i] ?? "";
    }
  }
  return out;
}
