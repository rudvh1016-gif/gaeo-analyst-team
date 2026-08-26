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
REVIEW_REQUIRED = "REVIEW_REQUIRED"              # 판정 근거가 모자람 → 사람 확인
# 상폐처럼 보이지만 '독립 원장이 낡거나 못 믿을 상태'라 판단을 보류한 것.
# REVIEW_REQUIRED와 나눠 놓은 이유: 이건 종목 문제가 아니라 우리 자료 갱신 문제이고,
# 독립 원장이 자동 갱신되지 않는 현재 구조에서는 매주 반복된다. 같은 RED로 묶으면
# 경보 피로가 생겨 진짜 사고를 가린다(2026-08-25 퀀트 재감사 MEDIUM).
INDEPENDENT_SOURCE_STALE = "INDEPENDENT_SOURCE_STALE"
# 전체시장 snapshot 자체를 믿을 수 없어 '부재'를 근거로 쓸 수 없는 상태.
# 종목 문제가 아니라 우리 수집 문제이므로 RED가 아니라 주의 계열로 둔다
# (수집이 조금 흔들릴 때마다 RED가 되면 경보 피로로 진짜 사고를 가린다).
MARKET_DATA_UNRELIABLE = "MARKET_DATA_UNRELIABLE"
UNKNOWN = "UNKNOWN"                              # 근거 부족 (교체 대상 아님)

# 교체를 "검토"라도 할 수 있는 유일한 분류. 이 목록을 늘리지 말 것.
REPLACEABLE_CAUSES = (DELISTED_CONFIRMED,)
# 즉시 사람이 봐야 하는 분류 — status를 RED로 올린다.
ESCALATE_RED_CAUSES = (DELISTED_CONFIRMED, PIPELINE_BUG)
# 봐야 하지만 RED는 아닌 분류 — status는 WARN이되 알림에 항상 따로 표시한다.
ESCALATE_ATTENTION_CAUSES = (REVIEW_REQUIRED, INDEPENDENT_SOURCE_STALE,
                             MARKET_DATA_UNRELIABLE)
ESCALATE_CAUSES = ESCALATE_RED_CAUSES + ESCALATE_ATTENTION_CAUSES

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
# 독립 원장의 최소 법인 수. 상류(probe_sector_source.py)는 유효한 6자리 코드가
# 1개만 있어도 status="OK"로 보고 맵을 덮어쓰므로, KRX 응답이 잘리면 3건짜리
# 원장이 그대로 저장될 수 있다. 그런 원장으로는 "이 종목이 없다"고 말할 수 없다.
# (실측 2,596법인의 약 77% 선. 2026-08-25 퀀트 재감사 HIGH-2)
KRX_CORPLIST_MIN_COUNT = 2000
# 상류가 스스로 기록한 crosswalk 게이트 판정. GATE_FAIL이면 채택하지 않는다.
KRX_CORPLIST_REJECT_GATES = ("GATE_FAIL",)

