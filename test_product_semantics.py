#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Product Integration 의미 계약 (2026-08-16)

① 확신도를 확률로 설명하지 않는다 ② 신뢰도 숫자를 발명하지 않는다
③ DART 커버리지 불완전 ≠ 공시 없음 ④ 브라우저는 Toss API·Secret에 접근하지 않는다
⑤ 과거 500 스냅샷 소급 금지(하드코딩 모집단 문구 없음)
"""
import sys

FAILURES = []


def check(name, cond, detail=""):
    print(f"[{'PASS' if cond else 'FAIL'}] {name}" + (f" — {detail}" if detail and not cond else ""))
    if not cond:
        FAILURES.append(name)


html = open("index.html", encoding="utf-8").read()

# ── ① 확신도 ≠ 확률 ─────────────────────────────────────────────────────────
check("확신도 microcopy가 '상승 확률이 아니'라고 명시", "상승 확률이 아니에요" in html)
for bad in ("확신도는 상승확률", "% 상승확률", "% 성공확률", "% 적중확률", "확률입니다</"):
    check(f"확률 오인 표현 없음: {bad!r}", bad not in html)

# ── ② 신뢰도는 성적표 실측만 — 숫자 발명 금지 ───────────────────────────────
check("신뢰도 소스가 MODEL_SCOREBOARD.byModelVersion", "byModelVersion" in html
      and "baseReliabilityState" in html)
check("표본 부족을 0%가 아닌 '표본 대기'로 표기", "0%가 아니라 표본 대기" in html)
check("현행 버전만 조회(과거 버전 혼합 금지)", "currentModelVersion" in html)
import re
fn = html[html.index("function confReliabilityNoteHTML"):]
fn = fn[:fn.index("\nfunction ", 10)]
check("신뢰도 하드코딩 % 숫자 0 (r.acc 실측만 사용 — '0%가 아니라' 면책은 제외)",
      not re.search(r"신뢰도[^<]{0,20}[1-9]\d?%", fn) and "${r.acc}" in fn)

# ── ③ DART 표시 의미 보존 ───────────────────────────────────────────────────
check("dartContextHTML 존재", "function dartContextHTML" in html)
dc = html[html.index("function dartContextHTML"):]
dc = dc[:dc.index("\n  }", 10)]
check("EVENT_DATA_ERROR → 불러오기 실패 문구", "공시 데이터를 불러오지 못했어요" in dc)
check("커버리지 불완전을 '공시 없음'으로 새로 쓰지 않음(러너 stateText 재사용)",
      "공식 공시 없음" not in dc and "d.stateText" in dc)
check("DART 점수 미가산 고지", "직접 가산되지 않습니다" in dc)
check("raw 디버그 필드 미노출", "rceptNo" not in dc and "corp_code" not in dc)

# ── ④ 브라우저 → Toss 직접 호출 0 ──────────────────────────────────────────
for bad in ("tossinvest.com", "TOSS_INVEST_CLIENT", "oauth2/token"):
    check(f"index.html에 Toss 접근 흔적 없음: {bad}", bad not in html)
pub = open("paper_public.js", encoding="utf-8").read().lower()
check("paper_public.js에 secret/token/account 계열 문자열 0",
      not any(w in pub for w in ("client_id", "client_secret", "token", "account", "secret")))
check("사이트는 파생 스냅샷(GAEO_PAPER)만 읽음", "window.GAEO_PAPER" in html)

# ── ⑤ 모집단 하드코딩 금지 (Historical 500 보존·Current 600 정확) ───────────
check("브리핑에 '~종목 중 상승' 모집단 하드코딩 없음(데이터가 결정)",
      not re.search(r"[56]00종목 중 상승", html))

# ── ⑥ 모의투자 화면 정직성 ─────────────────────────────────────────────────
check("가상매매 고지 존재", "실제 계좌·실제 돈과는 무관합니다" in html)
check("비용 미반영 고지 존재", "비용 모델 확인 중" in html)
check("벤치마크 한계 각주(러너 산출 문구) 사용", "benchmarkNote" in html)
check("거래 0건 상태 문구 존재", "아직 새롭게 발생한 매수 고려 신호가 없습니다" in html)

print()
if FAILURES:
    print(f"실패 {len(FAILURES)}건: {FAILURES}")
    sys.exit(1)
print("test_product_semantics: 전체 통과")
