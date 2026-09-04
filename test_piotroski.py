#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Piotroski F-Score 계약 테스트 (2026-09-04 신설).

핵심 계약:
  - 신호를 하나라도 못 구하면 score는 None이다("F-Score 7점"이라고 부르지 않는다).
  - 없는 값을 0으로 만들지 않는다.
  - 금융업처럼 개념 자체가 없는 항목은 결측과 구분한다.
  - 논문과 다른 계산은 PAPER_EXACT라고 부르지 않는다.
"""
import unittest
import piotroski as PF
import dart_pipeline as P


def firm(**kw):
    """전 항목이 채워진 정상 회사. 필요한 값만 덮어쓴다."""
    base = {
        "revenue": 1000, "costOfSales": 600, "grossProfit": 400,
        "operatingIncome": 200, "netIncome": 100,
        "totalAssets": 2000, "totalLiabilities": 800, "totalEquity": 1200,
        "operatingCashFlow": 150, "investingCashFlow": -50,
        "sgaExpenses": 150, "interestExpense": 20,
        "currentAssets": 900, "currentLiabilities": 300,
        "nonCurrentLiabilities": 500, "issuedCapital": 100,
    }
    base.update(kw)
    return base


class Completeness(unittest.TestCase):
    def test_all_nine_signals_give_a_score(self):
        out = PF.compute(firm(), firm(totalAssets=1900, netIncome=80), firm(totalAssets=1800))
        self.assertTrue(out["complete"])
        self.assertEqual(out["decidedSignals"], 9)
        self.assertIsNotNone(out["score"])
        self.assertGreaterEqual(out["score"], 0)
        self.assertLessEqual(out["score"], 9)

    def test_two_fiscal_years_are_not_enough(self):
        """⭐ 회계연도 2개로는 F-Score를 완성할 수 없다(논문 분모가 기초 총자산이라서)."""
        out = PF.compute(firm(), firm(totalAssets=1900))
        self.assertIsNone(out["score"])
        self.assertEqual(out["fiscalYearsRequired"], 3)
        self.assertEqual(out["fiscalYearsUsed"], 2)
        self.assertIn("dTurnoverUp", out["missing"])
        self.assertIn("dRoaPositive", out["missing"])

    def test_missing_signal_refuses_to_report_a_score(self):
        """⭐ 핵심. 9개를 다 못 채우면 점수를 만들지 않는다."""
        cur = firm(); del cur["operatingCashFlow"]
        out = PF.compute(cur, firm(totalAssets=1900), firm(totalAssets=1800))
        self.assertIsNone(out["score"], "신호가 빠졌는데 점수를 냈다")
        self.assertFalse(out["complete"])
        self.assertIn("cfoPositive", out["missing"])
        self.assertIsNone(out["signals"]["cfoPositive"])

    def test_missing_value_is_not_treated_as_zero(self):
        """없는 값을 0으로 보면 'CFO가 0이라 음수 아님'처럼 잘못된 판정이 나온다."""
        cur = firm(operatingCashFlow=PF.NOT_AVAILABLE)
        out = PF.compute(cur, firm(totalAssets=1900), firm(totalAssets=1800))
        self.assertIsNone(out["signals"]["cfoPositive"])
        self.assertIn("cfoPositive", out["missing"])

    def test_zero_is_a_real_value_not_missing(self):
        """0은 결측이 아니다 — 순이익 0은 'ROA>0 아님'으로 판정돼야 한다."""
        out = PF.compute(firm(netIncome=0), firm(totalAssets=1900, netIncome=-10),
                         firm(totalAssets=1800))
        self.assertIs(out["signals"]["roaPositive"], False)
        self.assertNotIn("roaPositive", out["missing"])


class SignalCorrectness(unittest.TestCase):
    def test_roa_uses_prior_year_total_assets(self):
        """논문은 기초(직전기말) 총자산을 분모로 쓴다."""
        out = PF.compute(firm(netIncome=1), firm(totalAssets=1000), firm(totalAssets=900))
        self.assertIs(out["signals"]["roaPositive"], True)
        self.assertIn("직전기말", out["reasons"]["roaPositive"])

    def test_accrual_quality_needs_cfo_above_roa(self):
        # CFO/자산 = 150/1900, ROA = 100/1900 → CFO가 더 크다 → True
        out = PF.compute(firm(), firm(totalAssets=1900), firm(totalAssets=1800))
        self.assertIs(out["signals"]["accrualQuality"], True)
        # 이익이 현금보다 크면 발생액이 양수 → False
        out2 = PF.compute(firm(netIncome=300), firm(totalAssets=1900), firm(totalAssets=1800))
        self.assertIs(out2["signals"]["accrualQuality"], False)

    def test_liquidity_compares_current_ratio(self):
        # 올해 900/300=3.0 vs 작년 800/400=2.0 → 개선
        out = PF.compute(firm(), firm(totalAssets=1900, currentAssets=800, currentLiabilities=400),
                         firm(totalAssets=1800))
        self.assertIs(out["signals"]["dLiquidityUp"], True)

    def test_equity_offer_detects_capital_increase(self):
        out = PF.compute(firm(issuedCapital=120), firm(totalAssets=1900, issuedCapital=100),
                         firm(totalAssets=1800))
        self.assertIs(out["signals"]["noEquityOffer"], False, "자본금이 늘었는데 증자 없음으로 봤다")
        out2 = PF.compute(firm(issuedCapital=100), firm(totalAssets=1900, issuedCapital=100),
                          firm(totalAssets=1800))
        self.assertIs(out2["signals"]["noEquityOffer"], True)

    def test_margin_falls_back_to_revenue_minus_cost(self):
        """매출총이익 계정이 없어도 매출-매출원가로 구할 수 있어야 한다."""
        cur = firm(); del cur["grossProfit"]
        pri = firm(totalAssets=1900, costOfSales=700); del pri["grossProfit"]
        out = PF.compute(cur, pri, firm(totalAssets=1800))
        # 올해 마진 400/1000=0.40 vs 작년 300/1000=0.30 → 개선
        self.assertIs(out["signals"]["dMarginUp"], True)


class SectorHandling(unittest.TestCase):
    def test_financial_sector_concepts_are_not_counted_as_missing(self):
        """금융업은 유동/비유동·매출총이익 개념이 원래 없다. 결측과 구분해야 한다."""
        na = PF.NOT_APPLICABLE
        cur = firm(currentAssets=na, currentLiabilities=na,
                   nonCurrentLiabilities=na, grossProfit=na, costOfSales=na, revenue=na)
        pri = dict(cur, totalAssets=1900)
        out = PF.compute(cur, pri, dict(pri, totalAssets=1800))
        for sig in ("dLiquidityUp", "dLeverageDown", "dMarginUp", "dTurnoverUp"):
            self.assertIn(sig, out["notApplicable"], f"{sig}이 결측으로 잘못 분류됐다")
            self.assertNotIn(sig, out["missing"])
        self.assertIsNone(out["score"], "개념이 없는 신호가 있으면 9점 만점 점수를 내면 안 된다")
        self.assertEqual(out["sectorHandling"], "FINANCIAL_SECTOR_SPECIAL_HANDLING_REQUIRED")


class HonestLabelling(unittest.TestCase):
    def test_proxy_signals_are_declared(self):
        """논문과 다른 계산은 PAPER_EXACT라고 부르지 않는다."""
        self.assertEqual(PF.SIGNAL_BASIS["dLeverageDown"], "GAEO_PROXY")
        self.assertEqual(PF.SIGNAL_BASIS["noEquityOffer"], "GAEO_PROXY")

    def test_result_is_never_labelled_paper_exact_today(self):
        """비유동부채·자본금 대체를 쓰는 한 전체를 PAPER_EXACT라고 부를 수 없다."""
        out = PF.compute(firm(), firm(totalAssets=1900), firm(totalAssets=1800))
        self.assertEqual(out["basis"], "GAEO_PROXY")

    def test_accounts_needed_are_actually_collected(self):
        """계산에 쓰는 계정이 DART 수집 목록에 실제로 있어야 한다."""
        for key in ("currentAssets", "currentLiabilities", "nonCurrentLiabilities",
                    "issuedCapital", "netIncome", "totalAssets", "operatingCashFlow",
                    "revenue", "grossProfit", "costOfSales"):
            self.assertIn(key, P.FINANCIAL_TARGETS, f"{key}가 수집 목록에 없다")


if __name__ == "__main__":
    unittest.main(verbosity=2)
