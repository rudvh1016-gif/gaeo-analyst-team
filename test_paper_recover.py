#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""집 PC 러너 복구 도구 계약 (2026-09-10 구간 A/B) — scripts/paper_recover.sh 를 임시 저장소에서 **실제로 실행**해 잠근다.

  R1  건강한 저장소(로컬 = 원격) → check exit 0, 아무것도 안 바꿈.
  R2  재작성 + 장부 전부 포함 → check exit 10(계획만), HEAD·ref·백업 폴더 전부 그대로.
  R3  재작성 + 장부 전부 포함 → apply exit 0: 백업(복사·bundle·manifest) → 옛 HEAD ref → 재기준 → 검증 → 계좌별 요약.
  R4  재작성 + 로컬에만 있는 거래 → apply exit 11: 재기준 안 함, 미전송 기록을 별도 폴더에 보존(inclusion.json 포함).
  R5  origin 주소가 예상 저장소가 아니면 exit 2 (다른 저장소에서 절대 돌지 않는다).
  R6  Paper 산출물이 아닌 변경 → exit 11, 커밋 안 함.
  R7  잠금을 다른 실행이 쥐고 있으면 exit 3.
  R8  러너 마커 없음 → exit 2.
  R9  얕은 복제 → exit 11 + unshallow 안내.
  R10 미커밋 Paper 산출물: check 는 손대지 않고(exit 10, 여전히 dirty), apply 는 복구 커밋으로 보존한 뒤 재기준.
  R11 뒤처짐(fast-forward)·안 올린 커밋(공통 조상 있음)은 복구 도구가 할 일 없음(exit 0).
  R12 paper_recover.ps1 은 같은 단계·문구·순서를 가진다(정적 대조 — CI 에는 PowerShell 이 없다).

