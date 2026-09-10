#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""예정 검증 시험 실행기 — config/validation_schedule.json 의 일정을 GitHub Actions(또는 사람)가 돌리고, 결과를 append-only 원장에 남긴다.

원칙 (docs/VALIDATION_SCHEDULE.md 의 원칙과 같다 · 2026-09-10 구간 C 로 강화)
  · dueAt 전에는 실행하지 않는다. 지났는데 기록이 없으면 이번 점검이 실행하고 "지연 N시간"을 함께 남긴다.
  · 계획 모드(--apply 없음)는 **아무 명령도 실행하지 않는다**(외부 호출 0·파일 쓰기 0). 미래 시각(--now) 리허설은 임시 루트(--root)에서만.
  · 명령은 allowlist(config.commands)만. 자리표시자는 {cutoffDate} 하나. argv[0] 은 python3 로 고정.
  · 확인 시험(CONFIRMATION·SAMPLE_CHECK)은 표본 수만 센다(prereg_sample_count). 확정 평가 명령(prereg_evaluate)이 들어 있으면
    구조 가드가 실행 자체를 막는다(BLOCKED) — 실행이 늦어져 표본이 차더라도 확인 시험이 확정 평가로 둔갑하지 않는다.
  · 결과 JSON 이 없거나 필수 필드가 빠지면 exit 0 이어도 FAILED. 확정 평가(EVALUATION·RECONFIRMATION)는 입력 동결이 필수이고,
    공식 판정은 그 동결 입력에서 프로세스 안에서 계산한다(CLI 결과는 대조용 — 핵심 통계가 다르면 FAILED). 동결 실패 = FAILED.
  · 같은 일정은 하루 1회만 실행한다(cron·dispatch·재시작이 겹쳐도 같은 공식 결과를 두 번 내지 않는다).
  · 결과는 docs/audits/validation_runs/<scheduleId>/<시각>.json 에 새 파일로 쓰고 ledger.jsonl 에 한 줄 덧붙인다(덮어쓰기 없음).
    저장(push)이 실패하면 워크플로가 같은 커밋을 validation-inbox-<run> 브랜치에 보존하고, 다음 실행이 --reconcile-inbox 로
    회수한다(같은 결과를 다시 발행할 뿐, 새 시세로 다시 채점하지 않는다). --restore-result 는 보관본(artifact)에서 같은 결과를 복원한다.
  · INSUFFICIENT 면 onInsufficient 규칙대로 다음 확인 시점만 정한다(유리한 날을 고르지 않는다). 재확인 기준일은 **미리 적어 둔 다음 확인
    날짜**로 전진한다(recheck·report_and_wait). report_only 는 재확인하지 않는다. 재확인 상한(maxRechecks, 기본 3)을 넘으면
    RECHECK_LIMIT 로 멈추고 사람에게 보고한다. 실행 실패(크래시 포함)가 3회면 ESCALATED 로 멈춘다.
  · 일정의 anomalyRules 에 적힌 이상(team_weights 전환 ANOMALY · BUY overheat 기록 누락)은 ANOMALY 로 기록하고 수리 요청서를 쓴다(최종 상태).
  · 산식·Constitution·테스트를 고치지 않는다. EVALUATED 결과의 후속 조치는 followup.md 명세로만 남긴다(코드 변경은 사람/개발 AI 세션).
  · LLM 호출 0.

    python3 run_validation_schedule.py                       # 계획만(무엇이 due 인지) — 실행 0 · 파일 쓰기 0
    python3 run_validation_schedule.py --apply               # due 인 일정을 실행하고 기록한다
    python3 run_validation_schedule.py --replay docs/audits/validation_runs/<id>/<시각>.inputs.json.gz --result <시각>.json
    python3 run_validation_schedule.py --reconcile-inbox     # 저장 실패로 inbox 브랜치에 남은 결과를 회수(같은 결과 재발행)
    python3 run_validation_schedule.py --restore-result <결과.json>   # 보관본에서 같은 결과를 복원(재채점 0)
