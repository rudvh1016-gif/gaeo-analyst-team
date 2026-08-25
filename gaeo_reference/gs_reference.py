# -*- coding: utf-8 -*-
"""GS Reference Check — GAEO의 위험 지표 계산을 4단으로 교차검증하는 검산 실험실.

무엇을 하나
    같은 주가 시계열 하나를 놓고 네 가지 방법으로 같은 숫자를 구해 본다.
      ① 수학적 기대값(closed-form) : 답을 미리 아는 인공 시계열로 만든 정답
      ② GAEO 계산                  : compute_indicators.risk_for() 실제 코드
      ③ 독립 구현(numpy/pandas)    : 없으면 파이썬 표준 라이브러리로 다시 계산
      ④ 외부 참조(gs_quant)        : Goldman Sachs GS Quant의 timeseries 함수
    네 값이 서로 어긋나면 GAEO 계산에 의심할 부분이 있다는 뜻이다.

⚠️ 정의가 다른 것을 '틀렸다'고 하지 않는다 (이게 이 파일의 핵심)
    GAEO vol20 : 최근 20거래일 일간 수익률의 **모집단 표준편차(ddof=0)**, 퍼센트,
                 연율화 없음.
    GS  vol    : **표본 표준편차(ddof=1)** × √252(연율화) × 100(퍼센트).
    그래서 비교 전에 반드시 정의를 맞춘다:
        gs_daily_ddof0 = gs_vol / sqrt(252) * sqrt((n-1)/n)
    GAEO mdd3m : 퍼센트(음수), 소수 1자리 반올림.
    GS  mdd    : 분수(fraction). 비교 전 ×100.

상태는 PASS / WARN / N/A 세 개뿐이다
    라이브러리가 없거나 데이터가 없으면 N/A다. 외부 라이브러리 장애가 GAEO
    Production을 RED로 만들면 안 된다. 불일치는 WARN이고, 그 자체로 어떤
    Candidate도 만들지 않는다(이 모듈은 gaeo_evolution을 import하지 않는다).

네트워크·인증 0
    gs_quant.timeseries의 순수 계산 함수만 쓴다. GsSession·API 키·요청이 없다.
"""
import argparse
import datetime
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_DIR = os.path.join(HERE, "state")

DEFAULT_ANALYSIS_DATA = os.path.join(ROOT, "analysis_data.json")
DEFAULT_OUT = os.path.join(STATE_DIR, "gs_reference_latest.json")

KST = datetime.timezone(datetime.timedelta(hours=9))

STATUS_PASS = "PASS"
STATUS_WARN = "WARN"
STATUS_NA = "N/A"

TRADING_DAYS = 252          # GS volatility의 기본 연율화 계수(실측 확인)
VOL_WINDOW = 20             # GAEO risk_for가 쓰는 수익률 개수
MDD_WINDOW = 63             # GAEO risk_for가 쓰는 종가 개수(약 3개월)

# 허용 오차 — '정의 차이'가 아니라 '반올림 폭'에서만 나온다.
#   vol20 : compute_indicators가 round(x, 2) → 최대 오차 0.005. 부동소수 잡음 여유 포함.
#   mdd3m : compute_indicators가 round(x, 1) → 최대 오차 0.05. 여유 포함.
#   ret   : 양쪽 다 반올림하지 않으므로 부동소수 오차만 허용.
TOL_VOL = 0.006
TOL_MDD = 0.06
TOL_RET = 1e-9

DEFAULT_REAL_SAMPLES = 5


