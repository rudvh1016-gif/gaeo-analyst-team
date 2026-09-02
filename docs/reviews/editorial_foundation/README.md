# Editorial Foundation visual review

기준 SHA: `b00992485ac453a0af14120df8fb15e0c60754c0`
검토일: 2026-09-03
렌더 조건: 외부 요청 차단, 익명 분석 동의 거부, 동일 로컬 데이터

## 비교 화면

| viewport | before 첫 화면 | after 첫 화면 | before 전체 | after 전체 |
|---|---|---|---|---|
| 1440×1100 | [열기](before/home-above-fold-desktop.png) | [열기](after/home-above-fold-desktop.png) | [열기](before/home-desktop.png) | [열기](after/home-desktop.png) |
| 1280×900 | [열기](before/home-above-fold-laptop.png) | [열기](after/home-above-fold-laptop.png) | [열기](before/home-laptop.png) | [열기](after/home-laptop.png) |
| 768×1024 | [열기](before/home-above-fold-tablet.png) | [열기](after/home-above-fold-tablet.png) | [열기](before/home-tablet.png) | [열기](after/home-tablet.png) |
| 430×932 | [열기](before/home-above-fold-wide-mobile.png) | [열기](after/home-above-fold-wide-mobile.png) | [열기](before/home-wide-mobile.png) | [열기](after/home-wide-mobile.png) |
| 390×844 | [열기](before/home-above-fold-mobile.png) | [열기](after/home-above-fold-mobile.png) | [열기](before/home-mobile.png) | [열기](after/home-mobile.png) |
| 360×800 | [열기](before/home-above-fold-narrow.png) | [열기](after/home-above-fold-narrow.png) | [열기](before/home-narrow.png) | [열기](after/home-narrow.png) |

최종 코드로 자동 렌더 110장과 측정 record 74개를 새로 생성한 뒤, 위 24장과 아래 대표 6장을 저장소 evidence로 보존했다.

## 추가 최종 화면

| 검토 대상 | 화면 |
|---|---|
| dark home desktop | [열기](after/dark-home-desktop.png) |
| dark home mobile | [열기](after/dark-home-mobile.png) |
| modal bottom sheet mobile | [열기](after/modal-bottom-sheet-mobile.png) |
| mobile navigation | [열기](after/mobile-navigation-mobile.png) |
| analysis browser | [열기](after/stock-desktop.png) |
| representative article | [열기](after/news-desktop.png) |

## 육안 판정

- 첫 화면에서 한국 주식 약 600종목, 최근 거래일 판단 변화, 변화 근거, 기준 시각, 즉시 검색이 보인다.
- desktop은 hero와 search가 두 카드가 아니라 하나의 편집형 spread로 읽힌다.
- 360~430px에서도 검색 input과 primary action이 첫 viewport 안에 보인다.
- Daily Brief는 큰 둥근 카드가 아니라 context와 decision을 가르는 한 개의 세로축으로 읽힌다.
- 밝은 화면과 어두운 화면 모두 동일한 위계이고, 상승 빨강·하락 파랑은 유지됐다.
- 모바일 메뉴, 하단 sheet, 동의창, 정보 dialog, 경고와 광고는 기능 경계가 유지됐다.
- 여섯 viewport 모두 수평 overflow가 0이다.

## 장식 surface 제거 범위

집계 단위는 DOM 노드 수가 아니라 시각적으로 반복되던 surface family다. 버튼·입력·상태·광고·overlay처럼 실제 경계가 필요한 요소는 제거 대상에서 제외하지 않고 `retained`로 함께 세었다.

Flattened 18개 family:

1. hero outer panel
2. search outer panel
3. Daily Brief outer panel
4. market summary panel
5. KPI group outer panel
6. individual KPI cards
7. weekday summary panel
8. recent-read outer panel
9. recent-read item cards
10. rotation-picks outer panel
11. index-panels outer card
12. radar outer panel
13. radar watch wrapper
14. radar result rows
15. DART outer panel
16. watch-change read-only box
17. automatic-supplement read-only box
18. trust dialog internal point cards

Retained 8개 family:

1. search input
2. primary search button
3. watchlist selection chips
4. briefing navigation buttons
5. radar filter controls
6. warning and stale-data boundaries
7. ad boundary
8. modal, drawer and consent boundaries

따라서 식별한 26개 surface family 중 18개를 제거하거나 평탄화했고, 비율은 `69.2%`다. 요구 범위 65~75% 안이다.

전체 DOM 휴리스틱은 기능 control까지 포함하므로 별도로 기록한다.

| viewport | card-like before→after | rounded before→after | shadowed before→after | overflow |
|---|---:|---:|---:|---:|
| 1440 | 78→72 | 64→51 | 8→5 | 0→0 |
| 1280 | 75→69 | 61→48 | 8→5 | 0→0 |
| 768 | 76→71 | 61→48 | 9→6 | 0→0 |
| 430 | 77→72 | 61→48 | 9→6 | 0→0 |
| 390 | 77→72 | 61→48 | 9→6 | 0→0 |
| 360 | 77→72 | 61→48 | 9→6 | 0→0 |

## 보존 확인

- 모든 기존 기능 ID와 product analytics event 연결 유지
- canonical, robots, sitemap, share URL 변경 없음
- data/model/history/rotation/paper 산출물 변경 없음
- 공개 쓰기 차단과 동의 전 GA/KVdb 0건 유지
- Wanted Sans Variable 유지, 400/500/600 + 브랜드·대표 히어로 800만 사용
- dark consent primary contrast 4.5:1 이상
- dialog role, expanded state, open focus, Tab·Shift+Tab 순환, 동적으로 추가된 배경까지 inert, Escape close, visible trigger focus return 확인
