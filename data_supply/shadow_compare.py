#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""오프라인 그림자 비교(OFFLINE SHADOW) — 공급자를 바꾸면 GAEO 판단이 어떻게 달라지는지 **Production 을 건드리지 않고** 잰다.

두 가지 비교를 한다.
  1. 공급자 값 대조   compare_daily_series(): 같은 종목·같은 거래일의 시가·고가·저가·종가·거래량을 필드별로 대조한다.
                        다르면 어느 쪽이 정답이라고 단정하지 않는다(네이버가 정답이 아니다). 정의·기준시각·단위 차이를 함께 적는다.
  2. 판단 영향 비교   run_decision_shadow(): 현재 Production 입력(indicators.json · analysis_data.json · data.js · team_weights.js ·
                        model_intelligence.js)을 읽어 baseline 을 만들고, 시나리오별로 입력만 바꿔 TARO/DIANA/QUANT/FLOW/CHIEF 를
                        analyze_auto 의 **같은 함수**로 다시 계산해 점수 차이·판정(BUY/HOLD/SELL) 변화를 센다.

시나리오(공식·무료 공급원으로 옮겼을 때 실제로 생기는 변화만 흉내 낸다)
  lag1_official_close          T+1 공식 자료만 있을 때: 마지막 봉 1개 제거 · 가격 = 직전 확정 종가 · PER/PBR·목표가 괴리는 그 가격으로 재계산
  no_consensus                 컨센서스(목표주가·추정EPS·투자의견) 없음 — 무료 공식 대체가 없다
  no_flow                      수급(외국인·기관·개인) 없음 — 무료 공식 대체가 없다 → CHIEF 가 3축으로 재정규화
  per_pbr_from_close_eps_bps   PER/PBR 을 종가÷EPS·BPS 로 재계산(재무 계열을 DART 로 옮길 때의 정의 차이 하한)
  official_free_only           위 넷을 전부 겹친 것 = "법적 허용이 명확한 무료 공식 자료만 쓰면" 의 근사

이 파일이 하지 않는 것
  · data.js·analysis_data.json·indicators.json·auto_analysis.js 를 쓰지 않는다(읽기만).
  · 네트워크 호출 0. 산식·가중치·임계값을 바꾸지 않는다(analyze_auto 의 함수를 그대로 부른다).
  · 종목별 원자료 값을 보고서에 싣지 않는다(집계·점수 차이·판정 변화·종목코드만).

쓰는 법
  python3 -m data_supply.shadow_compare                     # 전체 시나리오 → 임시 폴더에 JSON+Markdown
  python3 -m data_supply.shadow_compare --out DIR --scenarios lag1_official_close no_flow
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import json
import os
import statistics
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import analyze_auto as A                 # noqa: E402  (함수만 쓴다 · main() 은 부르지 않는다)
import compute_indicators as CI          # noqa: E402
from data_supply import contracts        # noqa: E402

SHADOW_VERSION = 'data-supply-shadow-v1'
SCENARIOS = {
    'lag1_official_close': 'T+1 공식 자료만 있을 때(마지막 봉 제거 · 가격=직전 확정 종가 · PER/PBR/목표가 괴리 재계산)',
    'no_consensus': '컨센서스(목표주가·추정EPS·투자의견) 없음',
    'no_flow': '수급(외국인·기관·개인) 없음 → CHIEF 3축 재정규화',
    'per_pbr_from_close_eps_bps': 'PER/PBR 을 종가÷EPS·BPS 로 재계산(DART 재구성 시 정의 차이)',
    'official_free_only': 'lag1 + no_consensus + no_flow + per_pbr 재계산(무료 공식 자료만 쓸 때의 근사)',
}
COMPONENTS = ('taro', 'diana', 'nova', 'flow')
CALLS = ('BUY', 'HOLD', 'SELL', A.JUDGMENT_WITHHELD)


