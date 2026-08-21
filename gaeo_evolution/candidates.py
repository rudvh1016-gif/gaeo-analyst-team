# -*- coding: utf-8 -*-
"""후보 생성 — Deterministic(무LLM)과 Novel(Claude 연구)을 섞지 않는다.

이 모듈은 Deterministic Candidate만 만든다:
  현재 가중치에서 Constitution weightBounds 안의 작은 이동(±step) + buyCut 근처 이동.
  → 싼 필터(Cheap Filter First)로 걸러 극소수만 Registry에 넣는다.

Novel Hypothesis Candidate는 /gaeo-evolve(Claude Code)가 spec만 작성해
registry.upsert_candidate로 넣는다 — 코드 생성이 아니라 선언적 spec이다.
"""
import datetime
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from gaeo_evolution import evaluation, registry  # noqa: E402

WEIGHT_STEPS = (-0.06, -0.03, 0.03, 0.06)
BUY_CUT_STEPS = (-2, 2)
MAX_GENERATED = 24
MAX_SURVIVORS = 5


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _renormalize(weights, bounds):
    lo, hi = bounds["perAnalystMin"], bounds["perAnalystMax"]
    clipped = {k: min(hi, max(lo, v)) for k, v in weights.items()}
    total = sum(clipped.values())
    out = {k: round(v / total, 4) for k, v in clipped.items()}
    # 🐛 4자리 반올림 잔차로 합이 0.9999/1.0001이 되면 정상 후보가 조용히
    #    버려졌다(첫 실행에서 18개 중 6개 소실). 잔차를 가장 큰 가중치에 얹어
    #    합을 정확히 1.0으로 만든다.
    residual = round(1.0 - sum(out.values()), 4)
    if residual:
        top = max(out, key=out.get)
        out[top] = round(out[top] + residual, 4)
    return out


def generate_deterministic(base_weights, constitution, failure_report=None):
    """안전범위 안 가중치/경계 이동 후보를 만든다(최대 MAX_GENERATED개)."""
    bounds = constitution["weightBounds"]
    specs = []
    stamp = datetime.datetime.now().strftime("%Y%m%d")
    for analyst in sorted(base_weights):
        for step in WEIGHT_STEPS:
            if abs(step) > bounds["maxStepFromBaseline"] + 1e-9:
                continue
            w = dict(base_weights)
            w[analyst] = w[analyst] + step
            w = _renormalize(w, bounds)
            if abs(sum(w.values()) - 1.0) > 1e-6:
                continue
            specs.append({
                "candidateId": f"det-{stamp}-w-{analyst}{step:+.2f}",
                "createdAt": _now(), "source": "deterministic_weight_step",
                "riskTier": "GREEN",
                "hypothesis": f"{analyst} 가중치를 {step:+.2f} 이동(재정규화)하면 행동 정밀도가 오른다",
                "failureClusters": [c["key"] for c in (failure_report or {}).get("clusters", [])
                                    if c.get("kind") == "analyst" and analyst in c["key"]][:3],
                "affectedScope": "chief_weights_global",
                "parameterChanges": {"weights": w},
                "expectedBenefit": None, "knownRisks": ["offline 근사 평가", "국면 편중 가능"],
                "status": "RESEARCH_DRAFT",
                "complexity": {"parametersAdded": 0, "rulesAdded": 0,
                               "featuresAdded": 0, "branchesAdded": 0},
            })
    for step in BUY_CUT_STEPS:
        cut = constitution["thresholdBounds"]["buyCutBaseline"] + step
        lo, hi = constitution["thresholdBounds"]["buyCutRange"]
        if not (lo <= cut <= hi):
            continue
        specs.append({
            "candidateId": f"det-{stamp}-buycut-{cut}",
            "createdAt": _now(), "source": "deterministic_threshold_step",
            "riskTier": "GREEN",
            "hypothesis": f"BUY 경계를 {cut}으로 옮기면 BUY 정밀도가 오른다",
            "failureClusters": [],
            "affectedScope": "chief_buy_threshold",
            "parameterChanges": {"buyCut": cut},
            "expectedBenefit": None, "knownRisks": ["offline 근사 평가", "coverage 감소 가능"],
            "status": "RESEARCH_DRAFT",
            "complexity": {"parametersAdded": 0, "rulesAdded": 0,
                           "featuresAdded": 0, "branchesAdded": 0},
        })
    return specs[:MAX_GENERATED]


def cheap_filter(specs, rows, constitution, base_weights):
    """Cheap Filter First — 비싼 검토 전에 Python이 걸러낸다.

    통과 조건(전부 만족해야 생존):
      · offline 비교에서 행동 정밀도 개선이 +0.5%p 이상
      · 후보 coverage가 기준 대비 절반 밑으로 붕괴하지 않음
      · 방향 편중이 Constitution 상한 이하
      · 표본: uniqueDays ≥ minUniqueDaysOffline
    결과 정렬: 개선폭 큰 순 → 상위 MAX_SURVIVORS만.
    """
    floor = constitution["promotionFloor"]
    survivors, rejected = [], []
    baseline_rows = rows
    base_report = evaluation.report(baseline_rows)
    for spec in specs:
        why = []
        try:
            registry.validate_candidate(spec, constitution)
        except registry.CandidateSchemaError as exc:
            rejected.append({"candidateId": spec.get("candidateId"), "why": [f"schema:{exc}"]})
            continue
        changes = spec["parameterChanges"]
        sim = evaluation.simulate_candidate(
            baseline_rows,
            weights=changes.get("weights") or base_weights,
            buy_cut=changes.get("buyCut") or evaluation.BUY_CUT_BASELINE)
        cmp_result = evaluation.compare(baseline_rows, sim)
        cand = cmp_result["candidate"]
        delta = cmp_result["actionPrecisionDeltaPp"]
        if cand["uniqueDays"] < floor["minUniqueDaysOffline"]:
            why.append(f"표본부족: uniqueDays {cand['uniqueDays']}<{floor['minUniqueDaysOffline']}")
        if delta is None or delta < 0.5:
            why.append(f"개선없음: delta {delta}")
        if (cand["coveragePct"] or 0) < (base_report["coveragePct"] or 0) / 2:
            why.append("coverage 붕괴")
        if (cand["directionSharePct"] or 0) > floor["maxDirectionSharePct"]:
            why.append("방향 편중")
        if why:
            rejected.append({"candidateId": spec["candidateId"], "why": why})
        else:
            spec = dict(spec)
            spec["offlineEvaluation"] = {
                "deltaPp": delta, "ci95": cmp_result["actionPrecisionDeltaCi95"],
                "candidate": {k: cand[k] for k in ("n", "uniqueDays", "coveragePct",
                                                   "directionSharePct", "brier")},
                "semantics": cmp_result["semantics"],
            }
            survivors.append(spec)
    survivors.sort(key=lambda s: -(s["offlineEvaluation"]["deltaPp"] or 0))
    return survivors[:MAX_SURVIVORS], rejected
