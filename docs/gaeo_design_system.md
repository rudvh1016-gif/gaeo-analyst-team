# GAEO 디자인 시스템

작성 2026-08-15 · 적용 대상: `index.html` · `about.html` · `rotation.css` · `insight-rail.css` ·
`generate_snapshots.js`가 찍는 스냅샷 템플릿

## 왜 이 문서가 있나

기능을 추가할 때마다 새 색·새 배지·새 카드를 하나씩 얹다 보니, 화면이 조용한 금융 리포트가
아니라 **알록달록한 AI 대시보드**처럼 변해 갔다. 이 문서는 그 습관을 멈추기 위한 기준이다.

앞으로 Claude Code든 Codex든, 새 화면을 만들기 전에 이 문서를 먼저 읽는다.

## 목표 한 줄

> 정보가 많아도 **조용하고 정돈되어** 있으며, Apple식 여백·타이포그래피와
> 정제된 금융 리포트가 결합된 화면.

## 핵심 규칙 (요약)

이 여덟 줄만 지켜도 대부분 해결된다.

1. **No per-analyst colors** — 분석가별 고유색을 만들지 않는다
2. **No decorative gradients** — 장식용 그라데이션 금지
3. **No decorative emoji** — 섹션 제목마다 emoji를 붙이지 않는다
4. **No pill proliferation** — 모든 상태를 배지로 만들지 않는다
5. **Semantic market colors only** — 빨강·파랑은 시장 방향에만
6. **Typography and spacing first** — 계층은 색이 아니라 타이포·여백으로
7. **Apple-inspired editorial finance** — 화려함보다 읽히는 것
8. **Mobile-first readability** — 375px에서 먼저 읽히는지 본다

---

## 1. 색

### 기본 팔레트

| 역할 | 값 |
|---|---|
| 캔버스 | `--bg` (라이트 `#F5F5F7`) |
| 카드 | `--paper` (흰색) |
| 본문 | `--ink` / `--t2` / `--t3` / `--dim` |
| 구분선 | `--line` (neutral 1px) |
| 브랜드 액센트 | 애플 블루 계열 1개만, 제한적으로 |

⚠️ **본문 텍스트 색은 반드시 변수로.** 하드코딩한 slate hex는 다크모드에서 안 보인다.
새 배경 요소를 만들면 `html.gdark` 오버라이드를 함께 추가한다.

### 색을 써도 되는 유일한 경우

**시장 방향**뿐이다.

- 주가 상승 / 하락 (한국식: 상승 빨강 `--krup`, 하락 파랑 `--krdn`)
- 실제 수익률
- BUY / SELL 의미

그마저도 **숫자와 기호에만** 쓴다. 카드 배경 전체를 칠하지 않는다.

### 하면 안 되는 것

- 분석가마다 다른 색 (QUANT 주황 · FLOW 초록 · DIANA 보라 · TARO 하늘)
  → **이름과 역할 텍스트로 구분한다**
- 컬러 원형 점(dot) → 제거하거나 neutral
- 컬러 progress bar → 제거하거나 neutral
- HOLD 주황 pill 남발
- gradient / neon / glass / glow
- bright blue 남용

### 좋은 예

```
1  QUANT
   확률·통계 분석                      56.7%

2  FLOW
   수급 분석                           56.6%
```

순위는 숫자로, 이름은 굵기로, 값은 tabular numbers와 여백으로 구분한다. 색이 필요 없다.

---

## 2. 계층

계층은 **색상이 아니라** 아래 여섯 가지로 만든다.

Typography · Size · Weight · Spacing · Alignment · Divider

숫자를 강조할 때도 색보다 **font size · weight · tabular numbers · whitespace**를 먼저 쓴다.

---

## 3. 배지 · 아이콘 · Emoji

- `LIVE` `MVP` `발언권` `BEST` `NEW` 같은 것을 전부 배지로 만들지 않는다.
  가능하면 평범한 secondary text로 쓴다.
- 섹션 제목마다 🎯 🔎 🧪 🧭 💉 같은 장식 emoji를 붙이지 않는다.
  의미를 담은 아이콘만 최소한으로 쓴다.
- 이미 자리 잡은 기능 아이콘(📡 레이더, 🧠 정밀분석, 🤖 자동분석)은 **식별자 역할**을 하므로
  유지한다. 새로 만들 때만 자제한다.

---

## 4. 카드

- 정보 하나마다 카드 하나를 만들지 않는다.
- 큰 Section 안에서 **divider · row · column · spacing**으로 나눈다.
- **카드 안 카드**를 최소화한다.
- Border: neutral 1px
- Shadow: 매우 약하게 (`--shadow-sm` 이하)
- Gradient / Neon / Glass: 금지

