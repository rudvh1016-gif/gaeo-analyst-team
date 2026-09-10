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
  .codex/agents/<name>.toml        GAEO 소유 역할 13개의 요약 (⚠️ 형식 미확인 — Codex 설치본에서 확인 전까지 참고용)
  docs/agent/ROLES.md              역할 13개 요약표(도구·쓰기 권한·원본 경로). 모델 지정 없음.

범위 밖(복제하지 않는다): 외부 스킬(seo-*, impeccable, taste-skill, ui-ux-pro-max, accessibility, best-practices,
  core-web-vitals, performance, web-quality-audit) · 외부 SEO 에이전트(seo-*.md). 라이선스 파일 포함 원본 그대로 보존.

    python3 sync_agent_compat.py            # 생성(덮어쓰기)
    python3 sync_agent_compat.py --check    # 생성물이 원본과 같은지만 확인 (0 = 최신, 1 = 다시 생성 필요)
"""
import os
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
FORMAT_UNVERIFIED = "형식 미확인"


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
| Agent 도구로 `<역할>` 호출 (병렬) | `.claude/agents/<역할>.md` 를 읽고 그 관점으로 **순차** 수행. 동시 2개 이내·정상 점검 0명 규칙은 그대로 |
| `/gaeo-*` 스킬 호출 | 해당 `.claude/skills/<이름>/SKILL.md` 를 읽고 따른다 |
| `mcp__github__*` 도구 | `gh` CLI 또는 GitHub 웹 화면(권한이 있을 때만). 못 보면 "확인 불가"로 적는다 — 정상으로 적지 않는다 |
| Routine(예약 실행) | GitHub Actions(`.github/workflows/ops-daily.yml`)가 맡는다. 새 예약을 만들지 않는다 |
| 역할의 `tools:` 에 Write/Edit 이 없음(읽기 전용) | **지침**이다 — 파일을 고치지 않는다. 가능하면 sandbox 를 읽기 전용으로 |
| 모델 지정 | 없다. 세션 기본값을 그대로 쓴다(자동 배정·라우터 없음) |
"""


def agent_toml(name, meta):
    src = f".claude/agents/{name}.md"
    tools = [t.strip() for t in meta.get("tools", "").split(",") if t.strip()]
    read_only = not (set(tools) & WRITE_TOOLS)
    tools_toml = "[" + ", ".join(toml_str(t) for t in tools) + "]"
    return f"""# 생성 파일 — sync_agent_compat.py 가 {src} 에서 만든다. 손으로 고치지 않는다.
# ⚠️ {FORMAT_UNVERIFIED}: Codex 설치본이 이 파일을 어떤 스키마로 읽는지 이 세션에서 공식 문서로 확인하지 못했다(2026-09-10).
#    참고용이다. 확인되면 sync_agent_compat.py 의 agent_toml() 을 그 스키마로 고치고 다시 생성한다.
#    model 키가 없는 것은 의도다 — 세션 기본값 상속, 자동 배정·라우터 없음.
name = {toml_str(meta.get('name', name))}
description = {toml_str(meta.get('description', ''))}
instructions_file = {toml_str(src)}
tools = {tools_toml}
read_only = {'true' if read_only else 'false'}
"""


def roles_md(agent_metas):
    L = ["# GAEO 역할(Agent) 요약표 — 도구 무관 (자동 생성)", "",
         "> `sync_agent_compat.py` 가 `.claude/agents/*.md`(원본)에서 만든다. 손으로 고치지 않는다(`test_agent_compat.py`).",
         "> 원본 지침 전문은 각 행의 파일을 읽는다. Codex 등 서브에이전트가 없는 도구는 필요한 역할 파일을 읽고 그 관점으로 **순차** 수행한다.",
         "> 어느 역할에도 모델 지정(`model:`)이 없다 — 세션 기본값 상속. 읽기 전용은 **지침**이며(Bash 가 있으면 기술적으로는 쓸 수 있다), 도구 쪽 sandbox 로 보강한다.",
         "", "## 개발·점검 (GAEO TEAM)", "", "| 역할 | 하는 일 | 도구 | 쓰기 | 원본 |", "|---|---|---|---|---|"]

    def row(name, meta):
        tools = [t.strip() for t in meta.get("tools", "").split(",") if t.strip()]
        write = "쓰기 가능" if set(tools) & WRITE_TOOLS else "읽기 전용(지침)"
        desc = meta.get("description", "").replace("|", "／")
        if len(desc) > 110:
            desc = desc[:110] + "…"
        return f"| `{name}` | {desc} | {', '.join(tools) or '(미지정 = 세션 기본)'} | {write} | `.claude/agents/{name}.md` |"

    for name, meta in agent_metas:
        if name not in GAEO_ANALYST_AGENTS:
            L.append(row(name, meta))
    L += ["", "## 정밀분석 5인 (종목분석 스킬 안에서 쓰인다)", "", "| 역할 | 하는 일 | 도구 | 쓰기 | 원본 |", "|---|---|---|---|---|"]
    for name, meta in agent_metas:
        if name in GAEO_ANALYST_AGENTS:
            L.append(row(name, meta))
    L += ["", "## 범위 밖", "",
          "- `.claude/agents/seo-*.md` 는 외부 SEO 스킬 묶음의 에이전트(보존만). 원본 그대로 두며(일부에 `model: sonnet` 이 원문에 있음) 여기 표와 검사 범위에서 뺀다.",
          "- 부르는 규칙(정상 점검 0명 · 메인 1명 · 동시 2개 이내 · 관점 순서대로)은 `docs/gaeo_team_system.md` 「2026-09-10 절약형 개정」.", ""]
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
        meta, _ = parse_frontmatter(read(src))
        metas.append((name, meta))
        out[os.path.join(root, ".codex", "agents", name + ".toml")] = agent_toml(name, meta)
    out[os.path.join(root, "docs", "agent", "ROLES.md")] = roles_md(metas)
    return out


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    files = render_all()
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
