"""Actual decisions stay immutable; only eligible outcomes reach public counts."""
import copy
import datetime as dt
import json
import gzip
import os
import re
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
    def test_analysis_staging_keeps_rebound_output_before_price_merge(self):
        # Reproduce the 2026-09-14 runner: generated rebound output remained dirty
        # after the cycle commit, so the protected merge refused every price update.
        workflow=(dr.HERE/'.github/workflows/update-analysis.yml').read_text(encoding='utf-8')
        staging=re.search(r'for f in price_history\.js[\s\S]*?\n\s*done',workflow).group()
        with tempfile.TemporaryDirectory() as tmp:
            repo=dr.Path(tmp)
            def git(*args):
                return subprocess.run(['git',*args],cwd=repo,check=True,capture_output=True).stdout
            git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.test')
            for name,text in {'data.js':'old prices','rebound_watch.js':'old watch',
                              'auto_analysis.js':'old analysis','model_scoreboard.js':'const MODEL_SCOREBOARD = {"models":[]};',
                              'price_history.js':'const PRICE_HISTORY = {};','llms.txt':'links'}.items():
                (repo/name).write_text(text,encoding='utf-8')
            git('add','.');git('commit','-m','base');git('branch','prices')
            git('switch','prices');(repo/'data.js').write_text('new prices',encoding='utf-8')
            git('add','data.js');git('commit','-m','price update');git('switch','main')
            root=repo/'research_archive/decisions'
            dr.capture(auto(),root)
            (repo/'rebound_watch.js').write_text('new watch',encoding='utf-8')
            (repo/'auto_analysis.js').write_text('new analysis',encoding='utf-8')
            subprocess.run(['bash','-c',staging],cwd=repo,check=True)
            git('add','research_archive');git('commit','-m','analysis cycle')
            self.assertFalse(git('status','--porcelain').strip())
            self.assertEqual(dr.safe_merge('prices',repo),0)
            self.assertEqual((repo/'data.js').read_text(),'new prices')
            self.assertEqual((repo/'rebound_watch.js').read_text(),'new watch')
            self.assertEqual((repo/'auto_analysis.js').read_text(),'new analysis')
            self.assertEqual(len(dr.read_records(root)),1)
            # The guard still refuses an unrelated code edit.
            (repo/'unrelated.py').write_text('do not discard',encoding='utf-8')
            with self.assertRaises(dr.IntegrityError): dr.safe_merge('prices',repo)

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


