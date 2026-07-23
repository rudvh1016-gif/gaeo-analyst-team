# 개오(Gaeo) 애널리스트팀 — 프로젝트 가이드

AI 애널리스트 5인(TARO 기술 · DIANA 재무 · QUANT 확률통계 · FLOW 수급 · CHIEF 총괄)이
한국 주식을 분석하는 단일 페이지 대시보드. **QUANT는 2026-07-21에 NOVA(뉴스심리)를 교체**한
확률·통계 분석가 — 내부 id·데이터 키는 호환성 위해 `nova` 유지(analyze_auto.py quant_eval이
"지금과 비슷한 상태(RSI구간×20일선×5일추세)의 과거 사례 5거래일 뒤 실측 승률"을 analysis_data.json
일봉에서 계산, 토큰 0). CHIEF 합산은 **자가 학습 가중치**(compute_team_weights.py →
team_weights.js: history.js 채점 기록으로 분석가별 적중률→발언권, 업종 오버라이드 포함)를 쓴다.
정밀분석(analysis.js)의 nova 블록만 여전히 진짜 뉴스 분석. 6번째 카드 🛡️ RISK(리스크 관리)는 규칙 기반
정보 전용(토큰 0) — compute_indicators.py가 계산한 risk(vol20·mdd3m·pos52w·grade)를
index.html renderRiskCard()가 그대로 그리며, CHIEF 종합·적중률 기록에는 개입하지 않는다. 순수 정적 사이트(빌드 없음).
종목은 tickers.js 단일 소스(**현재 500종목**). 소수 핵심(현재 13종목, analysis.js에 있는 종목)은
🧠 정밀분석(Claude), 나머지는 🤖 자동분석(analyze_auto.py·러너·토큰 0). 표시 우선순위: 정밀분석이 **당일(자동분석 생성일과 같은 날) 재분석됐고 시세도 ±3% 이내**일 때만 정밀 우선, 그 외엔 매일 갱신되는 자동분석을 표시(precisionFresh: 시간+가격 두 조건). 즉 정밀은 그날 직접 재분석한 날만 뜨고 이후엔 500종목 모두 자동분석.
🌐 MACRO 시장국면 판독(토큰 0, 카드가 아닌 로직 레이어)도 있다 — index.html의 `MACRO_REGIME`
(market_history.js 최근 10거래일 코스피 rate 표준편차)이 "변동성 확대"면 `decide()`가
CHIEF 확신도(conf) 표시만 낮춘다(BUY/HOLD/SELL 판단·history.js 채점 기록은 불변).
verdict 영역에 `#vmacro` 배지로, 시장 박스 상단에 전역 배지로 노출.

## ⭐ 배포 — 가장 중요

- **실사용 화면은 GitHub Pages(`rudvh1016-gif.github.io/gaeo-analyst-team`)이고 `main` 브랜치 기준.**
- 작업 브랜치에 push만 하면 사이트에 **안 보인다**. 반드시 PR을 만들어 **main까지 병합**해야 반영된다.
  (2026-07-11 실제 사고: 브랜치에만 쌓아둬서 사용자가 "아무것도 안 보인다"고 문의)
- 병합 시 data.js/analysis_data.json/indicators.json 충돌이 나면 **더 최신 수집 시각 쪽(보통 ours)** 을 택한다.

## 파일 맵

