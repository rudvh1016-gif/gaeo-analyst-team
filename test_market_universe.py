#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FULL MARKET UNIVERSE 테스트 — 데이터 소스 fail-safe + 통계 유효성(synthetic).

전부 오프라인 synthetic fixture다. 네트워크를 쓰지 않는다.
"""
import json
import os
import shutil
import sys
import tempfile

import collect_market_universe as cmu

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


FIELDS = {"stockEndType", "tradableStatus", "fluctuationsRatio",
          "closePriceRaw", "marketValueRaw", "accumulatedTradingValueRaw"}


def row(code, name, rate, cap=1000.0, end_type="stock", tradable="tradable", tval=100.0):
    return {"itemCode": code, "stockName": name, "stockEndType": end_type,
            "tradableStatus": tradable,
            "fluctuationsRatio": None if rate is None else str(rate),
            "closePriceRaw": "10000", "marketValueRaw": str(cap),
            "accumulatedTradingValueRaw": str(tval)}


# ── 분류 (metadata·결정 규칙만) ──────────────────────────────────────────────
u = cmu.build_universe([
    ("KOSPI", row("005930", "삼성전자", 2.0)),
    ("KOSPI", row("005935", "삼성전자우", 1.0)),          # 종류주 — 코드 끝자리 규칙
    ("KOSPI", row("069500", "KODEX 200", 1.0, end_type="etf")),
    ("KOSDAQ", row("480000", "하나32호스팩", 0.1)),        # 법정 명칭 규칙
    ("KOSPI", row("395400", "SK리츠", 0.5)),               # 상장 명칭 규칙
    ("KOSPI", row("000100", "정지종목", 0.0, tradable="halt")),
    ("KOSPI", row("000100", "중복코드", 0.0)),             # duplicate
    ("KOSPI", row("Q12345", "이상코드", 0.0)),             # invalid code
], FIELDS)
check("보통주만 eligible (우선주 중복 투표 없음)",
      [x["code"] for x in u["eligible"]] == ["005930"])
check("ETF/SPAC/리츠/종류주 분리 계수",
      u["counts"].get("ETF") == 1 and u["counts"].get("SPAC") == 1
      and u["counts"].get("REIT") == 1 and u["counts"].get("CLASS_SHARE") == 1)
check("거래정지는 eligible 제외 + 별도 계수", u["suspendedCount"] == 1)
check("중복 코드 계수", u["duplicateCount"] == 1)
check("비정상 코드 계수", u["invalidCodeCount"] == 1)
check("stockEndType 실측 분포 기록", u["typeHistogram"].get("stock", 0) >= 5)

# ── D. missing return을 0으로 취급 금지 ─────────────────────────────────────
u2 = cmu.build_universe([
    ("KOSPI", row("000010", "가", 1.0)),
    ("KOSPI", row("000020", "나", None)),   # 등락률 없음
], FIELDS)
check("missing return은 eligible에서 제외(0% 아님)",
      len(u2["eligible"]) == 1 and u2["missingPriceCount"] == 1)

# ── A. Breadth 80% ───────────────────────────────────────────────────────────
elig = [{"code": f"{i:06d}", "rate": 1.0 if i < 8 else -1.0, "cap": 100.0,
         "tval": 10.0, "market": "KOSPI"} for i in range(10)]
s = cmu.market_stats(elig)
check("A: 10종목 중 8상승 → advanceRatio 0.8", s["advanceRatio"] == 0.8)
check("A: median 양수", s["medianReturn"] > 0)

# ── B. 소수 대형주 착시 — cap-weighted 강세 vs equal/median 약세 ─────────────
big = [{"code": "000001", "rate": 20.0, "cap": 90000.0, "tval": 10, "market": "KOSPI"},
       {"code": "000002", "rate": 20.0, "cap": 90000.0, "tval": 10, "market": "KOSPI"}]
small = [{"code": f"{i:06d}", "rate": -2.0, "cap": 100.0, "tval": 1, "market": "KOSPI"}
         for i in range(3, 21)]
sector_of = {x["code"]: "반도체" for x in big + small}
ss = cmu.sector_stats(big + small, sector_of)["sectors"]["반도체"]
check("B: cap-weighted는 강세", ss["capWeightedReturn"] > 10)
check("B: median은 약세 (전체 확산 아님)", ss["medianReturn"] < 0)
check("B: 상승 비율 10%", ss["advanceRatio"] == 0.1)
check("B: 대형주 집중 노출 (Top1 기여 ≥ 45%)", ss["capTop1Share"] >= 0.45)
check("B: breadthDivergence 양수(대형주 착시 신호)", ss["breadthDivergence"] > 10)

# ── C. 작은 표본 ─────────────────────────────────────────────────────────────
tiny = [{"code": f"{i:06d}", "rate": 1.0, "cap": 100.0, "tval": 1, "market": "KOSPI"}
        for i in range(3)]
st = cmu.sector_stats(tiny, {x["code"]: "소형업종" for x in tiny})["sectors"]["소형업종"]
check("C: 표본 3개 → LOW_SAMPLE", st.get("reliability") == "LOW_SAMPLE")

# ── E. outlier가 median을 왜곡하지 않음 ─────────────────────────────────────
out = [{"code": f"{i:06d}", "rate": 0.5, "cap": 100.0, "tval": 1, "market": "KOSPI"}
       for i in range(9)]
out.append({"code": "999990", "rate": 500.0, "cap": 100.0, "tval": 1, "market": "KOSPI"})
so = cmu.market_stats(out)
check("E: +500% outlier에도 median ≈ 0.5", so["medianReturn"] == 0.5)
check("E: equal-weight 평균은 왜곡됨(비교용으로만 존재)", so["equalWeightReturn"] > 40)

# ── 매핑 안 된 종목을 '기타'로 몰지 않음 ─────────────────────────────────────
mixed = cmu.sector_stats(big + small, {"000001": "반도체"})
check("unmapped는 업종에 안 들어가고 카운트만", mixed["unmappedCount"] == len(big + small) - 1
      and "기타" not in mixed["sectors"])

# ── FAIL SAFE — 비정상 수집이 last-good을 덮어쓰지 않음 ─────────────────────
tmp = tempfile.mkdtemp(prefix="gaeo_mu_")
try:
    orig = {n: getattr(cmu, n) for n in
            ("OUT_DIR", "STATE_PATH", "VERIFY_PATH", "RAW_LATEST", "PUBLIC_JS", "HISTORY_DIR")}
    cmu.OUT_DIR = tmp
    cmu.STATE_PATH = os.path.join(tmp, "state.json")
    cmu.VERIFY_PATH = os.path.join(tmp, "source_verify.json")
    cmu.RAW_LATEST = os.path.join(tmp, "raw.json.gz")
    cmu.PUBLIC_JS = os.path.join(tmp, "market_context.js")
    cmu.HISTORY_DIR = os.path.join(tmp, "history")

    # 검증 파일 없으면 본 수집 거부 (추측 수집 금지)
    rc = cmu.run_full()
    check("source_verify 없이 본 수집 거부", rc == 2)

    # 마지막 정상 상태 심어두고, 수집이 100종목만 오는 상황을 흉내
    with open(cmu.VERIFY_PATH, "w") as f:
        json.dump({"markets": {"KOSPI": {"stockFields": {k: {} for k in FIELDS}}}}, f)
    good_state = {"status": "READY", "rawCount": 3900, "eligibleCount": 2200}
    with open(cmu.STATE_PATH, "w") as f:
        json.dump(good_state, f)
    cmu.collect_market = lambda market: ([row(f"{i:06d}", f"주식{i}", 1.0)
                                          for i in range(50)], 50)
    with open(cmu.PUBLIC_JS, "w") as f:
        f.write("window.GAEO_MARKET_CONTEXT={\"marker\":\"last-good\"};")
    rc = cmu.run_full()
    kept = open(cmu.PUBLIC_JS).read()
    st = json.load(open(cmu.STATE_PATH))
    check("비정상 수집(급감) → 산출물 덮어쓰기 금지", rc == 1 and "last-good" in kept)
    check("비정상 수집 → 상태만 기록, last-good rawCount 유지",
          st.get("rawCount") == 3900 and st.get("status") in ("SOURCE_ERROR", "FULL_MARKET_PARTIAL"))
finally:
    for n, v in orig.items():
        setattr(cmu, n, v)
    shutil.rmtree(tmp, ignore_errors=True)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_market_universe: 전체 통과")
