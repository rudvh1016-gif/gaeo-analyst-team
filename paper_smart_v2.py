#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Paper Smart V2 — "5거래일은 청산일이 아니라 재평가일" Shadow 전략.

무엇인가
    V1(PAPER_BASELINE_V1)이 "GAEO의 5일 판단을 그대로 거래했으면?"을 재는
    기준시험이라면, 이 전략은 **같은 진입 신호를 더 오래 들고 갔을 때 무슨 일이
    벌어지는지**를 기록한다. 완전히 별도의 가상계좌·별도 원장이다.

무엇이 아닌가 — 절대 규칙
    ⛔ V1을 대체하지 않는다. V1 = Baseline, V2 = Shadow. 며칠 성적이 좋아도
       자동 승격은 없다(summary.promotion.auto = false). 대표 승인 없이
       메인 전략을 바꾸지 않는다.
    ⛔ V1 기록에 한 행도 쓰지 않는다. 격리는 3중이다.
       ① 폴더 분리(paper_trading/smart_v2) ② environment 분리
       ③ trade_id 해시에 전략명 포함.
       ⚠️ Ledger.known_ids()는 environment를 거르지 않는다 —
          그래서 폴더 분리가 1차 방어선이다(paper_momentum.py의 경고와 같다).
    ⛔ 과거 가상체결을 만들지 않는다(Backfill 0). 최초 실행은 Baseline 캡처만 하고
       거래하지 않는다 — 그 시점 이후 새로 생긴 BUY 전환만 산다.
    ⛔ 손절 -5% · 익절 +8% · 7일 보유 · 점수 +3 교체 같은 숫자를 지어내지 않는다.
       지금 Forward 표본은 청산 10건·진입일 1일뿐이라 그런 임계값을 정할 근거가
       전혀 없다. 대신 MFE·MAE·고점이후하락·시장대비 수익률을 **기록만** 해서
       나중에 실제 분포로 연구할 수 있게 남긴다.
    ⛔ 자리가 꽉 찼을 때 들고 있던 종목을 팔고 갈아타지 않는다. 대신
       "무엇을 포기했는지"를 shadow_swaps.jsonl에 비교 기록으로만 남긴다.

V1과 무엇이 다른가 (이것 하나뿐이다)
    · 진입: V1과 동일 — Production CHIEF가 non-BUY → BUY로 바뀐 실제 Forward
      Episode만, 탐지 이후 Best Ask(불가 시 V1과 같은 fallback + 사유 기록).
    · 청산: CHIEF SELL은 그대로 강한 Exit 사유로 남긴다.
      **보유 5거래일은 청산일이 아니라 재평가일이다.** BUY가 계속 강하면
      5거래일이 됐다는 이유만으로 팔지 않는다.
    · 재평가 시점(5·20·60거래일)에는 그날 관측 기록에 checkpoint 표시만 남긴다.

최대 보유기간(안전상한)의 근거 — 지어낸 숫자가 아니다
    무한 보유를 막는 상한은 필요하지만 "가장 돈 버는 숫자"를 찾아 넣으면
    표본 10건짜리 과최적화가 된다. 그래서 GAEO가 **실제로 연구하는 Horizon**을
    그대로 쓴다(2026-08-26 저장소 실측):
      · build_model_scoreboard.py 는 성적을 5 / 20 / 60 세 구간으로만 집계한다
        (`for h in ("5", "20", "60")` — 같은 파일에 7곳).
      · model_registry.MODELS 에서 이 전략의 신호 출처인 base_production 의
        horizons 는 ["5D"] 뿐이고, 연구모델 A·B·C 가 ["5D","20D","60D"] 다.
      · index.html 은 "5D · 20D · 60D는 달력일이 아니라 거래일입니다"라고
        사용자에게 명시한다 → 이 엔진의 보유일(거래일) 계산과 단위가 같다.
    즉 5거래일은 '신호 출처가 유일하게 채점되는 지점'이라 청산이 아니라 재평가로
    두고, 60거래일은 'GAEO가 어떤 모델에 대해서도 성적을 내보는 가장 먼 지점'이라
    그 밖은 근거가 0이므로 안전상한으로 쓴다. 20거래일은 중간 재평가 지점이다.