| 파일 | 역할 | 수정 주체 |
|---|---|---|
| index.html | 화면 전부(CSS+JS 인라인, ~5000줄) | Claude가 직접 편집 |
| tickers.js | 종목 목록 단일 소스(500종목, code·name·sector) | 사람/Claude |
| data.js | 현재가·PER 등 시세 스냅샷 | update_prices.py (자동) |
| analysis.js | 5인 **정밀분석**(LIVE_ANALYSIS, 13종목+date/market 키, Claude 직접) | Claude가 재분석 시 Write — **절차는 `.claude/skills/종목분석 스킬/SKILL.md` 필독** |
| auto_analysis.js | 5인 **자동분석**(LIVE_AUTO, 규칙 기반) | analyze_auto.py (자동) |
| news_analysis.js | 📰 뉴스분석 보고서 누적(NEWS_ANALYSIS, 최신이 배열 앞, 10건=1페이지) | Claude — **절차·품질 기준은 `.claude/skills/뉴스분석 스킬/SKILL.md` 필독** |
| stock_study.js | 📚 종목공부(STOCK_STUDY, 회사별 소개 프로필) | Claude |
| stock_lessons.js | 🎓 주식공부(STOCK_LESSONS, 차트·캔들 등 투자 기초 강의, `[[img:key\|캡션]]`=인라인 SVG 도해) | Claude |
| estate_lessons.js | 🏠 부동산공부(ESTATE_LESSONS, 근저당·대출규제·청약 등 부동산 기초, 주식공부와 형식·헬퍼 동일) | Claude |
| history.js | CHIEF 판단 누적(정밀=분단위 여러 건 + 🤖자동=전 500종목 하루 1건, tier:"auto" 표식·정밀 우선·HIST_CAP=80) | **archive_analysis.py만** — 직접 편집 금지. 러너가 `--auto`로 매 사이클 호출 |
| market_history.js | 날짜별 시장분석 누적 | archive_analysis.py |
| price_history.js | 일별 종가(5거래일=1페이지) | update_price_history.py |
| analysis_data.json | 분석용 원천 데이터(일봉·수급·컨센서스) | collect_analyst_data.py |
| indicators.json | 사전계산 지표(분석 시 토큰 절약용) | compute_indicators.py |
| indicators.js | ↑의 브라우저 축약본(TARO 미니차트가 읽음) | compute_indicators.py |
| dow_stats.js | 요일별 평균 등락률 사전계산(상단 📅 패널) | compute_dow_stats.py (자동) |
| team_weights.js | 자가 학습 CHIEF 가중치(분석가별 적중률→발언권, 업종 오버라이드) | compute_team_weights.py (자동) |
| generate_sitemap.js | sitemap.xml 재생성(뉴스분석·종목공부·주식공부·부동산공부 URL 수집) | Claude가 콘텐츠 추가 시 직접 실행 |
| generate_snapshots.js | `/snap/{news,study,lesson,estate}/{id}.html` 정적 스냅샷 생성(자바스크립트 없이도 읽히는 사본, AI/비JS 크롤러向) | Claude가 콘텐츠 추가 시 직접 실행 |
| indexnow_submit.js · `<32자hex>.txt`(IndexNow 키 파일) | sitemap.xml의 URL을 빙·네이버에 즉시 제출(크롤러 방문 기다리지 않고 몇 분~몇 시간 내 색인). 구글은 IndexNow 미지원이라 대상 아님 | 원격 세션은 `api.indexnow.org` 아웃바운드가 막혀 있어 직접 실행해도 실패할 수 있음 — update-analysis.yml 러너가 `.indexnow_hash`로 sitemap.xml 변경을 감지해 매 사이클 자동 제출(사람 개입 불필요) |

⭐ **콘텐츠 발행 철칙**: news_analysis.js·stock_study.js·stock_lessons.js·estate_lessons.js 중 **어느 파일이든 글을 추가/수정할 때마다**
`node generate_sitemap.js`와 `node generate_snapshots.js`를 **반드시 함께 실행**한다(둘 다 안 하면 검색엔진·AI 크롤러가 새 글을 못 찾거나 못 읽는다).
스냅샷은 자바스크립트를 실행하지 않는 AI 브라우징 도구(챗GPT·제미나이 등)向 노출(AEO/GEO) 목적 — 2026-07-23 도입.
sitemap.xml만 갱신해서 push하면 IndexNow 제출은 러너가 다음 사이클(30분 이내)에 자동으로 해준다 — 별도로 신경 쓸 필요 없음.

## 데이터 파이프라인 (GitHub Actions 러너 2개)

- **update-prices.yml** — 평일 09:00~16:00 KST, **10분마다** data.js(시세·지수·환율) 커밋.
- **update-analysis.yml** — 같은 시간대, **30분마다** price_history.js·analysis_data.json·indicators.json/js·
  auto_analysis.js 갱신 + `archive_analysis.py --auto`로 500종목 판단을 history.js에 하루 1건씩 누적.
- 두 러너 모두 "자가 반복 루프 + 종료 시 자기 재기동 체인" 구조(GitHub cron이 이 저장소에서 불안정해서).
  안전망 5중: ①자가 루프 ②체인 재기동 ③push 마커(.analyst-refresh) ④cron(best-effort) ⑤클로드 Routine
  "gaeo 장중 매시 kickoff 안전망"(평일 매시, data.js 커밋이 25분 이상 끊기면 마커 push로 소생).
- 이 원격 세션에서는 네이버 금융이 403으로 막힌다. 수동 수집이 필요하면 **`.analyst-refresh` 내용을 바꿔
  커밋·푸시**(러너가 대신 수집, 1~2분 뒤 pull). SessionStart 훅(`check_pipeline.py`)이 세션 시작 때
  파이프라인 신선도를 자동 점검해 경고를 띄운다.
