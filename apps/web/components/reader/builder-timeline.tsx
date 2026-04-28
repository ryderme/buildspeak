"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Article, Paragraph, Sentence, Token, WordEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { track } from "@/lib/analytics";
import { WordPopover, type PopoverPayload } from "./word-popover";

export function BuilderTimeline({
  articles,
  words,
}: {
  articles: Article[];
  words: Record<string, WordEntry>;
}) {
  const [popover, setPopover] = useState<PopoverPayload | null>(null);
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const allSentencesRef = useRef<Sentence[]>([]);
  const playQueueRef = useRef<{ sentences: Sentence[]; index: number } | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Flatten every paragraph's sentences across every day for the global play button.
  useEffect(() => {
    allSentencesRef.current = articles.flatMap((a) => a.paragraphs.flatMap((p) => p.sentences));
  }, [articles]);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingSentenceId(null);
    setIsPlayingAll(false);
    playQueueRef.current = null;
    utterRef.current = null;
  };

  const speakNext = () => {
    const queue = playQueueRef.current;
    if (!queue) return;
    if (queue.index >= queue.sentences.length) {
      stopSpeaking();
      return;
    }
    const sentence = queue.sentences[queue.index]!;
    setPlayingSentenceId(sentence.id);
    const utter = new SpeechSynthesisUtterance(sentence.text);
    utter.lang = "en-US";
    utter.rate = 0.95;
    utter.onend = () => {
      if (utterRef.current !== utter) return;
      const q = playQueueRef.current;
      if (!q) return;
      q.index += 1;
      speakNext();
    };
    utter.onerror = stopSpeaking;
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const speakSentences = (
    sentences: Sentence[],
    startIndex = 0,
    kind: "builder_all" | "tweet" = "tweet",
  ) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("当前浏览器不支持朗读功能");
      return;
    }
    stopSpeaking();
    playQueueRef.current = { sentences, index: startIndex };
    setIsPlayingAll(kind === "builder_all");
    track("tts_played", { kind, sentence_count: sentences.length });
    speakNext();
  };

  // Cleanup
  useEffect(() => {
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard: space toggles play-all.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (playQueueRef.current) {
          stopSpeaking();
        } else {
          speakSentences(allSentencesRef.current, 0, "builder_all");
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <strong>{todayPosts}</strong> 最新
            </span>
            <span>
              <strong>{totalPosts}</strong> 累计
            </span>
            <span>
              <strong>{articles.length}</strong> 期
            </span>
          </div>
        </div>
      </header>

      <div className="reader-controls" style={{ marginTop: 0 }}>
        <button
          className="playbtn"
          data-size="primary"
          data-state={isPlayingAll ? "playing" : "idle"}
          onClick={() => {
            if (isPlayingAll) stopSpeaking();
            else speakSentences(allSentencesRef.current, 0, "builder_all");
          }}
        >
          <PlayIcon playing={isPlayingAll} />
          <span>
            {isPlayingAll ? "暂停" : `朗读 ${totalPosts} 条`}
            {!isPlayingAll && (
              <span style={{ opacity: 0.6, marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                SPACE
              </span>
            )}
          </span>
        </button>
        <span className="keyboard-hint">每条推文 hover 显示单独 ▶</span>
      </div>

      {articles.map((a) => (
        <DaySection
          key={a.id}
          article={a}
          words={words}
          playingSentenceId={playingSentenceId}
          onWordClick={setPopover}
          onPlayParagraph={(p) => speakSentences(p.sentences, 0, "tweet")}
        />
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
  playingSentenceId,
  onWordClick,
  onPlayParagraph,
}: {
  article: Article;
  words: Record<string, WordEntry>;
  playingSentenceId: string | null;
  onWordClick: (p: PopoverPayload) => void;
  onPlayParagraph: (p: Paragraph) => void;
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
            playingSentenceId={playingSentenceId}
            onWordClick={onWordClick}
            onPlay={() => onPlayParagraph(p)}
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
  playingSentenceId,
  onWordClick,
  onPlay,
}: {
  paragraph: Paragraph;
  article: Article;
  words: Record<string, WordEntry>;
  playingSentenceId: string | null;
  onWordClick: (p: PopoverPayload) => void;
  onPlay: () => void;
}) {
  const isPlaying = paragraph.sentences.some((s) => s.id === playingSentenceId);
  return (
    <article
      className="builder-card paragraph-block"
      style={{ borderLeft: "3px solid var(--tint-tweet-edge)", padding: "var(--s-5)", display: "block" }}
    >
      <div className="paragraph-controls" style={{ position: "absolute", left: "calc(-52px - 3px)" }}>
        <button
          className="playbtn"
          data-size="secondary"
          data-state={isPlaying ? "playing" : "idle"}
          aria-label="朗读这条"
          onClick={onPlay}
        >
          <PlayIcon playing={isPlaying} />
        </button>
      </div>
      <div className="tweet-item">
        <p className="tweet-en" style={{ fontSize: 17 }}>
          {paragraph.sentences.map((s) => (
            <SentenceMark
              key={s.id}
              sentence={s}
              article={article}
              words={words}
              playing={playingSentenceId === s.id}
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
  playing,
  onWordClick,
}: {
  sentence: Sentence;
  article: Article;
  words: Record<string, WordEntry>;
  playing: boolean;
  onWordClick: (p: PopoverPayload) => void;
}) {
  return (
    <span className="sentence-mark" data-playing={playing ? "true" : "false"}>
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

function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      {playing ? (
        <g>
          <rect x="2.5" y="2" width="2.5" height="8" rx="0.5" />
          <rect x="7" y="2" width="2.5" height="8" rx="0.5" />
        </g>
      ) : (
        <path d="M3 1.5 L10 6 L3 10.5 Z" />
      )}
    </svg>
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
    return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ·  ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  } catch {
    return iso.slice(0, 10);
  }
}

function formatDateZh(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}-${m}-${d}`;
}
