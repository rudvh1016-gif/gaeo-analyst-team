#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 기간 정합 자가 학습 가중치 (Claude 토큰 0)

각 분석가가 실제로 보는 시간축에 맞춰 채점하고, 작은 표본의 우연을 50% 쪽으로
축소한 뒤 CHIEF 합산 가중치를 계산한다 → team_weights.js

- TARO·QUANT·FLOW는 5거래일/±1%, DIANA는 20거래일/±3%로 채점한다.
- ⭐ 2026-08-31: 채점 기준이 "그냥 올랐나"(절대)에서 "시장보다 잘했나"(상대)로 바뀌었다.
  예전에는 시장 전체가 오른 구간에서는 bull이 거의 다 맞고 bear가 거의 다 틀렸다
  (index.html 실측 주석: 오른 구간 적중률 15.6% vs 내린 구간 78.6%). 그건 분석가의
  실력이 아니라 그날 시장의 방향이었고, 그 우연을 실력으로 착각해 발언권을 나눠 줬다.
  이제는 같은 기간 전 종목 수익률의 중앙값을 빼고 남은 초과수익으로 채점한다.
- 가중치는 역할 사전비중에 베이지안 보정 적중률을 곱한다. DIANA는 단기 방향표가
  아니라 장기 품질 필터이므로 기본 발언권을 12%로 제한한다.
- 업종 가중치는 표본 200건부터 쓰되 전역값과 부드럽게 섞어 과적합을 줄인다.
- analyze_auto.py(CHIEF 합산)와 index.html(리더보드 가중치 표시)이 이 파일을 읽는다.

