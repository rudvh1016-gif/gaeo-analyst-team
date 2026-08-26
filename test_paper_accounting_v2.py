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

# ═══ E. 회계 항등식 — 옛 기준과 새 기준을 나눠서 검증 ═══════════════════════
# (기존 test_paper_accounting.py의 항등식은 무비용 전제라 옛 기준 거래에만 성립한다.
#  새 기준 거래에서는 '실제로 나간 돈(investedCashOutlay)'으로 같은 항등식이 성립한다)
def identities(tag, val, initial, outlay_expected, invested_expected):
    check(f"{tag} · 투자원금 = Σ(체결가×수량)",
          abs(val["investedCostBasis"] - invested_expected) < 1e-6,
          str(val["investedCostBasis"]))
    check(f"{tag} · 실제로 나간 돈 = Σ(체결가×수량 + 매수수수료)",
          abs(val["investedCashOutlay"] - outlay_expected) < 1e-6,
          str(val["investedCashOutlay"]))
    check(f"{tag} · 실제로 나간 돈 = 시작자금 + 실현손익 - 현금",
          abs(val["investedCashOutlay"]
              - (initial + val["realizedPnl"] - val["cash"])) < 1e-6)
    check(f"{tag} · 현금 + 평가금액 = 현재 가상자산",
          abs(val["cash"] + val["markedPositionsValue"]
              - val["currentVirtualEquity"]) < 1e-6)
    check(f"{tag} · 미실현 = 평가금액 - 실제로 나간 돈",
          abs(val["unrealizedPnl"]
              - (val["markedPositionsValue"] - val["investedCashOutlay"])) < 1e-6)
    check(f"{tag} · 전체손익 = 현재자산 - 시작자금 = 실현 + 미실현",
          abs((val["currentVirtualEquity"] - initial)
              - (val["realizedPnl"] + val["unrealizedPnl"])) < 1e-6)


net_latest = {"o": row_net("OPEN", trade_id="o"),
              "c": row_net(trade_id="c")}
val_net = pe.portfolio_valuation(CFG_NET, net_latest,
                                 {"o": {"lastMarkPrice": 10_500,
                                        "lastMarkObservedAt": "2026-09-02T10:00:00+09:00"}})
identities("E1. 새 기준(NET)", val_net, 10_000_000, FIX_OUTLAY, 1_000_000.0)
check("E1b. 새 기준에서는 투자원금 ≠ 실제로 나간 돈(수수료 150원 차이)",
      abs(val_net["investedCashOutlay"] - val_net["investedCostBasis"] - FIX_BUY_FEE) < 1e-6)
gross_latest = {"o": {**row_net("OPEN", trade_id="o"),
                      "accounting_version": pe.ACCOUNTING_V1_GROSS},
                "c": {**row_net(trade_id="c"),
                      "accounting_version": pe.ACCOUNTING_V1_GROSS}}
val_gross = pe.portfolio_valuation(CFG_NET, gross_latest,
                                   {"o": {"lastMarkPrice": 10_500,
                                          "lastMarkObservedAt": "2026-09-02T10:00:00+09:00"}})
identities("E2. 옛 기준(GROSS)", val_gross, 10_000_000, 1_000_000.0, 1_000_000.0)
check("E2b. 옛 기준에서는 두 값이 같다(예전 항등식 그대로 성립)",
      val_gross["investedCashOutlay"] == val_gross["investedCostBasis"] == 1_000_000.0)

# ═══ F. 벤치마크 — 실제 진입일·청산일로 다시 계산 ════════════════════════════
_idx = pe.load_index_history()
_real = [json.loads(ln) for ln in raw_lines[:FROZEN_ROWS]]
_real_closed = [r for r in _real if r.get("status") == "CLOSED"
                and r.get("environment") == "LIVE_PAPER"]
check("F0. 실측 대상 — 청산 10건이 모두 2026-08-18 진입 · 2026-08-25 청산",
      len(_real_closed) == 10
      and {r["entry_business_date"] for r in _real_closed} == {"2026-08-18"}
      and {r["exit_business_date"] for r in _real_closed} == {"2026-08-25"})
_kospi = [r for r in _real_closed if r["market"] == "KOSPI"][0]
rb = pe.recomputed_benchmark(_kospi, _idx)
# 손계산: KOSPI 6,869.83(8/18 종가) → 6,742.74(8/25 종가) = -1.850%
check("F1. 재계산 벤치마크가 실제 진입일·청산일 종가를 쓴다(-1.85%)",
      rb["status"] == "RECOMPUTED" and abs(rb["benchmarkReturnPct"] + 1.850) < 0.002
      and rb["entryDay"] == "2026-08-18" and rb["exitDay"] == "2026-08-25",
      json.dumps(rb, ensure_ascii=False))
