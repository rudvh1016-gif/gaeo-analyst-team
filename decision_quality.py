"""Observation-only quality of immutable actual decisions and protected outcomes.

No prices are fetched and no outcomes are regraded. A score is not a probability.
The latest recorded ticker/day is selected by the existing decision recorder.
"""
from collections import Counter, defaultdict
import math

SCHEMA = 'actual-decision-quality-v1'
# Display bins cover the actual 0..100 score scale (observed total 34..71,
# confidence 30..86 at introduction). They never change any trading threshold.
BINS = ((0, 40, '0~39'), (40, 50, '40~49'), (50, 60, '50~59'),
        (60, 70, '60~69'), (70, 80, '70~79'), (80, 90, '80~89'),
        (90, 101, '90~100'))


def decision_kind(row):
    # Only contemporaneously preserved facts; missing flags never turn HOLD
    # into abstention retrospectively. Unknown/invalid calls stay separate.
    if row.get('judgmentWithheld') or row.get('call') == 'JUDGMENT_WITHHELD':
        return 'WITHHELD'
    return row.get('call') if row.get('call') in ('BUY', 'HOLD', 'SELL') else 'UNKNOWN'


def finite(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def pct(n, d):
    return round(100 * n / d, 1) if d else None


def cohort_key(row):
    return '|'.join(str(row.get(k) or 'unrecorded') for k in
                    ('modelVersion', 'productionConfigVersion', 'scoringVersion', 'coverageVersion'))


def grade_stats(rows, outcomes):
    from build_model_scoreboard import MIN_UNIQUE_DATES
    from compute_team_weights import _block_bootstrap, _stat_own
    counts = Counter()
    days, graded_days = set(), set()
    blocks = defaultdict(lambda: {'own': [0, 0], 'bull': [0, 0], 'bear': [0, 0]})
    returns = []
    for row in rows:
        kind = decision_kind(row)
        outcome = outcomes.get(row['recordId']) or {'status': 'blocked', 'reason': 'outcome_not_saved'}
        state = 'withheld' if kind == 'WITHHELD' else outcome.get('status', 'blocked')
        if kind == 'UNKNOWN' or state not in ('evaluated', 'pending', 'blocked', 'withheld'):
            state = 'blocked'
        # Protected recorder is the sole grading authority. Reject malformed
        # or mismatched outputs instead of inventing a successful evaluation.
        if state == 'evaluated' and (outcome.get('recordId') != row['recordId'] or
                outcome.get('horizon') != 5 or not finite(outcome.get('ret')) or
                outcome.get('scoringVersion') != row.get('scoringVersion')):
            state = 'blocked'
        counts[state] += 1
        if state != 'evaluated':
            continue
        days.add(row['date'])
        returns.append(outcome['ret'])
        verdict = outcome.get('verdict')
        counts[verdict if verdict in ('hit', 'miss') else 'neutral'] += 1
        if verdict in ('hit', 'miss'):
            graded_days.add(row['date'])
            blocks[row['date']]['own'][verdict == 'miss'] += 1
    denom = counts['hit'] + counts['miss']
    enough = len(graded_days) >= MIN_UNIQUE_DATES and denom > 0
    result = {k: counts[k] for k in ('evaluated', 'pending', 'blocked', 'withheld', 'hit', 'miss', 'neutral')}
    result.update(recordCount=len(rows), uniqueDecisionDays=len({r['date'] for r in rows}),
                  evaluatedDecisionDays=len(days), gradedDecisionDays=len(graded_days),
                  accuracyDenominator=denom, accuracyPct=pct(counts['hit'], denom) if enough else None,
                  accuracy95=_block_bootstrap(blocks, _stat_own, block_length=5) if enough else None,
                  minUniqueDecisionDays=MIN_UNIQUE_DATES,
                  evidenceStatus='EXPLORATORY_NOT_VALIDATED' if enough else 'INSUFFICIENT_EVIDENCE')
    return result


def _distribution(rows):
    counts = Counter(decision_kind(r) for r in rows)
    judged = sum(counts[k] for k in ('BUY', 'HOLD', 'SELL'))
    return {'observedRecords': len(rows), 'judgedRecords': judged,
            'counts': {k: counts[k] for k in ('BUY', 'HOLD', 'SELL', 'WITHHELD', 'UNKNOWN')},
            'ratiosPct': {k: pct(counts[k], len(rows)) for k in ('BUY', 'HOLD', 'SELL', 'WITHHELD', 'UNKNOWN')},
            'judgedPctOfRecorded': pct(judged, len(rows)),
            'withheldPctOfRecorded': pct(counts['WITHHELD'], len(rows))}


def _cohort(rows, outcomes):
    from gaeo_evolution.failure_miner import mine
    actions = {call: grade_stats([r for r in rows if decision_kind(r) == call], outcomes)
               for call in ('BUY', 'HOLD', 'SELL')}
    bins = {}
    for field in ('total', 'confidence'):
        bins[field] = {}
        for call in ('BUY', 'SELL'):
            selected = [r for r in rows if decision_kind(r) == call]
            bins[field][call] = [dict(label=label, lower=lo, upperExclusive=hi,
                                      **grade_stats([r for r in selected if finite(r.get(field))
                                                     and lo <= r[field] < hi], outcomes))
                                 for lo, hi, label in BINS]
            bins[field][call].append(dict(label='기록 없음', lower=None, upperExclusive=None,
                                         **grade_stats([r for r in selected if not finite(r.get(field))
                                                        or not 0 <= r[field] <= 100], outcomes)))
    mature = []
    for row in rows:
        if grade_stats([row], outcomes)['evaluated']:
            mature.append(dict(row.get('components') or {}, day=row['date'], code=row['code'],
                               call=decision_kind(row), ret5=outcomes[row['recordId']]['ret'],
                               confidence=row.get('confidence'), total=row.get('total')))
    # Historical sector/regime values were not preserved in these originals.
    # Do not assign today's membership to yesterday's actual decision.
    failures = mine(mature, sectors={})
    return {'distribution': _distribution(rows), 'outcomes': grade_stats(rows, outcomes),
            'actions': actions, 'bins': bins, 'failurePatterns': failures}


def summarize(records, outcomes, current_model):
    from decision_records import daily_records
    from coverage_version import COVERAGE_HISTORY
    daily = daily_records(records)
    groups = defaultdict(list)
    for row in daily:
        groups[cohort_key(row)].append(row)
    cohorts = {key: _cohort(rows, outcomes) for key, rows in sorted(groups.items())}
    current_rows = [r for r in daily if r.get('modelVersion') == current_model]
    latest = max(current_rows, key=lambda r: r['decisionAt'], default=None)
    active_key = cohort_key(latest) if latest else None
    # Latest ROUND, not a mixture of a fresh subset with stale earlier records.
    latest_rows = [r for r in records if latest and r.get('decisionAt') == latest['decisionAt']
                   and cohort_key(r) == active_key]
    universe = {e['version']: e['size'] for e in COVERAGE_HISTORY}
    expected = universe.get(latest.get('coverageVersion')) if latest else None
    latest_distribution = _distribution(latest_rows)
    observed = latest_distribution['observedRecords']
    valid_scope = expected is not None and observed <= expected
    latest_distribution.update(expectedRecords=expected,
        missingRecords=expected-observed if valid_scope else None,
        judgedPctOfUniverse=pct(latest_distribution['judgedRecords'], expected) if valid_scope else None,
        withheldPctOfUniverse=pct(latest_distribution['counts']['WITHHELD'], expected) if valid_scope else None,
        scopeStatus='KNOWN_VERSION' if valid_scope else 'UNVERIFIED_SCOPE',
        decisionAt=latest['decisionAt'] if latest else None)
    # Observe a recent and preceding window, each of existing minimum length.
    # No ADWIN, alert threshold, or production action is attached.
    from build_model_scoreboard import MIN_UNIQUE_DATES
    active_rows = groups.get(active_key, [])
    mature = [r for r in active_rows if decision_kind(r) in ('BUY', 'HOLD', 'SELL')
              and (outcomes.get(r['recordId']) or {}).get('status') == 'evaluated']
    days = sorted({r['date'] for r in mature})
    change = {'status': 'INSUFFICIENT_EVIDENCE', 'mode': 'SHADOW_ONLY',
              'requiredDaysPerWindow': MIN_UNIQUE_DATES, 'observedDays': len(days), 'actions': {}}
    if len(days) >= 2 * MIN_UNIQUE_DATES:
        prior, recent = set(days[-2*MIN_UNIQUE_DATES:-MIN_UNIQUE_DATES]), set(days[-MIN_UNIQUE_DATES:])
        change['status'] = 'OBSERVATION_ONLY'
        for call in ('BUY', 'HOLD', 'SELL'):
            change['actions'][call] = {name: grade_stats([r for r in mature if r['date'] in window
                                                        and decision_kind(r) == call], outcomes)
                                       for name, window in (('previous', prior), ('recent', recent))}
    return {'schemaVersion': SCHEMA, 'source': 'actual_auto_protected_outcomes',
            'scoreIsProbability': False, 'independenceUnit': 'decision_date',
            'activeCohort': active_key, 'cohorts': cohorts, 'latestRound': latest_distribution,
            'recentChange': change,
            'interpretation': 'OBSERVATION_ONLY' if any(
                b['accuracyPct'] is not None for c in cohorts.values()
                for a in c['bins']['confidence'].values() for b in a) else 'INSUFFICIENT_EVIDENCE',
            'limitations': ['종합점수는 매수·매도 방향 점수이며 상승 확률이 아닙니다. 낮은 종합점수의 SELL을 낮은 확신으로 읽지 않습니다.',
                            '확신도는 분석가 의견 일치도입니다. 같은 모델·구성·채점 기준·종목 범위끼리 나눠 봅니다.',
                            '적중률은 적중과 빗나감만 나누며 중립·미래 대기·자료 부족·판단보류를 제외합니다.',
                            '같은 날 여러 종목과 겹치는 5거래일 결과는 독립 시험이 아닙니다. 날짜 블록 구간도 참고 관찰입니다.',
                            '판단 가능 비율과 채점 가능 비율은 다릅니다. 가격 비교 근거 부족은 과거 HOLD를 판단보류로 바꾸지 않습니다.']}
