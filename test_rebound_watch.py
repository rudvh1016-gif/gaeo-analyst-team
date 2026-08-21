# -*- coding: utf-8 -*-
"""compute_rebound_watch.py 계약 테스트.

이 목록은 "폭등을 잡는 규칙이 진짜인지" 확인하려고 성적을 쌓는 관찰 기록이다.
그래서 산식보다 먼저 지켜야 할 것이 있다.

  ① 미래를 보지 않는다 — 오늘 후보는 오늘까지의 가격만으로 정한다.
  ② 지나간 날을 나중에 채워 넣지 않는다 — 그러면 쌓인 성적이 전부 거짓이 된다.
  ③ 표본이 모자라면 성적을 0으로 채우지 않고 비운다.
  ④ 채점 비용은 모의투자와 같은 값을 쓴다 — 달라지면 나란히 볼 수 없다.

파일 입출력 없이 순수 함수만 부른다.
"""
import sys
import unittest

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import compute_rebound_watch as rw


def day(date, close, volume=100000, high=None):
    return {"date": date, "close": close, "volume": volume,
            "high": high if high is not None else close, "low": close, "open": close}


def series(start_close, n, step=0.0, volume=100000, start_day=1):
    """연속 거래일 n개. 종가는 start_close에서 step%씩 변한다."""
    out, c = [], float(start_close)
    for i in range(n):
        out.append(day(f"2026-06-{start_day + i:02d}" if start_day + i <= 30
                       else f"2026-07-{start_day + i - 30:02d}", round(c), volume))
        c *= (1 + step / 100)
    return out


class CostModelTest(unittest.TestCase):
    """④ 모의투자와 같은 비용을 써야 성적을 나란히 볼 수 있다."""

    def test_same_cost_as_paper_engine(self):
        import paper_engine
        self.assertEqual(rw.COMMISSION_PCT, paper_engine.COMMISSION_PCT)
        self.assertEqual(rw.SELL_TAX_PCT, paper_engine.SELL_TAX_DEFAULT_PCT)

    def test_net_return_matches_paper_engine(self):
        import paper_engine
        self.assertEqual(rw.net_return_pct(10000, 11000),
                         paper_engine.net_return_pct(10000, 11000, "KOSPI"))

    def test_net_return_subtracts_cost(self):
        # 같은 가격에 사고팔면 비용만큼 손해다. 0%가 나오면 비용을 안 뺀 것이다.
        self.assertLess(rw.net_return_pct(10000, 10000), 0)

    def test_missing_price_is_none_not_zero(self):
        self.assertIsNone(rw.net_return_pct(10000, None))
        self.assertIsNone(rw.net_return_pct(0, 10000))


