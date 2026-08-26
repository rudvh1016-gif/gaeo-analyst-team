# -*- coding: utf-8 -*-
"""Coverage Guardian · Standby · Proposal · GS Reference Lab 계약 테스트.

대표 지시 43개 항목을 고의 실패 시험(negative test) 위주로 검증한다.
핵심 명제는 딱 두 줄이다.
    ① 시세가 몇 개 덜 들어왔다고 Universe(종목집합)가 바뀌지 않는다.
    ② 어떤 경우에도 이 코드가 tickers.js·Production을 자동으로 바꾸지 않는다.

⚠️ CI 러너에는 PyYAML·gs-quant·numpy가 없다.
   워크플로우 검사는 텍스트 파싱으로만 하고, GS 검산은 미설치 상태(N/A 경로)에서도
   통과해야 한다.
"""
import ast
import copy
import datetime
import gzip
import hashlib
import json
import math
import os
import re
import shutil
import sys
import tempfile
import tokenize
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import coverage_version                                   # noqa: E402
from gaeo_coverage import guardian, proposal, standby      # noqa: E402
from gaeo_reference import gs_reference                    # noqa: E402
from gaeo_evolution import notification                    # noqa: E402

KST = guardian.KST
NOW = datetime.datetime(2026, 8, 25, 9, 0, tzinfo=KST)

# 실제 저장소 파일 — 이 테스트가 도는 동안 단 1바이트도 바뀌면 안 되는 것들.
PRODUCTION_FILES = [
    "tickers.js", "data.js", "auto_analysis.js", "coverage_version.py",
    "analyze_auto.py", "compute_indicators.py", "history.js", "team_weights.js",
    "gaeo_evolution/production_config.json",
    "gaeo_evolution/evolution_constitution.json",
]


def sha(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def repo_fingerprints():
    return {p: sha(os.path.join(HERE, p)) for p in PRODUCTION_FILES
            if os.path.exists(os.path.join(HERE, p))}


# ── 가짜 저장소 만들기 ───────────────────────────────────────────────────────
def synth_codes(n, start=1):
    """끝자리 0인 6자리 코드 n개(보통주 코드 규칙에 맞춘 합성값)."""
    return ["%06d" % ((i + start) * 10) for i in range(n)]


def write_tickers(path, codes, names=None):
    names = names or {}
    rows = [{"code": c, "name": names.get(c, "종목%s" % c), "sector": "테스트업종"}
            for c in codes]
    with open(path, "w", encoding="utf-8") as f:
        f.write("// 테스트 픽스처\nconst TICKERS = %s;\n"
                % json.dumps(rows, ensure_ascii=False))


def write_data_js(path, codes, stale=()):
    stocks = {}
    for c in codes:
        row = {"name": "종목%s" % c, "price": 1000, "rate": 0.1}
        if c in stale:
            row["stale"] = True
        stocks[c] = row
    doc = {"date": "2026-08-25 종가", "stocks": stocks}
    with open(path, "w", encoding="utf-8") as f:
        f.write("const LIVE_DATA = %s;\n" % json.dumps(doc, ensure_ascii=False))


def write_auto_js(path, codes):
    doc = {"generatedAt": "2026-08-25 16:13",
           "coverageUniverseVersion": coverage_version.current_version(),
           "coverageUniverseSize": coverage_version.CURRENT["size"],
           "stocks": {c: {"chief": {"call": "HOLD"}} for c in codes}}
    with open(path, "w", encoding="utf-8") as f:
        f.write("const LIVE_AUTO = %s;\n" % json.dumps(doc, ensure_ascii=False))


def snap_item(code, **kw):
    item = {"code": code, "name": "종목%s" % code, "market": "KOSPI",
            "kind": "COMMON", "basis": "source_stockEndType", "tradable": True,
            "rate": 0.5, "close": 1000.0, "cap": 1.0e12, "tval": 1.0e9}
    item.update(kw)
    return item


def write_snapshot(path, items, as_of, pad_to=None):
    """전체시장 snapshot 픽스처.

    pad_to=None 이면 기본값(실제와 비슷한 크기)으로 채운다. '잘린 snapshot' 자체를
    시험할 때만 pad_to=0을 줘서 준 항목만 쓴다.
    """
    items = list(items)
    if pad_to is None:
        pad_to = REALISTIC_SNAPSHOT_COUNT
    need = max(0, pad_to - len(items)) if pad_to else 0
    doc = {"schemaVersion": 1, "asOf": as_of, "kstDay": as_of[:10],
           "source": "test", "rawCount": len(items) + need, "items": items}
    text = json.dumps(doc, ensure_ascii=False)
    if need:
        # 채움 종목은 매번 같다. guard_days()가 하루마다 snapshot을 다시 쓰기
        # 때문에 3,000개를 매번 직렬화하면 테스트 전체가 몇 배 느려진다.
        # 직렬화 결과를 캐시해서 문자열로 이어 붙인다.
        frag = _FILLER_JSON_CACHE.get(need)
        if frag is None:
            frag = json.dumps(snapshot_filler_items([i["code"] for i in items], need),
                              ensure_ascii=False)[1:-1]
            _FILLER_JSON_CACHE[need] = frag
        assert text.endswith("]}"), text[-20:]
        text = text[:-2] + ("," if items else "") + frag + "]}"
    # compresslevel=1 — 픽스처는 하루마다 다시 쓰므로 압축률보다 속도가 중요하다
    with gzip.open(path, "wt", encoding="utf-8", compresslevel=1) as f:
        f.write(text)


# 테스트용 기본 업종 — 실제 KRX 업종명 표기를 그대로 쓴다(정상 제조업 / 집합투자기구).
NORMAL_SECTOR = "전자부품 제조업"
FUND_SECTOR = "신탁업 및 집합투자업"


def write_sector_map(path, codes, sector=None):
    doc = {"schemaVersion": "gaeo_sector_map_v1", "asOf": NOW.isoformat(),
           "source": "test", "corpCount": len(codes),
           "map": {c: (sector or NORMAL_SECTOR) for c in codes}}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)


# 독립 소스(KRX 상장법인목록) 픽스처 — source 표기가 실제 검증 대상이다.
KRX_SOURCE = "krx_corplist (kind.krx.co.kr 상장법인목록 공식 업종 컬럼)"


# 실제 KRX 상장법인목록은 2,596법인이다(market_universe/sector_map.json 실측,
# 2026-08-16). 픽스처가 600건짜리 원장을 쓰면 guardian.KRX_CORPLIST_MIN_COUNT
# ("잘린 원장은 부재의 근거가 될 수 없다") 가드에 먼저 걸려, 정작 보려던 시나리오
# (나이·출처·상폐 판정)를 한 줄도 못 밟는다. 그래서 Universe 코드와 절대 겹치지
# 않는 채움 코드로 실제와 비슷한 크기를 만들어 둔다.
REALISTIC_KRX_CORP_COUNT = 2596
# 채움 코드 시작점 — synth_codes(n)은 n*10까지만 만들고 OUTSIDE_ITEMS는 900010부터라
# 100000번대는 어느 픽스처와도 겹치지 않는다.
KRX_FILLER_START = 100000


def krx_filler_codes(exclude, n):
    """원장 크기를 채우기만 하는 무관한 법인 코드 n개."""
    out, i, ex = [], 0, set(exclude)
    while len(out) < n:
        code = "%06d" % (KRX_FILLER_START + i * 10)
        i += 1
        if code not in ex:
            out.append(code)
    return out


def write_krx_corplist(path, codes, as_of=None, source=KRX_SOURCE,
                       pad_to=REALISTIC_KRX_CORP_COUNT, gate="GATE_PASS"):
    """독립 소스(KRX 상장법인목록) 픽스처.

    pad_to=None 이면 준 코드 그대로 쓴다 — "원장이 잘렸다/비었다" 자체를 시험할 때만
    그렇게 쓴다.
    """
    codes = list(codes)
    if pad_to and len(codes) < pad_to:
        codes = codes + krx_filler_codes(codes, pad_to - len(codes))
    doc = {"schemaVersion": "gaeo_sector_map_v1",
           "asOf": (as_of or NOW).isoformat() if hasattr(as_of or NOW, "isoformat")
                   else str(as_of),
           "source": source, "corpCount": len(codes),
           "crosswalkCoverage": {"gate": gate},
           "map": {c: NORMAL_SECTOR for c in codes}}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)


def write_market_map(path, codes, market="KOSPI"):
    doc = {"updated": NOW.date().isoformat(),
           "items": [{"c": c, "n": "종목%s" % c, "m": market} for c in codes]}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)


# Universe(tickers.js) 밖에 있는 정상 보통주 — 대기 명단 후보가 될 수 있는 종목들
OUTSIDE_ITEMS = [snap_item("%06d" % (900000 + i * 10), cap=1e12 - i)
                 for i in range(1, 6)]

# 실제 전체시장 snapshot은 3,922종목이다. 픽스처가 600종목짜리 snapshot을 쓰면
# guardian.SNAPSHOT_MIN_ITEM_COUNT("잘린 자료의 '없음'은 부재의 근거가 아니다")
# 가드에 먼저 걸려, 정작 보려던 시나리오를 한 줄도 못 밟는다. 그래서 Universe·
# OUTSIDE_ITEMS와 겹치지 않는 아주 작은 종목으로 실제와 비슷한 크기를 만든다.
# (시총을 작게 두어야 검사 대상 종목의 순위가 픽스처마다 흔들리지 않는다.)
# 실제는 3,922종목이지만 픽스처는 가드 기준(guardian.SNAPSHOT_MIN_ITEM_COUNT=3000)
# 바로 위까지만 채운다. guard_days()가 하루마다 snapshot을 다시 쓰기 때문에 실제
# 크기를 그대로 쓰면 테스트가 10배 느려진다. 가드를 밟는 데 필요한 만큼만 채운다.
REALISTIC_SNAPSHOT_COUNT = 3005
SNAPSHOT_FILLER_START = 200000
_FILLER_CACHE = None
_FILLER_JSON_CACHE = {}


def snapshot_filler_items(exclude, n):
    """순위·자격에 영향을 주지 않는 아주 작은 채움 종목 n개(생성 결과는 캐시)."""
    global _FILLER_CACHE
    if _FILLER_CACHE is None:
        _FILLER_CACHE = [snap_item("%06d" % (SNAPSHOT_FILLER_START + i * 10),
                                   cap=1.0e7 - i) for i in range(4500)]
    ex = set(exclude)
    picked = [it for it in _FILLER_CACHE if it["code"] not in ex][:n]
    assert len(picked) == n, "채움 종목이 모자란다"
    return picked


def write_universe_state(path, status="READY", as_of=None):
    doc = {"status": status,
           "asOf": (as_of or NOW).isoformat(),
           "kstDay": str((as_of or NOW).date()),
           "rawCount": REALISTIC_SNAPSHOT_COUNT}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)


class Fixture:
    """임시 디렉터리에 tickers/data/auto/snapshot 한 벌을 만든다."""

    def __init__(self, tmp):
        self.tmp = tmp
        self.tickers = os.path.join(tmp, "tickers.js")
        self.data = os.path.join(tmp, "data.js")
        self.auto = os.path.join(tmp, "auto_analysis.js")
        self.snapshot = os.path.join(tmp, "full_market_latest.json.gz")
        self.sector_map = os.path.join(tmp, "sector_map.json")
        self.krx = os.path.join(tmp, "krx_corplist.json")
        self.market_map = os.path.join(tmp, "krx_list.json")
        self.universe_state = os.path.join(tmp, "state.json")
        self.snapshot_items = None      # refresh_sources가 다시 쓸 원본
        self.snapshot_pad = None        # 0으로 두면 '잘린 snapshot'을 그대로 쓴다
        self.krx_listed = []
        self.observations = os.path.join(tmp, "observations.json")
        self.report = os.path.join(tmp, "coverage_state.json")
        self.standby = os.path.join(tmp, "standby_pool.json")
        self.proposal = os.path.join(tmp, "replacement_proposal.json")

    def guard(self, now=NOW):
        return guardian.run(tickers_path=self.tickers, data_js_path=self.data,
                            auto_js_path=self.auto, snapshot_path=self.snapshot,
                            universe_state_path=self.universe_state,
                            krx_corplist_path=self.krx, market_map_path=self.market_map,
                            observations_path=self.observations,
                            report_out=self.report, write=True, now=now)

    def refresh_sources(self, now, refresh_krx=True):
        """운영과 같게 snapshot·독립 소스를 '그 시점 기준'으로 다시 수집한 것처럼 만든다.

        (실제 러너는 매 사이클 새로 수집한다. 픽스처가 한 번 쓴 파일을 그대로 두면
         날짜를 넘길 때마다 자료가 낡아 UNKNOWN이 되어 시나리오를 못 만든다.)
        """
        if self.snapshot_items is None:
            return
        write_snapshot(self.snapshot, self.snapshot_items,
                       (now - datetime.timedelta(hours=6)).isoformat(),
                       pad_to=self.snapshot_pad)
        if refresh_krx:
            write_krx_corplist(self.krx, self.krx_listed,
                               as_of=now - datetime.timedelta(hours=6))

    def guard_days(self, days, start=NOW, per_day=1, refresh=True,
                   refresh_krx=True):
        """서로 다른 날짜로 days일 동안 관측한다(하루 per_day회 실행).

        '실행 횟수'가 아니라 '날짜'로 세는지 확인하기 위한 헬퍼다.
        """
        report = None
        # snapshot을 하루도 빠짐없이 다시 쓸 필요는 없다. 상폐 판정이 요구하는
        # 신선도는 SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING(3일)이므로 그 주기로만
        # 갱신해도 판정 결과가 같고, 마지막 날은 반드시 갱신한다.
        # (매일 다시 쓰면 3,000종목 gzip을 수백 번 만들어 테스트가 몇 배 느려진다.)
        every = max(1, guardian.SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING)
        for d in range(days):
            for k in range(per_day):
                now = start + datetime.timedelta(days=d, minutes=5 * k)
                if refresh and k == 0 and (d % every == 0 or d == days - 1):
                    self.refresh_sources(now, refresh_krx=refresh_krx)
                report = self.guard(now=now)
        return report

    def leave_market(self, codes, keep_in_krx=False):
        """그 종목이 전체시장 snapshot에서(그리고 보통은 독립 원장에서도) 사라지게 한다.

        실제 상장폐지의 모습이다 — 그 전까지는 시장에 살아 있었다.
        keep_in_krx=True 는 "우리 snapshot에서만 사라지고 KRX 원장에는 그대로"인
        경우(= 우리 수집 문제)를 만든다.
        """
        gone = set(codes)
        self.snapshot_items = [i for i in (self.snapshot_items or [])
                               if i["code"] not in gone]
        if not keep_in_krx:
            self.krx_listed = [c for c in self.krx_listed if c not in gone]

    def pool(self, now=NOW, target=standby.DEFAULT_TARGET):
        return standby.run(snapshot_path=self.snapshot, tickers_path=self.tickers,
                           sector_map_path=self.sector_map,
                           out=self.standby, target=target, write=True, now=now)

    def propose(self, now=NOW):
        return proposal.run(coverage_path=self.report, standby_path=self.standby,
                            out=self.proposal, write=True, now=now)


def make_fixture(tmp, *, configured=600, missing=(), stale=(), snapshot_as_of=None,
                 snapshot_overrides=None, extra_snapshot_items=(),
                 drop_from_snapshot=(), krx_listed=None, krx_delisted=(),
                 krx_as_of=None, default_cap=None):
    """configured개 종목 Universe + 그중 missing만 시세에서 빠진 상태."""
    fx = Fixture(tmp)
    codes = synth_codes(configured)
    write_tickers(fx.tickers, codes)
    live = [c for c in codes if c not in set(missing)]
    write_data_js(fx.data, live, stale=stale)
    write_auto_js(fx.auto, live)

    overrides = snapshot_overrides or {}
    dropped = set(drop_from_snapshot)
    base = {} if default_cap is None else {"cap": default_cap}
    items = [snap_item(c, **dict(base, **overrides.get(c, {})))
             for c in codes if c not in dropped]
    items += list(extra_snapshot_items)
    write_snapshot(fx.snapshot, items,
                   snapshot_as_of or (NOW - datetime.timedelta(hours=6)).isoformat())
    write_sector_map(fx.sector_map, [i["code"] for i in items])
    write_universe_state(fx.universe_state)
    # 독립 소스에는 기본적으로 Universe 전체가 '상장 중'으로 들어 있다.
    # 상폐 시나리오는 krx_listed 인자로 명시적으로 빼야 한다.
    if krx_listed is not None:
        listed = list(krx_listed)
    else:
        # 독립 소스(KRX 상장법인목록)는 krx_delisted로 지정한 종목만 빠진 원장이다.
        # (빈 목록은 '수집 실패'와 구분되지 않으므로 시나리오로 쓰지 않는다.)
        gone = set(krx_delisted)
        listed = [c for c in codes if c not in gone]
    write_krx_corplist(fx.krx, listed, as_of=krx_as_of or NOW)
    write_market_map(fx.market_map, codes)
    fx.snapshot_items = items
    fx.krx_listed = listed
    return fx, codes


# 시가총액 크기 — 대형주 가드(상위 300위) 안/밖을 확실히 가르는 값.
SMALL_CAP = 1.0e8            # 600종목 중 꼴찌 → 순위·절대크기 둘 다 가드 밖
MEGA_CAP = 9.9e14            # 1위 + 절대 하한 위 → 두 가드 모두에 걸린다
# 순위 가드만 따로 시험하기 위한 크기 — 순위는 1위지만 절대 하한(1조)보다 작다.
# (두 가드가 겹쳐 있으면 하나를 꺼도 다른 하나가 막아서 뮤테이션이 무의미해진다)
RANK_ONLY_CAP = 6.0e11       # 0.6조
RANK_ONLY_BASE_CAP = 5.0e11  # 나머지 종목 0.5조


def live_then_delisted(tmp, *, code="000010", cap=SMALL_CAP, alive_days=6,
                       after_days=16, keep_in_krx=False, extra_snapshot_items=(),
                       **kw):
    """진짜 상장폐지가 일어나는 실제 순서를 그대로 만든다.

    ① 우리 시세만 안 들어오는 구간 — 그 종목은 아직 전체시장 snapshot에 살아 있다.
       Guardian은 이 구간에 그 종목의 시가총액 순위를 기억해 둔다(capMemory).
    ② 전체시장 snapshot에서, 그리고 독립 원장(KRX 상장법인목록)에서도 사라지는 구간.

    ⚠️ 처음부터 snapshot에 없는 픽스처(drop_from_snapshot)는 "그 종목이 살아 있는
       모습을 우리가 한 번도 본 적이 없다"는 뜻이다. 그러면 크기를 알 수 없고,
       크기를 모르는 종목은 설계상 상폐로 확정하지 않는다(REVIEW_REQUIRED).
       그러니 상폐 경로를 시험하려면 반드시 ①구간이 있어야 한다.
    """
    fx, codes = make_fixture(tmp, missing=(code,),
                             snapshot_overrides={code: {"cap": cap}},
                             extra_snapshot_items=extra_snapshot_items, **kw)
    fx.guard_days(alive_days)
    fx.leave_market([code], keep_in_krx=keep_in_krx)
    rep = fx.guard_days(after_days,
                        start=NOW + datetime.timedelta(days=alive_days))
    return fx, rep


