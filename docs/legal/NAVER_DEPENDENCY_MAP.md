# 네이버 의존성 지도 (NAVER DEPENDENCY MAP) — 2026-09-16

> 목적: 네이버 금융이 지금 GAEO 에서 **정확히 무엇을** 담당하는지를 코드 기준으로 전수조사한 표.
> 추측으로 분류하지 않았다 — 모든 행은 `grep` 과 실제 산출물(`data.js`·`analysis_data.json`·`indicators.json`·`auto_analysis.js`)의 키 확인으로 만들었다.
> 기계용 원본: `config/data_supply_migration.json` (시험 `test_data_supply_migration.py` 가 어휘·완전성·소비자 파일 존재를 잠근다).
> 판정·대체 후보·법적 근거는 `docs/legal/SOURCE_REPLACEMENT_MATRIX.md`, 준법 판정표는 `docs/legal/SOURCE_COMPLIANCE_MATRIX.md`.

## 0. 한눈에

| 축 | 네이버가 주는 것 | 없어지면 |
|---|---|---|
| TARO(기술 · 가중치 약 31%) | 일봉 OHLCV 10개월(siseJson) · 오늘 고가(급등 반납 감점) | MA/RSI/MACD/교차/볼린저 전부 계산 불가 → 축 소실 |
| QUANT(확률 · 약 26%) | 같은 일봉(600종목 누적 통계표) | 승률 통계 불가 → 축 소실 |
| FLOW(수급 · 약 30%) | 외국인·기관·개인 순매수 5거래일 · 외국인 보유율(integration dealTrendInfos) | 축 소실 → CHIEF 가 3축으로 재정규화(판단은 유지) |
| DIANA(재무 · 약 12%) | PER·PBR·EPS(itemSummary) · BPS(→ROE) · 컨센서스 목표주가·추정EPS(405/600 종목) | PER/PBR/ROE 없으면 축 소실 · 컨센서스만 없으면 목표가·선행PER 항(±18점)만 빠짐 |
| RISK(감점) | 같은 일봉(vol20·mdd3m·반등률) · 52주 밴드(표시용) | 감점 계산 불가 → 감점 0 |
| CHIEF | 위 축들의 합 · 현재가(base) | 기준가(base)가 없으면 판단 자체가 없다 |
| 화면·SEO | 현재가·등락·PER·PBR·ROE·EPS·배당·시총·52주·지수·환율·캔들·시장지도 | 홈·종목 카드·스냅샷 페이지 대부분 |
| 채점·검증 | base(현재가) · 5거래일 뒤 종가(price_history) · 수급 원본(flow_history) | 성적표·team_weights·Evolution 입력 |

축 가중치(약 31/26/30/12%)는 `team_weights.js` **전역값**(2026-09-16 기준)이다. 업종 오버라이드가 있으면 종목별로 달라진다(`analyze_auto.py load_team_weights` · 승인된 Evolution override 가 있으면 전역 단일 적용). 한계값은 §2 의 실제 코드 값(비대칭)을 따른다.

## 1. endpoint 별 요청량 (실제 워크플로 기준 · 거래일 1일 추정)

| endpoint | 호출 파일 | 주기 | 1회차 요청 | 하루 추정 | 읽는 필드 |
|---|---|---|---|---|---|
| `api.finance.naver.com/service/itemSummary.naver?itemcode=` | `update_prices.py` | 10분(08:58~16:00 · 약 43회차) | 600 | ≈25,800 | `now` `rate` `per` `pbr` `eps` `marketSum` (응답의 `diff` `risefall` `quant` `amount` 는 미사용) |
| `m.stock.naver.com/api/stock/{code}/integration` | `update_prices.py` | 10분 | 600 | ≈25,800 | `totalInfos.bps` `dividendYieldRatio` `lowPriceOf52Weeks` `highPriceOf52Weeks` |
| 같은 integration | `collect_analyst_data.py` | 30분(08:58~16:05 · 약 15회차) | 600 | ≈9,000 | `totalInfos.cnsEps` `bps` `dealTrendInfos[0:10]` `consensusInfo.priceTargetMean` `recommMean` |
| `api.finance.naver.com/siseJson.naver?symbol=` (10개월 일봉) | `collect_analyst_data.py` | 30분 | 600 | ≈9,000 | `[날짜,시가,고가,저가,종가,거래량,외국인소진율]` |
| 같은 siseJson (15일 창) | `update_price_history.py` | 30분 | 602 | ≈9,030 | 위와 같음(price_history.js 갱신) |
| `m.stock.naver.com/api/index/{idx}/basic` | `update_prices.py` · `collect_analyst_data.py` | 10분/30분 | 2 | ≈116 | `closePrice` `compareToPreviousClosePrice` `fluctuationsRatio` |
| `m.stock.naver.com/api/index/{idx}/price` + siseJson symbol=KOSPI | `update_index_history.py` | 30분 | ≈14 | ≈210 | `localTradedAt` `closePrice` `openPrice` `highPrice` `lowPrice` `accumulatedTradingVolume` |
| `m.stock.naver.com/api/stocks/marketValue/{market}` (bulk 100/페이지) | `collect_market_universe.py` · `fetch_krx_list.py`(7일마다) | 30분 · 주 2회 | 44 | ≈660 | `itemCode` `stockName` `closePriceRaw` `fluctuationsRatio` `marketValueRaw` `accumulatedTradingValueRaw` `tradableStatus` `stockEndType` |
| `finance.naver.com/marketindex/*` (HTML) | `update_prices.py` | 10분 | 2 | ≈86 | 환율 `sale` `value` `change` |
| **합계** | | | | **≈ 80,000 요청/거래일** | 종목 확대·주기 단축은 `legal_source_gate.py`(NAVER_RATE_INCREASED)가 막는다 |

