#!/usr/bin/env python3
"""Public production decision evidence; no research, trading or model changes.

The existing date-partition store supplies atomic writes, compression and readback.
Each actual analysis round gets its own immutable compressed file. Outcomes and
later disclosure observations are separate; the browser receives only a summary.
"""
import argparse
import datetime as dt
import gzip
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import tarfile

import research_store
from krx_calendar import is_krx_trading_day, future_trading_period

HERE = Path(__file__).resolve().parent
ROOT = HERE / 'research_archive' / 'decisions'
KST = dt.timezone(dt.timedelta(hours=9))


class IntegrityError(ValueError):
    """Evidence changed or could not be read back; do not publish a success."""


def _now():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def _hash(value):
    return hashlib.sha256(_json(value).encode('utf-8')).hexdigest()


def _moment(raw):
    try:
        value = dt.datetime.fromisoformat(str(raw).replace('Z', '+00:00'))
        return value if value.tzinfo else value.replace(tzinfo=KST)
    except ValueError:
        return None


def _day(raw):
    text = str(raw or '')
    if re.fullmatch(r'\d{8}', text):
        text = text[:4] + '-' + text[4:6] + '-' + text[6:]
    try:
        return dt.date.fromisoformat(text[:10]).isoformat()
    except ValueError:
        return None


def _number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    body = _json(value) + '\n'
    if path.exists() and path.read_text(encoding='utf-8') == body:
        return
    tmp = path.with_suffix(path.suffix + '.tmp')
    with tmp.open('w', encoding='utf-8', newline='\n') as handle:
        handle.write(body)
        handle.flush()
        os.fsync(handle.fileno())
    if json.loads(tmp.read_text(encoding='utf-8')) != value:
        raise IntegrityError('JSON readback mismatch')
    os.replace(tmp, path)
    if json.loads(path.read_text(encoding='utf-8')) != value:
        raise IntegrityError('Saved JSON readback mismatch')


class DecisionStore(research_store.ResearchArchiveStore):
    """One immutable round within a date; public production facts only."""
    def __init__(self, root, round_id):
        super().__init__(str(root), record_type='production_decision', encrypt=False)
        self.round_id = round_id

    def segment_path(self, day, compressed=False, encrypted=None):
        return str(Path(self.root) / 'originals' / day[:4] / day[5:7] / day[8:10] /
                   (self.round_id + ('.jsonl.gz' if compressed else '.jsonl')))

    def manifest_path(self, day):
        return self.segment_path(day) + '.manifest.json'

    def append_predictions(self, day, records, today=None):
        previous = self.read_day(day)
        if previous:
            def facts(rows):
                return {r['recordId']: {k:v for k,v in r.items() if k != 'capturedAt'} for r in rows}
            if facts(previous) != facts(records):
                raise IntegrityError('Same analysis round has different original facts')
            return 0, 0
        return super().append_predictions(day, records, today=day)


def make_record(code, stock, payload, captured_at, source_hash=None):
    from build_model_scoreboard import GRADING_POLICY_VERSION
    chief = stock.get('chief') or {}
    at = stock.get('updated') or payload.get('generatedAt')
    if not re.fullmatch(r'\d{6}', str(code)) or not _moment(at):
        raise IntegrityError('Missing actual ticker or generation timestamp')
    # Preserve source values; never infer a price-observation minute from a label.
    original = {
        'schemaVersion': 1, 'recordId': _hash(['actual_auto', code, at])[:32],
        'code': code, 'market': 'KRX', 'source': 'actual_auto', 'tier': 'auto',
        'decisionAt': at, 'date': _day(at), 'base': stock.get('base'),
        'baseAt': stock.get('baseAt'), 'priceObservedAt': stock.get('priceObservedAt'),
        'call': chief.get('call'), 'total': chief.get('total'),
        'confidence': chief.get('confidence'), 'reason': chief.get('reason'),
        'rawTotal': chief.get('rawTotal'), 'riskPenalty': chief.get('riskPenalty'),
        'modelVersion': chief.get('baseModelVersion'),
        'componentVersions': chief.get('componentVersions'),
        'productionConfigVersion': chief.get('productionConfigVersion'),
        'scoringVersion': GRADING_POLICY_VERSION,
        'coverageVersion': payload.get('coverageUniverseVersion'),
        'judgmentWithheld': chief.get('judgmentWithheld'),
        'available': chief.get('available'),
        'priceBasis': {'verified': False, 'reason': 'price_basis_unverified'},
        'corporateActionAtDecision': {'state': 'unavailable',
                                      'reason': 'not_preserved_in_original_analysis'},
        'disclosureAtDecision': stock.get('dart'),
        'capturedAt': captured_at,
        'sourceFile': 'auto_analysis.js',
        'sourceContentHash': source_hash or _hash(payload),
    }
    original['components'] = {name: {key: value.get(key) for key in ('score', 'stance', 'reason')}
                              for name in ('taro', 'diana', 'nova', 'flow')
                              if isinstance((value := stock.get(name)), dict)}
    return original


