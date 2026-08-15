#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO Research Archive Store — 장기 Research 데이터 저장 인프라.

저장 backend와 Research 계산 코드를 분리하는 추상화 계층이다.
나중에 저장소가 바뀌어도 Research Engine 코드를 갈아엎지 않기 위해서다.

계층
    HOT   research_archive/live/YYYY/MM/DD.jsonl        오늘·최근. 압축 안 함
    WARM  research_archive/live/YYYY/MM/DD.jsonl.gz     닫힌 날. gzip
    COLD  research_archive/archive/YYYY/MM/...          월간 묶음 + manifest

원칙
- APPEND-ONLY. 닫힌 날짜(CLOSED) 기록은 어떤 이유로도 수정하지 않는다.
- 압축은 저장형태만 바꾼다. 연구 데이터 내용은 바꾸지 않는다.
- 압축·묶음이 검증에 성공하기 전에는 원본을 절대 지우지 않는다.
- Raw Prediction이 Source of Truth다. Scorecard는 언제든 다시 만들 수 있다.
- 보관기간을 임의로(7일·30일) 정하지 않는다. 실측 후 결정한다.

⚠️ 이 디렉터리는 사이트가 읽지 않는다. index.html의 GaeoFeatures 목록에 없고
   robots.txt에서도 막는다. 사용자가 웹에서 내려받는 자료가 아니다.
