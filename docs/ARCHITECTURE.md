# 아키텍처 — 개오(Gaeo) 애널리스트팀

> 공통 규칙 원본은 [AGENTS.md](../AGENTS.md). 여기서는 "왜 이렇게 만들어졌는지"와
> "무엇이 무엇을 참조하는지"를 코드 기준으로 정리한다. 작업 절차는 [WORKFLOW.md](./WORKFLOW.md).

## 한 줄 요약

**빌드 과정이 없는 순수 정적 사이트**다. `index.html`은 문서·탐색 셸,
`app-shell.css`는 공통 앱 스타일, `app.js`는 공통 앱 동작을 맡고 데이터는 각각 별도의
`.js`/`.json` 파일로 분리돼 있다. 서버도, 데이터베이스도, 빌드 파이프라인도 없다 —
GitHub Actions가 주기적으로 데이터 파일을 커밋하고, GitHub Pages가 그 정적 파일을 그대로
서빙한다.

## 화면 셸과 Home Master Design

- `index.html`의 공통 탐색 셸은 상단 고정 `.global-nav`다. PC에서는 주요 메뉴를 펼치고,
  모바일에서는 전체 메뉴 패널로 접는다.
- 기존 `.rail`의 버튼·검색·필터 DOM은 기능 호환성을 위해 그대로 두고, 페이지 로드 뒤
  `#navWorkspace`로 이동한다. 기존 id와 이벤트가 유지되므로 API와 데이터 구조에는 영향이 없다.
- `.home-dashboard`가 전체 페이지 리팩터링의 기준 디자인이다. Emerald 브랜드 토큰,
  넓은 여백, 얇은 테두리, 둥근 카드, 절제된 그림자를 사용한다.
- 비(非) 단일분석 모드에서는 Home Dashboard를 숨기고 선택한 기존 화면만 표시한다.
  각 콘텐츠 화면 내부 디자인은 이번 단계에서 변경하지 않았다.

## 전체 구조

```
브라우저(index.html → app-shell.css + app.js)
   ├─ tickers.js       600종목 마스터 목록(단일 소스)
   ├─ data.js          시세 스냅샷 + 홈 숫자 브리핑 ← update_prices.py (10분마다)
   ├─ analysis.js      정밀분석 14종목 ← Claude가 직접 Write (비정기)
   ├─ auto_analysis.js 자동분석 600종목 + 홈 보강 브리핑 ← analyze_auto.py (30분마다)
   ├─ indicators.json/js, analysis_data.json  ← 지표·원천 데이터 계산 파이프라인
   ├─ history.js       CHIEF 판단 누적 기록 ← archive_analysis.py만 (직접 편집 금지)
   ├─ team_weights.js  적중률 기반 CHIEF 가중치 ← compute_team_weights.py
   ├─ news_analysis.js / stock_study.js / stock_lessons.js / estate_lessons.js / calculators.js
   │                    콘텐츠 5종 ← 사람/Claude가 직접 Write
   ├─ snap/latest_posts.js  첫 화면 최신 글 5개 목록 ← generate_snapshots.js
   ├─ snap/home_brief.js    첫 화면 전 종목 BUY/HOLD/SELL·상위 30종목 경량 집계 ← generate_snapshots.js
   ├─ community.js     운영자 공지·게시글 ← 로컬 초안을 PR로 검토·병합
   └─ site_config.js   사이트 전역 문구/테마 설정 ← 로컬 초안을 PR로 검토·병합
```

## 두 계층 분석 시스템 (가장 중요한 설계 결정)

| | 🤖 자동분석 | 🧠 정밀분석 |
|---|---|---|
| 대상 | tickers.js 600종목 전체 | analysis.js의 14종목 |
| 판단 주체 | `analyze_auto.py` — RSI/MACD/이동평균 규칙 기반 로직 | Claude가 웹서치+데이터 보고 직접 작성 |
| AI API 호출 | 없음(토큰 0) | 있음(Claude가 직접 분석할 때만) |
| 갱신 주기 | 30분마다 자동(GitHub Actions) | 비정기 — 누군가 재분석 작업을 할 때만 |
| 저장 파일 | `auto_analysis.js` (LIVE_AUTO) | `analysis.js` (LIVE_ANALYSIS) |

