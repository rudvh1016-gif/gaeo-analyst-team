# PR 3 local test results

Execution date: 2026-09-03 (KST)  
Branch: `codex/performance-maintainability`  
Server: repository `test_static_server.js`, `http://127.0.0.1:8877`

## Completed results

- JavaScript syntax checks for split app, probe, and new contracts: PASS
- Node static/non-browser contracts: 34/34 PASS
- Playwright/browser contracts: 18/18 PASS
- Python contracts on local Windows: 52/57 PASS
- Performance probe: 8/8 representative routes completed
- New route performance contract: all 8 representative routes PASS
- Service-worker v20 exact-version transition/repeat/offline contract: PASS, 29/32 shell entries
- `git diff --check`: PASS
- Growth Foundation browser gate: PASS
- Public Release Safety, product analytics, sitemap, performance-claim gates: PASS
- Secret hygiene: actual token patterns 0, hardcoded credentials 0, public archive sensitive fields 0
- Protected data/model/history files in the PR diff: 0

## Rendered performance assertions

At 390×844 on the local static server with third parties blocked:

| Route | CLS | DOM | Heavy-history behavior |
|---|---:|---:|---|
| Home | 0.062 | 6,375 | full analysis/history not requested |
| Stock deep link | 0.000 | 6,506 | history files absent until explicit click |
| Research hub | 0.021 | 1,129 | static route within budget |
| Research article | 0.048 | 123 | deterministic snapshot fallback within budget |
| Calculator | 0.000 | 6,597 | route ready within budget |
| Rotation | 0.000 | 7,292 | route ready within budget |
| Full Market | 0.000 | 7,623 | route ready within budget |
| About | 0.000 | 283 | static route within budget |

The Stock full-period button then loaded both `history.js` and
`price_history.js` and replaced itself with the existing long chart. Offline
repeat navigation rendered the controlled shell, retained canonical metadata,
and displayed a real cached data-as-of timestamp.

## Windows baseline differences

The same five known local-only failures from PR 1 and PR 2 remain:

- `test_gaeo_coverage.py` and `test_gaeo_evolution.py`: pinned constitution
  checksum versus Windows checkout byte representation;
- `test_paper_accounting_v2.py`: preserved 121-row append-only ledger byte
  checksum;
- `test_shared_token_hardening.py` and `test_shared_toss_token.py`: DPAPI is
  unavailable in the sandboxed Windows runtime.

None of the corresponding constitution, ledger, token, generated data, model,
score, price, flow, archive, rotation, or paper-result files changed in this PR.
The Ubuntu PR CI remains the authoritative cross-platform merge gate.