check("F2. 원장에 박제된 값은 그대로 둔다(고치지 않는다)",
      abs(_kospi["benchmark_return_pct"] + 4.027) < 0.002,
      str(_kospi["benchmark_return_pct"]))
_frozen_rel = sum(r["relative_return_pct"] for r in _real_closed) / len(_real_closed)
_recomp_rel = sum(pe.recomputed_benchmark(r, _idx)["relativeReturnPct"]
                  for r in _real_closed) / len(_real_closed)
check("F3. 부풀려져 있던 시장대비가 실제 값으로 내려간다(+5.341 → +2.873%p)",
      abs(_frozen_rel - 5.341) < 0.01 and abs(_recomp_rel - 2.873) < 0.01,
      f"{_frozen_rel} → {_recomp_rel}")
check("F4. 그 날짜 종가가 없으면 값을 만들지 않는다(근처 날로 대체 금지)",
      pe.recomputed_benchmark({"market": "KOSPI", "entry_business_date": "2026-08-17",
                               "exit_business_date": "2026-08-25",
                               "gross_return_pct": 1.0}, _idx)["status"]
      == "MISSING_INDEX_ON_TRADE_DAY")

# ═══ G. 비율지표도 '비용 전부 반영' 값을 함께 낸다 ═══════════════════════════
# 고정 대조군: 총수익 +0.2%짜리 10건은 왕복비용 0.23%를 빼면 손실로 뒤집힌다.
tmp = tempfile.mkdtemp(prefix="pa2g_")
with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
    for i in range(20):
        thin = i % 2 == 0
        day = (datetime(2026, 9, 1) + timedelta(days=i)).strftime("%Y-%m-%d")
        f.write(json.dumps({
            "trade_id": f"g{i}", "environment": "TEST", "status": "CLOSED",
            "symbol": f"{i:06d}", "market": "KOSPI", "quantity": 100,
            "entry_price": 10_000, "exit_price": 10_020 if thin else 10_500,
            "gross_return_pct": 0.2 if thin else 5.0,
            # 손계산: 10,020×0.99785 / (10,000×1.00015) - 1 = -0.030%
            #        10,500×0.99785 / (10,000×1.00015) - 1 = +4.758%
            "estimated_net_return_pct": -0.030 if thin else 4.758,
            "holding_trading_days": 5, "entry_business_date": day,
            "exit_business_date": day, "accounting_version": pe.ACCOUNTING_V1_GROSS,
        }, ensure_ascii=False) + "\n")
eng = pe.PaperEngine(None, data_dir=tmp, config=CFG_NET, environment="TEST")
eng._write_summary()
sm = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("G0. 표본 게이트 통과(20건 · 판단일 20일)", sm["evidence"] == "SAMPLE_OK",
      str(sm["evidence"]))
check("G1. 총수익 기준 승률은 100%인데",
      sm["winRatePct"] == 100.0, str(sm["winRatePct"]))
check("G2. 비용 전부 반영 승률은 50%다(비율지표도 IfAllNet을 낸다)",
      sm["winRatePctIfAllNet"] == 50.0, str(sm["winRatePctIfAllNet"]))
check("G3. 평균·중앙값·손익비·Profit Factor도 IfAllNet 값을 낸다",
      all(sm.get(k) is not None for k in
          ("avgReturnPctIfAllNet", "medianReturnPctIfAllNet", "avgWinPctIfAllNet",
           "avgLossPctIfAllNet", "expectancyPctIfAllNet", "profitFactorIfAllNet",
           "winLossRatioIfAllNet")),
      json.dumps({k: sm.get(k) for k in ("avgReturnPctIfAllNet", "profitFactorIfAllNet")}))
check("G4. IfAllNet 평균이 총수익 평균보다 낮다(비용만큼)",
      sm["avgReturnPctIfAllNet"] < sm["avgReturnPct"],
      f'{sm["avgReturnPctIfAllNet"]} vs {sm["avgReturnPct"]}')
check("G5. 비율지표가 무비용 기준이라는 경고를 명시한다(침묵 금지)",
      "IfAllNet" in sm["accounting"]["ratioBasisWarning"]
      and "maxDrawdownBasis" in sm["accounting"])
check("G6. 벤치마크 기준도 산출물에 밝힌다",
      sm["benchmarkBasis"] == "RECOMPUTED_FROM_TRADE_DATES"
      and "benchmarkRecomputedCount" in sm)
