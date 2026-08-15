#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DART Context Loader — 이미 수집된 공시 Event를 **읽기 전용**으로 제공한다.

⚠️ 이 모듈은 DART API를 호출하지 않는다. collect_dart.py가 이미 저장해 둔
   Daily Segment(research_archive/dart/live/YYYY/MM/DD.jsonl[.gz][.enc])만 읽는다.
   즉 여기서 예산(dart_budget)이 소모되는 일은 절대 없다.

왜 필요한가
    analyze_auto.py는 지금까지 `dart_events = []`로 시작해 collection_status.json의
    **상태만** 읽고, 실제 저장된 Event를 한 건도 넘기지 않았다. 그래서
    research_engine_v20(연구모델 C)은 DART를 받을 준비가 돼 있는데도 늘 빈 목록을
    받아 왔다. 이 로더가 그 마지막 연결을 담당한다.

Point-in-Time 원칙 (가장 중요)
    Prediction 시각보다 **늦게 발견된 공시는 절대 보이면 안 된다.**
        detected_at <= prediction_timestamp
    비교는 문자열이 아니라 timezone-aware UTC Instant로 한다(dart_time.instant_le).
    rcept_dt는 '접수일자'일 뿐 시각이 아니므로 장중 판정에 쓰지 않는다.

    ⚠️ 이 모듈은 로드 단계에서 미래 Event를 미리 잘라내지 않는다.
       잘라내기는 research_engine_v20.dart_context()가 담당하고, 그래야
       "몇 건이 아직 안 보이는가(hiddenNotYetDetected)"를 정직하게 셀 수 있다.
       대신 기본모델용 요약(public_event_summary)은 반드시 PIT를 적용해서 낸다.

상태 정직성
    수집이 불완전했으면 그 사실을 지운 채 "공시 없음"이라고 말하지 않는다.
    EVENT_COVERAGE_INCOMPLETE / EVENT_DATA_ERROR 상태를 그대로 물고 올라간다.
