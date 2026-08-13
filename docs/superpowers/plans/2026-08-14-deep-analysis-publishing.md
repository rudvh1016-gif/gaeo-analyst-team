# GAEO Deep Analysis Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish every completed GAEO Deep Analysis record as a permanent, discoverable, indexable Historical Research Snapshot derived from the existing archive.

**Architecture:** `analysis_archive.js` remains the only record store. A focused Node generator validates records and produces a five-item home manifest, paginated editorial Archive pages, individual static Snapshot pages, and a sitemap manifest; existing UI and automation consume those derived outputs.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js generators and tests, Python archive pipeline, GitHub Pages, GitHub Actions.

## Global Constraints

- Deep Analysis is not Study content, stock study, auto analysis, TARO-only analysis, news analysis, or generic AI analysis.
- Do not add a new analysis engine or Research DB.
- Preserve all existing stock detail, home briefing, score, and BUY/HOLD/SELL behavior.
- Only complete real records may be published; fixtures, mocks, tests, corrupted and incomplete records stay private.
- Home loads only the latest five published records, not the full archive.
- Permalinks are stable, real paths with actual `<a href>` links and self canonicals.
- Existing Historical Snapshots are never silently overwritten or deleted by a newer analysis.
- Generated pages must not expose prompts, secrets, debug logs, or private metadata.

---

### Task 1: Generator core and validation contract

**Files:**
- Create: `deep_analysis_publish.js`
- Create: `test_deep_analysis_publish.js`

**Interfaces:**
- Consumes: `{ archive, tickers }` plain objects loaded from existing JS files.
- Produces: `normalizePublishedRecords(archive, tickers)`, `snapshotSlug(record)`, `snapshotPath(record)`, `isPublishableSnapshot(snapshot)`.

- [ ] **Step 1: Write failing unit tests**

Test a valid four-axis record, an incomplete record, a `tier:auto` record, a retry with the same ticker and timestamp, two analyses on one day, current-name Backfill, and descending `analysisCreatedAt` ordering.

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run: `node test_deep_analysis_publish.js`

Expected: FAIL because `deep_analysis_publish.js` does not exist.

- [ ] **Step 3: Implement pure validation and normalization functions**

Use `ticker + normalized updated minute` as `snapshotId`; include `ticker`, `stockName`, `sector`, `analysisCreatedAt`, `updated`, `base`, `baseAt`, four axes, `chief`, and deterministic permalink.

- [ ] **Step 4: Run the focused test**

Run: `node test_deep_analysis_publish.js`

Expected: PASS.

### Task 2: Static Snapshot, Archive, home manifest, and SEO generation

**Files:**
- Modify: `deep_analysis_publish.js`
- Create: `generate_deep_analysis.js`
- Create: `test_generate_deep_analysis.js`
- Generate: `deep_analysis_latest.js`
- Generate: `deep_analysis_manifest.json`
- Generate: `research/deep-analysis/index.html`
- Generate: `research/deep-analysis/page/*/index.html`
- Generate: `research/deep-analysis/<ticker>/<timestamp>/index.html`

**Interfaces:**
- Consumes: Task 1 normalized records.
- Produces: `renderSnapshotPage(record)`, `renderArchivePage(records, page, pageSize)`, five-entry `DEEP_ANALYSIS_LATEST`, and JSON sitemap manifest.

- [ ] **Step 1: Add failing generator tests**

Assert unique title, unique description, self canonical, Article and BreadcrumbList JSON-LD, exact published date, Historical context copy, stock detail backlink, initial HTML findings, 20-item Pagination, latest five order, real href links, and absence of `noindex`.

- [ ] **Step 2: Run tests and verify render functions are missing**

Run: `node test_generate_deep_analysis.js`

Expected: FAIL on missing generator exports.

- [ ] **Step 3: Implement quiet editorial HTML renderers and atomic output generation**

Write generated files only after all records validate and all HTML strings are built. Keep existing outputs if generation throws.

- [ ] **Step 4: Generate Backfill pages from the current Archive**

Run: `node generate_deep_analysis.js`

Expected: generated Snapshot count equals publishable Archive record count; home manifest contains at most five records.

- [ ] **Step 5: Run focused tests again**

Run: `node test_deep_analysis_publish.js` and `node test_generate_deep_analysis.js`.

Expected: PASS.

### Task 3: Home discovery and stock-detail permalink integration

**Files:**
- Modify: `index.html`
- Create: `test_deep_analysis_ui.js`

**Interfaces:**
- Consumes: global `DEEP_ANALYSIS_LATEST` and deterministic permalink helper semantics.
- Produces: home editorial list and `이 분석만 보기` links in every existing Deep Analysis archive entry.

- [ ] **Step 1: Add failing static UI assertions**

