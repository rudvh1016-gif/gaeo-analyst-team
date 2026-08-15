#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OpenDART 수집 파이프라인 — Mapping · 신규공시 · 재무 · Point-in-Time.

⚠️⚠️ 이 파이프라인이 만든 어떤 값도 Legacy나 research_v1.0 / research_v1.1의
      판단점수에 들어가지 않는다. 지금은 '오늘부터 쌓아두는' 수집 전용이다.
      DART가 실제 Feature로 쓰이는 최초 버전은 research_v2.0이다.
      (데이터 수집 시작일과 모델 사용 시작일이 다른 것은 정상이다.)

계층 분리 (요구 35번)
    dart_raw                DART가 준 원본 그대로
    dart_normalized         우리 스키마로 정규화한 Event
    research_event_features (research_v2.0에서 생성. 지금은 만들지 않는다)
    research_shadow         Research Prediction (별도 파일)

핵심 규칙
- 500종목을 각각 호출하지 않는다. 신규공시 목록 → 유니버스 매칭 → 필요 시 상세.
- rcept_no로 중복을 막는다. 이미 처리한 접수번호는 새 Event로 만들지 않는다.
- rcept_dt는 '접수일자'다. 시:분:초로 해석하지 않는다.
  실시간에서 가장 중요한 시각은 detected_at(우리가 처음 발견한 시각)이다.
