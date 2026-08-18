#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Trading V1 — Market Data Provider (토스증권 Open API · MARKET DATA 전용).

⚠️ 안전 원칙 (2026-08-16 Paper Trading V1)
    - 이 모듈은 **시세 조회 전용**이다. 실제 주문·계좌 API를 절대 호출하지 않는다.
    - ALLOWED_PATHS에 없는 경로를 만들려 하면 즉시 PaperSafetyError.
      (주문·정정·취소·조건주문·계좌·보유·매수가능금액 계열 경로는
       애초에 이 파일에 존재하지 않는다)
    - X-Tossinvest-Account 헤더를 사용하지 않는다 — V1은 가상자금 전용.
    - Client Secret·Access Token은 메모리에서만 쓰고 어떤 로그에도 남기지 않는다.

API 근거 (공식 OpenAPI 스펙 v1.0.3, openapi.tossinvest.com — 2026-08-16 확인):
    POST /oauth2/token                 client_credentials (x-www-form-urlencoded)
    GET  /api/v1/prices?symbols=…      최대 200종목 콤마 배치, KRX 6자리 코드
    GET  /api/v1/orderbook?symbol=…    asks(낮은가격순)/bids(높은가격순)
    GET  /api/v1/trades?symbol=&count  당일 최근 체결(최대 50)
    GET  /api/v1/market-calendar/KR    전일/당일/익일 3영업일, KST. 휴장=integrated null
    Rate Limit: 그룹만 명시(MARKET_DATA 등), 수치 미공표 → 429 시 Retry-After 존중.
