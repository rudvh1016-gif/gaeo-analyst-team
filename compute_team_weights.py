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
import json, re, os, datetime, math, random, bisect

HERE = os.path.dirname(os.path.abspath(__file__))
ANALYSTS = ["taro", "diana", "nova", "flow"]   # nova = QUANT (내부 id는 호환성 위해 유지)
MIN_N_SECTOR = 200      # 업종 오버라이드 최소 표본
BAYES_PRIOR_N = 120     # 작은 표본을 50% 쪽으로 축소하는 가상 표본
SECTOR_SHRINK_N = 800   # 업종값과 전역값을 섞는 강도
SKILL_SENSITIVITY = 3.0

# ⭐ 2026-09-04 분석가 전수 재검증에서 확인된 사실
#
#    BAYES_PRIOR_N=120은 "채점 120건"을 사전표본으로 쓴다. 그런데 채점 건수는
#    같은 날 600종목이 한꺼번에 들어와 부풀려진 값이다. 실측(2026-09-04): 채점
#    3,912건이지만 서로 다른 판단일은 10일뿐이다. 그래서 축소가 실제로 깎는 폭은
#    TARO +0.1%p · QUANT -0.6%p · FLOW +0.8%p로 사실상 0이다. Constitution
#    statisticalPolicy(independenceUnit = decision_date)와 어긋나는 지점이다.
#
# ⭐ 2026-09-05 결정: 축소의 표본 단위를 '서로 다른 판단일'로 바꿔 실제 적용한다.
#    소유자가 "결정을 맡기지 말고 최선의 판단으로 진행"하라고 위임했고, DIANA의
#    20거래일 채점이 시작되는 2026-09-14 **전에** 정했다(DIANA 결과를 보고 고른 것이 아니다).
#    이유:
#      1) Constitution의 독립 단위(decision_date)와 구현을 맞춘다.
#      2) 건수 단위로는 DIANA 첫 채점일에 600건이 한꺼번에 들어와 하루치 성적만으로
#         발언권이 ±20% 넘게 뛸 수 있다(적중 60%면 ×1.28, 40%면 ×0.78). 판단일 단위면
#         첫날 이동은 ±1.5% 안이고 20일에 걸쳐 서서히 반영된다.
#      3) 방향이 보수적이다(사전비중 쪽으로). 판단일이 쌓이면 스스로 옛 값에 수렴한다.
#    옛 건수 단위 값은 rowBasedAdjustedAcc / dayBasedShadow.rowBasedLegacy에 비교용으로 남긴다.
#    WEIGHT_MATURITY_GATE(판단일 20일 미만이면 통째로 사전값)는 절벽을 20일째로 옮길 뿐이라
#    켜지 않는다.
MIN_DAYS_FOR_WEIGHT_LEARNING = 20   # Evolution minEvalDays와 같은 값
WEIGHT_MATURITY_GATE = False        # 거친 장치. 판단일 단위 축소가 같은 목적을 절벽 없이 달성한다
WEIGHT_SHRINKAGE_UNIT = "decision_day"      # "graded_row"가 2026-09-05 이전 방식
DAY_PRIOR_N = MIN_DAYS_FOR_WEIGHT_LEARNING   # 판단일 단위 사전표본(가상 판단일 20일 = 50%)

BOOTSTRAP_ROUNDS = 1000
BOOTSTRAP_SEED = 20260904   # 고정 — 같은 기록이면 항상 같은 신뢰구간이 나오게 한다

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


def load_names():
    """code → 종목명. BUY 최악 사례를 화면에 이름으로 보여주기 위해 쓴다."""
    try:
        t = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
        arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
        return {d["code"]: d.get("name") or d["code"] for d in arr}
    except Exception:
        return {}


# Display evidence is separate from the unchanged learning / score path.
from buy_warning import (OVERHEAT_RET5_PCT, OVERHEAT_RET20_PCT,
                         OVERHEAT_VOL20_PCT, vol20_at)