**표시 우선순위(index.html 로직)**: 어떤 종목이 정밀분석 대상이더라도, 화면에 정밀분석이
뜨는 건 "당일(자동분석 생성일과 같은 날) 재분석됐고 + 시세도 지금과 ±3% 이내"일 때뿐이다
(`precisionFresh` 판정 — 시간 조건 + 가격 조건 둘 다 필요). 이 조건을 못 채우면 정밀분석
대상 종목이라도 자동분석이 대신 뜬다. 즉 실질적으로 거의 항상 600종목 전부가 자동분석으로
보인다고 생각하면 된다.

## QUANT(구 NOVA)에 대한 특이사항

QUANT는 2026-07-21에 "뉴스심리 분석가 NOVA"에서 "확률·통계 분석가"로 캐릭터가 교체됐다.
호환성을 위해 **내부 id와 데이터 키는 여전히 `nova`를 그대로 쓴다** (예: `analysis.js`의
`"nova": {...}` 블록, `auto_analysis.js`의 관련 필드). `analyze_auto.py`의 `quant_eval` 함수가
"지금과 비슷한 상태(RSI 구간 × 20일선 위치 × 5일 추세)의 과거 사례들이 5거래일 뒤 실제로
어떻게 됐는지" 승률을 `analysis_data.json`의 일봉 데이터에서 통계로 계산한다(토큰 0).
단, `analysis.js`(정밀분석)의 nova 블록만은 여전히 예전처럼 진짜 뉴스 분석 내용을 담는다.

## CHIEF 종합 판단 — 자가 학습 가중치

CHIEF의 최종 BUY/HOLD/SELL은 4개 분석가(TARO/DIANA/QUANT/FLOW) 점수를 단순 평균하지
않는다. `compute_team_weights.py`가 `history.js`의 과거 판단·적중 기록을 채점해서
"이 분석가가 최근 얼마나 잘 맞혔는지"를 분석가별 발언권(가중치)으로 환산해
`team_weights.js`에 저장하고, index.html이 이 가중치로 CHIEF 판단을 계산한다. 업종별
오버라이드도 포함된다(특정 업종에서 특정 분석가가 더/덜 신뢰받도록).

## 🛡️ RISK 카드 (6번째 카드)

`compute_indicators.py`가 계산하는 `risk`(vol20 변동성·mdd3m 최대낙폭·pos52w 52주 위치·grade
등급)를 `index.html`의 `renderRiskCard()`가 그대로 그리는 **규칙 기반, 정보 전용(토큰 0)**
카드다. CHIEF의 종합 판단이나 적중률 기록에는 전혀 관여하지 않는다.

## 🌐 MACRO 시장국면 판독 (카드가 아닌 로직 레이어)

`market_history.js`의 최근 10거래일 코스피 등락률 표준편차로 index.html의 `MACRO_REGIME`이
"변동성 확대" 여부를 판단한다(토큰 0). 이 값이 "변동성 확대"면 `decide()` 함수가 CHIEF의
**확신도(confidence) 표시만** 낮춘다 — BUY/HOLD/SELL 판단 자체나 history.js 채점 기록은
바뀌지 않는다. verdict 영역의 `#vmacro` 배지, 시장 정보 박스 상단 전역 배지로 노출된다.

## 데이터 파이프라인 (GitHub Actions)

자동 데이터 갱신 워크플로 2개가 있다 (`.github/workflows/`):

- **update-prices.yml** — 평일 09:00~16:00 KST, 10분마다 `data.js`(시세·지수·환율 + 홈 숫자 브리핑) 갱신·커밋.
- **update-analysis.yml** — 같은 시간대 30분마다 `price_history.js` · `analysis_data.json` ·
  `indicators.json/js` · `auto_analysis.js`(홈 보강 브리핑 포함)를 갱신하고, `archive_analysis.py --auto`로 600종목
  판단을 `history.js`에 하루 1건씩 누적한다.
두 워크플로 모두 **GitHub의 기본 cron이 이 저장소에서 불안정하다는 걸 겪은 뒤** 만들어진
"자가 반복 루프 + 종료 시 자기 재기동(workflow_dispatch 재호출) 체인" 구조다. 안전망이
6중으로 겹쳐 있다: ① 워크플로 자체의 자가 루프 ② 체인 재기동 ③ `.analyst-refresh` 파일을
건드리는 push 마커 ④ cron(best-effort) ⑤ Claude Routine("gaeo 장중 매시 kickoff 안전망" —
평일 매시, 시세·자동분석 **양쪽** 산출물 신선도를 각각 재고 멈춘 쪽 run을 취소·재기동)
⑥ `pipeline-watchdog.yml`(평일 장중 15분 간격, 2026-09-02 신설).