실행: python3 compute_team_weights.py  →  team_weights.js
(워크플로우에서 analyze_auto.py보다 먼저 실행)
"""
import json, re, os, datetime, math

HERE = os.path.dirname(os.path.abspath(__file__))
ANALYSTS = ["taro", "diana", "nova", "flow"]   # nova = QUANT (내부 id는 호환성 위해 유지)
MIN_N_SECTOR = 200      # 업종 오버라이드 최소 표본
BAYES_PRIOR_N = 120     # 작은 표본을 50% 쪽으로 축소하는 가상 표본
SECTOR_SHRINK_N = 800   # 업종값과 전역값을 섞는 강도
SKILL_SENSITIVITY = 3.0

# 시장 대비 채점 설정 (2026-08-31 신설)
#   기준선(benchmark)은 "같은 기간 전 종목 수익률의 중앙값"이다. 지수(KOSPI)가 아니라
#   중앙값을 쓰는 이유: ① 우리가 보는 모집단(600종목)과 정확히 같은 대상이고,
#   ② 소수 초대형주가 지수를 끌어올려도 중앙값은 흔들리지 않아 "체감 시장"에 가깝고,
#   ③ 외부 지수 데이터에 의존하지 않아 파이프라인이 단순해진다.
MARKET_RELATIVE = True
MARKET_MEDIAN_MIN_CODES = 30   # 이보다 표본이 적으면 중앙값을 신뢰하지 않는다
RULES = {
    "taro":  {"days": 5,  "deadband": 1.0, "prior": 0.30},
    "diana": {"days": 20, "deadband": 3.0, "prior": 0.12},
    "nova":  {"days": 5,  "deadband": 1.0, "prior": 0.28},
    "flow":  {"days": 5,  "deadband": 1.0, "prior": 0.30},
}


def load_js_object(path, varname):
    if not os.path.exists(path):
        return None
    txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None


def load_sectors():
    try:
        t = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
        arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
        return {d["code"]: d.get("sector") or "기타" for d in arr}
    except Exception:
        return {}


def market_median(closes, day, days):
    """시장 기준선 — 같은 날 출발해 days 거래일 뒤, 전 종목 수익률의 중앙값(%).

    한 종목의 수익률에서 이 값을 빼면 "시장 대비 얼마나 더/덜 갔나"만 남는다.
    표본이 MARKET_MEDIAN_MIN_CODES 미만이면 기준선을 만들지 않고 None을 준다
    (몇 종목으로 만든 중앙값은 기준선이 아니라 노이즈다).

    closes: {종목코드: [{"date":…, "close":…}, …]} — 날짜 오름차순 정렬 가정.
    """
    rets = []
    for rows in closes.values():
        # 판단일 시점의 기준가 = 그날(또는 그 이전 마지막) 종가.
        #   개별 판단은 장중 가격을 base로 쓸 수 있지만, 시장 기준선은 모든 종목에
        #   같은 잣대를 적용해야 비교가 공정하다.
        prior = [r for r in rows if r["date"] <= day]
        if not prior:
            continue
        b = prior[-1]["close"]
        if not b:
            continue
        after = [r for r in rows if r["date"] > day]
        if len(after) < days:
            continue
        rets.append((after[days - 1]["close"] - b) / b * 100.0)
    if len(rets) < MARKET_MEDIAN_MIN_CODES:
        return None
    rets.sort()
    m = len(rets)
    return rets[m // 2] if m % 2 else (rets[m // 2 - 1] + rets[m // 2]) / 2.0


def score_stance(stance, ret, deadband=1.0):
    """분석가별 시간축에 대응하는 방향 채점 규칙.

    ⭐ 2026-08-31부터 여기 들어오는 ret은 '절대 수익률'이 아니라 '시장 중앙값을 뺀
    초과수익'이다(MARKET_RELATIVE). 그래서 deadband ±1%의 뜻도 "1% 올랐나"가 아니라
    "시장보다 1%p 잘했나"로 바뀐다. 함수 자체의 논리는 그대로다."""
    if stance == "bull":
        return "hit" if ret > deadband else ("miss" if ret < -deadband else "mid")
    if stance == "bear":
        return "hit" if ret < -deadband else ("miss" if ret > deadband else "mid")
    return None


def score_call(call, ret):
    """index.html scoreCall과 동일한 CHIEF 팀 판단 채점 규칙.
    ⭐ 2026-08-15: HOLD가 ±5%를 벗어나면 '중립'이 아니라 '빗나감'으로 센다.
    예전에는 이 함수와 index.html이 관대(중립), compute_model_intelligence.py가
    엄격(빗나감)으로 갈려 같은 데이터의 통산 적중률이 70.7% vs 51.2%로 19.5%p 달랐다.
    엄격 쪽으로 통일한다. 이 값은 team 요약 표시용이며 분석가 가중치 계산
    (score_stance)에는 쓰이지 않으므로 모델 동작은 바뀌지 않는다."""
    if call == "BUY":
        return "hit" if ret > 1 else ("miss" if ret < -1 else "mid")
    if call == "SELL":
        return "hit" if ret < -1 else ("miss" if ret > 1 else "mid")
    return "hit" if abs(ret) <= 5 else "miss"


# 🏷️ 점수 의미(semantics)가 바뀐 버전끼리 섞어 학습하지 않는다(요구 7-8).
#    2026-08-15 hotfix로 QUANT의 RSI·5일수익률 정의가 바뀌었고 TARO가 미성숙 지표를
#    빼기 시작했다. 그 이전 점수로 학습한 가중치를 새 점수에 이어 붙이면
#    서로 다른 분석가를 한 사람처럼 취급하는 셈이 된다.
#    표본이 충분히 쌓이기 전까지는 기존 안정 가중치를 그대로 쓴다(fallback).
try:
    from analyze_auto import BASE_MODEL_VERSION, PRE_HOTFIX_BASE
except Exception:                                   # 순환 import 방지용 안전망
    BASE_MODEL_VERSION, PRE_HOTFIX_BASE = "base-2026-08-15-parity-hotfix", "PRE_HOTFIX_BASE"

MIN_SAMPLES_NEW_VERSION = 3000   # 새 버전 표본이 이만큼 쌓여야 새로 학습한다


def record_base_version(entry):
    """기록의 기본모델 버전. 없으면 hotfix 이전 기록이다."""
    return entry.get("baseModelVersion") or PRE_HOTFIX_BASE


def main():
    hist = load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY")
    if not hist:
        print("history.js 없음 — 가중치 계산 생략"); return 1
    try:
        data = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
        stocks = data.get("stocks", {})
    except Exception:
        print("analysis_data.json 없음 — 가중치 계산 생략"); return 1
    sectors = load_sectors()

    # 종목별 (날짜, 종가) 시계열 — 채점용
    closes = {}
    for code, s in stocks.items():
        d = s.get("daily")
        if isinstance(d, list) and d:
            rows = sorted((r for r in d if r.get("date") and isinstance(r.get("close"), (int, float))),
                          key=lambda r: r["date"])
            closes[code] = rows

    def eval_ret(code, day, base, days):
        """판단일 이후 지정한 거래일 종가 대비 수익률."""
        rows = closes.get(code)
        if not rows or not base:
            return None
        after = [r for r in rows if r["date"] > day]
        if len(after) < days:
            return None
        return (after[days - 1]["close"] - base) / base * 100.0

    # 같은 (날짜, 기간) 조합이 수천 번 조회되므로 결과를 캐시한다.
    market_cache = {}

    def market_median_ret(day, days):
        key = (day, days)
        if key not in market_cache:
            market_cache[key] = market_median(closes, day, days)
        return market_cache[key]

    # 집계: 전체 + 업종별
    def zero():
        return {a: {"hit": 0, "miss": 0} for a in ANALYSTS}
    g = zero()
    sec = {}
    team_hit = 0
    team_miss = 0
    # ⭐ 2026-09-04 정직성 보강: 팀 적중률 62.4% 같은 숫자는 그 자체로는 잘한 건지
    #    알 수 없다. score_call은 BUY·SELL을 ±1%로, HOLD를 ±5%로 채점하는데 실제
    #    판단의 대부분이 HOLD라서, "아무 생각 없이 전부 HOLD"라고만 해도 비슷한
    #    점수가 나온다. 그래서 똑같은 기록·똑같은 채점규칙으로 "전부 HOLD" 기준선을
    #    같이 계산해 화면에 나란히 낸다. 기준선을 못 넘으면 못 넘는 대로 밝힌다.
    hold_hit = 0
    hold_miss = 0
    # 판단 종류별로도 따로 센다 — 잣대(±1% vs ±5%)가 달라서 한 칸에 합쳐 보여주면
    # 서로 다른 시험의 점수를 평균한 셈이 된다.
    by_call = {c: {"hit": 0, "miss": 0, "mid": 0} for c in ("BUY", "HOLD", "SELL")}
    # Constitution statisticalPolicy: "같은 날 600종목은 서로 독립이 아니다.
    # 표본 크기는 raw N이 아니라 unique decision days 기준으로 판단한다."
    # 화면이 "3,463건"만 보여 주면 6일치를 3천 건처럼 보이게 하므로 날짜도 함께 낸다.
    team_days = set()
    # 절대 기준으로 채점하면 결과가 어떻게 달라지는지 나란히 기록해 둔다.
    # (가중치에는 쓰지 않는다. 이 변경이 실제로 무엇을 바꿨는지 보이게 하는 용도다.)
    g_abs = {a: {"hit": 0, "miss": 0} for a in ANALYSTS}
    market_missing = 0     # 시장 기준선을 못 구해 절대 기준으로 되돌린 건수
    version_counts = {}
    # 어떤 버전으로 학습할지 먼저 정한다. 새 버전 표본이 충분하면 새 버전만,
    # 아직 모자라면 이전 버전 기록으로 계속 학습한다(급조한 가중치를 만들지 않는다).
    for _code, _lst in hist.items():
        if isinstance(_lst, list):
            for _e in _lst:
                if isinstance(_e, dict):
                    v = record_base_version(_e)
                    version_counts[v] = version_counts.get(v, 0) + 1
    new_n = version_counts.get(BASE_MODEL_VERSION, 0)
    if new_n >= MIN_SAMPLES_NEW_VERSION:
        learn_versions = {BASE_MODEL_VERSION}
        version_mode = "NEW_VERSION_ONLY"
    else:
        learn_versions = {v for v in version_counts if v != BASE_MODEL_VERSION}
        version_mode = "PRE_HOTFIX_FALLBACK"
    print(f"가중치 학습 버전 — {version_mode} · 새 버전 표본 {new_n:,}건 "
          f"(기준 {MIN_SAMPLES_NEW_VERSION:,}건) · 버전 분포 {version_counts}")
    for code, lst in hist.items():
        if not re.match(r"^\d{6}$", str(code)) or not isinstance(lst, list):
            continue
        sname = sectors.get(code, "기타")
        for e in lst:
            base = e.get("base")
            day = str(e.get("date", ""))[:10]
            if not base or not day:
                continue
            if record_base_version(e) not in learn_versions:
                continue            # 다른 버전 점수와 섞지 않는다
            if e.get("judgmentWithheld") or e.get("call") == "JUDGMENT_WITHHELD":
                continue            # 판단 보류는 채점 대상이 아니다
            team_ret = eval_ret(code, day, base, 5)
            team_score = score_call(e.get("call"), team_ret) if team_ret is not None else None
            if team_score == "hit":
                team_hit += 1
                team_days.add(day)
            elif team_score == "miss":
                team_miss += 1
                team_days.add(day)
            if team_score in ("hit", "miss", "mid"):
                _call = e.get("call")
                if _call in by_call:
                    by_call[_call][team_score] += 1
            if team_score in ("hit", "miss"):
                # 같은 기록을 "전부 HOLD였다면"으로 다시 채점한 기준선.
                _hold = score_call("HOLD", team_ret)
                if _hold == "hit":
                    hold_hit += 1
                elif _hold == "miss":
                    hold_miss += 1
            for a in ANALYSTS:
                ana = e.get(a)
                if not isinstance(ana, dict):
                    continue
                rule = RULES[a]
                ret = eval_ret(code, day, base, rule["days"])
                if ret is None:
                    continue
                # 시장 대비 초과수익으로 채점한다. 기준선을 못 구하면(표본 부족)
                # 조용히 틀린 채점을 하지 않고 절대 기준으로 되돌리되, 그 건수를
                # 남겨 나중에 "얼마나 되돌렸는지"를 볼 수 있게 한다.
                if MARKET_RELATIVE:
                    mkt = market_median_ret(day, rule["days"])
                    if mkt is None:
                        market_missing += 1
                        scored_ret = ret
                    else:
                        scored_ret = ret - mkt
                else:
                    scored_ret = ret
                s_abs = score_stance(ana.get("stance"), ret, rule["deadband"])
                if s_abs == "hit":
                    g_abs[a]["hit"] += 1
                elif s_abs == "miss":
                    g_abs[a]["miss"] += 1
                s = score_stance(ana.get("stance"), scored_ret, rule["deadband"])
                if s == "hit":
                    g[a]["hit"] += 1
                    sec.setdefault(sname, zero())[a]["hit"] += 1
                elif s == "miss":
                    g[a]["miss"] += 1
                    sec.setdefault(sname, zero())[a]["miss"] += 1

    def weights_from(acc_tbl):
        """역할 사전비중 × 베이지안 보정 적중률로 안정적인 가중치를 계산."""
        raw = {}
        stat = {}
        for a in ANALYSTS:
            n = acc_tbl[a]["hit"] + acc_tbl[a]["miss"]
            acc = (acc_tbl[a]["hit"] / n * 100) if n else None
            adjusted = (acc_tbl[a]["hit"] + BAYES_PRIOR_N * 0.5) / (n + BAYES_PRIOR_N)
            stat[a] = {
                "n": n,
                "acc": round(acc, 1) if acc is not None else None,
                "adjustedAcc": round(adjusted * 100, 1),
                "days": RULES[a]["days"],
                "deadband": RULES[a]["deadband"],
            }
            raw[a] = RULES[a]["prior"] * math.exp(SKILL_SENSITIVITY * (adjusted - 0.5))
        tot = sum(raw.values())
        return {a: round(raw[a] / tot, 4) for a in ANALYSTS}, stat

    gw, gstat = weights_from(g)
    graded_total = sum(v["n"] for v in gstat.values())

    # 절대 기준으로 채점했을 때의 적중률을 같은 표에 덧붙인다(참고용, 가중치 미반영).
    for a in ANALYSTS:
        n_abs = g_abs[a]["hit"] + g_abs[a]["miss"]
        gstat[a]["absoluteAcc"] = round(g_abs[a]["hit"] / n_abs * 100, 1) if n_abs else None
        gstat[a]["absoluteN"] = n_abs

    sectors_out = {}
    for sname, tbl in sec.items():
        n_sec = sum(tbl[a]["hit"] + tbl[a]["miss"] for a in ANALYSTS)
        if n_sec >= MIN_N_SECTOR:
            local_w, sstat = weights_from(tbl)
            blend = min(0.75, n_sec / (n_sec + SECTOR_SHRINK_N))
            sw = {a: round(gw[a] * (1 - blend) + local_w[a] * blend, 4) for a in ANALYSTS}
            norm = sum(sw.values()) or 1
            sw = {a: round(sw[a] / norm, 4) for a in ANALYSTS}
            sectors_out[sname] = {"weights": sw, "acc": sstat, "graded": n_sec,
                                  "globalBlend": round(1 - blend, 3)}

    payload = {
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "evalDays": 5,
        "horizons": {a: {"days": RULES[a]["days"], "deadband": RULES[a]["deadband"]}
                     for a in ANALYSTS},
        "method": "role-prior-bayesian-shrinkage-v3-market-relative",
        # 채점 기준을 명시적으로 남긴다. Evolution 매니페스트가 teamWeightVersion으로
        # 이 값을 집어가므로, 기준이 바뀐 가중치가 예전 기준 기록과 섞이지 않는다.
        # ⚠️ 이것은 Constitution의 scoringVersion(= build_model_scoreboard.py ·
        #    compute_model_intelligence.py의 call_hit/stance_hit 의미)과 다른 축이다.
        #    그 두 파일은 이번에 건드리지 않았으므로 Evolution 채점 의미·누적 일수는
        #    그대로다.
        "scoring": {
            "basis": "market_relative_excess" if MARKET_RELATIVE else "absolute_return",
            "benchmark": "cross_sectional_median_of_covered_universe",
            "benchmarkMinCodes": MARKET_MEDIAN_MIN_CODES,
            "fallbackToAbsoluteN": market_missing,
            "since": "2026-08-31",
            "note": ("분석가 채점만 시장 대비로 바꿨다. 팀 적중률(team.acc)은 "
                     "사용자에게 계속 같은 뜻으로 보여야 하므로 절대 기준을 유지한다."),
        },
        "global": {
            "version": ("tw-2026-08-31-market-relative" if MARKET_RELATIVE
                        else "tw-2026-08-15-absolute"),
            "weights": gw,
            "acc": gstat,
            "graded": graded_total,
            # 팀 적중률은 화면에 그대로 노출되는 숫자라 뜻이 조용히 바뀌면 안 된다.
            # 그래서 절대 기준(score_call)을 유지한다 — 분석가 발언권 학습만 상대 기준.
            "team": {
                "basis": "absolute_return",
                "hit": team_hit,
                "miss": team_miss,
                "n": team_hit + team_miss,
                # 독립 표본 단위(Constitution independenceUnit = decision_date).
                "uniqueDecisionDays": len(team_days),
                # Evolution 성적표가 결론을 내기 위해 요구하는 최소 판단일수.
                # 이보다 적으면 화면에서 "아직 결론을 말할 단계가 아님"을 함께 밝힌다.
                "minDaysForConclusion": 20,
                "acc": round(team_hit / (team_hit + team_miss) * 100, 1)
                if team_hit + team_miss else None,
                # ⭐ 정직성: 같은 기록을 "전부 HOLD"로만 채점한 기준선. 팀 적중률이
                #    이 값을 못 넘으면 그 숫자는 실력의 증거가 아니다.
                "holdBaselineAcc": round(hold_hit / (hold_hit + hold_miss) * 100, 1)
                if hold_hit + hold_miss else None,
                "holdBaselineN": hold_hit + hold_miss,
                "liftVsHoldPp": round(
                    team_hit / (team_hit + team_miss) * 100
                    - hold_hit / (hold_hit + hold_miss) * 100, 1)
                if (team_hit + team_miss) and (hold_hit + hold_miss) else None,
                # 판단 종류별 성적. BUY·SELL은 ±1%, HOLD는 ±5% 잣대라 뜻이 다르다.
                "byCall": {
                    c: {"n": v["hit"] + v["miss"],
                        "acc": round(v["hit"] / (v["hit"] + v["miss"]) * 100, 1)
                        if v["hit"] + v["miss"] else None,
                        "band": ("±1%" if c in ("BUY", "SELL") else "±5%"),
                        # ⭐ 2026-09-04 편향 감사: 채점에서 빠지는 비율이 판단 종류마다
                        #    다르다. BUY·SELL은 ±1% 안쪽이면 '애매'로 빠지지만 HOLD는
                        #    빠지는 게 없다. 이 사실을 안 밝히면 합친 적중률이 서로 다른
                        #    크기의 표본을 섞은 값이라는 걸 알 수 없다.
                        "excludedMid": v["mid"],
                        "excludedPct": round(
                            v["mid"] / (v["hit"] + v["miss"] + v["mid"]) * 100, 1)
                        if v["hit"] + v["miss"] + v["mid"] else None}
                    for c, v in by_call.items()
                },
                "bandNote": ("BUY·SELL은 ±1%, HOLD는 ±5% 기준으로 채점한다. "
                             "또 BUY·SELL만 ±1% 안쪽이 '애매'로 채점에서 빠진다"
                             "(HOLD는 빠지는 게 없다). 잣대와 제외율이 모두 다르므로 "
                             "합친 적중률 하나만 보고 판단하면 안 된다."),
            },
        },
        "sectors": sectors_out,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    header = (
        "// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치\n"
        "// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,\n"
        "// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.\n"
        "// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로\n"
        "// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).\n"
        "// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.\n"
    )
    with open(os.path.join(HERE, "team_weights.js"), "w", encoding="utf-8") as f:
        f.write(header + "const TEAM_WEIGHTS = " + body + ";\n")

    wtxt = " · ".join(f"{a} {gw[a]*100:.0f}%(보정 {gstat[a]['adjustedAcc']}%·n{gstat[a]['n']})" for a in ANALYSTS)
    basis = "시장대비(초과수익)" if MARKET_RELATIVE else "절대수익률"
    absxt = " · ".join(f"{a} 절대 {gstat[a]['absoluteAcc']}%" for a in ANALYSTS)
    print(f"team_weights.js 저장 - 채점 기준 {basis} · {graded_total}건 · 전역 가중치: {wtxt}"
          f" · 업종 오버라이드 {len(sectors_out)}개")
    print(f"  참고(가중치 미반영) {absxt} · 기준선 부재로 절대 채점한 건수 {market_missing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
