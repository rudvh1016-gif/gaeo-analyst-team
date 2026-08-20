#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""「업종 흐름에서 고른 종목」 — 자리가 줄어도 업종이 골고루 섞이는가.

대표 지적(2026-08-20): "지금은 바이오만 보인다. 여러 방면으로 폭등한 게 있을 텐데
골고루 보여야 할 것 같다."

실제 확인 결과 그날은 4자리라 2개 업종이 섞여 있었지만, 시장 게이트가 조여
자리가 2개로 줄어드는 날에는 업종당 상한 2가 그대로 적용돼 한 업종이 두 자리를
다 가져갈 수 있었다. 그러면 "골고루 보여준다"는 이 코너의 목적이 사라진다.

⚠️ 이 파일이 지키는 계약: 점수·랭킹 산식은 건드리지 않는다. 같은 순위 안에서
   무엇을 담을지(업종 상한)만 정한다.
"""
import sys

import compute_rotation_picks as crp

FAILURES = []

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, OSError):
    pass


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


# ── 1. 자리 수에 따른 업종 상한 ──────────────────────────────────────────────
check("1. 자리가 넉넉하면(3~4) 한 업종에서 2개까지 허용",
      crp.sector_cap_for(4) == 2 and crp.sector_cap_for(3) == 2,
      f"4→{crp.sector_cap_for(4)} 3→{crp.sector_cap_for(3)}")
check("2. 자리가 2개 이하면 업종당 1개로 조인다(한 업종 독식 방지)",
      crp.sector_cap_for(2) == 1 and crp.sector_cap_for(1) == 1,
      f"2→{crp.sector_cap_for(2)} 1→{crp.sector_cap_for(1)}")
check("3. 자리가 0이면(관망) 상한도 의미가 없지만 예외를 내지 않는다",
      crp.sector_cap_for(0) == 1)


# ── 2. 실제 선정 루프와 같은 규칙으로 뽑았을 때 업종이 섞이는가 ──────────────
def pick(cands, n):
    """compute_rotation_picks.main()의 선정 루프와 같은 규칙(순위는 이미 정렬된 입력)."""
    used, picked = {}, []
    cap = crp.sector_cap_for(n)
    for c in cands:
        if len(picked) >= n:
            break
        if used.get(c["sector"], 0) >= cap:
            continue
        used[c["sector"]] = used.get(c["sector"], 0) + 1
        picked.append(c)
    return picked


# 바이오가 순위 1·2위를 독점한 날 — 예전 규칙이면 2자리를 바이오가 다 가져갔다.
bio_heavy = [
    {"code": "475830", "sector": "바이오·제약"},
    {"code": "196170", "sector": "바이오·제약"},
    {"code": "241710", "sector": "화장품·미용"},
    {"code": "181710", "sector": "인터넷·IT"},
]
two = pick(bio_heavy, 2)
check("4. 자리 2개일 때 한 업종이 독식하지 않는다",
      len({c["sector"] for c in two}) == 2, str([c["sector"] for c in two]))
check("4-1. 그래도 순위는 그대로다(1위는 여전히 1위)",
      two[0]["code"] == "475830", str([c["code"] for c in two]))

four = pick(bio_heavy, 4)
check("5. 자리 4개일 때는 기존 동작 그대로(업종당 2개까지 허용)",
      [c["code"] for c in four] == ["475830", "196170", "241710", "181710"],
      str([c["code"] for c in four]))
check("5-1. 자리가 넉넉하면 업종 수는 3개 이상 섞인다",
      len({c["sector"] for c in four}) == 3)

# 후보가 한 업종뿐이면 억지로 다른 업종을 만들어내지 않는다(없는 걸 채우지 않는다).
only_bio = [{"code": f"b{i}", "sector": "바이오·제약"} for i in range(4)]
check("6. 후보가 한 업종뿐이면 자리를 억지로 채우지 않는다",
      len(pick(only_bio, 2)) == 1, str(pick(only_bio, 2)))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_rotation_picks: 전체 통과")
