#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""probe_sector_source 승격 게이트 — 검증 실패한 후보가 last-good을 덮지 못한다.

왜 이 테스트가 있나 (2026-08-26 감사에서 실제로 발견된 결함)
    예전 main()은 두 시장의 fetch status가 OK이기만 하면 sector_map.json을
    곧바로 덮어썼다. 그런데 시장 status는 "유효한 6자리 코드가 1건이라도
    있으면 OK"라, KRX 응답이 잘려 3건만 와도 OK가 됐다. 그 상태로 덮어쓰면
    2,596법인짜리 last-good이 3법인짜리로 파괴되고 Guardian은 상장 증거를
    잃는다. crosswalk 게이트도 GATE_FAIL을 '기록만' 하고 쓰기를 막지 않았다.

    이 파일은 그 구멍이 다시 열리지 않도록 계약으로 고정한다.
    핵심 단언은 언제나 같다 — 거부되면 **기존 파일의 바이트가 변하지 않는다**.
"""
import json
import os
import shutil
import tempfile
import unittest

import probe_sector_source as ps
from gaeo_coverage.guardian import KRX_CORPLIST_MIN_COUNT


def _codes(n, start=1):
    """유효한 6자리 코드 n개 → 업종명."""
    return {f"{i:06d}": "의약품 제조업" for i in range(start, start + n)}


def _report(kospi="OK", kosdaq="OK", hist=None, fill=1.0,
            ran_at="2026-09-01T00:00:00+00:00"):
    hist = hist if hist is not None else {"의약품 제조업": 2600}
    def src(status):
        s = {"status": status, "industryFillRatio": fill}
        if status == "OK":
            s["industryHistogram"] = hist
        return s
    return {"ranAt": ran_at,
            "sources": {"krx_corplist_KOSPI": src(kospi),
                        "krx_corplist_KOSDAQ": src(kosdaq)}}


class ValidationContract(unittest.TestCase):
    def _validate(self, report, code_industry, last_good=None):
        cand = ps.build_candidate(report, code_industry)
        return ps.validate_candidate(report, cand, last_good), cand

    def test_healthy_candidate_passes(self):
        fails, cand = self._validate(_report(), _codes(2600))
        self.assertEqual(fails, [], f"정상 후보가 거부됐다: {fails}")
        self.assertEqual(cand["crosswalkCoverage"]["gate"], "GATE_PASS")

    def test_truncated_source_is_rejected(self):
        """잘린 응답(3법인)이 2,596법인을 덮으면 안 된다 — 실제 발견된 결함."""
        fails, _ = self._validate(_report(hist={"의약품 제조업": 3}), _codes(3))
        self.assertTrue(any("최소" in f for f in fails), fails)

    def test_min_count_boundary_uses_guardian_constant(self):
        """새 숫자를 만들지 않았는지 경계에서 확인한다."""
        below, _ = self._validate(_report(hist={"의약품 제조업": KRX_CORPLIST_MIN_COUNT - 1}),
                                  _codes(KRX_CORPLIST_MIN_COUNT - 1))
        self.assertTrue(any("최소" in f for f in below))
        at, _ = self._validate(_report(hist={"의약품 제조업": KRX_CORPLIST_MIN_COUNT}),
                               _codes(KRX_CORPLIST_MIN_COUNT))
        self.assertEqual(at, [])

    def test_crosswalk_gate_fail_is_rejected(self):
        """GATE_FAIL을 '기록만' 하고 통과시키던 경로가 막혔는가."""
        # crosswalk가 모르는 업종명만으로 채우면 커버리지가 0이 된다.
        fails, cand = self._validate(_report(hist={"존재하지않는업종명": 2600}),
                                     _codes(2600))
        self.assertEqual(cand["crosswalkCoverage"]["gate"], "GATE_FAIL")
        self.assertTrue(any("GATE_FAIL" in f for f in fails), fails)

    def test_one_market_down_is_rejected(self):
        """한쪽 시장만으로 전체 맵을 대체하지 않는다."""
        for k, d in (("ERROR", "OK"), ("OK", "ERROR"), ("EMPTY", "OK")):
            fails, _ = self._validate(_report(kospi=k, kosdaq=d), _codes(2600))
            self.assertTrue(fails, f"{k}/{d} 조합이 통과했다")

    def test_schema_unexpected_is_rejected(self):
        fails, _ = self._validate(_report(kospi="SCHEMA_UNEXPECTED"), _codes(2600))
        self.assertTrue(any("스키마" in f or "OK가 아니다" in f for f in fails), fails)

    def test_bad_code_format_is_rejected(self):
        codes = _codes(2600)
        codes["ABCDEF"] = "의약품 제조업"
        fails, _ = self._validate(_report(), codes)
        self.assertTrue(any("6자리" in f for f in fails), fails)

    def test_low_industry_fill_is_rejected(self):
        fails, _ = self._validate(_report(fill=0.5), _codes(2600))
        self.assertTrue(any("채움" in f for f in fails), fails)

    def test_unparseable_timestamp_is_rejected(self):
        fails, _ = self._validate(_report(ran_at="어제쯤"), _codes(2600))
        self.assertTrue(any("asOf" in f for f in fails), fails)

    def test_sudden_shrink_vs_last_good_is_rejected(self):
        """법인 수가 직전 대비 급감하면 거부한다(수집기와 같은 비율)."""
        last = {"corpCount": 2596, "map": {}}
        fails, _ = self._validate(_report(hist={"의약품 제조업": 2100}),
                                  _codes(2100), last)
        self.assertTrue(any("급감" in f for f in fails), fails)
        # 소폭 감소는 정상 변동이므로 통과해야 한다(상폐·이전상장 등).
        ok, _ = self._validate(_report(hist={"의약품 제조업": 2500}),
                               _codes(2500), last)
        self.assertEqual(ok, [])

    def test_first_run_without_last_good_is_allowed(self):
        fails, _ = self._validate(_report(), _codes(2600), None)
        self.assertEqual(fails, [])


class PromotionIsAtomicAndFailClosed(unittest.TestCase):
    """실제 파일로 확인한다 — 거부되면 바이트가 변하지 않는다."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.map_path = os.path.join(self.tmp.name, "sector_map.json")
        self._orig = ps.MAP_OUT
        ps.MAP_OUT = self.map_path
        self.addCleanup(lambda: setattr(ps, "MAP_OUT", self._orig))
        # 건강한 last-good을 깔아 둔다.
        self.last_good = {"schemaVersion": "gaeo_sector_map_v1",
                          "asOf": "2026-08-16T01:41:44+00:00",
                          "source": "krx_corplist (kind.krx.co.kr 상장법인목록 공식 업종 컬럼)",
                          "corpCount": 2596,
                          "crosswalkCoverage": {"gate": "GATE_PASS", "ratio": 0.97},
                          "map": _codes(2596)}
        with open(self.map_path, "w", encoding="utf-8") as f:
            json.dump(self.last_good, f, ensure_ascii=False)

    def _bytes(self):
        with open(self.map_path, "rb") as f:
            return f.read()

    def test_rejected_candidate_leaves_file_byte_identical(self):
        before = self._bytes()
        promoted = ps.write_sector_map(_report(hist={"의약품 제조업": 3}), _codes(3))
        self.assertFalse(promoted)
        self.assertEqual(self._bytes(), before, "거부됐는데 파일이 바뀌었다")

    def test_gate_fail_leaves_file_byte_identical(self):
        before = self._bytes()
        promoted = ps.write_sector_map(_report(hist={"존재하지않는업종명": 2600}),
                                       _codes(2600))
        self.assertFalse(promoted)
        self.assertEqual(self._bytes(), before)

    def test_passing_candidate_replaces_file(self):
        promoted = ps.write_sector_map(_report(), _codes(2600))
        self.assertTrue(promoted)
        with open(self.map_path, encoding="utf-8") as f:
            now = json.load(f)
        self.assertEqual(now["corpCount"], 2600)
        self.assertEqual(now["crosswalkCoverage"]["gate"], "GATE_PASS")

    def test_no_tmp_file_left_behind(self):
        ps.write_sector_map(_report(), _codes(2600))
        self.assertFalse(os.path.exists(self.map_path + ".tmp"))
        ps.write_sector_map(_report(hist={"의약품 제조업": 3}), _codes(3))
        self.assertFalse(os.path.exists(self.map_path + ".tmp"))

    def test_missing_last_good_is_not_a_crash(self):
        os.remove(self.map_path)
        self.assertIsNone(ps.load_last_good())
        self.assertTrue(ps.write_sector_map(_report(), _codes(2600)))

    def test_corrupt_last_good_is_treated_as_absent(self):
        with open(self.map_path, "w", encoding="utf-8") as f:
            f.write("{ 깨진 파일")
        self.assertIsNone(ps.load_last_good())


