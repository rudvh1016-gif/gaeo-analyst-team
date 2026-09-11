#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 시장조치 제목 분류 — **기업행사 분류기를 그대로 쓰면 안 되기 때문에** 따로 둔다.

기업행사 분류기(corporate_action_classify)는 증자·합병·액면분할처럼 **기준가격과 주식 수를
바꾸는 사건**을 본다. 시장조치는 성격이 다르다. 공매도 과열종목 지정은 기준가격을 바꾸지도,
주식 수를 바꾸지도 않는다. 그것을 '미해결 기업행사' 로 세면 멀쩡한 종목이 영원히 막힌다.
실제로 기업행사 분류기에 시장조치 제목을 넣어 보면 openSelf 로 세어진다 — 그래서 분리했다.

여기서 하는 일은 딱 하나다. 제목이 **체결 안전에 영향을 주는 조치인지** 가른다.

    HALT        매매거래정지 · 정리매매 — 체결 자체가 막힌다
    LISTING     변경상장 · 재상장 · 상장폐지 · 상장적격성 실질심사(개선기간 포함) — 기준가격과 주식 수가 바뀐다
    PRICE_BASIS 기준가격 조정 — 가격제한 계산의 뿌리가 바뀐다
    SINGLE      단일가매매 지정 — 체결 방식이 바뀐다(연속매매가 아니다)
    CAUTION     투자주의·경고·유의·소수계좌·공매도 과열 — 거래는 계속되고 기준가격도 그대로다
    ADMIN       업종변경처럼 거래·가격·주식수 어느 것도 바꾸지 않는 순수 행정 안내
    UNKNOWN     모르는 제목. **0건이 아니라 '사람이 봐야 한다' 다**

CAUTION·ADMIN 은 막지 않는다. 나머지 넷은 막는다. UNKNOWN 은 막고 사람에게 넘긴다.
이 표는 확정된 진리가 아니라 **지금까지 실제로 본 제목에 대한 보수적 판단**이다.
바꾸려면 실제 제목을 근거로 바꾼다 — 체결을 늘리려고 느슨하게 하지 않는다.

## 수명 방식 — "해제 문구가 나올 때까지 연다" 하나로 전부 처리하면 안 된다 (2026-09-11 실측 결함)

