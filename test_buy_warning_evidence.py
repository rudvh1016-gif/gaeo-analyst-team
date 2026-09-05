"""Adversarial fixtures for the disclosure path, with no external services."""
import datetime
import unittest
from copy import deepcopy

import archive_analysis as archive
import buy_warning as B
import buy_warning_evidence as E
import compute_team_weights as W


def candles(values):
    start=datetime.date(2026,1,1)
    return [dict(date=str(start+datetime.timedelta(days=i)),close=v) for i,v in enumerate(values)]


class Evidence(unittest.TestCase):
    def test_future_and_decision_close_cannot_change_reconstructed_features(self):
        rows=candles([100+i for i in range(30)])
        day=rows[24]['date'];base=124
        before=B.historical_flag(rows,day,base)
        for row in rows[24:]:row['close']=99999
        self.assertEqual(before,B.historical_flag(rows,day,base))
        self.assertEqual(B.vol20_at(rows,day,base),B.vol20_at(rows[:25],day,base))

    def test_holiday_does_not_add_fake_zero_return_candle(self):
        rows=candles([100+i for i in range(25)])
        last=rows[-1]['date'];nextday=str(datetime.date.fromisoformat(last)+datetime.timedelta(days=1))
        self.assertEqual(B.historical_flag(rows,last,124),B.historical_flag(rows,nextday,124))
        self.assertEqual(B.known_closes(rows,nextday,999),[])

    def test_volatility_matches_live_population_sd_and_minimum(self):
        from compute_indicators import risk_for
        rows=candles([100,110,105,102,115,108])
        self.assertAlmostEqual(round(B.vol20_at(rows,rows[-1]['date'],108),2),risk_for(rows,{})['vol20'])
        self.assertIsNone(B.vol20_at(rows[:5],rows[4]['date'],115))

    def test_ret20_requires_21_prices(self):
        rows=candles([100+i for i in range(21)])
        self.assertIsNone(B.historical_flag(rows[:20],rows[19]['date'],119)['ret20'])
        self.assertAlmostEqual(B.historical_flag(rows,rows[20]['date'],120)['ret20'],20)

    def test_terminal_loss_is_not_path_loss(self):
        rows=candles([100]*25+[80,90,95,98,101])
        h={'000001':[dict(date=rows[24]['date'],base=100,call='BUY',tier='auto')]}
        result=E.compute(h,{'000001':rows},{},{'new'},W.record_base_version)
        self.assertEqual(result['allTime']['crashPct'],0)
        self.assertEqual(result['allTime']['meanRet'],1)
        self.assertEqual(result['allTime']['graded'],0)  # exactly +1% stays in the deadband
        self.assertEqual(result['crashBasis'],'fifth_session_close_return')

    def test_pending_withheld_reconstructed_and_manual_are_not_live(self):
        rows=candles([100]*35);day=rows[24]['date']
        base=dict(date=day,base=100,call='BUY',tier='auto')
        h={f'{i:06d}':[dict(base,**extra)] for i,extra in enumerate([
            {},{'recon':True},{'tier':'deep'},{'judgmentWithheld':True},
            {'call':'JUDGMENT_WITHHELD'},{'date':rows[-2]['date']}])}
        result=E.compute(h,{c:rows for c in h},{},{'new'},W.record_base_version)
        self.assertEqual(result['allTime']['n'],1)
        self.assertEqual(result['legacyMixed']['n'],3)
        self.assertEqual(result['reconstructed']['n'],1)
        self.assertEqual(result['nonAuto']['n'],1)

    def test_duplicate_auto_code_date_is_excluded_not_cherry_picked(self):
        rows=candles([100]*35);entry=dict(date=rows[24]['date'],base=100,call='BUY',tier='auto')
        result=E.compute({'000001':[entry,dict(entry,call='SELL')]},{'000001':rows},{},{'new'},W.record_base_version)
        self.assertIsNone(result['allTime'])
        self.assertEqual(result['provenance']['excludedRecords']['duplicateCodeDate'],1)

    def test_missing_history_remains_unknown(self):
        rows=candles([100]*7);entry=dict(date=rows[0]['date'],base=100,call='BUY',tier='auto')
        result=E.compute({'000001':[entry]},{'000001':rows},{},{'new'},W.record_base_version)
        self.assertEqual(result['cautionMatrix']['unknown']['n'],1)
        self.assertIsNone(result['cautionMatrix']['none'])

    def test_baseline_uses_buy_date_exposure_not_pool_size(self):
        pool=[dict(day='a',ret5=10)]*100+[dict(day='b',ret5=-10)]*2
        buy=[dict(day='a')]*1+[dict(day='b')]*9
        baseline=E.matched_baseline(pool,buy)
        self.assertEqual(baseline['meanRet'],-8)
        self.assertEqual(baseline['crashPct'],90)
        self.assertEqual(baseline['weightedDecisionN'],10)

    def test_direction_accuracy_is_not_probability_of_positive_return(self):
        rows=[dict(day='a',ret5=x) for x in [2,-2,.5,.5,.5]]
        b=E.block(rows)
        self.assertEqual(b['acc'],50)
        self.assertEqual(b['positivePct'],80)
        self.assertEqual(b['graded'],2)

    def test_adverse_warning_effect_is_reported_without_asserting_monotonicity(self):
        rows=[dict(day=str(i),warn=warn,available=True,ret5=10 if warn else -10)
              for i in range(15) for warn in (True,False)]
        b=E.warning_block(rows)
        self.assertEqual(b['crashGapPp'],-100)
        self.assertEqual(b['evidenceStatus'],'EXPLORATORY_NOT_VALIDATED')

    def test_archive_records_versioned_warning_without_backfill(self):
        original={'chief':{'call':'BUY','overheat':B.overheat_flag({'tech':{'ret5':11,'ret20':2}})}}
        prior=deepcopy(original)
        record=archive._entry_from(original,'2026-09-05')
        # 2026-09-05: 파일 크기 때문에 필요한 키만 저장한다. 사전등록·성적표가 읽는 값은 전부 남아야 한다.
        for key in ('version','available','warn','triggers','ret5','ret20','vol20'):
            self.assertEqual(record['overheat'][key],original['chief']['overheat'][key],key)
        self.assertEqual(set(record['overheat']),set(archive.OVERHEAT_ARCHIVE_KEYS)&set(original['chief']['overheat']))
        self.assertNotIn('note',record['overheat']); self.assertNotIn('thresholds',record['overheat'])
        self.assertEqual(original,prior)
        self.assertNotIn('overheat',archive._entry_from({'chief':{'call':'BUY'}},'2026-09-05'))

    def test_twenty_day_overlap_needs_more_than_ten_dates(self):
        blocks={str(i):dict(own=[9,1],bull=[5,5],bear=[5,5]) for i in range(10)}
        self.assertIsNone(W._block_bootstrap(blocks,W._stat_lift,block_length=20))


if __name__=='__main__':unittest.main()
