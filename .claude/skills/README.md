# 이 폴더의 스킬들

`.claude/skills/` 안에 있는 폴더는 클로드코드가 이 저장소를 열 때 자동으로 읽어들이는
"작업 지침서"입니다. 별도 설치 없이, 이 저장소를 git으로 받기만 하면 같이 딸려옵니다.

## 개오팀 전용 (직접 작성)

- `종목분석 스킬` — 정밀분석 대상 종목 재분석 절차
- `뉴스분석 스킬` — 뉴스분석 보고서 작성 절차

## 디자인 품질 스킬 (외부 오픈소스, 2026-08-15 도입)

화면이 "AI가 만든 티"가 나는 문제(색·간격 제각각, 딱딱한 문구, 뻔한 레이아웃)를
줄이기 위해 아래 3개를 그대로 가져와 넣었습니다. 전부 MIT/Apache 2.0 오픈소스라
저장소에 포함해 써도 됩니다.

| 폴더 | 원본 | 용도 |
|---|---|---|
| `taste-skill` | [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | 새 화면을 만들 때 "AI 기본값"(보라색 그라디언트, Inter 폰트, 뻔한 3단 카드)을 피하고 브리핑을 읽어 방향을 잡음 |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 색상·폰트·간격·접근성 규칙을 실제 검색해서 근거 있는 값으로 추천(감이 아니라 데이터 기반) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `critique`(비평) · `polish`(마무리) · `audit`(접근성·성능 점검) 등 22개 세부 명령. 완성한 화면을 점검할 때 특히 유용 |

**주의**: 자동 실행되는 hook(파일 저장할 때마다 끼어드는 기능)은 일부러 뺐습니다.
이 저장소에 이미 있는 다른 자동화(파이프라인 점검 등)와 충돌하지 않게 하기 위해서입니다.
필요할 때 대화창에서 직접 불러 써야 합니다(아래 사용법 참고).

### 사용법 (비개발자용)

새 대화를 시작하고 이렇게 말하면 됩니다. 이름을 정확히 안 외워도, 클로드가
지금 하려는 일(화면 만들기/점검하기)에 맞는 스킬을 알아서 찾아 씁니다.

- "이 화면 좀 비평해줘 / 어디가 AI 느낌인지 짚어줘" → `impeccable critique`
- "완성됐는데 마무리로 다듬어줘" → `impeccable polish`
- "색이랑 폰트 뭐 쓸지 정해줘" → `ui-ux-pro-max`
- "새로 화면 만들 때 뻔하지 않게" → `taste-skill`

### 버전 업데이트

원본이 업데이트되면 이 폴더는 자동으로 안 따라갑니다. 나중에 "디자인 스킬 최신으로
업데이트해줘"라고 하면 위 원본 저장소에서 다시 받아옵니다.

## SEO·성능 스킬 (외부 오픈소스, 2026-08-15 도입)

`changelog.js`에 남아있는 과거 사고(링크 174개 404, 검색결과 제목·설명 잘림)와
7월 "찾아올 수 있는 사이트로" 개편 이력을 근거로, 반복적으로 문제가 났던 SEO·속도
영역을 점검할 때 쓰는 스킬 2세트를 추가했습니다. 전부 MIT 오픈소스입니다.

| 폴더 | 원본 | 용도 |
|---|---|---|
| `seo` 및 `seo-*` 24개 | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | 기술 SEO·스키마(JSON-LD)·사이트맵·이미지 SEO·E-E-A-T 콘텐츠 품질·AI 검색(GEO, ChatGPT/Perplexity 인용) 등 24개 세부 점검. `seo`가 전체를 오케스트레이션하는 메인 스킬이고 나머지는 `/seo audit`, `/seo schema` 처럼 개별 호출도 가능 |
| `accessibility` · `best-practices` · `core-web-vitals` · `performance` · `web-quality-audit` | [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) (구글 크롬 개발자관계팀 Addy Osmani 제작) | Lighthouse 기반 성능·접근성·모범사례 점검. `index.html`이 888KB 단일 파일이고 데이터 파일이 큰(price_history.js 23MB 등) 이 프로젝트 특성상 로딩 속도 점검에 특히 유용 |

**주의 1 — 뺀 것들**:
- claude-seo의 `hooks/`(저장할 때마다 자동 개입)와 `extensions/`(DataForSEO·이미지생성 등 유료 API 필요한 부가기능)는 일부러 안 가져왔습니다. 기존 파이프라인 자동화와 충돌 여지를 없애고, 없는 API 키를 요구하는 기능을 넣지 않기 위해서입니다.
- web-quality-skills의 `seo` 스킬은 claude-seo와 이름이 겹치고 기능도 훨씬 가벼워서 뺐습니다(claude-seo 쪽이 더 포괄적).
- claude-seo는 `seo/bin/claude-seo` 실행 파일이 파이썬 가상환경을 새로 만들고 필요하면 Chromium까지 내려받는 방식이라, 처음 한 번은 인터넷이 되는 환경(사용자 PC의 클로드코드 데스크탑 등)에서 "`/seo setup` 해줘"라고 한 번 실행해야 실제 크롤링 기능이 동작합니다. 이 원격 세션은 접속 제약이 있어 이 단계는 실행하지 않았습니다.

### 사용법 (비개발자용)

- "우리 사이트 SEO 전체 점검해줘" → `/seo audit` (claude-seo 메인)
- "사이트맵 문제 없는지 봐줘" → `seo-sitemap`
- "이 페이지 구조화 데이터(스키마) 검사해줘" → `seo-schema`
- "챗GPT·퍼플렉시티에서도 잘 인용되게 해줘" → `seo-geo`
- "사이트 속도/로딩 느린 거 점검해줘" → `performance` 또는 `core-web-vitals`
- "접근성(스크린리더 등) 점검해줘" → `accessibility`
- "종합적으로 웹 품질 감사해줘" → `web-quality-audit`

이름을 몰라도 됩니다. 하려는 일을 그대로 말하면 클로드가 알맞은 스킬을 찾아 씁니다.
