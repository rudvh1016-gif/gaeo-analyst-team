#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""분석가 성적 정직성 계약 테스트 (2026-09-04 신설)

왜 이 테스트가 있나
────────────────────
2026-09-04 분석가 4인 전수 재검증에서 세 가지가 드러났다.

1. **DIANA는 채점된 판단이 0건인데 화면에 "보정 적중 50.0%"로 나왔다.**
   그 50%는 측정값이 아니라 아직 아무것도 안 재서 쓰는 출발값이다. 읽는 사람은
   "동전 던지기 수준으로 측정됐다"고 오해한다.

2. **적중률만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.**
   같은 판단을 두고 계속 "오른다"고만, 또는 계속 "내린다"고만 말해도 점수는 나온다.
   실측(판단일 10일):

   | 분석가 | 적중률 | 한 방향만 말하기 | 차이 | 차이의 95% 구간 |
   |---|---:|---:|---:|---|
   | TARO  | 52.1% | 50.6% | +1.5%p | -0.2 ~ +4.1%p (0 포함) |
   | QUANT | 45.0% | 52.1% | -7.1%p | -11.9 ~ -3.1%p (0 불포함) |
   | FLOW  | 55.4% | 55.7% | -0.3%p | -2.9 ~ +3.2%p (0 포함) |

   표본이 3배 넘게 큰 구버전 구간(판단일 36일)에서도 네 명 모두 0을 포함하거나
   음수였다. **한 명도 "한 방향만 말하기"보다 확실히 낫다고 확인되지 않았다.**
   그런데 화면은 1등에게 「이달의 MVP」 왕관을 씌우고 있었다(채점 3건 기준).

3. **작은 표본을 줄여 보는 장치(Bayesian shrinkage)가 사실상 꺼져 있었다.**
   줄이는 기준을 "채점 건수"로 세는데 같은 날 600종목이 한꺼번에 채점돼 건수가
   수천 건으로 불어난다. 실제로 깎이는 폭은 1%p도 안 된다. Constitution
   statisticalPolicy는 독립 단위를 decision_date로 정해 두고 있다.