from buy_warning_evidence import BUY_CRASH_PCT


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


def _pct(hit, miss):
    n = hit + miss
    return (hit / n * 100.0) if n else None


def _block_bootstrap(day_counts, stat_fn, rounds=BOOTSTRAP_ROUNDS, seed=BOOTSTRAP_SEED, block_length=5):
    """판단일 단위 블록 부트스트랩 95% 구간.

    ⭐ 왜 날짜 단위인가: 같은 날 600종목은 같은 시장 충격을 공유하므로 독립 시행이
    아니다(Constitution statisticalPolicy.independenceUnit = "decision_date").
    건수 단위로 재추출하면 구간이 실제보다 훨씬 좁게 나온다.

    day_counts: {판단일: {"own": [hit, miss], "bull": [...], "bear": [...]}}
    연속 block_length개 판단일을 묶어 재추출한다. 5D/20D 수익률 중첩을 고려하며,
    이는 여전히 사후 탐색 구간이고 다중비교 보정이나 독립 검증을 대신하지 않는다.
    날짜별 적중/빗나감 개수만 미리 세어 두면
    행을 다시 훑지 않고 같은 결과를 얻는다(수치적으로 동일하며 훨씬 빠르다).

    ⚠️ 판단일이 적으면(지금 10일) 이 구간 자체가 불안정하다. 구간이 좁게 나왔다고
    해서 확실하다는 뜻이 아니다 — 판단일 수를 항상 같이 봐야 한다.
    """
    days = sorted(day_counts)
    if len(days) < max(3, 2 * block_length):
        return None
    rng = random.Random(seed)
    keys = ("own", "bull", "bear")
    vals = []
    for _ in range(rounds):
        agg = {k: [0, 0] for k in keys}
        picked = []
        while len(picked) < len(days):
            start = rng.randrange(len(days) - block_length + 1)
            picked.extend(days[start:start + block_length])
        for day in picked[:len(days)]:
            block = day_counts[day]
            for k in keys:
                agg[k][0] += block[k][0]
                agg[k][1] += block[k][1]
        v = stat_fn(agg)
        if v is not None:
            vals.append(v)
    if len(vals) < 20:
        return None
    vals.sort()
    return [round(vals[int(len(vals) * 0.025)], 1), round(vals[int(len(vals) * 0.975)], 1)]


def _stat_own(agg):
    return _pct(*agg["own"])


def _stat_lift(agg):
    """본인 적중률 − 같은 행에서 '한 방향만 계속 말했을 때'의 더 좋은 쪽 적중률.

    팀 적중률에 '전부 HOLD였다면' 기준선이 있는 것과 같은 이치의 분석가판 기준선이다.
    이 값이 0보다 확실히 크지 않으면, 그 분석가의 적중률은 방향을 고른 실력이 아니라
    그 구간에서 자기가 고른 종목들이 어느 쪽으로 움직였는지를 잰 것이다.
    """
    own, bull, bear = _pct(*agg["own"]), _pct(*agg["bull"]), _pct(*agg["bear"])
    if own is None or bull is None or bear is None:
        return None
    return round(own - max(bull, bear), 2)


