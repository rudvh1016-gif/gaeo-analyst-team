# THIRD-PARTY NOTICES — 개오(GAEO) 애널리스트팀

이 저장소와 사이트(gaeoteam.com)가 쓰는 제3자 소프트웨어·서체·아이콘·문서의 저작권과 라이선스 고지입니다.
각 라이선스가 요구하는 저작권 표시·허가 문구를 여기 그대로 유지합니다. 기록일 2026-09-16.
(데이터 출처의 이용 조건 확인 상태는 별도 문서 `docs/legal/SOURCE_COMPLIANCE_MATRIX.md` 에 있습니다.)

| 구성요소 | 용도 | 라이선스 | 원문 위치 |
|---|---|---|---|
| Wanted Sans Variable (Wanted Lab, Inc. · 2024) | 사이트 본문 서체 (self-host, `assets/fonts/wanted-sans/`) | SIL Open Font License 1.1 | `assets/fonts/wanted-sans/OFL.txt` |
| Lucide Icons (Lucide Icons and Contributors) | 인라인 SVG 아이콘 일부(`app.js`, `insight-rail.js`, `scorecard-ui.js`, `index.html`) | ISC | 아래 §1 |
| Feather Icons (Cole Bemis · 2013–2023) | Lucide 의 원형 — 일부 아이콘 path 동일 | MIT | 아래 §2 |
| Pretendard (Kil Hyung-jin · Adobe Source 계열) | 2026-09-16 까지 `changelog.html` 이 CDN 에서 불러오던 서체 — 이제 로드하지 않음(CSS 대체 이름으로만 남음) | SIL Open Font License 1.1 | https://github.com/orioncactus/pretendard/blob/main/LICENSE |
| impeccable (pbakaus) | Claude Code 스킬(개발 도구, 사이트 미배포) `.claude/skills/impeccable/` | Apache License 2.0 | `.claude/skills/impeccable/LICENSE` |
| claude-seo (AgriciDaniel) | Claude Code 스킬 `.claude/skills/seo*` (25개 폴더) | MIT | `.claude/skills/seo/LICENSE` (각 폴더에 사본) |
| FLOW prompts (Daniel Agrici) | `.claude/skills/seo-flow/references/` | CC BY 4.0 | 각 파일 머리말 `Source: github.com/AgriciDaniel/flow` |
| web-quality-skills (Addy Osmani) | `.claude/skills/{accessibility,best-practices,core-web-vitals,performance,web-quality-audit}` | MIT | `.claude/skills/web-quality-audit/LICENSE` (각 폴더에 사본) |
| taste-skill (Leonxlnx) | `.claude/skills/taste-skill/` | MIT | `.claude/skills/taste-skill/LICENSE` |
| ui-ux-pro-max (Next Level Builder) | `.claude/skills/ui-ux-pro-max/` | MIT | `.claude/skills/ui-ux-pro-max/LICENSE` |
| cryptography (PyCA) | 연구 원장 AES-256-GCM 암호화 (`research_crypto.py`) — CI·워크플로에서 pip 설치 | Apache-2.0 OR BSD-3-Clause (PyPI 메타데이터 `license_expression`, 2026-09-16 확인) | https://pypi.org/project/cryptography/ |
| gs-quant 2.1.4 (Goldman Sachs) | `evolution-lab.yml` 연구 검산 전용(`gaeo_reference/gs_reference.py`) — Production 미사용 | Apache-2.0 (PyPI 메타데이터, 2026-09-16 확인) | https://pypi.org/project/gs-quant/2.1.4/ |
| Playwright (Microsoft) | 브라우저 회귀 시험 전용(러너 전역 설치, 사이트 미배포) | Apache-2.0 (프로젝트 공식 저장소 기준 · 저장소에 사본 없음) | https://github.com/microsoft/playwright |

`.claude/` 아래 스킬은 GitHub Pages 배포에서 제외되어 사이트 방문자에게 배포되지 않지만, 저장소가 public 이므로
소스 배포로서 고지 의무를 지킵니다. 저장소 본체(GAEO 코드·글·점수 체계)의 이용 조건은 루트 `LICENSE` 를 봅니다.

## §1 Lucide Icons — ISC License (원문, https://github.com/lucide-icons/lucide/blob/main/LICENSE 2026-09-16 취득)

```
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## §2 Feather Icons — MIT License (원문, https://github.com/feathericons/feather/blob/main/LICENSE 2026-09-16 취득)

```
The MIT License (MIT)

Copyright (c) 2013-2023 Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## §3 Wanted Sans — SIL Open Font License 1.1

전문은 `assets/fonts/wanted-sans/OFL.txt` 에 동봉되어 있고, 서체 CSS 머리말에도 저작권·라이선스 표시가 있습니다
(`assets/fonts/wanted-sans/WantedSansVariable.css`). 회귀 시험 `test_paper_font.js` 가 동봉 여부를 검사합니다.

## §4 MIT 라이선스 사본 (web-quality-skills · claude-seo · taste-skill · ui-ux-pro-max)

각 벤더 폴더의 `LICENSE` 파일이 저작권자 표시와 허가 문구 전문입니다. 2026-09-16 준법 감사에서 사본이 없던
`accessibility` · `best-practices` · `core-web-vitals` · `performance` (web-quality-skills) 와
`seo-cluster` · `seo-drift` · `seo-ecommerce` · `seo-sxo` · `seo-flow` (claude-seo) 폴더에 사본을 채웠습니다.
자동 검사 `legal_source_gate.py` (VENDORED_LICENSE_MISSING) 가 유지 여부를 봅니다.

## §5 확인되지 않은 항목 (OWNER_CONFIRMATION_REQUIRED)

- OG 공유 이미지(`og-understand-more.png`, `og-image*.png`)에 픽셀로 박제된 표시용 서체의 이름·라이선스가 저장소에 기록되어 있지 않습니다.
  디자인 원본과 서체 라이선스(웹·상업 이용 가능 여부)를 소유자가 확인해 여기 적어야 합니다.
