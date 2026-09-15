# -*- coding: utf-8 -*-
"""가격 출처 원장 계약 — §11의 최소 18개 시험.

이 검사가 지키는 한 줄: **"이 판단이 어떤 가격을 언제 받아 썼는지"를 지어내지 않는다.**
확인하지 못한 것은 확인 불가로 남고, 어긋나면 연결을 거부한다.
"""
import contextlib
import copy
import datetime as dt
import glob
import hashlib
import io
import json
import os
import random
import tempfile
import threading
import time
import unittest
from unittest.mock import patch

import comparison_evidence as ce
import decision_records as dr
import price_provenance as pp
import update_prices as up

HERE = os.path.dirname(os.path.abspath(__file__))
KST = dt.timezone(dt.timedelta(hours=9))


def summary(now=71000, **extra):
    """네이버 itemSummary 응답의 모양(실제로 쓰는 필드만). 기준시각 필드는 원래 없다."""
    row = {'now': now, 'rate': 1.25, 'per': 13.4, 'pbr': 1.12,
           'eps': 5300, 'marketSum': 4230000, 'nm': '표본종목'}
    row.update(extra)
    return row


def integration():
    return {'totalInfos': [{'code': 'bps', 'value': '55,000'},
                           {'code': 'dividendYieldRatio', 'value': '2.10%'},
                           {'code': 'lowPriceOf52Weeks', 'value': '50,000'},
                           {'code': 'highPriceOf52Weeks', 'value': '90,000'}]}


def workspace(tmp, codes, old_stocks=None):
    """임시 폴더에 tickers.js(+선택적으로 이전 data.js)를 만든다."""
    rows = [{'code': code, 'name': f'종목{code}', 'sector': '시험'} for code in codes]
    with open(os.path.join(tmp, 'tickers.js'), 'w', encoding='utf-8') as fh:
        fh.write('const TICKERS = ' + json.dumps(rows, ensure_ascii=False) + ';\n')
    if old_stocks is not None:
        write_data_js(tmp, {'date': '2026-09-14 종가 (16:04 수집)',
                            'indices': {}, 'stocks': old_stocks})
    return tmp


def write_data_js(tmp, data):
    with open(os.path.join(tmp, 'data.js'), 'w', encoding='utf-8') as fh:
        fh.write('const LIVE_DATA = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')


def read_data_js(tmp):
    import re
    text = re.sub(r'^\s*//.*$', '', open(os.path.join(tmp, 'data.js'), encoding='utf-8').read(), flags=re.M)
    return json.loads(re.search(r'const\s+LIVE_DATA\s*=\s*(\{.*\})\s*;', text, re.S).group(1))


def fake_get(responses, delays=None, failures=(), detail_delays=None):
    """저장된 응답으로 네이버 호출을 대신한다. 시세 API를 실제로 부르지 않는다."""
    def _get(url, referer='', tries=3):
        import re
        if '/api/index/' in url:
            return {'closePrice': '3,100.00', 'compareToPreviousClosePrice': '10.00',
                    'fluctuationsRatio': '0.32'}
        code = (re.search(r'itemcode=(\d+)', url) or re.search(r'/stock/(\d+)/', url)).group(1)
        if 'itemSummary' in url:
            if delays:
                time.sleep(delays.get(code, 0))
            if code in failures:
                raise OSError(f'시세 실패 {code}')
            return copy.deepcopy(responses[code])
        if detail_delays:
            time.sleep(detail_delays.get(code, 0))
        if code in (failures or ()) or f'{code}:detail' in failures:
            raise OSError(f'상세 실패 {code}')
        return integration()
    return _get


def run_collector(tmp, responses, delays=None, failures=(), detail_delays=None, clock=None):
    """`clock` 을 주면 그 회차의 관측시각을 고정한다 — 두 회차가 같은 초에 끝나도
    '이전 값에 새 시각을 붙였는지'를 확실히 구분할 수 있다."""
    stack = contextlib.ExitStack()
    stack.enter_context(patch.object(up, 'get', fake_get(responses, delays, failures, detail_delays)))
    stack.enter_context(patch.object(
        up, 'get_html', lambda *a, **k: (_ for _ in ()).throw(OSError('환율 생략'))))
    stack.enter_context(contextlib.redirect_stdout(io.StringIO()))  # 수집기 진행 출력 숨김
    if clock:
        stack.enter_context(patch.object(pp, 'now_utc', lambda: clock))
    with stack:
        up.main(tmp)
    return pp.load_round(tmp)


