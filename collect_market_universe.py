#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FULL MARKET UNIVERSE 수집기 — KOSPI+KOSDAQ 전체시장 '가벼운 관찰' 전용.

역할 분리 (2026-08-16 Priority 1)
    🌐 FULL_MARKET_UNIVERSE : 전체시장 — 시장/업종 Breadth·집중도·참여도 통계만
    🔬 GAEO_COVERAGE(600)   : tickers.js — TARO/DIANA/QUANT/FLOW/DART/CHIEF 정밀분석

    ⚠️ 전체시장 종목을 정밀분석하지 않는다. 개별 종목 API를 수천 번 호출하지 않는다.
       Bulk 페이지네이션(100종목/페이지)만 쓴다 — 한 사이클 요청 수십 회 수준.

데이터 소스
    fetch_krx_list.py가 러너에서 이미 검증한 것과 같은 네이버 시가총액 순위 API.
    ⚠️ field 이름을 추측하지 않는다 — --smoke 모드가 실제 응답의 field 목록을
       기록하고, 본 수집은 source_verify.json에 검증된 field만 사용한다.

FAIL SAFE
    - 수집 결과가 비정상(예: 0종목, 직전 대비 급감)이면 마지막 정상 snapshot을
      덮어쓰지 않는다(atomic write + last-good 보존).
    - 이 수집기의 실패가 600종목 분석 파이프라인을 멈추지 않는다(워크플로에서
      `|| echo` 처리).

사용법
    python3 collect_market_universe.py --smoke   # 스키마·연결 검증만 (1페이지×2시장)
    python3 collect_market_universe.py           # 전체 수집 → 집계 산출물 갱신
