"""Point-in-time, cohort, comparison and Production isolation contracts."""
import ast
import copy
import datetime as dt
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import dart_research as R
import decision_records as D
import performance_orchestrator as O
from test_decision_records import auto
from test_performance_orchestrator import inputs

DAY = '2026-09-14'
CUTOFF = DAY + 'T09:30:00+09:00'
NOW = DAY + 'T09:35:00+09:00'
POLICY = {'minResearchDays': 10, 'minEvalDays': 20}


def event(**kwargs):
    item = {'ticker': '005930', 'rcept_no': '20260913000001', 'rcept_dt': '20260913',
            'report_name': '단일판매 공급계약 체결', 'detected_at': '2026-09-14T08:00:00+09:00',
            'fetched_at': '2026-09-14T08:00:01+09:00'}
    return dict(item, **kwargs)


def receipt(events=None, **kwargs):
    status = {'finishedAt': '2026-09-14T09:20:00+09:00', 'eventState': 'EVENT_DETECTED',
              'pagination': {'coverage_complete': True},
              'queryWindow': {'start': '2026-09-13', 'end': DAY}}
    status.update(kwargs)
    return R.collection_receipt(status, events if events is not None else [event()], ['005930'], '123')


def payload():
    p = auto('2026-09-14 09:30')
    p['runTimestamps'] = {'analysisStartedAt': CUTOFF, 'analysisCompletedAt': NOW, 'githubRunId': '123'}
    return p


def study_rows(days=45, signal=True):
    rows = []
    for n in range(days):
        day = dt.date(2026, 1, 1) + dt.timedelta(days=n)
        for case in (True, False):
            present = case if signal else True
            rows.append({'code': '005930' if case else '000660', 'day': day.isoformat(),
                'call': 'BUY', 'confidence': 80, 'modelVersion': 'm', 'pcv': 'base',
                'ret5': -12 if case else 12, 'outcomeDate': (day + dt.timedelta(days=7)).isoformat(),
                'dart': {'status': 'PRESENT' if present else 'ABSENT', 'completeWindow': True,
                         'categories': ['contract'] if present else [], 'receiptIds': []}})
    return rows


