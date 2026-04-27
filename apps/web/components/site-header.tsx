import Link from "next/link";
import { formatDateFull } from "@/lib/format";

export function SiteHeader({ date }: { date?: string }) {
  return (
    <header className="border-b border-black/5 bg-[color:var(--color-bg)]">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          BuildSpeak
        </Link>
        <div className="flex items-center gap-5 text-sm text-[color:var(--color-muted)]">
          {date && <span>{formatDateFull(date)}</span>}
          <Link href="/vocab" className="hover:text-[color:var(--color-fg)]">
            生词本
          </Link>
        </div>
      </div>
    </header>
  );
}