⑥번이 왜 따로 필요한가 — ①~⑤는 전부 **"run이 돌고 있으면 건강하다"** 는 가정 위에 있었다.
2026-09-02에 update-analysis가 hang에 빠졌을 때, 그 좀비는 계속 `in_progress`였고 뒤에 밀린
새 run은 `queued`였다. 그래서 update-prices의 짝꿍 상호 감시(`alive()`)는 매 사이클 "살아있다"고
답했고, 매시 Routine은 `data.js`만 보고 있어서(시세는 멀쩡했다) 아무도 이상을 못 느꼈다.
결과적으로 시세는 10분마다 갱신되는데 자동분석만 전날 종가에 얼어붙은 채 아침이 다 갔다.
⑥은 유일하게 **산출물 타임스탬프**(`data.js`의 `date` · `auto_analysis.js`의 `generatedAt`)로
판정하고, 두 파이프라인을 독립적으로 본다. 판정기는 순수 함수라 `test_pipeline_watchdog.py`가
사고 상황을 그대로 재현해 회귀를 막는다. 자세한 근거는 `pipeline_watchdog.py` 상단 주석.

⭐ **휴장일(공휴일)에는 여섯 겹 모두가 조용해야 한다(2026-09-06).** 그 전에는 다섯 곳이 전부 **요일만**
봤다: 수집·분석 워크플로가 공휴일에도 돌아 벤더가 주는 직전 거래일 종가를 받고, `update_prices.py`가
"{오늘} 종가"라는 거짓 라벨을 붙이고, `archive_analysis.py`가 그 판단을 그날 판단으로 `history.js`에
기록했다. 실측: 2026-08-17(광복절 대체휴일) 자동 기록 598건, 8/14 기록이 있는 500종목 전부 기준가가
8/14 종가와 동일. 더 나쁜 건 **감시가 방아쇠였다**는 점이다 — ⑤·⑥이 휴장일의 조용함을 고장으로 읽고
러너를 깨우면, 깨어난 러너가 유령 기록을 하나 더 만든다. 그래서 다섯 곳(워크플로 2개 · 시세 라벨 ·
아카이브 · 감시 2종)이 **같은 달력 `krx_calendar.KRX_HOLIDAYS`** 를 보게 묶었고, 한 곳만 되돌리면
나머지가 되살리므로 계약 테스트를 파일 하나(`test_holiday_guard.py`)로 합쳐 잠갔다. 감시를 만들 때
"run이 돌고 있다"를 건강 신호로 쓰지 말라는 교훈에, **"조용한 게 정상인 날을 감시가 알아야 한다"** 가
하나 더 붙은 셈이다. 과거 8/17 기록은 재구성 금지 원칙대로 지우지 않고 평가에서만 제외한다
(`docs/PREREGISTRATION_BUY_FILTERS_20260905.md` §10 8항).

같은 날 적대적 검수(`/gaeo-review`)가 이 설계의 약점 셋을 잡아 함께 고쳤다.

1. **"다섯 겹"은 실은 한 겹을 다섯 군데 복사한 것이었다.** 다섯 곳이 전부 같은 명단
   (`KRX_HOLIDAYS`)을 보므로, 명단에 없는 휴장일은 다섯 겹을 그대로 통과한다. 실측 반례가
   이미 있다 — **2026-07-17**은 `price_history.js`에 일봉이 0건인 실제 휴장일인데 명단에
   없어서 `history.js`에 자동 기록 500건이 남아 있다. 그래서 `archive_analysis.py`에 달력을
   **전혀 보지 않는** 두 번째 눈을 뒀다: 장이 안 열린 날 벤더는 직전 거래일 종가를 그대로
   돌려주므로 종목 기준가가 한 곳도 안 움직인다. 실측 분리도(601종목) — 정상 거래일
   1.2~4.8% vs 유령 판단일 8/17 99.4% · 7/17 99.8%. 임계는 그 사이 어디에도 닿지 않는 90%다.
   덧붙여 명단이 바닥나기 전에 CI가 먼저 알려주도록 만료 계약 테스트를 뒀다(남은 기간 30일).
