#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 📡 GAEO 레이더 생성기 (GitHub Actions용 · 규칙 기반 · 토큰 0)

collect_analyst_data.py가 저장한 analysis_data.json(500종목 일봉)과
update_prices.py가 저장한 data.js(시세 기준 시각)를 읽어,
**직전 거래일 대비 새롭게 경계를 통과한 종목**만 골라 레이더 파일을 만든다.

생성물
  · radar.json        — 전체 기록(진단용). 스크립트·점검이 읽는다.
  · radar.js          — 브라우저용 요약(집계 + 이벤트 목록). 홈 화면이 바로 읽는다.
  · radar_series.js   — 신호가 난 종목만의 최근 60거래일 차트 데이터(지연 로딩).

실행: python3 compute_radar.py
※ 실제 신호 판정 로직은 radar_signals.py에 있다(테스트가 같은 모듈을 검증한다).
※ GAEO 레이더는 투자 판단(BUY/HOLD/SELL)을 만들지 않는다 — 변화 탐지 전용.
"""
import json, re, os, datetime
from zoneinfo import ZoneInfo

import radar_signals as R

HERE = os.path.dirname(os.path.abspath(__file__))

CHART_DAYS = 60          # 상세 화면 차트에 보여줄 최근 거래일 수
KST = ZoneInfo("Asia/Seoul")


def load_js_object(path, varname):
    txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1))


def price_status(price_label):
    """시세 라벨로 '장중 잠정' / '종가 확정'을 판별한다.
    update_prices.py 라벨 규격: '… 종가 (…)' · '… 장전 (전일 종가 · …)' · '… HH:MM 장중'
    장중 데이터가 섞여 오해를 만들지 않도록, 장중이면 provisional로 정직하게 표시한다."""
    label = str(price_label or "")
    return "provisional" if "장중" in label else "confirmed"


def build_series(daily):
    """상세 화면용 최근 60거래일 압축 데이터.
    앞부분(볼린저 20일·RSI 14일이 아직 안 잡히는 구간)은 null로 두고 브라우저가 건너뛴다."""
    rows = [r for r in daily if R._finite(r.get("close")) and float(r["close"]) > 0]
    closes = [float(r["close"]) for r in rows]
    vols = [float(r.get("volume") or 0) for r in rows]
    dates = [str(r.get("date") or "") for r in rows]
    bb = R.bollinger(closes)
    rsi = R.rsi_series(closes)
    macd, sig = R.macd_series(closes)
    _ratio, vavg = R.volume_ratio_series(vols)
    m60 = R.sma_series(closes, R.MA_LONG)

    s = max(0, len(closes) - CHART_DAYS)
    cut = slice(s, len(closes))

    def ints(seq):
        return [None if not R._finite(v) else int(round(float(v))) for v in seq[cut]]

    def dec(seq, nd=1):
        return [None if not R._finite(v) else round(float(v), nd) for v in seq[cut]]

    # ⚠️ 파일 크기를 줄이려고 "계산으로 되살릴 수 있는 값"(%B·밴드폭·거래량배율)은 담지 않는다.
    #    브라우저가 상단·하단·종가·평균거래량으로 그 자리에서 나눠 쓰면 된다.
    return {
        "d": [x[5:] for x in dates[cut]],       # 'MM-DD' (연도는 y에 한 번만)
        "y": (dates[cut][0][:4] if dates[cut] else ""),
        "c": ints(closes),
        "v": ints(vols),
        # bm(밴드 중심선)이 곧 MA20이라 따로 담지 않는다(20일 단순이동평균으로 동일).
        "bu": ints(bb["upper"]), "bm": ints(bb["mid"]), "bl": ints(bb["lower"]),
        "r": dec(rsi, 1),
        "va": ints(vavg),
        "m60": ints(m60),
        "macd": ints(macd), "sig": ints(sig),
    }


def main():
    raw = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    try:
        live = load_js_object(os.path.join(HERE, "data.js"), "LIVE_DATA")
    except Exception:
        live = {}
    price_label = str(live.get("date") or "")
    status = price_status(price_label)
    # 한국 시장 데이터이므로 생성 시각도 항상 KST로 적는다. 러너는 TZ=Asia/Seoul이지만
    # 다른 환경(UTC 컨테이너 등)에서 돌려도 "시세 기준"과 앞뒤가 뒤바뀌지 않게 고정한다.
    now = datetime.datetime.now(KST)
    detected_at = now.strftime("%Y-%m-%d %H:%M")

    stocks_raw = raw.get("stocks") or {}
    events, series = [], {}
    insufficient, failed, latest_bar = [], [], ""

    for code, s in stocks_raw.items():
        # 종목 하나가 이상 데이터로 죽어도 나머지 499종목이 멈추지 않게 개별 보호
        try:
            name = (live.get("stocks", {}).get(code) or {}).get("name") or s.get("name") or code
            daily = s.get("daily") or []
            evs, note = R.detect_events(code, name, daily,
                                        detected_at=detected_at,
                                        price_base_at=price_label,
                                        status=status)
            if note == "insufficient":
                insufficient.append(code)
                continue
            if daily and daily[-1].get("date"):
                latest_bar = max(latest_bar, str(daily[-1]["date"]))
            if evs:
                events.extend(evs)
                series[code] = build_series(daily)
        except Exception as e:      # noqa: BLE001 — 어떤 예외든 그 종목만 건너뛴다
            failed.append(f"{code}({e})")

    events.sort(key=lambda e: R.sort_key(e))

    counts = {t: 0 for t in R.MAIN_ORDER + R.EXTRA_ORDER}
    for e in events:
        counts[e["type"]] = counts.get(e["type"], 0) + 1
    extra_total = sum(counts.get(t, 0) for t in R.EXTRA_ORDER)

    # 종목별 요약: 대표 신호 1건 + "외 N건"
    by_code = {}
    for e in events:
        by_code.setdefault(e["code"], []).append(e)
    stocks_summary = []
    for code, evs in by_code.items():
        rep = R.representative(evs)
        stocks_summary.append({
            "code": code, "name": rep["name"],
            "rep": rep["id"], "repType": rep["type"], "repLabel": rep["label"],
            "others": len(evs) - 1,
            "types": [x["type"] for x in sorted(evs, key=lambda x: R.sort_key(x))],
        })
    stocks_summary.sort(key=lambda x: R.sort_key(next(e for e in events if e["id"] == x["rep"])))

    meta = {
        "generatedAt": detected_at,
        "priceLabel": price_label,
        "priceDate": latest_bar,
        "status": status,
        "universe": len(stocks_raw),
        "scanned": len(stocks_raw) - len(insufficient) - len(failed),
        "insufficient": len(insufficient),
        "failed": len(failed),
        "total": len(events),
        "stockCount": len(by_code),
        "counts": counts,
        "extraTotal": extra_total,
        "mainOrder": R.MAIN_ORDER,
        "extraOrder": R.EXTRA_ORDER,
        # 신호 종류별 공통 정보(이름·아이콘·심각도·설명·주의)를 한 번만 싣는다.
        # 이벤트마다 같은 문장을 반복하면 홈 화면이 먼저 받는 파일이 몇 배로 커진다.
        "defs": {t: {"label": d["label"], "group": d["group"], "icon": d["icon"],
                     "metric": d["metric"], "severity": d["severity"],
                     "description": d["description"].format(
                         threshold=("%g" % (R.RSI_OVERSOLD if "oversold" in t else R.RSI_OVERBOUGHT)),
                         vol_days=R.VOL_AVG_DAYS, mult=("%g" % R.VOL_SPIKE_MULT)),
                     "caution": d["caution"]}
                 for t, d in R.SIGNAL_DEFS.items()},
        "labels": {t: d["label"] for t, d in R.SIGNAL_DEFS.items()},
        "thresholds": {
            "rsiOversold": R.RSI_OVERSOLD, "rsiOverbought": R.RSI_OVERBOUGHT,
            "bbPeriod": R.BB_PERIOD, "bbStdDev": R.BB_STDDEV,
            "volAvgDays": R.VOL_AVG_DAYS, "volSpikeMult": R.VOL_SPIKE_MULT,
            "chartDays": CHART_DAYS,
        },
        "disclaimer": "레이더 신호는 가격·거래량 지표의 변화를 자동으로 탐지한 참고 정보이며, "
                      "특정 종목의 매수·매도를 권유하지 않습니다.",
    }

    # ⚠️ 30분마다 도는 러너가 "생성 시각만 바뀐" 커밋을 계속 쌓지 않도록,
    #    직전 결과와 내용이 완전히 같으면 generatedAt까지 그대로 유지한다
    #    (그러면 파일이 1바이트도 안 바뀌어 git이 변경으로 잡지 않는다).
    #    장중에는 시세 라벨(priceLabel)이 매번 바뀌므로 실제 갱신은 그대로 반영된다.
    full = {**meta, "events": events, "stocks": stocks_summary,
            "insufficientCodes": insufficient[:50], "failedCodes": failed[:20]}

    def without_times(doc):
        """생성 시각(generatedAt·detectedAt)만 빼고 비교용으로 정규화."""
        d = {k: v for k, v in doc.items() if k != "generatedAt"}
        d["events"] = [{k: v for k, v in e.items() if k != "detectedAt"} for e in doc.get("events", [])]
        return d

    prev_path = os.path.join(HERE, "radar.json")
    if os.path.exists(prev_path):
        try:
            prev = json.load(open(prev_path, encoding="utf-8"))
            if prev.get("generatedAt") and without_times(prev) == without_times(full):
                detected_at = prev["generatedAt"]
                meta["generatedAt"] = detected_at
                full["generatedAt"] = detected_at
                for e in events:
                    e["detectedAt"] = detected_at
                print("  (직전 결과와 동일 — 생성 시각을 유지해 불필요한 커밋을 만들지 않음)")
        except Exception:
            pass

    # radar.json — 사람이 읽는 전체 기록(이벤트마다 모든 필드를 그대로 펼친다)
    with open(os.path.join(HERE, "radar.json"), "w", encoding="utf-8") as f:
        json.dump(full, f, ensure_ascii=False, indent=1)

    # radar.js — 홈 화면이 첫 로드에 바로 읽는 축약본.
    #   신호 종류별로 똑같은 label·설명·주의 문구는 defs에 한 번만 싣고,
    #   전 이벤트가 공유하는 detectedAt·priceBaseAt도 meta에만 둔다(용량 1/6).
    slim_keys = ("id", "code", "name", "type", "previousValue", "currentValue",
                 "threshold", "unit", "date", "status")
    browser = dict(meta)
    browser["events"] = [{k: e[k] for k in slim_keys} for e in events]
    browser["stocks"] = stocks_summary
    with open(os.path.join(HERE, "radar.js"), "w", encoding="utf-8") as f:
        f.write("// 자동 생성: compute_radar.py · 📡 GAEO 레이더 (직전 거래일 대비 새로 발생한 기술적 변화)\n")
        f.write("// 투자 판단(BUY/HOLD/SELL)이 아니라 '변화 탐지' 결과만 담는다.\n")
        f.write("// 이벤트의 label·설명·주의 문구는 defs[type]에, 기준 시각은 meta에 있다(전체 기록은 radar.json).\n")
        f.write(f"const GAEO_RADAR = {json.dumps(browser, ensure_ascii=False)};\n")

    with open(os.path.join(HERE, "radar_series.js"), "w", encoding="utf-8") as f:
        f.write("// 자동 생성: compute_radar.py · 레이더 상세 차트용 최근 %d거래일 데이터(신호 종목만)\n" % CHART_DAYS)
        f.write(f"const GAEO_RADAR_SERIES = {json.dumps(series, ensure_ascii=False)};\n")

    print(f"radar 생성 완료 ({detected_at}, 시세기준 {price_label or '-'} / {status})")
    print(f"  검사 {meta['scanned']}종목 (전체 {meta['universe']} · 데이터부족 {meta['insufficient']} · 실패 {meta['failed']})")
    print(f"  신호 {meta['total']}건 / {meta['stockCount']}종목 · 차트데이터 {len(series)}종목")
    for t in R.MAIN_ORDER + R.EXTRA_ORDER:
        if counts.get(t):
            print(f"    - {R.SIGNAL_DEFS[t]['label']}: {counts[t]}")
    if failed:
        print(f"  [경고] 계산 실패 {len(failed)}종목: {failed[:5]}")


if __name__ == "__main__":
    main()
