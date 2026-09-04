#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CSS 계층 계약 — "고쳐도 소용없는 선언"이 늘어나지 않게 지킨다 (2026-09-04 신설).

index.html은 CSS를 정해진 순서로 읽고, 같은 선택자·같은 속성이면 나중에 읽은
파일이 이긴다. 그래서 app-shell.css의 값을 고쳐도 editorial-foundation.css가
같은 걸 정하고 있으면 화면이 하나도 안 바뀐다. 실제로 그 함정 때문에 "글자
크기를 줄였는데 그대로"인 일이 있었다.

이 테스트는 그런 죽은 선언의 개수가 기준선을 넘지 않는지 확인한다. 새로 CSS를
추가하다 또 겹쳐 쓰면 여기서 잡힌다.

기준선을 올리려면: 진짜로 필요한 겹침인지 먼저 확인하고, 왜 필요한지 적은 뒤에
올린다. 숫자만 올려서 통과시키지 않는다.
"""
import os
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import css_layer_audit as AUDIT

# 2026-09-04 실측 기준선. 195개를 제거한 뒤 51개였고, 같은 날 홈 화면 밑줄 제거
# 작업에서 죽은 선언 7개를 더 정리해 44개가 됐다.
# 남은 것은 선택자가 여러 개인 규칙이라 일부만 죽어 통째로 지울 수 없는 경우다.
# ⚠️ 이 숫자는 내려가기만 해야 한다. 올려서 통과시키지 말 것.
BASELINE = 44


class CssLayering(unittest.TestCase):
    def test_dead_declarations_do_not_grow(self):
        os.chdir(HERE)
        files = AUDIT.load_order()
        self.assertGreaterEqual(len(files), 5, "index.html에서 CSS 로드 순서를 못 읽었다.")
        _, dead = AUDIT.analyze(files)
        total = sum(len(v) for v in dead.values())
        if total > BASELINE:
            lines = []
            for f, rows in dead.items():
                for media, sel, prop, val, why in rows[:40]:
                    lines.append(f"  {os.path.basename(f)} [{media or 'top'}] "
                                 f"{sel} · {prop}: {val}  ->  {why}")
            self.fail(
                f"적용되지 않는 CSS 선언이 {total}개로 기준선 {BASELINE}개를 넘었다.\n"
                f"나중에 읽는 파일이 같은 값을 이미 정하고 있어서, 이 선언을 고쳐도 화면은 안 바뀐다.\n"
                f"고칠 값이 실제로 화면에 반영되는 파일에서 고치거나, 겹친 쪽을 지워라.\n"
                + "\n".join(lines))

    def test_load_order_is_known(self):
        """로드 순서가 바뀌면 어느 파일이 이기는지도 바뀐다 — 조용히 바뀌면 안 된다."""
        os.chdir(HERE)
        files = [os.path.basename(f) for f in AUDIT.load_order()]
        for name in ('app-shell.css', 'editorial-foundation.css', 'editorial-accessibility.css'):
            self.assertIn(name, files, f"{name}이 index.html 로드 순서에서 사라졌다.")
        self.assertLess(files.index('app-shell.css'), files.index('editorial-foundation.css'),
                        "app-shell.css는 editorial-foundation.css보다 먼저 읽혀야 한다"
                        "(뒤 파일이 디자인 시스템 값으로 덮어쓰는 구조).")
        self.assertLess(files.index('editorial-foundation.css'),
                        files.index('editorial-accessibility.css'),
                        "editorial-accessibility.css가 마지막이어야 접근성 보정이 이긴다.")

    def test_specificity_helper_is_correct(self):
        """실제로 틀렸던 계산들을 고정한다."""
        self.assertEqual(AUDIT.specificity('.hero-title'), (0, 1, 0))
        # :where()는 명시도 0 — body 하나만 센다.
        self.assertEqual(AUDIT.specificity('body :where(.hero-title)'), (0, 0, 1))
        self.assertEqual(AUDIT.specificity('#app .card'), (1, 1, 0))
        # 괄호 안 콤마는 선택자 구분자가 아니다.
        self.assertEqual(AUDIT.split_top('body :where(.a,.b), .c'),
                         ['body :where(.a,.b)', ' .c'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
