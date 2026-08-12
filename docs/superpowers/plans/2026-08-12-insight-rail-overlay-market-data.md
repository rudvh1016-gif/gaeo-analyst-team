# Insight Rail Overlay and Market Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open the desktop insight panel without resizing the page and add consistently formatted live price and aggregate-score context to its stock lists.

**Architecture:** Keep the existing fixed rail and sliding panel, but remove the body-driven `.wrap` layout mutation. Add deterministic formatting and lookup helpers to the rail core, then reuse them in the four stock renderers so data is resolved from the latest loaded snapshots at render time.

**Tech Stack:** Static HTML/CSS, browser JavaScript, Node assert tests, Playwright browser tests.

## Global Constraints

- Desktop insight panels are overlays and must not alter main-content geometry.
- Mobile behavior and lazy feature loading remain unchanged.
- Recent storage contains only identity and visit-time data; current market values are derived during rendering.
- Only task-owned files are staged; the untracked `work/` directory remains untouched.

---

### Task 1: Lock formatting and score behavior with unit tests

**Files:**
- Modify: `test_insight_rail.js`
- Modify: `insight-rail.js`

**Interfaces:**
- Produces: `GaeoInsightRailCore.formatWon(value)` returning a comma-separated whole-won string or an empty string.
- Produces: `GaeoInsightRailCore.resolveTotalScore(code, brief)` returning the current aggregate score or `null`.

- [ ] **Step 1: Write the failing test**

```js
assert.strictEqual(core.formatWon(14600), '14,600원');
assert.strictEqual(core.formatWon(14600.4), '14,600원');
assert.strictEqual(core.resolveTotalScore('005930', {signals:{'005930':{t:64}}}), 64);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_insight_rail.js`
Expected: FAIL because the new core methods do not exist.

- [ ] **Step 3: Implement the helpers and use them in renderers**

Add pure core format/score helpers, a latest-price lookup, compact price markup, integer-won realtime event formatting, and recent aggregate-score markup.

- [ ] **Step 4: Run test to verify it passes**

Run: `node test_insight_rail.js`
Expected: PASS with `insight rail tests passed`.

### Task 2: Preserve page geometry and one-line labels

**Files:**
- Modify: `insight-rail.css`
- Modify: `test_insight_rail_browser.js`

**Interfaces:**
- Consumes: existing `.gaeo-insight-shell`, `.gir-rail`, `.gir-panel`, and `.wrap` DOM contracts.
- Produces: overlay-only panel behavior and compact one-line labels.

- [ ] **Step 1: Write the failing browser assertions**

Capture `.wrap` before opening the panel and assert its x-coordinate and width remain unchanged after opening. Assert each rail label has one rendered line.

- [ ] **Step 2: Run browser test to verify it fails**

Run: start `python -m http.server 8877`, then `node test_insight_rail_browser.js`.
Expected: FAIL because the 1680px rule changes `.wrap` geometry and labels wrap.

- [ ] **Step 3: Implement the minimal CSS fix**

Remove the `.gaeo-insight-open .wrap` mutation and apply compact `white-space: nowrap` label styling with sufficient button width.

- [ ] **Step 4: Extend and pass data presentation browser assertions**

Assert price chips appear in Top 30, Today Changes, Realtime, and Recent; assert Recent includes an aggregate score; assert won event values do not contain `.0원`.

- [ ] **Step 5: Run complete verification**

Run: `node test_insight_rail.js`, `node test_insight_rail_browser.js`, and `git diff --check`.
Expected: all commands exit 0.

### Task 3: Publish the verified change

**Files:**
- Stage only: `insight-rail.css`, `insight-rail.js`, `test_insight_rail.js`, `test_insight_rail_browser.js`, and the two design documents.

**Interfaces:**
- Produces: one main-branch commit pushed to `origin/main`.

- [ ] **Step 1: Review the diff and repository status**

Run: `git diff --check`, `git diff -- <owned files>`, and `git status -sb`.

- [ ] **Step 2: Commit intentionally**

```bash
git add insight-rail.css insight-rail.js test_insight_rail.js test_insight_rail_browser.js docs/superpowers/specs/2026-08-12-insight-rail-overlay-market-data-design.md docs/superpowers/plans/2026-08-12-insight-rail-overlay-market-data.md
git commit -m "fix: stabilize insight rail layout and context"
```

- [ ] **Step 3: Push main**

Run: `git push origin main`.
Expected: remote `main` advances to the new commit.
