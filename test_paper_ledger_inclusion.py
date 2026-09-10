#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""장부 포함성 판정·재기준 전 백업 계약 (2026-09-10 구간 A).

2026-09-10 첫 판 러너는 "원격 state.json 의 lastCycleAt 이 같거나 더 새로우면 로컬 기록이 전부 원격에 있다"고 보고
origin/main 으로 재기준했다. 시각은 거래·수량·현금·보유·다른 계좌 기록이 들어 있다는 증거가 아니다. 이 파일은
paper_ledger_inclusion.py 가 **내용으로** 포함을 증명하고, 증명하지 못하면 포함으로 보지 않는지를 합성 장부로 잠근다.

부정 사례(전부 합성 장부 — 진짜 paper_trading/ 은 읽지도 쓰지도 않는다):
  1. 같은 lastCycleAt 인데 거래·수량·현금(equity_curve)·보유가 다르다 → NOT_COVERED
  2. 원격이 더 새롭지만 로컬에만 있는 거래가 있다 → NOT_COVERED
  3. 다른 계좌(smart_v2 …)에 안 보낸 기록이 있다 → NOT_COVERED
  5. 작업트리(미커밋·untracked)의 기록도 본다 → NOT_COVERED
  6. 없는 ref·읽기 실패 → UNDETERMINED(exit 2), 포함 아님
  7. 백업: 폴더 아님·이미 있음·디스크 부족·백업 중 원본 변경·bundle 실패 → 실패(재기준 금지)
  8. 전부 같음 → COVERED, 원격이 더 뒤 회차 + 줄 전부 포함 + 보유 투영 증명 → COVERED
  + 빈 파일·깨진 줄·lastCycleAt/openMeta 없음·보유 목록 불일치 → UNDETERMINED
