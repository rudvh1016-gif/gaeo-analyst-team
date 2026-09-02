# GAEO performance baseline and budgets

Date: 2026-09-03 (KST)  
Scope: public static product only; no model, scoring, dataset, or history mutation

## Measurement contract

These numbers are reproducible **lab measurements**, not field Core Web Vitals and not a claim about every visitor. The probe uses headless Chromium at 390×844, blocks known advertising/CDN hosts to remove auction variance, denies optional analytics, blocks the service worker for first-party route comparison, runs each route three times, and reports the median. A cold visit uses a new browser context; the warm visit uses a new tab in the same context so the HTTP cache can be reused without an explicit reload.

Run locally with the repository static server:

```text
node test_static_server.js 8877
node performance_probe.js http://127.0.0.1:8877 3
```

Run against the public site:

```text
node performance_probe.js https://gaeoteam.com 3
```

The local test server intentionally sends uncompressed files and no cache headers. Local transfer bytes therefore expose raw payload cost and are compared local-to-local only. GitHub Pages sends compressed, cacheable responses, so live results must be compared live-to-live. LCP is the lab LCP entry; `interactionMs` is the time from route action to the scenario's ready selector; `tbtProxyMs` is the sum of long-task time above 50ms and is not Lighthouse TBT. Service-worker controlled repeat/offline behavior is a separate acceptance check.

An earlier draft used Playwright request routing to block third parties. Routing disables Chromium's HTTP cache, so those warm numbers were discarded. The checked-in probe uses CDP URL blocking and separate tabs.

## Public baseline before PR3

Live `https://gaeoteam.com`, current main before PR3, cold three-run median:

| Route | LCP ms | CLS | Ready ms | TBT proxy ms | DOM | Requests | Transfer | Initial HTML |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home | 140 | 0.06 | 123 | 106 | 6,372 | 56 | 986,876 B | 353,705 B |
| Stock search/open | 136 | 0.17 | 209 | 108 | 7,427 | 60 | 6,304,276 B | 353,705 B |
| Research hub | 144 | 0.02 | 77 | 0 | 1,129 | 26 | 470,681 B | 12,803 B |
| Research article | 124 | 0.10 | 60 | 0 | 123 | 21 | 372,100 B | 7,922 B |
| Calculator | 660 | 0.79 | 368 | 106 | 6,594 | 58 | 1,011,979 B | 353,705 B |
| Rotation | 140 | 0.80 | 364 | 104 | 7,289 | 58 | 1,045,638 B | 353,705 B |
| Full market | 132 | 0.75 | 445 | 106 | 7,620 | 61 | 1,293,880 B | 353,705 B |
| About | 172 | 0.00 | 72 | 0 | 283 | 24 | 504,062 B | 9,983 B |

The valid warm baseline transferred 0 bytes in this profile because GitHub Pages' HTTP cache satisfied the second-tab visit. Parsing, rendering, and app work still ran: warm TBT proxy was 139ms on Home and 137–138ms on Calculator/Rotation/Full market. Warm CLS remained 0.74–0.75 on those deep links, confirming that the problem was the delayed view replacement, not network transfer.

The stock route loaded `indicators.js`, `auto_analysis.js`, `history.js`, and `price_history.js` immediately. The last two were 4,886,925 compressed bytes in the live run and 48,443,676 raw bytes locally, even though the user had not asked to open history.

## Local before/after evidence

The same uncompressed local server and scenario probe were used on base main and the PR3 working tree. Values below are cold medians.

| Route | Metric | Before | After | Result |
|---|---|---:|---:|---:|
| Home | Initial HTML | 1,195,456 B | 83,521 B | −93.0% |
| Home | Ready proxy | 133 ms | 46 ms | −65.4% |
| Home | CLS | 0.06 | 0.06 | within 0.10 budget |
| Home | Total raw transfer | 2,773,262 B | 2,777,749 B | +0.2%; bytes redistributed into cacheable assets |
| Stock | Total raw transfer | 55,546,146 B | 7,106,957 B | −87.2% |
| Stock | DOM nodes | 7,427 | 6,519 | −12.2% |
| Stock | Ready proxy | 204 ms | 99 ms | −51.5% |
| Stock | CLS | 0.11 | 0.06 | within 0.10 budget |
| Research article | CLS | 0.10 | 0.05 | improved; within 0.10 budget |
| Calculator | Ready proxy | 332 ms | 68 ms | −79.5% |
| Calculator | CLS | 0.79 | 0.00 | fixed |
| Rotation | Ready proxy | 376 ms | 56 ms | −85.1% |
| Rotation | CLS | 0.75 | 0.00 | fixed |
| Full market | Ready proxy | 421 ms | 191 ms | −54.6% |
| Full market | CLS | 0.80 | 0.00 | fixed |

