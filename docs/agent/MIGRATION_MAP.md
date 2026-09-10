# Claude 전용 항목 → 공용/Codex 대응표 (2026-09-10)

> 목적: Claude를 해지하고 Codex(또는 사람)만 써도 규칙·스킬·역할·시험 일정이 남게 한다.
> `.claude/`는 삭제하지 않는다(Claude Code는 그대로 유지). 공용 원본을 하나 두고 도구별 얇은 진입점이 그것을 읽는다.
> 확인 수준을 세 칸으로 구분한다 — **파일 준비** / **정적 검사**(`test_agent_compat.py`) / **실제 앱 확인**(Codex 설치본에서 인식·실행).
> 이 세션에는 Codex가 없으므로 "실제 앱 확인" 칸은 전부 미확인이다. Fable이 Codex인 척 수행한 결과를 Codex 통과 증거로 쓰지 않는다.
> Codex 공식 문서(developers.openai.com/codex/subagents · /codex/skills)는 이 원격 세션의 egress 정책에 막혀 직접 읽지 못했다(2026-09-10 두 차례 실측, GitHub raw docs는 그 사이트로 가라는 안내만 있음). 그래서 `.codex/agents/*.toml` 은 **사용자 지시서에 적힌 2026-09-10 기준 공식 스펙**(필수 `name`·`description`·`developer_instructions`, 지원 설정 `sandbox_mode`)에 맞췄고, `.agents/skills/<name>/SKILL.md`(frontmatter `name`·`description`) 레이아웃도 지시서를 따랐다. 공식 문서 직접 대조·Codex 설치본 인식은 **미확인**이다. 생성기·검사: `sync_agent_compat.py` · `test_agent_compat.py`.

## 1. 이전 목록과 분류

