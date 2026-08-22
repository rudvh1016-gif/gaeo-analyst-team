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

⭐ 2026-08-22 감사 수리 — 후보 불변성:
  · 후보는 만들어진 순간 SHA256 fingerprint로 잠긴다. 같은 candidateId로 다른
    내용을 저장하려 하면 CandidateImmutabilityError — 수정이 아니라 새 후보를 만든다.
  · 모든 후보(탈락 포함)는 전역 실험번호(EXP-000001…)를 받고 영구 보존된다.
    "이번 주 몇 개"가 아니라 "지금까지 총 몇 번 시험했는가"를 기억한다.
  · 상태기계를 코드로 강제한다 — REJECTED / ROLLED_BACK 은 종점이며,
    어떤 경로로도 QUALIFIED나 PRODUCTION으로 되돌아갈 수 없다.
"""
import copy
import datetime
import hashlib
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
TERMINAL_STATES = frozenset(("REJECTED", "ROLLED_BACK"))
# 허용 전이(같은 상태 유지도 여기 포함). PRODUCTION 진입은 approve_production 전용.
ALLOWED_TRANSITIONS = {
    "RESEARCH_DRAFT": {"RESEARCH_DRAFT", "BOOTSTRAP_SHADOW", "REJECTED"},
    "BOOTSTRAP_SHADOW": {"BOOTSTRAP_SHADOW", "SHADOW", "REJECTED"},
    "SHADOW": {"SHADOW", "BOOTSTRAP_SHADOW", "QUALIFIED_AWAITING_APPROVAL", "REJECTED"},
    "QUALIFIED_AWAITING_APPROVAL": {"QUALIFIED_AWAITING_APPROVAL", "SHADOW",
                                    "BOOTSTRAP_SHADOW", "PRODUCTION", "REJECTED"},
    "PRODUCTION": {"ROLLED_BACK"},
    "REJECTED": set(),
    "ROLLED_BACK": set(),
}
RISK_TIERS = ("GREEN", "YELLOW", "ORANGE", "RED")

CANDIDATE_REQUIRED = ("candidateId", "createdAt", "source", "riskTier",
                      "hypothesis", "affectedScope", "parameterChanges",
                      "status", "complexity")

# fingerprint 재료 — 후보의 '정체'를 이루는 핵심 설정.
# (Parameter Changes · Baseline 버전 · 생성 방식 · 생성 시점 · Evaluation 설정 ·
#  데이터 연구구간 · 후보 유형/범위)
FINGERPRINT_FIELDS = ("candidateId", "createdAt", "source", "riskTier",
                      "affectedScope", "parameterChanges", "baselineVersion",
                      "evaluationConfig", "dataWindow")
# 이미 존재하는 파라미터 키 — 이 밖의 키는 '새 파라미터'로 세어 complexity 검증에 쓴다.
KNOWN_PARAM_KEYS = frozenset(("weights", "buyCut"))
# set_status가 추가로 기록을 허용하는 키(핵심 설정 변조 방지 화이트리스트).
STATUS_EXTRA_ALLOWED = frozenset((
    "prospective", "promotionCard", "promotedAt", "productionBaselineMetrics",
    "approvedBy", "rolledBackAt", "shadowSummary", "evaluationMeta",
    "qualifiedStreak"))
# 신규 등록이 가질 수 있는 초기 상태 — QUALIFIED/PRODUCTION으로 '태어나는' 우회 금지.
ALLOWED_INITIAL_STATES = frozenset(("RESEARCH_DRAFT", "BOOTSTRAP_SHADOW"))


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


def _canonical(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


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


def usable_baselines(doc=None, path=BASELINE_PATH):
    """비교에 써도 되는 기준선만 — recordSelection이 forward-only인 항목.

    2026-08-22 이전 항목은 recon(사후 재구성) 행이 섞인 성적이라 비교 기준으로
    쓰지 않는다(파일에서 지우지는 않는다 — 보존하되 성적 비교에서만 제외).
    """
    doc = doc or load_baselines(path)
    return [e for e in doc.get("entries", [])
            if (e.get("metrics") or {}).get("recordSelection") == "forward_record_only_v2"]


def set_previous_stable(versions, path=BASELINE_PATH):
    doc = load_baselines(path)
    doc["previousStable"] = {"recordedAt": _now(), "versions": versions}
    _write(path, doc)
    return doc["previousStable"]


# ── Candidate ───────────────────────────────────────────────────────────────

class CandidateSchemaError(ValueError):
    pass


class CandidateImmutabilityError(RuntimeError):
    """만들어진 후보의 핵심 설정을 같은 ID로 바꿔치기하려 했다. 새 후보로 생성해야 한다."""


class CandidateStateError(RuntimeError):
    """상태기계 위반 — 금지된 상태전이(예: REJECTED → QUALIFIED)."""


def candidate_fingerprint(spec):
    """후보 핵심 설정의 SHA256 — 생성 순간의 정체를 고정한다."""
    material = {key: spec.get(key) for key in FINGERPRINT_FIELDS}
    return hashlib.sha256(_canonical(material).encode("utf-8")).hexdigest()


def param_hash(spec):
    """parameterChanges만의 SHA256 — 롤백 후 같은 설정의 재승격 차단(cooldown)에 쓴다."""
    return hashlib.sha256(
        _canonical(spec.get("parameterChanges")).encode("utf-8")).hexdigest()


def computed_complexity(spec):
    """선언이 아니라 실제 변경내용으로 complexity를 계산한다.

    KNOWN_PARAM_KEYS(weights/buyCut) 밖의 파라미터 키는 전부 '새 파라미터'다.
    후보가 자기 complexity를 0이라고 적어도 이 값보다 작게 신고할 수 없다.
    """
    changes = spec.get("parameterChanges") or {}
    new_keys = sorted(k for k in changes if k not in KNOWN_PARAM_KEYS)
    return {"parametersAdded": len(new_keys), "newParameterKeys": new_keys}


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
    verified = computed_complexity(spec)
    declared_params = int(comp.get("parametersAdded", 0) or 0)
    if declared_params < verified["parametersAdded"]:
        raise CandidateSchemaError(
            f"complexity 과소신고: parametersAdded 선언 {declared_params} < "
            f"실측 {verified['parametersAdded']} (새 키 {verified['newParameterKeys']})")
    effective_params = max(declared_params, verified["parametersAdded"])
    if effective_params > budget["maxParametersAddedPerCandidate"]:
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
    return _read(path, {"schemaVersion": 2, "experimentCounter": 0, "entries": []})


def find_candidate(candidate_id, doc=None, path=CANDIDATE_PATH):
    doc = doc or load_candidates(path)
    return next((e for e in doc["entries"] if e.get("candidateId") == candidate_id), None)


def _register(spec, doc):
    """공통 등록 — 실험번호 부여 + statusHistory 시작. 호출자가 _write한다."""
    doc["experimentCounter"] = int(doc.get("experimentCounter", 0)) + 1
    spec["experimentSerial"] = f"EXP-{doc['experimentCounter']:06d}"
    spec["statusHistory"] = [{"at": _now(), "from": None, "to": spec["status"],
                              "reasons": ["registered"]}]
    doc["entries"].append(spec)
    return spec


def register_candidate(spec, constitution, path=CANDIDATE_PATH):
    """후보 등록 — 생성 순간 fingerprint로 잠근다(수정 불가).

    · 같은 ID + 같은 fingerprint  → 멱등(기존 기록 그대로 반환, 덮어쓰기 없음)
    · 같은 ID + 다른 내용         → CandidateImmutabilityError (새 후보로 생성해야 함)
    · 초기 상태는 RESEARCH_DRAFT/BOOTSTRAP_SHADOW만 — QUALIFIED나 PRODUCTION으로
      '태어나는' 후보는 거부한다(상태기계 우회 방지).
    """
    validate_candidate(spec, constitution)
    if spec.get("status") not in ALLOWED_INITIAL_STATES:
        raise CandidateStateError(
            f"신규 후보의 초기 상태는 {sorted(ALLOWED_INITIAL_STATES)}만 가능: "
            f"{spec.get('candidateId')} → {spec.get('status')}")
    spec = copy.deepcopy(spec)
    fp = candidate_fingerprint(spec)
    if spec.get("fingerprint") not in (None, fp):
        raise CandidateImmutabilityError(
            f"fingerprint 불일치 — spec이 손상됐거나 변조됨: {spec.get('candidateId')}")
    spec["fingerprint"] = fp
    spec["paramHash"] = param_hash(spec)
    doc = load_candidates(path)
    existing = find_candidate(spec["candidateId"], doc)
    if existing is not None:
        if existing.get("fingerprint") == fp:
            return existing                       # 멱등 — 기존 기록을 절대 덮지 않는다
        raise CandidateImmutabilityError(
            f"후보 불변성 위반 — 같은 ID({spec['candidateId']})로 다른 내용 저장 시도. "
            "가중치·임계값·핵심 설정이 바뀌면 새 candidateId로 새 후보를 만들어야 합니다.")
    _register(spec, doc)
    _write(path, doc)
    return spec


def upsert_candidate(spec, constitution, path=CANDIDATE_PATH):
    """(구명칭 호환) '수정'은 더 이상 불가능하다 — register_candidate와 동일하게 동작."""
    return register_candidate(spec, constitution, path)


def record_rejected(spec, reject_reasons, path=CANDIDATE_PATH, evaluation_meta=None):
    """탈락 후보도 개별 영구기록 — Cheap Filter 탈락 역시 실험 1회로 센다.

    스키마 위반으로 탈락한 후보도 기록해야 하므로 validate_candidate는 다시 부르지
    않는다(탈락 사유에 이미 담겨 있다). 최소 필드만 요구한다.
    """
    if not spec.get("candidateId"):
        raise CandidateSchemaError("탈락 기록에도 candidateId는 필요합니다")
    spec = copy.deepcopy(spec)
    spec["status"] = "REJECTED"
    spec["rejectReasons"] = list(reject_reasons or [])
    spec["rejectedAt"] = _now()
    if evaluation_meta is not None:
        spec["evaluationMeta"] = evaluation_meta
    fp = candidate_fingerprint(spec)
    spec["fingerprint"] = fp
    spec["paramHash"] = param_hash(spec)
    doc = load_candidates(path)
    existing = find_candidate(spec["candidateId"], doc)
    if existing is not None:
        if existing.get("fingerprint") == fp:
            return existing                       # 같은 날 재실행 — 멱등
        raise CandidateImmutabilityError(
            f"탈락 기록 충돌 — 같은 ID({spec['candidateId']})에 다른 내용: 새 ID 필요")
    _register(spec, doc)
    _write(path, doc)
    return spec


def set_status(candidate_id, status, reasons=None, path=CANDIDATE_PATH, extra=None):
    """상태 변경 — ALLOWED_TRANSITIONS 밖의 전이는 예외로 거부한다.

    · REJECTED / ROLLED_BACK 은 종점 — 어떤 상태로도 되돌릴 수 없다.
      다시 시험하려면 새 후보를 만들어야 한다.
    · PRODUCTION 진입은 approve_production(사람 승인 명령) 전용이다.
    · extra는 STATUS_EXTRA_ALLOWED 키만 허용 — 핵심 설정(fingerprint 재료)은
      이 경로로도 바꿀 수 없다.
    """
    if status not in CANDIDATE_STATES:
        raise CandidateSchemaError(f"알 수 없는 status: {status}")
    doc = load_candidates(path)
    entry = find_candidate(candidate_id, doc)
    if entry is None:
        raise KeyError(f"후보 없음: {candidate_id}")
    current = entry.get("status")
    if current in TERMINAL_STATES:
        raise CandidateStateError(
            f"{current}는 종점 상태입니다 — {candidate_id}는 상태를 바꿀 수 없습니다. "
            "다시 시험하려면 새 후보를 만드세요.")
    if status == "PRODUCTION":
        raise CandidateStateError(
            "PRODUCTION 전이는 set_status로 불가 — 사람 승인 명령(approve_production)만 가능")
    if status not in ALLOWED_TRANSITIONS.get(current, set()):
        raise CandidateStateError(f"금지된 상태전이: {current} → {status} ({candidate_id})")
    if extra:
        bad = sorted(set(extra) - STATUS_EXTRA_ALLOWED)
        if bad:
            raise CandidateStateError(f"set_status extra로 바꿀 수 없는 필드: {bad}")
    entry["status"] = status
    entry["statusChangedAt"] = _now()
    if reasons is not None:
        entry["statusReasons"] = reasons
    entry.setdefault("statusHistory", []).append(
        {"at": _now(), "from": current, "to": status, "reasons": reasons})
    entry["statusHistory"] = entry["statusHistory"][-40:]
    if extra:
        entry.update(extra)
    _write(path, doc)
    return entry


def approve_production(candidate_id, approver, path=CANDIDATE_PATH,
                       baseline_path=BASELINE_PATH, config_path=None,
                       constitution_doc=None):
    """⭐ 사람(대표) 승인 전용 — 실제 Production 적용까지 '원자적으로' 수행한다.

    2026-08-22 2차 감사 수리: 예전에는 status만 PRODUCTION으로 적고 실제
    분석 경로에는 아무것도 적용하지 않았다. 이제 순서는 다음과 같고,
    하나라도 실패하면 기존 Production 설정 유지 + 후보 상태 불변이다.

      1 승인자·상태(QUALIFIED_AWAITING_APPROVAL) 확인
      2 fingerprint 재검증(변조 의심 시 거부)
      3 Constitution 재검증(checksum 포함)
      4 실제 현재 Production 설정 Snapshot — 호출자가 아니라 코드가 직접 뜬다
        (잘못된 rollback target이 기록되는 것을 방지)
      5 previousStable 기록 + 승인 시점 성적표 동결
      6 후보 파라미터 재검증(Constitution 범위)
      7 production_config 원자 적용 → 재읽기 검증 → 실제 분석 경로 fixture 검증
      8 전부 성공했을 때만 status=PRODUCTION 기록
        (이 기록마저 실패하면 방금 적용한 config를 즉시 원복하고 예외)
    """
    from gaeo_evolution import constitution as constitution_mod
    from gaeo_evolution import production_config as pc
    if not approver or not str(approver).strip():
        raise CandidateStateError("approver(승인자)를 명시해야 합니다")
    doc = load_candidates(path)
    entry = find_candidate(candidate_id, doc)
    if entry is None:
        raise KeyError(f"후보 없음: {candidate_id}")
    if entry.get("status") != "QUALIFIED_AWAITING_APPROVAL":
        raise CandidateStateError(
            f"승인 불가 — 현재 상태 {entry.get('status')} (QUALIFIED_AWAITING_APPROVAL만 승인 가능)")
    if candidate_fingerprint(entry) != entry.get("fingerprint"):
        raise CandidateImmutabilityError(
            f"승인 거부 — fingerprint 불일치(핵심 설정 변조 의심): {candidate_id}")
    const = constitution_doc or constitution_mod.load()      # checksum 검증 포함
    validate_candidate(entry, const)
    # 실제 '지금' 설정을 코드가 직접 스냅샷 — rollback 목적지의 단일 원천.
    snapshot = pc.current_snapshot(config_path)
    set_previous_stable(snapshot, path=baseline_path)
    # 승인 '시점'의 성적표를 동결해 롤백 감시의 비교 기준으로 삼는다 —
    # 다음 주간 실행까지 기다리면 승격 후 기록이 기준선에 섞인다.
    usable = usable_baselines(path=baseline_path)
    if usable:
        entry["productionBaselineMetrics"] = usable[-1].get("metrics")
    # 원자 적용(+재읽기·fixture 검증). 실패 시 예외 — status는 그대로 QUALIFIED.
    pc.apply_candidate(entry, const, config_path=config_path)
    try:
        entry["status"] = "PRODUCTION"
        entry["statusChangedAt"] = _now()
        entry["promotedAt"] = _now()
        entry["approvedBy"] = str(approver)
        entry.setdefault("statusHistory", []).append(
            {"at": _now(), "from": "QUALIFIED_AWAITING_APPROVAL", "to": "PRODUCTION",
             "reasons": [f"사람 승인: {approver}"]})
        _write(path, doc)
    except Exception:
        # "적용은 됐는데 기록이 안 된" 불일치를 남기지 않는다 — 즉시 원복.
        pc.rollback_to_previous("승인 기록 실패 — 자동 원복", config_path=config_path)
        raise
    return entry


def verify_integrity(path=CANDIDATE_PATH):
    """저장된 모든 후보의 무결성을 재검증한다(몰래 변조 감지).

    · 핵심 설정: fingerprint 재계산 대조
    · status: statusHistory 마지막 항목과 교차검증 — 파일을 손으로 열어
      status만 바꿔치기(REJECTED→QUALIFIED 등)해도 여기서 걸린다.
    반환 (ok, 손상된 candidateId 목록). 자동 런타임은 손상 발견 시 SAFE_MODE.
    """
    doc = load_candidates(path)
    bad = []
    for entry in doc.get("entries", []):
        if candidate_fingerprint(entry) != entry.get("fingerprint"):
            bad.append(entry.get("candidateId"))
            continue
        history = entry.get("statusHistory") or []
        if history and history[-1].get("to") != entry.get("status"):
            bad.append(entry.get("candidateId"))
    return (len(bad) == 0), bad


def experiment_totals(doc=None, path=CANDIDATE_PATH):
    """지금까지의 전체 실험 수 — 탈락 실험도 숫자에서 빠지지 않는다."""
    doc = doc or load_candidates(path)
    by_status = {}
    for entry in doc.get("entries", []):
        by_status[entry.get("status")] = by_status.get(entry.get("status"), 0) + 1
    return {"totalExperiments": int(doc.get("experimentCounter", 0)),
            "recorded": len(doc.get("entries", [])),
            "byStatus": by_status}


def prior_param_history(doc=None, path=CANDIDATE_PATH):
    """paramHash → 과거 이력(REJECTED/ROLLED_BACK 시각) — 재승격 차단·cooldown용."""
    doc = doc or load_candidates(path)
    out = {}
    for entry in doc.get("entries", []):
        ph = entry.get("paramHash")
        if not ph:
            continue
        rec = out.setdefault(ph, {"rolledBackAt": None, "rejectedAt": None})
        if entry.get("status") == "ROLLED_BACK":
            at = entry.get("rolledBackAt") or entry.get("statusChangedAt")
            if at and (rec["rolledBackAt"] is None or at > rec["rolledBackAt"]):
                rec["rolledBackAt"] = at
        if entry.get("status") == "REJECTED":
            at = entry.get("rejectedAt") or entry.get("statusChangedAt")
            if at and (rec["rejectedAt"] is None or at > rec["rejectedAt"]):
                rec["rejectedAt"] = at
    return out
