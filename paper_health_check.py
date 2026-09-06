#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모의투자 러너 상태 판정 : "오늘 사이클이 실패했나"와 "오늘 아예 안 돌았나"를 가른다.

왜 분리해서 파일로 뒀나
    이 판정은 .github/workflows/paper-health-alert.yml 안 heredoc 파이썬으로만 있었다.
    워크플로 안에 있으면 사람이 손으로 돌려볼 수 없고, 공휴일 허위 알림 같은 회귀를
    테스트로 고정할 수도 없다(테스트가 YAML 안 문자열을 실행할 수는 없으니까).
    그래서 판정만 여기로 옮기고 워크플로는 이 파일을 부른다. test_paper_health_check.py가
    실제 공휴일 날짜로 이 함수를 직접 검사한다.

판정 4가지
    OK       오늘 사이클이 정상으로 끝났다.
    FAIL     오늘 사이클이 실패로 끝났다(러너는 살아 있다).
    MISSING  오늘은 거래일인데 사이클 기록이 아예 없다. 러너나 PC가 통째로 꺼졌다는 뜻이다.
    SKIP     판정하지 않는다(휴장·중립 결과·거래일 증거 없음).

⭐ "오늘이 거래일이었나"는 러너와 무관한 증거로만 판단한다.
    paper_trading/state.json은 러너가 쓰는 파일이라, 러너가 죽으면 증거도 같이 죽는다.
    그래서 GitHub Actions가 독립적으로 갱신하는 price_history.js를 증거로 쓴다.

    왜 price_history.js 인가 (data.js가 아니라)
      · price_history.js의 날짜는 네이버 일봉 API가 준 "거래소가 실제로 장을 연 날"이다.
        휴장일에는 그 날짜 자체가 생기지 않는다. 실측: 2026-08-17(월, 광복절 대체공휴일)은
        price_history.js에 0건, 2026-08-26(수)은 598건.
      · data.js의 date는 "수집 시각"이라 거래일 증거로는 약하다. 2026-09-06부터
        update-prices.yml이 krx_calendar 휴장일에 아예 돌지 않으므로 휴장일 날짜가
        새로 찍히지는 않지만, 그 달력에 없는 휴장일(실측 2026-07-17)에는 여전히
        찍힌다. 벤더 일봉이라는 독립 증거를 쓰는 이유는 그대로다.
      · market_history.js는 실제 거래일에도 빠지는 날이 있어(예: 재분석을 안 한 날)
        "오늘 거래일이었다"를 단정할 근거가 못 된다.

⭐ fail closed = 침묵. 증거를 못 읽거나 오늘 날짜가 없으면 MISSING이 아니라 SKIP이다.
    휴장일과 "증거 파이프라인도 같이 멈춤"을 구분할 방법이 없기 때문이다. 허위 알림은
    알림 자체를 못 믿게 만들어 진짜 사고를 놓치게 한다. 침묵이 낫다.
"""
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))

STATE_PATH = os.path.join(HERE, "paper_trading", "state.json")
WITNESS_PATH = os.path.join(HERE, "price_history.js")

#: 사이클이 "정상적으로 아무것도 안 한" 결과들. 실패가 아니다.
#: OK로 두면 어제 난 진짜 실패 이슈를 공휴일에 자동으로 닫아 문제를 덮는다.
NEUTRAL = ("HOLIDAY", "BASELINE_CAPTURED", "ENGINE_NOT_STARTED",
           # Single Writer 게이트로 이 러너가 비활성일 때. 실패가 아니다.
           "RUNNER_NOT_ACTIVE", "RUNNER_UNDECLARED")

#: 거래일로 인정하는 최소 증거 건수. 정상 거래일이면 종목 수만큼(수백 건) 나온다.
#: 한두 건만 걸리는 상황은 파일이 반쯤 쓰인 상태일 수 있으니 거래일로 단정하지 않는다.
MIN_WITNESS_HITS = 50


def today_kst(now=None):
    return (now or datetime.datetime.now(KST)).strftime("%Y-%m-%d")


def count_in_file(path, needle, chunk_size=1 << 20):
    """큰 파일(price_history.js는 28MB)을 통째로 메모리에 올리지 않고 센다."""
    needle_b = needle.encode("utf-8")
    overlap = len(needle_b) - 1
    total, tail = 0, b""
    with open(path, "rb") as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            buf = tail + chunk
            total += buf.count(needle_b)
            tail = buf[-overlap:] if overlap else b""
    return total


def trading_day_evidence(today, path=None):
    """오늘이 실제 거래일이었는지. 반환 (True/False/None, 사유코드).

    None = 판정 불가(증거 파일을 못 읽음). 호출측은 None을 침묵으로 다룬다.
    """
    path = path or WITNESS_PATH
    if not os.path.exists(path):
        return None, "WITNESS_MISSING"
    try:
        hits = count_in_file(path, f'"date": "{today}"')
    except OSError:
        return None, "WITNESS_UNREADABLE"
    if hits >= MIN_WITNESS_HITS:
        return True, f"PRICE_HISTORY_{hits}"
    return False, f"PRICE_HISTORY_{hits}"


def read_state(path=None):
    """러너 상태. 없거나 깨졌으면 None(= 오늘 기록 없음과 같이 취급)."""
    path = path or STATE_PATH
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else None
    except Exception:                     # noqa: BLE001 - 원인과 무관하게 "기록 없음"
        return None


def reason_code(result):
    """실패 사유는 앞머리 코드만 쓴다(내부 문자열을 그대로 이슈에 붙이지 않는다)."""
    m = re.match(r"[A-Z][A-Z0-9_]{3,}", result or "")
    return m.group(0) if m else ("UNKNOWN" if result else "NONE")


def decide(state, today, trading_day):
    """순수 판정(파일을 읽지 않는다). 반환 (status, reason, cycle_at)."""
    result = str((state or {}).get("lastCycleResult") or "")
    at = str((state or {}).get("lastCycleAt") or "")
    attempted_today = at[:10] == today

    if attempted_today:
        if result.startswith(NEUTRAL):
            # 휴장·기준선 캡처·시작 전·비활성 러너. 실패도 성공도 아니다.
            return "SKIP", reason_code(result), at
        if (not result) or result.startswith("CYCLE_OK"):
            return "OK", reason_code(result), at
        return "FAIL", reason_code(result), at

    # 여기부터가 2026-08-26에 막은 구멍이다.
    # 예전에는 무조건 SKIP이라, VM이나 집 PC가 통째로 꺼져도 아무 신호가 없었다.
    if trading_day is True:
        return "MISSING", ("NO_CYCLE_TODAY" if state is not None else "STATE_UNREADABLE"), at
    if trading_day is False:
        return "SKIP", "NOT_A_TRADING_DAY", at
    return "SKIP", "NO_TRADING_DAY_EVIDENCE", at


def main(argv=None):
    """stdout은 통째로 GITHUB_OUTPUT(key=value)으로 들어간다.
    사람이 읽을 로그는 반드시 stderr로 낸다(형식이 깨지면 스텝이 실패한다)."""
    argv = argv if argv is not None else sys.argv[1:]
    today = argv[0] if argv else today_kst()
    state = read_state()
    trading_day, evidence = trading_day_evidence(today)
    status, reason, at = decide(state, today, trading_day)

    print(f"status={status}")
    print(f"reason={reason}")
    print(f"cycle_at={at}")
    print(f"evidence={evidence}")
    print(f"today={today}")
    print(f"판정 {status} · 사유 {reason} · 마지막 시도 {at or '없음'} · "
          f"거래일 증거 {evidence}({trading_day})", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
