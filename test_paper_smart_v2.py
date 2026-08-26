#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PAPER_SMART_V2(Shadow 전략) 계약 — V1을 건드리지 않고 더 오래 들고 갔을 때.

무엇을 지키나
    ① V1 원장·상태·환경과 완전히 분리된다(파일 한 바이트도 안 바뀐다).
    ② 진입은 V1과 같다: Forward Episode만, Look-ahead 0, Backfill 0, 중복 0.
    ③ 5거래일은 청산일이 아니라 재평가일이다. 같은 상황에서 V1은 팔고 V2는 든다.
    ④ CHIEF SELL은 여전히 강한 Exit다.
    ⑤ 최대 보유기간은 안전상한(60거래일)이고 사유 코드가 V1과 다르다.
    ⑥ MFE·MAE·시장대비·국면을 기록만 한다(그 값으로 사고파는 규칙 0).
    ⑦ 자리가 꽉 차면 갈아타지 않고 비교만 남긴다.
    ⑧ 청산하면 비용을 뺀 현금이 다시 쓰인다.
    ⑨ 표본이 차기 전에는 성과 결론을 숫자로 내지 않고, 자동 승격이 없다.

⚠️ 전부 offline fixture(FixtureMarketDataProvider·임시 폴더·environment=TEST_SMART_V2).
   실제 Forward 기록(LIVE_PAPER)에는 어떤 경로로도 손대지 않는다.
