#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SEO 발행 게이트 계약 테스트 + 새 글 발행 시뮬레이션.

1부 — 실제 저장소 검사: 지금 커밋된 발행물 전체가 게이트를 통과해야 한다.
2부 — 발행 시뮬레이션(임시 폴더): "새 글을 올리는 상황"을 픽스처로 재현해
      정상 글은 통과하고, 깨진 글(제목 없음·빈 본문·placeholder·canonical 오류·
      noindex/sitemap 모순 등)은 각각 정확한 사유로 잡히는지 확인한다.
      ⚠️ 공개 사이트에는 어떤 테스트 글도 남기지 않는다 — 전부 tempdir 안에서만 돈다.
"""
import os
import shutil
import sys
import tempfile

import seo_publish_gate as gate

FAILURES = []


def check(name, cond, detail=""):
    status = "PASS" if cond else "FAIL"
    print(f"[{status}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


# ── 1부: 실제 저장소 ─────────────────────────────────────────────────────────
problems = gate.check_repo(".")
check("실제 저장소 발행물 전체가 게이트 통과", not problems,
      "; ".join(problems[:5]))


# ── 2부: 발행 시뮬레이션 픽스처 ──────────────────────────────────────────────
GOOD_POST = """<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<title>시뮬레이션 글 제목 — 새 발행물 테스트 · Gaeo</title>
<meta name="description" content="이 글은 발행 시뮬레이션 픽스처입니다. 실제 공개 사이트에는 올라가지 않는 임시 파일이며 게이트 규칙 검증에만 쓰입니다.">
<link rel="canonical" href="https://gaeoteam.com/snap/news/1.html">
<script type="application/ld+json">{"@type":"Article","datePublished":"2026-08-16"}</script>
</head><body><h1>시뮬레이션 글 제목</h1>
<p>PLACEHOLDER_BODY</p>
<a href="/snap/index.html">전체 글 목록</a>
</body></html>"""

SITEMAP = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://gaeoteam.com/snap/news/1.html</loc><lastmod>2026-08-16</lastmod></url>
</urlset>"""

ROBOTS = """User-agent: *
Allow: /
Disallow: /snap/stock/
Sitemap: https://gaeoteam.com/sitemap.xml
"""


def build_fixture(post_html=None, sitemap=SITEMAP, robots=ROBOTS,
                  ads="google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"):
    root = tempfile.mkdtemp(prefix="gaeo_seo_sim_")
    os.makedirs(os.path.join(root, "snap", "news"))
    body_ok = "본문 문단입니다. " * 80          # 800자 이상 실제 본문 흉내
    html = (post_html or GOOD_POST).replace("PLACEHOLDER_BODY", body_ok)
    with open(os.path.join(root, "snap", "news", "1.html"), "w", encoding="utf-8") as f:
        f.write(html)
    for name, content in [("sitemap.xml", sitemap), ("robots.txt", robots), ("ads.txt", ads)]:
        with open(os.path.join(root, name), "w", encoding="utf-8") as f:
            f.write(content)
    return root


def run_sim(name, expect_pass, expect_token=None, **kw):
    root = build_fixture(**kw)
    try:
        problems = gate.check_repo(root)
        if expect_pass:
            check(f"시뮬레이션: {name}", not problems, "; ".join(problems[:3]))
        else:
            hit = bool(problems) and (expect_token is None
                                      or any(expect_token in p for p in problems))
            check(f"시뮬레이션: {name}", hit,
                  f"기대 토큰 '{expect_token}' 미검출: {problems[:3]}")
    finally:
        shutil.rmtree(root, ignore_errors=True)


# 정상 발행 — 통과해야 한다
run_sim("정상 새 글은 통과", True)

# 각 규칙이 정확한 사유로 잡히는지
run_sim("제목 없는 글 차단", False, "<title>",
        post_html=GOOD_POST.replace("<title>시뮬레이션 글 제목 — 새 발행물 테스트 · Gaeo</title>", ""))
run_sim("H1 중복 차단", False, "H1",
        post_html=GOOD_POST.replace("<h1>시뮬레이션 글 제목</h1>",
                                    "<h1>하나</h1><h1>둘</h1>"))
run_sim("빈 본문(껍데기) 차단", False, "본문이 너무 짧습니다",
        post_html=GOOD_POST.replace("PLACEHOLDER_BODY", "짧음"))
run_sim("placeholder 잔존 차단", False, "placeholder",
        post_html=GOOD_POST.replace("PLACEHOLDER_BODY",
                                    "본문입니다. " * 100 + "Loading..."))
run_sim("canonical 불일치 차단", False, "canonical 불일치",
        post_html=GOOD_POST.replace(
            'href="https://gaeoteam.com/snap/news/1.html"',
            'href="https://gaeoteam.com/"'))
run_sim("설명 없는 글 차단", False, "description",
        post_html=GOOD_POST.replace(
            '<meta name="description" content="이 글은 발행 시뮬레이션 픽스처입니다. 실제 공개 사이트에는 올라가지 않는 임시 파일이며 게이트 규칙 검증에만 쓰입니다.">',
            ""))
run_sim("noindex 글이 sitemap에 있으면 모순 차단", False, "noindex",
        post_html=GOOD_POST.replace("</head>",
                                    '<meta name="robots" content="noindex"></head>'))
run_sim("sitemap이 없는 파일을 가리키면 차단", False, "존재하지 않는",
        sitemap=SITEMAP.replace("news/1.html", "news/999.html"))
run_sim("robots가 발행 글 경로를 막으면 차단", False, "/snap/news",
        robots=ROBOTS + "Disallow: /snap/news\n")

# 자동 종목 페이지 noindex 계약
root = build_fixture()
try:
    os.makedirs(os.path.join(root, "snap", "stock"))
    with open(os.path.join(root, "snap", "stock", "000001.html"), "w", encoding="utf-8") as f:
        f.write("""<title>종목 · Gaeo</title><h1>종목</h1>
<meta name="description" content="자동 종목 페이지 픽스처입니다. noindex 계약 검증에 사용하는 임시 파일입니다.">
<link rel="canonical" href="https://gaeoteam.com/snap/stock/000001.html">""")
    problems = gate.check_repo(root)
    check("시뮬레이션: noindex 빠진 자동 종목 페이지 차단",
          any("noindex여야" in p for p in problems), str(problems[:3]))
finally:
    shutil.rmtree(root, ignore_errors=True)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print(f"test_seo_publishing: 전체 통과")
