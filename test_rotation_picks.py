# -*- coding: utf-8 -*-
"""compute_rotation_picks.py 계약 테스트.

이 목록은 홈 첫 화면에 뜨고 「매수 추천이 아니다」라고 적어두긴 했지만 사람들이
종목 이름을 보고 실제로 사러 간다. 그래서 산식보다 먼저 지켜야 할 것은
"같은 입력이면 같은 목록", "게이트가 0이면 진짜로 비운다", "숨기지 않는다"다.
그 계약을 여기서 못 박는다. 파일 입출력 없이 순수 함수만 부른다.
"""
import unittest

import compute_rotation_picks as rp


def cand(code, r20, sec="반도체", sec_score=50.0, sec_rank=1,
         gap=10.0, vol=None, call="HOLD", name=None):
    return {
        "code": code, "name": name or ("종목" + code), "sector": sec,
        "r20": r20, "gapPct": gap, "volRatio": vol,
        "secScore": sec_score, "secRank": sec_rank, "call": call,
    }


class MarketGateTest(unittest.TestCase):
    """게이트는 "오늘 목록을 내놓아도 되는 장이냐"를 정한다."""

    def test_both_indices_below_ma20_shows_nothing(self):
        # 백테스트에서 이 구간의 최악이 -23.7%p로 3배 나빴다. 0이어야 한다.
        self.assertEqual(rp.market_gate(0, 0.90), 0)
        self.assertEqual(rp.market_gate(0, 0.00), 0)

    def test_one_index_above_is_capped_at_two(self):
        self.assertEqual(rp.market_gate(1, 0.90), 2)
        self.assertEqual(rp.market_gate(1, 0.10), 2)

    def test_both_above_scales_with_breadth(self):
        self.assertEqual(rp.market_gate(2, 0.55), rp.MAX_PICKS)
        self.assertEqual(rp.market_gate(2, 0.80), rp.MAX_PICKS)
        self.assertEqual(rp.market_gate(2, 0.40), 3)
        self.assertEqual(rp.market_gate(2, 0.54), 3)
        self.assertEqual(rp.market_gate(2, 0.39), 2)

    def test_never_exceeds_screen_cap(self):
        for g in (0, 1, 2):
            for b in (0.0, 0.3, 0.5, 0.7, 1.0):
                self.assertLessEqual(rp.market_gate(g, b), rp.MAX_PICKS)
                self.assertGreaterEqual(rp.market_gate(g, b), 0)


