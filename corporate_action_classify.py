#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공시 제목을 사건 단위로 분류한다 — '발견' 과 '현재 미해결' 은 다르다.

2026-09-11 첫 수집에서 62건이 나왔는데 그대로 세면 안 되는 것들이 섞여 있었다.
  · 25건이 [기재정정]·[첨부정정] — 같은 사건의 정정이지 새 사건이 아니다.
  · '종속회사의주요경영사항'·'자회사의 주요경영사항' — 그 회사가 아니라 자회사 사안이다.
  · '합병등종료보고서'·'증권발행실적보고서' — 사건의 결과·종료를 알리는 문서다.

**제목만으로 끝내지 않는다.** 제목으로 확실히 가를 수 있는 것만 가르고, 나머지는 본문 확인이
필요하다고 표시한다(needsDocument). 확인 못 한 것을 '해당 없음' 으로 넘기지 않는다.
"""
import re

#: 사건이 누구 것인가
SELF = 'SELF'                  # 이 회사·이 주식의 사건
SUBSIDIARY = 'SUBSIDIARY'      # 종속회사·자회사·타법인 사안 — 이 주식의 기준가격을 바꾸지 않는다
#: 문서가 사건의 어느 단계인가
DECISION = 'DECISION'          # 결정·발표
CORRECTION = 'CORRECTION'      # 같은 사건의 정정 — 새 사건이 아니다
RESULT = 'RESULT'              # 발행실적 등 결과 보고
COMPLETION = 'COMPLETION'      # 종료보고서
NOTICE = 'NOTICE'              # 시장안내 등
#: 무엇에 영향을 줄 수 있는가
PRICE, TRADABLE, SHARES, LISTING = 'PRICE', 'TRADABLE', 'SHARES', 'LISTING'

SUBSIDIARY_MARKS = ('종속회사', '자회사', '타법인')
CORRECTION_MARKS = ('[기재정정]', '[첨부정정]', '[정정]', '기재정정', '첨부정정')
#: 낱말 → 영향. 여기 없는 낱말은 분류하지 않고 본문 확인으로 넘긴다.
EFFECTS = {
    '무상증자': (PRICE, SHARES), '주식배당': (PRICE, SHARES), '액면': (PRICE, SHARES),
    '감자': (PRICE, SHARES), '합병': (PRICE, SHARES, LISTING), '분할': (PRICE, SHARES, LISTING),
    '주식교환': (SHARES, LISTING), '주식이전': (SHARES, LISTING),
    '유상증자': (SHARES,),        # 기준가격 조정은 권리락일에 일어난다 — 발행만으로는 SHARES 다
    '권리락': (PRICE,), '공개매수': (SHARES,),
    '상장폐지': (LISTING, TRADABLE), '거래정지': (TRADABLE,), '매매거래정지': (TRADABLE,),
}
#: 같은 사건의 단계를 묶는 열쇠. 정정·결과·종료를 결정과 한 사건으로 모은다.
FAMILY = ('합병', '분할', '감자', '액면', '무상증자', '유상증자', '주식배당',
          '주식교환', '주식이전', '공개매수', '권리락', '상장폐지', '거래정지')


def _terms(title):
    return [t for t in FAMILY if t in title]


def classify(title):
    """제목 한 줄 → 분류. 판정하지 않는다 — 부르는 쪽이 모아서 결정한다."""
    text = (title or '').strip()
    marks = _terms(text)
    subject = SUBSIDIARY if any(m in text for m in SUBSIDIARY_MARKS) else SELF
    if any(m in text for m in CORRECTION_MARKS):
        stage = CORRECTION
    elif '종료보고' in text:
        stage = COMPLETION
    elif '실적보고' in text or '발행결과' in text:
        stage = RESULT
    elif '시장안내' in text or '안내' in text:
        stage = NOTICE
    else:
        stage = DECISION
    effects = sorted({e for m in marks for e in EFFECTS.get(m, ())})
    # 제목에 정지와 해제가 함께 있으면 어느 쪽이 지금 상태인지 제목만으로 알 수 없다.
    ambiguous = ('정지' in text and '해제' in text) or not marks
    return {'title': text, 'subject': subject, 'stage': stage, 'terms': marks,
            'effects': effects, 'family': marks[0] if marks else None,
            'needsDocument': bool(ambiguous)}


def summarize(findings):
    """사건 단위 집계. 반환: {'events': [...], 'openSelf': n, 'needsDocument': n, 'subsidiary': n}

    한 사건(같은 family) 안에서 결정·정정·결과·종료를 한 줄로 모은다.
    종료보고서가 있으면 '회사 쪽 행사는 끝났다' 까지만 말한다 — 거래소의 변경상장·거래재개
    반영은 별개이므로 exchangeConfirmed 는 항상 False 로 둔다(확인 경로가 아직 없다).
    """
    groups = {}
    needs = 0
    for item in findings or []:
        title = item.get('title') if isinstance(item, dict) else str(item)
        info = classify(title)
        needs += info['needsDocument']
        key = (info['subject'], info['family'])
        group = groups.setdefault(key, {'subject': info['subject'], 'family': info['family'],
                                        'stages': set(), 'effects': set(), 'ids': [],
                                        'needsDocument': False})
        group['stages'].add(info['stage'])
        group['effects'].update(info['effects'])
        group['needsDocument'] = group['needsDocument'] or info['needsDocument']
        if isinstance(item, dict) and item.get('id'):
            group['ids'].append(item['id'])
    events = []
    for group in groups.values():
        completed = COMPLETION in group['stages']
        events.append({
            'subject': group['subject'], 'family': group['family'],
            'stages': sorted(group['stages']), 'effects': sorted(group['effects']),
            'documentCount': len(group['ids']), 'ids': sorted(group['ids'])[:20],
            'companyCompleted': completed,
            # 거래소 반영(변경상장·거래재개·새 기준가격)은 별도 확인이 필요하다. 지금은 경로가 없다.
            'exchangeConfirmed': False,
            'needsDocument': group['needsDocument'],
            # 이 주식의 체결·장부를 지금도 막아야 하는가
            'open': group['subject'] == SELF and bool(group['effects'])})
    return {'events': sorted(events, key=lambda e: (e['subject'], e['family'] or '')),
            'openSelf': sum(1 for e in events if e['open']),
            'subsidiary': sum(1 for e in events if e['subject'] == SUBSIDIARY),
            'needsDocument': needs}
