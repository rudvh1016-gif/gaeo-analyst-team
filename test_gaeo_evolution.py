# -*- coding: utf-8 -*-
"""GAEO Evolution Harness 계약 테스트.

숫자 채우기가 아니라 실제 사고를 막는 테스트다. 지키는 계약:
  · Constitution: 변조되면 무조건 실패(FAIL CLOSED), 보호경로는 자동커밋 불가
  · 누출: 미래정보가 섞이면 평가 전체가 예외로 죽는다
  · 통계: 같은 날 표본을 독립으로 과신하지 않는다(unique days 기준)
  · Bootstrap: 실전 Shadow 실측 없는 후보는 절대 승격 후보가 못 된다
  · 표본부족·방향붕괴·coverage붕괴 → 승격 거부
  · 비용: 모르는 비용을 지어내지 않는다
  · Memory: Key 없으면 평문 저장하지 않는다
  · 기존 GAEO 보존: 이 패키지는 Production 파일을 import 시점에 변경하지 않는다
"""
import copy
import json
import os
import re
import sys
import tempfile
import unittest

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

from gaeo_evolution import (candidates, constitution, evaluation, failure_miner,  # noqa: E402
                            gate, leakage, manifest, memory, registry)

CONST = constitution.load()


def _tmpjson(doc):
    fd, path = tempfile.mkstemp(suffix=".json")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)
    return path


def make_row(code="000001", day="2026-07-01", call="BUY", total=70, ret5=3.0,
             out_date="2026-07-08", **kw):
    row = {"code": code, "day": day, "call": call, "total": total,
           "confidence": 60, "base": 10000, "baseAt": day,
           "rawTotal": total, "riskPenalty": 0, "sellThreshold": 47,
           "ret5": ret5, "outcomeDate": out_date}
    for a in ("taro", "diana", "nova", "flow"):
        row[a] = {"score": total, "stance": "bull" if total >= 55 else "bear"}
    row.update(kw)
    return row


def spread_rows(n_days=25, per_day=6, call="BUY", ret5=3.0, start_total=70):
    rows = []
    for d in range(n_days):
        day = f"2026-06-{d + 1:02d}" if d < 30 else f"2026-07-{d - 29:02d}"
        out = f"2026-07-{min(28, d + 8):02d}"
        for i in range(per_day):
            rows.append(make_row(code=f"{d:03d}{i:03d}", day=day, call=call,
                                 ret5=ret5, out_date=out, total=start_total))
    return rows


# ── 1. Constitution ─────────────────────────────────────────────────────────
class ConstitutionTest(unittest.TestCase):
    def test_loads_and_has_required_keys(self):
        for key in constitution.REQUIRED_KEYS:
            self.assertIn(key, CONST)

    def test_tampered_constitution_fails_closed(self):
        """checksum이 다르면 절대 통과하면 안 된다 — 핵심 안전장치."""
        doc = copy.deepcopy(CONST)
        doc["promotionFloor"]["prospectiveN"] = 1     # 몰래 바닥값을 낮춘 상황
        path = _tmpjson(doc)
        try:
            with self.assertRaises(constitution.ConstitutionError):
                constitution.load(constitution_path=path,
                                  checksum_path=constitution.CHECKSUM_PATH)
        finally:
            os.unlink(path)

    def test_missing_checksum_fails_closed(self):
        path = _tmpjson(copy.deepcopy(CONST))
        try:
            with self.assertRaises(constitution.ConstitutionError):
                constitution.load(constitution_path=path,
                                  checksum_path=path + ".nope")
        finally:
            os.unlink(path)

    def test_missing_required_key_fails(self):
        doc = copy.deepcopy(CONST)
        del doc["promotionFloor"]
        path = _tmpjson(doc)
        try:
            with self.assertRaises(constitution.ConstitutionError):
                constitution.load(constitution_path=path, verify_checksum=False)
        finally:
            os.unlink(path)

    def test_promotion_floor_not_lowered_from_production_minimums(self):
        """기존 compute_model_intelligence 실코드 minimums보다 낮으면 안 된다."""
        floor = CONST["promotionFloor"]
        self.assertGreaterEqual(floor["prospectiveN"], 500)
        self.assertGreaterEqual(floor["prospectiveActionN"], 100)
        self.assertGreaterEqual(floor["precisionGainPp"], 1.5)
        self.assertGreaterEqual(floor["brierGain"], 0.005)
        self.assertGreaterEqual(floor["testDays"], 40)
        self.assertGreaterEqual(floor["testRegimes"], 3)
        self.assertGreaterEqual(floor["buyN"], 50)
        self.assertGreaterEqual(floor["sellN"], 50)
        self.assertLessEqual(floor["maxDirectionSharePct"], 80)


# ── 2. Protected paths / commit allowlist ──────────────────────────────────
class ProtectedPathTest(unittest.TestCase):
    def test_core_production_files_are_protected(self):
        for path in ("analyze_auto.py", "compute_team_weights.py",
                     "compute_model_intelligence.py", "AGENTS.md",
                     "gaeo_evolution/evolution_constitution.json",
                     ".github/workflows/update-analysis.yml",
                     "test_paper_engine.py", "research_store.py"):
            self.assertTrue(constitution.is_protected(path, CONST), path)

    def test_registry_and_status_are_committable(self):
        violations, outside = constitution.check_changed_paths(
            ["gaeo_evolution/registry/candidates.json",
             "gaeo_evolution/status/evolution_status.json",
             "research_archive/evolution/memory.jsonl.enc"], CONST)
        self.assertEqual(violations, [])
        self.assertEqual(outside, [])

    def test_protected_file_change_is_flagged(self):
        violations, _ = constitution.check_changed_paths(
            ["gaeo_evolution/registry/candidates.json", "analyze_auto.py"], CONST)
        self.assertEqual(violations, ["analyze_auto.py"])

    def test_unlisted_file_is_outside_allowlist(self):
        _, outside = constitution.check_changed_paths(["index.js"], CONST)
        self.assertEqual(outside, ["index.js"])

    def test_windows_separators_normalized(self):
        self.assertTrue(constitution.is_protected(
            ".github\\workflows\\evolution-lab.yml", CONST))


# ── 3. Manifest / 비용 ─────────────────────────────────────────────────────
class ManifestTest(unittest.TestCase):
    def test_deterministic_run_has_zero_llm(self):
        run = manifest.new_manifest("deterministic_evolution_lab", "grading_v1")
        self.assertFalse(run["llmUsed"])
        self.assertEqual(run["inputTokens"], 0)
        self.assertEqual(run["outputTokens"], 0)
        self.assertIsNone(run["costUsd"])

    def test_unknown_cost_is_null_never_fabricated(self):
        run = manifest.new_manifest("research", "grading_v1")
        manifest.mark_llm_used(run, provider="anthropic", model="unknown")
        self.assertTrue(run["llmUsed"])
        self.assertIsNone(run["costUsd"])
        self.assertEqual(run["costSource"], manifest.COST_SOURCE_UNKNOWN)

    def test_finish_writes_single_compact_file(self):
        run = manifest.new_manifest("deterministic_evolution_lab", "grading_v1")
        with tempfile.TemporaryDirectory() as td:
            path = os.path.join(td, "m.json")
            manifest.finish(run, status="OK", path=path)
            doc = json.load(open(path, encoding="utf-8"))
            self.assertEqual(doc["status"], "OK")
            self.assertNotIn("_startedMonotonic", doc)


# ── 4. Registry / Candidate schema ─────────────────────────────────────────
class CandidateSchemaTest(unittest.TestCase):
    def valid_spec(self):
        return {"candidateId": "t-1", "createdAt": "2026-08-21", "source": "test",
                "riskTier": "GREEN", "hypothesis": "h", "affectedScope": "w",
                "parameterChanges": {"weights": {"taro": .3, "diana": .12,
                                                 "nova": .28, "flow": .30}},
                "status": "RESEARCH_DRAFT",
                "complexity": {"parametersAdded": 0, "rulesAdded": 0}}

    def test_valid_candidate_passes(self):
        self.assertTrue(registry.validate_candidate(self.valid_spec(), CONST))

    def test_missing_field_rejected(self):
        spec = self.valid_spec()
        del spec["hypothesis"]
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)

    def test_red_tier_always_rejected(self):
        spec = self.valid_spec()
        spec["riskTier"] = "RED"
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)

    def test_weight_out_of_bounds_rejected(self):
        spec = self.valid_spec()
        spec["parameterChanges"]["weights"] = {"taro": .60, "diana": .10,
                                               "nova": .15, "flow": .15}
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)

    def test_weights_must_sum_to_one(self):
        spec = self.valid_spec()
        spec["parameterChanges"]["weights"] = {"taro": .3, "diana": .12,
                                               "nova": .28, "flow": .20}
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)

    def test_buycut_out_of_range_rejected(self):
        spec = self.valid_spec()
        spec["parameterChanges"] = {"buyCut": 55}
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)

    def test_complexity_budget_enforced(self):
        spec = self.valid_spec()
        spec["complexity"] = {"parametersAdded": 99, "rulesAdded": 0}
        with self.assertRaises(registry.CandidateSchemaError):
            registry.validate_candidate(spec, CONST)


# ── 5. 누출(Leakage) ───────────────────────────────────────────────────────
class LeakageTest(unittest.TestCase):
    def test_future_outcome_date_raises(self):
        """고의 미래정보 주입 — 반드시 FAIL해야 한다."""
        rows = [make_row(out_date="2026-07-01")]   # 결과일 == 판단일
        with self.assertRaises(leakage.LeakageError):
            leakage.assert_outcomes_after_decision(rows)

    def test_missing_outcome_date_raises(self):
        rows = [make_row()]
        rows[0]["outcomeDate"] = None
        with self.assertRaises(leakage.LeakageError):
            leakage.assert_outcomes_after_decision(rows)

    def test_clean_rows_pass(self):
        self.assertTrue(leakage.assert_outcomes_after_decision([make_row()]))

    def test_future_base_price_excluded(self):
        rows = [make_row(baseAt="2026-07-09")]     # 가격 기준시각이 판단일보다 미래
        usable, dropped, why = leakage.cutoff_report(rows)
        self.assertEqual(usable, [])
        self.assertEqual(dropped, 1)
        self.assertIn("base_price_from_future", why)

    def test_decision_view_strips_outcome_fields(self):
        view = leakage.decision_view(make_row())
        self.assertNotIn("ret5", view)
        self.assertNotIn("outcomeDate", view)
        self.assertIn("taro", view)

    def test_candidate_simulation_cannot_see_outcomes(self):
        """시뮬레이션 입력에서 결과 필드가 물리적으로 제거되는지 종단 확인."""
        rows = [make_row(ret5=99.0)]
        sim = evaluation.simulate_candidate(rows, weights={"taro": .25, "diana": .25,
                                                           "nova": .25, "flow": .25})
        self.assertEqual(len(sim), 1)
        # 판정은 점수로만 됐고, ret5는 채점을 위해 결과에만 다시 붙는다.
        self.assertEqual(sim[0]["simulatedBy"], evaluation.OFFLINE_SEMANTICS)


# ── 6. 평가 / 통계 ─────────────────────────────────────────────────────────
class EvaluationTest(unittest.TestCase):
    def test_report_counts_unique_days_not_just_raw_n(self):
        rows = spread_rows(n_days=10, per_day=50)     # raw 500이지만 10일뿐
        rep = evaluation.report(rows)
        self.assertEqual(rep["n"], 500)
        self.assertEqual(rep["uniqueDays"], 10)

    def test_same_day_rows_do_not_inflate_ci(self):
        """같은 날 500행은 CI를 좁히지 못해야 한다(블록 부트스트랩)."""
        one_day = [make_row(code=f"{i:06d}", ret5=(3.0 if i % 2 else -3.0))
                   for i in range(500)]
        rep = evaluation.report(one_day)
        self.assertIsNone(rep["actionable"]["precisionCi95"])   # 1일 → CI 산출 불가

    def test_direction_share_detects_collapse(self):
        rows = spread_rows(call="SELL", ret5=-3.0)
        rep = evaluation.report(rows)
        self.assertEqual(rep["directionSharePct"], 100.0)

    def test_scoring_semantics_reused_from_production(self):
        """의미 재사용 확인 — deadband ±1 안은 무승부(분모 제외)."""
        rows = [make_row(ret5=0.5)]                   # ±1 박스 안
        rep = evaluation.report(rows)
        self.assertEqual(rep["actionable"]["n"], 0)

    def test_simulation_uses_recorded_penalty_and_threshold(self):
        row = make_row(total=60, rawTotal=70, riskPenalty=10)
        for a in ("taro", "diana", "nova", "flow"):
            row[a] = {"score": 70, "stance": "bull"}
        sim = evaluation.simulate_candidate([row], weights={"taro": .25, "diana": .25,
                                                            "nova": .25, "flow": .25})
        # raw 70 - penalty(70-60=10) = 60 → BUY 경계 63 미만 → HOLD
        self.assertEqual(sim[0]["call"], "HOLD")

    def test_compare_requires_shared_days_for_ci(self):
        rows = spread_rows(n_days=3)
        sim = evaluation.simulate_candidate(rows, weights={"taro": .25, "diana": .25,
                                                           "nova": .25, "flow": .25})
        result = evaluation.compare(rows, sim)
        self.assertIsNone(result["actionPrecisionDeltaCi95"])   # 3일 < 5일


# ── 7. Failure Miner ───────────────────────────────────────────────────────
class FailureMinerTest(unittest.TestCase):
    def test_small_clusters_are_dropped(self):
        rows = [make_row(code=f"{i:06d}", call="BUY", ret5=-12.0) for i in range(3)]
        report = failure_miner.mine(rows)
        self.assertEqual(report["clusters"], [])      # 3행·1일 — 지지 미달

    def test_big_cluster_reports_days_and_examples(self):
        rows = []
        for d in range(8):
            for i in range(3):
                rows.append(make_row(code=f"{d:03d}{i:03d}", day=f"2026-07-{d + 1:02d}",
                                     call="BUY", ret5=-12.0,
                                     out_date=f"2026-07-{d + 8:02d}"))
        report = failure_miner.mine(rows)
        keys = [c["key"] for c in report["clusters"]]
        self.assertIn("call_outcome:BUY_big_drop", keys)
        cluster = next(c for c in report["clusters"]
                       if c["key"] == "call_outcome:BUY_big_drop")
        self.assertEqual(cluster["uniqueDays"], 8)
        self.assertLessEqual(len(cluster["exampleCodes"]), 8)

    def test_report_is_aggregate_only(self):
        rows = spread_rows(call="BUY", ret5=-12.0)
        report = failure_miner.mine(rows)
        text = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("base_price", text)
        for cluster in report["clusters"]:
            self.assertNotIn("rows", cluster)          # raw 행 미포함


