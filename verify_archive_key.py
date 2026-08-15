#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""기존 Research/DART Archive를 **현재 Key로 실제 복호화할 수 있는지**만 확인한다.

왜 필요한가 (요구 2번)
    암호화 Archive가 이미 존재하는데 Key가 바뀌면 과거 연구기록을 영원히 못 연다.
    그래서 "Key가 맞는가"를 조용히 가정하지 말고 **실제로 한 Segment를 풀어서**
    확인하고, 실패하면 즉시 STOP 신호를 낸다.

절대 하지 않는 것
    - Key 값을 출력하지 않는다(길이·존재 여부만).
    - 복호화가 실패했다고 새 Key를 만들지 않는다.
    - 복호화한 내용을 출력하지 않는다(건수만).

종료코드
    0   확인 완료(복호화 성공 / 검사할 암호문이 아예 없음)
    2   STOP — 암호문은 있는데 열 수 없다. 절대 새 Key를 만들지 말 것.
"""
import os
import sys

import research_crypto
import research_store

TARGETS = [
    ("research", research_store.ARCHIVE_ROOT, research_store.RECORD_RESEARCH),
    ("dart", os.path.join(os.path.dirname(os.path.abspath(__file__)),
                          "research_archive", "dart"), research_store.RECORD_DART),
]

STOP_NEW_KEY_FORBIDDEN = "EXISTING_ARCHIVE_DECRYPT_FAIL_NEW_KEY_GENERATION_FORBIDDEN"


def probe(label, root, record_type):
    """이 Archive에서 암호문 Segment 하나를 골라 실제로 읽어 본다."""
    store = research_store.ResearchArchiveStore(
        root=root, record_type=record_type, encrypt=True)
    days = store.list_days()
    encrypted_days = []
    for day in days:
        path = store.existing_segment(day)
        if path and path.endswith(".enc"):
            encrypted_days.append(day)

    if not encrypted_days:
        return {"archive": label, "encryptedSegments": 0,
                "status": "NO_CIPHERTEXT_TO_VERIFY",
                "note": "검사할 암호문이 없다. 최초 구축 상태일 수 있다."}

    # 가장 최근 암호문 하나만 풀어 본다(전체를 풀 필요는 없다).
    day = encrypted_days[-1]
    try:
        records = store.read_day(day)
    except Exception as ex:
        return {"archive": label, "encryptedSegments": len(encrypted_days),
                "status": STOP_NEW_KEY_FORBIDDEN, "day": day,
                "error": type(ex).__name__, "detail": str(ex)[:200]}
    return {"archive": label, "encryptedSegments": len(encrypted_days),
            "status": "DECRYPT_OK", "day": day, "records": len(records)}


def main():
    key = os.environ.get(research_crypto.KEY_ENV) or ""
    # ⚠️ 값은 절대 찍지 않는다. 존재 여부와 길이만.
    print(f"[Archive Key] {research_crypto.KEY_ENV} 존재={bool(key)} 길이={len(key)}자")

    results = [probe(*t) for t in TARGETS]
    stop = False
    for r in results:
        if r["status"] == "DECRYPT_OK":
            print(f"  OK    {r['archive']}: 암호문 {r['encryptedSegments']}개 · "
                  f"{r['day']} 복호화 성공 ({r['records']}건)")
        elif r["status"] == "NO_CIPHERTEXT_TO_VERIFY":
            print(f"  SKIP  {r['archive']}: 암호문 없음 — {r['note']}")
        else:
            stop = True
            print(f"  STOP  {r['archive']}: {r['encryptedSegments']}개 암호문이 있는데 "
                  f"{r['day']} 복호화 실패 ({r.get('error')})")

    if stop:
        print("\n" + "=" * 64)
        print(STOP_NEW_KEY_FORBIDDEN)
        print("기존 암호화 Archive가 존재하는데 열리지 않습니다.")
        print("절대 새 Key를 생성하지 마세요. 원래 RESEARCH_ARCHIVE_KEY를 복구해야 합니다.")
        print("=" * 64)
        return 2

    if not key and any(r["encryptedSegments"] for r in results):
        # 여기 오면 위에서 이미 STOP이 났어야 한다. 방어적으로 한 번 더 막는다.
        print(f"\n{STOP_NEW_KEY_FORBIDDEN} — Key 없이 암호문이 존재합니다.")
        return 2

    print("\n확인 완료 — 기존 Key를 그대로 유지합니다. 새 Key를 만들지 않았습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
