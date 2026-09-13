"""DART observation study. No model, vote, API client or strategy writer.

The primary exposure is an important filing received on the PREVIOUS KST
calendar day. Same-day disclosures are inspected separately, never guessed.
Immutable collection receipts precede immutable links to actual decisions.
Historical reconstruction and protected prospective evidence never share a
denominator. Association is not a counterfactual investment return.
"""
from collections import Counter, defaultdict
import datetime as dt
import gzip
import json
import os
from pathlib import Path

import dart_time as T
import decision_records as D

VERSION = 'dart-observation-v1'
ROOT = Path(__file__).resolve().parent
EVIDENCE = 'research_archive/decisions/dart_research'
REPORT = 'gaeo_evolution/status/dart_research.json'
DAILY_REPORT = EVIDENCE + '/status.json'
FORWARD = 'PROTECTED_FORWARD'
HISTORICAL = 'HISTORICAL_RECONSTRUCTED'
# Descriptive labels only. Order handles overlapping Korean titles.
CATEGORIES = (
    ('share_count', ('유상증자', '무상증자', '전환사채', '신주인수권', '감자', '교환사채')),
    ('merger_split', ('합병', '분할')),
    ('listing_trading', ('거래정지', '상장폐지', '관리종목', '상장적격')),
    ('earnings_sales', ('실적', '매출', '영업이익', '사업보고서', '분기보고서', '반기보고서')),
    ('financing', ('차입', '사채', '자금조달', '채무보증')),
    ('ownership', ('최대주주', '대량보유', '지분', '소유상황')),
    ('contract', ('계약', '수주')),
    ('dividend', ('배당',)),
)


def category(title):
    return next((name for name, words in CATEGORIES if any(w in str(title) for w in words)), 'other')


def previous_day(day):
    return (dt.date.fromisoformat(day) - dt.timedelta(days=1)).isoformat()


def _date(value):
    try:
        raw = str(value)
        if len(raw) == 8 and raw.isdigit():
            raw = raw[:4] + '-' + raw[4:6] + '-' + raw[6:]
        return dt.date.fromisoformat(raw).isoformat()
    except ValueError:
        return None


def event_at(event, cutoff):
    """Never merge a later version into an earlier first-seen record."""
    when = T.parse_instant(cutoff)
    detected = T.parse_instant(event.get('detected_at'))
    fetched = T.parse_instant(event.get('fetched_at'))
    received = _date(event.get('rcept_dt'))
    if not when or not received or not detected or not fetched:
        return None, 'TIME_UNCERTAIN'
    day = when.astimezone(T.KST).date().isoformat()
    if received > day or detected > when or fetched > when:
        return None, 'AFTER_DECISION'
    if received == day:
        published = T.parse_instant(event.get('published_at'))
        # Current OpenDART list only has a date. A caller cannot promote a
        # first-seen clock into an official publication clock.
        if not published or event.get('publicationTimeSource') != 'OPENDART_OFFICIAL_TIMESTAMP':
            return None, 'SAME_DAY_TIME_UNCERTAIN'
        if published.astimezone(T.KST).date().isoformat() != received:
            return None, 'TIME_UNCERTAIN'
        if published > when:
            return None, 'AFTER_DECISION'
    no = str(event.get('rcept_no') or '')
    code = str(event.get('ticker') or '')
    if not no.isdigit() or len(no) != 14 or not code.isdigit() or len(code) != 6:
        return None, 'IDENTITY_UNCERTAIN'
    return {'ticker': code, 'receiptId': no, 'receivedOn': received,
            'category': category(event.get('report_name', '')),
            'detectedAt': detected.isoformat(), 'fetchedAt': fetched.isoformat(),
            'availableAtDecision': True, 'source': 'OPENDART'}, None


def _write_immutable(folder, value):
    body = D._json(value).encode()
    path = Path(folder) / (D._hash(value) + '.json.gz')
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        # Exclusive creation: concurrent retries cannot overwrite evidence.
        try:
            with path.open('xb') as f:
                f.write(gzip.compress(body, mtime=0)); f.flush(); os.fsync(f.fileno())
        except FileExistsError:
            pass
    if gzip.decompress(path.read_bytes()) != body:
        raise D.IntegrityError('DART immutable evidence mismatch')
    return path


