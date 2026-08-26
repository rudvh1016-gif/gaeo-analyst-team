#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공유 Toss 토큰 계약 — 기본 OFF, 켜면 발급 1회 (전부 오프라인).

배경:
    토스는 client 당 유효 access token을 1개만 유지하고, 새로 발급하면
    이전 토큰을 즉시 무효화한다. 집 PC에서 이 Paper Runner와 계좌 조회용
    Gateway가 각자 발급하면 서로를 끝없이 로그아웃시킨다.

검증 항목:
    D1. 기본은 꺼짐 — 환경변수를 켜지 않으면 기존 동작 100% 동일
    D2. 꺼진 상태에서는 공유 파일을 만들지도 읽지도 않는다
    D3. 켜면 두 클라이언트(=두 프로세스)가 같은 토큰을 쓰고 발급은 1회
    D4. 대조군 — 공유하지 않으면 실제로 서로를 무효화한다
    D5. 만료가 임박하면 갱신하고, 그 갱신도 공유된다
    D6. 401(죽은 토큰) 시 다른 쪽이 이미 갱신했으면 중복 발급하지 않는다
    D7. 손상된 캐시는 조용히 복구된다
    D8. 저장 파일에 토큰이 평문으로 남지 않는다(Windows DPAPI, 그 외는 개발용)
    D9. Trading Logic 파일을 건드리지 않았다 (변경 파일 목록 기준)
    D9b. 매매 판단 모듈에 공유토큰 기능이 스며들지 않았다 (git 이력 없이도 검사)
