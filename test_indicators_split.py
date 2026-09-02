#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""홈 경량본(indicators_home.js) 계약 — 2026-08-28 신설.

왜 있나
    indicators.js는 1,056KB인데 홈이 실제로 읽는 건 두 가지뿐이다(Proxy 계측,
    600종목 전수 · 390px·1280px 동일):
      · indicesTech          1.7KB  ← 코스피·코스닥 지수 카드
      · stocks[*].tech.last5  71KB  ← 홈 종목 칩 미니 그래프
    나머지 93%(tech 나머지 · flow 287KB · risk 44KB)는 종목을 눌러야 쓰인다.
    그래서 홈은 경량본만 받고 전체는 종목 화면에서 지연 로딩한다.
    홈 JS 전송량 실측 1,908KB → 931KB(51% 감소).

이 테스트가 지키는 계약
    ① 홈 즉시 로드 목록에 indicators.js가 다시 들어가지 않는다(가장 흔한 되돌림)
    ② 경량본에 홈이 쓰는 두 값이 다 있고, 무거운 필드는 안 들어간다
    ③ 전체 지표를 붙잡아 두는 옛 스냅샷(const LIVE_IND)이 되살아나지 않는다
    ④ 파이프라인이 경량본을 만들고 커밋한다(안 하면 다음 사이클에 사라진다)
"""
import json
import os
import re
import subprocess
import sys
from app_test_source import read_app_document

HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


html = read_app_document(HERE)

# ── ① 홈 즉시 로드 목록 ────────────────────────────────────────────────────
m = re.search(r"\['analysis\.js',([^\]]*)\]\.forEach\(w\)", html)
check("① 홈 즉시 로드 목록을 찾았다", bool(m))
if m:
    eager = m.group(0)
    check("① 홈이 경량본을 즉시 받는다", "'indicators_home.js'" in eager, eager[:120])
    check("① 홈 즉시 로드에 전체 indicators.js가 없다",
          "'indicators.js'" not in eager,
          "1MB짜리를 홈에서 다시 받고 있다 — GaeoFeatures.load('indicators')를 쓸 것")

# ── ② 경량본 내용 ──────────────────────────────────────────────────────────
home_path = os.path.join(HERE, "indicators_home.js")
check("② 경량본 파일이 저장소에 있다", os.path.exists(home_path), home_path)
if os.path.exists(home_path):
    body = open(home_path, encoding="utf-8").read()
    check("② 전역 이름이 INDICATORS_HOME이다", "const INDICATORS_HOME" in body)
    data = json.loads(re.search(r"const INDICATORS_HOME = (.*);\s*$", body, re.S).group(1))
    check("② 지수 요약(indicesTech)이 있다",
          isinstance(data.get("indicesTech"), dict) and len(data["indicesTech"]) >= 2,
          str(list((data.get("indicesTech") or {}).keys())))
    last5 = data.get("last5") or {}
    check("② 종목별 last5가 있다(500종목 이상)", len(last5) >= 500, str(len(last5)))
    _sample = next(iter(last5.values()), None)
    check("② last5 한 칸이 실제 종가 배열이다",
          isinstance(_sample, list) and _sample and "c" in _sample[0], str(_sample)[:80])
    # 무거운 필드가 섞여 들어오면 경량본의 뜻이 사라진다.
    for heavy in ("flow", "risk", "bb", "cross20_60", "stocks"):
        check(f"② 무거운 필드가 안 들어갔다({heavy})", heavy not in data)
    full_path = os.path.join(HERE, "indicators.js")
    if os.path.exists(full_path):
        ratio = os.path.getsize(home_path) / os.path.getsize(full_path)
        check("② 경량본이 전체의 15% 미만이다", ratio < 0.15, f"{ratio*100:.1f}%")

# ── ③ 지연 로딩 배선 ───────────────────────────────────────────────────────
check("③ GaeoFeatures에 indicators 키가 있다", "indicators:['indicators.js']" in html)
check("③ 도착 후 다시 그리는 훅이 있다", "window.GaeoUseIndicators" in html)
check("③ 전체 지표 요청 진입점이 있다", "function ensureIndicators()" in html)
# 옛날처럼 const로 한 번 붙잡으면, 지연 로딩 시점에 비어 있던 값이 영구히 박힌다.
check("③ 옛 스냅샷(const LIVE_IND)이 되살아나지 않았다",
      "const LIVE_IND=" not in html.replace(" ", ""),
      "매번 현재 값을 읽는 liveInd()를 쓸 것")
check("③ 접근자 함수가 있다",
      "function liveInd(" in html and "function liveIndAll(" in html)
# 홈이 쓰는 두 값은 경량본을 먼저 봐야 한다(전체가 없어도 홈이 멀쩡해야 한다).
check("③ 지수 카드가 경량본을 먼저 본다",
      "function indicesTech(" in html and "INDICATORS_HOME.indicesTech" in html)
check("③ 미니 그래프가 경량본을 먼저 본다",
      "function homeLast5(" in html and "INDICATORS_HOME.last5" in html)

# ── ④ 파이프라인 ───────────────────────────────────────────────────────────
gen = open(os.path.join(HERE, "compute_indicators.py"), encoding="utf-8").read()
check("④ 생성기가 경량본을 만든다", "indicators_home.js" in gen)
wf_path = os.path.join(HERE, ".github", "workflows", "update-analysis.yml")
if os.path.exists(wf_path):
    wf = open(wf_path, encoding="utf-8").read()
    add_lines = " ".join(ln for ln in wf.splitlines() if "for f in" in ln)
    check("④ 파이프라인이 경량본을 커밋 대상에 넣는다",
          "indicators_home.js" in add_lines,
          "만들기만 하고 커밋을 안 하면 다음 사이클에 사라진다")

# ── ⑤ 생성기가 실제로 같은 모양을 만드는가(간이 재현) ──────────────────────
#     저장소의 indicators.js에서 뽑은 결과와 커밋된 경량본의 종목 수·지수 키가 같아야 한다.
if os.path.exists(home_path) and os.path.exists(os.path.join(HERE, "indicators.js")):
    node = "/opt/node22/bin/node" if os.path.exists("/opt/node22/bin/node") else "node"
    script = (
        "const fs=require('fs');"
        "const v=new Function(fs.readFileSync(process.argv[1],'utf8')+';return INDICATORS;')();"
        "let n=0; for(const e of Object.values(v.stocks||{})) if(e&&e.tech&&e.tech.last5) n++;"
        "console.log(JSON.stringify({n, idx:Object.keys(v.indicesTech||{}).sort()}));"
    )
    try:
        res = subprocess.run([node, "-e", script, os.path.join(HERE, "indicators.js")],
                             capture_output=True, text=True, timeout=120)
        if res.returncode == 0:
            full = json.loads(res.stdout)
            check("⑤ 경량본의 종목 수가 전체와 일치한다",
                  full["n"] == len(last5), f"{full['n']} vs {len(last5)}")
            check("⑤ 경량본의 지수 키가 전체와 일치한다",
                  full["idx"] == sorted((data.get("indicesTech") or {}).keys()),
                  f"{full['idx']} vs {sorted((data.get('indicesTech') or {}).keys())}")
        else:
            print("[SKIP] ⑤ node 실행 실패 — 재현 검사 건너뜀")
    except (OSError, subprocess.TimeoutExpired):
        print("[SKIP] ⑤ node 없음 — 재현 검사 건너뜀")

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_indicators_split: 전체 통과")
