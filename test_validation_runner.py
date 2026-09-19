#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""예정 시험 실행기(run_validation_schedule.py) + 일일 워크플로(ops-daily.yml) 계약 (2026-09-10, 구간 5).

## 왜 있나

예정 검증 시험(9/15·9/23·10/19·11/16)이 Claude 세션의 Routine 에만 있었다. 세션이 사라지면 시험도 사라진다.
그래서 일정 원본(config/validation_schedule.json)을 GitHub 이 읽어 실행기가 돌리게 했다. 실행기가 지켜야 할 약속은
"편해서" 어기기 쉬운 것들이라(조기 실행·중복 실행·결과 덮어쓰기·기준 완화) 여기서 잠근다.

## 잠그는 것

  · 예정 시각 전에는 실행하지 않는다. 지난 뒤에는 "몇 시간 지났는지"를 함께 남긴다(지연이 숨겨지지 않는다).
  · 같은 일정은 하루 1회. 최종 기록(COMPLETED·ANOMALY)이 있으면 다시 돌지 않는다. 실행 실패 3회·표본 부족 재확인 상한이면 사람에게.
  · 명령은 allowlist 만: 모르는 단계·미구현 단계·허용 밖 자리표시자·python3 아닌 실행 파일은 거부한다.
  · INSUFFICIENT 는 규칙이 정한 다음 확인 시점(everyDays 뒤 17:00, 또는 도구가 낸 예상 충족일)만 적는다. 유리한 날을 고르지 않는다.
  · 결과는 새 파일로만, 원장은 덧붙이기만(이전 줄은 바이트 하나도 바뀌지 않는다). 실패·이상이면 수리 요청서를 쓴다.
  · 동결 입력(.inputs.json.gz)으로 --replay 하면 같은 판정이 나온다. 기록을 손대면 재현 실패로 나온다.
  · 실행기는 산식·정책 파일을 쓰지 않는다(입력 SHA-256 이 실행 전후 같다). LLM 을 부르지 않는다.
  · ops-daily.yml 은 push 트리거가 없고, main 에서만 기록하며, 허용 경로 3곳만 커밋하고, force push 가 없다.

