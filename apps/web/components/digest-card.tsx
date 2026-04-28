import Link from "next/link";
import type { Article } from "@buildspeak/types";
import { readingMinutes } from "@/lib/format";

const ICONS: Record<Article["type"], string> = {
  podcast: "🎙",
  tweet: "🐦",
  blog: "📰",
};
const LABELS: Record<Article["type"], string> = {
  podcast: "PODCAST",
  tweet: "X",
  blog: "BLOG",
};

/** PodcastCard / BlogCard share the .media-card layout. */
export function MediaCard({ article }: { article: Article }) {
  const minutes = readingMinutes(article.wordCount);
  const zhHook = article.paragraphs[0]?.zh;
  return (
    <Link
      href={`/read/${article.type}/${article.id}`}
      className="media-card"
      data-type={article.type}
    >
      <div className="media-card-cover">{ICONS[article.type]}</div>
      <div>
        <div className="media-card-source">
          <span className="type-badge" data-type={article.type}>
            {ICONS[article.type]} {LABELS[article.type]}
          </span>
          <span>{article.sourceName}</span>
          <span>·  {formatPublished(article.publishedAt)}</span>
        </div>
        <h3 className="media-card-title">{article.title}</h3>
        {zhHook && (
          <p className="media-card-zh">
            {zhHook.length > 140 ? zhHook.slice(0, 140) + "…" : zhHook}
          </p>
        )}
      </div>
      <div className="media-card-aside">
        ~{minutes} MIN
        <br />
        {Math.round(article.wordCount / 1000)}K WORDS
      </div>
    </Link>
  );
}

function formatPublished(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  } catch {
    return iso;
  }
}

/** BuilderCard shows handle + 1–2 inline tweet previews + "+N more" link. */
export function BuilderCard({ article }: { article: Article }) {
  const visible = article.paragraphs.slice(0, 2);
  const more = article.paragraphs.length - visible.length;
  const handle = (article.sourceHandle ?? "").replace(/^@/, "");
  const initials = computeInitials(article.sourceName);
  const color = colorForHandle(handle);

  return (
    <article className="builder-card">
      <header className="builder-card-head">
        <div className="builder-avatar" style={{ background: color }}>
          {initials}
        </div>
        <div className="builder-handle-row">
          <Link href={`/b/${handle}`} className="builder-name" style={{ color: "var(--color-ink)", textDecoration: "none", borderBottom: 0 }}>
            {article.sourceName}
          </Link>
          <span className="builder-handle">@{handle}</span>
          {article.sourceBio && (
            <span
              className="builder-bio"
              title={article.sourceBio.split("\n")[0]}
            >
              {article.sourceBio.split("\n")[0]}
            </span>
          )}
        </div>
      </header>
      <div className="builder-card-tweets">
        {visible.map((p) => (
          <div key={p.id} className="tweet-item">
            <p className="tweet-en">{p.sentences[0]?.text ?? ""}</p>
            {p.zh && <p className="tweet-zh">{truncate(p.zh, 110)}</p>}
            {p.meta && (
              <div className="engagement-row">
                <span>♥ {fmtNum(p.meta.likes)}</span>
                <span>↻ {fmtNum(p.meta.retweets)}</span>
                <span>💬 {fmtNum(p.meta.replies)}</span>
                <span style={{ marginLeft: "auto" }}>{shortTime(p.meta.createdAt)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <Link
        href={`/read/tweet/${article.id}`}
        className="builder-more"
        style={{ display: "inline-block", textDecoration: "none", borderBottom: 0 }}
      >
        {more > 0 ? `+ ${more} more from @${handle} →` : `完整阅读 →`}
      </Link>
    </article>
  );
}

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return (parts[0] ?? "?").slice(0, 2).toUpperCase();
  }
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

const HANDLE_COLORS = [
  "#1F4060",
  "#7A1F1F",
  "#2E4A2A",
  "#6B4A11",
  "#5B3A6B",
  "#0F4D4D",
];

function colorForHandle(handle: string): string {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  return HANDLE_COLORS[h % HANDLE_COLORS.length] ?? "#1F4060";
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n) + "…";
}

function fmtNum(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function shortTime(iso: string): string {
  try {
    const d = new Date(iso);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ·  ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  } catch {
    return iso.slice(0, 10);
  }
}
