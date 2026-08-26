#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Paper Momentum V1 — 업종 흐름 급등주 단기 보유 (두 번째 전략).

무엇인가
    "업종 흐름에서 고른 종목(rotation_picks)을 사서 며칠 안에 파는 방식이
    실제로 어땠는가"를 기존 전략과 **완전히 분리된 가상계좌**로 기록한다.

무엇이 아닌가 — 절대 규칙
    ⛔ PAPER_BASELINE_V1(paper_engine.py)을 한 줄도 바꾸지 않는다.
       진입 신호만 갈아끼우고 체결·회계·청산·기록은 V1 코드를 그대로 물려받는다.
       (같은 로직을 여기 다시 구현하면 두 전략이 조용히 갈라진다)
    ⛔ 기본값 OFF. GAEO_PAPER_MOMENTUM=1 일 때만 실제로 돈다.
       끄면 코드를 되돌릴 필요 없이 즉시 원래 상태다.
    ⛔ 원장 분리. 별도 폴더(paper_trading/momentum) + 별도 environment라
       V1의 성적·현금과 절대 섞이지 않는다. 공개 화면(paper_public)도 이 기록을
       읽지 않는다.
    ⛔ 새 랭킹을 발명하지 않는다. rotation_picks.js가 이미 정한 순서를 그대로 쓴다.

설계 근거 (docs/paper_daytrade_research.md)
    599종목 × 298거래일 사전 검증에서
      · 보유 1거래일은 왕복비용 0.48%를 넘으면 5거래일보다 불리했다 → 3거래일 채택
      · 3~4종목으로 좁히는 것은 근거가 없었다(10종목이 모든 구간에서 우세)
        → 하루 상한 4개를 3거래일 들고 가므로 동시 보유가 자연히 10개 안팎이 된다.
          "하루 3~4종목"과 "분산 10종목"을 동시에 만족시키는 지점이다.
    ⚠️ 비용 모델은 여전히 미검증(COST_MODEL_INCOMPLETE)이다. 회전이 빠른 전략일수록
       이 누락이 결과를 뒤집을 수 있다는 점을 기록으로 남긴다.

알려진 특성
    · 기간 만료 청산의 내부 사유 코드가 V1과 같은 'MAX_HOLDING_5D'로 찍힌다.
      이 전략의 실제 보유 상한은 3거래일이다. 코드 문자열을 바꾸려면 V1의
      _manage_positions를 고쳐야 해서(= V1 diff 0 위반) 그대로 둔다.
      화면에는 어차피 '최대 보유기간 도달'로 번역되어 나가므로 사용자에게
      틀린 말이 보이지는 않는다. 실제 보유일은 holding_trading_days에 남는다.
