#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Single Writer 계약 : 활성이 아닌 러너는 매매 계산 0 · 원장 변경 0 · push 0.

두 러너(집 Windows PC · Oracle Linux VM)가 같은 Paper 원장을 동시에 쓰면 원장이
갈라지고 되돌릴 수 없다. 이 테스트는 "비활성 러너로 사이클을 돌려도 파일 해시가
그대로이고 시세 provider가 한 번도 안 만들어진다"를 기계로 고정한다.

⚠️ 이 테스트는 저장소의 진짜 paper_trading/을 절대 건드리지 않는다.
   임시 폴더로 복사한 뒤 각 모듈의 데이터 경로를 그 복사본으로 돌려놓고 돌린다
   (게이트가 고장 나 실제로 엔진이 돌더라도 피해가 임시 폴더 안에서 끝나도록).
"""
import hashlib
import io
import json
import os
import shutil
import sys
import tempfile
from contextlib import redirect_stdout

import paper_single_writer as sw
import paper_market_data as pmd
import paper_engine as pe
import paper_smart_v2 as sv
import paper_momentum as pm
import paper_public as pp

HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" ({detail})" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def write_config(path, active):
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"schemaVersion": "gaeo_paper_runner_v1", "activeRunner": active}, f)
    return path


def tree_hash(root):
    """폴더 전체를 (상대경로 → sha256)으로. 파일 목록 자체의 변화도 잡는다."""
    out = {}
    for base, _dirs, files in os.walk(root):
        for name in files:
            p = os.path.join(base, name)
            with open(p, "rb") as f:
                out[os.path.relpath(p, root)] = hashlib.sha256(f.read()).hexdigest()
    return out


class SpyProvider:
    """시세 provider 대역. 만들어지기만 해도 세고, 어떤 호출이든 센다."""

    name = "TOSS"
    instances = 0
    calls = 0

    def __init__(self, *a, **k):
        SpyProvider.instances += 1

    def __getattr__(self, item):
        def _boom(*a, **k):
            SpyProvider.calls += 1
            raise pmd.MarketDataUnavailable(f"테스트 대역은 호출되면 안 된다: {item}")
        return _boom

    @classmethod
    def reset(cls):
        cls.instances = 0
        cls.calls = 0


# ═══ ① 순수 판정 ══════════════════════════════════════════════════════════════
d = sw.decide("WINDOWS", "WINDOWS")
check("1a. 선언과 활성이 같으면 통과", d.allowed and d.code == sw.ACTIVE, d.code)
d = sw.decide("ORACLE", "WINDOWS")
check("1b. 활성이 아닌 러너는 차단", (not d.allowed) and d.code == sw.NOT_ACTIVE, d.code)
d = sw.decide("", "WINDOWS")
check("1c. 선언이 없으면 차단(fail closed)", (not d.allowed) and d.code == sw.UNDECLARED, d.code)
d = sw.decide("NAS", "WINDOWS")
check("1d. 모르는 러너 이름은 차단", (not d.allowed) and d.code == sw.UNKNOWN_NAME, d.code)
d = sw.decide("WINDOWS", "", sw.CONFIG_MISSING)
check("1e. 설정을 못 읽으면 차단", (not d.allowed) and d.code == sw.CONFIG_MISSING, d.code)
check("1f. 소문자·공백 선언도 같은 러너로 본다",
      sw.decide(sw._norm("  oracle "), "ORACLE").allowed)
check("1g. 차단 사유 문구에 Secret이 들어갈 자리가 없다",
      all(x not in sw.decide("NAS", "WINDOWS").message.lower()
          for x in ("secret", "token", "bearer")))

# ═══ ② 설정 파일 읽기 ═════════════════════════════════════════════════════════
cfg_dir = tempfile.mkdtemp(prefix="sw_cfg_")
ok_cfg = write_config(os.path.join(cfg_dir, "ok.json"), "ORACLE")
check("2a. 정상 설정을 읽는다", sw.read_active_runner(ok_cfg) == ("ORACLE", ""))
check("2b. 파일이 없으면 CONFIG_MISSING",
      sw.read_active_runner(os.path.join(cfg_dir, "nope.json"))[1] == sw.CONFIG_MISSING)
bad = os.path.join(cfg_dir, "bad.json")
open(bad, "w", encoding="utf-8").write("{ this is not json")
check("2c. 깨진 파일이면 CONFIG_UNREADABLE",
      sw.read_active_runner(bad)[1] == sw.CONFIG_UNREADABLE)
weird = write_config(os.path.join(cfg_dir, "weird.json"), "EVERYONE")
check("2d. 모르는 activeRunner 값이면 CONFIG_INVALID",
      sw.read_active_runner(weird)[1] == sw.CONFIG_INVALID)
empty = os.path.join(cfg_dir, "empty.json")
open(empty, "w", encoding="utf-8").write("[]")
check("2e. dict가 아니면 CONFIG_INVALID", sw.read_active_runner(empty)[1] == sw.CONFIG_INVALID)

# ═══ ③ 저장소에 실제로 커밋된 설정 ════════════════════════════════════════════
real_active, real_err = sw.read_active_runner()
check("3a. 저장소 설정이 유효하다", real_err == "" and real_active in sw.KNOWN_RUNNERS,
      f"{real_active}/{real_err}")
check("3b. 활성 러너 설정은 러너 커밋 화이트리스트 밖에 있다(러너가 자기를 켤 수 없다)",
      not sw.CONFIG_PATH.replace("\\", "/").endswith("paper_trading/" + sw.CONFIG_FILENAME)
      and os.path.dirname(sw.CONFIG_PATH) == HERE)

# ═══ ④ 러너 스크립트가 자기 이름을 선언한다 ═══════════════════════════════════
ps1 = open(os.path.join(HERE, "scripts", "paper_cycle.ps1"), encoding="utf-8-sig").read()
check("4a. Windows 사이클 스크립트가 WINDOWS를 선언한다",
      "GAEO_PAPER_RUNNER" in ps1 and "'WINDOWS'" in ps1)
sh_path = os.path.join(HERE, "scripts", "paper_cycle.sh")
check("4b. Linux 사이클 스크립트가 있다", os.path.exists(sh_path))
if os.path.exists(sh_path):
    shtxt = open(sh_path, encoding="utf-8").read()
    check("4c. Linux 사이클 스크립트가 ORACLE을 선언한다",
          "GAEO_PAPER_RUNNER" in shtxt and "ORACLE" in shtxt)
    check("4d. Linux 러너도 동기화 뒤에 게이트가 걸린다(설정 변경을 읽을 수 있어야 한다)",
          shtxt.index("fetch origin") < shtxt.index("run_paper_script paper_engine.py"))

# ═══ ⑤ 비활성 러너 사이클 : 원장 해시 그대로 · provider 0회 ═══════════════════
saved = {
    "env": os.environ.get(sw.ENV_NAME),
    "mom": os.environ.get(pm.ENABLE_ENV),
    "cfg": sw.CONFIG_PATH,
    "pe_dir": pe.DEFAULT_DIR, "sv_dir": sv.DATA_DIR, "pm_dir": pm.DATA_DIR,
    "pp_dir": pp.DIR, "pp_out": pp.OUT,
    "provider": pmd.TossMarketDataProvider,
}


def run_all(label):
    """러너가 부르는 순서 그대로 진입점 4개를 돈다. 반환 (stdout, rc들)."""
    buf = io.StringIO()
    with redirect_stdout(buf):
        rcs = [pe.run_safe(), pm.run_safe(), sv.run_safe(), pp.main()]
    print(f"    [{label}] " + " / ".join(
        l for l in buf.getvalue().splitlines() if l.strip())[:400])
    return buf.getvalue(), rcs


try:
    pmd.TossMarketDataProvider = SpyProvider
    # 토스 자격증명이 실제로 있는 환경(운영 PC)에서도 결과가 같도록 비운다.
    for _k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
        saved[_k] = os.environ.pop(_k, None)

    # ── 비활성(선언 ORACLE · 활성 WINDOWS) ──────────────────────────────────
    work = tempfile.mkdtemp(prefix="sw_off_")
    shutil.copytree(os.path.join(HERE, "paper_trading"), os.path.join(work, "paper_trading"))
    pe.DEFAULT_DIR = os.path.join(work, "paper_trading")
    sv.DATA_DIR = os.path.join(work, "paper_trading", "smart_v2")
    pm.DATA_DIR = os.path.join(work, "paper_trading", "momentum")
    pp.DIR = os.path.join(work, "paper_trading")
    pp.OUT = os.path.join(work, "paper_public.js")
    sw.CONFIG_PATH = write_config(os.path.join(work, "runner.json"), "WINDOWS")
    os.environ[sw.ENV_NAME] = "ORACLE"
    os.environ[pm.ENABLE_ENV] = "1"          # 모멘텀까지 켜 놓고도 아무 일이 없어야 한다

    before = tree_hash(work)
    SpyProvider.reset()
    out_off, rcs_off = run_all("비활성")

    check("5a. 비활성 러너도 정상 종료한다(exit 0)", rcs_off == [0, 0, 0, 0], str(rcs_off))
    check("5b. 비활성 러너는 원장 파일 해시를 하나도 바꾸지 않는다",
          tree_hash(work) == before,
          str([k for k, v in tree_hash(work).items() if before.get(k) != v]))
    check("5c. 비활성 러너는 새 파일도 만들지 않는다(momentum 폴더 포함)",
          not os.path.exists(pm.DATA_DIR) and not os.path.exists(pp.OUT))
    check("5d. 비활성 러너는 시세 provider를 만들지 않는다(토큰 발급 0)",
          SpyProvider.instances == 0, f"instances={SpyProvider.instances}")
    check("5e. 비활성 러너는 시세 API를 한 번도 호출하지 않는다",
          SpyProvider.calls == 0, f"calls={SpyProvider.calls}")
    check("5f. 네 진입점 모두 같은 사유를 남긴다(조용히 죽지 않는다)",
          out_off.count("이 러너는 비활성입니다") == 4, out_off)

    # ── 선언 자체가 없을 때도 같아야 한다 ───────────────────────────────────
    os.environ.pop(sw.ENV_NAME, None)
    SpyProvider.reset()
    out_none, rcs_none = run_all("선언없음")
    check("6a. 선언이 없으면 아무 것도 하지 않는다", rcs_none == [0, 0, 0, 0], str(rcs_none))
    check("6b. 선언이 없을 때도 파일 해시 그대로", tree_hash(work) == before)
    check("6c. 선언이 없을 때도 provider 0회", SpyProvider.instances == 0)
    check("6d. 선언이 없다는 사유가 로그에 남는다",
          out_none.count("러너 이름 선언이 없어") == 4)

    # ── 설정 파일이 사라져도 fail closed ────────────────────────────────────
    os.environ[sw.ENV_NAME] = "WINDOWS"
    sw.CONFIG_PATH = os.path.join(work, "gone.json")
    SpyProvider.reset()
    out_gone, _ = run_all("설정없음")
    check("7a. 설정 파일이 없으면 활성 선언이어도 돌지 않는다", SpyProvider.instances == 0)
    check("7b. 설정 파일이 없어도 파일 해시 그대로", tree_hash(work) == before)

    # ── ⑧ 뮤테이션 대조군 : 활성 러너는 실제로 provider를 만든다 ────────────
    #    (게이트가 "항상 차단"이면 위 검사들은 전부 통과해도 의미가 없다.
    #     활성일 때 실제로 통과한다는 반대 방향을 같은 테스트에서 고정한다)
    live = tempfile.mkdtemp(prefix="sw_on_")
    shutil.copytree(os.path.join(HERE, "paper_trading"), os.path.join(live, "paper_trading"))
    pe.DEFAULT_DIR = os.path.join(live, "paper_trading")
    sv.DATA_DIR = os.path.join(live, "paper_trading", "smart_v2")
    pm.DATA_DIR = os.path.join(live, "paper_trading", "momentum")
    pp.DIR = os.path.join(live, "paper_trading")
    pp.OUT = os.path.join(live, "paper_public.js")
    sw.CONFIG_PATH = write_config(os.path.join(live, "runner.json"), "WINDOWS")
    os.environ[sw.ENV_NAME] = "windows"      # 대소문자가 달라도 활성이어야 한다
    live_before = tree_hash(live)
    SpyProvider.reset()
    out_on, rcs_on = run_all("활성")

    check("8a. 활성 러너는 게이트를 통과한다", "활성 러너입니다" in out_on)
    check("8b. 활성 러너는 시세 provider를 실제로 만든다(게이트가 항상 차단이 아니다)",
          SpyProvider.instances >= 1, f"instances={SpyProvider.instances}")
    check("8c. 활성 러너는 실제로 기록을 남긴다(비활성과 결과가 다르다)",
          tree_hash(live) != live_before)
finally:
    pmd.TossMarketDataProvider = saved["provider"]
    sw.CONFIG_PATH = saved["cfg"]
    pe.DEFAULT_DIR, sv.DATA_DIR, pm.DATA_DIR = saved["pe_dir"], saved["sv_dir"], saved["pm_dir"]
    pp.DIR, pp.OUT = saved["pp_dir"], saved["pp_out"]
    for key, name in ((sw.ENV_NAME, "env"), (pm.ENABLE_ENV, "mom")):
        os.environ.pop(key, None)
        if saved[name] is not None:
            os.environ[key] = saved[name]
    for _k in (pmd.CLIENT_ID_ENV, pmd.CLIENT_SECRET_ENV):
        if saved.get(_k) is not None:
            os.environ[_k] = saved[_k]

print()
if FAILURES:
    print(f"❌ 실패 {len(FAILURES)}건: " + ", ".join(FAILURES))
    sys.exit(1)
print("✅ Single Writer 계약 전부 통과")