# 시가총액 상위 이 순위 안이면 상장폐지 판정 자체를 금지한다(무조건 PIPELINE_BUG).
# 대형주 오판을 정의상 불가능하게 만드는 가드다.
MEGA_CAP_RANK_GUARD = 300
# 순위만으로는 부족하다. 시장 전체 시총이 오르면 같은 회사도 순위가 밀리고, 순위
# 경계는 칼날처럼 좁다(실측: 300위 1.612조 / 301위 1.610조). 그래서 절대 시총이
# 이 값 이상이면 순위와 무관하게 상폐 판정을 금지한다.
# (2026-08-26 퀀트 3차 감사 HIGH-3)
MEGA_CAP_ABS_FLOOR = 1.0e12          # 1조원
# 시총 기억을 며칠치까지 보관하나. 이 창 안에서 '가장 안전한 값'을 골라 쓴다.
CAP_MEMORY_DAYS_KEPT = 90
# 크기를 근거로 **상폐를 허용하려면** 서로 다른 날짜로 이만큼은 관측돼 있어야 한다.
# 표본이 1건이면 '가장 안전한 값 고르기'가 아무 일도 하지 않는다(1건의 min/max는
# 그 1건이다). 즉 하루짜리 이상값 하나가 곧 마지막 기억이 된다
# (2026-08-26 퀀트 4차 감사 CRITICAL-4: 실제로 저장소의 597종목 전부 이력 1건이었다).
# ⚠️ 비대칭 규칙이다 — 표본이 얇아도 **보호하는 방향**으로는 그대로 쓴다.
#    표본이 필요한 것은 보호를 걷어낼 때뿐이다.
CAP_MEMORY_MIN_SAMPLES = 3
# 시가총액 순위가 이 값을 넘으면 물리적으로 말이 안 된다. 실측 전체 상장상품이
# 3,922개이고 보통주만 세면 2,600개 남짓이다. 상태파일이 손상·위조됐을 때 걸러 내기
# 위한 상한이라 넉넉하게 잡되, 말이 되는 범위는 벗어나지 않게 둔다.
MAX_PLAUSIBLE_CAP_RANK = 5000
# 한 사이클에 이만큼 이상이 동시에 빠지면 개별 상폐가 아니라 벤더 장애로 본다.
MASS_MISSING_DELISTING_BLOCK = 5
# 한 사이클에 이만큼 이상이 동시에 '시장 자료에서' 사라지면 개별 상폐가 아니다.
# (시세 누락 수를 세던 기존 가드는 부재 시계로 바꾼 뒤 이 사건을 못 센다 —
#  2026-08-26 퀀트 3차 감사 HIGH-4)
# ⚠️ 이 임계값은 **이번 사이클에 새로 사라진** 종목 수에 적용한다. 누적 부재 수에
#    적용하면 정상 운영만으로도 반드시 임계에 닿는다: 실제 상폐가 확정돼야 제안서가
#    나오고, 사람이 승인해야 종목이 Universe에서 빠지는데, 확정이 막히면 종목이
#    안 빠지고 부재 수도 안 줄어 **영원히 풀리지 않는다**(자기강화형 교착).
#    실측으로 이미 012510·057050이 상시 부재라 여유가 3종목뿐이었다
#    (2026-08-26 퀀트 4차 감사 HIGH-7).
MASS_ABSENCE_DELISTING_BLOCK = 5
# 서서히 늘어나는 부재도 놓치지 않기 위한 두 번째 선. 누적 부재가 Universe의 이
# 비율을 넘으면 개별 상폐가 아니라 구조적 문제로 본다.
MASS_ABSENCE_TOTAL_RATIO = 0.05
# '동시에 사라졌다'로 볼 기간(일). 이 창 안에서 사라지기 시작한 종목만 벤더 장애
# 판정에 센다. 창이 지속누락 기준(3일 + 10거래일)보다 넉넉해야, 장애로 사라진
# 무리가 상폐로 확정되려는 바로 그 구간에 가드가 살아 있다.
# (창 없이 '이번에 새로 사라진 것'만 세면 다음 날부터 0이 되어 가드가 죽고,
#  누적으로 세면 정상 운영만으로 임계에 닿아 교체가 영구 정지한다.)
MASS_ABSENCE_WINDOW_DAYS = 21
# 전체시장 snapshot이 이보다 적은 종목만 담고 있으면 '부재'를 근거로 쓸 수 없다.
# 실측 3,922건. 상류에 완만한 열화 게이트가 없어 서서히 잘린 snapshot이 그대로
# last-good으로 남을 수 있다(2026-08-26 퀀트 3차 감사 HIGH-4).
SNAPSHOT_MIN_ITEM_COUNT = 3000
# 수집기가 스스로 기록한 상태. 이 값이 아니면 상폐 판정에 쓰지 않는다.
UNIVERSE_STATE_READY = "READY"

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
    if len(mapping) < KRX_CORPLIST_MIN_COUNT:
        # 잘린 원장은 "그 종목이 없다"의 근거가 될 수 없다. 오히려 우리 600종목
        # 대부분을 '부재'로 만들어 대량 오판을 일으킨다.
        return None
    gate = ((doc.get("crosswalkCoverage") or {}).get("gate")
            if isinstance(doc.get("crosswalkCoverage"), dict) else None)
    if gate in KRX_CORPLIST_REJECT_GATES:
        # 상류가 스스로 "이 맵은 품질 게이트를 못 넘었다"고 기록해 둔 경우다.
        return None
    return {"asOf": doc.get("asOf"), "source": source,
            "codes": {str(c) for c in mapping.keys()}, "count": len(mapping),
            "gate": gate}


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
def resolve_run_id(explicit=None):
    """이 산출물이 '어느 실행'에서 나왔는지 각인할 식별자.

    왜 날짜가 아니라 Run 식별자인가 (2026-08-25 보안 재감사 LOW-3)
        날짜만 비교하면, 같은 날 앞선 실행이 성공해 커밋해 둔 산출물이 남아 있을 때
        이번 실행이 통째로 실패해도 "오늘 날짜가 맞으니 측정됐다"고 오판한다.
        Run 식별자를 찍으면 그 구멍이 닫힌다.
    로컬 실행처럼 식별자가 없으면 None이다. 그때는 호출자가 날짜로 대신 본다.
    """
    if explicit:
        return str(explicit)
    run = os.environ.get("GITHUB_RUN_ID")
    if not run:
        return None
    return "%s-%s" % (run, os.environ.get("GITHUB_RUN_ATTEMPT") or "1")


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
OBSERVATION_SCHEMA = 3
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
    version = int(doc.get("schemaVersion") or 1)
    if version >= OBSERVATION_SCHEMA:
        return doc
    if version == 2:
        # v2 → v3 이관: 부재(absent) 시계를 새로 만든다. 과거에는 '시세 누락'만
        # 셌으므로 부재 일수를 소급 인정하지 않는다(과대평가 금지 = 안전한 방향).
        migrated2 = {}
        for code, entry in (doc.get("codes") or {}).items():
            e = dict(entry or {})
            # ⚠️ setdefault면 옛 파일에 이미 적혀 있던 absentDays를 그대로 살려 준다.
            #    이 파일은 워크플로우가 main에 자동 커밋하므로, 위조되거나 손상된
            #    값이 들어오면 첫 실행에 곧바로 상폐가 확정될 수 있다
            #    (2026-08-26 퀀트 3차 감사 MEDIUM-3에서 재현).
            #    v2에는 부재 개념 자체가 없었으니 무조건 0에서 시작한다.
            e["absentDays"] = []
            e["firstAbsentAt"] = None
            e["lastAbsentAt"] = None
            migrated2[code] = e
        return {"schemaVersion": OBSERVATION_SCHEMA, "codes": migrated2,
                "recoveries": list(doc.get("recoveries") or []),
                "capMemory": dict(doc.get("capMemory") or {}),
                "migratedFrom": 2}
    # v1 → v2 이관: '실행 횟수'는 날짜 근거가 아니므로 버린다. firstMissingAt이
    # 있으면 그 하루만 관측된 것으로 본다(과대평가 금지 = 안전한 방향).
    migrated = {}
    for code, entry in (doc.get("codes") or {}).items():
        first = (entry or {}).get("firstMissingAt")
        day = str(first)[:10] if first else None
        migrated[code] = {"missingDays": [day] if day else [],
                          "firstMissingAt": first,
                          "lastMissingAt": (entry or {}).get("lastMissingAt"),
                          "absentDays": [], "firstAbsentAt": None,
                          "lastAbsentAt": None}
    return {"schemaVersion": OBSERVATION_SCHEMA, "codes": migrated,
            "recoveries": list(doc.get("recoveries") or []),
            "migratedFrom": doc.get("schemaVersion") or 1}


