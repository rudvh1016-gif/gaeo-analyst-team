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

    def test_caution_variant_notice_does_not_block(self):
        # 2026-09-11 실제 수집에서 해석 못 한 제목 중 하나. '투자주의' 와 같은 계열의 표현이다.
        info = mk.classify('투자유의안내')
        self.assertEqual(info['effect'], mk.CAUTION)
        self.assertFalse(info['blocks'])

    def test_sector_reclassification_is_purely_administrative(self):
        # 업종변경은 지수 분류용 행정 안내다. 거래·가격·주식수 어느 것도 바꾸지 않는다.
        info = mk.classify('업종변경')
        self.assertEqual(info['effect'], mk.ADMIN)
        self.assertFalse(info['blocks'])

    def test_improvement_period_titles_join_the_listing_review_family(self):
        # '상장적격성' 문구가 본문에 없어도 개선기간 부여/개선계획은 같은 실질심사 절차다.
        for title in ('기타시장안내(개선기간 부여 결정)',
                      '기타시장안내(개선계획 이행 여부 심의 요청)'):
            info = mk.classify(title)
            self.assertEqual(info['effect'], mk.LISTING, title)
            self.assertTrue(info['blocks'], title)

    def test_still_ambiguous_titles_stay_unknown(self):
        # 2026-09-11 실제 수집에서 해석하지 못한 12건 중, 확신 없이 분류표에 넣지 않은 것들.
        # 억지로 갈래를 만들지 않는다 — 사람이 봐야 한다.
        for title in ('관리종목지정', '추가상장(국내CB전환)', '추가상장(유상증자(제3자배정))',
                      '추가상장(무상증자)', '추가상장(주식배당)',
                      '상장안내(유상증자(제3자배정)/감자(주식병합))',
                      # '개선기간 종료' — '종료' 가 RELEASE 문구와 겹쳐 "해제됐다" 로 과도하게
                      # 읽힐 위험이 있다. 실질심사가 실제로 끝났는지 다음 단계로 넘어갔는지는
                      # 이 제목 한 줄만으로 단정할 수 없다.
                      '기타시장안내(개선기간 종료 및 향후 절차 안내)'):
            info = mk.classify(title)
            self.assertEqual(info['effect'], mk.UNKNOWN, title)
            self.assertTrue(info['blocks'], title)


class SummaryTests(unittest.TestCase):
    def rows(self, *pairs):
        return [{'receivedOn': when, 'title': title} for when, title in pairs]

    def test_latest_release_closes_the_effect(self):
        out = mk.summarize(self.rows(('20260901', '매매거래정지'), ('20260905', '매매거래정지 해제')),
                           as_of='20260906')
        self.assertEqual(out['openEffects'], [])
        self.assertEqual(out['openCount'], 0)

    def test_release_before_a_new_halt_does_not_close_it(self):
        out = mk.summarize(self.rows(('20260901', '매매거래정지 해제'), ('20260905', '매매거래정지')),
                           as_of='20260906')
        self.assertEqual(out['openEffects'], [mk.HALT])

    def test_caution_only_leaves_nothing_open(self):
        out = mk.summarize(self.rows(('20260911', '[투자주의]소수계좌 거래집중 종목'),
                                     ('20260911', '공매도 과열종목 지정(공매도 거래 금지 적용)')),
                           as_of='20260911')
        self.assertEqual(out['openEffects'], [])
        self.assertEqual(out['caution'], 1)
        self.assertEqual(out['uninterpreted'], 0)

    def test_unknown_rows_are_counted_not_swallowed(self):
        out = mk.summarize(self.rows(('20260911', '처음 보는 조치')), as_of='20260911')
        self.assertEqual(out['uninterpreted'], 1)
        self.assertEqual(out['openEffects'], [])     # 갈래를 모르므로 갈래 목록에는 없다
        self.assertEqual(out['openCount'], 0)        # 대신 uninterpreted 가 사람에게 넘긴다

    def test_no_rows_is_not_an_error(self):
        out = mk.summarize([], as_of='20260911')
        self.assertEqual((out['openCount'], out['uninterpreted']), (0, 0))

    # --- 2026-09-11 수명 방식 결함 회귀 검사: 배당락 기준가격이 1년 내내 '열린 조치'가 되면 안 된다 ---

    def test_price_basis_blocks_only_on_the_filing_day(self):
        out = mk.summarize(self.rows(('20260910', '배당락 기준가격 안내')), as_of='20260910')
        self.assertEqual(out['openEffects'], [mk.PRICE_BASIS])

    def test_price_basis_closes_the_next_day_with_no_release_word(self):
        # 이 결함(배당락 안내가 영구히 열린 조치로 남는 것)이 실제로 2026-09-11에 발견됐다.
        # 기준가격 안내는 '해제' 문구가 원래 나오지 않으므로, 해제 없이도 다음날 닫혀야 한다.
        out = mk.summarize(self.rows(('20260910', '배당락 기준가격 안내')), as_of='20260911')
        self.assertEqual(out['openEffects'], [])

    def test_price_basis_old_filing_from_a_year_ago_is_closed(self):
        out = mk.summarize(self.rows(('20250101', '배당락 기준가격 안내')), as_of='20260911')
        self.assertEqual(out['openEffects'], [])

    def test_single_price_period_closes_after_its_official_trading_days(self):
        # '3거래일' 이 제목에 실제로 적혀 있다 — krx_calendar 로 그 거래일을 센다.
        title = '단기과열종목(가격괴리율, 3거래일 단일가매매) 지정(테스트종목)'
        start = self.rows(('20260901', title))  # 2026-09-01 화요일
        still_within = mk.summarize(start, as_of='20260903')
        self.assertEqual(still_within['openEffects'], [mk.SINGLE])
        after_period = mk.summarize(start, as_of='20260908')
        self.assertEqual(after_period['openEffects'], [])

    def test_single_without_a_readable_period_stays_open_rather_than_guessing(self):
        # 제목에 거래일수가 없으면 임의로 지어내지 않고 지속형처럼 계속 막는다.
        out = mk.summarize(self.rows(('20250101', '단일가매매 지정(테스트종목)')), as_of='20260911')
        self.assertEqual(out['openEffects'], [mk.SINGLE])

    def test_explicit_release_still_wins_for_single(self):
        out = mk.summarize(self.rows(('20260901', '저유동성종목 단일가매매(30분단위) 적용'),
                                     ('20260905', '저유동성종목 단일가매매(30분단위) 해제')),
                           as_of='20260906')
        self.assertEqual(out['openEffects'], [])

    def test_admin_notice_never_opens_anything(self):
        out = mk.summarize(self.rows(('20260911', '업종변경')), as_of='20260911')
        self.assertEqual(out['openEffects'], [])
        self.assertEqual(out['caution'], 0)


if __name__ == '__main__':
    unittest.main()
