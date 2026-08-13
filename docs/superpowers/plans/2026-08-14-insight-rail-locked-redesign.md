# Insight Rail Locked Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign GAEO's existing desktop insight rail into one restrained editorial system without changing any data, ranking, routing, persistence, or loading behavior.

**Architecture:** Keep `insight-rail.js` as the isolated display/controller module and add pure formatter helpers to `GaeoInsightRailCore`. Render every tab with shared semantic row classes while `insight-rail.css` supplies scoped tokens and layout; no new dependency or data fetch is introduced.

**Tech Stack:** Static HTML, vanilla JavaScript, scoped CSS, Node assertion tests, Playwright browser tests.

## Global Constraints

- Existing six tabs, routes, localStorage, cache, lazy loading, ranking and analysis engines remain unchanged.
- Panel width remains 280–320px and desktop breakpoint remains 1280px.
- No new font asset, library, chart, gradient, badge system, polling, or mobile rail.
- Important metrics always include their actual source meaning and unit.
- Existing dark mode and reduced-motion behavior remain functional.

---

### Task 1: Meaningful display formatters

**Files:**
- Modify: `test_insight_rail.js`
- Modify: `insight-rail.js`

**Interfaces:**
- Produces: `formatNumber(value)`, `formatScore(value)`, `formatPanelTime(value, mode)`, `signalMetric(event)` on `GaeoInsightRailCore`.
- `signalMetric(event)` returns `{ label: string, value: string }` using actual event type/unit.

- [ ] Add assertions for integer decimal removal, meaningful decimal retention, unified date/time output, and mappings for RSI, volume ratio, lower/upper band and fallback types.
- [ ] Run `node test_insight_rail.js` and confirm failure because the new formatter API is absent.
- [ ] Implement the pure formatter/mapping functions without changing calculation sources.
- [ ] Run `node test_insight_rail.js` and confirm all assertions pass.
- [ ] Commit `Add insight rail display semantics`.

### Task 2: Shared editorial row grammar

**Files:**
- Modify: `test_insight_rail.js`
- Modify: `insight-rail.js`

**Interfaces:**
- Consumes: Task 1 formatters.
- Produces: semantic markup classes `gir-ranking-row`, `gir-change-row`, `gir-signal-row`, `gir-history-row`, `gir-article-row`, `gir-metric-label`, `gir-metric-value`.

- [ ] Add source/markup contract assertions for labelled `종합`, `종합점수`, `RSI`, `거래량`, `밴드`, `위`, and editorial news order.
- [ ] Run the test and confirm failure on missing semantic markup.
- [ ] Refactor Top 30, changes, news, live and recent renderers to shared row grammar; retain click targets and data attributes.
- [ ] Confirm empty/error paths never render `undefined`, `NaN`, or `null`.
- [ ] Run unit tests and commit `Unify insight rail row grammar`.

### Task 3: Three-horizon rotation presentation

**Files:**
- Modify: `test_insight_rail.js`
- Modify: `insight-rail.js`

**Interfaces:**
- Consumes: `ROTATION_SNAPSHOT.summary`, `.recommendedHorizon`, `.sectors`, `.candidateStocks`, `.summary.shortTerm`.
- Produces: `gir-rotation-section` blocks for recommended horizon/current leader, next candidate, and short-term leader.

- [ ] Add contract assertions that the renderer uses dynamic horizon, observation dates, current leader stocks, candidate stocks, and short-term sector stocks with explicit `TARO`/`순환` labels.
- [ ] Run tests and confirm failure with the current two-card layout.
- [ ] Implement three text/divider sections with at most two actual representative stocks each and no new selection algorithm.
- [ ] Run tests and commit `Clarify insight rail rotation horizons`.

### Task 4: Scoped visual refinement

**Files:**
- Modify: `test_insight_rail.js`
- Replace display rules in: `insight-rail.css`

**Interfaces:**
- Consumes: shared markup classes from Tasks 2–3.
- Produces: scoped `--gir-*` tokens and restrained rail/panel styles.

- [ ] Add CSS contract assertions for 300px panel, 1280px breakpoint, active indicator, small typography, divider rows, no transform hover, no gradient/glow, and reduced motion.
- [ ] Run tests and observe failures against the current black pill/card styling.
- [ ] Implement neutral active rail, sticky editorial header, 18px panel padding, typography hierarchy, text-based market summary, dividers, quiet hover/focus, dark mode and skeleton.
- [ ] Run tests and commit `Refine insight rail editorial styling`.

### Task 5: Functional and visual browser verification

**Files:**
- Modify: `test_insight_rail_browser.js`

**Interfaces:**
- Verifies the live static page at port 8877 without production changes.

- [ ] Add browser assertions for all six tabs, labelled numbers, rotation sections, 1920/1440/1280 geometry, horizontal overflow, scroll, footer links, recent delete/clear, keyboard, state restoration, dark mode and hidden mobile lazy loading.
- [ ] Run the browser test and confirm any missing behavior fails before final fixes.
- [ ] Fix only display regressions uncovered by the test.
- [ ] Capture final screenshots at 1920, 1440 and 1280 for visual audit.
- [ ] Run the browser test again and commit `Verify locked insight rail redesign`.

### Task 6: Full repository verification and integration

**Files:**
- Review all changed files; no planned production additions.

**Interfaces:**
- Produces a green feature branch suitable for PR and main merge.

- [ ] Run every non-server JS test, every Python test and every browser test.
- [ ] Run `git diff --check`, inspect the complete diff and verify no data/calculation files changed.
- [ ] Regenerate no datasets because this is display-only.
- [ ] Commit any verification-only test adjustment.
- [ ] Push the branch, create a PR to `main`, merge it, fetch remote `main`, and verify the feature commit is an ancestor of `origin/main`.
