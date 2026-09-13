"""Price comparison evidence must prevent mechanical returns from becoming grades."""
import copy
import datetime as dt
import gzip
import json
import tempfile
import unittest
from pathlib import Path

import decision_records as dr
import comparison_evidence as ce
from test_decision_records import auto, proof

NOW='2026-09-15T09:00:00+00:00'
DATES=['2026-09-07','2026-09-08','2026-09-09','2026-09-10','2026-09-11','2026-09-14']

def row():
    payload=auto();payload['stocks']['005930']['priceObservedAt']='2026-09-07T00:59:00+00:00'
    return dr.make_record('005930',payload['stocks']['005930'],payload,'2026-09-07T02:00:00+00:00')

def sources():
    result=[proof(),proof(source='KRX')]
    for item in result:
        item.update(queriedAt='2026-09-15T08:00:00+00:00',expiresAt='2026-09-16T08:00:00+00:00',
                    to='2026-09-15',comparisonScopeVersion=ce.SCOPE_VERSION)
    result[0]['comparisonFindings']=[]
    return result

def event(title='주식분할결정', receipt='20260908000001', **extra):
    item=dict(id=receipt,title=title,receivedOn='20260908',effectiveOn='2026-09-10',
              effectiveSourceRef='https://kind.krx.co.kr/common/disclsviewer.do?acptno='+receipt)
    item.update(extra)
    document={'ticker':'005930','receiptId':receipt,'effectiveFrom':item['effectiveOn'],
              'effectiveTo':item['effectiveOn'],'originalReceiptId':item.get('originalReceiptId')}
    item['detailEvidence']={'sourceRef':item['effectiveSourceRef'],'responseRef':'sha256:'+dr._hash(document),
                            'document':document,'tickerPath':'/ticker','receiptIdPath':'/receiptId',
                            'fromPath':'/effectiveFrom','toPath':'/effectiveTo','parentPath':'/originalReceiptId'}
    return item

def add_event(src, item, index=0):
    s=src[index]
    s['findings'].append(item)
    if index==0: s['comparisonFindings'].append(item)
    s['collectedIds'].append(item['id']);s['totalCount']+=1
    s['apiStatus']='000' if index==0 else 'ROWS'

def price_proof(record=None,adjusted=False):
    record=record or row()
    ref={'sourceRef':'https://data.krx.co.kr/fixture-official-price-document','responseRef':'sha256:'+'a'*64}
    p=dict(schemaVersion=1,recordId=record['recordId'],originalRecordHash=dr._hash(record),ticker='005930',
           period={'from':DATES[0],'to':DATES[-1]},observedAt='2026-09-15T08:00:00+00:00',
           source='KRX',basis='adjusted' if adjusted else 'unadjusted',**ref)
    p['basisEvidence']=dict(ref,basis=p['basis'])
    p['originalPriceEvidence']=dict(ref,value=record['base'],basis='unadjusted')
    p['prices']=[{'date':d,'close':51 if adjusted else 102,'final':True,'volume':1000} for d in DATES]
    if adjusted:
        p['adjustment']=dict(ref,multiplier=0.5,fromDate=DATES[0],toDate=DATES[-1],
                             receiptIds=['20260908000001'])
    def bind(item,document):
        item.update(document=copy.deepcopy(document),responseRef='sha256:'+dr._hash(document))
    p['datasetId']='official-fixture-daily-prices'
    bind(p,{'ticker':p['ticker'],'period':p['period'],'prices':p['prices'],'datasetId':p['datasetId']})
    p.update(tickerPath='/ticker',periodPath='/period',pricesPath='/prices',datasetIdPath='/datasetId')
    bind(p['basisEvidence'],{'basis':p['basis'],'datasetId':p['datasetId'],'period':p['period']})
    p['basisEvidence'].update(valuePath='/basis',datasetIdPath='/datasetId',periodPath='/period')
    bind(p['originalPriceEvidence'],{'basis':'unadjusted','value':record['base'],
                                    'ticker':record['code'],'observedAt':record.get('priceObservedAt')})
    p['originalPriceEvidence'].update(valuePath='/value',basisPath='/basis',tickerPath='/ticker',observedAtPath='/observedAt')
    if adjusted:
        a=p['adjustment'];bind(a,dict({k:a[k] for k in ('multiplier','receiptIds','fromDate','toDate')},
                                     ticker=p['ticker'],datasetId=p['datasetId']))
        a.update(tickerPath='/ticker',datasetIdPath='/datasetId')
    return p

