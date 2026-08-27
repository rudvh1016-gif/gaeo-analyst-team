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
# ⚠️ 위 한 줄은 test_paper_portfolio.py가 문자열로 검사한다(회계를 여기서 재구현하지
#    않는다는 계약). 형태를 바꾸지 말고, 추가 import는 아래 줄에 붙일 것.
from paper_engine import observation_gaps, MIN_ENTRY_DAYS_FOR_EVIDENCE
from paper_engine import COST_MODEL_VERSION, cost_model_detail
from paper_engine import accounting_disclosure, realized_pnl_krw, ACCOUNTING_V2_NET
from paper_engine import accounting_version_for
from paper_engine import recomputed_benchmark, load_index_history
from paper_engine import entry_cash_outlay, trade_return_pct, ACCOUNTING_V1_GROSS
import paper_history
import paper_single_writer

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
    # 💸 화면이 "비용 전 수익률"과 "비용 반영 수익률"을 나란히 놓을 수 있게 함께 내보낸다.
    #    이게 없으면 화면은 금액(비용 반영)과 수익률(비용 전)을 화해시킬 숫자가 없다.
    "estimated_net_return_pct",
})
# 표시용 파생 필드(원장에 없고 여기서 계산해 붙인다) — 이 목록 밖은 붙이지 않는다.
# ⚠️ 전부 read-only 파생이다. 매매 판단(entry/exit)에는 어떤 영향도 주지 않는다.
DERIVED_ALLOWED = frozenset({
    "current_price", "valued_at", "market_value", "cost_basis",
    "unrealized_pnl", "unrealized_return_pct", "realized_pnl",
    "remaining_trading_days",
    # 💸 이 거래가 어느 장부(비용 반영 전/후)로 계산됐는지. 금액과 수익률이 같은
    #    기준인지 화면이 판단할 수 있어야 한다.
    "return_basis", "return_pct",
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
                         "avgMfePct", "avgMaePct",
                         # 순수익도 성과 결론이다 — 표본 게이트 안쪽에 둔다.
                         "estimatedNetReturnPct")


def _benchmark_fix(r, idx_hist):
    """청산 거래의 시장대비를 실제 진입일·청산일 종가로 다시 계산해 덮어쓴다.

    ⚠️ 원장은 고치지 않는다. 원장의 benchmark_* 는 '탐지 시점에 알 수 있었던 값'이고,
       장중에는 그 날 종가가 아직 없어 직전 거래일로 후퇴한다. 후퇴 폭이 진입과
       청산에서 달라(실측: 진입 -2거래일 · 청산 -1거래일) 시장대비가 부풀려졌다.
    ⚠️ 두 날짜의 종가가 아직 없으면 값을 지우고 만들지 않는다(추측 금지).
    """
    if r.get("status") != "CLOSED":
        return {}
    rb = recomputed_benchmark(r, idx_hist)
    if rb["status"] != "RECOMPUTED":
        return {"benchmark_return_pct": None, "relative_return_pct": None}
    return {"benchmark_return_pct": rb["benchmarkReturnPct"],
            "relative_return_pct": rb["relativeReturnPct"]}


def _cost_basis_mix(config, latest, val):
    """회계 기준이 섞여 있다는 사실과 미반영 비용을 화면으로 그대로 넘긴다.

    ⚠️ 키 이름에 'account'가 들어가면 안 된다 — 공개 payload는 계좌 흔적 차단
       (FORBIDDEN_SUBSTRINGS)에 걸려 산출물 생성이 통째로 막힌다. 그래서 엔진의
       accounting 블록을 여기서 안전한 이름으로 옮겨 싣는다(숫자는 그대로).
    ⚠️ 좋게 보이는 값만 고르지 않는다 — 전부 반영했을 때의 더 낮은 값도 함께 낸다.
    """
    d = accounting_disclosure(config, latest, val)

    def _label(v):
        return "NET" if v == ACCOUNTING_V2_NET else "GROSS"

    return {"current": _label(d["version"]), "legacy": _label(d["legacyVersion"]),
            "switchAt": d["costAccountingFrom"],
            "mixed": bool(d["unreflectedCostKrw"]),
            "grossBasisTrades": d["grossBasisTrades"],
            "netBasisTrades": d["netBasisTrades"],
            "unreflectedCostKrw": d["unreflectedCostKrw"],
            "cashIfAllNetKrw": d["cashIfAllNetKrw"],
            "equityIfAllNetKrw": d["equityIfAllNetKrw"],
            "realizedPnlIfAllNetKrw": d["realizedPnlIfAllNetKrw"],
            "portfolioReturnPctIfAllNet": d["portfolioReturnPctIfAllNetPct"]}


def _read_json(path, default=None):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def _read_ledger(data_dir=None, environment="LIVE_PAPER"):
    rows = []
    path = os.path.join(data_dir or DIR, "trades.jsonl")
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
        # TEST 기록은 절대 공개분에 안 섞는다. environment는 전략마다 다르므로
        # (V1 LIVE_PAPER · V2 LIVE_PAPER_SMART_V2 · V3 LIVE_PAPER_SCALP_V3)
        # 호출한 쪽이 자기 전략의 이름을 넘긴다 — 다른 전략의 행도 여기서 걸러진다.
        if r.get("environment") == environment:
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


def _derived(r, meta, business_dates, today, max_hold, gap_days=(), config=None):
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
                    # 💸 총계(payload.unrealizedPnl)는 '실제로 나간 돈' 기준인데
                    #    종목별 카드만 진입가×수량 기준이면 두 숫자가 안 맞는다
                    #    (실측: 총 -450원인데 종목별은 전부 0원). 같은 분모를 쓴다.
                    outlay = entry_cash_outlay(r, config)
                    out["unrealized_pnl"] = round(mark * qty - outlay)
                    if outlay:
                        # 수익률도 같은 분모(실제 나간 돈)를 쓴다 —
                        # 그래야 카드의 금액과 %가 서로를 부정하지 않는다.
                        out["unrealized_return_pct"] = round(
                            (mark * qty / outlay - 1) * 100, 2)
                    out["return_basis"] = ("GROSS" if accounting_version_for(r, config)
                                           == ACCOUNTING_V1_GROSS else "NET")
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
            # 💸 거래별 확정손익도 엔진 회계 함수를 그대로 쓴다. 합계만 고치면
            #    거래별 값의 합과 총계가 어긋난다(옛 기준 거래는 값이 안 바뀐다).
            out["realized_pnl"] = round(realized_pnl_krw(r, config))
            # 💸 금액이 비용 반영인데 옆의 수익률만 총수익이면, 총수익이 왕복비용보다
            #    작은 구간에서 "+0.22% · -105원"처럼 한 줄 안에서 부호가 엇갈린다.
            pct, ver = trade_return_pct(r, config)
            if pct is not None:
                out["return_pct"] = pct
            out["return_basis"] = "GROSS" if ver == ACCOUNTING_V1_GROSS else "NET"
        # 🕳️ 청산 시점에 엔진이 원장에 남긴 관측 공백을 그대로 전달한다.
        #    다시 계산하지 않는다 — 그 거래의 사실은 청산할 때 기록된 값이 맞다.
        if r.get("observation_gap_business_days"):
            out["observation_gap_business_days"] = list(r["observation_gap_business_days"])
    return {k: v for k, v in out.items()
            if k in DERIVED_ALLOWED or k == "holding_trading_days"}


def build_payload(data_dir, environment="LIVE_PAPER"):
    """한 전략 폴더의 공개 payload를 만든다(파생 전용 — 원본을 고치지 않는다).

    V1(paper_trading/)이 기본이고, V2(smart_v2/)·V3(scalp_v3/)도 같은 코드로 만든다 —
    산식이 두 벌 생기면 언젠가 어긋나므로 함수 하나를 폴더만 바꿔 부른다.
    """
    summary = _read_json(os.path.join(data_dir, "summary.json")) or {}
    state = _read_json(os.path.join(data_dir, "state.json")) or {}
    config = _read_json(os.path.join(data_dir, "config.json")) or {}
    latest = _read_ledger(data_dir, environment)

    opens = [r for r in latest.values() if r.get("status") == "OPEN"]
    closed = [r for r in latest.values() if r.get("status") == "CLOSED"]
    initial = config.get("initial_cash_krw", 10_000_000)
    # 평가금액 = 초기금 + 확정 손익(원가 기준 — 미실현 평가익을 미리 더하지 않는다)
    # 💸 확정 손익은 엔진의 회계 함수를 그대로 쓴다(여기서 다시 정의하지 않는다).
    #    거래마다 자기 회계 기준을 따르므로 옛 기록의 값은 예전과 같다.
    _cfg = {**config, "initial_cash_krw": initial}
    realized = sum(realized_pnl_krw(r, _cfg) for r in closed)
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
    _curve = os.path.join(data_dir, "equity_curve.jsonl")
    if os.path.exists(_curve):
        data_gaps = observation_gaps(_curve, business_dates, today_kst)
    else:
        # 외부 파일(summary.json)에서 온 값을 공개 payload에 그대로 싣지 않는다 —
        # 정상 경로(엔진 재계산)와 같은 모양만 통과시킨다.
        _gap_keys = ("businessDate", "kind", "observations")
        data_gaps = [{k: g[k] for k in _gap_keys if k in g}
                     for g in (summary.get("dataGaps") or []) if isinstance(g, dict)]
    gap_days = [g["businessDate"] for g in data_gaps if g.get("businessDate")]
    # 📉 시장대비 재계산에 쓸 지수 종가(한 번만 읽어 모든 거래에 같은 값을 쓴다)
    _idx_hist = load_index_history()

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
        # 표본이 얼마나 쌓였는지 — 화면이 "왜 아직 승률이 없는지"를 설명할 근거.
        "closedEntryDays": summary.get("closedEntryDays"),
        "minClosedForEvidence": summary.get("minClosedForEvidence", MIN_CLOSED_FOR_EVIDENCE),
        "minEntryDaysForEvidence": summary.get("minEntryDaysForEvidence",
                                               MIN_ENTRY_DAYS_FOR_EVIDENCE),
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
        # 💸 비용 모델 — 어떤 요율을 어디서 확인해 반영했는지 화면이 그대로 밝힐 근거.
        #    요율은 원장이 아니라 엔진 상수라, 요약이 낡았어도 여기서 바로 낼 수 있다
        #    (이 파일의 다른 총계와 같은 원칙: 러너가 새 엔진으로 한 번 더 돌기 전에도
        #     화면이 비지 않는다). 순수익은 원장에서 나오므로 요약 값을 그대로 쓴다.
        "costModel": summary.get("costModel") or COST_MODEL_VERSION,
        "costModelDetail": summary.get("costModelDetail") or cost_model_detail(),
        # 💸 회계 기준이 섞여 있다는 사실 — 숨기지 않고 화면까지 그대로 내보낸다.
        #    (엔진 회계 함수에서 방금 계산한 값이라 요약이 낡아도 정확하다)
        "costBasisMix": _cost_basis_mix(_cfg, latest, val),
        "estimatedNetReturnPct": summary.get("estimatedNetReturnPct"),
        "benchmarkNote": "종료거래 평균 시장대비는 종료된 개별 거래의 동일 기간 지수 대비 성과 평균이며, KOSPI/KOSDAQ 지수의 일 단위 종가 기준 근사치입니다(가상계좌 전체의 시장 대비 성과가 아님).",
        "maxHoldingTradingDays": max_hold,
        "lastCycleOk": cycle_ok,
        # 거래일인데 기록이 통째로 빠진 날 — 화면이 "여기는 비어 있다"고 밝힐 근거.
        "dataGaps": data_gaps,
        "recentTrades": [
            {**_public_trade(r),
             **_derived(r, open_meta.get(r.get("trade_id")), business_dates,
                        today_kst, max_hold, gap_days, _cfg),
             **_benchmark_fix(r, _idx_hist)}
            for r in recent
        ],
    }

    # 🔒 표본 게이트(2차 방어선) — SAMPLE_OK 도장이 찍히기 전에는 결론 숫자를 공개하지 않는다.
    # ⚠️ 라벨만 믿으면 안 된다. 이 방어선이 막으려는 게 "손으로 고쳐진 summary.json"인데
    #    손으로 고칠 수 있는 대상이 바로 그 라벨이다(evidence만 SAMPLE_OK로 바꾸면 뚫린다).
    #    그래서 원장에서 직접 센 청산 건수로도 함께 판정한다.
    # 🔒 건수와 판단일을 둘 다 원장에서 직접 세어 확인한다. 같은 날 한꺼번에 담은
    #    거래는 서로 독립이 아니므로, 건수만 채워진 표본으로 승률을 내보내지 않는다.
    _entry_days = {r.get("entry_business_date") for r in closed
                   if r.get("entry_business_date")}
    if (len(closed) < MIN_CLOSED_FOR_EVIDENCE
            or len(_entry_days) < MIN_ENTRY_DAYS_FOR_EVIDENCE
            or not str(payload.get("evidenceStatus") or "").startswith("SAMPLE_OK")):
        for _k in EVIDENCE_GATED_PUBLIC:
            payload[_k] = None

    # 전략 설명(역할·진입·청산 규칙 텍스트) — 버전 탭 화면이 규칙을 지어내지 않고
    # config에 적힌 그대로 읽게 한다. 없는 전략(V1 등)은 필드 자체를 만들지 않는다.
    for _k in ("strategyRole", "entryRule", "exitRule", "knownLimits",
               "takeProfitPct", "stopLossPct"):
        if config.get(_k):
            payload[_k] = config[_k]

    return payload, {"config": config, "initial": initial, "stage": stage,
                     "opens": opens, "closed": closed,
                     "business_dates": business_dates}