# ── 1. 공급자 값 대조 ─────────────────────────────────────────────────────────
DEFINITION_NOTES = {
    'close': '네이버 now 는 장중 현재가·siseJson 종가는 그날 확정치 / 공식 clpr 는 T+1 확정 종가. 같은 거래일의 확정치끼리만 비교한다.',
    'volume': '주 단위. 장중 수집분은 누적 중이라 확정치보다 작다. 확정치끼리 비교한다.',
    'open': '시가. 정의 동일(당일 첫 체결가).',
    'high': '고가. 정의 동일.',
    'low': '저가. 정의 동일.',
    'date': '네이버 siseJson 은 YYYYMMDD 문자열, 공식 basDt 도 YYYYMMDD. 내부 계약은 YYYY-MM-DD.',
    'marketCap': '네이버 marketSum 은 백만원, 공식 mrktTotAmt 는 원. 단위를 맞춘 뒤 비교한다.',
    'adjustment': '양쪽 다 조정주가 여부가 원문으로 확인되지 않았다. 기업행사(분할·병합·권리락)가 있는 창은 비교에서 제외한다.',
}


def _index(series):
    """[{date,…}] → {date: row}. 날짜가 없는 행은 세지 않는다."""
    return {row['date']: row for row in (series or []) if isinstance(row, dict) and row.get('date')}


def compare_daily_series(reference, candidate, fields=('open', 'high', 'low', 'close', 'volume'),
                         rel_tolerance=0.0):
    """두 공급자의 {code: [일봉…]} 를 대조한다. 반환은 집계와 불일치 목록(종목코드·날짜·필드·상대차)이다.

    어느 쪽도 정답으로 두지 않는다. 필드 값은 보고서에 싣지 않고 상대 차이(%)만 싣는다.
    """
    codes_ref, codes_cand = set(reference or {}), set(candidate or {})
    out = {'shadowVersion': SHADOW_VERSION, 'fields': list(fields), 'relTolerancePct': rel_tolerance,
           'codesBoth': sorted(codes_ref & codes_cand), 'codesOnlyReference': sorted(codes_ref - codes_cand),
           'codesOnlyCandidate': sorted(codes_cand - codes_ref),
           'datesOnlyReference': 0, 'datesOnlyCandidate': 0, 'pairsCompared': 0,
           'fieldStats': {f: {'compared': 0, 'mismatch': 0, 'maxAbsRelPct': 0.0} for f in fields},
           'mismatches': [], 'definitionNotes': DEFINITION_NOTES}
    for code in out['codesBoth']:
        ref, cand = _index(reference[code]), _index(candidate[code])
        out['datesOnlyReference'] += len(set(ref) - set(cand))
        out['datesOnlyCandidate'] += len(set(cand) - set(ref))
        for date in sorted(set(ref) & set(cand)):
            out['pairsCompared'] += 1
            for field in fields:
                a, b = ref[date].get(field), cand[date].get(field)
                if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
                    continue
                stat = out['fieldStats'][field]
                stat['compared'] += 1
                rel = abs(a - b) / abs(a) * 100 if a else (0.0 if b == 0 else float('inf'))
                stat['maxAbsRelPct'] = max(stat['maxAbsRelPct'], rel if rel != float('inf') else 100.0)
                if rel > rel_tolerance:
                    stat['mismatch'] += 1
                    out['mismatches'].append({'code': code, 'date': date, 'field': field,
                                              'absRelPct': round(rel, 4) if rel != float('inf') else None})
    for stat in out['fieldStats'].values():
        stat['maxAbsRelPct'] = round(stat['maxAbsRelPct'], 4)
    out['allMatched'] = bool(out['codesBoth']) and not out['mismatches'] and out['datesOnlyReference'] == 0 \
        and out['datesOnlyCandidate'] == 0
    return out


# ── 2. 판단 영향 비교 ─────────────────────────────────────────────────────────
def load_inputs(root=ROOT):
    raw = json.load(open(os.path.join(root, 'analysis_data.json'), encoding='utf-8'))
    live = CI.load_js_object(os.path.join(root, 'data.js'), 'LIVE_DATA')
    sectors = CI.load_sectors() if root == ROOT else {}
    prod = None
    path = os.path.join(root, 'indicators.json')
    if os.path.exists(path):
        prod = json.load(open(path, encoding='utf-8'))
    return {'raw': raw, 'live': live, 'sectors': sectors, 'indicators': prod,
            'teamWeights': A.load_team_weights(), 'model': A.load_model_intelligence()}


