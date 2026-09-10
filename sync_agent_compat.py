#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Claude 전용 진입점(.claude/skills · .claude/agents) → 도구 무관 공용 파일 생성·동기화 (2026-09-10, 구간 6).

왜
  규칙·스킬·역할의 **원본은 하나**(`.claude/…`)만 둔다. Codex(또는 사람)가 같은 일을 하려면 그 원본을 그대로 읽으면 되지만,
  Codex 는 `.claude/` 를 자동으로 보지 않는다. 그래서 같은 name/description 을 가진 **얇은 진입점**을 `.agents/skills/` 에 두고,
  본문에는 "원본을 그대로 읽고 따른다" + Claude 전용 메커니즘(Agent 병렬 호출·Skill 호출·MCP·Routine)의 대응표만 적는다.
  절차를 복제하지 않으므로 복사본이 갈라질 일이 없고, 이 스크립트의 --check 가 "원본이 바뀌었는데 진입점이 안 따라온" 상태를 잡는다.

생성물 (손으로 고치지 않는다 — test_agent_compat.py 가 잠근다)
  .agents/skills/<name>/SKILL.md   GAEO 소유 스킬 13개의 얇은 진입점
  .codex/agents/<name>.toml        GAEO 소유 역할 14개 — Codex 프로젝트 커스텀 에이전트 형식(2026-09-10 지시서 기준 공식 스펙):
                                   필수 name · description · developer_instructions, 지원 설정 sandbox_mode(read-only / workspace-write).
                                   developer_instructions 에 원본 역할 지침 원문을 그대로 싣는다(Codex 는 .claude/ 를 자동으로 읽지 않는다).
                                   ⚠️ 실제 앱 확인 미확인: 공식 문서는 이 세션 egress 에 막혀 읽지 못했고 Codex 설치본에서 인식을 확인하지 못했다.
  docs/agent/ROLES.md              역할 14개 요약표(도구·쓰기 권한·sandbox_mode·원본 경로). 모델 지정 없음.

범위 밖(복제하지 않는다): 외부 스킬(seo-*, impeccable, taste-skill, ui-ux-pro-max, accessibility, best-practices,
  core-web-vitals, performance, web-quality-audit) · 외부 SEO 에이전트(seo-*.md). 라이선스 파일 포함 원본 그대로 보존.

    python3 sync_agent_compat.py            # 생성(덮어쓰기)
    python3 sync_agent_compat.py --check    # 생성물이 원본과 같은지만 확인 (0 = 최신, 1 = 다시 생성 필요)
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CLAUDE_SKILLS = os.path.join(HERE, ".claude", "skills")
CLAUDE_AGENTS = os.path.join(HERE, ".claude", "agents")
AGENTS_SKILLS = os.path.join(HERE, ".agents", "skills")
CODEX_AGENTS = os.path.join(HERE, ".codex", "agents")
ROLES_DOC = os.path.join(HERE, "docs", "agent", "ROLES.md")

# GAEO 가 직접 쓴 스킬(원본 .claude/skills/<name>/SKILL.md)
GAEO_SKILLS = ["gaeo", "gaeo-bug", "gaeo-build", "gaeo-design", "gaeo-evolve", "gaeo-growth", "gaeo-health",
               "gaeo-maintain", "gaeo-quant", "gaeo-review", "gaeo-strategy", "뉴스분석 스킬", "종목분석 스킬"]
# GAEO 가 직접 쓴 역할(원본 .claude/agents/<name>.md): 개발·점검 8 + 정밀분석 5
GAEO_DEV_AGENTS = ["gaeo-product-lead", "gaeo-quant-research", "gaeo-data-analyst", "gaeo-engineer", "gaeo-qa",
                   "gaeo-ux-designer", "gaeo-growth-lead", "gaeo-security"]