종료코드: 0 정상(실행 없음 포함) · 1 실행 실패/이상/상한 도달(사람 확인 필요) · 2 차단(미구현 명령·구조 가드·미래 시각 리허설 등)
"""
import argparse
import datetime
import gzip
import hashlib
import json
import os
import subprocess
import sys
import time
import traceback

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))
STEP_TIMEOUT_SEC = 900
MAX_FAILED_RUNS = 3
DEFAULT_MAX_RECHECKS = 3           # onInsufficient.maxRechecks 가 없을 때. 첫 실행 뒤 재확인을 이만큼만 더 한다.
FINAL_STATES = ("COMPLETED", "ANOMALY", "INSUFFICIENT_FINAL", "ESCALATED")
NEEDS_HUMAN_ACTIONS = ("ESCALATED", "RECHECK_LIMIT")
DEFAULT_RECHECK_HOUR = 17
FUTURE_TOLERANCE_SEC = 300
EVALUATION_STEP = "prereg_evaluate"                 # 확정 평가 명령 — 확인 시험에는 절대 넣지 않는다
EVALUATION_KINDS = ("EVALUATION", "RECONFIRMATION")   # 동결 입력이 공식 결과
COUNT_ONLY_KINDS = ("CONFIRMATION", "SAMPLE_CHECK", "PAST_CHECK")
CUTOFF_ADVANCING_RULES = ("recheck", "report_and_wait")
INBOX_PREFIX = "validation-inbox-"
CORE_COMPARE_KEYS = ("status", "sample", "verdicts", "holmP")
# CLI 는 전체 입력(창 밖 행 포함)을, 공식 판정은 창 안 동결 추출본을 읽는다. 그래서 "창 밖" 제외 집계(beforeWindow 등)와
# 보관 상한 판정은 정의상 다를 수 있다 — 창 안 표본 수·판정·p 값은 같아야 한다. 재현(--replay)은 동결본끼리라 전부 비교한다.
SAMPLE_KEYS_DIFFER_BY_SCOPE = ("excluded", "retentionTruncatedCodes")


def now_kst():
    return datetime.datetime.now(KST)


def parse_iso(v):
    if not v:
        return None
    dt = datetime.datetime.fromisoformat(str(v).replace("Z", "+00:00"))
    return (dt if dt.tzinfo else dt.replace(tzinfo=KST)).astimezone(KST)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_config(root):
    with open(os.path.join(root, "config", "validation_schedule.json"), encoding="utf-8") as fh:
        return json.load(fh)


def load_ledger(cfg, root):
    path = os.path.join(root, cfg["ledgerPath"])
    rows = []
    if os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                if line.strip():
                    rows.append(json.loads(line))
    return rows


def git_sha(root):
    try:
        return subprocess.run(["git", "-C", root, "rev-parse", "HEAD"], capture_output=True, text=True, timeout=10).stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        return None


# ---------------------------------------------------------------- 구조 가드

def structural_problems(cfg):
    """실행 전에 설정 자체가 등록 원칙을 어기는지 본다. 하나라도 있으면 계획·실행 모두 하지 않는다(exit 2)."""
    problems = []
    for s in cfg.get("schedules", []):
        kind = s.get("kind")
        steps = s.get("steps") or []
        if kind in COUNT_ONLY_KINDS and EVALUATION_STEP in steps:
            problems.append(f"{s.get('scheduleId')}: 확인 시험({kind})이 확정 평가 명령({EVALUATION_STEP})을 부른다 — 표본 수 확인(prereg_sample_count)만 허용")
        if kind in EVALUATION_KINDS and EVALUATION_STEP not in steps and s.get("status") != "PAST_COMPLETED":
            problems.append(f"{s.get('scheduleId')}: 확정 평가({kind})에 {EVALUATION_STEP} 단계가 없다")
        for step in steps:
            if step not in cfg.get("commands", {}):
                problems.append(f"{s.get('scheduleId')}: allowlist 에 없는 단계 {step}")
    return problems


# ---------------------------------------------------------------- 계획

def _recheck_cutoff(s, nxt):
    rule = ((s.get("onInsufficient") or {}).get("rule") or "")
    advances = (s.get("onInsufficient") or {}).get("cutoffAdvances")
    if advances is None:
        advances = rule in CUTOFF_ADVANCING_RULES
    if advances and nxt:
        return nxt.date().isoformat()
    return s["cutoffDate"]


def plan(cfg, ledger, now):
    """각 일정에 대해 무엇을 할지 정한다. 순수 함수."""
    out = []
    today = now.date().isoformat()
    for s in cfg["schedules"]:
        sid = s["scheduleId"]
        if s.get("status") == "PAST_COMPLETED":
            out.append({"scheduleId": sid, "action": "DONE", "reason": "과거 완료 기록"})
            continue
        due = parse_iso(s["dueAt"])
        recs = [r for r in ledger if r.get("scheduleId") == sid or (s.get("dedupeKey") and r.get("dedupeKey") == s.get("dedupeKey"))]
        if any(r.get("status") in FINAL_STATES for r in recs):
            out.append({"scheduleId": sid, "action": "DONE", "reason": f"최종 기록 있음({[r['status'] for r in recs if r.get('status') in FINAL_STATES][-1]})"})
            continue
        if any(str(r.get("runAt", ""))[:10] == today for r in recs):
            out.append({"scheduleId": sid, "action": "SKIP_TODAY", "reason": "오늘 이미 실행 기록이 있다(중복 방지)"})
            continue
        failed = [r for r in recs if r.get("status") == "FAILED"]
        if len(failed) >= MAX_FAILED_RUNS:
            out.append({"scheduleId": sid, "action": "ESCALATED", "reason": f"실행 실패 {len(failed)}회 — 사람 확인 필요(자동 재시도 중단)"})
            continue
        insuff = [r for r in recs if r.get("status") == "INSUFFICIENT"]
        if insuff:
            rule = (s.get("onInsufficient") or {})
            if rule.get("rule") == "report_only":
                out.append({"scheduleId": sid, "action": "DONE", "reason": "표본 부족 기록만(report_only) — 재확인하지 않는다"})
                continue
            max_re = int(rule.get("maxRechecks") or DEFAULT_MAX_RECHECKS)
            if len(insuff) > max_re:          # 첫 실행 1회 + 재확인 max_re 회를 모두 썼다 → 더 기다리지 않고 사람에게
                out.append({"scheduleId": sid, "action": "RECHECK_LIMIT",
                            "reason": f"표본 부족 재확인 {len(insuff) - 1}회 소진(상한 {max_re}) — 사람 확인 필요(자동 재확인 중단)"})
                continue
            nxt = parse_iso(insuff[-1].get("nextCheckAt"))
            if nxt and now < nxt:
                out.append({"scheduleId": sid, "action": "WAIT_RECHECK", "reason": f"표본 부족 → 재확인 예정 {nxt:%Y-%m-%d %H:%M}"})
                continue
            cutoff = _recheck_cutoff(s, nxt)
            out.append({"scheduleId": sid, "action": "RUN", "reason": f"재확인 {len(insuff)}회째(기준일 {cutoff})", "recheck": len(insuff),
                        "recheckId": f"{sid}-R{len(insuff)}", "cutoffDate": cutoff,
                        "lateHours": round((now - nxt).total_seconds() / 3600, 1) if nxt else 0})
            continue
        if now < due:
            out.append({"scheduleId": sid, "action": "NOT_DUE", "reason": f"예정 {due:%Y-%m-%d %H:%M}"})
            continue
        late = round((now - due).total_seconds() / 3600, 1)
        out.append({"scheduleId": sid, "action": "RUN", "reason": "예정 시각 도달" if late < 24 else f"예정 시각을 {late:.0f}시간 지남(지연 실행)",
                    "recheck": 0, "recheckId": None, "cutoffDate": s["cutoffDate"], "lateHours": late})
    return out


# ---------------------------------------------------------------- 실행

def build_argv(cfg, step, cutoff):
    c = cfg["commands"].get(step)
    if not c:
        raise ValueError(f"allowlist 에 없는 단계: {step}")
    if c.get("status") != "available":
        raise ValueError(f"아직 구현되지 않은 단계: {step} ({c.get('status')})")
    argv = []
    for tok in c["argv"]:
        if "{" in tok or "}" in tok:
            if tok != "{cutoffDate}":
                raise ValueError(f"허용되지 않은 자리표시자: {tok}")
            tok = cutoff
        argv.append(tok)
    if argv[0] != "python3":
        raise ValueError("실행기는 python3 만 허용")
    argv[0] = sys.executable
    return argv


def _field(obj, dotted):
    cur = obj
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return False, None
        cur = cur[part]
    return True, cur


def schema_error(spec, exit_code, parsed):
    """명령 명세(expectJson·requiredFields)에 비춰 결과 형식이 어긋났는지. exit 0 인데 결과가 없으면 성공이 아니다."""
    if exit_code != 0:
        return None
    if not (spec or {}).get("expectJson"):
        return None
    if not isinstance(parsed, dict):
        return "결과 JSON 없음(exit 0 이지만 표준출력이 JSON 객체가 아니다)"
    missing = [f for f in (spec.get("requiredFields") or []) if not _field(parsed, f)[0]]
    if missing:
        return "결과 JSON 에 필수 필드 없음: " + ", ".join(missing)
    return None


def run_step(root, argv, spec=None):
    t0 = time.time()
    try:
        r = subprocess.run(argv, cwd=root, capture_output=True, text=True, timeout=STEP_TIMEOUT_SEC,
                           env=dict(os.environ, PYTHONUTF8="1", TZ="Asia/Seoul"))
        out, err, code = r.stdout, r.stderr, r.returncode
    except subprocess.TimeoutExpired:
        out, err, code = "", f"timeout {STEP_TIMEOUT_SEC}s", 124
    parsed = None
    if out.strip().startswith("{"):
        try:
            parsed = json.loads(out)
        except ValueError:
            parsed = None
    return {"argv": argv[1:] if argv else argv, "exit": code, "durationSec": round(time.time() - t0, 1),
            "stdoutTail": out[-4000:], "stderrTail": err[-2000:], "json": parsed,
            "schemaError": schema_error(spec, code, parsed)}


def _sample_of(step_results, official):
    pre = official if official is not None else (step_results.get(EVALUATION_STEP, {}).get("json") or {})
    count = step_results.get("prereg_sample_count", {}).get("json") or {}
    return pre, ((pre.get("sample") if pre else None) or count.get("sample") or {})


def decide_status(s, step_results, official=None):
    bad = [k for k, r in step_results.items() if r["exit"] != 0]
    if bad:
        return "FAILED", "단계 실패: " + ", ".join(bad)
    malformed = [f"{k}({r['schemaError']})" for k, r in step_results.items() if r.get("schemaError")]
    if malformed:
        return "FAILED", "결과 형식 오류: " + ", ".join(malformed)
    pre, sample = _sample_of(step_results, official)
    # 이상 규칙(일정마다 config 에 명시). 확인 시험에서만 쓴다 — 확정 평가(10/19·11/16)는 표본 안에서 스스로 센다.
    rules = s.get("anomalyRules") or []
    tw = step_results.get("team_weights_transition_check", {}).get("json") or {}
    if "team_weights_anomaly" in rules and tw.get("status") == "ANOMALY":
        return "ANOMALY", "team_weights 전환 이상: " + str(tw.get("note") or "")
    unrec = sample.get("buyFeatureUnrecorded")
    if "buy_feature_unrecorded" in rules and unrec:
        return "ANOMALY", f"BUY 기록 {unrec}건에 overheat 특징(warn·vol20)이 없다 — 러너 기록 누락(산식 문제가 아니다)"
    flow = step_results.get("flow_validation_readiness", {}).get("json") or {}
    if flow and flow.get("status") == "NOT_READY":
        return "INSUFFICIENT", (f"FLOW 검증 표본 조건 미충족 — 공통 날짜 {flow.get('commonDays')}/{(flow.get('conditions') or {}).get('minCommonDays')}일, "
                                f"조건 충족 국면 {flow.get('regimeKindsMeetingMin')} → 채점하지 않음")
    min_days = ((s.get("minSample") or {}).get("decisionDays"))
    if min_days and pre:
        days = ((pre.get("sample") or {}).get("decisionDays"))
        if days is None:
            return "FAILED", "prereg_evaluate 결과에 sample.decisionDays 가 없다"
        if days < min_days or pre.get("status") != "EVALUATED":
            return "INSUFFICIENT", f"익은 판단일 {days}일 < 최소 {min_days}일 — 효과 크기 없이 표본 수만 기록"
        if s.get("kind") == "RECONFIRMATION" and (pre.get("verdicts") or {}).get("H1_crash") == "PASS_PROVISIONAL":
            return "INSUFFICIENT", f"판단일 {days}일 — 산식 변경 재확인 기준(40일) 미달로 PASS_PROVISIONAL 유지"
    return "COMPLETED", "모든 단계 정상 종료"


def next_check(s, now, hint_date=None):
    """다음 확인 시점: 기본 everyDays 뒤 17:00. 도구가 '표본이 찰 것으로 보이는 날'을 냈으면(미래일 때만) 그 날 17:00."""
    rule = (s.get("onInsufficient") or {})
    days = int(rule.get("everyDays") or 7)
    d = now + datetime.timedelta(days=days)
    if hint_date:
        try:
            hd = datetime.datetime.combine(datetime.date.fromisoformat(str(hint_date)[:10]), datetime.time(DEFAULT_RECHECK_HOUR), KST)
            if hd > now:
                d = hd
        except ValueError:
            pass
    return d.replace(hour=DEFAULT_RECHECK_HOUR, minute=0, second=0, microsecond=0).isoformat()


# ---------------------------------------------------------------- 동결 · 공식 판정 · 재현

def freeze_inputs(root, s, cutoff):
    """사전등록 창 안 입력의 동결 추출본. 판정 재현에 필요한 행만(창 시작 이후 판단 기록 + date·close) + 등록 상수 + 평가기 SHA."""
    try:
        import evaluate_preregistered_buy_filters as E
        import compute_team_weights as W
    except ImportError as e:
        return None, f"모듈 없음: {e}"
    start = E.REGISTRATION["windowStart"]
    hp, dp = os.path.join(root, "history.js"), os.path.join(root, "analysis_data.json")
    if not (os.path.exists(hp) and os.path.exists(dp)):
        return None, "입력 파일 없음"
    try:
        hist = W.load_js_object(hp, "LIVE_HISTORY") or {}
        data = json.loads(open(dp, encoding="utf-8").read())
    except (OSError, ValueError) as e:
        return None, f"입력 해석 실패: {e}"
    sub_hist = {}
    for code, entries in hist.items():
        if isinstance(entries, list):
            keep = [e for e in entries if isinstance(e, dict) and str(e.get("date", ""))[:10] >= start]
            if keep:
                sub_hist[code] = keep
    sub_closes = {}
    for code, st in (data.get("stocks") or {}).items():
        rows = [{"date": r["date"], "close": r.get("close")} for r in (st.get("daily") or []) if str(r.get("date", "")) >= start]
        if rows:
            sub_closes[code] = sorted(rows, key=lambda r: r["date"])
    if not sub_hist:
        return None, "창 안 판단 기록이 없다(동결할 것이 없다)"
    evaluator = os.path.join(root, "evaluate_preregistered_buy_filters.py")
    doc = {"schemaVersion": "gaeo_validation_inputs_v1", "scheduleId": s["scheduleId"], "cutoffDate": cutoff,
           "windowStart": start, "createdAt": now_kst().isoformat(),
           "registration": json.loads(json.dumps(E.REGISTRATION)),
           "evaluatorSha256": sha256_file(evaluator) if os.path.exists(evaluator) else sha256_file(E.__file__),
           "sources": {"history.js": sha256_file(hp), "analysis_data.json": sha256_file(dp),
                       "analysisDataFetchedAt": data.get("fetchedAt")},
           "hist": sub_hist, "closes": sub_closes}
    return doc, None


def evaluate_from_inputs(doc, as_of):
    import evaluate_preregistered_buy_filters as E
    closes = {c: sorted(rows, key=lambda r: r["date"]) for c, rows in doc["closes"].items()}
    return E.evaluate(doc["hist"], closes, as_of)


def core_mismatch(official, cli):
    """동결 입력 판정(공식)과 CLI 결과의 핵심 통계가 다른 키 목록. 같으면 []."""
    diff = []
    for k in CORE_COMPARE_KEYS:
        a, b = official.get(k), cli.get(k)
        if k == "sample" and isinstance(a, dict) and isinstance(b, dict):
            a = {x: v for x, v in a.items() if x not in SAMPLE_KEYS_DIFFER_BY_SCOPE}
            b = {x: v for x, v in b.items() if x not in SAMPLE_KEYS_DIFFER_BY_SCOPE}
        if json.dumps(a, sort_keys=True, default=str) != json.dumps(b, sort_keys=True, default=str):
            diff.append(k)
    return diff


def replay(inputs_gz, result_json):
    with gzip.open(inputs_gz, "rt", encoding="utf-8") as fh:
        doc = json.load(fh)
    recorded = json.load(open(result_json, encoding="utf-8"))
    rec = recorded.get("official") or ((recorded.get("steps") or {}).get(EVALUATION_STEP, {}).get("json") or {})
    import evaluate_preregistered_buy_filters as E
    reg_same = (doc.get("registration") is None) or (json.dumps(doc["registration"], sort_keys=True) == json.dumps(E.REGISTRATION, sort_keys=True))
    rep = evaluate_from_inputs(doc, doc["cutoffDate"])
    same = {
        "registration": reg_same,
        "status": rep.get("status") == rec.get("status"),
        "decisionDays": (rep.get("sample") or {}).get("decisionDays") == (rec.get("sample") or {}).get("decisionDays"),
        "rows": (rep.get("sample") or {}).get("rows") == (rec.get("sample") or {}).get("rows"),
        "buy": (rep.get("sample") or {}).get("buy") == (rec.get("sample") or {}).get("buy"),
        "excluded": json.dumps((rep.get("sample") or {}).get("excluded"), sort_keys=True) == json.dumps((rec.get("sample") or {}).get("excluded"), sort_keys=True),
        "verdicts": rep.get("verdicts") == rec.get("verdicts"),
        "holmP": json.dumps(rep.get("holmP"), sort_keys=True) == json.dumps(rec.get("holmP"), sort_keys=True),
    }
    return {"reproduced": all(same.values()), "checks": same, "replayStatus": rep.get("status"),
            "replayVerdicts": rep.get("verdicts"), "recordedVerdicts": rec.get("verdicts"),
            "registrationChanged": not reg_same}


def followup_markdown(s, result, pre):
    lines = [f"# 후속 조치 명세 — {s['scheduleId']} ({result['runAt'][:16]})", "",
             "> 이 파일은 실행기가 **자동으로 쓴 명세**다. 코드 변경은 하지 않았다. 아래는 등록 문서 §3 표에 **미리** 적힌 후속 조치를 그대로 옮긴 것이며,",
             "> 적용은 사람 또는 개발 AI 세션이 §3 표에 적힌 것만, 그대로만 한다. 표에 없는 변경을 끼워 넣지 않는다.", "",
             f"- 평가 기준일: {result['cutoffDate']} · 예정 시각: {result.get('scheduledAt')} · 실행 시각: {result['runAt']} · 지연: {result.get('lateHours', 0)}시간"
             + (f" · 재확인 ID: {result.get('recheckId')}" if result.get("recheckId") else ""),
             f"- 입력 SHA-256: {json.dumps(result.get('inputs'), ensure_ascii=False)}",
             f"- 공식 판정 출처: {result.get('officialSource') or 'CLI'}",
             f"- 익은 판단일 {(pre.get('sample') or {}).get('decisionDays')} · 독립 블록 {pre.get('independentBlocks')} · {pre.get('sizeCaveat', '')}", ""]
    for h, v in (pre.get("verdicts") or {}).items():
        lines.append(f"- **{h}**: {v} (Holm p={(pre.get('holmP') or {}).get(h)}) → {(pre.get('preRegisteredConsequences') or {}).get(h)}")
    lines += ["", "## 적용 규칙",
              "- H1_crash 의 산식 변경(급등 BUY→HOLD)은 40판단일 재확인(RECONFIRMATION)에서 PASS 일 때만. PASS_PROVISIONAL 은 기록만.",
              "- 표시만 바꾸는 후속(H2 표시 추가·경고 제거)은 20판단일 규칙을 따른다.",
              "- 결과를 보고 임계값·가설·절차를 바꾸면 등록이 소멸한다. 바꾸고 싶은 점은 새 등록 제안으로만 적는다.",
              f"- 관련 문서: {', '.join(s.get('policyRefs') or [])}"]
    return "\n".join(lines) + "\n"


def _write_repair_request(root, sid, status, note, steps, extra=""):
    rr_dir = os.path.join(root, "docs", "operations", "repair_requests")
    os.makedirs(rr_dir, exist_ok=True)
    with open(os.path.join(rr_dir, f"INC-VS-{sid}.md"), "w", encoding="utf-8") as fh:
        fh.write(f"# INC-VS-{sid} — 예정 시험 실행 {status}\n\n- 실행 시각: {now_kst().isoformat()}\n- 사유: {note}\n\n")
        for k, r in (steps or {}).items():
            fh.write(f"## {k} (exit {r['exit']})\n\n```\n{(r.get('stderrTail') or r.get('stdoutTail') or '')[-1500:]}\n```\n\n")
        if extra:
            fh.write(f"## 실행기 오류\n\n```\n{extra[-3000:]}\n```\n\n")
        fh.write("확인 순서: 1) 같은 명령을 로컬에서 실행 2) 입력 파일 존재·형식 3) config/validation_schedule.json 의 단계 정의\n")


def _append_ledger(cfg, root, row):
    ledger_path = os.path.join(root, cfg["ledgerPath"])
    os.makedirs(os.path.dirname(ledger_path), exist_ok=True)
    with open(ledger_path, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(row, ensure_ascii=False) + "\n")


def _ledger_row(s, result, runner_name):
    return {"scheduleId": s["scheduleId"], "dedupeKey": s.get("dedupeKey"), "runAt": result["runAt"],
            "cutoffDate": result["cutoffDate"], "scheduledAt": result.get("scheduledAt"), "recheckId": result.get("recheckId"),
            "status": result["status"], "resultPath": result["resultPath"], "nextCheckAt": result.get("nextCheckAt"),
            "gitSha": result.get("gitSha"), "runner": runner_name, "lateHours": result.get("lateHours", 0)}


def execute(cfg, s, now, root, apply, runner_name, plan_row):
    sid = s["scheduleId"]
    cutoff = plan_row.get("cutoffDate") or s["cutoffDate"]
    stamp = now.strftime("%Y%m%dT%H%M%S")
    run_dir = os.path.join(root, cfg["resultsDir"], sid)
    is_eval = s.get("kind") in EVALUATION_KINDS or EVALUATION_STEP in (s.get("steps") or [])
    freeze_required = is_eval or bool((s.get("inputFreeze") or {}).get("freezeRequired"))

    # 0) 확정 평가는 동결이 먼저다: 실행 시점 입력을 고정하고 공식 판정을 여기서 낸다. CLI 단계는 대조용.
    freeze_doc, freeze_err, official = None, None, None
    if freeze_required:
        freeze_doc, freeze_err = freeze_inputs(root, s, cutoff)
        if freeze_doc and is_eval:
            try:
                official = evaluate_from_inputs(freeze_doc, cutoff)
            except Exception as e:      # noqa: BLE001 — 어떤 오류든 공식 결과 없음 = FAILED
                freeze_err, official = f"동결 입력 평가 실패: {e}", None

    # 1) 단계 실행(allowlist)
    steps = {}
    blocked = None
    for step in s.get("steps", []):
        try:
            argv = build_argv(cfg, step, cutoff)
        except ValueError as e:
            blocked = str(e)
            steps[step] = {"argv": None, "exit": 126, "durationSec": 0, "stdoutTail": "", "stderrTail": str(e), "json": None, "schemaError": None}
            break
        steps[step] = run_step(root, argv, cfg["commands"].get(step))

    # 2) 필수 입력 파일
    inputs = {}
    missing_inputs = []
    for rel in (s.get("inputFreeze") or {}).get("inputs", []):
        p = os.path.join(root, rel)
        inputs[rel] = sha256_file(p) if os.path.exists(p) else None
        if inputs[rel] is None:
            missing_inputs.append(rel)
    for rel in s.get("policyFiles", []):
        p = os.path.join(root, rel)
        inputs[rel] = sha256_file(p) if os.path.exists(p) else None
        if inputs[rel] is None:
            missing_inputs.append(rel)

    # 3) 상태
    if blocked:
        status, note = "BLOCKED", blocked
    elif missing_inputs:
        status, note = "FAILED", "필수 입력·정책 파일 없음: " + ", ".join(missing_inputs)
    elif freeze_required and (freeze_doc is None or (is_eval and official is None)):
        status, note = "FAILED", f"입력 동결 실패 — 공식 결과를 낼 수 없다: {freeze_err}"
    else:
        cli = (steps.get(EVALUATION_STEP) or {}).get("json")
        diff = core_mismatch(official, cli) if (official is not None and isinstance(cli, dict)) else []
        if diff:
            status, note = "FAILED", "동결 입력 판정과 CLI 결과가 다르다(" + ", ".join(diff) + ") — 같은 입력에서 같은 결과가 나와야 한다"
        else:
            status, note = decide_status(s, steps, official)

    flow_hint = ((steps.get("flow_validation_readiness") or {}).get("json") or {}).get("expectedReadyDateIfNoGaps")
    result = {
        "schemaVersion": "gaeo_validation_run_v1", "scheduleId": sid, "kind": s.get("kind"), "title": s.get("title"),
        "dueAt": s["dueAt"], "scheduledAt": s["dueAt"], "cutoffDate": cutoff, "evaluationDate": cutoff,
        "runAt": now.isoformat(), "runner": runner_name,
        "lateHours": plan_row.get("lateHours", 0), "recheckNo": plan_row.get("recheck", 0), "recheckId": plan_row.get("recheckId"),
        "gitSha": git_sha(root), "inputs": inputs, "steps": steps, "status": status, "note": note,
        "officialSource": "frozen_inputs" if official is not None else ("cli" if EVALUATION_STEP in steps else None),
        "official": official, "inputsFreezeError": freeze_err,
        "nextCheckAt": next_check(s, now, flow_hint) if status == "INSUFFICIENT" else None,
        "resultPath": None, "inputsPath": None, "followupPath": None,
    }
    pre = official if official is not None else ((steps.get(EVALUATION_STEP) or {}).get("json") or {})
    if apply:
        os.makedirs(run_dir, exist_ok=True)
        result_path = os.path.join(run_dir, f"{stamp}.json")
        rel_result = os.path.relpath(result_path, root)
        result["resultPath"] = rel_result
        if freeze_doc:
            ipath = os.path.join(run_dir, f"{stamp}.inputs.json.gz")
            with gzip.open(ipath, "wt", encoding="utf-8") as fh:
                json.dump(freeze_doc, fh, ensure_ascii=False)
            result["inputsPath"] = os.path.relpath(ipath, root)
        if status == "COMPLETED" and pre.get("status") == "EVALUATED":
            fpath = os.path.join(run_dir, f"{stamp}.followup.md")
            with open(fpath, "w", encoding="utf-8") as fh:
                fh.write(followup_markdown(s, result, pre))
            result["followupPath"] = os.path.relpath(fpath, root)
        with open(result_path, "w", encoding="utf-8") as fh:
            json.dump(result, fh, ensure_ascii=False, indent=1)
        # 원장은 덧붙이기만 한다. 결과 파일이 실제로 써진 뒤에만 한 줄을 남긴다(저장 확인 뒤 완료 확정).
        if os.path.exists(result_path):
            _append_ledger(cfg, root, _ledger_row(s, result, runner_name))
        if status in ("FAILED", "BLOCKED", "ANOMALY"):
            _write_repair_request(root, sid, status, note, steps)
    return result


def record_crash(cfg, s, now, root, apply, runner_name, plan_row, err_text):
    """실행기 자체가 죽어도 기록이 남아야 실패 횟수(ESCALATED)에 들어간다 — 매일 조용히 다시 죽지 않게."""
    sid = s["scheduleId"]
    result = {"schemaVersion": "gaeo_validation_run_v1", "scheduleId": sid, "kind": s.get("kind"), "title": s.get("title"),
              "dueAt": s["dueAt"], "scheduledAt": s["dueAt"], "cutoffDate": plan_row.get("cutoffDate") or s["cutoffDate"],
              "evaluationDate": plan_row.get("cutoffDate") or s["cutoffDate"], "runAt": now.isoformat(), "runner": runner_name,
              "lateHours": plan_row.get("lateHours", 0), "recheckNo": plan_row.get("recheck", 0), "recheckId": plan_row.get("recheckId"),
              "gitSha": git_sha(root), "inputs": {}, "steps": {}, "status": "FAILED", "note": "실행기 오류(크래시): " + err_text.strip().splitlines()[-1][:300],
              "crash": err_text[-4000:], "officialSource": None, "official": None, "inputsFreezeError": None,
              "nextCheckAt": None, "resultPath": None, "inputsPath": None, "followupPath": None}
    if apply:
        run_dir = os.path.join(root, cfg["resultsDir"], sid)
        os.makedirs(run_dir, exist_ok=True)
        result_path = os.path.join(run_dir, f"{now.strftime('%Y%m%dT%H%M%S')}.json")
        result["resultPath"] = os.path.relpath(result_path, root)
        with open(result_path, "w", encoding="utf-8") as fh:
            json.dump(result, fh, ensure_ascii=False, indent=1)
        if os.path.exists(result_path):
            _append_ledger(cfg, root, _ledger_row(s, result, runner_name))
        _write_repair_request(root, sid, "FAILED", result["note"], {}, extra=err_text)
    return result


# ---------------------------------------------------------------- 저장 실패 회수 · 복원 (재채점 0)

def _git_out(root, *args, timeout=120):
    r = subprocess.run(["git", "-C", root, *args], capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr


def reconcile_inbox(cfg, root, remote="origin"):
    """validation-inbox-* 브랜치(저장 실패 때 워크플로가 남긴 같은 결과 커밋)에서 결과 파일·원장 줄을 회수한다.
    새 파일만 가져오고, 원장은 resultPath 기준으로 없는 줄만 덧붙인다. 다시 채점하지 않는다. 회수한 브랜치 이름을 돌려준다."""
    code, out, err = _git_out(root, "ls-remote", "--heads", remote, f"refs/heads/{INBOX_PREFIX}*")
    if code != 0:
        return {"ok": False, "error": f"ls-remote 실패: {err.strip()}", "branches": [], "files": [], "ledgerRows": 0}
    branches = []
    for line in out.splitlines():
        parts = line.split()
        if len(parts) == 2 and parts[1].startswith("refs/heads/" + INBOX_PREFIX):
            branches.append((parts[0], parts[1][len("refs/heads/"):]))
    ledger_rel = cfg["ledgerPath"]
    local_ledger = load_ledger(cfg, root)
    known = {r.get("resultPath") for r in local_ledger}
    files_added, rows_added, done = [], 0, []
    for sha, branch in branches:
        code, _, err = _git_out(root, "fetch", "-q", remote, branch, timeout=300)
        if code != 0:
            continue
        code, listing, _ = _git_out(root, "ls-tree", "-r", "--name-only", sha, "--", cfg["resultsDir"], "docs/operations/repair_requests")
        if code != 0:
            continue
        for rel in listing.splitlines():
            rel = rel.strip()
            if not rel:
                continue
            code, blob, _ = _git_out(root, "show", f"{sha}:{rel}")
            if code != 0:
                continue
            if rel == ledger_rel:
                for line in blob.splitlines():
                    if not line.strip():
                        continue
                    try:
                        row = json.loads(line)
                    except ValueError:
                        continue
                    if row.get("resultPath") and row["resultPath"] not in known:
                        _append_ledger(cfg, root, row)
                        known.add(row["resultPath"]); rows_added += 1
                continue
            dest = os.path.join(root, rel)
            if os.path.exists(dest):
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            # 결과 파일은 바이너리(gz)일 수 있어 다시 바이트로 꺼낸다
            rb = subprocess.run(["git", "-C", root, "show", f"{sha}:{rel}"], capture_output=True, timeout=120)
            if rb.returncode != 0:
                continue
            with open(dest, "wb") as fh:
                fh.write(rb.stdout)
            files_added.append(rel)
        done.append(branch)
    return {"ok": True, "branches": done, "files": files_added, "ledgerRows": rows_added}


def restore_result(cfg, root, result_json):
    """보관본(artifact 등)의 결과 JSON 을 같은 경로로 복원하고 원장 줄이 없으면 덧붙인다. 재채점 0."""
    with open(result_json, encoding="utf-8") as fh:
        result = json.load(fh)
    if result.get("schemaVersion") != "gaeo_validation_run_v1" or not result.get("resultPath") or not result.get("scheduleId"):
        raise ValueError("gaeo_validation_run_v1 결과 파일이 아니거나 resultPath/scheduleId 가 없다")
    dest = os.path.join(root, result["resultPath"])
    created = False
    if not os.path.exists(dest):
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as fh:
            json.dump(result, fh, ensure_ascii=False, indent=1)
        created = True
    known = {r.get("resultPath") for r in load_ledger(cfg, root)}
    appended = False
    if result["resultPath"] not in known:
        s = next((x for x in cfg["schedules"] if x["scheduleId"] == result["scheduleId"]), {"scheduleId": result["scheduleId"]})
        _append_ledger(cfg, root, _ledger_row(s, result, result.get("runner") or "restored"))
        appended = True
    return {"resultPath": result["resultPath"], "fileCreated": created, "ledgerAppended": appended, "status": result.get("status")}


# ---------------------------------------------------------------- 요약 · 진입점

def summarize(plan_rows, results, apply):
    lines = ["[예정 시험 실행기]" + ("" if apply else " (계획만 — 실행 0 · 파일 쓰기 0)")]
    for p in plan_rows:
        r = results.get(p["scheduleId"])
        if r:
            lines.append(f"  · {p['scheduleId']}: 실행 → {r['status']} — {r['note']} · 기준일 {r['cutoffDate']}"
                         + (f" · 다음 확인 {r['nextCheckAt'][:16]}" if r.get("nextCheckAt") else "")
                         + (f" · 지연 {r['lateHours']}시간" if r.get("lateHours", 0) >= 24 else ""))
        else:
            tail = " — --apply 로만 실행한다" if (p["action"] == "RUN" and not apply) else ""
            lines.append(f"  · {p['scheduleId']}: {p['action']} — {p['reason']}{tail}")
    return "\n".join(lines)


def issue_body(plan_rows, results, now):
    lines = [f"예정 시험 실행기 결과 ({now:%Y-%m-%d %H:%M} KST, LLM 호출 0)", ""]
    for sid, r in results.items():
        lines.append(f"- **{sid}** → `{r['status']}` — {r['note']} (기준일 {r['cutoffDate']}, 예정 {str(r.get('scheduledAt'))[:16]}, 실행 {r['runAt'][:16]}"
                     + (f", 재확인 {r['recheckId']}" if r.get("recheckId") else "") + ")")
        if r.get("resultPath"):
            lines.append(f"  - 결과: `{r['resultPath']}`" + (f" · 입력 동결: `{r['inputsPath']}`" if r.get("inputsPath") else "")
                         + (f" · 후속 명세: `{r['followupPath']}`" if r.get("followupPath") else "")
                         + (f" · 공식 판정 출처: {r['officialSource']}" if r.get("officialSource") else ""))
        if r.get("nextCheckAt"):
            lines.append(f"  - 다음 확인: {r['nextCheckAt'][:16]}")
    waiting = [p for p in plan_rows if p["action"] in ("NOT_DUE", "WAIT_RECHECK", "SKIP_TODAY") + NEEDS_HUMAN_ACTIONS]
    if waiting:
        lines.append("")
        lines += [f"- {p['scheduleId']}: {p['action']} — {p['reason']}" for p in waiting]
    return "\n".join(lines) + "\n"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--now")
    ap.add_argument("--root", default=HERE)
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--schedule-id")
    ap.add_argument("--runner-name", default="local")
    ap.add_argument("--json")
    ap.add_argument("--issue-body")
    ap.add_argument("--replay")
    ap.add_argument("--result")
    ap.add_argument("--reconcile-inbox", action="store_true", help="validation-inbox-* 브랜치의 결과를 회수한다(재채점 0)")
    ap.add_argument("--restore-result", help="보관본 결과 JSON 을 같은 경로로 복원하고 원장에 덧붙인다(재채점 0)")
    args = ap.parse_args(argv)
    if args.replay:
        rep = replay(args.replay, args.result)
        print(json.dumps(rep, ensure_ascii=False, indent=1))
        return 0 if rep["reproduced"] else 1
    cfg = load_config(args.root)
    if args.reconcile_inbox:
        rec = reconcile_inbox(cfg, args.root)
        print(json.dumps(rec, ensure_ascii=False, indent=1))
        for b in rec.get("branches", []):
            print(f"RECONCILED {b}")
        return 0 if rec.get("ok") else 1
    if args.restore_result:
        try:
            print(json.dumps(restore_result(cfg, args.root, args.restore_result), ensure_ascii=False, indent=1))
        except (OSError, ValueError) as e:
            print(f"복원 실패: {e}")
            return 2
        return 0
    real_now = now_kst()
    now = parse_iso(args.now) if args.now else real_now
    if args.now and now > real_now + datetime.timedelta(seconds=FUTURE_TOLERANCE_SEC) \
            and os.path.abspath(args.root) == os.path.abspath(HERE):
        print(f"[예정 시험 실행기] 거부: 미래 시각({now:%Y-%m-%d %H:%M}) 리허설은 운영 루트에서 하지 않는다 — 합성 입력을 둔 임시 루트(--root)에서만")
        return 2
    problems = structural_problems(cfg)
    if problems:
        print("[예정 시험 실행기] 구조 가드 — 설정이 등록 원칙을 어겨 아무것도 실행하지 않는다:")
        for p in problems:
            print("  · " + p)
        if args.json:
            with open(args.json, "w", encoding="utf-8") as fh:
                json.dump({"checkedAt": now.isoformat(), "apply": args.apply, "plan": [], "results": {}, "notify": True,
                           "structuralProblems": problems}, fh, ensure_ascii=False, indent=1)
        return 2
    ledger = load_ledger(cfg, args.root)
    rows = plan(cfg, ledger, now)
    results = {}
    exit_code = 0
    for p in rows:
        if p["action"] != "RUN" or (args.schedule_id and p["scheduleId"] != args.schedule_id):
            continue
        if not args.apply:
            continue        # 계획 모드: 실행 0. 무엇이 due 인지만 보여 준다.
        s = next(x for x in cfg["schedules"] if x["scheduleId"] == p["scheduleId"])
        try:
            r = execute(cfg, s, now, args.root, args.apply, args.runner_name, p)
        except Exception:       # noqa: BLE001 — 크래시도 기록해야 실패 횟수에 들어간다
            r = record_crash(cfg, s, now, args.root, args.apply, args.runner_name, p, traceback.format_exc())
        results[p["scheduleId"]] = r
        if r["status"] in ("FAILED", "ANOMALY"):
            exit_code = 1
        if r["status"] == "BLOCKED":
            exit_code = 2
    needs_human = [p for p in rows if p["action"] in NEEDS_HUMAN_ACTIONS]
    if needs_human:
        exit_code = max(exit_code, 1)
    print(summarize(rows, results, args.apply))
    if args.json:
        with open(args.json, "w", encoding="utf-8") as fh:
            json.dump({"checkedAt": now.isoformat(), "apply": args.apply, "plan": rows, "results": results,
                       # 이슈를 남길 이유가 있는가: 실제로 실행했거나 사람 확인이 필요한 일정이 있을 때만(조용한 날은 false)
                       "notify": bool(results) or bool(needs_human)}, fh, ensure_ascii=False, indent=1)
    if args.issue_body:
        with open(args.issue_body, "w", encoding="utf-8") as fh:
            fh.write(issue_body(rows, results, now))
    return exit_code


if __name__ == "__main__":
    sys.exit(main())