---

## 5. 타이포그래피

- Pretendard / system stack 유지
- 설명문 본문
  - Desktop 약 13~15px
  - Mobile 약 12.5~14px
- 실제 화면을 보고 최종 조정한다
- 숫자는 `font-variant-numeric: tabular-nums`

한국어 줄바꿈 주의: 콘텐츠 컨테이너에는 `overflow-wrap:anywhere`가 필요하다
(`word-break:keep-all`과 겹치면 `·`로 이어붙인 나열이 뷰포트를 넘친다 — 2026-08-03 실제 사고).

---

## 6. 차트

- Primary data: **핵심색 1개**
- 비교선: 최대 1~2색
- 보조선: gray / opacity / dash

모든 Indicator에 서로 다른 bright color를 주지 않는다.

---

## 7. 화면별 지침

### 모델 대시보드

5개 모델(기본모델 개선판 · 연구 A · 연구 B · 연구 C · 구형 그림자모델)을
**5개의 화려한 카드**로 만들지 않는다. **하나의 Comparison Panel**에 행으로 배치한다.
상태도 Color badge보다 Text hierarchy 중심으로 표현한다.

### 성적표

상단의 채점완료 · 적중 · 빗나감 · 보류 · 종목 · 적중률을 여러 카드가 아니라
**하나의 Summary Grid**로 구성한다. 적중/빗나감 색도 숫자 정도만 semantic color.

### 가이드북

화려한 색깔 카드 12개로 만들지 않는다. 하나의 Guidebook 안에서
`01` `02` `03` 번호 + 제목 + 짧은 설명 + (필요하면) accordion.
화이트/뉴트럴, 색상 최소. → 2026-08-15 적용 완료.

### Research Hub (snap/index.html)

`generate_snapshots.js`가 자동 생성하는 정적 리서치 허브. 손으로 고치지 말 것(Generator-first).

- Research(뉴스분석·종목공부·주식공부·부동산공부)와 Utility(계산기)를 숫자·화면 모두 분리
- 자동 종목페이지(snap/stock) 절대 미포함 · 정밀분석은 기존 Library 링크 재사용
- Featured는 인기·AI 판단이 아니라 결정적 규칙(발행일 최신 → news→study→lesson→estate → id 큰 글)
- 카드 남발 금지 — Section heading + row + divider + 여백으로만 계층
- 하단 전체 기록(전 글 날짜순 href)은 항상 유지

### about.html

의도적인 Dark Brand page라면 무조건 White로 뒤집을 필요는 없다. 다만
파란색 남발 · 컬러 카드 · 과한 accent · 카드 안 카드 · glow · gradient ·
AI dashboard 느낌은 제거한다. Dark라면 black · charcoal · neutral gray ·
white typography 중심으로, accent는 매우 제한적으로.

---

## 8. 모바일

최소 **375px · 390px · 430px**에서 검증한다.

- 가로 넘침 0
- 버튼·배지 잘림 0
- 너무 큰 설명문 0
- 불필요한 빈 공간 0
- 표가 화면 밖으로 이탈 0

⚠️ 정보를 **삭제하기보다 재배치하거나 접는다.** 모바일이라고 내용을 빼지 않는다.

---

## 9. 새 화면을 만들기 전 자문할 것

작업을 끝내기 전에 아래에 전부 YES라고 답할 수 있어야 한다.

- 조용하고 현대적인가?
- 색깔이 과하지 않은가?
- 분석가별 무지개색이 없는가?
- 배지가 적은가?
- Emoji가 적은가?
- 카드 안 카드가 없는가?
- Typography가 중심인가?
- 모바일이 정돈됐는가?
- AI 자동생성 Dashboard 느낌이 아닌가?

---

## 10. 아직 남은 정리 대상

이 문서를 만든 시점(2026-08-15)에 규칙은 정했지만 화면 전체에 다 적용하지는 못했다.
정직하게 남겨 둔다.

| 대상 | 상태 |
|---|---|
| 가이드북 | ✅ 적용 완료 (그라데이션 제거 · 장식 emoji 제거 · 번호 기반 계층) |
| 분석가 카드 고유색 | ⏳ 미적용 — `index.html`의 분석가별 색 변수가 아직 남아 있다 |
| 성적표 Summary Grid | ⏳ 미적용 |
| 모델 대시보드 Comparison Panel | ⏳ 미적용 |
| about.html accent 정리 | ⏳ 부분 적용 (문구만 갱신) |

다음 작업자는 위 ⏳ 항목부터 이어서 하면 된다. **새 기능을 추가하면서
다시 컬러풀하게 되돌리지 말 것.**
