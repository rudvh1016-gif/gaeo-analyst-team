#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Research 기록 APPEND-ONLY 자동검사.

개발 중 실제로 위반이 한 번 발생했기 때문에(과거 정밀분석 기록 19건에 null 키가
새로 박혔다) 사람 눈이 아니라 코드로 고정한다.

규칙
- 이미 기록된 Research Prediction(live_shadow_oos)은 값·키·버전·시각 무엇이든
  단 하나도 바뀌면 안 된다.
- 새 Prediction을 append 하는 것만 허용한다.
- 기록 삭제도 위반이다.

사용법
    before = snapshot(hist)          # 쓰기 전 기존 history
    ... 아카이브 로직이 hist를 갱신 ...
    violations = verify(before, snapshot(hist))
    restore(hist, before)            # 위반이 있으면 과거 기록만 원상복구

archive_analysis.py가 history.js를 쓰기 직전에 호출한다.
"""
import copy
import hashlib
import json

# history 항목에서 Research 영역으로 간주하는 키들
RESEARCH_KEYS = ("research", "researchV11")


def _digest(obj):
    return hashlib.sha256(
        json.dumps(obj, ensure_ascii=False, sort_keys=True).encode("utf-8")
    ).hexdigest()


def _created_day(block):
    """그 Research Prediction이 실제로 만들어진 날(YYYY-MM-DD)."""
    if not isinstance(block, dict):
        return None
    stamp = block.get("createdAt")
    if not stamp:
        for cand in (block.get("candidates") or {}).values():
            if isinstance(cand, dict) and cand.get("predictionTimestamp"):
                stamp = cand["predictionTimestamp"]
                break
    return str(stamp)[:10] if stamp else None


def snapshot(history, today=None):
    """(종목코드, 판단시각) -> {키: (해시, 원본)} 형태로 Research 영역만 뜬다.

    Legacy 필드(call/total/taro/...)는 대상이 아니다. 이 검사는 Research 기록의
    불변성만 책임진다. Legacy 기록 갱신 규칙은 기존 그대로 둔다.

    today를 주면 '오늘 만들어진 Prediction'은 보호 대상에서 뺀다.
    장중에 30분마다 다시 도는 파이프라인이 같은 날 기록을 최신 스냅샷으로
    새로 쓰는 것은 정상이기 때문이다. 이때는 미래 결과를 알 수가 없으므로
    Look-Ahead 위험이 없다. 반면 어제 이전에 만들어진 Prediction은
    결과를 알고 난 뒤에 고칠 수 있으므로 무조건 보호한다.
    createdAt이 없어 판단이 안 서면 보호하는 쪽으로 처리한다.
    """
    out = {}
    for code, rows in (history or {}).items():
        if not isinstance(rows, list):
            continue
        # ⚠️ 같은 date가 두 번 이상 있을 수 있으므로 (코드, 날짜)만으로 키를 만들면
        #    중복된 기록이 하나로 뭉개져 위반을 놓친다. 등장 순서를 키에 포함한다.
        seen = {}
        for row in rows:
            if not isinstance(row, dict):
                continue
            date = str(row.get("date"))
            seq = seen.get(date, 0)
            seen[date] = seq + 1
            present = {}
            for k in RESEARCH_KEYS:
                if k not in row:
                    continue
                if today and _created_day(row[k]) == str(today)[:10]:
                    continue          # 오늘 만든 Prediction — 같은 날 갱신 허용
                present[k] = row[k]
            if not present:
                continue
            # ⚠️ 반드시 깊은 복사. 참조로 들고 있으면 나중에 원본이 변형될 때
            #    '스냅샷'까지 같이 변해서 위반을 못 잡는다.
            out[(str(code), date, seq)] = {
                k: (_digest(v), copy.deepcopy(v)) for k, v in present.items()
            }
    return out


def verify(before, after):
    """위반 목록을 돌려준다. 빈 리스트면 APPEND-ONLY가 지켜진 것이다."""
    violations = []
    for key, keys_before in before.items():
        code, date = key[0], key[1]
        keys_after = after.get(key)
        if keys_after is None:
            violations.append({"code": code, "date": date, "field": "*",
                               "kind": "RECORD_DELETED"})
            continue
        for field, (digest, _old) in keys_before.items():
            if field not in keys_after:
                violations.append({"code": code, "date": date, "field": field,
                                   "kind": "FIELD_DELETED"})
            elif keys_after[field][0] != digest:
                violations.append({"code": code, "date": date, "field": field,
                                   "kind": "VALUE_CHANGED"})
    return violations


def restore(history, before):
    """위반이 발견됐을 때 과거 Research 기록만 원래 값으로 되돌린다.

    새로 추가된 Prediction은 건드리지 않는다(append는 정상이다).
    파이프라인을 죽이는 대신, 위반 자체를 무효화하고 경고를 남기는 쪽을 택한다.
    """
    index = {}
    for code, rows in (history or {}).items():
        if not isinstance(rows, list):
            continue
        seen = {}
        for row in rows:
            if not isinstance(row, dict):
                continue
            date = str(row.get("date"))
            seq = seen.get(date, 0)
            seen[date] = seq + 1
            index[(str(code), date, seq)] = row
    restored = 0
    for key, fields in before.items():
        row = index.get(key)
        if row is None:
            continue           # 기록 자체가 사라진 경우는 여기서 되살리지 않는다
        for field, (_digest_value, original) in fields.items():
            if _digest(row.get(field)) != _digest_value:
                row[field] = copy.deepcopy(original)
                restored += 1
    return restored


def guard(history, before, label="history.js", today=None):
    """검사 + 자동복구 + 경고 출력을 한 번에. 위반 개수를 돌려준다."""
    violations = verify(before, snapshot(history, today=today))
    if not violations:
        return 0
    restored = restore(history, before)
    kinds = {}
    for v in violations:
        kinds[v["kind"]] = kinds.get(v["kind"], 0) + 1
    print(f"[APPEND-ONLY 위반] {label} — {len(violations)}건 {kinds} · "
          f"과거 Research 기록 {restored}개를 원래 값으로 되돌렸습니다.")
    for v in violations[:5]:
        print(f"   · {v['code']} {v['date']} {v['field']} {v['kind']}")
    return len(violations)