def kst_minute(stamp, plus=1):
    """수집 시각(UTC)을 판단시각 표기(KST 'YYYY-MM-DD HH:MM')로 바꾼다."""
    moment = dt.datetime.fromisoformat(stamp).astimezone(KST) + dt.timedelta(minutes=plus)
    return moment.strftime('%Y-%m-%d %H:%M')


def auto_payload(doc, prices, at=None):
    """수집한 회차를 그대로 읽은 자동분석 산출물(auto_analysis.js) 모양."""
    at = at or kst_minute((doc or {}).get('collectorFinishedAt') or pp.now_utc())
    return {'generatedAt': at, 'coverageUniverseVersion': 'coverage-test',
            'priceLabel': (doc or {}).get('collectorLabel'),
            'priceSnapshotId': (doc or {}).get('snapshotId'),
            'priceProvenanceState': pp.ROUND_OK if doc else pp.ROUND_UNAVAILABLE,
            'stocks': {code: {'tier': 'auto', 'updated': at, 'base': price,
                              'baseAt': (doc or {}).get('collectorLabel'),
                              'chief': {'call': 'HOLD', 'total': 61,
                                        'baseModelVersion': 'model-t',
                                        'reason': '시험용 실제 판단 근거'},
                              'taro': {'score': 60, 'stance': 'flat'}}
                       for code, price in prices.items()}}


