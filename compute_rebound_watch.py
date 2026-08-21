#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""반등 후보 관찰 목록 (rebound_watch.js) 생성기.

왜 만드나
  2026-08-21 검증에서 나온 사실:
    · 5거래일에 +30% 오른 342건 중 GAEO가 BUY라고 한 건 2건(0.6%)뿐이었다.
      전체 BUY 비율 6.8%보다 낮다. 폭등을 못 잡는 정도가 아니라 피하고 있다.
    · 폭등 종목은 직전 20일 평균 -20.4% 떨어져 있었다(나머지는 -6.6%).
      BUY 1,054건 중 532건(50.5%)은 반대로 이미 +10% 넘게 오른 상태였다.
    · 직전 20일 하락률이 클수록 이후 5거래일 수익률이 높았다(완전한 단조 관계).
        -40% 아래 +9.10%(승률 59.8%) … +30% 위 -6.46%(승률 30.0%)

  그런데 같은 검증에서 위험도 확인됐다:
    · "많이 떨어진 걸 산다"는 시장 국면에 따라 정반대다.
        하락 구간(7/01~7/26) -5.09% (승률 29.3%)
        반등 구간(7/27~8/21) +15.66% (승률 84.2%)
    · 반등 시작 시점을 미리 아는 방법을 찾지 못했다. 20일 모멘텀 게이트는
      7/29에 시작된 반등을 8/06에야 알렸고, 그때 사면 -2.00%였다.

  그래서 지금 이 규칙으로 돈을 걸지 않는다. 표본이 39 판단일뿐이고 국면이
  두 번밖에 안 바뀌었다. 대신 매일 후보를 뽑아 기록하고 자동 채점만 해서,
  여러 국면을 겪은 성적이 쌓인 뒤에 쓸지 말지 정한다.

⚠️ 이 목록은 GAEO Score(BUY/HOLD/SELL)와 별개다. 서로의 값을 바꾸지 않는다.
⚠️ 매수 추천이 아니다. 관찰 기록이다.
⚠️ 지나간 날짜의 후보를 나중에 만들어 넣지 않는다(사후 편향 금지).
   과거 가격으로 오늘 후보를 뽑는 일도 없다 — 조건은 전부 '그날까지의 정보'다.
