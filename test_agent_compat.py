#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Claude 전용 진입점 ↔ 공용 진입점 동기 계약 (2026-09-10, 구간 6).

잠그는 것
  · `.agents/skills/<name>/SKILL.md`(공용) 은 `sync_agent_compat.py` 가 만든 그대로다(손으로 고친 흔적·원본 변경 뒤 미갱신을 잡는다).
  · 공용 진입점의 name/description 은 원본 `.claude/skills/<name>/SKILL.md` 와 같고, 원본 경로가 존재하며, 같은 이름이 두 번 노출되지 않는다.
  · 공용 진입점은 절차를 **복제하지 않는다**(원본을 읽으라는 안내 + 대응표만).
  · `.codex/agents/*.toml` 은 TOML 로 읽히고 키가 정확히 name·description·developer_instructions·sandbox_mode 넷이며(미지원 키 0),
    name 이 파일명과 같고, developer_instructions 에 원본 상대 경로와 원문이 들어 있고, "실제 앱 확인 미확인" 표시가 있다(확인된 것처럼 보이지 않게).
  · 읽기 전용 역할은 sandbox_mode=read-only, 쓰기 역할(gaeo-engineer)만 workspace-write. 역할 이름은 소문자·숫자·하이픈이고 중복이 없다.
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

    def test_codex_toml은_공식_키_넷만_쓰고_원문을_싣고_앱_미확인_표시가_있다(self):
        names = S.gaeo_agent_names()
        files = sorted(os.listdir(S.CODEX_AGENTS))
        self.assertEqual(files, sorted(n + ".toml" for n in names))
        for f in files:
            path = os.path.join(S.CODEX_AGENTS, f)
            text = read(path)
            doc = tomllib.loads(text)
            self.assertEqual(set(doc), set(S.CODEX_TOML_KEYS), f"{f}: 미지원 키가 있거나 필수 키가 빠졌다")
            self.assertEqual(doc["name"], f[:-5])
            self.assertTrue(doc["description"].strip(), f"{f}: description 비어 있음")
            self.assertIn(doc["sandbox_mode"], (S.SANDBOX_READ_ONLY, S.SANDBOX_WRITE))
            self.assertIn(f".claude/agents/{f[:-5]}.md", doc["developer_instructions"], "원본 상대 경로")
            src_meta, src_body = S.parse_frontmatter(read(os.path.join(S.CLAUDE_AGENTS, f[:-5] + ".md")))
            self.assertIn(src_body.strip(), doc["developer_instructions"], f"{f}: 원문이 그대로 들어 있어야 한다")
            self.assertEqual(doc["description"], src_meta.get("description"))
            for bad in ("instructions_file", "tools", "read_only", "model", "reasoning"):
                self.assertNotIn(bad, doc, f"{f}: 미지원·금지 키 {bad}")
            self.assertIn(S.APP_UNVERIFIED, text, "확인되지 않은 것을 확인된 것처럼 두지 않는다")
            self.assertIn("독립 검토가 아니다", doc["developer_instructions"])
            self.assertIn("메인 포함 2개 이내", doc["developer_instructions"])

    def test_sandbox_mode는_쓰기_도구_유무로_정해진다(self):
        eng = tomllib.loads(read(os.path.join(S.CODEX_AGENTS, "gaeo-engineer.toml")))
        qa = tomllib.loads(read(os.path.join(S.CODEX_AGENTS, "gaeo-qa.toml")))
        self.assertEqual(eng["sandbox_mode"], S.SANDBOX_WRITE)
        self.assertEqual(qa["sandbox_mode"], S.SANDBOX_READ_ONLY)
        writers = [n for n in S.gaeo_agent_names()
                   if tomllib.loads(read(os.path.join(S.CODEX_AGENTS, n + ".toml")))["sandbox_mode"] == S.SANDBOX_WRITE]
        self.assertEqual(writers, ["gaeo-engineer"], "쓰기 권한은 gaeo-engineer 한 명뿐")

    def test_생성기는_이름_중복_규격_원본_없음을_거부한다(self):
        with self.assertRaises(ValueError):
            S.validate([("gaeo-qa", {"name": "gaeo-qa", "description": "x"}), ("gaeo-qa", {"name": "gaeo-qa", "description": "x"})])
        with self.assertRaises(ValueError):
            S.validate([("Bad Name", {"name": "Bad Name", "description": "x"})])
        with self.assertRaises(ValueError):
            S.validate([("gaeo-qa", {"name": "other", "description": "x"})])
        with self.assertRaises(ValueError):
            S.validate([("gaeo-nope", {"name": "gaeo-nope", "description": "x"})])
        S.validate([("gaeo-qa", {"name": "gaeo-qa", "description": "x"})])
        for n in S.gaeo_agent_names():
            self.assertRegex(n, S.AGENT_NAME_RE.pattern)

    def test_toml_다중행_문자열은_구분자를_안전하게_다룬다(self):
        self.assertEqual(tomllib.loads("x = " + S.toml_multiline("a\nb"))["x"], "a\nb")
        tricky = "has " + "'" * 3 + " inside and \\ backslash and " + '"' * 3 + " too"
        self.assertEqual(tomllib.loads("x = " + S.toml_multiline(tricky))["x"], tricky)

    def test_ROLES_문서가_모든_역할을_싣고_원본_경로가_있다(self):
        doc = read(S.ROLES_DOC)
        for name in S.gaeo_agent_names():
            self.assertIn(f"`{name}`", doc, name)
            self.assertIn(f".claude/agents/{name}.md", doc)
        self.assertIn("모델 지정(`model:`)이 없다", doc)
        self.assertIn("seo-*", doc, "외부 에이전트는 범위 밖이라고 적는다")
        self.assertIn("sandbox_mode", doc)
        self.assertIn("독립 검토가 아니다", doc)

    def test_스킬_진입점_대응표가_독립_검토와_동시_실행_규칙을_바로_적는다(self):
        for name in S.GAEO_SKILLS:
            body = read(os.path.join(S.AGENTS_SKILLS, name, "SKILL.md"))
            self.assertIn("독립 검토가 아니다", body, name)
            self.assertIn("메인 포함 2개 이내", body, name)


class SkillsHaveNoModelRouting(unittest.TestCase):
    def test_GAEO_스킬_frontmatter에_모델_키가_없다(self):
        for name in S.GAEO_SKILLS:
            meta, _ = S.parse_frontmatter(read(os.path.join(S.CLAUDE_SKILLS, name, "SKILL.md")))
            self.assertNotIn("model", meta, name)


if __name__ == "__main__":
    unittest.main(verbosity=2)
