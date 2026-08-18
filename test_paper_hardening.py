#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper V1 Pre-launch Hardening 계약 — Baseline 회계·MDD seed·시간 분리·표시 게이트.

Required Test 1~13(발췌) + 적대적 시나리오. 전부 offline fixture(environment=TEST).
"""
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd
import paper_public as pp

KST = timezone(timedelta(hours=9))
FAILURES = []
CFG = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
       "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def bundle(calls, at, model="baseline-risk-v2"):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at, "modelVersion": model}


def cal(day, open_=True):
    # ⚠️ 실제 응답 모양 그대로: integrated 안에 preMarket/regularMarket/afterMarket이 있고
    #    정규장 시각은 regularMarket에 있다. (2026-08-18 이전 픽스처는 integrated 최상위에
    #    startTime/endTime을 두는 잘못된 모양이라, 정규장 오판 버그를 잡아내지 못했다)
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    ses = {"preMarket": {"startTime": f"{day}T08:00:00+09:00",
                         "endTime": f"{day}T09:00:00+09:00"},
           "regularMarket": regular,
           "afterMarket": {"startTime": f"{day}T15:30:00+09:00",
                           "endTime": f"{day}T20:00:00+09:00"}}
    return {"today": {"date": day, "open": open_, "integrated": ses if open_ else None},
            "previousBusinessDay": None, "nextBusinessDay": None}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def provider(day, price=10_000, price_ts="MARKET"):
    ts = f"{day}T10:00:00+09:00" if price_ts == "MARKET" else None
    return pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": price, "timestamp": ts}},
        orderbooks={"005930": {"bestAsk": price, "bestBid": price - 10,
                               "timestamp": ts}},
        calendar=cal(day))


D1, D2 = "2026-08-18", "2026-08-19"

# ── RT1: Baseline Snapshot — 거래 0 · Equity 기준점 10,000,000 기록 ─────────
tmp = tempfile.mkdtemp(prefix="ph_")
eng = pe.PaperEngine(provider(D1), data_dir=tmp, config=CFG, environment="TEST")
r = eng.run_cycle(bundle({"005930": "BUY", "000660": "HOLD", "035720": "SELL"},
                         f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
check("RT1a. Baseline Capture + 거래 0(기존 BUY 소급 매수 없음)",
      "BASELINE_CAPTURED" in r and not os.path.exists(os.path.join(tmp, "trades.jsonl")))
curve_rows = [json.loads(x) for x in open(os.path.join(tmp, "equity_curve.jsonl"))]
check("RT1b. Equity Curve 최초 기준점 = 10,000,000",
      len(curve_rows) == 1 and curve_rows[0]["markedEquity"] == 10_000_000)
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("RT1c. Baseline Summary 기록 + 평가금 10,000,000",
      summ["currentVirtualEquity"] == 10_000_000)
check("RT1d(RT10). 거래 0 → 성과 지표 전부 null(0% 성과로 위장 금지)",
      summ["portfolioReturnPct"] is None and summ["maxDrawdownPct"] is None
      and summ["realizedPnl"] is None and summ["unrealizedPnl"] is None
      and summ["winRatePct"] is None and summ["executedTradeCount"] == 0)
check("RT9b. Provenance 기록(분석시각·모델버전)",
      summ["sourceAnalysisCompletedAt"] == f"{D1}T09:05:00+09:00"
      and summ["sourceModelVersion"] == "baseline-risk-v2")

# 공개 스냅샷도 동일 게이트 (Baseline 상태)
pp_dir, pp_out = pp.DIR, pp.OUT
pp.DIR = tmp
pp.OUT = os.path.join(tmp, "paper_public.js")
try:
    pp.build()
    pub = json.loads(open(pp.OUT, encoding="utf-8").read().split("=", 1)[1].strip().rstrip(";"))
    check("RT1e. Public: 평가금 10,000,000 · Return/MDD null · executed 0",
          pub["currentVirtualEquity"] == 10_000_000 and pub["portfolioReturnPct"] is None
          and pub["maxDrawdownPct"] is None and pub["executedTradeCount"] == 0)
finally:
    pp.DIR, pp.OUT = pp_dir, pp_out

# ── AB2: Baseline 중 Crash → 재실행에도 기존 BUY 소급 매수 없음 ────────────
os.remove(os.path.join(tmp, "state.json"))     # baseline 저장 유실 시뮬레이션
eng2 = pe.PaperEngine(provider(D1), data_dir=tmp, config=CFG, environment="TEST")
r2 = eng2.run_cycle(bundle({"005930": "BUY"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 40))
check("AB2. Baseline crash 재실행 → 다시 Baseline만(소급 Entry 0)",
      "BASELINE_CAPTURED" in r2 and not os.path.exists(os.path.join(tmp, "trades.jsonl")))
shutil.rmtree(tmp)

# ── RT2: 첫 관측부터 손실 — curve에 9.5M/9.6M만 있어도 MDD -5.0% ────────────
tmp = tempfile.mkdtemp(prefix="ph_")
curve = os.path.join(tmp, "equity_curve.jsonl")
with open(curve, "w", encoding="utf-8") as f:
    for eq in (9_500_000, 9_600_000):
        f.write(json.dumps({"markedEquity": eq}) + "\n")
mdd = pe.max_drawdown_from_curve(curve, initial_seed=10_000_000)
check("RT2. First-point loss: seed 10M + [9.5M, 9.6M] → MDD -5.0%", mdd == -5.0, str(mdd))

# ── RT3: 정상 MDD (seed 포함) ───────────────────────────────────────────────
with open(curve, "w", encoding="utf-8") as f:
    for eq in (10_500_000, 9_450_000, 10_200_000):
        f.write(json.dumps({"markedEquity": eq}) + "\n")
check("RT3. seed 10M + [10.5M, 9.45M, 10.2M] → MDD -10.0%",
      pe.max_drawdown_from_curve(curve, initial_seed=10_000_000) == -10.0)
shutil.rmtree(tmp)

# ── RT4: Entry Fill = 최초 유효 Mark (직후 시세 실패에도 평가 가능) ─────────
tmp = tempfile.mkdtemp(prefix="ph_")
eng = pe.PaperEngine(provider(D1), data_dir=tmp, config=CFG, environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
# Entry는 성공하되 get_prices는 즉시 실패하는 공급자
prov = provider(D1)
prov.prices = {}                                  # 관측 실패
eng.provider = prov
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("RT4. Entry Fill(10,000)이 최초 Mark → 평가금 10,000,000 계산 가능",
      summ["currentVirtualEquity"] == 10_000_000 and summ["valuationStatus"] == "MARKED")
check("RT11. 실제 거래 후의 0.00%는 표시 가능한 실측값",
      summ["portfolioReturnPct"] == 0.0 and summ["executedTradeCount"] == 1)
tid = next(iter(eng.state["openMeta"]))
meta = eng.state["openMeta"][tid]
check("RT4b. Entry Mark 출처 기록(TOSS/FIXTURE + method)",
      meta["lastMarkSource"].startswith("FIXTURE/"))
shutil.rmtree(tmp)

# ── RT5: Market Timestamp 없음 → null 유지(now로 위조 금지) ────────────────
tmp = tempfile.mkdtemp(prefix="ph_")
eng = pe.PaperEngine(provider(D1, price_ts=None), data_dir=tmp, config=CFG, environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
eng.provider = provider(D2, price=10_100, price_ts=None)
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D2}T10:05:00+09:00"), now=t(D2, 10, 10))
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("RT5. Market ts 없음 → valuationMarketAt=null · Observed는 러너 시각",
      summ["valuationMarketAt"] is None
      and summ["valuationObservedAt"] == f"{D2}T10:10:00+09:00",
      f'{summ["valuationMarketAt"]} / {summ["valuationObservedAt"]}')

# ── AB6: Timestamp 역행 탐지(기록) ─────────────────────────────────────────
eng.provider = provider("2026-08-20", price=10_200)          # market ts 2026-08-20
eng.run_cycle(bundle({"005930": "HOLD"}, "2026-08-20T10:05:00+09:00"), now=t("2026-08-20", 10, 10))
old_prov = pmd.FixtureMarketDataProvider(
    prices={"005930": {"price": 10_300, "timestamp": f"{D1}T10:00:00+09:00"}},  # 과거 ts
    orderbooks={"005930": {"bestAsk": 10_300, "bestBid": 10_290, "timestamp": None}},
    calendar=cal("2026-08-21"))
eng.provider = old_prov
eng.run_cycle(bundle({"005930": "HOLD"}, "2026-08-21T10:05:00+09:00"), now=t("2026-08-21", 10, 10))
tid = next(iter(eng.state["openMeta"]))
check("AB6. Market Timestamp 역행 → regression 카운트 기록(관측 순서는 유지)",
      eng.state["openMeta"][tid].get("marketTsRegressionCount", 0) >= 1)
shutil.rmtree(tmp)

# ── RT9/공개 계약: 벤치마크 라벨 정확성 ─────────────────────────────────────
html = open("index.html", encoding="utf-8").read()
check("RT9. UI 라벨 '종료거래 평균 시장대비' 사용(광의의 '시장 대비' 단독 금지)",
      "'종료거래 평균 시장대비'" in html and "${stat(rel,'시장 대비')}" not in html)
check("RT9c. 벤치마크 설명 microcopy(개별 거래 평균임을 명시)",
      "종료된 개별 거래의 동일 기간 지수 대비 성과 평균" in
      open("paper_public.py", encoding="utf-8").read())

# ── AB20: 동일 사이클 2회 → Equity·Trade 수 동일 ────────────────────────────
tmp = tempfile.mkdtemp(prefix="ph_")
eng = pe.PaperEngine(provider(D1), data_dir=tmp, config=CFG, environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
s1 = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 40))
s2 = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("AB20. 동일 사이클 재실행 → Equity·executed 동일(중복 0)",
      s1["currentVirtualEquity"] == s2["currentVirtualEquity"]
      and s1["executedTradeCount"] == s2["executedTradeCount"] == 1)
shutil.rmtree(tmp)

# ── AB16/RT12: Fixture-Live 분리·Secret 미노출은 기존 스위트가 강제 ─────────
pub_src = open("paper_public.py", encoding="utf-8").read()
check("AB16. Public은 LIVE_PAPER만 집계(TEST 제외 필터 존재)",
      '"LIVE_PAPER"' in pub_src)
check("RT12. FORBIDDEN 차단 목록 유지",
      all(w in pub_src for w in ("client_id", "client_secret", "token", "account")))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_hardening: 전체 통과")
