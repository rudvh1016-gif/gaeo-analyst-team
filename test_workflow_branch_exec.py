#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""러너 워크플로의 '시간대 판정' 분기를 **실제로 bash로 실행해** 계약을 잠근다.

왜 문자열 검사로는 부족한가 (2026-09-06 PR #513 검수 지적 m6):
    `test_holiday_guard.py`의 워크플로 검사는 `[ -n "$trading" ]`가 줄에 들어 있는지만 본다.
    그래서 `sys.exit(0 if … else 9)`가 뒤집히거나, `trading`이 뒤에서 덮이거나, python이
    저장소 루트에서 돌지 않아 import가 깨져도 전부 통과한다. 실제로 이 PR 검수 중
    "python3가 없으면 멀쩡한 거래일이 통째로 휴장일이 된다"는 반전 버그가 있었고,
    문자열 검사는 그것을 잡지 못했다.

무엇을 하는가:
    워크플로 YAML에서 `# ---------- 시간대 판정 ----------` 블록만 원문 그대로 떼어내,
    `date`·`sleep`·`chain`·`dispatch`를 스텁으로 바꾼 하네스에서 `bash -e`(Actions 기본)로
    돌린다. 가짜 현재 시각은 셸 `date` 스텁이, 파이썬이 볼 오늘 날짜는 `sitecustomize`가 준다.

계약 (각 케이스가 어느 분기로 가야 하는가):
    휴장일  07:00 → 장외 체인 대기 + chain (개장 전 대기로 새면 안 된다)
    휴장일  11:00 → 장외 체인 대기 + chain
    거래일  07:00 → 개장 전 대기 후 수집 루프 진입
    거래일  11:00 → 곧바로 수집 루프 진입
    거래일  17:00 → 장외 체인 대기 + chain
    토요일  11:00 → 장외 체인 대기 + chain
    거래일 + python3 판정 불가 → 수집 루프 진입 (fail-open: 달력이 깨져도 거래일을 쉬지 않는다)
    휴장일 + force_collect=1 → 수집 루프 진입 (임시 개장·달력 오류용 탈출구)
"""
import os
import re
import subprocess
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
WORKFLOWS = ("update-prices.yml", "update-analysis.yml")

HARNESS = r'''#!/bin/bash
set -e
export TZ=Asia/Seoul
cd "$REPO" || exit 99
_sync(){ FAKE_DATE=$(command date -d "@$FAKE_EPOCH" +%F); export FAKE_DATE; }
_sync
date(){
  # ⚠️ "$*"를 그대로 ${*#...}에 쓰면 bash가 인자마다 따로 잘라내 문자열이 안 바뀐다.
  #    반드시 한 번 변수에 담아서 문자열로 다룬다.
  local args="$*" spec
  case "$args" in
    "+%s") echo "$FAKE_EPOCH" ;;
    "+%u") command date -d "@$FAKE_EPOCH" +%u ;;
    "-d "*" +%s")
      spec="${args#-d }"; spec="${spec% +%s}"
      command date -d "$(command date -d "@$FAKE_EPOCH" +%F) $spec" +%s ;;
    *) command date "$@" ;;
  esac
}
sleep(){ FAKE_EPOCH=$(( FAKE_EPOCH + $1 )); export FAKE_EPOCH; _sync; echo "[STUB sleep $1]"; }
chain(){ echo "[STUB chain]"; }
dispatch(){ echo "[STUB dispatch $1]"; }
IS_MAIN=1
# 실제 러너에서는 앞 스텝이 $GITHUB_ENV에 TRADING을 적고, 다음 스텝이 그걸 env로 받는다.
export GITHUB_ENV="$(mktemp)"
source "$2"                      # 거래일 판정 스텝
set -a; . "$GITHUB_ENV"; set +a  # 그 결과를 env로 넘김
source "$1"                      # 시간대 판정 분기
echo "[COLLECT LOOP ENTERED]"
'''

SITECUSTOMIZE = (
    "import os, datetime\n"
    "_f = os.environ.get('FAKE_DATE')\n"
    "if _f:\n"
    "    _real = datetime.date\n"
    "    class _D(_real):\n"
    "        @classmethod\n"
    "        def today(cls):\n"
    "            return _real.fromisoformat(_f)\n"
    "    datetime.date = _D\n"
)


def gate_source(workflow):
    """'거래일 판정' 전용 스텝의 run: 블록을 떼어낸다 (2026-09-07 분리).

    이 판정은 원래 아래 큰 블록 안에 있었는데, 그러다 블록이 GitHub의 UTF-8 21,000바이트
    한도를 넘어 워크플로 파일 전체가 무효가 됐다(자동분석 65시간 중단). 이제 별도 스텝이
    판정해 $GITHUB_ENV로 TRADING만 넘긴다 — 그래서 여기서도 두 조각을 이어서 실행한다.
    """
    with open(os.path.join(HERE, ".github", "workflows", workflow), encoding="utf-8") as fh:
        body = fh.read()
    m = re.search(r"\n      - name: 거래일 판정[^\n]*\n        run: \|\n((?:          .*\n|\n)*)", body)
    if not m:
        raise AssertionError(f"{workflow}: '거래일 판정' 스텝을 찾지 못했다")
    return "".join(
        (line[10:] if line.startswith(" " * 10) else line) + "\n"
        for line in m.group(1).rstrip("\n").split("\n")
    )


def branch_source(workflow):
    """워크플로 YAML에서 '시간대 판정' 블록을 원문 그대로 떼어내 들여쓰기만 벗긴다."""
    with open(os.path.join(HERE, ".github", "workflows", workflow), encoding="utf-8") as fh:
        body = fh.read()
    m = re.search(r"\n( +)(# -+ 시간대 판정 -+\n.*?)\n\1# -+ 장중 수집 루프", body, re.S)
    if not m:
        raise AssertionError(f"{workflow}: '시간대 판정' 블록을 찾지 못했다")
    indent = m.group(1)
    return "".join(
        (line[len(indent):] if line.startswith(indent) else line) + "\n"
        for line in m.group(2).split("\n")
    )


class WorkflowBranchExecution(unittest.TestCase):
    """워크플로 분기를 진짜 실행해서 결과를 본다."""

    @classmethod
    def setUpClass(cls):
        import tempfile
        cls._tmp = tempfile.TemporaryDirectory()
        d = cls._tmp.name
        cls.shim = os.path.join(d, "shim")
        os.makedirs(cls.shim, exist_ok=True)
        with open(os.path.join(cls.shim, "sitecustomize.py"), "w", encoding="utf-8") as fh:
            fh.write(SITECUSTOMIZE)
        cls.harness = os.path.join(d, "harness.sh")
        with open(cls.harness, "w", encoding="utf-8") as fh:
            fh.write(HARNESS)
        # python3가 아예 없는 러너를 흉내내는 가짜 PATH (판정 불가 → 종전 동작 폴백 확인용)
        cls.nopy = os.path.join(d, "nopy")
        os.makedirs(cls.nopy, exist_ok=True)
        stub = os.path.join(cls.nopy, "python3")
        with open(stub, "w", encoding="utf-8") as fh:
            fh.write("#!/bin/sh\nexit 127\n")
        os.chmod(stub, 0o755)
        cls.blocks, cls.gates = {}, {}
        for name in WORKFLOWS:
            path = os.path.join(d, name.replace(".yml", ".sh"))
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(branch_source(name))
            cls.blocks[name] = path
            gate = os.path.join(d, name.replace(".yml", ".gate.sh"))
            with open(gate, "w", encoding="utf-8") as fh:
                fh.write(gate_source(name))
            cls.gates[name] = gate

    @classmethod
    def tearDownClass(cls):
        cls._tmp.cleanup()

    def run_branch(self, workflow, day, hhmm, *, force="", no_python=False):
        epoch = subprocess.run(
            ["date", "-d", f"{day} {hhmm}", "+%s"],
            capture_output=True, text=True, check=True,
            env={**os.environ, "TZ": "Asia/Seoul"},
        ).stdout.strip()
        env = {
            **os.environ,
            "REPO": HERE,
            "TZ": "Asia/Seoul",
            "FAKE_EPOCH": epoch,
            "FORCE_COLLECT": force,
            "PYTHONPATH": self.shim,
        }
        if no_python:
            env["PATH"] = self.nopy + os.pathsep + env.get("PATH", "")
        out = subprocess.run(
            ["bash", self.harness, self.blocks[workflow], self.gates[workflow]],
            capture_output=True, text=True, env=env, timeout=120,
        )
        text = out.stdout + out.stderr
        if "[COLLECT LOOP ENTERED]" in text:
            return "collect", text
        if "[STUB chain]" in text:
            return "chain", text
        return f"unknown(rc={out.returncode})", text

    # ---- 휴장일: 어느 시각에도 수집으로 새면 안 된다 ----
    def test_휴장일은_모든_시각에_장외_체인으로_간다(self):
        for workflow in WORKFLOWS:
            for hhmm in ("07:00", "11:00", "17:00"):
                with self.subTest(workflow=workflow, time=hhmm):
                    got, text = self.run_branch(workflow, "2026-09-24", hhmm)
                    self.assertEqual(got, "chain", f"{workflow} {hhmm}\n{text}")
                    self.assertIn("KRX 휴장일(공휴일)", text)

    # ---- 거래일: 종전 동작 그대로 ----
    def test_거래일_장중은_바로_수집_루프로_간다(self):
        for workflow in WORKFLOWS:
            with self.subTest(workflow=workflow):
                got, text = self.run_branch(workflow, "2026-09-23", "11:00")
                self.assertEqual(got, "collect", text)
                self.assertIn("장중 기동", text)

    def test_거래일_개장전은_기다렸다가_수집한다(self):
        for workflow in WORKFLOWS:
            with self.subTest(workflow=workflow):
                got, text = self.run_branch(workflow, "2026-09-23", "07:00")
                self.assertEqual(got, "collect", text)
                self.assertIn("개장 전 기동", text)

    def test_거래일_장마감후와_주말은_장외_체인이다(self):
        for workflow in WORKFLOWS:
            for day, hhmm in (("2026-09-23", "17:00"), ("2026-09-26", "11:00")):
                with self.subTest(workflow=workflow, day=day):
                    got, text = self.run_branch(workflow, day, hhmm)
                    self.assertEqual(got, "chain", text)

    # ---- 핵심: 판정 불가는 '휴장일'이 아니다 ----
    def test_달력_판정에_실패해도_거래일을_쉬지_않는다(self):
        """fail-closed 반전 방지 — python3가 없어도 거래일 장중이면 수집으로 간다."""
        for workflow in WORKFLOWS:
            with self.subTest(workflow=workflow):
                got, text = self.run_branch(workflow, "2026-09-23", "11:00", no_python=True)
                self.assertEqual(got, "collect", f"{workflow}: 판정 실패가 휴장일로 둔갑했다\n{text}")
                self.assertIn("::warning::", text)

    def test_force_collect는_휴장일_달력을_넘어선다(self):
        """임시 개장·달력 오류 때 저장소를 고치지 않고 강제 실행할 수단이 있어야 한다."""
        for workflow in WORKFLOWS:
            with self.subTest(workflow=workflow):
                got, text = self.run_branch(workflow, "2026-09-24", "11:00", force="1")
                self.assertEqual(got, "collect", text)
                self.assertIn("force_collect", text)


if __name__ == "__main__":
    unittest.main(verbosity=2)
