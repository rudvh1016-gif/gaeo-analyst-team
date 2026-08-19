#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 종목별 일별 수급(FLOW) 영구 기록 (APPEND-ONLY)

왜 필요한가
    네이버 통합 API가 주는 수급(dealTrends)은 **최근 5거래일치뿐**이다. 지금부터 매일
    받아 쌓지 않으면 과거 수급은 영원히 복원할 수 없다. FLOW 점수를 시가총액·거래량
    기준으로 정규화하는 개선안(docs/gaeo_base_model_candidates.md 후보 A1)이
    NOT_BACKTESTABLE로 보류된 이유가 바로 이 원본 부재다. 이 스크립트는 **점수 계산에
    전혀 관여하지 않고** 원본만 축적한다(스코어링 로직은 compute_indicators.py 그대로).

원천
    analysis_data.json → stocks[code].info.dealTrends (거래일별 확정 수급 원본)
    · flow_summary()가 만드는 합계(frgnSum 등)가 아니라 그 합계의 재료인 일별 행을 쓴다.
      합계는 "최근 5일 창"에 종속돼 나중에 창 크기를 바꾸면 재현이 안 되지만,
      일별 원본은 어떤 창으로도 다시 계산할 수 있다.
    · FLOW는 구조적으로 T+1 지연이다(AGENTS.md). 그래서 오늘 받는 최신 행은 보통
      전 거래일 몫이고, 이미 확정된 값이라 나중에 바뀌지 않는다.

저장 구조 (flow_history/)
    flow_history/YYYY-MM.json   월 단위 샤드. 하루 600종목 ≈ 30KB → 한 달 ≈ 0.6MB.
    flow_history/index.json     샤드 목록·기간·건수 요약(로딩용 manifest)
    한 파일로 몰면 price_history.js(28MB)의 전철을 밟는다. 월별로 쪼개면 매 사이클
    바뀌는 파일이 "이번 달 것" 하나뿐이라 git 이력도 가볍다.

    각 날짜의 한 줄은 fields 순서(frgn·org·indi·vol·close·mcapEok)의 배열이다.
    키 이름을 매 줄 반복하지 않으려는 압축 표현이다.
      frgn/org/indi  그날 외국인·기관·개인 순매수 수량(주)
      vol            그날 거래량(주)
      close          그날 종가(원)
      mcapEok        그날 시가총액 추정(억원) = 발행주식수 추정 × 그날 종가
                     발행주식수는 시가총액 ÷ 현재가로 역산한다(정규화 검증용 근사치).

APPEND-ONLY 규칙 (절대 어기지 말 것)
    · 이미 기록된 (날짜, 종목)은 값을 덮어쓰지 않는다. 먼저 기록된 값이 이긴다.
    · 날짜·종목을 삭제하거나 잘라내지 않는다. 롤링·상한 없음.
    · 새 날짜, 그리고 기존 날짜에 없던 종목을 추가하는 것만 허용한다.
    · 쓰기 직전에 verify_append_only()로 자체 검사하고, 위반이면 파일을 쓰지 않는다.

실행
    python3 update_flow_history.py [--data analysis_data.json] [--out flow_history]
    update-analysis.yml이 매 사이클 호출한다(실패해도 파이프라인을 멈추지 않는다).
