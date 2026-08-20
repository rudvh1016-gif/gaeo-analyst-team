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

# 회계는 여기서 다시 구현하지 않는다 — 엔진의 회계 함수 하나만 Source of Truth로 쓴다.
# (paper_engine 은 러너 사이클에서 이 파일보다 먼저 실행되므로 두 산출물은 같은 원장을 본다)
from paper_engine import portfolio_valuation, reporting_view, MIN_CLOSED_FOR_EVIDENCE
from paper_engine import observation_gaps      # 관측 공백 판정도 엔진 규칙 하나만 쓴다
import paper_history

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
# 표시용 파생 필드(원장에 없고 여기서 계산해 붙인다) — 이 목록 밖은 붙이지 않는다.
# ⚠️ 전부 read-only 파생이다. 매매 판단(entry/exit)에는 어떤 영향도 주지 않는다.
DERIVED_ALLOWED = frozenset({
    "current_price", "valued_at", "market_value", "cost_basis",
    "unrealized_pnl", "unrealized_return_pct", "realized_pnl",
    "remaining_trading_days",
    # 🕳️ 보유 기간 중 관측이 없던 거래일 — MFE/MAE를 읽을 때의 한계를 같이 보여준다.
    #    이름은 여기 한 곳에만 둔다(원장 필드와 이름이 겹치면 파생이 기록을 덮어쓴다).
    #    청산분은 원장에 기록된 값을 _derived가 그대로 전달하고, 보유분만 계산한다.
    "observation_gap_business_days",
})
FORBIDDEN_SUBSTRINGS = ("client_id", "client_secret", "token", "authorization",
                        "account", "secret")
# 표본이 차기 전(evidence가 SAMPLE_OK가 아닐 때) 화면으로 내보내지 않는 성과 결론 필드.
# 엔진(paper_engine.EVIDENCE_GATED_FIELDS)이 이미 null로 만들지만, 여기서 한 번 더
# 막는다 — summary.json이 옛 버전이거나 손으로 고쳐졌을 때도 결론 숫자가 새면 안 된다.
EVIDENCE_GATED_PUBLIC = ("winRatePct", "avgReturnPct", "medianReturnPct",
                         "avgWinPct", "avgLossPct",
                         "avgBenchmarkReturnPct", "avgRelativeReturnPct",
                         "avgMfePct", "avgMaePct")


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


def _holding_days(entry_day, business_dates, today):
    """paper_engine.manage_positions와 완전히 같은 산식(읽기 전용 재현).
    entry_business_date 이후 ~ 오늘까지의 영업일 수."""
    if not entry_day:
        return None
    return sum(1 for d in (business_dates or [])
               if d > entry_day and (today is None or d <= today))


