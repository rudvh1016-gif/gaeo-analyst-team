#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""toss_market_data_smoke.py 오프라인 계약 테스트 — 실제 네트워크 0회.

검증: credential 없음 fail-closed / 토큰 실패 시 시세 미호출 / 빈 응답·잘못된
symbol·price<=0 → FAIL / 성공 경로 감사 카운터 전부 0 / 출력에 Secret·Token 0.
"""
import contextlib
import email.message
import io
import json
import os
import sys
import urllib.error

import paper_market_data as pmd
import toss_market_data_smoke as smoke

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


class FakeNet:
    def __init__(self):
        self.script = []
        self.calls = []

    def urlopen(self, req, timeout=None):
        path = req.full_url.replace(pmd.BASE_URL, "").split("?")[0]
        self.calls.append((req.get_method(), path))
        if not self.script:
            raise AssertionError(f"예상 밖 네트워크 호출: {req.get_method()} {path}")
        entry = self.script.pop(0)
        if entry[0] == "ok":
            return io.BytesIO(json.dumps(entry[1]).encode())
        msg = email.message.Message()
        raise urllib.error.HTTPError(req.full_url, entry[1], "err", msg, None)


NET = FakeNet()
pmd.urllib.request.urlopen = NET.urlopen
pmd.time.sleep = lambda s: None

TOKEN_OK = ("ok", {"access_token": "example-token-x", "expires_in": 900})


def run_smoke(script, with_creds=True):
    """스모크를 격리 환경에서 실행하고 (exit code, stdout) 반환."""
    for k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
        os.environ.pop(k, None)
    if with_creds:
        os.environ[pmd.CLIENT_ID_ENV] = "example-cid"        # placeholder(실값 아님)
        os.environ[pmd.CLIENT_SECRET_ENV] = "example-sec"    # placeholder(실값 아님)
    NET.script = list(script)
    NET.calls = []
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        rc = smoke.run()
    return rc, buf.getvalue()


# S1. credential 없음 → fail closed + 네트워크 0회
rc, out = run_smoke([], with_creds=False)
check("S1. credential 없음 → FAIL + 네트워크 0회",
      rc == 1 and "CREDENTIALS: MISSING" in out and len(NET.calls) == 0)

# S2. 토큰 발급 실패(400) → 시세 호출 안 함 + 단계 표기
rc, out = run_smoke([("http", 400)])
check("S2. 토큰 실패 → 시세 미호출 + FAILED_STAGE=TOKEN_ISSUANCE",
      rc == 1 and "FAILED_STAGE: TOKEN_ISSUANCE" in out and "HTTP_STATUS: 400" in out
      and all(p != "/api/v1/prices" for _, p in NET.calls))

# S3. 정상 경로 → PASS + 감사 카운터 전부 0 + 비밀 미출력
rc, out = run_smoke([
    TOKEN_OK,
    ("ok", {"result": [{"symbol": "005930", "lastPrice": 71800,
                        "timestamp": "2026-08-17T14:30:00+09:00"}]}),
])
check("S3a. 정상 경로 → STEP1 PASS + PRICE 표시",
      rc == 0 and "STEP1: PASS" in out and "PRICE: 71800.0" in out
      and "TIMESTAMP:" in out)
check("S3b. 감사 — ACCOUNT/HOLDINGS/ORDER/FORBIDDEN 전부 0",
      "ACCOUNT_CALLS: 0" in out and "HOLDINGS_CALLS: 0" in out
      and "ORDER_CALLS: 0" in out and "FORBIDDEN_CALLS: 0" in out)
check("S3c. 출력에 Secret·Token 값 없음",
      "example-cid" not in out and "example-sec" not in out
      and "example-token-x" not in out and "Authorization" not in out)
check("S3d. 네트워크는 정확히 token 1회 + prices 1회",
      NET.calls == [("POST", "/oauth2/token"), ("GET", "/api/v1/prices")])

# S4. 빈 응답 → FAIL
rc, out = run_smoke([TOKEN_OK, ("ok", {"result": []})])
check("S4. 빈 price 응답 → FAIL", rc == 1 and "STEP1: FAIL" in out)

# S5. price <= 0 → FAIL
rc, out = run_smoke([TOKEN_OK, ("ok", {"result": [{"symbol": "005930", "lastPrice": 0}]})])
check("S5. price<=0 → FAIL", rc == 1 and "STEP1: FAIL" in out)

# S6. 다른 symbol만 반환 → FAIL
rc, out = run_smoke([TOKEN_OK, ("ok", {"result": [{"symbol": "000660", "lastPrice": 170000}]})])
check("S6. 잘못된 symbol → FAIL", rc == 1 and "STEP1: FAIL" in out)

# S7. 시세 단계 403 → sanitized 실패(원문 미출력) + 재시도 없음
rc, out = run_smoke([TOKEN_OK, ("http", 403)])
check("S7. 403 → FAILED_STAGE=MARKET_DATA + HTTP_STATUS만 출력",
      rc == 1 and "FAILED_STAGE: MARKET_DATA" in out and "HTTP_STATUS: 403" in out
      and len([1 for _, p in NET.calls if p == "/api/v1/prices"]) == 1)

# S8. 스모크 소스 정적 검사 — 계좌/주문 경로·계좌 헤더 없음
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "toss_market_data_smoke.py"), encoding="utf-8").read()
check("S8. 소스에 계좌/보유/주문 endpoint·X-Tossinvest-Account 없음",
      all(t not in src for t in ("/api/v1/orders", "/accounts", "/holdings",
                                 "X-Tossinvest-Account")))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_toss_market_data_smoke: 전체 통과 (오프라인 8계약)")
