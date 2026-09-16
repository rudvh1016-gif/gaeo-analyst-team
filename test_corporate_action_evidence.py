#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""증거 수집기 불변식 — 실패가 0건으로 바뀌지 않는지, 대조가 실제로 되는지.

네트워크를 쓰지 않는다. 가짜 응답으로 수집기의 판단만 시험한다.
실제 수집이 됐다는 증거가 아니다 — 그것은 워크플로 실행 기록으로만 말한다.
"""
import unittest

import collect_corporate_action_evidence as collector
import dart_client


class FakeClient:
    def __init__(self, pages):
        self.pages = pages          # [{'status':..,'data':..,'noData':..}, ...]
        self.calls = 0

    def list_issuer_filings(self, corp_code, bgn_de, end_de, page_no=1, **kw):
        self.calls += 1
        return self.pages[min(page_no - 1, len(self.pages) - 1)]


def page(rows, total_page=1, total_count=None, status='000'):
    return {'status': dart_client.OK, 'error': None,
            'data': {'status': status, 'total_page': total_page,
                     'total_count': len(rows) if total_count is None else total_count,
                     'list': rows}}


def filing(rcept, title, stock='005930'):
    return {'rcept_no': rcept, 'report_nm': title, 'stock_code': stock, 'rcept_dt': '20260901'}


def run(client, budget=50):
    return collector.collect_one(client, '005930', '00126380', '20250911', '20260911', {'left': budget})


class CollectorTests(unittest.TestCase):
    def test_price_comparison_scope_is_additive_without_extra_requests(self):
        client = FakeClient([page([filing('20260901000001', '현금·현물배당 결정'),
                                  filing('20260901000002', '주식병합 안내')])])
        out = run(client)
        self.assertEqual(out['comparisonScopeVersion'], 'price-comparison-v1')
        self.assertEqual(len(out['comparisonFindings']), 2)
        self.assertEqual(out['findings'], [])
        self.assertEqual(out['unresolvedHistorical'], 0)
        self.assertEqual(client.calls, 1)

    def test_a_clean_company_reports_zero_with_full_reconciliation(self):
        out = run(FakeClient([page([filing('R1', '현금·현물배당 결정')])]))
        self.assertTrue(out['ok'])
        self.assertEqual((out['pagesExpected'], out['pagesCollected']), (1, 1))
        self.assertEqual((out['totalCount'], out['collectedIds']), (1, ['R1']))
        self.assertEqual(out['findings'], [])            # 현금배당은 주식 수를 바꾸지 않는다
        self.assertEqual(out['unresolvedHistorical'], 0)

    def test_a_relevant_filing_is_reported_and_counted_unresolved(self):
        out = run(FakeClient([page([filing('R2', '주요사항보고서(무상증자결정)')])]))
        self.assertEqual([f['id'] for f in out['findings']], ['R2'])
        self.assertEqual(out['unresolvedHistorical'], 1)
        self.assertEqual(out['eventCounts']['openSelf'], 1)

    def test_documents_are_not_counted_as_events(self):
        # 정정은 같은 사건이다. 공시 3건이 사건 1건으로 세어져야 한다.
        rows = [filing('R1', '주요사항보고서(감자결정)'),
                filing('R2', '[기재정정]주요사항보고서(감자결정)'),
                filing('R3', '[첨부정정]주요사항보고서(감자결정)')]
        out = run(FakeClient([page(rows)]))
        self.assertEqual(out['eventCounts'], {'openSelf': 1, 'subsidiary': 0, 'documents': 3,
                                              'needsDocument': 0, 'companyDoneAwaitingExchange': 0,
                                              'fullyResolved': 0, 'events': 1})
        self.assertEqual(out['unresolvedHistorical'], 1)

    def test_a_subsidiary_filing_does_not_block_this_stock(self):
        out = run(FakeClient([page([filing('R9', '유상증자결정(종속회사의주요경영사항)')])]))
        self.assertEqual(out['unresolvedHistorical'], 0)
        self.assertEqual(out['eventCounts']['subsidiary'], 1)
        self.assertEqual(len(out['findings']), 1)          # 발견은 그대로 보존한다

    def test_a_title_needing_the_document_is_not_counted_as_interpreted(self):
        out = run(FakeClient([page([filing('R8', '매매거래정지및정지해제(중요내용공시)')])]))
        self.assertGreaterEqual(out['uninterpreted'], 1)
        self.assertTrue(out['listClassified'])
        self.assertFalse(out['documentsInterpreted'])

    def test_no_data_is_zero_only_for_that_query(self):
        empty = {'status': dart_client.OK, 'error': None, 'noData': True,
                 'data': {'status': '013'}}
        out = run(FakeClient([empty]))
        self.assertTrue(out['ok'])
        self.assertEqual(out['apiStatus'], '013')
        self.assertEqual((out['totalCount'], out['pagesExpected'], out['pagesCollected']), (0, 1, 1))

    def test_a_transport_failure_is_never_zero(self):
        dead = {'status': dart_client.DART_UNREACHABLE, 'data': None, 'error': 'x'}
        out = run(FakeClient([dead]))
        self.assertFalse(out['ok'])
        self.assertEqual(out['error'], dart_client.DART_UNREACHABLE)
        self.assertIsNone(out['totalCount'])
        self.assertEqual(out['collectedIds'], [])

    def test_an_api_error_is_never_zero(self):
        bad = {'status': dart_client.EVENT_DATA_ERROR, 'data': {'status': '020'}, 'error': 'x'}
        out = run(FakeClient([bad]))
        self.assertFalse(out['ok'])
        self.assertEqual(out['apiStatus'], '020')

    def test_an_unexpected_shape_is_never_zero(self):
        odd = {'status': dart_client.OK, 'error': None, 'data': {'status': '000', 'rows': []}}
        out = run(FakeClient([odd]))
        self.assertFalse(out['ok'])
        self.assertEqual(out['error'], 'RESPONSE_SHAPE_UNEXPECTED')

    def test_every_page_is_collected_before_completion(self):
        client = FakeClient([page([filing('R' + i, '기타 안내')], total_page=3, total_count=3)
                             for i in ('1', '2', '3')])
        out = run(client)
        self.assertEqual((out['pagesExpected'], out['pagesCollected']), (3, 3))
        self.assertEqual(client.calls, 3)

    def test_a_budget_stop_is_reported_not_completed(self):
        client = FakeClient([page([filing('R1', '기타')], total_page=5, total_count=5)])
        out = collector.collect_one(client, '005930', '00126380', '20250911', '20260911', {'left': 2})
        self.assertFalse(out['ok'])
        self.assertEqual(out['error'], 'REQUEST_BUDGET_EXHAUSTED')

    def test_rows_for_another_stock_are_left_uninterpreted(self):
        out = run(FakeClient([page([filing('R1', '합병 결정', stock='000660')])]))
        self.assertEqual(out['uninterpreted'], 1)
        self.assertEqual(out['findings'], [])
        self.assertEqual(out['collectedIds'], [])

    def test_the_evidence_carries_a_way_back_to_the_real_response(self):
        out = run(FakeClient([page([filing('R1', '기타')])]))
        self.assertTrue(out['responseRef'].startswith('sha256:'))
        self.assertEqual(out['identityBasis'], 'corp_code_map')
        self.assertEqual(out['source'], 'OPENDART_API')
        self.assertLess(out['queriedAt'], out['expiresAt'])


if __name__ == '__main__':
    unittest.main()


class DueTargetMode(unittest.TestCase):
    """채점 대상 중심 모드(2026-09-16) — 파일의 종목만 보고, 커서는 건드리지 않고, 빈 파일은 0종목이다."""

    def test_파일은_6자리_코드만_순서대로_중복없이_읽는다(self):
        import os, tempfile
        import due_targets
        path = os.path.join(tempfile.mkdtemp(), 'due.txt')
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write('# 머리말\n005930\n000660 # 주석\n\nabcdef\n005930\n12345\n035720\n')
        self.assertEqual(due_targets.read_tickers_file(path), ['005930', '000660', '035720'])
        self.assertEqual(due_targets.read_tickers_file(path + '.none'), [])

    def test_기본_모드는_예전과_같이_커서부터_순회한다(self):
        import due_targets
        got = due_targets.select_targets(['000010', '000020', '000030'], '000010', 2)
        self.assertEqual(got['todo'], ['000020', '000030'])
        self.assertEqual(got['mode'], due_targets.MODE_ROTATION)
        wrap = due_targets.select_targets(['000010', '000020', '000030'], '000030', 2)
        self.assertEqual(wrap['todo'], ['000010', '000020'])

    def test_파일_모드는_커서를_무시하고_유니버스에_있는_것만_상한까지_본다(self):
        import due_targets
        got = due_targets.select_targets(['000010', '000020', '000030'], '000020', 2,
                                         ['000030', '999999', '000010', '000020'])
        self.assertEqual(got['todo'], ['000030', '000010'])       # 파일 순서 · cap 2
        self.assertEqual(got['mode'], due_targets.MODE_TICKERS_FILE)
        self.assertEqual(got['notInUniverse'], ['999999'])
        self.assertEqual(got['requested'], 4)

    def test_빈_파일은_0종목이고_전체_순회로_되돌아가지_않는다(self):
        import due_targets
        got = due_targets.select_targets(['000010', '000020'], '', 50, [])
        self.assertEqual(got['todo'], [])
        self.assertEqual(got['mode'], due_targets.MODE_TICKERS_FILE)

    def test_수집기_main이_파일_모드에서_커서를_보존하고_대상만_본다(self):
        """실제 main() 을 임시 폴더에서 돈다 — 네트워크 0(클라이언트·수집 함수를 대역으로)."""
        import json, os, tempfile
        from unittest import mock
        tmp = tempfile.mkdtemp()
        with open(os.path.join(tmp, 'krx_list.json'), 'w', encoding='utf-8') as fh:
            json.dump({'items': [{'c': c, 'n': c} for c in ('000010', '000020', '000030', '000040')]}, fh)
        os.makedirs(os.path.join(tmp, collector.OUT_DIR))
        with open(os.path.join(tmp, collector.OUT_FILE), 'w', encoding='utf-8') as fh:
            json.dump({'cursor': '000020', 'evidence': {'000010': {'ok': True, 'findings': [],
                                                                    'unresolvedHistorical': 0}}}, fh)
        due = os.path.join(tmp, 'due.txt')
        with open(due, 'w', encoding='utf-8') as fh:
            fh.write('000040\n000010\n999999\n')

        class Client:
            def corp_code_zip(self): return {'status': dart_client.OK, 'data': b''}
            def efficiency_report(self, extra=None): return {}
        seen = []
        def fake_collect(client, ticker, corp_code, bgn, end, budget):
            seen.append(ticker); budget['left'] -= 1
            return {'ok': True, 'findings': [], 'unresolvedHistorical': 0, 'error': None}
        mapped = {c: {'corp_code': 'X' + c} for c in ('000010', '000020', '000030', '000040')}
        cwd = os.getcwd(); os.chdir(tmp)
        try:
            with mock.patch.object(collector.dart_client, 'DartClient', Client), \
                 mock.patch.object(collector.dart_pipeline, 'parse_corp_code_zip', lambda data: []), \
                 mock.patch.object(collector.dart_pipeline, 'build_corp_map', lambda rows, uni: {'mapped': mapped}), \
                 mock.patch.object(collector, 'collect_one', fake_collect), \
                 mock.patch('sys.stdout', new=__import__('io').StringIO()):
                code = collector.main(['--tickers-file', due, '--tickers', '50', '--requests', '10'])
            self.assertEqual(code, 0)
            saved = json.load(open(collector.OUT_FILE, encoding='utf-8'))
        finally:
            os.chdir(cwd)
        self.assertEqual(seen, ['000040', '000010'])            # 파일 순서 · 유니버스 밖 999999 제외
        self.assertEqual(saved['cursor'], '000020', '파일 모드가 전체 순회의 커서를 옮겼다')
        self.assertEqual(saved['targetMode'], 'tickers_file')
        self.assertEqual(saved['notInUniverse'], 1)
        self.assertEqual(saved['attempted'], 2)
        self.assertEqual(saved['succeeded'], 2)
        self.assertIn('000010', saved['evidence'])               # 이전 회차 증거는 덮어써 갱신