# ═══════════════════════════════════════════════════════════════════════════
# 1~7. Coverage Guardian — 4개 숫자 · 원인 분류 · 교체 금지
# ═══════════════════════════════════════════════════════════════════════════
class GuardianCoreTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp, True)

    def test_01_configured600_fresh598_membership_unchanged(self):
        """① 시세 598 · 설정 600 → Universe는 여전히 600이고 membership 변화 0."""
        codes_missing = ("000010", "000020")
        fx, codes = make_fixture(self.tmp, missing=codes_missing)
        before = sha(fx.tickers)
        rep = fx.guard()
        self.assertEqual(rep["targetCoverage"], 600)
        self.assertEqual(rep["configuredCoverage"], 600)
        self.assertEqual(rep["freshPriceCoverage"], 598)
        self.assertEqual(rep["autoAnalysisCoverage"], 598)
        self.assertEqual(sorted(rep["missingPriceCodes"]), sorted(codes_missing))
        # 파일도 종목집합도 그대로다
        self.assertEqual(before, sha(fx.tickers))
        self.assertEqual(len(guardian.load_configured(fx.tickers)["codes"]), 600)
        self.assertEqual(rep["replaceableCount"], 0)
        # "598로 줄었다"고 쓰지 않는다
        self.assertIn("configuredCoverage가 Universe 크기다", rep["universeNote"])

    def test_01b_four_numbers_have_distinct_names(self):
        keys = ("targetCoverage", "configuredCoverage", "freshPriceCoverage",
                "autoAnalysisCoverage")
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        rep = fx.guard()
        for k in keys:
            self.assertIn(k, rep)
        self.assertEqual(len(set(keys)), 4)

    def test_01c_stale_price_is_not_fresh(self):
        fx, _ = make_fixture(self.tmp, stale=("000030",))
        rep = fx.guard()
        self.assertEqual(rep["freshPriceCoverage"], 599)
        self.assertEqual(rep["stalePriceCount"], 1)
        self.assertIn("000030", rep["missingPriceCodes"])

    def test_02_recovered_next_cycle_zero_replacement(self):
        """② 다음 cycle에 600이 회복되면 교체 0 · 회복 기록만 남는다."""
        fx, codes = make_fixture(self.tmp, missing=("000010",))
        fx.guard()
        fx.guard(now=NOW + datetime.timedelta(days=7))
        # 회복: 전 종목 시세 복구
        write_data_js(fx.data, codes)
        write_auto_js(fx.auto, codes)
        rep = fx.guard(now=NOW + datetime.timedelta(days=14))
        self.assertEqual(rep["missingPriceCodes"], [])
        self.assertEqual(rep["status"], guardian.STATUS_PASS)
        self.assertEqual(rep["replaceableCount"], 0)
        self.assertTrue(any(r["code"] == "000010" for r in rep["recoveries"]))
        obs = guardian.load_observations(fx.observations)
        self.assertNotIn("000010", obs["codes"])
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_03_api_timeout_style_bulk_failure_zero_replacement(self):
        """③ 수집 API 타임아웃처럼 여러 종목이 한꺼번에 빠져도 교체 0."""
        missing = synth_codes(12)
        fx, _ = make_fixture(self.tmp, missing=missing)
        rep = fx.guard()
        self.assertEqual(len(rep["missingPriceCodes"]), 12)
        for f in rep["findings"]:
            self.assertEqual(f["cause"], guardian.TEMP_DATA_FAILURE)
            self.assertFalse(f["replaceable"])
        self.assertEqual(rep["replaceableCount"], 0)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_04_suspended_stock_zero_replacement(self):
        """④ 거래정지는 상장 유지다 — 교체 대상이 아니다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"tradable": False}})
        for _ in range(5):          # 몇 번을 관측해도 결론이 바뀌지 않는다
            rep = fx.guard()
        f = rep["findings"][0]
        self.assertEqual(f["cause"], guardian.LISTED_BUT_SUSPENDED)
        self.assertFalse(f["replaceable"])
        self.assertEqual(rep["replaceableCount"], 0)

    def test_04b_name_change_is_corporate_event_not_delisting(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"name": "새이름홀딩스"}})
        rep = fx.guard()
        self.assertEqual(rep["findings"][0]["cause"], guardian.CORPORATE_EVENT)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_04c_persistent_missing_but_listed_is_pipeline_bug_not_delisting(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        rep = fx.guard_days(20)
        self.assertEqual(rep["findings"][0]["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)
        self.assertEqual(rep["status"], guardian.STATUS_RED)

    def test_05_unknown_zero_replacement(self):
        """⑤ snapshot이 오래됐으면 '없다'는 사실만으로 상폐로 올리지 않는다."""
        old = (NOW - datetime.timedelta(days=30)).isoformat()
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), snapshot_as_of=old,
                             krx_delisted=("000010",))
        rep = fx.guard_days(20, refresh=False)   # snapshot이 낡은 채로 유지되는 상황
        f = rep["findings"][0]
        self.assertEqual(f["cause"], guardian.UNKNOWN)
        self.assertFalse(f["replaceable"])
        self.assertTrue(any("오래됐거나" in e for e in f["evidence"]))
        self.assertFalse(rep["snapshot"]["freshEnoughForDelisting"])

    def test_05b_missing_snapshot_is_unknown(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        os.remove(fx.snapshot)
        rep = fx.guard()
        self.assertEqual(rep["findings"][0]["cause"], guardian.UNKNOWN)
        self.assertFalse(rep["snapshot"]["available"])

    def test_05c_fresh_snapshot_but_single_observation_is_unknown(self):
        """한 번 빠졌다고 상폐로 판정하지 않는다(지속 누락 요건)."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), krx_delisted=("000010",))
        rep = fx.guard()
        self.assertEqual(rep["findings"][0]["cause"], guardian.UNKNOWN)
        self.assertEqual(rep["findings"][0]["missingDayCount"], 1)
        self.assertEqual(rep["findings"][0]["elapsedTradingDays"], 0)

    # ── 2026-08-25 독립 감사 CRITICAL 회귀 방지 ────────────────────────────
    # 감사자가 재현한 공격: snapshot asOf만 최근으로 바꾼 사본 + 5분 간격 3회 실행.
    # 그것만으로 DELISTED_CONFIRMED와 교체 제안서가 나왔다. 아래 테스트들은 그 경로가
    # 전부 막혔는지, 그러면서도 '진짜 상폐'는 여전히 처리되는지 둘 다 확인한다.

    def test_06a_rapid_reruns_cannot_confirm_delisting(self):
        """⭐ 몇 시간 안에 여러 번 돌려도 상폐로 확정되지 않는다(감사 재현 시나리오)."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), krx_delisted=("000010",))
        for i in range(12):          # 5분 간격 12회 = 1시간
            rep = fx.guard(now=NOW + datetime.timedelta(minutes=5 * i))
        self.assertNotEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        self.assertEqual(rep["findings"][0]["cause"], guardian.UNKNOWN)
        self.assertEqual(rep["replaceableCount"], 0)
        # 같은 날 12번을 돌려도 '관측 1일'이다
        self.assertEqual(rep["findings"][0]["missingDayCount"], 1)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_06b_same_day_repeats_count_as_one_day(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), krx_delisted=("000010",))
        rep = fx.guard_days(2, per_day=8)
        self.assertEqual(rep["findings"][0]["missingDayCount"], 2)

    def test_06c_day_count_alone_is_not_enough_without_elapsed_trading_days(self):
        """날짜 수만 채우고 경과 거래일이 모자라면 확정되지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), krx_delisted=("000010",))
        rep = fx.guard_days(guardian.PERSISTENT_MISSING_MIN_DAYS)
        self.assertGreaterEqual(rep["findings"][0]["missingDayCount"],
                                guardian.PERSISTENT_MISSING_MIN_DAYS)
        self.assertLess(rep["findings"][0]["elapsedTradingDays"],
                        guardian.MIN_ELAPSED_TRADING_DAYS)
        self.assertEqual(rep["findings"][0]["cause"], guardian.UNKNOWN)

    def test_06d_independent_source_is_required(self):
        """독립 소스를 못 읽으면 상폐로 확정하지 않고 판단을 보류한다.

        ⚠️ 앞부분에서 일부러 '상폐가 확정되는 상태'를 먼저 만든다. 그래야 뒤에서
           바뀌는 유일한 조건이 '독립 원장을 못 읽는다'는 것뿐이 되어, 이 테스트가
           그 조건을 실제로 시험한다고 말할 수 있다.
        """
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        os.remove(fx.krx)                      # 독립 원장을 못 읽는 상태로 만든다
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)
        self.assertEqual(rep["replaceableCount"], 0)
        # 숨기지 않는다 — 보고서에 따로 세어 둔다
        self.assertEqual(rep["attentionCount"], 1)

    def test_06e_vendor_derived_source_is_rejected_as_evidence(self):
        """출처가 네이버 계열이면 독립 증거로 인정하지 않는다.

        전체시장 snapshot도 네이버에서 온다. 같은 벤더의 자료 두 개는 서로를
        검증해 주지 못하므로 '증거 2개'가 아니라 '증거 1개'다.
        """
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        # 내용은 그대로 두고 출처 표기만 벤더로 바꾼다
        write_krx_corplist(fx.krx, fx.krx_listed,
                           as_of=NOW + datetime.timedelta(days=21),
                           source="naver marketValue bulk")
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)
        self.assertIsNone(guardian.load_krx_corplist(fx.krx))

    def test_06f_stale_independent_source_is_rejected(self):
        """독립 원장을 믿을 수 없으면 상폐로 확정하지 않는다.

        ⚠️ 이 테스트는 '나이 가드'에 도달하기 전에 더 앞선 분기(원장이 부재 시작보다
           먼저 수집됨)에서 막힌다. 나이 가드(KRX_CORPLIST_MAX_AGE_DAYS) 자체를
           잠그는 것은 test_low1_m11이다(2026-08-26 독립 QA 감사 지적).
        """
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        write_krx_corplist(fx.krx, fx.krx_listed,
                           as_of=NOW - datetime.timedelta(days=60))
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)

    def test_06g_independent_source_saying_listed_means_pipeline_bug(self):
        """네이버 쪽에서 사라져도 KRX 원장이 '상장 중'이라 하면 우리 문제다."""
        fx, rep = live_then_delisted(self.tmp, keep_in_krx=True)
        self.assertEqual(rep["findings"][0]["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_06h_mass_missing_blocks_delisting(self):
        """한 사이클에 여러 종목이 동시에 빠지면 벤더 장애로 본다."""
        missing = synth_codes(guardian.MASS_MISSING_DELISTING_BLOCK)
        fx, _ = make_fixture(self.tmp, missing=missing,
                             drop_from_snapshot=missing, krx_delisted=missing)
        rep = fx.guard_days(20)
        self.assertTrue(rep["massMissingBlockActive"])
        for f in rep["findings"]:
            self.assertEqual(f["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_06i_mega_cap_can_never_be_delisted(self):
        """⭐ 시가총액 상위 종목은 상폐 판정 자체가 금지된다.

        핵심은 "사라진 뒤에도 크기를 알 수 있는가"다. 사라진 종목의 순위는 현재
        snapshot에서 구할 수 없으므로, 살아 있을 때 기억해 둔 순위(capMemory)로
        판정해야 한다. 예전 이 테스트는 종목을 snapshot에 그대로 남겨 둔 채
        확인해서, 가드가 죽어 있어도 통과하는 가짜 테스트였다.
        (2026-08-25 퀀트 재감사 CRITICAL-2)
        """
        fx, rep = live_then_delisted(self.tmp, cap=MEGA_CAP)
        f = rep["findings"][0]
        self.assertIsNone(f["capRank"])                    # 지금 snapshot엔 없다
        self.assertEqual(f["lastKnownCapRank"], 1)         # 살아 있을 때 기억한 값
        self.assertEqual(f["cause"], guardian.PIPELINE_BUG)
        self.assertLessEqual(f["lastKnownCapRank"], guardian.MEGA_CAP_RANK_GUARD)
        self.assertEqual(rep["replaceableCount"], 0)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_06i2_mega_cap_guard_is_live_code_not_decoration(self):
        """⭐ 뮤테이션 검증 — 가드 상수를 0으로 낮추면 같은 시나리오 결과가 바뀐다.

        결과가 그대로면 가드는 아무 일도 하지 않는 죽은 코드라는 뜻이다.
        위 test_06i가 다시 가짜 테스트가 되는 것을 이 테스트가 막는다.
        """
        # 절대 시총 하한 가드와 겹치지 않는 크기를 쓴다 — 순위는 1위지만 0.6조라
        # 절대 하한(1조) 아래다. 그래야 '순위 가드'만 껐을 때 결과가 바뀐다.
        real = guardian.MEGA_CAP_RANK_GUARD
        self.addCleanup(setattr, guardian, "MEGA_CAP_RANK_GUARD", real)

        _, blocked = live_then_delisted(self.tmp, cap=RANK_ONLY_CAP,
                                        default_cap=RANK_ONLY_BASE_CAP)
        self.assertEqual(blocked["findings"][0]["safestKnownCapRank"], 1)
        self.assertEqual(blocked["findings"][0]["cause"], guardian.PIPELINE_BUG)

        guardian.MEGA_CAP_RANK_GUARD = 0
        tmp2 = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp2, True)
        _, rep = live_then_delisted(tmp2, cap=RANK_ONLY_CAP,
                                    default_cap=RANK_ONLY_BASE_CAP)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_06i4_absolute_cap_floor_is_live_code(self):
        """⭐ 뮤테이션 — 절대 시총 하한을 무한대로 올리면 큰 회사가 상폐로 바뀐다.

        순위 가드는 경계가 칼날처럼 좁다(실측 300위 1.612조 / 301위 1.610조).
        절대 크기 가드는 그 바로 밖에 있는 회사를 받치는 두 번째 그물이다.
        """
        real_floor = guardian.MEGA_CAP_ABS_FLOOR
        real_rank = guardian.MEGA_CAP_RANK_GUARD
        self.addCleanup(setattr, guardian, "MEGA_CAP_ABS_FLOOR", real_floor)
        self.addCleanup(setattr, guardian, "MEGA_CAP_RANK_GUARD", real_rank)

        # 순위 가드는 꺼 두고(=순위로는 안 걸리는 상황) 절대 크기만 남긴다
        guardian.MEGA_CAP_RANK_GUARD = 0
        _, blocked = live_then_delisted(self.tmp, cap=MEGA_CAP)
        self.assertEqual(blocked["findings"][0]["cause"], guardian.PIPELINE_BUG)

        guardian.MEGA_CAP_ABS_FLOOR = float("inf")
        tmp2 = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp2, True)
        _, rep = live_then_delisted(tmp2, cap=MEGA_CAP)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_06i3_size_unknown_is_never_delisting(self):
        """살아 있는 모습을 한 번도 못 본 종목은 크기를 몰라 상폐로 확정하지 않는다.

        크기를 모르면 대형주 가드를 적용할 수 없다. 가드를 적용할 수 없는 종목을
        상폐로 확정하면 대형주 오판을 막을 방법이 없어진다(fail-closed).
        """
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",),
                             krx_delisted=("000010",))
        rep = fx.guard_days(20)
        f = rep["findings"][0]
        self.assertIsNone(f["capRank"])
        self.assertIsNone(f["lastKnownCapRank"])
        self.assertEqual(f["cause"], guardian.REVIEW_REQUIRED)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_06j_class_share_absence_is_review_not_delisting(self):
        """종류주가 섞여 있어도 교체 대상이 되지 않는다.

        ⚠️ 이 픽스처의 종류주는 snapshot에 한 번도 없어서 '크기 불명' 분기에서
           먼저 멈춘다. 종류주 코드 규칙 가드 자체를 잠그는 것은
           test_low1_m13이다(2026-08-26 독립 QA 감사 지적).
        """
        fx, codes = make_fixture(self.tmp, configured=600)
        # 우선주 코드를 하나 끼워 넣는다
        codes2 = list(codes[:-1]) + ["005935"]
        write_tickers(fx.tickers, codes2)
        write_data_js(fx.data, [c for c in codes2 if c != "005935"])
        write_auto_js(fx.auto, [c for c in codes2 if c != "005935"])
        items = [snap_item(c) for c in codes2 if c != "005935"]
        write_snapshot(fx.snapshot, items,
                       (NOW - datetime.timedelta(hours=6)).isoformat())
        fx.snapshot_items = items
        fx.krx_listed = [c for c in codes2 if c != "005935"]
        write_krx_corplist(fx.krx, fx.krx_listed)
        rep = fx.guard_days(20)
        f = [x for x in rep["findings"] if x["code"] == "005935"][0]
        self.assertEqual(f["cause"], guardian.REVIEW_REQUIRED)

    def test_06k_genuine_delisting_still_works(self):
        """⭐ 기능이 죽으면 안 된다 — 진짜 상폐는 여전히 확정되고 제안까지 간다."""
        fx, rep = live_then_delisted(self.tmp,
                                     extra_snapshot_items=OUTSIDE_ITEMS)
        f = rep["findings"][0]
        self.assertGreater(f["lastKnownCapRank"], guardian.MEGA_CAP_RANK_GUARD)
        self.assertEqual(f["cause"], guardian.DELISTED_CONFIRMED)
        self.assertGreaterEqual(f["missingDayCount"],
                                guardian.PERSISTENT_MISSING_MIN_DAYS)
        self.assertGreaterEqual(f["elapsedTradingDays"],
                                guardian.MIN_ELAPSED_TRADING_DAYS)
        self.assertEqual(rep["replaceableCount"], 1)
        self.assertEqual(rep["status"], guardian.STATUS_RED)   # WARN에 묻히지 않는다
        fx.pool()
        doc = fx.propose()
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        self.assertEqual(doc["expectedConfiguredCoverage"], 600)

    def test_07_confirmed_delisting_never_touches_tickers_or_main(self):
        """⑦ 확정 상폐라도 tickers.js·Coverage Version은 그대로다."""
        before_file_pre = sha(os.path.join(HERE, "tickers.js"))
        fx, rep = live_then_delisted(self.tmp,
                                     extra_snapshot_items=OUTSIDE_ITEMS)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        before_file = sha(fx.tickers)
        before_history = copy.deepcopy(coverage_version.COVERAGE_HISTORY)
        repo_before = repo_fingerprints()
        fx.pool()
        _ = before_file_pre
        doc = fx.propose()
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        self.assertFalse(doc["appliedToTickers"])
        self.assertFalse(doc["autoApplyPath"])
        self.assertTrue(doc["approvalRequired"])
        self.assertIsNone(doc["approvedBy"])
        self.assertEqual(before_file, sha(fx.tickers))
        self.assertEqual(before_history, coverage_version.COVERAGE_HISTORY)
        self.assertEqual(repo_before, repo_fingerprints())

    def test_06l_empty_independent_source_is_not_evidence(self):
        """빈 목록은 '전부 상장폐지'가 아니라 '수집 실패'다."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        path = os.path.join(tmp, "empty.json")
        write_krx_corplist(path, [], pad_to=None)
        self.assertIsNone(guardian.load_krx_corplist(path))

    def test_06m_independent_source_older_than_first_missing_is_rejected(self):
        """우리가 못 받기 시작한 시점보다 먼저 수집된 자료는 독립 증거가 아니다."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        path = os.path.join(tmp, "krx.json")
        write_krx_corplist(path, ["000020", "000030"],
                           as_of=NOW - datetime.timedelta(days=5))
        krx = guardian.load_krx_corplist(path)
        obs = {"firstMissingAt": (NOW - datetime.timedelta(days=1)).isoformat()}
        usable, why = guardian.krx_evidence(krx, obs, NOW)
        self.assertFalse(usable)
        self.assertIn("먼저 수집된", why)

    def test_06p_truncated_independent_source_is_not_evidence(self):
        """⭐ 잘린 원장은 "그 종목이 없다"의 근거가 될 수 없다.

        상류(probe_sector_source.py)는 유효한 6자리 코드가 1개만 있어도
        status="OK"로 보고 맵을 덮어쓴다. KRX 응답이 잘리면 3건짜리 원장이 그대로
        저장될 수 있고, 그러면 우리 600종목 대부분이 '원장에 없음'이 되어 대량
        오판이 난다. (2026-08-25 퀀트 재감사 HIGH-2)
        """
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        path = os.path.join(tmp, "krx.json")
        write_krx_corplist(path, ["000020", "000030", "000040"], pad_to=None)
        self.assertIsNone(guardian.load_krx_corplist(path))
        # 경계 바로 아래도 거부한다
        write_krx_corplist(path, [], pad_to=guardian.KRX_CORPLIST_MIN_COUNT - 1)
        self.assertIsNone(guardian.load_krx_corplist(path))
        # 경계를 채우면 정상 채택된다 (가드가 과잉차단이 아니라는 확인)
        write_krx_corplist(path, [], pad_to=guardian.KRX_CORPLIST_MIN_COUNT)
        loaded = guardian.load_krx_corplist(path)
        self.assertIsNotNone(loaded)
        self.assertGreaterEqual(loaded["count"], guardian.KRX_CORPLIST_MIN_COUNT)

    def test_06p2_truncated_source_blocks_delisting_end_to_end(self):
        """⭐ 잘린 원장이 실제 상폐 판정 경로까지 막는지 끝에서 끝까지 확인한다.

        load 단계만 보면 "그래서 판정이 달라지느냐"를 증명하지 못한다.
        """
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        # 같은 시각·같은 내용인데 원장만 잘린 상태로 바꾼다
        write_krx_corplist(fx.krx, fx.krx_listed[:3], pad_to=None,
                           as_of=NOW + datetime.timedelta(days=21))
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_06q_independent_source_failing_its_own_gate_is_rejected(self):
        """상류가 스스로 '품질 게이트를 못 넘었다'고 적어 둔 원장은 쓰지 않는다."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        path = os.path.join(tmp, "krx.json")
        write_krx_corplist(path, ["000020"], gate="GATE_FAIL")
        self.assertIsNone(guardian.load_krx_corplist(path))
        write_krx_corplist(path, ["000020"], gate="GATE_PASS")
        self.assertIsNotNone(guardian.load_krx_corplist(path))

    def test_06q2_real_repo_independent_source_would_pass_the_guards(self):
        """실제 저장소의 독립 원장이 새 가드에 걸려 통째로 무력화되지 않는지 본다.

        가드를 너무 세게 걸어 '항상 거부'가 되면 상폐 탐지가 조용히 죽는다.
        """
        real = os.path.join(HERE, "market_universe", "sector_map.json")
        if not os.path.exists(real):
            self.skipTest("독립 원장 파일이 없다")
        loaded = guardian.load_krx_corplist(real)
        self.assertIsNotNone(loaded)
        self.assertGreaterEqual(loaded["count"], guardian.KRX_CORPLIST_MIN_COUNT)
        self.assertEqual(loaded["gate"], "GATE_PASS")

    # ── 2026-08-26 발견: 상폐 시계가 잘못된 사건을 재고 있었다 ──────────────
    # 시세만 60일 안 들어오던 종목(시장에는 살아 있음 = PIPELINE_BUG)이 전체시장
    # snapshot에서 **단 하루** 빠진 순간 DELISTED_CONFIRMED가 됐다. 경과 거래일
    # 조건이 '시세 누락' 시계로 이미 충족돼 있었기 때문이다.

    def test_06r_long_pipeline_bug_then_one_day_absence_is_not_delisting(self):
        """⭐ 오래 시세가 안 들어왔다고 해서 부재 하루 만에 상폐가 되면 안 된다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        rep = fx.guard_days(60)                       # 시장엔 살아 있음
        f = rep["findings"][0]
        self.assertEqual(f["cause"], guardian.PIPELINE_BUG)
        self.assertGreaterEqual(f["elapsedTradingDays"],
                                guardian.MIN_ELAPSED_TRADING_DAYS)
        self.assertEqual(f["absentDayCount"], 0)      # 부재는 아직 0일

        fx.leave_market(["000010"])                   # 이제 시장 자료에서 사라진다
        rep = fx.guard_days(1, start=NOW + datetime.timedelta(days=60))
        f = rep["findings"][0]
        self.assertEqual(f["absentDayCount"], 1)
        self.assertNotEqual(f["cause"], guardian.DELISTED_CONFIRMED)
        self.assertEqual(f["cause"], guardian.UNKNOWN)
        self.assertEqual(rep["replaceableCount"], 0)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_06r2_absence_clock_is_counted_separately_from_price_clock(self):
        """시세 누락 시계와 시장 부재 시계는 서로 다른 숫자로 보고된다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        fx.guard_days(20)
        fx.leave_market(["000010"])
        rep = fx.guard_days(4, start=NOW + datetime.timedelta(days=20))
        f = rep["findings"][0]
        self.assertEqual(f["missingDayCount"], 24)
        self.assertEqual(f["absentDayCount"], 4)
        self.assertTrue(f["absentFromMarketData"])
        self.assertGreater(f["elapsedTradingDays"], f["elapsedAbsentTradingDays"])

    def test_06r3_reappearing_in_market_data_resets_the_absence_clock(self):
        """시장 자료에 다시 보이면 부재 시계는 0으로 돌아간다.

        끊긴 부재를 이어 붙여 상폐를 앞당길 수 없어야 한다.
        """
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        original = list(fx.snapshot_items)
        fx.guard_days(2)
        fx.leave_market(["000010"])
        rep = fx.guard_days(5, start=NOW + datetime.timedelta(days=2))
        self.assertEqual(rep["findings"][0]["absentDayCount"], 5)
        # 시장 자료에 다시 등장
        fx.snapshot_items = original
        rep = fx.guard_days(1, start=NOW + datetime.timedelta(days=7))
        self.assertEqual(rep["findings"][0]["absentDayCount"], 0)
        self.assertIsNone(rep["findings"][0]["firstAbsentAt"])

    def test_06r4_delisting_reads_the_absence_clock_not_the_price_clock(self):
        """⭐ 상폐 판정이 실제로 '부재 시계'를 읽는지 배선 자체를 확인한다.

        ⚠️ 상수를 0으로 내리는 방식은 이 성질을 잠그지 못한다. 두 시계가 같은
           상수(PERSISTENT_MISSING_MIN_DAYS · MIN_ELAPSED_TRADING_DAYS)를 쓰기
           때문에, 판정이 시세 시계를 보도록 되돌려 놔도 0이면 그냥 통과한다.
           실제로 독립 QA 감사가 그 뮤테이션을 걸어 예전 이 테스트가 살아남는 것을
           보였다(2026-08-26 HIGH-1). 그래서 상수 대신 **부재 시계 함수 자체**를
           바꿔치기해서, 판정이 그 함수를 따라 움직이는지 직접 본다.
        """
        real_fn = guardian.is_absence_persistent
        self.addCleanup(setattr, guardian, "is_absence_persistent", real_fn)

        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        fx.guard_days(60)                      # 시세 시계는 이미 한참 지났다
        fx.leave_market(["000010"])
        # 부재 이틀차 — 독립 원장이 '사라진 뒤'에 수집되도록 하루 더 돌린다
        rep = fx.guard_days(2, start=NOW + datetime.timedelta(days=60))
        f = rep["findings"][0]
        self.assertEqual(f["cause"], guardian.UNKNOWN)
        self.assertLess(f["absentDayCount"], guardian.PERSISTENT_MISSING_MIN_DAYS)
        # 시세 시계는 진작 충족돼 있다 — 그런데도 위에서 막혔다는 게 핵심이다
        self.assertGreaterEqual(f["elapsedTradingDays"],
                                guardian.MIN_ELAPSED_TRADING_DAYS)

        # 부재 시계만 '충족'으로 바꾸면 곧바로 상폐로 간다 = 그 시계를 읽고 있다
        guardian.is_absence_persistent = lambda observation, now: True
        flipped = fx.guard(now=NOW + datetime.timedelta(days=61))
        self.assertEqual(flipped["findings"][0]["cause"],
                         guardian.DELISTED_CONFIRMED)

    def test_06r5_observation_v2_file_migrates_without_losing_cap_memory(self):
        """옛 관측 파일(v2)을 읽어도 capMemory를 잃지 않고 부재 필드가 생긴다."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        path = os.path.join(tmp, "obs.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": 2,
                       "codes": {"000010": {"missingDays": ["2026-08-20"],
                                            "firstMissingAt": "2026-08-20T09:00:00+09:00",
                                            "lastMissingAt": "2026-08-20T09:00:00+09:00"}},
                       "recoveries": [],
                       "capMemory": {"000010": {"capRank": 7, "cap": 1.0e12}}}, f)
        doc = guardian.load_observations(path)
        self.assertEqual(doc["schemaVersion"], guardian.OBSERVATION_SCHEMA)
        self.assertEqual(doc["capMemory"]["000010"]["capRank"], 7)
        self.assertEqual(doc["codes"]["000010"]["absentDays"], [])
        # 소급 인정 금지 — 옛 파일의 시세 누락 이력을 부재로 바꿔 세지 않는다
        self.assertIsNone(doc["codes"]["000010"]["firstAbsentAt"])

    def test_06s_large_missing_ratio_is_red_even_without_bad_causes(self):
        """시세 누락 비율이 기준을 넘으면 원인 분류와 무관하게 RED다.

        (2026-08-26 독립 QA 감사 MEDIUM-1: RED_MISSING_RATIO가 무테스트였다.
         0.05를 1.0으로 무력화해도 어느 테스트도 깨지지 않았다.)
        """
        many = synth_codes(40)                      # 600종목 중 40 = 6.7% > 5%
        fx, _ = make_fixture(self.tmp, missing=many)
        rep = fx.guard()
        self.assertEqual(rep["status"], guardian.STATUS_RED)
        self.assertTrue(any("목표의" in r for r in rep["statusReasons"]),
                        rep["statusReasons"])
        # 원인은 전부 교체 대상이 아닌 분류인데도 RED다
        self.assertEqual(rep["replaceableCount"], 0)

        # 기준 아래면 RED가 아니다 (경계가 실제로 동작하는지)
        few = synth_codes(10)                       # 1.7% < 5%
        fx2, _ = make_fixture(tempfile.mkdtemp(), missing=few)
        self.addCleanup(shutil.rmtree, fx2.tmp, True)
        rep2 = fx2.guard()
        self.assertEqual(rep2["status"], guardian.STATUS_WARN)

    def test_06s2_missing_ratio_gate_is_live_code(self):
        """뮤테이션 — 비율 게이트를 무력화하면 위 상황이 RED에서 내려온다."""
        real = guardian.RED_MISSING_RATIO
        self.addCleanup(setattr, guardian, "RED_MISSING_RATIO", real)
        guardian.RED_MISSING_RATIO = 1.0
        fx, _ = make_fixture(self.tmp, missing=synth_codes(40))
        rep = fx.guard()
        self.assertEqual(rep["status"], guardian.STATUS_WARN)

    def test_06n_delisting_rules_are_reported_for_audit(self):
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        rep = fx.guard()
        rules = rep["delistingRules"]
        self.assertEqual(rules["persistentMissingMinDays"],
                         guardian.PERSISTENT_MISSING_MIN_DAYS)
        self.assertEqual(rules["minElapsedTradingDays"],
                         guardian.MIN_ELAPSED_TRADING_DAYS)
        self.assertEqual(rules["megaCapRankGuard"], guardian.MEGA_CAP_RANK_GUARD)
        self.assertGreaterEqual(guardian.MIN_ELAPSED_TRADING_DAYS, 10)
        self.assertGreaterEqual(guardian.PERSISTENT_MISSING_MIN_DAYS, 3)

    def test_06o_trading_day_counter_skips_weekends_and_holidays(self):
        # 2026-08-14(금) 다음날부터 2026-08-24(월)까지 = 8/18~8/21 네 번 + 8/24 한 번.
        # 주말 4일과 광복절 대체휴일(8/17)은 세지 않는다.
        start = datetime.date(2026, 8, 14)
        end = datetime.date(2026, 8, 24)
        self.assertEqual(guardian.trading_days_between(start, end), 5)
        self.assertFalse(guardian._is_trading_day(datetime.date(2026, 8, 17)))
        self.assertEqual(guardian.trading_days_between(start, start), 0)

    def test_07b_only_state_dir_writer_exists(self):
        """코드에 파일 쓰기 경로가 write_json(state 산출물) 하나뿐이다."""
        for mod in ("guardian.py", "standby.py", "proposal.py"):
            path = os.path.join(HERE, "gaeo_coverage", mod)
            writers = _write_mode_open_calls(path)
            self.assertTrue(all(fn == "write_json" for fn, _ in writers),
                            "%s: %s" % (mod, writers))
        # standby/proposal은 자기 쓰기 함수를 따로 두지 않고 guardian 것을 재사용한다
        for mod in ("standby.py", "proposal.py"):
            self.assertEqual(_write_mode_open_calls(
                os.path.join(HERE, "gaeo_coverage", mod)), [])
        # 산출물 경로는 항상 gaeo_coverage/state/ 아래다
        for mod, attr in (("guardian.py", "DEFAULT_REPORT_OUT"),
                          ("standby.py", "DEFAULT_OUT"),
                          ("proposal.py", "DEFAULT_OUT")):
            module = {"guardian.py": guardian, "standby.py": standby,
                      "proposal.py": proposal}[mod]
            self.assertTrue(getattr(module, attr).replace("\\", "/").endswith(
                tuple(["coverage_state.json", "standby_pool.json",
                       "replacement_proposal.json"])))
            self.assertIn("gaeo_coverage/state",
                          getattr(module, attr).replace("\\", "/"))
        # proposal은 tickers.js를 읽지도 않는다(반영 경로 자체가 없다)
        prop_src = _code_only(os.path.join(HERE, "gaeo_coverage", "proposal.py"))
        self.assertNotIn("load_configured", prop_src)
        self.assertNotIn("DEFAULT_TICKERS", prop_src)

    def test_07c_fingerprint_is_stable_and_dedupes(self):
        a = guardian.fingerprint("000010", guardian.UNKNOWN)
        b = guardian.fingerprint("000010", guardian.UNKNOWN)
        c = guardian.fingerprint("000010", guardian.DELISTED_CONFIRMED)
        d = guardian.fingerprint("000020", guardian.UNKNOWN)
        self.assertEqual(a, b)
        self.assertNotEqual(a, c)
        self.assertNotEqual(a, d)

    def test_07d_replaceable_causes_are_only_delisted(self):
        self.assertEqual(guardian.REPLACEABLE_CAUSES, (guardian.DELISTED_CONFIRMED,))
        for cause in (guardian.TEMP_DATA_FAILURE, guardian.LISTED_BUT_SUSPENDED,
                      guardian.CORPORATE_EVENT, guardian.PIPELINE_BUG,
                      guardian.UNKNOWN):
            self.assertNotIn(cause, guardian.REPLACEABLE_CAUSES)


