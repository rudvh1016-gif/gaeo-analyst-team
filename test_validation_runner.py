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

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import buy_warning as B                                    # noqa: E402
import compute_team_weights as W                           # noqa: E402
import evaluate_preregistered_buy_filters as E             # noqa: E402
import run_validation_schedule as R                        # noqa: E402
from krx_calendar import is_krx_trading_day                # noqa: E402

WORKFLOW = os.path.join(HERE, ".github", "workflows", "ops-daily.yml")
ALLOWED_COMMIT_PATHS = ("docs/audits/validation_runs", "docs/VALIDATION_SCHEDULE.md", "docs/operations/repair_requests")

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

    def test_push_트리거가_없고_기록은_main에서만(self):
        on_block = self.body.split("\non:\n", 1)[1].split("\npermissions:", 1)[0]
        self.assertNotIn("push:", on_block, "push 트리거가 있으면 브랜치에 올리는 순간 기동한다(2026-09-07 사고)")
        self.assertIn("schedule:", on_block)
        self.assertIn("workflow_dispatch:", on_block)
        self.assertIn("github.ref == 'refs/heads/main'", self.body)
        self.assertIn("if: env.APPLY == 'true'", self.body)

    def test_커밋은_허용_경로_3곳만_원장은_덧붙이기만(self):
        add_lines = [l for l in self.body.splitlines() if "git add" in l]
        self.assertEqual(len(add_lines), 1)
        for tok in add_lines[0].split("--", 1)[1].split():
            self.assertIn(tok, ALLOWED_COMMIT_PATHS, tok)
        self.assertIn("허용 밖 경로가 스테이지됐다", self.body)
        self.assertIn("grep -q '^-[^-]'", self.body, "원장에서 지워진 줄을 잡는 검사")
        self.assertIn("--diff-filter=DM", self.body, "기존 결과 파일 수정·삭제를 잡는 검사")
        self.assertIn("[skip ci]", self.body)

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
                       "retention-days: 90", "git ls-remote origin refs/heads/main", "저장 확인", "원격 저장",
                       "if: always() && env.APPLY == 'true' && (steps.vs.outputs.notify == 'true'",
                       "if: always() && env.APPLY == 'true' && steps.ops.outputs.code != '2'",
                       'COMMIT_OUTCOME: ${{ steps.commit.outcome }}'):
            self.assertIn(needle, self.body, needle)
        order = [self.body.index(k) for k in ("--reconcile-inbox", "run_validation_schedule.py $args", "id: commit",
                                              "id: inboxsave", "upload-artifact", "id: saved", "예정 시험 이슈 갱신", "결과 판정")]
        self.assertEqual(order, sorted(order), "스텝 순서: 회수 → 실행 → 커밋 → 보존 → artifact → 저장 확인 → 이슈 → 판정")
        # inbox 브랜치 삭제는 main 저장이 확인된 뒤에만
        self.assertIn('if [ "$P" = "true" ] && [ -s "$RUNNER_TEMP/inbox_branches.txt" ]', self.body)

    def test_LLM_호출이_없다(self):
        for bad in ("anthropic", "openai", "claude", "gpt", "api.openai", "messages.create"):
            self.assertNotIn(bad, self.code.lower(), bad)


if __name__ == "__main__":
    unittest.main(verbosity=2)
