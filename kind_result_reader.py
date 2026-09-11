#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 시장조치 결과 화면 읽기 — 세 가지 화면을 **다르게** 읽는다.

이 파일이 존재하는 이유는 하나다. 실패 화면을 0건으로 읽는 순간 "확인했더니 아무 일도 없었다"
라는 거짓말이 만들어지고, 그 거짓말이 곧 체결 허용으로 이어지기 때문이다.

실제로 받아 본 화면은 세 가지다(2026-09-11, run 34592992622 · 34593294338 · 34603033862).

    ROWS   결과 행이 있다.  table.list 안 tbody 의 tr 들, '전체 n건 : p/q'
    EMPTY  진짜 0건이다.    td.null '조회된 결과값이 없습니다' + '전체 0건 : 1/1'
    ERROR  실패다.          '페이지 오류' 안내. **0건이 아니다**

그 밖의 것은 UNKNOWN 이다. 모르는 화면을 셋 중 하나로 욱여넣지 않는다.

열 이름의 근거는 화면 안에 두 곳이 있고 서로 같다.
    <table summary="번호, 회사명, 공시제목, 제출인, 공시일">
    fn_InitTitle("번호,회사명,공시제목,제출인,공시일", ...)
둘이 어긋나면 구조가 바뀐 것이므로 UNKNOWN 으로 막는다.

모델 호출 없음. 네트워크 없음. 이 파일은 해석만 하고 아무것도 가져오지 않는다.
"""
import re

ROWS = 'ROWS'
EMPTY = 'EMPTY'
ERROR = 'ERROR'
UNKNOWN = 'UNKNOWN'

PARSER_VERSION = 'kind-mktact-list-v1'
#: 화면이 스스로 적어 둔 열 이름. 이 순서가 아니면 읽지 않는다.
EXPECTED_COLUMNS = ('번호', '회사명', '공시제목', '제출인', '공시일')

_TABLE = re.compile(r'<table[^>]*class="[^"]*\blist\b[^"]*"[^>]*>(.*?)</table>', re.S | re.I)
_SUMMARY = re.compile(r'<table[^>]*class="[^"]*\blist\b[^"]*"[^>]*summary="([^"]*)"', re.I)
_INIT_TITLE = re.compile(r'fn_InitTitle\(\s*"([^"]*)"')
_ROW = re.compile(r'<tr[^>]*>(.*?)</tr>', re.S | re.I)
_CELL = re.compile(r'<td[^>]*>(.*?)</td>', re.S | re.I)
_NULL_CELL = re.compile(r'<td[^>]*class="[^"]*\bnull\b[^"]*"', re.I)
_PAGE_INFO = re.compile(r'전체\s*<em>([\d,]+)</em>건\s*:\s*<strong>(\d+)</strong>\s*/\s*([\d,]+)')
_COMPANY = re.compile(r'<font title="([^"]*)"')
_MARKET = re.compile(r"<img[^>]*alt='([^']*)'")
_DOC_ID = re.compile(r"openDisclsViewer\('(\d+)'")
_CORP_KEY = re.compile(r"companysummary_open\('([^']+)'\)")


def _text(html):
    plain = re.sub(r'<[^>]+>', ' ', html or '')
    for entity, ch in (('&nbsp;', ' '), ('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>'), ('&quot;', '"')):
        plain = plain.replace(entity, ch)
    return ' '.join(plain.split())


def _columns_agree(html):
    """두 곳에 적힌 열 이름이 서로 같고 기대한 것과도 같은가."""
    summary = _SUMMARY.search(html)
    init = _INIT_TITLE.search(html)
    if not summary or not init:
        return False
    normalize = lambda raw: tuple(part.strip() for part in raw.split(',') if part.strip())
    return normalize(summary.group(1)) == normalize(init.group(1)) == EXPECTED_COLUMNS


def read(html):
    """화면 한 장을 읽는다. 판정은 kind 로만 하고, 숫자는 화면에 적힌 것만 옮긴다."""
    out = {'kind': UNKNOWN, 'parserVersion': PARSER_VERSION, 'rows': [],
           'total': None, 'page': None, 'pages': None, 'columnsVerified': False, 'reason': None}
    if not html:
        out['reason'] = 'EMPTY_RESPONSE'
        return out
    if '페이지 오류' in html:
        out['kind'] = ERROR
        out['reason'] = 'ERROR_PAGE'
        return out

    table = _TABLE.search(html)
    if not table:
        out['reason'] = 'RESULT_TABLE_NOT_FOUND'
        return out
    out['columnsVerified'] = _columns_agree(html)
    if not out['columnsVerified']:
        out['reason'] = 'COLUMN_NAMES_UNEXPECTED'
        return out

    info = _PAGE_INFO.search(html)
    if info:
        out['total'] = int(info.group(1).replace(',', ''))
        out['page'] = int(info.group(2))
        out['pages'] = int(info.group(3).replace(',', ''))

    body = table.group(1)
    if _NULL_CELL.search(body) and '조회된 결과값이 없습니다' in body:
        if out['total'] not in (0, None):
            out['reason'] = 'EMPTY_BUT_TOTAL_NOT_ZERO'
            return out
        out['kind'] = EMPTY
        out['total'] = 0
        return out

    for raw in _ROW.findall(body):
        cells = _CELL.findall(raw)
        if len(cells) != len(EXPECTED_COLUMNS):
            continue
        company = _COMPANY.search(cells[1])
        market = _MARKET.search(cells[1])
        document = _DOC_ID.search(cells[2])
        corp = _CORP_KEY.search(cells[1])
        out['rows'].append({
            'seq': _text(cells[0]),
            'company': company.group(1) if company else _text(cells[1]),
            'market': market.group(1) if market else None,
            'title': _text(cells[2]),
            'documentId': document.group(1) if document else None,
            'corpKey': corp.group(1) if corp else None,
            'filer': _text(cells[3]),
            'filedOn': _text(cells[4]),
        })
    if not out['rows']:
        out['reason'] = 'ROWS_NOT_PARSED'
        return out
    out['kind'] = ROWS
    return out


def page_complete(result, page_size=15):
    """한 쪽이 온전한가. **건수가 맞지 않으면 참이 아니다** — 모자란 쪽을 0건으로 읽지 않기 위해서다.

    서버가 한 쪽 15건으로 고정한다(실측: 20,574 ÷ 1,372 = 15). 인자로 100을 넣어도 무시된다.
    """
    if result.get('kind') == EMPTY:
        return result.get('total') == 0
    if result.get('kind') != ROWS:
        return False
    total, page, pages = result.get('total'), result.get('page'), result.get('pages')
    if None in (total, page, pages) or page < 1 or pages < 1:
        return False
    expected = page_size if page < pages else total - page_size * (pages - 1)
    return len(result['rows']) == expected
