#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 실제 판단 성적표 — "그래서 돈이 됐나?" 한 곳에서 답하는 얇은 조립층.

## 이 파일이 하지 않는 것 (가장 중요하다)

**여기서 새로 채점하지 않는다.** 적중률·수익률·신뢰구간·표본 선별은 전부 이미 있는
코드가 낸 결과를 **읽어 모으기만** 한다. 같은 데이터로 적중률이 70.7% 와 51.2% 로 갈렸던
사고가 실제로 있었고(`compute_team_weights.score_call` 주석), 원인은 같은 계산을 두 곳에서
따로 구현한 것이었다. 그래서 이 파일에는 채점 공식이 **한 줄도 없다**.

    표본 선별·채점·구간   build_model_scoreboard.py  → model_scoreboard.js
    원장 품질·판단 분포    decision_quality.py        → model_scoreboard.js decisionTrace.quality
    채점 규칙 자체        compute_team_weights.score_call
    공개 최소 표본        build_model_scoreboard.MIN_UNIQUE_DATES

새 숫자가 필요하면 이 파일이 아니라 **위 원천을 고친다.**

## 왜 따로 있나

숫자는 이미 있는데 **흩어져 있어서** 아무도 "지금 성적이 뭐냐" 에 한 문장으로 답하지
못했다. 모델보드는 모델 5개를 나란히 놓고, 원장 품질은 분포를 보고, 사전등록은 10/19 를
기다린다. 이 파일은 그 조각들을 모아 **하나의 정직한 답**을 만든다 — 그 답이
"아직 말할 수 없다" 여도 그대로 낸다.

## 정직 규칙 (테스트가 잠근다 — test_real_outcome_scorecard.py)

1. **표본이 모자라면 숫자를 내지 않는다.** 판단일이 `MIN_UNIQUE_DATES` 미만인 구간의
   적중률은 성적표에 실리지 않는다. 모델보드가 `INSUFFICIENT_EVIDENCE` 라고 적어 두면
   이 파일은 그 말을 그대로 옮긴다.
2. **모델 버전을 섞지 않는다.** 지금 쓰는 모델과 옛 모델의 표본을 합쳐 판단일을 채우지
   않는다. 옛 모델 성적은 "지금 모델 성적이 아니다" 라고 이름표를 달고 따로 싣는다.
3. **SELL 을 공매도 손익으로 바꾸지 않는다.** GAEO 의 SELL 은 숏 진입이 아니라 보유
   청산·회피 신호다. "SELL 뒤 −10% 였으니 +10% 벌었다" 는 계산은 저장소에 없고 여기서도
   만들지 않는다. SELL 칸의 수익률은 **그 주식의 롱 수익률** 이며 부호를 뒤집지 않는다.
4. **비용을 뺀 순수익을 헤드라인으로 쓰지 않는다.** 판단 성적표용 비용 가정이 등록되지
   않았으므로(`config/scorecard_cost_assumption.json`) `COST_ASSUMPTION_NOT_REGISTERED`
   를 그대로 표시한다. 등록 전에 임의의 수수료를 빼지 않는다.
5. **읽지 못한 것을 정상으로 적지 않는다.** 산출물이 없거나 깨졌으면 `UNVERIFIED` 다.
   저장소의 교훈 ③ "모른다를 괜찮다로 바꾸지 마라" · ④ "모른다를 고장으로 바꾸지도 마라".