GAEO_ANALYST_AGENTS = ["chief-pm", "taro-technical", "diana-fundamental", "nova-sentiment", "flow-supply"]
GAEO_AGENTS = GAEO_DEV_AGENTS + GAEO_ANALYST_AGENTS
# 이것 외에 .claude/agents 에 있는 gaeo-*.md 도 GAEO 소유로 본다(예: gaeo-product-analytics)
WRITE_TOOLS = {"Write", "Edit", "MultiEdit", "NotebookEdit"}
APP_UNVERIFIED = "실제 앱 확인 미확인"
FORMAT_UNVERIFIED = APP_UNVERIFIED          # 옛 이름(호환)
SANDBOX_READ_ONLY, SANDBOX_WRITE = "read-only", "workspace-write"
CODEX_TOML_KEYS = ("name", "description", "developer_instructions", "sandbox_mode")   # 이 넷만 쓴다 — 미지원 키(tools·read_only·instructions_file·model) 없음
AGENT_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
TQ = "'" * 3
DQ = '"' * 3


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def parse_frontmatter(text):
    """`---` 블록의 key: value 를 dict 로. 값은 한 줄(첫 ':' 기준). 본문도 함께 돌려준다."""
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return {}, text
    meta, i = {}, 1
    while i < len(lines) and lines[i].strip() != "---":
        line = lines[i]
        if ":" in line and not line.startswith((" ", "\t")):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
        i += 1
    return meta, "\n".join(lines[i + 1:])


def gaeo_agent_names():
    names = list(GAEO_AGENTS)
    for f in sorted(os.listdir(CLAUDE_AGENTS)):
        if f.startswith("gaeo-") and f.endswith(".md") and f[:-3] not in names:
            names.append(f[:-3])
    return names


def toml_str(v):
    return '"' + str(v).replace("\\", "\\\\").replace('"', '\\"') + '"'


def skill_pointer(name, meta):
    src = f".claude/skills/{name}/SKILL.md"
    return f"""---
name: {meta.get('name', name)}
description: {meta.get('description', '')}
---

# {name} — 공용 진입점 (Codex · 사람 · 다른 도구)

> 이 파일은 `sync_agent_compat.py` 가 `{src}` 에서 **생성**한 얇은 진입점이다. 손으로 고치지 않는다(`test_agent_compat.py` 가 잠근다).
> 원본이 바뀌면 `python3 sync_agent_compat.py` 로 다시 만든다.

**절차 원본: `{src}` — 그 문서를 그대로 읽고 따른다.** 여기에는 절차를 복제하지 않는다(복사본이 갈라지는 것을 막기 위해).

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
"""


def sandbox_mode_of(meta):
    tools = [t.strip() for t in meta.get("tools", "").split(",") if t.strip()]
    return SANDBOX_WRITE if (set(tools) & WRITE_TOOLS) else SANDBOX_READ_ONLY


def toml_multiline(text):
    """TOML 다중 행 문자열. 이스케이프가 없는 리터럴(작은따옴표 3개)을 쓰고, 본문에 그 구분자가 있으면 기본 문자열로 바꾼다."""
    if TQ not in text:
        return TQ + "\n" + text + TQ
    return DQ + "\n" + text.replace("\\", "\\\\").replace(DQ, '\\"\\"\\"') + DQ


def developer_instructions(name, meta, body):
    """Codex 가 읽는 역할 지침 — 원본(.claude/agents/<name>.md) 본문을 그대로 싣고, 공통 규칙을 앞에 둔다."""
    src = f".claude/agents/{name}.md"
    mode = sandbox_mode_of(meta)
    if mode == SANDBOX_READ_ONLY:
        write_rule = ("이 역할은 읽기 전용이다 — 파일을 고치지 않는다(sandbox_mode = read-only 가 강제한다). "
                      "원본의 tools 목록은 Claude 전용 표기이며 Codex 에서 그대로 적용된다고 가정하지 않는다.")
    else:
        write_rule = ("이 역할은 작업트리 안에서만 쓴다(sandbox_mode = workspace-write). 산식·가중치·사전등록 상수·과거 원장·"
                      "자동 생성 파일은 고치지 않는다(docs/rules/FILE_MAP.md). 커밋·push 는 docs/HARNESS.md 절차대로만.")
    head = [
        f"[GAEO 역할 {name}] 원본 지침: {src} (저장소 루트 기준 상대 경로). 아래 원문을 그대로 따른다. "
        "원문이 바뀌면 sync_agent_compat.py 가 이 파일을 다시 만든다(손으로 고치지 않는다).",
        "공통 시작 순서: AGENTS.md → docs/HARNESS.md → docs/operations/STATUS.md. 검사는 python3 gaeo_check.py <묶음>.",
        write_rule,
        "독립 검토: 같은 AI(같은 세션)가 역할만 바꿔 검토하는 것은 독립 검토가 아니다. 독립 검토 = 별도 세션의 검토자 1명"
        "(사람 또는 별도 AI 세션) 또는 기계 검사(test_*·gaeo_check.py).",
        "동시 실행 AI 는 메인 포함 2개 이내. 자식 에이전트 재귀 생성 금지. 모델 지정 없음(세션 기본값 상속, 자동 배정·라우터 없음). "
        "새 유료 서비스·실주문·Secret 노출 0.",
        "",
        "----- 원문 시작 -----",
        body.strip(),
        "----- 원문 끝 -----",
    ]
    return "\n".join(head) + "\n"


