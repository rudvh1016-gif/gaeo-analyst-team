"""Display-only recent-price context. Never imported into score calculations."""
import bisect
import math

OVERHEAT_RET5_PCT = 10.0
OVERHEAT_RET20_PCT = 25.0
# Retained for historical diagnostics, NOT a warning trigger.
OVERHEAT_VOL20_PCT = 4.0
OVERHEAT_VERSION = "surge-only-2026-09-05c"


def finite_number(value):
    return (float(value) if isinstance(value, (int, float))
            and not isinstance(value, bool) and math.isfinite(value) else None)


def overheat_flag(entry):
    """Compatibility field: overheat once again means surge only.

    A missing untriggered input cannot establish absence of both triggers.
    Volatility remains descriptive context and the existing RISK path is intact.
    """
    tech = (entry or {}).get("tech") or {}
    risk = (entry or {}).get("risk") or {}
    r5, r20 = (finite_number(tech.get(k)) for k in ("ret5", "ret20"))
    vol = finite_number(risk.get("vol20"))
    triggers = [k for k, value, threshold in
                (("ret5", r5, OVERHEAT_RET5_PCT), ("ret20", r20, OVERHEAT_RET20_PCT))
                if value is not None and value >= threshold]
    complete = r5 is not None and r20 is not None
    available = bool(triggers) or complete
    return dict(available=available, complete=complete, warn=bool(triggers),
                level="caution" if triggers else ("none" if complete else "unknown"),
                ret5=round(r5, 4) if r5 is not None else None,
                ret20=round(r20, 4) if r20 is not None else None,
                vol20=round(vol, 2) if vol is not None else None,
                thresholds=dict(ret5=OVERHEAT_RET5_PCT, ret20=OVERHEAT_RET20_PCT),
                triggers=triggers, version=OVERHEAT_VERSION,
                note=("최근 상승률 조건에 해당합니다. 이후 하락을 예측하거나 손실 방어 효과를 확인한 것은 아닙니다."
                      if triggers else ("최근 상승률 조건에 해당하지 않습니다. 안전하다는 뜻은 아닙니다."
                                        if complete else "최근 상승률 자료가 부족해 조건 해당 여부를 판정하지 않았습니다.")))


def known_closes(rows, day, base):
    """Sorted dated candles, strictly before day plus the known decision price.

    Never read the final decision-day close for an intraday decision. If there is
    no candle on day, do not invent a trading session or duplicate the stale close.
    Historical adjustments/availability cannot be certified by a current snapshot.
    """
    base = finite_number(base)
    if base is None or base <= 0:
        return []
    dates = [r["date"] for r in rows]
    i = bisect.bisect_left(dates, day)
    past = [finite_number(r.get("close")) for r in rows[:i]]
    if any(v is None or v <= 0 for v in past):
        return []
    if i < len(rows) and dates[i] == day:
        return past + [base]
    return past if past and past[-1] == base else []


def vol20_at(rows, day, base):
    """Population SD of up to 20 simple daily % returns; requires 6 closes.
    Live risk_for has the same minimum and divisor (ddof=0). Unrounded value.
    For intraday base the last interval is partial, not a completed daily return.
    """
    cl = known_closes(rows, day, base)
    if len(cl) < 6:
        return None
    values = [(cl[i]/cl[i-1]-1)*100 for i in range(1,len(cl))][-20:]
    mean = sum(values)/len(values)
    return math.sqrt(sum((v-mean)**2 for v in values)/len(values))


def historical_flag(rows, day, base):
    cl = known_closes(rows, day, base)
    ret = lambda n: (cl[-1]-cl[-n-1])/cl[-n-1]*100 if len(cl)>n else None
    return overheat_flag({"tech": {"ret5": ret(5), "ret20": ret(20)},
                          "risk": {"vol20": vol20_at(rows, day, base)}})