def _derived(r, meta, business_dates, today, max_hold, gap_days=()):
    """화면 표시용 파생값. 원본에 없는 값을 지어내지 않는다 — 근거가 없으면 넣지 않는다."""
    out = {}
    qty = r.get("quantity")
    entry = r.get("entry_price")
    if qty and entry:
        out["cost_basis"] = round(entry * qty)
    if r.get("status") == "OPEN":
        # 러너가 사이클마다 이미 관측해 state.openMeta에 저장한 Mark를 그대로 쓴다.
        # (브라우저는 시세 API를 부르지 않는다 — 여기서 파생만 한다)
        mark = (meta or {}).get("lastMarkPrice")
        if isinstance(mark, (int, float)) and mark > 0:
            out["current_price"] = mark
            if qty:
                out["market_value"] = round(mark * qty)
                if entry:
                    out["unrealized_pnl"] = round((mark - entry) * qty)
            if entry:
                out["unrealized_return_pct"] = round((mark / entry - 1) * 100, 2)
        if (meta or {}).get("lastMarkObservedAt"):
            out["valued_at"] = meta["lastMarkObservedAt"]
        held = _holding_days(r.get("entry_business_date"), business_dates, today)
        if held is not None:
            out["holding_trading_days"] = held
            if isinstance(max_hold, int):
                out["remaining_trading_days"] = max(0, max_hold - held)
        # 🕳️ 보유 기간 중 관측이 없던 거래일. 청산 기록에는 엔진이 직접 남기고(원장),
        #    아직 들고 있는 종목은 여기서 같은 산식으로 파생한다 — 미리 알려주기 위함이다.
        entry_day = r.get("entry_business_date") or ""
        gaps = [d for d in (gap_days or ())
                if entry_day < d and (today is None or d <= today)]
        if gaps:
            out["observation_gap_business_days"] = gaps
    elif r.get("status") == "CLOSED":
        if qty and entry and r.get("exit_price"):
            out["realized_pnl"] = round((r["exit_price"] - entry) * qty)
        # 🕳️ 청산 시점에 엔진이 원장에 남긴 관측 공백을 그대로 전달한다.
        #    다시 계산하지 않는다 — 그 거래의 사실은 청산할 때 기록된 값이 맞다.
        if r.get("observation_gap_business_days"):
            out["observation_gap_business_days"] = list(r["observation_gap_business_days"])
    return {k: v for k, v in out.items()
            if k in DERIVED_ALLOWED or k == "holding_trading_days"}


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

    # 📊 포트폴리오 총계 — 엔진의 회계 함수를 그대로 호출한다(재구현 금지).
    #    summary.json 이 아직 새 필드를 갖고 있지 않아도(러너가 구버전 엔진으로 한 번 더
    #    돌기 전이어도) 같은 원장에서 즉시 계산되므로 화면이 비지 않는다.
    val = reporting_view(portfolio_valuation({**config, "initial_cash_krw": initial},
                                             latest, state.get("openMeta") or {}))
    invested = val["investedCostBasis"]
    cash = val["cash"]
    marked = val["markedPositionsValue"]      # 평가 불가 시 None (fail closed)
    equity = val["currentVirtualEquity"]      # 평가 불가 시 None (fail closed)
    # 자산 구성 비중 — 기준을 하나로 고정한다: "현재 가상자산" 대비.
    #   투자 비중 = 보유 평가금액 / 현재 가상자산, 현금 비중 = 가상현금 / 현재 가상자산.
    #   (투입원금/시작자금 기준과 섞지 않는다. 평가 불가 시 둘 다 None.)
    if equity and marked is not None:
        alloc_invested = round(marked / equity * 100, 1)
        alloc_cash = round(cash / equity * 100, 1)
    else:
        alloc_invested = alloc_cash = None

    # 건너뛴 신호 — "정상적인 미진입"과 "시스템 문제"를 절대 섞지 않는다.
    #   정상: 가상현금 부족 · 1주 가격이 종목당 기준금액보다 큼
    #   시스템: 시세를 못 받아 건너뜀
    def _skips(status):
        return sum(1 for r in latest.values() if r.get("status") == status)
    skipped_cash = _skips("SKIPPED_INSUFFICIENT_CASH")
    skipped_price = _skips("SKIPPED_PRICE_ABOVE_POSITION_SIZE")
    skipped_quote = _skips("SKIPPED_MARKET_DATA_UNAVAILABLE")

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

    # 진행 중 거래는 사용자가 가장 먼저 보는 정보라 개수 제한에 잘리지 않게 전부 싣고,
    # 종료 거래는 최근 12건까지만 싣는다(포지션당 100만원 · 총 1,000만원이라 open은 소수).
    opens_sorted = sorted(opens, key=lambda r: r.get("entry_business_date") or "", reverse=True)
    closed_sorted = sorted(closed, key=lambda r: r.get("exit_at") or r.get("detected_at") or "",
                           reverse=True)[:12]
    recent = opens_sorted + closed_sorted
    business_dates = state.get("businessDates") or []
    today_kst = datetime.now(KST).strftime("%Y-%m-%d")
    max_hold = config.get("maxHoldingTradingDays")
    max_hold = max_hold if isinstance(max_hold, int) else None
    open_meta = state.get("openMeta") or {}
    # 사이클이 실제로 성공했는지만 boolean으로 — 내부 결과 문자열은 공개하지 않는다.
    _last = str(state.get("lastCycleResult") or "")
    cycle_ok = True if _last.startswith("CYCLE_OK") else (False if _last else None)
    # 🕳️ 관측 공백 — 판정 규칙은 엔진 한 곳에만 있고(observation_gaps), 여기서는
    #    그 함수를 같은 원장에 대해 호출만 한다. summary.json이 아직 새 필드를 갖고
    #    있지 않아도(러너가 구버전 엔진으로 한 번 더 돌기 전이어도) 화면이 비지 않는다.
    #    근거 파일 자체가 없을 때만 요약에 실려 온 값으로 물러선다.
    _curve = os.path.join(DIR, "equity_curve.jsonl")
    if os.path.exists(_curve):
        data_gaps = observation_gaps(_curve, business_dates, today_kst)
    else:
        data_gaps = [g for g in (summary.get("dataGaps") or []) if isinstance(g, dict)]
    gap_days = [g["businessDate"] for g in data_gaps if g.get("businessDate")]

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
        # ── 포트폴리오 총계(신규) — 전부 위 portfolio_valuation() 한 곳에서 나온 값이다 ──
        "investedCostBasis": invested,          # 현재 투자원금(미청산 Σ 체결가×수량)
        "availableVirtualCash": cash,           # 남은 가상현금
        "markedPositionsValue": marked,         # 보유 평가금액(평가 불가 시 null)
        "allocationInvestedPct": alloc_invested,
        "allocationCashPct": alloc_cash,
        "positionSizeKrw": config.get("position_size_krw"),
        "skippedInsufficientCash": skipped_cash,
        "skippedPriceAbovePositionSize": skipped_price,
        "skippedMarketDataUnavailable": skipped_quote,
        # ⚠️ 아래 평가 계열도 summary.json이 아니라 위 val(같은 원장에서 방금 계산한 값)에서
        #    가져온다. 두 곳에서 따로 읽으면 요약이 낡았을 때 화면에서
        #    "현금 + 평가금액 ≠ 현재 가상자산"처럼 회계가 어긋나 보인다.
        "currentVirtualEquity": val["currentVirtualEquity"],
        "realizedPnl": val["realizedPnl"],
        "unrealizedPnl": val["unrealizedPnl"],
        "portfolioReturnPct": val["portfolioReturnPct"],
        "maxDrawdownPct": summary.get("maxDrawdownPct"),   # Equity Curve 기반 — 러너만 계산
        "valuationObservedAt": val["valuationObservedAt"],  # 러너 관측 시각
        "valuationMarketAt": val["valuationMarketAt"],      # 공급자 원본 시각(없으면 null)
        "valuationStatus": val["valuationStatus"],
        "executedTradeCount": val["executedTradeCount"],
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
        "maxHoldingTradingDays": max_hold,
        "lastCycleOk": cycle_ok,
        # 거래일인데 기록이 통째로 빠진 날 — 화면이 "여기는 비어 있다"고 밝힐 근거.
        "dataGaps": data_gaps,
        "recentTrades": [
            {**_public_trade(r),
             **_derived(r, open_meta.get(r.get("trade_id")), business_dates,
                        today_kst, max_hold, gap_days)}
            for r in recent
        ],
    }

    # 🔒 표본 게이트(2차 방어선) — SAMPLE_OK 도장이 찍히기 전에는 결론 숫자를 공개하지 않는다.
    # ⚠️ 라벨만 믿으면 안 된다. 이 방어선이 막으려는 게 "손으로 고쳐진 summary.json"인데
    #    손으로 고칠 수 있는 대상이 바로 그 라벨이다(evidence만 SAMPLE_OK로 바꾸면 뚫린다).
    #    그래서 원장에서 직접 센 청산 건수로도 함께 판정한다.
    if (len(closed) < MIN_CLOSED_FOR_EVIDENCE
            or not str(payload.get("evidenceStatus") or "").startswith("SAMPLE_OK")):
        for _k in EVIDENCE_GATED_PUBLIC:
            payload[_k] = None

    blob = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    low = blob.lower()
    leaked = [w for w in FORBIDDEN_SUBSTRINGS if w in low]
    if leaked:
        print(f"[paper_public] 차단 — 금지 키워드 감지 {leaked}, 산출물 미생성")
        return 1
    # 📚 날짜별 기록(History) — 원장 + Equity Curve에서만 파생한다.
    #    paper_trading/ 안에 두어 러너가 이미 커밋하는 경로를 그대로 쓴다(러너 변경 0).
    #    실패해도 공개 스냅샷 생성은 계속된다 — History 고장이 보유화면을 막지 않는다.
    try:
        hist = paper_history.build(
            paper_history.read_jsonl(os.path.join(DIR, "trades.jsonl")),
            paper_history.read_jsonl(os.path.join(DIR, "equity_curve.jsonl")),
            {**config, "initial_cash_krw": initial},
            business_dates=business_dates)
        hblob = json.dumps(hist, ensure_ascii=False, separators=(",", ":"))
        if not any(w in hblob.lower() for w in FORBIDDEN_SUBSTRINGS):
            hp = os.path.join(DIR, "history.json")
            with open(hp + ".tmp", "w", encoding="utf-8") as f:
                f.write(hblob)
            os.replace(hp + ".tmp", hp)
            print(f"[paper_public] history {len(hist['days'])}일 → {hp}")
        else:
            print("[paper_public] history 차단 — 금지 키워드 감지, 미생성")
    except Exception as e:
        print(f"[paper_public] history 생성 실패(공개 스냅샷은 계속): {type(e).__name__}")

    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: paper_public.py — 모의투자 공개 요약(파생 데이터, 원본은 paper_trading/)\n")
        f.write("window.GAEO_PAPER=" + blob + ";\n")
    os.replace(tmp, OUT)
    print(f"[paper_public] stage={stage} open={len(opens)} closed={len(closed)} → {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(build())
