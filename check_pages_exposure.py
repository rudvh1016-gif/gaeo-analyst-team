#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""research_archive가 인터넷에서 직접 내려받아지는지 실제로 확인한다.

robots.txt는 검색엔진에 대한 요청일 뿐 접근 차단이 아니다(요구 12번).
GitHub Pages가 저장소 루트를 그대로 서빙하면 research_archive도 공개된다.

⚠️ 이 스크립트는 확인만 한다. 위험한 대규모 Migration을 하지 않는다.
"""
import json
import os
import sys
import urllib.request
import urllib.error

SITE = os.environ.get("GAEO_SITE", "https://gaeoteam.com")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                   "research_archive", "pages_exposure.json")

# 사이트가 정상인지 대조할 기준 + 실제로 확인할 연구 자료 경로
PROBES = [
    ("baseline_site", "/robots.txt", "사이트 자체가 살아 있는지 대조용"),
    ("baseline_public", "/index.html", "공개 페이지 대조용"),
    ("dart_smoke_report", "/research_archive/dart/smoke_report.json", "DART 점검 리포트"),
    ("dart_corp_map", "/research_archive/dart/corp_map.json", "기업 매핑 테이블"),
    ("storage_report", "/research_archive/storage_report.json", "저장량 리포트"),
]


def probe(url):
    req = urllib.request.Request(url, method="GET",
                                 headers={"User-Agent": "gaeo-exposure-check/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read(2048)
            return {"httpStatus": r.status, "bytesSample": len(body),
                    "contentType": r.headers.get("Content-Type")}
    except urllib.error.HTTPError as ex:
        return {"httpStatus": ex.code, "reason": str(ex.reason)[:80]}
    except Exception as ex:
        return {"httpStatus": None, "error": f"{type(ex).__name__}: {str(ex)[:120]}"}


def main():
    results = {}
    for name, path, why in PROBES:
        results[name] = dict(probe(SITE + path), path=path, why=why)

    site_up = results["baseline_site"].get("httpStatus") == 200
    exposed = [k for k in ("dart_smoke_report", "dart_corp_map", "storage_report")
               if results[k].get("httpStatus") == 200]
    if not site_up:
        verdict = "UNKNOWN_SITE_UNREACHABLE"
    elif exposed:
        verdict = "RAW_ARCHIVE_PUBLICLY_ACCESSIBLE"
    else:
        verdict = "RAW_ARCHIVE_NOT_PUBLICLY_ACCESSIBLE"

    report = {"site": SITE, "verdict": verdict, "exposedPaths": exposed,
              "probes": results,
              "note": ("robots.txt는 색인 요청일 뿐 접근 차단이 아니다. "
                       "이 확인은 실제 HTTP 응답으로 판정한다.")}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1, sort_keys=True)

    print(f"verdict: {verdict}")
    for name, r in results.items():
        print(f"  {name:20} {r['path']:45} → HTTP {r.get('httpStatus')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
