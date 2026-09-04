#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""전체시장 "시장 흐름 추세" 기간 평균 계약 (2026-09-04 신설).

고친 문제: 일별 기록(market_universe/history/*.json)은 2026-08-18부터 매일 쌓이는데,
그걸 합산하는 코드가 없어 public 파일에 "HISTORY_ACCUMULATING" 문자열만 나갔다.
화면은 계속 "데이터 기록 중"만 보여줬다. 재료는 모으면서 요리를 안 하고 있었다.

계약:
  - 날짜가 모자란 기간은 평균을 지어내지 않는다(available=False + 남은 일수).
  - 라벨에 "무엇의 평균인지"가 들어간다(이동평균선 오해 방지).
  - 창(5·20)은 항상 최근 날짜부터 센다.
"""
import json
import os
import shutil
import tempfile
import unittest

import collect_market_universe as C


def day_doc(day, advance_ratio, median_return):
    return {"day": day, "market": {"advanceRatio": advance_ratio,
                                   "medianReturn": median_return}}


class HistorySummary(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self._orig = C.HISTORY_DIR
        C.HISTORY_DIR = self.tmp

    def tearDown(self):
        C.HISTORY_DIR = self._orig
        shutil.rmtree(self.tmp, ignore_errors=True)

    def write(self, days):
        for d in days:
            with open(os.path.join(self.tmp, d["day"] + ".json"), "w", encoding="utf-8") as f:
                json.dump(d, f)

    def test_window_needs_enough_days(self):
        """⭐ 핵심. 5일치밖에 없으면 20거래일 평균을 만들면 안 된다."""
        self.write([day_doc(f"2026-08-{d:02d}", 0.5, 0.1) for d in range(10, 15)])
        out = C.build_history_summary()
        self.assertTrue(out["windows"]["5"]["available"])
        self.assertFalse(out["windows"]["20"]["available"])
        self.assertEqual(out["windows"]["20"]["daysRemaining"], 15)
        self.assertEqual(out["windows"]["20"]["metrics"], {},
                         "표본이 모자란데 평균을 만들었다")

    def test_average_is_correct_and_uses_latest_days(self):
        """창은 항상 최근 날짜부터 센다."""
        self.write([day_doc("2026-08-01", 0.10, -5.0),   # 창 밖(가장 오래됨)
                    day_doc("2026-08-02", 0.20, 1.0),
                    day_doc("2026-08-03", 0.40, 2.0),
                    day_doc("2026-08-04", 0.60, 3.0),
                    day_doc("2026-08-05", 0.80, 4.0),
                    day_doc("2026-08-06", 1.00, 5.0)])
        out = C.build_history_summary()
        w = out["windows"]["5"]
        self.assertTrue(w["available"])
        self.assertEqual(w["periodStart"], "2026-08-02")
        self.assertEqual(w["periodEnd"], "2026-08-06")
        # (20+40+60+80+100)/5 = 60.0  — 가장 오래된 10%는 빠져야 한다
        self.assertAlmostEqual(w["metrics"]["advanceRatioPct"]["average"], 60.0, places=2)
        self.assertAlmostEqual(w["metrics"]["medianReturnPct"]["average"], 3.0, places=2)

    def test_labels_say_what_is_averaged(self):
        """'5일 평균'처럼 대상이 빠진 이름이나 이동평균선 오해 표현을 쓰지 않는다."""
        self.write([day_doc(f"2026-08-{d:02d}", 0.5, 0.1) for d in range(10, 15)])
        out = C.build_history_summary()
        label = out["windows"]["5"]["metrics"]["advanceRatioPct"]["label"]
        self.assertIn("상승 종목 비율", label)
        self.assertIn("5거래일", label)
        for banned in ("5일선", "20일선"):
            self.assertNotIn(banned, label)
        self.assertIn("이동평균선이 아니다", out["note"])

    def test_empty_history_is_honest(self):
        out = C.build_history_summary()
        self.assertEqual(out["totalDaysCollected"], 0)
        self.assertIsNone(out["firstDay"])
        for key in ("5", "20"):
            self.assertFalse(out["windows"][key]["available"])

    def test_today_value_is_carried_for_comparison(self):
        """지금이 평소보다 강한지 보려면 오늘 값도 함께 있어야 한다."""
        self.write([day_doc(f"2026-08-{d:02d}", 0.5, 0.1) for d in range(10, 15)])
        out = C.build_history_summary()
        self.assertAlmostEqual(out["today"]["advanceRatioPct"], 50.0, places=2)

    def test_public_payload_is_not_a_placeholder_string(self):
        """실제 생성 경로가 문자열 대신 집계 객체를 넣는지 확인한다."""
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "collect_market_universe.py"), encoding="utf-8") as f:
            src = f.read()
        self.assertIn('"history": build_history_summary(kst_day)', src)
        self.assertNotIn('"history": HISTORY_ACCUMULATING', src)


if __name__ == "__main__":
    unittest.main(verbosity=2)
