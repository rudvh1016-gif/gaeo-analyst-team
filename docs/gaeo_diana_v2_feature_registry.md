# DIANA v2.0 Feature Registry — 공식 확정 상태

작성 2026-08-15

> **이 문서는 Feature를 아직 계산하지 않는다.** 어떤 공식을 쓸지, 그 공식이 원 논문과
> 같은지, DART 계정으로 실제 구할 수 있는지만 확정한다.
> `research_v2.0` 점수·Weight·Threshold는 여기서 만들지 않는다.

## 0. 상태 어휘

| 상태 | 뜻 |
| --- | --- |
| `PAPER_EXACT` | 원 논문 공식과 분자·분모·시점이 모두 같다 |
| `GAEO_PROXY` | 경제적 의도는 같지만 계산이 논문과 다르다. **논문 공식이라 부르지 않는다** |
| `POTENTIALLY_AVAILABLE` | 필요한 계정이 있어 보이지만 실응답 Coverage를 아직 확인하지 못했다 |
| `NOT_READY` | 필요한 계정이 없거나 정의가 확정되지 않았다 |

> ⚠️ **데이터 항목이 존재한다 ≠ 논문의 Feature를 정확히 계산할 수 있다.**
> 이전 보고에서 "DART로 DIANA 5개를 전부 채울 수 있다"고 쓴 것은 성급했다.
> 실응답 Coverage와 공식 대조가 끝나기 전까지 전부 `POTENTIALLY_AVAILABLE`로 낮춘다.

---

## 1. grossProfitability (Novy-Marx 2013, JFE)

| 항목 | 내용 |
| --- | --- |
| `formula` | (Revenue − COGS) / **Total Assets** |
| `paper_reference` | Novy-Marx (2013), "The other side of value: The gross profitability premium", JFE |
| `required_accounts` | 매출액, 매출원가 (또는 매출총이익), 자산총계 |
| `period_rule` | 분자는 회계기간 플로우(연간), 분모는 기말 스톡 |
| `availability_rule` | 세 계정이 모두 있을 때만. 하나라도 없으면 `NOT_AVAILABLE` |
| `PIT_rule` | 해당 재무를 담은 공시를 GAEO가 탐지한 시각(`usableFrom`) 이후만 |
| `status` | **`POTENTIALLY_AVAILABLE`** (실응답 Coverage 미확인) |

### ⚠️ 매출총이익률과 혼동하지 않는다

Novy-Marx의 핵심은 **분모가 자산총계**라는 점이다.

```
Novy-Marx Gross Profitability =  (매출액 − 매출원가) / 자산총계     ← 이것
일반적인 Gross Margin        =  (매출액 − 매출원가) / 매출액       ← 이것이 아니다
```

`gross profit / revenue`로 구현하면 그것은 수익성 마진 지표이지 논문의 Feature가 아니다.
그렇게 구현할 경우 이름을 `grossMargin`으로 바꾸고 상태를 `GAEO_PROXY`로 둔다.

---

## 2. operatingProfitability (Fama & French 2015, JFE)

| 항목 | 내용 |
| --- | --- |
| `formula` | (Revenue − COGS − SG&A − Interest Expense) / **Book Equity** |
| `paper_reference` | Fama & French (2015), "A five-factor asset pricing model", JFE |
| `required_accounts` | 매출액, 매출원가, 판매비와관리비, 이자비용, 자본총계 |
| `period_rule` | 분자 연간 플로우, 분모 기말 자기자본 |
| `availability_rule` | 판관비·이자비용이 없으면 `PAPER_EXACT` 불가 |
| `PIT_rule` | 위와 동일 |
| `status` | **`NOT_READY`** (판관비·이자비용 수집 대상에 없음) |

### ⚠️ `operating income / total assets`가 아니다

FF5의 OP는 **분모가 자기자본(Book Equity)** 이고, 분자는 이자비용까지 뺀 값이다.
현재 수집 목록(영업이익·자산총계)만으로는 다른 지표가 된다.

| 선택지 | 결과 |
| --- | --- |
| 판관비·이자비용을 추가 수집 | `PAPER_EXACT` 가능 |
| 영업이익 / 자기자본으로 대체 | `GAEO_PROXY` — 이름을 `operatingProfitabilityProxy`로 |
| 영업이익 / 자산총계로 대체 | `GAEO_PROXY` — 이건 ROA 계열이지 FF5 OP가 아니다 |

**결정: 판관비·이자비용을 수집 목록에 추가하고, 그 전까지 `NOT_READY`로 둔다.**

---

## 3. accruals (Sloan 1996, TAR)

