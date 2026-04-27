import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Article, DailyDigest, WordEntry } from "@buildspeak/types";

const CONTENT = resolve(process.cwd(), "content");

export function loadLatestDigest(): DailyDigest {
  const path = resolve(CONTENT, "digest", "latest.json");
  return JSON.parse(readFileSync(path, "utf8")) as DailyDigest;
}

export function loadDigestByDate(date: string): DailyDigest | null {
  const path = resolve(CONTENT, "digest", `${date}.json`);
  try {
    return JSON.parse(readFileSync(path, "utf8")) as DailyDigest;
  } catch {
    return null;
  }
}

export function listAvailableDates(): string[] {
  try {
    return readdirSync(resolve(CONTENT, "digest"))
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .map((f) => f.slice(0, 10))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

/** Returns the date adjacent to `date` in the available list (prev/next).
 *  Dates are stored newest-first; `prev` = older, `next` = newer. */
export function adjacentDates(date: string): { prev: string | null; next: string | null } {
  const all = listAvailableDates();
  const idx = all.indexOf(date);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: all[idx + 1] ?? null, // older
    next: all[idx - 1] ?? null, // newer
  };
}

export function loadArticle(id: string): Article | null {
  try {
    const raw = readFileSync(resolve(CONTENT, "articles", `${id}.json`), "utf8");
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}

export function listArticleIds(): string[] {
  try {
    return readdirSync(resolve(CONTENT, "articles"))
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

/** All known X handles, including both the lowercased article-id form and the
 *  original-case display form (e.g. both `amandaaskell` and `AmandaAskell`).
 *  Used for generateStaticParams so users can visit /b/<handle> in either case. */
export function listBuilderHandles(): string[] {
  const set = new Set<string>();
  for (const id of listArticleIds()) {
    const match = id.match(/^x-(.+?)-\d{4}-\d{2}-\d{2}$/);
    if (!match || !match[1]) continue;
    set.add(match[1]); // lowercase form (matches the article id)
    const article = loadArticle(id);
    const display = article?.sourceHandle?.replace(/^@/, "");
    if (display) set.add(display); // original casing (e.g. AmandaAskell)
  }
  return [...set].sort();
}

/** Load every article for a given X handle, case-insensitive.
 *  Article ids are stored lowercased, so we lowercase the lookup. */
export function loadBuilderArticles(handle: string): Article[] {
  const needle = handle.toLowerCase();
  const out: Article[] = [];
  for (const id of listArticleIds()) {
    if (!id.startsWith(`x-${needle}-`)) continue;
    const a = loadArticle(id);
    if (a) out.push(a);
  }
  out.sort((a, b) => b.digestDate.localeCompare(a.digestDate));
  return out;
}

let _words: Record<string, WordEntry> | null = null;
export function loadWords(): Record<string, WordEntry> {
  if (_words) return _words;
  _words = JSON.parse(readFileSync(resolve(CONTENT, "words.json"), "utf8")) as Record<string, WordEntry>;
  return _words;
}

/** Filter the global word index down to entries actually referenced by an
 *  article. Crucial for keeping per-page payloads small — words.json grows
 *  unbounded as the archive accumulates. */
export function pickWordsFor(articles: Article[]): Record<string, WordEntry> {
  const all = loadWords();
  const subset: Record<string, WordEntry> = {};
  for (const article of articles) {
    for (const p of article.paragraphs) {
      for (const s of p.sentences) {
        for (const t of s.tokens) {
          if (t.kind !== "word" || !t.key) continue;
          const entry = all[t.key];
          if (entry && !(t.key in subset)) {
            subset[t.key] = entry;
          }
        }
      }
    }
  }
  return subset;
}
