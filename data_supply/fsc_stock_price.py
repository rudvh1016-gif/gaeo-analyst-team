#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공공데이터포털 「금융위원회_주식시세정보」(data.go.kr 15094808) 어댑터 — provider → normalize → GAEO 내부 계약.

이 파일은 판정하지 않는다. 공식 오픈API 응답을 받아 구조를 대조하고, GAEO 분석가가 읽는 모양
(data_supply.contracts)으로 바꿀 뿐이다. 실제 호출은 config/source_compliance.json 의
`fsc_public_data` 게이트가 열려 있을 때만 한다(닫혀 있으면 네트워크 0 · LegalGateError).

## 계약의 출처 (2026-09-16 · 이 세션은 data.go.kr·fsc.go.kr 로의 egress 가 차단되어 원문 미열람)

포털 상세: https://www.data.go.kr/data/15094808/openapi.do
서비스:   https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo
요청:     serviceKey · resultType=json · numOfRows · pageNo · (basDt | beginBasDt/endBasDt) · (likeSrtnCd | isinCd | likeItmsNm …)
응답:     {"response":{"header":{"resultCode":"00","resultMsg":"NORMAL SERVICE."},
                       "body":{"numOfRows":n,"pageNo":p,"totalCount":t,"items":{"item":[{행},…]}}}}
행 필드:  basDt(기준일자 YYYYMMDD) srtnCd(단축코드) isinCd itmsNm(종목명) mrktCtg(시장구분 KOSPI/KOSDAQ/KONEX)
          clpr(종가) vs(대비) fltRt(등락률) mkp(시가) hipr(고가) lopr(저가) trqu(거래량) trPrc(거래대금)
          lstgStCnt(상장주식수) mrktTotAmt(시가총액)
갱신:     일 1회 · 기준일 다음 영업일 13:00(KST) 이후 개방 → 실시간이 아니다(T+1). 금요일 자료는 월요일.
한도:     개발계정 일 1,000회 · 운영계정 일 100,000회(활용사례 등록 시 증량) · 1회 최대 numOfRows 는 큰 값(10,000)을 받는다는
          사용 사례가 있어 전 종목(약 2,500)을 한 페이지로 받을 수 있다.
근거:     검색 결과에 인용된 포털·금융위 안내 스니펫과 이용 사례 코드(velog·github README)의 교차 확인.
          ⚠️ 원문·실응답으로 재검증하기 전까지 위 필드 목록은 **가정**이다. 그래서 응답이 오면 구조를 반드시 다시 대조하고
          (structureVerified), 필드가 하나라도 없으면 그 행으로 아무것도 만들지 않는다.

## 이 데이터로 대체할 수 있는 것 / 없는 것 (코드 실측 기준, config/data_supply_migration.json 과 같다)
    대체 가능(T+1): 종가·전일대비·등락률·시가·고가·저가·거래량·거래대금·시가총액·상장주식수·종목목록·시장구분
    대체 불가:     PER·PBR·EPS·BPS·ROE·배당(재무 계열 → DART 로 재구성 필요) · 52주 고저(1년 일봉을 쌓아 파생) ·
                   외국인/기관/개인 수급 · 컨센서스 · 거래정지 상태 · 지수(별도 데이터셋 15094807) · 환율

## 절대 하지 않는 것
    - serviceKey 를 URL 로그·산출물·예외 메시지에 남기지 않는다(redact).
    - 응답에 없는 날짜·종목·값을 만들어 넣지 않는다. 0건 응답은 "그 날 자료 없음"이지 가격이 아니다.
    - 네이버 값을 이 파일의 출력에 섞지 않는다. provider 는 항상 FSC_PUBLIC_DATA_PORTAL 이다.
    - 수정주가를 계산하지 않는다. 이 데이터셋에 조정 인자가 있는지 원문으로 확인되지 않았다(unadjusted 로 가정하고 그렇게 적는다).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import source_compliance as compliance          # noqa: E402
from data_supply import contracts               # noqa: E402

