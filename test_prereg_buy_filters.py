"""사전등록 BUY 필터 검증 스크립트의 계약 테스트 (합성 자료, 외부 접속 없음).

검사하는 것
- 등록 상수가 실제 경고·집계 코드의 상수와 같다(문서와 코드가 갈라지지 않는다)
- 창 시작 전 기록·재구성·정밀분석·보류·중복·다른 모델 버전·아직 안 익은 판단·휴장일 유령 판단일은 제외되고 그 수가 보고된다
- 특징(급등·vol20)은 판단 당시 기록(버전 일치)만 쓴다. 없으면 '미기록'이다
- 판단일 20일 미만이면 효과 크기를 계산하지 않는다
- 결과가 가설 방향이면 PASS, 반대로 유의하면 FAIL_REVERSED로 그대로 보고한다
- Holm 보정은 원 p값보다 작아지지 않고 단계적으로 커진다
"""
import datetime
import unittest

import buy_warning as B
import buy_warning_evidence as E
import compute_team_weights as W
import evaluate_preregistered_buy_filters as P
from krx_calendar import is_krx_trading_day


def candles(values, start=datetime.date(2026, 9, 1)):
    """합성 일봉. 실제 KRX 달력을 따른다(주말·휴장일 없음) — 유령 판단일 제외 규칙과 어긋나지 않게."""
    out, d = [], start
    for v in values:
        while not is_krx_trading_day(d):
            d += datetime.timedelta(days=1)
        out.append({"date": d.isoformat(), "close": v})
        d += datetime.timedelta(days=1)
    return out


def recorded(warn, vol=3.0, available=True, version=B.OVERHEAT_VERSION):
    return {"version": version, "available": available, "warn": warn, "vol20": vol,
            "triggers": ["ret5"] if warn else []}


def entry(day, call="BUY", base=100, **extra):
    e = {"date": day, "base": base, "call": call, "tier": "auto",
         "baseModelVersion": W.BASE_MODEL_VERSION}
    e.update(extra)
    return e


class Registration(unittest.TestCase):
    def test_constants_match_production_code(self):
        r = P.REGISTRATION
        self.assertEqual(r["warningVersion"], B.OVERHEAT_VERSION)
        self.assertEqual(r["surgeThresholds"], {"ret5": B.OVERHEAT_RET5_PCT, "ret20": B.OVERHEAT_RET20_PCT})
        self.assertEqual(r["vol20Cut"], B.OVERHEAT_VOL20_PCT)
        self.assertEqual(r["crashThresholdPct"], E.BUY_CRASH_PCT)
        self.assertEqual(r["baseModelVersion"], W.BASE_MODEL_VERSION)
        self.assertGreater(r["windowStart"], r["registeredOn"], "창 시작은 등록일 뒤여야 한다")
        self.assertEqual(r["primaryFamily"], ["H0_crash", "H0_mean", "H1_crash", "H2_crash"])
        self.assertGreaterEqual(r["minDecisionDays"], 20)

    def test_holm_is_monotone_and_never_below_raw(self):
        raw = {"a": 0.01, "b": 0.04, "c": 0.03, "d": None}
        adj = P.holm_adjust(raw)
        self.assertNotIn("d", adj)
        for k, p in raw.items():
            if p is not None:
                self.assertGreaterEqual(adj[k], p)
        self.assertEqual(adj["a"], 0.03)   # 3 × 0.01
        self.assertEqual(adj["c"], 0.06)   # max(0.03, 2 × 0.03)
        self.assertEqual(adj["b"], 0.06)   # max(0.06, 1 × 0.04)
        # 가족 크기를 4로 고정하면 표본 부족(None)이 있어도 H0의 문턱이 느슨해지지 않는다.
        fixed = P.holm_adjust({"H0_crash": 0.02, "H0_mean": None, "H1_crash": None, "H2_crash": None}, m_total=4)
        self.assertEqual(fixed["H0_crash"], 0.08)

    def test_literals_are_frozen_and_match_production_today(self):
        """등록 상수는 리터럴이다. 운영 상수가 나중에 바뀌면 이 테스트가 크게 실패해 '등록이 깨진다'가 드러난다."""
        r = P.REGISTRATION
        self.assertEqual(r["baseModelVersion"], "base-2026-08-15-parity-hotfix")
        self.assertEqual(r["warningVersion"], "surge-only-2026-09-05c")
        self.assertEqual((r["crashThresholdPct"], r["surgeThresholds"], r["vol20Cut"]), (-5.0, {"ret5": 10.0, "ret20": 25.0}, 4.0))
        self.assertEqual(r["minDecisionDaysForFormulaChange"], 40)
        self.assertEqual(r["formulaChangingHypotheses"], ["H1_crash"])
        # 2026-09-05 창 열기 전 수정(§10 8항): 휴장일 유령 판단일은 판단일이 아니다.
        self.assertIs(r["excludeNonTradingDecisionDays"], True)
        self.assertEqual(r["tradingCalendar"], "krx_calendar.KRX_HOLIDAYS")


