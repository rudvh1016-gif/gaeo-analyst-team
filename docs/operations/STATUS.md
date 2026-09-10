# 운영 안정화 진도 (인계장)

> 계획·경계·합격 기준은 `MASTER_PLAN.md`. 이 문서는 **최신 진도·확인된 근거·막힘·다음 행동**만 적는다.
> 민감정보(토큰·계좌·IP)와 거대한 원시 로그는 넣지 않는다.

## 기준 (2026-09-10 09:00 KST 시작)

- `origin/main` = `a003e02bda` (PR #529, indicators.json 출처 필드 보완). 열린 PR 0건.
- 작업 브랜치: `claude/auto-analysis-failure-prevention-94we7m` (origin/main에서 재기준. 예전 같은 이름 브랜치는 83커밋 뒤처진 빈 포인터였다).
- 동시 작업: `gaeo-private` 안정화 세션(다른 Fable)이 09-10 09:42 KST에 "구간 D 자연 회차 확인"을 예약해 둠(`trig_01T1jGMP3dttUZHshoANGAca`, 그 저장소의 `docs/stabilization/STATUS.md`에 기록). 공개 저장소 쪽 변경(PR #529 `compute_indicators.py`)은 이미 병합됐고 이번 작업은 그 파일을 만지지 않는다.
- 기준 검사(변경 전, `a003e02bda`): Python 계약 테스트 `test_*.py` 73개 파일 전부 PASS (이 세션 실측, 로그는 스크래치에만).
- 프라이빗 저장소는 읽기 전용으로 받아 연결 관계만 확인했다(`gaeo-private` `8d09699`, `gaeo-gateway` `a4f1c1c`). 어떤 파일도 고치지 않는다.

## 구간별 상태

상태 어휘: 미착수 / 진행 / 완료 / 부분 완료 / 접근 불가 / 자연 실행 대기

| 구간 | 상태 | 이미 있던 것 | 이번 실제 변경 | 검사 | 커밋/PR | 남은 위험·다음 행동 |
|---|---|---|---|---|---|---|
| 0 최신 사실·일정 보존 | 완료 | 예약시험 4건은 Claude Routine에만 있었음. `docs/CURRENT_STATUS.md`에 문장으로만 기록 | `docs/operations/MASTER_PLAN.md`·`STATUS.md`, `config/validation_schedule.json`(원본) + `docs/VALIDATION_SCHEDULE.md`(생성) + `render_validation_schedule.py` + `test_validation_schedule.py` | `test_validation_schedule.py` 7건 PASS | 이 브랜치 | 일정 실행기(구간 5) 전까지는 Claude Routine이 유일한 실행 경로다 |
| 1 PAPER 복구 | 진행 | Single Writer·doctor·health-alert·Oracle 자료 전부 있음 | (아래 "확정된 사실"·"유력 원인" 참고) | - | - | 집 PC 접근 없이는 실제 재가동 불가. 원격에서 할 수 있는 것: 러너 스크립트의 이력 재작성 내성, 집 PC 체크리스트 |
| 2 통합 건강검진 | 미착수 | check_pipeline·pipeline_watchdog·check_workflow_health·paper_health_check·evolution status | | | | |
| 3 하네스 | 미착수 | GAEO_HARNESS.md(Evolution용)·AGENTS.md·CLAUDE.md·스킬 8개 | | | | |
| 4 오케스트레이션 | 미착수 | 스킬 공통 규칙("항상 3명 review"·"health 기본 4명") | | | | |
| 5 일정 실행기 | 미착수 | 없음(Claude Routine만) | | | | |
| 6 Codex 호환 | 미착수 | `.claude/` 전용. `.agents/`·`.codex/` 없음 | | | | |
| 7 투자검증 GAP | 미착수 | 사전등록·Evolution·Forward 분리·음성대조 일부 | | | | |
| 8 이력 보존 | 미착수 | `compact-history.yml` 월 1회 force push(실행 1회: 2026-09-02 08:25 KST) | | | | 다음 예약 실행 2026-10-02 06:30 KST — 사전등록 창 안이다 |
| 9 통합·최종 보고 | 미착수 | | | | | |

## 확정된 사실 (다시 조사하지 말 것)

1. **PAPER는 2026-09-01 15:05 KST 회차가 마지막이다.** `paper_trading/state.json` `lastCycleAt=2026-09-01T15:05:09+09:00`, `lastCycleResult=CYCLE_OK`. 9/2·3·4·7·8·9 거래일 전부 기록 0건 → `paper-health-alert`가 Issue #481(`NO_CYCLE_TODAY`)을 매일 갱신 중. 이것은 "실행 후 실패"가 아니라 **"실행되지 않음"**이다(FAIL 판정이 아니라 MISSING).
2. `paper_runner_config.json` `activeRunner=WINDOWS`. Oracle은 설치되지 않았다(문서상 준비만). 두 러너가 동시에 쓴 흔적 없음.
3. **2026-09-02 08:25~08:30 KST `compact-history` 워크플로가 main 이력을 재작성하고 force push했다** (run 33570927997, 커밋 3,151개 재작성, `67c8d6ffb9 → 852814dfe8` forced update). 그 뒤 main의 모든 커밋 SHA가 바뀌었다. 현재 main의 뿌리 커밋은 2026-08-31 16:00 KST 두 개.
4. 러너 동기화 코드(`scripts/paper_cycle.ps1` 227~253행, `.sh` 동일)는 로컬 HEAD와 origin/main의 공통 조상이 없으면 "갈라짐 → rebase → 충돌 → abort → exit 6(수동 확인 필요)"로 끝나고 엔진을 돌리지 않는다. 이 상태는 매 사이클 반복된다.
5. 시세·자동분석 파이프라인은 정상이다(9/9 auto_analysis.js 30분 간격 커밋, 워치독 run 42회 success, 9/9 16:20 team_weights 갱신).
6. Claude Routine 실측(2026-09-10, 15건 중 활성 9건): 아래 표. 예약시험 4건은 전부 이 세션(`session_01Ng1xLMndUQQiSYMcjHY4TJ`)에 묶여 있고 9/23 건만 "새 세션 생성형"이다.
7. Evolution은 `BOOTSTRAP_SHADOW`, 주간 run 정상(9/6). 주간 이슈(#436·#464·#509)가 매주 새로 열리고 닫히지 않는다(제목에 날짜) → 구간 2 정리 대상.
8. 저장소 팩 크기 약 2.3GB(이 컨테이너 실측). 압축 1회(9/2) 뒤에도 하루 50~75커밋(자동 생성물)씩 는다.

## 유력하지만 아직 확정되지 않은 것 (단정 금지)

- **PAPER 중단의 가장 유력한 원인**: 사실 3+4. 집 PC 러너 전용 clone(`%LOCALAPPDATA%\GAEO\paper-runner\repo`)의 HEAD는 09-01 15:05 회차 커밋(재작성 **전** SHA)이고, 09-02 08:30 이후 origin/main은 재작성된 이력이라 **공통 조상이 없다**. 09-02 09:05 첫 사이클부터 exit 6이 반복됐을 것이다. **확정 근거는 집 PC 로그** `%LOCALAPPDATA%\GAEO\logs\paper-2026-09-02.log`에 `remote sync: 로컬/원격이 갈라짐` → `rebase 충돌` → `최종 exit code: 6`이 있는지다. 그 줄이 없으면 이 가설은 틀린 것이고, `paper_doctor.ps1`로 다시 진단한다.
- 09-07 84분 시세 공백이 09-08과 같은 원인(러너-GitHub 통신 단절)인지: 로그 미확인(`docs/CURRENT_STATUS.md` 인계 그대로).

## 아직 모르는 것

- 집 PC 전원·로그인·작업 스케줄러 상태(원격 확인 불가).
- Oracle VM의 Shape·여유 자원(`docs/PAPER_TRADING_ORACLE_RUNNER.md` §2 전부 UNKNOWN 그대로). Private 안정화 작업이 같은 VM에서 진행 중이므로 이번에 개오팀 PAPER를 Oracle에 설치하지 않는다(조건 미충족 → 보류).
- GitHub 쪽 저장소 실제 용량과 한도 경고 여부(API로 확인 예정, 구간 8).

## Claude Routine 실측 목록 (2026-09-10 `list_triggers`)

| ID | 이름 | 일정 | 상태 | 이 작업에서의 처리 |
|---|---|---|---|---|
| trig_016K7aG2LNfyo6mK4APHnTeK | DIANA 채점 시작 전환 확인 | 2026-09-15 17:00 KST 1회 | 활성 | 구간 5 GitHub 일정으로 이관 대상(`VS-20260915-DIANA-SHRINKAGE-CHECK`) |
| trig_015MuVabAYTLDXistNBJ8wE4 | FLOW 산식 검증 + BUY 표본 점검 | 매년 9/23 17:00 KST(cron), 새 세션 생성 | 활성 | 이관 대상(`VS-20260923-FLOW-READINESS-PREREG-SAMPLE`). 6-arm 채점은 정의 미완료 |
| trig_015gDtdaSXyuJnnU76PYcdDA | BUY 필터 사전등록 확정 평가 | 2026-10-19 17:00 KST 1회 | 활성 | 이관 대상(`VS-20261019-PREREG-BUY-EVAL`) |
| trig_018TwrTbybyiLUdjr4gUHzm8 | H1 40판단일 재확인 | 2026-11-16 17:00 KST 1회 | 활성 | 이관 대상(`VS-20261116-PREREG-H1-RECONFIRM`) |
| trig_019ZqRJzaM1upVRoQEfGkFzz | 장중 매시 kickoff 안전망 v6 | 평일 매시 09~16 KST | 활성(9/9 16:04 성공) | 구간 2에서 코드 감시 인수 확인 뒤 중지 검토(먼저 끄지 않는다) |
| trig_019pCrEkMQwuqxdEWCnzxZfk | 매일 시장분석 자동 발행 | 평일 16:30 KST | 활성 | 콘텐츠 발행(LLM 필요). 범위 밖 |
| trig_01JiZ2PJFkB65o1XbELP1MeC | 월요 Strategy 제안 | 월 09:00 KST | 활성 | 범위 밖(제안만) |
| trig_01Af1D2fAUvWgaRamx6wbmKA | 금요 Health 제안 | 금 09:00 KST | 활성 | 구간 2 코드 점검이 대체 가능 → 인수 뒤 중지 검토 |
| trig_01T1jGMP3dttUZHshoANGAca | 구간 D 09:42 확인 | 2026-09-10 09:42 KST 1회 | 활성 | **다른 세션(gaeo-private) 소유. 건드리지 않는다** |
| (비활성 6건) | 옛 안전망 v2/v3, 옛 방 이전본 | - | 비활성 | 그대로 둔다 |

과거 9/7 「월요일 러너 첫 가동 뒤 건강검진」(trig_0194BTtAr4D4UkHDa5a5Ebwx)은 발화 후 목록에서 사라졌고, PR #520 메시지가 "전 항목 정상"을 남겼다 → `VS-20260907-MONDAY-RUNNER-HEALTH`로 과거 기록만 보존.

## 다음 행동 (정확히)

1. 구간 1: `scripts/paper_cycle.ps1`·`.sh`에 "공통 조상 없음 + 로컬에 안 올린 Paper 커밋 없음"일 때만 `origin/main`으로 재기준하는 안전 경로 추가 + 계약 테스트. 집 PC 체크리스트를 `docs/operations/HOME_PC_CHECKLIST.md`로.
2. 구간 2: `ops_status.py`(LLM 0) + 격리 검사 + 주간 Evolution 이슈 단일화.
3. 이후 구간 순서대로. 각 구간 끝에 이 표를 갱신하고 commit·push.
