#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Claude 전용 진입점 ↔ 공용 진입점 동기 계약 (2026-09-10, 구간 6).

잠그는 것
  · `.agents/skills/<name>/SKILL.md`(공용) 은 `sync_agent_compat.py` 가 만든 그대로다(손으로 고친 흔적·원본 변경 뒤 미갱신을 잡는다).
  · 공용 진입점의 name/description 은 원본 `.claude/skills/<name>/SKILL.md` 와 같고, 원본 경로가 존재하며, 같은 이름이 두 번 노출되지 않는다.
  · 공용 진입점은 절차를 **복제하지 않는다**(원본을 읽으라는 안내 + 대응표만).
  · `.codex/agents/*.toml` 은 TOML 로 읽히고 name 이 파일명과 같고 "형식 미확인" 표시가 있다(확인된 것처럼 보이지 않게).
  · GAEO 소유 역할 파일 13+개에 `model:` 지정이 없다(외부 seo-* 는 범위 밖). `docs/agent/ROLES.md` 가 전부를 싣는다.
  · GAEO 스킬 원본이 참조하는 저장소 파일 경로(백틱 안의 docs/…·scripts/… 등)가 실제로 있다.

표준 라이브러리 + 저장소 모듈만 쓴다(test_ci_parity). tomllib 는 3.11 표준 라이브러리(ci.yml 이 3.11 을 쓴다).
"""
import os
import re
import sys
import tomllib
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import sync_agent_compat as S    # noqa: E402

PATH_IN_BACKTICKS = re.compile(r"`((?:docs|scripts|config|\.claude|\.github|\.agents|\.codex)/[^`\s*<>…]+?\.(?:md|py|yml|yaml|json|js|sh|ps1|toml|html|css|txt))`")


def read(p):
    with open(p, encoding="utf-8") as fh:
        return fh.read()


class GeneratedFilesInSync(unittest.TestCase):
    def test_생성물이_원본과_같다(self):
        stale = []
        for path, body in S.render_all(HERE).items():
            if not os.path.exists(path):
                stale.append(os.path.relpath(path, HERE) + " (없음)")
            elif read(path) != body:
                stale.append(os.path.relpath(path, HERE) + " (다름)")
        self.assertEqual(stale, [], "공용 진입점이 원본과 어긋났다 — python3 sync_agent_compat.py 로 다시 생성:\n  " + "\n  ".join(stale))

    def test_check_모드가_0을_돌려준다(self):
        self.assertEqual(S.main(["--check"]), 0)


class SkillPointers(unittest.TestCase):
    def test_GAEO_스킬마다_공용_진입점이_있고_이름_설명이_같다(self):
        seen = set()
        for name in S.GAEO_SKILLS:
            src = os.path.join(S.CLAUDE_SKILLS, name, "SKILL.md")
            dst = os.path.join(S.AGENTS_SKILLS, name, "SKILL.md")
            self.assertTrue(os.path.exists(src), src)
            self.assertTrue(os.path.exists(dst), dst)
            m_src, _ = S.parse_frontmatter(read(src))
            m_dst, body = S.parse_frontmatter(read(dst))
            self.assertEqual(m_dst.get("name"), m_src.get("name"), name)
            self.assertEqual(m_dst.get("description"), m_src.get("description"), name)
            self.assertEqual(m_dst.get("name"), name, "폴더 이름과 name 이 같아야 한다")
            self.assertNotIn(m_dst["name"], seen, "같은 이름이 두 번 노출")
            seen.add(m_dst["name"])
            self.assertIn(f".claude/skills/{name}/SKILL.md", body, "원본 경로 안내")
            self.assertIn("그대로 읽고 따른다", body)

    def test_공용_진입점은_절차를_복제하지_않는다(self):
        for name in S.GAEO_SKILLS:
            src_body = S.parse_frontmatter(read(os.path.join(S.CLAUDE_SKILLS, name, "SKILL.md")))[1]
            dst_body = S.parse_frontmatter(read(os.path.join(S.AGENTS_SKILLS, name, "SKILL.md")))[1]
            self.assertLess(len(dst_body), 2500, f"{name}: 진입점이 너무 길다 — 절차를 복제했나")
            # 원본의 단계 제목(## …)이 진입점에 그대로 들어 있으면 복제다
            heads = [l.strip() for l in src_body.splitlines() if l.startswith("## ") and len(l) > 6]
            copied = [h for h in heads if h in dst_body]
            self.assertEqual(copied, [], f"{name}: 원본 절 제목이 진입점에 복제됐다 {copied[:3]}")

    def test_공용_폴더에_GAEO_소유_아닌_것을_넣지_않았다(self):
        extra = sorted(set(os.listdir(S.AGENTS_SKILLS)) - set(S.GAEO_SKILLS))
        self.assertEqual(extra, [], "외부 스킬은 복제하지 않는다(라이선스·원본 보존)")

    def test_스킬_원본이_가리키는_저장소_파일이_있다(self):
        missing = []
        for name in S.GAEO_SKILLS:
            body = read(os.path.join(S.CLAUDE_SKILLS, name, "SKILL.md"))
            for ref in sorted(set(PATH_IN_BACKTICKS.findall(body))):
                if not os.path.exists(os.path.join(HERE, ref)):
                    missing.append(f"{name}: {ref}")
        self.assertEqual(missing, [], "스킬 원본이 없는 파일을 가리킨다:\n  " + "\n  ".join(missing))


class RoleFiles(unittest.TestCase):
    def test_GAEO_역할_파일에_모델_지정이_없다(self):
        for name in S.gaeo_agent_names():
            meta, _ = S.parse_frontmatter(read(os.path.join(S.CLAUDE_AGENTS, name + ".md")))
            self.assertNotIn("model", meta, f"{name}: 역할 파일에 model 지정 — 자동 배정·라우터를 만들지 않는다")
            self.assertEqual(meta.get("name"), name)

    def test_codex_toml은_읽히고_형식_미확인_표시가_있다(self):
        names = S.gaeo_agent_names()
        files = sorted(os.listdir(S.CODEX_AGENTS))
        self.assertEqual(files, sorted(n + ".toml" for n in names))
        for f in files:
            path = os.path.join(S.CODEX_AGENTS, f)
            text = read(path)
            doc = tomllib.loads(text)
            self.assertEqual(doc["name"], f[:-5])
            self.assertTrue(os.path.exists(os.path.join(HERE, doc["instructions_file"])))
            self.assertIn(S.FORMAT_UNVERIFIED, text, "확인되지 않은 형식을 확인된 것처럼 두지 않는다")
            self.assertNotIn("model", doc, "TOML 에도 모델 키 없음")
            self.assertIsInstance(doc["read_only"], bool)

    def test_읽기_전용_판정은_tools의_쓰기_도구_유무다(self):
        eng = tomllib.loads(read(os.path.join(S.CODEX_AGENTS, "gaeo-engineer.toml")))
        qa = tomllib.loads(read(os.path.join(S.CODEX_AGENTS, "gaeo-qa.toml")))
        self.assertFalse(eng["read_only"])
        self.assertTrue(qa["read_only"])

    def test_ROLES_문서가_모든_역할을_싣고_원본_경로가_있다(self):
        doc = read(S.ROLES_DOC)
        for name in S.gaeo_agent_names():
            self.assertIn(f"`{name}`", doc, name)
            self.assertIn(f".claude/agents/{name}.md", doc)
        self.assertIn("모델 지정(`model:`)이 없다", doc)
        self.assertIn("seo-*", doc, "외부 에이전트는 범위 밖이라고 적는다")


class SkillsHaveNoModelRouting(unittest.TestCase):
    def test_GAEO_스킬_frontmatter에_모델_키가_없다(self):
        for name in S.GAEO_SKILLS:
            meta, _ = S.parse_frontmatter(read(os.path.join(S.CLAUDE_SKILLS, name, "SKILL.md")))
            self.assertNotIn("model", meta, name)


if __name__ == "__main__":
    unittest.main(verbosity=2)
