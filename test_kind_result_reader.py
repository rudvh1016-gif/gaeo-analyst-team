#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 결과 화면 읽기 검사 — **실패를 0건으로 읽지 않는지**가 전부다.

아래 조각은 2026-09-11 실제 응답에서 그대로 옮겼다(run 34592992622 · 34593294338 · 34603033862).
예시를 지어내 실제 응답이라고 적지 않는다.
"""
import unittest

import kind_result_reader as reader

ROW_HTML = '''
<table class="list type-00 tmt10" summary="번호, 회사명, 공시제목, 제출인, 공시일">
<caption>목록</caption><thead><tr class="first" id="title-contents"></tr></thead><tbody>
<tr class=""><td class="first txc" scope="row">20574</td>
<td style="width:118px"><font title="티에스이"><img src='/images/common/icn_t_ko.gif' class='vmiddle legend' alt='코스닥'>
<a id="companysum" href="#companysum" onclick="companysummary_open('13129'); return false;" title='티에스이'> 티에스이</a> </font></td>
<td style="width:418px"><a id="disc" href="#disc" onclick="openDisclsViewer('20260911000822',''); return false;"
title='공매도 과열종목 연장'>공매도 과열종목 연장(공매도 거래 금지 연장)</a></td>
<td style="width:118px"><font title="코스닥시장본부">코스닥시장본부</font></td>
<td class="txc">2026-09-11</td></tr>
</tbody></table>
<section class="paging-group"><div class="info type-00"> 전체 <em>20,574</em>건 : <strong>1</strong>/1,372&nbsp; </div></section>
<script type="text/JavaScript">$(document).ready(function(){ fn_InitTitle("번호,회사명,공시제목,제출인,공시일", "false,false,false,false,false"); });</script>
'''

EMPTY_HTML = '''
<table class="list type-00 tmt10" summary="번호, 회사명, 공시제목, 제출인, 공시일">
<caption>목록</caption><thead><tr class="first" id="title-contents"></tr></thead><tbody>
<tr class="first"><td class="first null" colspan="5">조회된 결과값이 없습니다.</td></tr>
</tbody></table>
<section class="paging-group"><div class="info type-00"> 전체 <em>0</em>건 : <strong>1</strong>/1&nbsp; </div></section>
<script type="text/JavaScript">$(document).ready(function(){ fn_InitTitle("번호,회사명,공시제목,제출인,공시일", "false,false,false,false,false"); });</script>
'''

ERROR_HTML = '''<!DOCTYPE html><html><head><title>페이지 오류</title></head><body>
<section class="errorpage"><header><hgroup><h1>서비스 이용에 불편을 드려 죄송합니다.</h1>
<table class="pcontents" summary=""><caption>주의사항</caption><tbody><tr><td>
잠시 후 다시 이용해 주세요.</td></tr></tbody></table></hgroup></header></section></body></html>'''


class ScreenKindTests(unittest.TestCase):
    def test_rows_screen_is_read_as_rows(self):
        out = reader.read(ROW_HTML)
        self.assertEqual(out['kind'], reader.ROWS)
        self.assertTrue(out['columnsVerified'])
        self.assertEqual((out['total'], out['page'], out['pages']), (20574, 1, 1372))
        row = out['rows'][0]
        self.assertEqual(row['company'], '티에스이')
        self.assertEqual(row['market'], '코스닥')
        self.assertEqual(row['filer'], '코스닥시장본부')
        self.assertEqual(row['filedOn'], '2026-09-11')
        self.assertEqual(row['documentId'], '20260911000822')
        self.assertEqual(row['corpKey'], '13129')
        self.assertIn('공매도 과열종목 연장', row['title'])

    def test_empty_screen_is_the_only_zero(self):
        out = reader.read(EMPTY_HTML)
        self.assertEqual(out['kind'], reader.EMPTY)
        self.assertEqual(out['total'], 0)
        self.assertEqual(out['rows'], [])

    def test_error_screen_is_never_zero(self):
        out = reader.read(ERROR_HTML)
        self.assertEqual(out['kind'], reader.ERROR)
        self.assertIsNone(out['total'])          # 0 이 아니라 '모른다' 다
        self.assertEqual(out['reason'], 'ERROR_PAGE')

    def test_nothing_else_becomes_zero(self):
        for html in ('', None, '<html><body>로그인이 필요합니다</body></html>',
                     '<table class="list"><tbody><tr><td>?</td></tr></tbody></table>'):
            out = reader.read(html)
            self.assertEqual(out['kind'], reader.UNKNOWN, html)
            self.assertIsNone(out['total'])

    def test_changed_column_names_block_reading(self):
        broken = ROW_HTML.replace('summary="번호, 회사명, 공시제목, 제출인, 공시일"', 'summary="번호, 회사명, 공시제목"')
        out = reader.read(broken)
        self.assertEqual(out['kind'], reader.UNKNOWN)
        self.assertEqual(out['reason'], 'COLUMN_NAMES_UNEXPECTED')

    def test_empty_marker_with_nonzero_total_is_not_zero(self):
        contradictory = EMPTY_HTML.replace('<em>0</em>', '<em>7</em>')
        out = reader.read(contradictory)
        self.assertEqual(out['kind'], reader.UNKNOWN)
        self.assertEqual(out['reason'], 'EMPTY_BUT_TOTAL_NOT_ZERO')


class PageCompletenessTests(unittest.TestCase):
    """모자란 쪽을 온전하다고 하지 않는다. 한 쪽은 15건 고정이다(실측)."""

    def test_first_page_needs_full_page_size(self):
        out = reader.read(ROW_HTML)
        self.assertFalse(reader.page_complete(out))      # 위 조각은 행이 하나뿐이다
        out['rows'] = out['rows'] * 15
        self.assertTrue(reader.page_complete(out))

    def test_last_page_needs_the_remainder(self):
        out = {'kind': reader.ROWS, 'total': 32, 'page': 3, 'pages': 3, 'rows': [{}, {}]}
        self.assertTrue(reader.page_complete(out))
        out['rows'] = [{}]
        self.assertFalse(reader.page_complete(out))

    def test_zero_screen_is_complete_and_others_are_not(self):
        self.assertTrue(reader.page_complete(reader.read(EMPTY_HTML)))
        self.assertFalse(reader.page_complete(reader.read(ERROR_HTML)))
        self.assertFalse(reader.page_complete({'kind': reader.ROWS, 'rows': [{}]}))


if __name__ == '__main__':
    unittest.main()
