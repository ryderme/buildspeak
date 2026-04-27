"use client";

import Link from "next/link";
import { useState } from "react";
import type { Article, Paragraph, Sentence, Token, WordEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { formatDateFull } from "@/lib/format";
import { WordPopover, type PopoverPayload } from "./word-popover";

interface ParagraphMeta {
  likes: number;
  retweets: number;
  replies: number;
  createdAt: string;
  tweetUrl: string;
}

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
      <div className="rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center text-sm text-[color:var(--color-muted)]">
        这位 builder 还没有内容。
      </div>
    );
  }

  const first = articles[0]!;

  return (
    <article className="mx-auto max-w-3xl px-6 py-6">
      <header className="mb-8 border-b border-black/5 pb-6">
        <div className="text-sm text-[color:var(--color-muted)]">{first.sourceHandle}</div>
        <h1 className="mt-1 text-2xl font-semibold">{first.sourceName}</h1>
        {first.sourceBio && (
          <p className="mt-3 max-w-prose whitespace-pre-line text-sm leading-relaxed text-[color:var(--color-muted)]">
            {first.sourceBio}
          </p>
        )}
        <a
          href={first.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-xs text-[color:var(--color-accent)] hover:underline"
        >
          在 X 查看 →
        </a>
      </header>

      <div className="space-y-10">
        {articles.map((a) => (
          <DaySection key={a.id} article={a} words={words} onWordClick={setPopover} />
        ))}
      </div>

      {popover && (
        <WordPopover payload={popover} onClose={() => setPopover(null)} wordEntry={words[popover.key]} />
      )}
    </article>
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
    <section>
      <h2 className="sticky top-0 z-10 mb-4 -mx-2 bg-[color:var(--color-bg)]/85 px-2 py-2 text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)] backdrop-blur">
        <Link href={`/d/${article.digestDate}`} className="hover:text-[color:var(--color-fg)]">
          {formatDateFull(article.digestDate)} ·  {article.paragraphs.length} 条
        </Link>
      </h2>
      <div className="space-y-6">
        {article.paragraphs.map((p) => (
          <ParagraphCard key={p.id} paragraph={p} article={article} words={words} onWordClick={onWordClick} />
        ))}
      </div>
    </section>
  );
}

function ParagraphCard({
  paragraph,
  article,
  words,
  onWordClick,
}: {
  paragraph: Paragraph & { meta?: ParagraphMeta };
  article: Article;
  words: Record<string, WordEntry>;
  onWordClick: (p: PopoverPayload) => void;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white/70 p-4">
      <div className="reader-en">
        {paragraph.sentences.map((s) => (
          <SentenceSpan key={s.id} sentence={s} article={article} words={words} onWordClick={onWordClick} />
        ))}
      </div>
      {paragraph.zh && <div className="reader-zh mt-3">{paragraph.zh}</div>}
      {paragraph.meta && (
        <div className="mt-3 flex items-center gap-4 text-xs text-[color:var(--color-muted)]">
          <span>♥ {paragraph.meta.likes}</span>
          <span>↻ {paragraph.meta.retweets}</span>
          <span>💬 {paragraph.meta.replies}</span>
          <a href={paragraph.meta.tweetUrl} target="_blank" rel="noreferrer" className="ml-auto hover:text-[color:var(--color-accent)]">
            原帖 ↗
          </a>
        </div>
      )}
    </div>
  );
}

function SentenceSpan({
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
    <span className="sentence">
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
      className={`word ${has ? "is-vocab" : ""}`}
      onClick={(e) => {
        if (!token.key) return;
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