class PickTest(unittest.TestCase):
    """① 조건을 만족하는 종목만, 그날까지의 정보로만 고른다."""

    def setUp(self):
        # 21거래일: 20일 전 10,000 → 오늘 7,000 (-30%)
        days = [day(f"2026-07-{i:02d}", 10000 - (i - 1) * 150, 100000) for i in range(1, 22)]
        days[-1] = day("2026-07-21", 7000, 300000, high=7200)   # 오늘 거래량 3배
        self.price = {"000001": [{"page": 1, "days": days}]}
        self.names = {"000001": "떨어진종목"}

    def test_picks_a_stock_that_meets_both_conditions(self):
        got = rw.pick_candidates(self.price, self.names, {}, "2026-07-21")
        self.assertEqual(len(got), 1)
        self.assertEqual(got[0]["code"], "000001")
        self.assertLessEqual(got[0]["dropPct"], rw.DROP_PCT)
        self.assertGreaterEqual(got[0]["volRatio"], rw.VOL_RATIO)

    def test_skips_when_volume_is_not_high_enough(self):
        d = self.price["000001"][0]["days"]
        d[-1] = day("2026-07-21", 7000, 100000)      # 거래량 평소 수준
        self.assertEqual(rw.pick_candidates(self.price, self.names, {}, "2026-07-21"), [])

    def test_skips_when_drop_is_not_deep_enough(self):
        days = [day(f"2026-07-{i:02d}", 10000 - (i - 1) * 20, 100000) for i in range(1, 22)]
        days[-1] = day("2026-07-21", 9600, 300000)   # -4%
        self.assertEqual(rw.pick_candidates({"000002": [{"page": 1, "days": days}]},
                                            {}, {}, "2026-07-21"), [])

    def test_never_looks_at_future_prices(self):
        """⭐ 오늘 이후의 가격이 있어도 오늘 후보는 달라지지 않아야 한다."""
        base = rw.pick_candidates(self.price, self.names, {}, "2026-07-21")
        future = {"000001": [{"page": 1, "days": self.price["000001"][0]["days"] + [
            day("2026-07-22", 20000, 900000), day("2026-07-23", 30000, 900000)]}]}
        self.assertEqual(rw.pick_candidates(future, self.names, {}, "2026-07-21"), base)

    def test_does_not_pick_for_a_day_without_todays_price(self):
        # 오늘 시세가 아직 안 들어왔으면 어제 값으로 후보를 만들지 않는다.
        self.assertEqual(rw.pick_candidates(self.price, self.names, {}, "2026-07-22"), [])

    def test_penny_stocks_excluded(self):
        days = [day(f"2026-07-{i:02d}", 900 - (i - 1) * 20, 100000) for i in range(1, 22)]
        days[-1] = day("2026-07-21", 500, 300000)
        self.assertEqual(rw.pick_candidates({"000003": [{"page": 1, "days": days}]},
                                            {}, {}, "2026-07-21"), [])

    def test_illiquid_stocks_excluded(self):
        days = [day(f"2026-07-{i:02d}", 10000 - (i - 1) * 150, 100) for i in range(1, 22)]
        days[-1] = day("2026-07-21", 7000, 500)
        self.assertEqual(rw.pick_candidates({"000004": [{"page": 1, "days": days}]},
                                            {}, {}, "2026-07-21"), [])

    def test_records_gaeo_call_alongside(self):
        """GAEO가 같은 날 뭐라고 했는지 남겨야 "놓친 것"을 셀 수 있다."""
        got = rw.pick_candidates(self.price, self.names, {"000001": "SELL"}, "2026-07-21")
        self.assertEqual(got[0]["gaeoCall"], "SELL")

    def test_capped_at_max_watch(self):
        price, names = {}, {}
        for k in range(rw.MAX_WATCH + 6):
            code = f"1000{k:02d}"
            days = [day(f"2026-07-{i:02d}", 10000 - (i - 1) * (150 + k), 100000) for i in range(1, 22)]
            days[-1] = day("2026-07-21", 7000 - k * 50, 300000)
            price[code] = [{"page": 1, "days": days}]
            names[code] = code
        self.assertEqual(len(rw.pick_candidates(price, names, {}, "2026-07-21")), rw.MAX_WATCH)


