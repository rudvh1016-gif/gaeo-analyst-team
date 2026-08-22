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

⭐ 2026-08-22 감사 수리:
  · 전체 점수 하나가 아니라 BUY/SELL/시장국면/큰 오답을 각각 본다 — 전체가
    좋아져도 중요한 subgroup이 의미 있게 나빠지면 승격 불가(fail closed:
    해당 실측이 없어도 승격 불가).
  · complexity는 후보의 자기신고를 믿지 않는다 — registry.computed_complexity
    (실제 parameterChanges 기준)와 대조해 과소신고면 REJECTED.
  · ROLLED_BACK된 설정(paramHash)은 cooldown 기간 재승격이 차단된다.
    ROLLED_BACK/REJECTED 후보 자체는 상태기계(registry)가 종점으로 강제한다.
  · Candidate의 hypothesis/Memory 문자열은 데이터일 뿐이다 — 이 모듈은 그 안의
    문장("무조건 승격" 등)을 읽지도, 실행하지도 않는다.
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

VERDICT_BOOTSTRAP = "BOOTSTRAP_SHADOW"
VERDICT_KEEP = "KEEP_SHADOW"
VERDICT_QUALIFIED = "QUALIFIED_AWAITING_APPROVAL"
VERDICT_REJECT = "REJECTED"


def _days_between(later_iso, earlier_iso):
    import datetime
    try:
        later = datetime.date.fromisoformat(str(later_iso)[:10])
        earlier = datetime.date.fromisoformat(str(earlier_iso)[:10])
        return (later - earlier).days
    except ValueError:
        return None


def repromotion_block(candidate, constitution, param_history, today_iso=None):
    """롤백/탈락된 것과 같은 설정(paramHash)의 재승격을 차단한다.

    · 같은 paramHash가 ROLLED_BACK 이력 → cooldown(sameParamCooldownDays) 동안 차단.
      cooldown이 지나도 '새 후보 + 새 Shadow 축적'이 있어야만 다시 올 수 있다
      (상태기계가 옛 후보 재사용을 이미 막는다).
    반환: (차단여부, 사유)
    """
    import datetime
    ph = candidate.get("paramHash")
    if not ph or not param_history:
        return False, None
    record = param_history.get(ph)
    if not record:
        return False, None
    rolled_at = record.get("rolledBackAt")
    if not rolled_at:
        return False, None
    today_iso = today_iso or datetime.date.today().isoformat()
    cooldown = int((constitution.get("rollbackPolicy") or {}).get("sameParamCooldownDays", 30))
    age = _days_between(today_iso, rolled_at)
    if age is None or age <= cooldown:
        return True, (f"롤백된 설정과 동일(paramHash) — 롤백 후 {age}일 ≤ cooldown {cooldown}일. "
                      "재승격 금지")
    return False, None


