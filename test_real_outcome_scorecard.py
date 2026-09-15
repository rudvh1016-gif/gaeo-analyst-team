#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""실제 판단 성적표의 정직 계약 — 숫자가 맞는지가 아니라 **거짓말을 안 하는지**를 잠근다.

성적표는 스스로 채점하지 않는다. 그래서 여기서 검사할 것은 산식이 아니라 다음 다섯이다.

  1. 표본이 모자란 구간의 숫자를 내지 않는가
  2. 모델 버전을 섞지 않는가 (특히 옛 구간 성적을 현재 성적으로 읽히게 두지 않는가)
  3. SELL 을 공매도 손익으로 바꾸지 않는가 — 부호를 뒤집지 않는가
  4. 등록 안 된 거래비용을 임의로 빼지 않는가
  5. 못 읽은 것을 정상으로 적지 않는가 (그리고 장애로도 적지 않는가)

합성 산출물로만 시험한다. 실제 `model_scoreboard.js` 의 숫자가 어떻든 계약은 같아야 한다.
"""
import contextlib
import io
import json
import os
import tempfile
import unittest

import real_outcome_scorecard as card
from build_model_scoreboard import MIN_UNIQUE_DATES

CURRENT = 'base-test-current'
OLD = 'PRE_HOTFIX_BASE'


def _ok_block(days=33, acc=51.0, ci=(45.4, 57.4), sell_mean=-3.2):
    return {
        'status': 'OK', 'uniqueDates': days, 'matured': days * 500, 'pending': 8,
        'actionDistribution': {'BUY': 100, 'HOLD': 300, 'SELL': 200},
        'overallAccuracy': acc, 'accuracy': acc, 'accuracyCI95': list(ci),
        'directionalAccuracy': 52.0, 'directionalCI95': [40.0, 63.0], 'directionalCount': 300,
        'buy': {'count': 100, 'precision': 38.2, 'meanReturn': -1.34,
                'medianReturn': -1.55, 'marketRelativeMeanReturn': -0.1},
        'hold': {'count': 300, 'precision': 50.7, 'meanReturn': -0.26,
                 'medianReturn': -0.52, 'marketRelativeMeanReturn': -0.03},
        'sell': {'count': 200, 'precision': 53.9, 'meanReturn': sell_mean,
                 'medianReturn': sell_mean, 'marketRelativeMeanReturn': 0.47},
    }


def _short_block(days=17):
    return {'status': 'INSUFFICIENT_EVIDENCE', 'uniqueDates': days, 'matured': days * 500,
            'pending': 3012, 'actionDistribution': {'BUY': 665, 'HOLD': 7460, 'SELL': 2043},
            'reason': f'판단일이 {days}일뿐입니다(최소 {MIN_UNIQUE_DATES}일 필요)',
            # ⚠️ 부족한 구간인데도 숫자가 같이 들어 있는 경우를 일부러 만든다.
            #    성적표가 status 를 무시하고 이 숫자를 퍼가면 여기서 걸린다.
            'overallAccuracy': 99.9, 'accuracyCI95': [99.0, 100.0],
            'buy': {'count': 665, 'precision': 99.9, 'meanReturn': 9.9,
                    'medianReturn': 9.9, 'marketRelativeMeanReturn': 9.9}}


def _board(by_version, *, current=CURRENT, trace=True, horizons=None, evaluated=0):
    payload = {
        'generatedAt': '2026-09-15T03:34:00+00:00', 'gradingPolicyVersion': 'grading_v1_2026-08-16',
        'models': [{'id': 'base_production', 'currentModelVersion': current,
                    'recordCount': 29645, 'maturedCount': 26625, 'pendingCount': 3020,
                    'withheldCount': 0, 'uniquePredictionDates': 50,
                    'horizons': horizons or {}, 'byModelVersion': by_version}],
    }
    if trace:
        payload['decisionTrace'] = {
            'dailyRecordCount': 1800, 'uniqueDecisionDays': 3,
            'comparison': {'states': {'unknown': 1800, 'comparable': 0}},
            'byModelVersion': {current: {'horizons': {'5': {'evaluated': evaluated, 'pending': 1800}}}},
        }
    return payload


class Fixture(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        os.makedirs(os.path.join(self.dir, 'config'), exist_ok=True)

    def write_board(self, payload):
        with open(os.path.join(self.dir, 'model_scoreboard.js'), 'w', encoding='utf-8') as fh:
            fh.write('const MODEL_SCOREBOARD = %s;\n' % json.dumps(payload, ensure_ascii=False))

    def write_cost(self, doc):
        with open(os.path.join(self.dir, 'config', 'scorecard_cost_assumption.json'),
                  'w', encoding='utf-8') as fh:
            json.dump(doc, fh, ensure_ascii=False)


class SampleFloor(Fixture):
    def test_표본이_모자란_구간은_숫자를_싣지_않는다(self):
        self.write_board(_board({CURRENT: _short_block()}))
        got = card.build(self.dir)
        seg = got['segments'][0]
        self.assertEqual(seg['status'], 'INSUFFICIENT_EVIDENCE')
        self.assertIsNone(seg['accuracyPct'], '부족한 구간의 적중률이 실렸다')
        self.assertIsNone(seg['accuracyCI95'])
        self.assertIsNone(seg['calls'], '부족한 구간의 call 별 숫자가 실렸다')
        self.assertNotIn('99.9', json.dumps(got, ensure_ascii=False),
                         '모델보드가 공개하지 않기로 한 숫자가 성적표로 새어 나왔다')

    def test_최소_판단일을_스스로_정하지_않는다(self):
        # 이 파일이 20 을 직접 들고 있으면 모델보드가 기준을 올려도 성적표만 옛 기준으로 남는다.
        src = open(os.path.join(os.path.dirname(os.path.abspath(card.__file__)),
                                'real_outcome_scorecard.py'), encoding='utf-8').read()
        body = src.split('"""', 2)[-1]          # 모듈 docstring 의 설명 문구는 제외
        self.assertNotIn('MIN_UNIQUE_DATES = ', body, '성적표가 최소 판단일을 따로 정의했다')
        self.assertIn('from build_model_scoreboard import MIN_UNIQUE_DATES', body)

    def test_부족하면_판정은_아직_말할_수_없음이다(self):
        self.write_board(_board({CURRENT: _short_block()}))
        got = card.build(self.dir)
        self.assertEqual(got['verdict'], card.INSUFFICIENT_EVIDENCE)
        self.assertIn('3일 모자란다', got['headline'])


