#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 지표 사전계산 (GitHub Actions용)
collect_analyst_data.py가 저장한 analysis_data.json(일봉·재무·수급 원천)과
update_prices.py가 저장한 data.js(현재가·PER 등)를 읽어, 분석에 바로 쓰는
요약 지표를 indicators.json 한 파일로 압축 저장한다.

목적: Claude 세션이 원천 데이터(수천 줄)를 읽고 계산하는 대신 이 요약표만
읽으면 되므로 토큰이 크게 절약된다. 계산 규격은 종목분석 스킬과 동일:
  MA5/20/60/120/200=종가 단순평균 · RSI(14)=Wilder 평활 · MACD=EMA12−EMA26(시그널 EMA9)
  거래량배율=당일/20일평균 · 수급=dealTrends 최근 6거래일 누적
  ⭐ TARO 이동평균 시스템(2026-08-06): 각 MA는 period일치가 없으면 "데이터 부족"으로 숨기지
  않고, 있는 만큼(eff일)만 평균 내 ma{P}Days(실제 일수)·ma{P}Full(정식 여부)와 함께 돌려준다.
  화면은 정식이 아니면 "60일선" 대신 "54일선"처럼 실제 일수를 이름표로 그대로 쓴다(예전
  버그는 54일 평균에 "60일선"이라는 가짜 이름을 붙였다 — 지금은 진짜 이름을 쓰는 게 다르다).
  기울기(Slope)는 정식(Full)일 때만 계산한다(들쭉날쭉한 임시 구간의 기울기는 의미가 약함).
