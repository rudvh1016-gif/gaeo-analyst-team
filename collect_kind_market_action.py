#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KRX KIND 시장조치 수집 — 두 번째 경로의 증거를 만든다. 판정은 하지 않는다.

OpenDART 만으로는 종목이 열리지 않는다. 두 경로 요건이 있기 때문이고, 그것이 바로
"한 곳이 못 본 것을 다른 곳이 봤을 수 있다" 는 안전장치다. 이 파일이 그 두 번째 경로다.

요청 방식과 결과 구조는 전부 화면에서 확인한 것이다(docs 및 run 34592992622·34593294338·
34603033862·34609723360). 지어낸 값이 없다.

    POST /disclosure/detailsExt.do
    method=searchDetailsMktactSubExt · forward=details_mktact_sub_ext
    repIsuSrtCd='A'+여섯자리 종목코드 · fromData · toData · pageIndex · searchCodeType=char

반드시 지키는 것 — 이 넷이 무너지면 '가짜 0건' 이 만들어진다:
    실패 화면(ERROR)은 LOOKUP_FAILED 다. **절대 0건이 아니다**
    0건은 EMPTY 화면을 실제로 봤을 때만 적는다
    한 쪽 15건 고정이다. 서버가 currentPageSize 를 무시한다 — 100 을 가정하면 누락이 생긴다
    행 수와 '전체 n건' 이 어긋나면 COUNT_MISMATCH 로 막는다

