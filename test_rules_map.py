#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""규칙 대응표 계약 — 옮긴 규칙이 실제로 그 자리에 있고, 지도가 그 자리를 가리키며, AGENTS.md 가 자동 읽기 한도 안이다.

- docs/agent/RULES_MAP.md 1절 표의 각 줄: 지금 위치 파일 존재 · 앵커(절 제목) 포함 · AGENTS.md 에 그 경로 안내 존재
- AGENTS.md ≤ 32,768 바이트(Codex project_doc_max_bytes 기본값 — 설치 버전에서 재확인 대상이지만, 이 값 안이면 어느 쪽이든 잘리지 않는다)
- AGENTS.md 에 작업 지도 절과 절대규칙 8줄이 있다
- 작업 지도 표·HARNESS.md 가 가리키는 파일이 실제로 있다
"""
import os
import re
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
AGENTS = os.path.join(HERE, "AGENTS.md")
RULES_MAP = os.path.join(HERE, "docs", "agent", "RULES_MAP.md")
HARNESS = os.path.join(HERE, "docs", "HARNESS.md")
CODEX_DOC_LIMIT = 32 * 1024


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def map_rows():
    text = read(RULES_MAP)
    section = text.split("## 1.")[1].split("## 2.")[0]
    rows = []
    for line in section.splitlines():
        if not line.startswith("|") or line.startswith("|---") or "원래 위치" in line:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 3:
            rows.append(cells)
    return rows


def backtick_paths(text):
    out = []
    for m in re.finditer(r"`([A-Za-z0-9_./\-]+\.(?:md|py|json|js|yml|sh|ps1))`", text):
        out.append(m.group(1))
    return out


class RulesMap(unittest.TestCase):
    def test_옮긴_규칙이_제자리에_있다(self):
        agents = read(AGENTS)
        rows = map_rows()
        self.assertGreaterEqual(len(rows), 6, "대응표 줄이 줄었다")
        for original, target, anchor, *_ in rows:
            path = target.strip("`")
            full = os.path.join(HERE, path)
            self.assertTrue(os.path.exists(full), f"{original}: {path} 가 없다")
            body = read(full)
            anchor_text = anchor.strip("`").replace("\\`", "`")
            self.assertIn(anchor_text, body, f"{path} 에 앵커 '{anchor_text}' 가 없다")
            self.assertIn(path, agents, f"AGENTS.md 가 {path} 로 안내하지 않는다")
            self.assertIn("그대로 옮긴 원문", body, f"{path} 머리말이 '원문 이동'을 밝히지 않는다")

    def test_AGENTS_md_가_자동_읽기_한도_안이다(self):
        size = os.path.getsize(AGENTS)
        self.assertLessEqual(size, CODEX_DOC_LIMIT,
                             f"AGENTS.md 가 {size:,}B 로 32KiB 를 넘는다 — Codex 가 끝을 읽지 못한다. 세부 절을 docs/rules/ 로 옮겨라")

    def test_작업_지도와_절대규칙이_있다(self):
        agents = read(AGENTS)
        self.assertIn("## 🧭 작업 지도", agents)
        head = agents.split("## 🧭 작업 지도")[0]
        self.assertLess(len(head.encode("utf-8")), 8000, "작업 지도가 문서 앞부분에 있어야 한다")
        for kw in ("삭제·축소·대체 금지", "실제 주문", "자동 생성 파일", "21,000B", "force push", "LLM 호출 0",
                   "확인하지 못했다", "새 유료 API"):
            self.assertIn(kw, agents, f"절대규칙 키워드 '{kw}' 가 AGENTS.md 에 없다")

    def test_지도와_하네스가_가리키는_파일이_있다(self):
        agents = read(AGENTS)
        guide = agents.split("## 🧭 작업 지도")[1].split("\n## ")[0]
        for path in set(backtick_paths(guide) + backtick_paths(read(HARNESS)) + backtick_paths(read(RULES_MAP))):
            candidates = (os.path.join(HERE, path), os.path.join(HERE, ".github", "workflows", path))
            self.assertTrue(any(os.path.exists(c) for c in candidates), f"안내된 파일이 없다: {path}")

    def test_옮긴_원문이_AGENTS에_중복으로_남지_않았다(self):
        agents = read(AGENTS)
        for marker in ("| `tickers.js` | 종목 목록 단일 소스", "현재 중카테고리 키(`app.js`의", "PC 버전 토글: 물리 화면 최소변",
                       "굵기는 3단계뿐이다"):
            self.assertNotIn(marker, agents, f"옮긴 원문이 AGENTS.md 에도 남아 있다(두 곳 관리 금지): {marker[:20]}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
