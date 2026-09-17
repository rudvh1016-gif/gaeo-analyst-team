#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""official_price_history.js 생성기 — 공식 일별 가격 기록(official_prices/fsc_15094808)에서 가격 차트용 파일을 만든다 (2026-09-17).

왜 별도 파일인가
    price_history.js(네이버 유래)는 캔들차트뿐 아니라 채점·순환매·반등·모의투자가 함께 읽는 공용 파일이다.
    이번에는 **가격 차트용 읽기 경로만** 분리한다. 판단 계산·채점 입력은 건드리지 않는다.

내용
    const OFFICIAL_PRICE_HISTORY = {meta: {...}, stocks: {code: [{date,open,high,low,close,volume}, …]}}
    - meta.enabled 가 false 면 화면은 이 파일을 쓰지 않고(기존 경로 유지), stocks 는 비워 둔다(용량 0 에 가깝게).
    - meta.enabled 가 true 면 화면은 **이 파일만** 쓴다. 자료가 없는 종목·기간은 네이버로 채우지 않는다.
    - 출처·기준일·지연(T+1)·가격 기준(공급자 제공값 그대로 · 조정 여부 UNCONFIRMED)을 meta 에 그대로 적는다.
    스위치는 config/data_supply_migration.json consumerMigrations.priceChart.enabled(0/1)다. 코드가 임의로 켜지 않는다.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

from data_supply import fsc_daily_store as store, fsc_stock_price as fsc     # noqa: E402

OUT_NAME = 'official_price_history.js'
CONFIG_REL = os.path.join('config', 'data_supply_migration.json')
CONSUMER_KEY = 'priceChart'


def consumer_config(root=HERE):
    with open(os.path.join(root, CONFIG_REL), encoding='utf-8') as handle:
        cfg = json.load(handle)
    return (cfg.get('consumerMigrations') or {}).get(CONSUMER_KEY) or {}


def load_tickers(root=HERE):
    import update_price_history as uph
    old = uph.HERE
    uph.HERE = root
    try:
        return uph.load_tickers()
    finally:
        uph.HERE = old


def build(root=HERE, out_path=None, enabled=None):
    cfg = consumer_config(root)
    if enabled is None:
        enabled = bool(cfg.get('enabled'))
    tickers = load_tickers(root)
    manifest = store.load_manifest(root)
    dates = store.stored_dates(root)
    series = store.load_series(set(tickers), root) if enabled else {}
    covered = sorted(code for code, bars in series.items() if len(bars) >= 2)
    meta = {
        'provider': fsc.PROVIDER, 'datasetId': fsc.DATASET_ID, 'datasetTitle': fsc.DATASET_TITLE,
        'operation': fsc.OPERATION, 'attribution': fsc.ATTRIBUTION, 'license': fsc.LICENSE_NOTE,
        'latency': fsc.LATENCY, 'priceBasis': fsc.PRICE_BASIS, 'adjustmentStatus': fsc.ADJUSTMENT_STATUS,
        'enabled': bool(enabled), 'status': cfg.get('status'), 'minTradingDays': cfg.get('minTradingDays'),
        'generatedAt': dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds'),
        'firstTradingDate': dates[0] if dates else None, 'lastTradingDate': dates[-1] if dates else None,
        'tradingDays': len(dates), 'corrections': len(manifest.get('corrections') or []),
        'tickers': len(tickers), 'codesCovered': len(covered), 'codesMissing': len(tickers) - len(covered),
        'naverFallback': False,
        'note': '기준일 다음 영업일 13:00 KST 이후 제공되는 지연 자료. 장중 현재가가 아니다. 없는 날짜·종목은 비워 둔다.',
    }
    payload = {'meta': meta, 'stocks': {code: series[code] for code in covered} if enabled else {}}
    path = out_path or os.path.join(root, OUT_NAME)
    # 내용이 같으면(생성 시각만 다르면) 다시 쓰지 않는다 — 스위치가 꺼진 채 매일 도는 ops-daily 가 빈 커밋을 만들지 않게.
    if os.path.exists(path) and _same_payload(path, payload):
        meta['unchanged'] = True
        return meta
    header = ('// 자동 생성: build_official_price_history.py · 공식 일별 시세(금융위원회_주식시세정보 15094808) 차트용\n'
              '// ' + fsc.ATTRIBUTION + ' · T+1 지연 자료 · 공급자 제공값 그대로(조정 여부 UNCONFIRMED)\n'
              '// meta.enabled=false 면 화면은 이 파일을 쓰지 않는다(기존 경로 유지). 네이버 자료로 채우지 않는다.\n')
    body = header + 'const OFFICIAL_PRICE_HISTORY = ' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ';\n'
    tmp = path + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as handle:
        handle.write(body)
    os.replace(tmp, path)
    return meta


def _same_payload(path, payload):
    try:
        with open(path, encoding='utf-8') as handle:
            txt = handle.read()
        match = re.search(r'const OFFICIAL_PRICE_HISTORY = (\{.*\});', txt, re.S)
        existing = json.loads(match.group(1)) if match else None
    except (OSError, ValueError, AttributeError):
        return False
    if not isinstance(existing, dict):
        return False
    strip = lambda obj: {'meta': {k: v for k, v in (obj.get('meta') or {}).items() if k != 'generatedAt'}, 'stocks': obj.get('stocks')}
    return strip(existing) == strip(payload)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--root', default=HERE)
    ap.add_argument('--out', default=None)
    args = ap.parse_args(argv)
    meta = build(args.root, args.out)
    print(json.dumps({k: meta[k] for k in ('enabled', 'status', 'tradingDays', 'firstTradingDate', 'lastTradingDate',
                                           'codesCovered', 'codesMissing', 'corrections')}, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    sys.exit(main())
