#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Evolution Lab — 결정론(무LLM) 오케스트레이터.

한 번의 실행이 하는 일(순서 고정):
  0. Constitution 로드+checksum 검증  → 실패 시 SAFE_MODE 기록 후 즉시 종료(FAIL CLOSED)
  1. Circuit Breaker 사전점검(데이터 신선도·아카이브 파일·Registry 무결성)
  2. FORWARD RECORD ONLY 평가 행 구성(recon/backfill 제외·현재 모델버전만·누출 검증)
     → 현재 Production 성적표 → Baseline Registry 기록
  3. 연구/평가 시간분리 → Failure Mining(연구구간) → 공개 failure_report(집계만)
  4. Memory 갱신(암호화 저장, Key 없으면 상세 저장 생략)
  5. 평가구간이 충분할 때만: Deterministic Candidate 생성 → 공정 Cheap Filter
     (시뮬 vs 시뮬 · 실제 Production 가중치) → 생존은 Registry(BOOTSTRAP_SHADOW),
     탈락도 전원 개별 영구기록(REJECTED, 실험번호 부여)
  6. Shadow Recorder — 활성 후보마다 생성일 이후 새 실전 행을 champ/chall 병행 기록,
     성숙 처리, 실측(prospective) 계산
  7. Promotion Gate — 실전 Shadow 실측으로만 판정. QUALIFIED면 대표용 승격 카드 생성.
     자동 런타임의 종점은 QUALIFIED_AWAITING_APPROVAL(자동 Production 승격 없음)
  8. Rollback 감시 — PRODUCTION 후보의 승격 후 실측 악화 시 ROLLED_BACK(종점) +
     previousStable 복구 지시서 기록
  9. research_needed 판정 → /gaeo-evolve가 읽을 상태 플래그
 10. Status + Run Manifest 기록(재현성 메타 포함)