def buy_outcome_stats(hist, closes, names, learn_versions, record_version):
    from buy_warning_evidence import compute
    # Current model disclosure must not be relabelled with a fallback learning version.
    return compute(hist, closes, names, {BASE_MODEL_VERSION}, record_version)


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
    sec_days = {}   # {업종: {분석가: set(판단일)}} — 업종 가중치도 판단일 단위로 축소
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
    # ⭐ 2026-09-04 분석가 전수 재검증: 분석가 적중률도 팀 적중률과 똑같이
    #    "판단일 수"와 "아무 실력 없이 나왔을 기준선"을 함께 내야 뜻이 통한다.
    #    a_days[분석가][판단일] = {"own":[적중,빗나감], "bull":[...], "bear":[...]}
    #      own  = 실제로 낸 의견의 성적
    #      bull = 같은 행에서 "항상 강세"라고만 했을 때의 성적
    #      bear = 같은 행에서 "항상 약세"라고만 했을 때의 성적
    a_days = {a: {} for a in ANALYSTS}
    # 얼마나 자주 말하고(중립 비율) 얼마나 세게 미는지(|점수-50|).
    # 발언권 33%인데 실제로 점수를 미는 힘은 1점도 안 되는 상황을 화면이 알 수 있게 한다.
    a_voice = {a: {"present": 0, "neu": 0, "bull": 0, "bear": 0, "devs": []}
               for a in ANALYSTS}
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
                # 목소리 통계는 채점 가능 여부와 무관하다("얼마나 자주·세게 말하나").
                voice = a_voice[a]
                voice["present"] += 1
                stance = ana.get("stance")
                if stance in ("bull", "bear", "neu"):
                    voice[stance] += 1
                raw_score = ana.get("score")
                if isinstance(raw_score, (int, float)):
                    voice["devs"].append(abs(float(raw_score) - 50.0))
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
                if s in ("hit", "miss"):
                    sec_days.setdefault(sname, {x: set() for x in ANALYSTS})[a].add(day)
                # 판단일 단위 집계 + 같은 행의 '한 방향만 말하기' 기준선.
                # 방향 의견을 낸 행만 대상이다(중립은 애초에 채점 대상이 아니다).
                if stance in ("bull", "bear"):
                    blk = a_days[a].setdefault(
                        day, {"own": [0, 0], "bull": [0, 0], "bear": [0, 0]})
                    for key, forced in (("own", stance), ("bull", "bull"), ("bear", "bear")):
                        vv = score_stance(forced, scored_ret, rule["deadband"])
                        if vv == "hit":
                            blk[key][0] += 1
                        elif vv == "miss":
                            blk[key][1] += 1

    def weights_from(acc_tbl, decision_days):
        """역할 사전비중 × 베이지안 보정 적중률로 안정적인 가중치를 계산.

        ⭐ 2026-09-05부터 축소(shrinkage)의 표본 단위는 '채점 건수'가 아니라
        '서로 다른 판단일'이다(Constitution statisticalPolicy.independenceUnit =
        decision_date). 같은 날 600종목은 같은 시장 충격을 받은 한 번의 시행이다.
          adjusted = (적중률 × 판단일수 + DAY_PRIOR_N × 0.5) / (판단일수 + DAY_PRIOR_N)
        판단일이 0이면 0.5(역할 사전비중 그대로)다. 판단일이 쌓일수록 사전값의 힘은
        자연히 줄어든다(20일이면 절반, 60일이면 1/4). 옛 방식(건수 단위)은
        rowBasedAdjustedAcc로 같이 실어 비교할 수 있게 한다.

        decision_days: {분석가: 서로 다른 판단일 수}. 전역이면 전체 판단일, 업종이면
        그 업종에서 채점된 판단일이다. WEIGHT_MATURITY_GATE(기본 꺼짐)는 판단일이
        MIN_DAYS_FOR_WEIGHT_LEARNING 미만인 분석가를 통째로 0.5로 되돌리는 더 거친
        장치인데, 판단일 단위 축소가 같은 목적을 절벽 없이 달성하므로 켜지 않는다.
        """
        raw = {}
        stat = {}
        for a in ANALYSTS:
            n = acc_tbl[a]["hit"] + acc_tbl[a]["miss"]
            acc = (acc_tbl[a]["hit"] / n * 100) if n else None
            row_adjusted = (acc_tbl[a]["hit"] + BAYES_PRIOR_N * 0.5) / (n + BAYES_PRIOR_N)
            # decision_days는 필수다. 빠지면 판단일 0 → 모두 사전값이 되어 조용히 틀리므로 기본값을 두지 않는다.
            n_days = int(decision_days.get(a, 0) or 0) if n else 0
            if WEIGHT_SHRINKAGE_UNIT == "decision_day":
                h_eff = (acc / 100.0 * n_days) if (acc is not None and n_days) else 0.0
                adjusted = (h_eff + DAY_PRIOR_N * 0.5) / (n_days + DAY_PRIOR_N)
            else:
                adjusted = row_adjusted
            gated = False
            if WEIGHT_MATURITY_GATE:
                if decision_days.get(a, 0) < MIN_DAYS_FOR_WEIGHT_LEARNING:
                    adjusted = 0.5
                    gated = True
            stat[a] = {
                "n": n,
                "acc": round(acc, 1) if acc is not None else None,
                # ⭐ 2026-09-04: n=0이면 이 값은 실측이 아니라 사전값(50%)이다.
                #    예전에는 그대로 "50.0"을 실어 보내 화면이 "DIANA 보정 적중 50%"로
                #    그렸고, 읽는 사람은 동전 던지기 수준으로 측정됐다고 오해했다.
                #    계산에는 계속 0.5를 쓰되, 밖으로는 null을 내보내 구분한다.
                "adjustedAcc": round(adjusted * 100, 1) if n else None,
                "adjustedAccUsedInWeights": round(adjusted * 100, 1),
                "rowBasedAdjustedAcc": round(row_adjusted * 100, 1) if n else None,
                "shrinkageUnit": WEIGHT_SHRINKAGE_UNIT,
                "shrinkagePriorDays": DAY_PRIOR_N,
                "nEffectiveDays": n_days,
                "gatedToPrior": gated,
                # ⚠️ 이 days는 '채점 지평'(며칠 뒤 종가로 채점하나)이지 판단일 수가 아니다.
                #    판단일 수는 uniqueDecisionDays로 따로 싣는다.
                "days": RULES[a]["days"],
                "deadband": RULES[a]["deadband"],
            }
            raw[a] = RULES[a]["prior"] * math.exp(SKILL_SENSITIVITY * (adjusted - 0.5))
        tot = sum(raw.values())
        return {a: round(raw[a] / tot, 4) for a in ANALYSTS}, stat

    # 분석가별 '서로 다른 판단일 수' — Constitution statisticalPolicy의 독립 단위.
    a_decision_days = {a: len(a_days[a]) for a in ANALYSTS}

    gw, gstat = weights_from(g, a_decision_days)
    graded_total = sum(v["n"] for v in gstat.values())

    # 절대 기준으로 채점했을 때의 적중률을 같은 표에 덧붙인다(참고용, 가중치 미반영).
    for a in ANALYSTS:
        n_abs = g_abs[a]["hit"] + g_abs[a]["miss"]
        gstat[a]["absoluteAcc"] = round(g_abs[a]["hit"] / n_abs * 100, 1) if n_abs else None
        gstat[a]["absoluteN"] = n_abs

    # ⭐ 2026-09-04 분석가 전수 재검증 — 적중률 하나만 내보내면 뜻이 통하지 않는다.
    #    ① 판단일 수(같은 날 600종목은 독립 시행이 아니다)
    #    ② 판단일 단위 블록 부트스트랩 95% 구간
    #    ③ 같은 행에서 '한 방향만 계속 말했을 때'의 기준선과 그 차이(실력 폭)
    #    ④ 얼마나 자주 말하는지(중립 비율)와 실제로 점수를 미는 힘
    #    실측 결과 네 명 모두 ③의 신뢰구간이 0을 포함하거나(=실력 미확인) 음수였다.
    #    그 사실을 숨기지 않고 그대로 싣는다.
    for a in ANALYSTS:
        st = gstat[a]
        blocks = a_days[a]
        st["uniqueDecisionDays"] = a_decision_days[a]
        st["minDaysForConclusion"] = MIN_DAYS_FOR_WEIGHT_LEARNING
        tot_bull = [sum(b["bull"][i] for b in blocks.values()) for i in (0, 1)]
        tot_bear = [sum(b["bear"][i] for b in blocks.values()) for i in (0, 1)]
        ab, ar = _pct(*tot_bull), _pct(*tot_bear)
        st["alwaysBullAcc"] = round(ab, 1) if ab is not None else None
        st["alwaysBearAcc"] = round(ar, 1) if ar is not None else None
        best_fixed = max(x for x in (ab, ar) if x is not None) if (ab is not None) else None
        st["bestFixedDirectionAcc"] = round(best_fixed, 1) if best_fixed is not None else None
        st["liftVsFixedPp"] = (round(100.0 * g[a]["hit"] / st["n"] - best_fixed, 1)
                               if (st["acc"] is not None and best_fixed is not None) else None)
        st["acc95"] = _block_bootstrap(blocks, _stat_own, block_length=RULES[a]["days"]) if blocks else None
        st["lift95"] = _block_bootstrap(blocks, _stat_lift, block_length=RULES[a]["days"]) if blocks else None
        st["evidenceStatus"] = "EXPLORATORY_NOT_VALIDATED"
        st["intervalBlockDays"] = RULES[a]["days"]
        # 화면이 스스로 판정하지 않도록 결론 라벨을 여기서 정한다.
        #   NOT_GRADED_YET      아직 채점된 판단이 없다(DIANA — 20거래일이 안 익었다)
        #   BELOW_FIXED_BASELINE 한 방향만 말한 것보다 확실히 나빴다
        #   NOT_PROVEN          기준선보다 낫다는 게 아직 증명되지 않았다
        #   PROVEN_ABOVE        기준선보다 확실히 낫다
        if not st["n"]:
            st["skillStatus"] = "NOT_GRADED_YET"
        elif st["lift95"] and st["lift95"][1] < 0:
            st["skillStatus"] = "BELOW_FIXED_BASELINE"
        elif st["lift95"] and st["lift95"][0] > 0:
            st["skillStatus"] = "ABOVE_FIXED_BASELINE"  # descriptive, not proof
        else:
            st["skillStatus"] = "NOT_PROVEN"
        voice = a_voice[a]
        present = voice["present"] or 0
        devs = voice["devs"]
        devs_sorted = sorted(devs)
        mean_dev = (sum(devs) / len(devs)) if devs else None
        med_dev = None
        if devs_sorted:
            k = len(devs_sorted)
            med_dev = (devs_sorted[k // 2] if k % 2
                       else (devs_sorted[k // 2 - 1] + devs_sorted[k // 2]) / 2)
        st["voice"] = {
            "records": present,
            "neutralPct": round(voice["neu"] / present * 100, 1) if present else None,
            "bullPct": round(voice["bull"] / present * 100, 1) if present else None,
            "bearPct": round(voice["bear"] / present * 100, 1) if present else None,
            # 발언권(가중치)은 '곱하는 계수'일 뿐이다. 실제로 종합점수를 움직이는 힘은
            # 계수 × (그 분석가 점수가 50에서 떨어진 정도)다. 그래서 둘을 같이 낸다.
            # 화면에 나란히 뜨는 두 숫자가 서로 안 맞으면 안 되므로(3.15 × 0.3347을
            # 손으로 곱해 보는 사람이 있다) 반올림한 값으로 곱한다.
            "meanAbsDeviation": round(mean_dev, 2) if mean_dev is not None else None,
            "medianAbsDeviation": round(med_dev, 2) if med_dev is not None else None,
            "meanPushPoints": (round(round(mean_dev, 2) * gw[a], 2)
                               if mean_dev is not None else None),
            "medianPushPoints": (round(round(med_dev, 2) * gw[a], 2)
                                 if med_dev is not None else None),
        }

    # ── 판단일 단위 축소의 나란한 계산(priorDays20/120)과 옛 건수 단위(rowBasedLegacy) ──
    #    2026-09-05부터 priorDays20이 실제 global.weights와 같은 식이다(위 weights_from).
    #    120일 사전표본 변형과 옛 방식은 비교용 기록이다.
    def _weights_from_adjusted(adj):
        raw = {a: RULES[a]["prior"] * math.exp(SKILL_SENSITIVITY * (adj[a] - 0.5))
               for a in ANALYSTS}
        tot = sum(raw.values()) or 1
        return {a: round(raw[a] / tot, 4) for a in ANALYSTS}

    def _day_based(prior_days):
        """하루를 한 번의 독립 시행으로 보고, prior_days일치 사전표본으로 축소한다."""
        adj = {}
        for a in ANALYSTS:
            _n = g[a]["hit"] + g[a]["miss"]
            # weights_from과 같은 보호: 채점 0건이면 판단일도 0으로 본다(방향 의견만 있고 전부 ±deadband 안일 때).
            n_eff = a_decision_days[a] if _n else 0
            acc = (g[a]["hit"] / _n * 100.0) if _n else None
            h_eff = (acc / 100.0 * n_eff) if (acc is not None and n_eff) else 0.0
            adj[a] = (h_eff + prior_days * 0.5) / (n_eff + prior_days)
        return {"adjustedAcc": {a: round(adj[a] * 100, 1) for a in ANALYSTS},
                "weights": _weights_from_adjusted(adj)}

    _d20 = _day_based(MIN_DAYS_FOR_WEIGHT_LEARNING)
    _d120 = _day_based(BAYES_PRIOR_N)
    _gate_adj = {a: (0.5 if a_decision_days[a] < MIN_DAYS_FOR_WEIGHT_LEARNING
                     else gstat[a]["adjustedAccUsedInWeights"] / 100.0) for a in ANALYSTS}
    # ⭐ 2026-09-05: BUY가 실제로 어떻게 끝났는지 + 급등 후 매수 경고의 실측 근거.
    #    화면이 이 값을 읽어 스스로 밝힌다(문구에 숫자를 박아 넣지 않는다).
    buy_outcome = buy_outcome_stats(hist, closes, load_names(), learn_versions,
                                    record_base_version)

    _row_adj = {a: (g[a]["hit"] + BAYES_PRIOR_N * 0.5) / (g[a]["hit"] + g[a]["miss"] + BAYES_PRIOR_N)
                for a in ANALYSTS}
    day_based_shadow = {
        "applied": WEIGHT_SHRINKAGE_UNIT == "decision_day",
        "appliedNote": ("2026-09-05부터 실제 global.weights가 판단일 단위 축소(priorDays20와 같은 식)로 "
                        "계산된다. 옛 건수 단위 값은 rowBasedLegacy에 비교용으로만 남긴다. "
                        "소유자가 2026-09-05 결정을 위임했고, DIANA 채점 시작(2026-09-14) 전에 정했다."),
        "reason": ("건수 단위 축소는 채점 '건수'를 독립 시행으로 센다. 같은 날 600종목이 "
                   "한꺼번에 들어오므로 부풀려진 표본이고, 그래서 축소가 실제로 깎는 "
                   "폭이 1%p도 안 된다. Constitution statisticalPolicy는 독립 단위를 "
                   "decision_date로 정해 두고 있다."),
        "nEffective": dict(a_decision_days),
        "minDaysForConclusion": MIN_DAYS_FOR_WEIGHT_LEARNING,
        "priorDays20": _d20,
        "priorDays120": _d120,
        "rowBasedLegacy": {
            "adjustedAcc": {a: (round(_row_adj[a] * 100, 1) if (g[a]["hit"] + g[a]["miss"]) else None)
                            for a in ANALYSTS},
            "weights": _weights_from_adjusted(_row_adj),
            "note": "2026-09-05 이전 실제 산식(채점 건수 단위, 가상표본 120건). 비교용 기록이다.",
        },
        "maturityGate": {
            "enabled": WEIGHT_MATURITY_GATE,
            "weights": _weights_from_adjusted(_gate_adj),
            "note": ("판단일이 기준 미만인 분석가를 통째로 역할 사전비중으로 되돌리는 거친 장치. "
                     "절벽을 20일째로 옮기기만 하므로 켜지 않는다. 판단일 단위 축소가 "
                     "2026-09-14 DIANA 채점 시작의 하루치 급변을 대신 막는다."),
        },
    }

    sectors_out = {}
    for sname, tbl in sec.items():
        n_sec = sum(tbl[a]["hit"] + tbl[a]["miss"] for a in ANALYSTS)
        if n_sec >= MIN_N_SECTOR:
            local_w, sstat = weights_from(
                tbl, {a: len(sec_days.get(sname, {}).get(a, ())) for a in ANALYSTS})
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
        "method": "role-prior-bayesian-shrinkage-v4-decision-day-market-relative",
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
            # ⭐ 버전 문자열은 가중치의 '계산 기준'이 바뀔 때 함께 올린다. Evolution 매니페스트가
            #    teamWeightVersion으로 옛 기준과 새 기준 기록을 섞지 않게 하기 위해서다.
            #    2026-09-05: 축소 단위 채점 건수 → 판단일(§14). 'market-relative' 부분 문자열은 계약 테스트가 본다.
            "version": ("tw-2026-09-05-day-shrinkage-market-relative" if MARKET_RELATIVE
                        else "tw-2026-09-05-day-shrinkage-absolute"),
            "weights": gw,
            "acc": gstat,
            "graded": graded_total,
            # ⭐ 2026-09-04에 그림자(applied: false)로 먼저 공개했고, 2026-09-05부터 실제 적용(applied: true).
            #    priorDays20이 위 weights와 같은 식이다. rowBasedLegacy가 옛 건수 단위 값이다.
            #    블록 이름은 옛 소비자(문서·테스트) 호환을 위해 그대로 둔다.
            "dayBasedShadow": day_based_shadow,
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
                # BUY 판단이 실제로 어떻게 끝났는지 + 급등 후 매수 경고의 근거.
                "buyOutcome": buy_outcome,
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
        "// 2026-09-04부터 분석가마다 판단일 수·신뢰구간·'한 방향만 말하기' 기준선을\n"
        "// 함께 싣는다. 적중률 하나만으로는 실력인지 그 구간의 방향인지 구분할 수 없다.\n"
        "// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.\n"
    )
    with open(os.path.join(HERE, "team_weights.js"), "w", encoding="utf-8") as f:
        f.write(header + "const TEAM_WEIGHTS = " + body + ";\n")

    def _fmt_adj(a):
        v = gstat[a]["adjustedAcc"]
        return f"{v}%" if v is not None else "채점전"
    wtxt = " · ".join(f"{a} {gw[a]*100:.0f}%(보정 {_fmt_adj(a)}·n{gstat[a]['n']})" for a in ANALYSTS)
    basis = "시장대비(초과수익)" if MARKET_RELATIVE else "절대수익률"
    absxt = " · ".join(f"{a} 절대 {gstat[a]['absoluteAcc']}%" for a in ANALYSTS)
    print(f"team_weights.js 저장 - 채점 기준 {basis} · {graded_total}건 · 전역 가중치: {wtxt}"
          f" · 업종 오버라이드 {len(sectors_out)}개")
    print(f"  참고(가중치 미반영) {absxt} · 기준선 부재로 절대 채점한 건수 {market_missing}")
    for a in ANALYSTS:
        st = gstat[a]
        print(f"  {a}: 판단일 {st['uniqueDecisionDays']}일 · 적중 "
              f"{st['acc'] if st['acc'] is not None else '—'}% "
              f"(구간 {st['acc95'] or '—'}) · 한방향 기준선 "
              f"{st['bestFixedDirectionAcc'] if st['bestFixedDirectionAcc'] is not None else '—'}% "
              f"· 실력폭 {st['liftVsFixedPp'] if st['liftVsFixedPp'] is not None else '—'}%p "
              f"(구간 {st['lift95'] or '—'}) → {st['skillStatus']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
