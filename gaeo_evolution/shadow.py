# -*- coding: utf-8 -*-
"""Shadow Recorder — Champion(실전 판단) 옆에서 Challenger(후보)를 같은 시험지로 기록한다.

무엇인가:
  현재 GAEO 판단은 사용자에게 그대로 나간다. 동시에 후보(Challenger)도 '같은 날 ·
  같은 종목 · 같은 판단시점 입력'으로 "나라면 BUY/HOLD/SELL"을 기록만 한다.
  이 기록은 사용자 화면과 실전 Production 판단에 어떤 영향도 주지 않는다.

공정 비교 원칙:
  · Challenger 판단은 leakage.decision_view(결과 필드 물리 제거)로만 계산한다.
  · Champion도 같은 시뮬 함수로 재판정한 champSim을 함께 기록해, Gate 비교는
    "같은 함수 · 같은 입력"의 champSim vs challenger로 한다(완전 대칭).
    실전 기록 그대로의 champReal도 투명성을 위해 같이 남긴다(참고용).
  · Candidate 생성일(shadowStartDay) '이후' 판단일만 증거로 인정한다 —
    생성 전 데이터를 Shadow로 소급 생성하는 것은 코드가 거부한다.
  · 결과(outcome)는 판단일 이후 5번째 거래일 종가로만 성숙 처리하고,
    outcomeDate ≤ 판단일이면 LeakageError(FAIL CLOSED).
  · Candidate 핵심 설정이 바뀌면 같은 ledger를 쓸 수 없다(fingerprint 검증) —
    새 후보 = 새 ledger = Shadow Day 1부터 다시.

저장 위치: gaeo_evolution/registry/shadow/<candidateId>.json (autoCommitAllowlist 안).
민감정보·비밀정보는 저장하지 않는다(종목코드·판단·점수·수익률 집계 수준만).
"""
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from compute_model_intelligence import build_market_regimes, call_hit  # noqa: E402 — 의미 재사용
from build_model_scoreboard import _block_bootstrap_ci                 # noqa: E402 — CI 재사용

from gaeo_evolution import evaluation, leakage, registry               # noqa: E402

SHADOW_DIR = os.path.join(HERE, "registry", "shadow")
SCHEMA_VERSION = 1
HORIZON = 5


class ShadowIntegrityError(RuntimeError):
    """Ledger와 Candidate의 fingerprint가 다르다 — 다른 후보의 증거를 재사용할 수 없다."""


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def ledger_path(candidate_id, shadow_dir=SHADOW_DIR):
    safe = re.sub(r"[^A-Za-z0-9._+-]", "_", str(candidate_id))
    return os.path.join(shadow_dir, f"{safe}.json")


def _resolved_params(candidate, production):
    """후보의 '완전한 설정'(가중치+buyCut)을 생성시점 기준으로 확정한다.

    후보가 바꾸지 않은 값은 후보 spec의 baselineVersion에 동결된 기준값을 쓰고,
    그것도 없으면(외부 작성 spec) 지금 production 값을 동결하며 출처를 남긴다.
    """
    changes = candidate.get("parameterChanges") or {}
    frozen = (candidate.get("baselineVersion") or {})
    base_weights = frozen.get("baseWeights") or production["weights"]
    base_buy_cut = frozen.get("buyCutBaseline")
    base_buy_cut = base_buy_cut if base_buy_cut is not None else evaluation.BUY_CUT_BASELINE
    chall_buy_cut = changes.get("buyCut")           # falsy-0 함정 방지
    return (
        {"weights": changes.get("weights") or base_weights,
         "buyCut": chall_buy_cut if chall_buy_cut is not None else base_buy_cut},
        {"weights": base_weights, "buyCut": base_buy_cut},
        {"baseWeightsSource": ("candidate.baselineVersion(동결)" if frozen.get("baseWeights")
                               else f"ledger 생성 시 동결: {production.get('source')}")},
    )


