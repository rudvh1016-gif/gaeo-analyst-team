#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Research Archive Store 무결성 테스트 (요구 32·33번).

gzip 복원 · JSONL parse · record count · SHA256 · modelVersion 누락 ·
predictionTimestamp 누락 · 중복 키 · Append-only 위반을 전부 검사한다.
"""
import gzip
import json
import os
import shutil
import tempfile
import unittest

import research_store as S


def _rec(code, day, ts="2026-08-15T09:00:00+00:00", version="research_v1.1"):
    return {"code": code, "date": day, "source": "live_shadow_oos",
            "research": {"modelVersion": "research_v1.0", "featureVersion": "features_v1.0",
                         "labelVersion": "label_v1.0", "createdAt": ts,
                         "horizons": {"5": {"action": "HOLD_WATCH", "probability": 0.5}}},
            "researchV11": {"modelVersion": version, "featureVersion": "features_v1.1",
                            "labelVersion": "label_v1.0", "createdAt": ts,
                            "candidates": {"X": {"candidateModelId": "X",
                                                 "predictionTimestamp": ts}}}}


class StoreCase(unittest.TestCase):
    def setUp(self):
        self.root = tempfile.mkdtemp(prefix="gaeo-store-")
        self.store = S.ResearchArchiveStore(root=self.root)

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)


class DailySegment(StoreCase):
    def test_append_and_read(self):
        self.store.append_predictions("2026-08-15", [_rec("005930", "2026-08-15")],
                                      today="2026-08-15")
        rows = self.store.read_day("2026-08-15")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["code"], "005930")

    def test_segment_path_is_dated(self):
        p = self.store.segment_path("2026-08-15")
        self.assertTrue(p.endswith(os.path.join("live", "2026", "08", "15.jsonl")))

    def test_active_day_can_be_refreshed(self):
        day = "2026-08-15"
        self.store.append_predictions(day, [_rec("005930", day)], today=day)
        a, r = self.store.append_predictions(day, [_rec("005930", day, ts="T2")], today=day)
        self.assertEqual((a, r), (0, 1))
        self.assertEqual(len(self.store.read_day(day)), 1)

    def test_active_day_is_not_closed_or_compressed(self):
        day = "2026-08-15"
        self.store.append_predictions(day, [_rec("005930", day)], today=day)
        self.assertEqual(self.store.segment_state(day, today=day), "ACTIVE")
        self.assertIsNone(self.store.close_daily_segment(day, today=day))
        res = self.store.compress_segment(day, today=day)
        self.assertEqual(res["status"], "SKIPPED_ACTIVE")
        self.assertFalse(os.path.exists(self.store.segment_path(day, True)))

    def test_closed_day_rejects_writes(self):
        """닫힌 날짜 기록은 수정하지 않는다."""
        self.store.append_predictions("2026-08-14", [_rec("005930", "2026-08-14")],
                                      today="2026-08-14")
        self.store.close_daily_segment("2026-08-14", today="2026-08-15")
        with self.assertRaises(PermissionError):
            self.store.append_predictions("2026-08-14", [_rec("000660", "2026-08-14")],
                                          today="2026-08-15")


class Compression(StoreCase):
    def _closed_day(self, day="2026-08-14", n=50):
        self.store.append_predictions(day, [_rec(f"{i:06d}", day) for i in range(n)],
                                      today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        return day

    def test_compress_and_verify(self):
        day = self._closed_day()
        res = self.store.compress_segment(day, today="2026-08-15")
        self.assertEqual(res["status"], S.OK)
        self.assertEqual(res["recordCount"], 50)
        self.assertTrue(os.path.exists(self.store.segment_path(day, True)))
        self.assertFalse(os.path.exists(self.store.segment_path(day, False)),
                         "검증 통과 후에만 원본을 정리한다")

    def test_gzip_decompresses_and_parses(self):
        day = self._closed_day()
        self.store.compress_segment(day, today="2026-08-15")
        with gzip.open(self.store.segment_path(day, True), "rt", encoding="utf-8") as f:
            rows = [json.loads(l) for l in f if l.strip()]
        self.assertEqual(len(rows), 50)

    def test_record_count_preserved(self):
        day = self._closed_day(n=37)
        self.store.compress_segment(day, today="2026-08-15")
        self.assertEqual(len(self.store.read_day(day)), 37)

    def test_manifest_sha256_matches(self):
        day = self._closed_day()
        self.store.compress_segment(day, today="2026-08-15")
        v = self.store.verify_archive(day)
        self.assertEqual(v["status"], S.OK, v.get("errors"))

    def test_corrupted_gzip_is_detected(self):
        day = self._closed_day()
        self.store.compress_segment(day, today="2026-08-15")
        with open(self.store.segment_path(day, True), "r+b") as f:
            f.seek(40); f.write(b"\x00\x01\x02\x03")
        v = self.store.verify_archive(day)
        self.assertEqual(v["status"], S.ARCHIVE_INTEGRITY_ERROR)

    def test_failed_compression_keeps_source(self):
        """압축·검증이 실패하면 원본을 절대 지우지 않는다."""
        day = self._closed_day()
        src = self.store.segment_path(day, False)
        orig = S._stat_records
        S._stat_records = lambda p: {"recordCount": -1, "modelVersions": [],
                                     "featureVersions": [], "labelVersions": [],
                                     "firstPredictionTimestamp": None,
                                     "lastPredictionTimestamp": None,
                                     "duplicateKeys": [], "missingModelVersion": 0,
                                     "missingPredictionTimestamp": 0} \
            if p.endswith(".gz") else orig(p)
        try:
            res = self.store.compress_segment(day, today="2026-08-15")
        finally:
            S._stat_records = orig
        self.assertEqual(res["status"], S.ARCHIVE_INTEGRITY_ERROR)
        self.assertTrue(os.path.exists(src), "실패했는데 원본이 사라졌다")
        self.assertFalse(os.path.exists(self.store.segment_path(day, True)))

    def test_compression_does_not_change_content(self):
        day = self._closed_day()
        before = self.store.read_day(day)
        self.store.compress_segment(day, today="2026-08-15")
        self.assertEqual(self.store.read_day(day), before,
                         "압축은 저장형태만 바꾼다. 내용은 그대로여야 한다")


class IntegrityChecks(StoreCase):
    def test_missing_model_version_detected(self):
        day = "2026-08-14"
        bad = {"code": "005930", "date": day, "research": {"createdAt": "T"}}
        self.store.append_predictions(day, [bad], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        v = self.store.verify_archive(day)
        self.assertEqual(v["status"], S.ARCHIVE_INTEGRITY_ERROR)
        self.assertTrue(any("modelVersion" in e for e in v["errors"]))

    def test_missing_timestamp_detected(self):
        day = "2026-08-14"
        bad = {"code": "005930", "date": day, "research": {"modelVersion": "research_v1.0"}}
        self.store.append_predictions(day, [bad], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        v = self.store.verify_archive(day)
        self.assertTrue(any("predictionTimestamp" in e for e in v["errors"]))

    def test_duplicate_key_detected(self):
        day = "2026-08-14"
        path = self.store.segment_path(day, False)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            for _ in range(2):
                f.write(json.dumps(_rec("005930", day), ensure_ascii=False) + "\n")
        self.store.close_daily_segment(day, today="2026-08-15")
        v = self.store.verify_archive(day)
        self.assertTrue(any("중복" in e for e in v["errors"]))

    def test_record_count_mismatch_detected(self):
        day = "2026-08-14"
        self.store.append_predictions(day, [_rec("005930", day)], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        with open(self.store.segment_path(day, False), "a", encoding="utf-8") as f:
            f.write(json.dumps(_rec("000660", day), ensure_ascii=False) + "\n")
        v = self.store.verify_archive(day)
        self.assertEqual(v["status"], S.ARCHIVE_INTEGRITY_ERROR)

    def test_restore_test_reports_source(self):
        day = "2026-08-14"
        self.store.append_predictions(day, [_rec("005930", day)], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        self.store.compress_segment(day, today="2026-08-15")
        r = self.store.restore_test(day)
        self.assertEqual(r["status"], S.OK)
        self.assertTrue(r["compressed"])
        self.assertEqual(r["recordCount"], 1)
        self.assertIn("research_v1.1", r["modelVersions"])


class Rollups(StoreCase):
    def _days(self, days, n=10):
        for day in days:
            self.store.append_predictions(day, [_rec(f"{i:06d}", day) for i in range(n)],
                                          today=day)
            self.store.close_daily_segment(day, today="2026-09-01")
        return days

    def test_weekly_rollup(self):
        days = self._days(["2026-08-10", "2026-08-11", "2026-08-12"])
        m = self.store.rollup_week("2026-W33", days)
        self.assertEqual(m["recordCount"], 30)
        self.assertEqual(m["includedDays"], days)
        self.assertEqual(len(m["fileHashes"]), 3)
        for k in ("weekId", "firstPredictionTimestamp", "lastPredictionTimestamp",
                  "modelVersions", "archiveCreatedAt"):
            self.assertIn(k, m)

    def test_monthly_rollup_verifies_before_archiving(self):
        self._days(["2026-08-10", "2026-08-11"])
        res = self.store.rollup_month("2026-08")
        self.assertEqual(res["status"], S.OK)
        self.assertEqual(res["recordCount"], 20)
        self.assertEqual(res["removedSourceDays"], [], "검증만으로 원본을 지우면 안 된다")

    def test_monthly_rollup_refuses_broken_source(self):
        days = self._days(["2026-08-10", "2026-08-11"])
        with open(self.store.segment_path(days[0], False), "a", encoding="utf-8") as f:
            f.write(json.dumps(_rec("999999", days[0]), ensure_ascii=False) + "\n")
        res = self.store.rollup_month("2026-08")
        self.assertEqual(res["status"], S.ARCHIVE_INTEGRITY_ERROR)
        self.assertTrue(res["problems"])

    def test_monthly_rollup_can_remove_only_after_success(self):
        days = self._days(["2026-08-10", "2026-08-11"])
        res = self.store.rollup_month("2026-08", remove_source=True)
        self.assertEqual(res["status"], S.OK)
        self.assertEqual(sorted(res["removedSourceDays"]), sorted(days))
        gz = os.path.join(self.store.archive, "2026", "08", "research-2026-08.jsonl.gz")
        self.assertTrue(os.path.exists(gz))
        with gzip.open(gz, "rt", encoding="utf-8") as f:
            self.assertEqual(sum(1 for l in f if l.strip()), 20)

    def test_monthly_manifest_fields(self):
        self._days(["2026-08-10"])
        self.store.rollup_month("2026-08")
        mpath = os.path.join(self.store.archive, "2026", "08", "manifest.json")
        m = json.load(open(mpath, encoding="utf-8"))
        for k in ("archiveVersion", "createdAt", "period", "recordCount",
                  "modelVersions", "featureVersions", "labelVersions",
                  "firstPredictionTimestamp", "lastPredictionTimestamp",
                  "sha256", "sourceFiles", "compression", "schemaVersion"):
            self.assertIn(k, m, f"manifest에 {k} 누락")


class Maintenance(StoreCase):
    def test_maintain_never_touches_today(self):
        today = "2026-08-15"
        self.store.append_predictions(today, [_rec("005930", today)], today=today)
        self.store.append_predictions("2026-08-14", [_rec("005930", "2026-08-14")],
                                      today="2026-08-14")
        self.store.maintain(today=today)
        self.assertTrue(os.path.exists(self.store.segment_path(today, False)),
                        "오늘 파일이 압축됐다")
        self.assertFalse(os.path.exists(self.store.segment_path(today, True)))
        self.assertTrue(os.path.exists(self.store.segment_path("2026-08-14", True)))

    def test_storage_report_projection_not_double_counted(self):
        """이미 압축된 날 크기에 압축비를 또 곱하면 안 된다."""
        day = "2026-08-14"
        self.store.append_predictions(day, [_rec(f"{i:06d}", day) for i in range(200)],
                                      today=day)
        self.store.maintain(today="2026-08-15")
        rep = self.store.storage_report(today="2026-08-15")
        stored = os.path.getsize(self.store.segment_path(day, True))
        self.assertAlmostEqual(rep["projectedDailyBytes"], stored, delta=max(1, stored * 0.02))
        self.assertEqual(rep["estimated30dBytes"], round(rep["projectedDailyBytes"] * 30))
        self.assertEqual(rep["estimated365dBytes"], round(rep["projectedDailyBytes"] * 365))

    def test_storage_report_fields(self):
        day = "2026-08-15"
        self.store.append_predictions(day, [_rec("005930", day)], today=day)
        rep = self.store.storage_report(today=day)
        for k in ("newRecordsToday", "rawBytesToday", "compressedBytesToday",
                  "compressionRatio", "totalArchiveBytes", "dailyGrowthAverageBytes",
                  "estimated30dBytes", "estimated90dBytes", "estimated365dBytes"):
            self.assertIn(k, rep)
        self.assertEqual(rep["newRecordsToday"], 1)

    def test_no_hardcoded_retention_rule(self):
        """7일·30일 같은 임의 삭제 규칙을 두지 않았는지."""
        src = open(S.__file__, encoding="utf-8").read()
        for banned in ("RETENTION_DAYS", "retention_days", "delete_older_than"):
            self.assertNotIn(banned, src)


if __name__ == "__main__":
    unittest.main(verbosity=1)
