#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Paper Trading Engine V1 — Production CHIEF 판단의 Forward 검증 전용.

무엇인가
    "현재 GAEO를 그날 실제로 믿고 거래했다면 무슨 일이 벌어졌는가"를
    가상자금으로만 기록한다. 실제 주문·실제 계좌·실제 돈은 일절 없다.

무엇이 아닌가 (V1 절대 규칙)
    - 새 투자 모델이 아니다. Production 판단(auto_analysis.js의 chief.call)을
      "있는 그대로" 사용한다. 새 필터·새 Threshold·모델 튜닝 금지.
    - 과거 Backfill 없음: PAPER_START_AT(2026-08-18 KST) 이후 실제로 새로
      발생(BUY 전환)한 판단만 거래로 인정한다.
    - Look-ahead 없음: 탐지 시각(paper_detected_at) 이후 관측된 시세로만
      가상 체결한다. 그 날의 저가 매수/고가 매도 같은 치팅 금지.
    - 조기 청산은 chief.call == 'SELL'(화면 라벨: 매도/비중 축소 계열)일 때만.
      HOLD(보유/관망)를 임의로 매도 신호로 해석하지 않는다.
    - Toss 시세 실패 시 가격을 추측하지 않는다 → SKIPPED/유지 후 재시도.
    - Ledger(trades.jsonl)가 Source of Truth. 현금·포지션은 Ledger에서
      재계산 가능하므로 중간 crash에도 이중 매수/유령 현금이 생기지 않는다.

Fill 규칙
    매수 = 탐지 이후 실측 Best Ask (없으면 현재가 fallback, 사유 기록)
    매도 = 결정 이후 실측 Best Bid (없으면 현재가 fallback, 사유 기록)
    장이 열려 있지 않으면 체결하지 않고 다음 사이클로 미룬다(PENDING_ENTRY).

Exit 규칙 (V1)
    ① 보유 5 거래일 도달(공식 캘린더 기준 — 주말·휴장일 미산입)
    ② 보유 중 chief.call 이 SELL 로 전환
    익절/손절 최적화 규칙 없음 — 대신 MFE/MAE를 기록해 후속 연구 재료로 남긴다.
