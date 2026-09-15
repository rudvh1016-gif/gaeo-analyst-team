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
import urllib.parse
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


def cutoff_at(as_of):
    """기준일 00:00 KST. 직전 판은 이 순간보다 **앞선** 자료여야 한다."""
    y, m, d = (int(x) for x in str(as_of).split("-"))
    return datetime.datetime(y, m, d, tzinfo=KST)


def _parse_stamp(value):
    """'2026-09-15 16:32' / ISO8601 → tz 있는 datetime. 못 읽으면 None(지어내지 않는다)."""
    if not isinstance(value, str) or not value.strip():
        return None
    text = value.strip().replace("Z", "+00:00")
    for fmt in (None, "%Y-%m-%d %H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            dt = datetime.datetime.fromisoformat(text) if fmt is None else datetime.datetime.strptime(text, fmt)
        except ValueError:
            continue
        return dt if dt.tzinfo else dt.replace(tzinfo=KST)
    return None


def previous_eligibility(previous, commit_iso, as_of):
    """직전 판이 **기준일 이전 자료인지** 확인한다.

    ⚠️ 2026-09-15 실측 결함: GitHub API 가 기준시각을 넘긴 당일 커밋을 돌려줬는데도
    그대로 직전 판으로 받아들여, 오늘 파일을 오늘 파일과 비교하고 "이동 0.00% · OK" 를
    냈다. 숫자는 맞지만 **아무것도 확인하지 못한 답**이었다. 그래서 어느 경로로 얻었든
    여기서 다시 잰다 — 돌려줬다는 사실은 적격의 근거가 아니다.

    반환: (적격 여부, 사유). 시각을 읽지 못하면 적격으로 보지 않는다(fail closed).
    """
    if not previous:
        return False, "previous_not_found"
    cut = cutoff_at(as_of)
    commit_at = _parse_stamp(commit_iso)
    if commit_at is not None and commit_at >= cut:
        return False, "previous_commit_after_cutoff"
    generated_at = _parse_stamp((previous or {}).get("generatedAt"))
    if generated_at is None:
        return False, "previous_generated_at_unreadable"
    if generated_at >= cut:
        return False, "previous_generated_after_cutoff"
    return True, None


def previous_version_git(root, as_of):
    """기준일 00:00 KST 이전 마지막 커밋의 team_weights.js. 얕은 clone 이면 None."""
    before = f"{as_of}T00:00:00+09:00"
    try:
        out = subprocess.run(["git", "-C", root, "log", "--format=%H %cI", f"--before={before}", "-1", "--",
                              "team_weights.js"], capture_output=True, text=True, timeout=60).stdout.strip()
        if not out:
            return None, None, None
        sha, _, commit_iso = out.partition(" ")
        text = subprocess.run(["git", "-C", root, "show", f"{sha}:team_weights.js"], capture_output=True, text=True,
                              timeout=60)
        if text.returncode != 0:
            return None, None, None
        return sha, parse_team_weights(text.stdout), commit_iso.strip() or None
    except (OSError, subprocess.SubprocessError, ValueError):
        return None, None, None


def previous_version_api(repo, token, as_of):
    """GitHub API 로 같은 것을 찾는다(얕은 checkout 인 Actions 러너용). 실패하면 None."""
    if not repo or not token:
        return None, None, None
    try:
        # ⚠️ until 을 "…+09:00" 그대로 질의문자열에 붙이면 '+' 가 공백으로 읽혀 기준시각이
        #    깨진다. 그래서 ① 같은 순간의 UTC(Z) 로 바꾸고 ② urlencode 로 안전하게 싣는다.
        #    그래도 서버가 무엇을 돌려주든 previous_eligibility() 가 다시 잰다.
        until = cutoff_at(as_of).astimezone(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        query = urllib.parse.urlencode({"path": "team_weights.js", "until": until, "per_page": 1})
        req = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/commits?{query}",
            headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json", "User-Agent": "gaeo-tw-check"})
        with urllib.request.urlopen(req, timeout=20) as res:
            commits = json.loads(res.read().decode("utf-8"))
        if not commits:
            return None, None, None
        sha = commits[0]["sha"]
        commit = (commits[0].get("commit") or {})
        commit_iso = ((commit.get("committer") or {}).get("date")
                      or (commit.get("author") or {}).get("date"))
        req = urllib.request.Request(
            f"https://raw.githubusercontent.com/{repo}/{sha}/team_weights.js",
            headers={"Authorization": f"Bearer {token}", "User-Agent": "gaeo-tw-check"})
        with urllib.request.urlopen(req, timeout=30) as res:
            return sha, parse_team_weights(res.read().decode("utf-8")), commit_iso
    except Exception:                                # noqa: BLE001 — 어떤 실패든 '확인 불가'
        return None, None, None


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
    # 두 경로를 각각 후보로 받아, **적격한 것**만 직전 판으로 쓴다. 먼저 돌려준 쪽이
    # 아니라 기준일 이전 자료인 쪽을 고른다(2026-09-15 실측 결함 수리).
    rejected = []
    prev_sha = previous = source = prev_commit = None
    prev_reason = "previous_not_found"
    for name, fetch in (("git", lambda: previous_version_git(root, as_of)),
                        ("github-api", lambda: previous_version_api(repo, token, as_of))):
        sha, doc, commit_iso = fetch()
        if doc is None and sha is None:
            continue
        ok, why = previous_eligibility(doc, commit_iso, as_of)
        if ok:
            prev_sha, previous, source, prev_commit = sha, doc, name, commit_iso
            prev_reason = None
            break
        rejected.append({"source": name, "sha": sha, "commitAt": commit_iso,
                         "generatedAt": (doc or {}).get("generatedAt"), "reason": why})
        prev_reason = why
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
                     "generatedAt": (previous or {}).get("generatedAt"),
                     "commitAt": prev_commit, "eligible": previous is not None,
                     "cutoff": cutoff_at(as_of).isoformat(),
                     "ineligibleReason": prev_reason,
                     "rejectedCandidates": rejected},
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
        WHY = {"previous_not_found": "직전 판을 찾지 못했다",
               "previous_commit_after_cutoff": "돌려받은 직전 판이 기준시각 이후 커밋이다",
               "previous_generated_after_cutoff": "돌려받은 직전 판이 기준일 당일 생성분이다",
               "previous_generated_at_unreadable": "직전 판의 생성시각을 읽지 못했다"}
        note = (WHY.get(prev_reason, "직전 판을 쓸 수 없다")
                + f" — 이동폭을 계산하지 못했다(정상이라는 뜻이 아니다). 기준시각 {cutoff_at(as_of).isoformat()}")
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
