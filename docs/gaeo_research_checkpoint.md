# GAEO RESEARCH V2 — 마스터 체크포인트

**다음 세션은 이 파일을 가장 먼저 읽는다.** (토큰 절약 원칙, 스펙 3번)

최종 갱신 2026-08-15 · 현재 위치 **PHASE B 설계 완료 / PHASE C(Shadow Engine) 착수 대기**

---

## 1. 지금까지 확정된 결론 (다시 조사하지 말 것)

### SELL 9.1% 원인 → 규명 완료

**E. 복합 원인.** 코드 버그 아님.

- D 시장 국면(지배적): 시장 방향과 SELL 절대 적중률이 거의 완전한 역상관.
  하락장 85.9% / 상승장 9.4%. 9.1%는 급등장 한 주의 반사값.
- B 라벨 설계: 절대수익률 채점이 종목 선별력이 아니라 시장 방향을 잼.
  HOLD만 ±5%, BUY/SELL은 ±1%라 종류 간 비교 불공정.
- C 신호 약함: 시장 효과 제거 후 SELL 시장대비 50.9%(동전 던지기).
  상승장에서는 31.8%로 역우위.
- A 코드 버그: 해당 없음. SIGN 통과, MIRROR TEST로 부호 버그 배제.

상세: `gaeo_sell_forensic_audit.md`

### 부수 발견: SELL 과다 발생의 뿌리

