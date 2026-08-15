#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Research Shadow Engine (research_v1.0) 불변식 테스트.

PHASE C 규칙이 코드로 지켜지는지 검사한다. 성능은 검사하지 않는다.
"""
import unittest
import research_engine as R


def _entry(**over):
    base = {
        "price": 10000, "stale": False, "per": 12.0, "pbr": 1.1, "roe": 9.0,
        "tech": {"close": 10000, "ma5Gap": 1.0, "ma20Gap": 2.0, "ma60Gap": 3.0,
                 "ma120Gap": 4.0, "ma200Gap": 5.0, "rsi14": 55.0, "macd": 120,
                 "macdSignal": 80, "volRatio": 1.2,
                 "cross20_60": {"event": "golden", "daysAgo": 3}},
        "risk": {"vol20": 2.0, "mdd3m": -12.0, "pos52w": 60, "grade": "low"},
        "flow": {"flowRatioPct": 1.5, "foreignBuyDays": 3, "organBuyDays": 3,
                 "days": 5, "divergence": "accumulation"},
        "relative": {"ret5": 2.0, "vsSector": 1.0, "sectorPercentile": 70},
    }
    base.update(over)
    return base


PIT = {"n": 50000, "w": 24700, "baseRate": 0.494, "asof": "2026-08-14",
       "lastOutcomeDate": "2026-08-13", "horizon": 5}


class VersionFreeze(unittest.TestCase):
    def test_version_fields_present(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for k in ("researchModelVersion", "featureVersion", "labelVersion", "configHash"):
            self.assertTrue(out.get(k), f"{k} 누락")
        self.assertEqual(out["researchModelVersion"], "research_v1.0")

    def test_config_hash_stable(self):
        self.assertEqual(R.config_hash(), R.config_hash())

    def test_created_and_input_timestamp_preserved(self):
        out = R.predict(_entry(), {}, PIT, "2026-08-15T10:00:00+09:00", "2026-08-14 종가")
        self.assertEqual(out["createdAt"], "2026-08-15T10:00:00+09:00")
        self.assertEqual(out["inputTimestamp"], "2026-08-14 종가")


class PointInTime(unittest.TestCase):
    def test_quant_stats_asof_recorded(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(out["quantStatsAsof"], "2026-08-14")

    def test_pit_excludes_future_outcomes(self):
        data = {"stocks": {"A": {"daily": [
            {"date": f"2026-01-{d:02d}", "close": 100 + d} for d in range(1, 21)]}}}
        early = R.build_pit_quant_stats(data, "2026-01-10", horizon=5)
        late = R.build_pit_quant_stats(data, "2026-01-20", horizon=5)
        self.assertLess(early["n"], late["n"], "시점이 이를수록 표본이 적어야 한다")
        self.assertLess(early["lastOutcomeDate"], "2026-01-10", "asof 이후 결과가 섞였다")
        self.assertLess(late["lastOutcomeDate"], "2026-01-20", "asof 이후 결과가 섞였다")


class QuantIsReferee(unittest.TestCase):
    def test_quant_produces_no_score(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        q = out["quant"]
        self.assertFalse(q["producesScore"], "QUANT는 점수를 내면 안 된다")
        self.assertEqual(q["role"], "STATISTICAL_REFEREE")
        self.assertNotIn("score", q)

    def test_quant_not_in_chief_weights(self):
        self.assertNotIn("nova", R.MODEL_C_WEIGHTS)
        self.assertNotIn("quant", R.MODEL_C_WEIGHTS)

    def test_legacy_29pct_not_redistributed(self):
        """QUANT 지분을 다른 분석가에 임의 재배분하지 않았는지.
        Legacy(taro .28 / diana .12 / nova .29 / flow .31)와 비율이 달라야 정상."""
        self.assertEqual(set(R.MODEL_C_WEIGHTS), {"taro", "diana", "flow"})
        self.assertAlmostEqual(sum(R.MODEL_C_WEIGHTS.values()), 1.0, places=6)


class MissingIsNotNeutral(unittest.TestCase):
    def test_event_not_scored_as_neutral(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        ev = out["analysts"]["event"]
        self.assertEqual(ev["status"], "EVENT_NOT_IMPLEMENTED")
        self.assertNotIn("score", ev)
        for cand in out["horizons"]["5"]["candidates"].values():
            self.assertNotIn("event", cand.get("usedAnalysts", []))

    def test_diana_partial_not_zero_filled(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        d = out["analysts"]["diana"]
        self.assertEqual(d["status"], "DIANA_RESEARCH_PARTIAL")
        self.assertEqual(d["coverage"], "VALUE_ONLY_DIANA")
        for f in ("grossProfitability", "accruals", "leverage"):
            self.assertIn(f, d["missing"], f"{f}는 NOT_AVAILABLE로 남아야 한다")

    def test_diana_missing_value_not_scored_zero(self):
        """PER/PBR/ROE가 전부 없으면 0점이 아니라 NOT_AVAILABLE이어야 한다."""
        d = R.diana_research({"per": None, "pbr": None, "roe": None})
        self.assertEqual(d["status"], "NOT_AVAILABLE")
        self.assertIsNone(d["score"])

    def test_risk_missing_dimension_not_safe(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        dims = out["risk"]["dimensions"]
        self.assertEqual(dims["financialDistress"], "NOT_AVAILABLE")
        self.assertEqual(dims["eventRisk"], "NOT_AVAILABLE")


class RiskHardGate(unittest.TestCase):
    def test_stale_price_triggers_hard_gate(self):
        out = R.predict(_entry(stale=True), {}, PIT, "T0", "P0")
        self.assertTrue(out["risk"]["hardGate"])
        self.assertEqual(out["risk"]["state"], "JUDGMENT_WITHHELD")
        for h in ("5", "20", "60"):
            self.assertEqual(out["horizons"][h]["primaryAction"], "JUDGMENT_WITHHELD")

    def test_missing_price_triggers_hard_gate(self):
        out = R.predict(_entry(price=None), {}, PIT, "T0", "P0")
        self.assertTrue(out["risk"]["hardGate"])

    def test_chief_cannot_override_hard_gate(self):
        """아무리 좋은 점수여도 Hard Gate면 BUY가 나오면 안 된다."""
        strong = _entry(stale=True)
        strong["tech"].update({"ma5Gap": 20, "ma20Gap": 20, "rsi14": 80, "macd": 900,
                               "macdSignal": 100, "volRatio": 3.0})
        out = R.predict(strong, {}, PIT, "T0", "P0")
        for h in ("5", "20", "60"):
            self.assertNotIn("BUY", out["horizons"][h]["primaryAction"])


class HorizonMaturity(unittest.TestCase):
    def test_all_horizons_present(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(set(out["horizons"]), {"5", "20", "60"})

    def test_fresh_prediction_is_pending(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for h in ("5", "20", "60"):
            self.assertEqual(out["horizons"][h]["maturity"], "PENDING_NOT_MATURED")
            self.assertEqual(out["horizons"][h]["performanceStatus"],
                             "PERFORMANCE_NOT_YET_MATURED")

    def test_probability_marked_uncalibrated(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for h in ("5", "20", "60"):
            self.assertFalse(out["horizons"][h]["probabilityCalibrated"])

    def test_horizons_use_different_features(self):
        """단기 반전과 중기 모멘텀을 한 점수에서 상쇄시키지 않는다."""
        self.assertNotEqual(set(R.HORIZON_TARO_SPEC[5]), set(R.HORIZON_TARO_SPEC[60]))
        self.assertIn("ret5", R.HORIZON_TARO_SPEC[5])
        self.assertNotIn("ret5", R.HORIZON_TARO_SPEC[60])


class ChiefCandidates(unittest.TestCase):
    def test_parallel_candidates_exist(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        c = out["horizons"]["5"]["candidates"]
        self.assertIn("MODEL_B_equalWeight", c)
        self.assertIn("MODEL_C_preDeclared", c)
        self.assertEqual(c["MODEL_D_metaModel"]["status"], "NOT_BUILT_INSUFFICIENT_DATA")

    def test_abstain_when_no_input(self):
        bare = {"price": 10000, "stale": False, "tech": {"close": 10000}}
        out = R.predict(bare, {}, PIT, "T0", "P0")
        self.assertIn(out["horizons"]["5"]["primaryAction"], ("ABSTAIN", "JUDGMENT_WITHHELD"))

    def test_reliability_separate_from_probability(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertIn(out["reliability"]["grade"], list("ABCDF"))
        self.assertNotIn("probability", out["reliability"])


class NoNullLeaks(unittest.TestCase):
    def test_output_json_serializable_and_finite(self):
        import json, math
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        text = json.dumps(out, ensure_ascii=False)
        self.assertNotIn("NaN", text)
        self.assertNotIn("Infinity", text)

        def walk(o):
            if isinstance(o, dict):
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
            elif isinstance(o, float):
                self.assertTrue(math.isfinite(o), "NaN/Inf 발견")
        walk(out)

    def test_us_validation_flagged_unavailable(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(out["usValidation"], "US_VALIDATION_NOT_AVAILABLE")


if __name__ == "__main__":
    unittest.main(verbosity=1)
