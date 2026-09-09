#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""성적표 정기 공개 보고서 — 발행 시점 숫자를 동결해 초안을 만든다 (2026-09-09 신설, Task #52).

## 왜 스크립트가 필요한가

앱의 성적표 화면은 숫자를 **매번 다시 계산**한다. 좋은 성질이지만, 그래서 남에게
링크로 보여줄 수도 없고 "그때 그렇게 말했다"를 증명할 수도 없다. 성적표 보고서는
반대로 발행 시점의 숫자를 **동결**해 영구 주소에 박는 글이다.

그 동결을 **사람이 손으로 옮겨 적으면 안 된다.** 옮겨 적는 순간 (a) 오타가 나고
(b) 무엇이 근거였는지 재구성할 수 없고 (c) 유리한 숫자만 고르는 유혹이 생긴다.
이 스크립트가 증거에서 직접 뽑아 `frozen` 블록을 만든다.

## 하는 일

1. `evaluate_preregistered_buy_filters.py`를 그대로 호출해 사전등록 평가 리포트를 얻는다.
   (평가 규칙·훔쳐보기 방지는 전부 그쪽에 있다. 여기서 다시 구현하지 않는다.)
2. 그 리포트에서 **표시할 숫자만** 골라 `frozen` 블록을 만든다. 계산은 하지 않는다.
3. `scorecard_reports.js`에 붙여 넣을 항목 뼈대를 표준출력에 낸다.

## 안 하는 일 (일부러)

- **파일을 직접 고치지 않는다.** 초안을 찍어줄 뿐이고, 붙여 넣고 본문을 쓰는 것은 사람이
  한다. 발행은 되돌리기 어려운 행위라 자동화하지 않는다.
- **숫자를 새로 계산하지 않는다.** 평가 스크립트가 낸 값을 그대로 옮긴다. 두 곳에서
  계산하면 언젠가 두 숫자가 갈라지고, 그때 어느 쪽이 맞는지 아무도 모른다.
- **status가 EVALUATED가 아니면 초안을 만들지 않는다.** 사전등록 창이 안 끝났는데
  중간 결과를 글로 내보내는 것을 막는다(훔쳐보기 방지의 마지막 문).

## 쓰는 법

    python3 publish_scorecard_report.py                # 상태만 확인
    python3 publish_scorecard_report.py --draft        # 붙여 넣을 항목 뼈대 출력
    python3 publish_scorecard_report.py --draft --id 1 # id를 직접 지정

첫 호는 2026-10-19 사전등록 확정 평가다.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPORTS_JS = HERE / "scorecard_reports.js"

# frozen에 실을 값. (리포트 경로, 표시 이름) — 여기 없는 값은 글에 숫자로 쓰지 않는다.
FROZEN_FIELDS = [
    (("asOf",), "기준일"),
    (("status",), "평가 상태"),
    (("evidenceStatus",), "증거 성격"),
    (("registration", "windowStart"), "창 시작"),
    (("registration", "minDecisionDays"), "최소 판단일"),
    (("sample", "decisionDays"), "익은 판단일"),
    (("sample", "rows"), "전체 판단 행"),
    (("sample", "buy"), "BUY 행"),
    (("sample", "excluded"), "제외된 행"),
    (("sample", "firstDecisionDate"), "첫 판단일"),
    (("sample", "lastDecisionDate"), "마지막 판단일"),
]


def dig(obj, path):
    """중첩 dict에서 경로를 따라간다. 없으면 None(없는 것을 0으로 바꾸지 않는다)."""
    cur = obj
    for key in path:
        if not isinstance(cur, dict) or key not in cur:
            return None
        cur = cur[key]
    return cur


def next_id():
    """scorecard_reports.js에서 가장 큰 id + 1. id는 재사용하지 않는다."""
    src = REPORTS_JS.read_text(encoding="utf-8")
    ids = [int(m) for m in re.findall(r"^\s*id:\s*(\d+),", src, re.M)]
    return (max(ids) + 1) if ids else 1


def build_frozen(report):
    """리포트에서 표시할 값만 뽑는다. 계산하지 않는다."""
    frozen = {"source": "evaluate_preregistered_buy_filters.py"}
    for path, label in FROZEN_FIELDS:
        frozen[path[-1] if len(path) == 1 else ".".join(path)] = dig(report, path)
    verdicts = report.get("verdicts")
    if verdicts:
        frozen["verdicts"] = verdicts
        frozen["holmP"] = report.get("holmP")
    return frozen


def main(argv=None):
    ap = argparse.ArgumentParser(description="성적표 보고서 초안 생성(발행은 하지 않는다)")
    ap.add_argument("--draft", action="store_true", help="붙여 넣을 항목 뼈대를 출력한다")
    ap.add_argument("--id", type=int, default=None, help="항목 id(기본: 마지막 + 1)")
    args = ap.parse_args(argv)

    try:
        import evaluate_preregistered_buy_filters as ev
    except Exception as e:                                   # pragma: no cover
        print(f"평가 스크립트를 불러오지 못했다: {e}", file=sys.stderr)
        return 2

    report = ev.build_report() if hasattr(ev, "build_report") else None
    if report is None:
        # 평가 스크립트는 main()에서 리포트를 만든다. --json 경로를 그대로 쓴다.
        import io
        import contextlib
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            ev.main(["--json"])
        report = json.loads(buf.getvalue())

    status = report.get("status")
    print(f"[성적표 보고서] 기준일 {report.get('asOf')} · 상태 {status}")
    print(f"  익은 판단일 {dig(report, ('sample', 'decisionDays'))}일 "
          f"/ 최소 {dig(report, ('registration', 'minDecisionDays'))}일")

    if status != "EVALUATED":
        print(f"  → 아직 발행하지 않는다. {report.get('note') or '평가가 확정되지 않았다.'}")
        print("  (사전등록 창이 끝나기 전에 중간 결과를 글로 내보내면 등록이 소멸한다.)")
        return 0 if not args.draft else 1

    if not args.draft:
        print("  → 발행 가능. 초안을 보려면 --draft")
        return 0

    item_id = args.id or next_id()
    frozen = build_frozen(report)
    print("\n// ↓ scorecard_reports.js의 SCORECARD_REPORTS 배열에 붙여 넣는다.")
    print("//   본문(body)은 사람이 쓴다 — 숫자는 아래 frozen에 있는 것만 쓸 것.")
    print("  {")
    print(f"    id: {item_id},")
    print(f'    title: "{report["asOf"][:4]}년 {int(report["asOf"][5:7])}월'
          f'{int(report["asOf"][8:10])}일 기준, ",')
    print(f'    date: "{report["asOf"]}",')
    print(f'    updated: "{report["asOf"]}",')
    print('    tag: "성적표 · 검증 기록",')
    print('    summary: "",')
    print('    body: "",')
    print("    frozen: " + json.dumps(frozen, ensure_ascii=False, indent=6)
          .replace("\n", "\n    ") + ",")
    print("    sources: []")
    print("  },")
    return 0


if __name__ == "__main__":
    sys.exit(main())
