#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""테스트가 CI 러너에서도 돌 수 있는지 잠근다 (2026-09-07 실측 사고 3번째).

## 무슨 일이 있었나

`test_workflow_size.py`에 워크플로 트리거를 읽는 계약 테스트를 새로 넣으면서
`import yaml`을 썼다. **내 작업 환경에서는 1,069건 전부 통과했다.** 그런데 CI에서만

    ModuleNotFoundError: No module named 'yaml'

로 죽었다. `.github/workflows/ci.yml`은 파이썬 의존성으로 `cryptography` 하나만 깐다
(이 저장소에는 `requirements.txt`가 없다). 즉 **내 컴퓨터에 깔려 있다는 것이
CI에 깔려 있다는 뜻이 아니다.** 사고를 막으려고 만든 테스트가, 정작 자기 자신이
CI에서 못 돌아 PR을 빨갛게 만들었다.

## 그래서 무엇을 잠그나

`test_*.py`가 import하는 모듈은 셋 중 하나여야 한다.

1. 파이썬 **표준 라이브러리** (`sys.stdlib_module_names`)
2. 이 **저장소 자신의 모듈** (루트의 `*.py` 또는 패키지 디렉터리)
3. `ci.yml`이 실제로 설치하는 패키지 — 지금은 `cryptography` 하나뿐

새 서드파티 패키지가 정말 필요하면 `ci.yml`의 설치 줄에 먼저 추가하고
아래 `CI_INSTALLS`도 같이 고쳐라. **한쪽만 고치면 이 테스트가 막는다.**

이 파일 자체는 표준 라이브러리(`ast`·`glob`·`os`·`sys`·`unittest`)만 쓴다.
"""

import ast
import glob
import os
import sys
import unittest


HERE = os.path.dirname(os.path.abspath(__file__))
CI_WORKFLOW = os.path.join(HERE, ".github", "workflows", "ci.yml")

# ci.yml이 실제로 pip install 하는 패키지. 여기를 늘리려면 ci.yml도 같이 늘려야 한다.
CI_INSTALLS = {"cryptography"}


def local_modules():
    """저장소 자신의 모듈 이름들 — 루트의 *.py 파일과 패키지 디렉터리."""
    names = {
        os.path.splitext(os.path.basename(p))[0]
        for p in glob.glob(os.path.join(HERE, "*.py"))
    }
    for entry in os.listdir(HERE):
        if os.path.isfile(os.path.join(HERE, entry, "__init__.py")):
            names.add(entry)
    return names


def imported_names(path):
    """파일이 import하는 최상위 모듈 이름들. 상대 import(`from . import x`)는 제외."""
    with open(path, encoding="utf-8") as fh:
        tree = ast.parse(fh.read(), filename=path)
    found = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                found.add(alias.name.split(".")[0])
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found.add(node.module.split(".")[0])
    return found


class TestsRunOnTheCiRunner(unittest.TestCase):
    """테스트가 내 컴퓨터에서만 도는 일이 없게."""

    def test_테스트가_CI에_없는_패키지를_쓰지_않는다(self):
        allowed = set(sys.stdlib_module_names) | local_modules() | CI_INSTALLS
        offenders = []
        for path in sorted(glob.glob(os.path.join(HERE, "test_*.py"))):
            for name in sorted(imported_names(path) - allowed):
                offenders.append(f"{os.path.basename(path)} → import {name}")
        self.assertEqual(
            offenders, [],
            "CI 러너에 없는 패키지를 테스트가 import한다 — CI에서만 "
            "ModuleNotFoundError로 죽는다.\n  "
            + "\n  ".join(offenders)
            + "\n\n표준 라이브러리로 바꾸거나, 정말 필요하면 ci.yml의 pip install 줄과 "
              "이 파일의 CI_INSTALLS를 함께 고쳐라.")

    def test_CI_설치_목록이_실제_ci_yml과_맞는다(self):
        """CI_INSTALLS를 늘려 놓고 ci.yml을 안 고치는 반대 방향의 실수도 막는다."""
        with open(CI_WORKFLOW, encoding="utf-8") as fh:
            ci = fh.read()
        for package in sorted(CI_INSTALLS):
            self.assertIn(
                package, ci,
                f"CI_INSTALLS에 '{package}'가 있는데 ci.yml은 그걸 설치하지 않는다 — "
                f"허용만 해 두고 실제로는 없는 상태다.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
