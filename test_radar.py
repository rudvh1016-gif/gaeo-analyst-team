#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 📡 GAEO 레이더 검증 (외부 라이브러리 없이 실행)

실행: python3 test_radar.py
  1) 계산 검증 — 알려진 가격 배열로 볼린저밴드·RSI·MACD·이동평균·거래량 배율 확인
  2) 경계 통과 검증 — RSI 30/70 상·하향, 밴드 이탈·재진입, 거래량 2배 경계, 교차
  3) 예외 처리 검증 — 데이터 부족(신규상장), 거래량 0(거래정지), 상태 vs 신규 변화 구분
  4) 산출물 검증 — radar.json이 있으면 집계 합계·중복·NaN·기준일 일치까지 확인
"""
import json, math, os, sys

import radar_signals as R

HERE = os.path.dirname(os.path.abspath(__file__))
FAILED = []
PASSED = 0


def check(name, cond, detail=""):
    global PASSED
    if cond:
        PASSED += 1
        print(f"  ✅ {name}")
    else:
        FAILED.append(f"{name}{(' — ' + detail) if detail else ''}")
        print(f"  ❌ {name} {detail}")


def approx(a, b, tol=1e-6):
    return a is not None and b is not None and abs(a - b) <= tol


def bars(closes, vols=None, start_day=1):
    """일봉 리스트 생성 — 날짜는 2026-01-01부터 순차(거래일 구분은 검증에 영향 없음)."""
    n = len(closes)
    vols = vols if vols is not None else [1000] * n
    out = []
    for i in range(n):
        day = start_day + i
        out.append({"date": f"2026-{(day - 1) // 28 + 1:02d}-{(day - 1) % 28 + 1:02d}",
                    "close": closes[i], "volume": vols[i]})
    return out


def types_of(daily, code="000000", name="테스트"):
    evs, note = R.detect_events(code, name, daily)
    return {e["type"] for e in evs}, evs, note


# ══════════════════════════════════════════════════════════════════
print("\n[1] 계산 검증 — 알려진 가격 배열")
# ══════════════════════════════════════════════════════════════════
# 볼린저밴드: 종가 1..20 → SMA=10.5, 모집단 표준편차=sqrt((20²−1)/12)=5.7662812…
closes = list(range(1, 21))
bb = R.bollinger(closes, 20, 2)
sd = math.sqrt((20 ** 2 - 1) / 12)
check("볼린저 중심선 = 20일 단순평균(10.5)", approx(bb["mid"][-1], 10.5))
check("볼린저 상단 = 중심선 + 2σ", approx(bb["upper"][-1], 10.5 + 2 * sd, 1e-9),
      f"기대 {10.5 + 2 * sd:.6f} / 실제 {bb['upper'][-1]}")
check("볼린저 하단 = 중심선 − 2σ", approx(bb["lower"][-1], 10.5 - 2 * sd, 1e-9))
check("볼린저 앞 19일은 값 없음(None)", all(v is None for v in bb["mid"][:19]))
# %B는 하단 이탈이면 0 미만, 상단 돌파면 1 초과가 되어야 한다
_osc = [100, 101, 99, 102, 98] * 4
check("%B < 0 이면 하단 이탈", R.bollinger(_osc + [70], 20, 2)["pctb"][-1] < 0)
check("%B > 1 이면 상단 돌파", R.bollinger(_osc + [140], 20, 2)["pctb"][-1] > 1)

# 변동 없는 종가(표준편차 0) → 상단=중심=하단, %B는 계산 불가(None)
flat = R.bollinger([100] * 25, 20, 2)
check("표준편차 0이면 상·중·하단이 같다", approx(flat["upper"][-1], 100) and approx(flat["lower"][-1], 100))
check("표준편차 0이면 %B는 None(0으로 나누지 않음)", flat["pctb"][-1] is None)
check("밴드폭(Band Width) 0%", approx(flat["width"][-1], 0))

# %B 정의 확인: 종가 = 하단 + 0.25×(상단−하단) 이면 %B=0.25
seq = [10, 12] * 10          # 20개
b2 = R.bollinger(seq, 20, 2)
u, l, c = b2["upper"][-1], b2["lower"][-1], seq[-1]
check("%B = (종가−하단)/(상단−하단)", approx(b2["pctb"][-1], (c - l) / (u - l), 1e-9))

# RSI 교과서 성질
check("계속 오르기만 하면 RSI 100", approx(R.rsi_series(list(range(1, 40)))[-1], 100))
check("계속 내리기만 하면 RSI 0", approx(R.rsi_series(list(range(40, 1, -1)))[-1], 0))
check("RSI는 14번째 종가부터 계산", R.rsi_series([100] * 30)[13] is None and R.rsi_series(list(range(1, 31)))[14] is not None)
check("데이터가 15개 미만이면 RSI 전부 None", all(v is None for v in R.rsi_series([1, 2, 3])))

# 이동평균
check("SMA(3) = 직전 3개 평균", approx(R.sma_series([1, 2, 3, 4, 5], 3)[-1], 4))
check("SMA 앞부분은 None", R.sma_series([1, 2, 3, 4, 5], 3)[1] is None)

# MACD: 계속 오르는 종가면 MACD > 0
m, s = R.macd_series(list(range(1, 80)))
check("상승 추세에서 MACD > 0", m[-1] > 0)
check("MACD 시그널은 26번째부터", s[24] is None and s[25] is not None)

# 거래량 배율: 직전 20일 평균 1000, 당일 2500 → 2.5배
ratio, avg = R.volume_ratio_series([1000] * 20 + [2500])
check("거래량 평균은 당일 제외 직전 20일", approx(avg[-1], 1000))
check("거래량 배율 = 당일 / 직전 20일 평균", approx(ratio[-1], 2.5))

# ══════════════════════════════════════════════════════════════════
print("\n[2] 경계 통과 검증 — '상태'가 아니라 '새로 넘은 순간'만 신호")
# ══════════════════════════════════════════════════════════════════


def rsi_cross_series(up):
    """RSI가 처음으로 기준선을 넘는 지점까지의 종가 배열을 만들어 준다."""
    if up:                                  # 30 아래 → 30 위 (과매도 탈출)
        base = [100 - 3 * i for i in range(26)]           # 급락으로 RSI를 30 밑으로
        seq = base + [base[-1] + 4 * i for i in range(1, 30)]
        target, want_below_first = R.RSI_OVERSOLD, True
    else:                                   # 30 위 → 30 아래 (과매도 진입)
        base = [100 + i for i in range(26)]
        seq = base + [base[-1] - 4 * i for i in range(1, 30)]
        target, want_below_first = R.RSI_OVERSOLD, False
    rs = R.rsi_series(seq)
    for i in range(1, len(seq)):
        p, c = rs[i - 1], rs[i]
        if p is None or c is None:
            continue
        if want_below_first and p < target <= c:
            return seq[:i + 1], seq[:i + 2]
        if (not want_below_first) and p >= target > c:
            return seq[:i + 1], seq[:i + 2]
    return None, None


def rsi70_cross_series(up):
    if up:                                   # 70 이하 → 70 초과 (과매수 진입)
        base = [100 - i for i in range(26)]
        seq = base + [base[-1] + 4 * i for i in range(1, 30)]
        cmp_ = lambda p, c: p <= R.RSI_OVERBOUGHT < c      # noqa: E731
    else:                                    # 70 초과 → 70 이하 (과매수 탈출)
        base = [100 + 3 * i for i in range(26)]
        seq = base + [base[-1] - 4 * i for i in range(1, 30)]
        cmp_ = lambda p, c: p > R.RSI_OVERBOUGHT >= c      # noqa: E731
    rs = R.rsi_series(seq)
    for i in range(1, len(seq)):
        p, c = rs[i - 1], rs[i]
        if p is not None and c is not None and cmp_(p, c):
            return seq[:i + 1], seq[:i + 2]
    return None, None


for label, maker, arg, want in [
    ("RSI 30 하향 돌파 → 과매도 진입", rsi_cross_series, False, "rsi_oversold_entry"),
    ("RSI 30 상향 돌파 → 과매도 탈출", rsi_cross_series, True, "rsi_oversold_exit"),
    ("RSI 70 상향 돌파 → 과매수 진입", rsi70_cross_series, True, "rsi_overbought_entry"),
    ("RSI 70 하향 돌파 → 과매수 탈출", rsi70_cross_series, False, "rsi_overbought_exit"),
]:
    at_cross, day_after = maker(arg)
    if at_cross is None:
        check(label, False, "테스트용 시나리오 생성 실패")
        continue
    t1, evs1, _ = types_of(bars(at_cross))
    t2, _, _ = types_of(bars(day_after))
    check(label, want in t1, f"실제 {sorted(t1)}")
    check(f"{label} — 다음 날은 '상태'일 뿐 재생성 안 함", want not in t2, f"실제 {sorted(t2)}")

# 볼린저 밴드 이탈 / 재진입
osc = [100, 101, 99, 102, 98] * 5          # 25일 진동(밴드 형성)
break_seq = osc + [70]                      # 급락 → 하단 아래
t, evs, _ = types_of(bars(break_seq))
check("밴드 하단 이탈 감지", "bb_lower_break" in t, f"실제 {sorted(t)}")
t2, _, _ = types_of(bars(break_seq + [70]))
check("밴드 하단 이탈 — 다음 날 중복 생성 안 함", "bb_lower_break" not in t2)
t3, _, _ = types_of(bars(break_seq + [101]))
check("밴드 하단 재진입 감지", "bb_lower_recover" in t3, f"실제 {sorted(t3)}")

up_seq = osc + [140]
t4, _, _ = types_of(bars(up_seq))
check("밴드 상단 돌파 감지", "bb_upper_break" in t4, f"실제 {sorted(t4)}")
t5, _, _ = types_of(bars(up_seq + [100]))
check("밴드 상단 재진입 감지", "bb_upper_recover" in t5, f"실제 {sorted(t5)}")

# 거래량 2배 경계 (>= 2.0 이면 급증)
flat_closes = [100 + (i % 3) for i in range(21)]
t_on, _, _ = types_of(bars(flat_closes, [1000] * 20 + [2000]))
t_off, _, _ = types_of(bars(flat_closes, [1000] * 20 + [1999]))
t_big, evs_big, _ = types_of(bars(flat_closes, [1000] * 20 + [3400]))
check("거래량 정확히 2.0배 → 급증", "volume_spike" in t_on)
check("거래량 1.999배 → 급증 아님", "volume_spike" not in t_off)
check("거래량 3.4배 → 급증", "volume_spike" in t_big)
spike = next(e for e in evs_big if e["type"] == "volume_spike")
check("거래량 급증 현재값 = 3.4배", approx(spike["currentValue"], 3.4, 1e-9), str(spike["currentValue"]))

# MACD 교차
mac_up = [100 - i for i in range(40)] + [60 + 3 * i for i in range(1, 40)]
found_g = found_d = False
mm, ss = R.macd_series(mac_up)
for i in range(1, len(mac_up)):
    if None in (mm[i - 1], ss[i - 1], mm[i], ss[i]):
        continue
    if i + 1 < R.MIN_BARS_MACD:
        continue
    dp, dc = mm[i - 1] - ss[i - 1], mm[i] - ss[i]
    if dp <= 0 < dc and not found_g:
        tg, _, _ = types_of(bars(mac_up[:i + 1]))
        check("MACD 골든크로스 감지", "macd_golden_cross" in tg, f"실제 {sorted(tg)}")
        found_g = True
mac_dn = [100 + 3 * i for i in range(40)] + [220 - 3 * i for i in range(1, 40)]
mm, ss = R.macd_series(mac_dn)
for i in range(1, len(mac_dn)):
    if None in (mm[i - 1], ss[i - 1], mm[i], ss[i]) or i + 1 < R.MIN_BARS_MACD:
        continue
    dp, dc = mm[i - 1] - ss[i - 1], mm[i] - ss[i]
    if dp >= 0 > dc and not found_d:
        td, _, _ = types_of(bars(mac_dn[:i + 1]))
        check("MACD 데드크로스 감지", "macd_dead_cross" in td, f"실제 {sorted(td)}")
        found_d = True
check("MACD 골든/데드크로스 시나리오 생성", found_g and found_d)

# MA20 · MA60 교차 (61일 이상 필요)
ma_up = [100 - i * 0.5 for i in range(70)] + [65 + 3 * i for i in range(1, 40)]
s20, s60 = R.sma_series(ma_up, 20), R.sma_series(ma_up, 60)
hit = False
for i in range(R.MIN_BARS_MA, len(ma_up)):
    if None in (s20[i - 1], s60[i - 1], s20[i], s60[i]):
        continue
    if (s20[i - 1] - s60[i - 1]) <= 0 < (s20[i] - s60[i]):
        tm, _, _ = types_of(bars(ma_up[:i + 1]))
        check("MA20·60 골든크로스 감지", "ma_golden_cross" in tm, f"실제 {sorted(tm)}")
        hit = True
        break
check("MA 골든크로스 시나리오 생성", hit)

ma_dn = [100 + i * 0.5 for i in range(70)] + [135 - 3 * i for i in range(1, 40)]
s20, s60 = R.sma_series(ma_dn, 20), R.sma_series(ma_dn, 60)
hit = False
for i in range(R.MIN_BARS_MA, len(ma_dn)):
    if None in (s20[i - 1], s60[i - 1], s20[i], s60[i]):
        continue
    if (s20[i - 1] - s60[i - 1]) >= 0 > (s20[i] - s60[i]):
        tm, _, _ = types_of(bars(ma_dn[:i + 1]))
        check("MA20·60 데드크로스 감지", "ma_dead_cross" in tm, f"실제 {sorted(tm)}")
        hit = True
        break
check("MA 데드크로스 시나리오 생성", hit)

# ══════════════════════════════════════════════════════════════════
print("\n[3] 예외 처리 — 데이터 부족 · 거래정지 · 이상값")
# ══════════════════════════════════════════════════════════════════
_, evs, note = types_of(bars([100, 101, 102]))
check("신규 상장(3일치) → 데이터 부족 처리", note == "insufficient" and evs == [])
_, evs, note = types_of([])
check("일봉 없음 → 데이터 부족 처리", note == "insufficient" and evs == [])

t_halt, _, _ = types_of(bars(flat_closes, [0] * 21))
check("거래정지(거래량 전부 0) → 거래량 신호 없음", "volume_spike" not in t_halt)
t_halt2, _, _ = types_of(bars(flat_closes, [1000] * 20 + [0]))
check("당일 거래량 0 → 거래량 신호 없음", "volume_spike" not in t_halt2)

bad = bars([100] * 25)
bad[10]["close"] = None
bad[11]["close"] = 0
_, evs_bad, note_bad = types_of(bad)
check("종가에 None·0이 섞여도 죽지 않음", note_bad is None or note_bad == "insufficient")

_, evs_all, _ = types_of(bars(break_seq, [1000] * 25 + [9000]))
check("한 종목 복수 신호 동시 감지", len({e["type"] for e in evs_all}) >= 2, str(sorted({e['type'] for e in evs_all})))
rep = R.representative(evs_all)
check("대표 신호는 중요도 순으로 하나만 선정", rep is not None and rep["type"] in R.REPRESENTATIVE_ORDER)

# 이벤트 값에 NaN/Infinity/None이 섞이지 않는가
def clean_event(e):
    for k in ("previousValue", "currentValue", "threshold"):
        v = e.get(k)
        if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
            return False
    return bool(e.get("id") and e.get("label") and e.get("description") and e.get("caution"))


check("이벤트 숫자에 None·NaN·Infinity 없음", all(clean_event(e) for e in evs_all))
check("이벤트 ID는 같은 날 같은 신호면 항상 동일(중복 생성 방지)",
      R.detect_events("005930", "삼성전자", bars(break_seq))[0][0]["id"]
      == R.detect_events("005930", "삼성전자", bars(break_seq))[0][0]["id"])
check("문구에 매수·매도 권유 표현 없음",
      not any(w in (d["description"] + d["caution"])
              for d in R.SIGNAL_DEFS.values()
              for w in ("매수 기회", "반등 확정", "곧 상승", "바닥 확인", "무조건")))

# ══════════════════════════════════════════════════════════════════
print("\n[4] 산출물 검증 — radar.json")
# ══════════════════════════════════════════════════════════════════
path = os.path.join(HERE, "radar.json")
if not os.path.exists(path):
    print("  ⏭  radar.json 없음 — compute_radar.py 실행 후 다시 확인하세요")
else:
    rd = json.load(open(path, encoding="utf-8"))
    evs = rd.get("events", [])
    check("전체 종목 수가 500 전후로 기록됨", rd.get("universe", 0) >= 400, str(rd.get("universe")))
    check("검사 종목 + 데이터부족 + 실패 = 전체",
          rd["scanned"] + rd["insufficient"] + rd["failed"] == rd["universe"])
    check("신호 총합 = 분류별 합계", sum(rd["counts"].values()) == len(evs) == rd["total"],
          f"{sum(rd['counts'].values())} / {len(evs)} / {rd['total']}")
    ids = [e["id"] for e in evs]
    check("중복 이벤트 없음", len(ids) == len(set(ids)), f"{len(ids)} vs {len(set(ids))}")
    check("이벤트 숫자에 NaN·Infinity·None 없음", all(clean_event(e) for e in evs))
    txt = open(path, encoding="utf-8").read()
    check("파일에 NaN/Infinity 문자열 없음", "NaN" not in txt and "Infinity" not in txt)
    if evs:
        dates = {e["date"] for e in evs}
        check("모든 이벤트가 같은 기준일", len(dates) == 1, str(sorted(dates)))
        check("기준일이 시세 라벨과 일치",
              rd.get("priceDate", "")[:10] in (list(dates)[0][:10], ""),
              f"{rd.get('priceDate')} vs {list(dates)[0]}")
        check("기준 시각(priceBaseAt)이 모두 동일", len({e["priceBaseAt"] for e in evs}) == 1)
        check("상태값은 confirmed/provisional 뿐",
              {e["status"] for e in evs} <= {"confirmed", "provisional"})
        # ⚠️ 이 두 검사가 깨지면 대개 radar.json과 radar.js가 **서로 다른 세대**다.
        #    compute_radar.py는 둘을 같은 객체에서 함께 쓰므로 생성 시점엔 항상 맞는다.
        #    실제 사고(2026-08-28): `git merge -X theirs`로 데이터 생성물을 병합할 때
        #    radar.json은 옛 세대, radar.js는 새 세대가 채택돼 짝이 갈라졌다.
        #    → 고치는 법: 둘을 같은 커밋에서 함께 되돌리거나, 다음 러너 사이클을 기다린다.
        _pair = "radar.json과 radar.js가 다른 세대일 수 있다(둘을 같은 커밋에서 맞출 것)"
        check("종목별 대표 신호 목록과 이벤트 종목 수 일치",
              len(rd.get("stocks", [])) == len({e["code"] for e in evs}),
              f"stocks {len(rd.get('stocks', []))} vs 이벤트 종목 "
              f"{len({e['code'] for e in evs})} — {_pair}")
        check("'외 N건' 합계가 전체 신호 수와 일치",
              sum(1 + s["others"] for s in rd["stocks"]) == len(evs),
              f"합계 {sum(1 + s['others'] for s in rd['stocks'])} vs 신호 {len(evs)} — {_pair}")
    else:
        check("신호 0건이어도 구조는 정상", isinstance(rd.get("counts"), dict))

# ══════════════════════════════════════════════════════════════════
print(f"\n{'='*54}\n통과 {PASSED}건 · 실패 {len(FAILED)}건")
if FAILED:
    for f in FAILED:
        print(f"  ✗ {f}")
    sys.exit(1)
print("모든 검증 통과 ✅")
