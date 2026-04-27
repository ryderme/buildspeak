"use client";

import { useEffect, useRef } from "react";
import type { WordEntry, VocabEntry } from "@buildspeak/types";
import { useVocab } from "@/lib/vocab-store";

export interface PopoverPayload {
  surface: string;
  key: string;
  /** Anchor position in client coords. */
  rect: DOMRect;
  /** Sentence text the word came from (for context + saved entry). */
  sentence: string;
  articleId: string;
  articleTitle: string;
}

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

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  // Position the popover. Default below the word; flip above if not enough room.
  const POP_W = 320;
  const POP_H = 180;
  const margin = 8;
  let left = payload.rect.left + payload.rect.width / 2 - POP_W / 2;
  left = Math.max(margin, Math.min(left, (typeof window !== "undefined" ? window.innerWidth : 1200) - POP_W - margin));
  let top = payload.rect.bottom + 8;
  if (typeof window !== "undefined" && top + POP_H > window.innerHeight - margin) {
    top = payload.rect.top - POP_H - 8;
  }

  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(payload.surface);
    utter.lang = "en-US";
    utter.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function toggleVocab() {
    if (has) {
      remove(payload.key);
    } else {
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
    }
  }

  return (
    <div
      ref={ref}
      role="dialog"
      style={{ position: "fixed", left, top, width: POP_W }}
      className="z-50 rounded-xl border border-black/10 bg-white p-4 shadow-lg"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-base font-semibold">{payload.surface}</div>
        <button
          type="button"
          onClick={speak}
          aria-label="朗读"
          className="rounded-md px-2 py-1 text-sm text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-soft)]"
        >
          ♪ 朗读
        </button>
      </div>
      {wordEntry?.ipa && (
        <div className="mt-1 font-mono text-sm text-[color:var(--color-muted)]">
          {wordEntry.ipa}
        </div>
      )}
      <div className="mt-3 text-sm leading-relaxed">
        {wordEntry?.zh || <span className="text-[color:var(--color-muted)]">（暂无释义）</span>}
      </div>
      <div className="mt-3 line-clamp-3 rounded-md bg-black/5 px-3 py-2 text-xs leading-relaxed text-[color:var(--color-muted)]">
        “{payload.sentence}”
      </div>
      <button
        type="button"
        onClick={toggleVocab}
        className={`mt-3 w-full rounded-md px-3 py-2 text-sm font-medium transition ${
          has
            ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
            : "bg-[color:var(--color-accent)] text-white hover:opacity-90"
        }`}
      >
        {has ? "✓ 已在生词本（点击移除）" : "+ 加入生词本"}
      </button>
    </div>
  );
}
