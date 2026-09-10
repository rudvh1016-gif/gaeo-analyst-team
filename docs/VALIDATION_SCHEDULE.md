# GAEO 검증·확인 시험 일정표 (사람용)

> ⚠️ **자동 생성 문서.** 원본은 `config/validation_schedule.json`이고 `python3 render_validation_schedule.py`가 이 문서를 만든다.
> 손으로 고치면 `test_validation_schedule.py`가 실패한다. 일정을 바꾸려면 JSON을 고치고 다시 생성한다.
> 시간대 Asia/Seoul · 원본 갱신일 2026-09-10 · 실행 기록 `docs/audits/validation_runs/ledger.jsonl` · 결과 `docs/audits/validation_runs/`

## 원칙

- 예정일(dueAt) 전에는 실행하지 않는다(조기 실행 금지). 지났는데 기록이 없으면 다음 점검이 찾아 실행하고 지연 사실을 함께 남긴다.
- 명령은 여기 적힌 allowlist(commands)만 실행한다. JSON·Issue 본문의 임의 셸 문자열은 실행하지 않는다.
- 같은 dedupeKey의 공식 결과는 한 번만 발행한다. 재시도에서 다른 입력으로 같은 공식 결과를 덮지 않는다(원장은 append-only).
- 결과가 INSUFFICIENT면 원본 규칙(onInsufficient)이 정한 다음 확인 시점만 정한다. 유리한 날이 나올 때까지 매일 재평가하지 않는다.
- 산식·Constitution·테스트 기준을 자동으로 바꾸지 않는다. 후속 조치 중 코드 변경이 필요한 것은 followup 명세로 남겨 사람/개발 AI가 이어받는다.
- 실행 기록에는 평가 기준일(cutoffDate)과 실제 실행 시각을 따로 남기고, 입력 파일 SHA-256·main 커밋 SHA를 함께 남긴다.
- 계획 모드(--apply 없음)는 아무 명령도 실행하지 않는다(외부 호출 0·파일 쓰기 0). 미래 시각 리허설은 합성 입력을 둔 임시 루트에서만.
- 확인 시험(CONFIRMATION·SAMPLE_CHECK)은 표본 수만 센다(prereg_sample_count). 확정 평가 명령이 들어 있으면 실행기 구조 가드가 실행 자체를 막는다.
- 결과 JSON 이 없거나 필수 필드가 빠지면 exit 0 이어도 FAILED. 확정 평가는 입력 동결이 필수이고 공식 판정은 동결 입력에서 계산한다(CLI 결과와 핵심 통계 대조).
- 저장(push)에 실패해도 공식 결과는 버리지 않는다: 같은 커밋을 validation-inbox-<run> 브랜치에 보존하고 다음 실행이 회수한다(재채점 0). 실행기 크래시도 FAILED 로 기록한다.

## 일정

| ID | 종류 | 예정(KST) | 기준일 | 실행 단계 | 최소 표본 | 자동 후속 | 마지막 기록 |
|---|---|---|---|---|---|---|---|
| `VS-20260907-MONDAY-RUNNER-HEALTH` | PAST_CHECK | 2026-09-07 17:00 | 2026-09-07 | (없음) | - | - | 과거 완료 |
| `VS-20260915-DIANA-SHRINKAGE-CHECK` | CONFIRMATION | 2026-09-15 17:00 | 2026-09-15 | `honesty_contract_tests`, `team_weights_transition_check`, `prereg_sample_count` | - | RECORD_AND_REPAIR_REQUEST_ON_ANOMALY | 기록 없음(미도래 또는 미실행) |
| `VS-20260923-FLOW-READINESS-PREREG-SAMPLE` | SAMPLE_CHECK | 2026-09-23 17:00 | 2026-09-23 | `flow_validation_readiness`, `prereg_sample_count`, `dart_financials_readiness`, `honesty_contract_tests` | uniqueAutoDecisionDays≥20, regimeKinds≥3, daysPerRegime≥4 | RECORD_ONLY | 기록 없음(미도래 또는 미실행) |
| `VS-20261019-PREREG-BUY-EVAL` | EVALUATION | 2026-10-19 17:00 | 2026-10-19 | `prereg_contract_tests`, `prereg_evaluate` | decisionDays≥20 | RECORD_AND_WRITE_FOLLOWUP_SPEC | 기록 없음(미도래 또는 미실행) |
| `VS-20261116-PREREG-H1-RECONFIRM` | RECONFIRMATION | 2026-11-16 17:00 | 2026-11-16 | `prereg_contract_tests`, `prereg_evaluate` | decisionDays≥40 | RECORD_AND_WRITE_FOLLOWUP_SPEC | 기록 없음(미도래 또는 미실행) |

