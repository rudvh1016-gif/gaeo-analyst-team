#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""pipeline_watchdog.decide() 계약 테스트.

핵심은 2026-09-02 사고의 재현이다: "시세는 멀쩡한데 자동분석만 좀비에 막혀 있는" 상태를
이 판정기가 실제로 잡아내는지, 그리고 반대로 **건강한 run을 죽이지는 않는지**를 못 박는다.
"""
import datetime
import unittest

from pipeline_watchdog import KST, PIPELINES, decide, in_window, window_open_at

ANALYSIS = PIPELINES["analysis"]
PRICES = PIPELINES["prices"]


def at(hh, mm, day=2):
    return datetime.datetime(2026, 9, day, hh, mm, tzinfo=KST)


def run(rid, status, started):
    return {"id": rid, "status": status, "started_at": started}


class TestWindow(unittest.TestCase):
    def test_평일_수집창_안이면_감시한다(self):
        self.assertTrue(in_window(at(11, 30)))          # 2026-09-02 = 수요일

    def test_장_시작_전과_마감_후에는_감시하지_않는다(self):
        self.assertFalse(in_window(at(8, 30)))
        self.assertFalse(in_window(at(16, 30)))

    def test_주말에는_감시하지_않는다(self):
        self.assertFalse(in_window(at(11, 30, day=5)))  # 2026-09-05 = 토요일
        self.assertFalse(in_window(at(11, 30, day=6)))

    def test_수집창_열린_시각은_당일_0858이다(self):
        self.assertEqual(window_open_at(at(11, 30)), at(8, 58))


class Test사고재현(unittest.TestCase):
    """2026-09-02 11:30 KST의 실제 상태를 그대로 넣는다."""

    def test_좀비에_막힌_자동분석을_hang으로_판정한다(self):
        # 08:10에 뜬 run 512가 in_progress인 채 아무것도 안 만들고, 09:28에 뜬 run 513이
        # 그 뒤에서 queued로 대기 중. 산출물은 전날 16:08 = 1162분 전.
        d = decide(ANALYSIS, 1162,
                   [run(512, "in_progress", at(8, 10)),
                    run(513, "queued", at(9, 28))],
                   at(11, 30))
        self.assertEqual(d["action"], "revive")
        self.assertEqual(d["cancel"], [512])
        # 뒤에 대기 중인 run이 있으니 dispatch는 불필요하다 — 취소만 하면 자동으로 시작된다.
        self.assertFalse(d["need_dispatch"])

    def test_같은_시각_시세는_정상으로_본다(self):
        # 시세는 11:16에 갱신됐다(14분 전). 자동분석이 죽었어도 시세를 건드리면 안 된다.
        d = decide(PRICES, 14, [run(431, "in_progress", at(9, 28))], at(11, 30))
        self.assertEqual(d["action"], "ok")
        self.assertEqual(d["cancel"], [])

    def test_동시성에_막힌_run은_queued가_아니라_pending으로_뜬다(self):
        # 실제 API가 run 513을 "pending"으로 반환했다. 이걸 대기로 못 세면 좀비를 치운 뒤
        # 필요 없는 dispatch를 한 번 더 쏘게 된다.
        d = decide(ANALYSIS, 1162,
                   [run(512, "in_progress", at(8, 10)),
                    run(513, "pending", at(9, 28))],
                   at(11, 30))
        self.assertEqual(d["action"], "revive")
        self.assertEqual(d["cancel"], [512])
        self.assertFalse(d["need_dispatch"])

    def test_pending만_있으면_아무것도_취소하지_않는다(self):
        d = decide(ANALYSIS, 200, [run(513, "pending", at(11, 0))], at(11, 30))
        self.assertEqual(d["action"], "ok")

    def test_대기중인_run이_없으면_취소하고_재기동한다(self):
        d = decide(ANALYSIS, 1162, [run(512, "in_progress", at(8, 10))], at(11, 30))
        self.assertEqual(d["action"], "revive")
        self.assertEqual(d["cancel"], [512])
        self.assertTrue(d["need_dispatch"])


class Test건강한_run을_죽이지_않는다(unittest.TestCase):
    def test_방금_뜬_run은_산출물이_낡았어도_유예한다(self):
        # 09:20에 재기동된 run. 09:35 시점엔 아직 첫 사이클(12~20분)을 못 끝냈다.
        d = decide(ANALYSIS, 1147, [run(600, "in_progress", at(9, 20))], at(9, 35))
        self.assertEqual(d["action"], "ok")
        self.assertIn("유예", d["reason"])

    def test_개장_전에_떠서_자고_있던_run은_잔_시간을_빼고_센다(self):
        # 08:10에 떠서 08:58까지 자는 게 정상 설계다. 09:30이면 실질 32분밖에 안 됐으니
        # 45분 유예 안이라 살려둔다 — 이 보정이 없으면 매일 아침 멀쩡한 run을 죽인다.
        d = decide(ANALYSIS, 1140, [run(512, "in_progress", at(8, 10))], at(9, 30))
        self.assertEqual(d["action"], "ok")

    def test_유예를_넘기면_그_때_좀비로_본다(self):
        # 같은 run이 10:00까지도(실질 62분) 아무것도 못 만들었으면 그건 hang이다.
        d = decide(ANALYSIS, 1170, [run(512, "in_progress", at(8, 10))], at(10, 0))
        self.assertEqual(d["action"], "revive")

    def test_queued만_있으면_기다린다(self):
        # 아직 시작도 안 한 run을 취소할 이유가 없다.
        d = decide(ANALYSIS, 200, [run(700, "queued", at(11, 0))], at(11, 30))
        self.assertEqual(d["action"], "ok")

    def test_타임스탬프를_못_읽으면_아무것도_죽이지_않는다(self):
        # 라벨 형식이 바뀐 파싱 버그 때문에 멀쩡한 파이프라인을 계속 재기동하면 안 된다.
        d = decide(ANALYSIS, None, [run(512, "in_progress", at(8, 10))], at(11, 30))
        self.assertEqual(d["action"], "ok")
        self.assertEqual(d["cancel"], [])


class Test큐대기_시각_오판(unittest.TestCase):
    """2026-09-02, 이 워치독의 첫 실전 실행에서 건강한 run을 죽인 사고의 재현."""

    def test_큐에서_2시간_기다린_run은_기다린_시간을_빼고_센다(self):
        # run 513: 09:28에 큐 진입 → 좀비 뒤에서 2시간 대기 → 11:28에야 러너를 잡음.
        # started_at에 "러너를 잡은 시각"(11:28)이 들어오면 11:44엔 16분밖에 안 됐으므로
        # 살려둬야 한다. 큐 진입 시각(09:28)을 넣으면 136분으로 보여 죽인다 — 그게 사고였다.
        healthy = decide(ANALYSIS, 1176,
                         [run(513, "in_progress", at(11, 28))], at(11, 44))
        self.assertEqual(healthy["action"], "ok",
                         "러너를 잡은 지 16분밖에 안 된 run을 죽이면 안 된다")

        # 같은 run을 큐 진입 시각으로 재면 좀비로 오판한다 — 이게 왜 job 시각을 써야 하는지다.
        misjudged = decide(ANALYSIS, 1176,
                           [run(513, "in_progress", at(9, 28))], at(11, 44))
        self.assertEqual(misjudged["action"], "revive")

    def test_취소_재큐_반복_루프가_생기지_않는다(self):
        # 취소된 run의 대체분이 큐에서 얼마나 오래 기다렸든, 러너를 잡은 뒤 10분 시점엔
        # 유예 안이라 다시 죽지 않는다. 이 성질이 깨지면 워치독이 취소 → 재큐 → 또 취소를
        # 반복하며 파이프라인을 영원히 못 돌게 만든다.
        for 큐대기 in (5, 60, 120):
            러너확보 = at(11, 28)
            d = decide(ANALYSIS, 1176, [run(999, "in_progress", 러너확보)],
                       러너확보 + datetime.timedelta(minutes=10))
            self.assertEqual(d["action"], "ok",
                             f"러너 확보 10분 뒤인데 죽었다(큐에서 {큐대기}분 기다린 경우)")


class Test완전정지(unittest.TestCase):
    def test_run이_하나도_없으면_재기동한다(self):
        d = decide(ANALYSIS, 200, [], at(11, 30))
        self.assertEqual(d["action"], "kickoff")
        self.assertEqual(d["cancel"], [])

    def test_정상이면_아무것도_하지_않는다(self):
        d = decide(ANALYSIS, 25, [run(512, "in_progress", at(9, 0))], at(11, 30))
        self.assertEqual(d["action"], "ok")


class Test임계값(unittest.TestCase):
    def test_두_파이프라인_임계가_주기에_맞다(self):
        # 시세 10분 주기 · 자동분석 30분 주기 → 각각 두 사이클을 놓쳐야 이상으로 본다.
        self.assertEqual(PRICES["stale_min"], 25)
        self.assertEqual(ANALYSIS["stale_min"], 70)
        # 유예는 실측 최악값보다 넉넉해야 한다. 2026-08-25~09-01 6거래일 실측에서
        # 수집창이 열린 뒤 첫 커밋까지 최악이 29분이었다(14·15·16·17·18·29).
        # 오판 한 번의 대가(취소→재큐→또 취소 루프)가 hang 감지 지연보다 훨씬 크므로
        # 최악값의 2배 이상을 유지한다.
        관측최악 = 29
        self.assertGreaterEqual(ANALYSIS["grace_min"], 관측최악 * 2,
                                "유예가 실측 최악값의 2배 미만이면 건강한 run을 죽일 위험이 크다")

    def test_자동분석_임계는_SessionStart_훅과_같다(self):
        # check_pipeline.py가 쓰는 70분과 달라지면 두 감시가 서로 다른 진단을 낸다.
        import re
        with open("check_pipeline.py", encoding="utf-8") as f:
            src = f.read()
        self.assertIn("aa > 70", re.sub(r"\s+", " ", src))
        self.assertEqual(ANALYSIS["stale_min"], 70)


class Test모른다를_괜찮다로_바꾸지_않는다(unittest.TestCase):
    """조회를 못 했을 때 요약 줄이 "정상"이라고 말하면 안 된다 (2026-09-08 실측).

    ## 무슨 일이 있었나

    PR #518에서 `active_runs`가 조회 실패 시 `None`을 돌려주게 고쳤고, `decide`도
    그것을 판정 보류로 다루게 했다. 종목별 줄은 정직하게 찍혔다.

        [자동분석] auto_analysis.js — 1051분째 갱신 없음 — 그런데 run 목록을
        **조회하지 못했다**. 정상이라는 뜻이 아니다.

    그런데 **바로 다음 줄**이 이렇게 나왔다.

        [파이프라인 감시] 두 파이프라인 모두 정상 — 조치 없음

    `decide`가 판정 보류에도 `action: "ok"`를 돌려주기 때문이다(조치를 안 하는 것은
    맞다). `main`은 그 "ok"를 전부 정상으로 세어 요약을 만들었다.

    **조치를 안 하는 것과 정상이라고 단언하는 것은 다른 일이다.** 요약 줄만 읽는
    사람에게는 정반대의 사실이 전달된다. 이 저장소가 반복해서 배운 교훈이 마지막
    한 줄에서 다시 새어나온 것이다.
    """

    def test_조회_실패는_unknown으로_표시된다(self):
        d = decide(ANALYSIS, 1051, None, at(11, 0))
        self.assertEqual(d["action"], "ok", "조회를 못 했으면 조치하지 않는 것이 맞다")
        self.assertTrue(d.get("unknown"),
                        "조치를 안 한다고 정상인 것은 아니다 — unknown 표시가 있어야 "
                        "요약 줄이 '모두 정상'이라고 말하지 않는다.")

    def test_정상일_때는_unknown이_아니다(self):
        d = decide(ANALYSIS, 5, [], at(11, 0))
        self.assertEqual(d["action"], "ok")
        self.assertFalse(d.get("unknown"), "진짜 정상까지 판정 보류로 흐리면 안 된다")

    def test_요약_줄이_판정_보류를_정상이라고_말하지_않는다(self):
        """main()을 실제로 돌려 출력 문장을 확인한다."""
        import io as _io, contextlib, sys
        import pipeline_watchdog as pw

        orig_stamp, orig_argv = pw.read_stamp, sys.argv
        # 산출물은 낡았고(1051분), 토큰이 없어 run 조회는 불가능한 상태를 만든다.
        pw.read_stamp = lambda *a, **k: datetime.datetime.now(KST) - datetime.timedelta(minutes=1051)
        sys.argv = ['pipeline_watchdog.py', '--force-window']
        try:
            buf = _io.StringIO()
            with contextlib.redirect_stdout(buf):
                pw.main()
            out = buf.getvalue()
        finally:
            pw.read_stamp, sys.argv = orig_stamp, orig_argv

        self.assertIn("판정 보류", out, f"판정 보류를 밝히지 않았다:\n{out}")
        self.assertNotIn("두 파이프라인 모두 정상", out,
                         f"조회를 못 했는데 '모두 정상'이라고 말했다:\n{out}")


if __name__ == "__main__":
    unittest.main()
