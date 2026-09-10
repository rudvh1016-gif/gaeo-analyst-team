#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""저장소 이력 보존 도구 — 용량 보고(비파괴) · 이력 압축 전 안전 점검 · 재작성 SHA 지도 (2026-09-10, 구간 8).

배경 (docs/HISTORY_PRESERVATION.md)
  2026-09-02 08:25 KST `compact-history` 가 main 이력을 graft+filter-branch 로 다시 써서(force push) 커밋 3,151개의 번호가 전부
  바뀌었다. 그 결과 (1) 모의투자 러너 clone 이 공통 조상을 잃어 8거래일 멈췄고 (2) 문서·PR·검증 원장이 가리키는 커밋 SHA 가
  저장소에 없는 번호가 됐다. 이력 압축은 "화면 내용은 그대로"지만 **증거 참조는 끊는다.**

이 도구가 하는 일 (LLM 호출 0 · 산식·데이터 무관)
  --report                     GitHub 이 집계한 저장소 용량(KB→GiB)과 단계(OK < 3 GiB ≤ NOTICE < 4.5 GiB ≤ PROTECT)를 낸다.
                               토큰이 없으면 "확인 불가"(정상이 아니다). 로컬 pack 크기는 참고로만(얕은 clone 이면 뜻이 없다).
  --precheck --cutoff-days N   이력 압축 **전** 거부 조건을 본다: 얕은 clone · KST 평일 08:30~16:40(수집기가 main 에 커밋) ·
                               모의투자 러너 최근 2시간 활동 · 검증 원장(ledger.jsonl)의 gitSha 가 cutoff 보다 오래돼 사라질 때.
                               하나라도 걸리면 exit 1. 증거 손실은 --allow-evidence-loss 로만 넘길 수 있다(사람이 명시).
  --sha-map OLD_REF NEW_REF    재작성 전(refs/original/refs/heads/main)·후(main) 커밋을 꼬리(HEAD)부터 맞춰 old→new 지도를 쓴다.
     --out PATH                tree·author-time 이 다르면 실패(잘못된 지도를 남기지 않는다). 지도는 docs/audits/history_rewrites/ 에 커밋된다.
  --translate SHA              지도에서 옛 SHA 를 새 SHA 로 바꿔 준다(증거 추적).
