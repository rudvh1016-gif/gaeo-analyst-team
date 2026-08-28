#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Paper Scalp V3 — 단타 전략이 기존 전략을 오염시키지 않고 규칙대로 사고파는가.

이 파일이 지키는 계약(하나라도 실패하면 배포하면 안 되는 것들):
  ⛔ GAEO_PAPER_SCALP_V3=0 이면 파일 하나도 만들지 않는다.
  ⛔ 원장이 분리된다. environment·전략 이름이 달라 V1·V2 기록과 섞이지 않는다.
  ⛔ 시장 폭 게이트: 중앙값이 음수면 그날은 사지 않는다.
  ⛔ 데이터 신선도: 가격 데이터가 오늘 것이 아니면 사지 않는다.
  ⛔ 하루 최대 3종목 · 업종당 1종목 · SELL 판단 종목 제외 · 당일 재진입 금지.
  ⛔ 익절 +3% / 손절 -2% / 2거래일 시간청산이 실제로 그 사유 코드로 찍힌다.
  ⛔ 관측 실패 사이클에는 익절/손절을 판정하지 않는다(가격 추측 금지).
"""
import json
import os
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_market_data as pmd
import paper_scalp_v3 as ps

KST = timezone(timedelta(hours=9))
FAILURES = []

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


D1, D2, D3 = "2026-08-18", "2026-08-19", "2026-08-20"
SYMS = ["111110", "222220", "333330", "444440", "555550", "666660"]


def calendar_open(day):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    return {"today": {"date": day, "open": True,
                      "integrated": {"regularMarket": regular}},
            "previousBusinessDay": None, "nextBusinessDay": None}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def provider_for(day, price=10_000, missing=()):
    prices = {s: {"price": price, "timestamp": f"{day}T10:00:00+09:00"}
              for s in SYMS if s not in missing}
    obs = {s: {"bestAsk": price, "bestBid": price - 10,
               "timestamp": f"{day}T10:00:00+09:00"} for s in SYMS}
    return pmd.FixtureMarketDataProvider(prices=prices, orderbooks=obs,
                                         calendar=calendar_open(day))


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": "종목" + c}
                        for c, v in calls.items()},
            "analysisCompletedAt": at}


# scan_candidates를 시나리오별로 갈아끼운다(엔진 규칙 검사가 목적 — 지표 계산은 아래 8에서 따로).
_scan_holder = {"ret": (D1, 1.0, [(s, 10.0 - i) for i, s in enumerate(SYMS)])}
_orig_scan = ps.scan_candidates
ps.scan_candidates = lambda closes: _scan_holder["ret"]
ps.load_daily_closes = lambda path=None: {}


def engine(tmp, day, price=10_000, missing=()):
    return ps.ScalpV3Engine(provider_for(day, price, missing), data_dir=tmp,
                            environment="TEST_SCALP_V3")


def ledger_rows(tmp):
    p = os.path.join(tmp, "trades.jsonl")
    if not os.path.exists(p):
        return []
    return [json.loads(l) for l in open(p, encoding="utf-8") if l.strip()]


def fresh(tmp, day, price=10_000, baseline_done=True, missing=()):
    """baseline 캡처를 끝낸 엔진을 만든다(첫 사이클은 원래 거래하지 않는다)."""
    e = engine(tmp, day, price, missing)
    if baseline_done:
        e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{day}T09:00:00+09:00"),
                    now=t(day, 9, 5))
    return e


# ── 1. 꺼짐 스위치 ───────────────────────────────────────────────────────────
off_dir = tempfile.mkdtemp(prefix="sv3_off_")
os.environ[ps.DISABLE_ENV] = "0"
saved_dir = ps.DATA_DIR
ps.DATA_DIR = off_dir
rc = ps.run_safe()
check("1. GAEO_PAPER_SCALP_V3=0 이면 아무 것도 하지 않는다(exit 0)", rc == 0)
check("1-1. 꺼져 있으면 파일을 하나도 만들지 않는다",
      os.listdir(off_dir) == [], str(os.listdir(off_dir)))
ps.DATA_DIR = saved_dir
del os.environ[ps.DISABLE_ENV]

# ── 2. 첫 사이클은 Baseline만(소급 매수 0) ───────────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_")
e = engine(tmp, D1)
e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T09:00:00+09:00"), now=t(D1, 9, 5))
check("2. 첫 사이클은 기준 상태만 기록하고 거래하지 않는다",
      not [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"])

# ── 3. 시장 폭 게이트: 중앙값 음수면 사지 않는다 ─────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_gate_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, -0.5, [(s, 5.0) for s in SYMS])
e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
check("3. 시장 폭 중앙값이 음수면 신규 진입 0",
      not [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"])

# ── 4. 신선도 게이트: 데이터가 오늘 것이 아니면 사지 않는다 ──────────────────
tmp = tempfile.mkdtemp(prefix="sv3_stale_")
e = fresh(tmp, D2)
_scan_holder["ret"] = (D1, 1.0, [(s, 5.0) for s in SYMS])       # 참고일이 어제(D1)
e.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D2}T10:00:00+09:00"), now=t(D2, 10, 5))
check("4. 가격 데이터 참고일 != 오늘이면 신규 진입 0",
      not [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"])

# ── 5. 진입: 상한 4종목 · SELL 제외 · 원장 격리 ──────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_entry_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.2, [(s, 10.0 - i) for i, s in enumerate(SYMS)])   # 후보 6
calls = {s: "BUY" for s in SYMS}
calls[SYMS[1]] = "SELL"                       # 2순위 후보가 SELL 판단
e.run_cycle(bundle(calls, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
opens = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
open_syms = [r["symbol"] for r in opens]
check("5. 하루 최대 3종목만 진입한다", len(opens) == 3, str(open_syms))
check("5-1. SELL 판단 종목은 사지 않는다", SYMS[1] not in open_syms, str(open_syms))
check("5-2. 순위대로 산다(1·3·4순위 — 2순위는 SELL이라 건너뜀)",
      open_syms == [SYMS[0], SYMS[2], SYMS[3]], str(open_syms))
check("5-3. 전략 이름이 원장에 박힌다",
      all(r.get("strategy_version") == "PAPER_SCALP_V3" for r in opens))
check("5-4. environment가 분리된다",
      all(r.get("environment") == "TEST_SCALP_V3" for r in opens))

# 같은 날 두 번째 배치 — 상한이 이미 찼으니 추가 진입 없음
e2 = engine(tmp, D1)
e2.run_cycle(bundle({s: "BUY" for s in SYMS}, f"{D1}T11:00:00+09:00"), now=t(D1, 11, 5))
opens_after = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("5-5. 하루 상한(3종목)이 배치를 넘어도 유지된다", len(opens_after) == 3,
      str(len(opens_after)))

# ── 6. 익절: 관측가 +3% 도달 → TAKE_PROFIT ──────────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_tp_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.0, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
e_tp = engine(tmp, D1, price=10_350)                       # +3.5% 관측
e_tp.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 11, 5))
closed = [r for r in ledger_rows(tmp) if r.get("status") == "CLOSED"]
check("6. 익절 기준(+3%) 도달 시 TAKE_PROFIT로 청산한다",
      len(closed) == 1 and closed[0]["exit_reason"] == "TAKE_PROFIT",
      str([r.get("exit_reason") for r in closed]))

# ── 7. 손절: 관측가 -2% 도달 → STOP_LOSS ────────────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_sl_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.0, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
e_sl = engine(tmp, D1, price=9_750)                        # -2.5% 관측
e_sl.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 11, 5))
closed = [r for r in ledger_rows(tmp) if r.get("status") == "CLOSED"]
check("7. 손절 기준(-2%) 도달 시 STOP_LOSS로 청산한다",
      len(closed) == 1 and closed[0]["exit_reason"] == "STOP_LOSS",
      str([r.get("exit_reason") for r in closed]))

# ── 7-1. 관측 실패 사이클에는 익절/손절을 판정하지 않는다(가격 추측 금지) ────
tmp = tempfile.mkdtemp(prefix="sv3_nopx_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.0, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
e_np = engine(tmp, D1, price=10_350, missing=(SYMS[0],))   # 현재가 응답 없음
e_np.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 11, 5))
still_open = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("7-1. 시세 관측 실패 사이클에는 익절/손절 청산이 없다", len(still_open) == 1,
      str(len(still_open)))

# ── 8. 시간청산: 2거래일 도달 → TIME_EXIT_2D ────────────────────────────────
tmp = tempfile.mkdtemp(prefix="sv3_time_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.0, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
_scan_holder["ret"] = (D2, -1.0, [])                       # 이후엔 신규 진입 없음
e_d2 = engine(tmp, D2)
e_d2.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D2}T10:00:00+09:00"), now=t(D2, 10, 5))
mid_open = [r for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("8. 1거래일 경과·기준 미도달이면 계속 보유한다", len(mid_open) == 1)
_scan_holder["ret"] = (D3, -1.0, [])
e_d3 = engine(tmp, D3)
e_d3.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D3}T10:00:00+09:00"), now=t(D3, 10, 5))
closed = [r for r in ledger_rows(tmp) if r.get("status") == "CLOSED"]
check("8-1. 2거래일 도달 시 TIME_EXIT_2D로 청산한다",
      len(closed) == 1 and closed[0]["exit_reason"] == "TIME_EXIT_2D"
      and closed[0].get("holding_trading_days") == 2,
      str([(r.get("exit_reason"), r.get("holding_trading_days")) for r in closed]))

# ── 8-2. 당일 재진입 금지: 오늘 청산한 종목은 오늘 다시 사지 않는다 ──────────
tmp = tempfile.mkdtemp(prefix="sv3_reent_")
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.0, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
e_x = engine(tmp, D1, price=10_350)                        # 익절로 당일 청산
e_x.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:30:00+09:00"), now=t(D1, 10, 35))
e_re = engine(tmp, D1)                                     # 같은 날 새 배치
e_re.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T11:00:00+09:00"), now=t(D1, 11, 5))
# ⚠️ 원장은 append-only라 청산된 거래도 옛 OPEN 행이 남는다 — trade_id별 최신 행으로 본다.
latest_rows = {}
for r in ledger_rows(tmp):
    latest_rows[r["trade_id"]] = r
reopened = [r for r in latest_rows.values() if r.get("status") == "OPEN"]
check("8-2. 당일 청산 종목은 같은 날 재진입하지 않는다", len(reopened) == 0,
      str([(r.get("status"), r.get("symbol")) for r in latest_rows.values()]))

# ── 8-3. 업종 제한: 같은 업종은 하루 1종목만 (2026-08-28 신설) ────────────────
_orig_sector = ps.load_sector_map
tmp = tempfile.mkdtemp(prefix="sv3_sector_")
# 앞 3종목을 같은 업종으로 묶는다 — 제한이 없으면 셋 다 사야 하고, 있으면 1개만 산다.
ps.load_sector_map = lambda path=None: {SYMS[0]: "반도체", SYMS[1]: "반도체",
                                        SYMS[2]: "반도체", SYMS[3]: "바이오",
                                        SYMS[4]: "화학", SYMS[5]: "금융"}
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.2, [(s_, 10.0 - i) for i, s_ in enumerate(SYMS)])
e.run_cycle(bundle({s_: "BUY" for s_ in SYMS}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
syms = [r["symbol"] for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("8-3. 같은 업종은 하루 1종목만 산다",
      syms == [SYMS[0], SYMS[3], SYMS[4]], str(syms))

# 업종 맵을 못 읽으면(빈 dict) 제한을 적용하지 않는다 — 업종을 추측하지 않는다
tmp = tempfile.mkdtemp(prefix="sv3_nosector_")
ps.load_sector_map = lambda path=None: {}
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.2, [(s_, 10.0 - i) for i, s_ in enumerate(SYMS)])
e.run_cycle(bundle({s_: "BUY" for s_ in SYMS}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))
syms = [r["symbol"] for r in ledger_rows(tmp) if r.get("status") == "OPEN"]
check("8-4. 업종 맵을 못 읽으면 제한 없이 상위 3종목을 산다(추측 금지)",
      syms == SYMS[:3], str(syms))

# 어제 산 업종에 오늘 또 얹지 않는다(보유 중 업종도 함께 센다)
tmp = tempfile.mkdtemp(prefix="sv3_heldsector_")
ps.load_sector_map = lambda path=None: {s_: "반도체" for s_ in SYMS[:2]} | {
    s_: f"업종{i}" for i, s_ in enumerate(SYMS[2:], start=2)}
e = fresh(tmp, D1)
_scan_holder["ret"] = (D1, 1.2, [(SYMS[0], 9.0)])
e.run_cycle(bundle({SYMS[0]: "BUY"}, f"{D1}T10:00:00+09:00"), now=t(D1, 10, 5))   # 반도체 1개 보유
_scan_holder["ret"] = (D2, 1.2, [(SYMS[1], 9.0), (SYMS[2], 8.0)])                # 같은 업종 + 다른 업종
e2 = engine(tmp, D2)
e2.run_cycle(bundle({SYMS[1]: "BUY", SYMS[2]: "BUY"}, f"{D2}T10:00:00+09:00"), now=t(D2, 10, 5))
latest = {}
for r in ledger_rows(tmp):
    latest[r["trade_id"]] = r
held_syms = sorted(r["symbol"] for r in latest.values() if r.get("status") == "OPEN")
check("8-5. 이미 보유 중인 업종에는 다음 날 더 담지 않는다",
      SYMS[1] not in held_syms and SYMS[2] in held_syms, str(held_syms))
ps.load_sector_map = _orig_sector

# ── 9. scan_candidates 실계산(합성 시계열) ───────────────────────────────────
ps.scan_candidates = _orig_scan
def series(vals, start="2026-01-05"):
    from datetime import date as _date
    d0 = _date(2026, 1, 5)
    out = []
    i = 0
    d = d0
    while len(out) < len(vals):
        if d.weekday() < 5:
            out.append((d.isoformat(), float(vals[len(out)])))
        d += timedelta(days=1)
    return out

up = [1000 + 10 * i for i in range(70)]                    # 꾸준한 상승(자격 충족)
down = [2000 - 10 * i for i in range(70)]                  # 꾸준한 하락(자격 미달)
closes = {}
for i in range(60):                                        # 상승 60종목
    closes[f"UP{i:03d}"] = series(up)
for i in range(50):                                        # 하락 50종목 — 중앙값은 여전히 양수
    closes[f"DN{i:03d}"] = series(down)
ref, med, quals = ps.scan_candidates(closes)
check("9. 참고일 = 데이터의 가장 최근 날짜", ref == closes["UP000"][-1][0], str(ref))
check("9-1. 상승 우위면 시장 폭 중앙값이 양수", med is not None and med > 0, str(med))
check("9-2. 자격 후보는 상승 종목만(60개)", len(quals) == 60, str(len(quals)))
for i in range(60):                                        # 하락 60종목 추가 — 중앙값 음수로
    closes[f"DX{i:03d}"] = series(down)
ref2, med2, _ = ps.scan_candidates(closes)
check("9-3. 하락 우위면 중앙값이 음수(게이트 발동 조건)", med2 is not None and med2 < 0, str(med2))
small = {f"S{i}": series(up) for i in range(5)}            # 표본 100종목 미만
_, med3, q3 = ps.scan_candidates(small)
check("9-4. 시장 폭 표본 부족이면 중앙값 None + 후보 없음(fail closed)",
      med3 is None and q3 == [], f"{med3} {len(q3)}")

# 🐛 2026-08-27 점검에서 발견: 개장 직후에는 오늘 종가가 절반만 수집돼 있는데
#    (실측 08-26 09:14 54.8%), 절대 종목 수 하한(100)만으로는 그 부분 표본이 그대로
#    통과해 시장 판단이 달라졌다(실측 중앙값 0.55 vs 0.935, 기준선 0).
partial = {}
for i in range(100):                                       # 오늘 종가 있는 100종목
    partial[f"NOW{i:03d}"] = series(up)
for i in range(100):                                       # 아직 수집 안 된 100종목
    partial[f"OLD{i:03d}"] = series(up[:40])
_, med4, q4 = ps.scan_candidates(partial)
check("9-5. 수집 커버리지 미달(50%)이면 종목 수가 하한을 넘어도 보류한다",
      med4 is None and q4 == [], f"{med4} {len(q4)}")
for i in range(100):                                       # 커버리지를 90% 위로 채우면
    partial[f"OLD{i:03d}"] = series(up)                    #   같은 데이터로 판정이 열린다
_, med5, q5 = ps.scan_candidates(partial)
check("9-6. 커버리지가 차면 정상 판정한다(과도한 차단 아님)",
      med5 is not None and len(q5) > 0, f"{med5} {len(q5)}")

# ── 10. 공개 스냅샷 연결(2026-08-27 QA 지적 회귀 방지) ───────────────────────
#    config.json이 디스크에 실제로 생겨야 paper_public이 이 전략을 실데이터로
#    게시한다 — 안 생기면 V3 탭이 영원히 "준비 중"(PREPARING)에 갇힌다.
tmp = tempfile.mkdtemp(prefix="sv3_pub_")
e = engine(tmp, D1)                     # 생성만으로 _load_config가 실행된다
check("10. 엔진 생성 시 config.json이 디스크에 남는다",
      os.path.exists(os.path.join(tmp, "config.json")))
import paper_public as _pp
_payload, _ctx = _pp.build_payload(tmp, "TEST_SCALP_V3")
check("10-1. 공개 payload가 전략 이름을 안다(PREPARING 스텁 아님)",
      _payload.get("strategyVersion") == "PAPER_SCALP_V3"
      and _payload.get("stage") != "PREPARING",
      f"{_payload.get('strategyVersion')} {_payload.get('stage')}")
check("10-2. 진입·청산 규칙 텍스트가 payload에 실린다",
      bool(_payload.get("entryRule")) and bool(_payload.get("exitRule")))
check("10-2b. 자금·상한 설정이 코드와 config에 같이 반영돼 있다(250만·3종목·업종1)",
      ps.POSITION_SIZE_KRW == 2_500_000 and ps.MAX_NEW_ENTRIES_PER_DAY == 3
      and ps.SECTOR_CAP == 1
      and _payload.get("positionSizeKrw") == 2_500_000,
      f"{ps.POSITION_SIZE_KRW} {ps.MAX_NEW_ENTRIES_PER_DAY} {ps.SECTOR_CAP} "
      f"{_payload.get('positionSizeKrw')}")
check("10-3. 저장소에 초기 config.json이 커밋돼 있다(러너 첫 실행 전에도 스텁 탈출)",
      os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                  "paper_trading", "scalp_v3", "config.json")))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("전체 통과")
