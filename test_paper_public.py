#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""paper_public.py Sanitization 계약 — 공개 스냅샷에 비밀·계좌·TEST 기록이 못 들어간다."""
import json
import os
import re
import shutil
import sys
import tempfile

import paper_engine as pe
import paper_public as pp

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


tmp = tempfile.mkdtemp(prefix="ppub_")
orig_dir, orig_out = pp.DIR, pp.OUT
pp.DIR = tmp
pp.OUT = os.path.join(tmp, "paper_public.js")
try:
    # 픽스처: LIVE 거래 2건(OPEN·CLOSED) + TEST 1건 + 요약
    with open(os.path.join(tmp, "trades.jsonl"), "w", encoding="utf-8") as f:
        f.write(json.dumps({"trade_id": "a1", "environment": "LIVE_PAPER", "status": "OPEN",
                            "symbol": "005930", "name": "삼성전자", "market": "KOSPI",
                            "signal": "BUY", "entry_price": 10000, "quantity": 100,
                            "entry_business_date": "2026-08-18",
                            "detected_at": "2026-08-18T10:10:00+09:00"}, ensure_ascii=False) + "\n")
        f.write(json.dumps({"trade_id": "a2", "environment": "LIVE_PAPER", "status": "CLOSED",
                            "symbol": "000660", "name": "SK하이닉스", "market": "KOSPI",
                            "signal": "BUY", "entry_price": 20000, "quantity": 50,
                            "exit_price": 20600, "exit_reason": "MAX_HOLDING_5D",
                            "gross_return_pct": 3.0, "holding_trading_days": 5,
                            "entry_business_date": "2026-08-18", "exit_business_date": "2026-08-25",
                            "detected_at": "2026-08-18T10:10:00+09:00",
                            "exit_at": "2026-08-25T10:10:00+09:00"}, ensure_ascii=False) + "\n")
        f.write(json.dumps({"trade_id": "t1", "environment": "TEST", "status": "CLOSED",
                            "symbol": "999999", "name": "테스트종목", "entry_price": 1,
                            "quantity": 1, "exit_price": 2,
                            "gross_return_pct": 100.0}, ensure_ascii=False) + "\n")
    json.dump({"evidence": "INSUFFICIENT_EVIDENCE — 표본 부족", "winRatePct": 100.0,
               "skippedSignals": 0}, open(os.path.join(tmp, "summary.json"), "w"))
    json.dump({"baselineCaptured": True, "engineStartedAt": "2026-08-18T09:10:00+09:00",
               "lastCycleAt": "2026-08-25T10:10:00+09:00", "lastCycleResult": "CYCLE_OK"},
              open(os.path.join(tmp, "state.json"), "w"))
    json.dump({"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
               "forwardStart": "2026-08-18"}, open(os.path.join(tmp, "config.json"), "w"))

    rc = pp.build()
    out = open(pp.OUT, encoding="utf-8").read()
    payload = json.loads(re.search(r"window\.GAEO_PAPER=(.*?);\n", out).group(1))  # V1 줄만(파일에 V2·V3 줄도 있다)

    check("생성 성공", rc == 0)
    check("TEST 기록 제외 (Forward만 공개)",
          all(t.get("symbol") != "999999" for t in payload["recentTrades"])
          and payload["closedTrades"] == 1 and payload["openTrades"] == 1)
    check("확정 평가금 = 초기금 + 확정 손익", payload["realizedVirtualEquity"] == 10_000_000 + 600 * 50)
    # 원장 필드 + 표시용 파생 필드 — 둘 다 명시 allowlist 안에만 있어야 한다.
    allowed = pp.TRADE_ALLOWED | pp.DERIVED_ALLOWED
    extra = {k for t in payload["recentTrades"] for k in t} - allowed
    check("거래 공개 필드가 allowlist 밖으로 안 나감", not extra, str(extra))
    # 파생 필드가 원장 필드를 덮어써 의미를 바꾸지 않는지(이름 충돌 0) 확인.
    check("파생 필드가 원장 필드와 충돌하지 않음",
          not (pp.DERIVED_ALLOWED & pp.TRADE_ALLOWED),
          str(pp.DERIVED_ALLOWED & pp.TRADE_ALLOWED))
    check("금지 키워드(secret/token/account 등) 0",
          not any(w in out.lower() for w in pp.FORBIDDEN_SUBSTRINGS))
    # 비용 모델은 버전 문자열로 각인하고, 반영한 요율과 확인 날짜를 함께 공개한다.
    check("비용 모델 버전 각인", payload["costModel"] == pe.COST_MODEL_VERSION,
          str(payload.get("costModel")))
    _cm = payload.get("costModelDetail") or {}
    check("비용 근거 공개 — 요율·확인일·왕복비용",
          _cm.get("commissionPct") == pe.COMMISSION_PCT
          and _cm.get("verifiedAt") == pe.COST_MODEL_VERIFIED_AT
          and _cm.get("roundTripPct") is not None, str(_cm))
    check("슬리피지를 지어내지 않았음을 명시",
          _cm.get("slippageModeled") is False and bool(_cm.get("slippageNote")))
    check("표본 부족 상태 전달", str(payload["evidenceStatus"]).startswith("INSUFFICIENT"))

    # 오염된 요약 — allowlist에 있는 필드(evidence)에 비밀 문자열이 섞인 경우에도
    # 마지막 방어선(FORBIDDEN_SUBSTRINGS)이 산출물 생성을 거부해야 한다.
    json.dump({"evidence": "OK client_secret=abc"},
              open(os.path.join(tmp, "summary.json"), "w"))
    os.remove(pp.OUT)
    rc2 = pp.build()
    check("비밀 문자열 감지 시 산출물 미생성(FAIL CLOSED)",
          rc2 == 1 and not os.path.exists(pp.OUT))

    # Ledger 없음(시작 전) → 가짜 거래·가짜 수익률 없이 상태만
    shutil.rmtree(tmp)
    os.makedirs(tmp)
    rc3 = pp.build()
    payload3 = json.loads(re.search(r"window\.GAEO_PAPER=(.*?);\n",
                                    open(pp.OUT, encoding="utf-8").read()).group(1))  # V1 줄만
    check("시작 전 상태 — 거래 0·수익률 null·stage 표기",
          rc3 == 0 and payload3["stage"] == "BEFORE_FORWARD_START"
          and payload3["recentTrades"] == [] and payload3["portfolioReturnPct"] is None
          and "grossReturnPct" not in payload3)   # 개별 수익 합은 공개 payload에서 제외
