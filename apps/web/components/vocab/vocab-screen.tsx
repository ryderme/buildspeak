import type { ReviewBucket, VocabularySnapshot } from "@buildspeak/types";
import { AppShell } from "@/components/shell/app-shell";
import { getFeaturedReaderHref, getProfileSummary } from "@/lib/mock-content";

type VocabScreenProps = {
  snapshot: VocabularySnapshot;
};

const bucketLabels: Record<ReviewBucket, string> = {
  today: "Today",
  thisWeek: "This week",
  all: "All saved",
};

export const VocabScreen = ({ snapshot }: VocabScreenProps) => {
  const profile = getProfileSummary();

  return (
    <AppShell
      active="vocab"
      readerHref={getFeaturedReaderHref()}
      streakDays={profile.streakDays}
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-[color:var(--muted-soft)]">
              Vocabulary notebook
            </p>
            <h1 className="mt-4 font-serif text-5xl tracking-[-0.05em] text-[color:var(--ink)]">
              Vocabulary notebook
            </h1>
            <p className="mt-4 max-w-3xl font-cjk text-lg leading-8 text-[color:var(--muted)]">
              不背孤立单词，只背你刚刚在 AI 一线内容里遇到的表达。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-[24px] bg-white px-6 py-4 shadow-[0_18px_50px_rgba(26,26,26,0.05)]">
              <div className="font-serif text-4xl tracking-[-0.04em]">{snapshot.totalWords}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-soft)]">
                total words
              </div>
            </div>
            <div className="rounded-[24px] bg-white px-6 py-4 shadow-[0_18px_50px_rgba(26,26,26,0.05)]">
              <div className="font-serif text-4xl tracking-[-0.04em]">{snapshot.reviewQueue}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-soft)]">
                review queue
              </div>
            </div>
          </div>
        </div>

        {(["today", "thisWeek", "all"] as const).map((bucket) => {
          const entries = snapshot.entries.filter((entry) => entry.bucket === bucket);

          if (!entries.length) {
            return null;
          }

          return (
            <section key={bucket} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-3xl tracking-[-0.04em] text-[color:var(--ink)]">
                  {bucketLabels[bucket]}
                </h2>
                <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm text-[color:var(--muted)]">
                  {entries.length} words
                </span>
              </div>

              <div className="space-y-4">
                {entries.map((entry) => (
                  <article
                    key={entry.lemma}
                    className="grid gap-5 rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(26,26,26,0.05)] lg:grid-cols-[260px_minmax(0,1fr)_180px]"
                  >
                    <div>
                      <div className="font-serif text-3xl tracking-[-0.04em] text-[color:var(--ink)]">
                        {entry.lemma}
                      </div>
                      <div className="mt-2 font-mono text-sm text-[color:var(--muted)]">
                        {entry.ipa}
                      </div>
                      <div className="mt-4 flex items-center gap-3 font-cjk text-base text-[color:var(--ink)]">
                        <span className="font-serif text-sm italic text-[color:var(--muted)]">
                          {entry.pos}
                        </span>
                        <span>{entry.translation}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs text-[color:var(--muted)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-0 border-[color:var(--border)] pt-1 lg:border-l lg:pl-6">
                      <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
                        {entry.source}
                      </div>
                      <blockquote className="mt-4 font-serif text-xl leading-8 text-[color:var(--ink)]">
                        “{entry.quote}”
                      </blockquote>
                      <p className="mt-2 text-sm text-[color:var(--muted)]">— {entry.speaker}</p>
                      <p className="mt-4 font-cjk text-sm leading-7 text-[color:var(--muted)]">
                        {entry.quoteZh}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className="rounded-full bg-[color:var(--highlight)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)]">
                        Next: {entry.nextReview}
                      </span>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <span
                            key={`${entry.lemma}-${index}`}
                            className={`h-2.5 w-6 rounded-full ${
                              index < entry.stage
                                ? "bg-[color:var(--accent)]"
                                : "bg-[color:var(--chip)]"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-[color:var(--muted)]">
                        Seen {entry.seenCount}×
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </AppShell>
  );
};
