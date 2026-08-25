# -*- coding: utf-8 -*-
"""Standby Pool — "정말 교체해야 할 일이 생기면 그때 볼 후보" 목록(대기 명단).

이 파일이 하는 일은 목록을 **미리 만들어 두는 것**뿐이다. 여기 이름이 올랐다고
tickers.js에 들어가지 않는다. 실제 편입은 대표 승인 후 사람이 한다.

후보 자격 (전부 실측 metadata 기반 — 추측 금지)
    kind  == "COMMON"                  ← 보통주만
    basis == "source_stockEndType"     ← 소스가 직접 알려준 유형일 때만
    tradable is True                   ← 거래 가능
    cap    이 실제 숫자로 존재
    code   가 현재 Universe(tickers.js)에 없음
    sector 가 sector_map.json(KRX 공식 업종)에 있고, 집합투자기구 업종이 아님

    ⛔ 자동 탈락: ETF · ETN · SPAC · REIT · CLASS_SHARE(우선주 등) ·
       COMMON_ASSUMED(유형 metadata 없음) · CLASSIFICATION_UNKNOWN ·
       NON_STOCK_* · 거래정지 · 이미 편입된 종목 · 시총 결측 ·
       집합투자기구 업종 · 업종 불명

정렬 기준
    시가총액 내림차순 **하나뿐**이다.
    ⛔ "최근 많이 오른 종목" / "인기 종목" / "거래대금 급증" 기준을 쓰지 않는다.
       그건 사후확증편향으로 대기 명단을 오염시킨다.

개수
    목표 30~50개. 자격 미달이면 개수를 채우지 않는다. 30개가 안 나오면
    그대로 적게 내보내고 shortfall로 표시한다(품질 낮은 후보로 숫자 맞추기 금지).
"""
import argparse
import hashlib
import json
import os
import sys

from . import guardian

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_DIR = os.path.join(HERE, "state")

DEFAULT_SECTOR_MAP = os.path.join(ROOT, "market_universe", "sector_map.json")
DEFAULT_OUT = os.path.join(STATE_DIR, "standby_pool.json")

TARGET_MIN = 30
TARGET_MAX = 50
DEFAULT_TARGET = 40

# 시장별 예비 명단 크기 (2026-08-25 퀀트 감사 MEDIUM 수리).
#   대기 명단 본문(candidates)은 지시대로 시가총액 순으로만 정렬한다. 그런데 지금
#   그 상위권이 거의 코스닥이라(40개 중 KOSPI 2개), 코스피 종목이 빠졌을 때 같은
#   시장에서 채울 후보가 없다. 그래서 정렬 규칙은 그대로 두고, 시장별로 가장 큰
#   후보를 따로 모아 둔다. 선택 단계(proposal)가 여기서 시장을 맞춰 고른다.
MARKET_RESERVE_SIZE = 20

ELIGIBLE_KIND = "COMMON"
ELIGIBLE_BASIS = "source_stockEndType"