def sanitize_observations(doc, now_iso):
    """상태파일을 그대로 믿지 않는다 — 스스로 앞뒤가 맞는지 검사한다.

    이 파일(coverage_observations.json)은 워크플로우가 main에 자동 커밋한다.
    즉 저장소에 쓸 수 있는 누구든(또는 손상된 실행 한 번이) 다음 판정의 입력을
    바꿀 수 있다. 그래서 읽을 때 최소한 아래를 확인한다
    (2026-08-26 퀀트 3차 감사 MEDIUM-3에서 위조 시나리오 재현).

      · 오늘보다 미래의 날짜는 버린다(미래 관측은 존재할 수 없다).
      · firstAbsentAt / firstMissingAt이 날짜 목록과 모순되면 목록을 신뢰한다.
      · 목록이 비면 대응하는 first/last 시각도 지운다.
      · capMemory 항목이 dict가 아니거나 미래 시각이면 버린다.
    이 함수는 '의심스러우면 지운다'는 방향으로만 동작한다 — 지우면 판정이
    보수적(REVIEW_REQUIRED)으로 갈 뿐, 상폐가 빨라지지 않는다.
    """
    today = str(now_iso)[:10]
    doc = doc if isinstance(doc, dict) else {}
    clean_codes = {}
    for code, entry in (doc.get("codes") or {}).items():
        if not isinstance(entry, dict):
            continue
        e = dict(entry)
        for days_key, first_key, last_key in (
                ("missingDays", "firstMissingAt", "lastMissingAt"),
                ("absentDays", "firstAbsentAt", "lastAbsentAt")):
            days = [d for d in (e.get(days_key) or [])
                    if isinstance(d, str) and len(d) == 10 and d <= today]
            days = sorted(set(days))[-MAX_MISSING_DAYS_KEPT:]
            e[days_key] = days
            if not days:
                e[first_key] = None
                e[last_key] = None
                continue
            first = e.get(first_key)
            if not isinstance(first, str) or str(first)[:10] != days[0]:
                # 날짜 목록이 유일한 사실 근거다. 시각 문자열은 거기에 맞춘다.
                e[first_key] = days[0] + "T00:00:00+09:00"
        clean_codes[code] = e

    clean_memory = {}
    for code, mem in (doc.get("capMemory") or {}).items():
        if not isinstance(mem, dict):
            continue
        m = dict(mem)
        seen = m.get("seenAt")
        if isinstance(seen, str) and str(seen)[:10] > today:
            continue
        # ⚠️ 날짜만 보고 값은 안 보면, 과거 날짜로만 채운 위조가 그대로 통과한다
        #    (2026-08-26 퀀트 4차 감사 MEDIUM-3에서 실제로 시연됐다).
        #    순위·시총은 물리적으로 말이 되는 범위 안에 있어야 한다.
        # ⭐ 앞뒤가 맞는지도 본다. capMemory는 그 종목이 **시장 자료에 있던 날**에만
        #    적힌다. 그러니 같은 날짜가 '부재한 날'로도 적혀 있으면 그 기록은
        #    자기모순이다 — 정상 운영에서는 절대 겹칠 수 없다.
        #    (2026-08-26 퀀트 4차 감사 MEDIUM-3: 과거 날짜로만 채운 위조는 날짜
        #     검사만으로는 못 걸렀다. 값 범위와 이 정합성 검사가 함께 막는다.)
        absent_days = set((clean_codes.get(code) or {}).get("absentDays") or [])
        clean_history = {}
        history = m.get("history")
        if isinstance(history, dict):
            for d, pair in history.items():
                if not (isinstance(d, str) and len(d) == 10 and d <= today):
                    continue
                if d in absent_days:
                    continue
                if not isinstance(pair, (list, tuple)) or len(pair) != 2:
                    continue
                try:
                    rank, cap = int(pair[0]), float(pair[1])
                except (TypeError, ValueError):
                    continue
                if rank < 1 or rank > MAX_PLAUSIBLE_CAP_RANK or cap <= 0:
                    continue
                clean_history[d] = [rank, cap]
        m["history"] = clean_history
        clean_memory[code] = m

    out = dict(doc)
    out["codes"] = clean_codes
    out["capMemory"] = clean_memory
    return out


def update_cap_memory(previous, configured_codes, snapshot, ranks, now_iso):
    """종목이 **아직 snapshot에 있을 때** 그때의 시가총액·순위를 기억해 둔다.

    왜 필요한가 (2026-08-25 퀀트 재감사 CRITICAL-2)
        대형주 가드는 "시총 상위 300위 이내면 상폐 판정 금지"인데, 상폐 분기는
        정의상 '종목이 snapshot에서 사라진' 경우에만 들어간다. 사라진 종목의
        순위를 snapshot에서 다시 구할 방법은 없으므로, 가드가 보던 값은 언제나
        None이었다 = 가드가 한 번도 동작한 적이 없는 죽은 코드였다.
        그래서 살아 있을 때 미리 적어 둔다.

    기억은 Universe(tickers.js) 안 종목만 남긴다. 빠진 종목의 기록은 유지한다
    (그게 바로 나중에 필요한 값이다).
    """
    memory = dict((previous or {}).get("capMemory") or {})
    configured = set(configured_codes)
    by_code = (snapshot or {}).get("byCode") or {}
    day = str(now_iso)[:10]
    for code in configured:
        item = by_code.get(code)
        if not item:
            continue
        cap = item.get("cap")
        rank = ranks.get(code)
        if rank is None or not isinstance(cap, (int, float)) or isinstance(cap, bool):
            continue
        entry = dict(memory.get(code) or {})
        history = entry.get("history")
        history = dict(history) if isinstance(history, dict) else {}
        # ⚠️ 같은 날 두 번 돌면(워크플로우 재시도 · workflow_dispatch · 로컬 실행)
        #    나중 값이 앞 값을 덮어써서, 정상 표본이 이상값으로 교체될 수 있다.
        #    같은 날짜 안에서는 '가장 안전한 쪽'만 남긴다.
        prev = history.get(day)
        new_rank, new_cap = int(rank), float(cap)
        if isinstance(prev, (list, tuple)) and len(prev) == 2:
            try:
                new_rank = min(new_rank, int(prev[0]))
                new_cap = max(new_cap, float(prev[1]))
            except (TypeError, ValueError):
                pass
        history[day] = [new_rank, new_cap]
        for old_day in sorted(history)[:-CAP_MEMORY_DAYS_KEPT]:
            history.pop(old_day, None)
        entry.update({"capRank": rank, "cap": cap,
                      "asOf": (snapshot or {}).get("asOf"), "seenAt": now_iso,
                      "history": history})
        memory[code] = entry
    # Universe에서 아예 빠진 코드의 기억은 정리한다
    return {c: v for c, v in memory.items() if c in configured}