def _read_immutable(folder):
    values = []
    for path in sorted(Path(folder).glob('*.json.gz')):
        value = json.loads(gzip.decompress(path.read_bytes()))
        if path.name != D._hash(value) + '.json.gz' or value.get('version') != VERSION:
            raise D.IntegrityError('DART evidence identity/version mismatch')
        values.append(value)
    return values


def read_raw(root=ROOT, start_day=None):
    """Reuse the encrypted DART store; retain versions BEFORE any deduplication."""
    import research_store
    import research_crypto
    store = research_store.ResearchArchiveStore(
        root=str(Path(root)/'research_archive/dart'), record_type=research_store.RECORD_DART, encrypt=True)
    events, errors = [], []
    for day in store.list_days():
        if start_day and day < start_day:
            continue
        try:
            records = store.read_day(day)
            authenticated_live = (str(store.existing_segment(day)).endswith('.jsonl.enc')
                                  and not Path(store.manifest_path(day)).exists())
            if not authenticated_live and store.verify_archive(day)['status'] != research_store.OK:
                errors.append('ARCHIVE_INTEGRITY_ERROR'); continue
            events.extend(records)
        except research_crypto.ResearchArchiveKeyMissing:
            errors.append('ARCHIVE_KEY_MISSING'); break
        except Exception:
            errors.append('ARCHIVE_READ_ERROR')
    return events, sorted(set(errors))


def collection_receipt(status, events, mapped_codes, run_id, errors=()):
    cutoff = status.get('finishedAt') or T.iso_now()
    safe, excluded = {}, Counter()
    for event in events:
        item, reason = event_at(event, cutoff)
        if item:
            # Earliest metadata version known at this cutoff, not a later correction.
            old = safe.get(item['receiptId'])
            if old is None or item['fetchedAt'] < old['fetchedAt']:
                safe[item['receiptId']] = item
        else:
            excluded[reason] += 1
    complete = (status.get('eventState') in ('EVENT_DETECTED', 'NO_OFFICIAL_EVENT_DETECTED')
                and (status.get('pagination') or {}).get('coverage_complete') is True
                and not status.get('errors') and not status.get('pendingRetryNext') and not errors)
    return {'version': VERSION, 'runId': str(run_id or ''), 'checkedAt': cutoff,
            'queryWindow': status.get('queryWindow'), 'checkStatus': 'OK' if complete else 'INCOMPLETE',
            'sourceStatus': status.get('status') or status.get('eventState'),
            'readErrors': list(errors), 'mappedCodes': sorted(mapped_codes),
            'filings': sorted(safe.values(), key=lambda e: e['receiptId']),
            'excluded': dict(excluded), 'source': 'existing_collect_dart', 'llmCalls': 0}


def preserve_collection(status, root=ROOT, observed_events=None):
    """Best effort sidecar AFTER the existing collector has stored its result."""
    try:
        root = Path(root)
        # Reuse the exact API rows already fetched, including duplicates skipped
        # by the durable store. Missing old archive files cannot fake absence.
        events = observed_events or []
        errors = [] if observed_events is not None else ['QUERY_ROWS_UNAVAILABLE']
        try:
            cmap = json.loads((root/'research_archive/dart/corp_map.json').read_text())
        except (OSError, ValueError):
            cmap = {}; errors.append('MAPPING_UNAVAILABLE')
        receipt = collection_receipt(status, events, (cmap.get('mapped') or {}).keys(),
                                     os.environ.get('GITHUB_RUN_ID'), errors)
        _write_immutable(root/EVIDENCE/'collections', receipt)
        return receipt['checkStatus']
    except Exception:
        # Never emit exception strings (might contain a key), never halt prices.
        return 'DART_RESEARCH_WRITE_ERROR'


def exposure(code, day, cutoff, filings, receipt=None):
    prev = previous_day(day)
    relevant = [e for e in filings if e['ticker'] == code and e['receivedOn'] == prev
                and T.instant_le(e['detectedAt'], cutoff) and T.instant_le(e['fetchedAt'], cutoff)]
    window = (receipt or {}).get('queryWindow') or {}
    covered = (receipt and receipt.get('checkStatus') == 'OK'
               and code in receipt.get('mappedCodes', []) and T.instant_le(receipt.get('checkedAt'), cutoff)
               and T.parse_instant(receipt['checkedAt']).astimezone(T.KST).date().isoformat() == day
               and window.get('start', '9999') <= prev <= window.get('end', '0000'))
    return {'status': 'PRESENT' if relevant else 'ABSENT' if covered else 'UNKNOWN',
            'completeWindow': bool(covered), 'windowStart': prev, 'windowEnd': prev,
            'categories': sorted({e['category'] for e in relevant}),
            'receiptIds': sorted({e['receiptId'] for e in relevant}),
            'filings': relevant, 'checkedAt': (receipt or {}).get('checkedAt')}


