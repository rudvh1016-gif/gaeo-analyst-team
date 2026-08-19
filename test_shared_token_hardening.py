#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공유 Toss 토큰 하드닝 계약 — 장애 주입 (전부 오프라인, 실제 Toss 호출 0).

배경:
    공유 토큰 저장소가 흔들려도 Paper Runner 는 "그 조회만" 실패해야 한다.
    저장소 장애가 사이클 전체를 중단시키거나, 토큰 재발급 폭주(= 상대 프로그램을
    계속 끊는 상태)로 번지면 안 된다.

검증 항목:
    H1. 잠금 타임아웃 → MarketDataUnavailable (사이클 전체 중단 아님)
    H2. 저장소 read 오류 → MarketDataUnavailable
    H3. 저장(replace) 오류 → MarketDataUnavailable 계약 유지
    H4. 예외 메시지에 토큰·경로가 없다
    H5. Windows 공유 위반(PermissionError) 재시도로 저장 성공
    H6. 재시도해도 실패하면 → 발급된 토큰을 그대로 쓴다(재발급 폭주 금지)
    H7. 발급 실패(429/5xx/깨진 응답)는 기존 계약 그대로
    H8. 프로그래밍 오류(TypeError 등)는 삼키지 않는다
    H9. 환경변수는 "1" 만 ON
    H10. 공유 OFF + 저장소 존재 → 경고 1회 (동작은 그대로)
