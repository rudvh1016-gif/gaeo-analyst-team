#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FLOW 수급 비율 — 분자와 분모의 기간이 항상 같아야 한다 (2026-09-04 결함 수정 잠금).

고친 결함:
  A. 예전에는 분자(외국인·기관 순매수)는 5일치를 더하면서 분모(기간 거래량)는
     일봉과 날짜가 맞은 날만 더했고, 통과 기준이 3/5였다. 그래서 5일치 순매수를
     3일치 거래량으로 나누는 일이 허용됐다(최대 1.67배 부풀림).
  C. flowRatioPct가 "마지막 하루 거래량 × 일수"라는 근사 분모를 썼고, 그 값이
     화면에 노출되는 qualityScore의 ±20점 항으로 들어갔다.

이 테스트는 두 결함이 되살아나면 실패한다.
"""
import unittest
import compute_indicators as CI


def trends(quants, volumes=None, start_day=5):
    """dealTrends는 최신순이다. volumes가 None이면 같은 행 거래량을 넣지 않는다."""
    rows = []
    for i, q in enumerate(quants):
        row = {"bizdate": f"202608{start_day - i:02d}",
               "foreignerPureBuyQuant": str(q), "organPureBuyQuant": "0",
               "individualPureBuyQuant": str(-q), "closePrice": "1000"}
        if volumes is not None:
            row["accumulatedTradingVolume"] = str(volumes[i])
        rows.append(row)
    return rows


class PeriodConsistency(unittest.TestCase):
    def test_same_row_volume_is_used(self):
        """같은 행에 거래량이 있으면 그걸 분모로 쓴다(기간 불일치 구조적 불가)."""
        f = CI.flow_summary(trends([100] * 5, [1000] * 5), daily=[])
        self.assertEqual(f["volumeBasis"], "SAME_ROW")
        self.assertEqual(f["periodVolume"], 5000)
        self.assertEqual(f["volumeSameRowDays"], 5)
        self.assertAlmostEqual(f["frgnRatioPct"], round(500 / 5000 * 100, 4), places=4)

    def test_numerator_and_denominator_cover_the_same_days(self):
        """일봉으로 되돌아갈 때도 분자를 매칭된 날짜로만 제한해야 한다.

        일봉에 3일치만 있으면, 분자도 그 3일치(300주)여야 한다.
        예전 코드는 5일치(500주)를 3일치 거래량으로 나눠 1.67배 부풀렸다.
        """
        daily = [{"date": "2026-08-03", "volume": 1000, "close": 100},
                 {"date": "2026-08-04", "volume": 1000, "close": 100},
                 {"date": "2026-08-05", "volume": 1000, "close": 100}]
        f = CI.flow_summary(trends([100] * 5), daily=daily)
        # 3/5 = 0.6 < 0.8 이므로 비율을 만들지 않는다(예전에는 통과했다).
        self.assertIsNone(f["frgnRatioPct"])
        self.assertNotEqual(f["volumeState"], "PERIOD_VOLUME_MATCHED")

    def test_four_of_five_days_is_enough(self):
        """4/5는 통과하되, 그때도 분자는 매칭된 4일치여야 한다."""
        daily = [{"date": f"2026-08-{d:02d}", "volume": 1000, "close": 100}
                 for d in (2, 3, 4, 5)]
        f = CI.flow_summary(trends([100] * 5), daily=daily)
        self.assertEqual(f["volumeState"], "PERIOD_VOLUME_MATCHED")
        self.assertEqual(f["periodVolume"], 4000)
        # 분자도 4일치(400주). 5일치(500주)면 25% 부풀려진 값이다.
        self.assertAlmostEqual(f["frgnRatioPct"], round(400 / 4000 * 100, 4), places=4)

    def test_flow_ratio_no_longer_uses_last_day_approximation(self):
        """flowRatioPct가 근사 분모(마지막 하루 × 일수)를 쓰지 않는다.

        마지막 하루 거래량만 크게 튀는 종목에서 근사와 실제가 크게 갈린다.
        """
        volumes = [90_000, 1000, 1000, 1000, 1000]      # 최신일만 거래 폭증
        f = CI.flow_summary(trends([100] * 5, volumes), daily=[])
        self.assertEqual(f["flowRatioBasis"], "PERIOD_VOLUME_SAME_ROW")
        real = 500 / 94_000 * 100
        approx = 500 / (90_000 * 5) * 100
        self.assertAlmostEqual(f["flowRatioPct"], round(real, 3), places=3)
        self.assertNotAlmostEqual(f["flowRatioPct"], round(approx, 3), places=3)

    def test_hold_window_mismatch_is_declared(self):
        """보유율 변화가 순매수 합계와 다른 기간을 잰다는 사실을 숨기지 않는다."""
        rows = trends([100] * 5, [1000] * 5)
        for i, row in enumerate(rows):
            row["foreignerHoldRatio"] = f"{10 + i * 0.1:.2f}%"
        f = CI.flow_summary(rows, daily=[])
        self.assertTrue(f["holdWindowMismatch"])
        self.assertEqual(f["flowWindowDays"], 5)
        self.assertEqual(f["holdWindowDays"], 4)

    def test_reported_window_matches_rows_used(self):
        """실제로 며칠을 썼는지 반환값이 정확히 보고해야 한다.

        days 기본값(6)은 호환성 때문에 그대로 두되, 운영 데이터는 5행이므로
        보고되는 창 길이는 항상 실제 사용한 행 수여야 한다.
        """
        f = CI.flow_summary(trends([100] * 5, [1000] * 5), daily=[])
        self.assertEqual(f["days"], 5)
        self.assertEqual(f["flowWindowDays"], 5)


if __name__ == "__main__":
    unittest.main(verbosity=2)
