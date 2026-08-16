#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FULL MARKET 업종 소스 실검증 프로브 — 추측 금지 원칙의 실행 도구.

전체시장 업종 Breadth를 만들려면 '검증된 업종 소스'가 필요하다.
이 스크립트는 후보 소스의 실제 응답을 러너에서 확인해
market_universe/sector_source_probe.json에 **스키마와 분포만** 기록한다.

후보 1: KRX 상장법인목록 다운로드(kind.krx.co.kr) — 공식 업종 컬럼 보유.
        단 2026-07 러너에서 해외 IP 차단(0건)이 관측된 적이 있어 재검증 필요.

⚠️ 회사별 원자료(회사명·대표자·주소 등)를 커밋하지 않는다.
   probe 보고서에는 컬럼 목록·건수·업종명 분포만 남기고,
   sector_map.json에는 업종 통계에 필요한 최소 정보(종목코드→업종명)만 남긴다.
⚠️ 이 프로브가 실패하면 업종 매핑은 BLOCKED_SOURCE로 정직하게 보고한다.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone

import sector_crosswalk

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "market_universe", "sector_source_probe.json")
MAP_OUT = os.path.join(HERE, "market_universe", "sector_map.json")
CROSSWALK_GATE = 0.95   # 법인 수 가중 crosswalk 커버리지 최소선 (미달이면 GATE_FAIL)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"


def fetch(url, referer, tries=2):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:
            last = e
    raise last


def probe_krx_corplist(market_type, market_name):
    """KRX 상장법인목록(HTML 표 형식 다운로드)의 실제 스키마·업종 분포."""
    url = ("https://kind.krx.co.kr/corpgeneral/corpList.do"
           f"?method=download&marketType={market_type}")
    try:
        body = fetch(url, "https://kind.krx.co.kr").decode("euc-kr", "replace")
    except Exception as e:
        return {"market": market_name, "status": "ERROR", "error": str(e)[:200]}
    header = re.search(r"<tr[^>]*>(.*?)</tr>", body, re.S)
    cols = ([re.sub(r"<[^>]+>", "", th).strip()
             for th in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", header.group(1), re.S)]
            if header else [])
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", body, re.S)[1:]
    industries = {}
    code_industry = {}
    code_ok = industry_filled = 0
    # 컬럼 위치는 헤더에서 찾는다 — 위치를 추측하지 않는다.
    try:
        code_i = next(i for i, c in enumerate(cols) if "종목코드" in c)
        ind_i = next(i for i, c in enumerate(cols) if "업종" in c)
    except StopIteration:
        return {"market": market_name, "status": "SCHEMA_UNEXPECTED",
                "columns": cols, "rowCount": len(rows)}
    for tr in rows:
        tds = [re.sub(r"<[^>]+>", "", t).strip()
               for t in re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)]
        if len(tds) <= max(code_i, ind_i):
            continue
        if re.match(r"^\d{6}$", tds[code_i]):
            code_ok += 1
            ind = tds[ind_i]
            if ind:
                industry_filled += 1
                industries[ind] = industries.get(ind, 0) + 1
                code_industry[tds[code_i]] = ind
    return {"market": market_name, "status": "OK" if code_ok else "EMPTY",
            "columns": cols, "rowCount": len(rows), "validCodeCount": code_ok,
            "industryFilled": industry_filled,
            "industryFillRatio": round(industry_filled / code_ok, 4) if code_ok else 0,
            "distinctIndustries": len(industries),
            # 업종명 분포(회사 원자료 아님) — crosswalk 설계의 근거 자료
            "industryHistogram": dict(sorted(industries.items(), key=lambda kv: -kv[1])),
            # probe 보고서 JSON에는 넣지 않는다(main에서 pop) — sector_map 전용
            "_codeIndustry": code_industry}


def write_sector_map(report, code_industry):
    """검증된 code→업종명 최소 맵 + crosswalk 커버리지 게이트 판정을 기록한다.

    ⚠️ 게이트(법인 수 가중 crosswalk 커버리지 ≥ 95%) 미달이면 GATE_FAIL로 기록만
       하고, 수집기(collect_market_universe)가 이 맵을 업종 통계에 쓰지 않는다.
    """
    merged_hist = {}
    for src in report["sources"].values():
        for ind, n in (src.get("industryHistogram") or {}).items():
            merged_hist[ind] = merged_hist.get(ind, 0) + n
    cov = sector_crosswalk.coverage(merged_hist)
    gate = "GATE_PASS" if cov["ratio"] >= CROSSWALK_GATE else "GATE_FAIL"
    payload = {
        "schemaVersion": "gaeo_sector_map_v1",
        "asOf": report["ranAt"],
        "source": "krx_corplist (kind.krx.co.kr 상장법인목록 공식 업종 컬럼)",
        "corpCount": len(code_industry),
        "crosswalkCoverage": {"total": cov["total"], "mapped": cov["mapped"],
                              "ratio": cov["ratio"], "gateMin": CROSSWALK_GATE,
                              "gate": gate,
                              "unknownIndustries": cov["unknownIndustries"]},
        # 종목코드 → KRX 공식 업종명. GAEO 대분류 변환은 사용 시점에
        # sector_crosswalk가 수행한다(맵 재수집 없이 crosswalk 개선 가능).
        "map": dict(sorted(code_industry.items())),
    }
    tmp = MAP_OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=0)
    os.replace(tmp, MAP_OUT)
    print(f"[probe] sector_map: {len(code_industry)}법인 · crosswalk {cov['ratio']:.2%} "
          f"({gate}) → {MAP_OUT}")


def main():
    report = {"ranAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
              "purpose": "full-market sector source verification (no guessing)",
              "sources": {}}
    code_industry = {}
    for mtype, name in (("stockMkt", "KOSPI"), ("kosdaqMkt", "KOSDAQ")):
        r = probe_krx_corplist(mtype, name)
        code_industry.update(r.pop("_codeIndustry", {}))
        report["sources"][f"krx_corplist_{name}"] = r
        print(f"[probe] KRX {name}: {r.get('status')} rows={r.get('rowCount')} "
              f"validCodes={r.get('validCodeCount')} industries={r.get('distinctIndustries')}")
    ok = all(s.get("status") == "OK" for s in report["sources"].values())
    report["verdict"] = "SOURCE_AVAILABLE" if ok else "BLOCKED_SOURCE"
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    os.replace(tmp, OUT)
    print(f"[probe] verdict={report['verdict']} → {OUT}")
    if ok:
        write_sector_map(report, code_industry)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
