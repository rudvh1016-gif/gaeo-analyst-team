# -*- coding: utf-8 -*-
"""Production Config Adapter — 승인된 Evolution 후보를 실제 판단 경로에 잇는 유일한 다리.

왜 이 파일인가 (2026-08-22 2차 독립 감사):
  registry.approve_production은 상태·승인정보만 기록했고, candidate의
  parameterChanges(weights/buyCut)가 실제 analyze_auto.py 판단에 적용되는
  연결이 존재하지 않았다. "status만 PRODUCTION이고 실제 분석은 옛 설정"인
  상태를 없애기 위해, 적용/복구를 이 어댑터 하나로만 하게 한다.

설계 원칙:
  · team_weights.js를 덮어쓰지 않는다 — compute_team_weights.py가 다시 생성하는
    파일이다. override는 별도 파일(production_config.json)에 layered로 둔다.
  · override가 없으면(파일 없음/active=null) 기존 GAEO와 100% 동일하게 동작한다.
    이 파일과 gaeo_evolution/을 통째로 지워도 Production은 그대로 돈다.
  · 선언적 파라미터만 읽는다(GREEN 범위: weights·buyCut). 어떤 문자열도
    코드로 실행하지 않는다. hypothesis는 여기 저장조차 되지 않는다.
  · 읽기 실패·검증 실패 시 override를 적용하지 않는다(기존 동작 유지) —
    분석 러너가 이 파일 때문에 죽는 일은 없다. 불일치는 config_health()로
    노출되어 status가 DEGRADED로 표시한다.
  · 쓰기(활성화)는 registry.approve_production(사람 승인 명령)만 한다.
    자동 런타임(evolution-lab)은 '해제/복구' 방향으로만 이 파일을 바꿀 수 있고,
    workflow의 is_auto_change_safe 검사가 그것을 강제한다(활성화 커밋 차단).
  · 모든 쓰기는 tmp+os.replace 원자적이며, 쓴 뒤 다시 읽어 검증한다.
"""
import copy
import datetime
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

CONFIG_PATH = os.path.join(HERE, "production_config.json")
SCHEMA_VERSION = 1
BASE_VERSION = "base"
ANALYSTS = ("taro", "diana", "nova", "flow")
ALLOWED_OVERRIDE_KEYS = frozenset(("weights", "buyCut"))   # GREEN 선언적 파라미터만
HISTORY_CAP = 60

_cache = {"path": None, "mtime": None, "doc": None}
_ov_cache = {"key": None, "value": None}      # 검증 결과 캐시(mtime 기준) — 600종목 배치용
_health = {"ok": True, "note": "override 없음"}


class ProductionConfigError(RuntimeError):
    """적용/복구가 원자적으로 완료되지 못했다 — 기존 Production 설정이 유지된다."""


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _empty_doc():
    return {"schemaVersion": SCHEMA_VERSION,
            "productionConfigVersion": BASE_VERSION,
            "active": None, "previousStable": None, "history": []}


def load(config_path=None):
    """설정 문서를 읽는다(mtime 캐시). 파일 없음/깨짐 → base 문서."""
    path = config_path or CONFIG_PATH
    try:
        mtime = os.stat(path).st_mtime_ns
    except OSError:
        return _empty_doc()
    if _cache["path"] == path and _cache["mtime"] == mtime and _cache["doc"] is not None:
        return _cache["doc"]
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        if not isinstance(doc, dict):
            raise ValueError("문서가 dict가 아님")
    except Exception:
        # 깨진 파일로 판단을 바꾸지 않는다 — base로 동작하되, 손상 사실은
        # 문서에 표식(_corrupt)으로 실어 health가 첫 호출부터 정직하게 보고한다.
        doc = _empty_doc()
        doc["_corrupt"] = True
        return doc
    _cache.update({"path": path, "mtime": mtime, "doc": doc})
    return doc


def clear_cache():
    _cache.update({"path": None, "mtime": None, "doc": None})
    _ov_cache.update({"key": None, "value": None})


