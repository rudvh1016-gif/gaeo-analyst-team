# AI-0 성능 운영 연결

기준: main `9ddf31f0`(PR #558). #556의 불변 실제 판단과 #558의 가격 비교·기업행사 채점 보호를 그대로 사용한다. 새 Harness·성적표·전략 엔진이 아니다.

## 시작 시 분류

| 기능 | 상태 |
|---|---|
| gaeo_check / ops_status / Harness / 예정시험 | COMPLETE |
| 실제 판단 원본·5거래일 결과·기존 성적표 연결 (#556) | COMPLETE |
| 기업행사·가격 기준 비교 보호 (#558) | COMPLETE |
| Evolution / Failure Miner / Shadow / Promotion Gate | COMPLETE |
| Pipeline Watchdog 및 허용된 작은 자동복구 | COMPLETE |
| 기존 확신도 표·BUY/SELL/HOLD 연구 성적 | PARTIAL |
| 보호된 실제 결과 기반 확신도·판단범위 검사 | MISSING |
| 여러 장치의 성능 우선순위·문제 수명·연구 대기 통합 | MISSING |
| Evolution 예약·종료·저장·실제 평가를 연결한 생존 감시 | PARTIAL |

## 연결 경로

1. 기존 분석/결과 갱신 → `decision_records.summarize` → `decision_quality.summarize` → 기존 `model_scoreboard.js.decisionTrace.quality`.
2. `ops_status.py` → 운영 상태 + 실제 판단 집계 + Evolution 상태/실행 manifest + Failure Miner → `performance_orchestrator.observe`.
3. main의 기존 `ops-daily`가 `--save-performance-state`로 허용된 운영 기록 경로 `docs/operations/repair_requests/performance_orchestrator.json`에 다음 상태를 저장한다. 기존 커밋·재시도·미전송 회수·artifact 흐름을 재사용한다.
4. 기존 `pipeline-watchdog --apply`만 수집 창/횟수 제한 안에서 복구한다. 추가된 receipt는 취소·재기동 요청 성공과 산출물 복구를 구별하며 같은 실행의 운영 요약으로 전달한다. 요청 성공을 복구 완료로 기록하지 않는다. 다음 관찰에서 정상 산출물을 확인해야 문제를 해결 상태로 바꾼다.
5. 기존 `run_evolution_lab`도 같은 `research_focus`를 호출해 연구 필요 근거를 기록한다. 후보 생성/연구 분리/Shadow/Gate/Production 승인 조건은 그대로다. 새 실행부터 입력 지문·GitHub run ID·Failure Miner/상태/평가의 연결 지문을 남긴다.

공개 성적표는 저장 원본과 보호된 결과만 읽는다. `build_model_scoreboard.py --quality-observation-only`는 기존 원본·결과·성적표의 내용 연결을 먼저 확인한 뒤 관찰 필드만 더한다. 가격 재수집, 결과 재채점, 원본 재작성은 하지 않는다.

## 측정과 해석 경계

- 같은 종목·판단일은 기존 `daily_records` 선택을 따른다. 모델/설정/채점/종목 범위가 다르면 섞지 않는다. 누락된 버전은 `unrecorded`로 남긴다.
- 0~100점의 실제 분포(도입 시 종합 34~71, 확신도 30~86)를 보고 0~39/40대/50대/60대/70대/80대/90~100/미기록 구간을 사용한다. BUY와 SELL을 별도로 집계한다. 낮은 SELL 종합점수는 낮은 확신이 아니다. 점수는 확률이 아니다.
- 평가 완료된 보호 결과만 사용한다. 적중률 분모는 hit+miss, 최소 **20개 채점 판단일**은 기존 성적표 정책 그대로다. 부족한 구간의 적중률은 null이다. 건수와 판단일 수를 모두 공개한다. 기존 5일 날짜 블록 bootstrap 참고 구간을 재사용하며 실력 인증·다중비교 검증으로 부르지 않는다.
- HOLD는 실제 판단이다. 당시 `judgmentWithheld`/`JUDGMENT_WITHHELD`만 판단보류로 센다. 과거 필드 누락 HOLD는 바꾸지 않는다. 결과 자료 부족은 판단보류와 별도다.
- 최근 **한 회차**의 실제 판단 수/당시 Coverage Version 모집단 크기로 판단 가능 비율을 계산한다. 누락/미확인 종류/판단보류도 각각 남긴다. 과거 회차의 종목을 섞어서 600개를 채우지 않는다. 버전이 없으면 전체 비율은 확인 불가다.
- 실제 원본에 보존되지 않은 과거 업종·시장국면을 오늘 기준으로 채우지 않는다. 그 항목은 기존 Evolution의 연구 참고 자료만 이용하고 공개 실제 정확도와 분리한다.
- 최근 성적 변화는 각 20개 판단일의 이전/최근 관찰값을 받을 자리만 둔다. 부족하면 `INSUFFICIENT_EVIDENCE`. 항상 `SHADOW_ONLY`; ADWIN·전략 변경은 없다.

## 우선순위·문제 수명

무결성/필수 자료 → 판단·결과 저장 → 높은 확신 반복오답 → 충분한 BUY/SELL/HOLD 반복 문제 → 연구 진행 순이다. 그 안에서는 검증된 실제 결과, 서로 다른 판단일, 영향 건수, 안정된 ID 순으로 결정한다. 현재 처리 가능 여부를 먼저 구분하며 미래 결과 대기는 실행할 일 1위가 아니다.

문제 ID는 원인 코드+범위의 해시다. `firstSeenAt`, `lastConfirmedAt`, `evidenceObservations`, `state`, `resolvedAt`, `reopenCount`를 저장한다. 같은 증거를 다시 읽으면 반복 횟수를 부풀리지 않는다. 해결된 문제는 같은 ID로 남고 새 증거가 있을 때만 재개한다. 입력 소실이나 상위 20개 실패 목록에서의 누락을 해결로 추정하지 않는다. 손상된 문제 이력은 덮어쓰지 않는다.

`ACTIONABLE` / `WAITING_EVIDENCE` / `BLOCKED` / `RESOLVED`를 구분한다. 운영 장애·필수 파일 오류는 미래 대기로 숨기지 않는다. 전체 상태는 발전/자료 대기/현재 문제/정체/실제 장애 및 확인 불가를 구별한다. Constitution에 정체 기준이 없으므로 임의의 며칠/몇 회 기준을 만들지 않고, 정상 연구 가능 회차의 무진전 횟수만 관찰한다. 후보 0개는 장애가 아니다.

연구 추천은 기존 Failure Miner의 최소 **8건·5판단일**과 Constitution 연구10일+평가20일의 분리 조건을 함께 충족해야 한다. 무결성 장애가 있으면 연구 추천을 막는다. 불변 실제 결과와 기존 연구 집계는 별도 증거 범위다. 구버전 연구 파일은 run 결합 증거가 없다는 사실을 남기고, 새 결합 증거가 서로 다르면 장애다.

## 생존 감시와 권한

기존 주간 `evolution-lab.yml` 예약 정의, 실제 schedule 발화, 프로그램 성공 종료, 같은 실행의 상태 파일 저장, 평가 지문을 각각 확인한다. 기존 예약 감시의 **180분 유예**를 재사용한다. 토큰/실행 조회가 없으면 확인 불가이며, 수동 성공으로 예약 성공을 대신하지 않는다. 새 미래자료가 없어 결과 지문이 같은 것은 장애가 아니다.

오케스트레이터는 명령·네트워크·LLM·Production writer를 호출하지 않는다. 고정된 관찰 파일만 쓴다. 알려지지 않은 문제는 원인 종류·증거·처리 후보까지만 만든다. 기존 Harness 허용목록 외 복구, 코드 자동 작성, 가중치/점수/임계값/Secret/과거 기록 수정, Private/PAPER/주문 작업은 없다. 사람/AI는 원인별 개발과 새 연구 설계, 기존 승인 절차를 담당한다.

## 도입 시 실제 증거 (2026-09-13)

- 실제 원본: 600건·1판단일, BUY41/HOLD447/SELL112/판단보류0. 최근 회차 판단 가능100%, 평가0/미래대기600/결과 자료부족0. 결과 예정일 9월18일. 가격 비교 근거는 별도 확인 중600건이므로 기간 경과만으로 적중/오답이 생기지 않는다.
- Evolution: `evo-20260913-003740`, 마지막 평가 `2026-09-13T00:37:42Z`, safe mode 없음, 평가 대상20판단일/성숙15판단일, 후보0/실험0/Shadow0. 기존 자연 예약 [34728435516](https://github.com/rudvh1016-gif/gaeo-analyst-team/actions/runs/34728435516) 성공. **도입한 새 코드의 자연 실행 증거는 아니다.**
- 기존 연구 참고 성적 BUY40.9%/SELL48.6%, 높은 확신 오답206건·15판단일, SELL 뒤 큰 상승193건, HOLD 뒤 큰 움직임783건. PR #558로 보호된 실제 정확도로 해석하지 않는다.
- 판단: 실제 결과와 연구 분리 자료를 기다리는 단계. 당장 첫 확인은 결과일 도래 시 가격 비교 근거/결과 저장의 자연 갱신이며, 연구 자료가 충족되면 높은 확신 반복오답을 먼저 검토한다. 현재 정확도 개선은 입증되지 않았다.

검사: `test_decision_quality.py`, `test_performance_orchestrator.py`, 기존 recorder/comparison/Evolution/ops/watchdog/고객 설명 회귀 검사. 병합 전 필수 전체 검사는 기존 CI(`gaeo_check premerge`와 동등) 한 번으로 확인한다. 로컬에서 없는 대용량 과거 자료를 가짜로 보충하지 않는다.
