import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeScreen } from "../components/home/home-screen";
import { ProfileScreen } from "../components/profile/profile-screen";
import { ReaderScreen } from "../components/reader/reader-screen";
import { VocabScreen } from "../components/vocab/vocab-screen";
import { buildContentBundle } from "@buildspeak/pipeline/generate-content";

const bundle = buildContentBundle();
const featuredReaderHref = `/read/${bundle.digest.featuredArticle.type}/${bundle.digest.featuredArticle.id}`;

describe("BuildSpeak screen smoke tests", () => {
  it("renders the daily digest overview", () => {
    render(<HomeScreen digest={bundle.digest} readerHref={featuredReaderHref} />);

    expect(screen.getByRole("heading", { name: /twelve new things/i })).toBeInTheDocument();
    expect(screen.getByText("Podcasts")).toBeInTheDocument();
    expect(screen.getByText("X Posts")).toBeInTheDocument();
  });

  it("renders the bilingual reader with player controls", () => {
    const article = bundle.articles.find(
      (entry) => entry.id === "podcast-no-priors-agentic-economy",
    );

    expect(article).toBeDefined();
    render(
      <ReaderScreen
        article={article!}
        readerHref={featuredReaderHref}
        streakDays={bundle.profile.streakDays}
      />,
    );

    expect(screen.getByRole("heading", { name: /the agentic economy/i })).toBeInTheDocument();
    expect(screen.getByText(/shadowing mode/i)).toBeInTheDocument();
    expect(screen.getByText(/stablecoins are the native money layer/i)).toBeInTheDocument();
  });

  it("renders the vocabulary notebook summary", () => {
    render(
      <VocabScreen
        snapshot={bundle.vocabulary}
        readerHref={featuredReaderHref}
        streakDays={bundle.profile.streakDays}
      />,
    );

    expect(screen.getByRole("heading", { name: /vocabulary notebook/i })).toBeInTheDocument();
    expect(screen.getByText("agentic")).toBeInTheDocument();
  });

  it("renders the profile progress dashboard", () => {
    render(<ProfileScreen summary={bundle.profile} readerHref={featuredReaderHref} />);

    expect(screen.getByRole("heading", { name: /your learning arc/i })).toBeInTheDocument();
    expect(screen.getAllByText(/day streak/i).length).toBeGreaterThan(0);
  });
});
