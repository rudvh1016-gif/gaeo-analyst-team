# 대체 공급망 판정표 (SOURCE REPLACEMENT MATRIX) — 2026-09-16 · LEGAL DATA SUPPLY MIGRATION PHASE 1

> 목적: 네이버가 담당하는 데이터 기능을 상품별로 쪼개고, 각 상품마다 **공식·허가·라이선스가 명확한** 대체 공급원을 찾아
> 실제 교체 가능한 상태까지 준비한다. 네이버를 지키는 것이 목표가 아니라 GAEO 를 지키는 것이 목표다.
> 원칙: "공식 API" ≠ "상업적 재배포 가능". "공공데이터니까 자유롭게 상업 사용 가능" 이라고 가정하지 않는다. 불명확하면 `OWNER_CONFIRMATION_REQUIRED` / `COMMERCIAL_USE_NOT_CLEARED`.
> 의존성 지도: `docs/legal/NAVER_DEPENDENCY_MAP.md` · 기계용 원본: `config/data_supply_migration.json` · 준법 판정: `config/source_compliance.json`.

## 완료 상태 — **OWNER_CONFIRMATION_REQUIRED**

공식 약관·이용허락범위 원문을 이 세션에서 열 수 없었고(egress 차단), 검색 결과로 확인한 2차 근거는 **가장 유력한 무료 공식 후보(공공데이터포털 금융위원회_주식시세정보)조차 광고 사이트에서의 상업적 이용이 허용되는지 확정해 주지 않는다.**
따라서 다음 단계(실제 호출 · Production 전환 순서 확정)는 소유자가 §8 의 항목을 직접 확인해야 결정된다.
그 전에 할 수 있는 것은 전부 했다: 의존성 지도, 상품별 판정, shadow 어댑터(합성 픽스처·게이트 닫힘), 오프라인 판단 영향 비교(실자료).

## 1. 최종 대체 MATRIX

교체 가능 여부: `READY_TO_REPLACE` / `READY_FOR_SHADOW` / `OWNER_APPROVAL_REQUIRED` / `NO_SAFE_REPLACEMENT_FOUND`

| GAEO 데이터 | 현재 네이버 필드 | 현재 사용처 | 중요도 | 공식 대체 후보 | 법적 상태 | 데이터 품질 | 무료 | 추가 승인 | 교체 가능 여부 |
|---|---|---|---|---|---|---|---|---|---|
| A 현재가 | itemSummary `now` | 기준가(base)·DIANA 분모·화면·채점 | CRITICAL | 공공데이터포털 주식시세정보 `clpr` | OWNER_CONFIRMATION_REQUIRED · 상업 이용 미확인 | 공식 확정 종가 · **T+1** · 전 종목 | ○ | 이용허락범위·(필요 시) KRX 정보이용계약 | OWNER_APPROVAL_REQUIRED |
| B 전일대비·등락률 | itemSummary `rate` | 화면·홈 브리핑 | IMPORTANT | 같은 데이터셋 `vs` `fltRt` | 위와 같음 | T+1 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| C/D/E 시가·고가·저가 | siseJson [1][2][3] | 캔들·TARO 급등반납 감점(고가) | DISPLAY_ONLY / IMPORTANT | `mkp` `hipr` `lopr` | 위와 같음 | T+1 · 조정주가 여부 미확인 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| F 거래량 | siseJson [5] · dealTrends 누적거래량 | volRatio 문구·레이더·수급 비율 분모 | IMPORTANT | `trqu` | 위와 같음 | T+1 확정치 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| G 거래대금 | totalInfos(미사용) · 전체시장 | 전체시장 집중도 | LEGACY_UNUSED(종목별) | `trPrc` | 위와 같음 | T+1 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED(전체시장) · 종목별은 제거 |
| H 시가총액 | `marketSum`(백만원) · `marketValueRaw` | cap 표시·Guardian·연구 정규화 | IMPORTANT | `mrktTotAmt`(원) · `lstgStCnt` | 위와 같음 | T+1 · 단위 변환 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| I/J PER·PBR | itemSummary `per` `pbr` | DIANA PER +12/−10 · PBR +8/−6 | CRITICAL | 종가(공공데이터) ÷ EPS·BPS(OpenDART 재무제표) | 두 원천 모두 OWNER_CONFIRMATION_REQUIRED | 정의 변경(네이버=최근 4분기 추정 EPS 기준 · DART=공시 재무 기준). 실측: 오늘 자료로 재계산해도 판정 변화 0(정의가 같을 때의 하한) | ○ | 정의 변경 승인 + DART 약관 | OWNER_APPROVAL_REQUIRED |
| K EPS·BPS·ROE | `eps` · totalInfos `bps` | DIANA ROE +8/−6 | CRITICAL | OpenDART 재무제표(이미 `dart_financials/` 수집 중) | OWNER_CONFIRMATION_REQUIRED(terms.do 원문) | 분기/연 단위(장중 갱신 없음) | ○ | DART 약관 재배포·출처표시 확인 | OWNER_APPROVAL_REQUIRED |
| L/M 외국인·기관 수급 | dealTrendInfos | FLOW(가중치 약 30%) · flow_history | CRITICAL | **없음** — KRX Open API 미제공 · KRX Data Marketplace 별도 계약 · 증권사 API 제3자 제공 금지 | — | — | — | — | **NO_SAFE_REPLACEMENT_FOUND** |
| N 개인 수급 | dealTrendInfos | FLOW 문구 | IMPORTANT | 없음 | — | — | — | — | NO_SAFE_REPLACEMENT_FOUND |
| P 컨센서스 | consensusInfo · cnsEps | DIANA 목표가 괴리 +12/−16 · 선행PER +6/−5(합계 최대 +18/−21) | IMPORTANT | **없음** — 증권사 리서치 집계는 유료(FnGuide 등) | — | — | — | — | **NO_SAFE_REPLACEMENT_FOUND** |
| Q 배당·52주 고저 | totalInfos | 화면·risk.pos52w(표시) | DISPLAY_ONLY | 52주=1년 공식 일봉 파생 · 배당=DART 배당 공시/금융위원회_주식배당정보 | OWNER_CONFIRMATION_REQUIRED | 파생 가능 | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| R/S 종목 목록·시장구분 | marketValue bulk | Guardian·시장지도·관리자 자동완성 | IMPORTANT | 주식시세정보 전 종목(basDt) · KRX상장종목정보(15094775) | 후자는 2차 자료상 **제4유형(상업 이용금지)** | T+1 | ○ | 유형 확인 | OWNER_APPROVAL_REQUIRED |
| T 과거 일봉 10개월 | siseJson | TARO·QUANT·RISK·레이더·채점 | CRITICAL | 주식시세정보 `beginBasDt/endBasDt`(종목별 백필) + 매일 1건 적재 | OWNER_CONFIRMATION_REQUIRED | T+1 · 조정주가 미확인 · 기업행사는 별도(주식권리일정정보 제2유형) | ○ | 위와 같음 | OWNER_APPROVAL_REQUIRED |
| U 지수 | index basic/price | 홈 지수 카드·순환매 시장 게이트 | IMPORTANT | 금융위원회_지수시세정보(15094807) | OWNER_CONFIRMATION_REQUIRED | T+1 | ○ | 유형 확인 | OWNER_APPROVAL_REQUIRED |
| V 환율 | marketindex HTML | 화면 | DISPLAY_ONLY | 한국은행 ECOS · 한국수출입은행 현재환율 API | OWNER_CONFIRMATION_REQUIRED(작성기관·유형) | 일 1회 고시(장중 변동 없음) | ○ | 유형 확인 | OWNER_APPROVAL_REQUIRED · **가장 쉬운 교체 1순위 후보** |
| W 거래정지·상품유형 | marketValue `tradableStatus` `stockEndType` | 전체시장 적격 판정·Guardian | IMPORTANT | 없음(시세 데이터셋에 거래정지 표시 없음 · 시장조치는 OpenDART/KIND 계열 별도 게이트) | — | — | — | — | NO_SAFE_REPLACEMENT_FOUND |

