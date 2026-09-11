#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KIND 시장조치 제목 분류 — **기업행사 분류기를 그대로 쓰면 안 되기 때문에** 따로 둔다.

기업행사 분류기(corporate_action_classify)는 증자·합병·액면분할처럼 **기준가격과 주식 수를
바꾸는 사건**을 본다. 시장조치는 성격이 다르다. 공매도 과열종목 지정은 기준가격을 바꾸지도,
주식 수를 바꾸지도 않는다. 그것을 '미해결 기업행사' 로 세면 멀쩡한 종목이 영원히 막힌다.
실제로 기업행사 분류기에 시장조치 제목을 넣어 보면 openSelf 로 세어진다 — 그래서 분리했다.

여기서 하는 일은 딱 하나다. 제목이 **체결 안전에 영향을 주는 조치인지** 가른다.

    HALT        매매거래정지 · 정리매매 — 체결 자체가 막힌다
    LISTING     변경상장 · 재상장 · 상장폐지 — 기준가격과 주식 수가 바뀐다
    PRICE_BASIS 기준가격 조정 — 가격제한 계산의 뿌리가 바뀐다
    SINGLE      단일가매매 지정 — 체결 방식이 바뀐다(연속매매가 아니다)
    CAUTION     투자주의·경고·소수계좌·공매도 과열 — 거래는 계속되고 기준가격도 그대로다
    UNKNOWN     모르는 제목. **0건이 아니라 '사람이 봐야 한다' 다**

CAUTION 은 막지 않는다. 나머지 넷은 막는다. UNKNOWN 은 막고 사람에게 넘긴다.
이 표는 확정된 진리가 아니라 **지금까지 실제로 본 제목에 대한 보수적 판단**이다.
바꾸려면 실제 제목을 근거로 바꾼다 — 체결을 늘리려고 느슨하게 하지 않는다.
"""
import re

HALT = 'HALT'
LISTING = 'LISTING'
PRICE_BASIS = 'PRICE_BASIS'
SINGLE = 'SINGLE'
CAUTION = 'CAUTION'
UNKNOWN = 'UNKNOWN'

#: 막는 조치. CAUTION 만 빠진다.
BLOCKING = (HALT, LISTING, PRICE_BASIS, SINGLE, UNKNOWN)

CLASSIFIER_VERSION = 'kind-mktact-titles-v1'

#: 앞에서부터 먼저 맞는 것을 쓴다. 순서가 뜻이다 — 정지가 주의보다 무겁다.
RULES = (
    (HALT, ('매매거래정지', '거래정지', '정리매매', '매매거래 정지')),
    (LISTING, ('변경상장', '재상장', '상장폐지', '상장적격성', '신규상장')),
    (PRICE_BASIS, ('기준가격',)),
    (SINGLE, ('단일가매매', '단기과열')),
    (CAUTION, ('투자주의', '투자경고', '투자위험', '소수계좌', '공매도 과열', '공매도과열',
               '스팸관여', '불성실공시', '풍문')),
)
#: 조치가 풀린 것. 같은 조치의 '지정' 을 닫는다.
RELEASE = ('해제', '재개', '취소', '철회', '종료')
#: 아직 일어나지 않은 예고. 그 자체로는 조치가 아니지만 **무시하지도 않는다**(사람이 본다).
FORECAST = ('예고',)


def classify(title):
    """제목 한 줄 → 조치 갈래와 그 조치가 체결을 막는지."""
    text = ' '.join(str(title or '').split())
    effect = UNKNOWN
    for name, words in RULES:
        if any(word in text for word in words):
            effect = name
            break
    released = any(word in text for word in RELEASE)
    forecast = any(word in text for word in FORECAST) and not released
    return {'effect': effect, 'released': released, 'forecast': forecast,
            'blocks': effect in BLOCKING and not released,
            'needsDocument': effect == UNKNOWN,
            'title': text}


def summarize(findings):
    """행 묶음 → 남아 있는 조치 수. **'해제' 가 같은 갈래를 닫는다.**

    같은 갈래에서 가장 나중 것이 해제면 그 갈래는 지금 열려 있지 않다.
    날짜를 읽을 수 없으면 닫지 않는다 — 모를 때는 막는 쪽이다.
    """
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
    open_effects = sorted(name for name, last in latest.items()
                          if name in BLOCKING and not last['released'])
    return {'openEffects': open_effects,
            'openCount': len(open_effects),
            'caution': int(CAUTION in latest),
            'forecasts': forecasts,
            'uninterpreted': unknown,
            'effects': {name: last for name, last in sorted(latest.items())},
            'classifierVersion': CLASSIFIER_VERSION}
