"""Decision-period corporate actions and separately preserved price-basis proof.

No network, trading, inference of adjustment ratios, or mutation of a decision.
Current collector summaries describe 'open now'; only original findings are used.
"""
import gzip
import json
import os
import re
from pathlib import Path
from urllib.parse import urlparse

import corporate_action_classify as corporate
import kind_market_action_classify as market
import decision_records as dr

SCOPE_VERSION='price-comparison-v1'
EXTRA_TERMS=('주식병합','주식분할','액면병합','권리락','배당락','기준가격','거래중단','재상장','변경상장','정리매매',
             '현금배당','현금·현물배당','현금및현물배당')
# data-dbg.krx.co.kr = KRX Open API(openapi.krx.co.kr 포털)의 실제 서비스 호출 호스트(2026-09-16, krx_openapi_client 참조).
# 호스트 허용은 '공식 자료일 수 있다'는 뜻일 뿐이다 — 원문 hash 바인딩·기간·기준 검사는 그대로 전부 통과해야 한다.
OFFICIAL_HOSTS={'kind.krx.co.kr','data.krx.co.kr','data-dbg.krx.co.kr','openapi.krx.co.kr','dart.fss.or.kr','opendart.fss.or.kr'}


def relevant(title):
    """Additional observation scope; never changes the existing collector's scoring inputs."""
    return bool(corporate.classify(title)['effects'] or any(t in title for t in EXTRA_TERMS))


def _official(value):
    try:
        url=urlparse(str(value))
        return url.scheme=='https' and url.hostname in OFFICIAL_HOSTS and not url.username and bool(url.path.strip('/'))
    except ValueError:
        return False


def _reference(value):
    return (isinstance(value,dict) and _official(value.get('sourceRef')) and
            isinstance(value.get('document'),(dict,list)) and
            value.get('responseRef')=='sha256:'+dr._hash(value['document']))


def _bound(value,path,expected):
    if not _reference(value) or not isinstance(path,str) or not path.startswith('/'): return False
    node=value['document']
    try:
        for part in path[1:].split('/'):
            part=part.replace('~1','/').replace('~0','~')
            node=node[int(part)] if isinstance(node,list) else node[part]
        return node==expected
    except (KeyError,TypeError,ValueError,IndexError): return False


def _days(start,end):
    day=dr.dt.date.fromisoformat(start);last=dr.dt.date.fromisoformat(end);result=[]
    while day<=last:
        if dr.is_krx_trading_day(day): result.append(day.isoformat())
        day+=dr.dt.timedelta(days=1)
    return result


def _event(finding,source,ticker):
    title=' '.join(str(finding.get('title') or '').split())
    c=corporate.classify(title); k=market.classify(title)
    kinds=sorted(set(c['terms']+[t for t in EXTRA_TERMS if t in title]))
    halt=k['effect']==market.HALT or '거래중단' in title
    affects=bool(kinds or halt or k['effect'] in (market.LISTING,market.PRICE_BASIS))
    if c['subject']==corporate.SUBSIDIARY: affects=False
    # Official date fields are optional. A receipt day is never an effective day.
    start=dr._day(finding.get('effectiveOn') or finding.get('effectiveFrom'))
    end=dr._day(finding.get('effectiveOn') or finding.get('effectiveTo'))
    receipt=str(finding.get('id') or '')
    detail=finding.get('detailEvidence') or {}
    identity=(isinstance(detail,dict) and _bound(detail,detail.get('tickerPath'),ticker) and
              _bound(detail,detail.get('receiptIdPath'),receipt))
    if (not identity or not _official(finding.get('effectiveSourceRef')) or
        detail.get('sourceRef')!=finding.get('effectiveSourceRef') or
        not start or not end or not _bound(detail,detail.get('fromPath'),start) or
        not _bound(detail,detail.get('toPath'),end)): start=end=None
    parent=finding.get('originalReceiptId')
    parent_verified=not parent or (identity and _bound(detail,detail.get('parentPath'),parent))
    return {'receiptId':receipt,'title':title,'source':source,'receivedOn':dr._day(finding.get('receivedOn')),
            'sourceRef':('https://dart.fss.or.kr/dsaf001/main.do?rcpNo=' if source=='OPENDART_API'
                         else 'https://kind.krx.co.kr/common/disclsviewer.do?acptno=')+receipt,
            'originalReceiptId':parent if parent_verified else None,'unverifiedParent':not parent_verified,
            'correction':c['stage']==corporate.CORRECTION,'withdrawn':c['stage']==corporate.WITHDRAWN,
            'kinds':kinds,'affectsPrice':affects,'halt':halt,'effectiveFrom':start,'effectiveTo':end,
            'effectiveSourceRef':finding.get('effectiveSourceRef'),
            'detailEvidence':detail if identity else None,
            'uninterpreted':bool(k['effect']==market.UNKNOWN and not kinds and c['subject']!=corporate.SUBSIDIARY)}


