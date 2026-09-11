#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 접근 확인 — 응답을 받을 수 있는지만 본다. 파서가 아니다.

이 파일은 **아무것도 해석하지 않는다.** 화면을 볼 수 없는 상태에서 파서를 쓰면 그것이 곧
가짜 0건이 되기 때문이다. 여기서는 HTTP 응답 자체와 그 겉모양만 기록한다.

빈 화면·초기 화면·오류 안내문을 '결과 0건' 으로 읽지 않는다 — 그 판정 자체를 하지 않는다.
"""
import json
import sys
import urllib.error
import urllib.request

PAGES = {
    'mktact_main': 'https://kind.krx.co.kr/disclosure/detailsExt.do?ext=y&method=searchDetailsMktactMainExt',
    'details_main': 'https://kind.krx.co.kr/disclosure/details.do?method=searchDetailsMain',
}
UA = 'Mozilla/5.0 (X11; Linux x86_64)'
#: 겉모양 단서로만 쓴다. 있으면 '있었다', 없으면 '없었다' 로만 적고 결과 건수로 해석하지 않는다.
MARKERS = ('searchDetails', 'repIsuSrtCd', 'fromDate', 'toDate', 'paging', 'tbody', 'no_data', '조회된')


def probe(name, url, timeout=20):
    out = {'name': name, 'url': url, 'httpStatus': None, 'ok': False,
           'bytes': None, 'contentType': None, 'markers': [], 'error': None}
    try:
        request = urllib.request.Request(url, headers={'User-Agent': UA})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read(2_000_001)
            out['httpStatus'] = response.status
            out['contentType'] = response.headers.get('Content-Type')
        out['bytes'] = len(body)
        text = body.decode('utf-8', 'replace')
        out['markers'] = [m for m in MARKERS if m in text]
        out['ok'] = True
    except urllib.error.HTTPError as error:
        out['httpStatus'] = error.code
        out['error'] = 'HTTPError'
    except Exception as error:
        # 전송 실패는 httpStatus 없음으로 남긴다 — '응답이 왔는데 비어 있었다' 와 다른 사실이다.
        out['error'] = type(error).__name__
    return out


def main():
    results = [probe(name, url) for name, url in PAGES.items()]
    reachable = any(r['ok'] for r in results)
    print(json.dumps({'reachable': reachable, 'results': results}, ensure_ascii=False, indent=1))
    # 접근 불가도 정상 종료다 — 그 사실 자체가 이번 확인의 결과다.
    return 0


if __name__ == '__main__':
    sys.exit(main())
