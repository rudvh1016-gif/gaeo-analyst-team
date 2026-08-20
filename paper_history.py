#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 모의투자 — 날짜별 기록 · 종합평가 · 전략 분류 (Read-only Derived).

⚠️ 원칙
    - Source of Truth는 trades.jsonl(전체 이벤트) · equity_curve.jsonl 뿐이다.
      이 파일은 거기서 **파생**만 하며 언제든 원본에서 다시 만들 수 있다.
    - Trading Logic(진입·청산·판단)에 어떤 영향도 주지 않는다. 읽기 전용이다.
    - 과거 날짜는 **그날 저장된 값**으로만 만든다. 오늘 시세·현재 mark·현재 state를
      절대 섞지 않는다(8/18 기록은 8/25에 열어도 1원도 달라지지 않아야 한다).
    - 종합평가는 규칙 기반(결정적)이다. 유료 AI 호출 0. 같은 데이터·같은 버전이면
      항상 같은 문장이 나온다.
    - **근거 없는 원인을 지어내지 않는다.** 모든 문장은 fact(실제 저장값)에서 나오며
      어떤 fact로 만들어졌는지 함께 싣는다(테스트가 이를 검증한다).
      "외국인 매도 때문"처럼 저장된 데이터로 증명할 수 없는 원인은 생성 자체가 불가능하다.
