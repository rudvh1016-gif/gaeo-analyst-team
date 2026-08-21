# -*- coding: utf-8 -*-
"""Baseline / Candidate Registry.

역할 구분(중복 금지):
  · model_registry.py            — 연구모델(A/B/C 계열)의 지위·수동승인 정책의 원천.
  · model_intelligence.js        — v3 앙상블·신뢰도모델의 promotion.qualified 원천.
  · 이 Registry                  — Evolution Harness가 만든 "후보(Candidate)"와
                                   "Production 기준선(Baseline) 성적 기록"의 원천.
  세 곳은 서로 다른 대상을 다루며, Production 선택 경로는 기존 그대로
  (analyze_auto.py ← model_intelligence.js / team_weights.js) 하나만 남는다.
  이 Registry의 후보는 그 경로를 우회해 Production을 바꾸지 못한다.

과거를 추정으로 backfill하지 않는다 — Registry는 확실한 현재 시점부터 시작한다.
"""
import datetime
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
REG_DIR = os.path.join(HERE, "registry")
BASELINE_PATH = os.path.join(REG_DIR, "baselines.json")
CANDIDATE_PATH = os.path.join(REG_DIR, "candidates.json")

# Candidate 상태기계 — 앞으로만 간다(REJECTED/ROLLED_BACK은 종점).
CANDIDATE_STATES = ("RESEARCH_DRAFT", "BOOTSTRAP_SHADOW", "SHADOW",
                    "QUALIFIED_AWAITING_APPROVAL", "PRODUCTION",
                    "REJECTED", "ROLLED_BACK")
RISK_TIERS = ("GREEN", "YELLOW", "ORANGE", "RED")

CANDIDATE_REQUIRED = ("candidateId", "createdAt", "source", "riskTier",
                      "hypothesis", "affectedScope", "parameterChanges",
                      "status", "complexity")


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _read(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def _write(path, doc):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)


# ── Baseline ────────────────────────────────────────────────────────────────

def load_baselines(path=BASELINE_PATH):
    return _read(path, {"schemaVersion": 1, "entries": []})


def record_baseline(metrics, versions, path=BASELINE_PATH, note=None):
    """현재 Production 성적표를 기준선으로 기록한다.

    versions: {"baseModelVersion":…, "teamWeightVersion":…, "scoringVersion":…,
               "gitSha":…} 등 실측 가능한 것만. 모르는 값은 None.
    같은 날 기록은 최신으로 교체한다(30분 러너로 파일이 비대해지는 것 방지).
    """
    doc = load_baselines(path)
    entry = {"recordedAt": _now(), "day": _now()[:10],
             "versions": versions, "metrics": metrics, "note": note}
    doc["entries"] = [e for e in doc["entries"] if e.get("day") != entry["day"]]
    doc["entries"].append(entry)
    doc["entries"] = doc["entries"][-120:]     # 최근 120일만 유지
    doc["previousStable"] = doc.get("previousStable")   # 명시적으로 보존
    _write(path, doc)
    return entry


def set_previous_stable(versions, path=BASELINE_PATH):
    doc = load_baselines(path)
    doc["previousStable"] = {"recordedAt": _now(), "versions": versions}
    _write(path, doc)
    return doc["previousStable"]


# ── Candidate ───────────────────────────────────────────────────────────────

class CandidateSchemaError(ValueError):
    pass


def validate_candidate(spec, constitution):
    """스키마·위험도·범위를 검사한다. RED 자동후보는 어떤 경우에도 거부."""
    for key in CANDIDATE_REQUIRED:
        if key not in spec:
            raise CandidateSchemaError(f"후보 필수 필드 누락: {key}")
    if spec["riskTier"] not in RISK_TIERS:
        raise CandidateSchemaError(f"알 수 없는 riskTier: {spec['riskTier']}")
    if spec["riskTier"] == "RED":
        raise CandidateSchemaError("RED 영역은 자동 후보가 될 수 없습니다")
    if spec["status"] not in CANDIDATE_STATES:
        raise CandidateSchemaError(f"알 수 없는 status: {spec['status']}")
    comp = spec["complexity"]
    budget = constitution["complexityBudget"]
    if comp.get("parametersAdded", 0) > budget["maxParametersAddedPerCandidate"]:
        raise CandidateSchemaError("complexity budget 초과: parametersAdded")
    if comp.get("rulesAdded", 0) > budget["maxRulesAddedPerCandidate"]:
        raise CandidateSchemaError("complexity budget 초과: rulesAdded")
    # 가중치 변경 후보는 Constitution 범위를 벗어날 수 없다.
    weights = (spec.get("parameterChanges") or {}).get("weights")
    if weights:
        b = constitution["weightBounds"]
        total = 0.0
        for name, value in weights.items():
            v = float(value)
            total += v
            if not (b["perAnalystMin"] <= v <= b["perAnalystMax"]):
                raise CandidateSchemaError(
                    f"weight 범위 위반: {name}={v} (허용 {b['perAnalystMin']}~{b['perAnalystMax']})")
        if abs(total - b["mustSumTo"]) > 1e-6:
            raise CandidateSchemaError(f"weight 합이 {b['mustSumTo']}이 아님: {total}")
    buy_cut = (spec.get("parameterChanges") or {}).get("buyCut")
    if buy_cut is not None:
        lo, hi = constitution["thresholdBounds"]["buyCutRange"]
        if not (lo <= buy_cut <= hi):
            raise CandidateSchemaError(f"buyCut 범위 위반: {buy_cut} (허용 {lo}~{hi})")
    return True


def load_candidates(path=CANDIDATE_PATH):
    return _read(path, {"schemaVersion": 1, "entries": []})


def upsert_candidate(spec, constitution, path=CANDIDATE_PATH):
    validate_candidate(spec, constitution)
    doc = load_candidates(path)
    doc["entries"] = [e for e in doc["entries"] if e["candidateId"] != spec["candidateId"]]
    doc["entries"].append(spec)
    _write(path, doc)
    return spec


def set_status(candidate_id, status, reasons=None, path=CANDIDATE_PATH):
    if status not in CANDIDATE_STATES:
        raise CandidateSchemaError(f"알 수 없는 status: {status}")
    doc = load_candidates(path)
    for e in doc["entries"]:
        if e["candidateId"] == candidate_id:
            e["status"] = status
            e["statusChangedAt"] = _now()
            if reasons is not None:
                e["statusReasons"] = reasons
            _write(path, doc)
            return e
    raise KeyError(f"후보 없음: {candidate_id}")