집계(`config/data_supply_migration.json` 23건 · 시험이 어휘를 잠금): OWNER_APPROVAL_REQUIRED **17** · NO_SAFE_REPLACEMENT_FOUND **5**(L·M·N·P·W) · READY_TO_REPLACE **1**(O 프로그램·거래원 — 애초에 수집하지 않아 교체할 대상이 없는 형식상 1건, 실질 0) · READY_FOR_SHADOW **0**. **어느 후보도 "광고가 붙은 공개 사이트에서 자동수집·저장·파생 공개·상업 이용" 네 게이트가 전부 열린 상태로 확인되지 않았다.** 어댑터는 그래서 합성 픽스처까지만 갔다.

## 2. LEGAL EVIDENCE (확인일 2026-09-16 · 확인 방법: 검색 결과 스니펫 · **원문 미열람**)

이 세션은 `data.go.kr` `fsc.go.kr` `kogl.or.kr` `opendart.fss.or.kr` `openapi.krx.co.kr` `corp.tossinvest.com` `developers.tossinvest.com` `apiportal.koreainvestment.com` `ecos.bok.or.kr` `koreaexim.go.kr` 로의 네트워크가 정책상 차단됐다(`curl` 000 · `WebFetch` EGRESS_BLOCKED). 아래 "확인된 사실" 은 검색 결과에 인용된 공식 페이지 스니펫과 이용 사례의 교차 확인이며, 소유자가 URL 을 직접 열어 재확인해야 한다. 이 문서는 법률 자문이 아니며 "합법 확인" 을 선언하지 않는다.

