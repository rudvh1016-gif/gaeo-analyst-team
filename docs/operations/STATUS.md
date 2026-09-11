# 운영 안정화 진도 (인계장)

> 계획·경계·합격 기준은 `MASTER_PLAN.md`. 이 문서는 **최신 진도·확인된 근거·막힘·다음 행동**만 적는다.
> 민감정보(토큰·계좌·IP)와 거대한 원시 로그는 넣지 않는다.

## 2026-09-11 00:20 KST — 집 PC PAPER 복구 **완료** (집 PC 실측 세션)

> 이 절이 아래 「확정된 사실」 1번(“PAPER 마지막 회차 = 2026-09-01”)을 **대체한다.**
> 실행 위치: 집 Windows PC(`DESKTOP-24KN8TP`) 직접 세션. 원격 세션이 아니다.

**현재 상태 — 복구 끝. 중간에 끊긴 작업 없음. 미커밋 작업 없음.**

| 항목 | 결과 | 근거 |
|---|---|---|
| 9/2 정지 원인 | **확정** — 사실 3+4 가설이 맞았다 | `paper-2026-09-02.log`: `remote sync: 로컬/원격이 갈라짐` → `rebase 충돌 — abort했다` → `최종 exit code: 6`. 9/2·3·4·7·8·10 각 13회차 전부 exit 6 |
| 집 PC에만 있던 기록 | **없음** | 복구 도구 check = **exit 10 / COVERED**(로컬 27파일 = 원격 27파일, 전 바이트 동일). 별도 교차검증: `paper_trading`·`smart_v2`·`scalp_v3` **tree 해시 3개 모두 원격과 일치**, `paper_public.js` blob 일치 |
| 장부 보존 | **완료** | 백업 `%LOCALAPPDATA%\GAEO\backups\prerepoint-20260911T001714\`(manifest 검증 통과) · 옛 HEAD `refs/gaeo-backup/head-20260911T001714` → `dbd9d86e4e` · 거래 줄 수 372/224/20 **복구 전후 동일**, 기존 줄 바이트 무변경(소급 수정 0) |
| 러너 저장소 재기준 | **완료** | `paper_recover.ps1 -Mode apply` **exit 0**. HEAD `dbd9d86e4e` → `8d4ff6a233`(=origin/main), 작업트리 깨끗 |
| 개발용 저장소 재기준 | **완료** | 옛 HEAD `da99ce79c3` → `refs/gaeo-backup/dev-20260911` 보존 후 `checkout -B main origin/main`. 옛 HEAD 내용은 새 이력 `2188a3f2b8`에 tree 동일로 이미 보존돼 있었다(손실 0) |
| 실제 PAPER 1회차 | **완료(성공)** | 작업 스케줄러 `GAEO Paper Trading` 실행 → `remote sync: 이미 최신` → engine/momentum/smart_v2/scalp_v3/report/public **전부 exit 0** → `최종 exit code: 0` |
| **장중 자연 회차** | **완료(2026-09-11 실측)** | 09:05·09:35·10:05·10:35·11:05·11:35·12:05 **7회차 전부 exit 0**(사람 개입 0). 토스 403/시세불가 **0건**(`PRICE_HISTORY_599`). 09:35부터 신규 진입 재개, scalp_v3 도 12:05 에 진입 재개. 세 장부 활성: V1 438줄/보유 10 · smart_v2 280줄/보유 10 · scalp_v3 23줄/보유 3 |
| GitHub 새 기록 | **완료** | 커밋 `a7cb305160` push 성공, `origin/main` 반영 확인. 화이트리스트 밖 파일 0건. 세 장부 `lastCycleAt` 전부 `2026-09-11T00:20` |
| 관측 공백 정직성 | **완료 — 설계대로 기록됨** | 9/11 09:05 회차가 보유 10건을 `MAX_HOLDING_5D` 로 **오늘 실제 시세에 청산**(합계 실현손익 **-357,881 KRW**). `holding_trading_days` = **12일 7건 · 8일 3건**(한도 5일 초과 = 지연 청산이 그대로 보임). 10건 전부 `observation_gap_business_days = [09-02 … 09-10]` 기록. **소급 체결 0건, 과거 날짜 거래 0건** |
| 다음 거래일 자동 실행 | **준비됨** | 작업 스케줄러 Ready·Enabled, Mon–Fri 09:05 + 30분 간격 6시간, `NextRunTime = 2026-09-11 09:05`. `paper_doctor.ps1` 전 항목 `[O]`, exit 0. `paper_health_check.py` → `status=OK reason=CYCLE_OK` |

**이번에 새로 밝혀진 별개 원인 (9/2 git 문제와 무관)**

- **9/9(수)만 로그가 아예 없다.** 작업 스케줄러는 13회 전부 발화했지만 **이벤트 332 ×13**으로 전부 차단됐다:
  「시작 조건이 충족되었을 때 "DESKTOP-24KN8TP\개오" 사용자가 로그온한 상태가 아니므로 …」.
  그날 06:21~06:24 Windows Update(TrustedInstaller)가 재부팅했고 로그온이 안 된 상태였다.
  작업이 `LogonType=Interactive`(사용자 로그온 시에만 실행)라서 생긴 구조적 위험이며 **아직 안 고쳤다**
  (고치려면 계정 비밀번호 저장이 필요 → 자격증명 작업이라 이번 승인 범위 밖).

**다음 첫 명령 — 2026-09-11 12:10 KST 에 위 3개 모두 실행해 확인 완료.** 남은 확인은 하나뿐이다:

```powershell
# 16:30 KST 이후: paper-health-alert 가 Issue #481 을 자동으로 닫았는지 (사람이 닫지 말 것)
gh issue view 481 --json state,updatedAt
```

**절대 하지 말 것 (이어받는 세션용)**

- Issue #481을 **사람이 직접 닫지 않는다.** 16:30 KST `paper-health-alert`가 오늘 `CYCLE_OK`를 보고 자동으로 닫는다.
- 9/2~9/10 공백을 **과거 날짜 거래로 메우지 않는다.** `backfilledBusinessDates`에 공백으로 남기는 것이 설계된 정상 동작이다.
- 보유 10건을 **손으로 청산 처리하지 않는다.** 다음 개장 회차가 `MAX_HOLDING_5D`로 처리하며, `holding_trading_days`가 5보다 크게 찍히는 건 지연 청산이라 정상이다.
- `git reset --hard` · `git clean` · force push · `--allow-unrelated-histories` · 백업 폴더/`refs/gaeo-backup/*` 삭제 금지.
- 산식·가중치·BUY/HOLD/SELL 기준·사전등록 조건·`tickers.js`·`activeRunner`(=`WINDOWS` 유지) 변경 금지.
- **Oracle 이전 전제 조건은 2026-09-11 에 충족됐다**(장중 7회차 연속 정상). 다만 이전 자체는 **별도 작업**이며, 시작 전에 STATUS 의 「이번에 하지 않는 다음 단계」 2~8번(Oracle 자원 확인 · Linux 실행 시험 · **동시 writer 방지** · Windows 정지 순서)을 먼저 설계해야 한다. `activeRunner` 를 성급히 바꾸면 두 러너가 같은 장부를 쓴다.

**남은 위험 (해결 안 됨)**

1. 9/9형 사고 재발 — PC가 재부팅되고 아무도 로그인하지 않으면 그날 PAPER는 통째로 안 돈다. (사용자 조치: 평일 장중 PC를 켜고 로그인 상태로 두기)
2. 토스 공유 토큰 경고 — 매 회차 `GAEO_SHARED_TOSS_TOKEN 가 꺼져 있습니다 … Gateway의 토큰이 끊깁니다`가 뜬다. PAPER 자체는 정상이지만 Gateway와 함께 쓰면 충돌 가능. 이번 범위 밖이라 손대지 않았다.
3. ~~장중 실거래 회차 미검증~~ → **해소(2026-09-11)**. 장중 7회차 전부 정상, 토스 403 0건.
4. 회계 버전 혼재(위험 아님, 기록용) — 2026-08-26 이전 진입분은 `accounting_version=None` 이라 수수료·세금이 0원이고, 9/1 진입분부터 `ACCOUNTING_V2_NET` 으로 비용이 붙는다. 8/18~8/25 청산분도 같아서 **이번 복구로 생긴 회귀가 아니다.** 성과를 비교할 때 두 구간을 섞지 말 것.

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
| 8 이력 보존 | 완료(코드·문서) · 소유자 결정 대기(용량 정책) | `compact-history.yml` 월 1회 force push(실행 1회: 2026-09-02 08:25 KST, 커밋 3,151개 번호 변경 → PAPER 러너 8거래일 정지). 다음 예약 2026-10-02 06:30 KST(사전등록 창 안) | `compact-history.yml`: **schedule 제거 → 수동(confirm=COMPACT-MAIN-HISTORY)** + 사전 점검(얕은 clone·KST 평일 08:30~16:40·러너 2시간 활동·검증 원장 증거 손실 거부) + 옛→새 **SHA 지도** `docs/audits/history_rewrites/` 커밋(tree·author-time 검산 실패 시 push 안 함) + 재기준 안내 이슈 · `check_history_evidence.py`(`--report`/`--precheck`/`--sha-map`/`--translate`) · `ops-daily` 매일 용량 보고(3 GiB NOTICE·4.5 GiB PROTECT — **이 프로젝트가 정한 경고선**이지 GitHub 공식 한도가 아니다. GitHub 은 1 GB 이하 권장·5 GB 미만 강력 권고) · `docs/HISTORY_PRESERVATION.md`(사실·결정·대안 A~E·소유자 결정 4개) · `BRANCH_GOVERNANCE_PLAN` 2단계 진행 표시 · `HOME_PC_CHECKLIST` 개발 clone 재기준 절 | `test_history_preservation.py` 11건(워크플로 정적 + 실제 임시 git 재작성 재현·지도·번역 + 사전 점검 거부 조건 + 토큰 없는 보고=확인 불가·네트워크 0) PASS | 이 브랜치 | 실측: GitHub 집계 1.88 GiB(9/10), 최근 7일 이력 +542.7 MB(≈2.3 GB/월) → 12월 5 GiB 근처. 압축을 끈 것은 되돌릴 수 있다(schedule 한 줄). 커밋 빈도 줄이기(B)·data-live(C)는 소유자 결정·별도 설계 |
| 9 통합·최종 보고 | 완료(병합·배포·첫 실행 확인) | CI(`ci.yml`)·워치독 | `docs/operations/FINAL_REPORT_KO.md`(10문항) · PR #530 → **main `4cdba5a7d7`**(merge commit, 2026-09-10 10:50 KST) · Claude Routine 4건 프롬프트·시각 재작성(17:40 KST, "GitHub 원장 확인 + §3 후속만", 직접 평가 금지) | `gaeo_check premerge` 123 PASS / 0 FAIL(= **테스트 파일** 123개 전부 통과, py 84 + js 39 — 개별 테스트 건수가 아니다) · CI contract-tests 성공(head 8f781b78) · 브라우저 smoke 2건 PASS · **병합 뒤**: `ops-daily` workflow_dispatch(apply=false) run #1 성공(21초, 계획 모드 NOT_DUE 4건) · main 작업트리에서 `ops_status.py --probe-pages`: 정상 7 · 정상 대기 1 · 장애 1(PAPER) · 사이트 전달 정상(10:51 시세, 저장소 대비 0분 차) · 지표 출처 정상(PR #529 필드가 10:32 생성물에 반영됨) | PR #530 병합 | 남은 것: 집 PC 러너 재기준(HOME_PC_CHECKLIST) · 9/15 17:05 첫 실제 due 시험 기록 확인 · Codex 실기동 미확인 · GitHub cron **미발화** 실측(워치독 schedule 발화 하루 두 번꼴 · ops-daily 첫 예정 17:05 발화 0회 → 구간 D 에서 실측 항목·예비 발화 추가. 매시 Routine 은 9/15 까지만) |

## 확정된 사실 (다시 조사하지 말 것)

1. **PAPER는 2026-09-01 15:05 KST 회차가 마지막이다.** `paper_trading/state.json` `lastCycleAt=2026-09-01T15:05:09+09:00`, `lastCycleResult=CYCLE_OK`. 9/2·3·4·7·8·9 거래일 전부 기록 0건 → `paper-health-alert`가 Issue #481(`NO_CYCLE_TODAY`)을 매일 갱신 중. 이것은 "실행 후 실패"가 아니라 **"실행되지 않음"**이다(FAIL 판정이 아니라 MISSING).
2. `paper_runner_config.json` `activeRunner=WINDOWS`. Oracle은 설치되지 않았다(문서상 준비만). 두 러너가 동시에 쓴 흔적 없음.
3. **2026-09-02 08:25~08:30 KST `compact-history` 워크플로가 main 이력을 재작성하고 force push했다** (run 33570927997, 커밋 3,151개 재작성, `67c8d6ffb9 → 852814dfe8` forced update). 그 뒤 main의 모든 커밋 SHA가 바뀌었다. 현재 main의 뿌리 커밋은 2026-08-31 16:00 KST 두 개.
4. 러너 동기화 코드(`scripts/paper_cycle.ps1` 227~253행, `.sh` 동일)는 로컬 HEAD와 origin/main의 공통 조상이 없으면 "갈라짐 → rebase → 충돌 → abort → exit 6(수동 확인 필요)"로 끝나고 엔진을 돌리지 않는다. 이 상태는 매 사이클 반복된다.
5. 시세·자동분석 파이프라인은 정상이다(9/9 auto_analysis.js 30분 간격 커밋, 워치독 run 42회 success, 9/9 16:20 team_weights 갱신).
6. Claude Routine 실측(2026-09-10 오전, 15건 중 활성 9건 → 오후 구간 E 에서 월·금 제안 2건을 꺼 **활성 7건**): 아래 표. 예약시험 4건은 전부 이 세션(`session_01Ng1xLMndUQQiSYMcjHY4TJ`)에 묶여 있고 9/23 건만 "새 세션 생성형"이다.
7. Evolution은 `BOOTSTRAP_SHADOW`, 주간 run 정상(9/6). 주간 이슈(#436·#464·#509)가 매주 새로 열리고 닫히지 않는다(제목에 날짜) → 구간 2 정리 대상.
8. 저장소 팩 크기 약 2.3GB(이 컨테이너 실측). 압축 1회(9/2) 뒤에도 하루 50~75커밋(자동 생성물)씩 는다.
9. **GitHub cron 은 이 저장소에서 문서대로 발화하지 않는다(2026-09-10 실측).** 워치독 `*/15` 의 schedule 발화는 하루 두 번꼴(03:38Z·08:2xZ 부근)이었고, `ops-daily` 의 첫 예정 발화(17:05 KST)는 20:40 KST 까지 0회였다(run 목록에 dispatch 1건뿐). 시세·자동분석이 그동안 산 것은 러너 자기 재기동(chain, dispatch)과 매시 Claude Routine 덕이다. 구간 D 가 이것을 `ops_status --github` 「예약 실행 실측」 항목으로 잰다(비활성/기록 없음/잘못된 ref/실패/미실행/대기 구분). 보완으로 ops-daily 예비 발화(17:37·18:11)·워치독 분 흩기(`4,19,34,49`)를 넣었지만 **보장이 아니다**.

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
| trig_016K7aG2LNfyo6mK4APHnTeK | DIANA 채점 시작 전환 확인 | **2026-09-15 17:40 KST** 1회 | 활성 | **재작성 완료(2026-09-10)**: GitHub 원장(`VS-20260915-DIANA-SHRINKAGE-CHECK`) 확인 → 숫자 보고 → ANOMALY 일 때만 수리 요청서 기준 최소 수정. 직접 평가 금지. 기록이 없으면 ops-daily 를 1회 dispatch |
| trig_015MuVabAYTLDXistNBJ8wE4 | FLOW 표본 조건 + BUY 표본 점검 | **2026-09-23 17:40 KST 1회**(매년 cron → 1회로 변경), 새 세션 생성 | 활성 | **재작성 완료**: 원장(`VS-20260923-FLOW-READINESS-PREREG-SAMPLE`) 확인 → 표본 수 보고 → 6-arm 채점은 하지 않고 정의 4건을 코드로 확정하는 새 등록 제안만 |
| trig_015gDtdaSXyuJnnU76PYcdDA | BUY 필터 사전등록 확정 평가 | **2026-10-19 17:40 KST** 1회 | 활성 | **재작성 완료**: 원장(`VS-20261019-PREREG-BUY-EVAL`) 확인 → `--replay` 재현 확인 → §3 표 후속만(H2 표시 추가·경고 제거·H0 기록; H1 은 기록만). 성적표 첫 호는 EVALUATED 일 때만 |
| trig_018TwrTbybyiLUdjr4gUHzm8 | H1 40판단일 재확인 | **2026-11-16 17:40 KST** 1회 | 활성 | **재작성 완료**: 원장(`VS-20261116-PREREG-H1-RECONFIRM`) 확인 → 재현 확인 → H1 PASS(≥40일) 일 때만 §3 산식 변경(급등 BUY→HOLD) PR |
| trig_019ZqRJzaM1upVRoQEfGkFzz | 장중 매시 kickoff 안전망 v6 | 평일 매시 09~16 KST | 활성 | **9/15 까지 유지, 구독 종료와 함께 소멸.** 대체: 러너 자기 재기동(chain)·수집기 자진 사퇴·워치독 cron 분 흩기(구간 D)·`ops_status --github` 예약 실행 실측. 사람이 따로 할 일 없음 |
| trig_019pCrEkMQwuqxdEWCnzxZfk | 매일 시장분석 자동 발행 | 평일 16:30 KST | 활성 | 콘텐츠 발행(LLM 필요). **9/15 이후 소멸 — 대체 없음**(사람 또는 다른 AI 세션이 `.claude/skills/뉴스분석 스킬/SKILL.md` 절차로 발행) |
| trig_01JiZ2PJFkB65o1XbELP1MeC | 월요 Strategy 제안 | 월 09:00 KST | **비활성(2026-09-10 구간 E 에서 끔)** | 제안형(실행·커밋 없음). 코드 점검(`ops-daily`)이 대체. 다시 켜려면 `update_trigger enabled=true` |
| trig_01Af1D2fAUvWgaRamx6wbmKA | 금요 Health 제안 | 금 09:00 KST | **비활성(2026-09-10 구간 E 에서 끔)** | 구간 2 코드 점검이 대체(`ops-daily` 매일 실행) |
| trig_01T1jGMP3dttUZHshoANGAca | 구간 D 09:42 확인 | 2026-09-10 09:42 KST 1회 | 활성 | **다른 세션(gaeo-private) 소유. 건드리지 않는다** |
| (비활성 6건) | 옛 안전망 v2/v3, 옛 방 이전본 | - | 비활성 | 그대로 둔다 |

과거 9/7 「월요일 러너 첫 가동 뒤 건강검진」(trig_0194BTtAr4D4UkHDa5a5Ebwx)은 발화 후 목록에서 사라졌고, PR #520 메시지가 "전 항목 정상"을 남겼다 → `VS-20260907-MONDAY-RUNNER-HEALTH`로 과거 기록만 보존.

## 후속 실행 (2026-09-10 오후, 「Fable 후속 실행 지시서」) 구간 A~F — 완료 구분표

"구간 완료"는 코드·검사·PR 병합까지를 뜻한다. **집 PC 적용 · Codex 검증 · Claude 없이 운영**은 별개의 칸이며, 이 세션에서 확인할 수 없는 것은 ✗ 로 적는다.

| 구간 | 구간 완료(코드·검사·병합) | 집 PC 적용 | Codex 검증 | Claude 없이 운영 | 근거 |
|---|---|---|---|---|---|
| A 원장 보존 결함 수리 | ✔ PR #532 → main `603254f8b3`(15:55 KST). `paper_ledger_inclusion.py`(내용 기반 포함성 COVERED/NOT_COVERED/UNDETERMINED, fail-closed) · `scripts/paper_cycle.sh`/`.ps1`(공통 조상 없음 → 얕은 clone 거부 → 포함성 → 백업+검증 → `refs/gaeo-backup/` → 재기준; 잠금) · 복구 도구 `scripts/paper_recover.sh`/`.ps1`(check/apply, 안 올린 기록 export). 테스트 37+18+12=67건. 별도 세션 검토자 1명: P0 없음, 옛 코드의 E1 손실 재현 확인 | ✗ 접근 불가(구간 B) | 해당 없음 | ✔ 러너·복구 도구는 일반 프로그램 | `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9 · `HOME_PC_CHECKLIST.md` §0~§4 |
| B 집 PC 복구 | 도구 완료 · **적용 미완** | ✗ **ACCESS_BLOCKED** — 이 세션은 클라우드 VM, Remote Control 없음, 집 PC 로그·스케줄러·러너 clone 을 볼 수 없다. 원격 복사본 수리를 집 PC 설치로 보고하지 않는다 | 해당 없음 | 적용 뒤에는 ✔ | 사람이 1회: `HOME_PC_CHECKLIST.md` §3(`scripts\paper_recover.ps1` 검사 모드 → `-Mode apply`) |
| C 예정 시험 실행기 보강 | ✔ PR #533 → main `b40f54815e`(16:05 KST). 계획 모드 0실행 · 확인 시험(9/15·9/23)은 표본 수만(`prereg_sample_count.py`) · expectJson/requiredFields → FAILED · 평가 시험 동결 입력 필수·공식 판정은 동결 입력에서 · 저장 실패는 `validation-inbox-<run_id>` 브랜치+artifact 보존 후 다음 run 회수 · 재확인 기준일 전진 · 실행기 크래시 기록. 테스트 57건 | 해당 없음 | 해당 없음 | ✔ 단, **GitHub cron 이 발화해야** 한다(사실 9) — 미발화면 사람이 Actions 탭에서 `ops-daily` `apply=true` 1회 | `docs/VALIDATION_SCHEDULE.md` · `config/validation_schedule.json` |
| D Claude 없는 감시 정직화 | PR #535(커밋 `237269df6e`·`191bc0ff5e`) — CI 뒤 병합. `ops_status --github` 「예약 실행 실측」(워치독·ops-daily 각각: 비활성/기록 없음/잘못된 ref/실패/미실행/대기/수동만) · `check_validation_schedule` `lastLedger.resultFileExists` · ops-daily 예비 발화 · 워치독 분 흩기. 테스트 26건 | 해당 없음 | 해당 없음 | ✔ (감시 자체가 cron 에 실리므로 "실행된 run 안에서" 잰다 — cron 이 전혀 안 뜨면 아무도 못 잰다: 한계 명시) | `docs/PIPELINE_WATCHDOG.md` 2026-09-10 절 |
| E Codex 인계 | ✔ PR #534 → main `62f3fd3551`(16:10 KST). `.codex/agents/*.toml` 을 지시서의 공식 스펙 키 넷(`name`·`description`·`developer_instructions`·`sandbox_mode`)으로 · 독립 검토 ≠ 같은 AI 역할 교대 · 동시 AI ≤ 2 · Routine 월·금 제안 2건 비활성. 테스트 14건 | 해당 없음 | ✗ **미확인** — 이 세션에 Codex 없음, 공식 문서(developers.openai.com) egress 차단으로 직접 대조 못 함. `docs/agent/CODEX_SCENARIOS.md` §5 표를 Codex 있는 환경에서 채워야 확인 | ✔ 파일은 남는다 | `docs/agent/MIGRATION_MAP.md` |
| F 문서 정정·최종 보고 | 이 문서·`FINAL_REPORT_KO.md`·`HARNESS.md`·`MASTER_PLAN.md`·`CLAUDE.md` 정정(원인 확정→유력 가설, 시간 약속 제거, 123 PASS 뜻, 완료 구분표, 용량 경고선, Routine 실태) + 채팅 최종 보고 | - | - | - | PR #535 에 포함(문서 5개, 코드 변경 없음) |