class TimeSafety(unittest.TestCase):
    def test_future_day_and_later_same_day_are_excluded(self):
        self.assertIsNone(R.event_at(event(rcept_dt='20260915'), CUTOFF)[0])
        e = event(rcept_dt='20260914', published_at='2026-09-14T15:00:00+09:00',
                  publicationTimeSource='OPENDART_OFFICIAL_TIMESTAMP')
        self.assertEqual(R.event_at(e, CUTOFF)[1], 'AFTER_DECISION')

    def test_same_day_without_official_clock_is_not_first_seen_probability(self):
        self.assertEqual(R.event_at(event(rcept_dt='20260914'), CUTOFF)[1], 'SAME_DAY_TIME_UNCERTAIN')
        e = event(rcept_dt='20260914', published_at='2026-09-14T08:00:00+09:00',
                  publicationTimeSource='OPENDART_OFFICIAL_TIMESTAMP')
        self.assertIsNotNone(R.event_at(e, CUTOFF)[0])

    def test_prior_day_and_timezone_offsets(self):
        self.assertIsNotNone(R.event_at(event(), CUTOFF)[0])
        self.assertIsNone(R.event_at(event(detected_at='2026-09-14T01:00:00+00:00'), CUTOFF)[0])
        self.assertIsNone(R.event_at(event(fetched_at='2026-09-14 08:00'), CUTOFF)[0])

    def test_late_correction_metadata_cannot_join_first_seen(self):
        later = event(report_name='유상증자 결정', fetched_at='2026-09-14T16:00:00+09:00')
        r = receipt([event(), later])
        self.assertEqual([e['category'] for e in r['filings']], ['contract'])
        self.assertEqual(r['excluded']['AFTER_DECISION'], 1)

    def test_absence_needs_complete_query_after_prior_day_has_ended(self):
        r = receipt([])
        self.assertEqual(R.exposure('005930', DAY, CUTOFF, [], r)['status'], 'ABSENT')
        r['checkedAt'] = '2026-09-13T16:00:00+09:00'
        self.assertEqual(R.exposure('005930', DAY, CUTOFF, [], r)['status'], 'UNKNOWN')
        for r in (receipt([], pagination={'coverage_complete': False}),
                  receipt([], eventState='EVENT_DATA_ERROR')):
            self.assertEqual(R.exposure('005930', DAY, CUTOFF, [], r)['status'], 'UNKNOWN')
        self.assertEqual(R.exposure('000660', DAY, CUTOFF, [], receipt([]))['status'], 'UNKNOWN')

    def test_receipt_does_not_store_keys_titles_or_error_strings(self):
        r = receipt(errors=[{'error': 'sensitive-test-value'}])
        text = json.dumps(r)
        self.assertNotIn('sensitive-test-value', text)
        self.assertNotIn('공급계약', text)
        self.assertFalse(r['checkStatus'] == 'OK')

    def test_existing_collector_keeps_duplicate_query_evidence(self):
        import dart_pipeline as P
        from test_dart_live_hardening import FakeClient, DART_ROWS, UNIVERSE, _filing
        with tempfile.TemporaryDirectory() as tmp:
            cmap = P.build_corp_map(DART_ROWS, UNIVERSE)
            path = str(Path(tmp)/'seen.json')
            client = FakeClient({1: {'list': [_filing('20260913000001')], 'total_page': 1}})
            first = P.collect_new_filings(client, cmap, seen_path=path)
            seen = first['registry']; seen.acknowledge_many(['20260913000001']); seen.save()
            again = P.collect_new_filings(client, cmap, seen_path=path)
            self.assertEqual(again['events'], [])
            self.assertEqual(len(again['researchObservedFilings']), 1)

    def test_real_collector_still_uses_existing_bounds_and_previous_day_window(self):
        import collect_dart as C
        from test_dart_live_hardening import FakeClient, DART_ROWS, UNIVERSE
        import dart_pipeline as P
        with tempfile.TemporaryDirectory() as tmp, patch.object(C, '_dart_store'), \
                patch.object(C.dart_time, 'today_kst', return_value=DAY):
            original = P.collect_new_filings
            def local(*args, **kwargs):
                kwargs['seen_path'] = str(Path(tmp)/'seen.json')
                return original(*args, **kwargs)
            with patch.object(P, 'collect_new_filings', side_effect=local) as query:
                result = C.collect(FakeClient({1: {'list': [], 'total_page': 1}}), P.build_corp_map(DART_ROWS, UNIVERSE))
            self.assertEqual(query.call_args.kwargs['bgn_de'], '20260913')
            self.assertNotIn('max_pages', query.call_args.kwargs)
            self.assertEqual(result['queryWindow'], {'start': '2026-09-13', 'end': DAY})


