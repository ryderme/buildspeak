import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildContentBundle, writeContentBundle } from "@buildspeak/pipeline/generate-content";
import {
  getAllReaderRoutes,
  getDailyDigest,
  getProfileSummary,
  getReaderArticle,
  getVocabularySnapshot,
} from "../lib/content";

const cleanupDirs: string[] = [];

afterEach(async () => {
  await Promise.all(
    cleanupDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("pipeline content bundle", () => {
  it("normalizes the subscription feed into digest and reader articles", () => {
    const bundle = buildContentBundle();

    expect(bundle.digest.tabs).toEqual([
      { id: "podcast", label: "Podcasts", count: 1 },
      { id: "x", label: "X Posts", count: 17 },
      { id: "blog", label: "Blogs", count: 1 },
    ]);
    expect(bundle.articles).toHaveLength(19);
    expect(bundle.digest.featuredArticle.id).toBe("podcast-no-priors-agentic-economy");
    expect(bundle.profile.totalArticles).toBe(19);
  });

  it("writes the normalized bundle into web content json files", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "buildspeak-content-"));
    cleanupDirs.push(rootDir);
    await mkdir(join(rootDir, "apps", "web"), { recursive: true });

    await writeContentBundle(buildContentBundle(), rootDir);

    const digestJson = JSON.parse(
      await readFile(join(rootDir, "apps", "web", "content", "digest", "latest.json"), "utf8"),
    );
    const articleJson = JSON.parse(
      await readFile(
        join(
          rootDir,
          "apps",
          "web",
          "content",
          "articles",
          "podcast-no-priors-agentic-economy.json",
        ),
        "utf8",
      ),
    );

    expect(digestJson.featuredArticle.id).toBe("podcast-no-priors-agentic-economy");
    expect(articleJson.source.name).toBe("No Priors");
  });
});

describe("web content loader", () => {
  it("reads digest, article, vocab, and profile data from generated content files", async () => {
    const rootDir = await mkdtemp(join(tmpdir(), "buildspeak-loader-"));
    cleanupDirs.push(rootDir);
    await mkdir(join(rootDir, "apps", "web"), { recursive: true });

    await writeContentBundle(buildContentBundle(), rootDir);

    const digest = await getDailyDigest(rootDir);
    const article = await getReaderArticle("podcast", "podcast-no-priors-agentic-economy", rootDir);
    const vocab = await getVocabularySnapshot(rootDir);
    const profile = await getProfileSummary(rootDir);
    const routes = await getAllReaderRoutes(rootDir);

    expect(digest.featuredArticle.id).toBe("podcast-no-priors-agentic-economy");
    expect(article?.sourceUrl).toContain("youtube.com");
    expect(vocab.entries[0]?.lemma).toBe("agentic");
    expect(profile.totalArticles).toBe(19);
    expect(routes).toContainEqual({
      type: "podcast",
      id: "podcast-no-priors-agentic-economy",
    });
  });
});
