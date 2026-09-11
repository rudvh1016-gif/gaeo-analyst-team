#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 검색 요청을 실제로 보내고 **응답의 겉모양만** 기록한다.

kind_probe.py 는 '화면이 열리는가' 만 봤다. 이 파일은 그 다음 한 걸음 —
**실제 검색 요청을 보내고 결과 화면을 받아 온다.** 그리고 거기서 본 것만 적는다.

여기서도 판정은 하지 않는다:
- 행이 0개로 보여도 '기업행사 0건' 이라고 적지 않는다. '표 행을 찾지 못했다' 라고만 적는다.
- 초기 화면·오류 안내문·로그인 유도 화면을 결과 화면으로 읽지 않는다.
- 열 이름을 짐작해 채우지 않는다. 화면에 있는 글자를 그대로 옮긴다.

이 기록을 사람이 읽은 뒤에야 KRX_KIND_WEB 파서를 쓴다. 순서를 바꾸지 않는다.
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = 'https://kind.krx.co.kr'
MKTACT = BASE + '/disclosure/detailsExt.do?ext=y&method=searchDetailsMktactMainExt'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
MAX_POSTS = 8
DUMP_ROWS = 3
SNIPPET = 600


def http(url, data=None, cookie=None, referer=None, timeout=30):
    """한 번의 요청. 실패도 사실로 남긴다 — 전송 실패와 '응답이 왔는데 비었다' 는 다른 사실이다."""
    out = {'url': url, 'method': 'POST' if data is not None else 'GET', 'httpStatus': None,
           'bytes': None, 'contentType': None, 'error': None}
    headers = {'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9'}
    if cookie:
        headers['Cookie'] = cookie
    if referer:
        headers['Referer'] = referer
    body = b''
    encoded = None
    if data is not None:
        encoded = urllib.parse.urlencode(data, encoding='utf-8').encode('utf-8')
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        headers['X-Requested-With'] = 'XMLHttpRequest'
    try:
        request = urllib.request.Request(url, data=encoded, headers=headers)
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read(4_000_001)
            out['httpStatus'] = response.status
            out['contentType'] = response.headers.get('Content-Type')
            out['setCookie'] = response.headers.get('Set-Cookie')
    except urllib.error.HTTPError as error:
        out['httpStatus'] = error.code
        out['error'] = 'HTTPError'
        try:
            body = error.read(200_000)
        except Exception:
            body = b''
    except Exception as error:
        out['error'] = type(error).__name__
    out['bytes'] = len(body)
    return out, body.decode('utf-8', 'replace')


def strip_tags(html):
    text = re.sub(r'<[^>]+>', ' ', html)
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    return ' '.join(text.split())


def hidden_defaults(text):
    """숨은 입력칸의 이름과 값. 요청을 만들려면 화면이 들고 있는 기본값을 알아야 한다.

    이것은 '화면에 무엇이 들어 있었나' 의 기록이지 '이 값이 옳다' 는 주장이 아니다.
    """
    pairs = {}
    for tag in re.findall(r'<input[^>]*>', text, re.I):
        if not re.search(r'type\s*=\s*["\']?hidden', tag, re.I):
            continue
        name = re.search(r'\bname\s*=\s*["\']([^"\']+)', tag, re.I)
        value = re.search(r'\bvalue\s*=\s*["\']([^"\']*)', tag, re.I)
        if name:
            pairs[name.group(1)] = value.group(1) if value else ''
    return pairs


def method_values(text):
    return sorted(set(re.findall(r'\bmethod\s*[=:]\s*["\']?(search[A-Za-z]+)', text)))


def form_actions(text):
    return sorted(set(re.findall(r'<form[^>]*\baction\s*=\s*["\']([^"\']+)', text, re.I)))


