"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useVocab } from "@/lib/vocab-store";
import { SiteHeader } from "@/components/site-header";

export default function VocabPage() {
  const list = useVocab((s) => s.list);
  const remove = useVocab((s) => s.remove);
  const [hydrated, setHydrated] = useState(false);

  // Avoid Next.js hydration mismatch — Zustand persist reads localStorage on the client only.
  useEffect(() => setHydrated(true), []);

  const entries = hydrated ? list() : [];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">生词本</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            {hydrated ? `共 ${entries.length} 个词` : "加载中…"}
          </p>
        </header>

        {hydrated && entries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 px-6 py-12 text-center text-sm text-[color:var(--color-muted)]">
            还没有任何生词。回到 <Link href="/" className="text-[color:var(--color-accent)] underline">今日 Digest</Link>，点击不会的英文单词加入吧。
          </div>
        )}

        <ul className="space-y-3">
          {entries.map((e) => (
            <li
              key={e.key}
              className="rounded-xl border border-black/5 bg-white p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <span className="text-base font-semibold">{e.surface}</span>
                  {e.ipa && (
                    <span className="ml-3 font-mono text-xs text-[color:var(--color-muted)]">
                      {e.ipa}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.key)}
                  className="text-xs text-[color:var(--color-muted)] hover:text-red-600"
                >
                  移除
                </button>
              </div>
              {e.zh && <div className="mt-1 text-sm">{e.zh}</div>}
              <div className="mt-2 line-clamp-2 rounded-md bg-black/5 px-3 py-2 text-xs leading-relaxed text-[color:var(--color-muted)]">
                “{e.context.sentence}”
              </div>
              <Link
                href={`/read/${e.context.articleId.startsWith("podcast-") ? "podcast" : e.context.articleId.startsWith("blog-") ? "blog" : "tweet"}/${e.context.articleId}`}
                className="mt-2 inline-block text-xs text-[color:var(--color-accent)] hover:underline"
              >
                ← 回到原文 ({e.context.articleTitle.slice(0, 40)}…)
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