def _events(sources,start,end,ticker):
    documents={};conflicts=[]
    for source,findings in sources:
        for finding in findings:
            if not isinstance(finding,dict) or not re.fullmatch(r'\d{14}',str(finding.get('id') or '')):
                conflicts.append('unidentified_filing');continue
            item=_event(finding,source,ticker);key=item['receiptId']
            if not item['receivedOn']: conflicts.append('receipt_date_unverified:'+key)
            if item['unverifiedParent']: conflicts.append('unverified_correction_parent:'+key)
            prior=documents.get(key)
            facts=lambda r:{k:v for k,v in r.items() if k not in ('source','sourceRef','observedSources')}
            if prior and facts(prior)!=facts(item): conflicts.append('conflicting_receipt:'+key)
            else:
                item['observedSources']=(prior or {}).get('observedSources',[])+[{'source':source,'sourceRef':item['sourceRef']}]
                documents[key]=item
    groups={}
    for key,item in documents.items():
        current=item;seen={key}
        if item['correction'] and not item['originalReceiptId']:
            conflicts.append('unlinked_correction:'+key)
        while current.get('originalReceiptId'):
            parent=current['originalReceiptId']
            if parent in seen or parent not in documents:
                conflicts.append('invalid_correction_chain:'+key);break
            seen.add(parent);current=documents[parent]
        groups.setdefault(current['receiptId'],[]).append(item)
    result=[]
    for root,revisions in sorted(groups.items()):
        parents={r['originalReceiptId'] for r in revisions if r['originalReceiptId']}
        leaves=[r for r in revisions if r['receiptId'] not in parents]
        if len(leaves)!=1:
            conflicts.append('ambiguous_correction_chain:'+root)
        latest=leaves[0] if leaves else revisions[0]
        applied_start,applied_end=latest['effectiveFrom'],latest['effectiveTo']
        if applied_start and applied_end and applied_start>applied_end:
            conflicts.append('invalid_effective_period:'+root)
        # A withdrawal/termination title alone does not prove that past price effects vanished.
        affects=any(r['affectsPrice'] for r in revisions)
        overlaps=affects and (not applied_start or not applied_end or not (applied_end<start or applied_start>end))
        if latest['uninterpreted']: conflicts.append('filing_needs_document:'+root)
        result.append({'eventId':root,'receiptIds':sorted(r['receiptId'] for r in revisions),
                       'latestReceiptId':latest['receiptId'],'title':latest['title'],
                       'kinds':sorted({k for r in revisions for k in r['kinds']}),
                       'effectiveFrom':applied_start,'effectiveTo':applied_end,'overlaps':bool(overlaps),
                       'halt':any(r['halt'] for r in revisions),'revisions':sorted(revisions,key=lambda r:r['receiptId'])})
    # DART and KIND can assign different IDs to the same disclosure. Exact title/day
    # candidates form ONE unresolved group, never a guessed authoritative identity.
    grouped={};merged=[]
    for item in result:
        latest=documents[item['latestReceiptId']]
        signature=(latest['receivedOn'],re.sub(r'\s+','',latest['title']))
        previous=grouped.get(signature)
        source_set=lambda event:{s['source'] for r in event['revisions'] for s in r['observedSources']}
        if signature[0] and previous and source_set(previous)!=source_set(item):
            conflicts.append('cross_source_identity_unverified:'+previous['eventId'])
            previous.update(identityStatus='unconfirmed_cross_source_group',
                            receiptIds=sorted(set(previous['receiptIds']+item['receiptIds'])),
                            revisions=previous['revisions']+item['revisions'],
                            overlaps=previous['overlaps'] or item['overlaps'],halt=previous['halt'] or item['halt'])
        else:
            grouped[signature]=item;merged.append(item)
    return merged,sorted(set(conflicts))