"""
import argparse
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
KST = datetime.timezone(datetime.timedelta(hours=9))

SCHEMA_VERSION = "gaeo_flow_history_v1"
FIELDS = ["frgn", "org", "indi", "vol", "close", "mcapEok"]
# 월별 샤드가 이보다 커지면 경고한다(설계상 0.6MB 안팎이어야 한다).
SHARD_WARN_BYTES = 5 * 1024 * 1024


# ── 파싱 ────────────────────────────────────────────────────────────────────
def parse_qty(v):
    """'+218,732' · '-202,682' · 218732 → int (해석 실패는 None)."""
    if v is None:
        return None
    if isinstance(v, (int, float)):
        return int(v)
    s = str(v).replace(",", "").replace("+", "").strip()
    if not s or s in ("-", "N/A"):
        return None
    try:
        return int(float(s))
    except ValueError:
        return None


def parse_eok(v):
    """'2조 5,350억' · '8,202억' → 억원 단위 float (해석 실패는 None)."""
    if v is None:
        return None
    s = str(v).replace(",", "").replace(" ", "")
    if not s or s == "N/A":
        return None
    total, matched = 0.0, False
    m = re.search(r"(\d+(?:\.\d+)?)조", s)
    if m:
        total += float(m.group(1)) * 10000
        matched = True
    m = re.search(r"(\d+(?:\.\d+)?)억", s)
    if m:
        total += float(m.group(1))
        matched = True
    if matched:
        return total
    try:
        return float(s) / 1e8      # 단위 없이 원으로 온 경우
    except ValueError:
        return None


def estimate_shares(total_infos):
    """시가총액(억원) ÷ 현재가 → 발행주식수 근사. 둘 중 하나라도 없으면 None.

    ⚠️ 근사치다. 우선주·자사주·상장주식수 변동을 반영하지 못한다. 시가총액 정규화
    후보를 '검증'하기 위한 재료이지, 공시 수치로 쓰라고 만든 값이 아니다.
    """
    ti = total_infos or {}
    mv = parse_eok(ti.get("marketValue"))
    price = parse_qty(ti.get("lastClosePrice"))
    if not mv or not price or price <= 0:
        return None
    return mv * 1e8 / price


def bizdate_to_date(v):
    """'20260818' → '2026-08-18' (형식이 다르면 None)."""
    s = str(v or "").strip()
    if not re.fullmatch(r"\d{8}", s):
        return None
    try:
        datetime.date(int(s[:4]), int(s[4:6]), int(s[6:8]))
    except ValueError:
        return None
    return f"{s[0:4]}-{s[4:6]}-{s[6:8]}"


# ── 원천 → 날짜별 행 ─────────────────────────────────────────────────────────
def extract_rows(raw, today=None):
    """analysis_data.json 구조에서 {날짜: {종목코드: [FIELDS 순서 값]}}를 뽑는다.

    미래 날짜(수집 오류)는 버린다. 수급 3종이 전부 비어 있는 행도 버린다
    (없는 값을 0으로 지어내지 않는다).
    """
    today = today or datetime.datetime.now(KST).strftime("%Y-%m-%d")
    out = {}
    for code, stock in (raw.get("stocks") or {}).items():
        info = (stock or {}).get("info") or {}
        trends = info.get("dealTrends") or []
        shares = estimate_shares(info.get("totalInfos"))
        for row in trends:
            date = bizdate_to_date(row.get("bizdate"))
            if not date or date > today:
                continue
            frgn = parse_qty(row.get("foreignerPureBuyQuant"))
            org = parse_qty(row.get("organPureBuyQuant"))
            indi = parse_qty(row.get("individualPureBuyQuant"))
            if frgn is None and org is None and indi is None:
                continue
            close = parse_qty(row.get("closePrice"))
            vol = parse_qty(row.get("accumulatedTradingVolume"))
            mcap = (round(shares * close / 1e8) if shares and close else None)
            out.setdefault(date, {})[str(code)] = [frgn, org, indi, vol, close, mcap]
    return out


# ── 저장소 ──────────────────────────────────────────────────────────────────
def month_of(date):
    return date[:7]


def load_store(out_dir):
    """flow_history/ 안의 월별 샤드를 {월: 샤드dict}로 읽는다."""
    store = {}
    if not os.path.isdir(out_dir):
        return store
    for name in sorted(os.listdir(out_dir)):
        m = re.fullmatch(r"(\d{4}-\d{2})\.json", name)
        if not m:
            continue
        with open(os.path.join(out_dir, name), encoding="utf-8") as f:
            store[m.group(1)] = json.load(f)
    return store


def snapshot(store):
    """APPEND-ONLY 검사용 (월, 날짜, 종목) → 값 스냅샷."""
    snap = {}
    for month, shard in (store or {}).items():
        for date, codes in (shard.get("days") or {}).items():
            for code, row in codes.items():
                snap[(month, date, code)] = json.dumps(row, ensure_ascii=False)
    return snap


def verify_append_only(before, after):
    """지워지거나 값이 바뀐 기록 목록을 돌려준다. 빈 리스트면 규칙 준수."""
    violations = []
    for key, old in before.items():
        new = after.get(key)
        if new is None:
            violations.append({"key": key, "kind": "DELETED"})
        elif new != old:
            violations.append({"key": key, "kind": "CHANGED"})
    return violations


def merge(store, rows, recorded_at):
    """rows를 store에 APPEND-ONLY로 합친다. (추가건수, 충돌건수)를 돌려준다.

    같은 (날짜, 종목)이 다시 들어오면 **무시**한다. dealTrends의 과거 행은 이미
    확정된 값이라 다시 받아도 같아야 하고, 다르다면 원천 쪽 문제이므로 먼저 기록한
    값을 지키고 충돌만 보고한다(조용한 덮어쓰기가 제일 위험하다).
    """
    added = conflicts = 0
    for date in sorted(rows):
        month = month_of(date)
        shard = store.setdefault(month, {"schemaVersion": SCHEMA_VERSION,
                                         "month": month, "fields": list(FIELDS),
                                         "days": {}, "recordedAt": {}})
        shard.setdefault("days", {})
        shard.setdefault("recordedAt", {})
        day = shard["days"].setdefault(date, {})
        first_time = not day
        for code in sorted(rows[date]):
            new = rows[date][code]
            if code in day:
                if day[code] != new:
                    conflicts += 1
                continue                      # 이미 있는 기록은 절대 덮어쓰지 않는다
            day[code] = new
            added += 1
        if first_time or date not in shard["recordedAt"]:
            # 이 날짜를 처음 기록한 시각(추적용). 이후 실행에서 바뀌지 않는다.
            shard["recordedAt"][date] = recorded_at
    return added, conflicts


def write_store(store, out_dir, changed_months=None):
    """월별 샤드 + manifest를 쓴다. 변경된 달만 다시 쓴다(불필요한 git 변경 방지)."""
    os.makedirs(out_dir, exist_ok=True)
    for month in sorted(store):
        if changed_months is not None and month not in changed_months:
            continue
        shard = store[month]
        shard["schemaVersion"] = SCHEMA_VERSION
        shard["month"] = month
        shard["fields"] = list(FIELDS)
        shard["days"] = {d: shard["days"][d] for d in sorted(shard["days"])}
        path = os.path.join(out_dir, f"{month}.json")
        blob = json.dumps(shard, ensure_ascii=False, separators=(",", ":"))
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(blob + "\n")
        os.replace(tmp, path)
        if len(blob) > SHARD_WARN_BYTES:
            print(f"[경고] {month}.json 이 {len(blob)/1048576:.1f}MB 입니다 "
                  f"— 샤드 단위를 더 잘게 나눌 때가 됐는지 확인하세요.")

    months = []
    for month in sorted(store):
        days = store[month].get("days") or {}
        months.append({"month": month, "file": f"{month}.json",
                       "days": len(days),
                       "start": min(days) if days else None,
                       "end": max(days) if days else None,
                       "rows": sum(len(v) for v in days.values())})
    all_dates = sorted(d for m in store for d in (store[m].get("days") or {}))
    manifest = {
        "schemaVersion": SCHEMA_VERSION,
        # 내용이 실제로 바뀐 시각만 찍는다. 매 사이클 시각만 갱신하면 30분마다
        # 의미 없는 커밋이 하나씩 쌓인다.
        "updatedAt": datetime.datetime.now(KST).strftime("%Y-%m-%d %H:%M"),
        "fields": list(FIELDS),
        "source": "analysis_data.json · stocks[code].info.dealTrends (네이버 통합 API)",
        "policy": "APPEND-ONLY · 기록된 (날짜, 종목)은 덮어쓰지도 지우지도 않는다",
        "note": "FLOW 원본 축적용 자료. 화면·점수 계산에는 쓰이지 않는다.",
        "totalDays": len(all_dates),
        "start": all_dates[0] if all_dates else None,
        "end": all_dates[-1] if all_dates else None,
        "months": months,
    }
    path = os.path.join(out_dir, "index.json")
    old = {}
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                old = json.load(f)
        except Exception:
            old = {}
    same = {k: v for k, v in old.items() if k != "updatedAt"} == \
           {k: v for k, v in manifest.items() if k != "updatedAt"}
    if not same:
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            f.write(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n")
        os.replace(tmp, path)
    return manifest


# ── 실행 ────────────────────────────────────────────────────────────────────
def run(data_path, out_dir, today=None):
    try:
        with open(data_path, encoding="utf-8") as f:
            raw = json.load(f)
    except Exception as e:
        print(f"[중단] {os.path.basename(data_path)} 을 읽지 못했습니다: {e}")
        return 1

    rows = extract_rows(raw, today=today)
    if not rows:
        print("[중단] 수급 원본(dealTrends)이 하나도 없습니다. 기존 기록은 그대로 둡니다.")
        return 1

    store = load_store(out_dir)
    before = snapshot(store)
    known_months = set(store)
    recorded_at = datetime.datetime.now(KST).isoformat(timespec="seconds")
    added, conflicts = merge(store, rows, recorded_at)
    violations = verify_append_only(before, snapshot(store))
    if violations:
        print(f"[중단] APPEND-ONLY 위반 {len(violations)}건 — 아무것도 쓰지 않습니다: "
              f"{violations[:3]}")
        return 1

    touched = {month_of(d) for d in rows} | (set(store) - known_months)
    manifest = write_store(store, out_dir, changed_months=touched)
    print(f"flow_history 갱신 — 신규 {added}건 · 중복 무시 {len(rows)}일치 · "
          f"충돌 {conflicts}건 · 총 {manifest['totalDays']}일"
          f"({manifest['start']}~{manifest['end']}) · 샤드 {len(manifest['months'])}개")
    if conflicts:
        print(f"[경고] 이미 기록된 값과 다른 원본 {conflicts}건 — 먼저 기록한 값을 유지했습니다.")
    return 0


def main():
    ap = argparse.ArgumentParser(description="종목별 일별 수급 영구 기록(APPEND-ONLY)")
    ap.add_argument("--data", default=os.path.join(HERE, "analysis_data.json"))
    ap.add_argument("--out", default=os.path.join(HERE, "flow_history"))
    args = ap.parse_args()
    sys.exit(run(args.data, args.out))


if __name__ == "__main__":
    main()