def _strip_docstrings(path, source=None):
    """모듈·함수·클래스 docstring을 제거한 실코드만 돌려준다(오탐 방지)."""
    source = source if source is not None else open(path, encoding="utf-8").read()
    tree = ast.parse(source)
    drop = set()
    for node in ast.walk(tree):
        if isinstance(node, (ast.Module, ast.FunctionDef, ast.AsyncFunctionDef,
                             ast.ClassDef)):
            body = getattr(node, "body", None) or []
            if body and isinstance(body[0], ast.Expr) and \
                    isinstance(body[0].value, ast.Constant) and \
                    isinstance(body[0].value.value, str):
                drop.add((body[0].lineno, body[0].end_lineno))
    lines = source.splitlines()
    keep = []
    for i, line in enumerate(lines, start=1):
        if any(lo <= i <= hi for lo, hi in drop):
            continue
        keep.append(line)
    return "\n".join(keep)


def _code_only(path):
    """주석과 docstring을 모두 걷어낸 '실행되는 코드'만 남긴다.

    설명 주석에 'gaeo_reference' 같은 단어가 들어 있다는 이유로 격리 위반이라고
    잘못 판정하지 않기 위해 필요하다(경계는 실코드로만 판정한다).
    """
    source = open(path, encoding="utf-8").read()
    lines = source.splitlines(keepends=True)
    with open(path, "rb") as f:
        for tok in tokenize.tokenize(f.readline):
            if tok.type != tokenize.COMMENT:
                continue
            row, col = tok.start
            line = lines[row - 1]
            lines[row - 1] = line[:col] + " " * len(tok.string) + line[col + len(tok.string):]
    return _strip_docstrings(path, source="".join(lines))


def _write_mode_open_calls(path):
    """파일을 '쓰기'로 여는 open() 호출 목록 [(함수이름, 대상표현식)]."""
    tree = ast.parse(open(path, encoding="utf-8").read())
    parents = {}
    for node in ast.walk(tree):
        for child in ast.iter_child_nodes(node):
            parents[child] = node

    def owner(node):
        cur = node
        while cur in parents:
            cur = parents[cur]
            if isinstance(cur, (ast.FunctionDef, ast.AsyncFunctionDef)):
                return cur.name
        return "<module>"

    found = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Call):
            continue
        fname = getattr(node.func, "id", None) or getattr(node.func, "attr", None)
        if fname not in ("open",):
            continue
        modes = [a.value for a in node.args[1:] if isinstance(a, ast.Constant)]
        modes += [k.value.value for k in node.keywords
                  if k.arg == "mode" and isinstance(k.value, ast.Constant)]
        if any(("w" in str(m) or "a" in str(m) or "+" in str(m)) for m in modes):
            found.append((owner(node), ast.dump(node.args[0]) if node.args else ""))
    return found