## 9/15 이후(Claude 구독 종료) 의존성 표

| 기능 | Claude 없이 | 무엇이 대신하나 | 남는 위험 |
|---|---|---|---|
| 시세·자동분석 수집 | ✔ | `update-prices.yml`·`update-analysis.yml` 자기 재기동 + 자진 사퇴 | 체인이 끊기면(둘 다 죽음) cron 이 살려야 하는데 cron 이 불확실 → 사람이 Actions 에서 dispatch |
| 워치독(좀비 취소·재기동·상태 요약) | △ | cron `4,19,34,49 0-7`(실측 하루 두 번꼴) + 마커 push(Routine 소멸 뒤에는 없음) | 좀비 감지가 몇 시간 늦을 수 있다 |
| 예정 시험 실행·기록(9/23·10/19·11/16) | △ | `ops-daily` cron 17:05(+17:37·18:11) → 원장 | 첫 예정일 발화 0회 실측. 미발화면 사람이 `apply=true` 1회(지연은 기록에 남는다) |
| 시험 결과 확인·후속 조치 PR | ✗ | 원장·이슈는 남는다. 후속은 사람 또는 개발 AI 세션이 등록 문서 §3 표대로 | 아무도 안 읽으면 후속이 없다 |
| 매시 안전망 Routine | ✗ 소멸 | 위 워치독·러너 자기 재기동 | 없음(보조 신호였다) |
| 매일 시황 글 발행 | ✗ 소멸 | 없음(사람/다른 AI 가 `뉴스분석 스킬` 절차로) | 글이 안 나온다 |
| 월·금 제안 Routine | 이미 껐음 | `ops-daily` 코드 점검 | 없음 |
| 모의투자 러너(집 PC) | ✔(적용 뒤) | 작업 스케줄러 「GAEO Paper Trading」 | 집 PC 전원·로그인·토스 IP |
| 공개 화면 정직 표시 | ✔ | 정적 파일 | 없음 |

