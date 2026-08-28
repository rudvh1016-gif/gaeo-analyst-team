#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""COMMIT 3 — 연구모델 C + 모델 대시보드 테스트."""
import copy
import json
import os
import re
import unittest

import build_model_scoreboard as SB
import model_registry as R
import research_engine as V10
import research_engine_v11 as V11
import research_engine_v20 as V20

HERE = os.path.dirname(os.path.abspath(__file__))

PIT = {h: {"n": 50000, "w": 24700, "baseRate": 0.494, "asof": "2026-08-14",
           "lastOutcomeDate": "2026-08-13", "horizon": int(h)} for h in ("5", "20", "60")}
T = "2026-08-15T09:00:00+00:00"


def _entry():
    return {"price": 10000, "stale": False, "per": 12.0, "pbr": 1.1, "roe": 9.0,
            "tech": {"close": 10000, "ma5Gap": 1.0, "ma20Gap": 2.0, "ma60Gap": 3.0,
                     "ma120Gap": 4.0, "ma200Gap": 5.0, "rsi14": 55.0, "macd": 120,
                     "macdSignal": 80, "volRatio": 1.2,
                     "cross20_60": {"event": "golden", "daysAgo": 3}},
            "risk": {"vol20": 2.0, "mdd3m": -12.0, "pos52w": 60, "grade": "low"},
            "flow": {"flowRatioPct": 1.5, "foreignBuyDays": 3, "organBuyDays": 3,
                     "days": 5, "divergence": "accumulation"},
            "relative": {"ret5": 6.0, "vsSector": 1.0, "sectorPercentile": 70}}


class ABStillFrozen(unittest.TestCase):
    def test_hashes(self):
        self.assertEqual(V10.config_hash(), "e37e6cc0cb701171")
        self.assertEqual(V11.config_hash(), "0d8ff5f0909e7b7b")

    def test_c_has_own_version(self):
        self.assertEqual(V20.RESEARCH_MODEL_VERSION, "research_v2.0")
        self.assertNotEqual(V20.config_hash(), V11.config_hash())
        self.assertEqual(V20.INHERITED_CONFIG_HASH, V11.config_hash())

    def test_c_does_not_mutate_b(self):
        before = dict(V11.CHIEF_SCHEMES)
        V20.predict(_entry(), {}, PIT, T, "P0")
        self.assertEqual(V11.CHIEF_SCHEMES, before)
        self.assertEqual(V11.config_hash(), "0d8ff5f0909e7b7b")

    def test_ab_never_see_dart(self):
        import inspect
        for mod in (V10, V11):
            src = inspect.getsource(mod)
            code = re.sub(r'"""[\s\S]*?"""', "", src)
            code = "\n".join(l for l in code.splitlines() if not l.strip().startswith("#"))
            for banned in ("import dart", "dart_events", "dart_context", "dart_pipeline"):
                self.assertNotIn(banned, code, f"{mod.__name__}가 DART를 참조한다")


class PairedCandidates(unittest.TestCase):
    """B와 C가 같은 조건의 짝이어야 DART 효과를 비교할 수 있다."""

    def setUp(self):
        self.b = V11.predict(_entry(), {}, PIT, T, "P0")
        self.c = V20.predict(_entry(), {}, PIT, T, "P0")

    def test_same_candidate_ids(self):
        self.assertEqual(set(self.b["candidates"]), set(self.c["candidates"]))

    def test_same_prediction_timestamp(self):
        bs = {v["predictionTimestamp"] for v in self.b["candidates"].values()}
        cs = {v["predictionTimestamp"] for v in self.c["candidates"].values()}
        self.assertEqual(bs, cs)
        self.assertEqual(bs, {T})

    def test_pairing_recorded(self):
        for cid, cv in self.c["candidates"].items():
            self.assertEqual(cv["pairedWith"]["candidateModelId"], cid)
            self.assertEqual(cv["pairedWith"]["configHash"], V11.config_hash())

    def test_no_dart_means_identical_direction(self):
        """공시가 없으면 B와 같은 판단이 나오는 게 정상이다(대조군)."""
        for cid in self.b["candidates"]:
            for h in ("5", "20", "60"):
                self.assertEqual(self.b["candidates"][cid]["horizons"][h]["action"],
                                 self.c["candidates"][cid]["horizons"][h]["action"])

    def test_no_primary_candidate(self):
        self.assertEqual(self.c["primarySelection"], "NO_PRIMARY_CANDIDATE_SELECTED")
        self.assertNotIn("primaryAction", self.c)