def capture(payload, root=ROOT, captured_at=None):
    """Preserve an already-generated actual snapshot, without running analysis."""
    captured_at = captured_at or _now()
    if not isinstance(payload, dict) or not isinstance(payload.get('stocks'), dict):
        raise IntegrityError('Actual analysis is unreadable')
    source_hash = _hash(payload)
    records = [make_record(code, stock, payload, captured_at, source_hash)
               for code, stock in sorted(payload['stocks'].items())
               if isinstance(stock, dict) and stock.get('tier') == 'auto'
               and not stock.get('recon') and isinstance(stock.get('chief'), dict)]
    if not records:
        return []
    at = payload.get('generatedAt')
    if not _moment(at) or any(r['date'] != _day(at) for r in records):
        raise IntegrityError('Mixed or unknown analysis generation dates')
    day = _day(at)
    store = DecisionStore(root, _hash(['actual_auto', at])[:24])
    store.append_predictions(day, records, today=day)
    saved = store.read_day(day)
    expected = {r['recordId'] for r in records}
    if len(saved) != len(records) or {r['recordId'] for r in saved} != expected:
        raise IntegrityError('Original decision write was not verified')
    tomorrow = (dt.date.fromisoformat(day) + dt.timedelta(days=1)).isoformat()
    result = store.compress_segment(day, today=tomorrow)
    if result.get('status') not in (research_store.OK, 'ALREADY_COMPRESSED'):
        raise IntegrityError('Original compression verification failed')
    if store.read_day(day) != saved:
        raise IntegrityError('Compressed original readback mismatch')
    return saved


def read_records(root=ROOT):
    records = {}
    for path in sorted((Path(root) / 'originals').glob('**/*.jsonl.gz')):
        day = '-'.join(path.parts[-4:-1])
        store = DecisionStore(root, path.name.split('.')[0])
        if store.verify_archive(day)['status'] != research_store.OK:
            raise IntegrityError('Stored original failed manifest verification')
        rows = [r for _,r in research_store._iter_jsonl(str(path))]
        for row in rows:
            key = row['recordId']
            if key in records:
                raise IntegrityError('Duplicate original identity')
            records[key] = row
    return list(records.values())


def daily_records(records):
    """Existing aggregation: latest actual automatic decision per ticker/day."""
    by_day = {}
    for row in records:
        if row.get('source') != 'actual_auto' or row.get('tier') != 'auto':
            continue
        key = row['code'], row['date']
        if key not in by_day or row['decisionAt'] > by_day[key]['decisionAt']:
            by_day[key] = row
    return [by_day[key] for key in sorted(by_day)]


