# -*- coding: utf-8 -*-
"""Coverage Guardian — "600종목이 정말 600종목인가"를 주기적으로 실측하는 관측자.

왜 필요한가
    tickers.js에는 600개가 있는데 data.js에는 598개만 들어오는 날이 있다.
    이때 흔한 실수가 두 가지다.
      ① "Coverage가 598로 줄었다"고 잘못 말한다 (실제로 줄어든 건 시세 수신이지
         Universe가 아니다).
      ② 안 들어온 2종목을 상장폐지로 단정하고 다른 종목으로 갈아끼운다.
    둘 다 사실을 왜곡한다. 그래서 이 모듈은 **서로 다른 4개의 숫자**를 각각 다른
    이름으로 재고, 누락 원인을 보수적으로 분류만 한다.

4개의 숫자 (절대 하나로 합치지 않는다)
    targetCoverage       : 목표 Universe 크기 (설정값 — coverage_version.CURRENT.size)
    configuredCoverage   : tickers.js에 실제로 적혀 있는 종목 수 (= Universe 크기)
    freshPriceCoverage   : data.js에서 stale이 아닌 시세를 받은 종목 수
    autoAnalysisCoverage : auto_analysis.js가 판단을 만들어낸 종목 수

    ⚠️ configuredCoverage가 600이면 Universe는 600이다. 시세가 598개만 들어왔다고
       해서 "Coverage가 598로 줄었다"고 쓰지 않는다.

⭐ 상장폐지 판정 안전장치 (2026-08-25 독립 감사 CRITICAL 수리)
    감사에서 "snapshot asOf만 최근으로 바꾼 사본 + 5분 간격 3회 실행"만으로
    DELISTED_CONFIRMED와 교체 제안서가 나오는 것이 재현됐다. 원인과 대책:

    (a) 관측 카운터가 '실행 횟수'였다 → **서로 다른 KST 날짜**로 센다.
        같은 날 몇 번을 돌려도 1회다. 여기에 더해 처음 빠진 날부터
        MIN_ELAPSED_TRADING_DAYS(10거래일)이 실제로 지나야 한다. 상장폐지는
        예고·정리매매를 거치므로 몇 시간짜리 신호가 아니다.

    (b) 증거 2개가 사실은 같은 벤더였다 → data.js 시세도, 전체시장 snapshot도
        전부 네이버(api.finance.naver.com / m.stock.naver.com)다. 네이버에서 한
        종목이 새면 두 증거가 동시에 참이 된다. 그래서 **네이버가 아닌 독립 소스**
        (KRX 상장법인목록, kind.krx.co.kr → market_universe/sector_map.json)의
        확인을 필수 조건으로 요구한다. 확인할 수 없으면 REVIEW_REQUIRED로 두고
        사람에게 넘긴다. ⚠️ krx_list.json은 이름과 달리 1차 소스가 네이버라
        (fetch_krx_list.py: fetch_naver 우선, KRX는 500건 미만일 때만 폴백)
        독립 증거로 쓰지 않는다.

    (c) 분류기 안전 방향이 거꾸로였다 → 우리가 더 많이 실패할수록 위험한 판정이
        나왔다. 두 가지 가드를 넣었다:
          · 시가총액 상위 MEGA_CAP_RANK_GUARD(300위) 이내면 상폐 판정 금지
          · 한 사이클에 MASS_MISSING_DELISTING_BLOCK(5종목) 이상이 동시에 빠지면
            그건 벤더 장애다 — 그 사이클엔 아무도 상폐로 올리지 않는다

    (d) 상폐/검토필요는 status를 RED로 올린다(WARN에 묻히면 안 된다).

무엇을 안 하는가
    · 파일 수정 0 (tickers.js·data.js·auto_analysis.js·coverage_version.py 전부 읽기만)
    · 종목 자동 교체 0
    · 네트워크 호출 0 (이미 수집된 스냅샷 파일만 읽는다)
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_DIR = os.path.join(HERE, "state")

DEFAULT_TICKERS = os.path.join(ROOT, "tickers.js")
DEFAULT_DATA_JS = os.path.join(ROOT, "data.js")
DEFAULT_AUTO_JS = os.path.join(ROOT, "auto_analysis.js")
DEFAULT_SNAPSHOT = os.path.join(ROOT, "market_universe", "full_market_latest.json.gz")
DEFAULT_UNIVERSE_STATE = os.path.join(ROOT, "market_universe", "state.json")
# 독립 소스 — probe_sector_source.py가 kind.krx.co.kr 상장법인목록에서만 만든다.
DEFAULT_KRX_CORPLIST = os.path.join(ROOT, "market_universe", "sector_map.json")
# ⚠️ 아래는 '어느 시장(KOSPI/KOSDAQ)에 있던 종목인가'를 적어 두기 위한 참고 자료일 뿐이다.
#    krx_list.json은 이름과 달리 1차 수집이 네이버라 상장폐지 판정의 독립 증거로는
#    절대 쓰지 않는다(load_krx_corplist와 혼동하지 말 것).
DEFAULT_MARKET_MAP = os.path.join(ROOT, "krx_list.json")
DEFAULT_REPORT_OUT = os.path.join(STATE_DIR, "coverage_state.json")
DEFAULT_OBSERVATIONS = os.path.join(STATE_DIR, "coverage_observations.json")

KST = datetime.timezone(datetime.timedelta(hours=9))

# ── 누락 원인 분류 ───────────────────────────────────────────────────────────
TEMP_DATA_FAILURE = "TEMP_DATA_FAILURE"          # 일시적 수집 실패 (교체 대상 아님)
LISTED_BUT_SUSPENDED = "LISTED_BUT_SUSPENDED"    # 상장돼 있으나 거래정지 (교체 대상 아님)
CORPORATE_EVENT = "CORPORATE_EVENT"              # 사명변경·합병 등 (교체 대상 아님)
DELISTED_CONFIRMED = "DELISTED_CONFIRMED"        # 상장폐지 확인 (유일한 교체 검토 대상)
PIPELINE_BUG = "PIPELINE_BUG"                    # 시장엔 멀쩡히 있는데 우리가 못 받음
REVIEW_REQUIRED = "REVIEW_REQUIRED"              # 상폐 같지만 독립 확인 불가 → 사람 확인
UNKNOWN = "UNKNOWN"                              # 근거 부족 (교체 대상 아님)

# 교체를 "검토"라도 할 수 있는 유일한 분류. 이 목록을 늘리지 말 것.
REPLACEABLE_CAUSES = (DELISTED_CONFIRMED,)
# 사람이 반드시 봐야 하는 분류 — status를 RED로 올린다.
ESCALATE_CAUSES = (DELISTED_CONFIRMED, REVIEW_REQUIRED, PIPELINE_BUG)

# ── 지속 누락 정의 (실행 횟수가 아니라 '날짜'로 센다) ───────────────────────
# 같은 날 10번을 돌려도 1일이다. 워크플로우를 자주 돌리는 것으로 상폐 확정을
# 앞당길 수 없게 만드는 것이 목적이다.
PERSISTENT_MISSING_MIN_DAYS = 3
# 처음 빠진 날부터 실제로 지나야 하는 KRX 거래일 수. 상장폐지는 상폐 예고와
# 정리매매(보통 7거래일)를 거치므로, 며칠짜리 신호로 단정하면 안 된다.
MIN_ELAPSED_TRADING_DAYS = 10

# 상장폐지 판정에 쓸 수 있는 snapshot의 최대 나이(일).
# market_universe snapshot은 수집 실패 시 last-good이 그대로 남으므로(오래될 수 있다),
# 오래된 snapshot에서 '없다'는 사실만으로 상장폐지를 단정하면 안 된다.
SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING = 3
# 독립 소스(KRX 상장법인목록)의 최대 나이(일). 상장법인 구성은 천천히 바뀌지만
# 무한정 오래된 목록으로 "지금 없다"고 말할 수는 없다.
KRX_CORPLIST_MAX_AGE_DAYS = 14

# 시가총액 상위 이 순위 안이면 상장폐지 판정 자체를 금지한다(무조건 PIPELINE_BUG).
# 대형주 오판을 정의상 불가능하게 만드는 가드다.
MEGA_CAP_RANK_GUARD = 300
# 한 사이클에 이만큼 이상이 동시에 빠지면 개별 상폐가 아니라 벤더 장애로 본다.
MASS_MISSING_DELISTING_BLOCK = 5

STATUS_PASS = "PASS"
STATUS_WARN = "WARN"
STATUS_RED = "RED"

# freshPriceCoverage가 목표 대비 이 비율보다 더 빠지면 단순 결측이 아니라 사고로 본다.
RED_MISSING_RATIO = 0.05


# ── 입력 로더 (전부 읽기 전용) ───────────────────────────────────────────────
def _read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def _parse_js_object(text, const_name):
    """`const NAME = { ... };` 형태의 순수 JSON 리터럴을 읽는다."""
    m = re.search(r"const\s+%s\s*=\s*(\{.*\})\s*;" % const_name, text, re.S)
    if not m:
        raise ValueError("%s 를 찾지 못했다" % const_name)
    return json.loads(m.group(1))


def load_configured(tickers_path=DEFAULT_TICKERS):
    """tickers.js = Universe 단일 소스. 여기 적힌 수가 configuredCoverage다."""
    text = _read_text(tickers_path)
    text = re.sub(r"^\s*//.*$", "", text, flags=re.M)
    arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", text, re.S).group(1))
    codes, names, sectors = [], {}, {}
    for row in arr:
        code = str(row.get("code") or "")
        if not code:
            continue
        codes.append(code)
        names[code] = row.get("name")
        sectors[code] = row.get("sector")
    return {"codes": codes, "names": names, "sectors": sectors}


def load_fresh_prices(data_js_path=DEFAULT_DATA_JS):
    """data.js에서 '지금 유효한 시세'가 있는 종목. stale:true는 신선하지 않다."""
    doc = _parse_js_object(_read_text(data_js_path), "LIVE_DATA")
    stocks = doc.get("stocks") or {}
    fresh, stale = [], []
    for code, row in stocks.items():
        (stale if (row or {}).get("stale") else fresh).append(str(code))
    return {"fresh": sorted(fresh), "stale": sorted(stale),
            "present": sorted(str(c) for c in stocks.keys()),
            "asOf": doc.get("date")}


def load_auto_analysis(auto_js_path=DEFAULT_AUTO_JS):
    """auto_analysis.js에서 실제로 판단이 만들어진 종목."""
    doc = _parse_js_object(_read_text(auto_js_path), "LIVE_AUTO")
    stocks = doc.get("stocks") or {}
    return {"codes": sorted(str(c) for c in stocks.keys()),
            "generatedAt": doc.get("generatedAt"),
            "coverageUniverseVersion": doc.get("coverageUniverseVersion"),
            "coverageUniverseSize": doc.get("coverageUniverseSize")}


def load_universe_snapshot(path=DEFAULT_SNAPSHOT):
    """Full Market Universe last-good snapshot. 없으면 None(추측하지 않는다)."""
    try:
        import gzip
        with gzip.open(path, "rt", encoding="utf-8") as f:
            doc = json.load(f)
    except Exception:
        return None
    items = doc.get("items")
    if not isinstance(items, list):
        return None
    by_code = {}
    for it in items:
        code = str((it or {}).get("code") or "")
        if code:
            by_code[code] = it
    return {"asOf": doc.get("asOf"), "kstDay": doc.get("kstDay"),
            "source": doc.get("source"), "rawCount": doc.get("rawCount"),
            "byCode": by_code}


def load_universe_state(path=DEFAULT_UNIVERSE_STATE):
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        return doc if isinstance(doc, dict) else None
    except Exception:
        return None


# 독립 소스로 인정하는 출처 표기 (probe_sector_source.py가 기록하는 값)
KRX_SOURCE_MARK = "krx_corplist"
# 네이버 계열 표기가 섞여 있으면 독립 증거가 아니다.
VENDOR_MARKS = ("naver", "m.stock", "finance.naver")


def load_krx_corplist(path=DEFAULT_KRX_CORPLIST):
    """독립 소스 — KRX 상장법인목록(kind.krx.co.kr)에서만 만들어진 상장사 코드 집합.

    ⚠️ 출처 검증을 통과하지 못하면 None을 돌려준다. "이름이 krx"라서가 아니라
       source 필드가 실제로 KRX 원장을 가리킬 때만 독립 증거로 쓴다.
       (krx_list.json은 1차 수집이 네이버라 여기서 쓰지 않는다.)
    """
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
    except Exception:
        return None
    if not isinstance(doc, dict):
        return None
    source = str(doc.get("source") or "")
    lowered = source.lower()
    if KRX_SOURCE_MARK not in lowered:
        return None
    if any(mark in lowered for mark in VENDOR_MARKS):
        return None
    mapping = doc.get("map")
    if not isinstance(mapping, dict) or not mapping:
        return None
    return {"asOf": doc.get("asOf"), "source": source,
            "codes": {str(c) for c in mapping.keys()}, "count": len(mapping)}


def load_market_map(path=DEFAULT_MARKET_MAP):
    """code → KOSPI/KOSDAQ. 교체 제안에서 '같은 시장 안에서 고르기'에만 쓴다.

    ⚠️ 상장폐지 판정 증거로 쓰지 않는다(이 파일의 1차 소스는 네이버다).
    """
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        items = doc.get("items") or []
    except Exception:
        return {"updated": None, "map": {}}
    return {"updated": doc.get("updated"),
            "map": {str(i.get("c")): str(i.get("m")) for i in items
                    if i.get("c") and i.get("m")}}


# ── 시간 · fingerprint ───────────────────────────────────────────────────────
def now_kst_iso(now=None):
    now = now or datetime.datetime.now(KST)
    return now.astimezone(KST).isoformat(timespec="seconds")


def _parse_iso(value):
    if not value:
        return None
    try:
        return datetime.datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:
        return None


def _aware(ts):
    return ts if ts.tzinfo else ts.replace(tzinfo=KST)


def snapshot_age_days(as_of, now=None):
    """snapshot이 며칠 묵었나. 알 수 없으면 None(=판정 근거로 쓰지 않는다)."""
    ts = _parse_iso(as_of)
    if ts is None:
        return None
    now = now or datetime.datetime.now(KST)
    return round((_aware(now) - _aware(ts)).total_seconds() / 86400.0, 2)


def _is_trading_day(day):
    """KRX 정규장이 열리는 날인가. 저장소 공용 달력을 재사용한다."""
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    try:
        from krx_calendar import is_krx_trading_day
        return is_krx_trading_day(day)
    except Exception:
        return day.weekday() < 5      # 달력을 못 읽으면 주말만 제외(보수적)


def trading_days_between(start_day, end_day):
    """start_day 다음날부터 end_day까지의 KRX 거래일 수(양 끝 중 뒤쪽 포함)."""
    if start_day is None or end_day is None or end_day <= start_day:
        return 0
    count, cursor = 0, start_day + datetime.timedelta(days=1)
    guard = 0
    while cursor <= end_day and guard < 4000:
        if _is_trading_day(cursor):
            count += 1
        cursor += datetime.timedelta(days=1)
        guard += 1
    return count


def fingerprint(code, cause):
    """같은 장애는 항상 같은 fingerprint(§20 dedupe).

    시각·실행회차를 섞지 않는다. 그래야 같은 문제로 매주 새 알림이 쌓이지 않는다.
    """
    raw = "gaeo-coverage-missing:%s:%s" % (code, cause)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


# ── 관측 이력 (지속 누락 판정의 근거) ────────────────────────────────────────
OBSERVATION_SCHEMA = 2
MAX_MISSING_DAYS_KEPT = 90


def load_observations(path=DEFAULT_OBSERVATIONS):
    """관측 이력을 읽는다. 옛 schema(v1: 실행 횟수)는 보수적으로 이관한다."""
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
    except Exception:
        return {"schemaVersion": OBSERVATION_SCHEMA, "codes": {}, "recoveries": []}
    if not isinstance(doc, dict) or not isinstance(doc.get("codes"), dict):
        return {"schemaVersion": OBSERVATION_SCHEMA, "codes": {}, "recoveries": []}
    if int(doc.get("schemaVersion") or 1) >= OBSERVATION_SCHEMA:
        return doc
    # v1 → v2 이관: '실행 횟수'는 날짜 근거가 아니므로 버린다. firstMissingAt이
    # 있으면 그 하루만 관측된 것으로 본다(과대평가 금지 = 안전한 방향).
    migrated = {}
    for code, entry in (doc.get("codes") or {}).items():
        first = (entry or {}).get("firstMissingAt")
        day = str(first)[:10] if first else None
        migrated[code] = {"missingDays": [day] if day else [],
                          "firstMissingAt": first,
                          "lastMissingAt": (entry or {}).get("lastMissingAt")}
    return {"schemaVersion": OBSERVATION_SCHEMA, "codes": migrated,
            "recoveries": list(doc.get("recoveries") or []),
            "migratedFrom": doc.get("schemaVersion") or 1}


def update_observations(previous, missing_codes, configured_codes, now_iso):
    """누락 관측을 '날짜 단위'로 누적한다.

    · 같은 KST 날짜의 중복 관측은 1회로 합산한다(실행을 자주 한다고 상폐가
      빨라지면 안 된다 — 2026-08-25 독립 감사 CRITICAL).
    · 이번에 돌아왔으면 '회복 기록'만 남기고 이력을 지운다.
    · Universe에서 아예 빠진 코드는 관측 대상이 아니므로 정리한다.
    """
    previous = previous if isinstance(previous, dict) else {}
    old = dict(previous.get("codes") or {})
    recoveries = list(previous.get("recoveries") or [])
    missing = set(missing_codes)
    configured = set(configured_codes)
    day = str(now_iso)[:10]

    new_codes = {}
    for code in sorted(missing):
        entry = dict(old.get(code) or {})
        days = [d for d in (entry.get("missingDays") or []) if d]
        if day not in days:
            days.append(day)
        days = sorted(set(days))[-MAX_MISSING_DAYS_KEPT:]
        first = entry.get("firstMissingAt") or now_iso
        # 날짜 목록이 더 이른 날을 가리키면 그쪽을 신뢰한다
        if days and days[0] < str(first)[:10]:
            first = days[0] + "T00:00:00+09:00"
        new_codes[code] = {"missingDays": days, "firstMissingAt": first,
                           "lastMissingAt": now_iso}

    for code, entry in old.items():
        if code in missing or code not in configured:
            continue
        days = [d for d in ((entry or {}).get("missingDays") or []) if d]
        if days:
            recoveries.append({"code": code, "recoveredAt": now_iso,
                               "missingDayCount": len(days),
                               "firstMissingAt": (entry or {}).get("firstMissingAt")})

    recoveries = recoveries[-200:]
    return {"schemaVersion": OBSERVATION_SCHEMA, "updatedAt": now_iso,
            "codes": new_codes, "recoveries": recoveries}


def missing_day_count(observation):
    """서로 다른 KST 날짜로 몇 번 빠진 것을 봤나."""
    return len([d for d in ((observation or {}).get("missingDays") or []) if d])


def elapsed_trading_days(observation, now):
    """처음 빠진 날 이후 실제로 지난 KRX 거래일 수."""
    first = _parse_iso((observation or {}).get("firstMissingAt"))
    if first is None:
        return 0
    return trading_days_between(_aware(first).astimezone(KST).date(),
                                _aware(now).astimezone(KST).date())


def is_persistent(observation, now):
    """'지속 누락'인가 — 날짜 수와 경과 거래일 **둘 다** 충족해야 한다."""
    return (missing_day_count(observation) >= PERSISTENT_MISSING_MIN_DAYS and
            elapsed_trading_days(observation, now) >= MIN_ELAPSED_TRADING_DAYS)


def cap_ranks(snapshot):
    """snapshot 안에서 시가총액 내림차순 순위(1위부터). cap이 없으면 순위 없음."""
    items = [(str(i.get("code")), i.get("cap"))
             for i in (snapshot or {}).get("byCode", {}).values()
             if isinstance(i.get("cap"), (int, float)) and not isinstance(i.get("cap"), bool)
             and i.get("cap") > 0]
    items.sort(key=lambda kv: (-kv[1], kv[0]))
    return {code: rank for rank, (code, _) in enumerate(items, start=1)}


def krx_evidence(krx, observation, now):
    """독립 소스 증거를 쓸 수 있는가. (사용가능여부, 설명)."""
    if not krx:
        return False, ("독립 소스(KRX 상장법인목록)를 읽지 못했거나 출처 검증에 "
                       "실패했다. 네이버 계열 자료는 독립 증거로 쓰지 않는다")
    age = snapshot_age_days(krx.get("asOf"), now)
    if age is None:
        return False, "독립 소스의 수집 시각을 해석하지 못했다"
    if age > KRX_CORPLIST_MAX_AGE_DAYS:
        return False, ("독립 소스가 %.1f일 지나 기준(%d일)보다 오래됐다"
                       % (age, KRX_CORPLIST_MAX_AGE_DAYS))
    first = _parse_iso((observation or {}).get("firstMissingAt"))
    krx_ts = _parse_iso(krx.get("asOf"))
    if first is not None and krx_ts is not None and _aware(krx_ts) < _aware(first):
        return False, ("독립 소스가 우리가 못 받기 시작한 시점(%s)보다 먼저 수집된 "
                       "자료(%s)라 그 부재를 독립 증거로 쓸 수 없다"
                       % (str(first)[:10], str(krx.get("asOf"))[:10]))
    return True, "독립 소스(%s, %.1f일 경과) 확인 가능" % (krx.get("source"), age)


# ── 누락 원인 분류 ───────────────────────────────────────────────────────────
def classify_missing(code, *, configured_name=None, snapshot=None, snapshot_age=None,
                     observation=None, now=None, krx=None, cap_rank=None,
                     mass_missing=False):
    """누락 원인 1건을 보수적으로 분류한다. (cause, evidence[])를 돌려준다.

    보수성 규칙(어기지 말 것):
      · DELISTED_CONFIRMED는 아래를 **전부** 만족할 때만 나온다.
          ① 충분히 최신인 전체시장 snapshot에서 부재
          ② 서로 다른 날짜로 PERSISTENT_MISSING_MIN_DAYS일 이상 관측
          ③ 처음 빠진 날부터 MIN_ELAPSED_TRADING_DAYS 거래일 경과
          ④ 그 사이클에 대량 누락(벤더 장애 의심)이 아님
          ⑤ 시가총액 상위 MEGA_CAP_RANK_GUARD 밖
          ⑥ 보통주 코드(끝자리 0)
          ⑦ 네이버가 아닌 독립 소스(KRX 상장법인목록)에서도 부재 확인
        하나라도 어긋나면 DELISTED_CONFIRMED가 아니다.
      · 상폐처럼 보이지만 ⑦을 확인할 수 없으면 REVIEW_REQUIRED(사람 확인 요청)다.
      · TEMP_DATA_FAILURE / LISTED_BUT_SUSPENDED / CORPORATE_EVENT / PIPELINE_BUG /
        REVIEW_REQUIRED / UNKNOWN 은 전부 교체 대상이 아니다.
    """
    now = now or datetime.datetime.now(KST)
    evidence = []
    days = missing_day_count(observation)
    elapsed = elapsed_trading_days(observation, now)
    persistent = is_persistent(observation, now)
    evidence.append("서로 다른 날짜로 %d일 관측 (지속 누락 기준 %d일)"
                    % (days, PERSISTENT_MISSING_MIN_DAYS))
    evidence.append("처음 빠진 날 이후 %d거래일 경과 (기준 %d거래일)"
                    % (elapsed, MIN_ELAPSED_TRADING_DAYS))

    if snapshot is None:
        evidence.append("전체시장 snapshot을 읽지 못함: 상장 여부를 확인할 근거 없음")
        return UNKNOWN, evidence

    if snapshot_age is None:
        evidence.append("snapshot asOf를 해석하지 못함: 신선도 불명")
    else:
        evidence.append("snapshot asOf %s (%.2f일 경과)"
                        % (snapshot.get("asOf"), snapshot_age))

    item = (snapshot.get("byCode") or {}).get(code)

    if item is not None:
        evidence.append("전체시장 snapshot에 존재: kind=%s basis=%s tradable=%s"
                        % (item.get("kind"), item.get("basis"), item.get("tradable")))
        if cap_rank:
            evidence.append("시가총액 순위 %d위" % cap_rank)
        if item.get("tradable") is False:
            evidence.append("거래불가 상태: 상장은 유지되고 시세만 안 들어오는 것이 자연스럽다")
            return LISTED_BUT_SUSPENDED, evidence
        snap_name = (item.get("name") or "").strip()
        if configured_name and snap_name and snap_name != str(configured_name).strip():
            evidence.append("종목명 불일치: tickers.js '%s' vs snapshot '%s'"
                            % (configured_name, snap_name))
            return CORPORATE_EVENT, evidence
        if persistent:
            evidence.append("시장에는 정상 거래 종목으로 있는데 우리 수집만 계속 실패")
            return PIPELINE_BUG, evidence
        evidence.append("시장에는 정상 거래 종목으로 있고 누락도 아직 지속적이지 않음")
        return TEMP_DATA_FAILURE, evidence

    evidence.append("전체시장 snapshot에 없음")

    if snapshot_age is None or snapshot_age > SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING:
        evidence.append("그러나 snapshot이 상장폐지 판정 기준(%d일)보다 오래됐거나 신선도 "
                        "불명이다. 부재를 상장폐지 근거로 쓸 수 없다"
                        % SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING)
        return UNKNOWN, evidence

    if not persistent:
        evidence.append("snapshot은 충분히 최신이지만 지속 누락 기준(날짜 %d일 + 경과 "
                        "%d거래일)을 아직 못 채웠다"
                        % (PERSISTENT_MISSING_MIN_DAYS, MIN_ELAPSED_TRADING_DAYS))
        return UNKNOWN, evidence

    if mass_missing:
        evidence.append("같은 사이클에 %d종목 이상이 동시에 빠졌다: 개별 상장폐지가 아니라 "
                        "수집 장애로 본다" % MASS_MISSING_DELISTING_BLOCK)
        return PIPELINE_BUG, evidence

    if cap_rank and cap_rank <= MEGA_CAP_RANK_GUARD:
        evidence.append("시가총액 상위 %d위 이내(%d위): 대형주는 상장폐지 판정을 금지한다"
                        % (MEGA_CAP_RANK_GUARD, cap_rank))
        return PIPELINE_BUG, evidence

    if not re.match(r"^\d{6}$", str(code)) or str(code)[-1] != "0":
        evidence.append("보통주 코드(끝자리 0)가 아니다: KRX 상장법인목록은 법인 단위라 "
                        "종류주의 부재를 상장폐지 근거로 쓸 수 없다")
        return REVIEW_REQUIRED, evidence

    usable, why = krx_evidence(krx, observation, now)
    evidence.append(why)
    if not usable:
        evidence.append("독립 확인이 불가능하므로 상장폐지로 단정하지 않는다. 사람 확인 필요")
        return REVIEW_REQUIRED, evidence

    if code in (krx.get("codes") or set()):
        evidence.append("독립 소스(KRX 상장법인목록)에는 여전히 상장사로 있다: "
                        "우리 수집·벤더 문제로 본다")
        return PIPELINE_BUG, evidence

    evidence.append("독립 소스(KRX 상장법인목록)에도 없다: 서로 다른 두 출처가 모두 부재를 "
                    "확인했다")
    return DELISTED_CONFIRMED, evidence


# ── 보고서 ───────────────────────────────────────────────────────────────────
def _coverage_version_module():
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    import coverage_version
    return coverage_version


def _target_coverage():
    """목표 Universe 크기. 코드에 600을 박지 않고 Coverage Version 설정에서 읽는다."""
    cv = _coverage_version_module()
    return int(cv.CURRENT["size"]), cv.CURRENT["version"]


def build_report(*, configured, fresh, auto, snapshot, universe_state,
                 observations, krx=None, market_map=None, now=None):
    """4개 숫자 + 누락 분류 + 전체 상태."""
    now = now or datetime.datetime.now(KST)
    now_iso = now_kst_iso(now)
    target, target_version = _target_coverage()

    configured_codes = list(configured["codes"])
    configured_set = set(configured_codes)
    fresh_set = set(fresh["fresh"])
    auto_set = set(auto["codes"])

    missing_price = sorted(configured_set - fresh_set)
    missing_auto = sorted(configured_set - auto_set)
    extra_price = sorted(fresh_set - configured_set)
    extra_auto = sorted(auto_set - configured_set)

    age = snapshot_age_days(snapshot.get("asOf") if snapshot else None, now)
    new_obs = update_observations(observations, missing_price, configured_codes, now_iso)
    ranks = cap_ranks(snapshot)
    markets = (market_map or {}).get("map") or {}
    mass_missing = len(missing_price) >= MASS_MISSING_DELISTING_BLOCK

    findings = []
    for code in missing_price:
        obs = (new_obs["codes"] or {}).get(code)
        cause, evidence = classify_missing(
            code,
            configured_name=configured["names"].get(code),
            snapshot=snapshot, snapshot_age=age, observation=obs, now=now,
            krx=krx, cap_rank=ranks.get(code), mass_missing=mass_missing)
        findings.append({
            "code": code,
            "name": configured["names"].get(code),
            "sector": configured["sectors"].get(code),
            "cause": cause,
            "replaceable": cause in REPLACEABLE_CAUSES,
            "missingDayCount": missing_day_count(obs),
            "elapsedTradingDays": elapsed_trading_days(obs, now),
            "firstMissingAt": (obs or {}).get("firstMissingAt"),
            "capRank": ranks.get(code),
            "market": (((snapshot or {}).get("byCode") or {}).get(code) or {}).get("market")
                      or markets.get(code),
            "inAutoAnalysis": code in auto_set,
            "evidence": evidence,
            "fingerprint": fingerprint(code, cause),
        })

    cause_counts = {}
    for f in findings:
        cause_counts[f["cause"]] = cause_counts.get(f["cause"], 0) + 1

    reasons = []
    status = STATUS_PASS
    if len(configured_codes) != target:
        status = STATUS_RED
        reasons.append("configuredCoverage(%d)가 목표(%d)와 다르다. Universe 자체가 바뀌었다"
                       % (len(configured_codes), target))
    escalated = {c: cause_counts.get(c, 0) for c in ESCALATE_CAUSES if cause_counts.get(c)}
    if escalated:
        status = STATUS_RED
        reasons.append("사람이 확인해야 하는 분류가 있다: %s"
                       % ", ".join("%s %d건" % (k, v) for k, v in sorted(escalated.items())))
    if target and len(missing_price) / float(target) > RED_MISSING_RATIO:
        status = STATUS_RED
        reasons.append("시세 누락 %d종목: 목표의 %.0f%%를 넘는다"
                       % (len(missing_price), RED_MISSING_RATIO * 100))
    if status != STATUS_RED and (missing_price or missing_auto or extra_price or extra_auto):
        status = STATUS_WARN
        if missing_price:
            reasons.append("시세 누락 %d종목 (원인: %s)"
                           % (len(missing_price),
                              ", ".join("%s %d" % (k, v)
                                        for k, v in sorted(cause_counts.items()))))
        if missing_auto:
            reasons.append("자동분석 누락 %d종목" % len(missing_auto))
        if extra_price or extra_auto:
            reasons.append("Universe 밖 종목이 산출물에 있음 (시세 %d · 자동분석 %d)"
                           % (len(extra_price), len(extra_auto)))

    krx_age = snapshot_age_days((krx or {}).get("asOf"), now) if krx else None
    return {
        "schemaVersion": 2,
        "generatedAt": now_iso,
        "status": status,
        "statusReasons": reasons,
        "coverageVersion": target_version,
        "targetCoverage": target,
        "configuredCoverage": len(configured_codes),
        "freshPriceCoverage": len(fresh_set),
        "autoAnalysisCoverage": len(auto_set),
        "stalePriceCount": len(fresh["stale"]),
        "universeNote": ("configuredCoverage가 Universe 크기다. 시세·자동분석 숫자가 "
                         "작다고 해서 Universe가 줄어든 것이 아니다."),
        "missingPriceCodes": missing_price,
        "missingAutoAnalysisCodes": missing_auto,
        "extraPriceCodes": extra_price,
        "extraAutoAnalysisCodes": extra_auto,
        "causeCounts": cause_counts,
        "replaceableCount": sum(1 for f in findings if f["replaceable"]),
        "massMissingBlockActive": mass_missing,
        "findings": findings,
        "recoveries": new_obs["recoveries"][-20:],
        "delistingRules": {
            "persistentMissingMinDays": PERSISTENT_MISSING_MIN_DAYS,
            "minElapsedTradingDays": MIN_ELAPSED_TRADING_DAYS,
            "snapshotMaxAgeDays": SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING,
            "krxCorplistMaxAgeDays": KRX_CORPLIST_MAX_AGE_DAYS,
            "megaCapRankGuard": MEGA_CAP_RANK_GUARD,
            "massMissingBlock": MASS_MISSING_DELISTING_BLOCK,
            "note": ("상장폐지 확정에는 서로 다른 벤더의 부재 확인이 함께 필요하다. "
                     "시세와 전체시장 snapshot은 같은 네이버 계열이라 하나의 증거로 본다."),
        },
        "independentSource": {
            "path": os.path.relpath(DEFAULT_KRX_CORPLIST, ROOT),
            "available": krx is not None,
            "source": (krx or {}).get("source"),
            "asOf": (krx or {}).get("asOf"),
            "ageDays": krx_age,
            "listedCount": (krx or {}).get("count"),
            "freshEnough": (krx_age is not None and krx_age <= KRX_CORPLIST_MAX_AGE_DAYS),
        },
        "snapshot": {
            "path": os.path.relpath(DEFAULT_SNAPSHOT, ROOT),
            "available": snapshot is not None,
            "asOf": (snapshot or {}).get("asOf"),
            "ageDays": age,
            "freshEnoughForDelisting": (age is not None and
                                        age <= SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING),
            "itemCount": len((snapshot or {}).get("byCode") or {}),
            "collectorStatus": (universe_state or {}).get("status"),
            "collectorAsOf": (universe_state or {}).get("asOf"),
        },
        "priceAsOf": fresh.get("asOf"),
        "autoAnalysisGeneratedAt": auto.get("generatedAt"),
        "autoAnalysisStamp": {
            "coverageUniverseVersion": auto.get("coverageUniverseVersion"),
            "coverageUniverseSize": auto.get("coverageUniverseSize"),
        },
        "_observations": new_obs,
    }


def run(*, tickers_path=DEFAULT_TICKERS, data_js_path=DEFAULT_DATA_JS,
        auto_js_path=DEFAULT_AUTO_JS, snapshot_path=DEFAULT_SNAPSHOT,
        universe_state_path=DEFAULT_UNIVERSE_STATE,
        krx_corplist_path=DEFAULT_KRX_CORPLIST, market_map_path=DEFAULT_MARKET_MAP,
        observations_path=DEFAULT_OBSERVATIONS, report_out=DEFAULT_REPORT_OUT,
        write=True, now=None):
    report = build_report(
        configured=load_configured(tickers_path),
        fresh=load_fresh_prices(data_js_path),
        auto=load_auto_analysis(auto_js_path),
        snapshot=load_universe_snapshot(snapshot_path),
        universe_state=load_universe_state(universe_state_path),
        observations=load_observations(observations_path),
        krx=load_krx_corplist(krx_corplist_path),
        market_map=load_market_map(market_map_path),
        now=now)
    obs = report.pop("_observations")
    if write:
        write_json(observations_path, obs)
        write_json(report_out, report)
    return report


def write_json(path, doc):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Coverage Guardian (읽기 전용 관측)")
    p.add_argument("--tickers", default=DEFAULT_TICKERS)
    p.add_argument("--data-js", default=DEFAULT_DATA_JS)
    p.add_argument("--auto-js", default=DEFAULT_AUTO_JS)
    p.add_argument("--snapshot", default=DEFAULT_SNAPSHOT)
    p.add_argument("--universe-state", default=DEFAULT_UNIVERSE_STATE)
    p.add_argument("--krx-corplist", default=DEFAULT_KRX_CORPLIST)
    p.add_argument("--market-map", default=DEFAULT_MARKET_MAP)
    p.add_argument("--observations", default=DEFAULT_OBSERVATIONS)
    p.add_argument("--out", default=DEFAULT_REPORT_OUT)
    p.add_argument("--dry-run", action="store_true", help="파일을 쓰지 않고 결과만 출력")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    report = run(tickers_path=args.tickers, data_js_path=args.data_js,
                 auto_js_path=args.auto_js, snapshot_path=args.snapshot,
                 universe_state_path=args.universe_state,
                 krx_corplist_path=args.krx_corplist,
                 market_map_path=args.market_map,
                 observations_path=args.observations, report_out=args.out,
                 write=not args.dry_run)
    print("[coverage-guardian] status=%s target=%d configured=%d freshPrice=%d auto=%d "
          "missing=%d replaceable=%d"
          % (report["status"], report["targetCoverage"], report["configuredCoverage"],
             report["freshPriceCoverage"], report["autoAnalysisCoverage"],
             len(report["missingPriceCodes"]), report["replaceableCount"]))
    ind = report["independentSource"]
    print("  독립 소스: available=%s asOf=%s (%s일 경과) 상장사 %s개"
          % (ind["available"], ind["asOf"], ind["ageDays"], ind["listedCount"]))
    for f in report["findings"]:
        print("  - %s %s → %s (관측 %d일 · 경과 %d거래일) %s"
              % (f["code"], f["name"], f["cause"], f["missingDayCount"],
                 f["elapsedTradingDays"], f["fingerprint"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
