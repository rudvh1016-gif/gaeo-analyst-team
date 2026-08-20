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
SECTOR_CAP = 2         # 한 업종에서 최대 몇 개
W_STOCK, W_SECTOR = 0.70, 0.30
WEAK_SECTOR_TAIL = 6   # 순환매 하위 N개 업종은 후보에서 뺀다
OVERHEAT_GAP = 30.0    # 20일선 대비 이 이상이면 "과열" 라벨


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
    n = len(xs)
    if n < 2:
        return [0.0] * n
    m = sum(xs) / n
    var = sum((x - m) ** 2 for x in xs) / (n - 1)
    sd = var ** 0.5
    if sd == 0:
        return [0.0] * n
    return [max(-3.0, min(3.0, (x - m) / sd)) for x in xs]


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

    if G == 2 and B >= 0.55:
        N = MAX_PICKS
    elif G == 2 and B >= 0.40:
        N = 3
    elif G == 1 or (G == 2 and B < 0.40):
        N = 2
    else:
        N = 0

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

    picks = []
    if N > 0 and cands:
        z20 = zscores([c["r20"] for c in cands])
        zs = zscores([c["secScore"] for c in cands])
        for c, a, b in zip(cands, z20, zs):
            c["rfs"] = W_STOCK * a + W_SECTOR * b
        cands.sort(key=lambda c: -c["rfs"])
        used = {}
        for c in cands:
            if len(picks) >= N:
                break
            if used.get(c["sector"], 0) >= SECTOR_CAP:
                continue
            used[c["sector"]] = used.get(c["sector"], 0) + 1
            # ⚠️ "업종 흐름 N위"는 카드 오른쪽 칸에 이미 있으므로 여기서 반복하지 않는다.
            why = [f"20거래일 +{c['r20']:.1f}%", "20일선 위"]
            if c["volRatio"] and c["volRatio"] >= 1.3:
                why.append(f"거래량 평소의 {c['volRatio']:.1f}배")
            picks.append({
                "code": c["code"], "name": c["name"], "sector": c["sector"],
                "sectorRank": c["secRank"],
                "why": " · ".join(why),
                "overheat": c["gapPct"] >= OVERHEAT_GAP,
                "gapPct": round(c["gapPct"], 1),
                "call": c["call"],
            })

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
        print(f"  {p['name']}({p['code']}) {p['sector']} 업종{p['sectorRank']}위 "
              f"20일선 +{p['gapPct']}%{flag} · GAEO {p['call']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
