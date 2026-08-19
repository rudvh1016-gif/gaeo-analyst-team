#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 기본모델 개선 후보 A1~A4 — 각각 **따로** 시험한다.

    A0  현재 Production 기본모델 (PR #372 상태)
    A1  FLOW 정규화              FLOW_NORMALIZED_CANDIDATE
    A2  RISK 방향점수 분리        RISK_DIRECTION_SEPARATED
    A3  상승장 SELL Guard 확대    EXPANDED_UPTREND_SELL_GUARD
    A4  MA slope 확인 보조장치    MA_SLOPE_CONFIRMATION

⚠️ 네 가지를 한꺼번에 섞지 않는다. 각각 A0와 1:1로 비교한 뒤,
   통과한 요소만 조합해서 다시 본다.
⚠️ 결과를 보고 숫자를 맞추지 않는다(threshold tuning 금지).
   임계값은 "이 신호가 의미하는 바"에서 먼저 정하고, 그 뒤에 성적을 본다.
⚠️ 이 모듈은 Production 판단을 바꾸지 않는다. 후보 계산만 제공하고,
   실제 적용 여부는 검증 결과를 보고 사람이 정한다.
"""

CANDIDATE_IDS = ("A0", "A1", "A2", "A3", "A4", "A5", "A6")

CANDIDATE_LABELS = {
    "A0": "현재 기본모델",
    "A1": "FLOW 정규화",
    "A2": "RISK 방향 분리",
    "A3": "상승장 SELL 확인 강화",
    "A4": "MA 기울기 확인",
    "A5": "임계값 점수대칭 (BUY>=63 / SELL<37)",
    "A6": "임계값 좁은대칭 (BUY>=55 / SELL<45)",
}

# ── A5·A6. BUY/SELL 임계값 비대칭 재검토 ─────────────────────────────────────
# 배경: docs/gaeo_sell_forensic_audit.md(2026-08-15)가 현재 문턱을 이렇게 지적했다.
#   "BUY 63점은 상위 7.0%, SELL 47점 미만은 하위 36.6% — 문 자체가 비대칭이다."
#   그리고 이를 "PHASE B 과제 3번: BUY/SELL 문턱 비대칭의 근거 재검토"로 등록했지만
#   아직 실행되지 않았다. 여기서 그 검증을 실제로 돌린다.
#
# ⚠️ 이 후보들은 Production 판단을 바꾸지 않는다. 비대칭이 실측에서 정당한지
#    확인하는 것이 목적이며, "대칭이 무조건 낫다"고 가정하지 않는다.
#    (선례: A2는 직관적으로 맞아 보였지만 SELL 정밀도가 61.3%→48.8%로 악화됐다.)
CANDIDATE_THRESHOLDS = {
    # variant: (buy_threshold, sell_threshold)
    "A5": (63, 37),   # 중립 50 기준 ±13 대칭. BUY 문턱은 그대로 두고 SELL만 대칭 이동
    "A6": (55, 45),   # 중립 50 기준 ±5 대칭. 양쪽 문턱을 모두 좁힘
}


def thresholds_for(variant, default_buy=63, default_sell=47):
    """variant에 해당하는 (BUY, SELL) 문턱을 돌려준다. 미등록이면 현재 운영값."""
    return CANDIDATE_THRESHOLDS.get(variant, (default_buy, default_sell))

# 정규화가 의미를 갖기 위한 최소 조건. 성적이 아니라 데이터 품질로 정한 값이다.
MIN_VOLUME_COVERAGE_STATE = "PERIOD_VOLUME_MATCHED"


# ── A1. FLOW 정규화 ──────────────────────────────────────────────────────────
def flow_score_normalized(fl):
    """같은 기간 순매수 ÷ 같은 기간 실제 총거래량으로 점수를 만든다.

    기존(A0)은 절대 주식수를 고정 상수 50,000주로 나눴다. 그래서 거래량이 많은
    대형주는 늘 만점 근처, 소형주는 늘 0점 근처가 되어 '종목 규모'를 재는 셈이었다.

    ⚠️ 크기 불변성: 순매수와 거래량을 **둘 다** k배 해도 점수가 같아야 한다.
       비율만 쓰기 때문에 자동으로 성립한다(테스트로 확인한다).
    ⚠️ 같은 정보를 두 번 가산하지 않는다. 지속일수(persistence)는 이미
       qualityScore가 반영하므로 여기서 다시 더하지 않는다.
    """
    if not fl:
        return None
    if fl.get("volumeState") != MIN_VOLUME_COVERAGE_STATE:
        return None                     # 실제 기간 거래량을 못 맞췄으면 쓰지 않는다
    fr = fl.get("frgnRatioPct")
    org = fl.get("orgRatioPct")
    if fr is None or org is None:
        return None

    s = 50.0
    # 기준: 기간 거래량의 ±4%를 외국인 순매수 만점(±16점)으로 본다.
    # 4%는 "그 기간 거래된 물량의 25분의 1을 한 주체가 순매수했다"는 뜻으로,
    # 실측 분포를 보기 전에 의미로 먼저 정한 값이다.
    s += max(-16, min(16, fr / 4.0 * 16))
    # 기관은 외국인보다 조금 작은 비중(±10점). A0의 16:10 비율을 그대로 유지한다.
    s += max(-10, min(10, org / 4.0 * 10))

    hn, hb = fl.get("holdNow"), fl.get("holdBefore")
    if hn is not None and hb is not None:
        s += max(-6, min(6, (hn - hb) * 3))
    return max(0, min(100, round(s)))


# ── A2. RISK 방향점수 분리 ───────────────────────────────────────────────────
# "변동성이 크다"와 "앞으로 떨어진다"는 다른 말이다.
DATA_QUALITY_FLAGS = ("stalePrice", "dataIncomplete", "dataError")


def risk_direction_separated(risk, base_overlay):
    """일반 고변동성만으로 방향점수를 깎지 않는다.

    A0는 grade == "high"이면 무조건 방향 원점수에서 감점했다. 그 결과
    '낙폭과대 후 반등 중'인 종목까지 계속 SELL 쪽으로 밀렸다.

    A2는 이렇게 나눈다.
        변동성·낙폭   →  위험 안내 + 신뢰도 하향 + 포지션 주의 (방향 개입 없음)
        데이터 문제   →  방향을 깎는 게 아니라 JUDGMENT_WITHHELD 우선 검토

    ⚠️ RISK가 상승표를 주지 않는다는 원칙은 그대로다. 감점을 없앨 뿐
       보너스를 주지 않는다.
    """
    out = dict(base_overlay)
    if not isinstance(risk, dict):
        out["directionPenalty"] = 0
        out["withholdSuggested"] = False
        return out

    # 데이터 자체가 못 믿을 상태인가.
    data_problem = any(bool(risk.get(f)) for f in DATA_QUALITY_FLAGS)

    out["directionPenalty"] = 0                     # 일반 변동성은 방향을 깎지 않는다
    out["confidencePenalty"] = base_overlay.get("confidencePenalty", 0)
    out["positionCaution"] = base_overlay.get("grade") == "high"
    # 데이터 문제는 SELL이 아니라 '판단 보류' 후보다.
    out["withholdSuggested"] = bool(data_problem)
    out["separationNote"] = ("변동성은 위험 안내와 신뢰도에만 쓰고 방향점수에 넣지 않습니다."
                             if not data_problem
                             else "데이터가 불완전해 방향을 낮추기보다 판단 보류를 먼저 검토합니다.")
    return out


# ── A3. 상승장 SELL Guard 확대 ───────────────────────────────────────────────
# A0의 Guard는 trend == up AND vol == high 에만 걸린다. 강한 상승장인데
# 변동성이 낮은 날에는 Guard가 아예 열리지 않아 SELL이 남발될 수 있다.
def expanded_uptrend_sell_guard(e, taro, nova, flow, base_guard):
    """강한 상승장에서 SELL을 내리려면 서로 다른 정보가 함께 약해야 한다.

    ⚠️ TARO와 QUANT는 둘 다 가격 기반이다. 둘을 완전히 독립된 2표로 세지 않는다.
       그래서 '가격축'은 통틀어 최대 1표로 계산한다.
    ⚠️ 상승장이라고 SELL을 전면 금지하지 않는다. 실제로 약한 회사는 SELL이 나와야 한다.
       확인 표가 충분하면 Guard는 열리지 않는다.
    """
    regime = e.get("marketRegime") or {}
    relative = e.get("relative") or {}

    # 변동성 조건을 빼고 '상승장 자체의 강도'로만 본다.
    strong_uptrend = (
        regime.get("trend") == "up"
        and float(regime.get("medianRet5") or regime.get("median5") or 0) >= 2.0
        and float(regime.get("advanceRatio5") or 0) >= 60.0
    )
    if not strong_uptrend:
        return dict(base_guard, expandedActive=False,
                    expandedReason="강한 상승장 조건에 해당하지 않습니다.")

    # 서로 다른 정보원에서 몇 표가 '약함'을 말하는가.
    votes = []
    if float(relative.get("vsMarket") or 0) < 0:
        votes.append("시장대비 약세")
    if float(relative.get("vsSector") or 0) < 0:
        votes.append("업종대비 약세")
    if isinstance(flow, dict) and flow.get("available") is not False:
        fs = flow.get("score")
        if fs is not None and fs < 45:
            votes.append("수급 약세")
    # 가격축(TARO·QUANT)은 둘 다 약해도 1표로만 센다. 정보가 겹치기 때문이다.
    if taro.get("stance") == "bear" and nova.get("stance") == "bear":
        votes.append("가격흐름 약세")
    elif taro.get("stance") == "bear" or nova.get("stance") == "bear":
        votes.append("가격흐름 약세")

    # 서로 다른 축에서 2표 이상이면 SELL을 막지 않는다.
    confirmed_weak = len(votes) >= 2
    active = not confirmed_weak
    return dict(
        base_guard,
        expandedActive=active,
        expandedVotes=votes,
        expandedReason=("강한 상승장인데 약세 근거가 가격흐름 한 축뿐이라 SELL을 확정하지 않습니다."
                        if active else
                        f"강한 상승장이지만 서로 다른 축 {len(votes)}곳이 약해 SELL을 허용합니다."),
        # Guard가 열리면 SELL 문턱을 낮춰(=더 어렵게) 잡는다.
        expandedSellThreshold=40 if active else int(base_guard.get("sellThreshold", 47)),
    )


# ── A4. MA slope 확인 ────────────────────────────────────────────────────────
# ⚠️ 새로운 큰 점수를 만들지 않는다. 기존 이동평균 신호를 '확인'하는 작은 보조장치다.
MA_SLOPE_MAX_ADJUST = 2.0


def ma_slope_confirmation(tech, taro_score):
    """이동평균 신호와 기울기가 어긋나면 아주 조금만 깎는다.

    가격이 20일선 위인데 20일선 자체가 내려가고 있으면 그 '위'는 약한 위다.
    반대로 아래인데 선이 올라오고 있으면 그 '아래'는 약한 아래다.

    ⚠️ 최대 ±2점. 이보다 크면 보조장치가 아니라 새 점수가 된다.
    """
    if not isinstance(tech, dict) or taro_score is None:
        return {"adjust": 0.0, "state": "MA_SLOPE_NOT_AVAILABLE"}
    ma20 = tech.get("ma20")
    slope = tech.get("ma20Slope")
    price = tech.get("price") or tech.get("close")
    if ma20 in (None, 0) or slope is None or price in (None, 0):
        return {"adjust": 0.0, "state": "MA_SLOPE_NOT_AVAILABLE"}
    # 20일선이 '완성'되지 않았으면(warm-up) 쓰지 않는다. TARO 성숙도 원칙과 같다.
    if tech.get("ma20Full") is False:
        return {"adjust": 0.0, "state": "MA_SLOPE_WARMUP"}

    above = float(price) >= float(ma20)
    rising = float(slope) > 0
    if above and not rising:
        return {"adjust": -MA_SLOPE_MAX_ADJUST, "state": "ABOVE_BUT_FALLING"}
    if (not above) and rising:
        return {"adjust": +MA_SLOPE_MAX_ADJUST, "state": "BELOW_BUT_RISING"}
    return {"adjust": 0.0, "state": "CONFIRMED"}


def apply_slope(taro_score, tech):
    """TARO 점수에 아주 작은 확인 보정을 얹는다."""
    conf = ma_slope_confirmation(tech, taro_score)
    if taro_score is None:
        return None, conf
    return max(0, min(100, round(taro_score + conf["adjust"]))), conf