class ExecutionEvidence(unittest.TestCase):
    """'누가 만들었나(실행 신원)'와 '정말 main에 들어갔나(되읽기)'를 각각 따로 잰다.

    이 두 가지는 지금까지 어디에도 안 적혔다 — 판단 원본은 로컬에 있고 job 은 성공했지만,
    그 회차를 만든 실행이 예약이었는지 수동이었는지, 그 원본이 정말 main 트리에 들어갔는지는
    status.json 어디를 봐도 알 수 없었다. 사람이 매번 Actions 탭을 열어 맞춰보는 수밖에 없던
    것을 기계가 읽을 수 있게 각인한다.

    계약(이 저장소의 기존 교훈 ③④ 그대로):
      - Actions 밖(로컬·수동)에서는 실행 필드를 **지어내지 않는다**. 수동 실행이 예약 실행으로
        둔갑하면 '자연 실행 정상'이라는 거짓 기록이 남는다.
      - ref 를 못 읽으면 MAIN_VERIFIED 도 NOT_IN_MAIN 도 아닌 UNVERIFIED 다. 모른다를
        괜찮다로도, 고장으로도 바꾸지 않는다.
      - 로컬에 파일이 있다는 것은 main 에 들어갔다는 뜻이 아니다 — ref 의 blob 과 실제로
        같은 내용일 때만 MAIN_VERIFIED 다.
    """

    def _repo(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        repo = dr.Path(tmp.name)

        def git(*args):
            return subprocess.run(['git', *args], cwd=repo, check=True, capture_output=True, text=True).stdout

        git('init', '-b', 'main')
        git('config', 'user.name', 'Fixture')
        git('config', 'user.email', 'fixture@example.test')
        (repo / 'price_history.js').write_text('const PRICE_HISTORY = {};', encoding='utf-8')
        git('add', '.')
        git('commit', '-m', 'base')
        root = repo / 'research_archive' / 'decisions'
        dr.capture(auto(), root)
        dr.refresh(root, repo, now='2026-09-08T00:00:00+00:00')
        return repo, root, git

    def test_actions_밖에서는_실행_필드를_지어내지_않는다(self):
        repo, root, _ = self._repo()
        clean = {k: '' for k in ('GITHUB_EVENT_NAME', 'GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'GITHUB_SHA')}
        with patch.dict(os.environ, clean):
            identity = dr.execution_identity(dr.read_records(root), root, repo)
        self.assertEqual([identity[k] for k in ('event', 'runId', 'runAttempt', 'headSha')], [None] * 4)
        # 실행을 모르더라도 '무엇이 저장됐는가'는 여전히 사실로 남는다.
        self.assertEqual(identity['analysisCount'], 1)
        self.assertTrue(identity['decisionOriginalId'])
        self.assertRegex(identity['decisionOriginalHash'], r'^[0-9a-f]{64}$')

    def test_예약_실행이면_그_run_을_그대로_적는다(self):
        repo, root, _ = self._repo()
        with patch.dict(os.environ, {'GITHUB_EVENT_NAME': 'schedule', 'GITHUB_RUN_ID': '123',
                                     'GITHUB_RUN_ATTEMPT': '2', 'GITHUB_SHA': 'a' * 40}):
            identity = dr.execution_identity(dr.read_records(root), root, repo)
        self.assertEqual(identity['event'], 'schedule')
        self.assertEqual((identity['runId'], identity['runAttempt']), ('123', '2'))
        self.assertEqual(identity['headSha'], 'a' * 40)

    def test_refresh가_status에_실행_블록을_덧붙인다(self):
        repo, root, _ = self._repo()
        report = json.loads((root / 'status.json').read_text(encoding='utf-8'))
        self.assertIn('execution', report)
        self.assertEqual(report['execution']['analysisCount'], report['dailyRecordCount'])
        # 기존 필드는 그대로 — 덧붙이기만 하고 기존 집계를 바꾸지 않는다.
        self.assertEqual(report['rawRecordCount'], 1)

    def test_원본이_ref에_들어가면_MAIN_VERIFIED(self):
        repo, root, git = self._repo()
        git('add', '.')
        git('commit', '-m', 'published')
        git('update-ref', 'refs/remotes/origin/main', 'HEAD')
        out = dr.verify_saved_to_main(root, repo)
        self.assertEqual(out['verificationStatus'], 'MAIN_VERIFIED')
        self.assertEqual(out['verifiedCommitSha'], git('rev-parse', 'HEAD').strip())
        self.assertTrue(out['checked'])
        self.assertEqual(out['missing'], [])

    def test_아직_커밋_안_한_원본은_NOT_IN_MAIN(self):
        repo, root, git = self._repo()
        git('update-ref', 'refs/remotes/origin/main', 'HEAD')   # 판단 원본을 담기 전의 main
        out = dr.verify_saved_to_main(root, repo)
        self.assertEqual(out['verificationStatus'], 'NOT_IN_MAIN')
        self.assertEqual(out['reason'], 'original_not_in_ref')

    def test_로컬_파일이_ref와_다르면_MAIN_VERIFIED가_아니다(self):
        """'파일이 여기 있다'는 'main 에 그 내용이 들어갔다'와 다른 사실이다."""
        repo, root, git = self._repo()
        git('add', '.')
        git('commit', '-m', 'published')
        git('update-ref', 'refs/remotes/origin/main', 'HEAD')
        next(root.glob('originals/**/*.jsonl.gz')).write_bytes(b'locally tampered')
        out = dr.verify_saved_to_main(root, repo)
        self.assertEqual(out['verificationStatus'], 'NOT_IN_MAIN')
        self.assertTrue(out['missing'])

    def test_ref를_못_읽으면_UNVERIFIED지_정상도_장애도_아니다(self):
        repo, root, _ = self._repo()
        out = dr.verify_saved_to_main(root, repo, ref='origin/없는브랜치')
        self.assertEqual(out['verificationStatus'], 'UNVERIFIED')
        self.assertEqual(out['reason'], 'ref_unreadable')
        self.assertIsNone(out['verifiedCommitSha'])

    def test_실행_신원이_없는_옛_status도_UNVERIFIED로만_남는다(self):
        """이 기능 이전에 저장된 status.json 에는 execution 이 없다 — 그걸 장애로 읽지 않는다."""
        repo, root, git = self._repo()
        report = json.loads((root / 'status.json').read_text(encoding='utf-8'))
        report.pop('execution')
        dr._atomic_json(root / 'status.json', report)
        git('add', '.')
        git('commit', '-m', 'published')
        git('update-ref', 'refs/remotes/origin/main', 'HEAD')
        out = dr.verify_saved_to_main(root, repo)
        self.assertEqual(out['verificationStatus'], 'UNVERIFIED')
        self.assertEqual(out['reason'], 'no_execution_identity')

    def test_되읽기는_판단_원본을_고치지_않는다(self):
        repo, root, git = self._repo()
        git('add', '.')
        git('commit', '-m', 'published')
        git('update-ref', 'refs/remotes/origin/main', 'HEAD')
        before = sorted((p.name, p.read_bytes()) for p in root.glob('originals/**/*') if p.is_file())
        dr.verify_saved_to_main(root, repo)
        self.assertEqual(sorted((p.name, p.read_bytes()) for p in root.glob('originals/**/*') if p.is_file()), before)
        self.assertFalse(git('status', '--porcelain').strip())

    def test_ops_status는_확인_불가를_정상으로도_장애로도_바꾸지_않는다(self):
        """되읽기 결과는 관찰로만 싣는다 — 판정(status)을 올리지도 내리지도 않는다."""
        import ops_status as ops
        repo, root, _ = self._repo()
        report = json.loads((root / 'status.json').read_text(encoding='utf-8'))
        (repo / 'model_scoreboard.js').write_text(
            'const MODEL_SCOREBOARD = ' + json.dumps({'decisionTrace': report}) + ';', encoding='utf-8')
        now = dt.datetime(2026, 9, 8, 12, tzinfo=dr.KST)
        with patch.object(dr, 'verify_saved_to_main', return_value={'verificationStatus': 'UNVERIFIED',
                                                                    'reason': 'ref_unreadable'}):
            unverified = ops.check_decisions(str(repo), now)
        with patch.object(dr, 'verify_saved_to_main', return_value={'verificationStatus': 'MAIN_VERIFIED',
                                                                    'verifiedCommitSha': 'b' * 40}):
            verified = ops.check_decisions(str(repo), now)
        self.assertEqual(unverified['status'], verified['status'])
        self.assertEqual(unverified['mainVerification']['verificationStatus'], 'UNVERIFIED')
        self.assertEqual(verified['mainVerification']['verificationStatus'], 'MAIN_VERIFIED')
        self.assertEqual(verified['execution']['analysisCount'], 1)


if __name__ == '__main__': unittest.main()