class ForwardSafety(unittest.TestCase):
    def test_current_run_only_no_historical_upgrade(self):
        p = payload()
        record = D.make_record('005930', p['stocks']['005930'], p, NOW, D._hash(p))
        self.assertIsNone(R.bind_forward(p, [record], [receipt()], 'old-run', NOW))
        self.assertIsNone(R.bind_forward(p, [record], [receipt()], '123', '2026-09-15T09:35:00+09:00'))
        bound = R.bind_forward(p, [record], [receipt()], '123', NOW)
        self.assertEqual(bound['cohort'], R.FORWARD)
        self.assertEqual(bound['links'][0]['evidence']['status'], 'PRESENT')

    def test_missing_key_and_api_failure_preserve_identical_original_decision(self):
        for state in ('DART_KEY_MISSING', 'EVENT_DATA_ERROR'):
            with self.subTest(state=state), tempfile.TemporaryDirectory() as tmp:
                p = payload(); unchanged = copy.deepcopy(p)
                rows = D.capture(p, Path(tmp)/'research_archive/decisions', captured_at=NOW)
                before = D.read_records(Path(tmp)/'research_archive/decisions')
                r = receipt([], eventState=state)
                bound = R.bind_forward(p, rows, [r], '123', NOW)
                self.assertEqual(bound['links'][0]['evidence']['status'], 'UNKNOWN')
                self.assertEqual(D.read_records(Path(tmp)/'research_archive/decisions'), before)
                self.assertEqual(p, unchanged)

    def test_no_archive_key_or_failed_sidecar_does_not_raise_to_analysis(self):
        with tempfile.TemporaryDirectory() as tmp:
            with patch.object(R, '_read_immutable', side_effect=OSError('do-not-log-secret')):
                self.assertEqual(R.capture_forward(payload(), [], tmp), 'DART_RESEARCH_WRITE_ERROR')
            with patch.object(R, '_write_immutable', side_effect=OSError('do-not-log-secret')):
                self.assertEqual(R.preserve_collection({}, tmp), 'DART_RESEARCH_WRITE_ERROR')

    def test_append_only_first_failed_attempt_cannot_be_replaced_by_success(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, {'GITHUB_RUN_ID': '123'}), \
                patch.object(R.T, 'iso_now', return_value=NOW):
            root = Path(tmp)
            p = payload(); rows = D.capture(p, root/'research_archive/decisions', captured_at=NOW)
            self.assertEqual(R.capture_forward(p, rows, root), 'PRESERVED')
            before = R._read_immutable(root/R.EVIDENCE/'forward')
            R._write_immutable(root/R.EVIDENCE/'collections', receipt())
            self.assertEqual(R.capture_forward(p, rows, root), 'ALREADY_PRESERVED')
            self.assertEqual(R._read_immutable(root/R.EVIDENCE/'forward'), before)
            self.assertEqual(before[0]['links'][0]['evidence']['status'], 'UNKNOWN')

    def test_tampered_content_is_rejected(self):
        import gzip
        with tempfile.TemporaryDirectory() as tmp:
            path = R._write_immutable(tmp, receipt())
            path.write_bytes(gzip.compress(json.dumps(receipt([])).encode()))
            with self.assertRaises(D.IntegrityError):
                R._read_immutable(tmp)

    def test_join_uses_protected_outcome_and_hash_without_regrading(self):
        with tempfile.TemporaryDirectory() as tmp, patch.dict(os.environ, {'GITHUB_RUN_ID': '123'}), \
                patch.object(R.T, 'iso_now', return_value=NOW), patch.object(R, 'read_raw', return_value=([], [])):
            root = Path(tmp); p = payload(); original_root = root/'research_archive/decisions'
            rows = D.capture(p, original_root, captured_at=NOW)
            R._write_immutable(root/R.EVIDENCE/'collections', receipt())
            R.capture_forward(p, rows, root)
            D.save_outcomes([{'recordId': rows[0]['recordId'], 'status': 'evaluated', 'ret': -12,
                             'dueOn': '2026-09-21', 'decisionOn': DAY}], original_root)
            result = R.refresh(root, historical_rows=[], policy=POLICY, today='2026-09-22')
            self.assertEqual(result['cohorts'][R.FORWARD]['maturedRows'], 1)
            self.assertEqual(result['cohorts'][R.HISTORICAL]['rawRows'], 0)


