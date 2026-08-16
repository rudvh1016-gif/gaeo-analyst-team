#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""디자인 계약 테스트 — 상태 표현·내부 ID 노출·장식 emoji (2026-08-16).

docs/gaeo_design_system.md의 규칙 중 기계로 강제할 수 있는 것만 검사한다.
"""
import re
import sys

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


html = open("index.html", encoding="utf-8").read()

# ── §45 종료 실험이 '평가 중'처럼 보이면 안 된다 ─────────────────────────────
# model_registry 기준 legacy_shadow_v3(=종합판단 v3)는 ARCHIVED_FAILED_EXPERIMENT.
import model_registry
legacy = model_registry.BY_ID["legacy_shadow_v3"]
check("registry: legacy_shadow_v3는 보관된 실패 실험",
      legacy["status"] == model_registry.ARCHIVED_FAILED_EXPERIMENT)
# UI 문자열: v3 카드가 '검증 종료'를 표시하고, 사용자용 '평가 중' 상태 문자열이 없어야 한다.
check("UI: 종합판단 v3 카드에 '검증 종료' 표기",
      "종합판단 v3</span><span class=\"sc-arch-status\">검증 종료" in html)
check("UI: '그림자 평가 중' 상태 문자열 잔존 0",
      "그림자 평가 중" not in html)
check("UI: v3 자동승격 안내 문구('자동으로 바뀌어요') 잔존 0",
      "자동으로 바뀌어요" not in html and "실전 판단으로 승격됩니다" not in html)
check("UI: 과거 실험은 접힌 보조 섹션(details)", "sc-arch-details" in html)

# ── §46 내부 ID가 메인 제목/큰 수치로 노출되면 안 된다 ──────────────────────
h3s = re.findall(r"<h3[^>]*>(.*?)</h3>", html, re.S)
INTERNAL_IDS = ["rotation-shadow", "calibrated-ensemble", "research_v1.0",
                "research_v1.1", "research_v2.0", "baseline-risk-v2"]
bad = [h[:40] for h in h3s if any(i in h for i in INTERNAL_IDS)]
check("내부 버전 ID가 h3 제목에 0건", not bad, str(bad))
# 순환매 내부 버전이 큰 stat(<b>)이 아니라 각주로만
check("rotation-shadow-v2가 sc-stat 큰 숫자 자리에 없음",
      not re.search(r'sc-stat"><b>\$\{esc\(String\(\(RS\.model&&RS\.model\.version\)', html))
check("rotation-shadow-v2는 각주(내부 버전)로 제공", "내부 버전 ${esc(String((RS.model&&RS.model.version)" in html)

# ── §47 장식 emoji — h3 제목 기준 ────────────────────────────────────────────
EMOJI = re.compile(r"[\U0001F300-\U0001FAFF☀-➿]")
emoji_h3 = [h[:30] for h in h3s if EMOJI.search(h)]
check(f"h3 제목의 emoji ≤ 2 (현재 {len(emoji_h3)}건)", len(emoji_h3) <= 2, str(emoji_h3[:5]))

# ── 순환매 검증 기록 — 쉬운 이름·쉬운 설명 계약 ─────────────────────────────
check("순환매 검증 기록 제목 사용", "<h3>순환매 검증 기록</h3>" in html)
check("순환매 쉬운 설명(시장보다 잘 갔는지) 포함",
      "실제로 시장보다 잘 갔는지 기록하는 검증" in html)
check("순환매 미반영 안내 포함", "성적만 쌓고 있습니다" in html)

# ── Typography — 표준 스택·tabular-nums ─────────────────────────────────────
check("--sans 토큰이 Pretendard Variable 우선", "'Pretendard Variable',Pretendard" in html
      or '"Pretendard Variable",Pretendard' in html)
check("Pretendard variable dynamic subset 로드", "pretendardvariable-dynamic-subset" in html)
check("성적표 숫자 tabular-nums", "font-variant-numeric:tabular-nums" in html)
for f in ["404.html", "about.html"]:
    s = open(f, encoding="utf-8").read()
    check(f"{f}: Pretendard variable dynamic subset 로드", "pretendardvariable-dynamic-subset" in s)
for f in ["generate_snapshots.js", "deep_analysis_publish.js"]:
    s = open(f, encoding="utf-8").read()
    check(f"{f}: 표준 스택 적용", '"Pretendard Variable",Pretendard,-apple-system' in s)
    check(f"{f}: 폰트 링크 포함", "pretendardvariable-dynamic-subset" in s)
# SF Pro 파일 금지
import glob, os
sf = [p for p in glob.glob("**/*.woff*", recursive=True) + glob.glob("**/*.otf", recursive=True)
      if "sf-pro" in p.lower() or "sanfrancisco" in p.lower()]
check("SF Pro 폰트 파일 0건", not sf, str(sf))

# ── Typography 계층 계약 (2026-08-16 FINAL PASS) ────────────────────────────
# weight는 5단계 tier(400/500/600/650/700)만 쓴다. 800은 브랜드 로고·히어로
# 전용 예외(소수), 900·자의적 중간값(720·760·820·850…)은 금지.
import re as _re
_weights = _re.findall(r"font-weight:(\d{3})", html)
_allowed = {"400", "500", "600", "650", "700", "800"}
_bad = sorted(set(w for w in _weights if w not in _allowed))
check("font-weight는 5단계 tier + 브랜드 800만", not _bad, f"허용 외: {_bad}")
check("브랜드 예외(800)는 소수(≤5)", _weights.count("800") <= 5,
      f"800이 {_weights.count('800')}곳")
check("font-weight:900 없음", "font-weight:900" not in html)
for _f in ["rotation.css", "insight-rail.css"]:
    _s = open(_f, encoding="utf-8").read()
    _b = sorted(set(w for w in _re.findall(r"font-weight:(\d{3})", _s) if w not in _allowed))
    check(f"{_f}: weight tier 준수", not _b, f"허용 외: {_b}")

# ── AI 라벨 계약 (2026-08-16 사용자 지정) ───────────────────────────────────
# 장식성 'AI 종목 분석' eyebrow·'AI 분석' 내비 라벨은 쓰지 않는다.
# (About/가이드북의 방법론 설명에서 AI를 사실대로 언급하는 것은 허용)
check("'AI 종목 분석' 문자열 0", "AI 종목 분석" not in html)
check("내비게이션 'AI 분석' 라벨 없음", '>AI 분석</button>' not in html)

# ── --sans 표준 스택 정합 (Inter 등 비표준 중간 폰트 금지) ──────────────────
_sans = _re.search(r"--sans:([^;]+);", html)
check("--sans에 Inter/Roboto 없음(표준 스택)",
      _sans and "Inter" not in _sans.group(1) and "Roboto" not in _sans.group(1),
      _sans.group(1)[:80] if _sans else "--sans 토큰 없음")
check("--sans에 한글 fallback(Malgun Gothic) 포함",
      _sans and "Malgun Gothic" in _sans.group(1))

# ── font shorthand 사각지대 (2026-08-16 Paper V1 동반 수정) ─────────────────
# ① `font:500 9px/1 inherit`처럼 inherit를 다른 값과 섞은 shorthand는 CSS
#    명세상 선언 전체가 무효로 버려져(실측: 13.3px로 fallback) 금지한다.
#    `font:inherit` 단독은 유효하므로 허용.
# ② shorthand 안의 weight도 tier(400/500/600/650/700/800)를 지켜야 한다.
# ③ insight-rail 사용자 텍스트는 10px 바닥선(아이콘 glyph 크기 20px는 예외로
#    font-size 단독 선언이라 이 검사에 안 걸린다).
for _f in ["index.html", "rotation.css", "insight-rail.css"]:
    _s = open(_f, encoding="utf-8").read()
    _mixed = [m for m in _re.findall(r"font:[^;}]*", _s)
              if "inherit" in m and m.strip() != "font:inherit"]
    check(f"{_f}: inherit 혼합 font shorthand 없음(무효 CSS)", not _mixed,
          str(_mixed[:2]))
    _sw = [w for w in _re.findall(r"font:\s*(\d{3})\b", _s) if w not in _allowed]
    check(f"{_f}: font shorthand weight tier 준수", not _sw, str(_sw))
_ir = open("insight-rail.css", encoding="utf-8").read()
_small = [v for v in _re.findall(r"font-size:([0-9.]+)px", _ir) if float(v) < 10]
check("insight-rail 사용자 텍스트 10px 바닥선", not _small, str(_small))

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_design_contract: 전체 통과")
