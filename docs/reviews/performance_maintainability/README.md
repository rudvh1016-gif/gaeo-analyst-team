# PR 3 performance and maintainability review

Date: 2026-09-03 (KST)  
Branch: `codex/performance-maintainability`  
Base main: `77f108d6e9b8faf573ed7b03d5c914b260d0b9b8`

## Outcome

The large application stylesheet and program were moved out of `index.html` into
cacheable first-party assets without a bundler or runtime dependency. The
document file fell from 1,178,618 to 83,221 raw bytes; the comparable local
transfer measurement fell from 1,195,456 to 83,521 bytes. Existing public
globals and script order remain intact.

The main user-visible regressions found by measurement were addressed:

- direct tool links no longer paint Home and replace it later; Calculator,
  Rotation, and Full Market lab CLS moved from 0.75–0.80 to 0.00;
- the Home advertisement reserves its 300×250 placement before an ad response;
- Stock no longer downloads the 48,443,676 raw-byte full price and judgment
  histories until the user asks for the full-period chart;
- only the two observed late Wanted Sans subsets are preloaded, and the duplicate
  jsDelivr Pretendard stylesheet was removed;
- the service-worker shell moved to v20 and precaches exact query-versioned
  split CSS/JS URLs. Exact-version hits are cache-first; new versions are
  fetched and stored under exact keys, while HTML, data, and other changeable
  assets preserve no-store network-first, last-good fallback behavior.

No claim is made that extraction alone reduces cold compressed bytes. The
combined gzip model is approximately 1% larger and Home/Stock local long-task
proxies increased; both facts are recorded in `docs/PERFORMANCE_BASELINE.md`.

## Compatibility and rollback

`app_test_source.js` and `app_test_source.py` reconstruct the production document
for source-level tests that previously inspected a monolithic HTML file. They do
not run in production. The site still deploys as static files and needs no build
step. Rollback is one PR revert of the split assets, their two HTML references,
and service-worker cache version.

The heavy history files remain complete and accessible through “전체 기간 차트
보기”. Existing reduced-motion, focus, canonical, consent, analytics allowlist,
data timestamp, stale-data, PWA, and offline contracts remain tested.

## Evidence

- Reproducible method, before/after table, limitations, and route ceilings:
  `docs/PERFORMANCE_BASELINE.md`
- Machine-readable budgets: `performance-budgets.json`
- Reusable probe: `performance_probe.js`
- Static, rendered-route, and repeat/offline contracts:
  `test_performance_budget.js`, `test_performance_budget_browser.js`, and
  `test_performance_service_worker_browser.js`
- Full local inventory: `docs/reviews/performance_maintainability/TEST_RESULTS.md`

## Three-pass cross-validation

- Pass A (user/product/design/growth): PASS. It objected to the article CLS
  baseline and to claiming reusable assets while the service worker still
  forced `no-store`; the snapshot font fallback and exact-version app-shell
  cache policy resolved both objections.
- Pass B (engineering/performance/accessibility/security): PASS. It found the
  split-source safety-test blind spot, permanent blank-screen risk, incomplete
  runtime-budget enforcement, empty lightweight-chart dates, full-market route
  mismatch, watchdog false alarm, and query-version update risk. Each issue was
  reproduced, fixed, and covered by a deterministic contract.
- Pass C (SEO/public claims/data truth/regression): PASS. It found no protected
  data/model/history or generated-snapshot changes, no SEO signal drift, no
  secret pattern, and confirmed the documented lab-only numbers against the
  final files. Final counts: Critical 0, Important 0, Minor 0.