# ═══════════════════════════════════════════════════════════════════════════
# 8~15. Standby Pool — 자격 심사 고의 실패 시험
# ═══════════════════════════════════════════════════════════════════════════
class ThirdAuditRegressionTest(unittest.TestCase):
    """2026-08-26 퀀트 3차 감사에서 재현된 경로를 전부 고정한다."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp, True)

    # ── CRITICAL-3: 하루짜리 잘못된 시총으로 대형주 가드가 무너지던 문제 ──
    def test_c3_single_bad_cap_sample_cannot_poison_the_guard(self):
        """⭐ 시총이 하루만 이상값으로 들어와도 대형주 보호가 유지된다.

        상류 collect_market_universe.py는 벤더가 준 시총을 검증 없이 싣는다.
        단위 오류(원↔백만원) 한 번이면 1,604조가 0.001조가 된다. 예전에는 기억을
        덮어쓰기만 해서 그 하루로 삼성전자 상폐 확정 + 교체 제안서가 나왔다.
        """
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": MEGA_CAP}})
        fx.guard_days(3)
        # 딱 하루, 시총이 잘못 들어온다
        fx.snapshot_items = [dict(i, cap=1.0e6) if i["code"] == "000010" else i
                             for i in fx.snapshot_items]
        fx.guard_days(1, start=NOW + datetime.timedelta(days=3))
        fx.leave_market(["000010"])
        rep = fx.guard_days(20, start=NOW + datetime.timedelta(days=4))
        f = rep["findings"][0]
        self.assertEqual(f["safestKnownCapRank"], 1)       # 가장 안전한 값을 쓴다
        self.assertEqual(f["safestKnownCap"], MEGA_CAP)
        self.assertEqual(f["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_c3b_memory_keeps_history_not_just_last_value(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        fx.guard_days(4)
        mem = json.load(open(fx.observations))["capMemory"]["000010"]
        self.assertIn("history", mem)
        self.assertGreaterEqual(len(mem["history"]), 4)

    # ── HIGH-3: 순위에 ETF·우선주가 섞여 보호 대상이 줄던 문제 ────────────
    def test_h3_rank_counts_common_shares_only(self):
        snap = {"byCode": {
            "000010": {"code": "000010", "kind": "COMMON", "cap": 3.0e12},
            "111110": {"code": "111110", "kind": "ETF", "cap": 9.0e12},
            "222220": {"code": "222220", "kind": "CLASS_SHARE", "cap": 8.0e12},
            "333330": {"code": "333330", "kind": "REIT", "cap": 7.0e12},
        }}
        self.assertEqual(guardian.cap_ranks(snap), {"000010": 1})
        # 전체를 세우면 4위로 밀린다 — 그게 예전 동작이었다
        self.assertEqual(guardian.cap_ranks(snap, common_only=False)["000010"], 4)

    def test_h3b_real_snapshot_top300_would_have_been_diluted(self):
        """실제 자료로 확인 — 예전 방식은 상위 300에 기업이 244개뿐이었다."""
        snap = guardian.load_universe_snapshot()
        if not snap:
            self.skipTest("전체시장 snapshot이 없다")
        old = guardian.cap_ranks(snap, common_only=False)
        top_old = {c for c, r in old.items() if r <= guardian.MEGA_CAP_RANK_GUARD}
        commons = sum(1 for c in top_old
                      if (snap["byCode"].get(c) or {}).get("kind") == "COMMON")
        self.assertLess(commons, guardian.MEGA_CAP_RANK_GUARD)
        new = guardian.cap_ranks(snap)
        top_new = {c for c, r in new.items() if r <= guardian.MEGA_CAP_RANK_GUARD}
        self.assertEqual(len(top_new), guardian.MEGA_CAP_RANK_GUARD)
        # 새 방식에서는 보호 대상이 전부 보통주다
        for c in top_new:
            self.assertEqual((snap["byCode"].get(c) or {}).get("kind"), "COMMON")

    def test_h3c_absolute_floor_catches_stocks_just_outside_the_rank(self):
        """순위 경계 바로 밖(실측 301위=1.610조)도 절대 하한이 받는다."""
        self.assertLessEqual(guardian.MEGA_CAP_ABS_FLOOR, 1.612e12)
        fx, rep = live_then_delisted(self.tmp, cap=guardian.MEGA_CAP_ABS_FLOOR,
                                     default_cap=9.0e12)   # 다른 종목이 다 더 크다
        f = rep["findings"][0]
        self.assertGreater(f["safestKnownCapRank"], guardian.MEGA_CAP_RANK_GUARD)
        self.assertEqual(f["cause"], guardian.PIPELINE_BUG)

    # ── HIGH-4: snapshot 쪽에는 품질 게이트가 없던 문제 ──────────────────
    def test_h4_truncated_snapshot_cannot_prove_absence(self):
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        fx.guard_days(6)
        fx.leave_market(["000010"])
        # snapshot이 서서히 잘려 기준 아래로 내려간다
        fx.snapshot_pad = 0
        fx.snapshot_items = fx.snapshot_items[:guardian.SNAPSHOT_MIN_ITEM_COUNT - 1]
        rep = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        f = rep["findings"][0]
        self.assertEqual(f["cause"], guardian.MARKET_DATA_UNRELIABLE)
        self.assertFalse(rep["snapshotReliable"])
        self.assertEqual(rep["replaceableCount"], 0)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_NO_PROPOSAL)

    def test_h4b_collector_saying_it_failed_blocks_delisting(self):
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        write_universe_state(fx.universe_state, status="SOURCE_ERROR")
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["findings"][0]["cause"],
                         guardian.MARKET_DATA_UNRELIABLE)

    @staticmethod
    def _mass_absence_fixture(tmp, count=None):
        """시세는 1종목만 빠졌는데 시장 자료에서는 여러 종목이 사라진 상황.

        이렇게 해야 '대량누락(시세)' 가드가 먼저 걸리지 않아 '대량부재(시장 자료)'
        가드만 남는다. 실제로 위험한 것도 이 모양이다 — 시장 자료가 무너졌는데
        시세는 계속 들어와서 아무도 눈치채지 못하는 경우.
        """
        # ⚠️ 개수를 인자로 받는다. 뮤테이션이 상수를 10**9으로 올린 상태에서 이
        #    상수로 종목을 만들면 10억 개를 만들려다 테스트가 멈춘다.
        vanish = synth_codes(count or guardian.MASS_ABSENCE_DELISTING_BLOCK)
        target = vanish[0]
        fx, _ = make_fixture(tmp, missing=(target,),
                             snapshot_overrides={c: {"cap": SMALL_CAP}
                                                 for c in vanish})
        fx.guard_days(6)
        fx.leave_market(vanish)
        rep = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        return fx, rep

    def test_h4c_mass_absence_is_a_collection_failure_not_delisting(self):
        fx, rep = self._mass_absence_fixture(self.tmp)
        self.assertEqual(len(rep["missingPriceCodes"]), 1)      # 시세는 1종목만
        self.assertFalse(rep["massMissingBlockActive"])         # 옛 가드는 안 걸린다
        self.assertTrue(rep["massAbsenceBlockActive"])          # 새 가드가 잡는다
        for f in rep["findings"]:
            self.assertEqual(f["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_h4d_min_item_count_gate_is_live_code(self):
        """뮤테이션 — snapshot 최소 건수 가드를 끄면 잘린 자료로도 상폐가 된다."""
        real = guardian.SNAPSHOT_MIN_ITEM_COUNT
        self.addCleanup(setattr, guardian, "SNAPSHOT_MIN_ITEM_COUNT", real)
        guardian.SNAPSHOT_MIN_ITEM_COUNT = 0
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        fx.guard_days(6)
        fx.leave_market(["000010"])
        fx.snapshot_pad = 0
        fx.snapshot_items = fx.snapshot_items[:1999]
        rep = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_h4e_mass_absence_gate_is_live_code(self):
        """뮤테이션 — 대량부재 가드를 끄면 같은 상황이 상폐로 바뀐다."""
        real = guardian.MASS_ABSENCE_DELISTING_BLOCK
        self.addCleanup(setattr, guardian, "MASS_ABSENCE_DELISTING_BLOCK", real)
        guardian.MASS_ABSENCE_DELISTING_BLOCK = 10 ** 9
        _, rep = self._mass_absence_fixture(self.tmp, count=real)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    # ── MEDIUM-3: main에 자동 커밋되는 상태파일을 그대로 믿던 문제 ───────
    def test_m3_forged_observation_state_is_sanitized(self):
        forged = {"schemaVersion": 3,
                  "codes": {"000010": {
                      "missingDays": ["2099-01-01", "2026-08-20"],
                      "firstMissingAt": "2000-01-01T00:00:00+09:00",
                      "absentDays": ["2099-01-01", "2099-01-02", "2099-01-03"],
                      "firstAbsentAt": "2000-01-01T00:00:00+09:00"}},
                  "capMemory": {"000010": {"capRank": 1, "seenAt": "2099-01-01T00:00:00+09:00"},
                                "000020": "not-a-dict"}}
        clean = guardian.sanitize_observations(forged, "2026-08-26T09:00:00+09:00")
        e = clean["codes"]["000010"]
        self.assertEqual(e["missingDays"], ["2026-08-20"])     # 미래 날짜 제거
        self.assertEqual(e["absentDays"], [])                  # 전부 미래였다
        self.assertIsNone(e["firstAbsentAt"])                  # 목록이 비면 시각도 없다
        self.assertEqual(str(e["firstMissingAt"])[:10], "2026-08-20")
        self.assertNotIn("000010", clean["capMemory"])         # 미래 seenAt 제거
        self.assertNotIn("000020", clean["capMemory"])         # dict가 아니면 제거

    def test_m3b_forged_state_cannot_confirm_delisting_on_first_run(self):
        """⭐ 위조된 상태파일을 넣어도 첫 실행에 상폐가 확정되지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",),
                             krx_delisted=("000010",))
        with open(fx.observations, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": 3, "codes": {"000010": {
                "missingDays": ["2099-01-01"], "absentDays": ["2099-01-01",
                                                              "2099-01-02",
                                                              "2099-01-03",
                                                              "2099-01-04"],
                "firstAbsentAt": "2000-01-01T00:00:00+09:00",
                "firstMissingAt": "2000-01-01T00:00:00+09:00"}},
                "capMemory": {"000010": {"capRank": 9999, "cap": 1.0}}}, f)
        rep = fx.guard()
        self.assertNotEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_m3c_v2_migration_discards_forged_absence(self):
        """v2 파일에 적힌 absentDays는 소급 인정하지 않고 0에서 시작한다."""
        path = os.path.join(self.tmp, "obs.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": 2, "codes": {"000010": {
                "missingDays": ["2026-08-20"],
                "firstMissingAt": "2026-08-20T09:00:00+09:00",
                "absentDays": ["2026-07-01", "2026-07-02", "2026-07-03"],
                "firstAbsentAt": "2026-07-01T00:00:00+09:00"}},
                "capMemory": {"000010": {"capRank": 7}}}, f)
        doc = guardian.load_observations(path)
        self.assertEqual(doc["codes"]["000010"]["absentDays"], [])
        self.assertIsNone(doc["codes"]["000010"]["firstAbsentAt"])
        self.assertEqual(doc["capMemory"]["000010"]["capRank"], 7)   # 기억은 보존

    # ── MEDIUM-4: 독립 원장 신선도가 아직 시세 시계를 보던 문제 ──────────
    def test_m4_independent_source_must_postdate_the_absence(self):
        krx = {"asOf": "2026-08-12T00:00:00+09:00", "source": "krx_corplist",
               "codes": set(), "count": 2596}
        obs = {"firstMissingAt": "2026-08-01T00:00:00+09:00",
               "firstAbsentAt": "2026-08-14T00:00:00+09:00"}
        usable, why = guardian.krx_evidence(krx, obs, NOW)
        self.assertFalse(usable, why)
        self.assertIn("사라진 시점", why)
        # 부재 이후에 수집된 원장은 쓸 수 있다
        krx2 = dict(krx, asOf="2026-08-20T00:00:00+09:00")
        ok, _ = guardian.krx_evidence(krx2, obs, NOW)
        self.assertTrue(ok)

    # ── LOW-1: 감사에서 살아남은 뮤턴트 4개를 테스트로 덮는다 ────────────
    def test_low1_m11_stale_independent_source_guard_is_live(self):
        real = guardian.KRX_CORPLIST_MAX_AGE_DAYS
        self.addCleanup(setattr, guardian, "KRX_CORPLIST_MAX_AGE_DAYS", real)
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        # 원장은 '부재가 시작된 뒤'에 수집됐지만(그 규칙은 통과), 아주 오래됐다.
        # 그래야 나이 가드 하나만 남아서 뮤테이션이 의미를 갖는다.
        later = NOW + datetime.timedelta(days=60)
        write_krx_corplist(fx.krx, fx.krx_listed,
                           as_of=NOW + datetime.timedelta(days=7))
        fx.refresh_sources(later, refresh_krx=False)
        blocked = fx.guard(now=later)
        self.assertEqual(blocked["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)
        guardian.KRX_CORPLIST_MAX_AGE_DAYS = 10 ** 9        # 가드를 끈다
        leaked = fx.guard(now=later)
        self.assertEqual(leaked["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_low1_m12_vendor_source_guard_is_live(self):
        real = guardian.VENDOR_MARKS
        self.addCleanup(setattr, guardian, "VENDOR_MARKS", real)
        fx, rep = live_then_delisted(self.tmp)
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)
        write_krx_corplist(fx.krx, fx.krx_listed,
                           as_of=NOW + datetime.timedelta(days=21),
                           source="krx_corplist (naver 폴백 혼합)")
        blocked = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(blocked["findings"][0]["cause"],
                         guardian.INDEPENDENT_SOURCE_STALE)
        guardian.VENDOR_MARKS = ()                           # 가드를 끈다
        leaked = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(leaked["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_low1_m13_class_share_absence_is_never_delisting(self):
        """⭐ 종류주(우선주)는 법인 단위 원장의 부재로 판정할 수 없다.

        실측: 우리 600 안의 009155 삼성전기우는 보통주 순위 경계 바로 밖이면서
        실제 KRX 법인목록에도 없다. 지금 이 종목이 상폐로 안 가는 유일한 이유가
        이 가드다(2026-08-26 퀀트 3차 감사 LOW-1 M13).
        """
        codes = synth_codes(599) + ["005935"]
        fx = Fixture(self.tmp)
        write_tickers(fx.tickers, codes)
        live = [c for c in codes if c != "005935"]
        write_data_js(fx.data, live)
        write_auto_js(fx.auto, live)
        items = [snap_item(c, **({"cap": SMALL_CAP} if c == "005935" else {}))
                 for c in codes]
        write_snapshot(fx.snapshot, items,
                       (NOW - datetime.timedelta(hours=6)).isoformat())
        write_sector_map(fx.sector_map, [i["code"] for i in items])
        write_universe_state(fx.universe_state)
        fx.snapshot_items = items
        fx.krx_listed = list(codes)
        write_krx_corplist(fx.krx, fx.krx_listed)
        write_market_map(fx.market_map, codes)
        fx.guard_days(6)
        fx.leave_market(["005935"])           # 시장에서도 원장에서도 사라진다
        rep = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        f = [x for x in rep["findings"] if x["code"] == "005935"][0]
        self.assertIsNotNone(f["safestKnownCapRank"])   # 크기는 알고 있다
        self.assertEqual(f["cause"], guardian.REVIEW_REQUIRED)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_low1_m19_unreadable_snapshot_never_starts_the_absence_clock(self):
        """snapshot을 못 읽었다고 전 종목을 '시장에서 사라진 것'으로 적지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        fx.guard_days(3)
        os.remove(fx.snapshot)
        rep = fx.guard(now=NOW + datetime.timedelta(days=3), )
        f = rep["findings"][0]
        self.assertEqual(f["absentDayCount"], 0)
        self.assertFalse(f["absentFromMarketData"])
        self.assertNotEqual(f["cause"], guardian.DELISTED_CONFIRMED)


class FourthAuditRegressionTest(unittest.TestCase):
    """2026-08-26 퀀트 4차 감사에서 재현된 경로를 고정한다."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp, True)

    # ── CRITICAL-4: '가장 안전한 값 고르기'가 표본 1건이면 아무 일도 안 한다 ──
    def test_c4_thin_history_cannot_justify_delisting(self):
        """⭐ 크기가 작다는 판단의 근거가 표본 1건뿐이면 상폐로 확정하지 않는다.

        1건의 min/max는 그 1건이다. 즉 표본이 얇으면 safest_known_size는 옛
        last_known_size와 완전히 같아지고, 하루짜리 이상값이 곧 마지막 기억이 된다.
        실제로 저장소의 597종목 전부 이력 1건이었다(퀀트 4차 감사 CRITICAL-4).
        """
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": 1.0e9}})
        fx.guard_days(1)                       # 관측 1일 = 표본 1건
        fx.leave_market(["000010"])
        rep = fx.guard_days(20, start=NOW + datetime.timedelta(days=1))
        f = rep["findings"][0]
        self.assertEqual(f["capSampleCount"], 1)
        self.assertEqual(f["cause"], guardian.REVIEW_REQUIRED)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_c4b_enough_history_still_allows_genuine_delisting(self):
        """표본이 충분히 쌓이면 진짜 상폐는 그대로 확정된다(기능 사망 금지)."""
        fx, rep = live_then_delisted(self.tmp, extra_snapshot_items=OUTSIDE_ITEMS)
        f = rep["findings"][0]
        self.assertGreaterEqual(f["capSampleCount"], guardian.CAP_MEMORY_MIN_SAMPLES)
        self.assertEqual(f["cause"], guardian.DELISTED_CONFIRMED)

    def test_c4c_min_samples_gate_is_live_code(self):
        """뮤테이션 — 최소 표본 기준을 0으로 내리면 얇은 이력도 상폐가 된다."""
        real = guardian.CAP_MEMORY_MIN_SAMPLES
        self.addCleanup(setattr, guardian, "CAP_MEMORY_MIN_SAMPLES", real)
        guardian.CAP_MEMORY_MIN_SAMPLES = 0
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": 1.0e9}})
        fx.guard_days(1)
        fx.leave_market(["000010"])
        rep = fx.guard_days(20, start=NOW + datetime.timedelta(days=1))
        self.assertEqual(rep["findings"][0]["cause"], guardian.DELISTED_CONFIRMED)

    def test_c4d_same_day_rerun_cannot_erase_a_good_sample(self):
        """⭐ 같은 날 두 번 돌려도 정상 표본이 이상값으로 교체되지 않는다.

        워크플로우 재시도 · workflow_dispatch · 로컬 실행 모두 같은 날 두 번이다.
        날짜를 키로 덮어쓰면 나중 값이 앞 값을 지운다(퀀트 4차 감사 재현 B).
        """
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": MEGA_CAP}})
        fx.guard(now=NOW)                                   # 정상
        fx.snapshot_items = [dict(i, cap=1.0e9) if i["code"] == "000010" else i
                             for i in fx.snapshot_items]
        later = NOW + datetime.timedelta(hours=8)
        fx.refresh_sources(later)
        fx.guard(now=later)                                 # 같은 날 이상값
        history = json.load(open(fx.observations))["capMemory"]["000010"]["history"]
        self.assertEqual(list(history.values())[0][0], 1)   # 좋은 순위가 남는다
        fx.leave_market(["000010"])
        rep = fx.guard_days(20, start=NOW + datetime.timedelta(days=1))
        self.assertEqual(rep["findings"][0]["cause"], guardian.PIPELINE_BUG)

    # ── HIGH-6: 못 믿는 자료 위에서 부재 시계가 돌았다 ──────────────────
    def test_h6_absence_clock_does_not_run_on_untrusted_data(self):
        """⭐ 잘린 자료로 쌓은 부재 일수가 복구 당일 현금화되면 안 된다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        fx.guard_days(6)
        fx.leave_market(["000010"])
        full = list(fx.snapshot_items)
        fx.snapshot_pad = 0
        fx.snapshot_items = full[:1999]
        mid = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        self.assertEqual(mid["findings"][0]["cause"], guardian.MARKET_DATA_UNRELIABLE)
        self.assertEqual(mid["findings"][0]["absentDayCount"], 0)   # 시계가 안 돈다
        fx.snapshot_pad = None
        fx.snapshot_items = full                                    # 수집 복구
        rep = fx.guard_days(1, start=NOW + datetime.timedelta(days=22))
        f = rep["findings"][0]
        self.assertEqual(f["absentDayCount"], 1)     # 정직한 근거는 '부재 1일'뿐
        self.assertEqual(f["cause"], guardian.UNKNOWN)
        self.assertEqual(rep["replaceableCount"], 0)

    # ── HIGH-7: 대량부재 가드에 탈출구가 없어 교체가 영구 정지했다 ──────
    def test_h7_chronic_absentees_do_not_lock_replacement_forever(self):
        """⭐ 오래 부재이던 종목이 슬롯을 영구 점유하면 안 된다.

        누적 부재 수로 세면, 상폐가 확정돼야 종목이 빠지는데 확정이 막혀서 종목이
        안 빠지고, 그래서 부재 수도 안 줄어 영원히 풀리지 않는다(자기강화형 교착).
        """
        chronic = synth_codes(4)                    # 오래전부터 부재인 4종목
        target = "000050"
        fx, _ = make_fixture(self.tmp, missing=(target,),
                             snapshot_overrides={c: {"cap": SMALL_CAP}
                                                 for c in list(chronic) + [target]})
        fx.guard_days(3)
        fx.leave_market(chronic)                    # 먼저 사라진다
        fx.guard_days(30, start=NOW + datetime.timedelta(days=3))
        fx.leave_market([target])                   # 한참 뒤 진짜 상폐 1종목
        rep = fx.guard_days(20, start=NOW + datetime.timedelta(days=33))
        self.assertEqual(rep["absentFromMarketDataCount"], 5)   # 누적은 임계값과 같다
        self.assertLess(rep["recentlyAbsentCount"],
                        guardian.MASS_ABSENCE_DELISTING_BLOCK)  # 최근 창에는 적다
        self.assertFalse(rep["massAbsenceBlockActive"])
        found = [f for f in rep["findings"] if f["code"] == target][0]
        self.assertEqual(found["cause"], guardian.DELISTED_CONFIRMED)

    def test_h7b_simultaneous_disappearance_is_still_blocked(self):
        """반대로 한 무리가 비슷한 시기에 사라지면 여전히 벤더 장애로 본다."""
        vanish = synth_codes(guardian.MASS_ABSENCE_DELISTING_BLOCK)
        fx, _ = make_fixture(self.tmp, missing=(vanish[0],),
                             snapshot_overrides={c: {"cap": SMALL_CAP} for c in vanish})
        fx.guard_days(6)
        fx.leave_market(vanish)
        rep = fx.guard_days(16, start=NOW + datetime.timedelta(days=6))
        self.assertTrue(rep["massAbsenceBlockActive"])
        self.assertEqual(rep["findings"][0]["cause"], guardian.PIPELINE_BUG)
        self.assertEqual(rep["replaceableCount"], 0)

    # ── MEDIUM-3: 과거 날짜로만 채운 위조가 통과했다 ────────────────────
    def test_m3d_past_dated_forgery_is_rejected(self):
        """⭐ 과거 날짜로만 채운 상태파일 위조도 첫 실행에 상폐로 이어지지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             drop_from_snapshot=("000010",), krx_delisted=("000010",))
        days = [(NOW - datetime.timedelta(days=d)).date().isoformat()
                for d in range(30, 5, -1)]
        with open(fx.observations, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": 3, "codes": {"000010": {
                "missingDays": days, "firstMissingAt": days[0] + "T00:00:00+09:00",
                "absentDays": days, "firstAbsentAt": days[0] + "T00:00:00+09:00"}},
                "capMemory": {"000010": {"capRank": 9999, "cap": 1.0,
                                         "history": {d: [9999, 1.0] for d in days}}}}, f)
        rep = fx.guard()
        f = rep["findings"][0]
        self.assertEqual(f["capSampleCount"], 0)     # 자기모순 기록은 버려진다
        self.assertNotEqual(f["cause"], guardian.DELISTED_CONFIRMED)
        self.assertEqual(rep["replaceableCount"], 0)

    def test_m3e_capmemory_cannot_claim_days_the_stock_was_absent(self):
        """capMemory 날짜와 부재 날짜는 겹칠 수 없다(정상 운영에선 불가능)."""
        doc = {"schemaVersion": 3,
               "codes": {"000010": {"missingDays": ["2026-08-20"],
                                    "absentDays": ["2026-08-20", "2026-08-21"],
                                    "firstAbsentAt": "2026-08-20T00:00:00+09:00",
                                    "firstMissingAt": "2026-08-20T00:00:00+09:00"}},
               "capMemory": {"000010": {"history": {"2026-08-20": [5, 9.0e12],
                                                    "2026-08-19": [5, 9.0e12]}}}}
        clean = guardian.sanitize_observations(doc, "2026-08-26T09:00:00+09:00")
        self.assertEqual(list(clean["capMemory"]["000010"]["history"]), ["2026-08-19"])

    def test_m3f_implausible_rank_is_rejected(self):
        doc = {"schemaVersion": 3, "codes": {},
               "capMemory": {"000010": {"history": {
                   "2026-08-20": [guardian.MAX_PLAUSIBLE_CAP_RANK + 1, 1.0e12],
                   "2026-08-21": [0, 1.0e12],
                   "2026-08-22": [7, -5.0],
                   "2026-08-23": [7, 1.0e12]}}}}
        clean = guardian.sanitize_observations(doc, "2026-08-26T09:00:00+09:00")
        self.assertEqual(list(clean["capMemory"]["000010"]["history"]), ["2026-08-23"])

    # ── MEDIUM-8: 크기 비교가 커지는 방향을 못 잡았다 ───────────────────
    def test_m8_size_mismatch_is_bidirectional(self):
        """진짜 상폐 종목은 대개 초소형이라 실제 교체는 커지는 방향이 흔하다."""
        self.assertGreater(proposal.SIZE_MISMATCH_RATIO_UP, 1)
        rep = {"targetCoverage": 600, "configuredCoverage": 600,
               "coverageVersion": "GAEO_COVERAGE_V2_600",
               "findings": [{"code": "000010", "name": "제닉스로보틱스",
                             "cause": guardian.DELISTED_CONFIRMED,
                             "market": "KOSDAQ", "safestKnownCap": 0.089e12,
                             "firstAbsentAt": "2026-08-01T00:00:00+09:00"}]}
        pool = {"candidates": [{"code": "476830", "name": "알지노믹스",
                                "market": "KOSDAQ", "marketCap": 0.989e12,
                                "eligibilityVerdict": "ELIGIBLE_STANDBY"}]}
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=pool, now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        cmp0 = doc["sizeComparison"][0]
        self.assertTrue(cmp0["sizeMismatch"], cmp0)          # 11배 확대를 잡는다
        self.assertEqual(cmp0["direction"], "LARGER")
        self.assertIn("훨씬 큰", cmp0["note"])
        self.assertEqual(doc["removals"][0]["removalEffectiveFrom"],
                         "2026-08-01T00:00:00+09:00")


class ProductionCadenceTest(unittest.TestCase):
    """운영은 **주 1회**(일요일 08:00 KST) 실행이다.

    나머지 테스트는 매일 실행을 가정한다. 날짜로 세는 가드들(관측일수·표본 수·
    부재 창)은 실행 주기가 바뀌면 의미가 달라지므로, 실제 리듬으로도 한 번
    끝에서 끝까지 확인한다.
    """

    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, self.tmp, True)

    @staticmethod
    def _weekly(fx, weeks, start, leave_at=None, codes=()):
        rep = None
        for w in range(weeks):
            now = start + datetime.timedelta(days=7 * w)
            if leave_at is not None and w == leave_at:
                fx.leave_market(list(codes))
            fx.refresh_sources(now)
            rep = fx.guard(now=now)
        return rep

    def test_weekly_runs_confirm_genuine_delisting_but_not_too_fast(self):
        """⭐ 주 1회 리듬에서도 진짜 상폐는 확정되고, 그 전에 서두르지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}},
                             extra_snapshot_items=OUTSIDE_ITEMS)
        # 사라진 직후(1주 뒤)에는 아직 확정되지 않는다
        early = self._weekly(fx, 5, NOW, leave_at=3, codes=("000010",))
        self.assertNotEqual(early["findings"][0]["cause"],
                            guardian.DELISTED_CONFIRMED)
        # 몇 주 더 지나면 확정되고 제안까지 간다
        late = self._weekly(fx, 4, NOW + datetime.timedelta(days=35),
                            codes=("000010",))
        f = late["findings"][0]
        self.assertEqual(f["cause"], guardian.DELISTED_CONFIRMED)
        self.assertGreaterEqual(f["capSampleCount"],
                                guardian.CAP_MEMORY_MIN_SAMPLES)
        self.assertGreaterEqual(f["absentDayCount"],
                                guardian.PERSISTENT_MISSING_MIN_DAYS)
        fx.pool()
        self.assertEqual(fx.propose()["status"], proposal.STATUS_AWAITING)

    def test_weekly_runs_reach_min_samples_during_warmup(self):
        """새로 편입된 종목도 몇 주면 표본 기준을 채운다(영구 보류가 아니다)."""
        fx, _ = make_fixture(self.tmp, missing=("000010",))
        rep = self._weekly(fx, guardian.CAP_MEMORY_MIN_SAMPLES, NOW,
                           codes=("000010",))
        self.assertGreaterEqual(rep["findings"][0]["capSampleCount"],
                                guardian.CAP_MEMORY_MIN_SAMPLES)

    def test_weekly_runs_do_not_trip_the_mass_absence_window(self):
        """주 1회 실행이라고 해서 대량부재 창이 잘못 발동하지 않는다."""
        fx, _ = make_fixture(self.tmp, missing=("000010",),
                             snapshot_overrides={"000010": {"cap": SMALL_CAP}})
        rep = self._weekly(fx, 8, NOW, leave_at=1, codes=("000010",))
        self.assertFalse(rep["massAbsenceBlockActive"])
        self.assertEqual(rep["absentFromMarketDataCount"], 1)


class StandbyScreeningTest(unittest.TestCase):
    def pool_from(self, items, covered=(), sectors=None, target=None):
        """업종 매핑은 기본으로 '정상 제조업'을 채워 준다.

        업종 기준 제외(집합투자기구·업종불명)를 따로 시험하는 테스트만
        sectors 인자로 원하는 업종을 덮어쓴다.
        """
        mapping = {i["code"]: NORMAL_SECTOR for i in items}
        if sectors is not None:
            mapping.update(sectors)
            for code, value in sectors.items():
                if value is None:
                    mapping.pop(code, None)
        snapshot = {"asOf": (NOW - datetime.timedelta(hours=3)).isoformat(),
                    "byCode": {i["code"]: i for i in items}}
        kwargs = {}
        if target is not None:
            kwargs["target"] = target
        return standby.build_pool(
            snapshot=snapshot, covered_codes=covered,
            sector_map={"asOf": NOW.isoformat(), "source": "test", "map": mapping},
            now=NOW, **kwargs)

    def _assert_rejected(self, item, reason):
        pool = self.pool_from([item, snap_item("999990")])
        codes = [c["code"] for c in pool["candidates"]]
        self.assertNotIn(item["code"], codes)
        self.assertEqual(pool["excludedCounts"].get(reason), 1,
                         pool["excludedCounts"])

    def test_08_etf_rejected(self):
        self._assert_rejected(snap_item("069500", kind="ETF"), standby.R_NOT_COMMON)

    def test_09_etn_rejected(self):
        self._assert_rejected(snap_item("530000", kind="ETN"), standby.R_NOT_COMMON)

    def test_10_spac_rejected(self):
        self._assert_rejected(snap_item("400010", kind="SPAC",
                                        basis="legal_name_rule"),
                              standby.R_NOT_COMMON)

    def test_11_reit_rejected(self):
        self._assert_rejected(snap_item("330990", kind="REIT",
                                        basis="listing_name_rule"),
                              standby.R_NOT_COMMON)

    def test_12_class_share_rejected(self):
        self._assert_rejected(snap_item("005935", kind="CLASS_SHARE",
                                        basis="code_suffix_rule"),
                              standby.R_NOT_COMMON)

    def test_13_not_tradable_rejected(self):
        self._assert_rejected(snap_item("111110", tradable=False),
                              standby.R_NOT_TRADABLE)

    def test_14_already_covered_rejected(self):
        pool = self.pool_from([snap_item("005930"), snap_item("999990")],
                              covered=("005930",))
        self.assertNotIn("005930", [c["code"] for c in pool["candidates"]])
        self.assertEqual(pool["excludedCounts"].get(standby.R_ALREADY), 1)

    def test_15_unclassified_kinds_rejected(self):
        for kind, basis in (("COMMON_ASSUMED", "no_type_metadata"),
                            ("CLASSIFICATION_UNKNOWN", "stockEndType_empty"),
                            ("NON_STOCK_FUND", "source_stockEndType")):
            with self.subTest(kind=kind):
                pool = self.pool_from([snap_item("222220", kind=kind, basis=basis),
                                       snap_item("999990")])
                self.assertNotIn("222220", [c["code"] for c in pool["candidates"]])

    def test_15b_unverified_basis_rejected(self):
        """kind가 COMMON이어도 근거가 실측 metadata가 아니면 탈락."""
        self._assert_rejected(snap_item("333330", basis="code_suffix_rule"),
                              standby.R_BASIS)

    def test_15c_missing_cap_rejected(self):
        self._assert_rejected(snap_item("444440", cap=None), standby.R_NO_CAP)
        self._assert_rejected(snap_item("444450", cap=0), standby.R_NO_CAP)

    def test_15d_sorted_by_market_cap_only(self):
        items = [snap_item("100000", cap=1e11, rate=30.0, tval=9e12),   # 급등·거래폭발
                 snap_item("200000", cap=9e12, rate=-5.0, tval=1e6),    # 큰 회사
                 snap_item("300000", cap=5e12, rate=0.0, tval=5e9)]
        pool = self.pool_from(items)
        self.assertEqual([c["code"] for c in pool["candidates"]],
                         ["200000", "300000", "100000"])
        self.assertEqual([c["capRank"] for c in pool["candidates"]], [1, 2, 3])

    def test_15e_no_popularity_criteria_in_source(self):
        """'많이 오른 종목'·'거래대금' 기준이 정렬에 쓰이지 않는다."""
        src = _code_only(os.path.join(HERE, "gaeo_coverage", "standby.py"))
        self.assertNotIn('["rate"]', src)
        self.assertNotIn('["tval"]', src)
        self.assertNotIn('"tval"', src)
        self.assertIn('-float(it["cap"])', src)

    def test_15f_shortfall_is_reported_not_padded(self):
        """자격 미달이면 숫자를 억지로 채우지 않는다."""
        pool = self.pool_from([snap_item("100000"), snap_item("200000")])
        self.assertEqual(pool["candidateCount"], 2)
        self.assertTrue(pool["shortfall"])
        self.assertEqual(pool["status"], "SHORTFALL")
        self.assertEqual(pool["targetRange"], [30, 50])

    def test_15g_required_fields_present(self):
        pool = self.pool_from([snap_item("100000")])
        c = pool["candidates"][0]
        for key in ("code", "name", "market", "sector", "marketCap", "capRank",
                    "tradableStatus", "instrumentType", "basis", "checkedAt",
                    "sourceSnapshot", "eligibilityVerdict", "fingerprint"):
            self.assertIn(key, c)

    def test_15j_collective_investment_sector_rejected(self):
        """집합투자기구 업종(신탁업 및 집합투자업)은 kind가 COMMON이어도 탈락한다.

        실제 사례: 맥쿼리인프라·KB발해인프라·맵스리얼티는 stockEndType이 "stock"이고
        이름이 '리츠'로 끝나지 않아 기존 규칙 넷을 전부 통과했었다.
        """
        fund = snap_item("088980", cap=4.64e12)      # 맥쿼리인프라 실측 시총
        normal = snap_item("999990", cap=1.0e11)
        pool = self.pool_from([fund, normal], sectors={"088980": FUND_SECTOR})
        self.assertNotIn("088980", [c["code"] for c in pool["candidates"]])
        self.assertEqual(pool["excludedCounts"].get(standby.R_COLLECTIVE), 1,
                         pool["excludedCounts"])
        # 시총이 훨씬 작아도 정상 기업은 그대로 남는다
        self.assertIn("999990", [c["code"] for c in pool["candidates"]])
        self.assertIn(FUND_SECTOR, pool["excludedSectors"])

    def test_15k_normal_operating_companies_still_pass(self):
        """정상 제조/IT 기업은 업종 규칙에 걸리지 않는다(과잉 제외 회귀 방지)."""
        cases = {
            "111100": "전자부품 제조업",
            "111200": "소프트웨어 개발 및 공급업",
            "111300": "자동차 신품 부품 제조업",
            "111400": "기타 금융업",                    # 지주회사·은행 업종
            "111500": "금융 지원 서비스업",              # 증권사 업종
            "111600": "부동산 임대 및 공급업",           # 부동산 개발기업 업종
        }
        items = [snap_item(code, cap=1.0e12 - i)
                 for i, code in enumerate(cases)]
        pool = self.pool_from(items, sectors=cases)
        self.assertEqual(pool["candidateCount"], len(cases), pool["excludedCounts"])
        for code in cases:
            self.assertIn(code, [c["code"] for c in pool["candidates"]])
        self.assertIsNone(pool["excludedCounts"].get(standby.R_COLLECTIVE))
        self.assertIsNone(pool["excludedCounts"].get(standby.R_SECTOR_UNKNOWN))

    def test_15l_unknown_sector_rejected_with_reason(self):
        """업종을 확인할 수 없는 종목은 '확실하지 않은 종목'이므로 제외한다."""
        pool = self.pool_from([snap_item("222200"), snap_item("999990")],
                              sectors={"222200": None})
        self.assertNotIn("222200", [c["code"] for c in pool["candidates"]])
        self.assertEqual(pool["excludedCounts"].get(standby.R_SECTOR_UNKNOWN), 1,
                         pool["excludedCounts"])
        self.assertTrue(pool["requireKnownSector"])

    def test_15m_sector_check_runs_last_so_counts_stay_readable(self):
        """ETF처럼 다른 이유로 떨어지는 종목이 SECTOR_UNKNOWN을 부풀리지 않는다."""
        pool = self.pool_from([snap_item("069500", kind="ETF"), snap_item("999990")],
                              sectors={"069500": None})
        self.assertEqual(pool["excludedCounts"].get(standby.R_NOT_COMMON), 1)
        self.assertIsNone(pool["excludedCounts"].get(standby.R_SECTOR_UNKNOWN))

    def test_15n_every_candidate_has_a_known_sector(self):
        items = [snap_item("%06d" % (i * 10), cap=1e12 + i) for i in range(1, 40)]
        pool = self.pool_from(items)
        self.assertEqual(pool["unmappedSectorCount"], 0)
        for c in pool["candidates"]:
            self.assertTrue(c["sector"])

    def test_15o_cap_at_snapshot_is_recorded(self):
        """40위 컷이 knife-edge라 그때의 시총 원값을 남겨야 사후 추적이 된다."""
        pool = self.pool_from([snap_item("100000", cap=1.234e12)])
        c = pool["candidates"][0]
        self.assertEqual(c["capAtSnapshot"], 1.234e12)
        self.assertEqual(c["capAtSnapshotAsOf"], pool["sourceSnapshot"])

    def test_15p_market_reserves_keep_cap_order_per_market(self):
        items = [snap_item("100000", market="KOSPI", cap=1.0e11),
                 snap_item("200000", market="KOSPI", cap=3.0e11),
                 snap_item("300000", market="KOSDAQ", cap=9.0e12),
                 snap_item("400000", market="KOSDAQ", cap=8.0e12)]
        pool = self.pool_from(items)
        # 본문은 전체 시총 순
        self.assertEqual([c["code"] for c in pool["candidates"]],
                         ["300000", "400000", "200000", "100000"])
        # 예비 명단은 시장별로 같은 규칙(시총 내림차순)
        self.assertEqual([c["code"] for c in pool["marketReserves"]["KOSPI"]],
                         ["200000", "100000"])
        self.assertEqual([c["code"] for c in pool["marketReserves"]["KOSDAQ"]],
                         ["300000", "400000"])
        self.assertEqual(pool["marketReserveSize"], standby.MARKET_RESERVE_SIZE)

    def test_15h_no_snapshot_means_no_pool(self):
        pool = standby.build_pool(snapshot=None, covered_codes=(), now=NOW)
        self.assertEqual(pool["status"], "NO_SNAPSHOT")
        self.assertEqual(pool["candidates"], [])

    def test_15i_target_never_exceeds_50(self):
        items = [snap_item("%06d" % (i * 10), cap=1e12 + i) for i in range(1, 200)]
        pool = self.pool_from(items)
        self.assertLessEqual(pool["candidateCount"], standby.TARGET_MAX)
        pool2 = self.pool_from(items, target=999)
        self.assertLessEqual(pool2["candidateCount"], standby.TARGET_MAX)


# ═══════════════════════════════════════════════════════════════════════════
# 16~23. Proposal · Coverage Version 불변식
# ═══════════════════════════════════════════════════════════════════════════
def fake_report(*, target=600, configured=600, delisted=0, other_causes=(),
                market="KOSPI"):
    findings = []
    for i in range(delisted):
        code = "%06d" % ((i + 1) * 10)
        findings.append({"code": code, "name": "폐지%s" % code, "sector": "테스트",
                         "market": market,
                         "cause": guardian.DELISTED_CONFIRMED, "replaceable": True,
                         "missingDayCount": 5, "elapsedTradingDays": 15,
                         "evidence": ["테스트"],
                         "fingerprint": guardian.fingerprint(
                             code, guardian.DELISTED_CONFIRMED)})
    for i, cause in enumerate(other_causes):
        code = "%06d" % ((900 + i) * 10)
        findings.append({"code": code, "name": "정상%s" % code, "sector": "테스트",
                         "market": market,
                         "cause": cause, "replaceable": False,
                         "missingDayCount": 9, "elapsedTradingDays": 20,
                         "evidence": ["테스트"],
                         "fingerprint": guardian.fingerprint(code, cause)})
    return {"targetCoverage": target, "configuredCoverage": configured,
            "coverageVersion": coverage_version.current_version(),
            "findings": findings,
            "missingPriceCodes": [f["code"] for f in findings]}


def fake_pool(n=5, market="KOSPI"):
    return {"candidates": [
        {"code": "%06d" % ((700 + i) * 10), "name": "후보%d" % i, "market": market,
         "sector": "테스트", "marketCap": 1e12, "capRank": i + 1,
         "tradableStatus": "TRADABLE", "instrumentType": "COMMON",
         "basis": "source_stockEndType", "checkedAt": NOW.isoformat(),
         "sourceSnapshot": NOW.isoformat(), "eligibilityVerdict": "ELIGIBLE_STANDBY",
         "fingerprint": "f%015d" % i}
        for i in range(n)], "sourceSnapshot": NOW.isoformat()}


class ProposalContractTest(unittest.TestCase):
    def test_16_fail_closed_when_expected_size_is_not_target(self):
        """⑯ 적용 후 예상이 정확히 600이 아니면 제안을 만들지 않는다."""
        rep = fake_report(target=600, configured=599, delisted=1)
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=fake_pool(),
                                      now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_FAIL_CLOSED)
        self.assertEqual(doc["expectedConfiguredCoverage"], 599)
        self.assertEqual(doc["additions"], [])
        self.assertEqual(doc["removals"], [])

    def test_16b_fail_closed_when_not_enough_candidates(self):
        rep = fake_report(delisted=3)
        doc = proposal.build_proposal(coverage_report=rep,
                                      standby_pool=fake_pool(1), now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_FAIL_CLOSED)
        self.assertEqual(doc["additions"], [])

    def test_16c_no_proposal_for_non_replaceable_causes(self):
        rep = fake_report(delisted=0, other_causes=(
            guardian.TEMP_DATA_FAILURE, guardian.LISTED_BUT_SUSPENDED,
            guardian.CORPORATE_EVENT, guardian.PIPELINE_BUG, guardian.UNKNOWN))
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=fake_pool(),
                                      now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_NO_PROPOSAL)
        self.assertEqual(len(doc["nonReplaceableMissing"]), 5)

    def test_16d_valid_proposal_keeps_size_exactly_target(self):
        rep = fake_report(delisted=2)
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=fake_pool(),
                                      now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        self.assertEqual(doc["expectedConfiguredCoverage"], 600)
        self.assertEqual(len(doc["removals"]), len(doc["additions"]))

    def test_16e_replacement_must_come_from_the_same_market(self):
        """⭐ 2026-08-25 퀀트 감사 MEDIUM — 시장(KOSPI/KOSDAQ)을 바꿔 끼우지 않는다."""
        rep = fake_report(delisted=1, market="KOSPI")
        pool = {"candidates": [
            {"code": "111110", "name": "코스닥대형", "market": "KOSDAQ",
             "marketCap": 9.0e12, "capRank": 1,
             "eligibilityVerdict": "ELIGIBLE_STANDBY"},
            {"code": "222220", "name": "코스피중형", "market": "KOSPI",
             "marketCap": 4.0e11, "capRank": 2,
             "eligibilityVerdict": "ELIGIBLE_STANDBY"}]}
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=pool, now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        # 시총이 20배 큰 코스닥 종목이 있어도 같은 시장(KOSPI)을 고른다
        self.assertEqual([c["code"] for c in doc["additions"]], ["222220"])
        self.assertTrue(doc["marketMatched"])

    def test_16f_fail_closed_when_no_candidate_in_that_market(self):
        rep = fake_report(delisted=1, market="KOSPI")
        pool = {"candidates": [
            {"code": "111110", "name": "코스닥", "market": "KOSDAQ",
             "marketCap": 9.0e12, "capRank": 1,
             "eligibilityVerdict": "ELIGIBLE_STANDBY"}]}
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=pool, now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_FAIL_CLOSED)
        self.assertIn("같은 시장", doc["reason"])
        self.assertEqual(doc["additions"], [])

    def test_16g_market_reserves_are_used_when_main_list_lacks_the_market(self):
        """본문 40개가 전부 코스닥이어도 시장별 예비 명단에서 코스피를 찾는다."""
        rep = fake_report(delisted=1, market="KOSPI")
        pool = {"candidates": [
            {"code": "111110", "name": "코스닥", "market": "KOSDAQ",
             "marketCap": 9.0e12, "capRank": 1,
             "eligibilityVerdict": "ELIGIBLE_STANDBY"}],
            "marketReserves": {"KOSPI": [
                {"code": "333330", "name": "코스피예비", "market": "KOSPI",
                 "marketCap": 4.3e11, "capRank": 1,
                 "eligibilityVerdict": "ELIGIBLE_STANDBY"}]}}
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=pool, now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_AWAITING)
        self.assertEqual([c["code"] for c in doc["additions"]], ["333330"])

    def test_16h_unknown_market_is_fail_closed(self):
        rep = fake_report(delisted=1, market=None)
        doc = proposal.build_proposal(coverage_report=rep, standby_pool=fake_pool(),
                                      now=NOW)
        self.assertEqual(doc["status"], proposal.STATUS_FAIL_CLOSED)
        self.assertIn("시장미상", doc["reason"])

    def test_17_coverage_version_unchanged_before_membership_change(self):
        """⑰ membership이 실제로 바뀌기 전에는 Coverage Version이 그대로다."""
        before = coverage_version.current_version()
        doc = proposal.build_proposal(coverage_report=fake_report(delisted=1),
                                      standby_pool=fake_pool(), now=NOW)
        self.assertEqual(coverage_version.current_version(), before)
        self.assertEqual(doc["currentCoverageVersion"], before)
        self.assertNotEqual(doc["draftCoverageVersion"], before)

    def test_18_new_version_is_draft_only_until_approval(self):
        doc = proposal.build_proposal(coverage_report=fake_report(delisted=1),
                                      standby_pool=fake_pool(), now=NOW)
        versions = [e["version"] for e in coverage_version.COVERAGE_HISTORY]
        self.assertEqual(doc["draftCoverageVersion"], "GAEO_COVERAGE_V3_600")
        self.assertNotIn(doc["draftCoverageVersion"], versions)
        self.assertTrue(doc["approvalRequired"])

    def test_19_past_versions_never_modified(self):
        before = copy.deepcopy(coverage_version.COVERAGE_HISTORY)
        proposal.build_proposal(coverage_report=fake_report(delisted=1),
                                standby_pool=fake_pool(), now=NOW)
        self.assertEqual(before, coverage_version.COVERAGE_HISTORY)
        self.assertEqual(before[0]["version"], "GAEO_COVERAGE_V1_500")
        self.assertEqual(before[0]["effectiveTo"], "2026-08-14")

    def test_20_no_backfill_of_past_records(self):
        """⑳ 과거 날짜는 그 시절 Version 그대로여야 한다(소급 금지)."""
        self.assertEqual(coverage_version.version_for_date("2026-07-01"),
                         "GAEO_COVERAGE_V1_500")
        proposal.build_proposal(coverage_report=fake_report(delisted=1),
                                standby_pool=fake_pool(), now=NOW)
        self.assertEqual(coverage_version.version_for_date("2026-07-01"),
                         "GAEO_COVERAGE_V1_500")
        self.assertEqual(coverage_version.version_for_date("2026-08-20"),
                         "GAEO_COVERAGE_V2_600")

    def test_21_removed_stock_history_is_preserved(self):
        """㉑ 제거 제안이 나와도 그 종목의 과거 기록은 지우지 않는다."""
        history_before = sha(os.path.join(HERE, "history.js"))
        doc = proposal.build_proposal(coverage_report=fake_report(delisted=1),
                                      standby_pool=fake_pool(), now=NOW)
        self.assertEqual(history_before, sha(os.path.join(HERE, "history.js")))
        # 제거 근거가 문서에 남는다(무엇을 왜 뺐는지 추적 가능)
        self.assertTrue(doc["removals"][0]["evidence"])
        self.assertTrue(doc["removals"][0]["fingerprint"])
        src = _code_only(os.path.join(HERE, "gaeo_coverage", "proposal.py"))
        for banned in ("history.js", "price_history", "market_history"):
            self.assertNotIn(banned, src)

    def test_22_coverage_version_stamp_prevents_shadow_mixing(self):
        """㉒ 서로 다른 Coverage Version 기록을 섞지 않도록 stamp를 그대로 쓴다."""
        stamp = coverage_version.stamp()
        self.assertEqual(stamp["coverageUniverseVersion"],
                         coverage_version.current_version())
        self.assertEqual(stamp["coverageUniverseSize"], coverage_version.current_size())
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        rep = fx.guard()
        # 산출물이 어떤 Version 기준인지 항상 함께 기록된다
        self.assertEqual(rep["coverageVersion"], coverage_version.current_version())
        self.assertIn("coverageUniverseVersion", rep["autoAnalysisStamp"])

    def test_23_coverage_problem_is_not_reported_as_model_failure(self):
        """㉓ Coverage 문제가 Evolution "모델 판정"을 오염시키지 않는다.

        ⚠️ 2026-08-26 수정. 예전 이 테스트는 Coverage가 RED여도 알림 등급이 GREEN
           이어야 한다고 못박고 있었다(제목엔 WARN이라 써 놓고 픽스처는 RED를
           넣는 모순도 있었다). 그건 대표 지시 §4를 잘못 읽은 것이다.
           §4가 금지하는 것은 "Coverage 문제가 Evolution **Candidate/모델 판정**이
           되는 것"과 "Coverage 실패가 연구 커밋을 막는 것"이지, 보고 등급에서
           빼라는 뜻이 아니다. 오히려 §5는 "문제가 났는데 Issue에 정상이라고 쓰면
           절대 안 된다"고 못박는다. 실제로 확정 상장폐지 3건·configuredCoverage
           540/600 상태에서 제목이 🟢로 나가는 것을 보안 재감사가 CLI로 재현했다.
        """
        status_doc = {"systemHealth": "OK", "candidateCounts": {}}
        coverage_red = {"status": "RED", "statusReasons": ["시세 누락 40종목"],
                        "redCauseCounts": {"PIPELINE_BUG": 40},
                        "targetCoverage": 600, "configuredCoverage": 600}

        # ① 지켜야 할 진짜 불변식: Coverage는 Evolution 쪽 입력을 건드리지 않는다.
        before = copy.deepcopy(status_doc)
        note = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc, coverage_doc=coverage_red,
            gs_doc={"status": "WARN"})
        self.assertEqual(status_doc, before)          # 입력을 변형하지 않는다
        self.assertIn("### Coverage", note["body"])
        # Coverage 사유가 Evolution 후보/모델 실패로 둔갑하지 않는다
        self.assertNotIn("Candidate", str(coverage_red))
        self.assertEqual((status_doc.get("candidateCounts") or {}), {})

        # ② Coverage가 WARN이면 등급을 바꾸지 않는다(경보 피로 방지).
        warn = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc,
            coverage_doc=dict(coverage_red, status="WARN", redCauseCounts={}),
            gs_doc={"status": "WARN"})
        self.assertEqual(warn["level"], notification.LEVEL_GREEN)

        # ③ Coverage가 RED면 등급을 올린다 — 거짓 🟢 금지(§5).
        self.assertEqual(note["level"], notification.LEVEL_RED)
        self.assertIn("시세 누락 40종목", note["body"])
        self.assertIn("종목이 자동으로 교체되지는 않았습니다", note["body"])

    def test_23b_coverage_red_levels_are_graded_by_cause(self):
        """확정 상폐+제안 대기는 🟠(승인 필요), Universe 어긋남은 🔴(안전 문제)."""
        status_doc = {"systemHealth": "OK", "candidateCounts": {}}

        approval = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc,
            coverage_doc={"status": "RED", "statusReasons": ["상폐 1건"],
                          "redCauseCounts": {"DELISTED_CONFIRMED": 1},
                          "targetCoverage": 600, "configuredCoverage": 600},
            proposal_doc={"status": proposal.STATUS_AWAITING})
        self.assertEqual(approval["level"], notification.LEVEL_ORANGE)

        # 같은 상폐인데 제안이 없으면(FAIL_CLOSED 등) 안전 문제로 올린다
        no_proposal = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc,
            coverage_doc={"status": "RED", "statusReasons": ["상폐 1건"],
                          "redCauseCounts": {"DELISTED_CONFIRMED": 1},
                          "targetCoverage": 600, "configuredCoverage": 600},
            proposal_doc={"status": proposal.STATUS_FAIL_CLOSED})
        self.assertEqual(no_proposal["level"], notification.LEVEL_RED)

        # Universe 크기가 어긋나면 무조건 안전 문제
        universe = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc,
            coverage_doc={"status": "RED", "statusReasons": ["Universe 변경"],
                          "redCauseCounts": {},
                          "targetCoverage": 600, "configuredCoverage": 540},
            proposal_doc={"status": proposal.STATUS_AWAITING})
        self.assertEqual(universe["level"], notification.LEVEL_RED)

    def test_23d_unexplained_coverage_red_still_escalates(self):
        """원인을 특정하지 못한 RED도 조용히 넘어가지 않는다(FAIL CLOSED).

        (2026-08-26 독립 QA 감사 LOW-1: 등급 분기 두 개가 서로 가려 주고 있어서,
         어느 경로가 SAFETY를 만들었는지 구분하는 테스트가 없었다.)
        """
        status_doc = {"systemHealth": "OK", "candidateCounts": {}}
        # redCauseCounts가 비어 있고 Universe 크기도 맞는데 status만 RED다
        note = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc,
            coverage_doc={"status": "RED", "statusReasons": ["원인 미상"],
                          "redCauseCounts": {},
                          "targetCoverage": 600, "configuredCoverage": 600})
        self.assertEqual(note["level"], notification.LEVEL_RED)
        self.assertEqual(
            notification.coverage_alert_level(
                {"status": "RED", "redCauseCounts": {},
                 "targetCoverage": 600, "configuredCoverage": 600}),
            notification.COVERAGE_ALERT_SAFETY)

    def test_23e_each_red_path_is_distinguishable(self):
        """등급을 올린 경로가 서로를 가려 주지 않는지 하나씩 확인한다."""
        base = {"status": "RED", "targetCoverage": 600, "configuredCoverage": 600,
                "redCauseCounts": {}}
        # ① Universe 크기 어긋남만
        self.assertEqual(
            notification.coverage_alert_level(dict(base, configuredCoverage=540)),
            notification.COVERAGE_ALERT_SAFETY)
        # ② 상폐 아닌 RED 원인만
        self.assertEqual(
            notification.coverage_alert_level(
                dict(base, redCauseCounts={"PIPELINE_BUG": 3})),
            notification.COVERAGE_ALERT_SAFETY)
        # ③ 상폐 + 제안 대기 → 승인 등급
        self.assertEqual(
            notification.coverage_alert_level(
                dict(base, redCauseCounts={"DELISTED_CONFIRMED": 1}),
                {"status": proposal.STATUS_AWAITING}),
            notification.COVERAGE_ALERT_APPROVAL)
        # ④ 아무 것도 아님
        self.assertIsNone(notification.coverage_alert_level(dict(base, status="WARN")))

    def test_23f_collection_failure_is_not_hidden_behind_a_delisting(self):
        """⭐ 상폐와 수집장애가 섞이면 안전 문제(🔴)로 본다.

        (2026-08-26 독립 QA 감사 LOW-A: PIPELINE_BUG만 넣은 입력으로는 두 경로가
         같은 답을 내서 구분이 안 됐다. 섞인 입력이 두 경로를 갈라 준다 —
         수집장애 3건이 상폐 1건에 가려 🟠로 강등되면 안 된다.)
        """
        mixed = {"status": "RED", "statusReasons": ["상폐 1 · 수집장애 3"],
                 "redCauseCounts": {"DELISTED_CONFIRMED": 1, "PIPELINE_BUG": 3},
                 "targetCoverage": 600, "configuredCoverage": 600}
        self.assertEqual(
            notification.coverage_alert_level(mixed,
                                              {"status": proposal.STATUS_AWAITING}),
            notification.COVERAGE_ALERT_SAFETY)
        note = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc={"systemHealth": "OK", "candidateCounts": {}},
            coverage_doc=mixed, proposal_doc={"status": proposal.STATUS_AWAITING})
        self.assertEqual(note["level"], notification.LEVEL_RED)
        # 상폐만 있을 때는 승인 등급이라는 대비도 같이 고정한다
        only_delisting = dict(mixed, redCauseCounts={"DELISTED_CONFIRMED": 1})
        self.assertEqual(
            notification.coverage_alert_level(only_delisting,
                                              {"status": proposal.STATUS_AWAITING}),
            notification.COVERAGE_ALERT_APPROVAL)

    def test_23c_unmeasured_coverage_never_grades_by_stale_numbers(self):
        """이번 Run에서 측정 못 했으면 지난 숫자로 등급을 매기지 않는다."""
        status_doc = {"systemHealth": "OK", "candidateCounts": {}}
        stale_green = {"status": "RED", "runId": "old-1",
                       "redCauseCounts": {"DELISTED_CONFIRMED": 1},
                       "targetCoverage": 600, "configuredCoverage": 600}
        note = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc=status_doc, coverage_doc=stale_green,
            expected_run_id="new-1")
        # 미측정이므로 RED이되, 그 이유가 '지난 숫자'가 아니라 '미측정'이어야 한다
        self.assertEqual(note["level"], notification.LEVEL_RED)
        self.assertIn("미측정", note["body"])


# ═══════════════════════════════════════════════════════════════════════════
# 24~34. GS Reference Lab — 격리 · 정의 정합 · Production 무영향
# ═══════════════════════════════════════════════════════════════════════════
GS_SRC = os.path.join(HERE, "gaeo_reference", "gs_reference.py")


class ProposalSelectionTest(unittest.TestCase):
    """교체 후보 선택이 '입력이 정렬돼 있다'는 가정에 기대지 않는지 확인한다."""

    @staticmethod
    def _cand(code, cap, market="KOSPI"):
        return {"code": code, "name": "종목%s" % code, "market": market,
                "marketCap": cap, "capAtSnapshot": cap,
                "eligibilityVerdict": "ELIGIBLE_STANDBY"}

    def test_picks_largest_even_when_input_is_unsorted(self):
        removals = [{"code": "000010", "market": "KOSPI"}]
        small = self._cand("111110", 1.0e11)
        big = self._cand("222220", 9.0e12)
        # 일부러 작은 것을 앞에 둔다 — 앞에서부터 훑는 구현이면 여기서 틀린다.
        adds, unmatched = proposal.match_by_market(removals, [small, big])
        self.assertEqual(unmatched, [])
        self.assertEqual([a["code"] for a in adds], ["222220"])

    def test_market_is_never_crossed(self):
        removals = [{"code": "000010", "market": "KOSPI"}]
        adds, unmatched = proposal.match_by_market(
            removals, [self._cand("333330", 9.9e13, market="KOSDAQ")])
        self.assertEqual(adds, [])
        self.assertEqual(unmatched, ["KOSPI"])

    def test_tie_is_broken_deterministically(self):
        removals = [{"code": "000010", "market": "KOSPI"}]
        a = self._cand("444440", 5.0e12)
        b = self._cand("333330", 5.0e12)
        first, _ = proposal.match_by_market(removals, [a, b])
        second, _ = proposal.match_by_market(removals, [b, a])
        self.assertEqual([x["code"] for x in first], [x["code"] for x in second])
        self.assertEqual(first[0]["code"], "333330")   # 동점이면 코드 순

    def test_same_candidate_is_never_assigned_twice(self):
        removals = [{"code": "000010", "market": "KOSPI"},
                    {"code": "000020", "market": "KOSPI"}]
        adds, unmatched = proposal.match_by_market(
            removals, [self._cand("222220", 9.0e12), self._cand("111110", 1.0e11)])
        self.assertEqual([a["code"] for a in adds], ["222220", "111110"])
        self.assertEqual(unmatched, [])


class NotificationClaimAccuracyTest(unittest.TestCase):
    """알림이 적는 '상장폐지 확정 조건'이 실제 코드와 정확히 같은지 확인한다.

    알림이 실제보다 헐겁게(또는 빡빡하게) 적히면 대표가 잘못 이해한다.
    """

    def _body(self):
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        rep = fx.guard()
        return "\n".join(notification._coverage_block(rep)), rep

    # 알림 본문에 각 상수가 어떤 모양으로 찍히는지 적어 둔 계약표.
    # 새 상수를 delistingRules에 넣으면 여기에도 표기 방법을 적어야 한다.
    RENDERED = {
        "persistentMissingMinDays": lambda v: str(int(v)),
        "minElapsedTradingDays": lambda v: str(int(v)),
        "snapshotMaxAgeDays": lambda v: str(int(v)),
        "krxCorplistMaxAgeDays": lambda v: str(int(v)),
        "krxCorplistMinCount": lambda v: str(int(v)),
        "megaCapRankGuard": lambda v: str(int(v)),
        "massMissingBlock": lambda v: str(int(v)),
        "massAbsenceBlock": lambda v: str(int(v)),
        "massAbsenceWindowDays": lambda v: str(int(v)),
        "snapshotMinItemCount": lambda v: str(int(v)),
        "capMemoryMinSamples": lambda v: str(int(v)),
        "megaCapAbsFloor": lambda v: "%.2f조" % (v / 1e12),
        "massAbsenceTotalRatio": lambda v: str(v),
    }

    def test_every_real_guard_value_is_stated(self):
        """⭐ 상폐 조건표에 빠진 가드가 하나도 없어야 한다.

        예전 이 테스트는 7개 키만 봤는데 delistingRules에는 13개 넘는 숫자가 있었다.
        그래서 3차 감사가 추가한 절대 시총 하한(1조)이 대표가 읽는 조건표에 한 글자도
        없는 채로 통과했다(2026-08-26 독립 QA 감사 MEDIUM-A).
        이제 **숫자형 규칙 전부**를 훑고, 표기 방법이 안 적힌 새 상수가 있으면
        그 자체로 실패한다.
        """
        body, rep = self._body()
        rules = rep["delistingRules"]
        numeric = {k: v for k, v in rules.items()
                   if isinstance(v, (int, float)) and not isinstance(v, bool)}
        self.assertEqual(sorted(set(numeric) - set(self.RENDERED)), [],
                         "새 가드 상수가 알림 문구 계약표에 없다")
        for key, value in numeric.items():
            self.assertIn(self.RENDERED[key](value), body,
                          "%s(%s)이 알림 본문에 없다" % (key, value))

    def test_report_exposes_every_constant_the_notification_needs(self):
        """알림이 읽는 키가 보고서에 실제로 있는지(빠지면 '측정값 없음'이 된다)."""
        _, rep = self._body()
        rules = rep["delistingRules"]
        for key in ("persistentMissingMinDays", "minElapsedTradingDays",
                    "snapshotMaxAgeDays", "krxCorplistMaxAgeDays",
                    "krxCorplistMinCount", "megaCapRankGuard", "massMissingBlock"):
            self.assertIsNotNone(rules.get(key))

    def test_attention_causes_are_never_hidden(self):
        """RED로 올리지 않는 분류도 본문에 건수와 이름이 그대로 적힌다."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, rep = live_then_delisted(tmp)
        os.remove(fx.krx)
        rep = fx.guard(now=NOW + datetime.timedelta(days=22))
        self.assertEqual(rep["status"], guardian.STATUS_WARN)   # RED는 아니다
        body = "\n".join(notification._coverage_block(rep))
        self.assertIn(guardian.INDEPENDENT_SOURCE_STALE, body)
        self.assertIn("사람 확인이 필요하지만 즉시 위험은 아닌 건", body)


