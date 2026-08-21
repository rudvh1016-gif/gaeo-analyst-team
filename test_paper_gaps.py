#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""관측 공백(Observation Gap) — 러너가 못 본 날을 '못 봤다'고 정직하게 남기는가.

배경(2026-08-19~20 실제 사고): 게이트웨이 설치가 러너의 자격증명 파일을 다른 형식으로
덮어써 이틀간 사이클이 전부 실패했다. 기록은 조용히 비었고, 복구한 뒤 화면은
8/18 다음이 곧바로 8/20인 것처럼 보였다 — 그 사이에 아무 일도 없었던 것처럼.

이 파일이 고정하는 계약:
  · 공백 날짜를 하드코딩하지 않는다 — "그날 기록 행이 0개"라는 파일의 사실로만 판정한다.
    (그래야 다음에 또 멈춰도 아무도 코드를 고치지 않고 그날이 자동으로 드러난다)
  · 공백을 숫자로 채우지 않는다 — 0원·0%를 만들지 않고 None으로 둔다(0과 '모름'은 다르다).
  · 모르는 것은 단정하지 않는다 — 오늘·기록 시작 전·옛 스키마 행은 공백으로 부르지 않는다.
  · 기존 날짜의 숫자는 1원도 바뀌지 않는다.
"""
import json
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_history as ph
import paper_market_data as pmd
import paper_public as pp

KST = timezone(timedelta(hours=9))
FAILURES = []

# 로컬 콘솔이 cp949면 한글·em dash 출력에서 죽는다 — 실패 메시지가 인코딩 때문에
# 안 보이는 일이 없도록 출력만 UTF-8로 고정한다(테스트 판정에는 영향 없음).
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def row(at, in_session=None, equity=10_000_000):
    r = {"at": at, "markedEquity": equity, "cash": equity, "positionsCost": 0,
         "markedPositionsValue": 0, "openCount": 0, "realizedPnl": 0, "unrealizedPnl": 0}
    if in_session is not None:
        r["inSession"] = in_session
    return r


def curve(path, rows):
    with open(path, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    return path


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at}


def calendar_open(day):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    return {"today": {"date": day, "open": True,
                      "integrated": {"regularMarket": regular}},
            "previousBusinessDay": None, "nextBusinessDay": None}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def make_engine(tmp, day):
    provider = pmd.FixtureMarketDataProvider(
        prices={"005930": {"price": 9_995, "timestamp": f"{day}T10:00:00+09:00"}},
        orderbooks={"005930": {"bestAsk": 10_000, "bestBid": 9_990,
                               "timestamp": f"{day}T10:00:00+09:00"}},
        calendar=calendar_open(day))
    cfg = {"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
           "position_size_krw": 1_000_000, "maxHoldingTradingDays": 5}
    return pe.PaperEngine(provider, data_dir=tmp, config=cfg, environment="TEST")


def ledger_of(tmp):
    p = os.path.join(tmp, "trades.jsonl")
    return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]


D1, D2, D3 = "2026-08-18", "2026-08-19", "2026-08-20"
BD = [D1, D2, D3, "2026-08-21"]
tmp = tempfile.mkdtemp(prefix="gap_")

# ── 1. 판정의 근거는 오직 "그날 기록이 있는가" ───────────────────────────────
c1 = curve(os.path.join(tmp, "c1.jsonl"),
           [row(f"{D1}T15:05:00+09:00"), row(f"{D3}T15:05:00+09:00")])
g = pe.observation_gaps(c1, BD, today_date="2026-08-21")
check("1. 기록이 0건인 거래일만 공백으로 판정한다",
      [x["businessDate"] for x in g] == [D2], str(g))
check("1-1. 종류는 NO_RECORD, 관측 수는 0", g and g[0]["kind"] == pe.GAP_NO_RECORD
      and g[0]["observations"] == 0, str(g))
check("1-2. 오늘(8/21)은 아직 진행 중이라 공백으로 단정하지 않는다",
      "2026-08-21" not in [x["businessDate"] for x in g], str(g))

# ── 2. 모르는 구간은 건드리지 않는다 ─────────────────────────────────────────
check("2. 기록이 시작된 날 이전은 공백이 아니다(엔진이 없던 시절)",
      [x["businessDate"] for x in
       pe.observation_gaps(c1, ["2026-08-13", "2026-08-14", "2026-08-17"] + BD,
                           "2026-08-21")] == [D2])
check("3. 근거 파일이 없으면 공백을 주장하지 않는다",
      pe.observation_gaps(os.path.join(tmp, "없는파일.jsonl"), BD, "2026-08-21") == [])
check("3-1. 거래일 목록이 비어 있으면 공백을 만들지 않는다",
      pe.observation_gaps(c1, [], "2026-08-21") == [])

c2 = os.path.join(tmp, "c2.jsonl")
with open(c2, "w", encoding="utf-8") as f:
    f.write(json.dumps(row(f"{D1}T15:05:00+09:00")) + "\n")
    f.write("{깨진 줄\n")
    f.write(json.dumps(row(f"{D3}T15:05:00+09:00")) + "\n")
check("4. 손상된 줄이 섞여 있어도 판정이 죽지 않는다",
      [x["businessDate"] for x in pe.observation_gaps(c2, BD, "2026-08-21")] == [D2])

# JSON으로는 읽히지만 dict가 아닌 줄(숫자·null·배열). paper_public이 이 함수를
# try/except 밖에서 부르므로, 여기서 터지면 공개 스냅샷 생성이 통째로 멈춘다.
c2b = os.path.join(tmp, "c2b.jsonl")
with open(c2b, "w", encoding="utf-8") as f:
    f.write(json.dumps(row(f"{D1}T15:05:00+09:00")) + "\n123\nnull\n[]\n\"문자열\"\n")
    f.write(json.dumps(row(f"{D3}T15:05:00+09:00")) + "\n")
check("4-1. dict가 아닌 줄(숫자·null·배열)이 있어도 죽지 않는다",
      [x["businessDate"] for x in pe.observation_gaps(c2b, BD, "2026-08-21")] == [D2],
      "AttributeError 없이 정상 판정해야 한다")

# ── 5. 기록은 있는데 전부 장 끝난 뒤였던 날 ─────────────────────────────────
c3 = curve(os.path.join(tmp, "c3.jsonl"),
           [row(f"{D1}T15:05:00+09:00", True),
            row(f"{D2}T21:14:00+09:00", False),      # 장 끝난 뒤 복구 실행
            row(f"{D2}T21:22:00+09:00", False),
            row(f"{D3}T10:05:00+09:00", True)])
g3 = pe.observation_gaps(c3, BD, "2026-08-21")
check("5. 기록은 있어도 장중 관측이 0건이면 공백이다(NO_SESSION_RECORD)",
      len(g3) == 1 and g3[0]["businessDate"] == D2
      and g3[0]["kind"] == pe.GAP_NO_SESSION_RECORD and g3[0]["observations"] == 2, str(g3))

c4 = curve(os.path.join(tmp, "c4.jsonl"),
           [row(f"{D1}T15:05:00+09:00", True),
            row(f"{D2}T21:14:00+09:00"),             # 옛 스키마 — inSession이 없다
            row(f"{D3}T10:05:00+09:00", True)])
check("6. 장중 여부를 모르는 옛 행은 공백으로 단정하지 않는다",
      pe.observation_gaps(c4, BD, "2026-08-21") == [],
      str(pe.observation_gaps(c4, BD, "2026-08-21")))

c5 = curve(os.path.join(tmp, "c5.jsonl"),
           [row(f"{D1}T15:05:00+09:00", True),
            row(f"{D2}T09:05:00+09:00", True),       # 장중 관측이 하나라도 있으면
            row(f"{D2}T21:14:00+09:00", False),
            row(f"{D3}T10:05:00+09:00", True)])
check("7. 장중 관측이 한 번이라도 있으면 공백이 아니다",
      pe.observation_gaps(c5, BD, "2026-08-21") == [])

# ── 8~11. 날짜별 기록(History)에 공백이 드러나는가 ──────────────────────────
CFG = {"initial_cash_krw": 10_000_000, "maxHoldingTradingDays": 5}
crows = [row(f"{D1}T15:05:00+09:00", True, 10_000_000),
         row(f"{D3}T15:05:00+09:00", True, 9_900_000)]
h_old = ph.build([], crows, CFG, today="2026-08-21")
h_new = ph.build([], crows, CFG, today="2026-08-21", business_dates=BD)
check("8. business_dates를 주지 않으면 기존 동작 그대로다(하위 호환)",
      [d["date"] for d in h_old["days"]] == [D3, D1], str([d["date"] for d in h_old["days"]]))
check("9. 공백 거래일이 기록 목록에 한 줄로 드러난다",
      [d["date"] for d in h_new["days"]] == [D3, D2, D1],
      str([d["date"] for d in h_new["days"]]))
gapday = [d for d in h_new["days"] if d["date"] == D2][0]
check("9-1. 공백 행은 noRecord=True로 구분된다", gapday["noRecord"] is True)
check("9-2. 공백 행은 숫자를 지어내지 않는다(0이 아니라 None)",
      all(gapday[k] is None for k in ("equity", "cash", "cumulativeReturnPct",
                                      "dailyChangePct", "marketChangePct", "openCount")),
      str({k: gapday[k] for k in ("equity", "cumulativeReturnPct")}))
check("9-3. 공백 행에는 매매 기록이 없다",
      gapday["buyCount"] == 0 and gapday["sellCount"] == 0
      and gapday["buys"] == [] and gapday["sells"] == [])
check("9-4. 공백 행의 평가는 '기록 없음'이라는 사실만 말한다",
      gapday["review"]["sections"][0]["lines"][0]["fact"] == "noObservationRecorded")
check("9-5. 정상 행은 noRecord=False",
      all(d["noRecord"] is False for d in h_new["days"] if d["date"] != D2))

o = {d["date"]: d for d in h_old["days"]}
nw = {d["date"]: d for d in h_new["days"]}
check("10. 공백 행이 생겨도 기존 날짜의 숫자는 1원도 바뀌지 않는다",
      all(o[d][k] == nw[d][k] for d in o for k in
          ("equity", "cash", "dailyChangePct", "cumulativeReturnPct",
           "marketChangePct", "buyCount", "sellCount")),
      str({d: nw[d]["dailyChangePct"] for d in o}))
check("10-1. 일간 변화는 공백을 건너뛰고 직전 '기록일' 기준으로 이어진다",
      nw[D3]["dailyChangePct"] == -1.0, str(nw[D3]["dailyChangePct"]))
check("11. 오늘은 기록이 아직 없어도 공백으로 만들지 않는다",
      all(d["date"] != "2026-08-21" for d in h_new["days"]))

# ── 12~15. 엔진: 청산 기록과 요약에 한계가 함께 남는가 ──────────────────────
tmp2 = tempfile.mkdtemp(prefix="gapeng_")
e = make_engine(tmp2, D1)
e.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))   # baseline
e.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))   # 진입
# 8/19 — 러너가 죽어 사이클이 아예 돌지 않았다(기록 0건). 보유일 보충으로 거래일만 남는다.
e2 = make_engine(tmp2, D3)
e2.state["businessDates"] = [D1, D2]
e2.run_cycle(bundle({"005930": "SELL"}, f"{D3}T10:05:00+09:00"), now=t(D3, 10, 10))
closed = [x for x in ledger_of(tmp2) if x.get("status") == "CLOSED"]
check("12. 청산 기록에 보유 기간 중 관측 공백이 남는다",
      bool(closed) and closed[-1].get("observation_gap_business_days") == [D2],
      str(closed[-1].get("observation_gap_business_days") if closed else "청산 없음"))
check("12-1. MFE/MAE는 그대로 남는다(보정하지 않는다 — 보정은 없는 가격을 지어내는 것)",
      bool(closed) and closed[-1].get("mfe_pct") is not None
      and closed[-1].get("mae_pct") is not None)
summ = json.load(open(os.path.join(tmp2, "summary.json"), encoding="utf-8"))
check("13. 요약(summary.json)에 관측 공백이 실린다",
      [x["businessDate"] for x in (summ.get("dataGaps") or [])] == [D2],
      str(summ.get("dataGaps")))

tmp3 = tempfile.mkdtemp(prefix="gapeng2_")
e3 = make_engine(tmp3, D1)
e3.run_cycle(bundle({"005930": "HOLD"}, f"{D1}T09:05:00+09:00"), now=t(D1, 9, 10))
e3.run_cycle(bundle({"005930": "BUY"}, f"{D1}T10:05:00+09:00"), now=t(D1, 10, 10))
e3.run_cycle(bundle({"005930": "SELL"}, f"{D1}T11:05:00+09:00"), now=t(D1, 11, 10))
closed3 = [x for x in ledger_of(tmp3) if x.get("status") == "CLOSED"]
check("14. 공백이 없으면 없다고 남긴다(빈 목록을 지어내지 않는다)",
      bool(closed3) and closed3[-1].get("observation_gap_business_days") is None,
      str(closed3[-1].get("observation_gap_business_days") if closed3 else "청산 없음"))
crv3 = [json.loads(l) for l in
        open(os.path.join(tmp3, "equity_curve.jsonl"), encoding="utf-8") if l.strip()]
check("15. 새 Equity 행에는 장중이었는지가 기록된다(다음 공백을 판정할 근거)",
      bool(crv3) and all(isinstance(x.get("inSession"), bool) for x in crv3),
      str([x.get("inSession") for x in crv3]))

# ── 16. 화면까지 실제로 전달되는가 ───────────────────────────────────────────
check("16. 공개 필드 이름은 한 곳에만 둔다(파생이 원장 기록을 덮어쓰지 못하게)",
      "observation_gap_business_days" in pp.DERIVED_ALLOWED
      and "observation_gap_business_days" not in pp.TRADE_ALLOWED
      and not (pp.DERIVED_ALLOWED & pp.TRADE_ALLOWED))

tmp4 = tempfile.mkdtemp(prefix="gappub_")
with open(os.path.join(tmp4, "trades.jsonl"), "w", encoding="utf-8") as f:
    f.write(json.dumps({"trade_id": "a1", "environment": "LIVE_PAPER", "status": "OPEN",
                        "symbol": "005930", "name": "삼성전자", "market": "KOSPI",
                        "signal": "BUY", "entry_price": 10_000, "quantity": 100,
                        "entry_business_date": D1,
                        "detected_at": f"{D1}T10:10:00+09:00"}, ensure_ascii=False) + "\n")
    # 청산분 — 엔진이 청산 때 원장에 남긴 공백이 그대로 화면까지 가는지 본다.
    f.write(json.dumps({"trade_id": "a2", "environment": "LIVE_PAPER", "status": "CLOSED",
                        "symbol": "000660", "name": "SK하이닉스", "market": "KOSPI",
                        "signal": "BUY", "entry_price": 20_000, "quantity": 50,
                        "exit_price": 20_600, "exit_reason": "MAX_HOLDING_5D",
                        "gross_return_pct": 3.0, "holding_trading_days": 2,
                        "entry_business_date": D1, "exit_business_date": D3,
                        "mfe_pct": 3.5, "mae_pct": -0.4,
                        "observation_gap_business_days": [D2],
                        "detected_at": f"{D1}T10:10:00+09:00",
                        "exit_at": f"{D3}T10:10:00+09:00"}, ensure_ascii=False) + "\n")
curve(os.path.join(tmp4, "equity_curve.jsonl"),
      [row(f"{D1}T15:05:00+09:00", True), row(f"{D3}T15:05:00+09:00", True)])
json.dump({"baselineCaptured": True, "lastCycleResult": "CYCLE_OK",
           "businessDates": [D1, D2, D3],
           "openMeta": {"a1": {"lastMarkPrice": 10_100,
                               "lastMarkObservedAt": f"{D3}T15:05:00+09:00"}}},
          open(os.path.join(tmp4, "state.json"), "w", encoding="utf-8"))
json.dump({"initial_cash_krw": 10_000_000, "maxHoldingTradingDays": 5},
          open(os.path.join(tmp4, "config.json"), "w", encoding="utf-8"))
pp.DIR, pp.OUT = tmp4, os.path.join(tmp4, "paper_public.js")
rc = pp.build()
blob = open(pp.OUT, encoding="utf-8").read()
payload = json.loads(blob[blob.index("window.GAEO_PAPER=")
                          + len("window.GAEO_PAPER="):].rstrip().rstrip(";"))
check("16-1. 공개 스냅샷 생성 성공", rc == 0)
check("16-2. 공개 스냅샷에 관측 공백이 실린다",
      [x["businessDate"] for x in (payload.get("dataGaps") or [])] == [D2],
      str(payload.get("dataGaps")))
trades = payload.get("recentTrades") or []
tr_open = ([x for x in trades if x.get("status") == "OPEN"] or [{}])[0]
tr_closed = ([x for x in trades if x.get("status") == "CLOSED"] or [{}])[0]
check("16-3. 아직 들고 있는 종목에도 보유 기간 중 공백이 표기된다",
      tr_open.get("observation_gap_business_days") == [D2], str(tr_open.get("symbol")))
check("16-4. 청산 거래는 원장에 기록된 공백을 그대로 전달한다(재계산하지 않는다)",
      tr_closed.get("observation_gap_business_days") == [D2], str(tr_closed.get("symbol")))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_gaps: 전체 통과")
