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
| 1 PAPER 복구 | 부분 완료(원격 몫 완료 · 집 PC 적용 대기) | Single Writer·doctor·health-alert·Oracle 자료 전부 있음 | `scripts/paper_cycle.sh`·`.ps1`: 공통 조상 없음(원격 이력 재작성) 분기 추가 — 안 올린 기록 없으면 옛 HEAD를 `refs/gaeo-backup/`에 남기고 `checkout -B main origin/main`, 있으면 exit 6 유지. `docs/operations/HOME_PC_CHECKLIST.md`(집에서 할 일 7단계), `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9 | `test_paper_runner_sync.py` 6건(sh 실제 실행 A/B/B2/C/C2 + ps1 정적 대조) PASS · `test_paper_safety_boundary`·`test_paper_single_writer`·`test_secret_hygiene`·`test_ci_parity` PASS | 이 브랜치 | 러너 clone은 동기화가 막혀 고친 코드를 못 받는다 → 집에서 한 번 `checkout -B main origin/main` 필요(체크리스트 3절). Oracle 전환 보류(조건 미충족). 끊긴 기간 장부: 보유 10건 지연 청산(MAX_HOLDING_5D)·dataGaps 자동 기록이 설계된 정상 동작, 소급 체결 0 |
| 2 통합 건강검진 | 완료(코드·연결) · 실제 작동은 병합 뒤 워치독 run에서 확인 | check_pipeline·pipeline_watchdog·check_workflow_health·paper_health_check·evolution status(각각 따로 봄) | `ops_status.py`(LLM 0, 어휘 6종, 달력·유예·회차창, 예정시험 지연 감지, 서명 기반 수리요청서 `--repair-request`) · `pipeline-watchdog.yml` 마지막 스텝에 요약 추가(`--github`, continue-on-error) · Evolution 🟢 주간 이슈 고정 제목 1개로 통합 + 옛 날짜 이슈 자동 정리(`gaeo_evolution/notification.py`, `evolution-lab.yml`) · `docs/PIPELINE_WATCHDOG.md` 절 추가 | `test_ops_status.py` 16건(격리: 금지 모듈 0·기본 실행 네트워크 0·차단 시 확인 불가 / 판정 10건 / CLI 종료코드) PASS · `test_gaeo_evolution` 195건 · `test_workflow_size`·`test_workflow_branch_exec`·`test_pipeline_watchdog`·`test_paper_health_check`·`test_holiday_guard` PASS | 이 브랜치 | 사이트 전달(`--probe-pages`)은 이 세션에서 egress 차단이라 실제 확인 못 함(확인 불가로 종료하는 것만 검증). 공개 화면 표시는 이번에 바꾸지 않음. Claude Routine: 매시 안전망 v6는 워치독 cron 지연을 메우는 dispatch 역할이라 **유지**, 금요 Health 제안은 일일 ops 점검(구간 5 워크플로) 가동 뒤 중지 후보 |
| 3 하네스 | 완료 | GAEO_HARNESS.md(Evolution용)·AGENTS.md 45.7KB(Codex 32KiB 한도 초과)·CLAUDE.md·스킬 8개 | `docs/HARNESS.md`(시작·검사·배포·복구·중단 한 장) · `gaeo_check.py`(preflight/quick/pipeline/paper/investment-contract/schedule/compatibility/premerge/postdeploy/browser) · `AGENTS.md`에 🧭 작업 지도(절대규칙 8줄+읽을 것/검사 표) 신설, 세부 절 5개를 `docs/rules/*.md`로 **원문 그대로 이동**(45.7KB→28.5KB) · `docs/agent/RULES_MAP.md` 대응표 · `CLAUDE.md` 시작 순서·Routine 항목 갱신 | `test_gaeo_check.py`(묶음 전수·없는 파일 FAIL·실패 전파) · `test_rules_map.py`(원문 이동 앵커·32KiB·지도 링크·중복 없음) · `python3 gaeo_check.py compatibility`/`quick` PASS · AGENTS.md를 읽는 기존 테스트(deep_analysis_pipeline·gaeo_evolution·design_contract·secret_hygiene) PASS | 이 브랜치 | Codex 32KiB 기본값은 설치본에서 재확인 필요(문서화). 브라우저 smoke는 목록만 제공(실행은 확인된 환경에서) |
| 4 오케스트레이션 | 완료 | 스킬 공통 규칙("항상 3명 review"·"health 기본 4명"·"build 마지막 항상 qa"·"strategy 4명 동시") · 팀 문서와 AGENTS의 배포 승인 규칙 충돌 | 8개 스킬 공통 절 개정(정상 점검 0명·메인 1명·동시 2명 이내·관점 순서대로·읽기 전용은 지침) · review/health/build/bug/strategy 개별 절 개정 · `/gaeo-maintain` 신설(STATUS→ops_status→수리요청서, 요청한 수정은 서버 정상이어도 수행) · `docs/gaeo_team_system.md` 개정 절 · 배포 승인 공통 기준(`HARNESS.md` §3) | 스킬 파일은 문서(정적). `test_rules_map.py`가 대응표를 잠금 | 이 브랜치 | 모델 지정 없음 확인(역할 파일에 `model:` 0건). Codex 순차 수행은 미확인 |
| 5 일정 실행기 | 완료(코드·워크플로·검사) · 실제 작동은 병합 뒤 첫 run에서 확인 | 없음(Claude Routine만) | `run_validation_schedule.py`(계획/실행/원장/동결 입력/`--replay`/후속 명세/수리 요청서, 재확인 상한 RECHECK_LIMIT·실패 3회 ESCALATED·anomalyRules→ANOMALY) · `check_team_weights_transition.py`(9/15 DIANA 전환: 직전 판 git/API 비교, ±1.5%/5%) · `check_flow_validation_readiness.py`(9/23 FLOW 표본 조건만, 채점 없음) · `config/validation_schedule.json`(모든 단계 available, `runner` 블록, `anomalyRules`) · `.github/workflows/ops-daily.yml`(평일 17:05 KST: `gaeo_check schedule` → `ops_status --deep --github` → 실행기 → 허용 경로 3곳만 커밋 → 이슈 2종 제목 고정) · `render_validation_schedule.py` 실행기 절 · `gaeo_check` schedule 묶음 확장 | `test_validation_runner.py` 42건(계획 규칙·allowlist·판정·임시 저장소 실제 실행·원장 append-only 바이트 비교·동결/재현·워크플로 정적) · `test_validation_checks.py` 19건(임시 git 저장소 2판 비교·FLOW 합성 표본) · `gaeo_check schedule`/`quick` PASS · `test_workflow_size`·`test_ci_parity`·`test_secret_hygiene`·`test_rules_map`·`test_workflow_health` PASS | 이 브랜치 | 실제 due 시험은 9/15가 첫 회. Claude Routine 4건은 **병합 뒤** `update_trigger`로 "GitHub 원장 확인 + §3 후속만"으로 재작성(원장이 실제 due 시험을 기록하는 것을 본 뒤 끄기). 실행기의 ANOMALY/FAILED는 수리 요청서만 쓰고 산식을 건드리지 않음 |
| 6 Codex 호환 | 완료(파일·정적 검사) · 실제 앱 확인은 미확인 | `.claude/` 전용. `.agents/`·`.codex/` 없음. MIGRATION_MAP 골격만 | `sync_agent_compat.py`(생성기, `--check`) → `.agents/skills/<13개>/SKILL.md`(같은 name/description + 원본 경로 + Claude 메커니즘 대응표, 절차 복제 없음) · `.codex/agents/<14개>.toml`(형식 미확인 표시, model 키 없음) · `docs/agent/ROLES.md`(역할 14개 표) · `docs/agent/CODEX_SCENARIOS.md`(시나리오 4개 + 기록표) · MIGRATION_MAP 갱신(모델 지정 정정: 외부 seo-* 원문에 `model: sonnet` 있음, GAEO 14개는 없음) | `test_agent_compat.py` 11건(동기 바이트 비교·이름 일치·복제 없음·참조 경로 존재·TOML 파싱·model 없음·ROLES 전수) · `gaeo_check compatibility` PASS | 이 브랜치 | Codex 공식 문서는 egress 차단으로 읽지 못함 → 레이아웃·형식 미확인. Codex가 있는 환경에서 `CODEX_SCENARIOS.md` §5 표를 채워야 "실제 앱 확인"이 된다 |
| 7 투자검증 GAP | 완료 | 사전등록 평가·계약 테스트·기준선 공개·Evolution·Forward 분리·성적표(전부 코드·연결 있음, 표본은 전부 부족) | `docs/operations/INVESTMENT_VALIDATION_GAP.md`(11항목 × 코드/연결/기록/표본/효과 5칸, 9/10 실측: 사전등록 익은 판단일 0/20 · FLOW 공통 날짜 12/20 · DIANA n=0 NOT_GRADED_YET · Evolution BOOTSTRAP_SHADOW validated 0 · PAPER 9/1 이후 정지) · `test_validation_negative_control.py`(무관한 합성 자료에서 PASS 0·효과 0·재현성·config↔등록 상수·기준일 고정) · `gaeo_check investment-contract` 추가 | `test_validation_negative_control.py` 7건 PASS · 등록 테스트 변경 0 | 이 브랜치 | 산식·가중치·임계값·등록 상수 변경 0. FLOW 6-arm 은 정의 4건을 코드로 확정하는 새 등록이 먼저(자동 채점 없음) |
| 8 이력 보존 | 완료(코드·문서) · 소유자 결정 대기(용량 정책) | `compact-history.yml` 월 1회 force push(실행 1회: 2026-09-02 08:25 KST, 커밋 3,151개 번호 변경 → PAPER 러너 8거래일 정지). 다음 예약 2026-10-02 06:30 KST(사전등록 창 안) | `compact-history.yml`: **schedule 제거 → 수동(confirm=COMPACT-MAIN-HISTORY)** + 사전 점검(얕은 clone·KST 평일 08:30~16:40·러너 2시간 활동·검증 원장 증거 손실 거부) + 옛→새 **SHA 지도** `docs/audits/history_rewrites/` 커밋(tree·author-time 검산 실패 시 push 안 함) + 재기준 안내 이슈 · `check_history_evidence.py`(`--report`/`--precheck`/`--sha-map`/`--translate`) · `ops-daily` 매일 용량 보고(3 GiB NOTICE·4.5 GiB PROTECT) · `docs/HISTORY_PRESERVATION.md`(사실·결정·대안 A~E·소유자 결정 4개) · `BRANCH_GOVERNANCE_PLAN` 2단계 진행 표시 · `HOME_PC_CHECKLIST` 개발 clone 재기준 절 | `test_history_preservation.py` 11건(워크플로 정적 + 실제 임시 git 재작성 재현·지도·번역 + 사전 점검 거부 조건 + 토큰 없는 보고=확인 불가·네트워크 0) PASS | 이 브랜치 | 실측: GitHub 집계 1.88 GiB(9/10), 최근 7일 이력 +542.7 MB(≈2.3 GB/월) → 12월 5 GiB 근처. 압축을 끈 것은 되돌릴 수 있다(schedule 한 줄). 커밋 빈도 줄이기(B)·data-live(C)는 소유자 결정·별도 설계 |
| 9 통합·최종 보고 | 진행(PR 열림 · CI·병합·배포 확인 대기) | CI(`ci.yml`)·워치독 | `docs/operations/FINAL_REPORT_KO.md`(10문항 쉬운 한국어 + 설치/작동/검증 구분표) · PR #530 | `gaeo_check premerge` **123 PASS / 0 FAIL**(py 84 + js 39, 커밋 3021bae486) · 브라우저 smoke `test_holiday_home_browser.js`·`test_home_daily_brief_browser.js` PASS(로컬 8877) · 실데이터 계획 모드 예행 9/15·9/23·10/19 | PR #530 | 병합 뒤 할 것: `ops-daily` dispatch(apply=false) 계획 출력 확인 · `gaeo_check postdeploy` · Claude Routine 4건 재작성은 9/15 원장 기록 확인 뒤 |

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
| trig_016K7aG2LNfyo6mK4APHnTeK | DIANA 채점 시작 전환 확인 | 2026-09-15 17:00 KST 1회 | 활성 | GitHub 실행기 준비 완료(`VS-20260915-DIANA-SHRINKAGE-CHECK`, 브랜치). 병합 뒤 프롬프트를 "ops-daily 원장 확인 + 미리 정한 후속만"으로 재작성 |
| trig_015MuVabAYTLDXistNBJ8wE4 | FLOW 산식 검증 + BUY 표본 점검 | 매년 9/23 17:00 KST(cron), 새 세션 생성 | 활성 | GitHub 실행기 준비 완료(`VS-20260923-FLOW-READINESS-PREREG-SAMPLE`: 표본 조건만 자동, 6-arm 채점은 정의 미완료라 NOT_RUN). 병합 뒤 재작성 |
| trig_015gDtdaSXyuJnnU76PYcdDA | BUY 필터 사전등록 확정 평가 | 2026-10-19 17:00 KST 1회 | 활성 | GitHub 실행기 준비 완료(`VS-20261019-PREREG-BUY-EVAL`, 동결 입력+followup 명세). 병합 뒤 재작성 |
| trig_018TwrTbybyiLUdjr4gUHzm8 | H1 40판단일 재확인 | 2026-11-16 17:00 KST 1회 | 활성 | GitHub 실행기 준비 완료(`VS-20261116-PREREG-H1-RECONFIRM`). 병합 뒤 재작성 |
| trig_019ZqRJzaM1upVRoQEfGkFzz | 장중 매시 kickoff 안전망 v6 | 평일 매시 09~16 KST | 활성(9/9 16:04 성공) | 구간 2에서 코드 감시 인수 확인 뒤 중지 검토(먼저 끄지 않는다) |
| trig_019pCrEkMQwuqxdEWCnzxZfk | 매일 시장분석 자동 발행 | 평일 16:30 KST | 활성 | 콘텐츠 발행(LLM 필요). 범위 밖 |
| trig_01JiZ2PJFkB65o1XbELP1MeC | 월요 Strategy 제안 | 월 09:00 KST | 활성 | 범위 밖(제안만) |
| trig_01Af1D2fAUvWgaRamx6wbmKA | 금요 Health 제안 | 금 09:00 KST | 활성 | 구간 2 코드 점검이 대체 가능 → 인수 뒤 중지 검토 |
| trig_01T1jGMP3dttUZHshoANGAca | 구간 D 09:42 확인 | 2026-09-10 09:42 KST 1회 | 활성 | **다른 세션(gaeo-private) 소유. 건드리지 않는다** |
| (비활성 6건) | 옛 안전망 v2/v3, 옛 방 이전본 | - | 비활성 | 그대로 둔다 |

과거 9/7 「월요일 러너 첫 가동 뒤 건강검진」(trig_0194BTtAr4D4UkHDa5a5Ebwx)은 발화 후 목록에서 사라졌고, PR #520 메시지가 "전 항목 정상"을 남겼다 → `VS-20260907-MONDAY-RUNNER-HEALTH`로 과거 기록만 보존.

## 다음 행동 (정확히)

1. ~~구간 1 원격 몫~~ 완료. 집 PC 몫은 `HOME_PC_CHECKLIST.md`.
2. ~~구간 2~~ 완료.
3. ~~구간 3·4~~ 완료.
4. ~~구간 5~~ 완료(코드). 병합 뒤: `ops-daily` 를 `workflow_dispatch`(apply=false)로 한 번 돌려 계획 출력 확인 → Claude Routine 4건 프롬프트 재작성(`update_trigger`).
5. ~~구간 6~~ 완료(파일·정적 검사). Codex 실제 확인은 그 도구가 있는 환경에서 `docs/agent/CODEX_SCENARIOS.md`.
6. ~~구간 7·8~~ 완료(코드·문서). 소유자 결정: 용량 정책(`docs/HISTORY_PRESERVATION.md` §5).
7. 구간 9: premerge 123/0 → PR #530 열림 → CI 초록 확인 → 병합(merge commit) → `ops-daily` dispatch(apply=false) → `gaeo_check postdeploy` → 이 표 갱신. 집 PC 몫은 `HOME_PC_CHECKLIST.md`.
