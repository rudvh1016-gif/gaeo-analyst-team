# -*- coding: utf-8 -*-
"""Failure Miner — LLM보다 Python 먼저. 실측 실패를 군집으로 요약한다.

원칙:
  · raw row 수천 개를 Claude에 던지지 않는다. 여기서 군집 통계로 압축한다.
  · 발견 ≠ 규칙 변경. 결과는 연구 입력(failure_report)일 뿐 Production에
    직접 개입하지 않는다.
  · 표본 과신 금지: 군집마다 rawN과 uniqueDays를 함께 기록하고,
    최소지지(support) 미달 군집은 버린다.
  · 공개 파일에는 집계·종목코드 수준만 담는다(민감 상세는 Memory 쪽 암호화 경로).
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from compute_model_intelligence import build_market_regimes, call_hit, load_sectors  # noqa: E402

ANALYSTS = ("taro", "diana", "nova", "flow")
MIN_ROWS = 8          # 군집 최소 행 수
MIN_DAYS = 5          # 군집 최소 판단일 수 — 하루짜리 사건을 패턴이라 부르지 않는다
BIG_MOVE_PCT = 10.0
HIGH_CONFIDENCE = 60


def _cluster(rows, key, label, extra=None):
    days = {r["day"] for r in rows}
    rets = [r["ret5"] for r in rows if r.get("ret5") is not None]
    out = {"key": key, "label": label, "rawN": len(rows), "uniqueDays": len(days),
           "avgRet5Pct": round(sum(rets) / len(rets), 2) if rets else None,
           "exampleCodes": sorted({r["code"] for r in rows})[:8]}
    if extra:
        out.update(extra)
    return out


def mine(rows, closes=None):
    """성숙(결과 확정) 행에서 실패 군집을 뽑는다. 반환은 공개-안전한 집계."""
    matured = [r for r in rows if r.get("ret5") is not None and r.get("call")]
    regimes = build_market_regimes(closes) if closes else {}
    sectors = load_sectors()
    wrong = [r for r in matured
             if r["call"] in ("BUY", "SELL") and call_hit(r["call"], r["ret5"]) == 0]

    buckets = {}

    def put(bucket, row):
        buckets.setdefault(bucket, []).append(row)

    for r in matured:
        ret = r["ret5"]
        call = r["call"]
        if call == "BUY" and ret <= -BIG_MOVE_PCT:
            put(("call_outcome", "BUY_big_drop"), r)
        if call == "SELL" and ret >= BIG_MOVE_PCT:
            put(("call_outcome", "SELL_big_rise"), r)
        if call == "HOLD" and abs(ret) >= BIG_MOVE_PCT:
            put(("call_outcome", "HOLD_big_move"), r)
    for r in wrong:
        conf = r.get("confidence")
        if conf is not None and float(conf) >= HIGH_CONFIDENCE:
            put(("confidence", "high_confidence_wrong"), r)
        total = r.get("total")
        if total is not None and 43 <= float(total) <= 67:
            put(("boundary", "boundary_total_wrong"), r)
        sec = sectors.get(r["code"])
        if sec:
            put(("sector", sec), r)
        regime = (regimes.get(r["day"]) or {}).get("key")
        if regime:
            put(("regime", regime), r)
        wrong_analysts = []
        for analyst in ANALYSTS:
            item = r.get(analyst) or {}
            stance, score = item.get("stance"), item.get("score")
            if stance in ("bull", "bear"):
                against = (stance == "bull" and r["ret5"] < -1) or \
                          (stance == "bear" and r["ret5"] > 1)
                if against:
                    wrong_analysts.append(analyst)
        for analyst in wrong_analysts:
            put(("analyst", analyst), r)
        if len(wrong_analysts) >= 2:
            pair = "+".join(sorted(wrong_analysts)[:2])
            put(("analyst_pair", pair), r)

    clusters = []
    for (kind, name), bucket in buckets.items():
        days = {r["day"] for r in bucket}
        if len(bucket) < MIN_ROWS or len(days) < MIN_DAYS:
            continue
        share = round(len(bucket) / len(wrong) * 100, 1) if wrong and kind != "call_outcome" else None
        clusters.append(_cluster(bucket, f"{kind}:{name}",
                                 f"{kind}={name}",
                                 {"kind": kind, "shareOfWrongPct": share}))
    clusters.sort(key=lambda c: (-c["rawN"], c["key"]))
    return {
        "maturedN": len(matured),
        "wrongActionN": len(wrong),
        "uniqueDays": len({r["day"] for r in matured}),
        "minSupport": {"rows": MIN_ROWS, "days": MIN_DAYS},
        "clusters": clusters[:20],
        "droppedSmallClusters": max(0, len(buckets) - len(clusters)),
        "note": "발견은 연구 입력일 뿐이다. Production 규칙은 이 파일로 바뀌지 않는다.",
    }
