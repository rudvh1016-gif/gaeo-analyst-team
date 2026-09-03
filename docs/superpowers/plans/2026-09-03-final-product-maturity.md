# Final Product Maturity Program 구현 계획

> 기준: `origin/main`의 `b00992485ac453a0af14120df8fb15e0c60754c0`

**목표:** 보호된 Growth/Safety 계약과 모든 실제 데이터를 유지하면서 디자인, 접근성, 성능, 신뢰, 성장, 거버넌스를 다섯 개의 독립 PR로 완성한다.

**구조:** 정적 사이트와 현재 생성 파이프라인을 유지한다. 각 PR은 최신 main에서 시작하고 테스트 우선, 세 독립 검토, 전체 검증, CI, 병합, 프로덕션 확인을 하나의 닫힌 단계로 수행한다.

---

### PR 1: Editorial foundation과 homepage

- [x] 최신 main SHA, clean tree, 기존 CI, 산출물 수와 크기를 기록한다.
- [x] 로컬과 실제 프로덕션을 여섯 viewport에서 렌더하고 before evidence를 보관한다.
- [x] 제품·디자인·성장, 엔지니어링·접근성·보안, SEO·주장·데이터 세 관점의 독립 사전 검토를 수행한다.
- [x] 편집형 토큰·홈 구조·카피 계약을 먼저 실패시키는 테스트를 추가한다.
- [x] rollback 가능한 별도 foundation CSS와 최소 HTML 변경으로 홈을 평탄화한다.
- [x] 핵심 검색, 메뉴, 모달, 관심종목, 동의, ID와 분석 이벤트 계약을 보존한다.
- [x] 같은 여섯 viewport의 after evidence와 비교 문서를 `docs/reviews/editorial_foundation/`에 남긴다.
- [x] 세 독립 최종 검토, 전체 Python/Node/브라우저 계약, diff·secret·generated 검사를 통과한다.
- [x] `codex/editorial-foundation`을 push하고 PR, CI, 병합, 프로덕션을 확인한다.

### PR 2: Editorial expansion과 accessibility

- [x] 실제 최신 main에서 `codex/editorial-accessibility`를 만든다.
- [x] AGENTS.md와 CLAUDE.md를 다시 읽고 전 화면 사전 검토 A/B/C를 수행한다.
- [x] Research, 종목분석, 비교, 스크리너, 순환매, 등락률, 내 종목, 포트폴리오, 모의투자, 학습, 뉴스, 계산기, 성적표, 커뮤니티, 개발 기록에 편집 문법을 확장한다.
- [x] skip link, landmarks, heading order, label/name/description, keyboard, focus, dialog/drawer, reduced motion, zoom/reflow, contrast를 WCAG 2.2 AA에 맞춘다.
- [x] axe 또는 동등한 자동 감사와 Playwright keyboard/zoom/reflow 테스트를 추가한다.
- [x] 전체 검증, 최종 A/B/C, PR, CI, 병합, 프로덕션 확인을 완료한다.

### PR 3: Performance와 maintainability

- [x] 실제 최신 main에서 `codex/performance-maintainability`를 만든다.
- [x] cold/warm load, DOM, request, JS/CSS/image payload, LCP/CLS/long task, service worker 기준선을 측정한다.
- [x] offscreen rendering, static assets, cache policy, script loading을 측정 결과 우선순위대로 개선한다.
- [x] 대형 index에서 안정된 영역만 작은 모듈로 분리하고 전역 동작·생성 파이프라인을 유지한다.
- [x] 명시적 성능 budget과 회귀 테스트를 추가한다.
- [x] 전체 검증, 최종 A/B/C, PR, CI, 병합, 프로덕션 확인을 완료한다. (PR #486 `contract-tests` success → merge `a54dc9b404f9` 2026-09-03 08:04 KST → 프로덕션 `https://gaeoteam.com/app-shell.css?v=20260903-p3` 200, 305,327B 및 홈 문서가 `app.js?v=20260903-p3`를 참조함을 2026-09-03 09:40 KST 확인)

### PR 4: Trust, residual SEO, growth와 retention

- [ ] 실제 최신 main에서 `codex/trust-seo-growth`를 만든다.
- [ ] 판단 기록, 성과 산식, 표본, baseline, 비용·slippage, survivorship/look-ahead/selection bias를 감사한다.
- [ ] methodology와 공개 claim을 증거 범위에 맞추고 법적 경계를 재검증한다.
- [ ] `gaeo_seo_publishing_rules.md`의 robots 문서 충돌을 실제 정책과 맞춘다.
- [ ] GSC/Naver 실측이 필요한 항목과 저장소에서 즉시 고칠 잔여 SEO를 분리한다.
- [ ] 공유/OG, 콘텐츠→제품 CTA, 무상 배포 playbook, 재방문 loop와 분석 운영 manual을 개선한다.
- [ ] 전체 검증, 최종 A/B/C, PR, CI, 병합, 프로덕션 확인을 완료한다.

### PR 5: Repository governance readiness

- [ ] 실제 최신 main에서 `codex/governance-readiness`를 만든다.
- [ ] 모든 workflow와 main writer, concurrency, permission, failure mode를 inventory한다.
- [ ] 즉시 가능한 code-level guard, validation, artifact discipline을 추가한다.
- [ ] compact-history와 data-live 분리 준비도를 증거 기반으로 결론낸다.
- [ ] ruleset은 자동 변경하지 않고 정확한 수동 적용안과 검증법을 작성한다.
- [ ] 원격 브랜치를 active/merged/stale/unknown으로 분류하되 삭제하지 않는다.
- [ ] 문서를 통합하고 전체 검증, 최종 A/B/C, PR, CI, 병합, 프로덕션 확인을 완료한다.

### 프로그램 종료

- [ ] 최종 main SHA와 다섯 PR 순서를 기록한다.
- [ ] 요구된 45개 최종 보고 항목을 실제 evidence와 exact test 결과로 작성한다.
- [ ] MANUAL과 BLOCKED를 구현 완료 항목과 분리한다.
- [ ] 생성 데이터·분석 모델·과거 기록·Growth P0·Safety P0가 변경되지 않았음을 명시한다.