class Producer(unittest.TestCase):
    """실제 수집 흐름에서 출처 기록이 만들어지는가."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.dir = self.tmp.name

    # 1) 정상 응답 → 출처 기록 생성
    def test_1_정상_응답이면_종목별_출처가_생긴다(self):
        workspace(self.dir, ['005930', '000660'])
        doc = run_collector(self.dir, {'005930': summary(71000), '000660': summary(182000)})
        self.assertEqual(doc['schemaVersion'], pp.SCHEMA_VERSION)
        self.assertEqual(doc['provider'], 'NAVER_FINANCE')      # KRX 라고 쓰지 않는다
        self.assertEqual(doc['priceField'], 'now')
        self.assertEqual(sorted(doc['stocks']), ['000660', '005930'])
        for code, price in (('005930', 71000), ('000660', 182000)):
            row = doc['stocks'][code]
            self.assertEqual(row['state'], pp.FRESH)
            self.assertEqual(row['price'], price)
            self.assertTrue(row['receivedAt'].endswith('+00:00'))
            self.assertTrue(row['excerptHash'])
        self.assertEqual(doc['snapshotId'], pp.snapshot_id(read_data_js(self.dir)['stocks']))
        self.assertEqual(pp.counts(doc)['fresh'], 2)

    # 2) 병렬 완료 순서가 달라도 종목이 섞이지 않는다
    def test_2_완료_순서가_뒤섞여도_종목_가격_시각이_제_짝을_찾는다(self):
        codes = [f'00000{i}' for i in range(1, 9)]
        workspace(self.dir, codes)
        prices = {code: 10000 + int(code) * 7 for code in codes}
        delays = {code: random.uniform(0, 0.08) for code in codes}
        doc = run_collector(self.dir, {c: summary(prices[c]) for c in codes}, delays)
        live = read_data_js(self.dir)['stocks']
        for code in codes:
            self.assertEqual(doc['stocks'][code]['price'], prices[code])
            self.assertEqual(live[code]['price'], prices[code])
        hashes = {doc['stocks'][c]['excerptHash'] for c in codes}
        self.assertEqual(len(hashes), len(codes))   # 종목마다 다른 응답 → 다른 hash

    # 3) 가격은 성공했는데 상세지표만 실패
    def test_3_상세지표만_실패해도_가격_관측시각은_가격_응답_시각이다(self):
        workspace(self.dir, ['005930'])
        doc = run_collector(self.dir, {'005930': summary(71000)},
                            delays={'005930': 0.0}, failures=('005930:detail',))
        row = doc['stocks']['005930']
        self.assertEqual(row['state'], pp.FRESH)
        self.assertIs(row['detailMetricsOk'], False)
        self.assertEqual(row['price'], 71000)
        self.assertTrue(row['receivedAt'])
        self.assertEqual(pp.counts(doc)['detailMetricsFailed'], 1)
        self.assertEqual(pp.counts(doc)['fresh'], 1)

    def test_3b_상세지표가_늦게_끝나도_가격_시각을_그쪽으로_옮기지_않는다(self):
        workspace(self.dir, ['005930'])
        # 상세지표 요청만 1.4초 늦게 끝난다. 시각은 초 단위라 1초를 넘겨야 차이가 보인다.
        doc = run_collector(self.dir, {'005930': summary(71000)},
                            detail_delays={'005930': 1.4})
        received = dt.datetime.fromisoformat(doc['stocks']['005930']['receivedAt'])
        finished = dt.datetime.fromisoformat(doc['collectorFinishedAt'])
        # 가격 응답 → (늦은) 상세지표 → 회차 종료. 가격 시각이 종료시각으로 밀리면 안 된다.
        self.assertLess(received, finished)
        self.assertGreaterEqual((finished - received).total_seconds(), 1)

    # 4) 가격 요청 실패 → 이전 값 유지
    def test_4_가격이_실패하면_이전_값에_새_관측시각을_붙이지_않는다(self):
        workspace(self.dir, ['005930', '000660'])
        first = run_collector(self.dir, {'005930': summary(71000), '000660': summary(182000)},
                              clock='2026-09-15T04:30:00+00:00')
        원래시각 = first['stocks']['005930']['receivedAt']
        self.assertEqual(원래시각, '2026-09-15T04:30:00+00:00')
        # 두 번째 회차의 시계는 확실히 다르게 둔다. 이전 값에 새 시각이 붙으면 바로 드러난다.
        second = run_collector(self.dir, {'005930': summary(71000), '000660': summary(183000)},
                               failures=('005930',), clock='2026-09-15T04:40:00+00:00')
        row = second['stocks']['005930']
        self.assertEqual(row['state'], pp.REUSED_PREVIOUS)
        self.assertEqual(row['receivedAt'], 원래시각)          # ← 새 시각을 붙이지 않았다
        self.assertNotEqual(row['receivedAt'], '2026-09-15T04:40:00+00:00')
        self.assertEqual(second['stocks']['000660']['receivedAt'], '2026-09-15T04:40:00+00:00')
        # 이번 회차에 상세지표를 '요청해서 실패'한 게 아니라 '아예 요청하지 않았다'.
        self.assertIsNone(row['detailMetricsOk'])
        self.assertIs(second['stocks']['000660']['detailMetricsOk'], True)
        self.assertEqual(pp.counts(second)['detailMetricsFailed'], 0)
        self.assertEqual(row['reusedFromRoundId'], first['roundId'])
        self.assertTrue(read_data_js(self.dir)['stocks']['005930']['stale'])
        self.assertEqual(pp.counts(second)['reusedPrevious'], 1)

    def test_4b_신규_수집이_0건이면_data_js도_출처도_건드리지_않는다(self):
        workspace(self.dir, ['005930'], old_stocks={'005930': {'name': '옛값', 'price': 70000}})
        전 = open(os.path.join(self.dir, 'data.js'), encoding='utf-8').read()
        with self.assertRaises(SystemExit):
            run_collector(self.dir, {'005930': summary(71000)}, failures=('005930',))
        self.assertEqual(open(os.path.join(self.dir, 'data.js'), encoding='utf-8').read(), 전)
        self.assertFalse(os.path.exists(pp.path_for(self.dir)))
        self.assertIsNone(pp.load_round(self.dir))

    def test_4c_일부만_실패하면_실패분은_출처_확인_불가로_표시된다(self):
        workspace(self.dir, ['005930', '000660'],
                  old_stocks={'005930': {'name': '옛값', 'price': 70000}})
        doc = run_collector(self.dir, {'005930': summary(71000), '000660': summary(182000)},
                            failures=('005930',))
        row = doc['stocks']['005930']
        self.assertEqual(row['state'], pp.REUSED_PREVIOUS_UNVERIFIED)
        self.assertIsNone(row['receivedAt'])
        self.assertEqual(row['reason'], 'previous_price_provenance_missing')
        self.assertEqual(pp.counts(doc)['unverified'], 1)

    # 5) 공급자가 과거 기준일 값을 돌려줬을 때
    def test_5_HTTP는_성공했지만_기준일을_모르면_오늘_값이라고_주장하지_않는다(self):
        workspace(self.dir, ['005930'])
        doc = run_collector(self.dir, {'005930': summary(71000)})
        row = doc['stocks']['005930']
        self.assertIsNone(row['sourceSessionDate'])
        self.assertEqual(row['sourceSessionDateState'], pp.SOURCE_AS_OF_MISSING)
        self.assertIn('공급자가 준 기준시각이 아니다', doc['collectorLabelNote'])
        self.assertNotEqual(row['receivedAt'][:10], row['sourceSessionDate'] or '')

    def test_5b_공급자가_기준일을_주면_그대로_적고_오늘로_바꾸지_않는다(self):
        workspace(self.dir, ['005930'])
        doc = run_collector(self.dir, {'005930': summary(71000, tradeDate='2026-09-11')})
        row = doc['stocks']['005930']
        self.assertEqual(row['sourceAsOf'], '2026-09-11')
        self.assertEqual(row['sourceAsOfState'], pp.SOURCE_AS_OF_PROVIDED)
        self.assertNotEqual(row['sourceAsOf'], row['receivedAt'][:10])

    # 6) 공급자 시각이 없는 응답
    def test_6_기준시각_필드가_없으면_확인_불가로_남기고_수신시각으로_대체하지_않는다(self):
        row = pp.observe(71000, summary(71000), '2026-09-15T05:30:12+00:00', True)
        self.assertIsNone(row['sourceAsOf'])
        self.assertEqual(row['sourceAsOfState'], pp.SOURCE_AS_OF_MISSING)
        self.assertEqual(row['receivedAt'], '2026-09-15T05:30:12+00:00')
        self.assertNotEqual(row['sourceAsOf'], row['receivedAt'])


class Linking(unittest.TestCase):
    """판단에 붙일 때의 거부 조건."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.dir = self.tmp.name
        workspace(self.dir, ['005930', '000660'])
        self.doc = run_collector(self.dir, {'005930': summary(71000), '000660': summary(182000)})

    # 7) 같은 가격이 다른 날짜(다른 회차)에 등장
    def test_7_같은_가격_숫자라는_이유만으로_다른_회차_출처를_붙이지_않는다(self):
        second = run_collector(self.dir, {'005930': summary(71000), '000660': summary(190000)})
        self.assertNotEqual(second['snapshotId'], self.doc['snapshotId'])
        self.assertEqual(second['stocks']['005930']['price'],
                         self.doc['stocks']['005930']['price'])
        linked, gap = pp.link(second, self.doc['snapshotId'], '005930', 71000)
        self.assertIsNone(linked)
        self.assertEqual(gap, 'provenance_round_superseded')

    # 8) 시세 스냅샷과 출처의 회차 불일치
    def test_8_시세_스냅샷과_출처가_다른_입력이면_머리말이_확인_불가가_된다(self):
        ok = pp.header(self.doc, read_data_js(self.dir)['stocks'])
        self.assertEqual(ok['state'], pp.ROUND_OK)
        바뀐시세 = dict(read_data_js(self.dir)['stocks'])
        바뀐시세['005930'] = dict(바뀐시세['005930'], price=71500)
        bad = pp.header(self.doc, 바뀐시세)
        self.assertEqual(bad['state'], pp.ROUND_UNAVAILABLE)
        self.assertEqual(bad['reason'], 'price_snapshot_mismatch')

    # 9) hash·종목·가격 불일치
    def test_9a_출처_파일이_저장_뒤_고쳐졌으면_hash가_어긋나_읽지_않는다(self):
        self.assertEqual(self.doc['roundId'], pp.round_id(self.doc))
        상한것 = json.loads(open(pp.path_for(self.dir), encoding='utf-8').read())
        상한것['stocks']['005930']['price'] = 99999      # 값만 슬쩍 바꿔치기
        json.dump(상한것, open(pp.path_for(self.dir), 'w', encoding='utf-8'), ensure_ascii=False)
        self.assertIsNone(pp.load_round(self.dir))       # ← 고쳐서 쓰지 않는다
        payload = auto_payload(self.doc, {'005930': 71000})
        record = dr.make_record('005930', payload['stocks']['005930'], payload,
                                pp.now_utc(),
                                provenance=pp.load_round(self.dir))
        self.assertIsNone(record['priceObservedAt'])
        self.assertEqual(record['priceProvenance']['reason'], 'provenance_file_missing')

    def test_9_종목이나_가격이_어긋나면_연결을_거부한다(self):
        snap = self.doc['snapshotId']
        self.assertEqual(pp.link(self.doc, snap, '999999', 71000)[1], 'ticker_not_in_provenance')
        self.assertEqual(pp.link(self.doc, snap, '005930', 71500)[1], 'price_value_mismatch')
        self.assertEqual(pp.link(self.doc, None, '005930', 71000)[1], 'analysis_snapshot_id_missing')
        linked, gap = pp.link(self.doc, snap, '005930', 71000)
        self.assertIsNone(gap)
        self.assertTrue(linked['linked'])
        self.assertEqual(linked['excerptHash'], self.doc['stocks']['005930']['excerptHash'])

    # 10) 수신시각이 판단시각보다 뒤인 부적격 연결
    def test_10_판단보다_나중에_받은_가격은_그_판단의_근거가_될_수_없다(self):
        늦은회차 = copy.deepcopy(self.doc)
        늦은회차['stocks']['005930']['receivedAt'] = '2026-09-15T23:59:00+00:00'
        payload = auto_payload(늦은회차, {'005930': 71000})
        record = dr.make_record('005930', payload['stocks']['005930'], payload,
                                pp.now_utc(), provenance=늦은회차)
        self.assertIsNone(record['priceObservedAt'])
        self.assertIs(record['priceProvenance']['linked'], False)
        self.assertEqual(record['priceProvenance']['reason'], 'price_observed_after_decision')

    # 11) UTC/KST 자정 경계·정밀도
    def test_11_시각은_UTC_초정밀도로_적고_KST_자정을_넘겨도_뒤바뀌지_않는다(self):
        자정직후 = copy.deepcopy(self.doc)
        # 2026-09-15T15:30:00Z = KST 2026-09-16 00:30 → 판단일(9/16)보다 앞이다.
        자정직후['stocks']['005930']['receivedAt'] = '2026-09-15T15:30:00+00:00'
        payload = auto_payload(자정직후, {'005930': 71000}, at='2026-09-16 09:05')
        record = dr.make_record('005930', payload['stocks']['005930'], payload,
                                '2026-09-16T01:00:00+00:00', provenance=자정직후)
        self.assertEqual(record['priceObservedAt'], '2026-09-15T15:30:00+00:00')
        관측 = dr._moment(record['priceObservedAt']).astimezone(dr.KST)
        self.assertEqual(관측.date().isoformat(), '2026-09-16')
        self.assertEqual(self.doc['timeZone'], 'UTC')
        self.assertEqual(self.doc['timePrecision'], 'second')
        # 같은 순간을 KST 로 적어도 같은 판정이어야 한다(표기만 다른 것을 다른 시각으로 보지 않는다).
        KST표기 = copy.deepcopy(자정직후)
        KST표기['stocks']['005930']['receivedAt'] = '2026-09-16T00:30:00+09:00'
        같은판정 = dr.make_record('005930', payload['stocks']['005930'],
                              auto_payload(KST표기, {'005930': 71000}, at='2026-09-16 09:05'),
                              '2026-09-16T01:00:00+00:00', provenance=KST표기)
        self.assertEqual(dr._moment(같은판정['priceObservedAt']), dr._moment(record['priceObservedAt']))
        # 초 아래를 임의로 버리거나 판단시각을 앞당기지 않는다.
        self.assertEqual(len('2026-09-15T15:30:00+00:00'), len(record['priceObservedAt']))

    # 12) 출처 파일 누락·손상
    def test_12_출처_파일이_없거나_깨져도_읽기가_예외를_던지지_않는다(self):
        빈폴더 = tempfile.mkdtemp()
        self.assertIsNone(pp.load_round(빈폴더))
        self.assertEqual(pp.header(None)['reason'], 'provenance_file_missing')
        open(os.path.join(빈폴더, pp.FILE_NAME), 'w', encoding='utf-8').write('{깨진')
        self.assertIsNone(pp.load_round(빈폴더))
        json.dump({'schemaVersion': 'price_provenance_v999'},
                  open(os.path.join(빈폴더, pp.FILE_NAME), 'w', encoding='utf-8'))
        self.assertIsNone(pp.load_round(빈폴더))

    # 13) 부분 저장·동시 처리·재실행
    def test_13a_같은_입력이면_회차_식별자가_같다(self):
        관측 = {'005930': pp.observe(71000, summary(71000), '2026-09-15T05:30:12+00:00', True)}
        쓰인시세 = {'005930': {'price': 71000}}
        a = pp.build_round(쓰인시세, copy.deepcopy(관측), 'L', 'S', 'F', ('now',))
        b = pp.build_round(쓰인시세, copy.deepcopy(관측), 'L', 'S', 'F', ('now',))
        self.assertEqual(a['roundId'], b['roundId'])
        self.assertEqual(a, b)

    def test_13b_되읽기가_어긋나면_저장하지_않고_이전_파일이_그대로_남는다(self):
        before = open(pp.path_for(self.dir), encoding='utf-8').read()
        # 쓴 내용과 되읽은 내용이 달라지는 값(NaN)을 넣어 '부분 저장'을 재현한다.
        with self.assertRaises(pp.ProvenanceError):
            pp.save_round(self.dir, {'schemaVersion': pp.SCHEMA_VERSION, 'x': float('nan')})
        self.assertEqual(open(pp.path_for(self.dir), encoding='utf-8').read(), before)
        self.assertFalse(glob.glob(os.path.join(self.dir, '*.tmp')))

    def test_13e_쓰기_자체가_실패해도_이전_파일이_그대로_남는다(self):
        before = open(pp.path_for(self.dir), encoding='utf-8').read()
        with patch('builtins.open', side_effect=OSError('디스크 오류')), \
             self.assertRaises(OSError):
            pp.save_round(self.dir, pp.load_round(self.dir))
        self.assertEqual(open(pp.path_for(self.dir), encoding='utf-8').read(), before)

    def test_13c_같은_회차를_다시_저장해도_내용이_같으면_같은_파일이다(self):
        doc = pp.load_round(self.dir)
        pp.save_round(self.dir, doc)
        self.assertEqual(pp.load_round(self.dir), doc)

    def test_13d_여러_스레드가_동시에_읽어도_같은_회차를_본다(self):
        본것 = []
        def 읽기():
            본것.append((pp.load_round(self.dir) or {}).get('roundId'))
        실 = [threading.Thread(target=읽기) for _ in range(8)]
        [t.start() for t in 실]; [t.join() for t in 실]
        self.assertEqual(set(본것), {self.doc['roundId']})


