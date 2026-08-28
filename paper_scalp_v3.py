#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Paper Scalp V3 — 단타 실험 전략 (시장 폭 게이트 + 단기 모멘텀 + 익절/손절).

무엇인가
    "횡보장에서 먹힐 수 있는 단타"를 대표 요청(2026-08-27)으로 만들되, 규칙은
    감으로 정하지 않고 price_history.js 599종목 × 303거래일 사전 검증으로 정했다.
    근거와 한계는 docs/paper_scalp_v3_research.md 에 전부 있다.

무엇이 아닌가 — 절대 규칙
    ⛔ V1(paper_engine.py)을 한 줄도 바꾸지 않는다. 진입 신호와 청산 판정만
       hook(_process_entries · _observe_position · _exit_reason)으로 갈아끼우고
       체결·회계·기록은 부모 코드를 그대로 물려받는다.
    ⛔ 원장 3중 격리(momentum·smart_v2와 동일): ① 폴더 분리(paper_trading/scalp_v3)
       ② environment 분리 ③ trade_id 해시에 전략명 포함.
    ⛔ 과거 가상체결을 만들지 않는다(Backfill 0). 최초 실행은 Baseline 캡처만.
    ⛔ 가격 추측 금지. 이번 사이클에 실제로 관측한 가격이 없으면 익절/손절을
       판정하지 않는다(다음 관측에서 판정).

전략 규칙 (사전 검증으로 채택 — 연구 문서의 3차 결과)
    · 시장 폭 게이트: 전 종목 5거래일 수익률 중앙값 ≥ 0 일 때만 신규 진입.
      음수면 그날은 관망(최근 60거래일 검증에서 -1.63% → -0.00%로 구제된 핵심).
    · 진입 후보: 종가 > MA20 · 종가 > MA60 · 20거래일 수익률 > 0
      (compute_rotation_picks.py 자격 필터와 동일 — 새 랭킹 발명 금지).
      20거래일 수익률 상위 순, 하루 최대 3종목이며 **업종당 1종목**(업종 쏠림 방지).
      GAEO 판단이 SELL인 종목 제외, 보유 중·당일 거래(진입/청산) 종목 재진입 금지.
    · 자금: 종목당 250만원(2026-08-28 상향). 하루 최대 노출 750만원.
    · 청산: 익절 +3% · 손절 -2% · 2거래일 시간청산 · CHIEF SELL 전환(안전판).
      익절/손절은 사이클 관측가(약 30분 주기) 기준 판정 — 분봉 극값은 놓친다(한계).

알려진 특성
    · "단타"라지만 이 시스템의 관측 주기는 약 30분이라 초 단위 스캘핑이 아니다.
      실제 회전은 당일~2거래일이다. 화면·문서 모두 이 한계를 그대로 밝힌다.
    · 익절/손절 판정가(관측가)와 체결가(Best Bid)는 다르다 — 체결이 조금 낮을 수 있다.

켜고 끄기
    기본 ON. 끄려면 GAEO_PAPER_SCALP_V3=0 (smart_v2와 같은 패턴 — 코드 수정 불필요).
