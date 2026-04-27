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

/** Builder card with inline tweet previews — articles must include full paragraphs. */
export function TweetGroupCard({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const totalTweets = articles.reduce((n, a) => n + a.paragraphs.length, 0);
  return (
    <section className="rounded-2xl border border-black/5 bg-gradient-to-br from-sky-50 to-sky-100/40 p-6">
      <div className="mb-1 text-xs font-medium tracking-wider text-[color:var(--color-muted)]">
        🐦 X / TWITTER
      </div>
      <div className="mb-5 text-sm text-[color:var(--color-muted)]">
        {articles.length} 位 builder · {totalTweets} 条新动态
      </div>
      <ul className="space-y-5">
        {articles.map((a) => (
          <BuilderPreview key={a.id} article={a} />
        ))}
      </ul>
    </section>
  );
}

function BuilderPreview({ article }: { article: Article }) {
  const previewCount = 2;
  const shown = article.paragraphs.slice(0, previewCount);
  const more = article.paragraphs.length - shown.length;
  // Best-effort handle extraction: id format is x-{handle}-{date}
  const handle = (article.sourceHandle ?? "").replace(/^@/, "");
  return (
    <li className="rounded-xl border border-black/5 bg-white/70 p-4 transition hover:bg-white">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <Link href={`/b/${handle}`} className="font-medium hover:underline">
          {article.sourceName}
        </Link>
        <span className="text-xs text-[color:var(--color-muted)]">{article.sourceHandle}</span>
      </div>
      <ul className="space-y-3">
        {shown.map((p) => (
          <li key={p.id} className="border-l-2 border-black/5 pl-3">
            <p className="text-[15px] leading-relaxed text-[color:var(--color-fg)]">
              {firstSentence(p.sentences[0]?.text ?? "")}
            </p>
            {p.zh && (
              <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--color-muted)]">
                {p.zh.length > 90 ? p.zh.slice(0, 90) + "…" : p.zh}
              </p>
            )}
          </li>
        ))}
      </ul>
      <Link
        href={`/read/tweet/${article.id}`}
        className="mt-3 inline-block text-xs text-[color:var(--color-accent)] hover:underline"
      >
        {more > 0 ? `读全部 ${article.paragraphs.length} 条 →` : `查看完整 →`}
      </Link>
    </li>
  );
}

function firstSentence(s: string): string {
  if (s.length <= 180) return s;
  return s.slice(0, 180) + "…";
}
