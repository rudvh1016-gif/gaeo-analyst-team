#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""V1과 Smart V2를 '같은 신호' 기준으로 짝지어 상태만 집계한다 (성과 결론 없음).

무엇을 푸는 문제인가
    V1(PAPER_BASELINE_V1)과 Smart V2(PAPER_SMART_V2)는 같은 Production CHIEF의
    같은 BUY 전환에서 출발한다. 그런데 두 원장의 trade_id는 전략 이름을 해시에
    넣어 만들기 때문에 서로 다르다. 그래서 "같은 신호를 두 전략이 어떻게 다르게
    끌고 갔는가"를 기계로 맞춰볼 방법이 없었다.

어떻게 푸나
    paper_engine.source_episode_id_for(symbol, signal_at) 가 만드는
    전략 독립 id(source_episode_id)를 두 원장이 진입할 때 각자 기록한다.
    같은 배치의 같은 종목이면 두 원장의 값이 같아진다. 여기서는 그 값을 읽어
    교집합을 셀 뿐이다 — 새로 계산하거나 추정하지 않는다.

⭐ 절대 규칙 (이 파일이 지키는 것)
    · 과거 원장을 다시 쓰지 않는다. 읽기 전용이다.
    · Backfill 0. source_episode_id가 없는 과거 행은 LEGACY_UNPAIRED로 남긴다.
      종목명과 날짜가 비슷하다는 이유로 짝을 만들어내지 않는다.
    · 짝은 "양쪽 원장에 실제 진입(OPEN/CLOSED) 기록이 있는 Episode"만 인정한다.
      현금이 없어 못 산 SKIP 행은 진입이 아니므로 짝이 되지 않는다.
    · 표본이 차기 전에는 Smart V2의 계좌 성과 숫자를 만들지도, 내보내지도 않는다.
      Evidence 기준은 새로 만들지 않고 paper_engine의 기존 값을 그대로 쓴다.
    · 승자를 선언하지 않는다. 전략을 자동으로 바꾸지 않는다.
