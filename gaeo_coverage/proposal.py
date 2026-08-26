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

교체 후보 고르는 법 (2026-08-25 퀀트 감사 MEDIUM 수리)
    대기 명단은 시가총액 순으로만 정렬돼 있는데, 지금 그 상위권이 거의 코스닥이다
    (후보 40개 중 KOSPI 2개). 그대로 교체를 반복하면 Universe가 한 방향으로
    (KOSPI→KOSDAQ, 대형→중형) 계속 밀려서 Coverage Version끼리 성적을 비교할 수
    없게 된다. 그래서 **빠지는 종목과 같은 시장에서 가장 큰 후보**를 먼저 고른다.
    같은 시장에 자격 후보가 없으면 그 건은 FAIL CLOSED다 (억지로 다른 시장 종목을
    끼워 넣지 않는다).
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

# 들어오는 후보의 시가총액이 빠지는 종목의 이 비율보다 작으면 "크기가 많이 다르다"고
# 표시한다. 막지는 않는다 — 어차피 대표 승인이 있어야 반영되기 때문이다. 다만 그
# 숫자를 보지 못한 채 승인하면 Universe 성격이 통째로 바뀔 수 있으므로 눈에 띄게
# 적어 둔다(2026-08-26 퀀트 3차 감사).
SIZE_MISMATCH_RATIO = 0.1
# ⚠️ 양방향으로 본다. 진짜 상장폐지 종목은 대개 초소형이라 실제 교체는 **커지는**
#    방향이 흔하다(실측: 0.089조 → 0.989조, 11배). 작아지는 쪽만 보면 11배 확대를
#    "크기 차이가 크지 않습니다"라고 말하게 된다(2026-08-26 퀀트 4차 감사 MEDIUM-8).
SIZE_MISMATCH_RATIO_UP = 3.0

APPLY_NOTE = ("이 문서는 제안일 뿐이다. tickers.js·main 반영은 대표 승인 후 사람이 "
              "직접 한다. 이 코드에는 자동 반영 경로가 없다.")


def draft_coverage_version(history, target):
    """다음 Coverage Version '초안' 문자열. 실제 등록은 승인 후 사람이 한다."""
    return "GAEO_COVERAGE_V%d_%d" % (len(history) + 1, int(target))


def market_of(removal):
    """빠지는 종목이 어느 시장이었나. 실측으로 확인되지 않으면 None(추측 금지)."""
    market = removal.get("market")
    return str(market) if market else None


def match_by_market(removals, candidates):
    """빠지는 종목과 **같은 시장**에서 시가총액이 가장 큰 후보를 하나씩 배정한다.

    같은 시장 후보가 없으면 그 건은 배정하지 않고 unmatched로 돌려준다
    (다른 시장 종목으로 대충 채우지 않는다).

    ⚠️ "앞에서부터 훑으면 그게 최대"라고 가정하지 않는다. eligible_candidates()는
       본문 목록과 시장별 예비 명단을 이어 붙이므로 합친 결과는 전체 정렬이 아니다.
       지금은 예비 명단이 본문보다 작은 종목만 남지만, 상류 정렬 규칙이 바뀌면
       조용히 더 작은 후보를 고르게 된다. 그래서 여기서 직접 최대값을 고른다
       (2026-08-25 퀀트 재감사 LOW).
    """
    def _cap(c):
        v = c.get("marketCap")
        if v is None:
            v = c.get("capAtSnapshot")
        try:
            return float(v)
        except (TypeError, ValueError):
            return float("-inf")

    used, additions, unmatched = set(), [], []
    for removal in removals:
        market = market_of(removal)
        if not market:
            unmatched.append("시장미상(%s)" % removal.get("code"))
            continue
        same_market = [c for c in candidates
                       if c["code"] not in used and str(c.get("market")) == market]
        # 동점이면 코드 순으로 결정 — 실행마다 결과가 달라지면 안 된다.
        picked = min(same_market, key=lambda c: (-_cap(c), str(c["code"]))) \
            if same_market else None
        if picked is None:
            unmatched.append(market)
            continue
        used.add(picked["code"])
        additions.append(picked)
    return additions, unmatched


def eligible_candidates(standby_pool):
    """자격 통과 후보 목록.

    본문(candidates, 시총 순 40개)을 먼저 두고, 그 뒤에 시장별 예비 명단
    (marketReserves)을 붙인다. 본문에 그 시장 후보가 없더라도 같은 시장 안에서
    고를 수 있게 하기 위한 것이고, 정렬 규칙(시가총액 내림차순)은 두 목록 모두
    동일하다. 중복은 code로 제거한다.
    """
    seen, out = set(), []
    groups = [standby_pool.get("candidates") or []]
    reserves = standby_pool.get("marketReserves") or {}
    for market in sorted(reserves):
        groups.append(reserves[market] or [])
    for group in groups:
        for c in group:
            if not isinstance(c, dict):
                continue
            if c.get("eligibilityVerdict") != "ELIGIBLE_STANDBY":
                continue
            code = c.get("code")
            if not code or code in seen:
                continue
            seen.add(code)
            out.append(c)
    return out


