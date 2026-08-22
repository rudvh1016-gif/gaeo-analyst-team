# -*- coding: utf-8 -*-
"""공개 Status — 민감 연구내용 없이 집계만. 사이트 UI는 이번 범위에서 만들지 않는다."""
import datetime
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
STATUS_PATH = os.path.join(HERE, "status", "evolution_status.json")
FAILURE_REPORT_PATH = os.path.join(HERE, "status", "failure_report.json")


def write_json(path, doc):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)
    return path


def build_status(*, mode, production_version, baseline_summary, candidate_counts,
                 memory_aggregate, failure_cluster_count, research_needed,
                 safe_mode_reasons, llm_usage_known=False, cost_known=False,
                 last_promotion=None, last_rollback=None, notes=None,
                 degraded_reasons=None):
    # 오류를 note에 숨기고 OK로 표시하지 않는다(2026-08-22 2차 수리):
    #   SAFE_MODE(치명) > DEGRADED(비치명이지만 운영 문제) > OK
    if safe_mode_reasons:
        health = "SAFE_MODE"
    elif degraded_reasons:
        health = "DEGRADED"
    else:
        health = "OK"
    return {
        "schemaVersion": 1,
        "generatedAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        # BOOTSTRAP_SHADOW | ACTIVE_SHADOW | AWAITING_APPROVAL | ACTIVE_PRODUCTION | SAFE_MODE
        "mode": mode,
        "productionVersion": production_version,
        "lastEvaluationAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "baselineSummary": baseline_summary,          # 집계 수치만
        "candidateCounts": candidate_counts,          # 상태별 개수만
        "memory": memory_aggregate,                   # 개수·상태만(상세는 암호화 보관)
        "failureClusterCount": failure_cluster_count,
        "researchNeeded": research_needed,            # /gaeo-evolve 실행이 유용한 상태인가
        "lastPromotion": last_promotion,
        "lastRollback": last_rollback,
        "systemHealth": health,
        "safeModeReasons": safe_mode_reasons or [],
        "degradedReasons": degraded_reasons or [],
        "llmUsageKnown": llm_usage_known,
        "costKnown": cost_known,
        "claim": "GAEO는 실제 결과를 지속적으로 평가하고, 검증된 개선만 반영하도록 설계되어 있다. 적중률이 저절로 오른다는 보장은 없다.",
        "notes": notes or [],
    }