def evaluate(row, price_history, as_of, comparison=None):
    """Strict eligibility, then the existing score_call; no new grading rule."""
    from compute_team_weights import score_call
    out = {'recordId': row['recordId'], 'horizon': 5, 'status': 'blocked',
           'reason': 'invalid_record', 'ret': None, 'verdict': None, 'dueOn': None,
           'asOf': as_of, 'scoringVersion': row.get('scoringVersion')}
    out['decisionOn'] = _day(row.get('decisionAt'))
    if row.get('judgmentWithheld') or row.get('call') == 'JUDGMENT_WITHHELD':
        out.update(status='withheld', reason='judgment_withheld')
        return out
    day = _day(row.get('decisionAt'))
    if not day or row.get('call') not in ('BUY', 'HOLD', 'SELL'):
        return out
    if not is_krx_trading_day(dt.date.fromisoformat(day)):
        out['reason'] = 'non_trading_day'
        return out
    due = future_trading_period(day, 5)['periodEnd']
    out['dueOn'] = due
    if due >= as_of:  # final daily close must already be available, not an intraday candle
        out.update(status='pending', reason='future_session')
        return out
    prices = {r['date']: r.get('close') for p in price_history.get(row['code'], [])
              for r in p.get('days', []) if r.get('date')}
    cursor = dt.date.fromisoformat(day)
    while cursor.isoformat() <= due:
        if is_krx_trading_day(cursor) and (not _number(prices.get(cursor.isoformat())) or prices[cursor.isoformat()] <= 0):
            out['reason'] = 'missing_price'
            return out
        cursor += dt.timedelta(days=1)
    basis = row.get('priceBasis') or {}
    if not _number(row.get('base')) or row['base'] <= 0 or not basis.get('verified') or not basis.get('sourceRef'):
        out['reason'] = 'price_basis_unverified'
        return out
    comparison = comparison or {}
    if comparison.get('state') == 'event_found':
        out['reason'] = 'corporate_action_event'
        return out
    if (comparison.get('state') != 'checked_no_event' or not comparison.get('sourceRef') or
        not comparison.get('priceBasisVerified') or comparison.get('priceBasis') != basis.get('basis') or
        not _day(comparison.get('from')) or _day(comparison['from']) > day or
        not _day(comparison.get('to')) or _day(comparison['to']) < due):
        out['reason'] = 'corporate_action_unverified'
        return out
    ret = (prices[due] - row['base']) / row['base'] * 100
    out.update(status='evaluated', reason=None, ret=ret, verdict=score_call(row['call'], ret),
               outcomeClose=prices[due], comparisonEvidence=comparison)
    return out


def load_outcomes(root=ROOT):
    out = {}
    for path in sorted((Path(root) / 'outcomes').glob('*.json')):
        for row in json.loads(path.read_text(encoding='utf-8')):
            if row['recordId'] in out:
                raise IntegrityError('Duplicate outcome identity')
            out[row['recordId']] = row
    return out


def save_outcomes(rows, root=ROOT):
    previous = load_outcomes(root)
    for row in rows:
        old = previous.get(row['recordId'])
        if old and old['status'] == 'evaluated' and old != row:
            raise IntegrityError('Evaluated outcome cannot be overwritten')
    # Monthly partitions retain old/delisted tickers without a file per ticker/day.
    previous.update({r['recordId']:r for r in rows})
    buckets = {}
    for key,row in sorted(previous.items()):
        buckets.setdefault(str(row.get('decisionOn') or 'undated')[:7], []).append(row)
    for prefix,items in buckets.items():
        _atomic_json(Path(root) / 'outcomes' / (prefix + '.json'), items)
    if load_outcomes(root) != previous:
        raise IntegrityError('Outcome readback mismatch')


def merge_outcomes(left, right):
    """Union identities; immutable grades never lose to a newer waiting row."""
    merged = dict(left)
    for key, row in right.items():
        old = merged.get(key)
        if not old or old == row:
            merged[key] = row
        elif old['status'] == 'evaluated' and row['status'] == 'evaluated':
            raise IntegrityError('Conflicting evaluated outcomes')
        elif row['status'] == 'evaluated':
            merged[key] = row
        elif old['status'] == 'evaluated':
            continue
        elif row.get('asOf') and old.get('asOf') and row['asOf'] != old['asOf']:
            merged[key] = max((row, old), key=lambda r:r['asOf'])
        else:
            raise IntegrityError('Conflicting ungraded states at the same observation date')
    return merged


