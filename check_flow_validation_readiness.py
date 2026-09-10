#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FLOW(수급) 산식 6-arm 검증의 **표본 조건**만 센다 (2026-09-23 예정 시험의 기계 부분).

세는 것 (docs/PREREGISTRATION_BUY_FILTERS_20260905.md §8 4번 · 9/23 Routine 원문의 표본 조건)
  · 실제 자동 판단일(tier=auto·recon 아님·판단 보류 아님, 5번째 거래일 종가가 기준일 이전에 확정된 것) 수
  · 그중 flow_history 가 판단일까지 5거래일을 모두 갖춘 "공통 날짜" 수 (arm B1·B2·C1·R 은 이 날짜에서만 계산 가능)
  · 공통 날짜의 시장국면 분포(compute_model_intelligence.build_market_regimes: trend×vol 4종)와 국면별 일수
  · 조건: 공통 날짜 ≥ 20 · 국면 3종 이상 각 4일 이상 → READY, 아니면 NOT_READY 와 예상 충족일(거래일 달력)

하지 않는 것
  · arm 채점·부트스트랩·Holm·적중률 등 **효과**는 계산하지 않는다. 그 정의는 아직 코드로 확정되지 않았다
    (config/validation_schedule.json 의 definitionGaps). 표본 수만 센다. LLM 호출 0.

    python3 check_flow_validation_readiness.py --json --as-of 2026-09-23
