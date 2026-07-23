---
name: 종목분석 스킬
description: 개오 애널리스트팀(저장소 루트) 주식 정밀분석 갱신. 정밀분석 대상 종목(analysis.js의 13개 안팎)을 팀 5인 관점(기술·재무·뉴스·수급·종합)으로 분석해 analysis.js를 다시 쓰고 history.js에 기록한다. "종목 분석해줘 / analysis.js 갱신 / 개오 팀 재분석 / ○○종목만 분석 / 시세 반영해서 다시 분석" 요청 시 사용.
---

# 개오 애널리스트팀 — 종목 분석 갱신

너는 "개오 애널리스트팀"의 총괄이다. **저장소 루트에서 작업한다**(원격 세션은 보통
`/home/user/gaeo-analyst-team` — `git rev-parse --show-toplevel`로 확인. 모든 경로는 이 폴더 기준).
이 작업은 데이터 수집+정형화가 대부분이라 **Sonnet 실행에 적합**하다.

## 🎯 범위 먼저 정하기 — 전 종목 정밀분석 금지

- tickers.js는 **500종목**이지만 정밀분석(analysis.js) 대상은 **현재 analysis.js에 이미 있는 종목(13개 안팎)뿐**이다.
  "전부 분석해줘"라는 요청도 **정밀분석은 기존 목록 유지**가 기본 — 500종목 정밀분석을 시도하면 토큰이 폭발한다.
  나머지 487종목은 러너의 자동분석(auto_analysis.js)이 30분마다 알아서 갱신한다.
- 새 종목을 정밀분석 목록에 **추가**하는 것은 사용자가 종목명을 콕 집어 요청했을 때만.
- 화면 표시 규칙(precisionFresh): 정밀분석은 **재분석한 그날 + 시세 ±3% 이내**일 때만 화면에 우선 표시되고,
  다음 날부터는 자동분석이 대신 뜬다. 즉 "오늘 재분석 → 오늘 하루 정밀 표시"가 정상 동작이다
  (다음 날 자동분석으로 바뀌는 건 버그가 아니다 — 사용자 문의 시 이렇게 설명).

## ⛔ 철칙 — 기준가(base) 무결성 (가장 중요)

> 2026-07-08 실제 사고: 예전 분석 텍스트에 적힌 가격을 base로 옮겼다가
> 실제 시세와 8% 어긋나 트랙레코드를 삭제해야 했다. 반복 금지.

1. **`base`는 반드시 0단계에서 실행한 `update_prices.py`의 출력(= data.js의 `price`)에서 가져온다.**
2. **어떤 경우에도 base를 다음에서 가져오지 않는다**: 이전 analysis.js의 findings/report 텍스트, 웹 뉴스 기사 속 가격, 기억/추정치, TARO 차트데이터의 임의 행.
3. `updated`는 **지금 실행 시각**(HH:MM까지), `baseAt`은 **data.js의 date 라벨에서 파생**:
   - 라벨이 "… 장중"이면 → `"YYYY-MM-DD HH:MM"` (수집 시각)
   - 라벨이 "… 종가"이면 → `"YYYY-MM-DD 종가"` (전일 종가 라벨이면 전일 날짜)
4. **history.js를 직접 쓰거나 수정하지 않는다.** 오직 `archive_analysis.py`가 기록한다.
5. 마지막 검증(4단계)에서 **base ≡ data.js price 일치**를 실제로 확인하고, 불일치가 있으면 고친 뒤 끝낸다.

## 0단계 — 준비

1. `tickers.js`를 읽어 대상 종목(TICKERS 배열 code·name)을 확보 — **종목 목록의 유일한 기준.**
2. `python3 update_prices.py` 실행 → data.js 최신화. **출력의 종목별 현재가를 기록해둔다(이게 base).**
   - 일부 종목 실패 시: 그 종목은 data.js에 남은 이전 값(stale)으로 base를 잡되 findings에 "시세 수집 실패" 명시.
   - 전부 실패 시: 사용자에게 알리고 중단(추정 가격으로 진행 금지).
   - ★ **네트워크 제한 세션(모바일/웹 원격)에서 네이버 접속이 403으로 막히면**: GitHub Actions
     `update-prices` 워크플로우가 심부름꾼 역할을 한다. `.analyst-refresh` 파일 내용을 바꿔
     커밋·푸시하면 러너가 수집을 실행해 data.js/analysis_data.json/indicators.json을 커밋하니
     1~2분 뒤 pull해서 쓴다(평일 장중엔 10분 간격 자동 실행되므로 pull만 해도 최신일 수 있음).
     이때 base는 그 data.js의 price 그대로(철칙 동일).
