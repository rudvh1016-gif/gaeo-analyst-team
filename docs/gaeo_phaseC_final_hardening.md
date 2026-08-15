# PHASE C FINAL HARDENING

작성 2026-08-15 · Live Shadow 데이터를 쌓기 **직전에** 방법론 오류를 바로잡은 기록

> 이번 수정은 결과를 보고 한 튜닝이 아니다.
> Research Prediction의 미래결과가 **하나도 성숙하지 않은 상태**에서,
> 설계상의 오류와 불명확성을 고친 것이다.

`research_v1.0`은 이미 배포된 Candidate이므로 **한 글자도 고치지 않았다.**
교정된 설계는 `research_v1.1`이라는 새 버전으로 만들었고, 두 버전은 매 사이클
동시에 예측을 내며 앞으로 **각각 따로** 성능을 측정한다.

| 버전 | config hash | 성격 |
| --- | --- | --- |
| `research_v1.0` | `e37e6cc0cb701171` | 최초 Shadow Candidate (그대로 보존) |
| `research_v1.1` | `0d8ff5f0909e7b7b` | 이번 방법론 Hardening 적용 Candidate |

---

## 1. 5D를 `-net5`로 확정하지 않는다

**문제.** v1.0은 5D에서 `ret5` 부호를 뒤집어 단기 반전 신호 하나로 확정했다.
"단기 반전이 존재할 수 있다"와 "모든 종목에서 최근 5일 수익률 부호를 뒤집으면
다음 5일 예측력이 높다"는 전혀 다른 주장인데, 코드가 후자를 기정사실로 삼았다.

**교정.** v1.1은 두 방향을 **분리해서 동시에** 기록한다.

| 모드 | ret5 부호 | 뜻 |
| --- | --- | --- |
| `SHORT_REVERSAL_CANDIDATE` | 음(−) | 최근 많이 오른 종목은 다음 5일에 불리 |
| `SHORT_MOMENTUM_CANDIDATE` | 양(+) | 최근 많이 오른 종목은 다음 5일에 유리 |

- 기본값을 두지 않았다. 모드를 지정하지 않고 호출하면 `TypeError`, 이상한 값을 주면
  `ValueError`가 난다. 코드가 몰래 한쪽을 정답으로 고르지 못하게 하기 위해서다.
- 20D·60D에는 `ret5`가 없으므로 두 모드의 `shortSignalMode`가 `NOT_APPLICABLE`이다.
- **어느 쪽이 맞는지는 지금 고르지 않는다.** 성숙한 결과가 쌓인 뒤 따로 판단한다.

**등록만 하고 만들지 않은 후보.**

```
CONDITIONAL_SHORT_LIQUIDITY_CANDIDATE
  status  : REGISTERED_NOT_IMPLEMENTED
  아이디어 : 거래대금·거래량·회전율 맥락에 따라 반전과 모멘텀을 나눠 쓰는 조건부 신호
  막힌 것  : 회전율(turnover)·유동성 지표가 현재 파이프라인에 없다
```

---

## 2. 45/35/20은 검증된 Weight가 아니다

**교정.**

- 이름을 `MODEL_C_preDeclared` → **`PREDECLARED_CANDIDATE_45_35_20`**으로 바꿨다.
- 각 Candidate에 `status: "PREDECLARED_UNVALIDATED"`, `isRepresentativeModel: false`를 붙였다.
- v1.1에는 **대표 Candidate가 없다.** 출력 최상단은
  `primarySelection: "NO_PRIMARY_CANDIDATE_SELECTED"`이고, `primaryAction` 키 자체가 없다.
  (v1.0에는 `MODEL_C`를 `primaryAction`으로 올리는 코드가 있었다.)
- 이 숫자를 현재 데이터 결과에 맞춰 조정하지 않았다.

---

## 3. Candidate를 전부 같은 시각에 Live 저장

**문제.** v1.0도 코드 안에서는 MODEL_B/C를 병렬로 계산했지만,
영구 기록에는 `MODEL_C`를 고른 결과 하나만 남았다. 그러면 나중에 다른 Candidate의
성적을 보려고 **과거 입력으로 다시 계산**하게 되고, 그건 Live Prediction이 아니다.

**교정.** Candidate 4종(가중 스킴 2 × 단기신호 모드 2)을 전부 같은
`predictionTimestamp`에 산출해 그대로 보존한다.

```
MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE
MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE
PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE
PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE
```

Candidate마다 `candidateModelId` · `predictionTimestamp` · `modelVersion` ·
`featureVersion` · `labelVersion` · `inputTimestamp` · 5D/20D/60D 예측 · `maturity`를 남긴다.
실측: 500종목 × 4 Candidate 전부 `predictionTimestamp` 값이 **1종류**(같은 시각).

`MODEL_D_META_MODEL`은 표본 부족으로 **여전히 만들지 않는다**(`NOT_BUILT_INSUFFICIENT_DATA`).