def rebuild_indicators(raw, live, sectors, drop_last_bar=False):
    """compute_indicators.main() 의 종목 블록을 **파일을 쓰지 않고** 재현한다.

    drop_last_bar=True 면 마지막 봉 1개를 뺀 자료로 계산한다(T+1 공식 자료만 있을 때의 근사).
    그때 가격은 남은 마지막 봉의 확정 종가이고, 가격에 비례하는 PER/PBR 과 목표가 괴리·선행PER 은 그 가격으로 다시 계산한다.
    시험(test_data_supply_migration)이 drop_last_bar=False 결과가 indicators.json 과 같은지 잠근다.
    """
    out = {'stocks': {}, 'indices': live.get('indices'), 'droppedLastBar': bool(drop_last_bar)}
    for code, s in raw['stocks'].items():
        try:
            d = dict(live['stocks'].get(code, {}))
            daily = list(s.get('daily') or [])
            if drop_last_bar:
                if len(daily) < 3:
                    continue                       # 확정 봉이 두 개도 안 되면 판단 자체가 없다(지어내지 않는다)
                daily = daily[:-1]
                new_price = daily[-1].get('close')
                prev_close = daily[-2].get('close') if len(daily) >= 2 else None
                old_price = d.get('price')
                if not new_price or not old_price:
                    continue
                ratio = new_price / old_price
                d['price'] = new_price
                d['rate'] = round((new_price / prev_close - 1) * 100, 2) if prev_close else None
                for key in ('per', 'pbr'):
                    if isinstance(d.get(key), (int, float)) and d[key] > 0:
                        d[key] = round(d[key] * ratio, 2)
            entry = {'name': s.get('name', code), 'price': d.get('price'), 'rate': d.get('rate'),
                     'stale': d.get('stale', False),
                     'per': d.get('per'), 'pbr': d.get('pbr'), 'roe': d.get('roe'),
                     'eps': d.get('eps'), 'div': d.get('div'), 'w52': d.get('w52'),
                     'cap': d.get('cap')}
            info = (s.get('info') or {})
            ti = info.get('totalInfos') or {}
            entry['cnsEps'] = CI.num(ti.get('cnsEps'))
            entry['_bps'] = CI.num(ti.get('bps'))     # per_pbr 재계산 시나리오 전용. 보고서에 싣지 않는다.
            cons = info.get('consensus') or {}
            entry['targetMean'] = CI.num(cons.get('priceTargetMean'))
            entry['recommMean'] = CI.num(cons.get('recommMean'))
            if entry['targetMean'] and entry['price']:
                entry['targetGap'] = round((entry['targetMean'] / entry['price'] - 1) * 100, 1)
            if entry['cnsEps'] and entry['price']:
                entry['fwdPer'] = round(entry['price'] / entry['cnsEps'], 1)
            entry['tech'] = CI.indicators_for(daily) if len(daily) >= 2 else None
            if entry['tech']:
                entry['tech']['lastBarDate'] = CI.last_bar_date(daily)
            entry['flow'] = CI.flow_summary(info.get('dealTrends') or [], daily)
            entry['risk'] = CI.risk_for(daily, d)
            entry['sector'] = sectors.get(code, '기타')
            if len(daily) >= 6 and daily[-6].get('close'):
                entry['_ret5'] = round((daily[-1]['close'] / daily[-6]['close'] - 1) * 100, 2)
            if len(daily) >= 2 and daily[-2].get('close'):
                entry['_ret1'] = round((daily[-1]['close'] / daily[-2]['close'] - 1) * 100, 2)
            out['stocks'][code] = entry
        except Exception:                          # noqa: BLE001 — compute_indicators 와 같은 개별 보호
            continue
    CI.assign_risk_grades(out['stocks'])
    market_returns = [e['_ret5'] for e in out['stocks'].values() if e.get('_ret5') is not None]
    market_returns1 = [e['_ret1'] for e in out['stocks'].values() if e.get('_ret1') is not None]
    market_median = statistics.median(market_returns) if market_returns else 0.0
    sector_returns = {}
    for e in out['stocks'].values():
        if e.get('_ret5') is not None:
            sector_returns.setdefault(e.get('sector', '기타'), []).append(e['_ret5'])
    sector_medians = {sec: statistics.median(v) for sec, v in sector_returns.items() if v}
    for e in out['stocks'].values():
        ret5 = e.pop('_ret5', None)
        e.pop('_ret1', None)
        if ret5 is None:
            continue
        sec = e.get('sector', '기타')
        values = sorted(sector_returns.get(sec) or [ret5])
        rank = sum(v <= ret5 for v in values) / len(values) * 100
        e['relative'] = {'ret5': ret5, 'marketMedian5': round(market_median, 2),
                         'vsMarket': round(ret5 - market_median, 2),
                         'sectorMedian5': round(sector_medians.get(sec, market_median), 2),
                         'vsSector': round(ret5 - sector_medians.get(sec, market_median), 2),
                         'sectorPercentile': round(rank)}
    median_vol = statistics.median([e['risk']['vol20'] for e in out['stocks'].values() if e.get('risk')]) \
        if any(e.get('risk') for e in out['stocks'].values()) else 0.0
    trend = 'up' if market_median > 1 else ('down' if market_median < -1 else 'side')
    median_ret1 = statistics.median(market_returns1) if market_returns1 else 0.0
    out['marketRegime'] = {'key': f"{trend}_{'high' if median_vol >= 3 else 'low'}",
                           'trend': trend, 'vol': 'high' if median_vol >= 3 else 'low',
                           'medianRet5': round(market_median, 2), 'medianVol20': round(median_vol, 2),
                           'advanceRatio5': round(sum(r > 0 for r in market_returns) / len(market_returns) * 100, 1) if market_returns else 0.0,
                           'medianRet1': round(median_ret1, 2),
                           'advanceRatio1': round(sum(r > 0 for r in market_returns1) / len(market_returns1) * 100, 1) if market_returns1 else 0.0}
    return out


