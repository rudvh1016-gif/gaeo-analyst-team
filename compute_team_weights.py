#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 기간 정합 자가 학습 가중치 (Claude 토큰 0)

각 분석가가 실제로 보는 시간축에 맞춰 채점하고, 작은 표본의 우연을 50% 쪽으로
축소한 뒤 CHIEF 합산 가중치를 계산한다 → team_weights.js

- TARO·QUANT·FLOW는 5거래일/±1%, DIANA는 20거래일/±3%로 채점한다.
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


def score_stance(stance, ret, deadband=1.0):
    """분석가별 시간축에 대응하는 방향 채점 규칙."""
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

    # 집계: 전체 + 업종별
    def zero():
        return {a: {"hit": 0, "miss": 0} for a in ANALYSTS}
    g = zero()
    sec = {}
    team_hit = 0
    team_miss = 0
    for code, lst in hist.items():
        if not re.match(r"^\d{6}$", str(code)) or not isinstance(lst, list):
            continue
        sname = sectors.get(code, "기타")
        for e in lst:
            base = e.get("base")
            day = str(e.get("date", ""))[:10]
            if not base or not day:
                continue
            team_ret = eval_ret(code, day, base, 5)
            team_score = score_call(e.get("call"), team_ret) if team_ret is not None else None
            if team_score == "hit":
                team_hit += 1
            elif team_score == "miss":
                team_miss += 1
            for a in ANALYSTS:
                ana = e.get(a)
                if not isinstance(ana, dict):
                    continue
                rule = RULES[a]
                ret = eval_ret(code, day, base, rule["days"])
                if ret is None:
                    continue
                s = score_stance(ana.get("stance"), ret, rule["deadband"])
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
        "method": "role-prior-bayesian-shrinkage-v2",
        "global": {
            "weights": gw,
            "acc": gstat,
            "graded": graded_total,
            "team": {
                "hit": team_hit,
                "miss": team_miss,
                "n": team_hit + team_miss,
                "acc": round(team_hit / (team_hit + team_miss) * 100, 1)
                if team_hit + team_miss else None,
            },
        },
        "sectors": sectors_out,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    header = (
        "// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치\n"
        "// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,\n"
        "// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.\n"
        "// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.\n"
    )
    with open(os.path.join(HERE, "team_weights.js"), "w", encoding="utf-8") as f:
        f.write(header + "const TEAM_WEIGHTS = " + body + ";\n")

    wtxt = " · ".join(f"{a} {gw[a]*100:.0f}%(보정 {gstat[a]['adjustedAcc']}%·n{gstat[a]['n']})" for a in ANALYSTS)
    print(f"team_weights.js 저장 - 채점 {graded_total}건 · 전역 가중치: {wtxt} · 업종 오버라이드 {len(sectors_out)}개")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
