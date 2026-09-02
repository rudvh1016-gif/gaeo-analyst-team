# PR 1 local test results

실행일: 2026-09-03
브랜치: `codex/editorial-foundation`
서버: 저장소의 `test_static_server.js`, `http://127.0.0.1:23002`

## 결과

- 새 editorial static contract: PASS
- Node non-browser contracts: 32/32 PASS
- Browser contracts: 15/15 PASS
- Python contracts on local Windows: 52/57 PASS, 5 baseline failures
- `git diff --check`: PASS
- 여섯 viewport horizontal overflow: 0
- 독립 최종 검토 A/B/C: 각각 Critical 0, Important 0, Minor 0

## Browser 15종

1. `test_dart_exposure.js`
2. `test_deep_analysis_browser.js`
3. `test_editorial_foundation_browser.js`
4. `test_flow_browser.js`
5. `test_full_market_browser.js`
6. `test_growth_foundation_browser.js`
7. `test_home_daily_brief_browser.js`
8. `test_insight_rail_browser.js`
9. `test_market_archive_browser.js`
10. `test_menu_scroll.js`
11. `test_paper_font.js`
12. `test_paper_ui_browser.js`
13. `test_public_release_safety_browser.js`
14. `test_rotation_refinement_browser.js`
15. `test_typography_quality.js`

모두 PASS했다. `test_playwright.js`는 공용 loader이고 실행형 테스트가 아니다. `test_static_server.js`는 검증 서버라 테스트 수에 넣지 않았다.

## Windows baseline failures

| test | local result | 분류 |
|---|---|---|
| `test_gaeo_coverage.py` | constitution pinned checksum과 현재 저장 파일 checksum 불일치 | 기존 baseline |
| `test_gaeo_evolution.py` | 같은 constitution checksum 불일치 | 기존 baseline |
| `test_paper_accounting_v2.py` | 보존된 121행 ledger checksum 계약 불일치 | 기존 baseline |
| `test_shared_token_hardening.py` | Windows `CryptProtectData` 사용 불가 | 환경 baseline |
| `test_shared_toss_token.py` | 같은 DPAPI 공유 파일 생성 불가 | 환경 baseline |

이번 PR은 constitution, evolution, paper ledger, shared token 코드를 변경하지 않는다. 실제 Linux PR CI는 57개 Python 테스트를 다시 실행하며, 그 결과가 병합 gate다.

## 고친 stale test 전제

`test_growth_foundation_browser.js`가 Safety Gate 이후에도 동의 없이 `landing_view`를 기대했고, service worker cache 이름을 `v16`으로 고정하고 있었다. 제품의 동의 경계를 약화시키지 않고 다음처럼 테스트를 고쳤다.

- 측정 이벤트를 검사하는 page에서만 명시적으로 `granted` 설정
- 동의 기본 거부와 전송 0건 검사는 별도 page에서 유지
- service worker cache 이름은 `sw.js`의 현재 상수를 읽음
- 외부 요청 차단 route와 service worker 검사를 독립 context로 분리
- 새 stylesheet를 offline shell에 넣고 cache를 `v18`로 올림

modal background를 실제 `inert`로 만들자 동의 상태를 설정하지 않은 기존 상호작용 테스트는 첫 방문 동의창에 정상적으로 차단됐다. DART, 정밀분석, 전체시장, insight rail, paper UI/font, rotation 브라우저 fixture에 명시적 `denied` 상태를 추가했고, 동의 기본 거부 자체는 Public Release Safety와 editorial 테스트에서 별도로 계속 검증한다.

## TDD evidence

- `test_editorial_foundation.js` 최초 실행: 19 failures
- implementation 후: 전체 PASS
- dialog focus test 최초 실행: `trust dialog does not receive focus` FAIL
- focus 이동 수정 후: PASS
- modal containment 보강 전: consent/trust dialog의 Tab이 배경으로 이탈해 FAIL
- 정적 inert 보강 후: 늦게 추가된 insight rail이 클릭 가능해 FAIL
- MutationObserver 기반 동적 inert, Tab·Shift+Tab 순환, 실제 배경 클릭 차단 보강 후: PASS
- typography 700 exception 제거 테스트 최초 실행: 2 failures
- `#briefTitle`을 600으로 변경 후: PASS
