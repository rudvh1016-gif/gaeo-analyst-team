#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""업종 흐름에서 고른 종목 (rotation_picks.js) 생성기.

왜 별도 파일인가
  rotation_snapshot.js는 421KB다. 홈 첫 화면에서 그걸 받게 하면 모바일이
  느려진다. 홈이 실제로 쓰는 값만 2KB 안팎으로 추려 따로 쓴다.

무엇을 만드나
  ① 시장 게이트 - 코스피/코스닥이 20일선 위인지 + 전체 종목의 20일선 상회 비율로
     오늘 몇 종목을 보여줄지(N) 정한다. 둘 다 20일선 아래이고 확산도까지 낮으면
     0으로 두고 화면은 "관망"을 띄운다.
  ② 종목 랭킹 - 후보군 안에서 20거래일 수익률 z점수 0.7 + 소속 업종 순환매 z점수 0.3.
     업종당 최대 2종목.
  ③ 근거 문장 - 이동평균/거래량/업종 순위를 사람이 읽는 문장으로.

⚠️ 성적 숫자(적중률 등)는 여기서 만들지 않는다. rotation_snapshot.js의
   horizonPerformance["20"]을 그대로 실어 나른다. 화면이 하드코딩하면
   모델이 갱신됐을 때 화면만 거짓말을 하게 된다.

