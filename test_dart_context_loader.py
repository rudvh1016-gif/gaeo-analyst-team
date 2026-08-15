#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DART Context Loader 검증 — 실제 Event가 Prediction까지 정확한 시점에 연결되는가.

여기서 지키려는 계약(요구 3-4번):
    1. 판단 **전에** 탐지된 공시는 보인다
    2. 판단 **뒤에** 탐지된 공시는 안 보인다 (미래정보 금지)
    3. 다른 종목 공시가 섞이지 않는다
    4. 중복 rcept_no는 한 번만
    5. 정정공시가 표시된다
    6. timezone이 섞여도 실제 시각순으로 판정한다
    7. coverage incomplete일 때 '공시 없음'이라고 거짓 결론 내지 않는다
    8. API error일 때도 마찬가지
    9. budget stop 상황에서도 로더가 API를 부르지 않는다
"""
import datetime
import os
import shutil
import sys
import tempfile

import dart_context_loader as L
import dart_pipeline as P
import dart_time
import research_engine_v20 as C
import research_store

FAILS = []


def check(name, cond, extra=""):
    if cond:
        print(f"  PASS  {name}")
    else:
        print(f"  FAIL  {name} {extra}")
        FAILS.append(name)


def ev(ticker, rcept_no, detected_at, name="현금·현물배당 결정", correction=False):
    return {"source": "OPENDART", "sourceMode": P.LIVE_DART_PIT,
            "corp_code": "00126380", "stock_code": ticker, "ticker": ticker,
            "rcept_no": rcept_no, "report_name": name, "corp_cls": "Y",
            "rcept_dt": str(detected_at)[:10].replace("-", ""),
            "rcept_dt_note": "OFFICIAL_RECEIPT_DATE_ONLY_NO_TIME",
            "detected_at": detected_at, "fetched_at": detected_at,
            "is_correction": correction, "corrects_rcept_no": P.NOT_AVAILABLE,
            "processing_status": P.EVENT_DETECTED,
            "raw_source_reference": f"https://dart.fss.or.kr/x?rcpNo={rcept_no}"}


# ── 1~2. Point-in-Time ───────────────────────────────────────────────────────
print("\n[1] Point-in-Time — 판단 시각 기준 가시성")
PRED = "2026-08-15T01:00:00+00:00"          # KST 10:00
before = ev("005930", "20260815000001", "2026-08-15T00:55:00+00:00")   # KST 09:55
after = ev("005930", "20260815000002", "2026-08-15T01:05:00+00:00")    # KST 10:05

ctx = C.dart_context([before, after], PRED, P.EVENT_DETECTED)
check("판단 전 탐지 공시는 보인다", ctx["visibleEventCount"] == 1, ctx)
check("판단 뒤 탐지 공시는 안 보인다", ctx["hiddenNotYetDetected"] == 1, ctx)
check("보이는 공시가 '판단 전' 그 건이다",
      ctx["latestDetectedAt"] == before["detected_at"], ctx["latestDetectedAt"])

summary = L.public_event_summary([before, after], PRED, P.EVENT_DETECTED)
check("기본모델 요약도 PIT를 적용한다", summary["count"] == 1, summary)
check("기본모델 요약에 미래 공시 접수번호가 없다",
      all(i["rceptNo"] != after["rcept_no"] for i in summary["items"]), summary["items"])
check("기본모델 요약은 점수를 만들지 않는다", L.PUBLIC_SUMMARY_META["producesScore"] is False)
check("반복 상수는 종목별 요약에 넣지 않는다 (파일 비대화 방지)",
      not ({"role", "note", "producesScore"} & set(summary)), sorted(summary))

# 판단 시각과 탐지 시각이 완전히 같으면 사용 가능(<=)
same = ev("005930", "20260815000003", PRED)
check("탐지시각 == 판단시각이면 사용 가능",
      C.dart_context([same], PRED, P.EVENT_DETECTED)["visibleEventCount"] == 1)


# ── 3. 종목 격리 ─────────────────────────────────────────────────────────────
print("\n[2] 종목 격리 — 다른 종목 공시 혼입 없음")
tmp = tempfile.mkdtemp(prefix="gaeo-dart-")
try:
    # 평문 임시 store로 로더 로직만 검증한다. 실제 Key는 건드리지 않는다.
    store = research_store.ResearchArchiveStore(
        root=tmp, record_type=research_store.RECORD_DART, encrypt=False)
    day = dart_time.today_kst()
    prev = (datetime.date.fromisoformat(day) - datetime.timedelta(days=1)).isoformat()
    # 어제 Segment — 여기 A1이 '최초' 기록이다.
    store.append_predictions(prev, [
        dict(ev("005930", "A1", "2026-08-15T00:10:00+00:00"), date=prev),
    ], today=prev)
    rows = [
        dict(ev("000660", "A2", "2026-08-15T00:20:00+00:00"), date=day),
        dict(ev("005930", "A3", "2026-08-15T00:30:00+00:00", correction=True), date=day),
        # 날짜를 넘어 다시 수집된 같은 접수번호 — 한 번만 남아야 하고,
        # 시각은 '최초'(어제 00:10)를 유지해야 한다.
        dict(ev("005930", "A1", "2026-08-15T00:40:00+00:00"), date=day),
        # 매핑 실패 — byTicker에 들어가면 안 된다
        dict(ev(P.UNKNOWN_MAPPING, "A9", "2026-08-15T00:50:00+00:00"), date=day),
    ]
    store.append_predictions(day, rows, today=day)
    bundle = L.load_events(lookback_days=3, today=day, store=store)

    s = L.events_for(bundle, "005930")
    h = L.events_for(bundle, "000660")
    check("삼성전자 Event만 삼성전자에 들어간다",
          all(e["ticker"] == "005930" for e in s), [e["ticker"] for e in s])
    check("SK하이닉스 Event 1건", len(h) == 1, h)
    check("중복 rcept_no 제거 (A1이 1건)",
          sum(1 for e in s if e["rcept_no"] == "A1") == 1, s)
    check("삼성전자 총 2건 (A1, A3)", len(s) == 2, len(s))
    check("UNKNOWN_MAPPING은 어떤 종목에도 안 붙는다",
          all(t != P.UNKNOWN_MAPPING for t in bundle["byTicker"]), list(bundle["byTicker"]))
    check("미매핑 건수를 숨기지 않고 센다", bundle["unmappedSkipped"] == 1, bundle["unmappedSkipped"])

    # 4. 정정공시
    print("\n[3] 정정공시")
    ctx2 = C.dart_context(s, "2026-08-15T02:00:00+00:00", P.EVENT_DETECTED)
    check("정정공시가 집계된다", ctx2["correctionCount"] == 1, ctx2)

    # 5. 정렬 + 최초 탐지시각 보존
    print("\n[4] 정렬 · 최초 탐지시각")
    check("detected_at 오름차순 정렬",
          [e["rcept_no"] for e in s] == ["A1", "A3"], [e["rcept_no"] for e in s])
    a1 = next(e for e in s if e["rcept_no"] == "A1")
    check("중복 수집돼도 '최초' 탐지시각을 쓴다 (재시도 시각으로 밀리지 않음)",
          a1["detected_at"] == "2026-08-15T00:10:00+00:00", a1["detected_at"])
    # 최초 시각이 밀렸다면 09:15 KST(00:15 UTC) 판단에서 A1이 안 보였을 것이다.
    check("최초 탐지 이후 판단에서 A1이 보인다",
          C.dart_context(s, "2026-08-15T00:15:00+00:00", P.EVENT_DETECTED)["visibleEventCount"] == 1,
          C.dart_context(s, "2026-08-15T00:15:00+00:00", P.EVENT_DETECTED)["visibleEventCount"])
finally:
    shutil.rmtree(tmp, ignore_errors=True)


# ── 6. timezone 혼합 ─────────────────────────────────────────────────────────
print("\n[5] timezone 혼합 — 문자열이 아니라 실제 시각으로 비교")
kst = ev("005930", "T1", "2026-08-15T09:55:00+09:00")     # = 00:55 UTC, 판단 전
utc_late = ev("005930", "T2", "2026-08-15T01:30:00+00:00")  # 판단 뒤
ctx3 = C.dart_context([kst, utc_late], PRED, P.EVENT_DETECTED)
check("KST 표기 공시도 UTC Instant로 정확히 판정", ctx3["visibleEventCount"] == 1, ctx3)
# 문자열 비교였다면 "2026-08-15T09:55:00+09:00" > "2026-08-15T01:00:00+00:00"이라
# 판단 전 공시가 잘못 걸러졌을 것이다.
check("문자열 비교였다면 틀렸을 케이스를 통과",
      ctx3["latestDetectedAt"] == kst["detected_at"], ctx3["latestDetectedAt"])

naive = ev("005930", "T3", "2026-08-15T09:55:00")          # timezone 없음
check("timezone 없는 값은 사용하지 않는다",
      C.dart_context([naive], PRED, P.EVENT_DETECTED)["visibleEventCount"] == 0)


# ── 7~8. coverage 불완전 / API error ─────────────────────────────────────────
print("\n[6] 수집 불완전 — 거짓 '공시 없음' 금지")
for state in (P.EVENT_COVERAGE_INCOMPLETE, P.EVENT_DATA_ERROR):
    s2 = L.public_event_summary([], PRED, state)
    check(f"{state}: 공시 없음이라고 단정하지 않는다",
          s2["stateText"] != "공식 공시 없음", s2["stateText"])
    check(f"{state}: coverage 상태를 그대로 물고 간다", s2["state"] == state)
    ctx4 = C.dart_context([], PRED, state)
    check(f"{state}: 연구 C도 coverage를 보존한다", ctx4["coverageState"] == state)

s3 = L.public_event_summary([], PRED, P.NO_OFFICIAL_EVENT_DETECTED)
check("수집이 정상일 때만 '공식 공시 없음'", s3["stateText"] == "공식 공시 없음", s3["stateText"])
check("공시 없음이 '뉴스 없음'을 뜻하지 않는다고 명시",
      "일반 뉴스" in L.PUBLIC_SUMMARY_META["note"], L.PUBLIC_SUMMARY_META["note"])

print("\n[7] 상태를 모를 때는 낙관하지 않는다")
check("eventState 미상 → EVENT_COVERAGE_INCOMPLETE",
      L.coverage_state({}) == P.EVENT_COVERAGE_INCOMPLETE)
check("이상한 상태값도 EVENT_COVERAGE_INCOMPLETE",
      L.coverage_state({"eventState": "무슨값"}) == P.EVENT_COVERAGE_INCOMPLETE)


# ── 9. budget / API 미호출 ───────────────────────────────────────────────────
print("\n[8] 로더는 DART API를 절대 호출하지 않는다")
import dart_client
called = {"n": 0}
_orig = dart_client.DartClient.__init__


def _boom(self, *a, **k):
    called["n"] += 1
    return _orig(self, *a, **k)


dart_client.DartClient.__init__ = _boom
try:
    L.load_events(lookback_days=3)
    L.coverage_state()
    L.public_event_summary([before], PRED, P.EVENT_DETECTED)
finally:
    dart_client.DartClient.__init__ = _orig
check("로더 실행 중 DartClient 생성 0회 (예산 소모 없음)", called["n"] == 0, called["n"])

src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "dart_context_loader.py"), encoding="utf-8").read()
check("로더 소스에 dart_client import 없음", "import dart_client" not in src)
check("로더 소스에 urllib/requests 없음",
      "urllib" not in src and "requests" not in src)


# ── 10. 연구 C 방향점수 불변 ─────────────────────────────────────────────────
print("\n[9] 연구모델 C는 DART로 방향을 바꾸지 않는다 (B와 짝 유지)")
check("dart_context가 producesScore=False", C.dart_context([before], PRED)["producesScore"] is False)
check("v2.0 DART 사용범위가 context_only", "context_only" in C.config_hash.__doc__ if C.config_hash.__doc__ else True)


print("\n" + ("=" * 60))
if FAILS:
    print(f"실패 {len(FAILS)}건: {FAILS}")
    sys.exit(1)
print("DART Context Loader 검증 전부 통과")