3. **부분 재분석 모드**: 사용자가 "○○종목만"이라 하면 그 종목 블록만 새로 쓰고 나머지 블록은 그대로 둔다.
   그 종목의 `updated`/`base`/`baseAt`만 갱신, 전역 `date`는 최근 갱신일로.
4. **토큰 절약 — indicators.json 우선**: 저장소의 `indicators.json`(Actions가 사전계산)에
   MA20/MA60·RSI·MACD·거래량배율·3개월 밴드·최근5일 종가(tech)와 외인/기관 6일 누적·보유율
   추이(flow), 컨센서스 목표가·선행PER(targetMean/fwdPer)이 이미 들어있다.
   `generatedAt`이 data.js와 같은 수집분이면 **원천 데이터를 다시 읽거나 재계산하지 말고
   이 요약표를 그대로 써라**(TARO/DIANA/FLOW findings의 수치 출처로 충분). 오래됐으면 0단계 2번으로 갱신.

## 1단계 — 종목별 5인 분석

`CODE`는 종목코드로 치환. curl에는 반드시 `-H "User-Agent: Mozilla/5.0"` (네이버는 UA/Referer 없으면 차단).
토큰 절약: 지표 계산은 **python3 스크립트 하나**로 전 종목 일괄 처리 권장(종목마다 반복 출력 금지).

- **TARO(기술)** — 일봉 3개월:
  `curl -s -H "User-Agent: Mozilla/5.0" "https://api.finance.naver.com/siseJson.naver?symbol=CODE&requestType=1&startTime=YYYYMMDD&endTime=YYYYMMDD&timeframe=day"`
  지표 규격(일관성 유지): MA20/MA60=종가 단순평균, RSI(14)=Wilder 평활, MACD=EMA12−EMA26·시그널 EMA9. 거래량은 20일 평균 대비 배율.
- **DIANA(재무)**:
  `curl -s -H "User-Agent: Mozilla/5.0" "https://m.stock.naver.com/api/stock/CODE/integration"`
  PER/PBR/EPS/BPS/배당(totalInfos), ROE=EPS/BPS×100. 컨센서스(추정 EPS·목표주가·투자의견)가 있으면 활용.
- **NOVA(뉴스심리)**: WebSearch로 최근 뉴스·촉매·시장 분위기. **다가오는 일정(실적발표일·상장·배당락·신제품·컨퍼런스)을 날짜와 함께 수집 → `events`에 기록.** 뉴스 기사 속 가격 숫자는 참고만 하고 base로 쓰지 않는다.
- **FLOW(수급)**:
  `curl -s -H "User-Agent: Mozilla/5.0" "https://finance.naver.com/item/frgn.naver?code=CODE&page=1"`
  HTML 표를 python 정규식으로 파싱(날짜·종가·기관/외국인 순매매·보유율). 최근 5~10거래일 누적과 보유율 추이를 본다.
- **CHIEF(총괄)**: 4인 종합 75% + 수급(FLOW) 25%. `call`: total≥63 BUY / 47~62 HOLD / 47미만 SELL.

출력 규격:
- 각 분석가: `score`(0~100 정수), `stance`("bull"/"bear"/"neu"), `findings`(구체 수치 포함 한국어 **정확히 4개**).
  - stance는 리더보드 채점에 쓰인다. 근거가 있으면 bull/bear로 명확히 — neu 남발 금지(채점 제외됨).