class GsIsolationTest(unittest.TestCase):
    def test_24_not_a_production_dependency(self):
        """㉔ Production 코드 어디서도 gaeo_reference를 import하지 않는다."""
        targets = ["analyze_auto.py", "compute_indicators.py", "archive_analysis.py",
                   "compute_model_intelligence.py", "compute_team_weights.py",
                   "update_prices.py", "collect_analyst_data.py", "run_evolution_lab.py"]
        targets += [os.path.join("gaeo_evolution", f)
                    for f in sorted(os.listdir(os.path.join(HERE, "gaeo_evolution")))
                    if f.endswith(".py")]
        for rel in targets:
            path = os.path.join(HERE, rel)
            if not os.path.exists(path):
                continue
            src = _code_only(path)
            self.assertNotIn("gaeo_reference", src, rel)
            self.assertNotIn("gs_quant", src, rel)

    def test_24b_evolution_does_not_import_gaeo_coverage(self):
        """Coverage 계층도 Evolution 런타임 안으로 역류하지 않는다."""
        for f in sorted(os.listdir(os.path.join(HERE, "gaeo_evolution"))):
            if not f.endswith(".py"):
                continue
            src = _code_only(os.path.join(HERE, "gaeo_evolution", f))
            self.assertNotIn("import gaeo_coverage", src, f)
            self.assertNotIn("from gaeo_coverage", src, f)

    def test_25_no_network_or_session_calls(self):
        src = _code_only(GS_SRC)
        for banned in ("urllib", "requests", "http.client", "socket", "GsSession",
                       "gs_quant.session", "Environment.Prod", "oauth", "OAuth"):
            self.assertNotIn(banned, src, banned)

    def test_26_no_credentials_required(self):
        src = _code_only(GS_SRC)
        for banned in ("client_id", "client_secret", "api_key", "API_KEY",
                       "GS_QUANT_TOKEN", "os.environ"):
            self.assertNotIn(banned, src, banned)

    def test_26b_only_timeseries_imported(self):
        tree = ast.parse(open(GS_SRC, encoding="utf-8").read())
        gs_modules = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom) and (node.module or "").startswith("gs_quant"):
                gs_modules.add(node.module)
            elif isinstance(node, ast.Import):
                for a in node.names:
                    if a.name.startswith("gs_quant"):
                        gs_modules.add(a.name)
        self.assertTrue(gs_modules)
        for m in gs_modules:
            self.assertIn(m, ("gs_quant", "gs_quant.timeseries"), m)

    def test_27_analyze_auto_behaviour_unaffected_by_import(self):
        """㉗ 이 모듈을 import해도 analyze_auto 판단이 달라지지 않는다."""
        import analyze_auto
        sample = {"per": 10.0, "pbr": 1.0, "roe": 12.0, "div": 2.0,
                  "price": 10000, "eps": 1000}
        before = json.dumps(analyze_auto.diana_eval(sample), sort_keys=True,
                            ensure_ascii=False)
        gs_reference.build_report(cases=gs_reference.closed_form_cases(), now=NOW)
        after = json.dumps(analyze_auto.diana_eval(sample), sort_keys=True,
                           ensure_ascii=False)
        self.assertEqual(before, after)

    def test_28_definition_difference_is_not_a_mismatch(self):
        """㉘ 연율화·ddof·단위 차이를 '불일치'로 판정하지 않는다."""
        import math
        n = 20
        daily_ddof0 = 1.5766143133110304
        # GS 규약(ddof=1 × √252 × 100)으로 만든 '같은 값'
        gs_like = daily_ddof0 * math.sqrt(n / (n - 1.0)) * math.sqrt(252)
        self.assertGreater(gs_like, 20)          # 원본끼리는 20배 넘게 달라 보인다
        aligned = gs_reference.gs_vol_to_gaeo_daily(gs_like, n)
        self.assertAlmostEqual(aligned, daily_ddof0, places=9)
        self.assertAlmostEqual(gs_reference.gs_mdd_to_pct(-0.018182), -1.8182, places=9)

    def test_28b_layers_agree_without_gs_installed(self):
        """gs_quant가 없어도 ①②③은 돌고 상태는 N/A(RED 아님)."""
        report = gs_reference.build_report(cases=gs_reference.closed_form_cases(),
                                           now=NOW)
        self.assertIn(report["status"], (gs_reference.STATUS_PASS,
                                         gs_reference.STATUS_NA))
        self.assertEqual(report["checkWarn"], 0)
        for case in report["cases"]:
            vol = case["metrics"]["vol20"]
            self.assertAlmostEqual(vol["gaeo"], vol["independent"],
                                   delta=gs_reference.TOL_VOL)

    def test_28c_closed_form_matches_gaeo(self):
        report = gs_reference.build_report(cases=gs_reference.closed_form_cases(),
                                           now=NOW)
        by_name = {c["name"]: c for c in report["cases"]}
        self.assertEqual(by_name["constant_growth_1pct"]["metrics"]["vol20"]["gaeo"], 0.0)
        self.assertEqual(by_name["alternating_2pct"]["metrics"]["vol20"]["gaeo"], 2.0)
        self.assertEqual(
            by_name["single_drawdown_10pct"]["metrics"]["mdd3m"]["gaeo"], -10.0)

    def test_29_status_is_only_pass_warn_or_na(self):
        report = gs_reference.build_report(cases=gs_reference.closed_form_cases(),
                                           now=NOW)
        self.assertIn(report["status"], ("PASS", "WARN", "N/A"))
        src = _code_only(GS_SRC)
        self.assertNotIn('"RED"', src)
        self.assertNotIn("SAFE_MODE", src)

    def test_30_mismatch_creates_no_candidate(self):
        """㉚ 한 번 어긋나도 Candidate를 만들지 않는다(그 경로 자체가 없다)."""
        src = _code_only(GS_SRC)
        for banned in ("gaeo_evolution", "candidates.json", "registry",
                       "approve_production", "promote"):
            self.assertNotIn(banned, src, banned)
        bad_case = {"name": "forced", "kind": "synthetic",
                    "closes": gs_reference._series_alternating(0.02, 80),
                    "expected": {"vol20": 99.0, "mdd3m": None},
                    "why": "고의로 틀린 기대값"}
        report = gs_reference.build_report(cases=[bad_case], now=NOW)
        self.assertEqual(report["candidatesCreated"], 0)
        if report["status"] != gs_reference.STATUS_NA:
            self.assertEqual(report["status"], gs_reference.STATUS_WARN)
        self.assertTrue(report["mismatches"])

    def test_31_32_33_production_config_and_weights_untouched(self):
        """㉛㉜㉝ CHIEF·QUANT·RISK·team_weights·production_config 무변경."""
        before = repo_fingerprints()
        gs_reference.build_report(cases=gs_reference.closed_form_cases(), now=NOW)
        self.assertEqual(before, repo_fingerprints())
        src = _code_only(GS_SRC)
        for banned in ("team_weights", "production_config", "chief_eval",
                       "quant_eval", "risk_overlay", "analysis.js", "auto_analysis.js"):
            self.assertNotIn(banned, src, banned)

    def test_34_no_auto_path_from_reference_to_production(self):
        """㉞ 검산 결과가 Production으로 흘러 들어가는 경로가 없다."""
        report = gs_reference.build_report(cases=gs_reference.closed_form_cases(),
                                           now=NOW)
        design = report["designAssertions"]
        # ⚠️ 이 세 값은 '측정치'가 아니라 '설계 선언'이다 — 숫자 0을 실측인 척
        #    싣지 않는다(2026-08-25 보안 감사 MEDIUM). measured=False로 명시된다.
        self.assertFalse(design["measured"])
        for key in ("networkCalls", "credentialsUsed", "isProductionDependency"):
            self.assertIn("정적 검증", design[key])
        self.assertIn("GsIsolationTest", design["verifiedBy"])
        self.assertEqual(report["candidatesCreated"], 0)
        self.assertNotIn("networkCalls", report)   # 실측치 자리에 상수를 두지 않는다
        # 산출물 경로는 저장소 커밋 대상이 아니다(.gitignore로 차단)
        ignore = open(os.path.join(HERE, ".gitignore"), encoding="utf-8").read()
        self.assertIn("gaeo_reference/state/", ignore)
        const = json.load(open(
            os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
            encoding="utf-8"))
        self.assertNotIn("gaeo_reference/state/", const["autoCommitAllowlist"])

    # ── 2026-08-25 퀀트 감사 HIGH/MEDIUM 회귀 방지 ────────────────────────
    def test_34a_import_success_alone_is_not_pass(self):
        """⭐ gs_quant를 불러오기만 하고 계산이 전부 실패하면 PASS가 아니다."""
        original = gs_reference.gs_metrics
        gs_reference.gs_metrics = lambda closes: {"error": "RuntimeError: forced"}
        try:
            report = gs_reference.build_report(
                cases=gs_reference.closed_form_cases(), now=NOW)
        finally:
            gs_reference.gs_metrics = original
        self.assertNotEqual(report["status"], gs_reference.STATUS_PASS)
        self.assertEqual(report["gsLegRanCases"], 0)
        if report["gsQuant"]["available"]:
            self.assertEqual(report["checkGsError"], len(report["cases"]))
            self.assertEqual(report["status"], gs_reference.STATUS_NA)
        self.assertNotIn("gs_quant", report["legsUsed"])

    def test_34b_legs_used_is_measured_not_declared(self):
        report = gs_reference.build_report(cases=gs_reference.closed_form_cases(),
                                           now=NOW)
        self.assertIn("gaeo", report["legsUsed"])
        self.assertTrue(any(l.startswith("independent:") for l in report["legsUsed"]))
        available = report["gsQuant"]["available"]
        self.assertEqual("gs_quant" in report["legsUsed"], bool(available))
        for case in report["cases"]:
            self.assertEqual("gs_quant" in case["legsUsed"],
                             bool(available) and not case["gsError"])

    def test_34c_rounding_contract_axis_is_exact(self):
        """② GAEO 값이 ③ 독립 계산을 그 자릿수로 반올림한 값과 정확히 같아야 한다."""
        report = gs_reference.build_report(
            cases=gs_reference.closed_form_cases() +
            gs_reference.real_data_cases(limit=3), now=NOW)
        checked = 0
        for case in report["cases"]:
            for key in ("vol20", "mdd3m"):
                m = case["metrics"][key]
                if m["roundingContractOk"] is None:
                    continue
                checked += 1
                self.assertTrue(m["roundingContractOk"], (case["name"], key, m))
        self.assertGreater(checked, 0)

    def test_34d_exact_axis_catches_convention_drift(self):
        """③ vs ④ 축(1e-9)이 연율화 규약 드리프트를 잡아낸다."""
        self.assertEqual(gs_reference.TOL_EXACT, 1e-9)
        self.assertLess(gs_reference.TOL_EXACT, gs_reference.TOL_VOL / 1000.0)
        # 252 → 251 드리프트는 0.2% 차이라 기존 tolerance(0.006)로는 안 잡힌다
        n, daily = 20, 1.5766143133110304
        gs_252 = daily * math.sqrt(n / (n - 1.0)) * math.sqrt(252)
        gs_251 = daily * math.sqrt(n / (n - 1.0)) * math.sqrt(251)
        drifted = gs_reference.gs_vol_to_gaeo_daily(gs_251, n)
        self.assertLess(abs(drifted - daily), gs_reference.TOL_VOL)      # 기존 축은 통과
        self.assertGreater(abs(drifted - daily), gs_reference.TOL_EXACT)  # 새 축은 검출
        _ = gs_252

    def test_34e_annualization_factor_is_explicit(self):
        src = _code_only(GS_SRC)
        self.assertIn("annualization_factor=TRADING_DAYS", src)
        self.assertEqual(gs_reference.TRADING_DAYS, 252)


