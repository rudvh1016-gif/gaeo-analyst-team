#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 📡 GAEO 레이더 신호 계산 모듈 (규칙 기반 · 토큰 0)

GAEO 레이더는 500종목의 일봉을 기계적으로 훑어 **"어제와 오늘 사이에 실제로
경계선을 넘은 종목"**만 골라내는 보조 탐지기다. AI 분석가(TARO·DIANA·QUANT·
FLOW·CHIEF)를 대체하거나 6번째 분석가로 추가하는 것이 아니라, 5인이 볼 만한
종목을 기계가 먼저 찾아주는 역할만 한다. 여기서는 BUY/HOLD/SELL 같은 투자
판단을 절대 만들지 않는다.

계산 규격은 compute_indicators.py(=종목분석 스킬)와 동일하게 맞춘다.
  MA20/MA60 = 종가 단순평균 · RSI(14) = Wilder 평활
  MACD = EMA12 − EMA26 (시그널 = MACD의 EMA9) · 거래량배율 = 당일 / 직전 20일 평균
여기에 볼린저밴드(20일 SMA ± 표준편차 2배)를 추가한다.

이 파일은 순수 계산 + 이벤트 판정만 담당한다(파일 입출력 없음).
  · compute_radar.py  : 실제 데이터를 읽어 radar.js / radar_series.js 생성
  · compute_indicators.py : 볼린저밴드 계산만 재사용
  · test_radar.py     : 알려진 값으로 이 모듈을 검증