class ModelVersionsStaySeparate(Fixture):
    def test_옛_구간이_충분해도_현재_모델_성적으로_말하지_않는다(self):
        self.write_board(_board({OLD: _ok_block(), CURRENT: _short_block()}))
        got = card.build(self.dir)
        self.assertEqual(got['verdict'], card.INSUFFICIENT_EVIDENCE,
                         '옛 구간 하나로 "성적을 말할 수 있다"가 됐다')
        self.assertIn('지금 사이트에 나오는 판단이 아니다', got['headline'])
        old = [s for s in got['segments'] if s['key'] == OLD][0]
        self.assertFalse(old['isCurrentModel'])
        self.assertIn('옛 구간', old['label'])

    def test_판단일을_합치지_않는다(self):
        self.write_board(_board({OLD: _ok_block(days=33), CURRENT: _short_block(days=17)}))
        got = card.build(self.dir)
        self.assertEqual(len(got['segments']), 2)
        self.assertEqual(sorted(s['decisionDays'] for s in got['segments']), [17, 33])
        self.assertNotIn(50, [s['decisionDays'] for s in got['segments']],
                         '두 구간의 판단일을 더해 기준을 넘긴 구간을 만들었다')

    def test_현재_모델이_충분하면_그때만_성적을_말한다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24, acc=58.0, ci=(53.0, 62.0))}))
        got = card.build(self.dir)
        self.assertEqual(got['verdict'], card.MEASURED)
        self.assertIn(CURRENT, got['headline'])
        self.assertIn('50%를 비켜 갔다', got['headline'])

    def test_구간이_50을_걸치면_그_사실만_말하고_실력_판정은_하지_않는다(self):
        # 2026-09-15 정정: 예전에는 여기서 "동전 던지기와 구분되지 않는다"고 단정했다.
        # 분모에 BUY·HOLD·SELL 이 섞여 있어 50%는 이 성적의 기준선이 아니다.
        self.write_board(_board({CURRENT: _ok_block(days=24, acc=51.0, ci=(45.4, 57.4))}))
        got = card.build(self.dir)
        self.assertIn('95% 구간이 50%를 품는다', got['headline'])
        self.assertIn('50%는 이 성적의 기준선이 아니다', got['headline'])
        self.assertNotIn('동전 던지기', got['headline'])


