#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 국내 상장사 이름↔코드 목록 수집 (GitHub Actions용)
관리자 모드 [종목관리]의 '이름으로 검색해서 추가' 자동완성이 이 목록을 쓴다.

1차: 네이버 m.stock 시가총액 순위 API (페이지네이션) — 러너에서 접속 검증된 소스.
2차(폴백): KRX 상장법인목록 다운로드(kind.krx.co.kr) — 해외 IP(깃허브 러너)를
          차단하는 경우가 있어 예비용으로만 둔다 (2026-07 러너에서 0건 확인).
실행: python3 fetch_krx_list.py  →  krx_list.json ({"updated","items":[{"c","n","m"}]})
"""
import json, re, os, sys, time, datetime, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"


def get(url, referer, as_json=True, tries=3):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
            with urllib.request.urlopen(req, timeout=20) as r:
                body = r.read()
            return json.loads(body) if as_json else body
        except Exception as e:
            last = e
            if i < tries - 1:
                time.sleep(0.6 * (i + 1))
    raise last


# ── 1차: 네이버 시가총액 순위 API ────────────────────────────────────────────
def fetch_naver(market):
    """market: 'KOSPI'|'KOSDAQ'. 시총순 전 종목을 페이지 단위로 수집."""
    items, page = [], 1
    while page <= 40:                       # 안전 상한 (100개×40p = 4,000종목)
        url = f"https://m.stock.naver.com/api/stocks/marketValue/{market}?page={page}&pageSize=100"
        d = get(url, "https://m.stock.naver.com")
        rows = d.get("stocks") or []
        if not rows:
            break
        for s in rows:
            code, name = s.get("itemCode"), s.get("stockName")
            if code and name and re.match(r"^\d{6}$", str(code)):
                items.append({"c": str(code), "n": str(name).strip(), "m": market})
        total = d.get("totalCount") or 0
        if total and len(items) >= total:
            break
        page += 1
        time.sleep(0.2)
    return items


# ── 2차(폴백): KRX 상장법인목록 다운로드 ─────────────────────────────────────
def fetch_krx(market_type, market):
    url = f"https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&marketType={market_type}"
    html = get(url, "https://kind.krx.co.kr", as_json=False).decode("euc-kr", "replace")
    items = []
    for tr in re.finditer(r"<tr[^>]*>(.*?)</tr>", html, re.S):
        tds = [re.sub(r"<[^>]+>", "", t).strip() for t in re.findall(r"<td[^>]*>(.*?)</td>", tr.group(1), re.S)]
        if len(tds) >= 2 and re.match(r"^\d{6}$", tds[1]):
            items.append({"c": tds[1], "n": tds[0], "m": market})
    return items


def main():
    items = []
    for market in ("KOSPI", "KOSDAQ"):
        try:
            got = fetch_naver(market)
            print(f"[네이버] {market}: {len(got)}건")
            items += got
        except Exception as e:
            print(f"[실패] 네이버 {market}: {e}")
    if len(items) < 500:
        print("네이버 수집 부족 — KRX 폴백 시도")
        items = []
        for mt, market in (("stockMkt", "KOSPI"), ("kosdaqMkt", "KOSDAQ")):
            try:
                got = fetch_krx(mt, market)
                print(f"[KRX] {market}: {len(got)}건")
                items += got
            except Exception as e:
                print(f"[실패] KRX {market}: {e}")
    # 중복 코드 제거(먼저 나온 항목 우선)
    seen, dedup = set(), []
    for it in items:
        if it["c"] not in seen:
            seen.add(it["c"])
            dedup.append(it)
    items = dedup
    if len(items) < 500:   # 정상이면 2,000개 이상 — 너무 적으면 기존 파일 보존
        print(f"수집 {len(items)}건 — 비정상으로 판단, 저장 생략")
        sys.exit(0)
    out = {"updated": datetime.date.today().isoformat(), "items": items}
    with open(os.path.join(HERE, "krx_list.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"krx_list.json 저장 완료 — {len(items)}개 상장사")


if __name__ == "__main__":
    main()
