#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Research Archive 주기 유지보수 — Weekly/Monthly Rollup + 복원 테스트.

매 분석 사이클에서 하는 일(닫기·압축)과 달리, 여기서는 주·월 단위 묶음과
복원 테스트를 한다. 무거운 작업이라 별도 스케줄로 돌린다.

⚠️ 어떤 경우에도 과거 Prediction 내용을 바꾸지 않는다.
⚠️ 묶음이 검증에 성공하기 전에는 원본을 지우지 않는다(기본값은 아예 안 지운다).

사용:
    python3 maintain_research_archive.py              # 주간 정리 + 복원 테스트
    python3 maintain_research_archive.py --monthly    # 지난달 묶음까지
"""
import datetime
import json
import os
import sys

import research_store

HERE = os.path.dirname(os.path.abspath(__file__))


def _week_id(day):
    d = datetime.date.fromisoformat(day)
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def run(store, today=None, do_monthly=False, restore_sample=3):
    today = today or datetime.date.today().isoformat()
    out = {"ranAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
           "today": today}

    # 1) 닫힌 날 닫기 → gzip → manifest (오늘 파일은 건드리지 않는다)
    out["maintenance"] = store.maintain(today=today)

    days = store.list_days()
    out["observedDays"] = len(days)
    if not days:
        out["note"] = "아직 기록이 없습니다."
        return out

    # 2) Weekly Rollup — 오늘이 속한 주는 아직 안 끝났으므로 제외한다
    this_week = _week_id(today)
    by_week = {}
    for day in days:
        if day >= today:
            continue
        by_week.setdefault(_week_id(day), []).append(day)
    weeks = []
    for wid, wdays in sorted(by_week.items()):
        if wid == this_week:
            continue                      # 진행 중인 주는 묶지 않는다
        m = store.rollup_week(wid, wdays)
        if m:
            weeks.append({"weekId": wid, "days": len(m["includedDays"]),
                          "records": m["recordCount"]})
    out["weeklyRollups"] = weeks

    # 3) Monthly Rollup — 지난달만. 이번 달은 아직 안 끝났다.
    if do_monthly:
        prev = (datetime.date.fromisoformat(today).replace(day=1)
                - datetime.timedelta(days=1)).strftime("%Y-%m")
        res = store.rollup_month(prev, remove_source=False)
        out["monthlyRollup"] = res or {"status": "NO_DATA", "month": prev}

    # 4) 복원 테스트 — 압축본을 실제로 풀어 개수·버전·시각을 확인한다
    sample = days[-restore_sample:] if restore_sample else days
    restores = [store.restore_test(d) for d in sample]
    out["restoreTests"] = restores
    broken = [r for r in restores if r["status"] != research_store.OK]
    out["restoreStatus"] = (research_store.ARCHIVE_INTEGRITY_ERROR if broken
                            else research_store.OK)

    # 5) 저장량 리포트
    out["storage"] = store.storage_report(today=today)
    return out


def main():
    store = research_store.ResearchArchiveStore()
    if not os.path.isdir(store.live):
        print("[Archive] 아직 Research 기록이 없습니다 — 유지보수 생략")
        return 0
    try:
        report = run(store, do_monthly=("--monthly" in sys.argv))
    except Exception as ex:
        # 유지보수가 실패해도 저장소를 망가뜨리지 않는다(읽기·검증 위주 작업).
        print(f"[Archive] 유지보수 실패 — 원본은 그대로입니다: {type(ex).__name__}: {ex}")
        return 0

    path = os.path.join(HERE, "research_archive", "maintenance_report.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1, sort_keys=True)

    s = report.get("storage") or {}
    print(f"[Archive] {report['observedDays']}일 · 주간묶음 {len(report.get('weeklyRollups') or [])}건 "
          f"· 복원테스트 {report.get('restoreStatus')} "
          f"· 하루 {s.get('projectedDailyBytes', 0)/1024:.0f}KB "
          f"· 1년 예상 {s.get('estimated365dBytes', 0)/1048576:.0f}MB · {s.get('status')}")
    if report.get("restoreStatus") != research_store.OK:
        for r in report.get("restoreTests", []):
            if r["status"] != research_store.OK:
                print(f"   [{research_store.ARCHIVE_INTEGRITY_ERROR}] {r['day']} {r.get('errors')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
