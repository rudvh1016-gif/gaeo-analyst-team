#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""기본모델 후보 A1~A4 계약 검증.

⚠️ 이 테스트는 "후보가 성적이 좋은가"를 확인하지 않는다.
   후보가 **의도한 대로 계산되는가**만 확인한다. 성적 판정은
   validate_base_candidates.py가 시간순 검증으로 따로 한다.
"""
import sys
import unittest

import base_model_candidates as CAND
import compute_indicators as CI


def flow(frgn_ratio, org_ratio, hold_now=None, hold_before=None,
         state=CAND.MIN_VOLUME_COVERAGE_STATE):
    return {"volumeState": state, "frgnRatioPct": frgn_ratio, "orgRatioPct": org_ratio,
            "holdNow": hold_now, "holdBefore": hold_before}


class A1FlowNormalization(unittest.TestCase):
    """FLOW 정규화 — 종목 크기에 자동으로 맞춰져야 한다."""

    def test_scale_invariance(self):
        """⭐ 요구 7-1의 필수 테스트.

        순매수량과 거래량을 **둘 다** 100배해도 점수가 같아야 한다.
        기존 A0(절대 주식수 ÷ 50,000주)는 이 성질이 없어서, 사실상
        '거래량이 많은 종목인가'를 재고 있었다.
        """
        daily_small = [{"date": f"2026-08-{d:02d}", "volume": 10_000, "close": 1000}
                       for d in range(1, 8)]
        daily_big = [{"date": f"2026-08-{d:02d}", "volume": 1_000_000, "close": 1000}
                     for d in range(1, 8)]
        trends_small = [{"bizdate": f"202608{d:02d}", "foreignerPureBuyQuant": "+400",
                         "organPureBuyQuant": "+200", "individualPureBuyQuant": "-600",
                         "foreignerHoldRatio": "10.00%"} for d in range(7, 0, -1)]
        trends_big = [{"bizdate": f"202608{d:02d}", "foreignerPureBuyQuant": "+40000",
                       "organPureBuyQuant": "+20000", "individualPureBuyQuant": "-60000",
                       "foreignerHoldRatio": "10.00%"} for d in range(7, 0, -1)]

        fs = CI.flow_summary(trends_small, daily_small)
        fb = CI.flow_summary(trends_big, daily_big)
        self.assertEqual(fs["volumeState"], "PERIOD_VOLUME_MATCHED")
        self.assertEqual(fb["volumeState"], "PERIOD_VOLUME_MATCHED")
        self.assertAlmostEqual(fs["frgnRatioPct"], fb["frgnRatioPct"], places=6)
        self.assertEqual(CAND.flow_score_normalized(fs), CAND.flow_score_normalized(fb))

    def test_period_volume_uses_matching_dates(self):
        """근사(마지막 거래량 × 일수)가 아니라 같은 날짜끼리 합산해야 한다."""
        daily = [{"date": "2026-08-03", "volume": 1_000, "close": 100},
                 {"date": "2026-08-04", "volume": 2_000, "close": 100},
                 {"date": "2026-08-05", "volume": 90_000, "close": 100}]
        trends = [{"bizdate": "20260805", "foreignerPureBuyQuant": "+100",
                   "organPureBuyQuant": "0", "individualPureBuyQuant": "-100"},
                  {"bizdate": "20260804", "foreignerPureBuyQuant": "+100",
                   "organPureBuyQuant": "0", "individualPureBuyQuant": "-100"},
                  {"bizdate": "20260803", "foreignerPureBuyQuant": "+100",
                   "organPureBuyQuant": "0", "individualPureBuyQuant": "-100"}]
        f = CI.flow_summary(trends, daily)
        # 실제 합계 = 1,000 + 2,000 + 90,000 = 93,000
        self.assertEqual(f["periodVolume"], 93_000)
        self.assertEqual(f["volumeMatchDays"], 3)
        # 근사였다면 90,000 × 3 = 270,000이 되어 비율이 3배 가까이 틀렸을 것이다.
        self.assertAlmostEqual(f["frgnRatioPct"], round(300 / 93_000 * 100, 4), places=4)

    def test_no_score_when_volume_unmatched(self):
        """기간 거래량을 못 맞추면 정규화 점수를 만들지 않는다(0으로 채우지 않는다)."""
        self.assertIsNone(CAND.flow_score_normalized(
            flow(1.0, 1.0, state="PERIOD_VOLUME_NOT_AVAILABLE")))
        self.assertIsNone(CAND.flow_score_normalized(None))
        self.assertIsNone(CAND.flow_score_normalized(flow(None, None)))

    def test_direction_is_preserved(self):
        buy = CAND.flow_score_normalized(flow(2.0, 1.0))
        sell = CAND.flow_score_normalized(flow(-2.0, -1.0))
        flat = CAND.flow_score_normalized(flow(0.0, 0.0))
        self.assertGreater(buy, flat)
        self.assertLess(sell, flat)
        self.assertEqual(flat, 50)

    def test_no_double_counting_of_persistence(self):
        """지속일수는 qualityScore가 이미 반영한다. 정규화 점수에서 또 더하지 않는다."""
        base = CAND.flow_score_normalized(flow(1.0, 1.0))
        with_days = dict(flow(1.0, 1.0), foreignBuyDays=6, organBuyDays=6, jointBuyDays=6)
        self.assertEqual(CAND.flow_score_normalized(with_days), base)


class A2RiskDirection(unittest.TestCase):
    """RISK 방향 분리 — 변동성이 방향을 밀지 않아야 한다."""

    def test_volatility_does_not_push_direction(self):
        risk = {"vol20": 9.0, "mdd3m": -40, "reboundFromLow": 0}
        base = {"grade": "high", "penalty": 6, "confidencePenalty": 10, "score": 20}
        sep = CAND.risk_direction_separated(risk, base)
        self.assertEqual(sep["directionPenalty"], 0)
        self.assertTrue(sep["positionCaution"])
        # 신뢰도에는 그대로 반영된다 — 위험을 숨기는 게 아니다.
        self.assertEqual(sep["confidencePenalty"], 10)

    def test_no_upward_vote(self):
        """RISK는 감점을 없앨 뿐 보너스를 주지 않는다."""
        risk = {"vol20": 1.0, "mdd3m": 0, "reboundFromLow": 0}
        base = {"grade": "low", "penalty": 0, "confidencePenalty": 0, "score": 90}
        sep = CAND.risk_direction_separated(risk, base)
        self.assertEqual(sep["directionPenalty"], 0)
        self.assertFalse(sep.get("positionCaution"))

    def test_data_problem_suggests_withhold_not_sell(self):
        """데이터 오류·시세 stale은 SELL이 아니라 판단 보류 후보다."""
        for flag in CAND.DATA_QUALITY_FLAGS:
            sep = CAND.risk_direction_separated(
                {flag: True}, {"grade": "mid", "penalty": 0, "confidencePenalty": 3})
            self.assertTrue(sep["withholdSuggested"], flag)
            self.assertEqual(sep["directionPenalty"], 0, flag)


class A3SellGuard(unittest.TestCase):
    """상승장 SELL Guard 확대 — 변동성 조건에만 기대지 않아야 한다."""

    STRONG_UP = {"trend": "up", "vol": "low", "medianRet5": 3.0, "advanceRatio5": 70.0}
    BEAR = {"stance": "bear"}
    NEU = {"stance": "neu"}

    def test_opens_in_low_volatility_uptrend(self):
        """A0 Guard가 못 잡던 '강한 상승장 + 낮은 변동성'에서도 열린다."""
        g = CAND.expanded_uptrend_sell_guard(
            {"marketRegime": self.STRONG_UP, "relative": {"vsMarket": 1.0, "vsSector": 1.0}},
            self.BEAR, self.BEAR, {"score": 60}, {"sellThreshold": 47})
        self.assertTrue(g["expandedActive"])

    def test_price_axes_count_as_one_vote(self):
        """TARO와 QUANT는 둘 다 가격 기반이라 독립 2표로 세지 않는다."""
        g = CAND.expanded_uptrend_sell_guard(
            {"marketRegime": self.STRONG_UP, "relative": {"vsMarket": 1.0, "vsSector": 1.0}},
            self.BEAR, self.BEAR, {"score": 60}, {"sellThreshold": 47})
        self.assertEqual(g["expandedVotes"], ["가격흐름 약세"])
        self.assertTrue(g["expandedActive"])          # 1표뿐이라 Guard가 열린다

    def test_does_not_block_genuinely_weak_stock(self):
        """상승장이라고 SELL을 전면 금지하지 않는다."""
        g = CAND.expanded_uptrend_sell_guard(
            {"marketRegime": self.STRONG_UP, "relative": {"vsMarket": -5.0, "vsSector": -4.0}},
            self.BEAR, self.NEU, {"score": 30}, {"sellThreshold": 47})
        self.assertFalse(g["expandedActive"])
        self.assertGreaterEqual(len(g["expandedVotes"]), 2)

    def test_inactive_outside_strong_uptrend(self):
        for regime in ({"trend": "down", "medianRet5": -3.0, "advanceRatio5": 20.0},
                       {"trend": "side", "medianRet5": 0.1, "advanceRatio5": 50.0},
                       {"trend": "up", "medianRet5": 0.5, "advanceRatio5": 52.0}):
            g = CAND.expanded_uptrend_sell_guard(
                {"marketRegime": regime, "relative": {}},
                self.BEAR, self.BEAR, None, {"sellThreshold": 47})
            self.assertFalse(g["expandedActive"], regime)


class A4MaSlope(unittest.TestCase):
    """MA 기울기 — 작은 보조장치여야 한다."""

    def test_adjustment_stays_small(self):
        """새 큰 점수를 만들지 않는다. 최대 ±2점."""
        for tech in ({"price": 110, "ma20": 100, "ma20Slope": -1.0, "ma20Full": True},
                     {"price": 90, "ma20": 100, "ma20Slope": 1.0, "ma20Full": True},
                     {"price": 110, "ma20": 100, "ma20Slope": 5.0, "ma20Full": True}):
            adj = CAND.ma_slope_confirmation(tech, 50)["adjust"]
            self.assertLessEqual(abs(adj), CAND.MA_SLOPE_MAX_ADJUST)

    def test_states(self):
        above_falling = CAND.ma_slope_confirmation(
            {"price": 110, "ma20": 100, "ma20Slope": -1.0, "ma20Full": True}, 50)
        self.assertEqual(above_falling["state"], "ABOVE_BUT_FALLING")
        self.assertLess(above_falling["adjust"], 0)

        below_rising = CAND.ma_slope_confirmation(
            {"price": 90, "ma20": 100, "ma20Slope": 1.0, "ma20Full": True}, 50)
        self.assertEqual(below_rising["state"], "BELOW_BUT_RISING")
        self.assertGreater(below_rising["adjust"], 0)

        confirmed = CAND.ma_slope_confirmation(
            {"price": 110, "ma20": 100, "ma20Slope": 1.0, "ma20Full": True}, 50)
        self.assertEqual(confirmed["state"], "CONFIRMED")
        self.assertEqual(confirmed["adjust"], 0.0)

    def test_warmup_excluded(self):
        """20일선이 완성되기 전에는 쓰지 않는다(TARO 성숙도 원칙과 동일)."""
        c = CAND.ma_slope_confirmation(
            {"price": 110, "ma20": 100, "ma20Slope": -1.0, "ma20Full": False}, 50)
        self.assertEqual(c["state"], "MA_SLOPE_WARMUP")
        self.assertEqual(c["adjust"], 0.0)

    def test_missing_data_is_not_zero_filled(self):
        c = CAND.ma_slope_confirmation({"price": 110, "ma20": None, "ma20Slope": None}, 50)
        self.assertEqual(c["state"], "MA_SLOPE_NOT_AVAILABLE")
        self.assertEqual(c["adjust"], 0.0)


class ProductionIsolation(unittest.TestCase):
    """후보는 Production 판단을 바꾸지 않는다."""

    def test_analyze_auto_does_not_import_candidates(self):
        """검증을 통과하기 전에는 기본모델이 후보를 쓰지 않는다."""
        src = open("analyze_auto.py", encoding="utf-8").read()
        self.assertNotIn("import base_model_candidates", src)

    def test_flow_summary_keeps_legacy_fields(self):
        """A0가 쓰던 기존 필드를 없애지 않았다(호환성)."""
        daily = [{"date": f"2026-08-{d:02d}", "volume": 1000, "close": 100} for d in range(1, 8)]
        trends = [{"bizdate": f"202608{d:02d}", "foreignerPureBuyQuant": "+10",
                   "organPureBuyQuant": "+5", "individualPureBuyQuant": "-15",
                   "foreignerHoldRatio": "10.00%"} for d in range(7, 0, -1)]
        f = CI.flow_summary(trends, daily)
        for field in ("frgnSum", "orgSum", "indiSum", "days", "qualityScore",
                      "flowRatioPct", "divergence", "holdNow", "holdBefore"):
            self.assertIn(field, f, field)


if __name__ == "__main__":
    unittest.main(verbosity=2)