이 스크립트는 Production 판단(analyze_auto.py 경로)을 절대 수정하지 않는다.
Claude API를 호출하지 않으며, API key가 없어도 완전한 시스템으로 동작한다.
같은 날 재실행해도 기록이 중복/손상되지 않는다(멱등 설계).
"""
import datetime
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from gaeo_evolution import (candidates, constitution as constitution_mod,   # noqa: E402
                            evaluation, failure_miner, gate, manifest as manifest_mod,
                            memory as memory_mod, production_config as prodcfg_mod,
                            registry, shadow as shadow_mod, status as status_mod)


def _compute_mode(by_status):
    """실제 후보 상태로 mode를 계산한다 — 영원히 BOOTSTRAP_SHADOW로 남지 않게."""
    if by_status.get("PRODUCTION"):
        return "ACTIVE_PRODUCTION"
    if by_status.get("QUALIFIED_AWAITING_APPROVAL"):
        return "AWAITING_APPROVAL"
    if by_status.get("SHADOW") or by_status.get("BOOTSTRAP_SHADOW"):
        return "ACTIVE_SHADOW"
    return "BOOTSTRAP_SHADOW"


def _last_promotion(entries):
    """실제로 발생한 승인 이벤트만 — 없으면 None."""
    promoted = [e for e in entries if e.get("promotedAt")]
    if not promoted:
        return None
    latest = max(promoted, key=lambda e: e["promotedAt"])
    return {"candidateId": latest.get("candidateId"),
            "promotedAt": latest.get("promotedAt"),
            "approvedBy": latest.get("approvedBy"),
            "status": latest.get("status")}

PROMOTION_CARDS_PATH = os.path.join(HERE, "gaeo_evolution", "status", "promotion_cards.json")
ACTIVE_SHADOW_STATES = ("BOOTSTRAP_SHADOW", "SHADOW", "QUALIFIED_AWAITING_APPROVAL")


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
    except Exception:
        versions["baseModelVersion"] = None
    return versions


def _safe_mode_exit(reasons, versions=None, run=None, notes=None):
    doc = status_mod.build_status(
        mode="SAFE_MODE", production_version=(versions or {}).get("baseModelVersion"),
        baseline_summary=None, candidate_counts={}, memory_aggregate=None,
        failure_cluster_count=0, research_needed=False,
        safe_mode_reasons=reasons, notes=notes or [])
    status_mod.write_json(status_mod.STATUS_PATH, doc)
    if run is not None:
        manifest_mod.finish(run, status="SAFE_MODE")
    print(f"SAFE_MODE — {reasons}")


def main():
    run = None
    try:
        const = constitution_mod.load()
    except constitution_mod.ConstitutionError as exc:
        _safe_mode_exit([f"constitution: {exc}"])
        return 2

    run = manifest_mod.new_manifest("deterministic_evolution_lab",
                                    const["scoringVersion"])
    versions = current_versions()
    run["baseModelVersion"] = versions.get("baseModelVersion")

    # ── 1. Circuit Breaker 사전점검 ─────────────────────────────────────────
    fresh_ok, fresh_note = gate.data_freshness(HERE)
    registry_ok, corrupted = registry.verify_integrity()
    checks = {
        "constitutionOk": True,
        "dataFresh": fresh_ok,
        "historyExists": os.path.exists(os.path.join(HERE, "history.js")),
        "analysisDataExists": os.path.exists(os.path.join(HERE, "analysis_data.json")),
        "candidateRegistryIntact": registry_ok,
    }
    safe, safe_reasons = gate.circuit_breaker(checks)
    if safe:
        if not registry_ok:
            safe_reasons.append(f"변조 의심 후보: {corrupted}")
        _safe_mode_exit(safe_reasons, versions, run, notes=[fresh_note])
        return 1

    # ── 2. 실제 Production 가중치 + FORWARD RECORD ONLY 평가 ───────────────
    try:
        production = evaluation.load_production_weights(HERE)
    except evaluation.ProductionWeightsError as exc:
        _safe_mode_exit([f"production_weights: {exc}"], versions, run)
        return 1
    versions["productionWeights"] = production["weights"]
    versions["productionWeightsSource"] = production["source"]

    history, closes = evaluation.load_market_data(HERE)
    rows, selection = evaluation.build_rows(history, closes)   # 현재 버전·실전 기록만
    eval_meta = evaluation.evaluation_meta(rows, extra={"selection": selection})
    baseline = evaluation.report(rows, closes=closes)
    baseline["cutoffExclusion"] = {"excludedN": selection["excludedN"],
                                   "excludedWhy": selection["excludedWhy"]}
    baseline["authenticityExclusion"] = selection["excludedByAuthenticity"]
    registry.record_baseline(baseline, versions,
                             note="deterministic evolution lab 자동 기록 · forward-only v2")
    run["decisionCutoff"] = max((r["day"] for r in rows), default=None)
    run["stocksRequested"] = len({r["code"] for r in rows})
    run["evaluationMeta"] = eval_meta

    # ── 3. 연구/평가 시간분리 + Failure Mining ─────────────────────────────
    offline_policy = const.get("offlineDataPolicy", {})
    research_rows, eval_rows, split_note = evaluation.split_research_eval(
        rows,
        min_research_days=int(offline_policy.get("minResearchDays", 10)),
        min_eval_days=int(offline_policy.get("minEvalDays", 20)))
    mining_rows = research_rows if split_note["sufficient"] else rows
    report = failure_miner.mine(mining_rows, closes)
    report["dataSplit"] = split_note
    if not split_note["sufficient"]:
        report["note2"] = ("연구/평가 분리 불가(데이터 부족) — 이번 주 후보 생성은 쉬고 "
                          "mining은 참고용으로만 기록")
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

    # ── 5. Deterministic Candidates (평가구간이 충분할 때만) ────────────────
    generated, survivors, rejected = [], [], []
    registration_conflicts = []
    if split_note["sufficient"]:
        baseline_version = {
            "baseModelVersion": versions.get("baseModelVersion"),
            "teamWeightVersion": versions.get("teamWeightVersion"),
            "baseWeights": production["weights"],
            "buyCutBaseline": evaluation.BUY_CUT_BASELINE,
        }
        evaluation_config = {
            "semantics": evaluation.OFFLINE_SEMANTICS,
            "evaluationVersion": evaluation.EVALUATION_VERSION,
            "recordSelection": selection["recordSelection"],
        }
        data_window = {"evalWindow": split_note["evalWindow"],
                       "researchWindow": split_note["researchWindow"],
                       "dataFingerprint": eval_meta["dataFingerprint"]}
        generated = candidates.generate_deterministic(
            production["weights"], const, report,
            baseline_version=baseline_version,
            evaluation_config=evaluation_config,
            data_window=data_window)
        survivors, rejected = candidates.cheap_filter(generated, eval_rows,
                                                      const, production)
        for item in rejected:                     # 탈락도 전원 개별 영구기록
            try:
                registry.record_rejected(item["spec"], item["why"],
                                         evaluation_meta={"dataWindow": data_window,
                                                          "semantics": evaluation.OFFLINE_SEMANTICS})
            except registry.CandidateImmutabilityError:
                # 같은 날 데이터가 바뀐 재실행 — 원본 기록을 보존하고 건너뛴다.
                registration_conflicts.append(item["spec"].get("candidateId"))
        for spec in survivors:
            spec["status"] = "BOOTSTRAP_SHADOW"   # 배포 직후 자동승격 금지(Bootstrap)
            try:
                registry.register_candidate(spec, const)
            except registry.CandidateImmutabilityError:
                registration_conflicts.append(spec.get("candidateId"))

    # ── 6~7. Shadow Recorder + Promotion Gate ─────────────────────────────
    cand_doc = registry.load_candidates()
    param_history = registry.prior_param_history(cand_doc)
    today_iso = datetime.date.today().isoformat()
    cooldown_days = int((const.get("rollbackPolicy") or {}).get("sameParamCooldownDays", 30))

    def _recent_rollback_exists():
        for e in cand_doc["entries"]:
            if e.get("status") != "ROLLED_BACK":
                continue
            at = str(e.get("rolledBackAt") or e.get("statusChangedAt") or "")[:10]
            if at:
                try:
                    age = (datetime.date.fromisoformat(today_iso) -
                           datetime.date.fromisoformat(at)).days
                    if age <= cooldown_days:
                        return True
                except ValueError:
                    continue
        return False

    rollback_freeze = _recent_rollback_exists()
    verdict_counts = {}
    shadow_summaries = []
    promotion_cards = []
    state_errors = []
    for spec in list(cand_doc["entries"]):
        state = spec.get("status")
        if state in ("REJECTED", "ROLLED_BACK", "PRODUCTION", "RESEARCH_DRAFT"):
            verdict_counts[state] = verdict_counts.get(state, 0) + 1
            continue
        if state not in ACTIVE_SHADOW_STATES:
            verdict_counts[state] = verdict_counts.get(state, 0) + 1
            continue
        # Constitution riskTiers 집행 — autoShadow가 아닌 tier(ORANGE 등)는
        # 자동 런타임이 Shadow 증거를 쌓아주지 않는다(수동 검토 전용).
        tier_cfg = const["riskTiers"].get(spec.get("riskTier"), {})
        if tier_cfg.get("autoShadow") is not True:
            verdict_counts[state] = verdict_counts.get(state, 0) + 1
            continue
        # Shadow 기록 — 생성일 이후 새 실전 행만, 같은 입력, Production 무영향.
        led = shadow_mod.load_or_create_ledger(spec, production)
        shadow_mod.append_rows(led, rows)
        shadow_mod.mature_rows(led, closes)
        prospective = shadow_mod.prospective_metrics(led, closes)
        shadow_mod.save_ledger(led)
        shadow_summaries.append(shadow_mod.public_summary(led))
        verdict, reasons = gate.promotion_decision(spec, prospective, const,
                                                   param_history)
        # 반복검정 완화 — 승격 기준을 '2회 연속' 충족해야 QUALIFIED가 된다.
        streak = int(spec.get("qualifiedStreak") or 0)
        streak = streak + 1 if verdict == gate.VERDICT_QUALIFIED else 0
        if verdict == gate.VERDICT_QUALIFIED and rollback_freeze:
            verdict, reasons = gate.VERDICT_KEEP, [
                "Circuit Breaker: 최근 롤백 미해결/안정화 기간 — 신규 승격 전면 보류"]
        if verdict == gate.VERDICT_QUALIFIED and streak < 2:
            verdict, reasons = gate.VERDICT_KEEP, [
                f"반복검정 완화 — 승격 기준 {streak}/2회 연속 충족. 다음 주간 실행에서 재확인"]
        new_state = {"BOOTSTRAP_SHADOW": "BOOTSTRAP_SHADOW",
                     "KEEP_SHADOW": "SHADOW",
                     "QUALIFIED_AWAITING_APPROVAL": "QUALIFIED_AWAITING_APPROVAL",
                     "REJECTED": "REJECTED"}[verdict]
        try:
            registry.set_status(spec["candidateId"], new_state, reasons,
                                extra={"prospective": prospective,
                                       "shadowSummary": shadow_mod.public_summary(led),
                                       "qualifiedStreak": streak})
        except registry.CandidateStateError as exc:
            # 한 후보의 전이 오류가 주간 실행 전체를 죽이지 않게 격리(FAIL LOUD 기록).
            state_errors.append(f"{spec['candidateId']}: {exc}")
            verdict_counts[state] = verdict_counts.get(state, 0) + 1
            continue
        verdict_counts[new_state] = verdict_counts.get(new_state, 0) + 1
        if new_state == "QUALIFIED_AWAITING_APPROVAL":
            promotion_cards.append(gate.build_promotion_card(
                spec, prospective, verdict, reasons, const))
    # 카드 파일은 항상 현재 상태로 갱신 — 강등된 후보의 옛 카드가 남지 않게 한다.
    status_mod.write_json(PROMOTION_CARDS_PATH, {
        "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "cards": promotion_cards,
        "notice": "기계 판정은 추천일 뿐이며, 실제 반영은 대표 승인 후에만 진행됩니다."})

    # ── 8. Rollback 감시(승격된 후보의 실측 악화) ──────────────────────────
    cand_doc = registry.load_candidates()
    last_rollback = None
    rollback_safe_errors = []
    for spec in cand_doc["entries"]:
        if spec.get("status") != "PRODUCTION":
            continue
        promoted_day = str(spec.get("promotedAt") or spec.get("statusChangedAt") or "")[:10]
        post_rows = [r for r in rows if promoted_day and r["day"] > promoted_day]
        post_matured_days = sorted({r["day"] for r in post_rows if r.get("ret5") is not None})
        if spec.get("productionBaselineMetrics") is None:
            # 승격 시점 성적표 스냅샷이 없으면 지금 확정하고 이번 회차 판정은 보류.
            # (PRODUCTION→PRODUCTION 전이는 상태기계가 막으므로 허용 필드만 직접 기록)
            doc2 = registry.load_candidates()
            entry2 = registry.find_candidate(spec["candidateId"], doc2)
            if entry2 is not None and entry2.get("productionBaselineMetrics") is None:
                entry2["productionBaselineMetrics"] = baseline
                registry._write(registry.CANDIDATE_PATH, doc2)
            continue
        current_metrics = evaluation.report(post_rows, closes=closes)
        recommend, why = gate.rollback_check(
            current_metrics, spec["productionBaselineMetrics"], const,
            observation_days=len(post_matured_days))
        if recommend:
            # 실제 Production 설정 복원까지 수행한다(gate.execute_rollback 내부).
            last_rollback = gate.execute_rollback(spec["candidateId"], why)
            if last_rollback.get("safeMode"):
                # 복원 실패 — 잘못된 설정이 남아 있을 수 있다. 치명으로 취급.
                rollback_safe_errors.append(last_rollback.get("error"))

    # ── 9. research_needed — 큰 실패군집이 있는데 결정론 후보가 하나도
    #      살아남지 못했다면, 새 아이디어(Claude 연구)가 필요한 상태다.
    big_clusters = [c for c in report["clusters"] if c["rawN"] >= 30]
    research_needed = bool(big_clusters) and len(survivors) == 0 and split_note["sufficient"]

    # ── 9.5 Production 적용 정합성 + 실제 상태 계산 ────────────────────────
    cand_doc = registry.load_candidates()
    totals = registry.experiment_totals(cand_doc)
    by_status = totals["byStatus"]
    cfg_health = prodcfg_mod.config_health()
    degraded_reasons = list(state_errors)
    if not cfg_health["ok"]:
        degraded_reasons.append(f"production config: {cfg_health['note']}")
    prod_ids = {e.get("candidateId") for e in cand_doc["entries"]
                if e.get("status") == "PRODUCTION"}
    if prod_ids and cfg_health.get("activeCandidateId") not in prod_ids:
        degraded_reasons.append(
            f"불일치: Registry PRODUCTION {sorted(prod_ids)} vs 실제 적용 "
            f"{cfg_health.get('activeCandidateId')} — status만 PRODUCTION인 상태 금지")
    if not prod_ids and cfg_health.get("overrideApplied"):
        degraded_reasons.append(
            f"불일치: 적용된 override({cfg_health.get('activeCandidateId')})가 있는데 "
            "PRODUCTION 후보가 없음")
    safe_reasons_final = list(rollback_safe_errors)   # 롤백 복원 실패 = 치명
    mode_final = "SAFE_MODE" if safe_reasons_final else _compute_mode(by_status)

    # ── 10. Status + Manifest ─────────────────────────────────────────────
    offline_note = ("offline 연구 정상" if split_note["sufficient"]
                    else f"{split_note['verdict']} (실전 판단일 {split_note['uniqueDays']}/"
                         f"{split_note['requiredDays']}일)")
    # 생존 편향 감시 — 판단 후 10거래일이 지나도 결과가 안 잡히는 행(상장폐지 등)을 노출.
    all_days = sorted({r["day"] for r in rows})
    stale_pending = sum(
        1 for r in rows if r.get("ret5") is None and
        sum(1 for d in all_days if d > r["day"]) >= 10)
    doc = status_mod.build_status(
        mode=mode_final,
        production_version=versions.get("baseModelVersion"),
        baseline_summary={k: baseline[k] for k in
                          ("n", "uniqueDays", "regimeCount", "coveragePct", "brier")}
        | {"actionablePrecisionPct": baseline["actionable"]["precisionPct"],
           "buyPrecisionPct": baseline["buy"]["precisionPct"],
           "sellPrecisionPct": baseline["sell"]["precisionPct"],
           "recordSelection": baseline["recordSelection"],
           "modelVersions": baseline["modelVersions"],
           "productionConfigVersion": cfg_health.get("productionConfigVersion")},
        candidate_counts=by_status,
        memory_aggregate=mem_aggregate,
        failure_cluster_count=len(report["clusters"]),
        research_needed=research_needed,
        safe_mode_reasons=safe_reasons_final,
        degraded_reasons=degraded_reasons,
        last_promotion=_last_promotion(cand_doc["entries"]),
        last_rollback=last_rollback,
        notes=[fresh_note, offline_note,
               f"실험 누계: {registry.experiment_totals()['totalExperiments']}회",
               f"cheap filter: 생성 {len(generated)} → 생존 {len(survivors)} · 탈락 {len(rejected)}",
               f"shadow 활성 후보 {len(shadow_summaries)}개",
               f"성숙 지연 행(10거래일 초과 미성숙): {stale_pending}",
               f"production weights: {production['source']}"]
              + ([f"⚠️ 상태전이 오류(격리됨): {state_errors}"] if state_errors else [])
              + ([f"같은 날 재실행 충돌(원본 보존, 건너뜀): {len(registration_conflicts)}건"]
                 if registration_conflicts else []))
    doc["experimentTotals"] = registry.experiment_totals()
    doc["shadowSummaries"] = shadow_summaries
    doc["promotionCardsAvailable"] = bool(promotion_cards)
    status_mod.write_json(status_mod.STATUS_PATH, doc)
    manifest_mod.finish(run, status="OK")
    print(f"Evolution Lab 완료 — 표본 {baseline['n']:,}행/{baseline['uniqueDays']}일 "
          f"(forward-only·현재버전) · 실패군집 {len(report['clusters'])} · "
          f"후보 생성 {len(generated)}→생존 {len(survivors)}·탈락기록 {len(rejected)} · "
          f"실험누계 {doc['experimentTotals']['totalExperiments']} · "
          f"shadow {len(shadow_summaries)}개 · 상태 {doc['mode']} · "
          f"메모리 {mem_aggregate['total']}건(상세저장 {saved}) · "
          f"offline: {offline_note} · 연구필요 {research_needed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
