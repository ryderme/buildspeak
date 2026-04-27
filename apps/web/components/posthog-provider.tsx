"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, track, isReady } from "@/lib/analytics";

/** Mount once at the root. Initialises PostHog and emits a $pageview on every
 *  App Router pathname change. */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    if (!isReady()) return;
    track("$pageview", {
      $current_url: typeof window !== "undefined" ? window.location.href : pathname,
      pathname,
    });
  }, [pathname]);

  return <>{children}</>;
}