def _validate_override(active, constitution=None):
    """active override의 선언적 파라미터를 검증한다. (ok, 사유)"""
    if not isinstance(active, dict):
        return False, "active가 dict가 아님"
    overrides = active.get("overrides")
    if not isinstance(overrides, dict) or not overrides:
        return False, "overrides 없음"
    unknown = sorted(set(overrides) - ALLOWED_OVERRIDE_KEYS)
    if unknown:
        return False, f"허용되지 않은 override 키: {unknown}"
    if constitution is None:
        try:
            from gaeo_evolution import constitution as constitution_mod
            constitution = constitution_mod.load()
        except Exception as exc:
            return False, f"Constitution 검증 불가({type(exc).__name__}) — override 미적용"
    weights = overrides.get("weights")
    if weights is not None:
        if not isinstance(weights, dict):
            return False, "weights 타입 오류"
        b = constitution["weightBounds"]
        total = 0.0
        for analyst in ANALYSTS:
            value = weights.get(analyst)
            if value is None:
                return False, f"weights에 {analyst} 없음"
            try:
                v = float(value)
            except (TypeError, ValueError):
                return False, f"weight 값 타입 오류: {analyst}"
            if v != v:                              # NaN 방어
                return False, f"weight 값이 NaN: {analyst}"
            total += v
            if not (b["perAnalystMin"] <= v <= b["perAnalystMax"]):
                return False, f"weight 범위 위반: {analyst}={v}"
        if abs(total - b["mustSumTo"]) > 1e-6:
            return False, f"weight 합 {total} ≠ {b['mustSumTo']}"
    buy_cut = overrides.get("buyCut")
    if buy_cut is not None:
        try:
            cut = float(buy_cut)
        except (TypeError, ValueError):
            return False, "buyCut 값 타입 오류"
        lo, hi = constitution["thresholdBounds"]["buyCutRange"]
        if not (cut == cut and lo <= cut <= hi):
            return False, f"buyCut 범위 위반: {buy_cut}"
    if not active.get("candidateId") or not active.get("paramHash"):
        return False, "candidateId/paramHash 누락"
    return True, "OK"


def active_overrides(config_path=None, constitution=None):
    """analyze_auto가 읽는 유일한 진입점 — 검증 통과한 override만 돌려준다.

    반환: {} (override 없음/무효 → 기존 GAEO 그대로) 또는
          {"weights":…?, "buyCut":…?, "candidateId", "paramHash",
           "productionConfigVersion"}
    """
    path = config_path or CONFIG_PATH
    try:
        key = (path, os.stat(path).st_mtime_ns)
    except OSError:
        key = (path, None)
    if constitution is None and _ov_cache["key"] == key:
        if _ov_cache.get("health"):
            _health.update(_ov_cache["health"])   # 캐시 적중 시에도 health 정직 유지
        return dict(_ov_cache["value"])
    doc = load(config_path)
    if doc.get("_corrupt"):
        _health.update({"ok": False,
                        "note": "production_config.json 파싱 실패 — base로 동작"})
        _ov_cache.update({"key": key, "value": {}, "health": dict(_health)})
        return {}
    active = doc.get("active")
    if not active:
        _health.update({"ok": True, "note": "override 없음(base)"})
        _ov_cache.update({"key": key, "value": {}, "health": dict(_health)})
        return {}
    ok, why = _validate_override(active, constitution)
    if not ok:
        _health.update({"ok": False,
                        "note": f"active override 검증 실패({why}) — base로 동작"})
        _ov_cache.update({"key": key, "value": {}, "health": dict(_health)})
        return {}
    _health.update({"ok": True,
                    "note": f"override 활성: {active.get('candidateId')}"})
    out = dict(active["overrides"])
    out["candidateId"] = active.get("candidateId")
    out["paramHash"] = active.get("paramHash")
    out["productionConfigVersion"] = doc.get("productionConfigVersion") or \
        f"evo-{active.get('candidateId')}"
    _ov_cache.update({"key": key, "value": dict(out), "health": dict(_health)})
    return out


def config_health(config_path=None):
    """runner/status용 — override 상태와 최근 검증 결과."""
    doc = load(config_path)
    overrides = active_overrides(config_path)          # health 갱신 목적
    return {"ok": _health["ok"], "note": _health["note"],
            "productionConfigVersion": doc.get("productionConfigVersion", BASE_VERSION),
            "activeCandidateId": (doc.get("active") or {}).get("candidateId"),
            "overrideApplied": bool(overrides)}


