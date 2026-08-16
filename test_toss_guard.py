#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Toss 시세 클라이언트 Egress 가드·재시도 정책 계약 (2026-08-16 보안 애드덤 G·H).

전부 오프라인 — urlopen을 가짜로 바꿔 실제 네트워크 없이 검증한다.

  G. READ-ONLY egress 가드
     · 주문·계좌 계열 경로(orders / conditional-orders / modify / cancel /
       accounts / holdings …)는 PaperSafetyError로 즉시 실패하고,
       예외가 네트워크 도달 **이전**에 난다(urlopen 호출 0회).
     · 메서드 수준 이중 차단: GET은 허용 경로 전부, POST는 /oauth2/token 하나만,
       PUT·PATCH·DELETE는 전면 거부.
  H. Rate limit / 인증 재시도 정책
     · 429는 Retry-After 헤더 우선 + 유한 백오프(+jitter), 상한 30초, 무한 재시도 금지.
     · 401은 정확히 1회 토큰 재발급 후 원 요청 재시도 — 두 번째 401은 그대로 실패
       (무한 refresh 루프 금지).
     · 400/403은 재시도 없이 즉시 실패, 오류 메시지는 "HTTP <code> at <path>"뿐
       (토큰·응답 본문·헤더를 절대 싣지 않는다).
