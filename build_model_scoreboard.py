#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""모델 대시보드용 집계 파일 생성 — model_scoreboard.js.

RECORD → MATURE → GRADE → COMPARE → DISPLAY (2026-08-16 Priority 2)

⚠️ FORWARD RECORD ONLY — 성적은 '그 당시 실제 저장된 판단'만 채점한다.
   기본모델: history.js (archive_analysis.py가 append-only로 쌓는 실제 기록)
   연구 A/B/C: Research Archive의 live_shadow_oos 기록
   미래 결과를 알고 나서 과거 판단을 다시 계산해 성적을 만들지 않는다.

⚠️ 채점 공식은 새로 만들지 않는다 — compute_team_weights.score_call
   (= index.html scoreCall, 2026-08-15 통일 정의)을 그대로 쓴다.
   결과가격은 '판단일 다음 N번째 거래일 종가'(주말·공휴일 미포함).
   시장 대비 = 같은 날 분석 종목 전체의 N거래일 수익률 중앙값을 뺀 값
   (index.html scMarketMedian과 같은 정의).

⚠️ 브라우저가 Research Raw Archive를 직접 읽는 구조를 만들지 않는다.
   여기(러너측 Python)에서 암호화된 Raw를 복호해 읽고, **집계 숫자만** 내보낸다.

⚠️ 없는 성적을 0%로 표시하지 않는다.
   NOT_APPLICABLE / PENDING_NOT_MATURED / INSUFFICIENT_EVIDENCE 구분.

⚠️ 같은 날 여러 종목은 서로 독립이 아니다. 행 수와 함께 unique prediction date
   수를 반드시 같이 내고, 신뢰구간은 날짜 블록 부트스트랩으로만 계산한다.

⚠️ FAIL CLOSED — 연구 A/B 동결 hash가 Registry 기대값과 다르면 집계를 만들지
   않고 중단한다(모델이 바뀐 채 성적이 이어지는 것을 막는다).

⚠️ 자동승격 없음 — 이 파일은 성적을 '보여주기만' 한다. 어떤 결과도 Production
   판단을 바꾸지 않는다.
