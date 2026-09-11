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


def assets(text):
    """화면이 실제로 불러오는 것들. 검색 요청을 만드는 코드는 이 안에 있다."""
    return {
        'scriptSrc': sorted(set(re.findall(r'<script[^>]*\bsrc\s*=\s*["\']([^"\']+)', text, re.I)))[:20],
        'frameSrc': sorted(set(re.findall(r'<(?:iframe|frame)[^>]*\bsrc\s*=\s*["\']([^"\']+)', text, re.I)))[:10],
        'doUrls': sorted(set(re.findall(r'[\w/.-]+\.do(?:\?[^"\'\s<>]*)?', text)))[:25],
        'methodStrings': sorted(set(re.findall(r'method\s*[=:]\s*["\']?([A-Za-z]{4,40})', text)))[:25],
        'forwardStrings': sorted(set(re.findall(r'forward\s*[=:]\s*["\']([A-Za-z_]{3,40})', text)))[:25],
    }


def around(text, needle, span=160, limit=4):
    """낱말 주변을 그대로 보여 준다 — 해석하지 않고 원문을 옮긴다."""
    out = []
    for match in list(re.finditer(re.escape(needle), text))[:limit]:
        chunk = text[max(0, match.start() - span):match.end() + span]
        out.append(' '.join(chunk.split()))
    return out


def main():
    report = {'note': '관찰 기록이다. 건수 판정이 아니다. 추측한 요청이 오류 화면을 받으면 그 사실을 그대로 적는다.',
              'steps': []}
    cookies = {}

    def jar():
        return '; '.join('%s=%s' % kv for kv in cookies.items()) or None

    def remember(meta):
        raw = meta.get('setCookie') or ''
        for part in raw.split(', '):
            head = part.split(';')[0].strip()
            if '=' in head:
                name, value = head.split('=', 1)
                cookies[name] = value

    meta, text = http(MKTACT)
    remember(meta)
    page = {'step': 'GET 시장조치 초기화면', 'http': meta, 'formActions': form_actions(text),
            'methodValues': method_values(text), 'hiddenDefaults': hidden_defaults(text),
            'assets': assets(text), 'searchContext': around(text, 'searchDetails', 120, 3)}
    report['steps'].append(page)
    if not text:
        print(json.dumps(report, ensure_ascii=False, indent=1))
        return 0

    # 화면이 부르는 스크립트에서 **실제 요청 만드는 자리**를 찾는다. 이름을 지어내지 않기 위해서다.
    found_methods, found_urls, snippets = list(page['assets']['methodStrings']), list(page['assets']['doUrls']), {}
    for src in page['assets']['scriptSrc'][:6]:
        if not src.endswith('.js'):
            continue
        url = urllib.parse.urljoin(MKTACT, src)
        js_meta, js_text = http(url, cookie=jar(), referer=MKTACT)
        entry = {'url': url, 'http': js_meta}
        if js_text:
            entry['assets'] = assets(js_text)
            entry['searchContext'] = around(js_text, 'searchDetails', 200, 3) or around(js_text, '.do', 120, 2)
            found_methods += entry['assets']['methodStrings']
            found_urls += entry['assets']['doUrls']
            snippets[url] = entry.get('searchContext')
        report['steps'].append({'step': '스크립트 확인', **entry})

    # 프레임이 있으면 진짜 검색 화면은 그 안이다.
    for src in page['assets']['frameSrc'][:3]:
        url = urllib.parse.urljoin(MKTACT, src)
        f_meta, f_text = http(url, cookie=jar(), referer=MKTACT)
        remember(f_meta)
        entry = {'step': '프레임 확인', 'url': url, 'http': f_meta}
        if f_text:
            entry['hiddenDefaults'] = hidden_defaults(f_text)
            entry['formActions'] = form_actions(f_text)
            entry['assets'] = assets(f_text)
            found_methods += entry['assets']['methodStrings']
            found_urls += entry['assets']['doUrls']
        report['steps'].append(entry)

    candidates = [m for m in dict.fromkeys(found_methods) if m.lower().startswith('search')][:4]
    report['methodCandidates'] = candidates
    report['urlCandidates'] = [u for u in dict.fromkeys(found_urls) if 'detail' in u.lower()][:6]

    posts = {'n': 0}
    base_payload = dict(page['hiddenDefaults'])
    base_payload.update({'currentPageSize': '15', 'pageIndex': '1',
                         'fromDate': '2026-08-11', 'toDate': '2026-09-11'})
    for name in candidates:
        payload = dict(base_payload, method=name)
        report['steps'].append(search('요청시도:' + name, urljoin_do(report['urlCandidates']), payload, jar(), posts))

    report['postsSent'] = posts['n']
    report['unverified'] = ['결과표 머리글·열 순서', '전체건수 표시', '페이지 이동 인자',
                            '표본 4종(시장조치 있음·0건·여러 페이지·실패)']
    print(json.dumps(report, ensure_ascii=False, indent=1))
    return 0


def urljoin_do(urls):
    for candidate in urls or []:
        if candidate.endswith('.do') or '.do?' in candidate:
            return urllib.parse.urljoin(BASE, candidate.split('?')[0])
    return BASE + '/disclosure/detailsExt.do'


if __name__ == '__main__':
    sys.exit(main())