2026-09-11 실제 수집에서 '배당락 기준가격 안내'가 접수 후 1년 내내 '열린 조치'로 남는
결함이 드러났다. 배당락 기준가격 안내는 그 자체가 하루짜리 알림이고 **해제 문구가 원래
나오지 않는다** — 그런데 예전 코드는 모든 조치를 "해제 문구가 나올 때까지 연다"로 처리했다.
그래서 조치 갈래마다 수명 방식을 따로 둔다(`summarize()` 참고).
"""
import datetime
import re

import krx_calendar

HALT = 'HALT'
LISTING = 'LISTING'
PRICE_BASIS = 'PRICE_BASIS'
SINGLE = 'SINGLE'
CAUTION = 'CAUTION'
ADMIN = 'ADMIN'
UNKNOWN = 'UNKNOWN'

#: 막는 조치. CAUTION·ADMIN 만 빠진다.
BLOCKING = (HALT, LISTING, PRICE_BASIS, SINGLE, UNKNOWN)

#: 조치 갈래별 수명 방식. summarize() 가 "언제 닫히는지" 를 이 표로 결정한다.
DURATION_PERSISTENT = 'PERSISTENT'  # 지속형 — 공식 해제·재개·종료 근거가 나올 때까지 연다
DURATION_DAY = 'DAY'                # 하루형 — 접수일 하루만 연다. 다음날부터는 해제 문구 없이도 닫는다
DURATION_PERIOD = 'PERIOD'          # 기간형 — 제목에 적힌 공식 지정기간이 끝나면 닫는다.
                                     # 기간을 못 읽으면 PERSISTENT 와 동일하게 안전한 쪽(연다)으로 둔다.
EFFECT_DURATION = {
    HALT: DURATION_PERSISTENT,
    LISTING: DURATION_PERSISTENT,
    PRICE_BASIS: DURATION_DAY,
    SINGLE: DURATION_PERIOD,
}

KST = datetime.timezone(datetime.timedelta(hours=9))
CLASSIFIER_VERSION = 'kind-mktact-titles-v2'

#: 앞에서부터 먼저 맞는 것을 쓴다. 순서가 뜻이다 — 정지가 주의보다 무겁다.
RULES = (
    (HALT, ('매매거래정지', '거래정지', '정리매매', '매매거래 정지')),
    # 개선기간 부여·개선계획은 상장적격성 실질심사 제도의 절차 명칭이다(실질심사 대상 기업에
    # 개선기간을 주고 이행 여부를 심의하는 과정) — '상장적격성' 문구가 본문에 없어도 같은 갈래다.
    # '개선기간 종료' 처럼 뒤에 '종료' 가 붙는 제목은 여기 넣지 않는다 — RELEASE 판정과 겹쳐
    # "다 끝났다" 로 과도하게 읽힐 수 있고, 실제로는 다음 절차로 넘어간다는 뜻일 수도 있다.
    (LISTING, ('변경상장', '재상장', '상장폐지', '상장적격성', '신규상장', '개선기간 부여', '개선계획')),
    (PRICE_BASIS, ('기준가격',)),
    (SINGLE, ('단일가매매', '단기과열')),
    (CAUTION, ('투자주의', '투자경고', '투자위험', '투자유의', '소수계좌', '공매도 과열', '공매도과열',
               '스팸관여', '불성실공시', '풍문')),
    # 업종변경은 지수·분류 목적의 행정 안내다. 거래·기준가격·주식수 어느 것도 바꾸지 않는다.
    (ADMIN, ('업종변경',)),
)
#: 조치가 풀린 것. 같은 조치의 '지정' 을 닫는다. 수명 방식과 무관하게 항상 최우선으로 닫는다.
RELEASE = ('해제', '재개', '취소', '철회', '종료')
#: 아직 일어나지 않은 예고. 그 자체로는 조치가 아니지만 **무시하지도 않는다**(사람이 본다).
FORECAST = ('예고',)
#: 제목에 '3거래일'처럼 공식 지정기간이 실제로 적혀 있을 때만 읽는다. 못 찾으면 None —
#: 임의의 일수를 지어내지 않는다.
_PERIOD_DAYS_RE = re.compile(r'(\d+)\s*거래일')


def _period_days(title):
    match = _PERIOD_DAYS_RE.search(str(title or ''))
    return int(match.group(1)) if match else None


def _as_date(value):
    """'YYYYMMDD'류 문자열 → date. 못 읽으면 None — 지어내지 않는다."""
    if isinstance(value, datetime.date):
        return value
    digits = re.sub(r'\D', '', str(value or ''))[:8]
    if len(digits) != 8:
        return None
    try:
        return datetime.date(int(digits[:4]), int(digits[4:6]), int(digits[6:8]))
    except ValueError:
        return None


def classify(title):
    """제목 한 줄 → 조치 갈래와 그 조치가 체결을 막는지."""
    text = ' '.join(str(title or '').split())
    effect = UNKNOWN
    for name, words in RULES:
        if any(word in text for word in words):
            effect = name
            break
    # '해제' 는 어떤 조치가 풀렸다는 뜻이다. 그 조치 자체를 모르면(UNKNOWN) 무엇이
    # 풀렸는지도 모르는 것이다 — 제목에 우연히 '종료' 같은 낱말이 섞였다고 풀린 것으로
    # 읽지 않는다(2026-09-11 실측: '개선기간 종료 및 향후 절차 안내' 가 이 경로로 걸렸다).
    released = effect != UNKNOWN and any(word in text for word in RELEASE)
    forecast = any(word in text for word in FORECAST) and not released
    return {'effect': effect, 'released': released, 'forecast': forecast,
            'blocks': effect in BLOCKING and not released,
            'needsDocument': effect == UNKNOWN,
            'title': text}


def summarize(findings, as_of=None):
    """행 묶음 → 지금 시점에 남아 있는 조치 수.

    조치마다 수명이 다르다. 하나의 규칙("해제 문구가 나올 때까지 연다")으로 전부 처리하면
    배당락 기준가격 안내처럼 해제 문구가 원래 나오지 않는 하루짜리 안내가 1년 내내
    '열린 조치'로 남는다(2026-09-11 실측 결함). 그래서 `EFFECT_DURATION` 표를 따라 갈래마다
    다르게 닫는다.

        PERSISTENT(HALT·LISTING)  공식 해제·재개·종료 근거가 나올 때까지 연다.
        DAY(PRICE_BASIS)          접수일 하루만 연다. 배당락 기준가격은 그날의 가격제한
                                   계산에만 관련이 있고, 다음날부터는 전일 종가 자체가
                                   이미 그 값을 반영하므로 별도 해제 문구가 필요 없다.
        PERIOD(SINGLE)            제목에 'N거래일'처럼 공식 지정기간이 적혀 있으면
                                   krx_calendar 로 실제 거래일을 세어 그 기간이 끝난 뒤에
                                   닫는다. 기간을 못 읽으면 임의의 일수를 지어내지 않고
                                   PERSISTENT 와 똑같이 안전한 쪽(계속 연다)으로 둔다.

    '해제' 문구는 수명 방식과 무관하게 항상 최우선으로 닫는다.
    날짜를 읽을 수 없으면 닫지 않는다 — 모를 때는 막는 쪽이다.
    """
    as_of_date = _as_date(as_of) if as_of is not None else datetime.datetime.now(KST).date()
    if as_of_date is None:
        raise ValueError('as_of를 날짜로 읽을 수 없다: %r' % (as_of,))

    latest = {}
    unknown, forecasts = 0, 0
    for item in findings or []:
        info = classify(item.get('title') if isinstance(item, dict) else item)
        if info['effect'] == UNKNOWN:
            unknown += 1
            continue
        if info['forecast']:
            forecasts += 1
        when = str((item.get('receivedOn') if isinstance(item, dict) else '') or '')
        current = latest.get(info['effect'])
        if current is None or when >= current['when']:
            latest[info['effect']] = {'when': when, 'released': info['released'],
                                      'forecast': info['forecast'], 'title': info['title']}

    def _still_open(name, last):
        if last['released']:
            return False
        duration = EFFECT_DURATION.get(name, DURATION_PERSISTENT)
        if duration == DURATION_PERSISTENT:
            return True
        when_date = _as_date(last['when'])
        if when_date is None:
            return True  # 접수일을 못 읽으면 하루형·기간형도 지속형처럼 안전하게 연다
        if duration == DURATION_DAY:
            return when_date == as_of_date
        # DURATION_PERIOD
        days = _period_days(last['title'])
        if not days:
            return True  # 공식 지정기간을 제목에서 못 읽으면 지어내지 않고 연다
        period_end = _as_date(krx_calendar.future_trading_period(when_date.isoformat(), days)['periodEnd'])
        return period_end is None or period_end >= as_of_date

    open_effects = sorted(name for name, last in latest.items()
                          if name in BLOCKING and _still_open(name, last))
    return {'openEffects': open_effects,
            'openCount': len(open_effects),
            'caution': int(CAUTION in latest),
            'forecasts': forecasts,
            'uninterpreted': unknown,
            'effects': {name: last for name, last in sorted(latest.items())},
            'classifierVersion': CLASSIFIER_VERSION}