def safest_known_size(code, cap_memory):
    """상폐 판정에 쓸 **가장 안전한** 크기. (순위, 시총, 근거문자열)을 돌려준다.

    ⚠️ 마지막 값을 그대로 쓰면 안 된다. 하루짜리 잘못된 시총 한 건으로 대형주
       가드가 통째로 무너지기 때문이다(2026-08-26 퀀트 3차 감사 CRITICAL-3:
       삼성전자 시총이 하루만 이상값으로 들어오자 기억이 덮어써지고 상장폐지
       확정 + 교체 제안서까지 재현됐다. 상류 collect_market_universe.py는 벤더가
       준 시총을 검증 없이 그대로 싣는다).
       이 시스템의 다른 판단은 전부 "여러 날 × 여러 출처가 모두 동의해야" 하는데
       마지막 방어선만 표본 1개에 매달려 있으면 안 된다.

    그래서 보관 창(CAP_MEMORY_DAYS_KEPT) 안의 모든 관측 중
        · 가장 좋은 순위(가장 작은 값)
        · 가장 큰 시가총액
    을 고른다. 둘 다 '상폐를 가장 강하게 막는 쪽'이다. 크기를 과대평가하는 방향의
    오류는 종목을 남겨 둘 뿐이지만, 과소평가하는 방향의 오류는 살아 있는 회사를
    지운다.
    """
    remembered = (cap_memory or {}).get(code)
    if not isinstance(remembered, dict):
        return None, None, 0, ("이 종목의 시가총액을 현재 snapshot에서도, 과거 관측 "
                               "기록에서도 확인할 수 없다")
    ranks_seen, caps_seen, day_samples = [], [], []
    history = remembered.get("history")
    if isinstance(history, dict):
        for day, pair in history.items():
            try:
                r, c = int(pair[0]), float(pair[1])
            except (TypeError, ValueError, IndexError, KeyError):
                continue
            if r > 0:
                ranks_seen.append(r)
            if c > 0:
                caps_seen.append(c)
            if r > 0 or c > 0:
                day_samples.append(day)
    if not ranks_seen and remembered.get("capRank"):
        # 이력이 없는 옛 기록(구버전 상태파일)도 버리지 않고 쓴다.
        try:
            ranks_seen.append(int(remembered["capRank"]))
        except (TypeError, ValueError):
            pass
    if not caps_seen and isinstance(remembered.get("cap"), (int, float)):
        caps_seen.append(float(remembered["cap"]))
    if not ranks_seen and not caps_seen:
        return None, None, 0, ("이 종목의 시가총액을 현재 snapshot에서도, 과거 관측 "
                               "기록에서도 확인할 수 없다")
    best_rank = min(ranks_seen) if ranks_seen else None
    best_cap = max(caps_seen) if caps_seen else None
    # ⚠️ 표본 수는 **서로 다른 날짜 관측 건수**다. top-level capRank 폴백은 날짜
    #    근거가 없으므로 표본으로 세지 않는다(그 값은 상태파일 위조에 그대로 노출된
    #    자리이기도 하다 — 2026-08-26 퀀트 4차 감사 MEDIUM-3).
    samples = len(day_samples)
    parts = ["최근 %d일 중 서로 다른 날짜 %d건 관측" % (CAP_MEMORY_DAYS_KEPT, samples)]
    if best_rank is not None:
        parts.append("가장 좋았던 순위 %d위" % best_rank)
    if best_cap is not None:
        parts.append("가장 컸던 시가총액 %.3f조" % (best_cap / 1e12))
    return best_rank, best_cap, samples, " · ".join(parts)


def update_observations(previous, missing_codes, configured_codes, now_iso,
                        absent_codes=()):
    """누락 관측을 '날짜 단위'로 누적한다.

    ⭐ 서로 다른 두 사건을 **따로** 센다. 섞으면 안 된다.
        · missingDays = 우리 시세(data.js)에 값이 안 들어온 날
        · absentDays  = 전체시장 snapshot에서 그 종목 자체가 안 보인 날
      "오늘 가격이 안 왔다"와 "시장 자료에 그 종목이 아예 없다"는 다른 사건이고,
      상장폐지 판정 시계는 뒤쪽으로만 재야 한다.
      (2026-08-26 발견: 시세만 60일 안 들어오던 종목이 snapshot에서 단 하루
       빠진 순간 DELISTED_CONFIRMED가 됐다. 경과 거래일 조건이 시세 시계로 이미
       충족돼 있었기 때문이다.)

    · 같은 KST 날짜의 중복 관측은 1회로 합산한다(실행을 자주 한다고 상폐가
      빨라지면 안 된다 — 2026-08-25 독립 감사 CRITICAL).
    · 이번에 돌아왔으면 '회복 기록'만 남기고 이력을 지운다.
    · Universe에서 아예 빠진 코드는 관측 대상이 아니므로 정리한다.
    """
    previous = previous if isinstance(previous, dict) else {}
    old = dict(previous.get("codes") or {})
    recoveries = list(previous.get("recoveries") or [])
    missing = set(missing_codes)
    absent = set(absent_codes)
    configured = set(configured_codes)
    day = str(now_iso)[:10]

    new_codes = {}
    # ⚠️ 추적 대상은 '시세가 안 온 종목'과 '시장 자료에서 사라진 종목'의 합집합이다.
    #    시세만 기준으로 추적하면, 시장 자료에서는 사라졌는데 시세는 계속 들어오는
    #    종목의 부재 시작 시각을 아무도 기록하지 않는다. 그러면 "한 무리가 비슷한
    #    시기에 사라졌는가"(벤더 장애 신호)를 판정할 근거 자체가 없어진다
    #    (2026-08-26 퀀트 4차 감사 HIGH-7 수리 중 발견).
    for code in sorted(missing | (absent & configured)):
        entry = dict(old.get(code) or {})
        if code in missing:
            days = [d for d in (entry.get("missingDays") or []) if d]
            if day not in days:
                days.append(day)
            days = sorted(set(days))[-MAX_MISSING_DAYS_KEPT:]
            first = entry.get("firstMissingAt") or now_iso
            # 날짜 목록이 더 이른 날을 가리키면 그쪽을 신뢰한다
            if days and days[0] < str(first)[:10]:
                first = days[0] + "T00:00:00+09:00"
            record = {"missingDays": days, "firstMissingAt": first,
                      "lastMissingAt": now_iso}
        else:
            # 시세는 정상인데 시장 자료에서만 사라진 종목 — 시세 시계는 비워 둔다.
            record = {"missingDays": [], "firstMissingAt": None,
                      "lastMissingAt": None}
        if code in absent:
            adays = [d for d in (entry.get("absentDays") or []) if d]
            if day not in adays:
                adays.append(day)
            adays = sorted(set(adays))[-MAX_MISSING_DAYS_KEPT:]
            afirst = entry.get("firstAbsentAt") or now_iso
            if adays and adays[0] < str(afirst)[:10]:
                afirst = adays[0] + "T00:00:00+09:00"
            record.update({"absentDays": adays, "firstAbsentAt": afirst,
                           "lastAbsentAt": now_iso})
        else:
            # 시장 자료에 다시 보였다 = 상장돼 있다는 뜻이다. 부재 시계를 0으로
            # 되돌린다(끊긴 부재를 이어 붙여 상폐를 앞당기지 않는다).
            record.update({"absentDays": [], "firstAbsentAt": None,
                           "lastAbsentAt": None})
        new_codes[code] = record

    for code, entry in old.items():
        if code in missing or code in absent or code not in configured:
            continue
        days = [d for d in ((entry or {}).get("missingDays") or []) if d]
        if days:
            recoveries.append({"code": code, "recoveredAt": now_iso,
                               "missingDayCount": len(days),
                               "firstMissingAt": (entry or {}).get("firstMissingAt")})

    recoveries = recoveries[-200:]
    return {"schemaVersion": OBSERVATION_SCHEMA, "updatedAt": now_iso,
            "codes": new_codes, "recoveries": recoveries,
            "capMemory": dict((previous or {}).get("capMemory") or {})}


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


