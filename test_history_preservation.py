#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""이력 보존 계약 (2026-09-10, 구간 8).

무슨 일이 있었나
  2026-09-02 08:25 KST 월간 `compact-history` 가 main 이력을 graft+filter-branch 로 다시 써서 force push 했다(커밋 3,151개 번호 변경).
  모의투자 러너 clone 이 공통 조상을 잃어 8거래일 멈췄고(test_paper_runner_sync), 문서·PR·검증 원장이 가리키는 커밋 SHA 는
  저장소에 없는 번호가 됐다. 다음 예약 실행(2026-10-02 06:30 KST)은 사전등록 창 안이었다.

잠그는 것
  · compact-history.yml 은 예약(schedule)으로 돌지 않는다 — workflow_dispatch + confirm 문구가 있어야 한다.
  · 재작성 전에 check_history_evidence.py --precheck 를 통과해야 하고, 재작성 뒤 SHA 지도를 docs/audits/history_rewrites/ 에 커밋한다.
  · push 는 --force-with-lease 만(무조건 --force 없음). 전체 이력을 받는다(fetch-depth: 0).
  · check_history_evidence: 지도는 꼬리 정렬 + tree/author-time 검산 · 수집 시간대·얕은 clone·원장 증거 손실은 거부 ·
    토큰 없는 용량 보고는 "확인 불가"(네트워크를 부르지 않는다).
  · ops-daily 가 용량 보고(비파괴)를 매일 남긴다.
