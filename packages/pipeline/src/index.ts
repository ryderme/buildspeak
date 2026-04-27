// pipeline orchestrator.
// Reads digest-*.json from repo root, writes apps/web/content/{digest,articles,words}.
//
// Default: process only the LATEST digest file (newest YYYYMMDD).
// Use `--all` to (re)process every digest — useful for backfill, prompt
// changes, or schema migrations. words.json always accumulates: existing
// entries are loaded first, then merged with newly-enriched entries.

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Article, DailyDigest, Paragraph, WordEntry } from "@buildspeak/types";
import { loadEnv } from "./env.ts";
import { parseDigest, digestDateOf, type DraftArticle, type RawDigest } from "./parse.ts";
import { translateArticles } from "./translate.ts";
import { paragraphSentences, collectKeys } from "./tokenize.ts";
import { enrichWords } from "./enrich.ts";
import { cacheFlush } from "./cache.ts";

loadEnv();

const REPO_ROOT = resolve(process.cwd(), "../..");
const WEB_CONTENT = resolve(REPO_ROOT, "apps/web/content");
const DIGEST_DIR = resolve(WEB_CONTENT, "digest");
const ARTICLES_DIR = resolve(WEB_CONTENT, "articles");
const WORDS_FILE = resolve(WEB_CONTENT, "words.json");
const LATEST_FILE = resolve(DIGEST_DIR, "latest.json");

function findDigestFiles(): string[] {
  // Sort ascending by filename (date). Caller picks latest with .at(-1).
  return readdirSync(REPO_ROOT)
    .filter((f) => /^digest-\d{8}\.json$/.test(f))
    .map((f) => resolve(REPO_ROOT, f))
    .sort();
}

function loadExistingWords(): Record<string, WordEntry> {
  if (!existsSync(WORDS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(WORDS_FILE, "utf8")) as Record<string, WordEntry>;
  } catch {
    return {};
  }
}

function progressBar(prefix: string) {
  let lastPct = -1;
  return (done: number, total: number) => {
    if (total === 0) return;
    const pct = Math.floor((done / total) * 100);
    if (pct === lastPct && done !== total) return;
    lastPct = pct;
    const filled = Math.floor(pct / 5);
    const bar = "█".repeat(filled) + "░".repeat(20 - filled);
    process.stdout.write(`\r  ${prefix} ${bar} ${pct}% (${done}/${total})`);
    if (done === total) process.stdout.write("\n");
  };
}

