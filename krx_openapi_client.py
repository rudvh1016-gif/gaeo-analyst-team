#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""KRX Open API(정보데이터시스템 OPEN API) 일별매매정보 — 공식 결과가격의 **원문**을 받아 보존한다.

이 파일은 판정하지 않는다. 공식 응답을 받고, 구조를 대조하고, 원문을 내용주소 파일로 남길 뿐이다.
가격증명(price proof)을 조립하는 것은 collect_price_proof.py 이고, 그것을 받아들일지는
comparison_evidence._price_proof() 가 정한다(이번 작업에서 그 검사조건은 하나도 낮추지 않았다).

## 계약의 출처 (2026-09-16 · 이 세션에서 포털 직접 접근은 프록시가 막아 확인 불가)

포털: https://openapi.krx.co.kr (회원가입 → 인증키 발급 → 서비스별 이용신청·승인)
서비스 호출 주소·요청·응답 모양은 실제 API 를 호출해 검증한 독립 오픈소스 두 개의 소스코드에서
교차 확인했다(둘이 일치했다):
  - github.com/seokhoonj/krx-openapi  (Python, urllib GET)   src/krx_openapi/_endpoint.py · session.py · catalog.py
  - github.com/kyo504/krx-cli         (TypeScript, fetch POST) src/client/client.ts · response-fields.ts · krx-number.ts

  요청  GET https://data-dbg.krx.co.kr/svc/apis/sto/stk_bydd_trd.json?basDd=YYYYMMDD
        헤더 AUTH_KEY: <인증키>   (키는 URL 이 아니라 헤더에만 싣는다. 리다이렉트는 거부한다 — 키 유출 방지)
  성공  HTTP 200, {"OutBlock_1": [ {행}, ... ]}   행의 값은 전부 문자열이고 숫자는 쉼표 구분("71,000")
  실패  HTTP 200 + {"respCode": "...", "respMsg": "..."} (401 = 키 거부 또는 서비스 미승인)
        HTTP 429 = 인증키당 일 10,000회 한도 초과 · HTTP 403 = 잘못된 키/주소(https 아님, sample 경로에 실제 키)
  필드  BAS_DD ISU_CD ISU_NM MKT_NM SECT_TP_NM TDD_CLSPRC CMPPREVDD_PRC FLUC_RT TDD_OPNPRC TDD_HGPRC
        TDD_LWPRC ACC_TRDVOL ACC_TRDVAL MKTCAP LIST_SHRS
  표본  https://data-dbg.krx.co.kr/svc/sample/apis/... — KRX 가 공개한 시험용 키로 고정 날짜(20200414)만 응답.
        구조 확인(smoke)에만 쓰고, 증명 조립에는 절대 쓰지 않는다.

⚠️ 위는 문서·소스 대조이지 이 세션의 실측이 아니다. 그래서 이 파일은 **응답이 왔을 때 구조를
   반드시 다시 대조**한다(structureVerified). 필드가 하나라도 없으면 그 응답으로 아무것도 만들지 않는다.

## 절대 하지 않는 것
  - 인증키를 URL·로그·산출물·예외 메시지에 남기지 않는다(redact).
  - 응답에 없는 날짜·종목·값을 만들어 넣지 않는다. 0건 응답은 "그 날 자료 없음"이지 가격이 아니다.
  - 네이버 등 다른 출처의 값을 이 파일의 출력에 섞지 않는다.
  - 조정(수정주가)을 계산하지 않는다. 이 데이터셋에는 조정 인자가 없고, 그 사실을 그대로 적는다.
