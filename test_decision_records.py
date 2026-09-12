"""Actual decisions stay immutable; only eligible outcomes reach public counts."""
import copy
import datetime as dt
import json
import gzip
import os
import tempfile
import subprocess
import tarfile
import unittest
from unittest.mock import patch

import decision_records as dr


def auto(at='2026-09-07 10:00', call='BUY', version='model-a'):
    return {'generatedAt': at, 'coverageUniverseVersion': 'coverage-a', 'stocks': {
        '005930': {'tier': 'auto', 'updated': at, 'base': 100,
                   'baseAt': '2026-09-07 종가 (16:04 수집)',
                   'chief': {'call': call, 'total': 70, 'baseModelVersion': version,
                             'reason': '실제 저장된 판단 근거'},
                   'taro': {'score': 65, 'stance': 'bull'}}}}


def proof(code='005930', source='OPENDART_API'):
    return {'ticker': code, 'source': source,
            'retrievalPath': 'opendart:list.json?corp_code' if source == 'OPENDART_API' else 'KRX_KIND_WEB',
            'identityBasis': 'corp_code_map' if source == 'OPENDART_API' else 'repIsuSrtCd',
            'ok': True, 'tickerMatched': True, 'structureVerified': True,
            'parserVersion': 'list-v1', 'responseRef': 'sha256:actual-response',
            'apiStatus': '013' if source == 'OPENDART_API' else 'EMPTY',
            'from': '2026-09-01', 'to': '2026-09-14',
            'queriedAt': '2026-09-14T08:00:00+00:00', 'expiresAt': '2026-09-15T08:00:00+00:00',
            'pagesExpected': 1, 'pagesCollected': 1, 'totalCount': 0, 'collectedIds': [],
            'findings': [], 'historicalBackfillComplete': True, 'uninterpreted': 0}