2. **fail-closed 반전 금지.** 워크플로가 `python3 … || trading=""`이라 휴장일(exit)과 오류
   (`python3` 부재·모듈 깨짐)를 구분하지 못했다. 그러면 멀쩡한 거래일이 통째로 조용히 쉬고,
   Actions에는 초록 체크만 남는다. 이제 **거래일 / 휴장일 / 판정불가** 셋으로 나눠 판정불가는
   종전(요일 기준) 동작으로 폴백하고 `::warning::`을 남긴다. 달력이 틀린 날(임시 개장 등)을
   위한 탈출구로 `workflow_dispatch` 입력 `force_collect`도 추가했다.
3. **⑤ Routine이 휴장일을 몰랐다.** 휴장일 장중에는 산출물이 직전 거래일 것이고 잠자는 체인
   run이 `in_progress`로 떠 있는 것이 정상인데, v3 프롬프트는 그것을 좀비로 오인해 취소하도록
   돼 있었다. `sleep` 중 취소된 run은 `chain` 줄에 못 가므로 체인이 통째로 끊긴다 — 2026-07-21
   사망과 같은 기전이다. v4 프롬프트에 "휴장일이면 아무것도 하지 않고 종료"를 0단계 앞에 뒀고,
   ⑥ 워치독의 생략 로그도 `"휴장일 — 감시 생략"`으로 사유를 밝히게 바꿨다(v3은 `"수집 창 밖"`
   이라고만 찍어 Routine이 "아직 조치 안 됨"으로 읽을 수 있었다).

⭐ **화면도 같은 달력을 본다(2026-09-06 추가, 검수 m1).** 러너가 휴장일에 안 도는 순간,
화면이 그 사실을 모르면 공휴일마다 홈에 `⚠️ 마지막 갱신은 …입니다 (약 N일 전)` 배너와
DAILY BRIEF의 `· 새 시세 확인 중`이 뜬다. **고장이 아니라 정상인 날에 뜨는 경고**라서
더 나쁘다(`gaeoTrack('stale_data_warning_seen')`까지 발화해 지표도 오염된다).
그래서 `app.js`에 `GAEO_KRX_HOLIDAYS`를 두고 `snapshotStaleDays()`가 직전 **거래일**까지
거슬러 올라가게 했다. 목록이 두 군데가 되면 한쪽만 고쳐져 어긋나기 쉬우므로
`test_krx_calendar_sync.py`가 `krx_calendar.KRX_HOLIDAYS`와 글자 단위로 같은지 잠근다.
⚠️ 이 상수는 **파일 맨 앞**에 있어야 한다 — `renderClock()`이 `app.js` 실행 도중 동기로
호출되므로 뒤쪽에 두면 TDZ로 앱 전체가 죽는다(실제로 한 번 죽였다. 같은 함정: `COVERAGE_LABEL`).

⚠️ 이 가드는 `archive_auto`(자동 판단)에만 걸린다. **휴장일에 수동으로 정밀분석을 돌리면
그 날짜 기록이 `history.js`에 들어간다.** 사전등록 평가는 `tier=="auto"`만 보므로 표본은
오염되지 않지만, 화면의 정밀분석 이력에는 남는다.

글자만 보는 검사로는 이런 반전을 못 잡으므로, `test_workflow_branch_exec.py`가 워크플로의
`run:` 블록을 떼어 **실제로 bash로 실행**해 (휴장일 07:00 → 장외+체인) · (거래일 07:00 →
개장 전 대기) · (거래일 11:00 → 수집 진입) · (판정불가 → 수집 진입)을 확인한다.

⛑️ **⑦ 워크플로 유효성 감시 (2026-09-07 신설).** 위 여섯 겹은 전부 "러너가 돌고 있는가 ·
산출물이 갱신되는가"를 본다. 그런데 **워크플로 파일 자체가 무효가 되면** 그 질문들이
전부 무의미해진다.

실제 사고(2026-09-07): `update-analysis.yml`의 큰 `run:` 블록이 GitHub의 UTF-8
**21,000바이트** 한도를 165바이트 넘겨 파일 전체가 무효가 됐다(한글 주석은 글자당 3바이트고,
그 블록은 이미 19,888바이트로 한도의 94.7%였다). 그러자

  · push마다 **job이 0개인 0초짜리 실패 run**만 남았다 — 로그가 없어 원인을 볼 수 없다
  · `workflow_dispatch`가 거부됐다 → **자기 재기동 체인이 통째로 끊겼다.**
    워치독이 "재기동" 조치를 내려도 그 dispatch 역시 거부되므로 **영원히 실패한다**
  · `update-prices.yml`은 같은 수정을 받았지만 블록이 6,739B라 멀쩡했다 →
    "시세는 되는데 분석만 안 되는" 제일 알아채기 어려운 모양이 됐다