# ═══════════════════════════════════════════════════════════════════════════
# 35~39. Issue 통합 · Secret · LLM
# ═══════════════════════════════════════════════════════════════════════════
class ProposalVisibilityTest(unittest.TestCase):
    """승인 전에 대표가 반드시 봐야 하는 숫자가 실제로 알림 본문에 나오는지."""

    @staticmethod
    def _proposal(add_cap, remove_cap=1.6e15):
        ratio = add_cap / remove_cap
        return {"status": proposal.STATUS_AWAITING, "reason": "확정 상장폐지 1종목",
                "appliedToTickers": False,
                "sizeMismatchCount": 1 if ratio < proposal.SIZE_MISMATCH_RATIO else 0,
                "sizeComparison": [{
                    "removeCode": "005930", "removeName": "삼성전자",
                    "removeCap": remove_cap,
                    "addCode": "002810", "addName": "삼영무역", "addCap": add_cap,
                    "capRatio": ratio,
                    "sizeMismatch": ratio < proposal.SIZE_MISMATCH_RATIO}]}

    def test_size_gap_is_printed_in_the_notification(self):
        """⭐ 제안서에만 적혀 있고 알림에 안 나오면 넣은 의미가 없다."""
        body = "\n".join(notification._standby_proposal_block(
            None, self._proposal(0.435e12)))
        self.assertIn("삼성전자", body)
        self.assertIn("삼영무역", body)
        self.assertIn("1600.00조", body)
        self.assertIn("0.43조", body)   # 0.435조 → %.2f 표기
        self.assertIn("⚠️", body)
        self.assertIn("성격이 바뀔 수 있습니다", body)

    def test_similar_size_is_not_flagged(self):
        body = "\n".join(notification._standby_proposal_block(
            None, self._proposal(1.4e15)))
        self.assertNotIn("⚠️", body)
        self.assertIn("삼영무역", body)

    def test_missing_cap_is_reported_not_invented(self):
        doc = self._proposal(0.4e12)
        doc["sizeComparison"][0]["addCap"] = None
        body = "\n".join(notification._standby_proposal_block(None, doc))
        self.assertIn("측정값 없음", body)

    def test_delisting_conditions_mention_snapshot_quality(self):
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        rep = fx.guard()
        body = "\n".join(notification._coverage_block(rep))
        self.assertIn(str(rep["delistingRules"]["snapshotMinItemCount"]), body)
        self.assertIn(str(rep["delistingRules"]["massAbsenceBlock"]), body)
        self.assertIn("수집기가 스스로 정상이라고 기록한 상태", body)


