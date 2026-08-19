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

# 성과 결론(승률·평균수익률 등)을 숫자로 내보내려면 최소한 이만큼의 청산 표본이 있어야 한다.
MIN_CLOSED_FOR_EVIDENCE = 20
# 표본이 그보다 적으면 아래 필드는 계산해 두고도 전부 null로 내보낸다.
# (evidence 라벨만 INSUFFICIENT로 두고 숫자는 그대로 두면, 화면·외부 사용처가
#  그 숫자만 집어다 "승률 100%" 같은 결론으로 쓰는 사고가 난다.)
# ⚠️ 청산 표본에서 파생된 "성과 결론"은 전부 넣는다. 일부만 막으면 구멍이 생긴다.
#    예: avgWinPct·avgLossPct를 막아놓고 그 비율인 winLossRatio를 숫자로 내보내면
#    소비자는 결국 같은 결론을 얻는다. 반대로 순수 서술 지표(보유일수·건수)는
#    성과 주장이 아니므로 막지 않는다.
EVIDENCE_GATED_FIELDS = ("winRatePct", "avgReturnPct", "medianReturnPct",
                         "avgWinPct", "avgLossPct", "profitFactor", "expectancyPct",
                         "winLossRatio", "sumTradeReturnsPct", "grossReturnPct",
                         "avgBenchmarkReturnPct", "avgRelativeReturnPct",
                         "avgMfePct", "avgMaePct")


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


def portfolio_valuation(config, latest, open_meta):
    """Mark-to-Market 포트폴리오 평가 (회계 전용 — 매매 행동에 영향 0).

    currentVirtualEquity = 현금 + Σ(미청산 수량 × 마지막 유효 Mark 가격)
    Mark가 한 번도 없는 미청산 포지션이 있으면 평가금·수익률을 만들지 않는다
    (null 유지 — 가격 추측·Entry가로의 몰래 Reset 금지).
    """
    initial = config["initial_cash_krw"]
    cash = derive_cash(config, latest)
    opens = [r for r in latest.values() if r.get("status") == "OPEN"]
    closed = [r for r in latest.values() if r.get("status") == "CLOSED"]
    realized = sum((r["exit_price"] - r["entry_price"]) * r["quantity"] for r in closed)
    # 현재 투자원금 — 미청산 포지션에 실제로 들어가 있는 가상 원금(Σ 체결가 × 수량).
    # 누적 체결금액이 아니라 "지금 들어가 있는 돈"이다. 시세(Mark)와 무관하므로
    # 평가 불가 상태에서도 항상 계산된다. 표시 전용 — 매매 판단에 쓰지 않는다.
    invested = sum(r["entry_price"] * r["quantity"] for r in opens)

    marked_value = 0.0
    unrealized = 0.0
    mark_times = []          # 러너가 실제 관측한 시각
    market_times = []        # 거래소/공급자 원본 시각(제공된 경우만 — now로 위조 금지)
    unmarked = 0
    for r in opens:
        meta = (open_meta or {}).get(r["trade_id"]) or {}
        mark = meta.get("lastMarkPrice")
        if mark is None:
            unmarked += 1
            continue
        marked_value += mark * r["quantity"]
        unrealized += (mark - r["entry_price"]) * r["quantity"]
        if meta.get("lastMarkObservedAt"):
            mark_times.append(meta["lastMarkObservedAt"])
        if meta.get("lastMarkMarketAt"):
            market_times.append(meta["lastMarkMarketAt"])

    if not opens:
        status = "NO_OPEN_POSITIONS"
        equity = cash
        unrealized_out = 0.0
    elif unmarked:
        status = "VALUATION_UNAVAILABLE"   # 유효 Mark 없는 포지션 존재 — 0으로 만들지 않는다
        equity = None
        unrealized_out = None
    else:
        status = "MARKED"                  # 마지막 관측 기준 (관측 실패 시 이전 Mark 유지)
        equity = cash + marked_value
        unrealized_out = unrealized
    return {
        "initialVirtualCash": initial,
        "cash": round(cash, 2),
        "investedCostBasis": round(invested, 2),
        "markedPositionsValue": round(marked_value, 2) if equity is not None else None,
        "currentVirtualEquity": round(equity, 2) if equity is not None else None,
        "realizedPnl": round(realized, 2),
        "unrealizedPnl": round(unrealized_out, 2) if unrealized_out is not None else None,
        "portfolioReturnPct": (round((equity / initial - 1) * 100, 3)
                               if equity is not None and initial else None),
        # FIX 5: Observed(러너 관측)와 Market(거래소 원본) 시각을 분리해 보고
        "valuationObservedAt": min(mark_times) if mark_times else None,   # 가장 오래된 관측(보수적)
        "valuationMarketAt": min(market_times) if market_times else None,
        "valuationStatus": status,
        "openCount": len(opens),
        # FIX 3: SKIP을 제외한 실제 가상체결 수 — 성과 지표 표시 근거
        "executedTradeCount": len(opens) + len(closed),
    }