# ── ④ 외부 참조 가용성 ───────────────────────────────────────────────────────
def gs_available():
    """gs_quant.timeseries를 순수 계산용으로 import할 수 있는가.

    실패해도 예외를 밖으로 던지지 않는다 — 이 검산은 '있으면 좋은 것'이지
    Production 의존성이 아니다.
    """
    try:
        import gs_quant                                   # noqa: F401
        from gs_quant.timeseries import volatility        # noqa: F401
        from gs_quant.timeseries import max_drawdown      # noqa: F401
        from gs_quant.timeseries import returns           # noqa: F401
        from gs_quant.timeseries import Window, Returns   # noqa: F401
        import pandas                                     # noqa: F401
        version = getattr(gs_quant, "__version__", None)
        return True, {"available": True, "version": version, "detail": "timeseries only"}
    except Exception as e:
        return False, {"available": False, "version": None,
                       "detail": "%s: %s" % (type(e).__name__, str(e)[:120])}


# ── 정의 정합 변환 ───────────────────────────────────────────────────────────
def gs_vol_to_gaeo_daily(gs_vol, n):
    """GS 연율화 표본변동성(%) → GAEO 정의(일간·모집단·%)로 환산.

    gs_vol = std(rets, ddof=1) * sqrt(252) * 100  (rets는 분수)
    GAEO   = std(rets, ddof=0) * 100
    ⇒ GAEO = gs_vol / sqrt(252) * sqrt((n-1)/n)
    """
    if gs_vol is None or not n or n < 2:
        return None
    return gs_vol / math.sqrt(TRADING_DAYS) * math.sqrt((n - 1.0) / n)


def gs_mdd_to_pct(gs_mdd):
    """GS max_drawdown은 분수(-0.018182)를 준다. GAEO는 퍼센트(-1.8)를 쓴다."""
    return None if gs_mdd is None else gs_mdd * 100.0


# ── ② GAEO 실제 계산 ─────────────────────────────────────────────────────────
def gaeo_metrics(closes):
    """compute_indicators.risk_for()를 그대로 호출한다(복제 구현 금지)."""
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    import compute_indicators
    daily = [{"close": c} for c in closes]
    risk = compute_indicators.risk_for(daily, None)
    if not risk:
        return None
    return {"vol20": risk.get("vol20"), "mdd3m": risk.get("mdd3m")}


# ── ③ 독립 구현 ──────────────────────────────────────────────────────────────
def independent_engine():
    try:
        import numpy    # noqa: F401
        return "numpy"
    except Exception:
        return "python-stdlib"


def independent_metrics(closes):
    """GAEO 코드와 무관하게 처음부터 다시 계산한다. numpy가 있으면 numpy로."""
    rets = simple_returns_pct(closes)
    tail = rets[-VOL_WINDOW:] if len(rets) >= VOL_WINDOW else rets
    window = closes[-MDD_WINDOW:]
    engine = independent_engine()
    if engine == "numpy":
        import numpy as np
        vol = float(np.std(np.asarray(tail, dtype=float), ddof=0))
        arr = np.asarray(window, dtype=float)
        peaks = np.maximum.accumulate(arr)
        mdd = float(np.min(arr / peaks - 1.0) * 100.0)
    else:
        import statistics
        mean = statistics.fmean(tail)
        vol = math.sqrt(sum((r - mean) ** 2 for r in tail) / len(tail))
        peak, mdd = window[0], 0.0
        for c in window:
            peak = max(peak, c)
            mdd = min(mdd, (c / peak - 1.0) * 100.0)
    return {"vol20": vol, "mdd3m": mdd, "engine": engine}


def simple_returns_pct(closes):
    return [(closes[i] / closes[i - 1] - 1.0) * 100.0 for i in range(1, len(closes))]


