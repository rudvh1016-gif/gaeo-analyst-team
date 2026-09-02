# 작업 절차 — 개오(Gaeo) 애널리스트팀

> 구조 설명은 [ARCHITECTURE.md](./ARCHITECTURE.md), 공통 규칙 원본은
> [AGENTS.md](../AGENTS.md)를 참고한다. 여기서는 "실제로 어떤 순서로 작업하는지"를 정리한다.

## 0. 작업을 시작하기 전에 항상

1. `AGENTS.md`를 읽는다.
2. `CLAUDE.md`(Claude Code로 작업 중이라면)를 읽는다.
3. 지금 어느 브랜치에 있는지 확인한다 (`git branch --show-current`).
4. 파이프라인이 살아있는지 확인한다 — Claude Code에서는 SessionStart 훅(`check_pipeline.py`)이
   자동으로 경고해준다. data.js가 평일 장중(09:10~16:00 KST)에 오래(수십 분 이상) 안
   갱신됐다면 아래 "파이프라인이 멈춘 것 같을 때" 절차를 먼저 본다.

## 1. 배포 절차 (사이트에 반영하기)

이 프로젝트에서 제일 자주 실수가 나는 지점이다.

1. 지정된 작업 브랜치(현재: `claude/latest-analyst-file-data-a7e4y1`)에서 커밋한다.
2. **브랜치에 push만 해서는 `gaeoteam.com`에 안 보인다.** 반드시 PR을 만들어 `main`에
   병합해야 한다.
3. 병합할 때 `data.js` / `analysis_data.json` / `indicators.json` 같은 자동 갱신 파일에서
   충돌이 나면, 보통은 더 최신 수집 시각 쪽을 택한다(대개 `ours`지만, 러너가 브랜치보다
   먼저 최신 데이터를 만들어냈다면 `origin/main` 쪽, 즉 `theirs`가 맞을 수도 있다 — 무조건
   `ours`라고 가정하지 말고 실제로 어느 쪽 타임스탬프가 최신인지 확인한다).

### "방금 origin/main이랑 트리가 같았는데 PR이 merge conflict라고 뜬다"

squash 병합은 매번 새 커밋 해시를 만든다. 그래서 로컬 브랜치가 그 squash 커밋을 실제
조상으로 갖지 못하고, git이 훨씬 이전 커밋을 공통 조상으로 잡아 내용은 같은데 계보만
달라서 충돌로 보이는 경우가 있다.

**force-push로 "해결"하지 않는다** (auto-mode가 막기도 하고, 남의 작업을 지울 위험이 있다).
대신:

```
git fetch origin main
git merge origin/main            # 로컬에서 병합 시도
# 충돌 파일이 실제로 뭐가 다른지 diff로 확인
git checkout --ours <file>       # 또는 --theirs, 실제로 최신인 쪽을 확인 후 선택
git add <file>
git commit
git push                         # 강제 아님, 평범한 push
```

이렇게 하면 히스토리를 보존한 채 정상적인 fast-forward가 가능한 상태가 된다.

## 2. 콘텐츠 발행 절차 (뉴스분석·종목공부·주식공부·부동산공부·계산기)

1. 해당 스킬 문서를 먼저 읽는다 — 뉴스분석은 `.claude/skills/뉴스분석 스킬/SKILL.md`
   (최소 2회 웹서치, 교차검증된 사실만, 본문 4,500~6,000자, 정해진 7단계 구성, 백틱·`${`
   금지 등의 기준이 있다).
2. 해당 파일(`news_analysis.js` 등)에 새 항목을 배열 **맨 앞**에 추가한다(최신이 앞).
3. `cat` 필드는 반드시 기존 카테고리 키 중 하나와 정확히 일치시킨다(ARCHITECTURE.md의
   카테고리 표 참고). 완전히 새로운 주제라 기존 키가 안 맞으면, index.html의 해당
   `*_CATS` 배열에도 카드를 함께 추가해야 그 카테고리가 화면에 나타난다.
