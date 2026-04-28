import Link from "next/link";
import type { DailyDigest } from "@buildspeak/types";
import { listAvailableDates, loadDigestByDate } from "@/lib/content";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const dynamic = "force-static";

export default function ArchivePage() {
  const dates = listAvailableDates(); // newest first
  const digestsByDate = new Map<string, DailyDigest>();
  for (const d of dates) {
    const digest = loadDigestByDate(d);
    if (digest) digestsByDate.set(d, digest);
  }
  const today = dates[0];

  // Group dates by month
  const months = new Map<string, string[]>();
  for (const d of dates) {
    const m = d.slice(0, 7);
    if (!months.has(m)) months.set(m, []);
    months.get(m)!.push(d);
  }

  return (
    <>
      <SiteHeader />
      <main className="page page-narrow">
        <header className="issue-header" style={{ gridTemplateColumns: "1fr" }}>
          <div className="issue-header-meta">
            <span className="eyebrow">归档 ·  ARCHIVE</span>
            <h1 className="issue-header-date">每日 builder 文摘</h1>
            <span className="issue-header-date-en">
              全部过往刊期 ·  点击任意一天阅读 ·  共 {dates.length} 期
            </span>
          </div>
        </header>

        {[...months.entries()].map(([month, datesInMonth]) => (
          <CalendarMonth
            key={month}
            month={month}
            datesInMonth={datesInMonth}
            digests={digestsByDate}
            today={today}
          />
        ))}

        {dates.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <p className="empty-state-text">
              No issues yet.
              <span className="empty-state-text-zh">还没有任何 Digest。</span>
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

const WEEKDAYS_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHS_EN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function CalendarMonth({
  month,
  datesInMonth,
  digests,
  today,
}: {
  month: string;
  datesInMonth: string[];
  digests: Map<string, DailyDigest>;
  today: string | undefined;
}) {
  const [yearStr, monthStr] = month.split("-") as [string, string];
  const year = Number(yearStr);
  const m = Number(monthStr);
  const firstWeekday = new Date(`${month}-01T00:00:00Z`).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const dateSet = new Set(datesInMonth);

  type Cell =
    | { kind: "out" }
    | { kind: "day"; date: string; day: number };
  const cells: Cell[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ kind: "out" });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${month}-${String(d).padStart(2, "0")}`;
    cells.push({ kind: "day", date, day: d });
  }
  while (cells.length % 7 !== 0) cells.push({ kind: "out" });

  return (
    <section className="calendar-month">
      <header className="calendar-month-head">
        <h2 className="calendar-month-title">
          {year} 年 {m} 月
        </h2>
        <span className="calendar-month-title-en">
          {MONTHS_EN[m - 1]} {year}
        </span>
      </header>
      <div className="calendar-grid">
        {WEEKDAYS_ZH.map((label, i) => (
          <div
            key={`wd-${i}`}
            className="calendar-cell"
            data-empty="true"
            style={{ aspectRatio: "auto", padding: "8px 10px", justifyContent: "center", alignItems: "center" }}
          >
            <span className="label-mono">{label}</span>
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (cell.kind === "out") {
            return <div key={idx} className="calendar-cell" data-out-of-month="true" />;
          }
          const has = dateSet.has(cell.date);
          const digest = digests.get(cell.date);
          if (!has) {
            return (
              <div key={idx} className="calendar-cell" data-empty="true">
                <span className="calendar-cell-day">{cell.day}</span>
              </div>
            );
          }
          const isToday = cell.date === today;
          return (
            <Link
              key={idx}
              href={`/d/${cell.date}`}
              className="calendar-cell"
              data-today={isToday ? "true" : undefined}
              style={{ textDecoration: "none", borderBottom: 0 }}
            >
              <span className="calendar-cell-day">{cell.day}</span>
              {digest && firstHeadline(digest) && (
                <span className="calendar-cell-headline">{firstHeadline(digest)}</span>
              )}
              {digest && (
                <div className="calendar-cell-icons">
                  {digest.stats.podcastCount > 0 && <span title="podcast">🎙</span>}
                  {digest.stats.blogCount > 0 && <span title="blog">📰</span>}
                  {digest.stats.builderCount > 0 && (
                    <span title="builders">🐦 {digest.stats.builderCount}</span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function firstHeadline(digest: DailyDigest): string | undefined {
  const first = digest.podcasts[0]?.title ?? digest.blogs[0]?.title;
  return first;
}
