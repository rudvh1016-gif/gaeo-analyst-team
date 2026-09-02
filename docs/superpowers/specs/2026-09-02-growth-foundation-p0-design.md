# Growth Foundation P0 Design

## Status

The user-provided P0 brief is the approved product and technical specification. This document records the implementation design chosen from that brief before code changes.

## Options considered

### 1. Patch each caller independently

This is the smallest diff initially, but canonical, share, RSS, promotional and related URLs would continue to drift. It does not satisfy the requirement for one deterministic mapping.

### 2. Shared deterministic URL module plus small runtime adapters

Create one dependency-free module usable from Node and the browser. Generators call it directly. The SPA head and share action call the same mapping. This keeps static architecture, enables pure tests and prevents unrelated app routes from canonicalizing to home.

This is the selected approach.

### 3. Build-time redirects to static snapshots

Redirecting legacy query routes would simplify SEO signals, but it would remove interactive app state and break the explicit legacy-link requirement.

## URL signal model

- Static human snapshot: indexable, self canonical, self OG, sitemap included.
- Human content query route: interactive and functional, early canonical and OG point to the static snapshot. The rendered title is synchronized to the opened content.
- Stock snapshot: crawlable, `noindex,follow`, self canonical, sitemap excluded.
- `?m=single&code=` and other non-content app routes: `noindex,follow`, no canonical. They are not duplicates of the homepage and must not claim it as canonical.
- Deep analysis: existing permanent research path, self canonical, sitemap included.
- Share/copy/promotional/RSS/related defaults: static canonical content URL when one exists.
- Interactive snapshot CTA: query URL remains allowed with `rel=nofollow`; it adds a bounded entry marker so the destination can measure content-to-product conversion.

## Modules

### `growth_urls.js`

A UMD/CommonJS dependency-free module. It validates content modes and numeric ids, builds canonical snapshots, classifies URLs, returns canonical/robots/page type policy, chooses share URLs and app CTA URLs, and appends allowlisted UTM values. Invalid IDs return null and are never interpolated.

### `product_analytics.js`

A UMD/CommonJS dependency-free wrapper around the existing `gtag` function. It has a fixed event allowlist and parameter allowlist, strips undefined values, rejects PII-like keys and free-form fields, deduplicates one logical emission key, safely no-ops when blocked, parses only four UTM fields, and classifies static/query routes through `growth_urls.js`.

Existing GA initialization stays exactly once in `index.html`. Default behavior preserves the current analytics state. If `window.GAEO_ANALYTICS_CONSENT_REQUIRED === true`, events remain denied until explicit consent is granted. Explicit denial always blocks emission. This creates a testable consent hook without adding a new banner or inventing a legal requirement.

### Sitemap date policy

The generator receives no clock-based fallback. Homepage lastmod comes from validated `LIVE_DATA.date`. Human content uses valid `updated`, otherwise valid `date`. Deep records use stored `lastmod`. Static pages use the most recent Git commit date for that file when Git can provide it; otherwise lastmod is omitted with a warning. Invalid required content dates stop generation with an actionable error.

### Freshness audit and archive notice

`content_freshness_audit.py` scans only five human indexable source arrays by default. It loads the JavaScript data through Node, reports exact context and age, supports JSON, and compares ids with a Git base in strict mode so old archive language does not block unrelated work. Quoted text remains visible as context but is classified and does not fail strict mode by itself.

Snapshots older than 30 days relative to the validated latest production data date show a visible notice with the record publication date. The threshold is deterministic and does not depend on the runner clock.

## Claim model

- 600-stock experience: “규칙 기반 자동분석”.
- Selected, manually requested research: “AI 보조 정밀분석”.
- TARO, DIANA, QUANT, FLOW, RISK, ROTATION, CHIEF: “분석 역할 체계”.

A scoped contract test checks named current-facing files and exact prohibited formulations. It does not scan historical content globally.

## Verification

- Pure unit tests for URLs, sitemap dates/XML, analytics and freshness.
- Existing SEO gate extended for robots/noindex and human indexability.
- Generators run from sources of truth and generated output committed.
- Local Playwright verifies representative static/query/stock/deep routes at mobile and desktop widths.
- Full existing CI-equivalent suites run with explicit skips for server and Playwright tests, followed by separate browser tests.
- Before merge, fetch and merge current origin/main, inspect generated-data conflicts, run verification again, then PR, CI, merge and bounded production verification.

