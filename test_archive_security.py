#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""COMMIT 1 — Archive 보안 + 구형 그림자모델 퇴출 테스트.

핵심 불변식
  1. Key가 없으면 평문으로 대신 저장하지 않는다(FAIL CLOSED).
  2. 커밋되는 파일 어디에도 Research 평문이 남지 않는다.
  3. 어떤 모델도 프로그램 스스로 Production을 바꾸지 않는다.
"""
import glob
import json
import os
import re
import shutil
import tempfile
import unittest

import model_registry as R
import research_crypto as C
import research_store as S

HERE = os.path.dirname(os.path.abspath(__file__))


def _rec(code, day="2026-08-14"):
    return {"code": code, "date": day,
            "research": {"modelVersion": "research_v1.0", "featureVersion": "features_v1.0",
                         "labelVersion": "label_v1.0", "createdAt": day + "T00:00:00+00:00"}}


class KeyHandling(unittest.TestCase):
    def setUp(self):
        self._saved = os.environ.get(C.KEY_ENV)

    def tearDown(self):
        if self._saved is None:
            os.environ.pop(C.KEY_ENV, None)
        else:
            os.environ[C.KEY_ENV] = self._saved

    def test_key_env_name_is_separate_from_dart(self):
        """⚠️ DART 키를 암호화 키로 재사용하지 않는다."""
        self.assertEqual(C.KEY_ENV, "RESEARCH_ARCHIVE_KEY")
        import dart_client
        self.assertNotEqual(C.KEY_ENV, dart_client.KEY_ENV)

    def test_missing_key_status(self):
        os.environ.pop(C.KEY_ENV, None)
        self.assertEqual(C.key_status(), C.KEY_MISSING)
        self.assertIsNone(C.get_key())

    def test_invalid_key_status(self):
        os.environ[C.KEY_ENV] = "not-a-real-key"
        self.assertEqual(C.key_status(), C.KEY_INVALID)

    def test_base64_and_hex_keys_accepted(self):
        os.environ[C.KEY_ENV] = C.generate_key_b64()
        self.assertEqual(C.key_status(), C.OK)
        os.environ[C.KEY_ENV] = os.urandom(32).hex()
        self.assertEqual(C.key_status(), C.OK)

    def test_generated_keys_are_unique(self):
        self.assertNotEqual(C.generate_key_b64(), C.generate_key_b64())

    def test_no_key_literal_in_source(self):
        src = open(C.__file__, encoding="utf-8").read()
        self.assertFalse(re.search(r"['\"][A-Za-z0-9+/]{40,}={0,2}['\"]", src),
                         "소스에 키처럼 보이는 리터럴이 있다")

    def test_redact_removes_key(self):
        os.environ[C.KEY_ENV] = "SUPERSECRETKEYVALUE0000000000000000000000000="
        self.assertNotIn("SUPERSECRET", C.redact("oops SUPERSECRETKEYVALUE0000000000000000000000000="))


class FailClosed(unittest.TestCase):
    """Key가 없을 때 평문 fallback이 절대 일어나지 않는다."""

    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="gaeo-sec-")
        self._saved = os.environ.get(C.KEY_ENV)
        os.environ.pop(C.KEY_ENV, None)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)
        if self._saved is not None:
            os.environ[C.KEY_ENV] = self._saved

    def test_encrypt_raises_without_key(self):
        with self.assertRaises(C.ResearchArchiveKeyMissing):
            C.encrypt_bytes(b"secret", "label")

    def test_append_refuses_without_key(self):
        st = S.ResearchArchiveStore(root=self.tmp, encrypt=True)
        with self.assertRaises(C.ResearchArchiveKeyMissing):
            st.append_predictions("2026-08-14", [_rec("005930")], today="2026-08-14")

    def test_no_file_created_on_failure(self):
        st = S.ResearchArchiveStore(root=self.tmp, encrypt=True)
        try:
            st.append_predictions("2026-08-14", [_rec("005930")], today="2026-08-14")
        except C.ResearchArchiveKeyMissing:
            pass
        left = [f for f in glob.glob(self.tmp + "/**/*", recursive=True) if os.path.isfile(f)]
        self.assertEqual(left, [], "Key가 없는데 파일이 생겼다")

    def test_no_plaintext_fallback_in_source(self):
        """코드에 '키 없으면 평문으로' 같은 경로가 없는지."""
        src = open(S.__file__, encoding="utf-8").read()
        self.assertIn("FAIL CLOSED", src)
        # encrypt=True인데 평문으로 빠지는 분기가 없어야 한다
        self.assertNotIn("except research_crypto.ResearchArchiveKeyMissing", src)


class EncryptedArchive(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="gaeo-enc-")
        self._saved = os.environ.get(C.KEY_ENV)
        os.environ[C.KEY_ENV] = C.generate_key_b64()
        self.store = S.ResearchArchiveStore(root=self.tmp, encrypt=True)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)
        if self._saved is None:
            os.environ.pop(C.KEY_ENV, None)
        else:
            os.environ[C.KEY_ENV] = self._saved

    def _files(self):
        return [f for f in glob.glob(self.tmp + "/**/*", recursive=True)
                if os.path.isfile(f) and not f.endswith(".json")]

    def test_roundtrip(self):
        self.store.append_predictions("2026-08-14", [_rec("005930")], today="2026-08-14")
        self.assertEqual(self.store.read_day("2026-08-14")[0]["code"], "005930")

    def test_segment_has_enc_extension(self):
        self.store.append_predictions("2026-08-14", [_rec("005930")], today="2026-08-14")
        self.assertTrue(self.store.existing_segment("2026-08-14").endswith(".enc"))

    def test_no_plaintext_on_disk(self):
        self.store.append_predictions("2026-08-14", [_rec("005930")], today="2026-08-14")
        for f in self._files():
            blob = open(f, "rb").read()
            self.assertNotIn(b"005930", blob, f"평문 노출: {f}")
            self.assertNotIn(b"research_v1.0", blob, f"평문 노출: {f}")

    def test_compressed_segment_also_encrypted(self):
        day = "2026-08-14"
        self.store.append_predictions(day, [_rec(f"{i:06d}", day) for i in range(50)], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        res = self.store.compress_segment(day, today="2026-08-15")
        self.assertEqual(res["status"], S.OK, res)
        path = self.store.existing_segment(day)
        self.assertTrue(path.endswith(".gz.enc"))
        self.assertNotIn(b"000001", open(path, "rb").read())
        self.assertEqual(self.store.verify_archive(day)["status"], S.OK)

    def test_monthly_rollup_also_encrypted(self):
        for day in ("2026-08-10", "2026-08-11"):
            self.store.append_predictions(day, [_rec("005930", day)], today=day)
            self.store.close_daily_segment(day, today="2026-09-01")
            self.store.compress_segment(day, today="2026-09-01")
        res = self.store.rollup_month("2026-08")
        self.assertEqual(res["status"], S.OK, res)
        for f in self._files():
            self.assertNotIn(b"005930", open(f, "rb").read(), f"평문 노출: {f}")

    def test_wrong_label_fails_decrypt(self):
        """암호문을 다른 날짜 자리로 옮기면 복호가 실패해야 한다."""
        blob = C.encrypt_bytes(b"hello", "research_prediction|2026-08-14")
        with self.assertRaises(Exception):
            C.decrypt_bytes(blob, "research_prediction|2026-08-15")

    def test_tampering_detected(self):
        blob = bytearray(C.encrypt_bytes(b"hello", "L"))
        blob[-1] ^= 0xFF
        with self.assertRaises(Exception):
            C.decrypt_bytes(bytes(blob), "L")

    def test_restore_test_works_encrypted(self):
        day = "2026-08-14"
        self.store.append_predictions(day, [_rec(f"{i:06d}", day) for i in range(20)], today=day)
        self.store.close_daily_segment(day, today="2026-08-15")
        self.store.compress_segment(day, today="2026-08-15")
        r = self.store.restore_test(day)
        self.assertEqual(r["status"], S.OK, r.get("errors"))
        self.assertEqual(r["recordCount"], 20)


class OldShadowRetired(unittest.TestCase):
    """구형 그림자모델 퇴출 + 자동승격 제거."""

    @staticmethod
    def _src(name):
        return open(os.path.join(HERE, name), encoding="utf-8").read()

    def test_no_shadow_replaces_chief(self):
        src = self._src("analyze_auto.py")
        self.assertNotIn("chief = shadow_chief if promoted else baseline_chief", src)
        self.assertIn("chief = baseline_chief", src)

    def test_shadow_chief_not_computed(self):
        src = self._src("analyze_auto.py")
        code = "\n".join(l for l in src.splitlines() if not l.strip().startswith("#"))
        self.assertNotIn("shadow_chief = candidate_chief_eval(", code,
                         "구형 그림자모델이 여전히 500종목 예측을 만든다")
        self.assertIn("shadow_chief = None", code)

    def test_confidence_model_cannot_auto_apply(self):
        src = self._src("analyze_auto.py")
        code = "\n".join(l for l in src.splitlines() if not l.strip().startswith("#"))
        self.assertNotIn("if conf_model_qualified and conf_candidate is not None:\n        conf = conf_candidate", code)
        self.assertIn("conf_model_qualified = False", code)

    def test_registry_marks_archived(self):
        legacy = R.BY_ID["legacy_shadow_v3"]
        self.assertEqual(legacy["status"], R.ARCHIVED_FAILED_EXPERIMENT)
        self.assertEqual(legacy["autoPromotion"], "REMOVED")
        self.assertTrue(legacy["failureReasons"])

    def test_no_model_has_auto_promotion(self):
        for m in R.MODELS:
            self.assertIn(m["autoPromotion"], (R.AUTO_PROMOTION, "REMOVED"),
                          f"{m['displayName']}에 자동승격이 남아 있다")

    def test_archive_consumer_tolerates_none(self):
        """shadowChief=None이어도 아카이브가 깨지지 않는다."""
        import archive_analysis
        entry = archive_analysis._entry_from(
            {"chief": {"call": "HOLD", "total": 50}, "shadowChief": None,
             "base": 1000, "baseAt": "2026-08-14"}, "2026-08-14")
        self.assertNotIn("shadow", entry)
        self.assertEqual(entry["call"], "HOLD")


class ModelRegistry(unittest.TestCase):
    def test_five_models(self):
        self.assertEqual(len(R.MODELS), 5)
        self.assertEqual([m["id"] for m in R.MODELS],
                         ["base_production", "research_a", "research_b",
                          "research_c", "legacy_shadow_v3"])

    def test_display_names(self):
        self.assertEqual(R.display_name("base_production"), "GAEO 기본모델 개선판")
        self.assertEqual(R.display_name("research_a"), "GAEO 연구모델 A")
        self.assertEqual(R.display_name("research_b"), "GAEO 연구모델 B")
        self.assertEqual(R.display_name("research_c"), "GAEO 연구모델 C")
        self.assertEqual(R.display_name("legacy_shadow_v3"), "구형 그림자모델")

    def test_ab_do_not_use_dart(self):
        for mid in ("research_a", "research_b"):
            self.assertFalse(R.BY_ID[mid]["usesDart"], f"{mid}가 DART를 쓴다고 표시됐다")
            self.assertTrue(R.BY_ID[mid]["frozen"])

    def test_frozen_hashes_recorded(self):
        import research_engine as A, research_engine_v11 as B
        self.assertEqual(R.BY_ID["research_a"]["configHash"], A.config_hash())
        self.assertEqual(R.BY_ID["research_b"]["configHash"], B.config_hash())

    def test_b_has_no_primary_candidate(self):
        self.assertEqual(R.BY_ID["research_b"]["primarySelection"],
                         "NO_PRIMARY_CANDIDATE_SELECTED")

    def test_payload_serializable_and_small(self):
        payload = R.registry_payload()
        text = json.dumps(payload, ensure_ascii=False)
        self.assertLess(len(text), 20000, "레지스트리가 지나치게 크다")
        self.assertIn("autoPromotionPolicy", payload)


if __name__ == "__main__":
    unittest.main(verbosity=1)
