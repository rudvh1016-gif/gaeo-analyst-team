#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GAEO 발행물 경량 SEO 게이트 — 새 글이 올라갈 때마다 지켜야 할 최소 품질 계약.

왜 필요한가 (2026-08-16, AdSense 2차 'Low value content' 거절 대응)
    글 하나를 올릴 때마다 사이트 전체 SEO 감사를 반복할 수는 없다.
    대신 "발행물 한 편이 갖춰야 할 최소 조건"을 기계적으로 검사한다.

    검사 대상은 검색엔진이 실제로 읽는 정적 산출물이다:
      - snap/{news,study,lesson,estate,calc}/*.html  (발행 글 스냅샷)
      - snap/stock/*.html                            (자동 종목 페이지 — noindex 계약)
      - snap/index.html                              (정적 허브)
      - research/deep-analysis/**/index.html         (정밀분석 영구 페이지)
      - sitemap.xml / robots.txt / ads.txt / index.html 머리말

원칙
    1. 글자 수 하나로 품질을 판정하지 않는다 — 구조 계약(제목·H1·설명·canonical·
       placeholder 없음·중복 없음)을 함께 본다. 본문 최소 길이는 "빈 껍데기 방지"
       바닥값일 뿐이다.
    2. 검사 실패 시 절대 자동으로 내용을 채워 넣지 않는다(filler 금지).
       발행을 보류하고 사람이 고치도록 명확한 오류만 남긴다.
    3. thin/자동 페이지(snap/stock)는 지우는 대신 noindex 계약을 강제한다 —
       색인 가치가 없는 페이지가 sitemap이나 색인에 새어 나가지 않게 한다.

사용법
    python3 seo_publish_gate.py            # 저장소 전체 발행물 검사 (exit 0/1)
    python3 seo_publish_gate.py --root DIR # 다른 뿌리(테스트 픽스처) 검사
