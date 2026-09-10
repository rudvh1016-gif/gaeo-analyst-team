# GAEO 작업 하네스 — 시작·검사·배포·복구·중단 기준 (한 장, 2026-09-10)

새 세션(Claude Code·Codex·사람)은 `AGENTS.md`의 「작업 지도」 → 이 문서 → `docs/operations/STATUS.md` 순으로 읽고 시작한다.
검사 실행에 모델을 부르는 구조는 없다. 아래 명령은 전부 일반 프로그램이다. 새 프레임워크가 아니라 기존 검사를 목적별로 묶은 것이다.

## 1. 시작 전 (변경 전 확인)
```
python3 gaeo_check.py preflight     # 작업 트리 · origin/main 기준 SHA · ahead/behind · 인계장 위치 (fetch 실패는 실패로 표시)
```
- 이전 보고서의 커밋을 최신이라 믿지 않는다. fetch 뒤 기준 SHA를 STATUS에 적는다.
- 다른 세션·수집기가 main을 움직였으면 diff를 먼저 본다. 같은 파일을 동시에 편집하지 않는다.
- 이 원격 세션은 네이버·gaeoteam.com 접근이 막힌다(`CLAUDE.md`). 사이트 실물은 "확인 불가"로 적는다.

## 2. 검사 입구 (목적별)
| 목적 | 명령 | 내용 |
|---|---|---|
| 빠른 검사 | `python3 gaeo_check.py quick` | 핵심 계약(CI 동등성·워크플로 크기/브랜치 가드·워치독·휴장일·Single Writer·통합 점검·일정·규칙 대응표) |
| 파이프라인 | `python3 gaeo_check.py pipeline` | 워치독·워크플로 유효성·크기·브랜치 실행·휴장일·달력 동기·지표·수급 |
| 모의투자 | `python3 gaeo_check.py paper` | 원장 회계·게이트·Single Writer·러너 동기화(이력 재작성 재현)·공백·토스 시세 경계 |
| 투자 계약 | `python3 gaeo_check.py investment-contract` | 사전등록 상수·가중치 축소·시장 상대 채점·Evolution·성적표 · 음성 대조/재현성/기준 고정(`test_validation_negative_control.py`). 봉인 결과는 열지 않는다. GAP 표: `docs/operations/INVESTMENT_VALIDATION_GAP.md` |
| 예정 시험 | `python3 gaeo_check.py schedule` | 일정 원본↔문서 동기·allowlist·원장 형식 · 실행기 계약(조기 실행 금지·하루 1회·원장 append-only·재확인 상한·동결 입력 재현·`ops-daily.yml` 정적 검사) · 확인 도구 계약(team_weights 전환·FLOW 표본 조건) |
| 호환성 | `python3 gaeo_check.py compatibility` | 규칙 대응표·CI 동등성·Secret 위생·디자인 계약 · Claude↔공용 진입점 동기(`test_agent_compat.py`: `.agents/skills`·`.codex/agents`·`docs/agent/ROLES.md`가 `sync_agent_compat.py` 출력과 같은가) |
| 병합 전 필수 | `python3 gaeo_check.py premerge` | `ci.yml`과 같은 것: `test_*.py` 전부 + Playwright 없는 `test_*.js` 전부 |
| 배포 후 확인 | `python3 gaeo_check.py postdeploy [--expect-sha SHA]` | `ops_status.py --github --probe-pages` 로 실제 증거를 읽어 정상/장애/확인 불가를 낸다 |
| 화면 smoke | `python3 gaeo_check.py browser` | Playwright 테스트 목록만 보여준다(실행은 확인된 환경에서 `NODE_PATH=/opt/node22/lib/node_modules node …`) |

출력은 임시 폴더(`gaeo-check/*.txt`)에 남고 화면에는 PASS/FAIL 한 줄만 나온다. 실패 파일만 연다.
`test_gaeo_check.py`가 "모든 `test_*.py`가 어느 묶음에든 들어 있는가"를 잠근다 — 새 테스트를 만들고 묶음에 안 넣으면 실패한다.
`test_ci_parity.py`가 "내 컴퓨터에만 있는 패키지"를 막는다.

## 3. 저장·병합·배포 규칙 (공통 기준)
1. 원인 확정 → 실패 재현 검사 → 최소 수정 → `quick`(또는 해당 묶음) → diff·Secret 확인 → commit → push(체크포인트).
2. 독립 배포 가능한 묶음만 `premerge` → PR → CI 초록 → 병합. 미완성은 브랜치에만 둔다.
3. main 병합 = GitHub Pages 배포다(별도 배포 단계 없음). 자동 생성 파일과 충돌하면 더 최신 수집 시각 쪽을 택한다(`AGENTS.md` 배포 절).
4. **PR 생성·main 병합은 그 세션의 사용자 지시 범위 안에서 확인 없이 진행한다**(2026-08-01 고정 승인). 스킬의 `Build → 검사 → 검토 → 병합` 순서는
   품질 절차이지 추가 승인 단계가 아니다. 다만 **파괴적·되돌리기 어려운 것은 항상 명시 승인**: force push·이력 재작성·원장 변경·산식/가중치/사전등록 상수 변경·
   `tickers.js` 교체·유료 전환·Routine 삭제. 과거 세션의 넓은 승인을 영구 배포 권한으로 쓰지 않는다.
5. 되돌리기: revert PR. 원장(`paper_trading/`)·판단 기록(`history.js`)·검증 원장(`docs/audits/validation_runs/`)은 어떤 되돌리기에서도 다시 쓰지 않는다.
6. 설치됨 ≠ 실제 작동 ≠ 성과 검증. 보고서에는 셋을 구분해 적는다.