shutil.rmtree(tmp)
# 표본이 모자라면 IfAllNet 비율도 함께 막힌다(한쪽만 새면 결론이 새어 나간다)
tmp = tempfile.mkdtemp(prefix="pa2g2_")
with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
    f.write(json.dumps({"trade_id": "x1", "environment": "TEST", "status": "CLOSED",
                        "symbol": "000001", "market": "KOSPI", "quantity": 100,
                        "entry_price": 10_000, "exit_price": 10_500,
                        "gross_return_pct": 5.0, "estimated_net_return_pct": 4.758,
                        "entry_business_date": "2026-09-01",
                        "exit_business_date": "2026-09-08"}, ensure_ascii=False) + "\n")
eng = pe.PaperEngine(None, data_dir=tmp, config=CFG_NET, environment="TEST")
eng._write_summary()
sm2 = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("G7. 표본 부족이면 IfAllNet 비율도 전부 null",
      all(sm2.get(k) is None for k in
          ("winRatePct", "winRatePctIfAllNet", "avgReturnPctIfAllNet",
           "profitFactorIfAllNet", "expectancyPctIfAllNet")),
      json.dumps({k: sm2.get(k) for k in ("winRatePctIfAllNet",)}))
shutil.rmtree(tmp)

# ═══ H. 화면에 보이는 거래별 값도 같은 회계를 쓰는가 ═════════════════════════
# (합계만 고치고 거래별 값을 무비용으로 두면 "거래별 합 ≠ 총계"가 된다)
import re as _re2

import paper_public as _pp

tmp = tempfile.mkdtemp(prefix="pa2h_")
d = os.path.join(tmp, "paper_trading")
os.makedirs(d)
_closed_net = {"trade_id": "h1", "environment": "LIVE_PAPER", "status": "CLOSED",
               "symbol": "005930", "name": "삼성전자", "market": "KOSPI",
               "entry_price": ENTRY, "exit_price": EXIT_, "quantity": QTY,
               "entry_business_date": "2026-08-18", "exit_business_date": "2026-08-25",
               "exit_at": "2026-08-25T10:10:00+09:00", "exit_reason": "CHIEF_SELL",
               "gross_return_pct": 10.0, "holding_trading_days": 5,
               "accounting_version": pe.ACCOUNTING_V2_NET,
               "simulated_fill_at": "2026-08-18T10:10:00+09:00",
               "detected_at": "2026-08-18T10:10:00+09:00"}
with open(os.path.join(d, "trades.jsonl"), "w", encoding="utf-8") as f:
    f.write(json.dumps(_closed_net, ensure_ascii=False) + "\n")
json.dump({"engineStartedAt": "2026-08-18T09:10:00+09:00", "baselineCaptured": True,
           "lastCycleAt": "2026-08-25T10:10:00+09:00", "lastCycleResult": "CYCLE_OK",
           "businessDates": ["2026-08-18", "2026-08-25"], "openMeta": {}},
          open(os.path.join(d, "state.json"), "w"))
json.dump(_cfg_file, open(os.path.join(d, "config.json"), "w"))
json.dump({"initialVirtualCash": 10_000_000}, open(os.path.join(d, "summary.json"), "w"))
_od, _oo = _pp.DIR, _pp.OUT
_pp.DIR = d
_pp.OUT = os.path.join(tmp, "paper_public.js")
try:
    rc = _pp.build()
    pub = json.loads(_re2.search(r"window\.GAEO_PAPER=(.*);\s*$",
                                 open(_pp.OUT, encoding="utf-8").read(), _re2.S).group(1))
finally:
    _pp.DIR, _pp.OUT = _od, _oo
tr = pub["recentTrades"][0]
check("H0. 공개 스냅샷 생성 성공", rc == 0)
check("H1. 화면의 거래별 확정손익도 비용 반영 값이다(97,485원)",
      tr["realized_pnl"] == round(FIX_REALIZED), str(tr["realized_pnl"]))
check("H2. 거래별 값의 합 = 총계(두 곳이 어긋나지 않는다)",
      abs(sum(t.get("realized_pnl", 0) for t in pub["recentTrades"])
          - pub["realizedPnl"]) < 1.0,
      f'{sum(t.get("realized_pnl", 0) for t in pub["recentTrades"])} vs {pub["realizedPnl"]}')
check("H3. 화면의 시장대비도 실제 진입일·청산일로 다시 계산된 값이다",
      abs(tr["benchmark_return_pct"] + 1.850) < 0.002,
      str(tr.get("benchmark_return_pct")))
check("H4. 회계 기준이 섞여 있다는 사실을 화면 payload에 싣는다",
      pub["costBasisMix"]["current"] == "NET"
      and pub["costBasisMix"]["unreflectedCostKrw"] == 0.0)
