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
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))


def read_stamp(path, pattern):
    """파일에서 타임스탬프 라벨을 찾아 KST datetime으로 반환(없으면 None).

    ⚠️ update_prices.py의 data.js "date" 라벨은 수집 시점에 따라 네 가지 형태로 나온다:
        · 장중(09:00~15:30) : "2026-07-30 14:30 장중"
        · 종가(15:30 이후)  : "2026-07-30 종가 (16:10 수집)"
        · 장전(09:00 이전)  : "2026-07-30 장전 (전일 종가 · 08:30 수집)"
        · 주말             : "2026-07-30 종가 (주말 · 최근 종가 08:05 수집)"
    예전엔 'YYYY-MM-DD HH:MM'이 붙어 있는 '장중' 형태만 매칭해서, 나머지 세 형태에선
    파싱이 실패해 pa=None이 됐다. in_window 분기가 `pa is None`도 경고로 취급하기 때문에
    매 거래일 15:30~16:00(종가 라벨 구간) 30분 동안 파이프라인이 정상인데도 "끊겼을 수
    있음" 거짓 경고가 떴다. 그래서 이제 "앞쪽 날짜 + 라벨 안 첫 HH:MM"을 따로 뽑아
    네 형태를 모두 동일하게 해석한다(네 형태 모두 첫 HH:MM이 실제 수집 시각이다).
    """
    try:
        head = open(os.path.join(HERE, path), encoding="utf-8").read(4000)
    except OSError:
        return None
    m = re.search(pattern, head)
    if not m:
        return None
    label = m.group(1)
    d = re.search(r"(\d{4}-\d{2}-\d{2})", label)
    t = re.search(r"(\d{2}:\d{2})", label)
    if not (d and t):
        return None
    try:
        return datetime.datetime.strptime(d.group(1) + " " + t.group(1),
                                         "%Y-%m-%d %H:%M").replace(tzinfo=KST)
    except ValueError:
        return None


def check_paper_cycle(now, in_window):
    """모의투자 러너가 사이클에 실패하고 있으면 알린다.

    2026-08-19 사고: 집 PC 러너의 토스 자격증명이 유실돼 하루 12사이클이 전부
    실패했는데, 아무도 몰라서 하루치 기록이 통째로 비었다. 실패는 state.json에
    남아 있었지만 아무 데도 안 떴다.

    ⚠️ 장외·주말에는 점검하지 않는다(러너가 안 도는 게 정상인 시간대).
    ⚠️ 이 파일은 세션 시작 훅이라 절대 예외를 밖으로 던지지 않는다.
    """
    if not in_window:
        return []
    try:
        with open("paper_trading/state.json", encoding="utf-8") as f:
            st = json.load(f)
    except Exception:
        return []                      # 모의투자를 안 쓰는 환경일 수 있다
    result = str(st.get("lastCycleResult") or "")
    at = str(st.get("lastCycleAt") or "")
    if not result or result.startswith("CYCLE_OK"):
        return []
    # 오늘 시도한 기록이 아니면(예: 주말 지나 월요일 아침) 아직 판단하지 않는다
    if at[:10] != now.strftime("%Y-%m-%d"):
        return []
    reason = result.split("—")[0].split("(")[0].strip() or result[:40]
    hint = ""
    if "TOSS_MARKET_DATA_UNAVAILABLE" in result:
        hint = (" → 집 PC 작업 스케줄러의 GAEO Paper Trading이 부트스트랩(run-paper.ps1)을 "
                "실행하는지, 자격증명이 살아 있는지 확인 (docs/PAPER_TRADING_LOCAL_RUNNER.md)")
    return [f"모의투자 사이클이 실패 중입니다 — {reason}{hint}"]


def main():
    now = datetime.datetime.now(KST)
    in_window = now.weekday() < 5 and ("09:10" <= now.strftime("%H:%M") < "16:00")

    # 라벨 값 전체를 잡아 read_stamp가 "날짜 + 첫 HH:MM"으로 해석하게 한다.
    # (data.js "date"는 장중/종가/장전/주말 네 형태가 있어 뒤쪽 모양이 제각각이다 — read_stamp 주석 참조)
    price_at = read_stamp("data.js", r'"date"\s*:\s*"([^"]{10,60})"')
    auto_at = read_stamp("auto_analysis.js", r'"generatedAt"\s*:\s*"([^"]{10,60})"')

    def age_min(ts):
        return None if ts is None else int((now - ts).total_seconds() // 60)

    pa, aa = age_min(price_at), age_min(auto_at)
    msgs = []
    msgs += check_paper_cycle(now, in_window)
    if in_window:
        # 여유 임계: 시세 10분 주기→25분, 자동분석 30분 주기→70분
        # 파싱 실패(None)는 "갱신이 끊겼다"와 원인이 다르므로 문구를 구분한다 —
        # 예전엔 둘을 같은 메시지로 묶어, 라벨 형식만 바뀐 종가 구간에도 "주기가 끊겼을 수
        # 있음"이라는 잘못된 진단이 나갔다.
        if pa is None:
            msgs.append("시세(data.js) 타임스탬프를 해석하지 못했습니다 — data.js의 date 라벨 형식 확인 필요")
        elif pa > 25:
            msgs.append(f"시세(data.js)가 {pa}분 전 — 10분 주기가 끊겼을 수 있음")
        if aa is None:
            msgs.append("자동분석(auto_analysis.js) 타임스탬프를 해석하지 못했습니다 — generatedAt 형식 확인 필요")
        elif aa > 70:
            msgs.append(f"자동분석(auto_analysis.js)이 {aa}분 전 — 30분 주기가 끊겼을 수 있음")

    def ago(v):
        return f"{v}분 전" if v is not None else "해석 실패"

    if msgs:
        print("⚠️ [개오 파이프라인 점검] 평일 수집 창(09:10~16:00 KST)인데 갱신이 오래됐습니다:")
        for m in msgs:
            print("   · " + m)
        print("   ✅ 조치 순서: ① 로컬 clone이 낡았을 수 있으니 `git fetch origin main` 후 "
              "`git show origin/main:data.js | head -5`로 재확인 → ② 그래도 오래됐으면 "
              "`.analyst-refresh` 내용을 바꿔 main에 커밋·푸시(러너 소생, CLAUDE.md 파이프라인 절 참조)")
    else:
        state = "수집 창 내 정상" if in_window else "장외 시간(점검 생략)"
        print(f"[개오 파이프라인 점검] {state} — 시세 {ago(pa)} · 자동분석 {ago(aa)}")
    sys.exit(0)


if __name__ == "__main__":
    main()