| 후보 | 공식 URL | 확인된 사실(2차) | 미확인(원문 필요) | 판정 |
|---|---|---|---|---|
| 공공데이터포털 **금융위원회_주식시세정보** (15094808) | https://www.data.go.kr/data/15094808/openapi.do · 이용정책 https://www.data.go.kr/ugs/selectPortalPolicyView.do · 금융위 FAQ https://www.fsc.go.kr/in060501 | 제공기관 금융위원회(원천 한국거래소) · 갱신 일 1회 · **기준일 다음 영업일 13:00 이후 개방, 실시간 아님(금요일 자료는 월요일)** · 오퍼레이션 4개 중 getStockPriceInfo · 응답 basDt srtnCd isinCd itmsNm mrktCtg clpr vs fltRt mkp hipr lopr trqu trPrc lstgStCnt mrktTotAmt · serviceKey 필요 · 포털 일반 한도 개발계정 1,000/일·운영계정 100,000/일(활용사례 등록 시 증량) · numOfRows 를 크게(10,000) 주면 전 종목이 한 페이지 | **이용허락범위(공공누리 유형)** · 상업적 이용 · 재배포 · 캐시·저장 · 파생값 공개 · 출처표시 문구 · "한국거래소와 정보이용계약" 안내 유무 | OWNER_CONFIRMATION_REQUIRED · commercialUse PERMISSION_NOT_VERIFIED |
| 금융위원회_지수시세정보 (15094807) | https://www.data.go.kr/data/15094807/openapi.do | KRX 주가·채권·파생 지수의 시가·고가·저가·종가·대비·거래량 · 같은 T+1 | 유형·상업 이용 | OWNER_CONFIRMATION_REQUIRED |
| 금융위원회_KRX상장종목정보 (15094775) | https://www.data.go.kr/data/15094775/openapi.do | 상장 종목 기본정보 · 일 1회 · **검색 스니펫: 공공누리 제4유형(출처표시+상업적 이용금지+변경금지)** | 원문 | PERMISSION_NOT_VERIFIED(상업) |
| 금융위원회_주식권리일정정보 (15059609) | https://www.data.go.kr/data/15059609/openapi.do | **검색 스니펫: 제2유형(출처표시+상업적 이용금지) · 상업 활용 시 원천 소유자(한국예탁결제원)와 정보이용계약 필요** | 원문 | 참고(형제 데이터셋의 상업 제한 패턴) |
| 공공누리 유형 정의 | https://www.kogl.or.kr/info/license.do | 제1유형 출처표시(상업·변경 가능) · 제2유형 +상업 금지 · 제3유형 +변경 금지 · 제4유형 +상업 금지+변경 금지 · 상업 이용은 별도 이용허락으로 가능 | — | 기준 |
| OpenDART | https://opendart.fss.or.kr/intro/terms.do · https://opendart.fss.or.kr/guide/main.do?apiGrpCd=DS001 | 공식 오픈API·인증키·개발가이드 · 약관은 사이트에 게시되고 개정 시 공지 | 저작권·출처표시·재배포·상업 조항 | OWNER_CONFIRMATION_REQUIRED(기존 판정 유지) |
| KRX Open API | https://openapi.krx.co.kr/contents/OPP/INFO/OPPINFO002.jsp · 서비스 목록 https://openapi.krx.co.kr/contents/OPP/INFO/service/OPPINFO004.cmd | 비상업 목적만 · 원자료 제3자 재배포 금지 · 'KRX 통계정보' 표시 · **투자자별 거래실적·외국인 보유·공매도·PER/PBR 은 API 미제공**(Data Marketplace 에만 있음) | — | COMMERCIAL_USE_NOT_CLEARED · 수급 대체 불가 |
| 토스증권 Open API | https://corp.tossinvest.com/ko/terms/v2?id=752 · https://developers.tossinvest.com/docs/market-data | 공식 OAuth API · candles(분/일봉, 최대 200) 제공 · **2차 자료(기술 블로그 요약): 시세 정보의 상업적 활용·제3자 제공 금지, 개인 투자 자동화 한정, 위반 시 계좌 이용 제한** · 수급 제공 여부 확인 안 됨 | 약관 원문 조항 번호·문구 | PERMISSION_NOT_VERIFIED(공개 광고 사이트 공급원으로 부적합 신호) |
| 한국투자증권 KIS Developers | https://apiportal.koreainvestment.com/intro · 약관 PDF(file.koreainvestment.com, 개정 2025.6.4) | **2차 자료: 시세정보는 계좌 보유 개인 고객이 자기 자산 투자 목적에 한해 이용, 제3자 제공 불가** · 오픈API 약관 제5조③ 취지 인용(GitHub 이슈) | 원문 | PERMISSION_NOT_VERIFIED(부적합 신호) |
| 한국은행 ECOS | https://ecos.bok.or.kr/api/ | 한국은행 **작성** 통계는 출처 명시 시 상업 포함 자유 이용·재배포 · 타 기관 작성분은 비상업만(상업은 작성기관 승인) · 인증키당 약 1,000회/일 | 원/달러 환율 계열의 작성기관(한국은행 vs 서울외국환중개) | OWNER_CONFIRMATION_REQUIRED |
| 한국수출입은행 현재환율 API | https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C · https://www.data.go.kr/data/3068846/openapi.do | 영업일 11:00 전후 고시 · 공공데이터포털 활용신청 · 요청 도메인 oapi.koreaexim.go.kr 로 이전 중 | 공공누리 유형 | OWNER_CONFIRMATION_REQUIRED |
| 네이버 금융(현행) | https://policy.naver.com/rules/service.html | 2026-09-16 감사: PERMISSION_NOT_VERIFIED · 확대 동결 | 사전 승낙 | 계속 사용 여부 OWNER 결정(변경 없음) |

## 3. DATA QUALITY (후보별)

| 후보 | 최신성 | 정확성 | 종목 범위 | 거래일 범위 | 조정주가 | 거래정지 | 기업행사 | 수급 | 호출 제한 | 장애율 |
|---|---|---|---|---|---|---|---|---|---|---|
| 공공데이터포털 주식시세정보 | **T+1 13:00 이후**(장중 판단은 전일·전전일 종가 기준이 된다) | 공식(KRX 원천) 확정 종가 | 전 상장 주식(KOSPI·KOSDAQ·KONEX) | basDt 단일일 · beginBasDt/endBasDt 범위 | **미확인**(조정 인자 없음으로 가정 → 기업행사 창은 비교·채점 제외) | 표시 없음 | 없음(주식권리일정정보 별도) | 없음 | 개발 1,000/일 · 운영 100,000/일 · 600종목 하루 1호출 · 백필 ≈600×2호출 1회 | 미측정(포털 점검 시간 존재 가능) |
| 지수시세정보 | T+1 | 공식 | KOSPI·KOSDAQ 등 | 동일 | 해당 없음 | — | — | — | 동일 | 미측정 |
| OpenDART 재무제표 | 분기·연 공시 | 공식 | 상장법인 | 사업연도 | 해당 없음 | — | 공시로 파악 | — | 일 10,000(기존 ledger) | 기존 운영 |
| 네이버(현행) | 10분/장중 실시간 | 비공식 | 600 + 전체시장 | 10개월 | 미확인 | 있음 | 없음 | **5거래일 T+1** | 동결 | 실측 낮음 |

