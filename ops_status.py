#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 통합 상태 점검 — AI 없는(LLM 호출 0) 건강검진과 정해진 한국어 요약 (2026-09-10 신설).

기존 감시기(check_pipeline · pipeline_watchdog · check_workflow_health · paper_health_check ·
Evolution status · 검증 일정 원본)를 **한 번에 읽어** 상태 JSON 과 고정 문장을 만든다.
새 감시기를 겹쳐 만드는 것이 아니라, 흩어진 판정을 한 화면으로 모으는 것이다.

원칙
  · 모델을 부르지 않는다. 요약 문장은 표에서 고른다(test_ops_status 가 import·실행 양쪽에서 잠근다).
  · "확인하지 못했다"는 "정상"이 아니다. 판정 어휘 6종: 정상 / 정상 대기 / 자료 부족 / 장애 / 확인 불가 / 무료 한도 대기.
    확인 불가나 장애가 하나라도 있으면 "모두 정상"이라는 문장은 절대 나오지 않는다.
  · 달력을 본다(krx_calendar). 장외·주말·휴장일에 자료가 낡은 것은 정상 대기다.
    "run 이 돌고 있다"는 건강 신호로 쓰지 않는다 — 산출물과 기록만 본다.
  · 수집 성공 / 계산 성공 / 저장 성공 / 사이트 전달을 따로 본다(사이트 전달은 --probe-pages 일 때만, 실패하면 확인 불가).
  · 행 수·고유 종목 수·유효 표본을 구분한다. 600 종목 중 599 만 관측되면 그 차이를 숨기지 않는다.
  · 기본 실행은 네트워크 0 이다. --github(워크플로 유효성) · --probe-pages(사이트 전달) 만 네트워크를 쓰고,
    그마저 실패하면 예외가 아니라 '확인 불가'로 끝난다.
  · 이 스크립트는 파일을 고치지 않는다(--json/--repair-request 로 지정한 출력 파일만 쓴다).

사용
    python3 ops_status.py                       # 한국어 요약(빠름, 네트워크 0)
    python3 ops_status.py --deep                # + 사전등록 기록 누락(buyFeatureUnrecorded) 확인(history.js 읽음, 수 초)
    python3 ops_status.py --json out.json       # 상태 JSON
    python3 ops_status.py --github --probe-pages
    python3 ops_status.py --repair-request docs/operations/repair_requests   # 장애가 있을 때만 INC-… 파일을 쓴다
종료코드: 0 = 장애·확인불가 없음, 1 = 장애 있음, 2 = 장애는 없지만 확인 못 한 항목 있음
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import subprocess
import sys

from check_pipeline import KST, read_stamp
from krx_calendar import is_krx_trading_day
import pipeline_watchdog as PW

HERE = os.path.dirname(os.path.abspath(__file__))

#: 이 도구가 모델을 부르는 일은 없다. 상수는 표시용이고, 강제는 test_ops_status 가 한다.
LLM_CALLS = 0
SCHEMA = "gaeo_ops_status_v1"

OK, IDLE, INSUFF, FAULT, UNKNOWN, QUOTA = "OK", "IDLE_OK", "DATA_INSUFFICIENT", "FAULT", "UNKNOWN", "QUOTA_WAIT"
LABELS = {OK: "정상", IDLE: "정상 대기", INSUFF: "자료 부족", FAULT: "장애", UNKNOWN: "확인 불가", QUOTA: "무료 한도 대기"}

# 시세·자동분석 수집 창(pipeline_watchdog 과 같은 값) · 모의투자 회차 창
PAPER_FIRST_CYCLE = "09:05"
PAPER_GRACE_UNTIL = "09:40"     # 첫 회차가 이 시각까지 기록을 못 남기면 "오늘 회차 0건"
PAPER_LAST_CYCLE = "15:05"
EVOLUTION_MAX_AGE_DAYS = 8      # 주 1회(일요일 08:00 KST) 실행 + 하루 여유
PAGES_LAG_MAX_MIN = 30          # 사이트 반영이 이보다 늦으면 전달 지연
SCHEDULE_LATE_AFTER_HOURS = 24  # 예정 시각을 이만큼 지나도 기록이 없으면 미실행


# ---------------------------------------------------------------- 달력 · 공용

def last_trading_day(day):
    """day 를 포함해 가장 최근의 KRX 거래일."""
    d = day
    for _ in range(30):
        if is_krx_trading_day(d):
            return d
        d -= datetime.timedelta(days=1)
    return day


def previous_trading_day(day):
    return last_trading_day(day - datetime.timedelta(days=1))


def _hm(now):
    return now.strftime("%H:%M")


def component(status, code, detail, **extra):
    row = {"status": status, "label": LABELS[status], "code": code, "detail": detail}
    row.update(extra)
    return row


def _read_json(path):
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        return data if isinstance(data, (dict, list)) else None
    except (OSError, ValueError):
        return None


def _load_js(path, varname):
    """`const NAME = {...};` 형태의 자료 파일. 없거나 깨지면 None."""
    if not os.path.exists(path):
        return None
    try:
        txt = re.sub(r"^\s*//.*$", "", open(path, encoding="utf-8").read(), flags=re.M)
        m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
        return json.loads(m.group(1)) if m else None
    except (OSError, ValueError):
        return None


def _parse_iso(value):
    if not isinstance(value, str) or not value:
        return None
    try:
        dt = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=KST)
    return dt.astimezone(KST)


# ---------------------------------------------------------------- 1. 시세 · 자동분석 산출물