def _evidence_gap(code, row, source, now):
    if not isinstance(row, dict): return 'not_looked_up'
    identity = 'corp_code_map' if source == 'OPENDART_API' else 'repIsuSrtCd'
    if row.get('source') != source or row.get('identityBasis') != identity or row.get('derivedFrom'):
        return 'source_identity_unverified'
    if row.get('ticker') != code or row.get('tickerMatched') is not True: return 'ticker_mismatch'
    if row.get('ok') is not True or row.get('error'): return 'lookup_failed'
    if row.get('apiStatus') not in (('000','013') if source == 'OPENDART_API' else ('ROWS','EMPTY')):
        return 'api_status_unverified'
    if row.get('structureVerified') is not True or not row.get('parserVersion') or not row.get('responseRef'):
        return 'response_unverified'
    pages,got,total,ids = [row.get(k) for k in ('pagesExpected','pagesCollected','totalCount','collectedIds')]
    if not all(isinstance(n,int) and not isinstance(n,bool) and n >= 0 for n in (pages,got,total)):
        return 'page_count_missing'
    if got < max(1,pages) or not isinstance(ids,list) or len(ids) != total or len(set(ids)) != total:
        return 'incomplete_pages'
    start,end = _day(row.get('from')),_day(row.get('to'))
    query,expires = _moment(row.get('queriedAt')),_moment(row.get('expiresAt'))
    if not start or not end or start > end or not query or query > now or not expires or expires <= now:
        return 'expired_or_unknown_scope'
    if not row.get('historicalBackfillComplete'): return 'history_unverified'
    return None


def disclosure_state(code, dart, kind, now):
    """Observed corporate-action scope, never investment scoring or all-news safety."""
    instant = _moment(now)
    if not instant: raise IntegrityError('Observation time missing')
    sources,events,gaps = [],{},[]
    conflict = False
    for row,source in ((dart,'OPENDART_API'),(kind,'KRX')):
        gap = _evidence_gap(code,row,source,instant)
        if gap:
            gaps.append(source + ':' + gap)
            continue
        sources.append({key:row.get(key) for key in (
            'source','retrievalPath','ticker','identityBasis','from','to','queriedAt','expiresAt',
            'pagesExpected','pagesCollected','totalCount','responseRef','parserVersion')})
        for finding in row.get('findings') or []:
            receipt = str(finding.get('id') or '')
            if not re.fullmatch(r'\d{14}',receipt) or not finding.get('title'):
                gaps.append(source + ':unidentified_filing')
                continue
            # Same receipt from two retrieval paths is one filing, not two confirmations.
            if receipt in events and events[receipt]['title'] != finding['title']:
                conflict = True
                gaps.append('conflicting_receipt:' + receipt)
            events.setdefault(receipt, {'receiptId':receipt, 'ticker':code, 'title':finding['title'],
                'source':source, 'receivedOn':finding.get('receivedOn'), 'publishedAt':None,
                'firstObservedAt':row.get('queriedAt'), 'firstObservedScope':'earliest_preserved_collector_observation',
                'correction':'정정' in finding['title'], 'withdrawn':'철회' in finding['title'],
                'originalReceiptId':finding.get('originalReceiptId'),
                'url': ('https://dart.fss.or.kr/dsaf001/main.do?rcpNo=' + receipt if source == 'OPENDART_API'
                        else 'https://kind.krx.co.kr/common/disclsviewer.do?acptno=' + receipt)})
            events[receipt]['firstObservedAt']=min(
                events[receipt]['firstObservedAt'],row['queriedAt'],key=_moment)
    state = 'unavailable' if gaps else 'checked_no_event'
    if events: state = 'event_found'
    if conflict or any(isinstance(r,dict) and r.get('uninterpreted') for r in (dart,kind)):
        state = 'needs_review'
    return {'state':state, 'reasons':gaps, 'observedAt':now, 'sources':sources,
            'events':list(events.values()), 'scope':'기업행사·거래소 시장조치 조회 범위. 뉴스 전체나 악재 없음 확인이 아닙니다.'}


