# GAEO Rotation Product Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the deterministic rotation engine while making today’s one-day move and the recommended-horizon structure immediately distinguishable across summary, map, ranking, and sector detail.

**Architecture:** Keep `rotation_snapshot.js` and `recommendedHorizon` as the source of truth. Add small pure view helpers in `rotation-ui.js` that project `periods[1]` into TODAY and the selected horizon into medium-term context, then apply rotation-scoped editorial CSS and responsive elliptical map geometry without changing score calculation.

**Tech Stack:** Vanilla JavaScript, SVG, CSS, Python unittest, Node assert/vm, Playwright browser checks.

## Global Constraints

- Do not redesign or reweight the rotation engine.
- Do not add LLM calls.
- Preserve 1/3/5/20, 60/120/200, Walk-forward, lead-lag, similar history, stocks, current view, explanations, and warnings.
- Use `recommendedHorizon` dynamically; never hardcode 20 as the UI source of truth.
- TODAY must use one-trading-day values and must not overwrite the selected-horizon score.
- Do not fabricate missing values or additive contribution numbers.
- Keep nodes circular; expand layout radius and available map height instead of using `scaleY`.
- Scope all visual changes to the rotation page.

---

### Task 1: Time-axis view model and data integrity contracts

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`
- Modify: `test_rotation.py`

**Interfaces:**
- Consumes: `sector.periods['1']`, `sector.periods[String(horizon)]`, `recommendedHorizon.horizon`, `summary.period`, `dataCutoff`.
- Produces: `todayView(sector)`, `timeAxisSummary(data, sector, horizon)`, `freshnessView(data)`.

- [ ] Add failing Node assertions requiring a one-day TODAY view, a selected-horizon view, and stale-date disclosure.
- [ ] Run `node test_rotation_ui.js` and confirm it fails because the new view helpers/copy are absent.
- [ ] Add Python integrity assertions that 20-day return, relative strength, breadth, benchmark and period metadata share the same cutoff.
- [ ] Implement minimal pure helpers and export them through `GaeoRotation`.
- [ ] Run the focused Node and Python tests and confirm they pass.

### Task 2: Summary, ranking, and selected-sector editorial structure

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`
- Modify: `rotation.css`

**Interfaces:**
- Consumes: Task 1 view helpers.
- Produces: TODAY summary card, ranking secondary line, selected-sector two-axis header/metrics/summary.

- [ ] Add failing assertions for the new hero copy, TODAY summary, today ranking line, selected-sector TODAY block, and two-axis natural-language explanation.
- [ ] Run `node test_rotation_ui.js` and confirm the expected RED failure.
- [ ] Render actual one-day values next to selected-horizon values without changing `period.score`.
- [ ] Replace nested gray metric boxes and repeated pills with editorial rows and dividers scoped under `.rotation-view`.
- [ ] Run the focused UI contract test and confirm it passes.

### Task 3: Responsive rotation map and whitespace fix

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`
- Modify: `rotation.css`
- Create: `test_rotation_refinement_browser.js`

**Interfaces:**
- Consumes: `mapLayout()` and `orbitNodes()`.
- Produces: desktop elliptical orbit geometry with circular nodes, a fill-height map panel, preserved mobile circular geometry.

- [ ] Add failing contract assertions for desktop `rx/ry`, circular node radius, and fill-height map CSS.
- [ ] Run `node test_rotation_ui.js` and confirm the map contract fails.
- [ ] Implement elliptical node placement using separate horizontal/vertical radii and a taller desktop viewBox.
- [ ] Make the desktop map panel/SVG use available grid-row height and remove the wasted vertical gap without fixed viewport heights.
- [ ] Add Playwright checks at 1920/1440/1280/1024/768/390/360px for circle geometry, horizontal overflow, map/right-column balance, and section continuity.
- [ ] Run contract and browser tests and confirm they pass.

### Task 4: Preserve content and complete regression verification

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `test_rotation_refinement_browser.js`
- Modify: `index.html` only if rotation asset cache versions require bumping.

**Interfaces:**
- Consumes: complete rotation page.
- Produces: explicit preservation and route/cache regression evidence.

- [ ] Add assertions that Walk-forward, overlap explanation, metric guide, 1/3/5/20, 60/120/200, lead-lag, success and failure history, stocks, current view, and calculation details remain present.
- [ ] Verify the recommended horizon matches summary, default map, ranking, and detail.
- [ ] Run all rotation Python/Node/browser tests.
- [ ] Run all repository non-browser tests and relevant existing browser suites.
- [ ] Run `git diff --check`, inspect the final diff, and confirm no generated data or user-owned files are staged.
- [ ] Commit, push the feature branch, create a PR, merge it to `main`, and verify local/remote `main` commit equality.
