#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 국내 상장사 이름↔코드 목록 수집 (GitHub Actions용)
관리자 모드 [종목관리]의 '이름으로 검색해서 추가' 자동완성이 이 목록을 쓴다.
KRX 상장법인목록 다운로드(HTML 표, EUC-KR)를 파싱해 krx_list.json으로 저장.
실행: python3 fetch_krx_list.py  →  krx_list.json ({"updated","items":[{"c","n","m"}]})
"""
import json, re, os, sys, datetime, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"


def fetch(market_type):
    url = f"https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&marketType={market_type}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("euc-kr", "replace")


def parse(html, market):
    """다운로드 응답은 <tr><td>회사명</td><td>종목코드</td>… 형태의 HTML 표."""
    items = []
    for tr in re.finditer(r"<tr[^>]*>(.*?)</tr>", html, re.S):
        tds = [re.sub(r"<[^>]+>", "", t).strip() for t in re.findall(r"<td[^>]*>(.*?)</td>", tr.group(1), re.S)]
        if len(tds) >= 2 and re.match(r"^\d{6}$", tds[1]):
            items.append({"c": tds[1], "n": tds[0], "m": market})
    return items


def main():
    items = []
    for mt, label in (("stockMkt", "KOSPI"), ("kosdaqMkt", "KOSDAQ")):
        try:
            items += parse(fetch(mt), label)
        except Exception as e:
            print(f"[실패] {label}: {e}")
    if len(items) < 500:   # 정상이면 2,000개 이상 — 너무 적으면 기존 파일 보존
        print(f"수집 {len(items)}건 — 비정상으로 판단, 저장 생략")
        sys.exit(0)
    out = {"updated": datetime.date.today().isoformat(), "items": items}
    with open(os.path.join(HERE, "krx_list.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    print(f"krx_list.json 저장 완료 — {len(items)}개 상장사")


if __name__ == "__main__":
    main()
