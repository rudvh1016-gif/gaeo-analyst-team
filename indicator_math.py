#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""지표 계산의 단일 원천 — Live와 Historical이 같은 식을 쓰게 한다.

왜 필요한가 (2026-08-15 실측으로 확인한 결함)

  QUANT는 "지금 이 종목과 비슷했던 과거 상태"를 찾아 그 뒤 승률을 본다.
  그런데 '지금 상태'와 '과거 상태'를 서로 다른 공식으로 계산하고 있었다.

  1) RSI14
     Live(compute_indicators.py): Wilder 평활 — 전체 구간을 지수적으로 이어 계산
     Historical(build_quant_stats): 최근 14개 변화의 단순 평균
     → 같은 날, 같은 종목인데 RSI가 다르게 나온다. 버킷이 어긋난다.

  2) 5일 수익률
     Live: last5[-1] / last5[0] - 1   → 종가 5개 사이 = **4거래일** 간격
     Historical: closes[i] / closes[i-5] - 1 → **5거래일** 간격
     → 기간 정의 자체가 다르다.

  이 모듈의 함수만 쓰면 두 경로가 같은 값을 낸다. 테스트가 이를 강제한다.
"""

RSI_PERIOD = 14
RET_LOOKBACK = 5
# ⭐ 2026-09-05: 중기 과열 판정용 기준(20거래일 ≈ 한 달). BUY 실적 감사에서
#    "직전 20거래일 +25% 이상 오른 뒤 나온 BUY"의 폭락률이 나머지보다 16.3%p 높았다
#    (docs/BUY_OVERHEAT_WARNING_20260905.md). ret5와 같은 ret_n 식을 그대로 쓴다.
RET_LOOKBACK_MID = 20


def wilder_rsi(closes, period=RSI_PERIOD):
    """Wilder 평활 RSI. compute_indicators.py와 완전히 같은 계산이다.

    closes: 오래된 것 → 최신 순으로 정렬된 종가 리스트.
    반환: 0~100 실수. 데이터가 부족하면 None(0이나 50으로 채우지 않는다).
    """
    if not closes or len(closes) < period + 1:
        return None
    gains, losses = [], []
    for i in range(1, len(closes)):
        ch = closes[i] - closes[i - 1]
        gains.append(max(ch, 0.0))
        losses.append(max(-ch, 0.0))
    if len(gains) < period:
        return None
    ag = sum(gains[:period]) / period
    al = sum(losses[:period]) / period
    for i in range(period, len(gains)):
        ag = (ag * (period - 1) + gains[i]) / period
        al = (al * (period - 1) + losses[i]) / period
    if not al:
        return 100.0
    return 100 - 100 / (1 + ag / al)


def ret_n(closes, n=RET_LOOKBACK):
    """n거래일 수익률(%) = 현재 종가 / n거래일 전 종가 - 1.

    ⚠️ n거래일 '간격'이다. 따라서 종가가 최소 n+1개 필요하다.
       (종가 6개가 있어야 5거래일 간격 수익률을 낼 수 있다)
    데이터가 부족하거나 기준 종가가 0이면 None.
    """
    if not closes or len(closes) < n + 1:
        return None
    base = closes[-1 - n]
    if not base:
        return None
    return (closes[-1] - base) / base * 100.0


def sma(closes, period):
    """단순이동평균. 기간을 못 채우면 None(부분 평균을 정식 MA로 쓰지 않는다)."""
    if not closes or len(closes) < period:
        return None
    return sum(closes[-period:]) / period


def sma_partial(closes, period):
    """기간이 모자라면 있는 만큼의 평균. ⚠️ 정식 MA가 아니다.

    화면 표시용으로만 쓰고, 점수 계산에는 sma()와 full 여부를 함께 확인해야 한다.
    반환: (값, full_여부, 실제_사용일수)
    """
    if not closes:
        return None, False, 0
    days = min(len(closes), period)
    return sum(closes[-days:]) / days, days >= period, days


def state_at(closes, index=None, rsi_period=RSI_PERIOD, ret_lookback=RET_LOOKBACK):
    """어떤 시점의 QUANT 상태를 계산한다. Live·Historical 공용 진입점.

    index=None이면 마지막 종가 기준(= Live). 정수를 주면 그 시점 기준(= Historical).
    반환: {"rsi14", "ret5", "ma20", "close"} — 못 구하면 각각 None.

    ⚠️ index 이후의 종가는 절대 쓰지 않는다(미래정보 차단).
    """
    if not closes:
        return {"rsi14": None, "ret5": None, "ma20": None, "close": None}
    i = len(closes) - 1 if index is None else index
    if i < 0 or i >= len(closes):
        return {"rsi14": None, "ret5": None, "ma20": None, "close": None}
    past = closes[: i + 1]          # i 시점까지만. 그 뒤는 보지 않는다.
    return {
        "rsi14": wilder_rsi(past, rsi_period),
        "ret5": ret_n(past, ret_lookback),
        "ma20": sma(past, 20),
        "close": past[-1],
    }
