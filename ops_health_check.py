#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 운영 상태 점검 — 사람이 Actions 로그 전체를 읽지 않아도 되게 요약한다.

⚠️ Static GitHub Pages 사이트에 '관리자 페이지'를 만들지 않는다.
   이 스크립트는 러너/로컬에서 상태표만 출력하고, GITHUB_STEP_SUMMARY가 있으면
   Actions 요약 탭에도 같은 표를 남긴다.
⚠️ Secret 값·Key 값·환경 dump는 절대 출력하지 않는다(상태 이름만).
"""
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
KST = timezone(timedelta(hours=9))


def _mtime(path):
    try:
        ts = os.path.getmtime(os.path.join(HERE, path))
        return datetime.fromtimestamp(ts, KST).strftime("%m-%d %H:%M")
    except OSError:
        return None


def _read_json(path):
    try:
        with open(os.path.join(HERE, path), encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _js_value(path, pattern):
    try:
        s = open(os.path.join(HERE, path), encoding="utf-8").read(200_000)
        m = re.search(pattern, s)
        return m.group(1) if m else None
    except OSError:
        return None


def collect():
    rows = []

    def add(name, ok, note):
        rows.append((name, "OK" if ok else "확인 필요", note or ""))

    price_at = _js_value("data.js", r'"asOf"\s*:\s*"([^"]+)"') or _mtime("data.js")
    add("시세 데이터", bool(price_at), f"기준 {price_at}")

    auto_at = _js_value("auto_analysis.js", r'"generatedAt"\s*:\s*"([^"]+)"')
    add("자동분석", bool(auto_at), f"기준 {auto_at}")

    mu = _read_json("market_universe/state.json")
    add("전체시장 수집", bool(mu and mu.get("status") == "READY"),
        f"{(mu or {}).get('status')} · raw {(mu or {}).get('rawCount')} · {(mu or {}).get('asOf', '')[:16]}")

    dart = _read_json("research_archive/dart/corp_map.json")
    add("DART 매핑", bool(dart),
        f"{(dart or {}).get('mappedCount')}/{(dart or {}).get('universeSize')}")

    # 모델 성적 집계 + Research Key 상태 — 값이 아니라 상태 이름만.
    try:
        import research_crypto
        key_state = research_crypto.key_status()
    except Exception:
        key_state = "UNKNOWN"
    sb_at = _js_value("model_scoreboard.js", r'"generatedAt"\s*:\s*"([^"]+)"')
    key_ok = key_state == "OK"
    add("모델 성적 집계", bool(sb_at), f"기준 {str(sb_at)[:16]}")
    add("연구 아카이브 Key", key_ok,
        "정상" if key_ok else
        f"{key_state} — GitHub Settings → Secrets → Actions에 RESEARCH_ARCHIVE_KEY 등록 필요"
        if key_state == research_crypto.KEY_MISSING else key_state)

    live_days = 0
    live_root = os.path.join(HERE, "research_archive", "live")
    if os.path.isdir(live_root):
        for _r, _d, files in os.walk(live_root):
            live_days += sum(1 for f in files if f.endswith((".jsonl", ".jsonl.gz", ".enc")))
    add("연구 기록(암호화 Segment)", live_days > 0 or not key_ok,
        f"{live_days}개 파일" + ("" if live_days else " — Key 등록 후 자동으로 쌓입니다"))

    add("종목 스냅샷", bool(_mtime("snap/index.html")), f"갱신 {_mtime('snap/index.html')}")
    add("sitemap", bool(_mtime("sitemap.xml")), f"갱신 {_mtime('sitemap.xml')}")

    # Paper Trading(가상매매) — 있으면 상태만. Secret·계좌 정보는 다루지 않는다.
    ps = _read_json("paper_trading/state.json")
    if ps:
        summ = _read_json("paper_trading/summary.json") or {}
        add("가상매매 엔진", True,
            f"{ps.get('lastCycleResult', '')[:34]} · 진행 {summ.get('openTrades', 0)}건 "
            f"· 종료 {summ.get('maturedTrades', 0)}건 · {str(ps.get('lastCycleAt', ''))[:16]}")
    else:
        add("가상매매 엔진", True, "대기 — Forward 시작 2026-08-18 (Toss Secret 등록 필요)")
    return rows


def main():
    rows = collect()
    width = max(len(n) for n, _s, _x in rows)
    print("GAEO OPERATIONS STATUS")
    lines_md = ["| 항목 | 상태 | 비고 |", "|---|---|---|"]
    warn = 0
    for name, state, note in rows:
        print(f"  {name:<{width}}  {state:<6} {note}")
        lines_md.append(f"| {name} | {state} | {note} |")
        if state != "OK":
            warn += 1
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        try:
            with open(summary, "a", encoding="utf-8") as f:
                f.write("\n## GAEO 운영 상태\n" + "\n".join(lines_md) + "\n")
        except OSError:
            pass
    print(f"— 확인 필요 {warn}건" if warn else "— 전 항목 정상")
    return 0    # 상태 보고용 — 파이프라인을 멈추지 않는다


if __name__ == "__main__":
    sys.exit(main())