def _version_stub(strategy_version):
    """엔진이 아직 한 번도 돌지 않은 전략의 자리 표시 — 숫자를 지어내지 않는다."""
    return {"schemaVersion": "gaeo_paper_public_v1",
            "strategyVersion": strategy_version,
            "generatedAt": datetime.now(KST).isoformat(timespec="seconds"),
            "stage": "PREPARING",
            "initialVirtualCash": 10_000_000, "positionSizeKrw": 1_000_000,
            "openTrades": 0, "closedTrades": 0, "recentTrades": []}


# 사이트에 함께 싣는 추가 전략 버전 — (JS 전역 이름, 폴더, environment, 전략 이름).
# V2 공개는 2026-08-27 대표 결정(모의투자 버전 탭). V3는 처음부터 공개 설계.
PUBLIC_VERSIONS = (
    ("GAEO_PAPER_V2", "smart_v2", "LIVE_PAPER_SMART_V2", "PAPER_SMART_V2"),
    ("GAEO_PAPER_V3", "scalp_v3", "LIVE_PAPER_SCALP_V3", "PAPER_SCALP_V3"),
)


def build():
    payload, ctx = build_payload(DIR, "LIVE_PAPER")
    config, initial = ctx["config"], ctx["initial"]
    stage, opens, closed = ctx["stage"], ctx["opens"], ctx["closed"]
    business_dates = ctx["business_dates"]

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

    # 📚 추가 전략 버전(V2·V3) — V1과 같은 함수·같은 검열을 거쳐 같은 파일에 싣는다.
    #    한 버전이 실패해도 다른 버전과 V1 산출은 계속된다(전략 간 독립 — advisory 원칙).
    version_lines = []
    for js_key, sub, env, ver in PUBLIC_VERSIONS:
        vdir = os.path.join(DIR, sub)
        try:
            if os.path.exists(os.path.join(vdir, "config.json")):
                vpayload, _vctx = build_payload(vdir, env)
            else:
                vpayload = _version_stub(ver)
        except Exception as e:
            print(f"[paper_public] {ver} payload 실패 — 자리 표시로 대체: {type(e).__name__}")
            vpayload = _version_stub(ver)
        vblob = json.dumps(vpayload, ensure_ascii=False, separators=(",", ":"))
        if any(w in vblob.lower() for w in FORBIDDEN_SUBSTRINGS):
            print(f"[paper_public] {ver} 차단 — 금지 키워드 감지, 이 버전만 미게시")
            continue
        version_lines.append(f"window.{js_key}={vblob};\n")

    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: paper_public.py — 모의투자 공개 요약(파생 데이터, 원본은 paper_trading/)\n")
        f.write("window.GAEO_PAPER=" + blob + ";\n")
        for line in version_lines:
            f.write(line)
    os.replace(tmp, OUT)
    print(f"[paper_public] stage={stage} open={len(opens)} closed={len(closed)} → {OUT}")
    return 0


def main():
    """러너 진입점 — 비활성 러너는 공개 요약도 다시 만들지 않는다.

    build()가 아니라 여기서 막는 이유 : build()는 테스트가 임시 폴더로 직접 부르는
    라이브러리 함수라 게이트를 넣으면 계약이 바뀐다. 러너가 실제로 부르는 곳만 막는다.
    (비활성 러너가 paper_public.js를 다시 만들면 generatedAt이 바뀌어 커밋 대상이 생기고,
     그러면 "Ledger 변경 0 · push 0"이 깨진다)
    """
    if not paper_single_writer.allow("paper_public"):
        return 0
    return build()


if __name__ == "__main__":
    sys.exit(main())