"""
import io
import json
import os
import sys
import tempfile
import urllib.error

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + ("" if cond or not detail else f" — {detail}"))
    if not cond:
        FAILURES.append(name)


class _Ctx(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def _headers():
    import email.message
    return email.message.Message()


def run():
    import paper_market_data as pmd
    import gaeo_shared_token as shared

    tmp = tempfile.mkdtemp()
    os.environ["TOSS_INVEST_CLIENT_ID"] = "test-client-id-not-real"
    os.environ["TOSS_INVEST_CLIENT_SECRET"] = "test-client-secret-not-real"
    os.environ["GAEO_SECRETS_DIR"] = tmp
    os.environ["GAEO_SHARED_TOSS_TOKEN"] = "1"
    SECRET = "tok-SECRET-VALUE-must-not-leak"

    def ok_urlopen(req, timeout=None):
        return _Ctx(json.dumps({"access_token": SECRET, "expires_in": 900}).encode())

    orig_urlopen = pmd.urllib.request.urlopen
    orig_acquire = shared.acquire
    orig_replace = shared._replace_with_retry
    orig_read = shared.read_shared
    try:
        # ── H1: 잠금 타임아웃 ────────────────────────────────────────────
        pmd.urllib.request.urlopen = ok_urlopen
        shared.acquire = lambda *a, **k: (_ for _ in ()).throw(
            shared.SharedTokenError("shared token lock timeout"))
        c = pmd.TossMarketDataProvider()
        try:
            c._access_token()
            check("H1. 잠금 타임아웃 → MarketDataUnavailable", False, "예외가 나지 않음")
        except pmd.MarketDataUnavailable as e:
            check("H1. 잠금 타임아웃 → MarketDataUnavailable", True)
            check("H4a. 잠금 타임아웃 메시지에 토큰 없음", SECRET not in str(e), str(e))
            check("H4b. 잠금 타임아웃 메시지에 경로 없음", tmp not in str(e), str(e))
        except Exception as e:
            check("H1. 잠금 타임아웃 → MarketDataUnavailable", False,
                  f"{type(e).__name__} 이 그대로 새어나감")

        # ── H2: read 오류 ────────────────────────────────────────────────
        shared.acquire = lambda *a, **k: (_ for _ in ()).throw(OSError("disk read error"))
        c = pmd.TossMarketDataProvider()
        try:
            c._access_token()
            check("H2. 저장소 read 오류 → MarketDataUnavailable", False, "예외가 나지 않음")
        except pmd.MarketDataUnavailable as e:
            check("H2. 저장소 read 오류 → MarketDataUnavailable", True)
            check("H4c. read 오류 메시지에 원문 노출 없음", "disk read error" not in str(e), str(e))
        except Exception as e:
            check("H2. 저장소 read 오류 → MarketDataUnavailable", False, type(e).__name__)

        # ── H8: 프로그래밍 오류는 삼키지 않는다 ──────────────────────────
        shared.acquire = lambda *a, **k: (_ for _ in ()).throw(TypeError("bug in code"))
        c = pmd.TossMarketDataProvider()
        try:
            c._access_token()
            check("H8. 프로그래밍 오류는 숨기지 않는다", False, "예외가 나지 않음")
        except pmd.MarketDataUnavailable:
            check("H8. 프로그래밍 오류는 숨기지 않는다", False, "TypeError 가 조용히 삼켜짐")
        except TypeError:
            check("H8. 프로그래밍 오류는 숨기지 않는다", True)
        shared.acquire = orig_acquire

        # ── H5: PermissionError 재시도로 저장 성공 ───────────────────────
        shared.read_shared = orig_read
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
        state = {"n": 0}

        def flaky_replace(t, p):
            state["n"] += 1
            if state["n"] <= 2:            # 처음 두 번은 Windows 공유 위반 흉내
                raise PermissionError(32, "sharing violation")
            return orig_replace(t, p)

        shared._replace_with_retry = lambda t, p: _retry_wrapper(flaky_replace, t, p)

        def _retry_wrapper(fn, t, p):
            import time
            for i in range(shared.REPLACE_ATTEMPTS):
                try:
                    return fn(t, p)
                except PermissionError:
                    if i == shared.REPLACE_ATTEMPTS - 1:
                        raise
                    time.sleep(shared.REPLACE_DELAY_SECONDS)

        got = shared.write_shared("TOK-RETRY-OK", 900)
        check("H5. 공유 위반 2회 후 저장 성공", got == "TOK-RETRY-OK" and state["n"] == 3,
              f"replace 시도 {state['n']}회")
        check("H5b. 저장된 값을 다시 읽을 수 있다", orig_read() == "TOK-RETRY-OK")
        shared._replace_with_retry = orig_replace

        # ── H6: 끝까지 저장 실패해도 발급 토큰을 쓴다 ────────────────────
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
        shared._replace_with_retry = lambda t, p: (_ for _ in ()).throw(
            PermissionError(32, "sharing violation"))
        issued = {"n": 0}

        def issue_fn():
            issued["n"] += 1
            return "TOK-ISSUED-%d" % issued["n"], 900

        try:
            t = shared.acquire(issue_fn)
            check("H6. 저장 실패해도 발급 토큰 반환(재발급 폭주 금지)",
                  t == "TOK-ISSUED-1" and issued["n"] == 1, f"token={t} 발급={issued['n']}회")
        except Exception as e:
            check("H6. 저장 실패해도 발급 토큰 반환(재발급 폭주 금지)", False,
                  f"{type(e).__name__} 로 실패")
        shared._replace_with_retry = orig_replace

        # ── H3: 저장 오류가 계약 예외로 변환되는가 (호출측 관점) ─────────
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
        shared.acquire = lambda *a, **k: (_ for _ in ()).throw(OSError(28, "No space left"))
        c = pmd.TossMarketDataProvider()
        try:
            c._access_token()
            check("H3. 저장 오류 → MarketDataUnavailable", False, "예외가 나지 않음")
        except pmd.MarketDataUnavailable:
            check("H3. 저장 오류 → MarketDataUnavailable", True)
        except Exception as e:
            check("H3. 저장 오류 → MarketDataUnavailable", False, type(e).__name__)
        shared.acquire = orig_acquire

        # ── H7: 발급 실패는 기존 계약 그대로 ─────────────────────────────
        for f in os.listdir(tmp):
            os.remove(os.path.join(tmp, f))
        for label, code in (("429", 429), ("500", 500)):
            def bad(req, timeout=None, _c=code):
                raise urllib.error.HTTPError(req.full_url, _c, "err", _headers(), None)
            pmd.urllib.request.urlopen = bad
            c = pmd.TossMarketDataProvider()
            try:
                c._access_token()
                check(f"H7. 발급 {label} → MarketDataUnavailable", False, "예외가 나지 않음")
            except pmd.MarketDataUnavailable:
                check(f"H7. 발급 {label} → MarketDataUnavailable", True)
            except Exception as e:
                check(f"H7. 발급 {label} → MarketDataUnavailable", False, type(e).__name__)

        def malformed(req, timeout=None):
            return _Ctx(b'{"no_token": true}')
        pmd.urllib.request.urlopen = malformed
        c = pmd.TossMarketDataProvider()
        try:
            c._access_token()
            check("H7c. 깨진 토큰 응답 → 예외", False, "조용히 통과함")
        except pmd.MarketDataUnavailable:
            check("H7c. 깨진 토큰 응답 → 예외", True, "(계약 예외)")
        except KeyError:
            check("H7c. 깨진 토큰 응답 → 예외", True, "(기존 동작 유지)")

        # ── H9: 환경변수는 '1' 만 ON ─────────────────────────────────────
        cases = {"1": True, " 1 ": True, "": False, "0": False,
                 "true": False, "TRUE": False, "yes": False, "  ": False}
        bad_env = [v for v, want in cases.items()
                   if (os.environ.update({"GAEO_SHARED_TOSS_TOKEN": v}) or shared.enabled()) != want]
        check("H9. 환경변수는 '1' 만 ON (문서와 일치)", not bad_env, str(bad_env))

        # ── H10: OFF + 저장소 존재 → 경고 1회 ────────────────────────────
        os.environ["GAEO_SHARED_TOSS_TOKEN"] = "1"
        shared.write_shared("TOK-PEER", 900)
        os.environ.pop("GAEO_SHARED_TOSS_TOKEN", None)
        shared._warned[0] = False
        import contextlib
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            shared.warn_if_shared_store_exists()
            shared.warn_if_shared_store_exists()
        out = buf.getvalue()
        check("H10. 공유 OFF + 저장소 존재 → 경고", "GAEO_SHARED_TOSS_TOKEN" in out, out[:80])
        check("H10b. 경고는 1회만", out.count("경고:") == 1, f"{out.count('경고:')}회")
        check("H10c. 경고에 토큰 값 없음", "TOK-PEER" not in out)
    finally:
        pmd.urllib.request.urlopen = orig_urlopen
        shared.acquire = orig_acquire
        shared._replace_with_retry = orig_replace
        shared.read_shared = orig_read
        os.environ.pop("GAEO_SHARED_TOSS_TOKEN", None)

    print()
    if FAILURES:
        print("test_shared_token_hardening: 실패 %d건 — %s" % (len(FAILURES), ", ".join(FAILURES)))
        return 1
    print("test_shared_token_hardening: 전체 통과 (장애 주입 시에도 계약 유지 · 재발급 폭주 없음)")
    return 0


if __name__ == "__main__":
    sys.exit(run())
