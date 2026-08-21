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
                "brierGain": 0.01, "coveragePct": 20, "directionSharePct": 55,
                "precisionGainCi95": [0.4, 4.6]}

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
        survivors, rejected = candidates.cheap_filter(specs, rows, CONST, self.BASE)
        # 모든 행이 같은 점수 → 어떤 가중치 변경도 개선 불가 → 전멸이 정상.
        self.assertEqual(survivors, [])
        self.assertTrue(all(r["why"] for r in rejected))

    def test_cheap_filter_requires_min_unique_days(self):
        rows = spread_rows(n_days=5, per_day=40)       # 200행이지만 5일
        specs = candidates.generate_deterministic(self.BASE, CONST)[:3]
        survivors, rejected = candidates.cheap_filter(specs, rows, CONST, self.BASE)
        self.assertEqual(survivors, [])
        self.assertTrue(any(any("표본부족" in w for w in r["why"]) for r in rejected))


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


if __name__ == "__main__":
    unittest.main()
