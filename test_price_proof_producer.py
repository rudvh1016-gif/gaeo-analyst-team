#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공식 결과가격 증명 생산자·planner 계약 — 증거가 없으면 한 건도 통과시키지 않는다.

이 검사가 지키는 한 줄: **판단 하나가 「당시 가격 근거 → 공식 결과가격 → 기업행사 확인 → 공정한 비교 →
기존 채점 → 결과 보존」까지 실제로 갈 수 있고, 어느 한 조각이라도 빠지면 그 자리에서 닫힌다.**

전부 합성 자료다. KRX 호출은 `krx_openapi_client.http_get` 을 바꿔 끼워 흉내낸다(네트워크 0).
채점 공식(compute_team_weights.score_call)·검사 조건(comparison_evidence)은 그대로 쓴다 — 여기서
새로 만들지 않는다.
"""
import contextlib
import copy
import glob
import gzip
import hashlib
import io
import json
import os
import re
import tempfile
import unittest
from unittest.mock import patch

import collect_price_proof as producer
import comparison_evidence as ce
import decision_records as dr
import krx_openapi_client as krx
import source_compliance as compliance
import price_proof_planner as planner
import price_provenance as pp
from test_comparison_evidence import add_event, event, sources
from test_price_provenance import auto_payload, kst_minute, run_collector, summary, workspace

HERE = os.path.dirname(os.path.abspath(__file__))
STK, KSQ = 'krx-openapi:sto/stk_bydd_trd', 'krx-openapi:sto/ksq_bydd_trd'
CODE = '005930'
#: 판단일 2026-09-07(월) 16:05 KST 관측 → 5번째 거래일 2026-09-14(월)
CLOCK = '2026-09-07T07:05:00+00:00'
DAYS = ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-14']
#: 종가는 71,000 → 72,420 (+2.0%). 전일대비는 전부 전일 종가 기준으로 맞는다(연속성 통과).
CLOSES = [71000, 71500, 71200, 72000, 71800, 72420]
CHANGES = [500, 500, -300, 800, -200, 620]
NOW = '2026-09-15T09:00:00+00:00'      # 결과일 다음 날 18:00 KST
KEY = 'test-auth-key-not-a-real-secret-0000'


def fmt(n):
    return format(n, ',')


def krx_row(code, bas_dd, close, change, volume=1_000_000, name='표본', market='KOSPI'):
    return {'BAS_DD': bas_dd, 'ISU_CD': code, 'ISU_NM': name, 'MKT_NM': market, 'SECT_TP_NM': '-',
            'TDD_CLSPRC': fmt(close), 'CMPPREVDD_PRC': fmt(change), 'FLUC_RT': '0.70',
            'TDD_OPNPRC': fmt(close - 100), 'TDD_HGPRC': fmt(close + 200), 'TDD_LWPRC': fmt(close - 300),
            'ACC_TRDVOL': fmt(volume), 'ACC_TRDVAL': fmt(volume * close), 'MKTCAP': fmt(close * 5_969_782_550),
            'LIST_SHRS': '5,969,782,550'}


def official_responses(closes=CLOSES, changes=CHANGES, volumes=None, drop=(), extra_stk=(), extra_ksq=()):
    """{(경로, basDd): body}. 유가증권에 005930·000660, 코스닥에 035720 이 있다."""
    out = {}
    for i, day in enumerate(DAYS):
        bas = day.replace('-', '')
        vol = (volumes or {}).get(day, 1_000_000)
        stk = [krx_row('000660', bas, 180000 + i * 100, 100, name='표본B')]
        if day not in drop:
            stk.append(krx_row(CODE, bas, closes[i], changes[i], volume=vol, name='표본A'))
        stk.extend(extra_stk)
        out[('sto/stk_bydd_trd', bas)] = {'OutBlock_1': stk}
        out[('sto/ksq_bydd_trd', bas)] = {'OutBlock_1': [krx_row('035720', bas, 40000 + i * 10, 10,
                                                                     name='표본C', market='KOSDAQ')] + list(extra_ksq)}
    return out


class FakeKrx:
    """krx_openapi_client.http_get 대역. 요청 주소를 해석해 저장된 응답을 돌려주고 모든 요청을 기록한다."""
    def __init__(self, responses, status=200, override=None):
        self.responses, self.status, self.override = responses, status, override
        self.calls = []

    def __call__(self, url, headers, timeout=60):
        self.calls.append({'url': url, 'headers': dict(headers)})
        if self.override:
            return self.override(url, headers)
        m = re.match(r'https://data-dbg\.krx\.co\.kr/svc/(apis|sample/apis)/(sto/\w+)\.json\?basDd=(\d{8})$', url)
        assert m, url
        body = self.responses.get((m.group(2), m.group(3)))
        if body is None:
            return 200, json.dumps({'OutBlock_1': []}).encode('utf-8')
        return self.status, json.dumps(body, ensure_ascii=False).encode('utf-8')


class Fixture(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = self.tmp.name
        # ⚖️ 2026-09-16 LEGAL GATE — 운영 기본값은 닫힘이다. 이 픽스처는 생산자 기계장치를 검사하므로
        #    시험용 게이트를 **명시적으로** 열어 둔다. 닫힘 기본값 자체는 LegalGateFailClosed 가 검사한다.
        gate_patch = patch.object(producer, 'legal_gate', lambda: compliance.cleared_gate('krx_openapi'))
        gate_patch.start()
        self.addCleanup(gate_patch.stop)
        self.root = os.path.join(self.repo, 'research_archive', 'decisions')
        os.makedirs(os.path.join(self.repo, 'gaeo_coverage'))
        with open(os.path.join(self.repo, 'price_history.js'), 'w', encoding='utf-8') as fh:
            fh.write('const PRICE_HISTORY = {};')

    def seal(self, clock=CLOCK, base=71000, call='BUY', at=None, with_provenance=True, code=CODE):
        """출처가 붙은 판단 하나를 봉인한다(PHASE 3 경로 그대로)."""
        workspace(self.repo, [code])
        doc = run_collector(self.repo, {code: summary(base)}, clock=clock)
        payload = auto_payload(doc if with_provenance else None, {code: base}, at=at or kst_minute(clock))
        payload['stocks'][code]['chief']['call'] = call
        rows = dr.capture(payload, self.root, provenance_dir=self.repo)
        return {r['code']: r for r in rows}[code]

    def bundles(self, dart=None, kind=None, code=CODE):
        src = sources()
        for name, data in zip(('corporate_action_evidence', 'kind_market_action_evidence'), src):
            data['ticker'] = code
            with open(os.path.join(self.repo, 'gaeo_coverage', name + '.json'), 'w', encoding='utf-8') as fh:
                json.dump({'evidence': {code: data}}, fh)
        return src

    def produce(self, responses=None, now=NOW, key=KEY, **kw):
        fake = FakeKrx(responses if responses is not None else official_responses())
        with patch.object(krx, 'http_get', fake):
            status, planned = producer.produce(self.root, self.repo, now, key, **kw)
        return status, planned, fake

    def proofs(self):
        return sorted(glob.glob(os.path.join(self.root, 'price_proofs', '*.json')))

    def refresh(self, now=NOW):
        with contextlib.redirect_stdout(io.StringIO()):
            return dr.refresh(self.root, self.repo, now)


class FullChain(Fixture):
    """§11 — 실제 판단 → provenance → 결과일 → 공식 proof → 기업행사 → comparable → evaluate → score_call → outcome → 되읽기."""

    def test_정상_전체_사슬_한_건이_처음부터_끝까지_간다(self):
        record = self.seal()
        self.assertTrue(record['priceProvenance']['linked'])
        originals = {p: open(p, 'rb').read() for p in glob.glob(os.path.join(self.root, 'originals', '**', '*'), recursive=True)
                     if os.path.isfile(p)}
        self.bundles()
        # 1) 아직 증명이 없다 → refresh 는 채점하지 않는다(가격 근거 부족)
        first = self.refresh()
        self.assertEqual(first['horizons']['5']['evaluated'], 0)
        self.assertEqual(first['comparison']['states']['comparable'], 0)
        # 2) planner 가 이 판단을 READY 로 고른다
        planned, _ = producer.make_plan(self.root, self.repo, NOW)
        self.assertEqual(planned['counts'][planner.READY_FOR_PRICE_PROOF], 1)
        # 3) 생산자가 공식 원문을 받아 증명을 만든다(날짜 6개 × 2 데이터셋 = 12요청)
        status, _, fake = self.produce()
        self.assertEqual(status['run']['produced'], 1, status)
        self.assertEqual(status['run']['requestsUsed'], 12)
        self.assertEqual(len(self.proofs()), 1)
        self.assertEqual(len(glob.glob(os.path.join(self.root, 'price_sources', '*.json.gz'))), 12)
        for call in fake.calls:            # 키는 헤더에만, 주소에는 없다
            self.assertEqual(call['headers']['AUTH_KEY'], KEY)
            self.assertNotIn(KEY, call['url'])
        proof = json.load(open(self.proofs()[0], encoding='utf-8'))
        self.assertEqual(proof['source'], 'KRX')
        self.assertEqual(proof['basis'], 'unadjusted')
        self.assertEqual([p['close'] for p in proof['prices']], CLOSES)
        self.assertTrue(all(p['final'] for p in proof['prices']))
        # 4) 비교검사(기업행사 포함)가 comparable 을 내고 기존 evaluate/score_call 이 채점한다
        planned, _ = producer.make_plan(self.root, self.repo, NOW)
        self.assertEqual(planned['counts'][planner.PROOF_SAVED_AWAITING_GRADING], 1)
        final = self.refresh()
        self.assertEqual(final['horizons']['5']['evaluated'], 1)
        self.assertEqual(final['comparison']['states']['comparable'], 1)
        outcome = dr.load_outcomes(self.root)[record['recordId']]
        self.assertEqual(outcome['status'], 'evaluated')
        self.assertAlmostEqual(outcome['ret'], 2.0)
        self.assertEqual(outcome['verdict'], 'hit')          # BUY +2.0% → compute_team_weights.score_call
        self.assertEqual((outcome['comparisonBase'], outcome['outcomeClose']), (71000, 72420))
        self.assertEqual(outcome['priceProofId'], dr._hash(proof))
        # 5) 되읽기: 디스크에서 다시 읽어도 같고, 다시 돌려도 같으며, 원본은 한 바이트도 안 바뀐다
        reread = dr.load_outcomes(self.root)[record['recordId']]
        self.assertEqual(reread, outcome)
        self.assertEqual(final, self.refresh())
        self.assertEqual(originals, {p: open(p, 'rb').read() for p in originals})
        planned, _ = producer.make_plan(self.root, self.repo, NOW)
        self.assertEqual(planned['counts'][planner.ALREADY_EVALUATED], 1)
        # 6) 통합 점검도 저장 연결을 검증한다
        import ops_status
        with open(os.path.join(self.repo, 'model_scoreboard.js'), 'w', encoding='utf-8') as fh:
            fh.write('const MODEL_SCOREBOARD = ' + json.dumps({'decisionTrace': final}) + ';')
        self.assertEqual(ops_status.check_decisions(self.repo, dr._moment(NOW))['code'], 'DECISIONS_VERIFIED')

    def test_같은_판단에_두_번째_증명을_만들지_않고_원문은_재사용한다(self):
        self.seal(); self.bundles()
        first, _, fake1 = self.produce()
        second, _, fake2 = self.produce()
        self.assertEqual((first['run']['produced'], second['run']['produced']), (1, 0))
        self.assertEqual(second['plan']['counts'][planner.PROOF_SAVED_AWAITING_GRADING], 1)
        self.assertEqual(len(fake2.calls), 0)
        self.assertEqual(len(self.proofs()), 1)
        # 다른 판단(다른 날)이 같은 날짜를 필요로 하면 원문을 다시 받지 않는다
        self.assertEqual(len(ce.load_price_proofs(self.root)), 1)


class MaturityAndProvenance(Fixture):
    def test_결과일_전이면_WAITING_MATURITY이고_아무것도_받지_않는다(self):
        self.seal(); self.bundles()
        early = '2026-09-11T09:00:00+00:00'           # 결과일(09-14) 전
        status, planned, fake = self.produce(now=early)
        self.assertEqual(planned['counts'][planner.WAITING_MATURITY], 1)
        self.assertEqual((status['run']['attempted'], len(fake.calls), len(self.proofs())), (0, 0, 0))
        # 결과일 당일(종가 미확정)도 아직이다 — 5D 를 줄이지 않는다
        same_day = '2026-09-14T09:30:00+00:00'
        status, planned, fake = self.produce(now=same_day)
        self.assertEqual(planned['counts'][planner.WAITING_MATURITY], 1)
        self.assertEqual(len(fake.calls), 0)

    def test_출처가_없는_판단은_MISSING_PROVENANCE로_남고_현재_자료로_채우지_않는다(self):
        self.seal(with_provenance=False); self.bundles()
        status, planned, fake = self.produce()
        self.assertEqual(planned['counts'][planner.MISSING_PROVENANCE], 1)
        self.assertEqual((len(fake.calls), len(self.proofs())), (0, 0))
        self.assertEqual(self.refresh()['horizons']['5']['evaluated'], 0)

    def test_실제_저장소의_과거_7200건은_전부_MISSING_PROVENANCE이고_한_바이트도_바뀌지_않는다(self):
        real_root = os.path.join(HERE, 'research_archive', 'decisions')
        def fingerprint():
            return {p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
                    for p in sorted(glob.glob(os.path.join(real_root, 'originals', '**', '*'), recursive=True))
                    if os.path.isfile(p)}
        before = fingerprint()
        self.assertTrue(before)
        planned, _ = producer.make_plan(real_root, HERE, NOW)
        old = [r for r in planned['rows'] if r['date'] <= '2026-09-15']
        self.assertTrue(old)
        self.assertTrue(all(r['state'] == planner.MISSING_PROVENANCE for r in old))
        with patch.object(krx, 'http_get', FakeKrx({})) as fake:
            status, _ = producer.produce(real_root, HERE, NOW, KEY)
        self.assertEqual((status['run']['attempted'], len(fake.calls)), (0, 0))
        self.assertFalse(os.path.exists(os.path.join(real_root, 'price_sources')))
        self.assertEqual(fingerprint(), before)


class OfficialDataGuards(Fixture):
    def _ready(self, **seal):
        record = self.seal(**seal); self.bundles()
        return record

    def blocked_reason(self, status):
        self.assertEqual(status['run']['produced'], 0, status)
        self.assertEqual(len(status['blockedRecords']), 1, status)
        return status['blockedRecords'][0]['reason']

    def test_거래일_가격이_하루_빠지면_증명하지_않는다(self):
        self._ready()
        status, _, _ = self.produce(official_responses(drop=('2026-09-10',)))
        self.assertEqual(self.blocked_reason(status), 'official_row_missing:2026-09-10')
        self.assertEqual(self.proofs(), [])

    def test_그_날_응답_자체가_없으면_0건_응답을_가격으로_읽지_않는다(self):
        self._ready()
        responses = official_responses(); responses.pop(('sto/stk_bydd_trd', '20260910')); responses.pop(('sto/ksq_bydd_trd', '20260910'))
        status, _, _ = self.produce(responses)
        self.assertEqual(self.blocked_reason(status), 'official_response_missing:2026-09-10')
        self.assertEqual({f['status'] for f in status['run']['fetchFailures']}, {krx.RESPONSE_EMPTY})
        self.assertEqual(self.proofs(), [])

    def test_결과_종가가_확정되기_전의_응답은_쓰지_않는다(self):
        self._ready()
        # 결과일 당일 밤(KST 09-14 23:00)에 받은 응답은 그 날 종가를 확정으로 보지 않는다
        status, planned, _ = self.produce(now='2026-09-14T14:00:00+00:00')
        self.assertEqual(planned['counts'][planner.WAITING_MATURITY], 1)
        self.assertEqual(status['run']['attempted'], 0)
        # 원문이 결과일 당일에 받아진 것으로 남아 있으면(관측시각 ≤ 가격일) 증명에 쓰지 않는다
        sources = {}
        with patch.object(krx, 'http_get', FakeKrx(official_responses())):
            for day in DAYS:
                for ds in (STK, KSQ):
                    rec = krx.fetch_daily(ds, day.replace('-', ''), KEY, observed_at=day + 'T08:00:00+00:00')
                    sources[(ds, day.replace('-', ''))] = rec
        record = dr.read_records(self.root)[0]
        proof, reason = producer.build_proof(record, sources, NOW)
        self.assertIsNone(proof); self.assertEqual(reason, 'close_not_final:2026-09-07')

    def test_거래정지_날이_있으면_증거는_남되_채점되지_않는다(self):
        record = self._ready()
        status, _, _ = self.produce(official_responses(volumes={'2026-09-10': 0}))
        self.assertEqual(status['run']['produced'], 1)
        self.assertEqual(status['producedProofs'][0]['comparisonReason'], 'trading_halt')
        final = self.refresh()
        self.assertEqual(final['horizons']['5']['evaluated'], 0)
        self.assertEqual(dr.load_outcomes(self.root)[record['recordId']]['reason'], 'trading_halt')

    def test_창_안에서_기준가격이_바뀐_흔적이면_증명하지_않는다(self):
        """액면분할 같은 행사가 있으면 KRX 전일대비는 조정된 기준가격 기준이라 전일 종가와 맞지 않는다."""
        self._ready()
        closes = [71000, 71500, 35600, 36000, 35800, 36210]      # 09-09 에 1/2 분할
        changes = [500, 500, -150, 400, -200, 410]               # -150 은 기준가 35,750 대비
        status, _, _ = self.produce(official_responses(closes, changes))
        self.assertEqual(self.blocked_reason(status), 'price_basis_continuity_broken:2026-09-09')
        self.assertEqual(self.proofs(), [])

    def test_장중_관측_가격은_일별_공식_자료로_증명하지_않는다(self):
        self._ready(clock='2026-09-07T04:00:00+00:00')          # 13:00 KST
        status, _, _ = self.produce()
        self.assertEqual(self.blocked_reason(status), 'original_price_intraday_not_in_daily_dataset')

    def test_장_마감_뒤라도_판단_가격이_공식_종가와_다르면_대응_근거를_만들지_않는다(self):
        self._ready(base=71050)
        status, _, _ = self.produce()
        self.assertEqual(self.blocked_reason(status), 'original_price_not_equal_official_close')

    def test_잘못된_ticker나_두_시장에_같이_있는_종목은_증명하지_않는다(self):
        self._ready()
        # 코스닥 응답에도 같은 코드가 있으면 어느 자료인지 정하지 않는다
        dup = [krx_row(CODE, '20260908', 71500, 500, name='표본A', market='KOSDAQ')]
        responses = official_responses(); responses[('sto/ksq_bydd_trd', '20260908')]['OutBlock_1'] += dup
        status, _, _ = self.produce(responses)
        self.assertEqual(self.blocked_reason(status), 'ticker_in_multiple_datasets:2026-09-08')
        # 표준코드(ISIN)로 온 행은 그 안의 6자리로만 잇는다 — 다른 종목의 ISIN 은 잇지 않는다
        self.assertIsNone(krx.matches_ticker('KR7000660001', CODE))
        self.assertEqual(krx.matches_ticker('KR7005930003', CODE), 'ISU_CD_ISIN')

    def test_구조가_계약과_다른_응답은_보존하지_않는다(self):
        self._ready()
        responses = official_responses()
        for row in responses[('sto/stk_bydd_trd', '20260909')]['OutBlock_1']:
            row.pop('ACC_TRDVOL')
        status, _, _ = self.produce(responses)
        self.assertEqual(self.blocked_reason(status), 'official_response_missing:2026-09-09')
        failures = status['run']['fetchFailures']
        self.assertEqual(len(failures), 1)
        self.assertEqual(failures[0]['status'], krx.RESPONSE_SHAPE_UNEXPECTED)
        names = os.listdir(os.path.join(self.root, 'price_sources'))
        self.assertFalse([n for n in names if n.startswith('sto-stk_bydd_trd_20260909')])

    def test_공식_응답_원문이_바뀌면_hash가_어긋나_읽지_않는다(self):
        self._ready()
        self.produce()
        path = sorted(glob.glob(os.path.join(self.root, 'price_sources', '*.json.gz')))[0]
        record = json.loads(gzip.decompress(open(path, 'rb').read()))
        record['body']['OutBlock_1'][0]['TDD_CLSPRC'] = '1'
        open(path, 'wb').write(gzip.compress(json.dumps(record).encode('utf-8')))
        with self.assertRaises(krx.ContractError):
            krx.load_sources(self.root)


class ProofBindingGuards(Fixture):
    """증명 문서 자체를 손보거나 다른 판단의 것을 끼워 넣으면 검사가 닫힌다."""
    def setUp(self):
        super().setUp()
        self.record = self.seal(); self.src = self.bundles()
        self.produce()
        self.proof = json.load(open(self.proofs()[0], encoding='utf-8'))
        self.assertEqual(self.assess(self.proof)['state'], 'comparable')

    def assess(self, proof, record=None, src=None):
        return ce.assess(record or self.record, *(src or self.src), now=NOW, price_proof=proof)

    def test_다른_recordId나_다른_판단의_증명은_쓰이지_않는다(self):
        other = dict(self.record, recordId='f' * 32)            # 같은 종목·같은 날의 다른 판단
        self.assertEqual(self.assess(self.proof, record=other)['reason'], 'price_evidence_invalid')
        later = dict(self.record, decisionAt='2026-09-07 16:20')  # 같은 recordId 를 주장해도 원본이 다르면 막힌다
        self.assertEqual(self.assess(self.proof, record=later)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['recordId'] = 'f' * 32
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')

    def test_원본_hash가_다르면_증명이_붙지_않는다(self):
        tampered = dict(self.record, total=99)
        self.assertEqual(self.assess(self.proof, record=tampered)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['originalRecordHash'] = 'a' * 64
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')

    def test_공식_응답_hash와_어긋난_문서는_증명이_아니다(self):
        p = copy.deepcopy(self.proof); p['document']['prices'][5]['close'] = 99999; p['prices'][5]['close'] = 99999
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['prices'][5]['close'] = 99999      # 문서와 배열이 다르다
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')

    def test_잘못된_ticker(self):
        p = copy.deepcopy(self.proof); p['ticker'] = '000660'
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')

    def test_수정주가_근거가_없거나_기준이_어긋나면_증명이_아니다(self):
        p = copy.deepcopy(self.proof); p.pop('basisEvidence')
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['basis'] = 'adjusted'            # 선언은 unadjusted 인데 adjusted 라고 주장
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['originalPriceEvidence']['basis'] = 'adjusted'
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')
        p = copy.deepcopy(self.proof); p['adjustment'] = {'multiplier': 1}   # 근거 없는 조정계수
        self.assertEqual(self.assess(p)['reason'], 'price_evidence_invalid')

    def test_공식_자료가_아니면_구조가_완벽해도_comparable이_아니다(self):
        for ref in ('https://api.finance.naver.com/service/itemSummary.naver?itemcode=005930',
                    'http://data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd.json',
                    'https://data-dbg.krx.co.kr.evil.test/svc/apis/sto/stk_bydd_trd.json'):
            p = copy.deepcopy(self.proof); p['sourceRef'] = ref
            self.assertNotEqual(self.assess(p)['state'], 'comparable', ref)
        # 출처 기록(네이버)을 증명이라고 내밀어도 통과하지 않는다
        fake = dict(self.record['priceProvenance'], source='KRX', observedAt=NOW)
        self.assertNotEqual(self.assess(fake)['state'], 'comparable')

    def test_기업행사가_있으면_비수정_증명으로는_풀리지_않는다(self):
        src = sources(); add_event(src, event('주식분할결정'))
        verdict = self.assess(self.proof, src=src)
        self.assertEqual((verdict['state'], verdict['reason']), ('adjustment_required', 'corporate_action_adjustment_required'))
        self.assertEqual(dr.evaluate(self.record, {}, '2026-09-15', comparison=verdict)['status'], 'blocked')

    def test_기업행사_근거가_UNKNOWN이면_증명이_있어도_채점되지_않는다(self):
        for bad in (({'ok': False}, {}), ({'expiresAt': '2026-09-14T00:00:00+00:00'}, {}), ({}, {'queriedAt': '2026-09-13T01:00:00+00:00'})):
            src = sources(); src[0].update(bad[0]); src[1].update(bad[1])
            verdict = self.assess(self.proof, src=src)
            self.assertEqual((verdict['state'], verdict['reason']), ('unknown', 'corporate_action_unverified'))
        verdict = ce.assess(self.record, None, None, now=NOW, price_proof=self.proof)
        self.assertEqual(verdict['state'], 'unknown')
        planned = planner.plan([self.record], {}, {self.record['recordId']: self.proof}, {}, {}, NOW)
        self.assertEqual(planned['counts'][planner.BLOCKED_CORPORATE_EVIDENCE], 1)

    def test_이미_평가된_결과는_덮어쓰지_않는다(self):
        self.refresh()
        outcome = dr.load_outcomes(self.root)[self.record['recordId']]
        self.assertEqual(outcome['status'], 'evaluated')
        with self.assertRaises(dr.IntegrityError):
            dr.save_outcomes([dict(outcome, ret=-20.0, verdict='miss')], self.root)
        self.assertEqual(dr.load_outcomes(self.root)[self.record['recordId']], outcome)
        status, planned, fake = self.produce()
        self.assertEqual(planned['counts'][planner.ALREADY_EVALUATED], 1)
        self.assertEqual((status['run']['attempted'], len(fake.calls)), (0, 0))


class ProducerBlockers(Fixture):
    def test_인증키가_없으면_OWNER_ACTION만_남기고_아무것도_받지_않는다(self):
        self.seal(); self.bundles()
        status, planned, fake = self.produce(key=None)
        self.assertEqual(planned['counts'][planner.READY_FOR_PRICE_PROOF], 1)
        self.assertEqual(len(fake.calls), 0)
        self.assertEqual(status['run']['blocked'], {'auth_key_missing': 1})
        self.assertEqual([a['code'] for a in status['ownerActionRequired']], ['KRX_OPENAPI_AUTH_KEY_MISSING'])
        self.assertEqual(status['blockedRecords'][0]['state'], planner.BLOCKED_PRICE_SOURCE)
        out = io.StringIO()
        with patch.dict(os.environ, {krx.KEY_ENV: ''}), contextlib.redirect_stdout(out):
            code = producer.main(['--repo', self.repo, '--now', NOW])
        self.assertEqual(code, 2)
        self.assertIn('OWNER_ACTION_REQUIRED', out.getvalue())
        saved = json.load(open(os.path.join(self.repo, producer.STATUS_FILE), encoding='utf-8'))
        self.assertEqual(saved['auth']['present'], False)

    def test_서비스_미승인_401이면_멈추고_OWNER_ACTION을_남긴다(self):
        self.seal(); self.bundles()
        fake = FakeKrx({}, override=lambda url, headers: (200, b'{"respCode":"401","respMsg":"Unauthorized"}'))
        with patch.object(krx, 'http_get', fake):
            status, _ = producer.produce(self.root, self.repo, NOW, KEY)
        self.assertEqual(len(fake.calls), 1)                         # 첫 거부에서 멈춘다
        self.assertEqual([a['code'] for a in status['ownerActionRequired']], ['KRX_OPENAPI_SERVICE_REJECTED'])
        self.assertEqual(status['run']['produced'], 0)

    def test_한도_초과_429면_멈춘다(self):
        self.seal(); self.bundles()
        fake = FakeKrx({}, override=lambda url, headers: (429, b''))
        with patch.object(krx, 'http_get', fake):
            status, _ = producer.produce(self.root, self.repo, NOW, KEY)
        self.assertEqual(len(fake.calls), 1)
        self.assertEqual(status['run']['fetchFailures'][0]['status'], krx.RATE_LIMITED)

    def test_표본_키는_실제_서비스에_보내지_않고_표본은_증명에_쓰지_않는다(self):
        fake = FakeKrx(official_responses())
        with patch.object(krx, 'http_get', fake):
            rec = krx.fetch_daily(STK, '20260907', krx.SAMPLE_PUBLIC_KEY)
        self.assertEqual((rec['status'], len(fake.calls)), (krx.FORBIDDEN, 0))
        with patch.object(krx, 'http_get', fake):
            sample = krx.fetch_daily(STK, '20260907', None, sample=True)
        self.assertTrue(sample['structureVerified'])
        with self.assertRaises(krx.ContractError):
            krx.save_source(sample, self.root)

    def test_인증키가_로그와_산출물에_남지_않는다(self):
        self.seal(); self.bundles()
        fake = FakeKrx({}, override=lambda url, headers: (_ for _ in ()).throw(OSError('boom ' + KEY)))
        with patch.object(krx, 'http_get', fake):
            status, _ = producer.produce(self.root, self.repo, NOW, KEY)
        blob = json.dumps(status)
        self.assertNotIn(KEY, blob)
        self.assertIn('***REDACTED***', status['run']['fetchFailures'][0]['error'])
        status2, _, _ = self.produce()
        for path in self.proofs() + glob.glob(os.path.join(self.root, 'price_sources', '*.json.gz')):
            data = open(path, 'rb').read()
            data = gzip.decompress(data) if path.endswith('.gz') else data
            self.assertNotIn(KEY.encode('utf-8'), data)

    def test_판단_수_상한을_넘는_것은_미처리로_따로_센다(self):
        self.seal(); self.bundles()
        status, _, fake = self.produce(record_cap=0)
        self.assertEqual((status['run']['attempted'], status['run']['notProcessed'], len(fake.calls)), (0, 1, 0))


class ReadinessAndOps(Fixture):
    def test_성적표는_생산자_상태를_읽되_A에서_E로_억지로_옮기지_않는다(self):
        import real_outcome_scorecard as card
        from test_real_outcome_scorecard import _board, _short_block, CURRENT
        with open(os.path.join(self.repo, 'model_scoreboard.js'), 'w', encoding='utf-8') as fh:
            fh.write('const MODEL_SCOREBOARD = %s;\n' % json.dumps(_board({CURRENT: _short_block()}, reasons={'future_session': 3})))
        os.makedirs(os.path.join(self.repo, 'config'), exist_ok=True)
        rd = card.build(self.repo)['readiness']
        self.assertEqual(rd['priceProofProducer']['status'], 'NOT_RUN')
        status = {'schemaVersion': producer.STATUS_SCHEMA, 'generatedAt': NOW, 'auth': {'present': False},
                  'ownerActionRequired': [producer.OWNER_ACTION_AUTH],
                  'plan': {'counts': {planner.READY_FOR_PRICE_PROOF: 2, planner.MISSING_PROVENANCE: 1800,
                                      planner.WAITING_MATURITY: 3}},
                  'run': {'produced': 0, 'blocked': {'auth_key_missing': 2}}}
        producer.write_status(status, self.repo)
        rd = card.build(self.repo)['readiness']
        self.assertEqual(rd['counts']['A_WAITING_RESULT'], 3)
        self.assertEqual(rd['counts']['D_READY_TO_GRADE'], 0)
        self.assertEqual(rd['priceProofProducer']['status'], 'BLOCKED_PRICE_SOURCE')
        self.assertEqual(rd['priceProofProducer']['ownerActionRequired'], ['KRX_OPENAPI_AUTH_KEY_MISSING'])
        self.assertEqual(rd['priceProofProducer']['planCounts'][planner.READY_FOR_PRICE_PROOF], 2)
        # assess 가 내는 사유 두 개가 성적표 B/C 칸에 들어간다(분류되지 않은 사유로 남지 않는다)
        self.assertIn('corporate_action_adjustment_required', card.READINESS_REASONS['C_CORPORATE_ACTION_MISSING'])
        self.assertIn('price_evidence_conflict', card.READINESS_REASONS['B_PRICE_EVIDENCE_MISSING'])

    def test_통합_점검이_가격증명_상태를_같이_말한다(self):
        import ops_status
        for name, data in zip(('corporate_action_evidence', 'kind_market_action_evidence'), sources()):
            with open(os.path.join(self.repo, 'gaeo_coverage', name + '.json'), 'w', encoding='utf-8') as fh:
                json.dump({'evidence': {CODE: data}}, fh)
        now = dr._moment(NOW)
        before = ops_status.check_comparison_evidence(self.repo, now)
        self.assertEqual(before['priceProof']['status'], 'NOT_RUN')
        producer.write_status({'schemaVersion': producer.STATUS_SCHEMA, 'generatedAt': NOW,
                               'ownerActionRequired': [producer.OWNER_ACTION_AUTH],
                               'plan': {'counts': {planner.READY_FOR_PRICE_PROOF: 5}},
                               'run': {'produced': 0, 'blocked': {'auth_key_missing': 5}}}, self.repo)
        after = ops_status.check_comparison_evidence(self.repo, now)
        self.assertEqual(after['status'], before['status'])          # 판정은 바꾸지 않는다
        self.assertIn('KRX_OPENAPI_AUTH_KEY_MISSING', after['detail'])
        self.assertEqual(after['priceProof']['blocked'], {'auth_key_missing': 5})


class WorkflowAndWiring(unittest.TestCase):
    def test_워크플로는_수동_dispatch만이고_허용_경로만_커밋한다(self):
        body = open(os.path.join(HERE, '.github', 'workflows', 'price-proof.yml'), encoding='utf-8').read()
        self.assertIn('workflow_dispatch:', body)
        self.assertNotRegex(body, r'^\s{2}(push|schedule):', '수집 워크플로에 push/schedule 트리거를 두지 않는다')
        self.assertIn('secrets.KRX_OPENAPI_AUTH_KEY', body)
        self.assertIn('test_price_proof_producer', body)
        self.assertIn('collect_price_proof.py --smoke', body)
        self.assertIn('research_archive/decisions/price_proofs', body)
        self.assertIn('research_archive/decisions/price_sources', body)
        self.assertIn('gaeo_coverage/price_proof_status.json', body)
        self.assertNotRegex(body, r'echo.*\$KRX_OPENAPI_AUTH_KEY', '키 값을 출력하지 않는다')

    def test_러너_병합은_원문_폴더도_불변으로_본다(self):
        src = open(os.path.join(HERE, 'decision_records.py'), encoding='utf-8').read()
        self.assertRegex(src, r"immutable=lambda path:.*'price_sources'")

    def test_공식_호스트_목록에_KRX_Open_API_호스트가_있고_http나_다른_호스트는_거부된다(self):
        self.assertTrue(ce._official('https://data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd.json'))
        self.assertFalse(ce._official('http://data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd.json'))
        self.assertFalse(ce._official('https://data-dbg.krx.co.kr/'))
        self.assertFalse(ce._official('https://user@data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd.json'))


if __name__ == '__main__':
    unittest.main()


class DueTargets(Fixture):
    """채점 후보 목록(2026-09-16) — 기업행사 수집기가 '지금 채점 후보'만 갱신할 수 있게 planner 가 종목을 고른다."""

    def test_결과일이_지나고_출처가_있는_판단만_후보다(self):
        self.seal(); self.bundles()
        planned, _ = producer.make_plan(self.root, self.repo, NOW)
        self.assertEqual(planned['counts'][planner.READY_FOR_PRICE_PROOF], 1)
        self.assertEqual(planner.due_tickers(planned), [CODE])

    def test_결과일_전이거나_출처가_없으면_후보가_아니다(self):
        self.seal(with_provenance=False)                       # 출처 없음 → MISSING_PROVENANCE
        planned, _ = producer.make_plan(self.root, self.repo, NOW)
        self.assertEqual(planned['counts'][planner.MISSING_PROVENANCE], 1)
        self.assertEqual(planner.due_tickers(planned), [])

    def test_plan_only가_후보_파일을_쓴다(self):
        self.seal(); self.bundles()
        out = os.path.join(self.repo, 'due', 'due_tickers.txt')
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            code = producer.main(['--repo', self.repo, '--now', NOW, '--plan-only', '--due-tickers-out', out])
        self.assertEqual(code, 0)
        lines = [l for l in open(out, encoding='utf-8').read().splitlines() if l and not l.startswith('#')]
        self.assertEqual(lines, [CODE])
        self.assertEqual(json.loads(buf.getvalue().strip().splitlines()[-1])['dueTickers'], 1)
        import due_targets
        self.assertEqual(due_targets.read_tickers_file(out), [CODE])   # 수집기가 그대로 읽을 수 있다

    def test_후보가_없어도_빈_파일을_쓴다(self):
        out = os.path.join(self.repo, 'due_tickers.txt')
        with contextlib.redirect_stdout(io.StringIO()):
            producer.main(['--repo', self.repo, '--now', NOW, '--plan-only', '--due-tickers-out', out])
        import due_targets
        self.assertTrue(os.path.exists(out))
        self.assertEqual(due_targets.read_tickers_file(out), [])


class KeyMissingIsAlwaysReported(Fixture):
    """2026-09-16 첫 dispatch 실측: READY 0 이라 ownerActionRequired 가 비어 있었다 — 문서(종료코드 2)와 어긋났다.
    키 발급·승인은 시간이 걸리므로 결과일 전에 알아야 한다."""

    def test_증명할_판단이_없어도_키_없음은_OWNER_ACTION으로_남고_종료코드는_2다(self):
        status, planned, fake = self.produce(key=None)           # 판단 0건
        self.assertEqual(planned['counts'][planner.READY_FOR_PRICE_PROOF], 0)
        self.assertEqual([a['code'] for a in status['ownerActionRequired']], ['KRX_OPENAPI_AUTH_KEY_MISSING'])
        self.assertEqual(status['run']['attempted'], 0)
        self.assertEqual(status['blockedRecords'], [])           # 막힌 판단은 없다 — 키만 없다
        self.assertEqual(len(fake.calls), 0)
        out = io.StringIO()
        with patch.dict(os.environ, {krx.KEY_ENV: ''}), contextlib.redirect_stdout(out):
            code = producer.main(['--repo', self.repo, '--now', NOW])
        self.assertEqual(code, 2)
        self.assertIn('KRX_OPENAPI_AUTH_KEY_MISSING', out.getvalue())

    def test_키가_있으면_판단이_없어도_OWNER_ACTION은_없다(self):
        status, planned, fake = self.produce()
        self.assertEqual(status['ownerActionRequired'], [])
        self.assertEqual(len(fake.calls), 0)


class LegalGateFailClosed(Fixture):
    """2026-09-16 LEGAL / COPYRIGHT GATE — KRX 약관(비상업·원자료 제3자 제공 제한)과 광고가 붙은 공개 저장소.
    허용 근거가 config/source_compliance.json 에 기록되기 전에는 인증키가 있어도 요청 0 · 원자료 0 · 소유자 조치."""

    def real_gate(self):
        return compliance.gate('krx_openapi')

    def test_운영_설정의_KRX_게이트는_닫혀_있다(self):
        gate = self.real_gate()
        self.assertFalse(gate['publicRawStorageAllowed'])
        self.assertFalse(gate['commercialCleared'])
        self.assertEqual(gate['state'], compliance.STATE_UNVERIFIED)
        self.assertEqual(gate['commercialState'], compliance.COMMERCIAL_NOT_CLEARED)
        self.assertEqual(gate['gates']['publicRawStorage'], 'PROHIBITED')
        self.assertEqual(gate['gates']['commercialUse'], 'PROHIBITED')

    def test_키가_있어도_게이트가_닫혔으면_요청_0_원자료_0_소유자조치(self):
        self.seal(); self.bundles()
        status, planned, fake = self.produce(legal=self.real_gate())
        self.assertEqual(planned['counts'][planner.READY_FOR_PRICE_PROOF], 1)
        self.assertEqual(len(fake.calls), 0)                       # KRX 에 한 번도 묻지 않는다
        self.assertEqual(status['run']['blocked'], {'legal_use_unverified': 1})
        self.assertEqual([a['code'] for a in status['ownerActionRequired']], ['KRX_LEGAL_USE_UNVERIFIED'])
        self.assertEqual(status['legal']['state'], 'LEGAL_USE_UNVERIFIED')
        self.assertEqual(status['legal']['commercialState'], 'COMMERCIAL_USE_NOT_CLEARED')
        self.assertEqual(self.proofs(), [])
        self.assertFalse(os.path.exists(os.path.join(self.root, 'price_sources')))
        self.assertIn('LEGAL_USE_UNVERIFIED', producer.summary_line(status))

    def test_키도_없으면_법적_게이트와_키_없음을_둘_다_알린다(self):
        self.seal(); self.bundles()
        status, planned, fake = self.produce(key=None, legal=self.real_gate())
        self.assertEqual([a['code'] for a in status['ownerActionRequired']],
                         ['KRX_LEGAL_USE_UNVERIFIED', 'KRX_OPENAPI_AUTH_KEY_MISSING'])
        self.assertEqual(len(fake.calls), 0)

    def test_main_은_기본_게이트로_돌면_종료코드_2다(self):
        self.seal(); self.bundles()
        out = io.StringIO()
        with patch.object(producer, 'legal_gate', self.real_gate), \
                patch.dict(os.environ, {krx.KEY_ENV: 'not-a-real-key'}), \
                patch.object(krx, 'http_get', FakeKrx(official_responses())), \
                contextlib.redirect_stdout(out):
            code = producer.main(['--repo', self.repo, '--now', NOW])
        self.assertEqual(code, 2)
        self.assertIn('KRX_LEGAL_USE_UNVERIFIED', out.getvalue())
        status = json.load(open(os.path.join(self.repo, producer.STATUS_FILE), encoding='utf-8'))
        self.assertEqual(status['legal']['state'], 'LEGAL_USE_UNVERIFIED')
        self.assertEqual(status['producedProofs'], [])

    def test_save_source_는_게이트_없이_원문을_디스크에_쓰지_않는다(self):
        fake = FakeKrx(official_responses())
        with patch.object(krx, 'http_get', fake):
            rec = krx.fetch_daily(STK, '20260910', KEY, observed_at=NOW)
        self.assertTrue(rec.get('structureVerified'))
        with self.assertRaises(krx.ContractError) as ctx:
            krx.save_source(rec, self.root)                       # allow_public_raw=None → 운영 설정을 읽는다 → 닫힘
        self.assertIn('LEGAL_USE_UNVERIFIED', str(ctx.exception))
        self.assertFalse(os.path.exists(os.path.join(self.root, 'price_sources')))
        with self.assertRaises(krx.ContractError):
            krx.save_source(rec, self.root, allow_public_raw=False)
        path, created = krx.save_source(rec, self.root, allow_public_raw=True)   # 시험이 명시적으로 열 때만
        self.assertTrue(created and os.path.exists(path))

    def test_시험용_cleared_gate_는_testOnly_표시가_있다(self):
        self.assertTrue(compliance.cleared_gate('krx_openapi')['testOnly'])
        self.assertNotIn('testOnly', self.real_gate())