def _price_proof(record,proof,start,end,now):
    """Validate an explicit upstream official proof, never infer basis from OHLC similarity.

    Reference hashes bind the evidence for audit; they do not authenticate the publisher.
    These files are producer-owned public records subject to the normal reviewed PR path.
    """
    if not isinstance(proof,dict): return None,'price_basis_unverified'
    observed=dr._moment(proof.get('observedAt'))
    original_at=dr._moment(record.get('priceObservedAt'))
    if (proof.get('schemaVersion')!=1 or proof.get('recordId')!=record['recordId'] or
        proof.get('originalRecordHash')!=dr._hash(record) or proof.get('ticker')!=record['code'] or
        proof.get('period')!={'from':start,'to':end} or not observed or observed>dr._moment(now) or
        observed.astimezone(dr.KST).date().isoformat()<=end or proof.get('source')!='KRX' or not _reference(proof) or
        not original_at or original_at>dr._moment(record['decisionAt']) or
        original_at.astimezone(dr.KST).date().isoformat()!=start):
        return None,'price_evidence_invalid'
    basis=proof.get('basis');declared=proof.get('basisEvidence') or {};original=proof.get('originalPriceEvidence') or {}
    dataset=proof.get('datasetId')
    if (not isinstance(declared,dict) or not isinstance(original,dict) or
        not isinstance(dataset,str) or not dataset or not _bound(proof,proof.get('datasetIdPath'),dataset) or
        basis not in ('adjusted','unadjusted') or declared.get('basis')!=basis or not _reference(declared) or
        not _bound(declared,declared.get('valuePath'),basis) or
        not _bound(declared,declared.get('datasetIdPath'),dataset) or
        not _bound(declared,declared.get('periodPath'),proof['period']) or
        original.get('value')!=record.get('base') or original.get('basis')!='unadjusted' or
        not _bound(original,original.get('tickerPath'),record['code']) or
        not _bound(original,original.get('observedAtPath'),record['priceObservedAt']) or
        not _bound(original,original.get('valuePath'),record.get('base')) or
        not _bound(original,original.get('basisPath'),'unadjusted') or
        not _bound(proof,proof.get('tickerPath'),record['code']) or
        not _bound(proof,proof.get('periodPath'),{'from':start,'to':end})):
        return None,'price_evidence_invalid'
    series=proof.get('prices')
    if not isinstance(series,list) or not all(isinstance(r,dict) for r in series): return None,'price_evidence_invalid'
    if not _bound(proof,proof.get('pricesPath'),series): return None,'price_evidence_invalid'
    prices={r.get('date'):r for r in series}
    if len(prices)!=len(series) or set(prices)!=set(_days(start,end)): return None,'price_evidence_invalid'
    for point in prices.values():
        if point.get('final') is not True or not dr._number(point.get('close')) or point['close']<=0:
            return None,'price_evidence_invalid'
        if point.get('volume')==0 or point.get('tradingStatus') in ('halted','suspended'):
            return None,'trading_halt'
    base=record.get('base');adjustment=proof.get('adjustment') or {}
    if not isinstance(adjustment,dict): return None,'price_evidence_invalid'
    if not dr._number(base) or base<=0: return None,'price_evidence_invalid'
    if basis=='adjusted':
        factor=adjustment.get('multiplier')
        if (not _reference(adjustment) or not dr._number(factor) or factor<=0 or
            not _bound(adjustment,adjustment.get('tickerPath'),record['code']) or
            not _bound(adjustment,adjustment.get('datasetIdPath'),dataset) or
            adjustment.get('fromDate')!=start or adjustment.get('toDate')!=end or
            not isinstance(adjustment.get('receiptIds'),list) or
            any(not _bound(adjustment,'/'+k,adjustment.get(k)) for k in ('multiplier','receiptIds','fromDate','toDate'))):
            return None,'price_evidence_invalid'
        base*=factor
    elif adjustment:
        return None,'price_evidence_invalid'
    return {'basis':basis,'comparisonBase':base,'outcomeClose':prices[end]['close'],
            'proofId':dr._hash(proof),'adjustment':adjustment or None},None