# ── ④ gs_quant 계산 ──────────────────────────────────────────────────────────
def gs_metrics(closes):
    """gs_quant.timeseries만 쓴다. 세션·인증·네트워크 없음. 실패하면 None."""
    try:
        import pandas as pd
        from gs_quant.timeseries import (volatility, max_drawdown, returns,
                                         Window, Returns)
        idx = pd.bdate_range("2000-01-03", periods=len(closes))
        series = pd.Series([float(c) for c in closes], index=idx)

        n_ret = min(VOL_WINDOW, len(closes) - 1)
        vol_raw = float(volatility(series, Window(n_ret, 0),
                                   returns_type=Returns.SIMPLE).iloc[-1])

        window = closes[-MDD_WINDOW:]
        w_series = pd.Series([float(c) for c in window], index=idx[-len(window):])
        mdd_raw = float(max_drawdown(w_series, Window(len(window), 0)).iloc[-1])

        ret_raw = returns(series, 1, Returns.SIMPLE)
        last_rets = [float(x) * 100.0 for x in ret_raw.iloc[-3:]]
        return {"volAnnualizedPct": vol_raw, "mddFraction": mdd_raw,
                "lastReturnsPct": last_rets, "returnObs": n_ret}
    except Exception as e:
        return {"error": "%s: %s" % (type(e).__name__, str(e)[:120])}


# ── ① 수학적 기대값을 아는 인공 시계열 ──────────────────────────────────────
def _series_constant_growth(rate=0.01, n=80, start=100.0):
    """매일 정확히 같은 비율로 오르는 시계열.
    수익률이 전부 같으므로 표준편차 = 0, 낙폭도 0. (closed-form: vol=0, mdd=0)"""
    closes = [start]
    for _ in range(n):
        closes.append(closes[-1] * (1 + rate))
    return closes


def _series_alternating(rate=0.02, n=80, start=100.0):
    """+r, -r 이 정확히 번갈아 나오는 시계열.
    마지막 20개 수익률은 +r 10개 · -r 10개라 평균 0, 모집단 표준편차 = r.
    (closed-form: vol = r*100 [%], mdd는 닫힌 형태가 없어 비교만 한다)"""
    closes = [start]
    for i in range(n):
        closes.append(closes[-1] * (1 + rate if i % 2 == 0 else 1 - rate))
    return closes


def _series_single_drawdown(up=0.01, drop=0.10, n_up=40, start=100.0):
    """계속 오르다가 마지막에 정확히 drop만큼 한 번 떨어지는 시계열.
    고점 바로 다음에 떨어지므로 최대낙폭 = -drop*100 [%]. (closed-form)"""
    closes = [start]
    for _ in range(n_up):
        closes.append(closes[-1] * (1 + up))
    closes.append(closes[-1] * (1 - drop))
    return closes


def closed_form_cases():
    return [
        {"name": "constant_growth_1pct", "kind": "closed_form",
         "closes": _series_constant_growth(0.01, 80),
         "expected": {"vol20": 0.0, "mdd3m": 0.0},
         "why": "매일 같은 비율 상승 → 수익률 분산 0, 고점 갱신만 하므로 낙폭 0"},
        {"name": "alternating_2pct", "kind": "closed_form",
         "closes": _series_alternating(0.02, 80),
         "expected": {"vol20": 2.0, "mdd3m": None},
         "why": "마지막 20개 수익률이 +2% 10개·-2% 10개 → 평균 0, 모집단 표준편차 2.0"},
        {"name": "single_drawdown_10pct", "kind": "closed_form",
         "closes": _series_single_drawdown(0.01, 0.10, 40),
         "expected": {"vol20": None, "mdd3m": -10.0},
         "why": "고점 직후 정확히 10% 하락 한 번 → 최대낙폭 -10.0%"},
    ]


def real_data_cases(path=DEFAULT_ANALYSIS_DATA, limit=DEFAULT_REAL_SAMPLES):
    """실제 GAEO 일봉으로도 같은 검산을 한다. 종목 선택은 결정론(코드 오름차순)."""
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
    except Exception:
        return []
    stocks = doc.get("stocks") or {}
    cases = []
    for code in sorted(stocks.keys()):
        if len(cases) >= limit:
            break
        daily = (stocks[code] or {}).get("daily") or []
        closes = [float(d["close"]) for d in daily
                  if isinstance(d, dict) and d.get("close")]
        if len(closes) < MDD_WINDOW + 1:
            continue
        cases.append({"name": "real:%s" % code, "kind": "real_data",
                      "closes": closes, "expected": {"vol20": None, "mdd3m": None},
                      "why": "analysis_data.json 실제 일봉 %d개" % len(closes)})
    return cases