"""
import json
import os
import sys
from datetime import datetime, timezone, timedelta

KST = timezone(timedelta(hours=9))
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "rebound_watch.js")

# ── 후보 조건 (2026-08-21 검증 기준) ─────────────────────────────────────
# 이 숫자를 바꾸면 그 전에 쌓은 기록과 비교가 깨진다. 바꿀 거면 RULE_VERSION을 올린다.
RULE_VERSION = "REBOUND_WATCH_V1"
DROP_PCT = -20.0        # 직전 20일 하락률이 이보다 크게 떨어졌을 것
VOL_RATIO = 1.5         # 당일 거래량이 20일 평균의 몇 배 이상
LOOKBACK = 20           # 하락률·거래량 평균을 재는 기간(거래일)
HOLD_DAYS = 5           # 채점 기준 보유기간(모의투자 V1과 동일)
MAX_WATCH = 12          # 화면에 담는 상한. 낙폭이 큰 순으로 자른다.
MIN_PRICE = 1000        # 동전주는 호가 단위 때문에 5거래일 수익률이 왜곡된다
MIN_AVG_VOLUME = 10000  # 거래가 거의 없는 종목 제외(체결 자체가 어렵다)

# 🐛 2026-08-21: 첫 실행에서 유일하게 뽑힌 후보가 코미코였는데, 실제 폭락이 아니라
#    액면분할이었다(8/06 하루 만에 54,400 → 21,800 = -59.9%, 이후 3거래일 거래량 0).
#    한국 주식은 하루 등락 제한이 ±30%라 -31%보다 큰 하루 하락은 제도상 나올 수 없다.
#    그런 날이 있으면 가격이 실제로 빠진 게 아니라 권리락(액면분할·무상증자)이다.
#    거르지 않으면 "폭락 후 반등"으로 오인해 기록 전체가 거짓이 된다.
LIMIT_DOWN_PCT = -31.0  # 이보다 큰 하루 하락 = 권리락. 해당 종목은 관찰에서 뺀다.

# 채점에 쓰는 비용 — paper_engine.COST_MODEL_V1_2026H2와 같은 값을 쓴다.
# 다른 값을 쓰면 모의투자 성적과 나란히 놓고 볼 수 없다.
COMMISSION_PCT = 0.015
SELL_TAX_PCT = 0.20

# 성적을 공개하기 전에 필요한 최소 표본. 모의투자와 같은 기준을 쓴다.
MIN_SCORED_FOR_EVIDENCE = 20
MIN_DAYS_FOR_EVIDENCE = 20


def load_js_value(path, var):
    """자동 생성 JS 파일에서 최상위 객체 하나를 읽는다(따옴표 안 = 순수 JSON)."""
    with open(path, encoding="utf-8") as f:
        src = f.read()
    for marker in (f"const {var} =", f"window.{var} =", f"var {var} ="):
        i = src.find(marker)
        if i < 0:
            continue
        j = src.find("=", i) + 1
        body = src[j:].strip()
        if body.endswith(";"):
            body = body[:-1]
        return json.loads(body)
    raise ValueError(f"{path}에서 {var}를 찾지 못했습니다")


def net_return_pct(entry, exit_price):
    """수수료(양방향)와 매도 세금을 뺀 실제 손익률."""
    if not entry or exit_price is None:
        return None
    c = COMMISSION_PCT / 100.0
    t = SELL_TAX_PCT / 100.0
    paid = entry * (1 + c)
    received = exit_price * (1 - c - t)
    return round((received / paid - 1) * 100, 3)


def flatten_days(pages):
    days = []
    for page in pages or []:
        for d in (page.get("days") or []):
            if d.get("date") and d.get("close"):
                days.append(d)
    days.sort(key=lambda x: x["date"])
    return days


def pick_candidates(price_history, names, calls, today):
    """오늘 조건을 만족하는 종목을 낙폭이 큰 순으로 고른다.

    ⚠️ today보다 뒤의 가격은 절대 보지 않는다. 오늘 뽑는 후보에 미래가 섞이면
       나중에 쌓인 성적이 전부 거짓이 된다.
    """
    out = []
    for code, pages in (price_history or {}).items():
        days = flatten_days(pages)
        if len(days) < LOOKBACK + 1:
            continue
        # today 이하의 마지막 거래일을 오늘로 본다(휴장일에도 안전하게 동작).
        idx = None
        for i in range(len(days) - 1, -1, -1):
            if days[i]["date"] <= today:
                idx = i
                break
        if idx is None or idx < LOOKBACK:
            continue
        cur = days[idx]
        if cur["date"] != today:
            continue                      # 오늘 시세가 아직 없으면 후보로 넣지 않는다
        base = days[idx - LOOKBACK]["close"]
        price = cur["close"]
        if not base or not price or price < MIN_PRICE:
            continue
        drop = (price / base - 1) * 100
        if drop > DROP_PCT:
            continue
        window = days[idx - LOOKBACK:idx]
        # 권리락·거래정지가 섞인 구간은 "가격이 빠진 것"이 아니다. 관찰에서 뺀다.
        span = days[idx - LOOKBACK:idx + 1]
        if any((d.get("volume") or 0) == 0 for d in span):
            continue                      # 거래정지가 낀 구간
        artificial = False
        for k in range(1, len(span)):
            p, q = span[k - 1]["close"], span[k]["close"]
            if p and q and (q / p - 1) * 100 <= LIMIT_DOWN_PCT:
                artificial = True         # 하한가보다 큰 하락 = 권리락
                break
        if artificial:
            continue
        vols = [d.get("volume") or 0 for d in window]
        avg_vol = sum(vols) / len(vols) if vols else 0
        if avg_vol < MIN_AVG_VOLUME:
            continue
        vol = cur.get("volume") or 0
        if not avg_vol or vol / avg_vol < VOL_RATIO:
            continue
        out.append({
            "code": code,
            "name": names.get(code, code),
            "date": today,
            "price": price,
            "dropPct": round(drop, 2),
            "volRatio": round(vol / avg_vol, 2),
            # 같은 날 GAEO는 뭐라고 했는지 함께 남긴다. 나중에 "GAEO가 놓친 것"을
            # 셀 수 있어야 이 목록을 만든 이유가 검증된다.
            "gaeoCall": calls.get(code),
        })
    out.sort(key=lambda x: (x["dropPct"], -x["volRatio"]))
    return out[:MAX_WATCH]


def score_pending(entries, price_history, today):
    """아직 채점되지 않은 과거 후보 중 5거래일이 지난 것을 채점한다.

    ⚠️ 지나간 가격을 지어내지 않는다. 그날 시세가 없으면 채점하지 않고 그대로 둔다.
    """
    scored = 0
    for e in entries:
        if e.get("status") != "PENDING":
            continue
        days = flatten_days(price_history.get(e["code"]))
        if not days:
            continue
        try:
            i = next(k for k, d in enumerate(days) if d["date"] == e["date"])
        except StopIteration:
            continue
        j = i + HOLD_DAYS
        if j >= len(days) or days[j]["date"] > today:
            continue                      # 아직 5거래일이 안 지났다
        exit_price = days[j]["close"]
        if not exit_price:
            continue
        e["exitDate"] = days[j]["date"]
        e["exitPrice"] = exit_price
        e["returnPct"] = net_return_pct(e["price"], exit_price)
        # 관측한 구간 안의 최고가도 남긴다(폭등을 실제로 잡았는지 보려면 필요하다).
        highs = [d.get("high") or d["close"] for d in days[i:j + 1]]
        e["maxGainPct"] = round((max(highs) / e["price"] - 1) * 100, 2) if highs else None
        e["status"] = "SCORED"
        scored += 1
    return scored


def summarize(entries):
    """성적 요약. 표본이 모자라면 숫자를 만들지 않고 비운다(0으로 채우지 않는다)."""
    done = [e for e in entries if e.get("status") == "SCORED" and e.get("returnPct") is not None]
    days = sorted({e["date"] for e in done})
    enough = len(done) >= MIN_SCORED_FOR_EVIDENCE and len(days) >= MIN_DAYS_FOR_EVIDENCE
    out = {
        "ruleVersion": RULE_VERSION,
        "scoredCount": len(done),
        "observedDays": len(days),
        "minScoredForEvidence": MIN_SCORED_FOR_EVIDENCE,
        "minDaysForEvidence": MIN_DAYS_FOR_EVIDENCE,
        "evidenceOk": enough,
        "pendingCount": sum(1 for e in entries if e.get("status") == "PENDING"),
        # ⛔ 표본이 찰 때까지 아래는 전부 null이다. 화면이 0%로 읽으면 안 된다.
        "winRatePct": None, "avgReturnPct": None, "medianReturnPct": None,
        "surgeRatePct": None, "avgMaxGainPct": None,
        "gaeoBuyRatePct": None,
    }
    if done:
        # GAEO가 이 후보들을 BUY로 봤는지는 표본과 무관한 단순 집계라 항상 낸다.
        withcall = [e for e in done if e.get("gaeoCall")]
        if withcall:
            buys = sum(1 for e in withcall if e["gaeoCall"] == "BUY")
            out["gaeoBuyRatePct"] = round(buys / len(withcall) * 100, 1)
    if enough:
        rets = sorted(e["returnPct"] for e in done)
        n = len(rets)
        out["winRatePct"] = round(sum(1 for r in rets if r > 0) / n * 100, 1)
        out["avgReturnPct"] = round(sum(rets) / n, 2)
        out["medianReturnPct"] = round(rets[n // 2] if n % 2 else (rets[n // 2 - 1] + rets[n // 2]) / 2, 2)
        out["surgeRatePct"] = round(sum(1 for r in rets if r >= 15) / n * 100, 1)
        gains = [e["maxGainPct"] for e in done if e.get("maxGainPct") is not None]
        if gains:
            out["avgMaxGainPct"] = round(sum(gains) / len(gains), 2)
    return out


def main():
    now = datetime.now(KST)
    price_path = os.path.join(ROOT, "price_history.js")
    if not os.path.exists(price_path):
        print("price_history.js가 없어 반등 후보를 만들 수 없습니다.")
        return 1
    price_history = load_js_value(price_path, "PRICE_HISTORY")
    tickers = load_js_value(os.path.join(ROOT, "tickers.js"), "TICKERS")
    names = {t["code"]: t.get("name", t["code"]) for t in tickers if t.get("code")}

    calls = {}
    auto_path = os.path.join(ROOT, "auto_analysis.js")
    if os.path.exists(auto_path):
        try:
            auto = load_js_value(auto_path, "LIVE_AUTO")
            for code, v in (auto.get("stocks") or {}).items():
                c = (v or {}).get("chief") or {}
                if c.get("call"):
                    calls[code] = c["call"]
        except Exception as exc:                       # 판단이 없어도 후보 자체는 남긴다
            print(f"자동분석 판단을 읽지 못했습니다({type(exc).__name__}) — call 없이 진행")

    # 이전 기록을 이어받는다. 지나간 후보를 다시 뽑지 않는다.
    entries = []
    if os.path.exists(OUT):
        try:
            prev = load_js_value(OUT, "REBOUND_WATCH")
            entries = prev.get("entries") or []
        except Exception as exc:
            print(f"기존 기록을 읽지 못했습니다({type(exc).__name__}) — 새로 시작합니다")

    today = now.strftime("%Y-%m-%d")
    scored = score_pending(entries, price_history, today)

    seen_today = {e["code"] for e in entries if e.get("date") == today}
    added = 0
    for c in pick_candidates(price_history, names, calls, today):
        if c["code"] in seen_today:
            continue                                    # 같은 날 같은 종목은 한 번만
        c["status"] = "PENDING"
        c["ruleVersion"] = RULE_VERSION
        entries.append(c)
        added += 1

    entries.sort(key=lambda e: (e["date"], e["code"]))
    today_list = [e for e in entries if e["date"] == today]
    payload = {
        "schemaVersion": 1,
        "ruleVersion": RULE_VERSION,
        "generatedAt": now.strftime("%Y-%m-%d %H:%M"),
        "rule": {
            "dropPct": DROP_PCT, "volRatio": VOL_RATIO,
            "lookbackDays": LOOKBACK, "holdDays": HOLD_DAYS, "maxWatch": MAX_WATCH,
            "note": ("직전 20거래일 하락률이 -20% 이하이고 당일 거래량이 20일 평균의 "
                     "1.5배 이상인 종목. 매수 추천이 아니라 관찰 기록이다."),
        },
        "costModel": {"commissionPct": COMMISSION_PCT, "sellTaxPct": SELL_TAX_PCT},
        "today": today,
        "todayCount": len(today_list),
        "summary": summarize(entries),
        "entries": entries,
    }
    header = (
        "// 자동 생성: compute_rebound_watch.py · 반등 후보 관찰 기록\n"
        "// ⚠️ 매수 추천이 아니다. 규칙이 실제로 통하는지 성적을 쌓는 관찰 목록이다.\n"
        "// ⚠️ 표본이 찰 때까지 summary의 성적 항목은 null이다. 화면이 0으로 채우면 안 된다.\n"
        "// ⚠️ 사람이 직접 고치지 말 것 — 다음 사이클에 덮어써진다.\n"
    )
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(header + "window.REBOUND_WATCH = "
                + json.dumps(payload, ensure_ascii=False, indent=1) + ";\n")
    s = payload["summary"]
    print(f"반등 후보 갱신 — 오늘 {len(today_list)}종목(신규 {added}) · "
          f"채점 완료 {scored}건 추가 · 누적 채점 {s['scoredCount']}건 / 관찰일 {s['observedDays']}일 · "
          f"성적 공개 {'가능' if s['evidenceOk'] else '보류(표본 부족)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