모델 호출 없음.
"""
import argparse
import datetime
import hashlib
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

import kind_market_action_classify as mk
import kind_result_reader as reader

BASE = 'https://kind.krx.co.kr'
SEARCH_URL = BASE + '/disclosure/detailsExt.do'
MAIN_URL = BASE + '/disclosure/detailsExt.do?ext=y&method=searchDetailsMktactMainExt'
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

SOURCE = 'KRX'
RETRIEVAL_PATH = 'KRX_KIND_WEB'
#: 종목 식별은 화면의 공식 조회 인자로 한다. 회사명 문자열로 잇지 않는다(동명이 그대로 오판이 된다).
IDENTITY_BASIS = 'repIsuSrtCd'
CONTRACT_VERSION = 'corporate-action-evidence-v1'
PARSER_VERSION = reader.PARSER_VERSION
OUT_DIR = 'gaeo_coverage'
OUT_FILE = os.path.join(OUT_DIR, 'kind_market_action_evidence.json')
BACKFILL_DAYS = 365
EVIDENCE_TTL_HOURS = 20
PAGE_SIZE = 15
MAX_PAGES_PER_TICKER = 40
REQUEST_PAUSE_SECONDS = 0.4


KST = datetime.timezone(datetime.timedelta(hours=9))


def _now():
    return datetime.datetime.now(datetime.timezone.utc)


def _ymd(value):
    return value.date().isoformat()


def fetch(url, data=None, cookie=None, timeout=30):
    """한 번의 요청. 전송 실패와 '응답은 왔는데 화면이 다르다' 를 구분해 돌려준다."""
    headers = {'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9', 'Referer': MAIN_URL}
    if cookie:
        headers['Cookie'] = cookie
    body = b''
    encoded = None
    if data is not None:
        encoded = urllib.parse.urlencode(data, encoding='utf-8').encode('utf-8')
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        headers['X-Requested-With'] = 'XMLHttpRequest'
    try:
        request = urllib.request.Request(url, data=encoded, headers=headers)
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = response.read(8_000_001)
            return {'httpStatus': response.status, 'error': None,
                    'setCookie': response.headers.get('Set-Cookie'),
                    'text': body.decode('utf-8', 'replace')}
    except urllib.error.HTTPError as error:
        return {'httpStatus': error.code, 'error': 'HTTPError', 'setCookie': None, 'text': ''}
    except Exception as error:
        return {'httpStatus': None, 'error': type(error).__name__, 'setCookie': None, 'text': ''}


def blank_record(ticker, bgn, end, queried_at):
    """증거의 빈 칸. **처음부터 ok=False 이고 0건이 아니다** — 확인한 것만 채워 넣는다."""
    return {
        'source': SOURCE, 'retrievalPath': RETRIEVAL_PATH, 'ticker': ticker,
        'identityBasis': IDENTITY_BASIS, 'from': bgn, 'to': end,
        'queriedAt': queried_at.isoformat(),
        'expiresAt': (queried_at + datetime.timedelta(hours=EVIDENCE_TTL_HOURS)).isoformat(),
        'parserVersion': PARSER_VERSION, 'contractVersion': CONTRACT_VERSION,
        'tickerMatched': False, 'structureVerified': False, 'ok': False,
        'apiStatus': None, 'httpStatus': None,
        'pagesExpected': None, 'pagesCollected': 0, 'totalCount': None,
        'collectedIds': [], 'findings': [], 'events': [], 'eventCounts': None,
        'listClassified': False, 'documentsInterpreted': False, 'uninterpreted': 0,
        'historicalBackfillComplete': False, 'unresolvedHistorical': 0,
        'responseRef': None, 'error': None}


def payload_for(ticker, bgn, end, page):
    return {'method': 'searchDetailsMktactSubExt', 'forward': 'details_mktact_sub_ext',
            'searchCodeType': 'char', 'currentPageSize': str(PAGE_SIZE),
            'pageIndex': str(page), 'repIsuSrtCd': 'A' + ticker,
            'searchCorpName': '', 'searchCorpNameTmp': '',
            'fromData': bgn, 'toData': end}


def collect_one(ticker, bgn, end, budget, cookie=None, sleep=time.sleep):
    queried_at = _now()
    record = blank_record(ticker, bgn, end, queried_at)
    if budget['left'] <= 0:
        record['error'] = 'REQUEST_BUDGET_EXHAUSTED'
        return record

    digest = hashlib.sha256()
    rows, page = [], 1
    while True:
        if budget['left'] <= 0:
            record['error'] = 'REQUEST_BUDGET_EXHAUSTED'
            return record
        budget['left'] -= 1
        answer = fetch(SEARCH_URL, data=payload_for(ticker, bgn, end, page), cookie=cookie)
        record['httpStatus'] = answer['httpStatus']
        if answer['error'] or not answer['text']:
            record['error'] = answer['error'] or 'EMPTY_RESPONSE'
            return record
        digest.update(answer['text'].encode('utf-8'))
        seen = reader.read(answer['text'])
        record['apiStatus'] = seen['kind']

        if seen['kind'] == reader.ERROR:
            record['error'] = 'LOOKUP_FAILED'        # 실패다. 0건이 아니다
            return record
        if seen['kind'] == reader.UNKNOWN:
            record['error'] = 'PAGE_STRUCTURE_UNEXPECTED:' + str(seen.get('reason'))
            return record
        if seen['kind'] == reader.EMPTY:
            if page != 1:
                record['error'] = 'EMPTY_PAGE_MIDWAY'   # 중간이 비면 온전한 수집이 아니다
                return record
            record.update(structureVerified=True, pagesExpected=1, pagesCollected=1,
                          totalCount=0, tickerMatched=True)
            break

        if not reader.page_complete(seen, PAGE_SIZE):
            record['error'] = 'COUNT_MISMATCH'
            return record
        rows.extend(seen['rows'])
        record['pagesExpected'] = seen['pages']
        record['pagesCollected'] = page
        record['totalCount'] = seen['total']
        record['structureVerified'] = True
        if page >= (seen['pages'] or 1) or page >= MAX_PAGES_PER_TICKER:
            break
        page += 1
        sleep(REQUEST_PAUSE_SECONDS)

    if record['pagesExpected'] and record['pagesCollected'] < record['pagesExpected']:
        record['error'] = 'COLLECTION_INCOMPLETE'
        return record
    if record['totalCount'] is not None and len(rows) != record['totalCount']:
        record['error'] = 'COUNT_MISMATCH'
        return record

    companies = {row.get('company') for row in rows if row.get('company')}
    if len(companies) > 1:
        # 종목으로 걸렀는데 여러 회사가 나오면 그 응답을 이 종목의 것으로 읽지 않는다.
        record['error'] = 'TICKER_MISMATCH'
        return record
    record['tickerMatched'] = True

    findings = [{'id': row.get('documentId') or '', 'receivedOn': (row.get('filedOn') or '').replace('-', ''),
                 'title': row.get('title') or '', 'filer': row.get('filer') or ''} for row in rows]
    # 시장조치는 기업행사 분류기로 세지 않는다. 공매도 과열 지정 같은 것은 기준가격도 주식 수도
    # 바꾸지 않으므로 '미해결 기업행사' 로 세면 멀쩡한 종목이 영원히 막힌다.
    # as_of 는 이 요청을 실제로 보낸 KST 날짜로 명시한다 — classify 모듈의 기본값(호출 시점의
    # 시스템 시계)에 맡기면 UTC/KST 경계(예: 23:30 UTC = 다음날 08:30 KST)에서 하루형(PRICE_BASIS)
    # 판정이 하루 어긋날 수 있다.
    summary = mk.summarize(findings, as_of=queried_at.astimezone(KST).date())
    record['findings'] = findings
    record['collectedIds'] = sorted({f['id'] for f in findings if f['id']})
    record['events'] = summary['openEffects']
    record['eventCounts'] = {'openEffects': summary['openEffects'], 'openCount': summary['openCount'],
                             'caution': summary['caution'], 'forecasts': summary['forecasts'],
                             'uninterpreted': summary['uninterpreted'],
                             'documents': len(findings),
                             'classifierVersion': summary['classifierVersion']}
    record['listClassified'] = True
    record['documentsInterpreted'] = False        # 본문은 한 건도 읽지 않았다
    record['uninterpreted'] = summary['uninterpreted']
    record['unresolvedHistorical'] = summary['openCount']
    record['historicalBackfillComplete'] = True
    record['responseRef'] = 'sha256:' + digest.hexdigest()
    record['ok'] = True
    return record


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--tickers', type=int, default=40, help='이번 회차에 볼 종목 수 상한')
    parser.add_argument('--requests', type=int, default=200, help='이번 회차 요청 수 상한')
    parser.add_argument('--days', type=int, default=BACKFILL_DAYS, help='과거 확인 범위(일)')
    args = parser.parse_args(argv)

    universe = []
    with open('krx_list.json', encoding='utf-8') as handle:
        for item in (json.load(handle).get('items') or []):
            code = str(item.get('c') or '')
            if len(code) == 6 and code.isdigit():
                universe.append(code)
    universe.sort()

    opening = fetch(MAIN_URL)
    cookie = None
    if opening.get('setCookie'):
        cookie = '; '.join(part.split(';')[0] for part in opening['setCookie'].split(', ') if '=' in part)

    now = _now()
    end, bgn = _ymd(now), _ymd(now - datetime.timedelta(days=args.days))
    previous = {}
    if os.path.exists(OUT_FILE):
        with open(OUT_FILE, encoding='utf-8') as handle:
            previous = json.load(handle)
    cursor = str(previous.get('cursor') or '')
    start = next((i for i, t in enumerate(universe) if t > cursor), 0) if cursor else 0
    todo = (universe[start:] + universe[:start])[:args.tickers]

    budget = {'left': args.requests}
    evidence = dict(previous.get('evidence') or {})
    done = []
    for ticker in todo:
        record = collect_one(ticker, bgn, end, budget, cookie=cookie)
        evidence[ticker] = record
        if record['ok']:
            done.append(ticker)
        if budget['left'] <= 0:
            break
        time.sleep(REQUEST_PAUSE_SECONDS)

    os.makedirs(OUT_DIR, exist_ok=True)
    payload = {'contractVersion': CONTRACT_VERSION, 'retrievalPath': RETRIEVAL_PATH,
               'generatedAt': now.isoformat(),
               'window': {'from': bgn, 'to': end, 'days': args.days},
               'cursor': done[-1] if done else cursor,
               'universe': len(universe), 'attempted': len(todo), 'succeeded': len(done),
               'requestsUsed': args.requests - budget['left'], 'evidence': evidence}
    with open(OUT_FILE, 'w', encoding='utf-8') as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=1, sort_keys=True)

    summary = {k: payload[k] for k in ('attempted', 'succeeded', 'requestsUsed', 'universe')}
    summary['withRows'] = sum(1 for t in done if evidence[t]['findings'])
    summary['zeroConfirmed'] = sum(1 for t in done if evidence[t]['totalCount'] == 0)
    summary['withOpenEvent'] = sum(1 for t in done if evidence[t]['unresolvedHistorical'])
    failures = {}
    for ticker in todo:
        error = evidence[ticker].get('error')
        if error:
            failures[str(error)[:40]] = failures.get(str(error)[:40], 0) + 1
    summary['failed'] = len(todo) - len(done)
    summary['failureReasons'] = failures
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
