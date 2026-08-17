#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""STEP 1 — Toss Open API 실시세 스모크 테스트 (workflow_dispatch 수동 1회 전용).

목적: "GitHub Actions → Toss OAuth 토큰 발급 → 삼성전자(005930) 현재가 1회 조회"가
실제로 되는지만 안전하게 증명한다.

안전 계약
  · 기존 TossMarketDataProvider를 그대로 사용한다 — ALLOWED_PATHS·메서드 가드·
    401(1회 재발급)·429(유한 백오프)·400/403(즉시 실패) 정책이 전부 적용된다.
  · 허용 호출은 정확히 두 종류뿐: POST /oauth2/token · GET /api/v1/prices.
    모든 네트워크 호출을 (method, path)로 기록해 마지막에 감사(audit)한다.
  · 계좌/보유/주문/조건주문 계열 호출 0회. 계좌 식별 헤더도 일절 쓰지 않는다.
  · Secret·Access Token·Authorization 헤더·요청 본문은 절대 출력하지 않는다.
    실패 시에도 상태코드+단계만 출력한다(응답 원문 출력 금지).
  · 토큰은 프로세스 메모리에서만 쓰고 파일/로그/Artifact에 저장하지 않는다.
  · Paper Engine 상태·Forward 시작일(2026-08-18)은 건드리지 않는다.
"""
import re
import sys

import paper_market_data as pmd

SYMBOL = "005930"  # 삼성전자 — 공개 시장데이터 1종목만
ALLOWED_CALLS = frozenset({("POST", "/oauth2/token"), ("GET", "/api/v1/prices")})
# 주의: /api/v1/orderbook에 'order' 문자열이 들어가므로 substring이 아니라
# 정확한 금지 계열 패턴으로 센다.
ACCOUNT_PAT = re.compile(r"account", re.I)
HOLDINGS_PAT = re.compile(r"holding", re.I)
ORDER_PAT = re.compile(r"/orders(/|$)|conditional-orders|/order(/|$)|buying-power"
                       r"|sellable|modify|cancel", re.I)


def _fail_stage(stage, exc):
    """sanitized 실패 출력 — 상태코드/오류 종류만, 응답 원문·비밀 금지."""
    msg = str(exc)  # provider가 이미 'HTTP <code> at <path>' 형태로만 만든다
    print(f"FAILED_STAGE: {stage}")
    m = re.search(r"HTTP (\d{3})", msg)
    if m:
        print(f"HTTP_STATUS: {m.group(1)}")
    else:
        print(f"ERROR_KIND: {msg.split(' at ')[0][:80]}")


def _audit(calls):
    """네트워크 감사 — method+path만 사용(민감정보 없음). 전부 0이어야 PASS."""
    account = sum(1 for _, p in calls if ACCOUNT_PAT.search(p))
    holdings = sum(1 for _, p in calls if HOLDINGS_PAT.search(p))
    orders = sum(1 for _, p in calls if ORDER_PAT.search(p))
    forbidden = sum(1 for c in calls if c not in ALLOWED_CALLS)
    print("CALLS: " + (" · ".join(f"{m} {p}" for m, p in calls) or "(없음)"))
    print(f"ACCOUNT_CALLS: {account}")
    print(f"HOLDINGS_CALLS: {holdings}")
    print(f"ORDER_CALLS: {orders}")
    print(f"FORBIDDEN_CALLS: {forbidden}")
    return account == 0 and holdings == 0 and orders == 0 and forbidden == 0


def run():
    calls = []

    # ① Credential 존재 여부 — 값은 절대 출력하지 않는다
    if not pmd.credentials_available():
        print("CREDENTIALS: MISSING")
        print("STEP1: FAIL")
        return 1
    print("CREDENTIALS: PRESENT")

    provider = pmd.TossMarketDataProvider()
    orig_request = provider._request

    def audited(path, params=None, method="GET", body=None, auth=True, retries=2,
                _reauth_done=False):
        calls.append((method, path))
        return orig_request(path, params=params, method=method, body=body, auth=auth,
                            retries=retries, _reauth_done=_reauth_done)

    provider._request = audited  # 토큰 발급·401 재발급 포함 모든 호출이 기록된다

    # ② 실제 Access Token 발급 (성공 여부만 출력)
    try:
        provider._access_token()
    except pmd.MarketDataUnavailable as e:
        _fail_stage("TOKEN_ISSUANCE", e)
        _audit(calls)
        print("STEP1: FAIL")
        return 1
    print("TOKEN_ISSUANCE: PASS")

    # ③ 삼성전자 현재가 1회 조회
    try:
        out = provider.get_prices([SYMBOL])
    except pmd.MarketDataUnavailable as e:
        _fail_stage("MARKET_DATA", e)
        _audit(calls)
        print("STEP1: FAIL")
        return 1

    # ④ 응답 검증 — symbol 일치 · 현재가 숫자 · 현재가 > 0
    row = out.get(SYMBOL)
    price = row.get("price") if isinstance(row, dict) else None
    if not (isinstance(price, float) and price > 0):
        print("MARKET_DATA: FAIL — 005930 유효 현재가 없음(symbol/price 검증 실패)")
        _audit(calls)
        print("STEP1: FAIL")
        return 1

    print("MARKET_DATA: PASS")
    print(f"SYMBOL: {SYMBOL}")
    print(f"PRICE: {price}")  # 공개 시장데이터 — 표시 허용
    if row.get("timestamp"):
        print(f"TIMESTAMP: {row['timestamp']}")

    # ⑤ 네트워크 감사 — 계좌/보유/주문/기타 금지 호출 전부 0이어야 한다
    if not _audit(calls):
        print("STEP1: FAIL")
        return 1
    print("STEP1: PASS")
    return 0


if __name__ == "__main__":
    sys.exit(run())