"""
import json
import os
import re
from datetime import datetime, timedelta, timezone

KST = timezone(timedelta(hours=9))
HERE = os.path.dirname(os.path.abspath(__file__))

# 평가 문안 생성 규칙 버전 — 같은 버전 + 같은 원본 = 항상 같은 결과.
REVIEW_VERSION = "paper_review_v1"
HISTORY_SCHEMA = "gaeo_paper_history_v1"

# 전략 bucket — 현재 엔진의 실제 최대 보유기간(5거래일) 안에서만 정의한다.
# 엔진이 만들 수 없는 중기·장기 구간을 "현재 검증 중"처럼 보여주지 않는다.
STRATEGY_BUCKETS = [
    ("same_day", "당일형", "진입한 날 바로 종료", 0, 0),
    ("ultra_short", "초단기", "1거래일 보유", 1, 1),
    ("short", "단기", "2거래일 보유", 2, 2),
    ("swing", "스윙", "3~5거래일 보유", 3, 5),
]
# 이 표본 수에 도달하기 전에는 어떤 bucket도 "더 낫다"고 말하지 않는다.
MIN_STRATEGY_SAMPLE = 20


def kst_date(ts):
    """ISO 문자열 → KST 기준 YYYY-MM-DD. UTC 표기가 와도 KST로 변환한다."""
    if not ts or not isinstance(ts, str):
        return None
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=KST)
    return dt.astimezone(KST).strftime("%Y-%m-%d")


def kst_hm(ts):
    if not ts or not isinstance(ts, str):
        return None
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=KST)
    return dt.astimezone(KST).strftime("%H:%M")


def read_jsonl(path):
    rows = []
    if not os.path.exists(path):
        return rows
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))     # 잘린 줄은 건너뛴다(원장 보호)
            except json.JSONDecodeError:
                continue
    return rows


def load_market_daily(path=None):
    """날짜별 지수 종가 — 시장 대비 비교용. 없으면 빈 dict(비교를 지어내지 않는다)."""
    path = path or os.path.join(HERE, "market_history.js")
    try:
        s = open(path, encoding="utf-8").read()
        d = json.loads(re.search(r"=\s*(\{.*\})\s*;?\s*$", s, re.S).group(1))
        out = {}
        for day, row in d.items():
            out[day] = {"KOSPI": (row.get("kospi") or {}).get("value"),
                        "KOSDAQ": (row.get("kosdaq") or {}).get("value")}
        return out
    except Exception:
        return {}


def _num(v):
    return v if isinstance(v, (int, float)) and v == v else None


def _pct(v, d=2):
    return round(v, d) if v is not None else None


# ── 이벤트 → 날짜별 매수/매도 ────────────────────────────────────────────────
def split_events(ledger, environment="LIVE_PAPER"):
    """전체 이벤트 원장을 매수(OPEN)·매도(CLOSED)·건너뜀으로 나눈다.

    ⚠️ trade_id 하나는 OPEN 1회 + CLOSED 1회로 기록된다(같은 행이 두 번 쌓이는 게
       아니라 상태가 바뀐 새 행이 append 된다). 그래서 매수 1 · 매도 1이 맞고,
       같은 trade_id를 매수 2건으로 세면 안 된다 → trade_id로 중복을 제거한다.
    ⚠️ 같은 종목이라도 trade_id가 다르면 다른 episode다(각각 1건).
    """
    buys, sells, skips = {}, {}, {}
    for r in ledger:
        if r.get("environment") != environment:
            continue                      # TEST 기록은 절대 섞지 않는다
        tid = r.get("trade_id")
        if not tid:
            continue
        st = str(r.get("status") or "")
        if st == "OPEN" and tid not in buys:
            buys[tid] = r
        elif st == "CLOSED":
            sells[tid] = r                # 마지막 CLOSED 행을 쓴다
            buys.setdefault(tid, None)    # 자리표시 — 아래에서 원 OPEN 행으로 채운다
        elif st.startswith("SKIPPED") and tid not in skips:
            skips[tid] = r
    # CLOSED만 보고 buys에 None이 들어간 경우, 같은 tid의 OPEN 행을 다시 찾아 채운다
    for r in ledger:
        if r.get("environment") == environment and r.get("status") == "OPEN":
            tid = r.get("trade_id")
            if tid in buys and buys[tid] is None:
                buys[tid] = r
    return ([v for v in buys.values() if v],
            list(sells.values()), list(skips.values()))


def buy_date(r):
    return r.get("entry_business_date") or kst_date(
        r.get("simulated_fill_at") or r.get("recorded_at") or r.get("detected_at"))


def sell_date(r):
    return r.get("exit_business_date") or kst_date(r.get("exit_at") or r.get("recorded_at"))


def public_buy(r):
    """그날 매수 기록 — 종목·수량·진입가격·진입시각(사용자에게 보일 것만)."""
    return {
        "symbol": r.get("symbol"), "name": r.get("name"), "market": r.get("market"),
        "quantity": _num(r.get("quantity")), "entryPrice": _num(r.get("entry_price")),
        "entryAt": kst_hm(r.get("simulated_fill_at") or r.get("recorded_at")),
        "costBasis": (round(r["entry_price"] * r["quantity"])
                      if _num(r.get("entry_price")) and _num(r.get("quantity")) else None),
    }


# 내부 사유 코드는 화면에 내보내지 않는다 — 사람이 읽는 말로 바꿔서만 싣는다.
EXIT_REASON_KO = {
    "CHIEF_SELL": "GAEO 판단이 「매도 고려」로 변경",
    "MAX_HOLDING_5D": "최대 보유기간 도달",
}
SKIP_REASON_KO = {
    "SKIPPED_INSUFFICIENT_CASH": "가상 투자 여력 부족",
    "SKIPPED_PRICE_ABOVE_POSITION_SIZE": "1주 가격이 종목당 기준금액보다 큼",
    "SKIPPED_MARKET_DATA_UNAVAILABLE": "시세를 받지 못함",
}


def public_sell(r):
    """그날 매도 기록 — 매수가·매도가·확정손익·수익률·보유기간·종료 이유."""
    qty, ep, xp = _num(r.get("quantity")), _num(r.get("entry_price")), _num(r.get("exit_price"))
    return {
        "symbol": r.get("symbol"), "name": r.get("name"), "market": r.get("market"),
        "quantity": qty, "entryPrice": ep, "exitPrice": xp,
        "exitAt": kst_hm(r.get("exit_at")),
        "realizedPnl": round((xp - ep) * qty) if None not in (qty, ep, xp) else None,
        "returnPct": _num(r.get("gross_return_pct")),
        "benchmarkReturnPct": _num(r.get("benchmark_return_pct")),
        "holdingTradingDays": _num(r.get("holding_trading_days")),
        "exitReason": EXIT_REASON_KO.get(r.get("exit_reason"), "종료"),
        "mfePct": _num(r.get("mfe_pct")), "maePct": _num(r.get("mae_pct")),
    }


# ── 종합 평가 (결정적·근거 필수) ─────────────────────────────────────────────
def _contributions(snap, initial):
    """그날 마지막 스냅샷의 종목별 평가손익 기여도.

    equity_curve 행에 positions(종목별 mark·수량·진입가)가 기록된 날에만 계산한다.
    기록이 없는 날은 **추정하지 않고** None을 돌려준다(빈 값을 지어내지 않는다).
    """
    pos = (snap or {}).get("positions")
    if not isinstance(pos, dict) or not pos:
        return None
    out = []
    for sym, p in pos.items():
        mark, qty, entry = _num(p.get("mark")), _num(p.get("qty")), _num(p.get("entry"))
        if None in (mark, qty, entry) or qty <= 0 or entry <= 0:
            continue
        pnl = (mark - entry) * qty
        out.append({
            "symbol": sym, "name": p.get("name") or sym,
            "pnl": round(pnl),
            "returnPct": round((mark / entry - 1) * 100, 2),
            # 시작자금 대비 몇 %p를 끌어올렸/내렸는지 — 자산 변동 기여도
            "equityImpactPct": round(pnl / initial * 100, 3) if initial else None,
        })
    out.sort(key=lambda x: x["pnl"], reverse=True)
    return out


def _market_change_pct(market_daily, day, prev_day, key="KOSPI"):
    """그날 지수 변화율 — 두 날짜의 저장된 종가가 모두 있을 때만."""
    a = (market_daily.get(prev_day) or {}).get(key) if prev_day else None
    b = (market_daily.get(day) or {}).get(key)
    if not a or not b:
        return None
    return round((b / a - 1) * 100, 2)


def build_review(day, snap, buys, sells, contribs, daily_change_pct,
                 market_pct, initial, is_today, closed_total=None):
    """그날 데이터만으로 만드는 종합 평가.

    반환 구조: {"version", "inProgress", "headline", "sections":[{key,title,lines}]}
    각 line은 {"text", "fact"} — fact는 이 문장이 어떤 저장값에서 나왔는지의 이름이다.
    fact 없이 만들어지는 문장은 없다(= 근거 없는 원인 서술이 구조적으로 불가능).
    """
    L = lambda text, fact: {"text": text, "fact": fact}
    sections = []
    realized = sum(s["realizedPnl"] for s in sells if s["realizedPnl"] is not None)
    equity = _num((snap or {}).get("markedEquity"))
    unreal = _num((snap or {}).get("unrealizedPnl"))

    # ① 결과 — 저장된 자산·손익 수치 그대로
    res = []
    if equity is not None and initial:
        cum = round((equity / initial - 1) * 100, 2)
        res.append(L(f"가상자산 {equity:,.0f}원 · 시작자금 대비 {cum:+.2f}%", "markedEquity"))
    if daily_change_pct is not None:
        res.append(L(f"전 기록일 대비 {daily_change_pct:+.2f}%", "dailyChangePct"))
    else:
        res.append(L("이전 기록일이 없어 일간 변화는 비교하지 않았습니다.", "noPreviousRecord"))
    if sells:
        res.append(L(f"확정 손익 {realized:+,.0f}원 (종료 {len(sells)}건)", "realizedPnl"))
        # 왜 팔렸는지는 성격이 전혀 다르다 — "판단이 매도로 바뀌어서"와 "기간이 다 돼서"는
        # 같은 종료가 아니다. 원장에 이미 있는 사유를 세어 그대로 적는다.
        by_reason = {}
        for s in sells:
            by_reason[s["exitReason"]] = by_reason.get(s["exitReason"], 0) + 1
        res.append(L("종료 사유 — " + " · ".join(f"{k} {v}건"
                                              for k, v in sorted(by_reason.items())),
                     "exitReasons"))
    else:
        res.append(L("이날 종료된 거래가 없어 확정 손익은 발생하지 않았습니다.", "noSells"))
    if unreal is not None:
        res.append(L(f"보유 손익 {unreal:+,.0f}원", "unrealizedPnl"))
    sections.append({"key": "result", "title": "결과", "lines": res})

    # ② 주요 영향 — 종목별 기여도 순위가 실제로 기록된 날에만
    imp = []
    if contribs:
        win = contribs[0] if contribs[0]["pnl"] > 0 else None
        lose = contribs[-1] if contribs[-1]["pnl"] < 0 else None
        if lose:
            imp.append(L(f"{lose['name']} {lose['returnPct']:+.2f}% "
                         f"({lose['pnl']:+,.0f}원)이 손실에 가장 크게 기여했습니다.",
                         "largestDetractor"))
        if win:
            imp.append(L(f"{win['name']} {win['returnPct']:+.2f}% "
                         f"({win['pnl']:+,.0f}원)이 가장 크게 만회했습니다.",
                         "largestContributor"))
        up = sum(1 for c in contribs if c["pnl"] > 0)
        dn = sum(1 for c in contribs if c["pnl"] < 0)
        flat = len(contribs) - up - dn
        imp.append(L(f"보유 {len(contribs)}종목 중 {up}종목 상승 · {dn}종목 하락"
                     + (f" · {flat}종목 보합" if flat else ""), "advancersDecliners"))
        if not win and not lose:
            imp.append(L("모든 보유 종목이 진입가와 같아 손익 기여가 없습니다.", "allFlat"))
    # 청산한 거래는 "얼마에 팔았나"보다 "최고점에서 얼마나 돌려주고 팔았나"가 더 구체적이다.
    # mfe/mae는 청산할 때 이미 원장에 저장돼 있는데 지금까지 문장으로 쓰이지 않았다.
    givebacks = [(round(s["mfePct"] - s["returnPct"], 2), s) for s in sells
                 if s.get("mfePct") is not None and s.get("returnPct") is not None]
    if givebacks:
        gap, s = max(givebacks, key=lambda x: x[0])
        # ⚠️ mfePrice는 진입가로 시작하므로, 진입가 위로 한 번도 안 간 손실 거래는
        #    mfePct가 0.0이 된다. 그대로 쓰면 "최고 +0.00%까지 올랐다가"처럼 관측된
        #    적 없는 고점을 서술하게 된다(2026-08-21 검수에서 실제로 재현됨).
        #    실제로 진입가 위로 올라간 적이 있을 때만 '반납'을 말한다.
        if gap > 0 and s["mfePct"] > 0:
            # 종목명 뒤에 조사를 붙이지 않는다 — 받침에 따라 은/는이 갈려
            # "삼성전자은" 같은 문장이 나온다.
            imp.append(L(f"{s['name']} — 보유 중 최고 {s['mfePct']:+.2f}%까지 올랐다가 "
                         f"{s['returnPct']:+.2f}%에 종료(고점 대비 {gap:.2f}%p 반납).",
                         "exitGiveback"))
    dips = [s for s in sells if s.get("maePct") is not None and s.get("returnPct") is not None]
    if dips:
        d = min(dips, key=lambda s: s["maePct"])
        if d["maePct"] < 0:
            imp.append(L(f"{d['name']} — 보유 중 최저 {d['maePct']:+.2f}%까지 내렸다가 "
                         f"{d['returnPct']:+.2f}%로 종료.", "exitDrawdown"))
    if not contribs:
        imp.append(L("이 날짜에는 종목별 기여도 기록이 남아 있지 않아 "
                     "어떤 종목이 손익을 이끌었는지는 계산하지 않았습니다.", "noPositionSnapshot"))
    sections.append({"key": "impact", "title": "주요 영향", "lines": imp})

    # ③ 시장 비교 — 저장된 지수값이 있을 때만. 없으면 "없다"고 말한다.
    mk = []
    if market_pct is not None and daily_change_pct is not None:
        gap = round(daily_change_pct - market_pct, 2)
        mk.append(L(f"코스피 {market_pct:+.2f}% 대비 {gap:+.2f}%p "
                    + ("앞섰습니다." if gap > 0 else "뒤졌습니다." if gap < 0 else "같았습니다."),
                    "benchmarkRelative"))
    elif market_pct is not None:
        mk.append(L(f"코스피는 {market_pct:+.2f}%였습니다.", "benchmarkOnly"))
    else:
        mk.append(L("이 날짜의 지수 기록이 없어 시장 대비 비교는 하지 않았습니다.",
                    "noBenchmark"))
    # 위 비교는 계좌 전체를 코스피 하나와 견준 것이다. 종료된 거래에는 각자 자기 시장
    # (코스피/코스닥) 기준 성적이 이미 원장에 저장돼 있으므로, 그것도 함께 적는다.
    rel = [(round(s["returnPct"] - s["benchmarkReturnPct"], 2), s) for s in sells
           if s.get("returnPct") is not None and s.get("benchmarkReturnPct") is not None]
    if rel:
        ahead = sum(1 for gap, _ in rel if gap > 0)
        mk.append(L(f"이날 종료한 {len(rel)}건 중 {ahead}건이 같은 기간 자기 시장 지수보다 "
                    "앞섰습니다.", "tradeBenchmarkCount"))
        gap, s = max(rel, key=lambda x: x[0])
        # 앞선 거래가 하나도 없는데 "가장 앞선 거래"라고 쓰면 거짓이 된다
        # (0건이 앞섰다고 적어 놓고 바로 아래에 -4.8%p를 '가장 앞선'이라 부르던 문제).
        if gap > 0:
            mk.append(L(f"가장 앞선 거래 — {s['name']} 지수 대비 {gap:+.2f}%p.",
                        "tradeBenchmarkBest"))
    sections.append({"key": "market", "title": "시장 비교", "lines": mk})

    # ④ 잘된 점 / ⑤ 아쉬운 점 — 수치 근거가 있을 때만 쓴다
    good, bad = [], []
    if contribs:
        up = [c for c in contribs if c["pnl"] > 0]
        dn = [c for c in contribs if c["pnl"] < 0]
        if up:
            good.append(L(f"상승 종목 {len(up)}개가 합계 {sum(c['pnl'] for c in up):+,.0f}원을 "
                          "보탰습니다.", "advancerSum"))
        if dn and len(dn) >= max(1, len(contribs) * 0.6):
            bad.append(L(f"보유 {len(contribs)}종목 중 {len(dn)}종목이 진입가 아래입니다.",
                         "decliner Majority".replace(" ", "")))
        if dn and contribs[-1]["equityImpactPct"] is not None and len(dn) > 1:
            share = abs(contribs[-1]["pnl"]) / abs(sum(c["pnl"] for c in dn)) * 100
            if share >= 40:
                bad.append(L(f"손실의 {share:.0f}%가 {contribs[-1]['name']} 한 종목에 "
                             "몰려 있습니다.", "lossConcentration"))
    realized_wins = [s for s in sells if (s["realizedPnl"] or 0) > 0]
    realized_losses = [s for s in sells if (s["realizedPnl"] or 0) < 0]
    if realized_wins:
        good.append(L(f"종료한 거래 {len(realized_wins)}건이 이익으로 확정됐습니다.",
                      "realizedWins"))
    if realized_losses:
        bad.append(L(f"종료한 거래 {len(realized_losses)}건이 손실로 확정됐습니다.",
                     "realizedLosses"))
    if market_pct is not None and daily_change_pct is not None:
        (good if daily_change_pct >= market_pct else bad).append(
            L("같은 날 시장보다 " + ("잘 방어했습니다." if daily_change_pct >= market_pct
                                  else "부진했습니다."), "benchmarkRelative"))
    if not good:
        good.append(L("이날 기록만으로는 잘된 점을 꼽기 어렵습니다.", "insufficientEvidence"))
    if not bad:
        bad.append(L("이날 기록만으로는 아쉬운 점을 꼽기 어렵습니다.", "insufficientEvidence"))
    sections.append({"key": "good", "title": "잘된 점", "lines": good})
    sections.append({"key": "bad", "title": "아쉬운 점", "lines": bad})

    # ⑥ 다음에 확인할 점 — 특정 종목 매매 지시가 아니라 "관찰 항목"만 쓴다
    watch = []
    if buys and not sells:
        watch.append(L("이날 진입한 종목이 3~5거래일 구간에서 회복되는지 확인할 필요가 "
                       "있습니다.", "buysWithoutSells"))
    if contribs and contribs[-1]["pnl"] < 0:
        watch.append(L(f"{contribs[-1]['name']}처럼 손실 기여가 큰 종목이 다음 기록에서도 "
                       "반복되는지 볼 필요가 있습니다.", "largestDetractor"))
    if sells:
        watch.append(L("종료된 거래의 보유기간별 결과가 쌓이면 전략 인사이트에서 "
                       "구간별 비교가 가능해집니다.", "sellsRecorded"))
    # 매일 똑같은 문장이 붙던 자리다. 지금까지 몇 건이 종료됐는지 실제 숫자를 넣어
    # 얼마나 남았는지 보이게 하고, 표본이 다 차면 이 문장 자체를 없앤다.
    if closed_total is None or closed_total < MIN_STRATEGY_SAMPLE:
        have = "확인 중" if closed_total is None else f"{closed_total}건"
        watch.append(L(f"지금까지 종료된 거래는 {have}입니다. 전략의 좋고 나쁨을 말하려면 "
                       f"최소 {MIN_STRATEGY_SAMPLE}건이 필요해 아직 판단하지 않습니다.",
                       "smallSample"))
    if not watch:
        # 표본이 다 찬 뒤 매매도 기여도도 없는 조용한 날 — 화면에 제목만 남고 내용이
        # 비는 것을 막는다(섹션 제목은 무조건 그려지기 때문).
        watch.append(L("이날은 새로 확인할 만한 변화가 기록되지 않았습니다.", "quietDay"))
    sections.append({"key": "watch", "title": "다음 기록에서 확인할 점", "lines": watch})

    headline = None
    if equity is not None and initial:
        headline = f"가상자산 {round((equity / initial - 1) * 100, 2):+.2f}%"
    return {"version": REVIEW_VERSION, "inProgress": bool(is_today),
            "headline": headline, "sections": sections}


# ── 전략 분류 (사후 분석 전용 태그) ──────────────────────────────────────────
def classify_holding(days):
    """실제 보유 거래일 수 → 분석용 bucket. 엔진을 바꾸는 태그가 아니다.

    엔진의 최대 보유기간(5거래일)을 넘는 거래는 현재 전략이 만들 수 없으므로
    '기타'로 남기고, 중기·장기를 실행 중인 전략처럼 보여주지 않는다.
    """
    if days is None:
        return None
    for key, _label, _desc, lo, hi in STRATEGY_BUCKETS:
        if lo <= days <= hi:
            return key
    return "other"


def _stats(rows, gated=False):
    """gated=True면 성과 결론을 숫자로 내지 않는다(건수·실현손익·보유일수는 사실이라 유지).

    ⚠️ 게이트 기준은 **bucket별 표본이 아니라 전체 청산 표본**이다. 그래야 보유 화면의
       게이트(paper_engine.MIN_CLOSED_FOR_EVIDENCE)와 정확히 같은 시점에 함께 열려,
       "보유 화면은 표본 부족인데 기록 탭은 승률 100%"라는 모순이 생기지 않는다.
       bucket 사이의 우열 선언은 별도로 각 bucket의 enough 플래그가 막는다.
    """
    rets = [r["returnPct"] for r in rows if r["returnPct"] is not None]
    rel = [round(r["returnPct"] - r["benchmarkReturnPct"], 3) for r in rows
           if r["returnPct"] is not None and r["benchmarkReturnPct"] is not None]
    hold = [r["holdingTradingDays"] for r in rows if r["holdingTradingDays"] is not None]
    mfe = [r["mfePct"] for r in rows if r["mfePct"] is not None]
    mae = [r["maePct"] for r in rows if r["maePct"] is not None]
    avg = lambda a: round(sum(a) / len(a), 2) if a else None
    med = None
    if rets:
        s = sorted(rets)
        n = len(s)
        med = round(s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2, 2)
    wins = [r for r in rets if r > 0]
    # 🔒 표본 게이트 — 청산 표본이 MIN_STRATEGY_SAMPLE 미만이면 성과 결론을 숫자로 내지 않는다.
    # build_strategy()가 "우승 전략 선언"만 막고 있었는데, 정작 각 bucket의 승률·평균수익률은
    # 그대로 나가서 기록 탭에 "2건 · 평균 +3.00% · 승률 100%"가 찍혔다. 보유 화면은
    # "표본 부족"이라고 하는데 기록 탭은 승률 100%를 보여주는 모순이 실제로 재현됐다.
    # paper_engine.EVIDENCE_GATED_FIELDS와 같은 원칙이다: 일부만 막으면 구멍이 남는다.
    # ⚠️ tradeCount·realizedPnl·avgHoldingTradingDays는 서술 지표라 막지 않는다
    #    (몇 건인지·실제로 얼마를 벌거나 잃었는지는 사실이고, 성과 "결론"이 아니다).
    return {
        "tradeCount": len(rows),
        "winRatePct": None if gated else (round(len(wins) / len(rets) * 100, 1) if rets else None),
        "avgReturnPct": None if gated else avg(rets),
        "medianReturnPct": None if gated else med,
        "avgRelativeReturnPct": None if gated else avg(rel),
        "avgHoldingTradingDays": avg(hold),
        "avgMfePct": None if gated else avg(mfe),
        "avgMaePct": None if gated else avg(mae),
        "realizedPnl": sum(r["realizedPnl"] for r in rows
                           if r["realizedPnl"] is not None) or 0,
    }


def build_strategy(all_sells):
    """종료된 거래를 실제 보유기간 bucket으로 묶어 비교한다.

    ⚠️ 표본이 MIN_STRATEGY_SAMPLE 미만이면 어떤 bucket도 우승 전략으로 선언하지
       않는다(2~3건으로 "스윙이 최고" 같은 결론 금지). 항상 표본 수를 함께 싣는다.
    ⚠️ 이 통계는 관찰용이다. paper_engine의 보유기간 규칙을 자동으로 바꾸지 않는다.
    """
    by = {k: [] for k, *_ in STRATEGY_BUCKETS}
    by["other"] = []
    for s in all_sells:
        b = classify_holding(s.get("holdingTradingDays"))
        if b:
            by[b].append(s)
    # 전체 청산 표본이 최소치 미만이면 모든 bucket의 성과 결론을 숫자로 내지 않는다.
    # (bucket별로 따로 재면 총 20건인데 12/8로 갈린 경우까지 막혀 화면이 비어버린다.)
    total_closed = sum(len(by[k]) for k, *_ in STRATEGY_BUCKETS)
    gated = total_closed < MIN_STRATEGY_SAMPLE
    buckets = []
    for key, label, desc, lo, hi in STRATEGY_BUCKETS:
        st = _stats(by[key], gated=gated)
        buckets.append({"key": key, "label": label, "desc": desc,
                        "enough": st["tradeCount"] >= MIN_STRATEGY_SAMPLE, **st})
    total = sum(b["tradeCount"] for b in buckets)
    return {
        "buckets": buckets,
        "otherCount": len(by["other"]),
        "totalClosed": total,
        "minSample": MIN_STRATEGY_SAMPLE,
        "enough": total >= MIN_STRATEGY_SAMPLE,
        "maxHoldingTradingDays": 5,
        # 현재 엔진이 만들 수 없는 구간은 "추후 별도 전략 필요"로만 남긴다
        "unsupported": [{"label": "중기", "desc": "수 주 이상 보유"},
                        {"label": "장기", "desc": "수 개월 이상 보유"}],
        "note": ("현재 검증 중인 전략은 한 종목을 최대 5거래일까지만 보유합니다. "
                 "그보다 긴 구간의 성과는 이 기록으로 알 수 없습니다."),
    }


def gap_record(day):
    """관측 공백 날짜 — 숫자를 하나도 지어내지 않고 '기록이 없다'는 사실만 남긴다.

    ⚠️ 이 행은 거래일이 맞는데(공식 캘린더가 open이라고 답한 날) 러너가 그날
       기록을 남기지 못했다는 뜻이다. 자산·손익을 0으로 채우면 "그날 0원을 벌었다"로
       읽히므로 전부 None으로 둔다 — 0과 '모름'은 다르다.
    """
    return {
        "date": day, "noRecord": True, "lastRecordAt": None, "inProgress": False,
        "equity": None, "cash": None, "investedCostBasis": None,
        "markedPositionsValue": None, "realizedPnl": None, "unrealizedPnl": None,
        "openCount": None, "cumulativeReturnPct": None, "dailyChangePct": None,
        "marketChangePct": None, "buyCount": 0, "sellCount": 0,
        "buys": [], "sells": [], "skipped": [], "contributions": None,
        "review": {"version": REVIEW_VERSION, "inProgress": False, "headline": None,
                   "sections": [{"key": "result", "title": "결과", "lines": [
                       {"text": "이 거래일에는 자동 기록이 남지 않아 자산·매매 기록이 "
                                "없습니다. 없는 값을 채우지 않기 때문에 빈 날로 둡니다.",
                        "fact": "noObservationRecorded"}]}]},
    }


def build(ledger, curve, config, today=None, market_daily=None, business_dates=None):
    """전체 History 산출물. 원본 두 파일만으로 언제든 다시 만들 수 있다.

    business_dates를 주면(공식 캘린더가 확인한 거래일 목록) 기록이 통째로 빠진
    거래일을 '관측 공백' 행으로 드러낸다. 주지 않으면 기존과 똑같이 동작한다.
    """
    initial = config.get("initial_cash_krw", 10_000_000)
    market_daily = market_daily if market_daily is not None else load_market_daily()
    today = today or datetime.now(KST).strftime("%Y-%m-%d")

    buys, sells, skips = split_events(ledger)
    buys_by, sells_by, skips_by = {}, {}, {}
    for r in buys:
        d = buy_date(r)
        if d:
            buys_by.setdefault(d, []).append(r)
    for r in sells:
        d = sell_date(r)
        if d:
            sells_by.setdefault(d, []).append(r)
    for r in skips:
        d = kst_date(r.get("recorded_at") or r.get("detected_at"))
        if d:
            skips_by.setdefault(d, []).append(r)

    # 날짜별 마지막 '유효' 스냅샷 — 하루에 사이클이 몇 번이든 Daily Record는 1개.
    snap_by = {}
    for row in curve:
        d = kst_date(row.get("at"))
        if not d:
            continue
        if _num(row.get("markedEquity")) is None:
            continue                      # 평가 불가 사이클은 대표값으로 쓰지 않는다
        prev = snap_by.get(d)
        if prev is None or str(row.get("at")) >= str(prev.get("at")):
            snap_by[d] = row

    # ⚠️ snap_by는 '평가 가능한' 행만 담는다(markedEquity가 없는 행은 대표값에서 뺀다).
    #    그것만으로 관측 여부를 판정하면, 사이클은 정상적으로 돌았지만 평가만 실패한 날을
    #    "자동 기록이 남지 않았다"고 잘못 말하게 된다. 관측 여부는 paper_engine의
    #    observation_gaps와 같은 기준(그날 행이 하나라도 있는가)으로 판정한다.
    curve_days = {kst_date(row.get("at")) for row in curve if isinstance(row, dict)}
    curve_days.discard(None)
    observed = set(buys_by) | set(sells_by) | set(skips_by) | set(snap_by) | curve_days
    # 🕳️ 관측 공백 — 거래일인데 아무 기록도 남지 않은 날을 '없는 채로' 두지 않는다.
    #    목록이 그냥 이전 날짜로 건너뛰면 사용자는 그날이 왜 없는지 알 수 없다.
    #    ⚠️ 날짜를 하드코딩하지 않는다 — 공식 캘린더가 준 거래일과 실제 기록의 차이로만 뽑는다.
    #    ⚠️ 기록이 시작된 날 이전과 오늘은 공백으로 단정하지 않는다(아직 진행 중이다).
    gap_set = set()
    if business_dates and observed:
        first = min(observed)
        gap_set = {d for d in business_dates if first < d < today and d not in observed}

    days = sorted(observed | gap_set)
    records, prev_equity, prev_equity_day, all_sells_pub = [], None, None, []
    for d in days:
        if d in gap_set:
            records.append(gap_record(d))
            continue          # 공백 날은 자산 흐름(prev_equity)에 끼어들지 않는다
        snap = snap_by.get(d)
        equity = _num((snap or {}).get("markedEquity"))
        db = public_buy
        b = [db(r) for r in sorted(buys_by.get(d, []),
                                   key=lambda x: str(x.get("simulated_fill_at") or ""))]
        s = [public_sell(r) for r in sorted(sells_by.get(d, []),
                                            key=lambda x: str(x.get("exit_at") or ""))]
        all_sells_pub.extend(s)
        sk = {}
        for r in skips_by.get(d, []):
            lab = SKIP_REASON_KO.get(r.get("status"), "기타 사유")
            sk[lab] = sk.get(lab, 0) + 1
        # 일간 변화는 '이전 기록일 자산' 대비 — 첫 기록일은 0%를 지어내지 않고 None
        daily = (round((equity / prev_equity - 1) * 100, 2)
                 if equity is not None and prev_equity else None)
        # 시장 비교의 기준일은 '직전 기록일'이 아니라 '직전에 자산이 기록된 날'이다.
        # 일간 변화(dailyChangePct)와 같은 구간을 봐야 둘을 나란히 놓고 비교할 수 있다.
        prev_day = prev_equity_day
        contribs = _contributions(snap, initial)
        mkt = _market_change_pct(market_daily, d, prev_day)
        rec = {
            "date": d,
            "noRecord": False,
            "lastRecordAt": kst_hm((snap or {}).get("at")),
            "inProgress": d == today,
            "equity": equity,
            "cash": _num((snap or {}).get("cash")),
            "investedCostBasis": _num((snap or {}).get("positionsCost")),
            "markedPositionsValue": _num((snap or {}).get("markedPositionsValue")),
            "realizedPnl": _num((snap or {}).get("realizedPnl")),
            "unrealizedPnl": _num((snap or {}).get("unrealizedPnl")),
            "openCount": _num((snap or {}).get("openCount")),
            "cumulativeReturnPct": (round((equity / initial - 1) * 100, 2)
                                    if equity is not None and initial else None),
            "dailyChangePct": daily,
            "marketChangePct": mkt,
            "buyCount": len(b), "sellCount": len(s),
            "buys": b, "sells": s,
            "skipped": [{"reason": k, "count": v} for k, v in sorted(sk.items())],
            "contributions": contribs,
            "review": build_review(d, snap, b, s, contribs, daily, mkt, initial,
                                   is_today=(d == today),
                                   closed_total=len(all_sells_pub)),
        }
        records.append(rec)
        if equity is not None:
            prev_equity = equity
            prev_equity_day = d

    records.reverse()                     # 최근 날짜가 위
    return {
        "schemaVersion": HISTORY_SCHEMA,
        "reviewVersion": REVIEW_VERSION,
        "generatedAt": datetime.now(KST).isoformat(timespec="seconds"),
        "initialVirtualCash": initial,
        "maxHoldingTradingDays": config.get("maxHoldingTradingDays", 5),
        "days": records,
        "strategy": build_strategy(all_sells_pub),
    }