- 판단 분포 HOLD 53.0% / **SELL 41.2%** / **BUY 5.7%**
- QUANT 중앙값 46점(50 미만)이 전체를 아래로 견인. QUANT 20~29점이면 73.5%가 SELL.
- **문턱 비대칭**: BUY 63점은 상위 7.0%, SELL 47점 미만은 하위 36.6%.
- SELL 발생률이 국면과 무관하게 항상 약 40%. 국면 적응 전혀 없음.
- QUANT의 구조적 하향 편향은 2026-08-15 별건 수정됨(업종 기저율 미반영, PR #360).
  **history.js의 모든 기록은 수정 이전 로직이다.**

### 신뢰도 구조 → 규명 완료

`conf = clamp(max(40, 88 - spread) - riskPenalty, 30, 90)`.
확률이 아니라 **분석가 4인 의견 일치도**. spread와 r = -0.93.
실제 적중과의 상관은 BUY 기준 r = 0.10으로 매우 약함.
합산 신뢰도 표의 개선(52.5%→67.9%)은 표본 88%인 SELL이 견인한 착시.

상세: `gaeo_confidence_calibration.md`

### 확정 결함 수정 완료 (2026-08-15) → `gaeo_phaseA_fixes.md`

튜닝은 하지 않았다. Feature/Weight/Threshold 전부 그대로다.

1. **HOLD 채점 규칙 3원화 → 엄격으로 통일.**
   index.html·compute_team_weights.py가 관대(HOLD는 miss 불가),
   compute_model_intelligence.py가 엄격으로 갈려 같은 데이터 적중률이
   70.7% vs 51.2%로 19.5%p 달랐다. 성적표 헤드라인과 판단종류별 표도 서로 달랐다.
   → 엄격으로 통일. 팀 통산 70.7% → **51.2%**.
   **분석가 가중치는 수정 전후 완전 동일**(score_call은 표시용, 가중치는 score_stance에서 나옴).

2. **`evalClose()` 정렬 누락 수정.** 합성 데이터로 재현 확인
   (페이지 뒤바뀌면 +5.0%가 +9.0%로 오계산). 정렬 추가.
   현재 실데이터 14,063건 대조 결과 **차이 0건** — 회귀 없이 미래 사고만 차단.

3. **SELL 평가 로직: 수정할 코드 오류 없었음.** 정직하게 기록.

4. **실제 실행시각 기록 구조 추가 — 상태: `IMPLEMENTED_PENDING_LIVE_VERIFICATION`**
   `auto_analysis.js`에 `runTimestamps`(workflowStartedAt / priceFetchedAt /
   analysisStartedAt / analysisCompletedAt). 예정값(cronScheduledNominal)은
   분리 저장하고 데이터 시각으로 쓰지 말라고 명시. 환경변수 없으면 null.
   ⚠️ **CLOSED 처리 금지.** 2026-08-15는 토요일이라 러너가 장외 분기로 빠져
   이 코드가 실제로 실행되지 않았다. **다음 평일 장중 실행에서 네 값이 모두
   실제 시각으로 저장되는지 반드시 확인**한 뒤에야 CLOSED로 바꾼다.

---

## 2. 검증기준 (2026-08-15 변경) → `gaeo_validation_policy.md`

**"40거래일이면 검증 가능"이라는 단일 기준은 폐기했다.**
40거래일은 임시 최소 관찰기간일 뿐 통계적 충분성을 보장하지 않는다.

Horizon별로 Maturity를 따로 관리한다. 5D는 5거래일, 20D는 20거래일,
60D는 60거래일이 지나야 평가 가능하고, 그 전에는 적중/빗나감/중립 어디에도
넣지 않고 `PENDING / NOT_MATURED`로 제외한다.

거래일 수만으로 "충분"을 선언하지 않는다. Horizon마다 matured count,
BUY/HOLD/SELL count, 시장별·기간별·probability bin별 표본수,
effective sample size, confidence interval을 함께 보고한다.

### 현재 실측 (판단일 34일, 2026-07-01 ~ 08-14)

| Horizon | matured | PENDING | BUY | HOLD | SELL | 평가가능 판단일 |
|---|---|---|---|---|---|---|
| 5D | 14,063 | 2,523 | 808 | 7,456 | 5,799 | 29 / 34 |
| 20D | 6,530 | 10,056 | 488 | 3,299 | 2,743 | 14 / 34 |
| **60D** | **0** | **16,586** | **0** | **0** | **0** | **0 / 34** |

- **60D는 평가 가능한 판단이 문자 그대로 0건.** 어떤 결론도 내지 않는다.
- 20D는 건수는 많지만 서로 다른 날이 14일뿐이라 독립 표본이 아니다.
- 같은 날 500종목이 함께 들어가므로 effective sample size는 훨씬 작다.
  신뢰구간은 판단일 단위 block bootstrap으로 계산한다.

시세 이력은 295거래일(2025-06-02~)로 더 길어서
Point-in-Time을 지키는 범위에서 설계·사전 Walk-Forward에는 쓸 수 있다.

## 3. PHASE 진행 상태

| PHASE | 내용 | 상태 |
|---|---|---|
| **A** | DATA / BUG / LABEL / LOOK-AHEAD 감사 | **완료** |
| **A-fix** | 확정 결함 수정(튜닝 아님) | **완료** |
| **B** | LOCKED PAPER 기반 Candidate Feature 설계 | **완료** |
| C | Research Engine 구현(Legacy 분리, SHADOW MODE) | **다음 차례** |
| D | Walk-Forward OOS | Horizon별 Maturity 미달 (60D는 표본 0) |
| E | Probability Calibration | 미착수 |
| F | Legacy / Baseline / Research 비교 | 미착수 |
| G | Production 교체 판정 | 미착수 |

---

## 4. 문서 현황 (스펙 72번)

| 문서 | 상태 |
|---|---|
| `gaeo_research_checkpoint.md` | 완료(이 파일) |
| `gaeo_sell_forensic_audit.md` | 완료 |
| `gaeo_label_audit.md` | 완료 |
| `gaeo_data_audit.md` | 완료 |
| `gaeo_point_in_time_rules.md` | 완료 |
| `gaeo_confidence_calibration.md` | 완료(감사 + 그림자 검증 결과) |
| `gaeo_phaseA_fixes.md` | 완료(확정 결함 수정 전/후 대조) |
| `gaeo_validation_policy.md` | **완료**(Horizon별 Maturity, 40일 단일기준 폐기) |
| `gaeo_verified_references.md` | **완료**(LOCKED PAPER PACK) |
| `gaeo_signal_registry.md` | **완료**(TARO·DIANA·FLOW·ROTATION·EVENT Feature + 상관 실측) |
| `gaeo_phaseB_architecture.md` | **완료**(QUANT·RISK·CHIEF 역할 + Shadow Mode 설계) |
| `gaeo_event_pipeline.md` | 미작성 (PHASE C, DART/SEC 연동 시) |
| `gaeo_validation_report.md` | 미작성 (PHASE D~F) |

---

## 5. PHASE C 착수 시 반드시 지킬 규칙 (미래정보 차단)

**`build_quant_stats()`를 전 기간 한 번만 만들어 과거 판단에 적용하면 미래정보 유입이다.**
백테스트에서는 각 판단일 T마다 T 이전 데이터로만 표를 다시 만들어야 한다.
새로 추가된 업종 기저율(`_sectorBase`)도 동일하다.
이 규칙을 어기면 성능이 실제보다 좋게 나온다. 코드로 강제할 것.

상세: `gaeo_point_in_time_rules.md`

---

## 6. 다음 세션이 할 일 (우선순위)

1. **PHASE C 착수**: `researchShadow`를 `analyze_auto.py`에 추가.
   Legacy `chief`는 손대지 않는다. 기존 `shadowChief` 패턴을 그대로 확장한다.
   같은 `runTimestamps` 시각에 Legacy와 Research를 동시 저장.
2. Horizon별(5D/20D/60D) 확률과 `maturity` 상태를 함께 기록.
   60D는 산출만 하고 성능은 언급하지 않는다.
3. **다음 평일 장중에 `runTimestamps` 4개 값 실제 저장 확인**
   (현재 `IMPLEMENTED_PENDING_LIVE_VERIFICATION`).
4. 오늘 이후 `researchShadow` 기록은 **읽기 전용 Forward Validation 자료**.
   이걸 보고 튜닝하면 OOS 자격 상실.
5. PHASE D 성능 비교는 Horizon별 Maturity 충족 후.
   **데이터 부족을 이유로 Research 개발 자체를 멈추지는 않는다.**
   단 "Research가 Legacy보다 좋다"는 결론은 금지.

**하지 말 것**: 원인 규명 없이 threshold/weight 조정, Test 결과 보고 Feature 수정,
Production 로직 선반영.

---

## 7. 재현용 스크립트

감사에 쓴 스크립트는 스크래치패드에 있다(저장소 미포함).
필요 시 이 문서의 수치로 재검증하면 된다. 주요 수치는 본문에 모두 인용해 뒀다.
