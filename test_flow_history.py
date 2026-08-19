#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""update_flow_history.py 계약 — 일별 수급 원본이 APPEND-ONLY로만 쌓인다.

이 기록은 "지금 안 쌓으면 영원히 못 만드는" 자료다(네이버는 최근 5거래일치만 준다).
그래서 잘못 덮어써서 과거를 잃는 것이 이 스크립트의 유일한 치명적 실패다.
아래 계약을 코드로 고정한다.

    ① 파싱: 수량·시가총액·bizdate를 실제 응답 모양대로 읽는다.
    ② 축적: 처음 실행하면 원본에 있는 거래일이 전부 들어간다.
    ③ 멱등: 같은 원본으로 다시 실행해도 기록이 늘거나 바뀌지 않는다.
    ④ APPEND-ONLY: 원본 값이 달라져도 이미 기록된 과거는 그대로다(충돌만 보고).
    ⑤ 보존: 원본이 5거래일 창을 넘겨 흘러가도(과거 날짜가 응답에서 빠져도)
       이미 쌓인 과거 날짜는 남는다. 새 날짜만 뒤에 붙는다.
    ⑥ 안전: 원본이 비었거나 못 읽으면 기존 파일을 건드리지 않고 실패로 끝난다.
    ⑦ 월별 샤드로 나뉘고 manifest가 기간을 정확히 요약한다.