class ScoreTest(unittest.TestCase):
    """② 5거래일이 실제로 지난 것만 채점한다. 없는 가격을 지어내지 않는다."""

    def setUp(self):
        self.days = [day(f"2026-07-{i:02d}", 10000, 100000) for i in range(1, 11)]
        self.days[5] = day("2026-07-06", 12000, 100000, high=13000)  # 진입 +5거래일
        self.price = {"000001": [{"page": 1, "days": self.days}]}

    def entry(self, date="2026-07-01", price=10000):
        return {"code": "000001", "date": date, "price": price, "status": "PENDING"}

    def test_scores_after_five_trading_days(self):
        e = self.entry()
        n = rw.score_pending([e], self.price, "2026-07-10")
        self.assertEqual(n, 1)
        self.assertEqual(e["status"], "SCORED")
        self.assertEqual(e["exitDate"], "2026-07-06")
        self.assertAlmostEqual(e["returnPct"], rw.net_return_pct(10000, 12000))

    def test_records_the_high_inside_the_window(self):
        e = self.entry()
        rw.score_pending([e], self.price, "2026-07-10")
        self.assertAlmostEqual(e["maxGainPct"], 30.0)   # 13,000 / 10,000

    def test_does_not_score_before_five_days_pass(self):
        e = self.entry()
        self.assertEqual(rw.score_pending([e], self.price, "2026-07-04"), 0)
        self.assertEqual(e["status"], "PENDING")
        self.assertNotIn("returnPct", e)

    def test_does_not_rescore_finished_entries(self):
        e = self.entry()
        rw.score_pending([e], self.price, "2026-07-10")
        first = e["returnPct"]
        self.assertEqual(rw.score_pending([e], self.price, "2026-07-10"), 0)
        self.assertEqual(e["returnPct"], first)

    def test_missing_price_leaves_it_pending(self):
        e = self.entry(date="2026-01-01")     # 시세에 없는 날짜
        self.assertEqual(rw.score_pending([e], self.price, "2026-07-10"), 0)
        self.assertEqual(e["status"], "PENDING")


class SummaryTest(unittest.TestCase):
    """③ 표본이 모자라면 0으로 채우지 않고 비운다."""

    def scored(self, n, ret=5.0, start=1):
        return [{"code": f"{i:06d}", "date": f"2026-07-{start + i % 28:02d}",
                 "status": "SCORED", "returnPct": ret, "maxGainPct": ret + 3,
                 "gaeoCall": "SELL"} for i in range(n)]

    def test_empty_summary_has_no_fabricated_numbers(self):
        s = rw.summarize([])
        self.assertFalse(s["evidenceOk"])
        for k in ("winRatePct", "avgReturnPct", "medianReturnPct", "surgeRatePct"):
            self.assertIsNone(s[k], f"{k}는 표본이 없으면 null이어야 한다")

    def test_small_sample_still_withholds_performance(self):
        s = rw.summarize(self.scored(5))
        self.assertFalse(s["evidenceOk"])
        self.assertEqual(s["scoredCount"], 5)
        self.assertIsNone(s["winRatePct"])

    def test_enough_trades_but_too_few_days_still_withholds(self):
        # 같은 날 담은 거래는 서로 독립이 아니다. 건수만 채워선 안 된다.
        rows = [{"code": f"{i:06d}", "date": "2026-07-01", "status": "SCORED",
                 "returnPct": 5.0, "maxGainPct": 8.0} for i in range(40)]
        s = rw.summarize(rows)
        self.assertFalse(s["evidenceOk"])
        self.assertIsNone(s["winRatePct"])

    def test_publishes_only_when_both_thresholds_met(self):
        rows = []
        for d in range(rw.MIN_DAYS_FOR_EVIDENCE):
            rows.append({"code": f"{d:06d}", "date": f"2026-07-{d + 1:02d}",
                         "status": "SCORED", "returnPct": 5.0, "maxGainPct": 8.0})
        while len(rows) < rw.MIN_SCORED_FOR_EVIDENCE:
            rows.append({"code": f"9{len(rows):05d}", "date": "2026-07-01",
                         "status": "SCORED", "returnPct": 5.0, "maxGainPct": 8.0})
        s = rw.summarize(rows)
        self.assertTrue(s["evidenceOk"])
        self.assertEqual(s["winRatePct"], 100.0)
        self.assertEqual(s["avgReturnPct"], 5.0)

    def test_pending_entries_are_counted_but_not_scored(self):
        rows = self.scored(3) + [{"code": "999999", "date": "2026-07-09", "status": "PENDING"}]
        s = rw.summarize(rows)
        self.assertEqual(s["pendingCount"], 1)
        self.assertEqual(s["scoredCount"], 3)

    def test_gaeo_buy_rate_is_reported_even_with_small_sample(self):
        """GAEO가 이 후보들을 BUY로 봤는지는 단순 집계라 표본과 무관하게 낸다.

        이 목록을 만든 이유 자체(폭등을 BUY가 못 잡는다)를 확인하는 값이다.
        """
        rows = self.scored(4)
        rows[0]["gaeoCall"] = "BUY"
        s = rw.summarize(rows)
        self.assertEqual(s["gaeoBuyRatePct"], 25.0)


