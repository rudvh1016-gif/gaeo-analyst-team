#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""paper_public.py Sanitization 계약 — 공개 스냅샷에 비밀·계좌·TEST 기록이 못 들어간다."""
import json
import os
import shutil
import sys
import tempfile

import paper_public as pp

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


tmp = tempfile.mkdtemp(prefix="ppub_")
orig_dir, orig_out = pp.DIR, pp.OUT
pp.DIR = tmp
pp.OUT = os.path.join(tmp, "paper_public.js")
try:
    # 픽스처: LIVE 거래 2건(OPEN·CLOSED) + TEST 1건 + 요약
    with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
        f.write(json.dumps({"trade_id": "a1", "environment": "LIVE_PAPER", "status": "OPEN",
                            "symbol": "005930", "name": "삼성전자", "market": "KOSPI",
                            "signal": "BUY", "entry_price": 10000, "quantity": 100,
                            "entry_business_date": "2026-08-18",
                            "detected_at": "2026-08-18T10:10:00+09:00"}, ensure_ascii=False) + "\n")
        f.write(json.dumps({"trade_id": "a2", "environment": "LIVE_PAPER", "status": "CLOSED",
                            "symbol": "000660", "name": "SK하이닉스", "market": "KOSPI",
                            "signal": "BUY", "entry_price": 20000, "quantity": 50,
                            "exit_price": 20600, "exit_reason": "MAX_HOLDING_5D",
                            "gross_return_pct": 3.0, "holding_trading_days": 5,
                            "entry_business_date": "2026-08-18", "exit_business_date": "2026-08-25",
                            "detected_at": "2026-08-18T10:10:00+09:00",
                            "exit_at": "2026-08-25T10:10:00+09:00"}, ensure_ascii=False) + "\n")
        f.write(json.dumps({"trade_id": "t1", "environment": "TEST", "status": "CLOSED",
                            "symbol": "999999", "name": "테스트종목", "entry_price": 1,
                            "quantity": 1, "exit_price": 2,
                            "gross_return_pct": 100.0}, ensure_ascii=False) + "\n")
    json.dump({"evidence": "INSUFFICIENT_EVIDENCE — 표본 부족", "winRatePct": 100.0,
               "skippedSignals": 0}, open(os.path.join(tmp, "summary.json"), "w"))
    json.dump({"baselineCaptured": True, "engineStartedAt": "2026-08-18T09:10:00+09:00",
               "lastCycleAt": "2026-08-25T10:10:00+09:00", "lastCycleResult": "CYCLE_OK"},
              open(os.path.join(tmp, "state.json"), "w"))
    json.dump({"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
               "forwardStart": "2026-08-18"}, open(os.path.join(tmp, "config.json"), "w"))

    rc = pp.build()
    out = open(pp.OUT, encoding="utf-8").read()
    payload = json.loads(out[out.index("=") + 1:].strip().rstrip(";"))

    check("생성 성공", rc == 0)
    check("TEST 기록 제외 (Forward만 공개)",
          all(t.get("symbol") != "999999" for t in payload["recentTrades"])
          and payload["closedTrades"] == 1 and payload["openTrades"] == 1)
    check("확정 평가금 = 초기금 + 확정 손익", payload["realizedVirtualEquity"] == 10_000_000 + 600 * 50)
    # 원장 필드 + 표시용 파생 필드 — 둘 다 명시 allowlist 안에만 있어야 한다.
    allowed = pp.TRADE_ALLOWED | pp.DERIVED_ALLOWED
    extra = {k for t in payload["recentTrades"] for k in t} - allowed
    check("거래 공개 필드가 allowlist 밖으로 안 나감", not extra, str(extra))
    # 파생 필드가 원장 필드를 덮어써 의미를 바꾸지 않는지(이름 충돌 0) 확인.
    check("파생 필드가 원장 필드와 충돌하지 않음",
          not (pp.DERIVED_ALLOWED & pp.TRADE_ALLOWED),
          str(pp.DERIVED_ALLOWED & pp.TRADE_ALLOWED))
    check("금지 키워드(secret/token/account 등) 0",
          not any(w in out.lower() for w in pp.FORBIDDEN_SUBSTRINGS))
    check("비용 모델 INCOMPLETE 각인", payload["costModel"] == "COST_MODEL_INCOMPLETE")
    check("표본 부족 상태 전달", str(payload["evidenceStatus"]).startswith("INSUFFICIENT"))

    # 오염된 요약 — allowlist에 있는 필드(evidence)에 비밀 문자열이 섞인 경우에도
    # 마지막 방어선(FORBIDDEN_SUBSTRINGS)이 산출물 생성을 거부해야 한다.
    json.dump({"evidence": "OK client_secret=abc"},
              open(os.path.join(tmp, "summary.json"), "w"))
    os.remove(pp.OUT)
    rc2 = pp.build()
    check("비밀 문자열 감지 시 산출물 미생성(FAIL CLOSED)",
          rc2 == 1 and not os.path.exists(pp.OUT))

    # Ledger 없음(시작 전) → 가짜 거래·가짜 수익률 없이 상태만
    shutil.rmtree(tmp)
    os.makedirs(tmp)
    rc3 = pp.build()
    payload3 = json.loads(open(pp.OUT, encoding="utf-8").read().split("=", 1)[1].strip().rstrip(";"))
    check("시작 전 상태 — 거래 0·수익률 null·stage 표기",
          rc3 == 0 and payload3["stage"] == "BEFORE_FORWARD_START"
          and payload3["recentTrades"] == [] and payload3["portfolioReturnPct"] is None
          and "grossReturnPct" not in payload3)   # 개별 수익 합은 공개 payload에서 제외
finally:
    pp.DIR, pp.OUT = orig_dir, orig_out
    shutil.rmtree(tmp, ignore_errors=True)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_public: 전체 통과")