def summarize(records, outcomes, current_model=None):
    from build_model_scoreboard import MIN_UNIQUE_DATES
    from compute_team_weights import BASE_MODEL_VERSION
    current_model = current_model or BASE_MODEL_VERSION
    daily = daily_records(records)
    def group(raw, selected):
        counts = dict(evaluated=0,pending=0,blocked=0,withheld=0,hit=0,miss=0,neutral=0,accuracy=None,reasons={})
        evaluated_days = set()
        distribution = {}
        for row in selected:
            distribution[row['call']] = distribution.get(row['call'],0) + 1
            outcome = outcomes.get(row['recordId']) or {'status':'blocked','reason':'outcome_not_saved'}
            counts[outcome['status']] += 1
            if outcome.get('reason'):
                reason=outcome['reason']; counts['reasons'][reason]=counts['reasons'].get(reason,0)+1
            if outcome['status'] == 'evaluated':
                evaluated_days.add(row['date'])
                verdict = outcome.get('verdict')
                counts[verdict if verdict in ('hit','miss') else 'neutral'] += 1
        denominator = counts['hit'] + counts['miss']
        counts['accuracyDenominator'] = denominator
        counts['minUniqueDecisionDays'] = MIN_UNIQUE_DATES
        counts['evaluatedDecisionDays'] = len(evaluated_days)
        if len(evaluated_days) >= MIN_UNIQUE_DATES and denominator:
            counts['accuracy'] = round(100 * counts['hit']/denominator,1)
        counts['evidenceStatus'] = 'RECORDS_ACCUMULATING'  # count alone never certifies performance
        return {'rawRecordCount':len(raw),'dailyRecordCount':len(selected),
                'uniqueDecisionDays':len({r['date'] for r in selected}),
                'actionDistribution':distribution,'horizons':{'5':counts}}
    result = group(records,daily)
    result.update(schemaVersion=1,source='actual_auto',currentModelVersion=current_model,
                  latestDecisionAt=max((r['decisionAt'] for r in records),default=None),
                  byModelVersion={v:group([r for r in records if (r.get('modelVersion') or 'unknown') == v],
                                         [r for r in daily if (r.get('modelVersion') or 'unknown') == v])
                                  for v in sorted({r.get('modelVersion') or 'unknown' for r in records})})
    h=result['horizons']['5']
    result['status'] = 'NO_RECORDS' if not records else ('DATA_INSUFFICIENT' if h['blocked'] else 'WAITING' if h['pending'] else 'PROCESSED')
    result['examples']=[dict(recordId=r['recordId'],code=r['code'],decisionAt=r['decisionAt'],call=r['call'],
                             base=r['base'],baseAt=r['baseAt'],status=outcomes.get(r['recordId'],{}).get('status'),
                             reason=outcomes.get(r['recordId'],{}).get('reason')) for r in daily[:3]]
    result['limitations']=[
        '원본 보존을 시작한 실제 자동분석만 연결합니다. 과거 판단을 재구성하지 않습니다.',
        '하루 여러 판단을 보존하지만 성적은 종목·판단일당 마지막 자동판단 1건입니다.',
        '현재 시세 자료에는 수정주가·기업행사 조정 확인 근거가 없어 평가일이 와도 확인 전에는 채점을 보류합니다.',
        '기존 일별 이력 성적은 별도 참고 집계입니다. 아래 엄격한 원본 연결 건수와 같은 분모가 아닙니다.',
        '기본모델은 기존 5거래일 기준입니다. 연구모델의 5·20·60거래일 검증은 그대로 유지합니다.',
    ]
    return result


