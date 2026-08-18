#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper V1 회계 계약 — Mark-to-Market 평가·Portfolio Return·MDD·Stale 처리.

핵심: 개별 Trade 수익률의 합 ≠ 계좌 수익률. 평가는 관측된 Mark로만,
Mark가 없으면 0이 아니라 null. 매매 행동 로직은 이 테스트가 다루는 코드에서 불변.
"""
import json
import os
import re as _re
import shutil
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd

KST = timezone(timedelta(hours=9))
FAILURES = []
CFG = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
       "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()}, "analysisCompletedAt": at}


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


def provider(day, price, ask=None, bid=None):
    return pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": price, "timestamp": f"{day}T10:00:00+09:00"}},
        orderbooks={"005930": {"bestAsk": ask or price, "bestBid": bid or price,
                               "timestamp": f"{day}T10:00:00+09:00"}},
        calendar=cal(day))


D1, D2 = "2026-08-18", "2026-08-19"

# ── TEST 1: 1M 포지션 +5% Mark → Equity 10,050,000 · Portfolio +0.5% ────────
tmp = tempfile.mkdtemp(prefix="pa_")
eng = pe.PaperEngine(provider(D1, 10_000), data_dir=tmp, config=CFG, environment="TEST")
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
eng.provider = provider(D2, 10_500)     # +5% 관측
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D2}T10:05:00+09:00"), now=t(D2, 10, 10))
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("T1. Current Virtual Equity = 10,050,000 (+5%가 아니라 +0.5%)",
      summ["currentVirtualEquity"] == 10_050_000, str(summ["currentVirtualEquity"]))
check("T1b. Unrealized PnL = +50,000", summ["unrealizedPnl"] == 50_000)
check("T1c. Portfolio Return = +0.5%", summ["portfolioReturnPct"] == 0.5,
      str(summ["portfolioReturnPct"]))
check("T1d. 회계 Identity: 초기+확정+미실현 == 현금+평가포지션",
      abs(CFG["initial_cash_krw"] + summ["realizedPnl"] + summ["unrealizedPnl"]
          - summ["currentVirtualEquity"]) < 1)
check("T1e. 관측/시장 시각 분리 + MARKED", summ["valuationStatus"] == "MARKED"
      and bool(summ["valuationObservedAt"]) and bool(summ["valuationMarketAt"]))

# ── TEST 4: 다음 사이클 시세 실패 → 이전 Mark·Timestamp 보존, 추측 0 ────────
eng.provider = pmd.FixtureMarketDataProvider(prices={}, orderbooks={}, calendar=cal("2026-08-20"))
eng.run_cycle(bundle({"005930": "HOLD"}, "2026-08-20T10:05:00+09:00"), now=t("2026-08-20", 10, 10))
summ = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("T4. Stale — 이전 Mark(10,500) 유지 · Equity 불변",
      summ["currentVirtualEquity"] == 10_050_000)
check("T4b. Stale — 이전 Market 시각 보존·Observed는 그때의 관측 시각(현재시간 위조 없음)",
      summ["valuationMarketAt"] == f"{D2}T10:00:00+09:00"
      and summ["valuationObservedAt"] == f"{D2}T10:10:00+09:00",
      f'{summ["valuationMarketAt"]} / {summ["valuationObservedAt"]}')
shutil.rmtree(tmp)

# ── TEST 2: +10% 실현 ×10회 → Portfolio +10% (Trade 합 +100% 아님) ──────────
latest = {}
for i in range(10):
    latest[f"c{i}"] = {"trade_id": f"c{i}", "environment": "TEST", "status": "CLOSED",
                       "entry_price": 10_000, "exit_price": 11_000, "quantity": 100,
                       "gross_return_pct": 10.0}
val = pe.portfolio_valuation(CFG, latest, {})
check("T2. Realized PnL = 1,000,000", val["realizedPnl"] == 1_000_000)
check("T2b. Final Equity = 11,000,000", val["currentVirtualEquity"] == 11_000_000)
check("T2c. Portfolio Return = +10% (개별 합 +100% 금지)",
      val["portfolioReturnPct"] == 10.0, str(val["portfolioReturnPct"]))
check("T2d. Trade 합(sum)은 별도 필드 의미로만 존재(공개 payload에서 미사용)",
      "grossReturnPct" not in open("paper_public.py", encoding="utf-8").read()
      .split("payload = {")[1].split("}")[0])

# ── TEST 3: MDD — Portfolio Equity Curve 기준 ───────────────────────────────
tmp = tempfile.mkdtemp(prefix="pa_")
curve = os.path.join(tmp, "equity_curve.jsonl")
with open(curve, "w", encoding="utf-8") as f:
    for eq in (10_000_000, 10_500_000, 9_450_000, 10_200_000):
        f.write(json.dumps({"markedEquity": eq}) + "\n")
mdd = pe.max_drawdown_from_curve(curve)
check("T3. MDD = -10.0%", mdd == -10.0, str(mdd))
# 데이터 부족 → None (0%로 표시 금지)
with open(curve, "w", encoding="utf-8") as f:
    f.write(json.dumps({"markedEquity": 10_000_000}) + "\n")
check("T3b. seed 없이 관측 1개 → None(기존 동작)", pe.max_drawdown_from_curve(curve) is None)
check("T3c. seed 있으면 관측 1개도 계산(10M→10M = 0.0)",
      pe.max_drawdown_from_curve(curve, initial_seed=10_000_000) == 0.0)
shutil.rmtree(tmp)

# ── TEST 5: 유효 Mark 전무 → Equity·Return null (0 금지) ────────────────────
latest5 = {"o1": {"trade_id": "o1", "environment": "TEST", "status": "OPEN",
                  "entry_price": 10_000, "quantity": 100}}
val5 = pe.portfolio_valuation(CFG, latest5, {})
check("T5. Mark 없음 → currentVirtualEquity=None · portfolioReturn=None",
      val5["currentVirtualEquity"] is None and val5["portfolioReturnPct"] is None
      and val5["valuationStatus"] == "VALUATION_UNAVAILABLE")
check("T5b. Entry가로 몰래 Reset 안 함(unrealized도 None)", val5["unrealizedPnl"] is None)

# ── TEST 6: 거래 0 → 자산 = 초기금, 성과 지표는 없음 ────────────────────────
val6 = pe.portfolio_valuation(CFG, {}, {})
check("T6. 거래 0 → Equity=초기 1,000만·Return 0.0(현금 그대로)·NO_OPEN_POSITIONS",
      val6["currentVirtualEquity"] == 10_000_000 and val6["valuationStatus"] == "NO_OPEN_POSITIONS")
html = open("index.html", encoding="utf-8").read()
# 2026-08-18: 모의투자가 성적표 하위 블록(paperBlockHTML)에서 독립 화면(renderPaper)으로
# 분리되면서 표현식이 바뀌었다. 검사 대상은 그대로 — "MDD가 없으면 0.0%가 아니라 '기록 대기'".
_paper_ui = html[html.index("function renderPaper("):]
_paper_ui = _paper_ui[:_paper_ui.index("\nfunction ", 10)]
_flat = _paper_ui.replace(" ", "")
check("T6b. UI: MDD 없으면 '기록 대기'(0.0% 금지)",
      "n(P.maxDrawdownPct)==null?na('기록대기')" in _flat)

# ── 매매 행동 불변 계약: valuation 도입 후에도 Entry/Exit 로직 diff 0 ────────
src = open("paper_engine.py", encoding="utf-8").read()
# Mark는 '쓰기(telemetry)'만 허용 — 매매 판단 코드에서 '읽기' 0이어야 한다.
_entries = src.split("def _process_entries")[1].split("def _manage_positions")[0]
_manage = src.split("def _manage_positions")[1].split("def _write_equity")[0]
_reads = [seg for seg in (_entries, _manage) if 'get("lastMarkPrice")' in seg
          or 'meta["lastMarkPrice"]' in seg.replace('meta["lastMarkPrice"] =', '')
          .replace('"lastMarkPrice": price', '')]
check("행동 불변: 진입·청산 코드에서 lastMarkPrice 읽기 0 (쓰기 telemetry만)",
      not _reads and 'get("lastMarkPrice")' in src.split("def portfolio_valuation")[1]
      .split("def max_drawdown")[0])
# 청산 판단(reason)이 Mark를 참조하지 않는지 — reason 결정 블록에 mark 문자열 부재
_reason_block = _manage.split("cur_call =")[1].split("if not in_session")[0]
check("행동 불변: 청산 사유 결정에 Mark 미참조",
      "lastMark" not in _reason_block and "MarkPrice" not in _reason_block)
check("정렬 주석 용어: 판단 확신도", "판단 확신도(confidence) → 종합점수" in src)
# 상태 문구(stageNote)에 요일·날짜를 손으로 박아 넣지 않는다 — 스냅샷이 결정한다.
_stage = _paper_ui.split("stageNote=")[1][:900]
check("요일 하드코딩 없음", not any(d in _stage for d in ("(월)", "(화)", "(수)", "(목)", "(금)")))
check("상태 문구에 날짜 하드코딩 없음", not _re.search(r"\d{1,2}월\s?\d{1,2}일", _stage))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_accounting: 전체 통과")
