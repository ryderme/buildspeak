import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "../components/home/home-screen";
import { ProfileScreen } from "../components/profile/profile-screen";
import { ReaderScreen } from "../components/reader/reader-screen";
import { VocabScreen } from "../components/vocab/vocab-screen";
import {
  getDailyDigest,
  getFeaturedReaderHref,
  getProfileSummary,
  getReaderArticle,
  getVocabularySnapshot,
} from "../lib/mock-content";

describe("BuildSpeak screen smoke tests", () => {
  it("renders the daily digest overview", () => {
    render(<HomeScreen digest={getDailyDigest()} readerHref={getFeaturedReaderHref()} />);

    expect(screen.getByRole("heading", { name: /twelve new things/i })).toBeInTheDocument();
    expect(screen.getByText("Podcasts")).toBeInTheDocument();
    expect(screen.getByText("X Posts")).toBeInTheDocument();
  });

  it("renders the bilingual reader with player controls", () => {
    const article = getReaderArticle("podcast", "podcast-no-priors-agentic-economy");

    expect(article).toBeDefined();
    render(<ReaderScreen article={article!} />);

    expect(screen.getByRole("heading", { name: /the agentic economy/i })).toBeInTheDocument();
    expect(screen.getByText(/shadowing mode/i)).toBeInTheDocument();
    expect(screen.getByText(/stablecoins are the native money layer/i)).toBeInTheDocument();
  });

  it("renders the vocabulary notebook summary", () => {
    render(<VocabScreen snapshot={getVocabularySnapshot()} />);

    expect(screen.getByRole("heading", { name: /vocabulary notebook/i })).toBeInTheDocument();
    expect(screen.getByText("agentic")).toBeInTheDocument();
  });

  it("renders the profile progress dashboard", () => {
    render(<ProfileScreen summary={getProfileSummary()} />);

    expect(screen.getByRole("heading", { name: /your learning arc/i })).toBeInTheDocument();
    expect(screen.getAllByText(/day streak/i).length).toBeGreaterThan(0);
  });
});
