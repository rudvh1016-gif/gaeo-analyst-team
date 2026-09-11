#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""회사별 기업행사 증거 수집 — GAEO Private 판정부가 그대로 소비하는 증거를 만든다.

이 파일은 **판정하지 않는다.** 조회하고, 끝까지 받았는지 대조하고, 증거를 남길 뿐이다.
상태(EVENT_FOUND / VERIFIED_NONE / UNKNOWN / REVIEW_REQUIRED)는 Private 이 정한다.

왜 회사별로 부르나
  전체 신규공시 목록에 그 종목이 안 보였다는 것은 '그 종목에 공시가 없었다'의 증거가 아니다.
  부재를 증명하려면 회사별로 조회하고 페이지를 끝까지 받아 건수를 대조해야 한다.

무엇을 절대 하지 않나
  조회 실패·전송 실패·페이지 누락·건수 불일치를 0건으로 바꾸지 않는다.
  회사명 문자열로 종목을 잇지 않는다(공식 corp_code↔stock_code 완전일치만).
  인증키를 URL·로그·산출물에 남기지 않는다(dart_client.redact).

과거 확인 범위와 그 한계
  BACKFILL_DAYS 만큼만 거슬러 본다. 기준가격을 바꾸는 행사(무상증자·주식배당·액면분할·감자·
  합병·분할)는 결정에서 적용까지 통상 수개월 안에 끝나므로 12개월이면 아직 유효한 것을 담는다.
  그보다 오래된 구간은 **미확인**이며, 이 수집은 그 구간에 대해 아무 말도 하지 않는다.

쓰는 법
  python3 collect_corporate_action_evidence.py [--tickers 50] [--requests 400] [--days 365]