"""
import datetime
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import check_history_evidence as H     # noqa: E402

WF = os.path.join(HERE, ".github", "workflows", "compact-history.yml")
OPS = os.path.join(HERE, ".github", "workflows", "ops-daily.yml")
DOC = os.path.join(HERE, "docs", "HISTORY_PRESERVATION.md")


def read(p):
    with open(p, encoding="utf-8") as fh:
        return fh.read()


def code_lines(text):
    return "\n".join(l for l in text.splitlines() if not l.lstrip().startswith("#"))


def git(root, *args, date=None):
    env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@example.com", GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@example.com")
    if date:
        env["GIT_AUTHOR_DATE"] = env["GIT_COMMITTER_DATE"] = date
    return subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, env=env, check=True).stdout.strip()


class CompactHistoryWorkflow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.body = read(WF)
        cls.code = code_lines(cls.body)

    def test_예약_실행이_없고_수동_확인_문구가_필요하다(self):
        on_block = self.code.split("\non:\n", 1)[1].split("\npermissions:", 1)[0]
        self.assertNotIn("schedule:", on_block, "월간 자동 재작성은 2026-09-10 에 끈다 — 사람이 confirm 을 쳐야 돈다")
        self.assertIn("workflow_dispatch:", on_block)
        self.assertIn("confirm:", on_block)
        self.assertIn("inputs.confirm == 'COMPACT-MAIN-HISTORY'", self.code)

    def test_사전_점검과_SHA_지도가_있다(self):
        self.assertIn("check_history_evidence.py --precheck", self.code)
        self.assertIn("check_history_evidence.py --sha-map refs/original/refs/heads/main main", self.code)
        self.assertIn("docs/audits/history_rewrites", self.code)
        # 지도 커밋은 refs/original 을 지우기 전에, push 는 그 뒤에
        i_map = self.code.index("--sha-map")
        i_rm = self.code.index("rm -rf .git/refs/original")
        i_push = self.code.index("git push --force-with-lease origin main")
        self.assertLess(i_map, i_rm)
        self.assertLess(i_rm, i_push)

    def test_전체_이력을_받고_force_with_lease_만_쓴다(self):
        self.assertIn("fetch-depth: 0", self.code)
        self.assertIn("--force-with-lease", self.code)
        for bad in ("push --force origin", "push -f ", "reset --hard"):
            self.assertNotIn(bad, self.code, bad)

    def test_경위_주석이_남아있다(self):
        self.assertIn("2026-09-02", self.body)
        self.assertIn("HISTORY_PRESERVATION.md", self.body)


class OpsDailyReports(unittest.TestCase):
    def test_일일_점검이_용량_보고를_남긴다(self):
        self.assertIn("check_history_evidence.py --report", read(OPS))


class Doc(unittest.TestCase):
    def test_문서가_사실과_결정을_담는다(self):
        doc = read(DOC)
        for needle in ("2026-09-02", "2026-10-02", "SHA 지도", "data-live", "force-with-lease", "확인 불가"):
            self.assertIn(needle, doc, needle)


class Tool(unittest.TestCase):
    def test_지도는_꼬리에서_맞추고_tree_author_time_을_검산한다(self):
        old = [("o1", "t1", "1"), ("o2", "t2", "2"), ("o3", "t3", "3"), ("o4", "t4", "4")]
        new = [("n3", "t3", "3"), ("n4", "t4", "4")]
        m = H.sha_map(old, new)
        self.assertEqual(m["pairs"], [["o3", "n3"], ["o4", "n4"]])
        self.assertEqual(m["dropped"], ["o1", "o2"])
        self.assertEqual(m["mismatches"], [])
        bad = H.sha_map(old, [("n3", "t3", "3"), ("n4", "tX", "4")])
        self.assertEqual(bad["mismatches"], [{"old": "o4", "new": "n4"}])
        with self.assertRaises(ValueError):
            H.sha_map(new, old)

    def test_실제_git_재작성을_재현해_지도를_쓰고_옛_SHA_를_번역한다(self):
        root = tempfile.mkdtemp(prefix="gaeo-hist-")
        try:
            git(root, "init", "-q", "-b", "main")
            shas = []
            for i in range(4):
                with open(os.path.join(root, "f.txt"), "w") as fh:
                    fh.write(f"v{i}\n")
                git(root, "add", "f.txt")
                git(root, "commit", "-q", "-m", f"c{i}", date=f"2026-08-{10 + i:02d}T10:00:00+09:00")
                shas.append(git(root, "rev-parse", "HEAD"))
            git(root, "update-ref", "refs/original/refs/heads/main", "main")
            # compact-history 와 같은 효과: c1 을 뿌리로 graft 하고 다시 쓴다
            git(root, "replace", "--graft", shas[1])
            subprocess.run(["git", "-C", root, "filter-branch", "-f", "--", "main"], capture_output=True, text=True,
                           env=dict(os.environ, FILTER_BRANCH_SQUELCH_WARNING="1"), check=True)
            git(root, "replace", "-d", shas[1])
            out = os.path.join(root, "docs", "audits", "history_rewrites", "test.json")
            doc = H.write_sha_map(root, "refs/original/refs/heads/main", "main", out, cutoff_days=30)
            self.assertEqual(doc["oldCommitCount"], 4)
            self.assertEqual(doc["newCommitCount"], 3)
            self.assertEqual(doc["droppedOldCommits"], 1)
            self.assertEqual(doc["oldHead"], shas[3])
            self.assertEqual(doc["newHead"], git(root, "rev-parse", "main"))
            self.assertNotEqual(doc["oldHead"], doc["newHead"], "재작성이면 HEAD 번호가 바뀐다")
            self.assertEqual(git(root, "rev-parse", "main^{tree}"), git(root, "rev-parse", f"{shas[3]}^{{tree}}"), "내용(트리)은 같다")
            hits = H.translate(root, shas[3][:10])
            self.assertEqual(len(hits), 1)
            self.assertEqual(hits[0]["new"], doc["newHead"])
            self.assertEqual(H.translate(root, shas[0][:10]), [], "사라진 커밋은 지도에 없다")
        finally:
            shutil.rmtree(root, ignore_errors=True)

    def test_사전_점검은_수집_시간대_얕은_clone_원장_증거_손실을_거부한다(self):
        root = tempfile.mkdtemp(prefix="gaeo-pre-")
        try:
            git(root, "init", "-q", "-b", "main")
            with open(os.path.join(root, "a.txt"), "w") as fh:
                fh.write("old\n")
            git(root, "add", "a.txt")
            git(root, "commit", "-q", "-m", "old", date="2026-07-01T10:00:00+09:00")
            old_sha = git(root, "rev-parse", "HEAD")
            with open(os.path.join(root, "a.txt"), "w") as fh:
                fh.write("new\n")
            git(root, "add", "a.txt")
            git(root, "commit", "-q", "-m", "new", date="2026-09-09T10:00:00+09:00")
            new_sha = git(root, "rev-parse", "HEAD")
            night = datetime.datetime(2026, 9, 11, 6, 30, tzinfo=H.KST)
            # 원장 없음 · 새벽 → 통과
            self.assertTrue(H.precheck(root, night, 30)["ok"])
            # 수집 시간대 → 거부
            day = datetime.datetime(2026, 9, 10, 10, 0, tzinfo=H.KST)
            r = H.precheck(root, day, 30)
            self.assertFalse(r["ok"])
            self.assertTrue(any("08:30~16:40" in x for x in r["reasons"]))
            # 주말 낮은 수집 시간대가 아니다
            self.assertFalse(H.in_collector_window(datetime.datetime(2026, 9, 12, 10, 0, tzinfo=H.KST)))
            # 원장이 오래된 커밋을 가리키면 거부, 명시 허용이면 통과(기록은 남는다)
            os.makedirs(os.path.join(root, "docs", "audits", "validation_runs"))
            with open(os.path.join(root, H.LEDGER), "w", encoding="utf-8") as fh:
                fh.write(json.dumps({"scheduleId": "VS-X", "gitSha": old_sha, "status": "COMPLETED"}) + "\n")
                fh.write(json.dumps({"scheduleId": "VS-Y", "gitSha": new_sha, "status": "COMPLETED"}) + "\n")
            r = H.precheck(root, night, 30)
            self.assertFalse(r["ok"])
            self.assertEqual([x["sha"] for x in r["evidenceAtRisk"]], [old_sha])
            r2 = H.precheck(root, night, 30, allow_evidence_loss=True)
            self.assertTrue(r2["ok"])
            self.assertEqual(len(r2["evidenceAtRisk"]), 1, "허용해도 무엇이 사라지는지는 기록한다")
            # 러너 최근 활동 → 거부
            os.makedirs(os.path.join(root, "paper_trading"))
            json.dump({"lastCycleAt": "2026-09-11T06:00:00+09:00"}, open(os.path.join(root, H.PAPER_STATE), "w"))
            r3 = H.precheck(root, night, 30, allow_evidence_loss=True)
            self.assertFalse(r3["ok"])
            self.assertTrue(any("러너" in x for x in r3["reasons"]))
        finally:
            shutil.rmtree(root, ignore_errors=True)

    def test_얕은_clone_은_거부한다(self):
        # 이 세션의 clone 이 얕으면 그것으로, 아니면 판정 함수만 확인한다
        night = datetime.datetime(2026, 9, 12, 6, 30, tzinfo=H.KST)
        r = H.precheck(HERE, night, 30, allow_evidence_loss=True)
        if H.is_shallow(HERE):
            self.assertFalse(r["ok"])
            self.assertTrue(any("얕은 clone" in x for x in r["reasons"]))
        else:
            self.assertNotIn("얕은 clone", " ".join(r["reasons"]))

    def test_토큰_없는_용량_보고는_확인_불가이고_네트워크를_부르지_않는다(self):
        def boom(*a, **k):
            raise AssertionError("토큰 없이 네트워크를 불렀다")
        r = H.report(HERE, repo=None, token=None, opener=boom)
        self.assertEqual(r["github"]["level"], "UNKNOWN")
        self.assertIsNone(r["github"]["sizeGiB"])
        self.assertIn("확인 불가", r["github"]["note"])
        self.assertEqual((H.level_for(2.9), H.level_for(3.0), H.level_for(4.5), H.level_for(None)), ("OK", "NOTICE", "PROTECT", "UNKNOWN"))

    def test_용량_보고는_가짜_응답으로_GiB_와_단계를_계산한다(self):
        class Res:
            def __init__(self, kb):
                self.kb = kb
            def read(self):
                return json.dumps({"size": self.kb}).encode("utf-8")
            def __enter__(self):
                return self
            def __exit__(self, *a):
                return False
        r = H.report(HERE, repo="o/r", token="t", opener=lambda req, timeout: Res(1972394))
        self.assertEqual(r["github"]["sizeGiB"], 1.88)
        self.assertEqual(r["github"]["level"], "OK")
        r2 = H.report(HERE, repo="o/r", token="t", opener=lambda req, timeout: Res(5 * 1048576))
        self.assertEqual(r2["github"]["level"], "PROTECT")


if __name__ == "__main__":
    unittest.main(verbosity=2)
