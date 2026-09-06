#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오(Gaeo) 애널리스트팀 — 시세 자동갱신 스크립트
네이버 금융 API에서 대상 종목(tickers.js)의 현재가/PER/PBR/ROE와
코스피/코스닥 지수를 받아 data.js로 저장한다.
index.html이 data.js를 읽어 화면의 모든 시세를 갱신한다.
운영 환경에서는 GitHub Actions가 주기적으로 실행한다.

견고성(6순위 A):
  · 요청 실패 시 백오프 재시도(기본 3회)
  · 종목별 수집 실패 시 data.js의 이전 값을 유지하고 stale=True로 표시(화면에 '시세 지연' 배지)
  · 신규 수집이 0건이면 data.js를 건드리지 않는다(기존 타임스탬프/값 보존)
"""
import json, urllib.request, datetime, os, sys, time, re

from krx_calendar import is_krx_trading_day

# 종목 목록은 tickers.js(TICKERS)에서 읽는다. 아래는 그 파일을 못 읽을 때의 안전망.
FALLBACK_CODES = {
    '080220': '제주반도체',
    '005930': '삼성전자',
    '000660': 'SK하이닉스',
    '402340': 'SK스퀘어',
    '009150': '삼성전기',
    '009155': '삼성전기우',
    '011070': 'LG이노텍',
}

def load_tickers(here):
    """tickers.js의 TICKERS 배열을 읽어 {코드: 이름} 딕셔너리로 반환(실패 시 FALLBACK)."""
    p = os.path.join(here, 'tickers.js')
    try:
        t = re.sub(r'^\s*//.*$', '', open(p, encoding='utf-8').read(), flags=re.M)
        m = re.search(r'const\s+TICKERS\s*=\s*(\[.*?\])\s*;', t, re.S)
        arr = json.loads(m.group(1))
        codes = {d['code']: d['name'] for d in arr}
        return codes or FALLBACK_CODES
    except Exception as e:
        print(f'[경고] tickers.js 로드 실패 — 내장 목록 사용: {e}')
        return FALLBACK_CODES

def build_market_brief(data, here):
    """홈 화면의 10분 숫자 브리핑을 data.js 안에 함께 넣는다."""
    try:
        text = re.sub(r'^\s*//.*$', '', open(os.path.join(here, 'tickers.js'), encoding='utf-8').read(), flags=re.M)
        rows = json.loads(re.search(r'const\s+TICKERS\s*=\s*(\[.*?\])\s*;', text, re.S).group(1))
        sectors = {row['code']: row.get('sector') or '기타' for row in rows}
    except Exception:
        sectors = {}
    stocks = data.get('stocks', {})
    rated = [row for row in stocks.values() if isinstance(row.get('rate'), (int, float))]
    up = sum(row['rate'] > 0 for row in rated)
    down = sum(row['rate'] < 0 for row in rated)
    flat = len(rated) - up - down
    groups = {}
    for code, row in stocks.items():
        rate = row.get('rate')
        if isinstance(rate, (int, float)):
            groups.setdefault(sectors.get(code, '기타'), []).append(float(rate))
    sector_rows = sorted(
        ({'name': name, 'rate': round(sum(values) / len(values), 2), 'count': len(values)}
         for name, values in groups.items() if len(values) >= 3),
        key=lambda row: row['rate'], reverse=True)
    strong = sector_rows[0] if sector_rows else None
    weak = sector_rows[-1] if sector_rows else None
    rate_text = lambda value: f'{value:+.2f}%' if isinstance(value, (int, float)) else '—'
    indices = data.get('indices', {})
    # ⭐ 2026-08-14 사용자 지정 — "업종" 줄이 애매하게 2줄로 넘어가던 걸, 업종 상승·하락
    # 개수까지 더해 문장을 늘려 두세줄로 자연스럽게 채운다(index.html의 summaryFromLive
    # 폴백과 같은 문구 규칙).
    sector_up = sum(1 for row in sector_rows if row['rate'] >= 0)
    sector_down = len(sector_rows) - sector_up
    sector_line = (f"집계된 {len(sector_rows)}개 업종 중 {sector_up}개는 오르고 {sector_down}개는 내렸어요. "
                   f"가장 강한 업종은 {strong['name']}({rate_text(strong['rate'])})이고, "
                   f"가장 약한 업종은 {weak['name']}({rate_text(weak['rate'])})이에요."
                   if strong and weak else '업종 흐름을 집계하고 있어요.')
    return {
        'sourceAsOf': data.get('date', ''),
        'breadth': {'total': len(rated), 'up': up, 'down': down, 'flat': flat},
        'sectors': {'strong': strong, 'weak': weak},
        'lines': [
            f"코스피 {rate_text(indices.get('KOSPI', {}).get('rate'))}, "
            f"코스닥 {rate_text(indices.get('KOSDAQ', {}).get('rate'))}로 움직이고 있어요.",
            f"{len(rated)}종목 중 상승 {up}개 · 하락 {down}개 · 보합 {flat}개예요.",
            sector_line,
        ],
    }

def trim_log(here, keep=300):
    """update.log를 최근 keep줄로 유지(무한 증가 방지). 실패해도 본 작업엔 영향 없음."""
    p = os.path.join(here, 'update.log')
    try:
        if not os.path.exists(p):
            return
        lines = open(p, encoding='utf-8').read().splitlines()
        if len(lines) > keep:
            with open(p, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines[-keep:]) + '\n')
    except Exception:
        pass

def get(url, referer='https://finance.naver.com', tries=3):
    """백오프 재시도. 모두 실패하면 마지막 예외를 올린다."""
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'Referer': referer})
            with urllib.request.urlopen(req, timeout=10) as r:
                return json.load(r)
        except Exception as e:
            last = e
            if i < tries - 1:
                time.sleep(0.6 * (i + 1))   # 0.6s, 1.2s 백오프
    raise last

def num(v):
    """'12,345원' '4.42배' '0.53%' → float, 'N/A'/None → None"""
    if not v or v == 'N/A':
        return None
    try:
        return float(str(v).replace(',', '').replace('원', '').replace('배', '').replace('%', ''))
    except ValueError:
        return None

def cap_str(million_won):
    jo = million_won / 1_000_000  # 백만원 → 조원
    return f'{jo:,.0f}조' if jo >= 10 else f'{jo:.1f}조'

def load_old_stocks(path):
    """기존 data.js에서 stocks 딕셔너리만 파싱(실패 종목 이전 값 보존용)."""
    if not os.path.exists(path):
        return {}
    try:
        t = re.sub(r'^\s*//.*$', '', open(path, encoding='utf-8').read(), flags=re.M)
        m = re.search(r'const\s+LIVE_DATA\s*=\s*(\{.*\})\s*;', t, re.S)
        return json.loads(m.group(1)).get('stocks', {}) if m else {}
    except Exception as e:
        print(f'[경고] 기존 data.js 파싱 실패(무시): {e}')
        return {}

def fetch_indices():
    """코스피/코스닥 지수 현재값 수집. 실패한 지수는 생략(화면에서 미표시)."""
    out = {}
    for idx in ('KOSPI', 'KOSDAQ'):
        try:
            d = get(f'https://m.stock.naver.com/api/index/{idx}/basic',
                    'https://m.stock.naver.com')
            out[idx] = {
                'value': num(d.get('closePrice')),
                'change': num(d.get('compareToPreviousClosePrice')),
                'rate': num(d.get('fluctuationsRatio')),
            }
            print(f"[OK] {idx} {d.get('closePrice')} ({d.get('fluctuationsRatio')}%)")
        except Exception as e:
            print(f'[경고] {idx} 지수 수집 실패(생략): {e}')
    return out

def get_html(url, referer='https://finance.naver.com', enc='euc-kr', tries=3):
    """HTML(텍스트) 페이지를 받아 문자열로 반환. 네이버 금융 웹은 EUC-KR 인코딩."""
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'Referer': referer})
            with urllib.request.urlopen(req, timeout=10) as r:
                return r.read().decode(enc, 'replace')
        except Exception as e:
            last = e
            if i < tries - 1:
                time.sleep(0.6 * (i + 1))
    raise last


def fetch_fx():
    """원/달러 환율(USD/KRW) 수집 — 네이버 금융 환율 페이지 HTML을 파싱.
    지수와 함께 10분마다 갱신된다. 실패 시 None(화면 미표시)."""
    # 1) 환율 리스트 페이지(가장 단순) — 매매기준율(sale)만 있으면 값은 확보
    try:
        html = get_html('https://finance.naver.com/marketindex/exchangeList.naver')
        # 구조: 미국 USD ... </a></td>  <td class="sale">1,503.40</td>  (사이에 공백/탭 다수)
        m = re.search(r'미국\s*USD.*?class="sale"[^>]*>\s*([\d,\.]+)', html, re.S)
        if m:
            v = num(m.group(1))
            if v:
                # 변동(%)은 메인 환율 페이지에서 보강 시도(없어도 값은 표시)
                fx = {'value': v, 'change': None, 'rate': None}
                try:
                    main = get_html('https://finance.naver.com/marketindex/')
                    mm = re.search(r'미국\s*USD.*?point_(up|dn)\d*.*?class="value">\s*([\d,\.]+).*?class="change">\s*([\d,\.]+)', main, re.S)
                    if mm:
                        direction, val, chg = mm.group(1), num(mm.group(2)), num(mm.group(3))
                        signed = chg if direction == 'up' else -chg
                        prev = (val or v) - signed
                        fx = {'value': val or v, 'change': signed,
                              'rate': round(signed / prev * 100, 2) if prev else None}
                except Exception as e:
                    print(f'[경고] 환율 변동 보강 실패(값은 정상): {e}')
                print(f"[OK] 환율(USD/KRW) {fx['value']} (변동 {fx['change']}, {fx['rate']}%)")
                return fx
    except Exception as e:
        print(f'[경고] 환율 수집 실패: {e}')
    return None


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    trim_log(here)                      # 로그 로테이션(맨 먼저)
    path = os.path.join(here, 'data.js')
    codes = load_tickers(here)          # 종목 단일 소스(tickers.js)
    old = load_old_stocks(path)
    out, fresh, stale_names = {}, 0, []

    def fetch_one(code, name):
        """한 종목의 현재가+상세지표 수집.
        반환: (code, row_or_None, is_fresh, stale_name_or_None)"""
        try:
            s = get(f'https://api.finance.naver.com/service/itemSummary.naver?itemcode={code}')
        except Exception as e:
            print(f'[실패] {name}({code}) 시세: {e}')
            if code in old:                       # 이전 값 유지 + 지연 표시
                row = dict(old[code]); row['stale'] = True
                print(f'   → 이전 값 유지(지연 표시): {row.get("price")}')
                return (code, row, False, name)
            return (code, None, False, None)
        info = {}
        try:
            integ = get(f'https://m.stock.naver.com/api/stock/{code}/integration',
                        'https://m.stock.naver.com')
            info = {i['code']: i.get('value') for i in integ.get('totalInfos', [])}
        except Exception as e:
            print(f'[경고] {name}({code}) 상세지표 실패(현재가는 정상): {e}')
        bps, eps = num(info.get('bps')), s.get('eps')
        roe = round(eps / bps * 100, 1) if bps and eps else None
        w52 = None
        if info.get('lowPriceOf52Weeks') and info.get('highPriceOf52Weeks'):
            w52 = f"{info['lowPriceOf52Weeks']} ~ {info['highPriceOf52Weeks']}"
        # 상세지표가 실패했으면 이전 값으로 보완(현재가/등락은 신선)
        prev = old.get(code, {})
        row = {
            'name': name, 'price': s['now'], 'rate': s['rate'],
            'per': s.get('per') if s.get('per') is not None else prev.get('per'),
            'pbr': s.get('pbr') if s.get('pbr') is not None else prev.get('pbr'),
            'roe': roe if roe is not None else prev.get('roe'),
            'eps': eps if eps is not None else prev.get('eps'),
            'div': num(info.get('dividendYieldRatio')) if info else prev.get('div'),
            'cap': cap_str(s['marketSum']), 'w52': w52 or prev.get('w52') or '—',
            'stale': False,
        }
        print(f"[OK] {name}({code}) {s['now']:,}원 {s['rate']:+.2f}%")
        return (code, row, True, None)

    # 종목 수집은 네트워크 I/O 대기가 대부분이라 순차 처리하면 119종목 × 2요청 =
    # ~11분이 걸린다. 스레드로 동시 수집해 ~1~2분으로 단축(10분 스케줄이 실제로
    # 성립하도록). 네이버 부하를 감안해 동시 8개로 제한한다.
    from concurrent.futures import ThreadPoolExecutor
    results = {}
    with ThreadPoolExecutor(max_workers=8) as ex:
        for code, row, is_fresh, stale_name in ex.map(
                lambda kv: fetch_one(*kv), list(codes.items())):
            results[code] = row
            if is_fresh:
                fresh += 1
            if stale_name:
                stale_names.append(stale_name)

    # tickers.js 원래 순서를 보존해 data.js diff를 안정적으로 유지
    for code, name in codes.items():
        if results.get(code) is not None:
            out[code] = results[code]

    if fresh == 0:
        print('신규 수집 0건 — data.js를 갱신하지 않습니다(기존 값·시각 보존).')
        sys.exit(1)

    now = datetime.datetime.now()
    # 수집 시점을 기준으로 장중/종가/시가전을 자동 판별해 라벨링
    #  · 한국 정규장 09:00~15:30, 주말은 최근 종가로 표시
    mins = now.hour * 60 + now.minute
    ymd = now.strftime('%Y-%m-%d'); hm = now.strftime('%H:%M')
    if now.weekday() >= 5:                 # 토·일
        date_label = f'{ymd} 종가 (주말 · 최근 종가 {hm} 수집)'
    elif not is_krx_trading_day(now.date()):
        # 공휴일 — 벤더가 직전 거래일 종가를 그대로 주므로 "오늘 종가"라고 쓰면 거짓말이 된다
        # (2026-08-17 광복절 대체휴일에 8/14 종가가 '8/17 종가'로 기록됐다). 주말과 같은 형식으로 밝힌다.
        date_label = f'{ymd} 종가 (휴장일 · 최근 종가 {hm} 수집)'
    elif mins >= 15 * 60 + 30:             # 15:30 이후 → 종가 확정
        date_label = f'{ymd} 종가 ({hm} 수집)'
    elif mins < 9 * 60:                    # 09:00 이전 → 전일 종가
        date_label = f'{ymd} 장전 (전일 종가 · {hm} 수집)'
    else:                                  # 09:00~15:30 → 장중 실시간가
        date_label = f'{ymd} {hm} 장중'
    if stale_names:
        date_label += f' · ⚠️ {len(stale_names)}종목 지연'

    indices = fetch_indices()
    fx = fetch_fx()
    data = {'date': date_label, 'indices': indices, 'stocks': out}
    if fx:
        data['fx'] = fx
    data['marketBrief'] = build_market_brief(data, here)
    js = (f'// 자동 생성: update_prices.py · {date_label}\n'
          'const LIVE_DATA = '
          + json.dumps(data, ensure_ascii=False, indent=1)
          + ';\n')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'\ndata.js 갱신 완료 ({date_label}) → {path}')
    if stale_names:
        print(f'⚠️ 지연(이전 값 유지): {", ".join(stale_names)}')

if __name__ == '__main__':
    main()
