#!/usr/bin/env python3
"""사전등록(pre-registered) BUY 필터 검증 — 2026-09-05 등록, 2026-09-07 이후 새 기록만 평가.

규칙 문서: docs/PREREGISTRATION_BUY_FILTERS_20260905.md
이 파일은 그 문서의 규칙을 코드로 고정한 것이다. 결과를 본 뒤 상수·가설·통계 절차를
바꾸면 사전등록이 깨진다. 바꾸려면 새 문서·새 등록일로 다시 등록해야 한다.

    python3 evaluate_preregistered_buy_filters.py                 # 오늘 기준 평가
    python3 evaluate_preregistered_buy_filters.py --as-of 2026-10-19 --output /tmp/prereg.json

원칙
- 2026-09-07 이전 판단은 이미 본 자료이므로 절대 포함하지 않는다.
- 실제 자동판단(tier=auto)만 쓴다. 재구성(recon)·정밀분석·판단 보류·중복 종목일은 제외한다.
- 판단일이 KRX 거래일이 아니거나(예: 2026-08-17 광복절 대체휴일에 러너가 8/14 종가를 그날 판단으로
  기록) 그 종목 일봉에 판단일 종가가 없으면 판단일로 세지 않는다(notTradingDay · noDecisionSessionCandle).
- 판단일 일봉 종가가 기록 base와 2% 넘게 다르면(수정주가 소급·자료 불일치) 제외한다(baseMismatchCandle).
  일봉은 수정주가인데 base는 판단 당시 미조정 가격이라, 둘을 섞은 ret5는 뜻이 없다.
- 급등·변동성 특징은 판단 당시 아카이브가 기록한 chief.overheat(버전 일치)만 쓴다.
  과거 일봉으로 되살리지 않는다(시점 누수 방지). 기록이 없으면 '미기록'으로 세고 제외한다.
- 결과는 판단일 뒤 5번째 거래일 종가 기준 수익률이다. 5번째 거래일이 평가일(--as-of)
  이후면 아직 익지 않은 판단이므로 세지 않는다.
- 판단일이 20일 미만이면 효과 크기를 계산·출력하지 않는다(중간에 훔쳐보기 방지).
  표본 수만 보고한다.
- 검정은 연속 5판단일 블록 부트스트랩(2,000회·seed 고정) 95% 구간과 양측 p값을 쓰고,
  주가설 4개에 Holm 보정을 건다. 방향이 가설과 반대이면서 유의하면 그대로 보고한다.
- 이 스크립트는 산식·가중치·화면을 바꾸지 않는다. 통과해도 자동 적용하지 않는다.
"""
import argparse
import bisect
import collections
import datetime
import hashlib
import json
import math
import random
import sys
from pathlib import Path

import compute_team_weights as W
from krx_calendar import is_krx_trading_day
from buy_warning import (OVERHEAT_RET5_PCT, OVERHEAT_RET20_PCT, OVERHEAT_VERSION,
                         OVERHEAT_VOL20_PCT, finite_number)
from buy_warning_evidence import BUY_CRASH_PCT

ROOT = Path(__file__).resolve().parent

