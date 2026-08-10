import copy
import json
import tempfile
import unittest
from pathlib import Path

from rotation_engine import (
    beta_binomial_rate,
    build_snapshot,
    concentration,
    period_return,
    shrink_value,
    winsorized_mean,
)
from compute_rotation import load_inputs, update_archive, write_snapshot_if_valid
from rotation_backtest import compute_lead_lag, find_similar_periods, walk_forward_calibration


def rows(closes, volumes=None, start_day=1):
    volumes = volumes or [100] * len(closes)
    return [
        {"date": f"2026-01-{start_day + index:02d}", "close": close, "volume": volumes[index]}
        for index, close in enumerate(closes)
    ]


class RotationMathTest(unittest.TestCase):
    def test_period_return_uses_exact_horizon(self):
        self.assertEqual(period_return([100, 102, 105, 110], 3), 10.0)

    def test_period_return_returns_none_when_history_is_short(self):
        self.assertIsNone(period_return([100, 110], 3))

    def test_winsorized_mean_caps_both_extremes(self):
        self.assertAlmostEqual(winsorized_mean([-100, 0, 10, 20, 200], 0.2), 10.0)

    def test_beta_binomial_shrinks_small_sector_to_market(self):
        self.assertAlmostEqual(beta_binomial_rate(1, 2, 0.5, 4), 0.5)

    def test_continuous_value_shrinks_toward_market_center(self):
        self.assertAlmostEqual(shrink_value(10, 0, 5, 5), 5.0)

    def test_positive_concentration_uses_only_positive_contribution(self):
        self.assertEqual(concentration([8, 2, -5], 1), 80.0)


class RotationSnapshotTest(unittest.TestCase):
    def setUp(self):
        self.stocks = {
            "A": rows([100, 102, 104, 106, 108, 110], [100, 100, 100, 100, 120, 180]),
            "B": rows([100, 101, 102, 103, 104, 105], [100, 100, 100, 100, 100, 130]),
            "C": rows([100, 100, 99, 99, 98, 98], [100, 100, 100, 100, 90, 80]),
            "D": rows([100, 100, 100, 100, 100, 100], [100, 100, 100, 100, 100, 100]),
        }
        self.sectors = {"A": "반도체", "B": "반도체", "C": "금융", "D": "금융"}
        self.markets = {"A": "KOSPI", "B": "KOSPI", "C": "KOSDAQ", "D": "KOSDAQ"}
        self.indices = {
            "KOSPI": rows([100, 101, 102, 103, 104, 105]),
            "KOSDAQ": rows([100, 100, 100, 100, 100, 100]),
        }

    def test_sector_snapshot_reports_breadth_flow_taro_and_sample(self):
        snapshot = build_snapshot(
            self.stocks, self.sectors, self.markets, self.indices,
            generated_at="2026-01-06 15:30", data_cutoff="2026-01-06 15:20 장중",
        )
        semi = next(sector for sector in snapshot["sectors"] if sector["name"] == "반도체")
        five = semi["periods"]["5"]
        self.assertEqual(semi["configuredCount"], 2)
        self.assertEqual(semi["validCount"], 2)
        self.assertEqual(five["breadth"]["upRate"], 100.0)
        self.assertGreater(five["flow"]["medianRelativeVolume"], 1.0)
        self.assertIn("score", five["taro"])
        self.assertIn(semi["sampleReliability"], ("낮음", "보통", "높음"))

    def test_stock_uses_its_own_market_benchmark(self):
        snapshot = build_snapshot(self.stocks, self.sectors, self.markets, self.indices)
        semi = next(sector for sector in snapshot["sectors"] if sector["name"] == "반도체")
        finance = next(sector for sector in snapshot["sectors"] if sector["name"] == "금융")
        self.assertGreater(semi["periods"]["5"]["relativeStrength"], 0)
        self.assertLess(finance["periods"]["5"]["relativeStrength"], 0)

    def test_high_concentration_lowers_confidence(self):
        stocks = {
            "A": rows([100, 100, 100, 100, 100, 200]),
            "B": rows([100, 100, 100, 100, 100, 101]),
            "C": rows([100, 100, 100, 100, 100, 100]),
        }
        snapshot = build_snapshot(
            stocks,
            {code: "집중업종" for code in stocks},
            {code: "KOSPI" for code in stocks},
            {"KOSPI": rows([100, 100, 100, 100, 100, 100])},
            model={"calibration": {"highOutperformsModerate": True, "evaluations": 100}},
        )
        period = snapshot["sectors"][0]["periods"]["5"]
        self.assertGreater(period["concentration"]["top1"], 90)
        self.assertNotEqual(period["confidence"], "높음")

    def test_weak_models_return_no_signal(self):
        flat = {code: rows([100, 100, 100, 100, 100, 100]) for code in "ABCDEF"}
        snapshot = build_snapshot(
            flat,
            {code: "정체" for code in flat},
            {code: "KOSPI" for code in flat},
            {"KOSPI": rows([100, 100, 100, 100, 100, 100])},
        )
        self.assertEqual(snapshot["summary"]["state"], "no-signal")
        self.assertEqual(snapshot["summary"]["headline"], "뚜렷한 순환 신호 없음")

    def test_future_rows_do_not_change_asof_snapshot(self):
        future_changed = copy.deepcopy(self.stocks)
        future_changed["A"].append({"date": "2026-01-07", "close": 9999, "volume": 999999})
        original = build_snapshot(self.stocks, self.sectors, self.markets, self.indices, as_of="2026-01-06")
        changed = build_snapshot(future_changed, self.sectors, self.markets, self.indices, as_of="2026-01-06")
        self.assertEqual(original["sectors"], changed["sectors"])


