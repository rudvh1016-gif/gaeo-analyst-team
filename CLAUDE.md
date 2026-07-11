# 개오(Gaeo) 애널리스트팀 — 프로젝트 가이드

AI 애널리스트 5인(TARO 기술 · DIANA 재무 · NOVA 뉴스심리 · FLOW 수급 · CHIEF 총괄)이
한국 주식 13종목을 분석하는 단일 페이지 대시보드. 순수 정적 사이트(빌드 없음).

## ⭐ 배포 — 가장 중요

- **실사용 화면은 GitHub Pages(`rudvh1016-gif.github.io/gaeo-analyst-team`)이고 `main` 브랜치 기준.**
- 작업 브랜치에 push만 하면 사이트에 **안 보인다**. 반드시 PR을 만들어 **main까지 병합**해야 반영된다.
  (2026-07-11 실제 사고: 브랜치에만 쌓아둬서 사용자가 "아무것도 안 보인다"고 문의)
- 병합 시 data.js/analysis_data.json/indicators.json 충돌이 나면 **더 최신 수집 시각 쪽(보통 ours)** 을 택한다.

## 파일 맵

| 파일 | 역할 | 수정 주체 |
|---|---|---|
| index.html | 화면 전부(CSS+JS 인라인, ~3500줄) | Claude가 직접 편집 |
| tickers.js | 종목 목록 단일 소스(13종목) | 사람/Claude |
| data.js | 현재가·PER 등 시세 스냅샷 | update_prices.py (자동) |
| analysis.js | 5인 **정밀분석**(LIVE_ANALYSIS, Claude 직접) | Claude가 재분석 시 Write |
| auto_analysis.js | 5인 **자동분석**(LIVE_AUTO, 규칙 기반) | analyze_auto.py (자동) |
| history.js | CHIEF 판단 누적 | **archive_analysis.py만** — 직접 편집 금지 |
| market_history.js | 날짜별 시장분석 누적 | archive_analysis.py |
| price_history.js | 일별 종가(5거래일=1페이지) | update_price_history.py |
| analysis_data.json | 분석용 원천 데이터(일봉·수급·컨센서스) | collect_analyst_data.py |
| indicators.json | 사전계산 지표(분석 시 토큰 절약용) | compute_indicators.py |
| indicators.js | ↑의 브라우저 축약본(TARO 미니차트가 읽음) | compute_indicators.py |

## 데이터 파이프라인 (GitHub Actions `update-prices`)

- 이 원격 세션에서는 네이버 금융이 403으로 막힌다. **`.analyst-refresh` 파일 내용을 바꿔 커밋·푸시**하면
  Actions 러너가 수집을 대신 실행해 data.js/price_history.js/analysis_data.json/indicators.json/indicators.js를
  커밋한다(1~2분 뒤 pull). 평일 장중엔 10분 간격 자동 실행.
- 재분석 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참조. **base ≡ data.js price 무결성이 최우선 철칙.**

## index.html 구조 (2026-07-11 대개편 반영)

- 반응형 3단계: **모바일(<1180px, 세로 플로우)** → **데스크톱(≥1180px, `.layout` 그리드: 사이드바 324px + 본문)**
  → **초와이드(≥1600px, 우측 레일 `#railR` 추가: 다가오는 일정 + 최근 팀 판단)**.
- 사이드바(`.rail`): 모드 토글(2열)·검색·업종 폴더(데스크톱에선 전부 열림). sticky.
- 모드 전환은 `setMode()`가 display 토글 — 요소가 다시 나타날 때 `viewIn` 애니메이션 재생.
- 분석 중 스켈레톤: `analyze()`가 `#cards`에 `.busy` 부여 → 4인 완료 시 제거.
- 스파크라인: `flatCloses(code)`(price_history 평탄화) + `priceSparkSVG()` — 칩·시세카드에서 사용.
- TARO 미니차트: `taroChartHTML(code)` — indicators.js(INDICATORS)에서 가격/MA/RSI/MACD를 읽어
  fillCard('taro')가 findings 위에 삽입. MACD 캡션(`.tv-note`)에 파랑/회색 의미 설명.
- 용어 설명: `GLOSSARY`(초등학생 눈높이 문구) + `wrapGloss()`가 findings 속 용어를 `.gterm`으로 감싸고,
  클릭하면 `.gloss-pop` 팝업. `term()`은 시세카드 지표 라벨용.
- PC 버전 토글: 물리 화면 최소변 <820px에서만 우측 하단 노출. viewport meta를 width=1400으로 강제,
  localStorage `gaeo_pcview` 기억, head 인라인 스크립트가 첫 페인트 전 적용.

## ⚠️ 코딩 시 주의 (실제 겪은 함정)

1. **정규식 lookbehind `(?<!)` 금지** — iOS 16.4 미만 Safari에서 그 줄 하나로 스크립트 블록 전체가 죽는다.
   앞 경계는 `(^|[^A-Za-z0-9])` 캡처그룹으로 대체할 것. (`??`·`?.`는 기존 코드가 이미 사용 — ES2020 기준선 OK)
2. **PRICE_HISTORY 페이지는 시간순이 아니다** — flatMap 후 반드시 날짜로 정렬(flatCloses 참조).
   priceBlockHTML(전일비 계산)은 이 문제를 아직 감안하지 않은 기존 코드.
3. index.html의 JS는 `document.getElementById` 위주라 HTML 래핑(aside/main 추가)에 안전하지만,
   `.wrap` 직계 자식 순서에 기대는 CSS(`.layout` 그리드)가 있으니 마크업 이동 시 확인.
4. 시각 변경 후엔 Playwright(chromium: `/opt/pw-browsers/chromium`)로
   데스크톱(1680)·초와이드(1920)·모바일(390, iPhone 13 프로필) 스크린샷 + pageerror 확인이 관례.
5. base/updated 등 analysis.js 필드 규격은 index.html이 전부 파싱한다 — 구조 변경 금지(스킬 문서 참조).

## 남은 아이디어(사용자와 논의된 것)

- 사이트 전체 다크 모드(현 ☀️/🌙 버튼은 캔버스만 전환) — CSS 변수 세트 교체 방식으로 계획됨.