Assert `deep_analysis_latest.js` loads independently of `analysis_archive.js`, home markup appears inside `.hdb-context` after actions, rows are anchors, mobile remains a vertical list, and archive rows expose actual permalinks.

- [ ] **Step 2: Run UI tests and confirm failure**

Run: `node test_deep_analysis_ui.js`

Expected: FAIL because the new home section and permalink hooks are absent.

- [ ] **Step 3: Implement restrained home styles, markup, and rendering**

Use typography, whitespace, and dividers only. Display stock name and date; include a real Archive link and quiet Empty State.

- [ ] **Step 4: Add stock-detail Snapshot anchors**

Compute the same deterministic URL from ticker and `snap.updated`; preserve all accordion behavior.

- [ ] **Step 5: Run existing home and new UI tests**

Run: `node test_deep_analysis_ui.js` and `node test_home_daily_brief.js`.

Expected: PASS.

### Task 4: Archive persistence, automated publishing, Sitemap, and permanent agent rules

**Files:**
- Modify: `archive_analysis.py`
- Modify: `generate_sitemap.js`
- Modify: `.github/workflows/update-analysis.yml`
- Create: `docs/DEEP_ANALYSIS_PUBLISHING.md`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `.claude/skills/종목분석 스킬/SKILL.md`
- Create: `test_deep_analysis_pipeline.py`

**Interfaces:**
- Consumes: generated `deep_analysis_manifest.json` and existing completed archive records.
- Produces: permanent unbounded Archive records, automatic build/stage sequence, sitemap URLs, and discoverable agent workflow rules.

- [ ] **Step 1: Add failing pipeline tests**

Assert `ARCHIVE_CAP` no longer truncates records, future snapshots persist historical ticker/name/sector/id fields, the workflow runs `generate_deep_analysis.js` after archive generation, generated outputs are staged, Sitemap reads the manifest automatically, and all three instruction entry points reference `docs/DEEP_ANALYSIS_PUBLISHING.md`.

- [ ] **Step 2: Run pipeline tests and confirm failure**

Run: `python test_deep_analysis_pipeline.py`

Expected: FAIL on the cap, missing workflow command, missing documentation, and missing Sitemap integration.

- [ ] **Step 3: Update archive persistence and workflow**

Remove destructive Snapshot truncation while retaining time ordering. Persist historical identity fields using `tickers.js` lookup where available. Add `analysis_archive.js`, manifests, and `research/deep-analysis` to the workflow stage list.

- [ ] **Step 4: Integrate Sitemap manifest**

Parse only generated canonical entries, retain their actual analysis date as `lastmod`, and keep existing content entries unchanged.

- [ ] **Step 5: Add the permanent publishing rule and pointers**

Document SAVE → PUBLISH → LINK → ARCHIVE → SURFACE ON HOME → ADD TO SITEMAP, completion gates, commands, failure recovery, and the absolute Deep Analysis/Study distinction.

- [ ] **Step 6: Run pipeline tests**

Run: `python test_deep_analysis_pipeline.py`

Expected: PASS.

### Task 5: Full generation, regression, browser, SEO, and security verification

**Files:**
- Regenerate: `research/deep-analysis/**`, `deep_analysis_latest.js`, `deep_analysis_manifest.json`, `sitemap.xml`
- Verify: all modified and existing test files

**Interfaces:**
- Consumes: the complete implementation.
- Produces: release evidence and a clean intentional diff.

- [ ] **Step 1: Regenerate all Deep Analysis outputs and Sitemap**

Run: `node generate_deep_analysis.js` then `node generate_sitemap.js`.

- [ ] **Step 2: Run focused and full static test suites**

Run every `test_*.js` and `test_*.py` file appropriate to the local environment; record any pre-existing environment-only failures separately.

- [ ] **Step 3: Validate generated SEO and security invariants**

Check canonical/Sitemap equality, unique title/description, valid JSON-LD, no `noindex`, exact dates, 6-digit ticker, public fields only, and absence of `api key`, `system prompt`, `debug log`, fixture, mock, or internal instructions in generated HTML.

- [ ] **Step 4: Perform desktop and mobile browser checks**

Serve the worktree locally, capture the home, Archive, and Snapshot at 1440px and 390px, verify no horizontal overflow and all real links resolve to HTTP 200.

- [ ] **Step 5: Review the entire diff and preserve existing behavior**

Run `git diff --check`, inspect deleted lines, confirm no changes to `analysis.js`, TARO, scores, or BUY/HOLD/SELL calculations, and confirm generated outputs only reflect the existing Archive.

- [ ] **Step 6: Commit, push, open PR, merge main, and verify remote main**

Push `agent/deep-analysis-publishing`, create the PR, merge it, and confirm the resulting `origin/main` contains the feature commit and a clean tree.

