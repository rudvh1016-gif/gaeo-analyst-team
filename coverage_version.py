#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Coverage Universe 버전 — 종목집합이 언제 어떻게 바뀌었는지 (요구 25·36번).

왜 필요한가
    500종목 시절과 600종목 시절의 성적을 아무 설명 없이 하나로 섞으면,
    "모델이 좋아진 건지 종목집합이 바뀐 건지" 사용자가 구분할 수 없다.
    그래서 새 Prediction에 coverageUniverseVersion을 함께 기록하고,
    성적표에서 구간을 나눠 볼 수 있게 한다.

⚠️ 새로 추가한 100종목을 과거에도 원래 있었던 것처럼 소급하지 않는다.
   과거 기록은 그 시점의 Coverage Version 그대로 둔다.
"""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))

# ── Coverage 이력 ────────────────────────────────────────────────────────────
# ⚠️ 과거 항목은 절대 수정하지 않는다. 새 Universe는 아래에 append만 한다.
COVERAGE_HISTORY = [
    {
        "version": "GAEO_COVERAGE_V1_500",
        "size": 500,
        "effectiveFrom": None,          # V2 이전 전체 기간
        "effectiveTo": "2026-08-14",
        "note": "500종목 시절. 이 기간의 성적 기록은 그대로 보존한다.",
    },
    {
        "version": "GAEO_COVERAGE_V2_600",
        "size": 600,
        "effectiveFrom": "2026-08-15",
        "effectiveTo": None,            # 현재
        "note": ("코스피 80 · 코스닥 20 신규 추가. 기존 500종목은 그대로 유지했다. "
                 "이 날짜 이전 기록에는 새 100종목이 존재하지 않는다."),
    },
]

CURRENT = COVERAGE_HISTORY[-1]


def load_tickers():
    """tickers.js 단일 소스. 숫자를 코드에 고정하지 않는다."""
    txt = open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    return json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", txt, re.S).group(1))


def current_size():
    """지금 실제 Coverage 종목 수. 문구에 쓸 숫자는 항상 여기서 가져온다."""
    return len(load_tickers())


def current_version():
    """지금 Coverage Version 식별자."""
    return CURRENT["version"]


def version_for_date(date_str):
    """그 날짜에 유효했던 Coverage Version.

    과거 성적을 볼 때 "그때 몇 종목이었나"를 정확히 되짚기 위한 함수다.
    """
    if not date_str:
        return None
    d = str(date_str)[:10]
    for entry in reversed(COVERAGE_HISTORY):
        start = entry["effectiveFrom"]
        end = entry["effectiveTo"]
        if (start is None or d >= start) and (end is None or d <= end):
            return entry["version"]
    return COVERAGE_HISTORY[0]["version"]


def stamp():
    """새 Prediction에 붙일 Coverage 정보."""
    return {
        "coverageUniverseVersion": current_version(),
        "coverageUniverseSize": current_size(),
    }


def added_in_current():
    """현재 Version에서 새로 들어온 종목 코드.

    성적표에서 '기존 공통 500 / 새 100 / 전체 600'을 나눠 보기 위해 쓴다.
    """
    path = os.path.join(HERE, "coverage_v2_added.json")
    if not os.path.exists(path):
        return []
    return json.load(open(path, encoding="utf-8")).get("added") or []


def split_by_membership(codes):
    """종목 목록을 '기존 공통' / '새로 추가' 로 나눈다."""
    added = set(added_in_current())
    legacy = [c for c in codes if c not in added]
    fresh = [c for c in codes if c in added]
    return {"legacy": legacy, "added": fresh}


def report():
    return {
        "current": CURRENT,
        "actualSize": current_size(),
        "history": COVERAGE_HISTORY,
        "addedCount": len(added_in_current()),
        "note": ("성적을 비교할 때는 같은 Coverage Version끼리 비교한다. "
                 "새 종목을 과거 기록에 소급하지 않는다."),
    }


if __name__ == "__main__":
    print(json.dumps(report(), ensure_ascii=False, indent=1))
