import Link from "next/link";

type SiteHeaderProps = {
  active: "home" | "reader" | "vocab" | "profile";
  readerHref: string;
  streakDays: number;
};

const navItems = (readerHref: string) => [
  { id: "home", label: "Today", href: "/" },
  { id: "reader", label: "Reader", href: readerHref },
  { id: "vocab", label: "Vocabulary", href: "/vocab" },
  { id: "profile", label: "Profile", href: "/me" },
] as const;

export const SiteHeader = ({ active, readerHref, streakDays }: SiteHeaderProps) => (
  <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--paper)_92%,white)]/95 backdrop-blur">
    <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-4 sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--accent)] font-serif text-lg font-semibold italic text-white shadow-[0_12px_30px_rgba(47,111,235,0.22)]">
          B
        </span>
        <div>
          <div className="font-serif text-xl font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
            BuildSpeak
          </div>
          <div className="text-xs text-[color:var(--muted)]">
            Learn English from the people building AI.
          </div>
        </div>
      </Link>

      <nav className="ml-4 hidden items-center gap-2 md:flex">
        {navItems(readerHref).map((item) => {
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[color:var(--chip)] text-[color:var(--ink)]"
                  : "text-[color:var(--muted)] hover:bg-white hover:text-[color:var(--ink)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto hidden items-center gap-3 sm:flex">
        <div className="flex min-w-56 items-center gap-3 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-[color:var(--muted)] shadow-[0_12px_30px_rgba(26,26,26,0.03)]">
          <span className="text-[color:var(--muted-soft)]">⌘K</span>
          <span>Search today&apos;s digest</span>
        </div>
        <div className="rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm text-[color:var(--ink)] shadow-[0_12px_30px_rgba(26,26,26,0.03)]">
          <span className="mr-2 text-[color:#e26b3c]">●</span>
          <span className="font-semibold">{streakDays}</span>
          <span className="ml-2 text-[color:var(--muted)]">day streak</span>
        </div>
      </div>
    </div>
  </header>
);
