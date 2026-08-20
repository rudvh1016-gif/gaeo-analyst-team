#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Momentum V1 — 두 번째 전략이 기존 전략을 오염시키지 않는가.

이 파일이 지키는 계약(전부 실패하면 배포하면 안 되는 것들):
  ⛔ 기본은 꺼져 있다. 환경변수 없이는 파일 하나도 만들지 않는다.
  ⛔ 원장이 분리된다. environment·폴더가 달라 V1 기록과 섞이지 않는다.
  ⛔ 진입은 rotation_picks에서만 온다. GAEO Score의 BUY 전환은 진입 사유가 아니다.
  ⛔ 체결 로직을 다시 구현하지 않는다(부모 것을 그대로 쓴다).
  ⛔ 공개 화면에 이 기록이 새지 않는다.
"""
import json
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd
import paper_momentum as pm

KST = timezone(timedelta(hours=9))
FAILURES = []

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


D1, D2, D3, D4 = "2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"
SYMS = ["475830", "241710", "181710", "196170"]


def calendar_open(day):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    return {"today": {"date": day, "open": True,
                      "integrated": {"regularMarket": regular}},
            "previousBusinessDay": None, "nextBusinessDay": None}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def provider_for(day, price=10_000):
    return pmd.FixtureMarketDataProvider(
        prices={s: {"price": price, "timestamp": f"{day}T10:00:00+09:00"} for s in SYMS},
        orderbooks={s: {"bestAsk": price, "bestBid": price - 10,
                        "timestamp": f"{day}T10:00:00+09:00"} for s in SYMS},
        calendar=calendar_open(day))


def picks_file(tmp, codes, generated=None):
    p = os.path.join(tmp, "rotation_picks.js")
    body = {"schemaVersion": 1, "status": "ready" if codes else "hold",
            # 신선도 게이트가 보는 값 — 기본은 테스트가 도는 날(D1)로 맞춘다.
            "generatedAt": f"{generated or D1} 10:00",
            "picks": [{"code": c, "name": f"종목{c}", "sector": "테스트"} for c in codes]}
    with open(p, "w", encoding="utf-8") as f:
        f.write("window.ROTATION_PICKS = " + json.dumps(body, ensure_ascii=False) + ";\n")
    return p


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at}


def engine(tmp, day, picks_path, price=10_000):
    """모멘텀 엔진 — 픽스처 시세 + 임시 폴더. environment는 TEST 계열로 격리."""
    eng = pm.MomentumEngine(provider_for(day, price), data_dir=tmp,
                            environment="TEST_MOMENTUM")
    eng._picks_path = picks_path
    return eng


# rotation_picks 경로를 픽스처로 바꾼다(저장소 실파일을 읽지 않게).
_orig_load = pm.load_rotation_picks
_picks_path_holder = {"p": None}
pm.load_rotation_picks = lambda path=None: _orig_load(_picks_path_holder["p"])


def ledger_rows(tmp):
    p = os.path.join(tmp, "trades.jsonl")
    if not os.path.exists(p):
        return []
    return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]


# ── 1. 기본 OFF ──────────────────────────────────────────────────────────────
off_dir = tempfile.mkdtemp(prefix="mom_off_")
saved_env = os.environ.pop(pm.ENABLE_ENV, None)
saved_dir = pm.DATA_DIR
pm.DATA_DIR = off_dir
rc = pm.run_safe()
check("1. 환경변수가 없으면 아무 것도 하지 않는다(exit 0)", rc == 0)
check("1-1. 꺼져 있으면 파일을 하나도 만들지 않는다",
      os.listdir(off_dir) == [], str(os.listdir(off_dir)))
pm.DATA_DIR = saved_dir
if saved_env is not None:
    os.environ[pm.ENABLE_ENV] = saved_env

# ── 2. 진입은 rotation_picks에서만 온다 ──────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="mom_")
_picks_path_holder["p"] = picks_file(tmp, SYMS[:2])       # 후보 2종목
e = engine(tmp, D1, _picks_path_holder["p"])
# baseline: GAEO Score는 전 종목 BUY지만, 그것만으로는 진입하지 않는다
e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
opens0 = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("2. 첫 사이클은 기준 상태만 기록하고 거래하지 않는다", not opens0, str(len(opens0)))

e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
opens = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
bought = sorted(r["symbol"] for r in opens)
check("3. 업종 흐름 후보만 산다(GAEO BUY 4종목 중 후보 2종목만)",
      bought == sorted(SYMS[:2]), str(bought))
check("3-1. 체결가는 부모와 같은 규칙(실측 Best Ask)",
      all(r.get("entry_method") == "BEST_ASK" and r.get("entry_price") == 10_000
          for r in opens), str([(r.get("entry_method"), r.get("entry_price")) for r in opens]))
check("3-2. 전략 버전이 V1과 다르다",
      all(r.get("strategy_version") == pm.STRATEGY_VERSION for r in opens))
check("3-3. environment가 V1과 다르다(원장이 섞이지 않는다)",
      all(r.get("environment") == "TEST_MOMENTUM" for r in opens)
      and pm.ENVIRONMENT != pe.ENVIRONMENT)

# ── 4. 이미 보유한 종목은 다시 사지 않는다 ───────────────────────────────────
e.run_cycle(bundle({s: "HOLD" for s in SYMS}, f"{D1}T11:05:00+09:00"), now=t(D1, 11, 10))
opens2 = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("4. 같은 후보가 계속 있어도 중복 진입하지 않는다",
      len({r["symbol"] for r in opens2}) == 2 and len(opens2) == 2, str(len(opens2)))

# ── 5. 후보가 늘면 새 종목만 담는다 ──────────────────────────────────────────
_picks_path_holder["p"] = picks_file(tmp, SYMS)           # 4종목으로 확대
e.run_cycle(bundle({s: "HOLD" for s in SYMS}, f"{D1}T12:05:00+09:00"), now=t(D1, 12, 10))
opens3 = {r["symbol"] for r in ledger_rows(tmp) if r.get("status") == "OPEN"}
check("5. 새로 들어온 후보만 추가로 담는다", opens3 == set(SYMS), str(sorted(opens3)))

# ── 6. 보유 3거래일이면 청산한다(V1의 5거래일이 아니다) ──────────────────────
check("6. 최대 보유기간이 3거래일로 설정된다",
      e.config["maxHoldingTradingDays"] == pm.MAX_HOLDING_TRADING_DAYS == 3)
tmp2 = tempfile.mkdtemp(prefix="mom_hold_")
_picks_path_holder["p"] = picks_file(tmp2, SYMS[:1])
e2 = engine(tmp2, D1, _picks_path_holder["p"])
e2.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
e2.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
for i, day in enumerate((D2, D3, D4)):
    e2.provider = provider_for(day, 10_500)
    e2.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{day}T10:05:00+09:00"), now=t(day, 10, 10))
closed = [r for r in ledger_rows(tmp2) if r.get("status") == "CLOSED"]
check("6-1. 3거래일이 지나면 자동 청산된다",
      len(closed) == 1 and closed[0].get("exit_reason") == "MAX_HOLDING_5D",
      str([(r.get("exit_reason"), r.get("holding_trading_days")) for r in closed]))
check("6-2. 보유일이 3으로 기록된다",
      bool(closed) and closed[0].get("holding_trading_days") == 3,
      str(closed[0].get("holding_trading_days")) if closed else "청산 없음")

# ── 7. GAEO 판단이 매도로 바뀌면 조기 청산(안전판) ───────────────────────────
tmp3 = tempfile.mkdtemp(prefix="mom_sell_")
_picks_path_holder["p"] = picks_file(tmp3, SYMS[:1])
e3 = engine(tmp3, D1, _picks_path_holder["p"])
e3.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
e3.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
e3.run_cycle(bundle({SYMS[0]: "SELL"}, f"{D1}T11:05:00+09:00"), now=t(D1, 11, 10))
c3 = [r for r in ledger_rows(tmp3) if r.get("status") == "CLOSED"]
check("7. GAEO 판단이 매도로 바뀌면 3거래일 전이라도 청산한다",
      len(c3) == 1 and c3[0].get("exit_reason") == "CHIEF_SELL",
      str([r.get("exit_reason") for r in c3]))

# ── 8. 후보가 없으면 아무 것도 사지 않는다 ───────────────────────────────────
tmp4 = tempfile.mkdtemp(prefix="mom_none_")
_picks_path_holder["p"] = picks_file(tmp4, [])
e4 = engine(tmp4, D1, _picks_path_holder["p"])
e4.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
r4 = e4.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
check("8. 시장 게이트가 관망이면(후보 0) 아무 것도 사지 않는다",
      not [r for r in ledger_rows(tmp4) if r.get("status") == "OPEN"], r4)
check("8-1. 그 사유를 기록에 남긴다", "후보 없음" in r4, r4)

# 파일이 깨져 있어도 후보를 지어내지 않는다
broken = os.path.join(tmp4, "broken.js")
open(broken, "w", encoding="utf-8").write("window.ROTATION_PICKS = {깨진;\n")
check("8-2. 후보 파일이 깨졌으면 빈 목록을 돌려준다(추측 금지)",
      _orig_load(broken)["picks"] == [])
check("8-3. 후보 파일이 없으면 빈 목록을 돌려준다",
      _orig_load(os.path.join(tmp4, "없는파일.js"))["picks"] == [])

# ── 9. V1을 건드리지 않았다 ──────────────────────────────────────────────────
src = open(os.path.join(pe.HERE, "paper_momentum.py"), encoding="utf-8").read()
check("9. 체결 로직을 다시 구현하지 않는다(부모 호출로 재사용)",
      "super()._process_entries" in src)
check("9-1. V1 원장 경로를 쓰지 않는다",
      "paper_trading/momentum" in pm.DATA_DIR.replace("\\", "/"))
check("9-2. 공개 화면은 V1 기록만 읽는다(모멘텀 기록이 새지 않는다)",
      '"LIVE_PAPER"' in open(os.path.join(pe.HERE, "paper_public.py"), encoding="utf-8").read())

# ── 9-3. 사자마자 되파는 자멸 매수 금지 (검수 M1) ────────────────────────────
# rotation 후보인데 GAEO 판단이 이미 「매도 고려」면, 사는 즉시 같은 사이클 ④단계가
# CHIEF_SELL로 되판다 → 호가 차이만큼 확정 손실 + 보유 0일짜리 거래가 원장에 남는다.
tmp5 = tempfile.mkdtemp(prefix="mom_selfsell_")
_picks_path_holder["p"] = picks_file(tmp5, SYMS[:2])
e5 = engine(tmp5, D1, _picks_path_holder["p"])
e5.run_cycle(bundle({s: "HOLD" for s in SYMS}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
# 후보 2개 중 첫 번째만 GAEO가 매도로 본다
e5.run_cycle(bundle({SYMS[0]: "SELL", SYMS[1]: "HOLD"}, f"{D1}T10:05:00+09:00"),
             now=t(D1, 10, 10))
rows5 = ledger_rows(tmp5)
check("9-3. GAEO가 「매도 고려」로 본 후보는 아예 사지 않는다",
      all(r.get("symbol") != SYMS[0] for r in rows5), str([r.get("symbol") for r in rows5]))
check("9-4. 나머지 후보는 정상 매수된다",
      any(r.get("symbol") == SYMS[1] and r.get("status") == "OPEN" for r in rows5))
check("9-5. 보유 0일짜리 즉시 청산 기록이 생기지 않는다",
      not [r for r in rows5 if r.get("status") == "CLOSED"
           and r.get("holding_trading_days") == 0],
      str([(r.get("symbol"), r.get("status")) for r in rows5]))

# ── 9-6. 낡은 후보 목록으로는 사지 않는다 (추측 금지) ────────────────────────
tmp6 = tempfile.mkdtemp(prefix="mom_stale_")
_picks_path_holder["p"] = picks_file(tmp6, SYMS[:1], generated="2026-08-11")  # 일주일 전
e6 = engine(tmp6, D1, _picks_path_holder["p"])
e6.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
r6 = e6.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
check("9-6. 후보 목록이 오늘 것이 아니면 사지 않는다",
      not [r for r in ledger_rows(tmp6) if r.get("status") == "OPEN"], r6)
check("9-7. 그 사유를 기록에 남긴다", "오늘 것이 아님" in r6, r6)

# ── 10. 검수에서 잡힌 회귀 (2026-08-21) ──────────────────────────────────────
# 프로덕션 첫 실행 조건은 "원장 폴더가 아직 없음"이다. 위 테스트들은 mkdtemp()가
# 미리 만들어 둔 폴더를 data_dir로 넘겨 이 경로를 통과해 버렸다. 실제로는 baseline
# 기록이 FileNotFoundError로 죽고 run_safe가 그걸 삼켜서, 스위치를 켜도 매 사이클
# 조용히 아무 일도 일어나지 않았다. 그 조건을 그대로 재현한다.
fresh_base = tempfile.mkdtemp(prefix="mom_fresh_")
fresh_dir = os.path.join(fresh_base, "momentum")      # 일부러 만들지 않는다
_picks_path_holder["p"] = picks_file(fresh_base, SYMS[:1])
check("10. 시작 시점에 폴더가 없다(프로덕션 첫 실행과 같은 조건)",
      not os.path.isdir(fresh_dir))
e10 = pm.MomentumEngine(provider_for(D1), data_dir=fresh_dir, environment="TEST_MOMENTUM")
r10 = e10.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
check("10-1. 폴더가 없어도 첫 사이클이 성공한다", r10.startswith("BASELINE_CAPTURED"), r10)
check("10-2. 필요한 파일이 실제로 만들어진다",
      os.path.exists(os.path.join(fresh_dir, "equity_curve.jsonl"))
      and os.path.exists(os.path.join(fresh_dir, "state.json")),
      str(sorted(os.listdir(fresh_dir))) if os.path.isdir(fresh_dir) else "폴더 없음")
r10b = e10.run_cycle(bundle({SYMS[0]: "HOLD"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
check("10-3. 이어지는 사이클도 정상", r10b.startswith("CYCLE_OK"), r10b)

# data_dir을 빠뜨리면 부모 기본값(V1 폴더)으로 떨어져 원장이 섞일 수 있었다.
_saved_data_dir = pm.DATA_DIR
pm.DATA_DIR = os.path.join(fresh_base, "default_check")
e11 = pm.MomentumEngine(provider_for(D1), environment="TEST_MOMENTUM")
check("11. data_dir을 안 넘겨도 V1 원장 폴더를 쓰지 않는다",
      e11.dir == pm.DATA_DIR and e11.dir != pe.DEFAULT_DIR, str(e11.dir))
pm.DATA_DIR = _saved_data_dir

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_momentum: 전체 통과")
