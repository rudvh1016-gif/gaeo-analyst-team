#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공식 일별 주가 전환(금융위원회_주식시세정보 15094808) 계약 시험 — 2026-09-17 지시 §13.

무엇을 잠그나(전부 합성 입력 · 네트워크 0 · Production 파일 무변경)
    · 키 없음 / 인증 실패 / 승인 안 됨 → 호출 0 또는 상태코드만 남고 키는 어디에도 없다
    · 인코딩키 이중 인코딩 방지 · 리다이렉트는 따라가기 전에 차단 · 로그·예외·메타·저장에 키 없음
    · requestedAt 뒤에 receivedAt(응답 수신 후) · 기준일(basDt) ≠ 수신일
    · totalCount 누락(0 아님) · 페이지 사이 불일치 · 중간 페이지 실패 · 받은 행 초과 · 빈 페이지 · 예산 소진
    · 요청 종목·기간 밖 행 차단 · 앞자리 0 보존 · 접두문자 기록 · 빈 값과 0 구분 · 음수·NaN·무한대 거부 · ISIN 교차확인
    · 같은 종목·날짜 중복(같으면 1건, 다르면 둘 다 제외) · 파싱 실패 행이 있으면 '전체 유효' 아님
    · 저장: 되읽기 해시 · 같은 응답 UNCHANGED · 정정은 개정본 추가 + 이전 파일 보존 · 미발행·부분 실패는 미확보(전날 값 복사 없음)
    · 가격 조정 여부 UNCONFIRMED 승격 금지 · 채점 게이트(comparison_evidence) 자동 통과 금지
    · 발표 규칙(다음 영업일 13:00) · --if-due 는 이미 있으면 NOT_DUE · 검증 보고서 결론·문제 목록
    · 차트 소비자: enabled=0 이면 stocks 없음 · 켜지면 공식 자료만(네이버 채움 0) · app.js 는 공식 경로에서 네이버로 돌아가지 않음
    · 장중 현재가(data.js)·판단 입력·price_history.js 는 이 경로를 읽지 않는다 · 워크플로/Pages 제외/준법 범위
