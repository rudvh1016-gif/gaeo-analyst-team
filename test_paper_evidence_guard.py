#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모의투자 표본 게이트 계약 — 표본이 부족하면 성과 결론 숫자가 절대 새지 않는다.

왜 이 테스트가 있나
    승률·평균수익률 같은 "성과 결론" 숫자는 청산 표본이 충분할 때만 의미가 있다.
    표본 2건짜리 승률 50%가 화면이나 외부 스크립트로 나가면, 그 숫자 하나만 보고
    "이 모델은 승률 50%"라는 결론이 만들어진다. evidence 라벨(INSUFFICIENT_EVIDENCE)은
    사람이 읽으라고 붙인 것이지 기계가 지키는 계약이 아니었다.

이 파일이 고정하는 계약
    ① paper_engine: 청산 표본 < MIN_CLOSED_FOR_EVIDENCE 이면
       winRatePct · avgReturnPct · medianReturnPct · avgWinPct · avgLossPct ·
       profitFactor · expectancyPct 가 전부 null이고 evidence가 INSUFFICIENT로 시작.
    ② 표본이 최소치를 넘으면 같은 필드가 실제 숫자로 나온다(과잉 차단이 아님을 확인).
    ③ paper_public: summary.json이 표본 부족인데도 숫자를 들고 있어도,
       공개 스냅샷(paper_public.js)에는 null로만 나가고 evidenceStatus는 INSUFFICIENT.

