#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""화면(app.js)의 휴장일 목록이 파이프라인(krx_calendar.py)과 같은지 잠근다 (2026-09-06 신설).

## 왜 있나

2026-09-06부터 러너가 휴장일에 아예 돌지 않는다. 그 전에는 휴장일에도 수집이 돌아
`data.js`에 그날 날짜가 찍혔기 때문에 화면이 휴장일을 몰라도 아무 일이 없었다.
이제는 모르면 공휴일마다 홈에

    ⚠️ 마지막 갱신은 2026-09-23입니다 (약 1일 전)
    DAILY BRIEF … · 새 시세 확인 중

이 뜬다. 시장이 안 열린 날이니 **고장이 아니라 정상**인데 경고가 뜨는 것이다
(PR #513 검수 m1). 그래서 화면에도 같은 달력을 뒀는데, 목록이 두 군데가 되면
한쪽만 고쳐져 어긋나기 쉽다. 어긋나는 순간 화면과 파이프라인이 서로 다른 날을
휴장일로 믿는다 — 그 상태는 조용해서 아무도 모른다.
"""
import os
import re
import unittest

from krx_calendar import KRX_HOLIDAYS

HERE = os.path.dirname(os.path.abspath(__file__))


class CalendarSync(unittest.TestCase):
    def setUp(self):
        with open(os.path.join(HERE, "app.js"), encoding="utf-8") as fh:
            self.app = fh.read()

    def test_화면_목록이_파이프라인_목록과_정확히_같다(self):
        m = re.search(r"const GAEO_KRX_HOLIDAYS='([^']*)'", self.app)
        self.assertIsNotNone(m, "app.js에 GAEO_KRX_HOLIDAYS 목록이 없다 — 화면이 휴장일을 모른다.")
        screen = m.group(1).split()
        pipeline = [d.isoformat() for d in sorted(KRX_HOLIDAYS)]
        self.assertEqual(screen, pipeline,
                         "화면과 파이프라인의 휴장일 목록이 어긋났다. 한쪽만 고치지 말 것.\n"
                         f"  화면      : {screen}\n  파이프라인: {pipeline}")

    def test_홈_신선도_경고가_휴장일을_본다(self):
        self.assertIn("gaeoIsTradingDay", self.app,
                      "snapshotStaleDays가 거래일 판정을 쓰지 않는다 — 공휴일마다 '며칠 전 갱신' 경고가 뜬다.")
        stale = self.app[self.app.index("function snapshotStaleDays()"):]
        stale = stale[:stale.index("\n}")]
        self.assertIn("gaeoIsTradingDay(exp)", stale,
                      "snapshotStaleDays가 직전 '거래일'까지 거슬러 올라가지 않는다.")
        self.assertIn("steps<14", stale,
                      "달력이 이상할 때 무한 반복하지 않도록 상한이 필요하다.")

    def test_데일리브리프가_휴장일에는_새_시세를_기다리지_않는다(self):
        self.assertIn("const holiday=!weekend&&gaeoIsKrxHoliday(clock.date)", self.app,
                      "DAILY BRIEF가 공휴일을 판정하지 않는다.")
        self.assertIn("const waiting=!closed&&", self.app,
                      "공휴일에 '· 새 시세 확인 중'이 하루 종일 뜬다.")
        self.assertIn("const marketHours=!closed&&", self.app,
                      "공휴일에 장중으로 취급하면 기준 시각 문구가 거짓말을 한다.")

    def test_창_안_휴장일이_화면_목록에도_있다(self):
        """사전등록 창(2026-09-07~10-19) 안의 평일 휴장일."""
        m = re.search(r"const GAEO_KRX_HOLIDAYS='([^']*)'", self.app)
        for day in ("2026-09-24", "2026-09-25", "2026-10-05", "2026-10-09"):
            self.assertIn(day, m.group(1), f"{day}이 화면 목록에 없다.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