"이름이 같다고 뜻이 같다" 고 보지 않은 항목: 네이버 `now`(장중 현재가) ≠ 공식 `clpr`(확정 종가) · `marketSum`(백만원) ≠ `mrktTotAmt`(원) · 네이버 PER(현재가÷추정 EPS) ≠ 종가÷DART EPS · 외국인 `foreignerHoldRatio`(보유율) ≠ siseJson `frgnRate`(소진율, 미사용).

## 4. SHADOW RESULTS — 판단 영향(실자료 · 오프라인 · Production 변경 0 · 네트워크 0)

원본: `docs/legal/shadow/DECISION_SHADOW_20260916.md` · `.json` (도구 `python3 -m data_supply.shadow_compare`).
입력: 2026-09-16 16:02 회차(analysis_data.json) + 16:01 시세(data.js) · 600종목 · 시장국면 down_low · 자가 학습 가중치.
baseline 은 실제 `auto_analysis.js` 판정을 600/600 재현했다(시험 `DecisionShadowParity` 가 잠근다).

| 시나리오 | 뜻 | 판정 바뀜 | 전이 | 종합점수 \|Δ\| 평균 / p90 / 최대 | 축별 \|Δ\| 평균 (TARO/DIANA/QUANT/FLOW) |
|---|---|---|---|---|---|
| `lag1_official_close` | T+1 공식 자료만 있을 때(마지막 봉 제거 · 가격=직전 확정 종가) | **72 (12.0%)** | BUY→HOLD 8 · HOLD→BUY 15 · HOLD→SELL 21 · SELL→HOLD 28 | 1.83 / 5 / 15 | 5.82 / 0.47 / 2.08 / 0 |
| `no_consensus` | 컨센서스 없음(대체 불가) | **51 (8.5%)** | BUY→HOLD 9 · HOLD→SELL 42 | 0.94 / 2 / 3 | 0 / 7.59 / 0 / 0 |
| `no_flow` | 수급 없음(대체 불가) → CHIEF 3축 재정규화 | **99 (16.5%)** | HOLD→BUY 49 · HOLD→SELL 41 · SELL→HOLD 9 | 2.35 / 5 / 10 | 0 / 0 / 0 / 축 소실 599 |
| `per_pbr_from_close_eps_bps` | PER/PBR 을 종가÷EPS·BPS 로 재계산 | **0 (0%)** | — | 0.0 / 0 / 2 | 0 / 0.01 / 0 / 0 |
| `official_free_only` | 위 넷 합산 = 무료 공식 자료만 쓸 때의 근사 | **133 (22.2%)** | BUY→HOLD 4 · HOLD→BUY 44 · HOLD→SELL 66 · SELL→HOLD 19 | 3.53 / 8 / 24 | 5.82 / 7.62 / 2.08 / 축 소실 599 |

읽는 법(정직하게)
- 판단 보류(JUDGMENT_WITHHELD)는 어느 시나리오에서도 0 이다 — 축이 하나 빠져도 CHIEF 는 남은 축으로 판단을 만든다. **"네이버 없이도 BUY/HOLD/SELL 을 만들 수 있다" 는 뜻이지 "같은 판단이 나온다" 는 뜻이 아니다.**
- 가장 큰 변화는 수급 소실(16.5%)이고, 그 다음이 하루 시차(12.0%)다. 컨센서스 소실은 한 방향(BUY→HOLD, HOLD→SELL)으로만 8.5% 움직인다 — 목표가 항이 평균 +점수였기 때문이다.
- PER/PBR 재계산이 0 인 것은 **네이버 자신의 EPS·BPS** 로 재계산했을 때다(정의가 같을 때의 하한). DART EPS 로 바꾸면 값이 달라지므로 실제 차이는 이보다 크다. 그 비교는 DART 약관 확인 뒤 별도 shadow 로 한다.
- 하루 시차 시나리오는 16:02 마감 자료에서 마지막 봉을 뺀 것이라 "다음 날 아침에 어제 종가로 판단" 과 같다. 공식 자료는 13:00 이후에야 어제 봉이 오므로 오전 판단은 실제로 **이틀 전** 봉이 된다 — 여기 숫자는 하한이다.
- 어느 쪽이 정답인지는 말하지 않는다. 같은 산식·같은 가중치로 입력만 바꿨을 뿐이다.

공급자 값 대조(네이버 값 vs 공식 값)는 **실제 호출이 허용되지 않아 하지 않았다.** 대조 도구(`compare_daily_series`: 종목·거래일·시가·고가·저가·종가·거래량 필드별 상대차 · 정의 메모)는 합성 픽스처로 시험했고, 게이트가 열리면 5~20종목·1~3거래일부터 돌린다.

## 5. SHADOW ADAPTER 구조

