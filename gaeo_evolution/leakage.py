# -*- coding: utf-8 -*-
"""미래정보(Leakage) 차단 — 가장 중요한 안전장치.

규칙(Constitution leakagePolicy):
  · 판단시각 이후의 정보는 feature가 될 수 없다.
  · 결과(수익률)는 판단일 '이후' 날짜의 가격으로만 계산돼야 한다.
  · cutoff를 증명 못 하는 표본은 평가에서 제외한다(EXCLUDE_OR_LOW_TRUST).
"""


class LeakageError(RuntimeError):
    """평가 표본에 미래정보가 섞였다. 평가 전체를 신뢰할 수 없으므로 FAIL CLOSED."""


def cutoff_report(rows):
    """(사용가능행, 제외행수, 사유별집계). cutoff 증명이 없는 행은 조용히 쓰지 않는다."""
    usable, excluded = [], {}

    def drop(reason):
        excluded[reason] = excluded.get(reason, 0) + 1

    for row in rows:
        day = str(row.get("day") or "")[:10]
        if len(day) != 10:
            drop("decision_day_missing")
            continue
        base = row.get("base")
        if not base:
            drop("base_price_missing")
            continue
        # baseAt(가격 기준시각)이 있으면 판단일보다 미래면 안 된다.
        base_at = str(row.get("baseAt") or "")[:10]
        if len(base_at) == 10 and base_at > day:
            drop("base_price_from_future")
            continue
        usable.append(row)
    return usable, sum(excluded.values()), excluded


def assert_outcomes_after_decision(rows):
    """모든 결과 관측일이 판단일보다 뒤인지 검증한다. 위반 즉시 예외.

    rows[i]에 outcomeDate(결과를 관측한 가격의 날짜)가 있으면 검사한다.
    outcomeDate를 기록하지 않은 계산 경로는 이 검사를 통과할 수 없도록,
    evaluation.build_rows가 항상 outcomeDate를 기록한다.
    """
    for row in rows:
        if row.get("ret5") is None:
            continue
        day = str(row.get("day") or "")[:10]
        out_day = str(row.get("outcomeDate") or "")[:10]
        if len(out_day) != 10:
            raise LeakageError(
                f"outcomeDate 미기록 — 결과 계산 경로가 cutoff를 증명하지 못합니다: "
                f"{row.get('code')} {day}")
        if out_day <= day:
            raise LeakageError(
                f"미래정보 감지 — 결과 관측일({out_day})이 판단일({day}) 이후가 아닙니다: "
                f"{row.get('code')}")
    return True


DECISION_FIELDS_ALLOWED = frozenset((
    # 판단 당일에 이미 존재했던 값만 후보 시뮬레이션의 입력이 될 수 있다.
    "code", "day", "call", "total", "confidence", "base", "baseAt",
    "taro", "diana", "nova", "flow", "rawTotal", "riskPenalty", "sellThreshold",
))
OUTCOME_FIELDS = frozenset(("ret5", "outcomeDate"))


def decision_view(row):
    """후보 시뮬레이션에 넘길 '판단시점 정보만 남긴' 사본.

    결과 필드를 물리적으로 제거해서, 후보 생성 코드가 실수로라도
    미래 수익률을 feature로 쓸 수 없게 한다.
    """
    return {k: v for k, v in row.items() if k in DECISION_FIELDS_ALLOWED}
