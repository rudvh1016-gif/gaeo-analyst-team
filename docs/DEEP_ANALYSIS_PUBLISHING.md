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

## 변경 수용 기준

정밀분석 저장 또는 표시 로직을 바꿀 때는 다음을 모두 확인한다.

1. 유효성 검사가 완성된 정밀분석만 통과시키는가.
2. 과거 Snapshot URL과 본문이 그대로 남는가.
3. 홈 최신 5건, Archive, 종목 상세 링크가 같은 Snapshot을 가리키는가.
4. URL 페이지네이션·canonical·sitemap·lastmod가 서로 일치하는가.
5. 데스크톱과 모바일 초기 HTML에서 제목과 본문을 읽을 수 있는가.
6. 정밀분석 발행 테스트 네 종류가 모두 통과하는가.