def check_pipeline_output(root, now, key):
    cfg = PW.PIPELINES[key]
    path = os.path.join(root, cfg["output"])
    if not os.path.exists(path):
        return component(UNKNOWN, f"{key.upper()}_FILE_MISSING", f"{cfg['output']} 파일이 없어 확인하지 못했다")
    stamp = read_stamp(path, cfg["pattern"])
    if stamp is None:
        return component(INSUFF, f"{key.upper()}_STAMP_UNREADABLE", f"{cfg['output']} 의 시각 라벨을 해석하지 못했다")
    age = int((now - stamp).total_seconds() // 60)
    base = {"basisAt": stamp.isoformat(), "ageMin": age}
    if PW.in_window(now):
        if age <= cfg["stale_min"]:
            return component(OK, f"{key.upper()}_FRESH", f"{age}분 전 갱신(임계 {cfg['stale_min']}분)", **base)
        # 수집 창이 막 열렸을 때는 첫 갱신까지 시간이 걸린다(실측 14~29분). 워치독과 같은 유예를 준다 —
        # 어제 자료가 있고 창이 열린 지 유예 안이면 "첫 수집 대기"지 고장이 아니다.
        since_open = (now - PW.window_open_at(now)).total_seconds() / 60
        if since_open < cfg["grace_min"] and stamp.date() >= previous_trading_day(now.date()):
            return component(IDLE, f"{key.upper()}_WAITING_FIRST_UPDATE",
                             f"수집 창 열린 지 {since_open:.0f}분 · 오늘 첫 갱신 대기(유예 {cfg['grace_min']}분) · 마지막 {stamp:%m-%d %H:%M}", **base)
        return component(FAULT, f"{key.upper()}_STALE", f"장중인데 {age}분째 갱신 없음(임계 {cfg['stale_min']}분)", **base)
    # 장외·주말·휴장일: 마지막 거래일 자료가 있으면 정상 대기
    ltd = last_trading_day(now.date())
    if is_krx_trading_day(now.date()) and _hm(now) < PW.WINDOW_OPEN:
        ltd = previous_trading_day(now.date())
    if stamp.date() >= ltd:
        return component(IDLE, f"{key.upper()}_IDLE", f"수집 창 밖 · 마지막 거래일({ltd}) 자료 있음({stamp:%m-%d %H:%M})", **base)
    return component(FAULT, f"{key.upper()}_MISSING_LAST_SESSION",
                     f"마지막 거래일({ltd}) 자료가 없다 — 마지막 갱신 {stamp:%Y-%m-%d %H:%M}", **base)


# ---------------------------------------------------------------- 2. 관측 종목 수

def check_coverage(root):
    auto = _load_js(os.path.join(root, "auto_analysis.js"), "LIVE_AUTO")
    tick_path = os.path.join(root, "tickers.js")
    expected = None
    if os.path.exists(tick_path):
        try:
            t = re.sub(r"^\s*//.*$", "", open(tick_path, encoding="utf-8").read(), flags=re.M)
            expected = len(json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1)))
        except (OSError, ValueError, AttributeError):
            expected = None
    if not isinstance(auto, dict) or not isinstance(auto.get("stocks"), dict):
        return component(UNKNOWN, "COVERAGE_UNREADABLE", "auto_analysis.js 를 읽지 못해 관측 종목 수를 확인하지 못했다")
    stocks = auto["stocks"]
    rows = len(stocks)
    codes = set(stocks.keys())
    calls = {}
    valid = 0
    for v in stocks.values():
        call = ((v or {}).get("chief") or {}).get("call")
        calls[call] = calls.get(call, 0) + 1
        if call in ("BUY", "HOLD", "SELL"):
            valid += 1
    extra = {"rows": rows, "uniqueCodes": len(codes), "validCalls": valid, "expected": expected, "calls": calls,
             "generatedAt": auto.get("generatedAt")}
    if expected is None:
        return component(INSUFF, "COVERAGE_EXPECTED_UNKNOWN", f"관측 {len(codes)}종목 · 기대 종목 수를 읽지 못했다", **extra)
    missing = expected - len(codes)
    if missing <= 0 and valid == len(codes):
        return component(OK, "COVERAGE_FULL", f"{len(codes)}/{expected} 종목 관측 · 유효 판단 {valid}", **extra)
    if missing <= 10:
        return component(OK, "COVERAGE_NEAR_FULL", f"{len(codes)}/{expected} 종목 관측(누락 {missing}) · 유효 판단 {valid}", **extra)
    if len(codes) * 2 < expected:
        return component(FAULT, "COVERAGE_COLLAPSED", f"관측 {len(codes)}/{expected} — 절반 미만", **extra)
    return component(INSUFF, "COVERAGE_PARTIAL", f"관측 {len(codes)}/{expected}(누락 {missing}) · 유효 판단 {valid}", **extra)


# ---------------------------------------------------------------- 3. 지표 출처 필드 · 공시

def check_indicator_provenance(root):
    doc = _read_json(os.path.join(root, "indicators.json"))
    if not isinstance(doc, dict):
        return component(UNKNOWN, "INDICATORS_UNREADABLE", "indicators.json 을 읽지 못했다")
    fetched = doc.get("analysisDataFetchedAt")
    sample = None
    for v in (doc.get("stocks") or {}).values():
        if isinstance(v, dict):
            sample = v
            break
    last_bar = ((sample or {}).get("tech") or {}).get("lastBarDate") if sample else None
    flow_end = ((sample or {}).get("flow") or {}).get("periodEndDate") if sample else None
    extra = {"generatedAt": doc.get("generatedAt"), "analysisDataFetchedAt": fetched,
             "sampleLastBarDate": last_bar, "sampleFlowPeriodEndDate": flow_end}
    if not fetched or not last_bar:
        return component(INSUFF, "INDICATORS_PROVENANCE_MISSING",
                         "출처 필드(analysisDataFetchedAt·tech.lastBarDate)가 아직 없다 — 코드(PR #529)는 병합됐고 생성물 반영을 기다린다", **extra)
    return component(OK, "INDICATORS_PROVENANCE_OK", f"수집 시작 {fetched} · 마지막 봉 {last_bar} · 수급 기준일 {flow_end}", **extra)


def check_dart(root, now):
    doc = _load_js(os.path.join(root, "dart_today.js"), "DART_TODAY")
    if not isinstance(doc, dict):
        return component(UNKNOWN, "DART_UNREADABLE", "dart_today.js 를 읽지 못했다")
    gen = doc.get("generatedAt")
    state = doc.get("coverageState")
    extra = {"generatedAt": gen, "coverageState": state, "count": doc.get("count")}
    if state not in ("EVENT_DETECTED", "NO_EVENT", "SOURCE_UNAVAILABLE", "PARTIAL", None):
        return component(INSUFF, "DART_STATE_UNKNOWN", f"공시 상태명 '{state}' 는 알려진 값이 아니다", **extra)
    if state == "SOURCE_UNAVAILABLE":
        return component(INSUFF, "DART_SOURCE_UNAVAILABLE", "공시 원천을 받지 못했다(판단에는 쓰지 않는 참고 정보)", **extra)
    return component(OK, "DART_OK", f"공시 {doc.get('count')}건 · 상태 {state} · 생성 {gen}", **extra)


# ---------------------------------------------------------------- 4. 모의투자(PAPER)

