# GAEO Home Daily Brief Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing home briefing into a responsive editorial layout without changing any live data or decision logic.

**Architecture:** Keep the existing data adapters and polling intact. Add a pure `homeBriefDecisionModel(tally)` view-model helper, render the briefing from that model, and scope all new styles under `.home-daily-brief` so other pages cannot regress.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node contract tests, Playwright browser tests.

## Global Constraints

- Preserve all market data, BUY/HOLD/SELL decisions, ranking calculations, routes, fetches, caches, and current actions.
- Use the actual complete BUY list; never cap it at 30.
- Desktop uses inline expansion; mobile uses an accessible bottom sheet.
- Do not modify generated data files or global shared component styles.

---

### Task 1: Editorial View Model and Contract

**Files:**
- Modify: `index.html`
- Create: `test_home_daily_brief.js`

**Interfaces:**
- Consumes: `analysisTally(): {counts,buy,ranked,total,asOf}`.
- Produces: `homeBriefDecisionModel(tally): {counts,total,buy,preview,asOf}` with stable descending score order and every tied BUY retained.

- [ ] Write a failing Node test that extracts `homeBriefDecisionModel()` and asserts dynamic BUY count, all BUY rows, first-three preview, and stable tie order.
- [ ] Run `node test_home_daily_brief.js`; expect failure because the helper does not exist.
- [ ] Implement the pure helper without changing `analysisTally()`.
- [ ] Run the test; expect pass.

### Task 2: Editorial Markup and Scoped Styling

**Files:**
- Modify: `index.html`
- Modify: `test_home_daily_brief.js`

**Interfaces:**
- Consumes: existing `briefMarket`, `homeBrief`, `briefExtra`, `briefSectorBtn`, and `briefNewsBtn` nodes.
- Produces: `.home-daily-brief`, `.hdb-context`, `.hdb-decisions`, `.hdb-distribution`, `.hdb-preview`, and `.hdb-buy-region`.

- [ ] Add failing assertions for the two-column surface, Market/Breadth/Sector labels, neutral count typography, absence of `.tly` inside the briefing, and mobile single-column rules.
- [ ] Run `node test_home_daily_brief.js`; expect the new selectors to be missing.
- [ ] Replace only the briefing article markup and add scoped CSS tokens and responsive rules.
- [ ] Update the existing rendering functions to place unchanged sentences into named editorial rows and unchanged counts into neutral statistics.
- [ ] Run the contract test; expect pass.

### Task 3: Complete BUY List Interactions

**Files:**
- Modify: `index.html`
- Modify: `test_home_daily_brief.js`
- Create: `test_home_daily_brief_browser.js`

**Interfaces:**
- Consumes: `homeBriefDecisionModel()`, `jumpToStock(name)`, and the real BUY list.
- Produces: `openHomeBriefBuyList()`, `closeHomeBriefBuyList()`, inline desktop region, and mobile modal sheet.

- [ ] Add failing contract tests for actual `BUY 전체 N종목 보기`, dialog semantics, Escape handling, and stock-row data attributes.
- [ ] Add a Playwright test for desktop inline expansion, mobile sheet open/close/scroll, focus restoration, and a stock click.
- [ ] Run both tests and confirm expected failures.
- [ ] Implement the complete list and interaction wiring with 280ms motion and reduced-motion override.
- [ ] Run both tests; expect pass.

### Task 4: Regression and Release

**Files:**
- Review: `index.html`, `test_home_daily_brief.js`, `test_home_daily_brief_browser.js`

- [ ] Run syntax checks and `git diff --check`.
- [ ] Run all Python and Node contract tests.
- [ ] Run browser tests at 1920, 1440, 1280, 1024, 390, and 360 widths.
- [ ] Inspect screenshots for overflow, clipped stock names, accidental pills, nested cards, and mobile sheet reachability.
- [ ] Review the full diff for any data/logic/generated-file change and remove unrelated edits.
- [ ] Commit the scoped files, push the branch, create a PR, merge to `main`, and confirm local and remote `main` match.

