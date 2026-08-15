# PHASE B 설계 수정사항 (사용자 지시 2026-08-15) — 최우선 규범

이 문서가 `gaeo_signal_registry.md` · `gaeo_phaseB_architecture.md` ·
`gaeo_validation_policy.md`와 충돌하면 **이 문서를 따른다.**

---

## 1. MACD는 CORE가 아니다 → `CANDIDATE`

실측에서 MACD 히스토그램이 다른 가격 Feature와 최대 상관 약 0.28로
상대적으로 독립적이라는 결과가 나왔다. 그러나

> **"다른 Feature와 상관이 낮다" ≠ "미래수익 예측력이 높다"**

Noise Feature도 상관이 낮을 수 있다. 낮은 상관은 "독립적일 가능성"의 증거일 뿐
예측력의 증거가 아니다.

**상태: `CANDIDATE` / `SECONDARY_CANDIDATE`. CORE 확정 금지.**

CORE 승격 조건(전부 통과해야 함):

1. Walk-Forward OOS predictive value
2. Incremental value
3. Ablation Test (`FULL TARO` vs `TARO WITHOUT MACD`)
4. Horizon별(5D/20D/60D) 안정성
5. Recent unseen result

MACD 제거 시 OOS가 **의미 있게 나빠질 때만** CORE 승격을 검토한다.

## 2. 높은 상관만으로 Feature를 삭제하지 않는다

| 쌍 | r | 상태 |
|---|---|---|
| ma120Gap ~ ma200Gap | 0.90 | `HIGH_REDUNDANCY_CANDIDATE` |
| rsi14 ~ bbPctB | 0.85 | `HIGH_REDUNDANCY_CANDIDATE` |
| ma60Gap ~ rsi14 | 0.78 | `HIGH_REDUNDANCY_CANDIDATE` |
| flowQual ~ flowRatio | 0.77 | `HIGH_REDUNDANCY_CANDIDATE` |

상관은 "중복 가능성"의 증거이지 **자동 삭제 명령이 아니다.**

제거 확정 조건: Correlation + Ablation + Incremental OOS Value **세 가지를 함께** 본다.
`FULL MODEL` vs `WITHOUT RSI` vs `WITHOUT BBPCTB`를 비교해,
하나를 빼도 OOS가 유지 또는 개선될 때만 제거를 확정한다.

**이전 문서에서 `bbPctB`를 `DISABLED`로 적은 것은 잘못이다. 철회한다.**

## 3. 14,063건을 독립표본 14,063개로 취급하지 않는다

하루에 약 500종목이 동시에 들어가므로 같은 날 종목들은 시장·업종 움직임을 공유한다.

**Scorecard에는 `row_count`와 `unique_prediction_dates`를 둘 다 표시한다.**

| Horizon | rows | unique dates |
|---|---|---|
| 5D | 14,063 | **29** |
| 20D | 6,530 | **14** |
| 60D | 0 | 0 |

신뢰구간·유의성은 **DATE-CLUSTERED** 또는 **TIME/BLOCK BOOTSTRAP**을 우선 검토한다.
필요 시 Industry Cluster 영향도 확인한다.

20D는 실질 14개 날짜뿐 → **강한 통계적 결론 금지.**
60D는 matured 0 → **성능 언급 자체 금지.**

## 4. 40거래일을 통계적 합격선으로 쓰지 않는다

단순 거래일 숫자로 `VALIDATED`를 선언하지 않는다.
Horizon마다 matured count · unique dates · BUY/HOLD/SELL count ·
probability-bin count · market regime coverage · confidence interval을 함께 본다.

## 5. Research Shadow Model VERSION FREEZE

오늘 이후 Shadow Prediction을 진짜 Forward/OOS 데이터로 쓰려면
**결과를 본 뒤 모델을 바꾸면 안 된다.**

각 Prediction에 필수 저장:

```
model_version        (예: research_v1.0)
prediction_timestamp
feature_version
label_version
config_hash
```

`research_v1.0` 운영 시작 후에는 그 버전의
Feature / Weight / Threshold / Action Boundary를
**과거 결과를 보고 수정하지 않는다.**

새 설계가 필요하면 `research_v1.1` / `research_v2.0`으로 새로 만든다.
**기존 v1.0 기록을 덮어쓰지 않는다.**

## 6. Shadow Prediction은 APPEND-ONLY

오늘 이후 발생한 Prediction을, 나중에 새 코드가 생겼다고
**과거 Prediction을 재계산해서 덮어쓰지 않는다.**
그 시점에 Research Engine이 실제로 냈던 판단을 보존한다.

보존 항목: `created_at` `model_version` `input_timestamp` `prediction`
`probability` `reliability` `maturity_status`

**`historical_backtest`와 `live_shadow_oos`를 같은 Scorecard에서 섞지 않는다.**

## 7. QUANT 통계자료의 미래정보 차단 (Point-in-Time)

Research QUANT의 통계자료는 각 Prediction 시점 기준
**그 시점 이전에 이미 maturity가 끝난 결과만** 사용할 수 있다.

