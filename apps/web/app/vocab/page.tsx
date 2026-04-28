"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useVocab } from "@/lib/vocab-store";
import { track } from "@/lib/analytics";
import { SiteHeader, SiteFooter } from "@/components/site-header";

type Sort = "date" | "alpha";

export default function VocabPage() {
  const list = useVocab((s) => s.list);
  const remove = useVocab((s) => s.remove);
  const [hydrated, setHydrated] = useState(false);
  const [sort, setSort] = useState<Sort>("date");

  useEffect(() => setHydrated(true), []);

  const entries = useMemo(() => {
    if (!hydrated) return [];
    const arr = list();
    if (sort === "alpha") arr.sort((a, b) => a.surface.localeCompare(b.surface));
    return arr;
  }, [hydrated, list, sort]);

  return (
    <>
      <SiteHeader />
      <main className="page vocab-root">
        <header className="issue-header" style={{ gridTemplateColumns: "1fr auto" }}>
          <div className="issue-header-meta">
            <span className="eyebrow">生词本 ·  VOCAB</span>
            <h1 className="issue-header-date">你保存的词</h1>
            <span className="issue-header-date-en">
              {hydrated ? `共 ${entries.length} 个词` : "加载中…"} ·  点击任意一行回到原句
            </span>
          </div>
        </header>

        <div className="vocab-toolbar">
          <span>排序</span>
          <div className="vocab-sort">
            <button
              data-active={sort === "date" ? "true" : undefined}
              onClick={() => setSort("date")}
            >
              添加时间
            </button>
            <button
              data-active={sort === "alpha" ? "true" : undefined}
              onClick={() => setSort("alpha")}
            >
              字母
            </button>
            <button>下次复习 (P1)</button>
          </div>
        </div>

        {hydrated && entries.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📖</div>
            <p className="empty-state-text">
              还没有任何生词
              <span className="empty-state-text-zh">
                回到 <Link href="/">今日文摘</Link>，点击不会的英文单词加入吧。
              </span>
            </p>
          </div>
        )}

        <ul className="vocab-list">
          {entries.map((e) => (
            <li key={e.key} className="vocab-item">
              <div>
                <div className="vocab-word">{e.surface}</div>
                {e.ipa && <div className="vocab-ipa">{e.ipa}</div>}
              </div>
              <div>
                {e.zh && <p className="vocab-def">{e.zh}</p>}
                <p className="vocab-context">
                  “…{e.context.sentence}…”
                </p>
              </div>
              <div className="vocab-aside">
                <span className="vocab-pill">{relativeTime(e.addedAt)}</span>
                <span>
                  {e.context.articleTitle.length > 26
                    ? e.context.articleTitle.slice(0, 26) + "…"
                    : e.context.articleTitle}
                </span>
                <Link
                  href={`/read/${typeFromArticleId(e.context.articleId)}/${e.context.articleId}`}
                >
                  跳回原文 →
                </Link>
                <button
                  onClick={() => {
                    track("vocab_removed", { word: e.key, source: "list" });
                    remove(e.key);
                  }}
                  style={{
                    border: 0,
                    background: "none",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--t-meta)",
                    color: "var(--color-ink-mute)",
                    cursor: "pointer",
                  }}
                >
                  移除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}

function typeFromArticleId(id: string): "podcast" | "blog" | "tweet" {
  if (id.startsWith("podcast-")) return "podcast";
  if (id.startsWith("blog-")) return "blog";
  return "tweet";
}

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const day = 86_400_000;
  if (diff < day) return "今日加入";
  const days = Math.floor(diff / day);
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  return `${Math.floor(days / 30)} 月前`;
}
