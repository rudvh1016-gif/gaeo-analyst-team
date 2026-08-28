#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""전체시장 일별 기록은 '그날의 종가'여야 한다 — 계약 테스트 (2026-08-28 신설).

왜 있나
    collect_market_universe.py의 일별 History 적재 조건이
    `hour_kst >= 15 and not os.path.exists(hist_path)`였다.
    정규장 마감은 15:30인데 15:00부터 쓸 수 있었고, 한 번 쓰이면 `not exists`
    때문에 정작 마감 회차가 덮어쓰지 못했다. 그 결과 적재된 10일이 전부
    15:02~15:29 장중 스냅샷이었다. 2026-08-28 실측으로는 상승 종목이
    1,367개(15:13)로 굳었는데 실제 종가는 1,490개 — 123종목이 어긋났다.
    주석에는 처음부터 "장 마감 후"라고 적혀 있었으니, 의도가 아니라 구현이 틀렸다.

    같은 조건이 휴장일도 막지 못했다. 벤더는 휴장일에 직전 거래일 snapshot을
    그대로 주기 때문에, 2026-08-17(광복절 대체공휴일) 기록은 2026-08-14 종가의
    복제였다. 그대로 두면 평균·분포가 그 하루만큼 오염된다.

이 테스트가 지키는 계약
    ① 마감 전에는 쓰지 않는다 (기준선이 15:30 이후여야 한다)
    ② 마감 후에는 매 회차 덮어쓴다 — 그날 마지막 회차가 남아야 진짜 종가다
    ③ 휴장일에는 쓰지 않는다 (달력 + 직전 거래일 복제 감지 이중 방어)
    ④ 과거 날짜 파일은 절대 건드리지 않는다 (오늘 것만 갱신)
    ⑤ 저장소에 적재된 기록 전수가 위 계약을 만족한다
