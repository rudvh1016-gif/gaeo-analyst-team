# GAEO TEAM: 저장소 운영을 돕는 8인 Agent + 7개 Skill 체계

이 문서는 2026-08-19에 만들어진 "GAEO TEAM" 시스템을 설명한다. GAEO TEAM은 이 저장소(GAEO 애널리스트팀 웹서비스)를 **개발·점검·성장시키는 작업 자체**를 돕는 Claude Code 전용 조직이다. 사용자에게 주식 판단을 제공하는 TARO·DIANA·QUANT·FLOW·CHIEF(정밀분석 5인 팀, `.claude/agents/chief-pm.md` 등)와는 완전히 다른 층이다. 헷갈리지 않도록 표로 구분한다.

| | 정밀분석 5인 팀 | GAEO TEAM |
|---|---|---|
| 대상 | 사용자에게 보여줄 종목 판단 | 이 저장소 자체의 개발/운영 |
| 트리거 | `.claude/skills/종목분석 스킬` | `/gaeo-strategy` 등 7개 `gaeo-` 스킬 |
| 결과물 | `analysis.js`·`history.js` | 코드 변경, 점검 보고서, 우선순위 제안 |

## 왜 만들었나

모든 GAEO TEAM 활동은 다음 두 질문을 기준으로 판단한다.

1. **이 작업이 GAEO의 투자 판단 품질(검증력)을 높이는가?**
2. **이 작업이 사용자 증가·재방문·만족도(궁극적으로 광고 수익)에 기여하는가?**

두 질문 다 약하면 우선순위를 낮춘다. 즉시 버리지는 않는다.

## 8개 Agent

| Agent | 파일 | 쉽게 말하면 |
|---|---|---|
| `gaeo-product-lead` | `.claude/agents/gaeo-product-lead.md` | 여러 전문가 의견을 모아 "지금 뭐부터 할지" 순서를 정하는 팀장 |
| `gaeo-quant-research` | `.claude/agents/gaeo-quant-research.md` | GAEO Score·분석 산식이 논리적으로 타당한지 연구하는 사람 |
| `gaeo-data-analyst` | `.claude/agents/gaeo-data-analyst.md` | 과거 데이터로 "진짜 맞았는지" 실측하는 사람 (퀀트의 가설을 검증하는 짝) |
| `gaeo-ux-designer` | `.claude/agents/gaeo-ux-designer.md` | 화면이 보기 편하고 일관된지 보는 디자이너 |
| `gaeo-engineer` | `.claude/agents/gaeo-engineer.md` | 실제로 코드를 쓰는 유일한 개발자 (다른 7명은 코드를 고치지 않는다) |
| `gaeo-qa` | `.claude/agents/gaeo-qa.md` | 버그를 재현하고 회귀 테스트를 돌리는 검사원 |
| `gaeo-security` | `.claude/agents/gaeo-security.md` | 계좌·API 키·개인정보 노출 같은 보안 구멍을 찾는 사람 |
| `gaeo-growth-lead` | `.claude/agents/gaeo-growth-lead.md` | 유입·재방문·SEO·광고수익을 검토하는 사람 |

**쓰기 권한(Edit/Write)은 `gaeo-engineer` 한 명에게만 있다.** 나머지 7명은 읽기·분석 전용이라 여러 Agent가 동시에 같은 파일을 고쳐서 충돌하는 일이 구조적으로 안 생긴다.

## 7개 Skill (전부 `gaeo-` 접두어, `/gaeo` 입력 시 목록에 뜬다)

| Skill | 언제 쓰나 | 안전 규칙 |
|---|---|---|
| `/gaeo-strategy` | 다음에 뭘 개발할지 모르겠을 때 | **읽기 전용.** 코드 수정 절대 안 함 |
| `/gaeo-build` | 정한 것을 실제로 만들어달라고 할 때 | 승인된 범위만 수정, 요청 안 한 기능 추가 금지 |
| `/gaeo-review` | 방금 만든 걸 배포 전에 검수할 때 | 독립적 재검토, 최소 범위 수정만 |
| `/gaeo-bug` | 뭔가 이상하거나 오류가 났을 때 | 재현→근본원인 확인 후에만 수정 |
| `/gaeo-quant` | 분석 로직이 정말 좋아졌는지 확인할 때 | 실제 과거 데이터 검증 필수, 새 지표 추가가 목적이 아님 |
| `/gaeo-growth` | 유입·재방문·광고수익을 검토할 때 | "사용자 가치 → 성장" 순서 고정, 뒤집기 금지 |
| `/gaeo-health` | 사이트 전체를 한 번 점검할 때 | **기본 읽기 전용.** 대표 요청 없이 대규모 수정 안 함 |

## 자연스러운 흐름

```
방향을 모르겠다      →  /gaeo-strategy  (읽기 전용, P0/P1/P2 제안)
만들기로 결정했다    →  /gaeo-build [항목]
다 만들었다          →  /gaeo-review    (PASS/FAIL)
문제가 생겼다        →  /gaeo-bug
```

`/gaeo-quant`, `/gaeo-growth`는 위 흐름과 별도로, 아래 "조건부 제안" 상황에서만 등장한다. `/gaeo-health`는 매주 금요일 조건부로만 제안된다.

