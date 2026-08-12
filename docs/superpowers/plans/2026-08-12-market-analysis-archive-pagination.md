# Market Analysis Archive Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the live market-analysis body from the home screen and expose current and historical analyses only through a four-items-per-page archive.

**Architecture:** Add a small dependency-free `market_archive.js` module that merges the live market record into persisted history and slices deterministic pages. Keep `index.html` responsible for rendering and interaction, while `archive_analysis.py` remains the persistence owner.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js `assert`, Playwright with local static server

## Global Constraints

- Preserve the current briefing, index panels, market regime, and aggregate BUY/HOLD/SELL judgment.
- Do not directly edit generated `market_history.js`.
- Merge `LIVE_AN.market` by date so a same-day persisted record is replaced rather than duplicated.
- Show exactly 4 archive records per page on desktop and mobile.
- Preserve the user-owned untracked `work/` directory.

---

### Task 1: Archive data module

**Files:**
- Create: `market_archive.js`
- Create: `test_market_archive.js`

**Interfaces:**
- Consumes: persisted history object and optional live market object
- Produces: `GaeoMarketArchive.mergeMarketEntries(history, liveMarket)` and `GaeoMarketArchive.paginateMarketEntries(entries, page, pageSize)`

- [ ] **Step 1: Write the failing unit tests**

Create fixtures that prove a live same-day record replaces history without duplication, results remain newest-first, page 1 contains items 1–4, page 2 contains items 5–8, and out-of-range pages clamp safely.

- [ ] **Step 2: Run the unit test and verify RED**

Run: `node test_market_archive.js`

Expected: failure because `market_archive.js` does not exist.

- [ ] **Step 3: Implement the minimal module**

Use a browser/Node-compatible factory. Copy inputs, accept live records only when text or points exist, derive the key from `updated.slice(0, 10)`, sort descending, and return `{items, page, pageSize, total, totalPages}` from the paginator.

- [ ] **Step 4: Run the unit test and verify GREEN**

Run: `node test_market_archive.js`

Expected: `market archive unit tests passed`.

### Task 2: Home archive rendering and pagination

**Files:**
- Modify: `index.html:1779-1806`
- Modify: `index.html:3833`
- Modify: `index.html:5412-5513`
- Modify: `sw.js:1-15`
- Create: `test_market_archive_browser.js`

**Interfaces:**
- Consumes: `window.GaeoMarketArchive`, `MARKET_HISTORY`, and `LIVE_AN.market`
- Produces: collapsed `.mk-hist`, at most four `.mk-day` records, and `.mk-page-btn` navigation

- [ ] **Step 1: Write the failing browser test**

Start `node test_static_server.js`, open the real home page at desktop and mobile widths, and assert: `.mk-an` is absent; opening `.mk-hist` reveals exactly four `.mk-day` records; a next-page click changes the first rendered date; and mobile also renders at most four records.

- [ ] **Step 2: Run the browser test and verify RED**

Run: `node test_market_archive_browser.js`

Expected: failure because the live `.mk-an` block is still present and all history records render at once.

- [ ] **Step 3: Integrate the archive module**

Load `market_archive.js` immediately after `market_history.js`. Remove only the live `.mk-an` market-analysis body. Keep market regime and tally rendering. Track archive open state and page in module-level variables, render the current four-item slice, add accessible previous/page-number/next buttons, and rerender on navigation.

- [ ] **Step 4: Add responsive pagination styles and cache entry**

Add compact wrapping pagination styles, active and disabled states, and mobile sizing. Add `market_archive.js` to the service-worker shell and increment the shell cache version.

- [ ] **Step 5: Run browser and unit tests and verify GREEN**

Run: `node test_market_archive.js` and `node test_market_archive_browser.js` with `test_static_server.js` running.

Expected: both pass with no page errors or failed local asset requests.

### Task 3: Regression verification and release

**Files:**
- Verify all modified and created files

**Interfaces:**
- Consumes: completed Tasks 1–2
- Produces: tested `main` commit on `origin/main`

- [ ] **Step 1: Run the static regression suite**

Run every non-server `test_*.js` contract test, then the relevant browser test.

- [ ] **Step 2: Inspect the final diff**

Run `git diff --check` and confirm `market_history.js` plus `work/` are unchanged.

- [ ] **Step 3: Synchronize and commit**

Fetch `origin/main`, merge only if necessary, stage the explicit implementation files, and commit with `feat: paginate archived market analysis`.

- [ ] **Step 4: Push and verify**

Push `main` to `origin`, then confirm local `HEAD` equals `origin/main`.
