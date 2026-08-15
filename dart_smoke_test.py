#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OpenDART 실연결 ONE-SHOT 점검.

Secret 하나 확인하려고 30분짜리 Production 분석 워크플로를 돌리지 않기 위한
독립 스크립트다. 장중 루프도, 자기재기동도 없다. 한 번 돌고 끝난다.

⚠️ API Key 값은 어떤 출력에도 남기지 않는다. 있다/없다만 보고한다.
⚠️ Production 판단(Legacy · research_v1.x)을 전혀 건드리지 않는다.
⚠️ 첫 실연결에서 500종목 재무를 호출하지 않는다. 대표 소수만 본다.

사용:
    python3 dart_smoke_test.py                # 연결·매핑·목록만
    python3 dart_smoke_test.py --financial    # 대표기업 재무 스키마까지
"""
import json
import os
import sys

import dart_budget
import dart_client
import dart_pipeline as P
import dart_time
import research_store

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(HERE, "research_archive", "dart", "smoke_report.json")

# 재무 스키마 확인용 대표군. 업종 성격이 다른 소수만 고른다(요구 13·22번).
FINANCIAL_PROBE = [
    ("005930", "일반 제조/반도체"),
    ("005380", "일반 제조/자동차"),
    ("035420", "서비스/인터넷"),
    ("105560", "금융/은행"),
]
PROBE_YEAR_CANDIDATES = ("2025", "2024")     # 최신 확정 사업보고서부터


def _redacted(text):
    return dart_client.redact(text)


def check_connection(client, budget):
    """가장 작은 요청부터. corpCode → list 순서."""
    out = {"secretPresent": client.has_key}
    if not client.has_key:
        out["connectionStatus"] = "ERROR"
        out["reason"] = f"{dart_client.KEY_ENV} 환경변수 없음"
        return out

    # A. corpCode.xml (zip 바이너리)
    budget.spend("mapping")
    res = client.corp_code_zip()
    out["corpCode"] = {"status": res["status"],
                       "bytes": len(res["data"]) if res.get("data") else 0,
                       "error": _redacted(res["error"]) if res.get("error") else None}

    # B. list.json (가장 작은 페이지)
    budget.spend("list")
    res2 = client.list_filings(page_no=1, page_count=10)
    payload = res2.get("data") or {}
    out["list"] = {"status": res2["status"],
                   "dartStatus": payload.get("status"),
                   "dartMessage": payload.get("message"),
                   "totalCount": payload.get("total_count"),
                   "totalPage": payload.get("total_page"),
                   "error": _redacted(res2["error"]) if res2.get("error") else None}

    ok = (out["corpCode"]["status"] == dart_client.OK
          and out["list"]["status"] == dart_client.OK)
    out["connectionStatus"] = "OK" if ok else "ERROR"
    return out, res


def build_mapping(zip_res):
    universe = P.load_universe()
    if not zip_res or zip_res.get("status") != dart_client.OK:
        return {"status": "SKIPPED_NO_CORPCODE", "universeCount": len(universe)}
    try:
        rows = P.parse_corp_code_zip(zip_res["data"])
    except Exception as ex:
        return {"status": "PARSE_FAILED", "error": _redacted(str(ex))[:200]}
    cmap = P.build_corp_map(rows, universe)
    P.save_corp_map(cmap)
    ambiguous = [u for u in cmap["unknown"] if u.get("candidates")]
    unknown = [u for u in cmap["unknown"] if not u.get("candidates")]
    return {
        "status": "OK",
        "dartCompanies": len(rows),
        "universeCount": cmap["universeSize"],
        "mappedCount": cmap["mappedCount"],
        "unknownCount": len(unknown),
        "ambiguousCount": len(ambiguous),
        "mappingRate": round(cmap["mappedCount"] / cmap["universeSize"], 4)
        if cmap["universeSize"] else 0,
        # 종목코드·회사명까지만. 민감정보 없음.
        "unknownSamples": [{"ticker": u["ticker"], "name": u["company_name"],
                            "reason": u["reason"]} for u in unknown[:20]],
        "ambiguousSamples": [{"ticker": u["ticker"], "name": u["company_name"],
                              "candidates": len(u.get("candidates") or [])}
                             for u in ambiguous[:20]],
    }


def probe_filings(client, budget):
    """오늘 신규공시 목록을 훑어 본다. 저장은 하지 않는다(스모크 테스트)."""
    cmap = P.load_corp_map()
    if not cmap:
        return {"status": "SKIPPED_NO_MAPPING"}
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        res = P.collect_new_filings(client, cmap,
                                    seen_path=os.path.join(tmp, "seen.json"),
                                    budget=budget)
    state, reasons = P.coverage_state(res["events"], res["errors"],
                                      client.has_key, res["pagination"])
    return {
        "status": "OK" if not res["errors"] else "ERROR",
        "eventState": state, "coverageReasons": reasons,
        "pagination": res["pagination"],
        "stats": res["stats"],
        "gaeoEventSamples": [{"ticker": e["ticker"], "reportName": e["report_name"],
                              "rceptDt": e["rcept_dt"], "isCorrection": e["is_correction"]}
                             for e in res["events"][:20]],
        "errors": [{"status": e.get("status"), "error": _redacted(str(e.get("error")))[:200]}
                   for e in res["errors"][:5]],
    }


# 못 찾은 항목별로 이 낱말이 들어간 계정을 뒤져 실제 이름·ID를 보여준다.
CATALOG_HINTS = {
    "revenue": ["매출", "수익", "영업수익"],
    "costOfSales": ["매출원가", "원가"],
    "grossProfit": ["매출총이익", "총이익"],
    "operatingIncome": ["영업이익", "영업손익"],
    "netIncome": ["당기순이익", "순이익", "순손익", "총포괄"],
    "totalAssets": ["자산총계", "자산"],
    "totalLiabilities": ["부채총계", "부채"],
    "totalEquity": ["자본총계", "자본"],
    "operatingCashFlow": ["영업활동", "영업현금"],
    "investingCashFlow": ["투자활동", "투자현금"],
}


def _catalog(rows, missing_keys):
    """실제 응답에서 계정 식별자를 배운다. 추측하지 않는다."""
    out = {}
    for key in missing_keys:
        hits = []
        for hint in CATALOG_HINTS.get(key, []):
            for r in rows:
                nm = (r.get("account_nm") or "")
                if hint in nm:
                    hits.append({"account_nm": nm, "account_id": r.get("account_id"),
                                 "sj_div": r.get("sj_div")})
            if hits:
                break
        # 같은 계정이 여러 재무제표에 나오므로 중복 제거
        seen, uniq = set(), []
        for h in hits:
            k = (h["account_nm"], h["sj_div"])
            if k not in seen:
                seen.add(k); uniq.append(h)
        out[key] = uniq[:6]
    return out


def probe_financials(client, budget):
    """대표기업 소수만 호출해 실제 응답 스키마를 확인한다.

    ⚠️ 500종목 재무를 부르지 않는다. 재무는 30분마다 변하지 않는다.
    ⚠️ 여기서 DIANA 점수를 계산하지 않는다. 계정이 실제로 있는지만 본다.
    """
    cmap = P.load_corp_map()
    if not cmap:
        return {"status": "SKIPPED_NO_MAPPING"}
    mapped = cmap.get("mapped") or {}
    out = []
    for ticker, label in FINANCIAL_PROBE:
        entry = mapped.get(ticker)
        if not entry:
            out.append({"ticker": ticker, "label": label, "status": "UNKNOWN_MAPPING"})
            continue
        row = {"ticker": ticker, "label": label, "name": entry["company_name"],
               "attempts": []}
        got = None
        for year in PROBE_YEAR_CANDIDATES:
            for fs_div in ("CFS", "OFS"):
                if not budget.allow("financial"):
                    row["attempts"].append({"year": year, "fsDiv": fs_div,
                                            "status": dart_budget.DART_BUDGET_EXCEEDED})
                    break
                budget.spend("financial")
                res = client.financial_statement(entry["corp_code"], year,
                                                 P.REPRT_CODES["FY"], fs_div)
                payload = res.get("data") or {}
                n = len(payload.get("list") or [])
                row["attempts"].append({
                    "year": year, "fsDiv": fs_div, "status": res["status"],
                    "dartStatus": payload.get("status"), "accountRows": n})
                if res["status"] == dart_client.OK and n:
                    got = (year, fs_div, payload)
                    break
            if got:
                break
        if got:
            year, fs_div, payload = got
            ext = P.extract_financials(payload, sector=entry.get("sector"))
            rows = payload.get("list") or []
            row.update({
                "status": "OK", "year": year, "fsDiv": fs_div,
                "accountRows": len(rows),
                "coverage": round(ext["coverage"], 4),
                "found": ext["found"], "missing": ext["missing"],
                "notApplicable": ext["notApplicable"],
                "sectorHandling": ext["sectorHandling"],
                "matchedBy": ext["matchedBy"],
                # 실제 응답이 어떤 식별자를 주는지 확인(요구 13번)
                "hasAccountId": bool(rows and rows[0].get("account_id")),
                "hasAccountNm": bool(rows and rows[0].get("account_nm")),
                "sjDivValues": sorted({r.get("sj_div") for r in rows if r.get("sj_div")}),
                # 못 찾은 항목의 진짜 계정명·account_id를 알아내기 위한 카탈로그.
                # ⚠️ 표준 ID를 추측하지 않고 실제 응답에서 배운다.
                "accountCatalog": _catalog(rows, ext["missing"]),
            })
        else:
            row["status"] = "NO_DATA"
        out.append(row)
    return {"status": "OK", "probes": out}


def main():
    started = dart_time.iso_now()
    client = dart_client.DartClient()
    budget = dart_budget.DailyBudget(
        os.path.join(HERE, "research_archive", "dart", "api_budget.json"))

    report = {"ranAt": started, "kstToday": dart_time.today_kst(),
              "note": ("연결 점검 전용. Production 판단을 바꾸지 않는다. "
                       "research_v2.0 점수는 만들지 않는다.")}

    zip_res = None
    conn = check_connection(client, budget)
    if isinstance(conn, tuple):
        conn, zip_res = conn
    report["connection"] = conn

    if conn.get("connectionStatus") == "OK":
        report["mapping"] = build_mapping(zip_res)
        report["filings"] = probe_filings(client, budget)
        if "--financial" in sys.argv:
            report["financials"] = probe_financials(client, budget)
    else:
        report["mapping"] = {"status": "SKIPPED_NO_CONNECTION"}
        report["filings"] = {"status": "SKIPPED_NO_CONNECTION"}

    report["usage"] = client.efficiency_report()
    try:
        budget.save()
    except OSError:
        pass
    report["budget"] = budget.report()
    report["finishedAt"] = dart_time.iso_now()

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1, sort_keys=True)

    # 콘솔 요약 — Key 값은 절대 찍지 않는다
    c = report["connection"]
    print(f"secretPresent: {c.get('secretPresent')}")
    print(f"connectionStatus: {c.get('connectionStatus')}")
    if c.get("corpCode"):
        print(f"  corpCode: {c['corpCode']['status']} ({c['corpCode']['bytes']:,} bytes)")
    if c.get("list"):
        print(f"  list: {c['list']['status']} · DART status {c['list'].get('dartStatus')} "
              f"· total {c['list'].get('totalCount')}건 / {c['list'].get('totalPage')}페이지")
    m = report.get("mapping") or {}
    if m.get("status") == "OK":
        print(f"mapping: {m['mappedCount']}/{m['universeCount']} "
              f"({m['mappingRate']*100:.1f}%) · unknown {m['unknownCount']} "
              f"· ambiguous {m['ambiguousCount']}")
    fl = report.get("filings") or {}
    if fl.get("status") in ("OK", "ERROR"):
        st = fl.get("stats") or {}
        pg = fl.get("pagination") or {}
        print(f"filings: {fl.get('eventState')} · 전체 {st.get('new_filings_detected')}건 "
              f"· GAEO 매칭 {st.get('matched_gaeo_filings')}건 "
              f"· 페이지 {pg.get('pages_fetched')}/{pg.get('total_pages_reported')} "
              f"· coverage_complete={pg.get('coverage_complete')}")
    fin = report.get("financials")
    if fin and fin.get("status") == "OK":
        for pr in fin["probes"]:
            print(f"financial[{pr['label']}] {pr['ticker']} {pr.get('status')} "
                  f"· {pr.get('fsDiv','')} {pr.get('year','')} "
                  f"· 계정 {pr.get('accountRows','-')}행 · coverage {pr.get('coverage','-')}")
    u = report["usage"]
    b = report["budget"]
    print(f"usage: 이번 실행 {u['requests_per_run']}회 "
          f"(상세 {u['detail_requests']} · 오류 {u['api_errors']}) "
          f"· 오늘 누적 {b['requests_today']}회 "
          f"({b['usage_pct_of_hard_limit']}% of {b['hard_limit']}) · {b['status']}")
    print(f"report: {os.path.relpath(OUT_PATH, HERE)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