def bind_forward(payload, records, receipts, run_id, now):
    """Only the current analysis run can create prospective DART links."""
    clock = payload.get('runTimestamps') or {}
    start, end, captured = map(T.parse_instant,
                              (clock.get('analysisStartedAt'), clock.get('analysisCompletedAt'), now))
    if not run_id or str(clock.get('githubRunId')) != str(run_id) or not start or not end or not captured:
        return None
    if not start <= end <= captured or start.astimezone(T.KST).date() != captured.astimezone(T.KST).date():
        return None
    usable = [r for r in receipts if r.get('runId') == str(run_id) and T.instant_le(r.get('checkedAt'), start.isoformat())]
    receipt = max(usable, key=lambda r: r['checkedAt']) if usable else None
    links = []
    for row in records:
        if row.get('sourceContentHash') != D._hash(payload):
            raise D.IntegrityError('DART snapshot must bind the exact captured payload')
        # Minute-resolution originals are conservatively anchored to minute start.
        moment = D._moment(row['decisionAt'])
        if not moment or row['date'] != start.astimezone(T.KST).date().isoformat():
            return None
        cutoff = min(start, moment).isoformat()
        fact = exposure(row['code'], row['date'], cutoff, (receipt or {}).get('filings', []), receipt)
        links.append({'recordId': row['recordId'], 'sourceContentHash': row['sourceContentHash'],
                      'ticker': row['code'], 'decisionDate': row['date'], 'decisionAt': row['decisionAt'],
                      'cutoff': cutoff, 'evidence': fact})
    return {'version': VERSION, 'cohort': FORWARD, 'runId': str(run_id), 'capturedAt': now,
            'sourceHash': D._hash(payload), 'collectionHash': D._hash(receipt) if receipt else None,
            'checkStatus': receipt['checkStatus'] if receipt else 'COLLECTION_UNAVAILABLE',
            'links': links, 'productionChangesAllowed': False}


def capture_forward(payload, records, root=ROOT):
    try:
        root = Path(root)
        receipts = _read_immutable(root/EVIDENCE/'collections')
        bound = bind_forward(payload, records, receipts, os.environ.get('GITHUB_RUN_ID'), T.iso_now())
        if bound is None:
            return 'NOT_A_CURRENT_FORWARD_RUN'
        # First attempt stays first, including failed checks. A retry is not an
        # opportunity to retrofit newly learned evidence onto an old decision.
        old = _read_immutable(root/EVIDENCE/'forward')
        if any(r['sourceHash'] == bound['sourceHash'] for r in old):
            return 'ALREADY_PRESERVED'
        _write_immutable(root/EVIDENCE/'forward', bound)
        return 'PRESERVED'
    except Exception:
        return 'DART_RESEARCH_WRITE_ERROR'


def _mature(row, today):
    return (row.get('ret5') is not None and row.get('outcomeDate')
            and row['day'] < row['outcomeDate'] < today and row.get('call') in ('BUY', 'HOLD', 'SELL'))


def _case(row, group):
    from gaeo_evolution.failure_miner import BIG_MOVE_PCT, HIGH_CONFIDENCE
    from compute_model_intelligence import call_hit
    call, ret = row['call'], row['ret5']
    if group == 'high_confidence_wrong':
        if call not in ('BUY', 'SELL') or row.get('confidence') is None or float(row['confidence']) < HIGH_CONFIDENCE:
            return None
        hit = call_hit(call, ret)
        return None if hit is None else hit == 0
    if group == 'BUY_failure':
        return None if call != 'BUY' or call_hit(call, ret) is None else call_hit(call, ret) == 0
    target, move = {'BUY_big_drop': ('BUY', ret <= -BIG_MOVE_PCT),
                    'SELL_big_rise': ('SELL', ret >= BIG_MOVE_PCT),
                    'HOLD_big_move': ('HOLD', abs(ret) >= BIG_MOVE_PCT)}[group]
    return move if call == target else None


