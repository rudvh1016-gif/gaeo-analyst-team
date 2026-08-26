#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모의투자 안전 경계 — 실주문 0 · 계좌 API 0 · Secret 0 · Production 무영향.

V1(paper_engine) · Shadow(paper_smart_v2) · 두 번째 전략(paper_momentum)을 한꺼번에
검사한다. 새 전략을 추가할 때 이 경계가 조용히 넓어지는 것을 막는 계약이다.
"""
import hashlib
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
import paper_momentum as pm
import paper_public
import paper_smart_v2 as sv

KST = timezone(timedelta(hours=9))
HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []
PAPER_MODULES = ("paper_engine.py", "paper_market_data.py", "paper_smart_v2.py",
                 "paper_momentum.py", "paper_public.py", "paper_history.py",
                 "paper_report.py")


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


src_all = "".join(open(os.path.join(HERE, f), encoding="utf-8").read()
                  for f in PAPER_MODULES)

# ═══ ① 실주문·계좌 API 0 ═════════════════════════════════════════════════════
FORBIDDEN_PATHS = ("/api/v1/orders", "conditional-order", "/api/v1/holdings",
                   "/api/v1/accounts", "/api/v1/buying-power",
                   "/api/v1/sellable-quantity", "/api/v1/commissions")
check("1a. 모의투자 모듈 전체에 주문·계좌 endpoint 문자열 0",
      not [p for p in FORBIDDEN_PATHS if f'"{p}"' in src_all],
      str([p for p in FORBIDDEN_PATHS if f'"{p}"' in src_all]))
FORBIDDEN_FNS = ("place_order", "buy_stock", "sell_stock", "create_conditional_order",
                 "cancel_order", "modify_order", "get_holdings", "get_balance",
                 "get_account")
check("1b. 실주문·계좌 조회 함수 이름 0",
      not [f for f in FORBIDDEN_FNS if f in src_all],
      str([f for f in FORBIDDEN_FNS if f in src_all]))
# 고정 대조군 — 허용 경로가 하나라도 늘거나 바뀌면 이 테스트가 깨져야 한다.
# (자기참조로 "허용 목록에 있으니 허용"이라고 확인하면 아무 것도 막지 못한다)
EXPECTED_ALLOWED = {"/api/v1/market-calendar/KR", "/api/v1/orderbook", "/api/v1/prices",
                    "/api/v1/stocks", "/api/v1/trades", "/oauth2/token"}
check("1c. 허용 경로 목록이 Market Data 6개 그대로다(경계 확장 0)",
      set(pmd.ALLOWED_PATHS) == EXPECTED_ALLOWED,
      str(sorted(set(pmd.ALLOWED_PATHS) ^ EXPECTED_ALLOWED)))
check("1c2. 허용 경로에 주문·계좌 경로가 하나도 없다",
      not (set(pmd.ALLOWED_PATHS) & set(FORBIDDEN_PATHS)))
for bad in ("/api/v1/orders", "/api/v1/accounts"):
    try:
        pmd.TossMarketDataProvider()._guard(bad)
        check(f"1d. 금지 경로 {bad} 호출 시 즉시 예외", False)
    except pmd.PaperSafetyError:
        check(f"1d. 금지 경로 {bad} 호출 시 즉시 예외", True)
check("1e. 새 전략(Smart V2)이 시세 공급자를 직접 확장하지 않는다",
      "class TossMarketDataProvider" not in open(
          os.path.join(HERE, "paper_smart_v2.py"), encoding="utf-8").read())

# ═══ ② Production 파일 무변경 — 사이클을 돌려도 한 바이트도 안 바뀐다 ════════
PRODUCTION_FILES = ("analyze_auto.py", "auto_analysis.js", "analysis.js", "history.js",
                    "data.js", "team_weights.js", "model_intelligence.js",
                    "market_history.js", "krx_list.json", "tickers.js",
                    "build_model_scoreboard.py", "model_registry.py")


def snapshot():
    out = {}
    for f in PRODUCTION_FILES:
        p = os.path.join(HERE, f)
        if os.path.exists(p):
            out[f] = hashlib.sha256(open(p, "rb").read()).hexdigest()
    # 실제 Forward 원장도 함께 잠근다(테스트가 진짜 기록을 건드리면 즉시 드러난다)
    for f in ("trades.jsonl", "state.json", "summary.json", "equity_curve.jsonl"):
        p = os.path.join(HERE, "paper_trading", f)
        if os.path.exists(p):
            out["paper_trading/" + f] = hashlib.sha256(open(p, "rb").read()).hexdigest()
    return out


def cal(day):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    return {"today": {"date": day, "open": True,
                      "integrated": {"regularMarket": regular}},
            "previousBusinessDay": None, "nextBusinessDay": None}


def provider(day):
    return pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": 10_000, "timestamp": f"{day}T10:00:00+09:00"}},
        orderbooks={"005930": {"bestAsk": 10_000, "bestBid": 9_990,
                               "timestamp": f"{day}T10:00:00+09:00"}},
        calendar=cal(day))


def bundle(call, at):
    return {"signals": {"005930": {"call": call, "confidence": 70, "total": 60,
                                   "name": "삼성전자"}},
            "analysisCompletedAt": at}


DAY = "2026-09-01"
before = snapshot()
tmp1 = tempfile.mkdtemp(prefix="sfb1_")
tmp2 = tempfile.mkdtemp(prefix="sfb2_")
buf = io.StringIO()
os.environ[pmd.CLIENT_ID_ENV] = "c_FAKE_ID_FOR_TEST_0001"
os.environ[pmd.CLIENT_SECRET_ENV] = "FAKE_SECRET_FOR_TEST_0002"
try:
    with redirect_stdout(buf):
        v1 = pe.PaperEngine(provider(DAY), data_dir=tmp1,
                            config={"strategyVersion": "PAPER_BASELINE_V1",
                                    "initial_cash_krw": 10_000_000,
                                    "position_size_krw": 1_000_000,
                                    "maxHoldingTradingDays": 5},
                            environment="TEST")
        v1.run_cycle(bundle("HOLD", f"{DAY}T09:05:00+09:00"),
                     now=datetime(2026, 9, 1, 9, 10, tzinfo=KST))
        v1.run_cycle(bundle("BUY", f"{DAY}T10:05:00+09:00"),
                     now=datetime(2026, 9, 1, 10, 10, tzinfo=KST))
        v2 = sv.SmartV2Engine(provider(DAY), data_dir=tmp2, environment="TEST_SMART_V2")
        v2.run_cycle(bundle("HOLD", f"{DAY}T09:05:00+09:00"),
                     now=datetime(2026, 9, 1, 9, 10, tzinfo=KST))
        v2.run_cycle(bundle("BUY", f"{DAY}T10:05:00+09:00"),
                     now=datetime(2026, 9, 1, 10, 10, tzinfo=KST))
        mom_rc = pm.run_safe()          # 기본 OFF — 아무 것도 하지 않아야 한다
    out = buf.getvalue()
    check("2a. V1·V2 사이클을 돌려도 Production 파일이 한 바이트도 안 바뀐다",
          snapshot() == before,
          str([k for k, v in snapshot().items() if before.get(k) != v]))
    files = ""
    for d in (tmp1, tmp2):
        for f in os.listdir(d):
            p = os.path.join(d, f)
            if os.path.isfile(p):
                files += open(p, encoding="utf-8").read()
    check("2b. Secret 값이 로그·산출물에 0회",
          "FAKE_SECRET_FOR_TEST_0002" not in out + files
          and "c_FAKE_ID_FOR_TEST_0001" not in out + files)
    check("3a. 모멘텀 전략은 기본 OFF 그대로(환경변수 없으면 아무 것도 안 한다)",
          mom_rc == 0 and "꺼져 있음" in out)
finally:
    for k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
        os.environ.pop(k, None)
    shutil.rmtree(tmp1, ignore_errors=True)
    shutil.rmtree(tmp2, ignore_errors=True)

check("3b. 모멘텀 켜는 스위치가 그대로 남아 있다(기본 OFF)",
      pm.ENABLE_ENV == "GAEO_PAPER_MOMENTUM"
      and 'os.environ.get(ENABLE_ENV) != "1"' in open(
          os.path.join(HERE, "paper_momentum.py"), encoding="utf-8").read())
check("3c. 모멘텀 폴더를 미리 만들지 않는다",
      not os.path.exists(os.path.join(HERE, "paper_trading", "momentum")))

# ═══ ④ Production 파이프라인에 모의투자가 섞이지 않는다 ══════════════════════
ua = open(os.path.join(HERE, ".github/workflows/update-analysis.yml"), encoding="utf-8").read()
up = open(os.path.join(HERE, ".github/workflows/update-prices.yml"), encoding="utf-8").read()
check("4a. 분석 워크플로에 paper 스크립트 주입 0",
      "paper_engine" not in ua and "paper_smart_v2" not in ua
      and "paper_engine" not in up and "paper_smart_v2" not in up)
wf = open(os.path.join(HERE, ".github/workflows/paper-trading.yml"), encoding="utf-8").read()
check("4b. 모의투자 워크플로는 paper_trading/ 만 커밋한다",
      "git add paper_trading" in wf and "analyze_auto" not in wf)
ps1 = open(os.path.join(HERE, "scripts/paper_cycle.ps1"), encoding="utf-8").read()
check("4c. 로컬 러너 커밋 화이트리스트가 그대로다(경계 확장 0)",
      "$WHITELIST_DIR  = 'paper_trading'" in ps1
      and "$WHITELIST_FILE = 'paper_public.js'" in ps1)
check("4d. 러너가 Shadow 전략을 부르되 실패해도 기록 커밋을 막지 않는다",
      "Invoke-PaperScript 'paper_smart_v2.py' -ContinueOnError" in ps1)
check("4e. Shadow 전략 산출물이 커밋 화이트리스트 안에 있다",
      sv.DATA_DIR.startswith(os.path.join(HERE, "paper_trading")))

# ═══ ⑤ 공개 화면에 계좌 흔적·Shadow 기록이 새지 않는다 ═══════════════════════
check("5a. 공개 스냅샷 금지 키워드 목록이 그대로다",
      set(paper_public.FORBIDDEN_SUBSTRINGS) >= {"client_id", "client_secret", "token",
                                                 "authorization", "account", "secret"})
check("5b. 공개 스냅샷은 V1 원장만 읽는다(Shadow 폴더 미참조)",
      "smart_v2" not in open(os.path.join(HERE, "paper_public.py"), encoding="utf-8").read())
pub = open(os.path.join(HERE, "paper_public.js"), encoding="utf-8").read().lower()
check("5c. 배포된 공개 스냅샷에 계좌·토큰 흔적 0",
      not any(w in pub for w in ("client_id", "client_secret", "authorization",
                                 "account", "secret")))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_safety_boundary: 전체 통과 (안전 경계 계약)")