# ── 업종 기준 제외 (2026-08-25 추가) ─────────────────────────────────────────
# 왜 필요한가
#   ETF·ETN·SPAC·REIT 제외의 취지는 "펀드형 상장기구를 빼자"는 것이다. 그런데
#   맥쿼리인프라·KB발해인프라·맵스리얼티 같은 상장 집합투자기구는 소스 metadata의
#   stockEndType이 "stock"이고 이름도 '리츠'로 끝나지 않아서 기존 규칙 넷을 전부
#   통과해 대기 명단 1·2·4위에 올라와 있었다(실측 확인).
#
# 왜 이 방식이 '이름 추측'이 아닌가
#   sector_map.json의 업종명은 kind.krx.co.kr 상장법인목록의 **공식 업종 컬럼**이다.
#   즉 종목명을 보고 우리가 짐작한 값이 아니라 소스가 준 실측 metadata다. 그래서
#   collect_market_universe.py의 "이름 기반 fuzzy 분류 금지" 원칙과 충돌하지 않는다.
#
# 이 목록에 무엇을 넣었고 무엇을 안 넣었나 (2026-08-25 실측 조사 결과)
#   · '신탁업 및 집합투자업'(14종목) → 넣었다. 대표 지시.
#     ⚠️ 다만 이 업종은 순수 집합투자기구(맥쿼리인프라·KB발해인프라·맵스리얼티)와
#        창업투자회사·부동산신탁회사 같은 **정상 영업기업**이 섞여 있다. 이 규칙은
#        후자(DSC인베스트먼트·에이티넘인베스트·SBI인베스트먼트·대성창투·
#        TS인베스트먼트·린드먼아시아·GMI벤처 7곳, 전부 0.23조 이하)까지 함께
#        떨어뜨리는 과잉 제외다. 대기 명단에서만 빠질 뿐 분석 대상에서 빠지는 게
#        아니고, 전부 상위 40위 진입권(0.40조) 밖이라 실질 영향이 없어 보수적인
#        쪽을 택했다. 더 정밀한 분리를 하려면 종목명 추측이 필요해서 하지 않았다.
#   · '부동산 임대 및 공급업'(27종목) → 넣지 않았다. 실제로 열어 보니 대부분 이미
#     kind=REIT로 걸러지고, 남는 것은 자이에스앤디·SK디앤디·부방·디티씨·신라섬유
#     같은 정상 부동산 개발/제조 기업이다. 업종째로 빼면 이들을 잘못 떨어뜨린다.
#     (이 업종의 088260 이리츠코크렙은 실제 리츠인데 kind=COMMON으로 새어 나온다.
#      단일 종목 예외를 이름으로 박는 것은 금지된 방식이라 그대로 두고 보고만 한다.)
#   · '기타 금융업'(100종목) · '금융 지원 서비스업'(63종목) → 넣지 않았다.
#     SK스퀘어·KB금융·신한지주·미래에셋증권처럼 지주회사·은행·증권사가 들어 있는
#     정상 영업기업 업종이다.
#
# 목록을 늘리려면: 반드시 그 업종의 실제 구성 종목을 전부 열어 보고, 정상 영업기업이
# 하나도 섞여 있지 않을 때만 추가한다. 확실하지 않으면 추가하지 않는다.
EXCLUDED_SECTORS = frozenset({
    "신탁업 및 집합투자업",
})

# 업종 불명(sector_map.json에 없음) 처리 방침 — 제외한다.
#   근거: 자격 심사의 대원칙이 "종류가 확실히 확인된 것만 후보로 둔다"이다. 업종을
#   확인할 수 없는 종목은 위 집합투자기구 필터를 통과했는지조차 확인할 수 없으므로,
#   '통과'로 봐주면 필터에 구멍이 생긴다. 대신 이 때문에 후보가 30개 밑으로 떨어지면
#   기준을 낮추지 않고 SHORTFALL로 정직하게 보고한다.
#   실측(2026-08-25): 자격 통과 1,818종목 중 업종 미매핑은 0개라 현재 손실은 없다.
REQUIRE_KNOWN_SECTOR = True

VERDICT_ELIGIBLE = "ELIGIBLE_STANDBY"

# 탈락 사유 코드 (감사 가능하도록 개수를 남긴다)
R_NOT_COMMON = "NOT_COMMON_KIND"
R_BASIS = "UNVERIFIED_CLASSIFICATION_BASIS"
R_NOT_TRADABLE = "NOT_TRADABLE"
R_ALREADY = "ALREADY_IN_COVERAGE"
R_NO_CAP = "MISSING_MARKET_CAP"
R_NO_NAME = "MISSING_NAME"
R_COLLECTIVE = "COLLECTIVE_INVESTMENT_SECTOR"
R_SECTOR_UNKNOWN = "SECTOR_UNKNOWN"


def load_sector_map(path=DEFAULT_SECTOR_MAP):
    """probe_sector_source.py가 만든 공식 업종 매핑. 없으면 빈 매핑(임의 분류 금지)."""
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        mapping = doc.get("map")
        if isinstance(mapping, dict):
            return {"asOf": doc.get("asOf"), "source": doc.get("source"), "map": mapping}
    except Exception:
        pass
    return {"asOf": None, "source": None, "map": {}}


