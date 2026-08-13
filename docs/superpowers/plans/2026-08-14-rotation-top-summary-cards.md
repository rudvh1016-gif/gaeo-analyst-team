# Rotation Top Summary Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine only the six rotation summary cards so the recommended horizon, leader, today change, candidate, regime, and validation context are understandable within five seconds.

**Architecture:** Keep all existing data and calculations. Replace only the summary-card render fragment with semantic presentation blocks and update only `.rot-summary` and `.rot-card*` scoped CSS. Extend existing Node and Playwright contracts to protect meaning, layout, and responsive behavior.

**Tech Stack:** Static JavaScript, HTML template strings, CSS, Node `assert`, Playwright with local static server.

## Global Constraints

- Preserve every existing rotation calculation, snapshot field, interaction, lazy-loading path, and lower page section.
- Never hardcode example market values or the recommended horizon.
- Use `period.return.adjusted` only with the label `구성 종목 중앙값 등락 · 표본 보정`.
- Do not add libraries, fonts, pills, badges, gradients, glow, glass, progress bars, heavy shadows, or per-card accent colors.
- Do not change shared global card styles.
- Keep the desktop grid `1.3fr repeat(5,minmax(0,1fr))` and existing responsive wrapping.

---

### Task 1: Semantic summary-card hierarchy

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation-ui.js`

**Interfaces:**
- Consumes: `summary`, `leader`, `leaderToday`, `candidate`, `regime`, `recommendedPerformance` already created by `renderView`.
- Produces: `.rot-card-context`, `.rot-card-primary`, `.rot-card-secondary`, `.rot-card-measure`, `.rot-meta`, and `.rot-meta-block` markup.

- [ ] **Step 1: Write the failing contract test**

Assert that the rendered summary contains the new semantic classes, that the today card places `반도체` before `-1.2% · 약화`, that the adjusted return label is exact, and that calculation, expected observation, validation, evaluation, short-term, breadth, and market-regime data remain visible.

- [ ] **Step 2: Run the test to verify RED**

Run: `node test_rotation_ui.js`

Expected: failure because `.rot-card-context` and the subject-first today structure do not exist.

- [ ] **Step 3: Implement the summary fragment**

Create small template helpers inside `renderView` for metadata blocks and replace only the `<section class="rot-summary">` fragment. Build the current-observation title from the existing leader name, preserve every existing date and short-term value, and split recommended validation metadata into separate blocks.

- [ ] **Step 4: Run the test to verify GREEN**

Run: `node test_rotation_ui.js`

Expected: `rotation UI contract passed`.

- [ ] **Step 5: Commit**

```powershell
git add rotation-ui.js test_rotation_ui.js
git commit -m "Clarify rotation summary card hierarchy"
```

### Task 2: Scoped editorial typography and spacing

**Files:**
- Modify: `test_rotation_ui.js`
- Modify: `rotation.css`

**Interfaces:**
- Consumes: semantic classes from Task 1.
- Produces: scoped typography and metadata rhythm without changing the global design system.

- [ ] **Step 1: Write the failing CSS contract test**

Assert the lead title is no larger than 20px, metadata label/value rules differ in weight, metadata groups have deliberate spacing, mobile padding stays within the requested range, and the summary rules add no gradient or shadow.

- [ ] **Step 2: Run the test to verify RED**

Run: `node test_rotation_ui.js`

Expected: failure because the new scoped rules do not exist.

- [ ] **Step 3: Implement scoped CSS**

Keep the current grid and border/radius. Set restrained type sizes and weights, increase vertical rhythm, use a simple inline two-column metadata layout for today values without boxes, and add dark-mode text overrides only where existing variables do not cover the new classes.

- [ ] **Step 4: Run the test to verify GREEN**

Run: `node test_rotation_ui.js`

Expected: `rotation UI contract passed`.

- [ ] **Step 5: Commit**

```powershell
git add rotation.css test_rotation_ui.js
git commit -m "Refine rotation summary card typography"
```

### Task 3: Responsive browser and cache verification

**Files:**
- Modify: `test_rotation_refinement_browser.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: rendered card hierarchy and scoped CSS.
- Produces: repeatable worktree-local browser checks and fresh asset versions.

- [ ] **Step 1: Write the failing browser assertions**

Add an environment-configurable local URL, verify today subject order, lead-title line count, metadata visibility, unchanged lower sections, and dark-mode readability at all required widths.

- [ ] **Step 2: Run the browser test to verify RED**

Run with `GAEO_TEST_URL=http://127.0.0.1:8902/index.html?m=rotation node test_rotation_refinement_browser.js`.

Expected: failure on the new hierarchy assertions before Task 1 and Task 2 are present, or on stale asset versions before the version bump.

- [ ] **Step 3: Complete browser support**

Update `index.html` query versions for `rotation.css` and `rotation-ui.js` only. Do not change the lazy-loading path or feature registry.

- [ ] **Step 4: Run browser and full regression verification**

Run the rotation Playwright test at 1920, 1440, 1280, 1024, 768, 390, and 360. Run all non-browser `test*.js` files and `git diff --check`.

- [ ] **Step 5: Commit**

```powershell
git add index.html test_rotation_refinement_browser.js
git commit -m "Verify responsive rotation summary cards"
```
