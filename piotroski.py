#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Piotroski F-Score — "이 회사가 재무적으로 건실해지고 있는가" (2026-09-04 신설).

왜 필요한가
  DIANA는 지금까지 PER·PBR·ROE·선행PER·목표가괴리만 본다. 전부 **"싸냐 비싸냐"**다.
  "회사가 건실한가"를 재는 축이 없었다. 소유자 지적 그대로다.

원 논문
  Piotroski, J. D. (2000). "Value Investing: The Use of Historical Financial
  Statement Information to Separate Winners from Losers."
  Journal of Accounting Research 38 (Supplement), 1-41.
  9개 이분 신호를 더해 0~9점을 만든다.

⚠️ 이 파일이 지키는 규칙 (docs/gaeo_diana_v2_feature_registry.md와 동일)
  1. **없는 값을 0으로 만들지 않는다.** 신호를 못 구하면 그 신호는 빠지고,
     빠졌다는 사실을 그대로 보고한다.
  2. **신호가 하나라도 빠지면 0~9점 F-Score라고 부르지 않는다.** 9개를 다 못 채운
     점수를 "F-Score 7점"이라고 내놓으면 원 논문과 다른 것을 같은 이름으로 파는 것이다.
     그럴 때는 score=None으로 두고 availableSignals만 보고한다.
  3. **원 논문과 다른 계산은 PAPER_EXACT라고 부르지 않는다.** 아래 basis 표기 참조.
  4. 금융업은 유동/비유동 구분과 매출총이익 개념이 없어 해당 신호가 원래 성립하지
     않는다. 결측이 아니라 NOT_APPLICABLE로 구분한다.

⚠️ 지금은 점수를 화면이나 판단에 쓰지 않는다. 기록만 한다(shadow).
   검증 절차는 docs/gaeo_diana_v2_feature_registry.md를 따른다.