# 가상체결 0건일 때 성과 지표로 쓰지 않는 키 — "거래 없음"이 0% 성과처럼 보이지 않게 한다.
ZERO_TRADE_NULLED = ("portfolioReturnPct", "realizedPnl", "unrealizedPnl")


def reporting_view(val):
    """보고(summary·공개 스냅샷)용 사본 — 가상체결 0건이면 성과 지표를 만들지 않는다.

    ⚠️ 원본 val은 절대 바꾸지 않는다. Equity Curve는 원본을 그대로 써야 하고
       (MDD 계산 입력), 이 게이트는 '표시할 때의 정책'일 뿐이다.
    ⚠️ 요약과 공개 스냅샷이 같은 정책을 쓰도록 구현을 여기 한 곳에만 둔다.
    """
    if val.get("executedTradeCount"):
        return dict(val)
    return {**val, **{k: None for k in ZERO_TRADE_NULLED}}


def max_drawdown_from_curve(path, initial_seed=None):
    """MDD — Mark-to-Market Portfolio Equity Curve 기준 (개별 Trade 수익 아님).

    FIX 2 (2026-08-16 하드닝): initial_seed(시작자금)를 최초 Peak로 삼는다 —
    Curve 파일이 손상돼 첫 행(10,000,000)이 없어도 '첫 관측부터의 손실'을
    놓치지 않는다(9.5M·9.6M만 있어도 seed 10M 기준 -5.0%).
    유효한 markedEquity 관측이 하나도 없으면 None (성과 0%로 오인 금지).
    """
    equities = []
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                eq = row.get("markedEquity")
                if isinstance(eq, (int, float)):
                    equities.append(float(eq))
    except OSError:
        return None
    if not equities:
        return None
    if initial_seed is None and len(equities) < 2:
        return None                      # seed 없이 관측 1개면 판단 불가(기존 동작 유지)
    peak = float(initial_seed) if initial_seed is not None else equities[0]
    mdd = 0.0
    for eq in equities:
        peak = max(peak, eq)
        if peak > 0:
            mdd = min(mdd, (eq / peak - 1) * 100)
    return round(mdd, 3)


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

    # ── 놓친 거래일 보충 ──
    MAX_BACKFILL_DAYS = 15          # API 폭주 방지 상한(3주치면 충분)

    def _backfill_missed_business_days(self, today_date):
        """오늘 이전에 기록이 빠진 거래일을 공식 캘린더로만 되짚어 채운다.

        추측 금지 원칙: 요일·공휴일을 자체 계산하지 않고, 캘린더 API가 준
        previousBusinessDay를 따라 뒤로 걸으며 "open이라고 답한 날"만 넣는다.
        이미 기록된 가장 최근 거래일에 도달하면 멈춘다. 실패하면 조용히 포기한다
        (보충은 부가 기능이라, 여기서 예외를 던져 사이클 전체를 죽이지 않는다).
        """
        known = set(self.state.get("businessDates") or [])
        prior = sorted(d for d in known if d < today_date)
        floor = prior[-1] if prior else None
        if floor is None:
            return 0                # 기준점이 없으면 어디까지 거슬러야 할지 알 수 없다
        added, cursor = [], today_date
        for _ in range(self.MAX_BACKFILL_DAYS):
            try:
                cal = self.provider.get_market_calendar_kr(date=cursor)
            except pmd.MarketDataUnavailable:
                break               # 보충 실패는 사이클을 막지 않는다
            prev = cal.get("previousBusinessDay") or {}
            pdate = prev.get("date")
            if not pdate or pdate <= floor:
                break               # 이미 아는 구간에 닿았다
            if prev.get("open") and pdate not in known:
                known.add(pdate)
                added.append(pdate)
            cursor = pdate
        if added:
            self.state["businessDates"] = sorted(known)[-400:]
            self.state["backfilledBusinessDates"] = sorted(
                set(self.state.get("backfilledBusinessDates") or []) | set(added))[-400:]
        return len(added)

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

        # 🐛 2026-08-18 수정: 정규장인데 '장외'로 오판하던 버그.
        #    공식 응답은 today.integrated = {preMarket, regularMarket, afterMarket} 구조라
        #    startTime/endTime은 integrated 최상위가 아니라 regularMarket 안에 있다.
        #    integrated를 그대로 넘기면 startTime=None → 파싱 실패 → 항상 '장외'가 되어
        #    정규장에도 신규 진입이 영구 보류됐다(09:35·10:05·10:35 실측).
        #    ⚠️ Paper V1은 국내 정규장만 쓴다 — NXT 프리마켓·애프터마켓은 쓰지 않는다.
        integrated = today.get("integrated") or {}
        session = (integrated.get("regularMarket") if isinstance(integrated, dict) else None) or {}
        # 세션 시각을 못 읽으면 개장으로 추측하지 않는다(fail closed). 다만 조용히
        # '장외'로 넘어가면 계약이 또 바뀌었을 때 알아채지 못하므로 사유를 구분해 남긴다.
        self._session_known = bool(session)
        in_session = self._in_session(now, session)

        # 거래일 기록(보유일 계산의 근거 — 캘린더가 open이라고 한 날만)
        if today_date not in self.state["businessDates"]:
            self.state["businessDates"].append(today_date)
            self.state["businessDates"] = sorted(self.state["businessDates"])[-400:]

        # 🐛 2026-08-19 추가: 러너가 며칠 죽어 있으면 그 사이 거래일이 businessDates에서
        #    통째로 빠지고, 보유일이 실제보다 적게 세어져 MAX_HOLDING 청산이 밀린다.
        #    (2026-08-19 실제 사고: 자격증명 유실로 12사이클 연속 실패 → 그날이 미기록)
        #    ⚠️ 날짜를 추측해서 채우지 않는다. 공식 캘린더가 open이라고 답한 날만 넣는다.
        self._backfill_missed_business_days(today_date)

        bundle = signals_bundle or load_production_signals()
        signals = bundle["signals"]
        analysis_at = bundle.get("analysisCompletedAt")

        # ② 최초 실행 = Baseline 캡처만 (기존 BUY를 소급 매수하지 않는다 — Backfill 금지)
        if not self.state["baselineCaptured"]:
            self.state["engineStartedAt"] = iso(now)
            self.state["lastCall"] = {c: s["call"] for c, s in signals.items()}
            self.state["lastProcessedAnalysisAt"] = analysis_at
            self.state["baselineCaptured"] = True
            self.state["lastProcessedModelVersion"] = bundle.get("modelVersion")
            # FIX 1 (2026-08-16 하드닝): 거래는 0이지만 회계 기준점(초기 1,000만원)은
            # 반드시 기록한다 — Equity Curve 최초 행 + Baseline Summary.
            # Entry 경로(_process_entries)는 호출하지 않으므로 소급 매수 0.
            self._write_equity(now, None)
            self._write_summary()
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
                self.state["lastProcessedModelVersion"] = bundle.get("modelVersion")

        # ④ 보유 관리: MFE/MAE 관측 → SELL 전환/5거래일 청산
        self._manage_positions(signals, now, today_date, in_session, latest, actions)

        self._write_equity(now, latest)
        self._write_summary()
        msg = "; ".join(actions) if actions else "NO_ACTION"
        return self._done(f"CYCLE_OK — {msg}", now)

    # ── 진입 ──
    def _process_entries(self, signals, analysis_at, now, in_session, latest, actions):
        if not in_session:
            actions.append("장외 시간 — 신규 진입 보류(다음 개장 사이클에 처리)"
                           if getattr(self, "_session_known", True) else
                           "정규장 시간 정보 없음 — 신규 진입 보류(캘린더 응답 확인 필요)")
            return "DEFERRED"
        prev = self.state["lastCall"]
        candidates = [c for c, s in signals.items()
                      if s["call"] == "BUY" and prev.get(c) != "BUY"]
        # Production 기존 순위 규칙 그대로: 판단 확신도(confidence) → 종합점수 → 코드 (새 랭킹 발명 금지)
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
            self.state["openMeta"][tid] = {
                "mfePrice": price, "maePrice": price, "entryBusinessDate": entry_day,
                # FIX 4: 실측 체결가(Best Ask/현재가)를 최초 Mark로 — 직후 시세 조회가
                # 실패해도 평가 가능. 매매 판단(청산·MFE Rule)에는 쓰지 않는다.
                "lastMarkPrice": price,
                "lastMarkObservedAt": iso(now),
                "lastMarkMarketAt": quote_ts,     # 공급자 원본 시각(없으면 None 유지)
                "lastMarkSource": f"{self.provider.name}/{method}"}
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
                # 📊 평가용 Mark (표시·MDD 전용 — 매매 판단에 사용하지 않음).
                #    이번 관측이 실패하면 이전 valid mark를 그대로 유지한다(추측 금지).
                #    Observed(러너 관측)와 Market(공급자 원본) 시각을 절대 섞지 않는다 —
                #    공급자 timestamp가 없으면 Market은 None(now로 위조 금지).
                new_market_ts = px.get("timestamp")
                prev_market_ts = meta.get("lastMarkMarketAt")
                if new_market_ts and prev_market_ts and new_market_ts < prev_market_ts:
                    # Timestamp 역행 — 관측 순서 기준으로 최신값을 쓰되 사실만 기록
                    meta["marketTsRegressionCount"] = meta.get("marketTsRegressionCount", 0) + 1
                meta["lastMarkPrice"] = px["price"]
                meta["lastMarkObservedAt"] = iso(now)
                meta["lastMarkMarketAt"] = new_market_ts
                meta["lastMarkSource"] = f"{self.provider.name}/PRICES"

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
        # 원가 기준(기존 필드 유지) + Mark-to-Market 평가(신규 필드) 병기.
        # 과거 행은 절대 수정하지 않는다 — 이후 행부터 확장 필드가 붙는다.
        pos_value = sum(r["quantity"] * r["entry_price"] for r in open_rows)
        val = portfolio_valuation(self.config, latest, self.state.get("openMeta"))
        # 📒 종목별 평가 기록 — 날짜별 기록의 "어떤 종목이 손익을 이끌었나"를
        #    나중에 그날 값 그대로 재현하려면 이 시점의 mark를 남겨 둬야 한다.
        #    ⚠️ 표시·분석 전용이다. 진입·청산·보유기간 판단에는 쓰이지 않는다.
        meta_all = self.state.get("openMeta") or {}
        positions = {}
        for r in open_rows:
            mk = (meta_all.get(r["trade_id"]) or {}).get("lastMarkPrice")
            if isinstance(mk, (int, float)) and mk > 0:
                positions[r["symbol"]] = {"name": r.get("name"), "qty": r["quantity"],
                                          "entry": r["entry_price"], "mark": mk}
        row = {"at": iso(now), "cash": round(cash), "positionsCost": round(pos_value),
               "openCount": len(open_rows), "positions": positions,
               "markedPositionsValue": val["markedPositionsValue"],
               "markedEquity": val["currentVirtualEquity"],
               "realizedPnl": val["realizedPnl"],
               "unrealizedPnl": val["unrealizedPnl"],
               "valuationObservedAt": val["valuationObservedAt"],
               "valuationMarketAt": val["valuationMarketAt"],
               "valuationStatus": val["valuationStatus"]}
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
                         if len(closed) < MIN_CLOSED_FOR_EVIDENCE else "SAMPLE_OK"),
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
            # ⚠️ 개별 Trade 수익률의 단순 합 — 계좌(포트폴리오) 수익률이 아니다.
            #    화면에는 절대 '누적 가상수익률'로 쓰지 않는다(그 값은 portfolioReturnPct).
            "sumTradeReturnsPct": round(sum(rets), 3) if rets else None,
            "grossReturnPct": round(sum(rets), 3) if rets else None,   # legacy alias(내부)
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
        # 🔒 표본 게이트 — 청산 표본이 최소치 미만이면 성과 결론 필드를 숫자로 내보내지 않는다.
        # evidence 라벨은 이미 INSUFFICIENT를 달고 있었지만 숫자 자체는 살아 있어서,
        # 라벨을 안 보는 소비자(공개 스냅샷·외부 스크립트)가 "청산 2건짜리 승률 50%"를
        # 그대로 성과처럼 쓸 수 있었다. 표본이 차기 전에는 필드 자체가 null이어야 한다.
        if len(closed) < MIN_CLOSED_FOR_EVIDENCE:
            for _k in EVIDENCE_GATED_FIELDS:
                summary[_k] = None
        # 📊 Mark-to-Market 회계 (표시·MDD 전용 — 매매 행동에 영향 0)
        # FIX 3: 실제 가상체결이 0건이면 성과 지표를 만들지 않는다 —
        # '거래 없음'을 0% 성과처럼 보이게 하지 않는다(평가금 1,000만원 표시는 유지).
        # 게이트 구현은 reporting_view() 한 곳에만 둔다(공개 스냅샷도 같은 함수를 쓴다).
        val = reporting_view(
            portfolio_valuation(self.config, latest, self.state.get("openMeta")))
        summary.update({k: val[k] for k in (
            "initialVirtualCash", "cash", "investedCostBasis", "markedPositionsValue",
            "currentVirtualEquity", "realizedPnl",
            "unrealizedPnl", "portfolioReturnPct",
            "valuationObservedAt", "valuationMarketAt", "valuationStatus",
            "executedTradeCount")})
        summary["maxDrawdownPct"] = max_drawdown_from_curve(
            os.path.join(self.dir, "equity_curve.jsonl"),
            initial_seed=self.config["initial_cash_krw"])
        if val["executedTradeCount"] == 0:
            summary["maxDrawdownPct"] = None
        # FIX 9: Reporting 전용 Provenance — 어떤 분석·코드 기준으로 처리했는지 추적
        summary["sourceAnalysisCompletedAt"] = self.state.get("lastProcessedAnalysisAt")
        summary["sourceModelVersion"] = self.state.get("lastProcessedModelVersion")
        summary["sourceCommitSha"] = os.environ.get("GITHUB_SHA")
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