**GitHub이 알려주는 카나리아:** 파일을 파싱하지 못하면 API의 `name` 필드에 `name:` 값 대신
**파일 경로**가 들어온다(실측: 깨진 상태 `.github/workflows/update-analysis.yml`,
정상 상태 `update-analysis`). `check_workflow_health.py`가 이 지문을 15분마다 읽는다
(⑥ 워치독 워크플로 안에서, 좀비 감시보다 **먼저**).

교훈 두 개를 같이 남긴다.

1. **"조회하지 못했다"를 "정상"으로 읽지 마라.** 워치독은 토큰이 없거나 API 호출이 실패해도
   빈 목록을 돌려줘서 "실행 중인 run 없음"이라고 단정했다. 이제 `active_runs`는 조회 실패 시
   `None`을 돌려주고, `decide`는 그것을 **판정 보류**로 다룬다. `check_workflow_health.py`도
   토큰이 없으면 종료코드 0이 아니라 2(확인 못 함)를 돌려준다.
2. **테스트가 통과했다고 배포물이 유효한 건 아니다.** 이 사고는 YAML 파싱·`bash -n`·
   블록을 떼어내 실제로 실행하는 테스트 18케이스를 **전부 통과**했다. 아무도 블록의
   **크기**를 재지 않았기 때문이다. `test_workflow_size.py`가 이제 모든 `run:` 블록의
   UTF-8 바이트를 재서 GitHub(21,000)보다 먼저 20,500에서 막는다.

**트리거는 `workflow_dispatch` / 특정 경로 `push` / `schedule`뿐이며, 외부 Pull Request로는
절대 실행되지 않는다** — 즉 다른 사람이 PR을 올린다고 이 워크플로가 자동으로 도는 구조가
아니다(보안 관점에서 확인된 사실).

⚠️ 다만 그 `push` 트리거에는 **`branches: [main]`이 반드시 있어야 한다.** 2026-09-07에
이게 없어서, 같은 저장소의 **PR 브랜치**에 워크플로 파일을 고쳐 올리자 진짜 수집기 두 개가
그 브랜치에서 기동했다. 3시간 동안 돌며 자동 생성물을 브랜치에 35커밋 쌓아 PR을 645파일
충돌 상태로 만들었고, main 러너와 같은 소스를 이중으로 긁었다.

`chain()`은 `IS_MAIN`으로 막혀 있었지만 그건 **자기 재기동만** 막는다 — 수집 루프
자체(최대 350분)는 브랜치에서도 그대로 돈다. **"브랜치에서는 체인을 안 잇는다"가
"브랜치에서는 수집을 안 한다"는 뜻이 아니었다.** 이 구멍이 그동안 안 터진 이유는
직전 PR들의 브랜치 run이 **워크플로 파일이 무효라 즉시 실패**했기 때문이다(job 0개).
파일을 고치자마자 처음으로 진짜로 돌았다 — 고쳤더니 드러난 결함이다.

`test_workflow_size.py`의 `CollectorsNeverRunOnFeatureBranches`가 세 워크플로
(`update-prices` · `update-analysis` · `pipeline-watchdog`)의 `push.branches`가
`["main"]`인지 잠근다. 브랜치에서 워크플로를 시험할 때는 `workflow_dispatch`로 ref를 지정한다.

## 방문자 캐시와 최신 데이터 우선 원칙

`sw.js`는 설치형 웹앱(PWA)의 오프라인 사용을 위한 마지막 정상본을 보관한다. 다만
`index.html`과 모든 `.js`/`.json` 파일은 온라인일 때 **항상 GitHub Pages의 최신 원본을 먼저
요청**하고, 네트워크가 끊겼을 때만 저장본으로 대체한다. 서버 요청에는 브라우저 HTTP 캐시를
우회하는 `no-store`를 적용한다. 첫 배포 때 예전 서비스 워커가 잡고 있던 파일도 즉시 교체할
수 있도록 핵심 스크립트와 지연 로딩 스크립트에는 배포 리비전 쿼리를 붙이고, 서비스 워커는
`updateViaCache: 'none'`으로 등록한다.

