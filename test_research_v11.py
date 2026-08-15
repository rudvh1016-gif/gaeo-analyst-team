#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PHASE C FINAL HARDENING 불변식 테스트 (research_v1.1 + APPEND-ONLY 가드).

성능은 검사하지 않는다. 방법론 규칙이 코드로 지켜지는지만 검사한다.
"""
import copy
import unittest

import append_only_guard as G
import research_engine as V10
import research_engine_v11 as R


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
        "relative": {"ret5": 6.0, "vsSector": 1.0, "sectorPercentile": 70},
    }
    base.update(over)
    return base


PIT = {h: {"n": 50000, "w": 24700, "baseRate": 0.494, "asof": "2026-08-14",
           "lastOutcomeDate": "2026-08-13", "horizon": int(h),
           "latestExcludedStartDate": None,
           "outcomeMaturityRule": "OUTCOME_DATE_STRICTLY_BEFORE_ASOF"}
       for h in ("5", "20", "60")}


class V10Untouched(unittest.TestCase):
    """research_v1.0은 이번 수정으로 절대 바뀌면 안 된다."""

    def test_v10_version_and_hash_unchanged(self):
        self.assertEqual(V10.RESEARCH_MODEL_VERSION, "research_v1.0")
        self.assertEqual(V10.FEATURE_VERSION, "features_v1.0")
        self.assertEqual(V10.config_hash(), "e37e6cc0cb701171")

    def test_v10_still_uses_negative_ret5_at_5d(self):
        """v1.0의 -net5 구조는 이미 생성된 버전이므로 그대로 보존한다."""
        tech = {"close": 10000, "ma5Gap": 0.0, "rsi14": 50.0,
                "macd": 0, "macdSignal": 0, "volRatio": 1.0}
        up = V10.taro_research(tech, {"ret5": 10.0}, 5)["parts"]["ret5"]
        self.assertLess(up, 0, "v1.0은 5D에서 ret5 부호를 뒤집어야 한다")

    def test_v11_import_does_not_mutate_v10(self):
        self.assertEqual(V10.MODEL_C_WEIGHTS, {"taro": 0.45, "flow": 0.35, "diana": 0.20})
        self.assertEqual(V10.HORIZON_TARO_SPEC[5],
                         ("ma5Gap", "ret5", "rsi14", "macdHist", "volRatio"))

    def test_versions_are_independent(self):
        self.assertNotEqual(R.RESEARCH_MODEL_VERSION, V10.RESEARCH_MODEL_VERSION)
        self.assertNotEqual(R.config_hash(), V10.config_hash())


class ShortSignalIsCandidateNotDefinition(unittest.TestCase):
    """5D = -net5를 확정 정의로 쓰지 않는다."""

    def test_both_short_modes_exist(self):
        self.assertEqual(set(R.SHORT_SIGNAL_MODES),
                         {"SHORT_REVERSAL_CANDIDATE", "SHORT_MOMENTUM_CANDIDATE"})

    def test_modes_have_opposite_ret5_sign(self):
        tech = {"close": 10000, "ma5Gap": 0.0, "rsi14": 50.0,
                "macd": 0, "macdSignal": 0, "volRatio": 1.0}
        rev = R.taro_research(tech, {"ret5": 10.0}, 5, "SHORT_REVERSAL_CANDIDATE")["parts"]["ret5"]
        mom = R.taro_research(tech, {"ret5": 10.0}, 5, "SHORT_MOMENTUM_CANDIDATE")["parts"]["ret5"]
        self.assertLess(rev, 0)
        self.assertGreater(mom, 0)
        self.assertAlmostEqual(rev, -mom, places=9)

    def test_no_silent_default_mode(self):
        """코드가 몰래 한쪽을 정답으로 고르지 않는다."""
        with self.assertRaises(TypeError):
            R.taro_research({}, {}, 5)
        with self.assertRaises(ValueError):
            R.taro_research({}, {}, 5, "SOMETHING_ELSE")

    def test_both_modes_predicted_live(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        modes = {c["shortSignalMode"] for c in out["candidates"].values()}
        self.assertEqual(modes, set(R.SHORT_SIGNAL_MODES))

    def test_modes_actually_differ_at_5d(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        rev = out["candidates"]["MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE"]["horizons"]["5"]["score"]
        mom = out["candidates"]["MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE"]["horizons"]["5"]["score"]
        self.assertNotEqual(rev, mom, "ret5가 있는데 두 모드 점수가 같으면 분리가 안 된 것")

    def test_short_mode_not_applied_beyond_5d(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for cid, c in out["candidates"].items():
            for h in ("20", "60"):
                self.assertEqual(c["horizons"][h]["shortSignalMode"], "NOT_APPLICABLE")

    def test_conditional_liquidity_candidate_registered_not_built(self):
        c = R.REGISTERED_UNBUILT_CANDIDATES["CONDITIONAL_SHORT_LIQUIDITY_CANDIDATE"]
        self.assertEqual(c["status"], "REGISTERED_NOT_IMPLEMENTED")
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertNotIn("CONDITIONAL_SHORT_LIQUIDITY_CANDIDATE", out["candidates"])


class WeightsAreNotValidated(unittest.TestCase):
    """45/35/20을 검증된 Weight나 대표모델로 표현하지 않는다."""

    def test_predeclared_naming(self):
        self.assertIn("PREDECLARED_CANDIDATE_45_35_20", R.CHIEF_SCHEMES)
        self.assertEqual(R.CHIEF_SCHEMES["PREDECLARED_CANDIDATE_45_35_20"],
                         {"taro": 0.45, "flow": 0.35, "diana": 0.20})

    def test_no_representative_model(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(out["primarySelection"], "NO_PRIMARY_CANDIDATE_SELECTED")
        self.assertNotIn("primaryAction", out)
        for c in out["candidates"].values():
            self.assertFalse(c["isRepresentativeModel"])
            self.assertEqual(c["status"], "PREDECLARED_UNVALIDATED")

    def test_no_horizon_level_primary_action(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for c in out["candidates"].values():
            for hv in c["horizons"].values():
                self.assertNotIn("primaryAction", hv)


class CandidatesStoredTogether(unittest.TestCase):
    """모든 Candidate가 같은 Prediction timestamp에 함께 저장된다."""

    def test_all_four_candidates_present(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(set(out["candidates"]), {
            "MODEL_B_EQUAL_WEIGHT__SHORT_REVERSAL_CANDIDATE",
            "MODEL_B_EQUAL_WEIGHT__SHORT_MOMENTUM_CANDIDATE",
            "PREDECLARED_CANDIDATE_45_35_20__SHORT_REVERSAL_CANDIDATE",
            "PREDECLARED_CANDIDATE_45_35_20__SHORT_MOMENTUM_CANDIDATE",
        })

    def test_same_prediction_timestamp(self):
        out = R.predict(_entry(), {}, PIT, "2026-08-15T09:00:00+09:00", "2026-08-14 종가")
        stamps = {c["predictionTimestamp"] for c in out["candidates"].values()}
        inputs = {c["inputTimestamp"] for c in out["candidates"].values()}
        self.assertEqual(stamps, {"2026-08-15T09:00:00+09:00"})
        self.assertEqual(inputs, {"2026-08-14 종가"})

    def test_required_metadata_per_candidate(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        need = ("candidateModelId", "predictionTimestamp", "modelVersion",
                "featureVersion", "labelVersion", "inputTimestamp", "configHash")
        for cid, c in out["candidates"].items():
            for k in need:
                self.assertTrue(c.get(k), f"{cid}에 {k} 누락")
            self.assertEqual(set(c["horizons"]), {"5", "20", "60"})
            for h, hv in c["horizons"].items():
                self.assertEqual(hv["maturity"], "PENDING_NOT_MATURED")
                self.assertEqual(hv["performanceStatus"], "PERFORMANCE_NOT_YET_MATURED")
                self.assertFalse(hv["probabilityCalibrated"])

    def test_meta_model_still_not_built(self):
        self.assertEqual(R.REGISTERED_UNBUILT_CANDIDATES["MODEL_D_META_MODEL"]["status"],
                         "NOT_BUILT_INSUFFICIENT_DATA")


class ReliabilitySuppressed(unittest.TestCase):
    def test_state_is_not_differentiated(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        rel = out["reliability"]
        self.assertEqual(rel["status"], "RELIABILITY_NOT_DIFFERENTIATED")
        self.assertEqual(rel["uiDisplay"], "SUPPRESSED")

    def test_grade_not_exposed_as_plain_field(self):
        """'grade'라는 이름으로 그대로 내보내면 UI가 무심코 쓸 수 있다."""
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertNotIn("grade", out["reliability"])
        self.assertIn("internalGrade", out["reliability"])


class PitOutcomeMaturity(unittest.TestCase):
    """Prediction 시작일이 아니라 '결과 확정일'까지 asof 이전이어야 한다."""

    @staticmethod
    def _data():
        return {"stocks": {"A": {"daily": [
            {"date": f"2026-03-{d:02d}", "close": 100 + d} for d in range(1, 29)]}}}

    def test_outcome_after_asof_is_excluded(self):
        data = self._data()
        # asof 03-15 · horizon 20 → 시작일이 03-01이어도 결과일이 03-21이라 미성숙
        st = R.build_pit_quant_stats(data, "2026-03-15", horizon=20)
        self.assertEqual(st["n"], 0, "결과가 안 끝난 구간이 표본에 들어갔다")
        self.assertIsNotNone(st["latestExcludedStartDate"],
                             "시작일은 과거인데 결과가 미래인 구간이 실제로 있어야 하는 테스트다")
        self.assertLess(st["latestExcludedStartDate"], "2026-03-15")

    def test_matured_windows_are_included(self):
        data = self._data()
        st = R.build_pit_quant_stats(data, "2026-03-28", horizon=20)
        self.assertGreater(st["n"], 0)
        self.assertLess(st["lastOutcomeDate"], "2026-03-28")

    def test_every_horizon_blocked_independently(self):
        data = self._data()
        for h in (5, 20, 60):
            st = R.build_pit_quant_stats(data, "2026-03-20", horizon=h)
            if st["lastOutcomeDate"] is not None:
                self.assertLess(st["lastOutcomeDate"], "2026-03-20",
                                f"{h}D에서 asof 이후 결과가 섞였다")

    def test_longer_horizon_never_sees_more_recent_outcome(self):
        """20D 표가 5D 표보다 최신 결과를 알고 있으면 안 된다."""
        data = self._data()
        s5 = R.build_pit_quant_stats(data, "2026-03-28", horizon=5)
        s20 = R.build_pit_quant_stats(data, "2026-03-28", horizon=20)
        self.assertLess(s5["lastOutcomeDate"], "2026-03-28")
        self.assertLess(s20["lastOutcomeDate"], "2026-03-28")

    def test_per_horizon_tables_are_separate(self):
        data = self._data()
        allst = R.build_pit_quant_stats_all(data, "2026-03-28")
        self.assertEqual(set(allst), {"5", "20", "60"})
        self.assertNotEqual(allst["5"]["n"], allst["20"]["n"],
                            "5D 표를 20D에 그대로 돌려쓰고 있다")
        for h, st in allst.items():
            self.assertEqual(st["horizon"], int(h))

    def test_rule_recorded_in_output(self):
        st = R.build_pit_quant_stats(self._data(), "2026-03-28", horizon=5)
        self.assertEqual(st["outcomeMaturityRule"], "OUTCOME_DATE_STRICTLY_BEFORE_ASOF")

    def test_asof_recorded_on_every_horizon_prediction(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        for c in out["candidates"].values():
            for h, hv in c["horizons"].items():
                self.assertEqual(hv["quantStatsAsof"], "2026-08-14")


class HardeningKeepsV10Invariants(unittest.TestCase):
    """v1.0에서 지키던 규칙이 v1.1에서도 그대로 지켜지는지."""

    def test_event_not_neutral(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        ev = out["analysts"]["event"]
        self.assertEqual(ev["status"], "EVENT_NOT_IMPLEMENTED")
        self.assertNotIn("score", ev)
        for c in out["candidates"].values():
            for hv in c["horizons"].values():
                self.assertNotIn("event", hv["usedAnalysts"])

    def test_diana_partial(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        d = out["analysts"]["diana"]
        self.assertEqual(d["status"], "DIANA_RESEARCH_PARTIAL")
        self.assertEqual(d["coverage"], "VALUE_ONLY_DIANA")
        for f in ("grossProfitability", "accruals", "leverage"):
            self.assertIn(f, d["missing"])

    def test_risk_missing_not_safe(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        dims = out["risk"]["dimensions"]
        self.assertEqual(dims["financialDistress"], "NOT_AVAILABLE")
        self.assertEqual(dims["eventRisk"], "NOT_AVAILABLE")

    def test_hard_gate_blocks_every_candidate(self):
        strong = _entry(stale=True)
        strong["tech"].update({"ma5Gap": 20, "ma20Gap": 20, "rsi14": 80,
                               "macd": 900, "macdSignal": 100, "volRatio": 3.0})
        out = R.predict(strong, {}, PIT, "T0", "P0")
        self.assertTrue(out["risk"]["hardGate"])
        for c in out["candidates"].values():
            for hv in c["horizons"].values():
                self.assertEqual(hv["action"], "JUDGMENT_WITHHELD")

    def test_quant_produces_no_score_per_horizon(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(set(out["quant"]), {"5", "20", "60"})
        for h, q in out["quant"].items():
            self.assertFalse(q["producesScore"])
            self.assertNotIn("score", q)
            self.assertEqual(q["role"], "STATISTICAL_REFEREE")

    def test_short_mode_does_not_change_analyst_availability(self):
        e = _entry()
        tech = dict(e["tech"]); tech["_risk"] = e["risk"]
        a = R.taro_research(tech, e["relative"], 5, "SHORT_REVERSAL_CANDIDATE")
        b = R.taro_research(tech, e["relative"], 5, "SHORT_MOMENTUM_CANDIDATE")
        self.assertEqual(a["used"], b["used"])
        self.assertEqual(a["missing"], b["missing"])

    def test_no_nan_or_infinity(self):
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
                self.assertTrue(math.isfinite(o))
        walk(out)

    def test_us_validation_unavailable(self):
        out = R.predict(_entry(), {}, PIT, "T0", "P0")
        self.assertEqual(out["usValidation"], "US_VALIDATION_NOT_AVAILABLE")

    def test_abstain_when_no_input(self):
        out = R.predict({"price": 10000, "stale": False, "tech": {"close": 10000}},
                        {}, PIT, "T0", "P0")
        for c in out["candidates"].values():
            for hv in c["horizons"].values():
                self.assertIn(hv["action"], ("ABSTAIN", "JUDGMENT_WITHHELD"))


class AppendOnlyGuard(unittest.TestCase):
    """실제로 한 번 일어난 위반(과거 기록에 null 키 삽입)을 자동으로 잡는다."""

    @staticmethod
    def _hist():
        return {"005930": [
            {"date": "2026-08-10", "call": "BUY",
             "research": {"modelVersion": "research_v1.0", "configHash": "abc",
                          "createdAt": "2026-08-10T00:00:00Z", "source": "live_shadow_oos"}},
            {"date": "2026-08-11", "call": "HOLD",
             "researchV11": {"modelVersion": "research_v1.1", "configHash": "def",
                             "candidates": {"X": {"horizons": {"5": {"action": "HOLD_WATCH"}}}},
                             "source": "live_shadow_oos"}},
        ]}

    def test_clean_run_has_no_violation(self):
        h = self._hist()
        before = G.snapshot(h)
        h["005930"].append({"date": "2026-08-12", "call": "SELL",
                            "research": {"modelVersion": "research_v1.0"}})
        self.assertEqual(G.verify(before, G.snapshot(h)), [])

    def test_null_key_injection_detected(self):
        """이번에 실제로 발견된 위반 형태 그대로."""
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][0]["research"]["sectorWinRate"] = None
        v = G.verify(before, G.snapshot(h))
        self.assertEqual(len(v), 1)
        self.assertEqual(v[0]["kind"], "VALUE_CHANGED")

    def test_value_rewrite_detected(self):
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][1]["researchV11"]["candidates"]["X"]["horizons"]["5"]["action"] = "BUY_CONSIDER"
        v = G.verify(before, G.snapshot(h))
        self.assertEqual([x["kind"] for x in v], ["VALUE_CHANGED"])

    def test_version_rewrite_detected(self):
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][0]["research"]["modelVersion"] = "research_v1.1"
        self.assertEqual([x["kind"] for x in G.verify(before, G.snapshot(h))], ["VALUE_CHANGED"])

    def test_timestamp_rewrite_detected(self):
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][0]["research"]["createdAt"] = "2026-08-15T00:00:00Z"
        self.assertEqual([x["kind"] for x in G.verify(before, G.snapshot(h))], ["VALUE_CHANGED"])

    def test_field_and_record_deletion_detected(self):
        h = self._hist()
        before = G.snapshot(h)
        del h["005930"][0]["research"]
        kinds = {x["kind"] for x in G.verify(before, G.snapshot(h))}
        self.assertEqual(kinds, {"RECORD_DELETED"})

        h2 = self._hist()
        before2 = G.snapshot(h2)
        h2["005930"][1]["research"] = {"modelVersion": "research_v1.0"}   # 다른 키만 추가
        del h2["005930"][0]["research"]["configHash"]
        kinds2 = {x["kind"] for x in G.verify(before2, G.snapshot(h2))}
        self.assertIn("VALUE_CHANGED", kinds2)

    def test_guard_restores_past_and_keeps_appends(self):
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][0]["research"]["sectorWinRate"] = None      # 위반
        h["005930"].append({"date": "2026-08-12",               # 정상 append
                            "research": {"modelVersion": "research_v1.0"}})
        n = G.guard(h, before, "테스트")
        self.assertEqual(n, 1)
        self.assertNotIn("sectorWinRate", h["005930"][0]["research"])
        self.assertEqual(len(h["005930"]), 3, "append된 새 기록까지 지우면 안 된다")
        self.assertEqual(G.verify(before, G.snapshot(h)), [])

    def test_legacy_fields_are_out_of_scope(self):
        """이 가드는 Research 기록만 책임진다. Legacy 갱신 규칙은 기존 그대로."""
        h = self._hist()
        before = G.snapshot(h)
        h["005930"][0]["call"] = "SELL"
        self.assertEqual(G.verify(before, G.snapshot(h)), [])

    def test_duplicate_dates_are_tracked_separately(self):
        """같은 date가 두 번 있어도 각각 따로 보호한다.
        (코드, 날짜)만으로 키를 만들면 하나로 뭉개져 위반을 놓친다."""
        h = {"005930": [
            {"date": "2026-07-20", "research": {"modelVersion": "research_v1.0", "slot": 1,
                                                "createdAt": "2026-07-20T00:00:00Z"}},
            {"date": "2026-07-20", "research": {"modelVersion": "research_v1.0", "slot": 2,
                                                "createdAt": "2026-07-20T00:00:00Z"}},
        ]}
        before = G.snapshot(h)
        self.assertEqual(len(before), 2, "중복 날짜가 하나로 뭉개졌다")
        h["005930"][0]["research"]["modelVersion"] = "research_v1.1"
        h["005930"][1]["research"]["modelVersion"] = "research_v1.1"
        self.assertEqual(len(G.verify(before, G.snapshot(h))), 2)
        G.guard(h, before, "테스트")
        self.assertEqual([r["research"]["modelVersion"] for r in h["005930"]],
                         ["research_v1.0", "research_v1.0"])

    def test_same_day_refresh_allowed(self):
        """장중 30분마다 다시 도는 파이프라인이 오늘 기록을 새로 쓰는 것은 정상."""
        h = {"005930": [{"date": "2026-08-14", "research": {
            "modelVersion": "research_v1.0", "createdAt": "2026-08-14T09:30:00Z",
            "source": "live_shadow_oos"}}]}
        before = G.snapshot(h, today="2026-08-14")
        self.assertEqual(before, {}, "오늘 만든 기록은 보호 대상에서 빠져야 한다")
        h["005930"][0]["research"]["createdAt"] = "2026-08-14T10:00:00Z"
        self.assertEqual(G.verify(before, G.snapshot(h, today="2026-08-14")), [])

    def test_past_day_rewrite_still_blocked_on_same_day_run(self):
        """어제 만든 Prediction은 오늘 실행에서도 절대 못 바꾼다."""
        h = {"005930": [
            {"date": "2026-08-13", "research": {
                "modelVersion": "research_v1.0", "createdAt": "2026-08-13T09:30:00Z"}},
            {"date": "2026-08-14", "research": {
                "modelVersion": "research_v1.0", "createdAt": "2026-08-14T09:30:00Z"}},
        ]}
        before = G.snapshot(h, today="2026-08-14")
        self.assertEqual(len(before), 1, "어제 기록만 보호 대상이어야 한다")
        h["005930"][0]["research"]["modelVersion"] = "research_v1.1"
        v = G.verify(before, G.snapshot(h, today="2026-08-14"))
        self.assertEqual([x["kind"] for x in v], ["VALUE_CHANGED"])
        G.guard(h, before, "테스트", today="2026-08-14")
        self.assertEqual(h["005930"][0]["research"]["modelVersion"], "research_v1.0")

    def test_missing_created_at_is_protected(self):
        """시각을 알 수 없으면 보호하는 쪽으로 처리한다."""
        h = {"005930": [{"date": "2026-08-14", "research": {"modelVersion": "research_v1.0"}}]}
        self.assertEqual(len(G.snapshot(h, today="2026-08-14")), 1)

    def test_v11_created_day_read_from_candidate_timestamp(self):
        h = {"005930": [{"date": "2026-08-14", "researchV11": {
            "modelVersion": "research_v1.1",
            "candidates": {"X": {"predictionTimestamp": "2026-08-14T09:30:00Z"}}}}]}
        self.assertEqual(G.snapshot(h, today="2026-08-14"), {})
        self.assertEqual(len(G.snapshot(h, today="2026-08-15")), 1)

    def test_deepcopy_snapshot_is_immune_to_later_mutation(self):
        h = self._hist()
        before = G.snapshot(h)
        original = copy.deepcopy(h["005930"][0]["research"])
        h["005930"][0]["research"]["configHash"] = "changed"
        G.guard(h, before, "테스트")
        self.assertEqual(h["005930"][0]["research"], original)


if __name__ == "__main__":
    unittest.main(verbosity=1)
