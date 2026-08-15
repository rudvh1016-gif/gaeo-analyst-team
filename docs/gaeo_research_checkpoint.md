# GAEO RESEARCH V2 — 마스터 체크포인트

**다음 세션은 이 파일을 가장 먼저 읽는다.** (토큰 절약 원칙, 스펙 3번)

최종 갱신 2026-08-15 · 현재 위치 **PHASE A 완료 / PHASE B 미착수**

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

### 잠재 버그 1건 (미수정, 우선순위 낮음)

`evalClose()`가 `flatMap` 후 날짜 정렬을 안 함.
`flatCloses()`와 AGENTS.md 주의 2번은 정렬을 요구.
**실측 결과 502종목 전부 순서 정상이라 현재는 발현되지 않음.**
SELL 9.1%와 무관. 페이지 생성 방식이 바뀌면 위험.

---

## 2. **가장 큰 제약: 판단 기록이 6.5주뿐**

`history.js` = 2026-07-01 ~ 2026-08-14, 거래일 약 31일.

| 요구 | 필요 | 현재 | 판정 |
|---|---|---|---|
| Walk-Forward 검증일 | 40거래일+ | 약 31일 | **미달** |
| 국면 다양성 | 3개+ | 3개 | 충족 |
| BUY 표본 | 50+ | 808 | 충족 |
| SELL 표본 | 50+ | 5,799 | 충족 |

**현재 데이터로는 Legacy vs Research의 OOS 우열 판정이 원천적으로 불가능하다.**
게다가 6.5주 중 앞 4주 하락장, 뒤 2주 급등장으로 국면이 크게 치우쳐 있다.

이것은 모델 문제가 아니라 시간 문제다. 데이터가 쌓여야 한다.
이 사실을 숨기고 "개선됐다"고 선언하면 스펙 위반이다.

---

## 3. PHASE 진행 상태

| PHASE | 내용 | 상태 |
|---|---|---|
| **A** | DATA / BUG / LABEL / LOOK-AHEAD 감사 | **완료** |
| B | LOCKED PAPER 기반 Candidate Feature 설계 | 미착수 |
| C | Research Engine 구현(Legacy 분리) | 미착수 |
| D | Walk-Forward OOS | **데이터 부족으로 착수 불가** |
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
| `gaeo_verified_references.md` | 미작성 (PHASE B) |
| `gaeo_signal_registry.md` | 미작성 (PHASE B) |
| `gaeo_taro_research.md` | 미작성 (PHASE B) |
| `gaeo_diana_research.md` | 미작성 (PHASE B) |
| `gaeo_flow_research.md` | 미작성 (PHASE B) |
| `gaeo_rotation_research.md` | 미작성 (PHASE B) |
| `gaeo_event_pipeline.md` | 미작성 (PHASE C) |
| `gaeo_quant_research.md` | 미작성 (PHASE B) |
| `gaeo_risk_research.md` | 미작성 (PHASE B) |
| `gaeo_chief_research.md` | 미작성 (PHASE B) |
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

1. **PHASE B 착수**: LOCKED PAPER PACK과 실제 데이터 가용성 대조.
   각 Candidate를 CAN_IMPLEMENT_NOW / NEEDS_NEW_DATA / NOT_SUITABLE로 분류.
2. `gaeo_signal_registry.md` 생성(Feature Registry 스켈레톤).
3. 중복정보 검사 착수: MA / MACD / Momentum / 52W High 상관 및 Ablation 설계.
4. 라벨을 시장 초과수익 기준으로 재정의하는 RESEARCH_LABEL 설계
   (delta는 TRAIN/VALIDATION에서만 결정).
5. PHASE D는 판단 기록이 40거래일을 넘길 때까지 대기.

**하지 말 것**: 원인 규명 없이 threshold/weight 조정, Test 결과 보고 Feature 수정,
Production 로직 선반영.

---

## 7. 재현용 스크립트

감사에 쓴 스크립트는 스크래치패드에 있다(저장소 미포함).
필요 시 이 문서의 수치로 재검증하면 된다. 주요 수치는 본문에 모두 인용해 뒀다.
