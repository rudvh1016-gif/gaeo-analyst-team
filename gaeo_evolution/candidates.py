# -*- coding: utf-8 -*-
"""후보 생성 — Deterministic(무LLM)과 Novel(Claude 연구)을 섞지 않는다.

이 모듈은 Deterministic Candidate만 만든다:
  실제 Production 가중치에서 Constitution weightBounds 안의 작은 이동(±step)
  + buyCut 근처 이동. → 싼 필터(Cheap Filter First)로 걸러 극소수만 Registry에 넣는다.

Novel Hypothesis Candidate는 /gaeo-evolve(Claude Code)가 spec만 작성해
registry.register_candidate로 넣는다 — 코드 생성이 아니라 선언적 spec이다.
후보 spec의 hypothesis 문자열은 어디서도 명령으로 실행되지 않는다(데이터일 뿐).

⭐ 2026-08-22 감사 수리:
  · Cheap Filter가 '시뮬 Baseline vs 시뮬 Candidate'(evaluation.compare_fair)로
    비교한다 — 무변경 후보의 개선폭은 0이어야 하고, 이는 영구 회귀테스트로 고정.
  · Baseline 가중치는 실제 Production 값(team_weights.js) — 낡은 BASE_W 아님.
  · createdAt은 날짜 단위로 고정해 같은 날 재실행이 같은 후보(멱등)가 되게 한다.
  · candidateId에 paramHash 앞자리를 붙여 '같은 ID·다른 내용' 충돌을 원천 차단.
  · 탈락 후보도 호출자가 registry.record_rejected로 개별 영구기록한다.
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


def _today():
    return datetime.date.today().isoformat()


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


def generate_deterministic(base_weights, constitution, failure_report=None,
                           baseline_version=None, evaluation_config=None,
                           data_window=None):
    """안전범위 안 가중치/경계 이동 후보를 만든다(최대 MAX_GENERATED개).

    base_weights: 실제 Production 가중치(evaluation.load_production_weights의 weights).
    baseline_version/evaluation_config/data_window: fingerprint에 들어가는
    재현성 메타 — 호출자(run_evolution_lab)가 실측값으로 채운다.
    """
    bounds = constitution["weightBounds"]
    specs = []
    stamp = datetime.datetime.now().strftime("%Y%m%d")
    common = {
        "createdAt": _today(),                 # 날짜 고정 — 같은 날 재실행 멱등
        "riskTier": "GREEN",
        "status": "RESEARCH_DRAFT",
        "baselineVersion": baseline_version,
        "evaluationConfig": evaluation_config,
        "dataWindow": data_window,
        "complexity": {"parametersAdded": 0, "rulesAdded": 0,
                       "featuresAdded": 0, "branchesAdded": 0},
    }
    for analyst in sorted(base_weights):
        for step in WEIGHT_STEPS:
            if abs(step) > bounds["maxStepFromBaseline"] + 1e-9:
                continue
            w = dict(base_weights)
            w[analyst] = w[analyst] + step
            w = _renormalize(w, bounds)
            if abs(sum(w.values()) - 1.0) > 1e-6:
                continue
            spec = dict(common)
            spec.update({
                "source": "deterministic_weight_step",
                "hypothesis": f"{analyst} 가중치를 {step:+.2f} 이동(재정규화)하면 행동 정밀도가 오른다",
                "failureClusters": [c["key"] for c in (failure_report or {}).get("clusters", [])
                                    if c.get("kind") == "analyst" and analyst in c["key"]][:3],
                "affectedScope": "chief_weights_global",
                "parameterChanges": {"weights": w},
                "expectedBenefit": None,
                "knownRisks": ["offline 근사 평가", "국면 편중 가능"],
            })
            ph = registry.param_hash(spec)
            spec["candidateId"] = f"det-{stamp}-w-{analyst}{step:+.2f}-{ph[:6]}"
            specs.append(spec)
    for step in BUY_CUT_STEPS:
        cut = constitution["thresholdBounds"]["buyCutBaseline"] + step
        lo, hi = constitution["thresholdBounds"]["buyCutRange"]
        if not (lo <= cut <= hi):
            continue
        spec = dict(common)
        spec.update({
            "source": "deterministic_threshold_step",
            "hypothesis": f"BUY 경계를 {cut}으로 옮기면 BUY 정밀도가 오른다",
            "failureClusters": [],
            "affectedScope": "chief_buy_threshold",
            "parameterChanges": {"buyCut": cut},
            "expectedBenefit": None,
            "knownRisks": ["offline 근사 평가", "coverage 감소 가능"],
        })
        ph = registry.param_hash(spec)
        spec["candidateId"] = f"det-{stamp}-buycut-{cut}-{ph[:6]}"
        specs.append(spec)
    return specs[:MAX_GENERATED]


def cheap_filter(specs, eval_rows, constitution, production):
    """Cheap Filter First — 비싼 검토 전에 Python이 걸러낸다.

    ⭐ 공정 비교: evaluation.compare_fair가 '시뮬 Baseline(실제 Production 가중치)
       vs 시뮬 Candidate'를 같은 행·같은 함수·같은 risk·같은 sellThreshold로 비교한다.
       eval_rows는 Failure Mining(연구구간)과 겹치지 않는 평가구간 행이어야 한다.

    통과 조건(전부 만족해야 생존):
      · offline 공정 비교에서 행동 정밀도 개선이 +0.5%p 이상
      · 후보 coverage가 시뮬 기준 대비 절반 밑으로 붕괴하지 않음
      · 방향 편중이 Constitution 상한 이하
      · 표본: uniqueDays ≥ minUniqueDaysOffline
    결과 정렬: 개선폭 큰 순 → 상위 MAX_SURVIVORS만.
    반환: (survivors, rejected) — rejected는 호출자가 개별 영구기록한다.
    """
    floor = constitution["promotionFloor"]
    survivors, rejected = [], []
    base_report = evaluation.compare_fair(eval_rows, production, changes=None)["baseline"]
    for spec in specs:
        why = []
        try:
            registry.validate_candidate(spec, constitution)
        except registry.CandidateSchemaError as exc:
            rejected.append({"spec": spec, "why": [f"schema:{exc}"]})
            continue
        cmp_result = evaluation.compare_fair(eval_rows, production,
                                             spec["parameterChanges"])
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
            rejected.append({"spec": spec, "why": why})
        else:
            spec = dict(spec)
            spec["offlineEvaluation"] = {
                "deltaPp": delta, "ci95": cmp_result["actionPrecisionDeltaCi95"],
                "candidate": {k: cand[k] for k in ("n", "uniqueDays", "coveragePct",
                                                   "directionSharePct", "brier")},
                "baseline": {k: base_report[k] for k in ("n", "uniqueDays", "coveragePct",
                                                         "directionSharePct", "brier")},
                "semantics": cmp_result["semantics"],
                "fairness": cmp_result["fairness"],
            }
            survivors.append(spec)
    survivors.sort(key=lambda s: -(s["offlineEvaluation"]["deltaPp"] or 0))
    return survivors[:MAX_SURVIVORS], rejected
