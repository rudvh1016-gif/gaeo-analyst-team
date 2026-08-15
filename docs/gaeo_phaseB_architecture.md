# PHASE B 아키텍처: QUANT · RISK · CHIEF 역할과 Shadow Mode 설계

작성일 2026-08-15 · **설계 문서. 코드 미구현.**

역할 고정: **QUANT = 통계 심판 / RISK = 안전검사 / CHIEF = 최종 의사결정 책임자.**
이 역할은 바꾸지 않는다.

---

## 1. 권한 순서 (고정)

```
DATA VALIDITY GATE
      ↓
전문 ANALYST SIGNALS (TARO · DIANA · FLOW · ROTATION · EVENT)
      ↓
QUANT 통계검증
      ↓
RISK SAFETY GATE
      ↓
CHIEF FINAL DECISION
```

Hard Safety Gate가 발생하면 **CHIEF가 이를 무시할 수 없다.**
그 외 정상 상황에서는 CHIEF가 최종 판단권자다.

---

## 2. QUANT: 점수 생산자 → 통계 심판

### 현재(Legacy)

QUANT가 0~100 점수를 내고 CHIEF 합산에 약 29% 지분으로 참여한다.
즉 **또 하나의 분석가**다.

### Research 설계

QUANT는 **점수를 내지 않는다.** 다른 분석가의 주장이 데이터에서
실제로 믿을 만한지 검사하는 심판이 된다.

검사 대상:

- TARO가 실제로 잘 맞는가
- DIANA가 미래수익과 연결되는가
- FLOW가 추가 정보를 제공하는가
- ROTATION이 개별 종목 판단에 도움이 되는가
- EVENT 효과가 실제로 존재하는가

각 Feature/Signal마다 산출:

```
Sample Count · Mean/Median Forward Return
Market Excess Return · Industry Excess Return
Confidence Interval (판단일 block bootstrap)
Rank IC · Spearman IC
OOS Performance · Recent OOS Performance
Regime Stability · Feature Correlation
Incremental Predictive Value · Turnover · Signal Flip Rate
```

### 기존 "유사사례" 분석 보강

현재 화면은 "유사사례 5,363건 / 상승확률 49% / 평균 +1.2%"를 보여준다.
표본이 5,000건이어도 **유사사례 정의가 잘못됐다면 강한 근거가 아니다.**

추가 필수: Confidence Interval · Benchmark Difference · Recent Period ·
OOS Result · Regime Result · Distribution · Median · 표본 정의 명시.

### ⚠️ Legacy 대체 시 발생하는 공백

QUANT가 점수를 내지 않으면 CHIEF 합산에서 약 29% 지분이 빈다.
이 공백을 어떻게 메울지는 **PHASE D 이후 OOS로 결정**한다.
지금 임의로 재배분하지 않는다(튜닝 금지).

---

## 3. RISK: 감점기 → Safety Gate

### 현재(Legacy)

- 가점 없음, 고위험 최대 -7점, 신뢰도 -10%p
- UI 문구와 코드 일치 확인 완료(PHASE A)

### 문제

`CHIEF 82점 - RISK 7 = 75 → BUY`가 **항상 합리적인가?**

다음은 -7점으로 통과시킬 문제가 아니다.

- 잘못된 종목코드 / 심각하게 오래된 가격 / 거래정지
- 데이터 깨짐 / 핵심 재무데이터 오류

### Research 설계: 상태값 + Hard Gate

```
NORMAL
ELEVATED_RISK
HIGH_RISK
LOW_RELIABILITY
JUDGMENT_WITHHELD      ← Hard Gate. CHIEF가 무시 불가
```

RISK 차원:

| 차원 | 지표 | 현재 가용 |
|---|---|---|
| A 시장 국면 | 급락·고변동성·패닉반등 | 있음(marketRegime) |
| B 종목 변동성 | Realized Vol, ATR | vol20 있음 / ATR 파생 가능 |
| C 하방 | Drawdown, Gap Risk | mdd3m 있음 |
| D 유동성 | 거래대금, Amihud | 파생 가능 / Spread 없음 |
| E 재무 부실 | Leverage, Loss | **없음(DART 필요)** |
| F 데이터 위험 | Stale, Missing, Mapping, API Error | `stale` 플래그 있음 |
| G 이벤트 불명 | 비정상 변동 + 뉴스 커버리지 부족 | EVENT 미구현 |

**논문 해석 주의**: Moreira & Muir(2017)와 Cederburg et al.(2020)을 같이 읽는다.
"변동성 높으면 무조건 감점"을 논문이 증명했다고 주장하지 않는다.

---

## 4. CHIEF: 최종 의사결정

CHIEF는 단순 번역기가 아니다. 조정·의사결정 책임자다.

### Ensemble 비교 (복잡도 자체를 장점으로 취급하지 않음)

```
MODEL 0  LEGACY CHIEF
MODEL 1  SIMPLE EQUAL WEIGHT
MODEL 2  RESEARCH FIXED WEIGHT
MODEL 3  REGULARIZED LINEAR / LOGISTIC META MODEL
```