"""
import argparse
import gzip
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "market_universe")
STATE_PATH = os.path.join(OUT_DIR, "state.json")
VERIFY_PATH = os.path.join(OUT_DIR, "source_verify.json")
RAW_LATEST = os.path.join(OUT_DIR, "full_market_latest.json.gz")
PUBLIC_JS = os.path.join(HERE, "market_context.js")
HISTORY_DIR = os.path.join(OUT_DIR, "history")
SECTOR_MAP_PATH = os.path.join(OUT_DIR, "sector_map.json")   # probe_sector_source.py 산출

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
KST = timezone(timedelta(hours=9))
MARKETS = ["KOSPI", "KOSDAQ"]
PAGE_SIZE = 100
MAX_PAGES = 40          # 안전 상한 — 100×40=4,000종목/시장

# 상태값
READY = "READY"
PARTIAL = "FULL_MARKET_PARTIAL"
SOURCE_ERROR = "SOURCE_ERROR"
HISTORY_ACCUMULATING = "HISTORY_ACCUMULATING"

# 일별 History를 쓰기 시작하는 시각(KST). 정규장 마감 15:30 + 정정 여유 10분.
# update-analysis.yml의 `compute_rotation --mode close`(1540)와 같은 기준선이다.
HISTORY_WRITE_AFTER_KST = (15, 40)

# 최소 정상 수집 기준 — 이보다 적으면 last-good을 덮어쓰지 않는다.
# (2026-07-11 실측 krx_list.json: KOSPI 2,171 · KOSDAQ 1,770)
MIN_SANE_PER_MARKET = 800
MIN_COVERAGE_RATIO = 0.90   # 직전 정상 수집 대비 90% 미만이면 PARTIAL

REQUEST_COUNT = {"n": 0}


def _get(url, referer, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
            REQUEST_COUNT["n"] += 1
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read())
        except Exception as e:
            last = e
            if i < tries - 1:
                time.sleep(0.6 * (i + 1))
    raise last


def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _is_trading_day(day):
    """KRX 정규장이 열리는 날인가. 저장소 공용 달력(krx_calendar)을 재사용한다.

    달력을 못 읽으면 주말만 제외한다 — gaeo_coverage/guardian.py와 같은 처리다.
    달력이 놓친 임시 휴장은 아래 _duplicates_previous_day()가 한 겹 더 막는다.
    """
    try:
        from krx_calendar import is_krx_trading_day
        return is_krx_trading_day(day)
    except Exception:
        return day.weekday() < 5


def _stats_signature(payload):
    """그날 집계의 지문. 두 날짜의 지문이 같으면 같은 장을 두 번 적은 것이다."""
    out = []
    for scope in ("market", "kospi", "kosdaq"):
        s = payload.get(scope) or {}
        out.append((s.get("eligibleCount"), s.get("advancers"), s.get("decliners"),
                    s.get("equalWeightReturn"), s.get("capWeightedReturn")))
    return tuple(out)


def _duplicates_previous_day(kst_day, payload):
    """직전에 적재된 다른 날짜의 기록과 집계가 완전히 같은가.

    휴장일에 벤더는 직전 거래일 snapshot을 그대로 돌려준다. 그걸 그대로 적으면
    직전 거래일 종가가 복제돼 평균·분포가 오염된다(실제로 2026-08-17 광복절
    대체공휴일 기록이 2026-08-14 종가의 복제였다). 2,400여 종목의 상승 수와
    소수점 셋째 자리 수익률이 통째로 일치할 확률은 사실상 0이므로,
    일치하면 "새로운 장이 아니다"로 본다.
    """
    try:
        days = sorted(f[:-5] for f in os.listdir(HISTORY_DIR)
                      if f.endswith(".json") and f[:-5] < kst_day)
    except OSError:
        return None
    if not days:
        return None
    prev = _load_json(os.path.join(HISTORY_DIR, days[-1] + ".json"))
    if not prev:
        return None
    return days[-1] if _stats_signature(prev) == _stats_signature(payload) else None


# ⭐ 2026-09-04 신설 — "시장 흐름 추세"가 계속 "데이터 기록 중"으로만 뜨던 원인 수정.
#    일별 기록(market_universe/history/*.json)은 2026-08-18부터 매일 잘 쌓이고 있었는데,
#    그걸 기간별로 합산하는 코드가 아예 없어서 public 파일에 문자열
#    "HISTORY_ACCUMULATING"만 넣고 있었다. 즉 재료는 모으는데 요리를 안 하고 있었다.
#
#    ⚠️ 없는 기간을 채워 넣지 않는다. 창(5·20거래일)에 필요한 날짜가 모자라면
#       available=False로 두고 며칠이 모자란지 그대로 보고한다.
#    ⚠️ 라벨에 반드시 "무엇의 평균인지"를 담는다. "5일 평균"처럼 대상이 빠진 이름이나
#       이동평균선으로 오해되는 "5일선"은 쓰지 않는다(기존 코드 주석의 지시).
HISTORY_WINDOWS = (5, 20)

# 무엇을 평균 내는지 이름에 그대로 담는다.
HISTORY_METRICS = {
    "advanceRatioPct": {
        "label": "상승 종목 비율 평균",
        "unit": "%",
        "path": ("market", "advanceRatio"),
        "scale": 100.0,
    },
    "medianReturnPct": {
        "label": "구성 종목 중앙값 등락 평균",
        "unit": "%",
        "path": ("market", "medianReturn"),
        "scale": 1.0,
    },
}


def _history_days(before_or_on=None):
    """저장된 일별 기록을 날짜 오름차순으로 읽는다. 깨진 파일은 조용히 건너뛴다."""
    try:
        names = sorted(f[:-5] for f in os.listdir(HISTORY_DIR) if f.endswith(".json"))
    except OSError:
        return []
    rows = []
    for day in names:
        if before_or_on and day > before_or_on:
            continue
        doc = _load_json(os.path.join(HISTORY_DIR, day + ".json"))
        if isinstance(doc, dict) and isinstance(doc.get("market"), dict):
            rows.append(doc)
    return rows


def _metric_value(doc, spec):
    node = doc
    for key in spec["path"]:
        node = (node or {}).get(key)
    if not isinstance(node, (int, float)):
        return None
    return float(node) * spec["scale"]


def build_history_summary(kst_day=None):
    """기간별 평균을 만든다. 날짜가 모자란 창은 만들지 않고 모자란 사실만 보고한다."""
    rows = _history_days(kst_day)
    total_days = len(rows)
    windows = {}
    for size in HISTORY_WINDOWS:
        recent = rows[-size:]
        entry = {
            "days": size,
            "daysCollected": len(recent),
            "daysNeeded": size,
            "daysRemaining": max(0, size - len(recent)),
            "available": len(recent) >= size,
            "metrics": {},
        }
        if entry["available"]:
            entry["periodStart"] = recent[0].get("day")
            entry["periodEnd"] = recent[-1].get("day")
            for key, spec in HISTORY_METRICS.items():
                values = [v for v in (_metric_value(d, spec) for d in recent) if v is not None]
                entry["metrics"][key] = {
                    "label": f"최근 {size}거래일 {spec['label']}",
                    "unit": spec["unit"],
                    "average": round(sum(values) / len(values), 2) if values else None,
                    "sampleDays": len(values),
                } if values else {"label": f"최근 {size}거래일 {spec['label']}",
                                  "unit": spec["unit"], "average": None, "sampleDays": 0}
        windows[str(size)] = entry
    # 오늘 값과 기간 평균을 비교해 "지금이 평소보다 강한가"를 보여준다.
    latest = rows[-1] if rows else None
    today = {}
    if latest:
        for key, spec in HISTORY_METRICS.items():
            value = _metric_value(latest, spec)
            if value is not None:
                today[key] = round(value, 2)
    return {
        "schemaVersion": "gaeo_market_history_v1",
        "totalDaysCollected": total_days,
        "firstDay": rows[0].get("day") if rows else None,
        "lastDay": rows[-1].get("day") if rows else None,
        "today": today,
        "windows": windows,
        "note": ("일별 전체시장 집계를 기간별로 평균한 값이다. 이동평균선이 아니다. "
                 "날짜가 모자란 기간은 평균을 만들지 않고 모자란 일수를 그대로 보고한다."),
    }


def _atomic_write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def _load_json(path, default=None):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


# ── 실제 응답 field 검증 ─────────────────────────────────────────────────────
def observe_schema(rows):
    """한 페이지의 실제 응답에서 field 이름과 채워진 비율을 기록한다.
    ⚠️ 여기 기록된 field만 이후 수집·집계에 사용할 수 있다."""
    fields = {}
    for row in rows:
        for k, v in row.items():
            slot = fields.setdefault(k, {"present": 0, "nonNull": 0, "sample": None})
            slot["present"] += 1
            if v not in (None, ""):
                slot["nonNull"] += 1
                if slot["sample"] is None:
                    # 스키마 확인용 샘플 1개만 — 전체 응답을 로그에 쏟지 않는다
                    slot["sample"] = str(v)[:40]
    n = len(rows) or 1
    return {k: {"nonNullRatio": round(s["nonNull"] / n, 3), "sample": s["sample"]}
            for k, s in sorted(fields.items())}


def fetch_page(market, page):
    url = (f"https://m.stock.naver.com/api/stocks/marketValue/{market}"
           f"?page={page}&pageSize={PAGE_SIZE}")
    return _get(url, "https://m.stock.naver.com")


def smoke():
    """스키마·연결 검증 전용 — 시장별 1페이지만 요청하고 field 목록·건수만 남긴다."""
    report = {"ranAt": _now_iso(), "mode": "smoke", "markets": {}, "requestCount": 0}
    ok = True
    for market in MARKETS:
        try:
            d = fetch_page(market, 1)
            rows = d.get("stocks") or []
            report["markets"][market] = {
                "status": "OK" if rows else "EMPTY",
                "totalCount": d.get("totalCount"),
                "pageRows": len(rows),
                "topLevelKeys": sorted(d.keys()),
                "stockFields": observe_schema(rows),
            }
            if not rows:
                ok = False
        except Exception as e:
            ok = False
            report["markets"][market] = {"status": "ERROR", "error": str(e)[:200]}
    report["requestCount"] = REQUEST_COUNT["n"]
    report["verified"] = ok
    _atomic_write(VERIFY_PATH, json.dumps(report, ensure_ascii=False, indent=1))
    print(f"[smoke] verified={ok} requests={REQUEST_COUNT['n']} → {VERIFY_PATH}")
    for market, info in report["markets"].items():
        print(f"  {market}: {info.get('status')} totalCount={info.get('totalCount')} "
              f"fields={len(info.get('stockFields') or {})}")
    return 0 if ok else 1


# ── 본 수집 ──────────────────────────────────────────────────────────────────
def verified_fields():
    """source_verify.json에 기록된, 실제 응답에서 확인된 field 집합."""
    v = _load_json(VERIFY_PATH) or {}
    fields = set()
    for market in (v.get("markets") or {}).values():
        fields.update((market.get("stockFields") or {}).keys())
    return fields


def collect_market(market):
    items, page = [], 1
    total_reported = None
    while page <= MAX_PAGES:
        d = fetch_page(market, page)
        rows = d.get("stocks") or []
        if not rows:
            break
        if total_reported is None:
            total_reported = d.get("totalCount")
        items.extend(rows)
        if total_reported and len(items) >= total_reported:
            break
        page += 1
        time.sleep(0.15)
    return items, total_reported


def classify(row, fields):
    """종목 분류 — 검증된 metadata 우선, 그다음 결정적 규칙만.

    ⚠️ 이름이 비슷하다는 이유의 fuzzy matching은 하지 않는다.
    2026-08-16 러너 실측: 상품 유형 field는 `stockEndType`이다(sample "stock").
    `stockType`은 "domestic"(국내/해외 구분)이라 분류에 쓰면 안 된다.
    반환: (분류, 근거)
    """
    # 1) 소스 metadata — stockEndType (smoke로 존재가 검증된 경우에만 판독)
    end_type = str(row.get("stockEndType") or "").lower() if "stockEndType" in fields else ""
    if end_type and end_type != "stock":
        # 관찰된 비주식 유형(etf/etn 등)은 실측 값 그대로 분류명으로 쓴다.
        if end_type in ("etf", "etn"):
            return end_type.upper(), "source_stockEndType"
        return "NON_STOCK_" + end_type.upper()[:12], "source_stockEndType"
    # 2) KRX 단축코드 결정 규칙 — 끝자리가 0이 아니면 종류주(우선주 등).
    #    이름 추측이 아니라 코드 체계의 결정적 규칙이다.
    code = str(row.get("itemCode") or "")
    if re.match(r"^\d{6}$", code) and code[-1] != "0":
        return "CLASS_SHARE", "code_suffix_rule"
    # 3) 명칭 규칙 — 스팩('제N호스팩')·상장리츠('~리츠')는 법정/상장 명칭 규칙이라
    #    부분일치 추측이 아니다. 애매한 변형은 걸리지 않고 COMMON으로 남는다.
    name = str(row.get("stockName") or "")
    if re.search(r"스팩\d*호?$|제\d+호스팩", name):
        return "SPAC", "legal_name_rule"
    if name.endswith("리츠"):
        return "REIT", "listing_name_rule"
    if end_type == "stock":
        return "COMMON", "source_stockEndType"
    if "stockEndType" in fields:
        return "CLASSIFICATION_UNKNOWN", "stockEndType_empty"
    return "COMMON_ASSUMED", "no_type_metadata"


def _num(row, key):
    v = row.get(key)
    if v in (None, ""):
        return None
    try:
        return float(str(v).replace(",", ""))
    except (TypeError, ValueError):
        return None


def build_universe(all_rows, fields):
    """RAW → ELIGIBLE 분리 + 품질 카운트."""
    seen, dup, invalid_code = set(), 0, 0
    raw, eligible = [], []
    counts = {}
    type_histogram = {}          # stockEndType 실측 값 분포 — 증거 기록용
    missing_price = suspended = 0
    for market, row in all_rows:
        code = str(row.get("itemCode") or "")
        if not re.match(r"^\d{6}$", code):
            invalid_code += 1
            continue
        if code in seen:
            dup += 1
            continue
        seen.add(code)
        if "stockEndType" in fields:
            et = str(row.get("stockEndType") or "(empty)")
            type_histogram[et] = type_histogram.get(et, 0) + 1
        kind, basis = classify(row, fields)
        counts[kind] = counts.get(kind, 0) + 1
        tradable = (str(row.get("tradableStatus") or "").lower() == "tradable"
                    if "tradableStatus" in fields else True)
        rate = _num(row, "fluctuationsRatio") if "fluctuationsRatio" in fields else None
        close = _num(row, "closePriceRaw") if "closePriceRaw" in fields else None
        cap = _num(row, "marketValueRaw") if "marketValueRaw" in fields else None
        vol = _num(row, "accumulatedTradingValueRaw") if "accumulatedTradingValueRaw" in fields else None
        item = {"code": code, "name": str(row.get("stockName") or "").strip(),
                "market": market, "kind": kind, "basis": basis, "tradable": tradable,
                "rate": rate, "close": close, "cap": cap, "tval": vol}
        raw.append(item)
        # ELIGIBLE = '한국 기업들의 흐름' — ETF/ETN/SPAC/리츠/종류주 제외.
        # 분류 불명·거래정지는 통계에 넣지 않고 따로 센다(억지 판단 금지).
        if kind in ("COMMON", "COMMON_ASSUMED"):
            if not tradable:
                suspended += 1
            elif rate is None:
                missing_price += 1
            else:
                eligible.append(item)
    return {"raw": raw, "eligible": eligible, "counts": counts,
            "duplicateCount": dup, "invalidCodeCount": invalid_code,
            "missingPriceCount": missing_price, "suspendedCount": suspended,
            "typeHistogram": dict(sorted(type_histogram.items(),
                                         key=lambda kv: -kv[1]))}


def _median(vals):
    s = sorted(vals)
    n = len(s)
    if not n:
        return None
    return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2


def market_stats(eligible):
    """시장 단위 Breadth/집중도 — History 없이 현재 Snapshot만으로 계산 가능한 것."""
    rates = [x["rate"] for x in eligible]
    up = sum(1 for r in rates if r > 0)
    down = sum(1 for r in rates if r < 0)
    flat = len(rates) - up - down
    med = _median(rates)
    mean = sum(rates) / len(rates) if rates else None
    capped = [(x["rate"], x["cap"]) for x in eligible if x["cap"]]
    cap_total = sum(c for _, c in capped)
    cap_weighted = (sum(r * c for r, c in capped) / cap_total) if cap_total else None
    stats = {
        "eligibleCount": len(eligible),
        "advancers": up, "decliners": down, "unchanged": flat,
        "advanceRatio": round(up / len(rates), 4) if rates else None,
        "medianReturn": round(med, 3) if med is not None else None,
        "equalWeightReturn": round(mean, 3) if mean is not None else None,
        "capWeightedReturn": round(cap_weighted, 3) if cap_weighted is not None else None,
    }
    # 거래대금 집중도 — 상위 종목이 전체 참여를 얼마나 차지하나
    tvals = sorted((x["tval"] for x in eligible if x["tval"]), reverse=True)
    tv_total = sum(tvals)
    if tv_total and len(tvals) >= 5:
        stats["turnoverTop5Share"] = round(sum(tvals[:5]) / tv_total, 4)
        stats["turnoverTop30Share"] = round(sum(tvals[:30]) / tv_total, 4)
    return stats


def sector_stats(eligible, sector_of, min_sample=5):
    """업종 단위 통계 — median + breadth + cap/equal 분리 + 집중도.

    sector_of: code → GAEO 대분류 (검증된 crosswalk만 — LLM 임의 분류 금지).
    평균 하나로 '업종 강세'를 판단하지 않는다:
      · medianReturn / advanceRatio / capWeighted-equalWeight 차이를 함께 제공
      · 상위 1·3종목 기여 집중도(concentration) 제공
      · 표본이 min_sample 미만이면 LOW_SAMPLE로 표시하고 강한 결론 금지
    매핑 안 된 종목은 '기타'로 몰지 않고 unmappedCount로만 센다.
    """
    groups, unmapped = {}, 0
    for x in eligible:
        sector = sector_of.get(x["code"])
        if not sector:
            unmapped += 1
            continue
        groups.setdefault(sector, []).append(x)
    out = {}
    for sector, rows in sorted(groups.items()):
        rates = [r["rate"] for r in rows]
        up = sum(1 for v in rates if v > 0)
        down = sum(1 for v in rates if v < 0)
        med = _median(rates)
        mean = sum(rates) / len(rates)
        capped = [(r["rate"], r["cap"]) for r in rows if r["cap"]]
        cap_total = sum(c for _, c in capped)
        cap_w = (sum(v * c for v, c in capped) / cap_total) if cap_total else None
        entry = {
            "count": len(rows), "advancers": up, "decliners": down,
            "advanceRatio": round(up / len(rows), 4),
            "medianReturn": round(med, 3),
            "equalWeightReturn": round(mean, 3),
            "capWeightedReturn": round(cap_w, 3) if cap_w is not None else None,
        }
        # 시총 상위 1·3종목이 cap-weighted 수익에 기여한 몫 — '두 종목이 업종을
        # 대표하는' 착시를 드러내기 위한 값.
        if cap_total and len(capped) >= 3:
            top = sorted(capped, key=lambda vc: -vc[1])
            entry["capTop1Share"] = round(top[0][1] / cap_total, 4)
            entry["capTop3Share"] = round(sum(c for _, c in top[:3]) / cap_total, 4)
            if cap_w is not None and entry["medianReturn"] is not None:
                # cap-weighted가 강한데 median·breadth가 약하면 '소수 대형주 집중'
                entry["breadthDivergence"] = round(cap_w - med, 3)
        if len(rows) < min_sample:
            entry["reliability"] = "LOW_SAMPLE"
            entry["note"] = "표본이 작아 강한 결론에 쓰지 않는다"
        out[sector] = entry
    return {"sectors": out, "unmappedCount": unmapped,
            "mappedCount": sum(len(v) for v in groups.values())}


def sector_breadth(eligible, map_path=None):
    """검증된 KRX 업종 맵 + 명시적 crosswalk로만 업종 Breadth를 만든다.

    게이트 원칙 (2026-08-16 업종 연결)
      · sector_map.json 없음            → SECTOR_MAPPING_PENDING (임의 분류 금지)
      · crosswalk 커버리지 게이트 미달   → SECTOR_MAPPING_PARTIAL, 통계 미첨부
      · 게이트 통과                      → READY (eligible 매핑률 95% 미만이면 PARTIAL,
                                            통계는 첨부하되 낮은 매핑률을 명시)
    이 통계는 관찰용이다 — Production 판단·ROTATION 계산에 쓰지 않는다.
    """
    smap = _load_json(map_path or SECTOR_MAP_PATH)
    if not smap or not smap.get("map"):
        return {"status": "SECTOR_MAPPING_PENDING",
                "note": "검증된 업종 소스 연결 전 — 임의 분류로 채우지 않는다"}
    cov = smap.get("crosswalkCoverage") or {}
    meta = {"mapSource": "krx_corplist", "mapAsOf": smap.get("asOf"),
            "mapCorpCount": smap.get("corpCount"),
            "crosswalkRatio": cov.get("ratio")}
    if cov.get("gate") != "GATE_PASS":
        return {"status": "SECTOR_MAPPING_PARTIAL",
                "note": "crosswalk 커버리지 게이트(95%) 미달 — 업종 통계를 내보내지 않는다",
                **meta}
    try:
        import sector_crosswalk
    except ImportError:
        return {"status": "SECTOR_MAPPING_PENDING",
                "note": "sector_crosswalk 모듈 없음", **meta}
    sector_of = {}
    for code, industry in smap["map"].items():
        sector = sector_crosswalk.gaeo_sector(industry)
        if sector:                      # 표에 없는 업종은 UNKNOWN — '기타'로 몰지 않는다
            sector_of[code] = sector
    ss = sector_stats(eligible, sector_of)
    denom = ss["mappedCount"] + ss["unmappedCount"]
    mapped_ratio = round(ss["mappedCount"] / denom, 4) if denom else 0.0
    status = "READY" if mapped_ratio >= 0.95 else "SECTOR_MAPPING_PARTIAL"
    return {"status": status, **meta,
            "eligibleMappedRatio": mapped_ratio,
            "mappedCount": ss["mappedCount"], "unmappedCount": ss["unmappedCount"],
            "sectors": ss["sectors"],
            "note": ("KRX 공식 업종 → GAEO 대분류 명시적 crosswalk. "
                     "GAEO 600 화면 분류와 별개 모집단 통계 — Production 판단에 쓰지 않는다")}


def run_full(write_raw=False):
    fields = verified_fields()
    if not fields:
        print("[full] source_verify.json이 없습니다 — 먼저 --smoke로 실제 스키마를 "
              "검증해야 합니다(추측 수집 금지).")
        return 2
    state = _load_json(STATE_PATH, {}) or {}
    all_rows, per_market, totals = [], {}, {}
    try:
        for market in MARKETS:
            items, total = collect_market(market)
            per_market[market] = len(items)
            totals[market] = total
            all_rows.extend((market, r) for r in items)
    except Exception as e:
        print(f"[full] 수집 실패: {type(e).__name__} — 마지막 정상 snapshot을 보존합니다")
        state.update({"status": SOURCE_ERROR, "lastError": str(e)[:200],
                      "lastAttempt": _now_iso()})
        _atomic_write(STATE_PATH, json.dumps(state, ensure_ascii=False, indent=1))
        return 1

    u = build_universe(all_rows, fields)
    raw, eligible, counts = u["raw"], u["eligible"], u["counts"]

    # FAIL SAFE — 비정상 수집이면 last-good 덮어쓰기 금지
    sane = all(per_market.get(m, 0) >= MIN_SANE_PER_MARKET for m in MARKETS)
    prev_raw = state.get("rawCount") or 0
    coverage_vs_prev = (len(raw) / prev_raw) if prev_raw else 1.0
    expected = sum(t for t in totals.values() if t) or None
    # Coverage = 소스가 있다고 말한 것 중 실제로 받아온 비율.
    # (ETN 등 의도적으로 거른 종목 때문에 커버리지가 낮아 보이면 안 된다)
    coverage_ratio = round(len(all_rows) / expected, 4) if expected else None
    if not sane or coverage_vs_prev < MIN_COVERAGE_RATIO:
        status = PARTIAL if sane else SOURCE_ERROR
        print(f"[full] 수집 불충분(raw={len(raw)}, 직전={prev_raw}) → {status}. "
              "산출물을 덮어쓰지 않습니다.")
        state.update({"status": status, "lastAttempt": _now_iso(),
                      "lastAttemptRaw": len(raw)})
        _atomic_write(STATE_PATH, json.dumps(state, ensure_ascii=False, indent=1))
        return 1

    as_of = _now_iso()
    kst_day = datetime.now(KST).strftime("%Y-%m-%d")
    quality = {
        "expectedCount": expected, "receivedCount": len(all_rows),
        "rawCount": len(raw), "eligibleCount": len(eligible),
        "kospiCount": per_market.get("KOSPI"), "kosdaqCount": per_market.get("KOSDAQ"),
        "duplicateCount": u["duplicateCount"], "invalidCodeCount": u["invalidCodeCount"],
        "missingPriceCount": u["missingPriceCount"], "suspendedCount": u["suspendedCount"],
        "excludedCounts": {k: v for k, v in counts.items()
                           if k not in ("COMMON", "COMMON_ASSUMED",
                                        "CLASSIFICATION_UNKNOWN") and v},
        "classificationUnknownCount": counts.get("CLASSIFICATION_UNKNOWN", 0),
        "typeHistogram": u["typeHistogram"],
        "coverageRatio": coverage_ratio,
    }
    stats = market_stats(eligible)
    kospi_stats = market_stats([x for x in eligible if x["market"] == "KOSPI"])
    kosdaq_stats = market_stats([x for x in eligible if x["market"] == "KOSDAQ"])

    status = READY if (coverage_ratio is None or coverage_ratio >= 0.95) else PARTIAL

    # Public 집계(작은 파일만 브라우저로) — 개별 종목 목록은 내보내지 않는다
    public = {
        "schemaVersion": "gaeo_market_context_v1",
        "universeSource": "FULL_MARKET",
        "generatedAt": as_of, "dataAsOf": as_of, "kstDay": kst_day,
        "sourceStatus": status,
        "quality": quality,
        "market": stats, "kospi": kospi_stats, "kosdaq": kosdaq_stats,
        "history": build_history_summary(kst_day),
        "sectorBreadth": sector_breadth(eligible),
        "note": ("KOSPI·KOSDAQ 전체시장 가벼운 관찰용 집계. "
                 "GAEO 600종목 정밀분석과 별개의 모집단이다."),
    }
    _atomic_write(PUBLIC_JS, "window.GAEO_MARKET_CONTEXT="
                  + json.dumps(public, ensure_ascii=False, separators=(",", ":")) + ";")

    state = {"status": status, "asOf": as_of, "kstDay": kst_day,
             "rawCount": len(raw), "eligibleCount": len(eligible),
             "requestCount": REQUEST_COUNT["n"], "quality": quality}
    _atomic_write(STATE_PATH, json.dumps(state, ensure_ascii=False, indent=1))

    if write_raw:
        blob = json.dumps({"schemaVersion": 1, "asOf": as_of, "kstDay": kst_day,
                           "source": "naver_marketValue_bulk",
                           "rawCount": len(raw), "items": raw},
                          ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        os.makedirs(OUT_DIR, exist_ok=True)
        tmp = RAW_LATEST + ".tmp"
        with open(tmp, "wb") as f:
            f.write(gzip.compress(blob, 6))
        os.replace(tmp, RAW_LATEST)

    # 하루 1건 소형 집계 History 적재 — 반드시 "그날의 종가" 한 장이어야 한다.
    #
    # 🐛 2026-08-28 대표 지적으로 드러난 버그. 위 주석대로 의도는 처음부터 "장 마감 후"였는데
    #    조건이 `hour_kst >= 15 and not os.path.exists(hist_path)`였다. 정규장 마감은 15:30이라
    #    15:00~15:29 회차가 먼저 도착해 그날 기록을 선점했고, 한 번 쓰이고 나면 not exists 때문에
    #    정작 마감 회차가 덮어쓸 수 없었다. 적재된 10일이 전부 15:02~15:29 장중 스냅샷이었다.
    #    2026-08-28 실측: 상승 1,367종목(15:13) vs 1,490종목(종가) — 123종목이 어긋났다.
    #
    # 계약 세 가지
    #   ① 마감 전에는 절대 쓰지 않는다. HISTORY_WRITE_AFTER_KST(15:40)부터 쓴다.
    #   ② 매 회차 덮어쓴다 — 그날 마지막 회차(≈16:05)가 남아야 진짜 종가다.
    #      다른 날짜 파일은 손대지 않으므로 "오늘 것만 갱신"이 그대로 보장된다.
    #   ③ 휴장일에는 쓰지 않는다(달력 + 직전 거래일 복제 감지 이중 방어).
    hist_path = os.path.join(HISTORY_DIR, f"{kst_day}.json")
    now_kst = datetime.now(KST)
    if (now_kst.hour, now_kst.minute) >= HISTORY_WRITE_AFTER_KST:
        record = {"day": kst_day, "asOf": as_of,
                  # 마감 이후 스냅샷임을 읽는 쪽이 확인할 수 있게 남긴다.
                  "closeConfirmed": True,
                  # 그날의 실제 Universe 구성을 함께 남긴다 — 오늘의 상장목록을 과거로
                  # 소급하는 survivorship bias를 막는 근거 기록이다.
                  "universeSource": "FULL_MARKET", "universeDate": kst_day,
                  "quality": quality,
                  "market": stats, "kospi": kospi_stats, "kosdaq": kosdaq_stats,
                  "sectorBreadth": public["sectorBreadth"]}
        open_day = _is_trading_day(now_kst.date())
        dup = _duplicates_previous_day(kst_day, record) if open_day else None
        if not open_day:
            print(f"[full] {kst_day} 휴장일 — 일별 기록 생략(달력)")
        elif dup:
            print(f"[full] {kst_day} 집계가 {dup}와 완전히 같다 — 임시 휴장으로 보고 기록 생략")
        else:
            _atomic_write(hist_path, json.dumps(record, ensure_ascii=False, indent=1))

    print(f"[full] {status} raw={len(raw)} eligible={len(eligible)} "
          f"(KOSPI {per_market.get('KOSPI')} · KOSDAQ {per_market.get('KOSDAQ')}) "
          f"requests={REQUEST_COUNT['n']} unknown={quality['classificationUnknownCount']}")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--smoke", action="store_true", help="스키마·연결 검증만")
    ap.add_argument("--write-raw", action="store_true",
                    help="compact raw snapshot(gz)도 저장 — 검증/일일 아카이브용")
    args = ap.parse_args()
    if args.smoke:
        return smoke()
    return run_full(write_raw=args.write_raw)


if __name__ == "__main__":
    sys.exit(main())