| Claude 전용 항목 | 분류 | 공용 원본 / 대응 | 파일 준비 | 정적 검사 | 실제 앱 확인 |
|---|---|---|---|---|---|
| `CLAUDE.md` (Claude Code 자동 읽기) | 공용화 | 공통 규칙은 `AGENTS.md`(Codex도 자동 읽기, 32KiB 안) + `docs/HARNESS.md`. `CLAUDE.md`는 Claude 전용 보충만 남김 | 완료 | `test_rules_map.py` | Claude: 이 세션에서 동작 확인 / Codex: 미확인 |
| `.claude/settings.json` SessionStart 훅 → `check_pipeline.py` | 도구별 얇은 진입점 | 공용 preflight = `python3 gaeo_check.py preflight` + `python3 ops_status.py`. Codex 설치본이 호환 훅을 지원하는지 미확인 → `AGENTS.md` 작업 지도가 명시적으로 부르게 함("자동 시작 미지원"으로 표시) | 완료 | `test_gaeo_check.py` | 미확인 |
| `.claude/skills/gaeo-*` 10개 + `gaeo`(안내) (개발·점검 스킬) | 얇은 진입점 | 원본은 `.claude/skills/<name>/SKILL.md`. `sync_agent_compat.py`가 `.agents/skills/<name>/SKILL.md`를 생성 — 같은 name/description + "원본을 그대로 읽고 따른다" + Claude 전용 메커니즘 대응표(Agent 병렬→순차·Skill 호출→파일 읽기·MCP→gh/웹·Routine→ops-daily·읽기 전용=지침·모델 지정 없음). 절차 복제 없음 | 완료(11개) | `test_agent_compat.py`(동기·이름 일치·복제 없음·참조 경로 존재) | 미확인 — `docs/agent/CODEX_SCENARIOS.md` |
| `.claude/skills/종목분석 스킬`·`뉴스분석 스킬` (사용자 기능 절차) | 얇은 진입점 | 위와 같은 방식(`.agents/skills/종목분석 스킬/`·`뉴스분석 스킬/`). 이번에 실행하거나 콘텐츠를 다시 발행하지 않았다 | 완료(2개) | `test_agent_compat.py` | 미확인 |
| `.claude/skills/seo-*`·`impeccable`·`accessibility`·`web-quality-audit`·`ui-ux-pro-max`·`taste-skill` 등 외부 스킬 | 보존만 | 외부 라이선스 파일 포함. 복제하지 않는다. Codex에서 필요하면 같은 경로를 텍스트로 읽는다 | 해당 없음 | - | - |
| `.claude/agents/gaeo-*.md` 9개 (개발 역할, `gaeo-product-analytics` 포함) | 공용화 + 얇은 진입점 | 공용 원본은 그대로 `.claude/agents/*.md`. 도구 무관 요약 `docs/agent/ROLES.md` 생성. `.codex/agents/<name>.toml` 은 공식 스펙 키 넷만(`name`·`description`·`developer_instructions`·`sandbox_mode`) — `developer_instructions` 에 원본 상대 경로 + 원문 전체 + 공통 규칙(읽기 전용·독립 검토·동시 2개 이내·모델 지정 없음), `sandbox_mode` 는 쓰기 도구 유무로 `read-only`/`workspace-write`(쓰기는 `gaeo-engineer` 만). 옛 키(`instructions_file`·`tools`·`read_only`)는 2026-09-10 구간 E 에서 제거(Codex 가 강제하지 않는 Claude 식 키였다). 파일 머리에 **실제 앱 확인 미확인** 표시, `model` 키 없음 | 완료 | `test_agent_compat.py`(키 집합 정확히 넷·name=파일명·원문 포함·sandbox 판정·이름 중복/규격 거부·미확인 표시·model 없음·ROLES 전수) | 미확인 |
| `.claude/agents/chief-pm·diana·flow·nova·taro` (정밀분석 5인) | 공용화 | 같은 방식(ROLES.md 별도 절 + `.codex/agents/*.toml`). Codex는 5개 관점을 순차 수행(`CLAUDE.md` 기존 안내) | 완료 | `test_agent_compat.py` | 미확인 |
| `.claude/agents/seo-*.md` (외부 SEO 에이전트) | 보존만 | 외부 자료. 복제하지 않는다 | - | - | - |
| 역할 파일의 `tools:`(Edit/Write 제외 = 읽기 전용) | 공용화(권한 경계) + 수동 확인 필요 | Claude 식 `tools`·`read_only` 가 Codex 에서 강제된다고 가정하지 않는다. Codex 쪽 권한 경계는 `.codex/agents/<name>.toml` 의 `sandbox_mode = "read-only"`(쓰기 역할만 `workspace-write`)로 적용했다 — 설치본이 이 설정을 실제로 강제하는지는 미확인. 읽기 전용은 그래도 **지침**으로도 적혀 있다(developer_instructions) | 완료(구간 E) | `test_agent_compat.py`(sandbox 판정) | 미확인 |
| 역할 파일의 모델 지정 | 해당 없음 | **GAEO 소유 역할 파일 14개**(gaeo-* 9 + 정밀분석 5)에는 `model:`이 없다(2026-09-10 재확인). 세션 기본값 상속, 자동 배정·라우터 없음. ⚠️ 정정: 외부 SEO 에이전트 `.claude/agents/seo-*.md`(보존만)에는 원문에 `model: sonnet`이 있다 — 우리 것이 아니라 바꾸지 않고 검사 범위에서 뺀다(첫 판의 "어느 역할 파일에도 없다"는 부정확했다) | 확인 완료 | `test_agent_compat.py` | - |
| Claude Routine 15건(예약 실행) | 공용화(일정+실행) / 미지원(채팅 제안) | 예정 시험 4건 → `config/validation_schedule.json` + GitHub 실행기 `run_validation_schedule.py` + `.github/workflows/ops-daily.yml`(평일 17:05 KST, allowlist·하루 1회·append-only 원장·동결 입력 재현). 매시 안전망 v6·매일 시황 발행·주간 제안은 Claude 세션 전용(Codex에 예약 실행 없음) — `docs/operations/STATUS.md` Routine 표에 상태 기록 | 완료(구간 5) | `test_validation_schedule.py`·`test_validation_runner.py`·`test_validation_checks.py` | 병합 뒤 첫 `ops-daily` run(dispatch apply=false = 계획 출력)으로 확인. 실제 due 시험 기록은 9/15 이후 |
| Routine 안의 `mcp__github__*` 도구 호출 | 미지원 | GitHub Actions(`GITHUB_TOKEN`)가 같은 일을 한다(워치독·일정 실행기). 채팅 세션 밖에서는 MCP를 쓰지 않는다 | 완료 | - | - |
| 이 원격 세션 환경 특이사항(네이버 403·gaeoteam.com 403·Chromium 경로·NODE_PATH) | 수동 확인 필요 | `CLAUDE.md`에 남긴다. Codex 실행 환경(앱/로컬/클라우드)마다 다르므로 "이 환경에서만"이라고 표시. 도구·네트워크 접근이 같다고 가정하지 않는다 | 문서화 완료 | - | 미확인 |
| `docs/gaeo_team_system.md`의 Agent Team 병렬 호출 방식 | 공용화 | 2026-09-10 절약형 개정: 메인 1명·**메인 포함 동시 2개 이내**·관점 순서대로. Codex는 서브에이전트 없이 순차 수행하면 같은 결과. ⚠️ 정정(구간 E): 같은 AI(같은 세션)가 역할만 바꿔 검토하는 것은 **독립 검토가 아니다** — 독립 검토는 별도 세션의 검토자 1명(사람·별도 AI 세션) 또는 기계 검사(`test_*`·`gaeo_check.py`). 진입점 대응표·ROLES·TOML 지침에 같은 문장을 넣었다 | 완료 | `test_agent_compat.py` | - |

