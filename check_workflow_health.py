#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""워크플로 파일이 GitHub에서 **유효한지** 감시한다 (2026-09-07 사고 후 신설).

## 무슨 사고였나

`update-analysis.yml`의 큰 `run:` 블록이 GitHub의 UTF-8 21,000바이트 한도를 165바이트
넘겨 **파일 전체가 무효**가 됐다. 그때 벌어진 일:

  · push마다 **job이 0개인 0초짜리 실패 run**만 남는다 → 로그가 없어 원인을 볼 수 없다
  · `workflow_dispatch`가 거부된다 → **자기 재기동 체인이 통째로 끊긴다**
  · 산출물이 안 갱신되는데, 기존 워치독은 "실행 중인 run 없음 — 재기동"이라고만 말했다.
    재기동 dispatch도 거부되므로 그 조치는 영원히 실패한다

즉 **파이프라인이 스스로 되살아날 수 없는 상태**인데, 어떤 감시도 "왜"를 말해주지 못했다.
사람이 우연히 들여다볼 때까지 10.5시간 동안 조용했다.

## 어떻게 잡나 — GitHub이 알려주는 카나리아

워크플로 파일을 파싱하지 못하면 GitHub은 `name:` 값을 읽을 수 없어서
**API의 `name` 필드에 파일 경로를 대신 넣는다.** 실측(2026-09-07):

    깨진 상태 : "name": ".github/workflows/update-analysis.yml"
    정상 상태 : "name": "update-analysis"

그래서 파일에 적힌 `name:`과 API가 돌려주는 `name`을 비교하면 유효성을 1회 호출로 안다.
보조로, 최근 완료 run 중 **job이 0개인 실패**가 있으면 같은 증상으로 함께 신고한다.

## 어디서 도나

`pipeline-watchdog.yml`(장중 15분 간격, GITHUB_TOKEN 있음)에서 돈다.
토큰이 없으면 **"정상"이 아니라 "확인 못 함"으로 끝낸다** — 조회 실패를 건강 신호로
읽지 않는 것이 이 사고의 핵심 교훈이다.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))

# 멈추면 사이트가 죽는 워크플로들. 새 러너를 만들면 여기 추가한다.
CRITICAL = (
    "update-prices.yml",
    "update-analysis.yml",
    "pipeline-watchdog.yml",
)

EXIT_OK, EXIT_BROKEN, EXIT_UNKNOWN = 0, 1, 2


def declared_name(workflow):
    """워크플로 파일에 적힌 `name:` 값."""
    path = os.path.join(HERE, ".github", "workflows", workflow)
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = re.match(r"^name:\s*(.+?)\s*$", line)
            if m:
                return m.group(1).strip("'\"")
    return None


def _get(url, token):
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "gaeo-workflow-health",
    })
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode("utf-8"))


def check(repo, token, workflow):
    """(상태, 설명) — 상태는 'ok' | 'broken' | 'unknown'."""
    want = declared_name(workflow)
    if not want:
        return "unknown", f"{workflow}: 파일에서 name:을 못 읽었다"
    try:
        data = _get(f"https://api.github.com/repos/{repo}/actions/workflows/{workflow}", token)
    except (urllib.error.URLError, OSError, ValueError) as e:
        return "unknown", f"{workflow}: GitHub 조회 실패 — {e}"

    got = str(data.get("name", ""))
    if got == want:
        return "ok", f"{workflow}: 유효 (name={got})"
    if got.endswith(workflow) or got.startswith(".github/"):
        return "broken", (
            f"{workflow}: **GitHub이 파일을 파싱하지 못한다.** API가 name으로 파일 경로"
            f"({got})를 돌려줬다 — 파일에 적힌 이름은 '{want}'다.\n"
            f"      → job이 하나도 생성되지 않고 workflow_dispatch(자기 재기동)도 거부된다.\n"
            f"      → 흔한 원인: run: 블록이 UTF-8 21,000바이트 초과(test_workflow_size.py로 확인), "
            f"잘못된 표현식, 알 수 없는 키.\n"
            f"      → 실제 사유는 다음 명령이 그대로 알려준다:\n"
            f"         gh api -X POST repos/{repo}/actions/workflows/{workflow}/dispatches -f ref=main")
    return "unknown", f"{workflow}: name이 예상과 다르다 (API '{got}' vs 파일 '{want}')"


def zero_job_failures(repo, token, workflow, limit=5):
    """최근 완료 run 중 job이 0개인 실패 — 파일 무효의 또 다른 지문."""
    try:
        data = _get(f"https://api.github.com/repos/{repo}/actions/workflows/{workflow}"
                    f"/runs?status=completed&per_page={limit}", token)
    except (urllib.error.URLError, OSError, ValueError):
        return None
    bad = []
    for run in data.get("workflow_runs", []):
        if run.get("conclusion") != "failure":
            continue
        if run.get("created_at") != run.get("updated_at"):
            continue          # 0초 만에 끝난 것만 본다(진짜 실패는 시간이 걸린다)
        bad.append(run.get("run_number"))
    return bad


def main():
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    if not repo or not token:
        # ⚠️ 여기서 0을 돌려주면 안 된다. "확인 못 했다"를 "정상"으로 읽는 것이
        #    바로 2026-09-07 사고를 10.5시간 동안 숨긴 그 실수다.
        print("[워크플로 건강] GITHUB_REPOSITORY·토큰이 없어 확인하지 못했다 — 정상이라는 뜻이 아니다")
        return EXIT_UNKNOWN

    broken, unknown = [], []
    for workflow in CRITICAL:
        state, message = check(repo, token, workflow)
        mark = {"ok": "✅", "broken": "❌", "unknown": "❓"}[state]
        print(f"[워크플로 건강] {mark} {message}")
        if state == "broken":
            broken.append(workflow)
        elif state == "unknown":
            unknown.append(workflow)
        if state == "ok":
            zeros = zero_job_failures(repo, token, workflow)
            if zeros:
                print(f"      ⚠️ 최근 0초·job 0개 실패 run: {zeros} — 최근까지 파일이 무효였을 수 있다")

    if broken:
        for workflow in broken:
            print(f"::error title=워크플로 무효::{workflow} 을 GitHub이 파싱하지 못한다. "
                  f"job이 생성되지 않고 자기 재기동도 거부된다 — 즉시 고칠 것.")
        return EXIT_BROKEN
    if unknown:
        print("[워크플로 건강] 일부를 확인하지 못했다 — 정상이라는 뜻이 아니다")
        return EXIT_UNKNOWN
    print("[워크플로 건강] 핵심 워크플로 전부 유효")
    return EXIT_OK


if __name__ == "__main__":
    sys.exit(main())