def agent_toml(name, meta, body=""):
    src = f".claude/agents/{name}.md"
    return (f"# 생성 파일 — sync_agent_compat.py 가 {src} 에서 만든다. 손으로 고치지 않는다.\n"
            "# Codex 프로젝트 커스텀 에이전트 형식(필수 name · description · developer_instructions, 설정 sandbox_mode)에 맞췄다(2026-09-10 지시서 기준 공식 스펙).\n"
            f"# ⚠️ {APP_UNVERIFIED}: 공식 문서(developers.openai.com/codex/subagents)는 이 세션의 egress 정책에 막혀 직접 읽지 못했고,\n"
            "#    Codex 설치본에서 이 파일의 인식·실행을 확인하지 못했다. 미지원 키(tools·read_only·instructions_file·model)는 넣지 않는다.\n"
            "#    model 키가 없는 것은 의도다 — 세션 기본값 상속, 자동 배정·라우터 없음.\n"
            f"name = {toml_str(meta.get('name', name))}\n"
            f"description = {toml_str(meta.get('description', ''))}\n"
            f"sandbox_mode = {toml_str(sandbox_mode_of(meta))}\n"
            f"developer_instructions = {toml_multiline(developer_instructions(name, meta, body))}\n")


def roles_md(agent_metas):
    L = ["# GAEO 역할(Agent) 요약표 — 도구 무관 (자동 생성)", "",
         "> `sync_agent_compat.py` 가 `.claude/agents/*.md`(원본)에서 만든다. 손으로 고치지 않는다(`test_agent_compat.py`).",
         "> 원본 지침 전문은 각 행의 파일을 읽는다. Codex 등 서브에이전트가 없는 도구는 필요한 역할 파일을 읽고 그 관점으로 **순차** 수행한다.",
         "> 어느 역할에도 모델 지정(`model:`)이 없다 — 세션 기본값 상속. 읽기 전용은 **지침**이며(Bash 가 있으면 기술적으로는 쓸 수 있다), Codex 에서는 `.codex/agents/<역할>.toml` 의 `sandbox_mode` 가 강제한다(설치본 인식 미확인).",
         "> 독립 검토: 같은 AI(같은 세션)가 역할만 바꿔 보는 것은 독립 검토가 아니다 — 별도 세션의 검토자 1명(사람·별도 AI 세션) 또는 기계 검사(`test_*`·`gaeo_check.py`)가 독립 검토다. 동시 실행 AI 는 메인 포함 2개 이내.",
         "", "## 개발·점검 (GAEO TEAM)", "", "| 역할 | 하는 일 | 도구 | 쓰기 | sandbox_mode | 원본 |", "|---|---|---|---|---|---|"]

    def row(name, meta):
        tools = [t.strip() for t in meta.get("tools", "").split(",") if t.strip()]
        write = "쓰기 가능" if set(tools) & WRITE_TOOLS else "읽기 전용(지침)"
        desc = meta.get("description", "").replace("|", "／")
        if len(desc) > 110:
            desc = desc[:110] + "…"
        return f"| `{name}` | {desc} | {', '.join(tools) or '(미지정 = 세션 기본)'} | {write} | `{sandbox_mode_of(meta)}` | `.claude/agents/{name}.md` |"

    for name, meta in agent_metas:
        if name not in GAEO_ANALYST_AGENTS:
            L.append(row(name, meta))
    L += ["", "## 정밀분석 5인 (종목분석 스킬 안에서 쓰인다)", "", "| 역할 | 하는 일 | 도구 | 쓰기 | sandbox_mode | 원본 |", "|---|---|---|---|---|---|"]
    for name, meta in agent_metas:
        if name in GAEO_ANALYST_AGENTS:
            L.append(row(name, meta))
    L += ["", "## 범위 밖", "",
          "- `.claude/agents/seo-*.md` 는 외부 SEO 스킬 묶음의 에이전트(보존만). 원본 그대로 두며(일부에 `model: sonnet` 이 원문에 있음) 여기 표와 검사 범위에서 뺀다.",
          "- 부르는 규칙(정상 점검 0명 · 메인 1명 · 메인 포함 동시 2개 이내 · 관점 순서대로)은 `docs/gaeo_team_system.md` 「2026-09-10 절약형 개정」.",
          "- Codex 형식 `.codex/agents/<역할>.toml`(name · description · developer_instructions · sandbox_mode)은 2026-09-10 지시서 기준 공식 스펙에 맞췄고, 공식 문서 직접 확인·설치본 인식은 미확인이다(`docs/agent/MIGRATION_MAP.md`).", ""]
    return "\n".join(L)