> 2026-08-15 Prediction을 평가하는 QUANT가
> 2026-08-16 이후 결과를 알고 있으면 안 된다.

EXPANDING WINDOW 또는 ROLLING WINDOW 구조로 설계하고,
각 Prediction에 **`quant_stats_asof`를 기록**한다.

## 8. QUANT 29% 지분을 임의 재배분하지 않는다

QUANT는 점수 생산자가 아니라 통계 심판이 된다.
그렇다고 비어버린 29%를 TARO/DIANA/FLOW에 임의 분배하지 않는다.
"29% 삭제했으니 나머지를 비례 확대" 같은 행동도 근거 없이 하지 않는다.

CHIEF Candidate를 **병렬로** 만들 수 있게 설계한다.

```
MODEL A  Legacy Chief
MODEL B  Simple Equal Weight (예측 분석가만)
MODEL C  Pre-declared Research Fixed Model
MODEL D  Regularized Logistic/Linear Meta (데이터 충분해질 때)
```

QUANT는 독립 29% Vote가 아니라
`signal reliability` / `sample quality` / `incremental evidence` / `regime stability`를
CHIEF에게 전달하는 **Metadata / Validation Layer**다.

**지금 데이터로 최적 Weight를 튜닝하지 않는다.**

## 9. DIANA는 "완성"이 아니다

현재 가용: PER / PBR / ROE 중심(Value 축).
부족: Gross Profitability, Operating Profitability, Asset Growth, Accruals, Leverage.

출력 상태: **`DIANA_RESEARCH_PARTIAL` / `VALUE_ONLY_DIANA`**

부족한 Feature를 **0점으로 넣지 않는다.**

> 데이터 없음 ≠ 나쁜 기업

Missing Feature는 `NOT_AVAILABLE`로 처리하고 **Reliability에 반영**한다.
DART/재무 데이터 추가 전까지 "논문 기반 DIANA 완성"이라고 표현하지 않는다.

## 10. EVENT를 중립 점수로 만들지 않는다

DART/SEC 미구현 상태에서 `EVENT = 50점` / `EVENT = 중립`으로
CHIEF에 넣지 않는다.

상태: **`EVENT_NOT_IMPLEMENTED`** 또는 `EVENT_COVERAGE_INCOMPLETE`

> **정보가 없는 것은 중립적인 정보가 아니다.**

## 11. RISK도 가능/불가능 범위를 분리한다

계산 가능: Market Regime, Price/Volatility, Drawdown, Liquidity(부분), Data Risk
계산 불가: 재무 Distress, Event Risk → **`NOT_AVAILABLE`** 명시

**없는 위험정보를 "위험 없음"으로 취급하지 않는다.**

## 12. `ret5 ~ vsMarket` r=1.000 해석 주의

같은 날 모든 종목에서 같은 시장수익률을 빼면
**Cross-sectional rank**는 그대로다. 그러나 이것이
"vsMarket이 언제나 완전히 무의미하다"는 뜻은 **아니다.**

- **Cross-sectional ranking**: 하루 안 순위 비교 → 정보 추가 없음
- **Absolute / Time-series Excess Return Evaluation**: 날짜 간 비교, Label,
  평가 기준 → **여전히 의미 있음**

r=1.0 하나만 보고 삭제하지 않는다.

## 13. 5D / 20D / 60D 구현 원칙

| Horizon | 상태 | 허용 |
|---|---|---|
| 5D | matured 14,063 / unique 29일 | 개발 가능. 한계 명시 필수 |
| 20D | matured 6,530 / unique **14일** | 개발 가능. **강한 성능결론 금지** |
| 60D | **matured 0** | Prediction 산출·기록만 가능. Accuracy·Precision·Calibration·OOS 우월성 **언급 금지** |

60D Output에는 **`PERFORMANCE_NOT_YET_MATURED`** 상태를 표시한다.

## 14. "좋아졌다"는 표현 금지

PHASE C의 목표는 Research가 좋은지 증명하는 것이 **아니라**
Research Candidate를 고정해서 앞으로 실제 미래 데이터를 모으는 것이다.

금지: "정확도 향상" / "Research가 더 우수" / "논문 기반이라 더 정확"

정확한 표현:
> "Research Shadow Engine 구현 완료. 성능 우월성은 아직 검증되지 않음."

## 15. Timestamp Live Verification은 OPEN 유지

상태: **`IMPLEMENTED_PENDING_LIVE_VERIFICATION`**

다음 실제 장중 실행에서 `workflow_started_at` / `price_fetched_at` /
`analysis_started_at` / `analysis_completed_at`이 실제값으로 저장되는지
확인한 뒤에만 CLOSED.

## 16. US MARKET

미국 종목이 Universe에 0개 → KR/US 비교검증 현재 수행 불가.

상태: **`US_VALIDATION_NOT_AVAILABLE`**

미국시장 결과가 있는 것처럼 표를 채우지 않는다.
