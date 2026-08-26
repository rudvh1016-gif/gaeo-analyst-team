#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper V1 회계 수리 계약 — 지갑과 거래별 순수익이 같은 장부를 쓰는가.

무엇을 지키나
    ① 수수료(살 때·팔 때)와 증권거래세가 **가상현금에 실제로 반영**된다.
    ② 거래별 순수익(estimated_net_return_pct)과 계좌 손익이 같은 기준이다.
       (예전에는 net return만 비용을 반영하고 지갑은 무비용이라 32% 부풀려졌다)
    ③ 과거 원장(trades.jsonl)은 한 행도 바뀌지 않는다 — Backfill 금지.
    ④ 회계 기준 전환 경계(costAccountingFrom)가 1초 단위로 정확히 동작한다.
    ⑤ V1의 나머지 규칙(5거래일 청산·중복 진입 금지·Forward only)은 그대로다.

⚠️ 테스트 설계 원칙
    - 상수를 자기참조해서 계산하지 않는다. 수수료 0.015%·거래세 0.20%를 손으로
      계산한 **고정 대조군 숫자**를 함께 둔다. 상수를 바꾸면 이 파일이 깨져야 한다.
    - 환경변수·오늘 날짜에 의존하지 않는다(고정 날짜 픽스처만 쓴다).
