# Navigation, Scorecard, and Market Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the persistent refresh control, consolidate research into one scorecard, move weekday statistics into a dedicated menu view, and simplify index labels on desktop and mobile.

**Architecture:** Keep the existing single-file application architecture in `index.html`. Add one focused regression script that reads the production HTML and evaluates the leaderboard function with representative `TEAM_WEIGHTS`, then use browser checks for responsive layout and interactions. Preserve legacy `leaderboard` routes by normalizing them to the unified `scorecard` mode.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js assertions, Python local HTTP server, browser automation.

## Global Constraints

- The refresh button sits immediately after search on PC and mobile.
- The fixed notice text is exactly: `주가는 장중 약 10분마다, 자동 분석은 약 30분마다 갱신됩니다. 꼭 자주 새로고침을 진행해주세요!`
- The main navigation label is `성적표`; the unified view uses `TEAM_WEIGHTS.global.acc` for cumulative analyst results.
- Weekday averages do not appear on the home screen and open through `전체 메뉴 > 등락률 확인`.
- Decorative index emoji are removed; labels are `KR 코스피` and `KR 코스닥`.
- Existing generated data files are read only and must not be edited manually.

---

### Task 1: Add regression tests for the approved UI contract

**Files:**
- Create: `test_navigation_scorecard.js`
- Test: `test_navigation_scorecard.js`

**Interfaces:**
- Consumes: production markup and inline JavaScript from `index.html`.
- Produces: one Node command that fails when any approved navigation, copy, scorecard, route, or market requirement regresses.

- [ ] **Step 1: Write the failing test**

Create assertions that require `navRefresh`, `refreshNotice`, the exact notice copy, search-refresh-profile ordering, `location.reload()`, top label `성적표`, `mode-rates`, `rateView`, no standalone `mode-leaderboard`, legacy mode normalization, `TEAM_WEIGHTS.global.acc`, visible sample counts, `KR 코스피`, `KR 코스닥`, and no `IDX_META` emoji property. Assert that `rateView` owns the sole `id="dowbar"` element.

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_navigation_scorecard.js`

Expected: FAIL because `navRefresh`, `rateView`, and the unified scorecard contract do not exist yet.

- [ ] **Step 3: Keep the test focused on user-visible behavior**

Use `node:assert/strict`, `fs.readFileSync`, substring ordering, and small regular expressions. Do not duplicate production rendering code in the test.

- [ ] **Step 4: Commit only after Tasks 2-4 make this test pass**

The test remains red while each production slice is implemented.

### Task 2: Implement the persistent refresh control

**Files:**
- Modify: `index.html` global navigation CSS, markup, and navigation script.
- Test: `test_navigation_scorecard.js`

**Interfaces:**
- Produces: `#navRefresh`, `#refreshNotice`, and click behavior using `window.location.reload()`.
- Preserves: `#navSearchToggle`, `#navProfileToggle`, `#navMenuToggle`, and all panel behavior.

- [ ] **Step 1: Add navigation markup**

Insert `#navRefresh` between search and profile. Use a small `새로고침` label above a red circular child with an inline white refresh SVG. Add `aria-label="최신 주가와 분석 새로고침"` and connect it to `#refreshNotice` with `aria-describedby`.

- [ ] **Step 2: Add the fixed notice**

Place `#refreshNotice` directly after the navigation element. Set its exact approved copy and make it fixed below the navigation, one line on PC and two compact lines on mobile.

- [ ] **Step 3: Adjust layout variables**

Add `--gaeo-notice-h` and include it in `.wrap` top padding, sticky offsets, and scroll margins so the notice never covers content. Use a mobile value large enough for two lines.

- [ ] **Step 4: Add refresh behavior**

On click, disable the button, add an `is-refreshing` class for SVG rotation, change the accessible label to `새로고침 중`, and call `window.location.reload()` on the next animation frame.

- [ ] **Step 5: Run the focused test**

Run: `node test_navigation_scorecard.js`

Expected: still FAIL only on scorecard and rate-view assertions; refresh assertions pass.

### Task 3: Consolidate research and scorecard using the verified aggregate

**Files:**
- Modify: `index.html` leaderboard rendering, scorecard rendering, mode markup, routing, and navigation.
- Test: `test_navigation_scorecard.js`

