import { loadLatestDigest } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { DigestCard, TweetGroupCard } from "@/components/digest-card";

export default function HomePage() {
  const digest = loadLatestDigest();

  return (
    <>
      <SiteHeader date={digest.date} />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <section className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">今日 Digest</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            跟着 AI builder 学英文 · {digest.stats.podcastCount} 播客 · {digest.stats.builderCount} 位 builder · {digest.stats.tweetCount} 条推文 · {digest.stats.blogCount} 博客
          </p>
        </section>

        <div className="space-y-5">
          {digest.podcasts.map((p) => (
            <DigestCard key={p.id} article={p} />
          ))}
          <TweetGroupCard articles={digest.tweets} />
          {digest.blogs.map((b) => (
            <DigestCard key={b.id} article={b} />
          ))}
        </div>
      </main>
    </>
  );
}
