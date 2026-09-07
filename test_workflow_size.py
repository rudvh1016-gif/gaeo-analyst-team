#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""워크플로 `run:` 블록 크기 계약 (2026-09-07 사고 후 신설).

## 무슨 사고였나

2026-09-06에 휴장일 가드를 두 워크플로의 큰 `run:` 블록 안에 끼워 넣었다.
YAML 문법은 멀쩡했고, `bash -n`도 통과했고, 새로 만든 실행 테스트
(`test_workflow_branch_exec.py`)도 18케이스 전부 통과했다. 그런데
**GitHub이 워크플로 파일 자체를 무효로 판정했다.**

    failed to parse workflow: (Line: 64, Col: 14): Exceeded max expression length 21000

GitHub은 `run:` 블록 하나를 **UTF-8 21,000바이트**로 제한한다. 한글 주석은
글자당 3바이트다. `update-analysis.yml`의 큰 블록은 이미 19,888바이트였고,
1,277바이트를 더하자 21,165바이트가 되어 165바이트를 초과했다.

파일이 무효가 되면 **job이 하나도 생성되지 않는다**. 그래서
  · push마다 0초짜리 실패 run만 남고(작업 0개라 로그도 없다),
  · `workflow_dispatch`(자기 재기동 체인)까지 거부돼 체인이 통째로 끊기고,
  · 자동분석이 금요일 16:13 이후 65시간 동안 멈췄다.
`update-prices.yml`은 같은 수정을 받았지만 블록이 6,739바이트라 멀쩡했다 —
그래서 시세는 정상이고 자동분석만 죽는, 알아채기 어려운 모양이 됐다.

## 그래서 무엇을 잠그나

`run:` 블록의 **UTF-8 바이트 크기**를 21,000이 아니라 **20,000**에서 막는다.
한도에 딱 붙여 두면 주석 한 줄에 다시 터진다. 남은 여유도 함께 출력해,
큰 블록에 뭔가를 더하려는 사람이 미리 알 수 있게 한다.
"""
import os
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
WORKFLOW_DIR = os.path.join(HERE, ".github", "workflows")

GITHUB_HARD_LIMIT = 21000   # GitHub이 실제로 거부하는 값
# 우리가 스스로 지키는 선. GitHub보다 500바이트 먼저 막는다(한글 주석 두 줄쯤).
#
# ⚠️ 왜 1,000이 아니라 500인가 — 실측 기록:
#     2026-09-06 이전(사고 전)  update-analysis.yml 큰 블록 = 19,888바이트 (이미 한도의 94.7%)
#     2026-09-06 휴장일 가드 후                          = 21,165바이트 → GitHub 거부, 체인 사망
#     2026-09-07 판정을 전용 스텝으로 분리 후            = 20,151바이트
#   즉 이 블록은 **내 변경 이전부터** 이미 벼랑 끝이었다. 1,000바이트 여유는 지금 구조로는
#   달성할 수 없고, 억지로 맞추려면 남의 기록(경위 주석)을 지워야 한다.
#   진짜 여유를 벌려면 `# ---------- 공용 함수` 구간(약 1.6KB)을 .github/scripts/의 셸 파일로
#   빼서 source 하면 된다. 그때 이 값을 20,000으로 되돌릴 것. 지금은 장중 복구가 먼저다.
SAFE_LIMIT = 20500


def run_blocks(path):
    """`run: |` 블록의 (시작 줄, 스칼라 값)을 모두 돌려준다."""
    with open(path, encoding="utf-8") as fh:
        lines = fh.read().split("\n")
    out, i = [], 0
    while i < len(lines):
        stripped = lines[i].strip()
        if stripped.startswith("run: |"):
            indent = len(lines[i]) - len(lines[i].lstrip())
            body, j = [], i + 1
            while j < len(lines):
                cur = lines[j]
                if cur.strip() == "":
                    body.append(cur); j += 1; continue
                if len(cur) - len(cur.lstrip()) <= indent:
                    break
                body.append(cur); j += 1
            value = "\n".join(b[indent + 2:] if len(b) > indent + 2 else "" for b in body) + "\n"
            out.append((i + 1, value))
            i = j
        else:
            i += 1
    return out


class RunBlockSize(unittest.TestCase):
    def test_모든_run_블록이_안전선_안에_있다(self):
        checked = 0
        for name in sorted(os.listdir(WORKFLOW_DIR)):
            if not name.endswith((".yml", ".yaml")):
                continue
            for line, value in run_blocks(os.path.join(WORKFLOW_DIR, name)):
                size = len(value.encode("utf-8"))
                checked += 1
                self.assertLessEqual(
                    size, SAFE_LIMIT,
                    f"{name} {line}행의 run: 블록이 {size:,}바이트다(안전선 {SAFE_LIMIT:,}, "
                    f"GitHub 거부선 {GITHUB_HARD_LIMIT:,}).\n"
                    f"  ⚠️ 글자 수가 아니라 **UTF-8 바이트**다 — 한글 주석은 글자당 3바이트.\n"
                    f"  넘으면 워크플로 파일 전체가 무효가 되고 job이 하나도 생성되지 않는다.\n"
                    f"  해결: 그 스텝에서 독립적인 조각을 별도 스텝으로 빼고 $GITHUB_ENV로 값만 넘겨라\n"
                    f"  (2026-09-07에 '거래일 판정' 스텝을 그렇게 분리했다).")
        self.assertGreater(checked, 0, "검사한 run: 블록이 하나도 없다 — 추출 로직이 깨졌다.")

    def test_가장_큰_블록의_남은_여유를_보고한다(self):
        biggest = None
        for name in sorted(os.listdir(WORKFLOW_DIR)):
            if not name.endswith((".yml", ".yaml")):
                continue
            for line, value in run_blocks(os.path.join(WORKFLOW_DIR, name)):
                size = len(value.encode("utf-8"))
                if biggest is None or size > biggest[2]:
                    biggest = (name, line, size)
        self.assertIsNotNone(biggest)
        name, line, size = biggest
        print(f"\n  가장 큰 run: 블록 — {name} {line}행 · {size:,}바이트 "
              f"(안전선까지 {SAFE_LIMIT - size:,}바이트 남음)")
        self.assertLessEqual(size, SAFE_LIMIT)


class TradingDayStep(unittest.TestCase):
    """거래일 판정을 별도 스텝으로 유지한다 — 다시 큰 블록으로 들어가면 또 터진다."""

    def _body(self, name):
        with open(os.path.join(WORKFLOW_DIR, name), encoding="utf-8") as fh:
            return fh.read()

    def test_판정이_전용_스텝에_있고_큰_블록은_결과만_읽는다(self):
        for name in ("update-prices.yml", "update-analysis.yml"):
            body = self._body(name)
            self.assertIn("- name: 거래일 판정 (휴장일이면 수집하지 않는다)", body,
                          f"{name}에 거래일 판정 전용 스텝이 없다.")
            self.assertIn('echo "TRADING=$trading" >> "$GITHUB_ENV"', body,
                          f"{name}이 판정 결과를 다음 스텝으로 넘기지 않는다.")
            self.assertIn('trading="$TRADING"', body,
                          f"{name}의 수집 스텝이 판정 결과를 읽지 않는다.")
            # 달력을 부르는 python 한 줄이 파일에 정확히 한 번만 있어야 한다
            # (그 한 줄 안에 이름이 두 번 나오는 것은 import + 호출이라 정상이다).
            self.assertEqual(body.count("from krx_calendar import is_krx_trading_day"), 1,
                             f"{name}에 달력 판정이 두 곳에 있다 — 전용 스텝 한 곳에만 있어야 한다.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
