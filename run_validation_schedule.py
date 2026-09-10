#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""예정 검증 시험 실행기 — config/validation_schedule.json 의 일정을 GitHub Actions(또는 사람)가 돌리고, 결과를 append-only 원장에 남긴다.

원칙 (docs/VALIDATION_SCHEDULE.md 의 원칙과 같다)
  · dueAt 전에는 실행하지 않는다. 지났는데 기록이 없으면 이번 점검이 실행하고 "지연 N시간"을 함께 남긴다.
  · 명령은 allowlist(config.commands)만. 자리표시자는 {cutoffDate} 하나. argv[0] 은 python3 로 고정.
  · 같은 일정은 하루 1회만 실행한다(cron·dispatch·재시작이 겹쳐도 같은 공식 결과를 두 번 내지 않는다).
  · 결과는 docs/audits/validation_runs/<scheduleId>/<시각>.json 에 새 파일로 쓰고 ledger.jsonl 에 한 줄 덧붙인다(덮어쓰기 없음).
  · INSUFFICIENT 면 onInsufficient 규칙대로 다음 확인 시점만 정한다(유리한 날을 고르지 않는다). 재확인 상한(maxRechecks, 기본 3)을
    넘으면 RECHECK_LIMIT 로 멈추고 사람에게 보고한다. 실행 실패가 3회면 ESCALATED 로 멈춘다.
  · 일정의 anomalyRules 에 적힌 이상(team_weights 전환 ANOMALY · BUY overheat 기록 누락)은 ANOMALY 로 기록하고 수리 요청서를 쓴다(최종 상태).
  · 사전등록 평가(prereg_evaluate)는 창 안 입력의 동결 추출본(.inputs.json.gz)을 함께 저장한다 → 나중에 --replay 로 같은 판정을 재현한다.
  · 산식·Constitution·테스트를 고치지 않는다. EVALUATED 결과의 후속 조치는 followup.md 명세로만 남긴다(코드 변경은 사람/개발 AI 세션).
  · LLM 호출 0.

    python3 run_validation_schedule.py                       # 계획만(무엇이 due 인지) — 파일을 쓰지 않는다
    python3 run_validation_schedule.py --apply               # due 인 일정을 실행하고 기록한다
    python3 run_validation_schedule.py --replay docs/audits/validation_runs/<id>/<시각>.inputs.json.gz --result <시각>.json
종료코드: 0 정상(실행 없음 포함) · 1 실행 실패/이상/상한 도달(사람 확인 필요) · 2 차단(미구현 명령 등)
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

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))
STEP_TIMEOUT_SEC = 900
MAX_FAILED_RUNS = 3
DEFAULT_MAX_RECHECKS = 3           # onInsufficient.maxRechecks 가 없을 때. 첫 실행 뒤 재확인을 이만큼만 더 한다.
FINAL_STATES = ("COMPLETED", "ANOMALY", "INSUFFICIENT_FINAL", "ESCALATED")
NEEDS_HUMAN_ACTIONS = ("ESCALATED", "RECHECK_LIMIT")
DEFAULT_RECHECK_HOUR = 17


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


# ---------------------------------------------------------------- 계획

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
        recs = [r for r in ledger if r.get("scheduleId") == sid]
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
            max_re = int((s.get("onInsufficient") or {}).get("maxRechecks") or DEFAULT_MAX_RECHECKS)
            if len(insuff) > max_re:          # 첫 실행 1회 + 재확인 max_re 회를 모두 썼다 → 더 기다리지 않고 사람에게
                out.append({"scheduleId": sid, "action": "RECHECK_LIMIT",
                            "reason": f"표본 부족 재확인 {len(insuff) - 1}회 소진(상한 {max_re}) — 사람 확인 필요(자동 재확인 중단)"})
                continue
            nxt = parse_iso(insuff[-1].get("nextCheckAt"))
            if nxt and now < nxt:
                out.append({"scheduleId": sid, "action": "WAIT_RECHECK", "reason": f"표본 부족 → 재확인 예정 {nxt:%Y-%m-%d %H:%M}"})
                continue
            out.append({"scheduleId": sid, "action": "RUN", "reason": f"재확인 {len(insuff)}회째", "recheck": len(insuff),
                        "lateHours": round((now - nxt).total_seconds() / 3600, 1) if nxt else 0})
            continue
        if now < due:
            out.append({"scheduleId": sid, "action": "NOT_DUE", "reason": f"예정 {due:%Y-%m-%d %H:%M}"})
            continue
        late = round((now - due).total_seconds() / 3600, 1)
        out.append({"scheduleId": sid, "action": "RUN", "reason": "예정 시각 도달" if late < 24 else f"예정 시각을 {late:.0f}시간 지남(지연 실행)",
                    "recheck": 0, "lateHours": late})
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