# ── 사전등록 상수 (결과를 보고 바꾸지 않는다) ─────────────────────────────────
REGISTRATION = {
    "document": "docs/PREREGISTRATION_BUY_FILTERS_20260905.md",
    "registeredOn": "2026-09-05",
    "windowStart": "2026-09-07",           # 등록 뒤 첫 거래일. 이전 기록은 이미 본 자료.
    # ⚠️ 2026-09-05 창 열기 전 수정(§10 8항): 러너는 평일이면 휴장일에도 돌아 직전 종가를 그날 판단으로
    #    기록한다(실측 2026-08-17 광복절 대체휴일 598건 = 8/14 종가 복제). 그런 날은 판단일이 아니다.
    #    달력(krx_calendar.KRX_HOLIDAYS)과 "그 종목 일봉에 판단일 종가가 있는가"로 이중 방어한다.
    #    창 안(11/16 재확인까지) 평일 휴장일: 2026-09-24 · 09-25 · 10-05 · 10-09 (12/25·12/31은 그 뒤).
    "excludeNonTradingDecisionDays": True,
    "tradingCalendar": "krx_calendar.KRX_HOLIDAYS",
    # ⚠️ 2026-09-06 창 열기 전 수정(§10 9항, 검수 권고): analysis_data.json 일봉은 수정주가라 기업행동(분할·증자 등)
    #    종목은 과거 종가가 소급 조정되는데, 기록의 base는 판단 당시 미조정 가격이다. 둘을 섞은 ret5는 가짜가 된다
    #    (실측: 183300 −52%, 210980 −36%, 000880 +41~61%). 판단일 일봉 종가가 base와 이 비율(%) 넘게 다르면 제외한다.
    #    실측 분포(2026-09-04까지 18,375행): 2% 초과 129행, 그중 10% 초과 70행은 전부 기업행동 종목.
    "baseCandleTolerancePct": 2.0,
    # ⚠️ 아래 다섯 값은 등록 시점의 운영 상수를 '리터럴'로 얼린 것이다. 운영 코드의 상수를 그대로
    #    참조하면 나중에 상수가 바뀔 때 등록이 조용히 따라가 버린다(code-review 2026-09-05).
    #    test_prereg_buy_filters가 "리터럴 == 현재 운영 상수"를 검사하므로, 운영 상수가 바뀌면
    #    테스트가 크게 실패해 "등록이 깨진다"는 사실이 드러난다.
    "baseModelVersion": "base-2026-08-15-parity-hotfix",
    "warningVersion": "surge-only-2026-09-05c",
    "horizonSessions": 5,
    "crashThresholdPct": -5.0,             # 5번째 거래일 종가 수익률 ≤ -5%
    "surgeThresholds": {"ret5": 10.0, "ret20": 25.0},
    "vol20Cut": 4.0,                       # H2 고변동 경계(판단 당시 기록값)
    "minDecisionDays": 20,
    # ⚠️ 2026-09-05 건강검진(창 열기 전 수정): 판단일 20~26일에서 5일 블록은 독립 묶음이 4~5개뿐이어서
    #    명목 5%의 실제 오탐률이 13~27%로 추정됐다(합성 자료 500회 시뮬레이션). 그래서 산식을 바꾸는
    #    후속(H1)은 40판단일에서 다시 PASS여야 적용한다. 20~39일에서의 PASS는 PASS_PROVISIONAL(기록만).
    "minDecisionDaysForFormulaChange": 40,
    "formulaChangingHypotheses": ["H1_crash"],
    "minGroupRows": 30,
    "minGroupDays": 10,
    "blockLength": 5,
    "bootstrapRounds": 2000,
    "bootstrapSeed": 20260905,
    "alpha": 0.05,
    "primaryFamily": ["H0_crash", "H0_mean", "H1_crash", "H2_crash"],
    # 실질 효과 조건(H1·H2에만): 유의해도 손실 비율 차이가 이보다 작으면 산식·표시를 바꾸지 않는다.
    "minActionEffectPp": 5.0,
    # 소유자 위임(2026-09-05): 통과하면 미리 정한 후속 조치를 평가 세션이 PR·병합까지 적용한다.
    "consequenceMode": "APPLY_PREDEFINED_CHANGE_VIA_PR",
}