def absent_day_count(observation):
    """전체시장 snapshot에서 그 종목이 안 보인 날이 서로 다른 날짜로 몇 번인가."""
    return len([d for d in ((observation or {}).get("absentDays") or []) if d])


def elapsed_absent_trading_days(observation, now):
    """시장 자료에서 처음 사라진 날 이후 실제로 지난 KRX 거래일 수."""
    first = _parse_iso((observation or {}).get("firstAbsentAt"))
    if first is None:
        return 0
    return trading_days_between(_aware(first).astimezone(KST).date(),
                                _aware(now).astimezone(KST).date())


def is_absence_persistent(observation, now):
    """'시장 자료에서의 부재'가 지속적인가 — 상폐 판정은 이 시계로만 잰다."""
    return (absent_day_count(observation) >= PERSISTENT_MISSING_MIN_DAYS and
            elapsed_absent_trading_days(observation, now)
            >= MIN_ELAPSED_TRADING_DAYS)


def is_persistent(observation, now):
    """'지속 누락'인가 — 날짜 수와 경과 거래일 **둘 다** 충족해야 한다."""
    return (missing_day_count(observation) >= PERSISTENT_MISSING_MIN_DAYS and
            elapsed_trading_days(observation, now) >= MIN_ELAPSED_TRADING_DAYS)


def cap_ranks(snapshot, common_only=True):
    """snapshot 안에서 시가총액 내림차순 순위(1위부터). cap이 없으면 순위 없음.

    ⚠️ 기본은 **보통주(COMMON)만** 줄 세운다. 전체 상장상품을 한 줄로 세우면
       ETF·ETN·우선주가 상위 자리를 먹어, "상위 300위 기업 보호"가 실제로는
       244개 기업만 보호하게 된다. 실측(2026-08-26 퀀트 3차 감사 HIGH-3):
           상위 300 = COMMON 244 · ETF 51 · CLASS_SHARE 4 · REIT 1
       그 바람에 오뚜기(339위)·하이트진로(373위) 같은 회사가 보호 밖이었다.
    """
    items = []
    for i in (snapshot or {}).get("byCode", {}).values():
        cap = (i or {}).get("cap")
        if not isinstance(cap, (int, float)) or isinstance(cap, bool) or cap <= 0:
            continue
        if common_only and (i or {}).get("kind") != "COMMON":
            continue
        items.append((str(i.get("code")), cap))
    items.sort(key=lambda kv: (-kv[1], kv[0]))
    return {code: rank for rank, (code, _) in enumerate(items, start=1)}


def snapshot_reliability(snapshot, universe_state):
    """전체시장 snapshot을 '부재'의 근거로 쓸 수 있는가. (가능여부, 설명).

    두 증인 중 하나인 snapshot에도 KRX 원장과 같은 수준의 품질 검사를 건다.
    """
    if not snapshot:
        return False, "전체시장 snapshot을 읽지 못했다"
    count = len((snapshot or {}).get("byCode") or {})
    if count < SNAPSHOT_MIN_ITEM_COUNT:
        return False, ("전체시장 snapshot이 %d종목뿐이다(기준 %d종목). 잘린 자료의 "
                       "'없음'은 부재의 근거가 될 수 없다"
                       % (count, SNAPSHOT_MIN_ITEM_COUNT))
    status = (universe_state or {}).get("status")
    if status != UNIVERSE_STATE_READY:
        return False, ("수집기가 기록한 상태가 '%s'이다(기준 '%s'). 수집기가 스스로 "
                       "정상이라고 확인해 주지 않은 자료로 상장폐지를 판정하지 않는다"
                       % (status or "알 수 없음", UNIVERSE_STATE_READY))
    return True, "전체시장 snapshot %d종목 · 수집기 상태 %s" % (count, status)


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
    # ⭐ 기준 시점은 '시장 자료에서 사라진 날'이다. 시세가 안 들어온 날로 재면
    #    (firstMissingAt <= firstAbsentAt) 검사가 원래 의도보다 느슨해져서,
    #    "종목이 사라지기 전에 만든 원장"으로 그 부재를 증명하게 된다
    #    (2026-08-26 퀀트 3차 감사 MEDIUM-4).
    obs = observation or {}
    first = _parse_iso(obs.get("firstAbsentAt") or obs.get("firstMissingAt"))
    krx_ts = _parse_iso(krx.get("asOf"))
    if first is not None and krx_ts is not None and _aware(krx_ts) < _aware(first):
        return False, ("독립 소스가 그 종목이 시장 자료에서 사라진 시점(%s)보다 먼저 "
                       "수집된 자료(%s)라 그 부재를 독립 증거로 쓸 수 없다"
                       % (str(first)[:10], str(krx.get("asOf"))[:10]))
    return True, "독립 소스(%s, %.1f일 경과) 확인 가능" % (krx.get("source"), age)


