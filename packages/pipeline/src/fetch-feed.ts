// fetch-feed.ts — pulls the 3 public follow-builders feeds and composes them
// into a digest-YYYY-MM-DD.json file at the repo root, matching the shape that
// parse.ts already understands.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { RawDigest } from "./parse.ts";
import { posthog, PIPELINE_DISTINCT_ID } from "./posthog.ts";

const FEED_BASE = "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main";
const FEED_X_URL = `${FEED_BASE}/feed-x.json`;
const FEED_PODCASTS_URL = `${FEED_BASE}/feed-podcasts.json`;
const FEED_BLOGS_URL = `${FEED_BASE}/feed-blogs.json`;

interface FeedX { generatedAt?: string; x?: unknown[] }
interface FeedPodcasts { generatedAt?: string; podcasts?: unknown[] }
interface FeedBlogs { generatedAt?: string; blogs?: unknown[] }

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { "User-Agent": "buildspeak-pipeline" } });
  if (!res.ok) {
    throw new Error(`Fetch ${url} failed: HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

function todayISO(): string {
  return new Date().toISOString();
}

function todayStamp(): string {
  // YYYYMMDD for the digest filename
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

export async function fetchAndWriteDigest(): Promise<string> {
  console.log("Fetching public feeds…");
  const [x, podcasts, blogs] = await Promise.all([
    fetchJson<FeedX>(FEED_X_URL),
    fetchJson<FeedPodcasts>(FEED_PODCASTS_URL),
    fetchJson<FeedBlogs>(FEED_BLOGS_URL),
  ]);

  const digest: RawDigest = {
    generatedAt: todayISO(),
    config: { language: "bilingual", frequency: "daily" },
    podcasts: (podcasts.podcasts ?? []) as RawDigest["podcasts"],
    x: (x.x ?? []) as RawDigest["x"],
    blogs: (blogs.blogs ?? []) as RawDigest["blogs"],
    stats: {
      feedGeneratedAt:
        (x.generatedAt as string) || (podcasts.generatedAt as string) || todayISO(),
    },
  };

  const repoRoot = resolve(process.cwd(), "../..");
  const out = resolve(repoRoot, `digest-${todayStamp()}.json`);
  writeFileSync(out, JSON.stringify(digest, null, 2));

  console.log(`✓ Wrote ${out}`);
  console.log(
    `  podcasts: ${digest.podcasts.length}, x builders: ${digest.x.length}, blogs: ${digest.blogs.length}`,
  );

  posthog.capture({
    distinctId: PIPELINE_DISTINCT_ID,
    event: "feed_fetched",
    properties: {
      podcast_count: digest.podcasts.length,
      x_builder_count: digest.x.length,
      blog_count: digest.blogs.length,
      output_file: out,
    },
  });
  await posthog.shutdown();

  return out;
}

// CLI entry: `tsx fetch-feed.ts`
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAndWriteDigest().catch((err) => {
    console.error("fetch-feed failed:", err);
    process.exit(1);
  });
}