네트워크를 쓰지 않는다(전부 임시 디렉터리 fixture).
"""
import json
import os
import shutil
import sys
import tempfile

import update_flow_history as ufh

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def deal(bizdate, frgn, org, indi, close=10000, vol=100000):
    return {"bizdate": bizdate,
            "foreignerPureBuyQuant": f"{frgn:+,}",
            "organPureBuyQuant": f"{org:+,}",
            "individualPureBuyQuant": f"{indi:+,}",
            "closePrice": f"{close:,}",
            "accumulatedTradingVolume": f"{vol:,}"}


def source(trends_by_code, market_value="2조 5,350억", price="75,800"):
    return {"fetchedAt": "2026-08-19 16:14",
            "stocks": {code: {"name": f"종목{code}",
                              "info": {"totalInfos": {"marketValue": market_value,
                                                      "lastClosePrice": price},
                                       "dealTrends": trends}}
                       for code, trends in trends_by_code.items()}}


def write_source(path, payload):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)


def read_shard(out_dir, month):
    with open(os.path.join(out_dir, f"{month}.json"), encoding="utf-8") as f:
        return json.load(f)


# ── ① 파싱 계약 ─────────────────────────────────────────────────────────────
check("수량 파싱 — 부호·천단위 콤마", ufh.parse_qty("+218,732") == 218732
      and ufh.parse_qty("-202,682") == -202682 and ufh.parse_qty("0") == 0)
check("수량 파싱 — 값이 없으면 None(0으로 지어내지 않음)",
      ufh.parse_qty(None) is None and ufh.parse_qty("N/A") is None)
check("시가총액 파싱 — 조·억 혼합", ufh.parse_eok("2조 5,350억") == 25350
      and ufh.parse_eok("8,202억") == 8202 and ufh.parse_eok("N/A") is None)
check("발행주식수 역산", ufh.estimate_shares({"marketValue": "2조 5,350억",
                                              "lastClosePrice": "75,800"}) is not None)
check("발행주식수 — 재료가 없으면 None",
      ufh.estimate_shares({"marketValue": "N/A", "lastClosePrice": "75,800"}) is None)
check("bizdate 변환", ufh.bizdate_to_date("20260818") == "2026-08-18"
      and ufh.bizdate_to_date("2026-08-18") is None
      and ufh.bizdate_to_date("20261399") is None)

tmp = tempfile.mkdtemp(prefix="flowhist_")
data = os.path.join(tmp, "analysis_data.json")
out = os.path.join(tmp, "flow_history")
try:
    # ── ② 최초 축적 ─────────────────────────────────────────────────────────
    write_source(data, source({
        "005930": [deal("20260818", 218732, -202682, 3229),
                   deal("20260814", -384480, -358108, 767560),
                   deal("20260813", 31986, -95408, 57471)],
        "000660": [deal("20260818", 1000, 2000, -3000)],
    }))
    rc = ufh.run(data, out, today="2026-08-19")
    shard = read_shard(out, "2026-08")
    check("최초 실행 성공", rc == 0)
    check("원본의 거래일이 전부 기록된다",
          sorted(shard["days"]) == ["2026-08-13", "2026-08-14", "2026-08-18"])
    check("값이 fields 순서대로 저장된다",
          shard["fields"] == ["frgn", "org", "indi", "vol", "close", "mcapEok"]
          and shard["days"]["2026-08-18"]["005930"][:3] == [218732, -202682, 3229],
          str(shard["days"]["2026-08-18"]["005930"]))
    check("시가총액 추정치가 함께 저장된다",
          isinstance(shard["days"]["2026-08-18"]["005930"][5], int))
    check("미래 날짜는 저장하지 않는다", "2026-08-20" not in shard["days"])
    first_recorded = dict(shard["recordedAt"])

    # ── ③ 멱등 ──────────────────────────────────────────────────────────────
    before_bytes = open(os.path.join(out, "2026-08.json"), "rb").read()
    ufh.run(data, out, today="2026-08-19")
    check("같은 원본 재실행 — 파일이 한 바이트도 안 바뀐다",
          open(os.path.join(out, "2026-08.json"), "rb").read() == before_bytes)

    # ── ④ 과거 값이 달라져도 덮어쓰지 않는다 ─────────────────────────────────
    write_source(data, source({
        "005930": [deal("20260818", 999999, 999999, 999999)],   # 오염된 원본
    }))
    ufh.run(data, out, today="2026-08-19")
    shard = read_shard(out, "2026-08")
    check("이미 기록된 (날짜, 종목)은 덮어쓰지 않는다",
          shard["days"]["2026-08-18"]["005930"][:3] == [218732, -202682, 3229],
          str(shard["days"]["2026-08-18"]["005930"]))
    check("최초 기록 시각도 바뀌지 않는다", shard["recordedAt"] == first_recorded)

    # ── ⑤ 5거래일 창이 흘러가도 과거는 남고 새 날짜만 붙는다 ─────────────────
    write_source(data, source({
        "005930": [deal("20260821", 111, 222, -333), deal("20260820", 5, 6, -11)],
        "000990": [deal("20260821", 7, 8, -15)],       # 새로 편입된 종목
    }))
    ufh.run(data, out, today="2026-08-22")
    shard = read_shard(out, "2026-08")
    check("과거 날짜가 원본에서 사라져도 기록에 남는다",
          {"2026-08-13", "2026-08-14", "2026-08-18"} <= set(shard["days"]))
    check("새 거래일이 추가된다", {"2026-08-20", "2026-08-21"} <= set(shard["days"]))
    check("새 종목도 그날부터 기록된다", "000990" in shard["days"]["2026-08-21"])
    check("기존 종목 기록은 그대로", shard["days"]["2026-08-18"]["000660"][0] == 1000)

    # ── 월이 바뀌면 새 샤드로 나뉜다 ────────────────────────────────────────
    write_source(data, source({"005930": [deal("20260901", 1, 2, -3)]}))
    ufh.run(data, out, today="2026-09-02")
    check("달이 바뀌면 새 파일로 분리된다",
          os.path.exists(os.path.join(out, "2026-09.json"))
          and "2026-09-01" not in read_shard(out, "2026-08")["days"])

    # ── ⑦ manifest ─────────────────────────────────────────────────────────
    manifest = json.load(open(os.path.join(out, "index.json"), encoding="utf-8"))
    check("manifest 기간·건수 요약이 맞다",
          manifest["start"] == "2026-08-13" and manifest["end"] == "2026-09-01"
          and manifest["totalDays"] == 6 and len(manifest["months"]) == 2,
          json.dumps(manifest, ensure_ascii=False)[:200])

    # ── ⑥ 원본 사고 시 기존 기록 보존 ───────────────────────────────────────
    snapshot_before = {f: open(os.path.join(out, f), "rb").read()
                       for f in sorted(os.listdir(out))}
    write_source(data, {"stocks": {}})
    rc_empty = ufh.run(data, out, today="2026-09-02")
    with open(data, "w", encoding="utf-8") as f:
        f.write("{ 깨진 JSON")
    rc_broken = ufh.run(data, out, today="2026-09-02")
    after = {f: open(os.path.join(out, f), "rb").read() for f in sorted(os.listdir(out))}
    check("빈 원본·깨진 원본이면 실패로 끝난다", rc_empty == 1 and rc_broken == 1)
    check("실패해도 기존 기록 파일을 건드리지 않는다", after == snapshot_before)

    # ── APPEND-ONLY 자체 검사기가 실제로 위반을 잡는지 ──────────────────────
    store = ufh.load_store(out)
    before_snap = ufh.snapshot(store)
    store["2026-08"]["days"]["2026-08-18"]["005930"] = [0, 0, 0, 0, 0, 0]
    changed = ufh.verify_append_only(before_snap, ufh.snapshot(store))
    del store["2026-08"]["days"]["2026-08-13"]
    deleted = ufh.verify_append_only(before_snap, ufh.snapshot(store))
    check("검사기가 값 변경을 잡는다",
          any(v["kind"] == "CHANGED" for v in changed), str(changed[:2]))
    check("검사기가 삭제를 잡는다",
          any(v["kind"] == "DELETED" for v in deleted), str(deleted[:2]))
finally:
    shutil.rmtree(tmp, ignore_errors=True)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_flow_history: 전체 통과")
