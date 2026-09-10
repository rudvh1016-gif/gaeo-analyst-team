# 규칙 대응표 — 어디에 있던 규칙이 지금 어디에 있는가 (2026-09-10)

> 규칙은 **삭제가 아니라 이동**이다. 이 표의 각 줄을 `test_rules_map.py`가 확인한다:
> 지금 위치 파일이 있고, 그 안에 앵커(절 제목)가 있으며, `AGENTS.md`에 그 파일로 가는 안내가 남아 있고,
> `AGENTS.md` 전체가 Codex 기본 자동 읽기 한도(32KiB) 안에 있다.

## 1. `AGENTS.md`에서 옮긴 절 (원문 그대로)

| 원래 위치 (AGENTS.md 절) | 지금 위치 | 앵커(절 제목) | 언제 읽나 |
|---|---|---|---|
| 파일 맵 — 누가 무엇을 관리하는가 | `docs/rules/FILE_MAP.md` | `## 파일 맵 — 누가 무엇을 관리하는가` | 자동 생성 파일을 만지기 전 |
| ⭐ 카테고리(`cat` 필드) 철칙 | `docs/rules/CONTENT_PUBLISHING_RULES.md` | `## ⭐ 카테고리(\`cat\` 필드) 철칙` | 콘텐츠 글 추가·수정 |
| ⭐ 콘텐츠 발행 철칙 (+ 제목·요약 길이 기준) | `docs/rules/CONTENT_PUBLISHING_RULES.md` | `## ⭐ 콘텐츠 발행 철칙` | 콘텐츠 글 추가·수정 |
| 모의투자(Paper Trading) — 실행 주체는 언제나 한 곳뿐 | `docs/rules/PAPER_TRADING_RULES.md` | `## 모의투자(Paper Trading) — 실행 주체는 언제나 한 곳뿐` | 모의투자 코드·러너 작업 |
| index.html 구조 | `docs/rules/INDEX_HTML_STRUCTURE.md` | `## index.html 구조` | 화면 작업 |
| ⭐ 디자인 — 새 화면을 만들기 전에 읽을 것 (+ 2026-08-18 sweep) | `docs/rules/DESIGN_RULES.md` | `## ⭐ 디자인 — 새 화면을 만들기 전에 읽을 것` | 화면·디자인 작업 |

`AGENTS.md`에 남긴 것(전역): 정밀분석 발행 시스템 · 기존 기능 보존 · 프로젝트 정의 · 배포 규칙 · **작업 지도(신설)** · 데이터 파이프라인 ·
코딩 시 주의 · GAEO TEAM 안내 · Evolution Harness 규칙 · 작업 전 체크리스트. 옮긴 절 자리에는 한 줄 안내와 절대규칙 요약을 남겼다.

## 2. 스킬·역할의 공통 규칙 (2026-09-10 개정)

| 규칙 | 이전 | 지금 | 위치 |
|---|---|---|---|
| Agent 인원 | 작은 1~2 / 보통 2~4 / 전략·감사 3~5, review 항상 3명, health 기본 4명, build 마지막에 항상 qa | 기본 메인 1명, 정상 점검 0명, 독립 판단이 필요할 때 검토자 1명, 동시 2명 이내, 관점은 순서대로 | 각 `.claude/skills/gaeo-*/SKILL.md` 공통 절 · `docs/gaeo_team_system.md` |
| 배포 승인 | "main 자동 병합 흐름 없음, build도 별도 확인"(팀 문서) vs "PR·병합은 매번 확인받지 않는다"(AGENTS) — 충돌 | 그 세션의 사용자 지시 범위 안에서 확인 없이 진행. 파괴적·되돌리기 어려운 것만 명시 승인 | `docs/HARNESS.md` §3 · 스킬 공통 절 |
| 읽기 전용 역할 | tools에서 Edit/Write를 뺐다 = 읽기 전용 | **지침상** 읽기 전용이다. Bash가 있으면 기술적으로 쓸 수 있으므로 "물리적 차단"이라고 말하지 않는다 | `docs/agent/MIGRATION_MAP.md` |
| 모델 지정 | (없음) | 없음 유지. 역할 파일에 `model:`을 두지 않고 세션 기본값을 상속한다 | `.claude/agents/*.md` |
| 유지보수 진입 | `/gaeo-health`(읽기 전용 전수 점검) | `/gaeo-maintain`: STATUS → `ops_status.py` → 수리 요청서 순으로 읽고, 사용자가 수정을 요청했으면 서버가 정상이어도 그 수정을 한다 | `.claude/skills/gaeo-maintain/SKILL.md` |

## 3. 항상 읽히는 것과 그 일을 할 때만 읽는 것

- 항상: `AGENTS.md`(작업 지도 + 전역 규칙) → `docs/HARNESS.md` → `docs/operations/STATUS.md`. Claude Code는 `CLAUDE.md`도 자동으로 읽는다.
- 그 일을 할 때만: `docs/rules/*.md` · `docs/gaeo_design_system.md` · `docs/PAPER_TRADING_*.md` · `docs/gaeo_validation_policy.md` · `docs/PREREGISTRATION_BUY_FILTERS_20260905.md` · `docs/VALIDATION_SCHEDULE.md`.
- 하위 폴더 규칙 파일이 모든 도구에서 자동 적용된다고 가정하지 않는다. 루트 지도(`AGENTS.md` 작업 지도 표)에 필요한 파일을 명시한다.