| 항목 | 내용 |
| --- | --- |
| `formula` (원 정의) | 대차대조표 접근 — ΔWC − Depreciation, 분모는 평균 총자산 |
| `formula` (대체) | 현금흐름표 접근 — (Net Income − CFO) / 평균 총자산 |
| `paper_reference` | Sloan (1996), "Do stock prices fully reflect information in accruals and cash flows about future earnings?", TAR |
| `required_accounts` | 당기순이익, 영업활동현금흐름, 자산총계(2개 기간) |
| `period_rule` | 분자 연간 플로우, 분모는 **기초·기말 평균** 총자산 |
| `availability_rule` | 직전 기간 자산총계가 있어야 평균을 낼 수 있다 |
| `PIT_rule` | 위와 동일 |
| `status` | **`POTENTIALLY_AVAILABLE`** — 채택 시 `CASH_FLOW_PROXY` |

### ⚠️ `Net Income − CFO`로 끝나지 않는다

Sloan의 원 정의는 대차대조표 항목 변화(운전자본 증감 − 감가상각)로 발생액을 구한다.
현금흐름표 기반 (NI − CFO)는 널리 쓰이는 대체 정의지만 **원 논문과 같은 계산이 아니다.**

분모 normalization도 명시한다: **평균 총자산**(기초+기말)/2. 기말 총자산만 쓰면 다른 지표다.

**결정: 현금흐름표 접근을 쓰되 상태를 `CASH_FLOW_PROXY`로 표기하고, 원 정의라고 부르지 않는다.**

---

## 4. assetGrowth (Cooper, Gulen & Schill 2008, JF)

| 항목 | 내용 |
| --- | --- |
| `formula` | (TA_t − TA_{t−1}) / TA_{t−1} |
| `paper_reference` | Cooper, Gulen & Schill (2008), "Asset growth and the cross-section of stock returns", JF |
| `required_accounts` | 자산총계, 2개 회계연도 |
| `period_rule` | 연간(FY) 기준. 분기와 섞지 않는다 |
| `availability_rule` | 직전 연도 자산총계가 없으면 `NOT_AVAILABLE` |
| `PIT_rule` | **나중 기간 재무의 탐지 시각** 이후부터 사용 가능 |
| `status` | **`POTENTIALLY_AVAILABLE`** |

두 시점을 명시한다: 직전 회계연도 기말과 당해 회계연도 기말. 분모는 **직전 연도** 자산총계다.
분모를 평균 자산으로 바꾸면 다른 지표가 되므로 섞지 않는다.

> ⚠️ 이 Feature는 `gaeo_verified_references.md`에 아직 등재되지 않은 논문을 참조한다.
> LOCKED PAPER PACK에 추가 확인 후 등재해야 `PAPER_EXACT`를 논할 수 있다.
> 현재는 정의만 고정해 둔 상태다.

---

## 5. leverage

| 항목 | 내용 |
| --- | --- |
| `formula` (채택) | 부채총계 / 자산총계 (Liabilities / Assets) |
| `paper_reference` | **단일 표준 정의 없음** |
| `required_accounts` | 부채총계, 자산총계 |
| `period_rule` | 기말 스톡 |
| `availability_rule` | 두 계정 모두 필요 |
| `PIT_rule` | 위와 동일 |
| `status` | **`GAEO_PROXY`** (논문 공식이 아니라 우리가 고른 정의) |

세 가지가 흔히 쓰이고 서로 다른 값이다. **임의로 섞지 않는다.**

| 정의 | 성격 |
| --- | --- |
| Liabilities / Assets | 전체 부채 비중. **채택** — DART 계정으로 바로 구한다 |
| Debt / Assets | 이자부부채만. 차입금 계정을 따로 뽑아야 한다 |
| Debt / Equity | 자본 대비 배수. 자본잠식 시 발산한다 |

Debt(이자부부채) 계정을 수집하기 전까지 `Liabilities / Assets` 하나만 쓰고,
이름도 `liabilitiesToAssets`로 두어 오해를 막는다.

---

## 6. 연결(CFS) / 별도(OFS)

**섞지 않는다.** 같은 회사에서 기간마다 CFS와 OFS가 번갈아 들어가면
시계열 Feature가 회사의 변화가 아니라 보고서 종류의 변화를 재게 된다.

원칙(스모크 테스트 결과 확인 후 확정):

```
1) CFS(연결) 우선
2) CFS가 없으면 OFS(별도) fallback
3) 어느 쪽을 썼는지 레코드마다 fs_div로 기록
4) 같은 회사의 시계열에서 fs_div가 바뀌면 그 구간은 FS_DIV_INCONSISTENT로 표시하고
   증감률 계산(assetGrowth 등)에 쓰지 않는다
```