PROVIDER_ID = 'fsc_public_data'                 # config/source_compliance.json 의 키
PROVIDER = 'FSC_PUBLIC_DATA_PORTAL'             # provenance 에 적는 실제 공급자 이름
DATASET_ID = '15094808'
DATASET_TITLE = '금융위원회_주식시세정보'
PORTAL_URL = 'https://www.data.go.kr/data/15094808/openapi.do'
SERVICE_BASE = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService'
OPERATION = 'getStockPriceInfo'
KEY_ENV = 'DATA_GO_KR_SERVICE_KEY'
USER_AGENT = 'gaeo-data-supply/1 (+https://gaeoteam.com)'
CONTRACT_VERSION = 'fsc-stock-price-info-v1'
TIMEOUT_SECONDS = 30
MAX_BODY_BYTES = 40_000_000
MAX_ROWS_PER_CALL = 10_000          # 사용 사례 근거(2차). 응답의 totalCount 로 실제 한 페이지 수용 여부를 다시 본다.
MAX_PAGES = 20
DAILY_QUOTA_DEV = 1_000             # 공공데이터포털 개발계정 일반 한도(2차 자료)
DAILY_QUOTA_OPS = 100_000           # 운영계정(활용사례 등록 시 증량 가능, 2차 자료)
LATENCY = 'T+1: 기준일 다음 영업일 13:00 KST 이후 개방(실시간 아님 · 금요일 자료는 월요일)'
PRICE_BASIS = 'unadjusted_assumed'  # 조정 인자 유무를 원문으로 확인하지 못했다. 확인 전까지 조정하지 않는다.
OFFICIAL_SOURCE = True              # 원천은 한국거래소 → 금융위원회 → 공공데이터포털(공식 API). 채점 증명 인정 여부와는 별개.
REDACTED = '***'

REQUIRED_FIELDS = ('basDt', 'srtnCd', 'itmsNm', 'mrktCtg', 'clpr', 'vs', 'fltRt', 'mkp', 'hipr', 'lopr',
                   'trqu', 'trPrc', 'lstgStCnt', 'mrktTotAmt')
OPTIONAL_FIELDS = ('isinCd',)
#: 내부 계약 키 ← 이 데이터셋 필드 ← 지금 네이버가 주던 필드(교체 대상). 이름이 같다고 뜻이 같다고 가정하지 않는다:
#: 네이버 now 는 장중 현재가이고 clpr 는 확정 종가(T+1)다. 시가총액 단위도 다르다(네이버 marketSum 백만원 · 여기는 원).
FIELD_MAP = {
    'date':         {'fsc': 'basDt',      'naver': 'siseJson[0] / dealTrends.bizdate', 'note': '기준일자(거래일). 공급자가 확정한 값 — 우리가 붙인 수집 시각이 아니다'},
    'code':         {'fsc': 'srtnCd',     'naver': 'itemCode',                          'note': '단축코드 6자리. 앞에 문자가 붙어 오면 떼고 6자리로 맞춘다'},
    'name':         {'fsc': 'itmsNm',     'naver': 'stockName',                         'note': ''},
    'market':       {'fsc': 'mrktCtg',    'naver': 'marketValue API 의 market 경로',    'note': 'KOSPI/KOSDAQ/KONEX'},
    'close':        {'fsc': 'clpr',       'naver': 'itemSummary.now / siseJson 종가',   'note': '확정 종가. 네이버 now 는 장중 현재가'},
    'change':       {'fsc': 'vs',         'naver': 'itemSummary.diff',                  'note': '전일 대비(원)'},
    'rate':         {'fsc': 'fltRt',      'naver': 'itemSummary.rate',                  'note': '등락률(%)'},
    'open':         {'fsc': 'mkp',        'naver': 'siseJson 시가',                     'note': ''},
    'high':         {'fsc': 'hipr',       'naver': 'siseJson 고가',                     'note': ''},
    'low':          {'fsc': 'lopr',       'naver': 'siseJson 저가',                     'note': ''},
    'volume':       {'fsc': 'trqu',       'naver': 'siseJson 거래량 / dealTrends.accumulatedTradingVolume', 'note': '주'},
    'tradingValue': {'fsc': 'trPrc',      'naver': 'totalInfos.accumulatedTradingValue(미사용)', 'note': '원'},
    'listedShares': {'fsc': 'lstgStCnt',  'naver': '(없음 — 시총÷현재가로 역산)',        'note': '주'},
    'marketCap':    {'fsc': 'mrktTotAmt', 'naver': 'itemSummary.marketSum(백만원)',      'note': '원 단위 → data.js cap 은 백만원 기준 문자열'},
}
#: 이 데이터셋이 주지 않아 None 으로 두는 시세 줄 필드(값을 지어내지 않는다).
QUOTE_FIELDS_NOT_PROVIDED = ('per', 'pbr', 'roe', 'eps', 'div', 'w52')
#: 이 데이터셋으로 대체 **불가**한 GAEO 데이터 상품(문서·시험이 같은 목록을 본다).
NOT_REPLACED = ('per', 'pbr', 'eps', 'bps', 'roe', 'dividend', 'w52(1년 일봉 파생 필요)',
                'flow(외국인·기관·개인 수급)', 'consensus', 'tradableStatus', 'index(별도 데이터셋 15094807)', 'fx')

