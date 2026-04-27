"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/" || pathname.startsWith("/d/");
  const isArchive = pathname.startsWith("/archive");
  const isVocab = pathname.startsWith("/vocab");
  const isAbout = pathname.startsWith("/about");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">BuildSpeak</span>
          <span className="brand-zh">每日 builder 文摘</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href="/" data-active={isHome ? "true" : undefined}>
            今日
          </Link>
          <Link href="/archive" data-active={isArchive ? "true" : undefined}>
            归档
          </Link>
          <Link href="/vocab" data-active={isVocab ? "true" : undefined}>
            生词本
          </Link>
          <Link href="/about" data-active={isAbout ? "true" : undefined}>
            关于
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>
          BuildSpeak —{" "}
          <Link href="/about" style={{ color: "var(--color-ink-soft)" }}>
            关于本项目
          </Link>
        </span>
        <span className="keyboard-hint">
          BUILT IN PUBLIC ·  跟随 builders 而非 influencers
        </span>
      </div>
    </footer>
  );
}