"""
import hashlib
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd

KST = timezone(timedelta(hours=9))
HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


# ── 고정 대조군 (손으로 계산한 값 — 코드에서 유도하지 않는다) ──────────────────
# 100주 × 10,000원 = 1,000,000원 매수
#   매수수수료 0.015% = 150원          → 지갑에서 1,000,150원이 나간다
# 100주 × 11,000원 = 1,100,000원 매도
#   매도수수료 0.015% = 165원, 거래세 0.20% = 2,200원 → 1,097,635원이 들어온다
# 확정손익 = 1,097,635 - 1,000,150 = 97,485원 (무비용이면 100,000원)
ENTRY, EXIT_, QTY = 10_000, 11_000, 100
FIX_BUY_FEE = 150.0
FIX_SELL_FEE = 165.0
FIX_TAX = 2_200.0
FIX_OUTLAY = 1_000_150.0
FIX_PROCEEDS = 1_097_635.0
FIX_REALIZED = 97_485.0
FIX_GROSS_REALIZED = 100_000.0

CFG_NET = {"strategyVersion": "PAPER_SMART_TEST", "initial_cash_krw": 10_000_000,
           "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5,
           "accounting": {"version": "ACCOUNTING_V2_NET",
                          "legacyVersion": "ACCOUNTING_V1_GROSS",
                          "costAccountingFrom": "2026-08-27"}}
CFG_LEGACY_ONLY = {**CFG_NET, "accounting": {**CFG_NET["accounting"],
                                             "costAccountingFrom": "2099-01-01"}}


def row_net(status="CLOSED", **kw):
    r = {"trade_id": "t1", "environment": "TEST", "status": status, "symbol": "005930",
         "market": "KOSPI", "entry_price": ENTRY, "quantity": QTY,
         "accounting_version": pe.ACCOUNTING_V2_NET,
         "entry_business_date": "2026-09-01",
         "simulated_fill_at": "2026-09-01T10:10:00+09:00"}
    if status == "CLOSED":
        r["exit_price"] = EXIT_
    r.update(kw)
    return r


# ═══ A. 순수 함수 — 비용이 실제로 반영되는가 ═════════════════════════════════
check("A1. 매수수수료가 지갑에서 나간 돈에 반영된다(1,000,150원)",
      abs(pe.entry_cash_outlay(row_net("OPEN")) - FIX_OUTLAY) < 1e-6,
      str(pe.entry_cash_outlay(row_net("OPEN"))))
check("A1b. 매수수수료 자체가 150원", abs(pe.entry_commission_krw(row_net("OPEN")) - FIX_BUY_FEE) < 1e-6)
check("A2. 매도수수료+거래세가 들어온 돈에서 빠진다(1,097,635원)",
      abs(pe.exit_cash_proceeds(row_net()) - FIX_PROCEEDS) < 1e-6,
      str(pe.exit_cash_proceeds(row_net())))
check("A2b. 매도비용 = 수수료 165 + 거래세 2,200 = 2,365원",
      abs(pe.exit_cost_krw(row_net()) - (FIX_SELL_FEE + FIX_TAX)) < 1e-6,
      str(pe.exit_cost_krw(row_net())))
check("A3. 확정손익 = 97,485원(무비용 100,000원이 아니다)",
      abs(pe.realized_pnl_krw(row_net()) - FIX_REALIZED) < 1e-6,
      str(pe.realized_pnl_krw(row_net())))
# 코스닥도 거래세 0.20%라 같은 값이어야 한다(둘 중 하나만 반영되는 실수를 막는다)
check("A3b. 코스닥도 같은 거래세(0.20%)로 계산된다",
      abs(pe.realized_pnl_krw(row_net(market="KOSDAQ")) - FIX_REALIZED) < 1e-6)
# 옛 기준 거래는 예전 숫자 그대로 — 과거 기록의 의미를 바꾸지 않는다
legacy = {**row_net(), "accounting_version": pe.ACCOUNTING_V1_GROSS}
check("A4. 옛 기준(GROSS) 거래는 비용 0 · 확정손익 100,000원 그대로",
      pe.entry_commission_krw(legacy) == 0.0 and pe.exit_cost_krw(legacy) == 0.0
      and abs(pe.realized_pnl_krw(legacy) - FIX_GROSS_REALIZED) < 1e-6)
# 상수 대조군 — 요율을 바꾸면 이 테스트가 깨져야 한다(자기참조 금지)
check("A5. 엔진 요율이 실제 값과 같다(수수료 0.015% · 거래세 0.20%)",
      pe.COMMISSION_PCT == 0.015 and pe.SELL_TAX_DEFAULT_PCT == 0.20
      and pe.SELL_TAX_PCT["KOSPI"] == 0.20 and pe.SELL_TAX_PCT["KOSDAQ"] == 0.20)
# config.json이 엔진과 다른 말을 하면 안 된다(COST_MODEL_INCOMPLETE 방치 재발 방지)
_cfg_file = json.load(open(os.path.join(HERE, "paper_trading", "config.json"), encoding="utf-8"))
_cm = _cfg_file["costModel"]
check("A6. config.json 비용 모델이 엔진 실제 값과 일치",
      _cm["brokerFeePct"] == pe.COMMISSION_PCT
      and _cm["transactionTaxPct"]["KOSPI"] == pe.SELL_TAX_PCT["KOSPI"]
      and _cm["transactionTaxPct"]["KOSDAQ"] == pe.SELL_TAX_PCT["KOSDAQ"]
      and _cm["version"] == pe.COST_MODEL_VERSION
      and _cm["verifiedAt"] == pe.COST_MODEL_VERIFIED_AT,
      json.dumps(_cm, ensure_ascii=False)[:200])
check("A6b. config.json이 더 이상 'COST_MODEL_INCOMPLETE' 상태가 아니다",
      _cm["status"] != "COST_MODEL_INCOMPLETE" and _cm["brokerFeePct"] is not None)
check("A6c. 그 전 기간의 의미는 history에 남겼다(과거 기록 훼손 금지)",
      any(h.get("status") == "COST_MODEL_INCOMPLETE" for h in _cm.get("history") or []))
_acct = _cfg_file["accounting"]
check("A6d. config.json 회계 전환 설정이 엔진 기본값과 일치",
      _acct["version"] == pe.ACCOUNTING_V2_NET
      and _acct["legacyVersion"] == pe.ACCOUNTING_V1_GROSS
      and _acct["costAccountingFrom"] == pe.COST_ACCOUNTING_FROM == "2026-08-27")

# ═══ B. 전환 경계 ════════════════════════════════════════════════════════════
check("B1. 전환 1초 전 진입 → 옛 기준(GROSS)",
      pe.accounting_version_for({"simulated_fill_at": "2026-08-26T23:59:59+09:00"},
                                CFG_NET) == pe.ACCOUNTING_V1_GROSS)
check("B2. 전환 시각 정각 진입 → 새 기준(NET)",
      pe.accounting_version_for({"simulated_fill_at": "2026-08-27T00:00:00+09:00"},
                                CFG_NET) == pe.ACCOUNTING_V2_NET)
check("B2b. 전환 다음날 진입 → 새 기준(NET)",
      pe.accounting_version_for({"entry_business_date": "2026-08-28"}, CFG_NET)
      == pe.ACCOUNTING_V2_NET)
check("B3. 원장에 찍힌 기준이 설정보다 우선(설정을 미뤄도 이미 열린 거래는 안 바뀐다)",
      pe.accounting_version_for(row_net(), CFG_LEGACY_ONLY) == pe.ACCOUNTING_V2_NET)
check("B4. 진입 시각을 모르는 옛 행 → 기준을 바꾸지 않는다(GROSS 유지)",
      pe.accounting_version_for({"entry_price": 1, "quantity": 1}, CFG_NET)
      == pe.ACCOUNTING_V1_GROSS)
check("B5. 전환 시점이 없는 전략(costAccountingFrom=null) → 처음부터 NET",
      pe.accounting_version_for({"entry_business_date": "2020-01-01"},
                                {"accounting": {"version": "ACCOUNTING_V2_NET",
                                                "costAccountingFrom": None}})
      == pe.ACCOUNTING_V2_NET)
check("B6. 청산 행에서도 '진입' 시각으로 판정한다(청산 시각으로 뒤집히지 않는다)",
      pe.accounting_version_for({"entry_business_date": "2026-08-20",
                                 "detected_at": "2026-08-20T10:00:00+09:00",
                                 "recorded_at": "2026-09-10T10:00:00+09:00"}, CFG_NET)
      == pe.ACCOUNTING_V1_GROSS)

# ═══ C. 엔진 통합 — 실제 사이클에서 지갑이 비용을 반영하는가 ═════════════════
def cal(day, open_=True):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    ses = {"preMarket": None, "regularMarket": regular, "afterMarket": None}
    return {"today": {"date": day, "open": open_, "integrated": ses if open_ else None},
            "previousBusinessDay": None, "nextBusinessDay": None}


def provider(day, ask, bid, code="005930"):
    return pmd.FixtureMarketDataProvider(
        prices={code: {"price": (ask + bid) / 2, "timestamp": f"{day}T10:00:00+09:00"}},
        orderbooks={code: {"bestAsk": ask, "bestBid": bid,
                           "timestamp": f"{day}T10:00:00+09:00"}},
        calendar=cal(day))


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()}, "analysisCompletedAt": at}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


# 전환 이후 날짜로 돌린다(실제 운영에서 새로 생길 거래와 같은 조건)
N1, N2 = "2026-09-01", "2026-09-02"
tmp = tempfile.mkdtemp(prefix="pa2_")
eng = pe.PaperEngine(provider(N1, ENTRY, ENTRY - 10), data_dir=tmp, config=CFG_NET,
                     environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{N1}T09:05:00+09:00"), now=t(N1, 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{N1}T10:05:00+09:00"), now=t(N1, 10, 10))
opened = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "OPEN"]
check("C1. 새 거래에 회계 기준 스탬프가 찍힌다",
      len(opened) == 1 and opened[0].get("accounting_version") == pe.ACCOUNTING_V2_NET,
      str(opened)[:160])
check("C1b. 매수수수료를 원장에 사실로 남긴다(150원)",
      abs(opened[0].get("entry_commission_krw", -1) - FIX_BUY_FEE) < 1e-6,
      str(opened[0].get("entry_commission_krw")))
cash_after_buy = pe.derive_cash(CFG_NET, eng.ledger.latest_by_id())
check("C2. 매수 후 가상현금 = 10,000,000 - 1,000,150",
      abs(cash_after_buy - (10_000_000 - FIX_OUTLAY)) < 1e-6, str(cash_after_buy))

eng.provider = provider(N2, EXIT_ + 10, EXIT_)
eng.run_cycle(bundle({"005930": "SELL"}, f"{N2}T10:05:00+09:00"), now=t(N2, 10, 10))
closed = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "CLOSED"]
check("C3. CHIEF SELL로 청산(V1 규칙 유지)",
      len(closed) == 1 and closed[0]["exit_reason"] == "CHIEF_SELL")
check("C3b. 매도수수료 165원 · 거래세 2,200원을 원장에 남긴다",
      abs(closed[0].get("exit_commission_krw", -1) - FIX_SELL_FEE) < 1e-6
      and abs(closed[0].get("exit_tax_krw", -1) - FIX_TAX) < 1e-6,
      f'{closed[0].get("exit_commission_krw")} / {closed[0].get("exit_tax_krw")}')
cash_after_sell = pe.derive_cash(CFG_NET, eng.ledger.latest_by_id())
check("C4. 청산 후 가상현금 = 10,000,000 + 97,485 (비용 전부 반영)",
      abs(cash_after_sell - (10_000_000 + FIX_REALIZED)) < 1e-6, str(cash_after_sell))
val = pe.portfolio_valuation(CFG_NET, eng.ledger.latest_by_id(), eng.state.get("openMeta"))
check("C4b. 실현손익도 같은 기준(97,485원)",
      abs(val["realizedPnl"] - FIX_REALIZED) < 1e-6, str(val["realizedPnl"]))
# 🔑 핵심: 거래별 순수익률 × 실제로 나간 돈 = 계좌에 들어온 손익. 두 장부가 같아야 한다.
net_pct = closed[0]["estimated_net_return_pct"]
implied = FIX_OUTLAY * net_pct / 100.0
check("C5. 거래별 순수익률과 계좌 손익이 같은 기준(오차 1원 미만)",
      abs(implied - FIX_REALIZED) < 1.0, f"{implied} vs {FIX_REALIZED}")
# 손계산: 산 값 10,000×1.00015 = 10,001.5 / 판 값 11,000×(1-0.00015-0.002) = 10,976.35
#        10,976.35 / 10,001.5 - 1 = 9.747% (= 97,485 / 1,000,150 과 같은 값)
check("C5b. 순수익률 자체도 고정 대조군과 일치(+9.747%)",
      abs(net_pct - 9.747) < 0.001, str(net_pct))
check("C5c. 순수익률 = 확정손익 / 실제로 나간 돈 (두 계산이 같은 값)",
      abs(net_pct - FIX_REALIZED / FIX_OUTLAY * 100) < 0.001,
      f"{net_pct} vs {FIX_REALIZED / FIX_OUTLAY * 100}")
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("C6. summary에 회계 버전이 명시된다",
      summ.get("accountingVersion") == pe.ACCOUNTING_V2_NET
      and summ["accounting"]["costAccountingFrom"] == "2026-08-27")
check("C6b. 새 기준만 있는 계좌는 미반영 비용 0",
      summ["accounting"]["unreflectedCostKrw"] == 0.0
      and summ["accounting"]["netBasisTrades"] == 1
      and summ["accounting"]["grossBasisTrades"] == 0)
# 판 돈 재사용 — 청산으로 돌아온 현금(비용 뺀 값)으로 다음 종목을 산다
eng.provider = pmd.FixtureMarketDataProvider(
    prices={"000660": {"price": 20_000, "timestamp": f"{N2}T11:00:00+09:00"}},
    orderbooks={"000660": {"bestAsk": 20_000, "bestBid": 19_990,
                           "timestamp": f"{N2}T11:00:00+09:00"}},
    calendar=cal(N2))
eng.run_cycle(bundle({"000660": "BUY"}, f"{N2}T11:05:00+09:00"), now=t(N2, 11, 10))
new_open = [r for r in eng.ledger.latest_by_id().values()
            if r["status"] == "OPEN" and r["symbol"] == "000660"]
check("C7. 판 돈 재사용 — 청산 후 남은 현금으로 새로 진입한다", len(new_open) == 1)
# 50주 × 20,000 = 1,000,000 + 수수료 150 = 1,000,150
check("C7b. 재진입에도 매수수수료가 반영된다",
      abs(pe.derive_cash(CFG_NET, eng.ledger.latest_by_id())
          - (10_000_000 + FIX_REALIZED - FIX_OUTLAY)) < 1e-6,
      str(pe.derive_cash(CFG_NET, eng.ledger.latest_by_id())))
# 같은 Episode 재매수 0 (전환 이후에도 그대로)
before = len(eng.ledger.rows)
eng.run_cycle(bundle({"000660": "BUY"}, f"{N2}T11:05:00+09:00"), now=t(N2, 11, 40))
check("C8. 같은 Episode 재처리 → 추가 매수 0", len(eng.ledger.rows) == before)
shutil.rmtree(tmp)

# 5거래일 청산 규칙은 그대로다(비용을 넣었다고 규칙이 바뀌지 않았다)
tmp = tempfile.mkdtemp(prefix="pa2_")
days = [f"2026-09-{d:02d}" for d in range(1, 9)]
eng = pe.PaperEngine(provider(days[0], ENTRY, ENTRY - 10), data_dir=tmp, config=CFG_NET,
                     environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{days[0]}T09:05:00+09:00"), now=t(days[0], 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{days[0]}T10:05:00+09:00"), now=t(days[0], 10, 10))
states = []
for d in days[1:7]:
    eng.provider = provider(d, ENTRY, ENTRY - 10)
    eng.run_cycle(bundle({"005930": "HOLD"}, f"{d}T10:05:00+09:00"), now=t(d, 10, 10))
    states.append((d, [r["status"] for r in eng.ledger.latest_by_id().values()]))
closed5 = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "CLOSED"]
check("C9. V1 5거래일 청산 규칙 유지(보유 5거래일에 MAX_HOLDING_5D)",
      len(closed5) == 1 and closed5[0]["exit_reason"] == "MAX_HOLDING_5D"
      and closed5[0]["holding_trading_days"] == 5, str(states))
check("C10. Forward only — 시작일 이전 신호로는 거래를 만들지 않는다",
      "ENGINE_NOT_STARTED" in pe.PaperEngine(
          provider("2026-08-14", ENTRY, ENTRY), data_dir=tempfile.mkdtemp(prefix="pa2f_"),
          config=CFG_NET, environment="TEST").run_cycle(
              bundle({"005930": "BUY"}, "2026-08-14T09:05:00+09:00"),
              now=datetime(2026, 8, 14, 10, 0, tzinfo=KST)))
shutil.rmtree(tmp)

# ═══ D. 실제 원장 보호 — 과거를 다시 쓰지 않았는가 ═══════════════════════════
LEDGER = os.path.join(HERE, "paper_trading", "trades.jsonl")
raw_lines = [ln for ln in open(LEDGER, "rb").read().split(b"\n") if ln.strip()]
# 2026-08-26 시점의 원장 121행. 여기에 새 거래가 append 될 수는 있어도
# 이미 있는 121행은 영원히 그대로여야 한다(수정·재작성 금지).
FROZEN_ROWS = 121
FROZEN_SHA = "4c569c5f7b47a09bf8a1a195950c02f9206afec72797a35130afbc26915bc285"
check("D1. 원장이 줄어들지 않았다(행 삭제 0)", len(raw_lines) >= FROZEN_ROWS,
      f"{len(raw_lines)} < {FROZEN_ROWS}")
digest = hashlib.sha256(b"\n".join(raw_lines[:FROZEN_ROWS])).hexdigest()
check("D2. 기존 121행이 한 글자도 바뀌지 않았다(Backfill·재작성 0)",
      digest == FROZEN_SHA, digest)
old_rows = [json.loads(ln) for ln in raw_lines[:FROZEN_ROWS]]
check("D3. 기존 행에는 새 회계 필드를 소급해 넣지 않았다",
      not any("accounting_version" in r or "entry_commission_krw" in r for r in old_rows))
live_cfg = json.load(open(os.path.join(HERE, "paper_trading", "config.json"), encoding="utf-8"))
old_latest = {}
for r in old_rows:
    if r.get("environment") == "LIVE_PAPER":
        old_latest[r["trade_id"]] = r
check("D4. 옛 거래의 가상현금은 예전 값 그대로(423,025원)",
      abs(pe.derive_cash(live_cfg, old_latest) - 423_025.0) < 1e-6,
      str(pe.derive_cash(live_cfg, old_latest)))
old_closed = [r for r in old_latest.values() if r.get("status") == "CLOSED"]
check("D5. 옛 거래의 확정손익도 예전 값 그대로(92,305원)",
      abs(sum(pe.realized_pnl_krw(r, live_cfg) for r in old_closed) - 92_305.0) < 1e-6)
un = pe.unreflected_costs(old_latest, live_cfg)
check("D6. 전환 이전 미반영 비용을 숨기지 않고 센다(23,873.87원)",
      abs(un["totalKrw"] - 23_873.87) < 0.02, str(un["totalKrw"]))
check("D6b. 미반영 비용 내역(매수 2,899.85 · 매도 1,463.30 · 거래세 19,510.72)",
      abs(un["buyCommissionKrw"] - 2_899.85) < 0.02
      and abs(un["sellCommissionKrw"] - 1_463.30) < 0.02
      and abs(un["sellTaxKrw"] - 19_510.72) < 0.02, json.dumps(un))
val_old = pe.portfolio_valuation(live_cfg, old_latest, {})
disc = pe.accounting_disclosure(live_cfg, old_latest, val_old)
check("D7. 전부 반영했을 때의 현금(399,151원)을 함께 공개한다",
      abs(disc["cashIfAllNetKrw"] - 399_151.13) < 0.02, str(disc["cashIfAllNetKrw"]))
check("D8. 전부 반영했을 때의 확정손익(69,882원)도 함께 공개한다",
      abs(disc["realizedPnlIfAllNetKrw"] - 69_881.52) < 0.02,
      str(disc["realizedPnlIfAllNetKrw"]))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_accounting_v2: 전체 통과 (V1 회계 수리 계약)")
