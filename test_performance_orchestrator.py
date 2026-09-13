"""Causal failure scenarios and production boundary for the AI-0 loop."""
import ast
from copy import deepcopy
import datetime as dt
import json
from pathlib import Path
import tempfile
import unittest

import performance_orchestrator as P
import ops_status as O


def inputs(ready=False):
    ops={'checkedAt':'2026-09-13T12:00:00+09:00','components':{
        'prices':O.component(O.OK,'PRICES_OK','정상'),
        'analysis':O.component(O.OK,'ANALYSIS_OK','정상'),
        'decisions':O.component(O.IDLE,'DECISIONS_VERIFIED','대기')}}
    cohort={'outcomes':{'pending':600,'blocked':0,'evaluated':0,'evaluatedDecisionDays':0,
                       'gradedDecisionDays':0,'minUniqueDecisionDays':20},
            'failurePatterns':{'minSupport':{'rows':8,'days':5},'clusters':[]}}
    decisions={'quality':{'activeCohort':'m','cohorts':{'m':cohort}}}
    evo={'productionVersion':'m','candidateCounts':{},'experimentTotals':{'totalExperiments':0}}
    failures={'dataSplit':{'sufficient':ready,'uniqueDays':30 if ready else 20},
              'minSupport':{'rows':8,'days':5},'clusters':[]}
    manifest={'runId':'e1','status':'OK','evaluationMeta':{'dataFingerprint':'a'}}
    const={'offlineDataPolicy':{'minResearchDays':10,'minEvalDays':20}}
    return ops,decisions,evo,failures,manifest,const


def cluster(key='call_outcome:SELL_big_rise',n=50,days=10):
    return {'key':key,'label':key,'rawN':n,'uniqueDays':days,'kind':key.split(':')[0]}


class Loop(unittest.TestCase):
    def test_normal_future_waiting(self):
        r=P.build(*inputs());self.assertEqual(r['state'],'WAITING_EVIDENCE')
        self.assertIsNone(r['topPriority']);self.assertFalse(r['researchFocus']['researchRecommended'])

    def test_success_with_zero_candidates_is_not_fault_or_stall(self):
        x=inputs(True);r=P.build(*x)
        self.assertNotIn(r['state'],('FAULT','STALLED'))
        self.assertEqual(r['stagnationAssessment'],'NO_THRESHOLD_DEFINED_OBSERVATION_ONLY')

    def test_supported_repeated_failure_is_actionable(self):
        x=inputs(True);x[3]['clusters']=[cluster()]
        r=P.build(*x);self.assertEqual(r['state'],'ACTION_NEEDED')
        self.assertEqual(r['issues'][0]['key'],'call_outcome:SELL_big_rise')

    def test_high_confidence_beats_more_recent_larger_ordinary_failure(self):
        x=inputs(True);x[3]['clusters']=[cluster(n=900),cluster('confidence:high_confidence_wrong',n=20)]
        r=P.build(*x);self.assertEqual(r['issues'][0]['key'],'confidence:high_confidence_wrong')

    def test_same_evidence_is_same_incident_without_inflating_observations(self):
        x=inputs(True);x[3]['clusters']=[cluster()];a=P.build(*x)
        x[0]['checkedAt']='2026-09-14T12:00:00+09:00';b=P.build(*x,previous=a)
        self.assertEqual(a['issues'][0]['id'],b['issues'][0]['id'])
        self.assertEqual(a['issues'][0]['evidenceObservations'],b['issues'][0]['evidenceObservations'])
        x[3]['clusters'][0]['rawN']+=1;c=P.build(*x,previous=b)
        self.assertEqual(c['issues'][0]['evidenceObservations'],2)

    def test_resolution_is_retained_and_recurrence_reopens_same_id(self):
        x=inputs();x[0]['components']['prices']=O.component(O.FAULT,'PRICES_STALE','지연',basisAt='a')
        a=P.build(*x);ident=a['issues'][0]['id']
        x[0]['components']['prices']=O.component(O.OK,'PRICES_OK','복구');b=P.build(*x,previous=a)
        self.assertEqual(next(i for i in b['issues'] if i['id']==ident)['state'],'RESOLVED')
        c=P.build(*x,previous=b);self.assertEqual(len(c['issues']),len(b['issues']))
        x[0]['components']['prices']=O.component(O.FAULT,'PRICES_STALE','지연',basisAt='b')
        d=P.build(*x,previous=c);item=next(i for i in d['issues'] if i['id']==ident)
        self.assertEqual(item['reopenCount'],1);self.assertEqual(item['state'],'ACTIONABLE')

    def test_integrity_failure_precedes_research_and_cannot_be_waiting(self):
        x=inputs(True);x[3]['clusters']=[cluster('confidence:high_confidence_wrong')]
        x[0]['components']['decisions']=O.component(O.FAULT,'DECISIONS_STORAGE_MISMATCH','원본 불일치')
        r=P.build(*x);self.assertEqual(r['state'],'FAULT')
        self.assertEqual(r['issues'][0]['key'],'DECISIONS_STORAGE_MISMATCH')
        self.assertEqual(next(i for i in r['issues'] if i['key']=='confidence:high_confidence_wrong')['state'],'BLOCKED')
        self.assertFalse(r['researchFocus']['researchRecommended'])

    def test_missing_required_source_is_fault_not_future_waiting(self):
        r=P.build(*inputs(),source_errors={'actual_decisions':'missing_or_invalid_json'})
        self.assertEqual(r['state'],'FAULT')
        self.assertEqual(r['issues'][0]['priorityClass'],0)

    def test_corrupt_incident_history_is_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/P.STATE_PATH;path.parent.mkdir(parents=True)
            path.write_text('{broken')
            with self.assertRaises(ValueError):P.save_state(tmp,P.build(*inputs()))
            self.assertEqual(path.read_text(),'{broken')

    def test_unknown_source_does_not_resolve_prior_fault(self):
        x=inputs();x[0]['components']['prices']=O.component(O.FAULT,'PRICES_STALE','지연')
        a=P.build(*x);x[0]['components']['prices']=O.component(O.UNKNOWN,'UNREADABLE','모름')
        b=P.build(*x,previous=a);self.assertEqual(b['state'],'FAULT')

    def test_sparse_failure_and_future_results_do_not_occupy_top_priority(self):
        x=inputs(True);x[3]['clusters']=[cluster(days=1)]
        r=P.build(*x);self.assertIsNone(r['topPriority'])
        self.assertFalse(r['researchFocus']['researchRecommended'])

    def test_unseen_pattern_is_not_claimed_fixed_by_top_twenty_truncation(self):
        x=inputs(True);x[3]['clusters']=[cluster()];a=P.build(*x)
        x[3]['clusters']=[cluster('analyst:taro')];b=P.build(*x,previous=a)
        old=next(i for i in b['issues'] if i['key']=='call_outcome:SELL_big_rise')
        self.assertNotEqual(old['state'],'RESOLVED')

    def test_no_new_run_does_not_inflate_stagnation(self):
        x=inputs(True);x[3]['clusters']=[cluster()];a=P.build(*x);b=P.build(*x,previous=a)
        self.assertEqual(a['eligibleRunsWithoutProgress'],b['eligibleRunsWithoutProgress'])
        self.assertNotEqual(b['state'],'STALLED')

    def test_observer_writes_only_fixed_state_and_rejects_symlink(self):
        x=inputs();before=deepcopy(x);r=P.build(*x);self.assertEqual(x,before)
        with tempfile.TemporaryDirectory() as tmp:
            protected=Path(tmp)/'production_config.json';protected.write_text('preserved')
            P.save_state(tmp,r)
            self.assertEqual(protected.read_text(),'preserved')
            path=Path(tmp)/P.STATE_PATH;path.unlink();path.symlink_to(protected)
            with self.assertRaises(ValueError):P.save_state(tmp,r)
            self.assertEqual(protected.read_text(),'preserved')

    def test_no_command_network_strategy_writer_or_llm_import(self):
        tree=ast.parse(Path(P.__file__).read_text())
        imports={n.module for n in ast.walk(tree) if isinstance(n,ast.ImportFrom)}
        imports|={a.name for n in ast.walk(tree) if isinstance(n,ast.Import) for a in n.names}
        self.assertFalse(imports&{'subprocess','urllib','requests','httpx','openai','anthropic','analyze_auto','gaeo_evolution.production_config','gaeo_evolution.registry'})
        calls={n.func.attr for n in ast.walk(tree) if isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute)}
        self.assertFalse(calls&{'system','popen','run','approve_production','apply','exec','eval'})
        self.assertFalse(P.build(*inputs())['productionChangesAllowed'])


