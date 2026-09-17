#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공공데이터포털 「금융위원회_주식시세정보」(data.go.kr 15094808) 어댑터 — provider → normalize → GAEO 내부 계약.

이 파일은 판정하지 않는다. 공식 오픈API 응답을 받아 구조를 대조하고, GAEO 가 읽는 모양
(data_supply.contracts)으로 바꿀 뿐이다. 실제 호출은 config/source_compliance.json 의
`fsc_public_data` 게이트가 열려 있을 때만 한다(닫혀 있으면 네트워크 0 · LegalGateError).

## 이용허락 근거 (2026-09-17 · 이 데이터셋 15094808 하나에만 적용)

소유자가 2026-09-17 에 직접 확인해 전달한 내용: 상세 페이지·메타데이터(license) 모두 **이용허락범위 제한 없음** ·
비용 무료 · 개발·운영 단계 자동승인 안내 · 일 1회 갱신 · 기준일 다음 영업일 13:00 이후 제공(실시간 아님).
⚠️ 이 세션(Claude Code 원격)은 www.data.go.kr 로의 egress 가 차단되어(2026-09-17 세 URL 모두 EGRESS_BLOCKED)
   원문을 직접 열지 못했다 — "직접 열람 완료" 가 아니다. 판정·근거·확인 방법은 config/source_compliance.json 에 있다.
   이용허락(라이선스)과 서비스키 보유·활용신청 승인은 별개다: 키가 없거나 승인되지 않으면 이 어댑터는 아무것도 받지 못한다.

## 계약의 출처 (2026-09-16 초안 → 2026-09-17 운영 수리)

포털 상세: https://www.data.go.kr/data/15094808/openapi.do · 메타데이터 https://www.data.go.kr/catalog/15094808/openapi.json
서비스:   https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo
요청:     serviceKey · resultType=json · numOfRows · pageNo · (basDt | beginBasDt/endBasDt) · (likeSrtnCd | isinCd | likeItmsNm …)
응답:     {"response":{"header":{"resultCode":"00","resultMsg":"NORMAL SERVICE."},
                       "body":{"numOfRows":n,"pageNo":p,"totalCount":t,"items":{"item":[{행},…]}}}}
행 필드:  basDt(기준일자 YYYYMMDD · 거래 기준일이다 — 수집시각·발표시각이 아니다) srtnCd(단축코드) isinCd itmsNm mrktCtg
          clpr(종가) vs(대비) fltRt(등락률) mkp(시가) hipr(고가) lopr(저가) trqu(거래량) trPrc(거래대금) lstgStCnt mrktTotAmt
⚠️ 실응답으로 재검증하기 전까지 위 필드 목록은 **가정**이다. 응답이 오면 구조를 다시 대조하고(structureVerified),
   필드가 하나라도 없으면 그 행으로 아무것도 만들지 않는다. 한 페이지에 몇 행이 오는지, 전 종목이 한 페이지에 들어오는지는
   **가정하지 않고 응답(numOfRows·totalCount·itemCount)으로 매번 잰다.** 요청 한도도 계정 승인 조건으로 확인하기 전까지는
   힌트(QUOTA_HINTS · UNVERIFIED)일 뿐 실행 예산이 아니다 — 실행 예산은 호출자가 RequestBudget 으로 명시한다.

## 이 데이터로 대체할 수 있는 것 / 없는 것 (코드 실측 기준, config/data_supply_migration.json 과 같다)
    대체 가능(T+1): 종가·전일대비·등락률·시가·고가·저가·거래량·거래대금·시가총액·상장주식수·종목목록·시장구분
    대체 불가:     PER·PBR·EPS·BPS·ROE·배당(재무 계열 → DART 로 재구성 필요) · 52주 고저(1년 일봉을 쌓아 파생) ·
                   외국인/기관/개인 수급 · 컨센서스 · 거래정지 상태 · 지수(별도 데이터셋 15094807) · 환율