"""
import argparse
import datetime
import hashlib
import json
import os
import sys

import corporate_action_classify as classify
import dart_client
import dart_pipeline

#: 이 수집기가 만드는 증거의 계약 버전. Private 이 이 이름으로 계약을 확인한다.
CONTRACT_VERSION = 'corporate-action-evidence-v1'
PARSER_VERSION = 'opendart-list-json-v3-effects'
SOURCE = 'OPENDART_API'
RETRIEVAL_PATH = 'opendart:list.json?corp_code'
IDENTITY_BASIS = 'corp_code_map'
#: 과거 확인 범위(일). 위 docstring 의 근거로 정한 값이며 바꾸면 문서도 함께 바꾼다.
BACKFILL_DAYS = 365
#: 증거 유효시간(시간). 지나면 Private 이 EVIDENCE_EXPIRED 로 닫는다.
EVIDENCE_TTL_HOURS = 20
#: 기준가격·주식수·상장상태에 영향을 주는 공시 제목 낱말. 현금배당은 주식 수를 바꾸지 않아 뺀다.
RELEVANT_TERMS = ('합병', '분할', '감자', '액면', '무상증자', '유상증자', '권리락',
                  '주식교환', '주식이전', '공개매수', '주식배당', '상장폐지', '거래정지')
OUT_DIR = 'gaeo_coverage'
OUT_FILE = os.path.join(OUT_DIR, 'corporate_action_evidence.json')


def _today():
    return datetime.datetime.now(datetime.timezone.utc)


def _ymd(value):
    return value.strftime('%Y%m%d')


def _relevant(title):
    return sorted({t for t in RELEVANT_TERMS if t in (title or '')})


def collect_one(client, ticker, corp_code, bgn_de, end_de, budget):
    """한 종목의 증거 한 건. budget['left'] 를 깎아 쓴다.

    실패는 실패로 남긴다 — ok=False 인 증거도 그대로 돌려준다(빠뜨리면 조용한 0건이 된다).
    """
    queried_at = _today()
    base = {
        'source': SOURCE, 'retrievalPath': RETRIEVAL_PATH, 'ticker': ticker,
        'identityBasis': IDENTITY_BASIS, 'from': bgn_de, 'to': end_de,
        'queriedAt': queried_at.isoformat(),
        'expiresAt': (queried_at + datetime.timedelta(hours=EVIDENCE_TTL_HOURS)).isoformat(),
        'parserVersion': PARSER_VERSION, 'contractVersion': CONTRACT_VERSION,
        'tickerMatched': True, 'structureVerified': False, 'ok': False,
        'apiStatus': None, 'httpStatus': None,
        'pagesExpected': None, 'pagesCollected': 0, 'totalCount': None,
        'collectedIds': [], 'findings': [], 'events': [], 'eventCounts': None,
        'listClassified': False, 'documentsInterpreted': False, 'uninterpreted': 0,
        'historicalBackfillComplete': False, 'unresolvedHistorical': 0,
        'responseRef': None, 'error': None}
    if budget['left'] <= 0:
        base['error'] = 'REQUEST_BUDGET_EXHAUSTED'
        return base

    rows, pages_expected, digest = [], None, hashlib.sha256()
    page_no = 1
    while True:
        if budget['left'] <= 0:
            base['error'] = 'REQUEST_BUDGET_EXHAUSTED'
            return base
        budget['left'] -= 1
        result = client.list_issuer_filings(corp_code, bgn_de, end_de, page_no=page_no)
        if result['status'] != dart_client.OK:
            # 전송 실패와 API 오류를 구분해 남긴다. 둘 다 0건이 아니다.
            base['error'] = result['status']
            base['apiStatus'] = str((result.get('data') or {}).get('status') or '') or None
            return base
        data = result.get('data') or {}
        base['apiStatus'] = str(data.get('status') or '')
        digest.update(json.dumps(data, ensure_ascii=False, sort_keys=True).encode('utf-8'))
        if result.get('noData'):
            # 013 = 그 조회 범위에 자료 없음. 대상·기간이 검증된 이 조회에 한해서만 0건이다.
            pages_expected, rows = 1, []
            base['pagesCollected'] = 1
            base['structureVerified'] = True
            break
        if not isinstance(data.get('list'), list) or 'total_page' not in data or 'total_count' not in data:
            base['error'] = 'RESPONSE_SHAPE_UNEXPECTED'      # 구조가 다르면 0건으로 읽지 않는다
            return base
        base['structureVerified'] = True
        pages_expected = int(data['total_page'] or 0)
        base['totalCount'] = int(data['total_count'] or 0)
        rows.extend(data['list'])
        base['pagesCollected'] = page_no
        if page_no >= max(pages_expected, 1):
            break
        page_no += 1

    base['pagesExpected'] = pages_expected if pages_expected is not None else 0
    if base['totalCount'] is None:
        base['totalCount'] = 0
    ids, findings, uninterpreted = [], [], 0
    for row in rows:
        rcept = str(row.get('rcept_no') or '')
        title = str(row.get('report_nm') or '')
        stock = str(row.get('stock_code') or '').strip()
        if not rcept or not title:
            uninterpreted += 1                 # 식별·제목이 없는 줄은 해석하지 못한 자료다
            continue
        if stock and stock != ticker:
            # 회사 단위 공시가 다른 종목코드를 가리키면 우리가 판단하지 않는다.
            uninterpreted += 1
            continue
        ids.append(rcept)
        hit = _relevant(title)
        if hit:
            findings.append({'id': rcept, 'title': title, 'terms': hit,
                             'receivedOn': str(row.get('rcept_dt') or '')})
    base['collectedIds'] = ids
    base['findings'] = findings
    # 공시 건수를 사건 수로 세지 않는다. 정정은 같은 사건이고, 종속회사 사안은 이 주식의 사건이 아니다.
    summary = classify.summarize(findings)
    base['events'] = summary['events']
    base['eventCounts'] = {'openSelf': summary['openSelf'], 'subsidiary': summary['subsidiary'],
                           'documents': len(findings), 'needsDocument': summary['needsDocument'],
                           'companyDoneAwaitingExchange': summary['companyDoneAwaitingExchange'],
                           'fullyResolved': summary['fullyResolved'],
                           'events': len(summary['events'])}
    # 목록 분류는 끝났지만 본문 확인이 필요한 건은 '해석 완료' 가 아니다 — 소비자가 보류하게 한다.
    base['uninterpreted'] = uninterpreted + summary['needsDocument']
    base['listClassified'] = True
    base['documentsInterpreted'] = False      # 본문은 아직 한 건도 읽지 않았다
    # 이 회사 자신의 사건만, 사건 단위로 센다. 거래소 반영 확인 경로가 없어 종료보고서가 있어도 연다고 하지 않는다.
    base['unresolvedHistorical'] = summary['openSelf']
    base['historicalBackfillComplete'] = True
    base['responseRef'] = 'sha256:' + digest.hexdigest()
    base['ok'] = True
    return base


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--tickers', type=int, default=50, help='이번 회차에 볼 종목 수 상한')
    parser.add_argument('--requests', type=int, default=400, help='이번 회차 API 요청 수 상한')
    parser.add_argument('--days', type=int, default=BACKFILL_DAYS, help='과거 확인 범위(일)')
    args = parser.parse_args(argv)

    client = dart_client.DartClient()
    corp_zip = client.corp_code_zip()
    if corp_zip['status'] != dart_client.OK:
        print(json.dumps({'ok': False, 'stage': 'corp_code', 'status': corp_zip['status'],
                          'error': corp_zip.get('error')}, ensure_ascii=False))
        return 2
    dart_rows = dart_pipeline.parse_corp_code_zip(corp_zip['data'])

    universe = {}
    with open('krx_list.json', encoding='utf-8') as handle:
        for item in (json.load(handle).get('items') or []):
            code = str(item.get('c') or '')
            if len(code) == 6 and code.isdigit():
                universe[code] = {'name': item.get('n') or '', 'sector': None}
    corp_map = dart_pipeline.build_corp_map(dart_rows, universe)
    mapped = corp_map.get('mapped') or {}

    now = _today()
    end_de, bgn_de = _ymd(now), _ymd(now - datetime.timedelta(days=args.days))
    budget = {'left': args.requests}
    # 진행 위치는 검증과 저장이 끝난 뒤에만 옮긴다. 중간에 끊겨도 다음 회차가 이어받는다.
    previous = {}
    if os.path.exists(OUT_FILE):
        with open(OUT_FILE, encoding='utf-8') as handle:
            previous = json.load(handle)
    cursor = str((previous.get('cursor') or ''))
    order = sorted(mapped)
    start = next((i for i, t in enumerate(order) if t > cursor), 0) if cursor else 0
    todo = (order[start:] + order[:start])[:args.tickers]

    evidence = dict(previous.get('evidence') or {})
    done = []
    for ticker in todo:
        record = collect_one(client, ticker, mapped[ticker]['corp_code'], bgn_de, end_de, budget)
        evidence[ticker] = record
        if record['ok']:
            done.append(ticker)
        if budget['left'] <= 0:
            break

    os.makedirs(OUT_DIR, exist_ok=True)
    payload = {'contractVersion': CONTRACT_VERSION, 'generatedAt': now.isoformat(),
               'window': {'from': bgn_de, 'to': end_de, 'days': args.days},
               'cursor': done[-1] if done else cursor,
               'universeMapped': len(mapped), 'attempted': len(todo), 'succeeded': len(done),
               'requestsUsed': args.requests - budget['left'],
               'efficiency': client.efficiency_report(), 'evidence': evidence}
    with open(OUT_FILE, 'w', encoding='utf-8') as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=1, sort_keys=True)
    summary = {k: payload[k] for k in ('attempted', 'succeeded', 'requestsUsed', 'universeMapped')}
    summary['withDocuments'] = sum(1 for t in done if evidence[t]['findings'])
    summary['withOpenEvent'] = sum(1 for t in done if evidence[t]['unresolvedHistorical'])
    summary['subsidiaryOnly'] = sum(1 for t in done if evidence[t]['findings']
                                    and not evidence[t]['unresolvedHistorical'])
    summary['clean'] = sum(1 for t in done if not evidence[t]['findings'])
    summary['failed'] = len(todo) - len(done)
    print(json.dumps(summary, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