- 이름이 비슷하다는 이유로 임의 매칭하지 않는다. 실패는 UNKNOWN_MAPPING.
- 없는 값을 0으로 만들지 않는다. NOT_AVAILABLE로 남긴다.
"""
import datetime
import io
import json
import os
import re
import zipfile

import dart_client

HERE = os.path.dirname(os.path.abspath(__file__))
DART_ROOT = os.path.join(HERE, "research_archive", "dart")
MAP_PATH = os.path.join(DART_ROOT, "corp_map.json")

# Event 상태 (요구 10번) — 발견했다고 점수를 만들지 않는다
EVENT_DETECTED = "EVENT_DETECTED"
NO_OFFICIAL_EVENT_DETECTED = "NO_OFFICIAL_EVENT_DETECTED"
EVENT_COVERAGE_INCOMPLETE = "EVENT_COVERAGE_INCOMPLETE"
EVENT_DATA_ERROR = "EVENT_DATA_ERROR"

UNKNOWN_MAPPING = "UNKNOWN_MAPPING"
NOT_AVAILABLE = "NOT_AVAILABLE"

# 과거 Backfill과 실시간 PIT를 절대 섞지 않는다 (요구 9번)
LIVE_DART_PIT = "LIVE_DART_PIT"
HISTORICAL_DART_BACKFILL = "HISTORICAL_DART_BACKFILL"


def _now_iso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def load_universe():
    """tickers.js의 500종목 = GAEO 유니버스."""
    path = os.path.join(HERE, "tickers.js")
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    m = re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", txt, re.S)
    if not m:
        return {}
    rows = json.loads(m.group(1))
    return {str(r["code"]): {"name": r.get("name", ""), "sector": r.get("sector", "")}
            for r in rows if r.get("code")}


# ── 1. Mapping Table (요구 5번) ──────────────────────────────────────────────
def parse_corp_code_zip(blob):
    """corpCode.xml zip → [{corp_code, corp_name, stock_code}]."""
    with zipfile.ZipFile(io.BytesIO(blob)) as z:
        name = next(n for n in z.namelist() if n.lower().endswith(".xml"))
        xml = z.read(name).decode("utf-8")
    out = []
    for chunk in re.findall(r"<list>(.*?)</list>", xml, re.S):
        def pick(tag):
            m = re.search(rf"<{tag}>(.*?)</{tag}>", chunk, re.S)
            return (m.group(1).strip() if m else "")
        out.append({"corp_code": pick("corp_code"), "corp_name": pick("corp_name"),
                    "stock_code": pick("stock_code")})
    return out


def build_corp_map(dart_rows, universe):
    """GAEO 종목 ↔ DART 기업 매핑.

    ⚠️ stock_code(6자리 종목코드) 완전일치로만 연결한다.
       회사명이 비슷하다는 이유로 임의 매칭하지 않는다(요구 5번).
       매칭 실패는 UNKNOWN_MAPPING으로 남긴다.
    """
    by_stock = {}
    for row in dart_rows:
        sc = (row.get("stock_code") or "").strip()
        if len(sc) == 6 and sc.isdigit():
            by_stock.setdefault(sc, []).append(row)

    mapped, unknown, ambiguous = {}, [], []
    for code, meta in universe.items():
        hits = by_stock.get(code) or []
        if not hits:
            unknown.append({"ticker": code, "company_name": meta["name"],
                            "status": UNKNOWN_MAPPING,
                            "reason": "DART에 같은 종목코드가 없음"})
            continue
        if len(hits) > 1:
            # 같은 종목코드가 둘 이상이면 고르지 않는다. 사람이 확인할 일이다.
            ambiguous.append({"ticker": code, "company_name": meta["name"],
                              "status": UNKNOWN_MAPPING,
                              "reason": f"corp_code 후보 {len(hits)}개",
                              "candidates": [h["corp_code"] for h in hits]})
            continue
        hit = hits[0]
        mapped[code] = {
            "corp_code": hit["corp_code"],
            "stock_code": hit["stock_code"],
            "ticker": code,
            "company_name": meta["name"],          # GAEO 표기
            "dart_corp_name": hit["corp_name"],    # DART 표기(다를 수 있다)
            "sector": meta["sector"],
            "mapped_by": "STOCK_CODE_EXACT",
        }
    return {
        "schemaVersion": "dart_corp_map_v1",
        "builtAt": _now_iso(),
        "universeSize": len(universe),
        "mappedCount": len(mapped),
        "unknownCount": len(unknown) + len(ambiguous),
        "mapped": mapped,
        "unknown": unknown + ambiguous,
    }


def load_corp_map():
    if not os.path.exists(MAP_PATH):
        return None
    try:
        return json.load(open(MAP_PATH, encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def save_corp_map(cmap):
    os.makedirs(os.path.dirname(MAP_PATH), exist_ok=True)
    with open(MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(cmap, f, ensure_ascii=False, indent=1, sort_keys=True)


# ── 2. 신규공시 정규화 + 중복 제거 (요구 6·7번) ──────────────────────────────
CORRECTION_HINT = re.compile(r"\[기재정정\]|\[첨부정정\]|\[정정\]|정정신고")


def normalize_filing(row, corp_map_entry, detected_at, source_mode=LIVE_DART_PIT):
    """DART list.json 한 건 → 우리 스키마 Event Raw Record.

    ⚠️ rcept_dt는 접수'일자'다. 시:분:초로 해석하지 않는다.
       실시간에서 의미 있는 시각은 detected_at이다.
    """
    rcept_no = str(row.get("rcept_no") or "").strip()
    report_name = (row.get("report_nm") or "").strip()
    return {
        "source": "OPENDART",
        "sourceMode": source_mode,          # LIVE_DART_PIT / HISTORICAL_DART_BACKFILL
        "corp_code": row.get("corp_code") or NOT_AVAILABLE,
        "stock_code": (corp_map_entry or {}).get("stock_code") or NOT_AVAILABLE,
        "ticker": (corp_map_entry or {}).get("ticker") or UNKNOWN_MAPPING,
        "rcept_no": rcept_no,
        "report_name": report_name,
        "corp_cls": row.get("corp_cls") or NOT_AVAILABLE,
        # 접수일자. 시각 정보가 아니다.
        "rcept_dt": row.get("rcept_dt") or NOT_AVAILABLE,
        "rcept_dt_note": "OFFICIAL_RECEIPT_DATE_ONLY_NO_TIME",
        # GAEO가 이 공시를 처음 발견한 시각. Point-in-Time의 기준이다.
        "detected_at": detected_at,
        "fetched_at": _now_iso(),
        "is_correction": bool(CORRECTION_HINT.search(report_name)),
        # 정정 원본과의 관계. DART 목록만으로는 원본 접수번호를 알 수 없다.
        "corrects_rcept_no": NOT_AVAILABLE,
        "processing_status": EVENT_DETECTED,
        "raw_source_reference": (f"https://dart.fss.or.kr/dsaf001/main.do?rcpNo={rcept_no}"
                                 if rcept_no else NOT_AVAILABLE),
    }


class SeenRegistry:
    """rcept_no 기반 중복 제거 (요구 6번).

    이미 처리한 접수번호는 다시 새 Event로 저장하지 않는다.
    정정공시는 그 자체로 새 rcept_no를 받으므로 별개 Event로 들어오고,
    is_correction 표시와 원본 추적 필드로 관계를 남긴다.
    """

    def __init__(self, path):
        self.path = path
        self.seen = {}
        if os.path.exists(path):
            try:
                self.seen = json.load(open(path, encoding="utf-8")).get("seen", {})
            except (OSError, json.JSONDecodeError):
                self.seen = {}

    def is_new(self, rcept_no):
        return bool(rcept_no) and rcept_no not in self.seen

    def mark(self, rcept_no, meta):
        if rcept_no:
            self.seen[rcept_no] = meta

    def link_correction(self, event):
        """같은 종목의 직전 공시 중 이름이 겹치는 원본을 후보로 남긴다.

        ⚠️ 확정하지 않는다. 추적 가능하게 후보만 기록하고,
           확정 근거가 없으면 NOT_AVAILABLE 그대로 둔다.
        """
        if not event.get("is_correction"):
            return event
        base = CORRECTION_HINT.sub("", event["report_name"]).strip()
        if not base:
            return event
        cands = [no for no, meta in self.seen.items()
                 if meta.get("ticker") == event.get("ticker")
                 and base and base in (meta.get("report_name") or "")
                 and no != event["rcept_no"]]
        if len(cands) == 1:
            event["corrects_rcept_no"] = cands[0]
            event["correction_link_basis"] = "SAME_TICKER_SAME_REPORT_NAME"
        elif cands:
            event["correction_candidates"] = sorted(cands)[-5:]
            event["correction_link_basis"] = "AMBIGUOUS_NOT_LINKED"
        return event

    def save(self):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": "dart_seen_v1", "updatedAt": _now_iso(),
                       "count": len(self.seen), "seen": self.seen},
                      f, ensure_ascii=False, separators=(",", ":"))


# ── 3. Point-in-Time EVENT 규칙 (요구 8번) ───────────────────────────────────
def event_visible_at(event, prediction_timestamp):
    """이 공시를 그 시점 Prediction에서 써도 되는가.

    조건: event_detected_at <= prediction_timestamp
    공시가 '오늘 존재한다'는 것과 '그 시각에 우리가 알고 있었다'는 것은 다르다.
    """
    det = event.get("detected_at")
    if not det or not prediction_timestamp:
        return False
    return str(det) <= str(prediction_timestamp)


def events_for_prediction(events, prediction_timestamp):
    """research_v2.0이 쓸 때를 대비한 조회 함수. 지금은 아무도 호출하지 않는다."""
    return [e for e in events if event_visible_at(e, prediction_timestamp)]


# ── 4. 재무 데이터 수집 준비 (요구 11·12번) ──────────────────────────────────
# DIANA가 지금 못 쓰는 축과, DART 계정과목으로 채울 수 있는지의 대응표.
# ⚠️ 실제로 응답에 없으면 0이 아니라 NOT_AVAILABLE로 남긴다.
FINANCIAL_TARGETS = {
    "revenue":            {"names": ["매출액", "수익(매출액)", "영업수익"], "for": ["GrossProfitability", "AssetTurnover"]},
    "costOfSales":        {"names": ["매출원가"], "for": ["GrossProfitability"]},
    "grossProfit":        {"names": ["매출총이익"], "for": ["GrossProfitability"]},
    "operatingIncome":    {"names": ["영업이익", "영업이익(손실)"], "for": ["OperatingProfitability"]},
    "netIncome":          {"names": ["당기순이익", "당기순이익(손실)"], "for": ["Accruals", "ROE"]},
    "totalAssets":        {"names": ["자산총계"], "for": ["AssetGrowth", "GrossProfitability", "Leverage"]},
    "totalLiabilities":   {"names": ["부채총계"], "for": ["Leverage"]},
    "totalEquity":        {"names": ["자본총계"], "for": ["Leverage", "ROE"]},
    "operatingCashFlow":  {"names": ["영업활동현금흐름", "영업활동으로인한현금흐름"], "for": ["CashFlowQuality", "Accruals"]},
    "investingCashFlow":  {"names": ["투자활동현금흐름", "투자활동으로인한현금흐름"], "for": ["Investment"]},
}

REPRT_CODES = {"Q1": "11013", "H1": "11012", "Q3": "11014", "FY": "11011"}


def extract_financials(payload):
    """fnlttSinglAcntAll.json 응답 → 목표 항목만 뽑는다.

    없는 항목은 NOT_AVAILABLE. 0으로 만들지 않는다(요구 11번).
    """
    rows = (payload or {}).get("list") or []
    by_name = {}
    for r in rows:
        nm = (r.get("account_nm") or "").replace(" ", "")
        if nm:
            by_name.setdefault(nm, r)
    out, found, missing = {}, [], []
    for key, spec in FINANCIAL_TARGETS.items():
        hit = None
        for cand in spec["names"]:
            hit = by_name.get(cand.replace(" ", ""))
            if hit:
                break
        if hit is None:
            out[key] = NOT_AVAILABLE
            missing.append(key)
            continue
        amount = (hit.get("thstrm_amount") or "").replace(",", "").strip()
        try:
            out[key] = int(amount)
            found.append(key)
        except ValueError:
            out[key] = NOT_AVAILABLE
            missing.append(key)
    return {"values": out, "found": found, "missing": missing,
            "coverage": (len(found) / len(FINANCIAL_TARGETS)) if FINANCIAL_TARGETS else 0.0}


def financial_pit_record(corp_code, ticker, year, reprt_code, extracted,
                         disclosed_at, detected_at, source_mode=LIVE_DART_PIT):
    """재무자료의 회계기간과 '실제로 알 수 있었던 시점'을 분리해 저장한다(요구 12번).

    2026 Q2 실적이라고 2026 Q2 내내 쓸 수 있는 게 아니다.
    usableFrom 이후의 Prediction에서만 Feature로 쓸 수 있다.
    """
    return {
        "source": "OPENDART",
        "sourceMode": source_mode,
        "corp_code": corp_code,
        "ticker": ticker,
        "accountingPeriod": {"year": int(year), "reprtCode": reprt_code},
        # 시장에 공개된 시점(공시 접수). 알 수 없으면 만들어내지 않는다.
        "disclosedAt": disclosed_at or NOT_AVAILABLE,
        # GAEO가 실제로 알게 된 시점. Feature 사용 가능 시점의 기준.
        "detectedAt": detected_at,
        "usableFrom": detected_at,
        "usableFromBasis": "GAEO_DETECTED_AT",
        "values": extracted["values"],
        "missing": extracted["missing"],
        "coverage": round(extracted["coverage"], 4),
        # ⚠️ DART Actual만으로 Surprise를 만들지 않는다(요구 13번)
        "consensus": "CONSENSUS_DATA_UNAVAILABLE",
        "surprise": "NOT_COMPUTABLE_WITHOUT_CONSENSUS",
    }


# ── 5. 수집 실행 (요구 4·16번) ───────────────────────────────────────────────
def collect_new_filings(client, corp_map, bgn_de=None, end_de=None, max_pages=10,
                        seen_path=None, source_mode=LIVE_DART_PIT):
    """신규공시 목록 → 유니버스 매칭 → 중복 제거 → 정규화.

    ⚠️ 종목별 반복호출을 하지 않는다. 목록 API를 페이지 단위로만 부른다.
       호출 수는 페이지 수에 비례하지, 종목 수(500)에 비례하지 않는다.
    """
    today = datetime.date.today().strftime("%Y%m%d")
    bgn_de = bgn_de or today
    end_de = end_de or today
    seen = SeenRegistry(seen_path or os.path.join(DART_ROOT, "seen_rcept.json"))
    by_corp = {v["corp_code"]: v for v in (corp_map.get("mapped") or {}).values()}

    detected_at = _now_iso()
    stats = {"new_filings_detected": 0, "matched_gaeo_filings": 0,
             "duplicate_skipped": 0, "unmatched_filings": 0, "pages_fetched": 0}
    events, errors = [], []

    for page in range(1, max_pages + 1):
        res = client.list_filings(bgn_de=bgn_de, end_de=end_de,
                                  page_no=page, page_count=100)
        if res["status"] != dart_client.OK:
            errors.append({"page": page, "status": res["status"], "error": res["error"]})
            break
        stats["pages_fetched"] += 1
        payload = res["data"] or {}
        rows = payload.get("list") or []
        if not rows:
            break
        for row in rows:
            stats["new_filings_detected"] += 1
            rcept_no = str(row.get("rcept_no") or "").strip()
            entry = by_corp.get(row.get("corp_code"))
            if entry is None:
                stats["unmatched_filings"] += 1
                continue          # 우리 유니버스 밖 — 저장하지 않는다
            if not seen.is_new(rcept_no):
                stats["duplicate_skipped"] += 1
                continue
            ev = normalize_filing(row, entry, detected_at, source_mode)
            ev = seen.link_correction(ev)
            seen.mark(rcept_no, {"ticker": ev["ticker"], "report_name": ev["report_name"],
                                 "detected_at": detected_at})
            events.append(ev)
            stats["matched_gaeo_filings"] += 1
        total_page = int(payload.get("total_page") or 1)
        if page >= total_page:
            break

    seen.save()
    return {"events": events, "stats": stats, "errors": errors,
            "seenTotal": len(seen.seen)}


def coverage_state(events, errors, has_key):
    """요구 10번 상태. '공시 없음'은 '뉴스 없음'이 아니다."""
    if not has_key:
        return EVENT_COVERAGE_INCOMPLETE
    if errors:
        return EVENT_DATA_ERROR
    if events:
        return EVENT_DETECTED
    return NO_OFFICIAL_EVENT_DETECTED


COVERAGE_NOTE = ("NO_OFFICIAL_EVENT_DETECTED는 '뉴스 없음'이 아니다. "
                 "일반 언론뉴스 Coverage가 없어서 공식 공시만 본 결과다.")