## 절대 하지 않는 것
    - serviceKey 를 URL 로그·산출물·예외 메시지·리다이렉트 대상에 남기지 않는다(redact · 리다이렉트는 따라가기 전에 차단).
    - 응답에 없는 날짜·종목·값을 만들어 넣지 않는다. 0건 응답은 "그 날 자료 없음"이지 가격이 아니다. totalCount 가
      없으면 0 이 아니라 "모름"이다. 같은 종목·날짜의 상충 값은 마지막 행을 정답으로 고르지 않고 둘 다 버린다.
    - 네이버 값을 이 파일의 출력에 섞지 않는다. provider 는 항상 FSC_PUBLIC_DATA_PORTAL 이다.
    - 수정주가를 계산하지 않는다. 조정 인자 유무가 원문으로 확인되지 않았다 → 공급자 제공값 그대로 · 조정 여부 UNCONFIRMED.
    - 거래량 0 만으로 거래정지를, 행 누락만으로 휴장·상장폐지를 추정하지 않는다(개수만 센다).
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import math
import os
import re
import sys
import time
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
METADATA_URL = 'https://www.data.go.kr/catalog/15094808/openapi.json'
SERVICE_BASE = 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService'
OPERATION = 'getStockPriceInfo'
KEY_ENV = 'DATA_GO_KR_SERVICE_KEY'
USER_AGENT = 'gaeo-data-supply/1 (+https://gaeoteam.com)'
CONTRACT_VERSION = 'fsc-stock-price-info-v2'
TIMEOUT_SECONDS = 30
MAX_BODY_BYTES = 40_000_000
#: 요청 파라미터일 뿐이다. 포털이 실제로 한 페이지에 몇 행을 주는지는 응답으로 잰다(가정하지 않는다).
DEFAULT_NUM_ROWS = 3_000
MAX_ROWS_PER_CALL = DEFAULT_NUM_ROWS            # 하위호환 이름
MAX_PAGES = 20
#: 한도 힌트 — 실행 예산이 아니다. 실제 계정의 승인 한도를 소유자가 확인하기 전까지 UNVERIFIED.
QUOTA_HINTS = {
    'devAccountPerDay': {'value': 10_000, 'source': '포털 상세 표시(소유자 2026-09-17 확인 보고)', 'status': 'UNVERIFIED_FOR_THIS_ACCOUNT'},
    'opsAccountPerDay': {'value': None, 'source': '활용사례 등록 시 증량(2차 자료)', 'status': 'UNVERIFIED'},
    'rowsPerPage': {'value': None, 'source': '응답 numOfRows·itemCount 로 실측', 'status': 'MEASURED_AT_RUNTIME'},
    'note': '한도는 계정 승인 조건이다. 여기 숫자로 예산을 잡지 않는다 — RequestBudget 이 명시한 상한만 쓴다.',
}
LATENCY = 'T+1: 기준일 다음 영업일 13:00 KST 이후 제공(실시간 아님 · 금요일 자료는 월요일)'
PRICE_BASIS = 'provider_as_is'                  # 공급자 제공값 그대로. 'adjusted'/'unadjusted' 로 승격하지 않는다.
ADJUSTMENT_STATUS = 'UNCONFIRMED'               # 조정 인자 유무가 원문으로 확인되기 전까지.
PRICE_BASIS_VERIFIED = False
OFFICIAL_SOURCE = True                          # 원천은 한국거래소 → 금융위원회 → 공공데이터포털(공식 API). 채점 증명 인정과는 별개.
REDACTED = '***'
LICENSE_NOTE = ('이용허락범위 제한 없음(소유자 2026-09-17 직접 확인 보고 · 세션 직접 열람은 EGRESS_BLOCKED) · '
                '출처표시: 금융위원회_주식시세정보(공공데이터포털)')
ATTRIBUTION = '출처: 금융위원회 주식시세정보 · 공공데이터포털(data.go.kr 15094808)'

REQUIRED_FIELDS = ('basDt', 'srtnCd', 'itmsNm', 'mrktCtg', 'clpr', 'vs', 'fltRt', 'mkp', 'hipr', 'lopr',
                   'trqu', 'trPrc', 'lstgStCnt', 'mrktTotAmt')
