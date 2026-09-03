# GAEO Final Product Maturity Program

마지막 갱신: 2026-09-03
프로그램 시작 SHA: `b00992485ac453a0af14120df8fb15e0c60754c0`

## 상태

| 단계 | 브랜치 | 상태 | 핵심 evidence |
|---|---|---|---|
| PR 1 Editorial foundation | `codex/editorial-foundation` | PR #484 병합·배포 확인 | merge `914457f37023`; 최종 A/B/C PASS |
| PR 2 Editorial accessibility | `codex/editorial-accessibility` | PR #485 병합·배포 확인 | merge `77f108d6e9b8`; Node 33/33, Python 52/57(+기존 Windows 5), browser 16/16, A/B/C PASS |
| PR 3 Performance | `codex/performance-maintainability` | PR #486 병합·배포 확인 | merge `a54dc9b404f9`; PR CI `contract-tests` success; 프로덕션 `app-shell.css?v=20260903-p3` 200(305,327B)·홈이 `app.js?v=20260903-p3` 참조; `docs/PERFORMANCE_BASELINE.md`; HTML −93.0%, 종목 raw transfer −87.2%, 딥링크 CLS ≤0.10 |
| PR 4 Trust/SEO/Growth | 예정 | 대기 | 실제 claim·검색 evidence 기반 |
| PR 5 Governance | 예정 | 대기 | 실제 workflow/branch evidence 기반 |

## 보호 계약

- Growth Foundation: canonical과 indexation, sitemap 281 URLs, 자동 종목 crawl 허용 + `noindex,follow`, 공유 URL, 콘텐츠→제품 경로, 제품 분석 taxonomy.
- Public Release Safety: 공개 GitHub/KVdb 쓰기 없음, 토큰 저장 없음, 분석 동의 전 이벤트·자체 카운터 전송 없음, 광고·집계·자문 한계 공개.
- Data/model/history: 생성 데이터, 가격, 수급, 분석, archive, rotation, paper 결과와 계산 로직은 UI 성숙도 작업에서 불변.

## 시작 기준선

- Python 테스트: 57개
- Node 테스트: 47개 중 종료형 비브라우저 31개, 브라우저 15개, 서버 1개
- 생성 snapshot: news 63, study 35, lesson 82, estate 19, calc 14, stock 600
- `index.html`: 1,175,366 bytes
- fresh production/local home render: desktop card-like 78, bordered 63, rounded 64, shadowed 8, horizontal overflow 0
- 390px에서 홈의 직접 텍스트 leaf 297개 중 126개가 12px 미만
- 실제 프로덕션과 로컬 baseline의 측정값은 일치

## PR 1 사전 독립 검토 요약

### 합의

- Variant B `GAEO Editorial Ledger`가 적합하다.
- 검색은 첫 화면의 유일한 primary action이어야 한다.
- hero/search/daily/market/KPI/radar/DART의 읽기 surface 65~75%를 행·구분선 구조로 평탄화한다.
- input, button, chart plot, modal, drawer, stale/data warning, consent, ad boundary는 유지한다.
- 9~11.5px 금융 근거·기준시각·UI 글자는 12~16px 계층으로 교정한다.
- 기존 DOM ID, analytics event, canonical/robots/sitemap, data/model/history를 보존한다.

### 반대 의견과 결정

- 모든 border 제거와 장식적 Variant C는 조작 가능성과 금융 정보 밀도를 약화시키므로 채택하지 않는다.
- 홈에 fabricated sample 변화 종목을 넣지 않는다. 실제 관심종목 상태와 빈 상태를 유지한다.
- 최신 콘텐츠를 검색보다 위에 올리지 않는다. acquisition보다 첫 activation을 우선한다.
- `오늘/어제/실시간` 정적 단정은 피하고 `최근 거래일/직전 거래일/기준 시각`을 사용한다.
- `gaeo_seo_publishing_rules.md`의 자동 종목 robots 차단 문구는 실제 정책과 충돌한다. PR 1에서는 URL 정책을 건드리지 않고 PR 4 문서 정합성 범위에서 수정한다.

### 엔지니어링 사전 검토에서 확인한 결함과 처리

- 다크모드 동의 primary가 흰색 배경과 흰색 글자로 약 1.09:1이었다. 전용 control background/foreground token으로 교정하고 4.5:1 browser contract를 추가했다.
- 홈 주요 CTA focus outline이 투명했다. 전역 `:focus-visible`을 실제 고대비 outline으로 통일했다.
- trust/activity 정보 overlay에 dialog semantics, expanded state, open focus, Escape close, visible trigger focus return이 없었다. 기존 ID를 유지하며 보강했다.
- 첫 방문 동의 선택이 tab order 174번째였다. 첫 표시와 설정 재열기 때 동의 선택으로 focus를 이동한다.
- `test_growth_foundation_browser.js`의 동의와 service-worker v16 전제를 Safety Gate 이후 실제 계약과 맞췄다.

### PR 1 로컬 검증 현황

- 새 editorial contract: 최초 19 FAIL 확인 후 PASS
- Node non-browser: 32/32 PASS
- Browser: 15/15 PASS
- Python on Windows: 52/57 PASS; 기존 constitution checksum 2, paper ledger checksum 1, DPAPI 2와 동일한 baseline failures
- 여섯 viewport의 horizontal overflow: 모두 0
- surface-family: 26개 중 18개 flattened, 8개 functional boundary retained, `69.2%`
- 최종 Linux Python 판정은 PR CI에서 확인한다.

### PR 1 최종 독립 검토

- PASS A — Critical 0, Important 0, Minor 0: 여섯 viewport, 최신 screenshot, dark canvas, 모바일 15px 핵심 설명, 44px control, 검색 우선순위 확인.
- PASS B — Critical 0, Important 0, Minor 0: consent/trust/activity의 inert background, 동적 body sibling, 실제 클릭 차단, Tab 순환, 닫기와 focus 복귀, 공개 안전성 확인.
- PASS C — Critical 0, Important 0, Minor 0: canonical/indexation/sitemap 281개, claim, 공유 URL, data/model/history 무변경 확인.

## 단계별 불변 절차

1. actual newest `origin/main` fetch와 SHA 기록
2. 새 독립 worktree/branch 생성
3. AGENTS.md, CLAUDE.md 재확인
4. 세 독립 사전 검토와 쟁점 기록
5. 실패 테스트 추가 후 RED 확인
6. 최소 구현과 focused commits
7. 전체 Python/Node/browser/SEO/safety test
8. full diff, secret, generated-file churn 검사
9. 세 독립 최종 검토
10. push, PR, current CI, failure fix, merge
11. representative production URL 확인
12. 실제 최신 main fetch 후 다음 단계 시작

## 현재 수동/차단 항목

- Active ruleset: 아직 적용하거나 적용되었다고 주장하지 않는다. PR 5에서 exact manual steps와 검증법을 제공한다.
- GSC/Naver performance: 외부 property 실측이 필요한 항목은 PR 4에서 MANUAL로 분리한다.
- 원격 stale branch: 삭제하지 않는다. PR 5에서 분류 목록만 제공한다.
