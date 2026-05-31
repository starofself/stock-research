# STARFOLIO Content Translation Pipeline

This pipeline generates English translations for the Korean blog and note content without touching the Next.js app code. It reads source content from `content/` and writes merged translation JSON under `data/i18n/`.

## Run

```sh
ANTHROPIC_API_KEY=... node scripts/translate-content.mjs
```

The script uses Anthropic Messages API:

- URL: `https://api.anthropic.com/v1/messages`
- Model: `claude-haiku-4-5-20251001`
- Required header: `anthropic-version: 2023-06-01`

If `ANTHROPIC_API_KEY` is not set, the script skips live API calls, prints an estimate, and writes hand-translated English samples for the three most recent blog posts.

## Flags

```sh
node scripts/translate-content.mjs --only-sample
node scripts/translate-content.mjs --limit 25
node scripts/translate-content.mjs --ids 2026052601,224236248280,research:2026-05-31-kiwoom-2026h2-global-stock-etf-bottleneck-war-deepresearch.md
```

- `--only-sample`: write only the three hand-translated newest blog samples; no API calls.
- `--limit N`: translate at most `N` changed or missing entries.
- `--ids a,b,c`: translate only the listed blog `naver_logno` keys or note IDs.

Flags can be combined, except `--only-sample` intentionally ignores live API work.

## Output Contract

Blog output:

```txt
data/i18n/blog.en.json
```

Shape:

```json
{
  "224236248280": {
    "title": "English title",
    "summary": "1-2 sentence English summary.",
    "html": "<div>English body with original HTML structure preserved</div>",
    "translatedAt": "2026-05-31T00:00:00.000Z",
    "sourceHash": "sha256-of-source-markdown"
  }
}
```

Notes output:

```txt
data/i18n/notes.en.json
```

Shape is the same, keyed by the app's note ID scheme:

```txt
{prefix}:{basename.md}
```

For bundled content this matches `lib/content.ts`: `oc:...`, `research:...`, `theme:...`, or `daily:...`.

## Idempotency and Resume Behavior

Each entry stores `sourceHash`, computed as SHA-256 of the source markdown file. If the stored hash matches the current source hash, the entry is skipped.

The script merges into existing JSON and writes progress after every translated post, so interrupted runs can be resumed safely.

## Estimate

The repository currently contains 1081 blog posts and 1 note. The script estimates cost from source size using Haiku 4.5 native pricing of about `$1/M` input tokens and `$5/M` output tokens. On this content set, the current estimate is about 21.4M input tokens and 19.5M output tokens, or about `$119`.

Runtime depends on post length and API latency. With concurrency `3`, the current estimate is about 109-164 minutes for the full 1082-item run; use `--limit` for staged runs.