check("H5. 공개 payload에 'account' 문자열이 없다(계좌 흔적 차단에 걸리지 않게)",
      "account" not in json.dumps(pub, ensure_ascii=False).lower())
shutil.rmtree(tmp)

# ═══ I. 못 산 후보·산 종목의 '같은 잣대' 관측가 (감사 B·C) ══════════════════
# V1은 신호 111건 중 91건을 현금 부족으로 못 샀다. 그 순간의 가격이 없으면
# "자리가 있었다면 어땠나"를 나중에 어떤 방법으로도 계산할 수 없다.
def prov_multi(day, quotes):
    return pmd.FixtureMarketDataProvider(
        prices={c: {"price": (a + b) / 2, "timestamp": f"{day}T10:00:00+09:00"}
                for c, (a, b) in quotes.items()},
        orderbooks={c: {"bestAsk": a, "bestBid": b, "timestamp": f"{day}T10:00:00+09:00"}
                    for c, (a, b) in quotes.items()},
        calendar=cal(day))


def bundle_multi(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()}, "analysisCompletedAt": at}


tmp = tempfile.mkdtemp(prefix="pa2i_")
codes = [f"10{i:04d}" for i in range(1, 10)]
quotes = {c: (1_000_000, 999_000) for c in codes}
quotes["777777"] = (33_000, 32_900)
eng = pe.PaperEngine(prov_multi(N1, quotes), data_dir=tmp, config=CFG_NET,
                     environment="TEST")
eng.run_cycle(bundle_multi({c: "HOLD" for c in codes}, f"{N1}T09:05:00+09:00"),
              now=t(N1, 9, 10))
eng.run_cycle(bundle_multi({c: "BUY" for c in codes}, f"{N1}T10:05:00+09:00"),
              now=t(N1, 10, 10))
eng.provider = prov_multi(N2, quotes)
sig = {c: "HOLD" for c in codes}
sig["777777"] = "BUY"
calls_before = len(eng.provider.calls)
eng.run_cycle(bundle_multi(sig, f"{N2}T10:05:00+09:00"), now=t(N2, 10, 10))
qpath = os.path.join(tmp, pe.PaperEngine.SKIP_QUOTE_FILE)
rows_q = [json.loads(x) for x in open(qpath, encoding="utf-8")]
skips = [r for r in rows_q if r["kind"] == "SKIPPED"]
check("I1. V1도 못 산 후보의 그 시점 관측가를 남긴다",
      len(skips) == 1 and skips[0]["symbol"] == "777777"
      and skips[0]["observed_price"] == 32_950.0
      and skips[0]["reason"] == "INSUFFICIENT_CASH",
      json.dumps(skips, ensure_ascii=False)[:200])
check("I2. 원장의 SKIP 행과 trade_id로 이어 붙는다",
      skips[0]["trade_id"] in {r["trade_id"] for r in eng.ledger.rows
                               if r.get("status") == "SKIPPED_INSUFFICIENT_CASH"})
entered_q = [r for r in rows_q if r["kind"] == "ENTERED"]
check("I3. 진입 종목의 '같은 잣대' 가격도 같은 배치에서 남긴다(감사 C)",
      len(entered_q) == 9 and all(r["entry_method"] == "BEST_ASK"
                                  and r["observed_price"] for r in entered_q),
      str(len(entered_q)))
check("I4. 두 기록이 같은 잣대(현재가 1회 조회)에서 나왔다",
      len({r["quote_basis"] for r in rows_q}) == 1
      and "Best Ask" in rows_q[0]["quote_basis"])
price_calls = [c for c in eng.provider.calls if c[0] == "prices"]
check("I5. 배치 조회는 사이클당 1회다(후보마다 부르지 않는다)",
      len(price_calls) <= 2, str(price_calls)[:120])
check("I6. 원장은 예전과 같은 자리에서 그대로 기록된다(순서·내구성 불변)",
      [r.get("status") for r in eng.ledger.rows].count("SKIPPED_INSUFFICIENT_CASH") == 1)
n_before = len(rows_q)
eng.run_cycle(bundle_multi(sig, f"{N2}T10:05:00+09:00"), now=t(N2, 11, 10))
check("I7. 같은 분석 배치는 한 번만 기록한다",
      len([json.loads(x) for x in open(qpath, encoding="utf-8")]) == n_before)
shutil.rmtree(tmp)
# 시세 조회가 실패하면 아무 것도 쓰지 않고 다음 사이클에 다시 시도한다
tmp = tempfile.mkdtemp(prefix="pa2i2_")
eng = pe.PaperEngine(prov_multi(N1, quotes), data_dir=tmp, config=CFG_NET,
                     environment="TEST")
