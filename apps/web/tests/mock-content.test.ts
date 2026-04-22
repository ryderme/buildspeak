import { describe, expect, it } from "vitest";
import {
  getDailyDigest,
  getProfileSummary,
  getReaderArticle,
  getVocabularySnapshot,
} from "../lib/mock-content";

describe("mock content contract", () => {
  it("builds the digest counts by content tab", () => {
    const digest = getDailyDigest();

    expect(digest.tabs).toEqual([
      { id: "podcast", label: "Podcasts", count: 1 },
      { id: "x", label: "X Posts", count: 17 },
      { id: "blog", label: "Blogs", count: 1 },
    ]);
    expect(digest.featuredArticle.id).toBe("podcast-no-priors-agentic-economy");
  });

  it("resolves a reader article by typed route params", () => {
    const article = getReaderArticle("podcast", "podcast-no-priors-agentic-economy");

    expect(article?.source.name).toBe("No Priors");
    expect(article?.sentences.length ?? 0).toBeGreaterThanOrEqual(8);
    expect(getReaderArticle("blog", "missing-id")).toBeUndefined();
  });

  it("returns vocab and profile snapshots for the study loop", () => {
    const vocab = getVocabularySnapshot();
    const profile = getProfileSummary();

    expect(vocab.reviewQueue).toBeGreaterThan(0);
    expect(vocab.entries[0]?.lemma).toBe("agentic");
    expect(profile.recentActivity).toHaveLength(14);
    expect(profile.spotlight).toContain("AI");
    expect(profile.totalArticles).toBe(19);
  });
});
