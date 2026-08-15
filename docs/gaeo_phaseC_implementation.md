# PHASE C — Research Shadow Engine 구현 기록

작성 2026-08-15 · 모델 `research_v1.0` · config hash `e37e6cc0cb701171`

이 문서는 **무엇을 만들었는가**만 기록한다.
**성능은 이 문서에서 다루지 않는다.** 성능 판단은 PHASE D 이후, Horizon별 Maturity를
충족한 뒤에만 가능하다(`gaeo_validation_policy.md`).

---

## 0. 전제 — Legacy 불가침

Research Engine은 기존 파이프라인 옆에 **필드 하나를 더 얹기만** 한다.

```
out["stocks"][code] = {
  ... taro, diana, nova, flow,
  "chief":         <Legacy 최종 판단 — 손대지 않음>,
  "shadowChief":   <기존 v3 그림자 — 손대지 않음>,
  "researchShadow": <신규. 화면에 쓰이지 않음>,
}
```

`research_engine` import 실패·`predict()` 예외 모두 try/except로 감싸,
Research가 깨져도 Legacy 500종목 분석은 그대로 완주한다.

---

## 1. 파일

| 파일 | 역할 |
| --- | --- |
| `research_engine.py` (신규 468줄) | Research Shadow Engine 본체 |
| `test_research_engine.py` (신규) | 불변식 테스트 24개 (성능 테스트 아님) |
| `analyze_auto.py` (수정 +29줄) | PIT 통계 생성 + `researchShadow` 필드 추가 |
| `archive_analysis.py` (수정) | `entry["research"]` APPEND-ONLY 기록 |
| `docs/gaeo_phaseB_revisions.md` | 설계 수정 16건(이 문서보다 상위 규범) |
| `docs/gaeo_signal_registry.md` | Feature 등급 재조정 반영 |

---

## 2. VERSION FREEZE

모든 판단에 아래 5개가 함께 저장된다. 이 중 하나라도 바뀌면 **새 버전**이며,
기존 기록과 같은 표본으로 합산하지 않는다.

| 키 | 값 |
| --- | --- |
| `researchModelVersion` | `research_v1.0` |
| `featureVersion` | `features_v1.0` |
| `labelVersion` | `label_v1.0` |
| `configHash` | `e37e6cc0cb701171` (Feature 목록·가중치·경계값 전체의 sha256 앞 16자) |
| `createdAt` / `inputTimestamp` | 판단 생성 시각 / 그 판단이 본 데이터의 시각 |

Feature·Weight·Threshold를 바꾸면 `research_v1.1` 또는 `v2.0`으로 올린다.
**성능 결과를 본 뒤 v1.0의 숫자를 고치는 것은 금지**다.

---

## 3. Point-in-Time (미래정보 차단)

`build_pit_quant_stats(analysis_data, asof_date, horizon)`는
**결과일(end date)이 `asof_date`보다 앞선 창(window)만** 집계한다.

실측 확인:

| asof | 표본 n | 마지막 결과일 |
| --- | --- | --- |
| 2026-07-01 | 85,617 | 2026-06-30 |
| 2026-08-14 | 101,117 | 2026-08-13 |

- 시점이 이를수록 표본이 작다 → Expanding Window가 실제로 동작한다.
- 마지막 결과일이 항상 asof보다 앞선다 → 미래 결과가 섞이지 않았다.
- 판단마다 `quantStatsAsof`를 함께 저장한다.

Legacy의 `build_quant_stats()`는 여전히 전 기간 1회 생성이다.
**Legacy를 손대지 않는다**는 규칙 때문이며, Research 경로만 PIT를 쓴다.

---

## 4. 역할 분리 (설계 수정 8·9·10·11 반영)

| 구성요소 | 점수 생성 | 상태값 |
| --- | --- | --- |
| TARO | O (Horizon별 Feature 분리) | — |
| DIANA | 부분 | `DIANA_RESEARCH_PARTIAL` / `VALUE_ONLY_DIANA` |
| FLOW | O | — |
| ROTATION | X | `INDUSTRY_CONTEXT_LAYER` |
| EVENT | X | `EVENT_NOT_IMPLEMENTED` |
| QUANT | **X** | `STATISTICAL_REFEREE`, `producesScore: false` |
| RISK | X(게이트) | `NORMAL` / `ELEVATED_RISK` / `HIGH_RISK` / `JUDGMENT_WITHHELD` |

### 없는 정보를 중립으로 채우지 않는다