"""
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta

import paper_market_data as pmd

HERE = os.path.dirname(os.path.abspath(__file__))
KST = timezone(timedelta(hours=9))

STRATEGY_VERSION = "PAPER_BASELINE_V1"
PAPER_START_AT = datetime(2026, 8, 18, 0, 0, tzinfo=KST)
MAX_HOLDING_TRADING_DAYS = 5
ENVIRONMENT = "LIVE_PAPER"          # 테스트는 TEST 로 분리(절대 혼합 금지)

DEFAULT_DIR = os.path.join(HERE, "paper_trading")


# ── 유틸 ────────────────────────────────────────────────────────────────────
def now_kst():
    return datetime.now(KST)


def iso(dt):
    return dt.isoformat(timespec="seconds")


def atomic_write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def trade_id_for(strategy, symbol, signal_at):
    """결정적 trade_id — 같은 Signal Episode는 몇 번 처리돼도 같은 id."""
    return hashlib.sha1(f"{strategy}|{symbol}|{signal_at}".encode()).hexdigest()[:16]


# ── Production Signal 읽기 (auto_analysis.js — 감사로 확인된 실제 소스) ─────
def load_production_signals(path=None):
    """LIVE_AUTO에서 {code: {"call","confidence","total","name"}}, analysis_completed_at.

    ⚠️ 판단을 재계산하지 않는다 — 파일에 있는 Production 값만 그대로 읽는다.
    """
    path = path or os.path.join(HERE, "auto_analysis.js")
    s = open(path, encoding="utf-8").read()
    payload = s[s.index("const LIVE_AUTO =") + len("const LIVE_AUTO ="):].strip().rstrip(";")
    d = json.loads(payload)
    rt = d.get("runTimestamps") or {}
    completed = rt.get("analysisCompletedAt")
    if not completed:
        # fallback: generatedAt "YYYY-MM-DD HH:MM" (KST) — 감사로 확인된 보조 시각
        g = d.get("generatedAt", "")
        m = re.match(r"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})", g)
        completed = iso(datetime(*map(int, m.groups()), tzinfo=KST)) if m else None
    names = {}
    try:
        ts = open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read()
        names = {c: n for c, n in re.findall(r'"code":\s*"(\d{6})",\s*"name":\s*"([^"]+)"', ts)}
    except OSError:
        pass
    signals = {}
    for code, row in (d.get("stocks") or {}).items():
        chief = row.get("chief") or {}
        call = chief.get("call")
        if call in ("BUY", "HOLD", "SELL"):
            signals[code] = {"call": call,
                             "confidence": chief.get("confidence"),
                             "total": chief.get("total"),
                             "name": names.get(code, code)}
    return {"signals": signals, "analysisCompletedAt": completed,
            "modelVersion": next(iter(d.get("stocks", {}).values()), {}).get("chief", {}).get("modelVersion")}


def load_market_map(path=None):
    """code → KOSPI/KOSDAQ (krx_list.json — 감사로 확인된 시장 구분 소스)."""
    path = path or os.path.join(HERE, "krx_list.json")
    try:
        d = json.load(open(path, encoding="utf-8"))
        return {it["c"]: it["m"] for it in d.get("items", []) if it.get("c") and it.get("m")}
    except Exception:
        return {}


def load_index_history(path=None):
    """MARKET_HISTORY — 날짜별 코스피/코스닥 값(벤치마크: 일 단위 근사, 한계 문서화)."""
    path = path or os.path.join(HERE, "market_history.js")
    try:
        s = open(path, encoding="utf-8").read()
        d = json.loads(re.search(r"=\s*(\{.*\})\s*;?\s*$", s, re.S).group(1))
        out = {}
        for day, row in d.items():
            out[day] = {"KOSPI": (row.get("kospi") or {}).get("value"),
                        "KOSDAQ": (row.get("kosdaq") or {}).get("value")}
        return out
    except Exception:
        return {}


def index_value_on_or_before(hist, market, day):
    for d in sorted(hist.keys(), reverse=True):
        if d <= day and hist[d].get(market):
            return hist[d][market], d
    return None, None


# ── Ledger (Source of Truth) ───────────────────────────────────────────────
class Ledger:
    def __init__(self, path, environment=ENVIRONMENT):
        self.path = path
        self.environment = environment
        self.rows = []
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line:
                        try:
                            self.rows.append(json.loads(line))
                        except json.JSONDecodeError:
                            continue   # 손상 라인은 무시(부분 기록 crash 보호)

    def append(self, row):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
            f.flush()
            os.fsync(f.fileno())
        self.rows.append(row)

    def latest_by_id(self):
        """trade_id → 마지막 이벤트 행. Ledger가 상태의 최종 근거다."""
        out = {}
        for r in self.rows:
            if r.get("environment") != self.environment:
                continue               # TEST 기록은 Forward 상태에 절대 반영 금지
            out[r["trade_id"]] = r
        return out

    def known_ids(self):
        return {r["trade_id"] for r in self.rows}


def derive_cash(config, latest):
    """현금 = 초기금 - 미청산 매수금 + 청산 순손익. Ledger에서 항상 재계산(crash-safe)."""
    cash = config["initial_cash_krw"]
    for r in latest.values():
        if r.get("status") == "OPEN":
            cash -= r["entry_price"] * r["quantity"]
        elif r.get("status") == "CLOSED":
            cash += (r["exit_price"] - r["entry_price"]) * r["quantity"]
    return cash


# ── Engine ─────────────────────────────────────────────────────────────────
class PaperEngine:
    def __init__(self, provider, data_dir=None, config=None, environment=ENVIRONMENT):
        self.provider = provider
        self.dir = data_dir or DEFAULT_DIR
        self.environment = environment
        self.config = config or self._load_config()
        self.ledger = Ledger(os.path.join(self.dir, "trades.jsonl"), environment)
        self.state = self._load_state()

    # ── 저장소 ──
    def _load_config(self):
        path = os.path.join(self.dir, "config.json")
        if os.path.exists(path):
            return json.load(open(path, encoding="utf-8"))
        return {"strategyVersion": STRATEGY_VERSION,
                "initial_cash_krw": 10_000_000,
                "position_size_krw": 1_000_000,
                "maxHoldingTradingDays": MAX_HOLDING_TRADING_DAYS}

    def _load_state(self):
        path = os.path.join(self.dir, "state.json")
        st = {}
        if os.path.exists(path):
            try:
                st = json.load(open(path, encoding="utf-8"))
            except json.JSONDecodeError:
                st = {}
        st.setdefault("schemaVersion", "gaeo_paper_state_v1")
        st.setdefault("strategyVersion", self.config.get("strategyVersion", STRATEGY_VERSION))
        st.setdefault("engineStartedAt", None)
        st.setdefault("baselineCaptured", False)
        st.setdefault("lastCall", {})
        st.setdefault("lastProcessedAnalysisAt", None)
        st.setdefault("businessDates", [])
        st.setdefault("openMeta", {})       # trade_id → {mfePrice, maePrice, entryBusinessDate}
        return st

    def _save_state(self):
        atomic_write(os.path.join(self.dir, "state.json"),
                     json.dumps(self.state, ensure_ascii=False, indent=1))

    # ── 사이클 ──
    def run_cycle(self, signals_bundle=None, now=None):
        """1 사이클: 캘린더 확인 → (개장 시) 신규 BUY 전환 진입 → 보유 관리/청산.

        반환: 사람이 읽는 result 문자열. Production을 절대 실패시키지 않는다 —
        어떤 오류든 상태만 기록하고 예외를 밖으로 던지지 않는 것은 호출측(run_safe).
        """
        now = now or now_kst()
        if now < PAPER_START_AT:
            return self._done("ENGINE_NOT_STARTED — Forward 시작일(2026-08-18) 이전", now)

        if not pmd.credentials_available() and self.provider.name == "TOSS":
            return self._done("TOSS_MARKET_DATA_UNAVAILABLE — credential 미등록(NEEDS_USER_ACTION)", now)

        # ① 공식 캘린더 — 실패 시 거래일을 추측하지 않고 사이클 전체 보류
        try:
            cal = self.provider.get_market_calendar_kr()
        except pmd.MarketDataUnavailable as e:
            return self._done(f"CALENDAR_UNAVAILABLE — 거래일 추측 금지, 보류 ({e})", now)
        today = cal.get("today") or {}
        today_date = today.get("date") or now.strftime("%Y-%m-%d")
        if not today.get("open"):
            return self._done(f"HOLIDAY — {today_date} 휴장(보유일 미산입·거래 없음)", now)

        session = today.get("integrated") or {}
        in_session = self._in_session(now, session)

        # 거래일 기록(보유일 계산의 근거 — 캘린더가 open이라고 한 날만)
        if today_date not in self.state["businessDates"]:
            self.state["businessDates"].append(today_date)
            self.state["businessDates"] = sorted(self.state["businessDates"])[-400:]

        bundle = signals_bundle or load_production_signals()
        signals = bundle["signals"]
        analysis_at = bundle.get("analysisCompletedAt")

        # ② 최초 실행 = Baseline 캡처만 (기존 BUY를 소급 매수하지 않는다 — Backfill 금지)
        if not self.state["baselineCaptured"]:
            self.state["engineStartedAt"] = iso(now)
            self.state["lastCall"] = {c: s["call"] for c, s in signals.items()}
            self.state["lastProcessedAnalysisAt"] = analysis_at
            self.state["baselineCaptured"] = True
            return self._done(f"BASELINE_CAPTURED — {len(signals)}종목 기준 상태 기록, 거래 없음", now)

        actions = []
        latest = self.ledger.latest_by_id()

        # ③ 신규 BUY 전환 탐지 (같은 분석 배치 재처리 = 같은 trade_id → 중복 진입 0)
        if analysis_at and analysis_at != self.state.get("lastProcessedAnalysisAt"):
            entered = self._process_entries(signals, analysis_at, now, in_session, latest, actions)
            # 진입까지 끝났을 때만 배치를 소비 처리(개장 전이면 다음 사이클에 재시도)
            if entered != "DEFERRED":
                self.state["lastCall"] = {c: s["call"] for c, s in signals.items()}
                self.state["lastProcessedAnalysisAt"] = analysis_at

        # ④ 보유 관리: MFE/MAE 관측 → SELL 전환/5거래일 청산
        self._manage_positions(signals, now, today_date, in_session, latest, actions)

        self._write_equity(now, latest)
        self._write_summary()
        msg = "; ".join(actions) if actions else "NO_ACTION"
        return self._done(f"CYCLE_OK — {msg}", now)

    # ── 진입 ──
    def _process_entries(self, signals, analysis_at, now, in_session, latest, actions):
        if not in_session:
            actions.append("장외 시간 — 신규 진입 보류(다음 개장 사이클에 처리)")
            return "DEFERRED"
        prev = self.state["lastCall"]
        candidates = [c for c, s in signals.items()
                      if s["call"] == "BUY" and prev.get(c) != "BUY"]
        # Production 기존 순위 규칙 그대로: 신뢰도 → 종합점수 → 코드 (새 랭킹 발명 금지)
        candidates.sort(key=lambda c: (-(signals[c]["confidence"] or 0),
                                       -(signals[c]["total"] or 0), c))
        market_map = load_market_map()
        idx_hist = load_index_history()
        cash = derive_cash(self.config, latest)
        pos_size = self.config["position_size_krw"]

        for code in candidates:
            tid = trade_id_for(self.state["strategyVersion"], code, analysis_at)
            if tid in self.ledger.known_ids():
                continue                            # 같은 Episode 중복 진입 금지
            detected_at = iso(now)
            base = {
                "trade_id": tid, "environment": self.environment,
                "strategy_version": self.state["strategyVersion"],
                "symbol": code, "name": signals[code]["name"],
                "market": market_map.get(code),
                "signal": "BUY", "signal_confidence": signals[code]["confidence"],
                "signal_total": signals[code]["total"],
                "signal_at": analysis_at, "detected_at": detected_at,
            }
            if cash < pos_size:
                self.ledger.append({**base, "status": "SKIPPED_INSUFFICIENT_CASH",
                                    "recorded_at": iso(now)})
                actions.append(f"{code} SKIP(현금 부족)")
                continue
            try:
                fetched_at = iso(now)
                ob = self.provider.get_orderbook(code)
                price, method = ob.get("bestAsk"), "BEST_ASK"
                quote_ts = ob.get("timestamp")
                if price is None:
                    px = self.provider.get_prices([code]).get(code)
                    if not px:
                        raise pmd.MarketDataUnavailable("현재가 없음")
                    price, method = px["price"], "LAST_PRICE_FALLBACK"
                    quote_ts = px.get("timestamp")
            except pmd.MarketDataUnavailable as e:
                self.ledger.append({**base, "status": "SKIPPED_MARKET_DATA_UNAVAILABLE",
                                    "skip_reason": str(e)[:120], "recorded_at": iso(now)})
                actions.append(f"{code} SKIP(시세 불가)")
                continue
            qty = int(pos_size // price)
            if qty < 1:
                self.ledger.append({**base, "status": "SKIPPED_PRICE_ABOVE_POSITION_SIZE",
                                    "recorded_at": iso(now)})
                continue
            entry_day = now.strftime("%Y-%m-%d")
            bench, bench_day = index_value_on_or_before(
                idx_hist, base["market"] or "KOSPI", entry_day)
            self.ledger.append({**base, "status": "OPEN",
                                "entry_data_source": self.provider.name,
                                "entry_method": method,
                                "entry_quote_at": quote_ts,
                                "market_data_fetched_at": fetched_at,
                                "simulated_fill_at": iso(now),
                                "entry_price": price, "quantity": qty,
                                "entry_business_date": entry_day,
                                "benchmark_entry_value": bench,
                                "benchmark_entry_day": bench_day,
                                "recorded_at": iso(now)})
            self.state["openMeta"][tid] = {"mfePrice": price, "maePrice": price,
                                           "entryBusinessDate": entry_day}
            cash -= price * qty
            latest.update(self.ledger.latest_by_id())
            actions.append(f"{code} 진입 {qty}주 @{price:,.0f}({method})")
        return "PROCESSED"

    # ── 보유 관리/청산 ──
    def _manage_positions(self, signals, now, today_date, in_session, latest, actions):
        open_rows = [r for r in latest.values() if r.get("status") == "OPEN"]
        if not open_rows:
            return
        # MFE/MAE 관측(사이클 시점 실측 — 해상도는 사이클 주기, 문서화된 한계)
        prices = {}
        try:
            prices = self.provider.get_prices([r["symbol"] for r in open_rows])
        except pmd.MarketDataUnavailable:
            actions.append("보유 시세 관측 실패(이번 사이클 MFE/MAE 미갱신)")
        for r in open_rows:
            meta = self.state["openMeta"].setdefault(
                r["trade_id"], {"mfePrice": r["entry_price"], "maePrice": r["entry_price"],
                                "entryBusinessDate": r["entry_business_date"]})
            px = prices.get(r["symbol"])
            if px:
                meta["mfePrice"] = max(meta["mfePrice"], px["price"])
                meta["maePrice"] = min(meta["maePrice"], px["price"])

            holding_days = sum(1 for d in self.state["businessDates"]
                               if d > r["entry_business_date"] and d <= today_date)
            cur_call = (signals.get(r["symbol"]) or {}).get("call")
            reason = None
            if cur_call == "SELL":
                reason = "CHIEF_SELL"
            elif holding_days >= self.config.get("maxHoldingTradingDays", 5):
                reason = "MAX_HOLDING_5D"
            if not reason:
                continue
            if not in_session:
                actions.append(f"{r['symbol']} 청산 대기({reason} — 장외)")
                continue
            try:
                ob = self.provider.get_orderbook(r["symbol"])
                price, method = ob.get("bestBid"), "BEST_BID"
                quote_ts = ob.get("timestamp")
                if price is None:
                    px2 = self.provider.get_prices([r["symbol"]]).get(r["symbol"])
                    if not px2:
                        raise pmd.MarketDataUnavailable("현재가 없음")
                    price, method = px2["price"], "LAST_PRICE_FALLBACK"
                    quote_ts = px2.get("timestamp")
            except pmd.MarketDataUnavailable:
                actions.append(f"{r['symbol']} 청산 보류(시세 불가 — 가격 추측 금지)")
                continue
            gross = (price - r["entry_price"]) / r["entry_price"] * 100
            idx_hist = load_index_history()
            bench_exit, bench_exit_day = index_value_on_or_before(
                idx_hist, r.get("market") or "KOSPI", today_date)
            bench_ret = None
            if bench_exit and r.get("benchmark_entry_value"):
                bench_ret = (bench_exit - r["benchmark_entry_value"]) / r["benchmark_entry_value"] * 100
            meta = self.state["openMeta"].get(r["trade_id"], {})
            closed = {**r, "status": "CLOSED",
                      "exit_at": iso(now), "exit_price": price,
                      "exit_method": method, "exit_quote_at": quote_ts,
                      "exit_reason": reason, "exit_business_date": today_date,
                      "holding_trading_days": holding_days,
                      "gross_return_pct": round(gross, 3),
                      # 비용 미검증 → 순수익 과장 금지(COST_MODEL_INCOMPLETE)
                      "estimated_net_return_pct": None,
                      "cost_model": "COST_MODEL_INCOMPLETE",
                      "mfe_pct": round((meta.get("mfePrice", price) - r["entry_price"])
                                       / r["entry_price"] * 100, 3),
                      "mae_pct": round((meta.get("maePrice", price) - r["entry_price"])
                                       / r["entry_price"] * 100, 3),
                      "benchmark_exit_value": bench_exit,
                      "benchmark_exit_day": bench_exit_day,
                      "benchmark_return_pct": round(bench_ret, 3) if bench_ret is not None else None,
                      "relative_return_pct": round(gross - bench_ret, 3) if bench_ret is not None else None,
                      "recorded_at": iso(now)}
            self.ledger.append(closed)
            self.state["openMeta"].pop(r["trade_id"], None)
            latest[r["trade_id"]] = closed
            actions.append(f"{r['symbol']} 청산 @{price:,.0f} {gross:+.1f}% ({reason})")

    # ── 산출물 ──
    def _write_equity(self, now, latest):
        latest = self.ledger.latest_by_id()
        open_rows = [r for r in latest.values() if r.get("status") == "OPEN"]
        cash = derive_cash(self.config, latest)
        # 포지션은 매수원가 기준으로 기록(보수적 — 미실현 평가익을 자산에 미리 반영하지 않음)
        pos_value = sum(r["quantity"] * r["entry_price"] for r in open_rows)
        row = {"at": iso(now), "cash": round(cash), "positionsCost": round(pos_value),
               "openCount": len(open_rows)}
        with open(os.path.join(self.dir, "equity_curve.jsonl"), "a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    def _write_summary(self):
        latest = self.ledger.latest_by_id()
        rows = list(latest.values())
        closed = [r for r in rows if r.get("status") == "CLOSED"]
        opens = [r for r in rows if r.get("status") == "OPEN"]
        skipped = [r for r in rows if str(r.get("status", "")).startswith("SKIPPED")]
        rets = [r["gross_return_pct"] for r in closed if r.get("gross_return_pct") is not None]
        wins = [x for x in rets if x > 0]
        losses = [x for x in rets if x < 0]
        rel = [r["relative_return_pct"] for r in closed if r.get("relative_return_pct") is not None]

        def _avg(v):
            return round(sum(v) / len(v), 3) if v else None

        def _median(v):
            if not v:
                return None
            v = sorted(v)
            n = len(v)
            return round(v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2, 3)
        summary = {
            "schemaVersion": "gaeo_paper_summary_v1",
            "strategyVersion": self.state["strategyVersion"],
            "environment": self.environment,
            "forwardStart": "2026-08-18",
            "engineStartedAt": self.state.get("engineStartedAt"),
            "generatedAt": iso(now_kst()),
            "evidence": ("INSUFFICIENT_EVIDENCE — 표본이 적어 성과 결론 금지"
                         if len(closed) < 20 else "SAMPLE_OK"),
            "totalForwardSignals": len(rows),
            "openTrades": len(opens),
            "maturedTrades": len(closed),
            "skippedSignals": len(skipped),
            "winRatePct": round(len(wins) / len(rets) * 100, 1) if rets else None,
            "avgReturnPct": _avg(rets), "medianReturnPct": _median(rets),
            "avgWinPct": _avg(wins), "avgLossPct": _avg(losses),
            "winLossRatio": (round(abs(_avg(wins) / _avg(losses)), 2)
                             if wins and losses and _avg(losses) else None),
            "expectancyPct": _avg(rets),
            "profitFactor": (round(sum(wins) / abs(sum(losses)), 2)
                             if wins and losses and sum(losses) else None),
            "grossReturnPct": round(sum(rets), 3) if rets else None,
            "estimatedNetReturnPct": None,
            "costModel": "COST_MODEL_INCOMPLETE — 수수료·세금 미검증(0으로 가정하지 않음)",
            "avgBenchmarkReturnPct": _avg([r["benchmark_return_pct"] for r in closed
                                           if r.get("benchmark_return_pct") is not None]),
            "avgRelativeReturnPct": _avg(rel),
            "avgHoldingTradingDays": _avg([r.get("holding_trading_days") for r in closed
                                           if r.get("holding_trading_days") is not None]),
            "avgMfePct": _avg([r.get("mfe_pct") for r in closed if r.get("mfe_pct") is not None]),
            "avgMaePct": _avg([r.get("mae_pct") for r in closed if r.get("mae_pct") is not None]),
            "note": ("가상자금 기록 전용 — 실제 계좌·주문 없음. "
                     "Production 모델을 그대로 검증하며 결과로 모델을 자동 수정하지 않는다."),
        }
        atomic_write(os.path.join(self.dir, "summary.json"),
                     json.dumps(summary, ensure_ascii=False, indent=1))

    # ── 마무리 ──
    def _in_session(self, now, session):
        try:
            start = datetime.fromisoformat(session.get("startTime"))
            end = datetime.fromisoformat(session.get("endTime"))
            return start <= now <= end
        except (TypeError, ValueError):
            return False        # 세션 정보 없으면 개장으로 추측하지 않는다

    def _done(self, result, now):
        self.state["lastCycleAt"] = iso(now)
        self.state["lastCycleResult"] = result
        self._save_state()
        return result


def run_safe():
    """러너 진입점 — 어떤 실패도 Production을 멈추지 않는다(항상 exit 0)."""
    try:
        provider = pmd.TossMarketDataProvider()
        engine = PaperEngine(provider)
        print("[paper]", engine.run_cycle())
    except Exception as e:      # noqa: BLE001 — advisory 원칙
        print(f"[paper] 실패(Production 무영향): {type(e).__name__}: {str(e)[:160]}")
    return 0


if __name__ == "__main__":
    sys.exit(run_safe())