이 파일은 위 상태로 되돌아가지 못하게 막는다. 산식·가중치는 바꾸지 않았고
(판단일 10일 < 20일, docs/gaeo_validation_policy.md), 그 사실도 함께 고정한다.
"""
import json
import os
import re
import unittest
import contextlib
import io
import shutil
import tempfile

import compute_team_weights as W

HERE = os.path.dirname(os.path.abspath(__file__))


def _app_source():
    with open(os.path.join(HERE, "app.js"), encoding="utf-8") as fh:
        return fh.read()


class TestNoSilentProductionChange(unittest.TestCase):
    """① 이번 변경은 표시·기록만 바꾼다. 실제 판단을 조용히 바꾸지 않는다."""

    def test_maturity_gate_is_off(self):
        self.assertFalse(
            W.WEIGHT_MATURITY_GATE,
            "WEIGHT_MATURITY_GATE가 켜져 있다. 켜면 판단일이 기준 미만인 분석가가 "
            "역할 사전비중으로 되돌아가 실제 BUY/HOLD/SELL이 바뀐다. "
            "판단일 20일이 쌓이고 사전등록 검증을 통과한 뒤 사람이 켜야 한다.",
        )

    def test_learning_knobs_untouched(self):
        # 근거가 모이기 전에 축소 강도·감도·역할 사전비중을 바꾸지 않는다.
        self.assertEqual(W.BAYES_PRIOR_N, 120)
        self.assertEqual(W.SKILL_SENSITIVITY, 3.0)
        self.assertEqual({a: W.RULES[a]["prior"] for a in W.ANALYSTS},
                         {"taro": 0.30, "diana": 0.12, "nova": 0.28, "flow": 0.30})

    def test_min_days_matches_evolution(self):
        # 결론 기준일수를 여기서 새로 지어내지 않는다(Constitution minEvalDays와 같은 값).
        with open(os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
                  encoding="utf-8") as fh:
            const = json.load(fh)
        self.assertEqual(W.MIN_DAYS_FOR_WEIGHT_LEARNING,
                         const["offlineDataPolicy"]["minEvalDays"])


class TestBlockBootstrap(unittest.TestCase):
    """② 신뢰구간은 판단일을 통째로 재추출한다(같은 날 종목은 독립이 아니다)."""

    @staticmethod
    def _days(n, own, bull, bear):
        return {f"2026-09-{i+1:02d}": {"own": list(own), "bull": list(bull),
                                       "bear": list(bear)} for i in range(n)}

    def test_identical_days_give_a_point_interval(self):
        # 모든 날이 똑같으면 어떤 날을 뽑아도 결과가 같다 → 구간이 한 점이어야 한다.
        ci = W._block_bootstrap(self._days(10, (6, 4), (6, 4), (4, 6)), W._stat_own)
        self.assertEqual(ci, [60.0, 60.0])

    def test_lift_is_own_minus_best_fixed_direction(self):
        # 본인 60% · 항상bull 60% · 항상bear 40% → 더 좋은 고정방향은 60% → 차이 0.
        ci = W._block_bootstrap(self._days(10, (6, 4), (6, 4), (4, 6)), W._stat_lift)
        self.assertEqual(ci, [0.0, 0.0])

    def test_lift_detects_real_skill(self):
        # 본인 90% · 항상bull 50% · 항상bear 50% → 차이 +40%p.
        ci = W._block_bootstrap(self._days(10, (9, 1), (5, 5), (5, 5)), W._stat_lift)
        self.assertEqual(ci, [40.0, 40.0])

    def test_too_few_days_returns_none(self):
        # 판단일이 2일이면 구간을 만들지 않는다. 억지로 만든 구간은 근거가 아니다.
        self.assertIsNone(W._block_bootstrap(self._days(2, (6, 4), (6, 4), (4, 6)),
                                             W._stat_own))

    def test_seed_is_fixed(self):
        # 같은 기록이면 항상 같은 구간이 나와야 한다(매 사이클 숫자가 흔들리면 안 된다).
        blocks = {f"2026-09-{i+1:02d}": {"own": [i, 10 - i], "bull": [5, 5],
                                         "bear": [5, 5]} for i in range(10)}
        self.assertEqual(W._block_bootstrap(blocks, W._stat_own),
                         W._block_bootstrap(blocks, W._stat_own))

    def test_variation_widens_the_interval(self):
        # 날마다 성적이 크게 다르면 구간이 넓어져야 한다.
        blocks = {}
        for i in range(20):
            hit = 10 if i >= 10 else 0
            blocks[f"2026-09-{i+1:02d}"] = {"own": [hit, 10 - hit],
                                            "bull": [5, 5], "bear": [5, 5]}
        ci = W._block_bootstrap(blocks, W._stat_own)
        self.assertIsNotNone(ci)
        self.assertGreater(ci[1] - ci[0], 20.0)


class TestGeneratedPayload(unittest.TestCase):
    """③ team_weights.js가 근거를 실제로 싣고 있는가."""

    @classmethod
    def setUpClass(cls):
        # Exercise the generator, not a committed payload from before this PR.
        # All writes stay in a disposable directory, including on Windows.
        with tempfile.TemporaryDirectory() as folder:
            for name in ("history.js", "analysis_data.json", "tickers.js"):
                shutil.copyfile(os.path.join(HERE, name), os.path.join(folder, name))
            previous = W.HERE
            try:
                W.HERE = folder
                with contextlib.redirect_stdout(io.StringIO()):
                    if W.main() != 0:
                        raise RuntimeError("team weights generator failed")
                cls.tw = W.load_js_object(os.path.join(folder, "team_weights.js"), "TEAM_WEIGHTS")
            finally:
                W.HERE = previous
        cls.acc = cls.tw["global"]["acc"]

    def test_every_analyst_carries_its_evidence(self):
        for a in W.ANALYSTS:
            st = self.acc[a]
            for key in ("uniqueDecisionDays", "minDaysForConclusion", "skillStatus",
                        "alwaysBullAcc", "alwaysBearAcc", "bestFixedDirectionAcc",
                        "liftVsFixedPp", "acc95", "lift95", "voice"):
                self.assertIn(key, st, f"{a}에 {key}가 없다 — 화면이 근거를 알 수 없다.")

    def test_unmeasured_accuracy_is_null_not_fifty(self):
        """채점 0건이면 adjustedAcc는 null이어야 한다. 50.0은 측정값이 아니다."""
        for a in W.ANALYSTS:
            st = self.acc[a]
            if st["n"] == 0:
                self.assertIsNone(
                    st["adjustedAcc"],
                    f"{a}는 채점 0건인데 adjustedAcc에 숫자가 들어 있다. "
                    "화면이 이 값을 실측 성적으로 그린다(DIANA 50.0% 오해 사례).")
                self.assertEqual(st["skillStatus"], "NOT_GRADED_YET")
                # 계산에는 계속 0.5를 쓴다 — 가중치가 사라지면 안 된다.
                self.assertEqual(st["adjustedAccUsedInWeights"], 50.0)

    def test_decision_days_never_exceed_graded_records(self):
        for a in W.ANALYSTS:
            st = self.acc[a]
            self.assertLessEqual(st["uniqueDecisionDays"], st["n"])

    def test_fixed_direction_baseline_is_complementary(self):
        """항상bull과 항상bear는 같은 행·같은 분모를 쓰므로 합이 100%여야 한다.

        다른 표본을 섞어 비교하면 기준선이 기준선 노릇을 못 한다.
        """
        for a in W.ANALYSTS:
            st = self.acc[a]
            if st["alwaysBullAcc"] is None or st["alwaysBearAcc"] is None:
                continue
            self.assertAlmostEqual(st["alwaysBullAcc"] + st["alwaysBearAcc"], 100.0,
                                   places=0, msg=f"{a}의 기준선 분모가 어긋났다.")

    def test_lift_matches_accuracy_minus_baseline(self):
        for a in W.ANALYSTS:
            st = self.acc[a]
            if st["acc"] is None or st["bestFixedDirectionAcc"] is None:
                continue
            self.assertAlmostEqual(st["liftVsFixedPp"],
                                   round(st["acc"] - st["bestFixedDirectionAcc"], 1),
                                   delta=0.11)  # displayed inputs are independently rounded

    def test_skill_status_agrees_with_the_interval(self):
        """라벨이 구간과 어긋나면 안 된다 — 화면이 그 라벨만 보고 색을 칠한다."""
        for a in W.ANALYSTS:
            st = self.acc[a]
            ci = st["lift95"]
            if st["n"] == 0:
                self.assertEqual(st["skillStatus"], "NOT_GRADED_YET")
            elif ci and ci[1] < 0:
                self.assertEqual(st["skillStatus"], "BELOW_FIXED_BASELINE")
            elif ci and ci[0] > 0:
                self.assertEqual(st["skillStatus"], "ABOVE_FIXED_BASELINE" if st.get("evidenceStatus") else "PROVEN_ABOVE")
            else:
                self.assertEqual(st["skillStatus"], "NOT_PROVEN")

    def test_push_is_reported_next_to_weight(self):
        """발언권 옆에 '실제로 미는 힘'이 있어야 한다.

        발언권 33%인데 평균적으로 종합점수를 1점도 못 움직이는 분석가가 있었다.
        계수만 보여 주면 그 사실을 알 수 없다.
        """
        for a in W.ANALYSTS:
            voice = self.acc[a]["voice"]
            for key in ("neutralPct", "meanAbsDeviation", "meanPushPoints"):
                self.assertIn(key, voice)
            if voice["meanAbsDeviation"] is not None:
                self.assertAlmostEqual(
                    voice["meanPushPoints"],
                    round(voice["meanAbsDeviation"] * self.tw["global"]["weights"][a], 2),
                    places=2)

    def test_day_based_shadow_is_recorded_but_not_applied(self):
        sh = self.tw["global"]["dayBasedShadow"]
        self.assertFalse(sh["applied"], "그림자 계산이 실제로 적용됐다.")
        self.assertFalse(sh["maturityGate"]["enabled"])
        for block in ("priorDays20", "priorDays120"):
            s = sum(sh[block]["weights"].values())
            self.assertAlmostEqual(s, 1.0, places=2)
        self.assertEqual(sh["nEffective"],
                         {a: self.acc[a]["uniqueDecisionDays"] for a in W.ANALYSTS})


class TestScreenTellsTheTruth(unittest.TestCase):
    """④ 화면이 근거보다 세게 말하지 않는가."""

    @classmethod
    def setUpClass(cls):
        cls.src = _app_source()

    # app.js는 수십만 자라서 assertIn/assertNotIn에 그대로 넣으면 실패 메시지가
    # 소스 전체를 쏟아낸다. 짧은 참/거짓으로 바꿔서 확인한다.
    def _has(self, needle, msg):
        self.assertTrue(needle in self.src, msg)

    def _lacks(self, needle, msg):
        self.assertFalse(needle in self.src, msg)

    def test_mvp_needs_a_proven_lift_not_a_record_count(self):
        self._lacks("const LB_MIN=3", "채점 3건이면 MVP를 붙이던 기준이 되살아났다.")
        self._has("r.status==='PROVEN_ABOVE'",
                  "MVP 판정이 '기준선을 확실히 넘었는가'를 보지 않는다.")
        self._has("r.days>=r.minDays", "MVP 판정이 판단일 수를 보지 않는다.")

    def test_leaderboard_shows_the_baseline(self):
        self._has("한 방향만 말해도", "리더보드에서 기준선 설명이 사라졌다.")
        self._has("lb-base-mark", "막대의 기준선 표시가 사라졌다.")
        # 카드 위 안내에도 기준선 개념이 남아 있어야 한다.
        self._has("그 기준선과 비교하되 독립된 새 기록으로도 확인해야 해요",
                  "리더보드 안내에서 기준선 설명이 사라졌다.")

    def test_leaderboard_shows_decision_days(self):
        self._has("판단 ${r.days===null?'자료 없음':r.days+'일'}",
                  "리더보드가 판단일 수를 보여주지 않는다. 채점 건수만 보이면 "
                  "10일치가 수천 건처럼 읽힌다.")

    def test_unmeasured_analyst_is_labelled_not_scored(self):
        self._has("아직 채점 전(성적 없음)",
                  "채점 0건인 분석가를 '아직 채점 전'으로 밝히지 않는다.")

    def test_shrinkage_claim_is_qualified(self):
        self._has("그 장치가 거의 작동하지 않습니다",
                  "'작은 표본은 50%로 줄인다'는 설명이 실제와 다른데 그대로 남아 있다.")

    def test_dead_accuracy_badge_is_gone(self):
        self._lacks("computeLeaderboard(",
                    "정의가 없는 함수를 다시 호출하고 있다(배지가 조용히 실패한다).")

    def test_accuracy_colour_follows_the_baseline_not_the_number(self):
        # 기준선을 못 넘은 높은 숫자를 초록으로 칠하면 근거보다 세게 말하는 것이다.
        self._lacks("r.acc>=60?'var(--green)'",
                    "적중률 색이 다시 숫자 높낮이로 정해지고 있다.")
        self._has("STATUS_TEXT[r.status]", "상태 라벨로 색을 정하는 코드가 사라졌다.")

    def test_placeholder_text_never_leaks_into_prose(self):
        """'자료 없음'은 값이 비었을 때만 쓰는 표시다(2026-09-05 PR #504가 대시(—)를
        일괄 치환하면서 리더보드 안내문 한가운데에 '자료 없음'이 박혔던 회귀).
        문장 중간(공백 뒤)에 나오면 치환 누수다. 값 표시는 따옴표나 태그 바로 뒤에 온다."""
        leaks = [self.src[m.start() - 40:m.end() + 20].replace("\n", " ")
                 for m in re.finditer(r"(?<=\s)자료 없음", self.src)]
        self.assertEqual(leaks, [], f"'자료 없음'이 문장 중간에 끼어 있다: {leaks}")
        self._has("「시장보다 잘했나」로 채점합니다.</b> 같은 기간",
                  "리더보드 채점 설명 문장이 끊겨 있다.")

    def test_no_hardcoded_performance_numbers_in_new_text(self):
        """새로 넣은 문장에 성과 숫자를 박아 넣지 않았는가(publicClaimPolicy)."""
        body = re.sub(r"/\*[\s\S]*?\*/", "", self.src)
        body = re.sub(r"^\s*//.*$", "", body, flags=re.M)
        for phrase in ("실력 확인 아직 안 됨", "기준선보다 낮음", "아직 채점 전"):
            self.assertTrue(phrase in body, f"화면 문구 '{phrase}'가 사라졌다.")
        hits = re.findall(r"(?:기준선|실력 폭|차이)[^<>\n]{0,12}[0-9]{1,3}\.[0-9]%", body)
        self.assertEqual(hits, [], f"기준선 관련 숫자가 하드코딩돼 있다: {hits}")


if __name__ == "__main__":
    unittest.main(verbosity=1)
