#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Evolution Lab — 결정론(무LLM) 오케스트레이터.

한 번의 실행이 하는 일(순서 고정):
  0. Constitution 로드+checksum 검증  → 실패 시 SAFE_MODE 기록 후 즉시 종료(FAIL CLOSED)
  1. Circuit Breaker 사전점검(데이터 신선도·아카이브 파일)
  2. 평가 행 구성(누출 검증 포함) → 현재 Production 성적표 → Baseline Registry 기록
  3. Failure Mining → 공개 failure_report(집계만)
  4. Memory 갱신(암호화 저장, Key 없으면 상세 저장 생략)
  5. Deterministic Candidate 생성 → Cheap Filter → Registry(BOOTSTRAP_SHADOW)
  6. Promotion Gate — 실전 Shadow 실측이 없는 후보는 전부 BOOTSTRAP_SHADOW 유지
  7. Rollback 점검(현재는 이전 안정버전 없음 → 기록만)
  8. research_needed 판정 → /gaeo-evolve가 읽을 상태 플래그
  9. Status + Run Manifest 기록

이 스크립트는 Production 판단(analyze_auto.py 경로)을 절대 수정하지 않는다.
Claude API를 호출하지 않으며, API key가 없어도 완전한 시스템으로 동작한다.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from gaeo_evolution import (candidates, constitution as constitution_mod,   # noqa: E402
                            evaluation, failure_miner, gate, manifest as manifest_mod,
                            memory as memory_mod, registry, status as status_mod)


def current_versions(root=HERE):
    """실측 가능한 버전 정보만 모은다. 모르면 None."""
    versions = {"gitSha": manifest_mod._git_sha(root)}
    try:
        from compute_model_intelligence import load_js
        tw = load_js(os.path.join(root, "team_weights.js"), "TEAM_WEIGHTS") or {}
        versions["teamWeightVersion"] = (tw.get("global") or {}).get("version") or tw.get("generatedAt")
        mi = load_js(os.path.join(root, "model_intelligence.js"), "MODEL_INTELLIGENCE") or {}
        versions["modelIntelligenceVersion"] = mi.get("version")
        versions["modelIntelligencePromotion"] = (mi.get("promotion") or {}).get("status")
    except Exception:
        pass
    try:
        import analyze_auto
        versions["baseModelVersion"] = analyze_auto.BASE_MODEL_VERSION
        versions["baseWeights"] = dict(analyze_auto.BASE_W)
    except Exception:
        versions["baseModelVersion"] = None
        versions["baseWeights"] = None
    return versions