HYPOTHESES = {
    # 이름: (설명, 기대 방향(+1이면 통계량 > 0 이 가설 방향), 통과·반전 시 미리 정한 후속)
    "H0_crash": ("BUY의 종가 -5% 손실 비율이 같은 날짜 자동기록 기준선보다 낮다(통계량 = 기준선 − BUY)",
                 +1,
                 {"PASS": "BUY 목록이 같은 날 아무 종목보다 크게 물리는 일이 적었다는 첫 독립 근거. 성적표에 기록. 산식 변경 없음.",
                  "FAIL_REVERSED": "BUY가 기준선보다 더 많이 크게 물렸다. 성적표에 그대로 공개. BUY 문턱은 만지지 않고 다음 등록에서 'BUY 문턱 상향' 가설을 새로 등록한다."}),
    "H0_mean": ("BUY의 평균 5거래일 종가 수익률이 같은 날짜 자동기록 기준선보다 높다(통계량 = BUY − 기준선)",
                +1,
                {"PASS": "BUY의 평균 수익이 기준선을 넘었다는 첫 독립 근거. 성적표에 기록. 산식 변경 없음.",
                 "FAIL_REVERSED": "BUY 평균 수익이 기준선에 못 미쳤다. 성적표에 그대로 공개. 다음 등록에서 'BUY 문턱 상향' 가설을 새로 등록한다."}),
    "H1_crash": ("급등 조건(ret5≥10% 또는 ret20≥25%)에 걸린 BUY의 손실 비율이 걸리지 않은 BUY보다 높다(통계량 = 급등 − 비급등)",
                 +1,
                 {"PASS": "급등 조건에 걸린 BUY를 HOLD로 내리는 산식 변경을 PR·CI·병합까지 적용한다(화면에 '급등 뒤라 관망' 사유 표시). 소유자 위임(2026-09-05).",
                  "PASS_PROVISIONAL": "20~39판단일에서 통과했다. 오탐률이 높은 구간이라 기록만 남기고, 40판단일이 익은 뒤 같은 명령으로 다시 PASS여야 산식을 바꾼다(2026-11-16 Routine).",
                  "SIGNIFICANT_BUT_SMALL": "유의하지만 손실 비율 차이가 5%p 미만이다. 산식·표시를 바꾸지 않고 기록만 남긴다.",
                  "FAIL_REVERSED": "급등 경고가 오히려 반대로 맞았다. 종목 화면의 급등 경고 표시를 제거하는 PR을 병합한다."}),
    "H2_crash": ("판단 당시 vol20≥4%인 BUY의 손실 비율이 그 미만인 BUY보다 높다(통계량 = 고변동 − 저변동). 노출 가설이며 예측력 가설이 아니다",
                 +1,
                 {"PASS": "고변동 BUY에 '손실 노출 큼' 표시를 추가하는 PR을 병합한다(판단은 바꾸지 않는다). 정규화 진단이 0 근처면 예측력이 아니라 노출 차이로만 설명한다.",
                  "SIGNIFICANT_BUT_SMALL": "유의하지만 손실 비율 차이가 5%p 미만이다. 표시를 추가하지 않고 기록만 남긴다.",
                  "FAIL_REVERSED": "고변동 BUY가 덜 물렸다. 변동성 기반 제외안을 폐기하고 문서에 기록한다."}),
}


def sha256_of(path):
    try:
        return hashlib.sha256(Path(path).read_bytes()).hexdigest()
    except OSError:
        return None


def load_inputs(root=ROOT):
    hist = W.load_js_object(str(root / "history.js"), "LIVE_HISTORY")
    data = json.loads((root / "analysis_data.json").read_text(encoding="utf-8"))
    closes = {c: sorted(s["daily"], key=lambda r: r["date"])
              for c, s in data.get("stocks", {}).items() if s.get("daily")}
    return hist, closes, {
        "history.js": sha256_of(root / "history.js"),
        "analysis_data.json": sha256_of(root / "analysis_data.json"),
        "analysisDataFetchedAt": data.get("fetchedAt"),
    }


def _hist_cap():
    try:
        import archive_analysis
        return int(getattr(archive_analysis, "HIST_CAP", 80))
    except Exception:
        return 80


def _is_trading_day(day):
    """판단일이 KRX 거래일인가. 날짜 형식이 깨진 값은 거래일로 보지 않는다."""
    try:
        return is_krx_trading_day(datetime.date.fromisoformat(str(day)[:10]))
    except ValueError:
        return False


def _has_candle(dates, day):
    """정렬된 일봉 날짜 목록에 판단일 종가가 있는가(미등록 휴장·거래정지·수집 결손 2차 방어)."""
    i = bisect.bisect_left(dates, day)
    return i < len(dates) and dates[i] == day


def _non_trading_decision_dates(hist, start, as_of):
    """창 안에서 자동 기록은 있으나 KRX 거래일이 아닌 판단 날짜 목록(보고서에 그대로 남긴다)."""
    out = set()
    for entries in hist.values():
        if not isinstance(entries, list):
            continue
        for e in entries:
            if not isinstance(e, dict):
                continue
            d = str(e.get("date", ""))[:10]
            if d and start <= d <= as_of and e.get("tier") == "auto" and not _is_trading_day(d):
                out.add(d)
    return sorted(out)


