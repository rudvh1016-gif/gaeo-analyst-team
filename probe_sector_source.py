#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FULL MARKET 업종 소스 실검증 프로브 — 추측 금지 원칙의 실행 도구.

전체시장 업종 Breadth를 만들려면 '검증된 업종 소스'가 필요하다.
이 스크립트는 후보 소스의 실제 응답을 러너에서 확인해
market_universe/sector_source_probe.json에 **스키마와 분포만** 기록한다.

후보 1: KRX 상장법인목록 다운로드(kind.krx.co.kr) — 공식 업종 컬럼 보유.
        단 2026-07 러너에서 해외 IP 차단(0건)이 관측된 적이 있어 재검증 필요.

⚠️ 회사별 원자료를 커밋하지 않는다 — 컬럼 목록·건수·업종명 분포만 남긴다.
⚠️ 이 프로브가 실패하면 업종 매핑은 BLOCKED_SOURCE로 정직하게 보고한다.
"""
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "market_universe", "sector_source_probe.json")
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
    return {"market": market_name, "status": "OK" if code_ok else "EMPTY",
            "columns": cols, "rowCount": len(rows), "validCodeCount": code_ok,
            "industryFilled": industry_filled,
            "industryFillRatio": round(industry_filled / code_ok, 4) if code_ok else 0,
            "distinctIndustries": len(industries),
            # 업종명 분포(회사 원자료 아님) — crosswalk 설계의 근거 자료
            "industryHistogram": dict(sorted(industries.items(), key=lambda kv: -kv[1]))}


def main():
    report = {"ranAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
              "purpose": "full-market sector source verification (no guessing)",
              "sources": {}}
    for mtype, name in (("stockMkt", "KOSPI"), ("kosdaqMkt", "KOSDAQ")):
        r = probe_krx_corplist(mtype, name)
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
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
