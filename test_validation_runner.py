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
a = ap.parse_args()
if a.fail:
    print("boom", file=sys.stderr); sys.exit(3)
knobs = json.load(open("knobs.json")) if os.path.exists("knobs.json") else {}
if a.prereg:
    days = int(knobs.get("days", 12))
    doc = {"status": "EVALUATED" if days >= 20 else "INSUFFICIENT", "asOf": a.as_of,
           "sample": {"decisionDays": days, "rows": days * 4, "buy": days * 2, "buyFeatureUnrecorded": int(knobs.get("unrecorded", 0))}}
    if days >= 20:
        doc["verdicts"] = {"H0_crash": "PASS", "H0_mean": "FAIL", "H1_crash": "PASS_PROVISIONAL" if days < 40 else "PASS", "H2_crash": "FAIL"}
        doc["holmP"] = {}; doc["preRegisteredConsequences"] = {}
    print(json.dumps(doc)); sys.exit(0)
if a.flow:
    print(json.dumps({"status": knobs.get("flow", "NOT_READY"), "commonDays": 12, "conditions": {"minCommonDays": 20},
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
            "flow_validation_readiness": {"argv": ["python3", "fake_step.py", "--flow"], "status": "available"},
            "team_weights_transition_check": {"argv": ["python3", "fake_step.py", "--tw"], "status": "available"},
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
        self.cfg["schedules"] = [schedule()]

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

    def test_원장은_덧붙이기만_한다(self):
        self.save(schedule(kind="EVALUATION", minSample={"decisionDays": 20}, steps=("prereg_evaluate",),
                           onInsufficient={"rule": "recheck", "everyDays": 7, "maxRechecks": 3}))
        self.knobs(days=12)
        self.assertEqual(self.run_main("--now", "2026-09-15T17:05:00+09:00", "--apply"), 0)
        first = self.ledger_bytes()
        self.assertEqual(self.ledger()[0]["status"], "INSUFFICIENT")
        self.assertEqual(self.ledger()[0]["nextCheckAt"], "2026-09-22T17:00:00+09:00")
        # 다음 날: 기다린다(아무것도 쓰지 않는다)
        self.assertEqual(self.run_main("--now", "2026-09-16T17:05:00+09:00", "--apply"), 0)
        self.assertEqual(self.ledger_bytes(), first)
        # 재확인일: 두 번째 줄이 붙고 첫 줄은 그대로
        self.knobs(days=22)
        self.assertEqual(self.run_main("--now", "2026-09-22T17:05:00+09:00", "--apply"), 0)
        second = self.ledger_bytes()
        self.assertTrue(second.startswith(first), "원장의 이전 줄이 바뀌었다")
        led = self.ledger()
        self.assertEqual([r["status"] for r in led], ["INSUFFICIENT", "COMPLETED"])
        self.assertEqual(len({r["resultPath"] for r in led}), 2, "결과 파일은 새 파일로만")
        self.assertTrue(all(os.path.exists(os.path.join(self.root, r["resultPath"])) for r in led))
        # 후속 명세는 EVALUATED 결과에만, 코드 변경 없이
        followup = [f for f in self.docs_files() if f.endswith(".followup.md")]
        self.assertEqual(len(followup), 1)
        self.assertIn("코드 변경은 하지 않았다", open(os.path.join(self.root, followup[0]), encoding="utf-8").read())

    def test_계획만_모드는_아무것도_쓰지_않는다(self):
        self.save(schedule())
        code = self.run_main("--now", "2026-09-15T17:05:00+09:00", "--json", os.path.join(self.root, "out.json"))
        self.assertEqual(code, 0)
        self.assertEqual(self.docs_files(), [])
        out = json.load(open(os.path.join(self.root, "out.json"), encoding="utf-8"))
        self.assertFalse(out["apply"])
        self.assertEqual(out["plan"][0]["action"], "RUN")
        self.assertIn("VS-TEST", out["results"], "계획 모드도 결과(메모리)는 낸다 — 파일만 안 쓴다")

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
        self.save(schedule(steps=("team_weights_transition_check", "prereg_evaluate"),
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

    def test_LLM_호출이_없다(self):
        for bad in ("anthropic", "openai", "claude", "gpt", "api.openai", "messages.create"):
            self.assertNotIn(bad, self.code.lower(), bad)


if __name__ == "__main__":
    unittest.main(verbosity=2)
