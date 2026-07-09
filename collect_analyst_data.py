#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 분석용 원천 데이터 일괄 수집 (GitHub Actions용)
네트워크가 제한된 원격 세션(모바일/웹 Claude Code)에서는 네이버 금융 API에
직접 접속할 수 없다. 이 스크립트를 GitHub Actions 러너(네트워크 제한 없음)에서
실행해 TARO(일봉)·DIANA(재무)·FLOW(수급) 원천 데이터를 analysis_data.json으로
저장해두면, 제한된 세션은 git pull만으로 데스크톱과 동일한 데이터를 쓸 수 있다.

수집 항목(종목별):
  · daily   — 최근 3개월 일봉 [날짜, 시가, 고가, 저가, 종가, 거래량, 외국인소진율]
  · info    — m.stock 통합 API의 totalInfos(PER/PBR/EPS/BPS/배당/52주 등)
  · consensus — 통합 API의 컨센서스(목표주가/투자의견) 있으면
  · flow    — frgn 페이지 파싱: 최근 거래일별 기관/외국인 순매매·보유율
실행: python3 collect_analyst_data.py  →  analysis_data.json
"""
import json, re, os, sys, time, datetime, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"


def load_tickers():
    t = re.sub(r"^\s*//.*$", "", open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read(), flags=re.M)
    arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", t, re.S).group(1))
    return {d["code"]: d["name"] for d in arr}


def get(url, referer="https://finance.naver.com", tries=3, as_json=True):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": referer})
            with urllib.request.urlopen(req, timeout=15) as r:
                body = r.read().decode("utf-8", "replace")
            return json.loads(body) if as_json else body
        except Exception as e:
            last = e
            if i < tries - 1:
                time.sleep(0.6 * (i + 1))
    raise last


def fetch_daily(code, months=3):
    end = datetime.date.today()
    start = end - datetime.timedelta(days=months * 31)
    url = (f"https://api.finance.naver.com/siseJson.naver?symbol={code}"
           f"&requestType=1&startTime={start.strftime('%Y%m%d')}&endTime={end.strftime('%Y%m%d')}&timeframe=day")
    body = get(url, as_json=False)
    # siseJson은 유사 JSON(작은따옴표) — 행 단위로 안전 파싱
    rows = []
    for m in re.finditer(r"\[([^\[\]]+)\]", body):
        cells = [c.strip().strip("'\"") for c in m.group(1).split(",")]
        if not cells or not re.match(r"^\d{8}$", cells[0]):
            continue  # 헤더 행 등 스킵
        try:
            rows.append({
                "date": f"{cells[0][:4]}-{cells[0][4:6]}-{cells[0][6:]}",
                "open": int(cells[1]), "high": int(cells[2]), "low": int(cells[3]),
                "close": int(cells[4]), "volume": int(cells[5]),
                "frgnRate": float(cells[6]) if len(cells) > 6 and cells[6] else None,
            })
        except (ValueError, IndexError):
            continue
    return rows


def fetch_integration(code):
    d = get(f"https://m.stock.naver.com/api/stock/{code}/integration", "https://m.stock.naver.com")
    out = {"totalInfos": {i["code"]: i.get("value") for i in d.get("totalInfos", [])}}
    if d.get("consensusInfo"):
        out["consensus"] = d["consensusInfo"]
    if d.get("dealTrendInfos"):
        out["dealTrends"] = d["dealTrendInfos"][:10]
    return out


def fetch_flow(code, pages=2):
    """frgn.naver 표 파싱 → [{date, close, inst, frgn, holdQty, holdRate}] 최신순."""
    rows = []
    for p in range(1, pages + 1):
        html = get(f"https://finance.naver.com/item/frgn.naver?code={code}&page={p}", as_json=False)
        for tr in re.finditer(r"<tr[^>]*onmouseover[^>]*>(.*?)</tr>", html, re.S):
            tds = re.findall(r"<td[^>]*>(.*?)</td>", tr.group(1), re.S)
            txt = [re.sub(r"<[^>]+>", "", t).strip().replace(",", "").replace("&nbsp;", "") for t in tds]
            if len(txt) < 9 or not re.match(r"^\d{4}\.\d{2}\.\d{2}$", txt[0]):
                continue
            try:
                rows.append({
                    "date": txt[0].replace(".", "-"),
                    "close": int(txt[1]),
                    "inst": int(txt[5].replace("+", "")),
                    "frgn": int(txt[6].replace("+", "")),
                    "holdQty": int(txt[7]),
                    "holdRate": float(txt[8].replace("%", "")),
                })
            except (ValueError, IndexError):
                continue
    return rows


def fetch_indices():
    out = {}
    for idx in ("KOSPI", "KOSDAQ"):
        try:
            d = get(f"https://m.stock.naver.com/api/index/{idx}/basic", "https://m.stock.naver.com")
            out[idx] = {
                "value": float(str(d.get("closePrice", "")).replace(",", "")),
                "change": float(str(d.get("compareToPreviousClosePrice", "0")).replace(",", "")),
                "rate": float(str(d.get("fluctuationsRatio", "0")).replace(",", "")),
            }
        except Exception as e:
            print(f"[경고] {idx} 지수 수집 실패: {e}")
    return out


def main():
    codes = load_tickers()
    now = datetime.datetime.now()
    data = {"fetchedAt": now.strftime("%Y-%m-%d %H:%M"), "indices": fetch_indices(), "stocks": {}}
    fail = []
    for code, name in codes.items():
        entry = {"name": name}
        for key, fn in (("daily", fetch_daily), ("info", fetch_integration), ("flow", fetch_flow)):
            try:
                entry[key] = fn(code)
            except Exception as e:
                print(f"[실패] {name}({code}) {key}: {e}")
                entry[key] = None
                fail.append(f"{name}:{key}")
        data["stocks"][code] = entry
        d = entry.get("daily") or []
        print(f"[OK] {name}({code}) 일봉 {len(d)}건, 수급 {len(entry.get('flow') or [])}건")
    with open(os.path.join(HERE, "analysis_data.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"\nanalysis_data.json 저장 완료 ({data['fetchedAt']})" + (f" · 실패: {fail}" if fail else ""))
    sys.exit(1 if len(fail) >= len(codes) * 3 else 0)


if __name__ == "__main__":
    main()