"""
import json
import os
import re
import sys

import paper_market_data as pmd
import paper_single_writer
from paper_engine import HERE, PaperEngine

STRATEGY_VERSION = "PAPER_MOMENTUM_V1"
# 격리는 ① 폴더 분리(아래 DATA_DIR) ② environment 분리 ③ trade_id 해시에 전략명 포함,
# 이렇게 3중이다. 다만 Ledger.known_ids()는 environment를 거르지 않으므로
# "environment만으로 모든 게 걸러진다"고 믿으면 안 된다 — 폴더 분리가 1차 방어선이다.
ENVIRONMENT = "LIVE_PAPER_MOMENTUM"
ENABLE_ENV = "GAEO_PAPER_MOMENTUM"
# 러너의 커밋 화이트리스트가 paper_trading/ 이므로 그 **안에** 둔다(경계를 넓히지 않는다).
DATA_DIR = os.path.join(HERE, "paper_trading", "momentum")
MAX_HOLDING_TRADING_DAYS = 3
INITIAL_CASH_KRW = 10_000_000
POSITION_SIZE_KRW = 1_000_000


def load_rotation_picks(path=None):
    """rotation_picks.js에서 오늘의 후보를 읽는다.

    파일이 없거나 깨졌으면 빈 목록을 돌려준다 — 후보를 추측해 만들지 않는다.
    """
    path = path or os.path.join(HERE, "rotation_picks.js")
    try:
        s = open(path, encoding="utf-8").read()
        m = re.search(r"ROTATION_PICKS\s*=\s*(\{.*\})\s*;", s, re.S)
        if not m:
            return {"picks": [], "generatedAt": None, "status": "unreadable"}
        d = json.loads(m.group(1))
    except (OSError, ValueError):
        return {"picks": [], "generatedAt": None, "status": "unavailable"}
    return {"picks": [p for p in (d.get("picks") or []) if p.get("code")],
            "generatedAt": d.get("generatedAt"),
            "status": d.get("status")}


class MomentumEngine(PaperEngine):
    """진입 신호만 바꾼 V1. 나머지는 전부 부모 코드를 그대로 쓴다."""

    def __init__(self, provider, data_dir=None, config=None, environment=ENVIRONMENT):
        # 🐛 2026-08-21 검수에서 잡힘: 첫 실행 때 폴더가 없으면 baseline 기록
        #    (_write_equity의 open(...,'a'))이 FileNotFoundError로 죽는다. 부모는
        #    "원장 폴더는 이미 있다"는 전제로 쓰여 있고(V1은 paper_trading/이 저장소에
        #    커밋돼 있어 이 경로를 겪지 않는다), run_safe()가 예외를 삼키므로 켜도
        #    매 사이클 조용히 아무 일도 일어나지 않았다.
        #    ⚠️ 부모(V1)를 고치지 않으려고 여기서 먼저 만든다.
        # 🔒 data_dir 기본값도 여기서 못박는다. 부모 기본값은 V1 폴더라서, 인자를
        #    빠뜨린 채 만들면 모멘텀 거래가 V1 원장 파일에 섞여 들어간다.
        data_dir = data_dir or DATA_DIR
        os.makedirs(data_dir, exist_ok=True)
        super().__init__(provider, data_dir=data_dir, config=config,
                         environment=environment)

    def _load_config(self):
        path = os.path.join(self.dir, "config.json")
        if os.path.exists(path):
            return json.load(open(path, encoding="utf-8"))
        return {"strategyVersion": STRATEGY_VERSION,
                "initial_cash_krw": INITIAL_CASH_KRW,
                "position_size_krw": POSITION_SIZE_KRW,
                "maxHoldingTradingDays": MAX_HOLDING_TRADING_DAYS}

    def _process_entries(self, signals, analysis_at, now, in_session, latest, actions):
        """GAEO Score의 BUY 전환 대신 '업종 흐름에서 고른 종목'을 진입 후보로 쓴다.

        ⚠️ 체결가·수량·현금·기록은 부모(_process_entries)가 하던 그대로다.
           여기서 다시 구현하면 두 전략의 체결 규칙이 조용히 갈라진다.
        """
        if not in_session:
            actions.append("장외 시간 — 신규 진입 보류(다음 개장 사이클에 처리)"
                           if getattr(self, "_session_known", True) else
                           "정규장 시간 정보 없음 — 신규 진입 보류(캘린더 응답 확인 필요)")
            return "DEFERRED"

        bundle = load_rotation_picks()
        picks = bundle["picks"]
        if not picks:
            actions.append("업종 흐름 후보 없음(시장 게이트 관망) — 신규 진입 없음")
            return "PROCESSED"
        # 🕰️ 신선도 게이트 — 후보 목록이 오늘 만들어진 것이 아니면 사지 않는다.
        #    update-analysis 워크플로가 compute_rotation_picks 실패를 삼키기 때문에
        #    "분석은 새것인데 후보 목록은 며칠 전 것"인 조합이 실제로 생길 수 있다.
        #    낡은 목록으로 사는 것은 추측으로 사는 것과 같다.
        stamp = str(bundle.get("generatedAt") or "")[:10]
        if stamp != now.strftime("%Y-%m-%d"):
            actions.append(f"업종 흐름 후보가 오늘 것이 아님({stamp or '생성시각 없음'}) "
                           "— 신규 진입 보류")
            return "PROCESSED"

        held = {r.get("symbol") for r in latest.values() if r.get("status") == "OPEN"}
        candidates = {}
        for rank, p in enumerate(picks):
            code = p["code"]
            if code in held or code in candidates:
                continue          # 이미 들고 있으면 다시 사지 않는다(중복 진입 금지)
            # 🐛 GAEO 판단이 이미 「매도 고려」인 종목은 사지 않는다. 사면 같은 사이클
            #    ④단계(_manage_positions)가 CHIEF_SELL로 곧바로 되팔아, 호가 차이만큼
            #    확정 손실을 내고 보유 0일짜리 거래가 원장에 남는다(검수에서 실측).
            if (signals.get(code) or {}).get("call") == "SELL":
                continue
            # confidence/total은 부모의 정렬 기준일 뿐이다. rotation_picks가 정한
            # 순서를 그대로 보존하려고 역순 번호를 넣는다(새 점수를 만들지 않는다).
            order = len(picks) - rank
            candidates[code] = {"call": "BUY", "confidence": order, "total": order,
                                "name": p.get("name") or code}
        if not candidates:
            actions.append("업종 흐름 후보가 모두 보유 중 — 신규 진입 없음")
            return "PROCESSED"

        # 부모는 '직전에 BUY가 아니었던 종목'만 후보로 본다. 이 전략에는 그 개념이
        # 없으므로 판정에 쓰이는 직전 판단만 잠시 비운다. 호출이 끝나면 되돌린다.
        prev_calls = self.state.get("lastCall")
        self.state["lastCall"] = {}
        try:
            return super()._process_entries(candidates, analysis_at, now, in_session,
                                            latest, actions)
        finally:
            self.state["lastCall"] = prev_calls


def run_safe():
    """러너 진입점 — 꺼져 있으면 아무 것도 하지 않고, 어떤 실패도 V1에 영향이 없다."""
    if os.environ.get(ENABLE_ENV) != "1":
        print(f"[momentum] 꺼져 있음 — 아무 것도 하지 않는다 (켜려면 {ENABLE_ENV}=1)")
        return 0
    # 🔒 Single Writer — V1과 같은 게이트. 비활성 러너는 시세 조회조차 하지 않는다.
    if not paper_single_writer.allow("momentum"):
        return 0
    try:
        provider = pmd.TossMarketDataProvider()
        engine = MomentumEngine(provider, data_dir=DATA_DIR, environment=ENVIRONMENT)
        print("[momentum]", engine.run_cycle())
    except Exception as e:      # noqa: BLE001 — advisory 원칙(V1과 동일)
        print(f"[momentum] 실패(기존 전략 무영향): {type(e).__name__}: {str(e)[:160]}")
    return 0


if __name__ == "__main__":
    sys.exit(run_safe())
