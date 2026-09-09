#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""성적표 보고서 동결 스크립트 계약 (2026-09-09 신설, Task #52).

성적표 보고서의 존재 이유는 **발행 시점 숫자를 동결해 인용 가능하게 만드는 것**이다.
그 동결이 손으로 옮겨 적는 것이면 존재 이유가 사라진다 — 오타가 나고, 무엇이 근거였는지
재구성할 수 없고, 유리한 숫자만 고르는 유혹이 생긴다.

그래서 이 테스트가 잠그는 것은 두 가지다.

1. **동결 값은 평가 리포트에서 그대로 옮겨진다.** 여기서 다시 계산하지 않는다.
   두 곳에서 계산하면 언젠가 두 숫자가 갈라지고, 그때 어느 쪽이 맞는지 아무도 모른다.
2. **사전등록 창이 끝나기 전에는 초안이 안 나온다.** 중간 결과를 글로 내보내면
   등록이 소멸한다(docs/PREREGISTRATION_BUY_FILTERS_20260905.md).

⚠️ 표준 라이브러리만 쓴다 — CI 러너에는 cryptography 하나만 깔린다(test_ci_parity.py).
"""

import io
import contextlib
import os
import unittest

import publish_scorecard_report as P


def sample_report(status="EVALUATED", days=24):
    return {
        "asOf": "2026-10-19",
        "status": status,
        "evidenceStatus": "PRE_REGISTERED_PROSPECTIVE",
        "registration": {"windowStart": "2026-09-07", "minDecisionDays": 20},
        "sample": {"decisionDays": days, "rows": 4321, "buy": 512, "excluded": 7,
                   "firstDecisionDate": "2026-09-07", "lastDecisionDate": "2026-10-14"},
        "verdicts": {"H0_crash": "SUPPORTED"},
        "holmP": {"H0_crash": 0.012},
    }


class 동결값은_리포트에서_그대로_옮겨진다(unittest.TestCase):

    def test_표시할_값이_전부_실린다(self):
        frozen = P.build_frozen(sample_report())
        for key in ("asOf", "status", "registration.windowStart",
                    "sample.decisionDays", "sample.rows", "sample.buy"):
            self.assertIn(key, frozen, f"frozen에 {key}가 없다 — 글에 쓸 수 없는 숫자가 된다.")
        self.assertEqual(frozen["sample.decisionDays"], 24)
        self.assertEqual(frozen["registration.windowStart"], "2026-09-07")

    def test_값을_다시_계산하지_않는다(self):
        """리포트 값을 바꾸면 frozen도 그대로 따라와야 한다(자체 계산이 없다는 증거)."""
        r = sample_report()
        r["sample"]["rows"] = 99999
        self.assertEqual(P.build_frozen(r)["sample.rows"], 99999)

    def test_없는_값을_0으로_바꾸지_않는다(self):
        """'모른다'를 '0'으로 바꾸면 이 저장소가 반복해 배운 교훈을 어기는 것이다."""
        r = sample_report()
        del r["sample"]["excluded"]
        self.assertIsNone(P.build_frozen(r)["sample.excluded"],
                          "없는 값이 None이 아니다 — 0으로 채우면 '제외 0건'이라는 "
                          "거짓말이 글에 실린다.")
        self.assertIsNone(P.dig(r, ("sample", "없는키")))

    def test_출처를_밝힌다(self):
        self.assertEqual(P.build_frozen(sample_report())["source"],
                         "evaluate_preregistered_buy_filters.py")


class 창이_끝나기_전에는_초안을_내지_않는다(unittest.TestCase):

    def _run(self, report, argv):
        """평가 스크립트를 이 리포트로 갈아끼우고 main()을 돌린다."""
        import evaluate_preregistered_buy_filters as ev
        original = getattr(ev, "build_report", None)
        ev.build_report = lambda *a, **k: report
        try:
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                code = P.main(argv)
            return code, buf.getvalue()
        finally:
            if original is None:
                del ev.build_report
            else:
                ev.build_report = original

    def test_INSUFFICIENT이면_draft가_거부된다(self):
        code, out = self._run(sample_report(status="INSUFFICIENT", days=3), ["--draft"])
        self.assertEqual(code, 1, "판단일이 모자란데 초안을 내줬다 — 사전등록이 소멸한다.")
        self.assertIn("아직 발행하지 않는다", out)
        self.assertNotIn("SCORECARD_REPORTS 배열에 붙여 넣는다", out,
                         "거부했는데 초안 뼈대가 같이 찍혔다.")

    def test_EVALUATED면_초안이_나온다(self):
        code, out = self._run(sample_report(), ["--draft", "--id", "1"])
        self.assertEqual(code, 0)
        self.assertIn("SCORECARD_REPORTS 배열에 붙여 넣는다", out)
        self.assertIn("id: 1,", out)
        self.assertIn('tag: "성적표 · 검증 기록"', out)
        self.assertIn('"sample.decisionDays": 24', out)
        self.assertIn('body: ""', out,
                      "본문이 비어 있지 않다 — 본문은 사람이 써야 한다.")

    def test_발행_파일을_직접_고치지_않는다(self):
        """되돌리기 어려운 행위라 자동화하지 않는다."""
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            "scorecard_reports.js")
        before = open(path, encoding="utf-8").read()
        self._run(sample_report(), ["--draft", "--id", "1"])
        self.assertEqual(before, open(path, encoding="utf-8").read(),
                         "초안을 찍으면서 scorecard_reports.js를 건드렸다 — "
                         "발행은 사람이 붙여 넣는 단계여야 한다.")


if __name__ == "__main__":
    unittest.main(verbosity=2)
