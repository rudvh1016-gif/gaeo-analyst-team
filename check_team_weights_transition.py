#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DIANA 20거래일 채점 시작(2026-09-14) 뒤 "판단일 단위 축소"가 실제로 절벽을 막았는지 숫자로 재는 확인 도구.

무엇을 하나
  · 현재 team_weights.js 의 method · DIANA(n·uniqueDecisionDays·acc·adjustedAcc·rowBasedAdjustedAcc·shrinkageUnit) ·
    global.weights · dayBasedShadow.rowBasedLegacy.weights 를 그대로 읽는다.
  · 기준일(--as-of) 전날까지의 마지막 team_weights.js 판(직전 판)을 찾아 분석가별 가중치 이동폭(%)을 계산한다.
    직전 판은 ① 로컬 git 이력 ② (없으면) GitHub API(GH_TOKEN) 순으로 찾고, 둘 다 안 되면 "확인 불가"로 남긴다.
  · 판정: DIANA 하루 이동폭 ≤ 1.5% 면 정상, 5% 초과면 ANOMALY(수리 요청 대상). 산식·임계값·사전비중은 절대 바꾸지 않는다.

무엇을 하지 않나
  · 가중치·산식·상수를 고치지 않는다. 결과를 보고 무언가를 최적화하지 않는다. LLM 호출 0.

    python3 check_team_weights_transition.py --json --as-of 2026-09-15
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))
EXPECTED_METHOD = "role-prior-bayesian-shrinkage-v4-decision-day-market-relative"
EXPECTED_UNIT = "decision_day"
NORMAL_MAX_MOVE_PCT = 1.5
ANOMALY_MOVE_PCT = 5.0
ANALYSTS = ("taro", "diana", "nova", "flow")


def parse_team_weights(text):
    m = re.search(r"const\s+TEAM_WEIGHTS\s*=\s*(\{.*\})\s*;", text, re.S)
    if not m:
        raise ValueError("TEAM_WEIGHTS 를 찾지 못했다")
    return json.loads(m.group(1))


def previous_version_git(root, as_of):
    """기준일 00:00 KST 이전 마지막 커밋의 team_weights.js. 얕은 clone 이면 None."""
    before = f"{as_of}T00:00:00+09:00"
    try:
        sha = subprocess.run(["git", "-C", root, "log", "--format=%H", f"--before={before}", "-1", "--", "team_weights.js"],
                             capture_output=True, text=True, timeout=60).stdout.strip()
        if not sha:
            return None, None
        text = subprocess.run(["git", "-C", root, "show", f"{sha}:team_weights.js"], capture_output=True, text=True,
                              timeout=60)
        if text.returncode != 0:
            return None, None
        return sha, parse_team_weights(text.stdout)
    except (OSError, subprocess.SubprocessError, ValueError):
        return None, None


def previous_version_api(repo, token, as_of):
    """GitHub API 로 같은 것을 찾는다(얕은 checkout 인 Actions 러너용). 실패하면 None."""
    if not repo or not token:
        return None, None
    try:
        until = f"{as_of}T00:00:00+09:00"
        req = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/commits?path=team_weights.js&until={until}&per_page=1",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "User-Agent": "gaeo-tw-check"})
        with urllib.request.urlopen(req, timeout=20) as res:
            commits = json.loads(res.read().decode("utf-8"))
        if not commits:
            return None, None
        sha = commits[0]["sha"]
        req = urllib.request.Request(
            f"https://raw.githubusercontent.com/{repo}/{sha}/team_weights.js",
            headers={"Authorization": f"Bearer {token}", "User-Agent": "gaeo-tw-check"})
        with urllib.request.urlopen(req, timeout=30) as res:
            return sha, parse_team_weights(res.read().decode("utf-8"))
    except Exception:                                # noqa: BLE001 — 어떤 실패든 '확인 불가'
        return None, None


def compare(current, previous):
    cur_w = (current.get("global") or {}).get("weights") or {}
    prev_w = (previous.get("global") or {}).get("weights") or {} if previous else {}
    moves = {}
    for a in ANALYSTS:
        c, p = cur_w.get(a), prev_w.get(a)
        if isinstance(c, (int, float)) and isinstance(p, (int, float)) and p:
            moves[a] = round((c / p - 1.0) * 100.0, 2)
        else:
            moves[a] = None
    return cur_w, prev_w, moves