## 일정별 상세

### `VS-20260907-MONDAY-RUNNER-HEALTH` — 월요일 러너 첫 가동 뒤 건강검진

- 예정: 2026-09-07T17:00:00+09:00 · 기준일(cutoff): 2026-09-07 · 조기 실행 금지: True
- 상태: PAST_COMPLETED
- 근거: PR #520 병합 메시지 '월요일 러너 건강검진 전 항목 정상' (2026-09-07). Claude 일회성 Routine trig_0194BTtAr4D4UkHDa5a5Ebwx는 발화 후 목록에서 사라짐(2026-09-10 조회).
- 메모: 과거 시험. 새 시험처럼 재실행하지 않는다.

### `VS-20260915-DIANA-SHRINKAGE-CHECK` — DIANA 20거래일 채점 시작(2026-09-14) 뒤 첫 확인 — 판단일 단위 가중치 축소가 실제로 적용됐는가

- 예정: 2026-09-15T17:00:00+09:00 · 기준일(cutoff): 2026-09-15 · 조기 실행 금지: True
- 입력 동결: 실행 시점 main의 team_weights.js·history.js·analysis_data.json. SHA-256과 main 커밋 SHA를 결과에 기록한다. 직전 커밋 비교는 git 이력(2026-09-11~09-14 team_weights.js)으로 한다. (입력: team_weights.js, history.js, analysis_data.json)
- 원본 정책: `docs/gaeo_validation_policy.md#14`, `docs/PREREGISTRATION_BUY_FILTERS_20260905.md`, `docs/audits/weight_shrinkage_switch_20260905.md`
- 확인 항목:
  - team_weights.js method가 role-prior-bayesian-shrinkage-v4-decision-day-market-relative 이고 WEIGHT_SHRINKAGE_UNIT=decision_day
  - DIANA 가중치의 하루 이동폭 ≤ 1.5% (판단일 단위). 5% 초과면 수리 요청서
  - prereg_sample_count: buyFeatureUnrecorded == 0 (0이 아니면 러너의 overheat 기록 누락 → 수리 요청서). 표본 수만 센다 — 판단일이 20일을 넘어도 효과·판정을 내지 않는다(확정 평가는 10/19)
- 표본 부족 시: {"rule": "report_only"}
- 이상 규칙(ANOMALY + 수리 요청서): `team_weights_anomaly`, `buy_feature_unrecorded`
- 후속 범위: 이 시험은 이미 적용된 동작의 확인이다. 새 가중치 최적화가 아니다. 산식·임계값·사전비중은 바꾸지 않는다.
- 기존 Claude 예약: `trig_016K7aG2LNfyo6mK4APHnTeK` (세션 session_01Ng1xLMndUQQiSYMcjHY4TJ) · 이관 상태 PENDING

### `VS-20260923-FLOW-READINESS-PREREG-SAMPLE` — 수급(FLOW) 산식 검증 표본 조건 점검 + BUY 사전등록 표본 수 점검 + 재무자료 준비도

