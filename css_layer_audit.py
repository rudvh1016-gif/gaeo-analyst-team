#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""CSS 파일들 사이에서 '절대 적용될 수 없는'(dead) 선언을 찾아낸다.

왜 필요한가 (2026-09-04):
  index.html은 CSS를 rotation → full-market → app-shell → insight-rail →
  editorial-foundation → editorial-accessibility 순으로 읽는다. 같은 선택자·같은
  속성이면 **나중에 읽은 파일이 이긴다.** 그래서 app-shell.css의 값을 고쳐도
  editorial-foundation.css가 같은 걸 정하고 있으면 화면이 하나도 안 바뀐다.
  실제로 그 함정에 빠져 "글자 크기를 줄였는데 그대로"인 일이 있었다.

  이 파일은 그런 '고쳐도 소용없는 선언'을 찾아내고, test_css_layering.py가
  그 개수가 늘어나지 않는지 지킨다.

실행: python3 css_layer_audit.py [출력.json]

주의해서 다룬 것 (모두 실제로 틀렸던 지점이다):
  1. 콤마 분리는 괄호 밖에서만 한다. `:where(a,b)`의 콤마는 선택자 구분자가 아니다.
  2. 명시도(specificity)를 계산한다. `:where()` 안은 명시도 0이라
     `body :where(.hero-title)`는 `.hero-title`보다 약하다.
  3. !important는 명시도보다 우선한다.
  4. @media 앞 공백을 먼저 건너뛴다. 안 그러면 미디어 블록 안의 규칙을 전부
     top-level로 잘못 읽는다.
  5. 미디어 조건 문자열이 정확히 같을 때만 비교한다(다르면 판정하지 않는다).

"""
import re, os, collections

def strip_comments(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)

def split_top(text, sep=','):
    """괄호·대괄호 밖의 sep에서만 자른다."""
    parts, depth, cur = [], 0, []
    for ch in text:
        if ch in '([': depth += 1
        elif ch in ')]': depth -= 1
        if ch == sep and depth == 0:
            parts.append(''.join(cur)); cur = []
        else:
            cur.append(ch)
    parts.append(''.join(cur))
    return [p for p in parts if p.strip()]

def specificity(sel):
    """(id, class, type). :where(...)는 0으로 센다. :is()/:not()은 내부 최대값."""
    s = sel
    # :where(...) 통째로 제거 (명시도 0)
    while True:
        m = re.search(r':where\(', s)
        if not m: break
        i = m.end() - 1; depth = 0
        for j in range(i, len(s)):
            if s[j] == '(': depth += 1
            elif s[j] == ')':
                depth -= 1
                if depth == 0: break
        s = s[:m.start()] + ' ' + s[j+1:]
    inner_max = (0, 0, 0)
    for fn in (':is(', ':not(', ':has('):
        while True:
            m = re.search(re.escape(fn), s)
            if not m: break
            i = m.end() - 1; depth = 0
            for j in range(i, len(s)):
                if s[j] == '(': depth += 1
                elif s[j] == ')':
                    depth -= 1
                    if depth == 0: break
            inner = s[i+1:j]
            for part in split_top(inner):
                c = specificity(part)
                inner_max = max(inner_max, c)
            s = s[:m.start()] + ' ' + s[j+1:]
    ids = len(re.findall(r'#[\w-]+', s))
    cls = (len(re.findall(r'\.[\w-]+', s))
           + len(re.findall(r'\[[^\]]*\]', s))
           + len(re.findall(r'(?<!:):(?!:)(?!where\b|is\b|not\b|has\b)[\w-]+', s)))
    typ = (len(re.findall(r'(?:^|[\s>+~(])([a-zA-Z][\w-]*)', s))
           + len(re.findall(r'::[\w-]+', s)))
    return (ids + inner_max[0], cls + inner_max[1], typ + inner_max[2])

def parse(path):
    css = strip_comments(open(path, encoding='utf-8').read())
    out, i, media = [], 0, []
    while i < len(css):
        # ⚠️ 반드시 공백을 먼저 건너뛴다. 예전 버전은 줄바꿈 때문에 @media를 못 알아보고
        #    미디어 블록 안의 규칙을 전부 top-level로 잘못 읽었다(2026-09-04 실제 버그).
        while i < len(css) and css[i] in ' \t\r\n':
            i += 1
        if i >= len(css): break
        m = re.compile(r'@(?:media|supports)[^{]*').match(css, i)
        if m:
            media.append(' '.join(m.group(0).split()))
            i = css.index('{', i) + 1
            continue
        j, k = css.find('{', i), css.find('}', i)
        if j == -1 and k == -1: break
        if k != -1 and (j == -1 or k < j):
            i = k + 1
            if media: media.pop()
            continue
        sel = ' '.join(css[i:j].split())
        end = css.find('}', j)
        if end == -1: break
        if sel.startswith('@'):
            # @font-face·@keyframes 등 — 블록을 통째로 건너뛴다(중첩 대응).
            depth, t = 0, j
            while t < len(css):
                if css[t] == '{': depth += 1
                elif css[t] == '}':
                    depth -= 1
                    if depth == 0: break
                t += 1
            i = t + 1; continue
        for decl in split_top(css[j+1:end], ';'):
            if ':' not in decl: continue
            prop, val = decl.split(':', 1)
            prop, val = prop.strip(), val.strip()
            if not prop or prop.startswith('--'): continue
            imp = '!important' in val
            for one in split_top(sel):
                one = ' '.join(one.split())
                if one:
                    out.append({'media': media[-1] if media else '', 'sel': one,
                                'prop': prop, 'val': val, 'imp': imp,
                                'spec': specificity(one), 'rule': sel})
        i = end + 1
    return out

def analyze(files):
    parsed = {f: parse(f) for f in files}
    # 최종 승자: (important, specificity, load order) 사전순 최대
    best = {}
    for order, f in enumerate(files):
        for n, d in enumerate(parsed[f]):
            key = (d['media'], d['sel'], d['prop'])
            rank = (1 if d['imp'] else 0, d['spec'], order, n)
            if key not in best or rank > best[key][0]:
                best[key] = (rank, f, d['val'])
    dead = collections.defaultdict(list)
    for order, f in enumerate(files):
        for n, d in enumerate(parsed[f]):
            key = (d['media'], d['sel'], d['prop'])
            rank = (1 if d['imp'] else 0, d['spec'], order, n)
            wrank, wf, wval = best[key]
            if wf == f or rank == wrank:
                continue                      # 자기 파일이 이기거나 자기 자신
            if rank > wrank:
                continue                      # 내가 이긴다
            dead[f].append([d['media'], d['sel'], d['prop'], d['val'],
                            'DUPLICATE' if wval == d['val']
                            else f'SHADOWED_BY:{os.path.basename(wf)}={wval}'])
    return parsed, dead

def load_order(html_path='index.html'):
    html = open(html_path, encoding='utf-8').read()
    return [f for f in re.findall(r'<link rel="stylesheet" href="([^"?]+)', html)
            if os.path.exists(f)]

if __name__ == '__main__':
    import json, sys
    files = load_order()
    _, dead = analyze(files)
    print(json.dumps({os.path.basename(f): len(v) for f, v in dead.items()}, ensure_ascii=False))
    if len(sys.argv) > 1:
        json.dump(dict(dead), open(sys.argv[1], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