def look(text):
    """결과 화면의 겉모양. 해석하지 않고 **보이는 것**만 옮긴다."""
    tables = re.findall(r'<table[^>]*>.*?</table>', text, re.S | re.I)
    best, headers = None, []
    for table in tables:
        cells = [strip_tags(c) for c in re.findall(r'<th[^>]*>(.*?)</th>', table, re.S | re.I)]
        if len(cells) > len(headers):
            headers, best = cells, table
    rows = []
    if best:
        for row in re.findall(r'<tr[^>]*>(.*?)</tr>', best, re.S | re.I)[:DUMP_ROWS + 1]:
            cells = [strip_tags(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S | re.I)]
            if cells:
                rows.append(cells)
    paging = re.findall(r'<a[^>]*(?:href|onclick)\s*=\s*["\']([^"\']*(?:[Pp]age|go\()[^"\']*)', text)
    counts = re.findall(r'(?:총|전체)\s*[^<>]{0,20}?([0-9,]+)\s*건', strip_tags(text))
    return {
        'tableCount': len(tables),
        'headerTexts': headers[:30],
        'firstRows': rows[:DUMP_ROWS],
        'rowsSeenInBestTable': len(re.findall(r'<tr[^>]*>', best, re.I)) if best else 0,
        'pagingHrefSamples': sorted(set(paging))[:8],
        'countPhrases': counts[:5],
        'hasNoDataWord': any(w in text for w in ('조회된 결과', '조회된 자료', '검색된 결과', 'no_data', '없습니다')),
        'looksLikeLoginOrError': any(w in text for w in ('로그인', '오류가 발생', 'Error', '서비스 점검')),
        'textSnippet': strip_tags(text)[:SNIPPET],
    }


def search(case, url, payload, cookie, posts):
    if posts['n'] >= MAX_POSTS:
        return {'case': case, 'skipped': 'MAX_POSTS'}
    posts['n'] += 1
    meta, text = http(url, data=payload, cookie=cookie, referer=MKTACT)
    record = {'case': case, 'requestUrl': url, 'requestKeys': sorted(payload), 'http': meta}
    record['observed'] = look(text) if text else None
    return record


def main():
    report = {'note': '여기 적힌 것은 관찰 기록이다. 건수 판정이 아니다.', 'steps': []}

    meta, text = http(MKTACT)
    cookie = None
    if meta.get('setCookie'):
        cookie = '; '.join(part.split(';')[0] for part in meta['setCookie'].split(', ') if '=' in part)
    page = {'step': 'GET 시장조치 초기화면', 'http': meta,
            'formActions': form_actions(text), 'methodValues': method_values(text),
            'hiddenDefaults': hidden_defaults(text)}
    report['steps'].append(page)
    if not text:
        print(json.dumps(report, ensure_ascii=False, indent=1))
        return 0

    action = page['formActions'][0] if page['formActions'] else '/disclosure/detailsExt.do'
    post_url = urllib.parse.urljoin(BASE, action.split('?')[0])
    base_payload = dict(page['hiddenDefaults'])
    base_payload.setdefault('method', 'searchDetailsMktactSub')
    base_payload.setdefault('currentPageSize', '15')
    base_payload.setdefault('pageIndex', '1')
    base_payload.setdefault('forward', 'detailsExt_sub')

    posts = {'n': 0}
    cases = [
        ('A_최근한달_시장전체', {'fromDate': '2026-08-11', 'toDate': '2026-09-11'}),
        ('B_하루_공휴일추정', {'fromDate': '2026-01-01', 'toDate': '2026-01-01'}),
        ('C_긴기간_여러페이지기대', {'fromDate': '2026-01-01', 'toDate': '2026-09-11', 'currentPageSize': '100'}),
        ('D_잘못된날짜_예상외응답', {'fromDate': '9999-99-99', 'toDate': '9999-99-99'}),
    ]
    for name, extra in cases:
        payload = dict(base_payload)
        payload.update(extra)
        report['steps'].append(search(name, post_url, payload, cookie, posts))

    # 같은 조건의 2페이지 — 페이지 이동 인자 이름이 실제로 먹히는지 본다(이름 확인이 목적).
    payload = dict(base_payload)
    payload.update({'fromDate': '2026-01-01', 'toDate': '2026-09-11', 'currentPageSize': '100', 'pageIndex': '2'})
    report['steps'].append(search('E_2페이지_인자확인', post_url, payload, cookie, posts))

    report['postsSent'] = posts['n']
    print(json.dumps(report, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
