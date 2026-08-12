#!/usr/bin/env python3
"""Generate GAEO's static rotation snapshot from repository data."""

from __future__ import annotations

import argparse
import copy
import json
import os
import re
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from rotation_engine import MODEL_COMPONENTS, PUBLIC_HORIZONS, build_snapshot, normalize_rows


HERE = Path(__file__).resolve().parent
KST = ZoneInfo("Asia/Seoul")


def load_js_value(path, variable):
    text = Path(path).read_text(encoding="utf-8")
    match = re.search(r"(?:const|let|var)\s+" + re.escape(variable) + r"\s*=\s*([\[{].*)\s*;\s*$", text, re.S)
    if not match:
        raise ValueError(f"{Path(path).name}에서 {variable} 값을 찾지 못했습니다.")
    return json.loads(match.group(1))


def flatten_pages(pages):
    rows = []
    for page in pages or []:
        rows.extend((page or {}).get("days") or [])
    return normalize_rows(rows)


def load_inputs(root=HERE):
    root = Path(root)
    tickers = load_js_value(root / "tickers.js", "TICKERS")
    configured = {str(row["code"]): row for row in tickers}
    price_history = load_js_value(root / "price_history.js", "PRICE_HISTORY")
    index_history = load_js_value(root / "index_history.js", "INDEX_HISTORY")

    krx_path = root / "krx_list.json"
    krx_payload = json.loads(krx_path.read_text(encoding="utf-8")) if krx_path.exists() else []
    krx_rows = krx_payload.get("items", []) if isinstance(krx_payload, dict) else krx_payload
    markets_all = {str(row.get("c")): str(row.get("m") or "KOSPI") for row in krx_rows}
    indicators_path = root / "indicators.json"
    indicators = json.loads(indicators_path.read_text(encoding="utf-8")) if indicators_path.exists() else {"stocks": {}}
    auto_path = root / "auto_analysis.js"
    auto_payload = load_js_value(auto_path, "LIVE_AUTO") if auto_path.exists() else {"stocks": {}}

    stocks = {
        code: flatten_pages(price_history.get(code, []))
        for code in configured
    }
    indices = {
        market: flatten_pages(index_history.get(market, []))
        for market in ("KOSPI", "KOSDAQ")
    }
    return {
        "stocks": stocks,
        "sectors": {code: row.get("sector") or "기타" for code, row in configured.items()},
        "names": {code: row.get("name") or code for code, row in configured.items()},
        "markets": {code: markets_all.get(code, "KOSPI") for code in configured},
        "indices": indices,
        "indicators": indicators.get("stocks") or {},
        "autoAnalysis": auto_payload.get("stocks") or {},
    }


def default_model():
    equal = round(1 / len(MODEL_COMPONENTS), 8)
    return {
        "schemaVersion": 1,
        "version": "rotation-shadow-v2",
        "calibratedThrough": None,
        "weights": {
            str(horizon): {component: equal for component in MODEL_COMPONENTS}
            for horizon in PUBLIC_HORIZONS
        },
        "calibration": {
            "evaluations": 0,
            "highOutperformsModerate": False,
            "status": "accumulating",
        },
        "leadLagScores": {},
        "similarityScores": {},
        "leadLagEdges": [],
        "similarMarkets": {"status": "accumulating", "cases": []},
        "horizonPerformance": {},
        "recommendedHorizon": {
            "status": "accumulating", "horizon": None,
            "reason": "표본 수와 구간 안정성이 기준에 도달할 때까지 추천을 보류합니다.",
        },
        "warnings": ["Walk-forward 평가가 쌓일 때까지 높은 신뢰도를 잠급니다."],
    }


def load_model(path):
    path = Path(path)
    if not path.exists():
        return default_model()
    try:
        model = json.loads(path.read_text(encoding="utf-8"))
        return model if isinstance(model, dict) else default_model()
    except (OSError, json.JSONDecodeError):
        return default_model()


def validate_snapshot(snapshot):
    required = {
        "schemaVersion", "generatedAt", "dataCutoff", "status", "universe",
        "marketRegime", "model", "summary", "sectors", "leadLagEdges",
        "similarMarkets", "methodology", "warnings",
    }
    if not isinstance(snapshot, dict) or not required.issubset(snapshot):
        return False
    if snapshot.get("schemaVersion") != 1 or not snapshot.get("sectors"):
        return False
    names = [sector.get("name") for sector in snapshot["sectors"] if isinstance(sector, dict)]
    if len(names) != len(set(names)) or not all(names):
        return False
    universe = snapshot.get("universe") or {}
    return bool(universe.get("configured") and 0 <= universe.get("valid", -1) <= universe["configured"])


