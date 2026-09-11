#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 종목 식별값(repIsuSrtCd) 확인 — 회사명으로 종목을 맞추지 않기 위해서다.

시장조치 결과표에는 **종목코드가 없다**(회사명·KIND 법인코드·접수번호뿐). 회사명 문자열로
종목을 연결하면 동명·유사명이 그대로 오판이 된다. 그래서 화면이 실제로 쓰는 식별 경로를 찾는다.

여기서도 해석하지 않는다:
- 응답을 보이는 대로만 적는다. 값의 의미를 짐작해 채우지 않는다
- 결과가 비어 보여도 '해당 없음' 이라고 적지 않는다
- 오류·초기 화면을 0건으로 읽지 않는다

찾은 식별값으로 종목별 시장조치 조회를 실제로 보내고, **정상 0건 화면**을 확보하는 것까지가 이 파일의 일이다.
"""
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = 'https://kind.krx.co.kr'
MKTACT = BASE + '/disclosure/detailsExt.do?ext=y&method=searchDetailsMktactMainExt'
AKC_JS = BASE + '/js/akc.js?version=20251024'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
#: 이 저장소의 공개 증거 파일에 이미 들어 있는 종목이다(000020 부터 순서대로 훑은 목록).
#: 보유·추적 목록과 무관하므로 새로 드러나는 정보가 없다.
SAMPLE_NAME = '동화약품'
#: 되돌려받은 식별값이 이 종목코드와 같은지 **대조**한다 — 같으면 repIsuSrtCd 가 종목코드라는 증거다.
SAMPLE_TICKER = '000020'
MAX_REQUESTS = 12
RAW = 1800


def http(url, data=None, cookie=None, referer=None, timeout=30):
    out = {'url': url, 'verb': 'POST' if data is not None else 'GET', 'httpStatus': None,
           'bytes': None, 'contentType': None, 'error': None, 'setCookie': None}
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
    for entity, plain in (('&nbsp;', ' '), ('&amp;', '&'), ('&lt;', '<'), ('&gt;', '>')):
        text = text.replace(entity, plain)
    return ' '.join(text.split())


def slice_around(text, needle, span, back=0):
    at = text.find(needle)
    if at < 0:
        return None
    return ' '.join(text[max(0, at - back): at + span].split())


def main():
    report = {'note': '관찰 기록이다. 값의 의미를 짐작해 채우지 않는다.', 'steps': [], 'requests': 0}
    cookies = {}

    def jar():
        return '; '.join('%s=%s' % kv for kv in cookies.items()) or None

    def remember(meta):
        for part in (meta.get('setCookie') or '').split(', '):
            head = part.split(';')[0].strip()
            if '=' in head:
                name, value = head.split('=', 1)
                cookies[name] = value

    def call(step, url, **kwargs):
        if report['requests'] >= MAX_REQUESTS:
            report['steps'].append({'step': step, 'skipped': 'MAX_REQUESTS'})
            return None, ''
        report['requests'] += 1
        meta, text = http(url, **kwargs)
        remember(meta)
        return meta, text

    meta, text = call('GET 시장조치 초기화면', MKTACT)
    report['steps'].append({'step': 'GET 시장조치 초기화면', 'http': meta})
    hidden = {}
    for tag in re.findall(r'<input[^>]*>', text or '', re.I):
        if not re.search(r'type\s*=\s*["\']?hidden', tag, re.I):
            continue
        name = re.search(r'\bname\s*=\s*["\']([^"\']+)', tag, re.I)
        value = re.search(r'\bvalue\s*=\s*["\']([^"\']*)', tag, re.I)
        if name:
            hidden[name.group(1)] = value.group(1) if value else ''

    # 1) 회사명 검색을 실제로 하는 스크립트에서 주소와 인자 이름을 **추출**한다.
    meta, akc = call('GET akc.js', AKC_JS, cookie=jar(), referer=MKTACT)
    found = {'doUrls': [], 'paramNames': [], 'context': None}
    if akc:
        found['doUrls'] = sorted(set(re.findall(r'[\w/.-]*searchcorpname[\w.]*\.do', akc, re.I)))[:6]
        found['paramNames'] = sorted(set(re.findall(r'["\'](\w{3,20})["\']\s*:\s*', akc)))[:30]
        found['context'] = slice_around(akc, 'searchcorpname', 900, 400) or slice_around(akc, 'CorpName', 700, 300)
    report['steps'].append({'step': 'GET akc.js', 'http': meta, 'found': found})

    # 2) 회사명 검색을 실제로 보낸다. 후보 인자 이름을 하나씩 시험하고 응답 원문을 그대로 남긴다.
    lookup_url = BASE + '/common/searchcorpname.do'
    lookups = []
    for label, payload in (
        ('searchCorpName', {'searchCorpName': SAMPLE_NAME, 'searchCodeType': 'char'}),
        ('AKCKwd', {'AKCKwd': SAMPLE_NAME, 'searchCodeType': 'char'}),
        ('comnm', {'comnm': SAMPLE_NAME}),
    ):
        meta, body = call('회사명 검색:' + label, lookup_url, data=payload, cookie=jar(), referer=MKTACT)
        if meta is None:
            break
        entry = {'step': '회사명 검색', 'param': label, 'http': meta,
                 'raw': (' '.join(body.split()))[:RAW] if body else None,
                 'repisusrtcdSeen': sorted(set(re.findall(r'repisusrtcd["\']?\s*[:=]\s*["\']?(\w{4,12})', body or '', re.I)))[:5]}
        report['steps'].append(entry)
        lookups.append(entry)
        if entry['repisusrtcdSeen']:
            break

    code = next((e['repisusrtcdSeen'][0] for e in lookups if e['repisusrtcdSeen']), None)
    report['identifier'] = {'repIsuSrtCd': code, 'comparedWith': SAMPLE_TICKER,
                            'matchesTicker': (code == SAMPLE_TICKER) if code else None,
                            'note': '못 찾았으면 None 이다. 추측한 값을 넣지 않는다. '
                                    'matchesTicker 가 참이어야 repIsuSrtCd 를 종목코드로 읽을 수 있다.'}

    # 3) 찾은 식별값으로 종목별 시장조치 조회를 실제로 보낸다.
    if code:
        payload = dict(hidden)
        payload.update({'method': 'searchDetailsMktactSubExt', 'forward': 'details_mktact_sub_ext',
                        'currentPageSize': '15', 'pageIndex': '1', 'searchCodeType': 'char',
                        'repIsuSrtCd': code, 'searchCorpName': SAMPLE_NAME, 'searchCorpNameTmp': SAMPLE_NAME})
        for label, window in (('종목별_최근1년', ('2025-09-11', '2026-09-11')),
                              ('종목별_하루', ('2026-09-11', '2026-09-11'))):
            body_payload = dict(payload)
            body_payload['fromData'], body_payload['toData'] = window
            meta, body = call(label, BASE + '/disclosure/detailsExt.do',
                              data=body_payload, cookie=jar(), referer=MKTACT)
            if meta is None:
                break
            observed = {
                'countPhrases': re.findall(r'(?:총|전체)\s*[^<>]{0,20}?([0-9,]+)\s*건', strip_tags(body or ''))[:3],
                'rowCount': len(re.findall(r'<tr[^>]*>\s*<td[^>]*class="first', body or '', re.I)),
                'hasErrorPage': '페이지 오류' in (body or ''),
                'text': strip_tags(body or '')[:400],
                'rawAroundTable': slice_around(body or '', '<table', 1200),
                'rawAroundPaging': slice_around(body or '', 'paging-group', 900, 200),
            }
            report['steps'].append({'step': label, 'window': window, 'http': meta, 'observed': observed})

    report['stillUnverified'] = ['확인한 것만 위에 있다. 없는 것은 없는 것이다.']
    print(json.dumps(report, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
