#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""분석가 발언권(가중치) 채점 기준 계약 테스트 (2026-08-31 신설).

왜 이 테스트가 있나
────────────────────
2026-08-14 index.html 주석에 이런 실측이 남아 있었다.

    "오른 구간 적중률 15.6% vs 내린 구간 78.6%"

시장이 통째로 오른 날에는 bull 의견이 거의 다 맞고, 통째로 내린 날에는 거의 다
틀렸다. 그건 분석가의 실력이 아니라 그날 시장의 방향이었다. 그런데도 발언권을
그 적중률로 나눠 주고 있었으니, 사실상 "요즘 시장 방향을 잘 따라 말한 사람"에게
발언권을 몰아 주고 있었던 셈이다.

2026-08-31부터 채점 기준을 "같은 기간 전 종목 수익률의 중앙값을 뺀 초과수익"으로
바꿨다. 이 파일은 그 기준이 조용히 절대 수익률로 되돌아가지 못하게 막는다.

경계 (여기서 지키지 않는 것)
────────────────────────────
Evolution 채점(Constitution scoringVersion = build_model_scoreboard.py ·
compute_model_intelligence.py 의 call_hit/stance_hit)은 이번 변경 대상이 아니다.
그쪽을 건드리면 Evolution 누적 일수가 리셋되므로, 오히려 "안 바뀌었는지"를 확인한다.
"""
import json
import os
import re
import unittest

import compute_team_weights as W

HERE = os.path.dirname(os.path.abspath(__file__))


def _load_js_object(path, varname):
    with open(path, encoding="utf-8") as fh:
        txt = re.sub(r"^\s*//.*$", "", fh.read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None


class TestScoringBasis(unittest.TestCase):
    """① 채점 기준이 '시장 대비'로 켜져 있는가."""

    def test_market_relative_flag_on(self):
        self.assertTrue(
            W.MARKET_RELATIVE,
            "MARKET_RELATIVE가 꺼져 있다. 끄면 시장 방향을 실력으로 세는 예전 문제로 돌아간다.",
        )

    def test_benchmark_min_codes_is_meaningful(self):
        # 표본 몇 개로 중앙값을 만들면 기준선이 노이즈가 된다.
        self.assertGreaterEqual(W.MARKET_MEDIAN_MIN_CODES, 20)

    def test_source_still_uses_excess_not_absolute(self):
        with open(os.path.join(HERE, "compute_team_weights.py"), encoding="utf-8") as fh:
            src = fh.read()
        self.assertIn("scored_ret = ret - mkt", src,
                      "초과수익(ret - 시장중앙값)으로 채점하는 줄이 사라졌다.")
        self.assertIn("score_stance(ana.get(\"stance\"), scored_ret", src,
                      "분석가 채점이 scored_ret(초과수익)이 아닌 다른 값을 쓰고 있다.")


class TestScoreStanceSemantics(unittest.TestCase):
    """② 채점 함수가 '시장보다 잘했나'를 실제로 구분하는가.

    score_stance 자체는 순수 함수라, 넣는 값이 초과수익이면 의미가 따라 바뀐다.
    여기서는 실제로 판정이 뒤집히는 대표 사례를 고정한다.
    """

    def test_bull_that_only_rode_the_market_is_not_a_hit(self):
        # 종목은 +4% 올랐지만 시장 중앙값이 +6%였다 → 초과수익 -2%p.
        # 절대 기준이면 '적중', 시장 대비면 시장을 못 따라간 것이다.
        self.assertEqual(W.score_stance("bull", 4.0, 1.0), "hit")         # 예전 기준
        self.assertEqual(W.score_stance("bull", 4.0 - 6.0, 1.0), "miss")  # 새 기준
        # 딱 deadband만큼(-1%p) 뒤진 것은 '틀림'이 아니라 중립이다 — 경계 동작 고정.
        self.assertEqual(W.score_stance("bull", 4.0 - 5.0, 1.0), "mid")

    def test_bear_in_a_crash_is_not_automatically_a_hit(self):
        # 종목은 -6% 빠졌지만 시장 중앙값이 -8%였다 → 초과수익 +2%p.
        # 시장보다 덜 빠졌으므로 'bear'(내린다) 의견은 시장 대비로는 틀린 쪽이다.
        self.assertEqual(W.score_stance("bear", -6.0, 1.0), "hit")
        self.assertEqual(W.score_stance("bear", -6.0 + 8.0, 1.0), "miss")
        # 시장이 -8%인데 이 종목은 -12% → 초과수익 -4%p, 진짜로 더 빠졌다.
        self.assertEqual(W.score_stance("bear", -12.0 + 8.0, 1.0), "hit")

    def test_real_skill_survives_both_bases(self):
        # 시장이 제자리(0%)인데 혼자 +7% 간 종목을 bull이라 했으면 어느 기준으로도 적중.
        self.assertEqual(W.score_stance("bull", 7.0, 1.0), "hit")
        self.assertEqual(W.score_stance("bull", 7.0 - 0.0, 1.0), "hit")

    def test_deadband_still_neutral(self):
        self.assertIsNone(W.score_stance("hold", 3.0, 1.0))
        self.assertEqual(W.score_stance("bull", 0.5, 1.0), "mid")


class TestGeneratedOutput(unittest.TestCase):
    """③ 산출물(team_weights.js)이 기준을 스스로 밝히는가."""

    @classmethod
    def setUpClass(cls):
        path = os.path.join(HERE, "team_weights.js")
        if not os.path.exists(path):
            raise unittest.SkipTest("team_weights.js 없음 — 파이프라인 미실행 환경")
        cls.tw = _load_js_object(path, "TEAM_WEIGHTS")

    def test_scoring_block_declares_market_relative(self):
        sc = self.tw.get("scoring")
        self.assertIsNotNone(sc, "global 밖 scoring 블록이 없다 — 기준을 알 수 없는 산출물이다.")
        self.assertEqual(sc["basis"], "market_relative_excess")
        self.assertEqual(sc["benchmark"], "cross_sectional_median_of_covered_universe")

    def test_fallback_to_absolute_is_rare(self):
        # 기준선을 못 구해 절대 채점으로 되돌린 건수가 많으면 사실상 예전 기준이다.
        sc = self.tw["scoring"]
        graded = self.tw["global"]["graded"]
        fb = sc.get("fallbackToAbsoluteN", 0)
        if graded:
            self.assertLess(
                fb / graded, 0.10,
                f"채점 {graded}건 중 {fb}건이 시장 기준선 없이 절대 채점됐다(10% 초과). "
                "일별 종가 수집이 끊겼는지 확인할 것.",
            )

    def test_version_is_stamped(self):
        # Evolution 매니페스트가 teamWeightVersion으로 집어가는 값.
        # 없으면 generatedAt(시각)으로 떨어져 기준 변경이 이력에 안 남는다.
        v = self.tw["global"].get("version")
        self.assertTrue(v and "market-relative" in v,
                        f"global.version이 기준을 밝히지 않는다: {v!r}")

    def test_team_accuracy_stays_absolute(self):
        # 화면에 노출되는 '팀 적중률'의 뜻을 조용히 바꾸지 않는다.
        self.assertEqual(self.tw["global"]["team"].get("basis"), "absolute_return")

    def test_absolute_comparison_is_recorded(self):
        # "이 변경이 무엇을 바꿨는지"를 나중에도 볼 수 있어야 한다.
        for a in W.ANALYSTS:
            self.assertIn("absoluteAcc", self.tw["global"]["acc"][a])

    def test_weights_still_sum_to_one(self):
        s = sum(self.tw["global"]["weights"].values())
        self.assertAlmostEqual(s, 1.0, places=2)

    def test_weights_within_constitution_bounds(self):
        # Constitution weightBounds는 Evolution 후보에 강제되지만, 기본 파이프라인
        # 가중치가 그 범위를 벗어나면 후보가 아예 만들어질 수 없다.
        with open(os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
                  encoding="utf-8") as fh:
            const = json.load(fh)
        b = const["weightBounds"]
        for a, v in self.tw["global"]["weights"].items():
            self.assertGreaterEqual(v, b["perAnalystMin"], f"{a} 가중치가 하한 미만")
            self.assertLessEqual(v, b["perAnalystMax"], f"{a} 가중치가 상한 초과")


class TestEvolutionScoringUntouched(unittest.TestCase):
    """④ Evolution 채점 의미는 건드리지 않았는가 (누적 일수 리셋 방지)."""

    def test_constitution_scoring_version_unchanged(self):
        with open(os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
                  encoding="utf-8") as fh:
            const = json.load(fh)
        self.assertEqual(
            const["scoringVersion"], "grading_v1_2026-08-16",
            "Constitution scoringVersion이 바뀌었다. 바꾸면 Evolution 기록이 갈라지고 "
            "누적 일수가 리셋된다 — 분석가 발언권 변경만으로는 바꿀 이유가 없다.",
        )

    def test_model_intelligence_still_scores_absolute(self):
        # Evolution 성적표는 절대 수익률 기준을 유지한다(이번 변경 범위 밖).
        with open(os.path.join(HERE, "compute_model_intelligence.py"), encoding="utf-8") as fh:
            src = fh.read()
        self.assertIn("def stance_hit(stance, ret, deadband):", src)
        self.assertNotIn("market_median", src,
                         "Evolution 성적표까지 시장 대비로 바꾸면 scoringVersion을 올려야 한다. "
                         "그건 별도 승인이 필요한 변경이다.")

    def test_base_model_version_untouched(self):
        # 가중치 기준 변경이 base 모델 버전을 건드리면 history 학습 표본이 통째로 갈린다.
        with open(os.path.join(HERE, "analyze_auto.py"), encoding="utf-8") as fh:
            src = fh.read()
        self.assertIn('BASE_MODEL_VERSION = "base-2026-08-15-parity-hotfix"', src)


class TestMarketMedianFunction(unittest.TestCase):
    """⑤ 시장 기준선 함수가 실제로 맞게 계산하는가 (합성 데이터로 직접 검증)."""

    @staticmethod
    def _universe(pct_moves, days=6):
        """종목마다 '하루에 pct씩 오르는' 가짜 종가 시계열을 만든다."""
        closes = {}
        for i, pct in enumerate(pct_moves):
            rows, price = [], 1000.0
            for d in range(days):
                rows.append({"date": f"2026-08-{d + 10:02d}", "close": round(price, 4)})
                price *= (1 + pct / 100.0)
            closes[f"{i:06d}"] = rows
        return closes

    def test_returns_none_when_too_few_codes(self):
        closes = self._universe([1.0] * (W.MARKET_MEDIAN_MIN_CODES - 1))
        self.assertIsNone(
            W.market_median(closes, "2026-08-10", 1),
            "표본이 최소 종목 수보다 적으면 기준선을 만들면 안 된다.",
        )

    def test_returns_value_at_the_threshold(self):
        closes = self._universe([1.0] * W.MARKET_MEDIAN_MIN_CODES)
        self.assertIsNotNone(W.market_median(closes, "2026-08-10", 1))

    def test_median_of_uniform_universe(self):
        # 모든 종목이 하루 +2%면 1거래일 뒤 중앙값도 +2%.
        closes = self._universe([2.0] * 50)
        self.assertAlmostEqual(W.market_median(closes, "2026-08-10", 1), 2.0, places=6)

    def test_median_compounds_over_the_window(self):
        # 하루 +1%가 5거래일이면 (1.01^5 - 1) = 약 +5.101%.
        closes = self._universe([1.0] * 50, days=8)
        self.assertAlmostEqual(W.market_median(closes, "2026-08-10", 5),
                               (1.01 ** 5 - 1) * 100, places=4)

    def test_median_ignores_a_few_extreme_movers(self):
        # 중앙값을 쓰는 이유: 소수 종목이 폭등해도 '체감 시장'이 흔들리지 않아야 한다.
        calm = [0.0] * 50
        self.assertAlmostEqual(W.market_median(self._universe(calm), "2026-08-10", 1), 0.0, places=6)
        loud = calm + [80.0, 90.0, 100.0]
        self.assertAlmostEqual(W.market_median(self._universe(loud), "2026-08-10", 1), 0.0, places=6)

    def test_codes_without_enough_future_days_are_skipped(self):
        # 창(window)을 채울 미래 종가가 없는 종목은 기준선 계산에서 빠져야 한다.
        closes = self._universe([3.0] * 50, days=3)     # 미래 종가 2개뿐
        self.assertIsNone(W.market_median(closes, "2026-08-10", 5))

    def test_excess_return_is_what_scoring_sees(self):
        # 시장이 +2%인데 이 종목은 +2%였다면 초과수익 0 → 중립(mid).
        closes = self._universe([2.0] * 50)
        mkt = W.market_median(closes, "2026-08-10", 1)
        self.assertEqual(W.score_stance("bull", 2.0 - mkt, 1.0), "mid")
        # 같은 시장에서 +5% 갔다면 초과 +3%p → 적중.
        self.assertEqual(W.score_stance("bull", 5.0 - mkt, 1.0), "hit")


class TestMarketMedianMath(unittest.TestCase):
    """⑥ 중앙값 산식 자체의 홀짝 처리."""

    @staticmethod
    def _median(vals):
        vals = sorted(vals)
        n = len(vals)
        return vals[n // 2] if n % 2 else (vals[n // 2 - 1] + vals[n // 2]) / 2.0

    def test_odd_and_even_counts(self):
        self.assertEqual(self._median([1.0, 3.0, 2.0]), 2.0)
        self.assertEqual(self._median([1.0, 2.0, 3.0, 4.0]), 2.5)

    def test_median_resists_a_few_extreme_movers(self):
        # 중앙값을 쓰는 이유: 소수 종목이 폭등해도 '체감 시장'이 흔들리지 않아야 한다.
        calm = [0.1 * i for i in range(-10, 11)]
        self.assertAlmostEqual(self._median(calm), 0.0, places=6)
        self.assertAlmostEqual(self._median(calm + [400.0, 500.0]), 0.1, places=6)


if __name__ == "__main__":
    unittest.main(verbosity=2)
