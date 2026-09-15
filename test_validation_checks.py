#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""예정 시험의 확인 도구 2개 계약 (2026-09-10, 구간 5).

  · check_team_weights_transition.py — 9/15 시험: DIANA 가중치가 하루에 얼마나 움직였는지 **직전 판(git 이력)** 과 비교한다.
    잠그는 것: 직전 판을 못 찾으면 OK 가 아니라 UNKNOWN_PREVIOUS · ±1.5% 안이면 OK · 5% 넘으면 ANOMALY ·
    method/shrinkageUnit 이 다르면 ANOMALY · 파일을 쓰지 않는다 · 산식 상수는 결과를 보고 바뀌지 않는다.
  · check_flow_validation_readiness.py — 9/23 시험: FLOW 6-arm 검증의 **표본 조건**만 센다(채점 없음).
    잠그는 것: 실제 자동 판단일만 센다(recon·비auto·보류 제외) · 5번째 거래일 종가가 기준일 전에 확정된 것만 ·
    flow_history 공백이 있는 판단일은 공통 날짜에서 빠진다 · 조건 미충족이면 NOT_READY + 예상 충족일 · arm 채점은 NOT_RUN.

두 도구 모두 표준 라이브러리 + 저장소 모듈만 쓴다. 네트워크는 team_weights 의 GitHub API 경로만 있고 여기서는 부르지 않는다.
"""
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import check_flow_validation_readiness as F      # noqa: E402
import check_team_weights_transition as T        # noqa: E402
from krx_calendar import is_krx_trading_day      # noqa: E402


# ------------------------------------------------------------------ team_weights 전환 확인

def tw_doc(diana=0.25, method=T.EXPECTED_METHOD, unit=T.EXPECTED_UNIT, generated="2026-09-14 15:40"):
    rest = round((1.0 - diana) / 3, 6)
    return {"generatedAt": generated, "method": method,
            "global": {"version": "v4", "weights": {"taro": rest, "diana": diana, "nova": rest, "flow": rest},
                       "acc": {"diana": {"n": 120, "uniqueDecisionDays": 6, "acc": 0.55, "adjustedAcc": 0.52,
                                         "rowBasedAdjustedAcc": 0.6, "shrinkageUnit": unit, "nEffectiveDays": 6,
                                         "skillStatus": "warming"}},
                       "dayBasedShadow": {"rowBasedLegacy": {"weights": {"taro": 0.2, "diana": 0.4, "nova": 0.2, "flow": 0.2}}}}}


def write_tw(root, doc):
    with open(os.path.join(root, "team_weights.js"), "w", encoding="utf-8") as fh:
        fh.write("// 자동 생성 (테스트)\nconst TEAM_WEIGHTS = " + json.dumps(doc, ensure_ascii=False, indent=1) + ";\n")


def git(root, *args, date=None):
    env = dict(os.environ, GIT_AUTHOR_NAME="t", GIT_AUTHOR_EMAIL="t@example.com",
               GIT_COMMITTER_NAME="t", GIT_COMMITTER_EMAIL="t@example.com")
    if date:
        env["GIT_AUTHOR_DATE"] = env["GIT_COMMITTER_DATE"] = date
    return subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, env=env, check=True)


class TeamWeightsTransition(unittest.TestCase):
    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-tw-")
        git(self.root, "init", "-q")

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def two_versions(self, prev, cur):
        write_tw(self.root, prev)
        git(self.root, "add", "team_weights.js")
        git(self.root, "commit", "-q", "-m", "v1", date="2026-09-14T15:40:00+09:00")
        write_tw(self.root, cur)
        git(self.root, "add", "team_weights.js")
        git(self.root, "commit", "-q", "-m", "v2", date="2026-09-15T09:30:00+09:00")
        return T.run(self.root, "2026-09-15")

    def test_판단일_단위_범위_안이면_OK(self):
        rep = self.two_versions(tw_doc(0.25), tw_doc(0.2525, generated="2026-09-15 09:30"))
        self.assertEqual(rep["status"], "OK", rep)
        self.assertEqual(rep["previous"]["source"], "git")
        self.assertAlmostEqual(rep["movePct"]["diana"], 1.0, places=2)
        self.assertTrue(rep["checks"]["methodIsDecisionDay"])
        self.assertTrue(rep["checks"]["dianaShrinkageUnit"])
        self.assertEqual(rep["problems"], [])

    def test_정상_범위를_넘지만_이상_문턱_아래면_WATCH(self):
        rep = self.two_versions(tw_doc(0.25), tw_doc(0.26))
        self.assertEqual(rep["status"], "WATCH")
        self.assertAlmostEqual(rep["movePct"]["diana"], 4.0, places=2)

    def test_하루_5퍼센트_넘게_움직이면_ANOMALY(self):
        rep = self.two_versions(tw_doc(0.25), tw_doc(0.27))
        self.assertEqual(rep["status"], "ANOMALY")
        self.assertTrue(any("8.00%" in p for p in rep["problems"]), rep["problems"])

    def test_method가_다르면_이동이_작아도_ANOMALY(self):
        rep = self.two_versions(tw_doc(0.25), tw_doc(0.25, method="role-prior-bayesian-shrinkage-v3-row"))
        self.assertEqual(rep["status"], "ANOMALY")
        self.assertFalse(rep["checks"]["methodIsDecisionDay"])
        self.assertAlmostEqual(rep["movePct"]["diana"], 0.0, places=2)

    def test_축소_단위가_판단일이_아니면_ANOMALY(self):
        rep = self.two_versions(tw_doc(0.25), tw_doc(0.25, unit="row"))
        self.assertEqual(rep["status"], "ANOMALY")
        self.assertFalse(rep["checks"]["dianaShrinkageUnit"])

    def test_직전_판을_못_찾으면_정상이_아니라_확인_불가(self):
        write_tw(self.root, tw_doc(0.25))
        git(self.root, "add", "team_weights.js")
        git(self.root, "commit", "-q", "-m", "only", date="2026-09-15T09:30:00+09:00")
        rep = T.run(self.root, "2026-09-15")            # repo/token 없음 → API 경로도 없음
        self.assertEqual(rep["status"], "UNKNOWN_PREVIOUS")
        self.assertIsNone(rep["previous"]["source"])
        self.assertIn("정상이라는 뜻이 아니다", rep["note"])

    def test_git_저장소가_아니어도_죽지_않고_확인_불가(self):
        plain = tempfile.mkdtemp(prefix="gaeo-tw-plain-")
        try:
            write_tw(plain, tw_doc(0.25))
            self.assertEqual(T.run(plain, "2026-09-15")["status"], "UNKNOWN_PREVIOUS")
        finally:
            shutil.rmtree(plain, ignore_errors=True)

    def test_파일을_바꾸지_않는다(self):
        self.two_versions(tw_doc(0.25), tw_doc(0.27))
        path = os.path.join(self.root, "team_weights.js")
        before = hashlib.sha256(open(path, "rb").read()).hexdigest()
        T.run(self.root, "2026-09-15")
        self.assertEqual(hashlib.sha256(open(path, "rb").read()).hexdigest(), before)
        self.assertEqual(git(self.root, "status", "--porcelain").stdout.strip(), "")

    def test_임계값은_등록된_숫자다(self):
        self.assertEqual((T.NORMAL_MAX_MOVE_PCT, T.ANOMALY_MOVE_PCT), (1.5, 5.0))
        self.assertEqual(T.EXPECTED_UNIT, "decision_day")
        self.assertIn("decision-day", T.EXPECTED_METHOD)

    def test_실제_저장소_파일을_읽을_수_있고_상태_어휘_안이다(self):
        doc = T.parse_team_weights(open(os.path.join(HERE, "team_weights.js"), encoding="utf-8").read())
        self.assertEqual(set(T.ANALYSTS) <= set((doc.get("global") or {}).get("weights") or {}), True)
        rep = T.run(HERE, datetime.date.today().isoformat())      # 얕은 clone 이면 UNKNOWN_PREVIOUS 가 정상
        self.assertIn(rep["status"], {"OK", "WATCH", "ANOMALY", "UNKNOWN_PREVIOUS"})
        self.assertEqual(rep["schemaVersion"], "gaeo_team_weights_transition_v1")


# ------------------------------------------------------------------ FLOW 표본 조건

def sessions(start, n):
    out, d = [], start
    while len(out) < n:
        if is_krx_trading_day(d):
            out.append(d.isoformat())
        d += datetime.timedelta(days=1)
    return out


class FlowReadiness(unittest.TestCase):
    N_DAYS = 25

    def setUp(self):
        self.cal = sessions(datetime.date(2026, 7, 1), 70)
        self.decision_days = self.cal[10:10 + self.N_DAYS]
        self.codes = ["000001", "000002", "000003"]
        self.closes = {c: [{"date": d, "close": 100 + (i % 7) * 0.3 + k} for i, d in enumerate(self.cal)]
                       for k, c in enumerate(self.codes)}
        self.hist = {}
        for c in self.codes:
            rows = [{"date": d, "tier": "auto", "call": "BUY" if i % 2 else "HOLD"} for i, d in enumerate(self.decision_days)]
            rows += [{"date": self.decision_days[0], "tier": "auto", "call": "BUY", "recon": True},     # 재구성
                     {"date": self.decision_days[1], "tier": "deep", "call": "BUY"},                    # 정밀(비auto)
                     {"date": self.decision_days[2], "tier": "auto", "call": None, "judgmentWithheld": True}]  # 보류
            self.hist[c] = rows
        self.as_of = self.cal[10 + self.N_DAYS + 6]
        self.flow_days = set(self.cal)

    def test_실제_자동_판단일만_센다(self):
        days = F.matured_auto_days(self.hist, self.closes, self.as_of)
        self.assertEqual(sorted(days), self.decision_days)
        self.assertEqual(days[self.decision_days[0]], 3, "재구성·정밀·보류 행은 세지 않는다(종목 3개 → 3행)")

    def test_5번째_거래일_종가가_기준일_뒤면_아직_익지_않았다(self):
        # 판단일(세션 0) 뒤 5번째 세션(i+5) 종가가 기준일 안에 있어야 익은 것이다(evaluate_preregistered_buy_filters 와 같은 규칙).
        last_idx = 10 + self.N_DAYS - 1
        as_of = self.cal[last_idx + 3]        # 마지막 두 판단일(+5·+4 세션 필요)은 제외, 세 번째 앞 날(+3)은 포함
        days = F.matured_auto_days(self.hist, self.closes, as_of)
        self.assertEqual(sorted(days), self.decision_days[:-2])
        as_of_full = self.cal[last_idx + 5]
        self.assertEqual(sorted(F.matured_auto_days(self.hist, self.closes, as_of_full)), self.decision_days)

    def test_공통_날짜는_5거래일_수급이_다_있는_판단일만(self):
        full = F.assess(self.hist, self.closes, self.flow_days, self.as_of)
        self.assertEqual(full["commonDays"], self.N_DAYS)
        self.assertEqual(full["maturedAutoDecisionDays"], self.N_DAYS)
        gap_sessions = self.cal[15:18]                            # 수급 3세션 공백
        gap = set(self.flow_days) - set(gap_sessions)
        partial = F.assess(self.hist, self.closes, gap, self.as_of)
        # 판단일 d 는 [d-4세션, d] 다섯 세션의 수급이 다 있어야 공통 날짜다 → 공백 세션 하나가 뒤따르는 4세션까지 지운다.
        lost = {d for d in self.decision_days
                if any(g in F.sessions_before(d, F.FLOW_LOOKBACK_SESSIONS, self.cal) for g in gap_sessions)}
        self.assertEqual(len(lost), 7)
        self.assertEqual(partial["commonDays"], self.N_DAYS - len(lost))
        self.assertEqual(sorted(set(self.decision_days) - lost), partial["commonDayList"])
        self.assertEqual(partial["status"], "NOT_READY")
        self.assertIsNotNone(partial["expectedReadyDateIfNoGaps"])
        self.assertGreater(partial["expectedReadyDateIfNoGaps"], self.as_of)
        self.assertTrue(is_krx_trading_day(datetime.date.fromisoformat(partial["expectedReadyDateIfNoGaps"])))

    def test_국면_3종이_안_되면_날짜가_충분해도_NOT_READY(self):
        # 시장 국면을 한 종류로 고정한다(합성 시세는 우연히 여러 국면이 나올 수 있다)
        original = F.build_market_regimes
        F.build_market_regimes = lambda closes: {d: {"key": "side_low"} for d in self.cal}
        try:
            r = F.assess(self.hist, self.closes, self.flow_days, self.as_of)
        finally:
            F.build_market_regimes = original
        self.assertEqual(r["commonDays"], self.N_DAYS)
        self.assertEqual(r["status"], "NOT_READY")
        self.assertEqual(r["regimeKindsMeetingMin"], ["side_low"])
        self.assertIsNone(r["expectedReadyDateIfNoGaps"], "날짜 수는 충분하므로 예상일은 없다(국면 부족은 기다려서 채워지는 것이 아니다)")

    def test_국면_unknown은_조건_충족_국면으로_세지_않는다(self):
        original = F.build_market_regimes
        F.build_market_regimes = lambda closes: {}
        try:
            r = F.assess(self.hist, self.closes, self.flow_days, self.as_of)
        finally:
            F.build_market_regimes = original
        self.assertEqual(r["regimeDays"], {"unknown": self.N_DAYS})
        self.assertEqual(r["regimeKindsMeetingMin"], [])
        self.assertEqual(r["status"], "NOT_READY")

    def test_조건이_다_차면_READY(self):
        keys = ["up_low", "down_high", "side_low"]
        fake = {d: {"key": keys[i % 3]} for i, d in enumerate(self.cal)}
        original = F.build_market_regimes
        F.build_market_regimes = lambda closes: fake
        try:
            r = F.assess(self.hist, self.closes, self.flow_days, self.as_of)
        finally:
            F.build_market_regimes = original
        self.assertEqual(r["status"], "READY", r)
        self.assertEqual(sorted(r["regimeKindsMeetingMin"]), sorted(keys))
        self.assertIsNone(r["expectedReadyDateIfNoGaps"])

    def test_arm_채점은_하지_않는다(self):
        r = F.assess(self.hist, self.closes, self.flow_days, self.as_of)
        self.assertTrue(r["armEvaluation"].startswith("NOT_RUN"))
        for forbidden in ("holm", "bootstrap", "accuracy", "hit", "winRate"):
            self.assertNotIn(forbidden, json.dumps(r).lower(), forbidden)

    def test_조건_상수는_등록된_숫자다(self):
        self.assertEqual((F.MIN_COMMON_DAYS, F.MIN_REGIME_KINDS, F.MIN_DAYS_PER_REGIME, F.HORIZON), (20, 3, 4, 5))

    def test_CLI는_입력이_없어도_죽지_않고_파일을_쓰지_않는다(self):
        root = tempfile.mkdtemp(prefix="gaeo-flow-")
        try:
            r = subprocess.run([sys.executable, os.path.join(HERE, "check_flow_validation_readiness.py"),
                                "--json", "--as-of", "2026-09-23", "--root", root],
                               capture_output=True, text=True, timeout=120, env=dict(os.environ, PYTHONUTF8="1"))
            self.assertEqual(r.returncode, 0, r.stderr)
            doc = json.loads(r.stdout)
            self.assertEqual((doc["status"], doc["maturedAutoDecisionDays"], doc["commonDays"]), ("NOT_READY", 0, 0))
            self.assertEqual(os.listdir(root), [])
        finally:
            shutil.rmtree(root, ignore_errors=True)


class PreviousVersionEligibility(unittest.TestCase):
    """직전 판 **자료 선택**의 정확성 — 2026-09-15 실측 결함의 회귀 시험.

    그날 GitHub API 가 기준시각(9/15 00:00 KST)을 16시간 넘긴 당일 커밋을 돌려줬는데
    코드가 그대로 받아들여, 오늘 파일을 오늘 파일과 비교하고 "이동 0.00% · OK" 를 냈다.
    숫자는 틀리지 않았지만 **아무것도 확인하지 못한 답**이었다.

    ⚠️ 여기서 검사하지 **않는** 것: 직전 판과 오늘 판의 SHA 가 달라야 한다거나,
    가중치 숫자가 달라야 한다는 조건. 진짜 전날 자료와 오늘 자료의 가중치가 같으면
    0.00% 가 정당하다. 검사할 것은 "비교 기준이 기준일 이전 자료인가" 하나다.
    """

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-elig-")
        git(self.root, "init", "-q")

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def commit(self, doc, when):
        write_tw(self.root, doc)
        git(self.root, "add", "team_weights.js")
        git(self.root, "commit", "-q", "-m", when, date=when)

    # ── 적격성 판정 자체 ──────────────────────────────────────────────
    def test_기준일_당일_생성분은_직전_판이_아니다(self):
        ok, why = T.previous_eligibility(tw_doc(generated="2026-09-15 16:32"),
                                         "2026-09-15T16:34:39+09:00", "2026-09-15")
        self.assertFalse(ok)
        self.assertEqual(why, "previous_commit_after_cutoff")

    def test_커밋시각을_몰라도_생성시각이_당일이면_거부한다(self):
        ok, why = T.previous_eligibility(tw_doc(generated="2026-09-15 16:32"), None, "2026-09-15")
        self.assertFalse(ok)
        self.assertEqual(why, "previous_generated_after_cutoff")

    def test_전날_자료는_적격이다(self):
        ok, why = T.previous_eligibility(tw_doc(generated="2026-09-14 15:40"),
                                         "2026-09-14T15:41:00+09:00", "2026-09-15")
        self.assertTrue(ok); self.assertIsNone(why)

    def test_자정_경계는_기준일_00시_KST다(self):
        # 9/14 23:59 KST 는 적격, 9/15 00:00 KST 는 부적격(경계 포함)
        self.assertTrue(T.previous_eligibility(tw_doc(generated="2026-09-14 23:59"),
                                               "2026-09-14T23:59:59+09:00", "2026-09-15")[0])
        self.assertFalse(T.previous_eligibility(tw_doc(generated="2026-09-15 00:00"),
                                                "2026-09-15T00:00:00+09:00", "2026-09-15")[0])

    def test_UTC로_적힌_커밋시각도_KST_기준으로_잰다(self):
        # 2026-09-14T15:30:00Z = 2026-09-15 00:30 KST → 기준일 당일이라 부적격
        ok, why = T.previous_eligibility(tw_doc(generated="2026-09-14 15:40"),
                                         "2026-09-14T15:30:00Z", "2026-09-15")
        self.assertFalse(ok); self.assertEqual(why, "previous_commit_after_cutoff")

    def test_생성시각을_읽지_못하면_적격으로_보지_않는다(self):
        ok, why = T.previous_eligibility(tw_doc(generated="어제쯤"), None, "2026-09-15")
        self.assertFalse(ok); self.assertEqual(why, "previous_generated_at_unreadable")

    # ── run() 통합 ────────────────────────────────────────────────────
    def test_당일_자료만_있으면_OK가_아니라_확인_불가다(self):
        # git 의 --before 는 스스로 걸러 주므로 후보 자체가 없다. 그래도 OK 가 아니다.
        self.commit(tw_doc(0.25, generated="2026-09-15 09:00"), "2026-09-15T09:05:00+09:00")
        self.commit(tw_doc(0.25, generated="2026-09-15 16:32"), "2026-09-15T16:34:00+09:00")
        rep = T.run(self.root, "2026-09-15")
        self.assertEqual(rep["status"], "UNKNOWN_PREVIOUS",
                         "당일 자료를 직전 판으로 받아들여 OK 를 냈다")
        self.assertIsNone(rep["movePct"]["diana"])
        self.assertFalse(rep["previous"]["eligible"])
        self.assertIn("정상이라는 뜻이 아니다", rep["note"])

    def test_커밋은_전날인데_내용이_당일_생성분이면_거부한다(self):
        # 커밋 시각만 보면 통과하지만 파일 안의 생성시각은 기준일 당일인 경우.
        # git 의 --before 로는 못 거른다 — previous_eligibility 가 두 번째 그물이다.
        self.commit(tw_doc(0.25, generated="2026-09-15 08:00"), "2026-09-14T23:50:00+09:00")
        self.commit(tw_doc(0.26, generated="2026-09-15 16:32"), "2026-09-15T16:34:00+09:00")
        rep = T.run(self.root, "2026-09-15")
        self.assertEqual(rep["status"], "UNKNOWN_PREVIOUS", rep.get("note"))
        self.assertEqual(rep["previous"]["ineligibleReason"], "previous_generated_after_cutoff")
        self.assertEqual([r["source"] for r in rep["previous"]["rejectedCandidates"]], ["git"])

    def test_진짜_전날과_숫자가_같으면_0퍼센트_OK가_정당하다(self):
        same = tw_doc(0.25, generated="2026-09-14 15:40")
        self.commit(same, "2026-09-14T15:41:00+09:00")
        self.commit(tw_doc(0.25, generated="2026-09-15 16:32"), "2026-09-15T16:34:00+09:00")
        rep = T.run(self.root, "2026-09-15")
        self.assertEqual(rep["status"], "OK", rep.get("note"))
        self.assertEqual(rep["movePct"]["diana"], 0.0)
        self.assertTrue(rep["previous"]["eligible"])
        self.assertNotEqual(rep["previous"]["sha"], None)

    def test_git가_후보를_못_내면_API_후보로_넘어간다(self):
        # 얕은 clone 인 Actions 러너가 실제로 이 경로를 탄다.
        self.commit(tw_doc(0.25, generated="2026-09-15 09:00"), "2026-09-15T09:05:00+09:00")
        good = tw_doc(0.25, generated="2026-09-14 15:40")
        original = T.previous_version_api
        T.previous_version_api = lambda repo, token, as_of: ("apisha", good, "2026-09-14T15:41:00+09:00")
        try:
            rep = T.run(self.root, "2026-09-15", repo="o/r", token="t")
        finally:
            T.previous_version_api = original
        self.assertEqual(rep["status"], "OK", rep.get("note"))
        self.assertEqual(rep["previous"]["source"], "github-api")
        self.assertEqual(rep["previous"]["sha"], "apisha")

    def test_git가_부적격_후보를_내면_API_적격_후보로_넘어간다(self):
        self.commit(tw_doc(0.25, generated="2026-09-15 08:00"), "2026-09-14T23:50:00+09:00")
        self.commit(tw_doc(0.26, generated="2026-09-15 16:32"), "2026-09-15T16:34:00+09:00")
        good = tw_doc(0.26, generated="2026-09-14 15:40")
        original = T.previous_version_api
        T.previous_version_api = lambda repo, token, as_of: ("apisha", good, "2026-09-14T15:41:00+09:00")
        try:
            rep = T.run(self.root, "2026-09-15", repo="o/r", token="t")
        finally:
            T.previous_version_api = original
        self.assertEqual(rep["status"], "OK", rep.get("note"))
        self.assertEqual(rep["previous"]["source"], "github-api")
        self.assertEqual([r["source"] for r in rep["previous"]["rejectedCandidates"]], ["git"])

    def test_두_경로_모두_부적격이면_확인_불가다(self):
        self.commit(tw_doc(0.25, generated="2026-09-15 09:00"), "2026-09-15T09:05:00+09:00")
        original = T.previous_version_api
        T.previous_version_api = lambda repo, token, as_of: (
            "apisha", tw_doc(0.25, generated="2026-09-15 12:00"), "2026-09-15T12:00:00+09:00")
        try:
            rep = T.run(self.root, "2026-09-15", repo="o/r", token="t")
        finally:
            T.previous_version_api = original
        self.assertEqual(rep["status"], "UNKNOWN_PREVIOUS")
        self.assertEqual([r["source"] for r in rep["previous"]["rejectedCandidates"]], ["github-api"])
        self.assertEqual(rep["previous"]["ineligibleReason"], "previous_commit_after_cutoff")

    def test_직전_판이_아예_없어도_OK로_적지_않는다(self):
        self.commit(tw_doc(0.25, generated="2026-09-15 16:32"), "2026-09-15T16:34:00+09:00")
        rep = T.run(self.root, "2026-09-15")
        self.assertEqual(rep["status"], "UNKNOWN_PREVIOUS")
        self.assertIn("정상이라는 뜻이 아니다", rep["note"])

    # ── 질의문자열 안전성 ─────────────────────────────────────────────
    def test_until을_UTC로_보내고_더하기_기호를_날것으로_싣지_않는다(self):
        seen = {}

        class FakeRes:
            def __init__(self, payload): self.payload = payload
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self): return self.payload

        def fake_urlopen(req, timeout=None):
            url = req.full_url
            if "api.github.com" in url:
                seen["url"] = url
                return FakeRes(json.dumps([{"sha": "s1", "commit": {
                    "committer": {"date": "2026-09-14T06:41:00Z"}}}]).encode())
            return FakeRes(("const TEAM_WEIGHTS = "
                            + json.dumps(tw_doc(0.25, generated="2026-09-14 15:40")) + ";").encode())

        original = T.urllib.request.urlopen
        T.urllib.request.urlopen = fake_urlopen
        try:
            sha, doc, commit_iso = T.previous_version_api("o/r", "tok", "2026-09-15")
        finally:
            T.urllib.request.urlopen = original
        query = seen["url"].split("?", 1)[1]
        self.assertNotIn("+09:00", query, "'+' 가 날것으로 실려 서버가 공백으로 읽는다")
        # 9/15 00:00 KST == 9/14 15:00 UTC
        self.assertIn("until=2026-09-14T15%3A00%3A00Z", query)
        self.assertEqual(sha, "s1")
        self.assertEqual(commit_iso, "2026-09-14T06:41:00Z")
        self.assertTrue(T.previous_eligibility(doc, commit_iso, "2026-09-15")[0])


if __name__ == "__main__":
    unittest.main(verbosity=2)