def atomic_write(path, text):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    # tempfile.mkstemp can stall in the bundled Windows runtime when the
    # workspace path contains Korean characters. Keep the temporary file next
    # to the target (so os.replace stays atomic) and make its name process-local.
    temporary = path.with_name(f"{path.name}.{os.getpid()}.tmp")
    try:
        with open(temporary, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(text)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def write_snapshot_if_valid(path, snapshot):
    if not validate_snapshot(snapshot):
        return False
    payload = json.dumps(snapshot, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    atomic_write(path, f"window.ROTATION_SNAPSHOT={payload};\n")
    return True


def update_archive(path, snapshot, limit=750):
    path = Path(path)
    try:
        archive = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {"schemaVersion": 1, "days": []}
    except (OSError, json.JSONDecodeError):
        archive = {"schemaVersion": 1, "days": []}
    date = str(snapshot.get("dataCutoff") or snapshot.get("generatedAt") or "")[:10]
    archived_sectors = []
    for sector in snapshot.get("sectors") or []:
        periods = {}
        for horizon in PUBLIC_HORIZONS:
            period = (sector.get("periods") or {}).get(str(horizon)) or {}
            periods[str(horizon)] = {
                "score": period.get("score"),
                "confidence": period.get("confidence"),
                "signal": period.get("signal"),
                "return": {"adjusted": (period.get("return") or {}).get("adjusted")},
                "relativeStrength": period.get("relativeStrength"),
                "breadth": {"adjustedUpRate": (period.get("breadth") or {}).get("adjustedUpRate")},
                "flow": {"medianRelativeVolume": (period.get("flow") or {}).get("medianRelativeVolume")},
                "taro": {"score": (period.get("taro") or {}).get("score")},
                "concentration": {"top3": (period.get("concentration") or {}).get("top3")},
                "components": period.get("components"),
                "scoreExplanation": {
                    "contributions": ((period.get("scoreExplanation") or {}).get("contributions") or {}),
                },
            }
        archived_sectors.append({
            "name": sector.get("name"),
            "configuredCount": sector.get("configuredCount"),
            "validCount": sector.get("validCount"),
            "sampleReliability": sector.get("sampleReliability"),
            "periods": periods,
        })
    record = {
        "date": date,
        "generatedAt": snapshot.get("generatedAt"),
        "dataCutoff": snapshot.get("dataCutoff"),
        "status": snapshot.get("status"),
        "universe": snapshot.get("universe"),
        "marketRegime": snapshot.get("marketRegime"),
        "model": snapshot.get("model"),
        "summary": snapshot.get("summary"),
        "sectors": archived_sectors,
        "methodology": snapshot.get("methodology"),
        "warnings": snapshot.get("warnings"),
    }
    days = [row for row in archive.get("days", []) if row.get("date") != date]
    days.append(record)
    days.sort(key=lambda row: row.get("date") or "")
    archive = {"schemaVersion": 1, "days": days[-limit:]}
    atomic_write(path, json.dumps(archive, ensure_ascii=False, separators=(",", ":"), sort_keys=True) + "\n")
    return archive


def load_archive(path):
    try:
        payload = json.loads(Path(path).read_text(encoding="utf-8"))
        return payload if isinstance(payload, dict) else {"schemaVersion": 1, "days": []}
    except (OSError, json.JSONDecodeError):
        return {"schemaVersion": 1, "days": []}


def _change_direction(value):
    if value >= 3:
        return "급부상"
    if value >= 0.8:
        return "강화"
    if value <= -3:
        return "약화"
    if value <= -0.8:
        return "둔화"
    return "유지"


def apply_score_history(snapshot, archive):
    """Attach honest previous-close changes; same-day records never become the baseline."""
    enriched = copy.deepcopy(snapshot)
    current_date = str(enriched.get("dataCutoff") or enriched.get("generatedAt") or "")[:10]
    prior_days = sorted(
        (day for day in (archive or {}).get("days", []) if str(day.get("date") or "") < current_date),
        key=lambda day: day.get("date") or "",
    )
    prior = prior_days[-1] if prior_days else None
    prior_sectors = {
        sector.get("name"): sector
        for sector in ((prior or {}).get("sectors") or [])
    }
    for sector in enriched.get("sectors") or []:
        previous = prior_sectors.get(sector.get("name")) or {}
        previous_periods = previous.get("periods") or {}
        for horizon, period in (sector.get("periods") or {}).items():
            old_score = (previous_periods.get(horizon) or {}).get("score")
            new_score = period.get("score")
            if old_score is None or new_score is None:
                period["scoreChange"] = {
                    "status": "accumulating", "value": None, "direction": "축적 중", "baseDate": None,
                    "previousScore": old_score, "currentScore": new_score,
                    "componentStatus": "accumulating", "componentDeltas": {},
                }
                continue
            value = round(float(new_score) - float(old_score), 1)
            old_contributions = (((previous_periods.get(horizon) or {}).get("scoreExplanation") or {}).get("contributions") or {})
            new_contributions = ((period.get("scoreExplanation") or {}).get("contributions") or {})
            common_components = sorted(set(old_contributions) & set(new_contributions))
            component_deltas = {
                name: round(float(new_contributions[name]) - float(old_contributions[name]), 1)
                for name in common_components
                if old_contributions.get(name) is not None and new_contributions.get(name) is not None
            }
            period["scoreChange"] = {
                "status": "ready", "value": value, "direction": _change_direction(value),
                "baseDate": prior.get("date"),
                "previousScore": old_score, "currentScore": new_score,
                "componentStatus": "ready" if component_deltas else "accumulating",
                "componentDeltas": component_deltas,
            }
    enriched["historyStatus"] = {
        "status": "ready" if prior else "accumulating",
        "baseDate": prior.get("date") if prior else None,
    }
    return enriched


def _latest_date(stocks):
    dates = [row["date"] for rows in stocks.values() for row in rows]
    return max(dates) if dates else None


def _parse_now(value):
    if not value:
        return datetime.now(KST)
    parsed = datetime.fromisoformat(value.replace(" ", "T"))
    return parsed.replace(tzinfo=KST) if parsed.tzinfo is None else parsed.astimezone(KST)


def build_current_snapshot(root=HERE, mode="intraday", now=None):
    inputs = load_inputs(root)
    model = load_model(Path(root) / "rotation_model.json")
    moment = _parse_now(now)
    latest = _latest_date(inputs["stocks"]) or moment.strftime("%Y-%m-%d")
    cutoff = f"{latest} {'종가' if mode == 'close' else moment.strftime('%H:%M') + ' 장중'}"
    snapshot = build_snapshot(
        inputs["stocks"], inputs["sectors"], inputs["markets"], inputs["indices"],
        indicators=inputs["indicators"], names=inputs["names"], auto_analysis=inputs["autoAnalysis"], model=model,
        generated_at=moment.strftime("%Y-%m-%d %H:%M"), data_cutoff=cutoff,
    )
    snapshot = apply_score_history(snapshot, load_archive(Path(root) / "rotation_archive.json"))
    snapshot["status"] = "confirmed" if mode == "close" else "provisional"
    return snapshot, model


def main(argv=None):
    parser = argparse.ArgumentParser(description="GAEO 순환매 스냅샷 생성")
    parser.add_argument("--mode", choices=("intraday", "close"), default="intraday")
    parser.add_argument("--root", default=str(HERE))
    parser.add_argument("--now", default=None)
    args = parser.parse_args(argv)

    root = Path(args.root)
    snapshot, model = build_current_snapshot(root, args.mode, args.now)
    if not write_snapshot_if_valid(root / "rotation_snapshot.js", snapshot):
        raise SystemExit("스냅샷 검증 실패: 마지막 정상 파일을 유지합니다.")
    if not (root / "rotation_model.json").exists():
        atomic_write(root / "rotation_model.json", json.dumps(model, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    if args.mode == "close":
        update_archive(root / "rotation_archive.json", snapshot)
    print(
        f"rotation {args.mode}: {snapshot['universe']['valid']}/{snapshot['universe']['configured']}종목, "
        f"{len(snapshot['sectors'])}업종, {snapshot['summary']['headline']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