def assess(record,dart,kind,now=None,price_proof=None):
    now=now or dr._now();start=dr._day(record['decisionAt'])
    end=dr.future_trading_period(start,5)['periodEnd']
    result={'schemaVersion':1,'policyVersion':SCOPE_VERSION,'recordId':record['recordId'],
            'originalRecordHash':dr._hash(record),'ticker':record['code'],'from':start,'to':end,
            'checkedAt':now,'state':'unknown','reason':'corporate_action_unverified','sources':[],
            'events':[],'gaps':[],'priceProofId':None,'comparisonBase':None,'outcomeClose':None}
    usable=[]
    for item,source in ((dart,'OPENDART_API'),(kind,'KRX')):
        gap=dr._evidence_gap(record['code'],item,source,dr._moment(now))
        if gap:
            result['gaps'].append(source+':'+gap);continue
        if item.get('retrievalPath')!=('opendart:list.json?corp_code' if source=='OPENDART_API' else 'KRX_KIND_WEB'):
            result['gaps'].append(source+':retrieval_path_unverified');continue
        # Old DART filtered out some price effects. Its empty findings cannot prove absence.
        if source=='OPENDART_API' and item.get('comparisonScopeVersion')!=SCOPE_VERSION:
            result['gaps'].append(source+':comparison_scope_unverified')
        if dr._day(item['from'])>start or dr._day(item['to'])<end:
            result['gaps'].append(source+':comparison_window_incomplete')
        if dr._moment(item['queriedAt']).astimezone(dr.KST).date().isoformat()<=end:
            result['gaps'].append(source+':comparison_window_not_final')
        if item.get('uninterpreted'):
            result['gaps'].append(source+':uninterpreted_filings')
        result['sources'].append({k:item.get(k) for k in ('source','retrievalPath','ticker','identityBasis','from','to',
            'queriedAt','expiresAt','responseRef','parserVersion','pagesCollected','pagesExpected','collectedIds',
            'comparisonScopeVersion')})
        findings=item.get('comparisonFindings') if source=='OPENDART_API' and item.get('comparisonScopeVersion')==SCOPE_VERSION else item.get('findings')
        if not isinstance(findings,list): result['gaps'].append(source+':findings_missing');continue
        if any(not isinstance(f,dict) or f.get('id') not in item['collectedIds'] for f in findings):
            result['gaps'].append(source+':unbound_finding');continue
        details=(price_proof or {}).get('filingDetails',{}) if isinstance(price_proof,dict) else {}
        enriched=[]
        for finding in findings:
            extra=details.get(finding['id']) if isinstance(details,dict) else None
            copied=dict(finding)
            if isinstance(extra,dict):
                for key in ('effectiveOn','effectiveFrom','effectiveTo','effectiveSourceRef','originalReceiptId','detailEvidence'):
                    if key in extra:
                        if key in copied and copied[key]!=extra[key]:
                            result['gaps'].append(source+':uninterpreted_filings')
                        else: copied[key]=extra[key]
            enriched.append(copied)
        usable.append((source,enriched))
    result['events'],conflicts=_events(usable,start,end,record['code'])
    if conflicts or any('uninterpreted_filings' in g for g in result['gaps']):
        result.update(state='review_required',reason='corporate_action_conflict',conflicts=conflicts);return result
    active=[e for e in result['events'] if e['overlaps']]
    if isinstance(price_proof,dict) and price_proof.get('conflictingProofIds'):
        result.update(state='review_required',reason='price_evidence_conflict',
                      conflictingProofIds=price_proof['conflictingProofIds']);return result
    price,price_gap=_price_proof(record,price_proof,start,end,now)
    if price: result.update(priceProofId=price['proofId'],priceBasis=price['basis'],adjustment=price['adjustment'])
    if active:
        result.update(state='adjustment_required',reason='corporate_action_adjustment_required')
        if any(e['halt'] for e in active): result['reason']='trading_halt';return result
        if any(not e['effectiveFrom'] or not e['effectiveTo'] for e in active):
            result['reason']='effective_date_unverified';return result
        covered=set((price or {}).get('adjustment',{}).get('receiptIds',[])) if price and price['adjustment'] else set()
        if not price or price['basis']!='adjusted' or any(e['latestReceiptId'] not in covered for e in active): return result
    if result['gaps'] or len(result['sources'])!=2:
        result.update(state='unknown',reason='corporate_action_unverified');return result
    if not price:
        result.update(state='adjustment_required' if price_gap=='trading_halt' else 'unknown',reason=price_gap);return result
    result.update(state='comparable',reason=None,comparisonBase=price['comparisonBase'],outcomeClose=price['outcomeClose'])
    return result