def candidate_fingerprint(code):
    """대기 명단 항목의 안정 식별자. 실행 시각을 섞지 않는다(같은 종목=같은 값)."""
    return hashlib.sha256(("gaeo-standby:%s" % code).encode("utf-8")).hexdigest()[:16]


def screen(item, covered_codes, sector=None):
    """후보 1건 자격 심사. (통과여부, 사유) — 통과면 사유는 None.

    업종 검사는 맨 마지막이다. ETF처럼 애초에 다른 이유로 떨어지는 종목이
    SECTOR_UNKNOWN 카운트를 부풀리면 통계를 읽을 수 없게 되기 때문이다.
    """
    if str(item.get("code") or "") in covered_codes:
        return False, R_ALREADY
    if item.get("kind") != ELIGIBLE_KIND:
        return False, R_NOT_COMMON
    if item.get("basis") != ELIGIBLE_BASIS:
        return False, R_BASIS
    if item.get("tradable") is not True:
        return False, R_NOT_TRADABLE
    if not str(item.get("name") or "").strip():
        return False, R_NO_NAME
    cap = item.get("cap")
    if not isinstance(cap, (int, float)) or isinstance(cap, bool) or cap <= 0:
        return False, R_NO_CAP
    sector = (sector or "").strip()
    if not sector:
        if REQUIRE_KNOWN_SECTOR:
            return False, R_SECTOR_UNKNOWN
    elif sector in EXCLUDED_SECTORS:
        return False, R_COLLECTIVE
    return True, None


def _candidate_row(item, rank, now_iso, snapshot, sectors):
    code = str(item["code"])
    return {
        "code": code,
        "name": str(item.get("name") or "").strip(),
        "market": item.get("market"),
        "sector": sectors.get(code),
        "marketCap": item.get("cap"),
        "capRank": rank,
        # 40위 컷이 0.001조 차이로 갈리는 knife-edge라, 나중에 "왜 이 종목이
        # 들어왔나/빠졌나"를 되짚을 수 있게 그때의 시총 원값을 함께 남긴다.
        "capAtSnapshot": item.get("cap"),
        "capAtSnapshotAsOf": snapshot.get("asOf"),
        "tradableStatus": "TRADABLE" if item.get("tradable") is True else "UNKNOWN",
        "instrumentType": item.get("kind"),
        "basis": item.get("basis"),
        "checkedAt": now_iso,
        "sourceSnapshot": snapshot.get("asOf"),
        "eligibilityVerdict": VERDICT_ELIGIBLE,
        "fingerprint": candidate_fingerprint(code),
    }