"""
import datetime as _dt
import json
import os
import re
import shutil
import sys
import tempfile

import collect_market_universe as cmu
from krx_calendar import is_krx_trading_day

HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []
KST = cmu.KST


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


class FrozenDatetime(_dt.datetime):
    """now()만 고정한 datetime — 수집기가 '지금 몇 시인지' 묻는 곳을 전부 덮는다."""
    instant = None

    @classmethod
    def now(cls, tz=None):
        return cls.instant if tz is None else cls.instant.astimezone(tz)


FIELDS = {"stockEndType", "tradableStatus", "fluctuationsRatio",
          "closePriceRaw", "marketValueRaw", "accumulatedTradingValueRaw"}


def row(code, rate, cap=1000.0):
    return {"itemCode": code, "stockName": f"주식{code}", "stockEndType": "stock",
            "tradableStatus": "tradable", "fluctuationsRatio": str(rate),
            "closePriceRaw": "10000", "marketValueRaw": str(cap),
            "accumulatedTradingValueRaw": "100"}


# ── ① 코드 계약 ────────────────────────────────────────────────────────────
src = open(os.path.join(HERE, "collect_market_universe.py"), encoding="utf-8").read()
after = getattr(cmu, "HISTORY_WRITE_AFTER_KST", None)
check("① 기록 시작 시각 상수가 있다", isinstance(after, tuple) and len(after) == 2, repr(after))
if isinstance(after, tuple):
    check("① 기준선이 정규장 마감(15:30) 이후다", after >= (15, 30),
          f"{after} — 마감 전 숫자가 그날 기록으로 굳는다")
# 옛 버그의 두 조각이 되살아나지 않았는지 본다.
write_block = src.split("hist_path = os.path.join(HISTORY_DIR")[-1]
check("① 첫 회차 선점(not os.path.exists)이 되살아나지 않았다",
      "not os.path.exists(hist_path)" not in write_block,
      "한 번 쓰면 마감 회차가 덮어쓸 수 없게 된다")
check("① 시(hour)만 비교하는 조건이 없다",
      not re.search(r"hour(_kst)?\s*>=\s*1[0-9]\b", write_block),
      "15:00과 15:29를 구분하지 못한다 — (시, 분) 쌍으로 비교할 것")
check("① 휴장일 가드가 있다", "_is_trading_day" in write_block)
check("① 직전 거래일 복제 감지가 있다", "_duplicates_previous_day" in write_block)


# ── ②③④ 실제 동작 ─────────────────────────────────────────────────────────
def run_at(tmp, when, rate, prev_files=()):
    """지정한 시각에 수집기를 한 번 돌린다. 반환: 그날 기록(dict 또는 None)."""
    orig = {n: getattr(cmu, n) for n in
            ("OUT_DIR", "STATE_PATH", "VERIFY_PATH", "RAW_LATEST", "PUBLIC_JS", "HISTORY_DIR")}
    orig_dt, orig_collect = cmu.datetime, cmu.collect_market
    try:
        cmu.OUT_DIR = tmp
        cmu.STATE_PATH = os.path.join(tmp, "state.json")
        cmu.VERIFY_PATH = os.path.join(tmp, "source_verify.json")
        cmu.RAW_LATEST = os.path.join(tmp, "raw.json.gz")
        cmu.PUBLIC_JS = os.path.join(tmp, "market_context.js")
        cmu.HISTORY_DIR = os.path.join(tmp, "history")
        os.makedirs(cmu.HISTORY_DIR, exist_ok=True)
        for name, body in prev_files:
            with open(os.path.join(cmu.HISTORY_DIR, name), "w", encoding="utf-8") as f:
                json.dump(body, f, ensure_ascii=False)
        with open(cmu.VERIFY_PATH, "w", encoding="utf-8") as f:
            json.dump({"markets": {"KOSPI": {"stockFields": {k: {} for k in FIELDS}}}}, f)
        FrozenDatetime.instant = when
        cmu.datetime = FrozenDatetime
        # 오르는 종목 수를 rate로 조절해 회차마다 다른 집계를 만든다.
        cmu.collect_market = lambda market: (
            [row(f"{i:06d}", rate if i % 2 == 0 else -1.0) for i in range(900)], 900)
        cmu.run_full()
        day = when.astimezone(KST).strftime("%Y-%m-%d")
        path = os.path.join(cmu.HISTORY_DIR, day + ".json")
        return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else None
    finally:
        cmu.datetime, cmu.collect_market = orig_dt, orig_collect
        for n, v in orig.items():
            setattr(cmu, n, v)


OPEN_DAY = _dt.date(2026, 8, 28)      # 금요일 · 거래일
HOLIDAY = _dt.date(2026, 8, 17)       # 광복절 대체공휴일 · 휴장


def at(day, h, m):
    return _dt.datetime(day.year, day.month, day.day, h, m, tzinfo=KST)


tmp = tempfile.mkdtemp(prefix="gaeo_hist_")
try:
    check("② 마감 전(15:29)에는 그날 기록을 만들지 않는다",
          run_at(tmp, at(OPEN_DAY, 15, 29), 2.0) is None,
          "장중 숫자가 그날 기록으로 굳는다")
finally:
    shutil.rmtree(tmp, ignore_errors=True)

tmp = tempfile.mkdtemp(prefix="gaeo_hist_")
try:
    first = run_at(tmp, at(OPEN_DAY, 15, 41), 2.0)
    check("② 마감 후(15:41)에는 기록을 만든다", first is not None)
    check("② 마감 스냅샷임을 표시한다(closeConfirmed)",
          bool(first and first.get("closeConfirmed") is True))
    later = run_at(tmp, at(OPEN_DAY, 16, 5), 7.0)
    check("② 그날 마지막 회차가 앞 회차를 덮어쓴다",
          bool(later and later["asOf"] != (first or {}).get("asOf")),
          "16:05 회차가 15:41 기록을 못 덮어쓰면 종가가 아니다")
    check("② 덮어쓴 값이 마지막 회차의 집계다",
          bool(later and later["market"]["equalWeightReturn"]
               != (first or {}).get("market", {}).get("equalWeightReturn"))) 
finally:
    shutil.rmtree(tmp, ignore_errors=True)

tmp = tempfile.mkdtemp(prefix="gaeo_hist_")
try:
    check("③ 휴장일에는 기록을 만들지 않는다(달력)",
          run_at(tmp, at(HOLIDAY, 16, 5), 2.0) is None,
          "직전 거래일 종가가 복제돼 평균이 오염된다")
finally:
    shutil.rmtree(tmp, ignore_errors=True)

tmp = tempfile.mkdtemp(prefix="gaeo_hist_")
try:
    # 달력이 모르는 임시 휴장: 직전 거래일과 집계가 완전히 같으면 새 장이 아니다.
    seed = run_at(tmp, at(_dt.date(2026, 8, 27), 16, 5), 2.0)
    dup = run_at(tmp, at(OPEN_DAY, 16, 5), 2.0,
                 prev_files=[("2026-08-27.json", seed)]) if seed else None
    check("③ 직전 거래일과 집계가 똑같으면 기록하지 않는다(임시 휴장 방어)",
          dup is None, "달력이 놓친 휴장에서 직전 종가가 복제된다")
finally:
    shutil.rmtree(tmp, ignore_errors=True)

tmp = tempfile.mkdtemp(prefix="gaeo_hist_")
try:
    past = {"day": "2026-08-26", "asOf": "옛기록", "market": {"advancers": 1}}
    run_at(tmp, at(OPEN_DAY, 16, 5), 3.0, prev_files=[("2026-08-26.json", past)])
    kept = json.load(open(os.path.join(tmp, "history", "2026-08-26.json"), encoding="utf-8"))
    check("④ 과거 날짜 파일은 건드리지 않는다", kept == past, str(kept)[:120])
finally:
    shutil.rmtree(tmp, ignore_errors=True)


# ── ⑤ 저장소에 적재된 기록 전수 ────────────────────────────────────────────
hist_dir = os.path.join(HERE, "market_universe", "history")
files = sorted(f for f in os.listdir(hist_dir) if f.endswith(".json")) if os.path.isdir(hist_dir) else []
check("⑤ 적재된 기록이 있다", bool(files), hist_dir)
bad_time, bad_day, bad_flag, bad_match = [], [], [], []
for name in files:
    rec = json.load(open(os.path.join(hist_dir, name), encoding="utf-8"))
    day = rec["day"]
    t = _dt.datetime.fromisoformat(rec["asOf"]).astimezone(KST)
    if (t.hour, t.minute) < cmu.HISTORY_WRITE_AFTER_KST:
        bad_time.append(f"{day}({t:%H:%M})")
    if not is_krx_trading_day(_dt.date.fromisoformat(day)):
        bad_day.append(day)
    if rec.get("closeConfirmed") is not True:
        bad_flag.append(day)
    if t.strftime("%Y-%m-%d") != day:
        bad_match.append(f"{day}≠{t:%Y-%m-%d}")
check("⑤ 전부 마감 이후 스냅샷이다", not bad_time, "장중 기록: " + ", ".join(bad_time))
check("⑤ 휴장일 기록이 없다", not bad_day, "휴장일: " + ", ".join(bad_day))
check("⑤ 전부 closeConfirmed 표시가 있다", not bad_flag, "누락: " + ", ".join(bad_flag))
check("⑤ 기록 시각의 날짜가 그날과 같다", not bad_match, ", ".join(bad_match))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_market_history_close: 전체 통과")
