# 투자검증 GAP 표 — 무엇이 있고, 무엇이 아직 증명되지 않았나 (2026-09-10 실측)

> 읽는 법: 다섯 칸은 서로 다른 단계다. **코드 있음 ≠ 연결됨 ≠ 기록 있음 ≠ 표본 충분 ≠ 효과 증명.** 앞 칸이 ✔ 라고 뒤 칸이 ✔ 인 것이 아니다.
> 숫자는 2026-09-10 에 아래 명령으로 잰 것이다. 다시 재려면 같은 명령을 돌린다(전부 읽기 전용, LLM 호출 0).
> `python3 evaluate_preregistered_buy_filters.py --json` · `python3 check_flow_validation_readiness.py --json` · `python3 check_team_weights_transition.py --json` ·
> `cat gaeo_evolution/status/evolution_status.json` · `python3 run_validation_schedule.py`
> 이 표를 보고 산식·가중치·임계값·사전등록 상수를 바꾸지 않는다. 바꾸고 싶은 것은 새 등록 제안으로만 적는다.

| 검증 항목 | 코드 있음 | 연결됨(자동 실행·기록 경로) | 기록 있음 | 표본 충분 | 효과 증명 | 다음 관문 |
|---|---|---|---|---|---|---|
| 사전등록 BUY 필터 4가설 (H0_crash·H0_mean·H1_crash·H2_crash) | ✔ `evaluate_preregistered_buy_filters.py`(상수·절차 고정, `test_prereg_buy_filters.py` 10건) | ✔ `ops-daily` → `VS-20261019-PREREG-BUY-EVAL`(10/19) · `VS-20261116-PREREG-H1-RECONFIRM`(11/16), 동결 입력 + `--replay` | ✗ 원장 0건(창 9/7 시작) | ✗ 익은 판단일 **0 / 20**(9/10 기준: 창 안 1,796건이 아직 5거래일 전) | ✗ | 10/19 17:05 자동 실행. 20일 미달이면 INSUFFICIENT 로 7일 뒤 재확인(최대 3회) |
| BUY 실적·기준선 공개(무작위 아닌 같은 날 동일 비중 기준선) | ✔ `buy_warning_evidence.py` · 성적표 | ✔ 파이프라인 산출물 + 화면 | ✔ `docs/audits/buy_warning_20260905.json` | △ 창 밖(9/7 이전) 자료 — 이미 본 자료라 검증이 아니라 **사후 참고 비교** | ✗ (정책 §10 "실력 인증이 아니다") | 사전등록 결과가 첫 독립 근거 |
| DIANA 가중치 축소 단위 = 판단일 (정책 §14) | ✔ `compute_team_weights.py` `WEIGHT_SHRINKAGE_UNIT` · `test_analyst_honesty.py` 27건 | ✔ 파이프라인이 `team_weights.js` 생성(method `…v4-decision-day-market-relative`) · 9/15 확인 `VS-20260915` | ✔ `team_weights.js`(DIANA n=0 · 판단일 0 · `NOT_GRADED_YET`, 가중치 taro .303 / diana .120 / nova .266 / flow .310) | 해당 없음(성과 주장이 아니라 "절벽 방지" 확인) | 해당 없음 | 9/14 채점 시작 → 9/15 17:05 하루 이동폭 ≤1.5% 확인(5% 초과면 ANOMALY + 수리 요청서) |
| 시장 상대 채점(정책 §8) | ✔ | ✔ | ✔ `team_weights.js` | △ 판단일 수 제한(정책 §4·§5 유효표본 주의) | ✗ 표시만("실력 인증 아님") | 표본이 쌓여도 등록 없이는 성과 주장 금지 |
| FLOW(수급) 산식 6-arm 검증 | △ 표본 조건만 `check_flow_validation_readiness.py`. **arm 채점 코드 없음**(A0 재계산·B1/B2/C1/R 방향 문턱·분위 통계량·국면 3종 정의 미확정 — `config` definitionGaps 4건) | ✔ 표본 조건은 `VS-20260923`(9/23) | ✗ | ✗ 공통 날짜 **12 / 20**(익은 자동 판단일 34, flow_history 20일 8/11~9/8), 국면 조건 충족 1종(down_high 4일) / 3종 | ✗ | 공백 없이 쌓이면 10/01 전후 20일. 정의 4건을 코드로 확정하는 **새 등록**이 먼저 |
| Evolution(Failure Miner → 후보 → Shadow → 승격) | ✔ `gaeo_evolution/` · `test_gaeo_evolution.py` 195건 | ✔ `evolution-lab.yml` 주 1회 · 🟢 고정 제목 이슈 1개 | ✔ `gaeo_evolution/status/evolution_status.json`(9/6: mode **BOOTSTRAP_SHADOW**, baseline n 5,975 · 판단일 10 · 국면 4, memory 후보 21 · validated 0) | ✗ 판단일 10 | ✗ 승격 0 · 롤백 0 | Shadow 표본이 Constitution 기준을 넘을 때까지 관찰만 |
| Forward Validation 자료 분리(정책 §6, 8/15 이후 Shadow 는 튜닝 금지) | ✔ `recordSelection: forward_record_only_v2` | ✔ | ✔ | ✗ | ✗ | 자료를 보고 산식을 고치면 OOS 자격 소멸 — 규칙만 지킨다 |
| 음성 대조(negative control) | ✔ **이번 추가** `test_validation_negative_control.py`(특징과 무관한 합성 자료에서 어떤 가설도 PASS 금지 · 효과 0 · 재현성 · 기준 고정) | ✔ `gaeo_check investment-contract` | 해당 없음(합성) | 해당 없음 | 해당 없음 — "검정 기계가 아무 자료에서나 통과를 내지 않는다"만 보장 | 실자료 음성대조(라벨 셔플 등)는 등록에 없으므로 자동 실행하지 않는다 |
| 재현(동결 입력 → 같은 판정) | ✔ `run_validation_schedule.py --replay`(구간 5) | ✔ EVALUATED 결과마다 `.inputs.json.gz` 저장 | ✗ (첫 EVALUATED 는 10/19 이후) | - | - | 첫 실행 뒤 `--replay` 로 확인 |
| 모의투자(PAPER) 성과 | ✔ `paper_engine.py` 등 · 테스트 20여 파일 | △ Windows 러너 단일 writer — **9/2 이후 정지**(원격 이력 재작성 → 러너 clone 공통 조상 상실) | ✔ `paper_trading/`(마지막 사이클 2026-09-01 15:05) | ✗ 8거래일 공백 + 관찰 기간 짧음 | ✗ | 집 PC 재기준(`HOME_PC_CHECKLIST.md`) → 재가동 확인 → 공백은 dataGaps 로 기록(소급 체결 0) |
| 모델 성적표(`model_scoreboard.js`·`scorecard_reports.js`) | ✔ | ✔ 파이프라인 | ✔ (9/9 생성) | △ 60D 는 표본 0(정책 §4·§7 선언 금지) | ✗ 표시만 | 표본 규칙(정책 §2·§3) 그대로 |

## 이번(구간 7)에 한 것 · 하지 않은 것

- 한 것: 위 표 · `test_validation_negative_control.py`(음성 대조 3건 + 기준 고정 4건) · `gaeo_check investment-contract` 묶음에 추가.
- 하지 않은 것: 등록된 테스트·상수·절차 변경 0 · 산식·가중치·임계값 변경 0 · 실자료로 새 효과 계산 0(사전등록 §6 "INSUFFICIENT 인데 다른 방법으로 효과 계산" 금지).
- FLOW 6-arm 의 정의 4건은 **코드로 확정하는 새 등록**이 필요하다. 이번 작업은 표본 조건만 자동화했다.