def check_paper(root, now):
    state = _read_json(os.path.join(root, "paper_trading", "state.json"))
    cfg = _read_json(os.path.join(root, "paper_runner_config.json"))
    active = (cfg or {}).get("activeRunner") if isinstance(cfg, dict) else None
    summary = _read_json(os.path.join(root, "paper_trading", "summary.json"))
    open_trades = (summary or {}).get("openTrades") if isinstance(summary, dict) else None
    if not isinstance(state, dict):
        return component(UNKNOWN, "PAPER_STATE_UNREADABLE", "paper_trading/state.json 을 읽지 못했다", activeRunner=active)
    last_at = _parse_iso(state.get("lastCycleAt"))
    result = str(state.get("lastCycleResult") or "")
    extra = {"activeRunner": active, "lastCycleAt": state.get("lastCycleAt"), "lastCycleResult": result[:80],
             "openTrades": open_trades}
    if last_at is None:
        return component(UNKNOWN, "PAPER_NO_CYCLE_RECORD", "마지막 회차 기록이 없다", **extra)
    today = now.date()
    trading_today = is_krx_trading_day(today)
    if trading_today and _hm(now) >= PAPER_GRACE_UNTIL:
        expected_day = today
    else:
        expected_day = previous_trading_day(today) if not trading_today else previous_trading_day(today)
    last_day = last_at.date()
    extra["expectedCycleDay"] = expected_day.isoformat()
    if last_day < expected_day:
        gap_days = sum(1 for i in range(1, (today - last_day).days + 1)
                       if is_krx_trading_day(last_day + datetime.timedelta(days=i)) and last_day + datetime.timedelta(days=i) <= expected_day)
        return component(FAULT, "PAPER_NO_CYCLE",
                         f"거래일 {expected_day} 회차 기록 0건 — 마지막 회차 {last_at:%Y-%m-%d %H:%M} (거래일 {gap_days}일 공백) · 활성 러너 {active}",
                         gapTradingDays=gap_days, **extra)
    neutral = result.startswith(("HOLIDAY", "BASELINE_CAPTURED", "ENGINE_NOT_STARTED", "RUNNER_NOT_ACTIVE", "RUNNER_UNDECLARED"))
    if last_day == today and not (result.startswith("CYCLE_OK") or neutral or not result):
        return component(FAULT, "PAPER_CYCLE_FAILED", f"오늘 회차가 실패로 끝났다: {result[:60]}", **extra)
    in_paper_window = trading_today and PAPER_FIRST_CYCLE <= _hm(now) <= PAPER_LAST_CYCLE
    if in_paper_window and last_day == today:
        return component(OK, "PAPER_RUNNING", f"오늘 마지막 회차 {last_at:%H:%M} · {result[:40]} · 보유 {open_trades}", **extra)
    if trading_today and _hm(now) < PAPER_GRACE_UNTIL:
        return component(IDLE, "PAPER_WAITING_FIRST_CYCLE", f"오늘 첫 회차 대기(09:05) · 마지막 회차 {last_at:%Y-%m-%d %H:%M} · 보유 {open_trades}", **extra)
    return component(IDLE, "PAPER_IDLE", f"회차 창 밖 · 마지막 회차 {last_at:%Y-%m-%d %H:%M} · 보유 {open_trades}", **extra)


# ---------------------------------------------------------------- 5. Evolution

def check_evolution(root, now):
    doc = _read_json(os.path.join(root, "gaeo_evolution", "status", "evolution_status.json"))
    if not isinstance(doc, dict):
        return component(UNKNOWN, "EVOLUTION_UNREADABLE", "evolution_status.json 을 읽지 못했다")
    gen = _parse_iso(doc.get("generatedAt"))
    extra = {"mode": doc.get("mode"), "generatedAt": doc.get("generatedAt"), "systemHealth": doc.get("systemHealth"),
             "uniqueDays": (doc.get("baselineSummary") or {}).get("uniqueDays"),
             "researchNeeded": doc.get("researchNeeded")}
    if gen is None:
        return component(INSUFF, "EVOLUTION_STAMP_UNREADABLE", "generatedAt 을 해석하지 못했다", **extra)
    age_days = (now - gen).total_seconds() / 86400
    extra["ageDays"] = round(age_days, 1)
    if doc.get("safeModeReasons"):
        return component(FAULT, "EVOLUTION_SAFE_MODE", f"SAFE_MODE: {doc.get('safeModeReasons')}", **extra)
    if age_days > EVOLUTION_MAX_AGE_DAYS:
        return component(FAULT, "EVOLUTION_STALE", f"주간 실행이 {age_days:.0f}일째 없다(허용 {EVOLUTION_MAX_AGE_DAYS}일)", **extra)
    if str(doc.get("systemHealth", "OK")) != "OK":
        return component(FAULT, "EVOLUTION_UNHEALTHY", f"systemHealth={doc.get('systemHealth')}", **extra)
    if doc.get("mode") == "BOOTSTRAP_SHADOW":
        return component(IDLE, "EVOLUTION_BOOTSTRAP", f"표본 축적 중(판단일 {extra['uniqueDays']}) · 마지막 실행 {gen:%m-%d}", **extra)
    return component(OK, "EVOLUTION_OK", f"모드 {doc.get('mode')} · 마지막 실행 {gen:%m-%d}", **extra)


# ---------------------------------------------------------------- 6. 예정 시험 일정

def check_validation_schedule(root, now):
    cfg = _read_json(os.path.join(root, "config", "validation_schedule.json"))
    if not isinstance(cfg, dict):
        return component(UNKNOWN, "SCHEDULE_UNREADABLE", "config/validation_schedule.json 을 읽지 못했다")
    ledger_path = os.path.join(root, cfg.get("ledgerPath", ""))
    ledger = []
    if cfg.get("ledgerPath") and os.path.exists(ledger_path):
        with open(ledger_path, encoding="utf-8") as fh:
            for line in fh:
                if line.strip():
                    try:
                        ledger.append(json.loads(line))
                    except ValueError:
                        ledger.append({"scheduleId": "?", "status": "UNREADABLE"})
    overdue, pending_today, upcoming, done = [], [], [], []
    for s in cfg.get("schedules", []):
        if s.get("status") == "PAST_COMPLETED":
            continue
        due = _parse_iso(s.get("dueAt"))
        if due is None:
            continue
        runs = [r for r in ledger if r.get("scheduleId") == s["scheduleId"]]
        final = [r for r in runs if r.get("status") in ("COMPLETED", "RECORDED")]
        last = runs[-1] if runs else None
        if final:
            done.append(s["scheduleId"])
            continue
        if last and last.get("status") == "INSUFFICIENT":
            nxt = _parse_iso(last.get("nextCheckAt"))
            if nxt and now > nxt + datetime.timedelta(hours=SCHEDULE_LATE_AFTER_HOURS):
                overdue.append(f"{s['scheduleId']}(재확인 예정 {nxt:%m-%d} 지남)")
            else:
                upcoming.append(f"{s['scheduleId']}(표본 부족 → 재확인 {nxt:%m-%d})" if nxt else s["scheduleId"])
            continue
        if now >= due + datetime.timedelta(hours=SCHEDULE_LATE_AFTER_HOURS):
            overdue.append(f"{s['scheduleId']}(예정 {due:%m-%d %H:%M} · {int((now - due).total_seconds() // 3600)}시간 지남)")
        elif now >= due:
            pending_today.append(s["scheduleId"])
        else:
            upcoming.append(f"{s['scheduleId']}({due:%m-%d})")
    last_rec = ledger[-1] if ledger else None
    extra = {"overdue": overdue, "dueNow": pending_today, "upcoming": upcoming, "done": done,
             "lastLedger": ({"scheduleId": last_rec.get("scheduleId"), "runAt": last_rec.get("runAt"), "status": last_rec.get("status"),
                             "resultPath": last_rec.get("resultPath"),
                             "resultFileExists": bool(last_rec.get("resultPath")) and os.path.exists(os.path.join(root, str(last_rec.get("resultPath"))))}
                            if last_rec else None)}
    if overdue:
        return component(FAULT, "SCHEDULE_OVERDUE", "예정 시험이 실행 기록 없이 지났다: " + "; ".join(overdue), **extra)
    if pending_today:
        return component(IDLE, "SCHEDULE_DUE_NOW", "예정 시각이 지나 실행을 기다리는 시험: " + ", ".join(pending_today), **extra)
    nxt = upcoming[0] if upcoming else "없음"
    return component(OK, "SCHEDULE_ON_TRACK", f"미실행·지연 없음 · 다음 시험 {nxt}", **extra)