def run(root=HERE, as_of=None, repo=None, token=None):
    as_of = as_of or datetime.datetime.now(KST).date().isoformat()
    path = os.path.join(root, "team_weights.js")
    if not os.path.exists(path):
        return {"status": "UNKNOWN", "reason": "team_weights.js 없음", "asOf": as_of}
    current = parse_team_weights(open(path, encoding="utf-8").read())
    g = current.get("global") or {}
    diana = (g.get("acc") or {}).get("diana") or {}
    prev_sha, previous = previous_version_git(root, as_of)
    source = "git"
    if previous is None:
        prev_sha, previous = previous_version_api(repo, token, as_of)
        source = "github-api" if previous is not None else None
    cur_w, prev_w, moves = compare(current, previous)
    checks = {
        "methodIsDecisionDay": current.get("method") == EXPECTED_METHOD,
        "dianaShrinkageUnit": diana.get("shrinkageUnit") == EXPECTED_UNIT,
        "dianaGradedRows": diana.get("n"),
        "dianaUniqueDecisionDays": diana.get("uniqueDecisionDays"),
    }
    report = {
        "schemaVersion": "gaeo_team_weights_transition_v1",
        "asOf": as_of,
        "generatedAt": current.get("generatedAt"),
        "method": current.get("method"),
        "globalVersion": g.get("version"),
        "diana": {k: diana.get(k) for k in ("n", "uniqueDecisionDays", "acc", "adjustedAcc", "rowBasedAdjustedAcc",
                                             "shrinkageUnit", "nEffectiveDays", "skillStatus")},
        "weights": cur_w,
        "rowBasedLegacyWeights": ((g.get("dayBasedShadow") or {}).get("rowBasedLegacy") or {}).get("weights"),
        "previous": {"sha": prev_sha, "source": source, "weights": prev_w or None,
                     "generatedAt": (previous or {}).get("generatedAt")},
        "movePct": moves,
        "checks": checks,
        "thresholds": {"normalMaxMovePct": NORMAL_MAX_MOVE_PCT, "anomalyMovePct": ANOMALY_MOVE_PCT},
    }
    problems = []
    if not checks["methodIsDecisionDay"]:
        problems.append(f"method 가 {EXPECTED_METHOD} 가 아니다: {current.get('method')}")
    if not checks["dianaShrinkageUnit"]:
        problems.append(f"DIANA shrinkageUnit 이 {EXPECTED_UNIT} 가 아니다: {diana.get('shrinkageUnit')}")
    d_move = moves.get("diana")
    if d_move is None:
        status = "UNKNOWN_PREVIOUS" if not problems else "ANOMALY"
        note = "직전 판을 찾지 못해 이동폭을 계산하지 못했다(정상이라는 뜻이 아니다)"
    elif abs(d_move) > ANOMALY_MOVE_PCT:
        status = "ANOMALY"
        note = f"DIANA 가중치가 하루에 {d_move:+.2f}% 움직였다(허용 {NORMAL_MAX_MOVE_PCT}%, 이상 {ANOMALY_MOVE_PCT}%)"
        problems.append(note)
    elif abs(d_move) > NORMAL_MAX_MOVE_PCT:
        status = "WATCH"
        note = f"DIANA 가중치 이동 {d_move:+.2f}% — 정상 범위(±{NORMAL_MAX_MOVE_PCT}%)를 넘지만 이상 문턱({ANOMALY_MOVE_PCT}%) 미만"
    else:
        status = "OK" if not problems else "ANOMALY"
        note = f"DIANA 가중치 이동 {d_move:+.2f}% — 판단일 단위 축소 범위 안"
    report.update({"status": status, "note": note, "problems": problems})
    return report


def plain(report):
    d = report.get("diana") or {}
    lines = [f"[DIANA 전환 확인] 기준일 {report.get('asOf')} · 상태 {report.get('status')} — {report.get('note', '')}",
             f"  method {report.get('method')} · DIANA n={d.get('n')} 판단일={d.get('uniqueDecisionDays')} acc={d.get('acc')} adj={d.get('adjustedAcc')} rowBased={d.get('rowBasedAdjustedAcc')} unit={d.get('shrinkageUnit')}",
             f"  가중치 {report.get('weights')} · 직전({(report.get('previous') or {}).get('source') or '없음'}) {(report.get('previous') or {}).get('weights')} · 이동 {report.get('movePct')}"]
    for p in report.get("problems") or []:
        lines.append(f"  ⚠️ {p}")
    return "\n".join(lines)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--as-of", default=None)
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    rep = run(args.root, args.as_of, os.environ.get("GITHUB_REPOSITORY"),
              os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN"))
    print(json.dumps(rep, ensure_ascii=False, indent=1) if args.json else plain(rep))
    return 0


if __name__ == "__main__":
    sys.exit(main())