def _atomic_write(doc, config_path=None):
    path = config_path or CONFIG_PATH
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)
    clear_cache()
    with open(path, encoding="utf-8") as f:      # 쓴 것을 다시 읽어 검증(원자성 확인)
        reread = json.load(f)
    if reread != doc:
        raise ProductionConfigError("적용 후 재검증 실패 — 쓴 내용과 읽은 내용이 다름")
    return path


def current_snapshot(config_path=None):
    """실제 '지금' Production 설정 스냅샷 — rollback 목적지를 코드가 직접 만든다.

    호출자가 임의 값을 넘겨 잘못된 rollback target이 기록되는 것을 막는다.
    """
    doc = load(config_path)
    snap = {"takenAt": _now(),
            "productionConfigVersion": doc.get("productionConfigVersion", BASE_VERSION),
            "active": copy.deepcopy(doc.get("active"))}
    try:
        from compute_model_intelligence import load_js
        tw = load_js(os.path.join(ROOT, "team_weights.js"), "TEAM_WEIGHTS") or {}
        snap["teamWeightVersion"] = (tw.get("global") or {}).get("version") or tw.get("generatedAt")
        snap["teamWeightsGlobal"] = (tw.get("global") or {}).get("weights")
    except Exception:
        snap["teamWeightVersion"] = None
    return snap


def _fixture_check(expected_overrides):
    """실제 분석 경로(analyze_auto)가 적용된 설정을 정말 읽는지 확인한다."""
    import analyze_auto
    clear_cache()                              # 캐시는 mtime 기반 — 재로드 불필요
    tw = analyze_auto.load_team_weights()
    if expected_overrides.get("weights") is not None:
        got = {a: float(tw["global"].get(a)) for a in ANALYSTS}
        want = {a: float(expected_overrides["weights"][a]) for a in ANALYSTS}
        if got != want:
            raise ProductionConfigError(
                f"fixture 검증 실패 — analyze_auto 가중치 미적용: {got} ≠ {want}")
    base_cut = float(getattr(analyze_auto, "BUY_CUT_BASE", 63))   # 하드코딩 중복 금지
    want_cut = expected_overrides.get("buyCut")
    got_cut = analyze_auto._buy_cut()
    if want_cut is not None and float(got_cut) != float(want_cut):
        raise ProductionConfigError(
            f"fixture 검증 실패 — analyze_auto buyCut 미적용: {got_cut} ≠ {want_cut}")
    if want_cut is None and expected_overrides and float(got_cut) != base_cut:
        raise ProductionConfigError(f"fixture 검증 실패 — buyCut 기본값 아님: {got_cut}")
    if not expected_overrides:                 # 복구(해제) 검증: base로 돌아왔는가
        if float(got_cut) != base_cut:
            raise ProductionConfigError(f"복구 검증 실패 — buyCut {got_cut} ≠ {base_cut}")
    return True