class SelectPicksTest(unittest.TestCase):
    def test_gate_zero_returns_empty_even_with_strong_candidates(self):
        cands = [cand("A", 90.0), cand("B", 80.0, sec="바이오")]
        self.assertEqual(rp.select_picks(cands, 0), [])

    def test_returns_at_most_n(self):
        cands = [cand(f"{i:06d}", 50.0 - i, sec=f"업종{i}") for i in range(10)]
        self.assertEqual(len(rp.select_picks(cands, 3)), 3)

    def test_sector_cap_limits_one_sector(self):
        # 한 업종이 아무리 강해도 SECTOR_CAP를 넘지 못한다.
        cands = [cand(f"{i:06d}", 90.0 - i, sec="반도체") for i in range(5)]
        cands += [cand("999999", 10.0, sec="바이오", sec_score=10.0, sec_rank=9)]
        picks = rp.select_picks(cands, 4)
        semi = [p for p in picks if p["sector"] == "반도체"]
        self.assertEqual(len(semi), rp.SECTOR_CAP)

    def test_saturated_zscores_are_ordered_by_actual_return(self):
        """±3 포화의 실제 증상 재현: 같은 업종의 두 초강세 종목.

        z가 둘 다 3.0으로 잘려 총점이 완전히 같아진다. 그때 +99.2%가
        +79.6%보다 뒤에 오면 화면이 고장난 것처럼 보인다.
        """
        cands = [cand("000010", 79.6), cand("000020", 99.2)]
        cands += [cand(f"{i:06d}", 1.0 + i * 0.1) for i in range(100, 160)]
        picks = rp.select_picks(cands, 2)
        self.assertEqual([p["code"] for p in picks], ["000020", "000010"])

    def test_same_input_always_gives_same_list(self):
        """입력 순서만 바꿔도 결과가 흔들리면 안 된다(결정성)."""
        base = [cand("000010", 88.0), cand("000020", 88.0),
                cand("000030", 88.0, sec="바이오", sec_score=50.0)]
        base += [cand(f"{i:06d}", 2.0, sec="화학", sec_score=50.0) for i in range(100, 130)]
        first = [p["code"] for p in rp.select_picks([dict(c) for c in base], 3)]
        shuffled = list(reversed(base))
        second = [p["code"] for p in rp.select_picks([dict(c) for c in shuffled], 3)]
        self.assertEqual(first, second)

    def test_overheat_is_labelled_not_removed(self):
        """과열은 감추지 않고 라벨로 드러낸다."""
        cands = [cand("000010", 90.0, gap=rp.OVERHEAT_GAP + 0.1)]
        picks = rp.select_picks(cands, 1)
        self.assertEqual(len(picks), 1)
        self.assertTrue(picks[0]["overheat"])

    def test_below_overheat_threshold_is_not_labelled(self):
        picks = rp.select_picks([cand("000010", 90.0, gap=rp.OVERHEAT_GAP - 0.1)], 1)
        self.assertFalse(picks[0]["overheat"])

    def test_gaeo_sell_conflict_is_flagged_not_hidden(self):
        """GAEO가 SELL인 종목이 이 목록에 올라도 빼지 않는다. 대신 표시한다.

        두 산식은 서로 다른 것을 본다(하나는 종목 점수, 하나는 업종 흐름).
        의견이 갈렸다는 사실 자체가 읽는 사람에게 필요한 정보다.
        """
        cands = [cand("000010", 90.0, call="SELL"),
                 cand("000020", 80.0, sec="바이오", call="HOLD")]
        picks = rp.select_picks(cands, 2)
        by = {p["code"]: p for p in picks}
        self.assertIn("000010", by, "SELL이라는 이유로 목록에서 빼면 안 된다")
        self.assertTrue(by["000010"]["callConflict"])
        self.assertFalse(by["000020"]["callConflict"])

    def test_missing_call_is_not_a_conflict(self):
        picks = rp.select_picks([cand("000010", 90.0, call=None)], 1)
        self.assertFalse(picks[0]["callConflict"])

    def test_volume_note_only_when_meaningfully_higher(self):
        quiet = rp.select_picks([cand("000010", 90.0, vol=1.2)], 1)[0]
        loud = rp.select_picks([cand("000010", 90.0, vol=1.8)], 1)[0]
        self.assertNotIn("거래량", quiet["why"])
        self.assertIn("거래량 평소의 1.8배", loud["why"])

    def test_why_never_repeats_sector_rank(self):
        # 업종 순위는 카드 오른쪽 칸에 이미 있다. 근거 문장에서 반복하면 중복이다.
        p = rp.select_picks([cand("000010", 90.0, sec_rank=3)], 1)[0]
        self.assertNotIn("위", p["why"].replace("20일선 위", ""))

    def test_empty_candidates(self):
        self.assertEqual(rp.select_picks([], 4), [])


class ZScoreTest(unittest.TestCase):
    def test_clamped_at_configured_limit(self):
        xs = [0.0] * 50 + [1000.0]
        self.assertAlmostEqual(max(rp.zscores(xs)), rp.Z_CLAMP)
        self.assertGreaterEqual(min(rp.zscores(xs)), -rp.Z_CLAMP)

    def test_zero_variance_is_all_zero(self):
        self.assertEqual(rp.zscores([5.0, 5.0, 5.0]), [0.0, 0.0, 0.0])

    def test_single_value(self):
        self.assertEqual(rp.zscores([7.0]), [0.0])
        self.assertEqual(rp.zscores([]), [])

    def test_weights_sum_to_one(self):
        self.assertAlmostEqual(rp.W_STOCK + rp.W_SECTOR, 1.0)


if __name__ == "__main__":
    unittest.main()
