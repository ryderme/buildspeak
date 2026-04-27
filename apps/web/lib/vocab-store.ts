"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { VocabEntry } from "@buildspeak/types";

interface VocabState {
  entries: Record<string, VocabEntry>;
  add: (entry: VocabEntry) => void;
  remove: (key: string) => void;
  has: (key: string) => boolean;
  list: () => VocabEntry[];
}

export const useVocab = create<VocabState>()(
  persist(
    (set, get) => ({
      entries: {},
      add: (entry) =>
        set((s) => ({
          entries: { ...s.entries, [entry.key]: entry },
        })),
      remove: (key) =>
        set((s) => {
          const next = { ...s.entries };
          delete next[key];
          return { entries: next };
        }),
      has: (key) => Boolean(get().entries[key]),
      list: () =>
        Object.values(get().entries).sort((a, b) => b.addedAt - a.addedAt),
    }),
    {
      name: "buildspeak-vocab-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