# ── 비교 ─────────────────────────────────────────────────────────────────────
def _diff(a, b):
    if a is None or b is None:
        return None
    return abs(a - b)


def compare_case(case, want_gs):
    closes = case["closes"]
    gaeo = gaeo_metrics(closes)
    indep = independent_metrics(closes)
    gs = gs_metrics(closes) if want_gs else None
    gs_error = (gs or {}).get("error") if isinstance(gs, dict) else None

    n_ret = min(VOL_WINDOW, len(closes) - 1)
    gs_vol_aligned = None
    gs_mdd_aligned = None
    if gs and not gs_error:
        gs_vol_aligned = gs_vol_to_gaeo_daily(gs.get("volAnnualizedPct"), n_ret)
        gs_mdd_aligned = gs_mdd_to_pct(gs.get("mddFraction"))

    metrics = {}
    for key, tol, expected in (("vol20", TOL_VOL, case["expected"].get("vol20")),
                               ("mdd3m", TOL_MDD, case["expected"].get("mdd3m"))):
        gaeo_v = (gaeo or {}).get(key)
        indep_v = indep.get(key)
        gs_v = gs_vol_aligned if key == "vol20" else gs_mdd_aligned
        diffs = {
            "closedForm_vs_gaeo": _diff(expected, gaeo_v),
            "gaeo_vs_independent": _diff(gaeo_v, indep_v),
            "gaeo_vs_gs": _diff(gaeo_v, gs_v),
        }
        measured = [d for d in diffs.values() if d is not None]
        max_diff = max(measured) if measured else None
        if max_diff is None:
            verdict = STATUS_NA
        elif max_diff <= tol:
            verdict = STATUS_PASS
        else:
            verdict = STATUS_WARN
        metrics[key] = {
            "closedForm": expected, "gaeo": gaeo_v,
            "independent": None if indep_v is None else round(indep_v, 9),
            "gsRaw": (gs or {}).get("volAnnualizedPct" if key == "vol20"
                                    else "mddFraction") if gs and not gs_error else None,
            "gsAligned": None if gs_v is None else round(gs_v, 9),
            "diffs": {k: (None if v is None else round(v, 12)) for k, v in diffs.items()},
            "tolerance": tol, "verdict": verdict,
        }

    # 일간 수익률 자체도 대조한다(정의 차이 없음 — GS는 분수, GAEO는 퍼센트).
    ret_verdict = STATUS_NA
    ret_diff = None
    if gs and not gs_error:
        mine = simple_returns_pct(closes)[-3:]
        theirs = gs.get("lastReturnsPct") or []
        if len(mine) == len(theirs) and mine:
            ret_diff = max(abs(a - b) for a, b in zip(mine, theirs))
            ret_verdict = STATUS_PASS if ret_diff <= TOL_RET else STATUS_WARN
    metrics["dailyReturn"] = {"maxAbsDiffPct": ret_diff, "tolerance": TOL_RET,
                              "verdict": ret_verdict}

    return {"name": case["name"], "kind": case["kind"], "why": case["why"],
            "closeCount": len(closes), "returnObs": n_ret,
            "independentEngine": indep.get("engine"),
            "gsError": gs_error, "metrics": metrics}


