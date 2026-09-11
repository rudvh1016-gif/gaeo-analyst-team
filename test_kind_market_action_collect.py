#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 수집기 불변식 검사 — 네트워크 없이, **실패가 0건으로 바뀌지 않는지**만 본다.

응답은 2026-09-11 실제 화면 조각으로 흉내 낸다. 실제 전송은 하지 않는다.
"""
import unittest
from unittest import mock

import collect_kind_market_action as collector
import kind_result_reader as reader

PAGE_HEAD = ('<table class="list type-00 tmt10" summary="번호, 회사명, 공시제목, 제출인, 공시일">'
             '<caption>목록</caption><thead><tr class="first" id="title-contents"></tr></thead><tbody>')
PAGE_TAIL = ('</tbody></table><section class="paging-group"><div class="info type-00">'
             ' 전체 <em>%d</em>건 : <strong>%d</strong>/%d&nbsp; </div></section>'
             '<script>$(document).ready(function(){ fn_InitTitle("번호,회사명,공시제목,제출인,공시일",'
             ' "false,false,false,false,false"); });</script>')


def row(seq, company='주성엔지니어링', title='매매거래정지', day='2026-09-11'):
    return ('<tr class=""><td class="first txc" scope="row">%d</td>'
            '<td><font title="%s"><img alt=\'코스닥\'>'
            '<a onclick="companysummary_open(\'03693\'); return false;">%s</a></font></td>'
            '<td><a onclick="openDisclsViewer(\'2026091100%04d\',\'\'); return false;">%s</a></td>'
            '<td><font title="코스닥시장본부">코스닥시장본부</font></td>'
            '<td class="txc">%s</td></tr>' % (seq, company, company, seq, title, day))


def rows_page(count, total, page, pages, **kwargs):
    return PAGE_HEAD + ''.join(row(i + 1, **kwargs) for i in range(count)) + PAGE_TAIL % (total, page, pages)


EMPTY_PAGE = (PAGE_HEAD + '<tr class="first"><td class="first null" colspan="5">조회된 결과값이 없습니다.</td></tr>'
              + PAGE_TAIL % (0, 1, 1))
ERROR_PAGE = '<html><head><title>페이지 오류</title></head><body>서비스 이용에 불편을</body></html>'


def answers(*texts):
    made = [{'httpStatus': 200, 'error': None, 'setCookie': None, 'text': text} for text in texts]
    return mock.Mock(side_effect=made)


class FailureNeverBecomesZeroTests(unittest.TestCase):
    def collect(self, *texts, budget=10):
        with mock.patch.object(collector, 'fetch', answers(*texts)):
            return collector.collect_one('036930', '2025-09-11', '2026-09-11',
                                         {'left': budget}, sleep=lambda _s: None)

    def test_error_page_is_lookup_failed_not_zero(self):
        record = self.collect(ERROR_PAGE)
        self.assertFalse(record['ok'])
        self.assertEqual(record['error'], 'LOOKUP_FAILED')
        self.assertIsNone(record['totalCount'])        # 0 이 아니라 '모름'
        self.assertFalse(record['structureVerified'])

    def test_unknown_screen_is_blocked_with_its_reason(self):
        record = self.collect('<html><body>로그인이 필요합니다</body></html>')
        self.assertFalse(record['ok'])
        self.assertTrue(record['error'].startswith('PAGE_STRUCTURE_UNEXPECTED'))
        self.assertIsNone(record['totalCount'])

    def test_transport_failure_is_not_zero(self):
        with mock.patch.object(collector, 'fetch',
                               mock.Mock(return_value={'httpStatus': None, 'error': 'URLError',
                                                       'setCookie': None, 'text': ''})):
            record = collector.collect_one('036930', '2025-09-11', '2026-09-11', {'left': 5})
        self.assertEqual(record['error'], 'URLError')
        self.assertIsNone(record['totalCount'])
        self.assertFalse(record['ok'])

    def test_short_page_is_count_mismatch(self):
        record = self.collect(rows_page(3, 20, 1, 2))     # 첫 쪽인데 15건이 아니다
        self.assertFalse(record['ok'])
        self.assertEqual(record['error'], 'COUNT_MISMATCH')

    def test_budget_exhausted_is_not_zero(self):
        record = self.collect(rows_page(15, 15, 1, 1), budget=0)
        self.assertEqual(record['error'], 'REQUEST_BUDGET_EXHAUSTED')
        self.assertIsNone(record['totalCount'])

    def test_two_companies_in_rows_is_ticker_mismatch(self):
        page = (PAGE_HEAD + ''.join(row(i + 1, company='주성엔지니어링' if i else '다른회사')
                                    for i in range(15)) + PAGE_TAIL % (15, 1, 1))
        record = self.collect(page)
        self.assertEqual(record['error'], 'TICKER_MISMATCH')
        self.assertFalse(record['ok'])


class SuccessTests(unittest.TestCase):
    def collect(self, *texts):
        with mock.patch.object(collector, 'fetch', answers(*texts)):
            return collector.collect_one('036930', '2025-09-11', '2026-09-11',
                                         {'left': 10}, sleep=lambda _s: None)

    def test_empty_screen_is_the_only_confirmed_zero(self):
        record = self.collect(EMPTY_PAGE)
        self.assertTrue(record['ok'])
        self.assertEqual(record['totalCount'], 0)
        self.assertTrue(record['structureVerified'])
        self.assertTrue(record['tickerMatched'])
        self.assertEqual(record['unresolvedHistorical'], 0)
        self.assertEqual(record['findings'], [])

    def test_rows_are_collected_across_pages(self):
        record = self.collect(rows_page(15, 17, 1, 2), rows_page(2, 17, 2, 2))
        self.assertTrue(record['ok'], record['error'])
        self.assertEqual((record['totalCount'], record['pagesExpected'], record['pagesCollected']), (17, 2, 2))
        self.assertEqual(len(record['findings']), 17)
        self.assertEqual(record['unresolvedHistorical'], 1)        # 매매거래정지 하나가 열려 있다
        self.assertEqual(record['eventCounts']['openEffects'], ['HALT'])
        self.assertTrue(record['responseRef'].startswith('sha256:'))

    def test_caution_rows_do_not_block(self):
        record = self.collect(rows_page(15, 15, 1, 1, title='[투자주의]소수계좌 거래집중 종목'))
        self.assertTrue(record['ok'], record['error'])
        self.assertEqual(record['unresolvedHistorical'], 0)
        self.assertEqual(record['eventCounts']['caution'], 1)

    def test_contract_fields_are_all_present(self):
        record = self.collect(EMPTY_PAGE)
        for field in ('source', 'retrievalPath', 'ticker', 'identityBasis', 'from', 'to', 'queriedAt',
                      'expiresAt', 'ok', 'structureVerified', 'tickerMatched', 'pagesExpected',
                      'pagesCollected', 'totalCount', 'collectedIds', 'uninterpreted',
                      'historicalBackfillComplete', 'unresolvedHistorical', 'responseRef', 'parserVersion'):
            self.assertIsNotNone(record.get(field), field)
        self.assertEqual(record['retrievalPath'], 'KRX_KIND_WEB')
        self.assertEqual(record['identityBasis'], 'repIsuSrtCd')

    def test_request_carries_the_confirmed_identifier(self):
        payload = collector.payload_for('036930', '2025-09-11', '2026-09-11', 1)
        self.assertEqual(payload['repIsuSrtCd'], 'A036930')
        self.assertEqual(payload['method'], 'searchDetailsMktactSubExt')
        self.assertEqual(payload['fromData'], '2025-09-11')
        self.assertEqual(payload['currentPageSize'], str(collector.PAGE_SIZE))


if __name__ == '__main__':
    unittest.main()
