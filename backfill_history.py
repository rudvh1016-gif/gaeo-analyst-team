#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 과거 판단 히스토리 소급 재구성(백테스트) · 1회성 시드 스크립트

목적: history.js(팀 판단 히스토리)가 오늘자만 있어 채점거리가 없다. 이 스크립트는
최근 거래일들에 대해 "그날 자동분석 엔진이 내렸을 판단(BUY/HOLD/SELL)"을 과거 일봉으로
재구성해 history.js에 채워, 5거래일 뒤 종가로 즉시 적중/빗나감이 채점되게 한다.

정직성 원칙(중요):
- ⛔ look-ahead 금지: 각 과거일 D의 기술지표는 그날까지의 일봉(daily[:D])만으로 계산한다.
- 🔧 한계 명시: 과거 '재무(PER/PBR)·수급·컨센서스'는 저장돼 있지 않아 재현 불가 →
  이 값들은 현재 스냅샷(indicators.json)으로 근사한다. 그래서 TARO(기술)·NOVA(가격심리)는
  그날 값으로 정확히 재현되지만, DIANA·FLOW는 근사값이다. 이 사실을 숨기지 않기 위해
  모든 재구성 항목에 recon:true 표식을 단다(index.html이 히스토리 표에 '재구성' 칩으로 노출).
- 기존 기록(정밀분석·오늘자 자동)은 절대 덮지 않고, 비어 있는 과거 날짜만 채운다.

입력: analysis_data.json(일봉 3개월) · indicators.json(현재 재무/수급) · analysis.js(정밀 목록)
출력: history.js 갱신
실행: python3 backfill_history.py [시작일 YYYY-MM-DD]   (기본: 2026-07-01)
"""
import json, re, os, sys, importlib.util, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
HIST_CAP = 80


def _load_mod(name):
    spec = importlib.util.spec_from_file_location(name, os.path.join(HERE, name + ".py"))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m

CI = _load_mod("compute_indicators")   # indicators_for()
AU = _load_mod("analyze_auto")         # taro_eval/diana_eval/nova_eval/flow_eval/chief_eval
ARC = _load_mod("archive_analysis")    # _entry_from(), load_js_object()


def main():
    start = sys.argv[1] if len(sys.argv) > 1 else "2026-07-01"
    ad = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    ind = json.load(open(os.path.join(HERE, "indicators.json"), encoding="utf-8"))
    ind_st = ind.get("stocks", {})
    hist = ARC.load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {}

    filled, skipped = 0, 0
    for code, s in ad.get("stocks", {}).items():
        daily = s.get("daily") or []
        if len(daily) < 30:
            continue
        cur = ind_st.get(code) or {}          # 현재 재무/수급 스냅샷(과거 근사용)
        # 종목별 기존 기록의 날짜 집합(중복 방지)
        have_days = {str(e.get("date", ""))[:10] for e in hist.get(code, [])}
        for i in range(1, len(daily)):
            d = daily[i]
            day = d.get("date")
            if not day or day < start:
                continue
            if day in have_days:
                continue
            sub = daily[: i + 1]
            if len(sub) < 27:                 # MA/MACD/RSI 워밍업 최소치
                continue
            try:
                tech = CI.indicators_for(sub)
            except Exception:
                skipped += 1; continue
            prev_c = daily[i - 1].get("close")
            rate = round((d["close"] / prev_c - 1) * 100, 2) if prev_c else None
            # 엔진 입력 e: 기술/등락은 그날 값, 재무·수급은 현재 스냅샷 근사
            e = {
                "price": d["close"], "rate": rate, "tech": tech,
                "per": cur.get("per"), "pbr": cur.get("pbr"), "roe": cur.get("roe"),
                "eps": cur.get("eps"), "fwdPer": cur.get("fwdPer"),
                "targetGap": cur.get("targetGap"), "targetMean": cur.get("targetMean"),
                "cnsEps": cur.get("cnsEps"), "w52": cur.get("w52"),
                "flow": cur.get("flow"),
            }
            taro = AU.taro_eval(tech)
            diana = AU.diana_eval(e)
            nova = AU.nova_eval(e, tech)
            flow = AU.flow_eval(e.get("flow"))
            chief = AU.chief_eval(e, taro, diana, nova, flow)
            blk = {"chief": chief, "base": d["close"], "baseAt": day,
                   "taro": taro, "diana": diana, "nova": nova, "flow": flow}
            entry = ARC._entry_from(blk, day)
            entry["tier"] = "auto"
            entry["recon"] = True             # 정직성: 소급 재구성 표식
            hist.setdefault(code, []).append(entry)
            have_days.add(day)
            filled += 1

    for code in hist:
        hist[code].sort(key=lambda e: str(e.get("date", "")))
        if len(hist[code]) > HIST_CAP:
            hist[code] = hist[code][-HIST_CAP:]

    out = ("// 자동 생성: archive_analysis.py · 판단 히스토리(종목별 시간순 누적)\n"
           "// 재분석 직후 실행되어 그날 CHIEF 판단을 여기에 쌓는다. index.html이 추이·채점에 사용.\n"
           "const LIVE_HISTORY = " + json.dumps(hist, ensure_ascii=False, indent=1) + ";\n")
    open(os.path.join(HERE, "history.js"), "w", encoding="utf-8").write(out)
    print(f"백필 완료 — 재구성 {filled}건 채움 · 스킵 {skipped} · 시작일 {start} · 종목 {len(hist)}")


if __name__ == "__main__":
    main()