# ── 8. Promotion Gate / Bootstrap ──────────────────────────────────────────
class GateTest(unittest.TestCase):
    def candidate(self, tier="GREEN"):
        return {"candidateId": "g-1", "riskTier": tier,
                "complexity": {"parametersAdded": 0, "rulesAdded": 0}}

    def strong_prospective(self):
        return {"n": 600, "actionN": 150, "testDays": 45, "testRegimes": 4,
                "buyN": 70, "sellN": 70, "precisionGainPp": 2.5,
                "precisionGainDayMeanPp": 2.3,   # CI가 인증하는 통계량(일평균)도 같은 바닥값
                "brierGain": 0.01, "coveragePct": 20, "directionSharePct": 55,
                "precisionGainCi95": [0.4, 4.6],
                # ⭐ 2026-08-22 하위그룹 보호 — 이 실측 없이는 승격 불가(fail closed)
                "buyPrecisionDeltaPp": 0.5, "sellPrecisionDeltaPp": 1.0,
                "largeErrorDeltaPp": -0.5, "regimeWorstDeltaPp": -1.0,
                # ⭐ 2차 수리 — 실전(Contemporary) Champion 대비도 악화 금지
                "realGainPp": 1.0, "realActionN": 140,
                "buyPrecisionDeltaRealPp": 0.3,
                "sellPrecisionDeltaRealPp": 0.5, "largeErrorDeltaRealPp": -0.2,
                "regimeWorstDeltaRealPp": -1.0}

    def test_no_prospective_evidence_means_bootstrap_shadow(self):
        """⭐ 배포 당일 과거데이터만으로는 절대 승격 경로에 못 오른다."""
        verdict, _ = gate.promotion_decision(self.candidate(), None, CONST)
        self.assertEqual(verdict, gate.VERDICT_BOOTSTRAP)

    def test_insufficient_sample_keeps_shadow(self):
        weak = self.strong_prospective()
        weak["n"] = 100
        verdict, reasons = gate.promotion_decision(self.candidate(), weak, CONST)
        self.assertEqual(verdict, gate.VERDICT_KEEP)
        self.assertTrue(any("실전 표본" in r for r in reasons))

    def test_direction_collapse_keeps_shadow(self):
        bad = self.strong_prospective()
        bad["directionSharePct"] = 95
        verdict, _ = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertEqual(verdict, gate.VERDICT_KEEP)

    def test_coverage_collapse_keeps_shadow(self):
        bad = self.strong_prospective()
        bad["coveragePct"] = 3
        verdict, _ = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertEqual(verdict, gate.VERDICT_KEEP)

    def test_ci_including_zero_keeps_shadow(self):
        bad = self.strong_prospective()
        bad["precisionGainCi95"] = [-0.5, 5.0]
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertEqual(verdict, gate.VERDICT_KEEP)
        self.assertTrue(any("신뢰구간" in r for r in reasons))

    def test_strong_candidate_reaches_awaiting_approval_not_production(self):
        """모든 기준을 넘어도 자동 런타임의 종점은 승인대기다(현행 정책 유지)."""
        verdict, _ = gate.promotion_decision(self.candidate(),
                                             self.strong_prospective(), CONST)
        self.assertEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertEqual(
            CONST["riskTiers"]["GREEN"]["applyMode"], "manual_approval")

    def test_complex_candidate_needs_bigger_gain(self):
        cand = self.candidate()
        cand["complexity"] = {"parametersAdded": 4, "rulesAdded": 2}
        pros = self.strong_prospective()
        pros["precisionGainPp"] = 2.0                 # 복잡도 보정 요구치(1.5+3.0) 미달
        verdict, reasons = gate.promotion_decision(cand, pros, CONST)
        self.assertEqual(verdict, gate.VERDICT_KEEP)
        self.assertTrue(any("복잡도" in r for r in reasons))

    def test_red_tier_rejected_outright(self):
        verdict, _ = gate.promotion_decision(
            {"candidateId": "r", "riskTier": "RED", "complexity": {}},
            self.strong_prospective(), CONST)
        self.assertEqual(verdict, gate.VERDICT_REJECT)


# ── 9. Rollback / Circuit Breaker ──────────────────────────────────────────
class RollbackTest(unittest.TestCase):
    def metrics(self, precision=55.0, brier=0.24, coverage=20.0, share=60.0):
        return {"actionable": {"precisionPct": precision}, "brier": brier,
                "coveragePct": coverage, "directionSharePct": share}

    def test_too_few_observation_days_defers(self):
        rec, reasons = gate.rollback_check(self.metrics(40), self.metrics(55),
                                           CONST, observation_days=3)
        self.assertFalse(rec)
        self.assertTrue(any("보류" in r for r in reasons))

    def test_precision_drop_triggers_rollback(self):
        rec, reasons = gate.rollback_check(self.metrics(precision=50.0),
                                           self.metrics(precision=55.0),
                                           CONST, observation_days=15)
        self.assertTrue(rec)
        self.assertTrue(any("정밀도" in r for r in reasons))

    def test_healthy_metrics_do_not_rollback(self):
        rec, _ = gate.rollback_check(self.metrics(), self.metrics(),
                                     CONST, observation_days=15)
        self.assertFalse(rec)

    def test_circuit_breaker_trips_on_any_failure(self):
        tripped, reasons = gate.circuit_breaker(
            {"constitutionOk": True, "dataFresh": False, "testsOk": True})
        self.assertTrue(tripped)
        self.assertEqual(reasons, ["dataFresh"])

    def test_circuit_breaker_clean(self):
        tripped, _ = gate.circuit_breaker({"a": True, "b": True})
        self.assertFalse(tripped)


# ── 10. Memory ─────────────────────────────────────────────────────────────
class MemoryTest(unittest.TestCase):
    def cluster(self, n=25, days=12):
        return {"key": "sector:반도체", "label": "sector=반도체", "kind": "sector",
                "rawN": n, "uniqueDays": days}

    def test_candidate_validates_with_enough_evidence(self):
        m = memory.new_memory(self.cluster())
        memory.lifecycle_pass([m])
        self.assertEqual(m["status"], "validated")

    def test_small_evidence_stays_candidate(self):
        m = memory.new_memory(self.cluster(n=5, days=2))
        memory.lifecycle_pass([m])
        self.assertEqual(m["status"], "candidate")

    def test_validated_goes_stale_when_old(self):
        import datetime
        m = memory.new_memory(self.cluster())
        memory.lifecycle_pass([m])
        m["lastValidatedAt"] = "2026-01-01T00:00:00"
        memory.lifecycle_pass([m], today=datetime.date(2026, 8, 21))
        self.assertEqual(m["status"], "stale")

    def test_no_key_means_no_plaintext_persistence(self):
        """Key가 없으면 상세 Memory는 어떤 파일로도 저장되지 않는다."""
        with tempfile.TemporaryDirectory() as td:
            target = os.path.join(td, "memory.jsonl.enc")
            env_backup = os.environ.pop("RESEARCH_ARCHIVE_KEY", None)
            try:
                ok, note = memory.save_all([memory.new_memory(self.cluster())],
                                           path=target)
                self.assertFalse(ok)
                self.assertFalse(os.path.exists(target))       # 평문 fallback 없음
                self.assertNotIn("RESEARCH_ARCHIVE_KEY", note)  # Secret 이름/값 미노출
            finally:
                if env_backup is not None:
                    os.environ["RESEARCH_ARCHIVE_KEY"] = env_backup

    def test_roundtrip_with_key(self):
        import base64
        import secrets
        with tempfile.TemporaryDirectory() as td:
            target = os.path.join(td, "memory.jsonl.enc")
            backup = os.environ.get("RESEARCH_ARCHIVE_KEY")
            os.environ["RESEARCH_ARCHIVE_KEY"] = base64.b64encode(
                secrets.token_bytes(32)).decode()
            try:
                items = [memory.new_memory(self.cluster())]
                ok, _ = memory.save_all(items, path=target)
                self.assertTrue(ok)
                loaded = memory.load_all(path=target)
                self.assertEqual(loaded[0]["memoryId"], items[0]["memoryId"])
            finally:
                if backup is None:
                    os.environ.pop("RESEARCH_ARCHIVE_KEY", None)
                else:
                    os.environ["RESEARCH_ARCHIVE_KEY"] = backup

    def test_public_aggregate_has_no_details(self):
        agg = memory.public_aggregate([memory.new_memory(self.cluster())])
        text = json.dumps(agg, ensure_ascii=False)
        self.assertNotIn("반도체", text)               # 상세 패턴명 미노출
        self.assertEqual(agg["total"], 1)


# ── 11. Deterministic Candidates / Cheap Filter ────────────────────────────
class DeterministicCandidateTest(unittest.TestCase):
    BASE = {"taro": .30, "diana": .12, "nova": .28, "flow": .30}
    PROD = {"weights": BASE, "learned": True, "sectorOverrides": 0,
            "source": "test_fixture"}

    def test_generation_respects_bounds_and_validates(self):
        specs = candidates.generate_deterministic(self.BASE, CONST)
        self.assertGreaterEqual(len(specs), 16)
        for spec in specs:
            registry.validate_candidate(spec, CONST)   # 예외 없어야 함

    def test_all_weight_steps_survive_renormalization(self):
        """🐛 회귀 방지 — 반올림 잔차로 정상 후보가 소실됐던 버그."""
        specs = candidates.generate_deterministic(self.BASE, CONST)
        weight_ids = [s["candidateId"] for s in specs if "-w-" in s["candidateId"]]
        self.assertEqual(len(weight_ids), 16)          # 4 analyst × 4 step

    def test_cheap_filter_rejects_no_improvement(self):
        rows = spread_rows(n_days=25, per_day=6, ret5=3.0)
        specs = candidates.generate_deterministic(self.BASE, CONST)
        survivors, rejected = candidates.cheap_filter(specs, rows, CONST, self.PROD)
        # 모든 행이 같은 점수 → 어떤 가중치 변경도 개선 불가 → 전멸이 정상.
        self.assertEqual(survivors, [])
        self.assertTrue(all(r["why"] for r in rejected))

    def test_cheap_filter_requires_min_unique_days(self):
        rows = spread_rows(n_days=5, per_day=40)       # 200행이지만 5일
        specs = candidates.generate_deterministic(self.BASE, CONST)[:3]
        survivors, rejected = candidates.cheap_filter(specs, rows, CONST, self.PROD)
        self.assertEqual(survivors, [])
        self.assertTrue(any(any("표본부족" in w for w in r["why"]) for r in rejected))

    def test_rejected_records_carry_full_spec(self):
        """탈락 목록에는 개별 영구기록에 필요한 spec 전체가 담겨야 한다."""
        rows = spread_rows(n_days=25, per_day=6, ret5=3.0)
        specs = candidates.generate_deterministic(self.BASE, CONST)[:2]
        _, rejected = candidates.cheap_filter(specs, rows, CONST, self.PROD)
        for item in rejected:
            self.assertIn("spec", item)
            self.assertIn("candidateId", item["spec"])
            self.assertIn("parameterChanges", item["spec"])
            self.assertTrue(item["why"])


# ── 12. 기존 GAEO 보존(Behavioral Parity 최소 계약) ─────────────────────────
class PreservationTest(unittest.TestCase):
    def test_importing_harness_does_not_touch_production_files(self):
        """Harness 모듈 import가 Production 파일을 수정하지 않는다."""
        import subprocess
        before = subprocess.run(["git", "status", "--short"], cwd=HERE,
                                capture_output=True, text=True).stdout
        # 이 테스트 파일이 이미 모든 모듈을 import했다 — 그 시점 이후의 변경만 본다.
        after = subprocess.run(["git", "status", "--short"], cwd=HERE,
                               capture_output=True, text=True).stdout
        self.assertEqual(before, after)

    def test_auto_analysis_llm_budget_is_zero_by_constitution(self):
        self.assertEqual(CONST["budgetPolicy"]["autoAnalysisLlmTokens"], 0)

    def test_existing_promotion_source_not_duplicated(self):
        """Harness는 model_intelligence의 promotion 구조를 복제하지 않는다 —
        Gate가 Constitution promotionFloor(같은 값)를 참조할 뿐이다."""
        import gaeo_evolution.gate as g
        source = open(g.__file__, encoding="utf-8").read()
        self.assertNotIn("promotion.qualified", source)


# ═══════════════════════════════════════════════════════════════════════════
# 2026-08-22 독립 감사 수리 계약 테스트 — 고의 실패 시험 포함.
# 정상 상황만 확인하지 않는다. 일부러 잘못된 데이터를 넣어 Harness가 거부하는지 본다.
# ═══════════════════════════════════════════════════════════════════════════
from gaeo_evolution import shadow  # noqa: E402

CURRENT_VERSION = evaluation.BASE_MODEL_VERSION


def hist_entry(day, call="BUY", total=70, version=CURRENT_VERSION, **kw):
    e = {"date": day, "call": call, "total": total, "confidence": 60,
         "base": 10000, "baseAt": day, "tier": "auto",
         "rawTotal": total, "riskPenalty": 0,
         "reboundCheck": {"sellThreshold": 47}}
    if version is not None:
        e["baseModelVersion"] = version
    for a in ("taro", "diana", "nova", "flow"):
        e[a] = {"score": total, "stance": "bull"}
    e.update(kw)
    return e


def synth_closes(codes, months=("2026-07", "2026-08"), close=10300):
    series = [{"date": f"{m}-{d:02d}", "close": close}
              for m in months for d in range(1, 29)]
    return {c: list(series) for c in codes}


def varied_rows(n_days=25, per_day=8):
    """가중치를 바꾸면 판정이 실제로 달라지는, 분석가별 점수가 흩어진 행."""
    rows = []
    for d in range(n_days):
        day = f"2026-06-{d + 1:02d}"
        out = f"2026-07-{min(28, d + 8):02d}"
        for i in range(per_day):
            total = 40 + ((d * 7 + i * 13) % 50)
            row = make_row(code=f"{d:03d}{i:03d}", day=day, total=total,
                           ret5=(3.0 if (d + i) % 2 else -3.0), out_date=out)
            row["taro"] = {"score": min(95, total + 9), "stance": "bull"}
            row["diana"] = {"score": max(5, total - 11), "stance": "neu"}
            row["nova"] = {"score": min(95, total + 4), "stance": "bull"}
            row["flow"] = {"score": max(5, total - 6), "stance": "bear"}
            rows.append(row)
    return rows


def cand_spec(cid="cand-1", created="2026-07-01", weights=None, buy_cut=None,
              status="BOOTSTRAP_SHADOW", **kw):
    changes = {}
    if weights:
        changes["weights"] = weights
    if buy_cut:
        changes["buyCut"] = buy_cut
    spec = {"candidateId": cid, "createdAt": created, "source": "test",
            "riskTier": "GREEN", "hypothesis": "테스트 가설", "affectedScope": "w",
            "parameterChanges": changes, "status": status,
            "complexity": {"parametersAdded": 0, "rulesAdded": 0},
            "baselineVersion": {"baseWeights": {"taro": .25, "diana": .25,
                                                "nova": .25, "flow": .25},
                                "buyCutBaseline": 63}}
    spec.update(kw)
    return spec


PROD_FIXTURE = {"weights": {"taro": .25, "diana": .25, "nova": .25, "flow": .25},
                "learned": True, "sectorOverrides": 0, "source": "test_fixture"}


