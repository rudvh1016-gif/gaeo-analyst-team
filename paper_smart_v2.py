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
       ⚠️ 2026-08-26부터 Ledger.known_ids()도 environment를 거른다(예전에는 안 걸러서
          파일이 섞이면 진입이 조용히 영구 유실됐다). 그래도 폴더 분리가 1차 방어선이다.
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
import paper_single_writer
from paper_engine import (HERE, PaperEngine, ACCOUNTING_V2_NET, COMMISSION_PCT,
                          SELL_TAX_PCT, SELL_TAX_DEFAULT_PCT, iso, net_return_pct,
                          load_index_history, benchmark_window, latest_settled_index_day,
                          today_kst_date, BENCHMARK_CLOCK_NOTE, STRATEGY_VERSION as _V1_VERSION)

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

OBS_FILE = "observations.jsonl"          # 하루 한 줄 상세 관측
SWAP_FILE = "shadow_swaps.jsonl"         # 자리가 꽉 차 못 산 후보 비교(교체는 안 한다)
# 🕰️ 지금 남기지 않으면 영원히 복구할 수 없는 두 가지 (2026-08-26 감사 지적)
#   ① 보유 중 CHIEF 판단의 '사이클별' 경로 — 나중에 "5일에 안 팔았으면?"을
#      사후 재구성하려면 그때그때의 call/total/confidence가 남아 있어야 한다.
#   ② 못 산 후보의 '스킵 시점 가격' — 없으면 "자리가 있었다면?"을 계산할 수 없다.
#   둘 다 Forward 기록 전용이다. 과거를 소급해 만들지 않는다.
PATH_FILE = "chief_path.jsonl"           # 사이클마다 한 줄(보유 종목별 CHIEF 경로)
SKIP_FILE = "skipped_candidates.jsonl"   # 못 산 후보·진입 종목 + 그 시점 관측가
# 🔒 표본이 차기 전에는 계좌 단위 성과도 숫자로 내지 않는다.
#    이 전략의 산출물은 화면에 싣지 않지만 저장소가 public이라 URL로는 읽힌다.
#    publicSnapshot:false 는 아무 것도 강제하지 못하므로 값 자체를 비운다.
#    ⚠️ 수익률만 막고 현금·평가금액을 남기면 그 둘로 수익률을 되만들 수 있다.
SHADOW_ACCOUNT_GATED = ("portfolioReturnPct", "realizedPnl", "unrealizedPnl",
                        "currentVirtualEquity", "maxDrawdownPct",
                        "markedPositionsValue", "cash", "investedCashOutlay",
                        "sumTradeReturnsPct")

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

    def _load_state(self):
        """🔒 전략 이름을 여기서 못박는다(2026-08-26 감사 지적 M1).

        부모의 _load_state는 config에 strategyVersion이 없으면 **V1 상수**로 폴백한다.
        그러면 trade_id가 V1과 완전히 똑같아져(실측 78a24fdf28104cdd) 3중 격리의
        ③(해시에 전략명 포함)이 조용히 무력화된다. 설정이 어떻든 이 전략의 이름은 하나다.
        """
        st = super()._load_state()
        st["strategyVersion"] = STRATEGY_VERSION
        return st

    def _account_gated_fields(self):
        return SHADOW_ACCOUNT_GATED

    # ── 진입: 규칙은 V1 그대로. 기록은 부모의 배치 조회(호출 1회)를 그대로 쓴다 ──
    #    ⚠️ 여기서 따로 조회를 만들면 두 전략의 '잣대'가 갈라지고 호출도 두 배가 된다.
    SKIP_QUOTE_FILE = SKIP_FILE

    def _skip_quote_extra(self, code, signals):
        """못 산 후보에 분석가 4인 점수까지 남긴다(나중에 무엇을 포기했는지 보려고)."""
        sig = signals.get(code) or {}
        return {"taro_score": sig.get("taro"), "diana_score": sig.get("diana"),
                "quant_score": sig.get("quant"), "flow_score": sig.get("flow")}

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
        """CHIEF 경로는 사이클마다, 상세 관측은 하루 한 줄(가격을 실제로 본 때만).

        ⚠️ 기록 전용이다. 이 값들로 사고파는 규칙은 하나도 만들지 않았다
           (표본이 차기 전에 임계값을 정하면 과최적화다).
        """
        if meta is None:
            return None
        sig = signals.get(row["symbol"]) or {}
        entry = row.get("entry_price")
        px = (price or {}).get("price")
        ret = (round((px / entry - 1) * 100, 3) if px and entry else None)
        # ① 사이클마다 남기는 CHIEF 경로(하루 한 줄로 줄이지 않는다).
        #    이 값은 지금 안 남기면 나중에 어떤 방법으로도 복원할 수 없다.
        _append_jsonl(os.path.join(self.dir, PATH_FILE), {
            "at": iso(now), "business_date": today_date, "trade_id": row["trade_id"],
            "symbol": row["symbol"], "holding_trading_days": holding_days,
            "chief_call": sig.get("call"), "chief_total": sig.get("total"),
            "chief_confidence": sig.get("confidence"),
            "observed_price": px, "return_pct": ret})
        # ② 상세 관측은 하루 한 줄.
        if meta.get("lastObservedDate") == today_date:
            return None
        # 🐛 2026-08-26 감사 지적 A: 예전에는 '기록했다' 표시를 성공 전에 찍어서,
        #    그날 첫 사이클에 시세가 실패하면 같은 날 뒤 사이클에 가격이 살아 있어도
        #    영영 쓰지 않았다(관측가 None짜리 행 하나만 남고 체크포인트도 비었다).
        #    가격을 실제로 본 사이클에만 쓰고, 표시도 그때 찍는다.
        if px is None or not entry:
            return None
        if self._regime is None:
            self._regime = load_market_regime()
        if self._idx_hist is None:
            self._idx_hist = load_index_history()
        market = row.get("market") or "KOSPI"
        # 📉 시장대비 — 요약·공개면과 **같은 규칙**을 쓴다(감사 지적 HIGH 1).
        #    예전에는 분모가 원장의 benchmark_entry_value(진입 시점에 직전 거래일로
        #    후퇴한 값)이고 분자가 오늘 시점에 후퇴한 값이라, 후퇴 폭이 다르면
        #    그 차이가 그대로 '초과수익'으로 붙었다(실측 2.18~5.09%p).
        #    이제 진입일과 '마지막 확정 거래일'의 확정 종가로만 계산하고,
        #    실제로 쓴 두 날짜를 행에 함께 남긴다(행만 봐도 검증할 수 있게).
        entry_day = row.get("entry_business_date")
        obs_day = latest_settled_index_day(self._idx_hist, market,
                                           after_day=entry_day, today=today_date)
        win = benchmark_window(self._idx_hist, market, entry_day, obs_day, ret, today_date)
        if obs_day is None:
            win["status"] = "NO_SETTLED_WINDOW"
        mfe = meta.get("mfePrice")
        mae = meta.get("maePrice")
        # 🕰️ 체크포인트는 '정확히 그 날'이 아니라 '넘어섰는가'로 판정한다(감사 지적 HIGH 2).
        #    흉내내려는 V1 규칙 자체가 holding_days >= 5이고, 러너가 하루 죽으면
        #    보유일이 4 → 6으로 건너뛴다(2026-08-19에 12사이클 연속 실패를 겪었다).
        #    ==로 잡으면 그 거래의 짝비교 재료가 통째로 사라지고, 장애는 변동성 큰 날과
        #    상관될 수 있어 결측이 편향된다. 늦게 찍힌 사실은 숨기지 않고 함께 적는다.
        crossed = list(meta.get("crossedCheckpoints") or [])
        due = [c for c in HORIZON_CHECKPOINTS if c not in crossed and holding_days >= c]
        obs = {
            "at": iso(now), "business_date": today_date,
            "trade_id": row["trade_id"], "symbol": row["symbol"], "name": row.get("name"),
            "market": market,
            "holding_trading_days": holding_days,
            # 5·20·60거래일은 '재평가 지점'이다 — 여기서 팔지 않는다.
            "horizon_checkpoints_crossed": due,
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
            "benchmark_entry_day": win["startDay"],
            "benchmark_observed_day": win["endDay"],
            "benchmark_entry_value": win["startValue"],
            "benchmark_observed_value": win["endValue"],
            "benchmark_return_pct": win["benchmarkReturnPct"],
            "relative_return_pct": win["relativeReturnPct"],
            "benchmark_status": win["status"],
            "benchmark_clock_note": BENCHMARK_CLOCK_NOTE + " 지수 구간은 마지막 확정 "
                                    "종가까지라 종목 쪽보다 하루 짧을 수 있다.",
            "market_regime": (self._regime or {}).get("key"),
            "observation_note": "기록 전용 — 이 값으로 만드는 매매 규칙은 없다",
        }
        # 📐 Layer A(짝비교) 재료 — 같은 진입에 '청산 규칙만' 달랐다면 어땠는지.
        #    ⚠️ 관측가 기준 근사다(실제 청산은 Best Bid로 체결된다).
        obs["counterfactual_exits"] = [
            {"checkpoint": c,
             "rule": "V1_MAX_HOLDING_5D" if c == 5 else "HORIZON_%dD" % c,
             "holding_trading_days_actual": holding_days,
             "late_by_trading_days": holding_days - c,
             "recorded_late": holding_days > c,
             "observed_price": px,
             "gross_return_pct": ret,
             "estimated_net_return_pct": net_return_pct(entry, px, market),
             "note": ("관측가 기준 근사 — 실제 청산은 Best Bid로 체결되므로 조금 낮다"
                      + ("" if holding_days == c else
                         " · %d거래일에 관측하지 못해 %d거래일에 기록했다(러너 공백)"
                         % (c, holding_days)))}
            for c in due]
        _append_jsonl(os.path.join(self.dir, OBS_FILE), obs)
        # ✅ 기록에 성공한 뒤에만 '오늘 찍었다'와 '체크포인트 소비'를 표시한다.
        meta["lastObservedDate"] = today_date
        if due:
            meta["crossedCheckpoints"] = sorted(set(crossed) | set(due))
        return obs

    # ── 자리가 꽉 찼을 때: 갈아타지 않고 비교만 남긴다 ──
    def _on_insufficient_cash(self, code, signals, latest, analysis_at, now, cash):
        """신규 후보 vs 보유 중 가장 약한 종목 — 결정은 '유지'로 고정한다.

        ⚠️ 실제로 갈아타지 않는다. 갈아타기 규칙(점수 차 몇 점부터 교체 같은)을
           지금 만들면 근거 없는 임계값이 된다. 여기서는 그때 무엇을 포기했는지만
           남겨서, 표본이 쌓인 뒤 "교체했다면/유지했다면"을 계산할 수 있게 한다.
        """
        # (못 산 후보 목록은 부모가 모아 두었다가 배치 1회로 시세를 조회한다)
        if self.state.get("lastShadowSwapBatch") == analysis_at:
            return None            # 비교 기록은 같은 분석 배치에 한 번만 남긴다
        self.state["lastShadowSwapBatch"] = analysis_at
        cand = signals.get(code) or {}
        opens = [r for r in latest.values() if r.get("status") == "OPEN"]
        meta_all = self.state.get("openMeta") or {}

        # 🐛 2026-08-26 감사 지적 M4: 예전에는 점수가 없는 종목에 999를 넣어
        #    "절대 최약체로 안 뽑히는" 종목을 만들었다. 그러면 비교 대상이 체계적으로
        #    어긋난다(모르는 것을 '아주 강하다'로 취급한 셈이다).
        #    → 점수가 있는 종목 중에서 고르고, 없으면 없다고 적는다.
        def _rank(r):
            s = signals.get(r["symbol"]) or {}
            # 보유 중 '가장 약한' 종목 = 진입 순위를 뒤집은 것뿐이다(새 점수 발명 0).
            return (s.get("total"), s.get("confidence"), r["symbol"])

        scored = [r for r in opens
                  if (signals.get(r["symbol"]) or {}).get("total") is not None]
        unscored = [r["symbol"] for r in opens if r not in scored]
        weakest = min(scored, key=_rank) if scored else None
        coverage = ("FULL" if opens and not unscored
                    else ("PARTIAL" if scored else ("MISSING" if opens else "NO_POSITIONS")))
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
            # 판단이 없는 보유 종목이 있으면 비교가 반쪽이라는 사실을 함께 적는다.
            "chief_coverage": coverage,
            "positionsWithoutChiefSignal": unscored or None,
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
            "chiefPathRecords": _count_lines(os.path.join(self.dir, PATH_FILE)),
            "skippedCandidateRecords": _count_lines(os.path.join(self.dir, SKIP_FILE)),
            # 🔒 표본이 차기 전에는 계좌 단위 성과도 숫자로 내지 않는다(URL로도 못 읽게).
            "accountMetricsGatedUntilEvidence": list(SHADOW_ACCOUNT_GATED),
            # 📐 비교는 반드시 두 층으로 읽어야 한다. 한 층만 보면 오해가 생긴다.
            #    실측 근거: V1은 신호 111건 중 91건이 현금 부족으로 진입조차 못 했다.
            #    그래서 두 지갑의 성적 차이에는 '전략 차이'와 '누가 자리를 먼저 차지했나'가
            #    섞여 있다. 그 둘을 분리해서 봐야 한다.
            "comparisonLayers": {
                "layerA": {
                    "name": "짝비교(같은 진입 · 청산 규칙만 다름)",
                    "source": f"{OBS_FILE}의 counterfactual_exit",
                    "note": "V2가 실제로 진입한 거래에 대해 '5거래일에 팔았다면'을 "
                            "그 시점 관측가로 함께 기록한다. 진입 집합이 같아 "
                            "청산 규칙의 효과만 비교할 수 있다."},
                "layerB": {
                    "name": "지갑 전체 운용(각자 별도 계좌)",
                    "source": "paper_trading/summary.json vs smart_v2/summary.json",
                    "note": "자리 배분·현금 제약까지 포함한 결과다. 진입 집합이 서로 "
                            "다를 수 있어 전략 차이만으로 해석하면 안 된다."},
                "warning": "한 층만 인용하지 말 것. 자리 부족(SKIP)이 결과를 좌우한다.",
            },
            # 🚫 60거래일은 '보유 상한'일 뿐이다. 60D 성적·적중률을 주장하지 않는다
            #    (docs/gaeo_validation_policy.md: 60D는 평가 가능한 판단이 0건).
            "horizonPerformanceClaim": "NONE",
            "horizonClaimNote": ("60거래일은 무한보유를 막는 상한이지 성능 구간이 아니다. "
                                 "이 전략은 60D 성적·적중률을 어떤 형태로도 주장하지 않는다."),
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
    # 🔒 Single Writer — V1과 같은 게이트. 비활성 러너는 시세 조회조차 하지 않는다.
    if not paper_single_writer.allow("smart_v2"):
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
