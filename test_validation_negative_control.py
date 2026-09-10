#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""투자검증 안전 검사 — 음성 대조·재현성·기준 고정 (2026-09-10, 구간 7).

등록된 검증 절차(evaluate_preregistered_buy_filters.py · test_prereg_buy_filters.py)는 **건드리지 않는다.** 이 파일은 그 절차를
밖에서 다시 재는 안전망이다.

  · 음성 대조(negative control): 급등 여부·변동성·BUY 여부와 **무관하게** 결과가 나오도록 만든 합성 자료에서는 어떤 가설도 PASS 가
    나오면 안 된다. 검정 기계가 "아무 자료에서나 통과"를 내는 결함(방향 부호 뒤집힘·p 계산 오류)을 잡는다.
  · 재현성: 같은 입력을 두 번 평가하면 결과가 바이트 단위로 같다(seed 고정). 재현이 안 되면 --replay 도 뜻이 없다.
  · 기준 고정: config/validation_schedule.json 의 최소 표본·기준일이 등록 상수·등록 문서와 같다. 결과를 보고 싶어서 일정의
    최소 표본을 낮추거나 날짜를 당기면 여기서 실패한다(테스트 완화 금지).
"""
import datetime
import json
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import buy_warning as B                                   # noqa: E402
import compute_team_weights as W                          # noqa: E402
import evaluate_preregistered_buy_filters as E            # noqa: E402
from krx_calendar import is_krx_trading_day               # noqa: E402

PASSING = {"PASS", "PASS_PROVISIONAL"}


def candles(values, start=datetime.date(2026, 9, 1)):
    out, d = [], start
    for v in values:
        while not is_krx_trading_day(d):
            d += datetime.timedelta(days=1)
        out.append({"date": d.isoformat(), "close": v})
        d += datetime.timedelta(days=1)
    return out


def recorded(warn, vol):
    return {"version": B.OVERHEAT_VERSION, "available": True, "warn": warn, "vol20": vol, "triggers": ["ret5"] if warn else []}


def entry(day, call="BUY", base=100, **extra):
    e = {"date": day, "base": base, "call": call, "tier": "auto", "baseModelVersion": W.BASE_MODEL_VERSION}
    e.update(extra)
    return e


def null_world(n_days=20, per_group=8):
    """결과가 특징과 무관한 세계: 급등/비급등 BUY·HOLD 모두 정확히 같은 비율(1/4)로 -10%, 나머지 +1.5%."""
    prices = candles([100] * 90)
    dates = [r["date"] for r in prices]
    days = [d for d in dates if d >= E.REGISTRATION["windowStart"]][:n_days]
    hist, closes, k = {}, {}, 0
    for d in days:
        i = dates.index(d)
        for group in ("warn", "calm", "hold"):
            for g in range(per_group):
                code = f"{k:06d}"; k += 1
                crash = (g % 4 == 0)
                series = [dict(r) for r in prices]
                for r in series[i + 1:i + 6]:
                    r["close"] = 90 if crash else 101.5
                closes[code] = series
                if group == "hold":
                    hist[code] = [entry(d, call="HOLD", overheat=recorded(False, 2.0))]
                else:
                    hist[code] = [entry(d, overheat=recorded(group == "warn", 6.0 if group == "warn" else 2.0))]
    return hist, closes, dates[dates.index(days[-1]) + 6]


class NegativeControl(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.hist, cls.closes, cls.as_of = null_world()
        cls.report = E.evaluate(cls.hist, cls.closes, cls.as_of)

    def test_무관한_자료에서는_어떤_가설도_통과하지_않는다(self):
        self.assertEqual(self.report["status"], "EVALUATED", self.report.get("note"))
        verdicts = self.report["verdicts"]
        self.assertEqual(set(verdicts), {"H0_crash", "H0_mean", "H1_crash", "H2_crash"})
        passing = {h: v for h, v in verdicts.items() if v in PASSING}
        self.assertEqual(passing, {}, f"특징과 무관한 자료인데 통과가 나왔다: {passing}")

    def test_무관한_자료의_효과_크기는_0이다(self):
        h1 = self.report.get("H1") or {}
        h2 = self.report.get("H2") or {}
        for name, block in (("H1", h1), ("H2", h2)):
            gap = block.get("crashGapPp")
            if gap is not None:
                self.assertAlmostEqual(gap, 0.0, places=6, msg=f"{name} 손실률 차이가 0 이 아니다")

    def test_같은_입력은_같은_결과(self):
        again = E.evaluate(self.hist, self.closes, self.as_of)
        self.assertEqual(json.dumps(self.report, sort_keys=True, ensure_ascii=False),
                         json.dumps(again, sort_keys=True, ensure_ascii=False), "seed 가 고정돼 있지 않다 — 재현 불가")


class FrozenCriteria(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(os.path.join(HERE, "config", "validation_schedule.json"), encoding="utf-8") as fh:
            cls.cfg = json.load(fh)
        cls.by_id = {s["scheduleId"]: s for s in cls.cfg["schedules"]}
        with open(os.path.join(HERE, "docs", "PREREGISTRATION_BUY_FILTERS_20260905.md"), encoding="utf-8") as fh:
            cls.doc = fh.read()

    def test_일정의_최소_표본은_등록_상수와_같다(self):
        reg = E.REGISTRATION
        self.assertEqual(self.by_id["VS-20261019-PREREG-BUY-EVAL"]["minSample"]["decisionDays"], reg["minDecisionDays"])
        self.assertEqual(self.by_id["VS-20261116-PREREG-H1-RECONFIRM"]["minSample"]["decisionDays"], reg["minDecisionDaysForFormulaChange"])
        self.assertEqual((reg["minDecisionDays"], reg["minDecisionDaysForFormulaChange"]), (20, 40))

    def test_일정의_기준일은_등록_문서의_날짜다(self):
        self.assertEqual(self.by_id["VS-20261019-PREREG-BUY-EVAL"]["cutoffDate"], "2026-10-19")
        self.assertEqual(self.by_id["VS-20261116-PREREG-H1-RECONFIRM"]["cutoffDate"], "2026-11-16")
        self.assertIn("2026-10-19(월) 17:00 KST", self.doc)
        self.assertIn("2026-11-16(월) 17:00 KST", self.doc)
        for sid in ("VS-20261019-PREREG-BUY-EVAL", "VS-20261116-PREREG-H1-RECONFIRM"):
            self.assertTrue(self.by_id[sid]["noEarlyRun"])
            self.assertTrue(self.by_id[sid]["dueAt"].startswith(self.by_id[sid]["cutoffDate"] + "T17:00"))

    def test_창_시작과_등록일은_고정(self):
        self.assertEqual(E.REGISTRATION["windowStart"], "2026-09-07")
        self.assertEqual(E.REGISTRATION["registeredOn"], "2026-09-05")
        self.assertIn("2026-09-07", self.doc)

    def test_확정_평가_일정은_이상_규칙으로_결과를_바꾸지_않는다(self):
        for sid in ("VS-20261019-PREREG-BUY-EVAL", "VS-20261116-PREREG-H1-RECONFIRM"):
            self.assertEqual(self.by_id[sid].get("anomalyRules"), [], f"{sid}: 확정 평가는 표본 안에서 스스로 센다")
            self.assertEqual(self.by_id[sid]["autoConsequence"], "RECORD_AND_WRITE_FOLLOWUP_SPEC", "코드 변경은 자동 실행하지 않는다")


if __name__ == "__main__":
    unittest.main(verbosity=2)