"""

# ────────────────────────────────────────────────────────────────────
# ⭐ 탐지 기준 상수 — 기준을 바꾸려면 반드시 여기만 고친다
# ────────────────────────────────────────────────────────────────────
RSI_PERIOD = 14
RSI_OVERSOLD = 30.0          # 이 아래로 내려오면 '과매도'
RSI_OVERBOUGHT = 70.0        # 이 위로 올라가면 '과매수'

BB_PERIOD = 20               # 볼린저밴드 이동평균 기간
BB_STDDEV = 2.0              # 볼린저밴드 표준편차 배수

VOL_AVG_DAYS = 20            # 거래량 평균 기간(당일 제외 직전 N거래일)
VOL_SPIKE_MULT = 2.0         # 이 배수 이상이면 '거래량 급증'

MACD_FAST, MACD_SLOW, MACD_SIGNAL = 12, 26, 9
MA_SHORT, MA_LONG = 20, 60   # 이동평균 골든/데드크로스
MA_XSHORT = 5                # ⭐ 2026-08-07: 5일선 — 5·20일선 골든/데드크로스용

# ⭐ 2026-08-07: '임박'(아직 안 뚫렸지만 두 선 간격이 좁혀지는 중) 판정 기준.
# compute_indicators.py의 cross5_20/cross20_60 near 판정과 같은 계산 규격을 쓴다.
MA_NEAR_DAYS = 3             # 오늘과 며칠 전을 비교해 좁혀지는 중인지 본다
MA_NEAR_SHRINK_RATIO = 0.7   # 오늘 간격이 MA_NEAR_DAYS 전 간격의 이 배율보다 좁아야 '좁혀지는 중'
MA_NEAR_GAP_PCT = 1.2        # 두 선 간격이 장기선 대비 이 %(퍼센트) 이내여야 '임박'

# 신호를 만들려면 최소 몇 개의 일봉이 필요한가 (신규상장·거래정지 방어)
MIN_BARS_RSI = RSI_PERIOD + 2        # 16 — 어제/오늘 두 시점의 RSI가 나오려면
MIN_BARS_BB = BB_PERIOD + 1          # 21
MIN_BARS_VOL = VOL_AVG_DAYS + 1      # 21
MIN_BARS_MACD = MACD_SLOW + MACD_SIGNAL + 1   # 36
MIN_BARS_MA = MA_LONG + 1            # 61
MIN_BARS_MA5_20 = MA_SHORT + MA_NEAR_DAYS + 1     # 24 — 5·20일선 교차·임박 계산에 필요
MIN_BARS_MA_NEAR = MA_LONG + MA_NEAR_DAYS + 1     # 64 — 20·60일선 임박 계산에 필요(교차 자체는 MIN_BARS_MA)
MIN_BARS_ANY = min(MIN_BARS_RSI, MIN_BARS_BB, MIN_BARS_VOL)   # 이보다 적으면 '데이터 부족'


def _finite(x):
    """NaN·Infinity·None을 전부 걸러내는 안전 검사. 화면에 이상한 숫자가 나가지 않게 한다."""
    if x is None:
        return False
    try:
        f = float(x)
    except (TypeError, ValueError):
        return False
    return f == f and f not in (float("inf"), float("-inf"))


def sma_series(vals, period):
    """단순이동평균 — 값이 모자란 앞부분은 None."""
    out = [None] * len(vals)
    if period <= 0:
        return out
    run = 0.0
    for i, v in enumerate(vals):
        run += v
        if i >= period:
            run -= vals[i - period]
        if i >= period - 1:
            out[i] = run / period
    return out


def stdev_pop(window):
    """모집단 표준편차 — 볼린저밴드 표준 정의(표본 표준편차 아님)."""
    n = len(window)
    if n == 0:
        return 0.0
    mean = sum(window) / n
    return (sum((v - mean) ** 2 for v in window) / n) ** 0.5


def bollinger(closes, period=BB_PERIOD, mult=BB_STDDEV):
    """볼린저밴드 = period일 단순이동평균 ± 표준편차 × mult.
    반환: {mid, upper, lower, pctb, width} — 각각 closes와 길이가 같은 리스트(앞부분 None).
      pctb  = (종가 − 하단) / (상단 − 하단)  … 0 미만이면 하단 이탈, 1 초과면 상단 돌파
      width = (상단 − 하단) / 중심선 × 100 (%) … 밴드가 얼마나 벌어졌는가
    ※ pctb·width는 계산만 해두고 화면에는 과하게 노출하지 않는다."""
    n = len(closes)
    mid = sma_series(closes, period)
    upper, lower, pctb, width = [None] * n, [None] * n, [None] * n, [None] * n
    for i in range(n):
        if mid[i] is None:
            continue
        sd = stdev_pop(closes[i - period + 1:i + 1])
        m = mid[i]
        up, lo = m + mult * sd, m - mult * sd
        upper[i], lower[i] = up, lo
        span = up - lo
        if span > 0:
            pctb[i] = (closes[i] - lo) / span
        if m:
            width[i] = span / m * 100
    return {"mid": mid, "upper": upper, "lower": lower, "pctb": pctb, "width": width}


def rsi_series(closes, period=RSI_PERIOD):
    """RSI(14) Wilder 평활 — compute_indicators.py와 동일 규격.
    closes[period] 지점부터 값이 생기고 그 앞은 None."""
    n = len(closes)
    out = [None] * n
    if n < period + 1:
        return out
    gains, losses = [], []
    for i in range(1, n):
        ch = closes[i] - closes[i - 1]
        gains.append(max(ch, 0.0))
        losses.append(max(-ch, 0.0))
    ag = sum(gains[:period]) / period
    al = sum(losses[:period]) / period
    out[period] = 100.0 if al == 0 else 100 - 100 / (1 + ag / al)
    for i in range(period, len(gains)):
        ag = (ag * (period - 1) + gains[i]) / period
        al = (al * (period - 1) + losses[i]) / period
        out[i + 1] = 100.0 if al == 0 else 100 - 100 / (1 + ag / al)
    return out


def ema_series(vals, n):
    """지수이동평균 — compute_indicators.py와 동일하게 첫 값을 그대로 시드로 쓴다."""
    if not vals:
        return []
    k = 2 / (n + 1)
    out = [vals[0]]
    for v in vals[1:]:
        out.append(v * k + out[-1] * (1 - k))
    return out


def macd_series(closes, fast=MACD_FAST, slow=MACD_SLOW, signal=MACD_SIGNAL):
    """MACD·시그널 — compute_indicators.py와 동일 규격(시그널은 slow−1 지점부터 EMA 시드)."""
    n = len(closes)
    macd = [None] * n
    sig = [None] * n
    if n < 2:
        return macd, sig
    e_fast, e_slow = ema_series(closes, fast), ema_series(closes, slow)
    line = [a - b for a, b in zip(e_fast, e_slow)]
    for i in range(n):
        macd[i] = line[i]
    start = slow - 1
    if n > start:
        s = ema_series(line[start:], signal)
        for j, v in enumerate(s):
            sig[start + j] = v
    return macd, sig


def volume_ratio_series(vols, period=VOL_AVG_DAYS):
    """거래량 배율 = 당일 거래량 / 직전 period일 평균(당일 제외).
    직전 평균이 0(거래정지·신규상장)이면 None — 억지로 신호를 만들지 않는다.
    반환: (배율 리스트, 평균 리스트)"""
    n = len(vols)
    ratio, avg = [None] * n, [None] * n
    for i in range(period, n):
        window = vols[i - period:i]
        a = sum(window) / period
        avg[i] = a
        if a > 0 and vols[i] is not None and vols[i] > 0:
            ratio[i] = vols[i] / a
    return ratio, avg


# ────────────────────────────────────────────────────────────────────
# 신호 정의 — label(화면 표시명) · group · severity · 설명 · 주의 문구
#   ⚠️ 문구 원칙: 매수·매도 권유, "반등 확정 / 바닥 확인" 같은 단정 표현 금지.
#      "~한 변화가 포착됐어요" 수준의 사실 서술만 쓴다.
# ────────────────────────────────────────────────────────────────────
SIGNAL_DEFS = {
    "rsi_oversold_entry": {
        "label": "과매도 진입", "group": "main", "severity": "high", "icon": "▼",
        "metric": "RSI",
        "description": "RSI가 {threshold} 아래로 내려오며 최근 매도 압력이 강해진 구간이에요.",
        "caution": "과매도 진입이 곧바로 반등을 뜻하지는 않아요. 추가 하락 가능성도 함께 봐야 해요.",
    },
    "rsi_oversold_exit": {
        "label": "과매도 탈출", "group": "main", "severity": "high", "icon": "▲",
        "metric": "RSI",
        "description": "RSI가 {threshold} 위로 올라오며 과매도 구간에서 벗어났어요.",
        "caution": "과매도 구간을 벗어난 것일 뿐, 상승 전환을 확인해 주는 신호는 아니에요.",
    },
    "rsi_overbought_entry": {
        "label": "과매수 진입", "group": "main", "severity": "mid", "icon": "▲",
        "metric": "RSI",
        "description": "RSI가 {threshold}을 넘어서며 최근 매수세가 몰린 구간이에요.",
        "caution": "과매수 구간이라고 해서 곧 하락한다는 뜻은 아니에요. 강세가 이어지기도 해요.",
    },
    "rsi_overbought_exit": {
        "label": "과매수 탈출", "group": "main", "severity": "mid", "icon": "▼",
        "metric": "RSI",
        "description": "RSI가 {threshold} 아래로 내려오며 과매수 구간에서 벗어났어요.",
        "caution": "매수세가 잦아든 구간일 뿐, 방향을 알려주는 신호는 아니에요.",
    },
    "bb_lower_break": {
        "label": "밴드 하단 이탈", "group": "main", "severity": "high", "icon": "▼",
        "metric": "종가",
        "description": "종가가 볼린저밴드 하단 아래로 내려가며 평소 범위를 벗어난 낙폭이 나왔어요.",
        "caution": "밴드를 벗어난 상태가 며칠 이어질 수 있어요. 한 번의 이탈로 방향을 단정할 수 없어요.",
    },
    "bb_lower_recover": {
        "label": "밴드 하단 재진입", "group": "main", "severity": "mid", "icon": "▲",
        "metric": "종가",
        "description": "종가가 볼린저밴드 하단 위로 다시 올라오며 평소 범위 안으로 돌아왔어요.",
        "caution": "밴드 안으로 돌아온 것일 뿐, 하락이 끝났다는 의미는 아니에요.",
    },
    "bb_upper_break": {
        "label": "밴드 상단 돌파", "group": "main", "severity": "mid", "icon": "▲",
        "metric": "종가",
        "description": "종가가 볼린저밴드 상단 위로 올라가며 평소 범위를 벗어난 상승폭이 나왔어요.",
        "caution": "밴드 상단 돌파는 과열 구간에서도 자주 나와요. 거래량 변화도 함께 확인해 주세요.",
    },
    "bb_upper_recover": {
        "label": "밴드 상단 재진입", "group": "main", "severity": "low", "icon": "▼",
        "metric": "종가",
        "description": "종가가 볼린저밴드 상단 아래로 다시 내려오며 평소 범위 안으로 돌아왔어요.",
        "caution": "상승 탄력이 잦아든 구간일 뿐, 하락 전환을 뜻하지는 않아요.",
    },
    "volume_spike": {
        "label": "거래량 급증", "group": "main", "severity": "high", "icon": "◆",
        "metric": "거래량 배수",
        "description": "거래량이 최근 {vol_days}일 평균의 {mult}배를 넘어서며 평소보다 크게 늘었어요.",
        "caution": "거래량 급증은 매수·매도 어느 쪽으로도 나올 수 있어요. 가격 흐름과 함께 봐야 해요.",
    },
    "macd_golden_cross": {
        "label": "MACD 골든크로스", "group": "extra", "severity": "mid", "icon": "▲",
        "metric": "MACD−시그널",
        "description": "MACD가 시그널선을 위로 통과하며 최근 가격의 힘이 세지는 쪽으로 바뀌었어요.",
        "caution": "교차 신호는 자주 뒤바뀌어요. 한 번의 교차만으로 흐름을 단정할 수 없어요.",
    },
    "macd_dead_cross": {
        "label": "MACD 데드크로스", "group": "extra", "severity": "mid", "icon": "▼",
        "metric": "MACD−시그널",
        "description": "MACD가 시그널선을 아래로 통과하며 최근 가격의 힘이 빠지는 쪽으로 바뀌었어요.",
        "caution": "교차 신호는 자주 뒤바뀌어요. 한 번의 교차만으로 흐름을 단정할 수 없어요.",
    },
    "ma_golden_cross": {
        "label": "MA20·60 골든크로스", "group": "main", "severity": "mid", "icon": "▲",
        "metric": "MA20−MA60",
        "description": "20일 이동평균선이 60일선을 위로 통과했어요(중기 흐름이 바뀌는 지점).",
        "caution": "이동평균 교차는 이미 지나간 가격을 평균 낸 결과라 늦게 나타나요.",
    },
    "ma_dead_cross": {
        "label": "MA20·60 데드크로스", "group": "main", "severity": "mid", "icon": "▼",
        "metric": "MA20−MA60",
        "description": "20일 이동평균선이 60일선을 아래로 통과했어요(중기 흐름이 바뀌는 지점).",
        "caution": "이동평균 교차는 이미 지나간 가격을 평균 낸 결과라 늦게 나타나요.",
    },
    # ⭐ 2026-08-07 추가: 5·20일선 골든/데드크로스 + 두 쌍(5·20, 20·60) '임박' 신호.
    # compute_indicators.py의 cross5_20/cross20_60(종목 상세 화면용)과 같은 개념을
    # 레이더(전 종목 스캔)에도 넣어달라는 요청으로 추가했다.
    "ma5_20_golden_cross": {
        "label": "MA5·20 골든크로스", "group": "main", "severity": "low", "icon": "▲",
        "metric": "MA5−MA20",
        "description": "5일 이동평균선이 20일선을 위로 통과했어요(단기 흐름이 바뀌는 지점).",
        "caution": "이동평균 교차는 이미 지나간 가격을 평균 낸 결과라 늦게 나타나요. 5·20일선은 자주 엇갈려요.",
    },
    "ma5_20_dead_cross": {
        "label": "MA5·20 데드크로스", "group": "main", "severity": "low", "icon": "▼",
        "metric": "MA5−MA20",
        "description": "5일 이동평균선이 20일선을 아래로 통과했어요(단기 흐름이 바뀌는 지점).",
        "caution": "이동평균 교차는 이미 지나간 가격을 평균 낸 결과라 늦게 나타나요. 5·20일선은 자주 엇갈려요.",
    },
    "ma5_20_cross_near_golden": {
        "label": "MA5·20 골든크로스 임박", "group": "main", "severity": "low", "icon": "▲",
        "metric": "간격(%)",
        "description": "5일선이 아직 20일선 아래지만 간격이 {threshold}% 안쪽으로 좁혀지는 중이에요.",
        "caution": "실제로 뚫고 올라가지 않고 다시 벌어질 수도 있어요. 확정된 신호가 아니에요.",
    },
    "ma5_20_cross_near_dead": {
        "label": "MA5·20 데드크로스 임박", "group": "main", "severity": "low", "icon": "▼",
        "metric": "간격(%)",
        "description": "5일선이 아직 20일선 위지만 간격이 {threshold}% 안쪽으로 좁혀지는 중이에요.",
        "caution": "실제로 뚫고 내려가지 않고 다시 벌어질 수도 있어요. 확정된 신호가 아니에요.",
    },
    "ma20_60_cross_near_golden": {
        "label": "MA20·60 골든크로스 임박", "group": "main", "severity": "mid", "icon": "▲",
        "metric": "간격(%)",
        "description": "20일선이 아직 60일선 아래지만 간격이 {threshold}% 안쪽으로 좁혀지는 중이에요.",
        "caution": "실제로 뚫고 올라가지 않고 다시 벌어질 수도 있어요. 확정된 신호가 아니에요.",
    },
    "ma20_60_cross_near_dead": {
        "label": "MA20·60 데드크로스 임박", "group": "main", "severity": "mid", "icon": "▼",
        "metric": "간격(%)",
        "description": "20일선이 아직 60일선 위지만 간격이 {threshold}% 안쪽으로 좁혀지는 중이에요.",
        "caution": "실제로 뚫고 내려가지 않고 다시 벌어질 수도 있어요. 확정된 신호가 아니에요.",
    },
}

# 홈 화면 분류 카드 순서 (main 그룹만 개별 카드, extra는 '기타 변화'로 묶는다)
# ⭐ 2026-08-07: 이동평균 교차·임박 신호(MA20·60, MA5·20 둘 다)는 "기타 변화"에 묻어두기엔
# 아쉽다는 요청으로 main으로 승격했다 — MACD 교차만 기타에 남긴다.
MAIN_ORDER = [
    "rsi_oversold_entry", "rsi_oversold_exit",
    "bb_lower_break", "volume_spike",
    "rsi_overbought_entry", "rsi_overbought_exit",
    "bb_lower_recover", "bb_upper_break", "bb_upper_recover",
    "ma_golden_cross", "ma_dead_cross",
    "ma5_20_golden_cross", "ma5_20_dead_cross",
    "ma20_60_cross_near_golden", "ma20_60_cross_near_dead",
    "ma5_20_cross_near_golden", "ma5_20_cross_near_dead",
]
EXTRA_ORDER = ["macd_golden_cross", "macd_dead_cross"]

# 한 종목에서 여러 신호가 겹쳤을 때 "대표 신호"를 고르는 순서(앞일수록 우선)
REPRESENTATIVE_ORDER = [
    "bb_lower_break", "rsi_oversold_entry", "rsi_oversold_exit", "volume_spike",
    "bb_upper_break", "rsi_overbought_entry", "rsi_overbought_exit",
    "bb_lower_recover", "bb_upper_recover",
    "macd_golden_cross", "macd_dead_cross", "ma_golden_cross", "ma_dead_cross",
    "ma5_20_golden_cross", "ma5_20_dead_cross",
    "ma20_60_cross_near_golden", "ma20_60_cross_near_dead",
    "ma5_20_cross_near_golden", "ma5_20_cross_near_dead",
]
SEVERITY_RANK = {"high": 3, "mid": 2, "low": 1}


def _round(v, nd=1):
    return None if not _finite(v) else round(float(v), nd)


def _ma_gap_pct(short_ma, long_ma, k):
    """k 시점의 (단기선−장기선)/장기선 × 100. 배열 범위를 벗어나거나 값이 없으면 None."""
    if k < 0 or k >= len(short_ma) or k >= len(long_ma):
        return None
    s, l = short_ma[k], long_ma[k]
    if not (_finite(s) and _finite(l)) or l == 0:
        return None
    return (s / l - 1) * 100


def _ma_near_dir(short_ma, long_ma, k):
    """⭐ 2026-08-07: k 시점에서 '임박'(아직 안 뚫렸지만 두 선 간격이 좁혀지는 중) 방향을
    돌려준다('golden'/'dead'/None). compute_indicators.py의 cross5_20/cross20_60 near
    판정과 같은 계산 규격(MA_NEAR_DAYS 전과 비교, 좁혀지는 비율·간격 기준)을 쓴다."""
    gap, gap_ref = _ma_gap_pct(short_ma, long_ma, k), _ma_gap_pct(short_ma, long_ma, k - MA_NEAR_DAYS)
    if gap is None or gap_ref is None or gap == 0 or gap_ref == 0:
        return None
    same_side = (gap > 0) == (gap_ref > 0)
    narrowing = abs(gap) < abs(gap_ref) * MA_NEAR_SHRINK_RATIO
    close_enough = abs(gap) < MA_NEAR_GAP_PCT
    if same_side and narrowing and close_enough:
        return "dead" if gap > 0 else "golden"
    return None


def _make_event(code, name, sig_type, date, prev, cur, threshold, unit,
                detected_at, price_base_at, status):
    d = SIGNAL_DEFS[sig_type]
    desc = d["description"].format(
        threshold=_fmt_threshold(sig_type, threshold),
        vol_days=VOL_AVG_DAYS,
        mult=("%g" % VOL_SPIKE_MULT),
    )
    return {
        "id": f"{code}-{sig_type.replace('_', '-')}-{date.replace('-', '')}",
        "code": code,
        "name": name,
        "type": sig_type,
        "label": d["label"],
        "group": d["group"],
        "icon": d["icon"],
        "metric": d["metric"],
        "unit": unit,
        "previousValue": prev,
        "currentValue": cur,
        "threshold": threshold,
        "date": date,
        "detectedAt": detected_at,
        "priceBaseAt": price_base_at,
        "status": status,
        "severity": d["severity"],
        "description": desc,
        "caution": d["caution"],
    }


def _fmt_threshold(sig_type, threshold):
    if sig_type.startswith("rsi"):
        return "%g" % threshold
    return "%g" % threshold if _finite(threshold) else "-"


def detect_events(code, name, daily, detected_at="", price_base_at="", status="confirmed"):
    """한 종목의 일봉(오래된 것 → 최신 순)에서 '어제 대비 새로 발생한 변화'만 찾아낸다.

    반환: (events, note)
      events : 이벤트 dict 리스트 (없으면 빈 리스트)
      note   : None이면 정상, 'insufficient'면 데이터 부족(신규상장·거래정지 등)

    ⭐ 단순 '현재 과매도 상태'는 신호가 아니다. 직전 거래일 값과 비교해 실제로
       경계선을 통과했을 때만 이벤트로 만든다.
    """
    rows = [r for r in (daily or [])
            if isinstance(r, dict) and _finite(r.get("close")) and float(r.get("close")) > 0]
    if len(rows) < MIN_BARS_ANY:
        return [], "insufficient"

    closes = [float(r["close"]) for r in rows]
    vols = [float(r.get("volume") or 0) for r in rows]
    dates = [str(r.get("date") or "") for r in rows]
    n = len(closes)
    i, j = n - 1, n - 2          # i=오늘, j=어제
    today = dates[i] or ""
    if not today:
        return [], "insufficient"

    events = []

    def add(sig_type, prev, cur, threshold, unit):
        if not (_finite(prev) and _finite(cur) and _finite(threshold)):
            return
        events.append(_make_event(code, name, sig_type, today, prev, cur, threshold,
                                  unit, detected_at, price_base_at, status))

    # ── RSI 경계 통과 ──
    if n >= MIN_BARS_RSI:
        rsi = rsi_series(closes)
        p, c = rsi[j], rsi[i]
        if _finite(p) and _finite(c):
            p, c = _round(p), _round(c)
            if p >= RSI_OVERSOLD > c:
                add("rsi_oversold_entry", p, c, RSI_OVERSOLD, "")
            elif p < RSI_OVERSOLD <= c:
                add("rsi_oversold_exit", p, c, RSI_OVERSOLD, "")
            if p <= RSI_OVERBOUGHT < c:
                add("rsi_overbought_entry", p, c, RSI_OVERBOUGHT, "")
            elif p > RSI_OVERBOUGHT >= c:
                add("rsi_overbought_exit", p, c, RSI_OVERBOUGHT, "")

    # ── 볼린저밴드 이탈·재진입 ──
    if n >= MIN_BARS_BB:
        bb = bollinger(closes)
        lo_p, lo_c = bb["lower"][j], bb["lower"][i]
        up_p, up_c = bb["upper"][j], bb["upper"][i]
        if _finite(lo_p) and _finite(lo_c):
            was_below, now_below = closes[j] < lo_p, closes[i] < lo_c
            if not was_below and now_below:
                add("bb_lower_break", round(closes[j]), round(closes[i]), round(lo_c), "원")
            elif was_below and not now_below:
                add("bb_lower_recover", round(closes[j]), round(closes[i]), round(lo_c), "원")
        if _finite(up_p) and _finite(up_c):
            was_above, now_above = closes[j] > up_p, closes[i] > up_c
            if not was_above and now_above:
                add("bb_upper_break", round(closes[j]), round(closes[i]), round(up_c), "원")
            elif was_above and not now_above:
                add("bb_upper_recover", round(closes[j]), round(closes[i]), round(up_c), "원")

    # ── 거래량 급증 (당일 발생형 — 상태가 아니라 그날의 사건) ──
    if n >= MIN_BARS_VOL:
        ratio, _avg = volume_ratio_series(vols)
        c = ratio[i]
        if _finite(c) and c >= VOL_SPIKE_MULT and vols[i] > 0:
            p = _round(ratio[j], 2) if _finite(ratio[j]) else 0.0
            add("volume_spike", p, _round(c, 2), VOL_SPIKE_MULT, "배")

    # ── MACD 교차 ──
    if n >= MIN_BARS_MACD:
        macd, sig = macd_series(closes)
        if all(_finite(x) for x in (macd[j], sig[j], macd[i], sig[i])):
            dp, dc = macd[j] - sig[j], macd[i] - sig[i]
            if dp <= 0 < dc:
                add("macd_golden_cross", round(dp), round(dc), 0, "")
            elif dp >= 0 > dc:
                add("macd_dead_cross", round(dp), round(dc), 0, "")

    # ── MA5·20, MA20·60 교차 + '임박'(아직 안 뚫렸지만 좁혀지는 중) ──
    # ⭐ 2026-08-07: 종목 상세 화면(compute_indicators.py)에 있던 골든/데드크로스 감지를
    # 레이더(전 종목 스캔)에도 추가했다. '임박'은 오늘 새로 그 상태에 들어선 날에만
    # 이벤트로 만든다(다른 신호들과 같은 원칙 — 지속 상태를 매일 반복해서 알리지 않는다).
    # 이미 실제 교차가 난 날은 같은 쌍에서 '임박'을 같이 띄우지 않는다(모순 방지).
    if n >= MIN_BARS_MA5_20:
        s5, s20 = sma_series(closes, MA_XSHORT), sma_series(closes, MA_SHORT)
        crossed = False
        if all(_finite(x) for x in (s5[j], s20[j], s5[i], s20[i])):
            dp, dc = s5[j] - s20[j], s5[i] - s20[i]
            if dp <= 0 < dc:
                add("ma5_20_golden_cross", round(dp), round(dc), 0, "원"); crossed = True
            elif dp >= 0 > dc:
                add("ma5_20_dead_cross", round(dp), round(dc), 0, "원"); crossed = True
        if not crossed:
            near_p, near_c = _ma_near_dir(s5, s20, j), _ma_near_dir(s5, s20, i)
            if near_c and near_c != near_p:
                add(f"ma5_20_cross_near_{near_c}",
                    _round(_ma_gap_pct(s5, s20, j), 2), _round(_ma_gap_pct(s5, s20, i), 2),
                    MA_NEAR_GAP_PCT, "%")

    if n >= MIN_BARS_MA:
        s20b, s60 = sma_series(closes, MA_SHORT), sma_series(closes, MA_LONG)
        crossed = False
        if all(_finite(x) for x in (s20b[j], s60[j], s20b[i], s60[i])):
            dp, dc = s20b[j] - s60[j], s20b[i] - s60[i]
            if dp <= 0 < dc:
                add("ma_golden_cross", round(dp), round(dc), 0, "원"); crossed = True
            elif dp >= 0 > dc:
                add("ma_dead_cross", round(dp), round(dc), 0, "원"); crossed = True
        if not crossed and n >= MIN_BARS_MA_NEAR:
            near_p, near_c = _ma_near_dir(s20b, s60, j), _ma_near_dir(s20b, s60, i)
            if near_c and near_c != near_p:
                add(f"ma20_60_cross_near_{near_c}",
                    _round(_ma_gap_pct(s20b, s60, j), 2), _round(_ma_gap_pct(s20b, s60, i), 2),
                    MA_NEAR_GAP_PCT, "%")

    return events, None


def sort_key(ev, watch_codes=()):
    """중요도 정렬: 관심종목 → 심각도 → 신호 우선순위 → 종목코드.
    ※ 사용자에게 '종합점수' 같은 근거 없는 숫자로는 노출하지 않는다(정렬에만 사용)."""
    return (
        0 if ev["code"] in watch_codes else 1,
        -SEVERITY_RANK.get(ev.get("severity"), 0),
        REPRESENTATIVE_ORDER.index(ev["type"]) if ev["type"] in REPRESENTATIVE_ORDER else 99,
        ev["code"],
    )


def representative(events):
    """한 종목에서 겹친 신호들 중 대표 신호 하나를 고른다."""
    return sorted(events, key=lambda e: sort_key(e))[0] if events else None
