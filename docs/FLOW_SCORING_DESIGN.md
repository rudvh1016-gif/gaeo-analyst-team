# FLOW(수급) 점수 산식 재설계 — 학술 근거 기반 설계안

작성 2026-09-04 · 읽기 전용 조사/설계 · **프로덕션 코드 미수정**
작성자 gaeo-quant(퀀트 리서치) · 구현은 gaeo-engineer, 성적 검증은 gaeo-data-analyst

> ⚠️ 이 문서의 **성능 주장은 전부 "가설"이다.** 판단일이 8일뿐이라 어떤 산식이
> 더 잘 맞는지 지금 고를 수 없다(`docs/gaeo_validation_policy.md` §5, Constitution
> `independenceUnit=decision_date`, `minDaysForConclusion=20`).
> 확정적으로 말할 수 있는 건 **분포·구조·코드 결함**뿐이며, 그 부분은 명시적으로
> "실측 확정"이라고 표시했다.

---

## 0. 한 줄 결론

**수급 점수의 분모를 "5만주"라는 고정 상수에서 "같은 5거래일의 거래대금"으로 바꾸고,
점수는 그날 전 종목 안에서의 상대 순위(정규점수)로 매기고, 외국인을 주신호로 삼고
기관은 외국인과 겹치지 않는 부분만 소량 반영하고, 개인은 뺀다.**
그리고 `compute_indicators.flow_summary`의 **날짜 정렬 결함 3개를 먼저 고친다.**

---

## 1. 현재 방식 요약 (코드 실측)

### 1-1. 점수 산식 — `analyze_auto.py:313 flow_eval()`

```python
s = 50.0
s += clamp(±min(16, abs(frgnSum) / 50000), -16, 16)   # 외국인 순매수 "주식수" ÷ 5만
s += clamp(±min(10, abs(orgSum)  / 50000), -10, 10)   # 기관   순매수 "주식수" ÷ 5만
if holdNow is not None and holdBefore is not None:
    s += clamp((holdNow - holdBefore) * 3, -6, 6)      # 외국인 보유율 변화(%p) × 3
score = clamp(s, 5, 95)
available = True          # ← dealTrends만 있으면 무조건 True
```

- CHIEF 기본 가중치 `BASE_W = {taro .30, diana .12, nova .28, flow .30}` — FLOW는 최대 지분이다.
- `stance_of`: bull ≥ 58 / bear ≤ 43. CHIEF `BUY_CUT_BASE = 63`.
- 분석가 채점은 `compute_team_weights.py` `flow: {days:5, deadband:1.0, prior:0.30}` — **5거래일 지평**.

### 1-2. 원자료 — `compute_indicators.py:269 flow_summary()`

네이버 통합 API `dealTrends` 한 행에 다음이 **같이** 들어 있다(전 599종목 · 2,995행 100% 존재 — 실측 확정):

| 필드 | 뜻 |
|---|---|
| `bizdate` | 그 거래일 |
| `foreignerPureBuyQuant` / `organPureBuyQuant` / `individualPureBuyQuant` | 투자자 유형별 순매수 **주식수** |
| `accumulatedTradingVolume` | **그날 전체 거래량(주)** ← 같은 행에 이미 있다 |
| `closePrice` | 그날 종가 |
| `foreignerHoldRatio` | 그날 종료 시점 외국인 보유율(%) |

종목당 행수는 **전부 5행**이다(`days=6` 인자는 사실상 무의미).

---

## 2. 문제 — 어떤 상황에서 판단이 약한가

### 2-1. (실측 확정) 지금 점수는 "수급"이 아니라 "종목 크기"를 재고 있다

| 지표 | 값 | 뜻 |
|---|---:|---|
| `abs(A0점수-50)` vs 기간거래량 스피어만 | **+0.738** | 신호 세기 ≈ 거래량 |
| 오늘(2026-09-04) 프로덕션 599종목 중 45~55점 | **83.1%** | 사실상 무의견 |
| 점수 표준편차 | 5.76 | ±16점 항이 사실상 안 열린다 |

`5만주`는 삼성전자(하루 수백만~수천만 주)와 소형주(하루 수만 주)에 똑같이 적용된다.
그래서 대형주는 항상 만점 포화, 소형주는 항상 0 근처다. **점수가 종목 크기의 프록시**가 됐다.

### 2-2. (실측 확정) 이미 준비된 A1(거래량 정규화)은 반대 방향으로 고장나 있다

"만점 = 기간거래량의 4%"인데 실측 `|외국인비율|` 분포에서 4%는 **p29**다.
→ 외국인 항 **71.2% 포화**, 중립대 10.2%. 점수가 사실상 부호 함수(샀다/팔았다)가 된다.
하루 만에 BUY/HOLD/SELL 라벨이 바뀌는 비율이 A0 8.1% → A1 21.8%.

### 2-3. (실측 확정) 세 주체를 독립 증거처럼 더하는 게 구조적으로 틀렸다

한국 시장의 투자자 유형별 순매수는 **합이 0에 가깝다**(기타법인·국가 제외 잔차).

| 실측 (flow_history 17거래일 · 10,117 행) | 값 |
|---|---:|
| `(외국인+기관+개인) ÷ 거래량` 중앙값 | −0.0001 |
| 같은 값이 ±2% 안에 드는 비중 | **86.1%** |
| 같은 날 단면에서 `개인/거래량` vs `−(외국인+기관)/거래량` 피어슨 | **+0.962** |

**개인 순매수는 (외국인+기관) 순매수의 부호만 뒤집은 것과 거의 같다.** 별개 증거가 아니다.

그리고 5일창 단면 순위상관(13개 창 평균):

| 쌍 | 상관 |
|---|---:|
| 외국인 – 기관 | **−0.394** |
| 외국인 – 개인 | −0.456 |
| 기관 – 개인 | −0.508 |

현재 코드는 외국인 `+16`, 기관 `+10`을 **같은 부호로 더한다.** 둘이 반대로 움직이는데
같은 부호로 더하면 서로 지워진다. 이게 A0 점수가 50 근처에 몰리는 두 번째 이유다.

### 2-4. (실측 확정) `available:True`가 정직하지 않다

`flow_eval`은 dealTrends만 있으면 무조건 `available=True`를 준다.
CHIEF는 그 30% 지분을 정식으로 가중합에 넣는다. 그런데 83%가 45~55점이다.
**"30%의 발언권을 가진 사람이 열 번 중 여덟 번은 '글쎄요'라고 말하는데,
그 '글쎄요'가 정식 표로 집계되고 있다.**

### 2-5. (실측 확정) 같은 함수 안에 날짜 정렬 결함이 3개 있다 → §8

---

## 3. 논문 조사

### 3-0. 조사 제약 (반드시 같이 읽을 것)

이 세션의 egress 프록시가 **논문 PDF 직접 다운로드를 403으로 전부 차단**한다
(`www.anderson.ucla.edu`, `www.cis.upenn.edu`, `arxiv.org` 전부 `CONNECT tunnel failed, 403`
— `curl -sS $HTTPS_PROXY/__agentproxy/status`의 `recentRelayFailures`에 기록됨).
따라서 **원문 전문(full text)을 읽은 논문은 0편이다.**
아래 확인 수준 표기는 정직하게 다음 3단계로만 구분한다.

- `[서지]` — 제목·저자·연도·저널·권/페이지만 확인
- `[초록]` — 검색 결과가 노출한 초록/요약 수준의 핵심 결론까지 확인
- `[2차]` — 다른 문헌·리뷰가 인용한 내용으로만 확인 (원 논문 직접 미확인)

### 3-1. 주문 불균형(order imbalance)의 표준 정규화