"""

NOT_AVAILABLE = "NOT_AVAILABLE"
NOT_APPLICABLE = "NOT_APPLICABLE_FINANCIAL_SECTOR"

# 신호별 계산 근거의 정직한 등급.
#   PAPER_EXACT — 원 논문과 분자·분모·시점이 같다
#   GAEO_PROXY  — 경제적 의도는 같지만 계산이 논문과 다르다
SIGNAL_BASIS = {
    "roaPositive": "PAPER_EXACT",
    "cfoPositive": "PAPER_EXACT",
    "dRoaPositive": "PAPER_EXACT",
    "accrualQuality": "PAPER_EXACT",
    # 논문은 '장기부채 / 평균 총자산'을 쓴다. DART 표준계정에 '장기차입금'이 따로
    # 없어 비유동부채로 대신한다 — 의도는 같지만 같은 값이 아니다.
    "dLeverageDown": "GAEO_PROXY",
    "dLiquidityUp": "PAPER_EXACT",
    # 논문은 '그 해에 보통주를 새로 발행했는가'다. 자본금 증가로 대신한다.
    # 무상증자·액면분할도 자본금을 늘릴 수 있어 완전히 같지는 않다.
    "noEquityOffer": "GAEO_PROXY",
    "dMarginUp": "PAPER_EXACT",
    "dTurnoverUp": "PAPER_EXACT",
}
SIGNAL_ORDER = ("roaPositive", "cfoPositive", "dRoaPositive", "accrualQuality",
                "dLeverageDown", "dLiquidityUp", "noEquityOffer",
                "dMarginUp", "dTurnoverUp")


def _num(values, key):
    """숫자면 float, 없거나 문자열 표식이면 None. 0은 유효한 값이므로 살린다."""
    v = (values or {}).get(key)
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        return None
    return float(v)


def _applicable(values, key):
    """'개념 부재'(금융업 등)인지 여부. 결측과 구분한다."""
    return (values or {}).get(key) != NOT_APPLICABLE


def _unwrap(x):
    return (x.get("values") if isinstance(x, dict) and "values" in x else x) or {}


def compute(current, prior, prior2=None, sector=None):
    """한 회사의 F-Score를 계산한다.

    current / prior / prior2: dart_pipeline.extract_financials()가 낸 {"values": {...}}
        또는 그 values 딕셔너리 자체. 각각 당기 · 직전기 · 전전기 회계연도다.

    ⚠️ **회계연도 3개가 필요하다.** 2개로는 F-Score를 완성할 수 없다.
       논문의 ΔROA와 Δ자산회전율은 분모로 '기초 총자산'(직전기말)을 쓴다. 그래서
       작년치를 계산하려면 전전기말 총자산이 또 필요하다.
         올해 회전율 = 매출_t   ÷ 총자산_{t-1}
         작년 회전율 = 매출_{t-1} ÷ 총자산_{t-2}   ← 전전기 자료
       prior2가 없으면 그 신호들은 '못 구함'으로 남고 score는 None이 된다.
       (없는 값을 현재 총자산으로 대신 채워 넣지 않는다 — 그건 다른 지표가 된다.)

    반환: {"score", "maxScore", "signals", "missing", "notApplicable", "basis", ...}
          신호를 하나라도 못 채우면 score는 None이다(규칙 2).
    """
    cur, pri, pri2 = _unwrap(current), _unwrap(prior), _unwrap(prior2)

    signals, missing, not_applicable, reasons = {}, [], [], {}

    def put(name, value, why=None):
        if value is None:
            signals[name] = None
            missing.append(name)
        else:
            signals[name] = bool(value)
        if why:
            reasons[name] = why

    def na(name, why):
        signals[name] = None
        not_applicable.append(name)
        reasons[name] = why

    ta_c, ta_p = _num(cur, "totalAssets"), _num(pri, "totalAssets")
    ta_pp = _num(pri2, "totalAssets")          # 전전기말 총자산 (ΔROA·Δ회전율의 분모)
    ni_c, ni_p = _num(cur, "netIncome"), _num(pri, "netIncome")
    cfo_c = _num(cur, "operatingCashFlow")

    # 1) ROA > 0 — 자산 대비 이익이 나는가. 논문은 기초(직전기말) 총자산을 분모로 쓴다.
    roa_c = (ni_c / ta_p) if (ni_c is not None and ta_p) else None
    roa_p = (ni_p / ta_pp) if (ni_p is not None and ta_pp) else None
    put("roaPositive", None if roa_c is None else roa_c > 0,
        "당기순이익 ÷ 직전기말 총자산 > 0")

    # 2) CFO > 0 — 장부이익이 아니라 실제로 현금이 들어오는가.
    cfo_scaled = (cfo_c / ta_p) if (cfo_c is not None and ta_p) else None
    put("cfoPositive", None if cfo_c is None else cfo_c > 0, "영업활동현금흐름 > 0")

    # 3) ΔROA > 0 — 수익성이 나아지고 있는가.
    put("dRoaPositive", None if (roa_c is None or roa_p is None) else roa_c > roa_p,
        "올해 ROA > 작년 ROA")

    # 4) CFO > ROA — 이익의 질. 현금이 뒷받침되지 않는 이익(발생액)을 걸러낸다.
    put("accrualQuality",
        None if (cfo_scaled is None or roa_c is None) else cfo_scaled > roa_c,
        "영업현금흐름/총자산 > ROA (발생액이 음수)")

    # 5) Δ레버리지 < 0 — 빚 의존도가 줄었는가. (논문: 장기부채/평균총자산)
    if not _applicable(cur, "nonCurrentLiabilities") or not _applicable(pri, "nonCurrentLiabilities"):
        na("dLeverageDown", "유동/비유동을 나누지 않는 재무제표라 비유동부채 개념이 없다")
    else:
        ncl_c, ncl_p = _num(cur, "nonCurrentLiabilities"), _num(pri, "nonCurrentLiabilities")
        lev_c = (ncl_c / ta_c) if (ncl_c is not None and ta_c) else None
        lev_p = (ncl_p / ta_p) if (ncl_p is not None and ta_p) else None
        put("dLeverageDown", None if (lev_c is None or lev_p is None) else lev_c < lev_p,
            "비유동부채/총자산이 작년보다 낮아짐 (논문의 장기부채 대신 비유동부채)")

    # 6) Δ유동비율 > 0 — 단기 지급능력이 나아졌는가.
    if not _applicable(cur, "currentAssets") or not _applicable(pri, "currentAssets"):
        na("dLiquidityUp", "유동/비유동을 나누지 않는 재무제표라 유동비율 개념이 없다")
    else:
        ca_c, cl_c = _num(cur, "currentAssets"), _num(cur, "currentLiabilities")
        ca_p, cl_p = _num(pri, "currentAssets"), _num(pri, "currentLiabilities")
        cr_c = (ca_c / cl_c) if (ca_c is not None and cl_c) else None
        cr_p = (ca_p / cl_p) if (ca_p is not None and cl_p) else None
        put("dLiquidityUp", None if (cr_c is None or cr_p is None) else cr_c > cr_p,
            "유동자산/유동부채가 작년보다 높아짐")

    # 7) 증자 없음 — 새 주식을 찍어 돈을 메우지 않았는가.
    cap_c, cap_p = _num(cur, "issuedCapital"), _num(pri, "issuedCapital")
    put("noEquityOffer", None if (cap_c is None or cap_p is None) else cap_c <= cap_p,
        "자본금이 늘지 않음 (논문의 신주발행 대신 자본금 증가로 판단)")

    # 8) Δ매출총이익률 > 0 — 파는 물건의 마진이 좋아졌는가.
    if not _applicable(cur, "grossProfit") or not _applicable(pri, "grossProfit"):
        na("dMarginUp", "매출총이익 개념이 없는 업종(금융업 등)")
    else:
        def margin(v):
            gp, rev = _num(v, "grossProfit"), _num(v, "revenue")
            if gp is None:
                cs = _num(v, "costOfSales")
                gp = (rev - cs) if (rev is not None and cs is not None) else None
            return (gp / rev) if (gp is not None and rev) else None
        m_c, m_p = margin(cur), margin(pri)
        put("dMarginUp", None if (m_c is None or m_p is None) else m_c > m_p,
            "매출총이익/매출이 작년보다 높아짐")

    # 9) Δ자산회전율 > 0 — 같은 자산으로 더 많이 파는가.
    if not _applicable(cur, "revenue") or not _applicable(pri, "revenue"):
        na("dTurnoverUp", "매출 개념이 다른 업종(금융업 등)")
    else:
        rev_c, rev_p = _num(cur, "revenue"), _num(pri, "revenue")
        t_c = (rev_c / ta_p) if (rev_c is not None and ta_p) else None
        t_p = (rev_p / ta_pp) if (rev_p is not None and ta_pp) else None
        put("dTurnoverUp", None if (t_c is None or t_p is None) else t_c > t_p,
            "매출/직전기말 총자산이 작년보다 높아짐")

    decided = [k for k in SIGNAL_ORDER if signals.get(k) is not None]
    complete = len(decided) == len(SIGNAL_ORDER)
    exact = all(SIGNAL_BASIS[k] == "PAPER_EXACT" for k in SIGNAL_ORDER)
    return {
        "score": sum(1 for k in decided if signals[k]) if complete else None,
        # 3개 회계연도를 다 받았는지 — 안 받았으면 complete는 절대 True가 될 수 없다.
        "fiscalYearsUsed": sum(1 for v in (cur, pri, pri2) if v),
        "fiscalYearsRequired": 3,
        "maxScore": len(SIGNAL_ORDER),
        # 9개를 다 못 채웠을 때 "몇 점"이라고 부르지 않기 위한 별도 이름.
        "partialPositive": sum(1 for k in decided if signals[k]),
        "decidedSignals": len(decided),
        "signals": {k: signals.get(k) for k in SIGNAL_ORDER},
        "reasons": reasons,
        "missing": missing,
        "notApplicable": not_applicable,
        "complete": complete,
        "basis": "PAPER_EXACT" if (complete and exact) else "GAEO_PROXY",
        "basisBySignal": dict(SIGNAL_BASIS),
        "sectorHandling": ("FINANCIAL_SECTOR_SPECIAL_HANDLING_REQUIRED"
                           if not_applicable else "STANDARD"),
        "note": ("9개 신호를 모두 채우지 못하면 F-Score라고 부르지 않는다. "
                 "빠진 신호는 0이 아니라 '못 구함'이다."),
    }
