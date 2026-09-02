# Growth Foundation P0 Implementation Plan

> Execute on `codex/growth-foundation-p0` from starting SHA `d016195cfcd229b54869b27fd791444bcb1e6380`.

**Goal:** Make public content URLs, deindexing, freshness, claims and product measurement deterministic while preserving the static app and every legacy route.

**Architecture:** Add one shared URL policy module and one consent-aware analytics module, keep all existing generators as sources of truth, extend contract gates, and regenerate deterministic outputs.

**Tech:** Static HTML/CSS/JavaScript, Node generators/tests, Python audit/gates, Playwright.

### Task 1: Freeze audit and contracts

**Files:**
- Add: `docs/GROWTH_FOUNDATION_AUDIT.md`
- Add: `test_growth_urls.js`
- Add: `test_sitemap_contract.js`
- Add: `test_product_analytics.js`
- Add: `test_growth_claims.js`
- Add: `test_content_freshness.py`
- Modify: `test_seo_publishing.py`

Write the required behavior first and confirm targeted tests fail for the existing robots, URL, sitemap, analytics and freshness behavior.

### Task 2: Implement URL and robots policy

**Files:**
- Add: `growth_urls.js`
- Modify: `index.html`
- Modify: `generate_snapshots.js`
- Modify: `generate_rss.js`
- Modify: `robots.txt`
- Modify: `seo_publish_gate.py`
- Modify: `sw.js`
- Add: `docs/GROWTH_URL_POLICY.md`
- Add: `docs/GROWTH_SEARCH_CONSOLE_CHECKLIST.md`

Use the shared mapping for head signals, sharing and generators. Remove only the stock robots disallow. Keep stock page noindex and human pages indexable. Preserve query CTAs with `nofollow`.

### Task 3: Make sitemap dates truthful

**Files:**
- Modify: `generate_sitemap.js`
- Regenerate: `sitemap.xml`
- Modify: `test_sitemap_contract.js`

Remove every clock fallback, validate stored dates, use live production date for home, stored dates for content/research and Git dates or omission for static pages. Validate XML, canonical-only URLs, no query/noindex/missing/duplicate URLs.

### Task 4: Add freshness and accurate claims

**Files:**
- Add: `content_freshness_audit.py`
- Add: `docs/GROWTH_CONTENT_FRESHNESS.md`
- Modify: `generate_snapshots.js`
- Modify: `index.html`
- Modify: `about.html`
- Modify: `manifest.json`
- Modify: `generate_rss.js`
- Modify: `CLAUDE.md`
- Modify: `docs/CURRENT_STATUS.md`
- Regenerate: `snap/**`, `rss.xml`, `llms.txt`

Render deterministic 30-day archive notices. Correct only current-facing ambiguous claims. Do not bulk-rewrite historical arrays; record any individually justified changes.

### Task 5: Add product analytics foundation

**Files:**
- Add: `product_analytics.js`
- Modify: `index.html`
- Modify: `sw.js`
- Add: `docs/GROWTH_MEASUREMENT_PLAN.md`
- Add: `.claude/agents/gaeo-product-analytics.md`
- Add: `docs/GROWTH_DISTRIBUTION_PLAYBOOK.md`

Reuse the one existing GA loader. Replace free-form event calls for core actions with controlled taxonomy, add delegated evidence/source hooks and route/return/stale hooks, and keep blocked analytics harmless.

### Task 6: Generate and verify

Run targeted tests, all required generators, SEO gates, every terminating Python test, every non-Playwright JavaScript test, and explicit Playwright flows. Inspect the diff for deletions, data churn, secrets and unrelated changes.

### Task 7: Integrate and deliver

Commit logical stages. Fetch and merge `origin/main`; preserve genuinely newer generated market data. Re-run verification, push, create one PR, wait for CI, fix failures, merge under standing authorization, record merged main SHA, and verify the currently served production version with a bounded wait.