def truncated_raw(raw):
    """마지막 봉 1개를 뺀 analysis_data(QUANT 통계표·교차 통계 재계산용). 원본은 건드리지 않는다."""
    out = {'stocks': {}}
    for code, s in raw['stocks'].items():
        daily = s.get('daily') or []
        out['stocks'][code] = dict(s, daily=daily[:-1] if len(daily) >= 3 else daily)
    return out


def _strip_private(entry):
    return {k: v for k, v in entry.items() if not k.startswith('_')}


def apply_scenario(name, base_ind, raw, live, sectors):
    """시나리오별 입력 변형. (indicators-like dict, quant 통계용 raw) 를 돌려준다. 입력 객체는 변형하지 않는다."""
    if name not in SCENARIOS:
        raise ValueError(f'unknown scenario {name}')
    lag = name in ('lag1_official_close', 'official_free_only')
    ind = rebuild_indicators(raw, live, sectors, drop_last_bar=True) if lag else copy.deepcopy(base_ind)
    q_raw = truncated_raw(raw) if lag else raw
    for code, e in ind['stocks'].items():
        if name in ('no_consensus', 'official_free_only'):
            for key in ('targetMean', 'targetGap', 'fwdPer', 'cnsEps', 'recommMean'):
                e.pop(key, None)
            e['targetMean'] = e['cnsEps'] = e['recommMean'] = None
        if name in ('no_flow', 'official_free_only'):
            e['flow'] = None
        if name in ('per_pbr_from_close_eps_bps', 'official_free_only'):
            price, eps, bps = e.get('price'), e.get('eps'), e.get('_bps')
            e['per'] = round(price / eps, 2) if price and eps else None
            e['pbr'] = round(price / bps, 2) if price and bps else None
    return ind, q_raw


