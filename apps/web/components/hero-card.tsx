import Link from "next/link";
import type { Article } from "@buildspeak/types";
import { readingMinutes } from "@/lib/format";

/** Hero card on home — the day's most editorially valuable item.
 *  Priority: podcast > blog > most-engaging tweet thread. */
export function HeroCard({ article }: { article: Article }) {
  const minutes = readingMinutes(article.wordCount);
  const zhHook = pickZhHook(article);
  const subtitle = article.sourceHandle ?? "";

  return (
    <div className="hero" data-type={article.type}>
      <div>
        <h2 className="hero-title">{article.title}</h2>
        {zhHook && <p className="hero-zh-hook">{zhHook}</p>}
        <div className="hero-meta">
          <span>
            <strong>{article.sourceName}</strong>
          </span>
          {subtitle && <span>·  {subtitle}</span>}
          <span>·  {article.wordCount.toLocaleString()} words ·  ~{minutes} min</span>
        </div>
        <div className="hero-actions">
          <Link
            href={`/read/${article.type}/${article.id}`}
            className="playbtn"
            data-size="primary"
            data-state="idle"
          >
            <PlayIcon />
            <span>开始阅读</span>
          </Link>
          <Link
            href={`/read/${article.type}/${article.id}`}
            className="btn"
            style={{ textDecoration: "none" }}
          >
            双语阅读 →
          </Link>
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-art-cover">
          <span>
            {article.sourceName.toUpperCase().slice(0, 12)}
            <br />
            {labelFor(article.type)}
          </span>
        </div>
        <div className="hero-runtime">
          {formatPublished(article.publishedAt)}
          <br />
          {minutes} MIN READ
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M3 1.5 L10 6 L3 10.5 Z" />
    </svg>
  );
}

function labelFor(t: Article["type"]): string {
  return t === "podcast" ? "PODCAST" : t === "blog" ? "BLOG" : "X / TWITTER";
}

/** Take the first paragraph's Chinese translation as the hook (truncated). */
function pickZhHook(article: Article): string | undefined {
  const first = article.paragraphs[0]?.zh;
  if (!first) return undefined;
  if (first.length <= 110) return first;
  return first.slice(0, 110) + "…";
}

function formatPublished(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
  } catch {
    return iso;
  }
}