class Sampling(unittest.TestCase):
    def setUp(self):
        self.rows = candles([100] * 60)
        self.dates = [r["date"] for r in self.rows]
        self.start = P.REGISTRATION["windowStart"]
        self.in_window = [d for d in self.dates if d >= self.start]

    def test_pre_window_and_non_live_records_are_excluded_and_counted(self):
        day = self.in_window[0]
        before = [d for d in self.dates if d < self.start][-1]
        hist = {
            "000001": [entry(before)],                                # 창 이전
            "000002": [entry(day, recon=True)],                        # 재구성
            "000003": [entry(day, tier="deep")],                       # 정밀분석
            "000004": [entry(day, judgmentWithheld=True)],             # 보류
            "000005": [entry(day, baseModelVersion="something-else")],  # 다른 버전
            "000006": [entry(day), entry(day, call="SELL")],           # 중복 종목일
            "000007": [entry(self.in_window[-1])],                      # 아직 안 익음
            "000008": [entry(day)],                                    # 정상
            "000009": [entry(before), entry(day, recon=True), entry(day)],  # 시세 없는 종목
            "000010": [entry("2026-09-24")],                            # 창 안 평일 휴장일(유령 판단일)
            "000011": [entry(day)],                                    # 그 종목 일봉에 판단일 종가 없음
        }
        closes = {c: self.rows for c in hist if c != "000009"}
        closes["000011"] = [r for r in self.rows if r["date"] != day]
        rows, dropped, truncated = P.collect_rows(hist, closes, self.in_window[-1])
        self.assertEqual(dropped["noPriceSeries"], 1, "시세 없는 종목의 창 안 실제 자동 판단")
        self.assertEqual(dropped["noPriceSeriesOutOfScope"], 2, "시세 없는 종목의 창 밖·재구성 기록")
        self.assertEqual(dropped["notTradingDay"], 1, "휴장일 기록은 달력으로 걸러 판단일에서 뺀다")
        self.assertEqual(dropped["noDecisionSessionCandle"], 1, "판단일 종가가 없는 종목은 2차 방어로 뺀다")
        self.assertEqual([r["code"] for r in rows], ["000008"])
        self.assertEqual(dropped["beforeWindow"], 1)
        self.assertEqual(dropped["reconstructed"], 1)
        self.assertEqual(dropped["nonAuto"], 1)
        self.assertEqual(dropped["withheldOrUnknownCall"], 1)
        self.assertEqual(dropped["otherModelVersion"], 1)
        self.assertEqual(dropped["duplicateCodeDate"], 2, "중복 쌍은 두 행 모두 제외되므로 2건으로 센다")
        self.assertEqual(dropped["pendingOutcome"], 1)
        self.assertEqual(truncated, [])
        # 제외 사유 합계 + 남은 행 = 기록 전체(조용히 버리는 행이 없다).
        total_entries = sum(len(v) for v in hist.values())
        self.assertEqual(sum(dropped.values()) + len(rows), total_entries)

    def test_phantom_holiday_rows_never_count_as_decision_days(self):
        """2026-08-17형 유령 판단일: 창 안 휴장일 기록은 행에서도 판단일 수에서도 빠지고, 날짜가 보고된다."""
        day = self.in_window[0]
        holiday = "2026-09-24"
        self.assertFalse(is_krx_trading_day(datetime.date.fromisoformat(holiday)))
        self.assertNotIn(holiday, self.dates, "합성 일봉도 실제 달력을 따라야 한다")
        hist = {f"{i:06d}": [entry(day), entry(holiday)] for i in range(3)}
        report = P.evaluate(hist, {c: self.rows for c in hist}, self.in_window[-1])
        self.assertEqual(report["sample"]["decisionDays"], 1)
        self.assertEqual(report["sample"]["rows"], 3)
        self.assertEqual(report["sample"]["excluded"]["notTradingDay"], 3)
        self.assertEqual(report["sample"]["nonTradingDecisionDates"], [holiday])

    def test_outcome_is_fifth_session_close_and_respects_as_of(self):
        rows = candles([100] * 30 + [90, 91, 92, 93, 80, 120] + [100] * 20)
        dates = [r["date"] for r in rows]
        day = dates[29]
        self.assertGreaterEqual(day, self.start)
        hist = {"000001": [entry(day)]}
        got, dropped, _ = P.collect_rows(hist, {"000001": rows}, dates[34])
        self.assertAlmostEqual(got[0]["ret5"], -20.0)          # 5번째 거래일 종가 80
        got2, dropped2, _ = P.collect_rows(hist, {"000001": rows}, dates[33])
        self.assertEqual(got2, [])
        self.assertEqual(dropped2["pendingOutcome"], 1)

    def test_features_come_only_from_recorded_matching_version(self):
        day = self.in_window[0]
        hist = {
            "000001": [entry(day)],                                                  # 기록 없음
            "000002": [entry(day, overheat=recorded(True, version="overheat-2026-09-05b"))],  # 옛 버전
            "000003": [entry(day, overheat=recorded(True, vol=5.5))],
            "000004": [entry(day, overheat=recorded(False, vol=2.0, available=False))],  # 판정 불가
        }
        rows, _, _ = P.collect_rows(hist, {c: self.rows for c in hist}, self.in_window[-1])
        by = {r["code"]: r for r in rows}
        self.assertFalse(by["000001"]["featureRecorded"])
        self.assertIsNone(by["000001"]["warn"])
        self.assertFalse(by["000002"]["featureRecorded"])
        self.assertIsNone(by["000002"]["warn"])
        self.assertTrue(by["000003"]["warn"])
        self.assertEqual(by["000003"]["vol"], 5.5)
        self.assertIsNone(by["000004"]["warn"], "판정 불가는 '비급등'으로 세지 않는다")
        self.assertEqual(by["000004"]["vol"], 2.0)