def load_or_create_ledger(candidate, production, shadow_dir=SHADOW_DIR):
    """후보의 Shadow ledger를 연다. fingerprint가 다르면 예외 — 소급/재사용 금지."""
    fp = registry.candidate_fingerprint(candidate)
    if candidate.get("fingerprint") not in (None, fp):
        raise ShadowIntegrityError(
            f"후보 spec 변조 감지: {candidate.get('candidateId')} — 저장된 fingerprint와 "
            "핵심 설정이 일치하지 않습니다. 새 후보로 생성해야 합니다")
    path = ledger_path(candidate["candidateId"], shadow_dir)
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            led = json.load(f)
        if led.get("fingerprint") != fp:
            raise ShadowIntegrityError(
                f"Shadow ledger fingerprint 불일치: {candidate['candidateId']} — "
                "후보 설정이 달라졌다면 새 후보(새 ledger)로 시작해야 합니다")
        return led
    challenger, baseline, provenance = _resolved_params(candidate, production)
    led = {
        "schemaVersion": SCHEMA_VERSION,
        "candidateId": candidate["candidateId"],
        "experimentSerial": candidate.get("experimentSerial"),
        "fingerprint": fp,
        "paramHash": candidate.get("paramHash"),
        "baselineVersion": candidate.get("baselineVersion"),
        "shadowStartDay": str(candidate.get("createdAt", ""))[:10],
        "createdAt": _now(),
        "challengerParams": challenger,
        "baselineParams": baseline,
        "provenance": provenance,
        "outcomeDefinition": f"판단일 이후 {HORIZON}번째 거래일 종가 수익률(production_call_hit, deadband=1)",
        "rows": [],
        "appendLog": [],
    }
    return led


def save_ledger(led, shadow_dir=SHADOW_DIR):
    os.makedirs(shadow_dir, exist_ok=True)
    path = ledger_path(led["candidateId"], shadow_dir)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(led, f, ensure_ascii=False, separators=(",", ":"))
        f.write("\n")
    os.replace(tmp, path)
    return path


def append_rows(led, rows):
    """생성일 이후에 새로 쌓인 실전 행만 ledger에 추가한다(중복·소급 자동 차단).

    rows: evaluation.build_rows가 만든 forward-only 행(현재 Production 버전).
    Champion(champReal)은 그날 실전 판단 그대로, champSim/chall은 같은 시뮬 함수.
    반환: 추가된 행 수.
    """
    start = led.get("shadowStartDay") or "9999-12-31"
    have = {(r["day"], r["code"]) for r in led["rows"]}
    eligible = [r for r in rows
                if r["day"] > start and (r["day"], r["code"]) not in have]
    if not eligible:
        return 0
    champ_sim = evaluation.simulate_candidate(
        eligible, weights=led["baselineParams"]["weights"],
        buy_cut=led["baselineParams"]["buyCut"])
    chall_sim = evaluation.simulate_candidate(
        eligible, weights=led["challengerParams"]["weights"],
        buy_cut=led["challengerParams"]["buyCut"])
    champ_by_key = {(r["day"], r["code"]): r for r in champ_sim}
    src_by_key = {(r["day"], r["code"]): r for r in eligible}
    added = 0
    for c in chall_sim:                       # 시뮬 가능한 행(분석가 4인 점수 완비)만
        key = (c["day"], c["code"])
        champ = champ_by_key.get(key)
        if champ is None:
            continue
        source = src_by_key[key]
        led["rows"].append({
            "day": c["day"], "code": c["code"], "base": source.get("base"),
            "champReal": source.get("call"),
            "champSim": champ["call"], "champSimTotal": champ["total"],
            "chall": c["call"], "challTotal": c["total"],
            "ret5": None, "outcomeDate": None,
        })
        added += 1
    if added:
        led["appendLog"].append({"at": _now(), "rowsAdded": added})
        led["appendLog"] = led["appendLog"][-60:]
        led["rows"].sort(key=lambda r: (r["day"], r["code"]))
    return added


