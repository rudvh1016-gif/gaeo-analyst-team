#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""사전등록 BUY 필터 검증의 **표본 수만** 센다 — 효과 크기·부트스트랩·판정은 계산하지 않는다 (2026-09-10 구간 C).

왜 있나
  9/15(DIANA 확인)·9/23(FLOW 표본 점검) 확인 시험은 등록 문서 §5 대로 "표본 수 확인만" 한다. 그런데 실행기가 두 시험에서도
  evaluate_preregistered_buy_filters.py(확정 평가 명령)를 그대로 불렀다. 판단일이 20일 미만이면 그 스크립트가 스스로 INSUFFICIENT 를
  내지만, 실행이 지연돼 표본이 차 버리면 확인 시험이 확정 평가로 둔갑할 수 있다(훔쳐보기). 이 스크립트는 evaluate() 를 아예 부르지 않고
  collect_rows() 만 써서 표본 수·제외 사유·기록 누락만 낸다. 20일이 차더라도 판정을 내지 않는다 — 확정 평가는 10/19·11/16 의
  prereg_evaluate 단계뿐이다.

    python3 prereg_sample_count.py --as-of YYYY-MM-DD --json
종료코드: 0 정상 · 2 입력 없음/형식 오류. 파일을 쓰지 않는다. 등록 상수(REGISTRATION)를 읽기만 하고 바꾸지 않는다.
"""
import argparse
import datetime
import json
import sys

import evaluate_preregistered_buy_filters as E

SCHEMA = "gaeo_prereg_sample_count_v1"


def count_sample(hist, closes, as_of, reg=E.REGISTRATION):
    """collect_rows 만 호출한다. evaluate()·_group_test·bootstrap 은 여기서 절대 부르지 않는다."""
    rows, dropped, truncated = E.collect_rows(hist, closes, as_of, reg)
    buy = [r for r in rows if r["call"] == "BUY"]
    days = sorted({r["day"] for r in rows})
    return {
        "schemaVersion": SCHEMA,
        "status": "COUNTED",
        "evaluated": False,
        "asOf": as_of,
        "windowStart": reg["windowStart"],
        "minDecisionDays": reg["minDecisionDays"],
        "sample": {
            "rows": len(rows), "buy": len(buy), "decisionDays": len(days),
            "firstDecisionDate": days[0] if days else None, "lastDecisionDate": days[-1] if days else None,
            "buyFeatureRecorded": sum(1 for r in buy if r["featureRecorded"]),
            "buyFeatureUnrecorded": sum(1 for r in buy if not r["featureRecorded"]),
            "excluded": dict(dropped), "retentionTruncatedCodes": truncated,
            "nonTradingDecisionDates": E._non_trading_decision_dates(hist, reg["windowStart"], as_of),
        },
        "note": ("표본 수만 셌다. 효과 크기·판정은 계산하지 않았다(확인 시험 전용). "
                 f"확정 평가 최소 판단일 {reg['minDecisionDays']}일 — 지금 {len(days)}일."),
    }


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--as-of", required=True, help="기준일 YYYY-MM-DD (실행기가 cutoffDate 를 넣는다)")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args(argv)
    try:
        datetime.date.fromisoformat(args.as_of)
    except ValueError:
        print(json.dumps({"schemaVersion": SCHEMA, "status": "ERROR", "error": f"--as-of 형식 오류: {args.as_of}"}, ensure_ascii=False))
        return 2
    try:
        hist, closes, prov = E.load_inputs()
    except (OSError, ValueError) as e:
        print(json.dumps({"schemaVersion": SCHEMA, "status": "ERROR", "error": f"입력 없음/형식 오류: {e}"}, ensure_ascii=False))
        return 2
    report = count_sample(hist or {}, closes, args.as_of)
    report["inputs"] = prov
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        s = report["sample"]
        print(f"[사전등록 표본 수] 기준일 {args.as_of} · 창 시작 {report['windowStart']} · 판단일 {s['decisionDays']}일 "
              f"(최소 {report['minDecisionDays']}) · 행 {s['rows']} · BUY {s['buy']} · 특징 미기록 {s['buyFeatureUnrecorded']} · 제외 {s['excluded']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