class Ledger(unittest.TestCase):
    """봉인 원장까지 실제로 이어지는가."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.dir = self.tmp.name
        self.root = os.path.join(self.dir, 'decisions')
        workspace(self.dir, ['005930', '000660'])
        self.doc = run_collector(self.dir, {'005930': summary(71000), '000660': summary(182000)})
        self.payload = auto_payload(self.doc, {'005930': 71000, '000660': 182000})

    def rows(self):
        return dr.capture(self.payload, self.root, provenance_dir=self.dir)

    def test_신규_판단에_실제로_붙는다(self):
        saved = {r['code']: r for r in self.rows()}
        for code in ('005930', '000660'):
            row = saved[code]
            self.assertEqual(row['priceObservedAt'], self.doc['stocks'][code]['receivedAt'])
            self.assertTrue(row['priceProvenance']['linked'])
            self.assertEqual(row['priceProvenance']['provider'], 'NAVER_FINANCE')
            self.assertEqual(row['priceProvenance']['roundId'], self.doc['roundId'])
            self.assertEqual(row['priceProvenance']['snapshotId'], self.doc['snapshotId'])
            self.assertIs(row['priceProvenance']['officialPriceProof'], False)

    # 14) 압축·되읽기 뒤에도 보존
    def test_14_압축하고_다시_읽어도_출처가_그대로다(self):
        saved = self.rows()
        again = {r['recordId']: r for r in dr.read_records(self.root)}
        self.assertTrue(again)
        for row in saved:
            self.assertEqual(again[row['recordId']]['priceProvenance'], row['priceProvenance'])
            self.assertEqual(again[row['recordId']]['priceObservedAt'], row['priceObservedAt'])

    # 15) 과거 원본 바이트 불변
    def test_15_이미_봉인된_과거_원본은_한_바이트도_바뀌지_않는다(self):
        def 지문():
            return {path: hashlib.sha256(open(path, 'rb').read()).hexdigest()
                    for path in sorted(glob.glob(os.path.join(
                        HERE, 'research_archive', 'decisions', 'originals', '**', '*'),
                        recursive=True)) if os.path.isfile(path)}
        before = 지문()
        self.assertTrue(before, '검사할 과거 원본이 있어야 한다')
        self.rows()
        dr.read_records(self.root)
        self.assertEqual(지문(), before)

    def test_15b_과거_기록의_빈_관측시각을_소급해서_채우지_않는다(self):
        옛기록 = [json.loads(line) for path in sorted(glob.glob(os.path.join(
            HERE, 'research_archive', 'decisions', 'originals', '2026', '09', '11', '*.jsonl.gz')))
            for line in __import__('gzip').open(path, 'rt', encoding='utf-8')]
        self.assertTrue(옛기록)
        self.assertTrue(all(r.get('priceObservedAt') is None for r in 옛기록))
        self.assertTrue(all('priceProvenance' not in r for r in 옛기록))

    # 16) 같은 입력이면 판단 결과가 그대로
    def test_16_출처를_붙여도_판단_숫자와_사유는_달라지지_않는다(self):
        판단필드 = ('call', 'total', 'confidence', 'reason', 'rawTotal', 'riskPenalty',
                 'modelVersion', 'componentVersions', 'scoringVersion', 'components',
                 'judgmentWithheld', 'available', 'base', 'baseAt', 'date', 'decisionAt',
                 'recordId', 'priceBasis')
        without = dr.make_record('005930', self.payload['stocks']['005930'], self.payload,
                                 'now', provenance=None)
        with_prov = dr.make_record('005930', self.payload['stocks']['005930'], self.payload,
                                   'now', provenance=self.doc)
        for key in 판단필드:
            self.assertEqual(without.get(key), with_prov.get(key), key)
        self.assertEqual(set(with_prov) - set(without), set())
        self.assertIsNone(without['priceObservedAt'])
        self.assertIsNotNone(with_prov['priceObservedAt'])
        # priceBasis 는 출처가 붙어도 '미검증' 그대로다.
        self.assertIs(with_prov['priceBasis']['verified'], False)

    # 17) data.js 공개 구조·소비 경로 불변
    def test_17_data_js_공개_구조는_그대로고_출처는_별도_파일이다(self):
        self.assertEqual(sorted(read_data_js(self.dir)),
                         ['date', 'indices', 'marketBrief', 'stocks'])
        종목칸 = sorted(read_data_js(self.dir)['stocks']['005930'])
        self.assertEqual(종목칸, ['cap', 'div', 'eps', 'name', 'pbr', 'per', 'price',
                                'rate', 'roe', 'stale', 'w52'])
        self.assertTrue(os.path.exists(os.path.join(self.dir, pp.FILE_NAME)))
        # 실제 저장소의 data.js 도 같은 계약이어야 한다(소비 경로가 바뀌지 않았다).
        import compute_indicators
        live = compute_indicators.load_js_object(os.path.join(HERE, 'data.js'), 'LIVE_DATA')
        self.assertIn('date', live)
        self.assertIn('stocks', live)
        self.assertNotIn('priceProvenance', live)
        self.assertNotIn('receivedAt', json.dumps(list(live['stocks'].values())[0]))

    # 18) 출처 기록만으로 공식 가격증명을 통과시키지 않는다
    def test_18_출처_기록이_있어도_공식_가격증명은_통과하지_않는다(self):
        row = {r['code']: r for r in self.rows()}['005930']
        self.assertTrue(row['priceProvenance']['linked'])
        self.assertTrue(row['priceObservedAt'])
        verdict = ce.assess(row, None, None, now='2026-09-22T08:00:00+00:00', price_proof=None)
        self.assertNotEqual(verdict.get('state'), 'comparable')
        self.assertIn(verdict.get('reason'),
                      ('price_basis_unverified', 'corporate_action_unverified',
                       'price_evidence_invalid', 'comparison_window_not_final'))
        # 출처 기록을 가격증명 문서로 위장해 내밀어도 통과하지 않는다.
        위장 = dict(row['priceProvenance'], source='KRX', observedAt=row['priceObservedAt'])
        가짜 = ce.assess(row, None, None, now='2026-09-22T08:00:00+00:00', price_proof=위장)
        self.assertNotEqual(가짜.get('state'), 'comparable')

    def test_출처가_없어도_공개_판단_저장은_멈추지_않는다(self):
        빈payload = auto_payload(None, {'005930': 71000})
        saved = dr.capture(빈payload, self.root, provenance_dir=self.dir)
        self.assertEqual(len(saved), 1)
        self.assertIsNone(saved[0]['priceObservedAt'])
        self.assertIs(saved[0]['priceProvenance']['linked'], False)
        self.assertEqual(saved[0]['priceProvenance']['reason'], 'analysis_snapshot_id_missing')

    def test_같은_회차를_다른_출처로_다시_봉인하려_하면_거부한다(self):
        """봉인된 사실은 바뀌지 않는다. 그 사이 회차가 넘어갔으면 조용히 덮지 않고 막는다."""
        self.rows()
        run_collector(self.dir, {'005930': summary(71500), '000660': summary(182000)})
        with self.assertRaises(dr.IntegrityError):
            dr.capture(self.payload, self.root, provenance_dir=self.dir)

    def test_출처_파일이_사라져도_판단_저장은_계속된다(self):
        os.remove(pp.path_for(self.dir))
        saved = dr.capture(self.payload, self.root, provenance_dir=self.dir)
        self.assertEqual(len(saved), 2)
        self.assertIsNone(saved[0]['priceObservedAt'])
        self.assertEqual(saved[0]['priceProvenance']['reason'], 'provenance_file_missing')


class WorkflowWiring(unittest.TestCase):
    """시세와 출처가 러너에서 갈라지지 않는가 — 여기서 갈라지면 기능이 조용히 죽는다."""

    PRICES = os.path.join(HERE, '.github', 'workflows', 'update-prices.yml')
    ANALYSIS = os.path.join(HERE, '.github', 'workflows', 'update-analysis.yml')
    CHAIN = os.path.join(HERE, '.github', 'scripts', 'gaeo-chain.sh')

    def test_data_js를_원격에서_되돌리는_곳은_출처도_함께_되돌린다(self):
        for path in (self.PRICES, self.ANALYSIS):
            text = open(path, encoding='utf-8').read()
            for line in text.split('\n'):
                if 'git checkout' in line and 'data.js' in line and '${{' in line:
                    self.fail(f'{os.path.basename(path)}: data.js만 따로 되돌린다 — {line.strip()}')
            self.assertIn('sync_inputs', text, os.path.basename(path))

    def test_수집기가_출처_파일도_커밋한다(self):
        text = open(self.PRICES, encoding='utf-8').read()
        self.assertIn('git add price_provenance.json', text)

    def test_sync_inputs가_실제로_두_파일을_함께_되돌린다(self):
        import subprocess
        tmp = tempfile.mkdtemp()
        origin, work = os.path.join(tmp, 'origin'), os.path.join(tmp, 'work')
        def git(cwd, *args):
            return subprocess.run(('git',) + args, cwd=cwd, capture_output=True, text=True)
        os.makedirs(origin)
        git(origin, 'init', '-q', '-b', 'main')
        git(origin, 'config', 'user.email', 't@t'); git(origin, 'config', 'user.name', 't')
        for name, body in (('data.js', '원격판'), ('price_provenance.json', '{"원격": true}')):
            open(os.path.join(origin, name), 'w', encoding='utf-8').write(body)
        git(origin, 'add', '-A'); git(origin, 'commit', '-qm', 'seed')
        git(tmp, 'clone', '-q', origin, work)
        for name in ('data.js', 'price_provenance.json'):
            open(os.path.join(work, name), 'w', encoding='utf-8').write('로컬이_낡음')
        env = dict(os.environ, GITHUB_REF_NAME='main')
        r = subprocess.run(['bash', '-c', f'. "{self.CHAIN}"; sync_inputs data.js price_provenance.json'],
                           cwd=work, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(open(os.path.join(work, 'data.js'), encoding='utf-8').read(), '원격판')
        self.assertEqual(open(os.path.join(work, 'price_provenance.json'), encoding='utf-8').read(),
                         '{"원격": true}')

    def test_출처_파일이_아직_원격에_없어도_시세는_되돌아온다(self):
        """첫 배포 때 — 한 번에 여러 경로를 주면 없는 파일 하나가 전부를 실패시킨다."""
        import subprocess
        tmp = tempfile.mkdtemp()
        origin, work = os.path.join(tmp, 'origin'), os.path.join(tmp, 'work')
        def git(cwd, *args):
            return subprocess.run(('git',) + args, cwd=cwd, capture_output=True, text=True)
        os.makedirs(origin)
        git(origin, 'init', '-q', '-b', 'main')
        git(origin, 'config', 'user.email', 't@t'); git(origin, 'config', 'user.name', 't')
        open(os.path.join(origin, 'data.js'), 'w', encoding='utf-8').write('원격판')
        git(origin, 'add', '-A'); git(origin, 'commit', '-qm', 'seed')
        git(tmp, 'clone', '-q', origin, work)
        open(os.path.join(work, 'data.js'), 'w', encoding='utf-8').write('로컬이_낡음')
        env = dict(os.environ, GITHUB_REF_NAME='main')
        r = subprocess.run(['bash', '-c', f'. "{self.CHAIN}"; sync_inputs data.js price_provenance.json'],
                           cwd=work, capture_output=True, text=True, env=env)
        self.assertEqual(r.returncode, 0, r.stderr)
        self.assertEqual(open(os.path.join(work, 'data.js'), encoding='utf-8').read(), '원격판')


class Vocabulary(unittest.TestCase):
    """이름을 바꿔 공식 근거로 위장하지 않는다."""

    def test_네이버_응답을_KRX_라고_부르지_않는다(self):
        self.assertEqual(pp.PROVIDER, 'NAVER_FINANCE')
        self.assertIn('naver', pp.REQUEST_PATH)
        self.assertNotIn('KRX', pp.REQUEST_PATH)
        원문 = open(os.path.join(HERE, 'price_provenance.py'), encoding='utf-8').read()
        self.assertNotIn("'KRX'", 원문)

    def test_발췌본을_원문_전체라고_부르지_않는다(self):
        self.assertEqual(pp.EXCERPT_POLICY, 'MINIMUM_CONSUMED_FIELDS_ONLY')
        doc = pp.build_round({'005930': {'price': 1}},
                             {'005930': pp.observe(1, summary(1), 'T', True)},
                             'L', 'S', 'F', summary(1).keys())
        self.assertEqual(doc['excerptFields'], list(pp.EXCERPT_FIELDS))
        self.assertIn('nm', doc['excludedKeys'])       # 남긴 것과 뺀 것을 구분해 적는다

    def test_인증정보나_쿠키는_저장하지_않는다(self):
        원문 = open(os.path.join(HERE, 'price_provenance.py'), encoding='utf-8').read()
        for 금지 in ('Cookie', 'cookie', 'Authorization', 'User-Agent', 'token', 'secret'):
            self.assertNotIn(금지, 원문)


if __name__ == '__main__':
    unittest.main()