def refresh(root=ROOT, repo=HERE, now=None):
    """Save outcomes and observations, verify readback, then return public summary."""
    from archive_analysis import load_js_object
    now = now or _now()
    repo = Path(repo)
    rows = read_records(root)
    prices = load_js_object(str(repo/'price_history.js'),'PRICE_HISTORY')
    if prices is None: raise IntegrityError('Price history unreadable')
    previous = load_outcomes(root)
    as_of = _moment(now).astimezone(KST).date().isoformat()
    updated = [previous[r['recordId']] if previous.get(r['recordId'],{}).get('status') == 'evaluated'
               else evaluate(r,prices,as_of) for r in daily_records(rows)]
    save_outcomes(updated,root)
    saved=load_outcomes(root)
    bundles=[]
    for name in ('corporate_action_evidence','kind_market_action_evidence'):
        path=repo/'gaeo_coverage'/(name+'.json')
        try: bundles.append(json.loads(path.read_text(encoding='utf-8')).get('evidence') or {})
        except (OSError,ValueError): bundles.append({})
    observations={code:disclosure_state(code,bundles[0].get(code),bundles[1].get(code),now)
                  for code in sorted({r['code'] for r in rows})}
    # Content-addressed observations preserve previous receipt/first-seen facts on updates.
    for code,observation in observations.items():
        for event in observation['events']:
            event_path=Path(root)/'events'/(event['receiptId']+'.json')
            if event_path.exists():
                first=json.loads(event_path.read_text(encoding='utf-8'))
                if any(first.get(k) != event.get(k) for k in ('ticker','title','receivedOn','originalReceiptId')):
                    observation['state']='needs_review'
                    observation['reasons'].append('conflicting_preserved_receipt:'+event['receiptId'])
                event['firstObservedAt']=first['firstObservedAt']
            else:
                _atomic_json(event_path,event)
    facts={code:{k:v for k,v in observation.items() if k != 'observedAt'}
           for code,observation in observations.items()}
    path=Path(root)/'disclosures'/(_hash(facts)[:24]+'.json.gz')
    if not path.exists():
        path.parent.mkdir(parents=True,exist_ok=True)
        body=_json({'observedAt':now,'byCode':observations}).encode('utf-8')
        tmp=path.with_suffix('.tmp')
        with tmp.open('wb') as handle:
            handle.write(gzip.compress(body,mtime=0));handle.flush();os.fsync(handle.fileno())
        if gzip.decompress(tmp.read_bytes()) != body:
            raise IntegrityError('Disclosure observation readback mismatch')
        os.replace(tmp,path)
    result=summarize(rows,saved)
    result['lastVerifiedAt']=now
    counts={key:0 for key in ('event_found','checked_no_event','unavailable','needs_review')}
    for observation in observations.values(): counts[observation['state']] += 1
    result['disclosure']={'statuses':counts,'byCode':{c:o['state'] for c,o in observations.items()},
                          'observedAt':now,'scope':'기업행사 및 거래소 시장조치. 뉴스 전체 확인이 아닙니다.'}
    for example in result['examples']:
        original=next(r for r in rows if r['recordId'] == example['recordId'])
        round_id=_hash(['actual_auto',original['decisionAt']])[:24]
        path=DecisionStore(root,round_id).existing_segment(original['date'])
        if path:
            example['sourcePath']=os.path.relpath(path,repo).replace(os.sep,'/')
        example['outcomePath']=os.path.relpath(Path(root)/'outcomes'/(original['date'][:7]+'.json'),repo).replace(os.sep,'/')
    _atomic_json(Path(root)/'status.json',result)
    return result