def mature_rows(led, closes):
    """성숙(결과 확정) 처리 — 판단일 이후 5번째 거래일 종가로만 계산한다."""
    matured = 0
    for row in led["rows"]:
        if row.get("ret5") is not None:
            continue
        series = closes.get(row["code"]) or []
        after = [r for r in series if r["date"] > row["day"]]
        if len(after) < HORIZON or not row.get("base"):
            continue
        out_date = after[HORIZON - 1]["date"]
        if str(out_date)[:10] <= row["day"]:
            raise leakage.LeakageError(
                f"Shadow 결과일이 판단일보다 이르다: {row['code']} {row['day']} → {out_date}")
        row["ret5"] = round((after[HORIZON - 1]["close"] / row["base"] - 1) * 100, 4)
        row["outcomeDate"] = out_date
        matured += 1
    return matured


def _precision(rows, call_key, total_key=None, want=("BUY", "SELL")):
    hit = n = 0
    for r in rows:
        call = r.get(call_key)
        if call not in want or r.get("ret5") is None:
            continue
        verdict = call_hit(call, r["ret5"])
        if verdict is None:
            continue
        n += 1
        hit += verdict
    return ((hit / n * 100) if n else None), n


def _brier(rows, total_key):
    s = n = 0
    for r in rows:
        if r.get("ret5") is None or r.get(total_key) is None:
            continue
        p = max(0.0, min(1.0, float(r[total_key]) / 100))
        target = 1 if r["ret5"] > 0 else 0
        s += (p - target) ** 2
        n += 1
    return (round(s / n, 4) if n else None)


def _large_error_pct(rows, call_key):
    big = n = 0
    for r in rows:
        call = r.get(call_key)
        if call not in ("BUY", "SELL") or r.get("ret5") is None:
            continue
        verdict = call_hit(call, r["ret5"])
        if verdict is None:
            continue
        n += 1
        if verdict == 0 and abs(r["ret5"]) >= evaluation.LARGE_ERROR_PCT:
            big += 1
    return (round(big / n * 100, 1) if n else None)


