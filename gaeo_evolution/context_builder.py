# -*- coding: utf-8 -*-
"""Context Builder — 정밀분석(Claude) 세션용 compact 종목 컨텍스트.

역할 구분(실코드 확인, 2026-08-21):
  · 자동분석의 내부 id 'nova' = QUANT(확률통계) — compute_team_weights.py 주석 실측.
  · 정밀분석의 NOVA = 뉴스·이슈(.claude/agents/nova-sentiment.md).
  두 역할을 통합하지 않는다. 이 빌더는 '정밀분석 Team' 기준으로 자료를 나눈다.

계약:
  · 내부 작업용이다. analysis.js schema를 바꾸지 않고, 어떤 판단도 만들지 않는다.
  · 이미 생성된 파일(indicators.json·analysis_data.json·data.js·dart_today.js)만
    읽는다 — 원본 22MB를 Claude에게 통째로 주지 않기 위한 압축이다.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from compute_model_intelligence import load_js  # noqa: E402


def _stock_indicators(root, code):
    path = os.path.join(root, "indicators.json")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)
    return (doc.get("stocks") or {}).get(code)


def _recent_daily(root, code, days=30):
    path = os.path.join(root, "analysis_data.json")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        doc = json.load(f)
    rows = ((doc.get("stocks") or {}).get(code) or {}).get("daily") or []
    rows = sorted((r for r in rows if r.get("date")), key=lambda r: r["date"])
    return rows[-days:]


def build_stock_context(code, root=ROOT):
    """종목 1개의 역할별 compact 컨텍스트. 판단·점수는 만들지 않는다."""
    tickers = load_js(os.path.join(root, "tickers.js"), "TICKERS") or []
    meta = next((t for t in tickers if t.get("code") == code), None)
    ind = _stock_indicators(root, code) or {}
    daily = _recent_daily(root, code)
    quote = None
    data = load_js(os.path.join(root, "data.js"), "LIVE_DATA") or {}
    for row in (data.get("stocks") or []):
        if row.get("code") == code:
            quote = {"price": row.get("price"), "changePct": row.get("changePct"),
                     "asOf": data.get("generatedAt")}
            break
    dart = None
    dart_path = os.path.join(root, "dart_today.js")
    if os.path.exists(dart_path):
        dart_doc = load_js(dart_path, "DART_TODAY") or {}
        dart = (dart_doc.get("byTicker") or {}).get(code)
    context = {
        "code": code,
        "name": (meta or {}).get("name"),
        "sector": (meta or {}).get("sector"),
        "quote": quote,
        "forRoles": {
            # 정밀분석 Team 기준 배분 — 각 Agent에게 자기 역할 자료 위주로.
            "taro_technical": {"indicators": {k: ind.get(k) for k in
                               ("ma5", "ma20", "ma60", "ma120", "rsi14", "macd",
                                "signal", "bbUpper", "bbLower") if k in ind},
                               "recentCloses": [{"date": r["date"], "close": r.get("close"),
                                                 "volume": r.get("volume")} for r in daily[-15:]]},
            "diana_fundamental": {k: ind.get(k) for k in
                                  ("per", "pbr", "roe", "eps", "bps", "marketCap")
                                  if k in ind},
            "nova_news": {"dartToday": dart,
                          "note": "뉴스 검색은 Agent가 직접 한다 — 여기는 공시 맥락만"},
            "flow_supply": {k: ind.get(k) for k in
                            ("foreignNet5", "institutionNet5", "individualNet5",
                             "foreignHoldPct") if k in ind},
            "chief": {"recentDaily": [{"date": r["date"], "close": r.get("close")}
                                      for r in daily[-30:]]},
        },
        "generatedFor": "정밀분석 내부 작업용 — analysis.js schema와 무관",
    }
    return context


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    if not argv:
        print("사용법: python -m gaeo_evolution.context_builder <종목코드>")
        return 1
    print(json.dumps(build_stock_context(argv[0]), ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
