#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""LEGAL DATA SUPPLY MIGRATION PHASE 1 계약 시험 (2026-09-16).

무엇을 지키나
    · 네이버 의존성 지도(config/data_supply_migration.json)의 어휘·완전성: 모든 상품이 4개 교체상태 중 하나이고,
      네이버 endpoint 동결 목록(config/source_compliance.json)의 endpoint 가 빠짐없이 어느 상품엔가 연결돼 있으며,
      소비자 파일이 실제로 존재한다. 추측 분류를 막기 위해 CRITICAL 상품은 결정영향 근거 문장을 가진다.
    · 공식 대체 후보(fsc_public_data) 게이트의 운영 기본값은 닫혀 있고, 어댑터는 닫힌 게이트에서 네트워크에 나가지 않는다.
    · 어댑터는 값을 지어내지 않는다(필수 필드 누락·계약 위반 행은 사유와 함께 거른다), 단위·코드·날짜를 계약대로 바꾼다,
      serviceKey 를 어디에도 남기지 않는다.
    · 오프라인 그림자 비교는 Production 을 재현한다(rebuild_indicators == indicators.json · evaluate == auto_analysis.js),
      파일을 쓰지 않고, 시나리오가 입력을 오염시키지 않으며, 공급자 값 대조는 불일치를 놓치지 않는다.
    · Production 스위치 9개가 전부 0 이다.
