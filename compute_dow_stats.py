#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
요일별 평균 등락률 사전계산 → dow_stats.js
--------------------------------------------------
analysis_data.json의 종목별 일봉(daily)에서 "그날 각 종목의 전일대비 등락률"을
날짜별로 평균(등가중) 낸 뒤, 요일(월~금)별로 다시 평균한다.
브라우저가 이 결과(작은 파일)만 읽어 상단 '요일별 평균 등락률' 패널을 그린다.
러너가 매 분석 사이클마다 재생성하므로, analysis_data.json이 신선해질수록 표본이 늘어난다.

방법론은 index.html의 클라이언트 폴백 계산과 동일:
  per-date = mean_over_stocks( close_t / close_{t-1} - 1 )
  per-dow  = mean_over_dates( per-date )   (요일별)
"""
import json, datetime, sys, os

SRC = "analysis_data.json"
OUT = "dow_stats.js"


def main():
    if not os.path.exists(SRC):
        print(f"[dow_stats] {SRC} 없음 — 생략", file=sys.stderr)
        return 1
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)

    stocks = data.get("stocks", {})
    # 날짜 -> [등락률...]  (각 종목의 전일대비 %)
    per_date = {}
    for code, s in stocks.items():
        daily = s.get("daily")
        if not isinstance(daily, list) or len(daily) < 2:
            continue
        rows = sorted(
            (d for d in daily if d.get("date") and isinstance(d.get("close"), (int, float))),
            key=lambda d: d["date"],
        )
        for i in range(1, len(rows)):
            prev = rows[i - 1]["close"]
            cur = rows[i]["close"]
            if prev and prev > 0:
                per_date.setdefault(rows[i]["date"], []).append((cur / prev - 1) * 100.0)

    if not per_date:
        print("[dow_stats] 계산할 데이터 없음 — 생략", file=sys.stderr)
        return 1

    dates = sorted(per_date.keys())
    # 날짜별 등가중 평균 + 요일 판정(월=1 … 금=5)
    series = []          # [{date, avg, dow}]  (전송·투명성용, ~수십건)
    by_dow = {d: [] for d in range(1, 6)}
    for dt in dates:
        vals = per_date[dt]
        avg = sum(vals) / len(vals)
        iso = datetime.date.fromisoformat(dt).isoweekday()  # Mon=1 … Sun=7
        series.append({"date": dt, "avg": round(avg, 4), "dow": iso, "n": len(vals)})
        if 1 <= iso <= 5:
            by_dow[iso].append(avg)

    dow = {}
    for d in range(1, 6):
        arr = by_dow[d]
        if arr:
            dow[str(d)] = {
                "avg": round(sum(arr) / len(arr), 4),
                "n": len(arr),
                "up": sum(1 for v in arr if v > 0),
            }
        else:
            dow[str(d)] = {"avg": None, "n": 0, "up": 0}

    max_breadth = max(len(v) for v in per_date.values())
    payload = {
        "generatedAt": data.get("fetchedAt", ""),
        "from": dates[0],
        "to": dates[-1],
        "days": len(dates),
        "universe": len(stocks),
        "maxBreadth": max_breadth,
        "dow": dow,
        "series": series,
    }

    body = json.dumps(payload, ensure_ascii=False, indent=1)
    header = (
        "// 자동 생성: compute_dow_stats.py · 요일별 평균 등락률 사전계산(analysis_data.json 일봉 기반)\n"
        "// 상단 '요일별 평균 등락률' 패널이 이 파일을 읽는다. 없으면 index.html이 PRICE_HISTORY로 폴백 계산.\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + "const DOW_STATS = " + body + ";\n")

    print(
        f"[dow_stats] {OUT} 생성 — {dates[0]}~{dates[-1]} ({len(dates)}일) · "
        + " · ".join(f"{['','월','화','수','목','금'][d]} {dow[str(d)]['avg']}%(n{dow[str(d)]['n']})" for d in range(1, 6))
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
