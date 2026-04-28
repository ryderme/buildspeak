"use client";

import { useEffect, useRef, useState } from "react";
import type { Article, Paragraph, Sentence, Token, WordEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { track, register, unregister } from "@/lib/analytics";
import { WordPopover, type PopoverPayload } from "./word-popover";

type LangMode = "both" | "en" | "zh";

const TYPE_LABEL: Record<Article["type"], string> = {
  podcast: "PODCAST",
  blog: "BLOG",
  tweet: "X / TWITTER",
};
const TYPE_ICON: Record<Article["type"], string> = {
  podcast: "🎙",
  blog: "📰",
  tweet: "🐦",
};

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

  useEffect(() => {
    allSentencesRef.current = article.paragraphs.flatMap((p) => p.sentences);
    register({
      article_id: article.id,
      article_type: article.type,
      article_source: article.sourceName,
      digest_date: article.digestDate,
    });
    return () => {
      unregister("article_id");
      unregister("article_type");
      unregister("article_source");
      unregister("digest_date");
    };
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
    utter.onerror = () => {
      if (utterRef.current !== utter) return;
      stopSpeaking();
    };
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const jumpSentence = (delta: number) => {
    const q = playQueueRef.current;
    if (!q) return;
    q.index = Math.max(0, Math.min(q.index + delta, q.sentences.length - 1));
    // Detach the active utter so its onerror/onend (which fire as a side
    // effect of cancel()) don't tear down the queue we just updated.
    utterRef.current = null;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speakNext();
  };

  const speakSentences = (sentences: Sentence[], startIndex = 0, kind: "article" | "paragraph" = "article") => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("当前浏览器不支持朗读功能");
      return;
    }
    stopSpeaking();
    playQueueRef.current = { sentences, index: startIndex };
    setIsPlayingArticle(sentences.length > 1);
    track("tts_played", {
      kind,
      sentence_count: sentences.length,
    });
    speakNext();
  };

  useEffect(() => {
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        e.preventDefault();
        if (playQueueRef.current) jumpSentence(1);
        else speakSentences(allSentencesRef.current, 0);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (playQueueRef.current) jumpSentence(-1);
        else speakSentences(allSentencesRef.current, 0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onlyAttr = lang === "both" ? null : lang;

  return (
    <div className="page page-reader">
      <header className="reader-header">
        <div className="reader-meta-row">
          <span className="type-badge" data-type={article.type}>
            {TYPE_ICON[article.type]} {TYPE_LABEL[article.type]}
          </span>
          <span>
            <strong style={{ color: "var(--color-ink)" }}>{article.sourceName}</strong>
            {article.sourceHandle ? "  " + article.sourceHandle : ""}
          </span>
          <span>·  {formatDateShort(article.publishedAt)}</span>
          <span>·  {article.wordCount.toLocaleString()} words ·  ~{Math.max(1, Math.round(article.wordCount / 200))} min</span>
        </div>
        <h1 className="reader-title">{article.title}</h1>
        <div className="reader-controls">
          <button
            className="playbtn"
            data-size="primary"
            data-state={isPlayingArticle ? "playing" : "idle"}
            onClick={() => {
              if (isPlayingArticle) stopSpeaking();
              else speakSentences(allSentencesRef.current, 0);
            }}
          >
            <PlayIcon playing={isPlayingArticle} />
            <span>
              {isPlayingArticle ? "暂停" : "朗读全文"}
              {!isPlayingArticle && (
                <span style={{ opacity: 0.6, marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  SPACE
                </span>
              )}
            </span>
          </button>
          <LanguageToggle
            value={lang}
            onChange={(v) => {
              if (v !== lang) track("lang_switched", { from: lang, to: v });
              setLang(v);
            }}
          />
          <span className="keyboard-hint">
            <span className="kbd">SPACE</span> play / pause
            <span className="kbd">←</span>
            <span className="kbd">→</span> prev / next sentence
          </span>
        </div>
      </header>

      <div className="reader-body" style={{ maxWidth: "var(--col-wide)", margin: "0 auto" }}>
        {article.paragraphs.map((p) => (
          <ParagraphBlock
            key={p.id}
            paragraph={p}
            article={article}
            words={words}
            onlyAttr={onlyAttr}
            playingSentenceId={playingSentenceId}
            onWordClick={setPopover}
            onPlayParagraph={() => speakSentences(p.sentences, 0, "paragraph")}
          />
        ))}
      </div>

      <div className="article-footnav">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="article-footnav-link"
          data-dir="prev"
        >
          <span className="article-footnav-eyebrow">原文 ↗</span>
          <span className="article-footnav-title">{article.url}</span>
        </a>
      </div>

      {popover && (
        <WordPopover
          payload={popover}
          onClose={() => setPopover(null)}
          wordEntry={words[popover.key]}
        />
      )}
    </div>
  );
}

function ParagraphBlock({
  paragraph,
  article,
  words,
  onlyAttr,
  playingSentenceId,
  onWordClick,
  onPlayParagraph,
}: {
  paragraph: Paragraph;
  article: Article;
  words: Record<string, WordEntry>;
  onlyAttr: "en" | "zh" | null;
  playingSentenceId: string | null;
  onWordClick: (p: PopoverPayload) => void;
  onPlayParagraph: () => void;
}) {
  const isPlaying = paragraph.sentences.some((s) => s.id === playingSentenceId);
  return (
    <div className="paragraph-block" data-only={onlyAttr ?? undefined}>
      <div className="paragraph-controls">
        <button
          className="playbtn"
          data-size="secondary"
          data-state={isPlaying ? "playing" : "idle"}
          aria-label="朗读这段"
          onClick={onPlayParagraph}
        >
          <PlayIcon playing={isPlaying} />
        </button>
      </div>
      <div className="reader-en">
        {(paragraph.speaker || paragraph.timecode) && (
          <div className="speaker-tag">
            {paragraph.speaker && <span>{paragraph.speaker}</span>}
            {paragraph.timecode && <span className="timecode">{paragraph.timecode}</span>}
          </div>
        )}
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
      </div>
      {paragraph.zh && (
        <div className="reader-zh">
          {(paragraph.speaker || paragraph.timecode) && (
            <div className="speaker-tag">
              {paragraph.speaker && <span>{paragraph.speaker}</span>}
              {paragraph.timecode && <span className="timecode">{paragraph.timecode}</span>}
            </div>
          )}
          {paragraph.zh}
        </div>
      )}
      {paragraph.meta && (
        <div className="engagement-row" style={{ gridColumn: "1 / -1", marginTop: "var(--s-3)" }}>
          <span>♥ {fmtNum(paragraph.meta.likes)}</span>
          <span>↻ {fmtNum(paragraph.meta.retweets)}</span>
          <span>💬 {fmtNum(paragraph.meta.replies)}</span>
          <a
            href={paragraph.meta.tweetUrl}
            target="_blank"
            rel="noreferrer"
            className="source-link"
            style={{ marginLeft: "auto" }}
          >
            x.com ↗
          </a>
        </div>
      )}
    </div>
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
    <span className="sentence-mark" data-playing={playing ? "true" : "false"} data-sid={sentence.id}>
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

function LanguageToggle({ value, onChange }: { value: LangMode; onChange: (v: LangMode) => void }) {
  return (
    <div className="lang-toggle" role="tablist" aria-label="Language layout">
      <button role="tab" data-active={value === "both" ? "true" : undefined} onClick={() => onChange("both")}>
        <span className="lang-zh">双语</span>
      </button>
      <button role="tab" data-active={value === "en" ? "true" : undefined} onClick={() => onChange("en")}>
        EN
      </button>
      <button role="tab" data-active={value === "zh" ? "true" : undefined} onClick={() => onChange("zh")}>
        <span className="lang-zh">中</span>
      </button>
    </div>
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

function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso.slice(0, 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
  } catch {
    return iso.slice(0, 10);
  }
}
