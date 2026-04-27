import type { Article, DailyDigest } from "@buildspeak/types";
import { IssueHeader } from "@/components/issue-header";
import { MediaCard, BuilderCard } from "@/components/digest-card";
import { loadArticle } from "@/lib/content";

interface HomeContentProps {
  digest: DailyDigest;
  prevDate?: string | null;
  nextDate?: string | null;
  isLatest: boolean;
}

export function HomeContent({ digest, prevDate, nextDate, isLatest }: HomeContentProps) {
  // Load full content for each X builder so the home card can show inline tweet previews.
  const builderArticles: Article[] = digest.tweets
    .map((t) => loadArticle(t.id))
    .filter((a): a is Article => a !== null);

  return (
    <div className="page page-narrow">
      <IssueHeader digest={digest} prevDate={prevDate ?? null} nextDate={nextDate ?? null} isLatest={isLatest} />

      <Section icon="🎙" title="Podcast" count={`${digest.stats.podcastCount} EP TODAY`}>
        {digest.podcasts.length > 0 ? (
          digest.podcasts.map((p) => {
            const full = loadArticle(p.id);
            return full ? <MediaCard key={p.id} article={full} /> : null;
          })
        ) : (
          <EmptyBox kind="podcast" />
        )}
      </Section>

      <Section
        icon="🐦"
        title="Builders on X"
        count={`${digest.stats.builderCount} BUILDERS ·  ${digest.stats.tweetCount} POSTS`}
      >
        {builderArticles.length > 0 ? (
          <div className="builder-grid">
            {builderArticles.map((a) => (
              <BuilderCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <EmptyBox kind="tweet" />
        )}
      </Section>

      <Section
        icon="📰"
        title="Blog"
        count={
          digest.stats.blogCount > 0 ? `${digest.stats.blogCount} POST` : "NO BLOG TODAY · 今日无博客"
        }
      >
        {digest.blogs.length > 0 ? (
          digest.blogs.map((b) => {
            const full = loadArticle(b.id);
            return full ? <MediaCard key={b.id} article={full} /> : null;
          })
        ) : (
          <EmptyBox kind="blog" />
        )}
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  count,
  children,
}: {
  icon: string;
  title: string;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="section-header">
        <span className="section-icon">{icon}</span>
        <h2 className="section-title">{title}</h2>
        <span className="section-count">{count}</span>
      </div>
      {children}
    </section>
  );
}

function EmptyBox({ kind }: { kind: "podcast" | "blog" | "tweet" }) {
  const messages: Record<typeof kind, { en: string; zh: string; icon: string }> = {
    podcast: {
      icon: "🎙",
      en: "No new podcast today.",
      zh: "今日没有新播客；昨日的节目仍在 archive。",
    },
    blog: {
      icon: "📰",
      en: "Nothing official today.",
      zh: "今日没有官方博客；之前的博文仍在 archive。",
    },
    tweet: {
      icon: "🐦",
      en: "Builders are quiet today.",
      zh: "今日 builders 没有更新。",
    },
  };
  const m = messages[kind];
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{m.icon}</div>
      <p className="empty-state-text">
        {m.en}
        <span className="empty-state-text-zh">{m.zh}</span>
      </p>
    </div>
  );
}
