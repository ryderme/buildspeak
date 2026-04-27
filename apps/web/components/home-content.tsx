import Link from "next/link";
import type { Article, DailyDigest } from "@buildspeak/types";
import { DigestCard, TweetGroupCard } from "@/components/digest-card";
import { formatDateFull } from "@/lib/format";
import { loadArticle } from "@/lib/content";

interface HomeContentProps {
  digest: DailyDigest;
  /** Adjacent dates available for navigation. */
  prevDate?: string | null;
  nextDate?: string | null;
}

export function HomeContent({ digest, prevDate, nextDate }: HomeContentProps) {
  // For X tweets we need full article content (digest manifest strips paragraphs).
  // Load each builder's article so the home card can show inline tweet previews.
  const tweetArticlesFull: Article[] = digest.tweets
    .map((t) => loadArticle(t.id))
    .filter((a): a is Article => a !== null);

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <DateNav date={digest.date} prevDate={prevDate ?? null} nextDate={nextDate ?? null} />

      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">今日 Digest</h1>
        <p className="mt-1 text-sm text-[color:var(--color-muted)]">
          跟着 AI builder 学英文 · {digest.stats.podcastCount} 播客 · {digest.stats.builderCount} 位 builder · {digest.stats.tweetCount} 条推文 · {digest.stats.blogCount} 博客
        </p>
      </section>

      <div className="space-y-5">
        {digest.podcasts.map((p) => (
          <DigestCard key={p.id} article={p} />
        ))}
        {tweetArticlesFull.length > 0 && <TweetGroupCard articles={tweetArticlesFull} />}
        {digest.blogs.map((b) => (
          <DigestCard key={b.id} article={b} />
        ))}
        {digest.podcasts.length === 0 && digest.blogs.length === 0 && tweetArticlesFull.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 px-6 py-12 text-center text-sm text-[color:var(--color-muted)]">
            这一天没有抓到内容。换一天看看 →
          </div>
        )}
      </div>
    </main>
  );
}

function DateNav({
  date,
  prevDate,
  nextDate,
}: {
  date: string;
  prevDate: string | null;
  nextDate: string | null;
}) {
  return (
    <div className="mb-6 flex items-center justify-between text-sm">
      <div>
        {prevDate ? (
          <Link
            href={`/d/${prevDate}`}
            className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
          >
            ← {formatDateFull(prevDate)}
          </Link>
        ) : (
          <span className="text-[color:var(--color-muted)]/40">← 没有更早的了</span>
        )}
      </div>
      <Link
        href="/archive"
        className="font-medium text-[color:var(--color-fg)]"
      >
        {formatDateFull(date)} ·  📅
      </Link>
      <div>
        {nextDate ? (
          <Link
            href={`/d/${nextDate}`}
            className="text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
          >
            {formatDateFull(nextDate)} →
          </Link>
        ) : (
          <span className="text-[color:var(--color-muted)]/40">最新 →</span>
        )}
      </div>
    </div>
  );
}
