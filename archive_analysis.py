#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 판단 히스토리 아카이브
현재 analysis.js(LIVE_ANALYSIS)의 CHIEF 판단을 종목별로 history.js(LIVE_HISTORY)에
누적 기록한다. 같은 "updated" 시각(분 단위까지)의 기록이 이미 있으면 그것만 덮어쓰고,
시각이 다르면(하루에 여러 번 재분석해도) 각각 별도 기록으로 쌓는다.
→ 화면(index.html)이 이 기록으로 '콜/신뢰도 추이 그래프'와 '적중 채점'을 그린다.
실행: python3 archive_analysis.py   (재분석 직후 1회. daily_update.command가 자동 호출)

★ 2026-07-08 버그 수정: 예전엔 "같은 날짜(day)"로만 구분해 하루에 두 번 재분석하면
  오전 기록이 통째로 사라졌다(장중 변동이 큰 날 특히 치명적). 이제 "updated"의
  분 단위 시각까지 비교해 같은 시각 재실행만 덮어쓰고, 다른 시각은 모두 보존한다.
"""
import re, json, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))

def load_js_object(path, varname):
    """`const VAR = {...};` 형태의 JS 파일에서 객체만 파싱해 dict로 반환."""
    if not os.path.exists(path):
        return None
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)          # 줄 주석 제거
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    if not m:
        return None
    return json.loads(m.group(1))

def main():
    an = load_js_object(os.path.join(HERE, "analysis.js"), "LIVE_ANALYSIS")
    if not an:
        print("analysis.js를 읽지 못했습니다 — 아카이브 중단."); return
    hist = load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {}

    global_date = an.get("date", datetime.date.today().isoformat())
    added, updated = 0, 0
    for code, a in an.items():
        if code == "date" or not isinstance(a, dict):
            continue
        chief = a.get("chief", {})
        if not chief:
            continue
        when = a.get("updated") or global_date
        entry = {
            "date": when,                       # 판단 시각 (YYYY-MM-DD [HH:MM])
            "call": chief.get("call"),
            "total": chief.get("total"),
            "confidence": chief.get("confidence"),
            "base": a.get("base"),              # 판단 당시 주가
            "baseAt": a.get("baseAt"),          # 그 주가의 시점
            "target": chief.get("target", ""),
        }
        # 분석가별 stance·score도 기록 → 화면의 '애널리스트 정확도 리더보드'에 사용
        for k in ("taro", "diana", "nova", "flow"):
            ana = a.get(k)
            if isinstance(ana, dict) and ana.get("stance"):
                entry[k] = {"stance": ana.get("stance"), "score": ana.get("score")}
        lst = hist.setdefault(code, [])
        when_key = str(when)   # 분 단위 시각까지 포함된 "updated" 원문으로 구분
        # 정확히 같은 시각의 기록만 덮어쓰기(같은 실행 재실행 등). 시각이 다르면 별도 기록으로 추가.
        idx = next((i for i, e in enumerate(lst) if str(e.get("date", "")) == when_key), None)
        if idx is not None:
            lst[idx] = entry; updated += 1
        else:
            lst.append(entry); added += 1
        lst.sort(key=lambda e: str(e.get("date", "")))   # 시간순 정렬

    out = ("// 자동 생성: archive_analysis.py · 판단 히스토리(종목별 시간순 누적)\n"
           "// 재분석 직후 실행되어 그날 CHIEF 판단을 여기에 쌓는다. index.html이 추이·채점에 사용.\n"
           "const LIVE_HISTORY = "
           + json.dumps(hist, ensure_ascii=False, indent=1) + ";\n")
    with open(os.path.join(HERE, "history.js"), "w", encoding="utf-8") as f:
        f.write(out)
    print(f"history.js 갱신 완료 — 신규 {added}건 · 갱신 {updated}건 (종목 {len(hist)})")

    # ── 시장(코스피/코스닥) 분석도 날짜별로 누적 → market_history.js ──
    # 같은 날짜에 여러 번 분석하면 최신 것으로 갱신된다(하루 1칸, 날짜별 목차용).
    mk = an.get("market")
    if isinstance(mk, dict) and (mk.get("text") or mk.get("points")):
        mh = load_js_object(os.path.join(HERE, "market_history.js"), "MARKET_HISTORY") or {}
        day = str(mk.get("updated", ""))[:10] or global_date
        mh[day] = {
            "updated": mk.get("updated", ""),
            "kospi": mk.get("kospi"), "kosdaq": mk.get("kosdaq"),
            "text": mk.get("text", ""), "points": mk.get("points", []),
        }
        mout = ("// 개오 애널리스트팀 — 날짜별 시장(코스피/코스닥) 분석 기록\n"
                "// archive_analysis.py가 재분석 때마다 그날의 market 블록을 여기에 누적한다(같은 날짜는 최신으로 갱신).\n"
                "// 화면의 \"📚 지난 시장 분석\" 목차가 이 파일을 읽는다.\n"
                "const MARKET_HISTORY = "
                + json.dumps(mh, ensure_ascii=False, indent=1) + ";\n")
        with open(os.path.join(HERE, "market_history.js"), "w", encoding="utf-8") as f:
            f.write(mout)
        print(f"market_history.js 갱신 완료 — {day} 기록 ({len(mh)}일 누적)")

if __name__ == "__main__":
    main()