표준 라이브러리 + 저장소 모듈만 쓴다(test_ci_parity).
"""
import datetime
import gzip
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import buy_warning as B                                    # noqa: E402
import compute_team_weights as W                           # noqa: E402
import evaluate_preregistered_buy_filters as E             # noqa: E402
import run_validation_schedule as R                        # noqa: E402
from krx_calendar import is_krx_trading_day                # noqa: E402

WORKFLOW = os.path.join(HERE, ".github", "workflows", "ops-daily.yml")
# 2026-09-17: 공식 일별 시세 저장소(official_prices/)와 차트용 파생 파일(official_price_history.js)이 추가됐다 — ops-daily 가
ALLOWED_COMMIT_PATHS = ("docs/audits/validation_runs", "docs/VALIDATION_SCHEDULE.md", "docs/operations/repair_requests",
                        "official_prices", "official_price_history.js")

# 임시 저장소 안에서 allowlist 단계 역할을 하는 가짜 명령. knobs.json 으로 결과를 조종한다.
FAKE_STEP = r'''
import argparse, json, os, sys
ap = argparse.ArgumentParser()
ap.add_argument("--as-of"); ap.add_argument("--fail", action="store_true"); ap.add_argument("--prereg", action="store_true")
ap.add_argument("--flow", action="store_true"); ap.add_argument("--tw", action="store_true")
ap.add_argument("--count", action="store_true"); ap.add_argument("--touch", action="store_true")
ap.add_argument("--nojson", action="store_true"); ap.add_argument("--prereg-file")
a = ap.parse_args()
if a.fail:
    print("boom", file=sys.stderr); sys.exit(3)
knobs = json.load(open("knobs.json")) if os.path.exists("knobs.json") else {}
if a.touch:
    open("executed.txt", "a").write(a.as_of or "-"); print(json.dumps({"status": "OK", "asOf": a.as_of})); sys.exit(0)
if a.nojson:
    print("done, no json here"); sys.exit(0)
if a.prereg_file:
    print(open(a.prereg_file, encoding="utf-8").read()); sys.exit(0)
if a.count:
    days = int(knobs.get("days", 12))
    print(json.dumps({"status": "COUNTED", "evaluated": False, "asOf": a.as_of,
                      "sample": {"decisionDays": days, "rows": days * 4, "buy": days * 2, "excluded": {},
                                 "buyFeatureUnrecorded": int(knobs.get("unrecorded", 0))}})); sys.exit(0)
if a.prereg:
    days = int(knobs.get("days", 12))
    doc = {"status": "EVALUATED" if days >= 20 else "INSUFFICIENT", "asOf": a.as_of,
           "sample": {"decisionDays": days, "rows": days * 4, "buy": days * 2, "buyFeatureUnrecorded": int(knobs.get("unrecorded", 0))}}
    if days >= 20:
        doc["verdicts"] = {"H0_crash": "PASS", "H0_mean": "FAIL", "H1_crash": "PASS_PROVISIONAL" if days < 40 else "PASS", "H2_crash": "FAIL"}
        doc["holmP"] = {}; doc["preRegisteredConsequences"] = {}
    print(json.dumps(doc)); sys.exit(0)
if a.flow:
    print(json.dumps({"status": knobs.get("flow", "NOT_READY"), "asOf": a.as_of, "commonDays": 12, "conditions": {"minCommonDays": 20},
                      "regimeKindsMeetingMin": [], "expectedReadyDateIfNoGaps": knobs.get("expected", "2026-10-01")})); sys.exit(0)
if a.tw:
    print(json.dumps({"status": knobs.get("tw", "OK"), "note": "가짜 team_weights 확인"})); sys.exit(0)
print(json.dumps({"status": "OK", "asOf": a.as_of}))
'''


def kst(s):
    return R.parse_iso(s)


def base_config():
    return {
        "schemaVersion": "gaeo_validation_schedule_v1", "timezone": "Asia/Seoul", "updatedAt": "2026-09-10",
        "sourceOfTruth": "config/validation_schedule.json", "humanView": "docs/VALIDATION_SCHEDULE.md",
        "ledgerPath": "docs/audits/validation_runs/ledger.jsonl", "resultsDir": "docs/audits/validation_runs",
        "principles": [],
        "commands": {
            "ok_step": {"argv": ["python3", "fake_step.py", "--as-of", "{cutoffDate}"], "status": "available"},
            "fail_step": {"argv": ["python3", "fake_step.py", "--fail"], "status": "available"},
            "planned_step": {"argv": ["python3", "nothing.py"], "status": "planned"},
            "bad_placeholder": {"argv": ["python3", "fake_step.py", "{other}"], "status": "available"},
            "not_python": {"argv": ["bash", "-c", "echo"], "status": "available"},
            "prereg_evaluate": {"argv": ["python3", "fake_step.py", "--prereg", "--as-of", "{cutoffDate}"], "status": "available"},
            "prereg_sample_count": {"argv": ["python3", "fake_step.py", "--count", "--as-of", "{cutoffDate}"], "status": "available",
                                    "expectJson": True, "requiredFields": ["status", "sample.decisionDays", "sample.buyFeatureUnrecorded"]},
            "flow_validation_readiness": {"argv": ["python3", "fake_step.py", "--flow", "--as-of", "{cutoffDate}"], "status": "available"},
            "team_weights_transition_check": {"argv": ["python3", "fake_step.py", "--tw"], "status": "available"},
            "touch_step": {"argv": ["python3", "fake_step.py", "--touch", "--as-of", "{cutoffDate}"], "status": "available"},
            "nojson_step": {"argv": ["python3", "fake_step.py", "--nojson"], "status": "available", "expectJson": True},
            "thin_json_step": {"argv": ["python3", "fake_step.py", "--as-of", "{cutoffDate}"], "status": "available",
                               "expectJson": True, "requiredFields": ["status", "sample.decisionDays"]},
            "prereg_evaluate_from_file": {"argv": ["python3", "fake_step.py", "--prereg-file", "cli_prereg.json"], "status": "available"},
        },
        "schedules": [],
    }


def schedule(sid="VS-TEST", due="2026-09-15T17:00:00+09:00", cutoff="2026-09-15", steps=("ok_step",), **over):
    s = {"scheduleId": sid, "kind": "CONFIRMATION", "title": sid, "dueAt": due, "cutoffDate": cutoff,
         "steps": list(steps), "dedupeKey": sid, "noEarlyRun": True, "onInsufficient": {"rule": "report_only"},
         "policyFiles": [], "inputFreeze": {"inputs": []}}
    s.update(over)
    return s


def ledger_row(sid, run_at, status, **extra):
    row = {"scheduleId": sid, "runAt": run_at, "status": status}
    row.update(extra)
    return row


class TempRoot(unittest.TestCase):
    """가짜 저장소 루트: config + fake_step.py. 실제 저장소 파일은 건드리지 않는다."""

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-vs-")
        os.makedirs(os.path.join(self.root, "config"))
        with open(os.path.join(self.root, "fake_step.py"), "w", encoding="utf-8") as fh:
            fh.write(FAKE_STEP)
        self.cfg = base_config()

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def save(self, *schedules):
        self.cfg["schedules"] = list(schedules)
        with open(os.path.join(self.root, "config", "validation_schedule.json"), "w", encoding="utf-8") as fh:
            json.dump(self.cfg, fh, ensure_ascii=False)

    def knobs(self, **k):
        with open(os.path.join(self.root, "knobs.json"), "w", encoding="utf-8") as fh:
            json.dump(k, fh)

    def ledger(self):
        p = os.path.join(self.root, "docs", "audits", "validation_runs", "ledger.jsonl")
        if not os.path.exists(p):
            return []
        return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]

    def ledger_bytes(self):
        p = os.path.join(self.root, "docs", "audits", "validation_runs", "ledger.jsonl")
        return open(p, "rb").read() if os.path.exists(p) else b""

    def docs_files(self):
        out = []
        for base, _, files in os.walk(os.path.join(self.root, "docs")):
            out += [os.path.relpath(os.path.join(base, f), self.root) for f in files]
        return sorted(out)

    def run_main(self, *args):
        return R.main(["--root", self.root, "--runner-name", "unit-test", *args])


# ------------------------------------------------------------------ 계획

class PlanRules(unittest.TestCase):
    def setUp(self):
        self.cfg = base_config()
        # 재확인 규칙(recheck)이 있는 일정. report_only 는 표본 부족 뒤 재확인하지 않는다(별도 테스트).
        self.cfg["schedules"] = [schedule(onInsufficient={"rule": "recheck", "everyDays": 7})]

    def one(self, ledger, now):
        rows = R.plan(self.cfg, ledger, kst(now))
        self.assertEqual(len(rows), 1)
        return rows[0]

    def test_예정_시각_전에는_실행하지_않는다(self):
        self.assertEqual(self.one([], "2026-09-15T16:59:00+09:00")["action"], "NOT_DUE")
        self.assertEqual(self.one([], "2026-09-10T17:05:00+09:00")["action"], "NOT_DUE")
        row = self.one([], "2026-09-15T17:00:00+09:00")
        self.assertEqual(row["action"], "RUN")
        self.assertEqual(row["lateHours"], 0)

    def test_지연되면_지연_시간을_함께_남긴다(self):
        row = self.one([], "2026-09-17T17:05:00+09:00")
        self.assertEqual(row["action"], "RUN")
        self.assertAlmostEqual(row["lateHours"], 48.1, places=1)
        self.assertIn("지남", row["reason"])

    def test_같은_날에는_두_번_실행하지_않는다(self):
        led = [ledger_row("VS-TEST", "2026-09-15T17:05:00+09:00", "FAILED")]
        self.assertEqual(self.one(led, "2026-09-15T20:00:00+09:00")["action"], "SKIP_TODAY")
        # 다음 날에는 다시 시도한다(실패 1회는 아직 상한 아래)
        self.assertEqual(self.one(led, "2026-09-16T17:05:00+09:00")["action"], "RUN")

    def test_최종_기록이_있으면_다시_실행하지_않는다(self):
        for final in ("COMPLETED", "ANOMALY"):
            led = [ledger_row("VS-TEST", "2026-09-15T17:05:00+09:00", final)]
            self.assertEqual(self.one(led, "2026-10-01T17:05:00+09:00")["action"], "DONE", final)

    def test_표본_부족은_다음_확인_시점까지_기다린다(self):
        led = [ledger_row("VS-TEST", "2026-09-15T17:05:00+09:00", "INSUFFICIENT", nextCheckAt="2026-09-22T17:00:00+09:00")]
        self.assertEqual(self.one(led, "2026-09-16T17:05:00+09:00")["action"], "WAIT_RECHECK")
        self.assertEqual(self.one(led, "2026-09-22T16:59:00+09:00")["action"], "WAIT_RECHECK")
        row = self.one(led, "2026-09-22T17:05:00+09:00")
        self.assertEqual(row["action"], "RUN")
        self.assertEqual(row["recheck"], 1)

    def test_재확인_상한을_넘으면_사람에게_넘긴다(self):
        self.cfg["schedules"][0]["onInsufficient"] = {"rule": "recheck", "everyDays": 7, "maxRechecks": 3}
        led = [ledger_row("VS-TEST", f"2026-10-{d:02d}T17:05:00+09:00", "INSUFFICIENT", nextCheckAt=f"2026-10-{d + 7:02d}T17:00:00+09:00")
               for d in (1, 8, 15)]
        # 첫 실행 + 재확인 2회 = 3건 → 아직 한 번 더(3번째 재확인) 가능
        self.assertEqual(self.one(led, "2026-10-22T17:05:00+09:00")["action"], "RUN")
        led.append(ledger_row("VS-TEST", "2026-10-22T17:05:00+09:00", "INSUFFICIENT", nextCheckAt="2026-10-29T17:00:00+09:00"))
        row = self.one(led, "2026-10-29T17:05:00+09:00")
        self.assertEqual(row["action"], "RECHECK_LIMIT")
        self.assertIn("사람 확인", row["reason"])

    def test_재확인_상한_기본값은_3(self):
        self.assertEqual(R.DEFAULT_MAX_RECHECKS, 3)
        led = [ledger_row("VS-TEST", f"2026-10-{d:02d}T17:05:00+09:00", "INSUFFICIENT", nextCheckAt=f"2026-10-{d + 7:02d}T17:00:00+09:00")
               for d in (1, 8, 15, 22)]
        self.assertEqual(self.one(led, "2026-10-29T17:05:00+09:00")["action"], "RECHECK_LIMIT")

    def test_실행_실패_3회면_자동_재시도를_멈춘다(self):
        led = [ledger_row("VS-TEST", f"2026-09-{d}T17:05:00+09:00", "FAILED") for d in (15, 16, 17)]
        self.assertEqual(R.MAX_FAILED_RUNS, 3)
        self.assertEqual(self.one(led, "2026-09-18T17:05:00+09:00")["action"], "ESCALATED")

    def test_과거_완료_일정은_건드리지_않는다(self):
        self.cfg["schedules"][0]["status"] = "PAST_COMPLETED"
        self.assertEqual(self.one([], "2027-01-01T17:05:00+09:00")["action"], "DONE")

    def test_실제_원본은_구조_가드를_통과하고_확인_시험은_표본_수만_센다(self):
        cfg = R.load_config(HERE)
        self.assertEqual(R.structural_problems(cfg), [])
        by_id = {s["scheduleId"]: s for s in cfg["schedules"]}
        for sid in ("VS-20260915-DIANA-SHRINKAGE-CHECK", "VS-20260923-FLOW-READINESS-PREREG-SAMPLE"):
            self.assertIn("prereg_sample_count", by_id[sid]["steps"]); self.assertNotIn("prereg_evaluate", by_id[sid]["steps"])
        for sid in ("VS-20261019-PREREG-BUY-EVAL", "VS-20261116-PREREG-H1-RECONFIRM"):
            self.assertIn("prereg_evaluate", by_id[sid]["steps"])
            self.assertTrue(by_id[sid]["inputFreeze"]["freezeRequired"])
            self.assertTrue(by_id[sid]["onInsufficient"]["cutoffAdvances"])
        cnt = cfg["commands"]["prereg_sample_count"]
        self.assertEqual(cnt["argv"][1], "prereg_sample_count.py"); self.assertTrue(cnt["expectJson"])
        for name in ("prereg_evaluate", "team_weights_transition_check", "flow_validation_readiness", "dart_financials_readiness"):
            self.assertTrue(cfg["commands"][name].get("expectJson"), name)
            self.assertTrue(cfg["commands"][name].get("requiredFields"), name)
        for name in ("prereg_contract_tests", "honesty_contract_tests"):
            self.assertFalse(cfg["commands"][name].get("expectJson"), name)

    def test_실제_원본은_기준일_2026_09_10에_실행할_것이_없다(self):
        cfg = R.load_config(HERE)
        rows = R.plan(cfg, [], kst("2026-09-10T12:00:00+09:00"))
        self.assertEqual({r["action"] for r in rows} - {"DONE", "NOT_DUE"}, set(), rows)
        self.assertEqual(sum(r["action"] == "NOT_DUE" for r in rows), 4)


# ------------------------------------------------------------------ allowlist

class Allowlist(unittest.TestCase):
    def setUp(self):
        self.cfg = base_config()

    def test_allowlist_밖_미구현_자리표시자_python3_아닌_명령은_거부(self):
        for step in ("unknown_step", "planned_step", "bad_placeholder", "not_python"):
            with self.assertRaises(ValueError, msg=step):
                R.build_argv(self.cfg, step, "2026-09-15")

    def test_cutoffDate만_치환하고_실행_파일은_현재_파이썬(self):
        argv = R.build_argv(self.cfg, "ok_step", "2026-09-15")
        self.assertEqual(argv, [sys.executable, "fake_step.py", "--as-of", "2026-09-15"])

    def test_실제_원본의_모든_단계가_실행_가능한_명령을_만든다(self):
        cfg = R.load_config(HERE)
        for s in cfg["schedules"]:
            for step in s.get("steps", []):
                argv = R.build_argv(cfg, step, s["cutoffDate"])
                self.assertEqual(argv[0], sys.executable)
                if argv[1] == "-m":                       # python3 -m unittest <module> -q
                    module = next(a for a in argv[2:] if not a.startswith("-") and a != "unittest")
                    path = os.path.join(HERE, module + ".py")
                else:
                    path = os.path.join(HERE, argv[1])
                self.assertTrue(os.path.exists(path), f"{s['scheduleId']}/{step}: {path} 없음")


# ------------------------------------------------------------------ 상태 판정

def step(exit_code=0, js=None):
    return {"argv": [], "exit": exit_code, "durationSec": 0, "stdoutTail": "", "stderrTail": "", "json": js}


class StatusDecision(unittest.TestCase):
    def test_단계가_하나라도_실패하면_FAILED(self):
        st, note = R.decide_status(schedule(), {"a": step(0), "b": step(3)})
        self.assertEqual(st, "FAILED")
        self.assertIn("b", note)

    def test_판단일_부족이면_INSUFFICIENT_효과_없이(self):
        s = schedule(kind="EVALUATION", minSample={"decisionDays": 20})
        pre = {"status": "INSUFFICIENT", "sample": {"decisionDays": 12}}
        st, note = R.decide_status(s, {"prereg_evaluate": step(0, pre)})
        self.assertEqual(st, "INSUFFICIENT")
        self.assertIn("12", note)

    def test_충분하면_COMPLETED(self):
        s = schedule(kind="EVALUATION", minSample={"decisionDays": 20})
        pre = {"status": "EVALUATED", "sample": {"decisionDays": 21}, "verdicts": {"H1_crash": "PASS_PROVISIONAL"}}
        self.assertEqual(R.decide_status(s, {"prereg_evaluate": step(0, pre)})[0], "COMPLETED")

    def test_재확인은_PASS_PROVISIONAL이면_INSUFFICIENT(self):
        s = schedule(kind="RECONFIRMATION", minSample={"decisionDays": 40})
        pre = {"status": "EVALUATED", "sample": {"decisionDays": 45}, "verdicts": {"H1_crash": "PASS_PROVISIONAL"}}
        self.assertEqual(R.decide_status(s, {"prereg_evaluate": step(0, pre)})[0], "INSUFFICIENT")
        pre["verdicts"]["H1_crash"] = "PASS"
        self.assertEqual(R.decide_status(s, {"prereg_evaluate": step(0, pre)})[0], "COMPLETED")

    def test_sample이_없으면_FAILED(self):
        s = schedule(kind="EVALUATION", minSample={"decisionDays": 20})
        self.assertEqual(R.decide_status(s, {"prereg_evaluate": step(0, {"status": "EVALUATED"})})[0], "FAILED")

    def test_표본_수_확인_결과의_기록_누락도_이상으로_잡는다(self):
        s = schedule(anomalyRules=["buy_feature_unrecorded"])
        cnt = {"status": "COUNTED", "evaluated": False, "sample": {"decisionDays": 3, "buyFeatureUnrecorded": 2}}
        st, note = R.decide_status(s, {"prereg_sample_count": step(0, cnt)})
        self.assertEqual(st, "ANOMALY"); self.assertIn("2건", note)
        cnt["sample"]["buyFeatureUnrecorded"] = 0
        self.assertEqual(R.decide_status(s, {"prereg_sample_count": step(0, cnt)})[0], "COMPLETED")

    def test_결과_형식_오류는_exit0이어도_FAILED(self):
        st, note = R.decide_status(schedule(), {"a": dict(step(0, None), schemaError="결과 JSON 없음")})
        self.assertEqual(st, "FAILED"); self.assertIn("결과 형식 오류", note)
        self.assertEqual(R.schema_error({"expectJson": True, "requiredFields": ["sample.decisionDays"]}, 0, {"sample": {}}),
                         "결과 JSON 에 필수 필드 없음: sample.decisionDays")
        self.assertIsNone(R.schema_error({"expectJson": True, "requiredFields": ["sample.decisionDays"]}, 0, {"sample": {"decisionDays": 0}}))
        self.assertIsNone(R.schema_error({"expectJson": False}, 0, None))
        self.assertIsNone(R.schema_error({"expectJson": True}, 3, None), "exit 가 0 이 아니면 형식이 아니라 실패로 잡는다")

    def test_FLOW_표본_미충족은_INSUFFICIENT(self):
        s = schedule(kind="SAMPLE_CHECK")
        flow = {"status": "NOT_READY", "commonDays": 12, "conditions": {"minCommonDays": 20}, "regimeKindsMeetingMin": []}
        st, note = R.decide_status(s, {"flow_validation_readiness": step(0, flow)})
        self.assertEqual(st, "INSUFFICIENT")
        self.assertIn("채점하지 않음", note)
        flow["status"] = "READY"
        self.assertEqual(R.decide_status(s, {"flow_validation_readiness": step(0, flow)})[0], "COMPLETED")

    def test_이상_규칙은_일정에_적힌_것만_적용한다(self):
        tw_bad = step(0, {"status": "ANOMALY", "note": "DIANA +8%"})
        pre_unrec = step(0, {"status": "INSUFFICIENT", "sample": {"decisionDays": 5, "buyFeatureUnrecorded": 3}})
        with_rules = schedule(anomalyRules=["team_weights_anomaly", "buy_feature_unrecorded"])
        self.assertEqual(R.decide_status(with_rules, {"team_weights_transition_check": tw_bad})[0], "ANOMALY")
        self.assertEqual(R.decide_status(with_rules, {"prereg_evaluate": pre_unrec})[0], "ANOMALY")
        # 규칙이 없는 일정(확정 평가)은 같은 결과를 이상으로 격상하지 않는다 — 표본 안에서 스스로 센다
        without = schedule(kind="EVALUATION", minSample={"decisionDays": 20})
        self.assertEqual(R.decide_status(without, {"team_weights_transition_check": tw_bad})[0], "COMPLETED")
        self.assertEqual(R.decide_status(without, {"prereg_evaluate": pre_unrec})[0], "INSUFFICIENT")

    def test_다음_확인_시점_규칙(self):
        s = schedule(onInsufficient={"rule": "recheck", "everyDays": 7, "maxRechecks": 3})
        now = kst("2026-10-19T17:05:33+09:00")
        self.assertEqual(R.next_check(s, now), "2026-10-26T17:00:00+09:00")
        # 도구가 낸 예상 충족일이 미래면 그 날 17:00, 과거면 무시
        self.assertEqual(R.next_check(s, now, "2026-11-03"), "2026-11-03T17:00:00+09:00")
        self.assertEqual(R.next_check(s, now, "2026-10-01"), "2026-10-26T17:00:00+09:00")
        self.assertEqual(R.next_check(s, now, "not-a-date"), "2026-10-26T17:00:00+09:00")


# ------------------------------------------------------------------ 실행·기록

class ExecuteInTempRoot(TempRoot):
    def test_기록은_새_파일과_원장_한_줄_그리고_다음날엔_DONE(self):
        self.save(schedule())
        code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply", "--json", os.path.join(self.root, "out.json"))
        self.assertEqual(code, 0)
        led = self.ledger()
        self.assertEqual(len(led), 1)
        self.assertEqual((led[0]["scheduleId"], led[0]["status"], led[0]["cutoffDate"], led[0]["runner"]),
                         ("VS-TEST", "COMPLETED", "2026-09-15", "unit-test"))
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertEqual(result["schemaVersion"], "gaeo_validation_run_v1")
        self.assertEqual(result["status"], "COMPLETED")
        self.assertEqual(result["steps"]["ok_step"]["json"]["asOf"], "2026-09-15")
        self.assertEqual(result["runAt"][:16], "2026-09-15T17:05")
        out = json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))
        self.assertTrue(out["notify"])
        rows = R.plan(self.cfg, self.ledger(), kst("2026-09-16T17:05:00+09:00"))
        self.assertEqual(rows[0]["action"], "DONE")

    def _synthetic_root(self, n_days):
        hist, closes, as_of = synthetic(n_days=n_days)
        with open(os.path.join(self.root, "history.js"), "w", encoding="utf-8") as fh:
            fh.write("// 자동 생성\nconst LIVE_HISTORY = " + json.dumps(hist, ensure_ascii=False) + ";\n")
        with open(os.path.join(self.root, "analysis_data.json"), "w", encoding="utf-8") as fh:
            json.dump({"fetchedAt": "2026-10-19 16:00", "stocks": {c: {"daily": rows} for c, rows in closes.items()}}, fh)
        return hist, closes, as_of

    def _cli_file(self, hist, closes, as_of, mutate=None):
        rep = E.evaluate(hist, closes, as_of)
        if mutate:
            mutate(rep)
        with open(os.path.join(self.root, "cli_prereg.json"), "w", encoding="utf-8") as fh:
            json.dump(rep, fh)
        return rep

    def _eval_schedule(self, cutoff, **over):
        self.cfg["commands"]["prereg_evaluate"] = {"argv": ["python3", "fake_step.py", "--prereg-file", "cli_prereg.json"], "status": "available",
                                                   "expectJson": True, "requiredFields": ["status", "sample.decisionDays"]}
        return schedule(kind="EVALUATION", minSample={"decisionDays": 20}, steps=("prereg_evaluate",),
                        due=f"{cutoff}T17:00:00+09:00", cutoff=cutoff,
                        onInsufficient={"rule": "recheck", "everyDays": 7, "maxRechecks": 3},
                        inputFreeze={"inputs": ["history.js", "analysis_data.json"], "freezeRequired": True}, **over)

    def test_원장은_덧붙이기만_한다_확정_평가는_동결_입력이_공식이고_재확인_기준일은_전진한다(self):
        # 합성 입력(진짜 history.js 아님). 12판단일 → INSUFFICIENT → 재확인(기준일 전진) → … → 20일 이상이면 COMPLETED.
        hist, closes, as_of12 = self._synthetic_root(12)
        self.save(self._eval_schedule(as_of12))
        self._cli_file(hist, closes, as_of12)
        self.assertEqual(self.run_main("--now", f"{as_of12}T17:05:00+09:00", "--apply"), 0)
        first = self.ledger_bytes()
        led = self.ledger()
        self.assertEqual(led[0]["status"], "INSUFFICIENT")
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertEqual(result["officialSource"], "frozen_inputs")
        self.assertEqual(result["official"]["status"], "INSUFFICIENT")
        self.assertTrue(result["inputsPath"] and os.path.exists(os.path.join(self.root, result["inputsPath"])), "동결 추출본은 INSUFFICIENT 여도 남긴다")
        # 다음 날: 기다린다(아무것도 쓰지 않는다)
        nxt = led[0]["nextCheckAt"]
        self.assertEqual(self.run_main("--now", f"{as_of12}T18:05:00+09:00", "--apply"), 0)
        self.assertEqual(self.run_main("--now", (kst(nxt) - datetime.timedelta(days=1)).isoformat(), "--apply"), 0)
        self.assertEqual(self.ledger_bytes(), first)
        # 재확인: 표본이 자란 새 입력(40판단일) + 전진한 기준일(nextCheckAt 날짜). 20일이 익을 때까지 미리 정한 주기로만 다시 본다.
        hist, closes, _ = self._synthetic_root(40)
        statuses = ["INSUFFICIENT"]
        for n in range(1, 4):
            cutoff = nxt[:10]
            rep = self._cli_file(hist, closes, cutoff)
            self.assertEqual(self.run_main("--now", (kst(nxt) + datetime.timedelta(minutes=5)).isoformat(), "--apply"), 0)
            led = self.ledger()
            self.assertTrue(self.ledger_bytes().startswith(first), "원장의 이전 줄이 바뀌었다")
            self.assertEqual((led[-1]["cutoffDate"], led[-1]["recheckId"]), (cutoff, f"VS-TEST-R{n}"))
            statuses.append(led[-1]["status"])
            if led[-1]["status"] == "COMPLETED":
                self.assertEqual(rep["status"], "EVALUATED")
                break
            nxt = led[-1]["nextCheckAt"]
        self.assertEqual(statuses[-1], "COMPLETED", statuses)
        self.assertTrue(len(statuses) >= 3, "기준일이 전진해야 표본이 큰다 — 고정 기준일이면 영원히 INSUFFICIENT 다")
        self.assertEqual(len({r["resultPath"] for r in led}), len(led), "결과 파일은 새 파일로만")
        self.assertTrue(all(os.path.exists(os.path.join(self.root, r["resultPath"])) for r in led))
        last = json.load(open(os.path.join(self.root, led[-1]["resultPath"]), encoding="utf-8"))
        self.assertEqual(last["evaluationDate"], led[-1]["cutoffDate"]); self.assertEqual(last["scheduledAt"], f"{as_of12}T17:00:00+09:00")
        # 후속 명세는 EVALUATED 결과에만, 코드 변경 없이 · 공식 판정 출처가 적힌다
        followup = [f for f in self.docs_files() if f.endswith(".followup.md")]
        self.assertEqual(len(followup), 1)
        body = open(os.path.join(self.root, followup[0]), encoding="utf-8").read()
        self.assertIn("코드 변경은 하지 않았다", body); self.assertIn("frozen_inputs", body)
        # 재현: 동결 추출본 + 결과 파일 → 같은 판정
        self.assertEqual(R.main(["--replay", os.path.join(self.root, last["inputsPath"]), "--result", os.path.join(self.root, last["resultPath"])]), 0)
        # 최종 기록 뒤에는 DONE
        self.assertEqual(R.plan(self.cfg, self.ledger(), kst(nxt) + datetime.timedelta(days=30))[0]["action"], "DONE")

    def test_확정_평가에서_CLI_결과가_동결_판정과_다르면_FAILED(self):
        hist, closes, as_of = self._synthetic_root(12)
        self.save(self._eval_schedule(as_of))
        def tamper(rep):
            rep["sample"]["rows"] = rep["sample"]["rows"] + 1
        self._cli_file(hist, closes, as_of, mutate=tamper)
        self.assertEqual(self.run_main("--now", f"{as_of}T17:05:00+09:00", "--apply"), 1)
        led = self.ledger()
        self.assertEqual(led[0]["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertIn("다르다", result["note"]); self.assertIn("sample", result["note"])
        self.assertTrue(os.path.exists(os.path.join(self.root, "docs", "operations", "repair_requests", "INC-VS-VS-TEST.md")))

    def test_계획만_모드는_아무것도_실행하지_않고_쓰지도_않는다(self):
        # C1: 예전에는 계획 모드도 단계를 실행하고 파일만 안 썼다(외부 호출·부작용). 이제 실행 자체가 0 이다.
        self.save(schedule(steps=("touch_step",)))
        code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--json", os.path.join(self.root, "out.json"))
        self.assertEqual(code, 0)
        self.assertEqual(self.docs_files(), [])
        self.assertFalse(os.path.exists(os.path.join(self.root, "executed.txt")), "계획 모드에서 단계가 실행됐다")
        out = json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))
        self.assertFalse(out["apply"])
        self.assertEqual(out["plan"][0]["action"], "RUN")
        self.assertEqual(out["results"], {}, "계획 모드는 결과를 내지 않는다(실행 0)")
        self.assertFalse(out["notify"])
        # --apply 면 실제로 실행된다
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 0)
        self.assertTrue(os.path.exists(os.path.join(self.root, "executed.txt")))

    def test_미래_시각_리허설은_운영_루트에서_거부된다(self):
        # C1: 실제 저장소 루트(HERE)에서 미래 --now 는 계획 모드여도 거부(exit 2). 임시 루트에서는 허용(합성 입력).
        self.assertEqual(R.main(["--now", "2099-01-01T17:05:00+09:00"]), 2)
        self.assertEqual(R.main(["--now", "2099-01-01T17:05:00+09:00", "--apply"]), 2)
        self.save(schedule())
        self.assertEqual(self.run_main("--now", "2099-01-01T17:05:00+09:00"), 0)

    def test_구조_가드_확인_시험에_확정_평가_명령이_있으면_아무것도_실행하지_않는다(self):
        # C1: 9/15·9/23 같은 확인 시험(CONFIRMATION·SAMPLE_CHECK)에 prereg_evaluate 가 들어가면 exit 2, 파일 0, 실행 0.
        self.save(schedule(kind="CONFIRMATION", steps=("prereg_evaluate", "touch_step")))
        code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply", "--json", os.path.join(self.root, "out.json"))
        self.assertEqual(code, 2)
        self.assertEqual(self.docs_files(), [])
        self.assertFalse(os.path.exists(os.path.join(self.root, "executed.txt")))
        out = json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))
        self.assertTrue(out["structuralProblems"])
        self.assertTrue(out["notify"])
        self.assertTrue(R.structural_problems({"schedules": [schedule(kind="SAMPLE_CHECK", steps=("prereg_evaluate",))], "commands": self.cfg["commands"]}))
        self.assertFalse(R.structural_problems({"schedules": [schedule(kind="SAMPLE_CHECK", steps=("prereg_sample_count",))], "commands": self.cfg["commands"]}))
        self.assertTrue(R.structural_problems({"schedules": [schedule(kind="EVALUATION", steps=("ok_step",))], "commands": self.cfg["commands"]}),
                        "확정 평가에 prereg_evaluate 가 없어도 구조 문제다")

    def test_결과_JSON이_없거나_필드가_빠지면_exit0이어도_FAILED(self):
        # C2
        self.save(schedule(steps=("nojson_step",)))
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 1)
        led = self.ledger()
        self.assertEqual(led[0]["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertIn("결과 JSON 없음", result["note"])
        self.assertEqual(result["steps"]["nojson_step"]["exit"], 0)
        # 필드 누락
        self.save(schedule(sid="VS-THIN", steps=("thin_json_step",)))
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 1)
        row = [r for r in self.ledger() if r["scheduleId"] == "VS-THIN"][0]
        self.assertEqual(row["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, row["resultPath"]), encoding="utf-8"))
        self.assertIn("sample.decisionDays", result["note"])

    def test_필수_입력_파일이_없으면_FAILED(self):
        self.save(schedule(inputFreeze={"inputs": ["history.js"]}))
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 1)
        self.assertEqual(self.ledger()[0]["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, self.ledger()[0]["resultPath"]), encoding="utf-8"))
        self.assertIn("history.js", result["note"])

    def test_확정_평가는_동결_실패면_FAILED_로_기록하고_공식_결과를_내지_않는다(self):
        # C2: 임시 루트에 history.js·analysis_data.json 이 없다 → 동결 실패 → FAILED + 수리 요청서. CLI 가 EVALUATED 를 내도 소용없다.
        self.save(schedule(kind="EVALUATION", minSample={"decisionDays": 20}, steps=("prereg_evaluate",),
                           onInsufficient={"rule": "recheck", "everyDays": 7, "maxRechecks": 3}))
        self.knobs(days=25)
        self.assertEqual(self.run_main("--now", "2026-10-19T17:05:00+09:00", "--apply"), 1)
        led = self.ledger()
        self.assertEqual(led[0]["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertIn("동결 실패", result["note"])
        self.assertIsNone(result["official"])
        self.assertIsNone(result["followupPath"], "공식 결과가 없으면 후속 명세도 없다")
        self.assertTrue(os.path.exists(os.path.join(self.root, "docs", "operations", "repair_requests", "INC-VS-VS-TEST.md")))

    def test_실행기_크래시도_FAILED_로_기록돼_실패_횟수에_들어간다(self):
        # C3
        self.save(schedule())
        orig = R.run_step
        R.run_step = lambda *a, **k: (_ for _ in ()).throw(RuntimeError("실행기 내부 오류 흉내"))
        try:
            code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply")
        finally:
            R.run_step = orig
        self.assertEqual(code, 1)
        led = self.ledger()
        self.assertEqual(led[0]["status"], "FAILED")
        result = json.load(open(os.path.join(self.root, led[0]["resultPath"]), encoding="utf-8"))
        self.assertIn("크래시", result["note"]); self.assertIn("실행기 내부 오류 흉내", result["crash"])
        inc = open(os.path.join(self.root, "docs", "operations", "repair_requests", "INC-VS-VS-TEST.md"), encoding="utf-8").read()
        self.assertIn("실행기 오류", inc)
        # 같은 날 다시 불러도 두 번 기록하지 않는다(중복 요청)
        self.assertEqual(self.run_main("--now", "2026-09-15T18:05:00+09:00", "--apply"), 0)
        self.assertEqual(len(self.ledger()), 1)

    def test_재확인_기준일은_미리_적어_둔_다음_확인_날짜로_전진한다(self):
        # C4: 고정 기준일이면 표본이 영원히 크지 않는다. report_and_wait 는 nextCheckAt 날짜를 새 기준일로 쓴다.
        self.save(schedule(kind="SAMPLE_CHECK", steps=("flow_validation_readiness", "ok_step"), due="2026-09-23T17:00:00+09:00",
                           cutoff="2026-09-23", onInsufficient={"rule": "report_and_wait"}))
        self.knobs(flow="NOT_READY", expected="2026-10-01")
        self.assertEqual(self.run_main("--now", "2026-09-23T17:05:00+09:00", "--apply"), 0)
        first = self.ledger()[0]
        self.assertEqual((first["status"], first["cutoffDate"], first["recheckId"]), ("INSUFFICIENT", "2026-09-23", None))
        rows = R.plan(self.cfg, self.ledger(), kst("2026-10-01T17:05:00+09:00"))
        self.assertEqual((rows[0]["action"], rows[0]["cutoffDate"], rows[0]["recheckId"]), ("RUN", "2026-10-01", "VS-TEST-R1"))
        self.knobs(flow="READY")
        self.assertEqual(self.run_main("--now", "2026-10-02T17:05:00+09:00", "--apply"), 0)   # 하루 늦어도 기준일은 10/1
        second = self.ledger()[1]
        self.assertEqual((second["status"], second["cutoffDate"], second["recheckId"]), ("COMPLETED", "2026-10-01", "VS-TEST-R1"))
        result = json.load(open(os.path.join(self.root, second["resultPath"]), encoding="utf-8"))
        self.assertEqual(result["steps"]["ok_step"]["json"]["asOf"], "2026-10-01", "명령에도 전진한 기준일이 들어간다")
        self.assertEqual(result["evaluationDate"], "2026-10-01"); self.assertEqual(result["scheduledAt"], "2026-09-23T17:00:00+09:00")
        # 고정을 명시하면(cutoffAdvances=false) 기준일이 그대로다
        self.save(schedule(sid="VS-FIXED", kind="SAMPLE_CHECK", steps=("flow_validation_readiness",), due="2026-09-23T17:00:00+09:00",
                           cutoff="2026-09-23", onInsufficient={"rule": "report_and_wait", "cutoffAdvances": False}))
        led = [ledger_row("VS-FIXED", "2026-09-23T17:05:00+09:00", "INSUFFICIENT", nextCheckAt="2026-10-01T17:00:00+09:00")]
        row = R.plan(self.cfg, led, kst("2026-10-01T17:05:00+09:00"))[0]
        self.assertEqual(row["cutoffDate"], "2026-09-23")

    def test_report_only_는_표본_부족_뒤_재확인하지_않는다(self):
        self.save(schedule(kind="CONFIRMATION", steps=("prereg_sample_count",), minSample={"decisionDays": 20},
                           onInsufficient={"rule": "report_only"}))
        led = [ledger_row("VS-TEST", "2026-09-15T17:05:00+09:00", "INSUFFICIENT", nextCheckAt="2026-09-22T17:00:00+09:00")]
        self.assertEqual(R.plan(self.cfg, led, kst("2026-09-22T17:05:00+09:00"))[0]["action"], "DONE")

    def test_조용한_날은_notify가_false(self):
        self.save(schedule())
        self.run_main("--now", "2026-09-10T17:05:00+09:00", "--apply", "--json", os.path.join(self.root, "out.json"))
        out = json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))
        self.assertFalse(out["notify"])
        self.assertEqual(self.docs_files(), [])

    def test_실패하면_수리요청서와_종료코드_1(self):
        self.save(schedule(steps=("ok_step", "fail_step")))
        code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply", "--issue-body", os.path.join(self.root, "issue.md"))
        self.assertEqual(code, 1)
        self.assertEqual(self.ledger()[0]["status"], "FAILED")
        inc = os.path.join(self.root, "docs", "operations", "repair_requests", "INC-VS-VS-TEST.md")
        self.assertTrue(os.path.exists(inc))
        self.assertIn("boom", open(inc, encoding="utf-8").read())
        self.assertIn("FAILED", open(os.path.join(self.root, "issue.md"), encoding="utf-8").read())

    def test_미구현_단계는_BLOCKED_종료코드_2(self):
        self.save(schedule(steps=("planned_step",)))
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 2)
        self.assertEqual(self.ledger()[0]["status"], "BLOCKED")

    def test_이상이면_수리요청서를_쓰고_최종_상태로_기록한다(self):
        self.save(schedule(steps=("team_weights_transition_check", "prereg_sample_count"),
                           anomalyRules=["team_weights_anomaly", "buy_feature_unrecorded"]))
        self.knobs(tw="ANOMALY")
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 1)
        self.assertEqual(self.ledger()[0]["status"], "ANOMALY")
        self.assertTrue(os.path.exists(os.path.join(self.root, "docs", "operations", "repair_requests", "INC-VS-VS-TEST.md")))
        rows = R.plan(self.cfg, self.ledger(), kst("2026-09-16T17:05:00+09:00"))
        self.assertEqual(rows[0]["action"], "DONE", "이상은 기록됐다 — 매일 다시 돌지 않는다")

    def test_FLOW_표본_부족은_예상_충족일을_다음_확인으로_적는다(self):
        self.save(schedule(kind="SAMPLE_CHECK", steps=("flow_validation_readiness",), due="2026-09-23T17:00:00+09:00",
                           cutoff="2026-09-23", onInsufficient={"rule": "report_and_wait"}))
        self.knobs(flow="NOT_READY", expected="2026-10-01")
        self.assertEqual(self.run_main("--now", "2026-09-23T17:05:00+09:00", "--apply"), 0)
        led = self.ledger()
        self.assertEqual(led[0]["status"], "INSUFFICIENT")
        self.assertEqual(led[0]["nextCheckAt"], "2026-10-01T17:00:00+09:00")
        self.assertEqual(R.plan(self.cfg, led, kst("2026-09-30T17:05:00+09:00"))[0]["action"], "WAIT_RECHECK")
        self.assertEqual(R.plan(self.cfg, led, kst("2026-10-01T17:05:00+09:00"))[0]["action"], "RUN")

    def test_실행기는_정책_파일을_바꾸지_않는다(self):
        policy = os.path.join(self.root, "policy.md")
        with open(policy, "w", encoding="utf-8") as fh:
            fh.write("등록 문서 — 바꾸면 등록 소멸\n")
        before = hashlib.sha256(open(policy, "rb").read()).hexdigest()
        self.save(schedule(policyFiles=["policy.md"], inputFreeze={"inputs": ["fake_step.py"]}))
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 0)
        self.assertEqual(hashlib.sha256(open(policy, "rb").read()).hexdigest(), before)
        result = json.load(open(os.path.join(self.root, self.ledger()[0]["resultPath"]), encoding="utf-8"))
        self.assertEqual(result["inputs"]["policy.md"], before, "정책 파일 SHA 를 결과에 남긴다")
        self.assertIn("fake_step.py", result["inputs"])

    def test_ESCALATED면_종료코드_1과_notify(self):
        self.save(schedule())
        os.makedirs(os.path.join(self.root, "docs", "audits", "validation_runs"))
        with open(os.path.join(self.root, "docs", "audits", "validation_runs", "ledger.jsonl"), "w", encoding="utf-8") as fh:
            for d in (15, 16, 17):
                fh.write(json.dumps(ledger_row("VS-TEST", f"2026-09-{d}T17:05:00+09:00", "FAILED")) + "\n")
        code = self.run_main("--now", "2026-09-18T17:05:00+09:00", "--apply", "--json", os.path.join(self.root, "out.json"))
        self.assertEqual(code, 1)
        self.assertTrue(json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))["notify"])
        self.assertEqual(len(self.ledger()), 3, "사람에게 넘긴 뒤에는 더 쓰지 않는다")


# ------------------------------------------------------------------ 저장 실패 회수 · 복원 (임시 git 저장소)

def _git(cwd, *args):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise AssertionError(f"git {' '.join(args)}: {r.stdout}{r.stderr}")
    return r.stdout.strip()


class InboxAndRestore(TempRoot):
    def setUp(self):
        super().setUp()
        self.origin = os.path.join(self.root, "..", os.path.basename(self.root) + "-origin.git")
        _git(self.root, "init", "-q"); _git(self.root, "checkout", "-q", "-b", "main")
        _git(self.root, "config", "user.name", "t"); _git(self.root, "config", "user.email", "t@example.com")
        _git(self.root, "init", "-q", "--bare", self.origin)
        _git(self.root, "remote", "add", "origin", self.origin)
        self.save(schedule())
        _git(self.root, "add", "-A"); _git(self.root, "commit", "-q", "-m", "base"); _git(self.root, "push", "-q", "origin", "main")

    def tearDown(self):
        shutil.rmtree(self.origin, ignore_errors=True)
        super().tearDown()

    def _result(self, sid="VS-TEST", stamp="20260915T170500", status="COMPLETED"):
        rel = f"docs/audits/validation_runs/{sid}/{stamp}.json"
        return rel, {"schemaVersion": "gaeo_validation_run_v1", "scheduleId": sid, "kind": "CONFIRMATION", "dueAt": "2026-09-15T17:00:00+09:00",
                     "scheduledAt": "2026-09-15T17:00:00+09:00", "cutoffDate": "2026-09-15", "evaluationDate": "2026-09-15",
                     "runAt": "2026-09-15T17:05:00+09:00", "runner": "github-actions", "lateHours": 0, "recheckNo": 0, "recheckId": None,
                     "gitSha": None, "inputs": {}, "steps": {}, "status": status, "note": "ok", "nextCheckAt": None,
                     "resultPath": rel, "inputsPath": None, "followupPath": None}

    def publish_bundle(self, result, extras=None, missing_result=False, ledger_text=None):
        branch = "validation-inbox-222"
        _git(self.root, "checkout", "-q", "-b", branch)
        payloads = dict(extras or {})
        if not missing_result:
            payloads[result["resultPath"]] = json.dumps(result).encode()
        payloads[self.cfg["ledgerPath"]] = (ledger_text if ledger_text is not None else
            json.dumps(R._ledger_row(schedule(), result, "github-actions")) + "\n").encode()
        for rel, blob in payloads.items():
            path = os.path.join(self.root, rel)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "wb") as fh:
                fh.write(blob)
        _git(self.root, "add", "-A")
        _git(self.root, "commit", "-q", "-m", "saved bundle")
        _git(self.root, "push", "-q", "origin", branch)
        _git(self.root, "checkout", "-q", "main")
        return branch

    def test_압축_입력과_결과를_바이트그대로_회수한다(self):
        rel, result = self._result()
        result["inputsPath"] = rel[:-5] + ".inputs.json.gz"
        frozen = gzip.compress(json.dumps({"schemaVersion": "gaeo_validation_inputs_v1",
            "scheduleId": "VS-TEST", "cutoffDate": result["cutoffDate"], "hist": {}, "closes": {}}).encode())
        branch = self.publish_bundle(result, {result["inputsPath"]: frozen})
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertTrue(rec["ok"], rec)
        self.assertEqual(rec["branches"], [branch])
        with open(os.path.join(self.root, result["inputsPath"]), "rb") as fh:
            self.assertEqual(fh.read(), frozen)
        self.assertEqual(len(self.ledger()), 1)
        again = R.reconcile_inbox(self.cfg, self.root)
        self.assertEqual((again["files"], again["ledgerRows"]), ([], 0))

    def test_결과파일_누락이면_원장도_완료도_추가하지_않는다(self):
        _, result = self._result()
        self.publish_bundle(result, missing_result=True)
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual((rec["branches"], self.ledger()), ([], []))

    def test_압축입력_손상이면_완료처리하지_않는다(self):
        rel, result = self._result()
        result["inputsPath"] = rel[:-5] + ".inputs.json.gz"
        self.publish_bundle(result, {result["inputsPath"]: gzip.compress(b'{}')[:12]})
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual((rec["branches"], self.ledger()), ([], []))
        self.assertFalse(os.path.exists(os.path.join(self.root, rel)))

    def test_파일_저장실패시_완료원장과_브랜치삭제를_보류한다(self):
        _, result = self._result()
        self.publish_bundle(result)
        with mock.patch.object(R, "_install_recovery_file", side_effect=OSError("disk full")):
            rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual((rec["branches"], self.ledger()), ([], []))

    def test_회수한_전체묶음으로_같은판정을_재현하고_중복실행하지_않는다(self):
        rel, result = self._result()
        hist, closes, cutoff = synthetic()
        frozen_doc = {"schemaVersion": "gaeo_validation_inputs_v1", "scheduleId": "VS-TEST",
                      "cutoffDate": cutoff, "hist": hist, "closes": closes}
        result.update(cutoffDate=cutoff, evaluationDate=cutoff, inputsPath=rel[:-5] + ".inputs.json.gz",
                      followupPath=rel[:-5] + ".followup.md", official=R.evaluate_from_inputs(frozen_doc, cutoff))
        frozen = gzip.compress(json.dumps(frozen_doc).encode())
        self.publish_bundle(result, {result["inputsPath"]: frozen, result["followupPath"]: b'fixed followup\n'})
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertTrue(rec["ok"], rec)
        replay = R.replay(os.path.join(self.root, result["inputsPath"]), os.path.join(self.root, rel))
        self.assertTrue(replay["reproduced"], replay)
        self.assertEqual(R.plan(self.cfg, self.ledger(), kst("2026-11-20T17:05:00+09:00"))[0]["action"], "DONE")
        with open(os.path.join(self.root, result["followupPath"]), "rb") as fh:
            self.assertEqual(fh.read(), b'fixed followup\n')

    def test_같은_경로의_다른_결과는_조용히_넘기지_않는다(self):
        rel, result = self._result()
        self.publish_bundle(result)
        local = dict(result, status="FAILED")
        dest = os.path.join(self.root, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w") as fh:
            json.dump(local, fh)
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual(rec["branches"], [])
        self.assertEqual(self.ledger(), [])
        with open(dest) as fh:
            self.assertEqual(json.load(fh), local)

    def test_원장_손상도_건너뛰지_않고_보존한다(self):
        _, result = self._result()
        self.publish_bundle(result, ledger_text='{broken json\n')
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual(rec["branches"], [])
        self.assertEqual(self.ledger(), [])

    def test_결과의_원장행이_없으면_재실행위험으로_복구를_보류한다(self):
        rel, result = self._result()
        self.publish_bundle(result, ledger_text="")
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertIn("원장 행이 없다", rec["error"])
        self.assertEqual((rec["branches"], self.ledger()), ([], []))
        self.assertFalse(os.path.exists(os.path.join(self.root, rel)))

    def test_fetch_실패를_회수성공으로_표시하지_않는다(self):
        _, result = self._result()
        self.publish_bundle(result)
        original = R._git_out
        def fail_fetch(root, *args, **kwargs):
            return (1, "", "offline") if args[0] == "fetch" else original(root, *args, **kwargs)
        with mock.patch.object(R, "_git_out", side_effect=fail_fetch):
            rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertEqual(rec["branches"], [])

    def test_미회수_공식시세가_있으면_inbox를_삭제하지_않는다(self):
        _, result = self._result()
        prices = "official_prices/20260915.json"
        self.publish_bundle(result, {prices: b'{"official": true}'})
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertFalse(rec["ok"], rec)
        self.assertIn("미회수 공식시세", rec["error"])
        self.assertEqual((rec["branches"], self.ledger()), ([], []))
        self.assertFalse(os.path.exists(os.path.join(self.root, prices)))
        # 별도로 같은 자료를 확보한 경우만 회수 완료로 인정한다.
        dest = os.path.join(self.root, prices)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "wb") as fh:
            fh.write(b'{"official": true}')
        self.assertTrue(R.reconcile_inbox(self.cfg, self.root)["ok"])

    def test_inbox가_바꾸지_않은_과거시세는_현재시세와_비교하지_않는다(self):
        price = os.path.join(self.root, "official_price_history.js")
        with open(price, "w") as fh:
            fh.write("old")
        _git(self.root, "add", "official_price_history.js")
        _git(self.root, "commit", "-q", "-m", "old prices")
        _, result = self._result()
        self.publish_bundle(result)
        with open(price, "w") as fh:
            fh.write("new")
        _git(self.root, "add", "official_price_history.js")
        _git(self.root, "commit", "-q", "-m", "new prices")
        self.assertTrue(R.reconcile_inbox(self.cfg, self.root)["ok"])
        with open(price) as fh:
            self.assertEqual(fh.read(), "new")

    def test_보관본_복원은_압축원본도_함께_복원한다(self):
        rel, result = self._result()
        result["inputsPath"] = rel[:-5] + ".inputs.json.gz"
        with tempfile.TemporaryDirectory() as saved_dir:
            saved = os.path.join(saved_dir, os.path.basename(rel))
            frozen = gzip.compress(json.dumps({"schemaVersion": "gaeo_validation_inputs_v1",
                "scheduleId": "VS-TEST", "cutoffDate": result["cutoffDate"], "hist": {}, "closes": {}}).encode())
            with open(saved, "w") as fh:
                json.dump(result, fh)
            with open(os.path.join(saved_dir, os.path.basename(result["inputsPath"])), "wb") as fh:
                fh.write(frozen)
            R.restore_result(self.cfg, self.root, saved)
            with open(os.path.join(self.root, result["inputsPath"]), "rb") as fh:
                self.assertEqual(fh.read(), frozen)
            self.assertEqual(len(self.ledger()), 1)

    def test_보관본_입력이_없으면_완료원장을_추가하지_않는다(self):
        rel, result = self._result()
        result["inputsPath"] = rel[:-5] + ".inputs.json.gz"
        with tempfile.TemporaryDirectory() as saved_dir:
            saved = os.path.join(saved_dir, "result.json")
            with open(saved, "w") as fh:
                json.dump(result, fh)
            with self.assertRaises(ValueError):
                R.restore_result(self.cfg, self.root, saved)
            self.assertEqual(self.ledger(), [])
            self.assertFalse(os.path.exists(os.path.join(self.root, rel)))

    def test_복원대상이_결과폴더_밖이면_거부한다(self):
        _, result = self._result()
        result["resultPath"] = "config/restored-unexpected.json"
        with tempfile.TemporaryDirectory() as saved_dir:
            saved = os.path.join(saved_dir, "result.json")
            with open(saved, "w") as fh:
                json.dump(result, fh)
            with self.assertRaises(ValueError):
                R.restore_result(self.cfg, self.root, saved)
            self.assertEqual(self.ledger(), [])
            self.assertFalse(os.path.exists(os.path.join(self.root, result["resultPath"])))

    def test_inbox_브랜치의_같은_결과를_회수하고_두_번_회수해도_원장은_한_줄(self):
        # 지난 run 이 push 에 실패해 inbox 브랜치에만 남긴 결과를 흉내낸다(같은 커밋을 다른 브랜치로 올린 것)
        rel, result = self._result()
        _git(self.root, "checkout", "-q", "-b", "validation-inbox-111")
        os.makedirs(os.path.join(self.root, os.path.dirname(rel)), exist_ok=True)
        json.dump(result, open(os.path.join(self.root, rel), "w", encoding="utf-8"))
        with open(os.path.join(self.root, "docs", "audits", "validation_runs", "ledger.jsonl"), "w", encoding="utf-8") as fh:
            fh.write(json.dumps(R._ledger_row(schedule(), result, "github-actions")) + "\n")
        _git(self.root, "add", "-A"); _git(self.root, "commit", "-q", "-m", "ops-daily: 기록"); _git(self.root, "push", "-q", "origin", "validation-inbox-111")
        _git(self.root, "checkout", "-q", "main")
        shutil.rmtree(os.path.join(self.root, "docs"), ignore_errors=True)
        self.assertEqual(self.ledger(), [])
        rec = R.reconcile_inbox(self.cfg, self.root)
        self.assertTrue(rec["ok"]); self.assertEqual(rec["branches"], ["validation-inbox-111"])
        self.assertEqual(rec["files"], [rel]); self.assertEqual(rec["ledgerRows"], 1)
        self.assertEqual(self.ledger()[0]["resultPath"], rel)
        self.assertEqual(json.load(open(os.path.join(self.root, rel), encoding="utf-8"))["status"], "COMPLETED")
        # 두 번째 회수: 아무것도 더하지 않는다(재발행은 한 번)
        rec2 = R.reconcile_inbox(self.cfg, self.root)
        self.assertEqual((rec2["files"], rec2["ledgerRows"]), ([], 0)); self.assertEqual(len(self.ledger()), 1)
        # 회수된 기록은 일정 계획에 그대로 반영된다(같은 시험을 새 시세로 다시 채점하지 않는다)
        self.assertEqual(R.plan(self.cfg, self.ledger(), kst("2026-09-16T17:05:00+09:00"))[0]["action"], "DONE")
        self.assertEqual(self.run_main("--reconcile-inbox"), 0)

    def test_보관본에서_같은_결과를_복원하고_재채점하지_않는다(self):
        rel, result = self._result(stamp="20260915T170501")
        saved = os.path.join(self.root, "..", "saved-result.json")
        json.dump(result, open(saved, "w", encoding="utf-8"))
        try:
            self.assertEqual(self.run_main("--restore-result", saved), 0)
            self.assertTrue(os.path.exists(os.path.join(self.root, rel)))
            self.assertEqual([r["resultPath"] for r in self.ledger()], [rel])
            self.assertEqual(self.run_main("--restore-result", saved), 0)
            self.assertEqual(len(self.ledger()), 1, "두 번 복원해도 원장은 한 줄")
            self.assertEqual(R.plan(self.cfg, self.ledger(), kst("2026-09-16T17:05:00+09:00"))[0]["action"], "DONE")
            # 형식이 아닌 파일은 거부
            bad = os.path.join(self.root, "..", "bad.json"); json.dump({"x": 1}, open(bad, "w"))
            self.assertEqual(self.run_main("--restore-result", bad), 2)
        finally:
            for f in (saved, os.path.join(self.root, "..", "bad.json")):
                if os.path.exists(f):
                    os.remove(f)


# ------------------------------------------------------------------ 동결 입력 · 재현

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


def synthetic(n_days=20, per_group=4):
    """n_days 판단일 × (급등 BUY per_group · 비급등 BUY per_group · HOLD per_group). 급등 BUY 만 -10%."""
    prices = candles([100] * 90)
    dates = [r["date"] for r in prices]
    start = E.REGISTRATION["windowStart"]
    days = [d for d in dates if d >= start][:n_days]
    hist, closes, k = {}, {}, 0
    for d in days:
        i = dates.index(d)
        for g in range(2 * per_group):
            warn = g < per_group
            code = f"{k:06d}"; k += 1
            series = [dict(r) for r in prices]
            for r in series[i + 1:i + 6]:
                r["close"] = 90 if warn else 101.5
            closes[code] = series
            hist[code] = [entry(d, overheat=recorded(warn, 6.0 if warn else 2.0))]
        for g in range(per_group):
            code = f"{k:06d}"; k += 1
            closes[code] = prices
            hist[code] = [entry(d, call="HOLD", overheat=recorded(False, 2.0))]
    # 창 시작 전 기록 하나(동결에서 빠져야 한다)
    hist["999999"] = [entry(dates[0], overheat=recorded(False, 2.0))]
    closes["999999"] = prices
    as_of = dates[dates.index(days[-1]) + 6]
    return hist, closes, as_of


class FreezeAndReplay(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.hist, cls.closes, cls.as_of = synthetic()
        cls.direct = E.evaluate(cls.hist, cls.closes, cls.as_of)

    def test_합성_표본은_평가_가능하다(self):
        self.assertEqual(self.direct["status"], "EVALUATED", self.direct.get("note"))
        self.assertEqual(self.direct["sample"]["decisionDays"], 20)

    def test_동결_추출본은_창_안_행만_담고_같은_판정을_재현한다(self):
        root = tempfile.mkdtemp(prefix="gaeo-freeze-")
        try:
            with open(os.path.join(root, "history.js"), "w", encoding="utf-8") as fh:
                fh.write("// 자동 생성\nconst LIVE_HISTORY = " + json.dumps(self.hist, ensure_ascii=False) + ";\n")
            with open(os.path.join(root, "analysis_data.json"), "w", encoding="utf-8") as fh:
                json.dump({"fetchedAt": "2026-10-19 16:00", "stocks": {c: {"daily": rows} for c, rows in self.closes.items()}}, fh)
            s = schedule(sid="VS-FREEZE", cutoff=self.as_of)
            doc, err = R.freeze_inputs(root, s, self.as_of)
            self.assertIsNone(err)
            self.assertEqual(doc["schemaVersion"], "gaeo_validation_inputs_v1")
            self.assertNotIn("999999", doc["hist"], "창 시작 전 기록만 있는 종목은 동결에 들어가지 않는다")
            start = E.REGISTRATION["windowStart"]
            self.assertTrue(all(r["date"] >= start for rows in doc["closes"].values() for r in rows))
            self.assertEqual(set(doc["sources"]), {"history.js", "analysis_data.json", "analysisDataFetchedAt"})
            rep = R.evaluate_from_inputs(doc, self.as_of)
            self.assertEqual(rep["status"], self.direct["status"])
            self.assertEqual(rep["sample"]["decisionDays"], self.direct["sample"]["decisionDays"])
            self.assertEqual(rep["sample"]["rows"], self.direct["sample"]["rows"])
            self.assertEqual(rep["verdicts"], self.direct["verdicts"])
        finally:
            shutil.rmtree(root, ignore_errors=True)

    def test_replay는_기록과_같으면_재현_다르면_실패(self):
        root = tempfile.mkdtemp(prefix="gaeo-replay-")
        try:
            doc = {"schemaVersion": "gaeo_validation_inputs_v1", "scheduleId": "VS-REPLAY", "cutoffDate": self.as_of,
                   "hist": self.hist, "closes": self.closes}
            gz = os.path.join(root, "x.inputs.json.gz")
            with gzip.open(gz, "wt", encoding="utf-8") as fh:
                json.dump(doc, fh)
            result = os.path.join(root, "x.json")
            recorded_doc = {"steps": {"prereg_evaluate": {"exit": 0, "json": self.direct}}}
            json.dump(recorded_doc, open(result, "w", encoding="utf-8"))
            rep = R.replay(gz, result)
            self.assertTrue(rep["reproduced"], rep)
            self.assertEqual(R.main(["--replay", gz, "--result", result]), 0)
            # 기록을 손댄 경우
            tampered = json.loads(json.dumps(recorded_doc))
            tampered["steps"]["prereg_evaluate"]["json"]["verdicts"]["H1_crash"] = "PASS"
            json.dump(tampered, open(result, "w", encoding="utf-8"))
            rep2 = R.replay(gz, result)
            self.assertFalse(rep2["reproduced"])
            self.assertFalse(rep2["checks"]["verdicts"])
            self.assertEqual(R.main(["--replay", gz, "--result", result]), 1)
        finally:
            shutil.rmtree(root, ignore_errors=True)


# ------------------------------------------------------------------ 워크플로 (정적)


def _commit_step_body():
    """ops-daily.yml 의 「기록 커밋」 스텝 run 블록을 그대로 꺼낸다(아래 _step_body 와 같은 방식)."""
    return _step_body("기록 커밋", "git add")


class CommitStepRealGit(unittest.TestCase):
    """2026-09-18 run 35350908284 재현 — official_prices/ 가 아직 없다는 이유로
    `git add -A -- ... official_prices ...` 가 exit 128 로 죽어, 멀쩡한 점검 기록까지 저장되지 못했다.
    워크플로의 진짜 스텝 본문을 임시 Git 저장소에서 그대로 실행해 확인한다(외부 요청 0 · 서비스키 0)."""

    @classmethod
    def setUpClass(cls):
        cls.step = _commit_step_body()

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-commit-")
        self.origin = self.root + "-origin.git"
        self.bin = tempfile.mkdtemp(prefix="gaeo-bin-")
        # 재시도 대기(sleep)를 없애 시험을 빠르게 한다 — 로직은 손대지 않는다.
        shim = os.path.join(self.bin, "sleep")
        with open(shim, "w", encoding="utf-8") as fh:
            fh.write("#!/bin/sh\nexit 0\n")
        os.chmod(shim, 0o755)
        _git(self.root, "init", "-q")
        _git(self.root, "checkout", "-q", "-b", "main")
        _git(self.root, "config", "user.name", "t")
        _git(self.root, "config", "user.email", "t@example.com")
        _git(self.root, "init", "-q", "--bare", self.origin)
        _git(self.root, "remote", "add", "origin", self.origin)
        # 필수 3곳 + 선택 1곳(official_price_history.js)은 있고, official_prices/ 는 아직 없다 = 사고 당시 상태
        self.write("docs/audits/validation_runs/ledger.jsonl", '{"scheduleId": "OLD"}\n')
        self.write("docs/VALIDATION_SCHEDULE.md", "# 예정 시험\n")
        self.write("docs/operations/repair_requests/INC-old.md", "# 옛 수리 요청\n")
        self.write("official_price_history.js", "// 아직 비어 있는 파생 파일\n")
        _git(self.root, "add", "-A")
        _git(self.root, "commit", "-q", "-m", "base")
        _git(self.root, "push", "-q", "origin", "main")

    def tearDown(self):
        for d in (self.root, self.origin, self.bin):
            shutil.rmtree(d, ignore_errors=True)

    def write(self, rel, text):
        full = os.path.join(self.root, rel)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8") as fh:
            fh.write(text)

    def run_step(self):
        out = os.path.join(self.root, "_gh_output")
        open(out, "w", encoding="utf-8").close()
        env = dict(os.environ)
        env.pop("DATA_GO_KR_SERVICE_KEY", None)          # 서비스키 없이도 저장 경로를 시험할 수 있어야 한다
        env["GITHUB_OUTPUT"] = out
        env["PATH"] = self.bin + os.pathsep + env.get("PATH", "")
        r = subprocess.run(["bash", "-e", "-c", self.step], cwd=self.root,
                           capture_output=True, text=True, env=env)
        kv = {}
        with open(out, encoding="utf-8") as fh:
            for line in fh.read().splitlines():
                if "=" in line:
                    k, v = line.split("=", 1)
                    kv[k] = v
        return r, kv

    def committed_files(self):
        return _git(self.root, "show", "--name-only", "--format=", "HEAD").split()

    def remote_main(self):
        return _git(self.root, "ls-remote", "origin", "refs/heads/main").split()[0]

    def advance_remote(self):
        """다른 수집기가 main 에 먼저 저장하는 상황. 실제 Git, 외부 요청 없음."""
        other = tempfile.mkdtemp(prefix="gaeo-other-writer-")
        try:
            _git(other, "clone", "-q", "--branch", "main", self.origin, ".")
            _git(other, "config", "user.name", "t")
            _git(other, "config", "user.email", "t@example.com")
            with open(os.path.join(other, "data.js"), "w", encoding="utf-8") as fh:
                fh.write("// other writer\n")
            _git(other, "add", "data.js")
            _git(other, "commit", "-q", "-m", "other writer")
            _git(other, "push", "-q", "origin", "main")
        finally:
            shutil.rmtree(other)

    def run_saved(self, outputs, inbox=""):
        body = _step_body("저장 확인", "REMOTE=")
        values = {"steps.commit.outputs.committed": outputs.get("committed", ""),
                  "steps.commit.outputs.pushed": outputs.get("pushed", ""),
                  "steps.commit.outputs.nothing": outputs.get("nothing", ""),
                  "steps.inboxsave.outputs.branch": ""}
        for key, value in values.items():
            body = body.replace("${{ " + key + " }}", value)
        self.write("runner_temp/inbox_branches.txt", inbox + "\n" if inbox else "")
        out = os.path.join(self.root, "_saved_output")
        env = dict(os.environ, GITHUB_OUTPUT=out, RUNNER_TEMP=os.path.join(self.root, "runner_temp"),
                   GITHUB_STEP_SUMMARY=os.path.join(self.root, "summary.md"),
                   PATH=self.bin + os.pathsep + os.environ.get("PATH", ""))
        r = subprocess.run(["bash", "-e", "-c", body], cwd=self.root, capture_output=True, text=True, env=env)
        return r

    def new_result(self):
        self.write("docs/audits/validation_runs/VS-T/20260918T170500.json", '{"status": "COMPLETED"}')

    def test_G_rebase_뒤_실제로_push한_SHA를_전달한다(self):
        self.advance_remote()
        self.new_result()
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("재시도", r.stdout)
        self.assertEqual(kv["committed"], self.remote_main(), "rebase 전 SHA 로는 main 포함성을 증명할 수 없다")
        saved = self.run_saved(kv)
        self.assertEqual(saved.returncode, 0, saved.stdout + saved.stderr)
        self.assertIn("✔ main 에 있음", saved.stdout)

    def test_H_push_뒤_main이_전진해도_되읽기로_포함성을_확인한다(self):
        self.new_result()
        _, kv = self.run_step()
        self.advance_remote()  # 원격 새 객체는 아직 로컬에 없다
        saved = self.run_saved(kv)
        self.assertEqual(saved.returncode, 0, saved.stdout + saved.stderr)
        self.assertIn("✔ main 에 있음", saved.stdout)

    def test_I_main에_기록이_없으면_inbox를_지우지_않는다(self):
        self.new_result()
        _git(self.root, "add", "docs/audits/validation_runs")
        _git(self.root, "commit", "-q", "-m", "inbox only")
        sha = _git(self.root, "rev-parse", "HEAD")
        branch = "validation-inbox-999"
        _git(self.root, "push", "-q", "origin", "HEAD:refs/heads/" + branch)
        # 성공 플래그만으로 삭제하지 말고 main 포함 사실을 다시 확인해야 한다.
        saved = self.run_saved({"committed": sha, "pushed": "true"}, branch)
        self.assertNotEqual(saved.returncode, 0, saved.stdout + saved.stderr)
        self.assertTrue(_git(self.root, "ls-remote", "origin", "refs/heads/" + branch))

    def test_J_main_조회실패면_inbox를_보존한다(self):
        self.new_result()
        _, kv = self.run_step()
        branch = "validation-inbox-999"
        _git(self.root, "push", "-q", "origin", "HEAD:refs/heads/" + branch)
        git_binary = shutil.which("git")
        shim = os.path.join(self.bin, "git")
        with open(shim, "w", encoding="utf-8") as fh:
            fh.write('#!/bin/sh\ncase "$1" in fetch|ls-remote) exit 1;; esac\nexec "' + git_binary + '" "$@"\n')
        os.chmod(shim, 0o755)
        saved = self.run_saved(kv, branch)
        self.assertNotEqual(saved.returncode, 0, saved.stdout + saved.stderr)
        self.assertIn("미확인", saved.stdout)
        self.assertTrue(_git(self.root, "ls-remote", "origin", "refs/heads/" + branch))

    def test_K_main_포함이_확인된_inbox만_정리한다(self):
        self.new_result()
        _, kv = self.run_step()
        branch = "validation-inbox-999"
        _git(self.root, "push", "-q", "origin", "HEAD:refs/heads/" + branch)
        self.advance_remote()
        saved = self.run_saved(kv, branch)
        self.assertEqual(saved.returncode, 0, saved.stdout + saved.stderr)
        self.assertIn("✔ main 에 있음", saved.stdout)
        self.assertFalse(_git(self.root, "ls-remote", "origin", "refs/heads/" + branch))

    # ---- A. 선택 경로가 없어도 점검 기록은 저장된다 (이번 사고의 재현) ----
    def test_A_official_prices가_없어도_점검기록이_커밋된다(self):
        self.assertFalse(os.path.exists(os.path.join(self.root, "official_prices")))
        self.write("docs/audits/validation_runs/VS-T/20260918T170500.json", '{"status": "COMPLETED"}')
        with open(os.path.join(self.root, "docs/audits/validation_runs/ledger.jsonl"), "a", encoding="utf-8") as fh:
            fh.write('{"scheduleId": "VS-T"}\n')
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertIn("선택 경로가 아직 없다", r.stdout)
        self.assertEqual(kv.get("pushed"), "true", r.stdout + r.stderr)
        self.assertIn("docs/audits/validation_runs/VS-T/20260918T170500.json", self.committed_files())
        self.assertEqual(self.remote_main(), _git(self.root, "rev-parse", "HEAD"))

    # ---- B. 공식자료와 점검 기록이 모두 있으면 허용 경로만 담긴다 ----
    def test_B_공식자료가_생기면_함께_허용경로만_커밋된다(self):
        self.write("official_prices/fsc_15094808/manifest.json", '{"days": 1}')
        self.write("docs/audits/validation_runs/VS-T/20260918T170500.json", '{"status": "COMPLETED"}')
        self.write("news_analysis.js", "// 허용 경로 밖 변경")
        self.write("config/source_compliance.json", "{}")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        files = self.committed_files()
        self.assertIn("official_prices/fsc_15094808/manifest.json", files)
        self.assertIn("docs/audits/validation_runs/VS-T/20260918T170500.json", files)
        for f in files:
            self.assertTrue(any(f == a or f.startswith(a + "/") for a in ALLOWED_COMMIT_PATHS), f)
        self.assertNotIn("news_analysis.js", files)
        self.assertNotIn("config/source_compliance.json", files)

    # ---- C. 변경이 전혀 없으면 새 커밋이 없다 ----
    def test_C_변경이_없으면_새_커밋도_없다(self):
        before = _git(self.root, "rev-parse", "HEAD")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(kv.get("nothing"), "true")
        self.assertEqual(kv.get("committed"), "")
        self.assertEqual(_git(self.root, "rev-parse", "HEAD"), before)

    # ---- D. 허용되지 않은 삭제·필수 누락은 계속 막힌다 ----
    def test_D1_원장에서_줄이_지워지면_막힌다(self):
        self.write("docs/audits/validation_runs/ledger.jsonl", "")
        r, kv = self.run_step()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("덧붙이기만", r.stdout + r.stderr)

    def test_D2_추적중인_결과파일_삭제는_파일없음으로_숨겨지지_않는다(self):
        self.write("docs/audits/validation_runs/VS-OLD/20260901T170500.json", '{"status": "COMPLETED"}')
        _git(self.root, "add", "-A"); _git(self.root, "commit", "-q", "-m", "old")
        _git(self.root, "push", "-q", "origin", "main")
        os.remove(os.path.join(self.root, "docs/audits/validation_runs/VS-OLD/20260901T170500.json"))
        r, kv = self.run_step()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("결과는 새 파일로만", r.stdout + r.stderr)

    def test_D3_선택경로도_추적중이면_삭제가_스테이지된다(self):
        # official_price_history.js 는 선택 경로지만 이미 Git 이 추적 중이다. 지우면 "없으니 건너뛴다"가 아니라
        # 삭제로 스테이지돼 커밋에 그대로 드러나야 한다(숨기지 않는다).
        os.remove(os.path.join(self.root, "official_price_history.js"))
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertNotIn("선택 경로가 아직 없다 — 이 경로만 건너뛴다: official_price_history.js", r.stdout)
        self.assertIn("official_price_history.js", self.committed_files())
        self.assertIn("D", _git(self.root, "show", "--name-status", "--format=", "HEAD").split()[0])

    def test_D4_필수_경로가_통째로_없으면_실패한다(self):
        _git(self.root, "rm", "-r", "-q", "--cached", "docs/operations/repair_requests")
        shutil.rmtree(os.path.join(self.root, "docs/operations/repair_requests"))
        r, kv = self.run_step()
        self.assertNotEqual(r.returncode, 0)
        self.assertIn("필수 기록 경로가 없다", r.stdout + r.stderr)

    # ---- E. 실제 push 실패는 성공으로 위장하지 않는다 ----
    def test_E_push가_실패하면_정직하게_실패한다(self):
        self.write("docs/audits/validation_runs/VS-T/20260918T170500.json", '{"status": "COMPLETED"}')
        shutil.rmtree(self.origin)
        r, kv = self.run_step()
        self.assertNotEqual(r.returncode, 0)
        self.assertNotEqual(kv.get("committed", ""), "", "커밋은 만들어졌다")
        self.assertNotEqual(kv.get("pushed"), "true", "성공으로 위장하지 않는다")
        self.assertIn("push 4회 실패", r.stdout + r.stderr)

    # ---- F. 서비스키 없이도 저장 경로를 시험할 수 있다 ----
    def test_F_서비스키와_외부요청_없이_돈다(self):
        for bad in ("DATA_GO_KR_SERVICE_KEY", "curl", "wget", "apis.data.go.kr", "fsc_daily_collect"):
            self.assertNotIn(bad, self.step, bad)
        self.write("docs/audits/validation_runs/VS-T/20260918T170500.json", '{"status": "COMPLETED"}')
        r, kv = self.run_step()          # run_step 이 키를 지운 환경으로 돌린다
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(kv.get("pushed"), "true")

class WorkflowContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(WORKFLOW, encoding="utf-8") as fh:
            cls.body = fh.read()
        # 주석(#)을 뺀 "실제로 실행되는 줄"만 — 경위 주석에 '금지어'를 적는 것은 허용한다
        cls.code = "\n".join(l for l in cls.body.splitlines() if not l.lstrip().startswith("#"))
        cls.cfg = R.load_config(HERE)

    def test_워크플로와_설정_원본이_맞는다(self):
        runner = self.cfg["runner"]
        self.assertEqual(runner["workflow"], ".github/workflows/ops-daily.yml")
        self.assertEqual(runner["script"], "run_validation_schedule.py")
        self.assertEqual(runner["maxFailedRuns"], R.MAX_FAILED_RUNS)
        self.assertEqual(runner["maxRechecksDefault"], R.DEFAULT_MAX_RECHECKS)
        cron = " ".join(runner["cron"].split()[:5])
        self.assertIn(f'cron: "{cron}"', self.body)
        self.assertEqual(cron, "5 8 * * 1-5", "평일 17:05 KST")

    def test_예비_cron은_설정_원본과_같다(self):
        # 워크플로의 모든 cron 이 config runner.cron ∪ runner.backupCron 안에 있어야 한다(2026-09-10 검토 P2-4 — 원본 하나).
        runner = self.cfg["runner"]
        crons = [m.group(1) for m in re.finditer(r'cron: "([^"]+)"', self.body)]
        allowed = {" ".join(runner["cron"].split()[:5])} | set(runner.get("backupCron", []))
        self.assertGreaterEqual(len(crons), 1)
        self.assertLessEqual(set(crons), allowed, (crons, allowed))
        self.assertEqual(sorted(runner.get("backupCron", [])), sorted(c for c in crons if c != " ".join(runner["cron"].split()[:5])))

    def test_체크아웃은_고정_SHA가_아니라_브랜치_끝을_본다(self):
        # 2026-09-10 별도 검토 P0-1: 예비 cron 이 원본 지연과 겹치면 뒤 run 이 run 생성 시점의 github.sha 를 받아 앞 run 의 원장 커밋을
        # 못 보고 같은 시험을 다시 돈다(원장 충돌). ref 를 명시하면 체크아웃 시점의 브랜치 끝을 받는다(concurrency 로 직렬화).
        lines = self.body.splitlines()
        idx = [i for i, l in enumerate(lines) if "uses: actions/checkout@v4" in l]
        self.assertEqual(len(idx), 1, idx)
        window = "\n".join(lines[idx[0]:idx[0] + 3])
        self.assertIn("ref: ${{ github.ref }}", window)
        self.assertIn("cancel-in-progress: false", self.body)

    def test_실행기와_점검을_부른다(self):
        for needle in ("python3 gaeo_check.py schedule", "run_validation_schedule.py $args --runner-name github-actions",
                       'args="--apply"', "ops_status.py --deep --github", "render_validation_schedule.py",
                       "--repair-request docs/operations/repair_requests"):
            self.assertIn(needle, self.body, needle)

    def test_회수_실패시_새자료로_중복_시험하지_않는다(self):
        trial = self.body.split("id: vs\n", 1)[1].split("run: |", 1)[0]
        self.assertIn("if: env.APPLY != 'true' || steps.inbox.outcome == 'success'", trial)

    def test_push_트리거가_없고_기록은_main에서만(self):
        on_block = self.body.split("\non:\n", 1)[1].split("\npermissions:", 1)[0]
        self.assertNotIn("push:", on_block, "push 트리거가 있으면 브랜치에 올리는 순간 기동한다(2026-09-07 사고)")
        self.assertIn("schedule:", on_block)
        self.assertIn("workflow_dispatch:", on_block)
        self.assertIn("github.ref == 'refs/heads/main'", self.body)
        self.assertIn("if: env.APPLY == 'true'", self.body)

    def test_커밋은_허용_경로만_원장은_덧붙이기만(self):
        # 2026-09-18 수리: 경로를 REQUIRED(필수) / OPTIONAL(아직 없을 수 있음) 두 변수로 나눴다.
        # git add 는 여전히 한 줄이고, 그 두 변수만 받는다(git add . 금지).
        add_lines = [l for l in self.code.splitlines() if "git add" in l]
        self.assertEqual(len(add_lines), 1, add_lines)
        self.assertIn("git add -A -- $ADD", add_lines[0])
        req = re.search(r'REQUIRED="([^"]+)"', self.code).group(1).split()
        opt = re.search(r'OPTIONAL="([^"]+)"', self.code).group(1).split()
        self.assertEqual(sorted(req + opt), sorted(ALLOWED_COMMIT_PATHS), (req, opt))
        self.assertEqual(sorted(req), sorted(["docs/audits/validation_runs", "docs/VALIDATION_SCHEDULE.md",
                                              "docs/operations/repair_requests"]))
        self.assertEqual(sorted(opt), sorted(["official_prices", "official_price_history.js"]))
        # 필수가 통째로 없으면 조용히 넘어가지 않고 실패한다
        self.assertIn("필수 기록 경로가 없다", self.code)
        # 선택 경로는 Git 이 추적 중이면 반드시 포함한다(삭제를 "파일 없음"으로 숨기지 않는다)
        self.assertIn('git ls-files -- "$p"', self.code)
        self.assertIn("허용 밖 경로가 스테이지됐다", self.body)
        self.assertIn("grep -q '^-[^-]'", self.body, "원장에서 지워진 줄을 잡는 검사")
        self.assertIn("--diff-filter=DM", self.body, "기존 결과 파일 수정·삭제를 잡는 검사")
        self.assertIn("[skip ci]", self.body)

    def test_저장_오류를_숨기지_않는다(self):
        # 2026-09-18 수리 금지 조건: 저장 명령 전체에 || true 를 붙이거나 git add . 로 넓히지 않는다.
        step = _commit_step_body()
        for bad in ("git add .", "git add -A\n", "|| true"):
            self.assertNotIn(bad, step, bad)
        # 보존 안내는 실제 위치로만 적는다(inbox 가 없으면 "다음 run 이 회수"라고 하지 않는다)
        self.assertIn("자동 회수 경로가 없다", self.body)
        self.assertIn("--reconcile-inbox 로 회수", self.body)

    def test_파괴적_명령이_없다(self):
        for bad in ("--force", "reset --hard", "filter-branch", "push -f", "git clean", "replace --graft"):
            self.assertNotIn(bad, self.code, bad)

    def test_권한과_동시성(self):
        self.assertIn("contents: write", self.body)
        self.assertIn("issues: write", self.body)
        self.assertNotIn("actions: write", self.body, "run 취소·dispatch 권한은 필요 없다")
        self.assertIn("group: ops-daily", self.body)
        self.assertIn("if: github.repository == 'rudvh1016-gif/gaeo-analyst-team'", self.body)

    def test_이슈는_제목_고정_1개씩_재사용(self):
        for title_var in ("VALIDATION_TITLE", "OPS_TITLE"):
            self.assertIn(f'.title == \\"${{{title_var}}}\\"', self.body, f"{title_var} 로 열린 이슈를 먼저 찾는다")
        self.assertIn("gaeo-ops-signature:", self.body, "같은 사고는 서명으로 중복을 막는다")
        self.assertIn("steps.ops.outputs.code != '2'", self.body, "확인 못 함(2)은 정상으로도 장애로도 적지 않는다")

    def test_저장_실패_보존과_알림은_앞_스텝이_죽어도_돈다(self):
        # C3: inbox 회수 → 실행기 → 커밋(continue-on-error) → inbox 보존 → artifact → 저장 확인 → 이슈(always) → 판정(always)
        for needle in ("run_validation_schedule.py --reconcile-inbox", "id: commit", "continue-on-error: true",
                       "steps.commit.outcome == 'failure'", "validation-inbox-${GITHUB_RUN_ID}", "actions/upload-artifact@v4",
                       "retention-days: 90", "timeout 120 git fetch origin main", "저장 확인", "원격 저장",
                       "if: always() && env.APPLY == 'true' && (steps.vs.outputs.notify == 'true'",
                       "if: always() && env.APPLY == 'true' && steps.ops.outputs.code != '2'",
                       'COMMIT_OUTCOME: ${{ steps.commit.outcome }}',
                       'SAVE_OUTCOME: ${{ steps.saved.outcome }}'):
            self.assertIn(needle, self.body, needle)
        order = [self.body.index(k) for k in ("--reconcile-inbox", "run_validation_schedule.py $args", "id: commit",
                                              "id: inboxsave", "upload-artifact", "id: saved", "예정 시험 이슈 갱신", "결과 판정")]
        self.assertEqual(order, sorted(order), "스텝 순서: 회수 → 실행 → 커밋 → 보존 → artifact → 저장 확인 → 이슈 → 판정")
        # inbox 브랜치 삭제는 main 저장이 확인된 뒤에만
        saved = _step_body("저장 확인", "REMOTE=")
        self.assertIn('git rev-parse refs/remotes/origin/main', saved)
        self.assertIn('git merge-base --is-ancestor "$C" "$R"', saved)
        self.assertIn('if [ "$verified" = "true" ] && [ -s "$RUNNER_TEMP/inbox_branches.txt" ]', saved)

    def test_LLM_호출이_없다(self):
        for bad in ("anthropic", "openai", "claude", "gpt", "api.openai", "messages.create"):
            self.assertNotIn(bad, self.code.lower(), bad)


# ------------------------------------------------------- 결과 전달 (2026-09-19 · tee 가 판정을 삼킨 사고)


def _step_body(name_prefix, must_contain):
    """ops-daily.yml 의 스텝 run 블록을 그대로 꺼낸다(PyYAML 없이 · test_ci_parity)."""
    lines = open(WORKFLOW, encoding="utf-8").read().splitlines()
    start = next(i for i, l in enumerate(lines) if l.strip().startswith(f"- name: {name_prefix}"))
    ridx = next(i for i in range(start, len(lines)) if lines[i].strip() == "run: |")
    indent = len(lines[ridx + 1]) - len(lines[ridx + 1].lstrip())
    out = []
    for l in lines[ridx + 1:]:
        if l.strip() and (len(l) - len(l.lstrip())) < indent:
            break
        out.append(l[indent:] if len(l) >= indent else l)
    body = "\n".join(out).rstrip()
    assert must_contain in body, f"{name_prefix} 스텝을 못 꺼냈다"
    return body + "\n"


def _run_blocks():
    """(스텝 이름, run 블록) 목록. `run: |` 블록만 — 한 줄 run 은 파이프라인을 안 쓴다."""
    lines = open(WORKFLOW, encoding="utf-8").read().splitlines()
    out, name = [], None
    i = 0
    while i < len(lines):
        s = lines[i].strip()
        if s.startswith("- name: "):
            name = s[len("- name: "):]
        if s == "run: |" and name:
            indent = len(lines[i + 1]) - len(lines[i + 1].lstrip())
            body = []
            j = i + 1
            while j < len(lines) and (not lines[j].strip() or (len(lines[j]) - len(lines[j].lstrip())) >= indent):
                body.append(lines[j][indent:] if len(lines[j]) >= indent else lines[j])
                j += 1
            out.append((name, "\n".join(body)))
            i = j
            continue
        i += 1
    return out


def _logical_lines(body):
    """줄 끝 `\\` 이어짐을 한 줄로 합쳐, 파이프라인 하나를 한 줄로 본다."""
    out, buf = [], ""
    for l in body.splitlines():
        stripped = l.strip()
        if stripped.startswith("#"):
            continue
        if stripped.endswith("\\"):
            buf += stripped[:-1].rstrip() + " "
            continue
        out.append((buf + stripped).strip())
        buf = ""
    if buf:
        out.append(buf.strip())
    return out


class TeeNeverSwallowsVerdict(unittest.TestCase):
    """2026-09-19 run 35363327604 — 점검 본문은 "결론: 장애 1건"(서명 214b8601d4)인데 알림 단계는 CODE: 0 을
    받아 "정상"으로 처리했다. 원인은 `python3 … | tee A | tee -a B || code=$?` 한 줄이다: bash 에서 파이프라인의
    종료코드는 **마지막 명령(tee)** 것이라, 점검이 1·2 로 끝나도 tee 가 성공하면 `||` 가 발동하지 않는다.
    같은 구조가 다시 들어오지 못하게 잠근다."""

    def test_프로그램_판정이_tee_뒤에서_사라지는_구조가_없다(self):
        for name, body in _run_blocks():
            for line in _logical_lines(body):
                if not re.match(r"^python3\b", line) or "| tee" not in line:
                    continue
                self.assertNotRegex(line, r"\|\|\s*\w+=\$\?",
                                    f"[{name}] 파이프라인의 `|| x=$?` 는 마지막 tee 의 코드를 받는다 — "
                                    f"PIPESTATUS 로 바꿔라:\n  {line}")
                self.assertIn('PIPESTATUS[@]', body,
                              f"[{name}] python3 판정이 tee 를 거치는데 PIPESTATUS 보존이 없다")

    def test_PIPESTATUS는_파이프라인_바로_다음_줄에서_통째로_보존한다(self):
        # 다른 명령이 하나라도 끼면 PIPESTATUS 는 그 명령 것으로 덮인다.
        for name, body in _run_blocks():
            lines = _logical_lines(body)
            for idx, line in enumerate(lines):
                if 'PIPESTATUS[@]' not in line:
                    continue
                self.assertRegex(line, r'^PS=\("\$\{PIPESTATUS\[@\]\}"\)$',
                                 f"[{name}] 배열을 통째로 보존해야 한다: {line}")
                prev = lines[idx - 1]
                self.assertIn("|", prev, f"[{name}] PIPESTATUS 보존 직전 줄이 파이프라인이 아니다: {prev}")

    def test_점검_계약과_실행기_계약을_같은_뜻으로_쓰지_않는다(self):
        body = open(WORKFLOW, encoding="utf-8").read()
        self.assertIn("ops_status.py 계약: 0 정상 · 1 장애 · 2 확인 불가", body)
        self.assertIn("run_validation_schedule.py 계약: 0 정상 · 1 실패·이상·사람 확인 필요 · 2 BLOCKED", body)
        self.assertIn("0 OK/NOTICE · 1 PROTECT", body, "용량 보고의 2 는 UNKNOWN — 다른 프로그램과 뜻이 다르다")

    def test_확인_불가와_미확인은_장애_이슈를_닫지_않는다(self):
        body = open(WORKFLOW, encoding="utf-8").read()
        self.assertIn("steps.ops.outputs.code != '2'", body, "확인 불가(2)면 이슈 스텝 자체가 돌지 않는다")
        self.assertIn("steps.ops.outputs.code != ''", body, "판정이 없으면(스텝이 못 돌았으면) 이슈를 건드리지 않는다")

    def test_전역_shell_설정을_모든_워크플로에_퍼뜨리지_않았다(self):
        for name in sorted(os.listdir(os.path.dirname(WORKFLOW))):
            if not name.endswith((".yml", ".yaml")):
                continue
            text = open(os.path.join(os.path.dirname(WORKFLOW), name), encoding="utf-8").read()
            # `defaults:` 아래 `shell:` 을 두면 그 워크플로의 모든 스텝 해석이 한꺼번에 바뀐다 —
            # 종료코드는 문제가 난 스텝에서만 고친다(2026-09-19 수리 범위).
            self.assertIsNone(re.search(r"^\s*defaults:\s*$(?:\n\s+.*)*?\n\s+shell:", text, re.M),
                              f"{name}: 전역 shell 설정은 두지 않는다")


class _StepHarness(unittest.TestCase):
    """실제 workflow 의 run 블록을 임시 디렉터리에서 그대로 실행한다. 진짜 수집·네트워크·서비스키 0 —
    점검·실행기 프로그램 자리에는 정해진 본문·보고서·종료코드를 내는 대역 스크립트를 둔다."""

    STEP_NAME = ""
    STEP_NEEDLE = ""

    @classmethod
    def setUpClass(cls):
        cls.step = _step_body(cls.STEP_NAME, cls.STEP_NEEDLE)

    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-step-")
        self.tmp = os.path.join(self.root, "runner_temp")
        self.bin = os.path.join(self.root, "bin")
        os.makedirs(self.tmp)
        os.makedirs(self.bin)

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def fake(self, name, source):
        with open(os.path.join(self.root, name), "w", encoding="utf-8") as fh:
            fh.write(source)

    def shim(self, name, source):
        path = os.path.join(self.bin, name)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(source)
        os.chmod(path, 0o755)

    def run_step(self, summary=None, apply="true", **extra):
        out = os.path.join(self.root, "_gh_output")
        open(out, "w", encoding="utf-8").close()
        env = dict(os.environ)
        env.pop("DATA_GO_KR_SERVICE_KEY", None)
        env["GITHUB_OUTPUT"] = out
        env["GITHUB_STEP_SUMMARY"] = summary if summary is not None else os.path.join(self.root, "summary.md")
        env["RUNNER_TEMP"] = self.tmp
        env["APPLY"] = apply
        env["GITHUB_RUN_ID"] = "999"
        env["PATH"] = self.bin + os.pathsep + env.get("PATH", "")
        env.update({k: str(v) for k, v in extra.items()})
        r = subprocess.run(["bash", "-e", "-c", self.step], cwd=self.root,
                           capture_output=True, text=True, env=env)
        kv = {}
        for line in open(out, encoding="utf-8").read().splitlines():
            if "=" in line:
                k, v = line.split("=", 1)
                kv[k] = v
        return r, kv


_FAKE_OPS = '''import json, sys
argv = sys.argv[1:]
path = argv[argv.index("--json") + 1]
report, code, body = {report!r}, {code}, {body!r}
if report == "fault":
    json.dump({{"faults": ["scheduled"], "unknowns": [], "signature": "214b8601d4"}}, open(path, "w", encoding="utf-8"))
elif report == "clean":
    json.dump({{"faults": [], "unknowns": [], "signature": "clean"}}, open(path, "w", encoding="utf-8"))
elif report == "unknown":
    json.dump({{"faults": [], "unknowns": ["scheduled"], "signature": "abc1234567"}}, open(path, "w", encoding="utf-8"))
elif report == "corrupt":
    open(path, "w", encoding="utf-8").write("{{ this is not json")
elif report == "noKeys":
    json.dump({{"signature": "abc1234567"}}, open(path, "w", encoding="utf-8"))
print(body)
sys.exit(code)
'''


class OpsVerdictReachesNotification(_StepHarness):
    """A~E. 점검 프로그램이 낸 0·1·2 가 알림 단계까지 그대로 가는가. 보고서가 없거나 깨졌는데 정상으로 위장하지 않는가.
    로그 복사(tee) 실패를 점검 판정과 구분하는가."""

    STEP_NAME = "통합 상태 점검"
    STEP_NEEDLE = "ops_status.py"

    def checker(self, code, report, body="결론: 장애 1건 — 조치 필요"):
        self.fake("ops_status.py", _FAKE_OPS.format(report=report, code=code, body=body))

    # ---- A. 정상 ----
    def test_A_점검_exit0은_정상으로_전달된다(self):
        self.checker(0, "clean", "결론: 정상")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(kv["code"], "0")
        self.assertEqual(kv["report"], "ok")
        self.assertEqual(kv["log"], "ok")
        self.assertEqual(kv["signature"], "clean")

    # ---- B. 장애 (이번 사고의 재현) ----
    def test_B_점검_exit1은_장애로_전달된다(self):
        self.checker(1, "fault")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)               # 스텝은 죽지 않는다(기록·알림이 이어져야 한다)
        self.assertEqual(kv["code"], "1", "장애가 정상(0)으로 전달되면 이번 사고 그대로다")
        self.assertEqual(kv["signature"], "214b8601d4")
        self.assertEqual(kv["report"], "ok")
        self.assertIn("결론: 장애 1건", open(os.path.join(self.tmp, "ops.txt"), encoding="utf-8").read())

    # ---- C. 확인 불가 ----
    def test_C_점검_exit2는_확인_불가로_전달된다(self):
        self.checker(2, "unknown", "결론: 확인 불가 1건")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(kv["code"], "2", "확인 불가가 0 으로 전달되면 기존 장애 이슈가 닫힌다")
        self.assertEqual(kv["report"], "ok")

    # ---- D. 보고서 누락·손상·예외 ----
    def test_D1_보고서가_없으면_정상으로_적지_않는다(self):
        self.checker(0, "missing", "결론: 정상")
        r, kv = self.run_step()
        self.assertEqual(kv["report"], "broken")
        self.assertEqual(kv["code"], "2", "보고서를 못 읽었으면 정상(0)이 아니라 확인 불가(2)")
        self.assertEqual(kv["signature"], "unknown")

    def test_D2_보고서가_깨졌어도_정상으로_적지_않는다(self):
        self.checker(0, "corrupt", "결론: 정상")
        _, kv = self.run_step()
        self.assertEqual((kv["code"], kv["report"]), ("2", "broken"))

    def test_D3_보고서에_필수_필드가_없으면_확인_불가다(self):
        self.checker(0, "noKeys", "결론: 정상")
        _, kv = self.run_step()
        self.assertEqual((kv["code"], kv["report"]), ("2", "broken"))

    def test_D4_점검이_예외로_죽어도_장애_판정은_지워지지_않는다(self):
        self.checker(1, "missing")
        _, kv = self.run_step()
        self.assertEqual(kv["code"], "1", "점검이 이미 장애라고 했으면 확인 불가로 낮추지 않는다")
        self.assertEqual(kv["report"], "broken")

    # ---- E. 로그 기록(tee) 실패 ----
    def test_E_요약_기록_실패는_점검_판정과_따로_적힌다(self):
        self.checker(1, "fault")
        r, kv = self.run_step(summary="/nonexistent-dir-gaeo/summary.md")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(kv["code"], "1", "tee 가 실패해도 점검 판정은 그대로다")
        self.assertEqual(kv["log"], "fail", "로그 기록 실패를 성공으로 숨기지 않는다")
        self.assertIn("::error::", r.stdout + r.stderr)
        # 첫 tee 는 살아 있으므로 이슈 본문 원본은 남는다
        self.assertTrue(os.path.exists(os.path.join(self.tmp, "ops.txt")))

    def test_E2_정상인데_기록만_실패하면_정상_판정은_유지된다(self):
        self.checker(0, "clean", "결론: 정상")
        _, kv = self.run_step(summary="/nonexistent-dir-gaeo/summary.md")
        self.assertEqual((kv["code"], kv["log"]), ("0", "fail"))


_FAKE_VS = '''import json, sys
argv = sys.argv[1:]
json.dump({{"notify": {notify}}}, open(argv[argv.index("--json") + 1], "w", encoding="utf-8"))
open(argv[argv.index("--issue-body") + 1], "w", encoding="utf-8").write("# 실행기 요약\\n")
print("[예정 시험 실행기] 요약")
sys.exit({code})
'''


class ValidationRunnerVerdictReachesJudgement(_StepHarness):
    """F. 예정 시험 실행기가 실패했는데 마지막 tee 성공 때문에 정상으로 처리되지 않아야 한다.
    실패해도 기록·보관 스텝이 이어지도록 스텝 자체는 0 으로 끝난다(마지막 판정 스텝이 run 을 빨갛게 만든다)."""

    STEP_NAME = "예정 시험 실행기"
    STEP_NEEDLE = "run_validation_schedule.py"

    def runner(self, code, notify="False"):
        self.fake("run_validation_schedule.py", _FAKE_VS.format(code=code, notify=notify))
        self.fake("render_validation_schedule.py", 'open("rendered.txt", "w").write("ok")\n')

    def test_F1_실행기_exit0은_정상으로_전달된다(self):
        self.runner(0)
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual((kv["code"], kv["log"]), ("0", "ok"))

    def test_F2_실행기_exit1이_그대로_전달되고_보관은_계속된다(self):
        self.runner(1, notify="True")
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, "스텝이 죽으면 기록 커밋·보관 스텝이 건너뛰어진다")
        self.assertEqual(kv["code"], "1", "실행기 실패가 0 으로 전달되면 run 이 초록으로 끝난다")
        self.assertEqual(kv["notify"], "true")
        self.assertTrue(os.path.exists(os.path.join(self.root, "rendered.txt")), "표 재생성은 계속 수행한다")
        self.assertTrue(os.path.exists(os.path.join(self.tmp, "vs_issue.md")), "이슈 본문은 그대로 남는다")

    def test_F3_실행기_exit2도_섞이지_않고_그대로_전달된다(self):
        self.runner(2)
        _, kv = self.run_step()
        self.assertEqual(kv["code"], "2", "이 프로그램의 2 는 BLOCKED·구조 가드 — 0 으로 바꾸지 않는다")

    def test_F4_요약_기록_실패는_실행기_판정과_따로_적힌다(self):
        self.runner(0)
        r, kv = self.run_step(summary="/nonexistent-dir-gaeo/summary.md")
        self.assertEqual((kv["code"], kv["log"]), ("0", "fail"))
        self.assertIn("::error::", r.stdout + r.stderr)

    def test_F5_표_재생성이_실패해도_기록_알림은_계속되고_판정에_남는다(self):
        self.runner(0)
        self.fake("render_validation_schedule.py", 'import sys; sys.exit(1)\n')
        r, kv = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(kv["code"], "0")
        self.assertEqual(kv["log"], "fail", "재생성 실패를 성공으로 숨기지 않는다")

    def test_F6_계획_모드는_apply_없이_돌고_표를_다시_쓰지_않는다(self):
        self.runner(0)
        r, kv = self.run_step(apply="false")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertFalse(os.path.exists(os.path.join(self.root, "rendered.txt")))


class InboxAndCapacityStepsDoNotHideFailure(_StepHarness):
    """같은 tee 결함이 있던 나머지 두 곳(회수·용량 보고). 각 프로그램의 계약을 따로 읽는다."""

    STEP_NAME = "저장 실패로 남은 결과 회수"
    STEP_NEEDLE = "--reconcile-inbox"

    def test_회수_성공은_0으로_끝나고_회수_목록을_남긴다(self):
        self.fake("run_validation_schedule.py",
                  'print("RECONCILED validation-inbox-111")\n')
        r, _ = self.run_step()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(open(os.path.join(self.tmp, "inbox_branches.txt"), encoding="utf-8").read().strip(),
                         "validation-inbox-111")

    def test_회수_실패가_초록으로_숨지_않고_목록은_그대로_남는다(self):
        self.fake("run_validation_schedule.py",
                  'import sys; print("RECONCILED validation-inbox-222"); sys.exit(1)\n')
        r, _ = self.run_step()
        self.assertEqual(r.returncode, 1, "회수 실패가 0 으로 끝나면 결과가 사라진 것을 아무도 모른다")
        self.assertIn("::error::", r.stdout + r.stderr)
        self.assertEqual(open(os.path.join(self.tmp, "inbox_branches.txt"), encoding="utf-8").read().strip(),
                         "validation-inbox-222", "일부라도 회수됐으면 그 브랜치는 기록에 남아야 한다")

    def test_용량_보고의_계약은_따로_읽는다(self):
        step = _step_body("저장소 용량 보고", "check_history_evidence.py")
        for code, expect in ((0, 0), (1, 1), (2, 2)):
            self.fake("check_history_evidence.py", f'import sys; print("[저장소 용량] 단계"); sys.exit({code})\n')
            r, _ = self.run_step_with(step)
            self.assertEqual(r.returncode, expect,
                             f"용량 보고 exit {code} 가 {expect} 로 전달돼야 한다(0 OK/NOTICE · 1 PROTECT · 2 UNKNOWN)")
            if code:
                self.assertIn("::warning::", r.stdout + r.stderr)

    def run_step_with(self, step):
        saved, type(self).step = type(self).step, step
        try:
            return self.run_step()
        finally:
            type(self).step = saved


class FinalJudgementSeparatesVerdictFromExecution(_StepHarness):
    """마지막 판정: 예정 시험 실패·저장 실패는 계속 빨갛게. 점검이 찾은 장애는 이슈로만 알리고 run 색을 바꾸지 않는다
    (기존 설계 유지). 로그 기록 실패·보고서 누락은 점검 판정과 별개의 실행 문제로 빨갛게."""

    STEP_NAME = "결과 판정"
    STEP_NEEDLE = "예정 시험 실행기 종료코드"

    def judge(self, **env):
        base = dict(CODE="0", COMMIT_OUTCOME="success", SAVE_OUTCOME="success", INBOX_OUTCOME="success",
                    VS_LOG="ok", OPS_CODE="0", OPS_LOG="ok", OPS_REPORT="ok")
        base.update(env)
        return self.run_step(**base)

    def test_모두_정상이면_초록(self):
        r, _ = self.judge()
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertIn("정상 종료", r.stdout)

    def test_실행기_실패는_계속_빨갛다(self):
        for code in ("1", "2", ""):
            r, _ = self.judge(CODE=code)
            self.assertEqual(r.returncode, 1, f"실행기 코드 {code!r}")

    def test_저장_실패는_계속_빨갛다(self):
        r, _ = self.judge(COMMIT_OUTCOME="failure")
        self.assertEqual(r.returncode, 1)

    def test_push_성공이라도_되읽기_실패면_빨갛다(self):
        r, _ = self.judge(SAVE_OUTCOME="failure")
        self.assertEqual(r.returncode, 1)
        self.assertIn("main 저장 되읽기", r.stdout)

    def test_저장성공이라도_이전기록_회수실패면_빨갛다(self):
        r, _ = self.judge(INBOX_OUTCOME="failure")
        self.assertEqual(r.returncode, 1)
        self.assertIn("이전 검증 기록 회수 실패", r.stdout)

    def test_점검이_찾은_장애는_run_을_빨갛게_만들지_않는다(self):
        # 기존 설계: 점검 대상의 장애는 제목 고정 이슈로 알린다. 여기서 run 을 실패시키라는 뜻이 아니다.
        for code in ("1", "2"):
            r, _ = self.judge(OPS_CODE=code)
            self.assertEqual(r.returncode, 0, f"점검 판정 {code} 로 run 을 실패시키면 기존 설계가 바뀐다")
            self.assertIn(f"통합 점검 전달 판정: {code}", r.stdout)

    def test_로그_기록_실패는_별개의_실행_문제로_빨갛다(self):
        for key in ("OPS_LOG", "VS_LOG"):
            r, _ = self.judge(**{key: "fail"})
            self.assertEqual(r.returncode, 1, key)
            self.assertIn("요약 로그 기록 실패", r.stdout)

    def test_보고서_누락은_정상으로_위장되지_않는다(self):
        r, _ = self.judge(OPS_REPORT="broken")
        self.assertEqual(r.returncode, 1)
        self.assertIn("정상으로 적지 않고", r.stdout)

    def test_이유가_여러_개면_전부_적는다(self):
        r, _ = self.judge(CODE="1", COMMIT_OUTCOME="failure", OPS_LOG="fail", OPS_REPORT="broken")
        self.assertEqual(r.returncode, 1)
        for needle in ("예정 시험 실행기 종료코드", "기록 저장(main push) 실패", "요약 로그 기록 실패", "깨졌다"):
            self.assertIn(needle, r.stdout, needle)


class FaultIssueIsNeverClosedOnFaultOrUnknown(_StepHarness):
    """5. 확인 불가·장애를 정상 처리해서 기존 장애 이슈를 닫지 않는다. 진짜 `gh` 대신 호출을 적는 대역을 둔다."""

    STEP_NAME = "장애 이슈"
    STEP_NEEDLE = "gh issue list"

    def setUp(self):
        super().setUp()
        self.calls = os.path.join(self.root, "gh_calls.txt")
        self.shim("gh", f'''#!/bin/sh
echo "$@" >> "{self.calls}"
case "$1 $2" in
  "issue list") echo 77 ;;
  "issue view") echo "(본문에 서명 없음)" ;;
esac
exit 0
''')
        with open(os.path.join(self.tmp, "ops.txt"), "w", encoding="utf-8") as fh:
            fh.write("결론: 장애 1건\n")

    def gh_calls(self):
        if not os.path.exists(self.calls):
            return []
        return open(self.calls, encoding="utf-8").read().splitlines()

    def test_장애면_이슈를_닫지_않고_기록한다(self):
        r, _ = self.run_step(CODE="1", SIG="214b8601d4", OPS_TITLE="🩺 [GAEO Ops] 일일 통합 점검 장애")
        self.assertEqual(r.returncode, 0, r.stderr)
        calls = self.gh_calls()
        self.assertFalse([c for c in calls if c.startswith("issue close")], f"장애인데 이슈를 닫았다: {calls}")
        self.assertTrue([c for c in calls if c.startswith("issue comment")], calls)

    def test_정상이면_기존_장애_이슈를_닫는다(self):
        r, _ = self.run_step(CODE="0", SIG="clean", OPS_TITLE="🩺 [GAEO Ops] 일일 통합 점검 장애")
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertTrue([c for c in self.gh_calls() if c.startswith("issue close 77")], self.gh_calls())

    def test_같은_서명은_다시_쓰지_않는다(self):
        self.shim("gh", f'''#!/bin/sh
echo "$@" >> "{self.calls}"
case "$1 $2" in
  "issue list") echo 77 ;;
  "issue view") echo "<!-- gaeo-ops-signature:214b8601d4 -->" ;;
esac
exit 0
''')
        r, _ = self.run_step(CODE="1", SIG="214b8601d4", OPS_TITLE="🩺 [GAEO Ops] 일일 통합 점검 장애")
        self.assertEqual(r.returncode, 0, r.stderr)
        calls = self.gh_calls()
        self.assertFalse([c for c in calls if c.startswith("issue comment")], f"중복 기록: {calls}")
        self.assertFalse([c for c in calls if c.startswith("issue create")], calls)

if __name__ == "__main__":
    unittest.main(verbosity=2)
