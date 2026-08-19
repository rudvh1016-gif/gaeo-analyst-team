"""놓친 거래일 보충 — 러너가 며칠 죽어 있어도 보유일이 실제와 어긋나지 않는가.

배경(2026-08-19 실제 사고): 집 PC 러너의 토스 자격증명이 유실돼 8/19 12사이클이
전부 실패했다. 그 사이 businessDates에 8/19가 안 들어가서, 복구해도 그날은
영원히 보유일로 세어지지 않고 MAX_HOLDING 청산이 며칠씩 밀리는 문제가 있었다.

⚠️ 핵심 계약: 날짜를 추측해서 채우지 않는다. 공식 캘린더가 open이라고 답한 날만 넣는다.
"""
import paper_engine as pe
import paper_market_data as pmd

failures = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + ("" if cond or not detail else f" — {detail}"))
    if not cond:
        failures.append(name)


def day(d, open_=True):
    return {"date": d, "open": open_, "integrated": {} if open_ else None}


def cal(today, prev, prev_open=True, today_open=True):
    return {"today": day(today, today_open),
            "previousBusinessDay": day(prev, prev_open),
            "nextBusinessDay": None}


def engine(state, by_date):
    e = pe.PaperEngine.__new__(pe.PaperEngine)
    e.state = state
    e.provider = pmd.FixtureMarketDataProvider(calendar_by_date=by_date)
    return e


# ── 1. 기본: 빠진 거래일을 공식 응답대로 채운다 ───────────────────────────────
# 8/18까지 기록됨 → 오늘 8/21. 그 사이 8/19·8/20이 빠졌다.
st = {"businessDates": ["2026-08-18"]}
by = {
    "2026-08-21": cal("2026-08-21", "2026-08-20"),
    "2026-08-20": cal("2026-08-20", "2026-08-19"),
    "2026-08-19": cal("2026-08-19", "2026-08-18"),
}
st["businessDates"].append("2026-08-21")
n = engine(st, by)._backfill_missed_business_days("2026-08-21")
check("1. 빠진 거래일 2일을 채운다", n == 2, f"채운 수={n}")
check("1-1. businessDates가 정확히 복원된다",
      st["businessDates"] == ["2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"],
      str(st["businessDates"]))
check("1-2. 보충한 날짜를 따로 남긴다",
      st.get("backfilledBusinessDates") == ["2026-08-19", "2026-08-20"],
      str(st.get("backfilledBusinessDates")))

# ── 2. 보유일 계산이 실제와 맞아진다 ─────────────────────────────────────────
holding = sum(1 for d in st["businessDates"] if d > "2026-08-18" and d <= "2026-08-21")
check("2. 8/18 진입분의 보유일이 3거래일로 정확히 계산된다", holding == 3, f"holding={holding}")

# ── 3. 휴장일은 절대 넣지 않는다(추측 금지의 핵심) ───────────────────────────
st3 = {"businessDates": ["2026-08-18", "2026-08-24"]}
by3 = {
    # 8/24의 직전 거래일은 8/21이고, 8/22~8/23은 캘린더가 아예 언급하지 않는다.
    "2026-08-24": cal("2026-08-24", "2026-08-21"),
    "2026-08-21": cal("2026-08-21", "2026-08-18"),
}
n3 = engine(st3, by3)._backfill_missed_business_days("2026-08-24")
check("3. 캘린더가 준 거래일만 넣는다(주말 미포함)",
      st3["businessDates"] == ["2026-08-18", "2026-08-21", "2026-08-24"],
      str(st3["businessDates"]))
check("3-1. 넣은 수가 1일이다", n3 == 1, f"채운 수={n3}")

# ── 4. open=False로 답한 날은 건너뛴다 ───────────────────────────────────────
st4 = {"businessDates": ["2026-08-18", "2026-08-21"]}
by4 = {
    "2026-08-21": cal("2026-08-21", "2026-08-20", prev_open=False),
    "2026-08-20": cal("2026-08-20", "2026-08-19"),
    "2026-08-19": cal("2026-08-19", "2026-08-18"),
}
engine(st4, by4)._backfill_missed_business_days("2026-08-21")
check("4. open=False인 날은 거래일로 넣지 않는다",
      "2026-08-20" not in st4["businessDates"], str(st4["businessDates"]))
check("4-1. 그 뒤의 정상 거래일은 계속 채운다",
      "2026-08-19" in st4["businessDates"], str(st4["businessDates"]))

# ── 5. 기준점이 없으면 아무것도 하지 않는다 ─────────────────────────────────
st5 = {"businessDates": ["2026-08-21"]}
n5 = engine(st5, {})._backfill_missed_business_days("2026-08-21")
check("5. 과거 기준점이 없으면 보충하지 않는다(무한 소급 금지)",
      n5 == 0 and st5["businessDates"] == ["2026-08-21"], str(st5["businessDates"]))

# ── 6. 캘린더 실패는 사이클을 죽이지 않는다 ─────────────────────────────────
st6 = {"businessDates": ["2026-08-18", "2026-08-21"]}
e6 = pe.PaperEngine.__new__(pe.PaperEngine)
e6.state = st6
e6.provider = pmd.FixtureMarketDataProvider(fail=True)
try:
    n6 = e6._backfill_missed_business_days("2026-08-21")
    check("6. 캘린더 실패 시 예외 없이 0건으로 끝난다", n6 == 0, f"n={n6}")
except Exception as ex:
    check("6. 캘린더 실패 시 예외 없이 0건으로 끝난다", False, f"예외 발생: {ex}")

# ── 7. 이미 다 채워져 있으면 추가 호출을 낭비하지 않는다 ────────────────────
st7 = {"businessDates": ["2026-08-20", "2026-08-21"]}
prov7 = pmd.FixtureMarketDataProvider(calendar_by_date={
    "2026-08-21": cal("2026-08-21", "2026-08-20")})
e7 = pe.PaperEngine.__new__(pe.PaperEngine); e7.state = st7; e7.provider = prov7
n7 = e7._backfill_missed_business_days("2026-08-21")
check("7. 빈틈이 없으면 0건이고 즉시 멈춘다", n7 == 0, f"n={n7}")
check("7-1. 캘린더 호출이 1회를 넘지 않는다",
      len([c for c in prov7.calls if c[0] == "calendar"]) == 1,
      str(prov7.calls))

# ── 8. 소급 상한이 걸려 있다(API 폭주 방지) ─────────────────────────────────
check("8. 소급 상한 상수가 있다", isinstance(pe.PaperEngine.MAX_BACKFILL_DAYS, int)
      and 0 < pe.PaperEngine.MAX_BACKFILL_DAYS <= 60,
      str(getattr(pe.PaperEngine, "MAX_BACKFILL_DAYS", None)))

print()
if failures:
    print(f"실패 {len(failures)}건: " + ", ".join(failures))
    raise SystemExit(1)
print(f"전체 통과")