"""
import argparse
import glob
import os
import re
import sys

SITE = "https://gaeoteam.com"

# 발행 글 스냅샷 — 색인 대상. 본문 바닥값은 "빈 껍데기 방지"용이다.
POST_DIRS = {
    "snap/news": 800,
    "snap/study": 800,
    "snap/lesson": 800,
    "snap/estate": 800,
    "snap/calc": 300,      # 도구 페이지 — 목적·사용법 설명이 있으면 충분
}
DEEP_DETAIL_MIN = 600      # 정밀분석 상세(개별 종목·시점 페이지)
PLACEHOLDER_TOKENS = [
    "분석 중이에요", "불러오는 중이에요", "준비 중입니다", "Loading...",
    ">undefined<", ">NaN<", ">null<",
]


def _read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def _visible_text(html):
    body = re.sub(r"<script.*?</script>|<style.*?</style>", " ", html, flags=re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return re.sub(r"\s+", " ", body).strip()


def _meta(html, name):
    m = (re.search(rf'name="{name}"[^>]*content="([^"]*)"', html)
         or re.search(rf'content="([^"]*)"[^>]*name="{name}"', html))
    return m.group(1) if m else None


def _canonical(html):
    m = (re.search(r'rel="canonical"[^>]*href="([^"]*)"', html)
         or re.search(r'href="([^"]*)"[^>]*rel="canonical"', html))
    return m.group(1) if m else None


def _title(html):
    m = re.search(r"<title[^>]*>(.*?)</title>", html, re.S)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else None


def _h1s(html):
    return re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)


def expected_canonical(rel_path):
    """파일 경로 → 이 페이지가 스스로 가리켜야 할 대표 URL."""
    rel = rel_path.replace(os.sep, "/")
    if rel.endswith("/index.html") and rel != "snap/index.html":
        return f"{SITE}/{rel[:-len('index.html')]}"
    return f"{SITE}/{rel}"


def sitemap_locs(root):
    path = os.path.join(root, "sitemap.xml")
    if not os.path.exists(path):
        return None
    return re.findall(r"<loc>([^<]+)</loc>", _read(path))


def check_page(root, rel, min_body, require_sitemap, locs, problems,
               titles, canonicals, expect_noindex=False):
    path = os.path.join(root, rel)
    html = _read(path)
    where = rel

    title = _title(html)
    if not title:
        problems.append(f"{where}: <title>이 없습니다")
    else:
        if title in titles:
            problems.append(f"{where}: <title>이 {titles[title]}과 중복입니다 — '{title[:40]}'")
        titles[title] = where

    h1 = _h1s(html)
    if len(h1) != 1:
        problems.append(f"{where}: H1이 정확히 1개여야 합니다 (현재 {len(h1)}개)")
    elif not re.sub(r"<[^>]+>", "", h1[0]).strip():
        problems.append(f"{where}: H1이 비어 있습니다")

    desc = _meta(html, "description")
    # 바닥값 30자: 정확한 한 줄 요약(30자대)은 정상 발행물이다. 글자 수 하나로
    # 품질을 판정하지 않는다 — 이 검사는 빈/무성의 설명만 걸러낸다.
    if not desc or len(desc) < 30:
        problems.append(f"{where}: meta description이 없거나 너무 짧습니다")

    canon = _canonical(html)
    expected = expected_canonical(rel)
    if canon != expected:
        problems.append(f"{where}: canonical 불일치 — '{canon}' ≠ '{expected}'")
    if canon:
        if canon in canonicals:
            problems.append(f"{where}: canonical이 {canonicals[canon]}과 중복입니다")
        canonicals[canon] = where

    robots = (_meta(html, "robots") or "").lower()
    is_noindex = "noindex" in robots
    if expect_noindex and not is_noindex:
        problems.append(f"{where}: 자동 종목 페이지는 noindex여야 합니다")

    text = _visible_text(html)
    if not is_noindex and min_body and len(text) < min_body:
        problems.append(f"{where}: 본문이 너무 짧습니다 ({len(text)}자 < {min_body}자) — "
                        "내용을 채우기 전에는 발행하지 않습니다")

    for tok in PLACEHOLDER_TOKENS:
        if tok in html:
            problems.append(f"{where}: placeholder 토큰 '{tok}'이 남아 있습니다")

    if locs is not None:
        in_sitemap = expected in locs
        if is_noindex and in_sitemap:
            problems.append(f"{where}: noindex 페이지가 sitemap에 들어 있습니다 (모순)")
        if require_sitemap and not is_noindex and not in_sitemap:
            problems.append(f"{where}: 색인 대상 발행 글이 sitemap에 없습니다")


def check_repo(root="."):
    problems = []
    titles, canonicals = {}, {}
    locs = sitemap_locs(root)
    if locs is None:
        problems.append("sitemap.xml이 없습니다")
        locs_set = None
    else:
        locs_set = set(locs)
        dupes = {u for u in locs if locs.count(u) > 1}
        for u in sorted(dupes):
            problems.append(f"sitemap.xml: 중복 URL — {u}")
        # sitemap의 모든 URL은 실제 파일로 존재해야 한다(404 링크 금지)
        for u in locs_set:
            rel = u.replace(SITE + "/", "").replace(SITE, "")
            rel = rel or "index.html"
            if rel.endswith("/"):
                rel += "index.html"
            if not os.path.exists(os.path.join(root, rel)):
                problems.append(f"sitemap.xml: 존재하지 않는 파일을 가리킵니다 — {u}")

    # 발행 글 스냅샷
    for d, min_body in POST_DIRS.items():
        for path in sorted(glob.glob(os.path.join(root, d, "*.html"))):
            rel = os.path.relpath(path, root)
            check_page(root, rel, min_body, True, locs_set, problems, titles, canonicals)

    # 자동 종목 페이지 — noindex 계약(색인 금지·sitemap 금지)만 강제
    for path in sorted(glob.glob(os.path.join(root, "snap/stock", "*.html"))):
        rel = os.path.relpath(path, root)
        check_page(root, rel, 0, False, locs_set, problems, titles, canonicals,
                   expect_noindex=True)

    # 정밀분석 영구 페이지 (상세만 본문 바닥값, 목록/페이지는 구조 계약만)
    for path in sorted(glob.glob(os.path.join(root, "research/deep-analysis/*/*/index.html"))):
        rel = os.path.relpath(path, root)
        if "/page/" in rel.replace(os.sep, "/"):
            check_page(root, rel, 0, False, locs_set, problems, titles, canonicals)
        else:
            check_page(root, rel, DEEP_DETAIL_MIN, True, locs_set, problems, titles, canonicals)
    # 종목별 대표 페이지(research/deep-analysis/<code>/index.html).
    # 같은 종목의 날짜별 스냅샷이 서로 경쟁하지 않도록 이 URL이 대표 자리를 맡는다.
    for path in sorted(glob.glob(os.path.join(root, "research/deep-analysis/*/index.html"))):
        rel = os.path.relpath(path, root)
        check_page(root, rel, DEEP_DETAIL_MIN, True, locs_set, problems, titles, canonicals)
    for rel in ["research/deep-analysis/index.html", "snap/index.html"]:
        if os.path.exists(os.path.join(root, rel)):
            check_page(root, rel, 0, False, locs_set, problems, titles, canonicals)

    # index.html 머리말 + 정적 폴백 숫자 ↔ tickers.js 동기화
    idx_path = os.path.join(root, "index.html")
    if os.path.exists(idx_path):
        idx = _read(idx_path)
        if not _title(idx):
            problems.append("index.html: <title>이 없습니다")
        if not _meta(idx, "description"):
            problems.append("index.html: meta description이 없습니다")
        if _canonical(idx) != f"{SITE}/":
            problems.append("index.html: canonical이 홈이 아닙니다")
        tick_path = os.path.join(root, "tickers.js")
        m = re.search(r'id="activityCoverage">(\d+)<', idx)
        if m and os.path.exists(tick_path):
            n_static = int(m.group(1))
            n_tickers = len(re.findall(r'"code"\s*:\s*"\d{6}"', _read(tick_path)))
            if n_tickers and n_static != n_tickers:
                problems.append(f"index.html: 정적 분석 범위 {n_static}종목이 tickers.js "
                                f"{n_tickers}종목과 다릅니다 — 낡은 숫자를 검색봇이 봅니다")

    # robots.txt / ads.txt
    robots_path = os.path.join(root, "robots.txt")
    if os.path.exists(robots_path):
        robots = _read(robots_path)
        if "Sitemap:" not in robots:
            problems.append("robots.txt: Sitemap 선언이 없습니다")
        if not re.search(r"Disallow:\s*/snap/stock/", robots):
            problems.append("robots.txt: 자동 종목 페이지(/snap/stock/) 차단이 빠졌습니다")
        for good in ["/snap/news", "/snap/study", "/snap/lesson", "/snap/estate"]:
            if re.search(rf"Disallow:\s*{re.escape(good)}", robots):
                problems.append(f"robots.txt: 발행 글 경로 {good}를 차단하고 있습니다")
    else:
        problems.append("robots.txt가 없습니다")
    ads_path = os.path.join(root, "ads.txt")
    if os.path.exists(ads_path):
        first = _read(ads_path).strip().splitlines()[0] if _read(ads_path).strip() else ""
        if "<" in first or "pub-" not in first:
            problems.append("ads.txt: plain text 광고 선언 형식이 아닙니다")
    else:
        problems.append("ads.txt가 없습니다")

    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    args = ap.parse_args()
    problems = check_repo(args.root)
    if problems:
        print(f"SEO 발행 게이트: {len(problems)}건 위반")
        for p in problems:
            print(" ✗", p)
        return 1
    print("SEO 발행 게이트: 통과 (발행물 구조 계약 위반 0건)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