def collect_rows(hist, closes, as_of, reg=REGISTRATION):
    """평가 대상 행을 고른다. 제외 사유는 모두 센다(조용히 버리지 않는다)."""
    start, horizon = reg["windowStart"], reg["horizonSessions"]
    dropped = collections.Counter()
    observed = {}
    truncated_codes = []
    cap = _hist_cap()
    for code, entries in hist.items():
        if not isinstance(entries, list):
            continue
        prices = closes.get(code)
        if not prices:
            # 시세가 없는 종목: 창 안 실제 자동 판단은 noPriceSeries, 나머지(창 밖·재구성·정밀)는
            # noPriceSeriesOutOfScope로 센다. 제외 합계 + 남은 행 = 기록 전체가 항상 성립해야 한다.
            for e in entries:
                if not isinstance(e, dict):
                    dropped["notADict"] += 1
                    continue
                d = str(e.get("date", ""))[:10]
                in_scope = start <= d <= as_of and e.get("tier") == "auto" and not e.get("recon")
                dropped["noPriceSeries" if in_scope else "noPriceSeriesOutOfScope"] += 1
            continue
        # 보관 상한에 닿았고 남은 첫 기록이 창 시작보다 늦으면 창 안 기록이 밀려났을 수 있다.
        if len(entries) >= cap:
            first = min((str(e.get("date", ""))[:10] for e in entries if isinstance(e, dict)), default="")
            if first > start:
                truncated_codes.append(code)
        dates = [r["date"] for r in prices]
        for e in entries:
            if not isinstance(e, dict):
                dropped["notADict"] += 1
                continue
            day = str(e.get("date", ""))[:10]
            if not day or day < start:
                dropped["beforeWindow"] += 1
                continue
            if day > as_of:
                dropped["afterAsOf"] += 1
                continue
            if e.get("tier") != "auto":
                dropped["nonAuto"] += 1
                continue
            if e.get("recon"):
                dropped["reconstructed"] += 1
                continue
            if e.get("judgmentWithheld") or e.get("call") not in ("BUY", "HOLD", "SELL"):
                dropped["withheldOrUnknownCall"] += 1
                continue
            base = finite_number(e.get("base"))
            if base is None or base <= 0:
                dropped["badBase"] += 1
                continue
            version = W.record_base_version(e)
            if version != reg["baseModelVersion"]:
                dropped["otherModelVersion"] += 1
                continue
            if reg["excludeNonTradingDecisionDays"]:
                # 휴장일 유령 판단일(2026-08-17형): 달력 → 그 종목 일봉 순서로 이중 방어. 둘 다 건수로 남긴다.
                if not _is_trading_day(day):
                    dropped["notTradingDay"] += 1
                    continue
                if not _has_candle(dates, day):
                    dropped["noDecisionSessionCandle"] += 1
                    continue
            # 3차 방어(휴장일 플래그와 독립): 판단일 일봉 종가가 기록 base와 허용오차 넘게 다르면
            #   (수정주가 소급·자료 불일치) ret5가 뜻을 잃으므로 제외한다. 결과를 보지 않는 기계적 규칙이며 건수로 남긴다.
            #   판단일 일봉이 없으면(위에서 안 걸렸을 때) 종가를 읽을 수 없으므로 같은 사유로 센다.
            k = bisect.bisect_left(dates, day)
            day_close = finite_number(prices[k].get("close")) if k < len(dates) and dates[k] == day else None
            if (day_close is None or day_close <= 0
                    or abs(day_close / base - 1.0) * 100.0 > reg["baseCandleTolerancePct"]):
                dropped["baseMismatchCandle"] += 1
                continue
            j = bisect.bisect_right(dates, day) + horizon - 1
            if j >= len(prices) or prices[j]["date"] > as_of:
                dropped["pendingOutcome"] += 1
                continue
            final = finite_number(prices[j].get("close"))
            if final is None or final <= 0:
                dropped["badFinalClose"] += 1
                continue
            oh = e.get("overheat") if isinstance(e.get("overheat"), dict) else None
            recorded = bool(oh) and oh.get("version") == reg["warningVersion"]
            warn = None
            vol = None
            if recorded:
                if oh.get("available"):
                    warn = bool(oh.get("warn"))
                vol = finite_number(oh.get("vol20"))
            row = {"code": code, "day": day, "call": e["call"],
                   "ret5": (final - base) / base * 100.0,
                   "warn": warn, "vol": vol, "featureRecorded": recorded}
            key = (code, day)
            if key in observed:
                # 첫 충돌이면 먼저 들어온 행도 함께 버려지므로 2건으로 센다(제외 합계 = 후보 행 수).
                dropped["duplicateCodeDate"] += 2 if observed[key] is not None else 1
                observed[key] = None
            else:
                observed[key] = row
    rows = [r for r in observed.values() if r is not None]
    return rows, dict(dropped), sorted(truncated_codes)


