# -*- coding: utf-8 -*-
"""통합 평가 — 기존 채점 의미를 '재사용'하고 새 의미를 만들지 않는다.

재사용(복제 금지):
  · call_hit / stance_hit / build_market_regimes  ← compute_model_intelligence.py
  · 날짜 단위 block bootstrap                      ← build_model_scoreboard.py
  · 업종 매핑                                      ← compute_model_intelligence.load_sectors
  · FORWARD RECORD ONLY / 모델버전 분리            ← build_model_scoreboard.load_base_rows,
                                                     compute_team_weights.record_base_version
  · 실제 Production 가중치                          ← analyze_auto.load_team_weights

통계 원칙(Constitution statisticalPolicy):
  같은 날 600종목은 독립이 아니다. raw N과 함께 unique decision days ·
  시장국면 수를 항상 기록하고, 불확실성은 날짜 단위 block bootstrap으로 잰다.

⭐ 2026-08-22 감사 수리:
  1) FORWARD RECORD ONLY — build_rows가 recon/backfill(사후 재구성)·비auto·
     판단보류 행을 물리적으로 제외하고, 모델 버전(baseModelVersion)을 행마다
     태그해 서로 다른 버전 기록을 무심코 한 성적으로 섞지 않는다.
     기본은 현재 Production 버전만 사용한다.
  2) Offline 공정 비교 — compare_fair가 '시뮬레이션 Baseline vs 시뮬레이션
     Candidate'를 같은 행·같은 함수·같은 risk 처리·같은 sellThreshold로 비교한다.
     (v1은 실전기록 vs 시뮬레이션을 비교해 무변경 후보가 +2.3%p로 보이는
      비교 오류가 있었다 — offline_approximation_v1 은 폐기.)
  3) 실제 Production 가중치 — load_production_weights가 analyze_auto.
     load_team_weights(= team_weights.js global)를 그대로 재사용한다.
     낡은 BASE_W 상수를 현재값인 척 쓰지 않는다.

Offline 결과의 역할 제한:
  "이 Candidate를 실전 Shadow까지 가져갈 가치가 있는가"를 거르는 1차 시험일 뿐이다.
  Offline 결과만으로 Production 승격은 절대 불가 — 승격 근거는 실전 Shadow 기록만
  인정한다(gate.promotion_decision).
"""
import datetime
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from compute_model_intelligence import (            # noqa: E402 — 의미 재사용
    build_market_regimes, call_hit, load_js, load_sectors)
from build_model_scoreboard import _block_bootstrap_ci  # noqa: E402 — 날짜 블록 부트스트랩 재사용
from compute_team_weights import BASE_MODEL_VERSION, PRE_HOTFIX_BASE  # noqa: E402 — 버전 의미 재사용

from gaeo_evolution import leakage                  # noqa: E402

RECORD_SELECTION = "forward_record_only_v2"         # recon/backfill 제외 + 버전 분리
OFFLINE_SEMANTICS = "offline_sim_vs_sim_v2"         # v1(실기록 vs 시뮬 비교)은 폐기
EVALUATION_VERSION = "evolution_eval_v2_2026-08-22"
ALL_LIVE_VERSIONS = "ALL_LIVE"                      # 명시적으로 요청할 때만 버전 혼합(태그 필수)
BOOTSTRAP_SEED = 17            # build_model_scoreboard._block_bootstrap_ci 기본 seed 재사용
BOOTSTRAP_ROUNDS = 400
ANALYSTS = ("taro", "diana", "nova", "flow")
BUY_CUT_BASELINE = 63          # analyze_auto.chief_eval 실측 경계
SELL_CUT_FALLBACK = 47         # reboundCheck.sellThreshold의 관측 기본값
LARGE_ERROR_PCT = 10.0         # 행동 판단이 10%p 넘게 반대로 간 경우


class ProductionWeightsError(RuntimeError):
    """실제 Production 가중치를 읽지 못했다 — 낡은 기본값으로 대신하지 않는다(FAIL CLOSED)."""


def load_market_data(root=ROOT):
    history = load_js(os.path.join(root, "history.js"), "LIVE_HISTORY") or {}
    with open(os.path.join(root, "analysis_data.json"), encoding="utf-8") as f:
        raw = json.load(f)
    closes = {}
    for code, stock in (raw.get("stocks") or {}).items():
        rows = sorted((r for r in (stock.get("daily") or []) if r.get("date") and r.get("close")),
                      key=lambda r: r["date"])
        closes[code] = rows
    return history, closes