def main():
    run = None
    try:
        const = constitution_mod.load()
    except constitution_mod.ConstitutionError as exc:
        # Constitution 실패는 절대 숨기지 않는다 — SAFE_MODE 기록 후 비정상 종료.
        doc = status_mod.build_status(
            mode="SAFE_MODE", production_version=None, baseline_summary=None,
            candidate_counts={}, memory_aggregate=None, failure_cluster_count=0,
            research_needed=False, safe_mode_reasons=[f"constitution: {exc}"])
        status_mod.write_json(status_mod.STATUS_PATH, doc)
        print(f"SAFE_MODE — {exc}")
        return 2

    run = manifest_mod.new_manifest("deterministic_evolution_lab",
                                    const["scoringVersion"])
    versions = current_versions()
    run["baseModelVersion"] = versions.get("baseModelVersion")

    # ── 1. Circuit Breaker 사전점검 ─────────────────────────────────────────
    fresh_ok, fresh_note = gate.data_freshness(HERE)
    checks = {
        "constitutionOk": True,
        "dataFresh": fresh_ok,
        "historyExists": os.path.exists(os.path.join(HERE, "history.js")),
        "analysisDataExists": os.path.exists(os.path.join(HERE, "analysis_data.json")),
    }
    safe, safe_reasons = gate.circuit_breaker(checks)
    if safe:
        doc = status_mod.build_status(
            mode="SAFE_MODE", production_version=versions.get("baseModelVersion"),
            baseline_summary=None, candidate_counts={}, memory_aggregate=None,
            failure_cluster_count=0, research_needed=False,
            safe_mode_reasons=safe_reasons, notes=[fresh_note])
        status_mod.write_json(status_mod.STATUS_PATH, doc)
        manifest_mod.finish(run, status="SAFE_MODE")
        print(f"SAFE_MODE — {safe_reasons}")
        return 1

    # ── 2. 평가 + Baseline ─────────────────────────────────────────────────
    history, closes = evaluation.load_market_data(HERE)
    rows, exclusion = evaluation.build_rows(history, closes)
    baseline = evaluation.report(rows, closes=closes)
    baseline["cutoffExclusion"] = exclusion
    registry.record_baseline(baseline, versions,
                             note="deterministic evolution lab 자동 기록")
    run["decisionCutoff"] = max((r["day"] for r in rows), default=None)
    run["stocksRequested"] = len({r["code"] for r in rows})

    # ── 3. Failure Mining ──────────────────────────────────────────────────
    report = failure_miner.mine(rows, closes)
    status_mod.write_json(status_mod.FAILURE_REPORT_PATH, report)

    # ── 4. Memory ─────────────────────────────────────────────────────────
    memories = memory_mod.load_all()
    known = {m.get("pattern") for m in memories}
    for cluster in report["clusters"]:
        if cluster["label"] not in known:
            memories.append(memory_mod.new_memory(
                cluster, source_model_version=versions.get("baseModelVersion")))
    memory_mod.lifecycle_pass(memories)
    saved, save_note = memory_mod.save_all(memories)
    mem_aggregate = memory_mod.public_aggregate(memories)
    mem_aggregate["detailStored"] = saved
    mem_aggregate["note"] = save_note

    # ── 5. Deterministic Candidates ────────────────────────────────────────
    base_weights = versions.get("baseWeights") or {"taro": .30, "diana": .12,
                                                   "nova": .28, "flow": .30}
    generated = candidates.generate_deterministic(base_weights, const, report)
    survivors, rejected = candidates.cheap_filter(generated, rows, const, base_weights)
    for spec in survivors:
        spec["status"] = "BOOTSTRAP_SHADOW"      # 배포 직후 자동승격 금지(Bootstrap)
        registry.upsert_candidate(spec, const)

    # ── 6. Promotion Gate ─────────────────────────────────────────────────
    cand_doc = registry.load_candidates()
    verdict_counts = {}
    for spec in cand_doc["entries"]:
        if spec["status"] in ("REJECTED", "ROLLED_BACK", "PRODUCTION"):
            verdict_counts[spec["status"]] = verdict_counts.get(spec["status"], 0) + 1
            continue
        # 실전 Shadow 실측이 아직 없다 — prospective=None → BOOTSTRAP_SHADOW.
        verdict, reasons = gate.promotion_decision(spec, None, const)
        registry.set_status(spec["candidateId"], verdict, reasons)
        verdict_counts[verdict] = verdict_counts.get(verdict, 0) + 1

    # ── 7. Rollback 점검(기록만 — 아직 승격 이력 없음) ──────────────────────
    baselines = registry.load_baselines()
    rollback_note = ("previousStable 없음 — 첫 승격 전까지 점검 대상 없음"
                     if not baselines.get("previousStable") else "previousStable 존재")

    # ── 8. research_needed — 큰 실패군집이 있는데 결정론 후보가 하나도
    #      살아남지 못했다면, 새 아이디어(Claude 연구)가 필요한 상태다.
    big_clusters = [c for c in report["clusters"] if c["rawN"] >= 30]
    research_needed = bool(big_clusters) and len(survivors) == 0

    # ── 9. Status + Manifest ──────────────────────────────────────────────
    doc = status_mod.build_status(
        mode=const["bootstrapPolicy"]["initialState"],
        production_version=versions.get("baseModelVersion"),
        baseline_summary={k: baseline[k] for k in
                          ("n", "uniqueDays", "regimeCount", "coveragePct", "brier")}
        | {"actionablePrecisionPct": baseline["actionable"]["precisionPct"],
           "buyPrecisionPct": baseline["buy"]["precisionPct"],
           "sellPrecisionPct": baseline["sell"]["precisionPct"]},
        candidate_counts=verdict_counts,
        memory_aggregate=mem_aggregate,
        failure_cluster_count=len(report["clusters"]),
        research_needed=research_needed,
        safe_mode_reasons=[],
        notes=[fresh_note, rollback_note,
               f"cheap filter: 생성 {len(generated)} → 생존 {len(survivors)} · 탈락 {len(rejected)}"])
    status_mod.write_json(status_mod.STATUS_PATH, doc)
    manifest_mod.finish(run, status="OK")
    print(f"Evolution Lab 완료 — 표본 {baseline['n']:,}행/{baseline['uniqueDays']}일 · "
          f"실패군집 {len(report['clusters'])} · 후보 생성 {len(generated)}→생존 {len(survivors)} · "
          f"상태 {doc['mode']} · 메모리 {mem_aggregate['total']}건(상세저장 {saved}) · "
          f"연구필요 {research_needed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