"""
import datetime as dt
import gzip
import hashlib
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request

PORTAL = 'https://openapi.krx.co.kr'
BASE_URL = 'https://data-dbg.krx.co.kr/svc/apis'
SAMPLE_URL = 'https://data-dbg.krx.co.kr/svc/sample/apis'
OFFICIAL_HOST = 'data-dbg.krx.co.kr'
AUTH_HEADER = 'AUTH_KEY'
KEY_ENV = 'KRX_OPENAPI_AUTH_KEY'
USER_AGENT = 'gaeo-price-proof/1 (+https://gaeoteam.com)'
CONTRACT_VERSION = 'krx-openapi-daily-trading-v1'
SOURCE = 'KRX'
REQUEST_METHOD = 'GET'
TIMEOUT_SECONDS = 60
MAX_BODY_BYTES = 40_000_000
#: KRX 가 자기 API 시험 페이지에 공개한 표본용 키(오픈소스 래퍼 _endpoint.py 주석 인용). 비밀이 아니며
#: /svc/sample/apis 경로에서만 동작한다. 실제 서비스 경로에는 절대 보내지 않는다(sample_only 가드).
SAMPLE_PUBLIC_KEY = '74D1B99DFBF345BBA3FB4476510A4BED4C78D13A'
SAMPLE_DATE = '20200414'
DAILY_QUOTA_PER_KEY = 10_000

#: 가격증명에 쓰는 데이터셋. 여기 없는 데이터셋으로는 증명을 만들지 않는다(추측 금지).
DATASETS = {
    'krx-openapi:sto/stk_bydd_trd': {'path': 'sto/stk_bydd_trd', 'market': 'KOSPI',
                                     'title': '유가증권 일별매매정보'},
    'krx-openapi:sto/ksq_bydd_trd': {'path': 'sto/ksq_bydd_trd', 'market': 'KOSDAQ',
                                     'title': '코스닥 일별매매정보'},
}
REQUIRED_FIELDS = ('BAS_DD', 'ISU_CD', 'ISU_NM', 'MKT_NM', 'SECT_TP_NM', 'TDD_CLSPRC',
                   'CMPPREVDD_PRC', 'FLUC_RT', 'TDD_OPNPRC', 'TDD_HGPRC', 'TDD_LWPRC',
                   'ACC_TRDVOL', 'ACC_TRDVAL', 'MKTCAP', 'LIST_SHRS')
DATE_FIELD, CODE_FIELD, NAME_FIELD = 'BAS_DD', 'ISU_CD', 'ISU_NM'
CLOSE_FIELD, CHANGE_FIELD, VOLUME_FIELD = 'TDD_CLSPRC', 'CMPPREVDD_PRC', 'ACC_TRDVOL'
#: 증명에 발췌해 싣는 필드(원문 전체는 price_sources/ 에 따로 보존한다).
EXCERPT_FIELDS = ('BAS_DD', 'ISU_CD', 'ISU_NM', 'MKT_NM', 'TDD_CLSPRC', 'CMPPREVDD_PRC', 'ACC_TRDVOL')

#: 이 데이터셋이 어떤 가격 기준인지에 대한 **선언과 그 근거**. "KRX 니까 수정주가일 것이다" 같은 추측이 아니라,
#: 아래 세 가지 사실로 선언한다. ③은 응답이 올 때마다 collect_price_proof 가 실제로 다시 검사한다.
BASIS = 'unadjusted'
BASIS_GROUNDS = {
    'queryMode': 'per_base_date',
    'queryModeNote': '기준일자(basDd) 하나를 주면 그 날의 매매기록 전 종목을 돌려준다. 시계열 조회가 아니다.',
    'closeField': CLOSE_FIELD,
    'closeFieldSpec': '종가 (KRX Open API 유가증권/코스닥 일별매매정보 출력 항목)',
    'adjustmentParameter': None,
    'adjustmentParameterNote': ('이 서비스에는 수정주가 선택 인자가 없다(참고: data.krx.co.kr [12003] 개별종목 시세추이에는 '
                                'adjStkPrc 1=단순종가/2=수정종가 인자가 있다 — 그 화면은 쓰지 않는다).'),
    'continuityRule': 'TDD_CLSPRC[D] == TDD_CLSPRC[D-1] + CMPPREVDD_PRC[D] (창 안의 연속 거래일 쌍마다 실제 검사)',
    'continuityNote': ('기준가격이 바뀌는 행사(분할·병합·권리락·배당락 등)가 창 안에 있으면 전일대비가 전일 종가 기준으로 '
                       '맞지 않으므로 이 검사가 실패하고, 그 창은 증명하지 않는다.'),
}

RATE_LIMIT_STATUS = 429
FORBIDDEN_STATUS = 403

RESPONSE_OK = 'OK'
RESPONSE_EMPTY = 'EMPTY'
RESPONSE_ERROR = 'RESPONSE_ERROR'
RESPONSE_SHAPE_UNEXPECTED = 'RESPONSE_SHAPE_UNEXPECTED'
RATE_LIMITED = 'RATE_LIMITED'
FORBIDDEN = 'FORBIDDEN'
TRANSPORT_ERROR = 'TRANSPORT_ERROR'
AUTH_KEY_MISSING = 'AUTH_KEY_MISSING'

SOURCES_DIR = 'price_sources'


class ContractError(ValueError):
    """공식 응답이 계약과 다르다. 그 응답으로는 아무것도 만들지 않는다."""


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)


def _hash(value):
    return hashlib.sha256(_json(value).encode('utf-8')).hexdigest()


def now_utc():
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def get_auth_key():
    """환경변수에서만 읽는다. 없으면 None — 생산은 멈추지만 계획·상태 기록은 계속된다."""
    key = os.environ.get(KEY_ENV) or ''
    return key.strip() or None


def redact(text, key=None):
    """로그·예외에서 인증키를 지운다. 키를 모를 때도 AUTH_KEY 헤더 값 모양은 가린다."""
    s = str(text)
    key = key or get_auth_key()
    if key:
        s = s.replace(key, '***REDACTED***').replace(urllib.parse.quote(key, safe=''), '***REDACTED***')
    return re.sub(r'(AUTH_KEY\s*[:=]\s*)([^\s,;]+)', r'\1***REDACTED***', s)


def request_url(dataset_id, bas_dd, sample=False):
    """인증키 없는 요청 주소(증명에 그대로 기록한다)."""
    if dataset_id not in DATASETS:
        raise ContractError('unknown dataset: ' + str(dataset_id))
    if not re.fullmatch(r'\d{8}', str(bas_dd)):
        raise ContractError('basDd must be YYYYMMDD')
    base = SAMPLE_URL if sample else BASE_URL
    return f"{base}/{DATASETS[dataset_id]['path']}.json?basDd={bas_dd}"


def dataset_source_ref(dataset_id):
    """데이터셋(서비스) 자체를 가리키는 공식 주소 — 가격 기준 선언(basisEvidence)의 sourceRef."""
    if dataset_id not in DATASETS:
        raise ContractError('unknown dataset: ' + str(dataset_id))
    return f"{BASE_URL}/{DATASETS[dataset_id]['path']}.json"


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """리다이렉트를 따라가면 urllib 이 AUTH_KEY 헤더까지 새 주소로 복사한다. 따라가지 않는다."""
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise urllib.error.HTTPError(req.full_url, code, 'redirect refused', headers, fp)


_OPENER = urllib.request.build_opener(_NoRedirect)


def http_get(url, headers, timeout=TIMEOUT_SECONDS):
    """한 번의 GET. (status, body_bytes) 를 돌려주고 HTTP 오류는 상태코드로 돌려준다. 시험에서 통째로 바꿔 끼운다."""
    request = urllib.request.Request(url, headers=headers, method='GET')
    try:
        with _OPENER.open(request, timeout=timeout) as response:
            return response.status, response.read(MAX_BODY_BYTES + 1)
    except urllib.error.HTTPError as error:
        with error:
            try:
                body = error.read(MAX_BODY_BYTES + 1)
            except Exception:
                body = b''
            return error.code, body


def parse_krx_number(text):
    """쉼표 구분 숫자 문자열 → int/float. 숫자가 아니면 None(0 으로 바꾸지 않는다)."""
    if isinstance(text, bool):
        return None
    if isinstance(text, (int, float)):
        return text
    if not isinstance(text, str):
        return None
    cleaned = text.strip().replace(',', '')
    if not re.fullmatch(r'-?\d+(\.\d+)?', cleaned):
        return None
    return float(cleaned) if '.' in cleaned else int(cleaned)


def matches_ticker(isu_cd, code):
    """행의 종목코드가 우리 6자리 코드인가. 단축코드 그대로(005930)이거나 표준코드(KR7005930003)면 그 안의 6자리."""
    isu_cd = str(isu_cd or '').strip()
    if isu_cd == code:
        return 'ISU_CD_SHORT'
    if re.fullmatch(r'KR[0-9A-Z]\d{6}[0-9A-Z]{3}', isu_cd) and isu_cd[3:9] == code:
        return 'ISU_CD_ISIN'
    return None


def verify_structure(body, bas_dd):
    """응답이 계약대로인가. 아니면 사유를 돌려준다(그 응답으로는 만들지 않는다)."""
    if not isinstance(body, dict):
        return RESPONSE_SHAPE_UNEXPECTED, 'body_not_object'
    if body.get('respCode'):
        return RESPONSE_ERROR, 'respCode=' + str(body.get('respCode'))
    block = body.get('OutBlock_1')
    if not isinstance(block, list):
        return RESPONSE_SHAPE_UNEXPECTED, 'OutBlock_1_missing'
    if not block:
        return RESPONSE_EMPTY, 'no_rows'
    for index, row in enumerate(block):
        if not isinstance(row, dict):
            return RESPONSE_SHAPE_UNEXPECTED, f'row_{index}_not_object'
        missing = [field for field in REQUIRED_FIELDS if field not in row]
        if missing:
            return RESPONSE_SHAPE_UNEXPECTED, f'row_{index}_missing:' + ','.join(missing)
        if str(row.get(DATE_FIELD) or '').replace('-', '').replace('/', '') != bas_dd:
            return RESPONSE_SHAPE_UNEXPECTED, f'row_{index}_date_mismatch'
    return RESPONSE_OK, None


def fetch_daily(dataset_id, bas_dd, key, sample=False, observed_at=None):
    """기준일자 하나의 공식 응답을 받는다. 실패는 실패로 돌려준다(0건으로 바꾸지 않는다).

    반환 dict 의 body 는 파싱된 JSON 원문 그대로다. 키는 어디에도 남기지 않는다.
    """
    url = request_url(dataset_id, bas_dd, sample=sample)
    record = {'schemaVersion': 1, 'contractVersion': CONTRACT_VERSION, 'source': SOURCE,
              'portal': PORTAL, 'datasetId': dataset_id, 'datasetTitle': DATASETS[dataset_id]['title'],
              'requestUrl': url, 'requestMethod': REQUEST_METHOD, 'authHeaderName': AUTH_HEADER,
              'sampleEndpoint': bool(sample), 'basDd': bas_dd,
              'observedAt': observed_at or now_utc(), 'httpStatus': None, 'status': None, 'error': None,
              'structureVerified': False, 'rowCount': 0, 'responseRef': None, 'body': None}
    if sample:
        key = SAMPLE_PUBLIC_KEY
    if not key:
        record.update(status=AUTH_KEY_MISSING, error='auth_key_missing')
        return record
    if not sample and key == SAMPLE_PUBLIC_KEY:
        record.update(status=FORBIDDEN, error='sample_key_on_real_service_refused')
        return record
    headers = {AUTH_HEADER: key, 'User-Agent': USER_AGENT, 'Accept': 'application/json'}
    try:
        status, raw = http_get(url, headers)
    except Exception as error:      # 전송 실패. 키가 메시지에 섞였을 수 있으니 가린다.
        record.update(status=TRANSPORT_ERROR, error=redact(type(error).__name__ + ':' + str(error), key)[:200])
        return record
    record['httpStatus'] = status
    if status == RATE_LIMIT_STATUS:
        record.update(status=RATE_LIMITED, error=f'http_{status}_daily_quota')
        return record
    if status == FORBIDDEN_STATUS:
        record.update(status=FORBIDDEN, error=f'http_{status}_key_or_url_rejected')
        return record
    if status != 200:
        record.update(status=TRANSPORT_ERROR, error=f'http_{status}')
        return record
    if len(raw) > MAX_BODY_BYTES:
        record.update(status=RESPONSE_SHAPE_UNEXPECTED, error='body_too_large')
        return record
    try:
        body = json.loads(raw.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        record.update(status=RESPONSE_SHAPE_UNEXPECTED, error='non_json_body')
        return record
    kind, reason = verify_structure(body, bas_dd)
    record['status'] = kind
    if kind == RESPONSE_ERROR:
        record['error'] = redact(reason + ' ' + str(body.get('respMsg') or '')[:120], key)
        return record
    if kind == RESPONSE_SHAPE_UNEXPECTED:
        record['error'] = reason
        return record
    record.update(body=body, responseRef='sha256:' + _hash(body), rowCount=len(body['OutBlock_1']),
                  structureVerified=(kind == RESPONSE_OK))
    if kind == RESPONSE_EMPTY:
        record['error'] = 'no_rows_for_date'
    return record


# ── 원문 보존(내용주소) ─────────────────────────────────────────────────────

def _source_stem(dataset_id, bas_dd, body_hash):
    return DATASETS[dataset_id]['path'].replace('/', '-') + '_' + bas_dd + '_' + body_hash


def save_source(record, root):
    """구조가 확인된 원문 응답을 research_archive/decisions/price_sources/ 에 보존한다.

    같은 원문은 같은 파일이다(재시도 안전). 같은 (데이터셋, 기준일) 인데 원문이 다르면 둘 다 남는다 —
    읽는 쪽(load_sources)이 충돌로 표시하고 그 날짜는 쓰지 않는다. 파일 시각으로 고르지 않는다.
    """
    if not record.get('structureVerified') or record.get('sampleEndpoint'):
        raise ContractError('only structure-verified real responses are preserved')
    body_hash = _hash(record['body'])
    if record.get('responseRef') != 'sha256:' + body_hash:
        raise ContractError('response reference does not match body')
    folder = os.path.join(root, SOURCES_DIR)
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, _source_stem(record['datasetId'], record['basDd'], body_hash) + '.json.gz')
    if os.path.exists(path):
        existing = _read_source(path)
        if existing['body'] != record['body']:
            raise ContractError('source file hash collision with different body')
        return path, False
    payload = _json(record).encode('utf-8')
    tmp = path + '.tmp'
    with open(tmp, 'wb') as handle:
        handle.write(gzip.compress(payload, mtime=0))
        handle.flush()
        os.fsync(handle.fileno())
    with open(tmp, 'rb') as handle:
        readback = handle.read()
    if gzip.decompress(readback) != payload:
        os.remove(tmp)
        raise ContractError('source readback mismatch')
    os.replace(tmp, path)
    return path, True


def _read_source(path):
    with open(path, 'rb') as handle:
        record = json.loads(gzip.decompress(handle.read()).decode('utf-8'))
    stem = os.path.basename(path)[:-len('.json.gz')]
    if not isinstance(record, dict) or _hash(record.get('body')) != stem.rsplit('_', 1)[-1]:
        raise ContractError('source hash mismatch: ' + os.path.basename(path))
    if record.get('responseRef') != 'sha256:' + stem.rsplit('_', 1)[-1]:
        raise ContractError('source reference mismatch: ' + os.path.basename(path))
    return record


def load_sources(root, dataset_ids=None, dates=None):
    """보존된 원문을 (datasetId, basDd) 로 색인한다. 같은 키에 원문이 둘이면 {'conflict': [...]} 로 표시한다."""
    folder = os.path.join(root, SOURCES_DIR)
    index = {}
    if not os.path.isdir(folder):
        return index
    wanted_paths = {DATASETS[d]['path'].replace('/', '-') for d in (dataset_ids or DATASETS)}
    for name in sorted(os.listdir(folder)):
        if not name.endswith('.json.gz'):
            continue
        parts = name[:-len('.json.gz')].split('_')
        if len(parts) < 3:
            continue
        stem_path, bas_dd = '_'.join(parts[:-2]), parts[-2]
        if stem_path not in wanted_paths or (dates and bas_dd not in dates):
            continue
        record = _read_source(os.path.join(folder, name))
        key = (record['datasetId'], record['basDd'])
        prior = index.get(key)
        if prior is None:
            index[key] = record
        elif 'conflict' in prior:
            prior['conflict'].append(record['responseRef'])
        elif prior['responseRef'] != record['responseRef']:
            index[key] = {'conflict': [prior['responseRef'], record['responseRef']]}
    return index


def find_rows(body, code):
    """응답에서 이 종목의 행을 (JSON Pointer, 행, 일치 규칙) 로 전부 찾는다(정상이면 정확히 하나)."""
    found = []
    for index, row in enumerate(body.get('OutBlock_1') or []):
        rule = matches_ticker(row.get(CODE_FIELD), code)
        if rule:
            found.append((f'/OutBlock_1/{index}', row, rule))
    return found


def excerpt(row):
    return {field: row.get(field) for field in EXCERPT_FIELDS}


def smoke(dataset_ids=None, observed_at=None):
    """키 없이 표본 엔드포인트로 응답 **구조**만 확인한다. 값은 고정 표본이라 증명에 쓰지 않는다."""
    out = {'checkedAt': observed_at or now_utc(), 'sampleDate': SAMPLE_DATE, 'datasets': {}}
    for dataset_id in (dataset_ids or list(DATASETS)):
        record = fetch_daily(dataset_id, SAMPLE_DATE, None, sample=True, observed_at=out['checkedAt'])
        seen = sorted((record['body'] or {}).get('OutBlock_1', [{}])[0].keys()) if record.get('body') else []
        out['datasets'][dataset_id] = {
            'requestUrl': record['requestUrl'], 'httpStatus': record['httpStatus'], 'status': record['status'],
            'error': record['error'], 'structureVerified': record['structureVerified'],
            'rowCount': record['rowCount'], 'fieldsSeen': seen,
            'missingFields': [f for f in REQUIRED_FIELDS if f not in seen] if seen else list(REQUIRED_FIELDS)}
    out['allVerified'] = all(d['structureVerified'] for d in out['datasets'].values())
    return out