⚠️ 이 목록은 GAEO Score(BUY/HOLD/SELL)와 별개다. 서로의 값을 바꾸지 않는다.
"""
import json, re, os, subprocess, sys
from datetime import datetime, timezone, timedelta

KST = timezone(timedelta(hours=9))
ROOT = os.path.dirname(os.path.abspath(__file__))

MAX_PICKS = 4          # 화면 설계상 상한(모바일 스크롤). 늘리지 말 것.
SECTOR_CAP = 2         # 한 업종에서 최대 몇 개(자리가 넉넉할 때)


def sector_cap_for(n):
    """보여줄 자리 수 n에 맞는 '한 업종 최대 개수'.

    🐛 2026-08-20: 자리가 2개로 줄어드는 날(시장 게이트가 조일 때) 상한 2가 그대로
       적용돼 한 업종이 두 자리를 다 가져갈 수 있었다. 그러면 화면에는 한 업종만
       남아 "골고루 보인다"는 이 코너의 목적이 사라진다.
       자리가 3개 미만이면 업종당 1개로 조여 최소 2개 업종이 섞이게 한다.
    ⚠️ 점수·랭킹 산식은 건드리지 않는다. 같은 순위에서 무엇을 담을지만 정한다.
    """
    return SECTOR_CAP if n >= 3 else 1
W_STOCK, W_SECTOR = 0.70, 0.30
WEAK_SECTOR_TAIL = 6   # 순환매 하위 N개 업종은 후보에서 뺀다
OVERHEAT_GAP = 30.0    # 20일선 대비 이 이상이면 "과열" 라벨
Z_CLAMP = 3.0          # z점수를 자르는 지점. 바꾸기 전에 zscores() 주석을 읽을 것.


def load_js(path, var):
    """브라우저용 js 파일에서 객체 하나를 꺼낸다(node 경유)."""
    # 일부 파일은 window.X = ...로 쓰고 일부는 const X = ...로 쓴다. 둘 다 받는다.
    code = (
        "const fs=require('fs');globalThis.window=globalThis.window||{};"
        f"const s=fs.readFileSync({json.dumps(path)},'utf8');"
        f"const v=new Function('window',s+';return typeof {var}!==\"undefined\"?{var}:window.{var};')(globalThis.window);"
        "process.stdout.write(JSON.stringify(v));"
    )
    out = subprocess.run(["node", "-e", code], capture_output=True, cwd=ROOT)
    if out.returncode != 0:
        raise RuntimeError(f"{path} 읽기 실패: {out.stderr.decode()[:200]}")
    return json.loads(out.stdout.decode())


def flatten_days(entry):
    """price_history / index_history의 page 구조를 날짜순 하나로 편다."""
    days = []
    for page in entry or []:
        days.extend(page.get("days") or [])
    days.sort(key=lambda d: d.get("date") or "")
    return days


def closes(days):
    return [float(d["close"]) for d in days if d.get("close") is not None]


def ma(vals, n):
    return sum(vals[-n:]) / n if len(vals) >= n else None


def ret_pct(vals, n):
    if len(vals) <= n or vals[-n - 1] == 0:
        return None
    return (vals[-1] / vals[-n - 1] - 1) * 100


def zscores(xs):
    """±Z_CLAMP에서 자른 z점수.

    ⚠️ 이 클램프는 실제로 자주 걸린다. 함부로 "버그"로 보고 고치지 말 것.
       20거래일 수익률 분포는 오른쪽으로 길어서, 우리가 뽑는 상위권 종목이
       바로 클램프에 닿는 구간이다. 그래서 예를 들어 +79.6%와 +99.2%가 똑같이
       3.0을 받고, 둘의 순서는 업종 성분(가중 0.3)이 정하게 된다.

    측정 (599종목 x 298거래일, 5거래일마다 리밸런스, 20거래일 보유, 43회):
      하드 ±3(현행)  적중 62.8%  초과평균 +7.82%p
      하드 ±2.5      적중 67.4%  초과평균 +7.71%p
      하드 ±1        적중 58.1%  초과평균 +9.62%p
      클램프 없음     적중 67.4%  초과평균 +7.39%p
      소프트(tanh)   적중 58.1%  초과평균 +6.77%p
      순위 정규화     적중 48.8%  초과평균 +4.05%p   <- 확실히 나쁘다
      무작위 4종목    적중 51.2%  초과평균 +3.03%p
    순위 정규화만 빼면 전부 한 잡음 구간(58~67%) 안이라, 표본 43회(그마저 날짜가
    겹친다)로는 우열을 가릴 수 없다. 반면 클램프를 손대면 상위 4종목 구성이
    43일 중 33일(77%)에서 바뀐다. 이득이 측정되지 않는데 목록의 3/4를 바꾸는
    변경이라 현행을 유지한다. 표본이 2~3년으로 늘면 다시 재볼 것.

    동점 자체가 만드는 "순서가 뒤죽박죽" 문제는 산식이 아니라 select_picks()의
    결정적 타이브레이크로 푼다.
    """
    n = len(xs)
    if n < 2:
        return [0.0] * n
    m = sum(xs) / n
    var = sum((x - m) ** 2 for x in xs) / (n - 1)
    sd = var ** 0.5
    if sd == 0:
        return [0.0] * n
    return [max(-Z_CLAMP, min(Z_CLAMP, (x - m) / sd)) for x in xs]


def market_gate(index_above_ma20, breadth):
    """오늘 몇 종목까지 보여줄지(N). 0이면 목록을 비우고 이유를 화면에 쓴다.

    index_above_ma20: 코스피/코스닥 중 20일선 위인 지수의 수 (0~2)
    breadth:          전체 추적 종목 중 20일선 위 비율 (0.0~1.0)
    """
    G, B = index_above_ma20, breadth
    if G == 2 and B >= 0.55:
        return MAX_PICKS
    if G == 2 and B >= 0.40:
        return 3
    if G == 1 or (G == 2 and B < 0.40):
        return 2
    return 0


def select_picks(cands, n):
    """후보에서 최종 목록을 고른다. 파일 입출력 없이 순수하게 계산한다.

    cands: {code,name,sector,r20,gapPct,volRatio,secScore,secRank,call} 목록
    정렬 키가 (-총점, -20일수익률, 코드)인 이유:
      z점수가 ±Z_CLAMP에서 자주 동점이 되기 때문에(zscores 주석 참고) 총점만으로
      정렬하면 같은 업종의 두 종목 순서가 입력 순서에 따라 매번 달라진다.
      같은 점수면 실제로 더 오른 종목을 앞에 두고, 그것마저 같으면 코드로 고정해
      같은 입력이면 항상 같은 목록이 나오게 한다.
    """
    if n <= 0 or not cands:
        return []
    z20 = zscores([c["r20"] for c in cands])
    zsec = zscores([c["secScore"] for c in cands])
    for c, a, b in zip(cands, z20, zsec):
        c["rfs"] = W_STOCK * a + W_SECTOR * b
    ordered = sorted(cands, key=lambda c: (-c["rfs"], -c["r20"], c["code"]))

    cap = sector_cap_for(n)
    picks, used = [], {}
    for c in ordered:
        if len(picks) >= n:
            break
        if used.get(c["sector"], 0) >= cap:
            continue
        used[c["sector"]] = used.get(c["sector"], 0) + 1
        # ⚠️ "업종 흐름 N위"는 카드 오른쪽 칸에 이미 있으므로 여기서 반복하지 않는다.
        why = [f"20거래일 +{c['r20']:.1f}%", "20일선 위"]
        if c.get("volRatio") and c["volRatio"] >= 1.3:
            why.append(f"거래량 평소의 {c['volRatio']:.1f}배")
        picks.append({
            "code": c["code"], "name": c["name"], "sector": c["sector"],
            "sectorRank": c["secRank"],
            "why": " · ".join(why),
            "overheat": c["gapPct"] >= OVERHEAT_GAP,
            "gapPct": round(c["gapPct"], 1),
            "call": c.get("call"),
            # GAEO Score가 SELL인데 이 목록에 오른 경우. 숨기지 않고 화면에 그대로 띄운다.
            # 두 산식이 서로 다른 것을 보고 있다는 사실 자체가 읽는 사람에게 정보다.
            "callConflict": c.get("call") == "SELL",
        })
    return picks


def main():
    snap = load_js("rotation_snapshot.js", "ROTATION_SNAPSHOT")
    live = load_js("data.js", "LIVE_DATA")
    tick = load_js("tickers.js", "TICKERS")
    ph = load_js("price_history.js", "PRICE_HISTORY")
    ih = load_js("index_history.js", "INDEX_HISTORY")
    auto = (load_js("auto_analysis.js", "LIVE_AUTO") or {}).get("stocks") or {}

    sector_of = {t["code"]: t.get("sector") for t in tick if t.get("code")}
    name_of = {t["code"]: t.get("name") for t in tick if t.get("code")}

    # ── ① 시장 게이트 ──────────────────────────────────────────────
    gate_detail = {}
    G = 0
    for key in ("KOSPI", "KOSDAQ"):
        cs = closes(flatten_days(ih.get(key)))
        m20 = ma(cs, 20)
        above = bool(cs and m20 and cs[-1] > m20)
        G += 1 if above else 0
        gate_detail[key] = {
            "close": round(cs[-1], 2) if cs else None,
            "ma20": round(m20, 2) if m20 else None,
            "above": above,
            "gapPct": round((cs[-1] / m20 - 1) * 100, 2) if cs and m20 else None,
        }

    # 전체 종목의 20일선 상회 비율(확산도)
    stock_closes, above_cnt, tot_cnt = {}, 0, 0
    for code in live.get("stocks", {}):
        cs = closes(flatten_days(ph.get(code)))
        if len(cs) < 61:
            continue
        stock_closes[code] = cs
        m20 = ma(cs, 20)
        if m20:
            tot_cnt += 1
            if cs[-1] > m20:
                above_cnt += 1
    B = (above_cnt / tot_cnt) if tot_cnt else 0.0

    N = market_gate(G, B)

    # ── ② 업종 순환매 20일 점수 ─────────────────────────────────────
    sec_score = {}
    for s in snap.get("sectors") or []:
        p20 = ((s.get("periods") or {}).get("20") or {})
        if s.get("name") and p20.get("score") is not None:
            sec_score[s["name"]] = float(p20["score"])
    ranked = sorted(sec_score.items(), key=lambda kv: -kv[1])
    sec_rank = {nm: i + 1 for i, (nm, _) in enumerate(ranked)}
    weak = {nm for nm, _ in ranked[-WEAK_SECTOR_TAIL:]} if len(ranked) > WEAK_SECTOR_TAIL else set()

    # ── ③ 후보 필터 ────────────────────────────────────────────────
    cands = []
    for code, cs in stock_closes.items():
        sec = sector_of.get(code)
        if not sec or sec not in sec_score or sec in weak:
            continue
        m20, m60 = ma(cs, 20), ma(cs, 60)
        r20 = ret_pct(cs, 20)
        if not (m20 and m60 and r20 is not None):
            continue
        if not (cs[-1] > m20 and cs[-1] > m60 and r20 > 0):
            continue
        st = live["stocks"].get(code) or {}
        if st.get("stale"):
            continue
        days = flatten_days(ph.get(code))
        vols = [float(d.get("volume") or 0) for d in days][-21:]
        vbase = sum(vols[:-1]) / max(1, len(vols) - 1) if len(vols) > 1 else 0
        vratio = (vols[-1] / vbase) if vbase else None
        gap = (cs[-1] / m20 - 1) * 100
        cands.append({
            "code": code, "name": name_of.get(code) or st.get("name") or code,
            "sector": sec, "r20": r20, "gapPct": gap,
            "volRatio": vratio, "secScore": sec_score[sec], "secRank": sec_rank[sec],
            "call": ((auto.get(code) or {}).get("chief") or {}).get("call"),
        })

    picks = select_picks(cands, N)

    perf = ((snap.get("horizonPerformance") or {}).get("20") or {})
    regime = snap.get("marketRegime") or {}
    out = {
        "schemaVersion": 1,
        "status": "ready" if picks else "hold",
        "generatedAt": datetime.now(KST).strftime("%Y-%m-%d %H:%M"),
        "dataCutoff": snap.get("dataCutoff"),
        "horizonDays": 20,
        "picks": picks,
        "gate": {
            "indexAboveMa20": G,
            "breadthPct": round(B * 100, 1),
            "shown": len(picks), "allowed": N,
            "sectorCap": sector_cap_for(N),
            # 실제로 몇 개 업종이 섞였는지. 상한이 제 일을 했는지 사후에 확인하는 값이다.
            "sectorCount": len({p["sector"] for p in picks}),
            "detail": gate_detail,
        },
        "regime": {
            "direction": regime.get("direction"),
            # KOSPI/KOSDAQ은 화면에 영문으로 나가면 안 된다(사용자용 이름 규칙).
            "leadership": {"KOSPI": "코스피", "KOSDAQ": "코스닥"}.get(
                regime.get("leadership"), regime.get("leadership")),
            "topSector": ranked[0][0] if ranked else None,
        },
        # 성적은 rotation 모델이 스스로 채점한 값을 그대로 옮긴다(하드코딩 금지).
        "record": {
            "hitRate": perf.get("hitRate"),
            "excessMean": perf.get("averageExcessReturn"),
            "sampleCount": perf.get("sampleCount"),
            "periodStart": perf.get("periodStart"),
            "periodEnd": perf.get("periodEnd"),
            "benchmark": perf.get("benchmark"),
        },
    }

    body = ("// 자동 생성: compute_rotation_picks.py · 업종 흐름에서 고른 종목(홈)\n"
            "// ⚠️ rotation_snapshot.js(421KB)를 홈에서 받지 않으려고 따로 둔 경량 요약본이다.\n"
            "// ⚠️ record의 성적 숫자는 rotation 모델이 스스로 채점한 값이며 여기서 만들지 않는다.\n"
            "window.ROTATION_PICKS = " + json.dumps(out, ensure_ascii=False, indent=1) + ";\n")
    with open(os.path.join(ROOT, "rotation_picks.js"), "w", encoding="utf-8") as f:
        f.write(body)

    print(f"rotation_picks.js 생성 완료 — 게이트 G={G} 확산도={B*100:.1f}% "
          f"허용 {N}개 / 실제 {len(picks)}개")
    for p in picks:
        flag = " [과열]" if p["overheat"] else ""
        flag += " [GAEO는 SELL]" if p["callConflict"] else ""
        print(f"  {p['name']}({p['code']}) {p['sector']} 업종{p['sectorRank']}위 "
              f"20일선 +{p['gapPct']}%{flag} · GAEO {p['call']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