실행: python3 compute_indicators.py  →  indicators.json
"""
import json, re, os, datetime
import indicator_math
import statistics
from zoneinfo import ZoneInfo

# 볼린저밴드는 📡 GAEO 레이더와 계산 규격이 반드시 같아야 하므로 공용 모듈을 그대로 쓴다
# (중복 구현하면 화면의 밴드와 레이더 신호가 미묘하게 어긋난다).
from radar_signals import bollinger, BB_PERIOD, BB_STDDEV

HERE = os.path.dirname(os.path.abspath(__file__))
KST = ZoneInfo("Asia/Seoul")   # 한국 시장 데이터 — 실행 환경 TZ와 무관하게 KST로 기록


def load_js_object(path, varname):
    txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1))


def num(x):
    if x is None:
        return None
    try:
        return float(str(x).replace(",", "").replace("%", "").replace("+", "")
                     .replace("원", "").replace("배", ""))
    except ValueError:
        return None


def load_sectors():
    try:
        text = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
        rows = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", text, re.S).group(1))
        return {row["code"]: row.get("sector") or "기타" for row in rows}
    except Exception:
        return {}


def ema_series(vals, n):
    k = 2 / (n + 1)
    out = [vals[0]]
    for v in vals[1:]:
        out.append(v * k + out[-1] * (1 - k))
    return out


MA_SLOPE_LOOKBACK = 5   # 이동평균 기울기 판단용 lookback(거래일) — TARO 해석 규격
CROSS_LOOKBACK = 20     # ⭐ 골든/데드크로스 감지(2026-08-07): 최근 며칠 안의 교차만 "새 소식"으로 알린다
CROSS_NEAR_DAYS = 3     # 임박 판정 — 오늘과 며칠 전을 비교해 두 선이 좁혀지는 중인지 본다
CROSS_NEAR_GAP_PCT = 1.2   # 두 선 간격이 이 %(현재가 대비) 이내로 좁혀져야 "임박"으로 본다
CROSS_NEAR_SHRINK_RATIO = 0.7   # 오늘 간격이 CROSS_NEAR_DAYS 전 간격의 이 배율보다 좁아야 "좁혀지는 중"


def indicators_for(daily):
    closes = [r["close"] for r in daily]
    vols = [r["volume"] for r in daily]
    cur = closes[-1]
    n = len(closes)

    MA_MIN_DAYS = 2   # 최소 이 정도는 있어야 "평균"이라 부를 수 있다(1일이면 평균이 아니라 그냥 종가)

    def sma_asof(period, back):
        """`period`일 평균을 최신 봉에서 `back`거래일 전 시점 기준으로 계산(기울기용)."""
        end = n - back
        return sum(closes[end - period:end]) / period if end >= period else None

    # ⭐ 골든크로스/데드크로스 감지(2026-08-07 사용자 요청): 단기선(short_p)이 장기선(long_p)을
    # 뚫고 올라가면(golden)/내려가면(dead) 각각 신호로 본다. sma_asof로 최근 CROSS_LOOKBACK
    # 거래일치 두 선의 위치를 되짚어, ① 최근 며칠 안에 실제로 교차가 있었으면 그 사실(daysAgo)을,
    # ② 아직 교차 전이지만 두 선 간격이 눈에 띄게 좁혀지는 중이면 "임박"(near) 신호를 돌려준다.
    # 두 조건 다 아니면 event=None, near=None(평소와 다를 것 없는 상태).
    def cross_signal(short_p, long_p):
        diffs = []   # [(back, short-long, gap%)], back=0이 오늘
        for back in range(0, CROSS_LOOKBACK + 2):
            s, l = sma_asof(short_p, back), sma_asof(long_p, back)
            if s is None or l is None:
                break
            diffs.append((back, s - l, (s / l - 1) * 100 if l else None))
        if len(diffs) < 2:
            return {"event": None, "daysAgo": None, "near": None}
        for i in range(len(diffs) - 1):
            back, diff, _ = diffs[i]
            _, prevDiff, _ = diffs[i + 1]
            if not diff or not prevDiff:
                continue
            if (diff > 0) != (prevDiff > 0):   # 부호가 바뀐 지점 = 그 사이 교차 발생
                if back > CROSS_LOOKBACK:
                    break
                return {"event": ("golden" if diff > 0 else "dead"), "daysAgo": back, "near": None}
        cur_gap, ref_gap = diffs[0][2], diffs[min(CROSS_NEAR_DAYS, len(diffs) - 1)][2]
        if cur_gap is None or ref_gap is None or cur_gap == 0 or ref_gap == 0:
            return {"event": None, "daysAgo": None, "near": None}
        same_side = (cur_gap > 0) == (ref_gap > 0)
        narrowing = abs(cur_gap) < abs(ref_gap) * CROSS_NEAR_SHRINK_RATIO
        close_enough = abs(cur_gap) < CROSS_NEAR_GAP_PCT
        if same_side and narrowing and close_enough:
            return {"event": None, "daysAgo": None, "near": ("dead" if cur_gap > 0 else "golden")}
        return {"event": None, "daysAgo": None, "near": None}

    def ma_block(period):
        # ⭐ 2026-08-06: period일치가 없다고 "데이터 부족"으로 숨기지 않는다. 대신 있는 만큼
        # (eff일)만 평균 내고, 며칠짜리 평균인지(effDays)와 "정식(60일 다 채움)"인지(full)를
        # 함께 돌려준다 — 화면은 이 eff로 "54일선"처럼 실제 일수를 그대로 이름표에 쓴다.
        # (예전 버그와의 차이: 예전엔 54일 평균에 "60일선"이라는 가짜 이름을 붙였다.
        #  지금은 진짜 이름(54일선)을 붙이고, 60일 다 채워야만 "60일선"이라 부른다.)
        eff = min(period, n)
        if eff < MA_MIN_DAYS:
            return None, None, None, eff, False
        ma = sum(closes[-eff:]) / eff
        gap = round((cur / ma - 1) * 100, 1)
        full = eff >= period
        slope = None
        if full:   # 기울기는 정식 구간이 다 찼을 때만 계산(들쭉날쭉한 임시 구간의 기울기는 의미가 약해서)
            prev = sma_asof(period, MA_SLOPE_LOOKBACK)
            slope = round((ma / prev - 1) * 100, 2) if prev else None
        return round(ma), gap, slope, eff, full

    ma5, ma5Gap, ma5Slope, ma5Days, ma5Full = ma_block(5)
    ma20, ma20Gap, ma20Slope, ma20Days, ma20Full = ma_block(20)
    ma60, ma60Gap, ma60Slope, ma60Days, ma60Full = ma_block(60)
    ma120, ma120Gap, ma120Slope, ma120Days, ma120Full = ma_block(120)
    ma200, ma200Gap, ma200Slope, ma200Days, ma200Full = ma_block(200)
    cross5_20 = cross_signal(5, 20)
    cross20_60 = cross_signal(20, 60)
    # ⚠️ RSI·ret5는 indicator_math의 공용 함수만 쓴다.
    #    QUANT가 '오늘 상태'와 '과거 상태'를 비교하는데, 두 경로가 다른 식을 쓰면
    #    같은 날짜인데도 값이 달라져 엉뚱한 과거 사례와 매칭된다(2026-08-15 발견).
    rsi = indicator_math.wilder_rsi(closes)
    ret5 = indicator_math.ret_n(closes, indicator_math.RET_LOOKBACK)
    e12, e26 = ema_series(closes, 12), ema_series(closes, 26)
    macd = [a - b for a, b in zip(e12, e26)]
    sig = ema_series(macd[25:], 9)[-1] if len(macd) > 25 else ema_series(macd, 9)[-1]
    vol_avg = sum(vols[-21:-1]) / 20 if len(vols) > 20 else 0
    vol_ratio = vols[-1] / vol_avg if vol_avg else None   # 거래정지/저유동 종목은 0 평균 → None
    # ⭐ 2026-08-13 사용자 지정 — 오늘 장중 고가 대비 종가가 얼마나 밀렸는지(급등 후 당일
    # 반납 캔들 감지용). daily 원본에 이미 시가·고가·저가·종가가 다 있는데 여태 종가만
    # 뽑아 썼다(금호건설 8/13: 고가 18,040원 → 종가 14,290원, -20.8% 반납이 감지 안 됐었음).
    # 500종목 실측 기준 중앙값 2.5%·p90 5.8%·p99 11.7% — 이 셋보다 훨씬 큰 값만 이례적이다.
    today_giveback = None
    last_row = daily[-1] if daily else None
    if last_row and last_row.get("high") and last_row.get("close") and last_row["high"] > 0:
        today_giveback = round((last_row["high"] - last_row["close"]) / last_row["high"] * 100, 1)
    out = {
        "close": cur,
        "todayGiveback": today_giveback,
        "daysAvail": n,   # TARO 이동평균 카드가 "며칠 더 필요해요" 문구를 만드는 데 씀
        "ma5": ma5, "ma5Gap": ma5Gap, "ma5Slope": ma5Slope, "ma5Days": ma5Days, "ma5Full": ma5Full,
        "ma20": ma20, "ma20Gap": ma20Gap, "ma20Slope": ma20Slope, "ma20Days": ma20Days, "ma20Full": ma20Full,
        "ma60": ma60, "ma60Gap": ma60Gap, "ma60Slope": ma60Slope, "ma60Days": ma60Days, "ma60Full": ma60Full,
        "ma120": ma120, "ma120Gap": ma120Gap, "ma120Slope": ma120Slope, "ma120Days": ma120Days, "ma120Full": ma120Full,
        "ma200": ma200, "ma200Gap": ma200Gap, "ma200Slope": ma200Slope, "ma200Days": ma200Days, "ma200Full": ma200Full,
        "cross5_20": cross5_20, "cross20_60": cross20_60,
        "rsi14": (round(rsi, 1) if rsi is not None else None),
        # 5거래일 '간격' 수익률. last5 배열로 다시 계산하지 말고 이 값을 쓸 것.
        # (last5는 종가 5개라 간격이 4일이다. 과거 통계는 5일 간격이라 정의가 어긋난다)
        "ret5": (round(ret5, 4) if ret5 is not None else None),
        "rsi14Ready": rsi is not None,
        "ret5Ready": ret5 is not None,
        "macd": round(macd[-1]), "macdSignal": round(sig),
        "volRatio": round(vol_ratio, 2) if vol_ratio else None,
        # ⚠️ daily가 이제 ~10개월치라, min/max(closes) 전체를 쓰면 "3개월 최저/최고"라는
        # 화면 문구(가격 나침반 등)와 실제 계산 기간이 어긋난다. 최근 약 63거래일(~3개월)만 잘라 쓴다.
        "low3m": min(closes[-63:]), "high3m": max(closes[-63:]),
        "last5": [{"d": r["date"][5:], "c": r["close"]} for r in daily[-5:]],
    }
    # 📊 볼린저밴드(20일 SMA ± 표준편차 2배) — 레이더 신호와 종목 상세 차트가 같이 쓴다.
    if len(closes) >= BB_PERIOD:
        bb = bollinger(closes, BB_PERIOD, BB_STDDEV)
        u, m, l = bb["upper"][-1], bb["mid"][-1], bb["lower"][-1]
        if u is not None and l is not None and m:
            out["bb"] = {
                "upper": round(u), "mid": round(m), "lower": round(l),
                "pctB": round(bb["pctb"][-1], 3) if bb["pctb"][-1] is not None else None,
                "width": round(bb["width"][-1], 1) if bb["width"][-1] is not None else None,
            }
    return out


def risk_for(daily, live):
    """🛡️ RISK 카드용 위험 지표 — 일봉(3개월)과 52주 범위로 계산(토큰 0, 규칙 기반).
    vol20  : 최근 20거래일 일간 등락률 표준편차(%) — '하루에 평균 얼마나 출렁이는가'
    mdd3m  : 3개월 창 최대낙폭(%) — 고점 대비 가장 깊게 빠졌던 폭(음수)
    pos52w : 52주 가격 범위 내 현재가 위치(0=1년 최저, 100=1년 최고)
    reboundFromLow : 3개월 창 저점 대비 현재가 반등률(%) — vol20/mdd3m은 급등이든
        급락이든 방향을 안 가리고 똑같이 '출렁임'으로만 보는데, "낙폭과대 후 이미 크게
        반등한 종목"과 "아직 저점 근처에서 계속 흔들리는 종목"을 구분하기 위해 추가
        (2026-08-10, analyze_auto.py의 risk_overlay 감점 완화용 — vol20/mdd3m 자체 계산은
        건드리지 않음)
    grade  : low(안정)/mid(보통)/high(위험) — 변동성·낙폭 임계값 기반"""
    closes = [d.get("close") for d in (daily or []) if d.get("close")]
    if len(closes) < 6:
        return None
    rets = [(closes[i] / closes[i-1] - 1) * 100 for i in range(1, len(closes)) if closes[i-1]]
    tail = rets[-20:] if len(rets) >= 20 else rets
    mean = sum(tail) / len(tail)
    vol20 = round((sum((r - mean) ** 2 for r in tail) / len(tail)) ** 0.5, 2)
    # ⚠️ daily가 ~10개월치라 mdd3m 이름에 맞게 최근 약 63거래일(~3개월)만 잘라 쓴다.
    closes3m = closes[-63:]
    peak, mdd = closes3m[0], 0.0
    for c in closes3m:
        if c > peak:
            peak = c
        dd = (c / peak - 1) * 100
        if dd < mdd:
            mdd = dd
    mdd = round(mdd, 1)
    low3m = min(closes3m)
    rebound = round((closes[-1] / low3m - 1) * 100, 1) if low3m else None
    pos52 = None
    try:
        lo, hi = [float(x.replace(",", "").strip()) for x in str((live or {}).get("w52") or "").split("~")]
        if hi > lo:
            pos52 = max(0, min(100, round((closes[-1] - lo) / (hi - lo) * 100)))
    except Exception:
        pass
    # grade는 전 종목 수집이 끝난 뒤 main()에서 "시장 전체 대비 상대 위치"로 매긴다.
    # (절대 임계값만 쓰면 이번 주처럼 시장 전체가 요동칠 때 전 종목이 '위험'으로 쏠려 변별력이 사라진다)
    return {"vol20": vol20, "mdd3m": mdd, "pos52w": pos52, "reboundFromLow": rebound}


def assign_risk_grades(stocks):
    """전 종목 vol20 분포의 25/75 백분위로 상대 등급(low/mid/high)을 매긴다.
    절대 오버라이드: vol20 >= 6%는 시장이 아무리 험해도 high,
    vol20 < 0.1%는 거래정지·데이터 이상 가능성이 커서 low로 두지 않고 mid."""
    vols = sorted(e["risk"]["vol20"] for e in stocks.values() if e.get("risk"))
    if not vols:
        return
    p25 = vols[int(len(vols) * 0.25)]
    p75 = vols[int(len(vols) * 0.75)]
    for e in stocks.values():
        r = e.get("risk")
        if not r:
            continue
        v, mdd = r["vol20"], r["mdd3m"]
        if v >= 6 or (v >= p75 and mdd <= -30):
            g = "high"
        elif v >= p75:
            g = "high"
        elif v <= p25 and mdd >= -25 and v >= 0.1:
            g = "low"
        else:
            g = "mid"
        r["grade"] = g


def _fmt_bizdate(bd):
    s = str(bd or "")
    return f"{int(s[4:6])}/{int(s[6:8])}" if len(s) == 8 else None


def flow_summary(deal_trends, daily=None, days=6):
    dt = deal_trends[:days]
    if not dt:
        return None
    # ⭐ 2026-08-10: "최근 N거래일"이 정확히 몇 월 며칠부터인지 화면에 안 보여서
    # "지금 이 순간" 수치로 착각하기 쉬웠다(제주반도체 사례 — 사용자가 실시간 앱과
    # 비교하다 혼란). 원본 API가 이미 주는 bizdate(그날 장이 끝나야 확정되는 값)를
    # 그대로 옮겨 담을 뿐, 합산 로직 자체는 건드리지 않는다.
    period_end = _fmt_bizdate(dt[0].get("bizdate"))
    period_start = _fmt_bizdate(dt[-1].get("bizdate"))
    frgn = sum(num(r.get("foreignerPureBuyQuant")) or 0 for r in dt)
    org = sum(num(r.get("organPureBuyQuant")) or 0 for r in dt)
    indi = sum(num(r.get("individualPureBuyQuant")) or 0 for r in dt)
    today = dt[0]
    fr_rows = [int(num(row.get("foreignerPureBuyQuant")) or 0) for row in dt]
    org_rows = [int(num(row.get("organPureBuyQuant")) or 0) for row in dt]
    recent = sum(fr_rows[:2]) + sum(org_rows[:2])
    older_rows = fr_rows[2:] + org_rows[2:]
    older_daily = sum(older_rows) / max(1, len(dt) - 2) if older_rows else 0
    recent_daily = recent / min(2, len(dt))
    acceleration = recent_daily - older_daily
    joint_buy = sum(1 for f, o in zip(fr_rows, org_rows) if f > 0 and o > 0)
    joint_sell = sum(1 for f, o in zip(fr_rows, org_rows) if f < 0 and o < 0)
    foreign_buy_days = sum(1 for value in fr_rows if value > 0)
    organ_buy_days = sum(1 for value in org_rows if value > 0)
    daily = daily or []
    last_volume = float((daily[-1] if daily else {}).get("volume") or 0)
    # ⚠️ 기존 근사치: 마지막 하루 거래량 × 일수. 거래량이 들쭉날쭉한 종목에서 크게 틀린다.
    #    호환성을 위해 flowRatioPct는 그대로 두고, 아래에 **같은 날짜끼리 맞춘**
    #    실제 기간 거래량 합계를 따로 계산해 정규화 후보(A1)가 쓰게 한다.
    flow_ratio = (frgn + org) / (last_volume * len(dt)) * 100 if last_volume and dt else None

    # ── 실제 기간 거래량 (요구 7-1) ──────────────────────────────────────────
    # dealTrends의 bizdate(YYYYMMDD)와 daily의 date(YYYY-MM-DD)를 **정확히 같은
    # 날짜끼리** 맞춘다. 근사(last_volume × days)를 쓰지 않는다.
    volume_by_date = {}
    for row in daily:
        d = str(row.get("date") or "").replace("-", "")
        v = row.get("volume")
        if len(d) == 8 and v:
            volume_by_date[d] = float(v)
    matched_dates = []
    period_volume = 0.0
    for row in dt:
        d = str(row.get("bizdate") or "").strip()
        if d in volume_by_date:
            period_volume += volume_by_date[d]
            matched_dates.append(d)
    # 며칠이 실제로 매칭됐는지 남긴다. 절반도 못 맞췄으면 정규화를 쓰지 않는다.
    volume_match_days = len(matched_dates)
    volume_coverage = volume_match_days / len(dt) if dt else 0.0
    if period_volume > 0 and volume_coverage >= 0.6:
        # 같은 기간 순매수 ÷ 같은 기간 실제 총거래량. 종목 규모에 자동으로 맞춰진다.
        frgn_ratio = frgn / period_volume * 100
        org_ratio = org / period_volume * 100
        volume_state = "PERIOD_VOLUME_MATCHED"
    else:
        frgn_ratio = org_ratio = None
        volume_state = ("PERIOD_VOLUME_PARTIAL" if period_volume > 0
                        else "PERIOD_VOLUME_NOT_AVAILABLE")
    price_ret5 = None
    if len(daily) >= 6 and daily[-6].get("close"):
        price_ret5 = (daily[-1]["close"] / daily[-6]["close"] - 1) * 100
    divergence = "neutral"
    if price_ret5 is not None:
        if price_ret5 < -1 and frgn + org > 0: divergence = "accumulation"
        elif price_ret5 > 1 and frgn + org < 0: divergence = "distribution"
        elif price_ret5 > 1 and frgn + org > 0: divergence = "confirmation_up"
        elif price_ret5 < -1 and frgn + org < 0: divergence = "confirmation_down"
    quality = 0.0
    quality += (foreign_buy_days / len(dt) - .5) * 18
    quality += (organ_buy_days / len(dt) - .5) * 14
    quality += (joint_buy - joint_sell) / len(dt) * 16
    if flow_ratio is not None: quality += max(-20, min(20, flow_ratio * 2.5))
    if acceleration:
        scale = max(1, abs(frgn + org) / max(1, len(dt)))
        quality += max(-12, min(12, acceleration / scale * 4))
    quality += {"accumulation": 8, "distribution": -8, "confirmation_up": 5,
                "confirmation_down": -5}.get(divergence, 0)
    return {
        "days": len(dt),
        "periodStart": period_start, "periodEnd": period_end,
        "frgnSum": int(frgn), "orgSum": int(org), "indiSum": int(indi),
        "holdNow": num(dt[0].get("foreignerHoldRatio")),
        "holdBefore": num(dt[-1].get("foreignerHoldRatio")),
        "todayFrgn": int(num(today.get("foreignerPureBuyQuant")) or 0),
        "todayOrg": int(num(today.get("organPureBuyQuant")) or 0),
        "todayIndi": int(num(today.get("individualPureBuyQuant")) or 0),
        "foreignBuyDays": foreign_buy_days, "organBuyDays": organ_buy_days,
        "jointBuyDays": joint_buy, "jointSellDays": joint_sell,
        "acceleration": round(acceleration),
        "flowRatioPct": round(flow_ratio, 3) if flow_ratio is not None else None,
        # 정규화 후보(A1) 전용 — 같은 날짜끼리 맞춘 실제 기간 거래량 기준
        "periodVolume": int(period_volume) if period_volume else None,
        "volumeMatchDays": volume_match_days,
        "volumeState": volume_state,
        "frgnRatioPct": round(frgn_ratio, 4) if frgn_ratio is not None else None,
        "orgRatioPct": round(org_ratio, 4) if org_ratio is not None else None,
        "priceRet5": round(price_ret5, 2) if price_ret5 is not None else None,
        "divergence": divergence, "qualityScore": round(max(-50, min(50, quality)), 1),
    }


def load_index_history():
    """index_history.js(update_index_history.py 생성, TARO 3단계)를 안전하게 읽는다.
    러너가 아직 한 번도 안 돌았거나 실패했을 수 있어 파일이 없어도 죽지 않는다."""
    path = os.path.join(HERE, "index_history.js")
    if not os.path.exists(path):
        return {}
    try:
        return load_js_object(path, "INDEX_HISTORY") or {}
    except Exception as e:
        print(f"[경고] index_history.js 로드 실패: {e}")
        return {}


def flatten_index_daily(pages):
    rows = {}
    for p in pages or []:
        for d in p.get("days", []):
            if d.get("date"):
                rows[d["date"]] = d
    return [rows[k] for k in sorted(rows)]


def main():
    raw = json.load(open(os.path.join(HERE, "analysis_data.json"), encoding="utf-8"))
    live = load_js_object(os.path.join(HERE, "data.js"), "LIVE_DATA")
    sectors = load_sectors()
    out = {
        "generatedAt": datetime.datetime.now(KST).strftime("%Y-%m-%d %H:%M"),
        "priceLabel": live.get("date"),
        "indices": live.get("indices"),
        "stocks": {},
    }
    # 📈 코스피·코스닥 이동평균(TARO 3단계) — 종목과 똑같은 indicators_for() 엔진을 그대로 재사용한다.
    out["indicesTech"] = {}
    idx_hist = load_index_history()
    for idx_name in ("KOSPI", "KOSDAQ"):
        daily_idx = flatten_index_daily(idx_hist.get(idx_name))
        if len(daily_idx) >= 2:
            try:
                out["indicesTech"][idx_name] = indicators_for(daily_idx)
            except Exception as e:
                print(f"[경고] {idx_name} 지수 지표 계산 실패: {e}")
    skipped = []
    for code, s in raw["stocks"].items():
        # 종목 하나가 이상 데이터로 에러를 던져도 전체(500종목)가 죽지 않게 개별 보호
        try:
            d = live["stocks"].get(code, {})
            entry = {"name": s.get("name", code), "price": d.get("price"), "rate": d.get("rate"),
                     "stale": d.get("stale", False),
                     "per": d.get("per"), "pbr": d.get("pbr"), "roe": d.get("roe"),
                     "eps": d.get("eps"), "div": d.get("div"), "w52": d.get("w52"),
                     "cap": d.get("cap")}
            info = (s.get("info") or {})
            ti = info.get("totalInfos") or {}
            entry["cnsEps"] = num(ti.get("cnsEps"))
            cons = info.get("consensus") or {}
            entry["targetMean"] = num(cons.get("priceTargetMean"))
            entry["recommMean"] = num(cons.get("recommMean"))
            if entry["targetMean"] and entry["price"]:
                entry["targetGap"] = round((entry["targetMean"] / entry["price"] - 1) * 100, 1)
            if entry["cnsEps"] and entry["price"]:
                entry["fwdPer"] = round(entry["price"] / entry["cnsEps"], 1)
            daily = s.get("daily") or []
            entry["tech"] = indicators_for(daily) if len(daily) >= 2 else None
            entry["flow"] = flow_summary(info.get("dealTrends") or [], daily)
            entry["risk"] = risk_for(daily, d)   # 🛡️ RISK 카드용(브라우저가 직접 읽음)
            entry["sector"] = sectors.get(code, "기타")
            if len(daily) >= 6 and daily[-6].get("close"):
                entry["_ret5"] = round((daily[-1]["close"] / daily[-6]["close"] - 1) * 100, 2)
            if len(daily) >= 2 and daily[-2].get("close"):
                entry["_ret1"] = round((daily[-1]["close"] / daily[-2]["close"] - 1) * 100, 2)
            out["stocks"][code] = entry
        except Exception as e:
            skipped.append(f"{code}({e})")
            continue
    if skipped:
        print(f"[경고] 지표 계산 건너뜀 {len(skipped)}종목: {skipped[:10]}{' …' if len(skipped)>10 else ''}")
    assign_risk_grades(out["stocks"])   # 🛡️ 전 종목 분포 기준 상대 위험등급
    # 📐 같은 날짜의 시장·업종 대비 상대강도. 외부 API 없이 수집된 500종목 단면만 사용한다.
    market_returns = [entry["_ret5"] for entry in out["stocks"].values() if entry.get("_ret5") is not None]
    market_returns1 = [entry["_ret1"] for entry in out["stocks"].values() if entry.get("_ret1") is not None]
    market_median = statistics.median(market_returns) if market_returns else 0.0
    sector_returns = {}
    for entry in out["stocks"].values():
        if entry.get("_ret5") is not None:
            sector_returns.setdefault(entry.get("sector", "기타"), []).append(entry["_ret5"])
    sector_medians = {sector: statistics.median(values) for sector, values in sector_returns.items() if values}
    for entry in out["stocks"].values():
        ret5 = entry.pop("_ret5", None)
        entry.pop("_ret1", None)
        if ret5 is None:
            continue
        sector = entry.get("sector", "기타")
        values = sorted(sector_returns.get(sector) or [ret5])
        rank = sum(value <= ret5 for value in values) / len(values) * 100
        entry["relative"] = {"ret5": ret5, "marketMedian5": round(market_median, 2),
                             "vsMarket": round(ret5 - market_median, 2),
                             "sectorMedian5": round(sector_medians.get(sector, market_median), 2),
                             "vsSector": round(ret5 - sector_medians.get(sector, market_median), 2),
                             "sectorPercentile": round(rank)}
    median_vol = statistics.median([entry["risk"]["vol20"] for entry in out["stocks"].values() if entry.get("risk")])
    trend = "up" if market_median > 1 else ("down" if market_median < -1 else "side")
    median_ret1 = statistics.median(market_returns1) if market_returns1 else 0.0
    out["marketRegime"] = {"key": f"{trend}_{'high' if median_vol >= 3 else 'low'}",
                           "trend": trend, "vol": "high" if median_vol >= 3 else "low",
                           "medianRet5": round(market_median, 2), "medianVol20": round(median_vol, 2),
                           "advanceRatio5": round(sum(ret > 0 for ret in market_returns) / len(market_returns) * 100, 1) if market_returns else 0.0,
                           "medianRet1": round(median_ret1, 2),
                           "advanceRatio1": round(sum(ret > 0 for ret in market_returns1) / len(market_returns1) * 100, 1) if market_returns1 else 0.0}
    path = os.path.join(HERE, "indicators.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"indicators.json 저장 완료 ({out['generatedAt']}) — {len(out['stocks'])}종목")

    # 브라우저용 축약본(indicators.js) — TARO 미니 차트(가격·MA·RSI·MACD)가 index.html에서 직접 읽는다.
    # analysis.js 텍스트를 파싱하지 않고 이 구조화된 숫자를 그대로 그린다.
    # ⭐ 2026-08-08: DIANA·FLOW 카드 재설계로 flow(수급 원자료)와 목표가·선행PER 필드도
    # 문장 파싱 없이 화면이 바로 쓸 수 있게 함께 내려준다(PER·PBR·ROE·EPS는 STOCKS(data.js)에
    # 이미 있어 여기서는 뺀다 — 중복 전송 방지).
    js_stocks = {
        code: {"name": e["name"], "price": e["price"], "rate": e["rate"], "tech": e["tech"],
               "risk": e.get("risk"), "flow": e.get("flow"),
               "cnsEps": e.get("cnsEps"), "targetMean": e.get("targetMean"),
               "targetGap": e.get("targetGap"), "fwdPer": e.get("fwdPer")}
        for code, e in out["stocks"].items() if e.get("tech")
    }
    js_path = os.path.join(HERE, "indicators.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: compute_indicators.py · 브라우저용 기술지표 축약본 (TARO 미니 차트)\n")
        f.write(f"const INDICATORS = {json.dumps({'generatedAt': out['generatedAt'], 'stocks': js_stocks, 'indicesTech': out['indicesTech']}, ensure_ascii=False)};\n")
    print(f"indicators.js 저장 완료 (브라우저용, {len(js_stocks)}종목, 지수 {len(out['indicesTech'])}개)")

    # 🚀 홈 경량본(indicators_home.js) — 2026-08-28 신설.
    #
    # 왜: 위 indicators.js가 1MB가 넘는데, 홈 화면이 실제로 읽는 건 두 가지뿐이다.
    #     Proxy로 계측한 결과(600종목 전수 · 390px·1280px 동일):
    #       · indicesTech        1.7KB  ← 코스피·코스닥 지수 카드
    #       · stocks[*].tech.last5 71KB ← 홈 종목 칩 미니 그래프
    #     나머지 93%(tech 나머지·flow 287KB·risk 44KB)는 **종목을 눌러야** 쓰인다.
    #     그래서 홈은 이 파일만 즉시 받고, 전체는 종목 화면에서 지연 로딩한다.
    #
    # ⚠️ 이 파일에 필드를 더 넣지 말 것. 늘리는 만큼 홈이 다시 느려진다.
    #    새 필드가 홈에 필요하면 "정말 첫 화면에 필요한가"를 먼저 계측할 것.
    home_last5 = {code: e["tech"]["last5"]
                  for code, e in js_stocks.items()
                  if isinstance(e.get("tech"), dict) and e["tech"].get("last5")}
    home_path = os.path.join(HERE, "indicators_home.js")
    with open(home_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성: compute_indicators.py · 홈 화면 전용 경량본\n")
        f.write("// 전체 지표는 indicators.js — 종목 화면에서 지연 로딩한다(index.html GaeoFeatures).\n")
        f.write("const INDICATORS_HOME = %s;\n" % json.dumps(
            {"generatedAt": out["generatedAt"], "indicesTech": out["indicesTech"],
             "last5": home_last5}, ensure_ascii=False))
    _full = os.path.getsize(js_path)
    _home = os.path.getsize(home_path)
    print("indicators_home.js 저장 완료 (%d종목 last5, %.1fKB — 전체의 %.1f%%)"
          % (len(home_last5), _home / 1024, _home / _full * 100))


if __name__ == "__main__":
    main()
