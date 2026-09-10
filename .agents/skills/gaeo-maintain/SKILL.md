---
name: gaeo-maintain
description: GAEO 운영 유지보수 진입점. STATUS·통합 점검·수리 요청서를 먼저 읽고 필요한 역할만 쓴다. 기본 동작은 진단이며 사용자가 요청한 수정은 서버가 정상이어도 수행한다.
---

# gaeo-maintain — 공용 진입점 (Codex · 사람 · 다른 도구)

> 이 파일은 `sync_agent_compat.py` 가 `.claude/skills/gaeo-maintain/SKILL.md` 에서 **생성**한 얇은 진입점이다. 손으로 고치지 않는다(`test_agent_compat.py` 가 잠근다).
> 원본이 바뀌면 `python3 sync_agent_compat.py` 로 다시 만든다.

**절차 원본: `.claude/skills/gaeo-maintain/SKILL.md` — 그 문서를 그대로 읽고 따른다.** 여기에는 절차를 복제하지 않는다(복사본이 갈라지는 것을 막기 위해).

시작 전 순서(모든 도구 공통): `AGENTS.md` 작업 지도 → `docs/HARNESS.md` → `docs/operations/STATUS.md`. 검사는 `python3 gaeo_check.py <묶음>`.

원본에 나오는 Claude 전용 메커니즘은 이렇게 바꿔 읽는다.

| 원본 표현 | Codex / 사람이 할 일 |
|---|---|
| Agent 도구로 `<역할>` 호출 (병렬) | `.claude/agents/<역할>.md` 를 읽고 그 관점으로 **순차** 수행. 동시 2개 이내·정상 점검 0명 규칙은 그대로 |
| `/gaeo-*` 스킬 호출 | 해당 `.claude/skills/<이름>/SKILL.md` 를 읽고 따른다 |
| `mcp__github__*` 도구 | `gh` CLI 또는 GitHub 웹 화면(권한이 있을 때만). 못 보면 "확인 불가"로 적는다 — 정상으로 적지 않는다 |
| Routine(예약 실행) | GitHub Actions(`.github/workflows/ops-daily.yml`)가 맡는다. 새 예약을 만들지 않는다 |
| 역할의 `tools:` 에 Write/Edit 이 없음(읽기 전용) | **지침**이다 — 파일을 고치지 않는다. 가능하면 sandbox 를 읽기 전용으로 |
| 모델 지정 | 없다. 세션 기본값을 그대로 쓴다(자동 배정·라우터 없음) |
