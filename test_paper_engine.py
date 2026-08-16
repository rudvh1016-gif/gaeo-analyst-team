#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Trading V1 테스트 — PHASE 35의 15개 시나리오 + 안전 계약.

전부 offline fixture(FixtureMarketDataProvider·임시 폴더·environment=TEST).
실제 네트워크·실제 Forward 기록(LIVE_PAPER)에 절대 손대지 않는다.
"""
import io
import json
import os
import shutil
import sys
import tempfile
from contextlib import redirect_stdout
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd

KST = timezone(timedelta(hours=9))
FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at}


def calendar_open(day):
    ses = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    return {"today": {"date": day, "open": True, "integrated": ses},
            "previousBusinessDay": None, "nextBusinessDay": None}


def calendar_closed(day):
    return {"today": {"date": day, "open": False, "integrated": None},
            "previousBusinessDay": None, "nextBusinessDay": None}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def make_engine(tmp, provider):
    cfg = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
           "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}
    return pe.PaperEngine(provider, data_dir=tmp, config=cfg, environment="TEST")


def provider_for(day, ask=10_000, bid=9_990, closed=False, fail=False):
    return pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": (ask + bid) / 2, "timestamp": f"{day}T10:00:00+09:00"}},
        orderbooks={"005930": {"bestAsk": ask, "bestBid": bid,
                               "timestamp": f"{day}T10:00:00+09:00"}},
        calendar=calendar_closed(day) if closed else calendar_open(day),
        fail=fail)


D1, D2, D3 = "2026-08-18", "2026-08-19", "2026-08-20"


def fresh(tmp, day=D1, **kw):
    """baseline까지 끝난 엔진 준비(모든 종목 HOLD 기준 상태)."""
    eng = make_engine(tmp, provider_for(day, **kw))
    eng.run_cycle(bundle({"005930": "HOLD"}, f"{day}T09:05:00+09:00"), now=t(day, 9, 10))
    return eng


# ── 0. 시작 전·Baseline·Backfill 금지 ──────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = make_engine(tmp, provider_for(D1))
r = eng.run_cycle(bundle({"005930": "BUY"}, "2026-08-14T07:05:00+09:00"),
                  now=datetime(2026, 8, 15, 10, 0, tzinfo=KST))
check("0a. Forward 시작일 이전 → 거래 없음", "ENGINE_NOT_STARTED" in r
      and not os.path.exists(os.path.join(tmp, "trades.jsonl")))
r = eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
check("0b. 최초 실행은 Baseline만(기존 BUY 소급 매수 금지 — Backfill 0)",
      "BASELINE_CAPTURED" in r and not os.path.exists(os.path.join(tmp, "trades.jsonl")))
shutil.rmtree(tmp)

# ── 1. 새 BUY 전환 → 1회 진입 ───────────────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = fresh(tmp)
r = eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
rows = list(eng.ledger.latest_by_id().values())
check("1. BUY 전환 → Entry 1건 · Best Ask 체결",
      len(rows) == 1 and rows[0]["status"] == "OPEN"
      and rows[0]["entry_price"] == 10_000 and rows[0]["entry_method"] == "BEST_ASK",
      str(rows)[:120])
check("1b. 수량 = 포지션금액//가격", rows[0]["quantity"] == 100)

# ── 2. 같은 Signal 재처리 → 중복 진입 0 ─────────────────────────────────────
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 40))
eng2 = make_engine(tmp, provider_for(D1))   # 재기동 후 같은 배치 재주입
eng2.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 11, 10))
check("2. 같은 Episode 재처리·재기동 → 중복 Entry 0",
      len([x for x in eng2.ledger.rows if x.get("status") == "OPEN"]) == 1)

# ── 12. 동일 사이클 재실행 → 상태 동일 (Idempotency) ────────────────────────
cash_before = pe.derive_cash(eng2.config, eng2.ledger.latest_by_id())
eng2.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 11, 40))
check("12. 동일 사이클 재실행 → 현금·기록 동일",
      pe.derive_cash(eng2.config, eng2.ledger.latest_by_id()) == cash_before)

# ── 6·7. SELL 전환(매도/비중축소 계열) → 조기 청산 · HOLD는 청산 아님 ───────
eng2.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T13:05:00+09:00"), now=t(D1, 13, 10))
check("7b. HOLD(보유·관망)는 청산 신호 아님",
      eng2.ledger.latest_by_id()[list(eng2.ledger.latest_by_id())[0]]["status"] == "OPEN")
eng2.run_cycle(bundle({"005930": "SELL"}, f"{D1}T14:05:00+09:00"), now=t(D1, 14, 10))
closed = [x for x in eng2.ledger.latest_by_id().values() if x["status"] == "CLOSED"]
check("6·7. SELL 전환 → 조기 청산(CHIEF_SELL) · Best Bid 체결",
      len(closed) == 1 and closed[0]["exit_reason"] == "CHIEF_SELL"
      and closed[0]["exit_price"] == 9_990 and closed[0]["exit_method"] == "BEST_BID")
check("14b. MFE/MAE 기록됨", closed[0].get("mfe_pct") is not None
      and closed[0].get("mae_pct") is not None)
check("15b. gross/net 분리 — 비용 미검증이라 net은 null(과장 금지)",
      closed[0]["gross_return_pct"] is not None
      and closed[0]["estimated_net_return_pct"] is None
      and closed[0]["cost_model"] == "COST_MODEL_INCOMPLETE")
shutil.rmtree(tmp)

# ── 3. 시세 실패 → 거래 미생성 ──────────────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = fresh(tmp)
eng.provider = provider_for(D1, fail=True)
eng.provider.calendar = calendar_open(D1)
eng.provider.fail = False   # 캘린더는 성공, 시세만 실패시키기 위해 분리 구성
orig_ob = eng.provider.get_orderbook
eng.provider.orderbooks = {}
orig_prices = eng.provider.prices
eng.provider.prices = {}
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
rows = list(eng.ledger.latest_by_id().values())
check("3. Toss 시세 실패 → 가상체결 없음(SKIPPED_MARKET_DATA_UNAVAILABLE)",
      len(rows) == 1 and rows[0]["status"] == "SKIPPED_MARKET_DATA_UNAVAILABLE")
shutil.rmtree(tmp)

# ── 4. Credential 없음 → Paper만 BLOCKED · exit 0 ──────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
for k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
    os.environ.pop(k, None)
eng = make_engine(tmp, pmd.TossMarketDataProvider())
r = eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
check("4. Secret 없음 → TOSS_MARKET_DATA_UNAVAILABLE, 거래 0, 예외 없음",
      "TOSS_MARKET_DATA_UNAVAILABLE" in r
      and not os.path.exists(os.path.join(tmp, "trades.jsonl")))
shutil.rmtree(tmp)

# ── 5·8·9. 거래일 계산: 주말·휴장 미산입, 5거래일 도달 청산 ────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = fresh(tmp)
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
days = ["2026-08-19", "2026-08-20", "2026-08-21"]           # +3 거래일
for d in days:
    eng.provider = provider_for(d)
    eng.run_cycle(bundle({"005930": "HOLD"}, f"{d}T10:05:00+09:00"), now=t(d, 10, 10))
# 주말(8/22 토) + 임시휴장(8/24 월 가정) — open=False
for d in ["2026-08-22", "2026-08-24"]:
    eng.provider = provider_for(d, closed=True)
    r = eng.run_cycle(bundle({"005930": "HOLD"}, f"{d}T10:05:00+09:00"), now=t(d, 10, 10))
    check(f"8·9. {d} 휴장 → HOLIDAY(보유일 미산입·거래 없음)", "HOLIDAY" in r)
still_open = [x for x in eng.ledger.latest_by_id().values() if x["status"] == "OPEN"]
check("8b. 휴장 이틀 지나도 청산 안 됨(4거래일째)", len(still_open) == 1)
# 4번째(8/25)에는 청산 없음 → 5번째 거래일(8/26)에 MAX_HOLDING_5D 청산
eng.provider = provider_for("2026-08-25")
eng.run_cycle(bundle({"005930": "HOLD"}, "2026-08-25T10:05:00+09:00"), now=t("2026-08-25", 10, 10))
check("5a. 4거래일째는 아직 보유", [x for x in eng.ledger.latest_by_id().values()
                                   if x["status"] == "OPEN"])
eng.provider = provider_for("2026-08-26", ask=10_500, bid=10_490)
eng.run_cycle(bundle({"005930": "HOLD"}, "2026-08-26T10:05:00+09:00"), now=t("2026-08-26", 10, 10))
closed = [x for x in eng.ledger.latest_by_id().values() if x["status"] == "CLOSED"]
check("5. 5번째 거래일 도달 → MAX_HOLDING_5D 청산 · 보유일=5",
      len(closed) == 1 and closed[0]["exit_reason"] == "MAX_HOLDING_5D"
      and closed[0]["holding_trading_days"] == 5, str(closed)[:150])

# ── 25. NO LOOKAHEAD — 체결·조회 시각이 탐지 이후인지 전수 검증 ────────────
def validate_no_lookahead(rows):
    bad = []
    for r in rows:
        det = r.get("detected_at")
        for f in ("market_data_fetched_at", "simulated_fill_at"):
            if r.get(f) and det and r[f] < det:
                bad.append((r["trade_id"], f))
        if r.get("signal_at") and det and det < r["signal_at"]:
            bad.append((r["trade_id"], "detected<signal"))
        if r.get("exit_at") and r.get("recorded_at") and r["exit_at"] > r["recorded_at"]:
            bad.append((r["trade_id"], "exit>recorded"))
    return bad


bad = validate_no_lookahead(eng.ledger.rows)
check("10a. 엔진 산출 기록 look-ahead 0", not bad, str(bad))
tampered = dict(eng.ledger.rows[-1])
tampered["simulated_fill_at"] = "2026-08-17T09:00:00+09:00"   # 탐지 이전 시각 조작
check("10b. 미래정보 조작 기록은 검증기가 잡아냄(FAIL 유도)",
      validate_no_lookahead([tampered]))
shutil.rmtree(tmp)

# ── 11. Entry 후 Crash → 상태 손상 없음 (Ledger가 Source of Truth) ─────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = fresh(tmp)
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
os.remove(os.path.join(tmp, "state.json"))                    # state 유실 = crash 시뮬레이션
eng3 = make_engine(tmp, provider_for(D2))
eng3.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D2, 10, 10))
latest = eng3.ledger.latest_by_id()
check("11. Crash 후 재기동 → Ledger에서 복원, 이중 매수·유령 현금 0",
      len([x for x in latest.values() if x["status"] == "OPEN"]) == 1
      and pe.derive_cash(eng3.config, latest) == 10_000_000 - 100 * 10_000)
shutil.rmtree(tmp)

# ── 장외 시간 진입 보류(다음 개장 사이클 처리) ──────────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
eng = fresh(tmp)
r = eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T16:40:00+09:00"), now=t(D1, 16, 50))
check("B1. 장외 탐지 → 진입 보류(가짜 체결 없음)", "보류" in r
      and not [x for x in eng.ledger.rows if x.get("status") == "OPEN"])
eng.provider = provider_for(D2)
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T16:40:00+09:00"), now=t(D2, 9, 30))
opened = [x for x in eng.ledger.latest_by_id().values() if x["status"] == "OPEN"]
check("B2. 다음 개장 사이클에 실측가로 진입", len(opened) == 1
      and opened[0]["simulated_fill_at"] > f"{D1}T16:50:00")
shutil.rmtree(tmp)

# ── 13. Secret 로그 유출 0 ──────────────────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
os.environ[pmd.CLIENT_ID_ENV] = "c_TEST_FAKE_ID_12345"
os.environ[pmd.CLIENT_SECRET_ENV] = "SECRET_FAKE_VALUE_9999"
buf = io.StringIO()
with redirect_stdout(buf):
    eng = fresh(tmp)
    eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
out = buf.getvalue()
files = " ".join(open(os.path.join(tmp, f), encoding="utf-8").read()
                 for f in os.listdir(tmp) if os.path.isfile(os.path.join(tmp, f)))
check("13. Secret 값이 로그·산출물에 0회",
      "SECRET_FAKE_VALUE_9999" not in out + files
      and "c_TEST_FAKE_ID_12345" not in out + files)
for k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
    os.environ.pop(k, None)
shutil.rmtree(tmp)

# ── 14·15. 주문·조건주문·계좌 API 0 (Hard Block) ────────────────────────────
src = open("paper_market_data.py", encoding="utf-8").read() \
    + open("paper_engine.py", encoding="utf-8").read()
forbidden_paths = ['"/api/v1/orders"', '"conditional-order', '"/api/v1/holdings"',
                   '"/api/v1/accounts"', '"/api/v1/buying-power"', '"/api/v1/sellable-quantity"']
check("14. 주문·계좌 endpoint 리터럴 0", not any(p in src for p in forbidden_paths))
forbidden_fns = ["place_order", "buy_stock", "sell_stock", "create_conditional_order",
                 "cancel_order", "modify_order"]
check("15. 실주문 함수 0", not any(f in src for f in forbidden_fns))
forbidden_exact = {"/api/v1/orders", "/api/v1/holdings", "/api/v1/accounts",
                   "/api/v1/buying-power", "/api/v1/sellable-quantity",
                   "/api/v1/commissions"}
check("14c. ALLOWED_PATHS ∩ 주문·계좌 경로 = 공집합",
      not (set(pmd.ALLOWED_PATHS) & forbidden_exact)
      and not any(p.rstrip("s").endswith("/order") for p in pmd.ALLOWED_PATHS))
try:
    pmd.TossMarketDataProvider()._guard("/api/v1/orders")
    check("14d. 금지 경로 호출 시 즉시 예외", False)
except pmd.PaperSafetyError:
    check("14d. 금지 경로 호출 시 즉시 예외", True)

# ── 34. TEST 기록이 Forward(LIVE_PAPER) 상태에 안 섞임 ─────────────────────
tmp = tempfile.mkdtemp(prefix="pp_")
led = pe.Ledger(os.path.join(tmp, "trades.jsonl"), "LIVE_PAPER")
led.append({"trade_id": "t1", "environment": "TEST", "status": "OPEN",
            "entry_price": 100, "quantity": 1})
check("34. environment=TEST 행은 LIVE_PAPER 상태 계산에서 제외",
      led.latest_by_id() == {})
shutil.rmtree(tmp)

# ── 워크플로 안전: 독립 실행 + Production 미간섭 선언 확인 ──────────────────
wf = open(".github/workflows/paper-trading.yml", encoding="utf-8").read()
check("29. 독립 워크플로 + paper_trading/ 만 커밋",
      "git add paper_trading" in wf and "analyze_auto" not in wf
      and "collect_analyst_data" not in wf)
ua = open(".github/workflows/update-analysis.yml", encoding="utf-8").read()
check("29b. Production 워크플로에 paper 엔진 미주입", "paper_engine" not in ua)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_engine: 전체 통과")