OPTIONAL_FIELDS = ('isinCd',)
#: 내부 계약 키 ← 이 데이터셋 필드 ← 지금 네이버가 주던 필드(교체 대상). 이름이 같다고 뜻이 같다고 가정하지 않는다:
#: 네이버 now 는 장중 현재가이고 clpr 는 확정 종가(T+1)다. 시가총액 단위도 다르다(네이버 marketSum 백만원 · 여기는 원).
FIELD_MAP = {
    'date':         {'fsc': 'basDt',      'naver': 'siseJson[0] / dealTrends.bizdate', 'note': '기준일자(거래일). 공급자가 확정한 값 — 우리가 붙인 수집 시각이 아니다'},
    'code':         {'fsc': 'srtnCd',     'naver': 'itemCode',                          'note': '단축코드 6자리. 앞자리 0 보존. 접두 문자가 오면 떼되 codeRaw·codePrefix 에 그대로 기록한다'},
    'name':         {'fsc': 'itmsNm',     'naver': 'stockName',                         'note': ''},
    'market':       {'fsc': 'mrktCtg',    'naver': 'marketValue API 의 market 경로',    'note': 'KOSPI/KOSDAQ/KONEX'},
    'close':        {'fsc': 'clpr',       'naver': 'itemSummary.now / siseJson 종가',   'note': '확정 종가(원). 네이버 now 는 장중 현재가'},
    'change':       {'fsc': 'vs',         'naver': 'itemSummary.diff',                  'note': '전일 대비(원)'},
    'rate':         {'fsc': 'fltRt',      'naver': 'itemSummary.rate',                  'note': '등락률(%)'},
    'open':         {'fsc': 'mkp',        'naver': 'siseJson 시가',                     'note': '원'},
    'high':         {'fsc': 'hipr',       'naver': 'siseJson 고가',                     'note': '원'},
    'low':          {'fsc': 'lopr',       'naver': 'siseJson 저가',                     'note': '원'},
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

#: fetch_day 완전성 상태 어휘. COMPLETE 만 "그 날 전체를 받았다"는 뜻이다.
COMPLETENESS = ('COMPLETE', 'PARTIAL', 'NO_DATA', 'UNKNOWN_TOTAL', 'INCONSISTENT', 'FAILED')

_NUMBER_RE = re.compile(r'[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?')
_PCT_RE = re.compile(r'%[0-9A-Fa-f]{2}')
_ISIN_KR_RE = re.compile(r'KR7\d{9}')


class FscContractError(contracts.ContractError):
    """공식 응답이 계약과 다르다. 그 응답으로는 아무것도 만들지 않는다."""


class CredentialsMissing(FscContractError):
    """serviceKey 가 없다. 키 없이 호출하지 않고, 키를 다른 경로로 구하지도 않는다."""


class BudgetExhausted(FscContractError):
    """호출자가 정한 요청 상한에 닿았다. 더 부르지 않는다(공식 한도와 무관한 이번 작업의 상한)."""


class RequestBudget:
    """이번 실행의 요청 상한과 실제 집계(요청·재시도·실패·받은 행)."""

    def __init__(self, max_requests):
        self.max_requests = int(max_requests)
        if self.max_requests < 1:
            raise ValueError('max_requests must be >= 1')
        self.requests = 0
        self.failures = 0
        self.retries = 0
        self.rows_received = 0

    def take(self):
        if self.requests >= self.max_requests:
            raise BudgetExhausted(f'요청 상한 {self.max_requests}회 도달 — 더 부르지 않는다')
        self.requests += 1

    def summary(self):
        return {'maxRequests': self.max_requests, 'requests': self.requests, 'retries': self.retries,
                'failures': self.failures, 'rowsReceived': self.rows_received,
                'remaining': self.max_requests - self.requests}


# ── 값 변환 ─────────────────────────────────────────────────────────────────
def _num(value):
    """'12,345' · '-1.23' · 12345 → 숫자. 빈 값·None → None(0 이 아니다). NaN·무한대·문자는 ValueError."""
    if value is None:
        return None
    if isinstance(value, bool):
        raise ValueError('bool is not a number')
    if isinstance(value, (int, float)):
        if isinstance(value, float) and not math.isfinite(value):
            raise ValueError('not finite')
        return value
    text = str(value).strip().replace(',', '')
    if text in ('', '-', 'null', 'None'):
        return None
    if not _NUMBER_RE.fullmatch(text):
        raise ValueError(f'숫자 아님: {text[:24]!r}')
    number = float(text) if ('.' in text or 'e' in text.lower()) else int(text)
    if isinstance(number, float) and not math.isfinite(number):
        raise ValueError('not finite')
    return number


def split_code(value):
    """(6자리 코드, 접두 문자 or None). 'A005930' 처럼 문자가 붙어 오면 떼되 **기록한다** — 임의 제거가 아니다.
    앞자리 0 은 보존한다. 6자리 숫자가 아니면 FscContractError."""
    text = str(value or '').strip()
    prefix = None
    if text and text[0].isalpha() and len(text) == 7 and text[1:].isdigit():
        prefix, text = text[0], text[1:]
    if len(text) != 6 or not text.isdigit():
        raise FscContractError(f'srtnCd 가 6자리 숫자가 아니다: {value!r}')
    return text, prefix


def normalize_code(value):
    return split_code(value)[0]


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
    code, prefix = split_code(item['srtnCd'])
    isin = (str(item.get('isinCd') or '').strip() or None)
    try:
        row = {
            'code': code,
            'codeRaw': str(item['srtnCd']).strip(),
            'codePrefix': prefix,
            'isin': isin,
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
    if row['close'] <= 0:
        raise FscContractError('close 가 0 이하 — 가격이 아니다')
    for key in ('tradingValue', 'listedShares', 'marketCap'):
        if row[key] is not None and row[key] < 0:
            raise FscContractError(f'{key} 가 음수다')
    # 종목 식별 교차 확인(우선주는 ISIN 이 단축코드와 다를 수 있어 거르지 않고 표시만 한다)
    row['isinMatchesCode'] = (isin[3:9] == code) if (isin and _ISIN_KR_RE.fullmatch(isin)) else None
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


def bar_of(row):
    """저장·차트용 일봉(내부 계약 키). 값은 공급자 제공값 그대로다."""
    return _bar_of(row)


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
    meta = {'resultCode': code, 'resultMsg': str(header.get('resultMsg', ''))[:80],
            'totalCount': _int_or_none(body.get('totalCount')),           # 없으면 None — 0 으로 취급하지 않는다
            'numOfRows': _int_or_none(body.get('numOfRows')), 'pageNo': _int_or_none(body.get('pageNo')),
            'itemCount': len(raw)}
    return raw, meta


def _int_or_none(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def normalize_items(raw_items, page_no=None):
    """행 단위로 변환한다. 깨진 행은 사유와 함께 따로 모은다(조용히 버리지 않는다)."""
    rows, rejected = [], []
    for index, item in enumerate(raw_items):
        try:
            rows.append(normalize_item(item))
        except contracts.ContractError as exc:
            entry = {'index': index, 'reason': str(exc)[:160]}
            if page_no is not None:
                entry['page'] = page_no
            rejected.append(entry)
    return rows, rejected


def structure_report(raw_items):
    """실응답의 필드 이름·채움 비율·코드 형식만 남긴다(값은 남기지 않는다 — LEGAL GATE 의 표본값 정책과 같다)."""
    fields = {}
    code_formats = {'digits6': 0, 'alpha1+digits6': 0, 'other': 0}
    for item in raw_items:
        if not isinstance(item, dict):
            continue
        for key, value in item.items():
            slot = fields.setdefault(key, {'present': 0, 'nonNull': 0})
            slot['present'] += 1
            if value not in (None, ''):
                slot['nonNull'] += 1
        text = str(item.get('srtnCd') or '').strip()
        if len(text) == 6 and text.isdigit():
            code_formats['digits6'] += 1
        elif len(text) == 7 and text[0].isalpha() and text[1:].isdigit():
            code_formats['alpha1+digits6'] += 1
        else:
            code_formats['other'] += 1
    n = len(raw_items) or 1
    out = {key: round(slot['nonNull'] / n, 3) for key, slot in sorted(fields.items())}
    missing = [key for key in REQUIRED_FIELDS if key not in fields]
    return {'fieldFillRatio': out, 'requiredMissing': missing, 'structureVerified': not missing and bool(raw_items),
            'codeFormats': code_formats, 'itemCount': len(raw_items)}


# ── 내부 계약으로 ───────────────────────────────────────────────────────────
def to_daily_series(rows):
    """{code: [일봉, …]} — 날짜 오름차순. analysis_data.json 의 daily 와 같은 키 + 부가 필드."""
    out = {}
    for row in rows:
        out.setdefault(row['code'], {})[row['date']] = _bar_of(row)
    return {code: [bars[d] for d in sorted(bars)] for code, bars in out.items()}


def to_quote(row, previous_close=None):
    """data.js stocks[code] 모양의 시세 줄. 재무 계열 필드는 이 데이터셋이 주지 않으므로 None 이다.

    ⚠️ 이 줄은 확정 종가(T+1)다. data.js 의 장중 현재가 자리에 넣지 않는다(2026-09-17 지시 §3).
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
                'latency': LATENCY, 'priceBasis': PRICE_BASIS, 'adjustmentStatus': ADJUSTMENT_STATUS,
                'adapterContract': CONTRACT_VERSION, 'operation': OPERATION,
                'scoringProofAccepted': False,
                'scoringProofNote': '공식 원천이지만 채점 증명(comparison_evidence)으로 인정할지는 별도 OWNER 결정이다.'})
    return out


# ── 인증키 ──────────────────────────────────────────────────────────────────
def service_key_form(key):
    """'encoded'(포털 인코딩키 · %2B 같은 퍼센트 인코딩 포함) / 'decoded' / 'missing'. 키 값은 돌려주지 않는다."""
    key = str(key or '').strip()
    if not key:
        return 'missing'
    return 'encoded' if _PCT_RE.search(key) else 'decoded'


def normalize_service_key(key):
    """포털은 인코딩키·디코딩키 두 형태를 준다. 인코딩키를 그대로 urlencode 하면 %2B → %252B 로 **이중 인코딩**되어
    인증이 실패한다. 그래서 인코딩키는 먼저 디코딩하고, build_url 의 urlencode 가 딱 한 번만 인코딩한다."""
    key = str(key or '').strip()
    if not key:
        return ''
    if _PCT_RE.search(key):
        key = urllib.parse.unquote(key)
    return key


def redact(text, service_key=None):
    text = str(text)
    key = normalize_service_key(service_key)
    if key:
        variants = {key, urllib.parse.quote(key, safe=''), urllib.parse.quote_plus(key),
                    urllib.parse.quote(urllib.parse.quote(key, safe=''), safe='')}
        if service_key:
            variants.add(str(service_key).strip())
        for variant in sorted(variants, key=len, reverse=True):
            if variant:
                text = text.replace(variant, REDACTED)
    return text


def gate_state(cfg=None):
    return compliance.gate(PROVIDER_ID, cfg)


def _params(service_key, bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=DEFAULT_NUM_ROWS):
    params = {'serviceKey': service_key, 'resultType': 'json', 'numOfRows': int(num_rows), 'pageNo': int(page_no)}
    if bas_dt:
        params['basDt'] = str(bas_dt)
    if begin:
        params['beginBasDt'] = str(begin)
    if end:
        params['endBasDt'] = str(end)
    if code:
        params['likeSrtnCd'] = normalize_code(code)
    return params


def build_url(service_key, bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=DEFAULT_NUM_ROWS):
    params = _params(normalize_service_key(service_key), bas_dt, code, begin, end, page_no, num_rows)
    return f'{SERVICE_BASE}/{OPERATION}?' + urllib.parse.urlencode(params, safe='')


def redacted_request_path(bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=DEFAULT_NUM_ROWS):
    """키 자리에 *** 만 넣은 요청 경로(저장·로그용). 키 문자열은 어디에도 지나가지 않는다."""
    params = _params(REDACTED, bas_dt, code, begin, end, page_no, num_rows)
    return f'{SERVICE_BASE}/{OPERATION}?' + urllib.parse.urlencode(params, safe='*')


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """리다이렉트를 **따라가기 전에** 끊는다 — 키가 붙은 요청이 다른 주소로 전달되지 않게(사후 검사가 아니다)."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):   # noqa: D401 — urllib 시그니처
        raise FscContractError(f'HTTP {code} 리다이렉트 거부 — 키가 다른 주소로 전달되기 전에 차단')


_OPENER = urllib.request.build_opener(_NoRedirect())


def _default_opener(url, timeout):
    req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'})
    with _OPENER.open(req, timeout=timeout) as resp:
        return resp.read(MAX_BODY_BYTES)


def _utcnow():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def _in_scope(row, bas_dt=None, begin=None, end=None):
    if bas_dt:
        return row['date'] == normalize_date(bas_dt)
    if begin and row['date'] < normalize_date(begin):
        return False
    if end and row['date'] > normalize_date(end):
        return False
    return True


def fetch_page(*, bas_dt=None, code=None, begin=None, end=None, page_no=1, num_rows=DEFAULT_NUM_ROWS,
               service_key=None, gate=None, opener=None, timeout=TIMEOUT_SECONDS, budget=None):
    """한 페이지를 받아 (rows, rejected, meta, structure) 를 돌려준다.

    게이트(fsc_public_data:automatedCollection)가 열려 있지 않으면 **네트워크에 나가기 전에** LegalGateError.
    키가 없으면 CredentialsMissing(호출 0). budget 이 있으면 요청 전에 1회를 소비한다(상한이면 BudgetExhausted · 호출 0).
    meta.requestedAt 은 요청 직전, meta.receivedAt 은 **응답을 다 받은 뒤** 찍는다.
    요청한 기준일·기간·종목 밖의 행은 rows 에서 빼고 개수만 센다(outOfRange · codeMismatch).
    시험은 gate=compliance.cleared_gate(...) 와 opener 를 주입해 기계장치만 검사한다.
    """
    gate = gate or gate_state()
    if not gate.get('automatedCollectionAllowed'):
        raise compliance.LegalGateError(
            f'{PROVIDER_ID}:automatedCollection = {gate["gates"]["automatedCollection"]} — '
            '허용 근거가 config/source_compliance.json 에 기록되기 전에는 호출하지 않는다 (LEGAL_USE_UNVERIFIED)')
    raw_key = service_key or os.environ.get(KEY_ENV) or ''
    key = normalize_service_key(raw_key)
    if not key:
        raise CredentialsMissing(f'{KEY_ENV} 가 없다 — 공공데이터포털 활용신청 뒤 발급된 serviceKey 가 필요하다 (CREDENTIALS_MISSING)')
    if budget is not None:
        budget.take()
    url = build_url(key, bas_dt=bas_dt, code=code, begin=begin, end=end, page_no=page_no, num_rows=num_rows)
    requested_at = _utcnow()
    started = time.monotonic()
    try:
        body = (opener or _default_opener)(url, timeout)
    except urllib.error.HTTPError as exc:
        if budget is not None:
            budget.failures += 1
        raise FscContractError(f'HTTP {exc.code} at {OPERATION}')        # 본문·URL 을 남기지 않는다(키 보호)
    except contracts.ContractError:
        if budget is not None:
            budget.failures += 1
        raise
    except Exception as exc:                                             # noqa: BLE001 — 종류만 남긴다
        if budget is not None:
            budget.failures += 1
        raise FscContractError(f'{type(exc).__name__} at {OPERATION}')
    received_at = _utcnow()
    elapsed_ms = int((time.monotonic() - started) * 1000)
    try:
        payload = json.loads(body.decode('utf-8') if isinstance(body, (bytes, bytearray)) else body)
    except ValueError:
        if budget is not None:
            budget.failures += 1
        raise FscContractError('응답이 JSON 이 아니다(XML 로 왔거나 오류 페이지)')
    try:
        raw, meta = parse_response(payload)
    except contracts.ContractError:
        if budget is not None:
            budget.failures += 1
        raise
    structure = structure_report(raw)
    rows, rejected = normalize_items(raw, page_no=page_no)
    in_scope, out_of_range = [], 0
    for row in rows:
        if _in_scope(row, bas_dt, begin, end):
            in_scope.append(row)
        else:
            out_of_range += 1
    rows, code_mismatch = in_scope, 0
    if code:
        wanted = normalize_code(code)
        kept = [row for row in rows if row['code'] == wanted]
        code_mismatch = len(rows) - len(kept)
        rows = kept
    if budget is not None:
        budget.rows_received += len(raw)
    meta.update({'requestedAt': requested_at, 'receivedAt': received_at, 'elapsedMs': elapsed_ms,
                 'requestPath': redacted_request_path(bas_dt, code, begin, end, page_no, num_rows),
                 'requestedNumOfRows': int(num_rows), 'outOfRange': out_of_range, 'codeMismatch': code_mismatch,
                 'rawItems': raw})
    return rows, rejected, meta, structure


def _dedupe(rows):
    """같은 (종목, 날짜) 행이 여러 번 오면: 값이 전부 같으면 하나만 남기고(개수 기록), 다르면 **둘 다 버린다**(상충)."""
    groups = {}
    for row in rows:
        groups.setdefault((row['code'], row['date']), []).append(row)
    kept, identical, conflicts = [], 0, []
    for key, items in groups.items():
        if len(items) == 1:
            kept.append(items[0])
            continue
        first = _bar_of(items[0])
        if all(_bar_of(item) == first for item in items[1:]):
            kept.append(items[0])
            identical += len(items) - 1
        else:
            conflicts.append({'code': key[0], 'date': key[1], 'rows': len(items)})
    return kept, identical, conflicts


def fetch_day(bas_dt, *, budget=None, num_rows=DEFAULT_NUM_ROWS, **kwargs):
    """기준일 하루의 전 종목(페이지네이션). 부분 응답은 그대로 알린다(채우지 않는다).

    completeness.status: COMPLETE(총 건수만큼 받음) · PARTIAL(중간 실패·빈 페이지·페이지 상한·예산 소진) · NO_DATA(총 건수 0 — 그 날 자료 없음 · 가격 아님) ·
    UNKNOWN_TOTAL(totalCount 없음 — 0 이 아니라 모름) · INCONSISTENT(페이지 사이 totalCount 변경 / 받은 행 > 총 건수) ·
    FAILED(첫 페이지부터 실패). rows 는 유효·중복 제거·상충 제외 행이고, 상충은 conflicts 에 따로 남는다.
    """
    normalize_date(bas_dt)
    raw_all, rows_all, rejected_all, page_meta = [], [], [], []
    totals, structure, status, reason, error = [], None, None, None, None
    out_of_range = code_mismatch = 0
    requested_at = received_at = request_path = None
    page = 1
    while True:
        if page > MAX_PAGES:
            status, reason = 'PARTIAL', 'PAGE_LIMIT'
            break
        try:
            rows, rejected, meta, structure_p = fetch_page(bas_dt=bas_dt, page_no=page, num_rows=num_rows,
                                                           budget=budget, **kwargs)
        except (compliance.LegalGateError, CredentialsMissing):
            raise
        except BudgetExhausted as exc:
            status, reason, error = ('PARTIAL' if page > 1 else 'FAILED'), 'BUDGET_EXHAUSTED', str(exc)[:160]
            break
        except contracts.ContractError as exc:
            status, reason, error = ('PARTIAL' if page > 1 else 'FAILED'), 'PAGE_FAILED', f'page {page}: {str(exc)[:140]}'
            break
        requested_at = requested_at or meta['requestedAt']
        received_at = meta['receivedAt']
        request_path = request_path or meta['requestPath']
        raw_all.extend(meta['rawItems'])
        rows_all.extend(rows)
        rejected_all.extend(rejected)
        out_of_range += meta['outOfRange']
        code_mismatch += meta['codeMismatch']
        totals.append(meta['totalCount'])
        page_meta.append({'pageNo': page, 'itemCount': meta['itemCount'], 'totalCount': meta['totalCount'],
                          'numOfRows': meta['numOfRows'], 'requestedNumOfRows': meta['requestedNumOfRows'],
                          'requestedAt': meta['requestedAt'], 'receivedAt': meta['receivedAt'], 'elapsedMs': meta['elapsedMs']})
        structure = structure_p if structure is None else _merge_structure(structure, structure_p)
        total = meta['totalCount']
        received = len(raw_all)
        if len({t for t in totals}) > 1:
            status, reason = 'INCONSISTENT', 'TOTAL_COUNT_CHANGED_BETWEEN_PAGES'
            break
        if total is None:
            # totalCount 가 없으면 0 으로 보지 않는다. 행이 요청 수만큼 가득 찼으면 다음 페이지를 보되, 결코 COMPLETE 로 적지 않는다.
            if meta['itemCount'] == 0 or meta['itemCount'] < int(num_rows):
                status, reason = 'UNKNOWN_TOTAL', 'TOTAL_COUNT_MISSING'
                break
            page += 1
            continue
        if received > total:
            status, reason = 'INCONSISTENT', 'RECEIVED_MORE_THAN_TOTAL'
            break
        if total == 0:
            status, reason = 'NO_DATA', 'ZERO_ROWS_REPORTED'      # 0건 응답은 '그 날 자료 없음'이지 완전한 하루가 아니다
            break
        if received == total:
            status = 'COMPLETE'
            break
        if meta['itemCount'] == 0:
            status, reason = 'PARTIAL', 'EMPTY_PAGE_BEFORE_TOTAL'
            break
        page += 1
    rows_all, duplicates_identical, conflicts = _dedupe(rows_all)
    if status is None:
        status, reason = 'PARTIAL', reason or 'UNKNOWN'
    total_reported = next((t for t in totals if t is not None), None)
    return {
        'basDt': str(bas_dt), 'tradingDate': normalize_date(bas_dt),
        'rows': rows_all, 'rejected': rejected_all, 'rawItems': raw_all,
        'pages': len(page_meta), 'pageMeta': page_meta, 'requests': len(page_meta) + (1 if error else 0),
        'totalCountReported': total_reported, 'totalCountConsistent': len({t for t in totals}) <= 1,
        'rawRowCount': len(raw_all), 'validRowCount': len(rows_all), 'rejectedCount': len(rejected_all),
        'outOfRange': out_of_range, 'codeMismatch': code_mismatch,
        'duplicatesIdentical': duplicates_identical, 'conflicts': conflicts,
        'structure': structure or structure_report([]),
        'completeness': {'status': status, 'reason': reason, 'error': error},
        'complete': status == 'COMPLETE',
        'allRowsValid': status == 'COMPLETE' and not rejected_all and not conflicts and out_of_range == 0 and code_mismatch == 0,
        'usable': status in ('COMPLETE', 'PARTIAL') and not conflicts and bool(rows_all),
        'requestedAt': requested_at, 'receivedAt': received_at, 'requestPath': request_path,
        'priceBasis': PRICE_BASIS, 'adjustmentStatus': ADJUSTMENT_STATUS, 'contractVersion': CONTRACT_VERSION,
    }


def _merge_structure(a, b):
    n_a, n_b = a.get('itemCount', 0), b.get('itemCount', 0)
    n = (n_a + n_b) or 1
    keys = set(a['fieldFillRatio']) | set(b['fieldFillRatio'])
    ratio = {k: round((a['fieldFillRatio'].get(k, 0) * n_a + b['fieldFillRatio'].get(k, 0) * n_b) / n, 3) for k in sorted(keys)}
    formats = {k: a['codeFormats'].get(k, 0) + b['codeFormats'].get(k, 0) for k in set(a['codeFormats']) | set(b['codeFormats'])}
    missing = sorted(set(a['requiredMissing']) | set(b['requiredMissing']))
    return {'fieldFillRatio': ratio, 'requiredMissing': missing, 'structureVerified': not missing and n > 0,
            'codeFormats': formats, 'itemCount': n_a + n_b}


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
            'portal': PORTAL_URL, 'metadata': METADATA_URL, 'service': f'{SERVICE_BASE}/{OPERATION}', 'latency': LATENCY,
            'priceBasis': PRICE_BASIS, 'adjustmentStatus': ADJUSTMENT_STATUS, 'license': LICENSE_NOTE,
            'requiredFields': list(REQUIRED_FIELDS),
            'replaces': sorted(FIELD_MAP.keys()), 'notReplaced': list(NOT_REPLACED),
            'quotaHints': QUOTA_HINTS,
            'callsPerTradingDay': 'MEASURED_AT_RUNTIME — 검증 보고서 perDay[].requests 를 본다(한 번에 전 종목이 온다고 가정하지 않는다)',
            'gate': {k: v for k, v in gate_state().items() if k in ('verdict', 'gates', 'state', 'commercialState')}}


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--fixture', action='store_true', help='합성 픽스처를 정규화해 요약만 출력(기본)')
    ap.add_argument('--live', action='store_true', help='실제 호출(게이트가 열려 있고 serviceKey 가 있을 때만)')
    ap.add_argument('--bas-dt', default=None, help='YYYYMMDD')
    ap.add_argument('--max-requests', type=int, default=5, help='--live 요청 상한(이번 실행의 상한 · 공식 한도 아님)')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args(argv)
    if args.live:
        if not args.bas_dt:
            print('--bas-dt YYYYMMDD 가 필요하다'); return 2
        budget = RequestBudget(args.max_requests)
        try:
            result = fetch_day(args.bas_dt, budget=budget)
        except compliance.LegalGateError as exc:
            print(f'LEGAL_GATE CLOSED: {exc}'); return 2
        except CredentialsMissing as exc:
            print(f'CREDENTIALS_MISSING: {exc}'); return 3
        except contracts.ContractError as exc:
            print(f'CONTRACT: {redact(exc, os.environ.get(KEY_ENV))}'); return 1
        summary = {'basDt': result['basDt'], 'rows': result['validRowCount'], 'rawRows': result['rawRowCount'],
                   'rejected': result['rejectedCount'], 'conflicts': len(result['conflicts']),
                   'pages': result['pages'], 'completeness': result['completeness'], 'structure': result['structure'],
                   'budget': budget.summary()}
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
