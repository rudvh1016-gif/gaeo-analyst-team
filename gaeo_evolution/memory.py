# -*- coding: utf-8 -*-
"""GAEO Memory — 과거 데이터 복사본이 아니라 압축된 '경험'.

보안(Constitution·기존 Research Archive 정책과 동일):
  · 상세 Memory는 공개 저장소에 평문으로 두지 않는다.
    RESEARCH_ARCHIVE_KEY가 있으면 research_crypto로 암호화해
    research_archive/evolution/memory.jsonl.enc 에 저장한다.
  · Key가 없으면 상세 저장을 생략한다(FAIL CLOSED — 평문 fallback 없음).
  · 공개 status에는 개수·상태 집계만 나간다.

수명주기: candidate → validated → stale → deprecated.
  검증된 Memory도 영원한 진리가 아니다 — lastValidatedAt이 오래되면 stale.
Memory는 BUY/SELL을 직접 만들지 않는다. 연구/Context 힌트 전용이다.
"""
import datetime
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

ENC_PATH = os.path.join(ROOT, "research_archive", "evolution", "memory.jsonl.enc")
ENC_LABEL = "evolution/memory"
SCHEMA_VERSION = 1
STATES = ("candidate", "validated", "stale", "deprecated")
VALIDATE_MIN_EVIDENCE = 20
VALIDATE_MIN_DAYS = 10
STALE_AFTER_DAYS = 45


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _crypto():
    try:
        import research_crypto
        return research_crypto
    except Exception:
        return None


def has_key():
    """암호화 키 사용 가능 여부. 키 값 자체는 절대 읽어 출력하지 않는다."""
    return _crypto() is not None and bool(os.environ.get("RESEARCH_ARCHIVE_KEY"))


def new_memory(failure_cluster, source_model_version=None, market_regime=None):
    """실패 군집 1개 → Memory 후보 1개."""
    return {
        "memoryId": f"mem-{datetime.datetime.now().strftime('%Y%m%d')}-{failure_cluster['key'].replace(':', '-')}",
        "schemaVersion": SCHEMA_VERSION,
        "createdAt": _now(),
        "sourceModelVersion": source_model_version,
        "marketRegime": market_regime,
        "sector": failure_cluster["key"].split(":", 1)[1] if failure_cluster.get("kind") == "sector" else None,
        "failureType": failure_cluster.get("kind"),
        "pattern": failure_cluster.get("label"),
        "hypothesis": None,
        "evidenceCount": failure_cluster.get("rawN", 0),
        "uniqueDays": failure_cluster.get("uniqueDays", 0),
        "confidence": None,
        "status": "candidate",
        "lastValidatedAt": None,
    }


def lifecycle_pass(memories, today=None):
    """상태 갱신 — 증거가 차면 validated, 오래되면 stale. 삭제는 하지 않는다."""
    today = today or datetime.date.today()
    for m in memories:
        if m["status"] == "deprecated":
            continue
        if m["status"] == "candidate" and \
                m.get("evidenceCount", 0) >= VALIDATE_MIN_EVIDENCE and \
                m.get("uniqueDays", 0) >= VALIDATE_MIN_DAYS:
            m["status"] = "validated"
            m["lastValidatedAt"] = _now()
        elif m["status"] == "validated":
            last = str(m.get("lastValidatedAt") or m.get("createdAt") or "")[:10]
            try:
                age = (today - datetime.date.fromisoformat(last)).days
            except ValueError:
                age = STALE_AFTER_DAYS + 1
            if age > STALE_AFTER_DAYS:
                m["status"] = "stale"
    return memories


def load_all(path=ENC_PATH):
    """암호화 저장소에서 전체 Memory를 읽는다. Key 없으면 빈 목록(읽기도 불가)."""
    crypto = _crypto()
    if crypto is None or not os.path.exists(path):
        return []
    try:
        import gzip
        blob = crypto.decrypt_bytes(open(path, "rb").read(), ENC_LABEL)
        # save_all이 gzip_first=True로 저장한다 — 매직바이트로 판별해 풀어준다.
        if blob[:2] == b"\x1f\x8b":
            blob = gzip.decompress(blob)
        text = blob.decode("utf-8")
    except Exception:
        return []
    out = []
    for line in text.splitlines():
        line = line.strip()
        if line:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return out


def save_all(memories, path=ENC_PATH):
    """암호화해 저장. Key가 없으면 저장 생략(평문 금지) — (저장여부, 사유) 반환."""
    crypto = _crypto()
    if crypto is None:
        return False, "research_crypto 모듈 없음"
    body = "".join(json.dumps(m, ensure_ascii=False) + "\n" for m in memories)
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        crypto.write_encrypted(path, body, ENC_LABEL, gzip_first=True)
        return True, f"{len(memories)}건 암호화 저장"
    except Exception as exc:
        # Key 부재 등 — 평문으로 대신 저장하는 fallback은 존재하지 않는다.
        return False, f"암호화 저장 불가({type(exc).__name__}) — 평문 저장은 하지 않음"


def public_aggregate(memories):
    """공개 status에 실어도 되는 집계만."""
    counts = {s: 0 for s in STATES}
    for m in memories:
        counts[m.get("status", "candidate")] = counts.get(m.get("status", "candidate"), 0) + 1
    return {"total": len(memories), "byStatus": counts, "schemaVersion": SCHEMA_VERSION}
