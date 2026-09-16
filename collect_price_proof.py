#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OFFICIAL PRICE PROOF PRODUCER — 결과일이 지난 신규 판단에 KRX 공식 결과가격 증명을 붙인다.

사슬에서 이 파일의 자리(PHASE 4):
  판단 당시 가격 기록(PHASE 3, priceObservedAt/priceProvenance)
    → [이 파일] 5거래일 뒤 공식 결과가격을 KRX Open API 원문과 함께 확보 → price_proofs/<sha256>.json
    → comparison_evidence.assess() 가 기업행사 증거와 함께 검사(조건은 그대로)
    → decision_records.evaluate() + compute_team_weights.score_call() (기존 채점 공식 그대로)
    → outcomes/YYYY-MM.json (불변) → main → 되읽기

이 파일이 **하지 않는** 것
  - 채점 공식·임계값·가중치를 만들거나 바꾸지 않는다. 증거만 만든다.
  - 과거 7,200건(출처 없는 판단)을 소급하지 않는다. planner 가 MISSING_PROVENANCE 로 걸러낸다.
  - 결과일 전 판단은 건드리지 않는다(WAITING_MATURITY). 기간을 줄이지 않는다(5D 그대로).
  - 조정계수를 계산하지 않는다. 창 안에서 기준가격이 바뀐 흔적(전일대비 연속성 깨짐)이 보이면 증명하지 않는다.
  - 판단 당시 가격(base)이 공식 종가와 정확히 같고 장 마감(15:30 KST) 이후 관측된 경우에만 "판단 당시
    가격의 공식 대응 근거"를 만든다. 장중 가격은 일별 공식 자료로 증명할 수 없으므로 막는다.
  - 인증키가 없거나 서비스 미승인이면 가짜로 우회하지 않는다. 계획·상태 기록·OWNER_ACTION_REQUIRED 까지만 한다.

쓰는 법
  python3 collect_price_proof.py --plan-only          # 네트워크 0. 계획 집계만 출력
  python3 collect_price_proof.py --smoke              # 키 없는 표본 엔드포인트로 응답 구조만 확인(값은 쓰지 않음)
  python3 collect_price_proof.py [--records 700] [--requests 40]   # 실제 생산(환경변수 KRX_OPENAPI_AUTH_KEY)