# ── 통계 ────────────────────────────────────────────────────────────────────
def moving_block_bootstrap(day_map, stat_fn, block_length, rounds, seed):
    """연속 block_length 판단일 블록(비순환)을 뽑아 통계량 분포를 만든다.

    day_map: {판단일: [합계 벡터]}. stat_fn(합계 벡터) → 실수 또는 None.
    반환: {"ci95": [lo, hi], "pTwoSided": p, "valid": 유효 재추출 수} 또는 None.
    p는 0을 기준으로 한 양측 재추출 p값이다: 2 × min(P(stat ≤ 0), P(stat ≥ 0)), (k+1)/(N+1) 보정.
    """
    days = sorted(day_map)
    n = len(days)
    if n < max(3, 2 * block_length):
        return None
    width = len(next(iter(day_map.values())))
    blocks = [days[i:i + block_length] for i in range(n - block_length + 1)]
    rng = random.Random(seed)
    values = []
    for _ in range(rounds):
        chosen = []
        while len(chosen) < n:
            chosen.extend(rng.choice(blocks))
        agg = [0.0] * width
        for d in chosen[:n]:
            v = day_map[d]
            for k in range(width):
                agg[k] += v[k]
        s = stat_fn(agg)
        if s is not None:
            values.append(s)
    if len(values) < rounds * 0.9:
        return None
    values.sort()
    le = sum(1 for v in values if v <= 0)
    ge = sum(1 for v in values if v >= 0)
    N = len(values)
    p = min(1.0, 2.0 * min((le + 1) / (N + 1), (ge + 1) / (N + 1)))
    return {"ci95": [round(values[int(N * 0.025)], 3), round(values[min(N - 1, int(N * 0.975))], 3)],
            "pTwoSided": round(p, 4), "valid": N}


def holm_adjust(pvalues, m_total=None):
    """Holm 단계적 보정. {이름: p} → {이름: 보정 p}.

    m_total: 등록된 가설 가족의 크기(기본 4). None인 p(표본 부족)는 기각 못 하는 가설(p=1)로 두고
    가족 크기는 그대로 유지한다. 그렇지 않으면 H1·H2가 표본 부족일 때 H0의 문턱이 느슨해진다
    (code-review 2026-09-05)."""
    items = [(k, v) for k, v in pvalues.items() if v is not None]
    m = m_total if m_total is not None else len(items)
    items.sort(key=lambda kv: kv[1])
    adjusted, running = {}, 0.0
    for i, (k, p) in enumerate(items):
        running = max(running, min(1.0, (m - i) * p))
        adjusted[k] = round(running, 4)
    return adjusted


def _describe(rows):
    if not rows:
        return None
    n = len(rows)
    hit = sum(r["ret5"] > 1 for r in rows)
    miss = sum(r["ret5"] < -1 for r in rows)
    return {"n": n, "days": len({r["day"] for r in rows}), "graded": hit + miss,
            "acc": round(hit / (hit + miss) * 100, 1) if hit + miss else None,
            "crashPct": round(sum(r["ret5"] <= BUY_CRASH_PCT for r in rows) / n * 100, 1),
            "meanRet": round(sum(r["ret5"] for r in rows) / n, 2)}