def load_production_weights(root=ROOT):
    """실제 Production CHIEF 가중치 — analyze_auto.load_team_weights 재사용.

    · team_weights.js global이 있으면 그 값(learned=True) — 이것이 현재 실전값이다.
    · 파일이 없으면 실전도 BASE_W로 동작하므로 같은 값을 쓰되 learned=False로 표시.
    · analyze_auto 자체를 읽지 못하면 예외 — 임의 기본값으로 평가를 계속하지 않는다.
    """
    try:
        import analyze_auto
        tw = analyze_auto.load_team_weights()
    except Exception as exc:
        raise ProductionWeightsError(f"analyze_auto.load_team_weights 실패: {exc}") from exc
    raw = tw.get("global") or {}
    weights = {}
    for analyst in ANALYSTS:
        value = raw.get(analyst)
        if value is None:
            raise ProductionWeightsError(f"Production 가중치 누락: {analyst}")
        weights[analyst] = float(value)
    return {
        "weights": weights,
        "learned": bool(tw.get("learned")),
        "sectorOverrides": len(tw.get("sectors") or {}),
        "source": ("team_weights.js(global)" if tw.get("learned")
                   else "analyze_auto.BASE_W(팀가중치 파일 없음 — 실전과 동일한 fallback)"),
    }


def build_rows(history, closes, horizon=5, model_versions=None):
    """평가 행 생성 — FORWARD RECORD ONLY.

    기존 공식 Scoreboard(build_model_scoreboard.load_base_rows)와 같은 원칙을 재사용한다:
      · tier != 'auto' 제외(정밀분석 기록은 기본모델 성적이 아니다)
      · recon:true(backfill_history.py의 사후 재구성 표식) 제외 — 실전 당시 기록만
      · judgmentWithheld 제외(채점 분모가 아니다)
      · 모델 버전 분리 — baseModelVersion 없으면 PRE_HOTFIX_BASE(compute_team_weights.
        record_base_version과 동일 의미). 기본은 현재 BASE_MODEL_VERSION만 사용,
        ALL_LIVE_VERSIONS를 명시하면 전 버전 포함하되 행마다 modelVersion 태그.

    결과값에는 반드시 outcomeDate를 함께 기록한다(누출 검증용).
    반환: (usable_rows, selection_meta)
    """
    if model_versions is None:
        allowed = {BASE_MODEL_VERSION}
    elif model_versions == ALL_LIVE_VERSIONS:
        allowed = None
    else:
        allowed = set(model_versions)
    rows = []
    excluded = {}

    def drop(reason):
        excluded[reason] = excluded.get(reason, 0) + 1

    for code, entries in history.items():
        if not isinstance(entries, list):
            continue
        series = closes.get(code) or []
        for entry in entries:
            if not isinstance(entry, dict):
                drop("not_a_dict")
                continue
            if entry.get("tier") != "auto":
                drop("non_auto_tier")
                continue
            if entry.get("recon"):
                drop("recon_backfill_post_hoc")      # ⛔ 사후 재구성 — 실전 성적 금지
                continue
            if entry.get("judgmentWithheld") or entry.get("call") == "JUDGMENT_WITHHELD":
                drop("judgment_withheld")
                continue
            day = str(entry.get("date", ""))[:10]
            base = entry.get("base")
            if not day or not base:
                drop("day_or_base_missing")
                continue
            version = entry.get("baseModelVersion") or PRE_HOTFIX_BASE
            if allowed is not None and version not in allowed:
                drop("model_version_out_of_scope")
                continue
            after = [r for r in series if r["date"] > day]
            ret = out_date = None
            if len(after) >= horizon:
                ret = (after[horizon - 1]["close"] / base - 1) * 100
                out_date = after[horizon - 1]["date"]
            rebound = entry.get("reboundCheck") or {}
            row = {"code": code, "day": day, "call": entry.get("call"),
                   "total": entry.get("total"), "confidence": entry.get("confidence"),
                   "base": base, "baseAt": entry.get("baseAt"),
                   "rawTotal": entry.get("rawTotal"), "riskPenalty": entry.get("riskPenalty"),
                   "sellThreshold": rebound.get("sellThreshold"),
                   "modelVersion": version,
                   # 판단이 '어느 Production 구성'에서 나왔는지 — override가 활성일 때만
                   # history에 각인되므로, 없으면 base다(Shadow 세그먼트 분리용).
                   "pcv": entry.get("productionConfigVersion") or "base",
                   "ret5": ret, "outcomeDate": out_date}
            for analyst in ANALYSTS:
                item = entry.get(analyst) or {}
                row[analyst] = {"score": item.get("score"), "stance": item.get("stance")}
            rows.append(row)
    rows.sort(key=lambda r: (r["day"], r["code"]))
    usable, excluded_n, excluded_why = leakage.cutoff_report(rows)
    leakage.assert_outcomes_after_decision(usable)
    selection = {
        "recordSelection": RECORD_SELECTION,
        "modelVersions": sorted({r["modelVersion"] for r in usable}),
        "excludedByAuthenticity": excluded,
        "excludedN": excluded_n, "excludedWhy": excluded_why,
    }
    return usable, selection