class Gating(unittest.TestCase):
    def _synthetic(self, n_days, warn_crashes=True):
        """n_days 판단일, 하루 40개 BUY(급등 20·비급등 20) + HOLD 40. 급등 BUY만 -10%."""
        prices = candles([100] * 120)
        dates = [r["date"] for r in prices]
        start = P.REGISTRATION["windowStart"]
        days = [d for d in dates if d >= start][:n_days]
        hist, closes = {}, {}
        k = 0
        for d in days:
            i = dates.index(d)
            for g in range(40):
                warn = g < 20
                code = f"{k:06d}"; k += 1
                drop = (warn if warn_crashes else not warn)
                series = [dict(r) for r in prices]
                for r in series[i + 1:i + 6]:
                    r["close"] = 90 if drop else 101.5
                closes[code] = series
                hist[code] = [entry(d, overheat=recorded(warn, vol=6.0 if warn else 2.0)),
                              ]
            for g in range(40):
                code = f"{k:06d}"; k += 1
                closes[code] = prices
                hist[code] = [entry(d, call="HOLD", overheat=recorded(False))]
        as_of = dates[dates.index(days[-1]) + 6]
        return hist, closes, as_of

    def test_fewer_than_twenty_days_reports_counts_only(self):
        hist, closes, as_of = self._synthetic(12)
        report = P.evaluate(hist, closes, as_of)
        self.assertEqual(report["status"], "INSUFFICIENT")
        self.assertEqual(report["sample"]["decisionDays"], 12)
        self.assertEqual(report["sample"]["buy"], 12 * 40)
        for key in ("verdicts", "H1", "H2", "baseline", "holmP"):
            self.assertNotIn(key, report, f"판단일 부족인데 {key}가 계산됐다(훔쳐보기)")

    def test_hypothesised_direction_passes_and_reversed_is_reported(self):
        hist, closes, as_of = self._synthetic(22)
        report = P.evaluate(hist, closes, as_of)
        self.assertEqual(report["status"], "EVALUATED")
        # 22판단일: 산식을 바꾸는 H1은 잠정 통과(기록만), 표시만 바꾸는 H2는 통과.
        self.assertEqual(report["verdicts"]["H1_crash"], "PASS_PROVISIONAL")
        self.assertEqual(report["verdicts"]["H2_crash"], "PASS")
        self.assertEqual(report["independentBlocks"], 4)
        self.assertEqual(report["H1"]["crashGapPp"], 100.0)
        self.assertIn("40판단일", report["preRegisteredConsequences"]["H1_crash"])
        self.assertNotIn("kept", report["H1"])
        hist40, closes40, as_of40 = self._synthetic(40)
        report40 = P.evaluate(hist40, closes40, as_of40)
        self.assertEqual(report40["verdicts"]["H1_crash"], "PASS")
        self.assertIn("HOLD로 내리는 산식 변경을 PR·CI·병합까지 적용", report40["preRegisteredConsequences"]["H1_crash"])
        # 실질 효과 조건: 유의하지만 5%p 미만이면 산식을 바꾸지 않는다(자료를 보기 전에 고정).
        self.assertEqual(P.REGISTRATION["minActionEffectPp"], 5.0)
        self.assertEqual(P._verdict(3.0, {"ci95": [1, 5]}, +1, 0.01, 0.05, 5.0), "SIGNIFICANT_BUT_SMALL")
        self.assertEqual(P._verdict(6.0, {"ci95": [1, 9]}, +1, 0.01, 0.05, 5.0), "PASS")
        self.assertEqual(P._verdict(-6.0, {"ci95": [-9, -1]}, +1, 0.01, 0.05, 5.0), "FAIL_REVERSED")
        self.assertEqual(P._verdict(6.0, {"ci95": [-1, 9]}, +1, 0.30, 0.05, 5.0), "NOT_SIGNIFICANT")
        self.assertEqual(P._verdict(0.4, {"ci95": [0.1, 0.9]}, +1, 0.01, 0.05), "PASS", "H0에는 최소 효과 조건이 없다")
        # BUY 손실 50% vs 기준선(BUY+HOLD 동일 비중) 25% → H0_crash 반전(BUY가 더 물림)
        self.assertEqual(report["verdicts"]["H0_crash"], "FAIL_REVERSED")
        hist2, closes2, as_of2 = self._synthetic(22, warn_crashes=False)
        report2 = P.evaluate(hist2, closes2, as_of2)
        self.assertEqual(report2["verdicts"]["H1_crash"], "FAIL_REVERSED")
        self.assertIn("경고 표시를 제거", report2["preRegisteredConsequences"]["H1_crash"])
        for k, p in report2["holmP"].items():
            self.assertGreaterEqual(p, report2["rawP"][k])

    def test_bootstrap_needs_two_blocks_and_p_is_two_sided(self):
        dm = {str(i): [1.0, 2.0] for i in range(9)}
        self.assertIsNone(P.moving_block_bootstrap(dm, lambda v: v[0] / v[1], 5, 200, 1))
        dm = {str(i): [1.0, 2.0] for i in range(10)}
        res = P.moving_block_bootstrap(dm, lambda v: v[0] / v[1], 5, 200, 1)
        self.assertEqual(res["ci95"], [0.5, 0.5])
        self.assertLess(res["pTwoSided"], 0.02)
        zero = P.moving_block_bootstrap({str(i): [0.0, 1.0] for i in range(10)}, lambda v: v[0], 5, 200, 1)
        self.assertEqual(zero["pTwoSided"], 1.0)


if __name__ == "__main__":
    unittest.main(verbosity=1)