- **NOVA에는 `sources`를 함께 기록**(웹검색에서 실제 확인한 기사만): `"sources":[{"t":"기사 제목","p":"언론사","d":"M/D"}]` 1~2건.
  화면이 NOVA 카드 아래 "📰 근거 기사"로 표시해 신선도·신뢰도를 검증할 수 있게 한다.
  개별 뉴스 재료가 없는 일반 코멘트 분석이면 sources를 **생략**(빈 배열 대신 필드 자체를 뺀다) — 없는 출처를 지어내지 않는다.
- CHIEF: `call`, `total`(정수), `confidence`(정수), `reason`(2~3문장), `target`, `report`(4~5문장).
  - `target`에는 가능하면 **"목표주가 N원" 형식의 숫자**를 포함(컨센서스 등) — 화면이 이 패턴을 파싱해 "목표가까지 거리"를 표시한다. 지지/저항 레벨도 함께.

## 2단계 — analysis.js 완전히 덮어쓰기 (Write 도구)

```
const LIVE_ANALYSIS = {
 "date": "YYYY-MM-DD",
 "market": {                                // ★ 시장(코스피/코스닥) 분석 — 화면 상단 📊 박스에 표시
  "updated": "YYYY-MM-DD HH:MM",
  "kospi": {"value": 실수, "rate": 실수},     // data.js의 indices 값과 동일하게
  "kosdaq": {"value": 실수, "rate": 실수},
  "text": "현 시장 국면 요약 2~3문장 (조정/반등 배경, 핵심 매크로 변수)",
  "points": ["코스피 현황 한 줄", "코스닥 현황 한 줄", "핵심 변수/일정", "반등 조건"],
  "events": [{"date":"YYYY-MM-DD","name":"🇺🇸 미국 CPI 등","title":"일정"}]  // 특정 종목에 속하지 않는 매크로 일정(CPI·FOMC 등). 없으면 [].
 },
 "CODE": {
  "updated": "YYYY-MM-DD HH:MM",          // 지금 실행 시각
  "base": 정수,                            // ⛔ 반드시 data.js의 price와 동일
  "baseAt": "YYYY-MM-DD HH:MM | YYYY-MM-DD 종가",
  "events": [{"date":"YYYY-MM-DD","title":"일정"}],   // 날짜 미정이면 date 생략. 없으면 [].
  // ⚠️ 2026-07-23 사고: "전체 재분석" 때 매번 새로 조사하지 않고 관성적으로 events:[]를
  // 써버려서 실적발표일 등 이미 조사돼 있던 일정이 통째로 사라지고 캘린더가 텅 비었다.
  // 전체 재작성 시에도 market.events·각 종목 events는 (a) 기존 analysis.js에 남아있던
  // 미래 일정을 그대로 이어받거나 (b) WebSearch로 다시 확인해 최신화하되, 절대
  // "귀찮으니 일단 []"로 비우지 말 것 — 지나간 일정만 정리하고 다가올 일정은 유지/보강한다.
  "taro":  {"score":정수,"stance":"..","findings":["..","..","..",".."]},
  "diana": {"score":정수,"stance":"..","findings":[".."x4]},
  "nova":  {"score":정수,"stance":"..","findings":[".."x4]},
  "flow":  {"score":정수,"stance":"..","findings":[".."x4]},
  "chief": {"call":"..","total":정수,"confidence":정수,"reason":"..","target":"..","report":".."}
 }
 // ... TICKERS의 모든 종목
};
```

- `market`의 kospi/kosdaq 값은 **update_prices.py가 쓴 data.js의 indices에서 그대로** 가져온다(기준가 무결성 철칙과 동일).
  market은 history.js에는 안 들어가지만, archive_analysis.py가 **market_history.js에 날짜별로 누적**한다
  (같은 날짜 재분석은 최신으로 갱신 — 화면의 "📚 지난 시장 분석" 날짜별 목차가 이 파일을 읽는다).
- 반드시 **유효한 JavaScript**(문자열 안 큰따옴표는 escape 또는 작은따옴표 회피).
- 파일 상단 주석에 갱신 시각·데이터 기준을 남긴다.
- **위 필드명·구조를 바꾸거나 빼지 않는다** — index.html이 전부 참조한다(base/baseAt=신선도, stance=리더보드, events=캘린더, target=목표가 거리).

