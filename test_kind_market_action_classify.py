#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""시장조치 분류 검사 — 제목은 2026-09-11 실제 결과 화면에서 그대로 옮겼다.

이 검사의 목적은 둘이다.
1. 거래가 계속되는 조치(투자주의·공매도 과열)로 멀쩡한 종목을 막지 않는다
2. 모르는 제목을 '아무 일 없음' 으로 읽지 않는다
"""
import unittest

import kind_market_action_classify as mk

REAL_TITLES = (
    '공매도 과열종목 연장(공매도 거래 금지 연장)',
    '공매도 과열종목 지정(공매도 거래 금지 적용)',
    '단기과열종목(가격괴리율, 3거래일 단일가매매) 지정 연장(대호특수강우)',
    '(예고)단기과열종목 지정예고',
    '[투자주의]투자경고종목 지정해제 및 재지정 예고',
    '[투자주의]소수계좌 거래집중 종목',
)


class TitleTests(unittest.TestCase):
    def test_real_titles_all_classify(self):
        for title in REAL_TITLES:
            self.assertNotEqual(mk.classify(title)['effect'], mk.UNKNOWN, title)

    def test_caution_does_not_block(self):
        for title in ('[투자주의]소수계좌 거래집중 종목', '공매도 과열종목 지정(공매도 거래 금지 적용)'):
            info = mk.classify(title)
            self.assertEqual(info['effect'], mk.CAUTION, title)
            self.assertFalse(info['blocks'], title)

    def test_halt_and_listing_block(self):
        for title, effect in (('매매거래정지(조회공시 답변)', mk.HALT),
                              ('주권 변경상장(액면분할)', mk.LISTING),
                              ('상장폐지(정리매매)', mk.HALT),
                              ('기준가격 조정 안내', mk.PRICE_BASIS)):
            info = mk.classify(title)
            self.assertEqual(info['effect'], effect, title)
            self.assertTrue(info['blocks'], title)

    def test_single_price_trading_blocks(self):
        info = mk.classify('단기과열종목(가격괴리율, 3거래일 단일가매매) 지정 연장')
        self.assertEqual(info['effect'], mk.SINGLE)
        self.assertTrue(info['blocks'])          # 연속매매가 아니므로 막는다

    def test_unknown_title_blocks_and_asks_for_a_person(self):
        info = mk.classify('알 수 없는 새 제목')
        self.assertEqual(info['effect'], mk.UNKNOWN)
        self.assertTrue(info['blocks'])
        self.assertTrue(info['needsDocument'])

    def test_release_words_close_the_measure(self):
        self.assertFalse(mk.classify('매매거래정지 해제')['blocks'])
        self.assertTrue(mk.classify('매매거래정지 해제')['released'])


class SummaryTests(unittest.TestCase):
    def rows(self, *pairs):
        return [{'receivedOn': when, 'title': title} for when, title in pairs]

    def test_latest_release_closes_the_effect(self):
        out = mk.summarize(self.rows(('20260901', '매매거래정지'), ('20260905', '매매거래정지 해제')))
        self.assertEqual(out['openEffects'], [])
        self.assertEqual(out['openCount'], 0)

    def test_release_before_a_new_halt_does_not_close_it(self):
        out = mk.summarize(self.rows(('20260901', '매매거래정지 해제'), ('20260905', '매매거래정지')))
        self.assertEqual(out['openEffects'], [mk.HALT])

    def test_caution_only_leaves_nothing_open(self):
        out = mk.summarize(self.rows(('20260911', '[투자주의]소수계좌 거래집중 종목'),
                                     ('20260911', '공매도 과열종목 지정(공매도 거래 금지 적용)')))
        self.assertEqual(out['openEffects'], [])
        self.assertEqual(out['caution'], 1)
        self.assertEqual(out['uninterpreted'], 0)

    def test_unknown_rows_are_counted_not_swallowed(self):
        out = mk.summarize(self.rows(('20260911', '처음 보는 조치')))
        self.assertEqual(out['uninterpreted'], 1)
        self.assertEqual(out['openEffects'], [])     # 갈래를 모르므로 갈래 목록에는 없다
        self.assertEqual(out['openCount'], 0)        # 대신 uninterpreted 가 사람에게 넘긴다

    def test_no_rows_is_not_an_error(self):
        out = mk.summarize([])
        self.assertEqual((out['openCount'], out['uninterpreted']), (0, 0))


if __name__ == '__main__':
    unittest.main()