def save_price_proof(proof,root):
    """Preserve an upstream proof; assess() checks its binding and eligibility before use."""
    if not isinstance(proof,dict) or not re.fullmatch(r'[a-f0-9]{32}',str(proof.get('recordId') or '')):
        raise dr.IntegrityError('Price proof record identity missing')
    key=dr._hash(proof);path=Path(root)/'price_proofs'/(key+'.json')
    if path.exists() and json.loads(path.read_text(encoding='utf-8'))!=proof:
        raise dr.IntegrityError('Conflicting price proof')
    dr._atomic_json(path,proof)
    return key


def load_price_proofs(root):
    groups={}
    for path in sorted((Path(root)/'price_proofs').glob('*.json')):
        proof=json.loads(path.read_text(encoding='utf-8'))
        if dr._hash(proof)!=path.stem: raise dr.IntegrityError('Price proof hash mismatch')
        groups.setdefault(proof['recordId'],[]).append(proof)
    selected={}
    for key,items in groups.items():
        by_id={dr._hash(p):p for p in items};parents={p.get('supersedes') for p in items if p.get('supersedes')}
        leaves=set(by_id)-parents
        valid=len(leaves)==1 and parents<=set(by_id)
        if valid:
            current=next(iter(leaves));visited=set()
            while current and current not in visited:
                visited.add(current);current=by_id[current].get('supersedes')
            valid=current is None and visited==set(by_id)
        selected[key]=by_id[next(iter(leaves))] if valid else {'conflictingProofIds':sorted(by_id)}
    return selected


def save_comparisons(rows,root):
    facts=[{k:v for k,v in row.items() if k!='checkedAt'} for row in sorted(rows,key=lambda r:r['recordId'])]
    relative='comparisons/'+dr._hash(facts)[:24]+'.json.gz';path=Path(root)/relative
    if path.exists():
        saved=json.loads(gzip.decompress(path.read_bytes()))
        if [{k:v for k,v in r.items() if k!='checkedAt'} for r in saved]!=facts:
            raise dr.IntegrityError('Comparison evidence hash conflict')
        return relative,saved
    body=dr._json(sorted(rows,key=lambda r:r['recordId'])).encode('utf-8')
    path.parent.mkdir(parents=True,exist_ok=True);temp=path.with_suffix('.tmp')
    with temp.open('wb') as handle:
        handle.write(gzip.compress(body,mtime=0));handle.flush();os.fsync(handle.fileno())
    if gzip.decompress(temp.read_bytes())!=body: raise dr.IntegrityError('Comparison readback mismatch')
    os.replace(temp,path)
    return relative,json.loads(gzip.decompress(path.read_bytes()))


def read_comparisons(path):
    rows=json.loads(gzip.decompress(Path(path).read_bytes()))
    facts=[{k:v for k,v in row.items() if k!='checkedAt'} for row in rows]
    if dr._hash(facts)[:24]!=Path(path).name.split('.')[0]: raise dr.IntegrityError('Comparison hash mismatch')
    return rows
