#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""COMMIT 2 — 기본모델 구조적 결함 수정 테스트.

GATE 2(FEATURE PARITY / FAULT TEST)에 해당한다.
성능이 아니라 '같은 날짜를 같은 값으로 계산하는가'를 검사한다.
"""
import json
import os
import random
import re
import unittest

import indicator_math as M

HERE = os.path.dirname(os.path.abspath(__file__))


def _load_real_closes(limit_stocks=8, min_len=80):
    """실제 analysis_data.json에서 종목별 종가 시계열을 가져온다."""
    path = os.path.join(HERE, "analysis_data.json")
    if not os.path.exists(path):
        return {}
    data = json.load(open(path, encoding="utf-8"))
    out = {}
    for code, s in (data.get("stocks") or {}).items():
        rows = sorted((r for r in (s.get("daily") or [])
                       if r.get("date") and isinstance(r.get("close"), (int, float))),
                      key=lambda r: r["date"])
        if len(rows) >= min_len:
            out[code] = [r["close"] for r in rows]
        if len(out) >= limit_stocks:
            break
    return out


class WilderRsi(unittest.TestCase):
    def test_matches_compute_indicators_formula(self):
        """compute_indicators가 쓰던 원래 식과 결과가 같아야 한다."""
        random.seed(7)
        closes = [1000.0]
        for _ in range(200):
            closes.append(max(1.0, closes[-1] * (1 + random.uniform(-0.05, 0.05))))
        gains, losses = [], []
        for i in range(1, len(closes)):
            ch = closes[i] - closes[i - 1]
            gains.append(max(ch, 0)); losses.append(max(-ch, 0))
        ag = sum(gains[:14]) / 14; al = sum(losses[:14]) / 14
        for i in range(14, len(gains)):
            ag = (ag * 13 + gains[i]) / 14; al = (al * 13 + losses[i]) / 14
        expected = 100 - 100 / (1 + ag / al) if al else 100.0
        self.assertAlmostEqual(M.wilder_rsi(closes), expected, places=9)

    def test_differs_from_simple_average(self):
        """예전 historical 방식(단순 평균)과는 실제로 다른 값이어야 한다.
        같다면 이 수정이 아무 의미 없다는 뜻이므로 테스트가 실패해야 한다."""
        random.seed(11)
        closes = [1000.0]
        for _ in range(120):
            closes.append(max(1.0, closes[-1] * (1 + random.uniform(-0.06, 0.06))))
        i = len(closes) - 1
        gains, losses = [], []
        for j in range(max(1, i - 14), i + 1):
            ch = closes[j] - closes[j - 1]
            gains.append(max(ch, 0)); losses.append(max(-ch, 0))
        al = sum(losses) / len(losses) if losses else 0
        ag = sum(gains) / len(gains) if gains else 0
        old_way = 100 - 100 / (1 + ag / al) if al else 100.0
        self.assertNotAlmostEqual(M.wilder_rsi(closes), old_way, places=2)

    def test_insufficient_data_returns_none(self):
        self.assertIsNone(M.wilder_rsi([100.0] * 10))
        self.assertIsNone(M.wilder_rsi([]))
        self.assertIsNone(M.wilder_rsi(None))

    def test_all_gains_is_100(self):
        self.assertEqual(M.wilder_rsi([100 + i for i in range(40)]), 100.0)


class RetN(unittest.TestCase):
    def test_exactly_n_trading_intervals(self):
        closes = [100, 101, 102, 103, 104, 105]      # 6개 = 5거래일 간격
        self.assertAlmostEqual(M.ret_n(closes, 5), (105 - 100) / 100 * 100)

    def test_needs_n_plus_one_closes(self):
        self.assertIsNone(M.ret_n([100, 101, 102, 103, 104], 5))   # 5개로는 부족
        self.assertIsNotNone(M.ret_n([100, 101, 102, 103, 104, 105], 5))

    def test_old_last5_way_was_four_intervals(self):
        """예전 live 방식(last5 첫값→끝값)은 4거래일 간격이었음을 보인다."""
        closes = [100, 110, 120, 130, 140, 150]
        last5 = closes[-5:]                       # [110,120,130,140,150]
        old_way = (last5[-1] - last5[0]) / last5[0] * 100      # 4거래일
        new_way = M.ret_n(closes, 5)                            # 5거래일
        self.assertNotAlmostEqual(old_way, new_way, places=4)
        self.assertAlmostEqual(new_way, 50.0)

    def test_zero_base_is_none(self):
        self.assertIsNone(M.ret_n([0, 1, 2, 3, 4, 5], 5))


class LiveHistoricalParity(unittest.TestCase):
    """같은 날짜를 Live 방식과 Historical 방식으로 계산했을 때 값이 같아야 한다."""

    def test_parity_on_synthetic_series(self):
        random.seed(23)
        closes = [1000.0]
        for _ in range(300):
            closes.append(max(1.0, closes[-1] * (1 + random.uniform(-0.05, 0.05))))
        for idx in random.sample(range(30, len(closes)), 25):
            hist = M.state_at(closes, idx)                 # Historical 경로
            live = M.state_at(closes[: idx + 1], None)     # 그 날을 '오늘'로 자른 Live 경로
            self.assertAlmostEqual(hist["rsi14"], live["rsi14"], places=9,
                                   msg=f"idx={idx} RSI 불일치")
            self.assertAlmostEqual(hist["ret5"], live["ret5"], places=9,
                                   msg=f"idx={idx} ret5 불일치")
            self.assertAlmostEqual(hist["ma20"], live["ma20"], places=9)

    def test_parity_on_real_market_data(self):
        series = _load_real_closes()
        if not series:
            self.skipTest("analysis_data.json 없음")
        random.seed(29)
        checked = 0
        for code, closes in series.items():
            for idx in random.sample(range(30, len(closes)), min(10, len(closes) - 30)):
                hist = M.state_at(closes, idx)
                live = M.state_at(closes[: idx + 1], None)
                self.assertAlmostEqual(hist["rsi14"], live["rsi14"], places=9,
                                       msg=f"{code} idx={idx}")
                self.assertAlmostEqual(hist["ret5"], live["ret5"], places=9,
                                       msg=f"{code} idx={idx}")
                checked += 1
        self.assertGreater(checked, 20, "실제 데이터 검사 표본이 너무 적다")

    def test_state_at_uses_no_future_data(self):
        """index 이후 종가를 바꿔도 그 시점 상태는 변하지 않아야 한다."""
        random.seed(31)
        closes = [1000.0]
        for _ in range(100):
            closes.append(max(1.0, closes[-1] * (1 + random.uniform(-0.04, 0.04))))
        idx = 60
        before = M.state_at(closes, idx)
        tampered = list(closes)
        for j in range(idx + 1, len(tampered)):
            tampered[j] = tampered[j] * 3          # 미래를 크게 흔든다
        after = M.state_at(tampered, idx)
        self.assertEqual(before, after, "미래 종가가 과거 상태 계산에 새어 들어갔다")


class PipelineUsesSharedMath(unittest.TestCase):
    """실제 코드가 공용 모듈을 쓰는지(주석이 아니라 코드로)."""

    @staticmethod
    def _code(name):
        src = open(os.path.join(HERE, name), encoding="utf-8").read()
        src = "\n".join(l for l in src.splitlines() if not l.strip().startswith("#"))
        return re.sub(r'"""[\s\S]*?"""', "", src)

    def test_compute_indicators_uses_shared_rsi(self):
        code = self._code("compute_indicators.py")
        self.assertIn("indicator_math.wilder_rsi(closes)", code)
        self.assertIn("indicator_math.ret_n(closes", code)

    def test_build_quant_stats_uses_shared_state(self):
        code = self._code("analyze_auto.py")
        self.assertIn("indicator_math.state_at(closes, i)", code)
        # 예전 단순평균 RSI 코드가 남아 있으면 안 된다
        self.assertNotIn("al = sum(losses) / len(losses) if losses else 0", code)

    def test_quant_eval_prefers_ret5_field(self):
        code = self._code("analyze_auto.py")
        self.assertIn('tr5 = t.get("ret5")', code)

    def test_indicators_expose_ret5(self):
        code = self._code("compute_indicators.py")
        self.assertIn('"ret5"', code)
        self.assertIn('"rsi14Ready"', code)



class TaroMaturity(unittest.TestCase):
    """부분 이동평균·미성숙 지표를 정식 신호처럼 쓰지 않는다."""

    @staticmethod
    def _t(**over):
        base = {"ma20Gap": 6.0, "ma60Gap": 8.0, "ma20Full": True, "ma60Full": True,
                "rsi14": 62.0, "rsi14Ready": True, "macd": 30, "macdSignal": 10,
                "close": 1000, "ma20": 950, "ma60": 930, "volRatio": 1.2, "bars": 250}
        base.update(over)
        return base

    def setUp(self):
        import analyze_auto
        self.A = analyze_auto

    def test_partial_ma60_not_scored(self):
        full = self.A.taro_eval(self._t())
        partial = self.A.taro_eval(self._t(ma60Full=False))
        self.assertLess(partial["score"], full["score"],
                        "54일치 평균을 MA60처럼 그대로 점수에 넣고 있다")
        self.assertIn("ma60", partial["notReady"])

    def test_partial_ma20_not_scored(self):
        partial = self.A.taro_eval(self._t(ma20Full=False))
        self.assertIn("ma20", partial["notReady"])
        self.assertNotIn("ma20", partial["usedSignals"])

    def test_missing_rsi_not_scored(self):
        r = self.A.taro_eval(self._t(rsi14=None))
        self.assertIn("rsi14", r["notReady"])

    def test_missing_macd_is_not_penalised(self):
        """예전에는 MACD가 없어도 무조건 -8점(데드크로스 취급)이었다."""
        with_macd_bear = self.A.taro_eval(self._t(macd=1, macdSignal=50))
        no_macd = self.A.taro_eval(self._t(macd=None, macdSignal=None))
        self.assertGreater(no_macd["score"], with_macd_bear["score"],
                           "MACD 자료가 없는 것을 약세 신호로 취급하고 있다")
        self.assertIn("macd", no_macd["notReady"])

    def test_short_history_cannot_look_strong(self):
        """신규상장주(자료 거의 없음)가 강한 점수를 얻지 못해야 한다."""
        newly = self.A.taro_eval({"ma20Gap": 30, "ma60Gap": 30, "ma20Full": False,
                                  "ma60Full": False, "rsi14": None, "macd": None,
                                  "macdSignal": None, "close": 1000, "bars": 12})
        self.assertLessEqual(newly["score"], 55, f"미성숙 종목이 {newly['score']}점을 받았다")

    def test_readiness_exposed(self):
        r = self.A.taro_eval(self._t())
        self.assertEqual(sorted(r["ready"]), ["ma20", "ma60", "macd", "rsi14"])
        self.assertEqual(r["notReady"], [])


class MissingIsNotFifty(unittest.TestCase):
    """데이터 없음을 50점으로 가중합에 넣지 않는다."""

    def setUp(self):
        import analyze_auto
        self.A = analyze_auto

    def test_flow_missing_is_unavailable(self):
        r = self.A.flow_eval(None)
        self.assertIs(r["available"], False)
        self.assertIsNone(r["score"])

    def test_quant_missing_is_unavailable(self):
        r = self.A.quant_eval({}, {"rsi14": None}, {"all": {"n": 100, "w": 50, "sum": 0}})
        self.assertIs(r["available"], False)
        self.assertIsNone(r["score"])

    def test_weights_renormalized_over_available(self):
        A = self.A
        taro = {"score": 80, "stance": "bull", "findings": ["x"] * 4}
        diana = {"score": 60, "stance": "neu", "findings": ["x"] * 4}
        flow = {"score": 70, "stance": "bull", "findings": ["x"] * 4}
        quant_missing = {"score": None, "available": False, "stance": "neu",
                         "findings": ["x"] * 4}
        quant_neutral = {"score": 50, "available": True, "stance": "neu",
                         "findings": ["x"] * 4}
        e = {"risk": {}, "marketRegime": {}}
        withq = A.chief_eval(e, taro, diana, quant_neutral, flow)
        without = A.chief_eval(e, taro, diana, quant_missing, flow)
        # 50점을 합산했다면 결과가 같아야 한다. 재정규화했다면 달라야 한다.
        self.assertNotEqual(withq["total"], without["total"],
                            "결측 QUANT가 여전히 50점으로 합산되고 있다")
        self.assertTrue(without["weightRenormalized"])
        self.assertNotIn("nova", without["available"])

    def test_renormalized_total_matches_manual(self):
        A = self.A
        taro = {"score": 80, "stance": "bull", "findings": ["x"] * 4}
        diana = {"score": 60, "stance": "neu", "findings": ["x"] * 4}
        flow = {"score": 70, "stance": "bull", "findings": ["x"] * 4}
        missing = {"score": None, "available": False, "stance": "neu", "findings": ["x"] * 4}
        r = A.chief_eval({"risk": {}, "marketRegime": {}}, taro, diana, missing, flow)
        w = A.BASE_W
        expect = (80 * w["taro"] + 60 * w["diana"] + 70 * w["flow"]) / (
            w["taro"] + w["diana"] + w["flow"])
        self.assertAlmostEqual(r["rawTotal"], A.clamp(expect), places=6)

    def test_too_few_analysts_withholds_judgment(self):
        A = self.A
        miss = {"score": None, "available": False, "stance": "neu", "findings": ["x"] * 4}
        taro = {"score": 80, "stance": "bull", "findings": ["x"] * 4}
        r = A.chief_eval({"risk": {}, "marketRegime": {}}, taro, miss, miss, miss)
        self.assertEqual(r["call"], A.JUDGMENT_WITHHELD)
        self.assertIsNone(r["total"])
        self.assertTrue(r["judgmentWithheld"])


class VersionMetadata(unittest.TestCase):
    def setUp(self):
        import analyze_auto
        self.A = analyze_auto

    def test_chief_records_versions(self):
        A = self.A
        a = {"score": 60, "stance": "neu", "findings": ["x"] * 4}
        r = A.chief_eval({"risk": {}, "marketRegime": {}}, a, a, a, a)
        self.assertEqual(r["baseModelVersion"], A.BASE_MODEL_VERSION)
        for k in ("taro", "diana", "quant", "flow", "risk", "chief"):
            self.assertIn(k, r["componentVersions"])

    def test_withheld_also_records_version(self):
        A = self.A
        miss = {"score": None, "available": False, "stance": "neu", "findings": ["x"] * 4}
        a = {"score": 60, "stance": "neu", "findings": ["x"] * 4}
        r = A.chief_eval({"risk": {}, "marketRegime": {}}, a, miss, miss, miss)
        self.assertEqual(r["baseModelVersion"], A.BASE_MODEL_VERSION)

    def test_weight_learning_separates_versions(self):
        import compute_team_weights as W
        self.assertEqual(W.record_base_version({}), W.PRE_HOTFIX_BASE)
        self.assertEqual(W.record_base_version({"baseModelVersion": "x"}), "x")
        self.assertGreater(W.MIN_SAMPLES_NEW_VERSION, 0)


if __name__ == "__main__":
    unittest.main(verbosity=1)
