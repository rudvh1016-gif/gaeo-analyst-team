#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 내부 데이터 계약 — 공급자가 누구든 분석가(TARO/DIANA/QUANT/FLOW/RISK/CHIEF)는 이 모양만 본다.

왜 있나 (2026-09-16 LEGAL DATA SUPPLY MIGRATION PHASE 1)
    네이버 응답 필드명(now·rate·marketSum·dealTrendInfos…)이 파이프라인 곳곳에 그대로 박혀 있으면
    공급자를 바꿀 때마다 분석가 코드를 고쳐야 한다. 여기서 "분석가가 실제로 읽는 최소 필드"를
    한 곳에 적어 두고, 새 공급자 어댑터는 이 계약으로만 변환한다. 분석가는 공급자 이름을 몰라도 된다.
    단, 출처(provenance)에는 실제 공급자를 그대로 적는다 — 이름을 바꿔 공식 근거로 위장하지 않는다.

계약의 근거(실제 코드가 읽는 키 — 추측이 아니라 grep 결과)
    · 일봉 한 봉: analysis_data.json stocks[code].daily[i] = {date, open, high, low, close, volume, frgnRate}
        compute_indicators.indicators_for() 는 close·volume·high·date 를, risk_for() 는 close 를,
        flow_summary() 는 date·volume·close 를, radar_signals 는 close·volume 을 읽는다.
        frgnRate 는 어떤 소비자도 읽지 않는다(LEGACY_UNUSED).
    · 시세 한 줄: data.js stocks[code] = {name, price, rate, per, pbr, roe, eps, div, cap, w52, stale}
        compute_indicators.main() 이 price·rate·stale·per·pbr·roe·eps·div·w52·cap 을 그대로 옮기고,
        analyze_auto.diana_eval() 이 per·pbr·roe·eps·w52 를, risk_for() 가 w52 를 읽는다.
    · 수급 한 행: analysis_data.json stocks[code].info.dealTrends[i]
        = {bizdate, foreignerPureBuyQuant, organPureBuyQuant, individualPureBuyQuant,
           foreignerHoldRatio, accumulatedTradingVolume, closePrice, ...}
        compute_indicators.flow_summary() 가 앞의 6개를 읽는다.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json

CONTRACT_VERSION = 'gaeo-internal-data-contract-v1'

#: 일봉(캔들) 한 봉. 키 이름은 analysis_data.json 의 daily 행과 같다.
DAILY_BAR_REQUIRED = ('date', 'open', 'high', 'low', 'close', 'volume')
#: 있으면 싣고 없으면 None 으로 둔다. 값을 지어내지 않는다.
DAILY_BAR_OPTIONAL = ('frgnRate', 'tradingValue', 'listedShares', 'marketCap')

#: 시세 한 줄(data.js stocks[code]).
QUOTE_FIELDS = ('name', 'price', 'rate', 'per', 'pbr', 'roe', 'eps', 'div', 'cap', 'w52', 'stale')
#: 시세 줄 중 가격 자료만으로는 못 채우는 것(재무·컨센서스 계열). 공급자가 안 주면 None 이다.
QUOTE_NON_PRICE_FIELDS = ('per', 'pbr', 'roe', 'eps', 'div', 'w52')

#: 수급 한 행. 키 이름은 analysis_data.json 의 dealTrends 행과 같다(네이버 필드명을 그대로 계약으로 굳혔다 —
#: 공급자를 바꾸면 어댑터가 이 이름으로 변환한다).
FLOW_ROW_REQUIRED = ('bizdate', 'foreignerPureBuyQuant', 'organPureBuyQuant',
                     'individualPureBuyQuant', 'foreignerHoldRatio', 'accumulatedTradingVolume')

#: 출처 기록. 값은 실제 공급자 그대로.
PROVENANCE_FIELDS = ('provider', 'dataset', 'requestPath', 'sourceSessionDate', 'sourceAsOf',
                     'receivedAt', 'excerptHash', 'officialSource', 'contractVersion')