def apply_candidate(candidate, constitution, config_path=None, verify_fixture=None):
    """승인된 후보의 선언적 파라미터를 원자적으로 적용한다.

    실패하면 예외 — 파일은 이전 상태 그대로(부분 적용 없음). 호출자는
    후보 status를 PRODUCTION으로 바꾸면 안 된다.
    """
    from gaeo_evolution import registry
    changes = candidate.get("parameterChanges") or {}
    overrides = {k: copy.deepcopy(v) for k, v in changes.items()
                 if k in ALLOWED_OVERRIDE_KEYS and v is not None}
    if not overrides:
        raise ProductionConfigError(
            f"적용할 GREEN 선언적 파라미터가 없음: {sorted(changes)}")
    doc = copy.deepcopy(load(config_path))
    new_active = {
        "candidateId": candidate.get("candidateId"),
        "experimentSerial": candidate.get("experimentSerial"),
        "paramHash": candidate.get("paramHash") or registry.param_hash(candidate),
        "fingerprint": candidate.get("fingerprint"),
        "overrides": overrides,
        "appliedAt": _now(),
    }
    ok, why = _validate_override(new_active, constitution)
    if not ok:
        raise ProductionConfigError(f"override 검증 실패: {why}")
    doc["previousStable"] = {
        "productionConfigVersion": doc.get("productionConfigVersion", BASE_VERSION),
        "active": copy.deepcopy(doc.get("active")),
        "savedAt": _now(),
    }
    doc["active"] = new_active
    doc["productionConfigVersion"] = f"evo-{candidate.get('candidateId')}"
    doc.setdefault("history", []).append(
        {"at": _now(), "event": "apply", "candidateId": candidate.get("candidateId"),
         "paramHash": new_active["paramHash"]})
    doc["history"] = doc["history"][-HISTORY_CAP:]
    _atomic_write(doc, config_path)
    if verify_fixture is None:
        verify_fixture = config_path is None   # 실제 경로일 때만 analyze_auto 대조
    if verify_fixture:
        expected = dict(overrides)
        try:
            _fixture_check(expected)
        except ProductionConfigError:
            # 적용이 실제 경로에 반영되지 않았다 — 즉시 원상복구 후 실패 보고.
            restore = copy.deepcopy(doc)
            restore["active"] = doc["previousStable"]["active"]
            restore["productionConfigVersion"] = doc["previousStable"]["productionConfigVersion"]
            restore["history"].append({"at": _now(), "event": "apply_failed_restored",
                                       "candidateId": candidate.get("candidateId")})
            _atomic_write(restore, config_path)
            raise
    return doc


def rollback_to_previous(reason, config_path=None, verify_fixture=None):
    """previousStable 설정을 원자적으로 복원한다(코드 revert 아님, 포인터 복원).

    반환: (복원된 active(또는 None), 문서). 실패 시 예외 — 호출자는 SAFE_MODE 처리.
    """
    doc = copy.deepcopy(load(config_path))
    rolled_from = doc.get("active")
    prev = doc.get("previousStable") or {}
    doc["active"] = copy.deepcopy(prev.get("active"))
    doc["productionConfigVersion"] = prev.get("productionConfigVersion", BASE_VERSION)
    doc.setdefault("history", []).append(
        {"at": _now(), "event": "rollback", "reason": str(reason)[:200],
         "rolledBackCandidateId": (rolled_from or {}).get("candidateId"),
         "restoredVersion": doc["productionConfigVersion"]})
    doc["history"] = doc["history"][-HISTORY_CAP:]
    _atomic_write(doc, config_path)
    if verify_fixture is None:
        verify_fixture = config_path is None
    if verify_fixture:
        restored = doc.get("active")
        expected = dict((restored or {}).get("overrides") or {})
        _fixture_check(expected)
    return doc.get("active"), doc


def is_auto_change_safe(old_doc, new_doc):
    """자동 런타임(evolution-lab)이 커밋해도 되는 변경인가 — '해제/복구' 방향만 허용.

    허용: (1) active 변경 없음, (2) 해제(active=null),
          (3) old.previousStable.active로의 정확한 복원.
    금지: 새 override 활성화·기존 active 내용 변경(자동 승격 경로가 되기 때문).

    ⭐ 2차 감사(H-1) 수리: previousStable 자체를 자동 커밋으로 만들거나 바꾸는 것도
    금지한다 — "1주차에 previousStable을 오염시키고 2주차에 '복원'으로 위장해
    활성화"하는 2-커밋 우회를 차단한다. previousStable에 내용을 쓰는 것은
    apply_candidate(사람 승인 경로)뿐이어야 한다.
    """
    old_doc = old_doc or _empty_doc()
    new_doc = new_doc or _empty_doc()
    old_prev = old_doc.get("previousStable")
    new_prev = new_doc.get("previousStable")
    if new_prev is not None and new_prev != old_prev:
        return False, ("자동 런타임은 previousStable을 만들거나 바꿀 수 없음 — "
                       "2단계(오염→복원 위장) 활성화 우회 차단")
    new_active = new_doc.get("active")
    if new_active is None:
        return True, "해제(active=null) — 허용"
    if new_active == (old_doc.get("active")):
        return True, "active 변경 없음 — 허용"
    if old_prev is not None and new_active == old_prev.get("active"):
        return True, "previousStable 복원 — 허용"
    return False, ("자동 런타임은 override를 활성화/변경할 수 없음 — "
                   "활성화는 사람 승인(approve_production) 전용")