def comparison(rows, group):
    """Equal decision-day influence, matched day/call/model/confidence band.

    Unknown or incomplete scans do not become unexposed controls. Primary
    confirmatory contrast is fixed to high-confidence errors / any important
    disclosure. Other rows/categories are descriptive, not multiple chances
    to manufacture a candidate.
    """
    strata = defaultdict(lambda: [[], []])
    case_n = control_n = case_events = control_events = unknown = 0
    case_days, control_days = set(), set()
    for row in rows:
        flag = _case(row, group)
        if flag is None:
            continue
        ev = row['dart']
        case_n += int(flag); control_n += int(not flag)
        (case_days if flag else control_days).add(row['day'])
        case_events += int(flag and ev['status'] == 'PRESENT')
        control_events += int(not flag and ev['status'] == 'PRESENT')
        if ev['status'] == 'UNKNOWN' or not ev['completeWindow']:
            unknown += 1; continue
        band = int(float(row['confidence']) // 10) if row.get('confidence') is not None else 'unknown'
        key = (row['day'], row['call'], row.get('modelVersion'), row.get('pcv'), band)
        strata[key][0 if flag else 1].append(row)
    days = defaultdict(list)
    matched_cases = matched_controls = 0
    category_counts = defaultdict(lambda: {'cases': 0, 'controls': 0})
    for key, (cases, controls) in strata.items():
        if not cases or not controls:
            continue
        matched_cases += len(cases); matched_controls += len(controls)
        def rate(items):
            return sum(bool(set(r['dart']['categories']) - {'other'}) for r in items) / len(items)
        days[key[0]].append((rate(cases) - rate(controls)) * 100)
        for label, items in (('cases', cases), ('controls', controls)):
            for r in items:
                for cat in r['dart']['categories']:
                    category_counts[cat][label] += 1
    values = {day: [{'delta': sum(v)/len(v)}] for day, v in days.items()}
    from gaeo_evolution.failure_miner import MIN_ROWS, MIN_DAYS
    supported = len(days) >= MIN_DAYS and min(matched_cases, matched_controls) >= MIN_ROWS
    ci = None
    if supported:
        from build_model_scoreboard import _block_bootstrap_ci
        ci = _block_bootstrap_ci(values, lambda x: sum(r['delta'] for r in x)/len(x))
    return {'caseRows': case_n, 'controlRows': control_n, 'caseDisclosureRows': case_events,
            'caseDecisionDays': len(case_days), 'controlDecisionDays': len(control_days),
            'controlDisclosureRows': control_events, 'unknownOrIncompleteRows': unknown,
            'matchedCaseRows': matched_cases, 'matchedControlRows': matched_controls,
            'uniqueDecisionDays': len(days), 'positiveDifferenceDays': sum(v[0]['delta'] > 0 for v in values.values()),
            'differencePp': round(sum(v[0]['delta'] for v in values.values())/len(values), 2) if supported else None,
            'dayBootstrap95Ci': ci, 'categoryCountsDescriptive': dict(category_counts),
            'status': 'OBSERVATION_ONLY' if supported else 'INSUFFICIENT_EVIDENCE'}


def study(rows, cohort, policy, today):
    from gaeo_evolution.evaluation import split_research_eval
    mature = [r for r in rows if _mature(r, today)]
    eligible = [r for r in mature if r['dart']['completeWindow']]
    nr, ne = policy['minResearchDays'], policy['minEvalDays']
    research, evaluation, split = split_research_eval(eligible, nr, ne)
    checks = {}
    if split['sufficient']:
        eval_start = min(r['day'] for r in evaluation)
        research = [r for r in research if r['outcomeDate'] < eval_start]
        if len({r['day'] for r in research}) < nr:
            split = dict(split, sufficient=False, reason='outcome_embargo_leaves_insufficient_research_days')
        else:
            checks = {name: comparison(part, 'high_confidence_wrong')
                      for name, part in [('research', research), ('evaluation', evaluation)]}
    enough = bool(checks) and all(c['uniqueDecisionDays'] >= n and c['dayBootstrap95Ci']
                                 for c, n in [(checks['research'], nr), (checks['evaluation'], ne)])
    ready = enough and all(c['dayBootstrap95Ci'][0] > 0 for c in checks.values())
    status = 'RESEARCH_SIGNAL_FOUND' if ready else 'NO_RESEARCH_SIGNAL' if enough else 'INSUFFICIENT_EVIDENCE'
    counts = Counter(r['dart']['status'] for r in rows)
    return {'cohort': cohort, 'rawRows': len(rows), 'uniqueDecisionDays': len({r['day'] for r in rows}),
            'maturedRows': len(mature), 'maturedDecisionDays': len({r['day'] for r in mature}),
            'pendingOrUnscorableRows': len(rows)-len(mature),
            'disclosurePresentRows': counts['PRESENT'], 'confirmedAbsentRows': counts['ABSENT'],
            'unknownRows': counts['UNKNOWN'], 'completeWindowRows': sum(r['dart']['completeWindow'] for r in rows),
            'timeVerifiedEvidenceRows': sum(r['dart']['status'] != 'UNKNOWN' for r in rows),
            'timeVerifiedEvidenceDecisionDays': len({r['day'] for r in rows if r['dart']['status'] != 'UNKNOWN'}),
            'comparableDecisionDays': len({r['day'] for r in eligible}),
            'comparisons': {g: comparison(mature, g) for g in ('high_confidence_wrong', 'BUY_failure', 'BUY_big_drop', 'SELL_big_rise', 'HOLD_big_move')},
            'dataSplit': split, 'confirmatoryChecks': checks, 'status': status,
            'accuracyImprovementProven': False, 'candidateCreated': False}


def build_report(historical, protected, policy, today, source_status=None):
    cohorts = {HISTORICAL: study(historical, HISTORICAL, policy, today),
               FORWARD: study(protected, FORWARD, policy, today)}
    signals = [name for name, result in cohorts.items() if result['status'] == 'RESEARCH_SIGNAL_FOUND']
    status = 'RESEARCH_SIGNAL_FOUND' if signals else 'NO_RESEARCH_SIGNAL' if any(
        r['status'] == 'NO_RESEARCH_SIGNAL' for r in cohorts.values()) else 'INSUFFICIENT_EVIDENCE'
    return {'version': VERSION, 'generatedAt': T.iso_now(), 'asOf': today, 'status': status,
            'execution': {'event': os.environ.get('GITHUB_EVENT_NAME', 'local'),
                          'runId': os.environ.get('GITHUB_RUN_ID'),
                          'runAttempt': os.environ.get('GITHUB_RUN_ATTEMPT'),
                          'headSha': os.environ.get('GITHUB_SHA')},
            'inputFingerprint': D._hash({'historical': historical, 'protected': protected}),
            'cohorts': cohorts, 'sourceStatus': source_status or {},
            'researchFocus': {'status': 'ACTIONABLE' if signals else 'WAITING_EVIDENCE' if status == 'INSUFFICIENT_EVIDENCE' else 'NO_SIGNAL',
                'researchRecommended': bool(signals), 'signalCohorts': signals,
                'handoff': 'existing_evolution_research_then_shadow_and_promotion_gate',
                'candidateCreated': False, 'productionChangesAllowed': False},
            'method': {'exposure': 'previous_KST_calendar_day_important_disclosure',
                'matching': ['decision_date', 'call', 'modelVersion', 'productionConfigVersion', 'confidence_decile'],
                'independenceUnit': 'decision_date', 'primaryContrast': 'high_confidence_wrong',
                'secondaryComparisons': 'descriptive_only', 'outcomeEmbargo': True,
                'noEventRequiresCompleteWindow': True, 'confidenceIsProbability': False},
            'llmCalls': 0, 'productionChangesAllowed': False, 'accuracyImprovementProven': False}


def refresh(root=ROOT, historical_rows=None, policy=None, today=None, output_path=DAILY_REPORT):
    root = Path(root)
    if output_path not in (DAILY_REPORT, REPORT):
        raise ValueError('DART study writes only its two observation paths')
    today = today or T.today_kst()
    if policy is None:
        from gaeo_evolution import constitution
        const = constitution.load(str(root/'gaeo_evolution/evolution_constitution.json'),
                                  str(root/'gaeo_evolution/evolution_constitution.sha256'))
        policy = const['offlineDataPolicy']
    if historical_rows is None:
        from gaeo_evolution import evaluation
        history, closes = evaluation.load_market_data(str(root))
        historical_rows, _ = evaluation.build_rows(history, closes)
    events, errors = read_raw(root)
    receipts = _read_immutable(root/EVIDENCE/'collections')
    bounds = _read_immutable(root/EVIDENCE/'forward')
    all_originals = D.read_records(root/'research_archive/decisions')
    originals = {r['recordId']: r for r in all_originals}
    daily_ids = {r['recordId'] for r in D.daily_records(all_originals)}
    outcomes = D.load_outcomes(root/'research_archive/decisions')
    protected = {}
    for bound in sorted(bounds, key=lambda r: r['capturedAt']):
        for link in bound['links']:
            rid = link['recordId']; row = originals.get(rid)
            if not row or row['sourceContentHash'] != link['sourceContentHash']:
                raise D.IntegrityError('DART link does not match protected original')
            if rid not in daily_ids:
                continue
            if rid in protected:
                continue
            result = outcomes.get(rid) or {}
            graded = result.get('status') == 'evaluated'
            protected[rid] = {'code': row['code'], 'day': row['date'], 'call': row['call'],
                'confidence': row.get('confidence'), 'modelVersion': row.get('modelVersion'),
                'pcv': row.get('productionConfigVersion'), 'dart': link['evidence'],
                'ret5': result.get('ret') if graded else None, 'outcomeDate': result.get('dueOn') if graded else None}
    historical, excluded = [], Counter()
    # Cache by day. Historical daily records have no proven intraday clock:
    # midnight KST is the only safe cutoff, not a fabricated close timestamp.
    by_day = {}
    for row in historical_rows:
        day = row['day']; cutoff = day + 'T00:00:00+09:00'
        if day not in by_day:
            safe = {}
            for event in events:
                item, reason = event_at(event, cutoff)
                if item:
                    old = safe.get(item['receiptId'])
                    if old is None or item['fetchedAt'] < old['fetchedAt']:
                        safe[item['receiptId']] = item
                else:
                    excluded[reason] += 1
            usable = [r for r in receipts if T.instant_le(r['checkedAt'], cutoff)]
            receipt = max(usable, key=lambda r: r['checkedAt']) if usable else None
            by_day[day] = list(safe.values()), receipt
        filings, receipt = by_day[day]
        historical.append(dict(row, dart=exposure(row['code'], day, cutoff, filings, receipt)))
    report = build_report(historical, list(protected.values()), policy, today,
                          {'rawEventsRead': len(events), 'readErrors': errors,
                           'excludedEventDayPairs': dict(excluded), 'forwardRounds': len(bounds),
                           'protectedDecisionRowsWithoutDart': len(daily_ids)-len(protected),
                           'collectionReceipts': len(receipts)})
    data_errors = set(errors) - {'ARCHIVE_KEY_MISSING'}
    latest = max(receipts, key=lambda r: r['checkedAt']) if receipts else {}
    if latest.get('sourceStatus') == 'EVENT_DATA_ERROR':
        data_errors.add('COLLECTION_DATA_ERROR')
    if data_errors:
        report.update(status='DATA_ERROR')
        report['researchFocus'].update(status='BLOCKED', researchRecommended=False, signalCohorts=[])
    D._atomic_json(root/output_path, report)
    return report


def refresh_safely(root=ROOT, **kwargs):
    try:
        return refresh(root, **kwargs)
    except Exception:
        # A stale success must not hide a new archive/integrity failure.
        failed = {'version': VERSION, 'generatedAt': T.iso_now(), 'status': 'DATA_ERROR',
                  'researchFocus': {'status': 'BLOCKED', 'researchRecommended': False,
                                    'candidateCreated': False, 'productionChangesAllowed': False},
                  'productionChangesAllowed': False, 'accuracyImprovementProven': False, 'llmCalls': 0}
        output = kwargs.get('output_path', DAILY_REPORT)
        if output not in (DAILY_REPORT, REPORT):
            raise ValueError('DART study writes only observation paths')
        D._atomic_json(Path(root)/output, failed)
        return failed


if __name__ == '__main__':
    result = refresh_safely()
    print(json.dumps({k: result.get(k) for k in ('status', 'sourceStatus', 'researchFocus')}, ensure_ascii=False))
