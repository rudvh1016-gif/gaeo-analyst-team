#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 자가 학습 가중치 (Claude 토큰 0)

history.js에 쌓인 판단 기록(종목별·분석가별 stance)을 "판단 후 5거래일 뒤 종가"로
채점해, 어떤 분석가(TARO/DIANA/QUANT/FLOW)가 실제로 잘 맞았는지 적중률을 집계하고
그 성적에 비례한 CHIEF 합산 가중치를 계산한다 → team_weights.js

- 채점 잣대는 index.html 리더보드(scoreStance)와 동일:
    bull → 5거래일 뒤 +1% 초과면 적중, -1% 미만이면 빗나감 (±1% 이내 보류)
    bear → 반대 방향. neu(중립)는 집계 제외.
- 가중치: 적중률을 [30,75]로 클립한 값에 비례 배분(표본 30건 미만인 분석가는
  중립값 50으로 처리 — 성적이 검증되기 전엔 벌점도 가점도 주지 않는다).
- 업종별 오버라이드: 그 업종에서 채점 표본이 200건 이상 쌓이면 업종 전용 가중치를
  함께 저장한다(반도체에서 잘 맞는 분석가와 바이오에서 잘 맞는 분석가는 다를 수 있다).
- analyze_auto.py(CHIEF 합산)와 index.html(리더보드 가중치 표시)이 이 파일을 읽는다.

실행: python3 compute_team_weights.py  →  team_weights.js
(워크플로우에서 analyze_auto.py보다 먼저 실행)
"""
import json, re, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ANALYSTS = ["taro", "diana", "nova", "flow"]   # nova = QUANT (내부 id는 호환성 위해 유지)
MIN_N_ANALYST = 30      # 분석가별 최소 표본 — 미달이면 중립(50) 취급
MIN_N_SECTOR = 200      # 업종 오버라이드 최소 표본
EVAL_DAYS = 5           # 판단 후 5거래일 뒤 종가로 채점 (index.html과 동일)


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


def score_stance(stance, ret):
    """index.html scoreStance와 동일한 채점 규칙."""
    if stance == "bull":
        return "hit" if ret > 1 else ("miss" if ret < -1 else "mid")
    if stance == "bear":
        return "hit" if ret < -1 else ("miss" if ret > 1 else "mid")
    return None


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

    def eval_ret(code, day, base):
        """판단일(day) 이후 EVAL_DAYS번째 거래일 종가 대비 수익률 — index.html evalRet와 동일 규칙."""
        rows = closes.get(code)
        if not rows or not base:
            return None
        after = [r for r in rows if r["date"] > day]
        if len(after) < EVAL_DAYS:
            return None
        return (after[EVAL_DAYS - 1]["close"] - base) / base * 100.0

    # 집계: 전체 + 업종별
    def zero():
        return {a: {"hit": 0, "miss": 0} for a in ANALYSTS}
    g = zero()
    sec = {}
    for code, lst in hist.items():
        if not re.match(r"^\d{6}$", str(code)) or not isinstance(lst, list):
            continue
        sname = sectors.get(code, "기타")
        for e in lst:
            base = e.get("base")
            day = str(e.get("date", ""))[:10]
            if not base or not day:
                continue
            ret = eval_ret(code, day, base)
            if ret is None:
                continue
            for a in ANALYSTS:
                ana = e.get(a)
                if not isinstance(ana, dict):
                    continue
                s = score_stance(ana.get("stance"), ret)
                if s == "hit":
                    g[a]["hit"] += 1
                    sec.setdefault(sname, zero())[a]["hit"] += 1
                elif s == "miss":
                    g[a]["miss"] += 1
                    sec.setdefault(sname, zero())[a]["miss"] += 1

    def weights_from(acc_tbl):
        """적중률 → 가중치. 표본 미달 분석가는 중립 50 취급, [30,75] 클립 후 비례 배분."""
        raw = {}
        stat = {}
        for a in ANALYSTS:
            n = acc_tbl[a]["hit"] + acc_tbl[a]["miss"]
            acc = (acc_tbl[a]["hit"] / n * 100) if n else None
            stat[a] = {"n": n, "acc": round(acc, 1) if acc is not None else None}
            raw[a] = 50.0 if (n < MIN_N_ANALYST or acc is None) else max(30.0, min(75.0, acc))
        tot = sum(raw.values())
        return {a: round(raw[a] / tot, 4) for a in ANALYSTS}, stat

    gw, gstat = weights_from(g)
    graded_total = sum(v["n"] for v in gstat.values())

    sectors_out = {}
    for sname, tbl in sec.items():
        n_sec = sum(tbl[a]["hit"] + tbl[a]["miss"] for a in ANALYSTS)
        if n_sec >= MIN_N_SECTOR:
            sw, sstat = weights_from(tbl)
            sectors_out[sname] = {"weights": sw, "acc": sstat, "graded": n_sec}

    payload = {
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "evalDays": EVAL_DAYS,
        "global": {"weights": gw, "acc": gstat, "graded": graded_total},
        "sectors": sectors_out,
    }
    body = json.dumps(payload, ensure_ascii=False, indent=1)
    header = (
        "// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치\n"
        "// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,\n"
        "// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와\n"
        "// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.\n"
    )
    with open(os.path.join(HERE, "team_weights.js"), "w", encoding="utf-8") as f:
        f.write(header + "const TEAM_WEIGHTS = " + body + ";\n")

    wtxt = " · ".join(f"{a} {gw[a]*100:.0f}%(적중률 {gstat[a]['acc']}%·n{gstat[a]['n']})" for a in ANALYSTS)
    print(f"team_weights.js 저장 — 채점 {graded_total}건 · 전역 가중치: {wtxt} · 업종 오버라이드 {len(sectors_out)}개")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