**Interfaces:**
- Consumes: `TEAM_WEIGHTS.global.acc`, `.weights`, `.graded`, `.team`, `history.js`, and `price_history.js`.
- Produces: `leaderboardHTML()` returning the analyst ranking section embedded by `renderScorecard()`.

- [ ] **Step 1: Replace the cumulative calculation source**

Build analyst rows from `TEAM_WEIGHTS.global.acc[id]`. Each row contains `id`, agent display metadata, `n`, `acc`, and current weight. Sort by non-null `acc` descending and then `n` descending. Display `채점 N건`, never `표본 부족`, when aggregate data exists.

- [ ] **Step 2: Add an honest unavailable state**

If `TEAM_WEIGHTS` is unavailable, return a short `성적 자료를 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.` message rather than a sample-size claim.

- [ ] **Step 3: Embed the ranking in the scorecard**

Render team/weekly summary first, analyst ranking second, best and worst examples next, then analyst deep dive and v3 status. Remove the standalone `#leaderboard` view.

- [ ] **Step 4: Consolidate navigation and routes**

Change the primary `리서치` label and target to `성적표`/`scorecard`. Remove `mode-leaderboard`. Normalize `mode==='leaderboard'` to `scorecard` at the beginning of `setMode` so old links continue to work.

- [ ] **Step 5: Run the focused test**

Run: `node test_navigation_scorecard.js`

Expected: still FAIL only on rate-view and index-label assertions; scorecard assertions pass.

### Task 4: Move weekday statistics and simplify index labels

**Files:**
- Modify: `index.html` view markup, mode routing, weekday renderer placement, index metadata, and headings.
- Test: `test_navigation_scorecard.js`

**Interfaces:**
- Produces: `#mode-rates`, `#rateView`, and the existing single `#dowbar` inside that view.
- Preserves: the existing `DOW_STATS` calculation and chart markup.

- [ ] **Step 1: Create the dedicated view**

Remove `#dowbar` from `.home-dashboard`. Add a hidden view `#rateView` alongside the other mode views with a clear heading, explanatory sentence, and the sole `#dowbar` container.

- [ ] **Step 2: Add the full-menu entry and mode**

Add `#mode-rates` labeled `등락률 확인` to the full menu. Extend `setMode`, section copy, visibility toggles, click handlers, and navigation scroll targets with `rates`/`rateView`.

- [ ] **Step 3: Remove decorative index emoji**

Replace `IDX_META` with labels `KR 코스피` and `KR 코스닥` and no emoji property. Remove the decorative chart emoji from the section heading while preserving `▲`, `▼`, and color semantics.

- [ ] **Step 4: Run focused and existing tests**

Run: `node test_navigation_scorecard.js`

Expected: PASS.

Run: `node test_metrics.js`

Expected: `metrics tests passed`.

Run: `$env:PYTHONUTF8='1'; <bundled-python> test_radar.py; <bundled-python> test_model_intelligence.py`

Expected: all tests pass with zero failures.

### Task 5: Browser verification and publication

**Files:**
- Modify only if verification reveals a defect: `index.html`, `test_navigation_scorecard.js`.

**Interfaces:**
- Consumes: completed production page.
- Produces: verified branch, pull request, merged `main`, and live deployment evidence.

- [ ] **Step 1: Run a local static server and desktop checks**

Verify at a desktop viewport that refresh follows search, the notice is one line, the scorecard includes cumulative analyst counts, the rate view opens from the full menu, and no index emoji remain.

- [ ] **Step 2: Run mobile checks**

At a 390px-wide viewport verify the notice uses two lines, all top controls fit, `전체 메뉴 > 등락률 확인` is reachable, scorecard cards use one column, and no horizontal overflow exists.

- [ ] **Step 3: Run final verification**

Run all commands from Task 4 again, followed by `git diff --check` and `git status --short`.

- [ ] **Step 4: Commit and push**

Commit production and test changes with a scoped message, push `feature/header-refresh-button`, open a PR to `main`, and merge it after checks pass.

- [ ] **Step 5: Verify live deployment**

Fetch the deployed `index.html` with a cache-busting query and confirm the refresh notice, `성적표`, `등락률 확인`, and `KR 코스닥` are present.