## Skill이 부르는 Agent (최소 인원 원칙)

작업 성격에 따라 필요한 Agent만 부른다. 이유 없이 8명을 다 부르지 않는다.

- **`/gaeo-strategy`**: 기본 조합 `gaeo-product-lead`+`gaeo-quant-research`+`gaeo-ux-designer`+`gaeo-growth-lead` (Agent Team 병렬 조사, 편향 방지를 위해 서로 결론을 미리 공유하지 않음). 필요시 `gaeo-data-analyst`/`gaeo-engineer` 추가.
- **`/gaeo-build`**: `gaeo-engineer` 항상 포함 + 업무 성격별 추가(금융계산→퀀트/데이터, 화면→UX, SEO→Growth, 계정/인증→Security) + 마지막에 항상 `gaeo-qa`.
- **`/gaeo-review`**: 항상 `gaeo-qa`+`gaeo-engineer`(리뷰어 역할)+`gaeo-security`, 화면 변경시 UX, 금융계산 변경시 퀀트/데이터 추가.
- **`/gaeo-bug`**: 기본 `gaeo-qa`+`gaeo-engineer`, 증상에 따라 퀀트/보안/데이터 추가.
- **`/gaeo-quant`**: `gaeo-quant-research`(가설)+`gaeo-data-analyst`(실증), 구현 확정시 `gaeo-engineer`.
- **`/gaeo-growth`**: `gaeo-growth-lead`(중심)+`gaeo-product-lead`(사용자가치 필터)+`gaeo-ux-designer`(광고·UX 균형), 실측 필요시 데이터, 구현시 엔지니어.
- **`/gaeo-health`**: 기본 4명(`gaeo-engineer`+`gaeo-qa`+`gaeo-security`+`gaeo-ux-designer`), 상황별로 퀀트/Growth/데이터 추가.

## 주간 자동 제안 (Routine) — 자동 실행이 아니라 "제안"

이 저장소 계정에 다음 두 Routine이 등록돼 있다(Claude Code 예약 실행 기능, `list_triggers`로 조회 가능).

- **월요 09:00 KST** (`gaeo 월요 Strategy 제안`): 지난 한 주 커밋 이력을 훑어보고, `/gaeo-strategy`를 실행할 가치가 있는지 판단해서 **제안 메시지만** 보낸다. 의미 있는 변경이 거의 없었으면 억지로 권하지 않는다.
- **금요 09:00 KST** (`gaeo 금요 Health 제안`): 지난 한 주 변경량(사람이 만든 기능 변경 커밋 수, 버그 수정 반복 여부 등)을 보고, `/gaeo-health`가 필요할 만큼 변경이 컸는지 판단해서 **제안 메시지만** 보낸다. 변경이 적으면 조용히 넘어가거나 아주 짧게만 알린다.

두 Routine 모두:
- 파일을 Edit/Write하지 않는다.
- git commit·push·PR·병합을 하지 않는다.
- 다른 `/gaeo-*` 스킬을 자동 실행하지 않는다. "제안 메시지"만 보낸다.
- 이 세션(`session_01LTChxNhsriBncdbu8oV3wA`)에 self-bind 돼 있어, 매주 같은 대화 흐름으로 이어진다. 이 저장소의 기존 시세/시황 자동화 Routine 2개와 동일한 바인딩 방식이다.

`/gaeo-quant`, `/gaeo-growth`는 요일 기반 자동 제안이 없다. 대신 `/gaeo-strategy`, `/gaeo-health`, `/gaeo-build` 진행 중에 아래 같은 조건을 만나면 그 안에서 조건부로 제안된다.

- `/gaeo-quant` 제안 조건: GAEO Score 계산 변경, 새 지표 추가, 분석 로직 변경, 적중률 장기 미검증
- `/gaeo-growth` 제안 조건: 새 공개 페이지, SEO 구조 대규모 변경, AdSense 변경, 유입 관련 기능 변경

## 안전 규칙 요약 (모든 Skill 공통)

- main에 자동 병합되는 흐름 없음. `/gaeo-build`도 배포는 별도 확인 후 진행.
- 요청하지 않은 대규모 리팩터링·디자인 방향 변경·기능 추가 금지.
- API 키·시크릿 하드코딩 금지, 승인 안 된 유료 API 신규 도입 금지.
- em dash(`—`) 등 저장소 콘텐츠 고정 규칙(`AGENTS.md`) 준수.
- `analysis.js`의 정밀분석 종목 블록과 market 블록을 섞어 건드리지 않는다(이 저장소에서 반복된 실제 사고 패턴).

## 알아둘 점

- Agent/Skill 파일은 세션 중간에 만들어도 즉시 등록돼 바로 쓸 수 있다(재시작 불필요, 2026-08-19 확인).
- 위 Routine 2개는 이 세션 소유 계정에 묶여 있다. 계정·세션이 바뀌면 `list_triggers`로 다시 확인해야 한다.
- `/gaeo-quant`, `/gaeo-growth`, `/gaeo-health`를 직접 실행하는 것도 언제든 가능하다. 조건부 제안은 "몰라서 안 하게 되는 일"을 줄이기 위한 보조 장치일 뿐이다.
