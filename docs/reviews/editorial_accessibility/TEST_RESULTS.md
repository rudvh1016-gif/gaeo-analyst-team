# PR 2 local test results

실행일: 2026-09-03
브랜치: `codex/editorial-accessibility`
서버: 저장소의 `test_static_server.js`, `http://127.0.0.1:23003`

## 완료된 결과

- 새 editorial/accessibility static contract: PASS
- 새 editorial/accessibility browser contract: PASS
- Node non-browser contracts: 33/33 PASS
- 883개 생성물 결정론: PASS, 두 번 동일 digest
- 6개 viewport × 11개 대표 화면 reflow: 66/66, horizontal overflow 0
- `git diff --check`: PASS
- Python contracts on local Windows: 52/57 PASS; 기존 환경 차이 5건은 아래에 분리
- 전체 Playwright/browser inventory: 16/16 PASS
- 독립 최종 검토 A/B/C: PASS / PASS / PASS, Critical 0, Important 0, Minor 0
- 보호 데이터 52개: 변경 0, digest `918bd0a492a575e11cad0eef74bafc0857545d08b015afda175c113206a8f2fe`
- 생성물 883개 독립 manifest digest: `ee3525799e998acaa53b6859b2af3e4df2de85a7cf719f19bd1d6a9342005f1a`
- Growth/Safety/SEO gates: 9/9 PASS

## 새 브라우저 계약 범위

`test_editorial_accessibility_browser.js`는 다음을 실제 렌더로 확인한다.

1. 320, 390, 1280px의 홈, 종목, 계산기, 학습, 순환매, 전체시장, 커뮤니티, About, Research Hub, 기사
2. 하나의 main과 level-1 heading, control 이름, 정보 이미지 이름
3. 44px 제품 target, 작은 독립 link target, text-spacing, horizontal overflow
4. 320px 홈 H1 clipping 방지와 단일 문맥 제목
5. 분석 tablist keyboard/roving tabindex와 장식용 emoji 제거
6. nav 검색 error 상태와 combobox active option
7. trust modal, consent dialog, 모바일 BUY sheet의 Escape, inert, focus containment/return
8. reduced-motion, dark contrast, insight rail contrast와 닫기 target
9. SPA 화면 전환·뉴스 재렌더·순환매 재렌더 뒤 focus
10. 순환매/전체시장 flat surface와 내부 중복 제목 제거
11. deep-analysis dark contrast
12. 계산기 deep-link disclosure state, label, live result, field-specific error와 정상화
13. 실제 레이더 데이터가 있는 000270 경로의 장식용 emoji 제거
14. 뉴스·종목공부·주식공부·부동산공부·계산기의 category, back, page 2 재렌더 focus
15. 최근 본 종목 개별 삭제 control의 44×44 target

## TDD와 결함 수정 기록

- 초기 static 계약은 stylesheet, landmark, H1, generator template, skip link, emoji와 target 규칙에서 실패했다.
- 초기 3중 검토는 CSS specificity, 중복 제목, 12px 미만 텍스트, dark 대비, emoji를 발견했다.
- 동적 검토는 320px H1 clipping, disclosure 상태 불일치, SPA focus 유실, 계산 오류 귀속, 검색 오류 설명, consent Escape, 불완전한 inert, 이름 없는 SVG, insight 대비와 작은 닫기 target을 발견했다.
- 최종 독립 검토는 종목 결과의 문맥 H1, 카테고리·페이지 재렌더 focus, 최근 기록 삭제 target, 비어 있지 않은 레이더의 장식용 emoji를 추가로 발견했고 회귀 계약으로 고정했다.
- 수정 뒤 새 계약과 16개 browser inventory는 전체 통과했다. 개인정보 dialog의 focus 예약 전 Escape 경합과 tab 렌더 대기 경합도 반복 실행 중 재현해 안정화했다.

## 환경 한계

- 로컬 Windows의 기존 Python baseline 5건은 `test_gaeo_coverage.py`, `test_gaeo_evolution.py`, `test_paper_accounting_v2.py`의 LF/constitution/append-only 바이트 계약과 `test_shared_token_hardening.py`, `test_shared_toss_token.py`의 Windows DPAPI sandbox 차이다. 이번 PR이 해당 데이터·constitution·token 코드를 바꾸지 않았음을 독립 digest로 확인했고, 실제 Ubuntu PR CI를 병합 gate로 사용한다.
- `test_playwright.js`는 공용 loader이고 실행형 테스트가 아니다.
- `test_static_server.js`는 장기 실행 검증 서버라 terminating test 수에 포함하지 않는다.