전부 offline fixture(environment=TEST)다. 네트워크·Toss API를 쓰지 않는다.
"""
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timedelta

import paper_engine as pe
import paper_public as pp

FAILURES = []
CFG = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
       "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}
GATED = ("winRatePct", "avgReturnPct", "medianReturnPct", "avgWinPct",
         "avgLossPct", "profitFactor", "expectancyPct")


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def closed_trade(i, ret, day=None):
    """청산 완료된 가상 거래 한 건(승/패는 ret 부호로).

    day를 주지 않으면 거래마다 서로 다른 진입일을 준다 — 게이트의 '판단일' 조건을
    통과시키기 위한 기본값이다. 같은 날 무더기 진입을 재현하려면 day를 고정한다.
    """
    entry = 10_000
    d = day or (datetime(2026, 8, 18) + timedelta(days=i)).strftime("%Y-%m-%d")
    return {"trade_id": f"c{i}", "environment": "TEST", "status": "CLOSED",
            "symbol": f"{i:06d}", "name": f"종목{i}", "market": "KOSPI",
            "signal": "BUY", "entry_price": entry, "quantity": 100,
            "exit_price": round(entry * (1 + ret / 100)),
            "exit_reason": "MAX_HOLDING_5D", "gross_return_pct": ret,
            "holding_trading_days": 5,
            "entry_business_date": d, "exit_business_date": "2026-09-30",
            "detected_at": f"{d}T10:10:00+09:00",
            "exit_at": "2026-09-30T10:10:00+09:00"}


def build_summary(n_closed, same_day=False):
    """청산 n건짜리 원장을 만들고 엔진이 쓰는 summary.json을 그대로 돌려준다.

    same_day=True면 전부 같은 날 진입한 것으로 만든다(실제 계좌에서 자리 10칸이
    한 덩어리로 움직이는 상황을 재현).
    """
    tmp = tempfile.mkdtemp(prefix="pev_")
    try:
        with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
            for i in range(n_closed):
                # 승/패를 섞어야 avgWinPct·avgLossPct·profitFactor가 실제로 계산된다.
                ret = 2.0 if i % 2 == 0 else -1.0
                day = "2026-08-18" if same_day else None
                f.write(json.dumps(closed_trade(i, ret, day), ensure_ascii=False) + "\n")
        eng = pe.PaperEngine(None, data_dir=tmp, config=CFG, environment="TEST")
        eng._write_summary()
        return json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


MIN = pe.MIN_CLOSED_FOR_EVIDENCE
check("최소 표본 기준이 상수로 노출돼 있다", isinstance(MIN, int) and MIN >= 2, str(MIN))

# ── ① 표본 부족: 결론 필드 전부 null ──────────────────────────────────────
scarce = build_summary(MIN - 1)
check("표본 부족 — maturedTrades가 최소치 미만", scarce["maturedTrades"] == MIN - 1)
check("표본 부족 — evidence가 INSUFFICIENT로 시작",
      str(scarce["evidence"]).startswith("INSUFFICIENT"), str(scarce["evidence"]))
leaked = {k: scarce.get(k) for k in GATED if scarce.get(k) is not None}
check("표본 부족 — 성과 결론 필드 7개가 전부 null", not leaked, str(leaked))
check("표본 부족 — 필드 자체는 사라지지 않는다(스키마 유지)",
      all(k in scarce for k in GATED))
# 표본과 무관한 사실(건수)까지 지우면 안 된다 — 게이트는 '결론'에만 건다.
check("표본 부족 — 건수·평가 계열은 그대로 살아 있다",
      scarce["openTrades"] == 0 and scarce["totalForwardSignals"] == MIN - 1
      and scarce["initialVirtualCash"] == 10_000_000)

# ── ② 표본 충족: 같은 필드가 숫자로 나온다(과잉 차단 방지) ─────────────────
ok = build_summary(max(MIN, pe.MIN_ENTRY_DAYS_FOR_EVIDENCE))
check("표본 충족 — evidence가 SAMPLE_OK", ok["evidence"] == "SAMPLE_OK", str(ok["evidence"]))
missing = [k for k in GATED if ok.get(k) is None]
check("표본 충족 — 성과 결론 필드가 실제 숫자로 계산된다", not missing, str(missing))

# ── ②-2 건수는 찼지만 판단일이 하루뿐이면 여전히 막는다 (2026-08-21 신설) ──
# 이 계좌는 1,000만원을 종목당 100만원으로 나눠 자리가 10칸이라, 열 종목이 한 덩어리로
# 들어갔다 한 덩어리로 나온다. 그래서 "청산 20건"은 쉽게 채워지지만 그 20건의 판단일은
# 2일뿐일 수 있다. 같은 사이트의 성적표는 정확히 그런 숫자를 거부하므로, 여기서도 막는다.
MIN_DAYS = pe.MIN_ENTRY_DAYS_FOR_EVIDENCE
check("판단일 기준이 상수로 노출돼 있다", isinstance(MIN_DAYS, int) and MIN_DAYS >= 2, str(MIN_DAYS))
lumped = build_summary(max(MIN, MIN_DAYS), same_day=True)
check("건수는 찼는데 판단일 1일 — 건수는 사실대로 센다",
      lumped["maturedTrades"] >= MIN and lumped["closedEntryDays"] == 1,
      f'건수 {lumped["maturedTrades"]} / 판단일 {lumped["closedEntryDays"]}')
check("건수는 찼는데 판단일 1일 — evidence가 INSUFFICIENT",
      str(lumped["evidence"]).startswith("INSUFFICIENT"), str(lumped["evidence"]))
check("건수는 찼는데 판단일 1일 — 무엇이 모자란지 문장에 적는다",
      "판단일" in str(lumped["evidence"]), str(lumped["evidence"]))
lumped_leak = {k: lumped.get(k) for k in GATED if lumped.get(k) is not None}
check("건수는 찼는데 판단일 1일 — 성과 결론이 새지 않는다", not lumped_leak, str(lumped_leak))
check("표본 진행 상황을 숫자로 내보낸다(화면이 사유를 설명할 근거)",
      lumped.get("minClosedForEvidence") == MIN
      and lumped.get("minEntryDaysForEvidence") == MIN_DAYS)
check("표본 충족 — 승률이 실제 승패 비율과 일치",
      abs(ok["winRatePct"] - (MIN + 1) // 2 / MIN * 100) < 0.11, str(ok["winRatePct"]))

# ── ③ 공개 스냅샷: 오염된 summary.json이 와도 숫자를 내보내지 않는다 ────────
tmp = tempfile.mkdtemp(prefix="pevpub_")
orig_dir, orig_out = pp.DIR, pp.OUT
pp.DIR = tmp
pp.OUT = os.path.join(tmp, "paper_public.js")
try:
    with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
        for i in range(2):
            row = closed_trade(i, 3.0)
            row["environment"] = "LIVE_PAPER"
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    # 표본은 2건인데 요약에는 결론 숫자가 그대로 박혀 있는 최악의 상태를 만든다.
    json.dump({"evidence": "INSUFFICIENT_EVIDENCE — 표본이 적어 성과 결론 금지",
               "winRatePct": 100.0, "avgReturnPct": 3.0, "medianReturnPct": 3.0,
               "avgWinPct": 3.0, "avgLossPct": -1.0, "skippedSignals": 0},
              open(os.path.join(tmp, "summary.json"), "w"))
    json.dump({"baselineCaptured": True, "engineStartedAt": "2026-08-18T09:10:00+09:00",
               "lastCycleAt": "2026-08-25T10:10:00+09:00", "lastCycleResult": "CYCLE_OK"},
              open(os.path.join(tmp, "state.json"), "w"))
    json.dump({"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
               "forwardStart": "2026-08-18"}, open(os.path.join(tmp, "config.json"), "w"))

    rc = pp.build()
    payload = json.loads(open(pp.OUT, encoding="utf-8").read().split("=", 1)[1].strip().rstrip(";"))
    check("공개 스냅샷 생성 성공", rc == 0)
    check("공개 — evidenceStatus가 INSUFFICIENT로 시작",
          str(payload["evidenceStatus"]).startswith("INSUFFICIENT"))
    pub_leaked = {k: payload.get(k)
                  for k in ("winRatePct", "avgReturnPct", "medianReturnPct",
                            "avgWinPct", "avgLossPct")
                  if payload.get(k) is not None}
    check("공개 — 요약이 오염돼 있어도 결론 숫자는 null", not pub_leaked, str(pub_leaked))
    check("공개 — 거래 건수 같은 사실은 계속 공개된다", payload["closedTrades"] == 2)
finally:
    pp.DIR, pp.OUT = orig_dir, orig_out
    shutil.rmtree(tmp, ignore_errors=True)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_evidence_guard: 전체 통과")
