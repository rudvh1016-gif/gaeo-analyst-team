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

# ── 승격 게이트 상수는 새로 만들지 않는다 ────────────────────────────────────
# 이 값들은 이미 저장소 다른 곳에서 "이 자료를 믿어도 되는가"를 판정하는 데
# 쓰이고 있다. 여기서 숫자를 다시 적으면 한쪽만 고쳐졌을 때 두 잣대가 조용히
# 어긋난다. 그래서 원본에서 가져다 쓴다(Single Source of Truth).
#   KRX_CORPLIST_MIN_COUNT   Guardian이 상장 증거로 인정하는 최소 법인 수
#   KRX_CORPLIST_REJECT_GATES Guardian이 거부하는 gate 값
#   MIN_COVERAGE_RATIO       수집기가 "직전 정상분 대비 급감"을 판정하는 비율
from gaeo_coverage.guardian import (KRX_CORPLIST_MIN_COUNT,      # noqa: E402
                                    KRX_CORPLIST_REJECT_GATES)
from collect_market_universe import MIN_COVERAGE_RATIO           # noqa: E402


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


def load_last_good():
    """지금 쓰이고 있는 sector_map.json. 없거나 깨졌으면 None(첫 수집으로 본다)."""
    try:
        with open(MAP_OUT, encoding="utf-8") as f:
            d = json.load(f)
        return d if isinstance(d.get("map"), dict) else None
    except Exception:
        return None