def build_pool(*, snapshot, covered_codes, sector_map=None, target=DEFAULT_TARGET,
               now=None):
    now_iso = guardian.now_kst_iso(now)
    sector_map = sector_map or {"asOf": None, "source": None, "map": {}}
    sectors = sector_map.get("map") or {}
    target = max(1, min(int(target), TARGET_MAX))

    if not snapshot:
        return {
            "schemaVersion": 1, "generatedAt": now_iso,
            "status": "NO_SNAPSHOT",
            "note": "전체시장 snapshot을 읽지 못해 대기 명단을 만들 수 없다. 추측하지 않는다.",
            "sourceSnapshot": None, "snapshotAgeDays": None,
            "targetRange": [TARGET_MIN, TARGET_MAX], "candidateCount": 0,
            "eligibleCount": 0, "shortfall": True, "excludedCounts": {},
            "marketReserves": {}, "candidates": [],
        }

    age = guardian.snapshot_age_days(snapshot.get("asOf"), now)
    covered = set(covered_codes)
    excluded = {}
    passed = []
    for code, item in (snapshot.get("byCode") or {}).items():
        ok, reason = screen(item, covered, sectors.get(code))
        if not ok:
            excluded[reason] = excluded.get(reason, 0) + 1
            continue
        passed.append(item)

    passed.sort(key=lambda it: (-float(it["cap"]), str(it["code"])))

    candidates = [_candidate_row(item, rank, now_iso, snapshot, sectors)
                  for rank, item in enumerate(passed[:target], start=1)]

    reserves = {}
    for item in passed:
        market = str(item.get("market") or "")
        if not market:
            continue
        bucket = reserves.setdefault(market, [])
        if len(bucket) < MARKET_RESERVE_SIZE:
            bucket.append(_candidate_row(item, len(bucket) + 1, now_iso, snapshot,
                                         sectors))

    shortfall = len(candidates) < TARGET_MIN
    return {
        "schemaVersion": 1,
        "generatedAt": now_iso,
        "status": "SHORTFALL" if shortfall else "READY",
        "note": ("대기 명단일 뿐이다. 여기 있는 종목은 tickers.js에 자동으로 들어가지 "
                 "않는다. 정렬 기준은 시가총액 내림차순 하나뿐이다."),
        "sourceSnapshot": snapshot.get("asOf"),
        "snapshotAgeDays": age,
        "sectorMapAsOf": sector_map.get("asOf"),
        "targetRange": [TARGET_MIN, TARGET_MAX],
        "requestedTarget": target,
        "excludedSectors": sorted(EXCLUDED_SECTORS),
        "requireKnownSector": REQUIRE_KNOWN_SECTOR,
        "eligibleCount": len(passed),
        "candidateCount": len(candidates),
        "shortfall": shortfall,
        "unmappedSectorCount": sum(1 for c in candidates if not c["sector"]),
        "excludedCounts": dict(sorted(excluded.items())),
        "marketReserveSize": MARKET_RESERVE_SIZE,
        "marketReserveNote": ("본문 candidates는 시가총액 순 하나로만 정렬한다. "
                              "아래 marketReserves는 같은 정렬 규칙을 시장별로 따로 "
                              "적용한 예비 명단이며, 교체 제안이 '빠진 종목과 같은 "
                              "시장'에서 고를 때만 쓴다."),
        "marketReserves": reserves,
        "candidates": candidates,
    }


def run(*, snapshot_path=guardian.DEFAULT_SNAPSHOT, tickers_path=guardian.DEFAULT_TICKERS,
        sector_map_path=DEFAULT_SECTOR_MAP, out=DEFAULT_OUT, target=DEFAULT_TARGET,
        write=True, now=None):
    pool = build_pool(
        snapshot=guardian.load_universe_snapshot(snapshot_path),
        covered_codes=guardian.load_configured(tickers_path)["codes"],
        sector_map=load_sector_map(sector_map_path),
        target=target, now=now)
    if write:
        guardian.write_json(out, pool)
    return pool


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Coverage Standby Pool (읽기 전용)")
    p.add_argument("--snapshot", default=guardian.DEFAULT_SNAPSHOT)
    p.add_argument("--tickers", default=guardian.DEFAULT_TICKERS)
    p.add_argument("--sector-map", default=DEFAULT_SECTOR_MAP)
    p.add_argument("--out", default=DEFAULT_OUT)
    p.add_argument("--target", type=int, default=DEFAULT_TARGET)
    p.add_argument("--dry-run", action="store_true")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    pool = run(snapshot_path=args.snapshot, tickers_path=args.tickers,
               sector_map_path=args.sector_map, out=args.out, target=args.target,
               write=not args.dry_run)
    print("[standby] status=%s eligible=%d candidates=%d snapshot=%s (%s일 경과)"
          % (pool["status"], pool["eligibleCount"], pool["candidateCount"],
             pool.get("sourceSnapshot"), pool.get("snapshotAgeDays")))
    print("  탈락 사유별: %s" % json.dumps(pool["excludedCounts"], ensure_ascii=False))
    for c in pool["candidates"][:5]:
        print("  %2d. %s %s (%s) 시총 %.1f조" % (c["capRank"], c["code"], c["name"],
                                                c["market"], (c["marketCap"] or 0) / 1e12))
    return 0


if __name__ == "__main__":
    sys.exit(main())