def _group_test(rows, flag_fn, expected_sign, reg, name):
    """두 집단(flag True/False) 손실 비율 차이 + 평균 수익률 차이(보조) + 정규화 진단."""
    eligible = [r for r in rows if flag_fn(r) is not None]
    a = [r for r in eligible if flag_fn(r)]
    b = [r for r in eligible if not flag_fn(r)]
    out = {"hypothesis": name, "description": HYPOTHESES[name][0], "expectedSign": expected_sign,
           "flagged": _describe(a),
           "other": _describe(b),   # = 걸린 것을 빼고 남긴 BUY 목록의 실적
           "allBuy": _describe(rows)}
    ok = (len(a) >= reg["minGroupRows"] and len(b) >= reg["minGroupRows"]
          and len({r["day"] for r in a}) >= reg["minGroupDays"]
          and len({r["day"] for r in b}) >= reg["minGroupDays"])
    out["groupsSufficient"] = ok
    if not ok:
        out["status"] = "INSUFFICIENT"
        return out
    crash = {}
    mean = {}
    norm = {}
    for r in eligible:
        f = 0 if flag_fn(r) else 2
        c = crash.setdefault(r["day"], [0.0, 0.0, 0.0, 0.0])
        c[f] += r["ret5"] <= BUY_CRASH_PCT
        c[f + 1] += 1
        m_ = mean.setdefault(r["day"], [0.0, 0.0, 0.0, 0.0])
        m_[f] += r["ret5"]
        m_[f + 1] += 1
        if r["vol"] is not None and r["vol"] > 0:
            nv = norm.setdefault(r["day"], [0.0, 0.0, 0.0, 0.0])
            nv[f] += r["ret5"] <= -r["vol"] * math.sqrt(5)
            nv[f + 1] += 1
    gap = lambda v: 100.0 * (v[0] / v[1] - v[2] / v[3]) if v[1] and v[3] else None
    mgap = lambda v: (v[2] / v[3] - v[0] / v[1]) if v[1] and v[3] else None   # 비걸림 − 걸림
    tot = [sum(v[k] for v in crash.values()) for k in range(4)]
    mtot = [sum(v[k] for v in mean.values()) for k in range(4)]
    ntot = [sum(v[k] for v in norm.values()) for k in range(4)] if norm else None
    bs = lambda dm, fn: moving_block_bootstrap(dm, fn, reg["blockLength"], reg["bootstrapRounds"], reg["bootstrapSeed"])
    out["crashGapPp"] = round(gap(tot), 2) if gap(tot) is not None else None
    out["crashGapBootstrap"] = bs(crash, gap)
    out["meanGapPp_otherMinusFlagged"] = round(mgap(mtot), 3) if mgap(mtot) is not None else None
    out["meanGapBootstrap"] = bs(mean, mgap)
    out["normalizedCrashGapPp"] = (round(gap(ntot), 2) if ntot and gap(ntot) is not None else None)
    out["normalizedCrashBootstrap"] = bs(norm, gap) if norm else None
    out["status"] = "TESTED"
    return out


def _baseline_test(buy, pool, reg):
    """H0: BUY vs 같은 날짜 자동기록 기준선(날짜별 종목 동일 비중, BUY 발생일 비중)."""
    by_day = collections.defaultdict(list)
    for r in pool:
        by_day[r["day"]].append(r)
    dm = {}
    for r in buy:
        peers = by_day[r["day"]]
        m = len(peers)
        d = dm.setdefault(r["day"], [0.0] * 5)   # crashBUY, retBUY, nBUY, poolCrashRate·n, poolMean·n
        d[0] += r["ret5"] <= BUY_CRASH_PCT
        d[1] += r["ret5"]
        d[2] += 1
        d[3] += sum(p["ret5"] <= BUY_CRASH_PCT for p in peers) / m
        d[4] += sum(p["ret5"] for p in peers) / m
    tot = [sum(v[k] for v in dm.values()) for k in range(5)]
    crash_stat = lambda v: 100.0 * (v[3] - v[0]) / v[2] if v[2] else None   # 기준선 − BUY (양수면 BUY가 덜 물림)
    mean_stat = lambda v: (v[1] - v[4]) / v[2] if v[2] else None            # BUY − 기준선
    bs = lambda fn: moving_block_bootstrap(dm, fn, reg["blockLength"], reg["bootstrapRounds"], reg["bootstrapSeed"])
    ok = len(buy) >= reg["minGroupRows"] and len(dm) >= reg["minGroupDays"]
    out = {"buy": _describe(buy), "poolRows": len(pool), "poolDays": len(by_day),
           "baselineCrashPct": round(100.0 * tot[3] / tot[2], 1) if tot[2] else None,
           "baselineMeanRet": round(tot[4] / tot[2], 2) if tot[2] else None,
           "groupsSufficient": ok}
    if not ok:
        out["status"] = "INSUFFICIENT"
        return out
    out.update({
        "H0_crash": {"description": HYPOTHESES["H0_crash"][0], "expectedSign": +1,
                     "statPp": round(crash_stat(tot), 2), "bootstrap": bs(crash_stat)},
        "H0_mean": {"description": HYPOTHESES["H0_mean"][0], "expectedSign": +1,
                    "statPct": round(mean_stat(tot), 3), "bootstrap": bs(mean_stat)},
        "status": "TESTED"})
    return out


