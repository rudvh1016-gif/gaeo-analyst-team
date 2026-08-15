# GAEO Feature Registry (PHASE B 설계)

작성일 2026-08-15 · **설계 단계. 아직 어떤 Weight/Threshold도 정하지 않았다.**

STATUS 정의: `CORE`(승격 후보 1군) / `SECONDARY`(보조) /
`EXPERIMENTAL`(검증 중) / `DISABLED`(중복·근거 부족) /
`NEEDS_NEW_DATA`(데이터 없어 구현 불가) / `NOT_SUITABLE`

⚠️ 현재 모든 항목의 IS/OOS 결과는 **미측정**이다.
31거래일(5D 기준 29 판단일) 데이터로 Weight/Threshold를 과최적화하지 않는다.

---

## 0. 데이터 가용성 실측 (2026-08-15)

| 원천 | 내용 | 상태 |
|---|---|---|
| `indicators.json` | MA5/20/60/120/200 + Gap + Slope, 교차이벤트, RSI14, MACD, 볼린저, 거래량비, 52주위치, 변동성, 최대낙폭, 수급 파생, 업종 상대강도 | 있음 |
| `analysis_data.json` | 일별 OHLCV + 외국인비율, 295거래일(2025-06-02~) | 있음 |
| `analysis_data.json` info | PER, EPS, PBR, BPS, 배당, 시가총액, 컨센서스 PER/EPS | 있음(일부 결측) |
| **재무제표 본문** | 매출·영업이익·총자산·영업현금흐름·부채 | **없음** |
| **공시(DART/SEC)** | 공식 이벤트 | **없음 (미구현)** |
| **미국 종목** | | **없음** (500종목 전부 한국 6자리) |

재무 필드 결측률: PER/PBR/ROE/EPS 0% · 배당 29% · 컨센서스EPS 48% · 목표주가 29%

---

## 1. TARO (가격·추세)

### 실측 상관 (495종목 완전관측, 횡단면)

**|r| >= 0.70 중복 의심 쌍**

| 쌍 | r | 해석 |
|---|---|---|
| ma120Gap ~ ma200Gap | +0.895 | 거의 같은 정보 |
| rsi14 ~ bbPctB | +0.854 | 둘 다 "최근 범위 내 위치" |
| ma60Gap ~ rsi14 | +0.777 | |
| ma120Gap ~ pos52w | +0.772 | 장기 이격 ≈ 52주 위치 |
| ma200Gap ~ pos52w | +0.770 | |
| ma5Gap ~ ret5 | +0.774 | |
| ma20Gap ~ bbPctB | +0.722 | |
| ma20Gap ~ rsi14 | +0.704 | |

**⭐ 예상이 빗나간 결과**: `macdHist`는 다른 모든 가격지표와
거의 무상관이다(최대 |r| = 0.28, RSI와는 0.06).
"MACD는 MA를 재가공한 중복 지표"라는 사전 가정은 **데이터로 반박됐다.**
MACD를 중복이라는 이유로 약화시키지 않고 CORE 후보로 유지한다.

**⚠️ `ret5 ~ vsMarket` r = 1.000**: 버그가 아니다.
같은 날 횡단면에서 시장 중앙값은 모든 종목에 같은 상수이므로
빼도 순위가 안 바뀐다. **하루 안에서는 시장조정이 아무 정보를 더하지 않는다.**
여러 날을 합칠 때만 의미가 생긴다. 이 점을 CHIEF 설계에 반영한다.

### Feature 목록

| Feature | 근거 | 상태 | 비고 |
|---|---|---|---|
| `ma5Gap` `ma20Gap` | Brock(1992)+Sullivan(1999) | CORE | Legacy 유지 |
| `ma60Gap` | 〃 | SECONDARY | rsi14와 0.78 |
| `ma120Gap` | 〃 | SECONDARY | ma200Gap와 0.90 → 둘 중 하나만 |
| `ma200Gap` | 〃 | EXPERIMENTAL | pos52w와 0.77 |
| `ma5_20 cross` `ma20_60 cross` | 〃 | CORE | 이벤트+`daysAgo` 이미 저장됨 |
| `ma60_120` `ma120_200 cross` | 〃 | NEEDS_NEW_DATA | 현재 미산출(추가 계산 필요) |
| MA alignment 5단계 | 〃 | EXPERIMENTAL | 파생 가능 |
| `macdHist` `macdSignal cross` | Lo(2000) | **CORE** | 상관 낮아 독립 정보 |
| `rsi14` level/slope | Lo(2000) | CORE | 자동 BUY/SELL 규칙 금지 |
| `bbPctB` | | DISABLED | rsi14와 0.85 중복 |
| 단기 반전(1~5D) | Jegadeesh(2025), Medhat(2022) | CORE | `ret5` 기반 |
| 중기 모멘텀(20~120D) | Jegadeesh & Titman(1993) | **NEEDS_NEW_DATA** | 일봉으로 산출 가능하나 현재 미저장 |
| `pos52w` (52주 고점 근접) | George & Hwang(2004) | CORE | 이미 있음 |
| `volRatio` 거래량 확인 | Lee & Swaminathan(2000) | CORE | 다른 지표와 상관 최저(<0.22) |

