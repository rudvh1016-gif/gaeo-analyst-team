#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""포트폴리오 총계 회계 계약 — "1,000만원 중 지금 얼마가 들어가 있나".

이 파일이 지키는 것
    ① 총계 6종(투자원금·가상현금·보유 평가금액·미실현·실현·현재 가상자산)이
       개별 포지션 합계와 1원도 어긋나지 않는다.
    ② 회계 항등식이 상태를 가리지 않고 성립한다:
         가상현금 + 보유 평가금액 = 현재 가상자산
         투자원금 = 시작자금 + 실현손익 - 가상현금
         미실현손익 = 보유 평가금액 - 투자원금
         전체손익 = 현재 가상자산 - 시작자금 = 실현 + 미실현
       종료 0건일 때만 맞추고 첫 매도 뒤 깨지면 안 되므로, 이익·손실 종료와
       혼합·전부종료·현금만 상태까지 전부 고정한다.
    ③ 시세를 못 받은 포지션이 하나라도 있으면 **부분합을 전체 평가금액처럼 내보내지
       않는다**(fail closed — 평가금액·미실현·현재자산·비중 전부 null).
    ④ 산식이 여러 곳에 흩어지지 않는다: paper_public은 엔진 회계 함수를 그대로 쓴다.
    ⑤ 공개 스냅샷에 내부 상태 코드·비밀·계좌 흔적이 섞이지 않는다.

⚠️ 이 파일은 표시용 총계만 검증한다. 진입·청산·수량·보유기간 규칙은 건드리지 않으며,
   그 계약은 test_paper_engine.py / test_paper_session.py가 따로 지킨다.