## 2. 필드 → 내부 필드 → 분석가 → 최종 판단 (NAVER FIELD → INTERNAL → ANALYST → DECISION)

중요도: **CRITICAL**(없으면 BUY/HOLD/SELL 이 바뀌거나 축이 사라짐) · **IMPORTANT**(점수 문구·보조 기능·검증에 필요) · **DISPLAY_ONLY**(화면만) · **LEGACY_UNUSED**(아무도 안 읽음 → 제거 후보).

| # | GAEO 데이터 | 네이버 필드 | 내부 필드(파일) | 읽는 곳 | 판단 영향 | 화면 | 성적표 | 검증 | 중요도 |
|---|---|---|---|---|---|---|---|---|---|
| A | 현재가 | itemSummary `now` | `data.js price` → `indicators price` → `auto_analysis base` → `history.js base` → 봉인 원본 | update_prices → compute_indicators → analyze_auto → archive/decision_records | **DIRECT** DIANA 목표가 괴리·선행PER 의 분모 · 모든 판단의 기준가 · 채점 분모 | ○ | ○ | ○ | CRITICAL |
| B | 전일대비·등락률 | itemSummary `rate` | `data.js rate` · `marketBrief.breadth` | app.js · 홈 브리핑 | 없음(산식 미포함) | ○ | | | IMPORTANT |
| C | 시가 | siseJson [1] | `analysis_data daily.open` · `price_history` | 캔들차트 | 없음 | ○ | | | DISPLAY_ONLY |
| D | 고가 | siseJson [2] | `daily.high` → `tech.todayGiveback` · `rebound_watch` | compute_indicators · analyze_auto(taro_eval) | **DIRECT(소폭)** 고가 대비 종가 반납이 6% 를 넘으면 초과분만큼 TARO 감점 −min(15, 반납%−6) | ○ | | | IMPORTANT |
| E | 저가 | siseJson [3] | `daily.low` · `price_history` | 캔들차트 | 없음 | ○ | | | DISPLAY_ONLY |
| F | 거래량 | siseJson [5] · dealTrends `accumulatedTradingVolume` | `daily.volume` → `tech.volRatio` · `flow.periodVolume`(수급 비율 분모) · `radar` | compute_indicators · radar_signals · rebound_watch | INDIRECT: TARO 점수 아님(근거 문구) · 레이더 신호 · 수급 품질점수 분모 | ○ | | | IMPORTANT |
| G | 거래대금 | totalInfos `accumulatedTradingValue` · 전체시장 `accumulatedTradingValueRaw` | 종목별: 아무도 안 읽음 · 전체시장: 집중도 통계 | collect_market_universe | 없음 | ○(시장지도) | | | LEGACY_UNUSED(종목별) |
| H | 시가총액 | itemSummary `marketSum`(백만원) · totalInfos `marketValue` · 전체시장 `marketValueRaw` | `data.js cap('N조')` · `flow_history mcapEok` · 전체시장 시총가중 수익률 · Guardian cap 순위 | update_prices · update_flow_history · guardian | 없음(판단) · Guardian 상폐 판정 보조 | ○ | | ○ | IMPORTANT |
| I | PER | itemSummary `per` | `data.js per` → `indicators per` | analyze_auto(diana_eval) | **DIRECT** DIANA +12(PER<10) ~ −10(PER≥40) · 적자 −6 | ○ | | | CRITICAL |
| J | PBR | itemSummary `pbr` | `data.js pbr` | diana_eval | **DIRECT** DIANA +8(PBR<1) ~ −6(PBR≥5) | ○ | | | CRITICAL |
| K | EPS·BPS·ROE | itemSummary `eps` · totalInfos `bps` → `roe = eps/bps` | `data.js eps` `roe` | diana_eval | **DIRECT** ROE +8(≥15%) ~ −6(<0) · EPS 는 문구 | ○ | | | CRITICAL |
| L | 외국인 순매수·보유율 | dealTrendInfos `foreignerPureBuyQuant` `foreignerHoldRatio` `bizdate` | `indicators flow.frgnSum/holdNow/holdBefore/todayFrgn/qualityScore` · `flow_history/` | compute_indicators(flow_summary) · analyze_auto(flow_eval) · update_flow_history | **DIRECT** FLOW 최대 ±16(순매수) ±6(보유율) · 가중치 약 30% | ○ | | ○ | CRITICAL |
| M | 기관 순매수 | dealTrendInfos `organPureBuyQuant` | `flow.orgSum/todayOrg` | flow_eval | **DIRECT** FLOW 최대 ±10 | ○ | | ○ | CRITICAL |
| N | 개인 순매수 | dealTrendInfos `individualPureBuyQuant` | `flow.indiSum/todayIndi` | flow_eval(문구) | 없음(문구) | ○ | | ○ | IMPORTANT |
| O | 프로그램·거래원 | (수집하지 않음) | | | | | | | 해당 없음 |
| P | 컨센서스 | consensusInfo `priceTargetMean` `recommMean` · totalInfos `cnsEps` `cnsPer` | `indicators targetMean/targetGap/fwdPer/cnsEps` · `chief.target` 문구 | diana_eval · chief_eval | **DIRECT** DIANA 목표가 괴리 +12/−16 · 선행PER +6/−5 (컨센서스 항 합계 최대 +18/−21 · 405/600 종목만 보유) · `recommMean` 은 indicators 에 옮겨지나 소비자 0 · `cnsPer` 는 indicators.json 에 없음(analysis_data 원문에만) | ○ | | | IMPORTANT |
| Q | 기타 재무 | totalInfos `dividendYieldRatio` `low/highPriceOf52Weeks` · siseJson [6] `frgnRate` · totalInfos `foreignRate` | `data.js div` `w52` · `risk.pos52w`(표시용) · `daily.frgnRate`(미사용) | app.js · risk_for | 없음(pos52w 는 RISK 감점 식(vol20·mdd3m)에 안 들어감 · `research_engine.py` 그림자 연구 지표 20/60 일 창만 읽음) | ○ | | | DISPLAY_ONLY / LEGACY_UNUSED(frgnRate·foreignRate) |
| R | 종목 목록(전체 상장) | marketValue `itemCode` `stockName` … | `krx_list.json`(이름과 달리 네이버) · `market_universe/full_market_latest.json.gz` · `market_context.js` | fetch_krx_list · collect_market_universe · guardian · market-map.js · 관리자 자동완성 | 없음(판단) · Guardian 상폐 1차 증거 · 전체시장 Breadth·시장지도 | ○ | | ○ | IMPORTANT |
| S | 시장구분 | marketValue 경로 `{market}` | `krx_list m` · `market_universe market` | guardian · market_universe | 없음 | ○ | | ○ | IMPORTANT |
| T | 과거 일봉(≈10개월) | siseJson 배열 | `analysis_data daily` · `price_history.js`(189k행) · `indicators tech/risk` · `radar` · `dow_stats` · `rotation` · `rebound_watch` · `team_weights`(채점) · `model_intelligence` · QUANT 통계표 | compute_indicators · analyze_auto · compute_radar · compute_dow_stats · compute_rotation · compute_rebound_watch · compute_team_weights · compute_model_intelligence · decision_records(evaluate) · gaeo_evolution | **DIRECT** TARO·QUANT·RISK 전부 · 5거래일 뒤 채점 | ○ | ○ | ○ | CRITICAL |
| U | 지수 | index basic/price · siseJson symbol=KOSPI | `data.js indices` · `indicators indices/indicesTech` · `index_history.js` · `rotation_snapshot`(시장 상대) | update_prices · update_index_history · compute_indicators · compute_rotation | 없음(시장국면 marketRegime 은 600종목 단면으로 계산) · 홈 지수 카드 · 순환매 시장 게이트 | ○ | | | IMPORTANT |
| V | 환율 | marketindex HTML | `data.js fx` | app.js | 없음 | ○ | | | DISPLAY_ONLY |
| W | 거래정지·상품유형 | marketValue `tradableStatus` `stockEndType` | `market_universe` ELIGIBLE 판정 · Guardian | collect_market_universe · guardian | 없음(판단) · 전체시장 통계 적격 판정 | ○ | | ○ | IMPORTANT |

