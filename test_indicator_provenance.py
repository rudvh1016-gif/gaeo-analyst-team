"""지표 파일의 '출처 시각·기준일' 필드 — 2026-09-10 GAEO Private 연동 보완.

값을 지어내지 않는다: 이미 있는 analysis_data.fetchedAt · daily[-1].date · dealTrends.bizdate 를
형식만 맞춰 싣는다. 없으면 None 이다. 점수·가중치·판단 로직은 건드리지 않는다.
"""
import unittest

from compute_indicators import _iso_bizdate, flow_summary, last_bar_date


class ProvenanceFieldTests(unittest.TestCase):
    def test_bizdate_becomes_iso_date_or_none(self):
        self.assertEqual(_iso_bizdate("20260908"), "2026-09-08")
        for bad in (None, "", "2026098", "20261340", "9/8", "2026-09-08"):
            self.assertIsNone(_iso_bizdate(bad))

    def test_last_bar_date_is_the_last_daily_row_date(self):
        daily = [{"date": "2026-09-08", "close": 100}, {"date": "2026-09-09", "close": 101}]
        self.assertEqual(last_bar_date(daily), "2026-09-09")
        self.assertIsNone(last_bar_date([]))
        self.assertIsNone(last_bar_date([{"close": 1}]))
        self.assertIsNone(last_bar_date([{"date": "09-09"}]))

    def test_flow_summary_carries_iso_period_end_next_to_existing_label(self):
        rows = [{"bizdate": "20260908", "foreignerPureBuyQuant": "-1", "organPureBuyQuant": "-1",
                 "individualPureBuyQuant": "2", "accumulatedTradingVolume": "10"},
                {"bizdate": "20260907", "foreignerPureBuyQuant": "-1", "organPureBuyQuant": "-1",
                 "individualPureBuyQuant": "2", "accumulatedTradingVolume": "10"}]
        flow = flow_summary(rows, [])
        self.assertEqual(flow["periodEnd"], "9/8")          # 기존 화면 문구용 값은 그대로
        self.assertEqual(flow["periodEndDate"], "2026-09-08")
        self.assertIsNone(flow_summary([{"foreignerPureBuyQuant": "1", "organPureBuyQuant": "1"}], [])["periodEndDate"])


if __name__ == "__main__":
    unittest.main()