async function processDigest(filePath: string) {
  const fileName = filePath.split("/").pop()!;
  console.log(`\n[1/5] Reading ${fileName}…`);
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as RawDigest;
  const date = digestDateOf(raw);

  console.log(`[2/5] Parsing into articles…`);
  const drafts = parseDigest(raw);
  console.log(`      ${drafts.length} articles, ${drafts.reduce((n, d) => n + d.paragraphs.length, 0)} paragraphs`);

  console.log(`[3/5] Translating paragraphs (en → zh)…`);
  await translateArticles(drafts, { onProgress: progressBar("translate") });

  console.log(`[4/5] Tokenizing + collecting unique words…`);
  const finalArticles: Article[] = drafts.map((d) => buildArticle(d));
  cacheFlush();

  // Collect unique word keys across all articles
  const allKeys = new Set<string>();
  for (const a of finalArticles) {
    for (const p of a.paragraphs) {
      for (const k of collectKeys(p.sentences)) allKeys.add(k);
    }
  }
  console.log(`      ${allKeys.size} unique word keys`);

  console.log(`[5/5] Enriching words (IPA + 中文)…`);
  const wordEntries = await enrichWords(allKeys, { onProgress: progressBar("enrich") });
  cacheFlush();

  // Write output
  mkdirSync(DIGEST_DIR, { recursive: true });
  mkdirSync(ARTICLES_DIR, { recursive: true });

  const podcasts = finalArticles.filter((a) => a.type === "podcast");
  const tweets = finalArticles.filter((a) => a.type === "tweet");
  const blogs = finalArticles.filter((a) => a.type === "blog");

  // Sort all by publishedAt desc
  const byDate = (a: Article, b: Article) => b.publishedAt.localeCompare(a.publishedAt);
  podcasts.sort(byDate);
  tweets.sort(byDate);
  blogs.sort(byDate);

  const tweetCount = tweets.reduce((n, t) => n + t.paragraphs.length, 0);

  const digest: DailyDigest = {
    date,
    generatedAt: raw.generatedAt,
    podcasts,
    tweets,
    blogs,
    stats: {
      podcastCount: podcasts.length,
      builderCount: tweets.length,
      tweetCount,
      blogCount: blogs.length,
    },
  };

  // Per-article files (smaller payload per route)
  for (const a of finalArticles) {
    writeFileSync(resolve(ARTICLES_DIR, `${a.id}.json`), JSON.stringify(a, null, 2));
  }
  // Daily digest (lightweight: omit full paragraphs to keep Home payload small)
  const digestLite: DailyDigest = {
    ...digest,
    podcasts: podcasts.map(stripContent),
    tweets: tweets.map(stripContent),
    blogs: blogs.map(stripContent),
  };
  writeFileSync(resolve(DIGEST_DIR, `${date}.json`), JSON.stringify(digestLite, null, 2));
  writeFileSync(LATEST_FILE, JSON.stringify(digestLite, null, 2));

  // Words index (key → entry) — merge existing entries so previous days' words are preserved.
  const wordsObj = loadExistingWords();
  let added = 0;
  for (const [k, v] of wordEntries) {
    if (!wordsObj[k]) added++;
    wordsObj[k] = v;
  }
  writeFileSync(WORDS_FILE, JSON.stringify(wordsObj));

  console.log(
    `\n✓ Wrote ${finalArticles.length} articles + digest/${date}.json + words.json (+${added} new, ${Object.keys(wordsObj).length} total)`,
  );
}

function buildArticle(d: DraftArticle): Article {
  const paragraphs: Paragraph[] = d.paragraphs.map((p, idx) => {
    const id = `${d.id}-p${idx}`;
    const sentences = paragraphSentences(id, p.text);
    const zh = (p as typeof p & { zh?: string }).zh ?? "";
    return {
      id,
      speaker: p.speaker,
      timecode: p.timecode,
      sentences,
      zh,
    };
  });
  // Build wordCount from sentences
  let wordCount = 0;
  for (const p of paragraphs) {
    for (const s of p.sentences) {
      for (const t of s.tokens) if (t.kind === "word") wordCount++;
    }
  }
  const article: Article = {
    id: d.id,
    type: d.type,
    sourceName: d.sourceName,
    sourceHandle: d.sourceHandle,
    sourceBio: d.sourceBio,
    title: d.title,
    url: d.url,
    publishedAt: d.publishedAt,
    paragraphs,
    wordCount,
  };
  if (d.engagement) article.engagement = d.engagement;
  // Stash tweet meta into paragraphs for the renderer
  for (let i = 0; i < d.paragraphs.length; i++) {
    const meta = d.paragraphs[i]?.meta;
    if (meta) {
      // attach to paragraph object via a sidecar property
      (article.paragraphs[i] as Paragraph & { meta?: typeof meta }).meta = meta;
    }
  }
  return article;
}

/** For digest manifest: keep stats but drop full paragraph content. */
function stripContent(a: Article): Article {
  return {
    ...a,
    paragraphs: [], // The home page only needs metadata; reader fetches the article file.
  };
}

async function main() {
  const files = findDigestFiles();
  if (!files.length) {
    console.error("No digest-*.json found in repo root");
    process.exit(1);
  }
  const all = process.argv.includes("--all");
  const targets = all ? files : [files.at(-1)!];
  if (!all) {
    console.log(
      `Processing latest only (${targets[0]!.split("/").pop()}) — pass --all to (re)process every digest.`,
    );
  } else {
    console.log(`Processing all ${files.length} digests (--all).`);
  }
  for (const f of targets) {
    await processDigest(f);
  }
}

main().catch((err) => {
  console.error("\nPipeline failed:", err);
  process.exit(1);
});
