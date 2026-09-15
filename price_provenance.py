#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""가격 출처 원장 — "이 가격을 누구에게서 언제 받았나"를 별도 파일에 보존한다.

설계 선택(소유자 확정, 2026-09-15): **별도 출처 파일 방식**.
`data.js`의 공개 구조는 한 글자도 바꾸지 않는다. 시세 수집기가 **이미 하고 있는**
가격 요청의 응답을 그대로 이용해, 같은 회차에 `price_provenance.json`을 함께 쓴다.
출처를 만들려고 시세 API를 한 번도 더 부르지 않는다.

이 파일이 지키는 네 가지 시각(서로 다른 뜻이므로 절대 섞지 않는다):

  1. receivedAt          — 우리 시스템이 **가격 응답을 받은** 시각. 실제 관측 사실.
  2. sourceAsOf          — 공급자가 밝힌 기준시각. 네이버 itemSummary 는 주지 않으므로
                           기본값은 `None` + 상태 `NOT_PROVIDED_BY_SOURCE`(확인 불가).
  3. sourceSessionDate   — 공급자가 밝힌 거래일. 같은 이유로 확인 불가.
  4. decisionAt/capturedAt — 판단 생성시각·원장 저장시각. 이 파일은 그 둘을 만들지 않는다.

⚠️ receivedAt 은 **거래소 체결시각도, 공급자 발표시각도, 그 거래일 가격의 확정시각도
   아니다.** 그렇게 둔갑시키면 안 된다. 마찬가지로 `data.js` 의 전역 `date` 라벨은
   우리가 붙인 이름표일 뿐이라 종목별 관측시각으로 복사하지 않는다.

⚠️ provider 는 실제로 응답을 준 쪽을 그대로 적는다. 네이버에서 받았으면 NAVER_FINANCE 다.
   `source="KRX"` 로 이름만 바꿔 공식 근거로 위장하지 않는다. hash 는 자료가 같은지
   확인하는 수단이지, 공식 출처임을 인증하는 장치가 아니다.