"""
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import unittest
import warnings

import paper_ledger_inclusion as pli

T1, T2, T3 = "2026-09-01T15:05:09+09:00", "2026-09-02T09:05:11+09:00", "2026-09-03T09:05:12+09:00"


def state(last, open_ids, result="CYCLE_OK", **extra):
    d = {"schemaVersion": "gaeo_paper_state_v1", "lastCycleAt": last, "lastCycleResult": result,
         "openMeta": {t: {"mfePrice": 1.0} for t in open_ids}}
    d.update(extra)
    return json.dumps(d, ensure_ascii=False, indent=1) + "\n"


def trade(tid, status="OPEN", qty=3, price=70000.0):
    return json.dumps({"trade_id": tid, "environment": "LIVE_PAPER", "symbol": "005930", "status": status,
                       "quantity": qty, "entry_price": price}, ensure_ascii=False) + "\n"


def eq(at, cash):
    return json.dumps({"at": at, "cash": cash, "openCount": 1}) + "\n"


def T(d):
    return {k: (v.encode("utf-8") if isinstance(v, str) else v) for k, v in d.items()}


def base_tree():
    return {
        "state.json": state(T1, ["t1"]), "trades.jsonl": trade("t1"), "equity_curve.jsonl": eq(T1, 900000.0),
        "summary.json": '{"cash": 900000.0}\n', "README.md": "doc\n",
        "smart_v2/state.json": state(T1, []), "smart_v2/trades.jsonl": "", "smart_v2/observations.jsonl": "",
    }


class Verdicts(unittest.TestCase):
    def cmp(self, local, remote):
        return pli.compare_trees(T(local), T(remote))

    def test_8_전부_같으면_COVERED_강한_근거(self):
        r = self.cmp(base_tree(), base_tree())
        self.assertEqual(r["verdict"], pli.COVERED)
        self.assertTrue(any("강한 근거" in x for x in r["reasons"]))

    def test_8_README_만_다르면_COVERED(self):
        remote = base_tree(); remote["README.md"] = "other\n"
        self.assertEqual(self.cmp(base_tree(), remote)["verdict"], pli.COVERED)

    def test_1_같은_회차인데_로컬에만_거래가_더_있으면_NOT_COVERED(self):
        local = base_tree()
        local["trades.jsonl"] = trade("t1") + trade("t2")
        local["state.json"] = state(T1, ["t1", "t2"])
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["trades.jsonl"]["missing"], ["t2"])
        self.assertIn("같은 회차", r["files"]["state.json"]["why"])

    def test_1_같은_회차인데_수량이_다르면_NOT_COVERED(self):
        local = base_tree(); local["trades.jsonl"] = trade("t1", qty=5)
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["trades.jsonl"]["missing"], ["t1"])

    def test_1_같은_회차인데_현금_곡선이_다르면_NOT_COVERED(self):
        local = base_tree(); local["equity_curve.jsonl"] = eq(T1, 850000.0)
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["equity_curve.jsonl"]["status"], pli.NOT_COVERED)

    def test_1_같은_회차인데_state_내용만_다르면_NOT_COVERED(self):
        local = base_tree(); local["state.json"] = state(T1, ["t1"], result="CYCLE_OK — NO_ACTION")
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertTrue(any("같은 lastCycleAt" in x for x in r["reasons"]))

    def test_2_원격이_더_새롭지만_로컬에만_있는_거래가_있으면_NOT_COVERED(self):
        local = base_tree()
        local["trades.jsonl"] = trade("t1") + trade("t2")
        local["state.json"] = state(T2, ["t1", "t2"])
        local["equity_curve.jsonl"] = eq(T1, 900000.0) + eq(T2, 700000.0)
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state(T3, [])
        remote["equity_curve.jsonl"] = eq(T1, 900000.0) + eq(T3, 910000.0)
        r = self.cmp(local, remote)
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["trades.jsonl"]["missing"], ["t2"])
        self.assertIn("원격에 없는 로컬 줄", r["files"]["state.json"]["why"])
        self.assertFalse(r["accounts"]["."]["eventsCovered"])

    def test_2_로컬이_더_새로우면_NOT_COVERED(self):
        local = base_tree(); local["state.json"] = state(T2, ["t1"])
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertTrue(any("로컬 회차" in x for x in r["reasons"]))

    def test_3_다른_계좌에_안_보낸_기록이_있으면_NOT_COVERED(self):
        local = base_tree()
        local["smart_v2/observations.jsonl"] = json.dumps({"at": T1, "trade_id": "s1", "note": "obs"}) + "\n"
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertTrue(r["accounts"]["."]["eventsCovered"])
        self.assertFalse(r["accounts"]["smart_v2"]["eventsCovered"])
        self.assertIn("smart_v2/observations.jsonl", r["files"])

    def test_3_로컬에만_있는_계좌_폴더는_NOT_COVERED(self):
        local = base_tree(); local["scalp_v3/state.json"] = state(T1, [])
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["scalp_v3/state.json"]["status"], pli.NOT_COVERED)

    def test_3_로컬_원장이_비어_있고_원격에_파일이_없으면_잃을_것이_없다(self):
        remote = base_tree(); del remote["smart_v2/observations.jsonl"]
        self.assertEqual(self.cmp(base_tree(), remote)["verdict"], pli.COVERED)

    def test_8_원격이_더_뒤_회차이고_줄_전부_포함_보유_투영_증명이면_COVERED(self):
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state(T2, [])
        remote["equity_curve.jsonl"] = eq(T1, 900000.0) + eq(T2, 910000.0)
        remote["summary.json"] = '{"cash": 910000.0}\n'
        r = self.cmp(base_tree(), remote)
        self.assertEqual(r["verdict"], pli.COVERED, r["reasons"])
        self.assertIn("보유", r["files"]["state.json"]["why"])
        self.assertEqual(r["files"]["summary.json"]["status"], pli.COVERED)
        self.assertTrue(r["accounts"]["."]["stateOk"])

    def test_8_원격이_더_뒤_회차라도_원격_보유_목록이_원격_원장과_안_맞으면_UNDETERMINED(self):
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state(T2, ["t1"])       # CLOSED 인데 보유 목록에 남아 있다
        r = self.cmp(base_tree(), remote)
        self.assertEqual(r["verdict"], pli.UNDETERMINED)
        self.assertTrue(any("원격 보유 목록" in x for x in r["reasons"]))

    def test_8_로컬_보유_목록이_로컬_원장과_안_맞으면_UNDETERMINED(self):
        local = base_tree(); local["state.json"] = state(T1, [])   # t1 OPEN 인데 보유 목록 비어 있음
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state(T2, [])
        r = self.cmp(local, remote)
        self.assertEqual(r["verdict"], pli.UNDETERMINED)
        self.assertTrue(any("로컬 보유 목록" in x for x in r["reasons"]))

    def test_8_로컬_OPEN_거래_줄이_원격에_없으면_이벤트_원장_단계에서_NOT_COVERED(self):
        # holdings_projection 의 "보유가 원격 원장에 없음" 분기는 같은 계좌 jsonl 줄이 전부 포함될 때만 호출되므로
        # 여기서는 그 앞 단계(이벤트 원장 줄 누락)가 먼저 잡는다. 어느 쪽이든 결론은 NOT_COVERED 다.
        local = base_tree()
        local["trades.jsonl"] = trade("t1") + trade("t9")
        local["state.json"] = state(T1, ["t1", "t9"])
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state(T2, [])
        r = self.cmp(local, remote)
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertIn("t9", json.dumps(r["files"]["trades.jsonl"]["missing"]))

    def test_장부_형식이_아닌_파일이_다르면_파생으로_가정하지_않는다(self):
        # 장래 엔진이 .jsonl 아닌 원장(csv·ndjson 등)을 추가해도 조용히 버리지 않는다(fail closed)
        local = base_tree(); local["events.csv"] = "t2,5\n"
        remote = base_tree(); remote["events.csv"] = "t1,3\n"
        r = self.cmp(local, remote)
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["events.csv"]["status"], pli.NOT_COVERED)
        local = base_tree(); local["ledger.ndjson"] = '{"trade_id":"z9"}\n'
        self.assertEqual(self.cmp(local, base_tree())["verdict"], pli.NOT_COVERED, "로컬에만 있는 미지 형식 파일도 포함 아님")

    def test_루트의_history_v2_v3_는_해당_계좌로_귀속된다(self):
        self.assertEqual(pli._account_of("history_v2.json"), "smart_v2")
        self.assertEqual(pli._account_of("history_v3.json"), "scalp_v3")
        self.assertEqual(pli._account_of("history.json"), ".")
        self.assertEqual(pli._account_of("smart_v2/state.json"), "smart_v2")
        # smart_v2 state 가 로컬이 더 새로우면(NOT OK) 루트의 history_v2.json 차이도 파생으로 인정하지 않는다
        local = base_tree(); local["smart_v2/state.json"] = state(T2, []); local["history_v2.json"] = '{"a": 1}\n'
        remote = base_tree(); remote["history_v2.json"] = '{"a": 0}\n'
        r = self.cmp(local, remote)
        self.assertEqual(r["files"]["history_v2.json"]["status"], pli.NOT_COVERED)

    def test_파생_스냅샷은_계좌_state_판정이_OK가_아니면_NOT_COVERED(self):
        # state 가 바이트까지 같으면 파생 스냅샷(summary)의 차이는 재생성 차이로 본다(잃은 기록이 아니다)
        local = base_tree(); local["summary.json"] = '{"cash": 1.0}\n'
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.COVERED)
        # 그러나 같은 계좌의 state 판정이 OK 가 아니면(로컬이 더 새로움) 파생 스냅샷도 포함으로 보지 않는다
        local["state.json"] = state(T2, ["t1"])
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.NOT_COVERED)
        self.assertEqual(r["files"]["summary.json"]["status"], pli.NOT_COVERED)

    def test_빈_state_json은_같음으로_통과시키지_않는다(self):
        local = base_tree(); local["state.json"] = ""
        r = self.cmp(local, base_tree())
        self.assertEqual(r["verdict"], pli.UNDETERMINED)

    def test_깨진_jsonl_줄은_UNDETERMINED(self):
        local = base_tree(); local["trades.jsonl"] = trade("t1") + "{not json\n"
        self.assertEqual(self.cmp(local, base_tree())["verdict"], pli.UNDETERMINED)

    def test_lastCycleAt_없는_state는_UNDETERMINED(self):
        local = base_tree(); local["state.json"] = '{"schemaVersion": "x", "openMeta": {"t1": {}}}\n'
        self.assertEqual(self.cmp(local, base_tree())["verdict"], pli.UNDETERMINED)

    def test_openMeta_없는_state는_원격이_새로워도_UNDETERMINED(self):
        local = base_tree(); local["state.json"] = json.dumps({"lastCycleAt": T1}) + "\n"
        remote = base_tree(); remote["state.json"] = state(T2, ["t1"])
        self.assertEqual(self.cmp(local, remote)["verdict"], pli.UNDETERMINED)

    def test_로컬_장부가_없으면_UNDETERMINED(self):
        self.assertEqual(self.cmp({"README.md": "x"}, base_tree())["verdict"], pli.UNDETERMINED)

    def test_시각_형식이_달라도_시각으로_비교한다(self):
        remote = base_tree()
        remote["trades.jsonl"] = trade("t1") + trade("t1", status="CLOSED")
        remote["state.json"] = state("2026-09-02T00:05:11Z", [])     # UTC 표기 = KST 09:05
        self.assertEqual(self.cmp(base_tree(), remote)["verdict"], pli.COVERED)
        remote["state.json"] = state("2026-09-01T06:05:09Z", [])     # KST 15:05:09 와 같은 순간 → 같은 회차
        self.assertEqual(self.cmp(base_tree(), remote)["verdict"], pli.NOT_COVERED)


def git(cwd, *args):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise AssertionError(f"git {' '.join(args)} 실패 in {cwd}: {r.stdout}{r.stderr}")
    return r.stdout.strip()


def write(root, rel, body):
    p = os.path.join(root, *rel.split("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(body)


class GitAndWorktree(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="pli_git_")
        self.repo = os.path.join(self.tmp, "repo")
        os.makedirs(self.repo)
        git(self.repo, "init", "-q")
        git(self.repo, "checkout", "-q", "-b", "main")
        git(self.repo, "config", "user.name", "t"); git(self.repo, "config", "user.email", "t@example.com")
        for rel, body in base_tree().items():
            write(self.repo, "paper_trading/" + rel, body)
        write(self.repo, "data.js", "const D=1;\n")
        git(self.repo, "add", "-A"); git(self.repo, "commit", "-q", "-m", "base")
        # 원격 흉내: 같은 트리의 고아 브랜치 + 한 회차 더
        git(self.repo, "checkout", "-q", "--orphan", "remote-sim")
        git(self.repo, "commit", "-q", "-m", "rewritten")
        write(self.repo, "paper_trading/trades.jsonl", trade("t1") + trade("t1", status="CLOSED"))
        write(self.repo, "paper_trading/state.json", state(T2, []))
        git(self.repo, "commit", "-q", "-am", "next cycle")
        git(self.repo, "checkout", "-q", "main")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_git_트리를_읽는다(self):
        files = pli.read_tree_from_git(self.repo, "remote-sim")
        self.assertIn("state.json", files); self.assertIn("smart_v2/state.json", files)
        self.assertEqual(files["state.json"].decode(), state(T2, []))

    def test_없는_ref는_RuntimeError(self):
        with self.assertRaises(RuntimeError):
            pli.read_tree_from_git(self.repo, "no-such-ref")

    def test_CLI_종료코드(self):
        self.assertEqual(pli.main(["check", "--repo", self.repo, "--local", "HEAD", "--remote", "remote-sim"]), 0)
        self.assertEqual(pli.main(["check", "--repo", self.repo, "--local", "HEAD", "--remote", "no-such-ref"]), 2)
        self.assertEqual(pli.main(["--repo", self.repo, "--local", "remote-sim", "--remote", "HEAD"]), 1)  # 하위명령 생략 = check

    def test_5_작업트리의_미커밋_untracked_기록도_본다(self):
        write(self.repo, "paper_trading/scalp_v3/state.json", state(T1, []))
        write(self.repo, "paper_trading/trades.jsonl", trade("t1") + trade("t7"))
        write(self.repo, "paper_trading/state.json", state(T1, ["t1", "t7"]))
        self.assertEqual(pli.main(["check", "--repo", self.repo, "--remote", "remote-sim"]), 0, "HEAD 기준으로는 포함")
        self.assertEqual(pli.main(["check", "--repo", self.repo, "--remote", "remote-sim", "--worktree"]), 1, "작업트리 기준으로는 포함 아님")


class Backup(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="pli_bk_")
        self.repo = os.path.join(self.tmp, "repo")
        os.makedirs(self.repo)
        git(self.repo, "init", "-q"); git(self.repo, "checkout", "-q", "-b", "main")
        git(self.repo, "config", "user.name", "t"); git(self.repo, "config", "user.email", "t@example.com")
        for rel, body in base_tree().items():
            write(self.repo, "paper_trading/" + rel, body)
        git(self.repo, "add", "-A"); git(self.repo, "commit", "-q", "-m", "old history")
        self.old_head = git(self.repo, "rev-parse", "HEAD")
        git(self.repo, "checkout", "-q", "--orphan", "newbase")
        git(self.repo, "commit", "-q", "-m", "rewritten base")
        git(self.repo, "checkout", "-q", "main")
        write(self.repo, "paper_trading/scalp_v3/state.json", state(T1, []))   # untracked 도 백업돼야 한다
        self.dest = os.path.join(self.tmp, "backups")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_복사_bundle_manifest_검증_복원(self):
        info = pli.backup_ledger(self.repo, self.dest, label="t1", not_ref="newbase")
        d = info["dir"]
        self.assertTrue(os.path.isfile(os.path.join(d, "manifest.json")))
        self.assertTrue(os.path.isfile(os.path.join(d, "README.txt")))
        self.assertTrue(os.path.isfile(os.path.join(d, "paper_trading", "scalp_v3", "state.json")), "untracked 파일도 복사")
        m = json.load(open(os.path.join(d, "manifest.json"), encoding="utf-8"))
        self.assertEqual(m["fileCount"], len(base_tree()) + 1)
        self.assertEqual(m["head"], self.old_head)
        for rel, meta in m["files"].items():
            with open(os.path.join(d, "paper_trading", *rel.split("/")), "rb") as fh:
                self.assertEqual(hashlib.sha256(fh.read()).hexdigest(), meta["sha256"])
        self.assertTrue(pli.verify_backup(d)["ok"])
        # bundle: 옛 HEAD 가 들어 있고, 새 기준(newbase)만 가진 저장소에서도 되살릴 수 있다(전제 조건 충족)
        self.assertIsNotNone(info["bundle"])
        heads = git(self.repo, "bundle", "list-heads", info["bundle"])
        self.assertIn(self.old_head, heads)
        git(self.repo, "fetch", "-q", info["bundle"], "HEAD:refs/gaeo-backup/restored-t1")
        self.assertEqual(git(self.repo, "rev-parse", "refs/gaeo-backup/restored-t1"), self.old_head)

    def test_원격에_다_있으면_bundle_없이도_성공하고_manifest에_적힌다(self):
        info = pli.backup_ledger(self.repo, self.dest, label="t2", not_ref="HEAD")
        self.assertIsNone(info["bundle"])
        m = json.load(open(info["manifest"], encoding="utf-8"))
        self.assertIsNone(m["bundle"]); self.assertIn("만들지 않았다", m["bundleNote"])
        self.assertTrue(pli.verify_backup(info["dir"])["ok"])

    def test_7_폴더가_아니거나_이미_있으면_실패(self):
        f = os.path.join(self.tmp, "a-file"); open(f, "w").close()
        with self.assertRaises(RuntimeError):
            pli.backup_ledger(self.repo, f, label="x")
        pli.backup_ledger(self.repo, self.dest, label="dup")
        with self.assertRaises(RuntimeError):
            pli.backup_ledger(self.repo, self.dest, label="dup")
        self.assertEqual(pli.main(["backup", "--repo", self.repo, "--dest", f, "--label", "y"]), 2)
        self.assertEqual(pli.main(["backup", "--repo", self.repo, "--dest", self.dest, "--label", "dup"]), 2)

    def test_7_디스크_여유가_없으면_실패(self):
        orig = shutil.disk_usage
        shutil.disk_usage = lambda p: type("U", (), {"free": 10})()
        try:
            with self.assertRaises(RuntimeError) as cm:
                pli.backup_ledger(self.repo, self.dest, label="nodisk")
            self.assertIn("디스크", str(cm.exception))
        finally:
            shutil.disk_usage = orig

    def test_7_백업_중_원본이_바뀌면_무효(self):
        orig = pli.read_tree_from_worktree
        calls = {"n": 0}

        def flaky(repo, subdir=pli.LEDGER_DIR):
            files = orig(repo, subdir)
            if os.path.abspath(repo) == os.path.abspath(self.repo):
                calls["n"] += 1
                if calls["n"] == 2:      # 두 번째 읽기(검증)에서 새 회차가 끼어든 상황
                    files = dict(files); files["trades.jsonl"] = files["trades.jsonl"] + trade("t2").encode()
            return files
        pli.read_tree_from_worktree = flaky
        try:
            with self.assertRaises(RuntimeError) as cm:
                pli.backup_ledger(self.repo, self.dest, label="race")
            self.assertIn("바뀌었다", str(cm.exception))
        finally:
            pli.read_tree_from_worktree = orig

    def test_7_git_bundle_실패는_예외이고_반쯤_만든_폴더는_failed_로_표시된다(self):
        with self.assertRaises(RuntimeError):
            pli.backup_ledger(self.repo, self.dest, label="badref", not_ref="no-such-ref")
        self.assertFalse(os.path.isdir(os.path.join(self.dest, "badref")), "실패한 백업이 정상 백업처럼 남으면 안 된다")
        self.assertTrue(os.path.isdir(os.path.join(self.dest, "badref.failed")), "원인 조사용으로 .failed 이름으로 남긴다")
        self.assertFalse(pli.verify_backup(os.path.join(self.dest, "badref.failed"))["ok"])

    def test_저장소가_크면_bundle_없이_장부_복사와_manifest만_남기고_성공한다(self):
        # 공통 조상이 없으면 --not origin/main 은 아무것도 빼지 못해 bundle 이 옛 이력 전체(집 PC 는 수 GB)가 된다.
        self.assertIsInstance(pli.repo_object_bytes(self.repo), int)
        orig = pli.repo_object_bytes
        pli.repo_object_bytes = lambda repo: pli.BUNDLE_MAX_BYTES + 1
        try:
            info = pli.backup_ledger(self.repo, self.dest, label="big", not_ref="newbase")
        finally:
            pli.repo_object_bytes = orig
        self.assertIsNone(info["bundle"]); self.assertIn("상한", info["bundleNote"])
        self.assertFalse(os.path.exists(os.path.join(info["dir"], "repo.bundle")))
        self.assertTrue(pli.verify_backup(info["dir"])["ok"], "장부 복사본·manifest 검증은 그대로 통과")
        self.assertTrue(os.path.isfile(os.path.join(info["dir"], "paper_trading", "trades.jsonl")))

    def test_검증은_변조를_잡는다(self):
        info = pli.backup_ledger(self.repo, self.dest, label="v")
        p = os.path.join(info["dir"], "paper_trading", "trades.jsonl")
        with open(p, "a", encoding="utf-8") as fh:
            fh.write(trade("evil"))
        v = pli.verify_backup(info["dir"])
        self.assertFalse(v["ok"]); self.assertTrue(any("sha256" in x for x in v["problems"]))
        self.assertEqual(pli.main(["verify-backup", "--dir", info["dir"]]), 2)
        self.assertEqual(pli.main(["verify-backup", "--dir", os.path.join(self.tmp, "nope")]), 2)


if __name__ == "__main__":
    warnings.simplefilter("ignore", ResourceWarning)
    unittest.main(verbosity=2)
