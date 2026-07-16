#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 지표 사전계산 (GitHub Actions용)
collect_analyst_data.py가 저장한 analysis_data.json(일봉·재무·수급 원천)과
update_prices.py가 저장한 data.js(현재가·PER 등)를 읽어, 분석에 바로 쓰는
요약 지표를 indicators.json 한 파일로 압축 저장한다.

목적: Claude 세션이 원천 데이터(수천 줄)를 읽고 계산하는 대신 이 요약표만
읽으면 되므로 토큰이 크게 절약된다. 계산 규격은 종목분석 스킬과 동일:
  MA20/MA60=종가 단순평균 · RSI(14)=Wilder 평활 · MACD=EMA12−EMA26(시그널 EMA9)
  거래량배율=당일/20일평균 · 수급=dealTrends 최근 6거래일 누적
실행: python3 compute_indicators.py  →  indicators.json
"""
import json, re, os, datetime

HERE = os.path.dirname(os.path.abspath(__file__))


def load_js_object(path, varname):
    txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1))


def num(x):
    if x is None:
        return None
    try:
        return float(str(x).replace(",", "").replace("%", "").replace("+", "")
                     .replace("원", "").replace("배", ""))
    except ValueError:
        return None


def ema_series(vals, n):
    k = 2 / (n + 1)
    out = [vals[0]]
    for v in vals[1:]:
        out.append(v * k + out[-1] * (1 - k))
    return out


def indicators_for(daily):
    closes = [r["close"] for r in daily]
    vols = [r["volume"] for r in daily]
    cur = closes[-1]
    ma20 = sum(closes[-20:]) / min(20, len(closes))
    ma60 = sum(closes[-60:]) / min(60, len(closes))
    gains, losses = [], []
    for i in range(1, len(closes)):
        ch = closes[i] - closes[i - 1]
        gains.append(max(ch, 0)); losses.append(max(-ch, 0))
    ag = sum(gains[:14]) / 14; al = sum(losses[:14]) / 14
    for i in range(14, len(gains)):
        ag = (ag * 13 + gains[i]) / 14; al = (al * 13 + losses[i]) / 14
    rsi = 100 - 100 / (1 + ag / al) if al else 100.0
    e12, e26 = ema_series(closes, 12), ema_series(closes, 26)
    macd = [a - b for a, b in zip(e12, e26)]
    sig = ema_series(macd[25:], 9)[-1] if len(macd) > 25 else ema_series(macd, 9)[-1]
    vol_avg = sum(vols[-21:-1]) / 20 if len(vols) > 20 else 0
    vol_ratio = vols[-1] / vol_avg if vol_avg else None   # 거래정지/저유동 종목은 0 평균 → None
    return {
        "close": cur,
        "ma20": round(ma20), "ma20Gap": round((cur / ma20 - 1) * 100, 1),
        "ma60": round(ma60), "ma60Gap": round((cur / ma60 - 1) * 100, 1),
        "rsi14": round(rsi, 1),
        "macd": round(macd[-1]), "macdSignal": round(sig),
        "volRatio": round(vol_ratio, 2) if vol_ratio else None,
        "low3m": min(closes), "high3m": max(closes),
        "last5": [{"d": r["date"][5:], "c": r["close"]} for r in daily[-5:]],
    }


def risk_for(daily, live):
    """🛡️ RISK 카드용 위험 지표 — 일봉(3개월)과 52주 범위로 계산(토큰 0, 규칙 기반).
    vol20  : 최근 20거래일 일간 등락률 표준편차(%) — '하루에 평균 얼마나 출렁이는가'
    mdd3m  : 3개월 창 최대낙폭(%) — 고점 대비 가장 깊게 빠졌던 폭(음수)
    pos52w : 52주 가격 범위 내 현재가 위치(0=1년 최저, 100=1년 최고)
    grade  : low(안정)/mid(보통)/high(위험) — 변동성·낙폭 임계값 기반"""
    closes = [d.get("close") for d in (daily or []) if d.get("close")]
    if len(closes) < 6:
        return None
    rets = [(closes[i] / closes[i-1] - 1) * 100 for i in range(1, len(closes)) if closes[i-1]]
    tail = rets[-20:] if len(rets) >= 20 else rets
    mean = sum(tail) / len(tail)
    vol20 = round((sum((r - mean) ** 2 for r in tail) / len(tail)) ** 0.5, 2)
    peak, mdd = closes[0], 0.0
    for c in closes:
        if c > peak:
            peak = c
        dd = (c / peak - 1) * 100
        if dd < mdd:
            mdd = dd
    mdd = round(mdd, 1)
    pos52 = None
    try:
        lo, hi = [float(x.replace(",", "").strip()) for x in str((live or {}).get("w52") or "").split("~")]
        if hi > lo:
            pos52 = max(0, min(100, round((closes[-1] - lo) / (hi - lo) * 100)))
    except Exception:
        pass
    # grade는 전 종목 수집이 끝난 뒤 main()에서 "시장 전체 대비 상대 위치"로 매긴다.
    # (절대 임계값만 쓰면 이번 주처럼 시장 전체가 요동칠 때 전 종목이 '위험'으로 쏠려 변별력이 사라진다)
    return {"vol20": vol20, "mdd3m": mdd, "pos52w": pos52}


def assign_risk_grades(stocks):
    """전 종목 vol20 분포의 25/75 백분위로 상대 등급(low/mid/high)을 매긴다.
    절대 오버라이드: vol20 >= 6%는 시장이 아무리 험해도 high,
    vol20 < 0.1%는 거래정지·데이터 이상 가능성이 커서 low로 두지 않고 mid."""
    vols = sorted(e["risk"]["vol20"] for e in stocks.values() if e.get("risk"))
    if not vols:
        return
    p25 = vols[int(len(vols) * 0.25)]
    p75 = vols[int(len(vols) * 0.75)]
    for e in stocks.values():
        r = e.get("risk")
        if not r:
            continue
        v, mdd = r["vol20"], r["mdd3m"]
        if v >= 6 or (v >= p75 and mdd <= -30):
            g = "high"
        elif v >= p75:
            g = "high"
        elif v <= p25 and mdd >= -25 and v >= 0.1:
            g = "low"
        else:
            g = "mid"
        r["grade"] = g


def flow_summary(deal_trends, days=6):
    dt = deal_trends[:days]
    if not dt:
        return None
    frgn = sum(num(r.get("foreignerPureBuyQuant")) or 0 for r in dt)
    org = sum(num(r.get("organPureBuyQuant")) or 0 for r in dt)
    today = dt[0]
    return {
        "days": len(dt),
        "frgnSum": int(frgn), "orgSum": int(org),
        "holdNow": num(dt[0].get("foreignerHoldRatio")),
        "holdBefore": num(dt[-1].get("foreignerHoldRatio")),
        "todayFrgn": int(num(today.get("foreignerPureBuyQuant")) or 0),
        "todayOrg": int(num(today.get("organPureBuyQuant")) or 0),
        "todayIndi": int(num(today.get("individualPureBuyQuant")) or 0),
    }


def main():
    raw = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    live = load_js_object(os.path.join(HERE, "data.js"), "LIVE_DATA")
    out = {
        "generatedAt": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "priceLabel": live.get("date"),
        "indices": live.get("indices"),
        "stocks": {},
    }
    skipped = []
    for code, s in raw["stocks"].items():
        # 종목 하나가 이상 데이터로 에러를 던져도 전체(500종목)가 죽지 않게 개별 보호
        try:
            d = live["stocks"].get(code, {})
            entry = {"name": s.get("name", code), "price": d.get("price"), "rate": d.get("rate"),
                     "stale": d.get("stale", False),
                     "per": d.get("per"), "pbr": d.get("pbr"), "roe": d.get("roe"),
                     "eps": d.get("eps"), "div": d.get("div"), "w52": d.get("w52"),
                     "cap": d.get("cap")}
            info = (s.get("info") or {})
            ti = info.get("totalInfos") or {}
            entry["cnsEps"] = num(ti.get("cnsEps"))
            cons = info.get("consensus") or {}
            entry["targetMean"] = num(cons.get("priceTargetMean"))
            entry["recommMean"] = num(cons.get("recommMean"))
            if entry["targetMean"] and entry["price"]:
                entry["targetGap"] = round((entry["targetMean"] / entry["price"] - 1) * 100, 1)
            if entry["cnsEps"] and entry["price"]:
                entry["fwdPer"] = round(entry["price"] / entry["cnsEps"], 1)
            daily = s.get("daily") or []
            entry["tech"] = indicators_for(daily) if len(daily) >= 2 else None
            entry["flow"] = flow_summary(info.get("dealTrends") or [])
            entry["risk"] = risk_for(daily, d)   # 🛡️ RISK 카드용(브라우저가 직접 읽음)
            out["stocks"][code] = entry
        except Exception as e:
            skipped.append(f"{code}({e})")
            continue
    if skipped:
        print(f"[경고] 지표 계산 건너뜀 {len(skipped)}종목: {skipped[:10]}{' …' if len(skipped)>10 else ''}")
    assign_risk_grades(out["stocks"])   # 🛡️ 전 종목 분포 기준 상대 위험등급
    path = os.path.join(HERE, "indicators.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"indicators.json 저장 완료 ({out['generatedAt']}) — {len(out['stocks'])}종목")

    # 브라우저용 축약본(indicators.js) — TARO 미니 차트(가격·MA·RSI·MACD)가 index.html에서 직접 읽는다.
    # analysis.js 텍스트를 파싱하지 않고 이 구조화된 숫자를 그대로 그린다.
    js_stocks = {
        code: {"name": e["name"], "price": e["price"], "rate": e["rate"], "tech": e["tech"],
               "risk": e.get("risk")}
        for code, e in out["stocks"].items() if e.get("tech")
    }
    js_path = os.path.join(HERE, "indicators.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: compute_indicators.py · 브라우저용 기술지표 축약본 (TARO 미니 차트)\n")
        f.write(f"const INDICATORS = {json.dumps({'generatedAt': out['generatedAt'], 'stocks': js_stocks}, ensure_ascii=False)};\n")
    print(f"indicators.js 저장 완료 (브라우저용, {len(js_stocks)}종목)")


if __name__ == "__main__":
    main()