표준 라이브러리·저장소 모듈만 사용(test_ci_parity).
"""
import copy
import datetime as dt
import gzip
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import types
import unittest
import urllib.error
import urllib.parse
from contextlib import redirect_stdout

import source_compliance as compliance
from data_supply import contracts, fsc_stock_price as fsc, fsc_daily_store as store, fsc_daily_collect as collect
import build_official_price_history as builder
import comparison_evidence

HERE = os.path.dirname(os.path.abspath(__file__))
KEY = 'TESTKEY+abc/def=='                       # 가짜 키(형태만). 실제 키를 저장소에 두지 않는다.
ENC_KEY = urllib.parse.quote(KEY, safe='')      # 포털 '인코딩키' 형태: TESTKEY%2Babc%2Fdef%3D%3D


def open_gate():
    return compliance.cleared_gate(fsc.PROVIDER_ID)


def closed_gate():
    gate = copy.deepcopy(compliance.cleared_gate(fsc.PROVIDER_ID))
    gate['gates']['automatedCollection'] = 'OWNER_CONFIRMATION_REQUIRED'
    gate['automatedCollectionAllowed'] = False
    gate['state'] = compliance.STATE_UNVERIFIED
    return gate


def item(code, bas_dt, close=10000, open_=None, high=None, low=None, volume=1000, **over):
    row = {'basDt': bas_dt, 'srtnCd': code, 'isinCd': f'KR7{code}000', 'itmsNm': f'합성{code}', 'mrktCtg': 'KOSPI',
           'clpr': str(close), 'vs': '100', 'fltRt': '1.00', 'mkp': str(open_ if open_ is not None else close - 50),
           'hipr': str(high if high is not None else close + 100), 'lopr': str(low if low is not None else close - 100),
           'trqu': str(volume), 'trPrc': str(close * volume), 'lstgStCnt': '1000000', 'mrktTotAmt': str(close * 1000000)}
    row.update(over)
    return row


def day_items(bas_dt, codes=('999901', '999902', '999903')):
    return [item(code, bas_dt, close=10000 + i * 100) for i, code in enumerate(codes)]


def payload(items, total, num_rows, page):
    body = {'numOfRows': num_rows, 'pageNo': page, 'items': {'item': items}}
    if total is not None:
        body['totalCount'] = total
    return {'response': {'header': {'resultCode': '00', 'resultMsg': 'NORMAL SERVICE.'}, 'body': body}}


class FakeApi:
    """basDt(또는 기간)별 합성 응답을 페이지로 나눠 주는 가짜 포털. URL 은 기록만 한다(키 유출 검사용)."""

    def __init__(self, days, page_size=None, total=None, drop_total=False, fail_pages=(), total_by_page=None,
                 extra_rows=()):
        self.days, self.page_size, self.total, self.drop_total = days, page_size, total, drop_total
        self.fail_pages, self.total_by_page, self.extra_rows = set(fail_pages), total_by_page or {}, list(extra_rows)
        self.calls = []

    def __call__(self, url, timeout):
        self.calls.append(url)
        q = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
        page = int(q['pageNo'][0])
        n = int(q['numOfRows'][0])
        if self.page_size:
            n = min(n, self.page_size)
        if page in self.fail_pages:
            raise urllib.error.HTTPError(url, 500, 'Server Error', {}, None)
        if 'basDt' in q:
            items = list(self.days.get(q['basDt'][0], []))
        else:
            begin, end = q.get('beginBasDt', ['00000000'])[0], q.get('endBasDt', ['99999999'])[0]
            items = [it for d, rows in sorted(self.days.items()) if begin <= d <= end for it in rows]
        items = items + self.extra_rows
        chunk = items[(page - 1) * n: page * n]
        total = len(items) if self.total is None else self.total
        total = self.total_by_page.get(page, total)
        return json.dumps(payload(chunk, None if self.drop_total else total, n, page)).encode('utf-8')


class _Env:
    def __enter__(self):
        self.old = os.environ.pop(fsc.KEY_ENV, None)
        return self

    def __exit__(self, *exc):
        if self.old is not None:
            os.environ[fsc.KEY_ENV] = self.old


class CredentialsAndGate(unittest.TestCase):
    def test_키_없으면_호출_0(self):
        api = FakeApi({'20260915': day_items('20260915')})
        with _Env():
            with self.assertRaises(fsc.CredentialsMissing):
                fsc.fetch_page(bas_dt='20260915', gate=open_gate(), opener=api)
        self.assertEqual(api.calls, [])

    def test_게이트_닫히면_키가_있어도_호출_0(self):
        api = FakeApi({'20260915': day_items('20260915')})
        with self.assertRaises(compliance.LegalGateError):
            fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=closed_gate(), opener=api)
        self.assertEqual(api.calls, [])

    def test_인증_실패와_승인_안_됨은_상태코드만_남긴다(self):
        def unregistered(url, timeout):
            return json.dumps({'response': {'header': {'resultCode': '30', 'resultMsg': 'SERVICE KEY IS NOT REGISTERED ERROR.'}}}).encode()
        with self.assertRaises(contracts.ContractError) as ctx:
            fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=open_gate(), opener=unregistered)
        self.assertIn('resultCode=30', str(ctx.exception))
        self.assertNotIn(KEY, str(ctx.exception))

        def forbidden(url, timeout):
            raise urllib.error.HTTPError(url, 401, 'Unauthorized', {}, None)
        with self.assertRaises(contracts.ContractError) as ctx:
            fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=open_gate(), opener=forbidden)
        self.assertIn('HTTP 401', str(ctx.exception))
        self.assertNotIn(KEY, str(ctx.exception))
        self.assertNotIn(ENC_KEY, str(ctx.exception))

    def test_라이브_CLI_는_키가_없으면_종료코드_3(self):
        env = {k: v for k, v in os.environ.items() if k != fsc.KEY_ENV}
        env['PYTHONUTF8'] = '1'
        r = subprocess.run([sys.executable, '-m', 'data_supply.fsc_stock_price', '--live', '--bas-dt', '20260915'],
                           cwd=HERE, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 3, r.stdout + r.stderr)
        self.assertIn('CREDENTIALS_MISSING', r.stdout)

    def test_collect_CLI_첫_줄은_SECRET_PRESENT_불리언(self):
        env = {k: v for k, v in os.environ.items() if k != fsc.KEY_ENV}
        env['PYTHONUTF8'] = '1'
        r = subprocess.run([sys.executable, '-m', 'data_supply.fsc_daily_collect', '--plan', '--days', '2'],
                           cwd=HERE, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0, r.stdout + r.stderr)
        self.assertEqual(r.stdout.splitlines()[0], 'SECRET_PRESENT=false')

    def test_secret_present_는_값을_돌려주지_않는다(self):
        with _Env():
            self.assertFalse(collect.secret_present())
            os.environ[fsc.KEY_ENV] = KEY
            self.assertIs(collect.secret_present(), True)


class KeyProtection(unittest.TestCase):
    def test_인코딩키는_이중_인코딩되지_않는다(self):
        url_enc = fsc.build_url(ENC_KEY, bas_dt='20260915')
        url_dec = fsc.build_url(KEY, bas_dt='20260915')
        self.assertEqual(url_enc, url_dec)
        self.assertIn('serviceKey=' + ENC_KEY + '&', url_enc)
        self.assertNotIn('%252B', url_enc)
        self.assertEqual(fsc.service_key_form(ENC_KEY), 'encoded')
        self.assertEqual(fsc.service_key_form(KEY), 'decoded')
        self.assertEqual(fsc.service_key_form(''), 'missing')

    def test_키가_메타_예외_요청경로에_없다(self):
        api = FakeApi({'20260915': day_items('20260915')})
        rows, rejected, meta, structure = fsc.fetch_page(bas_dt='20260915', service_key=ENC_KEY, gate=open_gate(), opener=api)
        blob = json.dumps(meta) + json.dumps(structure) + json.dumps(rows)
        for secret in (KEY, ENC_KEY):
            self.assertNotIn(secret, blob)
        self.assertIn('serviceKey=' + fsc.REDACTED, meta['requestPath'])
        self.assertIn(ENC_KEY, api.calls[0])                     # 실제 요청에는 한 번 인코딩된 키가 간다
        self.assertEqual(fsc.redact('x ' + KEY + ' y ' + ENC_KEY, ENC_KEY), f'x {fsc.REDACTED} y {fsc.REDACTED}')

    def test_리다이렉트는_따라가기_전에_차단되고_주소도_남기지_않는다(self):
        handler = fsc._NoRedirect()
        req = urllib.request.Request('https://apis.data.go.kr/x?serviceKey=' + ENC_KEY)
        with self.assertRaises(fsc.FscContractError) as ctx:
            handler.redirect_request(req, None, 302, 'Found', {}, 'https://evil.example/collect?serviceKey=' + ENC_KEY)
        msg = str(ctx.exception)
        self.assertIn('리다이렉트 거부', msg)
        self.assertNotIn('evil.example', msg)
        self.assertNotIn(ENC_KEY, msg)

    def test_예외_종류만_남기고_본문은_버린다(self):
        def boom(url, timeout):
            raise OSError('connection reset serviceKey=' + ENC_KEY)
        with self.assertRaises(contracts.ContractError) as ctx:
            fsc.fetch_page(bas_dt='20260915', service_key=ENC_KEY, gate=open_gate(), opener=boom)
        self.assertEqual(str(ctx.exception), f'OSError at {fsc.OPERATION}')


class Timestamps(unittest.TestCase):
    def test_receivedAt_는_응답을_받은_뒤에_찍힌다(self):
        ticks = []
        original = fsc._utcnow

        def fake_now():
            ticks.append(len(ticks) + 1)
            return f'2026-09-17T00:00:0{len(ticks)}+00:00'
        seen = {}

        def api(url, timeout):
            seen['ticks_when_called'] = len(ticks)
            return json.dumps(payload(day_items('20260915'), 3, 3000, 1)).encode()
        fsc._utcnow = fake_now
        try:
            _, _, meta, _ = fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=open_gate(), opener=api)
        finally:
            fsc._utcnow = original
        self.assertEqual(seen['ticks_when_called'], 1)             # 요청 직전 1번만 찍혔다
        self.assertEqual(meta['requestedAt'], '2026-09-17T00:00:01+00:00')
        self.assertEqual(meta['receivedAt'], '2026-09-17T00:00:02+00:00')
        self.assertLess(meta['requestedAt'], meta['receivedAt'])

    def test_기준일은_거래일이고_수신일과_다르다(self):
        api = FakeApi({'20260915': day_items('20260915')})
        rows, _, meta, _ = fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=open_gate(), opener=api)
        self.assertEqual({r['date'] for r in rows}, {'2026-09-15'})
        prov = fsc.provenance_for(rows[0], meta['receivedAt'])
        self.assertEqual(prov['sourceSessionDate'], '2026-09-15')
        self.assertEqual(prov['sourceAsOf'], '2026-09-15')
        self.assertNotEqual(prov['receivedAt'][:10], '2026-09-15')
        self.assertEqual(prov['provider'], 'FSC_PUBLIC_DATA_PORTAL')


class Completeness(unittest.TestCase):
    def _day(self, api, **kw):
        return fsc.fetch_day('20260915', service_key=KEY, gate=open_gate(), opener=api, **kw)

    def test_totalCount_없으면_0이_아니라_모름이다(self):
        api = FakeApi({'20260915': day_items('20260915')}, drop_total=True)
        result = self._day(api)
        self.assertEqual(result['completeness']['status'], 'UNKNOWN_TOTAL')
        self.assertFalse(result['complete'])
        self.assertIsNone(result['totalCountReported'])
        self.assertEqual(result['validRowCount'], 3)                # 받은 행은 남기되 '전체'라고 하지 않는다

    def test_페이지_사이_totalCount_변경은_INCONSISTENT(self):
        api = FakeApi({'20260915': day_items('20260915', tuple(f'99990{i}' for i in range(1, 7)))}, page_size=2,
                      total_by_page={2: 7})
        result = self._day(api, num_rows=2)
        self.assertEqual(result['completeness']['status'], 'INCONSISTENT')
        self.assertFalse(result['totalCountConsistent'])

    def test_중간_페이지_실패는_PARTIAL_이고_이전_페이지만_남는다(self):
        api = FakeApi({'20260915': day_items('20260915', tuple(f'99990{i}' for i in range(1, 7)))}, page_size=2, fail_pages={2})
        result = self._day(api, num_rows=2)
        self.assertEqual(result['completeness']['status'], 'PARTIAL')
        self.assertEqual(result['completeness']['reason'], 'PAGE_FAILED')
        self.assertEqual(result['validRowCount'], 2)
        self.assertFalse(result['complete'])
        self.assertNotIn(KEY, json.dumps(result['completeness']))

    def test_받은_행이_totalCount_보다_많으면_INCONSISTENT(self):
        api = FakeApi({'20260915': day_items('20260915')}, total=2)
        result = self._day(api)
        self.assertEqual(result['completeness']['status'], 'INCONSISTENT')
        self.assertEqual(result['completeness']['reason'], 'RECEIVED_MORE_THAN_TOTAL')

    def test_총_건수_전에_빈_페이지가_오면_PARTIAL(self):
        api = FakeApi({'20260915': day_items('20260915')}, total=10, page_size=3)
        result = self._day(api, num_rows=3)
        self.assertEqual(result['completeness']['status'], 'PARTIAL')
        self.assertEqual(result['completeness']['reason'], 'EMPTY_PAGE_BEFORE_TOTAL')

    def test_예산이_소진되면_더_부르지_않는다(self):
        api = FakeApi({'20260915': day_items('20260915', tuple(f'99990{i}' for i in range(1, 7)))}, page_size=2)
        budget = fsc.RequestBudget(2)
        result = self._day(api, num_rows=2, budget=budget)
        self.assertEqual(budget.requests, 2)
        self.assertEqual(len(api.calls), 2)
        self.assertEqual(result['completeness']['reason'], 'BUDGET_EXHAUSTED')
        self.assertEqual(result['completeness']['status'], 'PARTIAL')
        with self.assertRaises(fsc.BudgetExhausted):
            budget.take()

    def test_전부_받아도_파싱_실패_행이_있으면_전체_유효가_아니다(self):
        items = day_items('20260915')
        items[1]['clpr'] = 'abc'
        api = FakeApi({'20260915': items})
        result = self._day(api)
        self.assertEqual(result['completeness']['status'], 'COMPLETE')
        self.assertEqual(result['rawRowCount'], 3)
        self.assertEqual(result['validRowCount'], 2)
        self.assertEqual(result['rejectedCount'], 1)
        self.assertFalse(result['allRowsValid'])
        self.assertEqual(result['rejected'][0]['page'], 1)

    def test_정상이면_COMPLETE_이고_요청수를_센다(self):
        api = FakeApi({'20260915': day_items('20260915', tuple(f'99990{i}' for i in range(1, 6)))}, page_size=2)
        budget = fsc.RequestBudget(10)
        result = self._day(api, num_rows=2, budget=budget)
        self.assertEqual(result['completeness']['status'], 'COMPLETE')
        self.assertTrue(result['allRowsValid'])
        self.assertEqual(result['pages'], 3)
        self.assertEqual(budget.summary()['requests'], 3)
        self.assertEqual(budget.summary()['rowsReceived'], 5)
        self.assertEqual([p['numOfRows'] for p in result['pageMeta']], [2, 2, 2])


class ScopeAndValues(unittest.TestCase):
    def test_요청_종목과_다른_종목은_차단한다(self):
        # likeSrtnCd 는 접두 일치라 다른 종목이 섞여 올 수 있다 — 요청한 종목만 남긴다.
        api = FakeApi({'20260915': day_items('20260915', ('005930', '005935', '005931'))})
        rows, _, meta, _ = fsc.fetch_page(bas_dt='20260915', code='005930', service_key=KEY, gate=open_gate(), opener=api)
        self.assertEqual([r['code'] for r in rows], ['005930'])
        self.assertEqual(meta['codeMismatch'], 2)

    def test_요청_기간_밖의_행은_차단한다(self):
        days = {'20260914': day_items('20260914'), '20260915': day_items('20260915'), '20260916': day_items('20260916')}
        api = FakeApi(days)
        rows, _, meta, _ = fsc.fetch_page(begin='20260915', end='20260915', service_key=KEY, gate=open_gate(),
                                          opener=FakeApi(days, extra_rows=day_items('20260911')))
        self.assertEqual({r['date'] for r in rows}, {'2026-09-15'})
        self.assertEqual(meta['outOfRange'], 3)
        rows, _, meta, _ = fsc.fetch_page(bas_dt='20260915', service_key=KEY, gate=open_gate(),
                                          opener=FakeApi(days, extra_rows=day_items('20260916')))
        self.assertEqual(meta['outOfRange'], 3)
        self.assertEqual(len(rows), 3)

    def test_앞자리_0_보존_접두문자는_기록만_한다(self):
        row = fsc.normalize_item(item('005930', '20260915'))
        self.assertEqual(row['code'], '005930')
        self.assertIsNone(row['codePrefix'])
        row = fsc.normalize_item(item('A005930', '20260915', isinCd='KR7005930003'))
        self.assertEqual((row['code'], row['codePrefix'], row['codeRaw']), ('005930', 'A', 'A005930'))
        self.assertIs(row['isinMatchesCode'], True)
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_item(item('5930', '20260915'))
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_item(item('AB05930', '20260915'))
        report = fsc.structure_report([item('005930', '20260915'), item('A005930', '20260915'), item('59', '20260915')])
        self.assertEqual(report['codeFormats'], {'digits6': 1, 'alpha1+digits6': 1, 'other': 1})

    def test_빈_값과_0을_구분하고_거래량_0으로_거래정지를_추정하지_않는다(self):
        with self.assertRaises(contracts.ContractError) as ctx:
            fsc.normalize_item(item('999901', '20260915', trqu=''))
        self.assertIn('volume', str(ctx.exception))
        row = fsc.normalize_item(item('999901', '20260915', trqu='0'))
        self.assertEqual(row['volume'], 0)
        result = fsc.fetch_day('20260915', service_key=KEY, gate=open_gate(),
                               opener=FakeApi({'20260915': [item('999901', '20260915', trqu='0')]}))
        self.assertTrue(result['usable'])
        self.assertNotIn('halt', json.dumps(result).lower())

    def test_음수_NaN_무한대_문자는_거부한다(self):
        for bad in ({'clpr': '-100'}, {'clpr': 'NaN'}, {'clpr': 'inf'}, {'clpr': '1e400'}, {'trqu': '-1'}, {'hipr': 'abc'},
                    {'clpr': '0'}, {'mrktTotAmt': '-5'}):
            with self.assertRaises(contracts.ContractError, msg=str(bad)):
                fsc.normalize_item(item('999901', '20260915', **bad))
        with self.assertRaises(ValueError):
            fsc._num(float('nan'))
        self.assertIsNone(fsc._num(''))
        self.assertEqual(fsc._num('1,234'), 1234)

    def test_고가_저가_시가_종가_관계(self):
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_item(item('999901', '20260915', close=10000, high=9000, low=9500))
        with self.assertRaises(contracts.ContractError):
            fsc.normalize_item(item('999901', '20260915', close=10000, high=10100, low=9900, open_=20000))

    def test_ISIN_교차확인은_표시만_한다(self):
        row = fsc.normalize_item(item('005935', '20260915', isinCd='KR7005931001'))   # 우선주: 코드 ≠ ISIN 본체
        self.assertIs(row['isinMatchesCode'], False)
        row = fsc.normalize_item(item('005930', '20260915', isinCd=''))
        self.assertIsNone(row['isinMatchesCode'])

    def test_단위와_이름이_같다고_뜻이_같다고_보지_않는다(self):
        row = fsc.normalize_item(item('999901', '20260915', close=10300, mrktTotAmt='103000000000'))
        quote, coverage = fsc.to_quote(row, previous_close=10000)
        self.assertEqual(quote['cap'], '0.1조')                    # 원 → 백만원 기준 문자열
        self.assertEqual(coverage['per'], contracts.NOT_PROVIDED_BY_SOURCE)
        self.assertFalse(coverage['rateCrossCheck']['consistent'])  # fltRt 1.00 ≠ 3.00 → 불일치를 숨기지 않는다


class DuplicatesAndConflicts(unittest.TestCase):
    def test_같은_종목_날짜가_같은_값으로_반복되면_하나만_남긴다(self):
        rows = day_items('20260915') + [item('999901', '20260915', close=10000)]
        result = fsc.fetch_day('20260915', service_key=KEY, gate=open_gate(), opener=FakeApi({'20260915': rows}))
        self.assertEqual(result['validRowCount'], 3)
        self.assertEqual(result['duplicatesIdentical'], 1)
        self.assertEqual(result['conflicts'], [])

    def test_상충하면_마지막_행을_고르지_않고_둘_다_뺀다(self):
        rows = day_items('20260915') + [item('999901', '20260915', close=12345)]
        result = fsc.fetch_day('20260915', service_key=KEY, gate=open_gate(), opener=FakeApi({'20260915': rows}))
        self.assertEqual({r['code'] for r in result['rows']}, {'999902', '999903'})
        self.assertEqual(result['conflicts'], [{'code': '999901', 'date': '2026-09-15', 'rows': 2}])
        self.assertFalse(result['usable'])
        self.assertFalse(result['allRowsValid'])


class Store(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='gaeo-fsc-store-')

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _result(self, bas_dt='20260915', items=None, **kw):
        api = FakeApi({bas_dt: items if items is not None else day_items(bas_dt)}, **kw)
        return fsc.fetch_day(bas_dt, service_key=ENC_KEY, gate=open_gate(), opener=api)

    def test_저장_되읽기_해시_메타(self):
        saved = store.save_day(self._result(), self.tmp, requested_by='test')
        self.assertEqual(saved['action'], 'CREATED')
        record = store.load_day('2026-09-15', self.tmp)
        self.assertEqual(record['tradingDate'], '2026-09-15')
        self.assertEqual(record['responseHash'], store.response_hash(record['rawItems']))
        self.assertEqual(record['priceBasis'], 'provider_as_is')
        self.assertEqual(record['adjustmentStatus'], 'UNCONFIRMED')
        self.assertEqual(record['provider'], 'FSC_PUBLIC_DATA_PORTAL')
        self.assertEqual(record['datasetId'], '15094808')
        self.assertIn('requestedAt', record)
        self.assertIn('receivedAt', record)
        with open(os.path.join(store.store_root(self.tmp), saved['file']), 'rb') as handle:
            blob = gzip.decompress(handle.read())
        self.assertNotIn(KEY.encode(), blob)
        self.assertNotIn(ENC_KEY.encode(), blob)
        self.assertTrue(store.verify_store(self.tmp)['ok'])
        manifest = store.load_manifest(self.tmp)
        self.assertEqual(manifest['days']['2026-09-15']['status'], 'COMPLETE')
        self.assertEqual(manifest['corrections'], [])

    def test_같은_응답은_UNCHANGED(self):
        store.save_day(self._result(), self.tmp)
        saved = store.save_day(self._result(), self.tmp)
        self.assertEqual(saved['action'], 'UNCHANGED')
        self.assertEqual(len(store.revisions('2026-09-15', self.tmp)), 1)

    def test_정정은_개정본을_추가하고_이전_파일을_남긴다(self):
        first = store.save_day(self._result(), self.tmp)
        changed = day_items('20260915')
        changed[0]['clpr'] = '10050'
        second = store.save_day(self._result(items=changed), self.tmp, requested_by='recheck')
        self.assertEqual(second['action'], 'CORRECTED')
        base = store.store_root(self.tmp)
        self.assertTrue(os.path.exists(os.path.join(base, first['file'])))
        self.assertTrue(os.path.exists(os.path.join(base, second['file'])))
        self.assertNotEqual(first['file'], second['file'])
        manifest = store.load_manifest(self.tmp)
        self.assertEqual(len(manifest['corrections']), 1)
        corr = manifest['corrections'][0]
        self.assertEqual((corr['kind'], corr['changedRows'], corr['previousHash']), ('VALUE_CHANGE', 1, first['responseHash']))
        self.assertEqual(manifest['days']['2026-09-15']['file'], second['file'])
        self.assertEqual(len(store.revisions('2026-09-15', self.tmp)), 2)
        self.assertEqual(store.load_day('2026-09-15', self.tmp)['rows'][0]['close'], 10050)
        self.assertTrue(store.verify_store(self.tmp)['ok'])
        old = store._read_gz_json(os.path.join(base, first['file']))
        self.assertEqual(old['rows'][0]['close'], 10000)               # 이전 기록은 그대로

    def test_미발행_부분_실패는_미확보로_두고_전날_값을_복사하지_않는다(self):
        store.save_day(self._result('20260915'), self.tmp)
        for bad in (self._result('20260916', drop_total=True), self._result('20260916', total=1)):
            self.assertEqual(store.save_day(bad, self.tmp)['action'], 'REJECTED')
        empty = fsc.fetch_day('20260916', service_key=KEY, gate=open_gate(), opener=FakeApi({'20260916': []}))
        self.assertEqual(empty['completeness']['status'], 'NO_DATA')
        self.assertFalse(empty['complete'])
        self.assertEqual(store.save_day(empty, self.tmp)['action'], 'REJECTED')
        series = store.load_series(root=self.tmp)
        self.assertEqual([b['date'] for b in series['999901']], ['2026-09-15'])
        self.assertNotIn('2026-09-16', store.load_manifest(self.tmp)['days'])
        with self.assertRaises(store.StoreError):
            store.day_record(empty)

    def test_PARTIAL_은_저장하되_상태를_유지하고_COMPLETE_가_오면_개정한다(self):
        partial = self._result(items=day_items('20260915', tuple(f'99990{i}' for i in range(1, 7))), page_size=2, fail_pages={2})
        saved = store.save_day(partial, self.tmp)
        self.assertEqual((saved['action'], saved['status']), ('CREATED', 'PARTIAL'))
        full = self._result(items=day_items('20260915', tuple(f'99990{i}' for i in range(1, 7))))
        saved = store.save_day(full, self.tmp)
        self.assertEqual((saved['action'], saved['status']), ('CORRECTED', 'COMPLETE'))
        self.assertEqual(store.load_manifest(self.tmp)['corrections'][0]['kind'], 'PARTIAL_TO_COMPLETE')

    def test_되읽기_검증은_변조를_잡는다(self):
        saved = store.save_day(self._result(), self.tmp)
        path = os.path.join(store.store_root(self.tmp), saved['file'])
        record = store._read_gz_json(path)
        record['rawItems'][0]['clpr'] = '1'
        store._write_gz_json(path, record)
        self.assertEqual([p['problem'] for p in store.verify_store(self.tmp)['problems']], ['HASH_MISMATCH'])

    def test_가격_조정_여부는_승격되지_않는다(self):
        self.assertEqual(fsc.PRICE_BASIS, 'provider_as_is')
        self.assertEqual(fsc.ADJUSTMENT_STATUS, 'UNCONFIRMED')
        self.assertFalse(fsc.PRICE_BASIS_VERIFIED)
        self.assertNotIn(fsc.PRICE_BASIS, ('adjusted', 'unadjusted'))
        prov = fsc.provenance_for(fsc.normalize_item(item('999901', '20260915')), '2026-09-17T00:00:00+00:00')
        self.assertEqual(prov['adjustmentStatus'], 'UNCONFIRMED')
        self.assertFalse(prov['scoringProofAccepted'])


class CollectAndVerify(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='gaeo-fsc-collect-')
        with open(os.path.join(self.tmp, 'tickers.js'), 'w', encoding='utf-8') as handle:
            handle.write('const TICKERS = ' + json.dumps([{'code': c, 'name': c, 'sector': 'x'} for c in ('999901', '999902', '999903')]) + ';\n')
        os.makedirs(os.path.join(self.tmp, 'config'))
        shutil.copy(os.path.join(HERE, 'config', 'data_supply_migration.json'), os.path.join(self.tmp, 'config'))
        self.now = dt.datetime(2026, 9, 17, 14, 0, tzinfo=collect.KST)
        self.dates = collect.available_trading_dates(3, self.now)
        self.days = {d.replace('-', ''): day_items(d.replace('-', '')) for d in self.dates}

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _args(self, **over):
        base = {'days': 3, 'codes_limit': 2, 'max_requests': 10, 'root': self.tmp, 'if_due': False}
        base.update(over)
        return types.SimpleNamespace(**base)

    def test_발표_규칙_다음_영업일_13시(self):
        thu_morning = dt.datetime(2026, 9, 17, 10, 0, tzinfo=collect.KST)
        thu_afternoon = dt.datetime(2026, 9, 17, 14, 0, tzinfo=collect.KST)
        saturday = dt.datetime(2026, 9, 19, 11, 0, tzinfo=collect.KST)
        monday_morning = dt.datetime(2026, 9, 21, 9, 0, tzinfo=collect.KST)
        self.assertEqual(collect.latest_available_trading_date(thu_morning), '2026-09-15')     # 16일 자료는 17일 13:00 이후
        self.assertEqual(collect.latest_available_trading_date(thu_afternoon), '2026-09-16')
        self.assertEqual(collect.latest_available_trading_date(saturday), '2026-09-17')        # 18일 자료는 월요일 13:00 이후
        self.assertEqual(collect.latest_available_trading_date(monday_morning), '2026-09-17')
        self.assertEqual(collect.available_trading_dates(3, thu_afternoon), ['2026-09-14', '2026-09-15', '2026-09-16'])
        self.assertNotIn(dt.date(2026, 9, 17).isoformat(), collect.available_trading_dates(5, thu_afternoon))  # 오늘은 없다

    def test_키가_없으면_검증은_CREDENTIALS_MISSING_이고_호출_0(self):
        api = FakeApi(self.days)
        with _Env():
            report, code = collect.run_verify(self._args(), now=self.now, gate=open_gate(), opener=api)
        self.assertEqual(code, collect.EXIT_CREDENTIALS_MISSING)
        self.assertEqual(report['conclusion'], 'CREDENTIALS_MISSING')
        self.assertFalse(report['secretPresent'])
        self.assertEqual(api.calls, [])
        self.assertEqual(store.load_manifest(self.tmp)['days'], {})

    def test_게이트가_닫히면_GATE_CLOSED_호출_0(self):
        api = FakeApi(self.days)
        report, code = collect.run_verify(self._args(), now=self.now, gate=closed_gate(), opener=api, service_key=KEY)
        self.assertEqual(code, collect.EXIT_GATE_CLOSED)
        self.assertEqual(api.calls, [])

    def test_검증_성공_보고서(self):
        api = FakeApi(self.days)
        with _Env():
            report, code = collect.run_verify(self._args(), now=self.now, gate=open_gate(), opener=api, service_key=ENC_KEY)
        self.assertEqual(code, collect.EXIT_OK, report.get('problems'))
        self.assertEqual(report['conclusion'], 'LIVE_DATA_VERIFIED')
        self.assertEqual(report['problems'], [])
        self.assertEqual(report['targetDates'], self.dates)
        self.assertEqual(report['completeDates'], self.dates)
        self.assertEqual(report['budget']['requests'], 3)
        self.assertEqual(report['keyForm'], 'encoded')
        self.assertTrue(report['sampleChecks']['allPresent'])
        self.assertEqual(report['sampleCodes'], ['999901', '999902'])
        self.assertEqual(report['comparison']['pairsCompared'], 0)      # 레거시 표본이 없으면 대조 0 — 값을 지어내지 않는다
        self.assertTrue(report['storeIntegrity']['ok'])
        blob = json.dumps(report)
        self.assertNotIn(KEY, blob)
        self.assertNotIn(ENC_KEY, blob)
        self.assertEqual(store.stored_dates(self.tmp), self.dates)
        rel = store.save_verification_report(report, self.tmp)
        self.assertTrue(os.path.exists(os.path.join(store.store_root(self.tmp), rel)))

    def test_부분_실패는_문제_목록과_함께_PARTIAL(self):
        broken = dict(self.days)
        first = self.dates[0].replace('-', '')
        broken[first] = []                                              # 그 날 미발행
        api = FakeApi(broken)
        report, code = collect.run_verify(self._args(), now=self.now, gate=open_gate(), opener=api, service_key=KEY)
        self.assertEqual(code, collect.EXIT_OK)
        self.assertEqual(report['conclusion'], 'LIVE_DATA_PARTIAL')
        self.assertTrue(any(p.startswith('INCOMPLETE_DATES') for p in report['problems']))
        self.assertEqual(store.stored_dates(self.tmp), self.dates[1:])
        self.assertEqual(report['perDay'][0]['saved']['action'], 'REJECTED')

    def test_아무것도_확보하지_못하면_실패_코드(self):
        def boom(url, timeout):
            raise urllib.error.HTTPError(url, 500, 'Server Error', {}, None)
        report, code = collect.run_verify(self._args(), now=self.now, gate=open_gate(), opener=boom, service_key=KEY)
        self.assertEqual(code, collect.EXIT_NOTHING_VERIFIED)
        self.assertEqual(report['conclusion'], 'LIVE_DATA_FAILED')
        self.assertEqual(store.load_manifest(self.tmp)['days'], {})

    def test_if_due_는_이미_있으면_NOT_DUE_이고_없는_날만_받는다(self):
        api = FakeApi(self.days)
        report, code = collect.run_collect(self._args(if_due=True, max_requests=6), now=self.now, gate=open_gate(),
                                           opener=api, service_key=KEY)
        self.assertEqual((code, report['conclusion']), (collect.EXIT_OK, 'COLLECTED'))
        self.assertEqual(report['storedDates'], self.dates)
        calls = len(api.calls)
        report, code = collect.run_collect(self._args(if_due=True, max_requests=6), now=self.now, gate=open_gate(),
                                           opener=api, service_key=KEY)
        self.assertEqual((code, report['conclusion']), (collect.EXIT_OK, 'NOT_DUE'))
        self.assertEqual(len(api.calls), calls)                          # 추가 호출 0

    def test_백필은_예산을_넘지_않는다(self):
        api = FakeApi(self.days)
        report, code = collect.run_collect(self._args(days=3, max_requests=2), now=self.now, gate=open_gate(),
                                           opener=api, service_key=KEY)
        self.assertEqual(len(api.calls), 2)
        self.assertEqual(report['budget']['requests'], 2)
        self.assertEqual(len(report['storedDates']), 2)
        self.assertEqual(code, collect.EXIT_OK)

    def test_plan_은_네트워크_0(self):
        api = FakeApi(self.days)
        out = collect.plan(self.dates, self.tmp)
        self.assertEqual(out['missingDates'], self.dates)
        self.assertEqual(out['requestsEstimate']['ifOnePagePerDay'], 3)
        self.assertEqual(api.calls, [])


class ChartConsumer(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix='gaeo-fsc-chart-')
        with open(os.path.join(self.tmp, 'tickers.js'), 'w', encoding='utf-8') as handle:
            handle.write('const TICKERS = ' + json.dumps([{'code': c, 'name': c, 'sector': 'x'} for c in ('999901', '999902', '999909')]) + ';\n')
        os.makedirs(os.path.join(self.tmp, 'config'))
        shutil.copy(os.path.join(HERE, 'config', 'data_supply_migration.json'), os.path.join(self.tmp, 'config'))
        for name in ('data.js', 'price_history.js'):
            with open(os.path.join(self.tmp, name), 'w', encoding='utf-8') as handle:
                handle.write('// sentinel\n')
        for bas in ('20260914', '20260915'):
            store.save_day(fsc.fetch_day(bas, service_key=KEY, gate=open_gate(), opener=FakeApi({bas: day_items(bas)})), self.tmp)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def _read(self):
        with open(os.path.join(self.tmp, builder.OUT_NAME), encoding='utf-8') as handle:
            txt = handle.read()
        return txt, json.loads(re.search(r'const OFFICIAL_PRICE_HISTORY = (\{.*\});', txt, re.S).group(1))

    def test_스위치가_꺼져_있으면_stocks_가_비어_있다(self):
        meta = builder.build(self.tmp)                                   # 저장소 설정 그대로(기본 0)
        txt, obj = self._read()
        self.assertFalse(obj['meta']['enabled'])
        self.assertEqual(obj['stocks'], {})
        self.assertEqual(obj['meta']['tradingDays'], 2)
        self.assertIn('출처: 금융위원회 주식시세정보', txt)

    def test_켜지면_공식_자료만_담고_네이버로_채우지_않는다(self):
        builder.build(self.tmp, enabled=True)
        _, obj = self._read()
        self.assertTrue(obj['meta']['enabled'])
        self.assertEqual(sorted(obj['stocks']), ['999901', '999902'])       # 999909 는 공식 자료가 없다 → 비워 둔다
        self.assertEqual([b['date'] for b in obj['stocks']['999901']], ['2026-09-14', '2026-09-15'])
        self.assertEqual(set(obj['stocks']['999901'][0]), {'date', 'open', 'high', 'low', 'close', 'volume'})
        self.assertEqual(obj['meta']['codesMissing'], 1)
        self.assertIs(obj['meta']['naverFallback'], False)
        self.assertEqual(obj['meta']['lastTradingDate'], '2026-09-15')
        self.assertEqual(obj['meta']['adjustmentStatus'], 'UNCONFIRMED')

    def test_생성기는_data_js_와_price_history_js_를_건드리지_않는다(self):
        builder.build(self.tmp, enabled=True)
        for name in ('data.js', 'price_history.js'):
            with open(os.path.join(self.tmp, name), encoding='utf-8') as handle:
                self.assertEqual(handle.read(), '// sentinel\n')

    def test_저장소_스위치_기본값과_증거_규칙(self):
        cfg = builder.consumer_config(HERE)
        self.assertIn(cfg['enabled'], (0, 1))
        self.assertEqual(cfg['naverFallback'], 0)
        self.assertEqual(cfg['datasetId'], '15094808')
        if cfg['enabled']:
            self.assertIn(cfg['status'], ('LIVE_DATA_VERIFIED', 'PARTIAL_CONSUMER_MIGRATED', 'SCOPED_MIGRATION_VERIFIED'))
            self.assertTrue(cfg['evidence'], '켜져 있으면 검증 보고서 경로가 evidence 에 있어야 한다')
            path = os.path.join(HERE, cfg['evidence'])
            with open(path, encoding='utf-8') as handle:
                report = json.load(handle)
            self.assertEqual(report['conclusion'], 'LIVE_DATA_VERIFIED')
            self.assertTrue(os.path.exists(os.path.join(HERE, builder.OUT_NAME)))
        else:
            self.assertEqual(cfg['status'], 'IMPLEMENTED_WAITING_CREDENTIALS')

    def test_app_js_는_공식_경로에서_네이버로_돌아가지_않는다(self):
        with open(os.path.join(HERE, 'app.js'), encoding='utf-8') as handle:
            app = handle.read()
        with open(os.path.join(HERE, 'index.html'), encoding='utf-8') as handle:
            html = handle.read()
        self.assertIn("officialPrices:['official_price_history.js']", html)
        self.assertIn('function officialChartSeries(code)', app)
        self.assertIn("oph.meta.enabled!==true", app)
        block = app[app.index('const renderPriceChart=(full=false)=>{'):app.index("if(typeof window.renderStockJudge==='function')")]
        official_branch = block[block.index('if(official.enabled){'):block.index('const ohlcDays=')]
        self.assertIn('return;', official_branch)
        self.assertNotIn('flatOHLC', official_branch)                  # 공식 경로 안에서 네이버 일봉을 부르지 않는다
        self.assertIn('officialChartUnavailableHTML', official_branch)
        self.assertIn("GaeoFeatures.load('officialPrices')", block)
        self.assertNotIn('flatOHLC', block[block.index('.catch('):])     # 로드 실패 시에도 기존 경로로 돌아가지 않는다
        self.assertIn('출처: 금융위원회 주식시세정보 · 공공데이터포털(15094808)', app)
        self.assertIn('마지막 확정 종가', app)
        self.assertIn('지연 자료', app)

    def test_장중_현재가와_판단_입력은_공식_경로를_읽지_않는다(self):
        for name in ('update_prices.py', 'compute_indicators.py', 'analyze_auto.py', 'update_price_history.py',
                     'collect_analyst_data.py', 'decision_records.py', 'compute_team_weights.py'):
            with open(os.path.join(HERE, name), encoding='utf-8') as handle:
                src = handle.read()
            for token in ('official_prices', 'OFFICIAL_PRICE_HISTORY', 'fsc_daily', 'fsc_stock_price'):
                self.assertNotIn(token, src, f'{name} 이 {token} 을 읽는다 — 이번 범위 밖')

    def test_채점_게이트는_공식_가격자료만으로_자동_통과되지_않는다(self):
        self.assertNotIn('apis.data.go.kr', comparison_evidence.OFFICIAL_HOSTS)
        self.assertNotIn('data.go.kr', ' '.join(comparison_evidence.OFFICIAL_HOSTS))
        with open(os.path.join(HERE, 'comparison_evidence.py'), encoding='utf-8') as handle:
            src = handle.read()
        self.assertIn("proof.get('source')!='KRX'", src)               # 조건은 그대로 — 공급자 이름을 KRX 로 위장하지 않는다
        self.assertNotIn('FSC_PUBLIC_DATA_PORTAL', src)


class WorkflowsAndCompliance(unittest.TestCase):
    def _read(self, rel):
        with open(os.path.join(HERE, rel), encoding='utf-8') as handle:
            return handle.read()

    def test_검증_워크플로는_dispatch_전용이고_게이트_스텝이_먼저다(self):
        wf = self._read('.github/workflows/fsc-daily-price-verify.yml')
        on_block = wf[wf.index('\non:\n'):wf.index('\npermissions:')]
        self.assertIn('workflow_dispatch', on_block)
        self.assertNotIn('push:', on_block)
        self.assertNotIn('schedule:', on_block)
        self.assertIn('legal_source_gate.py --require fsc_public_data:automatedCollection', wf)
        self.assertLess(wf.index('legal_source_gate.py --require'), wf.index('fsc_daily_collect'))
        self.assertIn("github.ref != 'refs/heads/main'", wf)
        self.assertNotIn('[skip ci]', wf)
        self.assertNotIn('echo "$DATA_GO_KR_SERVICE_KEY', wf)

    def test_ops_daily_는_기존_발화에서_하루_1회_if_due_로_받고_허용_경로에_저장소가_있다(self):
        wf = self._read('.github/workflows/ops-daily.yml')
        self.assertEqual(wf.count('- cron:'), 3)                      # 새 schedule 0
        self.assertIn('fsc_daily_collect --if-due --max-requests 6', wf)
        self.assertIn('legal_source_gate.py --require fsc_public_data:automatedCollection', wf)
        self.assertIn('official_prices/*|official_price_history.js', wf)
        # 2026-09-18 수리: official_prices/ 는 서비스키 승인 전까지 없을 수 있다. 그 이유로 git add 가 죽어
        # 기존 점검 기록까지 저장되지 못했다(run 35350908284). 이제 선택 경로로 분리돼 있어야 한다.
        self.assertIn('OPTIONAL="official_prices official_price_history.js"', wf)
        self.assertIn('REQUIRED="docs/audits/validation_runs docs/VALIDATION_SCHEDULE.md docs/operations/repair_requests"', wf)
        self.assertIn('git add -A -- $ADD', wf)
        self.assertNotIn('git add -A -- docs/audits/validation_runs docs/VALIDATION_SCHEDULE.md '
                         'docs/operations/repair_requests official_prices official_price_history.js', wf)

    def test_Pages_제외와_준법_범위(self):
        self.assertIn('- official_prices/', self._read('_config.yml'))
        cfg = compliance.load()
        prov = cfg['providers']['fsc_public_data']
        self.assertEqual(prov['verdict'], 'APPROVED_WITH_CONDITIONS')
        self.assertEqual(prov['scope']['datasetIds'], ['15094808'])
        self.assertEqual(prov['scope']['operations'], ['getStockPriceInfo'])
        self.assertIn('EGRESS_BLOCKED', prov['checkMethod'])
        self.assertIn('official_prices/fsc_15094808/', prov['rawStoragePaths'])
        self.assertIn('official_prices/', cfg['publicExposure']['pagesExcludeRequired'])
        # 다른 출처로 확대하지 않았다
        self.assertEqual(cfg['providers']['krx_openapi']['gates']['commercialUse'], 'PROHIBITED')
        self.assertEqual(cfg['providers']['kind']['verdict'], 'PERMISSION_NOT_VERIFIED')
        self.assertEqual(cfg['providers']['naver_finance']['verdict'], 'PERMISSION_NOT_VERIFIED')
        blob = json.dumps(prov, ensure_ascii=False)
        for phrase in compliance.forbidden_phrases(cfg):
            self.assertNotIn(phrase, blob)
        self.assertIn('data_supply/fsc_daily_collect.py', prov['endpoints'][0]['files'])

    def test_준법_검사기_통과(self):
        import legal_source_gate as gate
        self.assertEqual([str(f) for f in gate.run_all(HERE)], [])

    def test_검사는_묶음에_등록돼_있다(self):
        import gaeo_check
        self.assertIn('test_fsc_daily_price.py', gaeo_check.GROUPS['pipeline'])


if __name__ == '__main__':
    unittest.main()