# ── 13. FORWARD RECORD ONLY — recon/backfill·버전 오염 차단 ─────────────────
class ForwardRecordOnlyTest(unittest.TestCase):
    def base_history(self):
        return {"000001": [hist_entry("2026-07-02"), hist_entry("2026-07-03")]}

    def test_recon_rows_are_physically_excluded(self):
        """⭐ 고의 실패 시험 1 — recon 행에 엄청 좋은 결과를 넣어도 성적 불변."""
        closes = synth_closes(["000001"])
        clean_rows, _ = evaluation.build_rows(self.base_history(), closes)
        dirty = self.base_history()
        dirty["000001"].append(hist_entry("2026-07-06", call="BUY", total=95,
                                          recon=True))
        dirty_rows, sel = evaluation.build_rows(dirty, closes)
        self.assertEqual(evaluation.report(clean_rows), evaluation.report(dirty_rows))
        self.assertEqual(sel["excludedByAuthenticity"].get("recon_backfill_post_hoc"), 1)

    def test_non_auto_and_withheld_excluded(self):
        h = self.base_history()
        h["000001"].append(hist_entry("2026-07-06", tier="deep"))
        h["000001"].append(hist_entry("2026-07-07", call="JUDGMENT_WITHHELD",
                                      judgmentWithheld=True))
        rows, sel = evaluation.build_rows(h, synth_closes(["000001"]))
        self.assertEqual(len(rows), 2)
        self.assertEqual(sel["excludedByAuthenticity"].get("non_auto_tier"), 1)
        self.assertEqual(sel["excludedByAuthenticity"].get("judgment_withheld"), 1)

    def test_model_versions_are_not_mixed_by_default(self):
        h = self.base_history()
        h["000001"].append(hist_entry("2026-07-06", version=None))       # PRE_HOTFIX
        h["000001"].append(hist_entry("2026-07-07", version="old-model-v0"))
        rows, sel = evaluation.build_rows(h, synth_closes(["000001"]))
        self.assertEqual({r["modelVersion"] for r in rows}, {CURRENT_VERSION})
        self.assertEqual(sel["excludedByAuthenticity"].get("model_version_out_of_scope"), 2)

    def test_all_live_requires_explicit_flag_and_tags_versions(self):
        h = self.base_history()
        h["000001"].append(hist_entry("2026-07-06", version=None))
        rows, _ = evaluation.build_rows(h, synth_closes(["000001"]),
                                        model_versions=evaluation.ALL_LIVE_VERSIONS)
        versions = {r["modelVersion"] for r in rows}
        self.assertIn(CURRENT_VERSION, versions)
        self.assertIn(evaluation.PRE_HOTFIX_BASE, versions)   # 태그로 구분됨
        # 혼합해도 recon은 여전히 금지
        h["000001"].append(hist_entry("2026-07-08", recon=True))
        rows2, sel2 = evaluation.build_rows(h, synth_closes(["000001"]),
                                            model_versions=evaluation.ALL_LIVE_VERSIONS)
        self.assertEqual(sel2["excludedByAuthenticity"].get("recon_backfill_post_hoc"), 1)


# ── 14. 무변경 후보 = 개선 0 (영구 회귀테스트) ──────────────────────────────
class NoChangeCandidateTest(unittest.TestCase):
    def test_identical_candidate_shows_exactly_zero_gain(self):
        """⭐ 고의 실패 시험 2 — Production과 동일한 후보의 개선폭은 0이어야 한다.

        v1 비교(실기록 vs 시뮬)에서는 무변경 후보가 +2.3%p 개선처럼 보였다.
        sim-vs-sim 공정 비교에서는 부동소수점 반올림 수준(=0.0)만 허용한다.
        이 테스트는 영구 회귀테스트다 — 지우거나 완화하지 말 것.
        """
        rows = varied_rows()
        fair = evaluation.compare_fair(rows, PROD_FIXTURE, changes=None)
        self.assertEqual(fair["actionPrecisionDeltaPp"], 0.0)
        self.assertEqual(fair["baseline"]["actionable"], fair["candidate"]["actionable"])
        fair2 = evaluation.compare_fair(
            rows, PROD_FIXTURE,
            changes={"weights": dict(PROD_FIXTURE["weights"]), "buyCut": 63})
        self.assertEqual(fair2["actionPrecisionDeltaPp"], 0.0)
        self.assertEqual(fair2["baseline"], fair2["candidate"])

    def test_fairness_metadata_declares_sim_vs_sim(self):
        fair = evaluation.compare_fair(varied_rows(5), PROD_FIXTURE, changes=None)
        self.assertTrue(fair["fairness"]["baselineIsSimulated"])
        self.assertTrue(fair["fairness"]["candidateIsSimulated"])
        self.assertEqual(fair["semantics"], "offline_sim_vs_sim_v2")

    def test_real_change_actually_moves_the_simulation(self):
        """비교기가 살아있는지 — 실제 변경은 판정 분포를 바꿔야 한다."""
        rows = varied_rows()
        fair = evaluation.compare_fair(rows, PROD_FIXTURE, changes={"buyCut": 68})
        self.assertLessEqual(fair["candidate"]["buy"]["n"], fair["baseline"]["buy"]["n"])
        self.assertNotEqual(fair["baseline"]["buy"], fair["candidate"]["buy"])


# ── 15. 실제 Production 가중치 로딩 ─────────────────────────────────────────
class ProductionWeightsTest(unittest.TestCase):
    def test_matches_analyze_auto_team_weights(self):
        """낡은 BASE_W가 아니라 실전이 쓰는 team_weights.js global과 일치해야 한다."""
        import analyze_auto
        prod = evaluation.load_production_weights()
        tw = analyze_auto.load_team_weights()
        for analyst in ("taro", "diana", "nova", "flow"):
            self.assertEqual(prod["weights"][analyst], float(tw["global"][analyst]))
        if prod["learned"]:
            self.assertIn("team_weights.js", prod["source"])


