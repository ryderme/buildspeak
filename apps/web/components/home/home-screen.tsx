"use client";

import type { ArticlePreview, ArticleType, DailyDigest } from "@buildspeak/types";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell/app-shell";

type HomeScreenProps = {
  digest: DailyDigest;
  readerHref: string;
};

const typeLabels: Record<ArticleType, string> = {
  podcast: "Podcast",
  x: "X Post",
  blog: "Blog",
};

const articleHref = (article: ArticlePreview) => `/read/${article.type}/${article.id}`;

const ArticleCard = ({ article, featured }: { article: ArticlePreview; featured?: boolean }) => (
  <article
    className={`flex h-full flex-col rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-[0_18px_50px_rgba(26,26,26,0.06)] ${
      featured ? "lg:col-span-2 lg:p-7" : ""
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-serif text-lg font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${article.cover.from}, ${article.cover.to})`,
        }}
      >
        {article.cover.label}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-soft)]">
          <span>{typeLabels[article.type]}</span>
          <span>•</span>
          <span>{article.source.subtitle}</span>
        </div>
        <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.03em] text-[color:var(--ink)]">
          {article.title.en}
        </h3>
        <p className="mt-2 font-cjk text-sm leading-7 text-[color:var(--muted)]">
          {article.title.zh}
        </p>
      </div>
      <div className="rounded-full bg-[color:var(--highlight)] px-3 py-1 text-xs font-semibold text-[color:var(--ink)]">
        ⚡ {article.stats.newWords} 新词
      </div>
    </div>

    <p className="mt-5 flex-1 font-serif text-lg leading-8 text-[color:var(--ink)]">
      “{article.quote}”
    </p>

    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
      <span>{article.source.name}</span>
      <span>·</span>
      <span>{article.stats.readMinutes} min read</span>
      {article.stats.duration ? (
        <>
          <span>·</span>
          <span>{article.stats.duration}</span>
        </>
      ) : null}
      <span>·</span>
      <span>Lv. {article.stats.level}</span>
    </div>

    <Link
      href={articleHref(article)}
      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--ink)] px-5 py-3 text-sm font-semibold text-[color:var(--paper)] transition hover:bg-[color:var(--accent)]"
    >
      Start reading
      <span aria-hidden="true">→</span>
    </Link>
  </article>
);

export const HomeScreen = ({ digest, readerHref }: HomeScreenProps) => {
  const [activeTab, setActiveTab] = useState<ArticleType>("podcast");
  const activeArticles = useMemo(
    () => digest.sections[activeTab],
    [activeTab, digest.sections],
  );

  return (
    <AppShell
      active="home"
      readerHref={readerHref}
      streakDays={digest.hero.streakDays}
    >
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[color:var(--muted-soft)]">
            Daily digest · {digest.dateLabel}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[color:var(--ink)] sm:text-6xl">
            Twelve new things the AI builders{" "}
            <span className="text-[color:var(--accent)] italic">said out loud</span>{" "}
            today.
          </h1>
          <p className="mt-5 max-w-3xl font-cjk text-base leading-8 text-[color:var(--muted)] sm:text-lg">
            {digest.hero.subtitle}
          </p>
        </div>

        <aside className="rounded-[28px] border border-[color:var(--border)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
            <span>Today&apos;s reading</span>
            <span>
              {digest.hero.todayMinutes}/{digest.hero.targetMinutes}m
            </span>
          </div>
          <div className="mt-4 h-2 rounded-full bg-[color:var(--chip)]">
            <div
              className="h-full rounded-full bg-[color:var(--accent)]"
              style={{
                width: `${(digest.hero.todayMinutes / digest.hero.targetMinutes) * 100}%`,
              }}
            />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "new words", value: digest.hero.wordsToday },
              { label: "review", value: digest.hero.reviewQueue },
              { label: "streak", value: digest.hero.streakDays },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[color:var(--panel-soft)] px-3 py-4">
                <div className="font-serif text-3xl tracking-[-0.04em] text-[color:var(--ink)]">
                  {item.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-soft)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--border)] pb-4">
          {digest.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                  : "bg-transparent text-[color:var(--muted)] hover:bg-white"
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-80">{tab.count}</span>
            </button>
          ))}
          <div className="ml-auto flex gap-3 text-sm text-[color:var(--muted)]">
            <span className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2">
              All levels
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2">
              Unread first
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {activeArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={index === 0}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
};