def _verdict(stat, boot, expected_sign, holm_p, alpha, min_effect=None):
    """min_effect가 있으면(H1·H2) 유의하고 방향이 맞아도 |효과| < min_effect면 SIGNIFICANT_BUT_SMALL."""
    if stat is None or boot is None or holm_p is None:
        return "INSUFFICIENT"
    if holm_p < alpha:
        if (stat * expected_sign) <= 0:
            return "FAIL_REVERSED"
        if min_effect is not None and abs(stat) < min_effect:
            return "SIGNIFICANT_BUT_SMALL"
        return "PASS"
    return "NOT_SIGNIFICANT"


def evaluate(hist, closes, as_of, reg=REGISTRATION):
    rows, dropped, truncated = collect_rows(hist, closes, as_of, reg)
    buy = [r for r in rows if r["call"] == "BUY"]
    days = sorted({r["day"] for r in rows})
    report = {
        "registration": reg,
        "asOf": as_of,
        "evidenceStatus": "PRE_REGISTERED_PROSPECTIVE",
        "sample": {
            "rows": len(rows), "buy": len(buy),
            "decisionDays": len(days),
            "firstDecisionDate": days[0] if days else None,
            "lastDecisionDate": days[-1] if days else None,
            "buyFeatureRecorded": sum(1 for r in buy if r["featureRecorded"]),
            "buyFeatureUnrecorded": sum(1 for r in buy if not r["featureRecorded"]),
            "buySurgeKnown": sum(1 for r in buy if r["warn"] is not None),
            "buySurgeFlagged": sum(1 for r in buy if r["warn"]),
            "buyVolKnown": sum(1 for r in buy if r["vol"] is not None),
            "buyHighVol": sum(1 for r in buy if r["vol"] is not None and r["vol"] >= reg["vol20Cut"]),
            "excluded": dropped,
            "retentionTruncatedCodes": truncated,
            # 창 안에 기록은 있지만 거래일이 아닌 날짜(휴장일 유령 판단일). 비어 있어야 정상이다.
            "nonTradingDecisionDates": _non_trading_decision_dates(hist, reg["windowStart"], as_of),
        },
    }
    if len(days) < reg["minDecisionDays"]:
        report["status"] = "INSUFFICIENT"
        report["note"] = (f"판단일 {len(days)}일 < 최소 {reg['minDecisionDays']}일. 사전등록 규칙에 따라 "
                          "효과 크기를 계산하지 않았다. 표본 수만 보고한다.")
        return report
    base = _baseline_test(buy, rows, reg)
    h1 = _group_test(buy, lambda r: r["warn"], +1, reg, "H1_crash")
    h2 = _group_test(buy, lambda r: (None if r["vol"] is None else r["vol"] >= reg["vol20Cut"]), +1, reg, "H2_crash")
    def _p(block):
        return block["pTwoSided"] if isinstance(block, dict) else None
    tested_base = base.get("status") == "TESTED"
    raw_p = {
        "H0_crash": _p(base["H0_crash"]["bootstrap"]) if tested_base else None,
        "H0_mean": _p(base["H0_mean"]["bootstrap"]) if tested_base else None,
        "H1_crash": _p(h1.get("crashGapBootstrap")) if h1.get("status") == "TESTED" else None,
        "H2_crash": _p(h2.get("crashGapBootstrap")) if h2.get("status") == "TESTED" else None,
    }
    holm = holm_adjust(raw_p, m_total=len(reg["primaryFamily"]))
    verdicts = {
        "H0_crash": _verdict(base.get("H0_crash", {}).get("statPp") if base.get("status") == "TESTED" else None,
                             base.get("H0_crash", {}).get("bootstrap") if base.get("status") == "TESTED" else None,
                             +1, holm.get("H0_crash"), reg["alpha"]),
        "H0_mean": _verdict(base.get("H0_mean", {}).get("statPct") if base.get("status") == "TESTED" else None,
                            base.get("H0_mean", {}).get("bootstrap") if base.get("status") == "TESTED" else None,
                            +1, holm.get("H0_mean"), reg["alpha"]),
        "H1_crash": _verdict(h1.get("crashGapPp"), h1.get("crashGapBootstrap"), +1, holm.get("H1_crash"),
                             reg["alpha"], reg["minActionEffectPp"]),
        "H2_crash": _verdict(h2.get("crashGapPp"), h2.get("crashGapBootstrap"), +1, holm.get("H2_crash"),
                             reg["alpha"], reg["minActionEffectPp"]),
    }
    # 산식을 바꾸는 후속은 40판단일 재확인 뒤에만. 그 전의 PASS는 잠정(기록만).
    for h in reg["formulaChangingHypotheses"]:
        if verdicts.get(h) == "PASS" and len(days) < reg["minDecisionDaysForFormulaChange"]:
            verdicts[h] = "PASS_PROVISIONAL"
    report.update({
        "status": "EVALUATED",
        "independentBlocks": len(days) // reg["blockLength"],
        "sizeCaveat": ("판단일 20~26일에서 5일 블록은 독립 묶음이 4~5개뿐이어서 명목 5%의 실제 오탐률이 "
                       "13~27%로 추정된다(2026-09-05 합성 시뮬레이션). 산식을 바꾸는 후속은 40판단일 재확인 뒤에만 적용한다."),
        "baseline": base, "H1": h1, "H2": h2,
        "rawP": raw_p, "holmP": holm, "verdicts": verdicts,
        "preRegisteredConsequences": {k: HYPOTHESES[k][2].get(v, "변경 없음. 표시·공개 유지.") for k, v in verdicts.items()},
        "note": ("사전등록 창 안의 새 기록만 평가했다. 후속 조치는 §3 표에 미리 정한 것만 그대로 적용한다"
                 "(소유자 위임 2026-09-05). 이 결과를 보고 임계값·가설·절차를 바꾸면 이 등록은 소멸하고 새 등록이 필요하다."),
    })
    return report