```
공급자 응답 ──▶ data_supply/fsc_stock_price.py ──▶ data_supply/contracts.py(내부 계약) ──▶ 기존 GAEO 필드
   (getStockPriceInfo)   normalize_item · to_daily_series · to_quote     daily{date,open,high,low,close,volume}
                         provenance_for(provider=FSC_PUBLIC_DATA_PORTAL)  quote{name,price,rate,per,pbr,roe,eps,div,cap,w52,stale}
```
- 분석가는 공급자 이름을 몰라도 된다. 출처(provenance)에는 실제 공급자·데이터셋·기준일·수신시각·발췌 해시를 그대로 적는다(`scoringProofAccepted: false` — 채점 증명 인정은 별도 결정).
- `fetch_page/fetch_day` 는 `config/source_compliance.json` 의 `fsc_public_data:automatedCollection` 게이트가 열려 있지 않으면 **네트워크에 나가기 전에** `LegalGateError`. serviceKey 는 URL·예외·메타 어디에도 남지 않는다(redact).
- 값을 지어내지 않는다: 필수 필드 누락·고가<저가 같은 모순·숫자 아님 행은 사유와 함께 거른다. `frgnRate` 처럼 이 데이터셋에 없는 값은 None.
- 픽스처는 합성(`data_supply/fixtures/fsc_stock_price_synthetic.json`, 코드 9999xx). 실제 공급자 값은 커밋하지 않는다.
- 시험 `test_data_supply_migration.py`(28건): 지도 완전성 · 게이트 닫힘 · 어댑터 변환 · 키 비노출 · 대조 도구 · Production 재현(rebuild_indicators == indicators.json, evaluate == auto_analysis.js) · 시나리오 무오염 · 파일 무기록.

## 6. 반드시 답해야 하는 질문

- **Q1. 네이버 없이도 현재 BUY/HOLD/SELL 을 유지할 수 있는가?** 판단을 *만들* 수는 있다(보류 0). 그러나 *같게* 유지되지는 않는다: 무료 공식 자료만 쓰면 오늘 자료 기준 22.2%(133/600)의 판정이 바뀌고, FLOW 축이 사라지며 판단 기준가가 장중가에서 전일 확정 종가로 바뀐다. 게다가 그 무료 공식 자료의 상업 이용 허용이 아직 확인되지 않았다.
- **Q2. 가능하다면 어떤 공급자 조합인가?** 가격·일봉·시총·목록·시장구분 → 공공데이터포털 주식시세정보(+지수시세정보) · 재무(EPS·BPS→PER·PBR·ROE) → OpenDART · 환율 → ECOS/수출입은행 · 배당·기업행사 → DART/주식권리일정정보. **수급·컨센서스·거래정지 상태는 조합에 넣을 후보가 없다.** 공급자가 3~4곳으로 늘지만 호출량은 하루 수십 회(네이버 현행 약 80,000회 대비)라 토큰·장애점·비용 부담은 오히려 줄어든다. 단, 각 공급원의 키 관리(Actions Secret 2~3개)가 생긴다.
- **Q3. 대체가 가장 쉬운 것은?** 환율(표시 전용 · 일 1회면 충분 · 후보 라이선스만 확인) → 지수(홈 카드 · T+1 허용 가능) → 종목 목록·시장구분·시가총액(전체시장 통계·Guardian) 순.
- **Q4. 가장 어려운 것은?** 외국인·기관·개인 수급(FLOW 축 전체, 무료 공식 공급원 없음) 과 컨센서스(DIANA 목표가 항). 그 다음이 현재가·일봉의 **시차**(장중 → T+1) 다.
- **Q5. 네이버를 완전히 제거하면 사라지는 기능은?** FLOW 카드·수급 품질점수·flow_history 축적 · DIANA 의 목표주가·선행PER 항 · 장중 10분 시세(홈 실시간 브리핑·장중 판단) · 전체시장 시장지도의 당일 갱신(T+1 로 후퇴) · 거래정지/ETF 구분(전체시장 적격 판정) · 52주 밴드는 1년 일봉이 쌓일 때까지 공백.
- **Q6. 추가 비용 없이 가능한 범위는?** 위 조합은 전부 무료 API 다(공공데이터포털·OpenDART·ECOS/수출입은행). 다만 "무료" 와 "광고 사이트에서 써도 된다" 는 다르다 — 형제 데이터셋이 제2·4유형(상업 이용금지)이라 **원천기관 정보이용계약(유료 가능성)** 이 필요할 수 있다. 확인 전까지 무료 범위를 확정하지 않는다.
- **Q7. 법적 허용이 명확한 데이터만 쓰면 판단은 얼마나 달라질 가능성이 있는가?** 오늘 실자료 기준 22.2%(133/600)의 판정이 바뀌고 종합점수는 평균 3.5점·상위 10% 8점·최대 24점 움직인다(`official_free_only`). 축별로는 TARO 5.8점(하루 시차)·DIANA 7.6점(컨센서스 소실)·QUANT 2.1점, FLOW 는 소실. 그리고 **"법적 허용이 명확한 데이터" 가 현재 하나도 확정되지 않았다** — 이 수치는 공공데이터포털 이용이 허용된다는 전제의 근사치다.

## 7. 교체 순서 제안 (조건부 · 소유자 확인 뒤 착수)