- 예정: 2026-09-23T17:00:00+09:00 · 기준일(cutoff): 2026-09-23 · 조기 실행 금지: True
- 입력 동결: 실행 시점 main. history.js·analysis_data.json·flow_history/*.json SHA-256과 main 커밋 SHA 기록. (입력: history.js, analysis_data.json, flow_history/index.json, team_weights.js)
- 원본 정책: `docs/gaeo_validation_policy.md#13`, `docs/PREREGISTRATION_BUY_FILTERS_20260905.md#5`, `docs/FLOW_SCORING_DESIGN.md`
- 확인 항목:
  - prereg_sample_count는 표본 수 확인만 한다(collect_rows). 20일 미달이 정상이고, 실행이 늦어져 20일이 차더라도 효과를 계산하지 않는다(훔쳐보기 금지 — 실행기 구조 가드가 prereg_evaluate 를 막는다).
  - buyFeatureUnrecorded == 0
  - FLOW 6-arm 채점 비교는 정의가 코드로 확정되지 않아(아래 definitionGaps) 자동 실행하지 않는다. 표본 조건 충족 여부만 보고한다.
- ⚠️ 정의 미완료(자동 실행하지 않는 부분):
  - arm B1·B2·C1·R의 점수 → FLOW 방향 판정(bull/bear 문턱) 매핑이 문서에 없다(현행 stance_of 58/43을 그대로 쓸지 미확정).
  - '거래대금 5분위 안에서도 이겨야 한다'의 판정 통계량(분위별 Holm 포함 여부)이 미확정.
  - 시장국면 3종의 정의 출처(compute_model_intelligence.build_market_regimes의 trend×vol 4종 중 어떤 3종인지) 미확정.
  - flow_history 공통 날짜 밖 A0 표본 처리 규칙(공통 날짜로만 제한)은 문서에 있으나 A0 재계산 코드가 없다.
- 표본 부족 시: {"rule": "report_and_wait", "note": "표본이 부족하면 검증하지 않는다. 표본이 찰 것으로 보이는 날짜를 다음 확인 시점으로 기록하고, 그 재확인의 기준일(cutoffDate)은 미리 적어 둔 그 날짜다(유리한 날을 고르지 않는다).", "cutoffAdvances": true}
- 이상 규칙(ANOMALY + 수리 요청서): `buy_feature_unrecorded`
- 후속 범위: 6-arm 채점(A0·N·B1·B2·C1·R, 5판단일 블록 부트스트랩·Holm)은 정의 확정 뒤 별도 코드로 등록한다. 결과를 보고 산식을 고르는 것은 이 시험 범위 밖이며 새 등록이 필요하다.
- 기존 Claude 예약: `trig_015MuVabAYTLDXistNBJ8wE4` (세션 새 세션 생성형) · 이관 상태 PENDING

### `VS-20261019-PREREG-BUY-EVAL` — BUY 필터 사전등록 확정 평가 (H0_crash·H0_mean·H1_crash·H2_crash)

- 예정: 2026-10-19T17:00:00+09:00 · 기준일(cutoff): 2026-10-19 · 조기 실행 금지: True
- 입력 동결: 평가 기준일(cutoffDate) 이후에 익은 판단은 --as-of가 제외한다. 실행 시점 main의 history.js·analysis_data.json SHA-256과 main 커밋 SHA를 기록하고, 창 안 행의 동결 추출본을 함께 저장한다(구간 5·7). 동결은 필수다: 동결에 실패하면 FAILED 로 기록하고 공식 결과를 내지 않는다. 공식 판정은 동결 추출본에서 실행기가 직접 계산하며, CLI 단계 결과는 대조용이다(핵심 통계가 다르면 FAILED). (입력: history.js, analysis_data.json, krx_calendar.py, evaluate_preregistered_buy_filters.py)
- 원본 정책: `docs/PREREGISTRATION_BUY_FILTERS_20260905.md`, `docs/gaeo_validation_policy.md#13`
- 확인 항목:
  - test_prereg_buy_filters 통과가 먼저다. 실패하면 평가하지 않는다(테스트 완화 금지).
  - 판정은 등록 문서 §3 표의 판정 코드 그대로 기록한다. 20~39판단일의 H1 PASS는 PASS_PROVISIONAL(기록만).
- 표본 부족 시: {"rule": "recheck", "everyDays": 7, "maxRechecks": 3, "note": "익은 판단일 20일 미만이면 결론 없이 표본 수만 기록하고 7일 뒤 다시 확인한다(등록 문서 §5). 재확인의 기준일은 직전 기록에 미리 적어 둔 nextCheckAt 날짜로 전진한다(고정 기준일이면 표본이 영원히 크지 않는다). 재확인마다 recheckId(<scheduleId>-R<n>)와 기준일을 결과·원장에 남긴다.", "cutoffAdvances": true}
- 후속 범위: §3 표의 후속 조치 중 코드 변경(H2 표시 추가·경고 제거·산식 변경)은 자동 실행하지 않는다. 결과 JSON과 followup 명세를 남기고 개발 AI/사람 세션이 §3 표에 적힌 것만 그대로 적용한다. 산식 변경(H1)은 40판단일 재확인 뒤에만.
- 기존 Claude 예약: `trig_015gDtdaSXyuJnnU76PYcdDA` (세션 session_01Ng1xLMndUQQiSYMcjHY4TJ) · 이관 상태 PENDING

### `VS-20261116-PREREG-H1-RECONFIRM` — H1_crash 40판단일 재확인 (산식 변경 적용 여부)

- 예정: 2026-11-16T17:00:00+09:00 · 기준일(cutoff): 2026-11-16 · 조기 실행 금지: True
- 입력 동결: 10/19와 같은 방법. 10/19 결과 JSON을 함께 참조한다. 동결은 필수다: 동결에 실패하면 FAILED 로 기록하고 공식 결과를 내지 않는다. 공식 판정은 동결 추출본에서 실행기가 직접 계산하며, CLI 단계 결과는 대조용이다(핵심 통계가 다르면 FAILED). (입력: history.js, analysis_data.json, krx_calendar.py, evaluate_preregistered_buy_filters.py)
- 원본 정책: `docs/PREREGISTRATION_BUY_FILTERS_20260905.md#10`, `docs/gaeo_validation_policy.md#13`
- 확인 항목:
  - decisionDays ≥ 40 이고 H1_crash == PASS 일 때만 산식 변경 후속(급등 BUY→HOLD)이 §3 표에 따라 적용 대상이 된다. 그 적용은 코드 변경이므로 followup 명세로 넘긴다.
  - decisionDays < 40이면 PASS_PROVISIONAL이 그대로 나온다 → INSUFFICIENT 취급, 7일 뒤 재확인.
- 표본 부족 시: {"rule": "recheck", "everyDays": 7, "maxRechecks": 3, "cutoffAdvances": true, "note": "재확인의 기준일은 직전 기록에 미리 적어 둔 nextCheckAt 날짜로 전진한다(고정 기준일이면 표본이 영원히 크지 않는다). 재확인마다 recheckId(<scheduleId>-R<n>)와 기준일을 결과·원장에 남긴다."}
- 후속 범위: 10/19 평가와 11/16 재확인은 서로 다른 시험이다. 10/19의 PASS_PROVISIONAL을 산식 변경 승인으로 읽지 않는다.
- 기존 Claude 예약: `trig_018TwrTbybyiLUdjr4gUHzm8` (세션 session_01Ng1xLMndUQQiSYMcjHY4TJ) · 이관 상태 PENDING

## 실행 명령 allowlist

| 이름 | 명령 | 상태 | 설명 |
|---|---|---|---|
| `prereg_contract_tests` | `python3 -m unittest test_prereg_buy_filters -q` | available | 사전등록 상수·절차가 깨지지 않았는지 계약 테스트 |
| `prereg_evaluate` | `python3 evaluate_preregistered_buy_filters.py --as-of {cutoffDate} --json` | available | 사전등록 BUY 필터 확정 평가(10/19·11/16 전용). 판단일 20일 미만이면 스크립트가 효과 크기를 내지 않고 표본 수만 낸다(INSUFFICIENT). 확인 시험(9/15·9/23)에는 넣지 않는다 — 실행기 구조 가드가 막는다(2026-09-10 구간 C). |
| `prereg_sample_count` | `python3 prereg_sample_count.py --as-of {cutoffDate} --json` | available | 사전등록 BUY 필터 검증의 표본 수만 센다(collect_rows 만 호출 — 효과 크기·부트스트랩·판정 0). 9/15·9/23 확인 시험 전용. 실행이 늦어져 판단일이 20일을 넘어도 판정을 내지 않는다(훔쳐보기 방지, 2026-09-10 구간 C). |
| `honesty_contract_tests` | `python3 -m unittest test_analyst_honesty -q` | available | 가중치 축소(판단일 단위)·기준선 공개 계약 테스트 |
| `team_weights_transition_check` | `python3 check_team_weights_transition.py --json --as-of {cutoffDate}` | available | team_weights.js의 DIANA n·uniqueDecisionDays·가중치와 직전 커밋 대비 하루 이동폭(판단일 단위면 ±1.5% 안)을 숫자로 낸다. 산식은 바꾸지 않는다. |
| `flow_validation_readiness` | `python3 check_flow_validation_readiness.py --json --as-of {cutoffDate}` | available | FLOW 산식 6-arm 검증의 표본 조건(실제 자동 판단일 20일 이상·시장국면 3종 각 4일 이상·flow_history 공통 날짜 수)만 센다. arm 채점 자체는 하지 않는다. |
| `dart_financials_readiness` | `python3 collect_dart_financials.py --readiness` | available | 재무 자료(3개 회계연도) 준비 상태 집계. 수집하지 않고 저장소 파일만 읽는다. |

## 실행기 (GitHub Actions — Claude 세션 없이 돈다)

- 스크립트 `run_validation_schedule.py` · 워크플로 `.github/workflows/ops-daily.yml` · 일정 `5 8 * * 1-5 (UTC) = 평일 17:05 KST(GitHub cron은 지연될 수 있다)` · 예비 발화 `37 8 * * 1-5` · `11 9 * * 1-5`(UTC)
- 중복 방지: 같은 일정은 하루 1회 · 실행 실패 상한 3회 · 표본 부족 재확인 기본 상한 3회
- 사람 확인 필요 상태: ESCALATED(실행 실패 3회) · RECHECK_LIMIT(표본 부족 재확인 상한 소진) — 자동 재시도 중단, 이슈로 보고
- 이상 규칙 `team_weights_anomaly`: team_weights_transition_check 결과 status=ANOMALY(DIANA 하루 이동폭 5% 초과 또는 method/shrinkageUnit 불일치) → ANOMALY + 수리 요청서
- 이상 규칙 `buy_feature_unrecorded`: prereg_evaluate sample.buyFeatureUnrecorded > 0(러너가 BUY에 overheat 특징을 안 남김) → ANOMALY + 수리 요청서
- 재현: `python3 run_validation_schedule.py --replay <inputs.json.gz> --result <result.json>`

## 이 일정표 밖의 운영 Routine (Claude 예약, 2026-09-10 조회)

- `trig_019ZqRJzaM1upVRoQEfGkFzz` gaeo 장중 매시 kickoff 안전망 v6 (`0 0-7 * * 1-5`) — 파이프라인 안전망 ⑤ (pipeline-watchdog.yml이 ⑥). 구간 2에서 코드 감시가 인수한 뒤 중지 검토
- `trig_019pCrEkMQwuqxdEWCnzxZfk` gaeo 매일 코스피·코스닥 시장분석 자동 발행 (평일 16:30 KST) (`30 7 * * 1-5`) — 콘텐츠 발행(LLM 필요). 이 일정표 범위 밖
- `trig_01JiZ2PJFkB65o1XbELP1MeC` gaeo 월요 Strategy 제안 (`0 0 * * 1`) — 제안만. 이 일정표 범위 밖
- `trig_01Af1D2fAUvWgaRamx6wbmKA` gaeo 금요 Health 제안 (`0 0 * * 5`) — 제안만. 구간 2 코드 점검이 대체 가능

