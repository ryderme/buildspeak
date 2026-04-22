import type { ProfileSummary } from "@buildspeak/types";
import { AppShell } from "@/components/shell/app-shell";

type ProfileScreenProps = {
  summary: ProfileSummary;
  readerHref: string;
};

const heatLevel = (minutes: number) => {
  if (minutes >= 28) return "bg-[color:var(--accent)]";
  if (minutes >= 20) return "bg-[color:color-mix(in_oklab,var(--accent)_75%,white)]";
  if (minutes >= 12) return "bg-[color:color-mix(in_oklab,var(--accent)_45%,white)]";
  if (minutes > 0) return "bg-[color:color-mix(in_oklab,var(--accent)_22%,white)]";
  return "bg-[color:var(--chip)]";
};

export const ProfileScreen = ({ summary, readerHref }: ProfileScreenProps) => (
  <AppShell
    active="profile"
    readerHref={readerHref}
    streakDays={summary.streakDays}
  >
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[30px] border border-[color:var(--border)] bg-white p-8 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-[color:var(--muted-soft)]">
            Your learning arc
          </p>
          <h1 className="mt-4 font-serif text-5xl tracking-[-0.05em] text-[color:var(--ink)]">
            Your learning arc
          </h1>
          <p className="mt-4 max-w-3xl font-cjk text-lg leading-8 text-[color:var(--muted)]">
            {summary.spotlight}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "day streak", value: summary.streakDays },
              { label: "articles read", value: summary.totalArticles },
              { label: "words saved", value: summary.totalWords },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[color:var(--panel-soft)] px-5 py-6">
                <div className="font-serif text-4xl tracking-[-0.04em]">{item.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--muted-soft)]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[30px] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
          <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
            Time invested
          </div>
          <div className="mt-4 font-serif text-5xl tracking-[-0.05em]">{summary.totalMinutes}</div>
          <div className="mt-2 text-sm text-[color:var(--muted)]">minutes with real AI English</div>
        </aside>
      </div>

      <section className="rounded-[30px] border border-[color:var(--border)] bg-white p-8 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl tracking-[-0.04em] text-[color:var(--ink)]">
            Recent momentum
          </h2>
          <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm text-[color:var(--muted)]">
            last 14 days
          </span>
        </div>

        <div className="mt-8 grid grid-cols-7 gap-3">
          {summary.recentActivity.map((entry) => (
            <div key={entry.date} className="space-y-2">
              <div className={`h-16 rounded-2xl ${heatLevel(entry.minutes)}`} />
              <div className="text-center text-xs text-[color:var(--muted)]">
                {entry.date.slice(5)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  </AppShell>
);