복잡한 ML은 위 단계들을 OOS에서 **명확히 이긴 경우에만** 고려한다.

### 확률 결합 주의

Ranjan & Gneiting(2010): 개별 모델이 각각 Calibration되어 있어도
단순 가중평균한 최종확률이 자동으로 Calibration되지는 않는다.
**CHIEF 최종 Probability도 다시 Calibration한다.**

### Horizon 분리와 충돌 처리

5D / 20D / 60D를 분리한다(60D는 현재 표본 0이라 산출만 하고 성능 언급 금지).

충돌을 평균내지 않는다.

```
5D BUY 72% + 20D bearish 70%
  → 평균 71 → HOLD   (금지)
  → SHORT_TERM_POSITIVE / MEDIUM_TERM_NEGATIVE 로 분류 (올바름)
```

### PRIMARY_ACTION (초보자 화면)

기간별 확률만 보여주고 끝내지 않는다. 반드시 하나의 행동을 낸다.

```
🟢 매수 고려 / 🔵 보유 / 🟡 관망 / 🟠 비중 축소 고려 / 🔴 매도 고려 / ⚪ 판단 보류
```

경계값은 임의로 정하지 않고 OOS / Calibration / Loss Function으로 결정한다.

### 미보유자 / 보유자 분리

```
PRIMARY ACTION : 🟡 관망
미보유자       : 신규매수 보류
보유자         : 기존 보유 유지
한 문장 이유   : "단기 가격흐름은 긍정적이지만 20일 방향성과 수급 확신이 아직 부족합니다."
신뢰등급       : B
```

Public GAEO는 보유 여부를 모르므로 **둘 다** 표시한다.

### ABSTAIN (모른다고 말하기)

낮은 Edge / 낮은 Reliability / 심한 신호 충돌 / 데이터 부족 /
Event Coverage 문제 / 표본 부족이면 **관망 또는 판단 보류**를 정상 출력으로 인정한다.
모든 종목에 강제로 BUY/HOLD/SELL을 내지 않는다.

### 신뢰도 2분할 (PHASE A 감사 결과 반영)

```
A. FORECAST PROBABILITY   예) 5거래일 목표 달성확률 64%
B. DATA/MODEL RELIABILITY 예) B등급
```

현재는 이 둘이 "분석가 의견 일치도" 한 숫자에 섞여 있다.
**확률과 신뢰등급을 하나의 숫자로 합치지 않는다.**

---

## 5. SHADOW MODE 구현 방식 (PHASE C)

### 원칙

**Legacy를 건드리지 않는다. Production 판단을 Research로 교체하지 않는다.**

### 이미 있는 패턴을 그대로 확장

`analyze_auto.py`는 이미 v3 후보를 `shadowChief`로 나란히 저장하고,
`archive_analysis.py`가 `entry["shadow"]`로 아카이브한다.
Research도 **같은 자리에 하나 더** 얹는다.

```python
out["stocks"][code] = {
    "chief": baseline_chief,          # Legacy. 화면에 나가는 값. 변경 없음
    "shadowChief": shadow_chief,      # 기존 v3 후보. 변경 없음
    "researchShadow": research_pred,  # ← 신규. 화면에 안 나감
}
```

`researchShadow` 구조(안):

```json
{
  "modelVersion": "research-v0",
  "horizons": {
    "5":  {"probUp": 0.61, "action": "HOLD", "maturity": "PENDING"},
    "20": {"probUp": 0.55, "action": "HOLD", "maturity": "PENDING"},
    "60": {"probUp": null, "action": null,  "maturity": "NOT_MATURED"}
  },
  "reliability": "B",
  "riskState": "NORMAL",
  "abstain": false,
  "features": { ... 재현에 필요한 최소 입력값 ... },
  "predictedAt": "<runTimestamps와 동일한 실제 시각>"
}
```

### 동시 저장 보장

Legacy와 Research를 **같은 실제 분석시각**에 저장한다.
PHASE A에서 추가한 `runTimestamps`가 그 시각의 단일 원천이다.

### Forward Validation 자료 분리

오늘 이후 생성되는 `researchShadow`는 **읽기 전용 검증 자료**다.
이 기록을 보고 Feature/Weight/Threshold를 고치면 OOS 자격을 잃는다.
튜닝은 과거 데이터(Point-in-Time 준수)로만 한다.

### PHASE C 필수 규칙 (재확인)

`build_quant_stats()`류 통계표를 전 기간 한 번만 만들어 과거 판단에 적용하면
**미래정보 유입**이다. 백테스트는 판단일 T마다 T 이전 데이터로 표를 다시 만든다.
새로 추가된 업종 기저율(`_sectorBase`)도 동일하다.

---

## 6. 이번 PHASE B에서 하지 않은 것

- Weight / Threshold 결정 (데이터 부족. 과최적화 금지)
- Feature 최종 선별 (Ablation·Incremental OOS 미실시)
- 어떤 성능 주장도 하지 않음