class ConstantsAreNotRedefined(unittest.TestCase):
    def test_reuses_guardian_and_collector_constants(self):
        """워크플로·프로브가 숫자를 따로 적으면 잣대가 갈라진다."""
        import gaeo_coverage.guardian as g
        import collect_market_universe as c
        self.assertEqual(ps.KRX_CORPLIST_MIN_COUNT, g.KRX_CORPLIST_MIN_COUNT)
        self.assertEqual(ps.KRX_CORPLIST_REJECT_GATES, g.KRX_CORPLIST_REJECT_GATES)
        self.assertEqual(ps.MIN_COVERAGE_RATIO, c.MIN_COVERAGE_RATIO)


class RealRepoLastGoodStillPasses(unittest.TestCase):
    def test_committed_map_would_not_be_rejected_by_its_own_gate(self):
        """지금 커밋된 맵이 새 게이트에 걸려 못 쓰게 되는 일이 없어야 한다."""
        d = ps.load_last_good()
        if d is None:
            self.skipTest("sector_map.json 없음")
        self.assertGreaterEqual(d["corpCount"], KRX_CORPLIST_MIN_COUNT)
        self.assertNotIn(d["crosswalkCoverage"]["gate"], ps.KRX_CORPLIST_REJECT_GATES)


if __name__ == "__main__":
    unittest.main(verbosity=2)
