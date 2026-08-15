#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Coverage 600 계약 테스트 (요구 64번 I·B·J).

앞으로 종목을 또 늘리거나 줄일 때 이 계약이 깨지지 않게 지킨다.
"""
import json
import os
import re
import unittest

import coverage_version as CV

HERE = os.path.dirname(os.path.abspath(__file__))


class TickersFile(unittest.TestCase):
    def setUp(self):
        self.raw = open(os.path.join(HERE, "tickers.js"), encoding="utf-8").read()
        self.rows = CV.load_tickers()

    def test_array_is_pure_json(self):
        """⚠️ 배열 안에 주석을 넣으면 compute_rotation.py가 죽는다.

        compute_rotation.load_js_value()는 주석을 걸러내지 않고 그대로 json.loads한다.
        실제로 이 규칙을 어겨서 파이프라인이 멈춘 적이 있다(2026-08-15).
        """
        m = re.search(r"const TICKERS = (\[.*?\])\s*;", self.raw, re.S)
        self.assertIsNotNone(m, "TICKERS 배열을 찾지 못했다")
        rows = json.loads(m.group(1))          # 주석 제거 없이 파싱돼야 한다
        self.assertEqual(len(rows), 600)

    def test_exactly_600_unique(self):
        codes = [r["code"] for r in self.rows]
        self.assertEqual(len(codes), 600)
        self.assertEqual(len(set(codes)), 600, "중복 종목코드가 있다")

    def test_code_format(self):
        for r in self.rows:
            self.assertRegex(r["code"], r"^\d{6}$", r)
            self.assertTrue(r["name"].strip(), r)
            self.assertTrue(r["sector"].strip(), r)

    def test_no_excluded_instrument_types(self):
        """ETF·SPAC·리츠·우선주가 Coverage에 섞이지 않았는지 (신규 100종목 기준).

        ⚠️ 기존 500종목에는 예전에 넣은 우선주가 일부 있다. 사용자 승인 없이
           빼지 않는다(기존 콘텐츠 보존 원칙). 새로 넣은 것만 검사한다.
        """
        added = set(CV.added_in_current())
        for r in self.rows:
            if r["code"] not in added:
                continue
            name = r["name"]
            self.assertNotRegex(name, r"스팩|기업인수목적", name)
            self.assertNotRegex(name, r"리츠", name)
            self.assertNotRegex(name, r"(\d?우[BC]?)$", name)
            self.assertTrue(r["code"].endswith("0"), f"{name}: 종류주 의심")

    def test_new_codes_exist_in_krx_list(self):
        """신규 종목은 실제 상장 목록에 있어야 한다(이름을 지어내지 않았다)."""
        krx = {i["c"]: i for i in
               json.load(open(os.path.join(HERE, "krx_list.json"), encoding="utf-8"))["items"]}
        by_code = {r["code"]: r for r in self.rows}
        for code in CV.added_in_current():
            self.assertIn(code, krx, f"{code}가 krx_list.json에 없다")
            self.assertEqual(by_code[code]["name"], krx[code]["n"],
                             f"{code}: tickers.js 이름과 상장 목록 이름이 다르다")


class CoverageVersioning(unittest.TestCase):
    def test_current_version_and_size_agree(self):
        self.assertEqual(CV.current_size(), 600)
        self.assertEqual(CV.current_version(), "GAEO_COVERAGE_V2_600")
        self.assertEqual(CV.CURRENT["size"], CV.current_size())

    def test_added_list_is_exactly_100(self):
        self.assertEqual(len(CV.added_in_current()), 100)
        self.assertEqual(len(set(CV.added_in_current())), 100)

    def test_history_is_append_only_and_ordered(self):
        versions = [h["version"] for h in CV.COVERAGE_HISTORY]
        self.assertEqual(versions[0], "GAEO_COVERAGE_V1_500")
        self.assertEqual(versions[-1], CV.current_version())
        sizes = [h["size"] for h in CV.COVERAGE_HISTORY]
        self.assertEqual(sizes, sorted(sizes), "Coverage 크기 이력이 시간순이 아니다")

    def test_past_dates_resolve_to_past_universe(self):
        """⚠️ 새 100종목을 과거에 소급하지 않는다."""
        self.assertEqual(CV.version_for_date("2026-07-01"), "GAEO_COVERAGE_V1_500")
        self.assertEqual(CV.version_for_date("2026-08-14"), "GAEO_COVERAGE_V1_500")
        self.assertEqual(CV.version_for_date("2026-08-15"), "GAEO_COVERAGE_V2_600")

    def test_split_by_membership(self):
        codes = [r["code"] for r in CV.load_tickers()]
        split = CV.split_by_membership(codes)
        self.assertEqual(len(split["legacy"]), 500)
        self.assertEqual(len(split["added"]), 100)

    def test_stamp_has_both_fields(self):
        s = CV.stamp()
        self.assertIn("coverageUniverseVersion", s)
        self.assertIn("coverageUniverseSize", s)


class NoHardcodedCount(unittest.TestCase):
    """숫자를 코드에 박지 않고 tickers.js 하나에서 가져오는지."""

    def test_coverage_size_comes_from_tickers(self):
        rows = CV.load_tickers()
        self.assertEqual(CV.current_size(), len(rows))

    def test_analyze_auto_stamps_coverage(self):
        """새 판단에 Coverage 정보가 실제로 붙는지."""
        with open(os.path.join(HERE, "analyze_auto.py"), encoding="utf-8") as f:
            src = f.read()
        self.assertIn("import coverage_version", src)
        self.assertIn("coverage_version.stamp()", src)
        # out(자동분석)과 research_out(연구) 둘 다에 각인돼야 한다.
        self.assertEqual(src.count("**coverage_stamp"), 2, "각인 위치가 2곳이 아니다")


if __name__ == "__main__":
    unittest.main(verbosity=2)