"""
import email.message
import io
import json
import os
import sys
import time
import urllib.error

import paper_market_data as pmd

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


# ── 가짜 HTTP 계층 ──────────────────────────────────────────────────────────
class FakeNet:
    """스크립트대로 응답/오류를 돌려주는 urlopen 대체. 호출 순서·헤더를 기록한다."""

    def __init__(self):
        self.script = []   # 항목: ("ok", payload dict) | ("http", status, {헤더 dict})
        self.calls = []    # (method, path, headers dict)
        self.sleeps = []

    def urlopen(self, req, timeout=None):
        path = req.full_url.replace(pmd.BASE_URL, "").split("?")[0]
        self.calls.append((req.get_method(), path, dict(req.headers)))
        if not self.script:
            raise AssertionError(f"예상 밖 네트워크 호출: {req.get_method()} {path}")
        entry = self.script.pop(0)
        if entry[0] == "ok":
            return io.BytesIO(json.dumps(entry[1]).encode())
        status, hdrs = entry[1], entry[2]
        msg = email.message.Message()
        for k, v in hdrs.items():
            msg[k] = v
        raise urllib.error.HTTPError(req.full_url, status, "err", msg, None)


NET = FakeNet()
pmd.urllib.request.urlopen = NET.urlopen          # 네트워크 차단 + 기록
pmd.time.sleep = lambda s: NET.sleeps.append(s)   # 대기 시간 기록만
os.environ.setdefault(pmd.CLIENT_ID_ENV, "example-cid")        # placeholder (실값 아님)
os.environ.setdefault(pmd.CLIENT_SECRET_ENV, "example-sec")    # placeholder (실값 아님)

PRICE_OK = {"result": [{"symbol": "005930", "lastPrice": 10000, "timestamp": None}]}


def reset(script):
    NET.script = list(script)
    NET.calls = []
    NET.sleeps = []


def make(preset_token=None):
    p = pmd.TossMarketDataProvider()
    if preset_token:
        p._token = preset_token
        p._token_expires_at = time.time() + 3600
    return p


# ═══ G. READ-ONLY EGRESS 가드 ═══════════════════════════════════════════════

# G1. 주문·계좌 계열 forbidden 경로 → PaperSafetyError + 네트워크 도달 0회
FORBIDDEN_PATHS = [
    "/api/v1/orders", "/api/v1/orders/123", "/api/v1/conditional-orders",
    "/api/v1/orders/modify", "/api/v1/orders/cancel", "/api/v1/order",
    "/api/v1/accounts", "/api/v1/accounts/balance", "/api/v1/buyable-amount",
    "/api/v1/holdings", "/oauth2/revoke",
]
prov = make("example-token-a")
blocked = 0
for fp_ in FORBIDDEN_PATHS:
    reset([])
    try:
        prov._request(fp_)
    except pmd.PaperSafetyError:
        if not NET.calls:            # 예외가 urlopen 이전에 났는지까지 확인
            blocked += 1
    except Exception:
        pass
check("G1. 주문·계좌 경로 전부 즉시 PaperSafetyError(네트워크 0회)",
      blocked == len(FORBIDDEN_PATHS), f"{blocked}/{len(FORBIDDEN_PATHS)}")

# G2. 주문 경로 × 쓰기 메서드 전 조합도 동일 차단
blocked = 0
for fp_ in ("/api/v1/orders", "/api/v1/conditional-orders"):
    for m in ("POST", "PUT", "PATCH", "DELETE"):
        reset([])
        try:
            prov._request(fp_, method=m)
        except pmd.PaperSafetyError:
            if not NET.calls:
                blocked += 1
        except Exception:
            pass
check("G2. 주문 경로 × POST/PUT/PATCH/DELETE 전 조합 차단", blocked == 8, f"{blocked}/8")

# G3. 허용 경로라도 쓰기 메서드는 거부(메서드 수준 이중 차단)
market_paths = sorted(pmd.ALLOWED_PATHS - {"/oauth2/token"})
blocked = 0
for fp_ in market_paths:
    for m in ("POST", "PUT", "PATCH", "DELETE"):
        reset([])
        try:
            prov._request(fp_, method=m)
        except pmd.PaperSafetyError:
            if not NET.calls:
                blocked += 1
        except Exception:
            pass
check("G3. 허용 시세 경로 × 쓰기 메서드 전부 차단",
      blocked == len(market_paths) * 4, f"{blocked}/{len(market_paths) * 4}")

# G4. /oauth2/token은 POST만 통과, PUT/PATCH/DELETE는 거부
ok_post = True
try:
    prov._guard("/oauth2/token", "POST")
except Exception:
    ok_post = False
blocked = 0
for m in ("PUT", "PATCH", "DELETE"):
    try:
        prov._guard("/oauth2/token", m)
    except pmd.PaperSafetyError:
        blocked += 1
check("G4. 토큰 endpoint: POST 허용 · PUT/PATCH/DELETE 거부", ok_post and blocked == 3)

# G5. ALLOWED_PATHS 정적 계약 — 시세 6개 고정, 주문·계좌 계열 없음
check("G5. ALLOWED_PATHS 6개 고정(주문·계좌 경로 없음)",
      pmd.ALLOWED_PATHS == frozenset({
          "/oauth2/token", "/api/v1/prices", "/api/v1/orderbook",
          "/api/v1/trades", "/api/v1/market-calendar/KR", "/api/v1/stocks"}))

# G6. 계좌 헤더 미사용 — X-Tossinvest-Account는 "안 쓴다" 문서 1곳뿐
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "paper_market_data.py"), encoding="utf-8").read()
check("G6. X-Tossinvest-Account 코드 사용 0(금지 문서 1곳뿐)",
      src.count("X-Tossinvest-Account") == 1)

# ═══ H. RATE LIMIT / 인증 재시도 정책 ══════════════════════════════════════

# H1. 429 2회 → Retry-After(3s) 존중 대기 후 성공 복구
prov = make("example-token-a")
reset([("http", 429, {"Retry-After": "3"}),
       ("http", 429, {"Retry-After": "3"}),
       ("ok", PRICE_OK)])
out = prov.get_prices(["005930"])
check("H1. 429×2 후 성공 복구 + Retry-After 3s 존중(+jitter≤0.5)",
      out.get("005930", {}).get("price") == 10000.0
      and len(NET.sleeps) == 2 and all(3.0 <= s <= 3.6 for s in NET.sleeps),
      f"sleeps={NET.sleeps}")

# H2. 429 연속 → 정확히 3회 시도(기본 retries=2) 후 실패 — 무한 재시도 금지
prov = make("example-token-a")
reset([("http", 429, {}), ("http", 429, {}), ("http", 429, {})])
try:
    prov.get_prices(["005930"])
    ok = False
except pmd.MarketDataUnavailable:
    ok = True
check("H2. 429 연속 → 3회 시도 후 MarketDataUnavailable(무한 재시도 금지)",
      ok and len(NET.calls) == 3 and len(NET.sleeps) == 2 and not NET.script,
      f"calls={len(NET.calls)} sleeps={len(NET.sleeps)}")

# H3. 과도한 Retry-After(9999s)는 30초로 상한 — 러너 폭주 대기 금지
prov = make("example-token-a")
reset([("http", 429, {"Retry-After": "9999"}), ("ok", PRICE_OK)])
prov.get_prices(["005930"])
check("H3. Retry-After 9999s → 대기 30.5s 이하로 상한",
      len(NET.sleeps) == 1 and NET.sleeps[0] <= 30.5, f"sleeps={NET.sleeps}")

# H4. 401 → 토큰 정확히 1회 재발급 → 원 요청을 새 토큰으로 재시도·성공
prov = make("example-token-b")     # 폐기된 토큰 시나리오
reset([("http", 401, {}),
       ("ok", {"access_token": "example-token-c", "expires_in": 900}),
       ("ok", PRICE_OK)])
out = prov.get_prices(["005930"])
token_posts = [c for c in NET.calls if c[1] == "/oauth2/token"]
last_auth = NET.calls[-1][2].get("Authorization")
check("H4. 401 → 토큰 1회 재발급 → 새 토큰으로 성공",
      out.get("005930", {}).get("price") == 10000.0
      and len(token_posts) == 1 and len(NET.calls) == 3
      and last_auth == "Bearer example-token-c",
      f"calls={[(c[0], c[1]) for c in NET.calls]} auth={last_auth}")

# H5. 재발급 후에도 401 → 그대로 실패, 재발급은 1회로 종료(무한 refresh 금지)
prov = make("example-token-b")
reset([("http", 401, {}),
       ("ok", {"access_token": "example-token-d", "expires_in": 900}),
       ("http", 401, {})])
try:
    prov.get_prices(["005930"])
    ok = False
except pmd.MarketDataUnavailable:
    ok = True
check("H5. 두 번째 401은 즉시 실패 — 토큰 재발급 정확히 1회",
      ok and len([c for c in NET.calls if c[1] == "/oauth2/token"]) == 1
      and len(NET.calls) == 3 and not NET.script,
      f"calls={[(c[0], c[1]) for c in NET.calls]}")

# H6. 400/403 → 재시도·sleep 0회 즉시 실패, 메시지는 상태코드+경로만(비밀 미노출)
for code_ in (400, 403):
    prov = make("example-token-b")
    reset([("http", code_, {"X-Debug": "must-not-leak"})])
    try:
        prov.get_prices(["005930"])
        ok = False
    except pmd.MarketDataUnavailable as e:
        ok = str(e) == f"HTTP {code_} at /api/v1/prices"
    check(f"H6. {code_} 즉시 실패(재시도 0·sleep 0·메시지=상태코드+경로만)",
          ok and len(NET.calls) == 1 and len(NET.sleeps) == 0)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_toss_guard: 전체 통과 (G 경로·메서드 가드 6 + H 재시도 정책 7)")
