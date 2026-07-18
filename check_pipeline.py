#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 파이프라인 신선도 점검 (SessionStart 훅용, 네트워크 불요)

Claude 세션이 시작될 때 .claude/settings.json 훅이 이 스크립트를 실행한다.
평일 수집 창(09:10~16:00 KST)에 data.js(10분 주기)·auto_analysis.js(30분 주기)의
마지막 갱신이 끊겨 있으면 경고를 출력해, 세션이 문제를 바로 인지하고
".analyst-refresh 마커 push"로 러너를 소생시킬 수 있게 한다.

- 로컬 파일의 타임스탬프 필드만 읽는다(git/네트워크 호출 없음 → 훅이 세션을 늦추지 않음).
- 원격 세션 컨테이너는 clone 시점 파일이므로, 경고가 뜨면 먼저 `git fetch origin main` 후
  origin/main 기준으로 재확인하라는 안내를 함께 출력한다.
- 어떤 경우에도 exit 0 (세션 시작을 막지 않는다).
"""
import datetime
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))


def read_stamp(path, pattern):
    """파일에서 'YYYY-MM-DD HH:MM' 패턴을 찾아 KST datetime으로 반환(없으면 None)."""
    try:
        head = open(os.path.join(HERE, path), encoding="utf-8").read(4000)
    except OSError:
        return None
    m = re.search(pattern, head)
    if not m:
        return None
    try:
        return datetime.datetime.strptime(m.group(1), "%Y-%m-%d %H:%M").replace(tzinfo=KST)
    except ValueError:
        return None


def main():
    now = datetime.datetime.now(KST)
    in_window = now.weekday() < 5 and ("09:10" <= now.strftime("%H:%M") < "16:00")

    # data.js: "date" 라벨(예: 2026-07-18 14:30 장중) / auto_analysis.js: generatedAt
    price_at = read_stamp("data.js", r'"date"\s*:\s*"(\d{4}-\d{2}-\d{2} \d{2}:\d{2})')
    auto_at = read_stamp("auto_analysis.js", r'"generatedAt"\s*:\s*"(\d{4}-\d{2}-\d{2} \d{2}:\d{2})')

    def age_min(ts):
        return None if ts is None else int((now - ts).total_seconds() // 60)

    pa, aa = age_min(price_at), age_min(auto_at)
    msgs = []
    if in_window:
        # 여유 임계: 시세 10분 주기→25분, 자동분석 30분 주기→70분
        if pa is None or pa > 25:
            msgs.append(f"시세(data.js)가 {pa if pa is not None else '?'}분 전 — 10분 주기가 끊겼을 수 있음")
        if aa is None or aa > 70:
            msgs.append(f"자동분석(auto_analysis.js)이 {aa if aa is not None else '?'}분 전 — 30분 주기가 끊겼을 수 있음")

    if msgs:
        print("⚠️ [개오 파이프라인 점검] 평일 수집 창(09:10~16:00 KST)인데 갱신이 오래됐습니다:")
        for m in msgs:
            print("   · " + m)
        print("   ✅ 조치 순서: ① 로컬 clone이 낡았을 수 있으니 `git fetch origin main` 후 "
              "`git show origin/main:data.js | head -5`로 재확인 → ② 그래도 오래됐으면 "
              "`.analyst-refresh` 내용을 바꿔 main에 커밋·푸시(러너 소생, CLAUDE.md 파이프라인 절 참조)")
    else:
        label = f"시세 {pa}분 전 · 자동분석 {aa}분 전" if pa is not None else "타임스탬프 파싱 실패(무시 가능)"
        state = "수집 창 내 정상" if in_window else "장외 시간(점검 생략)"
        print(f"[개오 파이프라인 점검] {state} — {label}")
    sys.exit(0)


if __name__ == "__main__":
    main()
