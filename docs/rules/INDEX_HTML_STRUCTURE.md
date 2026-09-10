# index.html 구조

> 이 문서는 2026-09-10에 `AGENTS.md`에서 **그대로 옮긴 원문**이다(삭제가 아니라 이동).
> 옮긴 이유: Codex가 자동으로 읽는 `AGENTS.md` 크기 한도(기본 32KiB) 안에 전역 안전규칙이 다 들어가게 하고,
> 세부 규칙은 관련 작업에서만 읽게 하기 위해서다. 대응표는 `docs/agent/RULES_MAP.md`, 잠금은 `test_rules_map.py`.
> 아래 본문의 규칙은 `AGENTS.md`에 있을 때와 똑같은 효력을 가진다.

## index.html 구조 (2026-07-28 Home Master Design 반영)

- 상단 고정 글로벌 네비게이션(`.global-nav`): 로고·주요 메뉴·종목 검색·프로필·전체 메뉴 구조. 모바일에서는 주요 메뉴를 접고 아이콘과 전체 메뉴 버튼으로 전환한다.
- 기존 사이드바 DOM(`.rail`)은 삭제하거나 복제하지 않고 `#navWorkspace` 안으로 이동한다. 따라서 모드 토글·검색·업종 폴더(24개)·광고의 기존 id와 이벤트는 그대로 유지된다.
- Home Dashboard(`.home-dashboard`)는 Emerald 계열의 독립 디자인 시스템을 쓰며, PC는 화면 좌우 32px 이상 여백을 둔 최대 1840px 와이드 레이아웃, 모바일은 1열 플로우다.
- 우측 레일 `#railR`의 다가오는 일정·최근 팀 판단은 Home Dashboard 하단의 반응형 정보 카드로 이동한다(`MEGA_CAP` 화이트리스트 기준은 그대로).
- 검색 자동완성(`makeAutocomplete`)은 상단 검색·홈 검색·단일분석·종목비교 A/B가 공유한다. 📖 가이드북 탭(`renderGuide`)은 초보용 사용법+단어장이다.
- 모드 전환은 `setMode()`가 display 토글 — 요소가 다시 나타날 때 `viewIn` 애니메이션 재생.
- 스파크라인: `flatCloses(code)`(price_history 평탄화) + `priceSparkSVG()`.
- TARO 미니차트: `taroChartHTML(code)` — `indicators.js`(`INDICATORS`)에서 가격/MA/RSI/MACD를 읽어 `fillCard('taro')`가 삽입.
- 📡 GAEO 레이더: 홈은 `#gaeoRadar` 카드(`renderGaeoRadar()`, `radar.js`의 `GAEO_RADAR`를 읽음 — 분류 칩 클릭 → 종목 목록 → 클릭 시 `jumpToStock`). 종목 상세는 기존 분석 화면 안 `#radarDetail` 카드(`renderRadarDetail(code)`가 `runChief()` 끝에서 호출)로, `GaeoFeatures.load('radar')`로 `radar_series.js`를 그때 내려받아 가격+볼린저밴드·RSI·거래량·(접이식)MACD 차트와 어제/오늘 비교표를 그린다.
- 용어 설명: `GLOSSARY` + `wrapGloss()`가 findings 속 용어를 `.gterm`으로 감싸고 클릭 시 `.gloss-pop` 팝업.
- PC 버전 토글: 물리 화면 최소변 <820px에서만 우측 하단 노출.
