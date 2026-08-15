#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Coverage 500 → 600 확대를 위한 신규 100종목 후보 선정 (요구 23번).

원천
    krx_list.json — fetch_krx_list.py가 네이버 시가총액 순위 API에서 받아 온
    코스피·코스닥 전 상장종목. **시가총액 내림차순**이라 배열 순서가 곧 시총 순위다.
    종목코드·종목명·시장은 이 파일을 Source of Truth로 삼는다(이름을 추측하지 않는다).

제외 규칙 (요구 23번)
    ETF · ETN · SPAC · 리츠 · 우선주 · 이미 GAEO에 있는 종목
    ⚠️ 우선주를 넣어 숫자를 채우지 않는다. 같은 회사가 Breadth에서 두 표를 갖게 된다.
    ⚠️ "최근 많이 오른 종목"만으로 뽑지 않는다. 이 스크립트는 등락률을 아예 안 본다.

선정 방향
    코스피 위주(75~85개 목표) · 시총/대표성 상위 · 현재 GAEO에 부족한 업종 보강
"""
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))

# ETF/ETN 브랜드 접두어. 실제 krx_list.json에 등장하는 이름에서 확인한 값들이다.
FUND_BRANDS = (
    "KODEX", "TIGER", "RISE", "ACE", "PLUS", "HANARO", "SOL ", "TIME ", "KOSEF",
    "ARIRANG", "KINDEX", "KBSTAR", "히어로즈", "마이다스", "파워", "FOCUS",
    "TREX", "WOORI", "VITA", "UNICORN", "1Q ", "BNK ", "DAISHIN", "삼성 ",
    "미래에셋", "한국투자", "신한 ", "NH-Amundi", "하나로", "KIWOOM",
)
FUND_HINTS = ("ETN", "레버리지", "인버스", "선물", "합성", "커버드콜", "액티브",
              "TR)", "채권", "금리", "머니마켓", "S&P", "나스닥", "다우존스", "MSCI")

SPAC_RE = re.compile(r"스팩|기업인수목적")
REIT_RE = re.compile(r"리츠")
# 우선주: 이름 끝이 우 / 우B / 2우B / 3우B / 우C 등
PREF_RE = re.compile(r"(\d?우[BC]?)$")


def load_universe():
    payload = json.load(open(os.path.join(HERE, "krx_list.json"), encoding="utf-8"))
    return payload.get("items") or []


def load_current():
    txt = open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    return json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", txt, re.S).group(1))


def classify_exclusion(name, code):
    """제외 사유. 제외 대상이 아니면 None."""
    if any(name.startswith(b) or f" {b.strip()} " in f" {name} " for b in FUND_BRANDS):
        return "ETF/ETN"
    if any(h in name for h in FUND_HINTS):
        return "ETF/ETN"
    if SPAC_RE.search(name):
        return "SPAC"
    if REIT_RE.search(name):
        return "REIT"
    if PREF_RE.search(name):
        return "우선주"
    # 종목코드 끝자리가 0이 아니면 대개 우선주·신주인수권 등 별도 종류주다.
    if not code.endswith("0"):
        return "종류주(우선주 등)"
    return None


def main():
    universe = load_universe()
    current = load_current()
    have = {r["code"] for r in current}

    candidates, excluded = [], Counter()
    for rank, item in enumerate(universe, start=1):
        code, name, market = item["c"], item["n"], item.get("m", "KOSPI")
        if code in have:
            continue
        reason = classify_exclusion(name, code)
        if reason:
            excluded[reason] += 1
            continue
        candidates.append({"rank": rank, "code": code, "name": name, "market": market})

    print(f"전체 상장 {len(universe)}종목 · 현재 GAEO {len(current)}종목")
    print(f"제외: {dict(excluded)}")
    print(f"남은 후보 {len(candidates)}종목\n")
    print("=== 시총 순위 상위 160개 후보 ===")
    for c in candidates[:160]:
        print(f"{c['rank']:5d}  {c['code']}  {c['name']:<24} {c['market']}")

    out = os.path.join(HERE, "new_ticker_candidates.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"candidates": candidates[:200], "excluded": dict(excluded)},
                  f, ensure_ascii=False, indent=1)
    print(f"\n저장: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
