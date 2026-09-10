#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""검증 일정 원본(config/validation_schedule.json)의 계약.

- 사람용 문서(docs/VALIDATION_SCHEDULE.md)가 원본과 같은 내용인지(생성 결과와 글자 단위 일치)
- ID 고유 · 예정 시각/기준일 형식 · 기준일 ≤ 예정일 · 단계가 allowlist에만 있음
- 'available' 명령의 스크립트/테스트 모듈이 실제로 존재함(planned는 존재를 요구하지 않는다)
- 정책 파일 경로가 실제로 존재함
- 원장은 append-only 형식(JSON Lines)이며 각 줄에 scheduleId·runAt·status가 있음
"""
import datetime
import json
import os
import unittest

import render_validation_schedule as R

HERE = os.path.dirname(os.path.abspath(__file__))


class ScheduleSource(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cfg = R.load_config()

    def test_문서가_원본과_일치한다(self):
        text = R.render(self.cfg, R.load_ledger(self.cfg))
        with open(R.DOC, encoding="utf-8") as fh:
            current = fh.read()
        self.assertEqual(current, text, "docs/VALIDATION_SCHEDULE.md 가 낡았다 — python3 render_validation_schedule.py")

    def test_ID_고유_시각_형식(self):
        ids = [s["scheduleId"] for s in self.cfg["schedules"]]
        self.assertEqual(len(ids), len(set(ids)), "scheduleId 중복")
        for s in self.cfg["schedules"]:
            due = datetime.datetime.fromisoformat(s["dueAt"])
            self.assertIsNotNone(due.tzinfo, f"{s['scheduleId']} dueAt에 시간대가 없다")
            self.assertEqual(due.utcoffset(), datetime.timedelta(hours=9), f"{s['scheduleId']} dueAt은 KST(+09:00)여야 한다")
            cutoff = datetime.date.fromisoformat(s["cutoffDate"])
            self.assertLessEqual(cutoff, due.date(), f"{s['scheduleId']} 기준일이 예정일보다 늦다")
            self.assertIn(s["kind"], ("PAST_CHECK", "CONFIRMATION", "SAMPLE_CHECK", "EVALUATION", "RECONFIRMATION"))
            self.assertTrue(s.get("dedupeKey") or s.get("status") == "PAST_COMPLETED", f"{s['scheduleId']} dedupeKey 없음")

    def test_단계는_allowlist에만_있다(self):
        cmds = self.cfg["commands"]
        for s in self.cfg["schedules"]:
            for step in s.get("steps", []):
                self.assertIn(step, cmds, f"{s['scheduleId']}의 단계 {step}이 commands allowlist에 없다")

    def test_allowlist_명령은_자리표시자_외_임의_문자열이_없다(self):
        for name, c in self.cfg["commands"].items():
            self.assertIsInstance(c["argv"], list)
            self.assertEqual(c["argv"][0], "python3", f"{name}: 실행기는 python3만 허용")
            for a in c["argv"]:
                self.assertNotIn(";", a); self.assertNotIn("|", a); self.assertNotIn("&", a)
                if "{" in a:
                    self.assertIn(a, ("{cutoffDate}",), f"{name}: 허용되지 않은 자리표시자 {a}")

    def test_available_명령의_대상이_실제로_있다(self):
        for name, c in self.cfg["commands"].items():
            if c["status"] != "available":
                continue
            argv = c["argv"]
            if argv[1] == "-m" and argv[2] == "unittest":
                target = argv[3] + ".py"
            else:
                target = argv[1]
            self.assertTrue(os.path.exists(os.path.join(HERE, target)), f"{name}: {target} 이 없다")

    def test_정책_파일이_존재한다(self):
        for s in self.cfg["schedules"]:
            for p in s.get("policyFiles", []):
                self.assertTrue(os.path.exists(os.path.join(HERE, p)), f"{s['scheduleId']}: 정책 파일 {p} 없음")

    def test_원장_형식(self):
        path = os.path.join(HERE, self.cfg["ledgerPath"])
        if not os.path.exists(path):
            return
        with open(path, encoding="utf-8") as fh:
            for i, line in enumerate(fh, 1):
                if not line.strip():
                    continue
                row = json.loads(line)
                for key in ("scheduleId", "runAt", "status"):
                    self.assertIn(key, row, f"ledger {i}행에 {key} 없음")


if __name__ == "__main__":
    unittest.main(verbosity=2)
