# GAEO 역할(Agent) 요약표 — 도구 무관 (자동 생성)

> `sync_agent_compat.py` 가 `.claude/agents/*.md`(원본)에서 만든다. 손으로 고치지 않는다(`test_agent_compat.py`).
> 원본 지침 전문은 각 행의 파일을 읽는다. Codex 등 서브에이전트가 없는 도구는 필요한 역할 파일을 읽고 그 관점으로 **순차** 수행한다.
> 어느 역할에도 모델 지정(`model:`)이 없다 — 세션 기본값 상속. 읽기 전용은 **지침**이며(Bash 가 있으면 기술적으로는 쓸 수 있다), Codex 에서는 `.codex/agents/<역할>.toml` 의 `sandbox_mode` 가 강제한다(설치본 인식 미확인).
> 독립 검토: 같은 AI(같은 세션)가 역할만 바꿔 보는 것은 독립 검토가 아니다 — 별도 세션의 검토자 1명(사람·별도 AI 세션) 또는 기계 검사(`test_*`·`gaeo_check.py`)가 독립 검토다. 동시 실행 AI 는 메인 포함 2개 이내.

## 개발·점검 (GAEO TEAM)

| 역할 | 하는 일 | 도구 | 쓰기 | sandbox_mode | 원본 |
|---|---|---|---|---|---|
| `gaeo-product-lead` | GAEO 제품 방향·개발 우선순위를 결정하는 팀장 역할. 여러 전문 영역(분석 품질·UX·성장·엔지니어링)의 제안을 모아 "지금 무엇을 먼저 해야 하는가"를 정할 때, 새 기능 아이디어가 정말 필요… | Read, Grep, Glob, WebSearch | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-product-lead.md` |
| `gaeo-quant-research` | GAEO의 주식 분석 로직(GAEO Score, 재무·수급·기술·밸류·모멘텀 지표, 종합 판단 산식)을 연구·검토하는 애널리스트. 새 지표 추가, 점수 산식 변경, 신호 품질 검토, 백테스트 방향 … | Read, Grep, Glob, Bash, WebSearch | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-quant-research.md` |
| `gaeo-data-analyst` | GAEO 과거 판단이 실제로 맞았는지 데이터로 검증하는 애널리스트. 적중률, 기간별(1주/1개월/3개월) 실제 성과, 전략·산식 변경 전후 비교, 모의투자(paper) 성과 분석이 필요할 때 사용한… | Read, Grep, Glob, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-data-analyst.md` |
| `gaeo-engineer` | GAEO 저장소에 실제 기능을 구현하는 개발자. 승인된 범위의 코드 작성·수정, 데이터 흐름 연결, 성능·코드 구조·기존 시스템과의 호환성을 담당한다. gaeo-build 스킬에서 항상 호출되는 핵… | Read, Write, Edit, MultiEdit, Grep, Glob, Bash | 쓰기 가능 | `workspace-write` | `.claude/agents/gaeo-engineer.md` |
| `gaeo-qa` | GAEO 저장소의 버그를 찾고 재현하고 회귀 테스트를 돌리는 검사원. 방금 만든 기능이 제대로 되는지, 기존 기능이 망가지지 않았는지 확인할 때, 또는 사이트에서 이상 증상이 보고됐을 때 원인 재현… | Read, Grep, Glob, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-qa.md` |
| `gaeo-ux-designer` | GAEO의 PC/모바일 사용성·정보 구조·가독성·디자인 일관성을 검토하는 디자이너. 화면 개편, 새 UI 추가, 디자인 리뷰가 필요할 때 사용한다. docs/gaeo_design_system.md의… | Read, Grep, Glob, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-ux-designer.md` |
| `gaeo-growth-lead` | GAEO의 신규 유입·재방문·SEO·광고수익을 검토하는 담당. 새 공개 페이지, SEO 구조 변경, AdSense·광고 배치, 콘텐츠 구조 변경이 필요하거나 검토할 때 사용한다. "좋은 분석 → 사… | Read, Grep, Glob, Bash, WebSearch | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-growth-lead.md` |
| `gaeo-security` | GAEO의 보안 취약점을 점검하는 담당. 개인정보·계좌정보·Toss 연동·API 키·인증·권한이 걸린 기능을 만들거나 바꿀 때, 또는 정기 점검(gaeo-health)에서 보안 구멍이 없는지 확인할… | Read, Grep, Glob, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-security.md` |
| `gaeo-product-analytics` | GAEO의 익명 제품 사용 흐름과 성장 측정 품질을 점검하는 역할 | (미지정 = 세션 기본) | 읽기 전용(지침) | `read-only` | `.claude/agents/gaeo-product-analytics.md` |

## 정밀분석 5인 (종목분석 스킬 안에서 쓰인다)

| 역할 | 하는 일 | 도구 | 쓰기 | sandbox_mode | 원본 |
|---|---|---|---|---|---|
| `chief-pm` | 기술적(TARO)·재무(DIANA)·심리(NOVA) 분석가의 의견을 종합해 최종 투자 판단(BUY/HOLD/SELL)을 내리는 총괄 PM. | WebSearch | 읽기 전용(지침) | `read-only` | `.claude/agents/chief-pm.md` |
| `taro-technical` | 주식의 기술적 분석(차트/이동평균/RSI/MACD/거래량)을 담당하는 애널리스트. 종목의 기술적 관점 분석이 필요할 때 사용. | WebSearch, WebFetch, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/taro-technical.md` |
| `diana-fundamental` | 주식의 재무·기본적 분석(재무제표/밸류에이션/수익성/성장성)을 담당하는 애널리스트. 기업 가치 분석이 필요할 때 사용. | WebSearch, WebFetch, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/diana-fundamental.md` |
| `nova-sentiment` | 뉴스와 시장 심리(소셜 감성/공포탐욕/이슈)를 분석하는 애널리스트. 종목의 심리·재료 분석이 필요할 때 사용. | WebSearch, WebFetch | 읽기 전용(지침) | `read-only` | `.claude/agents/nova-sentiment.md` |
| `flow-supply` | 외국인·기관·개인 수급(순매매)과 공매도·프로그램매매를 분석하는 애널리스트. "누가 사고 파는가"를 추적할 때 사용. | WebSearch, WebFetch, Bash | 읽기 전용(지침) | `read-only` | `.claude/agents/flow-supply.md` |

## 범위 밖

- `.claude/agents/seo-*.md` 는 외부 SEO 스킬 묶음의 에이전트(보존만). 원본 그대로 두며(일부에 `model: sonnet` 이 원문에 있음) 여기 표와 검사 범위에서 뺀다.
- 부르는 규칙(정상 점검 0명 · 메인 1명 · 메인 포함 동시 2개 이내 · 관점 순서대로)은 `docs/gaeo_team_system.md` 「2026-09-10 절약형 개정」.
- Codex 형식 `.codex/agents/<역할>.toml`(name · description · developer_instructions · sandbox_mode)은 2026-09-10 지시서 기준 공식 스펙에 맞췄고, 공식 문서 직접 확인·설치본 인식은 미확인이다(`docs/agent/MIGRATION_MAP.md`).
