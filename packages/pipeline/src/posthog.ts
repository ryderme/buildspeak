// posthog.ts — PostHog analytics client for the pipeline CLI.
// This is a short-lived process, so flushAt/flushInterval are set to send
// events immediately rather than batching.

import { PostHog } from "posthog-node";
import { loadEnv } from "./env.ts";

loadEnv();

export const posthog = new PostHog(process.env["POSTHOG_API_KEY"] ?? "", {
  host: process.env["POSTHOG_HOST"],
  flushAt: 1,
  flushInterval: 0,
  enableExceptionAutocapture: true,
});

// Stable distinct ID for this automated pipeline process.
export const PIPELINE_DISTINCT_ID = "buildspeak-pipeline";