def run_step(root, argv):
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
            "stdoutTail": out[-4000:], "stderrTail": err[-2000:], "json": parsed}


def decide_status(s, step_results):
    if any(r["exit"] != 0 for r in step_results.values()):
        return "FAILED", "단계 실패: " + ", ".join(k for k, r in step_results.items() if r["exit"] != 0)
    pre = step_results.get("prereg_evaluate", {}).get("json") or {}
    # 이상 규칙(일정마다 config 에 명시). 확인 시험에서만 쓴다 — 확정 평가(10/19·11/16)는 표본 안에서 스스로 센다.
    rules = s.get("anomalyRules") or []
    tw = step_results.get("team_weights_transition_check", {}).get("json") or {}
    if "team_weights_anomaly" in rules and tw.get("status") == "ANOMALY":
        return "ANOMALY", "team_weights 전환 이상: " + str(tw.get("note") or "")
    unrec = (pre.get("sample") or {}).get("buyFeatureUnrecorded")
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


def freeze_inputs(root, s, cutoff):
    """사전등록 창 안 입력의 동결 추출본. 판정 재현에 필요한 행만(창 시작 이후 판단 기록 + date·close)."""
    try:
        import evaluate_preregistered_buy_filters as E
        import compute_team_weights as W
        from pathlib import Path
    except ImportError as e:
        return None, f"모듈 없음: {e}"
    start = E.REGISTRATION["windowStart"]
    hp, dp = os.path.join(root, "history.js"), os.path.join(root, "analysis_data.json")
    if not (os.path.exists(hp) and os.path.exists(dp)):
        return None, "입력 파일 없음"
    hist = W.load_js_object(hp, "LIVE_HISTORY") or {}
    data = json.loads(open(dp, encoding="utf-8").read())
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
    doc = {"schemaVersion": "gaeo_validation_inputs_v1", "scheduleId": s["scheduleId"], "cutoffDate": cutoff,
           "windowStart": start, "createdAt": now_kst().isoformat(),
           "sources": {"history.js": sha256_file(hp), "analysis_data.json": sha256_file(dp),
                       "analysisDataFetchedAt": data.get("fetchedAt")},
           "hist": sub_hist, "closes": sub_closes}
    return doc, None


def evaluate_from_inputs(doc, as_of):
    import evaluate_preregistered_buy_filters as E
    closes = {c: sorted(rows, key=lambda r: r["date"]) for c, rows in doc["closes"].items()}
    return E.evaluate(doc["hist"], closes, as_of)


def replay(inputs_gz, result_json):
    with gzip.open(inputs_gz, "rt", encoding="utf-8") as fh:
        doc = json.load(fh)
    recorded = json.load(open(result_json, encoding="utf-8"))
    rec = (recorded.get("steps") or {}).get("prereg_evaluate", {}).get("json") or {}
    rep = evaluate_from_inputs(doc, doc["cutoffDate"])
    same = {
        "status": rep.get("status") == rec.get("status"),
        "decisionDays": (rep.get("sample") or {}).get("decisionDays") == (rec.get("sample") or {}).get("decisionDays"),
        "rows": (rep.get("sample") or {}).get("rows") == (rec.get("sample") or {}).get("rows"),
        "buy": (rep.get("sample") or {}).get("buy") == (rec.get("sample") or {}).get("buy"),
        "verdicts": rep.get("verdicts") == rec.get("verdicts"),
    }
    return {"reproduced": all(same.values()), "checks": same, "replayStatus": rep.get("status"),
            "replayVerdicts": rep.get("verdicts"), "recordedVerdicts": rec.get("verdicts")}