class GsDriftWatchTest(unittest.TestCase):
    """규약 드리프트 조기경보 — 판정을 바꾸지 않고 기록만 하는지 확인한다."""

    def test_early_warning_is_tighter_than_the_hard_tolerance(self):
        self.assertLess(gs_reference.EARLY_WARN_EXACT, gs_reference.TOL_EXACT)

    def test_report_carries_drift_watch_without_changing_status(self):
        rep = gs_reference.build_report()
        self.assertIn("driftWatchCount", rep)
        self.assertEqual(rep["driftWatchTolerance"], gs_reference.EARLY_WARN_EXACT)
        # status는 PASS/WARN/N/A 세 값뿐이고, 조기경보가 그 값을 만들지 않는다.
        self.assertIn(rep["status"], (gs_reference.STATUS_PASS,
                                      gs_reference.STATUS_WARN,
                                      gs_reference.STATUS_NA))

    def test_drift_watch_is_recorded_per_metric(self):
        rep = gs_reference.build_report()
        for case in rep.get("cases") or []:
            for m in (case.get("metrics") or {}).values():
                if "exactDriftWatch" in m:
                    self.assertIn(m["exactDriftWatch"], (True, False, None))


class NotificationIntegrationTest(unittest.TestCase):
    def sample_docs(self):
        coverage = {"status": "WARN", "coverageVersion": "GAEO_COVERAGE_V2_600",
                    "targetCoverage": 600, "configuredCoverage": 600,
                    "freshPriceCoverage": 598, "autoAnalysisCoverage": 598,
                    "missingPriceCodes": ["012510", "057050"],
                    "causeCounts": {"UNKNOWN": 2}, "replaceableCount": 0,
                    "snapshot": {"asOf": "2026-08-16T01:42:45+00:00", "ageDays": 9.35,
                                 "freshEnoughForDelisting": False},
                    "autoAnalysisStamp": {"coverageUniverseVersion":
                                          "GAEO_COVERAGE_V2_600"},
                    "findings": [{"code": "012510", "name": "더존비즈온",
                                  "cause": "UNKNOWN", "consecutiveMissing": 1,
                                  "fingerprint": "cc617526b7697ea1"}]}
        gs = {"status": "N/A", "reason": "gs_quant 없음", "caseCount": 3,
              "checkPass": 6, "checkWarn": 0, "checkNA": 3,
              "gsQuant": {"available": False}, "networkCalls": 0,
              "credentialsUsed": False, "isProductionDependency": False,
              "candidatesCreated": 0}
        return coverage, gs

    def test_35_no_production_change_before_approval(self):
        """㉟ 알림을 만들어도 Production 파일은 그대로다."""
        coverage, gs = self.sample_docs()
        before = repo_fingerprints()
        notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc={"systemHealth": "OK", "candidateCounts": {}},
            coverage_doc=coverage, gs_doc=gs,
            proposal_doc={"status": "NO_PROPOSAL", "reason": "없음",
                          "appliedToTickers": False})
        self.assertEqual(before, repo_fingerprints())

    def test_36_issue_builder_does_not_write_state(self):
        """㊱ Issue Builder는 상태 파일을 수정하지 않는다(읽기 전용).

        유일한 쓰기는 CLI가 --out으로 받은 알림 산출물 하나뿐이고, coverage/GS/
        Harness 상태 파일 경로에는 쓰기 호출이 존재하지 않는다.
        """
        path = os.path.join(HERE, "gaeo_evolution", "notification.py")
        writers = _write_mode_open_calls(path)
        self.assertEqual([fn for fn, _ in writers], ["main"], writers)
        self.assertIn("args", writers[0][1])
        self.assertIn("out", writers[0][1])
        src = _code_only(path)
        for banned in ("os.remove", "os.replace", "shutil.", "json.dump("):
            if banned == "json.dump(":
                continue
            self.assertNotIn(banned, src, banned)
        # SYSTEM HEALTH 섹션 함수는 순수 함수다(같은 입력 → 같은 출력, 부작용 0)
        coverage, gs = self.sample_docs()
        before = repo_fingerprints()
        a = notification.build_system_health_section(coverage_doc=coverage, gs_doc=gs)
        b = notification.build_system_health_section(coverage_doc=coverage, gs_doc=gs)
        self.assertEqual(a, b)
        self.assertEqual(before, repo_fingerprints())

    def test_36b_notification_stays_stdlib_only(self):
        """기존 격리 계약이 그대로다 — coverage/GS는 '만들어진 JSON'만 읽는다."""
        tree = ast.parse(open(os.path.join(HERE, "gaeo_evolution", "notification.py"),
                              encoding="utf-8").read())
        names = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                names += [a.name for a in node.names]
            elif isinstance(node, ast.ImportFrom):
                names.append(node.module)
        self.assertTrue(all(n in (None, "datetime", "json", "os", "re", "sys",
                                  "argparse") for n in names), names)

    def test_36c_three_blocks_present_in_every_level(self):
        coverage, gs = self.sample_docs()
        for job_failed, status_doc in ((False, {"systemHealth": "OK",
                                                "candidateCounts": {}}),
                                       (False, {"systemHealth": "OK",
                                                "candidateCounts":
                                                {"QUALIFIED_AWAITING_APPROVAL": 1}}),
                                       (True, {"systemHealth": "SAFE_MODE"})):
            note = notification.build_notification(
                owner="o", run_id="r", run_url="u", job_failed=job_failed,
                status_doc=status_doc, coverage_doc=coverage, gs_doc=gs)
            for block in ("## GAEO SYSTEM HEALTH", "### Coverage",
                          "### Goldman Reference Check", "### Evolution"):
                self.assertIn(block, note["body"], (note["level"], block))

    def test_36d_missing_docs_render_as_measurement_absent(self):
        note = notification.build_notification(
            owner="o", run_id="r", run_url="u", job_failed=False,
            status_doc={"systemHealth": "OK", "candidateCounts": {}},
            coverage_doc=None, gs_doc=None)
        self.assertIn("측정값 없음", note["body"])
        self.assertIn("### Coverage", note["body"])

    def test_37_issue_dedupe_marker_is_stable_per_run(self):
        """㊲ 같은 Run은 같은 marker를 만들어 중복 이슈를 막는다."""
        coverage, gs = self.sample_docs()
        kw = dict(owner="o", run_url="u", job_failed=False,
                  status_doc={"systemHealth": "OK", "candidateCounts": {}},
                  coverage_doc=coverage, gs_doc=gs)
        a = notification.build_notification(run_id="123", **kw)
        b = notification.build_notification(run_id="123", **kw)
        c = notification.build_notification(run_id="124", **kw)
        self.assertEqual(a["marker"], b["marker"])
        self.assertNotEqual(a["marker"], c["marker"])
        self.assertIn(a["marker"], a["body"])
        wf = open(os.path.join(HERE, ".github", "workflows", "evolution-lab.yml"),
                  encoding="utf-8").read()
        self.assertIn('--search "\\"${MARKER}\\" in:body"', wf)

    def test_38_secrets_are_redacted_in_health_section(self):
        """㊳ 자유 텍스트에 Secret 형태가 섞여도 본문에 그대로 나가지 않는다."""
        fake_token = "sk-" + "A" * 32          # 리터럴을 쪼개 스캐너 오탐 방지
        coverage = {"status": "WARN", "targetCoverage": 600,
                    "configuredCoverage": 600,
                    "findings": [{"code": "000010", "name": fake_token,
                                  "cause": "UNKNOWN", "consecutiveMissing": 1,
                                  "fingerprint": "abc"}],
                    "causeCounts": {}, "missingPriceCodes": ["000010"],
                    "snapshot": {}}
        text = notification.build_system_health_section(coverage_doc=coverage)
        self.assertNotIn(fake_token, text)
        self.assertIn("[REDACTED]", text)
        gs = {"status": "WARN", "reason": fake_token}
        text2 = notification.build_system_health_section(gs_doc=gs)
        self.assertNotIn(fake_token, text2)

    def test_38b_no_secret_literals_in_new_sources(self):
        pattern = re.compile(r"(sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}"
                             r"|AKIA[0-9A-Z]{12,})")
        for rel in ("gaeo_coverage/guardian.py", "gaeo_coverage/standby.py",
                    "gaeo_coverage/proposal.py", "gaeo_reference/gs_reference.py"):
            src = open(os.path.join(HERE, rel), encoding="utf-8").read()
            self.assertIsNone(pattern.search(src), rel)

    def test_39_no_llm_calls_anywhere_in_new_code(self):
        for rel in ("gaeo_coverage/guardian.py", "gaeo_coverage/standby.py",
                    "gaeo_coverage/proposal.py", "gaeo_coverage/__init__.py",
                    "gaeo_reference/gs_reference.py", "gaeo_reference/__init__.py"):
            src = _code_only(os.path.join(HERE, rel))
            for banned in ("anthropic", "openai", "generativelanguage", "claude",
                           "urllib.request", "requests.", "http.client"):
                self.assertNotIn(banned, src, "%s: %s" % (rel, banned))


