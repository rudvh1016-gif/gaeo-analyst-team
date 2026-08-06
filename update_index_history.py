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
    """지수 일봉을 [{date,open,high,low,close,volume}]로 반환(오래된 순).

    ⭐ 2026-08-06 실측 확인: 종목용 siseJson에 symbol=KOSPI/KOSDAQ을 그대로 넣는 방식이
    실제 러너에서 정상 동작했다(첫 수집 12거래일, OHLCV 모두 포함).
    ⚠️ 2026-08-06 밤 추가 확인(버그): 그런데 14개월 백필(start를 훨씬 과거로) 요청을 다시
    보내도 siseJson이 지수 심볼(symbol=KOSPI/KOSDAQ)에 대해서는 매번 "최근 ~12거래일"만
    돌려주고 startTime을 사실상 무시한다 — 종목 코드로는 10개월치가 정상적으로 오는 것과
    대조적이다(collect_analyst_data.py 참고). 그래서 "첫 소스가 비어있지 않으면 그걸로 끝"
    방식이면 m.stock 폴백을 아예 시도조차 안 하게 되고, 결과적으로 계속 12일에 머문다.
    지금은 두 소스를 모두 시도해 날짜 기준으로 합집합 병합한다 — 한쪽이 더 넓은 범위를
    돌려주면(둘 중 하나라도 진짜 과거까지 열려 있다면) 그만큼 이득을 보고, 둘 다 최근
    구간만 준다면 예전과 동일하게 동작한다(손해 없음). 둘 다 완전히 실패하면 예외를 올려
    main()이 그 지수만 건너뛴다(다른 지수·나머지 파이프라인은 계속 진행)."""
    merged = {}
    sources_used = []
    errors = []
    for fetch in (_fetch_via_sisejson, _fetch_via_mstock):
        try:
            rows = fetch(symbol, start, end)
        except Exception as e:
            errors.append(f"{fetch.__name__}={type(e).__name__}: {e}")
            continue
        if not rows:
            errors.append(f"{fetch.__name__}=0건")
            continue
        sources_used.append(f"{fetch.__name__} {len(rows)}건")
        for r in rows:
            d = r.get("date")
            if not d:
                continue
            # 두 소스가 같은 날짜를 다르게 주면, OHLCV 필드가 더 많이 채워진 쪽을 남긴다.
            if d not in merged or len(r) > len(merged[d]):
                merged[d] = r
    if not merged:
        raise RuntimeError("모든 수집 경로 실패 — " + " | ".join(errors))
    out = sorted(merged.values(), key=lambda e: e["date"])
    print(f"    · {symbol}: {' + '.join(sources_used)} → 고유 거래일 병합 {len(out)}건"
          + (f" (일부 실패: {errors})" if errors else ""))
    return out


def _num(x):
    """'6,274.68' 같은 문자열을 숫자로. 실패하면 None."""
    if x is None:
        return None
    try:
        return float(str(x).replace(",", "").strip())
    except (ValueError, AttributeError):
        return None


def _fetch_via_mstock(symbol, start, end):
    """m.stock 지수 일별시세 API. collect_analyst_data.py가 쓰는 /api/index/{symbol}/basic의
    형제 엔드포인트로, 최신 거래일부터 역순 페이지로 내려온다.

    ⭐ 2026-08-06 밤: 요청 범위가 넓은(14개월 백필) 경우엔 예전 6페이지(≈15일) 상한으로는
    애초에 도달할 수 없으니, 요청 범위가 넓을 때만 상한을 30페이지(최대 300건)로 늘린다.
    평소 짧은 창(최근 15일 증분 수집)은 그대로 6페이지만 써서 매 사이클 부담을 안 늘린다."""
    start_d, end_d = str(start), str(end)
    try:
        span_days = (datetime.datetime.strptime(end_d, "%Y%m%d").date()
                     - datetime.datetime.strptime(start_d, "%Y%m%d").date()).days
    except ValueError:
        span_days = 0
    max_page = 30 if span_days > 40 else 6
    out, page = [], 1
    while page <= max_page:
        url = f"https://m.stock.naver.com/api/index/{symbol}/price?pageSize=10&page={page}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0", "Referer": "https://m.stock.naver.com"})
        with urllib.request.urlopen(req, timeout=10) as r:
            rows = json.loads(r.read().decode("utf-8", "replace"))
        if not isinstance(rows, list) or not rows:
            break
        stop = False
        for row in rows:
            date_raw = str(row.get("localTradedAt") or "")[:10]
            if not re.match(r"^\d{4}-\d{2}-\d{2}$", date_raw):
                continue
            compact = date_raw.replace("-", "")
            if compact < start_d:      # 요청 범위보다 과거로 넘어가면 그만 받는다
                stop = True
                continue
            if compact > end_d:
                continue
            close = _num(row.get("closePrice"))
            if close is None:
                continue
            entry = {"date": date_raw, "close": close}
            for key, field in (("open", "openPrice"), ("high", "highPrice"),
                               ("low", "lowPrice"), ("volume", "accumulatedTradingVolume")):
                val = _num(row.get(field))
                if val is not None:
                    entry[key] = val
            out.append(entry)
        if stop:
            break
        page += 1
    out.sort(key=lambda e: e["date"])
    return out


def _fetch_via_sisejson(symbol, start, end):
    """종목과 같은 siseJson 엔드포인트(폴백). 지수 심볼을 받아주면 이쪽으로도 수집된다."""
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
        if not re.match(r"^\d{8}$", d):
            continue
        entry = {"date": f"{d[0:4]}-{d[4:6]}-{d[6:8]}", "close": row[4]}
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


# 이력이 이 일수보다 짧으면 "아직 백필이 안 된 상태"로 보고 넓은 창으로 한 번에 받아온다.
BACKFILL_THRESHOLD_DAYS = 210      # MA200까지 정식으로 뜨려면 200거래일이 필요
BACKFILL_MONTHS = 14               # 한국 증시 연 ~245거래일 기준, 14개월이면 200거래일을 넉넉히 덮는다


def main():
    manual = len(sys.argv) >= 3
    today = datetime.date.today()
    end = sys.argv[2] if manual else today.strftime("%Y%m%d")
    default_start = (today - datetime.timedelta(days=15)).strftime("%Y%m%d")
    backfill_start = (today - datetime.timedelta(days=BACKFILL_MONTHS * 31)).strftime("%Y%m%d")

    path = os.path.join(HERE, "index_history.js")
    store = load_js_object(path, "INDEX_HISTORY") or {}

    added_total = 0
    failed = []
    for name, symbol in INDEX_SYMBOLS.items():
        have = sum(len(p["days"]) for p in store.get(name, []))
        # ⭐ 첫 수집 직후엔 15일 창이라 12거래일뿐이라, 이대로 두면 MA200이 정식이 되기까지
        # 1년 가까이 걸린다. 쌓인 게 적을 때만 넓은 창으로 한 번 백필하고, 이미 충분히
        # 쌓였으면 평소대로 짧은 창만 받아 매 사이클 부담을 최소화한다.
        if manual:
            start = sys.argv[1]
        elif have < BACKFILL_THRESHOLD_DAYS:
            start = backfill_start
            print(f"  {name}: 보유 {have}거래일 < {BACKFILL_THRESHOLD_DAYS} → {BACKFILL_MONTHS}개월 백필 시도")
        else:
            start = default_start
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