def promotion_decision(candidate, prospective, constitution, param_history=None):
    """후보 1개에 대한 객관 판정.

    prospective: 실전 Shadow 실측(shadow.prospective_metrics, 없으면 None) —
      {"n","actionN","testDays","testRegimes","buyN","sellN",
       "precisionGainPp","precisionGainCi95","brierGain","coveragePct",
       "directionSharePct","buyPrecisionDeltaPp","sellPrecisionDeltaPp",
       "largeErrorDeltaPp","regimeWorstDeltaPp"}
    반환: (verdict, reasons)
    """
    floor = constitution["promotionFloor"]
    tier = constitution["riskTiers"].get(candidate.get("riskTier"), {})
    reasons = []
    if not tier or tier.get("applyMode") == "forbidden":
        return VERDICT_REJECT, ["riskTier가 자동 경로에서 허용되지 않음"]

    # complexity 자기신고 검증 — 실제 변경내용 기준(과소신고는 즉시 거부).
    from gaeo_evolution import registry
    verified = registry.computed_complexity(candidate)
    comp = candidate.get("complexity") or {}
    declared_params = int(comp.get("parametersAdded", 0) or 0)
    if declared_params < verified["parametersAdded"]:
        return VERDICT_REJECT, [
            f"complexity 과소신고: 선언 {declared_params} < 실측 {verified['parametersAdded']} "
            f"(새 키 {verified['newParameterKeys']})"]

    # 롤백된 설정의 재승격 차단(cooldown).
    blocked, why = repromotion_block(candidate, constitution, param_history)
    if blocked:
        return VERDICT_REJECT, [why]

    if prospective is None:
        return VERDICT_BOOTSTRAP, ["실전 Shadow 실측 기록 없음 — 과거데이터만으로 승격 불가(Bootstrap)"]

    # 자동 Shadow/승격 경로가 허용되지 않은 tier(ORANGE 등)는 실측이 있어도
    # QUALIFIED에 오를 수 없다 — Constitution riskTiers를 코드로 집행한다.
    if tier.get("autoShadow") is not True or tier.get("applyMode") != "manual_approval":
        return VERDICT_KEEP, [
            f"riskTier {candidate.get('riskTier')}는 자동 승격 경로가 아님 "
            f"(autoShadow={tier.get('autoShadow')}, applyMode={tier.get('applyMode')}) — 수동 검토 전용"]

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
    # CI가 인증하는 통계량(일평균)도 같은 바닥값을 넘어야 한다 — 풀링/일평균이
    # 서로 다른 얘기를 하는 후보(특정 하루가 끌어올린 개선)를 걸러낸다.
    need("precisionGainDayMeanPp", floor["precisionGainPp"], "정밀도 개선폭(일평균 %p)")
    need("brierGain", floor["brierGain"], "Brier 개선폭")
    need("coveragePct", floor["coveragePct"], "커버리지(%)")
    share = prospective.get("directionSharePct")
    if share is None or share > floor["maxDirectionSharePct"]:
        reasons.append(f"방향 편중: {share} > {floor['maxDirectionSharePct']}")
    ci = prospective.get("precisionGainCi95")
    if floor.get("precisionDeltaCiMustExcludeZero"):
        if not ci or len(ci) != 2 or ci[0] is None or ci[0] <= 0:
            reasons.append(f"개선폭 95% 신뢰구간이 0을 포함/미산출: {ci}")

    # ── 하위그룹 보호 — 전체가 좋아도 BUY/SELL/국면/큰 오답이 나빠지면 승격 불가 ──
    def guard_min(key, minimum, label):
        """value ≥ minimum 이어야 한다. 실측이 없으면(None) 승격 불가(fail closed)."""
        value = prospective.get(key)
        if value is None or value < minimum:
            reasons.append(f"{label}: {value} (허용 하한 {minimum})")

    def guard_max(key, maximum, label):
        value = prospective.get(key)
        if value is None or value > maximum:
            reasons.append(f"{label}: {value} (허용 상한 {maximum})")

    if "maxBuyPrecisionDropPp" in floor:
        guard_min("buyPrecisionDeltaPp", -float(floor["maxBuyPrecisionDropPp"]),
                  "BUY 정밀도 변화(%p)")
    if "maxSellPrecisionDropPp" in floor:
        guard_min("sellPrecisionDeltaPp", -float(floor["maxSellPrecisionDropPp"]),
                  "SELL 정밀도 변화(%p)")
    if "maxLargeErrorRisePp" in floor:
        guard_max("largeErrorDeltaPp", float(floor["maxLargeErrorRisePp"]),
                  "큰 오답 비율 변화(%p)")
    if "maxRegimeWorstDropPp" in floor:
        guard_min("regimeWorstDeltaPp", -float(floor["maxRegimeWorstDropPp"]),
                  "시장국면별 최악 악화폭(%p)")

    # 복잡한 후보는 같은 개선이라도 더 강한 근거를 요구한다(simpler-first).
    complexity_load = max(
        sum(int(comp.get(k, 0) or 0) for k in
            ("parametersAdded", "rulesAdded", "featuresAdded", "branchesAdded")),
        verified["parametersAdded"])
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


