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
    """네이버 siseJson으로 일봉 시가·고가·저가·종가·거래량을 [{date,open,high,low,close,volume}]
    리스트로 반환(오래된 순). ⭐ 2026-08-06: 캔들차트(4단계)를 위해 종가뿐 아니라 OHLV를 다
    저장하도록 확장 — 필드명은 하위호환을 위해 'close'를 유지하고 open/high/low/volume을
    추가한다(기존에 종가만 쌓인 옛날 페이지는 이 필드들이 없을 수 있고, 화면은 그런 날을
    "캔들 없이 종가 선"으로 대체 표시한다 — 절대 없는 값을 지어내지 않는다)."""
    url = (f"https://api.finance.naver.com/siseJson.naver?symbol={code}"
           f"&requestType=1&startTime={start}&endTime={end}&timeframe=day")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=10) as r:
        raw = r.read().decode("utf-8")
    # 이 엔드포인트는 JSON이 아니라 파이썬 리스트 리터럴 형태(헤더가 작은따옴표)로 응답한다.
    rows = ast.literal_eval(raw.strip())
    out = []
    for row in rows[1:]:  # 첫 행은 헤더: [날짜,시가,고가,저가,종가,거래량]
        if not row or not row[0]:
            continue
        d = str(row[0])
        date_str = f"{d[0:4]}-{d[4:6]}-{d[6:8]}"
        entry = {"date": date_str, "close": row[4]}
        try:
            entry["open"], entry["high"], entry["low"] = row[1], row[2], row[3]
            entry["volume"] = row[5]
        except (IndexError, TypeError):
            pass   # OHLV가 없어도 close는 있으니 그대로 저장(구버전 응답 대비 방어)
        out.append(entry)
    return out

def add_to_pages(pages, new_entries):
    """new_entries를 병합한 뒤 전체를 날짜순으로 재구성해 5일 단위 페이지로 다시 자른다.
    이미 있는 날짜는 종가를 최신 값으로 갱신한다 — 장중(10분 주기) 실행이 기록한
    중간 가격이 마감 후 실행에서 진짜 종가로 확정되도록 (과거엔 그날 첫 실행의
    장중가가 종가로 영구 고정되는 버그가 있었다).
    ⚠️ 재구성 이유: 예전 방식(새 날짜를 마지막 페이지 뒤에 append)은 신규 종목의
    과거 데이터를 뒤늦게 받아오면(백필) 과거 날짜가 최신 날짜 뒤에 붙어 페이지
    순서·전일비 계산이 꼬였다(실제 8종목 발생). 매번 정렬 재구성하면 항상 시간순이
    보장되고, 이미 꼬인 기존 데이터도 다음 실행 때 자동 복구된다."""
    rows = {}
    for p in pages:
        for d in p["days"]:
            rows[d["date"]] = d
    for e in new_entries:
        rows[e["date"]] = e   # 같은 날짜 → 통째로 갱신(장중가였던 값이 마감 후 확정치로 바뀜)
    days = [rows[k] for k in sorted(rows)]
    rebuilt = []
    for i in range(0, len(days), PAGE_SIZE):
        chunk = days[i:i + PAGE_SIZE]
        rebuilt.append({"page": len(rebuilt) + 1, "days": chunk,
                        "start": chunk[0]["date"], "end": chunk[-1]["date"]})
    return rebuilt

# 이력이 이 일수보다 짧으면 "아직 백필이 안 된 상태"로 보고 넓은 창으로 한 번에 받아온다.
# update_index_history.py와 동일한 값 — 한국 증시 연 ~245거래일 기준, 14개월이면
# MA200에 필요한 200거래일을 넉넉히 덮는다.
BACKFILL_THRESHOLD_DAYS = 210
BACKFILL_MONTHS = 14

def main():
    codes = load_tickers()
    if not codes:
        print("tickers.js를 읽지 못해 중단합니다."); sys.exit(1)

    manual = len(sys.argv) >= 3
    today = datetime.date.today()
    end = sys.argv[2] if manual else today.strftime("%Y%m%d")
    default_start = (today - datetime.timedelta(days=15)).strftime("%Y%m%d")
    backfill_start = (today - datetime.timedelta(days=BACKFILL_MONTHS * 31)).strftime("%Y%m%d")

    path = os.path.join(HERE, "price_history.js")
    store = load_js_object(path, "PRICE_HISTORY") or {}

    added_total = 0
    for code, name in codes.items():
        pages = store.get(code, [])
        have = sum(len(p["days"]) for p in pages)
        # ⭐ 2026-08-07: 이 기록은 2026-06-24에야 신설돼 종목마다 30여 거래일치뿐이었다 —
        # 60·120·200일 이동평균선을 그리려면 최소 200거래일이 필요한데 한참 못 미쳤다
        # ("가격 흐름" 차트에 200일선까지 못 그리던 진짜 원인 — 코드 버그가 아니라 원본
        # 기록 자체가 짧았다). index_history.py와 같은 패턴: 아직 못 쌓인 종목만 넓은
        # 창으로 한 번에 따라잡고, 이미 충분한 종목은 평소대로 저렴한 증분만 받는다.
        # (siseJson의 넓은 백필 무시 버그는 지수 심볼 한정이라 — update_index_history.py
        #  주석 참고 — 종목 코드는 이 단일 소스만으로도 정상 동작한다.)
        if manual:
            start = sys.argv[1]
        elif have < BACKFILL_THRESHOLD_DAYS:
            start = backfill_start
        else:
            start = default_start
        try:
            entries = fetch_daily_closes(code, start, end)
        except Exception as e:
            print(f"[실패] {name}({code}): {e}")
            continue
        before = have
        pages = add_to_pages(pages, entries)
        store[code] = pages
        after = sum(len(p["days"]) for p in pages)
        added = after - before
        added_total += added
        print(f"[OK] {name}({code}) — 신규 {added}일 (총 {after}일 / {len(pages)}페이지)")

    out = ("// 자동 생성: update_price_history.py · 종목별 일별 시가/고가/저가/종가/거래량 (5거래일 = 1페이지)\n"
           "// 페이지가 5일 차면 잠기고 다음 페이지가 새로 열린다. 삭제·롤링 없음.\n"
           "// ⭐ 2026-08-06부터 OHLV 저장(그 전 날짜는 close만 있을 수 있음 — 캔들차트가 자동 구분해 표시).\n"
           "const PRICE_HISTORY = " + json.dumps(store, ensure_ascii=False, indent=1) + ";\n")
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\nprice_history.js 갱신 완료 — 총 신규 {added_total}건 → {path}")

if __name__ == "__main__":
    main()
