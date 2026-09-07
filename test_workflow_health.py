#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""워크플로 유효성 감시 계약 (2026-09-07 사고 후 신설).

## 이 감시가 왜 필요했나

`update-analysis.yml`이 GitHub 한도를 넘겨 **파일 자체가 무효**가 된 동안,
어떤 감시도 "왜 안 도는가"를 말해주지 못했다. 무효 상태에서는

  · job이 0개 생성된다 → 로그가 없다
  · `workflow_dispatch`가 거부된다 → 자기 재기동 체인이 끊기고,
    워치독이 내리는 "재기동" 조치도 **영원히 실패한다**

그래서 산출물만 보던 감시는 "실행 중인 run 없음 — 재기동"만 10.5시간 반복했을 것이다.

## 잠그는 것

1. GitHub이 파싱에 실패하면 API `name`에 파일 경로를 넣는다 — 그 지문을 읽는가
2. **확인하지 못한 경우를 "정상"으로 돌려주지 않는가** (이 사고의 핵심 교훈)
3. 15분마다 도는 워치독 워크플로가 이 검사를 실제로 실행하는가
4. 워치독 판정기가 "run 목록 조회 실패"를 "run 없음"으로 읽지 않는가
"""
import datetime
import os
import unittest

import check_workflow_health as H
import pipeline_watchdog as W

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))


class Canary(unittest.TestCase):
    """GitHub이 알려주는 '파싱 실패' 지문을 제대로 읽는가."""

    def test_감시_대상에_핵심_러너가_모두_들어_있다(self):
        for workflow in ("update-prices.yml", "update-analysis.yml", "pipeline-watchdog.yml"):
            self.assertIn(workflow, H.CRITICAL, f"{workflow}이 유효성 감시 대상에서 빠졌다.")

    def test_파일에서_이름을_읽는다(self):
        self.assertEqual(H.declared_name("update-analysis.yml"), "update-analysis")
        self.assertEqual(H.declared_name("update-prices.yml"), "update-prices")

    def test_경로가_이름으로_오면_무효로_판정한다(self):
        """실측(2026-09-07): 깨진 파일은 name이 '.github/workflows/update-analysis.yml'이었다."""
        real = H._get
        H._get = lambda url, token: {"name": ".github/workflows/update-analysis.yml"}
        try:
            state, message = H.check("owner/repo", "t", "update-analysis.yml")
        finally:
            H._get = real
        self.assertEqual(state, "broken", message)
        self.assertIn("파싱하지 못한다", message)

    def test_정상_이름이면_통과한다(self):
        real = H._get
        H._get = lambda url, token: {"name": "update-analysis"}
        try:
            state, _ = H.check("owner/repo", "t", "update-analysis.yml")
        finally:
            H._get = real
        self.assertEqual(state, "ok")

    def test_조회에_실패하면_정상이_아니라_모름이다(self):
        """⭐ 이 사고의 핵심 교훈 — '확인 못 함'을 '정상'으로 읽지 않는다."""
        real = H._get

        def boom(url, token):
            raise OSError("network down")

        H._get = boom
        try:
            state, message = H.check("owner/repo", "t", "update-analysis.yml")
        finally:
            H._get = real
        self.assertEqual(state, "unknown", message)
        self.assertNotEqual(state, "ok")

    def test_토큰이_없으면_종료코드가_0이_아니다(self):
        """토큰 없이 돌려놓고 '통과'로 읽으면 감시가 있으나 마나다."""
        saved = {k: os.environ.get(k) for k in ("GITHUB_REPOSITORY", "GH_TOKEN", "GITHUB_TOKEN")}
        for k in saved:
            os.environ.pop(k, None)
        try:
            import contextlib, io
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                rc = H.main()
        finally:
            for k, v in saved.items():
                if v is not None:
                    os.environ[k] = v
        self.assertEqual(rc, H.EXIT_UNKNOWN)
        self.assertNotEqual(rc, H.EXIT_OK)
        self.assertIn("정상이라는 뜻이 아니다", buf.getvalue())


class WiredIntoWatchdog(unittest.TestCase):
    def test_15분마다_도는_워치독이_이_검사를_돌린다(self):
        path = os.path.join(HERE, ".github", "workflows", "pipeline-watchdog.yml")
        with open(path, encoding="utf-8") as fh:
            body = fh.read()
        self.assertIn("check_workflow_health.py", body,
                      "워치독이 워크플로 유효성 검사를 돌리지 않는다 — 파일이 무효여도 아무도 모른다.")
        self.assertLess(body.index("check_workflow_health.py"), body.index("pipeline_watchdog.py --apply"),
                        "유효성 검사는 좀비 감시보다 먼저 돌아야 한다 — 파일이 무효면 '재기동' 조치가 영원히 실패한다.")
        self.assertIn("continue-on-error: true", body,
                      "이 검사가 실패해도 좀비 감시는 계속 돌아야 한다(감시자가 감시를 막으면 안 된다).")


class WatchdogNeverGuesses(unittest.TestCase):
    """워치독이 '조회 실패'를 'run 없음'으로 읽지 않는가."""

    def _cfg(self):
        return dict(W.PIPELINES["prices"])

    def test_조회_실패는_재기동이_아니라_판정_보류다(self):
        now = datetime.datetime(2026, 9, 7, 11, 0, tzinfo=KST)
        d = W.decide(self._cfg(), output_age_min=999, runs=None, now=now)
        self.assertEqual(d["action"], "ok",
                         "run 목록을 못 봤는데 재기동을 시도한다 — 파일이 무효면 그 dispatch도 거부된다.")
        self.assertIn("조회하지 못했다", d["reason"])
        self.assertEqual(d["cancel"], [])

    def test_정말_run이_없으면_예전처럼_재기동한다(self):
        now = datetime.datetime(2026, 9, 7, 11, 0, tzinfo=KST)
        d = W.decide(self._cfg(), output_age_min=999, runs=[], now=now)
        self.assertEqual(d["action"], "kickoff",
                         "확인해서 정말 없을 때는 종전대로 재기동해야 한다.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