> 🧠 정밀분석 vs 🤖 자동분석: analysis.js(LIVE_ANALYSIS)에 있는 종목은 "정밀분석"으로 표시되고,
> 없는 종목은 심부름꾼이 `analyze_auto.py`로 만든 auto_analysis.js(LIVE_AUTO)의 "자동분석"이 대신 뜬다.
> **정밀분석이 자동분석을 항상 덮는다(우선)**. 즉 특정 종목을 정밀분석하려면 analysis.js에 그 종목을 넣기만 하면
> 되고, 자동분석 목록에서 자동으로 빠진다(analyze_auto.py가 정밀분석 종목을 건너뜀). tickers.js 전체를 매번
> 정밀분석할 필요 없음 — **핵심 종목만 정밀분석, 나머지는 자동분석에 맡겨 토큰을 아낀다.**

## 3단계 — 히스토리 기록

`python3 archive_analysis.py` 실행 → 오늘 판단(CHIEF + 4인 stance/score)을 history.js에 누적.
**"updated"의 분 단위 시각까지 다르면 하루에 여러 번 재분석해도 각각 별도 기록으로 쌓인다**
(정확히 같은 시각으로 재실행할 때만 그 기록을 덮어씀). **직접 history.js를 편집하지 말 것.**

> ⚠️ 2026-07-08 사고: 예전 버전은 "같은 날짜"로만 구분해 하루 2번 재분석 시 오전 기록이
> 통째로 사라졌다(장중 급변일에 치명적). archive_analysis.py를 고쳐 재발하지 않지만,
> **`updated`에 반드시 HH:MM까지 정확히 채워야** 이 보호가 작동한다(0단계 규칙과 연결).

## 4단계 — 검증 (필수, 생략 금지)

아래 스니펫을 **그대로 실행**해서 확인한다(눈 검증 금지 — 실제 실행 결과로만 판정):

```bash
node -e "
const fs=require('fs');
const AN=new Function(fs.readFileSync('analysis.js','utf8')+';return LIVE_ANALYSIS;')();
const DT=new Function(fs.readFileSync('data.js','utf8')+';return LIVE_DATA;')();
let bad=0;
for(const [code,b] of Object.entries(AN)){
  if(code==='date'||code==='market') continue;
  const p=DT.stocks[code]&&DT.stocks[code].price;
  if(b.base!==p){ console.log('base 불일치',code,b.base,'!=',p); bad++; }
  for(const a of ['taro','diana','nova','flow'])
    if(!b[a]||!Array.isArray(b[a].findings)||b[a].findings.length!==4){ console.log('findings 이상',code,a); bad++; }
  if(!/\d{2}:\d{2}/.test(b.updated||'')){ console.log('updated에 HH:MM 없음',code); bad++; }
}
console.log(bad? '❌ '+bad+'건 수정 필요':'✅ base·findings·updated 전부 정상 ('+(Object.keys(AN).length-2)+'종목)');
"
```

1. 위 스니펫 ✅ (base ≡ data.js price / findings 4개 / updated HH:MM) — **하나라도 ❌면 고치고 재실행.**
2. `python3 archive_analysis.py` 실행 후 history.js가 `node -e "new Function(...+';return LIVE_HISTORY;')()"`로 파싱 성공?
3. (화면 확인까지 요청받았으면) Playwright: chromium 실행파일 `/opt/pw-browsers/chromium`,
   `NODE_PATH=/opt/node22/lib/node_modules`로 `require('playwright')`. 로컬 서버는
   `(python3 -m http.server <새 포트> &>/dev/null &)` 서브셸 백그라운드 + **매번 새 포트**(재사용하면 죽은 서버에 붙는 사고 잦음).
불일치 발견 시 고치고 재검증한 뒤에만 완료를 선언한다.

## 완료 보고

"analysis.js 갱신 완료 (N종목)" + 종목별 한 줄 요약(call/total/confidence/base) + 수집 실패 항목(있으면).
