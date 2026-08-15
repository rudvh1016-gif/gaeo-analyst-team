#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DART 수집 실행기 — 워크플로에서 부른다.

⚠️ 이 스크립트는 실패해도 절대 0이 아닌 종료코드를 내지 않는다(요구 15번).
   DART가 죽어도 Price / TARO / DIANA / FLOW / ROTATION 워크플로는 계속 돈다.

⚠️ 여기서 모은 데이터는 research_v1.0 / v1.1의 판단에 들어가지 않는다.
   research_v2.0에서 처음으로 Feature가 된다.

사용:
    python3 collect_dart.py            # 신규공시 수집(매 사이클)
    python3 collect_dart.py --map      # corp_code 매핑 테이블 갱신(가끔)
    python3 collect_dart.py --self-test  # 네트워크 없이 로직만 점검
"""
import datetime
import json
import os
import sys

import dart_client
import dart_pipeline as P
import research_store

HERE = os.path.dirname(os.path.abspath(__file__))
DART_ROOT = P.DART_ROOT
STATUS_PATH = os.path.join(DART_ROOT, "collection_status.json")


def _now_iso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _dart_store():
    """DART Raw도 Research와 같은 Archive 정책을 쓴다(요구 36번)."""
    return research_store.ResearchArchiveStore(root=DART_ROOT)


def write_status(payload):
    os.makedirs(DART_ROOT, exist_ok=True)
    with open(STATUS_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1, sort_keys=True)


def refresh_corp_map(client):
    """corp_code 매핑 테이블 갱신. 자주 부를 필요 없다."""
    universe = P.load_universe()
    res = client.corp_code_zip()
    if res["status"] != dart_client.OK:
        return {"status": res["status"], "error": res["error"],
                "universeSize": len(universe)}
    try:
        rows = P.parse_corp_code_zip(res["data"])
    except Exception as ex:
        return {"status": P.EVENT_DATA_ERROR,
                "error": dart_client.redact(f"corpCode 파싱 실패: {ex}")}
    cmap = P.build_corp_map(rows, universe)
    P.save_corp_map(cmap)
    rate = cmap["mappedCount"] / cmap["universeSize"] if cmap["universeSize"] else 0
    return {"status": dart_client.OK, "dartCompanies": len(rows),
            "universeSize": cmap["universeSize"], "mapped": cmap["mappedCount"],
            "unknown": cmap["unknownCount"], "mappingRate": round(rate, 4)}


def collect(client, corp_map):
    """오늘 신규공시를 모아 Daily Segment에 append."""
    started = _now_iso()
    result = P.collect_new_filings(client, corp_map)
    events = result["events"]
    state = P.coverage_state(events, result["errors"], client.has_key)

    stored = 0
    if events:
        store = _dart_store()
        day = datetime.date.today().isoformat()
        # DART Raw도 날짜별 Segment. rcept_no를 키로 쓴다.
        records = [dict(e, code=e["rcept_no"], date=day) for e in events]
        try:
            added, replaced = store.append_predictions(day, records, today=day)
            stored = added + replaced
        except PermissionError as ex:
            result["errors"].append({"stage": "append", "error": str(ex)})

    finished = _now_iso()
    return {
        "startedAt": started, "finishedAt": finished,
        "eventState": state, "coverageNote": P.COVERAGE_NOTE,
        "eventsStored": stored,
        "efficiency": client.efficiency_report({
            "new_filings_detected": result["stats"]["new_filings_detected"],
            "matched_gaeo_filings": result["stats"]["matched_gaeo_filings"],
            "duplicate_skipped": result["stats"]["duplicate_skipped"],
            "unmatched_filings": result["stats"]["unmatched_filings"],
            "pages_fetched": result["stats"]["pages_fetched"],
            "processing_duration_sec": None,
        }),
        "seenTotal": result["seenTotal"],
        "errors": result["errors"],
    }


def self_test():
    """네트워크·API Key 없이 파이프라인 로직만 점검한다."""
    universe = P.load_universe()
    fake_dart = [{"corp_code": "00126380", "corp_name": "삼성전자", "stock_code": "005930"},
                 {"corp_code": "00164779", "corp_name": "SK하이닉스", "stock_code": "000660"},
                 {"corp_code": "99999999", "corp_name": "비상장회사", "stock_code": ""}]
    cmap = P.build_corp_map(fake_dart, universe)
    print(f"자체점검 · 유니버스 {cmap['universeSize']}종목 중 "
          f"매핑 {cmap['mappedCount']}건 · UNKNOWN_MAPPING {cmap['unknownCount']}건")
    ev = P.normalize_filing(
        {"corp_code": "00126380", "report_nm": "[기재정정]현금·현물배당 결정",
         "rcept_no": "20260815000001", "corp_cls": "Y", "rcept_dt": "20260815"},
        cmap["mapped"].get("005930"), _now_iso())
    print(f"정규화 예시 · ticker={ev['ticker']} · is_correction={ev['is_correction']} "
          f"· rcept_dt 해석={ev['rcept_dt_note']}")
    print(f"PIT 규칙 · 발견 이전 시점 사용 가능? "
          f"{P.event_visible_at(ev, '2026-01-01T00:00:00+00:00')} (False여야 정상)")
    return 0


def main():
    args = set(sys.argv[1:])
    if "--self-test" in args:
        return self_test()

    client = dart_client.DartClient()
    payload = {"ranAt": _now_iso(), "hasApiKey": client.has_key,
               "note": ("DART 수집 전용. research_v1.0 / v1.1 판단에 사용하지 않는다. "
                        "최초 사용 버전은 research_v2.0이다.")}

    if not client.has_key:
        # 키가 없어도 파이프라인을 죽이지 않는다.
        payload.update({"status": dart_client.DART_KEY_MISSING,
                        "eventState": P.EVENT_COVERAGE_INCOMPLETE,
                        "hint": f"{dart_client.KEY_ENV}를 GitHub Secrets로 주입하세요."})
        write_status(payload)
        print(f"[DART] {dart_client.KEY_ENV} 없음 — 수집 생략(파이프라인은 계속 진행)")
        return 0

    try:
        if "--map" in args or P.load_corp_map() is None:
            payload["mapping"] = refresh_corp_map(client)
            print(f"[DART] 매핑 — {payload['mapping']}")
        corp_map = P.load_corp_map()
        if not corp_map:
            payload.update({"status": P.EVENT_DATA_ERROR,
                            "eventState": P.EVENT_COVERAGE_INCOMPLETE,
                            "error": "corp_map을 만들지 못했습니다"})
            write_status(payload)
            print("[DART] 매핑 테이블 없음 — 수집 생략")
            return 0
        payload.update(collect(client, corp_map))
        payload["status"] = dart_client.OK if not payload["errors"] else P.EVENT_DATA_ERROR

        # DART Raw도 Daily Segment → gzip → manifest 정책을 그대로 쓴다.
        try:
            payload["maintenance"] = _dart_store().maintain()
        except Exception as ex:
            payload["maintenanceError"] = dart_client.redact(str(ex))[:200]

        print(f"[DART] {payload['eventState']} · 신규 {payload['efficiency']['new_filings_detected']}건 "
              f"· 유니버스 매칭 {payload['efficiency']['matched_gaeo_filings']}건 "
              f"· 중복 skip {payload['efficiency']['duplicate_skipped']}건 "
              f"· 호출 {payload['efficiency']['requests_per_run']}회")
    except Exception as ex:
        # 여기까지 오면 예상 못 한 오류다. 그래도 워크플로를 죽이지 않는다.
        payload.update({"status": P.EVENT_DATA_ERROR,
                        "eventState": P.EVENT_DATA_ERROR,
                        "error": dart_client.redact(f"{type(ex).__name__}: {ex}")[:300]})
        print(f"[DART] 수집 실패 — 나머지 파이프라인은 계속 진행: {payload['error']}")

    write_status(payload)
    return 0


if __name__ == "__main__":
    sys.exit(main())