"""
import json
import os
import re
import statistics
import sys

import paper_market_data as pmd
import paper_single_writer
from paper_engine import HERE, PaperEngine

STRATEGY_VERSION = "PAPER_SCALP_V3"
ENVIRONMENT = "LIVE_PAPER_SCALP_V3"
DISABLE_ENV = "GAEO_PAPER_SCALP_V3"          # "0"이면 끈다(기본 ON)
# 러너의 커밋 화이트리스트가 paper_trading/ 이므로 그 **안에** 둔다(경계를 넓히지 않는다).
DATA_DIR = os.path.join(HERE, "paper_trading", "scalp_v3")
INITIAL_CASH_KRW = 10_000_000
# 💰 2026-08-28 대표 결정으로 종목당 100만원 → 250만원, 하루 4종목 → 3종목.
#    하루 최대 노출은 400만원 → 750만원. 근거는 docs/paper_scalp_v3_research.md 7절
#    (303거래일 포트폴리오 시뮬레이션: 현금·가동률·최대낙폭까지 포함해 재검증).
#    ⚠️ Forward 전환이다 — 이미 열린 거래는 진입 당시 크기를 그대로 유지한다.
POSITION_SIZE_KRW = 2_500_000
MAX_HOLDING_TRADING_DAYS = 2
TAKE_PROFIT_PCT = 3.0
STOP_LOSS_PCT = -2.0
MAX_NEW_ENTRIES_PER_DAY = 3
# 🧺 업종당 최대 보유 수(대표 요청 "업종 흐름 반영"을 데이터가 지지하는 형태로 구현).
#    종목당 금액이 커질수록 3종목이 한 업종에 몰렸을 때 타격이 커진다. 실측(횡보 60일):
#    250만원에서 업종 제한 없음 -13.0%(낙폭 -29.2%) → 업종당 1종목 +1.5%(낙폭 -17.4%).
#    사이즈가 작을 땐 효과가 없다(100만원에서는 -4.9% vs -5.2%) — 큰 사이즈의 짝 규칙이다.
SECTOR_CAP = 1
# 시장 폭 게이트: 5거래일 수익률 중앙값 계산에 필요한 최소 종목 수.
# 이보다 적으면 시장 상태를 추측하지 않고 그날 진입을 보류한다(fail closed).
MIN_BREADTH_STOCKS = 100
# 📊 수집 커버리지 하한(2026-08-27 점검에서 추가).
#    개장 직후에는 오늘 종가가 아직 절반만 수집돼 있다(실측: 08-26 09:14 54.8% →
#    09:44 99.7%, 08-27 09:13 51.4% → 11:35 99.8%). 그 부분 표본으로 중앙값을 내면
#    같은 날인데도 값이 크게 달라져(08-27 실측 0.55 vs 0.935, 기준선은 0) 게이트
#    판정이 뒤집힐 수 있고, 상위 4종목 후보도 달라진다. 절대 종목 수 하한만으로는
#    308종목짜리 부분 표본이 그냥 통과한다. 수집은 한 사이클 안에 끝나므로,
#    덜 찬 표본으로 추측하는 대신 다음 사이클을 기다린다(fail closed).
MIN_BREADTH_COVERAGE = 0.9

EXIT_TAKE_PROFIT = "TAKE_PROFIT"
EXIT_STOP_LOSS = "STOP_LOSS"
EXIT_TIME = "TIME_EXIT_2D"                   # V1 MAX_HOLDING_5D와 절대 섞지 않는다

DEFAULT_CONFIG = {
    "schemaVersion": "gaeo_paper_config_v1",
    "strategyVersion": STRATEGY_VERSION,
    "strategyRole": "EXPERIMENT",
    "baselineStrategy": "PAPER_BASELINE_V1",
    "forwardStart": None,            # 엔진이 실제로 처음 돈 날이 Forward 시작이다
    "initial_cash_krw": INITIAL_CASH_KRW,
    "position_size_krw": POSITION_SIZE_KRW,
    "maxHoldingTradingDays": MAX_HOLDING_TRADING_DAYS,
    "takeProfitPct": TAKE_PROFIT_PCT,
    "stopLossPct": STOP_LOSS_PCT,
    "maxNewEntriesPerDay": MAX_NEW_ENTRIES_PER_DAY,
    "sectorCap": SECTOR_CAP,
    "signalSource": "price_history.js 종가 (MA20·MA60·20거래일 수익률·시장 폭 중앙값)",
    "entryRule": ("시장 폭 게이트(전 종목 5거래일 수익률 중앙값 >= 0) 통과 시, "
                  "종가>MA20 · 종가>MA60 · 20거래일 수익률>0 종목을 20거래일 수익률 "
                  "상위 순으로 하루 최대 3종목(업종당 1종목). "
                  "장중 Best Ask 체결(V1과 동일)"),
    "exitRule": ("관측가 기준 익절 +3% 또는 손절 -2%, 2거래일 시간청산, "
                 "CHIEF SELL 전환(안전판). Best Bid 체결(V1과 동일)"),
    "evidence": "docs/paper_scalp_v3_research.md (2026-08-27 사전 검증)",
    "knownLimits": ("익절/손절은 약 30분 관측 주기로 판정 — 분봉 극값은 놓친다. "
                    "판정가(관측가)와 체결가(Best Bid)는 다르다. 슬리피지 미모형화."),
}


def load_sector_map(path=None):
    """code → 업종명 (tickers.js — 홈 업종 흐름과 같은 소스).

    읽지 못하면 빈 dict를 돌려주고, 그 경우 업종 제한은 자동으로 적용되지 않는다
    (업종을 추측해 묶지 않는다 — 잘못 묶으면 분산이 아니라 왜곡이 된다).
    """
    path = path or os.path.join(HERE, "tickers.js")
    try:
        s = open(path, encoding="utf-8").read()
        m = re.search(r"const TICKERS = (\[.*?\]);", s, re.S)
        if not m:
            return {}
        rows = json.loads(m.group(1))
    except (OSError, ValueError):
        return {}
    return {r["code"]: r.get("sector") or "기타"
            for r in rows if isinstance(r, dict) and r.get("code")}


def load_daily_closes(path=None):
    """price_history.js에서 {code: [(date, close), ...]}(날짜 오름차순)를 읽는다.

    파일이 없거나 깨졌으면 빈 dict — 후보를 추측해 만들지 않는다.
    """
    path = path or os.path.join(HERE, "price_history.js")
    try:
        s = open(path, encoding="utf-8").read()
        m = re.search(r"PRICE_HISTORY\s*=\s*(\{.*\})\s*;", s, re.S)
        if not m:
            return {}
        raw = json.loads(m.group(1))
    except (OSError, ValueError):
        return {}
    out = {}
    for code, pages in raw.items():
        if not isinstance(pages, list):
            continue
        days = []
        for p in pages:
            for d in (p.get("days") or []) if isinstance(p, dict) else []:
                c = d.get("close")
                if isinstance(c, (int, float)) and c > 0 and d.get("date"):
                    days.append((d["date"], float(c)))
        days.sort()
        if days:
            out[code] = days
    return out


def scan_candidates(closes_by_code):
    """(참고일, 시장폭 중앙값, 자격 후보 [(ret20 내림차순) (code, ret20)]) 를 계산한다.

    참고일 = 데이터에 있는 가장 최근 날짜. look-ahead 없음 — 그날까지의 종가만 쓴다.
    시장폭 표본이 MIN_BREADTH_STOCKS 미만이거나 전체 종목 대비 커버리지가
    MIN_BREADTH_COVERAGE 미만이면 (ref_day, None, [])로 fail closed —
    수집이 덜 끝난 부분 표본으로 시장 상태를 판정하지 않는다.
    """
    ref_day = None
    for days in closes_by_code.values():
        if days and (ref_day is None or days[-1][0] > ref_day):
            ref_day = days[-1][0]
    if ref_day is None:
        return None, None, []
    breadth = []
    quals = []
    for code, days in closes_by_code.items():
        if days[-1][0] != ref_day:
            continue                      # 참고일 데이터가 없는 종목은 계산에서 제외
        closes = [c for _, c in days]
        n = len(closes)
        if n >= 6:
            breadth.append((closes[-1] / closes[-6] - 1) * 100)
        if n < 61:
            continue
        c = closes[-1]
        ma20 = sum(closes[-20:]) / 20
        ma60 = sum(closes[-60:]) / 60
        ret20 = (c / closes[-21] - 1) * 100
        if c > ma20 and c > ma60 and ret20 > 0:
            quals.append((code, ret20))
    total = len(closes_by_code)
    if (len(breadth) < MIN_BREADTH_STOCKS
            or (total and len(breadth) / total < MIN_BREADTH_COVERAGE)):
        return ref_day, None, []
    quals.sort(key=lambda x: (-x[1], x[0]))
    return ref_day, statistics.median(breadth), quals


class ScalpV3Engine(PaperEngine):
    """진입 신호·청산 판정만 바꾼 V1. 체결·회계·기록은 전부 부모 코드를 쓴다."""

    def __init__(self, provider, data_dir=None, config=None, environment=ENVIRONMENT):
        # 🔒 기본값을 여기서 못박는다. 부모 기본값은 V1 폴더라, 인자를 빠뜨린 채
        #    만들면 이 전략의 거래가 V1 원장에 섞여 들어간다(momentum·smart_v2와 동일).
        data_dir = data_dir or DATA_DIR
        os.makedirs(data_dir, exist_ok=True)
        super().__init__(provider, data_dir=data_dir, config=config,
                         environment=environment)
        # 이번 사이클에 실제로 관측한 보유 종목 가격(익절/손절 판정용).
        # _observe_position이 행마다 그 사이클 값으로 덮어쓴다 — 실패 시 None이 들어가
        # 지난 사이클의 낡은 가격으로 판정하는 일이 없다(가격 추측 금지).
        self._cycle_px = {}

    def _load_config(self):
        path = os.path.join(self.dir, "config.json")
        if os.path.exists(path):
            return json.load(open(path, encoding="utf-8"))
        cfg = json.loads(json.dumps(DEFAULT_CONFIG))      # 깊은 복사(상수 오염 방지)
        # 🐛 2026-08-27 QA 지적: 공개 스냅샷(paper_public)은 config.json의 존재로
        #    실데이터/준비중(PREPARING)을 가르는데, 설정을 메모리에만 두면 이 파일을
        #    아무도 만들지 않아 V3 탭이 영원히 "준비 중"에 갇힌다. 그래서 첫 로드에서
        #    기본 설정을 디스크에 남긴다. 실패해도 매매는 막지 않는다(advisory).
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(cfg, f, ensure_ascii=False, indent=1)
        except OSError:
            pass
        return cfg

    def _load_state(self):
        """🔒 전략 이름을 여기서 못박는다(smart_v2 감사 지적 M1과 동일한 이유).

        부모는 config에 strategyVersion이 없으면 V1 상수로 폴백해 trade_id가
        V1과 똑같아진다 — 설정이 어떻든 이 전략의 이름은 하나다.
        """
        st = super()._load_state()
        st["strategyVersion"] = STRATEGY_VERSION
        return st

    # ── 진입: 시장 폭 게이트 + 단기 모멘텀 상위 4종목 ──
    def _process_entries(self, signals, analysis_at, now, in_session, latest, actions):
        """⚠️ 체결가·수량·현금·기록은 부모(_process_entries)가 하던 그대로다."""
        if not in_session:
            actions.append("장외 시간 — 신규 진입 보류(다음 개장 사이클에 처리)"
                           if getattr(self, "_session_known", True) else
                           "정규장 시간 정보 없음 — 신규 진입 보류(캘린더 응답 확인 필요)")
            return "DEFERRED"

        today = now.strftime("%Y-%m-%d")
        ref_day, breadth_median, quals = scan_candidates(load_daily_closes())
        # 🕰️ 신선도 게이트 — 가격 데이터가 오늘 것이 아니면 사지 않는다.
        #    낡은 데이터로 고른 후보는 추측으로 고른 것과 같다(momentum의 stamp 게이트와 동일).
        if ref_day != today:
            actions.append(f"가격 데이터가 오늘 것이 아님({ref_day or '없음'}) — 신규 진입 보류")
            return "PROCESSED"
        if breadth_median is None:
            actions.append("시장 폭 표본 부족 — 시장 상태를 추측하지 않고 신규 진입 보류")
            return "PROCESSED"
        if breadth_median < 0:
            actions.append(f"시장 폭 게이트 관망(5거래일 중앙값 {breadth_median:+.2f}%) — 신규 진입 없음")
            return "PROCESSED"
        if not quals:
            actions.append("자격 후보 없음(단기 상승 흐름 종목 없음) — 신규 진입 없음")
            return "PROCESSED"

        # 보유 중 재진입 금지 + 당일 거래(진입·청산) 종목 재진입 금지(손절 직후 재매수 방지)
        held = {r.get("symbol") for r in latest.values() if r.get("status") == "OPEN"}
        traded_today = {r.get("symbol") for r in latest.values()
                        if r.get("entry_business_date") == today
                        or r.get("exit_business_date") == today}
        # 하루 신규 진입 상한 — 이미 오늘 들어간 수만큼 차감한다.
        entered_today = sum(1 for r in latest.values()
                            if r.get("entry_business_date") == today)
        room = MAX_NEW_ENTRIES_PER_DAY - entered_today
        if room <= 0:
            actions.append(f"오늘 신규 진입 상한({MAX_NEW_ENTRIES_PER_DAY}종목) 도달 — 추가 진입 없음")
            return "PROCESSED"

        # 🧺 업종 흐름 반영 — 같은 업종을 SECTOR_CAP개까지만 담는다.
        #    이미 보유 중인 종목의 업종도 함께 세어, 어제 산 업종에 오늘 또 얹지 않는다.
        sectors = load_sector_map()
        cap = self.config.get("sectorCap") or SECTOR_CAP
        used_sectors = {}
        if sectors:
            for r in latest.values():
                if r.get("status") == "OPEN":
                    s_ = sectors.get(r.get("symbol"))
                    if s_:
                        used_sectors[s_] = used_sectors.get(s_, 0) + 1

        candidates = {}
        for rank, (code, _ret20) in enumerate(quals):
            if len(candidates) >= room:
                break
            if code in held or code in traded_today or code in candidates:
                continue
            # 업종 맵을 못 읽었으면(빈 dict) 제한을 적용하지 않는다 — 추측 금지.
            if sectors:
                sec = sectors.get(code)
                if sec and used_sectors.get(sec, 0) >= cap:
                    continue
            # GAEO 판단이 이미 SELL인 종목은 사지 않는다 — 사면 같은 사이클 ④단계가
            # CHIEF_SELL로 곧바로 되팔아 보유 0일짜리 확정 손실이 남는다(momentum 실측).
            if (signals.get(code) or {}).get("call") == "SELL":
                continue
            # 정렬 보존용 역순 번호 — 부모의 정렬 기준(confidence)에 태워 보낼 뿐,
            # 새 점수를 만들지 않는다(momentum과 동일한 방식).
            order = len(quals) - rank
            name = (signals.get(code) or {}).get("name") or code
            candidates[code] = {"call": "BUY", "confidence": order, "total": order,
                                "name": name}
            if sectors:
                sec = sectors.get(code)
                if sec:
                    used_sectors[sec] = used_sectors.get(sec, 0) + 1
        if not candidates:
            actions.append("자격 후보가 모두 보유·당일거래·매도판단 — 신규 진입 없음")
            return "PROCESSED"

        # 부모는 '직전에 BUY가 아니었던 종목'만 후보로 본다. 이 전략에는 그 개념이
        # 없으므로 판정에 쓰이는 직전 판단만 잠시 비운다(momentum과 동일). 끝나면 복원.
        prev_calls = self.state.get("lastCall")
        self.state["lastCall"] = {}
        try:
            return super()._process_entries(candidates, analysis_at, now, in_session,
                                            latest, actions)
        finally:
            self.state["lastCall"] = prev_calls

    # ── 청산: 익절/손절(관측가) → CHIEF SELL → 2거래일 시간청산 ──
    def _observe_position(self, row, price, meta, signals, now, today_date, holding_days):
        """이번 사이클 관측가를 익절/손절 판정용으로 남긴다(기록 전용, 부모 흐름 그대로).

        관측 실패면 None을 넣어 지난 사이클 가격으로 판정하는 일을 막는다.
        """
        self._cycle_px[row["trade_id"]] = (price or {}).get("price")
        return None

    def _exit_reason(self, row, cur_call, holding_days):
        px = self._cycle_px.get(row["trade_id"])
        entry = row.get("entry_price")
        if px and entry:
            ret = (px / entry - 1) * 100
            tp = self.config.get("takeProfitPct", TAKE_PROFIT_PCT)
            sl = self.config.get("stopLossPct", STOP_LOSS_PCT)
            if ret >= tp:
                return EXIT_TAKE_PROFIT
            if ret <= sl:
                return EXIT_STOP_LOSS
        if cur_call == "SELL":
            return "CHIEF_SELL"
        cap = self.config.get("maxHoldingTradingDays") or MAX_HOLDING_TRADING_DAYS
        if holding_days >= cap:
            return EXIT_TIME
        return None


def run_safe():
    """러너 진입점 — 어떤 실패도 V1·V2에 영향이 없다."""
    if os.environ.get(DISABLE_ENV) == "0":
        print(f"[scalp_v3] 꺼져 있음({DISABLE_ENV}=0) — 아무 것도 하지 않는다")
        return 0
    # 🔒 Single Writer — V1과 같은 게이트. 비활성 러너는 시세 조회조차 하지 않는다.
    if not paper_single_writer.allow("scalp_v3"):
        return 0
    try:
        provider = pmd.TossMarketDataProvider()
        engine = ScalpV3Engine(provider, data_dir=DATA_DIR, environment=ENVIRONMENT)
        print("[scalp_v3]", engine.run_cycle())
    except Exception as e:      # noqa: BLE001 — advisory 원칙(V1과 동일)
        print(f"[scalp_v3] 실패(기존 전략 무영향): {type(e).__name__}: {str(e)[:160]}")
    return 0


if __name__ == "__main__":
    sys.exit(run_safe())
