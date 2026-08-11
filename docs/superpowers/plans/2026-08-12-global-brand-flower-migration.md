# GAEO Flower Brand Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every GAEO brand-facing legacy black symbol with the supplied five-petal flower while preserving the wordmark, navigation behavior, page layout, and existing OG strategy.

**Architecture:** Keep the static-site architecture. Store one transparent master symbol plus white-background app-icon derivatives at the project root to match the existing asset convention; reference the transparent symbol from Header and About, and keep manifest/service-worker paths stable for install assets.

**Tech Stack:** Static HTML/CSS, Web App Manifest, service worker, PNG/WebP assets, Node.js contract tests.

## Global Constraints

- The supplied flower image is the official symbol; do not redraw, recolor, outline, glow, animate, or reshape it.
- Header and About use the transparent flower without a visible square container; installed icons use `#FFFFFF` with the centered flower occupying 62–70% of the canvas.
- Preserve the `Gaeo`/`GAEO` wordmark typography, Header height, navigation positions, click behavior, page layout, and current OG image.
- Replace only brand symbols, not ordinary UI icons.
- Brand image alt text is `GAEO`; linked logo navigation keeps its existing accessible name.
- Existing manifest icon sizes and service-worker asset paths remain stable.

---

### Task 1: Brand Asset Contract

**Files:**
- Create: `test_brand_assets.js`
- Test: `test_brand_assets.js`

**Interfaces:**
- Consumes: `index.html`, `about.html`, `manifest.json`, `sw.js`, generated PNG/WebP files.
- Produces: a repository-wide contract that fails when a legacy brand symbol, incorrect icon background, missing size, or wrong logo reference returns.

- [ ] **Step 1: Write the failing test**

Create assertions for `gaeo-flower-symbol.png`, `gaeo-flower-symbol.webp`, app icons 180/192/512/1024, `favicon-16.png`, `favicon-32.png`, Header/About references, manifest purposes, unchanged `gaeo-share-v3.jpg`, and absence of `id="gaeo-symbol"` or old Black/White/Gray brand samples.

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_brand_assets.js`

Expected: FAIL because the flower assets and new references do not exist yet.

- [ ] **Step 3: Keep the test scoped to real output**

Read actual PNG dimensions/background pixels and HTML/JSON contents; do not mock image metadata or DOM strings.

- [ ] **Step 4: Re-run and confirm the same expected failure**

Run: `node test_brand_assets.js`

Expected: FAIL on missing `gaeo-flower-symbol.png`.

### Task 2: Exact Flower Asset Family

**Files:**
- Create: `gaeo-flower-symbol.png`
- Create: `gaeo-flower-symbol.webp`
- Modify: `app-icon-180.png`
- Modify: `app-icon-192.png`
- Modify: `app-icon-512.png`
- Modify: `app-icon-1024.png`
- Create: `favicon-16.png`
- Create: `favicon-32.png`

**Interfaces:**
- Consumes: `C:/Users/개오/AppData/Local/Temp/codex-clipboard-888a014e-bfc0-408f-85ee-fb30267af839.png`.
- Produces: transparent display assets and white-background install/favicon assets with centered, undistorted flower pixels.

- [ ] **Step 1: Copy the supplied transparent source as the PNG master**

Preserve its 1536×1024 RGBA pixels and transparent exterior; create WebP losslessly from the same master.

- [ ] **Step 2: Produce white-background install icons**

Center the unmodified flower on square `#FFFFFF` canvases with a maximum flower extent of 66% and export the existing 180/192/512/1024 size set.

- [ ] **Step 3: Produce favicon derivatives**

Export 16×16 and 32×32 white-background icons from the same centered master without an outline or new colors.

- [ ] **Step 4: Run the focused contract**

Run: `node test_brand_assets.js`

Expected: still FAIL on HTML references, while all image dimension/background assertions pass.

### Task 3: Header, About, Manifest, and Metadata Migration

**Files:**
- Modify: `index.html`
- Modify: `about.html`
- Modify: `manifest.json`
- Modify: `sw.js`
- Test: `test_brand_assets.js`

**Interfaces:**
- Consumes: assets from Task 2.
- Produces: every audited GAEO brand surface using the flower while maintaining existing behavior.

- [ ] **Step 1: Replace the Header mark**

Use `gaeo-flower-symbol.webp` with PNG fallback semantics where practical, preserve the `Gaeo` wordmark and `globalHome` behavior, remove the old square border/background, and use 34px desktop/32px mobile sizing.

- [ ] **Step 2: Replace About identity artwork**

Remove the embedded legacy SVG definition, render the transparent flower with `alt="GAEO"`, and replace the three legacy color samples with one white-background official app-icon sample.

- [ ] **Step 3: Update favicon, Apple, manifest, and structured-data references**

Point favicon links to 16/32 derivatives, Apple to `app-icon-180.png`, keep manifest paths and dimensions stable, keep a separate maskable entry, and retain `gaeo-share-v3.jpg` for OG/Twitter.

- [ ] **Step 4: Update the service-worker cache version**

Cache the new flower and favicon assets without changing navigation or offline behavior.

- [ ] **Step 5: Run focused and full tests**

Run: `node test_brand_assets.js`

Expected: PASS.

Run: every repository `test_*.js` and `python -X utf8 -m unittest discover -p 'test_*.py'`.

Expected: all existing tests PASS.

### Task 4: Visual and Publication QA

**Files:**
- Verify: `index.html`
- Verify: `about.html`
- Verify: `manifest.json`

**Interfaces:**
- Consumes: completed static site.
- Produces: browser and Git evidence that desktop/mobile layouts, icon crops, and navigation remain correct.

- [ ] **Step 1: Verify desktop and mobile Header/About**

Serve the repository locally and inspect desktop and mobile widths. Confirm transparent Header flower, unchanged wordmark/navigation, official About flower, no clipping, and no layout regression.

- [ ] **Step 2: Verify install icons**

Inspect 180/192/512/1024 and favicon outputs at original size; confirm white corners, centered 62–70% flower extent, preserved blue-gray/ivory/yellow texture, and safe crop.

- [ ] **Step 3: Verify repository scope**

Run: `git diff --check`, `git status --short`, and a legacy-symbol search excluding ordinary UI icons.

Expected: only intended brand files and the plan/test are changed; user-owned `work/` remains unstaged.

- [ ] **Step 4: Commit and publish**

Commit message: `GAEO 꽃 브랜드 심볼 전역 교체`

Push `agent/global-brand-flower`, create a ready PR to `main`, merge it, fetch `origin/main`, and verify the feature commit is an ancestor of remote main.