class Comparison(unittest.TestCase):
    def test_refresh_connects_proof_and_detects_missing_comparison_without_rewriting_original(self):
        import ops_status
        with tempfile.TemporaryDirectory() as tmp:
            repo=Path(tmp);root=repo/'research_archive'/'decisions'
            (repo/'price_history.js').write_text('const PRICE_HISTORY = {};',encoding='utf-8')
            payload=auto();payload['stocks']['005930']['priceObservedAt']=row()['priceObservedAt']
            dr.capture(payload,root=root,captured_at='2026-09-07T02:00:00+00:00')
            originals={str(p):p.read_bytes() for p in (root/'originals').rglob('*') if p.is_file()}
            record=dr.read_records(root)[0];src=sources();add_event(src,event())
            (repo/'gaeo_coverage').mkdir()
            for name,data in zip(('corporate_action_evidence','kind_market_action_evidence'),src):
                (repo/'gaeo_coverage'/(name+'.json')).write_text(json.dumps({'evidence':{'005930':data}}),encoding='utf-8')
            first=dr.refresh(root,repo,NOW)
            self.assertEqual(first['horizons']['5']['blocked'],1)
            ce.save_price_proof(price_proof(record,True),root)
            final=dr.refresh(root,repo,NOW)
            self.assertEqual(final['horizons']['5']['evaluated'],1)
            outcome=dr.load_outcomes(root)[record['recordId']]
            self.assertEqual((outcome['ret'],outcome['verdict']),(2.0,'hit'))
            before={str(p):p.read_bytes() for p in root.rglob('*') if p.is_file()}
            self.assertEqual(final,dr.refresh(root,repo,NOW))
            self.assertEqual(before,{str(p):p.read_bytes() for p in root.rglob('*') if p.is_file()})
            self.assertEqual(originals,{p:Path(p).read_bytes() for p in originals})
            (repo/'model_scoreboard.js').write_text('const MODEL_SCOREBOARD = '+json.dumps({'decisionTrace':final})+';',encoding='utf-8')
            self.assertEqual(ops_status.check_decisions(str(repo),dr._moment(NOW))['code'],'DECISIONS_VERIFIED')
            (repo/outcome['comparisonEvidenceRef']).unlink()
            self.assertEqual(ops_status.check_decisions(str(repo),dr._moment(NOW))['code'],'DECISIONS_STORAGE_MISMATCH')

    def assess(self,src=None,p=None,record=None):
        return ce.assess(record or row(),*(src or sources()),now=NOW,price_proof=p)

    def test_normal_uses_verified_same_basis_and_existing_grade(self):
        r=row(); p=price_proof(r)
        comparison=self.assess(p=p)
        self.assertEqual(comparison['state'],'comparable')
        result=dr.evaluate(r,{},'2026-09-15',comparison=comparison)
        self.assertEqual((result['status'],result['verdict'],result['ret']),('evaluated','hit',2.0))

    def test_price_documents_for_wrong_stock_time_or_dataset_cannot_release(self):
        for part,field,value in (('originalPriceEvidence','ticker','000660'),
                                  ('originalPriceEvidence','observedAt','2000-01-01T00:00:00Z'),
                                  ('basisEvidence','datasetId','unrelated-prices')):
            p=price_proof();p[part]['document'][field]=value
            p[part]['responseRef']='sha256:'+dr._hash(p[part]['document'])
            self.assertEqual(self.assess(p=p)['state'],'unknown')
        r=row();r['priceObservedAt']=None
        self.assertEqual(self.assess(p=price_proof(r),record=r)['state'],'unknown')

    def test_stale_original_price_cannot_skip_action_before_decision(self):
        r=row();r['priceObservedAt']='2026-09-02T05:00:00+00:00'
        src=sources();add_event(src,event(effectiveOn='2026-09-03'))
        result=self.assess(src,p=price_proof(r),record=r)
        self.assertEqual(result['state'],'unknown')
        self.assertIsNone(dr.evaluate(r,{},'2026-09-15',comparison=result)['ret'])

    def test_lookup_before_end_of_period_cannot_certify_future_absence(self):
        src=sources();src[0]['queriedAt']='2026-09-14T01:00:00+00:00'
        self.assertEqual(self.assess(src,p=price_proof())['state'],'unknown')

    def test_mechanical_changes_never_become_a_hit_or_miss(self):
        for title in ('주식분할결정','주식병합','감자결정','유상증자결정','무상증자결정',
                      '권리락','배당락 기준가격 안내','합병결정','분할결정','매매거래정지','재상장'):
            with self.subTest(title=title):
                src=sources();add_event(src,event(title))
                c=self.assess(src,p=price_proof())
                self.assertEqual(c['state'],'adjustment_required')
                out=dr.evaluate(row(),{},'2026-09-15',comparison=c)
                self.assertEqual(out['status'],'blocked');self.assertIsNone(out['ret'])
                self.assertIsNone(out['verdict'])

    def test_unknown_adjusted_basis_is_not_inferred_from_prices(self):
        c=self.assess()
        self.assertEqual((c['state'],c['reason']),('unknown','price_basis_unverified'))

    def test_failed_expired_partial_and_old_filter_never_mean_safe(self):
        for bad in ({'ok':False},{'pagesCollected':0},{'to':'2026-09-13'},
                    {'expiresAt':'2026-09-14T00:00:00+00:00'},{'apiStatus':'010'},
                    {'comparisonScopeVersion':None}):
            src=sources();src[0].update(bad)
            self.assertEqual(self.assess(src,p=price_proof())['state'],'unknown')

    def test_receipt_date_is_not_effective_date_and_current_closed_is_not_historical_none(self):
        src=sources();e=event('배당락 기준가격 안내');e.pop('effectiveOn');e.pop('effectiveSourceRef')
        add_event(src,e,index=1);src[1]['events']=[];src[1]['unresolvedHistorical']=0
        c=self.assess(src,p=price_proof())
        self.assertEqual(c['state'],'adjustment_required')
        self.assertIsNone(c['events'][0]['effectiveFrom'])

    def test_same_receipt_on_two_paths_is_one_event(self):
        src=sources();add_event(src,event());add_event(src,event(),index=1)
        self.assertEqual(len(self.assess(src)['events']),1)

    def test_cross_source_different_receipts_are_one_unconfirmed_group(self):
        src=sources();add_event(src,event('주권매매거래정지','20260908900498'))
        add_event(src,event('주권매매거래정지','20260908000498'),index=1)
        result=self.assess(src)
        self.assertEqual(result['state'],'review_required')
        self.assertEqual(len(result['events']),1)
        self.assertEqual(len(result['events'][0]['receiptIds']),2)

    def test_effective_date_and_correction_link_need_bound_original_document(self):
        for field in ('detailEvidence','effectiveSourceRef'):
            src=sources();e=event(effectiveOn='2026-10-01');e.pop(field);add_event(src,e)
            self.assertNotEqual(self.assess(src,p=price_proof())['state'],'comparable')
        src=sources();add_event(src,event())
        e=event('[기재정정] 주식분할결정','20260909000001',originalReceiptId='20260908000001',effectiveOn='2026-10-01')
        e['detailEvidence']['document']['originalReceiptId']='unrelated'
        e['detailEvidence']['responseRef']='sha256:'+dr._hash(e['detailEvidence']['document'])
        add_event(src,e)
        self.assertEqual(self.assess(src,p=price_proof())['state'],'review_required')

    def test_explicit_correction_chain_uses_latest_state_without_erasing_revision(self):
        src=sources();add_event(src,event())
        correction=event('[기재정정] 주식분할결정','20260909000001',originalReceiptId='20260908000001',effectiveOn='2026-10-01')
        add_event(src,correction)
        c=self.assess(src,p=price_proof())
        self.assertEqual(c['state'],'comparable')
        self.assertEqual(c['events'][0]['latestReceiptId'],'20260909000001')
        self.assertEqual(len(c['events'][0]['receiptIds']),2)

    def test_unlinked_correction_or_conflicting_receipt_is_review(self):
        src=sources();add_event(src,event('[기재정정] 주식분할결정'))
        self.assertEqual(self.assess(src)['state'],'review_required')
        src=sources();add_event(src,event());add_event(src,event('감자결정'),index=1)
        self.assertEqual(self.assess(src)['state'],'review_required')

    def test_adjusted_proof_can_release_hold_without_modifying_original(self):
        r=row(); before=copy.deepcopy(r);src=sources();add_event(src,event())
        p=price_proof(r,adjusted=True);c=self.assess(src,p,r)
        self.assertEqual(c['state'],'comparable')
        out=dr.evaluate(r,{},'2026-09-15',comparison=c)
        self.assertEqual((out['verdict'],out['ret'],out['comparisonBase']),('hit',2.0,50))
        self.assertEqual(r,before)
        p['adjustment']['receiptIds']=[]
        self.assertNotEqual(self.assess(src,p,r)['state'],'comparable')

    def test_later_filing_details_are_separate_from_collector_and_original(self):
        r=row();src=sources();raw={'id':'20260908000001','title':'주식분할결정','receivedOn':'20260908'}
        add_event(src,raw);before=copy.deepcopy(src)
        p=price_proof(r,True)
        self.assertEqual(self.assess(src,p,r)['state'],'adjustment_required')
        p['filingDetails']={raw['id']:event()}
        self.assertEqual(self.assess(src,p,r)['state'],'comparable')
        self.assertEqual(src,before)

    def test_halt_or_zero_volume_not_released_by_adjustment(self):
        src=sources();add_event(src,event('매매거래정지'));p=price_proof(adjusted=True)
        self.assertEqual(self.assess(src,p)['state'],'adjustment_required')
        p=price_proof();p['prices'][3]['volume']=0
        self.assertNotEqual(self.assess(p=p)['state'],'comparable')

    def test_proof_identity_dates_basis_and_source_must_match(self):
        for key,value in [('originalRecordHash','wrong'),('ticker','000001'),('basis','unknown'),
                          ('sourceRef','https://example.test/price'),('observedAt','2026-09-20T08:00:00Z')]:
            p=price_proof();p[key]=value
            self.assertEqual(self.assess(p=p)['state'],'unknown')
        p=price_proof();p['prices'].pop()
        self.assertEqual(self.assess(p=p)['state'],'unknown')

    def test_retry_reuses_evidence_and_price_proof_bytes(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=price_proof();a=ce.save_price_proof(p,tmp);b=ce.save_price_proof(p,tmp)
            self.assertEqual(a,b)
            c=self.assess(p=p)
            first,saved=ce.save_comparisons([c],tmp)
            before=(Path(tmp)/first).read_bytes()
            c['checkedAt']='2026-09-15T10:00:00+00:00'
            second,_=ce.save_comparisons([c],tmp)
            self.assertEqual(first,second);self.assertEqual((Path(tmp)/second).read_bytes(),before)
            self.assertEqual(len(list((Path(tmp)/'comparisons').glob('*.gz'))),1)

    def test_reference_metadata_without_original_response_is_not_proof(self):
        p=price_proof();p.pop('document')
        self.assertNotEqual(self.assess(p=p)['state'],'comparable')
        p=price_proof();p['basisEvidence']['document']['basis']='adjusted'
        self.assertNotEqual(self.assess(p=p)['state'],'comparable')

    def test_explicit_price_proof_revision_preserves_old_proof(self):
        with tempfile.TemporaryDirectory() as root:
            first=price_proof();old=ce.save_price_proof(first,root)
            later=price_proof();later['supersedes']=old
            ce.save_price_proof(later,root)
            loaded=ce.load_price_proofs(root)
            self.assertEqual(loaded[first['recordId']]['supersedes'],old)
            self.assertEqual(len(list((Path(root)/'price_proofs').glob('*.json'))),2)
            conflict=price_proof();conflict['note']='another unrelated proof'
            ce.save_price_proof(conflict,root)
            self.assertEqual(self.assess(p=ce.load_price_proofs(root)[first['recordId']])['state'],'review_required')

if __name__=='__main__': unittest.main()
