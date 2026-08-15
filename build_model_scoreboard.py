#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모델 대시보드용 집계 파일 생성 — model_scoreboard.js.

⚠️ 브라우저가 Research Raw Archive를 직접 읽는 구조를 만들지 않는다.
   여기(서버측 Python)에서 암호화된 Raw를 복호해 읽고, **집계 숫자만** 내보낸다.
   개별 500종목 Prediction 원본은 절대 넣지 않는다.

⚠️ 없는 성적을 0%로 표시하지 않는다.
   - 해당 Horizon 예측을 안 하는 모델 → NOT_APPLICABLE
   - 아직 결과가 안 나온 판단 → PENDING_NOT_MATURED
   - 표본이 모자라면 → INSUFFICIENT_EVIDENCE

⚠️ 같은 날 500종목은 서로 독립이 아니다. 행 수와 함께 unique prediction date 수를
   반드시 같이 낸다. 신뢰구간은 날짜 블록 부트스트랩으로만 계산한다.
"""
import json
import os
import random

import model_registry
import research_crypto
import research_store

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_JS = os.path.join(HERE, "model_scoreboard.js")

NOT_APPLICABLE = "NOT_APPLICABLE"
PENDING_NOT_MATURED = "PENDING_NOT_MATURED"
INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

# 이 정도 판단일이 모이기 전에는 성적을 숫자로 말하지 않는다.
MIN_UNIQUE_DATES = 20
BOOTSTRAP_ROUNDS = 400


def _empty_horizon(reason):
    return {"status": reason, "matured": 0, "pending": 0, "uniqueDates": 0}


def _block_bootstrap_ci(by_date, stat_fn, rounds=BOOTSTRAP_ROUNDS, seed=17):
    """판단일 단위로 통째 재추출한다. 같은 날 종목끼리의 상관을 무시하지 않기 위해서다."""
    dates = sorted(by_date)
    if len(dates) < 3:
        return None
    rng = random.Random(seed)
    vals = []
    for _ in range(rounds):
        picked = [by_date[rng.choice(dates)] for _ in dates]
        rows = [r for block in picked for r in block]
        v = stat_fn(rows)
        if v is not None:
            vals.append(v)
    if len(vals) < 20:
        return None
    vals.sort()
    lo = vals[int(len(vals) * 0.025)]
    hi = vals[int(len(vals) * 0.975)]
    return [round(lo, 1), round(hi, 1)]


def _accuracy(rows):
    decided = [r for r in rows if r.get("verdict") in ("hit", "miss")]
    if not decided:
        return None
    return sum(1 for r in decided if r["verdict"] == "hit") / len(decided) * 100


def summarize_horizon(records, horizon):
    """한 모델·한 Horizon의 성적 요약. 성숙 안 된 건 성적으로 세지 않는다."""
    matured, pending = [], 0
    by_date = {}
    actions = {}
    for rec in records:
        h = (rec.get("horizons") or {}).get(str(horizon))
        if not h:
            continue
        act = h.get("action") or h.get("primaryAction")
        actions[act] = actions.get(act, 0) + 1
        if h.get("maturity") != "MATURED":
            pending += 1
            continue
        row = {"date": rec.get("date"), "verdict": h.get("verdict")}
        matured.append(row)
        by_date.setdefault(row["date"], []).append(row)

    unique_dates = len(by_date)
    out = {
        "matured": len(matured), "pending": pending,
        "uniqueDates": unique_dates,
        "actionDistribution": actions,
    }
    if not matured:
        out["status"] = PENDING_NOT_MATURED
        return out
    if unique_dates < MIN_UNIQUE_DATES:
        out["status"] = INSUFFICIENT_EVIDENCE
        out["reason"] = f"판단일이 {unique_dates}일뿐입니다(최소 {MIN_UNIQUE_DATES}일 필요)"
        return out
    out["status"] = "OK"
    out["accuracy"] = round(_accuracy(matured) or 0, 1)
    out["accuracyCI95"] = _block_bootstrap_ci(by_date, _accuracy)
    return out


def load_research_records(store, max_days=120):
    """암호화된 Segment를 복호해 읽는다. Key가 없으면 빈 결과."""
    if research_crypto.key_status() != research_crypto.OK:
        return None
    days = store.list_days()[-max_days:]
    out = []
    for day in days:
        try:
            out.extend(store.read_day(day))
        except Exception:
            continue
    return out


def build(store=None):
    store = store or research_store.ResearchArchiveStore()
    records = load_research_records(store)
    key_ok = records is not None
    records = records or []

    # 모델별 기록 분리 — 내부 블록 이름으로 찾는다.
    buckets = {"research_a": [], "research_b": [], "research_c": []}
    for rec in records:
        base = {"date": rec.get("date"), "code": rec.get("code")}
        if rec.get("research"):
            buckets["research_a"].append(dict(base, **rec["research"]))
        if rec.get("researchV11"):
            buckets["research_b"].append(dict(base, **rec["researchV11"]))
        if rec.get("researchV20"):
            buckets["research_c"].append(dict(base, **rec["researchV20"]))

    models = []
    for meta in model_registry.MODELS:
        row = {k: meta[k] for k in ("id", "displayName", "icon", "status",
                                    "usesDart", "dartUsage", "autoPromotion")}
        row["statusLabel"] = model_registry.status_label(meta["status"])
        row["internalVersion"] = meta.get("internalVersion")
        row["configHash"] = meta.get("configHash")
        row["note"] = meta.get("note")
        row["primarySelection"] = meta.get("primarySelection")
        row["failureReasons"] = meta.get("failureReasons")
        row["producesProbability"] = meta.get("producesProbability", False)

        recs = buckets.get(meta["id"], [])
        row["recordCount"] = len(recs)
        row["uniquePredictionDates"] = len({r.get("date") for r in recs if r.get("date")})
        row["predictionStartedAt"] = (min((r.get("date") for r in recs if r.get("date")),
                                          default=None))
        horizons = {}
        for h in ("5", "20", "60"):
            if h + "D" not in (meta.get("horizons") or []):
                horizons[h] = _empty_horizon(NOT_APPLICABLE)
            elif meta["status"] == model_registry.ARCHIVED_FAILED_EXPERIMENT:
                horizons[h] = _empty_horizon("ARCHIVED_NO_NEW_PREDICTIONS")
            else:
                horizons[h] = summarize_horizon(recs, h)
        row["horizons"] = horizons
        # 확률을 실제로 내는 모델만 확률 지표 자리를 만든다(가짜 Brier 금지).
        row["probabilityMetrics"] = ({"status": PENDING_NOT_MATURED}
                                     if meta.get("producesProbability")
                                     else {"status": NOT_APPLICABLE})
        # 후보별 성적 — B/C는 대표 후보가 없으므로 반드시 펼쳐서 본다.
        cand_ids = sorted({cid for r in recs for cid in (r.get("candidates") or {})})
        row["candidates"] = [{"candidateModelId": cid, "status": PENDING_NOT_MATURED}
                             for cid in cand_ids]
        models.append(row)

    payload = model_registry.registry_payload({
        "generatedAt": research_store.datetime.datetime.now(
            research_store.datetime.timezone.utc).isoformat(),
        "researchKeyAvailable": key_ok,
        "researchRecordDays": len(store.list_days()) if key_ok else 0,
        "models": models,
        "regimeSplit": {"status": PENDING_NOT_MATURED,
                        "note": "상승·횡보·하락장을 따로 보려면 성숙한 기록이 필요합니다."},
        "ranking": {"status": "RANKING_ON_HOLD",
                    "reason": "같은 Horizon·같은 기준으로 비교할 성숙 기록이 아직 없습니다."},
        "independenceNote": ("같은 날 500종목은 서로 독립이 아닙니다. "
                             "행 수와 함께 판단일 수를 같이 봐야 합니다."),
    })
    return payload


def main():
    payload = build()
    body = json.dumps(payload, ensure_ascii=False, indent=1, sort_keys=True)
    js = ("// 자동 생성: build_model_scoreboard.py · 모델 대시보드용 집계\n"
          "// ⚠️ 집계 숫자만 담는다. 개별 종목 Research Prediction 원본은 들어가지 않는다.\n"
          "const MODEL_SCOREBOARD = " + body + ";\n")
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write(js)
    size = os.path.getsize(OUT_JS)
    print(f"model_scoreboard.js 저장 — 모델 {len(payload['models'])}개 · {size:,}B "
          f"· Research Key {'있음' if payload['researchKeyAvailable'] else '없음'}")
    if size > 200_000:
        print(f"[경고] 공개 집계 파일이 {size:,}B로 큽니다. 원본이 섞였는지 확인하세요.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
