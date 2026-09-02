# Editorial expansion and accessibility review

기준 SHA: `914457f37023dd8b122865d6c4927717aa49487d`
검토일: 2026-09-03
렌더 조건: 외부 요청 차단, 익명 분석 동의 거부, 저장소 정적 서버, 동일 공개 데이터

## 대표 before / after

| 화면 | before | after |
|---|---|---|
| 홈 전체 desktop | [열기](before/home-desktop.png) | [열기](after/home-desktop.png) |
| 종목분석 desktop | [열기](before/stock-desktop.png) | [열기](after/stock-desktop.png) |
| 순환매 desktop | [열기](before/rotation-desktop.png) | [열기](after/rotation-desktop.png) |
| 전체시장 desktop | [열기](before/fullmarket-desktop.png) | [열기](after/fullmarket-desktop.png) |
| Research Hub desktop | [열기](before/hub-desktop.png) | [열기](after/hub-desktop.png) |
| About desktop | [열기](before/about-desktop.png) | [열기](after/about-desktop.png) |
| 뉴스 snapshot desktop | [열기](before/news-desktop.png) | [열기](after/news-desktop.png) |
| 홈 첫 화면 390px | [열기](before/home-above-fold-mobile.png) | [열기](after/home-above-fold-mobile.png) |
| 모바일 메뉴 390px | [열기](before/mobile-navigation-mobile.png) | [열기](after/mobile-navigation-mobile.png) |
| BUY bottom sheet 390px | [열기](before/modal-bottom-sheet-mobile.png) | [열기](after/modal-bottom-sheet-mobile.png) |

추가 최종 상태: [dark home 390px](after/dark-home-mobile.png), [dark About desktop](after/dark-about-desktop.png), [분석가 근거 390px](after/analyst-evidence-mobile.png), [CHIEF 판단 390px](after/chief-judgment-mobile.png).

최종 코드로 1440, 1280, 768, 430, 390, 360px의 11개 대표 화면과 상태 화면을 자동 렌더했다. 라이트/다크를 포함해 after screenshot 110장과 측정 record 74개를 생성하고, 그중 검토에 필요한 before 10장과 after 14장을 이 디렉터리에 보존했다.

## 시각 판정

- About, Research Hub, 생성 기사, 종목분석, 순환매와 전체시장이 같은 편집형 제목·본문·구분선 문법으로 읽힌다.
- 반복되던 둥근 surface는 비교·입력·overlay처럼 경계가 필요한 곳을 제외하고 평탄화했다.
- 66개 표준 route/viewport 측정에서 rounded 후보는 1,483→1,122, shadow 후보는 194→134로 줄었다.
- 테이블·입력·선택 탭·경고·광고·모달·bottom sheet에는 기능을 설명하는 경계를 유지했다. 이 때문에 얇은 border 수는 의도적으로 1,346→1,526으로 늘었다.
- 데이터 원문의 장식용 emoji는 데이터를 바꾸지 않고 표시 단계에서 제거했다. 경고 `⚠️`, 동작 방향 `▶`, 저작권 `©`처럼 의미가 있는 표식은 유지했다.
- 66개 표준 route/viewport 모두 horizontal overflow가 0이었다.

## 접근성 판정

- 모든 대표 공개 문맥은 보이는 `main` 하나와 level-1 heading 하나를 갖는다. 홈은 실제 `h1`, SPA 도구 화면은 `role="heading" aria-level="1"`인 문맥 제목을 사용한다.
- skip link, landmark, native button, label/input 연결, combobox/listbox 상태, tablist roving tabindex, table caption/scope를 확인했다.
- 검색 오류는 보이는 live alert와 `aria-describedby`로 입력에 연결된다. 계산 오류는 실제 잘못된 입력에만 연결되고 정상 재계산 때 해제된다.
- modal, consent dialog와 모바일 BUY sheet는 배경을 `inert` 처리하며, 동적으로 생긴 배경 control도 포함한다. `Escape`, Tab containment, trigger focus return을 확인했다.
- SPA 화면 전환과 뉴스·학습·계산기의 카테고리, 복귀, 페이지 재렌더 뒤 새 문맥 heading으로 focus가 이동한다. 순환매/전체시장 선택 control은 재렌더 뒤 같은 종류의 control에 focus를 유지한다.
- 핵심 control, 닫기 버튼, 최근 본 종목 개별 삭제는 44×44 CSS px 이상이며, 320px reflow와 사용자 text-spacing override에서도 수평 overflow가 없다.
- `prefers-reduced-motion`에서는 programmatic smooth scroll을 끈다.
- 측정된 대표 대비: insight rail 보조 텍스트 5.611:1, deep-analysis dark 보조 텍스트 8.927:1, About 보조 텍스트 5.896:1.

## 자동 도구 범위와 한계

새 runtime/CDN 의존성은 추가하지 않았다. 저장소의 고정 Playwright loader와 정적 계약을 사용해 axe와 동등한 범위의 이름, landmark, heading, target, reflow, focus, keyboard, dialog, contrast 검사를 수행했다.

자동 검사는 모든 보조기술 조합을 대체하지 않는다. 실제 NVDA/JAWS/VoiceOver 발음 품질, 브라우저 고대비 모드, 사용자의 색각·인지 요구는 별도 사람 검수가 필요하다. 이번 검수에서는 Playwright의 실제 keyboard 입력과 DOM focus를 사용했고, 대표 24장을 육안으로 확인했다.

## 생성물과 보호 계약

- generator 순서: deep analysis → snapshots → sitemap → RSS → llms.
- 동일 순서를 두 번 실행한 883-file 집계 SHA-256: `3da212a32295fce5d44a43f540fe33f5f110555e8204e844cb98e4fad0dd932b` 두 번 동일.
- 공개 수량: human 213, stock 600, deep-analysis 34, 종목 hub 26, archive 2, sitemap canonical 281, RSS 50, llms 155.
- 분석 입력, 점수, 판단, 가격, history와 append-only 기록은 변경하지 않았다. generator와 표시 템플릿만 바꿨다.
- canonical, robots/noindex, JSON-LD, OG, sitemap discovery, rules-based/AI-assisted 경계와 Growth/Safety P0 계약을 유지했다.