FIXTURE_PATH = os.path.join(HERE, 'fixtures', 'fsc_stock_price_synthetic.json')


class FscContractError(contracts.ContractError):
    """공식 응답이 계약과 다르다. 그 응답으로는 아무것도 만들지 않는다."""


# ── 값 변환 ─────────────────────────────────────────────────────────────────
def _num(value):
    """'12,345' · '-1.23' · 12345 → 숫자. 빈 값·None → None. 숫자가 아니면 ValueError."""
    if value is None:
        return None
    if isinstance(value, bool):
        raise ValueError('bool is not a number')
    if isinstance(value, (int, float)):
        return value
    text = str(value).strip().replace(',', '')
    if text in ('', '-', 'null', 'None'):
        return None
    if '.' in text or 'e' in text.lower():
        return float(text)
    return int(text)


def normalize_code(value):
    text = str(value or '').strip()
    if text and text[0].isalpha():        # 'A005930' 형태 방어 — 앞 글자 하나만 뗀다
        text = text[1:]
    if len(text) != 6 or not text.isdigit():
        raise FscContractError(f'srtnCd 가 6자리 숫자가 아니다: {value!r}')
    return text


def normalize_date(value):
    text = str(value or '').strip()
    if len(text) != 8 or not text.isdigit():
        raise FscContractError(f'basDt 가 YYYYMMDD 가 아니다: {value!r}')
    try:
        return dt.date(int(text[:4]), int(text[4:6]), int(text[6:])).isoformat()
    except ValueError:
        raise FscContractError(f'basDt 가 달력에 없는 날짜다: {value!r}')


def normalize_item(item):
    """응답 행 하나 → 내부 행. 필수 필드가 하나라도 없거나 숫자가 아니면 FscContractError(그 행은 버린다)."""
    if not isinstance(item, dict):
        raise FscContractError('item 이 dict 가 아니다')
    missing = [key for key in REQUIRED_FIELDS if key not in item]
    if missing:
        raise FscContractError('필수 필드 누락: ' + ','.join(missing))
    try:
        row = {
            'code': normalize_code(item['srtnCd']),
            'isin': (str(item.get('isinCd') or '').strip() or None),
            'name': str(item['itmsNm']).strip(),
            'market': str(item['mrktCtg']).strip().upper(),
            'date': normalize_date(item['basDt']),
            'close': _num(item['clpr']),
            'change': _num(item['vs']),
            'rate': _num(item['fltRt']),
            'open': _num(item['mkp']),
            'high': _num(item['hipr']),
            'low': _num(item['lopr']),
            'volume': _num(item['trqu']),
            'tradingValue': _num(item['trPrc']),
            'listedShares': _num(item['lstgStCnt']),
            'marketCap': _num(item['mrktTotAmt']),
        }
    except ValueError as exc:
        raise FscContractError(f'숫자 변환 실패: {exc}')
    for key in ('close', 'open', 'high', 'low', 'volume'):
        if row[key] is None:
            raise FscContractError(f'{key} 가 비어 있다 — 값을 지어내지 않는다')
    problems = contracts.validate_daily_bar(_bar_of(row))
    if problems:
        raise FscContractError('일봉 계약 위반: ' + '; '.join(problems))
    return row


def _bar_of(row):
    return {'date': row['date'], 'open': row['open'], 'high': row['high'], 'low': row['low'],
            'close': row['close'], 'volume': row['volume'],
            'frgnRate': None,                                   # 이 데이터셋에는 없다(네이버 전용 부가 필드였고 소비자도 없다)
            'tradingValue': row.get('tradingValue'), 'listedShares': row.get('listedShares'),
            'marketCap': row.get('marketCap')}