def followup_markdown(s, result, pre):
    lines = [f"# 후속 조치 명세 — {s['scheduleId']} ({result['runAt'][:16]})", "",
             "> 이 파일은 실행기가 **자동으로 쓴 명세**다. 코드 변경은 하지 않았다. 아래는 등록 문서 §3 표에 **미리** 적힌 후속 조치를 그대로 옮긴 것이며,",
             "> 적용은 사람 또는 개발 AI 세션이 §3 표에 적힌 것만, 그대로만 한다. 표에 없는 변경을 끼워 넣지 않는다.", "",
             f"- 평가 기준일: {result['cutoffDate']} · 실행 시각: {result['runAt']} · 지연: {result.get('lateHours', 0)}시간",
             f"- 입력 SHA-256: {json.dumps(result.get('inputs'), ensure_ascii=False)}",
             f"- 익은 판단일 {(pre.get('sample') or {}).get('decisionDays')} · 독립 블록 {pre.get('independentBlocks')} · {pre.get('sizeCaveat', '')}", ""]
    for h, v in (pre.get("verdicts") or {}).items():
        lines.append(f"- **{h}**: {v} (Holm p={(pre.get('holmP') or {}).get(h)}) → {(pre.get('preRegisteredConsequences') or {}).get(h)}")
    lines += ["", "## 적용 규칙",
              "- H1_crash 의 산식 변경(급등 BUY→HOLD)은 40판단일 재확인(RECONFIRMATION)에서 PASS 일 때만. PASS_PROVISIONAL 은 기록만.",
              "- 표시만 바꾸는 후속(H2 표시 추가·경고 제거)은 20판단일 규칙을 따른다.",
              "- 결과를 보고 임계값·가설·절차를 바꾸면 등록이 소멸한다. 바꾸고 싶은 점은 새 등록 제안으로만 적는다.",
              f"- 관련 문서: {', '.join(s.get('policyRefs') or [])}"]
    return "\n".join(lines) + "\n"


def execute(cfg, s, now, root, apply, runner_name, plan_row):
    sid = s["scheduleId"]
    cutoff = s["cutoffDate"]
    stamp = now.strftime("%Y%m%dT%H%M%S")
    run_dir = os.path.join(root, cfg["resultsDir"], sid)
    steps = {}
    blocked = None
    for step in s.get("steps", []):
        try:
            argv = build_argv(cfg, step, cutoff)
        except ValueError as e:
            blocked = str(e)
            steps[step] = {"argv": None, "exit": 126, "durationSec": 0, "stdoutTail": "", "stderrTail": str(e), "json": None}
            break
        steps[step] = run_step(root, argv)
    status, note = ("BLOCKED", blocked) if blocked else decide_status(s, steps)
    inputs = {}
    for rel in (s.get("inputFreeze") or {}).get("inputs", []):
        p = os.path.join(root, rel)
        inputs[rel] = sha256_file(p) if os.path.exists(p) else None
    for rel in s.get("policyFiles", []):
        p = os.path.join(root, rel)
        inputs[rel] = sha256_file(p) if os.path.exists(p) else None
    result = {
        "schemaVersion": "gaeo_validation_run_v1", "scheduleId": sid, "kind": s.get("kind"), "title": s.get("title"),
        "dueAt": s["dueAt"], "cutoffDate": cutoff, "runAt": now.isoformat(), "runner": runner_name,
        "lateHours": plan_row.get("lateHours", 0), "recheckNo": plan_row.get("recheck", 0),
        "gitSha": git_sha(root), "inputs": inputs, "steps": steps, "status": status, "note": note,
        "nextCheckAt": (next_check(s, now, ((steps.get("flow_validation_readiness") or {}).get("json") or {}).get("expectedReadyDateIfNoGaps"))
                        if status == "INSUFFICIENT" else None),
        "resultPath": None, "inputsPath": None, "followupPath": None,
    }
    pre = (steps.get("prereg_evaluate") or {}).get("json") or {}
    if apply:
        os.makedirs(run_dir, exist_ok=True)
        result_path = os.path.join(run_dir, f"{stamp}.json")
        rel_result = os.path.relpath(result_path, root)
        result["resultPath"] = rel_result
        if "prereg_evaluate" in steps and steps["prereg_evaluate"]["exit"] == 0:
            doc, err = freeze_inputs(root, s, cutoff)
            if doc:
                ipath = os.path.join(run_dir, f"{stamp}.inputs.json.gz")
                with gzip.open(ipath, "wt", encoding="utf-8") as fh:
                    json.dump(doc, fh, ensure_ascii=False)
                result["inputsPath"] = os.path.relpath(ipath, root)
            else:
                result["inputsFreezeError"] = err
        if pre.get("status") == "EVALUATED":
            fpath = os.path.join(run_dir, f"{stamp}.followup.md")
            with open(fpath, "w", encoding="utf-8") as fh:
                fh.write(followup_markdown(s, result, pre))
            result["followupPath"] = os.path.relpath(fpath, root)
        with open(result_path, "w", encoding="utf-8") as fh:
            json.dump(result, fh, ensure_ascii=False, indent=1)
        # 원장은 덧붙이기만 한다. 결과 파일이 실제로 써진 뒤에만 한 줄을 남긴다(저장 확인 뒤 완료 확정).
        if os.path.exists(result_path):
            ledger_path = os.path.join(root, cfg["ledgerPath"])
            os.makedirs(os.path.dirname(ledger_path), exist_ok=True)
            with open(ledger_path, "a", encoding="utf-8") as fh:
                fh.write(json.dumps({"scheduleId": sid, "dedupeKey": s.get("dedupeKey"), "runAt": result["runAt"],
                                     "cutoffDate": cutoff, "status": status, "resultPath": rel_result,
                                     "nextCheckAt": result["nextCheckAt"], "gitSha": result["gitSha"],
                                     "runner": runner_name, "lateHours": result["lateHours"]}, ensure_ascii=False) + "\n")
        if status in ("FAILED", "BLOCKED", "ANOMALY"):
            rr_dir = os.path.join(root, "docs", "operations", "repair_requests")
            os.makedirs(rr_dir, exist_ok=True)
            with open(os.path.join(rr_dir, f"INC-VS-{sid}.md"), "w", encoding="utf-8") as fh:
                fh.write(f"# INC-VS-{sid} — 예정 시험 실행 {status}\n\n- 실행 시각: {result['runAt']}\n- 사유: {note}\n\n")
                for k, r in steps.items():
                    fh.write(f"## {k} (exit {r['exit']})\n\n```\n{(r.get('stderrTail') or r.get('stdoutTail') or '')[-1500:]}\n```\n\n")
                fh.write("확인 순서: 1) 같은 명령을 로컬에서 실행 2) 입력 파일 존재·형식 3) config/validation_schedule.json 의 단계 정의\n")
    return result