eng.run_cycle(bundle_multi({c: "HOLD" for c in codes}, f"{N1}T09:05:00+09:00"),
              now=t(N1, 9, 10))
blind = prov_multi(N1, quotes)
blind.get_prices = lambda symbols: (_ for _ in ()).throw(
    pmd.MarketDataUnavailable("fixture: 시세 실패"))
eng.provider = blind
eng.run_cycle(bundle_multi({c: "BUY" for c in codes}, f"{N1}T10:05:00+09:00"),
              now=t(N1, 10, 10))
check("I8. 시세 조회 실패 시 빈 기록을 만들지 않는다",
      not os.path.exists(os.path.join(tmp, pe.PaperEngine.SKIP_QUOTE_FILE)))
check("I9. 실패를 '기록 완료'로 찍지 않는다(다음 사이클 재시도 가능)",
      eng.state.get("lastSkipQuoteBatch") is None)
shutil.rmtree(tmp)

# ═══ J. 지수 종가는 '확정된 날'만 쓴다 (감사 M3) ═════════════════════════════
# market_history.js는 불변 파일이 아니다 — update-analysis cron("8,38 1-6 * * 1-5"
# = KST 10:08~15:38)이 장중에도 그날 값을 덮는다. 그날 값을 쓰면 같은 거래의
# 시장대비가 나중에 소급해서 바뀐다(paper_history의 불변 계약과 충돌).
_today = pe.today_kst_date()
_hist_today = {"2026-08-18": {"KOSPI": 1000.0}, _today: {"KOSPI": 1100.0}}
check("J1. 오늘 청산한 거래는 확정 전이라 값을 만들지 않는다",
      pe.recomputed_benchmark({"market": "KOSPI", "entry_business_date": "2026-08-18",
                               "exit_business_date": _today, "gross_return_pct": 5.0},
                              _hist_today)["status"] == "PENDING_SETTLEMENT")
check("J2. 오늘 항목은 아예 읽지 않는다(장중에 덮이는 값)",
      pe.settled_index_close(_hist_today, "KOSPI", _today) is None
      and pe.settled_index_close(_hist_today, "KOSPI", "2026-08-18") == 1000.0)
check("J3. 확정된 두 날 사이만 계산한다",
      pe.benchmark_window({"2026-08-18": {"KOSPI": 1000.0},
                           "2026-08-25": {"KOSPI": 1100.0}},
                          "KOSPI", "2026-08-18", "2026-08-25", 5.0)["benchmarkReturnPct"]
      == 10.0)
check("J4. 같은 날이거나 순서가 뒤집히면 값이 없다",
      pe.benchmark_window({"2026-08-18": {"KOSPI": 1000.0}}, "KOSPI",
                          "2026-08-18", "2026-08-18", 1.0)["status"] == "NO_SETTLED_WINDOW")
check("J5. 마지막 확정 거래일을 고를 때도 오늘은 빼고 고른다",
      pe.latest_settled_index_day(_hist_today, "KOSPI") == "2026-08-18")

# ═══ K. 시계 불일치를 값 옆에 사실로 남긴다 (감사 D) ═════════════════════════
check("K1. 지수 조회 경로를 새로 만들지 않았다(Market Data 경계 유지)",
      not any("index" in p or "indices" in p for p in pmd.ALLOWED_PATHS),
      str(sorted(pmd.ALLOWED_PATHS)))
tmp = tempfile.mkdtemp(prefix="pa2k_")
eng = pe.PaperEngine(provider(N1, ENTRY, ENTRY - 10), data_dir=tmp, config=CFG_NET,
                     environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{N1}T09:05:00+09:00"), now=t(N1, 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{N1}T10:05:00+09:00"), now=t(N1, 10, 10))
eng.provider = provider(N2, EXIT_ + 10, EXIT_)
eng.run_cycle(bundle({"005930": "SELL"}, f"{N2}T10:05:00+09:00"), now=t(N2, 10, 10))
_cl = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "CLOSED"][0]
check("K2. 청산 기록에 시계 불일치 한계가 붙는다",
      "장중" in _cl["benchmark_clock_note"] and "종가" in _cl["benchmark_clock_note"],
      str(_cl.get("benchmark_clock_note")))
_sm = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("K3. 요약에도 같은 고지가 실린다", bool(_sm.get("benchmarkClockMismatchNote")))
shutil.rmtree(tmp)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_accounting_v2: 전체 통과 (V1 회계 수리 계약)")
