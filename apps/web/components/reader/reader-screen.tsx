import type { ReaderArticle, Token } from "@buildspeak/types";
import { AppShell } from "@/components/shell/app-shell";

type ReaderScreenProps = {
  article: ReaderArticle;
  readerHref: string;
  streakDays: number;
};

const renderToken = (token: Token, index: number) => {
  if (token.kind === "text") {
    return <span key={`${token.text}-${index}`}>{token.text}</span>;
  }

  return (
    <mark
      key={`${token.lemma}-${index}`}
      className={`rounded px-1.5 py-0.5 ${
        token.isKnown
          ? "bg-[color:var(--highlight)]"
          : "bg-[color:color-mix(in_oklab,var(--accent)_12%,white)]"
      }`}
    >
      {token.surface}
    </mark>
  );
};

const focusWord = (article: ReaderArticle) =>
  article.sentences
    .flatMap((entry) => entry.en)
    .find((token): token is Extract<Token, { kind: "word" }> => token.kind === "word");

export const ReaderScreen = ({
  article,
  readerHref,
  streakDays,
}: ReaderScreenProps) => {
  const pinnedWord = focusWord(article);

  return (
    <AppShell
      active="reader"
      readerHref={readerHref}
      streakDays={streakDays}
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-10 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[30px] border border-[color:var(--border)] bg-white p-8 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
              <span>{article.source.name}</span>
              <span>•</span>
              <span>{article.source.subtitle}</span>
              <span>•</span>
              <span>Lv. {article.stats.level}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="font-serif text-5xl leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                  {article.title.en}
                </h1>
                <p className="mt-3 font-cjk text-lg text-[color:var(--muted)]">
                  {article.title.zh}
                </p>
              </div>

              <div className="flex gap-2">
                {["Side by side", "Stacked", "English only"].map((layout, index) => (
                  <span
                    key={layout}
                    className={`rounded-full px-4 py-2 text-sm ${
                      index === 0
                        ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                        : "bg-[color:var(--chip)] text-[color:var(--muted)]"
                    }`}
                  >
                    {layout}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[22px] border border-[color:var(--border)] bg-[color:var(--panel-soft)] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--ink)] text-[color:var(--paper)]">
                  ▶
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)]">
                  ❚❚
                </span>
              </div>
              <div className="font-mono text-sm text-[color:var(--muted)]">02:34 / 12:08</div>
              <div className="h-2 min-w-52 flex-1 rounded-full bg-white">
                <div className="h-full w-1/3 rounded-full bg-[color:var(--accent)]" />
              </div>
              <div className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-[color:var(--muted)]">
                1.0×
              </div>
              <div className="rounded-full bg-[color:color-mix(in_oklab,var(--accent)_12%,white)] px-4 py-2 text-sm font-semibold text-[color:var(--accent)]">
                Shadowing mode
              </div>
            </div>
          </div>

          <aside className="rounded-[30px] border border-[color:var(--border)] bg-white p-6 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
            <div className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
              Focus Word
            </div>
            <div className="mt-4 font-serif text-3xl tracking-[-0.04em] text-[color:var(--ink)]">
              {pinnedWord?.lemma ?? "agentic"}
            </div>
            <div className="mt-2 font-mono text-sm text-[color:var(--muted)]">
              {pinnedWord?.ipa ?? "/eɪˈdʒen.tɪk/"}
            </div>
            <div className="mt-4 font-cjk text-base text-[color:var(--ink)]">
              {pinnedWord?.translation ?? "代理式的；能动的"}
            </div>
            <div className="mt-5 rounded-2xl bg-[color:var(--panel-soft)] p-4 font-serif text-lg leading-8 text-[color:var(--ink)]">
              “{article.quote}”
            </div>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]">
                Save to vocab
              </button>
              <button className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-[color:var(--muted)]">
                Listen
              </button>
            </div>
          </aside>
        </div>

        <div className="space-y-4">
          {article.sentences.map((entry, index) => (
            <article
              key={entry.id}
              className={`grid gap-6 rounded-[30px] border border-[color:var(--border)] p-6 shadow-[0_18px_50px_rgba(26,26,26,0.04)] ${
                index === 0
                  ? "bg-[color:color-mix(in_oklab,var(--accent)_6%,white)]"
                  : "bg-white"
              } md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}
            >
              <div>
                <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-[color:var(--muted-soft)]">
                  {entry.speaker ? <span>{entry.speaker}</span> : null}
                  {entry.timestamp ? <span>• {entry.timestamp}</span> : null}
                </div>
                <p className="font-serif text-2xl leading-10 tracking-[-0.02em] text-[color:var(--ink)]">
                  {entry.en.map(renderToken)}
                </p>
              </div>
              <div className="border-l-0 border-[color:var(--border)] pt-1 md:border-l md:pl-6">
                <p className="font-cjk text-lg leading-9 text-[color:var(--muted)]">
                  {entry.zh}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
};
