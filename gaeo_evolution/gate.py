# -*- coding: utf-8 -*-
"""Promotion Gate · Rollback · Circuit Breaker(SAFE MODE).

설계 원칙:
  · 기존 승격 Source of Truth(model_intelligence.js promotion / model_registry의
    수동승인 정책)를 대체하지 않는다. 이 Gate는 Harness가 만든 Candidate에만
    적용되는 '추가로 더 보수적인' 관문이다.
  · 승격 바닥값은 Constitution promotionFloor — compute_model_intelligence의
    실코드 minimums에서 그대로 가져온 값이며, 여기서 낮출 수 없다.
  · 개선이 애매하면 PROMOTE가 아니라 KEEP_SHADOW다.
  · 적용(applyMode)은 Constitution riskTiers를 따른다. 현행 저장소 정책과
    같게 GREEN도 manual_approval — 자동 런타임은 QUALIFIED_AWAITING_APPROVAL
    까지만 올릴 수 있다.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

VERDICT_BOOTSTRAP = "BOOTSTRAP_SHADOW"
VERDICT_KEEP = "KEEP_SHADOW"
VERDICT_QUALIFIED = "QUALIFIED_AWAITING_APPROVAL"
VERDICT_REJECT = "REJECTED"


def promotion_decision(candidate, prospective, constitution):
    """후보 1개에 대한 객관 판정.

    prospective: 실전 Shadow 실측(없으면 None) —
      {"n","actionN","testDays","testRegimes","buyN","sellN",
       "precisionGainPp","brierGain","coveragePct","directionSharePct"}
    반환: (verdict, reasons)
    """
    floor = constitution["promotionFloor"]
    tier = constitution["riskTiers"].get(candidate.get("riskTier"), {})
    reasons = []
    if not tier or tier.get("applyMode") == "forbidden":
        return VERDICT_REJECT, ["riskTier가 자동 경로에서 허용되지 않음"]
    if prospective is None:
        return VERDICT_BOOTSTRAP, ["실전 Shadow 실측 기록 없음 — 과거데이터만으로 승격 불가(Bootstrap)"]

    def need(key, minimum, label):
        value = prospective.get(key)
        if value is None or value < minimum:
            reasons.append(f"{label}: {value} < {minimum}")

    need("n", floor["prospectiveN"], "실전 표본")
    need("actionN", floor["prospectiveActionN"], "행동(BUY·SELL) 표본")
    need("testDays", floor["testDays"], "검증일")
    need("testRegimes", floor["testRegimes"], "시장국면")
    need("buyN", floor["buyN"], "BUY 표본")
    need("sellN", floor["sellN"], "SELL 표본")
    need("precisionGainPp", floor["precisionGainPp"], "정밀도 개선폭(%p)")
    need("brierGain", floor["brierGain"], "Brier 개선폭")
    need("coveragePct", floor["coveragePct"], "커버리지(%)")
    share = prospective.get("directionSharePct")
    if share is None or share > floor["maxDirectionSharePct"]:
        reasons.append(f"방향 편중: {share} > {floor['maxDirectionSharePct']}")
    ci = prospective.get("precisionGainCi95")
    if floor.get("precisionDeltaCiMustExcludeZero"):
        if not ci or len(ci) != 2 or ci[0] is None or ci[0] <= 0:
            reasons.append(f"개선폭 95% 신뢰구간이 0을 포함/미산출: {ci}")
    # 복잡한 후보는 같은 개선이라도 더 강한 근거를 요구한다(simpler-first).
    comp = candidate.get("complexity") or {}
    complexity_load = sum(int(comp.get(k, 0) or 0) for k in
                          ("parametersAdded", "rulesAdded", "featuresAdded", "branchesAdded"))
    if complexity_load > 0:
        gain = prospective.get("precisionGainPp") or 0
        required = floor["precisionGainPp"] + 0.5 * complexity_load
        if gain < required:
            reasons.append(f"복잡도 보정 미달: 개선 {gain}%p < 요구 {required}%p "
                           f"(복잡도 {complexity_load})")
    if reasons:
        return VERDICT_KEEP, reasons
    return VERDICT_QUALIFIED, ["모든 객관 기준 통과 — 적용은 "
                               f"{tier.get('applyMode')} 정책을 따름"]


def rollback_check(current_metrics, baseline_metrics, constitution,
                   observation_days):
    """승격 이후 실측이 악화됐는지. (권고여부, 사유들).

    적용 방식은 config/version 선택(previousStableVersion)이며 코드 revert가 아니다.
    """
    trigger = constitution["rollbackPolicy"]["trigger"]
    reasons = []
    if observation_days < trigger["minObservationDays"]:
        return False, [f"관측 {observation_days}일 < 최소 {trigger['minObservationDays']}일 — 판단 보류"]
    cur_p = (current_metrics.get("actionable") or {}).get("precisionPct")
    base_p = (baseline_metrics.get("actionable") or {}).get("precisionPct")
    if cur_p is not None and base_p is not None and \
            base_p - cur_p >= trigger["actionPrecisionDropPp"]:
        reasons.append(f"행동 정밀도 하락 {base_p}→{cur_p} (기준 {trigger['actionPrecisionDropPp']}%p)")
    cur_b, base_b = current_metrics.get("brier"), baseline_metrics.get("brier")
    if cur_b is not None and base_b:
        if (cur_b - base_b) / base_b * 100 >= trigger["brierRisePct"]:
            reasons.append(f"Brier 악화 {base_b}→{cur_b} (기준 +{trigger['brierRisePct']}%)")
    cov = current_metrics.get("coveragePct")
    if cov is not None and cov < trigger["coverageCollapseBelowPct"]:
        reasons.append(f"커버리지 붕괴 {cov}% < {trigger['coverageCollapseBelowPct']}%")
    share = current_metrics.get("directionSharePct")
    if share is not None and share > trigger["directionShareAbovePct"]:
        reasons.append(f"방향 붕괴 {share}% > {trigger['directionShareAbovePct']}%")
    return bool(reasons), reasons or ["악화 신호 없음"]


def circuit_breaker(checks):
    """SAFE MODE 판정. checks 예:
      {"constitutionOk": bool, "dataFresh": bool, "archiveOk": bool,
       "testsOk": bool, "protectedPathsClean": bool, ...}
    False가 하나라도 있으면 (True, 사유목록) — 승격·자동커밋 전면 중지.
    """
    reasons = [name for name, ok in sorted(checks.items()) if not ok]
    return (len(reasons) > 0), reasons


def data_freshness(root=ROOT, max_age_days=7):
    """시장데이터가 죽어 있으면 연구도 승격도 보수적으로 멈춘다."""
    import datetime
    import json
    path = os.path.join(root, "analysis_data.json")
    if not os.path.exists(path):
        return False, "analysis_data.json 없음"
    try:
        with open(path, encoding="utf-8") as f:
            head = f.read(4000)
        # 실측 필드명은 fetchedAt이다(2026-08-21 파일 헤더 확인). 앞부분만 읽어
        # 22MB 전체 파싱을 피한다.
        import re
        m = re.search(r'"(?:fetchedAt|generatedAt|priceLabel)"\s*:\s*"(\d{4}-\d{2}-\d{2})', head)
        if not m:
            with open(path, encoding="utf-8") as f:
                doc = json.load(f)
            stamp = str(doc.get("fetchedAt") or doc.get("generatedAt") or
                        doc.get("priceLabel") or "")[:10]
        else:
            stamp = m.group(1)
        if len(stamp) != 10:
            return False, "데이터 시각 필드를 찾지 못함"
        age = (datetime.date.today() - datetime.date.fromisoformat(stamp)).days
        if age > max_age_days:
            return False, f"시장데이터가 {age}일 전 것({stamp})"
        return True, f"데이터 기준일 {stamp}"
    except Exception as exc:
        return False, f"데이터 확인 실패: {type(exc).__name__}"
