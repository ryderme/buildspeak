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

let _words: Record<string, WordEntry> | null = null;
export function loadWords(): Record<string, WordEntry> {
  if (_words) return _words;
  _words = JSON.parse(readFileSync(resolve(CONTENT, "words.json"), "utf8")) as Record<string, WordEntry>;
  return _words;
}
