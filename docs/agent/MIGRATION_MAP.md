# Claude 전용 항목 → 공용/Codex 대응표 (2026-09-10)

> 목적: Claude를 해지하고 Codex(또는 사람)만 써도 규칙·스킬·역할·시험 일정이 남게 한다.
> `.claude/`는 삭제하지 않는다(Claude Code는 그대로 유지). 공용 원본을 하나 두고 도구별 얇은 진입점이 그것을 읽는다.
> 확인 수준을 세 칸으로 구분한다 — **파일 준비** / **정적 검사**(`test_agent_compat.py`) / **실제 앱 확인**(Codex 설치본에서 인식·실행).
> 이 세션에는 Codex가 없으므로 "실제 앱 확인" 칸은 전부 미확인이다. Fable이 Codex인 척 수행한 결과를 Codex 통과 증거로 쓰지 않는다.

## 1. 이전 목록과 분류

| Claude 전용 항목 | 분류 | 공용 원본 / 대응 | 파일 준비 | 정적 검사 | 실제 앱 확인 |
|---|---|---|---|---|---|
| `CLAUDE.md` (Claude Code 자동 읽기) | 공용화 | 공통 규칙은 `AGENTS.md`(Codex도 자동 읽기, 32KiB 안) + `docs/HARNESS.md`. `CLAUDE.md`는 Claude 전용 보충만 남김 | 완료 | `test_rules_map.py` | Claude: 이 세션에서 동작 확인 / Codex: 미확인 |
| `.claude/settings.json` SessionStart 훅 → `check_pipeline.py` | 도구별 얇은 진입점 | 공용 preflight = `python3 gaeo_check.py preflight` + `python3 ops_status.py`. Codex 설치본이 호환 훅을 지원하는지 미확인 → `AGENTS.md` 작업 지도가 명시적으로 부르게 함("자동 시작 미지원"으로 표시) | 완료 | `test_gaeo_check.py` | 미확인 |
| `.claude/skills/gaeo-*` 9개 + `gaeo-maintain` (개발·점검 스킬) | 얇은 진입점 | 원본은 `.claude/skills/<name>/SKILL.md`(형식: frontmatter name/description + 본문). Codex용 `.agents/skills/<name>/SKILL.md`는 같은 name/description에 "원본을 그대로 읽고 따른다"는 본문(구간 6) | 구간 6 | 구간 6 `test_agent_compat.py` | 미확인 |
| `.claude/skills/종목분석 스킬`·`뉴스분석 스킬` (사용자 기능 절차) | 얇은 진입점 | 위와 같은 방식. 이번에 실행하거나 콘텐츠를 다시 발행하지 않는다 | 구간 6 | 구간 6 | 미확인 |
| `.claude/skills/seo-*`·`impeccable`·`accessibility`·`web-quality-audit`·`ui-ux-pro-max`·`taste-skill` 등 외부 스킬 | 보존만 | 외부 라이선스 파일 포함. 복제하지 않는다. Codex에서 필요하면 같은 경로를 텍스트로 읽는다 | 해당 없음 | - | - |
| `.claude/agents/gaeo-*.md` 8개 (개발 역할) | 공용화 + 얇은 진입점 | 공용 원본은 그대로 `.claude/agents/*.md`(Markdown 지침). 도구 무관 요약 `docs/agent/ROLES.md`를 생성(구간 6). Codex 역할 파일 형식(`.codex/agents/*.toml`)은 이 세션에서 공식 문서로 확인하지 못함 → 만들더라도 "형식 미확인"으로 표시 | 구간 6 | 구간 6 | 미확인 |
| `.claude/agents/chief-pm·diana·flow·nova·taro` (정밀분석 5인) | 공용화 | 같은 방식. Codex는 5개 관점을 순차 수행(`CLAUDE.md` 기존 안내) | 구간 6 | 구간 6 | 미확인 |
| `.claude/agents/seo-*.md` (외부 SEO 에이전트) | 보존만 | 외부 자료. 복제하지 않는다 | - | - | - |
| 역할 파일의 `tools:`(Edit/Write 제외 = 읽기 전용) | 수동 확인 필요 | Codex에 그대로 적용된다고 가정하지 않는다. 읽기 전용은 **지침**이며 Bash가 있으면 기술적으로 쓸 수 있다. Codex는 sandbox 모드(read-only 등)로 대응 — 설치본에서 확인 | 문서화 완료 | - | 미확인 |
| 역할 파일의 모델 지정 | 해당 없음 | 어느 역할 파일에도 `model:`이 없다(2026-09-10 확인). 세션 기본값 상속 유지. 자동 배정·라우터 없음 | 확인 완료 | 구간 6 검사에 포함 | - |
| Claude Routine 15건(예약 실행) | 공용화(일정+실행) / 미지원(채팅 제안) | 예정 시험 4건 → `config/validation_schedule.json` + GitHub 실행기 `run_validation_schedule.py` + `.github/workflows/ops-daily.yml`(평일 17:05 KST, allowlist·하루 1회·append-only 원장·동결 입력 재현). 매시 안전망 v6·매일 시황 발행·주간 제안은 Claude 세션 전용(Codex에 예약 실행 없음) — `docs/operations/STATUS.md` Routine 표에 상태 기록 | 완료(구간 5) | `test_validation_schedule.py`·`test_validation_runner.py`·`test_validation_checks.py` | 병합 뒤 첫 `ops-daily` run(dispatch apply=false = 계획 출력)으로 확인. 실제 due 시험 기록은 9/15 이후 |
| Routine 안의 `mcp__github__*` 도구 호출 | 미지원 | GitHub Actions(`GITHUB_TOKEN`)가 같은 일을 한다(워치독·일정 실행기). 채팅 세션 밖에서는 MCP를 쓰지 않는다 | 완료 | - | - |
| 이 원격 세션 환경 특이사항(네이버 403·gaeoteam.com 403·Chromium 경로·NODE_PATH) | 수동 확인 필요 | `CLAUDE.md`에 남긴다. Codex 실행 환경(앱/로컬/클라우드)마다 다르므로 "이 환경에서만"이라고 표시. 도구·네트워크 접근이 같다고 가정하지 않는다 | 문서화 완료 | - | 미확인 |
| `docs/gaeo_team_system.md`의 Agent Team 병렬 호출 방식 | 공용화 | 2026-09-10 절약형 개정: 메인 1명·동시 2명 이내·관점 순서대로. Codex는 서브에이전트 없이 순차 수행하면 같은 결과 | 완료 | - | - |

## 2. 검증 수준 분리 (구간 6에서 실제로 수행)

1. 정적 검사(`test_agent_compat.py`): 얇은 진입점의 name/description이 원본과 같다 · 원본 경로가 존재한다 · 같은 이름이 한 도구 안에서 두 번 노출되지 않는다 · 상대경로·scripts·assets 참조가 깨지지 않는다 · 역할 파일에 `model:`이 없다.
2. Claude 확인: 이 세션에서 `.claude/skills` 진입점이 그대로 보이고 동작한다(스킬 목록에 `gaeo-maintain`이 추가된 것을 확인).
3. Codex 확인: Codex가 정식 인증·기존 사용량 범위로 실행 가능한 환경에서만. 이 세션에는 Codex가 없어 **미확인**. 시나리오(읽기 전용 유지보수 / 격리된 문구 수정 / 저장된 장애 사례 인계 / 일정표 조회)는 `docs/agent/CODEX_SCENARIOS.md`(구간 6)에 적어 두고 그 환경에서 돌린다.

## 3. Windows 주의
symlink 대신 실제 파일(얇은 진입점)을 쓴다. 생성·동기화 검사로 복사본 갈라짐을 막는다(`test_agent_compat.py`).