def split_research_eval(rows, min_research_days=10, min_eval_days=20):
    """시간순 연구/평가 분리 — Failure Mining 데이터를 후보 평가에 재사용하지 않는다.

    최신 min_eval_days 거래일 = 평가구간, 그 이전 = 연구구간(Failure Mining 전용).
    데이터가 부족하면 (None, None, note) — 억지로 작은 구간을 쪼개
    가짜 통계 신뢰도를 만들지 않는다.
    """
    days = sorted({r["day"] for r in rows})
    required = min_research_days + min_eval_days
    if len(days) < required:
        return None, None, {
            "sufficient": False, "uniqueDays": len(days), "requiredDays": required,
            "verdict": "Offline 연구용 데이터 부족 — Shadow 축적 필요",
        }
    eval_days = set(days[-min_eval_days:])
    research_rows = [r for r in rows if r["day"] not in eval_days]
    eval_rows = [r for r in rows if r["day"] in eval_days]
    return research_rows, eval_rows, {
        "sufficient": True,
        "researchWindow": [days[0], days[-min_eval_days - 1]],
        "evalWindow": [days[-min_eval_days], days[-1]],
        "researchDays": len(days) - min_eval_days, "evalDays": min_eval_days,
    }


def evaluation_meta(rows, extra=None):
    """재현성 메타 — 몇 달 뒤에도 '왜 이런 판정이 나왔나'를 추적할 수 있게 남긴다."""
    days = sorted({r["day"] for r in rows})
    blob = json.dumps(
        [[r.get("code"), r.get("day"), r.get("call"), r.get("total"),
          r.get("ret5"), r.get("outcomeDate"), r.get("modelVersion")] for r in rows],
        ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    meta = {
        "evaluationVersion": EVALUATION_VERSION,
        "recordSelection": RECORD_SELECTION,
        "offlineSemantics": OFFLINE_SEMANTICS,
        "dataWindow": {"start": days[0] if days else None, "end": days[-1] if days else None},
        "n": len(rows), "uniqueDays": len(days),
        "dataFingerprint": hashlib.sha256(blob.encode("utf-8")).hexdigest(),
        "bootstrap": {"unit": "decision_date", "rounds": BOOTSTRAP_ROUNDS,
                      "seed": BOOTSTRAP_SEED,
                      "note": "build_model_scoreboard._block_bootstrap_ci 재사용"},
        "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    if extra:
        meta.update(extra)
    return meta


def _by_date(rows):
    grouped = {}
    for row in rows:
        grouped.setdefault(row["day"], []).append(row)
    return grouped


def _action_precision_stat(day_rows):
    hit = n = 0
    for row in day_rows:
        if row.get("ret5") is None or row.get("call") not in ("BUY", "SELL"):
            continue
        verdict = call_hit(row["call"], row["ret5"])
        if verdict is None:
            continue
        n += 1
        hit += verdict
    return (hit / n * 100) if n else None


def report(rows, root=ROOT, closes=None):
    """현재 판단 기록의 성적표. '전체 적중률 하나'가 아니라 다면 지표를 낸다."""
    matured = [r for r in rows if r.get("ret5") is not None]
    regimes = build_market_regimes(closes) if closes else {}
    sectors = load_sectors()
    days = sorted({r["day"] for r in matured})
    calls = {"BUY": [0, 0], "HOLD": [0, 0], "SELL": [0, 0]}   # [hit, n]
    direction = {"BUY": 0, "SELL": 0}
    brier_sum = brier_n = 0
    large_errors = 0
    action_hit = action_n = 0
    sector_err = {}
    regime_keys = set()
    for row in matured:
        call = row.get("call")
        verdict = call_hit(call, row["ret5"])
        if call in calls and verdict is not None:
            calls[call][1] += 1
            calls[call][0] += verdict
        if call in direction:
            direction[call] += 1
            if verdict is not None:
                action_n += 1
                action_hit += verdict
                if verdict == 0 and abs(row["ret5"]) >= LARGE_ERROR_PCT:
                    large_errors += 1
                if verdict == 0:
                    sec = sectors.get(row["code"], "기타")
                    sector_err[sec] = sector_err.get(sec, 0) + 1
        total = row.get("total")
        if total is not None:
            p = max(0.0, min(1.0, float(total) / 100))
            target = 1 if row["ret5"] > 0 else 0
            brier_sum += (p - target) ** 2
            brier_n += 1
        regime = (regimes.get(row["day"]) or {}).get("key")
        if regime:
            regime_keys.add(regime)

    def pct(pair):
        return round(pair[0] / pair[1] * 100, 1) if pair[1] else None

    action_total = direction["BUY"] + direction["SELL"]
    by_date = {d: [r for r in matured if r["day"] == d] for d in days}
    ci = _block_bootstrap_ci(by_date, _action_precision_stat) if len(days) >= 5 else None
    versions = sorted({r.get("modelVersion") for r in matured if r.get("modelVersion")})
    return {
        "semantics": "production_call_hit(deadband=1)",
        "recordSelection": RECORD_SELECTION,
        "modelVersions": versions,
        "n": len(matured), "uniqueDays": len(days), "regimeCount": len(regime_keys),
        "buy": {"n": calls["BUY"][1], "precisionPct": pct(calls["BUY"])},
        "sell": {"n": calls["SELL"][1], "precisionPct": pct(calls["SELL"])},
        "hold": {"n": calls["HOLD"][1], "hitPct": pct(calls["HOLD"])},
        "actionable": {"n": action_n,
                       "precisionPct": round(action_hit / action_n * 100, 1) if action_n else None,
                       "precisionCi95": ci},
        "coveragePct": round(action_total / len(matured) * 100, 1) if matured else None,
        "directionSharePct": (round(max(direction.values()) / action_total * 100, 1)
                              if action_total else None),
        "brier": round(brier_sum / brier_n, 4) if brier_n else None,
        "largeErrorPct": round(large_errors / action_n * 100, 1) if action_n else None,
        "topErrorSectors": sorted(sector_err.items(), key=lambda kv: -kv[1])[:5],
    }


def simulate_candidate(rows, weights=None, buy_cut=BUY_CUT_BASELINE):
    """가중치/경계 조합을 판단시점 정보만으로 다시 판정한 행을 만든다.

    ⚠️ leakage.decision_view로 결과 필드를 물리적으로 떼고 계산한다.
    ⚠️ 실전이 그날 적용한 위험감점(rawTotal-total)과 sellThreshold를 그대로
       쓴다(재추정 금지) — Baseline 시뮬과 Candidate 시뮬이 같은 값을 공유한다.
    """
    out = []
    for row in rows:
        d = leakage.decision_view(row)
        scores = {}
        for analyst in ANALYSTS:
            score = (d.get(analyst) or {}).get("score")
            if score is None:
                break
            scores[analyst] = float(score)
        else:
            w = weights or {a: 0.25 for a in ANALYSTS}
            tot_w = sum(w.values())
            raw = sum(scores[a] * w[a] for a in ANALYSTS) / tot_w
            # ⭐ 2차 감사(M-2) 수리: chief_eval의 clamp(정수 반올림, 5~95)를 그대로
            #    재현한다 — 시험한 함수와 배포되는 함수의 경계 처리가 같아야
            #    "시험한 그대로 반영"이 성립한다(양쪽 시뮬에 동일 적용 = 대칭 유지).
            raw = int(max(5, min(95, round(raw))))
            # 그날 실전이 적용한 위험감점을 그대로 쓴다(재추정 금지).
            penalty = 0.0
            if d.get("rawTotal") is not None and d.get("total") is not None:
                penalty = float(d["rawTotal"]) - float(d["total"])
            total = int(max(5, min(95, round(raw - penalty))))
            sell_cut = d.get("sellThreshold")
            sell_cut = float(sell_cut) if sell_cut is not None else SELL_CUT_FALLBACK
            call = "BUY" if total >= buy_cut else ("HOLD" if total >= sell_cut else "SELL")
            sim = dict(row)
            sim["call"] = call
            sim["total"] = total
            sim["simulatedBy"] = OFFLINE_SEMANTICS
            out.append(sim)
    return out


def compare(baseline_rows, candidate_rows):
    """같은 데이터·같은 의미로 기준 vs 후보를 비교하고 날짜 블록 CI를 계산한다."""
    base = report(baseline_rows)
    cand = report(candidate_rows)
    base_by_day = _by_date([r for r in baseline_rows if r.get("ret5") is not None])
    cand_by_day = _by_date([r for r in candidate_rows if r.get("ret5") is not None])
    shared_days = sorted(set(base_by_day) & set(cand_by_day))

    def _delta_over_days(day_list):
        # _block_bootstrap_ci가 블록을 평탄화해 넘기므로, 블록 항목을 '날짜'로 두면
        # 재추출된 날짜 목록(중복 포함)이 그대로 들어온다.
        deltas = []
        for day in day_list:
            b = _action_precision_stat(base_by_day[day])
            c = _action_precision_stat(cand_by_day[day])
            if b is not None and c is not None:
                deltas.append(c - b)
        return sum(deltas) / len(deltas) if deltas else None

    ci = (_block_bootstrap_ci({d: [d] for d in shared_days}, _delta_over_days)
          if len(shared_days) >= 5 else None)
    day_mean = _delta_over_days(shared_days)   # CI와 같은 정의(일평균) — 함께 보고
    return {"baseline": base, "candidate": cand,
            "sharedDays": len(shared_days),
            "actionPrecisionDeltaDayMeanPp": (round(day_mean, 2)
                                              if day_mean is not None else None),
            "actionPrecisionDeltaPp": (round(cand["actionable"]["precisionPct"] -
                                             base["actionable"]["precisionPct"], 2)
                                       if (cand["actionable"]["precisionPct"] is not None and
                                           base["actionable"]["precisionPct"] is not None) else None),
            "actionPrecisionDeltaCi95": ci,
            "semantics": OFFLINE_SEMANTICS}


def compare_fair(rows, production, changes, buy_cut_baseline=BUY_CUT_BASELINE):
    """Offline 공정 비교 — 시뮬레이션 Baseline vs 시뮬레이션 Candidate.

    두 쪽 모두: 같은 날짜·같은 종목·같은 행·같은 평가 함수(simulate_candidate)·
    같은 risk 처리(그날 실전 감점 재사용)·같은 sellThreshold·같은 채점 의미를 쓴다.
    Baseline 가중치는 실제 Production 가중치(load_production_weights)다.

    무변경 후보(가중치·경계가 Production과 동일)는 개선폭이 정확히 0이어야 한다 —
    계약 테스트(NoChangeCandidateTest)가 이 성질을 영구 회귀검증한다.

    Offline 결과는 Shadow行 선별용 1차 시험일 뿐, 승격 근거가 될 수 없다.
    """
    prod_w = production["weights"]
    changes = changes or {}
    cand_buy_cut = changes.get("buyCut")            # falsy-0 함정 방지: None만 기본값 대체
    base_sim = simulate_candidate(rows, weights=prod_w, buy_cut=buy_cut_baseline)
    cand_sim = simulate_candidate(rows,
                                  weights=changes.get("weights") or prod_w,
                                  buy_cut=(cand_buy_cut if cand_buy_cut is not None
                                           else buy_cut_baseline))
    result = compare(base_sim, cand_sim)
    result["fairness"] = {
        "baselineIsSimulated": True, "candidateIsSimulated": True,
        "sameRowCount": len(base_sim) == len(cand_sim),
        "productionWeightsSource": production.get("source"),
        "sectorOverridesIgnoredOnBothSides": True,
        "note": "실기록 vs 시뮬 비교(v1)는 무변경 후보도 개선처럼 보여 폐기됐다",
    }
    return result