**핵심 설계 원칙**: 단기 반전과 중기 모멘텀을 한 점수에서 상쇄시켜
"중립 50"을 만들지 않는다. Horizon별로 분리 관리한다.

---

## 2. DIANA (재무) — **가장 큰 제약**

### 치명적 발견

LOCKED PAPER PACK의 DIANA 핵심 지표가 **거의 전부 구현 불가**다.

| 지표 | 근거 논문 | 필요 데이터 | 상태 |
|---|---|---|---|
| Gross Profitability | Novy-Marx(2013) | 매출, 매출원가 | **NEEDS_NEW_DATA** |
| Operating Profitability | Fama-French(2015) | 영업이익, 자기자본 | **NEEDS_NEW_DATA** |
| Asset Growth / Investment | Hou-Xue-Zhang(2015) | 총자산 시계열 | **NEEDS_NEW_DATA** |
| Cash-based Profitability | Ball et al.(2015) | 영업현금흐름 | **NEEDS_NEW_DATA** |
| Accruals | Sloan(1996) | 현금흐름표 | **NEEDS_NEW_DATA** |
| Leverage / Liquidity | | 부채, 유동자산 | **NEEDS_NEW_DATA** |

### 현재 구현 가능한 것

| Feature | 상태 | 비고 |
|---|---|---|
| `per` (E/P) | CORE | 결측 0% |
| `pbr` (B/M) | CORE | 결측 0% |
| `roe` | SECONDARY | EPS/BPS 파생. Profitability 계열과 중복 예상 |
| `eps` `bps` | SECONDARY | |
| 배당수익률 | EXPERIMENTAL | 결측 29% |
| 컨센서스 대비 괴리 | EXPERIMENTAL | 결측 48%. **Actual만으로 Surprise 만들지 않는다** |

**결론: DIANA Research는 OpenDART 재무제표 연동 없이는 논문 기반 설계가 불가능하다.**
현재의 PER/PBR/ROE 3종은 Value 축에 몰려 있고 Profitability/Investment/Quality 축이 통째로 비어 있다.
이를 "구현했다"고 표현하지 않는다.

### 금융업 별도 처리

은행·보험·증권은 회계구조가 달라 일반 제조업 지표를 강제 적용하지 않는다.
현재 데이터로는 구분 처리 근거가 부족하므로
`FINANCIAL_SECTOR_LIMITATION` 상태를 둔다.

---

## 3. FLOW (수급)

`flowQual ~ flowRatio` r = +0.770 → 내부 중복 존재.

| Feature | 근거 | 상태 | 비고 |
|---|---|---|---|
| 외국인/기관 1D·5D 순매수 | Sias(2004) | CORE | 이미 있음 |
| 20D 순매수 | Lou(2012) | NEEDS_NEW_DATA | 현재 5D까지만 집계 |
| 거래대금 대비 정규화 | Lou(2012) | CORE | `flowRatioPct` 있음 |
| 시가총액 대비 정규화 | 〃 | EXPERIMENTAL | 파생 가능 |
| `foreignBuyDays` 지속성 | Sias(2004) | CORE | 이미 있음 |
| `acceleration` | | SECONDARY | |
| `divergence` (가격-수급 괴리) | Coval & Stafford(2007) | CORE | 이미 있음 |
| `qualityScore` | | SECONDARY | flowRatio와 0.77 중복 |
| Amihud 비유동성 | Amihud(2002) | **EXPERIMENTAL** | 일별 거래대금·수익률로 산출 가능 |
| Bid-Ask Spread | 〃 | **NOT_SUITABLE** | 데이터 없음 |