"""
import gzip
import hashlib
import io
import json
import os
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_ROOT = os.path.join(HERE, "research_archive")

SCHEMA_VERSION = "research_archive_v1"
ARCHIVE_VERSION = "1.0"

# 무결성 상태값
OK = "OK"
ARCHIVE_INTEGRITY_ERROR = "ARCHIVE_INTEGRITY_ERROR"
STORAGE_MIGRATION_RECOMMENDED = "STORAGE_MIGRATION_RECOMMENDED"


# ── 공통 유틸 ────────────────────────────────────────────────────────────────
def _sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _iter_jsonl(path):
    """.jsonl / .jsonl.gz 어느 쪽이든 한 줄씩 dict로 돌려준다."""
    opener = gzip.open if path.endswith(".gz") else open
    with opener(path, "rt", encoding="utf-8") as f:
        for lineno, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            yield lineno, json.loads(line)


def _stat_records(path):
    """레코드 수 + 모델버전 집합 + 시각 범위 + 중복 키를 한 번에 센다."""
    count = 0
    versions, features, labels = set(), set(), set()
    first_ts = last_ts = None
    keys = set()
    dups = []
    missing_version, missing_ts = 0, 0
    for _lineno, rec in _iter_jsonl(path):
        count += 1
        key = (str(rec.get("code")), str(rec.get("date")))
        if key in keys:
            dups.append(key)
        keys.add(key)
        found_version = False
        found_ts = False
        for block in ("research", "researchV11"):
            b = rec.get(block)
            if not isinstance(b, dict):
                continue
            if b.get("modelVersion"):
                versions.add(b["modelVersion"]); found_version = True
            if b.get("featureVersion"):
                features.add(b["featureVersion"])
            if b.get("labelVersion"):
                labels.add(b["labelVersion"])
            ts = b.get("createdAt")
            if ts:
                found_ts = True
                if first_ts is None or ts < first_ts:
                    first_ts = ts
                if last_ts is None or ts > last_ts:
                    last_ts = ts
        if not found_version:
            missing_version += 1
        if not found_ts:
            missing_ts += 1
    return {
        "recordCount": count,
        "modelVersions": sorted(versions),
        "featureVersions": sorted(features),
        "labelVersions": sorted(labels),
        "firstPredictionTimestamp": first_ts,
        "lastPredictionTimestamp": last_ts,
        "duplicateKeys": sorted(set(dups)),
        "missingModelVersion": missing_version,
        "missingPredictionTimestamp": missing_ts,
    }


def _write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1, sort_keys=True)


# ── ResearchArchiveStore ─────────────────────────────────────────────────────
class ResearchArchiveStore:
    """Research Prediction의 저장·압축·묶음·검증을 담당한다.

    Research 계산 코드는 이 클래스의 메서드만 부른다. 파일 경로 규칙이나
    압축 방식이 바뀌어도 호출부는 그대로 둘 수 있다.
    """

    def __init__(self, root=ARCHIVE_ROOT):
        self.root = root
        self.live = os.path.join(root, "live")
        self.archive = os.path.join(root, "archive")

    # ── 경로 ────────────────────────────────────────────────────────────
    def segment_path(self, day, compressed=False):
        y, m, d = str(day)[:4], str(day)[5:7], str(day)[8:10]
        name = f"{d}.jsonl" + (".gz" if compressed else "")
        return os.path.join(self.live, y, m, name)

    def existing_segment(self, day):
        """압축 전/후 어느 쪽이든 실제로 있는 파일 경로. 없으면 None."""
        raw = self.segment_path(day, False)
        gz = self.segment_path(day, True)
        if os.path.exists(raw):
            return raw
        if os.path.exists(gz):
            return gz
        return None

    def manifest_path(self, day):
        y, m, d = str(day)[:4], str(day)[5:7], str(day)[8:10]
        return os.path.join(self.live, y, m, f"{d}.manifest.json")

    def list_days(self):
        """저장된 날짜를 오름차순으로."""
        days = []
        if not os.path.isdir(self.live):
            return days
        for y in sorted(os.listdir(self.live)):
            ydir = os.path.join(self.live, y)
            if not os.path.isdir(ydir):
                continue
            for m in sorted(os.listdir(ydir)):
                mdir = os.path.join(ydir, m)
                if not os.path.isdir(mdir):
                    continue
                for name in sorted(os.listdir(mdir)):
                    if name.endswith(".jsonl") or name.endswith(".jsonl.gz"):
                        d = name.split(".")[0]
                        if len(d) == 2 and d.isdigit():
                            days.append(f"{y}-{m}-{d}")
        return sorted(set(days))

    # ── 상태 ────────────────────────────────────────────────────────────
    def segment_state(self, day, today=None):
        """ACTIVE(오늘, 계속 쓰는 중) / CLOSED(닫힘) / COMPRESSED / MISSING."""
        today = today or datetime.date.today().isoformat()
        if os.path.exists(self.segment_path(day, True)):
            return "COMPRESSED"
        if os.path.exists(self.segment_path(day, False)):
            return "ACTIVE" if str(day) >= str(today) else "CLOSED"
        return "MISSING"

    # ── 쓰기 ────────────────────────────────────────────────────────────
    def read_day(self, day):
        """그 날 기록을 리스트로. 없으면 빈 리스트."""
        path = self.existing_segment(day)
        if not path:
            return []
        return [rec for _n, rec in _iter_jsonl(path)]

    def append_predictions(self, day, records, today=None):
        """오늘(ACTIVE) Segment에만 쓴다.

        닫힌 날짜에는 절대 쓰지 않는다. 같은 (code, date) 키가 이미 있으면
        그 날이 ACTIVE일 때만 최신 스냅샷으로 교체한다(장중 재실행).
        반환: (added, replaced)
        """
        today = today or datetime.date.today().isoformat()
        state = self.segment_state(day, today)
        if state in ("CLOSED", "COMPRESSED"):
            raise PermissionError(
                f"{day} Segment는 {state} 상태다. 닫힌 날짜에는 기록을 쓸 수 없다.")

        existing = self.read_day(day)
        index = {(str(r.get("code")), str(r.get("date"))): i
                 for i, r in enumerate(existing)}
        added = replaced = 0
        for rec in records:
            key = (str(rec.get("code")), str(rec.get("date")))
            if key in index:
                existing[index[key]] = rec
                replaced += 1
            else:
                index[key] = len(existing)
                existing.append(rec)
                added += 1

        path = self.segment_path(day, False)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            for rec in sorted(existing, key=lambda r: (str(r.get("code")), str(r.get("date")))):
                f.write(json.dumps(rec, ensure_ascii=False, separators=(",", ":")) + "\n")
        os.replace(tmp, path)
        return added, replaced

    # ── 닫기 · 압축 ─────────────────────────────────────────────────────
    def close_daily_segment(self, day, today=None):
        """하루가 끝난 Segment의 manifest를 만들어 CLOSED로 표시한다.

        오늘 파일(ACTIVE)은 닫지 않는다. 아직 쓰고 있기 때문이다.
        """
        today = today or datetime.date.today().isoformat()
        state = self.segment_state(day, today)
        if state == "MISSING":
            return None
        if state == "ACTIVE":
            return None      # 아직 쓰는 중 — 닫지 않는다
        path = self.existing_segment(day)
        stats = _stat_records(path)
        manifest = {
            "archiveVersion": ARCHIVE_VERSION,
            "schemaVersion": SCHEMA_VERSION,
            "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "period": {"type": "day", "id": day},
            "compression": "gzip" if path.endswith(".gz") else "none",
            "sourceFiles": [os.path.relpath(path, self.root)],
            "sha256": {os.path.basename(path): _sha256_file(path)},
            "status": "CLOSED",
        }
        manifest.update({k: stats[k] for k in (
            "recordCount", "modelVersions", "featureVersions", "labelVersions",
            "firstPredictionTimestamp", "lastPredictionTimestamp")})
        _write_json(self.manifest_path(day), manifest)
        return manifest

    def compress_segment(self, day, today=None, remove_source=True):
        """닫힌 Segment를 gzip으로 만든다.

        절차(요구된 순서 그대로):
          1) 원본 종료 확인  2) record count  3) SHA256  4) gzip 생성
          5) decompress test 6) 압축 전/후 count 비교 7) manifest 검증
          8) 검증 성공 후에만 원본 정리

        검증이 하나라도 실패하면 gzip 파일을 지우고 원본은 그대로 둔다.
        """
        today = today or datetime.date.today().isoformat()
        state = self.segment_state(day, today)
        if state == "COMPRESSED":
            return {"status": "ALREADY_COMPRESSED", "day": day}
        if state != "CLOSED":
            # ACTIVE(오늘)나 MISSING은 압축 대상이 아니다.
            return {"status": f"SKIPPED_{state}", "day": day}

        src = self.segment_path(day, False)
        before = _stat_records(src)
        src_hash = _sha256_file(src)
        raw_bytes = os.path.getsize(src)

        dst = self.segment_path(day, True)
        tmp = dst + ".tmp"
        try:
            with open(src, "rb") as fi, gzip.open(tmp, "wb", compresslevel=9) as fo:
                while True:
                    chunk = fi.read(1 << 20)
                    if not chunk:
                        break
                    fo.write(chunk)
            os.replace(tmp, dst)

            # 5·6) 실제로 풀어서 다시 세어 본다
            after = _stat_records(dst)
            if after["recordCount"] != before["recordCount"]:
                raise ValueError(
                    f"압축 전후 레코드 수 불일치 {before['recordCount']} != {after['recordCount']}")
            # 7) 내용 자체가 동일한지(바이트 단위)
            with gzip.open(dst, "rb") as f:
                if hashlib.sha256(f.read()).hexdigest() != src_hash:
                    raise ValueError("압축 해제 결과가 원본과 다르다")
        except Exception as ex:
            for p in (tmp, dst):
                if os.path.exists(p):
                    os.remove(p)
            return {"status": ARCHIVE_INTEGRITY_ERROR, "day": day, "error": str(ex)[:200]}

        gz_bytes = os.path.getsize(dst)
        manifest = {
            "archiveVersion": ARCHIVE_VERSION,
            "schemaVersion": SCHEMA_VERSION,
            "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "period": {"type": "day", "id": day},
            "compression": "gzip",
            "sourceFiles": [os.path.relpath(dst, self.root)],
            "sha256": {os.path.basename(dst): _sha256_file(dst),
                       os.path.basename(src): src_hash},
            "uncompressedSha256": src_hash,
            "rawBytes": raw_bytes,
            "compressedBytes": gz_bytes,
            "compressionRatio": round(gz_bytes / raw_bytes, 4) if raw_bytes else None,
            "status": "CLOSED_COMPRESSED",
        }
        manifest.update({k: before[k] for k in (
            "recordCount", "modelVersions", "featureVersions", "labelVersions",
            "firstPredictionTimestamp", "lastPredictionTimestamp")})
        _write_json(self.manifest_path(day), manifest)

        # 8) 여기까지 전부 통과했을 때만 원본을 정리한다
        if remove_source:
            os.remove(src)
        return {"status": OK, "day": day, "rawBytes": raw_bytes,
                "compressedBytes": gz_bytes,
                "compressionRatio": manifest["compressionRatio"],
                "recordCount": before["recordCount"]}

    # ── 검증 · 복원 ─────────────────────────────────────────────────────
    def verify_archive(self, day):
        """manifest와 실제 파일이 맞는지 검사한다. Restore Test의 핵심."""
        mpath = self.manifest_path(day)
        if not os.path.exists(mpath):
            return {"status": ARCHIVE_INTEGRITY_ERROR, "day": day,
                    "errors": ["manifest 없음"]}
        manifest = json.load(open(mpath, encoding="utf-8"))
        path = self.existing_segment(day)
        errors = []
        if not path:
            return {"status": ARCHIVE_INTEGRITY_ERROR, "day": day,
                    "errors": ["Segment 파일 없음"]}
        # gzip decompress + JSONL parse. 손상 형태가 다양하므로(zlib.error,
        # EOFError, UnicodeDecodeError, BadGzipFile …) 여기서는 넓게 잡는다.
        # 무결성 검사기가 예외로 죽어버리면 검사 자체가 무의미하다.
        try:
            stats = _stat_records(path)
        except Exception as ex:
            return {"status": ARCHIVE_INTEGRITY_ERROR, "day": day,
                    "errors": [f"복원 실패: {str(ex)[:120]}"]}

        if stats["recordCount"] != manifest.get("recordCount"):
            errors.append(f"레코드 수 불일치 {stats['recordCount']} != {manifest.get('recordCount')}")
        expected = (manifest.get("sha256") or {}).get(os.path.basename(path))
        if expected and expected != _sha256_file(path):
            errors.append("SHA256 불일치")
        if stats["duplicateKeys"]:
            errors.append(f"중복 키 {len(stats['duplicateKeys'])}건")
        if stats["missingModelVersion"]:
            errors.append(f"modelVersion 누락 {stats['missingModelVersion']}건")
        if stats["missingPredictionTimestamp"]:
            errors.append(f"predictionTimestamp 누락 {stats['missingPredictionTimestamp']}건")
        return {"status": OK if not errors else ARCHIVE_INTEGRITY_ERROR,
                "day": day, "errors": errors, "recordCount": stats["recordCount"],
                "modelVersions": stats["modelVersions"]}

    def restore_test(self, day):
        """압축 Archive → 복원 → parse → count/version/timestamp 확인."""
        res = self.verify_archive(day)
        path = self.existing_segment(day)
        res["restoredFrom"] = os.path.relpath(path, self.root) if path else None
        res["compressed"] = bool(path and path.endswith(".gz"))
        return res

    # ── Weekly / Monthly Rollup ─────────────────────────────────────────
    def rollup_week(self, week_id, days):
        """주간 Manifest. 개별 Prediction 값을 다시 계산하지 않는다."""
        included, hashes, counts = [], {}, 0
        versions, first_ts, last_ts = set(), None, None
        for day in days:
            path = self.existing_segment(day)
            if not path:
                continue
            stats = _stat_records(path)
            included.append(day)
            hashes[os.path.relpath(path, self.root)] = _sha256_file(path)
            counts += stats["recordCount"]
            versions |= set(stats["modelVersions"])
            if stats["firstPredictionTimestamp"] and (
                    first_ts is None or stats["firstPredictionTimestamp"] < first_ts):
                first_ts = stats["firstPredictionTimestamp"]
            if stats["lastPredictionTimestamp"] and (
                    last_ts is None or stats["lastPredictionTimestamp"] > last_ts):
                last_ts = stats["lastPredictionTimestamp"]
        if not included:
            return None
        manifest = {
            "archiveVersion": ARCHIVE_VERSION, "schemaVersion": SCHEMA_VERSION,
            "period": {"type": "week", "id": week_id},
            "weekId": week_id, "includedDays": included,
            "recordCount": counts, "modelVersions": sorted(versions),
            "firstPredictionTimestamp": first_ts, "lastPredictionTimestamp": last_ts,
            "fileHashes": hashes, "compression": "mixed",
            "archiveCreatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }
        year = week_id.split("-")[0]
        _write_json(os.path.join(self.archive, year, week_id, "manifest.json"), manifest)
        return manifest

    def rollup_month(self, month_id, remove_source=False):
        """월간 장기보관 묶음. 원본 hash·record count 검증 후에만 만든다.

        remove_source=True여도 묶음 검증이 통과하기 전에는 아무것도 지우지 않는다.
        """
        days = [d for d in self.list_days() if d[:7] == month_id]
        if not days:
            return None
        # 원본 검증 먼저
        problems = []
        total = 0
        versions, features, labels = set(), set(), set()
        first_ts = last_ts = None
        sources, hashes = [], {}
        for day in days:
            v = self.verify_archive(day)
            if v["status"] != OK:
                problems.append({"day": day, "errors": v.get("errors")})
                continue
            path = self.existing_segment(day)
            stats = _stat_records(path)
            total += stats["recordCount"]
            versions |= set(stats["modelVersions"])
            features |= set(stats["featureVersions"])
            labels |= set(stats["labelVersions"])
            if stats["firstPredictionTimestamp"] and (
                    first_ts is None or stats["firstPredictionTimestamp"] < first_ts):
                first_ts = stats["firstPredictionTimestamp"]
            if stats["lastPredictionTimestamp"] and (
                    last_ts is None or stats["lastPredictionTimestamp"] > last_ts):
                last_ts = stats["lastPredictionTimestamp"]
            rel = os.path.relpath(path, self.root)
            sources.append(rel)
            hashes[rel] = _sha256_file(path)
        if problems:
            return {"status": ARCHIVE_INTEGRITY_ERROR, "month": month_id,
                    "problems": problems}

        year = month_id[:4]
        outdir = os.path.join(self.archive, year, month_id[5:7])
        os.makedirs(outdir, exist_ok=True)
        gz_path = os.path.join(outdir, f"research-{month_id}.jsonl.gz")
        tmp = gz_path + ".tmp"
        try:
            with gzip.open(tmp, "wt", encoding="utf-8", compresslevel=9) as fo:
                for day in days:
                    for _n, rec in _iter_jsonl(self.existing_segment(day)):
                        fo.write(json.dumps(rec, ensure_ascii=False,
                                            separators=(",", ":")) + "\n")
            os.replace(tmp, gz_path)
            merged = _stat_records(gz_path)
            if merged["recordCount"] != total:
                raise ValueError(f"묶음 레코드 수 불일치 {merged['recordCount']} != {total}")
        except Exception as ex:
            for p in (tmp, gz_path):
                if os.path.exists(p):
                    os.remove(p)
            return {"status": ARCHIVE_INTEGRITY_ERROR, "month": month_id,
                    "error": str(ex)[:200]}

        manifest = {
            "archiveVersion": ARCHIVE_VERSION, "schemaVersion": SCHEMA_VERSION,
            "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "archiveCreatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "period": {"type": "month", "id": month_id},
            "includedDays": days, "recordCount": total,
            "modelVersions": sorted(versions), "featureVersions": sorted(features),
            "labelVersions": sorted(labels),
            "firstPredictionTimestamp": first_ts, "lastPredictionTimestamp": last_ts,
            "compression": "gzip",
            "sourceFiles": sources, "fileHashes": hashes,
            "sha256": {os.path.basename(gz_path): _sha256_file(gz_path)},
            "status": "MONTHLY_ARCHIVED",
        }
        _write_json(os.path.join(outdir, "manifest.json"), manifest)

        # 묶음이 정상이라는 것이 확인된 뒤에만 원본 정리를 허용한다.
        removed = []
        if remove_source:
            for day in days:
                path = self.existing_segment(day)
                if path:
                    os.remove(path); removed.append(day)
        manifest["removedSourceDays"] = removed
        return {"status": OK, "month": month_id, "recordCount": total,
                "compressedBytes": os.path.getsize(gz_path),
                "removedSourceDays": removed, "manifest": manifest}

    # ── 저장량 모니터 ───────────────────────────────────────────────────
    def storage_report(self, today=None):
        """하루 증가량과 30/90/365일 예상치. 임의의 한계를 하드코딩하지 않는다."""
        today = today or datetime.date.today().isoformat()
        days = self.list_days()
        raw_today = comp_today = new_today = 0
        total_bytes = 0
        per_day = []
        for day in days:
            path = self.existing_segment(day)
            if not path:
                continue
            size = os.path.getsize(path)
            total_bytes += size
            compressed = path.endswith(".gz")
            stats = _stat_records(path)
            per_day.append({"day": day, "bytes": size, "records": stats["recordCount"],
                            "compressed": compressed})
            if day == today:
                new_today = stats["recordCount"]
                if compressed:
                    comp_today = size
                else:
                    raw_today = size
        for root, _dirs, files in os.walk(self.archive):
            for name in files:
                total_bytes += os.path.getsize(os.path.join(root, name))

        # 압축비는 실제로 압축된 날들에서만 잰다(없으면 None).
        ratios = [m["compressionRatio"] for m in self._manifests()
                  if m.get("compressionRatio")]
        ratio = round(sum(ratios) / len(ratios), 4) if ratios else None

        # 예상치는 '최종 보관 형태(압축 후)' 기준으로 잡는다.
        # ⚠️ 이미 압축된 날의 크기에 압축비를 또 곱하면 안 된다(이중 계산).
        #    아직 압축 안 된 날만 압축비를 적용해 최종 크기를 추정한다.
        final_sizes = []
        for d in per_day:
            if d["compressed"]:
                final_sizes.append(d["bytes"])
            elif ratio:
                final_sizes.append(d["bytes"] * ratio)
            else:
                final_sizes.append(d["bytes"])
        avg = (sum(d["bytes"] for d in per_day) / len(per_day)) if per_day else 0
        projected_daily = (sum(final_sizes) / len(final_sizes)) if final_sizes else 0
        report = {
            "asof": today,
            "observedDays": len(per_day),
            "newRecordsToday": new_today,
            "rawBytesToday": raw_today,
            "compressedBytesToday": comp_today,
            "compressionRatio": ratio,
            "totalArchiveBytes": total_bytes,
            "dailyGrowthAverageBytes": round(avg),          # 지금 디스크에 있는 형태 기준
            "projectedDailyBytes": round(projected_daily),  # 압축까지 끝난 최종 형태 기준
            "estimated30dBytes": round(projected_daily * 30),
            "estimated90dBytes": round(projected_daily * 90),
            "estimated365dBytes": round(projected_daily * 365),
            "status": OK,
            "note": "보관기간·용량 한계는 실측값을 보고 정한다. 임의 상수를 두지 않는다.",
        }
        return report

    def _manifests(self):
        out = []
        for root, _dirs, files in os.walk(self.live):
            for name in files:
                if name.endswith(".manifest.json"):
                    try:
                        out.append(json.load(open(os.path.join(root, name), encoding="utf-8")))
                    except (OSError, json.JSONDecodeError):
                        continue
        return out

    # ── 유지보수 한 번에 ────────────────────────────────────────────────
    def maintain(self, today=None, compress=True):
        """닫힌 날 닫기 → 압축 → 검증. 오늘 파일은 절대 건드리지 않는다."""
        today = today or datetime.date.today().isoformat()
        actions = []
        for day in self.list_days():
            state = self.segment_state(day, today)
            if state == "ACTIVE":
                continue                        # 아직 쓰는 중
            if state == "CLOSED":
                self.close_daily_segment(day, today)
                if compress:
                    actions.append(self.compress_segment(day, today))
                else:
                    actions.append({"status": "CLOSED_NOT_COMPRESSED", "day": day})
            elif state == "COMPRESSED" and not os.path.exists(self.manifest_path(day)):
                self.close_daily_segment(day, today)
                actions.append({"status": "MANIFEST_REBUILT", "day": day})
        return actions