finally:
    pp.DIR, pp.OUT = orig_dir, orig_out
    shutil.rmtree(tmp, ignore_errors=True)

# ── 버전별 기록(History) 계약 (2026-08-27 신설) ──────────────────────────────
#    화면의 기록 탭은 세 버전 모두에서 열린다. 각 버전은 자기 원장에서 파생된
#    자기 파일을 읽어야 하고, 그 파일은 사이트가 서빙하는 paper_trading/ 최상위에
#    있어야 한다(전략 원기록 폴더는 _config.yml이 배포에서 제외한다).
tmp2 = tempfile.mkdtemp(prefix="ppub_ver_")
orig_dir, orig_out = pp.DIR, pp.OUT
try:
    pp.DIR, pp.OUT = tmp2, os.path.join(tmp2, "paper_public.js")
    # 버전마다 보유 상한이 다르다 — 기록 탭 문구도 그 버전 값을 말해야 한다.
    json.dump({"strategyVersion": "PAPER_BASELINE_V1", "initial_cash_krw": 10_000_000,
               "maxHoldingTradingDays": 5},
              open(os.path.join(tmp2, "config.json"), "w"))
    _VER_HOLD = {"PAPER_BASELINE_V1": 5, "PAPER_SMART_V2": 60, "PAPER_SCALP_V3": 2}
    for sub, ver in (("smart_v2", "PAPER_SMART_V2"), ("scalp_v3", "PAPER_SCALP_V3")):
        os.makedirs(os.path.join(tmp2, sub), exist_ok=True)
        json.dump({"strategyVersion": ver, "initial_cash_krw": 10_000_000,
                   "maxHoldingTradingDays": _VER_HOLD[ver]},
                  open(os.path.join(tmp2, sub, "config.json"), "w"))
    rc4 = pp.build()
    check("버전 기록 — build 성공", rc4 == 0)
    check("버전 기록 — 파일 이름 규칙(V2/V3는 최상위 history_vN.json)",
          pp._history_filename("GAEO_PAPER_V2") == "history_v2.json"
          and pp._history_filename("GAEO_PAPER_V3") == "history_v3.json")
    for name, label in (("history.json", "V1"), ("history_v2.json", "V2"),
                        ("history_v3.json", "V3")):
        path = os.path.join(tmp2, name)
        exists = os.path.exists(path)
        check(f"버전 기록 — {label} 기록 파일이 최상위에 생성된다({name})", exists, path)
        if exists:
            body = json.load(open(path, encoding="utf-8"))
            check(f"버전 기록 — {label} 기록에 days 배열이 있다",
                  isinstance(body.get("days"), list))
            low = json.dumps(body, ensure_ascii=False).lower()
            check(f"버전 기록 — {label} 기록에 계좌·토큰 흔적 0",
                  not any(w in low for w in pp.FORBIDDEN_SUBSTRINGS))
            # 🐛 2026-08-28: paper_history.build_strategy()가 세 버전 모두에 "최대
            #    5거래일"을 똑같이 구워 넣어, V2(60)·V3(2)의 기록 탭이 거짓말을 했다.
            _hold = {"V1": 5, "V2": 60, "V3": 2}[label]
            _st = body.get("strategy") or {}
            check(f"버전 기록 — {label} 전략 요약이 그 버전의 보유 상한을 말한다({_hold}거래일)",
                  _st.get("maxHoldingTradingDays") == _hold
                  and f"{_hold}거래일" in str(_st.get("note")),
                  f"{_st.get('maxHoldingTradingDays')} / {_st.get('note')}")
            # 그 전략이 구조적으로 만들 수 없는 구간은 "축적 중"이 아니라고 표시한다.
            _beyond = [b["label"] for b in (_st.get("buckets") or []) if b.get("beyondRule")]
            check(f"버전 기록 — {label} 규칙 밖 구간 표시가 상한과 맞는다",
                  bool(_beyond) == (_hold < 5), str(_beyond))
    # 전략 원기록 폴더 안에는 만들지 않는다(사이트가 못 읽는 자리라 무의미하다)
    check("버전 기록 — 전략 폴더 안에는 만들지 않는다",
          not os.path.exists(os.path.join(tmp2, "smart_v2", "history.json"))
          and not os.path.exists(os.path.join(tmp2, "scalp_v3", "history.json")))
