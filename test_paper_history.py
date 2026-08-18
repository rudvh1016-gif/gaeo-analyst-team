#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모의투자 기록(History)·종합평가·전략분류 계약.

이 파일이 지키는 것
    ① 하루에 사이클이 몇 번이든 Daily Record는 1개, 대표값은 그날 마지막 유효 스냅샷.
    ② 매수 = 그날 실제 진입(ENTRY) / 매도 = 그날 실제 종료(EXIT). 어제 사서 오늘 들고
       있는 종목은 오늘 매수가 아니다. 같은 trade_id를 매수 2건으로 세지 않는다.
    ③ 모든 날짜 그룹핑은 KST. UTC 표기가 섞여 들어와도 KST로 옮겨 센다.
    ④ **과거는 불변** — 오늘 시세·현재 mark이 아무리 바뀌어도 지난 날짜 기록은 1원도
       달라지지 않는다(가장 중요한 계약).
    ⑤ 종합평가의 모든 문장은 저장된 fact에서 나온다. 뉴스·수급·금리 같은 증명할 수
       없는 원인은 구조적으로 생성되지 않는다.
    ⑥ 표본이 적으면 어떤 전략도 우승으로 선언하지 않는다.
    ⑦ 손상된 원장(중복·역순·잘린 줄·null 시각)에도 무너지지 않는다.