The Home long-task proxy increased from 102–104ms to 139ms locally, and Stock increased from 103ms to 117ms. This regression is recorded rather than hidden: extracting the 805KB app program improves document size, cache independence, and maintainability, but does not reduce the program that must execute. The route-specific 2.5s LCP and 500ms TBT-proxy acceptance tests remain green; further app-module extraction is a later incremental task, not grounds for a risky rewrite in this PR.

Raw/gzip-9 asset model (for structural comparison, not a network result):

| Asset | Raw | gzip-9 |
|---|---:|---:|
| Before: monolithic `index.html` | 1,178,618 B | 351,818 B |
| After: `index.html` | 83,221 B | 26,039 B |
| After: `app.js` | 805,921 B | 257,160 B |
| After: `app-shell.css` | 309,407 B | 72,543 B |

The combined cold gzip model is approximately neutral (+1.0%). The evidence-backed wins are earlier document completion, independent asset caching/rollback, removal of duplicate CDN font CSS, on-demand history, and stable deep-link rendering—not a fabricated cold-byte saving from file extraction.

## Changes and preserved behavior

- The 308KB inline stylesheet and 805KB inline app program are now `app-shell.css` and `app.js`, served directly with no build step and in their original execution order. Public globals remain public.
- The duplicate jsDelivr Pretendard stylesheet and preconnect were removed. Self-hosted Wanted Sans remains the primary font with `font-display: swap`; only the two late-discovered subsets observed causing Home wrapping movement are preloaded.
- Deep links no longer wait 300ms while painting Home first. The target view and its existing lazy bundle are prepared before reveal, font readiness is bounded at 1.2s, and the Stock heading receives focus after the hidden preparation state is removed. Direct Home is not hidden.
- The Home 300×250 advertisement reserves 282px before the SDK responds. A blocked/failed ad hides its content without collapsing the reservation and moving the article below it.
- Stock open uses the existing five-day lightweight price data. `history.js` and `price_history.js` load only after “전체 기간 차트 보기” or the existing history action. The long chart and all historical records remain available.
- `auto_analysis.js`, detailed indicators, rotation snapshot, calculators, and full-market data retain their route-specific lazy loading. Home does not preload full analysis/history.
- Service worker cache is `gaeo-shell-v20`; the exact query-versioned `app.js` and `app-shell.css` URLs are in the 29-entry shell and are cache-first only on an exact version hit. A new version miss is fetched and stored under its exact key, with an ignore-query last-good response allowed only after network failure. Navigation, data, and other changeable JS/CSS remain no-store network-first. No unbounded runtime cache or speculative prefetch was added.
- Existing reduced-motion behavior, hidden-chart rendering guards, consent boundary, canonical synchronization, data timestamps, stale-data warnings, PWA install behavior, public analytics allowlist, and offline shell remain under browser/contract tests.

## Enforced budgets

`performance-budgets.json` is the machine-readable source. `test_performance_budget.js` guards raw asset size, inline growth, route budgets, heavy-data eager loading, service-worker shell count, cache version, exact-version app-shell caching, and duplicate font CDN regression. `test_performance_budget_browser.js` checks the core SPA routes at 390px, including CLS ≤0.10, DOM ceilings, Home heavy-data exclusion, advertisement reservation, and Stock history deferral. `test_performance_service_worker_browser.js` proves the v20 shell, bounded precache, exact-version hit/miss transition, cached real data timestamp, canonical metadata, and offline last-good response.

The route budgets are intentionally ceilings rather than claimed targets: Home live transfer ≤1.0MB; Stock initial live transfer ≤1.5MB; Research hub ≤650KB; article ≤500KB; Calculator ≤1.2MB; Rotation ≤1.3MB; Full market ≤1.6MB; About ≤650KB. Every route has lab LCP ≤2.5s and CLS ≤0.10. Budgets must be updated only with a recorded baseline and reason, never merely to make a regression pass.

## Post-merge acceptance

After Pages deploys, rerun the live probe and compare live-to-live. Required gates are: all routes return 200; Home preserves the light brief; Stock opens without `history.js`/`price_history.js`; the history button still loads the long chart; deep-link CLS is ≤0.10; canonical/consent/timestamps remain present; the service worker controls a repeat visit and serves the last-good shell offline. The deployed values should be appended to the next program PR if a new commit is required after PR3 is already merged.
