#!/usr/bin/env python3
import datetime as dt
import unittest

import content_freshness_audit as audit


class FreshnessAuditTest(unittest.TestCase):
    def test_reports_required_context(self):
        item = {"id": 7, "date": "2026-07-01", "title": "오늘 장 요약", "body": "오늘 시장은 쉬었습니다."}
        rows = audit.scan_item("news_analysis.js", "news", item, dt.date(2026, 9, 2))
        self.assertEqual(rows[0]["content_id"], 7)
        self.assertEqual(rows[0]["publication_date"], "2026-07-01")
        self.assertEqual(rows[0]["age_days"], 63)
        self.assertIn("오늘", rows[0]["context"])

    def test_quoted_text_is_classified(self):
        item = {"id": 3, "date": "2026-08-01", "body": '출처는 “내일 오른다”라고 주장했습니다.'}
        rows = audit.scan_item("stock_study.js", "study", item, dt.date(2026, 9, 2))
        self.assertTrue(rows[0]["quoted_context"])

    def test_strict_only_blocks_changed_unquoted_content(self):
        rows = [
            {"mode": "news", "content_id": 1, "quoted_context": False},
            {"mode": "news", "content_id": 2, "quoted_context": True},
            {"mode": "lesson", "content_id": 3, "quoted_context": False},
        ]
        strict = audit.strict_findings(rows, {("news", 1), ("news", 2)})
        self.assertEqual([(x["mode"], x["content_id"]) for x in strict], [("news", 1)])

    def test_generic_today_word_is_not_a_relative_time_match(self):
        item = {"id": 1, "date": "2026-07-01", "body": "오늘날 통화는 전자 기록입니다."}
        self.assertEqual(audit.scan_item("stock_lessons.js", "lesson", item, dt.date(2026, 9, 2)), [])


if __name__ == "__main__":
    unittest.main()