## 4. 자동복구 — 허용 목록과 한계
"미리 검증한 절차만" 실행한다. 관찰 → 허용된 작은 복구 → 해결 안 되면 수리 요청서(`ops_status.py --repair-request`, 같은 사고는 같은 INC 번호).

| 복구 | 사전조건 | 횟수/시간 | 구현 위치 |
|---|---|---|---|
| 좀비 run 취소·재기동 | 산출물 임계 초과 + run 유예 경과(시세 25분·자동분석 60분) | 워치독 run 1회당 1회, 장중 15분 간격 | `pipeline_watchdog.py --apply` |
| 수집기 자진 사퇴 | 연속 저장(push) 실패 3회(시세)·2회(분석) | 사이클마다 판정 | `.github/workflows/update-prices.yml`·`.github/workflows/update-analysis.yml` + `.github/scripts/gaeo-chain.sh` |
| 러너 재기준(이력 재작성) | 공통 조상 없음 + 안 올린 Paper 기록 없음 | 사이클당 1회, 옛 HEAD 백업 | `scripts/paper_cycle.{sh,ps1}` |
| Paper push 재시도 | push 거부 | 4회, 충돌이면 abort·보존 | 같은 스크립트 |
| 알림 이슈 재사용·자동 닫기 | 제목/서명 동일 | 하루 1회(paper)·주 1회(evolution) | `.github/workflows/paper-health-alert.yml`·`.github/workflows/evolution-lab.yml` |
| 예정 시험 실행·기록 | `dueAt` 도래 + 오늘 기록 없음 + allowlist 명령 + 계약 테스트 통과 | 일정당 하루 1회 · 실행 실패 3회면 ESCALATED · 표본 부족 재확인 상한(기본 3)이면 RECHECK_LIMIT → 사람 | `.github/workflows/ops-daily.yml`(평일 17:05 KST) → `run_validation_schedule.py --apply` |
| 일일 통합 점검 이슈 | `ops_status.py --deep --github` 장애(exit 1) | 같은 서명은 1회만 · 정상이면 자동 닫기 · 확인 못 함(exit 2)은 침묵 | 같은 워크플로 |
| 저장소 이력 압축 | **자동 없음.** 사람이 `compact-history` 를 confirm 으로 dispatch + `check_history_evidence.py --precheck` 통과(얕은 clone·수집 시간대·러너 활동·원장 증거 손실 거부) | 실행 뒤 옛→새 SHA 지도 커밋, 검산 실패면 push 안 함 | `.github/workflows/compact-history.yml` · `docs/HISTORY_PRESERVATION.md` |

하지 않는 것: 확인하지 못한 run 취소 · 최신 main 무조건 재배포 · 과거 기록·원장 자동 rollback · 기준 완화 · 러너 clone의 `reset --hard`/force push ·
무인 AI 호출(수리 요청서는 사람/개발 AI 세션이 읽는다) · 거래를 만들려고 UNKNOWN을 정상으로 바꾸기.

## 5. 상태 어휘 (`ops_status.py` · 이슈 · 보고서 공통)
정상 / 정상 대기 / 자료 부족 / 장애 / 확인 불가 / 무료 한도 대기. 확인 전은 "확인 불가"다. 표본 부족은 "투자 검증 대기"이고,
수집기가 멈춰 표본이 안 쌓이는 것은 "운영 장애"다 — 둘을 섞지 않는다.

## 6. 중단·재개
- 사용량·세션 한도가 가까우면 `docs/operations/STATUS.md`(진도·커밋·다음 행동)부터 저장한다.
- 같은 입력·같은 방법의 실패 재시도는 최대 2회. 권한·관찰기간에 막힌 구간은 "막힘"으로 두고 독립 작업을 계속한다.
- 밤새 채팅으로 상태를 조회하며 기다리지 않는다. 자연 실행의 증거는 워치독 Step Summary·`ops-daily` 실행·이슈가 남긴다.

## 7. 문서 지도
- 안전 규칙: `AGENTS.md`(작업 지도 + 전역 규칙) · 세부 규칙: `docs/rules/*.md` · 대응표: `docs/agent/RULES_MAP.md`
- 계획·진도: `docs/operations/MASTER_PLAN.md` · `docs/operations/STATUS.md` · 집 PC 할 일: `docs/operations/HOME_PC_CHECKLIST.md`
- 감시·복구: `docs/PIPELINE_WATCHDOG.md` · `docs/ARCHITECTURE.md`(6중 안전망) · 모의투자: `docs/PAPER_TRADING_LOCAL_RUNNER.md` · 이력 보존: `docs/HISTORY_PRESERVATION.md`
- 예정 시험: `docs/VALIDATION_SCHEDULE.md`(원본 `config/validation_schedule.json`, 실행기 `run_validation_schedule.py` + `.github/workflows/ops-daily.yml`, 기록 `docs/audits/validation_runs/`) · 투자검증: `docs/gaeo_validation_policy.md` · `docs/PREREGISTRATION_BUY_FILTERS_20260905.md`
- Claude/Codex 공용화: `docs/agent/MIGRATION_MAP.md` · 역할표 `docs/agent/ROLES.md` · Codex 확인 시나리오 `docs/agent/CODEX_SCENARIOS.md` · 생성기 `sync_agent_compat.py` · 유지보수 진입점: `.claude/skills/gaeo-maintain/SKILL.md`(공용 진입점 `.agents/skills/gaeo-maintain/SKILL.md`)