**한계 명시**: 기관 매매가 정보 기반인지 자금유출입에 따른 강제매매인지
GAEO 데이터만으로 판별할 수 없다. Flow + Price Response + Persistence
조합으로만 접근하고, 원인 규명은 하지 않는다.

---

## 4. ROTATION (업종)

**역할 확정: INDEPENDENT BUY ENGINE이 아니라 INDUSTRY CONTEXT LAYER.**

"반도체 Rotation 90 → 삼성전자 자동 BUY"는 **금지**.
개별 종목의 TARO/DIANA/FLOW + 업종 환경으로만 쓴다.

| Feature | 근거 | 상태 |
|---|---|---|
| 업종 상대수익 5D | Moskowitz & Grinblatt(1999) | CORE (`vsSector` 있음) |
| 업종 상대수익 20/60/120D | 〃 | NEEDS_NEW_DATA |
| 업종 Breadth(상승종목 비율, MA20 상회 비율) | 〃 | EXPERIMENTAL (파생 가능) |
| 업종 거래대금·회전율 | 〃 | EXPERIMENTAL |
| 업종 순위 지속성(1D/5D/20D) | 〃 | 부분 존재(`rotation_snapshot.js`) |
| 대형주 선행 → 중소형주 후행 | Hou(2007) | EXPERIMENTAL |

**Point-in-Time 경고**: 현재 업종분류를 과거에 소급하지 않는다.
과거 업종 구성 이력이 없으므로 Breadth 백테스트에는 한계를 병기한다.

1D/3D 변화는 "현재 변화" 표시용으로만 쓰고
장기 업종 모멘텀과 중복 가산하지 않는다.

---

## 5. EVENT (공식 공시) — 미구현

현재 DART/SEC 연동이 **전혀 없다**(코드·파일 확인 완료).

### 상태값 설계 (반드시 구분)

```
EVENT_DETECTED
NO_OFFICIAL_EVENT_DETECTED     ← 공시가 없다는 뜻일 뿐
EVENT_COVERAGE_INCOMPLETE
EVENT_DATA_ERROR
```

**`NO_OFFICIAL_EVENT_DETECTED` ≠ 뉴스 없음.**
DART/SEC는 일반 언론뉴스를 제공하지 않는다.
큰 가격변동이 있는데 공시가 없어도 "악재 없음"이라고 하지 않고
`OFFICIAL_EVENT_NOT_FOUND` + `GENERAL_NEWS_NOT_COVERED`로 처리한다.

컨센서스 원천이 없으면 `CONSENSUS_DATA_UNAVAILABLE`.
**Actual EPS만으로 "예상보다 +15%" 같은 Surprise를 만들어내지 않는다.**

### Timestamp 규칙 (핵심)

OpenDART `rcept_dt`는 **YYYYMMDD 접수일자**다. 시:분:초가 아니다.
시각을 지어내지 않는다.

- 실시간: GAEO가 처음 발견한 `event_detected_at`을 기록하고 그 이전 판단에 사용 금지
- 과거 장중 백테스트: 정확한 공개시각 입증 불가 시 **다음 거래일부터** 사용

상태: **NEEDS_NEW_DATA** (PHASE C 이후 별도 과제)

---

## 6. 중복 통제 대상 (집중 검사)

| 그룹 | 중복 의심 |
|---|---|
| 가격 계열 | ma120Gap ~ ma200Gap(0.90), rsi14 ~ bbPctB(0.85), ma60Gap ~ rsi14(0.78), 장기MA ~ pos52w(0.77) |
| 가격 계열 (반증) | **macdHist는 중복 아님** (최대 0.28) |
| 재무 계열 | ROE ~ Profitability 계열 (현재는 ROE만 있어 검증 불가) |
| 수급 계열 | flowQual ~ flowRatio(0.77) |
| 교차 계열 | 가격 모멘텀 ~ 업종 모멘텀 ~ 수급 모멘텀 (미측정) |

판단 방법: Correlation → Ablation → Incremental OOS Value.
같은 정보를 다른 이름으로 반복 가산하지 않는다.

---

## 7. 다중검정 기록 의무

시험한 **모든** Candidate를 기록한다.
가장 성적 좋은 하나만 골라 "검증된 최적값"이라 부르지 않는다.
Researcher Degrees of Freedom를 Validation Report에 남긴다.