def plain_summary(report):
    s = report["sample"]
    lines = [f"[사전등록 BUY 필터 검증] 기준일 {report['asOf']} · 상태 {report['status']}",
             f"창 시작 {report['registration']['windowStart']} · 익은 판단일 {s['decisionDays']}일 · 행 {s['rows']:,} · BUY {s['buy']:,}",
             f"BUY 급등 기록 있음 {s['buySurgeKnown']} (걸림 {s['buySurgeFlagged']}) · vol20 기록 있음 {s['buyVolKnown']} (≥{report['registration']['vol20Cut']}% {s['buyHighVol']})",
             f"제외: {s['excluded']}"]
    if s["retentionTruncatedCodes"]:
        lines.append(f"⚠️ 보관 상한으로 창 안 기록이 밀려났을 수 있는 종목 {len(s['retentionTruncatedCodes'])}개")
    if s.get("nonTradingDecisionDates"):
        lines.append("⚠️ 창 안 비거래(휴장일) 자동 판단 날짜 — 판단일로 세지 않음: "
                     + ", ".join(s["nonTradingDecisionDates"]))
    if report["status"] != "EVALUATED":
        lines.append(report.get("note", ""))
        return "\n".join(lines)
    for k, v in report["verdicts"].items():
        lines.append(f"{k}: {v} (Holm p={report['holmP'].get(k)}) → {report['preRegisteredConsequences'][k]}")
    return "\n".join(lines)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--as-of", default=datetime.date.today().isoformat(), help="평가 기준일 YYYY-MM-DD (기본: 오늘)")
    ap.add_argument("--output", help="JSON 보고서를 쓸 경로(선택)")
    ap.add_argument("--json", action="store_true", help="표준출력에 JSON만 낸다")
    args = ap.parse_args(argv)
    hist, closes, prov = load_inputs()
    report = evaluate(hist, closes, args.as_of)
    report["inputs"] = prov
    if args.output:
        Path(args.output).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(plain_summary(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