class SellIsNeverShort(Fixture):
    """이 저장소의 SELL 은 청산·회피 신호다. 공매도 수익으로 바꾸는 순간 없는 상품의
    성과를 발명하게 된다. 그래서 값·선언·소스 셋 다 잠근다."""

    def test_SELL_수익률의_부호를_뒤집지_않는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24, sell_mean=-3.2)}))
        sell = card.build(self.dir)['segments'][0]['calls']['SELL']
        self.assertEqual(sell['meanReturnPct'], -3.2, 'SELL 수익률 부호가 바뀌었다')
        self.assertEqual(sell['semantics']['returnSignConvention'], 'LONG_RETURN_OF_THE_STOCK')
        self.assertFalse(sell['semantics']['isShortEntry'])

    def test_공매도_손익_필드를_만들지_않는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        blob = json.dumps(card.build(self.dir), ensure_ascii=False).lower()
        for banned in ('shortpnl', 'shortreturn', 'shortprofit', '"short"', 'shortside'):
            self.assertNotIn(banned, blob, f'공매도 손익 필드({banned})가 생겼다')

    def test_사람이_읽는_요약에도_경고가_붙는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        text = card.render(card.build(self.dir))
        self.assertIn('공매도 손익 아님', text)


class CostAssumption(Fixture):
    def test_등록이_없으면_비용을_빼지_않고_없다고_말한다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))   # config 파일 자체를 안 만든다
        got = card.build(self.dir)
        self.assertEqual(got['costAssumption']['status'], 'COST_ASSUMPTION_NOT_REGISTERED')
        self.assertEqual(got['segments'][0]['calls']['BUY']['meanReturnPct'], -1.34,
                         '등록되지 않은 비용이 수익률에서 빠졌다')
        self.assertEqual(got['segments'][0]['calls']['BUY']['returnBasis'], 'GROSS_BEFORE_COST')

    def test_registered_false_인_설정도_미등록으로_읽는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        self.write_cost({'registered': False, 'why': '아직 정하지 않았다',
                         'referenceOnly': {'roundTripPct': 0.23, 'source': 'paper_engine.py'}})
        cost = card.build(self.dir)['costAssumption']
        self.assertFalse(cost['registered'])
        self.assertEqual(cost['status'], 'COST_ASSUMPTION_NOT_REGISTERED')
        self.assertEqual(cost['referenceOnly']['roundTripPct'], 0.23)

    def test_망가진_설정을_등록된_것으로_읽지_않는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        with open(os.path.join(self.dir, 'config', 'scorecard_cost_assumption.json'),
                  'w', encoding='utf-8') as fh:
            fh.write('{ 이건 JSON 이 아니다')
        cost = card.build(self.dir)['costAssumption']
        self.assertFalse(cost['registered'])
        self.assertEqual(cost['reason'], 'config_unreadable')

    def test_등록되면_상태가_바뀐다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        self.write_cost({'registered': True, 'model': {'roundTripPct': 0.23},
                         'appliesFrom': '2026-10-01'})
        cost = card.build(self.dir)['costAssumption']
        self.assertTrue(cost['registered'])
        self.assertEqual(cost['status'], 'COST_ASSUMPTION_REGISTERED')
        self.assertEqual(cost['appliesFrom'], '2026-10-01')

    def test_실제_저장소_설정은_아직_미등록이다(self):
        # 등록은 소유자 결정이다. 누가 조용히 true 로 바꾸면 여기서 드러난다.
        here = os.path.dirname(os.path.abspath(card.__file__))
        doc = json.load(open(os.path.join(here, card.COST_CONFIG), encoding='utf-8'))
        self.assertFalse(doc['registered'])
        self.assertTrue(doc.get('ownerDecisionRequired'), '무엇을 정해야 하는지가 비어 있다')


