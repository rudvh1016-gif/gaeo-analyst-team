#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""paper_pairing 계약 테스트 — '앞으로만' 짝짓고, 과거를 지어내지 않는다.

여기서 고정하는 약속
    1. Episode id는 전략 이름에 의존하지 않는다(V1과 V2가 같은 값을 본다).
    2. Episode id는 진입 시점에 아는 정보만 쓴다(미래가격·청산정보 금지).
    3. source_episode_id가 없는 과거 거래는 절대 짝이 되지 않는다(Backfill 금지).
    4. 진입하지 못한 SKIP 행은 짝이 되지 않는다.
    5. Evidence 임계값을 새로 만들지 않는다(paper_engine 값 재사용).
    6. 표본이 차기 전에는 성과 숫자가 보고서에 등장하지 않는다.
"""
import json
import os
import tempfile
import unittest

import paper_engine
import paper_pairing as pp


def _row(trade_id, status="CLOSED", episode=None, symbol="005930",
         signal_at="2026-09-01T09:05:00+09:00", entry_day="2026-09-01",
         model="M1", coverage="C1"):
    r = {"trade_id": trade_id, "status": status, "symbol": symbol,
         "signal_at": signal_at, "entry_business_date": entry_day,
         "signal_model_version": model, "signal_coverage_version": coverage}
    if episode is not None:
        r["source_episode_id"] = episode
    return r


def _write(dirpath, rows):
    os.makedirs(dirpath, exist_ok=True)
    with open(os.path.join(dirpath, "trades.jsonl"), "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


class EpisodeIdContract(unittest.TestCase):
    def test_strategy_independent(self):
        """전략 이름이 값에 섞이면 V1과 V2의 짝이 영원히 안 맞는다."""
        a = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        b = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        self.assertEqual(a, b)
        # trade_id는 전략마다 달라야 하고, episode id는 그 반대여야 한다.
        t1 = paper_engine.trade_id_for("PAPER_BASELINE_V1", "005930", "2026-09-01T09:05:00+09:00")
        t2 = paper_engine.trade_id_for("PAPER_SMART_V2", "005930", "2026-09-01T09:05:00+09:00")
        self.assertNotEqual(t1, t2)
        self.assertNotIn(a, (t1, t2))

    def test_distinguishes_symbol_and_batch(self):
        base = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        self.assertNotEqual(base, paper_engine.source_episode_id_for("000660", "2026-09-01T09:05:00+09:00"))
        self.assertNotEqual(base, paper_engine.source_episode_id_for("005930", "2026-09-02T09:05:00+09:00"))

    def test_uses_only_entry_time_facts(self):
        """서명에 미래 정보를 받을 자리가 없어야 한다(look-ahead 구조적 차단)."""
        import inspect
        params = list(inspect.signature(paper_engine.source_episode_id_for).parameters)
        self.assertEqual(params, ["symbol", "signal_at"])


class PairingContract(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.v1 = os.path.join(self.tmp.name, "v1")
        self.v2 = os.path.join(self.tmp.name, "v2")
        self.addCleanup(self.tmp.cleanup)

    def test_legacy_rows_never_pair(self):
        """같은 종목·같은 날이어도 id가 없으면 짝이 아니다."""
        _write(self.v1, [_row("t1", episode=None)])
        _write(self.v2, [_row("t2", episode=None)])
        s = pp.pairing_status(self.v1, self.v2)
        self.assertEqual(s["paired"]["pairedEpisodes"], 0)
        self.assertEqual(s["strategies"][pp.V1_STRATEGY]["legacyUnpairedEntries"], 1)
        self.assertEqual(s["strategies"][pp.V2_STRATEGY]["legacyUnpairedEntries"], 1)

    def test_same_episode_pairs(self):
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", episode=eid)])
        _write(self.v2, [_row("t2", episode=eid)])
        s = pp.pairing_status(self.v1, self.v2)
        self.assertEqual(s["paired"]["pairedEpisodes"], 1)
        self.assertEqual(s["paired"]["pairedClosedEpisodes"], 1)
        self.assertEqual(s["paired"]["pairingStartedAt"], "2026-09-01")

    def test_one_sided_episode_does_not_pair(self):
        """한쪽에만 있으면 짝이 아니다(V2가 현금 부족으로 못 산 경우 등)."""
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", episode=eid)])
        _write(self.v2, [])
        self.assertEqual(pp.pairing_status(self.v1, self.v2)["paired"]["pairedEpisodes"], 0)

    def test_skipped_rows_are_not_entries(self):
        """현금이 없어 못 산 후보는 진입이 아니므로 짝이 되지 않는다."""
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", status="SKIPPED_INSUFFICIENT_CASH", episode=eid)])
        _write(self.v2, [_row("t2", episode=eid)])
        self.assertEqual(pp.pairing_status(self.v1, self.v2)["paired"]["pairedEpisodes"], 0)

    def test_open_pairs_but_is_not_counted_as_closed(self):
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", status="CLOSED", episode=eid)])
        _write(self.v2, [_row("t2", status="OPEN", episode=eid)])
        s = pp.pairing_status(self.v1, self.v2)
        self.assertEqual(s["paired"]["pairedEpisodes"], 1)
        self.assertEqual(s["paired"]["pairedClosedEpisodes"], 0)

    def test_append_only_latest_row_wins(self):
        """원장은 append-only다. 같은 trade_id의 마지막 행이 현재 상태다."""
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", status="OPEN", episode=eid),
                         _row("t1", status="CLOSED", episode=eid)])
        _write(self.v2, [_row("t2", status="CLOSED", episode=eid)])
        s = pp.pairing_status(self.v1, self.v2)
        self.assertEqual(s["paired"]["pairedClosedEpisodes"], 1)
        self.assertEqual(s["strategies"][pp.V1_STRATEGY]["enteredTrades"], 1)

    def test_condition_mismatch_is_flagged_not_dropped(self):
        """모델·Universe가 다르면 짝은 유지하되 별도로 센다."""
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", episode=eid, model="M1")])
        _write(self.v2, [_row("t2", episode=eid, model="M2")])
        s = pp.pairing_status(self.v1, self.v2)
        self.assertEqual(s["paired"]["pairedEpisodes"], 1)
        self.assertEqual(s["paired"]["conditionMismatchEpisodes"], 1)

    def test_missing_ledger_is_not_an_error(self):
        s = pp.pairing_status(os.path.join(self.tmp.name, "nope1"),
                              os.path.join(self.tmp.name, "nope2"))
        self.assertEqual(s["evidence"], pp.EVIDENCE_INSUFFICIENT)
        self.assertFalse(s["strategies"][pp.V1_STRATEGY]["ledgerPresent"])

    def test_reader_never_writes(self):
        """감사 원칙: 이 모듈은 원장을 절대 수정하지 않는다."""
        eid = paper_engine.source_episode_id_for("005930", "2026-09-01T09:05:00+09:00")
        _write(self.v1, [_row("t1", episode=eid)])
        _write(self.v2, [_row("t2", episode=eid)])
        p1 = os.path.join(self.v1, "trades.jsonl")
        with open(p1, "rb") as f:
            before = f.read()
        pp.render_report(pp.pairing_status(self.v1, self.v2))
        with open(p1, "rb") as f:
            self.assertEqual(f.read(), before)


class EvidenceGateContract(unittest.TestCase):
    def test_reuses_existing_thresholds(self):
        """새 임계값을 만들지 않는다 — 엔진 상수를 그대로 쓴다."""
        self.assertEqual(pp.MIN_CLOSED_FOR_EVIDENCE, paper_engine.MIN_CLOSED_FOR_EVIDENCE)
        self.assertEqual(pp.MIN_ENTRY_DAYS_FOR_EVIDENCE, paper_engine.MIN_ENTRY_DAYS_FOR_EVIDENCE)

    def test_stage_boundaries(self):
        c, d = paper_engine.MIN_CLOSED_FOR_EVIDENCE, paper_engine.MIN_ENTRY_DAYS_FOR_EVIDENCE
        self.assertEqual(pp.evidence_stage(0, 0), pp.EVIDENCE_INSUFFICIENT)
        self.assertEqual(pp.evidence_stage(1, 1), pp.EVIDENCE_BUILDING)
        # 건수만 채우고 판단일이 모자라면 READY가 아니다(같은 날 몰아친 표본 방지).
        self.assertEqual(pp.evidence_stage(c, d - 1), pp.EVIDENCE_BUILDING)
        self.assertEqual(pp.evidence_stage(c - 1, d), pp.EVIDENCE_BUILDING)
        self.assertEqual(pp.evidence_stage(c, d), pp.EVIDENCE_READY)

    def test_performance_hidden_until_ready(self):
        self.assertEqual(pp.pairing_status(os.devnull + "x", os.devnull + "y")["performance"],
                         pp.PERFORMANCE_HIDDEN)

    def test_report_leaks_no_performance_numbers(self):
        """실제 보고서가 유출 검사를 통과한다."""
        text = pp.render_report(pp.pairing_status(os.devnull + "x", os.devnull + "y"))
        self.assertEqual(pp.performance_leaks(text), [])


class LeakGuardContract(unittest.TestCase):
    """발행 직전 게이트 — 원본 상수에서 파생되고 한국어도 잡는가.

    2026-08-26 보안 감사에서 나온 지적: 금지 목록을 워크플로 셸에 손으로 적어 두면
    ① 엔진 원본과 어긋나도 아무도 모르고 ② 영문 필드명만 봐서 한국어 유출을 놓친다.
    실제로 "누적 수익률 +12.3% · 평가액 11,230,000원"이 옛 게이트를 그대로 통과했다.
    """

    def test_banned_list_is_derived_from_engine(self):
        for field in paper_engine.EVIDENCE_GATED_FIELDS:
            self.assertTrue(pp.performance_leaks(f"보고서 {field} 12"),
                            f"{field}가 게이트를 통과했다")

    def test_account_state_fields_are_blocked(self):
        for field in pp.ACCOUNT_STATE_FIELDS:
            self.assertTrue(pp.performance_leaks(f"보고서 {field} 12"),
                            f"{field}가 게이트를 통과했다")

    def test_korean_performance_with_numbers_is_blocked(self):
        for text in ("누적 수익률 +12.3%",
                     "평가액 11,230,000원",
                     "최대낙폭 -8.4%",
                     "승률 62%",
                     "평가손익 +1,230,000원"):
            self.assertTrue(pp.performance_leaks(text), f"통과하면 안 된다: {text}")

    def test_korean_explanation_without_numbers_is_allowed(self):
        """'수익률을 공개하지 않습니다' 같은 설명까지 막으면 게이트를 못 쓴다."""
        text = ("표본이 기준을 넘기 전에는 수익률·평가액·최대낙폭 같은 성과 숫자를 "
                "계산하지도, 공개하지도 않습니다.")
        self.assertEqual(pp.performance_leaks(text), [])

    def test_safe_status_numbers_are_allowed(self):
        """건수·진입일 수는 성과가 아니므로 막히면 안 된다."""
        self.assertEqual(pp.performance_leaks("청산 20건 · 진입일 20일 · 짝 3개"), [])

    def test_main_refuses_to_publish_a_leaking_report(self):
        """새는 보고서는 조용히 통과하지 않고 실패로 끝난다."""
        original = pp.render_report
        pp.render_report = lambda _s: "누적 수익률 +12.3%"
        try:
            self.assertEqual(pp.main(), 3)
        finally:
            pp.render_report = original

    def test_no_winner_and_no_auto_change(self):
        s = pp.pairing_status(os.devnull + "x", os.devnull + "y")
        self.assertFalse(s["winnerDeclared"])
        self.assertEqual(s["strategyAutoChange"], 0)


class CensoringGateContract(unittest.TestCase):
    """우측 절단 게이트 — 막아야 할 것만 막고, 정상 진행은 막지 않는다.

    2026-08-26 QA 지적: 처음엔 "미청산이 하나라도 있으면 막는다"로 만들었는데,
    진입이 계속 일어나므로 갓 진입한 짝이 늘 하나는 열려 있어 게이트가 영원히
    안 열린다. 게다가 판단일 20일 요건은 진입이 계속되기를 요구하므로 두 조건이
    서로를 밀어낸다. 그래서 '기한(V2 안전상한)을 넘긴 미청산'만 막는다.
    """

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.v1 = os.path.join(self.tmp.name, "v1")
        self.v2 = os.path.join(self.tmp.name, "v2")
        c = paper_engine.MIN_CLOSED_FOR_EVIDENCE
        d = paper_engine.MIN_ENTRY_DAYS_FOR_EVIDENCE
        self.n = max(c, d)
        # 안전상한을 확실히 넘길 만큼 넉넉한 거래일 달력을 만든다.
        span = self.n + pp.V2_MAX_HOLDING_DAYS + 10
        self.days = [f"2026-{3 + i // 28:02d}-{i % 28 + 1:02d}" for i in range(span)]

    def _pairs(self, count, status="CLOSED", start=0):
        a, b = [], []
        for i in range(count):
            day = self.days[start + i]
            eid = paper_engine.source_episode_id_for("005930", day + "T09:05:00+09:00")
            for side, tag in ((a, "a"), (b, "b")):
                r = _row(f"{tag}{start + i}", status=status, episode=eid,
                         signal_at=day + "T09:05:00+09:00", entry_day=day)
                if status == "CLOSED":
                    r["exit_business_date"] = day
                side.append(r)
        return a, b

    def _status(self, a, b):
        _write(self.v1, a)
        _write(self.v2, b)
        return pp.pairing_status(self.v1, self.v2)

    def test_all_closed_opens_the_gate(self):
        a, b = self._pairs(self.n)
        s = self._status(a, b)
        self.assertEqual(s["evidence"], pp.EVIDENCE_READY)
        self.assertEqual(s["paired"]["pairedOverdueEpisodes"], 0)
        self.assertEqual(s["performance"], "ELIGIBLE_FOR_REVIEW")

    def test_a_freshly_opened_pair_does_not_block(self):
        """갓 진입한 짝이 열려 있는 건 정상이다. 이걸 막으면 게이트가 영영 안 열린다."""
        a, b = self._pairs(self.n)
        fresh_day = self.days[self.n]      # 달력의 거의 끝 → 아직 기한 안 지남
        eid = paper_engine.source_episode_id_for("005930", fresh_day + "T09:05:00+09:00")
        a.append(_row("aN", status="OPEN", episode=eid,
                      signal_at=fresh_day + "T09:05:00+09:00", entry_day=fresh_day))
        b.append(_row("bN", status="OPEN", episode=eid,
                      signal_at=fresh_day + "T09:05:00+09:00", entry_day=fresh_day))
        s = self._status(a, b)
        self.assertEqual(s["paired"]["pairedOpenEpisodes"], 1)
        self.assertEqual(s["paired"]["pairedOverdueEpisodes"], 0)
        self.assertEqual(s["performance"], "ELIGIBLE_FOR_REVIEW",
                         "갓 진입한 짝이 게이트를 막았다 — 영영 안 열린다")

    def test_an_overdue_pair_blocks(self):
        """안전상한을 넘겼는데 안 끝난 짝은 표본이 여물지 않았다는 뜻이다."""
        a, b = self._pairs(self.n)
        # 아주 오래된 진입일 + 달력 끝까지 거래일이 있으므로 기한을 넘긴다.
        old_day = self.days[0]
        eid = paper_engine.source_episode_id_for("005930", old_day + "T00:00:00+09:00")
        a.append(_row("aO", status="OPEN", episode=eid,
                      signal_at=old_day + "T00:00:00+09:00", entry_day=old_day))
        b.append(_row("bO", status="OPEN", episode=eid,
                      signal_at=old_day + "T00:00:00+09:00", entry_day=old_day))
        # 거래일 달력은 원장에 실제로 나타난 날짜만으로 만들어진다. 그러니 기한
        # 초과를 재려면 원장이 그만큼의 거래일을 실제로 본 상태여야 한다.
        # 다른 종목의 청산 기록으로 달력을 상한 너머까지 채운다.
        for k, day in enumerate(self.days[self.n:], start=1):
            a.append(_row(f"aF{k}", status="CLOSED",
                          episode=paper_engine.source_episode_id_for("000660", day),
                          symbol="000660", signal_at=day, entry_day=day))
            a[-1]["exit_business_date"] = day
        s = self._status(a, b)
        self.assertGreaterEqual(s["paired"]["pairedOverdueEpisodes"], 1,
                                "기한을 넘긴 미청산 짝을 못 찾았다")
        self.assertEqual(s["performance"], pp.PERFORMANCE_HIDDEN)

    def test_max_holding_comes_from_v2_config(self):
        """상한을 여기서 새로 정하지 않는다 — V2 설정 파일이 원본이다."""
        with open(os.path.join(pp.V2_DIR, "config.json"), encoding="utf-8") as f:
            self.assertEqual(pp.V2_MAX_HOLDING_DAYS,
                             json.load(f)["maxHoldingTradingDays"])


class RealLedgerState(unittest.TestCase):
    def test_real_repo_has_no_backfilled_pairs(self):
        """실제 저장소: 도입 전 거래가 조용히 짝지어지지 않았는지 확인."""
        s = pp.pairing_status()
        v1 = s["strategies"][pp.V1_STRATEGY]
        # 과거 진입은 전부 legacy로 남아야 하고, 짝 수는 태그된 진입 수를 넘을 수 없다.
        self.assertEqual(v1["enteredTrades"],
                         v1["episodeTaggedEntries"] + v1["legacyUnpairedEntries"])
        self.assertLessEqual(s["paired"]["pairedEpisodes"], v1["episodeTaggedEntries"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
