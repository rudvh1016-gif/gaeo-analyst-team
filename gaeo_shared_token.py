#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""집 PC 안에서 Toss access token을 **하나만** 유지하기 위한 공유 저장소.

왜 필요한가
-----------
토스증권 공식 계약상 **client 당 유효 access token은 1개**다.
새로 발급하면 이전에 발급된 토큰은 **즉시 무효화된다.**

집 PC에서 같은 Client ID/Secret 을 쓰는 프로그램이 둘 이상이면
(예: 이 Paper Runner + 계좌 조회용 GAEO Gateway) 각자 토큰을 발급하는 순간
서로를 끝없이 로그아웃시킨다:

    Runner 발급 → tok-1          Gateway: 401
    Gateway 발급 → tok-2         Runner:  401
    Runner 발급 → tok-3          Gateway: 401
    …

핵심은 "누가 발급하느냐"가 아니라 **"토큰이 하나만 존재하느냐"** 다.
그래서 발급 결과를 한 곳에 두고 모두가 같은 값을 쓴다.

동작
----
    1) 토큰이 필요하면 먼저 공유 저장소를 본다
    2) 유효하면 그대로 쓴다 (발급 0회)
    3) 만료됐거나 죽은 토큰이면, **프로세스 간 잠금 안에서** 한 번만 발급하고 저장한다

이 모듈은 아무 프로세스에도 의존하지 않는다. 파일과 잠금뿐이므로
Gateway가 꺼져 있어도 Paper Runner는 그대로 동작한다.

보안
----
    · Windows에서는 DPAPI(현재 사용자 계정)로 암호화해 저장한다.
      같은 사용자만 복호화할 수 있고, 그 사용자는 어차피 client_secret도 읽을 수 있으므로
      새로운 노출 등급이 생기지 않는다.
    · 저장 위치는 git 저장소 **바깥**이다.
    · 토큰 값을 로그·예외 메시지에 절대 넣지 않는다.

