"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article, Paragraph, Sentence, Token, WordEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { WordPopover, type PopoverPayload } from "./word-popover";

export function BuilderTimeline({
  articles,
  words,
}: {
  articles: Article[];
  words: Record<string, WordEntry>;
}) {
  const [popover, setPopover] = useState<PopoverPayload | null>(null);

  if (!articles.length) {
    return (
      <main className="page page-narrow">
        <div className="empty-state">
          <div className="empty-state-icon">🐦</div>
          <p className="empty-state-text">
            No content for this builder.
            <span className="empty-state-text-zh">这位 builder 还没有内容。</span>
          </p>
        </div>
      </main>
    );
  }

  const first = articles[0]!;
  const handle = (first.sourceHandle ?? "").replace(/^@/, "");
  const initials = computeInitials(first.sourceName);
  const color = colorForHandle(handle);
  const totalPosts = articles.reduce((n, a) => n + a.paragraphs.length, 0);
  const todayPosts = first.paragraphs.length;

  return (
    <main className="page page-narrow">
      <header className="builder-profile-header">
        <div className="builder-profile-avatar" style={{ background: color }}>
          {initials}
        </div>
        <div>
          <h1 className="builder-profile-name">{first.sourceName}</h1>
          <a
            href={first.url}
            target="_blank"
            rel="noreferrer"
            className="builder-profile-handle"
            style={{ color: "var(--color-ink-mute)", borderBottom: 0 }}
          >
            @{handle} ↗
          </a>
          {first.sourceBio && (
            <p className="builder-profile-bio">{first.sourceBio.split("\n")[0]}</p>
          )}
          <div className="builder-profile-stats">
            <span>
              <strong>{todayPosts}</strong> POSTS LATEST
            </span>
            <span>
              <strong>{totalPosts}</strong> ALL TIME
            </span>
            <span>
              <strong>{articles.length}</strong> ISSUES
            </span>
          </div>
        </div>
      </header>

      {articles.map((a) => (
        <DaySection key={a.id} article={a} words={words} onWordClick={setPopover} />
      ))}

      {popover && (
        <WordPopover
          payload={popover}
          onClose={() => setPopover(null)}
          wordEntry={words[popover.key]}
        />
      )}
    </main>
  );
}

function DaySection({
  article,
  words,
  onWordClick,
}: {
  article: Article;
  words: Record<string, WordEntry>;
  onWordClick: (p: PopoverPayload) => void;
}) {
  return (
    <>
      <div className="date-divider">
        <Link
          href={`/d/${article.digestDate}`}
          style={{ color: "inherit", borderBottom: 0 }}
        >
          {formatDateZh(article.digestDate)} ·  {article.paragraphs.length} 条 →
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
        {article.paragraphs.map((p) => (
          <ParagraphCard
            key={p.id}
            paragraph={p}
            article={article}
            words={words}
            onWordClick={onWordClick}
          />
        ))}
      </div>
    </>
  );
}

function ParagraphCard({
  paragraph,
  article,
  words,
  onWordClick,
}: {
  paragraph: Paragraph;
  article: Article;
  words: Record<string, WordEntry>;
  onWordClick: (p: PopoverPayload) => void;
}) {
  return (
    <article
      className="builder-card"
      style={{ borderLeft: "3px solid var(--tint-tweet-edge)" }}
    >
      <div className="tweet-item">
        <p className="tweet-en" style={{ fontSize: 17 }}>
          {paragraph.sentences.map((s) => (
            <SentenceMark
              key={s.id}
              sentence={s}
              article={article}
              words={words}
              onWordClick={onWordClick}
            />
          ))}
        </p>
        {paragraph.zh && <p className="tweet-zh">{paragraph.zh}</p>}
        {paragraph.meta && (
          <div className="engagement-row">
            <span>♥ {fmtNum(paragraph.meta.likes)}</span>
            <span>↻ {fmtNum(paragraph.meta.retweets)}</span>
            <span>💬 {fmtNum(paragraph.meta.replies)}</span>
            <span style={{ marginLeft: "auto" }}>{shortTime(paragraph.meta.createdAt)}</span>
            <a
              href={paragraph.meta.tweetUrl}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              x.com ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

function SentenceMark({
  sentence,
  article,
  words,
  onWordClick,
}: {
  sentence: Sentence;
  article: Article;
  words: Record<string, WordEntry>;
  onWordClick: (p: PopoverPayload) => void;
}) {
  return (
    <span className="sentence-mark">
      {sentence.tokens.map((t, i) => (
        <TokenSpan
          key={i}
          token={t}
          sentence={sentence}
          article={article}
          words={words}
          onWordClick={onWordClick}
        />
      ))}{" "}
    </span>
  );
}

function TokenSpan({
  token,
  sentence,
  article,
  onWordClick,
}: {
  token: Token;
  sentence: Sentence;
  article: Article;
  words: Record<string, WordEntry>;
  onWordClick: (p: PopoverPayload) => void;
}) {
  const has = useVocab((s) => (token.kind === "word" && token.key ? s.has(token.key) : false));
  if (token.kind === "space") return <>{token.text}</>;
  if (token.kind === "punct") return <span>{token.text}</span>;
  return (
    <span
      className="word-chip"
      data-state={has ? "in-vocab" : undefined}
      tabIndex={0}
      role="button"
      onClick={(e) => {
        if (!token.key) return;
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onWordClick({
          surface: token.text,
          key: token.key,
          rect,
          sentence: sentence.text,
          articleId: article.id,
          articleTitle: article.title,
        });
      }}
    >
      {token.text}
    </span>
  );
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0] ?? "?").slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

const HANDLE_COLORS = ["#1F4060", "#7A1F1F", "#2E4A2A", "#6B4A11", "#5B3A6B", "#0F4D4D"];
function colorForHandle(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  return HANDLE_COLORS[h % HANDLE_COLORS.length] ?? "#1F4060";
}

function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function shortTime(iso: string): string {
  try {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ·  ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  } catch {
    return iso.slice(0, 10);
  }
}

function formatDateZh(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}-${m}-${d}`;
}