# ---------------------------------------------------------------- 7. 사전등록 기록 누락 (--deep)

def check_prereg_recording(root, now):
    try:
        import evaluate_preregistered_buy_filters as E
        from pathlib import Path
        hist, closes, prov = E.load_inputs(Path(root))
        rows, dropped, truncated = E.collect_rows(hist, closes, now.date().isoformat())
    except Exception as e:                       # noqa: BLE001 — 어떤 실패든 '확인 불가'
        return component(UNKNOWN, "PREREG_CHECK_FAILED", f"사전등록 기록 확인 실패: {type(e).__name__}")
    buy = [r for r in rows if r.get("call") == "BUY"]
    unrecorded = sum(1 for r in buy if not r.get("featureRecorded"))
    days = len({r["day"] for r in rows})
    extra = {"maturedDecisionDays": days, "buyRows": len(buy), "buyFeatureUnrecorded": unrecorded,
             "retentionTruncatedCodes": len(truncated)}
    if unrecorded:
        return component(FAULT, "PREREG_FEATURE_UNRECORDED",
                         f"BUY {unrecorded}건에 급등 특징(overheat) 기록이 없다 — 러너 archive_analysis 확인 필요", **extra)
    if days == 0:
        return component(IDLE, "PREREG_NO_MATURED_YET", "창 안에서 아직 익은 판단일이 없다(표본 축적 중)", **extra)
    return component(OK, "PREREG_RECORDING_OK", f"익은 판단일 {days}일 · BUY {len(buy)}건 · 특징 미기록 0", **extra)


# ---------------------------------------------------------------- 8. 워크플로 유효성 (--github) · 사이트 전달 (--probe-pages)

def check_workflows_github():
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    if not repo or not token:
        return component(UNKNOWN, "WORKFLOWS_NO_TOKEN", "GITHUB_REPOSITORY·토큰이 없어 워크플로 유효성을 확인하지 못했다")
    try:
        import check_workflow_health as CW
        results = {wf: CW.check(repo, token, wf) for wf in CW.CRITICAL}
    except Exception as e:                       # noqa: BLE001
        return component(UNKNOWN, "WORKFLOWS_CHECK_FAILED", f"조회 실패: {type(e).__name__}")
    broken = [wf for wf, (st, _) in results.items() if st == "broken"]
    unknown = [wf for wf, (st, _) in results.items() if st == "unknown"]
    extra = {"results": {wf: st for wf, (st, _) in results.items()}}
    if broken:
        return component(FAULT, "WORKFLOWS_BROKEN", "GitHub 이 파싱하지 못하는 워크플로: " + ", ".join(broken), **extra)
    if unknown:
        return component(UNKNOWN, "WORKFLOWS_PARTIAL", "일부 워크플로를 확인하지 못했다: " + ", ".join(unknown), **extra)
    return component(OK, "WORKFLOWS_VALID", "핵심 워크플로 전부 유효", **extra)


# 예약 실행(GitHub cron) 실측 — "돌았어야 할 시각에 실제로 돌았나"를 워크플로마다 따로 잰다(2026-09-10 구간 D).
#   cron 지연/미실행(GitHub 무료 러너는 수십 분 밀리거나 건너뛰기도 한다) · 워크플로 비활성(60일 비활성·수동 끔) ·
#   마지막 run 실패(권한·문법·실행 오류) · 잘못된 ref 를 구분한다. "run 이 돌고 있다"를 건강 신호로 쓰지 않는다 — 산출물은 별도 항목이 잰다.
SCHEDULED_WORKFLOWS = {
    "pipeline-watchdog.yml": {"label": "워치독", "intervalMin": 15, "windowOnly": True},
    "ops-daily.yml": {"label": "일일 점검·예정 시험 실행기", "dailyAtHM": (17, 5), "weekdaysOnly": True},   # 예비 발화 17:37·18:11 은 유예(180분) 안
}
SCHEDULED_GRACE_MIN = 180        # GitHub cron 지연 허용(무료 러너 실측: 수십 분~2시간). 일일형은 예정 시각+유예, 간격형은 (지금-간격)-유예 가 기준


def _expected_last_fire(spec, now):
    """이 워크플로가 지금까지 **마지막으로 돌았어야 할 시각**. 없으면 None(지금은 돌 시간이 아니다)."""
    if spec.get("windowOnly"):
        # 장중 15분 간격: 거래일 창 안이면 now - interval, 창 밖이면 마지막 거래일의 창 끝(pipeline_watchdog.WINDOW_CLOSE)
        if PW.in_window(now):
            return now - datetime.timedelta(minutes=spec["intervalMin"])
        close_h, close_m = (int(x) for x in PW.WINDOW_CLOSE.split(":"))
        if is_krx_trading_day(now.date()) and now.strftime("%H:%M") >= PW.WINDOW_CLOSE:
            day = now.date()
        else:
            day = last_trading_day(now.date() - datetime.timedelta(days=1))
        return datetime.datetime.combine(day, datetime.time(close_h, close_m), KST)
    hh, mm = spec["dailyAtHM"]
    day = now.date()
    for _ in range(10):
        candidate = datetime.datetime.combine(day, datetime.time(hh, mm), KST)
        weekday_ok = (day.weekday() < 5) if spec.get("weekdaysOnly") else True
        if weekday_ok and candidate <= now:
            return candidate
        day -= datetime.timedelta(days=1)
    return None