따라서 PC를 다시 켜거나 홈 화면 아이콘으로 실행해도 온라인이라면 Ctrl+F5 없이 최신
`data.js`·`auto_analysis.js`·`community.js`가 우선 표시되어야 한다. 캐시 정책을 바꿀 때는
`sw.js`의 `CACHE` 이름과 `index.html`의 스크립트 리비전을 함께 올리고, 오래된 응답을 Cache
Storage에 일부러 넣은 뒤 일반 새로고침으로 최신 데이터가 복구되는지 브라우저 테스트한다.

## 보조 스크립트

- `fetch_krx_list.py` — 관리자 모드 "종목관리"의 이름 검색 자동완성용 상장사 이름↔코드
  목록을 수집한다(네이버 1차, KRX 다운로드 2차 폴백).
- `backfill_history.py` — 1회성 시드 스크립트. `history.js`가 당일 기록만 있어 채점거리가
  부족할 때, 과거 거래일들에 대해 "그날 자동분석 엔진이 냈을 판단"을 과거 일봉으로
  역산해서 `history.js`를 미리 채워 넣는다.
- `compute_dow_stats.py` — 요일별 평균 등락률을 미리 계산해 `dow_stats.js`(상단 📅 패널)로 저장.
- `check_pipeline.py` — Claude Code의 SessionStart 훅이 세션 시작 시 실행. 데이터 파일들의
  최신 갱신 시각을 보고 파이프라인이 멈췄는지 점검해 경고를 띄운다.

## 콘텐츠 5종과 카테고리(cat) 규칙

`news_analysis.js` · `stock_study.js` · `stock_lessons.js` · `estate_lessons.js` ·
`calculators.js` 각각의 모든 글에는 `cat` 필드가 있고, `app.js`가 모드 진입 시 이 값으로
대분류 카드 화면을 그린다. **새 글의 `cat`은 반드시 `app.js`의 `NEWS_CATS`/`STUDY_CATS`/
`LESSON_CATS`/`ESTATE_CATS`/`CALC_CATS`에 이미 정의된 키와 정확히 일치해야 한다** — 안
그러면 그 글은 어떤 카테고리 카드에도 안 잡혀 "전체 글 보기"로만 찾을 수 있다(사실상
묻힌다). 정확한 키 목록은 AGENTS.md와 CLAUDE.md에 있다.

콘텐츠를 추가/수정하면 **반드시** `node generate_sitemap.js`와 `node generate_snapshots.js`를
함께 실행해야 한다. 이 두 스크립트가 네이버·구글·빙·다음 4개 검색엔진 sitemap 갱신,
IndexNow 제출(러너가 자동 처리), AI 크롤러용 정적 스냅샷(`/snap/...`), 첫 화면의
`snap/latest_posts.js` 최신 글 5개 목록 생성을 전부 커버한다.

## 커뮤니티 게시판 (community.js)

방문자 전체에게 보이는 운영자 공지와 게시글이다. 2026-09-02 Safety Gate 이후 공개 페이지는
인증 없는 외부 저장소의 방문자 글을 읽거나 쓰지 않는다. 방문자 의견 영역은 읽기 전용 안내와
문의 링크만 표시한다. 운영자 글은 `community.js`에서 HTML 이스케이프해 표시하며, 로컬 초안은
PR 검토와 CI를 거친 뒤 병합해야 공개된다.

## 로컬 초안과 발행 요청

`#admin` 또는 사이트 제목 다섯 번 탭은 운영 권한 인증이 아니라 현재 브라우저에서만 쓰는
초안 도구를 연다. 문구, 디자인, 종목 메모, 종목 목록, 커뮤니티 초안은
`gaeo_admin_overrides`에 저장된다. 공개 페이지는 GitHub 토큰을 입력받거나 저장하지 않으며
GitHub API로 저장소를 직접 수정하지 않는다. 발행 탭은 허용된 파일의 PR 작업 요청만 복사한다.
실제 발행은 별도 작업 환경에서 최신 main 확인, 브랜치, 계약 테스트, PR, CI, 병합 순으로 한다.

## 익명 이용 집계

제품 분석과 KVdb 숫자 카운터는 `gaeo_analytics_consent_v1`이 `granted`일 때만 새 값을 보낸다.
거부하거나 아직 선택하지 않은 상태에서는 공개 카운터를 읽어 표시할 수 있지만 증가시키지 않는다.
카운터는 인증된 순사용자 수가 아니고 공개 저장소 특성상 조작될 수 있는 참고값이다. 검색어,
연락처, 포트폴리오 금액은 제품 분석 이벤트 허용 목록에 없으며 전송이 거부된다.
