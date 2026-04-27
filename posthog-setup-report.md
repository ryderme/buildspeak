<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the BuildSpeak pipeline with PostHog analytics. Three files were created or modified:

- **`packages/pipeline/src/posthog.ts`** _(new)_ — PostHog singleton configured for a short-lived CLI process (`flushAt: 1`, `flushInterval: 0`, `enableExceptionAutocapture: true`). Reads credentials from environment variables.
- **`packages/pipeline/src/fetch-feed.ts`** _(edited)_ — captures `feed_fetched` after the three public GitHub feeds are pulled and written to disk.
- **`packages/pipeline/src/index.ts`** _(edited)_ — captures `pipeline_started` at the top of each run, `digest_processed` after every digest file is fully translated/enriched/written, `pipeline_completed` when all targets finish, and routes unhandled errors through `captureException` before shutdown.

Environment variables `POSTHOG_API_KEY` and `POSTHOG_HOST` were added to `.env` (repo root), which is already loaded by the pipeline's `env.ts` loader.

| Event | Description | File |
|---|---|---|
| `feed_fetched` | Fires when public feeds are fetched from GitHub and the digest file is written. Properties: `podcast_count`, `x_builder_count`, `blog_count`, `output_file`. | `packages/pipeline/src/fetch-feed.ts` |
| `pipeline_started` | Fires at the start of each pipeline run. Properties: `process_all`, `digest_count`. | `packages/pipeline/src/index.ts` |
| `digest_processed` | Fires after a single digest is fully processed. Properties: `digest_date`, `article_count`, `podcast_count`, `builder_count`, `tweet_count`, `blog_count`, `unique_word_count`, `new_words_added`, `total_word_count`. | `packages/pipeline/src/index.ts` |
| `pipeline_completed` | Fires when all targeted digests finish successfully. Properties: `process_all`, `digest_count`. | `packages/pipeline/src/index.ts` |
| `pipeline_failed` | Fires on any unhandled pipeline error via `captureException`. | `packages/pipeline/src/index.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on pipeline health and content volume:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/399332/dashboard/1514483
- **Pipeline runs over time**: https://us.posthog.com/project/399332/insights/uY2Cb3vV
- **Pipeline errors**: https://us.posthog.com/project/399332/insights/wpIbnxjn
- **Articles processed per digest run**: https://us.posthog.com/project/399332/insights/4V7z7Gpz
- **New words added per run**: https://us.posthog.com/project/399332/insights/Didqk5yR
- **Feed content mix (podcasts vs builders vs blogs)**: https://us.posthog.com/project/399332/insights/nfGemkTT

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