"""
import json
import os
import random
import re

import coverage_version
import model_registry
import research_crypto
import research_store
from compute_team_weights import score_call, BASE_MODEL_VERSION, PRE_HOTFIX_BASE

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_JS = os.path.join(HERE, "model_scoreboard.js")

NOT_APPLICABLE = "NOT_APPLICABLE"
PENDING_NOT_MATURED = "PENDING_NOT_MATURED"
INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"

# 이 정도 판단일이 모이기 전에는 성적을 숫자로 말하지 않는다.
MIN_UNIQUE_DATES = 20
BOOTSTRAP_ROUNDS = 400
GRADING_POLICY_VERSION = "grading_v1_2026-08-16"


# ── 가격 색인 — 채점의 단일 원천 ─────────────────────────────────────────────
def load_js_object(path, varname):
    try:
        text = open(path, encoding="utf-8").read()
    except OSError:
        return None
    m = re.search(rf"{varname}\s*=\s*(\{{.*\}})\s*;?\s*$", text, re.S)
    return json.loads(m.group(1)) if m else None


class PriceIndex:
    """price_history.js 기반 미래종가·시장중앙값 조회.

    index.html evalClose/scMarketMedian과 같은 정의를 쓴다:
      - N거래일 결과 = 판단일 '다음' N번째 거래일 종가 (달력일 아님)
      - 시장중앙값(day, N) = 그날 종가가 있는 전 종목의 N거래일 수익률 중앙값
    """

    def __init__(self, price_history=None):
        ph = price_history if price_history is not None else (
            load_js_object(os.path.join(HERE, "price_history.js"), "PRICE_HISTORY") or {})
        self.rows = {}
        for code, pages in ph.items():
            days = [d for p in (pages or []) for d in (p.get("days") or [])
                    if d.get("date") and isinstance(d.get("close"), (int, float))]
            days.sort(key=lambda d: d["date"])
            if days:
                self.rows[code] = days
        self._median_cache = {}

    def future_close(self, code, day, n):
        """판단일(day) 다음 n번째 거래일 종가. 아직 없으면 None(PENDING)."""
        rows = self.rows.get(code)
        if not rows:
            return None
        after = [r for r in rows if r["date"] > day]
        return after[n - 1]["close"] if len(after) >= n else None

    def market_median(self, day, n):
        """같은 날 분석 종목 전체의 n거래일 수익률 중앙값(시장 대비 기준선)."""
        key = (day, n)
        if key in self._median_cache:
            return self._median_cache[key]
        vals = []
        for rows in self.rows.values():
            for i, r in enumerate(rows):
                if r["date"] != day:
                    continue
                if i + n < len(rows) and r["close"]:
                    vals.append((rows[i + n]["close"] / r["close"] - 1) * 100.0)
                break
        vals.sort()
        med = vals[len(vals) // 2] if vals else None
        self._median_cache[key] = med
        return med


def grade(prices, code, day, base, call, horizon_days):
    """저장된 판단 하나를 채점한다. 결과가 아직 없으면 None(PENDING)."""
    if not base or call in (None, ""):
        return None
    fut = prices.future_close(code, day, horizon_days)
    if fut is None:
        return None
    ret = (fut - base) / base * 100.0
    med = prices.market_median(day, horizon_days)
    return {"date": day, "code": code, "call": call,
            "verdict": score_call(call, ret), "ret": ret,
            "mrel": (ret - med) if med is not None else None}


# ── 통계 요약 (모든 모델 공용 — 같은 잣대) ──────────────────────────────────
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
    return [round(vals[int(len(vals) * 0.025)], 1), round(vals[int(len(vals) * 0.975)], 1)]


def _hit_rate(rows):
    """기존 '적중' 정의 그대로: hit / (hit+miss). mid(±1% 박스)는 분모에서 제외."""
    decided = [r for r in rows if r["verdict"] in ("hit", "miss")]
    if not decided:
        return None
    return sum(1 for r in decided if r["verdict"] == "hit") / len(decided) * 100


def _mean(vals):
    vals = [v for v in vals if v is not None]
    return round(sum(vals) / len(vals), 2) if vals else None


def _median(vals):
    vals = sorted(v for v in vals if v is not None)
    if not vals:
        return None
    n = len(vals)
    return round(vals[n // 2] if n % 2 else (vals[n // 2 - 1] + vals[n // 2]) / 2, 2)


def _call_block(rows, call):
    sub = [r for r in rows if r["call"] == call]
    if not sub:
        return {"count": 0}
    hr = _hit_rate(sub)
    return {"count": len(sub),
            "precision": round(hr, 1) if hr is not None else None,
            "meanReturn": _mean([r["ret"] for r in sub]),
            "medianReturn": _median([r["ret"] for r in sub]),
            "marketRelativeMeanReturn": _mean([r["mrel"] for r in sub])}


def summarize_rows(matured, pending, withheld=0):
    """채점 완료 행들의 §30 Horizon 블록. HOLD가 방향 성적을 부풀리지 않게
    BUY/SELL/HOLD를 분리하고 방향판단(BUY+SELL)을 따로 낸다."""
    by_date, actions = {}, {}
    for r in matured:
        by_date.setdefault(r["date"], []).append(r)
        actions[r["call"]] = actions.get(r["call"], 0) + 1
    out = {"matured": len(matured), "pending": pending,
           "uniqueDates": len(by_date), "actionDistribution": actions}
    if withheld:
        out["withheld"] = withheld          # 판단 보류 — 분모에서 제외, 별도 표기
    if not matured:
        out["status"] = PENDING_NOT_MATURED
        return out
    if len(by_date) < MIN_UNIQUE_DATES:
        out["status"] = INSUFFICIENT_EVIDENCE
        out["reason"] = f"판단일이 {len(by_date)}일뿐입니다(최소 {MIN_UNIQUE_DATES}일 필요)"
        return out
    directional = [r for r in matured if r["call"] in ("BUY", "SELL")]
    dir_by_date = {}
    for r in directional:
        dir_by_date.setdefault(r["date"], []).append(r)
    out.update({
        "status": "OK",
        "overallAccuracy": round(_hit_rate(matured) or 0, 1),
        "accuracy": round(_hit_rate(matured) or 0, 1),   # 기존 UI 호환 필드
        "directionalAccuracy": (round(_hit_rate(directional), 1)
                                if _hit_rate(directional) is not None else None),
        "directionalCount": len(directional),
        "buy": _call_block(matured, "BUY"),
        "sell": _call_block(matured, "SELL"),
        "hold": _call_block(matured, "HOLD"),
        "accuracyCI95": _block_bootstrap_ci(by_date, _hit_rate),
        "directionalCI95": (_block_bootstrap_ci(dir_by_date, _hit_rate)
                            if len(dir_by_date) >= MIN_UNIQUE_DATES else None),
    })
    return out


# ── 기본모델 — history.js의 실제 Forward Record ─────────────────────────────
def load_base_rows(prices, hist=None):
    """archive_analysis.py가 쌓은 자동판단(tier:auto, 종목·날짜당 1건)을 채점.

    - 판단 보류(JUDGMENT_WITHHELD)는 채점 분모에서 제외하고 따로 센다.
    - baseModelVersion이 없는 기록은 hotfix 이전(PRE_HOTFIX_BASE) 기록이다.
    - Coverage(500/600)는 coverage_version.version_for_date로 그 날짜 기준 분리.
    """
    hist = hist if hist is not None else (
        load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {})
    matured, withheld = [], 0
    pending_by_version = {}
    for code, entries in hist.items():
        if not isinstance(entries, list):
            continue
        for e in entries:
            if not isinstance(e, dict) or e.get("tier") != "auto":
                continue        # 정밀분석 기록은 기본모델 성적표와 별개다
            day = str(e.get("date") or "")[:10]
            call = e.get("call")
            version = e.get("baseModelVersion") or PRE_HOTFIX_BASE
            if e.get("judgmentWithheld") or call == "JUDGMENT_WITHHELD":
                withheld += 1
                continue
            row = grade(prices, code, day, e.get("base"), call, 5)
            if row is None:
                if e.get("base") and call:
                    # 대기 건도 버전별로 귀속 — 옛 버전의 대기 건이 현재 버전
                    # 칸에 섞여 보이지 않게 한다.
                    pending_by_version[version] = pending_by_version.get(version, 0) + 1
                continue
            row["modelVersion"] = version
            row["coverage"] = coverage_version.version_for_date(day)
            matured.append(row)
    return matured, pending_by_version, withheld


def base_production_section(prices):
    matured, pending_by_version, withheld = load_base_rows(prices)
    current = [r for r in matured if r["modelVersion"] == BASE_MODEL_VERSION]
    pending_total = sum(pending_by_version.values())

    # 대표 성적 = 현재 서빙 버전 기록만. 옛 버전을 끌어와 현재 모델이 오래
    # 검증된 것처럼 보이게 하지 않는다.
    rep = summarize_rows(current, pending_by_version.get(BASE_MODEL_VERSION, 0), withheld)
    if rep.get("status") != "OK":
        rep.setdefault("note", "현재 버전(2026-08-15 hotfix 이후) 기록을 축적하는 중입니다")

    def bucket_summary(rows, keyname):
        buckets = {}
        for r in rows:
            buckets.setdefault(r[keyname], []).append(r)
        out = {}
        for k, v in sorted(buckets.items()):
            pend = pending_by_version.get(k, 0) if keyname == "modelVersion" else 0
            out[k] = summarize_rows(v, pend)
        return out

    by_version = bucket_summary(matured, "modelVersion")
    if BASE_MODEL_VERSION not in by_version:
        # 현재 버전 기록이 아직 없어도 '축적 중' 상태를 명시적으로 보여준다.
        by_version[BASE_MODEL_VERSION] = summarize_rows(
            [], pending_by_version.get(BASE_MODEL_VERSION, 0))

    return {
        "horizonBlock": rep,
        "recordCount": len(matured) + pending_total + withheld,
        "maturedCount": len(matured), "pendingCount": pending_total,
        "withheldCount": withheld,
        "uniquePredictionDates": len({r["date"] for r in matured}),
        "currentModelVersion": BASE_MODEL_VERSION,
        "byModelVersion": by_version,
        "byCoverage": bucket_summary(matured, "coverage"),
        "coverageNote": ("현재 서비스는 600종목 기준입니다. 2026-08-14까지의 "
                         "500종목 기록은 별도 구간으로 보존합니다."),
        # 짝비교용 색인 — 그날 실제로 서비스되던 기본모델 판단 전부.
        # (연구 기록과 '같은 날 같은 종목' 시험지를 최대로 맞추기 위해 버전 무관)
        "_pairIndex": {(r["code"], r["date"]): r for r in matured},
    }


# ── 연구모델 — Archive의 실제 live_shadow_oos 기록 채점 ─────────────────────
def load_research_records(store, max_days=120):
    """암호화된 Segment를 복호해 읽는다. Key가 없으면 None(집계 생략)."""
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


def _grade_horizons(prices, code, day, base, horizons_obj, horizon_days):
    """한 (모델|후보)의 저장된 action을 채점. ABSTAIN은 보류로 센다."""
    h = (horizons_obj or {}).get(str(horizon_days))
    if not isinstance(h, dict):
        return None, "absent"
    action = h.get("action") or h.get("primaryAction")
    if action in (None, "", "ABSTAIN", "JUDGMENT_WITHHELD"):
        return None, "withheld"
    row = grade(prices, code, day, base, action, horizon_days)
    return row, ("matured" if row else "pending")


def research_sections(prices, records):
    """A(단일) / B·C(후보별) 채점 집계 + B↔C 짝 색인."""
    a_rows = {"5": [], "20": [], "60": []}
    a_pend = {"5": 0, "20": 0, "60": 0}
    a_with = {"5": 0, "20": 0, "60": 0}
    cand = {"research_b": {}, "research_c": {}}   # cid → horizon → rows/pending
    pair_rows = []                                # B↔C 같은 record 짝 (5D)
    date_counts = {"research_a": set(), "research_b": set(), "research_c": set()}
    rec_counts = {"research_a": 0, "research_b": 0, "research_c": 0}

    for rec in records:
        code, day, base = rec.get("code"), str(rec.get("date") or "")[:10], rec.get("base")
        if not code or not day:
            continue
        r10 = rec.get("research")
        if isinstance(r10, dict):
            rec_counts["research_a"] += 1
            date_counts["research_a"].add(day)
            for h in ("5", "20", "60"):
                row, state = _grade_horizons(prices, code, day, base,
                                             r10.get("horizons"), int(h))
                if state == "matured":
                    a_rows[h].append(row)
                elif state == "pending":
                    a_pend[h] += 1
                elif state == "withheld":
                    a_with[h] += 1
        for key, model_id in (("researchV11", "research_b"), ("researchV20", "research_c")):
            block = rec.get(key)
            if not isinstance(block, dict):
                continue
            rec_counts[model_id] += 1
            date_counts[model_id].add(day)
            for cid, cv in (block.get("candidates") or {}).items():
                slot = cand[model_id].setdefault(cid, {
                    "5": {"rows": [], "pending": 0, "withheld": 0},
                    "20": {"rows": [], "pending": 0, "withheld": 0},
                    "60": {"rows": [], "pending": 0, "withheld": 0}})
                for h in ("5", "20", "60"):
                    row, state = _grade_horizons(prices, code, day, base,
                                                 (cv or {}).get("horizons"), int(h))
                    if state == "matured":
                        slot[h]["rows"].append(row)
                    elif state == "pending":
                        slot[h]["pending"] += 1
                    elif state == "withheld":
                        slot[h]["withheld"] += 1
        # B↔C 짝 — researchV20 후보의 pairedWith가 실제 가리키는 경우만.
        v11c = (rec.get("researchV11") or {}).get("candidates") or {}
        for cid, cv in ((rec.get("researchV20") or {}).get("candidates") or {}).items():
            paired = (cv or {}).get("pairedWith") or {}
            pid = paired.get("candidateModelId")
            if pid and pid in v11c:
                b_row, b_state = _grade_horizons(prices, code, day, base,
                                                 v11c[pid].get("horizons"), 5)
                c_row, c_state = _grade_horizons(prices, code, day, base,
                                                 (cv or {}).get("horizons"), 5)
                if b_state == "matured" and c_state == "matured":
                    pair_rows.append({"cid": cid, "date": day,
                                      "b": b_row, "c": c_row})
    return {"a_rows": a_rows, "a_pend": a_pend, "a_with": a_with,
            "cand": cand, "pair_rows": pair_rows,
            "date_counts": {k: len(v) for k, v in date_counts.items()},
            "rec_counts": rec_counts}


# ── 짝 비교 (같은 시험지 원칙) ───────────────────────────────────────────────
def paired_comparison(left_rows, right_rows, left_name, right_name, horizon="5"):
    """같은 (code, date)에서 둘 다 채점된 표본만 직접 비교한다."""
    left_ix = {(r["code"], r["date"]): r for r in left_rows}
    matched_l, matched_r = [], []
    for r in right_rows:
        l = left_ix.get((r["code"], r["date"]))
        if l:
            matched_l.append(l)
            matched_r.append(r)
    dates = {r["date"] for r in matched_r}
    out = {"leftModel": left_name, "rightModel": right_name, "horizon": horizon + "D",
           "matchedRows": len(matched_r), "matchedUniqueDates": len(dates)}
    if len(dates) < MIN_UNIQUE_DATES:
        out["evidenceStatus"] = INSUFFICIENT_EVIDENCE
        out["note"] = "차이를 판단하기 이릅니다"
        return out
    la, ra = _hit_rate(matched_l), _hit_rate(matched_r)
    out.update({
        "evidenceStatus": "OK",
        "leftAccuracy": round(la, 1) if la is not None else None,
        "rightAccuracy": round(ra, 1) if ra is not None else None,
        "differencePp": (round(ra - la, 1) if la is not None and ra is not None else None),
        "leftMarketRelative": _mean([r["mrel"] for r in matched_l]),
        "rightMarketRelative": _mean([r["mrel"] for r in matched_r]),
    })
    return out


# ── 동결 검증 (FAIL CLOSED) ──────────────────────────────────────────────────
def verify_frozen_hashes():
    """연구 A/B의 실제 config hash가 Registry 기대값과 다르면 집계를 중단한다."""
    import research_engine
    import research_engine_v11
    expected = {m["id"]: m.get("configHash") for m in model_registry.MODELS}
    actual = {"research_a": research_engine.config_hash(),
              "research_b": research_engine_v11.config_hash()}
    for mid, act in actual.items():
        if expected.get(mid) and expected[mid] != act:
            raise SystemExit(f"FAIL CLOSED: {mid} config hash 불일치 — "
                             f"기대 {expected[mid]} ≠ 실제 {act}. "
                             "동결 모델이 바뀐 채 성적을 이어붙일 수 없습니다.")
    return actual


def build(store=None, prices=None, hist=None):
    verify_frozen_hashes()
    prices = prices or PriceIndex()
    store = store or research_store.ResearchArchiveStore()
    records = load_research_records(store)
    key_ok = records is not None
    records = records or []
    research = research_sections(prices, records)
    base = base_production_section(prices)
    base_pair_index = base.pop("_pairIndex")

    models = []
    paired = []
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
        # 확률 미검증 상태를 정확히 표시 — '실제 신뢰도'라고 부르지 않는다.
        row["probabilityMetrics"] = (
            {"status": "CALIBRATION_NOT_VALIDATED",
             "note": "예측 확률이 실제 빈도와 맞는지 아직 검증되지 않았습니다"}
            if meta.get("producesProbability") else {"status": NOT_APPLICABLE})

        mid = meta["id"]
        horizons = {}
        if mid == "base_production":
            row.update({k: base[k] for k in
                        ("recordCount", "maturedCount", "pendingCount", "withheldCount",
                         "uniquePredictionDates", "currentModelVersion",
                         "byModelVersion", "byCoverage", "coverageNote")})
            for h in ("5", "20", "60"):
                if h + "D" not in (meta.get("horizons") or []):
                    horizons[h] = _empty_horizon(NOT_APPLICABLE)
                else:
                    horizons[h] = base["horizonBlock"]
            row["candidates"] = []
        elif mid == "research_a":
            row["recordCount"] = research["rec_counts"]["research_a"]
            row["uniquePredictionDates"] = research["date_counts"]["research_a"]
            for h in ("5", "20", "60"):
                horizons[h] = summarize_rows(research["a_rows"][h],
                                             research["a_pend"][h],
                                             research["a_with"][h])
            row["candidates"] = []
        elif mid in ("research_b", "research_c"):
            row["recordCount"] = research["rec_counts"][mid]
            row["uniquePredictionDates"] = research["date_counts"][mid]
            cands = research["cand"][mid]
            # 후보 순서는 candidateModelId 사전순 고정 — 성적순 정렬 금지(Winner 선택 방지)
            row["candidates"] = [
                {"candidateModelId": cid,
                 "horizons": {h: summarize_rows(slot[h]["rows"], slot[h]["pending"],
                                                slot[h]["withheld"])
                              for h in ("5", "20", "60")}}
                for cid, slot in sorted(cands.items())]
            # 모델 요약 칸은 후보 합산이 아니라 '후보 시험 중' 상태만 보여준다.
            for h in ("5", "20", "60"):
                total_m = sum(len(slot[h]["rows"]) for slot in cands.values())
                total_p = sum(slot[h]["pending"] for slot in cands.values())
                horizons[h] = {"status": "CANDIDATES_UNDER_TEST",
                               "matured": total_m, "pending": total_p,
                               "uniqueDates": research["date_counts"][mid],
                               "note": "대표 후보 없음 — 후보별 성적을 펼쳐 보세요"}
        else:   # legacy_shadow_v3 — 보관
            for h in ("5", "20", "60"):
                horizons[h] = _empty_horizon(
                    "ARCHIVED_NO_NEW_PREDICTIONS"
                    if h + "D" in (meta.get("horizons") or []) else NOT_APPLICABLE)
            row["recordCount"] = 0
            row["uniquePredictionDates"] = 0
            row["candidates"] = []
        row["horizons"] = horizons
        models.append(row)

    # 짝 비교 — 기본모델(현재 버전) vs 연구 후보 (같은 code·date·5D)
    if key_ok and base_pair_index:
        base_rows = list(base_pair_index.values())
        a5 = research["a_rows"]["5"]
        if a5:
            paired.append(paired_comparison(base_rows, a5,
                                            "base_production", "research_a"))
        for mid in ("research_b", "research_c"):
            for cid, slot in sorted(research["cand"][mid].items()):
                if slot["5"]["rows"]:
                    paired.append(paired_comparison(
                        base_rows, slot["5"]["rows"], "base_production", f"{mid}:{cid}"))
    # B↔C DART 짝 비교 — pairedWith metadata가 실제 존재하는 경우만
    dart_pairs = {}
    for p in research["pair_rows"]:
        dart_pairs.setdefault(p["cid"], {"b": [], "c": []})
        dart_pairs[p["cid"]]["b"].append(p["b"])
        dart_pairs[p["cid"]]["c"].append(p["c"])
    for cid, sides in sorted(dart_pairs.items()):
        paired.append(paired_comparison(sides["b"], sides["c"],
                                        f"research_b:{cid.replace('research_v2.0', 'research_v1.1')}",
                                        f"research_c:{cid}"))

    payload = model_registry.registry_payload({
        "generatedAt": research_store.datetime.datetime.now(
            research_store.datetime.timezone.utc).isoformat(),
        "gradingPolicyVersion": GRADING_POLICY_VERSION,
        "gradingNote": ("채점: 판단일 다음 N번째 거래일 종가 기준, "
                        "적중 정의는 기존 성적표(scoreCall)와 동일. "
                        "시장 대비 = 같은 날 분석 종목 전체 수익률 중앙값 차감."),
        "researchKeyAvailable": key_ok,
        "researchRecordDays": len(store.list_days()) if key_ok else 0,
        "coverage": {"current": coverage_version.current_version(),
                     "note": "500종목 시절(~2026-08-14)과 600종목 구간(2026-08-15~)을 "
                             "섞지 않고 나눠 집계합니다."},
        "models": models,
        "pairedComparisons": paired,
        "regimeSplit": {"status": "REGIME_DATA_INSUFFICIENT",
                        "note": "판단 당시 알 수 있었던 정보로만 장세를 나누려면 "
                                "성숙한 기록이 더 필요합니다."},
        "ranking": {"status": "RANKING_ON_HOLD",
                    "reason": "같은 Horizon·같은 표본·충분한 판단일이 갖춰지기 "
                              "전에는 순위를 매기지 않습니다."},
        "independenceNote": ("같은 날 여러 종목 판단은 서로 독립이 아닙니다. "
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
    base = next(m for m in payload["models"] if m["id"] == "base_production")
    print(f"model_scoreboard.js 저장 — 모델 {len(payload['models'])}개 · {size:,}B · "
          f"기본모델 기록 {base.get('recordCount', 0):,}건 · "
          f"Research Key {'있음' if payload['researchKeyAvailable'] else '없음'}")
    if size > 200_000:
        print(f"[경고] 공개 집계 파일이 {size:,}B로 큽니다. 원본이 섞였는지 확인하세요.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