표준 라이브러리만 사용(test_ci_parity).
"""
import copy
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout

import source_compliance as compliance
from data_supply import contracts, fsc_stock_price as fsc, shadow_compare as shadow

HERE = os.path.dirname(os.path.abspath(__file__))
REGISTRY = os.path.join(HERE, 'config', 'data_supply_migration.json')


def _registry():
    with open(REGISTRY, encoding='utf-8') as handle:
        return json.load(handle)


def _fixture_payload():
    return fsc.load_fixture()


class RegistryContract(unittest.TestCase):
    def test_어휘와_교체상태가_정해진_값뿐이다(self):
        reg = _registry()
        self.assertEqual(reg['schemaVersion'], 'data_supply_migration_v1')
        imp, st = set(reg['vocabulary']['importance']), set(reg['vocabulary']['replaceStatus'])
        self.assertEqual(st, {'READY_TO_REPLACE', 'READY_FOR_SHADOW', 'OWNER_APPROVAL_REQUIRED', 'NO_SAFE_REPLACEMENT_FOUND'})
        ids = [p['id'] for p in reg['products']]
        self.assertEqual(len(ids), len(set(ids)), '상품 id 중복')
        for p in reg['products']:
            self.assertIn(p['importance'], imp, p['id'])
            self.assertIn(p['replaceStatus'], st, p['id'])
            for key in ('naver', 'internal', 'consumers', 'decisionImpact', 'screen', 'scorecard', 'validation', 'candidates'):
                self.assertIn(key, p, (p['id'], key))

    def test_CRITICAL_은_결정영향_근거가_있고_직접영향이_명시된다(self):
        for p in _registry()['products']:
            if p['importance'] == 'CRITICAL':
                self.assertTrue(p['decisionImpact'].startswith('DIRECT'), f"{p['id']}: CRITICAL 인데 DIRECT 근거가 없다")
                self.assertTrue(p['consumers'], p['id'])

    def test_네이버_동결_endpoint_가_전부_어느_상품엔가_연결돼_있다(self):
        frozen = compliance.load()['providers']['naver_finance']['freeze']['endpointPatterns']
        covered = set(_registry()['naverEndpointsCovered'])
        for pat in frozen:
            if re.fullmatch(r'https://[^/]+/?', pat):
                continue                        # Referer 전용 호스트 항목
            self.assertIn(pat, covered, f'동결 endpoint {pat} 가 지도에 없다')

    def test_소비자_파일이_실제로_있다(self):
        for p in _registry()['products']:
            for consumer in p['consumers']:
                path = consumer.split('(')[0].strip()
                self.assertTrue(os.path.exists(os.path.join(HERE, path)), f"{p['id']}: {path} 없음")

    def test_대체_불가_상품은_후보가_비어_있고_이유가_적혀_있다(self):
        for p in _registry()['products']:
            if p['replaceStatus'] == 'NO_SAFE_REPLACEMENT_FOUND':
                self.assertEqual(p['candidates'], [], p['id'])
        flow = next(p for p in _registry()['products'] if p['id'] == 'L_flow_foreign')
        self.assertEqual(flow['replaceStatus'], 'NO_SAFE_REPLACEMENT_FOUND')
        self.assertIn('찾지 못함', flow['note'])

    def test_Production_스위치는_전부_0_이다(self):
        for key, value in _registry()['productionSwitches'].items():
            self.assertEqual(value, 0, key)
        self.assertEqual(shadow.run_decision_shadow.__doc__ or '', shadow.run_decision_shadow.__doc__ or '')

    def test_어댑터가_못_바꾸는_목록과_지도가_일치한다(self):
        not_replaced = ' '.join(fsc.NOT_REPLACED)
        for token in ('per', 'pbr', 'flow', 'consensus', 'index', 'fx'):
            self.assertIn(token, not_replaced)
        fsc_products = {p['id'] for p in _registry()['products']
                        if any(c.get('provider') == 'fsc_public_data' for c in p['candidates'])}
        self.assertNotIn('L_flow_foreign', fsc_products)
        self.assertNotIn('P_consensus', fsc_products)
        self.assertIn('A_current_price', fsc_products)
        self.assertIn('T_daily_ohlcv_history', fsc_products)


class GateStaysClosed(unittest.TestCase):
    def test_공식_대체_후보_게이트의_운영_기본값은_닫혀_있다(self):
        g = compliance.gate(fsc.PROVIDER_ID)
        self.assertEqual(g['state'], compliance.STATE_UNVERIFIED)
        self.assertEqual(g['commercialState'], compliance.COMMERCIAL_NOT_CLEARED)
        self.assertFalse(g['automatedCollectionAllowed'])
        prov = compliance.provider(fsc.PROVIDER_ID)
        self.assertIn('apis.data.go.kr', prov['hostnames'])
        self.assertTrue(prov['checkedAt'])

    def test_닫힌_게이트에서는_네트워크에_나가지_않는다(self):
        calls = []

        def opener(url, timeout):
            calls.append(url)
            return b'{}'
        with self.assertRaises(compliance.LegalGateError):
            fsc.fetch_page(bas_dt='20260915', service_key='dummy', opener=opener)
        self.assertEqual(calls, [])

    def test_키가_없으면_열린_게이트여도_호출하지_않는다(self):
        calls = []
        old = os.environ.pop(fsc.KEY_ENV, None)
        try:
            with self.assertRaises(contracts.ContractError):
                fsc.fetch_page(bas_dt='20260915', gate=compliance.cleared_gate(fsc.PROVIDER_ID),
                               opener=lambda url, timeout: calls.append(url) or b'{}')
        finally:
            if old is not None:
                os.environ[fsc.KEY_ENV] = old
        self.assertEqual(calls, [])

    def test_라이브_CLI_는_닫힌_게이트에서_종료코드_2(self):
        r = subprocess.run([sys.executable, '-m', 'data_supply.fsc_stock_price', '--live', '--bas-dt', '20260915'],
                           cwd=HERE, capture_output=True, text=True, env=dict(os.environ, PYTHONUTF8='1'))
        self.assertEqual(r.returncode, 2, r.stdout + r.stderr)
        self.assertIn('LEGAL_GATE CLOSED', r.stdout)


class AdapterNormalization(unittest.TestCase):
    def test_픽스처가_합성이라고_스스로_밝힌다(self):
        payload = _fixture_payload()
        self.assertIn('SYNTHETIC', payload.get('fixtureNote', ''))
        for code in {row['srtnCd'].lstrip('A') for row in payload['response']['body']['items']['item']}:
            self.assertTrue(code.startswith('9999'), '실제 종목코드처럼 보이는 픽스처 코드')

    def test_픽스처_전체가_계약으로_변환된다(self):
        rows, rejected, meta = fsc.fixture_rows()
        self.assertEqual(rejected, [])
        self.assertEqual(len(rows), 15)
        self.assertEqual(meta['resultCode'], '00')
        series = fsc.to_daily_series(rows)
        self.assertEqual(sorted(series), ['999901', '999902', '999903', '999904', '999905'])
        for code, bars in series.items():
            self.assertEqual([b['date'] for b in bars], sorted(b['date'] for b in bars))
            for bar in bars:
                self.assertEqual(contracts.validate_daily_bar(bar), [], (code, bar['date']))
                self.assertIsNone(bar['frgnRate'])            # 이 데이터셋엔 없다 — 지어내지 않는다
                self.assertIsInstance(bar['tradingValue'], int)

    def test_코드_날짜_단위_변환(self):
        self.assertEqual(fsc.normalize_code('A005930'), '005930')
        self.assertEqual(fsc.normalize_code(' 5930'.strip().zfill(6)), '005930')
        self.assertEqual(fsc.normalize_date('20260916'), '2026-09-16')
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_date('20260931')
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_code('12345')
        rows, _, _ = fsc.fixture_rows()
        row = next(r for r in rows if r['code'] == '999901' and r['date'] == '2026-09-11')
        quote, coverage = fsc.to_quote(row, previous_close=10000)
        self.assertEqual(quote['price'], 10300)
        self.assertEqual(quote['cap'], contracts.cap_str(103_000_000_000 / 1_000_000))
        self.assertEqual(contracts.cap_str(103_000_000_000 / 1_000_000), '0.1조')
        self.assertTrue(coverage['rateCrossCheck']['consistent'])
        for key in fsc.QUOTE_FIELDS_NOT_PROVIDED:
            self.assertIsNone(quote[key])
            self.assertEqual(coverage[key], contracts.NOT_PROVIDED_BY_SOURCE)
        self.assertEqual(contracts.validate_quote(quote), [])

    def test_cap_str_은_update_prices_와_같은_식이다(self):
        import update_prices
        for value in (1, 123456, 9_999_999, 10_000_000, 1_234_567_890):
            self.assertEqual(contracts.cap_str(value), update_prices.cap_str(value))

    def test_필수_필드가_빠지거나_모순인_행은_사유와_함께_거른다(self):
        payload = _fixture_payload()
        items = payload['response']['body']['items']['item']
        broken = copy.deepcopy(items[:3])
        del broken[0]['clpr']                                   # 필수 누락
        broken[1]['hipr'] = '1'                                 # 고가 < 저가 모순
        broken[2]['trqu'] = 'abc'                               # 숫자 아님
        rows, rejected = fsc.normalize_items(broken + items[3:4])
        self.assertEqual(len(rows), 1)
        self.assertEqual([r['index'] for r in rejected], [0, 1, 2])
        self.assertIn('clpr', rejected[0]['reason'])
        self.assertIn('계약 위반', rejected[1]['reason'])
        self.assertIn('숫자', rejected[2]['reason'])

    def test_응답_껍데기_구조를_검증한다(self):
        with self.assertRaises(contracts.ContractError):
            fsc.parse_response({'response': {'header': {'resultCode': '30', 'resultMsg': 'SERVICE KEY IS NOT REGISTERED ERROR.'}}})
        raw, meta = fsc.parse_response({'response': {'header': {'resultCode': '00'}, 'body': {'items': '', 'totalCount': 0}}})
        self.assertEqual(raw, [])
        self.assertEqual(meta['totalCount'], 0)
        single = {'response': {'header': {'resultCode': '00'}, 'body': {'items': {'item': {'basDt': '20260910'}}, 'totalCount': 1}}}
        raw, _ = fsc.parse_response(single)
        self.assertEqual(len(raw), 1)                            # 1건이면 dict 로 오는 관례 방어
        report = fsc.structure_report([{'basDt': '20260910', 'clpr': '1'}])
        self.assertFalse(report['structureVerified'])
        self.assertIn('srtnCd', report['requiredMissing'])

    def test_열린_게이트에서_주입한_opener_로_받은_응답을_변환하고_키를_남기지_않는다(self):
        seen = {}

        def opener(url, timeout):
            seen['url'] = url
            return json.dumps(_fixture_payload()).encode('utf-8')
        key = 'SECRET-KEY-VALUE-1234567890+/=='
        rows, rejected, meta, structure = fsc.fetch_page(bas_dt='20260910', service_key=key,
                                                          gate=compliance.cleared_gate(fsc.PROVIDER_ID), opener=opener)
        self.assertIn('apis.data.go.kr', seen['url'])
        self.assertIn('serviceKey=', seen['url'])
        self.assertEqual(len(rows), 15)
        self.assertTrue(structure['structureVerified'])
        self.assertNotIn(key, json.dumps(meta))
        self.assertNotIn(key.replace('+', '%2B'), json.dumps(meta))
        self.assertIn(fsc.REDACTED, meta['requestPath'])
        prov = fsc.provenance_for(rows[0], meta['receivedAt'])
        self.assertEqual(prov['provider'], 'FSC_PUBLIC_DATA_PORTAL')
        self.assertFalse(prov['scoringProofAccepted'])
        self.assertEqual(prov['sourceSessionDateState'], 'PROVIDED')
        for field in contracts.PROVENANCE_FIELDS:
            self.assertIn(field, prov)

    def test_HTTP_오류는_상태코드만_남긴다(self):
        import urllib.error

        def opener(url, timeout):
            raise urllib.error.HTTPError(url, 401, 'Unauthorized', {}, None)
        with self.assertRaises(contracts.ContractError) as ctx:
            fsc.fetch_page(bas_dt='20260910', service_key='K', gate=compliance.cleared_gate(fsc.PROVIDER_ID), opener=opener)
        self.assertIn('HTTP 401', str(ctx.exception))
        self.assertNotIn('serviceKey', str(ctx.exception))


class ProviderComparison(unittest.TestCase):
    def test_공급자_값_대조는_불일치와_날짜_공백을_놓치지_않는다(self):
        rows, _, _ = fsc.fixture_rows()
        candidate = fsc.to_daily_series(rows)
        reference = copy.deepcopy(candidate)
        reference['999901'][1]['close'] += 50                    # 한 필드만 다르게
        del reference['999902'][0]                              # 참조 쪽에 날짜 하나 없음
        reference['999999'] = [dict(reference['999903'][0])]     # 참조에만 있는 종목
        out = shadow.compare_daily_series(reference, candidate)
        self.assertFalse(out['allMatched'])
        self.assertEqual(out['codesOnlyReference'], ['999999'])
        self.assertEqual(out['datesOnlyCandidate'], 1)
        self.assertEqual(out['fieldStats']['close']['mismatch'], 1)
        self.assertEqual(out['mismatches'][0]['code'], '999901')
        self.assertNotIn('10350', json.dumps(out))              # 원자료 값은 보고서에 싣지 않는다
        self.assertIn('adjustment', out['definitionNotes'])
        same = shadow.compare_daily_series(candidate, copy.deepcopy(candidate))
        self.assertTrue(same['allMatched'])


class DecisionShadowParity(unittest.TestCase):
    """그림자 비교가 Production 을 정확히 재현하는지 — 이것이 틀리면 시나리오 차이가 전부 거짓이다.

    ⚠️ 저장소의 data.js(10분)와 indicators.json(30분)은 서로 다른 회차일 수 있다(장중 checkout). 그래서 커밋된
       indicators.json 과 직접 비교하지 않고, **같은 입력으로 compute_indicators.main() 을 임시 폴더에서 실제로 돌려**
       그 산출물과 rebuild_indicators() 를 비교한다. 회차 타이밍과 무관하게 항상 검증된다.
    """

    @classmethod
    def setUpClass(cls):
        import compute_indicators as CI
        import price_provenance
        cls.inputs = shadow.load_inputs(HERE)
        cls.base = shadow.rebuild_indicators(cls.inputs['raw'], cls.inputs['live'], cls.inputs['sectors'])
        cls.tmp = tempfile.mkdtemp(prefix='gaeo-shadow-parity-')
        for name in ('analysis_data.json', 'data.js', 'tickers.js', 'price_provenance.json', 'index_history.js'):
            src = os.path.join(HERE, name)
            if os.path.exists(src):
                shutil.copy(src, os.path.join(cls.tmp, name))
        old_here = CI.HERE
        CI.HERE = cls.tmp
        try:
            with redirect_stdout(io.StringIO()):
                CI.main()
        finally:
            CI.HERE = old_here
        with open(os.path.join(cls.tmp, 'indicators.json'), encoding='utf-8') as handle:
            cls.prod = json.load(handle)
        # 커밋된 회차들이 서로 같은 입력인지(장외 checkout 이면 보통 같다). 다르면 auto_analysis 재현 비교는 건너뛴다.
        committed = cls.inputs['indicators'] or {}
        cls.same_round = (
            (committed.get('priceProvenance') or {}).get('snapshotId') == price_provenance.snapshot_id(cls.inputs['live']['stocks'])
            and committed.get('analysisDataFetchedAt') == cls.inputs['raw'].get('fetchedAt'))

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def test_rebuild_indicators_는_compute_indicators_main_과_같다(self):
        prod = self.prod
        self.assertEqual(self.base['marketRegime'], prod['marketRegime'])
        self.assertEqual(set(self.base['stocks']), set(prod['stocks']))
        keys = ('price', 'rate', 'per', 'pbr', 'roe', 'eps', 'tech', 'flow', 'risk', 'relative',
                'targetGap', 'fwdPer', 'cnsEps', 'targetMean', 'sector')
        for code, mine in self.base['stocks'].items():
            theirs = prod['stocks'][code]
            for key in keys:
                self.assertEqual(mine.get(key), theirs.get(key), (code, key))

    def test_evaluate_는_auto_analysis_js_의_판정을_재현한다(self):
        with open(os.path.join(HERE, 'auto_analysis.js'), encoding='utf-8') as handle:
            txt = re.sub(r'^\s*//.*$', '', handle.read(), flags=re.M)
        prod = json.loads(re.search(r'const\s+LIVE_AUTO\s*=\s*(\{.*\})\s*;', txt, re.S).group(1))
        committed = self.inputs['indicators'] or {}
        if not self.same_round or prod.get('priceSnapshotId') != (committed.get('priceProvenance') or {}).get('snapshotId') \
                or prod.get('priceLabel') != committed.get('priceLabel'):
            self.skipTest('data.js·indicators.json·auto_analysis.js 가 같은 회차가 아니다(장중 checkout) — 재현 비교 불가')
        got = shadow.evaluate(self.base, self.inputs['raw'], self.inputs['sectors'],
                              self.inputs['teamWeights'], self.inputs['model'])
        mismatch = [code for code, row in got.items()
                    if (prod['stocks'].get(code) or {}).get('chief', {}).get('call') != row['call']
                    or (prod['stocks'].get(code) or {}).get('chief', {}).get('total') != row['total']]
        self.assertEqual(mismatch, [], f'재현 실패 {len(mismatch)}종목')

    def test_시나리오는_입력을_오염시키지_않고_결정론적이다(self):
        before = json.dumps(self.base, sort_keys=True)
        raw_before = json.dumps(self.inputs['raw'], sort_keys=True)
        ind, q_raw = shadow.apply_scenario('official_free_only', self.base, self.inputs['raw'], self.inputs['live'], self.inputs['sectors'])
        self.assertEqual(json.dumps(self.base, sort_keys=True), before)
        self.assertEqual(json.dumps(self.inputs['raw'], sort_keys=True), raw_before)
        self.assertTrue(ind['droppedLastBar'])
        sample = next(iter(ind['stocks'].values()))
        self.assertIsNone(sample['flow'])
        self.assertIsNone(sample['targetMean'])
        ind2, _ = shadow.apply_scenario('official_free_only', self.base, self.inputs['raw'], self.inputs['live'], self.inputs['sectors'])
        self.assertEqual(json.dumps(ind, sort_keys=True), json.dumps(ind2, sort_keys=True))

    def test_lag1_은_마지막_봉을_빼고_가격을_직전_종가로_바꾼다(self):
        ind, _ = shadow.apply_scenario('lag1_official_close', self.base, self.inputs['raw'], self.inputs['live'], self.inputs['sectors'])
        code = next(c for c in ind['stocks'] if len(self.inputs['raw']['stocks'][c].get('daily') or []) >= 3)
        daily = self.inputs['raw']['stocks'][code]['daily']
        self.assertEqual(ind['stocks'][code]['price'], daily[-2]['close'])
        self.assertEqual(ind['stocks'][code]['tech']['lastBarDate'], daily[-2]['date'])
        self.assertEqual(self.base['stocks'][code]['tech']['lastBarDate'], daily[-1]['date'])

    def test_no_flow_는_FLOW_축을_소실시키고_판단은_보류되지_않는다(self):
        ind, q_raw = shadow.apply_scenario('no_flow', self.base, self.inputs['raw'], self.inputs['live'], self.inputs['sectors'])
        got = shadow.evaluate(ind, q_raw, self.inputs['sectors'], self.inputs['teamWeights'], self.inputs['model'])
        self.assertTrue(got)
        self.assertTrue(all(row['flow'] is None for row in got.values()))
        self.assertTrue(all(not row['withheld'] for row in got.values()))

    def test_보고서는_집계만_담고_파일을_쓰지_않는다(self):
        before = {f: os.path.getmtime(os.path.join(HERE, f)) for f in ('data.js', 'analysis_data.json', 'indicators.json', 'auto_analysis.js')}
        with redirect_stdout(io.StringIO()):
            report = shadow.run_decision_shadow(HERE, ['no_consensus'], inputs=self.inputs)
        for f, mtime in before.items():
            self.assertEqual(os.path.getmtime(os.path.join(HERE, f)), mtime, f'{f} 가 바뀌었다')
        s = report['scenarios']['no_consensus']
        self.assertEqual(s['codesCompared'], report['baseline']['evaluated'])
        self.assertEqual(sum(s['callTransitions'].values()), s['callChanged'])
        self.assertEqual(report['production']['networkCalls'], 0)
        for ex in s['examples']:
            self.assertEqual(set(ex), {'code', 'from', 'to', 'totalBefore', 'totalAfter'})
        md = shadow.render_markdown(report)
        self.assertIn('no_consensus', md)


class ScannerIntegration(unittest.TestCase):
    def test_준법_검사기가_새_어댑터를_통과시킨다(self):
        import legal_source_gate as gate
        self.assertEqual([str(f) for f in gate.run_all(HERE)], [])

    def test_새_검사는_묶음에_들어_있고_사이트는_어댑터_폴더를_내보내지_않는다(self):
        import gaeo_check
        self.assertIn('test_data_supply_migration.py', gaeo_check.GROUPS['pipeline'])
        with open(os.path.join(HERE, '_config.yml'), encoding='utf-8') as handle:
            config = handle.read()
        self.assertIn('- data_supply/', config)


if __name__ == '__main__':
    unittest.main()
