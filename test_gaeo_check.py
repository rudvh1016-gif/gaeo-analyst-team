#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gaeo_check.py 계약 — 검사가 빠지거나 실패해도 조용히 PASS 가 되지 않는다.

- 모든 test_*.py 가 premerge 외의 어느 묶음에든 들어 있다(새 검사를 만들고 묶음에 안 넣으면 여기서 실패).
- 묶음에 적힌 파일은 실제로 존재한다(낡은 목록 방지).
- 없는 파일이 묶음에 있으면 run_group 이 False 를 돌려준다.
- 실패하는 검사가 하나라도 있으면 종료코드가 0 이 아니다(임시 폴더에 고의 실패 검사를 만들어 확인).
- 이 파일 자체는 표준 라이브러리만 쓴다.
"""
import os
import subprocess
import sys
import tempfile
import unittest

import gaeo_check as G

HERE = os.path.dirname(os.path.abspath(__file__))


class Coverage(unittest.TestCase):
    def test_모든_파이썬_검사가_어느_묶음에든_있다(self):
        grouped = set(G.UNGROUPED_BUT_KNOWN)
        for files in G.GROUPS.values():
            grouped |= set(files)
        missing = sorted(set(G.all_py_tests()) - grouped)
        self.assertEqual(missing, [], f"묶음에 없는 검사: {missing} — gaeo_check.GROUPS 에 넣어라")

    def test_묶음의_파일은_실제로_있다(self):
        for g, files in G.GROUPS.items():
            for f in files:
                self.assertTrue(os.path.exists(os.path.join(HERE, f)), f"{g}: {f} 없음")

    def test_quick_은_빠른_핵심만_담는다(self):
        self.assertLessEqual(len(G.GROUPS["quick"]), 14)
        for must in ("test_ci_parity.py", "test_workflow_size.py", "test_ops_status.py", "test_rules_map.py"):
            self.assertIn(must, G.GROUPS["quick"])

    def test_브라우저_판정은_ci_yml과_같다(self):
        # ci.yml: grep -q "playwright" → 브라우저 테스트. test_static_server.js 는 테스트 아님.
        self.assertIn("test_static_server.js", G.JS_NOT_A_TEST)
        for n in G.js_ci_tests():
            self.assertFalse(G.is_browser_test(n))


class FailurePropagation(unittest.TestCase):
    def test_없는_파일이_있으면_FAIL(self):
        self.assertFalse(G.run_group(["test_this_file_does_not_exist.py"]))

    def test_실패_검사는_종료코드로_드러난다(self):
        tmp = tempfile.mkdtemp(prefix="gc_")
        bad = os.path.join(tmp, "test_bad.py")
        with open(bad, "w", encoding="utf-8") as fh:
            fh.write("import sys; print('boom'); sys.exit(3)\n")
        good = os.path.join(tmp, "test_good.py")
        with open(good, "w", encoding="utf-8") as fh:
            fh.write("print('ok')\n")
        env = dict(os.environ, GAEO_CHECK_OUT=os.path.join(tmp, "out"))
        self.assertTrue(G.run_one("good", [sys.executable, good]))
        self.assertFalse(G.run_one("bad", [sys.executable, bad]))
        # 실제 CLI 로도: 알 수 없는 묶음은 2, list 는 0
        r = subprocess.run([sys.executable, os.path.join(HERE, "gaeo_check.py"), "nope"], capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 2)
        r = subprocess.run([sys.executable, os.path.join(HERE, "gaeo_check.py"), "list"], capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0)
        self.assertIn("premerge:", r.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
