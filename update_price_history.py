#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 종목별 일별 종가 기록(페이지 단위)
history.js(팀 판단 히스토리)와는 별개로, 순수 "그날 종가"만 쌓는 기록이다.
5거래일마다 1페이지로 묶고, 페이지가 5일 차면 그 페이지는 잠그고 다음 페이지로 넘어간다
(무한 롤링/삭제 없음 — 페이지가 계속 늘어난다).

저장 파일: price_history.js (PRICE_HISTORY)
실행: python3 update_price_history.py [YYYYMMDD 시작] [YYYYMMDD 끝]
  인자 없이 실행하면 최근 15일(주말 포함) 범위를 조회해 아직 기록에 없는
  거래일만 새로 추가한다 — 매일 실행해도 안전(중복 저장 안 됨).
"""
import json, re, os, sys, urllib.request, datetime, ast

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE_SIZE = 5

def load_js_object(path, varname):
    if not os.path.exists(path):
        return None
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None

def load_tickers():
    p = os.path.join(HERE, "tickers.js")
    try:
        t = re.sub(r"^\s*//.*$", "", open(p, encoding="utf-8").read(), flags=re.M)
        arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
        return {d["code"]: d["name"] for d in arr}
    except Exception as e:
        print(f"[경고] tickers.js 로드 실패: {e}")
        return {}

def fetch_daily_closes(code, start, end):
    """네이버 siseJson으로 일봉 종가를 [{date,close}] 리스트로 반환(오래된 순)."""
    url = (f"https://api.finance.naver.com/siseJson.naver?symbol={code}"
           f"&requestType=1&startTime={start}&endTime={end}&timeframe=day")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        raw = r.read().decode("utf-8")
    # 이 엔드포인트는 JSON이 아니라 파이썬 리스트 리터럴 형태(헤더가 작은따옴표)로 응답한다.
    rows = ast.literal_eval(raw.strip())
    out = []
    for row in rows[1:]:  # 첫 행은 헤더
        if not row or not row[0]:
            continue
        d = str(row[0])
        date_str = f"{d[0:4]}-{d[4:6]}-{d[6:8]}"
        out.append({"date": date_str, "close": row[4]})
    return out

def add_to_pages(pages, new_entries):
    """new_entries(날짜 오름차순)를 페이지에 병합.
    이미 있는 날짜는 종가를 최신 값으로 갱신한다 — 장중(10분 주기) 실행이 기록한
    중간 가격이 마감 후 실행에서 진짜 종가로 확정되도록 (과거엔 그날 첫 실행의
    장중가가 종가로 영구 고정되는 버그가 있었다)."""
    existing = {}
    for p in pages:
        for d in p["days"]:
            existing[d["date"]] = d
    for e in new_entries:
        if e["date"] in existing:
            existing[e["date"]]["close"] = e["close"]   # 같은 날짜 → 값 갱신
            continue
        if not pages or len(pages[-1]["days"]) >= PAGE_SIZE:
            pages.append({"page": len(pages) + 1, "days": []})
        pages[-1]["days"].append(e)
        existing[e["date"]] = pages[-1]["days"][-1]
    for p in pages:
        if p["days"]:
            p["start"] = p["days"][0]["date"]
            p["end"] = p["days"][-1]["date"]
    return pages

def main():
    codes = load_tickers()
    if not codes:
        print("tickers.js를 읽지 못해 중단합니다."); sys.exit(1)

    if len(sys.argv) >= 3:
        start, end = sys.argv[1], sys.argv[2]
    else:
        today = datetime.date.today()
        start = (today - datetime.timedelta(days=15)).strftime("%Y%m%d")
        end = today.strftime("%Y%m%d")

    path = os.path.join(HERE, "price_history.js")
    store = load_js_object(path, "PRICE_HISTORY") or {}

    added_total = 0
    for code, name in codes.items():
        try:
            entries = fetch_daily_closes(code, start, end)
        except Exception as e:
            print(f"[실패] {name}({code}): {e}")
            continue
        pages = store.get(code, [])
        before = sum(len(p["days"]) for p in pages)
        pages = add_to_pages(pages, entries)
        store[code] = pages
        after = sum(len(p["days"]) for p in pages)
        added = after - before
        added_total += added
        print(f"[OK] {name}({code}) — 신규 {added}일 (총 {after}일 / {len(pages)}페이지)")

    out = ("// 자동 생성: update_price_history.py · 종목별 일별 종가 (5거래일 = 1페이지)\n"
           "// 페이지가 5일 차면 잠기고 다음 페이지가 새로 열린다. 삭제·롤링 없음.\n"
           "const PRICE_HISTORY = " + json.dumps(store, ensure_ascii=False, indent=1) + ";\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\nprice_history.js 갱신 완료 — 총 신규 {added_total}건 → {path}")

if __name__ == "__main__":
    main()
