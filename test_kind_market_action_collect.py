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


class BudgetExhaustionAccounting(unittest.TestCase):
    """예산이 떨어져 **손도 못 댄** 대상을 실패로 세거나 KeyError 로 죽지 않는다.

    2026-09-15 실측 결함 둘:
      1. failures 루프가 todo 전체를 돌며 evidence[ticker] 를 읽어, 예산 소진 뒤
         항목이 없는 종목에서 KeyError 로 죽었다(첫 회차) 또는 지난 회차 기록이
         남아 있으면 남의 회차 실패를 이번 회차 실패로 셌다.
      2. failed = len(todo) - len(done) 이라 시도도 못 한 종목이 실패가 됐다.
    """

    def test_손도_못_댄_종목에서_KeyError로_죽지_않는다(self):
        todo = ['000010', '000020', '000030']
        attempted = ['000010']                       # 첫 종목에서 예산 소진
        evidence = {'000010': {'ok': True}}          # 나머지는 항목 자체가 없다
        got = collector.round_summary(todo, attempted, ['000010'], evidence)
        self.assertEqual(got['processed'], 1)
        self.assertEqual(got['notProcessed'], 2)

    def test_시도도_못_한_종목을_실패로_세지_않는다(self):
        todo = ['000010', '000020', '000030', '000040', '000050']
        attempted = ['000010', '000020']
        evidence = {'000010': {'ok': True}, '000020': {'ok': False, 'error': 'LOOKUP_FAILED'}}
        got = collector.round_summary(todo, attempted, ['000010'], evidence)
        self.assertEqual(got['failed'], 1, '미처리 3건까지 실패로 셌다')
        self.assertEqual(got['notProcessed'], 3)
        self.assertEqual(got['notProcessedReason'], 'budget_exhausted_before_attempt')

    def test_지난_회차_실패를_이번_회차_실패로_세지_않는다(self):
        todo = ['000010', '000020', '000030']
        attempted = ['000010']
        evidence = {'000010': {'ok': True},
                    '000030': {'ok': False, 'error': '지난_회차_실패'}}   # 이월된 기록
        got = collector.round_summary(todo, attempted, ['000010'], evidence)
        self.assertEqual(got['failureReasons'], {},
                         '이번 회차에 손대지 않은 종목의 옛 실패를 셌다')

    def test_전부_처리했으면_미처리는_0이고_사유도_없다(self):
        todo = ['000010', '000020']
        got = collector.round_summary(todo, todo, ['000010', '000020'], 
                                      {'000010': {'ok': True}, '000020': {'ok': True}})
        self.assertEqual(got['notProcessed'], 0)
        self.assertIsNone(got['notProcessedReason'])
        self.assertEqual(got['failed'], 0)

    def test_실패_사유는_실제로_시도한_것만_센다(self):
        todo = ['000010', '000020', '000030']
        attempted = ['000010', '000020']
        evidence = {'000010': {'ok': False, 'error': 'LOOKUP_FAILED'},
                    '000020': {'ok': False, 'error': 'COUNT_MISMATCH'},
                    '000030': {'ok': False, 'error': 'LOOKUP_FAILED'}}
        got = collector.round_summary(todo, attempted, [], evidence)
        self.assertEqual(got['failureReasons'], {'LOOKUP_FAILED': 1, 'COUNT_MISMATCH': 1})
        self.assertEqual(got['failed'], 2)


class DueTargetMode(unittest.TestCase):
    """채점 대상 중심 모드(2026-09-16) — 파일의 종목만 보고, 커서는 건드리지 않는다. 네트워크 0."""

    def _run(self, due_lines, previous_cursor='000020', cap='50'):
        import json, os, io, tempfile
        tmp = tempfile.mkdtemp()
        with open(os.path.join(tmp, 'krx_list.json'), 'w', encoding='utf-8') as fh:
            json.dump({'items': [{'c': c, 'n': c} for c in ('000010', '000020', '000030', '000040')]}, fh)
        os.makedirs(os.path.join(tmp, collector.OUT_DIR))
        with open(os.path.join(tmp, collector.OUT_FILE), 'w', encoding='utf-8') as fh:
            json.dump({'cursor': previous_cursor, 'evidence': {}}, fh)
        due = os.path.join(tmp, 'due.txt')
        with open(due, 'w', encoding='utf-8') as fh:
            fh.write(''.join(line + '\n' for line in due_lines))
        seen = []
        def fake_collect(ticker, bgn, end, budget, cookie=None, sleep=None):
            seen.append(ticker); budget['left'] -= 1
            return {'ok': True, 'findings': [], 'totalCount': 0, 'unresolvedHistorical': 0, 'error': None}
        cwd = os.getcwd(); os.chdir(tmp)
        try:
            with mock.patch.object(collector, 'fetch', lambda *a, **k: {'setCookie': None, 'httpStatus': 200,
                                                                         'error': None, 'text': ''}), \
                 mock.patch.object(collector, 'collect_one', fake_collect), \
                 mock.patch.object(collector.time, 'sleep', lambda s: None), \
                 mock.patch('sys.stdout', new=io.StringIO()):
                code = collector.main(['--tickers-file', due, '--tickers', cap, '--requests', '10'])
            saved = json.load(open(collector.OUT_FILE, encoding='utf-8'))
        finally:
            os.chdir(cwd)
        return code, seen, saved

    def test_파일의_종목만_보고_커서는_그대로다(self):
        code, seen, saved = self._run(['000040', '000010', '999999'])
        self.assertEqual(code, 0)
        self.assertEqual(seen, ['000040', '000010'])
        self.assertEqual(saved['cursor'], '000020', '파일 모드가 전체 순회의 커서를 옮겼다')
        self.assertEqual(saved['targetMode'], 'tickers_file')
        self.assertEqual(saved['notInUniverse'], 1)
        self.assertEqual(saved['processed'], 2)

    def test_빈_파일이면_0종목을_처리한_것으로_적고_전체를_긁지_않는다(self):
        code, seen, saved = self._run([])
        self.assertEqual(code, 0)
        self.assertEqual(seen, [])
        self.assertEqual(saved['attempted'], 0)
        self.assertEqual(saved['targetRequested'], 0)
        self.assertEqual(saved['cursor'], '000020')


if __name__ == "__main__":
    unittest.main(verbosity=2)
