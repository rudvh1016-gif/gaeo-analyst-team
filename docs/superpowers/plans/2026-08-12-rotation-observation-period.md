# Rotation Observation Period Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the next candidate sector's expected 20-trading-day observation date range without implying a predicted rank-change date.

**Architecture:** A focused Python calendar helper computes future KRX sessions from the latest close date. `rotation_engine.py` stores the derived range in the snapshot, and `rotation-ui.js` only formats the supplied metadata.

**Tech Stack:** Python standard library, static JSON-in-JavaScript snapshot, vanilla JavaScript, Node assertions, Python unittest

## Global Constraints

- Do not predict when the candidate becomes rank 1.
- Start on the next KRX trading day and count the start as trading day 1.
- Exclude weekends and known KRX market holidays.
- Render `예상 관찰기간 YYYY.MM.DD~YYYY.MM.DD (N거래일·휴장일 제외)` only when a candidate and ready recommendation exist.
- Do not alter sector scores, ranking, or recommendation selection.

---

### Task 1: Future KRX observation range

**Files:**
- Create: `krx_calendar.py`
- Modify: `test_rotation.py`

**Interfaces:**
- Produces: `future_trading_period(base_date: str, trading_days: int) -> dict`
- Returns: `{"periodStart": "YYYY-MM-DD", "periodEnd": "YYYY-MM-DD", "tradingDays": int}`

- [ ] **Step 1: Write the failing test**

Add a literal assertion that `future_trading_period("2026-08-11", 20)` equals `2026-08-12` through `2026-09-09`.

- [ ] **Step 2: Run test to verify it fails**

Run: `python -m unittest test_rotation.RotationMathTest.test_future_trading_period_excludes_weekends_and_krx_holidays`

Expected: FAIL because `krx_calendar` or the function does not exist.

- [ ] **Step 3: Write minimal implementation**

Implement ISO-date parsing, weekday filtering, the documented KRX holiday set, and inclusive session counting with `datetime.date` and `datetime.timedelta`.

- [ ] **Step 4: Run the focused test**

Run the same unittest command and expect PASS.

### Task 2: Snapshot exposure and candidate-card rendering

**Files:**
- Modify: `rotation_engine.py`
- Modify: `rotation-ui.js`
- Modify: `test_rotation.py`
- Modify: `test_rotation_ui.js`
- Modify: `rotation_snapshot.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `future_trading_period(base_date, recommended_horizon)`
- Produces: `summary.candidateObservationPeriod`

- [ ] **Step 1: Write failing snapshot and UI tests**

Assert that a ready 20-day recommendation produces the literal range and that rendered candidate markup contains `예상 관찰기간 2026.08.12~2026.09.09 (20거래일·휴장일 제외)` but no `1위 전환 예상일`.

- [ ] **Step 2: Run focused tests and observe expected failures**

Run: `python -m unittest test_rotation.RotationSnapshotTest.test_candidate_exposes_expected_observation_period` and `node test_rotation_ui.js`.

- [ ] **Step 3: Add the minimal data and rendering path**

Derive the period from the latest input date only when both a candidate and ready recommended horizon exist. Format that existing metadata in the candidate card and bump the rotation UI asset query version in `index.html`.

- [ ] **Step 4: Regenerate the current snapshot**

Run: `python compute_rotation.py --mode close --now "2026-08-11 16:20"`.

- [ ] **Step 5: Run focused and full verification**

Run all `test_*.js`, Python unittest discovery, syntax checks, and `git diff --check`.

### Task 3: Publish and merge

**Files:**
- Stage only the files listed in Tasks 1 and 2 plus this plan and its design document.

- [ ] **Step 1: Review the final diff and exclude `work/`**
- [ ] **Step 2: Commit with `순환매 예상 관찰기간 표시`**
- [ ] **Step 3: Push `agent/add-rotation-observation-period`**
- [ ] **Step 4: Create a ready PR to `main`, merge it, fetch `origin/main`, and verify the feature commit is an ancestor of the merge commit**
