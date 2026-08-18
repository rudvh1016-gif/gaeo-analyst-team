#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Trading — 국내 정규장 판정 계약 테스트 (2026-08-18 버그 회귀 방지).

배경(실제 장애)
    2026-08-18 09:35 · 10:05 · 10:35 KST — 정규장인데 엔진이 '장외 시간'으로 판정해
    신규 가상진입을 계속 보류했다. 원인은 공식 캘린더 응답에서
    today.integrated = {preMarket, regularMarket, afterMarket} 구조인데,
    엔진이 integrated 최상위에 startTime/endTime이 있다고 가정해 항상 파싱에
    실패(= 항상 장외)한 것. 당시 테스트 픽스처도 같은 잘못된 모양을 쓰고 있어
    이 버그를 잡아내지 못했다.

이 파일이 고정하는 계약
    ① 정규장 시각은 integrated.regularMarket에서만 읽는다
    ② NXT 프리마켓·애프터마켓 시간대에는 신규 진입하지 않는다
    ③ 장 시간은 하드코딩이 아니라 그날 캘린더가 준 값을 그대로 쓴다(단축장 대응)
    ④ 세션 정보가 없거나 깨졌으면 개장으로 추측하지 않는다(fail closed)
    ⑤ 정규장 판정이 고쳐져도 기존 BUY를 소급 매수하지 않는다(Forward-only)
    ⑥ 장외로 보류된 분석 배치는 소비되지 않고 다음 정규장 사이클에 재검토된다
    ⑦ 같은 배치를 두 번 처리해도 가상체결은 최대 1건(중복 0)

