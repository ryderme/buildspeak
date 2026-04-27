// enrich.ts — for each unique word key, produce IPA + Chinese definition.
// IPA from CMU dict. Definitions from cache or batch GPT calls.

import type { WordEntry } from "@buildspeak/types";
import { dictionary as cmuDict } from "cmu-pronouncing-dictionary";
import { arpaToIpa } from "./arpa-to-ipa.ts";
import { chatCompletion } from "./openai.ts";
import { cacheGet, cacheSet } from "./cache.ts";

const DEF_BATCH_SIZE = 25;
const DEF_SYSTEM = `You are a concise English-Chinese dictionary. For each English word, output a short Chinese definition (no example sentences). Format strictly as JSON: {"defs": {"word1": "中文", "word2": "中文"}}. If a word is a proper noun, output its common Chinese rendering or transliteration. Keep each definition under 20 characters when possible.`;

interface CachedDef {
  zh: string;
}

export async function enrichWords(
  keys: Set<string>,
  options: { onProgress?: (done: number, total: number) => void } = {},
): Promise<Map<string, WordEntry>> {
  const result = new Map<string, WordEntry>();
  const cmu = cmuDict as Record<string, string | undefined>;

  // 1) Fill IPA from CMU.
  for (const key of keys) {
    const arpa = cmu[key];
    const ipa = arpa ? arpaToIpa(arpa) : undefined;
    result.set(key, { key, ipa });
  }

  // 2) Resolve Chinese definitions: cache first, then batched GPT calls.
  const needsDef: string[] = [];
  for (const key of keys) {
    const cached = cacheGet<CachedDef>("define", key);
    if (cached) {
      const entry = result.get(key)!;
      entry.zh = cached.zh;
    } else {
      needsDef.push(key);
    }
  }

  let done = keys.size - needsDef.length;
  options.onProgress?.(done, keys.size);

  for (let i = 0; i < needsDef.length; i += DEF_BATCH_SIZE) {
    const batch = needsDef.slice(i, i + DEF_BATCH_SIZE);
    const list = batch.map((w) => `- ${w}`).join("\n");
    let parsed: { defs?: Record<string, string> } = {};
    try {
      const out = await chatCompletion({
        messages: [
          { role: "system", content: DEF_SYSTEM },
          { role: "user", content: `Define these ${batch.length} words:\n${list}` },
        ],
        temperature: 0,
        responseFormat: "json_object",
        maxTokens: 2000,
      });
      parsed = safeJsonParse(out);
    } catch (err) {
      console.warn(`  [enrich] batch failed: ${(err as Error).message}; skipping ${batch.length} words`);
    }

    const defs = parsed.defs ?? {};
    for (const word of batch) {
      const zh = defs[word] || defs[word.toLowerCase()] || "";
      if (zh) {
        cacheSet<CachedDef>("define", word, { zh });
        const entry = result.get(word)!;
        entry.zh = zh;
      }
      done++;
      options.onProgress?.(done, keys.size);
    }
  }

  return result;
}

function safeJsonParse(s: string): { defs?: Record<string, string> } {
  // Strip markdown code fences if present.
  const cleaned = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}
