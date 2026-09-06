#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""휴장일 유령 판단일 방지 — 파이프라인 전 구간 계약 테스트 (2026-09-06 신설).

## 왜 있나

`history.js`에 2026-08-17(광복절 대체휴일) 자동 기록이 598건 있었고, 8/14 기록이 있는
500종목 전부 기준가가 8/14 종가와 같았다(`price_history.js`에는 8/17 일봉이 없다).
원인은 한 줄이 아니라 **다섯 곳이 모두 요일만 봤기 때문**이다.

  ① `update-prices.yml`  — `dow<=5`만 보고 휴장일에도 수집 → 벤더가 준 직전 종가를 받음
  ② `update_prices.py`   — 그 값에 "{오늘} 종가" 라벨을 붙임 → 거짓 라벨
  ③ `update-analysis.yml`— 같은 조건으로 분석 실행 → 직전 종가 기준 판단 생성
  ④ `archive_analysis.py`— 그 판단을 그날 판단으로 history.js에 기록 → 유령 판단일 확정
  ⑤ `pipeline_watchdog.py`/`check_pipeline.py` — 휴장일의 조용함을 고장으로 읽고 러너를
     깨움 → **감시가 사고의 방아쇠**가 된다

그래서 다섯 곳이 **같은 달력(`krx_calendar.KRX_HOLIDAYS`)** 을 보는지를 한 파일에서 잠근다.
한 곳만 고치면 나머지가 되살리기 때문에, 개별 파일 테스트로 나누지 않았다.