# ── 누락 원인 분류 ───────────────────────────────────────────────────────────
def classify_missing(code, *, configured_name=None, snapshot=None, snapshot_age=None,
                     observation=None, now=None, krx=None, cap_rank=None,
                     cap_rank_basis=None, mass_missing=False,
                     absence_persistent=False, cap_value=None, cap_samples=0,
                     mass_absent=False, snapshot_reliable=True,
                     snapshot_unreliable_why=None):
    """누락 원인 1건을 보수적으로 분류한다. (cause, evidence[])를 돌려준다.

    보수성 규칙(어기지 말 것):
      · DELISTED_CONFIRMED는 아래를 **전부** 만족할 때만 나온다.
          ① 충분히 최신인 전체시장 snapshot에서 부재
          ② 서로 다른 날짜로 PERSISTENT_MISSING_MIN_DAYS일 이상 관측
          ③ 처음 빠진 날부터 MIN_ELAPSED_TRADING_DAYS 거래일 경과
          ④ 그 사이클에 대량 누락(벤더 장애 의심)이 아님
          ⑤ 크기를 **알고 있고**(현재 순위 또는 마지막으로 알던 순위),
             그 순위가 MEGA_CAP_RANK_GUARD 밖
          ⑥ 보통주 코드(끝자리 0)
          ⑦ 네이버가 아닌 독립 소스(KRX 상장법인목록, 최소 법인 수·품질 게이트·
             신선도를 모두 통과한 것)에서도 부재 확인
        하나라도 어긋나면 DELISTED_CONFIRMED가 아니다.
      · ⑤에서 크기를 모르면 REVIEW_REQUIRED다. 크기를 모르는 종목을 상폐로
        확정하지 않는 것이 진짜 fail-closed다(2026-08-25 퀀트 재감사 CRITICAL-2).
      · ⑦을 확인할 수 없으면 INDEPENDENT_SOURCE_STALE(판단 보류)이다.
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

    # ⓪ 두 증인 중 하나(전체시장 snapshot)도 품질 검사를 통과해야 한다.
    #    KRX 원장에만 최소 건수·게이트 검사를 넣고 snapshot은 무검증으로 두면,
    #    서서히 잘린 snapshot이 last-good으로 남아 그 부재가 그대로 상폐 근거가
    #    된다(2026-08-26 퀀트 3차 감사 HIGH-4: snapshot 3,922 → 1,999건으로 잘린
    #    상태에서 상폐 확정 + 교체 제안서 재현. 수집기가 스스로 SOURCE_ERROR라고
    #    적어 둔 경우에도 그대로 진행됐다).
    if not snapshot_reliable:
        evidence.append(snapshot_unreliable_why or
                        "전체시장 snapshot을 믿을 수 있는 상태가 아니다")
        evidence.append("믿을 수 없는 자료의 '없음'은 부재의 근거가 아니다. "
                        "종목 문제가 아니라 우리 수집 문제일 수 있다")
        return MARKET_DATA_UNRELIABLE, evidence

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

    if mass_absent:
        evidence.append("같은 사이클에 %d종목 이상이 동시에 시장 자료에서 사라졌다: "
                        "개별 상장폐지가 아니라 수집 장애로 본다"
                        % MASS_ABSENCE_DELISTING_BLOCK)
        return PIPELINE_BUG, evidence

    # ④-2 ⭐ 상폐 시계는 '시세 누락'이 아니라 '시장 자료에서의 부재'로 잰다.
    #     위의 persistent는 "우리 시세가 안 들어온 기간"이라, 오래 PIPELINE_BUG
    #     상태였던 종목은 그 조건이 이미 충족돼 있다. 그 상태에서 snapshot이
    #     하루 흔들려 종목이 빠지면 곧바로 상폐로 확정돼 버린다(2026-08-26 재현).
    #     "가격이 오늘 안 왔다"가 상폐가 아니듯, "시장 자료에 오늘 안 보인다"도
    #     상폐가 아니다.
    if not absence_persistent:
        evidence.append("시장 자료에서 사라진 것 자체는 아직 서로 다른 날짜 %d일 + 경과 "
                        "%d거래일 기준을 못 채웠다. 시세 누락 기간이 길다는 것은 "
                        "상장폐지의 근거가 아니다"
                        % (PERSISTENT_MISSING_MIN_DAYS, MIN_ELAPSED_TRADING_DAYS))
        return UNKNOWN, evidence

    # ⑤ 크기 가드. 사라진 종목은 현재 snapshot에 순위가 없으므로, 살아 있을 때
    #    기억해 둔 순위를 쓴다. 그것마저 없으면 크기를 모르는 것이고, 크기를
    #    모르는 종목은 상폐로 확정하지 않는다(fail-closed).
    evidence.append(cap_rank_basis or "시가총액 근거 없음")
    if cap_rank is None and cap_value is None:
        evidence.append("크기를 모르는 종목은 대형주 가드를 적용할 수 없으므로 "
                        "상장폐지로 확정하지 않는다. 사람 확인 필요")
        return REVIEW_REQUIRED, evidence
    if cap_rank is not None and cap_rank <= MEGA_CAP_RANK_GUARD:
        evidence.append("보통주 시가총액 상위 %d위 이내(%d위): 대형주는 상장폐지 "
                        "판정을 금지한다" % (MEGA_CAP_RANK_GUARD, cap_rank))
        return PIPELINE_BUG, evidence
    if cap_value is not None and cap_value >= MEGA_CAP_ABS_FLOOR:
        # 순위 경계는 칼날처럼 좁다(실측 300위 1.612조 / 301위 1.610조).
        # 절대 크기로 한 번 더 받친다.
        evidence.append("시가총액 %.3f조로 절대 하한(%.0f조) 이상: 상장폐지 판정을 "
                        "금지한다" % (cap_value / 1e12, MEGA_CAP_ABS_FLOOR / 1e12))
        return PIPELINE_BUG, evidence

    # ⭐ 여기까지 왔다 = "크기가 작아서 보호 대상이 아니다"라는 판단이다.
    #    그 판단의 근거가 표본 1건뿐이면 믿을 수 없다. 하루짜리 이상값 하나가
    #    대형주를 소형주로 둔갑시킬 수 있기 때문이다(퀀트 4차 감사 CRITICAL-4).
    #    보호하는 방향으로는 표본 1건도 그대로 썼다 — 걷어낼 때만 더 요구한다.
    if cap_samples < CAP_MEMORY_MIN_SAMPLES:
        evidence.append("크기가 작다는 판단의 근거가 서로 다른 날짜 %d건뿐이다"
                        "(기준 %d건). 표본 하나가 잘못 들어오면 대형주가 소형주로 "
                        "보일 수 있으므로 상장폐지로 확정하지 않는다. 사람 확인 필요"
                        % (cap_samples, CAP_MEMORY_MIN_SAMPLES))
        return REVIEW_REQUIRED, evidence

    if not re.match(r"^\d{6}$", str(code)) or str(code)[-1] != "0":
        evidence.append("보통주 코드(끝자리 0)가 아니다: KRX 상장법인목록은 법인 단위라 "
                        "종류주의 부재를 상장폐지 근거로 쓸 수 없다")
        return REVIEW_REQUIRED, evidence

    usable, why = krx_evidence(krx, observation, now)
    evidence.append(why)
    if not usable:
        evidence.append("독립 원장을 믿을 수 없으므로 판단을 보류한다. 종목 문제가 아니라 "
                        "우리 자료 갱신 문제일 수 있다")
        return INDEPENDENT_SOURCE_STALE, evidence

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
                 observations, krx=None, market_map=None, now=None, run_id=None):
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
    # 시장 자료(snapshot)에서 그 종목 자체가 안 보이는가 = 부재.
    # snapshot을 아예 못 읽은 경우엔 전 종목을 부재로 적지 않는다(그건 우리 문제다).
    snapshot_by_code = (snapshot or {}).get("byCode") or {}
    # ⚠️ 신뢰성 판정을 부재 계산보다 **먼저** 한다. 못 믿는 자료 위에서 부재 일수를
    #    쌓아 두면 수집이 회복되는 첫날 그 일수가 통째로 인정돼 곧바로 상폐가
    #    확정된다(2026-08-26 퀀트 4차 감사 HIGH-6: 잘린 snapshot 12거래일 뒤 복구
    #    당일 DELISTED_CONFIRMED 재현). 정직한 근거는 '믿을 수 있는 자료에서의
    #    부재'뿐이다.
    snap_ok, snap_why = snapshot_reliability(snapshot, universe_state)
    # ⚠️ '시세가 안 온 종목 중 snapshot에 없는 것'만 세면 안 된다. 그러면 이 목록이
    #    항상 missing_price의 부분집합이라, 같은 임계값을 쓰는 대량누락 가드가 늘
    #    먼저 걸려 대량부재 가드가 죽은 코드가 된다. 더 중요한 것은, 시장 자료에서
    #    수백 종목이 사라졌는데 그 종목들의 시세는 계속 들어오는 상황을 아예 못
    #    세게 된다는 점이다(2026-08-26 퀀트 3차 감사 HIGH-4의 실제 시나리오).
    #    그래서 Universe 전체를 기준으로 '시장 자료에서 사라진 종목'을 센다.
    absent_codes = ([c for c in configured_codes if c not in snapshot_by_code]
                    if (snapshot_by_code and snap_ok) else [])
    observations = sanitize_observations(observations, now_iso)
    new_obs = update_observations(observations, missing_price, configured_codes,
                                  now_iso, absent_codes=absent_codes)
    ranks = cap_ranks(snapshot)
    # 살아 있는 동안 크기를 계속 기억해 둔다 — 사라진 뒤엔 이 값만이 근거다.
    new_obs["capMemory"] = update_cap_memory(observations, configured_codes, snapshot,
                                             ranks, now_iso)
    cap_memory = new_obs["capMemory"]

    # 벤더 장애는 '한 무리가 비슷한 시기에 사라지는' 사건이다.
    #   · 오래 부재이던 종목까지 누적으로 세면 정상 운영만으로 임계에 닿아 교체
    #     기능이 영구 정지한다(자기강화형 교착 — 퀀트 4차 감사 HIGH-7).
    #   · 반대로 '이번에 새로 사라진 것'만 세면 다음 날부터 0이 되어 가드가 죽는다.
    #  그래서 최근 MASS_ABSENCE_WINDOW_DAYS 안에 사라지기 시작한 종목만 센다.
    recent_absent = []
    for code in absent_codes:
        first = _parse_iso(((new_obs["codes"] or {}).get(code) or {}).get("firstAbsentAt"))
        if first is None:
            continue
        # ⚠️ 변수명을 age로 쓰면 위에서 구한 snapshot 나이를 덮어써서, 신선한
        #    snapshot이 갑자기 '19일 묵었다'가 된다(실제로 그렇게 깨졌다).
        absent_age = (_aware(now) - _aware(first)).total_seconds() / 86400.0
        if absent_age <= MASS_ABSENCE_WINDOW_DAYS:
            recent_absent.append(code)
    mass_absent_new = len(recent_absent) >= MASS_ABSENCE_DELISTING_BLOCK
    mass_absent_total = (bool(target) and
                         len(absent_codes) >= max(MASS_ABSENCE_DELISTING_BLOCK,
                                                  int(target * MASS_ABSENCE_TOTAL_RATIO)))
    mass_absent = mass_absent_new or mass_absent_total
    markets = (market_map or {}).get("map") or {}
    mass_missing = len(missing_price) >= MASS_MISSING_DELISTING_BLOCK

    findings = []
    for code in missing_price:
        obs = (new_obs["codes"] or {}).get(code)
        known_rank, known_cap, cap_samples, rank_basis = safest_known_size(
            code, cap_memory)
        cause, evidence = classify_missing(
            code,
            configured_name=configured["names"].get(code),
            snapshot=snapshot, snapshot_age=age, observation=obs, now=now,
            krx=krx, cap_rank=known_rank, cap_rank_basis=rank_basis,
            cap_value=known_cap, cap_samples=cap_samples,
            mass_missing=mass_missing,
            mass_absent=mass_absent,
            snapshot_reliable=snap_ok, snapshot_unreliable_why=snap_why,
            absence_persistent=is_absence_persistent(obs, now))
        findings.append({
            "code": code,
            "name": configured["names"].get(code),
            "sector": configured["sectors"].get(code),
            "cause": cause,
            "replaceable": cause in REPLACEABLE_CAUSES,
            "missingDayCount": missing_day_count(obs),
            "elapsedTradingDays": elapsed_trading_days(obs, now),
            "firstMissingAt": (obs or {}).get("firstMissingAt"),
            # ⭐ 상폐 판정이 실제로 보는 시계 — 시세 누락과 헷갈리지 않게 따로 적는다.
            "absentFromMarketData": code in set(absent_codes),
            "absentDayCount": absent_day_count(obs),
            "elapsedAbsentTradingDays": elapsed_absent_trading_days(obs, now),
            "firstAbsentAt": (obs or {}).get("firstAbsentAt"),
            "capRank": ranks.get(code),
            "safestKnownCapRank": known_rank,
            "safestKnownCap": known_cap,
            "capSampleCount": cap_samples,
            # 이름을 바꿔도 기존 소비자가 안 깨지게 옛 키를 함께 남긴다.
            "lastKnownCapRank": known_rank,
            "lastKnownCapBasis": rank_basis,
            "lastKnownCapAsOf": (cap_memory.get(code) or {}).get("asOf"),
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
    red_causes = {c: cause_counts.get(c, 0)
                  for c in ESCALATE_RED_CAUSES if cause_counts.get(c)}
    attention_causes = {c: cause_counts.get(c, 0)
                        for c in ESCALATE_ATTENTION_CAUSES if cause_counts.get(c)}
    if red_causes:
        status = STATUS_RED
        reasons.append("즉시 확인이 필요한 분류가 있다: %s"
                       % ", ".join("%s %d건" % (k, v) for k, v in sorted(red_causes.items())))
    if target and len(missing_price) / float(target) > RED_MISSING_RATIO:
        status = STATUS_RED
        reasons.append("시세 누락 %d종목: 목표의 %.0f%%를 넘는다"
                       % (len(missing_price), RED_MISSING_RATIO * 100))
    if attention_causes and status != STATUS_RED:
        # RED로 올리지는 않는다(경보 피로 방지). 대신 알림에 항상 따로 표시된다.
        status = STATUS_WARN
        reasons.append("사람 확인이 필요하지만 즉시 위험은 아닌 분류가 있다: %s"
                       % ", ".join("%s %d건" % (k, v)
                                   for k, v in sorted(attention_causes.items())))
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
        "schemaVersion": 3,
        "generatedAt": now_iso,
        "runId": resolve_run_id(run_id),
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
        "redCauseCounts": red_causes,
        "attentionCauseCounts": attention_causes,
        "attentionCount": sum(attention_causes.values()),
        "massMissingBlockActive": mass_missing,
        "massAbsenceBlockActive": mass_absent,
        "massAbsenceNewActive": mass_absent_new,
        "massAbsenceTotalActive": mass_absent_total,
        "absentFromMarketDataCount": len(absent_codes),
        "recentlyAbsentCount": len(recent_absent),
        "snapshotReliable": snap_ok,
        "snapshotReliabilityNote": snap_why,
        "capMemorySize": len(cap_memory),
        "findings": findings,
        "recoveries": new_obs["recoveries"][-20:],
        "delistingRules": {
            "persistentMissingMinDays": PERSISTENT_MISSING_MIN_DAYS,
            "minElapsedTradingDays": MIN_ELAPSED_TRADING_DAYS,
            "clockNote": ("상장폐지 판정 시계는 '우리 시세가 안 들어온 기간'이 아니라 "
                          "'전체시장 자료에서 그 종목이 안 보인 기간'으로 잰다. "
                          "두 기준을 모두 충족해야 한다."),
            "snapshotMaxAgeDays": SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING,
            "krxCorplistMaxAgeDays": KRX_CORPLIST_MAX_AGE_DAYS,
            "krxCorplistMinCount": KRX_CORPLIST_MIN_COUNT,
            "megaCapRankGuard": MEGA_CAP_RANK_GUARD,
            "megaCapAbsFloor": MEGA_CAP_ABS_FLOOR,
            "megaCapRankBasis": ("보통주(COMMON)만 줄 세운 순위. ETF·ETN·우선주가 "
                                 "상위 자리를 먹어 보호 대상이 줄어드는 것을 막는다."),
            "snapshotMinItemCount": SNAPSHOT_MIN_ITEM_COUNT,
            "massAbsenceBlock": MASS_ABSENCE_DELISTING_BLOCK,
            "massAbsenceBlockBasis": ("이번 사이클에 새로 사라진 종목 수에 적용한다. "
                                      "누적 부재 수에 걸면 정상 운영만으로 임계에 닿아 "
                                      "교체 기능이 영구 정지한다."),
            "massAbsenceTotalRatio": MASS_ABSENCE_TOTAL_RATIO,
            "massAbsenceWindowDays": MASS_ABSENCE_WINDOW_DAYS,
            "capMemoryMinSamples": CAP_MEMORY_MIN_SAMPLES,
            "megaCapGuardSource": ("현재 snapshot 순위 또는 살아 있을 때 기억해 둔 "
                                   "마지막 순위. 둘 다 없으면 크기 불명으로 보고 "
                                   "상장폐지로 확정하지 않는다."),
            "massMissingBlock": MASS_MISSING_DELISTING_BLOCK,
            "requiresKnownSize": True,
            "requiresCommonShareCode": True,
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
            "minCountRequired": KRX_CORPLIST_MIN_COUNT,
            "qualityGate": (krx or {}).get("gate"),
            "freshEnough": (krx_age is not None and krx_age <= KRX_CORPLIST_MAX_AGE_DAYS),
            "expiresInDays": (None if krx_age is None
                              else round(KRX_CORPLIST_MAX_AGE_DAYS - krx_age, 2)),
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
        write=True, now=None, run_id=None):
    report = build_report(
        configured=load_configured(tickers_path),
        fresh=load_fresh_prices(data_js_path),
        auto=load_auto_analysis(auto_js_path),
        snapshot=load_universe_snapshot(snapshot_path),
        universe_state=load_universe_state(universe_state_path),
        observations=load_observations(observations_path),
        krx=load_krx_corplist(krx_corplist_path),
        market_map=load_market_map(market_map_path),
        now=now, run_id=run_id)
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
    p.add_argument("--run-id", default=None,
                   help="이 산출물에 각인할 실행 식별자(기본: GITHUB_RUN_ID-ATTEMPT)")
    p.add_argument("--dry-run", action="store_true", help="파일을 쓰지 않고 결과만 출력")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    report = run(tickers_path=args.tickers, data_js_path=args.data_js,
                 auto_js_path=args.auto_js, snapshot_path=args.snapshot,
                 universe_state_path=args.universe_state,
                 krx_corplist_path=args.krx_corplist,
                 market_map_path=args.market_map,
                 observations_path=args.observations, report_out=args.out,
                 write=not args.dry_run, run_id=args.run_id)
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