회계
    처음부터 ACCOUNTING_V2_NET(수수료·거래세 반영) 기준이다. 과거 기록이 없으니
    호환 문제가 없다 — 청산하면 비용을 뺀 실제 현금이 다시 Available Cash가 된다.

켜고 끄기
    기본 ON. 끄려면 GAEO_PAPER_SMART_V2=0. (러너는 조건 없이 부르고 이 스크립트가
    스스로 판단해 종료하므로, 켜고 끄는 데 코드 수정이 필요 없다)
"""
import json
import os
import re
import sys

import paper_market_data as pmd
from paper_engine import (HERE, PaperEngine, ACCOUNTING_V2_NET, COMMISSION_PCT,
                          SELL_TAX_PCT, SELL_TAX_DEFAULT_PCT, iso,
                          load_index_history, index_value_on_or_before)

STRATEGY_VERSION = "PAPER_SMART_V2"
ENVIRONMENT = "LIVE_PAPER_SMART_V2"
DISABLE_ENV = "GAEO_PAPER_SMART_V2"        # "0"이면 끈다(기본 ON)
# 러너의 커밋 화이트리스트가 paper_trading/ 이므로 그 **안에** 둔다(경계를 넓히지 않는다).
DATA_DIR = os.path.join(HERE, "paper_trading", "smart_v2")
INITIAL_CASH_KRW = 10_000_000
POSITION_SIZE_KRW = 1_000_000
# ⬆️ 위 docstring의 근거로 정한 안전상한. "가장 좋은 보유일"이 아니라
#    "GAEO가 성적을 내보는 가장 먼 지점"이다.
MAX_HOLDING_TRADING_DAYS = 60
# 재평가(청산 아님) 지점 — GAEO가 실제로 채점하는 구간과 같다.
HORIZON_CHECKPOINTS = (5, 20, 60)
EXIT_SAFETY_CAP = "MAX_HOLDING_SAFETY_CAP"   # V1의 MAX_HOLDING_5D와 절대 섞지 않는다

OBS_FILE = "observations.jsonl"
SWAP_FILE = "shadow_swaps.jsonl"

DEFAULT_CONFIG = {
    "schemaVersion": "gaeo_paper_config_v1",
    "strategyVersion": STRATEGY_VERSION,
    "strategyRole": "SHADOW",
    "baselineStrategy": "PAPER_BASELINE_V1",
    "forwardStart": None,          # 엔진이 실제로 처음 돈 날이 Forward 시작이다
    "initial_cash_krw": INITIAL_CASH_KRW,
    "position_size_krw": POSITION_SIZE_KRW,
    "maxHoldingTradingDays": MAX_HOLDING_TRADING_DAYS,
    "reevaluationHorizons": list(HORIZON_CHECKPOINTS),
    "signalSource": "auto_analysis.js LIVE_AUTO.stocks[code].chief.call (Production CHIEF)",
    "entryRule": "BUY 전환(직전 관측 non-BUY → BUY) + 장중 Best Ask, fallback 현재가(사유 기록) — V1과 동일",
    "exitRule": "chief.call SELL 전환(강한 Exit) 또는 60거래일 안전상한 도달. 5거래일은 청산일이 아니라 재평가일",
    "takeProfitRule": None,
    "stopLossRule": None,
    "replacementRule": None,
    "accounting": {
        "version": ACCOUNTING_V2_NET,
        "legacyVersion": None,
        "costAccountingFrom": None,   # 과거가 없다 → 처음부터 비용 반영
        "note": "이 전략은 첫 거래부터 수수료·거래세를 반영한다. 섞인 기준이 없다",
    },
    "note": "Shadow 전략. V1을 대체하지 않으며 자동 승격이 없다(대표 승인 전용)",
}


def load_market_regime(path=None):
    """GAEO가 정의한 현재 시장 국면(model_intelligence.js). 못 읽으면 None.

    ⚠️ 여기서 국면을 새로 계산하지 않는다 — 이미 있는 값을 읽기만 한다.
    """
    path = path or os.path.join(HERE, "model_intelligence.js")
    try:
        s = open(path, encoding="utf-8").read()
        d = json.loads(re.search(r"=\s*(\{.*\})\s*;?\s*$", s, re.S).group(1))
    except (OSError, ValueError, AttributeError):
        return {"key": None, "generatedAt": None}
    cur = d.get("currentRegime") or {}
    return {"key": cur.get("key"), "trend": cur.get("trend"), "vol": cur.get("vol"),
            "generatedAt": d.get("generatedAt")}


def _append_jsonl(path, row):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
        f.flush()
        os.fsync(f.fileno())


def _count_lines(path):
    try:
        with open(path, encoding="utf-8") as f:
            return sum(1 for line in f if line.strip())
    except OSError:
        return 0


class SmartV2Engine(PaperEngine):
    """진입·체결·회계는 V1 코드를 그대로 물려받고, 청산 기준과 기록만 바꾼다."""

    def __init__(self, provider, data_dir=None, config=None, environment=ENVIRONMENT):
        # 🔒 기본값을 여기서 못박는다. 부모 기본값은 V1 폴더라, 인자를 빠뜨린 채
        #    만들면 이 전략의 거래가 V1 원장에 섞여 들어간다(momentum과 같은 이유).
        data_dir = data_dir or DATA_DIR
        os.makedirs(data_dir, exist_ok=True)
        super().__init__(provider, data_dir=data_dir, config=config,
                         environment=environment)
        self._regime = None
        self._idx_hist = None

    def _load_config(self):
        path = os.path.join(self.dir, "config.json")
        if os.path.exists(path):
            return json.load(open(path, encoding="utf-8"))
        return json.loads(json.dumps(DEFAULT_CONFIG))     # 깊은 복사(상수 오염 방지)

    # ── 청산: 5거래일은 '재평가일'이지 '청산일'이 아니다 ──
    def _exit_reason(self, row, cur_call, holding_days):
        """① CHIEF SELL 전환 = 강한 Exit ② 안전상한 도달.

        ⚠️ V1의 MAX_HOLDING_5D와 사유 코드를 일부러 다르게 쓴다. 같은 문자열을 쓰면
           나중에 두 전략의 청산 이유가 한 통계에 섞여 구분이 사라진다.
        """
        if cur_call == "SELL":
            return "CHIEF_SELL"
        cap = self.config.get("maxHoldingTradingDays") or MAX_HOLDING_TRADING_DAYS
        if holding_days >= cap:
            return EXIT_SAFETY_CAP
        return None

    # ── 보유 중 Forward 관측 기록 ──
    def _observe_position(self, row, price, meta, signals, now, today_date, holding_days):
        """하루 한 줄, 그날 처음 관측한 시점의 상태를 남긴다.

        ⚠️ 기록 전용이다. 이 값들로 사고파는 규칙은 하나도 만들지 않았다
           (표본이 차기 전에 임계값을 정하면 과최적화다).
        ⚠️ 사이클마다 남기면 하루 13줄 × 종목 수라 원장이 금방 불어난다.
           하루 한 줄이면 MFE/MAE는 어차피 누적값이라 극값이 유실되지 않는다.
        """
        if meta is None:
            return None
        if meta.get("lastObservedDate") == today_date:
            return None
        meta["lastObservedDate"] = today_date
        sig = signals.get(row["symbol"]) or {}
        entry = row.get("entry_price")
        px = (price or {}).get("price")
        ret = (round((px / entry - 1) * 100, 3) if px and entry else None)
        if self._regime is None:
            self._regime = load_market_regime()
        bench_ret = None
        if row.get("benchmark_entry_value"):
            if self._idx_hist is None:
                self._idx_hist = load_index_history()
            bench_now, _bd = index_value_on_or_before(
                self._idx_hist, row.get("market") or "KOSPI", today_date)
            if bench_now:
                bench_ret = round((bench_now - row["benchmark_entry_value"])
                                  / row["benchmark_entry_value"] * 100, 3)
        mfe = meta.get("mfePrice")
        mae = meta.get("maePrice")
        obs = {
            "at": iso(now), "business_date": today_date,
            "trade_id": row["trade_id"], "symbol": row["symbol"], "name": row.get("name"),
            "market": row.get("market"),
            "holding_trading_days": holding_days,
            # 5·20·60거래일은 '재평가 지점'이다 — 여기서 팔지 않는다.
            "horizon_checkpoint": (holding_days if holding_days in HORIZON_CHECKPOINTS
                                   else None),
            "chief_call": sig.get("call"), "chief_total": sig.get("total"),
            "chief_confidence": sig.get("confidence"),
            "taro_score": sig.get("taro"), "diana_score": sig.get("diana"),
            "quant_score": sig.get("quant"), "flow_score": sig.get("flow"),
            "risk_score": sig.get("riskScore"), "risk_grade": sig.get("riskGrade"),
            "entry_price": entry, "observed_price": px, "return_pct": ret,
            "mfe_pct": (round((mfe / entry - 1) * 100, 3) if mfe and entry else None),
            "mae_pct": (round((mae / entry - 1) * 100, 3) if mae and entry else None),
            # 고점 이후 얼마나 되밀렸는지 — 나중에 '언제 팔았어야 했나'를 볼 재료.
            "drawdown_from_peak_pct": (round((px / mfe - 1) * 100, 3)
                                       if px and mfe else None),
            "benchmark_return_pct": bench_ret,
            "relative_return_pct": (round(ret - bench_ret, 3)
                                    if ret is not None and bench_ret is not None else None),
            "market_regime": (self._regime or {}).get("key"),
            "observation_note": "기록 전용 — 이 값으로 만드는 매매 규칙은 없다",
        }
        _append_jsonl(os.path.join(self.dir, OBS_FILE), obs)
        return obs

    # ── 자리가 꽉 찼을 때: 갈아타지 않고 비교만 남긴다 ──
    def _on_insufficient_cash(self, code, signals, latest, analysis_at, now, cash):
        """신규 후보 vs 보유 중 가장 약한 종목 — 결정은 '유지'로 고정한다.

        ⚠️ 실제로 갈아타지 않는다. 갈아타기 규칙(점수 차 몇 점부터 교체 같은)을
           지금 만들면 근거 없는 임계값이 된다. 여기서는 그때 무엇을 포기했는지만
           남겨서, 표본이 쌓인 뒤 "교체했다면/유지했다면"을 계산할 수 있게 한다.
        """
        if self.state.get("lastShadowSwapBatch") == analysis_at:
            return None            # 같은 분석 배치에 대해서는 한 번만 남긴다
        self.state["lastShadowSwapBatch"] = analysis_at
        cand = signals.get(code) or {}
        opens = [r for r in latest.values() if r.get("status") == "OPEN"]
        meta_all = self.state.get("openMeta") or {}

        def _rank(r):
            s = signals.get(r["symbol"]) or {}
            # 보유 중 '가장 약한' 종목 = 진입 순위를 뒤집은 것뿐이다(새 점수 발명 0).
            return ((s.get("total") if s.get("total") is not None else 999),
                    (s.get("confidence") if s.get("confidence") is not None else 999),
                    r["symbol"])

        weakest = min(opens, key=_rank) if opens else None
        held = None
        swap_cost = None
        if weakest is not None:
            wsig = signals.get(weakest["symbol"]) or {}
            mark = (meta_all.get(weakest["trade_id"]) or {}).get("lastMarkPrice")
            qty = weakest.get("quantity") or 0
            entry = weakest.get("entry_price")
            held = {"symbol": weakest["symbol"], "name": weakest.get("name"),
                    "chief_call": wsig.get("call"), "chief_total": wsig.get("total"),
                    "chief_confidence": wsig.get("confidence"),
                    "entry_price": entry, "mark_price": mark,
                    "return_pct": (round((mark / entry - 1) * 100, 3)
                                   if mark and entry else None),
                    "entry_business_date": weakest.get("entry_business_date")}
            if mark and qty:
                tax = SELL_TAX_PCT.get(weakest.get("market"), SELL_TAX_DEFAULT_PCT)
                sell_cost = mark * qty * (COMMISSION_PCT + tax) / 100.0
                buy_cost = (self.config.get("position_size_krw") or 0) * COMMISSION_PCT / 100.0
                swap_cost = round(sell_cost + buy_cost, 2)
        _append_jsonl(os.path.join(self.dir, SWAP_FILE), {
            "at": iso(now), "business_date": now.strftime("%Y-%m-%d"),
            "analysis_at": analysis_at, "kind": "PORTFOLIO_FULL_NO_SWAP",
            "decision": "HELD_EXISTING",
            "candidate": {"symbol": code, "name": cand.get("name"),
                          "chief_call": cand.get("call"), "chief_total": cand.get("total"),
                          "chief_confidence": cand.get("confidence"),
                          "taro_score": cand.get("taro"), "diana_score": cand.get("diana"),
                          "quant_score": cand.get("quant"), "flow_score": cand.get("flow")},
            "weakestHeld": held,
            "availableCashKrw": round(cash, 2),
            "positionSizeKrw": self.config.get("position_size_krw"),
            "swapExtraCostKrw": swap_cost,
            "outcomeStatus": "PENDING_FORWARD_OBSERVATION",
            "outcomeMethod": "price_history.js 일별 종가로 두 결과를 나중에 계산한다"
                             "(장중 체결가가 아니라 일 단위 근사라는 한계를 함께 본다)",
            "note": "실제 교체는 하지 않았다. 근거 없는 교체 임계값을 만들지 않기 위해서다",
        })
        return None

    # ── 요약: Shadow라는 사실과 승격 금지를 산출물에 못박는다 ──
    def _summary_extra(self):
        return {
            "strategyRole": "SHADOW",
            "baselineStrategy": "PAPER_BASELINE_V1",
            "exitRules": ["CHIEF_SELL", EXIT_SAFETY_CAP],
            "reevaluationHorizons": list(HORIZON_CHECKPOINTS),
            "maxHoldingTradingDays": self.config.get("maxHoldingTradingDays"),
            "maxHoldingBasis": (
                "GAEO가 실제로 채점하는 Horizon(5·20·60거래일)에서 가져온 안전상한이다. "
                "60거래일은 build_model_scoreboard가 성적을 내보는 가장 먼 지점이라 "
                "그 밖에는 근거가 없다. 수익이 가장 큰 보유일을 찾아 넣은 값이 아니다."),
            "notImplementedByDesign": [
                "손절 임계값", "익절 임계값", "고정 보유일 강제청산", "점수 기반 종목 교체"],
            "promotion": {"auto": False, "status": "NO_AUTO_PROMOTION",
                          "requiresApprovalBy": "대표",
                          "note": "V1을 대체하지 않는다. 성적이 좋아도 자동 승격 없음"},
            "observationRecords": _count_lines(os.path.join(self.dir, OBS_FILE)),
            "shadowSwapRecords": _count_lines(os.path.join(self.dir, SWAP_FILE)),
            "publicSnapshot": False,
        }


def enabled():
    """기본 ON. 명시적으로 0으로 꺼야만 꺼진다."""
    return os.environ.get(DISABLE_ENV, "1") != "0"


def run_safe():
    """러너 진입점 — 어떤 실패도 V1과 Production에 영향이 없다(항상 exit 0)."""
    if not enabled():
        print(f"[smart_v2] 꺼져 있음 — 아무 것도 하지 않는다 ({DISABLE_ENV}=0)")
        return 0
    try:
        provider = pmd.TossMarketDataProvider()
        engine = SmartV2Engine(provider, data_dir=DATA_DIR, environment=ENVIRONMENT)
        print("[smart_v2]", engine.run_cycle())
    except Exception as e:      # noqa: BLE001 — advisory 원칙(V1과 동일)
        print(f"[smart_v2] 실패(V1·Production 무영향): {type(e).__name__}: {str(e)[:160]}")
    return 0


if __name__ == "__main__":
    sys.exit(run_safe())
