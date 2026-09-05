#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Display-only BUY context, provenance, and numerical disclosure contracts.
Empirical performance may reverse; tests must never enforce a desired outcome.
"""
import io
import json
import os
import re
import unittest

import analyze_auto as A
import compute_team_weights as W

HERE = os.path.dirname(os.path.abspath(__file__))


class TestOverheatFlag(unittest.TestCase):
    """① 경고 판정 자체의 수학."""

    @staticmethod
    def entry(ret5=None, ret20=None, with_tech=True):
        return {"tech": {"ret5": ret5, "ret20": ret20}} if with_tech else {}

    def test_calm_stock_is_not_flagged(self):
        r = A.overheat_flag(self.entry(ret5=3.0, ret20=8.0))
        self.assertTrue(r["available"])
        self.assertFalse(r["warn"])
        self.assertEqual(r["triggers"], [])

    def test_short_term_spike_is_flagged(self):
        r = A.overheat_flag(self.entry(ret5=12.0, ret20=5.0))
        self.assertTrue(r["warn"])
        self.assertEqual(r["triggers"], ["ret5"])

    def test_mid_term_runup_is_flagged(self):
        """효성화학 사례 — 5일 상승률만 보면 안 걸리고 20일에서 걸린다.

        2026-08-17~20 나흘 연속 BUY를 받는 동안 -19.7% → -21.8%로 계속 빠졌다.
        그때 직전 5거래일은 +7.3%/+2.8%/+4.1%로 기준(+10%) 미달이었지만
        직전 20거래일이 +31.3%/+26.5%/+29.0%라 20일 조건이 잡아낸다.
        """
        r = A.overheat_flag(self.entry(ret5=7.3, ret20=31.3))
        self.assertTrue(r["warn"])
        self.assertEqual(r["triggers"], ["ret20"])

    def test_both_conditions_are_reported(self):
        r = A.overheat_flag(self.entry(ret5=18.3, ret20=27.3))
        self.assertEqual(r["triggers"], ["ret5", "ret20"])

    def test_boundary_is_inclusive(self):
        self.assertTrue(A.overheat_flag(self.entry(ret5=A.OVERHEAT_RET5_PCT))["warn"])
        self.assertFalse(A.overheat_flag(self.entry(ret5=A.OVERHEAT_RET5_PCT - 0.1))["available"])
        self.assertTrue(A.overheat_flag(self.entry(ret20=A.OVERHEAT_RET20_PCT))["warn"])

    def test_missing_data_is_not_called_safe(self):
        """자료 없음을 '과열 아님'으로 바꿔 말하지 않는다."""
        r = A.overheat_flag(self.entry(with_tech=False))
        self.assertFalse(r["available"])
        self.assertFalse(r["warn"])
        self.assertIn("판정하지 않았", r["note"])

    def test_partial_data_still_judges_what_it_has(self):
        r = A.overheat_flag(self.entry(ret5=None, ret20=30.0))
        self.assertTrue(r["available"])
        self.assertTrue(r["warn"])
        self.assertIsNone(r["ret5"])

    def test_volatility_is_context_only(self):
        r = A.overheat_flag({"tech": {"ret5": 1., "ret20": 2.}, "risk": {"vol20": 9.}})
        self.assertFalse(r["warn"])
        self.assertEqual(r["triggers"], [])
        self.assertEqual(r["vol20"], 9.)

    def test_volatility_does_not_escalate_surge(self):
        r = A.overheat_flag({"tech": {"ret5": 12., "ret20": 2.}, "risk": {"vol20": 9.}})
        self.assertEqual(r["level"], "caution")
        self.assertEqual(r["triggers"], ["ret5"])

    def test_unknown_input_does_not_mean_safe(self):
        for value in (None, float('nan'), float('inf'), True, '12'):
            r = A.overheat_flag({"tech": {"ret5": 0., "ret20": value}})
            self.assertFalse(r["available"])
            self.assertEqual(r["level"], "unknown")

    def test_volatility_alone_is_insufficient(self):
        r = A.overheat_flag({"risk": {"vol20": 9.}})
        self.assertFalse(r["available"])
        self.assertFalse(r["warn"])


class TestWarningNeverChangesTheCall(unittest.TestCase):
    """② 경고는 표시 전용이다 — call·total에 손대지 않는다."""

    @staticmethod
    def _analysts(score):
        return {"score": score, "stance": "bull", "findings": ["x"] * 4}

    def _run(self, ret5, ret20):
        e = {"risk": {}, "marketRegime": {}, "tech": {"ret5": ret5, "ret20": ret20}}
        a = self._analysts(70)
        return A.chief_eval(e, a, a, a, a)

    def test_same_scores_give_same_call_regardless_of_overheat(self):
        calm = self._run(1.0, 2.0)
        hot = self._run(40.0, 90.0)
        self.assertEqual(calm["call"], hot["call"])
        self.assertEqual(calm["total"], hot["total"])
        self.assertEqual(calm["rawTotal"], hot["rawTotal"])
        self.assertEqual(calm["confidence"], hot["confidence"])
        # 그런데 경고 자체는 달라야 한다(붙긴 붙어야 한다).
        self.assertFalse(calm["overheat"]["warn"])
        self.assertTrue(hot["overheat"]["warn"])

    def test_overheat_block_is_present_on_every_verdict(self):
        self.assertIn("overheat", self._run(1.0, 2.0))

    def test_source_does_not_feed_overheat_into_the_score(self):
        """산식 쪽에서 overheat를 읽어 점수를 깎는 코드가 생기면 막는다."""
        src = io.open(os.path.join(HERE, "analyze_auto.py"), encoding="utf-8").read()
        body = src.split("def chief_eval(")[1].split("\ndef ")[0]
        # 결과 dict를 만들기 전까지(= 점수·판단을 계산하는 구간)에는 overheat가
        # 한 번도 나오면 안 된다. 나오는 순간 판단에 끌어다 쓴 것이다.
        before_result = body.split("    result = {")[0]
        self.assertNotIn("overheat", before_result,
                         "chief_eval이 점수를 계산하는 구간에서 overheat를 읽고 있다. "
                         "경고는 표시 전용이어야 한다.")


class TestThresholdsStayInSync(unittest.TestCase):
    """③ 기준이 두 파일에서 갈라지면 화면 설명이 거짓이 된다."""

    def test_analyze_and_weights_use_the_same_thresholds(self):
        self.assertEqual(A.OVERHEAT_RET5_PCT, W.OVERHEAT_RET5_PCT)
        self.assertEqual(A.OVERHEAT_RET20_PCT, W.OVERHEAT_RET20_PCT)
        self.assertEqual(A.OVERHEAT_VOL20_PCT, W.OVERHEAT_VOL20_PCT)

    def test_indicator_lookback_matches_the_20day_threshold(self):
        import indicator_math
        self.assertEqual(indicator_math.RET_LOOKBACK_MID, 20)
        self.assertEqual(indicator_math.RET_LOOKBACK, 5)

    def test_indicator_pipeline_emits_both_returns(self):
        src = io.open(os.path.join(HERE, "compute_indicators.py"), encoding="utf-8").read()
        self.assertIn('"ret20"', src, "지표 파이프라인이 20거래일 수익률을 안 싣는다.")
        self.assertIn("RET_LOOKBACK_MID", src)


class TestGeneratedPayload(unittest.TestCase):
    """④ 산출물이 근거를 싣고 있는가."""

    @classmethod
    def setUpClass(cls):
        p = os.path.join(HERE, "team_weights.js")
        if not os.path.exists(p):
            raise unittest.SkipTest("team_weights.js 없음")
        with open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8") as f:
            stocks = json.load(f)["stocks"]
        closes = {c: sorted(v["daily"], key=lambda r:r["date"]) for c,v in stocks.items() if v.get("daily")}
        hist = W.load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY")
        cls.bo = W.buy_outcome_stats(hist, closes, W.load_names(), {W.BASE_MODEL_VERSION}, W.record_base_version)


    def test_buy_outcome_exists(self):
        self.assertIsNotNone(self.bo, "BUY 실적이 team_weights.js에 없다 — 화면이 숫자를 지어내게 된다.")

    def test_crash_rate_is_reported_next_to_accuracy(self):
        """적중률만 내면 '반은 맞았네'로 읽힌다. 크게 물린 비율을 같이 낸다."""
        for key in ("allTime", "currentVersion"):
            blk = self.bo[key]
            self.assertIsNotNone(blk)
            for f in ("n", "acc", "crashPct", "meanRet", "uniqueDecisionDays"):
                self.assertIn(f, blk)
            self.assertGreaterEqual(blk["crashPct"], 0.0)
            self.assertLessEqual(blk["uniqueDecisionDays"], blk["n"])

    def test_overheat_comparison_uses_the_same_rows(self):
        oh = self.bo["overheatAllTime"]
        if not oh.get("enoughSample"):
            self.skipTest("표본 부족")
        self.assertEqual(oh["warn"]["n"] + oh["calm"]["n"], self.bo["allTime"]["n"],
                         "경고 대상과 나머지를 합친 수가 전체와 다르다 — 다른 표본을 섞어 비교하고 있다.")
        self.assertAlmostEqual(oh["crashGapPp"],
                               round(oh["warn"]["crashPct"] - oh["calm"]["crashPct"], 1), places=1)

    def test_random_baseline_is_reported(self):
        """적중률만 내면 잘한 건지 못한 건지 알 수 없다. '아무거나 골랐다면'을 같이 낸다.

        실측에서 우리 BUY(40.1%)는 무작위(46.4%)보다 낮았다. 불리해도 그대로 낸다.
        """
        rb = self.bo["randomBaseline"]
        for f in ("n", "acc", "crashPct", "meanRet", "uniqueDecisionDays"):
            self.assertIn(f, rb)
        self.assertGreater(rb["n"], self.bo["allTime"]["n"],
                           "무작위 기준선의 표본이 BUY보다 작다 — 전 종목을 안 세고 있다.")

    def test_caution_matrix_covers_every_buy(self):
        cm = self.bo["cautionMatrix"]
        total = sum(cm[lv]["n"] for lv in ("none", "caution", "unknown") if cm[lv])
        self.assertEqual(total, self.bo["allTime"]["n"],
                         "단계별 합이 전체와 다르다 — 어떤 판단이 어느 칸에도 안 들어갔다.")

    def test_warning_is_exploratory_regardless_of_outcome(self):
        self.assertEqual(self.bo["evidenceStatus"], "EXPLORATORY_NOT_VALIDATED")
        self.assertEqual(self.bo["crashBasis"], "fifth_session_close_return")
        self.assertEqual(self.bo["schemaVersion"], 2)

    def test_reconstructed_and_manual_records_are_separated(self):
        self.assertEqual(self.bo["legacyMixed"]["n"], self.bo["allTime"]["n"]
                         + self.bo["reconstructed"]["n"] + self.bo["nonAuto"]["n"])

    def test_thresholds_are_stamped_in_the_output(self):
        self.assertEqual(self.bo["overheatThresholds"]["ret5"], W.OVERHEAT_RET5_PCT)
        self.assertEqual(self.bo["overheatThresholds"]["ret20"], W.OVERHEAT_RET20_PCT)
        self.assertNotIn("vol20", self.bo["overheatThresholds"])

    def test_worst_cases_are_named(self):
        for w in self.bo["worst"]:
            for f in ("code", "name", "date", "ret5"):
                self.assertIn(f, w)
            self.assertLess(w["ret5"], 0)


class TestScreen(unittest.TestCase):
    """⑤ 화면이 사실대로, 그리고 숫자를 지어내지 않고 말하는가."""

    @classmethod
    def setUpClass(cls):
        cls.app = io.open(os.path.join(HERE, "app.js"), encoding="utf-8").read()
        cls.html = io.open(os.path.join(HERE, "index.html"), encoding="utf-8").read()

    def _has(self, needle, msg):
        self.assertTrue(needle in self.app, msg)

    def test_warning_slot_exists(self):
        self.assertTrue('id="voverheat"' in self.html, "경고를 그릴 자리가 index.html에 없다.")

    def test_warning_is_rendered(self):
        self._has("overheatNoticeHTML", "경고 렌더 함수가 사라졌다.")
        self._has("vOh.innerHTML=overheatNoticeHTML", "경고를 화면에 넣는 호출이 사라졌다.")

    def test_warning_only_for_buy(self):
        self._has("if(call!=='BUY') return '';",
                  "BUY가 아닌 판단에도 매수 경고를 붙이고 있다(근거는 BUY 구간에서만 쟀다).")

    def test_warning_says_it_did_not_change_the_call(self):
        self._has("판단 자체는 바꾸지 않았어요",
                  "경고가 '판단을 바꾸지 않았다'는 사실을 안 밝힌다.")

    def test_random_baseline_is_on_screen(self):
        self._has("bo.randomBaseline", "성적표가 무작위 기준선을 읽지 않는다.")
        self._has("같은 날짜의 자동판단 기록과 비교하면 어땠을까요",
                  "무작위 기준선 공개 문구가 사라졌다.")
        self._has("부진의 원인이 한 가지라고 결론 내릴 수 없어요",
                  "불리한 결론을 화면에서 뺐다.")

    def test_warning_uses_the_matching_cell(self):
        self._has("bo.warningVersion===oh.version",
                  "경고가 단계에 맞는 실측 숫자가 아니라 아무 숫자나 쓰고 있다.")

    def test_buy_record_is_disclosed(self):
        self._has("team.buyOutcome", "성적표가 BUY 실적을 읽지 않는다.")
        self._has("실제로 어떻게 끝났는지도 밝힐게요", "BUY 실적 공개 문구가 사라졌다.")

    def test_no_hardcoded_performance_numbers(self):
        """Constitution publicClaimPolicy — 성과 숫자는 실측값만 표시한다."""
        # 이번에 추가한 두 곳만 본다(저장소의 다른 문구는 채점 규칙 설명이라 대상 아님).
        chunks = []
        for marker, end in (("function overheatNoticeHTML(", "\n  const EVID_LABEL"),
                            ("let buyNote='';", "// 업종별 최고 성적")):
            self.assertIn(marker, self.app, f"{marker} 가 사라졌다.")
            chunks.append(self.app.split(marker)[1].split(end)[0])
        for chunk in chunks:
            hits = re.findall(r"[0-9]{1,3}(?:\.[0-9])?%", chunk)
            self.assertEqual(hits, [],
                             f"경고·공개 문구에 성과 숫자가 박혀 있다(실측값만 써야 한다): {hits}")


if __name__ == "__main__":
    unittest.main(verbosity=1)