class Liveness(unittest.TestCase):
    def test_weekly_expected_time_and_existing_delay_grace(self):
        now=dt.datetime(2026,9,13,10,0,tzinfo=O.KST)
        spec=O.SCHEDULED_WORKFLOWS['evolution-lab.yml']
        self.assertEqual(O._expected_last_fire(spec,now).hour,8)
        old={'event':'schedule','head_branch':'main','status':'completed','conclusion':'success','created_at':'2026-09-06T00:00:00Z'}
        self.assertEqual(O._judge_scheduled('evolution-lab.yml',spec,'active',[old],now)[0],O.IDLE)
        self.assertEqual(O._judge_scheduled('evolution-lab.yml',spec,'active',[old],now+dt.timedelta(hours=2))[0],O.FAULT)

    def test_removed_schedule_is_fault(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(O.check_evolution_schedule(tmp)['status'],O.FAULT)
            p=Path(tmp)/'.github/workflows/evolution-lab.yml';p.parent.mkdir(parents=True)
            p.write_text('on:\n  workflow_dispatch:\n')
            self.assertEqual(O.check_evolution_schedule(tmp)['status'],O.FAULT)

    def test_success_without_new_artifact_is_fault(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);p=root/'.github/workflows/evolution-lab.yml';p.parent.mkdir(parents=True)
            p.write_text('on:\n  schedule:\n    - cron: "0 23 * * 6"\n')
            state=root/'gaeo_evolution/status';state.mkdir(parents=True)
            doc={'generatedAt':'2026-09-06T00:00:00Z','lastEvaluationAt':'2026-09-06T00:00:00Z'}
            run={'status':'OK','startedAt':'2026-09-06T00:00:00Z','finishedAt':'2026-09-06T00:00:01Z','evaluationMeta':{'dataFingerprint':'a'}}
            (state/'evolution_status.json').write_text(json.dumps(doc));(state/'last_run_manifest.json').write_text(json.dumps(run))
            live={'workflows':{'evolution-lab.yml':{'status':'OK','lastRunStatus':'completed','lastConclusion':'success','lastRunAt':'2026-09-13T00:00:00Z'}}}
            result=O.check_evolution_liveness(tmp,dt.datetime.now(O.KST),live)
            self.assertEqual(result['code'],'EVOLUTION_OUTPUT_NOT_UPDATED')
            live['workflows']['evolution-lab.yml']['lastRunAt']='2026-09-06T00:00:00Z'
            self.assertEqual(O.check_evolution_liveness(tmp,dt.datetime.now(O.KST),live)['status'],O.OK)


if __name__=='__main__':unittest.main()
