#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""종합판단 v3 핵심 계산 회귀 테스트."""
import datetime

from compute_indicators import flow_summary
from compute_model_intelligence import (
    ANALYSTS, calibration_from, calibrated_p, error_correlations,
    evaluate_archived_shadow, score_bin, stance_hit,
)

passed = 0


def check(name, condition):
    global passed
    if not condition:
        raise AssertionError(name)
    passed += 1
    print(f"✅ {name}")


check("0점은 0~9 교정구간", score_bin(0) == "0")
check("100점은 90~100 교정구간", score_bin(100) == "90")
check("강세 뒤 기준 이상 상승은 적중", stance_hit("bull", 2, 1) == 1)
check("강세 뒤 기준 이상 하락은 오답", stance_hit("bull", -2, 1) == 0)
check("중립 변동은 채점 제외", stance_hit("bull", .5, 1) is None)

rows = []
for i in range(80):
    row = {}
    for analyst in ANALYSTS:
        row[analyst] = {"score": 75 if i < 40 else 25,
                        "target": 2 if i < 32 or (40 <= i < 48) else -2,
                        "hit": 1 if i % 3 else 0}
    rows.append(row)
cal = calibration_from(rows)
check("고점수 교정확률이 저점수보다 높음", calibrated_p(cal, "taro", 75) > calibrated_p(cal, "taro", 25))
check("교정확률은 0과 1 사이", 0 < calibrated_p(cal, "taro", 75) < 1)
for analyst in ANALYSTS:
    calibrated = [cal[analyst][str(value)]["pUp"] for value in range(0, 100, 10)]
    check(f"{analyst} 교정확률 단조 증가", calibrated == sorted(calibrated))

pairs, factors = error_correlations(rows)
check("오답 상관 표본 기록", pairs["taro:diana"]["n"] == 80)
check("중복 보정계수는 안전범위", all(.82 <= value <= 1 for value in factors.values()))

daily = []
base = 100
for i in range(7):
    daily.append({"date": str(datetime.date(2026, 1, 1) + datetime.timedelta(days=i)),
                  "close": base - i, "volume": 100000})
trends = [
    {"foreignerPureBuyQuant": 20000, "organPureBuyQuant": 10000,
     "individualPureBuyQuant": -30000, "foreignerHoldRatio": 10 + i * .1}
    for i in range(6)
]
flow = flow_summary(trends, daily)
check("수급 지속일 계산", flow["foreignBuyDays"] == 6 and flow["organBuyDays"] == 6)
check("외국인·기관 동반매수일 계산", flow["jointBuyDays"] == 6)
check("가격하락·큰손매수는 매집형 괴리", flow["divergence"] == "accumulation")
check("수급 품질점수 상한 보호", -50 <= flow["qualityScore"] <= 50)

prospective = evaluate_archived_shadow([
    {"day": "2026-01-01", "ret5": 3, "call": "HOLD", "total": 55,
     "archivedShadow": {"call": "BUY", "probabilityUp": 70, "regime": "up_low"}},
    {"day": "2026-01-02", "ret5": -4, "call": "BUY", "total": 70,
     "archivedShadow": {"call": "SELL", "probabilityUp": 20, "regime": "down_high"}},
], {})
check("그림자 전진검증 표본 집계", prospective["n"] == 2 and prospective["candidateActionN"] == 2)
check("그림자 전진검증 양방향 적중", prospective["candidateActionPrecision"] == 100.0)
check("그림자 전진검증 시장국면 집계", prospective["testRegimes"] == 2)
check("백분율 확률을 Brier 소수확률로 변환", prospective["brier"] == 0.065)

print(f"종합판단 v3 테스트 {passed}건 통과")