# ═══════════════════════════════════════════════════════════════════════════
# 40~43. Parity · 기존 계약 · 워크플로우(§22)
# ═══════════════════════════════════════════════════════════════════════════
class ParityAndWorkflowTest(unittest.TestCase):
    def test_40_analyze_auto_parity_digest_is_stable(self):
        """㊵ 실제 지표로 돌린 CHIEF 판단이 이 변경 전후로 동일하다(결정론 확인)."""
        import analyze_auto
        ind = json.load(open(os.path.join(HERE, "indicators.json"), encoding="utf-8"))
        codes = sorted((ind.get("stocks") or {}).keys())[:40]
        tw = analyze_auto.load_team_weights()
        model = analyze_auto.load_model_intelligence()
        try:
            qstats = analyze_auto.load_quant_stats()
        except Exception:
            qstats = {}

        def digest():
            rows = []
            for code in codes:
                e = ind["stocks"][code]
                t = e.get("tech")
                if not t or not e.get("price"):
                    continue
                ctx = dict(e)
                ctx["marketRegime"] = ind.get("marketRegime") or {}
                nova = analyze_auto.quant_eval(e, t, qstats, "기타")
                chief = analyze_auto.chief_eval(
                    ctx, analyze_auto.taro_eval(t), analyze_auto.diana_eval(e),
                    nova, analyze_auto.flow_eval(e.get("flow")),
                    weights=tw["global"], learned=tw["learned"],
                    guard_policy=model.get("reboundGuard"),
                    confidence_model=model.get("confidenceModel"))
                rows.append((code, chief.get("call"), chief.get("total")))
            return hashlib.sha256(json.dumps(rows, ensure_ascii=False,
                                             sort_keys=True).encode()).hexdigest()

        first = digest()
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        fx.guard()
        fx.pool()
        fx.propose()
        gs_reference.build_report(cases=gs_reference.closed_form_cases(), now=NOW)
        self.assertEqual(first, digest())

    def test_41_constitution_promotion_floor_unchanged(self):
        """㊶ Promotion Floor는 손대지 않았다 + checksum이 맞는다."""
        from gaeo_evolution import constitution
        const = constitution.load()
        floor = const["promotionFloor"]
        expected = {"prospectiveN": 500, "prospectiveActionN": 100,
                    "precisionGainPp": 1.5, "brierGain": 0.005, "coveragePct": 15,
                    "testDays": 40, "testRegimes": 3, "buyN": 50, "sellN": 50,
                    "maxDirectionSharePct": 80, "minUniqueDaysOffline": 20,
                    "blockBootstrapRounds": 400, "maxBuyPrecisionDropPp": 2.0,
                    "maxSellPrecisionDropPp": 2.0, "maxLargeErrorRisePp": 2.0,
                    "maxRegimeWorstDropPp": 5.0, "minRealGainPp": 0.0}
        for k, v in expected.items():
            self.assertEqual(floor[k], v, k)
        self.assertTrue(floor["precisionDeltaCiMustExcludeZero"])

    def test_41b_allowlist_added_state_dir_only(self):
        const = json.load(open(
            os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
            encoding="utf-8"))
        self.assertIn("gaeo_coverage/state/", const["autoCommitAllowlist"])
        for banned in ("tickers.js", "coverage_version.py", "data.js",
                       "auto_analysis.js"):
            self.assertNotIn(banned, const["autoCommitAllowlist"], banned)

    def test_42_no_new_workflow_file(self):
        """§22 — 새 워크플로우를 만들지 않고 evolution-lab에 붙였다."""
        names = sorted(os.listdir(os.path.join(HERE, ".github", "workflows")))
        for n in names:
            self.assertNotIn("coverage", n.lower())
            self.assertNotIn("goldman", n.lower())
            self.assertNotIn("gs-", n.lower())

    def test_42b_workflow_contract_unchanged(self):
        """(PyYAML 없이) 텍스트로만 검사한다 — schedule·concurrency·권한 그대로."""
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        text = open(path, encoding="utf-8").read()
        active = "\n".join(l for l in text.splitlines()
                           if not l.lstrip().startswith("#"))
        self.assertRegex(active, r'(?m)^\s*-\s*cron:\s*"0 23 \* \* 6"')
        self.assertIn("workflow_dispatch:", active)
        self.assertRegex(active, r"(?m)^\s*group:\s*evolution-lab\s*$")
        self.assertRegex(active, r"(?m)^\s*cancel-in-progress:\s*false\s*$")
        self.assertRegex(active, r"(?m)^\s*contents:\s*write\b")
        self.assertRegex(active, r"(?m)^\s*issues:\s*write\b")
        # 권한을 넓히지 않았다
        for banned in ("packages:", "id-token:", "actions: write", "pull-requests:"):
            self.assertNotIn(banned, active, banned)

    def test_42c_gs_runs_in_a_separate_least_privilege_job(self):
        """⭐ 2026-08-25 보안 감사 HIGH — gs-quant 설치가 push 권한 job에서 돌지 않는다."""
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        text = open(path, encoding="utf-8").read()
        active = "\n".join(l for l in text.splitlines()
                            if not l.lstrip().startswith("#"))
        # 버전 고정
        self.assertIn('pip install --quiet "gs-quant==2.1.4"', active)
        self.assertNotRegex(active, r"pip install [^\n]*gs-quant(?![=\"])")
        # 별도 job + 최소 권한 + git 자격증명 제거
        self.assertRegex(active, r"(?m)^\s{2}gs-reference:\s*$")
        gs_start = active.index("  gs-reference:")
        gs_block = active[gs_start:]
        self.assertRegex(gs_block, r"(?m)^\s*contents:\s*read\b")
        self.assertRegex(gs_block, r"(?m)^\s*persist-credentials:\s*false\b")
        self.assertNotIn("contents: write", gs_block)
        self.assertNotIn("issues: write", gs_block)
        # lab job(쓰기 권한)에는 gs-quant 설치가 없다
        lab_block = active[active.index("  lab:"):gs_start]
        self.assertNotIn("gs-quant", lab_block)
        self.assertNotIn("gaeo_reference", lab_block)
        # 두 job은 서로 needs가 없다 = 느리거나 실패해도 연구/커밋/알림을 막지 않는다
        self.assertNotIn("needs:", active)
        # 기존 계약: '|| true'로 진짜 오류를 감추지 않는다
        self.assertNotIn("|| true", text)
        self.assertNotIn("|| exit 0", text)

    def test_42c2_coverage_never_blocks_evolution_commit(self):
        """⭐ 2026-08-25 재감사 LOW-1 (§4) — Coverage 실패가 연구 커밋을 막지 않는다."""
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        active = "\n".join(l for l in open(path, encoding="utf-8").read().splitlines()
                            if not l.lstrip().startswith("#"))
        cov = active[active.index("      - name: Coverage Guardian"):
                     active.index("      - name: Enforce commit allowlist")]
        # (1) 이 단계는 job 상태에 영향을 주지 않는다 → 뒤의 allowlist/commit이 돈다
        self.assertIn("continue-on-error: true", cov)
        self.assertIn("if: always()", cov)
        # (2) 단계 안에 job을 죽일 수 있는 코드가 없다
        self.assertNotIn("sys.exit(1)", cov)
        self.assertNotIn("set -euo pipefail", cov)
        # (3) coverage outcome이 Evolution 실패 판정 체인에 들어가지 않는다
        self.assertNotIn("OUTCOME_COVERAGE_GUARD", active)
        self.assertNotIn('FAILED_STEP="Coverage Guardian"', active)
        # (4) allowlist/commit 단계는 coverage 뒤에 그대로 있다
        self.assertLess(active.index("Coverage Guardian"),
                        active.index("Enforce commit allowlist"))
        self.assertIn("Commit allowlisted results", active)

    def test_42c3_unmeasured_coverage_is_still_reported_red(self):
        """⭐ 같은 수정으로 '거짓 GREEN'이 되살아나지 않는다(보안 감사 MEDIUM 유지)."""
        status_doc = {"systemHealth": "OK", "candidateCounts": {}}
        fresh = {"status": "PASS", "generatedAt": "2026-08-25T09:00:00+09:00",
                 "runId": "777-1", "targetCoverage": 600, "configuredCoverage": 600,
                 "missingPriceCodes": [], "causeCounts": {}, "snapshot": {},
                 "findings": []}
        ok = notification.build_notification(
            owner="o", run_id="777", run_url="u", job_failed=False,
            status_doc=status_doc, expected_run_id="777-1",
            coverage_doc=fresh, standby_doc=dict(fresh), proposal_doc=dict(fresh),
            today="2026-08-25")
        self.assertEqual(ok["level"], notification.LEVEL_GREEN)

        # 이번 Run 산출물이 하나라도 아니면 RED
        stale = dict(fresh, runId="776-1")
        bad = notification.build_notification(
            owner="o", run_id="777", run_url="u", job_failed=False,
            status_doc=status_doc, expected_run_id="777-1",
            coverage_doc=stale, standby_doc=dict(fresh), proposal_doc=dict(fresh),
            today="2026-08-25")
        self.assertEqual(bad["level"], notification.LEVEL_RED)
        self.assertIn("Coverage 실측을 하지", bad["body"])
        # 연구 기록은 정상 커밋됐다는 사실을 정확히 적는다(과장·축소 금지)
        self.assertIn("연구 기록: 정상 커밋됨", bad["body"])
        self.assertIn("Production 자동승격: 없음", bad["body"])
        self.assertIn("**이번 주 미측정**", bad["body"])

        # 산출물이 아예 없어도 RED
        none = notification.build_notification(
            owner="o", run_id="777", run_url="u", job_failed=False,
            status_doc=status_doc, expected_run_id="777-1", today="2026-08-25")
        self.assertEqual(none["level"], notification.LEVEL_RED)

    def test_42c4_same_day_rerun_hole_is_closed(self):
        """⭐ 재감사 LOW-3 — 같은 날 앞선 run 산출물이 남아 있어도 통과하지 않는다."""
        yesterday_run_today_date = {
            "status": "PASS", "generatedAt": "2026-08-25T09:00:00+09:00",
            "runId": "776-1",                      # 같은 날, 앞선 run
            "targetCoverage": 600, "configuredCoverage": 600,
            "missingPriceCodes": [], "causeCounts": {}, "snapshot": {}, "findings": []}
        docs = {"coverage": yesterday_run_today_date,
                "standby": dict(yesterday_run_today_date),
                "proposal": dict(yesterday_run_today_date)}
        # 날짜만 보면 통과해 버린다(감사자가 재현한 구멍)
        by_date, _ = notification.coverage_freshness(docs, today="2026-08-25")
        self.assertTrue(by_date)
        # Run 식별자로 보면 막힌다
        by_run, reasons = notification.coverage_freshness(docs, expected_run_id="777-1")
        self.assertFalse(by_run)
        self.assertEqual(len(reasons), 3)
        for reason in reasons:
            self.assertIn("777-1", reason)
        # 본문에도 각인 값이 그대로 보인다
        text = notification.build_system_health_section(
            coverage_doc=yesterday_run_today_date, expected_run_id="777-1")
        self.assertIn("776-1", text)
        self.assertIn("이번 주 미측정", text)

    def test_42c5_artifacts_carry_this_run_stamp(self):
        """산출물 3종이 실제로 runId를 각인한다(로컬 실행에서도 깨지지 않는다)."""
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        fx, _ = make_fixture(tmp, missing=("000010",))
        rep = guardian.run(tickers_path=fx.tickers, data_js_path=fx.data,
                           auto_js_path=fx.auto, snapshot_path=fx.snapshot,
                           universe_state_path=os.path.join(tmp, "none.json"),
                           krx_corplist_path=fx.krx, market_map_path=fx.market_map,
                           observations_path=fx.observations, report_out=fx.report,
                           now=NOW, run_id="12345-2")
        pool = standby.run(snapshot_path=fx.snapshot, tickers_path=fx.tickers,
                           sector_map_path=fx.sector_map, out=fx.standby, now=NOW,
                           run_id="12345-2")
        doc = proposal.run(coverage_path=fx.report, standby_path=fx.standby,
                           out=fx.proposal, now=NOW, run_id="12345-2")
        for artifact in (rep, pool, doc):
            self.assertEqual(artifact["runId"], "12345-2")
        # 로컬(식별자 없음)에서는 None이고, 그래도 예외 없이 돈다
        self.assertIsNone(guardian.resolve_run_id(None))
        ok, _ = notification.coverage_freshness(
            {"coverage": rep, "standby": pool, "proposal": doc},
            expected_run_id="12345-2")
        self.assertTrue(ok)

    def test_42c6_workflow_passes_run_stamp_to_both_sides(self):
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        active = "\n".join(l for l in open(path, encoding="utf-8").read().splitlines()
                            if not l.lstrip().startswith("#"))
        self.assertIn("GAEO_RUN_STAMP: ${{ github.run_id }}-${{ github.run_attempt }}",
                      active)
        self.assertIn('--run-id "$GAEO_RUN_STAMP"', active)
        self.assertIn('--expect-run-id "${GAEO_RUN_STAMP:-}"', active)
        # 각인과 대조가 같은 값을 쓴다(둘 중 하나만 바뀌면 게이트가 항상 RED가 된다)
        self.assertEqual(active.count("GAEO_RUN_STAMP: ${{ github.run_id }}-"
                                      "${{ github.run_attempt }}"), 2)

    def test_42d_no_new_secret_reference(self):
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        text = open(path, encoding="utf-8").read()
        secrets_used = set(re.findall(r"secrets\.([A-Za-z0-9_]+)", text))
        self.assertEqual(secrets_used, {"RESEARCH_ARCHIVE_KEY"}, secrets_used)

    def test_42e_coverage_step_commits_only_state_dir(self):
        path = os.path.join(HERE, ".github", "workflows", "evolution-lab.yml")
        active = "\n".join(l for l in open(path, encoding="utf-8").read().splitlines()
                           if not l.lstrip().startswith("#"))
        const = json.load(open(
            os.path.join(HERE, "gaeo_evolution", "evolution_constitution.json"),
            encoding="utf-8"))
        allow = const["autoCommitAllowlist"]

        m = re.search(r"for p in ([^;]+); do", active)
        self.assertIsNotNone(m)
        for token in m.group(1).split():
            self.assertIn(token, allow, token)

        # Coverage 산출물은 디렉터리 통째가 아니라 *.json 만 스테이지한다.
        # (원자적 쓰기가 남기는 *.json.tmp 잔재가 allowlist prefix를 타고 커밋되는
        #  것을 막는다 — 2026-08-26 보안 재감사 LOW-2)
        g = re.search(r"for f in (\S+); do", active)
        self.assertIsNotNone(g, "coverage state 전용 add 루프가 없다")
        glob_pat = g.group(1)
        self.assertTrue(glob_pat.endswith("*.json"), glob_pat)
        state_dir = glob_pat[:-len("*.json")]
        self.assertIn(state_dir, allow, state_dir)
        self.assertEqual(state_dir, "gaeo_coverage/state/")
        # 디렉터리 통째 add가 되살아나지 않았는지도 확인한다
        self.assertNotIn("git add gaeo_coverage/state/\n", active)

    def test_43_real_repo_run_is_read_only(self):
        """실제 저장소 데이터로 돌려도 Production 파일이 바뀌지 않는다."""
        before = repo_fingerprints()
        tmp = tempfile.mkdtemp()
        self.addCleanup(shutil.rmtree, tmp, True)
        rep = guardian.run(observations_path=os.path.join(tmp, "obs.json"),
                           report_out=os.path.join(tmp, "rep.json"), now=NOW)
        pool = standby.run(out=os.path.join(tmp, "pool.json"), now=NOW)
        doc = proposal.run(coverage_path=os.path.join(tmp, "rep.json"),
                           standby_path=os.path.join(tmp, "pool.json"),
                           out=os.path.join(tmp, "prop.json"), now=NOW)
        self.assertEqual(before, repo_fingerprints())
        self.assertEqual(rep["targetCoverage"], coverage_version.CURRENT["size"])
        self.assertEqual(rep["configuredCoverage"], coverage_version.current_size())
        self.assertEqual(rep["replaceableCount"], 0)
        self.assertEqual(doc["status"], proposal.STATUS_NO_PROPOSAL)
        self.assertGreaterEqual(pool["candidateCount"], 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