### 실측 보유 현황(2026-09-16 16:02 회차 · 600종목)

`price/rate/per/pbr/roe/eps/cap/w52` 600/600 · `div` 435 · 컨센서스 405(추정EPS 281) · 수급(dealTrends) 599 · 일봉 길이 최소 82 / 중앙값 210 봉.
`data.js per` 와 `price ÷ eps` 의 차이: 중앙값 0.01% · p90 0.07% · 최대 0.5% → 네이버 PER 정의는 "현재가 ÷ 응답의 eps" 와 사실상 같다(재무 계열을 DART 로 옮길 때 EPS 정의만 맞추면 된다).

## 3. 아무도 읽지 않는 네이버 필드 (LEGACY_UNUSED → 제거 후보)

| 필드 | 어디에 저장 | 확인 방법 |
|---|---|---|
| siseJson 일봉 [6] `frgnRate` | `analysis_data.json daily` | `grep -rn frgnRate` → collect_analyst_data.py 의 저장 줄 하나뿐 |
| totalInfos `foreignRate` `accumulatedTradingValue` `accumulatedTradingVolume` `openPrice` `highPrice` `lowPrice` | `analysis_data.json info.totalInfos` | 소비자 0 — `lastClosePrice`·`marketValue` 는 **미사용이 아니다**(`update_flow_history.py:108` 시총·주식수 추정에 읽음 → 새 계약에도 종가·시총 필요) |
| consensusInfo `recommMean` · totalInfos `cnsPer` | `recommMean` → `indicators.json`(옮기기만 함) · `cnsPer` → `analysis_data.json` 원문에만(indicators 에 없음) | 둘 다 소비자 0(2026-09-17 grep 재확인) |
| itemSummary `diff` `risefall` `quant` `amount` | 저장 안 함(응답에만 있음) | price_provenance `excludedKeys` |