"""
import datetime as dt
import hashlib
import json
import os

SCHEMA_VERSION = 'price_provenance_v1'

#: 실제로 응답을 준 공급자. KRX 공식 배포가 아니다.
PROVIDER = 'NAVER_FINANCE'
#: 가격 요청 경로(종목코드만 치환한다). 헤더·쿠키·인증정보는 저장하지 않는다.
REQUEST_PATH = 'https://api.finance.naver.com/service/itemSummary.naver?itemcode={code}'
#: 가격을 꺼낸 응답 필드명.
PRICE_FIELD = 'now'
#: 응답에서 우리가 실제로 쓰는 최소 필드. 이 발췌본으로 hash 를 만든다(원문 전체가 아니다).
EXCERPT_FIELDS = ('now', 'rate', 'per', 'pbr', 'eps', 'marketSum')
EXCERPT_POLICY = 'MINIMUM_CONSUMED_FIELDS_ONLY'
#: 공급자가 기준시각을 준다면 이 이름들 중 하나일 것이다. 지금은 하나도 오지 않는다.
SOURCE_AS_OF_KEYS = ('asOf', 'asOfDate', 'baseDate', 'tradeDate', 'quoteTime',
                     'localTradedAt', 'updatedAt', 'time', 'datetime')

TIME_ZONE = 'UTC'
TIME_PRECISION = 'second'
CLOCK = 'collector_local_system_clock'

# ── 종목별 상태 ────────────────────────────────────────────────────────────
#: 이번 회차에 가격 응답을 새로 받았다.
FRESH = 'FRESH'
#: 이번 가격 요청이 실패해 **이전 회차 값을 그대로 썼다.** 관측시각·출처는 원래 것을 잇는다.
REUSED_PREVIOUS = 'REUSED_PREVIOUS'
#: 이전 값을 썼는데 그 값의 출처 기록이 없다 → 출처 확인 불가. 새 시각을 붙이지 않는다.
REUSED_PREVIOUS_UNVERIFIED = 'REUSED_PREVIOUS_UNVERIFIED'

#: 공급자 기준시각 상태.
SOURCE_AS_OF_PROVIDED = 'PROVIDED'
SOURCE_AS_OF_MISSING = 'NOT_PROVIDED_BY_SOURCE'

#: 회차 단위 상태(읽는 쪽이 쓰는 값).
ROUND_OK = 'OK'
ROUND_UNAVAILABLE = 'UNAVAILABLE'

FILE_NAME = 'price_provenance.json'


class ProvenanceError(ValueError):
    """출처 기록을 읽거나 맞춰볼 수 없다. 공개 분석은 멈추지 않고 '확인 불가'로 처리한다."""


def _json(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True,
                      separators=(',', ':'), allow_nan=False)


def _hash(value):
    return hashlib.sha256(_json(value).encode('utf-8')).hexdigest()


def now_utc():
    """관측시각용 현재 시각. UTC·초 정밀도·오프셋 표기를 항상 붙인다."""
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')


def snapshot_id(stocks):
    """`data.js` 에 실제로 쓰인 stocks 딕셔너리의 내용 식별자.

    같은 숫자 묶음이면 같은 값, 한 종목이라도 다르면 다른 값이 된다.
    출처 기록과 시세 스냅샷이 **같은 입력인지** 확인하는 데 쓴다.
    """
    if not isinstance(stocks, dict):
        raise ProvenanceError('stocks 가 딕셔너리가 아니다')
    return _hash(stocks)[:32]


def source_as_of(response):
    """응답이 공급자 기준시각을 줬는지 본다. 없으면 지어내지 않고 확인 불가로 남긴다."""
    if isinstance(response, dict):
        for key in SOURCE_AS_OF_KEYS:
            value = response.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip(), SOURCE_AS_OF_PROVIDED
    return None, SOURCE_AS_OF_MISSING


def excerpt_of(response):
    """응답에서 우리가 실제로 쓰는 필드만 발췌한다(원문 전체가 아니다)."""
    if not isinstance(response, dict):
        return {}
    return {key: response[key] for key in EXCERPT_FIELDS if key in response}


def observe(price, response, received_at, detail_ok):
    """가격 응답 하나를 종목 출처 기록으로 만든다.

    `received_at` 은 **가격 응답을 받은 직후**의 시각이어야 한다. 상세 재무지표
    요청이 나중에 끝났다고 그 시각으로 바꾸면 안 된다(그래서 인자로 받는다).
    """
    as_of, as_of_state = source_as_of(response)
    return {
        'state': FRESH,
        'price': price,
        'receivedAt': received_at,
        'sourceAsOf': as_of,
        'sourceAsOfState': as_of_state,
        'sourceSessionDate': None,
        'sourceSessionDateState': SOURCE_AS_OF_MISSING,
        'excerptHash': _hash(excerpt_of(response))[:16],
        'detailMetricsOk': bool(detail_ok),
        # 운반 전용. 회차 머리말의 responseKeysSeen 을 모으는 데만 쓰고 저장 전에 버린다
        # (밑줄로 시작하는 키는 build_round 가 걷어낸다).
        '_responseKeys': sorted(response.keys()) if isinstance(response, dict) else [],
    }


def reuse(previous, price):
    """이번 가격 요청이 실패해 이전 값을 그대로 쓸 때의 기록.

    ⚠️ **이전 가격에 새 관측시각을 붙이지 않는다.** 원래 관측시각·출처를 그대로 잇고
    '이번에는 재사용한 값'이라고만 표시한다. 이전 값의 출처도 없으면 확인 불가로 둔다.
    """
    if not isinstance(previous, dict) or not previous.get('receivedAt'):
        return {'state': REUSED_PREVIOUS_UNVERIFIED, 'price': price,
                'receivedAt': None, 'sourceAsOf': None,
                'sourceAsOfState': SOURCE_AS_OF_MISSING,
                'sourceSessionDate': None,
                'sourceSessionDateState': SOURCE_AS_OF_MISSING,
                'excerptHash': None, 'detailMetricsOk': False,
                'reason': 'previous_price_provenance_missing'}
    if previous.get('price') != price:
        # 이전 회차의 출처인데 가격 숫자가 다르다 → 다른 회차의 출처를 끌어다 붙이지 않는다.
        return {'state': REUSED_PREVIOUS_UNVERIFIED, 'price': price,
                'receivedAt': None, 'sourceAsOf': None,
                'sourceAsOfState': SOURCE_AS_OF_MISSING,
                'sourceSessionDate': None,
                'sourceSessionDateState': SOURCE_AS_OF_MISSING,
                'excerptHash': None, 'detailMetricsOk': False,
                'reason': 'previous_price_value_mismatch'}
    carried = {key: previous.get(key) for key in
               ('price', 'receivedAt', 'sourceAsOf', 'sourceAsOfState',
                'sourceSessionDate', 'sourceSessionDateState', 'excerptHash')}
    carried.update(state=REUSED_PREVIOUS, detailMetricsOk=False,
                   reusedFromRoundId=previous.get('roundId') or previous.get('_roundId'),
                   reusedAtRound=True)
    return carried


def build_round(stocks_written, observations, price_label, started_at, finished_at,
                response_keys_seen=()):
    """한 회차의 출처 기록 문서를 만든다.

    `stocks_written` 은 `data.js` 에 실제로 쓰인 stocks 딕셔너리다. 여기서 뽑은
    `snapshotId` 가 "이 출처 기록은 저 시세 스냅샷의 것"이라는 연결고리가 된다.
    """
    seen = sorted({str(key) for key in response_keys_seen})
    doc = {
        'schemaVersion': SCHEMA_VERSION,
        'provider': PROVIDER,
        'providerNote': '네이버 금융 응답이다. KRX 공식 배포 자료가 아니다.',
        'requestPath': REQUEST_PATH,
        'priceField': PRICE_FIELD,
        'excerptFields': list(EXCERPT_FIELDS),
        'excerptPolicy': EXCERPT_POLICY,
        'responseKeysSeen': seen,
        'excludedKeys': [key for key in seen if key not in EXCERPT_FIELDS],
        'timeZone': TIME_ZONE,
        'timePrecision': TIME_PRECISION,
        'clock': CLOCK,
        'collectorLabel': price_label,
        'collectorLabelNote': '우리가 붙인 이름표다. 공급자가 준 기준시각이 아니다.',
        'collectorStartedAt': started_at,
        'collectorFinishedAt': finished_at,
        'snapshotId': snapshot_id(stocks_written),
        'snapshotSize': len(stocks_written),
        'stocks': {code: {key: value for key, value in observations[code].items()
                          if not key.startswith('_')}
                   for code in sorted(observations) if code in stocks_written},
    }
    doc['roundId'] = round_id(doc)
    return doc


def round_id(doc):
    """회차 내용 식별자 — `roundId` 를 뺀 나머지 전부의 해시. 한 글자만 달라도 값이 바뀐다."""
    return _hash({key: value for key, value in doc.items() if key != 'roundId'})[:24]


def counts(doc):
    """회차 집계 — 새로 받음 / 이전 값 재사용 / 출처 확인 불가."""
    rows = (doc or {}).get('stocks') or {}
    fresh = sum(1 for row in rows.values() if row.get('state') == FRESH)
    reused = sum(1 for row in rows.values() if row.get('state') == REUSED_PREVIOUS)
    unverified = sum(1 for row in rows.values()
                     if row.get('state') == REUSED_PREVIOUS_UNVERIFIED)
    detail_failed = sum(1 for row in rows.values()
                        if row.get('state') == FRESH and not row.get('detailMetricsOk'))
    as_of_missing = sum(1 for row in rows.values()
                        if row.get('sourceAsOfState') != SOURCE_AS_OF_PROVIDED)
    return {'total': len(rows), 'fresh': fresh, 'reusedPrevious': reused,
            'unverified': unverified, 'detailMetricsFailed': detail_failed,
            'sourceAsOfMissing': as_of_missing}


def path_for(here):
    return os.path.join(here, FILE_NAME)


def save_round(here, doc):
    """원자적으로 쓰고 되읽어 확인한다. 부분 저장이면 성공으로 보고하지 않는다."""
    path = path_for(here)
    body = json.dumps(doc, ensure_ascii=False, indent=1, sort_keys=True) + '\n'
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(body)
        handle.flush()
        os.fsync(handle.fileno())
    if json.loads(open(tmp, encoding='utf-8').read()) != doc:
        os.remove(tmp)
        raise ProvenanceError('출처 기록 되읽기 불일치 — 저장하지 않는다')
    os.replace(tmp, path)
    if json.loads(open(path, encoding='utf-8').read()) != doc:
        raise ProvenanceError('저장된 출처 기록 되읽기 불일치')
    return path


def load_round(here):
    """출처 기록을 읽는다. 없거나 깨졌으면 None(확인 불가) — 예외로 파이프라인을 멈추지 않는다."""
    path = path_for(here)
    if not os.path.exists(path):
        return None
    try:
        doc = json.loads(open(path, encoding='utf-8').read())
    except Exception:
        return None
    if not isinstance(doc, dict) or doc.get('schemaVersion') != SCHEMA_VERSION:
        return None
    if not isinstance(doc.get('stocks'), dict) or not doc.get('snapshotId'):
        return None
    if doc.get('roundId') != round_id(doc):
        # 저장된 뒤 내용이 바뀌었다(또는 깨졌다). 확인 불가로 둔다 — 고쳐서 쓰지 않는다.
        return None
    return doc


def previous_observations(here):
    """지난 회차의 종목별 출처(이전 값 재사용 때 원래 출처를 잇기 위해)."""
    doc = load_round(here) or {}
    rows = doc.get('stocks') or {}
    round_id = doc.get('roundId')
    return {code: dict(row, _roundId=row.get('reusedFromRoundId') or round_id)
            for code, row in rows.items() if isinstance(row, dict)}


def header(doc, stocks_written=None):
    """시세 스냅샷과 같은 입력인지 확인하고, 분석 단계로 넘길 머리말만 남긴다.

    반환: `{'state': OK|UNAVAILABLE, 'reason': ..., 'roundId': ..., 'snapshotId': ...}`
    종목별 기록은 넘기지 않는다(`auto_analysis.js` 는 브라우저가 내려받는 파일이라
    종목마다 메타데이터를 얹으면 사용자 트래픽만 늘어난다).
    """
    if not doc:
        return {'state': ROUND_UNAVAILABLE, 'reason': 'provenance_file_missing'}
    if stocks_written is not None:
        try:
            actual = snapshot_id(stocks_written)
        except ProvenanceError:
            return {'state': ROUND_UNAVAILABLE, 'reason': 'price_snapshot_unreadable'}
        if actual != doc.get('snapshotId'):
            return {'state': ROUND_UNAVAILABLE, 'reason': 'price_snapshot_mismatch'}
    return {'state': ROUND_OK, 'schemaVersion': doc.get('schemaVersion'),
            'provider': doc.get('provider'), 'requestPath': doc.get('requestPath'),
            'priceField': doc.get('priceField'),
            'excerptFields': doc.get('excerptFields'),
            'excerptPolicy': doc.get('excerptPolicy'),
            'timeZone': doc.get('timeZone'), 'timePrecision': doc.get('timePrecision'),
            'clock': doc.get('clock'),
            'collectorLabel': doc.get('collectorLabel'),
            'roundId': doc.get('roundId'), 'snapshotId': doc.get('snapshotId'),
            'counts': counts(doc)}


def link(doc, snapshot_id_expected, code, base_price):
    """한 판단이 **실제로 쓴 가격**에만 출처를 붙인다. 하나라도 어긋나면 연결을 거부한다.

    거부 사유는 숨기지 않고 그대로 돌려준다 — 확인 못 한 것을 괜찮다고 바꾸지 않는다.
    반환: `(linked_or_None, reason_or_None)`.
    """
    if not snapshot_id_expected:
        # 분석이 '어느 회차를 읽었는지'를 남기지 않았다. 출처가 있어도 붙일 근거가 없다.
        return None, 'analysis_snapshot_id_missing'
    if not doc:
        return None, 'provenance_file_missing'
    if doc.get('snapshotId') != snapshot_id_expected:
        return None, 'provenance_round_superseded'
    row = (doc.get('stocks') or {}).get(code)
    if not isinstance(row, dict):
        return None, 'ticker_not_in_provenance'
    if row.get('state') == REUSED_PREVIOUS_UNVERIFIED:
        return None, row.get('reason') or 'previous_price_provenance_missing'
    if row.get('price') != base_price:
        return None, 'price_value_mismatch'
    if not row.get('receivedAt'):
        return None, 'price_observed_at_missing'
    linked = {'linked': True,
              'provider': doc.get('provider'), 'requestPath': doc.get('requestPath'),
              'priceField': doc.get('priceField'),
              'excerptPolicy': doc.get('excerptPolicy'),
              'excerptFields': doc.get('excerptFields'),
              'excerptHash': row.get('excerptHash'),
              'roundId': doc.get('roundId'), 'snapshotId': doc.get('snapshotId'),
              'schemaVersion': doc.get('schemaVersion'),
              'receivedAt': row.get('receivedAt'),
              'sourceAsOf': row.get('sourceAsOf'),
              'sourceAsOfState': row.get('sourceAsOfState'),
              'sourceSessionDate': row.get('sourceSessionDate'),
              'sourceSessionDateState': row.get('sourceSessionDateState'),
              'priceState': row.get('state'),
              'detailMetricsOk': row.get('detailMetricsOk'),
              'timeZone': doc.get('timeZone'), 'timePrecision': doc.get('timePrecision'),
              'clock': doc.get('clock'),
              'officialPriceProof': False,
              'officialPriceProofNote':
                  '출처 기록은 공식 가격증명이 아니다. KRX 가격증명 문서는 따로 필요하다.'}
    if row.get('state') == REUSED_PREVIOUS:
        linked['reusedFromRoundId'] = row.get('reusedFromRoundId')
    return linked, None
