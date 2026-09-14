#!/usr/bin/env python3
"""verify_save_closure.py 계약 + PR #564류 사고의 '일반화된' 재현.

기존 test_decision_records.py::MergeEvidence의 재현 테스트는 rebound_watch.js라는
"그 파일 하나"가 저장 목록에서 빠졌을 때만 잡는다. 이 파일은 그 사고가 특정 파일명이
아니라 **아직 아무도 이름을 모르는 미래의 새 생성물**에서 다시 나도 잡히는지, 실제
update-analysis.yml의 진짜 bash 조각을 그대로 실행해서 확인한다(문자열 검사가 아니라
test_workflow_branch_exec.py와 같은 방식의 실제 실행).

계약:
    - 정상: 목록에 있는 파일만 바뀌면 커밋이 생긴다(600종목 갱신 등 정상 사이클 보존).
    - 사고 재현: 목록에도, 디렉터리 add에도 안 걸리는 새 파일이 하나 생기면 이번 사이클
      커밋을 스스로 보류한다(빈 커밋도, 그 새 파일을 몰래 끼워 committed하지도 않는다).
    - 어느 쪽이든 스니펫 자체는 exit 0으로 끝난다 — 여기서 죽으면 chain() 재기동 줄까지
      못 가서 체인이 끊긴다(2026-07-22 575분 무갱신 사고와 같은 기전).
"""
import os
import re
import subprocess
import tempfile
import unittest

import verify_save_closure as vsc

HERE = os.path.dirname(os.path.abspath(__file__))
WORKFLOW = os.path.join(HERE, ".github", "workflows", "update-analysis.yml")


def staging_and_commit_source():
    """update-analysis.yml에서 '저장 목록 add → 점검 → commit/push' 조각만 원문 그대로 뗀다."""
    with open(WORKFLOW, encoding="utf-8") as fh:
        body = fh.read()
    m = re.search(
        r"\n( +)(git checkout HEAD -- data\.js analysis\.js.*?\n\1fi)\n\1# 📡 IndexNow",
        body, re.S,
    )
    if not m:
        raise AssertionError("update-analysis.yml: 저장/커밋 조각을 찾지 못했다")
    indent = m.group(1)
    text = "".join(
        (line[len(indent):] if line.startswith(indent) else line) + "\n"
        for line in m.group(2).split("\n")
    )
    # ${{ github.ref_name }} is a GitHub Actions template token, substituted by
    # the runner before bash ever sees it. Extracted raw, bash reads it as
    # parameter-expansion syntax and dies with "bad substitution" - stand in a
    # literal branch name, same as the real value on this repo's main runs.
    return text.replace("${{ github.ref_name }}", "main")


class ClassifierUnit(unittest.TestCase):
    """verify_save_closure.dirty_after_staging()을 실제 git 저장소로 직접 시험한다."""

    def _repo(self):
        d = tempfile.TemporaryDirectory()
        self.addCleanup(d.cleanup)
        repo = d.name

        def git(*args):
            return subprocess.run(["git", *args], cwd=repo, check=True, capture_output=True)

        git("init", "-b", "main")
        git("config", "user.name", "Fixture")
        git("config", "user.email", "fixture@example.test")
        return repo, git

    def test_깨끗한_트리는_통과한다(self):
        repo, git = self._repo()
        with open(os.path.join(repo, "auto_analysis.js"), "w") as fh:
            fh.write("const X = 1;")
        git("add", ".")
        git("commit", "-m", "base")
        other_owner, unexpected = vsc.dirty_after_staging(cwd=repo)
        self.assertEqual((other_owner, unexpected), ([], []))

    def test_저장목록에_없는_새_파일은_unexpected다(self):
        repo, git = self._repo()
        git("commit", "--allow-empty", "-m", "base")
        with open(os.path.join(repo, "이름도_모르는_새_생성물.js"), "w") as fh:
            fh.write("const NEW = 1;")
        other_owner, unexpected = vsc.dirty_after_staging(cwd=repo)
        self.assertEqual(other_owner, [])
        self.assertIn("이름도_모르는_새_생성물.js", unexpected)

    def test_이미_staged된_파일은_통과한다(self):
        """add-loop가 이미 잡은 파일은 대상이 아니다 — 이중 경보를 내지 않는다."""
        repo, git = self._repo()
        git("commit", "--allow-empty", "-m", "base")
        with open(os.path.join(repo, "auto_analysis.js"), "w") as fh:
            fh.write("const X = 2;")
        git("add", "auto_analysis.js")
        other_owner, unexpected = vsc.dirty_after_staging(cwd=repo)
        self.assertEqual((other_owner, unexpected), ([], []))

    def test_dataJs가_복원안되면_other_owner로_구분한다(self):
        repo, git = self._repo()
        with open(os.path.join(repo, "data.js"), "w") as fh:
            fh.write("old")
        git("add", ".")
        git("commit", "-m", "base")
        with open(os.path.join(repo, "data.js"), "w") as fh:
            fh.write("still dirty")
        other_owner, unexpected = vsc.dirty_after_staging(cwd=repo)
        self.assertEqual(other_owner, ["data.js"])
        self.assertEqual(unexpected, [])


