// parse.ts — turn raw digest-*.json sections into Article scaffolds (no zh, no tokens yet).

import type { Article } from "@buildspeak/types";

export interface RawDigest {
  generatedAt: string;
  config: { language: string; frequency: string };
  podcasts: RawPodcast[];
  x: RawXBuilder[];
  blogs: RawBlog[];
  stats: { feedGeneratedAt?: string };
}

interface RawPodcast {
  source: "podcast";
  name: string;
  title: string;
  guid: string;
  url: string;
  publishedAt: string;
  transcript: string;
}

interface RawTweet {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  likes: number;
  retweets: number;
  replies: number;
}

interface RawXBuilder {
  source: "x";
  name: string;
  handle: string;
  bio: string;
  tweets: RawTweet[];
}

interface RawBlog {
  source: "blog";
  name: string;
  title: string;
  url: string;
  publishedAt: string;
  author?: string;
  description?: string;
  content: string;
}

/** Articles before translation/tokenization — paragraphs only contain raw English text. */
export interface DraftArticle {
  id: string;
  type: Article["type"];
  sourceName: string;
  sourceHandle?: string;
  sourceBio?: string;
  title: string;
  url: string;
  publishedAt: string;
  paragraphs: DraftParagraph[];
  engagement?: Article["engagement"];
}

export interface DraftParagraph {
  speaker?: string;
  timecode?: string;
  /** Plain English paragraph text (may contain multiple sentences). */
  text: string;
  /** Optional URL stamp (used for tweet timestamps). */
  meta?: { likes: number; retweets: number; replies: number; createdAt: string; tweetUrl: string };
}

const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/* ----------------------- Podcast ----------------------- */

const SPEAKER_RE = /^(Speaker\s+\d+|[A-Z][\w. ]{1,40})\s*\|\s*(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})\s*$/;

function parsePodcast(raw: RawPodcast): DraftArticle {
  const paragraphs: DraftParagraph[] = [];
  // Split transcript on blank lines — each block starts with a "Speaker N | MM:SS - MM:SS" header
  // followed by the spoken text on the next line(s).
  const blocks = raw.transcript.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const lines = block.split("\n");
    const firstLine = lines[0]?.trim() ?? "";
    const match = firstLine.match(SPEAKER_RE);
    if (match) {
      const speaker = match[1]?.trim();
      const timecode = match[2]?.trim();
      const text = lines.slice(1).join(" ").replace(/\s+/g, " ").trim();
      if (text) paragraphs.push({ speaker, timecode, text });
    } else {
      // No header — treat whole block as continuation
      const text = block.replace(/\s+/g, " ").trim();
      if (text) paragraphs.push({ text });
    }
  }
  return {
    id: `podcast-${slugify(raw.name)}-${slugify(raw.title)}`,
    type: "podcast",
    sourceName: raw.name,
    title: raw.title,
    url: raw.url,
    publishedAt: raw.publishedAt,
    paragraphs,
  };
}

/* ----------------------- X / Twitter ----------------------- */

function parseXBuilder(raw: RawXBuilder): DraftArticle | null {
  if (!raw.tweets.length) return null;
  const paragraphs: DraftParagraph[] = raw.tweets.map((t) => ({
    text: cleanTweetText(t.text),
    meta: {
      likes: t.likes,
      retweets: t.retweets,
      replies: t.replies,
      createdAt: t.createdAt,
      tweetUrl: t.url,
    },
  }));
  // Aggregate engagement across this builder's tweets for the home card stats.
  const engagement = raw.tweets.reduce(
    (a, t) => ({ likes: a.likes + t.likes, retweets: a.retweets + t.retweets, replies: a.replies + t.replies }),
    { likes: 0, retweets: 0, replies: 0 },
  );
  // Use the most recent tweet as publishedAt for sorting.
  const publishedAt = raw.tweets
    .map((t) => t.createdAt)
    .sort()
    .at(-1) ?? new Date().toISOString();
  return {
    id: `x-${slugify(raw.handle)}`,
    type: "tweet",
    sourceName: raw.name,
    sourceHandle: `@${raw.handle}`,
    sourceBio: raw.bio,
    title: `${raw.name} · @${raw.handle}`,
    url: `https://x.com/${raw.handle}`,
    publishedAt,
    paragraphs,
    engagement,
  };
}

function cleanTweetText(text: string): string {
  // Drop trailing t.co media URLs (twitter's own image attachments) but keep regular URLs.
  return text
    .replace(/https?:\/\/t\.co\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ----------------------- Blog ----------------------- */

function parseBlog(raw: RawBlog): DraftArticle {
  // Blog content may be raw HTML. Strip tags conservatively, then split on double newlines.
  const stripped = raw.content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/p>|<br\s*\/?>/gi, "\n\n")
    .replace(/<\/h[1-6]>|<\/li>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  const paragraphs: DraftParagraph[] = stripped
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length >= 20)
    .map((text) => ({ text }));

  return {
    id: `blog-${slugify(raw.name)}-${slugify(raw.title)}`,
    type: "blog",
    sourceName: raw.name,
    title: raw.title,
    url: raw.url,
    publishedAt: raw.publishedAt,
    paragraphs,
  };
}

/* ----------------------- Top-level ----------------------- */

export function parseDigest(raw: RawDigest): DraftArticle[] {
  const out: DraftArticle[] = [];
  for (const p of raw.podcasts) out.push(parsePodcast(p));
  for (const b of raw.x) {
    const a = parseXBuilder(b);
    if (a) out.push(a);
  }
  for (const b of raw.blogs) out.push(parseBlog(b));
  return out;
}

export function digestDateOf(raw: RawDigest): string {
  // YYYY-MM-DD from generatedAt
  return raw.generatedAt.slice(0, 10);
}
