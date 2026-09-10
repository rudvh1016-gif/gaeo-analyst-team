#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ops_status.py 계약 — AI 없는 통합 상태 점검이 '모른다'를 '괜찮다'로 바꾸지 않는지.

1. 격리: ops_status 는 LLM·HTTP 클라이언트 모듈을 import 하지 않고(정적 AST), 기본 실행은 네트워크 호출을
   한 번도 하지 않으며(urlopen 을 가로채 센다), 네트워크가 막힌 상태에서 --probe-pages 를 켜도 예외가 아니라
   '확인 불가'로 끝난다.
2. 판정: 합성 자료(임시 폴더)로 거래일 장중·주말·장외를 바꿔 가며 시세/자동분석/PAPER/Evolution/일정의
   정상·정상 대기·장애·확인 불가를 고정한다.
3. 요약: 장애나 확인 불가가 하나라도 있으면 "장애·확인 불가 없음" 문장이 절대 나오지 않는다.
4. 서명: 같은 종류의 장애면 분 단위 숫자가 달라도 같은 서명(같은 사고 번호)이다.
"""
import ast
import datetime
import glob
import json
import os
import shutil
import sys
import tempfile
import unittest
import urllib.request

import ops_status as OS

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))

FORBIDDEN_IMPORTS = {"anthropic", "openai", "requests", "httpx", "aiohttp", "google", "groq", "langchain"}


def fixture(tmp, *, price_at, auto_at, paper_at, paper_result="CYCLE_OK — NO_ACTION",
            evo_at="2026-09-06T00:35:24+00:00", schedule_due="2026-09-15T17:00:00+09:00", ledger_lines=()):
    os.makedirs(os.path.join(tmp, "paper_trading"))
    os.makedirs(os.path.join(tmp, "gaeo_evolution", "status"))
    os.makedirs(os.path.join(tmp, "config"))
    os.makedirs(os.path.join(tmp, "docs", "audits", "validation_runs"))
    w = lambda rel, body: open(os.path.join(tmp, rel), "w", encoding="utf-8").write(body)
    w("data.js", f'const LIVE_DATA = {{\n "date": "{price_at} 장중",\n "stocks": {{}}\n}};\n')
    stocks = {c: {"chief": {"call": "HOLD"}} for c in ("000001", "000002", "000003")}
    w("auto_analysis.js", f'const LIVE_AUTO = {json.dumps({"generatedAt": auto_at, "stocks": stocks})};\n')
    w("tickers.js", 'const TICKERS = [{"code":"000001"},{"code":"000002"},{"code":"000003"}];\n')
    w("indicators.json", json.dumps({"generatedAt": auto_at, "stocks": {"000001": {"tech": {}, "flow": {}}}}))
    w("dart_today.js", f'const DART_TODAY = {json.dumps({"generatedAt": auto_at, "count": 3, "coverageState": "EVENT_DETECTED"})};\n')
    w("paper_trading/state.json", json.dumps({"lastCycleAt": paper_at, "lastCycleResult": paper_result}))
    w("paper_trading/summary.json", json.dumps({"openTrades": 4}))
    w("paper_runner_config.json", json.dumps({"activeRunner": "WINDOWS"}))
    w("gaeo_evolution/status/evolution_status.json", json.dumps({"generatedAt": evo_at, "mode": "BOOTSTRAP_SHADOW",
                                                                  "systemHealth": "OK", "safeModeReasons": [],
                                                                  "baselineSummary": {"uniqueDays": 10}}))
    w("config/validation_schedule.json", json.dumps({
        "ledgerPath": "docs/audits/validation_runs/ledger.jsonl",
        "schedules": [{"scheduleId": "VS-TEST", "kind": "CONFIRMATION", "dueAt": schedule_due, "cutoffDate": schedule_due[:10]}]}))
    w("docs/audits/validation_runs/ledger.jsonl", "".join(json.dumps(r) + "\n" for r in ledger_lines))
    return tmp


class Isolation(unittest.TestCase):
    def test_LLM_HTTP_모듈을_import_하지_않는다(self):
        tree = ast.parse(open(os.path.join(HERE, "ops_status.py"), encoding="utf-8").read())
        names = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                names |= {a.name.split(".")[0] for a in node.names}
            elif isinstance(node, ast.ImportFrom) and node.module:
                names.add(node.module.split(".")[0])
        self.assertFalse(names & FORBIDDEN_IMPORTS, f"금지 모듈 import: {names & FORBIDDEN_IMPORTS}")
        src = open(os.path.join(HERE, "ops_status.py"), encoding="utf-8").read()
        for key in ("ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GROQ_API_KEY", "api.anthropic.com", "api.openai.com"):
            self.assertNotIn(key, src)
        self.assertEqual(OS.LLM_CALLS, 0)

    def test_기본_실행은_네트워크를_한_번도_부르지_않는다(self):
        calls = []
        orig = urllib.request.urlopen

        def spy(*a, **k):
            calls.append(a)
            raise OSError("network blocked in test")
        urllib.request.urlopen = spy
        try:
            tmp = fixture(tempfile.mkdtemp(prefix="ops_"), price_at="2026-09-10 10:50", auto_at="2026-09-10 10:40",
                          paper_at="2026-09-10T10:35:00+09:00")
            now = datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST)
            OS.collect(tmp, now=now)
            self.assertEqual(calls, [], "기본 실행이 네트워크를 불렀다")
            rep = OS.collect(tmp, now=now, pages=True)
            self.assertEqual(rep["components"]["pages"]["status"], OS.UNKNOWN)
            self.assertGreaterEqual(len(calls), 1)
        finally:
            urllib.request.urlopen = orig
            shutil.rmtree(tmp, ignore_errors=True)

    def test_토큰이_없으면_워크플로_유효성은_확인_불가다(self):
        env = {k: os.environ.pop(k) for k in ("GH_TOKEN", "GITHUB_TOKEN", "GITHUB_REPOSITORY") if k in os.environ}
        try:
            self.assertEqual(OS.check_workflows_github()["status"], OS.UNKNOWN)
        finally:
            os.environ.update(env)


class Verdicts(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="ops_")

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_거래일_장중_신선하면_정상_어제_회차뿐인_PAPER는_장애(self):
        fixture(self.tmp, price_at="2026-09-10 10:50", auto_at="2026-09-10 10:40", paper_at="2026-09-09T15:05:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        c = rep["components"]
        self.assertEqual(c["prices"]["status"], OS.OK)
        self.assertEqual(c["analysis"]["status"], OS.OK)
        self.assertEqual(c["paper"]["code"], "PAPER_NO_CYCLE")
        self.assertEqual(c["paper"]["status"], OS.FAULT)
        self.assertEqual(c["coverage"]["code"], "COVERAGE_FULL")
        self.assertEqual(c["indicators"]["status"], OS.INSUFF, "출처 필드가 없으면 자료 부족이지 정상이 아니다")
        self.assertEqual(c["evolution"]["status"], OS.IDLE)
        self.assertEqual(c["schedule"]["status"], OS.OK)
        self.assertIn("paper", rep["faults"])
        text = OS.summarize(rep)
        self.assertIn("장애 1건", text)
        self.assertNotIn("장애·확인 불가 없음", text)

    def test_장중_시세가_멈추면_장애(self):
        fixture(self.tmp, price_at="2026-09-10 09:50", auto_at="2026-09-10 10:40", paper_at="2026-09-10T10:35:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        self.assertEqual(rep["components"]["prices"]["code"], "PRICES_STALE")
        self.assertEqual(rep["components"]["analysis"]["status"], OS.OK)
        self.assertEqual(rep["components"]["paper"]["status"], OS.OK)

    def test_주말에는_마지막_거래일_자료가_있으면_정상_대기(self):
        fixture(self.tmp, price_at="2026-09-11 16:02", auto_at="2026-09-11 16:20", paper_at="2026-09-11T15:05:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 12, 10, 0, tzinfo=KST))   # 토요일
        c = rep["components"]
        self.assertEqual(c["prices"]["status"], OS.IDLE)
        self.assertEqual(c["analysis"]["status"], OS.IDLE)
        self.assertEqual(c["paper"]["status"], OS.IDLE)
        self.assertFalse(rep["tradingDay"])
        self.assertEqual(rep["faults"], [])

    def test_주말이라도_마지막_거래일_자료가_없으면_장애(self):
        fixture(self.tmp, price_at="2026-09-10 16:02", auto_at="2026-09-10 16:20", paper_at="2026-09-01T15:05:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 12, 10, 0, tzinfo=KST))
        c = rep["components"]
        self.assertEqual(c["prices"]["code"], "PRICES_MISSING_LAST_SESSION")
        self.assertEqual(c["paper"]["code"], "PAPER_NO_CYCLE")
        self.assertEqual(c["paper"]["expectedCycleDay"], "2026-09-11")

    def test_거래일_아침_첫_회차_전에는_PAPER를_장애로_보지_않는다(self):
        fixture(self.tmp, price_at="2026-09-09 16:02", auto_at="2026-09-09 16:20", paper_at="2026-09-09T15:05:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 9, 20, tzinfo=KST))
        self.assertEqual(rep["components"]["paper"]["status"], OS.IDLE)
        self.assertEqual(rep["components"]["prices"]["status"], OS.IDLE, "08:58 창이 열렸어도 첫 수집 전이면 대기")

    def test_휴장일에는_장애로_보지_않는다(self):
        # 2026-09-24(목) 추석 휴장 — 러너가 안 도는 게 정상
        fixture(self.tmp, price_at="2026-09-23 16:02", auto_at="2026-09-23 16:20", paper_at="2026-09-23T15:05:00+09:00",
                evo_at="2026-09-20T00:35:00+00:00", schedule_due="2026-10-19T17:00:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 24, 11, 0, tzinfo=KST))
        self.assertFalse(rep["tradingDay"])
        self.assertEqual(rep["faults"], [])

    def test_Evolution_주간_실행이_없으면_장애(self):
        fixture(self.tmp, price_at="2026-09-10 10:50", auto_at="2026-09-10 10:40", paper_at="2026-09-10T10:35:00+09:00",
                evo_at="2026-08-30T00:35:00+00:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        self.assertEqual(rep["components"]["evolution"]["code"], "EVOLUTION_STALE")

    def test_예정_시험이_기록_없이_하루_넘게_지나면_장애_당일이면_대기(self):
        fixture(self.tmp, price_at="2026-09-16 10:50", auto_at="2026-09-16 10:40", paper_at="2026-09-16T10:35:00+09:00",
                schedule_due="2026-09-15T17:00:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 15, 18, 0, tzinfo=KST))
        self.assertEqual(rep["components"]["schedule"]["code"], "SCHEDULE_DUE_NOW")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 17, 11, 0, tzinfo=KST))
        self.assertEqual(rep["components"]["schedule"]["code"], "SCHEDULE_OVERDUE")

    def test_예정_시험_기록이_있으면_지나도_정상(self):
        fixture(self.tmp, price_at="2026-09-17 10:50", auto_at="2026-09-17 10:40", paper_at="2026-09-17T10:35:00+09:00",
                schedule_due="2026-09-15T17:00:00+09:00",
                ledger_lines=[{"scheduleId": "VS-TEST", "runAt": "2026-09-15T17:12:00+09:00", "status": "COMPLETED"}])
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 17, 11, 0, tzinfo=KST))
        self.assertEqual(rep["components"]["schedule"]["code"], "SCHEDULE_ON_TRACK")

    def test_파일이_없으면_확인_불가이지_정상이_아니다(self):
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        self.assertTrue(rep["unknowns"])
        self.assertEqual(rep["faults"], [])
        text = OS.summarize(rep)
        self.assertIn("정상이라는 뜻이 아니다", text)
        self.assertNotIn("장애·확인 불가 없음", text)
        self.assertEqual(rep["overall"], OS.UNKNOWN)

    def test_같은_종류의_장애는_분_숫자가_달라도_같은_서명이다(self):
        fixture(self.tmp, price_at="2026-09-10 09:50", auto_at="2026-09-10 10:40", paper_at="2026-09-10T10:35:00+09:00")
        a = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        b = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 30, tzinfo=KST))
        self.assertEqual(a["signature"], b["signature"])
        self.assertNotEqual(a["components"]["prices"]["detail"], b["components"]["prices"]["detail"])
        rr = OS.build_repair_request(a)
        self.assertIsNotNone(rr)
        self.assertTrue(rr[0].startswith("INC-"))
        self.assertIn("확인 순서", rr[1])
        self.assertIn("원인은 **확정하지 않는다.**", rr[1])

    def test_장애가_없으면_수리_요청서를_만들지_않는다(self):
        fixture(self.tmp, price_at="2026-09-10 10:50", auto_at="2026-09-10 10:40", paper_at="2026-09-10T10:35:00+09:00")
        rep = OS.collect(self.tmp, now=datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST))
        self.assertEqual(rep["faults"], [])
        self.assertIsNone(OS.build_repair_request(rep))


class CommandLine(unittest.TestCase):
    def test_종료코드는_장애1_확인불가2_정상0(self):
        tmp = tempfile.mkdtemp(prefix="ops_")
        try:
            fixture(tmp, price_at="2026-09-10 10:50", auto_at="2026-09-10 10:40", paper_at="2026-09-10T10:35:00+09:00")
            self.assertEqual(OS.main(["--root", tmp, "--now", "2026-09-10T11:00:00+09:00", "--quiet"]), 0)
            sat = fixture(tempfile.mkdtemp(prefix="sat_", dir=tmp), price_at="2026-09-11 16:02", auto_at="2026-09-11 16:20",
                          paper_at="2026-09-11T15:05:00+09:00")
            self.assertEqual(OS.main(["--root", sat, "--now", "2026-09-12T10:00:00+09:00", "--quiet"]), 0)
            fixture(tempfile.mkdtemp(prefix="ops2_", dir=tmp), price_at="2026-09-10 09:00", auto_at="2026-09-10 10:40",
                    paper_at="2026-09-10T10:35:00+09:00")
            sub = [d for d in glob.glob(os.path.join(tmp, "ops2_*"))][0]
            out = os.path.join(tmp, "rr")
            self.assertEqual(OS.main(["--root", sub, "--now", "2026-09-10T11:00:00+09:00", "--quiet", "--repair-request", out]), 1)
            self.assertTrue(glob.glob(os.path.join(out, "INC-*.md")))
            empty = tempfile.mkdtemp(prefix="ops3_", dir=tmp)
            self.assertEqual(OS.main(["--root", empty, "--now", "2026-09-10T11:00:00+09:00", "--quiet"]), 2)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)



YDAY_OPS = 17 * 60 + 40      # 목요일 11:00 기준 "어제 17:20" — 17:05 예정 뒤에 실제로 돈 run


class ScheduledRunsReality(unittest.TestCase):
    """예약 실행 실측(--github): cron 지연 vs 비활성 vs 실패 vs 잘못된 ref 를 구분하고, 조회 실패는 '확인 불가'다(2026-09-10 구간 D)."""

    def setUp(self):
        import check_workflow_health as CW
        self.CW = CW
        self.orig_get = CW._get
        self.env = {k: os.environ.get(k) for k in ("GH_TOKEN", "GITHUB_TOKEN", "GITHUB_REPOSITORY")}
        os.environ["GH_TOKEN"] = "x"; os.environ["GITHUB_REPOSITORY"] = "o/r"
        self.now = datetime.datetime(2026, 9, 10, 11, 0, tzinfo=KST)      # 목요일 장중

    def tearDown(self):
        self.CW._get = self.orig_get
        for k, v in self.env.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v

    def fake(self, states, runs, created=None):
        created = created or {}
        def _get(url, token):
            wf = url.split("/actions/workflows/")[1].split("/")[0].split("?")[0]
            if url.endswith("/runs?per_page=10"):
                return {"workflow_runs": runs.get(wf, [])}
            meta = {"state": states.get(wf, "active"), "name": wf}
            meta["created_at"] = created[wf] if wf in created else "2026-09-01T00:00:00Z"     # 기본: 오래전에 만들어진 워크플로
            return meta
        self.CW._get = _get

    def run_at(self, minutes_ago, event="schedule", conclusion="success", branch="main", status="completed", now=None):
        at = ((now or self.now) - datetime.timedelta(minutes=minutes_ago)).astimezone(datetime.timezone.utc)
        return {"created_at": at.strftime("%Y-%m-%dT%H:%M:%SZ"), "event": event, "conclusion": conclusion,
                "status": status, "head_branch": branch}

    def test_제때_돌았으면_정상(self):
        self.fake({}, {"pipeline-watchdog.yml": [self.run_at(10)], "ops-daily.yml": [self.run_at(YDAY_OPS)]})   # 어제 17:20
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["status"], OS.OK, c["detail"])

    def test_cron이_건너뛰면_지연_미실행으로_장애(self):
        t1300 = datetime.datetime(2026, 9, 10, 13, 0, tzinfo=KST)        # 마지막 schedule run 09:00 → 창 열린 뒤 240분 공백
        self.fake({}, {"pipeline-watchdog.yml": [self.run_at(240, now=t1300)], "ops-daily.yml": [self.run_at(YDAY_OPS, now=t1300)]})
        c = OS.check_scheduled_runs(t1300)
        self.assertEqual(c["status"], OS.FAULT)
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_RUN_MISSED")
        self.assertIn("cron 지연", c["detail"])

    def test_비활성_워크플로는_지연이_아니라_비활성으로_장애(self):
        self.fake({"ops-daily.yml": "disabled_inactivity"}, {"pipeline-watchdog.yml": [self.run_at(10)], "ops-daily.yml": [self.run_at(YDAY_OPS)]})
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["status"], OS.FAULT)
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "WORKFLOW_DISABLED")
        self.assertIn("비활성", c["detail"])

    def test_마지막_run_실패는_실패로_구분(self):
        self.fake({}, {"pipeline-watchdog.yml": [self.run_at(10, conclusion="failure")], "ops-daily.yml": [self.run_at(YDAY_OPS)]})
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_LAST_RUN_FAILED")
        self.assertIn("권한·문법", c["detail"])

    def test_잘못된_ref는_따로_구분(self):
        self.fake({}, {"pipeline-watchdog.yml": [self.run_at(10, branch="feature-x")], "ops-daily.yml": [self.run_at(YDAY_OPS)]})
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_WRONG_REF")

    def test_장외_시간에는_워치독이_안_도는_게_정상_대기(self):
        night = datetime.datetime(2026, 9, 10, 22, 0, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(6 * 60, now=night)], "ops-daily.yml": [self.run_at(295, now=night)]}   # 워치독 16:00 · ops 17:05
        self.fake({}, runs)
        c = OS.check_scheduled_runs(night)
        self.assertNotEqual(c["status"], OS.FAULT, c["detail"])
        self.assertIn(c["workflows"]["pipeline-watchdog.yml"]["code"], ("SCHEDULED_ON_TIME", "SCHEDULED_OUT_OF_WINDOW"))

    def test_수동_실행만_있고_schedule_발화가_없으면_정상으로_적지_않는다(self):
        runs = {"pipeline-watchdog.yml": [self.run_at(10)],
                "ops-daily.yml": [self.run_at(60, event="workflow_dispatch"), self.run_at(120, event="workflow_dispatch"), self.run_at(180, event="workflow_dispatch")]}
        # 워크플로가 9/1 에 생겼는데 어제 17:05 예정이 지나도록 schedule 발화 0회 → 수동 run 이 있어도 미실행(장애)
        self.fake({}, runs)
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "SCHEDULED_RUN_MISSED")
        self.assertEqual(c["workflows"]["ops-daily.yml"]["status"], OS.FAULT)
        self.assertIsNotNone(c["workflows"]["ops-daily.yml"]["manualRunAfterExpected"])
        # 워크플로가 예정 시각(어제 17:05) 뒤인 오늘 10:00 에 생겼으면 아직 첫 발화 전 → 정상 대기(정상 아님)
        self.fake({}, runs, created={"ops-daily.yml": "2026-09-10T01:00:00Z"})
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "SCHEDULED_ONLY_MANUAL")
        self.assertEqual(c["workflows"]["ops-daily.yml"]["status"], OS.IDLE)

    def test_수동_run이_예정_뒤에_있어도_schedule_미발화면_미실행(self):
        # 2026-09-10 검토 P1-1: 목 20:30, 어제 17:20 schedule 뒤 오늘은 17:40 dispatch 뿐 → 예약은 안 떴다
        t2030 = datetime.datetime(2026, 9, 10, 20, 30, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(4 * 60 + 25, now=t2030)],
                "ops-daily.yml": [self.run_at(170, event="workflow_dispatch", now=t2030), self.run_at(27 * 60 + 10, now=t2030)]}
        self.fake({}, runs)
        c = OS.check_scheduled_runs(t2030)
        w = c["workflows"]["ops-daily.yml"]
        self.assertEqual(w["code"], "SCHEDULED_RUN_MISSED", w)
        self.assertIsNotNone(w["manualRunAfterExpected"])
        self.assertIn("수동/이벤트 run", w["detail"])

    def test_워치독_자기_run이_최신이어도_schedule_공백은_미실행(self):
        # 화 12:30 장중: 방금 dispatch 로 뜬 자기 run 이 runs[0], 마지막 schedule 은 09:06 → 204분 공백
        t1230 = datetime.datetime(2026, 9, 8, 12, 30, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(0, event="workflow_dispatch", status="in_progress", conclusion=None, now=t1230),
                                          self.run_at(204, now=t1230)],
                "ops-daily.yml": [self.run_at(19 * 60 + 25, now=t1230)]}
        self.fake({}, runs)
        c = OS.check_scheduled_runs(t1230)
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_RUN_MISSED", c["workflows"]["pipeline-watchdog.yml"])

    def test_창_열린_직후에는_전날_마지막_run으로_오탐하지_않는다(self):
        # 2026-09-10 검토 P1-2: 월 09:10, 마지막 schedule run 금 16:49 → 창(08:58)이 하한이라 12분 공백일 뿐
        mon = datetime.datetime(2026, 9, 14, 9, 10, tzinfo=KST)
        fri_1649 = datetime.datetime(2026, 9, 11, 16, 49, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(int((mon - fri_1649).total_seconds() // 60), now=mon)],
                "ops-daily.yml": [self.run_at(int((mon - datetime.datetime(2026, 9, 11, 17, 20, tzinfo=KST)).total_seconds() // 60), now=mon)]}
        self.fake({}, runs)
        c = OS.check_scheduled_runs(mon)
        self.assertNotEqual(c["status"], OS.FAULT, c["detail"])
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_ON_TIME")

    def test_상태나_시각을_못_읽으면_확인_불가(self):
        # 2026-09-10 검토 P2-2: state 없음 → 비활성이 아니라 확인 불가 · schedule 발화 0회 + 생성 시각 없음 → 확인 불가
        runs = {"pipeline-watchdog.yml": [self.run_at(10)], "ops-daily.yml": [self.run_at(60, event="workflow_dispatch")]}
        self.fake({"pipeline-watchdog.yml": ""}, runs, created={"ops-daily.yml": None})
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["status"], OS.UNKNOWN)
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_STATE_UNKNOWN")
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "SCHEDULED_TIME_UNPARSED")

    def test_늦게라도_발화하면_지연분을_남긴다(self):
        # 2026-09-10 검토 P2-5: 예비 발화(17:37)로 돈 경우 정상이되 lateMin=32
        t1800 = datetime.datetime(2026, 9, 10, 18, 0, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(115, now=t1800)], "ops-daily.yml": [self.run_at(23, now=t1800)]}
        self.fake({}, runs)
        c = OS.check_scheduled_runs(t1800)
        w = c["workflows"]["ops-daily.yml"]
        self.assertEqual(w["code"], "SCHEDULED_ON_TIME"); self.assertEqual(w["lateMin"], 32)

    def test_서명은_만성_항목_scheduled를_다른_장애가_있을_때_뺀다(self):
        comps = {"paper": {"status": OS.FAULT, "code": "NO_CYCLE_TODAY"}, "scheduled": {"status": OS.FAULT, "code": "SCHEDULED_RUNS_FAULT"}}
        self.assertEqual(OS._signature_source(comps, ["paper", "scheduled"], []), "paper:NO_CYCLE_TODAY")
        self.assertEqual(OS._signature_source({"scheduled": comps["scheduled"]}, ["scheduled"], []), "scheduled:SCHEDULED_RUNS_FAULT")

    def test_일일_예약은_유예_안이면_대기_유예가_지나면_미실행(self):
        # 목요일 17:30: 오늘 17:05 예정이 지났지만 아직 유예(180분) 안 → 정상 대기. 20:10: 유예까지 지남 → 미실행(장애)
        t1730 = datetime.datetime(2026, 9, 10, 17, 30, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(10, now=t1730)], "ops-daily.yml": [self.run_at(24 * 60 + 10, now=t1730)]}   # 어제 17:20
        self.fake({}, runs)
        c = OS.check_scheduled_runs(t1730)
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "SCHEDULED_PENDING")
        self.assertEqual(c["workflows"]["ops-daily.yml"]["status"], OS.IDLE)
        self.assertNotEqual(c["status"], OS.FAULT, c["detail"])
        t2010 = datetime.datetime(2026, 9, 10, 20, 10, tzinfo=KST)
        runs = {"pipeline-watchdog.yml": [self.run_at(4 * 60 + 8, now=t2010)], "ops-daily.yml": [self.run_at(26 * 60 + 50, now=t2010)]}   # 워치독 16:02 · ops 어제 17:20
        self.fake({}, runs)
        c = OS.check_scheduled_runs(t2010)
        self.assertEqual(c["workflows"]["ops-daily.yml"]["code"], "SCHEDULED_RUN_MISSED")
        self.assertEqual(c["workflows"]["pipeline-watchdog.yml"]["code"], "SCHEDULED_OUT_OF_WINDOW", c["workflows"]["pipeline-watchdog.yml"])
        self.assertEqual(c["status"], OS.FAULT)

    def test_조회_실패는_확인_불가지_정상이_아니다(self):
        def boom(url, token):
            raise OSError("no network")
        self.CW._get = boom
        c = OS.check_scheduled_runs(self.now)
        self.assertEqual(c["status"], OS.UNKNOWN)
        os.environ.pop("GH_TOKEN", None); os.environ.pop("GITHUB_TOKEN", None)
        self.assertEqual(OS.check_scheduled_runs(self.now)["status"], OS.UNKNOWN)

    def test_예정_시험_항목은_마지막_원장_기록을_따로_적는다(self):
        tmp = tempfile.mkdtemp(prefix="ops_led_")
        try:
            os.makedirs(os.path.join(tmp, "config")); os.makedirs(os.path.join(tmp, "docs", "audits", "validation_runs", "VS-X"))
            json.dump({"ledgerPath": "docs/audits/validation_runs/ledger.jsonl", "schedules": [
                {"scheduleId": "VS-X", "dueAt": "2026-09-09T17:00:00+09:00", "cutoffDate": "2026-09-09"}]},
                      open(os.path.join(tmp, "config", "validation_schedule.json"), "w", encoding="utf-8"))
            with open(os.path.join(tmp, "docs", "audits", "validation_runs", "ledger.jsonl"), "w", encoding="utf-8") as fh:
                fh.write(json.dumps({"scheduleId": "VS-X", "runAt": "2026-09-09T17:05:00+09:00", "status": "COMPLETED",
                                     "resultPath": "docs/audits/validation_runs/VS-X/20260909T170500.json"}) + "\n")
            c = OS.check_validation_schedule(tmp, self.now)
            self.assertEqual(c["lastLedger"]["status"], "COMPLETED")
            self.assertFalse(c["lastLedger"]["resultFileExists"], "원장 줄은 있는데 결과 파일이 없으면 저장 확인이 거짓이어야 한다")
        finally:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
