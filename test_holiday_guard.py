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
        for name in ("update-prices.yml", "update-analysis.yml"):
            body = self._body(name)
            guarded = [line for line in body.splitlines()
                       if '[ "$dow" -le 5 ]' in line]
            self.assertTrue(guarded, f"{name}에서 요일 판정을 찾지 못했다")
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


if __name__ == "__main__":
    unittest.main(verbosity=2)