def _judge_scheduled(wf, spec, state, runs, now, created_at=None):
    """(status, code, detail, extra) — 워크플로 하나.

    미실행 판정의 근거는 **schedule 이벤트 run** 뿐이다(2026-09-10 별도 검토 P1-1). 수동(dispatch)·마커 push 로 뜬 run 은
    "일은 됐다"는 뜻이지 "예약이 떴다"는 뜻이 아니고, 워치독 안에서 이 판정이 돌 때는 워치독 자기 run 이 항상 runs[0] 이라
    runs[0] 을 보면 cron 공백을 영원히 못 본다. schedule 발화가 한 번도 없으면 워크플로 생성 시각(created_at)을 "마지막 발화"로
    본다 — 생성 뒤 예정 시각+유예가 지났는데도 발화가 없으면 미실행이고, 예정 시각 전에 생겼으면 아직 첫 발화 전(정상 대기)이다.
    간격형은 창이 열린 시각을 하한으로 잡아(P1-2) 아침 첫 슬롯 전에 전날 마지막 run 을 미실행으로 오판하지 않는다.
    모르는 값(state 없음·시각 파싱 실패)은 확인 불가다 — 정상으로도 비활성으로도 적지 않는다(P2-2).
    """
    extra = {"state": state, "lastRunAt": None, "lastConclusion": None, "lastEvent": None, "expectedBy": None,
             "lastScheduleRunAt": None, "lateMin": None, "manualRunAfterExpected": None}
    if not state:
        return UNKNOWN, "SCHEDULED_STATE_UNKNOWN", f"{wf}: 워크플로 상태(state)를 읽지 못했다 — 모른다를 비활성으로 적지 않는다", extra
    if state != "active":
        return FAULT, "WORKFLOW_DISABLED", f"{wf}: 워크플로가 비활성({state}) — cron 이 아예 돌지 않는다(60일 비활성 자동 끔·수동 끔)", extra
    sched = [r for r in runs if r.get("event") == "schedule"]
    last = runs[0] if runs else None
    if last:
        extra.update({"lastRunAt": last.get("created_at"), "lastConclusion": last.get("conclusion"), "lastEvent": last.get("event"),
                      "lastBranch": last.get("head_branch")})
    expected = _expected_last_fire(spec, now)
    extra["expectedBy"] = expected.isoformat() if expected else None
    if not runs:
        return FAULT, "SCHEDULED_NEVER_RAN", f"{wf}: 실행 기록이 하나도 없다", extra
    last_sched = sched[0] if sched else None
    if last_sched:
        anchor = _parse_iso(last_sched.get("created_at"))
        extra["lastScheduleRunAt"] = last_sched.get("created_at")
        if last_sched.get("head_branch") not in (None, "main"):
            return FAULT, "SCHEDULED_WRONG_REF", f"{wf}: 마지막 schedule run 이 main 이 아닌 ref({last_sched.get('head_branch')})에서 돌았다", extra
        if last_sched.get("status") == "completed" and last_sched.get("conclusion") not in ("success", "skipped", None):
            return FAULT, "SCHEDULED_LAST_RUN_FAILED", f"{wf}: 마지막 schedule run 이 {last_sched.get('conclusion')} — 권한·문법·실행 오류일 수 있다(run 로그 확인)", extra
    else:
        anchor = _parse_iso(created_at) if created_at else None
    if anchor is None:
        return UNKNOWN, "SCHEDULED_TIME_UNPARSED", f"{wf}: 마지막 schedule run 또는 워크플로 생성 시각을 읽지 못했다(모른다를 정상으로 적지 않는다)", extra
    grace = datetime.timedelta(minutes=SCHEDULED_GRACE_MIN)
    since = lambda t: int((now - t).total_seconds() // 60)
    manual_after = [r for r in runs if r.get("event") != "schedule" and expected is not None
                    and (_parse_iso(r.get("created_at")) or anchor) >= expected]
    extra["manualRunAfterExpected"] = manual_after[0].get("created_at") if manual_after else None
    manual_note = (f" · 수동/이벤트 run {str(manual_after[0].get('created_at'))[:16]} 은 있다(일은 됐을 수 있으나 예약은 안 떴다)"
                   if manual_after else "")
    origin_note = "마지막 schedule run" if last_sched else "워크플로 생성(schedule 발화 0회)"
    if spec.get("intervalMin"):
        interval = datetime.timedelta(minutes=spec["intervalMin"])
        open_h, open_m = (int(x) for x in PW.WINDOW_OPEN.split(":"))
        if PW.in_window(now):
            start = max(anchor, PW.window_open_at(now))
            overdue = now - start > interval + grace
        else:
            day_open = datetime.datetime.combine(expected.date(), datetime.time(open_h, open_m), KST)
            start = max(anchor, day_open)
            overdue = expected - start > grace
        if overdue:
            return FAULT, "SCHEDULED_RUN_MISSED", (f"{wf}: 돌았어야 할 시각({expected:%m-%d %H:%M})을 {SCHEDULED_GRACE_MIN}분 넘게 지났는데 "
                                                   f"{origin_note}은 {since(anchor)}분 전 — GitHub cron 지연/건너뜀(무료 러너) 또는 다른 원인{manual_note}"), extra
        if not sched:
            return IDLE, "SCHEDULED_ONLY_MANUAL", f"{wf}: schedule 발화가 아직 없다(최근 run {len(runs)}건은 전부 수동/이벤트) — 정상으로 적지 않는다", extra
        if not PW.in_window(now):
            return IDLE, "SCHEDULED_OUT_OF_WINDOW", f"{wf}: 지금은 예약 실행 시간이 아니다(마지막 schedule run {str(last_sched.get('created_at'))[:16]}, 창 안에서는 제때 돌았다)", extra
        return OK, "SCHEDULED_ON_TIME", f"{wf}: 마지막 schedule run {str(last_sched.get('created_at'))[:16]} ({last_sched.get('conclusion') or last_sched.get('status')})", extra
    # 일일형
    if expected is None:
        return IDLE, "SCHEDULED_OUT_OF_WINDOW", f"{wf}: 지금은 예약 실행 시간이 아니다", extra
    if anchor < expected:
        if now >= expected + grace:
            return FAULT, "SCHEDULED_RUN_MISSED", (f"{wf}: 예정 시각({expected:%m-%d %H:%M}) 뒤 {SCHEDULED_GRACE_MIN}분이 지나도록 schedule 발화가 없다 — "
                                                   f"{origin_note}은 {since(anchor)}분 전. GitHub cron 지연/건너뜀(무료 러너) 또는 다른 원인{manual_note}"), extra
        return IDLE, "SCHEDULED_PENDING", (f"{wf}: 예정 시각({expected:%m-%d %H:%M})은 지났고 cron 발화를 {SCHEDULED_GRACE_MIN}분까지 기다리는 중"
                                           f"({origin_note} {since(anchor)}분 전) — 유예가 지나면 미실행으로 적는다"), extra
    extra["lateMin"] = int((anchor - expected).total_seconds() // 60)
    if not sched:
        return IDLE, "SCHEDULED_ONLY_MANUAL", f"{wf}: 워크플로가 예정 시각 뒤에 생겨 아직 첫 schedule 발화 전(최근 run {len(runs)}건은 수동/이벤트) — 정상으로 적지 않는다", extra
    late_note = f", 예정보다 {extra['lateMin']}분 늦게" if extra["lateMin"] > 0 else ""
    return OK, "SCHEDULED_ON_TIME", f"{wf}: 마지막 schedule run {str(last_sched.get('created_at'))[:16]} ({last_sched.get('conclusion') or last_sched.get('status')}{late_note})", extra


def check_scheduled_runs(now=None):
    """--github 전용. 워치독·ops-daily 가 실제로 돌았는지를 워크플로마다 따로 판정한다(cron 지연 vs 비활성 vs 실패 vs 잘못된 ref)."""
    now = now or datetime.datetime.now(KST)
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    if not repo or not token:
        return component(UNKNOWN, "SCHEDULED_NO_TOKEN", "GITHUB_REPOSITORY·토큰이 없어 예약 실행 여부를 확인하지 못했다")
    try:
        import check_workflow_health as CW
    except ImportError:
        return component(UNKNOWN, "SCHEDULED_CHECK_FAILED", "check_workflow_health 모듈 없음")
    per = {}
    for wf, spec in SCHEDULED_WORKFLOWS.items():
        try:
            meta = CW._get(f"https://api.github.com/repos/{repo}/actions/workflows/{wf}", token)
            runs = CW._get(f"https://api.github.com/repos/{repo}/actions/workflows/{wf}/runs?per_page=10", token).get("workflow_runs", [])
        except Exception as e:                   # noqa: BLE001 — 조회 실패는 '확인 불가'
            per[wf] = {"status": UNKNOWN, "code": "SCHEDULED_QUERY_FAILED", "detail": f"{wf}: 조회 실패 {type(e).__name__}"}
            continue
        st, code, detail, extra = _judge_scheduled(wf, spec, str(meta.get("state") or ""), runs, now, created_at=meta.get("created_at"))
        per[wf] = {"status": st, "code": code, "detail": detail, **extra}
    faults = [v["detail"] for v in per.values() if v["status"] == FAULT]
    unknowns = [v["detail"] for v in per.values() if v["status"] == UNKNOWN]
    if faults:
        return component(FAULT, "SCHEDULED_RUNS_FAULT", " / ".join(faults), workflows=per)
    if unknowns:
        return component(UNKNOWN, "SCHEDULED_RUNS_UNKNOWN", " / ".join(unknowns), workflows=per)
    if all(v["status"] == IDLE for v in per.values()):
        return component(IDLE, "SCHEDULED_RUNS_IDLE", " / ".join(v["detail"] for v in per.values()), workflows=per)
    return component(OK, "SCHEDULED_RUNS_OK", " / ".join(v["detail"] for v in per.values()), workflows=per)


def probe_pages(local_prices, now, url="https://gaeoteam.com/data.js", timeout=15):
    """사이트(GitHub Pages)가 실제로 최신 시세를 내보내는지. 실패는 '확인 불가'다."""
    try:
        import urllib.request
        req = urllib.request.Request(url, headers={"User-Agent": "gaeo-ops-status", "Cache-Control": "no-cache"})
        with urllib.request.urlopen(req, timeout=timeout) as res:
            head = res.read(4000).decode("utf-8", "replace")
    except Exception as e:                       # noqa: BLE001
        return component(UNKNOWN, "PAGES_UNREACHABLE", f"사이트를 읽지 못했다({type(e).__name__}) — 반영 여부 확인 불가")
    m = re.search(r'"date"\s*:\s*"([^"]{10,60})"', head)
    d = re.search(r"(\d{4}-\d{2}-\d{2})", m.group(1)) if m else None
    t = re.search(r"(\d{2}:\d{2})", m.group(1)) if m else None
    if not (m and d and t):
        return component(INSUFF, "PAGES_STAMP_UNREADABLE", "사이트 data.js 의 시각 라벨을 해석하지 못했다")
    site = datetime.datetime.strptime(d.group(1) + " " + t.group(1), "%Y-%m-%d %H:%M").replace(tzinfo=KST)
    extra = {"siteStamp": site.isoformat(), "localStamp": local_prices.get("basisAt")}
    local = _parse_iso(local_prices.get("basisAt"))
    if local is None:
        return component(OK, "PAGES_SERVING", f"사이트 시세 라벨 {site:%m-%d %H:%M}", **extra)
    lag = (local - site).total_seconds() / 60
    if lag > PAGES_LAG_MAX_MIN and PW.in_window(now):
        return component(FAULT, "PAGES_LAG", f"사이트가 {lag:.0f}분 뒤처짐(저장소 {local:%H:%M} vs 사이트 {site:%H:%M})", **extra)
    return component(OK, "PAGES_SERVING", f"사이트 시세 {site:%m-%d %H:%M}(저장소 대비 {max(lag, 0):.0f}분 차)", **extra)


# ---------------------------------------------------------------- 종합

def check_decisions(root, now):
    doc = _read_json(os.path.join(root, 'research_archive', 'decisions', 'status.json'))
    if not isinstance(doc, dict) or not doc.get('lastVerifiedAt'):
        return component(UNKNOWN, 'DECISIONS_UNREADABLE', '판단 원본 저장·채점 연결을 확인하지 못했다')
    h = (doc.get('horizons') or {}).get('5') or {}
    if any(not isinstance(h.get(k), int) for k in ('evaluated','pending','blocked','withheld')):
        return component(FAULT, 'DECISIONS_INVALID', '판단 결과 상태별 개수가 없거나 올바르지 않다')
    if sum(h[k] for k in ('evaluated','pending','blocked','withheld')) != doc.get('dailyRecordCount'):
        return component(FAULT, 'DECISIONS_COUNT_MISMATCH', '저장된 일별 판단 수와 결과 상태별 개수가 다르다')
    try:
        import decision_records as decisions
        archive = decisions.Path(root) / 'research_archive' / 'decisions'
        actual = decisions.summarize(decisions.read_records(archive), decisions.load_outcomes(archive),
                                     current_model=doc.get('currentModelVersion'))
        fields = ('rawRecordCount','dailyRecordCount','latestDecisionAt','horizons','byModelVersion')
        if any(actual.get(k) != doc.get(k) for k in fields):
            raise ValueError('Stored evidence differs from its summary')
        board = _load_js(os.path.join(root, 'model_scoreboard.js'), 'MODEL_SCOREBOARD')
        if not board or board.get('decisionTrace') != doc:
            raise ValueError('Public scoreboard is disconnected')
    except (OSError, ValueError, KeyError, TypeError, EOFError):
        return component(FAULT, 'DECISIONS_STORAGE_MISMATCH', '판단 원본·저장된 결과·공개 성적표가 연결되지 않거나 내용 검증에 실패했다')
    auto = _load_js(os.path.join(root, 'auto_analysis.js'), 'LIVE_AUTO')
    if auto and str(auto.get('generatedAt') or '') > str(doc.get('latestDecisionAt') or ''):
        return component(FAULT, 'DECISIONS_NOT_SAVED', '최신 자동분석이 원본 보존·성적표에 아직 연결되지 않았다')
    checked = _parse_iso(doc.get('lastVerifiedAt'))
    expected = last_trading_day(now.date()) if now.hour >= 17 else previous_trading_day(now.date())
    if not checked or checked.astimezone(KST).date() < expected:
        return component(FAULT, 'DECISIONS_NOT_EVALUATED', '예정된 판단 결과 저장·집계 갱신을 확인하지 못했다')
    detail = f"원본 {doc.get('rawRecordCount')}건 · 평가 {h['evaluated']} · 미래 대기 {h['pending']} · 자료 부족 {h['blocked']} · 판단 보류 {h['withheld']}"
    status = INSUFF if h['blocked'] else IDLE if h['pending'] or not doc.get('rawRecordCount') else OK
    return component(status, 'DECISIONS_VERIFIED', detail, counts=h,
                     latestDecisionAt=doc.get('latestDecisionAt'), lastVerifiedAt=doc.get('lastVerifiedAt'))


def collect(root=HERE, now=None, deep=False, github=False, pages=False):
    now = now or datetime.datetime.now(KST)
    comps = {}
    comps["prices"] = check_pipeline_output(root, now, "prices")
    comps["analysis"] = check_pipeline_output(root, now, "analysis")
    comps["coverage"] = check_coverage(root)
    comps["indicators"] = check_indicator_provenance(root)
    comps["dart"] = check_dart(root, now)
    comps["paper"] = check_paper(root, now)
    comps["evolution"] = check_evolution(root, now)
    comps["decisions"] = check_decisions(root, now)
    comps["schedule"] = check_validation_schedule(root, now)
    if deep:
        comps["prereg"] = check_prereg_recording(root, now)
    if github:
        comps["workflows"] = check_workflows_github()
        comps["scheduled"] = check_scheduled_runs(now)
    if pages:
        comps["pages"] = probe_pages(comps["prices"], now)
    counts = {k: 0 for k in LABELS}
    for c in comps.values():
        counts[c["status"]] += 1
    faults = sorted(k for k, c in comps.items() if c["status"] == FAULT)
    unknowns = sorted(k for k, c in comps.items() if c["status"] == UNKNOWN)
    sig_src = _signature_source(comps, faults, unknowns)
    report = {
        "schemaVersion": SCHEMA,
        "checkedAt": now.isoformat(),
        "tradingDay": is_krx_trading_day(now.date()),
        "inCollectionWindow": PW.in_window(now),
        "gitSha": _git_sha(root),
        "llmCalls": LLM_CALLS,
        "components": comps,
        "counts": counts,
        "faults": faults,
        "unknowns": unknowns,
        "signature": hashlib.sha1(sig_src.encode("utf-8")).hexdigest()[:10] if sig_src else "clean",
        "overall": FAULT if faults else (UNKNOWN if unknowns else (OK if counts[OK] and not counts[INSUFF] else IDLE)),
    }
    return report


def _signature_source(comps, faults, unknowns):
    """수리 요청서·이슈의 서명 원문. 예약 실행 실측(scheduled)은 GitHub cron 발화 여부에 따라 날마다 뒤집히는 만성 항목이라,
    다른 장애·확인 불가가 있으면 서명에서 뺀다(2026-09-10 검토 P2-6) — 같은 PAPER 사고가 서명별로 다른 INC 파일로 갈리지 않게.
    scheduled 만 문제일 때는 그대로 서명이 된다(코드가 고정이라 흔들리지 않는다)."""
    keys = [k for k in faults + unknowns if k != "scheduled"] or list(faults + unknowns)
    return "|".join(f"{k}:{comps[k]['code']}" for k in keys)


def _git_sha(root):
    try:
        return subprocess.run(["git", "-C", root, "rev-parse", "--short", "HEAD"], capture_output=True, text=True,
                              timeout=10).stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        return None


NAMES = {"decisions": "판단 원본·결과 연결", "prices": "시세", "analysis": "자동분석", "coverage": "관측 종목 수", "indicators": "지표 출처", "dart": "공시",
         "paper": "모의투자(PAPER)", "evolution": "Evolution", "schedule": "예정 시험", "prereg": "사전등록 기록",
         "workflows": "워크플로 유효성", "scheduled": "예약 실행 실측(워치독·일일 점검)", "pages": "사이트 전달"}


def summarize(report):
    """사람이 읽는 고정 문장. 모델이 만든 문장이 아니다."""
    lines = [f"[개오 통합 상태] 확인 시각 {report['checkedAt'][:16].replace('T', ' ')} KST · "
             f"{'거래일' if report['tradingDay'] else '비거래일'}{' · 수집 창 안' if report['inCollectionWindow'] else ''}"
             f" · 기준 커밋 {report.get('gitSha') or '?'} · LLM 호출 {report['llmCalls']}"]
    for key, c in report["components"].items():
        lines.append(f"  · {NAMES.get(key, key)}: {c['label']} — {c['detail']}")
    counts = report["counts"]
    tally = " · ".join(f"{LABELS[k]} {counts[k]}" for k in (OK, IDLE, INSUFF, FAULT, UNKNOWN, QUOTA) if counts[k])
    if report["faults"]:
        lines.append(f"결론: 장애 {len(report['faults'])}건 — 조치 필요 ({', '.join(NAMES.get(k, k) for k in report['faults'])}) · {tally}")
    elif report["unknowns"]:
        lines.append(f"결론: 장애는 없지만 확인 못 한 항목 {len(report['unknowns'])}건 — 정상이라는 뜻이 아니다 "
                     f"({', '.join(NAMES.get(k, k) for k in report['unknowns'])}) · {tally}")
    elif counts[INSUFF]:
        lines.append(f"결론: 장애 없음 · 자료 부족 {counts[INSUFF]}건은 판단하지 않은 것이지 고장이 아니다 · {tally}")
    else:
        lines.append(f"결론: 장애·확인 불가 없음 · {tally}")
    return "\n".join(lines)


REPAIR_HINTS = {
    "PRICES_STALE": ["pipeline-watchdog.yml 의 최근 run 로그(Step Summary)에서 update-prices 좀비/재기동 여부", "check_workflow_health(워크플로 파일 유효성)", "러너 push 연속 실패 → 자진 사퇴 로그(update-prices.yml)"],
    "ANALYSIS_STALE": ["pipeline-watchdog.yml 최근 run 로그", "update-analysis.yml run 목록(in_progress 좀비·0초 실패)", "test_workflow_size(블록 21,000B 한도)"],
    "PRICES_MISSING_LAST_SESSION": ["마지막 거래일 장중 update-prices run 존재 여부", "휴장일 달력(krx_calendar) 오류 가능성"],
    "ANALYSIS_MISSING_LAST_SESSION": ["마지막 거래일 update-analysis run 존재 여부", "워크플로 파일 유효성"],
    "PAPER_NO_CYCLE": ["docs/operations/HOME_PC_CHECKLIST.md 1~4절(집 PC 로그·doctor·러너 clone 재기준)", "paper_runner_config.json activeRunner", "Issue '🛑 [GAEO Paper] 오늘 모의투자가 실행되지 않았습니다'"],
    "PAPER_CYCLE_FAILED": ["paper_trading/state.json lastCycleResult 코드", "scripts/paper_doctor.ps1", "docs/PAPER_TRADING_LOCAL_RUNNER.md 7절(IP 허용목록)"],
    "EVOLUTION_STALE": ["evolution-lab.yml 최근 run(토 23:00 UTC)", "gaeo_evolution/status/last_run_manifest.json"],
    "EVOLUTION_SAFE_MODE": ["gaeo_evolution/evolution_constitution.sha256 대조", "docs/GAEO_EVOLUTION_SAFETY.md"],
    "SCHEDULE_OVERDUE": ["ops-daily(validation schedule) 워크플로 최근 run", "docs/audits/validation_runs/ledger.jsonl", "config/validation_schedule.json 의 dueAt·steps"],
    "PREREG_FEATURE_UNRECORDED": ["archive_analysis.py 의 chief.overheat 기록 경로", "buy_warning.py OVERHEAT_VERSION 일치 여부"],
    "WORKFLOWS_BROKEN": ["python3 check_workflow_health.py (토큰 필요)", "python3 -m unittest test_workflow_size"],
    "SCHEDULED_RUNS_FAULT": ["GitHub Actions 탭에서 해당 워크플로의 state(비활성이면 Enable) · 마지막 run 로그", "cron 지연이면 기다리되 산출물(시세·자동분석·원장)이 따로 정상인지 확인", "잘못된 ref 면 워크플로 파일의 branches·on 블록"],
    "PAGES_LAG": ["pages-build-deployment 워크플로 최근 run", "GitHub Pages 설정(main 브랜치 루트)"],
    "COVERAGE_COLLAPSED": ["analyze_auto.py 실행 로그(update-analysis run)", "collect_analyst_data.py 원천 응답"],
}


def build_repair_request(report):
    """장애가 있을 때만 쓰는 작은 수리 요청서. 같은 서명(signature)이면 같은 INC 번호 = 같은 사고."""
    if not report["faults"]:
        return None
    inc = f"INC-{report['signature']}"
    lines = [f"# {inc} — 개오 통합 상태 점검이 찾은 장애", "",
             f"- 확인 시각: {report['checkedAt']} (기준 커밋 {report.get('gitSha') or '?'})",
             f"- 이 파일은 `ops_status.py` 가 자동으로 쓴다(LLM 호출 0). 같은 사고는 같은 번호로 갱신된다.",
             "- 원인은 **확정하지 않는다.** 아래는 관련 파일·확인 순서다. 실제 수리는 사람 또는 개발 AI 세션이 한다.", ""]
    for key in report["faults"]:
        c = report["components"][key]
        lines += [f"## {NAMES.get(key, key)} — {c['code']}", "", f"- 증상: {c['detail']}"]
        for k in ("basisAt", "lastCycleAt", "expectedCycleDay", "generatedAt", "overdue"):
            if c.get(k):
                lines.append(f"- {k}: {c[k]}")
        hints = REPAIR_HINTS.get(c["code"], ["관련 워크플로 최근 run 로그", "해당 산출물 파일의 시각 라벨"])
        lines.append("- 확인 순서:")
        lines += [f"  {i}. {h}" for i, h in enumerate(hints, 1)]
        lines.append("")
    if report["unknowns"]:
        lines += ["## 확인하지 못한 항목(정상 아님)", ""]
        lines += [f"- {NAMES.get(k, k)}: {report['components'][k]['detail']}" for k in report["unknowns"]]
        lines.append("")
    lines.append(f"<!-- gaeo-ops-signature:{report['signature']} -->")
    return inc, "\n".join(lines) + "\n"


def main(argv=None):
    ap = argparse.ArgumentParser(description="개오 통합 상태 점검(LLM 호출 0)")
    ap.add_argument("--now", help="점검 기준 시각(ISO, 시험용). 기본: 지금(KST)")
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--deep", action="store_true", help="사전등록 기록 누락 확인(history.js 읽음)")
    ap.add_argument("--github", action="store_true", help="워크플로 유효성(GH_TOKEN·GITHUB_REPOSITORY 필요)")
    ap.add_argument("--probe-pages", action="store_true", help="사이트 전달 확인(네트워크)")
    ap.add_argument("--json", help="상태 JSON 을 쓸 경로")
    ap.add_argument("--repair-request", help="장애가 있을 때 INC-… 수리 요청서를 쓸 디렉터리")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args(argv)
    now = _parse_iso(args.now) if args.now else None
    report = collect(args.root, now=now, deep=args.deep, github=args.github, pages=args.probe_pages)
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump(report, fh, ensure_ascii=False, indent=1)
    if args.repair_request:
        rr = build_repair_request(report)
        if rr:
            os.makedirs(args.repair_request, exist_ok=True)
            path = os.path.join(args.repair_request, f"{rr[0]}.md")
            # 같은 사고(같은 서명)의 요청서가 이미 있으면 다시 쓰지 않는다 — 매일 시각만 바뀐 파일이 커밋으로 쌓이지 않게.
            marker = f"gaeo-ops-signature:{report['signature']}"
            exists_same = os.path.exists(path) and marker in open(path, encoding="utf-8").read()
            if not exists_same:
                with open(path, "w", encoding="utf-8") as fh:
                    fh.write(rr[1])
            if not args.quiet:
                print(f"수리 요청서: {path}{' (기존 동일 사고 유지)' if exists_same else ''}")
    if not args.quiet:
        print(summarize(report))
    return 1 if report["faults"] else (2 if report["unknowns"] else 0)


if __name__ == "__main__":
    sys.exit(main())