## 다음 행동 (정확히)

1. ~~구간 1 원격 몫~~ 완료. 집 PC 몫은 `HOME_PC_CHECKLIST.md`.
2. ~~구간 2~~ 완료.
3. ~~구간 3·4~~ 완료.
4. ~~구간 5~~ 완료(코드). 병합 뒤: `ops-daily` 를 `workflow_dispatch`(apply=false)로 한 번 돌려 계획 출력 확인 → Claude Routine 4건 프롬프트 재작성(`update_trigger`).
5. ~~구간 6~~ 완료(파일·정적 검사). Codex 실제 확인은 그 도구가 있는 환경에서 `docs/agent/CODEX_SCENARIOS.md`.
6. ~~구간 7·8~~ 완료(코드·문서). 소유자 결정: 용량 정책(`docs/HISTORY_PRESERVATION.md` §5).
7. ~~구간 9~~ 완료: PR #530 병합(main `4cdba5a7d7`) · ops-daily 첫 실행 성공 · 사이트 전달 확인 · Routine 4건 재작성.
8. ~~후속 실행 구간 A·C·E~~ 완료(PR #532·#533·#534 병합). 구간 D 와 구간 F(이 문서 정정)는 PR #535.
9. **다음 담당자의 첫 행동(순서대로)**: (1) 집 PC 에서 `HOME_PC_CHECKLIST.md` §3 — `scripts\paper_recover.ps1` 검사 모드 → 결과가 COVERED 일 때만 `-Mode apply` (걸리는 시간은 약속하지 않는다) (2) 9/15(월) 17:05 뒤 `docs/audits/validation_runs/ledger.jsonl` 에 `VS-20260915-DIANA-SHRINKAGE-CHECK` 줄이 생겼는지 — 없으면 Actions 탭에서 `ops-daily` 를 `apply=true` 로 1회 (3) 용량 정책 결정(`docs/HISTORY_PRESERVATION.md` §5) (4) Codex 가 있는 환경에서 `docs/agent/CODEX_SCENARIOS.md` §5 표 채우기 (5) 9/15 이후 매일 시황 글은 사람 또는 다른 AI 세션이 발행.