def build_report(*, cases=None, now=None, analysis_data=DEFAULT_ANALYSIS_DATA,
                 real_samples=DEFAULT_REAL_SAMPLES):
    now = now or datetime.datetime.now(KST)
    ok, gs_info = gs_available()
    if cases is None:
        cases = closed_form_cases() + real_data_cases(analysis_data, real_samples)

    results = [compare_case(c, want_gs=ok) for c in cases]

    verdicts = []
    for r in results:
        verdicts += [m["verdict"] for m in r["metrics"].values()]
    warn_n = sum(1 for v in verdicts if v == STATUS_WARN)
    pass_n = sum(1 for v in verdicts if v == STATUS_PASS)

    if not ok:
        status = STATUS_NA
        reason = ("gs_quant를 불러올 수 없어 외부 참조 검산을 건너뛴다. "
                  "이것은 GAEO Production 문제가 아니다.")
    elif not results or pass_n == 0:
        status = STATUS_NA
        reason = "검산할 데이터가 없다."
    elif warn_n:
        status = STATUS_WARN
        reason = "정의를 맞춘 뒤에도 허용 오차를 넘는 항목이 %d건 있다." % warn_n
    else:
        status = STATUS_PASS
        reason = "정의를 맞춘 뒤 %d개 항목이 전부 허용 오차 안에서 일치한다." % pass_n

    mismatches = []
    for r in results:
        for key, m in r["metrics"].items():
            if m["verdict"] == STATUS_WARN:
                mismatches.append({"case": r["name"], "metric": key,
                                   "diffs": m.get("diffs"),
                                   "maxAbsDiffPct": m.get("maxAbsDiffPct"),
                                   "tolerance": m.get("tolerance"),
                                   "action": "기록만 한다. Candidate를 만들지 않는다."})

    return {
        "schemaVersion": 1,
        "generatedAt": now.astimezone(KST).isoformat(timespec="seconds"),
        "status": status,
        "reason": reason,
        "gsQuant": gs_info,
        "independentEngine": independent_engine(),
        "isProductionDependency": False,
        "networkCalls": 0,
        "credentialsUsed": False,
        "candidatesCreated": 0,
        "definitionAlignment": {
            "vol20": ("GAEO=ddof0·일간·%; GS=ddof1·√252 연율화·%. "
                      "gs_daily_ddof0 = gs_vol / sqrt(252) * sqrt((n-1)/n) 로 맞춘 뒤 비교."),
            "mdd3m": "GAEO=퍼센트(소수1자리 반올림); GS=분수. gs*100 으로 맞춘 뒤 비교.",
            "dailyReturn": "GAEO=퍼센트; GS=분수. gs*100 으로 맞춘 뒤 비교.",
            "note": "정의 차이는 불일치가 아니다. 맞춘 뒤에도 남는 차이만 WARN으로 센다.",
        },
        "tolerances": {"vol20": TOL_VOL, "mdd3m": TOL_MDD, "dailyReturn": TOL_RET,
                       "basis": "compute_indicators.risk_for의 반올림 자릿수(2·1)에서 온 값"},
        "caseCount": len(results),
        "checkPass": pass_n,
        "checkWarn": warn_n,
        "checkNA": sum(1 for v in verdicts if v == STATUS_NA),
        "mismatches": mismatches,
        "cases": results,
        "note": ("검산 전용이다. 여기 숫자는 GAEO 판단·점수·가중치에 들어가지 않고, "
                 "사용자 화면에도 노출되지 않는다."),
    }


def write_json(path, doc):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Reference Lab: 위험 지표 4단 교차검증")
    p.add_argument("--out", default=DEFAULT_OUT)
    p.add_argument("--analysis-data", default=DEFAULT_ANALYSIS_DATA)
    p.add_argument("--real-samples", type=int, default=DEFAULT_REAL_SAMPLES)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    report = build_report(analysis_data=args.analysis_data,
                          real_samples=args.real_samples)
    if not args.dry_run:
        write_json(args.out, report)
    print("[gs-reference] status=%s (%s)" % (report["status"], report["reason"]))
    print("  외부 참조: %s · 독립 구현: %s · 케이스 %d개 · 일치 %d · 불일치 %d · 미측정 %d"
          % (report["gsQuant"], report["independentEngine"], report["caseCount"],
             report["checkPass"], report["checkWarn"], report["checkNA"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