def safe_merge(ref, repo=HERE):
    """Analysis runner merge: union identities before accepting generated files.

    Unrelated generated files keep the runner's existing merge policy. Original
    rounds/events cannot be chosen by file age, and both sides' outcomes survive.
    """
    repo=Path(repo)
    prefix='research_archive/decisions/'
    def git(*args):
        return subprocess.run(['git',*args],cwd=repo,check=True,capture_output=True,timeout=120)
    ours=git('rev-parse','HEAD').stdout.decode().strip()
    def tree(revision):
        text=git('ls-tree','-r',revision,'--',prefix).stdout.decode()
        return {line.split('\t',1)[1]:line.split()[2] for line in text.splitlines()}
    left,right=tree(ours),tree(ref)
    immutable=lambda path:any('/'+part+'/' in path for part in ('originals','events','disclosures'))
    for path in set(left)&set(right):
        if immutable(path) and left[path] != right[path]:
            raise IntegrityError('Conflicting immutable evidence: '+path)
    def outcomes(tree_rows):
        rows={}
        for path,blob in tree_rows.items():
            if '/outcomes/' in path and path.endswith('.json'):
                for row in json.loads(git('cat-file','blob',blob).stdout):
                    if row['recordId'] in rows: raise IntegrityError('Duplicate outcome in git evidence')
                    rows[row['recordId']]=row
        return rows
    combined=merge_outcomes(outcomes(left),outcomes(right))
    # Refuse overwriting unrelated local edits; this path runs after the cycle commit.
    if git('status','--porcelain').stdout.strip():
        raise IntegrityError('Runner merge needs a committed working tree')
    if subprocess.run(['git','merge-base','--is-ancestor',ref,'HEAD'],cwd=repo).returncode == 0:
        return 0
    # Even a fast-forward must stay provisional until preservation and readback pass.
    merged=subprocess.run(['git','merge','-X','ours','--no-ff','--no-commit',ref],cwd=repo,timeout=120)
    if merged.returncode:
        subprocess.run(['git','merge','--abort'],cwd=repo,timeout=30,check=False)
        return merged.returncode
    try:
        for path,blob in {**left,**right}.items():
            if not immutable(path): continue
            target=repo/path
            if not target.exists():
                target.parent.mkdir(parents=True,exist_ok=True)
                target.write_bytes(git('cat-file','blob',blob).stdout)
            if git('hash-object',path).stdout.decode().strip() != blob:
                raise IntegrityError('Merged tree lost immutable evidence: '+path)
        # Existing evaluated rows are retained by the union before the file writer.
        save_outcomes(list(combined.values()),repo/prefix)
        from build_model_scoreboard import write_decision_trace
        write_decision_trace(repo=repo)
        git('add',prefix,'model_scoreboard.js')
        git('commit','-m','Preserve both analysis decision ledgers and refresh verified summary [skip ci]')
    except Exception:
        # Include newly generated evidence in the provisional index so abort restores
        # precisely the pre-merge tree; no completed commit or later push can bypass it.
        git('add','-A','--',prefix,'model_scoreboard.js')
        if (repo/'model_scoreboard.js.tmp').exists():
            git('add','-f','--','model_scoreboard.js.tmp')
        git('merge','--abort')
        if git('rev-parse','HEAD').stdout.decode().strip() != ours or git('status','--porcelain').stdout.strip():
            raise IntegrityError('Failed to restore the pre-merge runner state')
        raise
    return 0


def recovery_bundle(target, repo=HERE):
    """Keep unpublished public evidence as an Actions artifact on runner exit."""
    repo=Path(repo)
    prefix='research_archive/decisions/'
    result=subprocess.run(['git','ls-tree','-r','origin/main','--',prefix],cwd=repo,
                          capture_output=True,timeout=60,check=True)
    remote={line.split('\t',1)[1]:line.split()[2] for line in result.stdout.decode().splitlines()}
    pending=[]
    for path in sorted((repo/prefix).rglob('*')):
        if not path.is_file() or path.suffix == '.tmp': continue
        relative=path.relative_to(repo).as_posix()
        blob=subprocess.run(['git','hash-object',relative],cwd=repo,capture_output=True,
                            timeout=10,check=True).stdout.decode().strip()
        if remote.get(relative) != blob: pending.append(path)
    if not pending: return False
    with tarfile.open(target,'w:gz') as archive:
        for path in pending: archive.add(path,arcname=path.relative_to(repo).as_posix())
    with tarfile.open(target,'r:gz') as archive:
        for member,path in zip(archive.getmembers(),pending):
            if archive.extractfile(member).read() != path.read_bytes():
                raise IntegrityError('Recovery artifact readback mismatch')
    return True


def main():
    from archive_analysis import load_js_object
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--capture',action='store_true')
    parser.add_argument('--merge-ref')
    parser.add_argument('--recovery-bundle')
    args=parser.parse_args()
    if args.merge_ref:
        raise SystemExit(safe_merge(args.merge_ref))
    if args.recovery_bundle:
        print('pending=' + str(recovery_bundle(args.recovery_bundle)).lower())
        return
    if args.capture:
        capture(load_js_object(str(HERE/'auto_analysis.js'),'LIVE_AUTO'))
    report=refresh()
    print(_json({k:report[k] for k in ('status','rawRecordCount','dailyRecordCount','uniqueDecisionDays')}))


if __name__ == '__main__': main()
