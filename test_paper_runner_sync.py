#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""러너 동기화 계약 (2026-09-10, 구간 A 로 강화) — 원격 이력이 재작성돼도 러너가 스스로 살아나되,
아직 올리지 못한 Paper 기록은 **내용으로 증명되기 전에는** 절대 버리지 않는다.

## 무슨 일이 있었나

2026-09-02 08:25 KST `compact-history` 워크플로가 main 이력을 재작성(filter-branch)하고
force push 했다. 집 PC 러너 전용 clone 의 HEAD 는 09-01 15:05 회차 커밋(재작성 **전** SHA)이라
그 뒤 origin/main 과 **공통 조상이 없어졌다.** 러너 동기화 코드는 그 상태를 "갈라짐"으로 보고
rebase 를 시도했고, 저장소 첫 커밋부터 다시 적용하려다 충돌 → abort → exit 6(수동 확인 필요)로
매 사이클 끝났다. 엔진은 한 번도 돌지 않았고 거래일 8일이 조용히 비었다(Issue #481).

## 2026-09-10 첫 판의 결함 (구간 A 에서 고침)

첫 판은 "원격 state.json 의 lastCycleAt 이 같거나 더 새로우면 원격이 다 가졌다"고 보고 재기준했다.
시각은 거래·수량·현금·보유·다른 계좌 기록이 전부 들어 있다는 증거가 아니다. 그래서 (옛 B2 가 기대하던)
"같은 회차면 재기준" 은 안전 결함이었고, 이제 paper_ledger_inclusion.py 가 파일 내용으로 포함을 증명할 때만
재기준한다. 증명 못 하면 exit 6, 아무것도 옮기지 않는다.

## 이 파일이 잠그는 것 (scripts/paper_cycle.sh 를 임시 bare 저장소 + 러너 clone 에서 **실제로 실행**)

  A.  재작성 + 장부 전부 같음 → 백업(bundle·복사·manifest) 뒤 origin/main 으로 재기준, exit 0, 옛 HEAD 는 refs/gaeo-backup/.
  B.  재작성 + 로컬에만 있는 더 새로운 회차 → exit 6, 로컬 커밋·파일 그대로(fail closed).
  B2. 재작성 + 같은 회차인데 내용이 다름 → exit 6 (첫 판은 0 이었다 — 안전 목적 정정).
  C/C2. 평범한 fast-forward · 이미 최신은 예전과 똑같다(백업 ref·백업 폴더 없음).
  E1. 같은 lastCycleAt + 로컬에만 있는 거래 줄 → exit 6.
  E2. 원격이 더 새롭지만 로컬에만 있는 거래 줄 → exit 6.
  E3. 다른 계좌(smart_v2)에 안 보낸 기록 → exit 6.
  E4. 안 올린 커밋이 있어도 장부 내용이 전부 원격에 있으면 재기준(옛 커밋은 백업 ref + bundle 에 보존).
  E5. 미커밋 작업트리 기록 → 먼저 복구 커밋으로 보존, 그 뒤 포함 안 됨 → exit 6.
  E6. 얕은 복제(shallow) → 공통 조상 판정 불가 → exit 6, 재기준하지 않는다.
  E7. 백업 실패(백업 경로가 파일) → exit 6, 재기준하지 않는다.
  E8. 다른 사이클(또는 복구 도구)이 잠금을 쥐고 있음 → exit 3, 아무것도 안 한다.
  E9. 빈·깨진 state.json → 증명 불가 → exit 6.
  E10. 옛 HEAD 작업트리에 포함성 모듈이 없어도(2026-09-10 이전 clone) origin/main 에서 꺼내 쓴다.
  D.  Windows 용 paper_cycle.ps1 도 같은 경로·같은 문구를 갖는다(정적 대조 — CI 에는 PowerShell 이 없다).

⚠️ 이 테스트는 저장소의 진짜 paper_trading/ 을 건드리지 않는다. 전부 임시 폴더 안에서 끝난다.
"""
import json
import os
import shutil
import subprocess
import tempfile
import unittest
import warnings

HERE = os.path.dirname(os.path.abspath(__file__))
SH = os.path.join(HERE, "scripts", "paper_cycle.sh")
PS1 = os.path.join(HERE, "scripts", "paper_cycle.ps1")
MODULE = os.path.join(HERE, "paper_ledger_inclusion.py")

T1, T2, T3 = "2026-09-01T15:05:09+09:00", "2026-09-02T09:05:11+09:00", "2026-09-03T09:05:12+09:00"
STUB = "print('stub: no changes')\n"


def state(last, open_ids, result="CYCLE_OK"):
    return json.dumps({"schemaVersion": "gaeo_paper_state_v1", "lastCycleAt": last, "lastCycleResult": result,
                       "openMeta": {t: {"mfePrice": 1.0} for t in open_ids}}, ensure_ascii=False, indent=1) + "\n"


def trade(tid, status="OPEN", qty=3):
    return json.dumps({"trade_id": tid, "environment": "LIVE_PAPER", "symbol": "005930", "status": status,
                       "quantity": qty, "entry_price": 70000.0}, ensure_ascii=False) + "\n"


def eq(at, cash):
    return json.dumps({"at": at, "cash": cash, "openCount": 1}) + "\n"


STATE_OLD, STATE_NEW = state(T1, ["t1"]), state(T2, ["t1"])

SEED = {
    "paper_engine.py": STUB, "paper_report.py": STUB, "paper_public.py": STUB,
    "paper_public.js": "window.GAEO_PAPER={}\n", "data.js": "const D=1;\n",
    "paper_trading/state.json": STATE_OLD, "paper_trading/trades.jsonl": trade("t1"),
    "paper_trading/equity_curve.jsonl": eq(T1, 900000.0), "paper_trading/README.md": "doc\n",
    "paper_trading/smart_v2/state.json": state(T1, []), "paper_trading/smart_v2/trades.jsonl": "",
    "paper_trading/smart_v2/observations.jsonl": "",
}


def git(cwd, *args):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise AssertionError(f"git {' '.join(args)} 실패 in {cwd}: {r.stdout}{r.stderr}")
    return r.stdout.strip()


def git_config_user(cwd):
    git(cwd, "config", "user.name", "test")
    git(cwd, "config", "user.email", "test@example.com")


def write(root, rel, body):
    p = os.path.join(root, *rel.split("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(body)


class World:
    """bare origin + seed(작업 복제본) + runner(러너 전용 clone, 부모 폴더에 마커)."""

    def __init__(self, module_in_seed=True, shallow=False, module_body=None):
        self.tmp = tempfile.mkdtemp(prefix="paper_sync_")
        self.origin = os.path.join(self.tmp, "origin.git")
        git(self.tmp, "init", "-q", "--bare", self.origin)
        git(self.origin, "symbolic-ref", "HEAD", "refs/heads/main")
        self.seed = os.path.join(self.tmp, "seed")
        os.makedirs(self.seed)
        git(self.seed, "init", "-q")
        git(self.seed, "checkout", "-q", "-b", "main")
        git_config_user(self.seed)
        for rel, body in SEED.items():
            write(self.seed, rel, body)
        if module_body is not None:
            write(self.seed, "paper_ledger_inclusion.py", module_body)
        elif module_in_seed:
            shutil.copy(MODULE, os.path.join(self.seed, "paper_ledger_inclusion.py"))
        git(self.seed, "add", "-A")
        git(self.seed, "commit", "-q", "-m", "initial")
        git(self.seed, "remote", "add", "origin", self.origin)
        git(self.seed, "push", "-q", "origin", "main")
        root = os.path.join(self.tmp, "runner")
        os.makedirs(root)
        open(os.path.join(root, ".gaeo-paper-runner"), "w").close()
        self.repo = os.path.join(root, "repo")
        if shallow:
            git(self.tmp, "clone", "-q", "--depth", "1", "file://" + self.origin, self.repo)
        else:
            git(self.tmp, "clone", "-q", self.origin, self.repo)
        git_config_user(self.repo)
        self.logs = os.path.join(self.tmp, "logs")
        self.backups = os.path.join(self.tmp, "backups")
        self.lock = os.path.join(self.tmp, "cycle.lock")

    # ---- origin 조작
    def advance_origin_normally(self):
        with open(os.path.join(self.seed, "data.js"), "a", encoding="utf-8") as fh:
            fh.write("const E=2;\n")
        git(self.seed, "commit", "-q", "-am", "normal update")
        git(self.seed, "push", "-q", "origin", "main")

    def advance_origin_paper(self, files, msg="remote paper cycle"):
        for rel, body in files.items():
            write(self.seed, rel, body)
        git(self.seed, "add", "-A")
        git(self.seed, "commit", "-q", "-m", msg)
        git(self.seed, "push", "-q", "origin", "main")

    def add_module_to_origin(self):
        shutil.copy(MODULE, os.path.join(self.seed, "paper_ledger_inclusion.py"))
        git(self.seed, "add", "-A")
        git(self.seed, "commit", "-q", "-m", "add inclusion module")
        git(self.seed, "push", "-q", "origin", "main")

    def rewrite_origin(self):
        """compact-history 와 같은 효과: 같은 트리, 새 뿌리, 새 SHA, force push."""
        git(self.seed, "checkout", "-q", "--orphan", "rewritten")
        git(self.seed, "commit", "-q", "-m", "squashed history (graft)")
        with open(os.path.join(self.seed, "data.js"), "a", encoding="utf-8") as fh:
            fh.write("const F=3;\n")
        git(self.seed, "commit", "-q", "-am", "after rewrite")
        git(self.seed, "push", "-q", "--force", "origin", "rewritten:main")

    # ---- 러너 조작
    def local_write(self, rel, body):
        write(self.repo, rel, body)

    def local_paper_commit(self, files):
        for rel, body in files.items():
            write(self.repo, rel, body)
        git(self.repo, "add", "-A")
        git(self.repo, "commit", "-q", "-m", "paper: local cycle (not pushed)")
        return git(self.repo, "rev-parse", "HEAD")

    def run_cycle(self, env_extra=None):
        env = dict(os.environ, HOME=self.tmp, GAEO_PAPER_LOG_DIR=self.logs,
                   GAEO_PAPER_BACKUP_DIR=self.backups, GAEO_PAPER_LOCK_DIR=self.lock)
        env.update(env_extra or {})
        r = subprocess.run(["bash", SH, "--repo", self.repo, "--ignore-window", "--log-dir", self.logs],
                           capture_output=True, text=True, env=env, timeout=180)
        return r.returncode, r.stdout + r.stderr

    def head(self):
        return git(self.repo, "rev-parse", "HEAD")

    def remote_head(self):
        return git(self.repo, "rev-parse", "origin/main")

    def read_local(self, rel):
        with open(os.path.join(self.repo, *rel.split("/")), encoding="utf-8") as fh:
            return fh.read()

    def backup_refs(self):
        out = git(self.repo, "for-each-ref", "--format=%(refname) %(objectname)", "refs/gaeo-backup/")
        return [line.split() for line in out.splitlines() if line.strip()]

    def backup_dirs(self):
        if not os.path.isdir(self.backups):
            return []
        return sorted(os.path.join(self.backups, d) for d in os.listdir(self.backups))

    def cleanup(self):
        shutil.rmtree(self.tmp, ignore_errors=True)


class RunnerSurvivesHistoryRewrite(unittest.TestCase):
    def setUp(self):
        self.w = World()

    def tearDown(self):
        self.w.cleanup()

    def assert_untouched(self, head_before, out):
        self.assertEqual(self.w.head(), head_before, "HEAD 가 옮겨지면 안 된다")
        self.assertEqual(git(self.w.repo, "symbolic-ref", "--short", "HEAD"), "main")
        self.assertEqual(self.w.backup_refs(), [], "재기준하지 않았으니 백업 ref 도 없어야 한다")
        self.assertNotIn("재기준했다", out)

    def test_A_재작성_감지시_장부가_전부_같으면_백업_뒤_재기준하고_정상_종료(self):
        old_head = self.w.head()
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("원격 이력 재작성 감지", out)
        self.assertEqual(self.w.head(), self.w.remote_head(), "재기준 뒤 HEAD 가 origin/main 이어야 한다")
        self.assertEqual(git(self.w.repo, "symbolic-ref", "--short", "HEAD"), "main")
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1, f"옛 HEAD 백업 ref 가 정확히 하나여야 한다: {refs}")
        self.assertEqual(refs[0][1], old_head, "백업 ref 는 옛 HEAD 를 가리켜야 한다")
        self.assertEqual(git(self.w.repo, "status", "--porcelain"), "", "작업트리는 깨끗해야 한다")
        dirs = self.w.backup_dirs()
        self.assertEqual(len(dirs), 1, f"재기준 전 백업 폴더가 하나 있어야 한다: {dirs}")
        manifest = json.load(open(os.path.join(dirs[0], "manifest.json"), encoding="utf-8"))
        self.assertEqual(manifest["head"], old_head)
        self.assertTrue(os.path.isfile(os.path.join(dirs[0], "paper_trading", "state.json")))
        self.assertTrue(os.path.isfile(os.path.join(dirs[0], "repo.bundle")), "옛 HEAD 는 bundle 로도 남는다")
        v = subprocess.run(["python3", MODULE, "verify-backup", "--dir", dirs[0]], capture_output=True, text=True)
        self.assertEqual(v.returncode, 0, v.stdout + v.stderr)

    def test_B_안_올린_더_새로운_회차가_있으면_버리지_않고_exit6(self):
        local = self.w.local_paper_commit({"paper_trading/state.json": STATE_NEW,
                                           "paper_trading/equity_curve.jsonl": eq(T1, 900000.0) + eq(T2, 900500.0)})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 6, out)
        self.assertIn("자동으로 버리지 않는다", out)
        self.assertEqual(self.w.read_local("paper_trading/state.json"), STATE_NEW, "로컬 기록 파일이 그대로여야 한다")
        self.assert_untouched(local, out)
        self.assertEqual(self.w.backup_dirs(), [])
        self.assertNotIn("rebase", out.lower().split("원격 이력이 재작성됐고")[0][-200:],
                         "공통 조상이 없을 때 rebase 를 시도하면 안 된다")

    def test_B2_같은_회차인데_내용이_다르면_증명_불가라_재기준하지_않는다(self):
        # 2026-09-10 첫 판은 여기서 exit 0(재기준)이었다. 시각이 같다는 것은 내용이 같다는 증거가 아니므로
        # 안전 목적으로 기대값을 6 으로 정정한다(완화가 아니라 강화).
        local = self.w.local_paper_commit({"paper_trading/state.json": state(T1, ["t1"], result="CYCLE_OK — NO_ACTION")})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 6, out)
        self.assertIn("자동으로 버리지 않는다", out)
        self.assert_untouched(local, out)

    def test_C_평범한_fast_forward_는_그대로다(self):
        self.w.advance_origin_normally()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("fast-forward 완료", out)
        self.assertEqual(self.w.head(), self.w.remote_head())
        self.assertEqual(self.w.backup_refs(), [])
        self.assertEqual(self.w.backup_dirs(), [])
        self.assertNotIn("원격 이력 재작성 감지", out)

    def test_C2_이미_최신이면_아무_것도_하지_않는다(self):
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("이미 최신", out)
        self.assertEqual(self.w.backup_refs(), [])
        self.assertEqual(self.w.backup_dirs(), [])

    def test_E4_안_올린_커밋이_있어도_장부_내용이_전부_원격에_있으면_재기준한다(self):
        local = self.w.local_paper_commit({"paper_public.js": "window.GAEO_PAPER={regenerated:1}\n"})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertEqual(self.w.head(), self.w.remote_head())
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1); self.assertEqual(refs[0][1], local, "옛 커밋은 백업 ref 로 남는다")
        dirs = self.w.backup_dirs(); self.assertEqual(len(dirs), 1)
        heads = git(self.w.repo, "bundle", "list-heads", os.path.join(dirs[0], "repo.bundle"))
        self.assertIn(local, heads, "옛 커밋은 bundle 에도 들어 있어야 한다")

    def test_E10_옛_HEAD에_포함성_모듈이_없어도_origin_main_에서_꺼내_쓴다(self):
        self.w.cleanup()
        self.w = World(module_in_seed=False)
        self.assertFalse(os.path.exists(os.path.join(self.w.repo, "paper_ledger_inclusion.py")))
        self.w.add_module_to_origin()
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("원격 이력 재작성 감지", out)
        self.assertEqual(self.w.head(), self.w.remote_head())
        self.assertTrue(os.path.exists(os.path.join(self.w.repo, "paper_ledger_inclusion.py")), "재기준 뒤엔 모듈이 작업트리에 있다")


class RunnerNeverDropsUnsentRecords(unittest.TestCase):
    def setUp(self):
        self.w = World()

    def tearDown(self):
        self.w.cleanup()

    def assert_refused(self, code, out, head_before):
        self.assertEqual(code, 6, out)
        self.assertIn("자동으로 버리지 않는다", out)
        self.assertEqual(self.w.head(), head_before)
        self.assertEqual(self.w.backup_refs(), [])
        self.assertEqual(self.w.backup_dirs(), [], "재기준하지 않을 때는 백업 폴더도 만들지 않는다(사이클은 읽기만)")
        self.assertNotIn("재기준했다", out)

    def test_E1_같은_lastCycleAt_인데_로컬에만_거래_줄이_있으면_exit6(self):
        local = self.w.local_paper_commit({"paper_trading/trades.jsonl": trade("t1") + trade("t2"),
                                           "paper_trading/state.json": state(T1, ["t1", "t2"])})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assert_refused(code, out, local)
        self.assertIn("t2", out, "빠진 거래 ID 를 로그에 남긴다")
        self.assertEqual(self.w.read_local("paper_trading/trades.jsonl"), trade("t1") + trade("t2"))

    def test_E2_원격이_더_새롭지만_로컬에만_있는_거래가_있으면_exit6(self):
        local = self.w.local_paper_commit({"paper_trading/trades.jsonl": trade("t1") + trade("t2"),
                                           "paper_trading/state.json": state(T2, ["t1", "t2"]),
                                           "paper_trading/equity_curve.jsonl": eq(T1, 900000.0) + eq(T2, 700000.0)})
        self.w.advance_origin_paper({"paper_trading/trades.jsonl": trade("t1") + trade("t1", status="CLOSED"),
                                     "paper_trading/state.json": state(T3, []),
                                     "paper_trading/equity_curve.jsonl": eq(T1, 900000.0) + eq(T3, 910000.0)})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assert_refused(code, out, local)
        self.assertIn("t2", out)

    def test_E3_다른_계좌에_안_보낸_기록이_있으면_exit6(self):
        local = self.w.local_paper_commit({"paper_trading/smart_v2/observations.jsonl":
                                           json.dumps({"at": T1, "trade_id": "s1", "note": "obs"}) + "\n"})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assert_refused(code, out, local)
        self.assertIn("smart_v2", out)

    def test_E5_미커밋_기록은_먼저_복구_커밋으로_보존하고_그_뒤_증명_안_되면_exit6(self):
        before = self.w.head()
        self.w.local_write("paper_trading/trades.jsonl", trade("t1") + trade("t2"))
        self.w.local_write("paper_trading/state.json", state(T1, ["t1", "t2"]))
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 6, out)
        self.assertIn("복구 커밋", out)
        self.assertNotEqual(self.w.head(), before, "복구 커밋이 만들어져야 한다")
        self.assertEqual(git(self.w.repo, "status", "--porcelain"), "")
        self.assertEqual(self.w.read_local("paper_trading/trades.jsonl"), trade("t1") + trade("t2"))
        self.assertEqual(self.w.backup_refs(), [])
        self.assertNotIn("재기준했다", out)

    def test_E9_빈_state_json은_증명_불가라_exit6(self):
        local = self.w.local_paper_commit({"paper_trading/state.json": ""})
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assert_refused(code, out, local)
        self.assertIn("UNDETERMINED", out)


class RunnerRefusesWhenItCannotProve(unittest.TestCase):
    def test_E6_얕은_복제면_공통_조상_판정_불가라_재기준하지_않는다(self):
        w = World(shallow=True)
        try:
            self.assertEqual(git(w.repo, "rev-parse", "--is-shallow-repository"), "true")
            before = w.head()
            w.rewrite_origin()
            code, out = w.run_cycle()
            self.assertEqual(code, 6, out)
            self.assertIn("shallow", out)
            self.assertEqual(w.head(), before)
            self.assertEqual(w.backup_refs(), [])
            self.assertNotIn("재기준했다", out)
        finally:
            w.cleanup()

    def test_E7_백업이_실패하면_재기준하지_않는다(self):
        w = World()
        try:
            before = w.head()
            w.rewrite_origin()
            not_a_dir = os.path.join(w.tmp, "backups-is-a-file")
            open(not_a_dir, "w").close()
            code, out = w.run_cycle({"GAEO_PAPER_BACKUP_DIR": not_a_dir})
            self.assertEqual(code, 6, out)
            self.assertIn("백업 실패", out)
            self.assertEqual(w.head(), before)
            self.assertEqual(w.backup_refs(), [], "백업이 안 됐으면 백업 ref 도 만들지 않는다(순서: 백업 → ref → 재기준)")
            self.assertNotIn("재기준했다", out)
        finally:
            w.cleanup()

    def test_E8_다른_실행이_잠금을_쥐고_있으면_exit3_아무것도_안_한다(self):
        w = World()
        try:
            before = w.head()
            w.rewrite_origin()
            os.makedirs(w.lock)
            with open(os.path.join(w.lock, "pid"), "w") as fh:
                fh.write(str(os.getpid()))
            code, out = w.run_cycle()
            self.assertEqual(code, 3, out)
            self.assertIn("실행 중", out)
            self.assertEqual(w.head(), before)
            self.assertEqual(w.backup_refs(), [])
            self.assertTrue(os.path.isdir(w.lock), "남의 잠금을 지우면 안 된다")
            # pid 파일이 아직 없는 새 잠금(mkdir 직후의 창)은 빼앗지 않는다
            os.remove(os.path.join(w.lock, "pid"))
            os.utime(w.lock, None)
            code, out = w.run_cycle()
            self.assertEqual(code, 3, out)
            self.assertTrue(os.path.isdir(w.lock))
            # pid 파일이 없고 오래된(30초 이상) 잠금은 남은 것으로 보고 넘겨받는다
            import time
            old = time.time() - 120
            os.utime(w.lock, (old, old))
            code, out = w.run_cycle()
            self.assertEqual(code, 0, out)
            self.assertFalse(os.path.exists(w.lock), "사이클이 끝나면 잠금을 푼다")
            # 죽은 pid 의 잠금도 넘겨받는다
            w2 = World()
            try:
                w2.rewrite_origin()
                os.makedirs(w2.lock)
                with open(os.path.join(w2.lock, "pid"), "w") as fh:
                    fh.write("999999")
                code, out = w2.run_cycle()
                self.assertEqual(code, 0, out)
                self.assertFalse(os.path.exists(w2.lock))
            finally:
                w2.cleanup()
        finally:
            w.cleanup()

    def test_E11_판정_모듈_자체가_깨져_있으면_NOT_COVERED_가_아니라_UNDETERMINED_로_멈춘다(self):
        w = World(module_body="def broken(:\n")     # SyntaxError → 파이썬 exit 1, 판정 헤더 없음
        try:
            before = w.head()
            w.rewrite_origin()
            code, out = w.run_cycle()
            self.assertEqual(code, 6, out)
            self.assertIn("UNDETERMINED", out)
            self.assertNotIn("판정: NOT_COVERED", out, "모듈 오류를 '원격에 없는 기록이 있다'로 오표기하면 안 된다")
            self.assertEqual(w.head(), before)
            self.assertEqual(w.backup_refs(), [])
        finally:
            w.cleanup()


class WindowsRunnerHasTheSamePath(unittest.TestCase):
    """CI 에는 PowerShell 이 없어 실행은 못 한다. 같은 경로·같은 문구가 있는지 정적으로 대조한다."""

    def test_D_ps1_과_sh_가_같은_안전_경로를_가진다(self):
        ps1 = open(PS1, encoding="utf-8-sig").read()
        sh = open(SH, encoding="utf-8").read()
        for needle in ("refs/gaeo-backup/head-", "원격 이력 재작성 감지(공통 조상 없음)",
                       "자동으로 버리지 않는다", "docs/PAPER_TRADING_LOCAL_RUNNER.md 9절",
                       "paper_ledger_inclusion.py", "--is-shallow-repository", "shallow", "백업 실패",
                       "paper_recover"):
            self.assertTrue(needle in ps1, f"ps1 에 '{needle}' 이 없다")
            self.assertTrue(needle in sh, f"sh 에 '{needle}' 이 없다")
        for needle in ("function Test-LocalLedgerCoveredByRemote", 'Invoke-Git checkout -B $Branch "origin/$Branch"',
                       "'check'", "'backup'"):
            self.assertTrue(needle in ps1, f"ps1 에 '{needle}' 이 없다")
        for needle in ("local_ledger_covered_by_remote()", 'git_run checkout -B "$BRANCH" "origin/$BRANCH"',
                       "check --repo", "backup --repo"):
            self.assertTrue(needle in sh, f"sh 에 '{needle}' 이 없다")
        # 시각(lastCycleAt) 비교 fallback 은 어느 쪽에도 남아 있으면 안 된다.
        self.assertFalse('"lastCycleAt":' in sh, "sh 에 lastCycleAt 시각 비교가 남아 있다")
        self.assertFalse('"lastCycleAt":' in ps1, "ps1 에 lastCycleAt 시각 비교가 남아 있다")
        # 파이썬 탐지는 동기화(fetch) 전에 끝난다 — 포함성 판정에 파이썬이 필요하다.
        self.assertLess(sh.index("find_python"), sh.index('git_run fetch origin "$BRANCH"'))
        self.assertLess(ps1.index("Resolve-Python"), ps1.index("Invoke-Git fetch origin $Branch"))
        # 겹쳐 돌지 않는다: sh 는 mkdir 잠금, ps1 은 이름 있는 뮤텍스.
        self.assertIn("cycle.lock", sh); self.assertIn("GAEO-Paper-Cycle", ps1)
        # 판정 헤더가 없는 출력(모듈 자체 오류)은 NOT_COVERED 로 표기하지 않는다(둘 다).
        self.assertIn('*"[장부 포함성]"*', sh); self.assertIn("'*[장부 포함성]*'", ps1)
        # 모듈을 origin/main 에서 꺼낼 때 stderr 가 파일 내용에 섞이지 않는다.
        self.assertIn('git show "origin/$BRANCH:paper_ledger_inclusion.py" > "$INCLUSION_MODULE_TMP" 2>/dev/null', sh)
        self.assertIn('Invoke-GitStdout show "origin/${Branch}:paper_ledger_inclusion.py"', ps1)
        # UTF-8 환경은 잠금·판정보다 먼저(ps1).
        self.assertLess(ps1.index("$env:PYTHONUTF8 = '1'"), ps1.index("Lock-Cycle\n"))
        # 재기준은 "공통 조상 없음" 분기 안에서만 한다 — 갈라짐(rebase) 분기에는 없어야 한다.
        rebase_branch_sh = sh.split("# 갈라짐 : Paper 커밋을 최신 main 위로 재적용")[1].split("git_run rev-parse HEAD")[0]
        self.assertFalse("checkout -B" in rebase_branch_sh, "갈라짐 분기에 checkout -B 가 있다")
        # 명령으로서의 reset --hard 는 어느 쪽에도 없어야 한다(주석의 "금지" 문구는 예외).
        for cmd in ("git_run reset --hard", "git reset --hard"):
            self.assertFalse(cmd in sh, f"sh 에 '{cmd}' 가 있다")
        for cmd in ("Invoke-Git reset --hard", "git reset --hard"):
            self.assertFalse(cmd in ps1, f"ps1 에 '{cmd}' 가 있다")
        # 순서: 포함 판정 → 백업 → 백업 ref → 재기준 (둘 다)
        self.assertLess(sh.index("backup --repo"), sh.index('git_run update-ref "$backup_ref" HEAD'))
        self.assertLess(sh.index('git_run update-ref "$backup_ref" HEAD'), sh.index('git_run checkout -B "$BRANCH" "origin/$BRANCH"'))
        self.assertLess(ps1.index("'backup'"), ps1.index("Invoke-Git update-ref $backupRef HEAD"))
        self.assertLess(ps1.index("Invoke-Git update-ref $backupRef HEAD"), ps1.index('Invoke-Git checkout -B $Branch "origin/$Branch"'))

    def test_D2_ps1_괄호_균형(self):
        """PowerShell 파서가 없어 최소한의 구조 검사만 한다(중괄호·소괄호 개수, BOM)."""
        raw = open(PS1, "rb").read()
        self.assertTrue(raw.startswith(b"\xef\xbb\xbf"), "ps1 은 UTF-8 BOM 으로 시작해야 한다(PS 5.1 한글)")
        text = raw.decode("utf-8-sig")
        import re
        stripped = re.sub(r"<#.*?#>", "", text, flags=re.S)
        stripped = re.sub(r"'[^'\n]*'", "''", stripped)
        stripped = re.sub(r"#[^\n]*", "", stripped)
        self.assertEqual(stripped.count("{"), stripped.count("}"), "중괄호 개수가 안 맞는다")
        self.assertEqual(stripped.count("("), stripped.count(")"), "소괄호 개수가 안 맞는다")


if __name__ == "__main__":
    warnings.simplefilter("ignore", ResourceWarning)
    unittest.main(verbosity=2)