def render_all(root=HERE):
    out = {}
    for name in GAEO_SKILLS:
        src = os.path.join(root, ".claude", "skills", name, "SKILL.md")
        meta, _ = parse_frontmatter(read(src))
        out[os.path.join(root, ".agents", "skills", name, "SKILL.md")] = skill_pointer(name, meta)
    metas = []
    for name in gaeo_agent_names():
        src = os.path.join(root, ".claude", "agents", name + ".md")
        meta, body = parse_frontmatter(read(src))
        metas.append((name, meta))
        out[os.path.join(root, ".codex", "agents", name + ".toml")] = agent_toml(name, meta, body)
    validate(metas)
    out[os.path.join(root, "docs", "agent", "ROLES.md")] = roles_md(metas)
    return out


def validate(metas):
    """이름 중복·규격·필수 필드·원본 경로. 하나라도 어긋나면 생성하지 않는다(ValueError)."""
    seen = set()
    problems = []
    for name, meta in metas:
        if not AGENT_NAME_RE.match(name):
            problems.append(f"{name}: 역할 이름은 소문자·숫자·하이픈만(파일명 = name)")
        if meta.get("name") != name:
            problems.append(f"{name}: frontmatter name 이 파일명과 다르다({meta.get('name')})")
        if not meta.get("description"):
            problems.append(f"{name}: description 이 비어 있다")
        if name in seen:
            problems.append(f"{name}: 같은 이름이 두 번")
        seen.add(name)
        if not os.path.exists(os.path.join(HERE, ".claude", "agents", name + ".md")):
            problems.append(f"{name}: 원본 .claude/agents/{name}.md 없음")
    if len(set(GAEO_SKILLS)) != len(GAEO_SKILLS):
        problems.append("스킬 이름 중복")
    if problems:
        raise ValueError("역할·스킬 정의 오류:\n  " + "\n  ".join(problems))


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    try:
        files = render_all()
    except ValueError as e:
        print(e)
        return 2
    if "--check" in argv:
        stale = [os.path.relpath(p, HERE) for p, body in files.items()
                 if not os.path.exists(p) or read(p) != body]
        if stale:
            print("생성물이 원본과 다르다 — python3 sync_agent_compat.py 로 다시 만들 것:\n  " + "\n  ".join(stale))
            return 1
        print(f"공용 진입점 최신 ({len(files)}개)")
        return 0
    for p, body in files.items():
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8") as fh:
            fh.write(body)
    print(f"생성: {len(files)}개 (.agents/skills {len(GAEO_SKILLS)} · .codex/agents {len(gaeo_agent_names())} · docs/agent/ROLES.md)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
