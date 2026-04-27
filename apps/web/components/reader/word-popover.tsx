"use client";

import { useEffect, useRef, useState } from "react";
import type { WordEntry, VocabEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";
import { track } from "@/lib/analytics";

export interface PopoverPayload {
  surface: string;
  key: string;
  /** Anchor position relative to viewport (will be combined with scrollY for absolute placement). */
  rect: DOMRect;
  sentence: string;
  articleId: string;
  articleTitle: string;
}

const POPOVER_W = 320;

export function WordPopover({
  payload,
  onClose,
  wordEntry,
}: {
  payload: PopoverPayload;
  onClose: () => void;
  wordEntry: WordEntry | undefined;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const has = useVocab((s) => s.has(payload.key));
  const add = useVocab((s) => s.add);
  const remove = useVocab((s) => s.remove);
  const [pos, setPos] = useState({ left: 0, top: 0, mobile: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    track("word_clicked", {
      word: payload.key,
      surface: payload.surface,
      has_ipa: Boolean(wordEntry?.ipa),
      has_definition: Boolean(wordEntry?.zh),
      already_in_vocab: has,
      article_id: payload.articleId,
    });
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setPos({ left: 0, top: window.scrollY + window.innerHeight - 320, mobile: true });
      return;
    }
    let left = payload.rect.left + window.scrollX + payload.rect.width / 2 - POPOVER_W / 2;
    left = Math.max(16, Math.min(window.innerWidth - POPOVER_W - 16, left));
    let top = payload.rect.bottom + window.scrollY + 10;
    setPos({ left, top, mobile: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    track("tts_played", { kind: "word", word: payload.key });
    const utter = new SpeechSynthesisUtterance(payload.surface);
    utter.lang = "en-US";
    utter.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function toggleVocab() {
    if (has) {
      track("vocab_removed", { word: payload.key, source: "popover" });
      remove(payload.key);
      return;
    }
    const entry: VocabEntry = {
      key: payload.key,
      surface: payload.surface,
      ipa: wordEntry?.ipa,
      zh: wordEntry?.zh,
      context: {
        sentence: payload.sentence,
        articleId: payload.articleId,
        articleTitle: payload.articleTitle,
      },
      addedAt: Date.now(),
    };
    add(entry);
    track("vocab_added", {
      word: payload.key,
      has_ipa: Boolean(wordEntry?.ipa),
      has_definition: Boolean(wordEntry?.zh),
      article_id: payload.articleId,
    });
  }

  // Split the Chinese gloss into atoms if separated by `;` or `；`.
  const defs = (wordEntry?.zh ?? "").split(/[;；]/).map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <div className="popover-overlay" data-open="true" onClick={onClose} />
      <div
        ref={ref}
        className="word-popover"
        style={pos.mobile ? undefined : { left: pos.left, top: pos.top }}
        role="dialog"
        aria-modal="true"
      >
        <div className="word-popover-head">
          <span className="word-popover-word">{payload.surface}</span>
          {wordEntry?.ipa && <span className="word-popover-ipa">{wordEntry.ipa}</span>}
        </div>
        {defs.length > 0 ? (
          <ol className="word-popover-defs">
            {defs.map((d, i) => (
              <li key={i}>
                {defs.length > 1 ? `${i + 1}. ` : ""}
                {d}
              </li>
            ))}
          </ol>
        ) : (
          <p
            className="word-popover-defs"
            style={{ color: "var(--color-ink-mute)", fontStyle: "italic" }}
          >
            （暂无释义）
          </p>
        )}
        <div className="word-popover-context">
          “…{payload.sentence}…”
        </div>
        <div className="word-popover-actions">
          <button onClick={speak} aria-label="朗读">
            ♪ <span className="vocab-zh">朗读</span>
          </button>
          <button data-primary={!has ? "true" : undefined} onClick={toggleVocab}>
            {has ? (
              <>
                ✓ <span className="vocab-zh">已加入</span>
              </>
            ) : (
              <>
                + <span className="vocab-zh">加入生词本</span>
              </>
            )}
          </button>
          <button style={{ marginLeft: "auto" }} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>
    </>
  );
}