"""
import json
import os

import re

from paper_engine import (EVIDENCE_GATED_FIELDS, MIN_CLOSED_FOR_EVIDENCE,
                          MIN_ENTRY_DAYS_FOR_EVIDENCE, SOURCE_EPISODE_SCHEMA)

HERE = os.path.dirname(os.path.abspath(__file__))

V1_DIR = os.path.join(HERE, "paper_trading")
V2_DIR = os.path.join(HERE, "paper_trading", "smart_v2")

V1_STRATEGY = "PAPER_BASELINE_V1"
V2_STRATEGY = "PAPER_SMART_V2"

# 실제로 '진입한' 상태. SKIPPED_* 는 진입이 아니다(짝을 만들지 않는다).
ENTERED_STATUSES = ("OPEN", "CLOSED")

# Evidence 단계 라벨. 새 임계값을 만들지 않는다 — 아래 판정은 전부
# paper_engine의 MIN_CLOSED_FOR_EVIDENCE · MIN_ENTRY_DAYS_FOR_EVIDENCE만 본다.
EVIDENCE_INSUFFICIENT = "INSUFFICIENT"
EVIDENCE_BUILDING = "BUILDING"
EVIDENCE_READY = "READY"

# 공개해도 안전한 것만 담는다. 계좌 성과(수익률·평가액·MDD·현금)는 여기 없다.
PERFORMANCE_HIDDEN = "HIDDEN — INSUFFICIENT EVIDENCE"


def read_ledger(path):
    """trades.jsonl을 행 리스트로. 없으면 빈 리스트(에러가 아니다 — 아직 안 돈 것)."""
    if not os.path.exists(path):
        return []
    rows = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                # 깨진 줄 하나 때문에 전체 판정을 포기하지 않는다. 조용히 건너뛴다
                # (원장은 append-only라 마지막 줄이 잘려 있을 수 있다).
                continue
    return rows


def latest_by_trade_id(rows):
    """trade_id → 마지막 행. 원장은 append-only라 뒤에 오는 행이 최신 상태다."""
    out = {}
    for r in rows:
        tid = r.get("trade_id")
        if tid:
            out[tid] = r
    return out


def entered_episodes(rows):
    """실제 진입한 Episode: source_episode_id → 마지막 상태 행.

    source_episode_id가 없는 행(도입 전 과거 거래)은 애초에 담지 않는다.
    """
    out = {}
    for r in latest_by_trade_id(rows).values():
        eid = r.get("source_episode_id")
        if eid and r.get("status") in ENTERED_STATUSES:
            out[eid] = r
    return out


def legacy_unpaired_count(rows):
    """source_episode_id 없이 진입했던 과거 거래 수. 소급해 채우지 않는다."""
    return sum(1 for r in latest_by_trade_id(rows).values()
               if not r.get("source_episode_id") and r.get("status") in ENTERED_STATUSES)


def _entry_day(row):
    return row.get("entry_business_date") or (row.get("signal_at") or "")[:10]


#: Smart V2의 안전상한(거래일). 여기서 새로 정하지 않고 V2 설정 파일에서 읽는다.
def _v2_max_holding_days(v2_dir=None):
    path = os.path.join(v2_dir or V2_DIR, "config.json")
    try:
        with open(path, encoding="utf-8") as f:
            v = json.load(f).get("maxHoldingTradingDays")
        return int(v) if v else 60
    except Exception:
        return 60


V2_MAX_HOLDING_DAYS = _v2_max_holding_days()


def _business_days(*row_groups):
    """원장에 실제로 나타난 거래일 집합. 거래일 달력을 따로 만들지 않는다."""
    days = set()
    for rows in row_groups:
        for r in rows:
            d = _entry_day(r) or ""
            if d:
                days.add(d)
            x = r.get("exit_business_date")
            if x:
                days.add(x)
    return sorted(days)


def _elapsed_trading_days(row, business_days):
    """진입일부터 지금(원장의 마지막 거래일)까지 지난 거래일 수.

    거래일 달력은 원장이 실제로 본 날짜만 쓴다 — 없는 날을 지어내지 않는다.
    그래서 이 값은 과소평가될 수 있고, 그 방향은 안전하다(성급히 '기한 초과'로
    몰지 않는다).
    """
    entry = _entry_day(row)
    if not entry or not business_days:
        return 0
    try:
        return len([d for d in business_days if d > entry])
    except TypeError:
        return 0


def strategy_state(rows):
    """한 전략의 '상태'만 집계한다. 성과 숫자는 만들지 않는다."""
    latest = latest_by_trade_id(rows)
    entered = [r for r in latest.values() if r.get("status") in ENTERED_STATUSES]
    closed = [r for r in latest.values() if r.get("status") == "CLOSED"]
    entry_days = sorted({d for d in (_entry_day(r) for r in entered) if d})
    return {
        "ledgerPresent": bool(rows),
        "enteredTrades": len(entered),
        "closedTrades": len(closed),
        "uniqueEntryDates": len(entry_days),
        "firstEntryDate": entry_days[0] if entry_days else None,
        "lastEntryDate": entry_days[-1] if entry_days else None,
        "episodeTaggedEntries": sum(1 for r in entered if r.get("source_episode_id")),
        "legacyUnpairedEntries": legacy_unpaired_count(rows),
    }


def evidence_stage(closed_count, unique_entry_days):
    """기존 게이트만으로 3단계 라벨을 만든다. 새 임계값 0.

    READY       두 조건(청산 건수·판단일 수)을 모두 넘겼다 → 성과를 논할 수 있다.
    BUILDING    기록이 시작돼 쌓이는 중이다.
    INSUFFICIENT아직 아무 것도 없다.
    """
    if (closed_count >= MIN_CLOSED_FOR_EVIDENCE
            and unique_entry_days >= MIN_ENTRY_DAYS_FOR_EVIDENCE):
        return EVIDENCE_READY
    if closed_count > 0 or unique_entry_days > 0:
        return EVIDENCE_BUILDING
    return EVIDENCE_INSUFFICIENT


def pairing_status(v1_dir=None, v2_dir=None):
    """공개해도 안전한 Paired Evidence 상태 dict."""
    v1_rows = read_ledger(os.path.join(v1_dir or V1_DIR, "trades.jsonl"))
    v2_rows = read_ledger(os.path.join(v2_dir or V2_DIR, "trades.jsonl"))

    v1_ep = entered_episodes(v1_rows)
    v2_ep = entered_episodes(v2_rows)
    paired_ids = sorted(set(v1_ep) & set(v2_ep))
    business_days = _business_days(v1_rows, v2_rows)

    # 짝이 만들어진 첫 날 = 양쪽에 다 있는 Episode 중 가장 이른 진입일.
    # 이 날 이전은 비교 대상이 아니다(공통 id가 아직 기록되지 않던 기간).
    paired_days = sorted({d for d in
                          (_entry_day(v1_ep[i]) for i in paired_ids) if d})
    # 짝지어진 Episode 중 양쪽 다 청산이 끝난 것만이 'Exit 방식 비교'의 표본이다.
    paired_closed = [i for i in paired_ids
                     if v1_ep[i].get("status") == "CLOSED"
                     and v2_ep[i].get("status") == "CLOSED"]
    # 모델·Universe 조건이 어긋난 짝은 순수한 Exit 차이로 읽으면 안 된다.
    condition_mismatch = [
        i for i in paired_ids
        if (v1_ep[i].get("signal_model_version") != v2_ep[i].get("signal_model_version")
            or v1_ep[i].get("signal_coverage_version") != v2_ep[i].get("signal_coverage_version"))
    ]

    # ⭐ 아직 안 끝난 짝(우측 절단, right-censoring)을 반드시 함께 센다.
    #
    # V1은 5거래일에 끊고 V2는 60거래일까지 끈다. 그래서 "양쪽 다 청산"은 사실상
    # V2가 언제 나오느냐로 정해진다. 그런데 초반에 V2에서 청산되는 건 CHIEF SELL을
    # 맞은 것들뿐이고, CHIEF SELL은 주가가 나빠진 것과 상관이 있다. 즉 V2의 승자는
    # 아직 열려 있고 패자만 닫혀서 쌓인다. 이 상태의 표본으로 평균을 내면 V2가
    # 실제보다 나빠 보인다.
    #
    # ⚠️ 그렇다고 "미청산이 하나라도 있으면 막는다"로 하면 안 된다(2026-08-26 QA).
    #    진입은 계속 일어나므로 갓 진입한 짝이 늘 하나는 열려 있고, 그러면 게이트가
    #    영원히 안 열린다. 게다가 판단일 20일 요건은 진입이 계속되기를 요구하므로
    #    두 조건이 서로를 밀어낸다.
    #
    # 그래서 '아직 안 끝나도 이상하지 않은 짝'과 '진작 끝났어야 하는데 안 끝난 짝'을
    # 가른다. V2의 안전상한(60거래일)을 넘겼는데도 열려 있으면 후자다. 후자가 있으면
    # 표본이 아직 여물지 않았다는 뜻이라 성과 공개 자격을 주지 않는다(fail closed).
    paired_open = len(paired_ids) - len(paired_closed)
    overdue = [i for i in paired_ids
               if not (v1_ep[i].get("status") == "CLOSED"
                       and v2_ep[i].get("status") == "CLOSED")
               and _elapsed_trading_days(v2_ep[i], business_days) > V2_MAX_HOLDING_DAYS]

    stage = evidence_stage(len(paired_closed), len(paired_days))
    return {
        "schemaVersion": "gaeo_paper_pairing_v1",
        "episodeSchema": SOURCE_EPISODE_SCHEMA,
        "strategies": {V1_STRATEGY: strategy_state(v1_rows),
                       V2_STRATEGY: strategy_state(v2_rows)},
        "paired": {
            "pairedEpisodes": len(paired_ids),
            "pairedClosedEpisodes": len(paired_closed),
            "pairedUniqueEntryDates": len(paired_days),
            "pairedOpenEpisodes": paired_open,
            "pairedOverdueEpisodes": len(overdue),
            "v2MaxHoldingTradingDays": V2_MAX_HOLDING_DAYS,
            "pairingStartedAt": paired_days[0] if paired_days else None,
            "conditionMismatchEpisodes": len(condition_mismatch),
            "note": ("양쪽 원장에 같은 source_episode_id로 실제 진입한 것만 센다. "
                     "과거 거래는 짝을 만들지 않는다(LEGACY_UNPAIRED)."),
            "censoringNote": ("아직 안 끝난 짝은 대부분 V2가 오래 들고 있는 것이다. "
                              "먼저 닫히는 쪽은 CHIEF SELL을 맞은 거래라 손실 쪽으로 "
                              f"치우친다. 안전상한({V2_MAX_HOLDING_DAYS}거래일)을 "
                              "넘겼는데도 안 끝난 짝이 있으면 표본이 아직 여물지 "
                              "않은 것이라 평균을 내지 않는다. 갓 진입해 열려 있는 "
                              "짝은 정상이므로 막지 않는다."),
        },
        "evidence": stage,
        "minClosedForEvidence": MIN_CLOSED_FOR_EVIDENCE,
        "minEntryDaysForEvidence": MIN_ENTRY_DAYS_FOR_EVIDENCE,
        # 표본이 차기 전에는 성과를 아예 만들지 않는다. 이 자리에 숫자가 들어가는
        # 경로 자체가 없어야 나중에 실수로 열리지 않는다.
        # 기한을 넘겼는데도 안 끝난 짝이 있으면 건수를 채웠어도 자격을 주지 않는다.
        "performance": ("ELIGIBLE_FOR_REVIEW"
                        if stage == EVIDENCE_READY and not overdue
                        else PERFORMANCE_HIDDEN),
        "strategyAutoChange": 0,
        "winnerDeclared": False,
    }


def render_report(status):
    """사람이 읽을 짧은 보고서. 여기에 성과 숫자가 들어가면 안 된다."""
    v1 = status["strategies"][V1_STRATEGY]
    v2 = status["strategies"][V2_STRATEGY]
    p = status["paired"]

    def block(title, s):
        return "\n".join([
            f"### {title}",
            f"- 기록 파일: {'있음' if s['ledgerPresent'] else '아직 없음'}",
            f"- 진입 건수: {s['enteredTrades']}",
            f"- 청산 건수: {s['closedTrades']}",
            f"- 진입일 수: {s['uniqueEntryDates']}",
            f"- 공통 Episode id가 붙은 진입: {s['episodeTaggedEntries']}",
            f"- 도입 전 과거 진입(짝 없음): {s['legacyUnpairedEntries']}",
        ])

    return "\n\n".join([
        "## GAEO PAPER RESEARCH",
        block(f"V1 ({V1_STRATEGY})", v1),
        block(f"Smart V2 ({V2_STRATEGY})", v2),
        "\n".join([
            "### Paired (같은 신호끼리)",
            f"- 짝지어진 Episode: {p['pairedEpisodes']}",
            f"- 그중 양쪽 다 청산 완료: {p['pairedClosedEpisodes']}",
            f"- 아직 안 끝난 짝(절단): {p['pairedOpenEpisodes']}"
            f" (그중 {p['v2MaxHoldingTradingDays']}거래일 기한 초과: "
            f"{p['pairedOverdueEpisodes']})",
            f"- 짝의 진입일 수: {p['pairedUniqueEntryDates']}",
            f"- Pairing 시작일: {p['pairingStartedAt'] or '아직 시작 안 됨'}",
            f"- 조건(모델·Universe) 불일치 짝: {p['conditionMismatchEpisodes']}",
        ]),
        "\n".join([
            "### Evidence",
            f"- 단계: {status['evidence']}"
            f" (기준: 청산 {status['minClosedForEvidence']}건"
            f" · 진입일 {status['minEntryDaysForEvidence']}일)",
            f"- 성과 공개: {status['performance']}",
            f"- 전략 자동 변경: {status['strategyAutoChange']}건",
        ]),
        ("> 이 보고서는 상태만 알립니다. 표본이 기준을 넘기 전에는 수익률·평가액·"
         "최대낙폭 같은 성과 숫자를 계산하지도, 공개하지도 않습니다. "
         "승자를 정하거나 전략을 자동으로 바꾸지 않습니다."),
    ])


# ── 발행 직전 유출 검사 ──────────────────────────────────────────────────────
# 왜 별도로 두나 (2026-08-26 보안 감사 LOW 지적)
#   위 render_report는 애초에 성과를 만들지 않는다. 그래도 게이트를 한 겹 더 두는
#   이유는, 나중에 누군가 보고서에 한 줄을 더할 때 이 검사가 막아주기 때문이다.
#   단 그 검사를 워크플로 셸에 금지어를 손으로 적어 두면 두 가지가 틀어진다.
#     ① 목록이 원본(EVIDENCE_GATED_FIELDS)과 어긋난다. 한쪽만 고쳐지면 조용히 샌다.
#     ② 영문 필드명만 보면 한국어 라벨을 못 잡는다. 이 보고서 본문은 한국어라
#        실제 사고는 "누적 수익률 +12.3%" 같은 모양으로 난다.
#   그래서 금지 목록을 엔진 상수에서 파생시키고, 한국어 성과 용어도 함께 본다.

#: 계좌 상태를 드러내는 값. EVIDENCE_GATED_FIELDS(성과 결론)에는 없지만
#  이것만으로도 수익률을 역산할 수 있어 같이 막는다.
ACCOUNT_STATE_FIELDS = ("portfolioReturnPct", "currentVirtualEquity", "cash",
                        "markedPositionsValue", "realizedPnl", "unrealizedPnl",
                        "maxDrawdownPct")

#: 한국어 성과 표현. 숫자가 함께 있을 때만 유출로 본다 —
#  "성과 숫자를 공개하지 않습니다" 같은 설명 문장까지 막으면 게이트를 못 쓴다.
KOREAN_PERFORMANCE_TERMS = ("수익률", "평가액", "평가금액", "최대낙폭", "낙폭",
                            "승률", "손익", "누적수익", "평가손익", "원금")


def performance_leaks(text):
    """보고서 본문에서 성과 유출을 찾아 사유 목록으로 돌려준다(빈 목록 = 안전)."""
    leaks = []
    for field in tuple(EVIDENCE_GATED_FIELDS) + ACCOUNT_STATE_FIELDS:
        if field in text:
            leaks.append(f"성과 필드명 노출: {field}")
    for term in KOREAN_PERFORMANCE_TERMS:
        # 용어 주변 40자 안에 숫자가 있으면 값이 실린 것으로 본다.
        for m in re.finditer(re.escape(term), text):
            window = text[max(0, m.start() - 40):m.end() + 40]
            if re.search(r"[-+]?\d[\d,.]*\s*(%|원|퍼센트)", window):
                leaks.append(f"한국어 성과 표현에 숫자가 붙어 있음: {term}")
                break
    return leaks


def main():
    status = pairing_status()
    report = render_report(status)
    leaks = performance_leaks(report)
    if leaks:
        # 새는 보고서는 발행하지 않는다. 조용히 통과시키지 않고 실패로 끝낸다.
        import sys
        for reason in leaks:
            print(f"[pairing] 발행 중단 — {reason}", file=sys.stderr)
        return 3
    print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
