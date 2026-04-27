import Link from "next/link";
import type { Article } from "@buildspeak/types";
import { readingMinutes } from "@/lib/format";

const TYPE_LABEL: Record<Article["type"], string> = {
  podcast: "🎙 PODCAST",
  tweet: "🐦 X / TWITTER",
  blog: "📰 BLOG",
};

const TYPE_TINT: Record<Article["type"], string> = {
  podcast: "from-amber-50 to-amber-100/40",
  tweet: "from-sky-50 to-sky-100/40",
  blog: "from-emerald-50 to-emerald-100/40",
};

export function DigestCard({ article }: { article: Article }) {
  const slug = article.id;
  const minutes = readingMinutes(article.wordCount);
  return (
    <Link
      href={`/read/${article.type}/${slug}`}
      className={`block rounded-2xl border border-black/5 bg-gradient-to-br ${TYPE_TINT[article.type]} p-6 transition hover:shadow-sm`}
    >
      <div className="mb-3 text-xs font-medium tracking-wider text-[color:var(--color-muted)]">
        {TYPE_LABEL[article.type]}
      </div>
      <h2 className="text-lg font-semibold leading-snug text-[color:var(--color-fg)]">
        {article.title}
      </h2>
      {article.sourceHandle && article.type === "tweet" && article.sourceBio && (
        <p className="mt-2 line-clamp-2 text-sm text-[color:var(--color-muted)]">
          {article.sourceBio.split("\n")[0]}
        </p>
      )}
      <div className="mt-4 flex items-center gap-3 text-xs text-[color:var(--color-muted)]">
        <span>{article.sourceName}</span>
        <span>·</span>
        <span>{article.wordCount.toLocaleString()} 词</span>
        <span>·</span>
        <span>约 {minutes} 分钟</span>
      </div>
    </Link>
  );
}

export function TweetGroupCard({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const totalTweets = articles.reduce((n, a) => n + (a.engagement ? 1 : 0) + (a.wordCount > 0 ? 0 : 0), 0);
  // Lightweight: count tweets via paragraphs at runtime is impossible (paragraphs is empty in digest manifest)
  // Use the engagement presence + sourceCount instead.
  return (
    <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-sky-50 to-sky-100/40 p-6">
      <div className="mb-4 text-xs font-medium tracking-wider text-[color:var(--color-muted)]">
        🐦 X / TWITTER
      </div>
      <div className="mb-4 text-sm text-[color:var(--color-muted)]">
        今日 {articles.length} 位 builder 有新动态
      </div>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              href={`/read/tweet/${a.id}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-white/60"
            >
              <span className="text-sm font-medium">{a.sourceName}</span>
              <span className="text-xs text-[color:var(--color-muted)]">{a.sourceHandle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