**① Chordia, T., Roll, R., Subrahmanyam, A. (2002), "Order imbalance, liquidity, and market returns", *Journal of Financial Economics* 65(1), 111–130.** `[초록]`
- OIB = 매수주도 − 매도주도. **세 가지 변형**을 병행: 거래건수(OIB#/OIBNUM), 주식수(OIB_SH/OIBSH), 거래대금(OIB$/OIBDOL).
- 각 변형은 **자기 짝의 총량으로 나눈다** — 주식수 불균형은 총 주식거래량으로, 거래대금 불균형은 총 거래대금으로.
- 시장 하락 뒤 OIB가 증가(집합적으로 역추세). 어느 방향이든 불균형은 유동성을 떨어뜨린다.
- **비대칭**: 초과 매도의 영향이 초과 매수의 **약 4배**.
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0304405X02001368

**② Chordia, T., Subrahmanyam, A. (2004), "Order imbalance and individual stock returns: Theory and evidence", *JFE* 72(3), 485–518.** `[초록]`
- OIB 정의: **"매수주도 거래건수 − 매도주도 거래건수를 총 거래건수로 나눈 값"**. 즉 **분모는 같은 기간의 총 거래활동**이지 종목 크기가 아니다.
- 대형 투자자의 **주문 분할(order splitting)** 때문에 불균형이 자기상관을 갖고, 그래서 **전일 불균형이 당일 수익률과 양(+)의 관계**를 갖는다.
- 단, **당일 불균형을 통제하면 부호가 뒤집힌다**(가격압박의 되돌림).
- 불균형 기반 매매전략이 통계적으로 유의한 수익을 냈다.
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0304405X03001752

> **우리 산식에 주는 결론**: 분자가 "주식수"면 분모도 **같은 기간의 주식 거래량**,
> 분자가 "금액"이면 분모도 **같은 기간의 거래대금**이어야 한다.
> `50000`이라는 상수는 이 원칙과 무관한 임의값이다.

**③ (일반 원칙, 2차 인용) "흐름(flow)은 흐름으로 나눈다"** `[2차]`
- 검색 결과가 요약한 한 연구의 표현: *"상장주식수가 아니라 거래량 기반 정규화를 쓴다 — 흐름 측정치는 흐름 측정치로 표준화하는 편을 선호하기 때문"*.
- 원 논문 특정 실패. **2차 인용으로만 다룬다.**

### 3-2. 한국 시장 특수 연구 (투자자 유형별 순매매가 공개되는 드문 시장)

**④ Choe, H., Kho, B.-C., Stulz, R. M. (1999), "Do foreign investors destabilize stock markets? The Korean experience in 1997", *JFE* 54(2), 227–264.** `[초록]`
- 위기 전 외국인의 **양(+)의 되먹임 매매(positive feedback)와 무리짓기(herding)** 강한 증거. 위기 중엔 약화·소멸.
- 외국인 대량 매도가 이후 음(−)의 초과수익으로 이어지지 않음 → 시장이 빠르게 효율적으로 조정.
- ⭐ **핵심**: *"외국인 대량 순매수가 있던 날의 유의한 양(+)의 수익률은 (1997년 마지막 3개월 전까지는) **되돌림(reversal)**이 뒤따랐다."*
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0304405X99000379

**⑤ Choe, H., Kho, B.-C., Stulz, R. M. (2005), "Do domestic investors have an edge? The trading experience of foreign investors in Korea", *Review of Financial Studies* 18(3), 795–829.** `[초록]`
- 외국인 운용사는 중·대형 주문에서 **살 때 더 비싸게 사고 팔 때 더 싸게 판다**(매수 평균 21bp, 매도 16bp 불리).
- 국내 **개인**은 개별종목에 대해 **단기 사적정보 우위**가 있다는 증거. 국내 **기관**은 그런 우위 증거 거의 없음.
- 외국인은 큰 양(+)의 초과수익 직전에 팔고, 큰 음(−)의 초과수익 직전에 사는 경향.
- 출처: https://academic.oup.com/rfs/article-abstract/18/3/795/1617731

**⑥ Ko, K., Kim, K., Cho, S. H. (2007), "Characteristics and performance of institutional and foreign investors in Japanese and Korean stock markets", *Journal of the Japanese and International Economies* 21(2), 195–213.** `[서지]`
- 한·일 기관/외국인 지분 특성과 주가성과 비교. **초록 이상 확인 실패 — 결론 인용 안 함.**
- 출처: https://ideas.repec.org/a/eee/jjieco/v21y2007i2p195-213.html

**⑦ (저자·서지 미확정) "The trading behavior and price impact of foreign, institutional, individual investors and government: Evidence from Korean equity market", *Journal of Asian Economics* (2011, S0922142511000405).** `[초록]`
- 외국인·기관이 한국 시장을 **이끌고 그 매매는 정보 기반**으로 보인다. **개인의 매매는 정보 기반이 아니다.**
- 외국인 = 단기 모멘텀·성장주 / 국내기관 = 모멘텀이되 가치주 / 개인 = **역추세(과거 패자 매수, 승자 매도)**.
- 표본기간 외국인·기관 성과 양호, 개인 부진.
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0922142511000405

**⑧ Kim, Kang, Roh (2025), "Market participants' trading behavior toward anomalies: Evidence from the Korean market", *Pacific-Basin Finance Journal* 90, 102622.** `[초록]`
- 한국 시장 유의 이상현상 26개로 mispricing 지표 구성.
- ⭐ **개인은 이상현상을 만들어내는 비정보(uninformed) 거래자**, **외국인은 숙련된 차익거래자**,
  **국내 기관의 매매활동은 수익률 예측력이 없다(lacks return predictive power).**
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0927538X24003743

**⑨ Jeong, Eo, Kang (2026), "Net arbitrage trading by foreign investors and short sellers and stock returns: Evidence from the Korean stock market", *Pacific-Basin Finance Journal* 98.** `[초록]`
- NAT(외국인 이상보유 − 이상공매도)가 **횡단면 미래수익을 유의하게 양(+)으로 예측**.
- 다시 확인: **외국인 = 숙련 차익거래자, 기관 = 예측력 없음.**
- 위기 국면엔 차익거래자가 자본을 빼서 오히려 미스프라이싱이 커진다.
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S0927538X26000855

**⑩ Kedar-Levy, H., Kim, J., Yoo, S. (2025), "Predictable liquidity properties in a segmented, inelastic stock market", *Journal of Financial Markets* (S104244312500071X).** `[초록]`
- 한국거래소 **9개 투자자 유형** 전 거래 일별자료.
- **가장 지속적인 추세추종자 = 외국인(대부분 외국 기관), 다음이 국내 기관. 가장 지속적인 역추세자 = 개인이며 평균적으로 유동성 공급자 역할.**
- 추세추종(역추세) 매매가 다음 달 IVOL·유동성 위험·유동성 공통성을 올린다(내린다).
- 출처: https://www.sciencedirect.com/science/article/pii/S104244312500071X

**⑪ ⭐ Kang, S. (2026), "Optimal Signal Extraction from Order Flow: A Matched Filter Perspective on Normalization and Market Microstructure", arXiv:2512.18648.** `[초록]` **(동료심사 미확인 프리프린트 · 버전 간 서술 불일치 있음)**
- **우리 질문에 가장 직접적인 논문.** 한국시장 2020–2024, 210만~270만 stock-day 관측(버전별 표기 다름).
- 원리: **"최적 정규화는 신호를 만드는 주체의 스케일링 방식과 일치해야 한다(matched filter)."**
  - 자본제약이 있는 **기관형 투자자** → 기업가치(**시가총액**) 기준 스케일링 → `S^MC`가 정합
  - **거래량 추종 알고(VWAP/TWAP)** → **거래대금** 기준 → `S^TV`가 정합
- 한국 실증: **국내 기관 흐름은 `S^MC`에서 익일 수익 예측 유의(t=9.65), 외국인 흐름은 `S^TV`에서 더 강함(t=16.35)**, 외국인은 **장기 지평에서도 부호 반전 없음** → 일시적 가격압박이 아니라 지속적 사적정보로 해석.
- ⚠️ **버전 불일치**: v1 초록은 "시가총액 정규화가 거래대금 정규화보다 1.32–1.92배 높은 상관"이라고 **전체 우위**를 주장하는 반면, v3 초록은 위처럼 **투자자 유형별로 갈린다**고 쓴다. 원문 접근 불가로 어느 쪽이 최종인지 확인 못 했다. **따라서 "시총 정규화가 낫다"고 단정하지 않는다.**
- 출처: https://arxiv.org/abs/2512.18648

**⑫ (비심사) "Who Provides Liquidity in Retail-Dominated Markets? Evidence from Korea", mlquants(2026).** `[초록]` **블로그/비심사 — 근거로 쓰지 않고 참고만**
- 2015–2025 KOSPI·KOSDAQ 평균 2,200종목 주간 투자자별 자료로 NIT의 미래수익 함의를 매핑.
- **한국의 개인은 거래량 다수를 차지하지만 미국 개인 흐름 같은 역추세·단기 예측력을 보이지 않는다**고 주장.
- 출처: https://mlquants.substack.com/p/who-provides-liquidity-in-retail

### 3-3. 정보거래 확률 계열 — **우리 데이터로는 불가능**

**⑬ Easley, D., Kiefer, N. M., O'Hara, M., Paperman, J. B. (1996), "Liquidity, information, and infrequently traded stocks", *Journal of Finance* 51(4), 1405–1436.** `[초록]`
- PIN: **매수주도/매도주도 거래 "건수"**를 관측해 구조모형(정보사건 발생확률 α, 악재확률 δ, 정보·비정보 도착률 μ·ε)을 **최대우도로 추정**.
- 핵심 실증: **거래량이 많은 종목일수록 정보기반 거래 확률이 낮다.**
- 출처: https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1996.tb04074.x

**⑭ Easley, D., López de Prado, M., O'Hara, M. (2012), "Flow toxicity and liquidity in a high-frequency world", *RFS* 25(5), 1457–1493.** `[초록]`
- VPIN: **거래량 시간(volume time)**으로 갱신, 비관측 모수 추정·수치해법 불필요. 2010 플래시크래시 1시간 전 사상 최고치.
- 출처: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1695596

> **판정: PIN·VPIN은 우리 데이터로 근사 불가.**
> ① PIN은 **일별 매수건수·매도건수**가 있어야 하는데 우리는 **투자자 유형별 순매수 "주식수" 하나뿐**이다(총매수·총매도 분해 불가).
> ② VPIN은 **틱/체결 단위 volume bucket**이 필요한데 우리는 일별 1행뿐이다.
> ③ 억지로 "|순매수|/거래량"을 PIN 대용이라 부르는 건 다른 물건에 같은 이름을 붙이는 것이다. **하지 말 것.**
> 다만 ⑬의 실증(거래량 많을수록 정보거래 확률↓)은 §4-4 유동성 보정의 **방향**에 근거를 준다.

### 3-4. 횡단면 점수화 — 고정 문턱 vs 순위/z-score

**⑮ Green, J., Hand, J. R. M., Zhang, X. F. (2017), "The characteristics that provide independent information about average U.S. monthly stock returns", *RFS* 30(12), 4389–4436.** `[초록]`
- 94개 특성을 Fama-MacBeth 회귀에 동시 투입. **모든 특성을 1%·99% 백분위에서 winsorize하고, 평균 0·표준편차 1로 표준화**.
- 마이크로캡 과대가중 회피와 data-snooping 보정 후 살아남은 특성은 **12개뿐**.
- 출처: https://academic.oup.com/rfs/article-abstract/30/12/4389/3091648

**⑯ Kaniel, R., Saar, G., Titman, S. (2008), "Individual investor trading and stock returns", *Journal of Finance* 63(1), 273–310.** `[초록]` ⭐ **점수화 방법론의 원형**
- NIT(net individual trading)를 **① 그 종목 자신의 직전 9주 NIT와 비교해 "강도(intensity)"를 재고**, **② 매주 횡단면 정렬로 십분위 포트폴리오를 만든다**(1분위=집중 매도, 10분위=집중 매수).
- NIT의 **시계열 표준편차가 평균의 소형주 7배·대형주 2배** — 즉 종목마다 스케일이 완전히 다르다. 그래서 고정 절대 문턱이 통하지 않는다.
- 개인이 사면 다음 달 초과수익 (+), 팔면 (−). 해석: **위험회피적 개인이 기관의 즉시성 수요에 유동성을 공급하고 그 대가를 받는다.**
- 출처: https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.2008.01316.x

**⑰ Boehmer, E., Jones, C. M., Zhang, X., Zhang, X. (2021), "Tracking retail investor activity", *Journal of Finance* 76(5), 2249–2305.** `[초록]`
- 개인 주문불균형 기준 상위군이 하위군보다 **다음 주 약 10bp(연 5%) 초과**, **최대 12주까지** 예측력.
- 후속 연구(Financial Markets and Portfolio Management, 2025)는 **2016–2021 대형주에선 예측력이 사라졌다**고 보고 — **신호는 시대에 따라 죽는다.**
- 출처: https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.13033 · https://link.springer.com/article/10.1007/s11408-025-00487-4

**⑱ Barber, B. M., Odean, T., Zhu, N. (2009), "Do retail trades move markets?", *RFS* 22(1), 151–186.** `[초록]` ⭐ **부호가 지평에 따라 뒤집힌다는 직접 증거**
- **연 단위**로 재면 개인이 많이 산 종목이 많이 판 종목보다 **다음 해 4.4%p 열등**.
- **주 단위**로 재면 **부호가 반대** — 개인이 많이 산 종목이 다음 주 강한 수익.
- 거래건수 기준 불균형과 거래대금 기준 불균형의 상관은 **75.1%** — 정규화 방식 선택이 결과를 바꾼다.
- 출처: https://academic.oup.com/rfs/article-abstract/22/1/151/1585397

**⑲ Asness, C., Moskowitz, T., Pedersen, L. (2013), "Value and momentum everywhere", *Journal of Finance* 68(3), 929–985.** `[서지]`
- 자산군 간 **동일한 단순·표준 방식**을 강제해 data snooping을 줄인다는 방법론 원칙만 인용. **표준화 세부는 원문 미확인 → 인용 안 함.**
- 출처: https://onlinelibrary.wiley.com/doi/10.1111/jofi.12021

### 3-5. 지속성·감쇠 — 5거래일 창이 맞는가

**⑳ Griffin, J. M., Harris, J. H., Topaloglu, S. (2003), "The dynamics of institutional and individual trading", *Journal of Finance* 58(6), 2285–2320.** `[초록]`
- 나스닥100. 직전일 수익률 상위 십분위 종목을 다음 날 기관이 순매수(개인이 순매도)하는 비율 **65.2%** vs 하위 십분위 41.3% → **기관 매수는 수익률을 "따라간다".**
- ⭐ **일별로는 기관 매매활동이 미래 가격을 예측한다는 증거가 없다.** 일중 증거도 모멘텀 효과 대비 극히 작고 짧다.
- 출처: https://onlinelibrary.wiley.com/doi/abs/10.1046/j.1540-6261.2003.00606.x

**㉑ 주문흐름 지속성 (Chordia·Subrahmanyam 2004 ②, 및 order-flow persistence 문헌)** `[2차]`
- 일별 불균형은 **양(+)의 자기상관·높은 지속성**. 원인은 **주문분할** 또는 **무리짓기**.
- 개별 시차 계수는 작지만 **전부 양수라서 긴 지평에서 상당한 예측 가능성**이 누적된다.
- 지속성이 있는데도 일별 수익률 자기상관은 0에 가깝다 → 일중에 빠르게 효율성으로 복귀.
- 한국 관련 서술(2차): **소형 외국기관은 주문분할, 소형 외국인은 무리짓기+주문분할, 국내 기관은 무리짓기.**

> **결론(가설)**: 5거래일 창은 문헌의 주(week) 단위 관행(⑯⑰⑱)과 일치한다. **창 길이 자체는 바꾸지 않는다.**
> 다만 ④(되돌림)와 ⑪(부호 반전 없음)이 **정면으로 충돌**하므로, **부호 자체를 9/23 검증에서 반드시 확인**해야 한다.

### 3-6. 유동성 보정

**㉒ Amihud, Y. (2002), "Illiquidity and stock returns: cross-section and time-series effects", *Journal of Financial Markets* 5(1), 31–56.** `[초록]`
- ILLIQ = **|일별 수익률| ÷ 일별 거래대금**의 기간 평균. 일별 자료만으로 장기간 계산 가능.
- 횡단면 (+)수익-비유동성 관계 + 시계열 기대 비유동성 → 기대 초과수익. **소형주에 훨씬 강하게 작용.**
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S1386418101000246

**㉓ Datar, V. T., Naik, N. Y., Radcliffe, R. (1998), "Liquidity and stock returns: an alternative test", *Journal of Financial Markets* 1(2), 203–219.** `[초록]`
- **회전율(거래주식수 ÷ 상장주식수)**을 유동성 대용치로 사용. 규모·B/M·베타 통제 후에도 유의.
- 출처: https://www.sciencedirect.com/science/article/abs/pii/S1386418197000049

---

## 4. 우리 데이터로 실현 가능한 최선안 (설계)

### 4-0. 우리가 실제로 가진 것 / 없는 것

| 있다 | 없다 |
|---|---|
| 일별 투자자유형 3종 **순매수 주식수** | 유형별 **총매수·총매도 분해**(→ PIN 불가) |
| 같은 행의 **그날 총거래량(주)** ← 100% 존재 | 틱/체결 단위(→ VPIN 불가) |
| 같은 행의 **종가** → 거래대금·순매수금액 계산 가능 | 유형별 거래대금 직접값(종가 근사로 대체) |
| 외국인 보유율(%) | 기관·개인 보유율 |
| 시가총액(억원) → 상장주식수 역산 → 회전율 | 5일 이상 과거 dealTrends(→ flow_history로만 축적, 2026-08-11~) |

### 4-1. 단계 0 — 같은 행에서 분자·분모를 뽑는다 (결함 수정)

```
rows = dealTrends[:K]                     # K=5, bizdate 내림차순
usable = [r for r in rows if vol(r) > 0 and close(r) > 0
                          and 순매수 3종이 모두 파싱됨]
coverage = len(usable) / K
if coverage < 1.0 and len(usable) < 4:    # 5일 중 4일 미만이면 측정 포기
    return NOT_AVAILABLE("수급 원자료 결측")

# ⚠️ 분자와 분모는 반드시 usable "같은 행 집합"에서만 합산한다.
netF_val = Σ_{r∈usable} foreignerPureBuyQuant(r) × closePrice(r)   # 원
netI_val = Σ_{r∈usable} organPureBuyQuant(r)     × closePrice(r)
tradedValue = Σ_{r∈usable} accumulatedTradingVolume(r) × closePrice(r)
tradedShares = Σ_{r∈usable} accumulatedTradingVolume(r)
windowStart = bizdate(usable[-1]); windowEnd = bizdate(usable[0])
```

**근거**: ①② — 분자·분모는 같은 정의·같은 기간이어야 한다. 같은 행에서 뽑으면 날짜 불일치가 **구조적으로 불가능**해진다(일봉 매칭 자체를 제거).

### 4-2. 단계 1 — 정규화 (분모를 무엇으로 하는가)

```
S_TV_f = netF_val / tradedValue          # 외국인 순매수금액 ÷ 기간 거래대금  ∈ [-1, +1]
S_TV_i = netI_val / tradedValue
# 그림자(shadow)로만 함께 계산해 기록 — 채택 여부는 9/23 이후 결정
S_MC_f = netF_val / marketCap
S_MC_i = netI_val / marketCap
turnover5 = tradedShares / sharesOutstanding
```

**주 채택 = `S_TV`(거래대금 정규화). 근거:**
- ①② 표준: 주식수 불균형↔주식거래량, 금액 불균형↔거래대금. ③ "흐름은 흐름으로 나눈다".
- ⑪ v3 실증: **외국인 흐름은 `S^TV`에서 예측력이 가장 강함(t=16.35)**. 우리 FLOW는 외국인이 주신호(§4-5)이므로 정합.
- **우리 실측(확정)**: 신호 세기의 크기 중립성이 `S^TV`가 압도적으로 낫다.

| 실측 (5일창 13개 평균, flow_history) | 값 |
|---|---:|
| `|S_TV_f|` vs 기간 거래대금 순위상관 | **−0.163** |
| `|S_MC_f|` vs 기간 거래대금 순위상관 | **+0.385** |
| `S_TV_f` 순위 vs `S_MC_f` 순위 상관 | 0.888 |
| (참고) 현행 A0 `|점수−50|` vs 거래량 | **+0.738** |

즉 시총 정규화는 **"많이 거래되는 종목일수록 신호가 세다"는 편향을 다시 불러온다.**
다만 ⑪ v1 초록이 시총 정규화 우위를 주장하므로 **양쪽을 다 계산해 기록**하고 성적으로 고른다.

**⚠️ 하지 않는 것**: `abs(순매수) / 50000` 같은 **고정 상수 분모**. 어떤 문헌에도 근거가 없다.

### 4-3. 단계 2 — 이상치 처리 (winsorize)

```
그날 유니버스 전체의 S_TV_f 를 모아
lo = 1퍼센타일, hi = 99퍼센타일
S_w = min(hi, max(lo, S_TV_f))
```
**근거**: ⑮ Green-Hand-Zhang(2017)의 표준 처리(1%/99% winsorize 후 표준화).
**클리핑이 아니라 winsorize인 이유**: 값을 버리지 않고 극단만 눕힌다.

**하드 가드**: `|S_TV| > 1.0`이 나오면 **클리핑하지 말고 `NOT_AVAILABLE`로 떨어뜨린다.**
수학적으로 순매수는 거래량을 넘을 수 없으므로(실측 4,748건 중 위반 0건, 최대 57.5%),
1.0을 넘었다면 그건 강한 신호가 아니라 **분모가 깨진 것**이다.

### 4-4. 단계 3 — 횡단면 표준화 (그날 전 종목 안에서의 위치)

```
rank = 그날 유니버스 안에서 S_w 의 순위 (1..N, 동점은 평균순위)
p = (rank - 0.5) / N
z = clip(Φ⁻¹(p), -2.0, +2.0)      # 정규점수(van der Waerden) 변환
```

**고정 절대 문턱 대신 그날 횡단면 순위를 쓰는 근거:**
1. ⑯ KST(2008): NIT의 **시계열 표준편차가 평균의 2~7배**이고 종목마다 스케일이 다르다 → 고정 문턱은 정의상 실패. 그래서 원 논문도 **매주 횡단면 십분위 정렬**을 쓴다.
2. ⑮: 횡단면 표준화가 다특성 결합의 표준 절차.
3. **우리 실측(확정)**: 현재 A1의 "만점 4%"가 실측 p29라 71.2%가 포화됐다. **분포가 움직이면 고정 스케일은 반드시 다시 깨진다.** 순위는 자동 재조정된다.
4. **저장소 정합성**: `docs/gaeo_validation_policy.md` §8에 따라 2026-08-31부터 분석가 채점 기준이 **시장 대비 초과수익(횡단면 중앙값 차감)**이다. **채점이 횡단면 상대인데 신호만 절대 스케일인 건 어긋난다.** 신호도 횡단면 상대로 맞추는 게 목적함수와 일치한다.

**±2.0 클립 근거**: 정규점수는 꼬리에서 무한대로 발산한다. N≈600이면 p=1/600에서 Φ⁻¹≈−2.88.
±2.0은 상·하위 약 2.3%만 눕히는 값이고, ⑮의 1%/99% winsorize와 같은 정신이다.

### 4-5. 단계 4 — 세 주체 결합 (여기가 가장 큰 변화다)

```
z_f = 외국인의 횡단면 정규점수
z_i = 기관의 횡단면 정규점수

# 기관은 "외국인과 겹치지 않는 부분"만 쓴다 (직교화)
β    = 그날 단면에서 z_i 를 z_f 에 회귀한 기울기      # 실측 상관 -0.394 → β ≈ -0.39
z_i⊥ = (z_i - β·z_f) / sd(z_i - β·z_f)               # 다시 단위분산으로

composite = w_f · z_f + w_i · z_i⊥
기본값: w_f = 1.00, w_i = 0.25   (가설 — 9/23 이후 검증 전까지 잠정)
개인(indi)은 쓰지 않는다.
```

**개인을 빼는 근거 (실측 확정 + 문헌):**
- 실측: `개인/거래량` vs `−(외국인+기관)/거래량` 피어슨 **+0.962**, 세 주체 합이 거래량의 ±2% 안 **86.1%**. → **개인 항은 새 정보가 아니라 앞 두 항의 부호 반전 복사본**이다. 넣으면 같은 증거를 두 번 세는 것(double counting)이다.
- 문헌은 **부호조차 합의되지 않았다**: ⑯ KST(2008)·⑰ Boehmer 외(2021)는 미국에서 개인 순매수가 **단기에 (+) 예측**, ⑱ Barber 외(2009)는 **주 단위 (+) / 연 단위 (−)로 부호가 뒤집힌다**, ⑦⑧은 한국 개인이 **비정보 거래자**, ⑩은 한국 개인이 **유동성 공급자**(→KST식 (+) 해석과 정합), ⑫(비심사)는 **한국 개인은 미국식 단기 예측력이 없다**고 한다.
- → **부호를 하드코딩할 근거가 없다. 그러므로 넣지 않는다.**

**기관을 직교화해서 소량만 쓰는 근거:**
- 실측: 외국인–기관 단면 순위상관 **−0.394**. 지금 코드는 이 둘을 **같은 부호(+16, +10)로 더한다.** 반대로 움직이는 둘을 같은 부호로 더하면 서로 상쇄된다 — A0가 50 근처에 몰리는 **두 번째 원인**이다.
- 문헌: ⑧ Kim-Kang-Roh(2025)·⑨ Jeong-Eo-Kang(2026) 모두 **한국에서 국내 기관 매매는 수익률 예측력이 없다**. ⑤ Choe 외(2005)도 국내 기관의 정보우위 증거 거의 없음. ⑳ Griffin 외(2003)는 **기관 매수는 수익률을 따라갈 뿐 예측하지 않는다**.
- 그럼에도 0으로 안 두는 이유: ⑪ v3가 **기관 흐름은 `S^MC`에서 유의(t=9.65)**라고 보고했다. 즉 정규화를 바꾸면 살아날 수 있다. **직교 성분만 소량(0.25) 남겨 관찰**한다.
- ⚠️ `w_i = 0.25`와 `β` 방식은 **가설이다.** 9/23 이후 (A) 외국인 단독, (B) 직교 기관 0.25, (C) 직교 기관 0.5 를 비교해 정한다.

### 4-6. 단계 5 — 유동성 신뢰가중 (측정정밀도 shrinkage)

```
V_min = 10억원, V_ref = 300억원   (5일 누적 거래대금 기준)
if tradedValue < V_min:  return NOT_AVAILABLE("거래가 너무 적어 수급을 읽을 수 없음")
λ = min(1, log(tradedValue / V_min) / log(V_ref / V_min))       # 0..1
```

**근거:**
- ㉒ Amihud(2002): 비유동성 효과는 소형주에 훨씬 강하다 → 소형·저유동 종목에서 같은 비율값의 의미가 다르다.
- ㉓ Datar 외(1998): 회전율이 유동성 대용치. **우리 실측(확정)**: 5일 회전율의 **89.5%가 종목간(between) 분산** — 회전율은 종목의 안정적 속성이라 사전 게이트로 쓰기 적합하다.
- ⑬ Easley 외(1996): 거래량이 적을수록 정보거래 확률이 높다 → 저유동 종목의 신호를 **버리는 게 아니라 줄이는** 근거(0으로 만들면 정보를 버린다).
- **우리 실측(확정)**: 거래량 최하위 10분위 `|외국인비율|` 중앙 8.6%·p99 36.7% vs 최상위 10분위 6.5%·23.0% — 저유동에서 **폭발이 아니라 산포 확대**다. 그래서 클리핑이 아니라 **shrinkage**가 맞다.
- `V_min = 10억원`은 5일 거래대금 실측 **p1=4.8억 · p5=13.0억 · p10=22.4억** 기준으로 **하위 약 4%만 탈락**하는 값이다(실측: NOT_AVAILABLE 3.9%).

### 4-7. 단계 6 — 시장 전체 기울기 (횡단면 표준화가 버리는 정보 되살리기)

횡단면 표준화는 **매일 평균을 강제로 0으로 만든다.** 그러면 "외국인이 시장 전체를 팔고 있다"는
정보가 통째로 사라진다. 실측상 그 정보는 작지 않다:

| 5일창 유니버스 전체 `외국인 순매수금액 ÷ 총거래대금` (실측 확정) | |
|---|---:|
| 2026-08-18 | **+5.06%** |
| 2026-08-25 | **−6.12%** |
| 범위 폭 | 11.18%p |

```
M = 유니버스 전체 Σ netF_val / Σ tradedValue           # 그날의 시장 수급
tilt = clip(M / 0.05, -1, +1) × 4                      # 최대 ±4점, 전 종목 공통
```
- **±4점으로 작게 제한하는 이유**: 시장 방향 판단은 TARO(기술)·QUANT(확률)가 이미 담당한다. FLOW가 시장 베타를 크게 실으면 `docs/gaeo_validation_policy.md` §8이 지적한 **"시장이 어디로 갔는지를 재는 문제"**가 재발한다.
- ⚠️ 이 항은 **선택 사항이며 가설**이다. Phase 1에서 끄고(=0) 시작해도 된다.

### 4-8. 단계 7 — 최종 점수 매핑

```
score_raw = 50 + 11 × λ × clip(composite, -2, +2) + tilt
score     = clamp(round(score_raw), 5, 95)
```

**기울기 11의 근거 (성적이 아니라 분포로 정함 — threshold tuning 회피):**
- z가 ±2에서 잘리므로 λ=1일 때 점수 범위는 28~72. FLOW의 `stance_of`(bull ≥58 / bear ≤43)를
  **실제로 도달 가능하되 쉽게 포화되지 않는** 폭이다.
- **실측 시뮬레이션(flow_history 5일창 13개 · 7,481표본, `tilt=0`)**:

| | 현행 A0 | 현행 A1(만점 4%) | **권고안** |
|---|---:|---:|---:|
| 표준편차 | 5.0 | 14.2 | **8.5** |
| 중립대(45~55) | 85.6% | 10.2% | **51.3%** |
| 외국인항 포화율 | (대형주 상시 포화) | 71.2% | **0%**(정의상 없음) |
| `|점수−50|` vs 거래대금 상관 | **+0.738** | −0.018 | **+0.278** |
| NOT_AVAILABLE | 0% | 0% | **3.9%** |

- `+0.278`이 0이 아닌 이유는 **λ(유동성 신뢰가중)를 의도적으로 넣었기 때문**이다. λ를 빼면 순위가 균등분포라 정의상 0에 가까워진다. **크기 중립성 일부를 측정 신뢰도와 맞바꾼 것**이고, 이건 설계 의도다(㉒⑬).

### 4-9. 단계 8 — "무의견"을 정직하게 표현하기

현행의 부정직함은 **"50점이 많다"가 아니라 "50점의 뜻이 없다"**는 데 있다.
A0에서 50점은 "재보니 중간"이 아니라 **"자를 잘못 대서 아무 눈금도 안 읽힌다"**였다.
권고안에서는 세 상태를 **분리해서** 내보낸다.

| 상태 | 조건 | `available` | 뜻 |
|---|---|---|---|
| `NOT_AVAILABLE` | 원자료 결측 · `coverage<4/5` · `tradedValue < V_min` · `|S_TV|>1` | **False** | **못 쟀다.** CHIEF가 가중치 재정규화 |
| `MEASURED_NEUTRAL` | 쟀는데 순위가 가운데 (`|z| < 0.35` 등) | True | **재봤더니 중간이다.** 이건 진짜 정보다 |
| `MEASURED_DIRECTIONAL` | 그 외 | True | 방향 의견 있음 |

추가로 **정밀도 자체를 밖으로 내보낸다**(Phase 2 후보):
```
flow["precision"] = λ            # 0..1
flow["opinionStrength"] = |z|    # 0..2
```
CHIEF가 `w_flow × λ`로 **연속 가중**하면 켜고 끄는 이분법보다 정보 손실이 적다.
**근거**: Grinold의 기본법칙 `IR = IC × √Breadth` 계열의 원칙 — 신호의 기여도는
정밀도에 비례해야 한다. ⚠️ **chief_eval을 바꾸는 변경이라 Phase 2로 분리**한다.

### 4-10. 단계 9 — 종목 자신의 과거 대비 "강도" (Phase 3, 지금은 불가능)

⑯ KST(2008)의 핵심은 **횡단면 순위 하나가 아니라, 그 종목 자신의 직전 9주와 비교한 "강도"**다.
왜 필요한가 — **우리 실측(확정)**:

| 5일창 지표의 분산분해 (비중첩 3개 창 · 593종목) | 종목간(between) | 종목내(within) |
|---|---:|---:|
| 외국인 5일비율 | **51.5%** | 48.5% |
| (외국인+기관) 5일비율 | 55.0% | 45.0% |
| 5일 회전율 | 89.5% | 10.5% |

비중첩 창끼리(5일 뒤) 단면 순위상관 **0.300**.
→ **외국인 수급 순위의 절반쯤은 "그 종목의 고정된 성질"이다.** 횡단면 순위만 쓰면
**같은 종목이 매일 같은 방향으로 찍힌다.** KST식 자기기준 표준화는 이 고정효과를 걷어낸다.

```
z_ts = (S_TV_f,t − mean(직전 L개 창의 S_TV_f)) / sd(직전 L개 창)
final = (1−θ)·z_cs + θ·z_ts,   θ는 L에 따라 0→0.5로 증가
```

**⚠️ 지금은 못 한다.** `flow_history`는 2026-08-11 시작, 2026-09-03까지 **17거래일**뿐이다.
KST 기준(직전 9개 비중첩 주 = 45거래일 + 당기 5일 ≈ **50거래일**)을 채우려면
휴장일(추석 9/24·25, 개천절 10/3, 한글날 10/9) 감안 **2026년 10월 하순**이 돼야 한다.
그 전에 억지로 L=3~4로 표준화하면 **표본이 작아 sd 추정이 폭주**한다. **Phase 3으로 미룬다.**

### 4-11. T+1 지연을 산출물에 명시

FLOW 창은 항상 **T−1에 끝난다**(오늘 2026-09-04, dealTrends 최신 bizdate 20260903 — 실측 확정).
TARO·QUANT는 T 종가를 쓰는데 FLOW만 T−1이다. 이 비대칭을 **데이터로 드러낸다.**
```
flow["asOf"] = "2026-09-03"; flow["lagTradingDays"] = 1
flow["windowStart"] / flow["windowEnd"] / flow["windowDays"]
flow["normalization"] = "trading_value_5d"
flow["scoringMethod"]  = "cross_sectional_normal_score_v1"
```
백테스트 PIT 규칙도 동일: **판단일 D의 FLOW는 D−1에 끝나는 5거래일 창**만 쓴다.

---

## 5. 설계 선택 ↔ 근거 매핑

| # | 설계 선택 | 근거 (문헌) | 근거 (우리 실측) | 지위 |
|---|---|---|---|---|
| 1 | 분모 = 같은 기간 **거래대금** | ①②③⑪ | `|S_TV|`–거래대금 상관 −0.163 vs `|S_MC|` +0.385 | **확정 권고** |
| 2 | 고정상수 5만주 폐기 | ①②⑯ | A0 신호세기–거래량 +0.738 | **확정 권고** |
| 3 | 분자·분모 **같은 행**에서 | ①② | dealTrends 전 행에 거래량 100% 존재 | **확정 권고(결함수정)** |
| 4 | 1%/99% winsorize | ⑮ | — | **확정 권고** |
| 5 | `|비율|>1` → NOT_AVAILABLE | — | 수학적 상한 1.0, 실측 위반 0건 | **확정 권고** |
| 6 | 횡단면 순위→정규점수 | ⑮⑯ | A1 만점4% = 실측 p29 → 71.2% 포화 | **확정 권고** |
| 7 | ±2.0 클립 | ⑮ | N≈600에서 꼬리 Φ⁻¹≈−2.88 | **확정 권고** |
| 8 | 개인 항 제외 | ⑯⑰⑱⑦⑧⑩⑫ 부호 불일치 | 개인 vs −(외+기) 상관 +0.962 | **확정 권고** |
| 9 | 외국인 주신호 | ⑧⑨⑩⑪ | — | **강한 가설** |
| 10 | 기관 직교화 후 소량 | ⑧⑨⑤⑳(무예측력) + ⑪(S^MC서 유의) | 외국인–기관 상관 −0.394 | **가설(w_i 검증 필요)** |
| 11 | 유동성 shrinkage λ | ㉒㉓⑬ | 5일회전율 between 89.5%, 저유동 산포 2배 | **확정 권고(모수는 가설)** |
| 12 | 5거래일 창 유지 | ⑯⑰⑱ 주 단위 관행 | — | **확정 권고** |
| 13 | 시장 기울기 ±4점 | — (저장소 §8 정합성) | 유니버스 비율 −6.12%~+5.06% | **가설(Phase 1은 OFF)** |
| 14 | 자기기준 강도(KST) | ⑯ | 종목간 분산 51.5%, 5일후 순위상관 0.300 | **Phase 3 (자료 부족)** |
| 15 | 정밀도 연속가중 | Grinold `IC×√N` | λ<1 비중 51.7% | **Phase 2 (CHIEF 변경)** |
| 16 | 신호 **부호** 자체 | ④(되돌림) vs ⑪(반전없음) **충돌** | — | **⚠️ 반드시 검증** |

---

## 6. 지금 확정할 수 있는 것 vs 9/23 이후에만 말할 수 있는 것

### 6-1. 지금 확정 (표본 크기와 무관 — 분포·구조·코드)

1. A0 신호세기 vs 기간거래량 스피어만 **+0.738** → A0는 크기를 잰다.
2. 오늘 프로덕션 599종목 중 **83.1%가 45~55점**, 표준편차 5.76.
3. A1 만점기준 4% = 실측 p29 → **71.2% 포화**, 중립대 10.2%.
4. `|순매수/거래량| ≤ 1`은 수학적 상한. 실측 최대 57.5%, 위반 0건.
5. 세 주체 합 ≈ 0 (±2% 안 **86.1%**), 개인 vs −(외+기) 상관 **+0.962**.
6. 외국인–기관 단면 순위상관 **−0.394** (같은 부호로 더하면 상쇄).
7. `|S_TV|`–거래대금 −0.163 vs `|S_MC|`–거래대금 **+0.385**; 두 정규화 순위상관 0.888.
8. 5일창 외국인비율 분산의 **51.5%가 종목 고정효과**(비중첩), 5일 뒤 순위상관 0.300.
9. 5일 회전율 분산의 **89.5%가 종목간**.
10. 유니버스 전체 외국인 비율이 13창 동안 **+5.06% ~ −6.12%**로 실제로 움직였다.
11. dealTrends 전 2,995행에 `accumulatedTradingVolume` **100% 존재**(종목당 정확히 5행).
12. **`holdNow−holdBefore`는 5일이 아니라 4일치 거래만 반영한다** (§8-2, 실측 검증).
13. 권고안 시뮬레이션 분포: sd 8.5 · 중립대 51.3% · NOT_AVAILABLE 3.9%.

### 6-2. 9/23 이후에만 (성적 — **지금 말하면 안 되는 것**)

- 어떤 정규화(`S_TV` vs `S_MC`)가 더 잘 맞는가
- `w_i`(기관 직교항 가중)를 얼마로 둘 것인가
- 점수 기울기 11이 9인지 13인지
- λ의 `V_min`·`V_ref`
- 시장 기울기 항(±4)을 켤 것인가
- **⚠️ 신호의 부호가 5거래일 지평에서 (+)인가** ← ④와 ⑪이 충돌. 가장 중요한 미결 질문

> **금지**: 판단일 8일짜리 IC를 보고 위 모수를 고르는 것.
> 그 순간 threshold tuning(결과 보고 숫자 맞추기)이 되고
> `docs/gaeo_validation_policy.md` §6 (Forward Validation 자료의 OOS 자격 상실)에 정면으로 걸린다.

---

## 7. 검증 계획 (gaeo-data-analyst 인계)

### 7-1. 실행 가능 시점

- `flow_history` 2026-08-11 시작. 5일창 + 5일 결과 필요.
- 2026-09-04 기준 **판단일 8일** (기준 20일의 40%).
- 휴장 없다고 가정 시 **20 판단일 도달 종가일 2026-09-22 → 최초 검증 실행일 2026-09-23.**
- 20은 **최소선**이다. `minRegimeDiversity=3`을 "형식"이 아니라 "실제로 다른 국면"으로 채우려면 **40~60 판단일**이 안전하다. 현재 8일은 8/19~8/24 급락 + 8/25~8/28 반등이라는 **단일 V자 국면 하나**다.

### 7-2. 비교 설계 (arm)

| arm | 산식 | 목적 |
|---|---|---|
| **A0** | 현행 프로덕션 (고정 5만주) | 기준선 |
| **B1** | 권고안 (S_TV · 순위정규점수 · 외국인단독 `w_i=0`) | 순수 외국인 신호 |
| **B2** | B1 + 기관 직교항 `w_i=0.25` | 기관 잔차의 기여 |
| **B3** | B1 + 기관 직교항 `w_i=0.50` | 기여 곡선 |
| **C1** | B1의 정규화만 `S_MC` | ⑪ v1 vs v3 판별 |
| **D1** | B2 + 시장기울기 ±4 | tilt 항 가치 |
| **N** | 상수 50 (무의견) | **아무 것도 안 하기보다 나은가** |
| **R** | 신호 부호 반전(−B1) | **④ 되돌림 가설 직접 검정** |

### 7-3. 규칙 (`docs/gaeo_validation_policy.md` 준수)

- **PIT**: 판단일 D의 FLOW 창 = **D 직전 5거래일**(D−1 종료). D의 수급은 절대 안 씀. 진입 close(D), 결과 close(D+5).
- **독립 단위 = 판단일**(Constitution `independenceUnit`). raw N이 수천 건이어도 독립 표본은 판단일 수다.
- **신뢰구간 = 판단일 단위 block bootstrap**(§5). 단순 이항 CI 금지.
- **주 지표**: ① 일별 스피어만 IC 평균, ② **시장 중앙값 대비 초과수익 기준 적중률**(§8과 동일 기준), ③ BUY/SELL 정밀도.
- **필수 통제**: **거래대금 5분위 안에서의 IC**를 반드시 함께 보고. 8일 표본에서 기간거래량 자체의 IC가 **−0.098**이었다 — 통제 없이는 크기효과를 실력으로 오독한다(이미 실측된 함정).
- **국면 다양성**: 상승·하락·횡보 판단일 수를 각각 보고. 한 국면이 60%를 넘으면 결론 보류.
- **다중비교 보정**: arm이 8개다. 최선 arm의 명목 p값을 그대로 쓰지 말고 Bonferroni 또는 순열검정.
- **보고 필수 항목**(§3): matured 수 · BUY/HOLD/SELL 수 · 시장별·기간별 표본 · 판단일 수 · CI.

### 7-4. 합격선 (사전 등록 — 결과 보고 바꾸지 말 것)

**B계열이 A0를 대체하려면 아래를 모두 충족:**
1. 판단일 ≥ 20, 국면 3종 각각 ≥ 4일
2. 거래대금 5분위 통제 후 IC 차이(B−A0)의 block bootstrap 95% CI **하한 > 0**
3. arm **N**(상수 50) 대비 IC의 95% CI 하한 > 0 — **"안 하느니만 못하다"를 먼저 배제**
4. arm **R**(부호 반전)이 B를 이기지 않을 것 — 이기면 **부호 가정 자체를 재검토**
5. 하루 만의 라벨 변경률이 A1(21.8%) 수준으로 튀지 않을 것 (안정성)

**하나라도 미충족 → A0 유지.** 단, §8의 **코드 결함 수정은 성적과 무관하게 즉시 반영**한다(버그 수정이지 모형 선택이 아니다).

---

## 8. `flow_summary` 결함 3건과 수정안

### 8-1. 【확정 결함 A】 분자와 분모의 날짜 집합이 다르다

`compute_indicators.py:279-323`
```python
frgn = sum(num(r.get("foreignerPureBuyQuant")) or 0 for r in dt)   # ← dt 전체(5일)
...
for row in dt:
    d = str(row.get("bizdate") or "").strip()
    if d in volume_by_date:                 # ← 일봉과 날짜가 맞은 날만
        period_volume += volume_by_date[d]
volume_coverage = volume_match_days / len(dt)
if period_volume > 0 and volume_coverage >= 0.6:     # ← 3/5만 맞아도 통과
    frgn_ratio = frgn / period_volume * 100
```
**최악의 경우 5일치 분자 ÷ 3일치 분모 = 비율이 최대 1.67배 부풀 수 있다.**
오늘 단면은 597/599가 `volumeMatchDays=5`라 발현되지 않았지만, 신규상장·거래정지·일봉 수집 지연 때 언제든 터진다.

**수정안(권장 — 매칭 자체를 없앤다):**
```python
# dealTrends 같은 행의 accumulatedTradingVolume 을 분모로 쓴다.
# 분자·분모가 같은 행에서 나오므로 날짜 불일치가 구조적으로 불가능하다.
usable = [r for r in dt
          if num(r.get("accumulatedTradingVolume")) and num(r.get("closePrice"))
          and num(r.get("foreignerPureBuyQuant")) is not None
          and num(r.get("organPureBuyQuant")) is not None]
frgn = sum(num(r["foreignerPureBuyQuant"]) for r in usable)
org  = sum(num(r["organPureBuyQuant"])     for r in usable)
period_volume = sum(num(r["accumulatedTradingVolume"]) for r in usable)
traded_value  = sum(num(r["accumulatedTradingVolume"]) * num(r["closePrice"]) for r in usable)
```
- 게이트를 `coverage >= 0.6`(3/5)에서 **`len(usable) >= 4`(4/5)**로 올린다. 3일 창을 5일 창이라 부르지 않는다.
- 실측: 전 599종목·2,995행에 `accumulatedTradingVolume` **100% 존재** → 이 경로에서는 결손이 거의 없다.
- 일봉 매칭 `volume_by_date`는 **교차검증용으로만** 남기고(일치율 실측 98.94%), 불일치 시 `volumeCrossCheck: "MISMATCH"` 플래그만 남긴다.

### 8-2. 【확정 결함 B】 `holdNow − holdBefore`가 창보다 하루 짧다 (새로 발견)

`compute_indicators.py:352-353`
```python
"holdNow":    num(dt[0].get("foreignerHoldRatio")),    # 최신일 "종료 후" 보유율
"holdBefore": num(dt[-1].get("foreignerHoldRatio")),   # 최고(最古)일 "종료 후" 보유율
```
`frgnSum`은 `dt[0..-1]` **5일치 거래**를 더하는데, `holdNow − holdBefore`는
**가장 오래된 날의 거래가 이미 반영된 뒤**부터 재므로 **4일치 거래**만 담는다.

**실증 검증 (2026-09-04 프로덕션 599종목, 상장주식수 = 시총/종가로 역산):**

| 가설 | `|Δ보유율| ≥ 0.05%p` 표본 | 예측/실제 비율이 0.8~1.25 | 부호 일치 |
|---|---:|---:|---:|
| 순매수 **5일** ÷ 상장주식수 | 372 | 34.7% | 92.2% |
| 순매수 **4일**(`dt[:4]`) ÷ 상장주식수 | 376 | **54.0%** | **94.9%** |
| (`≥0.15%p` 구간) 5일 | 209 | 45.0% | 97.6% |
| (`≥0.15%p` 구간) **4일** | 215 | **64.7%** | **98.6%** |

→ **4일 가설이 명확히 우세.** 이 항은 `flow_eval`에서 `(hn−hb)×3`으로 **±6점**을 좌우한다.
현재 이 6점은 **다른 두 항과 다른 기간을 재고 있다.**

**수정안 (둘 중 하나):**
- (a) `holdBefore = dt[-1]`을 **한 행 더 과거**로 잡을 수 있으면 그렇게 한다 → 하지만 dealTrends가 5행뿐이라 **불가능**.
- (b) **정직한 방법**: 이 항의 기간을 명시적으로 4일로 선언하고(`holdWindowDays: 4`), 나머지 항도 같은 4일 창을 쓸지 결정한다.
- (c) **권고**: §4 재설계에서는 이 항을 **점수에서 빼고**, `Δ보유율`을 **`S^SO`(상장주식수 정규화) 후보 지표로 별도 기록**만 한다. 실은 `Δ외국인보유율 ≈ 외국인 순매수주식수 ÷ 상장주식수`이므로 **이미 존재하는 시총계열 정규화 신호**다(⑪의 `S^MC`에 대응). 점수에 그냥 더하지 말고 **arm C1의 재료로 쓴다.**
  - 단, 보유율은 **소수 2자리로 반올림**돼 있어 작은 변화에서 잡음이 크다(실측: `|Δ|≥0.01%p` 구간에선 부호일치 90.6%까지 떨어짐). 소형 변화 구간은 신뢰하지 말 것.

### 8-3. 【확정 결함 C】 `flowRatioPct`의 분모가 근사치인데 `qualityScore`에 그대로 들어간다

`compute_indicators.py:295-299, 342`
```python
last_volume = float((daily[-1] if daily else {}).get("volume") or 0)
flow_ratio = (frgn + org) / (last_volume * len(dt)) * 100     # 마지막 하루 거래량 × 일수
...
if flow_ratio is not None: quality += max(-20, min(20, flow_ratio * 2.5))   # ±20점
```
주석에도 "기존 근사치… 거래량이 들쭉날쭉한 종목에서 크게 틀린다"고 적혀 있는데,
**`qualityScore`(최대 ±50점, 사용자 화면에 "수급 품질 %+.0f점"으로 노출)의 ±20점 항이 그 근사치를 계속 쓴다.**

**수정안**: `flow_ratio`의 분모를 §8-1의 `period_volume`(같은 행 합계)으로 교체.
`flowRatioPct` 필드 자체는 호환성을 위해 유지하되 값의 정의가 바뀌므로
`flowRatioBasis: "period_volume_same_row"` 를 같이 실어 뜻이 조용히 바뀌지 않게 한다.

### 8-4. 【관찰】 `days=6`인데 실제 5행

`flow_summary(deal_trends, daily=None, days=6)` — 전 599종목이 정확히 5행이라 **항상 5일 창**이다.
동작상 문제는 없으나 **의도(6일)와 실제(5일)가 다르다.** 기본값을 `days=5`로 바꾸고
`windowDays`를 산출물에 명시할 것.

---

## 9. 위험 (이 변경이 무엇을 깨뜨릴 수 있는가)

### 9-1. CHIEF 판단이 실제로 많이 바뀐다
- FLOW 점수 표준편차 **5.0 → 8.5**. FLOW 가중치가 0.30이므로 CHIEF 총점 기여의 표준편차가 **약 1.5점 → 2.6점**으로 커진다.
- 직전 실측에서 A0→A1 전환 시 판단 불일치율이 **54.0%**였다. 권고안은 A1보다 온건하지만 **불일치율이 20~40%대로 나올 가능성이 높다.**
- ⚠️ **정밀분석 14종목**(`analysis.js`)의 FLOW 서술과 자동분석 FLOW 점수가 갈릴 수 있다. 배포 전 **14종목 before/after 대조표**를 반드시 뽑을 것.

### 9-2. 비대칭 문턱 때문에 SELL 쪽으로 기운다
- 권고안 점수는 50 대칭인데, CHIEF `BUY_CUT_BASE=63` vs SELL 문턱 47이라 **위쪽이 13점, 아래쪽이 3점** 거리다. FLOW의 산포가 커지면 **SELL 쪽에 먼저 닿는다.**
- 실측 시뮬: BUY(≥63) 8.6% vs SELL(<47) 31.8%.
- **대응**: 문턱은 이번에 **건드리지 않는다**(건드리면 두 변수를 동시에 바꿔 원인 분리가 불가능해진다). 대신 검증 보고에 **BUY/SELL 편중을 반드시 별도 항목으로** 낸다.

### 9-3. `available=False`가 생기면 학습 표본의 뜻이 바뀐다
- `compute_team_weights.py`의 FLOW 채점 표본이 **"FLOW가 의견을 낸 종목"으로 좁혀진다.**
- 발언권 계산에는 오히려 옳지만(의견을 낸 건에 대해서만 책임), **과거 시계열과 뜻이 달라진다.**
- **대응**: `team_weights.js`의 `method`/`global.version` 문자열을 반드시 올려 예전 기록과 섞이지 않게 한다(§8 선례와 동일 원칙). 그리고 **Constitution `scoringVersion`은 건드리지 않는다** — 건드리면 Evolution 누적 판단일수가 리셋된다.

### 9-4. 새로 생기는 편향
| 편향 | 내용 | 완화 |
|---|---|---|
| **저유동 종목 과소평가** | λ가 소형주 의견을 줄인다 → 소형주에서 FLOW가 항상 조용해진다 | λ를 산출물에 노출해 화면이 "거래가 적어 확신이 낮다"고 말하게 한다 |
| **횡단면 강제중립** | 매일 절반이 (+), 절반이 (−) → 시장 전체 수급 정보 소실 | §4-7 tilt 항(선택) |
| **종목 고정효과** | 순위의 51.5%가 종목 성질 → 같은 종목이 매일 같은 방향 | Phase 3(KST 자기기준 강도)로만 해결 가능. 그때까지 **알려진 한계로 문서화** |
| **외국인 편중** | 외국인 단일 주체 의존 → 외국인이 조용한 국면엔 신호 자체가 약해짐 | `MEASURED_NEUTRAL`로 정직하게 표시 |
| **부호 가정** | ④와 ⑪이 충돌하는데 (+)로 하드코딩 | arm R(부호반전)로 명시 검정 |

### 9-5. 지금 당장 하면 안 되는 것
- 8일 표본 IC를 보고 `w_i`·기울기·λ 모수를 고르는 것 (**threshold tuning**)
- §8 결함 수정과 §4 재설계를 **한 커밋에 섞는 것** — 성적이 바뀌었을 때 버그수정 때문인지 모형 때문인지 분리 불가
- `available=False` 도입과 점수 스케일 변경을 **동시에** 켜는 것

---

## 10. 권장 진행 순서

| 단계 | 내용 | 시점 | 비고 |
|---|---|---|---|
| **0** | §8 결함 A·B·C 수정 (**버그 수정만**, 점수 산식 불변) | 즉시 | 별도 커밋. before/after 진단 로그 필수 |
| **1** | 권고안을 **shadow 필드로만** 계산해 기록 (`flowScoreCandidate`, `S_TV`, `S_MC`, `λ`, `z`) — **화면·CHIEF 반영 안 함** | 즉시 | 저장소 관례(confidenceShadow·reboundGuard와 동일 원칙) |
| **2** | flow_history 계속 축적, 판단일 20 도달 | ~2026-09-22 | 하루라도 끊기면 밀림 |
| **3** | §7 arm 8종 비교 (gaeo-data-analyst) | 2026-09-23~ | 사전등록 합격선 §7-4 |
| **4** | 합격 시에만 Production 교체 + `team_weights` 버전 올림 | 검증 후 | 사람 승인 필수 |
| **5** | Phase 2(정밀도 연속가중, chief_eval 변경) | 별도 승인 | |
| **6** | Phase 3(KST 자기기준 강도) | 2026-10 하순~ | 50거래일 축적 후 |

---

## 부록 A. 재현 방법

모든 실측 수치는 아래로 재현된다(읽기 전용).
- 원자료: `/home/user/gaeo-analyst-team/flow_history/{index,2026-08,2026-09}.json` (17거래일 · 10,179행 · 600종목)
- 프로덕션 단면: `/home/user/gaeo-analyst-team/analysis_data.json` → `stocks[code].info.dealTrends`
- 직전 A0/A1 검증 산출물: `.../scratchpad/FLOW_A0_A1_SUMMARY.json`, `a0_vs_a1_report.json`, `a0_vs_a1_robust.json`, `a0_vs_a1_clamp.json`
- 이 문서의 새 실측(§2-3 §4-2 §4-6 §4-8 §4-10 §8-2)은 본 세션에서 flow_history/analysis_data.json을 직접 집계해 산출.

## 부록 B. 참고문헌 (확인 수준 포함)

1. `[초록]` Chordia, Roll, Subrahmanyam (2002), *JFE* 65(1) 111–130. https://www.sciencedirect.com/science/article/abs/pii/S0304405X02001368
2. `[초록]` Chordia, Subrahmanyam (2004), *JFE* 72(3) 485–518. https://www.sciencedirect.com/science/article/abs/pii/S0304405X03001752
3. `[초록]` Choe, Kho, Stulz (1999), *JFE* 54(2) 227–264. https://www.sciencedirect.com/science/article/abs/pii/S0304405X99000379
4. `[초록]` Choe, Kho, Stulz (2005), *RFS* 18(3) 795–829. https://academic.oup.com/rfs/article-abstract/18/3/795/1617731
5. `[서지]` Ko, Kim, Cho (2007), *JJIE* 21(2) 195–213. https://ideas.repec.org/a/eee/jjieco/v21y2007i2p195-213.html
6. `[초록]` (저자 미확정) *Journal of Asian Economics* (2011). https://www.sciencedirect.com/science/article/abs/pii/S0922142511000405
7. `[초록]` Kim, Kang, Roh (2025), *PBFJ* 90, 102622. https://www.sciencedirect.com/science/article/abs/pii/S0927538X24003743
8. `[초록]` Jeong, Eo, Kang (2026), *PBFJ* 98. https://www.sciencedirect.com/science/article/abs/pii/S0927538X26000855
9. `[초록]` Kedar-Levy, Kim, Yoo (2025), *JFM*. https://www.sciencedirect.com/science/article/pii/S104244312500071X
10. `[초록·프리프린트·버전불일치]` Kang, S. (2026), arXiv:2512.18648. https://arxiv.org/abs/2512.18648
11. `[초록]` Easley, Kiefer, O'Hara, Paperman (1996), *JF* 51(4) 1405–1436. https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1996.tb04074.x
12. `[초록]` Easley, López de Prado, O'Hara (2012), *RFS* 25(5) 1457–1493. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1695596
13. `[초록]` Green, Hand, Zhang (2017), *RFS* 30(12) 4389–4436. https://academic.oup.com/rfs/article-abstract/30/12/4389/3091648
14. `[초록]` Kaniel, Saar, Titman (2008), *JF* 63(1) 273–310. https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.2008.01316.x
15. `[초록]` Boehmer, Jones, Zhang, Zhang (2021), *JF* 76(5) 2249–2305. https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.13033
16. `[초록]` Barber, Odean, Zhu (2009), *RFS* 22(1) 151–186. https://academic.oup.com/rfs/article-abstract/22/1/151/1585397
17. `[초록]` Griffin, Harris, Topaloglu (2003), *JF* 58(6) 2285–2320. https://onlinelibrary.wiley.com/doi/abs/10.1046/j.1540-6261.2003.00606.x
18. `[초록]` Amihud (2002), *JFM* 5(1) 31–56. https://www.sciencedirect.com/science/article/abs/pii/S1386418101000246
19. `[초록]` Datar, Naik, Radcliffe (1998), *JFM* 1(2) 203–219. https://www.sciencedirect.com/science/article/abs/pii/S1386418197000049
20. `[서지]` Asness, Moskowitz, Pedersen (2013), *JF* 68(3) 929–985. https://onlinelibrary.wiley.com/doi/10.1111/jofi.12021
21. `[초록·비심사]` "Who Provides Liquidity in Retail-Dominated Markets? Evidence from Korea", mlquants (2026). https://mlquants.substack.com/p/who-provides-liquidity-in-retail
22. `[초록]` Revisiting Boehmer et al. (2021), *FMPM* (2025). https://link.springer.com/article/10.1007/s11408-025-00487-4