class DartPointInTime(unittest.TestCase):
    def test_future_event_not_visible(self):
        events = [{"detected_at": "2026-08-15T08:00:00+00:00", "report_name": "A"},
                  {"detected_at": "2026-08-15T14:00:00+00:00", "report_name": "B"}]
        c = V20.predict(_entry(), {}, PIT, T, "P0", dart_events=events)
        self.assertEqual(c["dart"]["visibleEventCount"], 1)
        self.assertEqual(c["dart"]["hiddenNotYetDetected"], 1)
        self.assertEqual(c["dart"]["latestReportName"], "A")

    def test_timezone_aware_comparison(self):
        """+09:00과 +00:00이 섞여도 실제 시각으로 비교한다."""
        events = [{"detected_at": "2026-08-15T17:30:00+09:00", "report_name": "A"}]  # UTC 08:30
        c = V20.predict(_entry(), {}, PIT, T, "P0", dart_events=events)
        self.assertEqual(c["dart"]["visibleEventCount"], 1)

    def test_dart_produces_no_score(self):
        c = V20.predict(_entry(), {}, PIT, T, "P0",
                        dart_events=[{"detected_at": "2026-08-15T08:00:00+00:00",
                                      "report_name": "A"}])
        self.assertIs(c["dart"]["producesScore"], False)
        self.assertNotIn("score", c["dart"])

    def test_no_event_is_not_no_news(self):
        c = V20.predict(_entry(), {}, PIT, T, "P0")
        self.assertIn("일반 언론뉴스는 포함되지 않는다", c["dart"]["coverageNote"])

    def test_financial_not_scored_yet(self):
        c = V20.predict(_entry(), {}, PIT, T, "P0")
        self.assertEqual(c["dart"]["financial"]["status"], V20.DIANA_DART_PARTIAL)
        self.assertIs(c["dart"]["financial"]["available"], False)

    def test_directional_financial_features_not_built(self):
        self.assertEqual(
            V20.REGISTERED_UNBUILT["DART_FINANCIAL_DIRECTIONAL_FEATURES"]["status"],
            "NOT_BUILT_PAPER_FORMULA_NOT_READY")


class Scoreboard(unittest.TestCase):
    """⚠️ SB.build()는 한 번에 6~7초 걸린다(스코어보드 전체를 다시 만든다).

    예전에는 setUp이라 테스트 11개마다 다시 만들어 이 클래스 하나가 약 73초,
    저장소 전체 Python 테스트 194초의 38%를 차지했다. 아래 테스트는 전부
    payload를 읽기만 하므로 클래스당 한 번만 만든다.
    그래도 테스트끼리 서로 영향을 주지 않게 사본을 준다 — 200KB 미만이라
    복사 비용은 무시할 수준이고, 나중에 누가 payload를 고치는 테스트를
    추가해도 옆 테스트가 조용히 깨지지 않는다.
    """

    @classmethod
    def setUpClass(cls):
        cls._payload = SB.build()

    def setUp(self):
        self.payload = copy.deepcopy(self._payload)

    def test_five_models(self):
        self.assertEqual(len(self.payload["models"]), 5)

    def test_no_raw_predictions(self):
        text = json.dumps(self.payload, ensure_ascii=False)
        self.assertNotIn("005930", text, "개별 종목 예측이 집계 파일에 섞였다")
        self.assertLess(len(text), 200000, "집계 파일이 지나치게 크다")

    def test_no_fake_zero_accuracy(self):
        for m in self.payload["models"]:
            for h, v in m["horizons"].items():
                if v.get("status") != "OK":
                    self.assertNotIn("accuracy", v,
                                     f"{m['displayName']} {h}D에 가짜 정확도가 있다")

    def test_not_applicable_vs_pending_distinguished(self):
        base = next(m for m in self.payload["models"] if m["id"] == "base_production")
        self.assertEqual(base["horizons"]["20"]["status"], SB.NOT_APPLICABLE)
        a = next(m for m in self.payload["models"] if m["id"] == "research_a")
        self.assertEqual(a["horizons"]["20"]["status"], SB.PENDING_NOT_MATURED)

    def test_archived_model_has_no_new_predictions(self):
        old = next(m for m in self.payload["models"] if m["id"] == "legacy_shadow_v3")
        self.assertEqual(old["horizons"]["5"]["status"], "ARCHIVED_NO_NEW_PREDICTIONS")
        self.assertEqual(old["autoPromotion"], "REMOVED")
        self.assertTrue(old["failureReasons"])

    def test_no_probability_metrics_for_non_probabilistic(self):
        base = next(m for m in self.payload["models"] if m["id"] == "base_production")
        self.assertEqual(base["probabilityMetrics"]["status"], SB.NOT_APPLICABLE)

    def test_ranking_on_hold(self):
        self.assertEqual(self.payload["ranking"]["status"], "RANKING_ON_HOLD")

    def test_independence_note_present(self):
        self.assertIn("독립", self.payload["independenceNote"])

    def test_unique_dates_reported(self):
        for m in self.payload["models"]:
            self.assertIn("uniquePredictionDates", m)

    def test_auto_promotion_policy(self):
        self.assertEqual(self.payload["autoPromotionPolicy"],
                         R.AUTO_PROMOTION)

    def test_insufficient_evidence_threshold(self):
        self.assertGreaterEqual(SB.MIN_UNIQUE_DATES, 20)


class ScoreboardUI(unittest.TestCase):
    # index.html은 1MB가 넘는다. 문자열은 못 바꾸니 한 번만 읽어 공유해도 안전하다.
    @classmethod
    def setUpClass(cls):
        cls.html = open(os.path.join(HERE, "index.html"), encoding="utf-8").read()

    def test_board_function_present(self):
        self.assertIn("function modelBoardHTML()", self.html)
        self.assertIn("${modelBoardHTML()}", self.html)

    def test_scoreboard_script_loaded(self):
        self.assertIn("model_scoreboard.js", self.html)

    def test_browser_does_not_read_raw_archive(self):
        """브라우저가 research_archive를 직접 읽으면 안 된다."""
        self.assertNotIn("research_archive/live", self.html)
        self.assertNotIn("research_history.jsonl", self.html)

    def test_withheld_excluded_from_scoring(self):
        self.assertIn("if(call==='JUDGMENT_WITHHELD') return 'withheld'", self.html)
        self.assertIn("withheldN", self.html)


if __name__ == "__main__":
    unittest.main(verbosity=1)
