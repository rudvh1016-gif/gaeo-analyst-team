#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Trading 현황 보고 — 비개발자용 요약. 표본 부족이면 그 사실이 먼저 나온다."""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(HERE, "paper_trading")


def main():
    spath = os.path.join(DIR, "summary.json")
    if not os.path.exists(spath):
        print("GAEO 가상매매(Paper Trading)")
        print("  아직 기록이 없습니다 — Forward 시작일은 2026-08-18(KST)입니다.")
        print("  실제 돈이 아니며, Production 판단을 그대로 검증하는 가상 기록입니다.")
        return 0
    s = json.load(open(spath, encoding="utf-8"))
    print("GAEO 가상매매(Paper Trading) —", s.get("strategyVersion"))
    print(f"  ※ 실제 돈이 아닌 가상자금 기록입니다 (시작 {s.get('forwardStart')})")
    if str(s.get("evidence", "")).startswith("INSUFFICIENT"):
        print(f"  ⚠ {s['evidence']}")
    rows = [
        ("가상거래 시작", s.get("engineStartedAt") or "대기 중"),
        ("진행 중", f"{s.get('openTrades', 0)}건"),
        ("종료", f"{s.get('maturedTrades', 0)}건"),
        ("건너뜀(현금·시세)", f"{s.get('skippedSignals', 0)}건"),
        ("승률", f"{s['winRatePct']}%" if s.get("winRatePct") is not None else "표본 없음"),
        ("평균 수익(비용 미반영)", f"{s['avgReturnPct']:+.2f}%" if s.get("avgReturnPct") is not None else "표본 없음"),
        ("시장 대비", f"{s['avgRelativeReturnPct']:+.2f}%p" if s.get("avgRelativeReturnPct") is not None else "표본 없음"),
        ("평균 보유", f"{s['avgHoldingTradingDays']}거래일" if s.get("avgHoldingTradingDays") is not None else "—"),
        ("평균 MFE/MAE", (f"{s['avgMfePct']:+.2f}% / {s['avgMaePct']:+.2f}%"
                        if s.get("avgMfePct") is not None else "—")),
        ("비용 모델", s.get("costModel", "")[:40]),
    ]
    width = max(len(k) for k, _v in rows)
    for k, v in rows:
        print(f"  {k:<{width}}  {v}")
    print(f"  (요약 생성 {s.get('generatedAt')})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