- 재분석 절차는 `.claude/skills/종목분석 스킬/SKILL.md` 참조. **base ≡ data.js price 무결성이 최우선 철칙.**

## index.html 구조 (2026-07-11 대개편 반영)

- 반응형 3단계: **모바일(<1180px, 세로 플로우)** → **데스크톱(≥1180px, `.layout` 그리드: 사이드바 324px + 본문)**
  → **초와이드(≥1600px, 우측 레일 `#railR` 추가: 다가오는 일정 + 최근 팀 판단 —
  최근 팀 판단은 `MEGA_CAP` 화이트리스트(코스피 초대형 우량주 45종목)만, 종목당 최신 1건).
- 사이드바(`.rail`): 모드 토글(2열)·검색·업종 폴더. 폴더는 24개(통합 업종)라 **전부 기본 접힘**(첫 화면 빈 상태) + 아코디언(하나 열면 나머지 닫힘),
  <1180px에선 폴더 2열 그리드·열린 폴더만 전체 폭(칩도 2열 압축). 검색 자동완성(makeAutocomplete)은
  단일분석·종목비교 A/B가 공유. 📖 가이드북 탭(renderGuide)은 초보용 사용법+단어장.
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
2. **PRICE_HISTORY 페이지는 시간순이 아닐 수 있다** — flatMap 후 반드시 날짜로 정렬(flatCloses 참조).
   (2026-07-16 해결: update_price_history.py가 매 실행마다 날짜순 재구성하도록 수정 + priceBlockHTML도
   정렬 재구성 후 렌더링. 새로 데이터를 읽는 코드를 쓸 땐 여전히 정렬을 습관화할 것.)
3. index.html의 JS는 `document.getElementById` 위주라 HTML 래핑(aside/main 추가)에 안전하지만,
   `.wrap` 직계 자식 순서에 기대는 CSS(`.layout` 그리드)가 있으니 마크업 이동 시 확인.
4. 시각 변경 후엔 Playwright(chromium: `/opt/pw-browsers/chromium`)로
   데스크톱(1680)·초와이드(1920)·모바일(390, iPhone 13 프로필) 스크린샷 + pageerror 확인이 관례.
5. base/updated 등 analysis.js 필드 규격은 index.html이 전부 파싱한다 — 구조 변경 금지(스킬 문서 참조).
6. **테마 시스템(2026-07-18 🍎 애플 감성 확정)**: 기본은 **라이트**(#F5F5F7 캔버스·흰 카드·#1D1D1F 잉크·
   애플 블루 #0071E3 단일 액센트·확산 그림자·알약 버튼·세그먼트 모드탭). `html.gdark` = **애플 다크**(순검정
   배경·#1C1C1E 카드·#0A84FF 블루) — head 인라인 스크립트가 첫 페인트 전 적용(localStorage `gaeo_theme`,
   기본 light), `:root` 변수 세트를 통째로 교체. **본문 텍스트 색은 반드시 변수(--ink/--t2/--t3/--dim)로** —
   하드코딩 slate hex는 다크에서 안 보인다. --navy(다크에선 흰색 액센트)를 배경으로 쓰는 요소를 새로 만들면
   `html.gdark` 개별 오버라이드를 함께 추가할 것. 파스텔 알약도 동일(rgba 저채도 틴트 오버라이드).
   우상단 `#siteTheme` 버튼이 토글(☀️/🌙 캔버스 버튼과 별개). `--num`은 현재 본문 서체와 동일(모노 아님).
7. **본문 등락 색(한국식·2026-07-18)**: `SIGNUM(html)` 전역 헬퍼가 이스케이프된 HTML에서 「부호+숫자+단위
   (%·%p·포인트·원)」만 골라 **상승(+)=빨강(.sgn-u/--krup)·하락(−)=파랑(.sgn-d/--krdn)** 으로 감싼다.
   시장분석(mkParas·mk-points)·뉴스/공부 본문(inline)·CHIEF reason·report·분석가 findings 렌더에 이미
   적용돼 있어 **새 텍스트도 자동 반영**된다. 날짜(2026-07-16)·가격(25만 5,000원)엔 부호가 없어 안 걸린다.
   ※ 상단 지수 스트립(mk-strip)·시세 티커·칩 스파크라인은 ▲▼ 화살표로 방향을 주는 별도 체계라 건드리지 않음.
