#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""급등 후 매수 경고 + BUY 실적 공개 계약 테스트 (2026-09-05 신설)

왜 이 테스트가 있나
────────────────────
소유자가 "사이트에 매일 뜨는 BUY 추천은 그래도 쓸데없는 걸 추천하진 않은 것 같다"고
했다. 실제로 대조해 보니 반대였다(docs/BUY_OVERHEAT_WARNING_20260905.md).

  · 지금까지 낸 BUY 1,474건의 적중률 40.1% (동전 던지기보다 낮다)
  · 27.5%는 5거래일 안에 기준가보다 5% 넘게 빠졌다
  · 최악: 예스티 -37.1%, 금호건설 -37.0%, GS건설 -35.3%

원인을 찾다가 훨씬 강한 규칙성이 나왔다. **판단 직전에 이미 많이 오른 뒤에 나온
BUY일수록 크게 물리는 비율이 높다.**

  직전 5거래일 -5% 이하(하락 중) → 이후 5거래일 평균 +4.54% · 폭락 17.5%
  직전 5거래일 +15% 이상(폭등)   → 이후 5거래일 평균 -2.48% · 폭락 36.0%

이건 BUY만의 문제가 아니라 시장 전체의 단기 되돌림이다(전 종목으로 같은 표를 만들어
대조했다). 문제는 **BUY가 하필 그 구간에 몰려서 나간다**는 것이다. 직전 5거래일
+7% 이상에서 나온 BUY가 전체의 48.2%인데, 시장 전체에서 그 구간의 비중은 20.2%다.

소유자가 낸 가설("며칠 연속 BUY면 위험")은 데이터가 반대로 말했다. 연속 BUY가 길수록
오히려 폭락률이 낮았고(1일차 31.5% vs 6일차 이상 20.1%), 두 모델 버전 구간에서
방향도 일치하지 않았다. 첫 BUY가 급등 직후에 나오는 경우가 많아서다
(1일차 직전 5거래일 평균 +8.71% vs 6일차 이상 +4.47%).

이 파일이 지키는 것
────────────────────
① 경고는 판단(call)을 절대 바꾸지 않는다.
② 경고 기준이 파이프라인 두 곳에서 갈라지지 않는다(갈라지면 화면 설명이 거짓이 된다).
③ 화면은 성과 숫자를 하드코딩하지 않고 러너가 계산한 값을 읽는다.
④ 자료가 없으면 "안전하다"가 아니라 "판정하지 않았다"로 나간다.
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
        self.assertFalse(A.overheat_flag(self.entry(ret5=A.OVERHEAT_RET5_PCT - 0.1))["warn"])
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

    # ── 2026-09-05 2차: 변동성(vol20)과 2단계 판정 ──────────────────────
    def test_volatility_alone_triggers_caution(self):
        """원래 크게 출렁이는 종목도 급등과 거의 같은 크기로 폭락을 예고했다."""
        r = A.overheat_flag({"tech": {"ret5": 1.0, "ret20": 2.0}, "risk": {"vol20": 5.0}})
        self.assertEqual(r["triggers"], ["vol20"])
        self.assertEqual(r["level"], "caution")

    def test_both_kinds_make_it_strong(self):
        """급등(시점 위험)과 변동성(성격 위험)은 다른 것을 잡아낸다.

        실측 2×2: 둘 다 아님 17.9% · 급등만 29.7% · 변동성만 30.5% · 둘 다 41.8%.
        """
        r = A.overheat_flag({"tech": {"ret5": 12.0, "ret20": 2.0}, "risk": {"vol20": 5.0}})
        self.assertEqual(r["level"], "strong")
        self.assertIn("vol20", r["triggers"])
        self.assertIn("ret5", r["triggers"])

    def test_two_price_triggers_are_still_one_kind(self):
        """ret5·ret20은 둘 다 '급등'이므로 합쳐도 caution이다(강한 경고가 아니다)."""
        r = A.overheat_flag({"tech": {"ret5": 12.0, "ret20": 30.0}, "risk": {"vol20": 1.0}})
        self.assertEqual(r["level"], "caution")

    def test_calm_and_steady_is_not_flagged(self):
        r = A.overheat_flag({"tech": {"ret5": 2.0, "ret20": 5.0}, "risk": {"vol20": 2.0}})
        self.assertEqual(r["level"], "none")
        self.assertFalse(r["warn"])

    def test_volatility_boundary_is_inclusive(self):
        base = {"tech": {"ret5": 0.0, "ret20": 0.0}}
        hi = dict(base, risk={"vol20": A.OVERHEAT_VOL20_PCT})
        lo = dict(base, risk={"vol20": A.OVERHEAT_VOL20_PCT - 0.01})
        self.assertTrue(A.overheat_flag(hi)["warn"])
        self.assertFalse(A.overheat_flag(lo)["warn"])


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
        cls.bo = (W.load_js_object(p, "TEAM_WEIGHTS")["global"]["team"] or {}).get("buyOutcome")

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
        total = sum(cm[lv]["n"] for lv in ("none", "caution", "strong") if cm[lv])
        self.assertEqual(total, self.bo["allTime"]["n"],
                         "단계별 합이 전체와 다르다 — 어떤 판단이 어느 칸에도 안 들어갔다.")

    def test_stronger_caution_means_worse_outcome(self):
        """단계가 올라갈수록 폭락률이 높아야 라벨이 뜻을 가진다."""
        cm = self.bo["cautionMatrix"]
        if not all(cm.get(lv) for lv in ("none", "caution", "strong")):
            self.skipTest("표본 부족")
        self.assertLess(cm["none"]["crashPct"], cm["caution"]["crashPct"])
        self.assertLess(cm["caution"]["crashPct"], cm["strong"]["crashPct"])

    def test_thresholds_are_stamped_in_the_output(self):
        self.assertEqual(self.bo["overheatThresholds"]["ret5"], W.OVERHEAT_RET5_PCT)
        self.assertEqual(self.bo["overheatThresholds"]["ret20"], W.OVERHEAT_RET20_PCT)
        self.assertEqual(self.bo["overheatThresholds"]["vol20"], W.OVERHEAT_VOL20_PCT)

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
        self._has("아무 종목이나 골랐으면 어땠을까요",
                  "무작위 기준선 공개 문구가 사라졌다.")
        self._has("나은 결과를 내지 못했어요",
                  "불리한 결론을 화면에서 뺐다.")

    def test_warning_uses_the_matching_cell(self):
        self._has("cm[oh.level]",
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
