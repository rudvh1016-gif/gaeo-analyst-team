---
name: 종목분석 스킬
description: 개오 애널리스트팀(저장소 루트) 주식 정밀분석 갱신. 정밀분석 대상 종목(analysis.js의 13개 안팎)을 팀 5인 관점(기술·재무·뉴스·수급·종합)으로 분석해 analysis.js를 다시 쓰고 history.js에 기록한다. "정밀분석 해줘 / analysis.js 갱신해줘 / 개오 팀 재분석해줘 / ○○종목만 분석해줘"처럼 **정밀분석·재분석임이 명시적인 요청에만** 사용 — "업데이트해줘/오늘 기준으로 반영해줘/상세하게 해줘"처럼 모호한 지시는 이 스킬(14종목 전체 재작성)을 함부로 트리거하지 말고 먼저 범위를 확인한다.
---

# 종목분석 스킬 — 공용 진입점 (Codex · 사람 · 다른 도구)

> 이 파일은 `sync_agent_compat.py` 가 `.claude/skills/종목분석 스킬/SKILL.md` 에서 **생성**한 얇은 진입점이다. 손으로 고치지 않는다(`test_agent_compat.py` 가 잠근다).
> 원본이 바뀌면 `python3 sync_agent_compat.py` 로 다시 만든다.

**절차 원본: `.claude/skills/종목분석 스킬/SKILL.md` — 그 문서를 그대로 읽고 따른다.** 여기에는 절차를 복제하지 않는다(복사본이 갈라지는 것을 막기 위해).

시작 전 순서(모든 도구 공통): `AGENTS.md` 작업 지도 → `docs/HARNESS.md` → `docs/operations/STATUS.md`. 검사는 `python3 gaeo_check.py <묶음>`.

원본에 나오는 Claude 전용 메커니즘은 이렇게 바꿔 읽는다.

| 원본 표현 | Codex / 사람이 할 일 |
|---|---|
| Agent 도구로 `<역할>` 호출 (병렬) | `.claude/agents/<역할>.md`(Codex 면 `.codex/agents/<역할>.toml` 의 developer_instructions 에 같은 원문)를 읽고 그 관점으로 **순차** 수행. 동시 실행 AI 는 **메인 포함 2개 이내**·정상 점검 0명 규칙은 그대로 |
| 검토자 Agent 를 불러 독립 검토 | 같은 AI(같은 세션)가 역할만 바꿔 보는 것은 **독립 검토가 아니다**. 독립 검토 = 별도 세션의 검토자 1명(사람 또는 별도 AI 세션) 또는 기계 검사(`test_*`·`gaeo_check.py`) |
| `/gaeo-*` 스킬 호출 | 해당 `.claude/skills/<이름>/SKILL.md` 를 읽고 따른다 |
| `mcp__github__*` 도구 | `gh` CLI 또는 GitHub 웹 화면(권한이 있을 때만). 못 보면 "확인 불가"로 적는다 — 정상으로 적지 않는다 |
| Routine(예약 실행) | GitHub Actions(`.github/workflows/ops-daily.yml`)가 맡는다. 새 예약을 만들지 않는다 |
| 역할의 `tools:` 에 Write/Edit 이 없음(읽기 전용) | **지침**이다 — 파일을 고치지 않는다. Codex 에서는 `.codex/agents/<역할>.toml` 의 `sandbox_mode = "read-only"` 가 강제한다(설치본 인식은 미확인). Claude 식 `tools`·`read_only` 키가 Codex 에서 강제된다고 가정하지 않는다 |
| 모델 지정 | 없다. 세션 기본값을 그대로 쓴다(자동 배정·라우터 없음) |
