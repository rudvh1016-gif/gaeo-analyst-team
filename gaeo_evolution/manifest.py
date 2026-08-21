# -*- coding: utf-8 -*-
"""Run Manifest — Evolution 실행 1회의 메타데이터.

원칙:
  · 모르는 값은 지어내지 않는다. 비용을 모르면 costUsd=None으로 남긴다.
  · 자동(결정론) 실행은 llmUsed=False, 토큰 0이어야 한다.
  · 저장소 비대화 방지: 최신 manifest 1개만 status에 남긴다(긴 raw trace를
    매 실행 Git에 쌓지 않는다).
"""
import datetime
import json
import os
import subprocess
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LAST_MANIFEST_PATH = os.path.join(HERE, "status", "last_run_manifest.json")

COST_SOURCE_UNKNOWN = "unavailable_claude_code_subscription"
COST_SOURCE_NO_LLM = "not_applicable_no_llm"


def _git_sha(root=ROOT):
    try:
        out = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root,
                             capture_output=True, text=True, timeout=15)
        sha = out.stdout.strip()
        return sha if out.returncode == 0 and len(sha) >= 7 else None
    except Exception:
        return None


def new_manifest(run_type, scoring_version, base_model_version=None,
                 candidate_version=None, root=ROOT):
    now = datetime.datetime.now().astimezone()
    return {
        "runId": now.strftime("evo-%Y%m%d-%H%M%S"),
        "runType": run_type,
        "startedAt": now.isoformat(timespec="seconds"),
        "finishedAt": None,
        "gitSha": _git_sha(root),
        "scoringVersion": scoring_version,
        "baseModelVersion": base_model_version,
        "candidateVersion": candidate_version,
        "decisionCutoff": None,
        "priceFetchedAt": None,
        "analysisGeneratedAt": None,
        "stocksRequested": None,
        "stocksSucceeded": None,
        "stocksFailed": None,
        "testsPassed": None,
        "testsFailed": None,
        # ⛔ 결정론 실행 기본값. LLM을 실제로 썼을 때만 바꾼다.
        "llmUsed": False,
        "llmProvider": None,
        "llmModel": None,
        "inputTokens": 0,
        "outputTokens": 0,
        "cachedTokens": 0,
        "costUsd": None,
        "costSource": COST_SOURCE_NO_LLM,
        "runtimeSeconds": None,
        "status": "RUNNING",
        "_startedMonotonic": time.monotonic(),
    }


def mark_llm_used(manifest, provider=None, model=None,
                  input_tokens=None, output_tokens=None, cached_tokens=None,
                  cost_usd=None, cost_source=None):
    """LLM을 실제로 사용한 실행에서만 부른다. 모르는 토큰/비용은 None 그대로 둔다."""
    manifest["llmUsed"] = True
    manifest["llmProvider"] = provider
    manifest["llmModel"] = model
    manifest["inputTokens"] = input_tokens
    manifest["outputTokens"] = output_tokens
    manifest["cachedTokens"] = cached_tokens
    manifest["costUsd"] = cost_usd
    manifest["costSource"] = cost_source or COST_SOURCE_UNKNOWN
    return manifest


def finish(manifest, status="OK", path=LAST_MANIFEST_PATH):
    manifest["finishedAt"] = datetime.datetime.now().astimezone().isoformat(timespec="seconds")
    started = manifest.pop("_startedMonotonic", None)
    manifest["runtimeSeconds"] = round(time.monotonic() - started, 1) if started else None
    manifest["status"] = status
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)
    return manifest
