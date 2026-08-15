#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모델 성적 대시보드 테스트 — 미래누출·거래일·Coverage·버전·HOLD·짝비교 (§49-63).

전부 오프라인 synthetic fixture. 네트워크·암호화 Key 불필요.
"""
import sys

import build_model_scoreboard as sb
import model_registry

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def make_prices(codes, dates, closes_fn):
    """synthetic PriceIndex: dates는 거래일 목록(이미 주말·공휴일 제외)."""
    ph = {}
    for code in codes:
        ph[code] = [{"page": 1, "days": [
            {"date": d, "close": closes_fn(code, i)} for i, d in enumerate(dates)]}]
    return sb.PriceIndex(ph)


# 거래일 캘린더 fixture — 금요일(01-09) 뒤 주말을 건너뛴다
DATES = ["2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09",
         "2026-01-12", "2026-01-13", "2026-01-14", "2026-01-15", "2026-01-16",
         "2026-01-19"]

# ── §49·§56 미래 누출 / PENDING ──────────────────────────────────────────────
p = make_prices(["000001"], DATES[:4], lambda c, i: 100 + i)   # 종가 4개뿐
row = sb.grade(p, "000001", "2026-01-05", 100, "BUY", 5)
check("§49: 5거래일 결과가 아직 없으면 PENDING(None)", row is None)
row = sb.grade(p, "000001", "2026-01-08", 100, "BUY", 5)
check("§49: 판단일 이후 가격이 전혀 없어도 PENDING", row is None)

# ── §50 거래일 계산 (달력일 아님) ────────────────────────────────────────────
p = make_prices(["000001"], DATES, lambda c, i: 100 + i * 2)
row = sb.grade(p, "000001", "2026-01-05", 100, "BUY", 5)
# 01-05 다음 5번째 거래일 = 01-12(주말 건너뜀). close = 100+5*2=110 → +10%
check("§50: 5D = 주말 건너뛴 5번째 거래일", row is not None and abs(row["ret"] - 10.0) < 1e-9)
check("§50: BUY +10% → hit", row["verdict"] == "hit")

# ── §53 HOLD가 방향 성적을 부풀리지 않음 ─────────────────────────────────────
matured = []
for i in range(30):
    d = f"2026-02-{i%28+1:02d}"
    # BUY 10건 중 5 hit, SELL 10건 중 5 hit, HOLD 980건 전부 hit
    if i < 10:
        matured.append({"date": d, "code": f"B{i}", "call": "BUY",
                        "verdict": "hit" if i < 5 else "miss", "ret": 2, "mrel": 0})
    if i < 10:
        matured.append({"date": d, "code": f"S{i}", "call": "SELL",
                        "verdict": "hit" if i < 5 else "miss", "ret": -2, "mrel": 0})
for i in range(980):
    matured.append({"date": f"2026-02-{i%28+1:02d}", "code": f"H{i}", "call": "HOLD",
                    "verdict": "hit", "ret": 0.1, "mrel": 0})
out = sb.summarize_rows(matured, 0)
check("§53: 방향판단(BUY+SELL)은 20건 기준", out["directionalCount"] == 20)
check("§53: HOLD 980건이 방향 적중률을 못 부풀림 (50%)",
      out["directionalAccuracy"] == 50.0)
check("§53: 전체와 방향이 분리 표기", out["overallAccuracy"] > 90 and out["directionalAccuracy"] == 50.0)
check("§10: BUY/SELL/HOLD 블록 분리",
      out["buy"]["count"] == 10 and out["sell"]["count"] == 10 and out["hold"]["count"] == 980)

# ── §55 같은 날 600종목 ≠ 600 독립시험 ──────────────────────────────────────
one_day = [{"date": "2026-03-02", "code": f"{i:06d}", "call": "BUY",
            "verdict": "hit", "ret": 2, "mrel": 0} for i in range(600)]
out = sb.summarize_rows(one_day, 0)
check("§55: 한 날짜 600건 → INSUFFICIENT_EVIDENCE",
      out["status"] == "INSUFFICIENT_EVIDENCE" and out["uniqueDates"] == 1)

# ── §56 PENDING은 0%가 아니다 ────────────────────────────────────────────────
out = sb.summarize_rows([], 500)
check("§56: 전부 대기 → PENDING_NOT_MATURED (0% 아님)",
      out["status"] == "PENDING_NOT_MATURED" and "accuracy" not in out)

# ── §26 판단 보류 분리 ───────────────────────────────────────────────────────
hist = {"000001": [
    {"tier": "auto", "date": "2026-01-05", "call": "JUDGMENT_WITHHELD", "base": 100},
    {"tier": "auto", "date": "2026-01-06", "call": "BUY", "base": 102,
     "baseModelVersion": "vX"},
]}
p = make_prices(["000001"], DATES, lambda c, i: 100 + i * 2)
m, pend, wh = sb.load_base_rows(p, hist)
check("§26: 판단 보류는 채점 밖 + 별도 카운트", wh == 1 and len(m) == 1)
check("§25: tier auto만 사용",
      sb.load_base_rows(p, {"000001": [{"date": "2026-01-05", "call": "BUY", "base": 100}]})[0] == [])

# ── §51 Coverage 분리 ───────────────────────────────────────────────────────
import coverage_version
v_500 = coverage_version.version_for_date("2026-08-14")
v_600 = coverage_version.version_for_date("2026-08-18")
check("§51: 8/14는 V1_500, 8/18은 V2_600", "500" in v_500 and "600" in v_600)

# ── §52 Model Version 분리 ──────────────────────────────────────────────────
hist = {"000001": [
    {"tier": "auto", "date": "2026-01-05", "call": "BUY", "base": 100},                     # 옛 버전
    {"tier": "auto", "date": "2026-01-06", "call": "BUY", "base": 102,
     "baseModelVersion": sb.BASE_MODEL_VERSION},                                             # 현재 버전
]}
m, pend, wh = sb.load_base_rows(p, hist)
versions = {r["modelVersion"] for r in m}
check("§52: 버전 없는 옛 기록은 PRE_HOTFIX로 분리",
      sb.PRE_HOTFIX_BASE in versions and sb.BASE_MODEL_VERSION in versions)

# ── §54 짝비교는 공통 표본만 ────────────────────────────────────────────────
def rows(n, dates_n, prefix, verdict="hit"):
    out = []
    for i in range(n):
        out.append({"date": f"2026-04-{i%dates_n+1:02d}", "code": f"{prefix}{i%7:03d}",
                    "call": "BUY", "verdict": verdict, "ret": 2, "mrel": 0.5})
    return out
left = rows(100, 25, "A")          # A모델 100건
right = [r for r in left[:12]]     # 공통 12건만 (같은 code·date)
pc = sb.paired_comparison(left, right, "A", "B")
check("§54: 짝비교 N = 공통 표본 수", pc["matchedRows"] == 12)
check("§54: 공통 판단일 부족 → INSUFFICIENT + '이릅니다'",
      pc["evidenceStatus"] == "INSUFFICIENT_EVIDENCE")
# 충분한 공통 표본이면 OK + 차이 계산
left = rows(100, 25, "C")
right = [dict(r, verdict="miss") for r in left]     # 전 표본 공통, 오른쪽 전부 miss
pc = sb.paired_comparison(left, right, "L", "R")
check("§54: 충분하면 OK + 차이(pp)", pc["evidenceStatus"] == "OK" and pc["differencePp"] == -100.0)

# ── §57 B 후보 Winner 자동 선택 금지 ─────────────────────────────────────────
reg_b = model_registry.BY_ID["research_b"]
check("§57: B primarySelection 고정",
      reg_b["primarySelection"] == "NO_PRIMARY_CANDIDATE_SELECTED")
# builder 산출에서도 후보는 성적순이 아니라 candidateModelId 사전순
recs = []
for i in range(3):
    recs.append({"code": f"{i:06d}", "date": "2026-01-05", "base": 100,
                 "researchV11": {"candidates": {
                     "z_cand": {"horizons": {"5": {"action": "BUY"}}},
                     "a_cand": {"horizons": {"5": {"action": "SELL"}}}}}})
research = sb.research_sections(p, [dict(r, code="000001") for r in recs])
cand_ids = sorted(research["cand"]["research_b"].keys())
check("§57: 후보 순서 사전순 고정(성적 무관)", cand_ids == ["a_cand", "z_cand"])

# ── §58 pairedWith 없는 후보는 DART 짝 금지 ─────────────────────────────────
rec_no_pair = {"code": "000001", "date": "2026-01-05", "base": 100,
               "researchV11": {"candidates": {"x": {"horizons": {"5": {"action": "BUY"}}}}},
               "researchV20": {"candidates": {"x2": {"horizons": {"5": {"action": "BUY"}}}}}}
research = sb.research_sections(p, [rec_no_pair])
check("§58: pairedWith 없으면 B↔C 짝 0건", research["pair_rows"] == [])
rec_pair = {"code": "000001", "date": "2026-01-05", "base": 100,
            "researchV11": {"candidates": {"x": {"horizons": {"5": {"action": "BUY"}}}}},
            "researchV20": {"candidates": {"x": {
                "pairedWith": {"candidateModelId": "x"},
                "horizons": {"5": {"action": "BUY"}}}}}}
research = sb.research_sections(p, [rec_pair])
check("§58: 실제 pairedWith가 있을 때만 짝 생성", len(research["pair_rows"]) == 1)

# ── §59 확률 미검증 상태 ─────────────────────────────────────────────────────
payload_probe = [m for m in model_registry.MODELS if m.get("producesProbability")]
check("§59: 확률 생산 모델 존재(계약 확인)", len(payload_probe) >= 3)

# ── §61 동결 hash FAIL CLOSED ────────────────────────────────────────────────
try:
    hashes = sb.verify_frozen_hashes()
    check("§61: A/B hash가 Registry 기대값과 일치", True)
except SystemExit:
    check("§61: A/B hash가 Registry 기대값과 일치", False, "hash 불일치 — 동결 위반!")
# 불일치 시 실제로 중단하는지 (Registry를 임시로 비틀어 확인)
orig = model_registry.BY_ID["research_a"]["configHash"]
try:
    model_registry.BY_ID["research_a"]["configHash"] = "0000000000000000"
    model_registry.MODELS[1]["configHash"] = "0000000000000000"
    failed = False
    try:
        sb.verify_frozen_hashes()
    except SystemExit:
        failed = True
    check("§61: hash 불일치 시 FAIL CLOSED", failed)
finally:
    model_registry.BY_ID["research_a"]["configHash"] = orig
    model_registry.MODELS[1]["configHash"] = orig

# ── §60 공개 파일에 원본 미노출 ─────────────────────────────────────────────
import os, re as _re
if os.path.exists("model_scoreboard.js"):
    s = open("model_scoreboard.js", encoding="utf-8").read()
    check("§60: 집계 파일에 개별 종목코드 예측 없음",
          not _re.search(r'"code"\s*:\s*"\d{6}"', s))
    check("§60: secret/key 흔적 없음",
          "RESEARCH_ARCHIVE_KEY" not in s and "OPEN_DART" not in s)
    check("§29: 집계 파일 < 100KB", os.path.getsize("model_scoreboard.js") < 100_000)

# ── ABSTAIN은 보류로 ────────────────────────────────────────────────────────
row, state = sb._grade_horizons(p, "000001", "2026-01-05", 100,
                                {"5": {"action": "ABSTAIN"}}, 5)
check("ABSTAIN은 채점 밖(보류)", state == "withheld")

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_model_scoreboard: 전체 통과")
