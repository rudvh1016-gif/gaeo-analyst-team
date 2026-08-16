#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 모의투자 — 사이트용 Public Snapshot 생성 (Read-only Derived Data).

⚠️ 원칙 (2026-08-16 Product Integration)
    - 이 파일은 trades.jsonl · summary.json · state.json 에서 **파생**만 한다.
      Source of Truth가 아니며, 언제든 원본에서 다시 만들 수 있다.
    - Trading Logic(paper_engine)을 절대 건드리지 않는다 — 읽기 전용.
    - 브라우저는 이 산출물(paper_public.js)만 읽는다. Toss API·Secret은
      러너에서만 쓰이고 여기엔 절대 들어가지 않는다(ALLOWED_KEYS 밖 금지).
    - 가짜 Trade·가짜 수익률을 만들지 않는다. 거래 0건이면 0건이라고 내보낸다.
"""
import json
import os
import sys
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
DIR = os.path.join(HERE, "paper_trading")
OUT = os.path.join(HERE, "paper_public.js")
KST = timezone(timedelta(hours=9))

# 공개 허용 필드만 — 여기 없는 키는 절대 내보내지 않는다(Sanitization 테스트가 검사).
TRADE_ALLOWED = frozenset({
    "symbol", "name", "market", "status", "signal_at", "detected_at",
    "entry_price", "entry_business_date", "quantity", "exit_price",
    "exit_business_date", "exit_reason", "holding_trading_days",
    "gross_return_pct", "benchmark_return_pct", "relative_return_pct",
    "mfe_pct", "mae_pct", "entry_method", "exit_method",
})
FORBIDDEN_SUBSTRINGS = ("client_id", "client_secret", "token", "authorization",
                        "account", "secret")


def _read_json(path, default=None):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _read_ledger():
    rows = []
    path = os.path.join(DIR, "trades.jsonl")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        rows.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
    latest = {}
    for r in rows:
        if r.get("environment") == "LIVE_PAPER":   # TEST 기록은 절대 공개분에 안 섞는다
            latest[r["trade_id"]] = r
    return latest


def _public_trade(r):
    return {k: r[k] for k in TRADE_ALLOWED if k in r and r[k] is not None}


def build():
    summary = _read_json(os.path.join(DIR, "summary.json")) or {}
    state = _read_json(os.path.join(DIR, "state.json")) or {}
    config = _read_json(os.path.join(DIR, "config.json")) or {}
    latest = _read_ledger()

    opens = [r for r in latest.values() if r.get("status") == "OPEN"]
    closed = [r for r in latest.values() if r.get("status") == "CLOSED"]
    initial = config.get("initial_cash_krw", 10_000_000)
    # 평가금액 = 초기금 + 확정 손익(원가 기준 — 미실현 평가익을 미리 더하지 않는다)
    realized = sum((r["exit_price"] - r["entry_price"]) * r["quantity"] for r in closed)
    equity_realized = initial + realized

    # 엔진 상태 → 사용자 상태 (가짜 승률·수익률을 만들지 않는 Empty State 어휘)
    last_result = str(state.get("lastCycleResult") or "")
    if "TOSS_MARKET_DATA_UNAVAILABLE" in last_result:
        stage = "AWAITING_MARKET_DATA"          # 시세 연결 준비 중
    elif not state.get("baselineCaptured"):
        stage = "BEFORE_FORWARD_START"          # 8/18 Forward 시작 전
    elif not latest:
        stage = "BASELINE_ONLY"                 # 기준 상태만 기록, 신규 전환 대기
    else:
        stage = "RUNNING"

    recent = sorted(latest.values(),
                    key=lambda r: r.get("exit_at") or r.get("detected_at") or "",
                    reverse=True)[:12]

    payload = {
        "schemaVersion": "gaeo_paper_public_v1",
        "strategyVersion": config.get("strategyVersion", "PAPER_BASELINE_V1"),
        "forwardStart": config.get("forwardStart", "2026-08-18"),
        "generatedAt": datetime.now(KST).isoformat(timespec="seconds"),
        "engineStartedAt": state.get("engineStartedAt"),
        "lastCycleAt": state.get("lastCycleAt"),
        "stage": stage,
        "initialVirtualCash": summary.get("initialVirtualCash", initial),
        "realizedVirtualEquity": equity_realized,      # legacy(확정분만) — UI는 아래 마크 기준 사용
        "currentVirtualEquity": summary.get("currentVirtualEquity"),
        "realizedPnl": summary.get("realizedPnl"),
        "unrealizedPnl": summary.get("unrealizedPnl"),
        "portfolioReturnPct": summary.get("portfolioReturnPct"),
        "maxDrawdownPct": summary.get("maxDrawdownPct"),
        "valuationObservedAt": summary.get("valuationObservedAt"),   # 러너 관측 시각
        "valuationMarketAt": summary.get("valuationMarketAt"),       # 공급자 원본 시각(없으면 null)
        "valuationStatus": summary.get("valuationStatus"),
        "executedTradeCount": summary.get("executedTradeCount", len(opens) + len(closed)),
        "openTrades": len(opens),
        "closedTrades": len(closed),
        "skippedSignals": summary.get("skippedSignals", 0),
        "evidenceStatus": summary.get("evidence"),
        "winRatePct": summary.get("winRatePct"),
        "avgReturnPct": summary.get("avgReturnPct"),
        "medianReturnPct": summary.get("medianReturnPct"),
        "avgWinPct": summary.get("avgWinPct"),
        "avgLossPct": summary.get("avgLossPct"),
        "avgBenchmarkReturnPct": summary.get("avgBenchmarkReturnPct"),
        "avgRelativeReturnPct": summary.get("avgRelativeReturnPct"),
        "avgHoldingTradingDays": summary.get("avgHoldingTradingDays"),
        "avgMfePct": summary.get("avgMfePct"),
        "avgMaePct": summary.get("avgMaePct"),
        "costModel": "COST_MODEL_INCOMPLETE",   # 비용 미검증 — '순수익' 표기 금지 근거
        "benchmarkNote": "종료거래 평균 시장대비는 종료된 개별 거래의 동일 기간 지수 대비 성과 평균이며, KOSPI/KOSDAQ 지수의 일 단위 종가 기준 근사치입니다(가상계좌 전체의 시장 대비 성과가 아님).",
        "recentTrades": [_public_trade(r) for r in recent],
    }

    blob = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    low = blob.lower()
    leaked = [w for w in FORBIDDEN_SUBSTRINGS if w in low]
    if leaked:
        print(f"[paper_public] 차단 — 금지 키워드 감지 {leaked}, 산출물 미생성")
        return 1
    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: paper_public.py — 모의투자 공개 요약(파생 데이터, 원본은 paper_trading/)\n")
        f.write("window.GAEO_PAPER=" + blob + ";\n")
    os.replace(tmp, OUT)
    print(f"[paper_public] stage={stage} open={len(opens)} closed={len(closed)} → {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(build())