def parse_response(payload):
    """포털 표준 응답 껍데기를 벗겨 행 목록과 메타를 돌려준다. 구조가 다르면 FscContractError."""
    if not isinstance(payload, dict) or not isinstance(payload.get('response'), dict):
        raise FscContractError('response 객체가 없다')
    resp = payload['response']
    header, body = resp.get('header') or {}, resp.get('body') or {}
    code = str(header.get('resultCode', '')).strip()
    if code != '00':
        raise FscContractError(f'resultCode={code or "?"} resultMsg={str(header.get("resultMsg", ""))[:80]}')
    items = body.get('items')
    if items in (None, '', {}, []):
        raw = []
    elif isinstance(items, dict):
        raw = items.get('item')
        if raw in (None, ''):
            raw = []
        elif isinstance(raw, dict):
            raw = [raw]                     # 1건이면 dict 로 오는 포털 관례 방어
        elif not isinstance(raw, list):
            raise FscContractError('items.item 이 list 가 아니다')
    elif isinstance(items, list):
        raw = items
    else:
        raise FscContractError('items 형식을 모른다')
    meta = {'resultCode': code, 'totalCount': _int_or_none(body.get('totalCount')),
            'numOfRows': _int_or_none(body.get('numOfRows')), 'pageNo': _int_or_none(body.get('pageNo')),
            'itemCount': len(raw)}
    return raw, meta