class RotationIoTest(unittest.TestCase):
    def test_loaders_filter_to_configured_universe_and_sort_dates(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "tickers.js").write_text(
                'const TICKERS = [{"code":"A","name":"A사","sector":"반도체"},'
                '{"code":"B","name":"B사","sector":"금융"}];\n', encoding="utf-8"
            )
            (root / "krx_list.json").write_text(
                '{"updated":"2026-08-10","items":['
                '{"c":"A","m":"KOSPI"},{"c":"B","m":"KOSDAQ"},{"c":"X","m":"KOSPI"}]}',
                encoding="utf-8",
            )
            (root / "price_history.js").write_text(
                'const PRICE_HISTORY = {"A":[{"page":2,"days":[{"date":"2026-01-02","close":102,"volume":20}]},'
                '{"page":1,"days":[{"date":"2026-01-01","close":100,"volume":10}]}],'
                '"X":[{"page":1,"days":[{"date":"2026-01-01","close":1,"volume":1}]}]};\n',
                encoding="utf-8",
            )
            (root / "index_history.js").write_text(
                'const INDEX_HISTORY = {"KOSPI":[],"KOSDAQ":[]};\n', encoding="utf-8"
            )
            (root / "indicators.json").write_text('{"stocks":{}}', encoding="utf-8")

            loaded = load_inputs(root)

            self.assertEqual(set(loaded["stocks"]), {"A", "B"})
            self.assertEqual([row["date"] for row in loaded["stocks"]["A"]], ["2026-01-01", "2026-01-02"])
            self.assertEqual(loaded["markets"], {"A": "KOSPI", "B": "KOSDAQ"})

    def test_invalid_snapshot_does_not_replace_last_good_file(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "rotation_snapshot.js"
            target.write_text("last-good", encoding="utf-8")
            self.assertFalse(write_snapshot_if_valid(target, {"schemaVersion": 1, "sectors": []}))
            self.assertEqual(target.read_text(encoding="utf-8"), "last-good")

    def test_close_mode_archives_once_per_day(self):
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "rotation_archive.json"
            snapshot = {
                "schemaVersion": 1,
                "generatedAt": "2026-01-02 16:05",
                "dataCutoff": "2026-01-02 종가",
                "status": "confirmed",
                "universe": {"configured": 500, "valid": 500},
                "marketRegime": {}, "model": {}, "summary": {},
                "sectors": [{"name": "반도체"}], "leadLagEdges": [],
                "similarMarkets": {}, "methodology": {}, "warnings": [],
            }
            update_archive(target, snapshot)
            update_archive(target, snapshot)
            archive = json.loads(target.read_text(encoding="utf-8"))
            self.assertEqual(len(archive["days"]), 1)
            self.assertEqual(archive["days"][0]["date"], "2026-01-02")
            self.assertEqual(archive["days"][0]["status"], "confirmed")


class RotationBacktestTest(unittest.TestCase):
    def test_lead_lag_reports_leader_before_lagger(self):
        leader = [float((index % 9) - 4) for index in range(100)]
        lagger = [0.0, 0.0] + leader[:-2]
        edges = compute_lead_lag({"Leader": leader, "Lagger": lagger}, max_lag=5, min_pairs=60)
        self.assertEqual(edges[0]["leader"], "Leader")
        self.assertEqual(edges[0]["lagger"], "Lagger")
        self.assertEqual(edges[0]["lagDays"], 2)

    def test_similarity_observes_embargo_and_known_outcomes(self):
        history = [
            {"date": "2026-01-01", "vector": [0.0, 0.0], "outcome": 1.2},
            {"date": "2026-01-20", "vector": [0.1, 0.1], "outcome": 9.9},
            {"date": "2026-02-01", "vector": [0.0, 0.2]},
        ]
        cases = find_similar_periods(history, [0.0, 0.0], "2026-02-10", embargo_days=30)
        self.assertEqual([case["date"] for case in cases], ["2026-01-01"])

    def test_calibration_keeps_high_confidence_locked_with_small_sample(self):
        result = walk_forward_calibration([
            {"date": f"2026-01-{day:02d}", "confidence": "high", "success": day % 2 == 0}
            for day in range(1, 10)
        ])
        self.assertFalse(result["highOutperformsModerate"])
        self.assertEqual(result["status"], "accumulating")

    def test_calibration_unlocks_only_when_high_beats_moderate(self):
        records = []
        for day in range(40):
            records.append({"date": str(day), "confidence": "high", "success": day < 30})
            records.append({"date": str(day), "confidence": "moderate", "success": day < 20})
        result = walk_forward_calibration(records, minimum_per_group=30)
        self.assertTrue(result["highOutperformsModerate"])
        self.assertEqual(result["status"], "calibrated")


if __name__ == "__main__":
    unittest.main()
