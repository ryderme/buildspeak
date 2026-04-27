import Link from "next/link";
import type { DailyDigest } from "@buildspeak/types";
import { listAvailableDates, loadDigestByDate } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-static";

export default function ArchivePage() {
  const dates = listAvailableDates(); // newest first
  const digestsByDate = new Map<string, DailyDigest>();
  for (const d of dates) {
    const digest = loadDigestByDate(d);
    if (digest) digestsByDate.set(d, digest);
  }

  // Group dates by month
  const months = new Map<string, string[]>(); // "2026-04" → ["2026-04-27", "2026-04-22"]
  for (const d of dates) {
    const m = d.slice(0, 7);
    if (!months.has(m)) months.set(m, []);
    months.get(m)!.push(d);
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">📅 历史 Digest</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            {dates.length} 期已刊发
          </p>
        </header>

        {[...months.entries()].map(([month, datesInMonth]) => (
          <section key={month} className="mb-10">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-muted)]">
              {formatMonth(month)}
            </h2>
            <CalendarGrid month={month} datesInMonth={datesInMonth} digests={digestsByDate} />
          </section>
        ))}

        {dates.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/10 px-6 py-16 text-center text-sm text-[color:var(--color-muted)]">
            还没有任何 Digest。
          </div>
        )}
      </main>
    </>
  );
}

function formatMonth(month: string): string {
  // "2026-04" → "2026 年 4 月"
  const [y, m] = month.split("-");
  return `${y} 年 ${Number(m)} 月`;
}

function CalendarGrid({
  month,
  datesInMonth,
  digests,
}: {
  month: string;
  datesInMonth: string[];
  digests: Map<string, DailyDigest>;
}) {
  const [yearStr, monthStr] = month.split("-") as [string, string];
  const year = Number(yearStr);
  const m = Number(monthStr);
  const firstWeekday = new Date(`${month}-01T00:00:00Z`).getUTCDay(); // 0=Sun
  const daysInMonth = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const dateSet = new Set(datesInMonth);

  // Build grid cells (leading empty + days)
  const cells: Array<{ date: string; day: number } | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${String(d).padStart(2, "0")}`;
    cells.push({ date: dateStr, day: d });
  }
  // Trailing nulls to complete final week (optional, keeps grid rectangular)
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
      <div className="grid grid-cols-7 border-b border-black/5 text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-muted)]">
        {["日", "一", "二", "三", "四", "五", "六"].map((label) => (
          <div key={label} className="border-r border-black/5 px-2 py-2 text-center last:border-r-0">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          if (!cell) {
            return <div key={i} className="aspect-square border-r border-b border-black/5 bg-[color:var(--color-bg)]/40 last:border-r-0" />;
          }
          const has = dateSet.has(cell.date);
          const digest = digests.get(cell.date);
          const cls = "block aspect-square border-r border-b border-black/5 p-2 text-left transition last:border-r-0";
          if (!has) {
            return (
              <div key={i} className={`${cls} bg-[color:var(--color-bg)]/40`}>
                <div className="text-xs text-[color:var(--color-muted)]/50">{cell.day}</div>
              </div>
            );
          }
          return (
            <Link key={i} href={`/d/${cell.date}`} className={`${cls} hover:bg-[color:var(--color-accent-soft)]`}>
              <div className="mb-1 text-xs font-semibold">{cell.day}</div>
              {digest && (
                <div className="space-y-0.5 text-[10px] leading-tight text-[color:var(--color-muted)]">
                  {digest.stats.podcastCount > 0 && <div>🎙 {digest.stats.podcastCount}</div>}
                  {digest.stats.builderCount > 0 && <div>🐦 {digest.stats.builderCount}</div>}
                  {digest.stats.blogCount > 0 && <div>📰 {digest.stats.blogCount}</div>}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
