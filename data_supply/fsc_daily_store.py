#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공식 일별 가격 기록 저장소 — 금융위원회_주식시세정보(15094808) 응답을 기준일별로 보존한다 (2026-09-17).

왜 따로 두나
    기존 price_history.js 는 네이버 유래 자료이고 채점·순환매·반등 등 여러 소비자가 읽는 공용 파일이다.
    공식 API 로 새로 받은 자료는 **처음부터 섞어 덮어쓰지 않고** 별도 경로에 출처와 함께 보존한다.
    나중에 결과가격 검증에 재사용할 수 있게 만들되, 채점 정책(comparison_evidence)에 인정할지는 별도 검토다.

경로: official_prices/fsc_15094808/
    manifest.json                 기준일 → 현재 파일·해시·상태, 정정 이력(append-only)
    days/YYYY-MM-DD.json.gz       첫 기록(공급자 원문 행 + 정규화 행 + 출처·완전성)
    days/YYYY-MM-DD.rN.json.gz    같은 기준일의 공식 값이 나중에 달라졌을 때의 N번째 개정본(이전 파일은 그대로 남는다)
    verification/<runAt>.json     실응답 검증 보고서(값 아닌 집계)

원칙
    - basDt(거래 기준일)와 receivedAt(수신시각)을 구분해 둘 다 남긴다. 기준일을 수집시각으로 바꾸지 않는다.
    - 미발행·부분 응답이면 해당 날짜 미확보로 둔다. 전날 값을 오늘 값으로 복사하지 않는다. FAILED 는 저장하지 않는다.
    - 같은 기준일의 공식 값이 정정되면 기존 파일을 덮지 않고 개정본을 추가하고 corrections 에 남긴다.
    - 키·개인정보·다른 공급자 자료는 넣지 않는다. 가격 기준은 공급자 제공값 그대로(조정 여부 UNCONFIRMED)로만 적는다.
    - 저장은 원자적(temp → fsync → replace)이고 쓰고 나서 되읽어 같은지 확인한다(decision_records 와 같은 방식).