"""
import ast
import glob
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.error

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + ("" if cond or not detail else f" — {detail}"))
    if not cond:
        FAILURES.append(name)


#: 이 기능이 건드려도 되는 파일 — **token infrastructure 로만** 한정한다.
#: ⚠️ paper_engine.py · paper_history.py · paper_public.py · paper_report.py ·
#:    paper_trading/* 를 여기 절대 넣지 말 것. 넣는 순간 D9 는 Trading Logic 변경을
#:    통과시키는 가짜 검사가 된다. 새 파일이 늘면 "정말 토큰 경로인가"를 먼저 따진다.
TOKEN_INFRA_FILES = frozenset({
    "paper_market_data.py",           # 토큰 획득 경로(시세 provider) — 유일하게 수정되는 기존 파일
    "gaeo_shared_token.py",           # 공유 토큰 저장소 (신규)
    "test_shared_toss_token.py",      # 이 파일 (신규)
    "test_shared_token_hardening.py", # 장애 주입 계약 (신규)
    "docs/SHARED_TOSS_TOKEN.md",      # 문서 (신규)
    ".gitignore",                     # 공유 토큰 산출물이 커밋되지 않도록 하는 안전망
})

#: 매매 판단이 들어 있는 모듈. 공유토큰 기능이 여기 스며들면 즉시 실패한다.
# ⚠️ 목록에 없는 모듈은 D9b가 아예 읽지 않으므로 조용한 사각지대가 된다.
#    실제로 두 번 그런 일이 있었다(2026-08-26 paper_smart_v2.py · paper_momentum.py).
#    그래서 사람 손에만 맡기지 않는다 — D9c가 목록이 낡았는지 스스로 찾아낸다.
TRADING_LOGIC_MODULES = ("paper_engine.py", "paper_history.py",
                         "paper_public.py", "paper_report.py",
                         "paper_smart_v2.py", "paper_momentum.py",
                         # Single Writer 게이트 — 매매를 직접 하지는 않지만
                         # 매매를 할지 말지를 결정하므로 같은 잣대로 검사한다.
                         "paper_single_writer.py")

#: 목록이 낡았는지 자동으로 찾아내는 기준 — 이 흔적이 있으면 매매 판단 모듈이다.
#: (PaperEngine 을 쓰거나 원장 파일을 직접 다루면 매매 판단에 관여한다)
TRADING_LOGIC_MARKERS = ("PaperEngine", "trades.jsonl")


def _local_module_path(name):
    """import 이름이 이 저장소 안의 .py 파일이면 그 경로를, 아니면 None."""
    path = name.split(".")[0] + ".py"
    return path if os.path.exists(path) else None


def _import_graph(entry, seen=None):
    """entry 에서 실제로 도달 가능한 저장소 내부 모듈 이름 전부.

    ⚠️ 문자열 검색만으로는 'import 이름을 바꿔 다는' 우회를 못 잡는다
       (2026-08-26 보안 감사에서 실제로 재현됐다). 그래서 AST 로 import 를 따라간다.
       난독화(importlib + 문자열 조합)까지는 못 잡지만, 평범한 간접 참조는 잡는다.
    ⚠️ token infrastructure(paper_market_data 등)에서는 **더 들어가지 않는다.**
       매매 모듈이 승인된 provider 를 통해 시세를 받는 것은 설계 그대로이고,
       그 provider 가 내부에서 토큰을 다루는 것도 정상이다. 여기서 막아야 하는 것은
       "승인된 경로를 우회해 매매 모듈이 토큰에 닿는 것"이다. 이름은 기록하되
       내부까지 따라가지 않아야 정상 경로가 오탐으로 잡히지 않는다.
    """
    seen = seen if seen is not None else set()
    try:
        tree = ast.parse(io.open(entry, encoding="utf-8").read(), filename=entry)
    except (IOError, OSError, SyntaxError):
        return seen
    for node in ast.walk(tree):
        names = []
        if isinstance(node, ast.Import):
            names = [a.name for a in node.names]
        elif isinstance(node, ast.ImportFrom) and node.module and node.level == 0:
            names = [node.module]
        for name in names:
            root = name.split(".")[0]
            if root in seen:
                continue
            child = _local_module_path(root)
            if child is None:
                continue
            seen.add(root)
            if child in TOKEN_INFRA_FILES:
                continue          # 승인된 토큰 경로 — 이름만 남기고 더 들어가지 않는다
            _import_graph(child, seen)
    return seen


def _git(*args):
    """git 명령 1회. (성공여부, stdout) 을 돌려준다.

    returncode 를 반드시 본다 — 예전 구현은 stdout 만 읽어서, git 이 오류로 끝나
    빈 문자열을 돌려준 경우와 "정말 바뀐 파일이 없는" 경우를 구분하지 못했다.
    """
    try:
        proc = subprocess.run(["git"] + list(args), capture_output=True,
                              text=True, timeout=30)
    except (OSError, subprocess.SubprocessError):
        return False, ""
    return proc.returncode == 0, proc.stdout


def _changed_files():
    """이 브랜치가 바꾼 파일 목록. 얻을 수 없으면 None (빈 목록과 구분한다)."""
    ok, out = _git("diff", "--name-only", "origin/main...HEAD")
    if ok:
        return out.split()

    # GitHub Actions 의 pull_request 체크아웃은 refs/pull/N/merge 라 부모가 2개다
    # (HEAD^1 = base, HEAD^2 = PR head). origin/main ref 가 없어 위 비교는 실패하지만
    # 부모끼리 비교하면 PR 변경 파일을 그대로 얻는다. fetch-depth 가 2 이상이어야 한다.
    #
    # ⚠️ 부모가 정확히 2개일 때만 쓴다. 일반 브랜치에서 HEAD^1 과 비교하면
    #    "마지막 커밋 하나"만 보게 되어 검사가 조용히 헐거워진다.
    ok, parents = _git("rev-list", "--parents", "-n", "1", "HEAD")
    if ok and len(parents.split()) == 3:
        ok, out = _git("diff", "--name-only", "HEAD^1", "HEAD")
        if ok:
            return out.split()
    return None


# ── 가짜 토스 서버: '토큰 1개' 규칙을 그대로 흉내낸다 ────────────────────────
class FakeToss(object):
    def __init__(self):
        self.valid = None
        self.issued = 0
        self.unauthorized = 0

    def urlopen(self, req, timeout=None):
        url = req.full_url
        if "/oauth2/token" in url:
            self.issued += 1
            self.valid = "tok-%d" % self.issued
            return _resp({"access_token": self.valid, "expires_in": 900})
        presented = (req.headers.get("Authorization") or "").replace("Bearer ", "")
        if presented != self.valid:
            self.unauthorized += 1
            raise urllib.error.HTTPError(url, 401, "Unauthorized", _headers(), None)
        return _resp({"prices": []})


class _Ctx(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def _resp(payload):
    return _Ctx(json.dumps(payload).encode())


def _headers():
    import email.message

    return email.message.Message()


def fresh_env(tmpdir, shared):
    os.environ["TOSS_INVEST_CLIENT_ID"] = "test-client-id-not-real"
    os.environ["TOSS_INVEST_CLIENT_SECRET"] = "test-client-secret-not-real"
    os.environ["GAEO_SECRETS_DIR"] = tmpdir
    if shared:
        os.environ["GAEO_SHARED_TOSS_TOKEN"] = "1"
    else:
        os.environ.pop("GAEO_SHARED_TOSS_TOKEN", None)


def make_client(toss, monkey):  # noqa: D401
    import paper_market_data as pmd

    client = pmd.TossMarketDataProvider()
    monkey.append((pmd, pmd.urllib.request.urlopen))
    pmd.urllib.request.urlopen = toss.urlopen
    return client


def run():
    import paper_market_data as pmd
    import gaeo_shared_token as shared

    original_urlopen = pmd.urllib.request.urlopen
    tmp = tempfile.mkdtemp()
    try:
        # ── D1 / D2: 기본 OFF ─────────────────────────────────────────────
        fresh_env(tmp, shared=False)
        check("D1. 기본값은 꺼짐 (명시적으로 켜야 공유)", shared.enabled() is False)

        toss = FakeToss()
        pmd.urllib.request.urlopen = toss.urlopen
        a = pmd.TossMarketDataProvider()
        b = pmd.TossMarketDataProvider()
        a._access_token()
        b._access_token()
        check("D1b. 꺼진 상태의 동작은 종전과 동일(각자 발급)", toss.issued == 2,
              f"발급 {toss.issued}회")
        leftovers = [f for f in os.listdir(tmp) if f.startswith("toss_shared")]
        check("D2. 꺼진 상태에서는 공유 파일을 만들지 않는다", leftovers == [], str(leftovers))

        # ── D3: 켜면 발급 1회 ─────────────────────────────────────────────
        shutil.rmtree(tmp, ignore_errors=True)
        os.makedirs(tmp, exist_ok=True)
        fresh_env(tmp, shared=True)
        toss = FakeToss()
        pmd.urllib.request.urlopen = toss.urlopen
        runner = pmd.TossMarketDataProvider()
        gateway_like = pmd.TossMarketDataProvider()
        t1 = runner._access_token()
        t2 = gateway_like._access_token()
        check("D3. 두 클라이언트가 같은 토큰을 쓴다", t1 == t2, f"{t1} vs {t2}")
        check("D3b. 발급은 1회뿐", toss.issued == 1, f"발급 {toss.issued}회")
        check("D3c. 두 번째 쪽 토큰이 무효화되지 않았다", toss.valid == t1)

        # ── D4: 대조군 — 공유하지 않으면 서로 무효화 ──────────────────────
        toss2 = FakeToss()
        pmd.urllib.request.urlopen = toss2.urlopen
        os.environ.pop("GAEO_SHARED_TOSS_TOKEN", None)
        x = pmd.TossMarketDataProvider()
        y = pmd.TossMarketDataProvider()
        tx = x._access_token()
        y._access_token()
        check("D4. (대조군) 공유하지 않으면 앞 토큰이 무효가 된다",
              toss2.issued == 2 and toss2.valid != tx)

        # ── D5: 만료 갱신도 공유 ──────────────────────────────────────────
        shutil.rmtree(tmp, ignore_errors=True)
        os.makedirs(tmp, exist_ok=True)
        fresh_env(tmp, shared=True)
        toss3 = FakeToss()
        pmd.urllib.request.urlopen = toss3.urlopen
        p = pmd.TossMarketDataProvider()
        q = pmd.TossMarketDataProvider()
        p._access_token()
        # 저장된 만료 시각을 과거로 돌려 만료를 흉내낸다
        path = shared._token_path()
        with open(path, "rb") as fh:
            record = json.loads(shared._unprotect(fh.read()).decode())
        record["expires_at"] = 0
        with open(path, "wb") as fh:
            fh.write(shared._protect(json.dumps(record).encode()))
        p._token = None
        p._token_expires_at = 0
        refreshed = p._access_token()
        q._token = None
        q._token_expires_at = 0
        check("D5. 갱신된 토큰도 공유된다", q._access_token() == refreshed)
        check("D5b. 갱신은 1회만", toss3.issued == 2, f"발급 {toss3.issued}회")

        # ── D6: 401 중복 발급 방지 ────────────────────────────────────────
        toss4 = FakeToss()
        pmd.urllib.request.urlopen = toss4.urlopen
        shutil.rmtree(tmp, ignore_errors=True)
        os.makedirs(tmp, exist_ok=True)
        fresh_env(tmp, shared=True)
        m = pmd.TossMarketDataProvider()
        n = pmd.TossMarketDataProvider()
        stale = m._access_token()          # tok-1
        m._dead_token = stale
        m._token = None
        fresh = m._access_token()          # tok-2 (실제 갱신)
        n._dead_token = stale              # n 도 401을 받았다고 가정
        n._token = None
        recovered = n._access_token()
        check("D6. 이미 갱신됐으면 중복 발급하지 않는다",
              recovered == fresh and toss4.issued == 2, f"발급 {toss4.issued}회")

        # ── D7: 손상된 캐시 복구 ──────────────────────────────────────────
        with open(shared._token_path(), "wb") as fh:
            fh.write(b"corrupted-not-json")
        toss5 = FakeToss()
        pmd.urllib.request.urlopen = toss5.urlopen
        r = pmd.TossMarketDataProvider()
        check("D7. 손상된 캐시는 조용히 복구된다", bool(r._access_token()) and toss5.issued == 1)

        # ── D8: 평문 미저장 ───────────────────────────────────────────────
        with open(shared._token_path(), "rb") as fh:
            blob = fh.read()
        if sys.platform == "win32":
            check("D8. 저장 파일에 토큰 평문이 없다(DPAPI)", toss5.valid.encode() not in blob)
        else:
            check("D8. (비Windows 개발환경) 저장 경로가 저장소 밖이다",
                  os.path.abspath(tmp) not in os.path.abspath(os.getcwd()))

    finally:
        pmd.urllib.request.urlopen = original_urlopen
        shutil.rmtree(tmp, ignore_errors=True)
        for key in ("GAEO_SHARED_TOSS_TOKEN", "GAEO_SECRETS_DIR"):
            os.environ.pop(key, None)

    # ── D9 / D9b: Trading Logic 무변경 ────────────────────────────────────
    #
    # 이 기능이 건드리는 것은 "토큰을 어떻게 얻는가" 하나뿐이다.
    # 매매 판단(BUY/SELL/HOLD)·비중·진입/청산·원장·전략은 한 줄도 바뀌면 안 된다.
    #
    # ⚠️ 예전 구현은 git diff 가 실패하면 조용히 [SKIP] 했다. 그런데 얕은 클론과
    #    GitHub Actions 의 pull_request 체크아웃(기본 fetch-depth=1, 게다가 HEAD 가
    #    refs/pull/N/merge 라 origin/main 이라는 ref 자체가 없다)에서는 그 비교가
    #    **항상** 실패한다. 즉 이 검사는 정작 돌아야 할 곳에서 한 번도 돈 적이 없고,
    #    로그에는 통과처럼 보이는 [SKIP] 만 남았다. 이제는 어떤 환경에서도
    #    반드시 무언가를 검사한다 — 이력이 있으면 D9, 없으면 D9b 로 내려간다.
    changed = _changed_files()
    if changed is None:
        print("[INFO] D9. git 변경 목록을 얻을 수 없어 D9b(이력 불필요 검사)로 대체합니다")
    else:
        # ⚠️ 2026-08-21 수정: 예전 구현은 "허용목록에 없는 파일이 하나라도 바뀌면 실패"였다.
        #    이름은 「Trading Logic 파일 변경 0」인데 실제로는 무관한 파일까지 전부 잡아서,
        #    토스 토큰 브랜치가 아닌 **모든** 브랜치에서 무조건 실패했다(순환매 작업 브랜치에서
        #    실제로 터졌다). 검사 이름이 약속하는 것만 검사한다 — 매매 판단 모듈과
        #    paper_trading/ 산출물이 바뀌었는지. 허용목록은 그중 토큰 경로 하나(paper_market_data.py)를
        #    예외로 두는 데만 쓴다.
        #    가드가 약해지는 게 아니다. 아래 D9b가 매매 판단 모듈 본문을 직접 읽어
        #    공유토큰 기능이 스며들었는지 이력과 무관하게 항상 검사한다.
        # ⚠️ 2026-08-26 수정: "바뀌었는가"가 아니라 "공유토큰이 스며들었는가"를 본다.
        #    이 검사가 약속하는 것은 '공유토큰 기능이 매매 판단을 건드리지 않았다'인데,
        #    예전 구현은 파일이 바뀌기만 해도 실패해서 **매매 로직을 정당하게 고치는
        #    브랜치는 무조건 터졌다**(모의투자 회계 수리 브랜치에서 실제로 터졌다).
        #    그러면 개발자는 검사를 끄거나 허용목록을 넓히게 되고, 가드는 그때 죽는다.
        #    그래서 바뀐 파일의 '내용'에 공유토큰 흔적이 있는지로 판정한다 —
        #    파일 목록만 보는 것보다 오히려 촘촘하다(paper_trading/ 산출물까지 읽는다).
        def _is_trading_logic(path):
            return path in TRADING_LOGIC_MODULES or path.startswith("paper_trading/")

        def _has_token_trace(path):
            try:
                with io.open(path, encoding="utf-8", errors="replace") as fh:
                    body = fh.read()
            except (IOError, OSError):
                return False        # 지워진 파일은 흔적을 남길 수 없다
            return "gaeo_shared_token" in body or "GAEO_SHARED_TOSS_TOKEN" in body
        unexpected = sorted(f for f in changed
                            if _is_trading_logic(f) and f not in TOKEN_INFRA_FILES
                            and _has_token_trace(f))
        check("D9. 바뀐 Trading Logic 파일에 공유토큰 흔적 0", unexpected == [],
              str(unexpected))

    # D9b 는 이력 유무와 무관하게 **항상** 돈다.
    # 허용목록(TOKEN_INFRA_FILES)을 넓히는 것만으로는 이 검사를 통과할 수 없다 —
    # 매매 판단 모듈 자체를 읽어서 공유토큰 기능이 새어 들어갔는지 본다.
    leaked = []
    for module in TRADING_LOGIC_MODULES:
        if not os.path.exists(module):
            leaked.append(module + " (파일 없음 — 목록을 갱신할 것)")
            continue
        with io.open(module, encoding="utf-8") as fh:
            source = fh.read()
        if "gaeo_shared_token" in source or "GAEO_SHARED_TOSS_TOKEN" in source:
            leaked.append(module)
    check("D9b. 매매 판단 모듈에 공유토큰 흔적 0", leaked == [], str(leaked))

    # D9c — 목록 자체가 낡았는지 검사한다. 새 매매 판단 모듈을 만들고 등록을 잊으면
    #        D9·D9b 가 그 파일을 아예 읽지 않아 검사가 조용히 통과해 버린다.
    #        (2026-08-26 보안 감사 MEDIUM-1: paper_momentum.py 가 정확히 그 상태였다)
    unregistered = []
    for path in sorted(glob.glob("paper_*.py")):
        try:
            body = io.open(path, encoding="utf-8").read()
        except (IOError, OSError):
            continue
        if not any(marker in body for marker in TRADING_LOGIC_MARKERS):
            continue
        if path not in TRADING_LOGIC_MODULES:
            unregistered.append(path)
    check("D9c. 매매 판단 모듈이 전부 목록에 등록돼 있다", unregistered == [],
          str(unregistered) + " — TRADING_LOGIC_MODULES 에 추가할 것")

    # D9d — import 를 따라가 공유토큰이 '간접적으로' 실려 들어왔는지 본다.
    #        문자열 검색만 하면 중간 모듈을 하나 끼우는 것만으로 우회된다
    #        (2026-08-26 보안 감사 LOW-2 에서 실제 우회가 재현됐다).
    indirect = []
    for module in TRADING_LOGIC_MODULES:
        if not os.path.exists(module):
            continue
        if "gaeo_shared_token" in _import_graph(module):
            indirect.append(module)
    check("D9d. 매매 판단 모듈이 공유토큰을 간접적으로도 끌어오지 않는다",
          indirect == [], str(indirect))


run()
print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_shared_toss_token: 전체 통과 (기본 OFF · 공유 시 발급 1회 · 대조군 확인)")