def evaluate(ind, q_raw, sectors, tw, model):
    """analyze_auto.main() 의 종목 루프와 같은 순서·같은 함수로 점수·판정을 만든다(파일을 쓰지 않는다)."""
    qstats = A.build_quant_stats(q_raw, sectors)
    regime = ind.get('marketRegime') or {}
    out = {}
    for code, e in ind.get('stocks', {}).items():
        t = e.get('tech')
        if not t or not e.get('price'):
            continue
        try:
            taro = A.taro_eval(t)
            diana = A.diana_eval(e)
            nova = A.quant_eval(e, t, qstats, sectors.get(code, '기타'))
            flow = A.flow_eval(e.get('flow'))
            wsec = tw['sectors'].get(sectors.get(code, ''), None) or tw['global']
            ctx = dict(e)
            ctx['marketRegime'] = regime
            chief = A.chief_eval(ctx, taro, diana, nova, flow, weights=wsec, learned=tw['learned'],
                                 guard_policy=model.get('reboundGuard'), confidence_model=model.get('confidenceModel'))
        except Exception:                          # noqa: BLE001
            continue
        out[code] = {'taro': taro.get('score'), 'diana': diana.get('score'), 'nova': nova.get('score'),
                     'flow': flow.get('score') if flow.get('available', True) else None,
                     'call': chief.get('call'), 'total': chief.get('total'),
                     'withheld': bool(chief.get('judgmentWithheld'))}
    return out