"""
import json
import os
import random
import time

try:
    # 집 PC에서 Toss 토큰을 하나만 유지하기 위한 공유 저장소(선택 기능).
    # 없으면 기존 동작 그대로 — 이 모듈은 이것 없이도 완전히 동작한다.
    import gaeo_shared_token
except ImportError:  # pragma: no cover
    gaeo_shared_token = None
import urllib.error
import urllib.parse
import urllib.request

BASE_URL = "https://openapi.tossinvest.com"

# V1에서 호출이 허용된 유일한 경로들 — 여기 없는 경로 생성은 즉시 예외.
ALLOWED_PATHS = frozenset({
    "/oauth2/token",
    "/api/v1/prices",
    "/api/v1/orderbook",
    "/api/v1/trades",
    "/api/v1/market-calendar/KR",
    "/api/v1/stocks",
})

CLIENT_ID_ENV = "TOSS_INVEST_CLIENT_ID"
CLIENT_SECRET_ENV = "TOSS_INVEST_CLIENT_SECRET"


class PaperSafetyError(RuntimeError):
    """허용되지 않은(주문·계좌 등) API 접근 시도."""


class MarketDataUnavailable(RuntimeError):
    """시세를 얻을 수 없음 — 가상체결을 하지 않고 Signal을 SKIP/PENDING 처리한다."""


def credentials_available():
    return bool(os.environ.get(CLIENT_ID_ENV)) and bool(os.environ.get(CLIENT_SECRET_ENV))


class TossMarketDataProvider:
    """토스증권 Open API 시세 어댑터. 계정 헤더 없음, 시세 전용."""

    name = "TOSS"

    def __init__(self, timeout=15):
        self.timeout = timeout
        self._token = None
        self._token_expires_at = 0
        # 401을 받아 "이 토큰은 죽었다"가 확인된 값. 공유 토큰 모드에서
        # 다른 프로세스가 이미 갱신했는지 판단하는 데 쓴다.
        self._dead_token = None

    # ── 내부 공통 ───────────────────────────────────────────────────────────
    def _guard(self, path, method="GET"):
        if path not in ALLOWED_PATHS:
            raise PaperSafetyError(f"허용되지 않은 API 경로: {path} — Paper V1은 시세 전용이다")
        # 메서드 수준 이중 차단(2026-08-16 보안 애드덤 G): 나중에 누가 허용 경로에
        # 쓰기형 호출을 추가하더라도 공통 계층에서 막힌다.
        #   GET  → 허용 경로 전부
        #   POST → /oauth2/token(토큰 발급) 하나만
        #   PUT/PATCH/DELETE 등 → 전면 거부
        if method == "GET":
            return
        if method == "POST" and path == "/oauth2/token":
            return
        raise PaperSafetyError(f"쓰기형 호출 금지: {method} {path} — Paper V1은 read-only다")

    def _request(self, path, params=None, method="GET", body=None, auth=True, retries=2,
                 _reauth_done=False):
        self._guard(path, method)
        url = BASE_URL + path
        if params:
            url += "?" + urllib.parse.urlencode(params)
        headers = {"Accept": "application/json"}
        if auth:
            headers["Authorization"] = "Bearer " + self._access_token()
        data = None
        if body is not None:
            data = urllib.parse.urlencode(body).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        last = None
        for attempt in range(retries + 1):
            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            try:
                with urllib.request.urlopen(req, timeout=self.timeout) as r:
                    return json.loads(r.read())
            except urllib.error.HTTPError as e:
                # 429: 공식 스펙대로 Retry-After 우선 + 유한 백오프 + jitter (폭주 금지)
                if e.code == 429 and attempt < retries:
                    wait = e.headers.get("Retry-After")
                    base = float(wait) if wait else 2.0 * (attempt + 1)
                    time.sleep(min(base, 30) + random.uniform(0, 0.5))
                    last = e
                    continue
                # 401(토큰 만료·폐기): 정확히 1회만 토큰을 새로 받아 원 요청을 재시도.
                # _reauth_done 플래그로 두 번째 401은 그대로 실패 — 무한 갱신 루프 금지.
                if e.code == 401 and auth and not _reauth_done:
                    self._dead_token = self._token
                    self._token = None
                    self._token_expires_at = 0
                    return self._request(path, params=params, method=method, body=body,
                                         auth=True, retries=retries, _reauth_done=True)
                # 400/403 등 영구 오류는 재시도하지 않는다.
                # ⚠️ 오류 본문에 토큰·비밀이 없도록 상태코드만 남긴다
                raise MarketDataUnavailable(f"HTTP {e.code} at {path}") from None
            except Exception as e:
                last = e
                if attempt < retries:
                    time.sleep(1.0 * (attempt + 1))
                    continue
                raise MarketDataUnavailable(f"{type(e).__name__} at {path}") from None
        raise MarketDataUnavailable(f"retry exhausted at {path} ({type(last).__name__})")

    def _issue_token(self):
        """실제 토큰 발급 1회. (token, expires_in) 을 돌려준다.

        ⚠️ 이 호출은 토스 계약상 **이전 토큰을 즉시 무효화한다.**
           그래서 호출 지점을 한 곳으로 모아 두고, 꼭 필요할 때만 부른다.
        """
        cid = os.environ.get(CLIENT_ID_ENV)
        secret = os.environ.get(CLIENT_SECRET_ENV)
        if not cid or not secret:
            raise MarketDataUnavailable("TOSS_MARKET_DATA_UNAVAILABLE — credential 미등록")
        resp = self._request("/oauth2/token", method="POST", auth=False,
                             body={"grant_type": "client_credentials",
                                   "client_id": cid, "client_secret": secret})
        return resp["access_token"], resp.get("expires_in", 900)

    def _access_token(self):
        dead, self._dead_token = self._dead_token, None

        if dead is None and self._token and time.time() < self._token_expires_at - 60:
            return self._token

        # 공유 토큰 모드 (기본 꺼짐 — GAEO_SHARED_TOSS_TOKEN=1 일 때만).
        #
        # 토스는 client 당 유효 토큰을 1개만 유지하고 재발급 시 이전 것을 무효화한다.
        # 집 PC에서 이 Runner와 계좌 조회용 Gateway가 각자 발급하면 서로를 끊는다.
        # 켜면 두 프로그램이 같은 토큰을 쓰므로 그 충돌이 사라진다.
        if gaeo_shared_token is not None and gaeo_shared_token.enabled():
            token = gaeo_shared_token.acquire(self._issue_token, dead_token=dead)
            self._token = token
            # 만료 판단은 공유 저장소가 한다. 메모리 캐시로 건너뛰지 않고 매번 확인한다
            # (다른 프로세스가 갱신했을 수 있으므로).
            self._token_expires_at = 0
            return token

        # 기존 동작 — 이 프로세스가 자체 발급하고 메모리에만 캐시한다.
        token, expires_in = self._issue_token()
        self._token = token
        self._token_expires_at = time.time() + float(expires_in or 900)
        return token

    # ── 시세 인터페이스 (MarketDataProvider) ────────────────────────────────
    def get_prices(self, symbols):
        """다건 현재가. {symbol: {"price": float, "timestamp": str|None}}"""
        out = {}
        for i in range(0, len(symbols), 200):      # 스펙: 최대 200개/호출 배치
            chunk = symbols[i:i + 200]
            resp = self._request("/api/v1/prices", {"symbols": ",".join(chunk)})
            for row in resp.get("result") or []:
                try:
                    out[row["symbol"]] = {"price": float(row["lastPrice"]),
                                          "timestamp": row.get("timestamp")}
                except (KeyError, TypeError, ValueError):
                    continue
        return out

    def get_orderbook(self, symbol):
        """호가. {"bestAsk": float|None, "bestBid": float|None, "timestamp": str|None}"""
        resp = self._request("/api/v1/orderbook", {"symbol": symbol})
        r = resp.get("result") or {}
        asks, bids = r.get("asks") or [], r.get("bids") or []

        def _price(level):
            try:
                return float(level.get("price"))
            except (AttributeError, TypeError, ValueError):
                return None
        return {"bestAsk": _price(asks[0]) if asks else None,
                "bestBid": _price(bids[0]) if bids else None,
                "timestamp": r.get("timestamp")}

    def get_market_calendar_kr(self, date=None):
        """국내 캘린더. {"today": {"date","open":bool}, "nextBusinessDay": {...}} 실패 시 예외."""
        params = {"date": date} if date else None
        resp = self._request("/api/v1/market-calendar/KR", params)
        r = resp.get("result") or {}

        def _day(d):
            if not d:
                return None
            return {"date": d.get("date"), "open": d.get("integrated") is not None,
                    "integrated": d.get("integrated")}
        return {k: _day(r.get(k)) for k in ("today", "previousBusinessDay", "nextBusinessDay")}


class FixtureMarketDataProvider:
    """테스트 전용 — 고정 픽스처 시세. Forward 기록(environment=LIVE_PAPER)에 섞지 않는다."""

    name = "FIXTURE"

    def __init__(self, prices=None, orderbooks=None, calendar=None, fail=False):
        self.prices = prices or {}
        self.orderbooks = orderbooks or {}
        self.calendar = calendar
        self.fail = fail
        self.calls = []

    def get_prices(self, symbols):
        self.calls.append(("prices", tuple(symbols)))
        if self.fail:
            raise MarketDataUnavailable("fixture: 시세 실패 시뮬레이션")
        return {s: self.prices[s] for s in symbols if s in self.prices}

    def get_orderbook(self, symbol):
        self.calls.append(("orderbook", symbol))
        if self.fail:
            raise MarketDataUnavailable("fixture: 호가 실패 시뮬레이션")
        ob = self.orderbooks.get(symbol)
        if ob is None:
            raise MarketDataUnavailable("fixture: 호가 없음")
        return ob

    def get_market_calendar_kr(self, date=None):
        self.calls.append(("calendar", date))
        if self.fail or self.calendar is None:
            raise MarketDataUnavailable("fixture: 캘린더 없음")
        return self.calendar