def summarize(plan_rows, results):
    lines = ["[예정 시험 실행기]"]
    for p in plan_rows:
        r = results.get(p["scheduleId"])
        if r:
            lines.append(f"  · {p['scheduleId']}: 실행 → {r['status']} — {r['note']}"
                         + (f" · 다음 확인 {r['nextCheckAt'][:16]}" if r.get("nextCheckAt") else "")
                         + (f" · 지연 {r['lateHours']}시간" if r.get("lateHours", 0) >= 24 else ""))
        else:
            lines.append(f"  · {p['scheduleId']}: {p['action']} — {p['reason']}")
    return "\n".join(lines)


def issue_body(plan_rows, results, now):
    lines = [f"예정 시험 실행기 결과 ({now:%Y-%m-%d %H:%M} KST, LLM 호출 0)", ""]
    for sid, r in results.items():
        lines.append(f"- **{sid}** → `{r['status']}` — {r['note']}")
        if r.get("resultPath"):
            lines.append(f"  - 결과: `{r['resultPath']}`" + (f" · 입력 동결: `{r['inputsPath']}`" if r.get("inputsPath") else "")
                         + (f" · 후속 명세: `{r['followupPath']}`" if r.get("followupPath") else ""))
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
    args = ap.parse_args(argv)
    if args.replay:
        rep = replay(args.replay, args.result)
        print(json.dumps(rep, ensure_ascii=False, indent=1))
        return 0 if rep["reproduced"] else 1
    now = parse_iso(args.now) if args.now else now_kst()
    cfg = load_config(args.root)
    ledger = load_ledger(cfg, args.root)
    rows = plan(cfg, ledger, now)
    results = {}
    exit_code = 0
    for p in rows:
        if p["action"] != "RUN" or (args.schedule_id and p["scheduleId"] != args.schedule_id):
            continue
        s = next(x for x in cfg["schedules"] if x["scheduleId"] == p["scheduleId"])
        r = execute(cfg, s, now, args.root, args.apply, args.runner_name, p)
        results[p["scheduleId"]] = r
        if r["status"] in ("FAILED", "ANOMALY"):
            exit_code = 1
        if r["status"] == "BLOCKED":
            exit_code = 2
    needs_human = [p for p in rows if p["action"] in NEEDS_HUMAN_ACTIONS]
    if needs_human:
        exit_code = max(exit_code, 1)
    print(summarize(rows, results))
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