class Comparisons(unittest.TestCase):
    def test_600_rows_on_one_day_are_one_day_not_600_trials(self):
        rows = [copy.deepcopy(study_rows(1)[n % 2]) for n in range(600)]
        result = R.study(rows, R.FORWARD, POLICY, '2026-09-14')
        self.assertEqual((result['rawRows'], result['uniqueDecisionDays']), (600, 1))
        self.assertEqual(result['status'], 'INSUFFICIENT_EVIDENCE')
        self.assertIsNone(result['comparisons']['high_confidence_wrong']['differencePp'])
        self.assertFalse(result['accuracyImprovementProven'])

    def test_cohorts_never_pool_to_manufacture_sample_support(self):
        result = R.build_report(study_rows(20), study_rows(20), POLICY, '2026-09-14')
        self.assertEqual(result['status'], 'INSUFFICIENT_EVIDENCE')
        self.assertFalse(result['researchFocus']['researchRecommended'])

    def test_no_signal_does_not_create_candidate(self):
        result = R.study(study_rows(signal=False), R.FORWARD, POLICY, '2026-09-14')
        self.assertEqual(result['status'], 'NO_RESEARCH_SIGNAL')
        self.assertFalse(result['candidateCreated'])

    def test_repeated_signal_hands_off_research_only(self):
        result = R.build_report([], study_rows(), POLICY, '2026-09-14')
        self.assertEqual(result['status'], 'RESEARCH_SIGNAL_FOUND')
        self.assertTrue(result['researchFocus']['researchRecommended'])
        self.assertFalse(result['researchFocus']['candidateCreated'])
        self.assertFalse(result['productionChangesAllowed'])
        self.assertFalse(result['accuracyImprovementProven'])

    def test_unknown_controls_and_unmatched_confidence_do_not_prove_signal(self):
        rows = study_rows()
        for row in rows:
            if row['ret5'] > 0:
                row['dart']['status'] = 'UNKNOWN'; row['dart']['completeWindow'] = False
        self.assertEqual(R.study(rows, R.FORWARD, POLICY, '2026-09-14')['status'], 'INSUFFICIENT_EVIDENCE')
        rows = study_rows()
        for row in rows:
            if row['ret5'] > 0:
                row['confidence'] = 99
        result = R.study(rows, R.FORWARD, POLICY, '2026-09-14')
        self.assertNotEqual(result['status'], 'RESEARCH_SIGNAL_FOUND')

    def test_research_outcomes_cannot_overlap_evaluation(self):
        rows = study_rows(30)
        result = R.study(rows, R.FORWARD, POLICY, '2026-09-14')
        self.assertEqual(result['status'], 'INSUFFICIENT_EVIDENCE')
        self.assertIn('embargo', result['dataSplit']['reason'])

    def test_pending_future_outcomes_and_withheld_are_not_scored_as_hold(self):
        rows = study_rows(1)
        rows[0]['call'] = 'JUDGMENT_WITHHELD'
        rows[1]['outcomeDate'] = '2026-09-15'
        result = R.study(rows, R.FORWARD, POLICY, '2026-09-14')
        self.assertEqual(result['maturedRows'], 0)
        self.assertEqual(result['comparisons']['HOLD_big_move']['caseRows'], 0)

    def test_strategy_output_path_is_not_allowed(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                R.refresh_safely(tmp, historical_rows=[], policy=POLICY, output_path='gaeo_evolution/production_config.json')
            self.assertFalse((Path(tmp)/'gaeo_evolution/production_config.json').exists())
        tree = ast.parse(Path(R.__file__).read_text())
        imported = [n.module for n in ast.walk(tree) if isinstance(n, ast.ImportFrom)]
        imported += [a.name for n in ast.walk(tree) if isinstance(n, ast.Import) for a in n.names]
        self.assertFalse(set(imported) & {'dart_client', 'requests', 'subprocess', 'openai', 'anthropic'})


class ExistingOperations(unittest.TestCase):
    def test_dart_error_is_actionable_waiting_is_not_failure_no_signal_no_candidate(self):
        result = O.build(*inputs(), dart_research={'status': 'DATA_ERROR'})
        self.assertEqual(result['issues'][0]['key'], 'DART_RESEARCH_DATA_ERROR')
        self.assertEqual(result['issues'][0]['state'], 'ACTIONABLE')
        result = O.build(*inputs(), dart_research={'status': 'INSUFFICIENT_EVIDENCE'})
        self.assertEqual(result['state'], 'WAITING_EVIDENCE')
        self.assertIsNone(result['topPriority'])

    def test_only_completed_scheduled_same_main_state_qualifies(self):
        state = O.build(*inputs())
        env = {'GITHUB_EVENT_NAME': 'schedule', 'GITHUB_RUN_ID': '123', 'GITHUB_RUN_ATTEMPT': '1',
               'GITHUB_SHA': 'abc', 'GITHUB_WORKFLOW_REF': 'owner/repo/.github/workflows/ops-daily.yml@refs/heads/main'}
        state['executionReceipt'] = O.execution_receipt(state, env)
        run = {'event': 'schedule', 'id': 123, 'run_attempt': 1, 'path': '.github/workflows/ops-daily.yml',
               'head_sha': 'abc', 'head_branch': 'main', 'status': 'completed', 'conclusion': 'success'}
        self.assertEqual(O.verify_natural_run(state, run, copy.deepcopy(state))['status'], 'NATURAL_RUN_SUCCESS')
        for change in ({'event': 'workflow_dispatch'}, {'status': 'in_progress'}, {'id': 124},
                       {'conclusion': 'failure'}, {'run_attempt': 2}):
            self.assertEqual(O.verify_natural_run(state, dict(run, **change), state)['status'], 'PENDING_NATURAL_RUN')
        self.assertEqual(O.verify_natural_run(state, run, {})['status'], 'PENDING_NATURAL_RUN')
        state['executionReceipt'] = O.execution_receipt(state, dict(env, GITHUB_EVENT_NAME='workflow_dispatch'))
        self.assertEqual(O.verify_natural_run(state, run, state)['status'], 'PENDING_NATURAL_RUN')

    def test_existing_ops_cron_and_dart_boundaries(self):
        root = Path(__file__).parent
        workflow = (root/'.github/workflows/ops-daily.yml').read_text()
        self.assertEqual(workflow.count('- cron:'), 3)
        self.assertIn('ops_status.py --deep --github', workflow)
        self.assertNotIn('dart_research', (root/'analyze_auto.py').read_text())
        self.assertNotIn('dart_research', (root/'compute_team_weights.py').read_text())


if __name__ == '__main__':
    unittest.main()