| 순서 | 대상 | 전제 | 방법 |
|---|---|---|---|
| 1 | 환율(표시) | ECOS/수출입은행 라이선스 확인 | 어댑터 추가 → data.js `fx` 한 칸만 교체(공식 고시환율 · 일 1회 라벨) |
| 2 | 지수(홈 카드·index_history) | 지수시세정보 유형 확인 | T+1 지수 어댑터 → `indices`·`index_history.js` 교체 · 라벨에 기준일 표기 |
| 3 | 종목 목록·시장구분·시총·전체시장 통계 | 주식시세정보 유형 확인 | 기준일 전 종목 1호출 → `krx_list.json`(개명 권고)·`market_universe/` 재구성 · Guardian 증거 소스 교체 |
| 4 | 일봉·현재가(기준가) | 같은 확인 + "장중 판단 → 전일 종가 판단" 정의 변경 승인 | shadow 실호출(5~20종목·1~3거래일) → 값 대조 → 600종목 백필 → 병렬 운영 → 전환. 채점 결과가격으로 인정할지는 `comparison_evidence` 정책 결정 별도 |
| 5 | PER·PBR·ROE | DART 약관 확인 + EPS 정의(연/4분기) 승인 | dart_financials 로 EPS·BPS 재구성 → shadow 로 정의 차이 측정 → 전환 |
| 6 | 수급·컨센서스 | **공급원 없음** | 축 제거(3축 재정규화)·유료 계약·네이버 승낙 중 소유자 결정. 결정 전 현행 유지(확대 금지) |

## 8. OWNER ACTIONS

1. 공공데이터포털 15094808 상세 페이지의 **이용허락범위** 칸(공공누리 유형)과 비고(한국거래소 정보이용계약 안내 유무)를 열어 확인하고 `config/source_compliance.json` `fsc_public_data.basis` 에 원문·날짜를 기록한다. 제1유형이면 광고 사이트 이용 가능, 제2·4유형이면 원천기관 계약 없이는 불가.
2. 허용이면 활용신청 → serviceKey 발급 → Actions Secret `DATA_GO_KR_SERVICE_KEY` → 게이트(`automatedCollection`)를 사람이 열고 `python3 -m data_supply.fsc_stock_price --live --bas-dt YYYYMMDD` 로 구조 확인 → 5~20종목 값 대조.
3. 지수시세정보(15094807)·KRX상장종목정보(15094775)의 유형도 같이 확인한다.
4. OpenDART terms.do 원문에서 출처표시·재배포·상업 조항 확인(기존 조치 항목 유지).
5. 환율 후보(ECOS 작성기관 · 수출입은행 유형) 확인 — 가장 쉬운 교체 1순위.
6. 수급·컨센서스: 축 제거 / 유료 계약 / 네이버 사전 승낙 중 방향 결정. 결정 전에는 현행 유지·확대 금지.
7. 공개 저장소의 네이버 유래 파일 처리(§NAVER_DEPENDENCY_MAP 4절): 전환 뒤 삭제·비공개 보존·파생 축소 결정. 이력 재작성은 하지 않는다.

## 9. 이번 작업에서 하지 않은 것(Production 변경 금지 준수)

`NAVER_PRODUCTION_DISABLED = 0` · `NEW_PROVIDER_PRODUCTION_ENABLED = 0` · `BUY_HOLD_SELL_FORMULA_CHANGE = 0` · `WEIGHT_CHANGE = 0` · `THRESHOLD_CHANGE = 0` · `PAID_API_ADDED = 0` · `RUNTIME_LLM_ADDED = 0` · `PRIVATE_CHANGED = 0` · `TEAM_PAPER_CHANGED = 0`.
네이버 신규 endpoint·호출량·종목수·UA 변경 0 · 새 scraping 0 · 새 schedule/Routine/자동 PR 0 · 과거 Git history 삭제 0 · 수집 코드 변경 0.

## 10. FINAL CLOSURE — 2026-09-17 (최신 main 위 재검증 · Production 변경 0)

