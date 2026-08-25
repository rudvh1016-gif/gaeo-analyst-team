# -*- coding: utf-8 -*-
"""교체 제안(Proposal) — 상장폐지가 **확인된** 종목이 있을 때만 만드는 승인 요청서.

절대 규칙 (하나라도 어기면 이 모듈은 제안 자체를 만들지 않는다)
    1. DELISTED_CONFIRMED 가 0건이면 제안을 만들지 않는다.
       TEMP_DATA_FAILURE · LISTED_BUT_SUSPENDED · CORPORATE_EVENT · PIPELINE_BUG ·
       UNKNOWN 은 교체 사유가 아니다.
    2. 제안을 적용했다고 가정한 configuredCoverage가 목표(600)와 **정확히** 같지
       않으면 FAIL CLOSED — 제안을 만들지 않는다.
    3. tickers.js를 읽지도 쓰지도 않는다. main 자동 반영 경로가 존재하지 않는다.
    4. Coverage Version은 **초안 문자열**만 만든다. coverage_version.py의
       COVERAGE_HISTORY append는 대표 승인 후 사람이 별도로 한다.
       (그 전까지 Coverage Version은 바뀌지 않는다.)
"""
import argparse
import json
import os
import sys

from . import guardian

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_DIR = os.path.join(HERE, "state")

DEFAULT_OUT = os.path.join(STATE_DIR, "replacement_proposal.json")

STATUS_NO_PROPOSAL = "NO_PROPOSAL"
STATUS_FAIL_CLOSED = "FAIL_CLOSED"
STATUS_AWAITING = "PROPOSAL_AWAITING_APPROVAL"

APPLY_NOTE = ("이 문서는 제안일 뿐이다. tickers.js·main 반영은 대표 승인 후 사람이 "
              "직접 한다. 이 코드에는 자동 반영 경로가 없다.")


def draft_coverage_version(history, target):
    """다음 Coverage Version '초안' 문자열. 실제 등록은 승인 후 사람이 한다."""
    return "GAEO_COVERAGE_V%d_%d" % (len(history) + 1, int(target))


def build_proposal(*, coverage_report, standby_pool, coverage_history=None, now=None):
    now_iso = guardian.now_kst_iso(now)
    coverage_report = coverage_report if isinstance(coverage_report, dict) else {}
    standby_pool = standby_pool if isinstance(standby_pool, dict) else {}

    if coverage_history is None:
        coverage_history = guardian._coverage_version_module().COVERAGE_HISTORY

    target = coverage_report.get("targetCoverage")
    configured = coverage_report.get("configuredCoverage")
    findings = coverage_report.get("findings") or []
    delisted = [f for f in findings
                if f.get("cause") == guardian.DELISTED_CONFIRMED]
    non_replaceable = [f for f in findings
                       if f.get("cause") != guardian.DELISTED_CONFIRMED]

    base = {
        "schemaVersion": 1,
        "generatedAt": now_iso,
        "appliedToTickers": False,
        "autoApplyPath": False,
        "currentCoverageVersion": coverage_report.get("coverageVersion"),
        "draftCoverageVersion": None,
        "targetCoverage": target,
        "configuredCoverage": configured,
        "removals": [],
        "additions": [],
        "note": APPLY_NOTE,
        "nonReplaceableMissing": [
            {"code": f.get("code"), "name": f.get("name"), "cause": f.get("cause")}
            for f in non_replaceable],
    }

    if not delisted:
        base["status"] = STATUS_NO_PROPOSAL
        base["reason"] = ("확정 상장폐지 종목이 0건이다. 나머지 누락 원인은 교체 사유가 "
                          "아니므로 종목 교체를 제안하지 않는다.")
        return base

    if not isinstance(target, int) or not isinstance(configured, int):
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = "targetCoverage/configuredCoverage 실측값이 없다. 제안 생성 거부."
        return base

    candidates = [c for c in (standby_pool.get("candidates") or [])
                  if c.get("eligibilityVerdict") == "ELIGIBLE_STANDBY"]
    if len(candidates) < len(delisted):
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = ("대기 명단 자격 후보가 %d개뿐이라 상장폐지 %d종목을 채울 수 없다. "
                          "제안 생성 거부(숫자 맞추기 금지)."
                          % (len(candidates), len(delisted)))
        return base

    removals = [{"code": f.get("code"), "name": f.get("name"),
                 "sector": f.get("sector"), "cause": f.get("cause"),
                 "consecutiveMissing": f.get("consecutiveMissing"),
                 "evidence": f.get("evidence"), "fingerprint": f.get("fingerprint")}
                for f in delisted]
    additions = candidates[:len(delisted)]

    expected = configured - len(removals) + len(additions)
    if expected != target:
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = ("제안 적용 후 예상 configuredCoverage가 %d로 목표 %d와 다르다. "
                          "제안 생성 거부(FAIL CLOSED)." % (expected, target))
        base["expectedConfiguredCoverage"] = expected
        return base

    base.update({
        "status": STATUS_AWAITING,
        "reason": "확정 상장폐지 %d종목에 대한 교체 제안." % len(removals),
        "removals": removals,
        "additions": additions,
        "expectedConfiguredCoverage": expected,
        "draftCoverageVersion": draft_coverage_version(coverage_history, target),
        "draftCoverageVersionNote": (
            "초안이다. coverage_version.py의 COVERAGE_HISTORY에는 아직 없다. "
            "대표 승인 후 사람이 append하며, 과거 항목은 수정하지 않는다."),
        "sourceSnapshot": standby_pool.get("sourceSnapshot"),
        "approvalRequired": True,
        "approvedBy": None,
    })
    return base


def _read_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        return doc if isinstance(doc, dict) else None
    except Exception:
        return None


def run(*, coverage_path=guardian.DEFAULT_REPORT_OUT,
        standby_path=None, out=DEFAULT_OUT, write=True, now=None):
    from . import standby as standby_mod
    standby_path = standby_path or standby_mod.DEFAULT_OUT
    doc = build_proposal(coverage_report=_read_json(coverage_path) or {},
                         standby_pool=_read_json(standby_path) or {}, now=now)
    if write:
        guardian.write_json(out, doc)
    return doc


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Coverage 교체 제안 (승인 요청서 초안)")
    p.add_argument("--coverage", default=guardian.DEFAULT_REPORT_OUT)
    p.add_argument("--standby", default=None)
    p.add_argument("--out", default=DEFAULT_OUT)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    doc = run(coverage_path=args.coverage, standby_path=args.standby, out=args.out,
              write=not args.dry_run)
    print("[proposal] status=%s reason=%s" % (doc["status"], doc.get("reason")))
    print("  제거 %d · 추가 %d · 초안버전 %s · tickers.js 반영 %s"
          % (len(doc["removals"]), len(doc["additions"]),
             doc.get("draftCoverageVersion"), doc["appliedToTickers"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
