// PostHog client wrapper for the browser. Initialised once by PostHogProvider.
// Server-side pipeline tracking lives in packages/pipeline/src/posthog.ts.

import posthog from "posthog-js";

let initialized = false;

/** Initialise PostHog. Safe to call multiple times — only takes effect once. */
export function initPostHog(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  const key = process.env["NEXT_PUBLIC_POSTHOG_KEY"];
  const host = process.env["NEXT_PUBLIC_POSTHOG_HOST"] ?? "https://us.i.posthog.com";
  if (!key) return; // Not configured — silently skip rather than crash.
  posthog.init(key, {
    api_host: host,
    // We capture pageviews manually on App Router route changes.
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false,
    disable_session_recording: true,
  });
  initialized = true;
  // Expose for DevTools inspection. Safe — phc_… is a public client key.
  if (typeof window !== "undefined") {
    (window as unknown as { posthog?: typeof posthog }).posthog = posthog;
  }
}

/** Capture an event. No-op until initPostHog has run successfully. */
export function track(event: string, properties?: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}

/** Tag every subsequent event with these properties (e.g. article id while on a reader page). */
export function register(properties: Record<string, unknown>): void {
  if (!initialized) return;
  posthog.register(properties);
}

export function unregister(key: string): void {
  if (!initialized) return;
  posthog.unregister(key);
}

export function isReady(): boolean {
  return initialized;
}