finally:
    pp.DIR, pp.OUT = orig_dir, orig_out
    shutil.rmtree(tmp2, ignore_errors=True)

# ── 계좌 단위 성과 게이트 (2026-08-28 신설) ─────────────────────────────────
#    엔진이 "표본이 찰 때까지 계좌 숫자도 내지 않는다"고 정한 전략은, 화면 산출물에서도
#    같은 결정이 지켜져야 한다. 실제로 V2(Shadow)는 summary.json이 null인데도
#    paper_public.js에 +1.476%·평가금 1,014만원이 실려 나갔다(원장 재계산 경로).
tmp3 = tempfile.mkdtemp(prefix="ppub_acct_")
orig_dir, orig_out = pp.DIR, pp.OUT


def _fixture(dirpath, strategy_version, closed_n, entry_days):
    """청산 closed_n건·진입일 entry_days일짜리 원장 + 요약을 만든다."""
    os.makedirs(dirpath, exist_ok=True)
    with open(os.path.join(dirpath, "trades.jsonl"), "w", encoding="utf-8") as f:
        # 미청산 1건 — 평가금·현금이 실제로 계산되게 한다
        f.write(json.dumps({"trade_id": "o1", "environment": "ENV_X", "status": "OPEN",
                            "symbol": "005930", "name": "삼성전자", "market": "KOSPI",
                            "signal": "BUY", "entry_price": 10000, "quantity": 100,
                            "entry_business_date": "2026-08-18",
                            "detected_at": "2026-08-18T10:10:00+09:00"}, ensure_ascii=False) + "\n")
        for i in range(closed_n):
            day = "2026-08-%02d" % (18 + (i % entry_days))
            f.write(json.dumps({"trade_id": "c%d" % i, "environment": "ENV_X",
                                "status": "CLOSED", "symbol": "00066%d" % (i % 10),
                                "name": "종목%d" % i, "market": "KOSPI", "signal": "BUY",
                                "entry_price": 20000, "quantity": 50, "exit_price": 20600,
                                "exit_reason": "MAX_HOLDING_5D", "gross_return_pct": 3.0,
                                "holding_trading_days": 5, "entry_business_date": day,
                                "exit_business_date": "2026-08-27",
                                "detected_at": day + "T10:10:00+09:00",
                                "exit_at": "2026-08-27T10:10:00+09:00"}, ensure_ascii=False) + "\n")
    # Equity Curve — 이게 없으면 날짜별 기록이 0일이라 게이트 검사가 헛돈다.
    with open(os.path.join(dirpath, "equity_curve.jsonl"), "w", encoding="utf-8") as f:
        for i, day in enumerate(("2026-08-18", "2026-08-19")):
            f.write(json.dumps({"at": day + "T15:30:00+09:00", "cash": 9_000_000,
                                "positionsCost": 1_000_000, "openCount": 1,
                                "markedPositionsValue": 1_020_000.0 + i * 5_000,
                                "markedEquity": 10_020_000 + i * 5_000,
                                "realizedPnl": 0, "unrealizedPnl": 20_000.0 + i * 5_000,
                                "valuationObservedAt": day + "T15:30:00+09:00",
                                "valuationMarketAt": day + "T15:30:00+09:00",
                                "valuationStatus": "MARKED"}, ensure_ascii=False) + "\n")
    json.dump({"strategyVersion": strategy_version, "initial_cash_krw": 10_000_000},
              open(os.path.join(dirpath, "config.json"), "w"))
    json.dump({"baselineCaptured": True, "engineStartedAt": "2026-08-18T09:10:00+09:00",
               "lastCycleAt": "2026-08-27T10:10:00+09:00", "lastCycleResult": "CYCLE_OK"},
              open(os.path.join(dirpath, "state.json"), "w"))