def prospective_metrics(led, closes=None):
    """Gate에 넘길 실전 Shadow 실측 — champSim vs challenger(완전 대칭 비교).

    성숙 행이 하나도 없으면 None(= gate가 BOOTSTRAP_SHADOW 유지).
    """
    matured = [r for r in led["rows"] if r.get("ret5") is not None]
    for row in matured:                      # 누출 재검증 — 저장 후 조작 감지
        if not row.get("outcomeDate") or str(row["outcomeDate"])[:10] <= row["day"]:
            raise leakage.LeakageError(
                f"Shadow 성숙 행의 outcomeDate가 판단일 이후가 아니다: "
                f"{row.get('code')} {row.get('day')} → {row.get('outcomeDate')}")
        if row["day"] <= (led.get("shadowStartDay") or "9999-12-31"):
            raise leakage.LeakageError(
                f"Shadow에 생성일({led.get('shadowStartDay')}) 이전 행이 있다: "
                f"{row.get('code')} {row.get('day')} — 소급 기록 금지")
    if not matured:
        return None
    days = sorted({r["day"] for r in matured})
    regimes = build_market_regimes(closes) if closes else {}
    regime_of = {d: (regimes.get(d) or {}).get("key") for d in days}

    chall_prec, chall_action_n = _precision(matured, "chall")
    champ_prec, champ_action_n = _precision(matured, "champSim")
    real_prec, _ = _precision(matured, "champReal")
    buy_prec_chall, buy_n = _precision(matured, "chall", want=("BUY",))
    buy_prec_champ, _ = _precision(matured, "champSim", want=("BUY",))
    sell_prec_chall, sell_n = _precision(matured, "chall", want=("SELL",))
    sell_prec_champ, _ = _precision(matured, "champSim", want=("SELL",))
    chall_brier = _brier(matured, "challTotal")
    champ_brier = _brier(matured, "champSimTotal")
    chall_large = _large_error_pct(matured, "chall")
    champ_large = _large_error_pct(matured, "champSim")

    direction = {"BUY": sum(1 for r in matured if r["chall"] == "BUY"),
                 "SELL": sum(1 for r in matured if r["chall"] == "SELL")}
    action_total = direction["BUY"] + direction["SELL"]

    by_day = {}
    for r in matured:
        by_day.setdefault(r["day"], []).append(r)

    def _day_delta(day_list):
        deltas = []
        for day in day_list:
            rows_d = by_day[day]
            c, cn = _precision(rows_d, "chall")
            b, bn = _precision(rows_d, "champSim")
            if c is not None and b is not None:
                deltas.append(c - b)
        return sum(deltas) / len(deltas) if deltas else None

    ci = (_block_bootstrap_ci({d: [d] for d in days}, _day_delta)
          if len(days) >= 5 else None)
    # 일평균 개선폭 — CI가 인증하는 통계량과 같은 정의(풀링 값과 함께 둘 다 본다).
    day_mean_gain = _day_delta(days)

    # 시장국면별 최악 악화폭 — 국면당 행동표본 10건 이상인 국면만 신뢰해 계산.
    regime_worst = None
    regime_detail = {}
    for key in sorted({v for v in regime_of.values() if v}):
        rows_r = [r for r in matured if regime_of.get(r["day"]) == key]
        c, cn = _precision(rows_r, "chall")
        b, bn = _precision(rows_r, "champSim")
        if c is not None and b is not None and min(cn, bn) >= 10:
            delta = round(c - b, 2)
            regime_detail[key] = {"deltaPp": delta, "challN": cn, "champN": bn}
            if regime_worst is None or delta < regime_worst:
                regime_worst = delta

    return {
        "n": len(matured),
        "actionN": chall_action_n,
        "testDays": len(days),
        "testRegimes": len({v for v in regime_of.values() if v}),
        "buyN": buy_n, "sellN": sell_n,
        "coveragePct": round(action_total / len(matured) * 100, 1) if matured else None,
        "directionSharePct": (round(max(direction.values()) / action_total * 100, 1)
                              if action_total else None),
        "challengerPrecisionPct": round(chall_prec, 2) if chall_prec is not None else None,
        "championPrecisionPct": round(champ_prec, 2) if champ_prec is not None else None,
        "championRealPrecisionPct": round(real_prec, 2) if real_prec is not None else None,
        "precisionGainPp": (round(chall_prec - champ_prec, 2)
                            if chall_prec is not None and champ_prec is not None else None),
        "precisionGainDayMeanPp": (round(day_mean_gain, 2)
                                   if day_mean_gain is not None else None),
        "realGainPp": (round(chall_prec - real_prec, 2)
                       if chall_prec is not None and real_prec is not None else None),
        "precisionGainCi95": ci,
        "brierGain": (round(champ_brier - chall_brier, 4)
                      if champ_brier is not None and chall_brier is not None else None),
        "buyPrecisionDeltaPp": (round(buy_prec_chall - buy_prec_champ, 2)
                                if buy_prec_chall is not None and buy_prec_champ is not None
                                else None),
        "sellPrecisionDeltaPp": (round(sell_prec_chall - sell_prec_champ, 2)
                                 if sell_prec_chall is not None and sell_prec_champ is not None
                                 else None),
        "largeErrorDeltaPp": (round(chall_large - champ_large, 2)
                              if chall_large is not None and champ_large is not None else None),
        "regimeWorstDeltaPp": regime_worst,
        "regimeDetail": regime_detail,
        "comparisonBasis": "champSim vs challenger — 같은 시뮬 함수·같은 입력(완전 대칭)",
        "shadowStartDay": led.get("shadowStartDay"),
        "windowStart": days[0], "windowEnd": days[-1],
    }


def public_summary(led):
    """공개 status용 집계 — 개별 종목 판단 상세는 싣지 않는다."""
    matured = sum(1 for r in led["rows"] if r.get("ret5") is not None)
    return {"candidateId": led["candidateId"], "rows": len(led["rows"]),
            "matured": matured, "pending": len(led["rows"]) - matured,
            "shadowStartDay": led.get("shadowStartDay")}