def build_promotion_card(candidate, prospective, verdict, reasons, constitution=None):
    """대표용 승격 카드 — 전문 판단 없이 '안전시험을 모두 통과했는가'만 보면 되게.

    복잡한 통계 대신 아주 쉬운 문장으로 만든다. 숫자는 실측값만 쓴다.
    """
    p = prospective or {}
    regime_limit = float(((constitution or {}).get("promotionFloor") or {})
                         .get("maxRegimeWorstDropPp", 5.0))

    def _pp(value):
        return f"{value:+.1f}%p" if isinstance(value, (int, float)) else "실측 없음"

    def _pct(value):
        return f"{value:.1f}%" if isinstance(value, (int, float)) else "실측 없음"

    buy_delta = p.get("buyPrecisionDeltaPp")
    sell_delta = p.get("sellPrecisionDeltaPp")
    large_delta = p.get("largeErrorDeltaPp")
    regime_worst = p.get("regimeWorstDeltaPp")
    real_gain = p.get("realGainPp")
    return {
        "후보": candidate.get("candidateId"),
        "실험번호": candidate.get("experimentSerial"),
        "가설": candidate.get("hypothesis"),
        "Shadow기간": (f"{p.get('testDays')}거래일 "
                     f"({p.get('windowStart')}~{p.get('windowEnd')})"
                     if p.get("testDays") else "실측 없음"),
        "실전표본": p.get("n"),
        "기존성능": _pct(p.get("championPrecisionPct")),
        "후보성능": _pct(p.get("challengerPrecisionPct")),
        "개선": _pp(p.get("precisionGainPp")),
        "일평균개선": _pp(p.get("precisionGainDayMeanPp")),
        "실전기록대비": (_pp(real_gain) +
                    (" ⚠️ 실전 기록보다 나쁨 — 승인 전 확인 필요" if isinstance(real_gain, (int, float))
                     and real_gain < 0 else ""))
                    if real_gain is not None else "실측 없음",
        "BUY": ("악화 없음" if isinstance(buy_delta, (int, float)) and buy_delta >= 0
                else f"변화 {_pp(buy_delta)}"),
        "SELL": ("개선" if isinstance(sell_delta, (int, float)) and sell_delta > 0
                 else ("악화 없음" if isinstance(sell_delta, (int, float)) and sell_delta >= 0
                       else f"변화 {_pp(sell_delta)}")),
        "시장국면": ("치명적 악화 없음"
                  if isinstance(regime_worst, (int, float)) and regime_worst > -regime_limit
                  else f"최악 국면 {_pp(regime_worst)}"),
        "큰오답": ("증가 없음" if isinstance(large_delta, (int, float)) and large_delta <= 0
                else f"변화 {_pp(large_delta)}"),
        "미래정보": "사용 안 함(코드로 차단·검증됨)",
        "Rollback준비": "준비됨(승인 시 previousStable·승인 시점 성적표 자동 기록 + 자동 감시)",
        "기계판정": ("승격 추천 — 대표 승인 대기" if verdict == VERDICT_QUALIFIED
                 else f"{verdict}: {'; '.join(reasons[:3])}"),
        "안내": "이 카드의 판정은 자동 계산이며, 실제 Production 반영은 대표 승인 후에만 진행됩니다.",
    }


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


def execute_rollback(candidate_id, reasons, baselines_doc=None,
                     candidates_path=None):
    """롤백 실집행 — 상태를 ROLLED_BACK(종점)으로 바꾸고 복구 지시서를 만든다.

    코드 revert / force push가 아니라 'previousStable 버전 재선택' 방식이다.
    Production 반영 자체가 수동(config)이므로, 여기서는:
      1) 후보를 ROLLED_BACK 종점으로 고정(재승격 불가)
      2) 복구해야 할 previousStable 버전 정보를 상태 파일에 노출
    반환: rollback 이벤트 dict(status 파일용).
    """
    import datetime
    from gaeo_evolution import registry
    kwargs = {"path": candidates_path} if candidates_path else {}
    entry = registry.set_status(candidate_id, "ROLLED_BACK", reasons,
                                extra={"rolledBackAt":
                                       datetime.datetime.now().astimezone()
                                       .isoformat(timespec="seconds")},
                                **kwargs)
    baselines_doc = baselines_doc or registry.load_baselines()
    return {
        "candidateId": candidate_id,
        "rolledBackAt": entry.get("rolledBackAt"),
        "reasons": reasons,
        "restoreTo": baselines_doc.get("previousStable"),
        "method": "previousStable 버전 재선택(코드 revert 아님)",
        "note": "이 후보는 종점(ROLLED_BACK)이며 자동으로 다시 Production에 오를 수 없습니다.",
    }


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