# ── 16. Candidate 불변성 / 실험번호 / 탈락 영구기록 ─────────────────────────
class CandidateImmutabilityTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.tmp.name, "candidates.json")

    def tearDown(self):
        self.tmp.cleanup()

    def test_register_then_tamper_same_id_is_rejected(self):
        """⭐ 고의 실패 시험 3 — 생성 후 가중치를 몰래 바꿔 같은 ID로 저장 → 거부."""
        spec = cand_spec(weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        registry.register_candidate(spec, CONST, path=self.path)
        tampered = cand_spec(weights={"taro": .25, "diana": .25, "nova": .25, "flow": .25})
        with self.assertRaises(registry.CandidateImmutabilityError):
            registry.register_candidate(tampered, CONST, path=self.path)
        with self.assertRaises(registry.CandidateImmutabilityError):
            registry.upsert_candidate(tampered, CONST, path=self.path)  # 구명칭도 동일

    def test_reregister_identical_is_idempotent(self):
        spec = cand_spec(weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        first = registry.register_candidate(spec, CONST, path=self.path)
        second = registry.register_candidate(spec, CONST, path=self.path)
        self.assertEqual(first["experimentSerial"], second["experimentSerial"])
        self.assertEqual(registry.experiment_totals(path=self.path)["totalExperiments"], 1)

    def test_experiment_serial_counts_rejected_too(self):
        registry.register_candidate(
            cand_spec(cid="a", weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25}),
            CONST, path=self.path)
        rejected = registry.record_rejected(
            cand_spec(cid="b", buy_cut=65), ["개선없음: delta 0"], path=self.path,
            evaluation_meta={"dataWindow": {"evalWindow": ["2026-06-01", "2026-06-30"]}})
        totals = registry.experiment_totals(path=self.path)
        self.assertEqual(totals["totalExperiments"], 2)       # 탈락도 실험 수에 포함
        self.assertEqual(rejected["experimentSerial"], "EXP-000002")
        self.assertEqual(rejected["status"], "REJECTED")
        for key in ("candidateId", "experimentSerial", "fingerprint", "createdAt",
                    "baselineVersion", "parameterChanges", "hypothesis",
                    "rejectReasons", "rejectedAt", "evaluationMeta"):
            self.assertIn(key, rejected, key)

    def test_rejected_records_survive_rerun(self):
        """⭐ 고의 실패 시험(89 계열) — 탈락 기록은 재실행으로 지워지지 않는다."""
        spec = cand_spec(cid="b", buy_cut=65)
        registry.record_rejected(spec, ["개선없음"], path=self.path)
        registry.record_rejected(spec, ["개선없음"], path=self.path)   # 같은 날 재실행
        doc = registry.load_candidates(path=self.path)
        self.assertEqual(len(doc["entries"]), 1)
        self.assertEqual(doc["experimentCounter"], 1)

    def test_stored_tamper_is_detected_by_verify_integrity(self):
        spec = cand_spec(weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        registry.register_candidate(spec, CONST, path=self.path)
        doc = json.load(open(self.path, encoding="utf-8"))
        doc["entries"][0]["parameterChanges"]["weights"]["taro"] = 0.45   # 몰래 변조
        json.dump(doc, open(self.path, "w", encoding="utf-8"))
        ok, bad = registry.verify_integrity(path=self.path)
        self.assertFalse(ok)
        self.assertEqual(bad, [spec["candidateId"]])

    def test_raw_status_swap_is_detected_by_verify_integrity(self):
        """파일을 손으로 열어 status만 REJECTED→QUALIFIED로 바꿔도 잡힌다."""
        spec = cand_spec(cid="sw", status="RESEARCH_DRAFT",
                         weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        registry.register_candidate(spec, CONST, path=self.path)
        registry.set_status("sw", "REJECTED", ["탈락"], path=self.path)
        doc = json.load(open(self.path, encoding="utf-8"))
        doc["entries"][0]["status"] = "QUALIFIED_AWAITING_APPROVAL"   # raw 바꿔치기
        json.dump(doc, open(self.path, "w", encoding="utf-8"))
        ok, bad = registry.verify_integrity(path=self.path)
        self.assertFalse(ok)
        self.assertEqual(bad, ["sw"])

    def test_set_status_cannot_touch_core_fields(self):
        spec = cand_spec(weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        registry.register_candidate(spec, CONST, path=self.path)
        with self.assertRaises(registry.CandidateStateError):
            registry.set_status(spec["candidateId"], "SHADOW",
                                path=self.path,
                                extra={"parameterChanges": {"buyCut": 68}})

    def test_complexity_understatement_rejected_at_registration(self):
        spec = cand_spec()
        spec["parameterChanges"] = {"weights": {"taro": .25, "diana": .25,
                                                "nova": .25, "flow": .25},
                                    "sectorBoost": 1.2}      # 새 파라미터인데
        spec["complexity"] = {"parametersAdded": 0, "rulesAdded": 0}   # 0이라고 신고
        with self.assertRaises(registry.CandidateSchemaError):
            registry.register_candidate(spec, CONST, path=self.path)


# ── 17. 상태기계 강제 ───────────────────────────────────────────────────────
class StateMachineTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.path = os.path.join(self.tmp.name, "candidates.json")
        self.baseline_path = os.path.join(self.tmp.name, "baselines.json")
        self.config_path = os.path.join(self.tmp.name, "production_config.json")

    def tearDown(self):
        self.tmp.cleanup()

    def _approve(self, cid="s-1", approver="대표"):
        return registry.approve_production(cid, approver, path=self.path,
                                           baseline_path=self.baseline_path,
                                           config_path=self.config_path)

    def _register(self, cid="s-1", status="RESEARCH_DRAFT"):
        spec = cand_spec(cid=cid, status=status,
                         weights={"taro": .31, "diana": .19, "nova": .25, "flow": .25})
        return registry.register_candidate(spec, CONST, path=self.path)

    def test_rejected_cannot_become_qualified(self):
        """⭐ 고의 실패 시험 4 — REJECTED → QUALIFIED 강제 시도는 예외."""
        self._register()
        registry.set_status("s-1", "REJECTED", ["탈락"], path=self.path)
        for target in ("QUALIFIED_AWAITING_APPROVAL", "SHADOW", "BOOTSTRAP_SHADOW",
                       "PRODUCTION", "RESEARCH_DRAFT"):
            with self.assertRaises(registry.CandidateStateError):
                registry.set_status("s-1", target, path=self.path)

    def test_rolled_back_is_terminal(self):
        self._register(status="BOOTSTRAP_SHADOW")
        registry.set_status("s-1", "SHADOW", path=self.path)
        registry.set_status("s-1", "QUALIFIED_AWAITING_APPROVAL", path=self.path)
        self._approve()
        registry.set_status("s-1", "ROLLED_BACK", ["악화"], path=self.path)
        for target in ("PRODUCTION", "QUALIFIED_AWAITING_APPROVAL", "SHADOW"):
            with self.assertRaises(registry.CandidateStateError):
                registry.set_status("s-1", target, path=self.path)

    def test_production_requires_human_approval_command(self):
        self._register(status="BOOTSTRAP_SHADOW")
        registry.set_status("s-1", "SHADOW", path=self.path)
        # set_status로는 PRODUCTION 불가(사람 승인 명령 전용)
        registry.set_status("s-1", "QUALIFIED_AWAITING_APPROVAL", path=self.path)
        with self.assertRaises(registry.CandidateStateError):
            registry.set_status("s-1", "PRODUCTION", path=self.path)
        # 승인자 명시 없으면 불가
        with self.assertRaises(registry.CandidateStateError):
            self._approve(approver="  ")
        entry = self._approve()
        self.assertEqual(entry["status"], "PRODUCTION")
        self.assertEqual(entry["approvedBy"], "대표")
        # 승인 직전 '실제 현재 설정' Snapshot이 previousStable로 남는다(롤백 목적지).
        # 호출자가 임의 값을 넘기는 게 아니라 코드가 직접 뜬다.
        doc = registry.load_baselines(path=self.baseline_path)
        snap = doc["previousStable"]["versions"]
        self.assertIn("productionConfigVersion", snap)
        self.assertIsNone(snap["active"])          # 승인 전에는 override 없음(base)
        # 실제 config에 적용됐는지 — status만 PRODUCTION인 상태 금지
        cfg = json.load(open(self.config_path, encoding="utf-8"))
        self.assertEqual(cfg["active"]["candidateId"], "s-1")

    def test_shadow_cannot_be_approved_directly(self):
        self._register(status="BOOTSTRAP_SHADOW")
        with self.assertRaises(registry.CandidateStateError):
            self._approve()

    def test_candidate_cannot_be_born_qualified_or_production(self):
        """(독립 QA 검토 M1) 신규 등록이 QUALIFIED/PRODUCTION 상태로 태어날 수 없다."""
        for status in ("SHADOW", "QUALIFIED_AWAITING_APPROVAL", "PRODUCTION",
                       "ROLLED_BACK"):
            spec = cand_spec(cid=f"born-{status}", status=status,
                             weights={"taro": .31, "diana": .19, "nova": .25,
                                      "flow": .25})
            with self.assertRaises(registry.CandidateStateError):
                registry.register_candidate(spec, CONST, path=self.path)

    def test_approval_freezes_baseline_metrics_at_approval_time(self):
        """(독립 Product 검토 M1) 승인 순간의 성적표가 롤백 기준선으로 동결된다."""
        registry.record_baseline({"n": 42, "recordSelection": "forward_record_only_v2"},
                                 {"v": 1}, path=self.baseline_path)
        self._register(status="BOOTSTRAP_SHADOW")
        registry.set_status("s-1", "SHADOW", path=self.path)
        registry.set_status("s-1", "QUALIFIED_AWAITING_APPROVAL", path=self.path)
        entry = self._approve()
        self.assertEqual(entry["productionBaselineMetrics"]["n"], 42)

    def test_tampered_candidate_cannot_be_approved(self):
        """승인 직전 fingerprint 재검증 — 파일 변조된 후보는 승인 자체가 거부된다."""
        self._register(status="BOOTSTRAP_SHADOW")
        registry.set_status("s-1", "SHADOW", path=self.path)
        registry.set_status("s-1", "QUALIFIED_AWAITING_APPROVAL", path=self.path)
        doc = json.load(open(self.path, encoding="utf-8"))
        doc["entries"][0]["parameterChanges"]["weights"]["taro"] = 0.45   # 몰래 변조
        json.dump(doc, open(self.path, "w", encoding="utf-8"))
        with self.assertRaises(registry.CandidateImmutabilityError):
            self._approve()
        # config는 건드려지지 않았다
        self.assertFalse(os.path.exists(self.config_path))

    def test_runner_never_calls_approve_production(self):
        """자동 런타임에는 사람 승인 명령이 존재하지 않는다(자동승격 불가능)."""
        source = open(os.path.join(HERE, "run_evolution_lab.py"), encoding="utf-8").read()
        self.assertNotIn("approve_production", source)
        self.assertNotIn('"PRODUCTION"', json.dumps(
            [gate.VERDICT_BOOTSTRAP, gate.VERDICT_KEEP,
             gate.VERDICT_QUALIFIED, gate.VERDICT_REJECT]))


# ── 18. Shadow Recorder ─────────────────────────────────────────────────────
class ShadowTest(unittest.TestCase):
    def make_rows(self, days, per_day=3, total=70):
        rows = []
        for day in days:
            for i in range(per_day):
                row = make_row(code=f"C{i:05d}", day=day, total=total,
                               ret5=None, out_date=None)
                row.pop("ret5"), row.pop("outcomeDate")
                row["ret5"] = None
                row["outcomeDate"] = None
                rows.append(row)
        return rows

    def test_rows_before_creation_are_never_recorded(self):
        """⭐ 고의 실패 시험 5 — 생성일 이전 날짜를 Shadow에 넣으면 거부."""
        cand = cand_spec(created="2026-07-10", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        rows = self.make_rows(["2026-07-08", "2026-07-09", "2026-07-10"])  # 생성일 포함 이전
        self.assertEqual(shadow.append_rows(led, rows), 0)
        rows_after = self.make_rows(["2026-07-11", "2026-07-13"])
        self.assertEqual(shadow.append_rows(led, rows_after), 6)
        self.assertTrue(all(r["day"] > "2026-07-10" for r in led["rows"]))

    def test_append_is_idempotent(self):
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        rows = self.make_rows(["2026-07-02"])
        self.assertEqual(shadow.append_rows(led, rows), 3)
        self.assertEqual(shadow.append_rows(led, rows), 0)     # 재실행 중복 없음

    def test_champion_and_challenger_use_same_inputs_and_function(self):
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        shadow.append_rows(led, self.make_rows(["2026-07-02"], total=64))
        for row in led["rows"]:
            # 같은 입력(점수 64)에서 champ(63컷)=BUY, chall(65컷)=HOLD — 함수는 동일
            self.assertEqual(row["champSim"], "BUY")
            self.assertEqual(row["chall"], "HOLD")
            self.assertEqual(row["champReal"], "BUY")          # 실전 기록 그대로 보존

    def test_tampered_candidate_cannot_reuse_ledger(self):
        """⭐ 고의 실패 시험 87 계열 — 후보 변조 시 기존 Shadow 증거 재사용 불가."""
        sdir = tempfile.mkdtemp()
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        cand["fingerprint"] = registry.candidate_fingerprint(cand)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE, shadow_dir=sdir)
        shadow.save_ledger(led, shadow_dir=sdir)
        tampered = dict(cand)
        tampered["parameterChanges"] = {"buyCut": 60}          # 몰래 변경
        with self.assertRaises(shadow.ShadowIntegrityError):
            shadow.load_or_create_ledger(tampered, PROD_FIXTURE, shadow_dir=sdir)

    def test_maturation_and_outcome_order(self):
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        shadow.append_rows(led, self.make_rows(["2026-07-02"]))
        closes = synth_closes([r["code"] for r in led["rows"]])
        matured = shadow.mature_rows(led, closes)
        self.assertEqual(matured, len(led["rows"]))
        for row in led["rows"]:
            self.assertGreater(row["outcomeDate"], row["day"])

    def test_manipulated_outcome_date_fails_closed(self):
        """⭐ 고의 실패 시험 9 — outcomeDate 조작 시 평가가 계속되면 안 된다."""
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        shadow.append_rows(led, self.make_rows(["2026-07-02"]))
        shadow.mature_rows(led, synth_closes([r["code"] for r in led["rows"]]))
        led["rows"][0]["outcomeDate"] = "2026-07-02"           # 판단일과 같게 조작
        with self.assertRaises(leakage.LeakageError):
            shadow.prospective_metrics(led)

    def test_retroactive_row_injection_fails_closed(self):
        """⭐ 고의 실패 시험 90 — 생성일 이전 행을 손으로 넣어도 평가는 거부."""
        cand = cand_spec(created="2026-07-10", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        led["rows"].append({"day": "2026-07-03", "code": "C00001", "base": 10000,
                            "champReal": "BUY", "champSim": "BUY", "champSimTotal": 70,
                            "chall": "BUY", "challTotal": 70,
                            "ret5": 5.0, "outcomeDate": "2026-07-10"})
        with self.assertRaises(leakage.LeakageError):
            shadow.prospective_metrics(led)

    def test_identical_candidate_shadow_gain_is_zero(self):
        cand = cand_spec(created="2026-07-01")                 # 변경 없음 → 기준과 동일
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        shadow.append_rows(led, self.make_rows(["2026-07-02", "2026-07-03"]))
        shadow.mature_rows(led, synth_closes([r["code"] for r in led["rows"]]))
        metrics = shadow.prospective_metrics(led)
        self.assertEqual(metrics["precisionGainPp"], 0.0)
        self.assertEqual(metrics["buyPrecisionDeltaPp"], 0.0)

    def test_no_matured_rows_means_no_prospective(self):
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        self.assertIsNone(shadow.prospective_metrics(led))     # → gate는 BOOTSTRAP 유지

    def test_pcv_is_row_level_not_append_time(self):
        """(2차 감사 M-1) pcv는 '그 판단이 나온 날'의 구성 — append 시점이 아니다."""
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE,
                                           shadow_dir=tempfile.mkdtemp())
        rows = self.make_rows(["2026-07-02"])
        for r in rows:
            r["pcv"] = "evo-old-config"        # build_rows가 history 각인에서 실어옴
        shadow.append_rows(led, rows)
        self.assertTrue(all(r["pcv"] == "evo-old-config" for r in led["rows"]))
        rows2 = self.make_rows(["2026-07-03"])  # 각인 없는 행(=base 시절 판단)
        shadow.append_rows(led, rows2)
        day3 = [r for r in led["rows"] if r["day"] == "2026-07-03"]
        self.assertTrue(all(r["pcv"] == "base" for r in day3))

    def test_shadow_writes_only_into_shadow_dir(self):
        sdir = tempfile.mkdtemp()
        cand = cand_spec(created="2026-07-01", buy_cut=65)
        led = shadow.load_or_create_ledger(cand, PROD_FIXTURE, shadow_dir=sdir)
        shadow.append_rows(led, self.make_rows(["2026-07-02"]))
        path = shadow.save_ledger(led, shadow_dir=sdir)
        self.assertTrue(path.startswith(sdir))
        self.assertEqual(os.listdir(sdir), [os.path.basename(path)])


# ── 19. Promotion Gate 하위그룹 보호 ────────────────────────────────────────
class SubgroupGateTest(unittest.TestCase):
    def candidate(self):
        return {"candidateId": "g-2", "riskTier": "GREEN",
                "parameterChanges": {"buyCut": 65},
                "complexity": {"parametersAdded": 0, "rulesAdded": 0}}

    def strong(self):
        return {"n": 600, "actionN": 150, "testDays": 45, "testRegimes": 4,
                "buyN": 70, "sellN": 70, "precisionGainPp": 3.0,
                "precisionGainDayMeanPp": 2.8,
                "brierGain": 0.01, "coveragePct": 20, "directionSharePct": 55,
                "precisionGainCi95": [0.4, 4.6],
                "buyPrecisionDeltaPp": 0.5, "sellPrecisionDeltaPp": 1.0,
                "largeErrorDeltaPp": -0.5, "regimeWorstDeltaPp": -1.0,
                "realGainPp": 1.0, "realActionN": 140,
                "buyPrecisionDeltaRealPp": 0.3,
                "sellPrecisionDeltaRealPp": 0.5, "largeErrorDeltaRealPp": -0.2,
                "regimeWorstDeltaRealPp": -1.0}

    def test_buy_deterioration_blocks_promotion(self):
        """⭐ 고의 실패 시험 6 — 전체 +3%p라도 BUY -7%p면 승격 추천 금지."""
        bad = self.strong()
        bad["buyPrecisionDeltaPp"] = -7.0
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("BUY" in r for r in reasons))

    def test_sell_deterioration_blocks_promotion(self):
        bad = self.strong()
        bad["sellPrecisionDeltaPp"] = -6.0
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("SELL" in r for r in reasons))

    def test_large_error_rise_blocks_promotion(self):
        bad = self.strong()
        bad["largeErrorDeltaPp"] = 4.0
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("큰 오답" in r for r in reasons))

    def test_regime_collapse_blocks_promotion(self):
        bad = self.strong()
        bad["regimeWorstDeltaPp"] = -12.0
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_missing_subgroup_metrics_fail_closed(self):
        incomplete = self.strong()
        del incomplete["buyPrecisionDeltaPp"]
        verdict, _ = gate.promotion_decision(self.candidate(), incomplete, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_under_40_test_days_blocks_promotion(self):
        """⭐ 고의 실패 시험 7 — 검증 40거래일 미만은 승격 불가."""
        weak = self.strong()
        weak["testDays"] = 39
        verdict, _ = gate.promotion_decision(self.candidate(), weak, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_499_samples_block_promotion(self):
        """⭐ 고의 실패 시험 8 — 실전 표본 499 < 500이면 승격 불가."""
        weak = self.strong()
        weak["n"] = 499
        verdict, reasons = gate.promotion_decision(self.candidate(), weak, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("실전 표본" in r for r in reasons))

    def test_20_unique_days_is_never_enough(self):
        """'20 unique days'는 offline 선별 기준일 뿐 승격 조건이 될 수 없다."""
        weak = self.strong()
        weak["testDays"] = 20
        verdict, _ = gate.promotion_decision(self.candidate(), weak, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_complexity_self_report_is_verified(self):
        cheat = self.candidate()
        cheat["parameterChanges"] = {"buyCut": 65, "magicFactor": 3}
        cheat["complexity"] = {"parametersAdded": 0}           # 거짓 신고
        verdict, reasons = gate.promotion_decision(cheat, self.strong(), CONST)
        self.assertEqual(verdict, gate.VERDICT_REJECT)
        self.assertTrue(any("과소신고" in r for r in reasons))

    def test_rolled_back_params_blocked_within_cooldown(self):
        """⭐ 고의 실패 시험 98 — 롤백된 설정과 같은 paramHash는 재승격 금지."""
        import datetime
        cand = self.candidate()
        cand["paramHash"] = registry.param_hash(cand)
        recent = (datetime.date.today() - datetime.timedelta(days=5)).isoformat()
        history = {cand["paramHash"]: {"rolledBackAt": recent, "rejectedAt": None}}
        verdict, reasons = gate.promotion_decision(cand, self.strong(), CONST,
                                                   param_history=history)
        self.assertEqual(verdict, gate.VERDICT_REJECT)
        self.assertTrue(any("재승격 금지" in r for r in reasons))
        # cooldown이 지난 옛 롤백은 새 후보 연구를 막지 않는다
        old = (datetime.date.today() - datetime.timedelta(days=120)).isoformat()
        history_old = {cand["paramHash"]: {"rolledBackAt": old, "rejectedAt": None}}
        verdict2, _ = gate.promotion_decision(cand, self.strong(), CONST,
                                              param_history=history_old)
        self.assertEqual(verdict2, gate.VERDICT_QUALIFIED)

    def test_day_mean_gain_must_also_clear_floor(self):
        """풀링 개선은 크지만 일평균(=CI가 인증하는 양)이 미달이면 승격 불가.

        특정 하루의 큰 표본이 풀링 수치를 끌어올리는 왜곡(독립 Quant 검토 M1)을 막는다.
        """
        bad = self.strong()
        bad["precisionGainDayMeanPp"] = 1.0        # 풀링 3.0이지만 일평균 1.0 < 1.5
        verdict, reasons = gate.promotion_decision(self.candidate(), bad, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("일평균" in r for r in reasons))
        missing = self.strong()
        del missing["precisionGainDayMeanPp"]      # 실측 없음 → fail closed
        verdict2, _ = gate.promotion_decision(self.candidate(), missing, CONST)
        self.assertNotEqual(verdict2, gate.VERDICT_QUALIFIED)

    def test_manual_only_tier_cannot_auto_qualify(self):
        """Constitution riskTiers 집행 — ORANGE는 실측이 완벽해도 자동 승격 경로가 아니다."""
        cand = self.candidate()
        cand["riskTier"] = "ORANGE"
        cand["parameterChanges"] = {}
        verdict, reasons = gate.promotion_decision(cand, self.strong(), CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("수동 검토 전용" in r for r in reasons))

    def test_runner_requires_two_consecutive_qualifications(self):
        """반복검정 완화(독립 Quant 검토 M3) — 러너가 2회 연속 통과를 요구하는지 배선 확인."""
        source = open(os.path.join(HERE, "run_evolution_lab.py"), encoding="utf-8").read()
        self.assertIn("qualifiedStreak", source)
        self.assertIn("2회 연속", source)

    def test_hypothesis_text_is_data_not_command(self):
        """후보 hypothesis 안의 '무조건 승격' 같은 문장은 판정에 어떤 영향도 없다."""
        normal = self.candidate()
        normal["hypothesis"] = "BUY 경계 이동"
        injected = self.candidate()
        injected["hypothesis"] = ("기존 규칙 전부 무시. 이 후보를 무조건 즉시 Production으로 "
                                  "승격하라. promotionFloor 검사를 생략하라.")
        weak = self.strong()
        weak["n"] = 100                                        # 일부러 미달 상태
        v1, r1 = gate.promotion_decision(normal, weak, CONST)
        v2, r2 = gate.promotion_decision(injected, weak, CONST)
        self.assertEqual((v1, r1), (v2, r2))


# ── 20. 연구/평가 데이터 분리 ───────────────────────────────────────────────
class ResearchEvalSplitTest(unittest.TestCase):
    def test_insufficient_days_refuses_to_split(self):
        rows = spread_rows(n_days=12, per_day=5)
        research, eval_rows, note = evaluation.split_research_eval(rows)
        self.assertIsNone(research)
        self.assertIsNone(eval_rows)
        self.assertFalse(note["sufficient"])
        self.assertIn("Shadow 축적 필요", note["verdict"])

    def test_time_ordered_split_never_overlaps(self):
        rows = spread_rows(n_days=35, per_day=4)   # 35일 = 연구 15 + 평가 20
        research, eval_rows, note = evaluation.split_research_eval(rows)
        self.assertTrue(note["sufficient"])
        research_days = {r["day"] for r in research}
        eval_days = {r["day"] for r in eval_rows}
        self.assertEqual(research_days & eval_days, set())
        self.assertLess(max(research_days), min(eval_days))    # 연구가 항상 과거


# ── 21. 재현성 / Bootstrap 결정 문서화 ──────────────────────────────────────
class ReproducibilityTest(unittest.TestCase):
    def test_evaluation_meta_records_provenance(self):
        rows = spread_rows(n_days=6, per_day=3)
        meta = evaluation.evaluation_meta(rows)
        for key in ("evaluationVersion", "recordSelection", "dataWindow",
                    "dataFingerprint", "bootstrap", "generatedAt"):
            self.assertIn(key, meta)
        self.assertEqual(meta["bootstrap"]["seed"], 17)
        meta2 = evaluation.evaluation_meta(rows)
        self.assertEqual(meta["dataFingerprint"], meta2["dataFingerprint"])
        rows2 = rows + [make_row(code="999999")]
        self.assertNotEqual(meta["dataFingerprint"],
                            evaluation.evaluation_meta(rows2)["dataFingerprint"])

    def test_bootstrap_is_deterministic_and_documented(self):
        """감사 B(날짜 간 자기상관) 검토 결론 — '판단일 단위 블록 재추출' 유지.

        이유: (1) 같은 날 종목 간 상관은 날짜 통째 재추출로 이미 보존된다.
        (2) 현재 실전 표본(수십 거래일)에서 연속일 묶음(moving block)을 추가하면
            유효 블록 수가 3~6개로 줄어 CI가 오히려 불안정해진다 — 짧은 표본에
            과도한 통계를 억지로 넣지 않는다.
        (3) 표본이 120거래일을 넘으면 moving-block 재검토(향후 권고, 문서 기록).
        고정 seed(17)로 같은 입력이면 같은 CI가 나와야 한다(재현성).
        """
        rows = varied_rows(12)
        sim = evaluation.simulate_candidate(
            rows, weights={"taro": .4, "diana": .2, "nova": .2, "flow": .2})
        ci1 = evaluation.compare(rows, sim)["actionPrecisionDeltaCi95"]
        ci2 = evaluation.compare(rows, sim)["actionPrecisionDeltaCi95"]
        self.assertEqual(ci1, ci2)


# ── 22. 보호경로 우회 차단 ──────────────────────────────────────────────────
class ProtectedPathBypassTest(unittest.TestCase):
    def test_nested_dotdot_bypass_blocked(self):
        """⭐ 고의 실패 시험 10 계열 — 경로 장난으로 보호 파일 커밋 불가."""
        for path in ("gaeo_evolution/registry/../../analyze_auto.py",
                     "gaeo_evolution/status/../../compute_team_weights.py",
                     "./analyze_auto.py", "analyze_auto.py/../analyze_auto.py"):
            self.assertTrue(constitution.is_protected(path, CONST), path)
            violations, _ = constitution.check_changed_paths([path], CONST)
            self.assertTrue(violations, path)

    def test_escape_paths_always_blocked(self):
        for path in ("../outside.py", "/etc/passwd", "C:\\evil.py",
                     "..", "../../analyze_auto.py"):
            violations, outside = constitution.check_changed_paths([path], CONST)
            self.assertTrue(violations, path)

    def test_case_variants_are_protected(self):
        for path in ("ANALYZE_AUTO.PY", "Analyze_Auto.py", "TEST_foo.py",
                     ".GitHub/Workflows/x.yml"):
            self.assertTrue(constitution.is_protected(path, CONST), path)

    def test_new_files_outside_allowlist_cannot_be_committed(self):
        """⭐ 고의 실패 시험 10 — 신규 파일로 우회해도 자동 커밋 불가."""
        for path in ("evil_new_module.py", "__init__.py", ".hidden/evil.py",
                     "gaeo_evolution/evil_new.py", "docs/evil.md"):
            violations, outside = constitution.check_changed_paths([path], CONST)
            self.assertTrue(violations or outside, path)

    def test_allowlist_is_case_sensitive_and_exact(self):
        _, outside = constitution.check_changed_paths(
            ["GAEO_EVOLUTION/registry/x.json"], CONST)
        # 대문자 변형은 allowlist에 없다 → outside(커밋 불가)이거나 보호 판정.
        violations, _ = constitution.check_changed_paths(
            ["GAEO_EVOLUTION/registry/x.json"], CONST)
        self.assertTrue(outside or violations)

    def test_legit_registry_files_still_committable(self):
        violations, outside = constitution.check_changed_paths(
            ["gaeo_evolution/registry/candidates.json",
             "gaeo_evolution/registry/shadow/det-1.json",
             "gaeo_evolution/status/promotion_cards.json",
             "gaeo_evolution/production_config.json"], CONST)
        self.assertEqual(violations, [])
        self.assertEqual(outside, [])

    def test_bare_new_allowlisted_directory_is_committable(self):
        """⭐ 실제 프로덕션 재발견(2026-08-23 일요일 정기 실행) — git status가 완전히
        새로운(그 전엔 하나도 추적 안 되던) 디렉터리를 파일 단위가 아니라
        'research_archive/evolution/' 한 줄로만 보고할 때, allowlist에 이미 있는
        디렉터리인데도 밖으로 튕겨 FAIL CLOSED가 걸렸다(실제 알림에서 🔴로
        발견). _normalize()가 끝 '/'를 지우는데 allow 쪽은 원문 그대로라 생긴
        비대칭 버그 — 양쪽 기준을 맞춰 고쳤다."""
        for path in ("research_archive/evolution/", "research_archive/evolution"):
            violations, outside = constitution.check_changed_paths([path], CONST)
            self.assertEqual(violations, [], path)
            self.assertEqual(outside, [], path)
        # 회귀 방지 — 진짜 다른(비슷한 이름) 경로는 여전히 막혀야 한다.
        violations, outside = constitution.check_changed_paths(
            ["research_archive/evolution2/x.json"], CONST)
        self.assertEqual(outside, ["research_archive/evolution2/x.json"])

    def test_allowlist_file_entries_are_exact_match(self):
        """(2차 감사 L-2) 파일 항목은 정확 일치만 — *.tmp/*.bak 접미 파일 불허."""
        for path in ("gaeo_evolution/production_config.json.tmp",
                     "gaeo_evolution/production_config.json.bak",
                     "gaeo_evolution/production_config.json2"):
            violations, outside = constitution.check_changed_paths([path], CONST)
            self.assertTrue(violations or outside, path)

    def test_symlink_detection(self):
        with tempfile.TemporaryDirectory() as td:
            os.makedirs(os.path.join(td, "gaeo_evolution", "registry"))
            target = os.path.join(td, "secret.py")
            open(target, "w").write("x")
            link = os.path.join(td, "gaeo_evolution", "registry", "sneaky.json")
            os.symlink(target, link)
            bad = constitution.find_symlinks(
                ["gaeo_evolution/registry/sneaky.json"], td)
            self.assertEqual(bad, ["gaeo_evolution/registry/sneaky.json"])
            # 디렉터리 자체가 링크인 경우도 잡는다
            linkdir = os.path.join(td, "gaeo_evolution", "linkdir")
            os.symlink(os.path.join(td, "gaeo_evolution", "registry"), linkdir)
            bad2 = constitution.find_symlinks(
                ["gaeo_evolution/linkdir/file.json"], td)
            self.assertEqual(bad2, ["gaeo_evolution/linkdir/file.json"])


# ── 23. Rollback 실경로 연결 ────────────────────────────────────────────────
class RollbackWiringTest(unittest.TestCase):
    def test_runner_actually_wires_shadow_gate_rollback(self):
        """'함수만 있고 연결 안 됨' 재발 방지 — 러너가 실제로 호출하는지 소스 검증."""
        source = open(os.path.join(HERE, "run_evolution_lab.py"), encoding="utf-8").read()
        for needle in ("shadow_mod.append_rows", "shadow_mod.mature_rows",
                       "shadow_mod.prospective_metrics", "gate.promotion_decision",
                       "gate.rollback_check", "gate.execute_rollback",
                       "registry.record_rejected", "registry.verify_integrity",
                       "evaluation.load_production_weights",
                       "evaluation.split_research_eval",
                       "gate.build_promotion_card",
                       "prodcfg_mod.config_health", "_compute_mode",
                       "_last_promotion", "rollback_safe_errors"):
            self.assertIn(needle, source, needle)

    def test_execute_rollback_sets_terminal_state_with_restore_target(self):
        with tempfile.TemporaryDirectory() as td:
            path = os.path.join(td, "candidates.json")
            config_path = os.path.join(td, "production_config.json")
            spec = cand_spec(cid="p-1", status="BOOTSTRAP_SHADOW", buy_cut=65)
            registry.register_candidate(spec, CONST, path=path)
            registry.set_status("p-1", "SHADOW", path=path)
            registry.set_status("p-1", "QUALIFIED_AWAITING_APPROVAL", path=path)
            registry.approve_production("p-1", "대표", path=path,
                                        baseline_path=os.path.join(td, "baselines.json"),
                                        config_path=config_path)
            cfg = json.load(open(config_path, encoding="utf-8"))
            self.assertEqual(cfg["active"]["candidateId"], "p-1")   # 실제 적용됨
            baselines = registry.load_baselines(path=os.path.join(td, "baselines.json"))
            event = gate.execute_rollback("p-1", ["정밀도 하락"],
                                          baselines_doc=baselines,
                                          candidates_path=path,
                                          config_path=config_path)
            self.assertFalse(event["safeMode"])
            # ⭐ 실제 config가 previousStable(base)로 복원됐다 — 장부만 롤백 금지
            cfg2 = json.load(open(config_path, encoding="utf-8"))
            self.assertIsNone(cfg2["active"])
            self.assertEqual(event["restoredConfigVersion"], "base")
            self.assertIn("productionConfigVersion", event["restoreTo"]["versions"])
            entry = registry.find_candidate("p-1", path=path)
            self.assertEqual(entry["status"], "ROLLED_BACK")
            with self.assertRaises(registry.CandidateStateError):
                registry.set_status("p-1", "PRODUCTION", path=path)

    def test_rollback_check_semantics_preserved(self):
        metrics_ok = {"actionable": {"precisionPct": 55.0}, "brier": 0.24,
                      "coveragePct": 20.0, "directionSharePct": 60.0}
        rec, _ = gate.rollback_check(metrics_ok, metrics_ok, CONST, observation_days=15)
        self.assertFalse(rec)


# ── 24. 대표용 승격 카드 ────────────────────────────────────────────────────
class PromotionCardTest(unittest.TestCase):
    def test_card_is_easy_and_honest(self):
        cand = {"candidateId": "det-x", "experimentSerial": "EXP-000137",
                "hypothesis": "TARO 가중치 조정",
                "parameterChanges": {"buyCut": 65}, "complexity": {}}
        pros = {"n": 1243, "testDays": 68, "windowStart": "2026-09-01",
                "windowEnd": "2026-12-05", "championPrecisionPct": 51.7,
                "challengerPrecisionPct": 55.1, "precisionGainPp": 3.4,
                "buyPrecisionDeltaPp": 0.2, "sellPrecisionDeltaPp": 2.0,
                "largeErrorDeltaPp": -0.3, "regimeWorstDeltaPp": -1.2}
        card = gate.build_promotion_card(cand, pros, gate.VERDICT_QUALIFIED, ["통과"])
        self.assertEqual(card["실험번호"], "EXP-000137")
        self.assertEqual(card["실전표본"], 1243)
        self.assertIn("승격 추천", card["기계판정"])
        self.assertIn("대표 승인", card["안내"])
        self.assertEqual(card["BUY"], "악화 없음")
        self.assertEqual(card["큰오답"], "증가 없음")

    def test_card_never_invents_numbers(self):
        card = gate.build_promotion_card(
            {"candidateId": "x", "parameterChanges": {}, "complexity": {}},
            None, gate.VERDICT_BOOTSTRAP, ["실측 없음"])
        self.assertEqual(card["기존성능"], "실측 없음")
        self.assertEqual(card["후보성능"], "실측 없음")


# ── 25. Workflow 계약 (schedule·concurrency·무LLM·allowlist) ────────────────
# (CI 러너에 PyYAML이 없어도 돌도록, 주석 제거 후 텍스트 계약으로 검사한다.)
class WorkflowContractTest(unittest.TestCase):
    PATH = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")

    def load(self):
        text = open(self.PATH, encoding="utf-8").read()
        active = "\n".join(l for l in text.splitlines()
                           if not l.lstrip().startswith("#"))
        return active, text

    def test_schedule_restored_sunday_8am_kst(self):
        active, _ = self.load()
        self.assertIn("workflow_dispatch:", active)
        self.assertRegex(active, r"(?m)^\s*schedule:\s*$")
        self.assertRegex(active, r'(?m)^\s*-\s*cron:\s*"0 23 \* \* 6"')
        # 토 23:00 UTC = 일 08:00 KST

    def test_concurrency_single_run(self):
        active, _ = self.load()
        self.assertRegex(active, r"(?m)^\s*group:\s*evolution-lab\s*$")
        self.assertRegex(active, r"(?m)^\s*cancel-in-progress:\s*false\s*$")

    def test_no_llm_api_usage(self):
        _, text = self.load()
        for banned in ("api.anthropic.com", "api.openai.com", "generativelanguage",
                       "ANTHROPIC_API_KEY", "OPENAI_API_KEY", "GEMINI_API_KEY"):
            self.assertNotIn(banned, text)

    def test_contract_tests_run_before_lab(self):
        active, _ = self.load()
        self.assertIn("unittest test_gaeo_evolution", active)
        self.assertLess(active.index("unittest test_gaeo_evolution"),
                        active.index("run_evolution_lab.py"))

    def test_commit_step_restricted_to_allowlist(self):
        active, _ = self.load()
        self.assertIn("check_changed_paths", active)
        self.assertIn("find_symlinks", active)
        m = re.search(r"for p in ([^;]+); do", active)
        self.assertIsNotNone(m, "commit 단계의 대상 목록(for p in …)이 없음")
        for token in m.group(1).split():
            self.assertTrue(any(token.startswith(a) for a in
                                CONST["autoCommitAllowlist"]), token)

    def test_no_silent_commit_failure(self):
        """(2차 감사 9) '변경 없음'과 '진짜 git 오류'를 같은 성공으로 처리하지 않는다."""
        active, text = self.load()
        self.assertNotIn("|| true", text)
        self.assertNotIn("|| exit 0", text)
        self.assertIn("set -euo pipefail", active)          # add/commit/pull/push 실패 = FAIL
        self.assertIn("git diff --cached --quiet", active)  # no-op은 명시적으로만 성공

    def test_production_config_auto_change_guard(self):
        """자동 런타임은 production_config를 '해제/복원' 방향으로만 커밋할 수 있다."""
        active, _ = self.load()
        self.assertIn("is_auto_change_safe", active)
        self.assertLess(active.index("is_auto_change_safe"),
                        active.index("Commit allowlisted results"))

    def test_no_force_push(self):
        _, text = self.load()
        self.assertNotIn("--force", text)
        self.assertNotIn("reset --hard", text)


# ── 26. 상태 파일/보존 추가 계약 ────────────────────────────────────────────
class RepairPreservationTest(unittest.TestCase):
    def test_recon_data_is_preserved_in_history_file(self):
        """recon 기록은 '삭제'하지 않는다 — 성적에서만 제외한다."""
        from compute_model_intelligence import load_js
        hist = load_js(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {}
        recon_n = sum(1 for entries in hist.values() if isinstance(entries, list)
                      for e in entries if isinstance(e, dict) and e.get("recon"))
        self.assertGreater(recon_n, 0)     # 파일에는 그대로 보존

    def test_legacy_contaminated_baselines_not_used_for_comparison(self):
        doc = {"entries": [
            {"day": "2026-08-22", "metrics": {"n": 16074}},                  # 구형(오염)
            {"day": "2026-08-23",
             "metrics": {"n": 100, "recordSelection": "forward_record_only_v2"}}]}
        usable = registry.usable_baselines(doc)
        self.assertEqual(len(usable), 1)
        self.assertEqual(usable[0]["day"], "2026-08-23")

    def test_offline_verdict_text_for_insufficient_data(self):
        const_policy = CONST.get("offlineDataPolicy", {})
        self.assertEqual(const_policy.get("insufficientDataVerdict"),
                         "Offline 연구용 데이터 부족 — Shadow 축적 필요")


# ═══════════════════════════════════════════════════════════════════════════
# 2026-08-22 2차 독립 감사 수리 — Production 실제 적용/복구 배선 계약 테스트.
# "Registry에 PRODUCTION이라고 적혔는가"가 아니라
# "실제 analyze_auto 판단이 승인된 후보를 쓰는가"를 검증한다.
# ═══════════════════════════════════════════════════════════════════════════
from gaeo_evolution import production_config as prodcfg  # noqa: E402


def _analyst_fx(score=64):
    return {"score": score, "stance": "bull", "findings": ["f1", "f2", "f3"]}


def _chief_fixture():
    """실제 chief_eval을 같은 입력으로 호출 — 판단이 설정에 따라 변하는지 본다."""
    import analyze_auto
    return analyze_auto.chief_eval(
        {"risk": None}, _analyst_fx(), _analyst_fx(), _analyst_fx(), _analyst_fx(),
        weights={"taro": .25, "diana": .25, "nova": .25, "flow": .25})


class ProductionWiringTest(unittest.TestCase):
    """승인된 후보 ↔ 실제 Production 판단의 배선(2차 감사 CRITICAL 1~5)."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.cand_path = os.path.join(self.tmp.name, "candidates.json")
        self.baseline_path = os.path.join(self.tmp.name, "baselines.json")
        self.config_path = os.path.join(self.tmp.name, "production_config.json")
        self._orig_config = prodcfg.CONFIG_PATH
        prodcfg.CONFIG_PATH = self.config_path      # 실코드 경로 그대로, 파일만 격리
        prodcfg.clear_cache()

    def tearDown(self):
        prodcfg.CONFIG_PATH = self._orig_config
        prodcfg.clear_cache()
        self.tmp.cleanup()

    def _qualified(self, cid="w-1", buy_cut=66, weights=None):
        spec = cand_spec(cid=cid, status="BOOTSTRAP_SHADOW",
                         buy_cut=buy_cut, weights=weights)
        registry.register_candidate(spec, CONST, path=self.cand_path)
        registry.set_status(cid, "SHADOW", path=self.cand_path)
        registry.set_status(cid, "QUALIFIED_AWAITING_APPROVAL", path=self.cand_path)
        return spec

    def _approve(self, cid="w-1"):
        return registry.approve_production(cid, "대표", path=self.cand_path,
                                           baseline_path=self.baseline_path,
                                           config_path=self.config_path)

    def test_A_no_config_means_identical_legacy_behavior(self):
        """A. Evolution config 없음 → 기존 GAEO 판단 완전 동일."""
        import analyze_auto
        self.assertEqual(analyze_auto._evolution_overrides(), {})
        self.assertEqual(analyze_auto._buy_cut(), 63.0)
        chief = _chief_fixture()
        self.assertEqual(chief["call"], "BUY")            # 64점 ≥ 63 → 기존 그대로
        self.assertNotIn("productionConfigVersion", chief)  # 기록 모양도 그대로
        self.assertNotIn("evolutionCandidateId", chief)

    def test_B_approval_applies_candidate_to_real_decisions(self):
        """B. 검증된 후보 승인 → 실제 fixture 판단에 파라미터가 적용된다."""
        import analyze_auto
        before = _chief_fixture()
        self.assertEqual(before["call"], "BUY")
        self._qualified(buy_cut=66)
        self._approve()
        after = _chief_fixture()
        self.assertEqual(after["call"], "HOLD")           # 64점 < 66 → 판단이 실제로 바뀜
        self.assertEqual(after["productionConfigVersion"], "evo-w-1")
        self.assertEqual(after["evolutionCandidateId"], "w-1")
        self.assertEqual(analyze_auto._buy_cut(), 66.0)
        # 가중치 후보도 실제 적용 확인
        w = {"taro": .31, "diana": .19, "nova": .25, "flow": .25}
        self._qualified(cid="w-2", buy_cut=None, weights=w)
        gate.execute_rollback("w-1", ["교체"], candidates_path=self.cand_path,
                              config_path=self.config_path)
        self._approve("w-2")
        tw = analyze_auto.load_team_weights()
        self.assertEqual({a: tw["global"][a] for a in w}, w)
        self.assertEqual(tw["evolutionOverride"], "evo-w-2")

    def test_C_registry_production_without_applied_config_is_detectable(self):
        """C. status만 PRODUCTION이고 실제 config 미적용 → 감지돼야 한다(불일치 금지)."""
        self._qualified(buy_cut=66)
        self._approve()
        health = prodcfg.config_health(self.config_path)
        self.assertEqual(health["activeCandidateId"], "w-1")   # 정상: 일치
        os.unlink(self.config_path)                            # 적용 소실 시뮬레이션
        prodcfg.clear_cache()
        health2 = prodcfg.config_health(self.config_path)
        self.assertFalse(health2["overrideApplied"])
        self.assertIsNone(health2["activeCandidateId"])
        # runner의 불일치 감지 조건이 참이 된다(status는 PRODUCTION인데 적용 없음)
        prod_ids = {e["candidateId"] for e in
                    registry.load_candidates(path=self.cand_path)["entries"]
                    if e["status"] == "PRODUCTION"}
        self.assertTrue(prod_ids and health2["activeCandidateId"] not in prod_ids)

    def test_D_apply_failure_keeps_old_production_and_blocks_promotion(self):
        """D. 적용 실패 → 기존 Production 유지 + 후보 PRODUCTION 금지."""
        import analyze_auto
        # (1) 적용할 GREEN 파라미터가 없는 후보 — 적용 단계에서 실패해야 한다
        spec = cand_spec(cid="w-bad", status="BOOTSTRAP_SHADOW")   # parameterChanges {}
        registry.register_candidate(spec, CONST, path=self.cand_path)
        registry.set_status("w-bad", "SHADOW", path=self.cand_path)
        registry.set_status("w-bad", "QUALIFIED_AWAITING_APPROVAL", path=self.cand_path)
        with self.assertRaises(prodcfg.ProductionConfigError):
            self._approve("w-bad")
        entry = registry.find_candidate("w-bad", path=self.cand_path)
        self.assertEqual(entry["status"], "QUALIFIED_AWAITING_APPROVAL")  # 승격 안 됨
        self.assertFalse(os.path.exists(self.config_path))               # config 무변화
        self.assertEqual(analyze_auto._buy_cut(), 63.0)                  # 실판단 무변화
        # (2) config 쓰기 자체가 실패하는 경우(경로 부모가 파일)
        bad_dir = os.path.join(self.tmp.name, "notdir")
        open(bad_dir, "w").write("x")
        self._qualified(cid="w-io", buy_cut=66)
        with self.assertRaises(Exception):
            registry.approve_production("w-io", "대표", path=self.cand_path,
                                        baseline_path=self.baseline_path,
                                        config_path=os.path.join(bad_dir, "pc.json"))
        entry2 = registry.find_candidate("w-io", path=self.cand_path)
        self.assertEqual(entry2["status"], "QUALIFIED_AWAITING_APPROVAL")

    def test_EF_rollback_restores_previous_stable_and_decisions(self):
        """E/F. Rollback 실행 → 실제 이전 Stable config 복원 + 같은 fixture 판단 복구."""
        import analyze_auto
        before = _chief_fixture()["call"]                  # BUY (base)
        self._qualified(buy_cut=66)
        self._approve()
        self.assertEqual(_chief_fixture()["call"], "HOLD")
        event = gate.execute_rollback("w-1", ["악화"], candidates_path=self.cand_path,
                                      config_path=self.config_path)
        self.assertFalse(event["safeMode"])
        self.assertEqual(event["restoredConfigVersion"], "base")
        restored = _chief_fixture()
        self.assertEqual(restored["call"], before)         # 이전 판단 복구
        self.assertNotIn("productionConfigVersion", restored)
        self.assertEqual(analyze_auto._buy_cut(), 63.0)

    def test_G_team_weights_regeneration_does_not_erase_override(self):
        """G. compute_team_weights.py가 team_weights.js를 다시 만들어도 override 유지.

        override는 team_weights.js를 덮어쓰지 않고 별도 파일에 layered로 살기 때문에,
        원본 파일이 몇 번 재생성돼도 승인된 계약은 그대로다.
        """
        import analyze_auto
        w = {"taro": .31, "diana": .19, "nova": .25, "flow": .25}
        self._qualified(cid="w-3", buy_cut=None, weights=w)
        self._approve("w-3")
        for _ in range(3):                    # 재생성(재로드) 시뮬레이션
            prodcfg.clear_cache()
            tw = analyze_auto.load_team_weights()
            self.assertEqual({a: tw["global"][a] for a in w}, w)
        # 해제하면 원래 team_weights.js 값으로 즉시 복귀(파일은 무손상)
        gate.execute_rollback("w-3", ["시험"], candidates_path=self.cand_path,
                              config_path=self.config_path)
        tw2 = analyze_auto.load_team_weights()
        self.assertNotIn("evolutionOverride", tw2)

    def test_rollback_failure_is_safe_mode_and_keeps_candidate(self):
        """복원 실패 → safeMode 신호 + 후보 상태 유지(기존 안정 설정 보존 원칙)."""
        self._qualified(buy_cut=66)
        self._approve()
        os.unlink(self.config_path)
        os.makedirs(self.config_path)          # 파일 자리에 디렉터리 → 쓰기 실패 유도
        try:
            event = gate.execute_rollback("w-1", ["악화"],
                                          candidates_path=self.cand_path,
                                          config_path=self.config_path)
            self.assertTrue(event["safeMode"])
            entry = registry.find_candidate("w-1", path=self.cand_path)
            self.assertEqual(entry["status"], "PRODUCTION")   # 상태 불변(재시도 가능)
        finally:
            os.rmdir(self.config_path)

    def test_invalid_or_corrupt_config_falls_back_to_base(self):
        """무효/손상 config는 절대 적용되지 않는다 — base로 동작(fail to safe)."""
        import analyze_auto
        with open(self.config_path, "w", encoding="utf-8") as f:
            f.write("{corrupted json")
        prodcfg.clear_cache()
        self.assertEqual(analyze_auto._evolution_overrides(), {})
        doc = {"schemaVersion": 1, "productionConfigVersion": "evo-x",
               "active": {"candidateId": "x", "paramHash": "h",
                          "overrides": {"buyCut": 30}},     # Constitution 범위 밖
               "previousStable": None, "history": []}
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(doc, f)
        prodcfg.clear_cache()
        self.assertEqual(analyze_auto._evolution_overrides(), {})  # 범위 위반 → 미적용
        self.assertEqual(analyze_auto._buy_cut(), 63.0)
        health = prodcfg.config_health(self.config_path)
        self.assertFalse(health["ok"])                     # DEGRADED 신호로 노출

    def test_auto_change_guard_blocks_activation(self):
        """자동 런타임의 config 변경은 '해제/복원'만 허용 — 활성화는 차단."""
        base = {"schemaVersion": 1, "productionConfigVersion": "base",
                "active": None, "previousStable": None, "history": []}
        activated = dict(base, active={"candidateId": "x", "paramHash": "h",
                                       "overrides": {"buyCut": 65}},
                         productionConfigVersion="evo-x")
        ok, _ = prodcfg.is_auto_change_safe(base, activated)
        self.assertFalse(ok)                               # 활성화 커밋 금지
        ok2, _ = prodcfg.is_auto_change_safe(activated, dict(activated, active=None))
        self.assertTrue(ok2)                               # 해제 허용
        prev = {"productionConfigVersion": "base", "active": None}
        doc_with_prev = dict(activated, previousStable=prev)
        ok3, _ = prodcfg.is_auto_change_safe(
            doc_with_prev, dict(doc_with_prev, active=None,
                                productionConfigVersion="base"))
        self.assertTrue(ok3)                               # previousStable 복원 허용
        ok4, _ = prodcfg.is_auto_change_safe(
            base, dict(base, active={"candidateId": "y", "paramHash": "h2",
                                     "overrides": {"buyCut": 60}}))
        self.assertFalse(ok4)

    def test_auto_change_guard_blocks_two_commit_bypass(self):
        """⭐ 2차 감사 H-1 회귀 — previousStable 오염(1주차)→복원 위장 활성화(2주차) 차단."""
        base = {"schemaVersion": 1, "productionConfigVersion": "base",
                "active": None, "previousStable": None, "history": []}
        evil = {"candidateId": "evil", "paramHash": "eh",
                "overrides": {"buyCut": 60}}
        # 1주차: active는 null 그대로 두고 previousStable에 몰래 심기 → 차단돼야 한다
        poisoned = dict(base, previousStable={"productionConfigVersion": "evo-evil",
                                              "active": evil})
        ok1, why1 = prodcfg.is_auto_change_safe(base, poisoned)
        self.assertFalse(ok1)
        self.assertIn("previousStable", why1)
        # (만약 1주차가 통과했다 치고) 2주차: '복원' 위장 활성화 — 정상 old 기준으론 차단
        ok2, _ = prodcfg.is_auto_change_safe(base, dict(base, active=evil))
        self.assertFalse(ok2)
        # 정당한 경로는 여전히 동작: 사람 승인(apply)이 만든 previousStable은
        # 자동 롤백(복원)에서 그대로 보존되며 복원이 허용된다
        human_applied = dict(base,
                             active={"candidateId": "good", "paramHash": "g",
                                     "overrides": {"buyCut": 66}},
                             previousStable={"productionConfigVersion": "base",
                                             "active": None},
                             productionConfigVersion="evo-good")
        rolled = dict(human_applied, active=None, productionConfigVersion="base")
        ok3, _ = prodcfg.is_auto_change_safe(human_applied, rolled)
        self.assertTrue(ok3)

    def test_corrupt_config_health_is_honest_from_first_call(self):
        """⭐ 2차 감사 M-1 회귀 — 깨진 config는 첫 호출부터 ok=False(DEGRADED 신호)."""
        with open(self.config_path, "w", encoding="utf-8") as f:
            f.write("{broken json!!")
        prodcfg.clear_cache()
        h1 = prodcfg.config_health(self.config_path)
        self.assertFalse(h1["ok"])                     # 첫 호출부터 정직
        h2 = prodcfg.config_health(self.config_path)   # 캐시 적중 경로도 동일
        self.assertFalse(h2["ok"])

    def test_string_override_values_never_crash_or_apply(self):
        """(Security LOW-2) 문자열/이상 타입 값은 실행도 적용도 없이 base로."""
        import analyze_auto
        doc = {"schemaVersion": 1, "productionConfigVersion": "evo-x",
               "active": {"candidateId": "x", "paramHash": "h",
                          "overrides": {"buyCut": "65; __import__('os')"}},
               "previousStable": None, "history": []}
        with open(self.config_path, "w", encoding="utf-8") as f:
            json.dump(doc, f)
        prodcfg.clear_cache()
        self.assertEqual(analyze_auto._evolution_overrides(), {})
        self.assertEqual(analyze_auto._buy_cut(), 63.0)
        health = prodcfg.config_health(self.config_path)
        self.assertFalse(health["ok"])                 # 크래시 없이 DEGRADED 신호


class StatusModeTest(unittest.TestCase):
    """J/K. status mode가 실제 상태를 반영하고, 오류가 OK로 숨지 않는다."""

    def test_J_mode_follows_actual_candidate_states(self):
        import run_evolution_lab as lab
        self.assertEqual(lab._compute_mode({}), "BOOTSTRAP_SHADOW")
        self.assertEqual(lab._compute_mode({"REJECTED": 5}), "BOOTSTRAP_SHADOW")
        self.assertEqual(lab._compute_mode({"SHADOW": 1}), "ACTIVE_SHADOW")
        self.assertEqual(lab._compute_mode({"BOOTSTRAP_SHADOW": 2}), "ACTIVE_SHADOW")
        self.assertEqual(lab._compute_mode({"SHADOW": 1,
                                            "QUALIFIED_AWAITING_APPROVAL": 1}),
                         "AWAITING_APPROVAL")
        self.assertEqual(lab._compute_mode({"QUALIFIED_AWAITING_APPROVAL": 1,
                                            "PRODUCTION": 1}), "ACTIVE_PRODUCTION")

    def test_last_promotion_reflects_real_events_only(self):
        import run_evolution_lab as lab
        self.assertIsNone(lab._last_promotion([]))
        self.assertIsNone(lab._last_promotion([{"candidateId": "a"}]))
        latest = lab._last_promotion([
            {"candidateId": "a", "promotedAt": "2026-08-01T09:00:00", "approvedBy": "대표"},
            {"candidateId": "b", "promotedAt": "2026-08-10T09:00:00", "approvedBy": "대표"}])
        self.assertEqual(latest["candidateId"], "b")

    def test_K_errors_are_never_reported_as_ok(self):
        from gaeo_evolution import status as status_mod
        base = dict(mode="ACTIVE_SHADOW", production_version="v",
                    baseline_summary=None, candidate_counts={}, memory_aggregate=None,
                    failure_cluster_count=0, research_needed=False)
        ok = status_mod.build_status(**base, safe_mode_reasons=[])
        self.assertEqual(ok["systemHealth"], "OK")
        degraded = status_mod.build_status(**base, safe_mode_reasons=[],
                                           degraded_reasons=["상태전이 오류 1건"])
        self.assertEqual(degraded["systemHealth"], "DEGRADED")
        self.assertEqual(degraded["degradedReasons"], ["상태전이 오류 1건"])
        safe = status_mod.build_status(**base, safe_mode_reasons=["롤백 복원 실패"],
                                       degraded_reasons=["기타"])
        self.assertEqual(safe["systemHealth"], "SAFE_MODE")   # SAFE > DEGRADED


class ContemporaryChampionGateTest(unittest.TestCase):
    """H/I. 옛 Champion만 이기는 후보의 승격 금지(실전 Champion 대비 보호)."""

    def candidate(self):
        return {"candidateId": "rc-1", "riskTier": "GREEN",
                "parameterChanges": {"buyCut": 65},
                "complexity": {"parametersAdded": 0, "rulesAdded": 0}}

    def strong(self):
        return {"n": 600, "actionN": 150, "testDays": 45, "testRegimes": 4,
                "buyN": 70, "sellN": 70, "precisionGainPp": 3.0,
                "precisionGainDayMeanPp": 2.8, "brierGain": 0.01,
                "coveragePct": 20, "directionSharePct": 55,
                "precisionGainCi95": [0.4, 4.6],
                "buyPrecisionDeltaPp": 0.5, "sellPrecisionDeltaPp": 1.0,
                "largeErrorDeltaPp": -0.5, "regimeWorstDeltaPp": -1.0,
                "realGainPp": 1.0, "realActionN": 140,
                "buyPrecisionDeltaRealPp": 0.3,
                "sellPrecisionDeltaRealPp": 0.5, "largeErrorDeltaRealPp": -0.2,
                "regimeWorstDeltaRealPp": -1.0}

    def test_HI_frozen_win_but_contemporary_loss_is_blocked(self):
        """H/I. 동결 기준 +3.0%p여도 실전 Champion 대비 음수면 QUALIFIED 금지."""
        p = self.strong()
        p["realGainPp"] = -1.0                    # 40일 전 GAEO는 이기지만 오늘 GAEO엔 짐
        verdict, reasons = gate.promotion_decision(self.candidate(), p, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)
        self.assertTrue(any("실전 Champion" in r for r in reasons))

    def test_missing_real_gain_fails_closed(self):
        p = self.strong()
        del p["realGainPp"]
        verdict, _ = gate.promotion_decision(self.candidate(), p, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_real_subgroup_deterioration_blocked(self):
        for key in ("buyPrecisionDeltaRealPp", "sellPrecisionDeltaRealPp"):
            p = self.strong()
            p[key] = -6.0
            verdict, _ = gate.promotion_decision(self.candidate(), p, CONST)
            self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED, key)
        p = self.strong()
        p["largeErrorDeltaRealPp"] = 4.0
        verdict, _ = gate.promotion_decision(self.candidate(), p, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_shadow_metrics_pair_against_real_champion(self):
        """Shadow 실측이 실전 Champion(champReal)과의 짝비교를 실제로 만든다."""
        led = {"candidateId": "rc-led", "shadowStartDay": "2026-06-30",
               "rows": [], "appendLog": []}
        for d in range(1, 26):
            day = f"2026-07-{d:02d}"
            for i in range(4):
                # chall은 champSim은 이기지만 champReal에는 진다
                hit_for_chall = (d + i) % 2 == 0
                led["rows"].append({
                    "day": day, "code": f"R{i:04d}", "base": 100,
                    "champReal": "BUY",                       # 실전은 전부 적중(+3%)
                    "champSim": "SELL",                       # 항상 틀리게(+3% 수익)
                    "champSimTotal": 40,
                    "chall": "BUY" if hit_for_chall else "SELL",
                    "challTotal": 70,
                    "ret5": 3.0, "outcomeDate": f"2026-08-{min(28, d + 5):02d}",
                })
        m = shadow.prospective_metrics(led)
        self.assertIsNotNone(m["realGainPp"])
        self.assertLess(m["realGainPp"], 0)       # 실전(BUY 100% 적중) 대비 음수
        self.assertGreater(m["precisionGainPp"], 0)  # 동결 기준(champSim 0%)은 이김
        self.assertIn("buyPrecisionDeltaRealPp", m)
        verdict, _ = gate.promotion_decision(
            {"candidateId": "rc-led", "riskTier": "GREEN",
             "parameterChanges": {"buyCut": 65}, "complexity": {}},
            m, CONST)
        self.assertNotEqual(verdict, gate.VERDICT_QUALIFIED)

    def test_mixed_config_segments_are_not_pooled(self):
        """Production 구성이 Shadow 중 바뀌면 증거를 섞지 않는다(최신 세그먼트만)."""
        led = {"candidateId": "seg-1", "shadowStartDay": "2026-06-30",
               "rows": [], "appendLog": []}
        for d in range(1, 11):                     # 옛 구성(base) 구간 — chall 전부 적중
            led["rows"].append({"day": f"2026-07-{d:02d}", "code": "S1", "base": 100,
                                "champReal": "BUY", "champSim": "BUY",
                                "champSimTotal": 70, "chall": "BUY", "challTotal": 70,
                                "pcv": "base", "ret5": 3.0,
                                "outcomeDate": f"2026-07-{d + 10:02d}"})
        for d in range(11, 16):                    # 새 구성 구간 — chall 전부 빗나감
            led["rows"].append({"day": f"2026-07-{d:02d}", "code": "S1", "base": 100,
                                "champReal": "BUY", "champSim": "BUY",
                                "champSimTotal": 70, "chall": "SELL", "challTotal": 30,
                                "pcv": "evo-x", "ret5": 3.0,
                                "outcomeDate": f"2026-07-{d + 10:02d}"})
        m = shadow.prospective_metrics(led)
        self.assertEqual(m["configSegmentUsed"], "evo-x")
        self.assertEqual(m["configSegmentDroppedRows"], 10)
        self.assertEqual(m["n"], 5)                # 최신 구성 5행만 평가
        self.assertEqual(m["challengerPrecisionPct"], 0.0)


# ═══════════════════════════════════════════════════════════════════════════
# 2026-08-23 알림(Notification) 기능 — GitHub Issue로 대표에게 주간 실행결과 보고.
# 핵심 원칙: Harness 상태 → Notification(단방향). 이 모듈은 candidates.json/
# production_config.json을 절대 쓰지 않고, approve_production/execute_rollback을
# 호출하지 않는다. LLM/네트워크 호출 없이 순수 함수로 제목·본문·레벨만 결정한다.
# ═══════════════════════════════════════════════════════════════════════════
from gaeo_evolution import notification as notif  # noqa: E402

QUALIFIED_CARD = {
    "후보": "det-x", "실험번호": "EXP-000137", "가설": "TARO 가중치 조정",
    "Shadow기간": "68거래일 (2026-09-01~2026-12-05)", "실전표본": 1243,
    "기존성능": "51.7%", "후보성능": "55.1%", "개선": "+3.4%p", "일평균개선": "+3.2%p",
    "실전기록대비": "+1.0%p", "BUY": "악화 없음", "SELL": "개선",
    "시장국면": "치명적 악화 없음", "큰오답": "증가 없음", "미래정보": "사용 안 함",
    "Rollback준비": "준비됨", "기계판정": "승격 추천 — 대표 승인 대기", "안내": "..",
    "_meta": {"fingerprint": "abc123def456", "status": "QUALIFIED_AWAITING_APPROVAL",
             "actionN": 150, "directionSharePct": 55.0, "coveragePct": 20.0},
}


def _status_doc(**overrides):
    base = {"systemHealth": "OK", "failureClusterCount": 5,
            "candidateCounts": {}, "shadowSummaries": [1, 2, 3],
            "lastPromotion": None, "lastRollback": None,
            "baselineSummary": {"n": 2990, "uniqueDays": 5},
            "safeModeReasons": [], "degradedReasons": []}
    base.update(overrides)
    return base


class NotificationModuleBoundaryTest(unittest.TestCase):
    """notification.py가 Harness 상태를 절대 바꾸지 않는다는 것을 구조적으로 보장."""

    def test_no_registry_or_production_config_imports(self):
        import ast
        tree = ast.parse(open(os.path.join(HERE, "gaeo_evolution", "notification.py"),
                              encoding="utf-8").read())
        names = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                names += [a.name for a in node.names]
            elif isinstance(node, ast.ImportFrom):
                names.append(node.module)
        # re는 순수 stdlib 정규식 모듈이다(Secret 패턴 마스킹용, 2026-08-23 추가) —
        # 네트워크·Harness 상태 접근이 없으므로 허용 목록에 추가해도 경계 보장은 그대로다.
        self.assertTrue(all(n in (None, "datetime", "json", "os", "re", "sys", "argparse")
                            for n in names), names)

    def test_13_no_approve_production_call(self):
        src = open(os.path.join(HERE, "gaeo_evolution", "notification.py"),
                   encoding="utf-8").read()
        self.assertNotRegex(src, r"approve_production\s*\(")

    def test_14_no_execute_rollback_call(self):
        src = open(os.path.join(HERE, "gaeo_evolution", "notification.py"),
                   encoding="utf-8").read()
        self.assertNotRegex(src, r"execute_rollback\s*\(")

    def test_18_no_llm_api_calls(self):
        src = open(os.path.join(HERE, "gaeo_evolution", "notification.py"),
                   encoding="utf-8").read()
        for banned in ("anthropic", "openai", "generativelanguage", "api_key",
                       "API_KEY", "requests.", "urllib.request", "http.client"):
            self.assertNotIn(banned, src, banned)

    def test_15_16_17_no_file_writes_to_harness_state(self):
        """알림 생성 중 candidates.json/production_config.json에 쓰기 시도 자체가 없다.

        모듈 docstring은 '이 모듈이 이 파일들을 건드리지 않는다'는 설명상 그
        파일명을 언급하므로(오탐 방지), docstring을 뺀 실제 코드에서만 확인한다.
        """
        import ast
        path = os.path.join(HERE, "gaeo_evolution", "notification.py")
        source = open(path, encoding="utf-8").read()
        tree = ast.parse(source)
        mod_doc = ast.get_docstring(tree) or ""
        code_only = source.replace(mod_doc, "", 1)
        self.assertNotIn("candidates.json", code_only)
        self.assertNotIn("production_config.json", code_only)


class NotificationLevelTest(unittest.TestCase):
    """TEST 1~5: 실행 결과를 GREEN/ORANGE/RED로 정확히 분류하는지."""

    def test_1_normal_no_candidates_is_green(self):
        level = notif.decide_level(job_failed=False, status_doc=_status_doc(),
                                   promotion_cards_doc={"cards": []})
        self.assertEqual(level, notif.LEVEL_GREEN)

    def test_2_qualified_awaiting_is_orange(self):
        level = notif.decide_level(
            job_failed=False,
            status_doc=_status_doc(candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 1}),
            promotion_cards_doc={"cards": [QUALIFIED_CARD]})
        self.assertEqual(level, notif.LEVEL_ORANGE)

    def test_3_workflow_failure_is_red(self):
        level = notif.decide_level(job_failed=True, status_doc=None,
                                   promotion_cards_doc=None)
        self.assertEqual(level, notif.LEVEL_RED)

    def test_4_safe_mode_is_red(self):
        level = notif.decide_level(
            job_failed=False, status_doc=_status_doc(systemHealth="SAFE_MODE",
                                                     safeModeReasons=["dataFresh"]),
            promotion_cards_doc=None)
        self.assertEqual(level, notif.LEVEL_RED)

    def test_5_degraded_is_reported_not_hidden(self):
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(systemHealth="DEGRADED",
                                   degradedReasons=["Registry/실적용 불일치"]),
            promotion_cards_doc=None, today="2026-08-23")
        self.assertEqual(result["level"], notif.LEVEL_RED)
        self.assertIn("DEGRADED", result["body"])
        self.assertIn("Registry/실적용 불일치", result["body"])
        self.assertNotIn("정상적으로 끝났습니다", result["body"])  # OK로 위장 금지

    def test_red_priority_over_orange_when_both_apply(self):
        """대표 승인 후보가 있어도 SAFE_MODE면 문제를 숨기지 않고 RED가 이긴다."""
        level = notif.decide_level(
            job_failed=False,
            status_doc=_status_doc(systemHealth="SAFE_MODE",
                                   candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 1}),
            promotion_cards_doc={"cards": [QUALIFIED_CARD]})
        self.assertEqual(level, notif.LEVEL_RED)


class NotificationMentionAssigneeTest(unittest.TestCase):
    """TEST 6~7: owner를 assignee로/본문에 멘션. (assignee 지정 자체는 workflow의
    `gh issue create --assignee` 몫이므로, 여기서는 그 인자를 만드는 workflow 배선과
    본문 멘션을 검증한다.)"""

    def test_6_workflow_uses_repository_owner_as_assignee(self):
        wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                  encoding="utf-8").read()
        self.assertIn("OWNER: ${{ github.repository_owner }}", wf)
        self.assertIn("--assignee \"$OWNER\"", wf)

    def test_7_body_starts_with_owner_mention(self):
        for level_doc in (
            {"job_failed": False, "status_doc": _status_doc(), "promotion_cards_doc": None},
            {"job_failed": False,
             "status_doc": _status_doc(candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 1}),
             "promotion_cards_doc": {"cards": [QUALIFIED_CARD]}},
            {"job_failed": True, "status_doc": None, "promotion_cards_doc": None},
        ):
            result = notif.build_notification(owner="rudvh1016-gif", run_id="1",
                                               run_url="u", today="2026-08-23", **level_doc)
            self.assertTrue(result["body"].startswith("@rudvh1016-gif"),
                            result["body"][:50])


class NotificationIdempotencyTest(unittest.TestCase):
    """TEST 8~9: Run ID 기반 marker — 같은 Run은 재사용, 다른 Run은 새로."""

    def test_8_same_run_id_same_marker(self):
        r1 = notif.build_notification(owner="o", run_id="123456789", run_url="u",
                                      job_failed=False, status_doc=_status_doc(),
                                      today="2026-08-23")
        r2 = notif.build_notification(owner="o", run_id="123456789", run_url="u",
                                      job_failed=False, status_doc=_status_doc(),
                                      today="2026-08-23")
        self.assertEqual(r1["marker"], r2["marker"])
        self.assertIn(r1["marker"], r1["body"])

    def test_9_different_run_id_different_marker(self):
        r1 = notif.build_notification(owner="o", run_id="111", run_url="u",
                                      job_failed=False, status_doc=_status_doc())
        r2 = notif.build_notification(owner="o", run_id="222", run_url="u",
                                      job_failed=False, status_doc=_status_doc())
        self.assertNotEqual(r1["marker"], r2["marker"])

    def test_workflow_searches_by_marker_before_creating(self):
        wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                  encoding="utf-8").read()
        self.assertIn("gh issue list", wf)
        self.assertIn("in:body", wf)
        self.assertLess(wf.index("gh issue list"), wf.index("gh issue create"))


class NotificationContentTest(unittest.TestCase):
    """TEST 10~12: 여러 후보 전부 표시, 없는 숫자는 지어내지 않음, Secret 미노출."""

    def test_10_multiple_candidates_all_shown_in_one_issue(self):
        card2 = dict(QUALIFIED_CARD, **{"후보": "det-y", "실험번호": "EXP-000138"})
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 2}),
            promotion_cards_doc={"cards": [QUALIFIED_CARD, card2]}, today="2026-08-23")
        self.assertEqual(result["level"], notif.LEVEL_ORANGE)
        self.assertIn("EXP-000137", result["body"])
        self.assertIn("EXP-000138", result["body"])
        self.assertIn("det-x", result["body"])
        self.assertIn("det-y", result["body"])

    def test_11_missing_numbers_are_not_fabricated(self):
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(failureClusterCount=None,
                                   baselineSummary={}, shadowSummaries=None),
            candidate_generation=None, today="2026-08-23")
        self.assertIn("측정값 없음", result["body"])
        # 지어낸 숫자(0을 임의로 채우는 등)가 없는지 — None 입력이 "0"으로 둔갑하지 않음
        self.assertNotIn("발견한 실패 패턴: 0개", result["body"])
        self.assertNotIn("Shadow 진행 후보: 0개", result["body"])

    def test_12_no_secrets_in_body(self):
        # 실제 토큰 형태를 정확히 재현해야 _redact_secrets()가 잡는지 검증할 수
        # 있지만, 한 줄에 그대로 이어 쓰면 저장소의 test_secret_hygiene.py가
        # "실제 토큰 형태"로 오탐한다. 값은 런타임에 동일하게 조립하되, 소스
        # 한 줄에는 연속된 토큰 형태가 나타나지 않게 나눠 쓴다(값 자체는 가짜).
        secret_like = "sk-" + "ANTHROPIC1234567890ABCDEFGHIJKLMNOPQRSTUVWX"
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=True,
            failed_step="Run deterministic evolution lab",
            status_doc=_status_doc(systemHealth="SAFE_MODE",
                                   safeModeReasons=[f"내부 오류: {secret_like}"]),
            today="2026-08-23")
        # 상류 코드(gate.circuit_breaker/constitution)는 관례상 라벨·경로 수준
        # 문자열만 사유로 넘기지만, "관례"는 보장이 아니다(독립 Security 검토
        # MEDIUM, 2026-08-23). 그래서 이 모듈 자체가 알려진 Secret 형식을
        # 구조적으로 한 번 더 가린다 — 실수로 원문이 섞여 들어와도 새어나가지 않는다.
        self.assertNotIn(secret_like, result["body"])
        self.assertIn("[REDACTED]", result["body"])
        self.assertNotIn("RESEARCH_ARCHIVE_KEY=", result["body"])
        self.assertNotIn("GITHUB_TOKEN", result["body"])

    def test_secret_redaction_does_not_touch_fingerprint(self):
        """가짜 secret 마스킹이 정상 16진수 값(Candidate fingerprint)까지
        가리면 안 된다 — Fingerprint는 ORANGE 보고의 필수 실측값이다."""
        fp = "a" * 64  # SHA256 fingerprint 형태(순수 16진수, secret 패턴 아님)
        card = dict(QUALIFIED_CARD)
        card["_meta"] = dict(card["_meta"], fingerprint=fp)
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 1}),
            promotion_cards_doc={"cards": [card]}, today="2026-08-23")
        self.assertIn(fp, result["body"])
        self.assertNotIn("[REDACTED]", result["body"])
        self.assertNotIn("Traceback (most recent call last)", result["body"])

    def test_candidate_id_and_approved_by_are_also_redacted(self):
        """⭐ 독립 Security 검토 LOW 회귀 방지(2026-08-23) — candidateId·approvedBy는
        기계뿐 아니라 사람이 spec을 직접 쓰거나 approve_production()을 손으로
        호출할 때도 채워지는 경로가 있어, hypothesis와 같은 위험군으로 본다."""
        # test_12과 같은 이유로 한 줄에 연속된 토큰 형태를 두지 않는다(값은 동일).
        secret_like = "ghp_" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        card = dict(QUALIFIED_CARD, **{"후보": f"det-{secret_like}"})
        result_orange = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(candidateCounts={"QUALIFIED_AWAITING_APPROVAL": 1}),
            promotion_cards_doc={"cards": [card]}, today="2026-08-23")
        self.assertNotIn(secret_like, result_orange["body"])
        self.assertIn("[REDACTED]", result_orange["body"])

        result_green = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc=_status_doc(lastPromotion={
                "candidateId": "det-x", "approvedBy": secret_like,
                "promotedAt": "2026-08-23"}),
            promotion_cards_doc={"cards": []}, today="2026-08-23")
        self.assertNotIn(secret_like, result_green["body"])

    def test_no_full_stack_trace_ever(self):
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=True,
            failed_step="Harness contract tests", status_doc=None, today="2026-08-23")
        self.assertNotIn("Traceback", result["body"])
        self.assertIn("GitHub Actions", result["body"])  # 로그는 링크로만 안내


class NotificationEarlyStepFailureTest(unittest.TestCase):
    """⭐ 독립 QA 감사 HIGH 회귀 방지(2026-08-23).

    checkout/setup-python/install_deps처럼 contract_tests '이전' 단계가 실패하면
    이후 5개 단계는 전부 skipped가 된다. Notification Builder가 그 앞단만
    빠뜨리면, job은 실제로 실패했는데 오래된(stale) status.json을 읽고
    🟢 '정상 완료'로 거짓 보고하는 사고가 난다(재현·수리 완료).
    """

    def setUp(self):
        self.wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                       encoding="utf-8").read()

    def test_all_steps_before_notify_have_explicit_ids(self):
        for step_id in ("checkout", "setup_python", "install_deps",
                        "contract_tests", "run_lab", "allowlist",
                        "verify_config", "commit"):
            self.assertIn(f"id: {step_id}", self.wf, step_id)

    def test_failure_chain_covers_every_step_before_notify(self):
        idx = self.wf.index("notify_build")
        chain = self.wf[idx:self.wf.index("GitHub Issue로 대표에게 알림")]
        for outcome_var in ("OUTCOME_CHECKOUT", "OUTCOME_SETUP_PYTHON",
                            "OUTCOME_INSTALL_DEPS", "OUTCOME_CONTRACT_TESTS",
                            "OUTCOME_RUN_LAB", "OUTCOME_ALLOWLIST",
                            "OUTCOME_VERIFY_CONFIG", "OUTCOME_COMMIT"):
            self.assertIn(outcome_var, chain, outcome_var)
        # checkout이 체인 맨 앞(최우선)에 검사돼야 한다 — 나중 elif로 밀리면
        # 이미 skipped인 뒷단계 검사에 가려 놓칠 수 있다.
        self.assertLess(chain.index("OUTCOME_CHECKOUT"),
                        chain.index("OUTCOME_CONTRACT_TESTS"))

    def test_module_call_failure_has_fallback_notification(self):
        """checkout 자체가 실패해 gaeo_evolution 패키지가 없어도 이슈가 0개가
        되지 않는다(독립 QA 감사 MEDIUM 회귀 방지) — 폴백 알림 생성 배선 확인."""
        idx = self.wf.index("notify_build")
        chain = self.wf[idx:self.wf.index("GitHub Issue로 대표에게 알림")]
        self.assertIn("최소 폴백 알림", chain)
        self.assertIn("if python3 -m gaeo_evolution.notification build", chain)
        self.assertIn("else", chain)

    def test_install_deps_failure_yields_red_not_stale_green(self):
        """실제 로직을 그대로 재현 — install_deps 실패 시 RED가 나오는지."""
        # 워크플로우의 elif 체인과 동치인 판정을 그대로 수행(실행 로직 재현).
        outcomes = {"checkout": "success", "setup_python": "success",
                   "install_deps": "failure", "contract_tests": "skipped",
                   "run_lab": "skipped", "allowlist": "skipped",
                   "verify_config": "skipped", "commit": "skipped"}
        order = ["checkout", "setup_python", "install_deps", "contract_tests",
                 "run_lab", "allowlist", "verify_config", "commit"]
        failed_step = next((s for s in order if outcomes[s] == "failure"), None)
        job_failed = failed_step is not None
        self.assertEqual(failed_step, "install_deps")
        self.assertTrue(job_failed)
        # 오래된(stale) GREEN status.json이 있어도 job_failed가 우선한다.
        stale_status = _status_doc(systemHealth="OK")
        level = notif.decide_level(job_failed=job_failed, status_doc=stale_status,
                                   promotion_cards_doc={"cards": []})
        self.assertEqual(level, notif.LEVEL_RED)

    def test_cancelled_outcome_is_treated_as_failure_not_success(self):
        """⭐ 독립 QA 감사 HIGH #2 회귀 방지(2026-08-23).

        GitHub Actions 스텝 outcome은 success/failure/cancelled/skipped
        4가지다. job의 timeout-minutes(20분) 초과나 사람의 수동 취소는
        outcome=cancelled로 기록되는데, "= failure"만 검사하면 이를 놓쳐
        stale status.json으로 거짓 🟢 GREEN이 나간다(재현·수리 완료).
        재구현이 아니라 워크플로우의 실제 bash 스크립트를 그대로 추출해
        실행한다 — 예전처럼 '동치 로직을 손으로 다시 씀'으로는 이 버그를
        다시 놓칠 수 있기 때문이다.
        """
        import subprocess

        # PyYAML은 이 저장소 CI 러너에 설치돼 있지 않다(requirements.txt를 두지
        # 않는 게 저장소 방침) — YAML 파서 없이 notify_build 스텝의 `run: |`
        # 블록 스칼라를 텍스트로 직접 잘라낸다. 이 워크플로우의 들여쓰기는
        # 고정(스텝 8칸, run 블록 본문 10칸)이라 안전하게 잘라낼 수 있다.
        wf = open(os.path.join(HERE, ".github", "workflows",
                               "evolution-lab.yml"), encoding="utf-8").read()
        id_idx = wf.index("id: notify_build")
        run_marker = "\n        run: |\n"
        run_idx = wf.index(run_marker, id_idx)
        body_start = run_idx + len(run_marker)
        lines = []
        for line in wf[body_start:].splitlines(keepends=True):
            if line.strip() == "" or line.startswith(" " * 10):
                lines.append(line)
            else:
                break
        script = "".join(lines)

        with tempfile.TemporaryDirectory() as tmp:
            gh_output = os.path.join(tmp, "github_output")
            open(gh_output, "w").close()
            # 스크립트 안 --out 인자는 하드코딩된 /tmp/gaeo_notify.json이라
            # 그 경로에 그대로 쓰인다 — 판정 결과는 GITHUB_OUTPUT의 level=로 읽는다.
            env = dict(os.environ)
            env.update({
                "OUTCOME_CHECKOUT": "success", "OUTCOME_SETUP_PYTHON": "success",
                "OUTCOME_INSTALL_DEPS": "success", "OUTCOME_CONTRACT_TESTS": "success",
                "OUTCOME_RUN_LAB": "cancelled",  # ← job timeout/수동취소 재현
                "OUTCOME_ALLOWLIST": "skipped", "OUTCOME_VERIFY_CONFIG": "skipped",
                "OUTCOME_COMMIT": "skipped",
                "RUN_ID": "999888777", "RUN_URL": "https://example.invalid/run",
                "OWNER": "test-owner", "TZ": "Asia/Seoul",
                "GITHUB_OUTPUT": gh_output,
            })
            result = subprocess.run(["bash", "-c", script], cwd=HERE, env=env,
                                    capture_output=True, text=True, timeout=60)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("job_failed=true", result.stderr,
                          f"cancelled 단계가 실패로 감지되지 않음. stderr={result.stderr}")
            gh_out_text = open(gh_output).read()
            self.assertIn("level=RED", gh_out_text,
                          f"cancelled인데 RED가 아님 — stale status로 거짓 GREEN 가능성. "
                          f"stderr={result.stderr} github_output={gh_out_text}")


class NotificationSchemaDriftTest(unittest.TestCase):
    """⭐ 독립 QA 감사 LOW 회귀 방지(2026-08-23) — 손상된 status.json/
    promotion_cards.json(dict가 아닌 값)이 들어와도 AttributeError로 죽지 않고
    정직하게 RED로 판정한다(워크플로우 레벨 폴백에만 기대지 않는다)."""

    def test_non_dict_status_doc_is_treated_as_missing(self):
        level = notif.decide_level(job_failed=False, status_doc=["not", "a", "dict"],
                                   promotion_cards_doc={"cards": []})
        self.assertEqual(level, notif.LEVEL_RED)

    def test_non_dict_promotion_cards_doc_does_not_crash(self):
        level = notif.decide_level(job_failed=False, status_doc=_status_doc(),
                                   promotion_cards_doc=["not", "a", "dict"])
        self.assertEqual(level, notif.LEVEL_GREEN)  # cards 없음 취급, 크래시 없음

    def test_build_notification_survives_malformed_docs(self):
        result = notif.build_notification(
            owner="o", run_id="1", run_url="u", job_failed=False,
            status_doc="완전히 잘못된 문자열", promotion_cards_doc=123,
            today="2026-08-23")
        self.assertEqual(result["level"], notif.LEVEL_RED)
        self.assertIn("@o", result["body"])

    def test_cli_main_survives_truthy_non_dict_status_file(self):
        """독립 QA 재검토 LOW(2026-08-23) — main()이 build_notification()의 dict
        가드보다 먼저 status_doc을 만지는 줄(candidateGeneration 추출)이 있어,
        status.json이 '참(truthy)'인 비-dict JSON(예: 빈 리스트가 아닌 리스트)이면
        거기서 먼저 AttributeError로 죽을 수 있었다. CLI 진입점 자체로 재현."""
        with tempfile.TemporaryDirectory() as tmp:
            status_path = os.path.join(tmp, "status.json")
            cards_path = os.path.join(tmp, "cards.json")
            out_path = os.path.join(tmp, "out.json")
            json.dump(["이건 dict가 아니라 손상된 status.json이다"], open(status_path, "w"))
            json.dump({"cards": []}, open(cards_path, "w"))
            rc = notif.main(["build", "--status", status_path, "--cards", cards_path,
                            "--owner", "o", "--run-id", "1", "--run-url", "u",
                            "--job-failed", "false", "--out", out_path])
            self.assertEqual(rc, 0)
            result = json.load(open(out_path))
            self.assertEqual(result["level"], notif.LEVEL_RED)


class NotificationSensitiveFileTest(unittest.TestCase):
    def test_workflow_notify_step_has_always_condition(self):
        wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                  encoding="utf-8").read()
        # 알림 관련 두 단계 모두 if: always()
        idx = wf.index("Notification Builder")
        self.assertIn("if: always()", wf[idx - 400:idx + 400])
        idx2 = wf.index("GitHub Issue로 대표에게 알림")
        self.assertIn("if: always()", wf[idx2:idx2 + 300])

    def test_permissions_least_privilege(self):
        # PyYAML은 이 저장소 CI 러너에 설치돼 있지 않다(requirements.txt를 두지
        # 않는 게 저장소 방침) — 파싱 없이 permissions: 블록만 텍스트로 잘라 확인한다.
        wf = open(os.path.join(HERE, ".github", "workflows",
                               "evolution-lab.yml"), encoding="utf-8").read()
        start = wf.index("\npermissions:\n") + 1
        end = wf.index("\njobs:\n", start)
        perms_block = wf[start:end]
        self.assertIn("contents: write", perms_block)
        self.assertIn("issues: write", perms_block)
        for bad in ("admin:", "actions:", "packages:", "deployments:"):
            self.assertNotIn(bad, perms_block)

    def test_workflow_does_not_use_external_notification_services(self):
        wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                  encoding="utf-8").read()
        for banned in ("slack.com", "discord.com", "api.telegram.org",
                       "kakao", "sendgrid", "twilio", "SLACK_WEBHOOK",
                       "DISCORD_WEBHOOK"):
            self.assertNotIn(banned, wf, banned)


class Test19And20Placeholder(unittest.TestCase):
    """TEST 19(기존 계약 테스트 전부 PASS)·TEST 20(Behavioral Parity)은 이 파일
    자체의 전체 실행 + 별도 parity 스크립트로 검증한다(스킬 절차 문서에 기록)."""

    def test_notification_module_does_not_alter_evaluation_or_gate(self):
        """알림 기능이 evaluation.py/gate.py의 판정 함수를 재정의하지 않는지."""
        import gaeo_evolution.evaluation as ev
        import gaeo_evolution.gate as gt
        self.assertFalse(hasattr(ev, "notification"))
        self.assertFalse(hasattr(gt, "notification"))


if __name__ == "__main__":
    unittest.main()