"""
import argparse
import datetime
import glob
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))
NOTICE_GIB = 3.0        # GitHub 은 1GB 미만을 권장, 5GB 를 강하게 권장 상한으로 둔다 → 그 전에 두 단계로 알린다
PROTECT_GIB = 4.5
LEDGER = os.path.join("docs", "audits", "validation_runs", "ledger.jsonl")
PAPER_STATE = os.path.join("paper_trading", "state.json")
MAP_DIR = os.path.join("docs", "audits", "history_rewrites")
COLLECTOR_WINDOW = (datetime.time(8, 30), datetime.time(16, 40))
PAPER_QUIET_MIN = 120


def git(root, *args, timeout=600):
    try:
        r = subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout
    except (OSError, subprocess.SubprocessError):
        return 1, ""


def is_shallow(root):
    code, out = git(root, "rev-parse", "--is-shallow-repository")
    return code != 0 or out.strip() == "true"


# ---------------------------------------------------------------- 용량 보고

def repo_size_github(repo, token, opener=None):
    """GitHub API 의 size(KB). 실패하면 None — 호출자가 '확인 불가'로 적는다."""
    if not repo or not token:
        return None
    try:
        import urllib.request
        req = urllib.request.Request(f"https://api.github.com/repos/{repo}",
                                     headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json",
                                              "User-Agent": "gaeo-history-evidence"})
        open_fn = opener or urllib.request.urlopen
        with open_fn(req, timeout=20) as res:
            return int(json.loads(res.read().decode("utf-8")).get("size") or 0)
    except Exception:                                # noqa: BLE001 — 어떤 실패든 '확인 불가'
        return None


def level_for(gib):
    if gib is None:
        return "UNKNOWN"
    if gib >= PROTECT_GIB:
        return "PROTECT"
    if gib >= NOTICE_GIB:
        return "NOTICE"
    return "OK"


def local_pack_gib(root):
    code, out = git(root, "count-objects", "-v")
    if code != 0:
        return None
    kb = 0
    for line in out.splitlines():
        if line.startswith(("size-pack:", "size:")):
            kb += int(line.split(":")[1].strip())
    return round(kb / 1048576, 2)


def report(root=HERE, repo=None, token=None, opener=None):
    size_kb = repo_size_github(repo, token, opener)
    gib = round(size_kb / 1048576, 2) if size_kb is not None else None
    return {
        "schemaVersion": "gaeo_history_report_v1",
        "checkedAt": datetime.datetime.now(KST).isoformat(),
        "github": {"repo": repo, "sizeKB": size_kb, "sizeGiB": gib, "level": level_for(gib),
                   "note": None if size_kb is not None else "토큰·저장소 이름이 없거나 조회 실패 — 확인 불가(정상이라는 뜻이 아니다)"},
        "local": {"packGiB": local_pack_gib(root), "shallow": is_shallow(root),
                  "note": "얕은 clone 이면 로컬 크기는 뜻이 없다" if is_shallow(root) else "참고용(GitHub 집계와 다를 수 있다)"},
        "thresholds": {"noticeGiB": NOTICE_GIB, "protectGiB": PROTECT_GIB},
        "policy": "이력 압축은 수동(compact-history workflow_dispatch + confirm) · 사전 점검 · SHA 지도 커밋 뒤에만. docs/HISTORY_PRESERVATION.md",
    }


def plain_report(r):
    g = r["github"]
    size = f"{g['sizeGiB']} GiB" if g["sizeGiB"] is not None else "확인 불가"
    lines = [f"[저장소 용량] GitHub 집계 {size} · 단계 {g['level']} (알림 {NOTICE_GIB} GiB · 보호 {PROTECT_GIB} GiB)"]
    if g["note"]:
        lines.append(f"  · {g['note']}")
    lines.append(f"  · 로컬 pack {r['local']['packGiB']} GiB ({r['local']['note']})")
    lines.append(f"  · 규칙: {r['policy']}")
    return "\n".join(lines)


# ---------------------------------------------------------------- 압축 전 점검

def in_collector_window(now):
    t = now.astimezone(KST)
    return t.weekday() < 5 and COLLECTOR_WINDOW[0] <= t.time() <= COLLECTOR_WINDOW[1]


def ledger_shas(root):
    path = os.path.join(root, LEDGER)
    shas = []
    if os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                if line.strip():
                    try:
                        sha = json.loads(line).get("gitSha")
                    except ValueError:
                        sha = None
                    if sha:
                        shas.append(sha)
    return shas


def commit_time(root, sha):
    code, out = git(root, "show", "-s", "--format=%ct", sha)
    return int(out.strip()) if code == 0 and out.strip().isdigit() else None


def paper_recent(root, now, quiet_min=PAPER_QUIET_MIN):
    path = os.path.join(root, PAPER_STATE)
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding="utf-8") as fh:
            last = json.load(fh).get("lastCycleAt")
        dt = datetime.datetime.fromisoformat(str(last))
        dt = dt if dt.tzinfo else dt.replace(tzinfo=KST)
    except (ValueError, TypeError, OSError):
        return None
    return (now - dt).total_seconds() / 60 < quiet_min


def precheck(root=HERE, now=None, cutoff_days=30, allow_evidence_loss=False):
    now = now or datetime.datetime.now(KST)
    reasons = []
    if is_shallow(root):
        reasons.append("얕은 clone 이다 — 이력 압축에는 전체 이력이 필요하다(actions/checkout fetch-depth: 0)")
    if in_collector_window(now):
        reasons.append("KST 평일 08:30~16:40 — 시세·자동분석 수집기가 main 에 커밋하는 시간이다. 새벽에만 한다")
    if paper_recent(root, now):
        reasons.append(f"모의투자 러너가 최근 {PAPER_QUIET_MIN}분 안에 사이클을 돌렸다 — 러너가 push 할 수 있는 시간에는 하지 않는다")
    cutoff_ts = (now - datetime.timedelta(days=cutoff_days)).timestamp()
    at_risk = []
    for sha in ledger_shas(root):
        t = commit_time(root, sha)
        if t is None:
            at_risk.append({"sha": sha, "why": "저장소에 없는 커밋(이미 재작성됐거나 아직 받지 않은 커밋)"})
        elif t < cutoff_ts:
            at_risk.append({"sha": sha, "why": f"cutoff({cutoff_days}일) 보다 오래된 커밋 — 압축으로 사라진다"})
    if at_risk and not allow_evidence_loss:
        reasons.append(f"검증 원장이 가리키는 커밋 {len(at_risk)}개가 압축 뒤 사라지거나 이미 없다 — --allow-evidence-loss 를 사람이 명시할 때만 진행")
    return {"schemaVersion": "gaeo_history_precheck_v1", "checkedAt": now.isoformat(), "cutoffDays": cutoff_days,
            "ok": not reasons, "reasons": reasons, "evidenceAtRisk": at_risk, "allowEvidenceLoss": allow_evidence_loss}


# ---------------------------------------------------------------- SHA 지도

def commit_list(root, ref):
    code, out = git(root, "log", "--reverse", "--format=%H%x1f%T%x1f%at", ref)
    if code != 0:
        raise RuntimeError(f"git log {ref} 실패")
    rows = []
    for line in out.splitlines():
        parts = line.split("\x1f")
        if len(parts) == 3:
            rows.append((parts[0], parts[1], parts[2]))
    return rows


def sha_map(old_list, new_list):
    """옛·새 커밋 목록(오래된 것부터)을 꼬리(HEAD)에서 맞춘다. filter-branch 는 tree·author-time 을 그대로 두므로 그것으로 검산."""
    n = len(new_list)
    if n == 0 or len(old_list) < n:
        raise ValueError("새 이력이 비었거나 옛 이력보다 길다 — 재작성 결과가 아니다")
    old_tail = old_list[-n:]
    pairs, mismatches = [], []
    for o, w in zip(old_tail, new_list):
        pairs.append([o[0], w[0]])
        if o[1] != w[1] or o[2] != w[2]:
            mismatches.append({"old": o[0], "new": w[0]})
    return {"pairs": pairs, "dropped": [o[0] for o in old_list[:-n]], "mismatches": mismatches}


def write_sha_map(root, old_ref, new_ref, out_path, cutoff_days=None):
    old_list, new_list = commit_list(root, old_ref), commit_list(root, new_ref)
    m = sha_map(old_list, new_list)
    if m["mismatches"]:
        raise RuntimeError(f"옛/새 커밋 {len(m['mismatches'])}쌍의 tree·author-time 이 다르다 — 지도를 쓰지 않는다")
    doc = {"schemaVersion": "gaeo_history_rewrite_map_v1", "rewrittenAt": datetime.datetime.now(KST).isoformat(),
           "cutoffDays": cutoff_days, "oldHead": old_list[-1][0], "newHead": new_list[-1][0],
           "oldCommitCount": len(old_list), "newCommitCount": len(new_list), "droppedOldCommits": len(m["dropped"]),
           "droppedRange": [m["dropped"][0], m["dropped"][-1]] if m["dropped"] else None,
           "note": "dropped 커밋은 새 이력에 없다(내용은 새 뿌리 커밋의 트리에 합쳐져 있다). pairs 는 [옛 SHA, 새 SHA].",
           "pairs": m["pairs"]}
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=0)
    return doc


def translate(root, sha):
    hits = []
    for p in sorted(glob.glob(os.path.join(root, MAP_DIR, "*.json"))):
        try:
            with open(p, encoding="utf-8") as fh:
                doc = json.load(fh)
        except (OSError, ValueError):
            continue
        for old, new in doc.get("pairs", []):
            if old.startswith(sha):
                hits.append({"map": os.path.relpath(p, root), "old": old, "new": new, "rewrittenAt": doc.get("rewrittenAt")})
    return hits


# ---------------------------------------------------------------- CLI

def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--report", action="store_true")
    ap.add_argument("--precheck", action="store_true")
    ap.add_argument("--cutoff-days", type=int, default=30)
    ap.add_argument("--allow-evidence-loss", action="store_true")
    ap.add_argument("--now")
    ap.add_argument("--sha-map", nargs=2, metavar=("OLD_REF", "NEW_REF"))
    ap.add_argument("--out")
    ap.add_argument("--translate")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    if a.report:
        r = report(a.root, os.environ.get("GITHUB_REPOSITORY"), os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN"))
        print(json.dumps(r, ensure_ascii=False, indent=1) if a.json else plain_report(r))
        return 0 if r["github"]["level"] in ("OK", "NOTICE") else (2 if r["github"]["level"] == "UNKNOWN" else 1)
    if a.precheck:
        now = datetime.datetime.fromisoformat(a.now) if a.now else None
        if now and now.tzinfo is None:
            now = now.replace(tzinfo=KST)
        r = precheck(a.root, now, a.cutoff_days, a.allow_evidence_loss)
        print(json.dumps(r, ensure_ascii=False, indent=1) if a.json else
              ("[압축 전 점검] 통과" if r["ok"] else "[압축 전 점검] 거부\n  - " + "\n  - ".join(r["reasons"])))
        return 0 if r["ok"] else 1
    if a.sha_map:
        out = a.out or os.path.join(a.root, MAP_DIR, datetime.datetime.now(KST).strftime("%Y%m%d-%H%M%S") + ".json")
        doc = write_sha_map(a.root, a.sha_map[0], a.sha_map[1], out, a.cutoff_days)
        print(f"SHA 지도: {out} · 짝 {len(doc['pairs'])} · 사라진 옛 커밋 {doc['droppedOldCommits']} · {doc['oldHead'][:10]} → {doc['newHead'][:10]}")
        return 0
    if a.translate:
        hits = translate(a.root, a.translate)
        print(json.dumps(hits, ensure_ascii=False, indent=1) if hits else f"{a.translate}: 지도에 없음(재작성 전 SHA 가 아니거나 dropped)")
        return 0 if hits else 1
    ap.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