4. **`node generate_sitemap.js`와 `node generate_snapshots.js`를 반드시 함께 실행한다.**
   둘 중 하나라도 빠뜨리면 검색엔진·AI 크롤러가 새 글을 못 찾거나 못 읽으며,
   첫 화면의 최신 글 5개 목록(`snap/latest_posts.js`)도 갱신되지 않는다.
5. 필요하면 Playwright로 화면에서 실제로 보이는지 확인한다(아래 3번 참고).
6. 커밋 → PR → main 병합.

계산기(`calculators.js`)를 추가할 때는 `cat` 외에 `calcType`도 index.html의
`calcWidgetHTML`/`wireCalcWidget`에 실제 계산 로직으로 함께 추가해야 위젯이 동작한다
(데이터만 추가하면 설명 글만 뜨고 계산기는 비어있게 된다).

## 3. 종목 정밀분석 재작업 절차

`analysis.js`의 14종목을 재분석할 때는 **`.claude/skills/종목분석 스킬/SKILL.md`를 반드시
먼저 읽는다.** 가장 중요한 철칙은 **base(분석의 기준가) ≡ data.js의 price와 무결성이
일치해야 한다**는 것 — base가 실제 시세와 어긋나면 분석 전체가 신뢰를 잃는다.

## 4. 시각적 변경 검증 (Playwright)

index.html·app-shell.css·app.js의 화면(CSS·레이아웃·동작)을 바꿨다면, 배포 전에 Playwright
(`/opt/pw-browsers/chromium`)로 다음 3개 뷰포트를 확인하는 게 관례다:

- 데스크톱 1680px
- 초와이드 1920px (우측 레일 `#railR`이 나타나는 폭)
- 모바일 390px (iPhone 13 프로필)

각 뷰포트에서 스크린샷을 찍고 `pageerror` 이벤트가 없는지도 함께 확인한다.

## 5. 파이프라인이 멈춘 것 같을 때

이 원격 세션에서는 네이버 금융이 403으로 막혀 있어 이 환경에서 직접 시세를 수집할 수
없다. 파이프라인이 멈춘 것 같으면:

1. 먼저 로컬 clone이 낡은 것뿐일 수 있으니 `git fetch origin main` 후
   `git show origin/main:data.js | head -5`로 실제 최신 상태를 확인한다.
2. 그래도 정말 오래됐다면, `.analyst-refresh` 파일 내용을 바꿔 `main`에 직접 커밋·푸시한다
   — 이게 러너를 다시 깨우는 마커 역할을 한다(러너가 1~2분 안에 반응해서 대신 수집한다).
3. Claude Code라면 SessionStart 훅(`check_pipeline.py`)이 세션 시작 때마다 이 상태를
   자동으로 점검해 경고를 띄워준다.

## 6. history.js는 절대 직접 편집하지 않는다

`history.js`(CHIEF 판단 누적 기록)는 `archive_analysis.py`만이 쓴다. 러너가 매 사이클
`--auto` 옵션으로 이 스크립트를 호출해 600종목 판단을 하루 1건씩 쌓는다. 사람이나
에이전트가 이 파일을 직접 고치면 적중률 채점 체계 전체가 깨진다.

## 7. 여러 종목을 한 번에 조사/작성해야 할 때 (비용 관련 실전 팁)

병렬 서브에이전트로 여러 종목을 동시에 처리하는 것과, 하나씩 순서대로 처리하는 것은
**최종 토큰 총량은 거의 같다** — 병렬은 속도(작업 시간)를 줄여줄 뿐, 토큰 비용을 줄여주진
않는다. 반대로 한 대화창(세션)에서 다양한 작업을 계속 이어서 하면, 누적되는 대화 맥락을
매 턴 다시 읽어야 해서 시간이 지날수록 비용이 오히려 늘어난다(프롬프트 캐싱이 일부
완화하지만 완전히 없애지는 못한다). 여러 종목을 대량으로 조사하는 작업(예: 21개 종목
공부 글 동시 작성)은 이 프로젝트에서 가장 토큰을 많이 쓰는 작업 유형이었다는 걸 기억해
둘 것 — 정말 필요한 경우에만 대량 병렬 작업을 시킨다.
