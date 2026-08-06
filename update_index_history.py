#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 코스피·코스닥 지수 일별 이력(페이지 단위)

update_price_history.py(종목별)와 완전히 같은 구조를, 지수 2개(KOSPI·KOSDAQ)에 적용한다.
⭐ 2026-08-06 신설(TARO 이동평균 시스템 3단계): 이 파일이 생기기 전까지 코스피·코스닥은
"현재 값 하나"만 있고 과거 일별 기록이 전혀 없어서, 홈 화면에 지수용 이동평균·차트를
보여줄 방법이 없었다. 종목과 똑같은 siseJson 엔드포인트에 symbol=KOSPI/KOSDAQ을 넣어
호출한다 — 종목 코드 자리에 지수 심볼을 넣어도 같은 형식으로 응답하는지는 이 스크립트가
실제 러너(GitHub Actions, 네이버 접속 가능)에서 처음 실행될 때 확인된다. 혹시 이 심볼로
안 되면 아래 fetch_daily_ohlcv가 예외를 던지고, main()이 그 지수만 건너뛴 채 나머지는
정상 진행한다(한쪽이 막혀도 전체 잡이 죽지 않음).

저장 파일: index_history.js (INDEX_HISTORY)
실행: python3 update_index_history.py [YYYYMMDD 시작] [YYYYMMDD 끝]
  인자 없이 실행하면 최근 15일(주말 포함) 범위를 조회해 아직 기록에 없는
  거래일만 새로 추가한다 — 매일 실행해도 안전(중복 저장 안 됨).
"""
import json, re, os, sys, urllib.request, datetime, ast

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE_SIZE = 5
INDEX_SYMBOLS = {"KOSPI": "KOSPI", "KOSDAQ": "KOSDAQ"}


def load_js_object(path, varname):
    if not os.path.exists(path):
        return None
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    return json.loads(m.group(1)) if m else None


def fetch_daily_ohlcv(symbol, start, end):
    """update_price_history.py의 fetch_daily_closes와 동일한 방식으로 지수 심볼을 조회한다."""
    url = (f"https://api.finance.naver.com/siseJson.naver?symbol={symbol}"
           f"&requestType=1&startTime={start}&endTime={end}&timeframe=day")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        raw = r.read().decode("utf-8")
    rows = ast.literal_eval(raw.strip())
    out = []
    for row in rows[1:]:
        if not row or not row[0]:
            continue
        d = str(row[0])
        date_str = f"{d[0:4]}-{d[4:6]}-{d[6:8]}"
        entry = {"date": date_str, "close": row[4]}
        try:
            entry["open"], entry["high"], entry["low"] = row[1], row[2], row[3]
            entry["volume"] = row[5]
        except (IndexError, TypeError):
            pass
        out.append(entry)
    return out


def add_to_pages(pages, new_entries):
    """update_price_history.py의 같은 이름 함수와 동일한 로직(날짜순 재구성 후 5일=1페이지)."""
    rows = {}
    for p in pages:
        for d in p["days"]:
            rows[d["date"]] = d
    for e in new_entries:
        rows[e["date"]] = e
    days = [rows[k] for k in sorted(rows)]
    rebuilt = []
    for i in range(0, len(days), PAGE_SIZE):
        chunk = days[i:i + PAGE_SIZE]
        rebuilt.append({"page": len(rebuilt) + 1, "days": chunk,
                        "start": chunk[0]["date"], "end": chunk[-1]["date"]})
    return rebuilt


def main():
    if len(sys.argv) >= 3:
        start, end = sys.argv[1], sys.argv[2]
    else:
        today = datetime.date.today()
        start = (today - datetime.timedelta(days=15)).strftime("%Y%m%d")
        end = today.strftime("%Y%m%d")

    path = os.path.join(HERE, "index_history.js")
    store = load_js_object(path, "INDEX_HISTORY") or {}

    added_total = 0
    failed = []
    for name, symbol in INDEX_SYMBOLS.items():
        try:
            entries = fetch_daily_ohlcv(symbol, start, end)
        except Exception as e:
            print(f"[실패] {name}(symbol={symbol}): {e}")
            failed.append(name)
            continue
        if not entries:
            print(f"[경고] {name} — 조회 결과 0건(심볼이 안 맞을 수 있음)")
            failed.append(name)
            continue
        pages = store.get(name, [])
        before = sum(len(p["days"]) for p in pages)
        pages = add_to_pages(pages, entries)
        store[name] = pages
        after = sum(len(p["days"]) for p in pages)
        added = after - before
        added_total += added
        print(f"[OK] {name} — 신규 {added}일 (총 {after}일 / {len(pages)}페이지)")

    if len(failed) == len(INDEX_SYMBOLS):
        # 둘 다 실패하면 파일을 덮어쓰지 않는다(빈 값으로 기존 기록을 지우는 사고 방지).
        print("두 지수 모두 수집 실패 — index_history.js를 건드리지 않고 종료")
        sys.exit(1)

    out = ("// 자동 생성: update_index_history.py · 코스피·코스닥 일별 시가/고가/저가/종가/거래량 (5거래일 = 1페이지)\n"
           "// 페이지가 5일 차면 잠기고 다음 페이지가 새로 열린다. 삭제·롤링 없음.\n"
           "// TARO 이동평균 시스템 3단계(2026-08-06) — 홈 화면 코스피·코스닥 펼치기 패널용.\n"
           "const INDEX_HISTORY = " + json.dumps(store, ensure_ascii=False, indent=1) + ";\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\nindex_history.js 갱신 완료 — 총 신규 {added_total}건 → {path}"
          + (f" (실패: {failed})" if failed else ""))


if __name__ == "__main__":
    main()
