"""표본 게이트 우회 경로 차단 — 2026-08-20 독립 검수(gaeo-qa)에서 발견된 구멍 2건.

① paper_history._stats()가 게이트를 전혀 안 타서, 보유 화면은 "표본 부족"인데
   기록 탭은 "2건 · 평균 +3.00% · 승률 100%"를 그대로 보여주는 모순이 실재했다.
② paper_public의 2차 방어선이 evidence 라벨만 믿어서, 그 라벨을 손으로
   SAMPLE_OK로 고치면 청산 2건짜리 결론이 그대로 공개됐다
   (막으려는 대상이 바로 그 라벨인데 그 라벨을 신뢰했다).
"""
import paper_history as ph
import paper_engine as pe

failures = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + ("" if cond or not detail else f" — {detail}"))
    if not cond:
        failures.append(name)


def row(ret, hold=3, bench=0.5):
    return {"returnPct": ret, "benchmarkReturnPct": bench, "holdingTradingDays": hold,
            "mfePct": abs(ret) + 1, "maePct": -abs(ret) - 1, "realizedPnl": int(ret * 1000)}


def swing_of(rows):
    """실제 경로(build_strategy)를 그대로 태워 스윙 bucket 통계를 얻는다.
    _stats()를 직접 부르면 게이트 판정(호출측이 전체 표본으로 결정)을 건너뛰게 된다."""
    S = ph.build_strategy(rows)
    return [b for b in S["buckets"] if b["key"] == "swing"][0]


# ── ① 표본 부족이면 성과 결론이 숫자로 안 나온다 ────────────────────────────
small = swing_of([row(3.0), row(1.0)])
for k in ("winRatePct", "avgReturnPct", "medianReturnPct",
          "avgRelativeReturnPct", "avgMfePct", "avgMaePct"):
    check(f"1. 청산 2건이면 {k}가 null", small[k] is None, f"{k}={small[k]}")

check("1-1. 건수는 사실이므로 그대로 남는다", small["tradeCount"] == 2, str(small["tradeCount"]))
check("1-2. 실현손익은 사실이므로 그대로 남는다", small["realizedPnl"] == 4000, str(small["realizedPnl"]))
check("1-3. 보유일수는 서술 지표라 막지 않는다",
      small["avgHoldingTradingDays"] is not None, str(small["avgHoldingTradingDays"]))

# ── ② 경계: 19건 차단 / 20건 공개 ───────────────────────────────────────────
n19 = swing_of([row(1.0) for _ in range(19)])
n20 = swing_of([row(1.0) for _ in range(20)])
check("2. 19건이면 여전히 차단", n19["winRatePct"] is None, str(n19["winRatePct"]))
check("2-1. 20건이면 공개된다(과잉 차단 방지)",
      n20["winRatePct"] == 100.0 and n20["avgReturnPct"] == 1.0,
      f"win={n20['winRatePct']} avg={n20['avgReturnPct']}")
check("2-2. 20건에서 상대수익·MFE·MAE도 함께 복귀",
      n20["avgRelativeReturnPct"] is not None and n20["avgMfePct"] is not None
      and n20["avgMaePct"] is not None, str(n20))

# ── ③ 게이트 기준이 엔진과 같은 값을 쓴다 ──────────────────────────────────
check("3. 기록 탭 최소표본이 엔진 기준과 같다",
      ph.MIN_STRATEGY_SAMPLE == pe.MIN_CLOSED_FOR_EVIDENCE,
      f"history={ph.MIN_STRATEGY_SAMPLE} engine={pe.MIN_CLOSED_FOR_EVIDENCE}")

# ── ④ 빈 입력에서 깨지지 않는다 ────────────────────────────────────────────
empty = swing_of([])
check("4. 청산 0건에서도 예외 없이 null", empty["winRatePct"] is None and empty["tradeCount"] == 0)

print()
if failures:
    print(f"실패 {len(failures)}건: " + ", ".join(failures))
    raise SystemExit(1)
print("전체 통과")