def build_proposal(*, coverage_report, standby_pool, coverage_history=None, now=None,
                   run_id=None):
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
        "runId": guardian.resolve_run_id(run_id),
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

    candidates = eligible_candidates(standby_pool)
    if len(candidates) < len(delisted):
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = ("대기 명단 자격 후보가 %d개뿐이라 상장폐지 %d종목을 채울 수 없다. "
                          "제안 생성 거부(숫자 맞추기 금지)."
                          % (len(candidates), len(delisted)))
        return base

    removals = [{"code": f.get("code"), "name": f.get("name"),
                 "sector": f.get("sector"), "cause": f.get("cause"),
                 "market": f.get("market"),
                 "safestKnownCap": f.get("safestKnownCap"),
                 # 성적 비교에서 "이 종목을 언제부터 없는 것으로 치는가"가 없으면
                 # 정리매매 구간 급락이 어느 Coverage Version에 귀속되는지 모른 채
                 # 비교하게 된다(생존편향이 새어 드는 지점 — 퀀트 4차 감사).
                 "removalEffectiveFrom": f.get("firstAbsentAt"),
                 "safestKnownCapRank": f.get("safestKnownCapRank"),
                 "missingDayCount": f.get("missingDayCount"),
                 "elapsedTradingDays": f.get("elapsedTradingDays"),
                 "evidence": f.get("evidence"), "fingerprint": f.get("fingerprint")}
                for f in delisted]
    additions, unmatched = match_by_market(removals, candidates)
    if unmatched:
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = ("같은 시장(%s)에서 자격 후보를 찾지 못했다. 시장을 바꿔 끼우면 "
                          "Universe가 한 방향으로 밀려 Coverage Version 간 비교가 "
                          "깨지므로 제안 생성을 거부한다."
                          % ", ".join(sorted({str(u) for u in unmatched})))
        return base

    expected = configured - len(removals) + len(additions)
    if expected != target:
        base["status"] = STATUS_FAIL_CLOSED
        base["reason"] = ("제안 적용 후 예상 configuredCoverage가 %d로 목표 %d와 다르다. "
                          "제안 생성 거부(FAIL CLOSED)." % (expected, target))
        base["expectedConfiguredCoverage"] = expected
        return base

    # 크기 차이를 계산해 제안서에 박아 둔다(승인 전에 반드시 보이도록).
    size_notes, mismatch_n = [], 0
    for removal, addition in zip(removals, additions):
        out_cap = removal.get("lastKnownCap") or removal.get("safestKnownCap")
        in_cap = addition.get("marketCap") or addition.get("capAtSnapshot")
        ratio = None
        if isinstance(out_cap, (int, float)) and isinstance(in_cap, (int, float)) \
                and out_cap > 0:
            ratio = float(in_cap) / float(out_cap)
        mismatch = ratio is not None and (ratio < SIZE_MISMATCH_RATIO
                                          or ratio > SIZE_MISMATCH_RATIO_UP)
        if mismatch:
            mismatch_n += 1
        size_notes.append({
            "removeCode": removal.get("code"), "removeName": removal.get("name"),
            "removeCap": out_cap,
            "addCode": addition.get("code"), "addName": addition.get("name"),
            "addCap": in_cap,
            "capRatio": None if ratio is None else round(ratio, 6),
            "sizeMismatch": mismatch,
            "direction": (None if ratio is None else
                          "SMALLER" if ratio < 1 else "LARGER"),
            "note": (("빠지는 종목보다 훨씬 작은 종목이 들어옵니다. 승인하면 감시 "
                      "대상의 성격이 바뀔 수 있습니다."
                      if ratio is not None and ratio < SIZE_MISMATCH_RATIO else
                      "빠지는 종목보다 훨씬 큰 종목이 들어옵니다. 승인하면 감시 "
                      "대상의 성격이 바뀔 수 있습니다.") if mismatch else
                     "크기 차이가 크지 않습니다." if ratio is not None else
                     "크기를 비교할 수 없습니다(측정값 없음).")})

    base.update({
        "status": STATUS_AWAITING,
        "sizeComparison": size_notes,
        "sizeMismatchCount": mismatch_n,
        "sizeMismatchRatio": SIZE_MISMATCH_RATIO,
        "sizeMismatchRatioUp": SIZE_MISMATCH_RATIO_UP,
        "reason": "확정 상장폐지 %d종목에 대한 교체 제안." % len(removals),
        "removals": removals,
        "additions": additions,
        "marketMatched": True,
        "marketMatchNote": ("교체 후보는 빠지는 종목과 같은 시장(KOSPI/KOSDAQ)에서 "
                            "시가총액이 가장 큰 자격 후보로 골랐다. Universe가 한 방향으로 "
                            "밀리는 것을 막기 위한 규칙이다."),
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
        standby_path=None, out=DEFAULT_OUT, write=True, now=None, run_id=None):
    from . import standby as standby_mod
    standby_path = standby_path or standby_mod.DEFAULT_OUT
    doc = build_proposal(coverage_report=_read_json(coverage_path) or {},
                         standby_pool=_read_json(standby_path) or {}, now=now,
                         run_id=run_id)
    if write:
        guardian.write_json(out, doc)
    return doc


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Coverage 교체 제안 (승인 요청서 초안)")
    p.add_argument("--coverage", default=guardian.DEFAULT_REPORT_OUT)
    p.add_argument("--standby", default=None)
    p.add_argument("--out", default=DEFAULT_OUT)
    p.add_argument("--run-id", default=None)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    doc = run(coverage_path=args.coverage, standby_path=args.standby, out=args.out,
              write=not args.dry_run, run_id=args.run_id)
    print("[proposal] status=%s reason=%s" % (doc["status"], doc.get("reason")))
    print("  제거 %d · 추가 %d · 초안버전 %s · tickers.js 반영 %s"
          % (len(doc["removals"]), len(doc["additions"]),
             doc.get("draftCoverageVersion"), doc["appliedToTickers"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
