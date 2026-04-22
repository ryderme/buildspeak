import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

type AppShellProps = {
  active: "home" | "reader" | "vocab" | "profile";
  readerHref: string;
  streakDays: number;
  children: ReactNode;
};

export const AppShell = ({
  active,
  readerHref,
  streakDays,
  children,
}: AppShellProps) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(47,111,235,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(253,230,138,0.5),transparent_28%),var(--paper)] text-[color:var(--ink)]">
    <SiteHeader active={active} readerHref={readerHref} streakDays={streakDays} />
    <main className="pb-16">{children}</main>
  </div>
);