class Records(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = self.tmp.name

    def test_same_round_idempotent_intraday_kept_and_read_back(self):
        dr.capture(auto(), self.root, captured_at='2026-09-07T02:00:00+00:00')
        dr.capture(auto(), self.root, captured_at='2026-09-07T03:00:00+00:00')
        dr.capture(auto('2026-09-07 14:00', 'SELL'), self.root)
        rows = dr.read_records(self.root)
        self.assertEqual(len(rows), 2)
        self.assertEqual(len({r['recordId'] for r in rows}), 2)
        self.assertEqual([r['call'] for r in sorted(rows, key=lambda r:r['decisionAt'])], ['BUY', 'SELL'])
        self.assertEqual(len(dr.daily_records(rows)), 1)
        self.assertEqual(dr.daily_records(rows)[0]['call'], 'SELL')
        self.assertEqual(rows[0]['market'], 'KRX')
        self.assertEqual(rows[0]['source'], 'actual_auto')
        self.assertIn('scoringVersion', rows[0])

    def test_same_id_changed_content_fails_without_overwrite(self):
        dr.capture(auto(), self.root)
        before = dr.read_records(self.root)
        with self.assertRaises(dr.IntegrityError):
            dr.capture(auto(call='SELL'), self.root)
        self.assertEqual(dr.read_records(self.root), before)

    def test_deep_and_reconstructed_are_not_actual_auto(self):
        payload = auto()
        payload['stocks']['005930']['tier'] = 'deep'
        payload['stocks']['000001'] = dict(auto()['stocks']['005930'], recon=True)
        dr.capture(payload, self.root)
        self.assertEqual(dr.read_records(self.root), [])

    def test_missing_price_decisions_are_preserved(self):
        payload = auto(call='JUDGMENT_WITHHELD')
        payload['stocks']['005930']['base'] = None
        dr.capture(payload, self.root)
        self.assertEqual(len(dr.read_records(self.root)), 1)

    def test_readback_mismatch_stops_publication(self):
        with patch.object(dr.DecisionStore, 'append_predictions', return_value=(1,0)):
            with self.assertRaises(dr.IntegrityError):
                dr.capture(auto(), self.root)

    def test_current_evidence_is_not_backdated_into_original(self):
        dr.capture(auto(), self.root, captured_at='2026-09-13T00:00:00+00:00')
        row = dr.read_records(self.root)[0]
        self.assertEqual(row['decisionAt'], '2026-09-07 10:00')
        self.assertEqual(row['corporateActionAtDecision']['state'], 'unavailable')
        self.assertEqual(row['capturedAt'], '2026-09-13T00:00:00+00:00')

    def test_tampered_original_cannot_reach_scoreboard(self):
        dr.capture(auto(),self.root)
        path=next(dr.Path(self.root).glob('originals/**/*.jsonl.gz'))
        rows=[json.loads(line) for line in gzip.decompress(path.read_bytes()).decode().splitlines()]
        rows[0]['total']=99
        path.write_bytes(gzip.compress(('\n'.join(json.dumps(r) for r in rows)+'\n').encode()))
        with self.assertRaises(dr.IntegrityError): dr.read_records(self.root)

    def test_terminal_outcome_not_rewritten(self):
        dr.capture(auto(), self.root)
        row = dr.read_records(self.root)[0]
        outcome = {'recordId': row['recordId'], 'status': 'evaluated', 'ret': 2.0,
                   'verdict': 'hit', 'horizon': 5, 'reason': None}
        dr.save_outcomes([outcome], self.root)
        with self.assertRaises(dr.IntegrityError):
            dr.save_outcomes([dict(outcome, ret=-20.0)], self.root)
        self.assertEqual(dr.load_outcomes(self.root)[row['recordId']]['ret'], 2.0)


class Outcomes(unittest.TestCase):
    def test_intraday_model_change_uses_one_shared_daily_cohort(self):
        morning=self.row()
        afternoon=dict(morning,recordId='later',decisionAt='2026-09-07 14:00',modelVersion='new')
        outcomes={r['recordId']:{'status':'pending','reason':'future_session'} for r in (morning,afternoon)}
        report=dr.summarize([morning,afternoon],outcomes,current_model='new')
        versions=report['byModelVersion']
        self.assertEqual(sum(v['dailyRecordCount'] for v in versions.values()),1)
        self.assertEqual(versions['model-a']['rawRecordCount'],1)
        self.assertEqual(versions['model-a']['horizons']['5']['pending'],0)
        self.assertEqual(versions['new']['dailyRecordCount'],1)

    def row(self):
        return dr.make_record('005930', auto()['stocks']['005930'], auto(), 'now')

    def prices(self, missing=None):
        dates = ['2026-09-07','2026-09-08','2026-09-09','2026-09-10','2026-09-11','2026-09-14']
        return {'005930': [{'days': [{'date': d, 'close': 102} for d in dates if d != missing]}]}

    def test_future_sessions_pending_not_zero_return(self):
        out = dr.evaluate(self.row(), self.prices(), as_of='2026-09-11')
        self.assertEqual((out['status'], out['reason']), ('pending','future_session'))
        self.assertIsNone(out.get('ret'))
        self.assertEqual(out['dueOn'], '2026-09-14')

    def test_missing_session_never_slides_to_later_price(self):
        out = dr.evaluate(self.row(), self.prices('2026-09-10'), as_of='2026-09-15')
        self.assertEqual((out['status'], out['reason']), ('blocked','missing_price'))

    def test_unknown_price_basis_not_scored(self):
        out = dr.evaluate(self.row(), self.prices(), as_of='2026-09-15')
        self.assertEqual(out['reason'], 'price_basis_unverified')
        self.assertIsNone(out.get('ret'))

    def test_existing_grading_reused_after_evidence(self):
        row = self.row()
        row['priceBasis'] = {'verified': True, 'basis': 'unadjusted', 'sourceRef': 'saved-price-proof'}
        evidence = {'state': 'checked_no_event', 'from':'2026-09-07', 'to':'2026-09-14',
                    'priceBasis': 'unadjusted', 'priceBasisVerified': True, 'sourceRef':'saved-comparison-proof'}
        out = dr.evaluate(row, self.prices(), as_of='2026-09-15', comparison=evidence)
        self.assertEqual((out['status'],out['verdict']), ('evaluated','hit'))
        self.assertEqual(out['ret'], 2.0)
        self.assertEqual(out['dueOn'], '2026-09-14')

    def test_counts_keep_withheld_missing_and_model_separate(self):
        rows = [dict(self.row(),recordId=str(i),call=call,modelVersion=v) for i,(call,v) in enumerate([
            ('BUY','current'),('SELL','old'),('JUDGMENT_WITHHELD','current'),('HOLD','current')])]
        outcomes = {str(i):dict(recordId=str(i),status=s,reason=r,verdict=verdict) for i,(s,r,verdict) in enumerate([
            ('evaluated',None,'hit'),('blocked','missing_price',None),
            ('withheld','judgment_withheld',None),('pending','future_session',None)])}
        # Different codes are different daily records; same-day sample sufficiency remains one day.
        for i,row in enumerate(rows): row['code']=str(i).zfill(6)
        report = dr.summarize(rows,outcomes,current_model='current')
        h=report['horizons']['5']
        self.assertEqual([h[k] for k in ('evaluated','pending','blocked','withheld')],[1,1,1,1])
        self.assertIsNone(h['accuracy'])
        self.assertEqual(report['uniqueDecisionDays'],1)
        self.assertEqual(report['byModelVersion']['old']['horizons']['5']['blocked'],1)


class Disclosure(unittest.TestCase):
    def test_same_receipt_keeps_earliest_available_collector_time(self):
        dart,kind=proof(),proof(source='KRX')
        kind['queriedAt']='2026-09-14T07:00:00+00:00'
        for row in (dart,kind):
            row.update(totalCount=1,collectedIds=['20260914000001'],
                       findings=[{'id':'20260914000001','title':'유상증자결정','receivedOn':'20260914'}])
        events=dr.disclosure_state('005930',dart,kind,'2026-09-14T09:00:00+00:00')['events']
        self.assertEqual(len(events),1)
        self.assertEqual(events[0]['firstObservedAt'],kind['queriedAt'])

    def test_conflicting_same_receipt_is_review(self):
        dart,kind=proof(),proof(source='KRX')
        for row,title in ((dart,'유상증자결정'),(kind,'유상증자 철회')):
            row.update(totalCount=1,collectedIds=['20260914000001'],
                       findings=[{'id':'20260914000001','title':title,'receivedOn':'20260914'}])
        self.assertEqual(dr.disclosure_state('005930',dart,kind,'2026-09-14T09:00:00+00:00')['state'],'needs_review')

    def test_no_event_requires_both_valid_complete_scopes(self):
        now='2026-09-14T09:00:00+00:00'
        self.assertEqual(dr.disclosure_state('005930',proof(),proof(source='KRX'),now)['state'],'checked_no_event')
        for change in ({'ok':False},{'pagesCollected':0},{'totalCount':1},{'ticker':'000001'},
                       {'expiresAt':'2026-09-13T00:00:00+00:00'},{'derivedFrom':'OPENDART_API'},
                       {'apiStatus':'010'}):
            bad=dict(proof(),**change)
            self.assertEqual(dr.disclosure_state('005930',bad,proof(source='KRX'),now)['state'],'unavailable')
        self.assertEqual(dr.disclosure_state('005930',proof(),None,now)['state'],'unavailable')

    def test_dated_receipt_does_not_get_invented_publication_time(self):
        e=proof()
        e['findings']=[{'id':'20260914001234','title':'[기재정정] 유상증자결정','receivedOn':'20260914'}]
        e['collectedIds']=['20260914001234']; e['totalCount']=1
        out=dr.disclosure_state('005930',e,proof(source='KRX'),'2026-09-14T09:00:00+00:00')
        self.assertEqual(out['state'],'event_found')
        self.assertEqual(out['events'][0]['receivedOn'],'20260914')
        self.assertIsNone(out['events'][0]['publishedAt'])
        self.assertTrue(out['events'][0]['correction'])
        self.assertIsNone(out['events'][0]['originalReceiptId'])


class MergeEvidence(unittest.TestCase):
    def test_post_merge_failure_keeps_original_head_and_clean_tree(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo=dr.Path(tmp)
            def git(*args):
                return subprocess.run(['git',*args],cwd=repo,check=True,capture_output=True).stdout
            git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.test')
            (repo/'model_scoreboard.js').write_text('const MODEL_SCOREBOARD = {};',encoding='utf-8')
            git('add','.');git('commit','-m','base');git('branch','other')
            root=repo/'research_archive'/'decisions'
            dr.capture(auto(),root);git('add','.');git('commit','-m','morning')
            git('switch','other')
            dr.capture(auto('2026-09-07 14:00','SELL'),root);git('add','.');git('commit','-m','afternoon')
            git('switch','main')
            before=git('rev-parse','HEAD')
            def fail_after_write(**kwargs):
                (repo/'model_scoreboard.js').write_text('unverified',encoding='utf-8')
                (repo/'model_scoreboard.js.tmp').write_text('unverified temporary output',encoding='utf-8')
                dr._atomic_json(root/'status.json',{'unverified':True})
                raise dr.IntegrityError('Injected summary failure')
            with patch('build_model_scoreboard.write_decision_trace',side_effect=fail_after_write):
                with self.assertRaises(dr.IntegrityError): dr.safe_merge('other',repo)
            self.assertEqual(git('rev-parse','HEAD'),before)
            self.assertFalse(git('status','--porcelain').strip())
            self.assertEqual(len(dr.read_records(root)),1)

    def test_recovery_bundle_contains_only_unpublished_decision_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo=dr.Path(tmp)
            def git(*args):
                return subprocess.run(['git',*args],cwd=repo,check=True,capture_output=True).stdout
            git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.test')
            (repo/'keep.txt').write_text('not evidence',encoding='utf-8')
            git('add','.');git('commit','-m','base');git('update-ref','refs/remotes/origin/main','HEAD')
            root=repo/'research_archive'/'decisions'
            dr.capture(auto(),root)
            target=repo/'recovery.tar.gz'
            self.assertTrue(dr.recovery_bundle(target,repo))
            with tarfile.open(target) as archive:
                self.assertTrue(all(x.name.startswith('research_archive/decisions/') for x in archive.getmembers()))
                self.assertTrue(any(x.name.endswith('.jsonl.gz') for x in archive.getmembers()))
            git('add','research_archive');git('commit','-m','published');git('update-ref','refs/remotes/origin/main','HEAD')
            self.assertFalse(dr.recovery_bundle(target,repo))

    def test_git_merge_keeps_both_actual_rounds_and_refreshes_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            repo=dr.Path(tmp)
            def git(*args):
                return subprocess.run(['git',*args],cwd=repo,check=True,capture_output=True).stdout
            git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.test')
            (repo/'price_history.js').write_text('const PRICE_HISTORY = {};',encoding='utf-8')
            (repo/'model_scoreboard.js').write_text('const MODEL_SCOREBOARD = {"models":[]};',encoding='utf-8')
            git('add','.');git('commit','-m','base');git('branch','other')
            root=repo/'research_archive'/'decisions'
            dr.capture(auto(),root);dr.refresh(root,repo,now='2026-09-08T00:00:00+00:00')
            git('add','.');git('commit','-m','morning')
            git('switch','other')
            dr.capture(auto('2026-09-07 14:00','SELL'),root)
            dr.refresh(root,repo,now='2026-09-08T00:00:00+00:00')
            git('add','.');git('commit','-m','afternoon')
            git('switch','main')
            self.assertEqual(dr.safe_merge('other',repo),0)
            self.assertEqual(len(dr.read_records(root)),2)
            self.assertEqual(dr.daily_records(dr.read_records(root))[0]['call'],'SELL')
            report=json.loads((root/'status.json').read_text(encoding='utf-8'))
            self.assertEqual((report['rawRecordCount'],report['dailyRecordCount']),(2,1))
            self.assertFalse(git('status','--porcelain').strip())
    def test_merge_preserves_both_unique_rows_and_evaluated_state(self):
        left={'a':{'recordId':'a','status':'pending','asOf':'2026-09-11'}}
        right={'b':{'recordId':'b','status':'blocked','asOf':'2026-09-11'},
               'a':{'recordId':'a','status':'evaluated','verdict':'miss','ret':-2}}
        merged=dr.merge_outcomes(left,right)
        self.assertEqual(set(merged),{'a','b'})
        self.assertEqual(merged['a']['ret'],-2)
        with self.assertRaises(dr.IntegrityError):
            dr.merge_outcomes(right,{'a':dict(right['a'],ret=2)})

    def test_equal_observation_time_different_status_is_not_latest_wins(self):
        row={'recordId':'a','status':'pending','asOf':'2026-09-11'}
        with self.assertRaises(dr.IntegrityError):
            dr.merge_outcomes({'a':row},{'a':dict(row,status='blocked')})


class Operations(unittest.TestCase):
    def test_status_without_stored_originals_or_public_summary_is_fault(self):
        import ops_status as ops
        with tempfile.TemporaryDirectory() as tmp:
            repo=dr.Path(tmp); root=repo/'research_archive'/'decisions'
            (repo/'price_history.js').write_text('const PRICE_HISTORY = {};',encoding='utf-8')
            dr.capture(auto(at='2026-09-11 16:00'),root)
            report=dr.refresh(root,repo,now='2026-09-13T00:00:00+00:00')
            now=dt.datetime(2026,9,13,12,tzinfo=dr.KST)
            self.assertEqual(ops.check_decisions(tmp,now)['status'],ops.FAULT)
            (repo/'model_scoreboard.js').write_text('const MODEL_SCOREBOARD = '+json.dumps({'decisionTrace':report})+';',encoding='utf-8')
            self.assertEqual(ops.check_decisions(tmp,now)['status'],ops.IDLE)
            next(root.glob('originals/**/*.jsonl.gz')).write_bytes(b'broken')
            self.assertEqual(ops.check_decisions(tmp,now)['status'],ops.FAULT)

    def test_waiting_data_missing_and_storage_missing_are_distinct(self):
        import ops_status as ops
        with tempfile.TemporaryDirectory() as root:
            now=dt.datetime(2026,9,13,12,tzinfo=dr.KST)
            self.assertEqual(ops.check_decisions(root,now)['status'],ops.UNKNOWN)
            path=os.path.join(root,'research_archive','decisions','status.json')
            archive=dr.Path(root)/'research_archive'/'decisions'
            (dr.Path(root)/'price_history.js').write_text('const PRICE_HISTORY = {};',encoding='utf-8')
            dr.capture(auto(at='2026-09-11 16:00'),archive)
            report=dr.refresh(archive,root,now='2026-09-13T00:00:00+00:00')
            dr._atomic_json(path,report)
            board=dr.Path(root)/'model_scoreboard.js'
            board.write_text('const MODEL_SCOREBOARD = '+json.dumps({'decisionTrace':report})+';',encoding='utf-8')
            self.assertEqual(ops.check_decisions(root,now)['status'],ops.IDLE)
            report=dr.refresh(archive,root,now='2026-09-22T00:00:00+00:00')
            board.write_text('const MODEL_SCOREBOARD = '+json.dumps({'decisionTrace':report})+';',encoding='utf-8')
            self.assertEqual(ops.check_decisions(root,now)['status'],ops.INSUFF)


if __name__ == '__main__': unittest.main()