- EVENT는 미구현이므로 **50점을 주지 않는다.** `score` 키 자체가 없다.
  CHIEF 후보의 `usedAnalysts`에도 들어가지 않는다.
- DIANA는 PER/PBR/ROE만 있고 `grossProfitability`·`operatingProfitability`·
  `assetGrowth`·`accruals`·`leverage`는 `missing`에 남는다. **0점 처리하지 않는다.**
  PER/PBR/ROE까지 전부 없으면 점수가 `null`, 상태는 `NOT_AVAILABLE`이다.
- RISK의 `financialDistress`·`eventRisk`는 측정 불가이므로 `NOT_AVAILABLE`이다.
  **없는 위험정보를 "위험 없음"으로 바꾸지 않는다.**

### QUANT 29%는 재배분하지 않았다

Legacy 가중치(taro .28 / diana .12 / nova .29 / flow .31)에서 nova(=QUANT) 몫을
남은 셋에 비례 배분하는 방식은 쓰지 않았다. CHIEF는 후보를 **병렬로** 만든다.

| 후보 | 내용 |
| --- | --- |
| `MODEL_B_equalWeight` | 점수가 있는 분석가만 균등 평균 |
| `MODEL_C_preDeclared` | 사전 선언 taro .45 / flow .35 / diana .20 |
| `MODEL_D_metaModel` | `NOT_BUILT_INSUFFICIENT_DATA` (표본 부족) |

`MODEL_C` 가중치는 **결과를 보기 전에** 선언했고 `configHash`에 묶여 있다.

---

## 5. Horizon 분리

같은 점수를 5D·20D·60D에 재사용하지 않는다. TARO Feature가 지평별로 다르다.

| 지평 | 사용 Feature |
| --- | --- |
| 5D | `ma5Gap`, `ret5`(**부호 반전** — 단기 반전), `rsi14`, `macdHist`, `volRatio` |
| 20D | `ma20Gap`, `ma60Gap`, `cross20_60`, `pos52w`, `macdHist` |
| 60D | `ma120Gap`, `ma200Gap`, `pos52w` |

단기 반전과 중기 추세를 한 점수에서 상쇄시키지 않기 위한 분리다.

모든 판단은 생성 시점에 세 지평 모두
`maturity: PENDING_NOT_MATURED`, `performanceStatus: PERFORMANCE_NOT_YET_MATURED`,
`probabilityCalibrated: false`로 저장된다.
**60D는 현재 기록만으로 어떤 성능 결론도 내리지 않는다.**

`probability`는 캘리브레이션 전이므로 **확률로 읽으면 안 되는 내부 점수**다.
`reliability.grade`(A~F)는 "입력 데이터가 얼마나 갖춰졌는가"이며 확률과 별개다.

---

## 6. RISK Hard Gate

`stale` 시세, 가격 없음 등 판단 불가 조건이면 `hardGate: true`,
상태는 `JUDGMENT_WITHHELD`이고 세 지평 모두 `primaryAction`이 `JUDGMENT_WITHHELD`가 된다.
**점수가 아무리 높아도 CHIEF가 이걸 뒤집을 수 없다**(테스트로 강제).

---

## 7. APPEND-ONLY 기록

`archive_analysis.py`가 `history.js`의 해당 항목에 `research` 블록을 붙인다.

```json
"research": {
  "modelVersion": "research_v1.0", "configHash": "e37e6cc0cb701171",
  "createdAt": "...", "inputTimestamp": "...", "quantStatsAsof": "2026-08-14",
  "reliability": "B", "riskState": "HIGH_RISK", "riskHardGate": false,
  "horizons": { "5": {...}, "20": {...}, "60": {...} },
  "source": "live_shadow_oos"
}
```

- `source`는 항상 `live_shadow_oos`다. 과거 백테스트(`historical_backtest`)와 **절대 섞지 않는다.**
- 지난 날짜 기록은 다시 계산해 덮어쓰지 않는다.
  이 작업 중 **위반 1건을 발견해 고쳤다**: 2026-08-14에 추가한 QUANT 업종 필드가
  값이 없을 때도 키를 만들어, 과거 정밀분석 기록 19건에 `null` 키를 새로 박고 있었다.
  값이 있을 때만 넣도록 수정했고, 재실행 후 과거 기록 변경 0건을 확인했다.

---

## 8. 회귀 검증 결과 (2026-08-15)