4번이 핵심이다. fallback을 허용하되, **fallback이 섞인 구간의 증감률은 버린다.**

---

## 7. 금융업 별도 처리

은행·보험·증권은 손익 구조가 다르다.

| 항목 | 일반 제조업 | 금융업 |
| --- | --- | --- |
| 매출원가 | 있음 | 통상 없음 |
| 매출총이익 | 있음 | 통상 없음 |
| 부채비율 | 재무 건전성 신호 | 예금·보험부채가 본업이라 의미가 다르다 |

따라서 금융업 종목은 `FINANCIAL_SECTOR_SPECIAL_HANDLING_REQUIRED`로 표시하고,
`grossProfitability`·`leverage`를 **일반기업 공식에 억지로 넣지 않는다.**
해당 종목의 그 Feature는 `NOT_APPLICABLE_FINANCIAL_SECTOR`로 남긴다.

업종 판별은 `tickers.js`의 sector와 DART `corp_cls`를 함께 본다.
실제 분류는 매핑 완료 후 확정한다.

---

## 8. 실측 Coverage (2026-08-15 실연결)

대표 4곳을 실제로 호출해 확인했다. FY2025 연결(CFS) 기준.

| 종목 | 업종 성격 | Coverage | 결측 | 해당 없음 |
| --- | --- | --- | --- | --- |
| 005930 삼성전자 | 제조/반도체 | **10/10** | 없음 | 없음 |
| 005380 현대차 | 제조/자동차 | **10/10** | 없음 | 없음 |
| 035420 NAVER | 서비스/인터넷 | **8/10** | 매출원가, 매출총이익 | 없음 |
| 105560 KB금융 | 금융/은행 | **7/7** | 없음 | 매출액, 매출원가, 매출총이익 |

전 항목이 `account_id`로 매칭됐다(이름 매칭 0건).

### 이름 매칭이 실패했던 실제 사례

| 종목 | 항목 | 실제 계정명 | account_id |
| --- | --- | --- | --- |
| 현대차 | `netIncome` | **연결**당기순이익 | `ifrs-full_ProfitLoss` |
| KB금융 | `operatingCashFlow` | 영업활동**으로부터의** 현금흐름 | `ifrs-full_CashFlowsFromUsedInOperatingActivities` |
| KB금융 | `investingCashFlow` | 투자활동**으로부터의** 현금흐름 | `ifrs-full_CashFlowsFromUsedInInvestingActivities` |

계정명은 회사마다 다르고 `account_id`는 IFRS 표준이다. **account_id 우선**으로 바꿨다.

`sj_div` 실측값: `BS` · `IS` · `CIS` · `CF` · `SCE`.
NAVER·KB금융은 `IS`가 없고 `CIS`(포괄손익계산서)만 있다. 그래서 손익 항목은
`IS`와 `CIS`를 모두 허용한다.

### NAVER 매출원가는 매칭 버그가 아니다

카탈로그로 "원가"가 들어간 계정을 전부 뒤졌으나 **하나도 없었다**.
서비스 기업이라 영업비용으로만 보고한다. 즉 **Gross Profitability를 계산할 수 없는
종목이 실제로 존재한다.** 이런 종목은 Feature를 `NOT_AVAILABLE`로 두고
평균이나 0으로 채우지 않는다.

### KB금융은 결측이 아니라 개념 부재

매출액·매출원가·매출총이익 대신 보험수익·수수료수익·이자수익으로 나뉜다.
`NOT_APPLICABLE_FINANCIAL_SECTOR`로 구분하고 coverage 분모에서 뺐다.
그래서 7/7이 됐다. 일반기업 공식에 억지로 넣지 않는다.

---

## 9. 현재 상태 요약

| Feature | 상태 | 막힌 것 |
| --- | --- | --- |
| `grossProfitability` | `POTENTIALLY_AVAILABLE` | 제조업은 계산 가능. **서비스업 일부는 원천 부재**, 금융업은 개념 부재 |
| `operatingProfitability` | `PENDING_REAL_RESPONSE_CHECK` | 2026-08-21 판관비·이자비용을 수집 목록에 추가했다(`FINANCIAL_TARGETS`의 `sgaExpenses`·`interestExpense`). 합성 응답에서는 뽑히지만 **실제 DART 응답에 그 계정이 있는지는 아직 확인 전** |
| `accruals` | `POTENTIALLY_AVAILABLE` (`CASH_FLOW_PROXY`) | 직전기 자산총계 필요(2개 연도 수집 미구현) |
| `assetGrowth` | `POTENTIALLY_AVAILABLE` | 2개 연도 필요, 논문 LOCKED PACK 등재 필요 |
| `leverage` | `GAEO_PROXY` (`liabilitiesToAssets`) | 표준 정의 없음. 금융업은 의미가 다름 |