"""
import json
import sys

import paper_history as ph

FAILURES = []
CFG = {"initial_cash_krw": 10_000_000, "maxHoldingTradingDays": 5}


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def op(tid, sym, day, price, qty, at=None, name=None):
    return {"trade_id": tid, "environment": "LIVE_PAPER", "status": "OPEN",
            "symbol": sym, "name": name or sym, "market": "KOSPI",
            "entry_price": price, "quantity": qty, "entry_business_date": day,
            "simulated_fill_at": at or f"{day}T10:05:00+09:00",
            "detected_at": at or f"{day}T10:05:00+09:00",
            "recorded_at": at or f"{day}T10:05:00+09:00"}


def cl(tid, sym, eday, xday, ep, xp, qty, hold, reason="CHIEF_SELL", bench=None,
       mfe=None, mae=None, name=None):
    r = op(tid, sym, eday, ep, qty, name=name)
    r.update({"status": "CLOSED", "exit_price": xp, "exit_business_date": xday,
              "exit_at": f"{xday}T14:20:00+09:00", "exit_reason": reason,
              "holding_trading_days": hold,
              "gross_return_pct": round((xp / ep - 1) * 100, 3),
              "benchmark_return_pct": bench, "mfe_pct": mfe, "mae_pct": mae})
    return r


def sk(tid, day, status="SKIPPED_INSUFFICIENT_CASH"):
    return {"trade_id": tid, "environment": "LIVE_PAPER", "status": status,
            "symbol": "005930", "name": "삼성전자",
            "recorded_at": f"{day}T10:05:00+09:00"}


def cv(day, hhmm, equity, cash=None, marked=None, positions=None, realized=0, unreal=None):
    marked = equity - (cash if cash is not None else 0) if marked is None else marked
    return {"at": f"{day}T{hhmm}:00+09:00", "cash": cash if cash is not None else 0,
            "positionsCost": 0, "openCount": len(positions or {}),
            "positions": positions or {}, "markedPositionsValue": marked,
            "markedEquity": equity, "realizedPnl": realized,
            "unrealizedPnl": unreal if unreal is not None else 0.0,
            "valuationObservedAt": f"{day}T{hhmm}:00+09:00",
            "valuationMarketAt": None, "valuationStatus": "MARKED"}


def by_date(h):
    return {d["date"]: d for d in h["days"]}


# ═══ ① 하루 = 기록 1개 · 대표값은 마지막 유효 스냅샷 ══════════════════════════
curve13 = [cv("2026-08-18", f"{9 + i // 2:02d}:{(i % 2) * 30:02d}"[:5], 10_000_000 + i * 1000)
           for i in range(13)]
curve13 = [cv("2026-08-18", f"{9 + i // 2:02d}:{(i % 2) * 30:02d}", 10_000_000 + i * 1000)
           for i in range(13)]
h = ph.build([op("t1", "005930", "2026-08-18", 70000, 10)], curve13, CFG, today="2026-08-19")
check("① 하루 사이클 13개 → Daily Record 1개", len(h["days"]) == 1, str(len(h["days"])))
check("① 대표값은 그날 마지막 유효 스냅샷", h["days"][0]["equity"] == 10_000_000 + 12 * 1000,
      str(h["days"][0]["equity"]))

# 평가 불가(markedEquity null) 사이클은 대표값으로 쓰지 않는다
bad = dict(cv("2026-08-18", "15:20", 0)); bad["markedEquity"] = None
h2 = ph.build([], curve13 + [bad], CFG, today="2026-08-19")
check("① 평가 불가 사이클은 대표 스냅샷으로 쓰지 않는다",
      h2["days"][0]["equity"] == 10_000_000 + 12 * 1000)

# 다음 날짜 → 기록 +1, 최근이 위
h3 = ph.build([], curve13 + [cv("2026-08-19", "15:20", 10_050_000)], CFG, today="2026-08-20")
check("① 다음 날짜 → 기록 2개", len(h3["days"]) == 2)
check("① 최근 날짜가 맨 위", h3["days"][0]["date"] == "2026-08-19")

# ═══ ② KST 기준 그룹핑 (UTC 표기 섞여도) ═════════════════════════════════════
utc_row = {"at": "2026-08-18T15:30:00+00:00", "cash": 0, "positionsCost": 0, "openCount": 0,
           "positions": {}, "markedPositionsValue": 0, "markedEquity": 9_999_000,
           "realizedPnl": 0, "unrealizedPnl": 0.0, "valuationStatus": "MARKED"}
h4 = ph.build([], [utc_row], CFG, today="2026-08-20")
check("② UTC 15:30 → KST 8/19로 집계(UTC 날짜로 묶지 않는다)",
      h4["days"][0]["date"] == "2026-08-19", h4["days"][0]["date"])
check("② KST 자정 직전/직후 분리",
      ph.kst_date("2026-08-18T23:59:00+09:00") == "2026-08-18"
      and ph.kst_date("2026-08-19T00:01:00+09:00") == "2026-08-19")

# ═══ ③ 매수/매도 집계 — lifecycle · 중복 · 같은 날 · 같은 종목 ═══════════════
led = [op("a", "005930", "2026-08-18", 70000, 10, name="삼성전자"),
       cl("a", "005930", "2026-08-18", "2026-08-20", 70000, 72000, 10, 2, name="삼성전자")]
curve = [cv("2026-08-18", "15:20", 9_900_000), cv("2026-08-20", "15:20", 10_020_000)]
h5 = ph.build(led, curve, CFG, today="2026-08-21")
d = by_date(h5)
check("③ OPEN 날짜에 매수 1 · 매도 0", d["2026-08-18"]["buyCount"] == 1 and d["2026-08-18"]["sellCount"] == 0)
check("③ CLOSED 날짜에 매수 0 · 매도 1", d["2026-08-20"]["buyCount"] == 0 and d["2026-08-20"]["sellCount"] == 1)
check("③ 같은 trade_id를 매수 2건으로 세지 않는다",
      sum(x["buyCount"] for x in h5["days"]) == 1)
check("③ 어제 산 종목이 오늘 매수로 집계되지 않는다", d["2026-08-20"]["buyCount"] == 0)

same = [op("b", "011200", "2026-08-19", 20000, 50),
        cl("b", "011200", "2026-08-19", "2026-08-19", 20000, 21000, 50, 0)]
h6 = ph.build(same, [cv("2026-08-19", "15:20", 10_050_000)], CFG, today="2026-08-20")
check("③ 같은 날 진입+종료 → 그날 매수 1 · 매도 1",
      h6["days"][0]["buyCount"] == 1 and h6["days"][0]["sellCount"] == 1)

two = [op("x1", "005930", "2026-08-18", 70000, 10),
       cl("x1", "005930", "2026-08-18", "2026-08-19", 70000, 71000, 10, 1),
       op("x2", "005930", "2026-08-20", 72000, 10)]
h7 = ph.build(two, [cv("2026-08-18", "15:20", 1), cv("2026-08-20", "15:20", 2)], CFG,
              today="2026-08-21")
check("③ 같은 종목이라도 trade_id가 다르면 별개 episode",
      sum(x["buyCount"] for x in h7["days"]) == 2 and sum(x["sellCount"] for x in h7["days"]) == 1)

# 손상된 원장에도 무너지지 않는다
messy = [op("m1", "005930", "2026-08-18", 70000, 10),
         op("m1", "005930", "2026-08-18", 70000, 10),          # 중복
         cl("m1", "005930", "2026-08-18", "2026-08-19", 70000, 71000, 10, 1),
         {"trade_id": "m2", "environment": "LIVE_PAPER", "status": "OPEN",
          "symbol": "X", "entry_price": None, "quantity": None,
          "entry_business_date": None, "recorded_at": None},   # null 투성이
         {"trade_id": "m3", "environment": "TEST", "status": "OPEN",
          "symbol": "T", "entry_business_date": "2026-08-18"}]  # TEST 환경
messy.reverse()                                                 # 역순 이벤트
hm_ = ph.build(messy, [cv("2026-08-18", "15:20", 1), cv("2026-08-19", "15:20", 2)], CFG,
               today="2026-08-20")
check("③ 중복 행 → 매수 1건으로만 집계",
      sum(x["buyCount"] for x in hm_["days"]) == 1, str([x["buyCount"] for x in hm_["days"]]))
check("③ TEST 환경 기록은 절대 섞이지 않는다",
      all(all(b.get("symbol") != "T" for b in x["buys"]) for x in hm_["days"]))
check("③ 역순·null 이벤트에도 예외 없이 생성", isinstance(hm_["days"], list))

# ═══ ④ 누적 성과 vs 일간 변화 ════════════════════════════════════════════════
hc = ph.build([], [cv("2026-08-18", "15:20", 10_100_000),
                   cv("2026-08-19", "15:20", 10_201_000)], CFG, today="2026-08-20")
dd = by_date(hc)
check("④ 첫 기록일의 일간 변화는 0%가 아니라 없음(—)",
      dd["2026-08-18"]["dailyChangePct"] is None)
check("④ 누적 성과는 시작자금 대비", dd["2026-08-18"]["cumulativeReturnPct"] == 1.0)
check("④ 일간 변화는 이전 기록일 자산 대비",
      dd["2026-08-19"]["dailyChangePct"] == 1.0, str(dd["2026-08-19"]["dailyChangePct"]))
check("④ 회계 항등식 — 현금 + 평가금액 = 자산(그날 스냅샷)",
      all(x["cash"] + x["markedPositionsValue"] == x["equity"] for x in hc["days"]))

# ═══ ⑤ 과거 불변성 (가장 중요) ═══════════════════════════════════════════════
POS = {"005930": {"name": "삼성전자", "qty": 10, "entry": 70000, "mark": 69000},
       "011200": {"name": "HMM", "qty": 50, "entry": 20000, "mark": 20500}}
past_led = [op("p1", "005930", "2026-08-18", 70000, 10, name="삼성전자"),
            op("p2", "011200", "2026-08-18", 20000, 50, name="HMM")]
past_curve = [cv("2026-08-18", "15:20", 9_965_000, cash=8_275_000,
                 marked=1_690_000, positions=POS, unreal=-10_000)]
h_a = ph.build(past_led, past_curve, CFG, today="2026-08-19")
# "현재" 값을 완전히 다른 것으로 바꿔서 다시 만든다 — 과거는 그대로여야 한다
h_b = ph.build(past_led, past_curve + [cv("2026-08-25", "15:20", 5_000_000)],
               CFG, today="2026-08-26",
               market_daily={"2026-08-25": {"KOSPI": 9999}, "2026-08-18": {"KOSPI": 1}})
a = by_date(h_a)["2026-08-18"]
b = by_date(h_b)["2026-08-18"]
same_keys = ("equity", "cash", "markedPositionsValue", "unrealizedPnl",
             "cumulativeReturnPct", "buyCount", "sellCount")
check("⑤ 미래 데이터가 추가돼도 과거 날짜 숫자는 1원도 안 바뀐다",
      all(a[k] == b[k] for k in same_keys),
      str({k: (a[k], b[k]) for k in same_keys if a[k] != b[k]}))
check("⑤ 과거 종합평가 문장도 동일(같은 버전·같은 원본 → 같은 결과)",
      json.dumps(a["review"], ensure_ascii=False, sort_keys=True)
      == json.dumps(b["review"], ensure_ascii=False, sort_keys=True))
check("⑤ 진행 중 표시는 '오늘'일 때만 켜진다",
      a["inProgress"] is False and a["review"]["inProgress"] is False)
h_today = ph.build(past_led, past_curve, CFG, today="2026-08-18")
check("⑤ 오늘 날짜는 진행 중으로 표시",
      h_today["days"][0]["inProgress"] is True
      and h_today["days"][0]["review"]["inProgress"] is True)

# ═══ ⑥ 종합 평가 — 근거(fact) 없는 문장 0 ════════════════════════════════════
def all_lines(rec):
    return [l for s in rec["review"]["sections"] for l in s["lines"]]

lines = all_lines(a)
check("⑥ 모든 평가 문장에 근거 fact가 붙어 있다",
      all(l.get("fact") for l in lines) and len(lines) > 0)
text = " ".join(l["text"] for l in lines)
BANNED = ["외국인", "기관 매도", "실적 발표", "뉴스", "금리", "시장 심리", "수급 악화", "테마"]
check("⑥ 증명할 수 없는 시장 원인을 지어내지 않는다",
      not any(w in text for w in BANNED), text[:120])
check("⑥ 손실 최대 기여 종목을 실제 손익 순위로 지목",
      any(l["fact"] == "largestDetractor" and "삼성전자" in l["text"] for l in lines), text[:160])
check("⑥ 이익 최대 기여 종목도 실제 순위로 지목",
      any(l["fact"] == "largestContributor" and "HMM" in l["text"] for l in lines))
check("⑥ 상승/하락 종목 수를 실제로 센다",
      any(l["fact"] == "advancersDecliners" and "1종목 상승" in l["text"] and "1종목 하락" in l["text"]
          for l in lines), text[:200])

# 기여도 기록이 없는 날 → 지어내지 않고 "없다"고 말한다
h_nopos = ph.build(past_led, [cv("2026-08-18", "15:20", 9_965_000, cash=8_275_000)],
                   CFG, today="2026-08-19")
ln = all_lines(by_date(h_nopos)["2026-08-18"])
check("⑥ 종목별 기록이 없는 날은 기여도를 추정하지 않는다",
      any(l["fact"] == "noPositionSnapshot" for l in ln)
      and not any(l["fact"] in ("largestDetractor", "largestContributor") for l in ln))

# 벤치마크 유무
h_bm = ph.build(past_led, past_curve + [cv("2026-08-19", "15:20", 9_900_000)], CFG,
                today="2026-08-20",
                market_daily={"2026-08-18": {"KOSPI": 100}, "2026-08-19": {"KOSPI": 99}})
ln19 = all_lines(by_date(h_bm)["2026-08-19"])
check("⑥ 지수 기록이 있으면 시장 대비를 %p로 말한다",
      any(l["fact"] == "benchmarkRelative" and "%p" in l["text"] for l in ln19))
check("⑥ 지수 기록이 없으면 비교하지 않는다고 밝힌다",
      any(l["fact"] == "noBenchmark" for l in all_lines(a)))

# 전 종목 이익 / 전 종목 손실 / 전부 보합
def review_for(positions, unreal, day="2026-08-18"):
    led2 = [op(f"z{i}", s, day, p["entry"], p["qty"], name=p["name"])
            for i, (s, p) in enumerate(positions.items())]
    cu = [cv(day, "15:20", 10_000_000 + unreal, cash=0, marked=10_000_000 + unreal,
             positions=positions, unreal=unreal)]
    return all_lines(ph.build(led2, cu, CFG, today="2026-08-30")["days"][0])

P_WIN = {"A": {"name": "A", "qty": 1, "entry": 100, "mark": 110},
         "B": {"name": "B", "qty": 1, "entry": 100, "mark": 120}}
P_LOSS = {"A": {"name": "A", "qty": 1, "entry": 100, "mark": 90},
          "B": {"name": "B", "qty": 1, "entry": 100, "mark": 80}}
P_FLAT = {"A": {"name": "A", "qty": 1, "entry": 100, "mark": 100},
          "B": {"name": "B", "qty": 1, "entry": 100, "mark": 100}}
lw, ll, lf = review_for(P_WIN, 30), review_for(P_LOSS, -30), review_for(P_FLAT, 0)
check("⑥ 전 종목 이익 → 손실 기여 문장을 만들지 않는다",
      not any(l["fact"] == "largestDetractor" for l in lw)
      and any(l["fact"] == "largestContributor" for l in lw))
check("⑥ 전 종목 손실 → 이익 기여 문장을 만들지 않는다",
      not any(l["fact"] == "largestContributor" for l in ll)
      and any(l["fact"] == "largestDetractor" for l in ll))
check("⑥ 전부 보합 → 손익 기여가 없다고 말한다",
      any(l["fact"] == "allFlat" for l in lf)
      and not any(l["fact"] in ("largestContributor", "largestDetractor") for l in lf))
check("⑥ 근거가 없으면 '꼽기 어렵다'고 쓴다(빈 칭찬 금지)",
      any(l["fact"] == "insufficientEvidence" for l in lf))

# 확정손익만 / 미실현만 / 둘 다
sells_only = [cl("s1", "005930", "2026-08-17", "2026-08-18", 100, 110, 100, 1)]
h_r = ph.build(sells_only, [cv("2026-08-18", "15:20", 10_001_000, cash=10_001_000, marked=0)],
               CFG, today="2026-08-19")
lr = all_lines(h_r["days"][0])
check("⑥ 종료 거래가 있으면 확정 손익을 명시",
      any(l["fact"] == "realizedPnl" for l in lr)
      and any(l["fact"] == "realizedWins" for l in lr))
check("⑥ 종료 거래가 없으면 그 사실을 명시",
      any(l["fact"] == "noSells" for l in all_lines(a)))
check("⑥ '다음에 확인할 점'은 매매 지시가 아니다",
      not any(w in " ".join(l["text"] for s in a["review"]["sections"]
                            if s["key"] == "watch" for l in s["lines"])
              for w in ("매수하", "매도하", "사세요", "파세요", "손절", "비중 확대")))

# ═══ ⑦ 전략 분류 · 표본 부족 ═════════════════════════════════════════════════
check("⑦ 보유기간 → bucket 결정적",
      [ph.classify_holding(i) for i in range(6)]
      == ["same_day", "ultra_short", "short", "swing", "swing", "swing"])
check("⑦ 엔진이 만들 수 없는 6·20거래일은 현재 전략으로 분류하지 않는다",
      ph.classify_holding(6) == "other" and ph.classify_holding(20) == "other")
check("⑦ 보유기간 미기록은 분류하지 않는다", ph.classify_holding(None) is None)

few = [cl(f"f{i}", "005930", "2026-08-17", "2026-08-20", 100, 110, 10, 3) for i in range(3)]
h_s = ph.build(few, [cv("2026-08-20", "15:20", 10_030_000)], CFG, today="2026-08-21")
S = h_s["strategy"]
check("⑦ 표본 3건으로는 우승 전략을 선언하지 않는다",
      S["enough"] is False and all(not b["enough"] for b in S["buckets"]))
check("⑦ 각 bucket이 항상 표본 수를 함께 싣는다",
      all("tradeCount" in b for b in S["buckets"]))
swing = [b for b in S["buckets"] if b["key"] == "swing"][0]
check("⑦ 스윙 통계가 정확(3건·평균 +10%·승률 100%)",
      swing["tradeCount"] == 3 and swing["avgReturnPct"] == 10.0
      and swing["winRatePct"] == 100.0, json.dumps(swing, ensure_ascii=False))
check("⑦ 중기·장기는 '현재 검증 중'이 아니라 미지원으로만 남는다",
      [u["label"] for u in S["unsupported"]] == ["중기", "장기"]
      and all(b["label"] not in ("중기", "장기") for b in S["buckets"]))

mixed = ([cl(f"w{i}", "A", "2026-08-17", "2026-08-20", 100, 110, 10, 3, bench=2.0,
             mfe=12.0, mae=-1.0) for i in range(12)]
         + [cl(f"l{i}", "B", "2026-08-17", "2026-08-19", 100, 95, 10, 2, bench=1.0)
            for i in range(8)])
h_m = ph.build(mixed, [cv("2026-08-20", "15:20", 10_100_000)], CFG, today="2026-08-21")
M = h_m["strategy"]
sw = [b for b in M["buckets"] if b["key"] == "swing"][0]
sh = [b for b in M["buckets"] if b["key"] == "short"][0]
check("⑦ 표본 20건 도달 시 enough=True", M["enough"] is True and M["totalClosed"] == 20)
check("⑦ bucket별 승률·평균·시장대비·MFE/MAE 계산 정확",
      sw["winRatePct"] == 100.0 and sw["avgReturnPct"] == 10.0
      and sw["avgRelativeReturnPct"] == 8.0 and sw["avgMfePct"] == 12.0
      and sw["avgMaePct"] == -1.0 and sh["avgReturnPct"] == -5.0,
      json.dumps([sw, sh], ensure_ascii=False))
check("⑦ 산출물이 매매 규칙을 바꾸라고 말하지 않는다",
      "관찰" in M["note"] or "알 수 없" in M["note"])

# ═══ ⑧ 위생 · 결정성 ═════════════════════════════════════════════════════════
blob = json.dumps(h_m, ensure_ascii=False)
check("⑧ 내부 상태·사유 코드가 산출물에 노출되지 않는다",
      not any(w in blob for w in ("CHIEF_SELL", "MAX_HOLDING_5D", "SKIPPED_",
                                  "LIVE_PAPER", "trade_id")))
low = blob.lower()
check("⑧ Secret·토큰·계좌 흔적 0",
      not any(w in low for w in ("client_id", "client_secret", "token",
                                 "authorization", "account", "secret")))
h_again = ph.build(mixed, [cv("2026-08-20", "15:20", 10_100_000)], CFG, today="2026-08-21")
h_m2 = dict(h_m); h_again2 = dict(h_again)
h_m2.pop("generatedAt"); h_again2.pop("generatedAt")
check("⑧ 같은 입력 → 항상 같은 산출물(결정적)",
      json.dumps(h_m2, ensure_ascii=False, sort_keys=True)
      == json.dumps(h_again2, ensure_ascii=False, sort_keys=True))
check("⑧ 평가 규칙 버전이 산출물에 남는다",
      h_m["reviewVersion"] == ph.REVIEW_VERSION and h_m["schemaVersion"] == ph.HISTORY_SCHEMA)

# 실제 원장으로도 생성되는지(스모크)
import os
real_led = ph.read_jsonl(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      "paper_trading", "trades.jsonl"))
real_cur = ph.read_jsonl(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                      "paper_trading", "equity_curve.jsonl"))
if real_led and real_cur:
    hr = ph.build(real_led, real_cur, CFG)
    check("⑧ 실제 원장으로 기록 생성 성공", len(hr["days"]) >= 1)
    check("⑧ 실제 기록의 매수 건수 = 원장 OPEN trade_id 수",
          sum(x["buyCount"] for x in hr["days"])
          == len({r["trade_id"] for r in real_led
                  if r.get("status") == "OPEN" and r.get("environment") == "LIVE_PAPER"}))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_history: 전체 통과 (기록·종합평가·전략분류 계약)")
