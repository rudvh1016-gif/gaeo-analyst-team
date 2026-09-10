#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""러너 동기화 계약 (2026-09-10) — 원격 이력이 재작성돼도 러너가 스스로 살아나되,
아직 올리지 못한 Paper 기록은 절대 버리지 않는다.

## 무슨 일이 있었나

2026-09-02 08:25 KST `compact-history` 워크플로가 main 이력을 재작성(filter-branch)하고
force push 했다. 집 PC 러너 전용 clone 의 HEAD 는 09-01 15:05 회차 커밋(재작성 **전** SHA)이라
그 뒤 origin/main 과 **공통 조상이 없어졌다.** 러너 동기화 코드는 그 상태를 "갈라짐"으로 보고
rebase 를 시도했고, 저장소 첫 커밋부터 다시 적용하려다 충돌 → abort → exit 6(수동 확인 필요)로
매 사이클 끝났다. 엔진은 한 번도 돌지 않았고 거래일 8일이 조용히 비었다(Issue #481).

## 이 파일이 잠그는 것

scripts/paper_cycle.sh 를 **실제로 실행**해서(임시 bare 저장소 + 러너 clone) 확인한다.
  A. 원격 이력 재작성 + 로컬에 안 올린 기록 없음 → origin/main 으로 재기준하고 정상 종료(exit 0),
     옛 HEAD 는 refs/gaeo-backup/ 에 보존된다.
  B. 원격 이력 재작성 + 로컬에 아직 안 올린 더 새로운 회차 기록 → 자동으로 버리지 않고 exit 6,
     로컬 커밋과 파일이 그대로 남는다(fail closed).
  C. 평범한 fast-forward 는 예전과 똑같이 동작한다(백업 ref 없음).
  D. Windows 용 paper_cycle.ps1 도 같은 경로·같은 문구를 갖는다(정적 대조 — CI 에는 PowerShell 이 없다).

⚠️ 이 테스트는 저장소의 진짜 paper_trading/ 을 건드리지 않는다. 전부 임시 폴더 안에서 끝난다.
"""
import os
import shutil
import warnings
import subprocess
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
SH = os.path.join(HERE, "scripts", "paper_cycle.sh")
PS1 = os.path.join(HERE, "scripts", "paper_cycle.ps1")

STATE_OLD = '{\n "schemaVersion": "gaeo_paper_state_v1",\n "lastCycleAt": "2026-09-01T15:05:09+09:00",\n "lastCycleResult": "CYCLE_OK"\n}\n'
STATE_NEW = '{\n "schemaVersion": "gaeo_paper_state_v1",\n "lastCycleAt": "2026-09-02T09:05:11+09:00",\n "lastCycleResult": "CYCLE_OK"\n}\n'
STUB = "print('stub: no changes')\n"


def git(cwd, *args):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise AssertionError(f"git {' '.join(args)} 실패 in {cwd}: {r.stdout}{r.stderr}")
    return r.stdout.strip()


def git_config_user(cwd):
    git(cwd, "config", "user.name", "test")
    git(cwd, "config", "user.email", "test@example.com")


class World:
    """bare origin + seed(작업 복제본) + runner(러너 전용 clone, 부모 폴더에 마커)."""

    def __init__(self):
        self.tmp = tempfile.mkdtemp(prefix="paper_sync_")
        self.origin = os.path.join(self.tmp, "origin.git")
        git(self.tmp, "init", "-q", "--bare", self.origin)
        git(self.origin, "symbolic-ref", "HEAD", "refs/heads/main")
        self.seed = os.path.join(self.tmp, "seed")
        os.makedirs(self.seed)
        git(self.seed, "init", "-q")
        git(self.seed, "checkout", "-q", "-b", "main")
        git_config_user(self.seed)
        os.makedirs(os.path.join(self.seed, "paper_trading"))
        for name, body in (("paper_engine.py", STUB), ("paper_report.py", STUB), ("paper_public.py", STUB),
                           ("paper_public.js", "window.GAEO_PAPER={}\n"), ("data.js", "const D=1;\n"),
                           ("paper_trading/state.json", STATE_OLD)):
            with open(os.path.join(self.seed, name), "w", encoding="utf-8") as fh:
                fh.write(body)
        git(self.seed, "add", "-A")
        git(self.seed, "commit", "-q", "-m", "initial")
        git(self.seed, "remote", "add", "origin", self.origin)
        git(self.seed, "push", "-q", "origin", "main")
        root = os.path.join(self.tmp, "runner")
        os.makedirs(root)
        open(os.path.join(root, ".gaeo-paper-runner"), "w").close()
        self.repo = os.path.join(root, "repo")
        git(self.tmp, "clone", "-q", self.origin, self.repo)
        git_config_user(self.repo)
        self.logs = os.path.join(self.tmp, "logs")

    def advance_origin_normally(self):
        with open(os.path.join(self.seed, "data.js"), "a", encoding="utf-8") as fh:
            fh.write("const E=2;\n")
        git(self.seed, "commit", "-q", "-am", "normal update")
        git(self.seed, "push", "-q", "origin", "main")

    def rewrite_origin(self):
        """compact-history 와 같은 효과: 같은 트리, 새 뿌리, 새 SHA, force push."""
        git(self.seed, "checkout", "-q", "--orphan", "rewritten")
        git(self.seed, "commit", "-q", "-m", "squashed history (graft)")
        with open(os.path.join(self.seed, "data.js"), "a", encoding="utf-8") as fh:
            fh.write("const F=3;\n")
        git(self.seed, "commit", "-q", "-am", "after rewrite")
        git(self.seed, "push", "-q", "--force", "origin", "rewritten:main")

    def local_paper_commit(self, state_body):
        with open(os.path.join(self.repo, "paper_trading", "state.json"), "w", encoding="utf-8") as fh:
            fh.write(state_body)
        git(self.repo, "commit", "-q", "-am", "paper: local cycle (not pushed)")
        return git(self.repo, "rev-parse", "HEAD")

    def run_cycle(self):
        env = dict(os.environ, HOME=self.tmp, GAEO_PAPER_LOG_DIR=self.logs)
        r = subprocess.run(["bash", SH, "--repo", self.repo, "--ignore-window", "--log-dir", self.logs],
                           capture_output=True, text=True, env=env, timeout=120)
        return r.returncode, r.stdout + r.stderr

    def backup_refs(self):
        out = git(self.repo, "for-each-ref", "--format=%(refname) %(objectname)", "refs/gaeo-backup/")
        return [line.split() for line in out.splitlines() if line.strip()]

    def cleanup(self):
        shutil.rmtree(self.tmp, ignore_errors=True)


class RunnerSurvivesHistoryRewrite(unittest.TestCase):
    def setUp(self):
        self.w = World()

    def tearDown(self):
        self.w.cleanup()

    def test_A_재작성_감지시_안_올린_기록이_없으면_재기준하고_정상_종료(self):
        old_head = git(self.w.repo, "rev-parse", "HEAD")
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("원격 이력 재작성 감지", out)
        head = git(self.w.repo, "rev-parse", "HEAD")
        remote = git(self.w.repo, "rev-parse", "origin/main")
        self.assertEqual(head, remote, "재기준 뒤 HEAD 가 origin/main 이어야 한다")
        self.assertEqual(git(self.w.repo, "symbolic-ref", "--short", "HEAD"), "main")
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1, f"옛 HEAD 백업 ref 가 정확히 하나여야 한다: {refs}")
        self.assertEqual(refs[0][1], old_head, "백업 ref 는 옛 HEAD 를 가리켜야 한다")
        self.assertEqual(git(self.w.repo, "status", "--porcelain"), "", "작업트리는 깨끗해야 한다")

    def test_B_안_올린_더_새로운_회차가_있으면_버리지_않고_exit6(self):
        local = self.w.local_paper_commit(STATE_NEW)
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 6, out)
        self.assertIn("자동으로 버리지 않는다", out)
        self.assertEqual(git(self.w.repo, "rev-parse", "HEAD"), local, "로컬 커밋이 그대로 HEAD 여야 한다")
        with open(os.path.join(self.w.repo, "paper_trading", "state.json"), encoding="utf-8") as fh:
            self.assertEqual(fh.read(), STATE_NEW, "로컬 기록 파일이 그대로여야 한다")
        self.assertEqual(self.w.backup_refs(), [], "재기준하지 않았으니 백업 ref 도 없어야 한다")
        self.assertNotIn("rebase", out.lower().split("원격 이력이 재작성됐고")[0][-200:],
                         "공통 조상이 없을 때 rebase 를 시도하면 안 된다")

    def test_B2_안_올린_커밋이_있어도_같은_회차면_원격이_다_가진_것으로_보고_재기준한다(self):
        # lastCycleAt 이 같으면 "그 회차 기록은 원격에 있다"고 본다. 옛 HEAD 는 백업 ref 에 남는다.
        local = self.w.local_paper_commit(STATE_OLD.replace('"CYCLE_OK"', '"CYCLE_OK — NO_ACTION"'))
        self.w.rewrite_origin()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1)
        self.assertEqual(refs[0][1], local, "버려진 것처럼 보이는 로컬 커밋도 백업 ref 로 남는다")

    def test_C_평범한_fast_forward_는_그대로다(self):
        self.w.advance_origin_normally()
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("fast-forward 완료", out)
        self.assertEqual(git(self.w.repo, "rev-parse", "HEAD"), git(self.w.repo, "rev-parse", "origin/main"))
        self.assertEqual(self.w.backup_refs(), [])
        self.assertNotIn("원격 이력 재작성 감지", out)

    def test_C2_이미_최신이면_아무_것도_하지_않는다(self):
        code, out = self.w.run_cycle()
        self.assertEqual(code, 0, out)
        self.assertIn("이미 최신", out)
        self.assertEqual(self.w.backup_refs(), [])


class WindowsRunnerHasTheSamePath(unittest.TestCase):
    """CI 에는 PowerShell 이 없어 실행은 못 한다. 같은 경로·같은 문구가 있는지 정적으로 대조한다."""

    def test_D_ps1_과_sh_가_같은_안전_경로를_가진다(self):
        ps1 = open(PS1, encoding="utf-8-sig").read()
        sh = open(SH, encoding="utf-8").read()
        for needle in ("refs/gaeo-backup/head-", "원격 이력 재작성 감지(공통 조상 없음)",
                       "자동으로 버리지 않는다", "docs/PAPER_TRADING_LOCAL_RUNNER.md 9절",
                       "lastCycleAt"):
            self.assertIn(needle, ps1, f"ps1 에 '{needle}' 이 없다")
            self.assertIn(needle, sh, f"sh 에 '{needle}' 이 없다")
        self.assertIn("function Test-LocalLedgerCoveredByRemote", ps1)
        self.assertIn('Invoke-Git checkout -B $Branch "origin/$Branch"', ps1)
        self.assertIn("local_ledger_covered_by_remote()", sh)
        self.assertIn('git_run checkout -B "$BRANCH" "origin/$BRANCH"', sh)
        # 재기준은 "공통 조상 없음" 분기 안에서만 한다 — 갈라짐(rebase) 분기에는 없어야 한다.
        rebase_branch_sh = sh.split("# 갈라짐 : Paper 커밋을 최신 main 위로 재적용")[1].split("git_run rev-parse HEAD")[0]
        self.assertNotIn("checkout -B", rebase_branch_sh)
        # 명령으로서의 reset --hard 는 어느 쪽에도 없어야 한다(주석의 "금지" 문구는 예외).
        for cmd in ("git_run reset --hard", "git reset --hard"):
            self.assertNotIn(cmd, sh)
        for cmd in ("Invoke-Git reset --hard", "git reset --hard"):
            self.assertNotIn(cmd, ps1)


if __name__ == "__main__":
    warnings.simplefilter("ignore", ResourceWarning)
    unittest.main(verbosity=2)