"""
import json
import os
import re
import shutil
import sys
import tempfile

import paper_engine as pe
import paper_public

FAILURES = []
CFG = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
       "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def open_row(tid, code, entry, qty):
    return {"trade_id": tid, "environment": "LIVE_PAPER", "status": "OPEN",
            "symbol": code, "name": code, "entry_price": entry, "quantity": qty,
            "entry_business_date": "2026-08-18"}


def closed_row(tid, code, entry, exit_, qty):
    return {"trade_id": tid, "environment": "LIVE_PAPER", "status": "CLOSED",
            "symbol": code, "name": code, "entry_price": entry, "exit_price": exit_,
            "quantity": qty, "entry_business_date": "2026-08-17",
            "exit_business_date": "2026-08-18", "exit_reason": "MAX_HOLDING_5D"}


def meta(**marks):
    return {tid: {"lastMarkPrice": p, "lastMarkObservedAt": "2026-08-18T11:05:14+09:00"}
            for tid, p in marks.items()}


def identities(name, val, invested_expected):
    """상태가 무엇이든 성립해야 하는 회계 항등식 묶음."""
    i = val["initialVirtualCash"]
    cash, inv, mkt = val["cash"], val["investedCostBasis"], val["markedPositionsValue"]
    eq, real, unreal = val["currentVirtualEquity"], val["realizedPnl"], val["unrealizedPnl"]
    check(f"{name} · 투자원금 = Σ(체결가×수량)", abs(inv - invested_expected) < 1e-6,
          f"{inv} vs {invested_expected}")
    check(f"{name} · 투자원금 = 시작자금 + 실현손익 - 가상현금",
          abs(inv - (i + real - cash)) < 1e-6, f"{inv} vs {i + real - cash}")
    if eq is None:
        check(f"{name} · 평가 불가 → 평가금액·미실현·현재자산 전부 null",
              mkt is None and unreal is None and val["portfolioReturnPct"] is None)
        return
    check(f"{name} · 가상현금 + 보유 평가금액 = 현재 가상자산",
          abs((cash + mkt) - eq) < 1e-6, f"{cash}+{mkt} vs {eq}")
    check(f"{name} · 미실현손익 = 보유 평가금액 - 투자원금",
          abs(unreal - (mkt - inv)) < 1e-6, f"{unreal} vs {mkt - inv}")
    check(f"{name} · 전체손익 = 현재자산 - 시작자금 = 실현 + 미실현",
          abs((eq - i) - (real + unreal)) < 1e-6, f"{eq - i} vs {real + unreal}")
    check(f"{name} · 수익률 = 전체손익 / 시작자금 × 100",
          abs(val["portfolioReturnPct"] - round((eq / i - 1) * 100, 3)) < 1e-9)


# ═══ 1~8. 기본 상태: 종료 0건 + OPEN 여러 개 (현재 운영 상태) ══════════════════
latest = {"a": open_row("a", "005930", 93700.0, 10),
          "b": open_row("b", "000660", 12660.0, 78)}
val = pe.portfolio_valuation(CFG, latest, meta(a=93500.0, b=12660.0))
invested = 93700.0 * 10 + 12660.0 * 78
identities("종료0 + OPEN2", val, invested)
check("가상현금 = 시작자금 - 투자원금(종료 0건)",
      abs(val["cash"] - (10_000_000 - invested)) < 1e-6)
check("보유 평가금액 = Σ(현재가×수량)",
      abs(val["markedPositionsValue"] - (93500.0 * 10 + 12660.0 * 78)) < 1e-6)
check("미실현손익 값 정확(-2,000원)", abs(val["unrealizedPnl"] - (-2000.0)) < 1e-6)
check("실현손익 = 0(종료 거래 없음)", val["realizedPnl"] == 0)

# 비중 — 합계 100%, 기준은 '현재 가상자산'
inv_pct = val["markedPositionsValue"] / val["currentVirtualEquity"] * 100
cash_pct = val["cash"] / val["currentVirtualEquity"] * 100
check("투자 비중 + 현금 비중 = 100%", abs((inv_pct + cash_pct) - 100.0) < 1e-9)

# ═══ 9. 시세 누락 fail closed — 부분합을 전체처럼 내보내지 않는다 ══════════════
val_partial = pe.portfolio_valuation(CFG, latest, meta(a=93500.0))   # b 미관측
identities("일부 시세 누락", val_partial, invested)
check("9. 시세 누락 → valuationStatus=VALUATION_UNAVAILABLE",
      val_partial["valuationStatus"] == "VALUATION_UNAVAILABLE")
check("9b. 시세 누락이어도 투자원금·가상현금은 계산된다(시세 무관 값)",
      abs(val_partial["investedCostBasis"] - invested) < 1e-6
      and abs(val_partial["cash"] - (10_000_000 - invested)) < 1e-6)
check("9c. 관측된 1종목 평가금액을 '전체 평가금액'으로 내보내지 않음",
      val_partial["markedPositionsValue"] is None)

# ═══ 10~15. 실현손익 발생 이후에도 숫자가 깨지지 않는가 ════════════════════════
# 10. 종료 0건은 위에서 검증 완료.
# 11. 이익 종료 + OPEN 존재
mix_win = {"a": open_row("a", "005930", 93700.0, 10),
           "c": closed_row("c", "011200", 10000.0, 11000.0, 50)}      # +50,000
v = pe.portfolio_valuation(CFG, mix_win, meta(a=93500.0))
identities("11. 이익 종료 + OPEN", v, 93700.0 * 10)
check("11b. 실현손익 = +50,000원", abs(v["realizedPnl"] - 50000.0) < 1e-6)

# 12. 손실 종료 + OPEN 존재
mix_loss = {"a": open_row("a", "005930", 93700.0, 10),
            "c": closed_row("c", "011200", 10000.0, 9000.0, 50)}      # -50,000
v = pe.portfolio_valuation(CFG, mix_loss, meta(a=93500.0))
identities("12. 손실 종료 + OPEN", v, 93700.0 * 10)
check("12b. 실현손익 = -50,000원", abs(v["realizedPnl"] - (-50000.0)) < 1e-6)

# 13. OPEN + CLOSED 혼합(이익·손실 동시)
mix_both = {"a": open_row("a", "005930", 93700.0, 10),
            "b": open_row("b", "000660", 12660.0, 78),
            "c": closed_row("c", "011200", 10000.0, 11000.0, 50),
            "d": closed_row("d", "017940", 20000.0, 19000.0, 30)}     # -30,000
v = pe.portfolio_valuation(CFG, mix_both, meta(a=94000.0, b=12000.0))
identities("13. OPEN2 + CLOSED2(이익·손실)", v, 93700.0 * 10 + 12660.0 * 78)
check("13b. 실현손익 = +50,000 -30,000 = +20,000원", abs(v["realizedPnl"] - 20000.0) < 1e-6)

# 14. 모든 포지션 종료 → 보유 평가금액 0, 현재자산 = 현금
all_closed = {"c": closed_row("c", "011200", 10000.0, 11000.0, 50),
              "d": closed_row("d", "017940", 20000.0, 19000.0, 30)}
v = pe.portfolio_valuation(CFG, all_closed, {})
identities("14. 전부 종료", v, 0)
check("14b. 전부 종료 → 투자원금 0 · 평가금액 0 · 현재자산 = 가상현금",
      v["investedCostBasis"] == 0 and v["markedPositionsValue"] == 0
      and abs(v["currentVirtualEquity"] - v["cash"]) < 1e-6)
check("14c. 전부 종료 → valuationStatus=NO_OPEN_POSITIONS",
      v["valuationStatus"] == "NO_OPEN_POSITIONS")

# 15. 현금만 존재(거래 자체가 없음)
v = pe.portfolio_valuation(CFG, {}, {})
identities("15. 현금만", v, 0)
check("15b. 거래 0건 → 현재자산 = 시작자금 · 손익 0",
      v["currentVirtualEquity"] == 10_000_000 and v["realizedPnl"] == 0
      and v["unrealizedPnl"] == 0.0)

# ═══ 16~17. Public 스냅샷 계약 (UI가 실제로 읽는 값) ═══════════════════════════
def build_public(rows, open_meta, state_extra=None):
    """실제 paper_public.build()를 임시 디렉터리에서 돌려 산출물을 파싱한다."""
    tmp = tempfile.mkdtemp(prefix="pport_")
    d = os.path.join(tmp, "paper_trading")
    os.makedirs(d)
    with open(os.path.join(d, "trades.jsonl"), "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    state = {"engineStartedAt": "2026-08-18T00:56:30+09:00", "baselineCaptured": True,
             "lastCycleAt": "2026-08-18T11:05:14+09:00",
             "lastCycleResult": "CYCLE_OK", "businessDates": ["2026-08-17", "2026-08-18"],
             "openMeta": open_meta}
    state.update(state_extra or {})
    json.dump(state, open(os.path.join(d, "state.json"), "w"))
    json.dump(CFG, open(os.path.join(d, "config.json"), "w"))
    json.dump({"initialVirtualCash": 10_000_000}, open(os.path.join(d, "summary.json"), "w"))
    old_dir, old_out = paper_public.DIR, paper_public.OUT
    paper_public.DIR = d
    paper_public.OUT = os.path.join(tmp, "paper_public.js")
    try:
        rc = paper_public.build()
        blob = open(paper_public.OUT, encoding="utf-8").read() if rc == 0 else ""
    finally:
        paper_public.DIR, paper_public.OUT = old_dir, old_out
        shutil.rmtree(tmp, ignore_errors=True)
    return rc, json.loads(re.search(r"window\.GAEO_PAPER=(.*?);\n", blob).group(1))  # V1 줄만

rc, pub = build_public([open_row("a", "005930", 93700.0, 10),
                        open_row("b", "000660", 12660.0, 78)],
                       meta(a=93500.0, b=12660.0))
check("16. Public이 총계 6종을 전부 노출",
      all(pub.get(k) is not None for k in
          ("investedCostBasis", "availableVirtualCash", "markedPositionsValue",
           "currentVirtualEquity", "realizedPnl", "unrealizedPnl")))
check("16b. Public 총계 = 엔진 회계 함수 결과와 완전히 동일(산식 중복 없음)",
      pub["investedCostBasis"] == val["investedCostBasis"]
      and pub["availableVirtualCash"] == val["cash"]
      and pub["markedPositionsValue"] == val["markedPositionsValue"]
      and pub["currentVirtualEquity"] == val["currentVirtualEquity"])
check("16c. 비중 합계 100%(소수 1자리 반올림 허용)",
      abs(pub["allocationInvestedPct"] + pub["allocationCashPct"] - 100.0) <= 0.1,
      f"{pub['allocationInvestedPct']}+{pub['allocationCashPct']}")
check("16d. 현금 + 평가금액 = 현재 가상자산 (Public에서도 성립)",
      abs(pub["availableVirtualCash"] + pub["markedPositionsValue"]
          - pub["currentVirtualEquity"]) < 1e-6)
check("16e. 종목당 가상 투자 기준금액 노출(‘몇 종목 더 가능’을 지어내지 않기 위한 근거값)",
      pub.get("positionSizeKrw") == 1_000_000)

# 17. Public도 시세 누락이면 fail closed
rc, pub_p = build_public([open_row("a", "005930", 93700.0, 10),
                          open_row("b", "000660", 12660.0, 78)], meta(a=93500.0))
check("17. Public — 시세 누락 시 평가금액·현재자산·비중 전부 null",
      pub_p["markedPositionsValue"] is None and pub_p["currentVirtualEquity"] is None
      and pub_p["allocationInvestedPct"] is None and pub_p["allocationCashPct"] is None)
check("17b. Public — 시세 누락이어도 투자원금·가상현금은 그대로 제공",
      abs(pub_p["investedCostBasis"] - invested) < 1e-6            # 93700×10 + 12660×78
      and abs(pub_p["availableVirtualCash"] - (10_000_000 - invested)) < 1e-6,
      f"invested={pub_p['investedCostBasis']} cash={pub_p['availableVirtualCash']}")

# ═══ 18~21. 건너뛴 신호: 정상 미진입과 시스템 문제를 섞지 않는다 ═════════════════
def skip_row(tid, status):
    return {"trade_id": tid, "environment": "LIVE_PAPER", "status": status,
            "symbol": "005930", "name": "삼성전자", "signal": "BUY"}

rc, pub_s = build_public(
    [open_row("a", "005930", 93700.0, 10),
     skip_row("s1", "SKIPPED_INSUFFICIENT_CASH"),
     skip_row("s2", "SKIPPED_INSUFFICIENT_CASH"),
     skip_row("s3", "SKIPPED_PRICE_ABOVE_POSITION_SIZE"),
     skip_row("s4", "SKIPPED_MARKET_DATA_UNAVAILABLE")],
    meta(a=93500.0))
check("18. 자금 부족 건너뜀 2건을 별도로 집계", pub_s["skippedInsufficientCash"] == 2)
check("19. 1주 가격 > 기준금액 건너뜀 1건을 별도로 집계",
      pub_s["skippedPriceAbovePositionSize"] == 1)
check("20. 시세 불가(시스템 문제) 1건을 정상 미진입과 분리 집계",
      pub_s["skippedMarketDataUnavailable"] == 1)
check("21. 건너뛴 신호가 보유 종목 수·투자원금을 오염시키지 않음",
      pub_s["openTrades"] == 1 and pub_s["investedCostBasis"] == 937000.0)

# ═══ 22~24. 위생: 내부 코드·비밀·계좌 흔적 0 ═══════════════════════════════════
blob = json.dumps(pub_s, ensure_ascii=False)
check("22. 공개 스냅샷에 내부 상태 코드(SKIPPED_*/OPEN 열거값 문자열) 미노출",
      "SKIPPED_INSUFFICIENT_CASH" not in blob
      and "SKIPPED_PRICE_ABOVE_POSITION_SIZE" not in blob
      and "SKIPPED_MARKET_DATA_UNAVAILABLE" not in blob)
low = blob.lower()
check("23. 공개 스냅샷에 Secret·토큰·계좌 흔적 0",
      not any(w in low for w in ("client_id", "client_secret", "token",
                                 "authorization", "account", "secret")))
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "paper_public.py"), encoding="utf-8").read()
check("24. paper_public이 회계를 재구현하지 않고 엔진 함수를 그대로 쓴다",
      "from paper_engine import portfolio_valuation" in src
      and "portfolio_valuation(" in src)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_portfolio: 전체 통과 (포트폴리오 총계 회계 계약)")
