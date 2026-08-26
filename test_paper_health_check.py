#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모의투자 러너 상태 알림 계약 : 조용히 죽는 것을 잡되, 공휴일에 허위 알림 0건.

지키는 것 두 가지가 서로 반대 방향이라 둘 다 고정한다.
  ① 거래일인데 오늘 사이클 기록이 없으면 반드시 MISSING(화재경보기가 울려야 한다)
  ② 휴장일이거나 증거를 못 읽으면 절대 알리지 않는다(허위 알림 0건)

거래일 판정은 실제 저장소 파일(price_history.js)로 검사한다. 2026-08-17은 월요일인데
광복절 대체공휴일이라 일봉이 0건이다. 만들어낸 fixture가 아니라 진짜 휴장일 표본이다.
"""
import datetime
import os
import re
import sys
import tempfile

import paper_health_check as hc

HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" ({detail})" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def state(at, result):
    return {"lastCycleAt": at, "lastCycleResult": result}


TODAY = "2026-09-01"
T = TODAY + "T15:05:00+09:00"
Y = "2026-08-31T15:05:00+09:00"

# ═══ ① 오늘 기록이 있을 때 (기존 동작 보존) ═══════════════════════════════════
check("1a. 오늘 정상 사이클이면 OK",
      hc.decide(state(T, "CYCLE_OK · 진입 1건"), TODAY, True)[0] == "OK")
check("1b. 오늘 실패면 FAIL",
      hc.decide(state(T, "TOSS_MARKET_DATA_UNAVAILABLE · credential"), TODAY, True)[0] == "FAIL")
check("1c. 실패 사유는 앞머리 코드만 나간다",
      hc.decide(state(T, "TOSS_MARKET_DATA_UNAVAILABLE · credential"), TODAY, True)[1]
      == "TOSS_MARKET_DATA_UNAVAILABLE")
for neutral in ("HOLIDAY", "BASELINE_CAPTURED", "ENGINE_NOT_STARTED"):
    check(f"1d. 중립 결과({neutral})는 SKIP",
          hc.decide(state(T, neutral + " 어쩌구"), TODAY, True)[0] == "SKIP")
check("1e. 비활성 러너(Single Writer)는 실패가 아니라 SKIP",
      hc.decide(state(T, "RUNNER_NOT_ACTIVE"), TODAY, True)[0] == "SKIP")

# ═══ ② 오늘 기록이 없을 때 (이번에 막은 구멍) ═════════════════════════════════
check("2a. 거래일인데 오늘 기록이 0건이면 MISSING",
      hc.decide(state(Y, "CYCLE_OK"), TODAY, True)[0] == "MISSING")
check("2b. MISSING 사유는 NO_CYCLE_TODAY",
      hc.decide(state(Y, "CYCLE_OK"), TODAY, True)[1] == "NO_CYCLE_TODAY")
check("2c. 어제 실패로 끝난 채 오늘 안 돌아도 MISSING(실패 이슈에 묻히지 않는다)",
      hc.decide(state(Y, "PUSH_FAILED"), TODAY, True)[0] == "MISSING")
check("2d. 휴장일이면 알리지 않는다",
      hc.decide(state(Y, "CYCLE_OK"), TODAY, False)[0] == "SKIP")
check("2e. 거래일 증거를 못 읽으면 알리지 않는다(fail closed)",
      hc.decide(state(Y, "CYCLE_OK"), TODAY, None)[0] == "SKIP")
check("2f. 휴장·증거없음의 사유가 구분된다",
      hc.decide(state(Y, ""), TODAY, False)[1] == "NOT_A_TRADING_DAY"
      and hc.decide(state(Y, ""), TODAY, None)[1] == "NO_TRADING_DAY_EVIDENCE")
check("2g. state.json을 못 읽어도 거래일이면 MISSING",
      hc.decide(None, TODAY, True)[0] == "MISSING"
      and hc.decide(None, TODAY, True)[1] == "STATE_UNREADABLE")
check("2h. state.json을 못 읽어도 휴장일이면 침묵",
      hc.decide(None, TODAY, False)[0] == "SKIP")

# ═══ ③ 거래일 증거 — 실제 저장소 파일 ════════════════════════════════════════
holiday, hcode = hc.trading_day_evidence("2026-08-17")     # 월요일, 광복절 대체공휴일
check("3a. 실제 공휴일(2026-08-17 월)은 거래일이 아니다", holiday is False, hcode)
weekend, wcode = hc.trading_day_evidence("2026-08-22")     # 토요일
check("3b. 주말(2026-08-22 토)도 거래일이 아니다", weekend is False, wcode)
trading, tcode = hc.trading_day_evidence("2026-08-26")     # 수요일, 정상 거래일
check("3c. 실제 거래일(2026-08-26 수)은 거래일로 잡힌다", trading is True, tcode)
check("3d. 증거 파일이 없으면 None(판정 불가)",
      hc.trading_day_evidence("2026-08-26", os.path.join(HERE, "no_such_file.js"))[0] is None)

# 공휴일 종단 검사 — 러너가 며칠 죽어 있어도 공휴일에는 이슈가 열리면 안 된다.
hol_status, _r, _a = hc.decide(state("2026-08-14T15:05:00+09:00", "CYCLE_OK"),
                               "2026-08-17", hc.trading_day_evidence("2026-08-17")[0])
check("3e. 공휴일 허위 알림 0건(종단)", hol_status == "SKIP", hol_status)
run_status, _r, _a = hc.decide(state("2026-08-25T15:05:00+09:00", "CYCLE_OK"),
                               "2026-08-26", hc.trading_day_evidence("2026-08-26")[0])
check("3f. 거래일에 러너가 죽으면 반드시 알린다(종단)", run_status == "MISSING", run_status)

# ═══ ④ 증거 세기 — 경계·청크 ═════════════════════════════════════════════════
tmp = tempfile.mkdtemp(prefix="hc_")
few = os.path.join(tmp, "few.js")
open(few, "w", encoding="utf-8").write('{"date": "2026-09-01"}\n' * (hc.MIN_WITNESS_HITS - 1))
check("4a. 증거가 최소치 미만이면 거래일로 단정하지 않는다",
      hc.trading_day_evidence("2026-09-01", few)[0] is False)
enough = os.path.join(tmp, "enough.js")
open(enough, "w", encoding="utf-8").write('{"date": "2026-09-01"}\n' * hc.MIN_WITNESS_HITS)
check("4b. 최소치를 채우면 거래일", hc.trading_day_evidence("2026-09-01", enough)[0] is True)

# 청크 경계에 needle이 걸쳐도 세야 한다(28MB 파일을 나눠 읽기 때문에 중요).
needle = '"date": "2026-09-01"'
split = os.path.join(tmp, "split.js")
with open(split, "w", encoding="utf-8") as f:
    f.write("x" * 10 + needle + "y" * 10 + needle)
check("4c. 청크 경계에 걸친 증거도 빠짐없이 센다",
      hc.count_in_file(split, needle, chunk_size=16) == 2,
      str(hc.count_in_file(split, needle, chunk_size=16)))
check("4d. 다른 날짜를 오인하지 않는다",
      hc.count_in_file(split, '"date": "2026-09-02"', chunk_size=16) == 0)

# ═══ ⑤ 워크플로가 이 판정을 실제로 쓰는가 ════════════════════════════════════
wf_path = os.path.join(HERE, ".github", "workflows", "paper-health-alert.yml")
wf = open(wf_path, encoding="utf-8").read()
check("5a. 워크플로가 paper_health_check.py를 부른다", "python3 paper_health_check.py" in wf)
check("5b. 판정 파이썬이 워크플로 안에 다시 복사돼 있지 않다(두 벌 관리 금지)",
      "lastCycleResult" not in wf.split("steps:")[1].split("- name: 실패 시")[0]
      or "python3 - <<" not in wf)
fail_title = re.search(r'FAIL_TITLE:\s*"([^"]+)"', wf).group(1)
silent_title = re.search(r'SILENT_TITLE:\s*"([^"]+)"', wf).group(1)
check("5c. 미실행 알림 제목이 기존 실패 알림과 다르다", fail_title != silent_title,
      f"{fail_title} / {silent_title}")
check("5d. 미실행 알림 제목이 지정된 문구 그대로다",
      silent_title == "🛑 [GAEO Paper] 오늘 모의투자가 실행되지 않았습니다", silent_title)
check("5e. MISSING일 때만 미실행 이슈를 만든다",
      "steps.check.outputs.status == 'MISSING'" in wf)
check("5f. 정상 복구되면 미실행 이슈를 자동으로 닫는다",
      "gh issue close" in wf and wf.count("SILENT_TITLE") >= 3
      and "status == 'OK' || steps.check.outputs.status == 'FAIL'" in wf)
check("5g. 같은 제목 재사용으로 중복 이슈를 막는다(생성 전 조회)",
      wf.count("gh issue list --state open") >= 4)
check("5h. 토스 API를 부르지 않는다",
      "openapi.tossinvest.com" not in wf and "TOSS_INVEST" not in wf)
check("5i. 저장소에 아무것도 커밋하지 않는다",
      "git push" not in wf and "git commit" not in wf and "contents: read" in wf)
check("5j. SKIP이면 어떤 이슈도 만들지 않는다",
      "status == 'SKIP'" not in wf)

# ═══ ⑥ 실제 저장소 상태에서 한 번 돌려본다(형식 계약) ════════════════════════
import io
from contextlib import redirect_stdout, redirect_stderr

buf, err = io.StringIO(), io.StringIO()
with redirect_stdout(buf), redirect_stderr(err):
    rc = hc.main([TODAY])
lines = [l for l in buf.getvalue().splitlines() if l.strip()]
check("6a. 종료코드 0", rc == 0)
check("6b. stdout은 전부 key=value 한 줄씩(GITHUB_OUTPUT 형식)",
      all(re.match(r"^[a-z_]+=[^\n]*$", l) for l in lines), str(lines))
keys = [l.split("=", 1)[0] for l in lines]
check("6c. 워크플로가 읽는 키가 전부 있다",
      set(keys) >= {"status", "reason", "cycle_at", "evidence", "today"}, str(keys))
check("6d. 사람이 읽을 로그는 stderr로만 나간다", err.getvalue().strip() != "")

print()
if FAILURES:
    print(f"❌ 실패 {len(FAILURES)}건: " + ", ".join(FAILURES))
    sys.exit(1)
print("✅ 러너 상태 알림 계약 전부 통과")