종료코드  0 = 돌았다(막힌 판단이 있어도 상태 파일에 사유가 남는다) · 2 = 인증키/승인이 없어 생산 불가(OWNER_ACTION_REQUIRED)
"""
import argparse
import datetime as dt
import json
import os
import sys

import comparison_evidence as ce
import decision_records as dr
import krx_openapi_client as krx
import price_proof_planner as planner

HERE = os.path.dirname(os.path.abspath(__file__))
PRODUCER_VERSION = 'price-proof-producer-v1'
STATUS_SCHEMA = 'price-proof-status-v1'
STATUS_FILE = os.path.join('gaeo_coverage', 'price_proof_status.json')
SMOKE_FILE = os.path.join('gaeo_coverage', 'price_proof_source_verify.json')
#: KRX 정규장 종료(종가 확정) 시각. 이 뒤에 관측된 가격만 그 날 공식 종가와 대응시킨다.
SESSION_CLOSE_KST = dt.time(15, 30)
DEFAULT_RECORD_CAP = 700
DEFAULT_REQUEST_CAP = 40

OWNER_ACTION_AUTH = {
    'code': 'KRX_OPENAPI_AUTH_KEY_MISSING',
    'what': 'KRX Open API 인증키가 Actions Secret 에 없다. 실제 공식 결과가격 생산은 이 키 하나가 있어야 열린다.',
    'how': [
        '1) https://openapi.krx.co.kr 회원가입 → 인증키 발급 신청(관리자 승인 뒤 사용 가능)',
        '2) 「주식」 카테고리의 유가증권 일별매매정보(stk_bydd_trd)·코스닥 일별매매정보(ksq_bydd_trd) 서비스 이용신청·승인',
        '3) GitHub 저장소 Settings → Secrets and variables → Actions → New repository secret: 이름 KRX_OPENAPI_AUTH_KEY',
        '4) Actions 탭에서 price-proof 워크플로를 dispatch (기본값 그대로). 첫 실행의 Step Summary 에서 응답 구조 확인·생산 건수를 본다',
    ],
    'limits': '무료 · 인증키당 일 10,000회. 이 생산자는 날짜당 2요청(유가증권·코스닥)만 쓴다.',
}
OWNER_ACTION_SERVICE = {
    'code': 'KRX_OPENAPI_SERVICE_REJECTED',
    'what': 'KRX 가 키를 거부했거나 서비스가 승인되지 않았다(respCode 401 또는 HTTP 403).',
    'how': ['openapi.krx.co.kr → 마이페이지에서 인증키 상태와 「주식」 서비스 이용신청 승인 여부를 확인한다',
            'Secret 값이 발급 화면의 키와 같은지(앞뒤 공백 없이) 확인한다'],
}


def kst_date(iso):
    return dr._moment(iso).astimezone(dr.KST).date().isoformat()


def load_bundles(repo):
    bundles = []
    for name in ('corporate_action_evidence', 'kind_market_action_evidence'):
        path = os.path.join(repo, 'gaeo_coverage', name + '.json')
        try:
            bundles.append(json.load(open(path, encoding='utf-8')).get('evidence') or {})
        except (OSError, ValueError):
            bundles.append({})
    return bundles


def make_plan(root, repo, now):
    rows = dr.read_records(root)
    daily = dr.daily_records(rows)
    outcomes = dr.load_outcomes(root)
    proofs = ce.load_price_proofs(root)
    dart, kind = load_bundles(repo)
    return planner.plan(daily, outcomes, proofs, dart, kind, now), {r['recordId']: r for r in daily}


def period_days(record):
    start = dr._day(record['decisionAt'])
    end = dr.future_trading_period(start, 5)['periodEnd']
    return start, end, ce._days(start, end)


def _bind(item, document):
    item['document'] = json.loads(dr._json(document))
    item['responseRef'] = 'sha256:' + dr._hash(item['document'])
    return item


def build_proof(record, sources, now):
    """공식 원문(sources)에서 이 판단의 가격증명을 조립한다. 부족하면 (None, 사유)."""
    code = record['code']
    start, end, days = period_days(record)
    if kst_date(now) <= end:
        return None, 'period_not_final'
    per_day = {}
    for day in days:
        bas_dd = day.replace('-', '')
        hits = []
        for dataset_id in krx.DATASETS:
            src = sources.get((dataset_id, bas_dd))
            if src is None:
                continue
            if 'conflict' in src:
                return None, 'official_response_conflict:' + day
            rows = krx.find_rows(src['body'], code)
            if len(rows) > 1:
                return None, 'ticker_ambiguous_in_response:' + day
            if rows:
                hits.append((dataset_id, src, rows[0]))
        if not hits:
            # 그 날 데이터셋(유가증권·코스닥) 중 하나라도 원문이 없으면 '종목이 없다'고 말할 수 없다.
            if any((d, bas_dd) not in sources for d in krx.DATASETS):
                return None, 'official_response_missing:' + day
            return None, 'official_row_missing:' + day
        if len(hits) > 1:
            return None, 'ticker_in_multiple_datasets:' + day
        per_day[day] = hits[0]
    datasets = {hit[0] for hit in per_day.values()}
    if len(datasets) != 1:
        return None, 'dataset_inconsistent_across_period'
    dataset_id = datasets.pop()
    prices, match_rules = [], set()
    for day in days:
        _, src, (pointer, row, rule) = per_day[day]
        close = krx.parse_krx_number(row.get(krx.CLOSE_FIELD))
        volume = krx.parse_krx_number(row.get(krx.VOLUME_FIELD))
        change = krx.parse_krx_number(row.get(krx.CHANGE_FIELD))
        if close is None or volume is None or change is None:
            return None, 'official_value_unparseable:' + day
        if close <= 0:
            return None, 'official_close_not_positive:' + day
        if not src.get('structureVerified') or src.get('sampleEndpoint'):
            return None, 'official_response_unverified:' + day
        if kst_date(src['observedAt']) <= day:
            return None, 'close_not_final:' + day    # 그 날 안에 받은 응답은 확정 종가라고 보지 않는다
        # 원문 전체는 price_sources/ 에 있다. 여기에는 검사에 쓰는 값과 원문으로 돌아갈 좌표만 싣는다(크기 절약).
        prices.append({'date': day, 'close': close, 'final': True, 'volume': volume,
                       'changeFromPreviousClose': change, 'rawResponseRef': src['responseRef'],
                       'rowPath': pointer})
        match_rules.add(rule)
    pairs = []
    for prev, cur in zip(prices, prices[1:]):
        consistent = (prev['close'] + cur['changeFromPreviousClose'] == cur['close'])
        pairs.append({'from': prev['date'], 'to': cur['date'], 'consistent': consistent})
        if not consistent:
            return None, 'price_basis_continuity_broken:' + cur['date']
    observed = dr._moment(record.get('priceObservedAt'))
    if not observed:
        return None, 'price_observed_at_missing'
    observed_kst = observed.astimezone(dr.KST)
    if observed_kst.date().isoformat() != start:
        return None, 'price_observed_on_other_day'
    if observed_kst.time() < SESSION_CLOSE_KST:
        return None, 'original_price_intraday_not_in_daily_dataset'
    base = record.get('base')
    if not dr._number(base) or base <= 0:
        return None, 'original_price_missing'
    if prices[0]['close'] != base:
        return None, 'original_price_not_equal_official_close'
    provenance = record.get('priceProvenance') or {}
    period = {'from': start, 'to': end}
    # 긴 설명 문구는 증명마다 반복하지 않는다(하루 600건). 뜻은 krx_openapi_client.BASIS_GROUNDS 와 이 파일의
    # docstring 에 한 번만 있고, 증명은 그 이름(groundsRef)과 검사 결과만 싣는다.
    proof = {
        'schemaVersion': 1, 'producer': 'collect_price_proof.py', 'producerVersion': PRODUCER_VERSION,
        'contractVersion': krx.CONTRACT_VERSION, 'recordId': record['recordId'],
        'originalRecordHash': dr._hash(record), 'ticker': code, 'period': period,
        'observedAt': now, 'source': krx.SOURCE, 'sourcePortal': krx.PORTAL,
        'sourceRef': krx.dataset_source_ref(dataset_id), 'datasetId': dataset_id,
        'basis': krx.BASIS, 'prices': prices, 'tickerPath': '/ticker', 'periodPath': '/period',
        'pricesPath': '/prices', 'datasetIdPath': '/datasetId',
        'tickerMatchRules': sorted(match_rules), 'rawResponseDir': krx.SOURCES_DIR,
        'continuity': {'ruleRef': 'krx_openapi_client.BASIS_GROUNDS.continuityRule',
                       'pairs': pairs, 'consistent': True},
    }
    _bind(proof, {'ticker': code, 'period': period, 'prices': prices, 'datasetId': dataset_id})
    proof['basisEvidence'] = _bind({
        'sourceRef': krx.dataset_source_ref(dataset_id), 'basis': krx.BASIS,
        'valuePath': '/basis', 'datasetIdPath': '/datasetId', 'periodPath': '/period'},
        {'basis': krx.BASIS, 'datasetId': dataset_id, 'period': period,
         'groundsRef': 'krx_openapi_client.BASIS_GROUNDS',
         'grounds': {'queryMode': krx.BASIS_GROUNDS['queryMode'], 'closeField': krx.CLOSE_FIELD,
                     'adjustmentParameter': krx.BASIS_GROUNDS['adjustmentParameter'],
                     'continuityChecked': {'pairs': len(pairs), 'consistent': True}}})
    decision_src = per_day[start][1]
    proof['originalPriceEvidence'] = _bind({
        'sourceRef': decision_src['requestUrl'], 'value': base, 'basis': 'unadjusted',
        'valuePath': '/value', 'basisPath': '/basis', 'tickerPath': '/ticker', 'observedAtPath': '/observedAt'},
        {'ticker': code, 'observedAt': record['priceObservedAt'], 'value': base, 'basis': 'unadjusted',
         'observedAtOrigin': 'price_provenance.receivedAt',   # 수집기가 가격 응답을 받은 시각. KRX 자료가 아니다
         'valueOrigin': 'decision_record.base',               # 판단이 실제로 쓴 가격
         'observationProvider': provenance.get('provider'),
         'corroboration': {'rule': 'ORIGINAL_EQUALS_OFFICIAL_CLOSE_AFTER_SESSION_CLOSE',
                           'observedAtKst': observed_kst.isoformat(),
                           'sessionCloseKst': SESSION_CLOSE_KST.strftime('%H:%M'),
                           'datasetId': dataset_id, 'basDd': decision_src['basDd'], 'field': krx.CLOSE_FIELD,
                           'officialClose': prices[0]['close'], 'rawResponseRef': decision_src['responseRef'],
                           'rowPath': prices[0]['rowPath']}})
    return proof, None


def self_check(record, proof, dart, kind, now):
    """우리가 만든 증명을 소비자 검사에 실제로 넣어 본다. 구조적으로 거부되면 저장하지 않는다."""
    verdict = ce.assess(record, dart, kind, now=now, price_proof=proof)
    if verdict.get('reason') in ('price_evidence_invalid', 'price_basis_unverified'):
        return False, verdict
    return True, verdict


def produce(root, repo, now, key, record_cap=DEFAULT_RECORD_CAP, request_cap=DEFAULT_REQUEST_CAP,
            fetch=None):
    """계획 → 원문 확보(재사용 우선) → 증명 조립 → 자기검사 → 저장. 상태 dict 를 돌려준다."""
    fetch = fetch or krx.fetch_daily
    planned, by_id = make_plan(root, repo, now)
    ready = planner.ready_rows(planned)
    dart, kind = load_bundles(repo)
    status = {'schemaVersion': STATUS_SCHEMA, 'producerVersion': PRODUCER_VERSION,
              'contractVersion': krx.CONTRACT_VERSION, 'generatedAt': now, 'asOf': planned['asOf'],
              'auth': {'present': bool(key), 'envName': krx.KEY_ENV},
              'ownerActionRequired': [], 'plan': {'counts': planned['counts'],
                                                  'corporateEvidence': planned['corporateEvidence'],
                                                  'readyRecords': len(ready)},
              'run': {'attempted': 0, 'produced': 0, 'notProcessed': 0, 'blocked': {},
                      'requestsUsed': 0, 'requestsBudget': request_cap, 'recordCap': record_cap,
                      'rawResponsesFetched': 0, 'rawResponsesReused': 0, 'datesNeeded': [],
                      'fetchFailures': []},
              'producedProofs': [], 'blockedRecords': []}
    todo = ready[:record_cap]
    status['run']['notProcessed'] = len(ready) - len(todo)
    if not key:
        # 오늘 증명할 판단이 없어도 키 없음은 그대로 알린다 — 키 발급·서비스 승인에는 시간이 걸리고,
        # 첫 결과일(판단 뒤 5거래일)에 키가 없으면 그날 채점이 통째로 밀린다(2026-09-16 실측:
        # 첫 dispatch 가 READY 0 이라 ownerActionRequired 가 비어 있었다 — 문서와 어긋났다).
        status['ownerActionRequired'].append(OWNER_ACTION_AUTH)
        for item in todo:
            _block(status, item, 'auth_key_missing')
        return status, planned
    if not todo:
        return status, planned
    needed = sorted({day for item in todo for day in period_days(by_id[item['recordId']])[2]})
    status['run']['datesNeeded'] = needed
    today = kst_date(now)
    sources = krx.load_sources(root, dates={d.replace('-', '') for d in needed})
    stop = None
    for day in needed:
        if day >= today:
            continue                     # 그 날 종가는 아직 확정이라고 보지 않는다 → 해당 판단은 close_not_final
        bas_dd = day.replace('-', '')
        for dataset_id in krx.DATASETS:
            if (dataset_id, bas_dd) in sources:
                status['run']['rawResponsesReused'] += 1
                continue
            if stop or status['run']['requestsUsed'] >= request_cap:
                break
            status['run']['requestsUsed'] += 1
            record = fetch(dataset_id, bas_dd, key, observed_at=now)
            if record.get('structureVerified'):
                krx.save_source(record, root)
                sources[(dataset_id, bas_dd)] = record
                status['run']['rawResponsesFetched'] += 1
                continue
            status['run']['fetchFailures'].append({'datasetId': dataset_id, 'basDd': bas_dd,
                                                   'status': record.get('status'), 'error': record.get('error'),
                                                   'httpStatus': record.get('httpStatus')})
            if record.get('status') in (krx.RATE_LIMITED,):
                stop = record['status']
            if record.get('status') in (krx.FORBIDDEN, krx.RESPONSE_ERROR) and \
                    (record.get('status') == krx.FORBIDDEN or '401' in str(record.get('error'))):
                stop = record['status']
                if OWNER_ACTION_SERVICE not in status['ownerActionRequired']:
                    status['ownerActionRequired'].append(OWNER_ACTION_SERVICE)
    existing = ce.load_price_proofs(root)
    for item in todo:
        record = by_id[item['recordId']]
        status['run']['attempted'] += 1
        if record['recordId'] in existing:
            _block(status, item, 'proof_already_exists')
            continue
        proof, reason = build_proof(record, sources, now)
        if not proof:
            _block(status, item, reason)
            continue
        ok, verdict = self_check(record, proof, dart.get(record['code']), kind.get(record['code']), now)
        if not ok:
            _block(status, item, 'producer_self_check_failed:' + str(verdict.get('reason')))
            continue
        if proof['originalRecordHash'] != dr._hash(record):
            _block(status, item, 'original_binding_mismatch')
            continue
        proof_id = ce.save_price_proof(proof, root)
        status['run']['produced'] += 1
        status['producedProofs'].append({'recordId': record['recordId'], 'code': record['code'],
                                         'date': record['date'], 'proofId': proof_id,
                                         'comparisonState': verdict['state'],
                                         'comparisonReason': verdict.get('reason')})
    return status, planned


def _block(status, item, reason):
    key = reason.split(':')[0]
    status['run']['blocked'][key] = status['run']['blocked'].get(key, 0) + 1
    status['blockedRecords'].append({'recordId': item['recordId'], 'code': item['code'],
                                     'date': item['date'], 'state': planner.BLOCKED_PRICE_SOURCE,
                                     'reason': reason})


def write_status(status, repo):
    path = os.path.join(repo, STATUS_FILE)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    dr._atomic_json(path, status)
    return path


def summary_line(status):
    run = status['run']
    return json.dumps({'ready': status['plan']['readyRecords'], 'attempted': run['attempted'],
                       'produced': run['produced'], 'blocked': run['blocked'],
                       'notProcessed': run['notProcessed'], 'requestsUsed': run['requestsUsed'],
                       'rawFetched': run['rawResponsesFetched'], 'rawReused': run['rawResponsesReused'],
                       'planCounts': status['plan']['counts'],
                       'ownerActionRequired': [a['code'] for a in status['ownerActionRequired']]},
                      ensure_ascii=False)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--plan-only', action='store_true', help='네트워크 0 · 계획 집계만')
    ap.add_argument('--smoke', action='store_true', help='키 없는 표본 엔드포인트로 응답 구조만 확인')
    ap.add_argument('--records', type=int, default=DEFAULT_RECORD_CAP, help='이번 회차에 증명할 판단 수 상한')
    ap.add_argument('--requests', type=int, default=DEFAULT_REQUEST_CAP, help='KRX 요청 수 상한(날짜당 2)')
    ap.add_argument('--repo', default=HERE)
    ap.add_argument('--root', default=None, help='봉인 원장 폴더(기본 <repo>/research_archive/decisions)')
    ap.add_argument('--now', default=None, help='시험용 현재 시각(ISO)')
    ap.add_argument('--status-out', default=None, help='상태 파일 경로(기본 gaeo_coverage/price_proof_status.json)')
    ap.add_argument('--due-tickers-out', default=None,
                    help='--plan-only 와 함께: 채점 후보 종목코드를 한 줄에 하나씩 이 파일에 쓴다 '
                         '(기업행사 수집기 --tickers-file 입력용). 후보가 없으면 빈 파일을 쓴다.')
    args = ap.parse_args(argv)
    repo = args.repo
    root = args.root or os.path.join(repo, 'research_archive', 'decisions')
    now = args.now or dr._now()
    if args.smoke:
        result = krx.smoke(observed_at=now)
        path = os.path.join(repo, SMOKE_FILE)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        dr._atomic_json(path, result)
        print(json.dumps({k: v for k, v in result.items() if k != 'datasets'} |
                         {d: {'status': v['status'], 'httpStatus': v['httpStatus'], 'rows': v['rowCount'],
                              'missingFields': v['missingFields']} for d, v in result['datasets'].items()},
                         ensure_ascii=False))
        return 0 if result['allVerified'] else 3
    if args.plan_only:
        planned, _ = make_plan(root, repo, now)
        due = planner.due_tickers(planned)
        if args.due_tickers_out:
            os.makedirs(os.path.dirname(os.path.abspath(args.due_tickers_out)), exist_ok=True)
            with open(args.due_tickers_out, 'w', encoding='utf-8') as handle:
                handle.write('# 채점 후보 종목(price_proof_planner.due_tickers) · asOf %s · %d종목\n'
                             % (planned['asOf'], len(due)))
                handle.write(''.join(code + '\n' for code in due))
        print(json.dumps({'asOf': planned['asOf'], 'counts': planned['counts'],
                          'corporateEvidence': planned['corporateEvidence'],
                          'dueTickers': len(due)}, ensure_ascii=False))
        return 0
    key = krx.get_auth_key()
    status, _ = produce(root, repo, now, key, record_cap=args.records, request_cap=args.requests)
    path = args.status_out or os.path.join(repo, STATUS_FILE)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    dr._atomic_json(path, status)
    print(summary_line(status))
    for action in status['ownerActionRequired']:
        print('OWNER_ACTION_REQUIRED ' + action['code'] + ' — ' + action['what'])
        for step in action['how']:
            print('   ' + step)
    return 2 if status['ownerActionRequired'] else 0


if __name__ == '__main__':
    sys.exit(main())
