# 홈 정리 3차 — 글자 3차 축소 · 도구 버튼 정적화 · 시장/정밀분석 메뉴 이동 검토 기록

날짜: 2026-09-03 (KST)
브랜치: `claude/auto-analysis-failure-prevention-94we7m` (PR #487 병합본 `95d02afb`에서 다시 시작)
상태: **소유자 시각 승인 대기. 병합·배포하지 않음.**

## 소유자 지시 (2026-09-03, 스크린샷과 함께)

> "그대로 나누고 전체적으로 글자크기 더 줄여. 그리고 공유랑 PC 버전으로 보기, 스크롤 내릴 때마다
> 하단 고정이 아니고 따라와서 불편해. 그리고 시장분석과 최근 정밀분석은 메인홈에서 사라지고
> 메뉴에서 선택해서 볼 수 있게 하자."

세 가지로 나눠 처리했다. 회색 UI 요소(순환매 토글·종목 칩 등)는 "그대로" 지시대로 손대지 않았다.

## (A) 전체 글자 크기 3차 축소

`editorial-foundation.css` 끝의 "2026-09-03 소유자 지시(3차)" 블록과, 그 블록이 이길 수 없던 세 규칙
(`editorial-accessibility.css`의 `body .context-title` clamp, `body .rotation-view :where(.rot-card-primary,…)`
`!important`, `app-shell.css`의 `.home-daily-brief .hdb-stat strong`)을 제자리에서 낮췄다.
본문·메타 최소선 12px과 44px 터치 목표는 그대로다.

실측(computed font-size, 로컬 정적 서버 + Playwright Chromium, 외부 요청 차단). 수정 전은 같은 트리에서
변경분을 stash로 걷어낸 `origin/main`(`95d02afb`) 기준.

| 요소 | 390 수정 전 → 후 | 1440 수정 전 → 후 |
|---|---|---|
| 홈 제목 `.hero-title` | 26 → **24px** | 44 → **40px** |
| 한 줄 소개 `.tagline` | 14 → **13.5px** | 16 → **15px** |
| 설명 `.hero-intro` | 15 → **14px** | 15 → 15px |
| 링크 줄 `.hero-trust` | 12.5 → **12px** | 13 → 13px |
| 검색 제목 `.hero-search-card h2` | 21 → **18px** | 27 → **22px** |
| 브리핑 제목 `#briefTitle` | 22 → **19px** | 28 → **24px** |
| KPI 숫자 `.kpi .v` | 26 → **20px** | 26 → **22px** |
| 브리핑 줄 `.brief-line` | 14 → **12.5px** | 14 → **13px** |
| 오늘의 판단 숫자 `.hdb-stat strong` | 27 → **23px** | 30 → **26px** |
| 종목 찾기 제목 `.analysis-browser-head h2` | 21 → **18px** | 24 → **20px** |
| 카테고리 제목 `.hrp-title` | 17 → **15px** | 19 → **16px** |
| 화면 제목 `#contextTitle` (뉴스·순환매 등) | 30 → **22px** | 46 → **30px** |
| 종목 현재가 `#qprice` | 32 → **26px** | 32 → **28px** |
| 순환매 카드 제목 `.rot-card-primary` | 18 → **15px** | 20 → 16px |
| 순환매 머리글 `.rot-hero h2` | 19.5 → **17px** | (clamp 유지) |

`test_editorial_foundation_browser.js`의 모바일 히어로 설명 하한을 15px → 14px로 낮췄다(소유자 지시 반영, 12px 바닥선 유지).

## (B) '공유'·'PC 버전으로 보기' 버튼 — 화면을 따라다니지 않게

- 수정 전: 두 버튼 모두 `position:fixed`(좌·우 하단)로 스크롤을 따라다녔다.
- 수정 후: `app.js`의 `gaeoFootTools()`가 푸터(`footer.foot`) 안, 링크 줄 앞에 `.foot-tools` 한 줄을 만들고
  두 버튼을 거기에 넣는다. `app-shell.css`에서 `position:static`, 36px 높이의 알약 버튼으로 바꿨다
  (그림자·blur 제거). 실측: 두 버튼 모두 `position: static`, 부모 `FOOTER.foot`, 스크롤하면 함께 올라간다.
- 기능은 그대로: 공유 버튼의 `navigator.share`/복사 동작(`test_growth_foundation_browser.js`), PC 버전 토글의
  `localStorage gaeo_pcview`·`html.force-desktop`.

## (C) '시장 분석'·'최근 정밀분석' — 홈에서 빼고 메뉴에서 보기

- `index.html`: 홈의 `<div class="market" id="marketBox">`와 브리핑 안의 `<section class="hda" id="homeDeepAnalysis">`를
  홈 밖의 새 화면 `#marketView`(`오늘 시장`)·`#deepView`(`최근 정밀분석`)로 옮겼다. ID·마크업은 그대로라
  `renderMarket()`·`renderHomeDeepAnalysis()`·`#mkHistBtn` 지난 시장 분석 목록이 그대로 동작한다.
- 전체 메뉴 "분석" 묶음: `오늘 시장`(`#mode-market`, 이전의 `navMarketPanel` 대체) · `종목 분석` · **`최근 정밀분석`(`#mode-deep`, 신설)** · …
- `app.js` `setMode`: `market`·`deep` 모드 추가(제목 `오늘 시장`/`최근 정밀분석`, 메뉴 강조, 화면 토글, `market`이면 `renderMarket()`),
  메뉴 클릭 핸들러·`MODE_VIEW_ID`(메뉴에서 눌렀을 때 화면 머리부터 보이기)·딥링크 라우터(`?m=market`, `?m=deep`) 등록.
  상단 메뉴 `오늘 시장`(`#navMarket`)은 이제 홈 중간으로 스크롤하지 않고 `market` 모드로 간다.
  상단 현재 위치 표시는 `data-nav-alias`로 `market`→오늘 시장, `deep`→종목 분석에 이어 붙였다.
- 별도 화면에서는 모바일에서도 정밀분석 목록을 접지 않는다(홈 브리핑 안에 있을 때만 접던 규칙은 코드에 남겨 둠).
  화면 제목이 이미 "최근 정밀분석"이라 섹션 제목은 보조기기 전용으로 숨기고 설명만 보인다.
- 실측: 홈에 `#marketBox`·`#homeDeepAnalysis` 없음(390·1440), `?m=market` → `body[data-mode=market]`·상자 표시·제목 `오늘 시장`,
  `?m=deep` → 5건 목록 펼침·가로 넘침 0·제목 `최근 정밀분석`, 메뉴 버튼 클릭으로도 동일. pageerror 0.

## 캐시

`app.js`·`app-shell.css`는 service worker가 정확한 `?v=` URL로 cache-first라, 둘 다 바뀐 이번 변경은
`?v=20260903-p3` → **`p4`**(`index.html`·`sw.js` SHELL), `CACHE` `gaeo-shell-v20` → **`v21`** 로 올렸다.
`editorial-foundation.css`는 `?v=20260903-v3`(network-first라 캐시 안전, 브라우저 캐시 갱신용),
`editorial-accessibility.css`는 network-first라 버전 문자열(`v1`, 테스트·스냅샷 고정)을 그대로 뒀다.

## 테스트

- 갱신한 계약: `test_deep_analysis_ui.js`(홈 브리핑 안에 없음 + `#deepView` 안에 있음 + 메뉴 항목),
  `test_deep_analysis_browser.js`(홈 미노출 + `?m=deep` 5건·모바일 펼침·aria-current),
  `test_market_archive_browser.js`(홈 미노출 + `?m=market`에서 지난 시장 분석 4건/페이지),
  `test_editorial_foundation_browser.js`(모바일 설명 하한 14px), `test_performance_budget.js`·`test_performance_service_worker_browser.js`(p4/v21).
- 브라우저(로컬 8877): foundation · accessibility · deep_analysis · market_archive · growth_foundation · menu_scroll(21개 메뉴 × 2 뷰포트) ·
  home_daily_brief · performance_service_worker — 결과는 PR 본문에 기록.
- CI 동일 회귀(Python 57 · Node 비브라우저 34) — 결과는 PR 본문에 기록.
- `test_performance_budget_browser.js`의 Home long-task 예산(500ms)은 이 샌드박스에서 순정 main도 871ms로 실패하는
  환경 문제(PR #487 기록과 동일)라 근거로 쓰지 않는다.

## 스크린샷 (`after/`)

`home-light-desktop-1440` · `home-light-mobile-390` · `home-dark-mobile-390` · `home-footer-tools-mobile-390`(푸터의 두 버튼) ·
`market-view-mobile-390` · `deep-view-mobile-390` · `deep-view-desktop-1440` · `stock-light-mobile-390`. 측정값 원본 `after/measured.json`.

## 롤백

PR revert 1건(버전 문자열·SW CACHE도 함께 되돌아간다).