창 안 평일 휴장일: 2026-09-24 · 09-25 · 10-05 · 10-09 (그 뒤 12-25 · 12-31).
과거 8/17 기록은 재구성 금지 원칙대로 지우지 않는다 — 앞으로 새로 쌓지 않을 뿐이다.
"""
import datetime
import pathlib
import unittest

import archive_analysis
import check_pipeline
import pipeline_watchdog
import update_prices
from krx_calendar import is_krx_trading_day

ROOT = pathlib.Path(__file__).resolve().parent
KST = check_pipeline.KST

HOLIDAY = datetime.date(2026, 9, 24)      # 창 안 첫 재발일(목)
TRADING = datetime.date(2026, 9, 23)      # 그 전날(수)


class Calendar(unittest.TestCase):
    def test_창_안_평일_휴장일이_달력에_있다(self):
        for day in ("2026-09-24", "2026-09-25", "2026-10-05", "2026-10-09"):
            d = datetime.date.fromisoformat(day)
            self.assertLess(d.weekday(), 5, f"{day}는 평일이어야 이 테스트가 뜻이 있다")
            self.assertFalse(is_krx_trading_day(d), f"{day}는 휴장일로 등록돼 있어야 한다")
        self.assertTrue(is_krx_trading_day(TRADING))

    def test_달력이_만료되기_전에_갱신을_강제한다(self):
        """명단은 2026년치뿐이다. 다 쓰기 전에 CI가 먼저 알려줘야 한다.

        이 테스트가 빨개지면 **버그가 아니라 알림**이다. `krx_calendar.KRX_HOLIDAYS`에
        다음 해 KRX/한국천문연구원 휴장일을 추가하면 된다. 명단이 비면 그날부터
        모든 방어(워크플로·아카이브·워치독·평가기)가 조용히 요일 판정으로 되돌아간다.
        """
        from krx_calendar import KRX_HOLIDAYS
        last = max(KRX_HOLIDAYS)
        today = datetime.date.today()
        self.assertGreaterEqual(
            (last - today).days, 30,
            f"휴장일 달력이 {last}까지밖에 없다(오늘 {today}). "
            f"krx_calendar.KRX_HOLIDAYS에 다음 해 휴장일을 추가할 것.")


class IndependentSignal(unittest.TestCase):
    """⑥ 달력을 보지 않는 두 번째 눈 — 명단에 없는 휴장일도 잡는다.

    2026-07-17은 실제 휴장일인데 `KRX_HOLIDAYS`에 없다(price_history.js 일봉 0건,
    그런데 history.js에는 tier=auto 500건이 남았다). 달력만 다섯 군데에 복사해서는
    이런 '명단 누락'을 영원히 못 잡으므로, 기준가가 통째로 얼어붙었는지를 따로 본다.

    실측 분리도(history.js 601종목): 정상 거래일 1.2~4.8% vs 유령 판단일 99.4~99.8%.
    """

    def _run(self, base_prev, base_today, n=200, day="2026-09-23"):
        auto = {"generatedAt": f"{day} 16:02", "stocks": {}}
        hist = {}
        for i in range(n):
            code = f"{i:06d}"
            auto["stocks"][code] = {
                "base": base_today(i), "baseAt": f"{day} 종가 (16:02 수집)",
                "chief": {"call": "HOLD", "total": 50},
            }
            hist[code] = [{"date": "2026-09-22", "base": base_prev(i), "tier": "auto"}]
        orig = archive_analysis.load_js_object
        archive_analysis.load_js_object = lambda path, name: auto
        try:
            archive_analysis.archive_auto(hist)
        finally:
            archive_analysis.load_js_object = orig
        return sum(1 for rows in hist.values()
                   if any(str(r.get("date"))[:10] == day for r in rows))

    def test_기준가가_통째로_얼어붙은_날은_달력이_거래일이라_해도_막는다(self):
        recorded = self._run(lambda i: 1000 + i, lambda i: 1000 + i)
        self.assertEqual(recorded, 0,
                         "직전 기록일과 기준가가 100% 같은 날이 기록됐다 — 유령 판단일이다")

    def test_정상_거래일은_그대로_기록한다(self):
        recorded = self._run(lambda i: 1000 + i, lambda i: 1000 + i + (1 if i % 20 else 0))
        self.assertEqual(recorded, 200,
                         "정상 거래일이 막혔다 — 이 오탐은 판단일을 통째로 잃는다")

    def test_표본이_적으면_판정하지_않는다(self):
        recorded = self._run(lambda i: 1000 + i, lambda i: 1000 + i, n=20)
        self.assertEqual(recorded, 20,
                         "비교 표본이 적은 날까지 막으면 신규 상장만 있는 날을 잃는다")


class Workflows(unittest.TestCase):
    """① ③ 수집·분석 워크플로가 달력을 실제로 참조한다."""

    def _body(self, name):
        return (ROOT / ".github" / "workflows" / name).read_text(encoding="utf-8")

    def test_두_워크플로가_krx_달력을_참조한다(self):
        for name in ("update-prices.yml", "update-analysis.yml"):
            body = self._body(name)
            self.assertIn("is_krx_trading_day", body,
                          f"{name}이 요일만 보고 있다 — 휴장일에도 러너가 돈다")
            self.assertIn('trading=""', body, f"{name}에 휴장일 분기가 없다")

    def test_장중_분기와_개장전_분기_모두_거래일_조건이_붙어_있다(self):
        """수집으로 들어가는 두 분기(`if`/`elif`)에 거래일 조건이 함께 걸려 있는가.

        ⚠️ 이건 글자만 보는 얕은 검사다. 실제로 어느 분기로 가는지는
           `test_workflow_branch_exec.py`가 `run:` 블록을 bash로 돌려서 확인한다
           (조건이 뒤집히거나 `trading`이 뒤에서 덮이는 건 글자 검사로 못 잡는다).
        """
        for name in ("update-prices.yml", "update-analysis.yml"):
            body = self._body(name)
            guarded = [line for line in body.splitlines()
                       if '[ "$dow" -le 5 ]' in line and '"$open"' in line]
            self.assertEqual(len(guarded), 2,
                             f"{name}에서 수집 진입 분기 2개를 찾지 못했다")
            for line in guarded:
                self.assertIn('[ -n "$trading" ]', line,
                              f"{name}의 이 분기에 거래일 조건이 없다: {line.strip()}")


class PriceLabel(unittest.TestCase):
    """② 휴장일에 수동 실행되더라도 '오늘 종가'라고 거짓 라벨을 붙이지 않는다."""

    def test_휴장일_라벨_분기가_있다(self):
        src = (ROOT / "update_prices.py").read_text(encoding="utf-8")
        self.assertIn("is_krx_trading_day", src)
        self.assertIn("휴장일 · 최근 종가", src)

    def test_주말_라벨은_그대로다(self):
        src = (ROOT / "update_prices.py").read_text(encoding="utf-8")
        self.assertIn("주말 · 최근 종가", src)


class ArchiveGuard(unittest.TestCase):
    """④ 기록 직전 2차 방어 — 거래일이 아니면 history.js에 쌓지 않는다."""

    def test_거래일_판정(self):
        self.assertTrue(archive_analysis._is_trading_day("2026-09-23"))
        self.assertFalse(archive_analysis._is_trading_day("2026-09-24"))
        self.assertFalse(archive_analysis._is_trading_day("2026-08-17"))
        self.assertFalse(archive_analysis._is_trading_day(""))
        self.assertFalse(archive_analysis._is_trading_day("2026-13-40"))

    def test_휴장일_자동판단은_기록되지_않고_거래일만_남는다(self):
        auto = {"generatedAt": "2026-09-24 16:02", "stocks": {}}
        for code, day in (("000001", "2026-09-24"), ("000002", "2026-09-23")):
            auto["stocks"][code] = {
                "base": 1000, "baseAt": f"{day} 종가 (16:02 수집)",
                "chief": {"call": "HOLD", "total": 50},
            }
        hist = {}
        orig = archive_analysis.load_js_object
        archive_analysis.load_js_object = lambda path, name: auto
        try:
            archive_analysis.archive_auto(hist)
        finally:
            archive_analysis.load_js_object = orig
        self.assertNotIn("000001", hist, "휴장일 판단이 기록됐다 — 유령 판단일이 다시 생긴다")
        self.assertEqual([e["date"] for e in hist.get("000002", [])], ["2026-09-23"])


class WatchdogWindow(unittest.TestCase):
    """⑤ 감시가 휴장일의 조용함을 고장으로 읽고 러너를 깨우지 않는다."""

    def test_휴장일에는_감시하지_않는다(self):
        noon = datetime.datetime(2026, 9, 24, 11, 30, tzinfo=KST)
        self.assertFalse(pipeline_watchdog.in_window(noon),
                         "휴장일에 감시가 켜지면 러너를 깨워 유령 기록을 만든다")

    def test_직전_거래일_같은_시각에는_감시한다(self):
        noon = datetime.datetime(2026, 9, 23, 11, 30, tzinfo=KST)
        self.assertTrue(pipeline_watchdog.in_window(noon))

    def test_세션훅도_같은_달력을_쓴다(self):
        src = (ROOT / "check_pipeline.py").read_text(encoding="utf-8")
        self.assertIn("is_krx_trading_day", src,
                      "SessionStart 훅이 휴장일에 '며칠 전 갱신됨' 거짓 경고를 낸다")

    def test_감시_생략_로그가_휴장일임을_밝힌다(self):
        """로그를 읽는 안전망 Routine이 '아직 조치 안 됨'으로 오독하면 안 된다.

        이 로그가 "수집 창 밖"이라고만 찍히면, 매시 도는 Routine이 잠자는 체인 run을
        좀비로 오인해 취소한다 — 2026-07-21 체인 사망과 같은 기전이다.
        """
        import contextlib, io, sys
        buf = io.StringIO()
        real = pipeline_watchdog.datetime.datetime
        argv = sys.argv
        sys.argv = ["pipeline_watchdog.py"]

        class FakeDT(real):
            @classmethod
            def now(cls, tz=None):
                return real(2026, 9, 24, 11, 30, tzinfo=tz or KST)

        pipeline_watchdog.datetime.datetime = FakeDT
        try:
            with contextlib.redirect_stdout(buf):
                rc = pipeline_watchdog.main()
        finally:
            pipeline_watchdog.datetime.datetime = real
            sys.argv = argv
        out = buf.getvalue()
        self.assertEqual(rc, 0)
        self.assertIn("휴장일", out, f"휴장일 사유가 로그에 없다: {out!r}")

    def test_훅은_달력이_깨져도_세션을_막지_않는다(self):
        """check_pipeline.py docstring의 '어떤 경우에도 exit 0' 계약."""
        src = (ROOT / "check_pipeline.py").read_text(encoding="utf-8")
        self.assertIn("except Exception", src.split("HERE =")[0],
                      "달력 import가 방어되지 않아, 모듈이 깨지면 훅이 traceback으로 죽는다")


if __name__ == "__main__":
    unittest.main(verbosity=2)
