# Codex(또는 다른 개발 AI·사람)로 같은 일을 하는 시나리오 4개 — 실제 앱 확인용 (2026-09-10)

> 목적: Claude 를 해지해도 규칙·스킬·역할·예정 시험이 남는지 **실제 도구에서** 확인하는 절차다.
> 이 세션에는 Codex 가 없고, Codex 공식 문서(developers.openai.com/codex/*)도 이 원격 세션의 egress 정책에 막혀 읽지 못했다
> (2026-09-10 실측: `raw.githubusercontent.com/openai/codex/main/docs/skills.md` 는 그 사이트로 가라는 안내 한 줄만 있다).
> 그래서 아래 표의 "실제 앱 확인" 칸은 전부 **미확인**이다. Fable/Claude 가 Codex 인 척 수행한 결과를 Codex 통과 증거로 쓰지 않는다.
> 확인 가능한 환경(정식 인증·기존 사용량 범위·새 지출 0)에서 한 번 돌리고, 결과를 이 문서 §5 표에 적는다.

## 0. 공통 준비 (어느 도구든)

1. 저장소 최신 `main` 을 받는다. 시작 순서: `AGENTS.md` 「작업 지도」 → `docs/HARNESS.md` → `docs/operations/STATUS.md`.
2. `python3 gaeo_check.py preflight` 가 돈다(fetch 실패는 실패로 표시된다 — "확인 불가"를 정상으로 읽지 않는다).
3. 도구가 `.agents/skills/` 를 스킬로 인식하는지 본다. 인식하지 않아도 **같은 파일을 텍스트로 열어 읽으면** 절차는 같다(진입점이 원본 경로를 안내한다).
4. 도구가 `.codex/agents/*.toml` 을 프로젝트 커스텀 에이전트로 읽는지 본다(공식 스펙 키 `name`·`description`·`developer_instructions`·`sandbox_mode` — 2026-09-10 지시서 기준, 공식 문서 직접 대조는 egress 차단으로 미확인). 읽지 못해도 `docs/agent/ROLES.md` 와 `.claude/agents/*.md` 를 읽으면 같은 역할 정보를 얻는다(TOML 의 developer_instructions 가 그 원문이다). 읽기 전용 역할(`sandbox_mode = "read-only"`)이 실제로 파일을 못 고치는지도 이때 확인한다.
   동시 실행 AI 는 메인 포함 2개 이내. 같은 Codex 세션이 역할만 바꿔 검토하는 것은 독립 검토로 적지 않는다(별도 세션·사람·기계 검사만 독립 검토).
5. 새 유료 API·서버·크레딧을 쓰지 않는다. 무료 한도가 부족하면 "중단 · 자료 부족"으로 적고 끝낸다.

## 1. 읽기 전용 유지보수 (진단만)

- 절차: `.agents/skills/gaeo-maintain/SKILL.md` → 원본 `.claude/skills/gaeo-maintain/SKILL.md` 를 그대로 따른다. 0단계는 `docs/operations/STATUS.md` 읽기 → `python3 ops_status.py` → `docs/operations/repair_requests/` 확인.
- 기대: 상태 어휘 6종(정상/정상 대기/자료 부족/장애/확인 불가/무료 한도 대기)으로 요약이 나오고, **파일을 하나도 고치지 않는다**(`git status --porcelain` 이 비어 있다).
- 합격: 요약이 실제 파일 시각과 맞고, "확인하지 못한 것"이 "정상"으로 적히지 않았다. 러너 취소·재기동·커밋을 하지 않았다.
- 실패 시: 도구가 읽기 전용 지침을 어기고 파일을 고쳤다면 그 도구의 sandbox 를 read-only 로 두고 다시 한다. 지침만으로 막히지 않는 것은 **알려진 한계**다(`docs/agent/MIGRATION_MAP.md`).

## 2. 격리된 문구 수정 (작은 쓰기)

- 대상: `docs/` 아래 문서 한 곳의 오탈자 또는 `index.html` 의 화면 문구 1개(산식·데이터·자동 생성 파일은 금지 — `docs/rules/FILE_MAP.md`).
- 절차: `.agents/skills/gaeo-build/SKILL.md` → 원본. 변경 → `python3 gaeo_check.py quick`(문서만이면 `compatibility`) → 브랜치 commit → PR → CI 초록 → 병합(`docs/HARNESS.md` §3).
- 기대: diff 가 그 한 곳뿐이다. 커밋 메시지에 모델 식별자가 없다. 자동 생성 파일(`data.js`·`history.js`·`auto_analysis.js` 등)이 diff 에 없다.
- 합격: CI 초록 + 병합 뒤 `python3 gaeo_check.py postdeploy` 가 "확인 불가"가 아닌 실제 판정을 낸다(네트워크가 있는 환경에서).

## 3. 저장된 장애 사례 인계 (수리 요청서 → 원인 → 수정)

- 준비: `docs/operations/repair_requests/INC-*.md` 중 하나(없으면 `ops_status.py --repair-request <임시폴더>` 로 만든 예시를 쓴다. 저장소에는 커밋하지 않는다).
- 절차: `.agents/skills/gaeo-bug/SKILL.md` → 원본. 0단계(STATUS·ops_status·요청서 읽기) → 재현 검사 작성 → 최소 수정 → 해당 묶음 검사.
- 기대: 요청서의 INC 번호·서명을 그대로 인용하고, "같은 사고는 같은 번호" 규칙을 지킨다. 재현 검사가 수정 전에 실패하고 수정 뒤 통과한다.
- 합격: 수정 범위가 요청서가 가리킨 곳을 벗어나지 않고, 산식·가중치·사전등록 상수·테스트 기준을 건드리지 않았다.

## 4. 예정 시험 일정 조회 · 실행기 계획 모드

- 절차: `docs/VALIDATION_SCHEDULE.md`(원본 `config/validation_schedule.json`) 읽기 → `python3 run_validation_schedule.py`(계획만, 파일 안 씀) → `python3 gaeo_check.py schedule`.
- 기대: 도래하지 않은 일정은 NOT_DUE, 지난 일정은 원장(`docs/audits/validation_runs/ledger.jsonl`)의 기록 상태가 보인다. 실행기는 `--apply` 없이 아무 파일도 쓰지 않는다.
- 합격: 출력이 `docs/VALIDATION_SCHEDULE.md` 표와 일치한다. 도구가 "미리 실행해 보자"며 `--apply` 를 붙이지 않았다(조기 실행 금지).
- 참고: 실제 실행·기록은 `.github/workflows/ops-daily.yml` 이 평일 17:05 KST 에 한다. Codex 세션은 결과를 **읽고** 등록 문서 §3 표에 미리 적힌 후속만 수행한다.

## 5. 실행 기록 (확인한 사람이 적는다)

| 시나리오 | 도구·버전 | 날짜 | 결과 | 비고 |
|---|---|---|---|---|
| 1 읽기 전용 유지보수 | - | - | 미확인 | |
| 2 격리된 문구 수정 | - | - | 미확인 | |
| 3 장애 사례 인계 | - | - | 미확인 | |
| 4 일정 조회·계획 모드 | - | - | 미확인 | |
| (참고) Claude Code, 이 세션 | Claude Code 원격 세션 | 2026-09-10 | 스킬 목록에 `gaeo-maintain` 포함 확인 · `gaeo_check`·`ops_status`·실행기 계획 모드 실행 확인 | Claude 확인이며 Codex 확인이 아니다 |