try:
    pp.DIR, pp.OUT = tmp3, os.path.join(tmp3, "paper_public.js")
    # ① 표본 미달 — 게이트 대상 전략(V2)은 계좌 숫자가 전부 비어야 한다
    d2 = os.path.join(tmp3, "v2")
    _fixture(d2, "PAPER_SMART_V2", closed_n=1, entry_days=1)
    p2, _ = pp.build_payload(d2, "ENV_X")
    leaked = [k for k in pp.ACCOUNT_GATED_PUBLIC if p2.get(k) is not None]
    check("계좌 게이트 — 표본 미달 Shadow는 계좌 숫자를 전부 비운다", not leaked, str(leaked))
    check("계좌 게이트 — 왜 비었는지 화면이 설명할 근거를 함께 싣는다",
          p2.get("metricsHiddenUntilEvidence") == list(pp.ACCOUNT_GATED_PUBLIC))
    # 수익률을 되만들 재료(현금·평가금액·배분비율)까지 같이 막혔는지 명시적으로 본다
    for _k in ("availableVirtualCash", "markedPositionsValue", "currentVirtualEquity",
               "realizedVirtualEquity", "allocationCashPct", "allocationInvestedPct"):
        check(f"계좌 게이트 — 되만들기 재료도 막힘({_k})", p2.get(_k) is None)
    # 원금(investedCostBasis)은 성과가 아니라 사실이므로 남긴다
    check("계좌 게이트 — 투자원금은 성과가 아니라 남긴다",
          p2.get("investedCostBasis") is not None)

    # ② 표본이 차면 열린다 — 영구히 잠기는 게이트가 아니어야 한다
    d2b = os.path.join(tmp3, "v2ok")
    _fixture(d2b, "PAPER_SMART_V2",
             closed_n=max(pp.MIN_CLOSED_FOR_EVIDENCE, 12),
             entry_days=max(pp.MIN_ENTRY_DAYS_FOR_EVIDENCE, 5))
    json.dump({"evidence": "SAMPLE_OK — 표본 충족"},
              open(os.path.join(d2b, "summary.json"), "w"))
    p2b, _ = pp.build_payload(d2b, "ENV_X")
    # ⚠️ 평가금(currentVirtualEquity)은 시세가 있어야 나오는 값이라 픽스처에서는 항상
    #    null이다. 게이트가 열렸는지는 시세 없이도 계산되는 현금·확정평가금으로 본다.
    check("계좌 게이트 — 표본이 차면 다시 열린다",
          p2b.get("availableVirtualCash") is not None
          and p2b.get("realizedVirtualEquity") is not None
          and p2b.get("metricsHiddenUntilEvidence") is None,
          str(p2b.get("evidenceStatus")))

    # ③ 명시적 예외(V1·V3)는 예전과 똑같이 계좌 숫자를 낸다 — 동작 변화 0
    for _ver in sorted(pp.ACCOUNT_PUBLIC_STRATEGIES):
        d1 = os.path.join(tmp3, "ex_" + _ver)
        _fixture(d1, _ver, closed_n=1, entry_days=1)
        p1, _ = pp.build_payload(d1, "ENV_X")
        check(f"계좌 게이트 — 예외 전략은 그대로 공개한다({_ver})",
              p1.get("availableVirtualCash") is not None
              and p1.get("realizedVirtualEquity") is not None
              and p1.get("metricsHiddenUntilEvidence") is None)

    # ④ 모르는 전략은 막는다(fail-closed) — V4를 만들고 목록을 깜빡해도 새지 않는다
    d4 = os.path.join(tmp3, "v4")
    _fixture(d4, "PAPER_FUTURE_V4", closed_n=1, entry_days=1)
    p4, _ = pp.build_payload(d4, "ENV_X")
    check("계좌 게이트 — 목록에 없는 새 전략은 기본으로 막힌다(fail-closed)",
          p4.get("availableVirtualCash") is None
          and p4.get("realizedVirtualEquity") is None)

    # ⑤ 기록 탭(History)도 같은 규칙으로 막힌다 — 보유 화면만 막고 기록을 열어두면
    #    게이트가 무의미하다. 실제로 history_v2.json 이 날짜마다 평가금·누적수익률을
    #    그대로 싣고 있었다(2026-08-28 발견, 두 번째 누출 경로).
    _hp = os.path.join(tmp3, "h_gated.json")
    pp._write_history(d2, _hp, {"strategyVersion": "PAPER_SMART_V2",
                                "maxHoldingTradingDays": 60},
                      10_000_000, ["2026-08-18"], account_gated=True)
    _hg = json.load(open(_hp, encoding="utf-8"))
    check("계좌 게이트 — 기록 검사가 실제 날짜 위에서 돈다(빈 배열 헛통과 방지)",
          len(_hg["days"]) > 0, "0일")
    _leak = [k for day in _hg["days"] for k in pp.HISTORY_ACCOUNT_GATED_DAY
             if day.get(k) is not None]
    check("계좌 게이트 — 기록 탭의 날짜별 계좌 숫자도 비운다", not _leak, str(set(_leak)))
    check("계좌 게이트 — 종목별 기여도는 합치면 계좌 손익이라 통째로 뺀다",
          all(not day.get("contributions") for day in _hg["days"]))
    check("계좌 게이트 — 기록에도 이유를 싣는다",
          _hg.get("metricsHiddenUntilEvidence") == list(pp.HISTORY_ACCOUNT_GATED_DAY))
    # 무엇을 사고팔았는지는 남는다 — 그건 성과 결론이 아니라 기록 그 자체다.
    check("계좌 게이트 — 매매 기록 자체는 지우지 않는다",
          all("buys" in day and "sells" in day for day in _hg["days"]))
    _hp2 = os.path.join(tmp3, "h_open.json")
    pp._write_history(d2, _hp2, {"strategyVersion": "PAPER_BASELINE_V1",
                                 "maxHoldingTradingDays": 5},
                      10_000_000, ["2026-08-18"], account_gated=False)
    _ho = json.load(open(_hp2, encoding="utf-8"))
    check("계좌 게이트 — 예외 전략의 기록은 그대로 둔다(동작 변화 0)",
          _ho.get("metricsHiddenUntilEvidence") is None
          and any(day.get("equity") is not None for day in _ho["days"]))

    # ⑥ 키 이름이 금지 문자열에 걸리지 않는다(걸리면 그 버전이 통째로 미게시된다)
    check("계좌 게이트 — 안내 키 이름이 금지 문자열에 안 걸린다",
          not any(w in json.dumps(p2, ensure_ascii=False).lower()
                  for w in pp.FORBIDDEN_SUBSTRINGS))