def _int_or_none(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def normalize_items(raw_items):
    """행 단위로 변환한다. 깨진 행은 사유와 함께 따로 모은다(조용히 버리지 않는다)."""
    rows, rejected = [], []
    for index, item in enumerate(raw_items):
        try:
            rows.append(normalize_item(item))
        except contracts.ContractError as exc:
            rejected.append({'index': index, 'reason': str(exc)[:160]})
    return rows, rejected


def structure_report(raw_items):
    """실응답의 필드 이름·채움 비율만 남긴다(값은 남기지 않는다 — LEGAL GATE 의 표본값 정책과 같다)."""
    fields = {}
    for item in raw_items:
        if not isinstance(item, dict):
            continue
        for key, value in item.items():
            slot = fields.setdefault(key, {'present': 0, 'nonNull': 0})
            slot['present'] += 1
            if value not in (None, ''):
                slot['nonNull'] += 1
    n = len(raw_items) or 1
    out = {key: round(slot['nonNull'] / n, 3) for key, slot in sorted(fields.items())}
    missing = [key for key in REQUIRED_FIELDS if key not in fields]
    return {'fieldFillRatio': out, 'requiredMissing': missing, 'structureVerified': not missing and bool(raw_items)}


# ── 내부 계약으로 ───────────────────────────────────────────────────────────
def to_daily_series(rows):
    """{code: [일봉, …]} — 날짜 오름차순. analysis_data.json 의 daily 와 같은 키 + 부가 필드."""
    out = {}
    for row in rows:
        out.setdefault(row['code'], {})[row['date']] = _bar_of(row)
    return {code: [bars[d] for d in sorted(bars)] for code, bars in out.items()}


def to_quote(row, previous_close=None):
    """data.js stocks[code] 모양의 시세 줄. 재무 계열 필드는 이 데이터셋이 주지 않으므로 None 이다.

    반환: (quote, coverage). coverage 는 어느 필드가 공급자 값이고 어느 필드가 NOT_PROVIDED_BY_SOURCE 인지.
    """
    quote = {
        'name': row['name'], 'price': row['close'], 'rate': row['rate'],
        'per': None, 'pbr': None, 'roe': None, 'eps': None, 'div': None,
        'cap': contracts.cap_str(row['marketCap'] / 1_000_000) if row.get('marketCap') else None,
        'w52': None, 'stale': False,
    }
    coverage = {key: 'PROVIDED' for key in ('name', 'price', 'rate', 'cap')}
    if quote['cap'] is None:
        coverage['cap'] = contracts.NOT_PROVIDED_BY_SOURCE
    coverage.update({key: contracts.NOT_PROVIDED_BY_SOURCE for key in QUOTE_FIELDS_NOT_PROVIDED})
    if previous_close:
        implied = round((row['close'] / previous_close - 1) * 100, 2)
        coverage['rateCrossCheck'] = {'impliedFromPreviousClose': implied, 'sourceRate': row['rate'],
                                      'consistent': row['rate'] is not None and abs(implied - float(row['rate'])) <= 0.05}
    problems = contracts.validate_quote(quote)
    if problems:
        raise FscContractError('시세 줄 계약 위반: ' + '; '.join(problems))
    return quote, coverage


def request_path_template():
    return f'{SERVICE_BASE}/{OPERATION}?resultType=json&basDt={{basDt}}&numOfRows={{numOfRows}}&pageNo={{pageNo}}'


def provenance_for(row, received_at):
    excerpt = {key: row.get(key) for key in ('date', 'code', 'close', 'change', 'rate', 'volume', 'marketCap')}
    out = contracts.provenance(PROVIDER, DATASET_ID, request_path_template(), row['date'], received_at,
                               excerpt, OFFICIAL_SOURCE, source_as_of=row['date'])
    out.update({'sourceAsOfState': 'PROVIDED', 'sourceSessionDateState': 'PROVIDED',
                'latency': LATENCY, 'priceBasis': PRICE_BASIS, 'adapterContract': CONTRACT_VERSION,
                'scoringProofAccepted': False,
                'scoringProofNote': '공식 원천이지만 채점 증명(comparison_evidence)으로 인정할지는 별도 OWNER 결정이다.'})
    return out


# ── 네트워크(게이트 뒤) ──────────────────────────────────────────────────────
def redact(text, service_key=None):
    text = str(text)
    if service_key:
        for variant in {service_key, urllib.parse.quote(service_key, safe=''), urllib.parse.unquote(service_key)}:
            if variant:
                text = text.replace(variant, REDACTED)
    return text


def gate_state(cfg=None):
    return compliance.gate(PROVIDER_ID, cfg)


def build_url(service_key, bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=MAX_ROWS_PER_CALL):
    params = {'serviceKey': service_key, 'resultType': 'json', 'numOfRows': int(num_rows), 'pageNo': int(page_no)}
    if bas_dt:
        params['basDt'] = str(bas_dt)
    if begin:
        params['beginBasDt'] = str(begin)
    if end:
        params['endBasDt'] = str(end)
    if code:
        params['likeSrtnCd'] = normalize_code(code)
    return f'{SERVICE_BASE}/{OPERATION}?' + urllib.parse.urlencode(params, safe='')


def _default_opener(url, timeout):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        if resp.geturl().split('?')[0] != url.split('?')[0]:
            raise FscContractError('리다이렉트 거부 — 키 유출 방지')
        return resp.read(MAX_BODY_BYTES)


def fetch_page(*, bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=MAX_ROWS_PER_CALL,
               service_key=None, gate=None, opener=None, timeout=TIMEOUT_SECONDS):
    """한 페이지를 받아 (rows, rejected, meta, structure) 를 돌려준다.

    게이트(fsc_public_data:automatedCollection)가 열려 있지 않으면 **네트워크에 나가기 전에** LegalGateError.
    시험은 gate=compliance.cleared_gate(...) 와 opener 를 주입해 기계장치만 검사한다.
    """
    gate = gate or gate_state()
    if not gate.get('automatedCollectionAllowed'):
        raise compliance.LegalGateError(
            f'{PROVIDER_ID}:automatedCollection = {gate["gates"]["automatedCollection"]} — '
            '허용 근거가 config/source_compliance.json 에 기록되기 전에는 호출하지 않는다 (LEGAL_USE_UNVERIFIED)')
    key = service_key or os.environ.get(KEY_ENV) or ''
    if not key:
        raise FscContractError(f'{KEY_ENV} 가 없다 — 공공데이터포털 활용신청 뒤 발급된 serviceKey 가 필요하다')
    url = build_url(key, bas_dt=bas_dt, code=code, begin=begin, end=end, page_no=page_no, num_rows=num_rows)
    received_at = dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    try:
        body = (opener or _default_opener)(url, timeout)
    except urllib.error.HTTPError as exc:
        raise FscContractError(f'HTTP {exc.code} at {OPERATION}')        # 본문·URL 을 남기지 않는다(키 보호)
    except contracts.ContractError:
        raise
    except Exception as exc:                                             # noqa: BLE001 — 종류만 남긴다
        raise FscContractError(f'{type(exc).__name__} at {OPERATION}')
    try:
        payload = json.loads(body.decode('utf-8') if isinstance(body, (bytes, bytearray)) else body)
    except ValueError:
        raise FscContractError('응답이 JSON 이 아니다(XML 로 왔거나 오류 페이지)')
    raw, meta = parse_response(payload)
    structure = structure_report(raw)
    rows, rejected = normalize_items(raw)
    meta['receivedAt'] = received_at
    meta['requestPath'] = redact(url, key).split('serviceKey=')[0] + 'serviceKey=' + REDACTED
    return rows, rejected, meta, structure


def fetch_day(bas_dt, **kwargs):
    """기준일 하루의 전 종목(페이지네이션). 부분 응답은 그대로 알린다(채우지 않는다)."""
    rows_all, rejected_all, pages = [], [], 0
    page = 1
    while page <= MAX_PAGES:
        rows, rejected, meta, structure = fetch_page(bas_dt=bas_dt, page_no=page, **kwargs)
        pages += 1
        rows_all.extend(rows)
        rejected_all.extend(rejected)
        total = meta.get('totalCount') or 0
        if not rows or len(rows_all) + len(rejected_all) >= total:
            break
        page += 1
    return {'basDt': str(bas_dt), 'rows': rows_all, 'rejected': rejected_all, 'pages': pages,
            'totalCountReported': meta.get('totalCount'), 'structure': structure,
            'complete': (meta.get('totalCount') or 0) <= len(rows_all) + len(rejected_all),
            'receivedAt': meta.get('receivedAt'), 'requestPath': meta.get('requestPath')}


# ── 픽스처(합성 · 값 아님) ────────────────────────────────────────────────────
def load_fixture(path=None):
    with open(path or FIXTURE_PATH, encoding='utf-8') as handle:
        return json.load(handle)


def fixture_rows(path=None):
    raw, meta = parse_response(load_fixture(path))
    rows, rejected = normalize_items(raw)
    return rows, rejected, meta


def describe():
    """문서·시험이 함께 보는 정적 설명(무엇을 대체하고 무엇을 못 하는지)."""
    return {'providerId': PROVIDER_ID, 'provider': PROVIDER, 'dataset': DATASET_ID, 'title': DATASET_TITLE,
            'portal': PORTAL_URL, 'service': f'{SERVICE_BASE}/{OPERATION}', 'latency': LATENCY,
            'priceBasis': PRICE_BASIS, 'requiredFields': list(REQUIRED_FIELDS),
            'replaces': sorted(FIELD_MAP.keys()), 'notReplaced': list(NOT_REPLACED),
            'quotaDevPerDay': DAILY_QUOTA_DEV, 'quotaOpsPerDay': DAILY_QUOTA_OPS,
            'callsPerTradingDayFor600': 1, 'callsPerTradingDayWholeMarket': 1,
            'gate': {k: v for k, v in gate_state().items() if k in ('verdict', 'gates', 'state', 'commercialState')}}


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--fixture', action='store_true', help='합성 픽스처를 정규화해 요약만 출력(기본)')
    ap.add_argument('--live', action='store_true', help='실제 호출(게이트가 열려 있고 serviceKey 가 있을 때만)')
    ap.add_argument('--bas-dt', default=None, help='YYYYMMDD')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args(argv)
    if args.live:
        if not args.bas_dt:
            print('--bas-dt YYYYMMDD 가 필요하다'); return 2
        try:
            result = fetch_day(args.bas_dt)
        except compliance.LegalGateError as exc:
            print(f'LEGAL_GATE CLOSED: {exc}'); return 2
        except contracts.ContractError as exc:
            print(f'CONTRACT: {redact(exc, os.environ.get(KEY_ENV))}'); return 1
        summary = {'basDt': result['basDt'], 'rows': len(result['rows']), 'rejected': len(result['rejected']),
                   'pages': result['pages'], 'complete': result['complete'], 'structure': result['structure']}
        print(json.dumps(summary, ensure_ascii=False, indent=1) if args.json else summary)   # 값은 찍지 않는다
        return 0
    rows, rejected, meta = fixture_rows()
    series = to_daily_series(rows)
    summary = {'fixture': os.path.relpath(FIXTURE_PATH, ROOT), 'rows': len(rows), 'rejected': rejected,
               'codes': sorted(series), 'meta': meta, 'describe': describe()}
    print(json.dumps(summary, ensure_ascii=False, indent=1) if args.json else summary)
    return 0


if __name__ == '__main__':
    sys.exit(main())