"""
import hashlib
import json
import os
import shutil
import sys
import tempfile
from datetime import datetime, timedelta, timezone

import paper_engine as pe
import paper_market_data as pmd
import paper_smart_v2 as sv

KST = timezone(timedelta(hours=9))
HERE = os.path.dirname(os.path.abspath(__file__))
FAILURES = []
TEST_ENV = "TEST_SMART_V2"


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


def cal(day, open_=True):
    regular = {"startTime": f"{day}T09:00:00+09:00", "endTime": f"{day}T15:30:00+09:00"}
    ses = {"preMarket": None, "regularMarket": regular, "afterMarket": None}
    return {"today": {"date": day, "open": open_, "integrated": ses if open_ else None},
            "previousBusinessDay": None, "nextBusinessDay": None}


def provider(day, quotes):
    """quotes: {code: (ask, bid)}"""
    return pmd.FixtureMarketDataProvider(
        prices={c: {"price": (a + b) / 2, "timestamp": f"{day}T10:00:00+09:00"}
                for c, (a, b) in quotes.items()},
        orderbooks={c: {"bestAsk": a, "bestBid": b, "timestamp": f"{day}T10:00:00+09:00"}
                    for c, (a, b) in quotes.items()},
        calendar=cal(day))


def bundle(calls, at):
    return {"signals": {c: {"call": v, "confidence": 70, "total": 60, "name": f"종목{c}",
                            "taro": 61, "diana": 62, "quant": 63, "flow": 64,
                            "riskScore": 5, "riskGrade": "low"}
                        for c, v in calls.items()},
            "analysisCompletedAt": at}


def t(day, hh=10, mm=0):
    y, m, d = map(int, day.split("-"))
    return datetime(y, m, d, hh, mm, tzinfo=KST)


def day_seq(start, n):
    y, m, d = map(int, start.split("-"))
    base = datetime(y, m, d)
    return [(base + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(n)]


def cfg_for(tmp):
    c = json.loads(json.dumps(sv.DEFAULT_CONFIG))
    return c


def hash_dir(path):
    out = {}
    for name in sorted(os.listdir(path)):
        full = os.path.join(path, name)
        if os.path.isfile(full):
            out[name] = hashlib.sha256(open(full, "rb").read()).hexdigest()
    return out


def make(tmp, prov, config=None):
    return sv.SmartV2Engine(prov, data_dir=tmp, config=config or cfg_for(tmp),
                            environment=TEST_ENV)


D = day_seq("2026-09-01", 70)

# ═══ ① 격리 — V1과 다른 폴더·다른 환경·다른 trade_id ═════════════════════════
check("1a. 데이터 폴더가 V1과 다르다", sv.DATA_DIR != pe.DEFAULT_DIR
      and sv.DATA_DIR.endswith(os.path.join("paper_trading", "smart_v2")), sv.DATA_DIR)
check("1b. environment가 V1·모멘텀과 모두 다르다",
      len({sv.ENVIRONMENT, pe.ENVIRONMENT, "LIVE_PAPER_MOMENTUM"}) == 3, sv.ENVIRONMENT)
check("1c. 전략 이름이 trade_id에 들어가 같은 신호라도 id가 갈린다",
      pe.trade_id_for(sv.STRATEGY_VERSION, "005930", "x")
      != pe.trade_id_for("PAPER_BASELINE_V1", "005930", "x"))
check("1d. 커밋 화이트리스트(paper_trading/) 안에 있다",
      os.path.commonpath([sv.DATA_DIR, pe.DEFAULT_DIR]) == pe.DEFAULT_DIR)

# 실제로 V1 폴더 파일이 한 바이트도 안 바뀌는지 행동으로 확인한다
sandbox = tempfile.mkdtemp(prefix="sv2box_")
v1dir = os.path.join(sandbox, "paper_trading")
os.makedirs(v1dir)
with open(os.path.join(v1dir, "trades.jsonl"), "w", encoding="utf-8") as f:
    f.write(json.dumps({"trade_id": "v1a", "environment": "LIVE_PAPER", "status": "OPEN",
                        "symbol": "005930", "entry_price": 10_000, "quantity": 100,
                        "entry_business_date": "2026-08-18"}, ensure_ascii=False) + "\n")
for name in ("state.json", "summary.json", "equity_curve.jsonl", "config.json"):
    open(os.path.join(v1dir, name), "w", encoding="utf-8").write("{}\n")
before = hash_dir(v1dir)
v2dir = os.path.join(v1dir, "smart_v2")
eng = make(v2dir, provider(D[0], {"005930": (10_000, 9_990)}))
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D[0]}T09:05:00+09:00"), now=t(D[0], 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 10, 10))
check("1e. V2가 사이클을 돌아도 V1 폴더 파일이 한 바이트도 안 바뀐다",
      hash_dir(v1dir) == before)
check("1f. V2 기록은 자기 폴더에만 쓴다",
      os.path.exists(os.path.join(v2dir, "trades.jsonl"))
      and eng.ledger.path.startswith(v2dir))
v2rows = [json.loads(x) for x in open(os.path.join(v2dir, "trades.jsonl"), encoding="utf-8")]
check("1g. V2 원장의 모든 행이 V2 environment다",
      all(r["environment"] == TEST_ENV for r in v2rows))
check("1h. V1 Ledger가 V2 파일을 읽어도 상태로 반영하지 않는다(environment 필터)",
      pe.Ledger(os.path.join(v2dir, "trades.jsonl"), "LIVE_PAPER").latest_by_id() == {})

# ═══ ② 진입 — Forward only · Backfill 0 · Look-ahead 0 · 중복 0 ══════════════
check("2a. 최초 실행은 Baseline만(기존 BUY 소급 매수 0)",
      len([r for r in v2rows if r.get("status") == "OPEN"]) == 1
      and v2rows[0]["signal_at"] == f"{D[0]}T10:05:00+09:00")
opened = [r for r in v2rows if r.get("status") == "OPEN"]
check("2b. 진입 체결은 탐지 이후 Best Ask",
      opened[0]["entry_method"] == "BEST_ASK" and opened[0]["entry_price"] == 10_000
      and opened[0]["simulated_fill_at"] >= opened[0]["detected_at"]
      and opened[0]["detected_at"] >= opened[0]["signal_at"])
check("2c. 처음부터 비용 반영 회계(NET) — 전환 경계와 무관",
      opened[0]["accounting_version"] == pe.ACCOUNTING_V2_NET
      and abs(opened[0]["entry_commission_krw"] - 150.0) < 1e-6,
      str(opened[0].get("entry_commission_krw")))
n_before = len(eng.ledger.rows)
eng.run_cycle(bundle({"005930": "BUY"}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 11, 10))
check("2d. 같은 Episode 재처리 → 추가 매수 0", len(eng.ledger.rows) == n_before)
shutil.rmtree(sandbox)

# ═══ ③ 5거래일은 재평가일이다 (V1 대조군과 나란히 돌린다) ════════════════════
def run_days(engine, days, calls, quotes):
    for d in days:
        engine.provider = provider(d, quotes)
        engine.run_cycle(bundle(calls, f"{d}T10:05:00+09:00"), now=t(d, 10, 10))
    return engine


tmp_v2 = tempfile.mkdtemp(prefix="sv2_")
tmp_v1 = tempfile.mkdtemp(prefix="sv1_")
QUOTES = {"005930": (10_000, 9_990)}
v2 = make(tmp_v2, provider(D[0], QUOTES))
v1 = pe.PaperEngine(provider(D[0], QUOTES), data_dir=tmp_v1,
                    config={"strategyVersion": "PAPER_BASELINE_V1",
                            "initial_cash_krw": 10_000_000,
                            "position_size_krw": 1_000_000,
                            "maxHoldingTradingDays": 5},
                    environment="TEST")
for e in (v2, v1):
    e.run_cycle(bundle({"005930": "HOLD"}, f"{D[0]}T09:05:00+09:00"), now=t(D[0], 9, 10))
    e.run_cycle(bundle({"005930": "BUY"}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 10, 10))
run_days(v2, D[1:8], {"005930": "HOLD"}, QUOTES)
run_days(v1, D[1:8], {"005930": "HOLD"}, QUOTES)
v1_closed = [r for r in v1.ledger.latest_by_id().values() if r["status"] == "CLOSED"]
v2_open = [r for r in v2.ledger.latest_by_id().values() if r["status"] == "OPEN"]
check("3a. 대조군 V1은 5거래일에 판다(MAX_HOLDING_5D)",
      len(v1_closed) == 1 and v1_closed[0]["exit_reason"] == "MAX_HOLDING_5D")
check("3b. 같은 상황에서 V2는 팔지 않는다(5거래일 = 재평가일)",
      len(v2_open) == 1 and not [r for r in v2.ledger.latest_by_id().values()
                                 if r["status"] == "CLOSED"])
check("3c. 청산 판정 함수 자체가 5·20·59거래일에서 None",
      all(v2._exit_reason({}, "HOLD", n) is None for n in (5, 20, 59)))
check("3d. 60거래일에 안전상한으로만 청산(사유 코드가 V1과 다르다)",
      v2._exit_reason({}, "HOLD", 60) == sv.EXIT_SAFETY_CAP
      and sv.EXIT_SAFETY_CAP != "MAX_HOLDING_5D")
check("3e. BUY가 계속 강해도 5거래일에 팔지 않는다",
      v2._exit_reason({}, "BUY", 5) is None)

# ── 재평가 지점 기록 ──
obs = [json.loads(x) for x in open(os.path.join(tmp_v2, sv.OBS_FILE), encoding="utf-8")]
# 진입한 날(D[0])도 그 사이클에서 한 줄 남으므로 8일치가 정상이다.
check("4a. 보유 중 하루 한 줄만 기록한다(사이클마다 쌓지 않는다)",
      len(obs) == len({o["business_date"] for o in obs}) == 8, str(len(obs)))
check("4b. 5거래일 관측에 재평가 표시가 붙는다",
      any(o["horizon_checkpoint"] == 5 and o["holding_trading_days"] == 5 for o in obs),
      str([(o["holding_trading_days"], o["horizon_checkpoint"]) for o in obs]))
check("4c. 재평가 지점은 GAEO가 실제로 채점하는 구간과 같다(5·20·60거래일)",
      sv.HORIZON_CHECKPOINTS == (5, 20, 60))
o5 = [o for o in obs if o["horizon_checkpoint"] == 5][0]
check("4d. CHIEF·분석가 4인 점수를 함께 기록한다",
      o5["chief_call"] == "HOLD" and o5["chief_total"] == 60 and o5["chief_confidence"] == 70
      and (o5["taro_score"], o5["diana_score"], o5["quant_score"], o5["flow_score"])
      == (61, 62, 63, 64), json.dumps(o5, ensure_ascii=False)[:220])
check("4e. MFE·MAE·고점이후하락·보유 거래일을 기록한다",
      all(k in o5 for k in ("mfe_pct", "mae_pct", "drawdown_from_peak_pct",
                            "holding_trading_days", "return_pct", "market_regime")))
# 같은 사이클을 다시 돌려도 그날 관측이 두 줄이 되지 않는다
v2.run_cycle(bundle({"005930": "HOLD"}, f"{D[7]}T11:05:00+09:00"), now=t(D[7], 11, 10))
obs2 = [json.loads(x) for x in open(os.path.join(tmp_v2, sv.OBS_FILE), encoding="utf-8")]
check("4f. 같은 날 재실행해도 관측이 중복되지 않는다", len(obs2) == len(obs))

# ── 60거래일 안전상한이 실제로 동작하는가(끝까지 돌려본다) ──
run_days(v2, D[8:62], {"005930": "HOLD"}, QUOTES)
capped = [r for r in v2.ledger.latest_by_id().values() if r["status"] == "CLOSED"]
check("5a. 60거래일에 실제로 안전상한 청산이 일어난다",
      len(capped) == 1 and capped[0]["exit_reason"] == sv.EXIT_SAFETY_CAP
      and capped[0]["holding_trading_days"] == 60,
      str([(r["status"], r.get("exit_reason"), r.get("holding_trading_days"))
           for r in v2.ledger.latest_by_id().values()]))
check("5b. 청산 기록에 MFE·MAE가 남는다",
      capped[0].get("mfe_pct") is not None and capped[0].get("mae_pct") is not None)
check("5c. 20거래일 재평가 지점도 기록됐다",
      any(o["horizon_checkpoint"] == 20 for o in
          [json.loads(x) for x in open(os.path.join(tmp_v2, sv.OBS_FILE), encoding="utf-8")]))
shutil.rmtree(tmp_v1)
shutil.rmtree(tmp_v2)

# ═══ ⑥ CHIEF SELL은 여전히 강한 Exit ═════════════════════════════════════════
tmp = tempfile.mkdtemp(prefix="sv2sell_")
eng = make(tmp, provider(D[0], QUOTES))
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D[0]}T09:05:00+09:00"), now=t(D[0], 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 10, 10))
eng.provider = provider(D[1], {"005930": (11_010, 11_000)})
eng.run_cycle(bundle({"005930": "SELL"}, f"{D[1]}T10:05:00+09:00"), now=t(D[1], 10, 10))
closed = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "CLOSED"]
check("6a. CHIEF SELL 전환 → 즉시 청산(Best Bid)",
      len(closed) == 1 and closed[0]["exit_reason"] == "CHIEF_SELL"
      and closed[0]["exit_method"] == "BEST_BID")
check("6b. HOLD는 청산 신호가 아니다", eng._exit_reason({}, "HOLD", 1) is None)
# 현금 재사용 — 비용을 뺀 실제 현금이 돌아온다(고정 대조군: 97,485원)
cash = pe.derive_cash(eng.config, eng.ledger.latest_by_id())
check("6c. 청산 현금이 비용을 뺀 값으로 돌아온다(+97,485원)",
      abs(cash - (10_000_000 + 97_485.0)) < 1e-6, str(cash))
eng.provider = pmd.FixtureMarketDataProvider(
    prices={"000660": {"price": 20_000, "timestamp": f"{D[1]}T11:00:00+09:00"}},
    orderbooks={"000660": {"bestAsk": 20_000, "bestBid": 19_990,
                           "timestamp": f"{D[1]}T11:00:00+09:00"}},
    calendar=cal(D[1]))
eng.run_cycle(bundle({"000660": "BUY"}, f"{D[1]}T11:05:00+09:00"), now=t(D[1], 11, 10))
check("6d. 돌아온 현금으로 새 종목에 다시 진입한다",
      any(r["symbol"] == "000660" and r["status"] == "OPEN"
          for r in eng.ledger.latest_by_id().values()))
shutil.rmtree(tmp)

# ═══ ⑦ 자리가 꽉 찼을 때 — 갈아타지 않고 비교만 기록 ═════════════════════════
tmp = tempfile.mkdtemp(prefix="sv2full_")
# 종목당 기준금액이 1,000,000원이고 수수료가 붙으므로 1,000,000원짜리 9종목이면
# 남은 현금(998,650원)이 기준금액에 못 미쳐 자리가 정확히 찬다.
codes = [f"00{i:04d}" for i in range(1, 10)]
quotes = {c: (1_000_000, 999_000) for c in codes}     # 한 종목이 정확히 자리 하나
quotes["999999"] = (1_000_000, 999_000)
eng = make(tmp, provider(D[0], quotes))
eng.run_cycle(bundle({c: "HOLD" for c in codes}, f"{D[0]}T09:05:00+09:00"), now=t(D[0], 9, 10))
eng.run_cycle(bundle({c: "BUY" for c in codes}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 10, 10))
held = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "OPEN"]
check("7a. 자리를 다 채운다(현금이 기준금액 아래로 내려간다)",
      len(held) == 9 and pe.derive_cash(eng.config, eng.ledger.latest_by_id())
      < eng.config["position_size_krw"], str(len(held)))
check("7a2. 자리가 차기 전에는 포기 기록을 만들지 않는다",
      not os.path.exists(os.path.join(tmp, sv.SWAP_FILE)))
# 새 후보 등장 — 현금이 없다
eng.provider = provider(D[1], quotes)
sig = {c: "HOLD" for c in codes}
sig["999999"] = "BUY"
eng.run_cycle(bundle(sig, f"{D[1]}T10:05:00+09:00"), now=t(D[1], 10, 10))
still = [r for r in eng.ledger.latest_by_id().values() if r["status"] == "OPEN"]
swaps = [json.loads(x) for x in open(os.path.join(tmp, sv.SWAP_FILE), encoding="utf-8")]
check("7b. 기존 보유를 팔고 갈아타지 않는다(보유 수 그대로)", len(still) == len(held))
check("7c. 포기한 후보를 비교 기록으로 남긴다", len(swaps) == 1
      and swaps[0]["kind"] == "PORTFOLIO_FULL_NO_SWAP"
      and swaps[0]["decision"] == "HELD_EXISTING", json.dumps(swaps, ensure_ascii=False)[:200])
sw = swaps[0]
check("7d. 신규 후보·기존 최약 종목의 점수와 CHIEF 상태를 함께 남긴다",
      sw["candidate"]["symbol"] == "999999" and sw["candidate"]["chief_call"] == "BUY"
      and sw["weakestHeld"] and sw["weakestHeld"]["chief_call"] == "HOLD"
      and sw["weakestHeld"]["chief_total"] is not None)
check("7e. 교체했다면 들었을 추가 거래비용을 계산해 남긴다",
      isinstance(sw["swapExtraCostKrw"], (int, float)) and sw["swapExtraCostKrw"] > 0,
      str(sw["swapExtraCostKrw"]))
check("7f. 결과는 아직 모른다고 표시한다(지어내지 않는다)",
      sw["outcomeStatus"] == "PENDING_FORWARD_OBSERVATION")
eng.run_cycle(bundle(sig, f"{D[1]}T10:05:00+09:00"), now=t(D[1], 11, 10))
swaps2 = [json.loads(x) for x in open(os.path.join(tmp, sv.SWAP_FILE), encoding="utf-8")]
check("7g. 같은 분석 배치에 대해 중복 기록하지 않는다", len(swaps2) == 1)
shutil.rmtree(tmp)

# ═══ ⑧ 표본 게이트·자동승격 금지 ═════════════════════════════════════════════
tmp = tempfile.mkdtemp(prefix="sv2sum_")
eng = make(tmp, provider(D[0], QUOTES))
eng.run_cycle(bundle({"005930": "HOLD"}, f"{D[0]}T09:05:00+09:00"), now=t(D[0], 9, 10))
eng.run_cycle(bundle({"005930": "BUY"}, f"{D[0]}T10:05:00+09:00"), now=t(D[0], 10, 10))
eng.provider = provider(D[1], {"005930": (11_010, 11_000)})
eng.run_cycle(bundle({"005930": "SELL"}, f"{D[1]}T10:05:00+09:00"), now=t(D[1], 10, 10))
s = json.load(open(os.path.join(tmp, "summary.json"), encoding="utf-8"))
check("8a. 표본 부족이면 성과 결론을 숫자로 내지 않는다",
      str(s["evidence"]).startswith("INSUFFICIENT")
      and all(s.get(k) is None for k in ("winRatePct", "avgReturnPct", "profitFactor",
                                         "estimatedNetReturnPct")))
check("8b. Shadow라는 사실과 기준 전략을 산출물에 못박는다",
      s["strategyRole"] == "SHADOW" and s["baselineStrategy"] == "PAPER_BASELINE_V1")
check("8c. 자동 승격이 없다고 명시한다",
      s["promotion"]["auto"] is False and s["promotion"]["status"] == "NO_AUTO_PROMOTION"
      and s["promotion"]["requiresApprovalBy"] == "대표")
check("8d. 만들지 않은 규칙을 스스로 밝힌다(손절·익절·고정보유일·교체)",
      set(s["notImplementedByDesign"]) == {"손절 임계값", "익절 임계값",
                                           "고정 보유일 강제청산", "점수 기반 종목 교체"})
check("8e. 최대 보유기간과 그 근거를 함께 싣는다",
      s["maxHoldingTradingDays"] == 60 and "60거래일" in s["maxHoldingBasis"]
      and "build_model_scoreboard" in s["maxHoldingBasis"])
check("8f. 청산 사유 목록이 V1의 5거래일 규칙과 분리돼 있다",
      s["exitRules"] == ["CHIEF_SELL", sv.EXIT_SAFETY_CAP]
      and "MAX_HOLDING_5D" not in s["exitRules"])
check("8g. Forward 시작일을 지어내지 않는다(엔진이 실제로 처음 돈 날)",
      s["forwardStart"] == D[0], str(s["forwardStart"]))
check("8h. 회계는 처음부터 비용 반영(섞인 기준 없음)",
      s["accountingVersion"] == pe.ACCOUNTING_V2_NET
      and s["accounting"]["unreflectedCostKrw"] == 0.0
      and s["accounting"]["mixedBasis"] is False)
check("8i. 공개 화면에는 싣지 않는다(V1 화면과 섞지 않는다)",
      s["publicSnapshot"] is False)
shutil.rmtree(tmp)

# ═══ ⑨ 최대 보유기간 근거가 저장소 실제 값과 일치하는가 ══════════════════════
sb = open(os.path.join(HERE, "build_model_scoreboard.py"), encoding="utf-8").read()
check("9a. GAEO 성적표가 실제로 쓰는 Horizon은 5·20·60이다",
      '("5", "20", "60")' in sb and '("5", "20", "30")' not in sb)
import model_registry
_base = [m for m in model_registry.MODELS if m["id"] == "base_production"][0]
check("9b. 이 전략의 신호 출처(base_production)는 5D만 채점된다",
      _base["horizons"] == ["5D"], str(_base["horizons"]))
_research = [m for m in model_registry.MODELS if m["id"] == "research_a"][0]
check("9c. 가장 먼 연구 Horizon이 60D다(그 밖은 근거 0)",
      _research["horizons"] == ["5D", "20D", "60D"])
check("9d. 상한 60은 그 Horizon을 그대로 쓴 값이다(임의의 숫자가 아니다)",
      sv.MAX_HOLDING_TRADING_DAYS == 60 == int(_research["horizons"][-1].rstrip("D")))
check("9e. 사용자 화면도 이 구간을 '거래일'이라고 설명한다(단위 일치)",
      "5D · 20D · 60D는 달력일이 아니라" in open(os.path.join(HERE, "index.html"),
                                                encoding="utf-8").read())
_cfg = json.load(open(os.path.join(sv.DATA_DIR, "config.json"), encoding="utf-8"))
check("9f. 저장된 config.json이 모듈 상수와 완전히 같다(둘이 갈라지지 않게)",
      _cfg == sv.DEFAULT_CONFIG, json.dumps(_cfg, ensure_ascii=False)[:200])
check("9g. 손절·익절·교체 규칙이 config에도 없다(null)",
      _cfg["stopLossRule"] is None and _cfg["takeProfitRule"] is None
      and _cfg["replacementRule"] is None)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_paper_smart_v2: 전체 통과 (Shadow 전략 계약)")