finally:
    pp.DIR, pp.OUT = orig_dir, orig_out
    shutil.rmtree(tmp3, ignore_errors=True)

# ⑥ 목록이 엔진과 어긋나지 않는다 — 여기가 어긋나면 화면이 엔진의 결정을 배신한다.
#    (엔진에서 _account_gated_fields()가 빈 튜플인 전략 == 공개 예외 전략)
import paper_momentum as _pm          # noqa: E402
import paper_scalp_v3 as _pv3         # noqa: E402
import paper_smart_v2 as _psv2        # noqa: E402

_ENGINES = {pe.STRATEGY_VERSION: pe.PaperEngine,
            _psv2.STRATEGY_VERSION: _psv2.SmartV2Engine,
            _pv3.STRATEGY_VERSION: _pv3.ScalpV3Engine,
            _pm.STRATEGY_VERSION: _pm.MomentumEngine}


def _engine_gates(ver):
    cls = _ENGINES[ver]
    return bool(tuple(cls._account_gated_fields(object.__new__(cls))))


# 실제로 화면에 싣는 전략만 대상으로 본다(V1 + PUBLIC_VERSIONS).
# 안 싣는 전략(momentum)까지 목록에 넣으라고 강요하면, 목록이 "공개 예외"가 아니라
# 그냥 전략 목록이 되어 fail-closed 기본값의 뜻이 사라진다.
_published = [pe.STRATEGY_VERSION] + [v[3] for v in pp.PUBLIC_VERSIONS]
_mismatch = [v for v in _published
             if (v in pp.ACCOUNT_PUBLIC_STRATEGIES) == _engine_gates(v)]
check("계좌 게이트 — 공개 전략의 예외 여부가 엔진 결정과 일치한다",
      not _mismatch, str(_mismatch))
# 목록에 '엔진은 막기로 한 전략'이 들어 있으면 그게 바로 이번에 고친 버그다.
_wrong = sorted(v for v in pp.ACCOUNT_PUBLIC_STRATEGIES
                if v in _ENGINES and _engine_gates(v))
check("계좌 게이트 — 엔진이 막기로 한 전략은 예외 목록에 없다", not _wrong, str(_wrong))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_public: 전체 통과")