이 기능은 **기본으로 꺼져 있다.** GAEO_SHARED_TOSS_TOKEN=1 일 때만 켜진다.
꺼져 있으면 기존 동작(각 프로세스가 자체 발급)이 100% 그대로다.
"""
import json
import os
import sys
import time

ENV_FLAG = "GAEO_SHARED_TOSS_TOKEN"
ENV_DIR = "GAEO_SECRETS_DIR"

_TOKEN_FILE = "toss_shared_access_token"
_LOCK_FILE = "toss_token.lock"
_ENTROPY = b"GAEO-Gateway-v1"

#: 만료 직전에 미리 갱신할 여유(시계 오차 포함)
SKEW_SECONDS = 60.0
LOCK_TIMEOUT_SECONDS = 30.0


def enabled():
    """공유 토큰 사용 여부. 기본은 꺼짐 — 명시적으로 켜야 한다."""
    return (os.environ.get(ENV_FLAG) or "").strip() == "1"


def secrets_dir():
    override = (os.environ.get(ENV_DIR) or "").strip()
    if override:
        return override
    if sys.platform == "win32":
        base = os.environ.get("LOCALAPPDATA") or os.path.expanduser(r"~\AppData\Local")
        return os.path.join(base, "GAEO", "secrets")
    base = os.environ.get("XDG_STATE_HOME") or os.path.expanduser("~/.local/state")
    return os.path.join(base, "gaeo", "secrets")


# ── Windows DPAPI (외부 의존성 없이 ctypes만) ────────────────────────────────
def _dpapi_available():
    return sys.platform == "win32"


def _dpapi(func_name, blob):
    import ctypes
    from ctypes import wintypes

    class _Blob(ctypes.Structure):
        _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]

    crypt32 = ctypes.windll.crypt32
    src = _Blob(len(blob), ctypes.cast(ctypes.create_string_buffer(blob), ctypes.POINTER(ctypes.c_char)))
    ent = _Blob(len(_ENTROPY), ctypes.cast(ctypes.create_string_buffer(_ENTROPY), ctypes.POINTER(ctypes.c_char)))
    out = _Blob()
    ok = getattr(crypt32, func_name)(
        ctypes.byref(src), None, ctypes.byref(ent), None, None, 0x1, ctypes.byref(out)
    )
    if not ok:
        raise OSError(func_name + " 실패")
    try:
        return ctypes.string_at(out.pbData, out.cbData)
    finally:
        if out.pbData:
            ctypes.windll.kernel32.LocalFree(out.pbData)


def _protect(raw):
    return _dpapi("CryptProtectData", raw) if _dpapi_available() else raw


def _unprotect(raw):
    return _dpapi("CryptUnprotectData", raw) if _dpapi_available() else raw


# ── 프로세스 간 잠금 ─────────────────────────────────────────────────────────
class _Lock(object):
    """파일 기반 배타 잠금. 잠금 파일에는 어떤 내용도 쓰지 않는다."""

    def __init__(self, path, timeout=LOCK_TIMEOUT_SECONDS):
        self.path = path
        self.timeout = timeout
        self._fh = None

    def __enter__(self):
        directory = os.path.dirname(self.path)
        if directory and not os.path.isdir(directory):
            os.makedirs(directory, exist_ok=True)
        self._fh = open(self.path, "a+b")
        deadline = time.monotonic() + self.timeout
        while True:
            try:
                self._acquire()
                return self
            except OSError:
                if time.monotonic() >= deadline:
                    self._fh.close()
                    self._fh = None
                    raise RuntimeError("shared token lock timeout")
                time.sleep(0.05)

    def __exit__(self, exc_type, exc, tb):
        try:
            self._release()
        finally:
            if self._fh is not None:
                self._fh.close()
                self._fh = None

    def _acquire(self):
        if sys.platform == "win32":
            import msvcrt

            self._fh.seek(0)
            msvcrt.locking(self._fh.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl

            fcntl.flock(self._fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)

    def _release(self):
        if self._fh is None:
            return
        try:
            if sys.platform == "win32":
                import msvcrt

                self._fh.seek(0)
                msvcrt.locking(self._fh.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                import fcntl

                fcntl.flock(self._fh.fileno(), fcntl.LOCK_UN)
        except OSError:
            pass


# ── 공유 토큰 읽기/쓰기 ──────────────────────────────────────────────────────
def _token_path():
    suffix = ".dpapi" if _dpapi_available() else ".bin"
    return os.path.join(secrets_dir(), _TOKEN_FILE + suffix)


def _lock_path():
    return os.path.join(secrets_dir(), _LOCK_FILE)


def read_shared(now=None):
    """공유 토큰을 읽는다. 없거나 손상됐거나 만료가 임박하면 None.

    반환값은 토큰 문자열이며, 값은 로그에 남기지 않는다.
    """
    now = time.time() if now is None else now
    path = _token_path()
    if not os.path.exists(path):
        return None
    try:
        with open(path, "rb") as fh:
            raw = _unprotect(fh.read())
        record = json.loads(raw.decode("utf-8"))
    except Exception:
        # 손상된 캐시는 조용히 버린다(내용은 어디에도 남기지 않는다).
        return None

    token = record.get("access_token")
    if not isinstance(token, str) or not token:
        return None
    expires_at = record.get("expires_at")
    if isinstance(expires_at, (int, float)):
        if now >= (expires_at - SKEW_SECONDS):
            return None
    # expires_at 이 없으면 시간만으로 버리지 않는다
    # (불필요한 재발급 하나하나가 다른 프로세스를 끊기 때문이다).
    return token


def write_shared(token, expires_in, now=None):
    now = time.time() if now is None else now
    directory = secrets_dir()
    os.makedirs(directory, exist_ok=True)
    record = {
        "access_token": token,
        "expires_at": (now + float(expires_in)) if expires_in else None,
        "issued_at": now,
    }
    raw = _protect(json.dumps(record).encode("utf-8"))
    path = _token_path()
    tmp = path + ".tmp"
    with open(tmp, "wb") as fh:
        fh.write(raw)
    os.replace(tmp, path)
    if sys.platform != "win32":
        try:
            os.chmod(path, 0o600)
        except OSError:
            pass
    return token


def acquire(issue_fn, dead_token=None):
    """공유 토큰을 얻는다. 필요할 때만 issue_fn() 을 호출한다.

    issue_fn 은 (token, expires_in) 을 돌려주는 함수다.
    dead_token 이 주어지면 그 값과 같은 공유 토큰은 무효로 본다(401을 받은 경우).
    """
    token = read_shared()
    if token and token != dead_token:
        return token

    with _Lock(_lock_path()):
        # 잠금을 잡는 사이 다른 프로세스가 이미 받아 뒀을 수 있다.
        token = read_shared()
        if token and token != dead_token:
            return token
        issued, expires_in = issue_fn()
        return write_shared(issued, expires_in)