"""
import argparse
import bisect
import datetime
import json
import os
import sys
from collections import Counter

import compute_team_weights as W
from compute_model_intelligence import build_market_regimes
from krx_calendar import is_krx_trading_day

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))
MIN_COMMON_DAYS = 20
MIN_REGIME_KINDS = 3
MIN_DAYS_PER_REGIME = 4
HORIZON = 5
FLOW_LOOKBACK_SESSIONS = 5       # A0·B 계열이 보는 최근 5거래일 수급


def load_flow_days(root):
    days = set()
    idx_path = os.path.join(root, "flow_history", "index.json")
    if not os.path.exists(idx_path):
        return days
    idx = json.load(open(idx_path, encoding="utf-8"))
    for m in idx.get("months", []):
        p = os.path.join(root, "flow_history", m.get("file", ""))
        if os.path.exists(p):
            doc = json.load(open(p, encoding="utf-8"))
            days |= set((doc.get("days") or {}).keys())
    return days


def matured_auto_days(hist, closes, as_of):
    """익은 실제 자동 판단일 → {날짜: 행 수}."""
    out = Counter()
    for code, entries in hist.items():
        prices = closes.get(code)
        if not prices or not isinstance(entries, list):
            continue
        dates = [r["date"] for r in prices]
        for e in entries:
            if not isinstance(e, dict) or e.get("tier") != "auto" or e.get("recon"):
                continue
            if e.get("judgmentWithheld") or e.get("call") not in ("BUY", "HOLD", "SELL"):
                continue
            day = str(e.get("date", ""))[:10]
            if not day or day > as_of:
                continue
            j = bisect.bisect_right(dates, day) + HORIZON - 1
            if j >= len(prices) or prices[j]["date"] > as_of:
                continue
            out[day] += 1
    return out


def sessions_before(day, n, trading_days_sorted):
    """day 를 포함해 직전 n 거래일(달력 기준)."""
    k = bisect.bisect_right(trading_days_sorted, day)
    return trading_days_sorted[max(0, k - n):k]


def assess(hist, closes, flow_days, as_of):
    decision = matured_auto_days(hist, closes, as_of)
    all_days = sorted(decision)
    # 달력상 거래일 목록(판단일 범위 안)
    if all_days:
        d0 = datetime.date.fromisoformat(all_days[0]) - datetime.timedelta(days=14)
        d1 = datetime.date.fromisoformat(all_days[-1])
        cal = []
        d = d0
        while d <= d1:
            if is_krx_trading_day(d):
                cal.append(d.isoformat())
            d += datetime.timedelta(days=1)
    else:
        cal = []
    common = [d for d in all_days if all(s in flow_days for s in sessions_before(d, FLOW_LOOKBACK_SESSIONS, cal))]
    regimes = build_market_regimes(closes) if closes else {}
    regime_days = Counter(regimes.get(d, {}).get("key", "unknown") for d in common)
    kinds_ok = [k for k, n in regime_days.items() if k != "unknown" and n >= MIN_DAYS_PER_REGIME]
    ready = len(common) >= MIN_COMMON_DAYS and len(kinds_ok) >= MIN_REGIME_KINDS
    # 예상 충족일: 공통 날짜가 부족하면 남은 수만큼 거래일을 더한 날(+5거래일 성숙)
    expected = None
    if len(common) < MIN_COMMON_DAYS:
        need = MIN_COMMON_DAYS - len(common)
        d = datetime.date.fromisoformat(as_of)
        count = 0
        while count < need + HORIZON:
            d += datetime.timedelta(days=1)
            if is_krx_trading_day(d):
                count += 1
        expected = d.isoformat()
    return {
        "schemaVersion": "gaeo_flow_validation_readiness_v1",
        "asOf": as_of,
        "status": "READY" if ready else "NOT_READY",
        "maturedAutoDecisionDays": len(all_days),
        "firstDecisionDay": all_days[0] if all_days else None,
        "lastDecisionDay": all_days[-1] if all_days else None,
        "flowHistoryDays": len(flow_days),
        "flowHistoryRange": [min(flow_days), max(flow_days)] if flow_days else None,
        "commonDays": len(common),
        "commonDayList": common,
        "regimeDays": dict(regime_days),
        "regimeKindsMeetingMin": kinds_ok,
        "conditions": {"minCommonDays": MIN_COMMON_DAYS, "minRegimeKinds": MIN_REGIME_KINDS,
                       "minDaysPerRegime": MIN_DAYS_PER_REGIME},
        "expectedReadyDateIfNoGaps": expected,
        "armEvaluation": "NOT_RUN — 6-arm 채점 정의가 코드로 확정되지 않았다(config/validation_schedule.json definitionGaps). 표본 조건만 보고한다.",
    }


def plain(r):
    lines = [f"[FLOW 검증 표본 조건] 기준일 {r['asOf']} · {r['status']}",
             f"  익은 실제 자동 판단일 {r['maturedAutoDecisionDays']}일({r['firstDecisionDay']}~{r['lastDecisionDay']}) · flow_history {r['flowHistoryDays']}일 {r['flowHistoryRange']}",
             f"  공통 날짜(5거래일 수급이 다 있는 판단일) {r['commonDays']}일 / 최소 {r['conditions']['minCommonDays']}일 · 국면별 {r['regimeDays']} (각 {r['conditions']['minDaysPerRegime']}일 이상인 국면 {r['regimeKindsMeetingMin']})"]
    if r["expectedReadyDateIfNoGaps"]:
        lines.append(f"  공백 없이 쌓이면 {r['expectedReadyDateIfNoGaps']} 전후 충족")
    lines.append(f"  arm 채점: {r['armEvaluation']}")
    return "\n".join(lines)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--as-of", default=None)
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    as_of = args.as_of or datetime.datetime.now(KST).date().isoformat()
    hist = W.load_js_object(os.path.join(args.root, "history.js"), "LIVE_HISTORY") or {}
    data_path = os.path.join(args.root, "analysis_data.json")
    closes = {}
    if os.path.exists(data_path):
        data = json.load(open(data_path, encoding="utf-8"))
        closes = {c: sorted(s["daily"], key=lambda r: r["date"]) for c, s in data.get("stocks", {}).items() if s.get("daily")}
    r = assess(hist, closes, load_flow_days(args.root), as_of)
    print(json.dumps(r, ensure_ascii=False, indent=1) if args.json else plain(r))
    return 0


if __name__ == "__main__":
    sys.exit(main())