**검증 경로.** PHASE 1 커밋 7d43e4109a 를 `origin/main` 6234c693e0(PR #584 까지 반영)과 **merge 커밋 21a28001dc** 로 합쳤다(rebase 0 · force push 0 — 공유 브랜치의 다른 세션 작업을 잃지 않기 위해 fast-forward push 만 썼다).
합친 트리에서 `python3 gaeo_check.py premerge` **143 PASS / 0 FAIL** · `python3 legal_source_gate.py` **0 findings** · `python3 -m unittest test_data_supply_migration` **28 OK**.
독립 코드 대조(read-only 검증 에이전트 · `analyze_auto.py` `compute_indicators.py` `research_engine.py` `update_flow_history.py` `app.js` `market-map.js` grep)에서 나온 정정 5건은 §10.5 에 적고 이 문서·의존성 지도에 반영했다. 판정·JSON·코드는 바꾸지 않았다.

### 10.1 열 가지 감사 질문 — 답이 있는 자리

| # | 질문 | 답이 있는 자리 | 요약 |
|---|---|---|---|
| 1 | 네이버 실제 데이터 | 지도 §1(endpoint 8개 · ≈80,000 요청/거래일) · §2(필드 A~W) | 시세·일봉·재무·수급·컨센서스·목록·지수·환율 전부 |
| 2 | 분석가 사용 | 지도 §2 '읽는 곳' | TARO·QUANT·RISK ← 일봉 · DIANA ← PER·PBR·ROE·컨센서스 · FLOW ← 수급 · CHIEF ← 현재가(base) |
| 3 | BUY·HOLD·SELL 직접 영향 | 지도 §2 'DIRECT' 표시 + §4 shadow | A·D·I·J·K·L·M·P·T 가 DIRECT |
| 4 | 화면 전용 | 중요도 DISPLAY_ONLY | C·E·Q·V |
| 5 | 미사용 | 지도 §3 · JSON `legacyUnusedFields` | frgnRate·foreignRate·recommMean·cnsPer 등 7항목 |
| 6 | 공식 대체 후보 | §1 '공식 대체 후보' | 공공데이터포털 15094808/15094807/15094775 · OpenDART · ECOS/수출입은행 |
| 7 | 상업적 공개 사용 가능 여부 | §2 LEGAL EVIDENCE | **확정 0건** — 전부 원문 미열람 |
| 8 | 무료 | §1 '무료' 열 | 후보 전부 무료 API. 단 무료 ≠ 광고 사이트 상업 이용 허용 |
| 9 | 품질 | §3 | T+1 확정치 · 조정주가 미확인 · 수급 없음 |
| 10 | 미확인 | §2 '미확인(원문 필요)' 열 | 공공누리 유형 · 재배포 · 출처표시 · 정보이용계약 안내 |

### 10.2 상품별 6열 판정

| 데이터 | CURRENT_SOURCE | REPLACEMENT_SOURCE | LEGAL_STATUS | DATA_QUALITY | COST | MIGRATION_STATUS |
|---|---|---|---|---|---|---|
| A 현재가 · B 등락 | 네이버 itemSummary(10분) | 공공데이터포털 15094808 `clpr` `vs` `fltRt` | PERMISSION_NOT_VERIFIED(상업·재배포 원문 미열람) | T+1 13:00 확정 종가 — 장중가 아님 | 무료(포털 한도 내) | OWNER_APPROVAL_REQUIRED |
| C/D/E/F 시·고·저·거래량 · T 일봉 | 네이버 siseJson(30분) | 15094808 `mkp` `hipr` `lopr` `trqu`(basDt 범위 백필) | 위와 같음 | T+1 · 조정주가 미확인 | 무료 | OWNER_APPROVAL_REQUIRED |
| G 거래대금(전체시장) · H 시총 · R/S 목록·시장구분 | 네이버 marketValue bulk | 15094808 전 종목 1호출 · 15094775 | 15094775 는 2차 자료상 제4유형(상업 금지) | T+1 | 무료 | OWNER_APPROVAL_REQUIRED |
| I/J/K PER·PBR·EPS·BPS·ROE | 네이버 itemSummary·totalInfos | 종가(15094808) ÷ EPS·BPS(OpenDART) | 두 원천 모두 OWNER_CONFIRMATION_REQUIRED | 정의 변경(추정 EPS→공시 EPS · 분기 갱신) | 무료 | OWNER_APPROVAL_REQUIRED |
| L/M/N 외국인·기관·개인 수급 | 네이버 dealTrendInfos | **없음** | — | — | 유료 계약만 존재(추가 안 함) | NO_SAFE_REPLACEMENT_FOUND |
| P 컨센서스 | 네이버 consensusInfo | **없음**(유료 집계만) | — | — | — | NO_SAFE_REPLACEMENT_FOUND |
| Q 배당·52주 | 네이버 totalInfos | 1년 일봉 파생 · DART 배당 공시 | OWNER_CONFIRMATION_REQUIRED | 파생 가능(1년 축적 필요) | 무료 | OWNER_APPROVAL_REQUIRED |
| U 지수 | 네이버 index API | 15094807 | OWNER_CONFIRMATION_REQUIRED | T+1 | 무료 | OWNER_APPROVAL_REQUIRED |
| V 환율 | 네이버 marketindex HTML | ECOS(한국은행 작성분) · 수출입은행 API | ECOS 작성기관·수출입은행 유형 미확인 | 일 1회 고시 | 무료 | OWNER_APPROVAL_REQUIRED · **가장 쉬운 교체 1순위** |
| W 거래정지·상품유형 | 네이버 marketValue | **없음** | — | — | — | NO_SAFE_REPLACEMENT_FOUND |
| O 프로그램·거래원 | (수집하지 않음) | 해당 없음 | — | — | — | READY_TO_REPLACE(형식상 · 교체 대상 없음) |

READY_FOR_SHADOW 는 0 — SHADOW 실호출의 전제인 `fsc_public_data:automatedCollection` 게이트가 닫혀 있고 사람이 열어야 한다. SHADOW 는 Production 변경이 아니다(합성 픽스처·임시 폴더·네트워크 0).

### 10.3 A–H

- **A. 네이버 완전 제거 가능?** 지금은 아니다. 수급(L·M·N)·컨센서스(P)·거래정지(W)는 무료 공식 대체가 없고, 나머지 후보도 광고 사이트 상업 이용 허용이 원문으로 확인된 것이 0건이다.
- **B. 당장 대체 가능(라이선스 확인만 남은 것).** V 환율 → U 지수 → R/S/H 목록·시장구분·시총 → 일봉·현재가(T+1 정의 변경 승인 필요) → PER·PBR·ROE(DART EPS 정의 승인). "당장" 이라도 원문 확인 전에는 착수하지 않는다.
- **C. 아직 필요.** 수급·컨센서스·거래정지 상태 + 장중 10분 시세(홈 실시간 브리핑·장중 판단).
- **D. 품질 영향.** 무료 공식 자료만 쓰면 2026-09-16 실자료 기준 판정 22.2%(133/600) 변화 · FLOW 축 소실 · 기준가가 장중가→전일 확정 종가(§4).
- **E. 무료+공식 허용 범위.** 후보 전부 무료 API. 그러나 허용 범위(공공누리 유형·재배포·상업)가 확인된 것은 0건 → 무료 범위를 확정하지 않는다.
- **F. 광고 유지 시.** 상업 이용 게이트(commercialUse)가 열려야 한다. KRX Open API 는 이미 PROHIBITED, 공공데이터 형제 데이터셋은 제2·4유형 → 광고 유지는 "제1유형 확인 또는 원천기관 계약" 이 조건이다.
- **G. 광고 제거 시.** KRX `commercialUse` 판정만 재검토 대상이 된다. 네이버(자동수집 사전 승낙)·KIND·공공데이터 재배포 조건은 광고와 무관하게 남는다. **광고 제거는 해결책이 아니며 이번 작업에서 광고를 제거하지 않았다.**
- **H. 가장 안전한 조합(조건부).** 가격·일봉·시총·목록·지수 = 공공데이터포털(15094808·15094807) / 재무 = OpenDART / 환율 = ECOS·수출입은행 / 수급·컨센서스 = 축 제거(CHIEF 3축 재정규화) 또는 소유자 결정. 전부 "원문 확인 뒤" 조건이 붙는다.

### 10.4 공개 저장소의 네이버 유래 파일 4분류 (과거 Git history 삭제 0 · 검증 없는 제거 0)

분류 어휘: `CURRENTLY_REQUIRED` / `DERIVED_ONLY_REPLACEMENT_POSSIBLE` / `SAFE_TO_STOP_FUTURE_WRITES` / `OWNER_REVIEW_REQUIRED`. "사이트가 읽나" 는 `index.html`·`app.js`·`market-map.js` 의 script/fetch 를 grep 으로 확인했다.

| 파일 | 사이트가 읽나 | 분류 | 근거 |
|---|---|---|---|
| `data.js` | ○ (`app.js` fetch) | CURRENTLY_REQUIRED | 홈·종목 카드·스냅샷 전부 |
| `price_history.js` | ○ (`index.html` script · 캔들·5일 뒤 종가) | CURRENTLY_REQUIRED · 네이버 유래 과거분 처리는 OWNER_REVIEW_REQUIRED | 채점 근거라 단순 삭제 불가 |
| `index_history.js` | ○ (`index.html` script) | CURRENTLY_REQUIRED | 지수 패널·순환매 |
| `krx_list.json` | ○ (`app.js` 관리자 자동완성) · Guardian | CURRENTLY_REQUIRED | 이름만 KRX, 내용은 네이버 marketValue |
| `market_universe/full_market_latest.json.gz` | ○ (`market-map.js` fetch) | CURRENTLY_REQUIRED | 시장지도 |
| `market_universe/source_verify.json` | ✕ (수집기 `collect_market_universe.py` 가 필드 집합을 읽음) | CURRENTLY_REQUIRED(수집기) | 표본값 없음 · 필드명·비율만 |
| `price_provenance.json` | ✕ (파이프라인 · 봉인 원본) | CURRENTLY_REQUIRED(채점 증거) | 값 해시·관측시각 |
| `analysis_data.json` | ✕ (파이프라인만 · Pages 제외) | DERIVED_ONLY_REPLACEMENT_POSSIBLE · 재구성 시점은 OWNER_REVIEW_REQUIRED | 사이트 미사용 · 네이버 필드명 원문 구조 |
| `flow_history/` | ✕ (검증·연구 · Pages 제외) | OWNER_REVIEW_REQUIRED | 대체 불가 자료 · 비공개 보존 후보 |
| `research_archive/decisions/originals` | ✕ (채점·검증) | CURRENTLY_REQUIRED(불변 원본) | 이력 삭제 없음 |
| `snap/stock/*.html` | ○ (검색엔진·사이트) | CURRENTLY_REQUIRED | 값의 출처만 바뀐다 |

`SAFE_TO_STOP_FUTURE_WRITES` 로 확정한 **파일은 0개** — 후보는 `analysis_data.json` 안의 LEGACY_UNUSED **필드**(frgnRate·foreignRate·recommMean·cnsPer 등)뿐이고, 그 필드를 안 쓰게 바꾸는 것은 수집 코드 변경이라 이번 범위 밖이다.

### 10.5 독립 검증에서 정정한 것 (2026-09-17 · 문서만)

1. 집계 문구: "READY_TO_REPLACE 0" → **1(O · 형식상)** — JSON 집계와 일치시켰다.
2. DIANA 한계값은 대칭이 아니다: PER **+12/−10** · PBR **+8/−6** · ROE **+8/−6** · 선행PER **+6/−5** · 목표가 괴리 +12/−16 → 컨센서스 항 합계 최대 **+18/−21**(`analyze_auto.py diana_eval`).
3. `pos52w`: RISK 감점 식(vol20·mdd3m)에 없음은 맞으나 `research_engine.py`(그림자 연구 지표 20/60 일 창)가 읽는다 → DISPLAY_ONLY 유지하되 연구 소비자를 명기.
4. `lastClosePrice`·`marketValue` 는 미사용이 아니다(`update_flow_history.py:108` 시총·주식수 추정) · `cnsPer` 는 `indicators.json` 에 없다(analysis_data 원문에만).
5. 지도 §0 의 축 가중치는 `team_weights.js` 전역값이며 업종 오버라이드가 있으면 종목별로 다르다(`analyze_auto.py load_team_weights`).

### 10.6 Production 스위치 — 변경 없음

`NAVER_PRODUCTION_DISABLED = 0` · `NEW_PROVIDER_PRODUCTION_ENABLED = 0` · `BUY_HOLD_SELL_FORMULA_CHANGE = 0` · `WEIGHT_CHANGE = 0` · `THRESHOLD_CHANGE = 0` · `PAID_API_ADDED = 0` · `RUNTIME_LLM_ADDED = 0` · `PRIVATE_CHANGED = 0` · `TEAM_PAPER_CHANGED = 0` (`config/data_supply_migration.json` `productionSwitches` · 시험이 전부 0 임을 잠근다).
이번 PR 에서 Production 공급자 전환·네이버 중단·광고 제거·새 schedule/Routine·유료 API·runtime LLM·Private/Gateway·Team PAPER 변경은 하지 않았다.