제거는 이번 작업 범위 밖이다(수집 코드를 건드리지 않는다). 전환 시 새 계약에는 넣지 않는다.

## 4. 공개 저장소에 남는 네이버 원자료·준원자료 (§17)

| 파일 | 누가 읽나 | 성격 | 전환 뒤 계획(제안 · 이력 삭제 없음) |
|---|---|---|---|
| `data.js` | **사이트**(app.js · 스냅샷 · 관리자) | 파생 필드(현재가·PER 등 값 그대로) · 매 10분 커밋 | 유지 — 값의 출처만 공식 공급자로 바뀐다(구조 불변) |
| `price_provenance.json` | 분석(compute_indicators) · 봉인 원본 | 값 해시·관측시각 | 유지 — `provider` 가 실제 공급자로 바뀐다 |
| `analysis_data.json` (22MB) | 분석만(compute_indicators · analyze_auto · radar · dow_stats · team_weights · flow_history · evolution) · 사이트 안 읽음 · Pages 제외(raw 접근 가능) | **네이버 필드명 원문**(totalInfos·dealTrends·consensusInfo) | 전환 뒤 내부 계약 모양으로 재구성 → 네이버 원문 구조는 **삭제 가능**(수급 원본은 flow_history 로 이미 분리) |
| `price_history.js` (189k행) | **사이트**(캔들·가격 흐름·5일 뒤 종가) · 채점(decision_records · scoreboard) · 순환매·반등 | 일봉 OHLCV 그대로 | 공식 일봉으로 이어 쓴다. 네이버 유래 과거분은 채점 근거라 **비공개 보존 또는 파생값(종가만)으로 축소**를 OWNER 결정 |
| `index_history.js` | **사이트**(지수 패널) · 순환매 | 지수 일봉 | 공식 지수 데이터셋으로 교체 뒤 삭제 가능 |
| `krx_list.json` | 관리자 자동완성 · Guardian(시장 맵) · rotation(이름) · paper(은퇴) | 이름·코드·시장 | 공식 목록으로 교체 뒤 삭제 가능(이름 자체가 오해를 부른다) |
| `market_universe/full_market_latest.json.gz` (3,908행) | **사이트**(market-map.js) · Guardian | 전체시장 스냅샷(원자료에 가까움) | 공식 전 종목 일별 시세로 교체 → 삭제 가능(history/ 집계는 파생이라 보존) |
| `market_universe/source_verify.json` | smoke | 필드 이름·비율만(표본값은 2026-09-16 제거) | 유지 |
| `flow_history/` | 검증·연구(check_flow_validation_readiness) · Pages 제외 | 수급 파생(일별 순매수) | **대체 불가 자료** → 비공개 보존 후보(OWNER) |
| `research_archive/decisions/originals` | 채점·검증 | 봉인 판단 원본(base 가격 포함 · 불변) | 유지(이력 삭제 없음) |
| `snap/stock/*.html` | **사이트·검색엔진** | 현재가·PER·PBR·시총 문구 | 유지 — 값의 출처만 바뀐다 |

이번 작업에서 위 파일을 삭제·재작성하지 않았다(§17: 과거 Git history 삭제 없음).