class UnknownIsNotFine(Fixture):
    def test_산출물이_없으면_확인_불가다(self):
        got = card.build(self.dir)          # model_scoreboard.js 자체를 안 만든다
        self.assertEqual(got['verdict'], card.UNVERIFIED)
        self.assertIn('확인하지 못했다', got['headline'])
        self.assertEqual(got['sources']['model_scoreboard.js']['error'], 'missing')

    def test_산출물이_깨져도_정상이라고_하지_않는다(self):
        with open(os.path.join(self.dir, 'model_scoreboard.js'), 'w', encoding='utf-8') as fh:
            fh.write('const MODEL_SCOREBOARD = {깨진 것};\n')
        got = card.build(self.dir)
        self.assertEqual(got['verdict'], card.UNVERIFIED)
        self.assertTrue(got['sources']['model_scoreboard.js']['error'])

    def test_운영모델_구간이_없으면_확인_불가다(self):
        payload = _board({CURRENT: _ok_block()})
        payload['models'] = [{'id': 'research_a'}]
        self.write_board(payload)
        self.assertEqual(card.build(self.dir)['verdict'], card.UNVERIFIED)

    def test_구간이_하나도_없으면_표본_부족이_아니라_확인_불가다(self):
        payload = _board({})          # byModelVersion 이 비어 있다
        self.write_board(payload)
        got = card.build(self.dir)
        self.assertEqual(got['verdict'], card.UNVERIFIED,
                         '읽은 것이 비어 있는데 "기록이 모자라다"로 적었다')
        self.assertIn('기록이 모자란 것과 다르다', got['headline'])
        self.assertNotIn('None일', got['headline'])

    def test_확인_불가만_종료코드_2다(self):
        # 표본 부족은 장애가 아니다(교훈 ④ 모른다를 고장으로 바꾸지도 마라).
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(card.main(['--json', '--repo', self.dir]), 2)
            self.write_board(_board({CURRENT: _short_block()}))
            self.assertEqual(card.main(['--json', '--repo', self.dir]), 0)


class TwoLedgers(Fixture):
    def test_원장_둘을_따로_보고한다(self):
        self.write_board(_board({CURRENT: _short_block()}))
        led = card.build(self.dir)['ledgers']
        self.assertEqual(led['gradedNow']['maturedRecords'], 26625)
        self.assertEqual(led['sealedOriginals']['evaluated'], 0)
        self.assertEqual(led['sealedOriginals']['pending'], 1800)
        self.assertEqual(led['sealedOriginals']['comparisonStates']['unknown'], 1800)

    def test_생존편향_한계를_적어_둔다(self):
        self.write_board(_board({CURRENT: _short_block()}))
        self.assertTrue(any('생존편향' in line for line in card.build(self.dir)['limits']))


class NoArbitraryExcellence(Fixture):
    """공개 기준을 넘긴 것과 **투자 우수성이 입증된 것**을 섞지 않는다.

    전체 적중률의 분모에는 BUY·HOLD·SELL 이 섞여 있고 셋의 적중 정의가 다르다.
    특히 HOLD 는 "크게 안 움직이면 적중" 이라 기준선이 50% 가 아니다.
    그래서 50% 초과를 실력으로 부르지 않는다(2026-09-15 정정).
    """

    def test_HOLD가_대부분인데_50퍼센트를_넘겨도_우수성이라_하지_않는다(self):
        block = _ok_block(days=24, acc=58.0, ci=(53.0, 62.0))
        block['hold']['count'] = 9000          # 분모를 HOLD 가 지배한다
        block['actionDistribution'] = {'BUY': 100, 'HOLD': 9000, 'SELL': 200}
        self.write_board(_board({CURRENT: block}))
        got = card.build(self.dir)
        blob = json.dumps(got, ensure_ascii=False) + card.render(got)
        for banned in ('동전 던지기', '실력', '우수', '입증', '검증됐'):
            self.assertNotIn(banned, blob, f'임의 기준으로 우수성을 주장했다({banned})')
        self.assertIn('50%는 이 성적의 기준선이 아니다', blob)

    def test_구간이_50을_비켜_가도_실력_판정을_하지_않는다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24, acc=58.0, ci=(53.0, 62.0))}))
        text = card.render(card.build(self.dir))
        self.assertIn('95% 구간이 50%를 비켜 갔다', text)
        self.assertNotIn('동전 던지기', text)

    def test_판단일이_기준을_넘어도_입증으로_승격하지_않는다(self):
        # 19일(부족) → 20일(측정 가능). 바뀌는 것은 '보여줄 수 있다'뿐이다.
        self.write_board(_board({CURRENT: _short_block(days=19)}))
        before = card.build(self.dir)
        self.assertEqual(before['verdict'], card.INSUFFICIENT_EVIDENCE)
        self.write_board(_board({CURRENT: _ok_block(days=20, acc=58.0, ci=(53.0, 62.0))}))
        after = card.build(self.dir)
        self.assertEqual(after['verdict'], card.MEASURED)
        blob = json.dumps(after, ensure_ascii=False) + card.render(after)
        for banned in ('PROVEN', '입증', '우수'):
            self.assertNotIn(banned, blob, f'판단일만 채우고 {banned} 으로 승격했다')

    def test_등록된_비교_기준선이_없다는_어휘가_있다(self):
        self.assertEqual(card.BASELINE_NOT_REGISTERED, 'BASELINE_NOT_REGISTERED')


