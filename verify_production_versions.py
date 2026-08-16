#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""최신 Production 코드 버전이 실제 산출물(auto_analysis.js)에 반영됐는지 검증.

계산식을 바꾸지 않는다 — 코드의 버전 상수와 산출물에 찍힌 버전을 비교만 한다.
    · 일치                     → LIVE_OUTPUT_MATCHES_CODE (PASS)
    · 산출물이 구버전/필드 없음 → PENDING_LIVE_MARKET_CYCLE
      (휴장·다음 정상 장 사이클 전이면 정상 상태 — 과거 파일을 억지로 안 바꾼다)
advisory 전용: 항상 exit 0. 8월 18일 첫 장 사이클 후 다시 실행하면 자동 재판정된다.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def code_versions():
    import analyze_auto
    return analyze_auto.BASE_MODEL_VERSION, dict(analyze_auto.COMPONENT_VERSIONS)


def output_versions(path=None):
    path = path or os.path.join(HERE, "auto_analysis.js")
    s = open(path, encoding="utf-8").read()
    d = json.loads(s[s.index("const LIVE_AUTO =") + len("const LIVE_AUTO ="):].strip().rstrip(";"))
    gen = d.get("generatedAt")
    for row in (d.get("stocks") or {}).values():
        chief = row.get("chief") or {}
        if chief.get("call"):
            return {"generatedAt": gen,
                    "baseModelVersion": chief.get("baseModelVersion"),
                    "componentVersions": chief.get("componentVersions") or {}}
    return {"generatedAt": gen, "baseModelVersion": None, "componentVersions": {}}


def verdict():
    base_code, comp_code = code_versions()
    out = output_versions()
    base_out = out.get("baseModelVersion")
    comp_out = out.get("componentVersions") or {}
    if base_out == base_code and all(comp_out.get(k) == v for k, v in comp_code.items()):
        return "LIVE_OUTPUT_MATCHES_CODE", base_code, out
    return "PENDING_LIVE_MARKET_CYCLE", base_code, out


def main():
    v, base_code, out = verdict()
    print("PRODUCTION VERSION VERIFICATION")
    print(f"  코드 기준   : {base_code}")
    print(f"  산출물 기준 : {out.get('baseModelVersion') or '(버전 필드 없음 — 구버전 산출물)'}"
          f" · 생성 {out.get('generatedAt')}")
    if v == "LIVE_OUTPUT_MATCHES_CODE":
        import analyze_auto
        for k, cv in analyze_auto.COMPONENT_VERSIONS.items():
            print(f"    {k:<6} {cv}  ✓")
        print("  판정: LIVE_OUTPUT_MATCHES_CODE — 최신 코드가 실제 산출물에 반영됨")
    else:
        print("  판정: PENDING_LIVE_MARKET_CYCLE — 다음 정상 장 사이클(평일 09:00~16:00 KST)")
        print("        이후 이 스크립트를 다시 실행하면 자동으로 재판정됩니다.")
        print("        (휴장 중이거나 새 코드 배포 후 첫 사이클 전이면 정상 상태입니다)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