---

## 4. Reliability는 지금 종목을 구분하지 못한다

500종목 전부 내부 등급이 B다. 즉 이 등급은 현재 **종목 평가가 아니다.**

**교정.**

- 상태를 `RELIABILITY_NOT_DIFFERENTIATED`, 표시 정책을 `uiDisplay: "SUPPRESSED"`로 명시했다.
- 출력에서 `grade`라는 이름을 없애고 `internalGrade`로 바꿨다. UI가 무심코 집어 쓰지 못하게 한다.
- 영구 기록에는 **등급 값을 저장하지 않는다.** 상태 문자열만 남긴다.
- `analyze_auto.py`가 매 사이클 등급 분포를 세서, 한 종류뿐이면 로그에
  "종목 구분 못함(UI 노출 금지)"을 찍는다. 차이가 생겨도 자동으로 켜지 않는다.
- 참고로 Research 출력은 **애초에 화면에 나가지 않는다**(아래 8절).

DART · 재무 신선도 · 이벤트 커버리지 · 결측도 · 표본품질 중 최소 하나가 종목별로
실제 차이를 만들 때 A/B/C 표시를 검토한다.

---

## 5. PIT QUANT — 시작일이 아니라 결과 확정일 기준

**핵심.** 걸러야 할 조건은 `prediction date < asof`가 아니라
**`outcome date < asof`**다. 2026-08-15 시점의 통계가 2026-08-10에 시작된
20일 구간의 결과를 알고 있으면 Look-Ahead다.

**증명.** `build_pit_quant_stats()`는 구간 종료일(`rows[i+horizon]["date"]`)이
`asof`보다 앞선 것만 센다. 시작일은 과거지만 결과가 아직 안 끝난 구간은 제외하고,
그런 구간이 실제로 있었다는 사실을 `latestExcludedStartDate`로 함께 남긴다.
적용한 규칙 이름도 `outcomeMaturityRule: "OUTCOME_DATE_STRICTLY_BEFORE_ASOF"`로 기록한다.

전용 Leakage 테스트(`PitOutcomeMaturity`, 8건):

- asof 2026-03-15 / horizon 20 → 표본 **0건**. 시작일이 03-01이어도 결과일이 03-21이라 제외.
  이때 `latestExcludedStartDate`가 asof보다 앞선다는 것까지 확인한다.
- 성숙한 구간만 있는 asof에서는 표본이 생기고 `lastOutcomeDate < asof`.
- 5D·20D·60D 각각 독립적으로 검사.

**추가 교정.** v1.0은 5D 표 하나를 20D·60D 판단의 메타데이터에도 붙였다.
v1.1은 Horizon마다 표를 따로 만든다. 실측 표본이 실제로 다르다.

| Horizon | PIT 표본 (asof 2026-08-14) |
| --- | --- |
| 5D | 101,117 |
| 20D | 93,617 |
| 60D | 73,618 |

(v1.0의 이 문제는 QUANT가 점수를 내지 않는 심판이라 **점수에는 영향이 없었고**,
메타데이터 표기만 부정확했다. v1.0은 그대로 보존한다.)

---

## 6. APPEND-ONLY 자동검사

개발 중 실제로 위반이 한 번 났으므로(과거 정밀분석 기록 19건에 `null` 키가 새로 박힘)
사람 눈 대신 코드로 고정했다. `append_only_guard.py`.

**동작.** 쓰기 전에 기존 Research 기록의 sha256 지문을 뜨고, 쓰기 직전에 다시 떠서 비교한다.
`value` · `key` · `modelVersion` · `prediction` · `timestamp` 중 하나라도 바뀌면 위반이다.
위반이면 **과거 기록을 원래 값으로 되돌리고** 로그에 크게 찍는다.
새 Prediction append는 그대로 허용한다. 파이프라인을 죽이는 대신 위반 자체를 무효화한다.

**시간 범위.** '어제 이전에 만들어진' Prediction은 무엇도 못 바꾼다.
오늘 만든 Prediction을 장중 재스냅샷하는 것은 허용한다. 그 시점엔 미래 결과를
알 수가 없어 Look-Ahead가 성립하지 않기 때문이다. `createdAt`이 없어 판단이
안 서면 보호하는 쪽으로 처리한다.

**이 검사를 만들다 버그를 하나 더 잡았다.** 처음엔 기록을 `(종목코드, 날짜)`로 키를 만들었는데,
같은 날짜가 두 번 있는 종목에서 두 기록이 하나로 뭉개져 위반을 놓쳤다.
등장 순서를 키에 포함하도록 고쳤고, 중복 날짜 2건을 각각 되돌리는 테스트를 추가했다.

**한계(명시).** 이 가드는 **실행 중 발생하는** 변조를 잡는다.
디스크에 이미 훼손된 상태로 저장된 파일은 비교 기준 자체가 오염되므로 잡지 못한다.

---

## 7. research_v1.0 보존