⚠️ 진짜 paper_trading/ 은 읽지도 쓰지도 않는다. 전부 임시 폴더 안에서 끝난다.
"""
import json
import os
import re
import subprocess
import unittest
import warnings

from test_paper_runner_sync import World, git, state, trade, eq, T1, T2, HERE

RECOVER_SH = os.path.join(HERE, "scripts", "paper_recover.sh")
RECOVER_PS1 = os.path.join(HERE, "scripts", "paper_recover.ps1")
MODULE = os.path.join(HERE, "paper_ledger_inclusion.py")


def run_recover(w, mode="check", extra=(), env_extra=None, expect_remote=None):
    env = dict(os.environ, HOME=w.tmp, GAEO_PAPER_LOG_DIR=w.logs, GAEO_PAPER_BACKUP_DIR=w.backups,
               GAEO_PAPER_LOCK_DIR=w.lock)
    env.update(env_extra or {})
    expect = w.origin[:-4] if expect_remote is None else expect_remote     # origin.git → 경로 앞부분
    r = subprocess.run(["bash", RECOVER_SH, "--repo", w.repo, "--mode", mode, "--expect-remote", expect,
                        "--log-dir", w.logs, *extra], capture_output=True, text=True, env=env, timeout=180)
    return r.returncode, r.stdout + r.stderr


class RecoverTool(unittest.TestCase):
    def setUp(self):
        self.w = World()

    def tearDown(self):
        self.w.cleanup()

    def assert_untouched(self, head_before):
        self.assertEqual(self.w.head(), head_before, "HEAD 가 옮겨지면 안 된다")
        self.assertEqual(self.w.backup_refs(), [])
        self.assertFalse(os.path.exists(self.w.lock), "끝나면 잠금을 푼다")

    def test_R1_건강하면_할_일_없음(self):
        head = self.w.head()
        code, out = run_recover(self.w)
        self.assertEqual(code, 0, out)
        self.assertIn("복구할 것이 없다", out)
        self.assert_untouched(head)
        self.assertEqual(self.w.backup_dirs(), [])

    def test_R2_검사_모드는_계획만_보여주고_아무것도_안_바꾼다(self):
        head = self.w.head()
        self.w.rewrite_origin()
        code, out = run_recover(self.w)
        self.assertEqual(code, 10, out)
        self.assertIn("COVERED", out); self.assertIn("apply", out); self.assertIn("계획", out)
        self.assert_untouched(head)
        self.assertEqual(self.w.backup_dirs(), [], "검사 모드는 백업 폴더도 만들지 않는다")
        self.assertNotEqual(self.w.head(), self.w.remote_head())

    def test_R3_실행_모드는_백업_보존_재기준_검증_요약_순서로_복구한다(self):
        head = self.w.head()
        self.w.rewrite_origin()
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 0, out)
        self.assertEqual(self.w.head(), self.w.remote_head())
        self.assertEqual(git(self.w.repo, "symbolic-ref", "--short", "HEAD"), "main")
        self.assertEqual(git(self.w.repo, "status", "--porcelain"), "")
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1); self.assertEqual(refs[0][1], head)
        dirs = self.w.backup_dirs()
        self.assertEqual(len(dirs), 1); self.assertIn("prerepoint-", os.path.basename(dirs[0]))
        m = json.load(open(os.path.join(dirs[0], "manifest.json"), encoding="utf-8"))
        self.assertEqual(m["head"], head)
        self.assertTrue(os.path.isfile(os.path.join(dirs[0], "repo.bundle")))
        v = subprocess.run(["python3", MODULE, "verify-backup", "--dir", dirs[0]], capture_output=True, text=True)
        self.assertEqual(v.returncode, 0, v.stdout)
        self.assertIn("root(V1)", out); self.assertIn("smart_v2", out)      # 계좌별 요약
        self.assertIn("재기준 완료", out); self.assertIn("복구 완료", out)
        self.assertFalse(os.path.exists(self.w.lock))
        # 순서: 백업 → ref → 재기준
        self.assertLess(out.index("백업 완료"), out.index("재기준 완료"))

    def test_R4_증명_못_하면_재기준하지_않고_미전송_기록을_별도_보존한다(self):
        local = self.w.local_paper_commit({"paper_trading/trades.jsonl": trade("t1") + trade("t2"),
                                           "paper_trading/state.json": state(T1, ["t1", "t2"])})
        self.w.rewrite_origin()
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 11, out)
        self.assertIn("NOT_COVERED", out); self.assertIn("t2", out)
        self.assertEqual(self.w.head(), local)
        self.assertEqual(self.w.backup_refs(), [])
        dirs = self.w.backup_dirs()
        self.assertEqual(len(dirs), 1); self.assertIn("unsent-", os.path.basename(dirs[0]))
        with open(os.path.join(dirs[0], "paper_trading", "trades.jsonl"), encoding="utf-8") as fh:
            self.assertIn('"t2"', fh.read())
        incl = json.load(open(os.path.join(dirs[0], "inclusion.json"), encoding="utf-8"))
        self.assertEqual(incl["verdict"], "NOT_COVERED")
        self.assertEqual(self.w.read_local("paper_trading/trades.jsonl"), trade("t1") + trade("t2"), "활성 장부는 그대로")
        # 검사 모드도 같은 판정(11)이고 아무것도 쓰지 않는다
        code, out = run_recover(self.w, "check")
        self.assertEqual(code, 11, out)
        self.assertEqual(len(self.w.backup_dirs()), 1)

    def test_R5_다른_저장소면_아무것도_하지_않는다(self):
        head = self.w.head()
        self.w.rewrite_origin()
        code, out = run_recover(self.w, "apply", expect_remote="rudvh1016-gif/gaeo-analyst-team")
        self.assertEqual(code, 2, out)
        self.assertIn("예상 저장소", out)
        self.assert_untouched(head)
        self.assertEqual(self.w.backup_dirs(), [])

    def test_R6_외부_변경이_있으면_멈춘다(self):
        head = self.w.head()
        self.w.rewrite_origin()
        self.w.local_write("data.js", "const HACK=1;\n")
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 11, out)
        self.assertIn("data.js", out)
        self.assert_untouched(head)
        self.assertIn("data.js", git(self.w.repo, "status", "--porcelain"), "외부 변경을 치우거나 커밋하지 않는다")

    def test_R7_잠금이_있으면_exit3(self):
        head = self.w.head()
        self.w.rewrite_origin()
        os.makedirs(self.w.lock)
        with open(os.path.join(self.w.lock, "pid"), "w") as fh:
            fh.write(str(os.getpid()))
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 3, out)
        self.assertIn("실행 중", out)
        self.assertEqual(self.w.head(), head)
        self.assertTrue(os.path.isdir(self.w.lock), "남의 잠금을 지우지 않는다")

    def test_R8_마커_없으면_exit2(self):
        os.remove(os.path.join(self.w.tmp, "runner", ".gaeo-paper-runner"))
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 2, out)
        self.assertIn("마커", out)

    def test_R10_미커밋_Paper_산출물은_check_에서_손대지_않고_apply_에서_복구_커밋으로_보존한다(self):
        head = self.w.head()
        self.w.rewrite_origin()
        self.w.local_write("paper_trading/README.md", "changed doc\n")      # 장부 아님(포함 판정에서 무시)
        code, out = run_recover(self.w, "check")
        self.assertEqual(code, 10, out)
        self.assertIn("손대지 않음", out)
        self.assertEqual(self.w.head(), head)
        self.assertIn("README.md", git(self.w.repo, "status", "--porcelain"))
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 0, out)
        self.assertIn("복구 커밋 생성", out)
        refs = self.w.backup_refs()
        self.assertEqual(len(refs), 1)
        self.assertNotEqual(refs[0][1], head, "백업 ref 는 복구 커밋(미커밋 산출물 포함)을 가리킨다")
        self.assertEqual(git(self.w.repo, "show", f"{refs[0][1]}:paper_trading/README.md"), "changed doc")
        self.assertEqual(self.w.head(), self.w.remote_head())

    def test_R11_뒤처짐_안_올린_커밋은_할_일_없음(self):
        self.w.advance_origin_normally()
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 0, out); self.assertIn("fast-forward", out)
        self.assertNotEqual(self.w.head(), self.w.remote_head(), "복구 도구는 fast-forward 도 대신 하지 않는다(사이클 몫)")
        git(self.w.repo, "merge", "-q", "--ff-only", "origin/main")
        self.w.local_paper_commit({"paper_trading/README.md": "x\n"})
        code, out = run_recover(self.w, "apply")
        self.assertEqual(code, 0, out); self.assertIn("push", out)
        self.assertEqual(self.w.backup_refs(), [])


class RecoverToolShallow(unittest.TestCase):
    def test_R9_얕은_복제는_exit11_unshallow_안내(self):
        w = World(shallow=True)
        try:
            head = w.head()
            w.rewrite_origin()
            code, out = run_recover(w, "apply")
            self.assertEqual(code, 11, out)
            self.assertIn("unshallow", out)
            self.assertEqual(w.head(), head)
            self.assertEqual(w.backup_refs(), [])
        finally:
            w.cleanup()


class WindowsRecoverHasTheSamePath(unittest.TestCase):
    def test_R12_ps1_과_sh_가_같은_단계_문구_순서를_가진다(self):
        ps1 = open(RECOVER_PS1, encoding="utf-8-sig").read()
        sh = open(RECOVER_SH, encoding="utf-8").read()
        for needle in ("[1/8]", "[2/8]", "[3/8]", "[4/8]", "[5/8]", "[6/8]", "[7/8]", "[8/8]",
                       "paper_ledger_inclusion.py", "--is-shallow-repository", "unshallow", "예상 저장소",
                       "NO_COMMON_ANCESTOR", "QUERY_FAILED", "refs/gaeo-backup/head-", "prerepoint-", "unsent-",
                       "inclusion.json", "verify-backup", "summary", "복구 커밋", "재기준하지 않는다", "복구 완료",
                       "docs/PAPER_TRADING_LOCAL_RUNNER.md 9절", "과거 날짜 거래를 만들어 넣지 않는다"):
            self.assertTrue(needle in ps1, f"ps1 에 '{needle}' 이 없다")
            self.assertTrue(needle in sh, f"sh 에 '{needle}' 이 없다")
        # 금지 명령은 어느 쪽에도 없다(주석의 '금지' 나열은 명령 형태가 아니다)
        for cmd in ("git_run reset --hard", "git reset --hard", "push --force", "push -f ", "git clean", "git stash",
                    "--allow-unrelated-histories", "git_run clean", "git_run stash"):
            self.assertFalse(cmd in sh, f"sh 에 금지 명령 '{cmd}' 가 있다")
        for cmd in ("Invoke-Git reset --hard", "git reset --hard", "push --force", "push -f ", "Invoke-Git clean",
                    "Invoke-Git stash", "--allow-unrelated-histories"):
            self.assertFalse(cmd in ps1, f"ps1 에 금지 명령 '{cmd}' 가 있다")
        # 순서(둘 다): 원격 주소 확인 → 잠금 → 얕은 복제 → fetch → 포함 판정(check) → 백업(backup) → ref → checkout -B → 요약
        def order(text, *keys):
            idx = [text.index(k) for k in keys]
            self.assertEqual(idx, sorted(idx), f"순서가 다르다: {keys}")
        order(sh, "[1/8] 저장소 확인 OK", "[2/8] 잠금 확보", "[4/8] 얕은 복제", "[4/8] fetch OK", "[6/8] 원격 이력 재작성",
              "[7/8] 백업 완료·검증 통과", 'git_run update-ref "$backup_ref" HEAD', 'git_run checkout -B "$BRANCH" "origin/$BRANCH"',
              "[8/8] 재기준 뒤 장부")
        order(ps1, "[1/8] 저장소 확인 OK", "[2/8] 잠금 확보", "[4/8] 얕은 복제", "[4/8] fetch OK", "[6/8] 원격 이력 재작성",
              "[7/8] 백업 완료·검증 통과", "Invoke-Git update-ref $backupRef HEAD", 'Invoke-Git checkout -B $Branch "origin/$Branch"',
              "[8/8] 재기준 뒤 장부")
        # 판정 헤더 검사 · stdout 전용 show(둘 다)
        self.assertIn('*"[장부 포함성]"*', sh); self.assertIn("'*[장부 포함성]*'", ps1)
        self.assertIn('Invoke-GitStdout show "origin/${Branch}:paper_ledger_inclusion.py"', ps1)
        # 기본은 검사 모드, 사이클과 같은 뮤텍스, 러너 기본 경로
        self.assertIn("[ValidateSet('check', 'apply')][string]$Mode = 'check'", ps1)
        self.assertIn("Global\\GAEO-Paper-Cycle", ps1)
        self.assertIn("GAEO\\paper-runner\\repo", ps1)
        self.assertIn('MODE="check"', sh)
        # ps1 최소 구조 검사(BOM·괄호 균형)
        raw = open(RECOVER_PS1, "rb").read()
        self.assertTrue(raw.startswith(b"\xef\xbb\xbf"))
        stripped = re.sub(r"<#.*?#>", "", ps1, flags=re.S)
        stripped = re.sub(r"'[^'\n]*'", "''", stripped)
        stripped = re.sub(r"#[^\n]*", "", stripped)
        self.assertEqual(stripped.count("{"), stripped.count("}"))
        self.assertEqual(stripped.count("("), stripped.count(")"))


if __name__ == "__main__":
    warnings.simplefilter("ignore", ResourceWarning)
    unittest.main(verbosity=2)