class RuleTest(unittest.TestCase):
    def test_rule_version_is_recorded(self):
        # 규칙을 바꾸면 그 전 기록과 비교가 깨진다. 버전이 붙어 있어야 구분된다.
        self.assertTrue(rw.RULE_VERSION.startswith("REBOUND_WATCH_"))

    def test_hold_days_match_paper_trading(self):
        # 모의투자와 같은 보유기간이어야 성적을 나란히 볼 수 있다.
        self.assertEqual(rw.HOLD_DAYS, 5)

    def test_thresholds_match_the_verified_finding(self):
        # 2026-08-21 검증에서 쓴 조건 그대로여야 한다.
        self.assertEqual(rw.DROP_PCT, -20.0)
        self.assertEqual(rw.VOL_RATIO, 1.5)
        self.assertEqual(rw.LOOKBACK, 20)


class CorporateActionTest(unittest.TestCase):
    """🐛 2026-08-21 회귀 방지 — 권리락·거래정지를 폭락으로 오인하면 안 된다.

    첫 실행에서 유일하게 뽑힌 후보가 액면분할 종목이었다(하루 -59.9%).
    한국 주식은 하루 ±30%가 한도라 그런 하락은 가격이 빠진 게 아니다.
    """

    def base_days(self):
        return [day(f"2026-07-{i:02d}", 10000, 100000) for i in range(1, 22)]

    def test_split_like_single_day_crash_is_excluded(self):
        d = self.base_days()
        d[10] = day("2026-07-11", 4000, 100000)       # 하루 -60% = 액면분할
        for i in range(11, 21):
            d[i] = day(f"2026-07-{i + 1:02d}", 4000, 100000)
        d[-1] = day("2026-07-21", 4000, 300000)
        self.assertEqual(rw.pick_candidates({"000005": [{"page": 1, "days": d}]},
                                            {}, {}, "2026-07-21"), [])

    def test_real_crash_within_daily_limit_is_kept(self):
        # 하한가(-30%)를 연달아 맞아 -20% 넘게 빠진 건 진짜 하락이다. 남겨야 한다.
        d, c = [], 10000.0
        for i in range(1, 22):
            d.append(day(f"2026-07-{i:02d}", round(c), 100000))
            c *= 0.94                                  # 하루 -6%씩(제도 안)
        d[-1] = day("2026-07-21", round(c / 0.94), 300000)
        got = rw.pick_candidates({"000006": [{"page": 1, "days": d}]}, {}, {}, "2026-07-21")
        self.assertEqual(len(got), 1, "제도 안에서 빠진 진짜 하락은 후보로 남아야 한다")

    def test_trading_halt_is_excluded(self):
        d = [day(f"2026-07-{i:02d}", 10000 - (i - 1) * 150, 100000) for i in range(1, 22)]
        d[15] = day("2026-07-16", 7750, 0)             # 거래정지
        d[-1] = day("2026-07-21", 7000, 300000)
        self.assertEqual(rw.pick_candidates({"000007": [{"page": 1, "days": d}]},
                                            {}, {}, "2026-07-21"), [])

    def test_limit_threshold_is_below_the_daily_limit(self):
        # 한국 주식 하루 등락 제한은 ±30%다. 문턱이 그보다 느슨하면 권리락을 놓친다.
        self.assertLessEqual(rw.LIMIT_DOWN_PCT, -30.0)


if __name__ == "__main__":
    unittest.main()