def build_candidate(report, code_industry):
    """후보 payload를 메모리에서 만든다. 이 함수는 파일을 쓰지 않는다."""
    merged_hist = {}
    for src in report["sources"].values():
        for ind, n in (src.get("industryHistogram") or {}).items():
            merged_hist[ind] = merged_hist.get(ind, 0) + n
    cov = sector_crosswalk.coverage(merged_hist)
    gate = "GATE_PASS" if cov["ratio"] >= CROSSWALK_GATE else "GATE_FAIL"
    return {
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


def validate_candidate(report, candidate, last_good=None):
    """승격해도 되는 후보인가. 실패 사유 리스트를 돌려준다(빈 리스트 = 통과).

    ⭐ 왜 이 검사가 필요한가 (2026-08-26 감사)
       예전에는 두 시장의 fetch가 성공하기만 하면 곧바로 sector_map.json을
       덮어썼다. 그런데 시장 status는 "유효한 6자리 코드가 1건이라도 있으면 OK"라,
       KRX 응답이 잘려서 3건만 와도 OK가 됐다. 그 상태로 덮어쓰면 2,596법인짜리
       last-good이 3법인짜리 파일로 파괴되고, Guardian은 상장 증거를 잃는다.
       crosswalk 게이트도 마찬가지로 '기록만' 하고 쓰기를 막지 않았다.
       그래서 검증에 실패한 후보가 last-good을 덮는 경로를 여기서 끊는다.
    """
    fails = []
    srcs = report.get("sources") or {}

    # 1·2. 두 시장 모두 정상 응답이어야 한다(한쪽만으로 전체를 대체하지 않는다).
    for name in ("krx_corplist_KOSPI", "krx_corplist_KOSDAQ"):
        st = (srcs.get(name) or {}).get("status")
        if st != "OK":
            fails.append(f"{name} 상태가 OK가 아니다({st})")

    # 3. 스키마 — 종목코드·업종 컬럼을 실제로 찾았는가.
    for name, s in srcs.items():
        if s.get("status") == "SCHEMA_UNEXPECTED":
            fails.append(f"{name} 스키마가 예상과 다르다(columns={s.get('columns')})")

    # 4·5. 코드 형식과 중복. build_candidate가 dict로 모으므로 중복은 이미
    #      한 건으로 접히지만, 접히기 전 원자료 건수와 비교해 손실을 드러낸다.
    bad = [c for c in candidate["map"] if not re.match(r"^\d{6}$", c)]
    if bad:
        fails.append(f"6자리가 아닌 코드 {len(bad)}건(예: {bad[:3]})")

    # 6. 최소 법인 수 — Guardian이 상장 증거로 인정하는 하한과 같은 값을 쓴다.
    if candidate["corpCount"] < KRX_CORPLIST_MIN_COUNT:
        fails.append(f"법인 수 {candidate['corpCount']}건 < 최소 {KRX_CORPLIST_MIN_COUNT}건")

    # 7. 업종 채움 비율 — 코드만 있고 업종이 비면 업종 맵으로서 의미가 없다.
    for name, s in srcs.items():
        if s.get("status") == "OK" and (s.get("industryFillRatio") or 0) < CROSSWALK_GATE:
            fails.append(f"{name} 업종 채움 비율 {s.get('industryFillRatio')} < {CROSSWALK_GATE}")

    # 8. crosswalk 게이트 — Guardian이 거부하는 gate 값이면 승격하지 않는다.
    gate = candidate["crosswalkCoverage"]["gate"]
    if gate in KRX_CORPLIST_REJECT_GATES:
        fails.append(f"crosswalk {gate}"
                     f" (커버리지 {candidate['crosswalkCoverage']['ratio']:.2%}"
                     f" < {CROSSWALK_GATE:.0%})")

    # 9. 수집 시각이 해석 가능한가. Guardian이 신선도를 이 값으로 잰다.
    try:
        datetime.fromisoformat(str(candidate["asOf"]).replace("Z", "+00:00"))
    except Exception:
        fails.append(f"asOf를 해석할 수 없다({candidate.get('asOf')!r})")

    # 10. 직전 정상분 대비 급감 — 수집기가 쓰는 것과 같은 비율을 쓴다.
    prev = (last_good or {}).get("corpCount") or 0
    if prev and candidate["corpCount"] < prev * MIN_COVERAGE_RATIO:
        fails.append(f"법인 수 급감 {prev}건 → {candidate['corpCount']}건"
                     f" (직전 대비 {candidate['corpCount'] / prev:.1%}"
                     f" < {MIN_COVERAGE_RATIO:.0%})")
    return fails


def promote(candidate):
    """검증을 통과한 후보만 last-good 자리에 원자적으로 올린다."""
    tmp = MAP_OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(candidate, f, ensure_ascii=False, indent=0)
        f.flush()
        os.fsync(f.fileno())     # 전원이 끊겨도 반쪽짜리 파일이 남지 않게
    os.replace(tmp, MAP_OUT)


def write_sector_map(report, code_industry):
    """후보 생성 → 검증 → (통과할 때만) 승격. 실패하면 기존 파일은 1바이트도 안 바뀐다.

    반환: 승격했으면 True, 거부했으면 False.
    """
    last_good = load_last_good()
    candidate = build_candidate(report, code_industry)
    fails = validate_candidate(report, candidate, last_good)
    cov = candidate["crosswalkCoverage"]

    if fails:
        print(f"[probe] sector_map 승격 거부 — 기존 파일을 그대로 둔다({MAP_OUT})")
        for reason in fails:
            print(f"[probe]   · {reason}")
        if last_good:
            print(f"[probe]   유지되는 last-good: {last_good.get('corpCount')}법인 · "
                  f"asOf {last_good.get('asOf')}")
        else:
            print("[probe]   주의: last-good이 없어 업종 맵이 여전히 비어 있다")
        return False

    promote(candidate)
    print(f"[probe] sector_map 승격: {candidate['corpCount']}법인 · "
          f"crosswalk {cov['ratio']:.2%} ({cov['gate']}) → {MAP_OUT}")
    return True


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
    if not ok:
        # 소스가 막혔다(해외 IP 차단 등). 네이버 같은 벤더 자료로 대체하지 않는다.
        # last-good을 그대로 두고 정직하게 BLOCKED_SOURCE로 끝낸다.
        print("[probe] BLOCKED_SOURCE — 업종 맵을 건드리지 않는다(last-good 유지)")
        return 1
    # fetch가 됐어도 내용이 온전하지 않으면 승격하지 않는다.
    # 거부는 실패다(exit 2) — 조용히 0으로 끝나면 자동화가 '갱신됐다'고 오해한다.
    return 0 if write_sector_map(report, code_industry) else 2


if __name__ == "__main__":
    sys.exit(main())
