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
COMMON_JS = BASE + '/js/common.js'
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

    # 1) 회사명 검색을 실제로 만드는 자리를 찾는다. akc.js 는 parent 로 넘길 뿐이었다(1회차 실측).
    for label, url in (('akc.js', AKC_JS), ('common.js', COMMON_JS)):
        meta, js = call('GET ' + label, url, cookie=jar(), referer=MKTACT)
        if meta is None:
            break
        found = {'doUrls': [], 'context': None}
        if js:
            found['doUrls'] = sorted(set(re.findall(r'[\w/.-]*searchcorpname[\w.]*\.do', js, re.I)))[:6]
            found['context'] = slice_around(js, 'searchcorpname', 1400, 700)
        report['steps'].append({'step': 'GET ' + label, 'http': meta, 'found': found})

    # 2) 이름 조회 경로가 막혀 있다. 그래서 식별값을 **직접 시험한다.**
    #    repIsuSrtCd 에 종목코드를 넣고 보냈을 때 결과가 그 회사 하나로 좁혀지면 그것이 증거다.
    #    좁혀지지 않으면 '종목코드가 아니다' 라고 적는다 — 어느 쪽이든 결과를 그대로 남긴다.
    payload = dict(hidden)
    payload.update({'method': 'searchDetailsMktactSubExt', 'forward': 'details_mktact_sub_ext',
                    'currentPageSize': '15', 'pageIndex': '1', 'searchCodeType': 'char',
                    'repIsuSrtCd': SAMPLE_TICKER, 'searchCorpName': '', 'searchCorpNameTmp': ''})
    for label, window in (('종목지정_최근1년', ('2025-09-11', '2026-09-11')),
                          ('종목지정_하루', ('2026-09-11', '2026-09-11')),
                          ('대조_종목미지정_하루', ('2026-09-11', '2026-09-11'))):
        body_payload = dict(payload)
        body_payload['fromData'], body_payload['toData'] = window
        if label.startswith('대조'):
            body_payload['repIsuSrtCd'] = ''
        meta, body = call(label, BASE + '/disclosure/detailsExt.do',
                          data=body_payload, cookie=jar(), referer=MKTACT)
        if meta is None:
            break
        names = re.findall(r'<font title="([^"]+)"><img', body or '')
        observed = {
            'countPhrases': re.findall(r'(?:총|전체)\s*[^<>]{0,20}?([0-9,]+)\s*건', strip_tags(body or ''))[:3],
            'pageInfo': slice_around(body or '', 'info type-00', 200),
            'companyNamesInRows': sorted(set(names))[:8],
            'rowCompanyCount': len(names),
            'hasErrorPage': '페이지 오류' in (body or ''),
            'text': strip_tags(body or '')[:300],
            'rawAroundTable': slice_around(body or '', '<table class="list', 900),
        }
        report['steps'].append({'step': label, 'window': window, 'repIsuSrtCd': body_payload['repIsuSrtCd'],
                                'http': meta, 'observed': observed})

    scoped = next((s2 for s2 in report['steps'] if s2.get('step') == '종목지정_최근1년'), None)
    names = (scoped or {}).get('observed', {}).get('companyNamesInRows') or []
    report['identifier'] = {
        'tried': SAMPLE_TICKER,
        'rowsNarrowedToOneCompany': (len(names) == 1) if names else None,
        'companySeen': names[0] if len(names) == 1 else None,
        'note': '행이 한 회사로 좁혀졌을 때만 repIsuSrtCd 를 종목코드로 읽는다. '
                '좁혀지지 않았거나 행이 없으면 아직 모르는 것이다 — 그렇게 적는다.'}

    report['stillUnverified'] = ['확인한 것만 위에 있다. 없는 것은 없는 것이다.']
    print(json.dumps(report, ensure_ascii=False, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
