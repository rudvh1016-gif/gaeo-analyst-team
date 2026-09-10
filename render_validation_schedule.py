#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""config/validation_schedule.json(원본) → docs/VALIDATION_SCHEDULE.md(사람용) 생성.

일정은 원본 하나(JSON)에서만 관리한다. 이 스크립트가 사람용 표를 만들고,
test_validation_schedule.py가 "문서가 원본과 어긋나면 실패"로 잠근다.
실행 기록(ledger)이 있으면 각 일정의 마지막 실행 상태도 함께 보여준다.

    python3 render_validation_schedule.py            # 문서를 다시 쓴다
    python3 render_validation_schedule.py --check    # 문서가 최신인지 확인만(0=최신, 1=낡음)
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG = os.path.join(HERE, "config", "validation_schedule.json")
DOC = os.path.join(HERE, "docs", "VALIDATION_SCHEDULE.md")


def load_config(path=CONFIG):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def load_ledger(cfg, root=HERE):
    path = os.path.join(root, cfg.get("ledgerPath", ""))
    rows = []
    if not cfg.get("ledgerPath") or not os.path.exists(path):
        return rows
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    rows.append({"scheduleId": "?", "status": "LEDGER_LINE_UNREADABLE"})
    return rows


def last_run(rows, schedule_id):
    hits = [r for r in rows if r.get("scheduleId") == schedule_id]
    return hits[-1] if hits else None


def render(cfg, ledger):
    L = []
    L.append("# GAEO 검증·확인 시험 일정표 (사람용)")
    L.append("")
    L.append(f"> ⚠️ **자동 생성 문서.** 원본은 `{cfg['sourceOfTruth']}`이고 `python3 render_validation_schedule.py`가 이 문서를 만든다.")
    L.append("> 손으로 고치면 `test_validation_schedule.py`가 실패한다. 일정을 바꾸려면 JSON을 고치고 다시 생성한다.")
    L.append(f"> 시간대 {cfg['timezone']} · 원본 갱신일 {cfg['updatedAt']} · 실행 기록 `{cfg['ledgerPath']}` · 결과 `{cfg['resultsDir']}/`")
    L.append("")
    L.append("## 원칙")
    L.append("")
    for p in cfg.get("principles", []):
        L.append(f"- {p}")
    L.append("")
    L.append("## 일정")
    L.append("")
    L.append("| ID | 종류 | 예정(KST) | 기준일 | 실행 단계 | 최소 표본 | 자동 후속 | 마지막 기록 |")
    L.append("|---|---|---|---|---|---|---|---|")
    for s in cfg["schedules"]:
        run = last_run(ledger, s["scheduleId"])
        if s.get("status") == "PAST_COMPLETED":
            last = "과거 완료"
        elif run:
            last = f"{run.get('status')} ({str(run.get('runAt', ''))[:16]})"
        else:
            last = "기록 없음(미도래 또는 미실행)"
        steps = ", ".join(f"`{x}`" for x in s.get("steps", [])) or "(없음)"
        ms = s.get("minSample")
        ms_txt = "-" if not ms else ", ".join(f"{k}≥{v}" for k, v in ms.items())
        L.append(f"| `{s['scheduleId']}` | {s['kind']} | {s['dueAt'][:16].replace('T', ' ')} | {s['cutoffDate']} | {steps} | {ms_txt} | {s.get('autoConsequence', '-')} | {last} |")
    L.append("")
    L.append("## 일정별 상세")
    L.append("")
    for s in cfg["schedules"]:
        L.append(f"### `{s['scheduleId']}` — {s['title']}")
        L.append("")
        L.append(f"- 예정: {s['dueAt']} · 기준일(cutoff): {s['cutoffDate']} · 조기 실행 금지: {s.get('noEarlyRun', True)}")
        if s.get("status"):
            L.append(f"- 상태: {s['status']}")
        if s.get("evidence"):
            L.append(f"- 근거: {s['evidence']}")
        if s.get("inputFreeze"):
            L.append(f"- 입력 동결: {s['inputFreeze'].get('rule', '')} (입력: {', '.join(s['inputFreeze'].get('inputs', []))})")
        if s.get("policyRefs"):
            L.append("- 원본 정책: " + ", ".join(f"`{p}`" for p in s["policyRefs"]))
        if s.get("expectations"):
            L.append("- 확인 항목:")
            for e in s["expectations"]:
                L.append(f"  - {e}")
        if s.get("definitionGaps"):
            L.append("- ⚠️ 정의 미완료(자동 실행하지 않는 부분):")
            for g in s["definitionGaps"]:
                L.append(f"  - {g}")
        if s.get("onInsufficient"):
            L.append(f"- 표본 부족 시: {json.dumps(s['onInsufficient'], ensure_ascii=False)}")
        if s.get("followupNote"):
            L.append(f"- 후속 범위: {s['followupNote']}")
        if s.get("legacyClaudeTrigger"):
            t = s["legacyClaudeTrigger"]
            L.append(f"- 기존 Claude 예약: `{t.get('id')}` (세션 {t.get('session') or '새 세션 생성형'}) · 이관 상태 {t.get('handover')}")
        if s.get("note"):
            L.append(f"- 메모: {s['note']}")
        L.append("")
    L.append("## 실행 명령 allowlist")
    L.append("")
    L.append("| 이름 | 명령 | 상태 | 설명 |")
    L.append("|---|---|---|---|")
    for name, c in cfg["commands"].items():
        argv = " ".join(c["argv"])
        st = c["status"] + (f" ({c.get('plannedIn')})" if c.get("plannedIn") else "")
        L.append(f"| `{name}` | `{argv}` | {st} | {c.get('description', '')} |")
    L.append("")
    L.append("## 이 일정표 밖의 운영 Routine (Claude 예약, 2026-09-10 조회)")
    L.append("")
    for r in cfg.get("operationalRoutinesNotInThisSchedule", []):
        L.append(f"- `{r['id']}` {r['name']} (`{r.get('cron')}`) — {r.get('role')}")
    L.append("")
    if ledger:
        L.append("## 실행 기록 (최근 20건)")
        L.append("")
        L.append("| 일정 | 실행 시각 | 기준일 | 상태 | 결과 파일 |")
        L.append("|---|---|---|---|---|")
        for r in ledger[-20:]:
            L.append(f"| `{r.get('scheduleId')}` | {r.get('runAt', '')} | {r.get('cutoffDate', '')} | {r.get('status', '')} | {r.get('resultPath', '')} |")
        L.append("")
    return "\n".join(L) + "\n"


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    cfg = load_config()
    text = render(cfg, load_ledger(cfg))
    if "--check" in argv:
        try:
            current = open(DOC, encoding="utf-8").read()
        except OSError:
            current = ""
        if current == text:
            print("VALIDATION_SCHEDULE.md 최신")
            return 0
        print("VALIDATION_SCHEDULE.md 가 원본(JSON)과 다르다 — python3 render_validation_schedule.py 로 다시 생성")
        return 1
    with open(DOC, "w", encoding="utf-8") as fh:
        fh.write(text)
    print(f"생성: {os.path.relpath(DOC, HERE)} ({len(cfg['schedules'])}건)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