네트워크·LLM·쓰기 0. 읽기만 한다.
"""
import argparse
import datetime
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
SCHEMA = 'real-outcome-scorecard-v1'
SCOREBOARD_JS = 'model_scoreboard.js'
COST_CONFIG = os.path.join('config', 'scorecard_cost_assumption.json')

#: 성적표 전체 판정. 이 셋 말고 다른 말을 만들지 않는다.
MEASURED = 'MEASURED'                        # 공개 기준(판단일)을 넘겨 **측정값을 보여줄 수 있다**
#: ⚠️ MEASURED 는 '돈을 벌게 하는 실력이 입증됐다'가 아니다. 공개 최소 판단일을 넘긴 것과
#:    투자 우수성이 검증된 것은 다른 일이다. 우수성은 등록된 기준선과의 비교로만 말한다.
INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE'   # 기록은 있는데 아직 말할 수 없다
UNVERIFIED = 'UNVERIFIED'                    # 산출물을 못 읽었다 — 정상도 장애도 아니다

#: SELL 의 뜻. 이 선언을 코드로 박아 두는 이유는 §정직규칙 3 때문이다.
SELL_SEMANTICS = {
    'meaning': 'EXIT_OR_AVOID',
    'isShortEntry': False,
    'returnSignConvention': 'LONG_RETURN_OF_THE_STOCK',
    'note': 'SELL 은 보유를 정리하거나 사지 않는다는 신호다. 공매도 진입이 아니다. '
            'SELL 칸의 평균수익률은 그 주식의 롱 수익률이며 부호를 뒤집어 수익으로 바꾸지 않는다. '
            '적중 판정은 방향(하락했는가)으로만 한다 — compute_team_weights.score_call.',
}


def _read_js_object(repo, filename, varname):
    """자동 생성 JS 파일에서 객체 하나를 읽는다. 파서는 기존 것을 그대로 쓴다."""
    import build_model_scoreboard
    path = os.path.join(repo, filename)
    if not os.path.exists(path):
        return None, 'missing'
    try:
        obj = build_model_scoreboard.load_js_object(path, varname)
    except (OSError, ValueError) as exc:
        return None, f'unreadable:{type(exc).__name__}'
    # load_js_object 는 변수를 못 찾으면 조용히 None 을 준다. 그 None 을 그대로
    # 들고 가면 "오류 None" 이라는 말이 안 되는 보고가 나온다 — 이유를 붙인다.
    return (obj, None) if obj is not None else (None, 'unparseable')


def _segment(label, key, block, *, is_current):
    """모델보드의 horizon 블록 하나 → 성적표 구간 하나.

    ⚠️ 여기서 계산하는 것은 없다. 모델보드가 이미 낸 값을 옮기고, 낼 수 없다고 적어 둔
    구간은 숫자 칸을 비워 둔다(정직규칙 1).
    """
    status = block.get('status')
    seg = {
        'label': label, 'key': key, 'isCurrentModel': is_current,
        'status': status,
        'decisionDays': block.get('uniqueDates'),
        'maturedRecords': block.get('matured'),
        'pendingRecords': block.get('pending'),
        'withheldRecords': block.get('withheld', 0),
        'actionDistribution': block.get('actionDistribution') or {},
        'reason': block.get('reason'),
    }
    if status != 'OK':
        # 모델보드가 공개하지 않기로 한 구간이다. 숫자를 만들어 채우지 않는다.
        seg['accuracyPct'] = None
        seg['accuracyCI95'] = None
        seg['calls'] = None
        return seg
    seg['accuracyPct'] = block.get('overallAccuracy')
    seg['accuracyCI95'] = block.get('accuracyCI95')
    seg['directionalAccuracyPct'] = block.get('directionalAccuracy')
    seg['directionalCI95'] = block.get('directionalCI95')
    calls = {}
    for call in ('buy', 'hold', 'sell'):
        raw = block.get(call) or {}
        if not raw.get('count'):
            continue
        calls[call.upper()] = {
            'count': raw.get('count'),
            'precisionPct': raw.get('precision'),
            'meanReturnPct': raw.get('meanReturn'),
            'medianReturnPct': raw.get('medianReturn'),
            'marketRelativeMeanReturnPct': raw.get('marketRelativeMeanReturn'),
            'returnBasis': 'GROSS_BEFORE_COST',
        }
    if 'SELL' in calls:
        # 부호를 뒤집지 않았다는 사실을 값 옆에 붙여 둔다. 읽는 사람이 이 칸을
        # '공매도로 벌었다'로 읽는 것이 이 성적표의 가장 큰 오독 위험이다.
        calls['SELL']['semantics'] = SELL_SEMANTICS
    seg['calls'] = calls
    return seg


def _ci_excludes_5050(ci):
    """95% 구간이 50%를 비켜 갔는가.

    ⚠️ 이 값은 **구간의 위치를 알려주는 사실**일 뿐, 실력 판정이 아니다.
    전체 적중률의 분모는 BUY·HOLD·SELL 이 섞여 있고 셋의 적중 정의가 서로 다르다
    (BUY 는 ret>+1, SELL 은 ret<-1, HOLD 는 |ret|<=5). 특히 HOLD 는 판단의 72% 를
    차지하면서 "크게 안 움직이면 적중" 이라 기준선 자체가 50% 가 아니다.
    그래서 50% 를 동전 던지기 기준선으로 삼아 우수성을 판정하지 않는다
    (2026-09-15 정정 — 그 전에는 '동전 던지기와 구분되지 않는다'고 단정했다).
    """
    if not ci or len(ci) != 2 or any(v is None for v in ci):
        return None
    return ci[0] > 50.0 or ci[1] < 50.0


#: 전체 적중률에 붙일 수 있는 **등록된 비교 기준선**. 지금은 없다.
#: 결과를 본 뒤 유리한 기준선을 고르는 것을 막기 위해, 기준선은 등록으로만 생긴다.
BASELINE_NOT_REGISTERED = 'BASELINE_NOT_REGISTERED'


def _accuracy_phrase(seg, short=False):
    """적중률 구간을 **사실 그대로** 설명한다. 우수성 판정을 하지 않는다."""
    ci = seg.get('accuracyCI95')
    if not ci or any(v is None for v in ci):
        return '구간을 낼 표본이 아니다'
    where = ('95% 구간이 50%를 비켜 갔다' if _ci_excludes_5050(ci) else '95% 구간이 50%를 품는다')
    if short:
        return where + '(50%는 이 성적의 기준선이 아니다)'
    return (where + ' — 다만 분모에 BUY·HOLD·SELL 이 섞여 있어 50%는 이 성적의 '
            '기준선이 아니다(비교 기준선 미등록)')


def cost_assumption(repo=HERE):
    """등록된 거래비용 가정을 읽는다. 없으면 없다고 말한다 — 지어내지 않는다."""
    path = os.path.join(repo, COST_CONFIG)
    if not os.path.exists(path):
        return {'status': 'COST_ASSUMPTION_NOT_REGISTERED', 'registered': False,
                'reason': 'config_missing', 'configPath': COST_CONFIG}
    try:
        doc = json.loads(open(path, encoding='utf-8').read())
    except (OSError, ValueError):
        return {'status': 'COST_ASSUMPTION_NOT_REGISTERED', 'registered': False,
                'reason': 'config_unreadable', 'configPath': COST_CONFIG}
    if not doc.get('registered'):
        return {'status': 'COST_ASSUMPTION_NOT_REGISTERED', 'registered': False,
                'reason': doc.get('why'), 'configPath': COST_CONFIG,
                'ownerDecisionRequired': doc.get('ownerDecisionRequired') or [],
                'referenceOnly': doc.get('referenceOnly')}
    # ⚠️ 등록됐다는 것과 이 성적표가 실제로 비용을 빼고 계산했다는 것은 다른 일이다.
    #    성적표는 아직 gross 숫자를 모델보드에서 그대로 옮기므로 기본은 False 다.
    return {'status': 'COST_ASSUMPTION_REGISTERED', 'registered': True,
            'configPath': COST_CONFIG, 'model': doc.get('model'),
            'appliesFrom': doc.get('appliesFrom'),
            'appliedInCalculation': bool(doc.get('appliedInCalculation'))}


def _horizon_states(base):
    """horizon 별로 **없는 것**과 **결과를 기다리는 것**을 구분해 둔다.

    NOT_APPLICABLE(이 구간에 해당 없음)과 PENDING_NOT_MATURED(결과 미도래)와
    INSUFFICIENT_EVIDENCE(표본 부족)는 서로 다른 말이다. 셋을 "0건" 한마디로 뭉치면
    읽는 사람이 "없다"와 "아직이다"를 구분하지 못한다.
    """
    out = {}
    for key, block in sorted((base.get('horizons') or {}).items()):
        out[key] = {'status': block.get('status'), 'matured': block.get('matured'),
                    'pending': block.get('pending'), 'decisionDays': block.get('uniqueDates')}
    return out


def _horizon_limits(horizons):
    """horizon 상태에서 한계 문장을 만든다. 어느 것도 하드코딩하지 않는다."""
    lines = []
    for key, h in sorted(horizons.items(), key=lambda kv: int(kv[0]) if kv[0].isdigit() else 0):
        status, matured, pending = h.get('status'), h.get('matured'), h.get('pending')
        if status == 'NOT_APPLICABLE':
            lines.append('%sD 는 이 구간에 해당하지 않는다(집계 대상이 아니다).' % key)
        elif status == 'PENDING_NOT_MATURED':
            lines.append('%sD 는 채점된 기록이 %s건이고 %s건이 결과를 기다린다 — '
                         '표본이 부족한 것이 아니라 아직 결과가 오지 않았다.'
                         % (key, matured or 0, pending or 0))
        elif status == 'INSUFFICIENT_EVIDENCE':
            lines.append('%sD 는 판단일 %s일로 공개 기준에 못 미쳐 숫자를 내지 않는다.'
                         % (key, h.get('decisionDays')))
    return lines


def _cost_limit(cost):
    """비용 한계 문장. **등록 여부와 실제 적용 여부를 구분한다.**

    registered=true 만으로 순수익 표시를 켜지 않는다 — 등록해 놓고 계산에 반영하지
    않았으면 숫자는 여전히 비용 반영 전(gross)이다.
    """
    if not cost.get('registered'):
        return '수익률은 전부 거래비용 반영 전(gross)이다 — 비용 가정이 등록되지 않았다.'
    if not cost.get('appliedInCalculation'):
        return ('수익률은 전부 거래비용 반영 전(gross)이다 — 비용 가정은 등록됐지만 '
                '아직 이 성적표의 계산에 반영되지 않았다.')
    return '수익률에 등록된 거래비용이 반영돼 있다(%s).' % (cost.get('appliesFrom') or '적용 시작일 미기재')


def build(repo=HERE, now=None):
    """성적표 한 장. 판정은 MEASURED / INSUFFICIENT_EVIDENCE / UNVERIFIED 셋뿐이다."""
    from build_model_scoreboard import MIN_UNIQUE_DATES
    now = now or datetime.datetime.now(datetime.timezone.utc)
    out = {'schemaVersion': SCHEMA, 'generatedAt': now.isoformat(),
           'minDecisionDaysToPublish': MIN_UNIQUE_DATES,
           'sellPolicy': SELL_SEMANTICS,
           'costAssumption': cost_assumption(repo),
           'sources': {}, 'segments': [], 'ledgers': {}, 'limits': []}

    board, err = _read_js_object(repo, SCOREBOARD_JS, 'MODEL_SCOREBOARD')
    out['sources'][SCOREBOARD_JS] = {'read': board is not None, 'error': err,
                                     'generatedAt': (board or {}).get('generatedAt')}
    if board is None:
        out['verdict'] = UNVERIFIED
        out['headline'] = ('성적을 확인하지 못했다 — %s 를 읽지 못했다(%s). '
                           '이것은 "성적이 없다"도 "정상"도 아니다.' % (SCOREBOARD_JS, err))
        return out

    base = next((m for m in (board.get('models') or []) if m.get('id') == 'base_production'), None)
    if not base:
        out['verdict'] = UNVERIFIED
        out['headline'] = ('성적을 확인하지 못했다 — %s 안에 실제 운영 모델(base_production) '
                           '구간이 없다.' % SCOREBOARD_JS)
        return out

    current_version = base.get('currentModelVersion')
    out['currentModelVersion'] = current_version
    out['gradingPolicyVersion'] = board.get('gradingPolicyVersion')
    out['recordCount'] = base.get('recordCount')
    out['withheldCount'] = base.get('withheldCount')

    # 구간은 모델 버전으로 나눈다. 판단일을 채우려고 합치지 않는다(정직규칙 2).
    for key, block in sorted((base.get('byModelVersion') or {}).items()):
        is_current = key == current_version
        label = ('지금 쓰는 모델' if is_current else '지금 쓰는 모델이 아님(옛 구간)')
        out['segments'].append(_segment(label, key, block, is_current=is_current))

    if not out['segments']:
        # 산출물은 읽혔는데 구간이 하나도 없다. 이건 "기록이 모자라다"가 아니라
        # **읽은 것이 비어 있다**는 뜻이다 — 둘을 같은 말로 적으면 없는 기록을
        # 있는 것처럼 읽게 된다(교훈 ③).
        out['verdict'] = UNVERIFIED
        out['headline'] = ('성적을 확인하지 못했다 — %s 의 실제 운영 모델에 모델 버전 구간이 '
                           '하나도 없다. 기록이 모자란 것과 다르다.' % SCOREBOARD_JS)
        return out

    current = next((s for s in out['segments'] if s['isCurrentModel']), None)
    measured = [s for s in out['segments'] if s['status'] == 'OK']
    # ⚠️ 판정은 **지금 쓰는 모델** 기준이다. 옛 구간에 판단일이 충분해도 그것으로
    #    "성적을 말할 수 있다" 고 하지 않는다 — 지금 사이트에 나오는 판단은 그 모델이
    #    아니기 때문이다. 이 줄이 없으면 맨 윗줄만 읽은 사람이 옛 성적을 현재 성적으로
    #    읽는다(정직규칙 2의 실제 위험).
    out['verdict'] = MEASURED if (current and current['status'] == 'OK') else INSUFFICIENT_EVIDENCE

    # 원장이 둘이라는 사실을 숨기지 않는다 — 둘은 성숙 시점이 다르다.
    trace = (board.get('decisionTrace') or {})
    horizon5 = ((trace.get('byModelVersion') or {}).get(current_version) or {}).get('horizons', {}).get('5', {})
    evaluated = horizon5.get('evaluated')
    sealed_what = '봉인된 판단 원본.'
    if evaluated is None:
        sealed_what += ' 채점 건수를 읽지 못했다(확인 불가).'
    elif evaluated == 0:
        sealed_what += ' 아직 한 건도 채점되지 않았다.'
    else:
        sealed_what += ' %s건이 채점됐다.' % evaluated
    out['ledgers'] = {
        'gradedNow': {'source': 'history.js → build_model_scoreboard',
                      'what': '매일 쌓인 자동판단. 지금 성적을 내는 것은 이쪽이다.',
                      'maturedRecords': base.get('maturedCount'),
                      'decisionDays': base.get('uniquePredictionDates')},
        'sealedOriginals': {'source': 'research_archive/decisions/ → decision_records',
                            'what': sealed_what,
                            'dailyRecords': trace.get('dailyRecordCount'),
                            'decisionDays': trace.get('uniqueDecisionDays'),
                            'evaluated': evaluated,
                            'pending': horizon5.get('pending'),
                            'comparisonStates': (trace.get('comparison') or {}).get('states')},
    }

    # ⚠️ 여기 문장들은 **오늘의 값에서 만든다.** 지금 사실을 영원한 사실처럼 박아 두면
    #    상황이 바뀐 날 성적표가 조용히 거짓말을 한다(2026-09-15 정정).
    out['horizons'] = _horizon_states(base)
    out['limits'] = [
        _cost_limit(out['costAssumption']),
        '결과 가격은 판단일 다음 N번째 거래일 종가다. 기간 중 최대 낙폭이 아니다.',
        '같은 날 600종목은 독립 시행이 아니다. 구간은 판단일 블록 부트스트랩으로만 낸다.',
        '기업행사 확인이 안 된 종목은 채점에서 빠진다 — 정지·상장 이슈 종목이 분모에서 '
        '빠지므로 남은 표본이 실제보다 순해 보일 수 있다(생존편향).',
    ] + _horizon_limits(out['horizons'])

    _verdict_phrase = _accuracy_phrase

    if out['verdict'] == MEASURED:
        out['headline'] = ('지금 쓰는 모델(%s): 전체 적중률 %s%% · 판단일 %s일 · %s'
                           % (current['key'], current['accuracyPct'],
                              current['decisionDays'], _verdict_phrase(current)))
    else:
        days = (current or {}).get('decisionDays')
        short = (MIN_UNIQUE_DATES - days) if isinstance(days, int) else None
        head = ('아직 성적을 말할 수 없다. 지금 쓰는 모델의 판단일이 %s일이라 공개 기준 %d일에 '
                '%s 모자란다.' % (days, MIN_UNIQUE_DATES,
                                  f'{short}일' if short and short > 0 else '아직'))
        old_ok = [s for s in measured if not s['isCurrentModel']]
        if old_ok:
            seg = old_ok[0]
            head += (' 옛 구간(%s)에는 판단일 %s일치가 있지만 전체 %s%% 이고(%s), 무엇보다 '
                     '지금 사이트에 나오는 판단이 아니다.'
                     % (seg['key'], seg['decisionDays'], seg['accuracyPct'], _accuracy_phrase(seg, short=True)))
        out['headline'] = head
    return out


def _fmt_ci(ci):
    return '없음' if not ci else '%.1f~%.1f%%' % (ci[0], ci[1])


def render(card):
    """사람이 읽는 요약. 숫자를 만들지 않고 build() 결과만 옮긴다."""
    L = []
    verdict_ko = {MEASURED: '성적을 말할 수 있음', INSUFFICIENT_EVIDENCE: '아직 말할 수 없음',
                  UNVERIFIED: '확인 불가'}[card['verdict']]
    L.append('GAEO 실제 판단 성적표 — %s' % verdict_ko)
    L.append('=' * 58)
    L.append(card['headline'])
    L.append('')
    if card['verdict'] == UNVERIFIED:
        L.append('먼저 `python3 build_model_scoreboard.py` 가 만든 %s 가 있는지 확인한다.' % SCOREBOARD_JS)
        return '\n'.join(L)

    L.append('[구간별] — 모델 버전을 섞지 않는다. 판단일을 채우려고 합치지 않는다.')
    for seg in card['segments']:
        L.append('  · %s  %s' % (seg['key'], seg['label']))
        L.append('    판단일 %s일 · 채점된 기록 %s건 · 결과 대기 %s건 · 판단보류 %s건'
                 % (seg['decisionDays'], seg['maturedRecords'], seg['pendingRecords'],
                    seg['withheldRecords']))
        if seg['status'] != 'OK':
            L.append('    → %s%s' % (seg['status'], ' · ' + seg['reason'] if seg.get('reason') else ''))
            continue
        L.append('    전체 적중률 %s%% (95%% 구간 %s)'
                 % (seg['accuracyPct'], _fmt_ci(seg.get('accuracyCI95'))))
        L.append('      → %s' % _accuracy_phrase(seg))
        for name, call in sorted((seg.get('calls') or {}).items()):
            tail = ''
            if name == 'SELL':
                tail = '  ※ 이 수익률은 그 주식의 롱 수익률이다(공매도 손익 아님)'
            L.append('    %-4s %5s건 · 적중 %s%% · 평균 %s%% · 시장대비 %s%%%s'
                     % (name, call['count'], call['precisionPct'], call['meanReturnPct'],
                        call['marketRelativeMeanReturnPct'], tail))
    L.append('')
    ledg = card['ledgers']
    L.append('[원장 둘] — 성숙 시점이 달라서 숫자가 다르다')
    L.append('  · 지금 채점 중: %s건 채점 · 판단일 %s일 (%s)'
             % (ledg['gradedNow']['maturedRecords'], ledg['gradedNow']['decisionDays'],
                ledg['gradedNow']['source']))
    L.append('  · 봉인 원본:   %s건 중 채점 %s건 · 대기 %s건 (%s)'
             % (ledg['sealedOriginals']['dailyRecords'], ledg['sealedOriginals']['evaluated'],
                ledg['sealedOriginals']['pending'], ledg['sealedOriginals']['source']))
    L.append('')
    cost = card['costAssumption']
    L.append('[거래비용] %s' % cost['status'])
    if not cost['registered']:
        ref = cost.get('referenceOnly') or {}
        L.append('  등록된 가정이 없어 위 수익률은 전부 비용 반영 전이다.')
        if ref.get('roundTripPct') is not None:
            L.append('  참고: 은퇴한 모의투자 엔진의 실제 요율은 왕복 %s%% 였다(%s). 적용하지 않았다.'
                     % (ref['roundTripPct'], ref.get('source')))
    L.append('')
    L.append('[한계]')
    for line in card['limits']:
        L.append('  - ' + line)
    return '\n'.join(L)


def main(argv=None):
    ap = argparse.ArgumentParser(description='GAEO 실제 판단 성적표(읽기 전용·LLM 0·네트워크 0)')
    ap.add_argument('--json', action='store_true', help='기계용 JSON 으로 출력')
    ap.add_argument('--repo', default=HERE)
    args = ap.parse_args(argv)
    card = build(args.repo)
    print(json.dumps(card, ensure_ascii=False, indent=1) if args.json else render(card))
    # 표본 부족은 장애가 아니다(교훈 ④). 못 읽은 것만 2 로 구분한다(교훈 ③).
    return 2 if card['verdict'] == UNVERIFIED else 0


if __name__ == '__main__':
    raise SystemExit(main())