"""
from __future__ import annotations

import datetime as dt
import gzip
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from data_supply import fsc_stock_price as fsc   # noqa: E402

STORE_VERSION = 'fsc-daily-store-v1'
STORE_REL = os.path.join('official_prices', 'fsc_15094808')
MANIFEST = 'manifest.json'
DAYS_DIR = 'days'
VERIFICATION_DIR = 'verification'
STORABLE_STATUSES = ('COMPLETE', 'PARTIAL')          # UNKNOWN_TOTAL·INCONSISTENT·FAILED 는 저장하지 않는다(미확보)
BAR_KEYS = ('date', 'open', 'high', 'low', 'close', 'volume')
_DATE_RE = re.compile(r'\d{4}-\d{2}-\d{2}')


class StoreError(RuntimeError):
    """저장소 무결성 문제. 조용히 덮어쓰거나 채우지 않는다."""


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def _hash(value):
    return hashlib.sha256(_json(value).encode('utf-8')).hexdigest()


def _utcnow():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def store_root(root=None):
    return os.path.join(root or ROOT, STORE_REL)


def _atomic_write(path, data: bytes):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp'
    with open(tmp, 'wb') as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    with open(tmp, 'rb') as handle:
        if handle.read() != data:
            raise StoreError(f'되읽기 불일치: {path}')
    os.replace(tmp, path)


def _write_gz_json(path, obj):
    body = _json(obj).encode('utf-8')
    _atomic_write(path, gzip.compress(body, mtime=0))
    with open(path, 'rb') as handle:
        if gzip.decompress(handle.read()) != body:
            raise StoreError(f'압축 되읽기 불일치: {path}')


def _read_gz_json(path):
    with open(path, 'rb') as handle:
        return json.loads(gzip.decompress(handle.read()).decode('utf-8'))


def _write_json(path, obj):
    _atomic_write(path, (json.dumps(obj, ensure_ascii=False, sort_keys=True, indent=1) + '\n').encode('utf-8'))


def empty_manifest():
    return {'schemaVersion': STORE_VERSION, 'provider': fsc.PROVIDER, 'datasetId': fsc.DATASET_ID,
            'operation': fsc.OPERATION, 'attribution': fsc.ATTRIBUTION, 'license': fsc.LICENSE_NOTE,
            'priceBasis': fsc.PRICE_BASIS, 'adjustmentStatus': fsc.ADJUSTMENT_STATUS,
            'updatedAt': None, 'days': {}, 'corrections': []}


def load_manifest(root=None):
    path = os.path.join(store_root(root), MANIFEST)
    if not os.path.exists(path):
        return empty_manifest()
    with open(path, encoding='utf-8') as handle:
        manifest = json.load(handle)
    if manifest.get('schemaVersion') != STORE_VERSION:
        raise StoreError(f'manifest schemaVersion 불일치: {manifest.get("schemaVersion")!r}')
    return manifest


def save_manifest(manifest, root=None):
    manifest['updatedAt'] = _utcnow()
    _write_json(os.path.join(store_root(root), MANIFEST), manifest)


def response_hash(raw_items):
    """공급자 원문 행 목록의 sha256(정렬된 정규 JSON). 같은지 확인하는 수단이지 출처를 인증하는 장치가 아니다."""
    return _hash(raw_items)


def day_record(result, *, requested_by='manual', run_id=None):
    """fetch_day 결과 → 저장 레코드. 키·URL 원문은 들어오지 않는다(fetch_day 가 이미 가려서 준다)."""
    if result['completeness']['status'] not in STORABLE_STATUSES:
        raise StoreError(f"완전성 {result['completeness']['status']} 는 저장하지 않는다(해당 날짜 미확보)")
    if not result['rows']:
        raise StoreError('유효 행이 0건 — 그 날 자료 없음으로 둔다(저장하지 않는다)')
    rows = sorted(result['rows'], key=lambda r: (r['code'], r['date']))
    return {
        'schemaVersion': STORE_VERSION,
        'provider': fsc.PROVIDER, 'datasetId': fsc.DATASET_ID, 'operation': fsc.OPERATION,
        'basDt': result['basDt'], 'tradingDate': result['tradingDate'],
        'requestedAt': result['requestedAt'], 'receivedAt': result['receivedAt'],
        'requestPath': result['requestPath'],
        'requestedBy': requested_by, 'runId': run_id,
        'pages': result['pages'], 'pageMeta': result['pageMeta'], 'requests': result['requests'],
        'totalCountReported': result['totalCountReported'], 'totalCountConsistent': result['totalCountConsistent'],
        'rawRowCount': result['rawRowCount'], 'validRowCount': result['validRowCount'],
        'rejected': result['rejected'], 'outOfRange': result['outOfRange'], 'codeMismatch': result['codeMismatch'],
        'duplicatesIdentical': result['duplicatesIdentical'], 'conflicts': result['conflicts'],
        'completeness': result['completeness'], 'structure': result['structure'],
        'responseHash': response_hash(result['rawItems']),
        'rawItems': result['rawItems'],
        'rows': rows,
        'priceBasis': fsc.PRICE_BASIS, 'adjustmentStatus': fsc.ADJUSTMENT_STATUS,
        'adapterContract': fsc.CONTRACT_VERSION, 'attribution': fsc.ATTRIBUTION,
    }


def _diff_rows(old_rows, new_rows):
    old = {r['code']: r for r in old_rows}
    new = {r['code']: r for r in new_rows}
    changed = [code for code in old if code in new and any(old[code].get(k) != new[code].get(k) for k in BAR_KEYS)]
    return {'changedRows': len(changed), 'addedRows': len(set(new) - set(old)), 'removedRows': len(set(old) - set(new)),
            'changedCodesSample': sorted(changed)[:20]}


def save_day(result, root=None, *, requested_by='manual', run_id=None):
    """하루치를 보존한다. 반환 action: CREATED · UNCHANGED · CORRECTED(개정본 추가) · REJECTED(저장 안 함)."""
    status = result['completeness']['status']
    if status not in STORABLE_STATUSES or not result['rows']:
        return {'action': 'REJECTED', 'tradingDate': result.get('tradingDate'), 'status': status,
                'reason': result['completeness'].get('reason') or ('유효 행 0' if not result['rows'] else None)}
    record = day_record(result, requested_by=requested_by, run_id=run_id)
    manifest = load_manifest(root)
    base = store_root(root)
    trading_date = record['tradingDate']
    entry = manifest['days'].get(trading_date)
    if entry:
        current_path = os.path.join(base, entry['file'])
        if not os.path.exists(current_path):
            raise StoreError(f'manifest 가 가리키는 파일이 없다: {entry["file"]}')
        if entry['responseHash'] == record['responseHash'] and entry['status'] == status:
            return {'action': 'UNCHANGED', 'tradingDate': trading_date, 'file': entry['file'],
                    'responseHash': entry['responseHash'], 'status': status}
        previous = _read_gz_json(current_path)
        revision = len(entry.get('history') or []) + 2
        rel = f'{DAYS_DIR}/{trading_date}.r{revision}.json.gz'
        while os.path.exists(os.path.join(base, rel)):
            revision += 1
            rel = f'{DAYS_DIR}/{trading_date}.r{revision}.json.gz'
        record['supersedes'] = {'file': entry['file'], 'responseHash': entry['responseHash']}
        _write_gz_json(os.path.join(base, rel), record)
        kind = ('PARTIAL_TO_COMPLETE' if entry['status'] == 'PARTIAL' and status == 'COMPLETE'
                else 'COMPLETE_TO_PARTIAL' if entry['status'] == 'COMPLETE' and status == 'PARTIAL' else 'VALUE_CHANGE')
        correction = {'tradingDate': trading_date, 'kind': kind, 'detectedAt': _utcnow(),
                      'previousFile': entry['file'], 'previousHash': entry['responseHash'],
                      'newFile': rel, 'newHash': record['responseHash'], 'requestedBy': requested_by, 'runId': run_id}
        correction.update(_diff_rows(previous.get('rows') or [], record['rows']))
        manifest['corrections'].append(correction)
        history = list(entry.get('history') or []) + [{'file': entry['file'], 'responseHash': entry['responseHash'],
                                                       'status': entry['status'], 'receivedAt': entry['receivedAt']}]
        manifest['days'][trading_date] = {'file': rel, 'receivedAt': record['receivedAt'], 'status': status,
                                          'validRowCount': record['validRowCount'], 'rawRowCount': record['rawRowCount'],
                                          'responseHash': record['responseHash'], 'contractVersion': fsc.CONTRACT_VERSION,
                                          'history': history}
        save_manifest(manifest, root)
        return {'action': 'CORRECTED', 'tradingDate': trading_date, 'file': rel, 'responseHash': record['responseHash'],
                'status': status, 'correction': correction}
    rel = f'{DAYS_DIR}/{trading_date}.json.gz'
    if os.path.exists(os.path.join(base, rel)):
        raise StoreError(f'manifest 에 없는 파일이 이미 있다(수동 복구 필요): {rel}')
    _write_gz_json(os.path.join(base, rel), record)
    manifest['days'][trading_date] = {'file': rel, 'receivedAt': record['receivedAt'], 'status': status,
                                      'validRowCount': record['validRowCount'], 'rawRowCount': record['rawRowCount'],
                                      'responseHash': record['responseHash'], 'contractVersion': fsc.CONTRACT_VERSION,
                                      'history': []}
    save_manifest(manifest, root)
    return {'action': 'CREATED', 'tradingDate': trading_date, 'file': rel, 'responseHash': record['responseHash'],
            'status': status}


def load_day(trading_date, root=None):
    manifest = load_manifest(root)
    entry = manifest['days'].get(trading_date)
    if not entry:
        return None
    return _read_gz_json(os.path.join(store_root(root), entry['file']))


def revisions(trading_date, root=None):
    manifest = load_manifest(root)
    entry = manifest['days'].get(trading_date)
    if not entry:
        return []
    return list(entry.get('history') or []) + [{'file': entry['file'], 'responseHash': entry['responseHash'],
                                                'status': entry['status'], 'receivedAt': entry['receivedAt']}]


def stored_dates(root=None, statuses=STORABLE_STATUSES):
    manifest = load_manifest(root)
    return sorted(d for d, e in manifest['days'].items() if e['status'] in statuses)


def load_series(codes=None, root=None, statuses=STORABLE_STATUSES):
    """{code: [일봉 …]} 날짜 오름차순. 없는 날짜는 비워 둔다(전날 값으로 채우지 않는다)."""
    wanted = set(codes) if codes is not None else None
    out = {}
    for trading_date in stored_dates(root, statuses):
        record = load_day(trading_date, root)
        for row in record['rows']:
            if wanted is not None and row['code'] not in wanted:
                continue
            bar = {k: row[k] for k in BAR_KEYS}
            out.setdefault(row['code'], {})[row['date']] = bar
    return {code: [bars[d] for d in sorted(bars)] for code, bars in sorted(out.items())}


def verify_store(root=None):
    """파일·해시·매니페스트가 서로 맞는지(값의 진위가 아니라 보존 무결성)."""
    manifest = load_manifest(root)
    base = store_root(root)
    problems = []
    for trading_date, entry in sorted(manifest['days'].items()):
        for rev in list(entry.get('history') or []) + [entry]:
            path = os.path.join(base, rev['file'])
            if not os.path.exists(path):
                problems.append({'tradingDate': trading_date, 'file': rev['file'], 'problem': 'MISSING_FILE'})
                continue
            record = _read_gz_json(path)
            if record.get('tradingDate') != trading_date:
                problems.append({'tradingDate': trading_date, 'file': rev['file'], 'problem': 'DATE_MISMATCH'})
            if response_hash(record.get('rawItems') or []) != rev['responseHash'] or record.get('responseHash') != rev['responseHash']:
                problems.append({'tradingDate': trading_date, 'file': rev['file'], 'problem': 'HASH_MISMATCH'})
            if any(_DATE_RE.fullmatch(r.get('date') or '') is None or r.get('date') != trading_date for r in record.get('rows') or []):
                problems.append({'tradingDate': trading_date, 'file': rev['file'], 'problem': 'ROW_DATE_OUTSIDE_DAY'})
    return {'days': len(manifest['days']), 'corrections': len(manifest['corrections']), 'problems': problems,
            'ok': not problems}


def save_verification_report(report, root=None):
    run_at = str(report.get('runAt') or _utcnow()).replace(':', '').replace('+0000', 'Z')
    rel = f'{VERIFICATION_DIR}/{run_at}.json'
    _write_json(os.path.join(store_root(root), rel), report)
    return rel
