# GAEO 정밀분석 발행 규칙

## 정의와 경계

정밀분석은 `analysis.js`와 `analysis_archive.js`에 저장되는 종목 상세 화면의 완성된 분석 원문이다.

**정밀분석 ≠ 종목공부**다. 종목공부, 일반 AI 분석, TARO 단독 분석, 자동분석, 뉴스분석은 이 발행 시스템에 섞지 않는다. 자동분석(`tier: "auto"`)과 테스트·fixture·mock·미완성·손상된 기록도 공개하지 않는다.

## 필수 발행 흐름

완성된 정밀분석은 예외 없이 다음 흐름을 따른다.

`SAVE → PUBLISH → LINK → ARCHIVE → SURFACE ON HOME → ADD TO SITEMAP`

1. `archive_analysis.py`가 완성본을 `analysis_archive.js`에 저장한다.
2. `generate_deep_analysis.js`가 고유 영구 URL의 정적 Snapshot과 페이지형 Archive를 만든다.
3. 종목 상세의 정밀분석 기록에서 해당 Snapshot을 실제 링크로 연결한다.
4. 홈에는 최신 5건을 조용한 편집형 목록으로 노출한다.
5. `generate_sitemap.js`가 manifest의 Snapshot·Archive URL과 정확한 `lastmod`를 sitemap에 추가한다.

표준 실행 순서:

```bash
python3 archive_analysis.py
node generate_deep_analysis.js
node generate_snapshots.js
node generate_sitemap.js
node generate_rss.js
```

## Source of Truth와 영구성

- Source of Truth는 기존 `analysis_archive.js`다. 새 분석 엔진이나 별도 DB를 만들지 않는다.
- Snapshot ID는 종목코드와 분석 생성 시각으로 고정한다. 같은 실행의 재시도는 중복 발행하지 않으며, 같은 날 다른 시각의 분석은 서로 다른 기록이다.
- 발행된 Snapshot은 수정·삭제·덮어쓰기하지 않는다. 종목명·업종·생성 시각은 발행 당시 값으로 함께 저장한다.
- 가벼운 채점용 `history.js`의 보관 상한과 정밀분석 원문 보관 정책은 별개다. 정밀분석 원문에는 건수 상한을 두지 않는다.
- 생성 실패 시 기존 공개 파일을 삭제하지 않는다. 생성기는 결과 전체를 메모리에서 검증한 뒤 파일을 기록하고, 워크플로는 실패를 성공으로 가장하지 않는다.

## 공개 산출물

- 최신 목록: `deep_analysis_latest.js` (최신 5건)
- 발행 manifest: `deep_analysis_manifest.json`
- Archive: `/research/deep-analysis/`, 이후 `/research/deep-analysis/page/N/`
- Snapshot: `/research/deep-analysis/<ticker>/<timestamp>/`
- 각 Snapshot은 고유 title·description·self canonical·정확한 날짜·종목명·종목코드·초기 HTML 본문·진실한 구조화 데이터를 가진다.
- Archive는 페이지당 20건이며 이전/다음 이동은 실제 URL을 사용한다.

## Summary Generation

홈 "최근 정밀분석"은 종목명·날짜만 있는 단순 목록이 아니라, 각 기록의 핵심 판단을 한 줄로 압축한 Compact Research Index다. 이 한 줄(`summary`)은 다음을 지킨다.

- **저장 시점**: 정밀분석이 완성되는 시점(analysis.js 작성)에 함께 쓰고 저장한다. 홈 페이지 로드 때마다 LLM으로 새로 생성하지 않는다 — 저장된 값을 읽기만 한다.
- **Source of Truth**: `analysis.js`의 종목별 `summary` 필드 → `archive_analysis.py`가 `analysis_archive.js` 스냅샷에 그대로 실어 나름 → `generate_deep_analysis.js`(`deep_analysis_publish.js`의 `normalizePublishedRecords`/`buildLatestRecords`)가 `deep_analysis_latest.js`에 포함 → 홈의 `renderHomeDeepAnalysis()`가 표시.
- **내용**: 실제 findings·reason·report에 존재하는 근거만 쓴다. 재무·수급·기술·밸류에이션·모멘텀·리스크·확률통계 축 중 설명력이 가장 큰 Primary factor 1개(+필요하면 Counter factor 1개)만 압축한다. 모든 축을 나열하지 않는다.
- **분량과 어조**: 한국어 약 18~34자, 마침표 없이. "유지/개선/약화/확인/부담/회복/안정/강화/둔화/아쉬움/남아 있음" 같은 담백한 어휘를 쓰고, "매우/상당히/압도적/강력한" 같은 과장, 그리고 BUY/HOLD/SELL 단어나 "지금 사도 됨/매수 기회/진입 적기" 같은 투자권유 표현은 쓰지 않는다. 점수(`chief.total`)를 기계적으로 번역("SELL이니까 매우 약함")하지 않는다 — Evidence의 압축이지 Score의 번역이 아니다.
- **문장 패턴 다양화**: 모든 문장이 "~지만 ~"으로 끝나면 AI 생성 티가 난다. 실제 데이터가 뒷받침하는 범위에서 어미·구조를 다양화한다.
- **누락 시 처리**: `summary`가 없는 과거 기록은 undefined나 빈 줄을 보여주지 않고, 그 줄 자체를 생략해 종목명·날짜만 표시한다. 없는 내용을 억지로 채워 넣지 않는다.
- **영구성**: 이미 발행된 Snapshot의 `summary`도 다른 필드와 마찬가지로 발행 당시 값 그대로 보존한다. 같은 종목을 나중에 다시 정밀분석해도 과거 Snapshot의 `summary`를 최신 내용으로 덮어쓰지 않는다.
- **완료 조건에 포함**: "OOO 정밀분석해줘" 요청의 완료 정의에는 이제 기존 SAVE·PUBLISH·LINK·ARCHIVE·SURFACE ON HOME·ADD TO SITEMAP뿐 아니라 **저장된 한 줄 summary 존재**도 포함된다. summary 없이 "정밀분석 완료"로 보고하지 않는다.

## 변경 수용 기준

정밀분석 저장 또는 표시 로직을 바꿀 때는 다음을 모두 확인한다.

1. 유효성 검사가 완성된 정밀분석만 통과시키는가.
2. 과거 Snapshot URL과 본문이 그대로 남는가.
3. 홈 최신 5건, Archive, 종목 상세 링크가 같은 Snapshot을 가리키는가.
4. URL 페이지네이션·canonical·sitemap·lastmod가 서로 일치하는가.
5. 데스크톱과 모바일 초기 HTML에서 제목과 본문을 읽을 수 있는가.
6. 정밀분석 발행 테스트 네 종류가 모두 통과하는가.