#: 공급자가 주지 않는 값의 상태 어휘(가격 출처 원장 price_provenance.py 와 같은 표현).
NOT_PROVIDED_BY_SOURCE = 'NOT_PROVIDED_BY_SOURCE'


class ContractError(ValueError):
    """공급자 응답이 내부 계약으로 변환될 수 없다. 그 행으로는 아무것도 만들지 않는다."""


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def excerpt_hash(value, length=16):
    """자료가 같은지 확인하는 수단이지, 공식 출처를 인증하는 장치가 아니다."""
    return hashlib.sha256(_json(value).encode('utf-8')).hexdigest()[:length]


def cap_str(million_won):
    """시가총액(백만원) → data.js 의 'N조' 표기. update_prices.cap_str 와 같은 식이다(시험이 동일성을 잠근다)."""
    jo = million_won / 1_000_000
    return f'{jo:,.0f}조' if jo >= 10 else f'{jo:.1f}조'


def is_iso_date(value):
    if not isinstance(value, str) or len(value) != 10:
        return False
    try:
        dt.date.fromisoformat(value)
        return True
    except ValueError:
        return False


def validate_daily_bar(row):
    """계약 위반 목록을 돌려준다(빈 리스트 = 통과). 예외를 던지지 않는 이유: 호출자가 행 단위로 거를 수 있게."""
    problems = []
    if not isinstance(row, dict):
        return ['row is not a dict']
    for key in DAILY_BAR_REQUIRED:
        if key not in row:
            problems.append(f'missing {key}')
    if 'date' in row and not is_iso_date(row.get('date')):
        problems.append('date is not YYYY-MM-DD')
    for key in ('open', 'high', 'low', 'close', 'volume'):
        value = row.get(key)
        if key in row and not isinstance(value, (int, float)):
            problems.append(f'{key} is not a number')
        elif isinstance(value, (int, float)) and value < 0:
            problems.append(f'{key} is negative')
    if all(isinstance(row.get(k), (int, float)) for k in ('high', 'low', 'close', 'open')):
        if row['high'] < row['low']:
            problems.append('high < low')
        if not (row['low'] <= row['close'] <= row['high']):
            problems.append('close outside [low, high]')
        if not (row['low'] <= row['open'] <= row['high']):
            problems.append('open outside [low, high]')
    return problems


def validate_quote(row):
    problems = []
    if not isinstance(row, dict):
        return ['row is not a dict']
    for key in QUOTE_FIELDS:
        if key not in row:
            problems.append(f'missing {key}')
    if not isinstance(row.get('price'), (int, float)) or row.get('price', 0) <= 0:
        problems.append('price must be a positive number')
    if row.get('rate') is not None and not isinstance(row.get('rate'), (int, float)):
        problems.append('rate must be a number or None')
    if 'stale' in row and not isinstance(row.get('stale'), bool):
        problems.append('stale must be bool')
    return problems


def validate_flow_row(row):
    problems = []
    if not isinstance(row, dict):
        return ['row is not a dict']
    for key in FLOW_ROW_REQUIRED:
        if key not in row:
            problems.append(f'missing {key}')
    bizdate = str(row.get('bizdate') or '')
    if len(bizdate) != 8 or not bizdate.isdigit():
        problems.append('bizdate is not YYYYMMDD')
    return problems


def provenance(provider, dataset, request_path, source_session_date, received_at, excerpt,
               official_source, source_as_of=None):
    """출처 한 건. `provider` 는 실제로 응답을 준 쪽 이름이어야 한다."""
    return {
        'provider': provider,
        'dataset': dataset,
        'requestPath': request_path,
        'sourceSessionDate': source_session_date,
        'sourceAsOf': source_as_of,
        'receivedAt': received_at,
        'excerptHash': excerpt_hash(excerpt),
        'officialSource': bool(official_source),
        'contractVersion': CONTRACT_VERSION,
    }