같은 입력으로 `analyze_auto.py`를 두 번 돌려 비교했다.
A = Research 포함, B = `research_engine.py`를 숨겨 Legacy만 실행.

| 항목 | 결과 |
| --- | --- |
| Legacy 출력 전체(researchShadow 제외) A == B | **동일** |
| `chief` 500종목 전부 | **동일** |
| `taro` / `diana` / `nova` / `flow` / `shadowChief` | **각각 동일** |
| `marketInsight` / `crossStats` | **동일** |
| 커밋된 `auto_analysis.js`와 종목별 전 필드 대조 | **차이 0** (다른 값은 `generatedAt` 뿐) |
| 종목 수 | 500 / 500 |
| `researchShadow` 생성 | 500 / 500, `predict` 실패 0건 |
| `team_weights.js` 재계산 | **동일** (채점 25,262건, taro 28/diana 12/nova 29/flow 31) |
| `model_intelligence.js` 재계산 | **동일** (train 8,571 / test 5,515 / shadow) |
| JSON 파싱 (`node`, `LIVE_AUTO`) | 정상 500종목 |
| NaN / Infinity / 비유한 float | **0건** |
| 과거 날짜 history 기록 변경 | **0건** |
| 사이트 스모크(PC·모바일, 8개 모드) | JS 예외 0 · 가로 넘침 0px |
| 불변식 테스트 | **24개 전부 통과** |

### 상태 분포 (500종목, 참고용 — 성능 아님)

- RISK: `ELEVATED_RISK` 248 / `HIGH_RISK` 167 / `NORMAL` 85
- 5D: HOLD_WATCH 367 / WATCH 107 / BUY_CONSIDER 17 / SELL_CONSIDER 9
- 20D: HOLD_WATCH 286 / WATCH 126 / BUY_CONSIDER 60 / SELL_CONSIDER 28
- 60D: HOLD_WATCH 227 / SELL_CONSIDER 144 / WATCH 96 / BUY_CONSIDER 33
- Maturity: 세 지평 500건 전부 `PENDING_NOT_MATURED`
- DIANA 500건 전부 `DIANA_RESEARCH_PARTIAL`, EVENT 500건 전부 `EVENT_NOT_IMPLEMENTED`
- `reliability` 500건 전부 B — 500종목의 데이터 보유 형태가 동일해서다.
  현재 이 등급은 종목을 구분하지 못한다. DART 연동 전까지는 변별력이 없다(알려진 한계).

---

## 9. 불변식 테스트 24개

`python3 test_research_engine.py` — 성능이 아니라 **규칙 준수**만 검사한다.

| 그룹 | 검사 내용 |
| --- | --- |
| `VersionFreeze` | 버전 4종 저장, config hash 안정, 타임스탬프 보존 |
| `PointInTime` | `quantStatsAsof` 기록, asof 이후 결과 미포함, Expanding Window |
| `QuantIsReferee` | QUANT `score` 키 부재, 심판 역할, 29% 재배분 안 함 |
| `MissingIsNotNeutral` | EVENT 중립 아님, DIANA 결측 0점 아님, RISK 결측 안전 아님 |
| `RiskHardGate` | stale/가격없음 → `JUDGMENT_WITHHELD`, CHIEF가 못 뒤집음 |
| `HorizonMaturity` | 3지평 존재, 전부 PENDING, 미캘리브레이션 표시, Feature 분리 |
| `ChiefCandidates` | 병렬 후보 존재, 입력 없으면 ABSTAIN, 신뢰도≠확률 |
| `NoNullLeaks` | JSON 직렬화 가능, NaN/Inf 없음, US 검증 `NOT_AVAILABLE` |

---

## 10. 하지 않은 것 (명시)

- Production 판단 교체 — 하지 않았다. 화면은 여전히 Legacy만 본다.
- Threshold / Weight 튜닝 — 하지 않았다.
- 미국 데이터 교차검증 — `usValidation: "US_VALIDATION_NOT_AVAILABLE"`.
- EVENT(DART/공시) 연동 — 미구현. API Key는 저장소·클라이언트·로그 어디에도 없다.
- 성능 비교 — Maturity 미충족. PHASE D 이후.
- `runTimestamps` 실물 확인 — 여전히 `IMPLEMENTED_PENDING_LIVE_VERIFICATION`
  (다음 평일 장중 러너 실행 후 확인).

---

## 11. 결론

Research Shadow Engine은 구현되었지만,
현재 Research가 Legacy보다 정확하다는 결론은 아직 내릴 수 없다.