def _stats(values):
    vals = sorted(abs(v) for v in values)
    if not vals:
        return {'n': 0, 'meanAbs': None, 'p50Abs': None, 'p90Abs': None, 'maxAbs': None}
    return {'n': len(vals), 'meanAbs': round(sum(vals) / len(vals), 2), 'p50Abs': vals[len(vals) // 2],
            'p90Abs': vals[min(len(vals) - 1, int(len(vals) * 0.9))], 'maxAbs': vals[-1]}


def diff_decisions(baseline, variant, examples=12):
    codes = sorted(set(baseline) & set(variant))
    transitions, changed, total_deltas, comp_deltas = {}, [], [], {c: [] for c in COMPONENTS}
    comp_lost = {c: 0 for c in COMPONENTS}
    for code in codes:
        b, v = baseline[code], variant[code]
        if b['call'] != v['call']:
            key = f"{b['call']}→{v['call']}"
            transitions[key] = transitions.get(key, 0) + 1
            changed.append({'code': code, 'from': b['call'], 'to': v['call'],
                            'totalBefore': b['total'], 'totalAfter': v['total']})
        if isinstance(b['total'], (int, float)) and isinstance(v['total'], (int, float)):
            total_deltas.append(v['total'] - b['total'])
        for c in COMPONENTS:
            if b[c] is not None and v[c] is None:
                comp_lost[c] += 1
            elif isinstance(b[c], (int, float)) and isinstance(v[c], (int, float)):
                comp_deltas[c].append(v[c] - b[c])
    n = len(codes)
    return {'codesCompared': n,
            'codesOnlyBaseline': len(set(baseline) - set(variant)),
            'codesOnlyVariant': len(set(variant) - set(baseline)),
            'callChanged': len(changed), 'callChangedPct': round(len(changed) / n * 100, 1) if n else None,
            'callTransitions': dict(sorted(transitions.items())),
            'callsBaseline': {c: sum(1 for x in baseline.values() if x['call'] == c) for c in CALLS},
            'callsVariant': {c: sum(1 for x in variant.values() if x['call'] == c) for c in CALLS},
            'withheldBaseline': sum(1 for x in baseline.values() if x['withheld']),
            'withheldVariant': sum(1 for x in variant.values() if x['withheld']),
            'totalDelta': _stats(total_deltas),
            'totalUnchangedCount': sum(1 for d in total_deltas if d == 0),
            'componentDelta': {c: _stats(comp_deltas[c]) for c in COMPONENTS},
            'componentUnavailableInVariant': comp_lost,
            'examples': sorted(changed, key=lambda r: abs((r['totalAfter'] or 0) - (r['totalBefore'] or 0)), reverse=True)[:examples]}


def run_decision_shadow(root=ROOT, scenarios=None, inputs=None):
    inputs = inputs or load_inputs(root)
    raw, live, sectors = inputs['raw'], inputs['live'], inputs['sectors']
    tw, model = inputs['teamWeights'], inputs['model']
    base_ind = rebuild_indicators(raw, live, sectors, drop_last_bar=False)
    baseline = evaluate(base_ind, raw, sectors, tw, model)
    report = {'shadowVersion': SHADOW_VERSION, 'generatedAt': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'),
              'inputs': {'analysisDataFetchedAt': raw.get('fetchedAt'), 'priceLabel': live.get('date'),
                         'stocks': len(raw.get('stocks') or {}), 'teamWeightsLearned': tw.get('learned'),
                         'marketRegime': base_ind.get('marketRegime')},
              'production': {'BUY_HOLD_SELL_FORMULA_CHANGE': 0, 'WEIGHT_CHANGE': 0, 'THRESHOLD_CHANGE': 0,
                             'filesWritten': [], 'networkCalls': 0},
              'baseline': {'evaluated': len(baseline),
                           'calls': {c: sum(1 for x in baseline.values() if x['call'] == c) for c in CALLS}},
              'scenarios': {}}
    prod = inputs.get('indicators')
    if prod:
        # baseline 이 실제 Production 판단(auto_analysis.js)을 재현하는지는 시험이 따로 잠근다. 여기서는 입력 회차만 적는다.
        report['inputs']['indicatorsGeneratedAt'] = prod.get('generatedAt')
    for name in scenarios or list(SCENARIOS):
        ind, q_raw = apply_scenario(name, base_ind, raw, live, sectors)
        variant = evaluate(ind, q_raw, sectors, tw, model)
        report['scenarios'][name] = {'description': SCENARIOS[name], **diff_decisions(baseline, variant)}
    return report


def render_markdown(report):
    lines = [f"# 판단 영향 그림자 비교 (OFFLINE SHADOW) — {report['generatedAt'][:10]}", '',
             f"입력: analysis_data.json {report['inputs'].get('analysisDataFetchedAt')} · data.js `{report['inputs'].get('priceLabel')}` · "
             f"{report['inputs'].get('stocks')}종목 · 시장국면 {(report['inputs'].get('marketRegime') or {}).get('key')}", '',
             f"baseline 판정 {report['baseline']['calls']} (평가 {report['baseline']['evaluated']}종목) · Production 변경 0 · 네트워크 0", '',
             '| 시나리오 | 판정 바뀜 | 전이 | 종합점수 |Δ| 평균/p90/최대 | TARO/DIANA/QUANT/FLOW |Δ| 평균 | 축 소실 | 보류 |',
             '|---|---|---|---|---|---|---|']
    for name, s in report['scenarios'].items():
        td, cd = s['totalDelta'], s['componentDelta']
        comp = '/'.join(str(cd[c]['meanAbs']) if cd[c]['meanAbs'] is not None else '-' for c in COMPONENTS)
        lost = ' '.join(f'{c}:{n}' for c, n in s['componentUnavailableInVariant'].items() if n)
        trans = ' '.join(f'{k} {v}' for k, v in s['callTransitions'].items()) or '-'
        lines.append(f"| `{name}` | {s['callChanged']} ({s['callChangedPct']}%) | {trans} | "
                     f"{td['meanAbs']}/{td['p90Abs']}/{td['maxAbs']} | {comp} | {lost or '-'} | {s['withheldVariant']} |")
    lines += ['', '시나리오 설명:']
    for name, s in report['scenarios'].items():
        lines.append(f"- `{name}`: {s['description']}")
    lines += ['', '⚠️ 점수 차이는 같은 산식·같은 가중치로 입력만 바꿔 다시 계산한 값이다. 네이버 값을 정답으로 두지 않았다. '
              '종목별 원자료 값은 싣지 않는다.']
    return '\n'.join(lines) + '\n'


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', default=None, help='보고서 폴더(기본: 임시 폴더). Production 산출물 경로에 쓰지 않는다')
    ap.add_argument('--scenarios', nargs='*', default=None, choices=list(SCENARIOS))
    ap.add_argument('--root', default=ROOT)
    args = ap.parse_args(argv)
    out_dir = args.out or os.path.join(tempfile.gettempdir(), 'gaeo-shadow')
    os.makedirs(out_dir, exist_ok=True)
    report = run_decision_shadow(args.root, args.scenarios)
    with open(os.path.join(out_dir, 'decision_shadow.json'), 'w', encoding='utf-8') as handle:
        json.dump(report, handle, ensure_ascii=False, indent=1)
    with open(os.path.join(out_dir, 'decision_shadow.md'), 'w', encoding='utf-8') as handle:
        handle.write(render_markdown(report))
    print(render_markdown(report))
    print(f'→ {out_dir}/decision_shadow.json · decision_shadow.md')
    return 0


if __name__ == '__main__':
    sys.exit(main())