class WorkflowSnippetExecution(unittest.TestCase):
    """실제 update-analysis.yml 조각을 bash로 그대로 돌려 사고를 일반적으로 재현한다."""

    @classmethod
    def setUpClass(cls):
        cls.snippet = staging_and_commit_source()
        # 이 조각은 verify_save_closure.py를 python3로 부른다 — 저장소 루트를 PATH/cwd로.

    def _repo_with(self, extra_files):
        d = tempfile.TemporaryDirectory()
        self.addCleanup(d.cleanup)
        repo = d.name

        def git(*args):
            return subprocess.run(["git", *args], cwd=repo, check=True, capture_output=True, text=True)

        git("init", "-b", "main")
        git("config", "user.name", "Fixture")
        git("config", "user.email", "fixture@example.test")
        # 워크플로가 실제로 add하는 목록 중 대표 몇 개만 있어도 "정상 저장" 계약은 충분히 시험된다.
        base_files = {
            "data.js": "old prices", "analysis.js": "old analysis",
            "auto_analysis.js": "old auto", "model_scoreboard.js": "old scoreboard",
        }
        for name, text in base_files.items():
            with open(os.path.join(repo, name), "w") as fh:
                fh.write(text)
        # verify_save_closure.py 자신이 필요하다 — 진짜 저장소 것을 그대로 복사해서
        # base 커밋에 같이 넣는다(테스트 스캐폴딩 자체가 "저장 목록에 없는 파일"로
        # 오탐되지 않도록 — 실제 워크플로에서는 이 파일이 이미 커밋돼 있는 코드다).
        with open(os.path.join(HERE, "verify_save_closure.py"), encoding="utf-8") as fh:
            script = fh.read()
        with open(os.path.join(repo, "verify_save_closure.py"), "w", encoding="utf-8") as fh:
            fh.write(script)
        git("add", ".")
        git("commit", "-m", "base")
        # 사이클이 새로 만든 값들
        with open(os.path.join(repo, "auto_analysis.js"), "w") as fh:
            fh.write("new auto")
        with open(os.path.join(repo, "model_scoreboard.js"), "w") as fh:
            fh.write("new scoreboard")
        for name, text in extra_files.items():
            with open(os.path.join(repo, name), "w") as fh:
                fh.write(text)
        return repo, git

    def _run(self, repo):
        env = {**os.environ, "MAX_FAILED_PUSHES": "3", "failed_pushes": "0"}
        # 이 조각은 push/fetch/decision_records.py도 부른다 — origin이 없어도 첫 push 성공 흉내는
        # 불필요하다: push는 로컬 저장소라 실패하고, 재시도 fetch도 실패해 "포기하고 계속"으로
        # 빠진다(316~320행 그대로). 우리가 보는 건 그 앞의 add/commit 여부뿐이라 이걸로 충분하다.
        return subprocess.run(
            ["bash", "-c", self.snippet], cwd=repo, env=env,
            capture_output=True, text=True, timeout=60,
        )

    def test_정상_사이클은_커밋된다(self):
        repo, git = self._repo_with({})
        before = git("rev-parse", "HEAD").stdout.strip()
        result = self._run(repo)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        after = git("rev-parse", "HEAD").stdout.strip()
        self.assertNotEqual(before, after, "정상 산출물만 있는데 커밋이 안 됐다")
        self.assertNotIn("SAVE_CLOSURE_FAILURE", result.stdout + result.stderr)

    def test_이름_모르는_새_생성물_하나가_저장목록에서_빠지면_이번_사이클_커밋을_보류한다(self):
        """PR #564의 일반화 재현 — rebound_watch.js가 아니라 임의의 미래 파일이어도 잡힌다."""
        repo, git = self._repo_with({"미래에_추가될_생성물.js": "brand new output"})
        before = git("rev-parse", "HEAD").stdout.strip()
        result = self._run(repo)
        text = result.stdout + result.stderr
        self.assertEqual(result.returncode, 0, "체인이 끊기면 안 된다 — 스니펫은 항상 exit 0\n" + text)
        self.assertIn("SAVE_CLOSURE_FAILURE", text)
        after = git("rev-parse", "HEAD").stdout.strip()
        self.assertEqual(before, after, "저장 목록에서 빠진 파일이 있는데도 커밋해버렸다")
        status = git("-c", "core.quotePath=false", "status", "--porcelain").stdout
        self.assertIn("미래에_추가될_생성물.js", status)
        # 다른 무관한 코드 파일도 같은 이유로 커밋되지 않는다(버리지도, commit하지도 않는다).
        self.assertTrue(os.path.exists(os.path.join(repo, "미래에_추가될_생성물.js")))


if __name__ == "__main__":
    unittest.main(verbosity=2)
