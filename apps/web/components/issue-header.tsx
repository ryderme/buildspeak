import Link from "next/link";
import type { DailyDigest } from "@buildspeak/types";

interface IssueHeaderProps {
  digest: DailyDigest;
  prevDate: string | null;
  nextDate: string | null;
  isLatest: boolean;
}

export function IssueHeader({ digest, prevDate, nextDate, isLatest }: IssueHeaderProps) {
  const zhDate = formatDateZh(digest.date);
  const enDate = formatDateEn(digest.date);
  const issueNo = issueNumber(digest.date);

  return (
    <header className="issue-header">
      <div className="issue-header-meta">
        <span className="eyebrow">
          {isLatest ? "今日" : "历史日"} ·  ISSUE {String(issueNo).padStart(2, "0")}
        </span>
        <h1 className="issue-header-date">{zhDate}</h1>
        <span className="issue-header-date-en">{enDate}</span>
      </div>
      <div className="issue-header-counts">
        {digest.stats.podcastCount > 0 && (
          <span>
            <strong>{digest.stats.podcastCount}</strong> 🎙
          </span>
        )}
        {digest.stats.blogCount > 0 && (
          <span>
            <strong>{digest.stats.blogCount}</strong> 📰
          </span>
        )}
        <span>
          <strong>{digest.stats.builderCount}</strong> builders ·{" "}
          <strong>{digest.stats.tweetCount}</strong> 🐦
        </span>
      </div>
      <div className="day-nav">
        <DayNavButton href={prevDate ? `/d/${prevDate}` : null} label="‹" srLabel="Previous day" />
        <span className="day-nav-today">{isLatest ? "TODAY" : digest.date}</span>
        <DayNavButton
          href={nextDate ? `/d/${nextDate}` : isLatest ? null : "/"}
          label="›"
          srLabel="Next day"
        />
      </div>
    </header>
  );
}

function DayNavButton({
  href,
  label,
  srLabel,
}: {
  href: string | null;
  label: string;
  srLabel: string;
}) {
  if (!href) {
    return (
      <button disabled aria-label={srLabel}>
        {label}
      </button>
    );
  }
  return (
    <Link href={href} aria-label={srLabel}>
      <button aria-hidden="true">{label}</button>
    </Link>
  );
}

function formatDateZh(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const date = new Date(`${iso}T00:00:00Z`);
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getUTCDay()];
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日 · ${week}`;
}

function formatDateEn(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!y || !m || !d) return iso;
  return `${months[Number(m) - 1]} ${Number(d)} ${y}`;
}

function issueNumber(iso: string): number {
  // Use day-of-year as a simple, stable issue number.
  const date = new Date(`${iso}T00:00:00Z`);
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86400000);
}
