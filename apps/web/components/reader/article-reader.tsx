"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Article, Paragraph, Sentence, Token, WordEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { WordPopover, type PopoverPayload } from "./word-popover";

type LangMode = "both" | "en" | "zh";

interface ParagraphMeta {
  likes: number;
  retweets: number;
  replies: number;
  createdAt: string;
  tweetUrl: string;
}

export function ArticleReader({
  article,
  words,
}: {
  article: Article;
  words: Record<string, WordEntry>;
}) {
  const [lang, setLang] = useState<LangMode>("both");
  const [popover, setPopover] = useState<PopoverPayload | null>(null);
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const [isPlayingArticle, setIsPlayingArticle] = useState(false);

  const allSentencesRef = useRef<Sentence[]>([]);
  const playQueueRef = useRef<{ sentences: Sentence[]; index: number } | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Flatten all sentences for full-article playback.
  useEffect(() => {
    allSentencesRef.current = article.paragraphs.flatMap((p) => p.sentences);
  }, [article]);

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingSentenceId(null);
    setIsPlayingArticle(false);
    playQueueRef.current = null;
    utterRef.current = null;
  };

  const speakSentences = (sentences: Sentence[], startIndex: number = 0) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("当前浏览器不支持朗读功能");
      return;
    }
    stopSpeaking();
    playQueueRef.current = { sentences, index: startIndex };
    setIsPlayingArticle(sentences.length > 1);
    speakNext();
  };

  const speakNext = () => {
    const queue = playQueueRef.current;
    if (!queue) return;
    if (queue.index >= queue.sentences.length) {
      setPlayingSentenceId(null);
      setIsPlayingArticle(false);
      playQueueRef.current = null;
      return;
    }
    const sentence = queue.sentences[queue.index]!;
    setPlayingSentenceId(sentence.id);
    const utter = new SpeechSynthesisUtterance(sentence.text);
    utter.lang = "en-US";
    utter.rate = 0.95;
    utter.onend = () => {
      // Guard: only advance if we're still the active utterance.
      if (utterRef.current !== utter) return;
      const q = playQueueRef.current;
      if (!q) return;
      q.index += 1;
      speakNext();
    };
    utter.onerror = () => {
      stopSpeaking();
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  // Cleanup on unmount.
  useEffect(() => {
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts: space = play/pause toggle for full article, ←/→ skip sentence.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (playQueueRef.current) {
          stopSpeaking();
        } else {
          speakSentences(allSentencesRef.current, 0);
        }
      } else if (e.key === "ArrowRight") {
        const q = playQueueRef.current;
        if (q) {
          q.index += 1;
          window.speechSynthesis.cancel();
          // onend won't fire after cancel — advance manually
          speakNext();
        }
      } else if (e.key === "ArrowLeft") {
        const q = playQueueRef.current;
        if (q && q.index > 0) {
          q.index -= 1;
          window.speechSynthesis.cancel();
          speakNext();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showEn = lang === "en" || lang === "both";
  const showZh = lang === "zh" || lang === "both";

  return (
    <article className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (isPlayingArticle) stopSpeaking();
            else speakSentences(allSentencesRef.current, 0);
          }}
          className="rounded-full bg-[color:var(--color-fg)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          {isPlayingArticle ? "■ 停止" : "▶ 播放全文"}
        </button>
        <LangToggle value={lang} onChange={setLang} />
        <span className="ml-auto text-xs text-[color:var(--color-muted)]">
          空格 播放/停止 · ← → 切句
        </span>
      </div>

      <header className="mb-6">
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
          {labelOf(article.type)} · {article.sourceName}
        </div>
        <h1 className="text-2xl font-semibold leading-tight">{article.title}</h1>
      </header>

      <div className="space-y-7">
        {article.paragraphs.map((p) => (
          <ParagraphBlock
            key={p.id}
            paragraph={p}
            article={article}
            words={words}
            showEn={showEn}
            showZh={showZh}
            playingSentenceId={playingSentenceId}
            onWordClick={setPopover}
            onPlayParagraph={() => speakSentences(p.sentences, 0)}
          />
        ))}
      </div>

      <footer className="mt-12 border-t border-black/5 pt-6 text-xs text-[color:var(--color-muted)]">
        原文：<a href={article.url} target="_blank" rel="noreferrer" className="text-[color:var(--color-accent)] underline">
          {article.url}
        </a>
      </footer>

      {popover && (
        <WordPopover
          payload={popover}
          onClose={() => setPopover(null)}
          wordEntry={words[popover.key]}
        />
      )}
    </article>
  );
}

function ParagraphBlock({
  paragraph,
  article,
  words,
  showEn,
  showZh,
  playingSentenceId,
  onWordClick,
  onPlayParagraph,
}: {
  paragraph: Paragraph & { meta?: ParagraphMeta };
  article: Article;
  words: Record<string, WordEntry>;
  showEn: boolean;
  showZh: boolean;
  playingSentenceId: string | null;
  onWordClick: (p: PopoverPayload) => void;
  onPlayParagraph: () => void;
}) {
  return (
    <div className="group">
      {(paragraph.speaker || paragraph.timecode) && (
        <div className="mb-1 flex items-center gap-3 text-xs font-medium text-[color:var(--color-muted)]">
          {paragraph.speaker && <span>{paragraph.speaker}</span>}
          {paragraph.timecode && <span className="font-mono">{paragraph.timecode}</span>}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        {showEn && (
          <div className="reader-en">
            <button
              type="button"
              onClick={onPlayParagraph}
              aria-label="朗读这段"
              className="float-right ml-2 hidden text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] group-hover:inline-block"
            >
              ▶
            </button>
            {paragraph.sentences.map((s) => (
              <SentenceSpan
                key={s.id}
                sentence={s}
                article={article}
                words={words}
                playing={playingSentenceId === s.id}
                onWordClick={onWordClick}
              />
            ))}
          </div>
        )}
        {showZh && paragraph.zh && (
          <div className="reader-zh">{paragraph.zh}</div>
        )}
      </div>

      {paragraph.meta && (
        <div className="mt-2 flex items-center gap-4 text-xs text-[color:var(--color-muted)]">
          <span>♥ {paragraph.meta.likes}</span>
          <span>↻ {paragraph.meta.retweets}</span>
          <span>💬 {paragraph.meta.replies}</span>
          <a
            href={paragraph.meta.tweetUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto hover:text-[color:var(--color-accent)]"
          >
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
    <span className={`sentence ${playing ? "is-playing" : ""}`}>
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
  words,
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
  // word
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
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
  };
  return (
    <span className={`word ${has ? "is-vocab" : ""}`} onClick={handleClick}>
      {token.text}
    </span>
  );
}

function LangToggle({ value, onChange }: { value: LangMode; onChange: (v: LangMode) => void }) {
  const opts: Array<{ key: LangMode; label: string }> = [
    { key: "both", label: "双语" },
    { key: "en", label: "仅英文" },
    { key: "zh", label: "仅中文" },
  ];
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-0.5 text-xs">
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          className={`rounded-full px-3 py-1 transition ${
            value === o.key
              ? "bg-[color:var(--color-fg)] text-white"
              : "text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function labelOf(t: Article["type"]): string {
  return t === "podcast" ? "PODCAST" : t === "tweet" ? "X / TWITTER" : "BLOG";
}