class SentencesFollowTheData(Fixture):
    """오늘의 사실을 영원한 사실처럼 박아 두지 않는다."""

    def test_봉인_원본이_채점되기_시작하면_설명이_바뀐다(self):
        self.write_board(_board({CURRENT: _short_block()}, evaluated=0))
        zero = card.build(self.dir)['ledgers']['sealedOriginals']
        self.assertIn('아직 한 건도 채점되지 않았다', zero['what'])

        self.write_board(_board({CURRENT: _short_block()}, evaluated=7))
        some = card.build(self.dir)['ledgers']['sealedOriginals']
        self.assertIn('7건이 채점됐다', some['what'])
        self.assertNotIn('한 건도', some['what'], '채점이 시작됐는데 옛 문장이 남았다')

    def test_채점_건수를_읽지_못하면_0건이라_하지_않는다(self):
        payload = _board({CURRENT: _short_block()})
        payload['decisionTrace']['byModelVersion'][CURRENT]['horizons']['5'] = {'pending': 1800}
        self.write_board(payload)
        what = card.build(self.dir)['ledgers']['sealedOriginals']['what']
        self.assertIn('확인 불가', what)

    def test_없는_horizon과_결과를_기다리는_horizon을_구분한다(self):
        self.write_board(_board({CURRENT: _short_block()}, horizons={
            '5': {'status': 'INSUFFICIENT_EVIDENCE', 'uniqueDates': 17, 'matured': 8500, 'pending': 3012},
            '20': {'status': 'PENDING_NOT_MATURED', 'matured': 0, 'pending': 4200, 'uniqueDates': 0},
            '60': {'status': 'NOT_APPLICABLE', 'matured': 0, 'pending': 0, 'uniqueDates': 0},
        }))
        limits = ' / '.join(card.build(self.dir)['limits'])
        self.assertIn('20D 는 채점된 기록이 0건이고 4200건이 결과를 기다린다', limits)
        self.assertIn('60D 는 이 구간에 해당하지 않는다', limits)
        self.assertNotIn('60D 는 채점된 기록이', limits, '없는 것을 대기 중이라고 적었다')

    def test_60D가_0건이라는_문장을_박아_두지_않는다(self):
        # horizon 정보가 아예 없으면 60D 문장도 만들지 않는다.
        self.write_board(_board({CURRENT: _short_block()}, horizons={}))
        self.assertNotIn('60D', ' / '.join(card.build(self.dir)['limits']))


class CostRegisteredIsNotCostApplied(Fixture):
    """등록했다는 것과 실제로 비용을 빼고 계산했다는 것은 다른 일이다."""

    def test_등록만_하고_적용_안_하면_여전히_gross다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        self.write_cost({'registered': True, 'model': {'roundTripPct': 0.23}, 'appliesFrom': '2026-10-01'})
        got = card.build(self.dir)
        self.assertTrue(got['costAssumption']['registered'])
        self.assertFalse(got['costAssumption']['appliedInCalculation'],
                         'registered 만으로 순수익 표시를 켰다')
        self.assertTrue(any('반영 전(gross)' in l and '아직' in l for l in got['limits']),
                        got['limits'])
        self.assertEqual(got['segments'][0]['calls']['BUY']['returnBasis'], 'GROSS_BEFORE_COST')

    def test_실제로_적용됐다고_표시된_경우에만_반영됐다고_말한다(self):
        self.write_board(_board({CURRENT: _ok_block(days=24)}))
        self.write_cost({'registered': True, 'appliedInCalculation': True,
                         'model': {'roundTripPct': 0.23}, 'appliesFrom': '2026-10-01'})
        limits = card.build(self.dir)['limits']
        self.assertTrue(any('거래비용이 반영돼 있다' in l for l in limits), limits)


if __name__ == '__main__':
    unittest.main()