**5개 중 `PAPER_EXACT`는 여전히 0개다.**
계정을 구할 수 있다는 것과 논문 공식을 그대로 계산할 수 있다는 것은 다르다.

### 2026-09-04 추가 — Piotroski F-Score

소유자 지적("재무에 싸다/비싸다만 있고 건실한가가 없다")에 대응해
`piotroski.py`를 만들었다. Piotroski (2000), *Journal of Accounting Research* 38, 1-41.

| 항목 | 상태 |
| --- | --- |
| 필요 계정 수집 | **완료.** `FINANCIAL_TARGETS`에 `currentAssets`·`currentLiabilities`·`nonCurrentLiabilities`·`issuedCapital` 추가(12 → 16개). 이게 없어 9개 신호 중 3개는 계산조차 불가능했다 |
| 계산 구현 | **완료** (`piotroski.py`, `test_piotroski.py` 14건) |
| 9개 신호 근거 등급 | 7개 `PAPER_EXACT` · 2개 `GAEO_PROXY`(레버리지는 장기차입금 대신 비유동부채, 증자는 신주발행 대신 자본금 증가) |
| 전체 결과 등급 | **`GAEO_PROXY`.** 대체 계산 두 개가 있는 한 `PAPER_EXACT`라고 부르지 않는다 |
| 실데이터 검증 | **미완.** 이 세션에 DART 키가 없어 합성 픽스처로만 검증했다 |
| 점수 반영 | **없음.** DIANA 점수도 화면도 바꾸지 않았다 |

**규칙**: 9개 신호를 다 못 채우면 `score`는 `None`이다. 8개만 채운 값을
"F-Score 7점"이라고 부르면 원 논문과 다른 것을 같은 이름으로 파는 것이다.
빠진 신호는 0이 아니라 '못 구함'이다.

---

## 10. 다음에 할 일

1. ~~대표기업 실응답 Coverage 확인~~ → **완료** (위 8절)
2. ~~`operatingProfitability`를 위해 판관비·이자비용을 수집 목록에 추가~~
   → **완료** (2026-08-21). `FINANCIAL_TARGETS`에 `sgaExpenses`·`interestExpense`를
   넣었고 `test_dart_pipeline.py`가 추출을 검증한다.
   **남은 것**: 대표기업 실응답에 이 두 계정이 실제로 있는지 확인
   (`dart_smoke_test.py`). 없으면 지금처럼 `NOT_AVAILABLE`로 남는다 — 0으로
   만들지 않으므로 잘못된 점수가 생길 위험은 없다.
3. ~~`accruals` · `assetGrowth`를 위해 **직전 회계연도 재무를 함께 수집**~~
   → **수집 경로 신설 완료** (2026-09-04, `collect_dart_financials.py`).
   API 예산(`dart_budget.py`)과 대상 선정 규칙을 함께 넣었다:
   한 실행당 40개사·150호출 상한, 이미 받은 (회사, 연도)는 재요청하지 않음,
   자료 없음으로 확인된 해도 기억해 다시 묻지 않음, 예산이 빠듯하면 정지
   (`financial`은 OPTIONAL 등급). `test_dart_financials_collect.py`가 이 계약을 지킨다.
   **남은 것**: 워크플로에 연결(러너에는 `OPEN_DART_API_KEY`가 있다)하고,
   실제 응답으로 Coverage를 확인하는 일.

   ⚠️ **정정 — 회계연도는 2개가 아니라 3개가 필요하다.**
   이 항목은 원래 "직전 회계연도"(2개)라고 적었지만, 실제로는 3개가 있어야 한다.
   논문의 ΔROA·Δ자산회전율은 분모로 **기초(직전기말) 총자산**을 쓰므로, 작년치를
   계산하려면 전전기말 총자산이 또 필요하다.
   ```
   올해 회전율 = 매출_t     ÷ 총자산_{t-1}
   작년 회전율 = 매출_{t-1} ÷ 총자산_{t-2}   ← 전전기 자료
   ```
   `collect_dart_financials.YEARS_NEEDED = 3`이 이 값이고,
   `test_piotroski.py`가 "2개면 점수를 만들지 않는다"를 계약으로 고정한다.
4. `assetGrowth` 논문을 LOCKED PAPER PACK에 등재.
5. 금융업 종목 전체 목록 확정. 지금은 업종명 낱말로 판정하는 임시 방식이다.
6. CFS/OFS가 시계열에서 섞이는지 실측 후 `FS_DIV_INCONSISTENT` 규칙 적용.
7. 그 뒤에야 `research_v2.0`의 Feature 계산을 시작한다.

**지금은 점수를 만들지 않는다.**
