"""Use generated prices/records, never assert that real performance is good."""
from copy import deepcopy
import datetime as dt
import unittest

import decision_quality as Q


def record(day='2026-09-07', code='000001', call='BUY', **extra):
    return dict(dict(recordId=day+code, code=code, date=day, decisionAt=day+' 16:00',
                     source='actual_auto', tier='auto', call=call, total=65, confidence=80,
                     modelVersion='m', productionConfigVersion=None, scoringVersion='s',
                     coverageVersion='GAEO_COVERAGE_V2_600', judgmentWithheld=False), **extra)


def outcome(r, status='evaluated', ret=4, verdict='hit'):
    return dict(recordId=r['recordId'], horizon=5, status=status, ret=ret, verdict=verdict,
                scoringVersion=r['scoringVersion'])


class Quality(unittest.TestCase):
    def test_pending_and_blocked_are_not_accuracy_or_abstention(self):
        rows=[record(code='000001'),record(code='000002',call='HOLD')]
        results={r['recordId']:outcome(r,s) for r,s in zip(rows,['pending','blocked'])}
        q=Q.summarize(rows,results,'m'); c=q['cohorts'][q['activeCohort']]
        self.assertIsNone(c['actions']['BUY']['accuracyPct'])
        self.assertEqual(c['distribution']['counts']['HOLD'],1)
        self.assertEqual(c['distribution']['counts']['WITHHELD'],0)
        self.assertEqual(c['outcomes']['blocked'],1)

    def test_withheld_precedes_hold_but_missing_flag_does_not(self):
        rows=[record(call='HOLD',judgmentWithheld=True),record(code='000002',call='HOLD')]
        rows[1].pop('judgmentWithheld')
        q=Q.summarize(rows,{},'m')['latestRound']
        self.assertEqual(q['counts']['WITHHELD'],1)
        self.assertEqual(q['counts']['HOLD'],1)
        self.assertEqual(q['judgedRecords'],1)

    def test_one_day_six_hundred_records_is_one_day(self):
        rows=[record(code=f'{i:06}') for i in range(600)]
        results={r['recordId']:outcome(r) for r in rows}
        s=Q.grade_stats(rows,results)
        self.assertEqual(s['evaluatedDecisionDays'],1)
        self.assertIsNone(s['accuracyPct']);self.assertIsNone(s['accuracy95'])

    def test_existing_daily_selection_and_latest_round_missing(self):
        old=record(recordId='old'); new=record(recordId='new',decisionAt='2026-09-07 16:10',call='SELL')
        another=record(code='000002')
        q=Q.summarize([old,new,another],{},'m'); c=q['cohorts'][q['activeCohort']]
        self.assertEqual(c['distribution']['observedRecords'],2)
        self.assertEqual(q['latestRound']['observedRecords'],1)
        self.assertEqual(q['latestRound']['missingRecords'],599)

    def test_versions_and_low_sell_score_are_not_mixed(self):
        rows=[record(total=20,confidence=90,call='SELL'),record(code='000002',modelVersion='old')]
        q=Q.summarize(rows,{},'m');self.assertEqual(len(q['cohorts']),2)
        c=q['cohorts'][q['activeCohort']]
        self.assertEqual(c['bins']['total']['SELL'][0]['recordCount'],1)
        self.assertEqual(c['bins']['confidence']['SELL'][6]['recordCount'],1)
        self.assertFalse(q['scoreIsProbability'])

    def test_day_bootstrap_and_neutral_denominator(self):
        rows=[record(day=(dt.date(2026,1,1)+dt.timedelta(days=i)).isoformat()) for i in range(25)]
        results={r['recordId']:outcome(r,verdict='miss' if i%3==0 else 'hit') for i,r in enumerate(rows)}
        neutral=record(day=rows[0]['date'],code='000002');rows.append(neutral)
        results[neutral['recordId']]=outcome(neutral,ret=0,verdict='mid')
        a=Q.grade_stats(rows,results);b=Q.grade_stats(rows,results)
        self.assertEqual(a,b);self.assertEqual(a['accuracyDenominator'],25)
        self.assertEqual(a['neutral'],1);self.assertIsNotNone(a['accuracy95'])
        self.assertEqual(a['evidenceStatus'],'EXPLORATORY_NOT_VALIDATED')

    def test_unknown_scope_and_invalid_values_do_not_become_zero(self):
        r=record(total=float('nan'),confidence=None,coverageVersion=None)
        q=Q.summarize([r],{},'m')
        self.assertIsNone(q['latestRound']['judgedPctOfUniverse'])
        self.assertEqual(q['cohorts'][q['activeCohort']]['bins']['total']['BUY'][-1]['recordCount'],1)

    def test_wrong_identity_horizon_or_version_is_not_graded(self):
        r=record()
        for key,val in [('recordId','other'),('horizon',20),('scoringVersion','other'),('ret',float('inf'))]:
            o=outcome(r);o[key]=val
            self.assertEqual(Q.grade_stats([r],{r['recordId']:o})['evaluated'],0)

    def test_inputs_are_not_mutated(self):
        rows=[record()];results={rows[0]['recordId']:outcome(rows[0])};before=deepcopy((rows,results))
        Q.summarize(rows,results,'m');self.assertEqual((rows,results),before)


if __name__=='__main__': unittest.main()