## 2. 검증 수준 분리 (구간 6에서 실제로 수행)

1. 정적 검사(`test_agent_compat.py`, 2026-09-10 구간 E 기준 14건 PASS): 생성물이 `sync_agent_compat.py` 출력과 바이트 단위로 같다 · 진입점의 name/description이 원본과 같다 · 원본 경로가 존재한다 · 같은 이름이 두 번 노출되지 않는다 · 진입점이 절차를 복제하지 않는다 · 스킬 원본이 백틱으로 가리키는 저장소 파일이 실제로 있다 · GAEO 역할 파일에 `model:`이 없다 · `.codex/agents/*.toml`이 TOML로 읽히고 키가 정확히 공식 스펙 넷이며 원문·상대 경로·sandbox_mode 가 맞고 "실제 앱 확인 미확인" 표시가 있다 · 생성기가 이름 중복·규격 위반·원본 없음을 거부한다.
2. Claude 확인: 이 세션에서 `.claude/skills` 진입점이 그대로 보이고 동작한다(스킬 목록에 `gaeo-maintain`이 추가된 것을 확인).
3. Codex 확인: Codex가 정식 인증·기존 사용량 범위로 실행 가능한 환경에서만(새 구독·API 키·계정 전체 설정 변경 0). 이 세션에는 Codex 실행 파일이 없고 공식 문서도 egress 에 막혀 **미확인** — "내일 바로 시험 가능한 인계" 상태다. 시나리오 4개(읽기 전용 유지보수 / 격리된 문구 수정 / 저장된 장애 사례 인계 / 일정표 조회·계획 모드)와 결과 기록표는 `docs/agent/CODEX_SCENARIOS.md`. 그 환경에서 돌리고 §5 표에 적는다.

## 3. Windows 주의
symlink 대신 실제 파일(얇은 진입점)을 쓴다. 생성·동기화 검사로 복사본 갈라짐을 막는다(`test_agent_compat.py`).