실행: python3 test_paper_session.py   (네트워크 0 · 실제 주문 0)
"""
import json
import os
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
DAY = "2026-08-18"


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def at(hh, mm, ss=0, day=DAY):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, ss, tzinfo=KST)


def calendar(regular=("09:00:00", "15:30:00"), *, day=DAY, open_=True,
             with_nxt=True, integrated="auto"):
    """공식 응답 모양 그대로 만든다 — integrated 안에 세션들이 들어간다."""
    if not open_:
        return {"today": {"date": day, "open": False, "integrated": None},
                "previousBusinessDay": None, "nextBusinessDay": None}
    if integrated != "auto":
        node = integrated
    else:
        node = {}
        if regular is not None:
            node["regularMarket"] = {"startTime": f"{day}T{regular[0]}+09:00",
                                     "endTime": f"{day}T{regular[1]}+09:00"}
        if with_nxt:
            node["preMarket"] = {"startTime": f"{day}T08:00:00+09:00",
                                 "endTime": f"{day}T09:00:00+09:00"}
            node["afterMarket"] = {"startTime": f"{day}T15:30:00+09:00",
                                   "endTime": f"{day}T20:00:00+09:00"}
    return {"today": {"date": day, "open": True, "integrated": node},
            "previousBusinessDay": None, "nextBusinessDay": None}


def provider(cal, price=70_000, day=DAY):
    ts = f"{day}T10:00:00+09:00"
    return pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": price, "timestamp": ts}},
        orderbooks={"005930": {"bestAsk": price, "bestBid": price - 10, "timestamp": ts}},
        calendar=cal)


def bundle(calls, at_iso, model="baseline-risk-v2"):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at_iso, "modelVersion": model}


def engine(cal, tmp, price=70_000):
    return pe.PaperEngine(provider(cal, price), data_dir=tmp, config=CFG, environment="TEST")


def session_open(cal, now):
    """엔진이 실제로 쓰는 경로 그대로 판정한다(직접 _in_session을 부르지 않는다)."""
    tmp = tempfile.mkdtemp(prefix="ps_")
    try:
        eng = engine(cal, tmp)
        # baseline 먼저 잡고(진입 경로 미사용), 그 다음 새 배치로 진입 여부를 본다
        eng.run_cycle(bundle({"005930": "HOLD"}, f"{DAY}T08:00:00+09:00"), now=now)
        res = eng.run_cycle(bundle({"005930": "BUY"}, f"{DAY}T08:30:00+09:00"), now=now)
        return "장외" not in res and "정규장 시간 정보 없음" not in res, res
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


# ── ① 정규장 경계 시각 ───────────────────────────────────────────────────────
CAL = calendar()
for hh, mm, ss, expect in [(8, 59, 59, False), (9, 0, 0, True), (9, 5, 0, True),
                           (9, 35, 0, True), (10, 5, 0, True), (10, 35, 0, True),
                           (12, 0, 0, True), (15, 20, 0, True), (15, 29, 59, True),
                           (15, 30, 0, True), (15, 30, 1, False), (16, 0, 0, False)]:
    got, res = session_open(CAL, at(hh, mm, ss))
    check(f"① {hh:02d}:{mm:02d}:{ss:02d} → {'정규장' if expect else '장외'}", got is expect, res)

# ── ② NXT 프리·애프터마켓에는 진입하지 않는다 ────────────────────────────────
got, res = session_open(CAL, at(8, 30))
check("② 프리마켓(08:30) 신규 진입 금지", got is False, res)
got, res = session_open(CAL, at(9, 35))
check("② 정규장(09:35) 신규 진입 가능", got is True, res)
got, res = session_open(CAL, at(16, 0))
check("② 애프터마켓(16:00) 신규 진입 금지", got is False, res)

# ── ③ 단축장 — 09:00~15:30을 하드코딩하지 않는다 ─────────────────────────────
SHORT = calendar(("10:00:00", "14:00:00"), with_nxt=False)
for hh, mm, expect in [(9, 30, False), (10, 30, True), (13, 59, True), (14, 1, False)]:
    got, res = session_open(SHORT, at(hh, mm))
    check(f"③ 단축장 10:00~14:00 · {hh:02d}:{mm:02d} → {'정규장' if expect else '장외'}",
          got is expect, res)

# ── ④ 세션 정보가 없거나 깨졌으면 fail closed ────────────────────────────────
cases = [
    ("integrated 자체가 없음", calendar(integrated={})),
    ("regularMarket 없음", calendar(regular=None)),
    ("startTime 누락", calendar(integrated={"regularMarket": {"endTime": f"{DAY}T15:30:00+09:00"}})),
    ("endTime 누락", calendar(integrated={"regularMarket": {"startTime": f"{DAY}T09:00:00+09:00"}})),
    ("잘못된 타임스탬프", calendar(integrated={"regularMarket": {"startTime": "not-a-time",
                                                          "endTime": "nope"}})),
    ("정규장이 아니라 프리마켓만 있음",
     calendar(integrated={"preMarket": {"startTime": f"{DAY}T08:00:00+09:00",
                                        "endTime": f"{DAY}T09:00:00+09:00"}})),
]
for label, cal in cases:
    got, res = session_open(cal, at(10, 5))
    check(f"④ {label} → 개장으로 추측하지 않음(fail closed)", got is False, res)
    if label != "integrated 자체가 없음":
        pass
# 세션을 못 읽은 경우는 조용한 '장외'가 아니라 원인이 드러나는 문구로 남긴다
_, res = session_open(calendar(regular=None), at(10, 5))
check("④ 세션 미확인은 '장외'와 구분해 기록", "정규장 시간 정보 없음" in res, res)

# ── ⑤ 휴장일 ────────────────────────────────────────────────────────────────
# 휴장은 세션 판정 이전 단계에서 걸린다 — 결과 문구가 '장외'가 아니라 HOLIDAY다.
_tmp = tempfile.mkdtemp(prefix="ps_")
try:
    _eng = engine(calendar(open_=False), _tmp)
    _eng.run_cycle(bundle({"005930": "HOLD"}, f"{DAY}T08:00:00+09:00"), now=at(10, 5))
    _res = _eng.run_cycle(bundle({"005930": "BUY"}, f"{DAY}T09:40:00+09:00"), now=at(10, 5))
    _sum = os.path.join(_tmp, "summary.json")
    _cnt = (json.load(open(_sum, encoding="utf-8")).get("executedTradeCount", 0)
            if os.path.exists(_sum) else 0)
    check("⑤ 휴장일 → HOLIDAY로 종료하고 거래 0", "HOLIDAY" in _res and _cnt == 0, _res)
finally:
    shutil.rmtree(_tmp, ignore_errors=True)

# ── ⑥ 타임존 — +09:00을 정확히 비교한다 ─────────────────────────────────────
UTC_NOW = datetime(2026, 8, 18, 1, 5, tzinfo=timezone.utc)   # = 10:05 KST
got, res = session_open(CAL, UTC_NOW)
check("⑥ UTC로 들어온 같은 순간(10:05 KST)도 정규장으로 판정", got is True, res)

# ── ⑦ 정규장이어도 BUY 전환 규칙은 그대로 (소급매수 0) ──────────────────────
def entry_count(prev_call, new_call, now=at(10, 5)):
    tmp = tempfile.mkdtemp(prefix="ps_")
    try:
        eng = engine(CAL, tmp)
        eng.run_cycle(bundle({"005930": prev_call}, f"{DAY}T09:10:00+09:00"), now=now)
        eng.run_cycle(bundle({"005930": new_call}, f"{DAY}T09:40:00+09:00"), now=now)
        s = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
        return s.get("executedTradeCount", 0)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


check("⑦ HOLD → BUY = 신규 진입", entry_count("HOLD", "BUY") == 1)
check("⑦ SELL → BUY = 신규 진입", entry_count("SELL", "BUY") == 1)
check("⑦ BUY → BUY = 소급 매수 없음", entry_count("BUY", "BUY") == 0)
check("⑦ HOLD → HOLD = 진입 없음", entry_count("HOLD", "HOLD") == 0)

# ── ⑧ 장외 보류 배치는 소비되지 않고 다음 정규장 사이클에 재검토된다 ────────
tmp = tempfile.mkdtemp(prefix="ps_")
try:
    eng = engine(CAL, tmp)
    eng.run_cycle(bundle({"005930": "HOLD"}, f"{DAY}T07:50:00+09:00"), now=at(7, 50))
    batch = f"{DAY}T08:20:00+09:00"
    res_pre = eng.run_cycle(bundle({"005930": "BUY"}, batch), now=at(8, 30))   # 프리마켓 시간
    st = json.load(open(os.path.join(tmp, "state.json"), encoding="utf-8"))
    check("⑧ 장외에서는 진입 보류", "장외" in res_pre, res_pre)
    check("⑧ 보류된 배치를 소비하지 않음", st.get("lastProcessedAnalysisAt") != batch)
    res_open = eng.run_cycle(bundle({"005930": "BUY"}, batch), now=at(9, 35))  # 정규장
    s = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
    check("⑧ 다음 정규장 사이클에서 같은 배치가 재검토되어 진입",
          s.get("executedTradeCount") == 1, res_open)
    # ⑨ 같은 배치를 또 처리해도 중복 체결 0
    eng.run_cycle(bundle({"005930": "BUY"}, batch), now=at(10, 5))
    s2 = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
    check("⑨ 같은 배치 재실행 → 중복 가상체결 0", s2.get("executedTradeCount") == 1)
finally:
    shutil.rmtree(tmp, ignore_errors=True)

# ── ⑩ 실제 주문·계좌 경로는 여전히 0 ────────────────────────────────────────
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "paper_engine.py"),
           encoding="utf-8").read()
for banned in ("/api/v1/orders", "conditional-orders", "/api/v1/accounts", "/api/v1/holdings",
               "X-Tossinvest-Account", "place_order", "cancel_order"):
    check(f"⑩ 엔진에 {banned} 없음", banned not in src)
check("⑩ 정규장 판정은 캘린더 값만 쓴다(장 시간 하드코딩 없음)",
      "09:00" not in src and "15:30" not in src)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print(f"test_paper_session: 전체 통과 (정규장 판정 계약 {40 - len(FAILURES)}+건)")