- `research_engine.py`는 이번 작업에서 수정하지 않았다.
- 테스트가 v1.0의 버전 문자열·config hash·5D `-ret5` 구조·가중치를 못 박아 검사한다
  (`V10Untouched`, 4건). v1.0을 건드리면 테스트가 깨진다.
- v1.0과 v1.1은 매 사이클 동시에 예측을 내고 각각 기록된다.
- 한 버전의 미래결과를 보고 그 버전을 과거로 돌아가 고치지 않는다.

---

## 8. Research 기록을 사이트 자료에서 분리 (이번에 발견한 별건)

**문제.** PHASE C에서 `researchShadow`를 `auto_analysis.js`에 얹었는데, 이 파일은
**브라우저가 실제로 내려받는 자료**다. 화면에 쓰이지도 않는 Shadow 기록 때문에
사용자 트래픽이 늘고 있었다.

| 파일 | 원래 | Research 얹은 뒤 |
| --- | --- | --- |
| `auto_analysis.js` | 2.43 MB | **11.50 MB** (v1.0+v1.1 기준) |
| `history.js` | 8.81 MB | **12.75 MB** |

지연로딩이라 첫 화면은 아니지만, 종목 목록이나 성적표를 여는 순간 내려받는다.
모바일 사용자에게 9 MB를 더 받게 하는 셈이다.

**교정.** Research는 사이트가 읽지 않는 별도 파일로 완전히 뺐다.

| 파일 | 성격 | 커밋 |
| --- | --- | --- |
| `research_shadow.json` (6.2 MB) | 한 사이클짜리 전달 파일 | ✕ (`.gitignore`) |
| `research_history.jsonl` (하루 1.7 MB) | 영구 APPEND-ONLY 기록 | ○ |

- `index.html`의 `GaeoFeatures` 목록에 없으므로 브라우저는 절대 받지 않는다.
- 결과적으로 `auto_analysis.js`는 **2.43 MB로 복귀**했고, `history.js`에는 research 블록이 0개다.
- `research_history.jsonl`은 `HIST_CAP`(80건) 절단을 적용하지 않는다.
  성숙 전에 지우면 전진검증 자료가 사라진다.
- 증가 속도는 **하루 약 1.7 MB(500종목 × 1건), 월 약 37 MB**다.
  Candidate마다 요구된 버전·시각 정보를 그대로 남기기 때문이며, 압축하려면
  중복 메타데이터를 기록 단위로 올려야 한다. 지금은 요구된 형태를 그대로 지켰다.

---

## 9. 테스트 결과 (2026-08-15)

`test_research_engine.py` 24건 + `test_research_v11.py` 50건 = **74건 전부 통과.**

| 확인 항목 | 결과 |
| --- | --- |
| Legacy output 동일 (Research 켬/끔 A/B 대조) | **동일** |
| Legacy output == 커밋된 main 산출물 | **동일** (`marketInsight.generatedAt` 시각만 다름) |
| Legacy training pipeline 동일 | `team_weights.js` · `model_intelligence.js` 재계산 동일 |
| Research candidate 병렬 저장 | 4종 × 500종목, `predictionTimestamp` 1종류 |
| `research_v1.0` 불변 | 버전·hash·구조 테스트로 고정 |
| `research_v1.1` 버전 독립 | 별도 hash `0d8ff5f0909e7b7b` |
| PIT outcome maturity leakage 없음 | 전용 테스트 8건 통과 |
| Append-only history 불변 | 가드 + 테스트 12건, 실제 위반 주입 후 복구 확인 |
| Missing != Neutral | EVENT·DIANA·RISK 상태 유지 |
| Reliability UI 표시 금지 | `SUPPRESSED`, 기록에 등급 값 없음 |
| EVENT 미구현 상태 유지 | `EVENT_NOT_IMPLEMENTED` |
| DIANA partial 상태 유지 | `DIANA_RESEARCH_PARTIAL` / `VALUE_ONLY_DIANA` |
| RISK Hard Gate 유지 | 4 Candidate × 3 Horizon 전부 `JUDGMENT_WITHHELD` |
| 60D performance claim 없음 | 전부 `PERFORMANCE_NOT_YET_MATURED` |
| NaN / Infinity 없음 | 0건 |
| 500종목 정상 | 500/500, predict 실패 0 |
| 사이트 정상 | PC·모바일 8개 모드, JS 예외 0 · 가로 넘침 0px |

---

## 10. 지금 하지 않는 것

- 성능 비교. 성숙한 표본이 **0건**이다.
- 어느 Candidate가 나은지 고르는 일.
- Weight / Threshold 조정.
- v1.0 기록 재작성.

앞으로 할 일은 하나다. **Live Shadow 기록이 실제로 성숙하도록 쌓는다.**

Research Shadow의 미래 예측 기록을 수집할 준비는 되었지만,
어떤 Research Candidate가 Legacy보다 우수한지는 아직 판단할 수 없다.