"""
import datetime
import json
import os

import dart_time
import dart_pipeline as P
import research_store

HERE = os.path.dirname(os.path.abspath(__file__))
DART_ROOT = P.DART_ROOT
STATUS_PATH = os.path.join(DART_ROOT, "collection_status.json")

# 기본 조회 창. 공시는 발표 당일이 가장 중요하지만, 며칠 전 사업보고서/정정도
# "최근 공식공시"로서 맥락 가치가 있어 짧은 창을 둔다.
DEFAULT_LOOKBACK_DAYS = 7

# 로더 자체의 상태값
LOADER_OK = "DART_CONTEXT_LOADED"
LOADER_NO_ARCHIVE = "DART_ARCHIVE_NOT_PRESENT"
LOADER_READ_ERROR = "DART_ARCHIVE_READ_ERROR"


def _store():
    """collect_dart.py와 **같은** Store 설정으로 읽는다(root·record_type·encrypt).

    설정이 어긋나면 암호문 AAD 라벨이 달라져 복호화가 실패한다.
    """
    return research_store.ResearchArchiveStore(
        root=DART_ROOT, record_type=research_store.RECORD_DART, encrypt=True)


def load_collection_status():
    """collect_dart.py가 남긴 이번 회차 수집 상태."""
    if not os.path.exists(STATUS_PATH):
        return {}
    try:
        with open(STATUS_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def coverage_state(status=None):
    """이번 판단에 물려 줄 DART 수집 상태.

    ⚠️ 상태를 모르면 'NO_OFFICIAL_EVENT_DETECTED'로 낙관하지 않는다.
       모르는 것은 EVENT_COVERAGE_INCOMPLETE다.
    """
    status = load_collection_status() if status is None else status
    state = (status or {}).get("eventState")
    if state in (P.EVENT_DETECTED, P.NO_OFFICIAL_EVENT_DETECTED,
                 P.EVENT_COVERAGE_INCOMPLETE, P.EVENT_DATA_ERROR):
        return state
    return P.EVENT_COVERAGE_INCOMPLETE


def _recent_days(lookback_days, today=None):
    today = today or dart_time.today_kst()
    base = datetime.date.fromisoformat(str(today)[:10])
    return [(base - datetime.timedelta(days=i)).isoformat()
            for i in range(max(1, int(lookback_days)))]


def _dedupe(events):
    """같은 rcept_no는 한 번만 남긴다.

    ⚠️ detected_at은 **최초 탐지시각**이어야 한다(요구 3-2).
       수집은 at-least-once라서 같은 공시가 재시도로 다시 저장될 수 있고,
       그때 붙는 detected_at은 '두 번째로 본 시각'이다. 그 값을 채택하면
       실제로는 09:55에 알고 있던 공시가 10:40에야 안 것처럼 밀려서
       그 사이 Prediction들이 근거 없이 공시를 못 보게 된다.
       그래서 그룹에서 **가장 이른** detected_at을 가진 기록을 대표로 삼는다.

    ⚠️ 단 정정 링크(corrects_rcept_no)처럼 나중에야 알게 되는 메타데이터는
       뒤 기록에서 끌어와 채운다. 시각은 최초, 정보는 최신이다.
    """
    groups = {}
    for e in events:
        no = str(e.get("rcept_no") or "")
        if not no:
            continue
        groups.setdefault(no, []).append(e)

    out = []
    for no, rows in groups.items():
        def _key(rec):
            inst = dart_time.parse_instant(rec.get("detected_at"))
            # 읽을 수 없는 시각은 대표로 뽑지 않는다(맨 뒤로 민다).
            return (inst is None, inst or datetime.datetime.max.replace(
                tzinfo=datetime.timezone.utc))
        rows = sorted(rows, key=_key)
        rep = dict(rows[0])
        for later in rows[1:]:
            if (rep.get("corrects_rcept_no") in (None, "", P.NOT_AVAILABLE)
                    and later.get("corrects_rcept_no") not in (None, "", P.NOT_AVAILABLE)):
                rep["corrects_rcept_no"] = later["corrects_rcept_no"]
            # 정정 여부는 한 번이라도 정정으로 판정됐으면 정정이다.
            rep["is_correction"] = bool(rep.get("is_correction")) or bool(later.get("is_correction"))
        out.append(rep)
    return out


def load_events(lookback_days=DEFAULT_LOOKBACK_DAYS, today=None, store=None):
    """최근 며칠치 저장된 Event를 ticker별로 묶어 돌려준다.

    반환:
        {
          "byTicker": {"005930": [event, ...], ...},
          "total": int,
          "days": [...],            실제로 읽은 날짜
          "loaderState": ...,
          "readErrors": [...],
          "coverageState": ...,     collect_dart.py 상태를 그대로 물고 온다
        }

    ⚠️ UNKNOWN_MAPPING(종목을 특정 못한 공시)은 byTicker에 넣지 않는다.
       "다른 종목 공시가 섞이는 것"을 막는 게 잘못 매칭보다 훨씬 중요하다.
    """
    store = store or _store()
    days = _recent_days(lookback_days, today)
    status = load_collection_status()
    out = {"byTicker": {}, "total": 0, "days": [], "readErrors": [],
           "coverageState": coverage_state(status),
           "loaderState": LOADER_OK, "unmappedSkipped": 0}

    # ⚠️ 모듈 상수가 아니라 **실제로 쓰는 store**의 경로를 본다.
    #    (테스트가 임시 디렉터리 store를 주입해도 정확히 동작해야 한다.)
    if not os.path.isdir(store.live):
        out["loaderState"] = LOADER_NO_ARCHIVE
        return out

    collected = []
    for day in days:
        try:
            recs = store.read_day(day)
        except Exception as ex:                     # 복호화 실패·손상 Segment 등
            out["readErrors"].append({"day": day, "error": str(ex)[:200]})
            continue
        if recs:
            out["days"].append(day)
            collected.extend(recs)

    if out["readErrors"]:
        # 일부 날짜를 못 읽었으면 '공시 없음'이라고 결론내면 안 된다.
        out["loaderState"] = LOADER_READ_ERROR
        out["coverageState"] = P.EVENT_COVERAGE_INCOMPLETE

    for e in _dedupe(collected):
        ticker = str(e.get("ticker") or "")
        if not ticker or ticker == P.UNKNOWN_MAPPING:
            out["unmappedSkipped"] += 1
            continue
        out["byTicker"].setdefault(ticker, []).append(e)

    # detected_at 오름차순. dart_context()가 visible[-1]을 '최신'으로 읽는다.
    for ticker, evs in out["byTicker"].items():
        evs.sort(key=lambda e: dart_time.parse_instant(e.get("detected_at"))
                 or datetime.datetime.min.replace(tzinfo=datetime.timezone.utc))
    out["total"] = sum(len(v) for v in out["byTicker"].values())
    return out


def events_for(bundle, ticker):
    """한 종목의 Event 목록. 없으면 빈 리스트."""
    return list((bundle or {}).get("byTicker", {}).get(str(ticker)) or [])


# ── 기본모델(Production)용 안전 요약 ─────────────────────────────────────────
def public_event_summary(events, prediction_timestamp, coverage_state_value=None):
    """브라우저로 내보낼 수 있는 **작고 안전한** 공시 요약.

    ⚠️ Raw Event 전체를 보내지 않는다(요구 5-2). 공식 공시명·접수번호·탐지시각처럼
       이미 DART가 공개한 값만 담는다.
    ⚠️ 여기서는 반드시 PIT를 적용한다. 판단 시각 이후에 발견된 공시는 빼고 센다.
    ⚠️ 점수를 만들지 않는다. "공시 있음 = +10점" 같은 규칙은 두지 않는다.
    ⚠️ '공시 없음'을 '악재 없음'이나 '뉴스 없음'으로 옮겨 적지 않는다.
    """
    events = events or []
    visible = [e for e in events
               if dart_time.instant_le(e.get("detected_at"), prediction_timestamp)]
    hidden = len(events) - len(visible)
    state = coverage_state_value or P.EVENT_COVERAGE_INCOMPLETE

    items = []
    for e in visible[-3:]:                       # 최신 3건이면 화면 맥락으로 충분하다
        items.append({
            "name": e.get("report_name") or P.NOT_AVAILABLE,
            "rceptNo": e.get("rcept_no") or P.NOT_AVAILABLE,
            "detectedAt": e.get("detected_at") or P.NOT_AVAILABLE,
            "isCorrection": bool(e.get("is_correction")),
            "receiptDate": e.get("rcept_dt") or P.NOT_AVAILABLE,
        })

    # 상태 문구. 수집이 불완전하면 "공시 없음"이라고 단정하지 않는다.
    if visible:
        state_text = "공식 공시 확인"
    elif state in (P.EVENT_COVERAGE_INCOMPLETE, P.EVENT_DATA_ERROR):
        state_text = "공시 확인 중"
    else:
        state_text = "공식 공시 없음"

    # ⚠️ 500~600종목마다 똑같이 반복되는 상수 문자열(role·note 등)은 여기 넣지 않는다.
    #    그대로 넣으면 브라우저가 내려받는 auto_analysis.js가 100KB 넘게 불어난다.
    #    공통 설명은 PUBLIC_SUMMARY_META로 파일 머리말에 한 번만 싣는다.
    out = {
        "count": len(visible),
        "state": state,
        "stateText": state_text,
    }
    if hidden:
        out["hiddenNotYetDetected"] = hidden
    if items:
        out["items"] = items
    corrections = sum(1 for e in visible if e.get("is_correction"))
    if corrections:
        out["correctionCount"] = corrections
    return out


# 종목마다 반복되지 않게, 파일 머리말에 한 번만 싣는 공통 설명.
PUBLIC_SUMMARY_META = {
    "role": "OFFICIAL_FILING_CONTEXT",
    "producesScore": False,
    # 사용자 화면에 그대로 쓸 수 있는 한 줄. 과장하지 않는다.
    "note": "DART 공식 공시만 본 결과입니다. 일반 뉴스나 증권사 의견은 포함되지 않습니다.",
}


def financial_freshness(ticker, bundle=None):
    """공식 재무자료 최신성. 아직 재무 Segment를 쓰지 않으므로 정직하게 미보유로 낸다.

    ⚠️ 없는 값을 0이나 50으로 채우지 않는다.
    """
    return {"status": "DIANA_DART_PARTIAL", "available": False,
            "note": "공식 재무 Feature는 아직 방향점수에 쓰지 않습니다."}


def summary_line(bundle):
    """로그 한 줄."""
    b = bundle or {}
    return (f"DART Context — {b.get('loaderState')} · Event {b.get('total', 0)}건 "
            f"· 종목 {len(b.get('byTicker') or {})}개 · 조회일 {len(b.get('days') or [])}일 "
            f"· coverage {b.get('coverageState')} "
            f"· 미매핑 skip {b.get('unmappedSkipped', 0)}건")


if __name__ == "__main__":
    bundle = load_events()
    print(summary_line(bundle))
    for ticker, evs in list((bundle.get("byTicker") or {}).items())[:5]:
        print(f"  {ticker}: {len(evs)}건 · 최신 {evs[-1].get('report_name')}")
