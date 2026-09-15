# 가격 출처 원장 — 실제 수집에서 봉인 원장까지 (2026-09-15)

소유자 확정 설계: **별도 출처 파일 방식**
(`data.js` 공개 구조는 그대로, 종목별 가격 출처·관측시각은 별도 파일에 기록)

> ## 한 줄 결론
>
> 이제 시세 수집기가 **가격 응답을 받은 그 순간**을 종목마다 적어 두고, 그 기록이
> 같은 회차의 판단에만 붙는다. **하지만 이것은 「공식 가격증명」이 아니다.**
> 채점(`comparable`)까지 가려면 아직 KRX 가격증명 문서가 따로 필요하다.

---

## 1. 무엇을 만들었나

| 파일 | 역할 |
|---|---|
| `price_provenance.py` (신규) | 출처 기록의 스키마·회차 식별자·연결/거부 규칙 |
| `price_provenance.json` (신규 산출물) | **한 회차의 종목별 가격 출처.** `data.js` 와 같은 주기로 함께 쓰인다 |
| `update_prices.py` | 이미 받은 가격 응답으로 출처를 만든다. **추가 시세 API 호출 0회** |
| `compute_indicators.py` | 지금 읽은 `data.js` 와 출처가 **같은 입력인지**(snapshotId) 확인해 머리말만 넘긴다 |
| `analyze_auto.py` | 판단 산출물에 `priceSnapshotId` 한 칸만 추가(브라우저 트래픽 보호) |
| `decision_records.py` | 봉인 원장 기록에 `priceObservedAt` + `priceProvenance` 를 채운다 |
| `test_price_provenance.py` (신규) | §11 의 18개 최소 시험 + 어휘 위장 방지 |

## 2. 네 가지 시각을 섞지 않는다

| 뜻 | 필드 | 지금 값 |
|---|---|---|
| 우리가 **가격 응답을 받은** 시각 | `receivedAt` (→ 원장 `priceObservedAt`) | **있다.** UTC·초 정밀도·오프셋 표기 |
| 공급자가 밝힌 **기준시각** | `sourceAsOf` + `sourceAsOfState` | **확인 불가** — 네이버 itemSummary 응답에 없다 |
| 공급자가 밝힌 **거래일** | `sourceSessionDate` + `sourceSessionDateState` | **확인 불가** — 같은 이유 |
| 판단 생성시각 / 원장 저장시각 | `decisionAt` / `capturedAt` | 기존 그대로 |

* `receivedAt` 은 **거래소 체결시각도, 공급자 발표시각도, 그 거래일 가격의 확정시각도 아니다.**
* `data.js` 의 전역 `date` 라벨은 **우리가 붙인 이름표**다. 종목별 관측시각으로 복사하지 않는다
  (`collectorLabel` + `collectorLabelNote` 로 그렇게 명시해 둔다).
* 응답이 실제로 어떤 키를 주는지는 회차 머리말 `responseKeysSeen` 에 남는다. 그래서 "기준시각이
  없다"는 주장이 검증 가능하다.

### 이미 있던 시각 필드와 헷갈리지 말 것 (새로 중복해 만들지 않았다)

| 필드 | 누가 언제 | 뜻 |
|---|---|---|
| `priceFetchedAt` (기존, `analyze_auto.py` 실행 출처) | 분석 러너 | **러너가 `data.js` 를 원격에서 받아온** 시각 |
| `receivedAt` (신규) | 시세 수집기 | **네이버가 가격 응답을 준** 시각 |
| `analysisDataFetchedAt` (기존) | `collect_analyst_data.py` | 일봉·수급 원본을 수집 **시작한** 시각 |

셋은 서로 다른 사실이다. `priceFetchedAt` 은 "파일을 언제 가져왔나"이고
`receivedAt` 은 "가격이 언제 왔나"다. 어느 쪽도 다른 쪽을 대신할 수 없다.

### 러너 배선 — 시세와 출처는 반드시 함께 받아온다

`update-analysis.yml` 은 매 사이클 `data.js` 를 원격 최신본으로 덮는다. **출처 파일을
같이 덮지 않으면** 회차가 어긋나 모든 판단이 `provenance_round_superseded` 로 떨어진다
(= 기능이 조용히 죽는다). 그래서 두 워크플로의 재동기화를 공용 함수
`sync_inputs()`(`.github/scripts/gaeo-chain.sh`)로 합치고 두 파일을 함께 받게 했다.
파일마다 따로 `checkout` 한다 — 한 번에 여러 경로를 주면 아직 원격에 없는 파일 하나가
명령 전체를 실패시킨다.

**그리고 읽은 뒤에는 돌려줘야 한다.** 분석 잡은 `git checkout HEAD -- data.js analysis.js`
로 "남의 파이프라인 산출물"을 원래대로 되돌린 뒤 스테이징한다. 출처 파일을 그 목록에
넣지 않으면, `sync_inputs` 가 받아온 새 파일이 **매 사이클 '더러운 파일'로 남아
`verify_save_closure.py` 가 커밋 전체를 생략시킨다** — 이 스크립트가 막으려고 만들어진
PR #564 계열 사고를, 이 스크립트가 일으키는 모양이 된다. 그래서 되돌림 목록과
`RESTORED_BEFORE_STAGING` 양쪽에 함께 넣었다.

부수 효과로 `update-analysis.yml` 큰 `run:` 블록의 여유가 **204B → 667B** 로 늘었다
(20,296B → 19,833B, 안전선 20,500B).
`test_price_provenance.WorkflowWiring` 이 이 배선을 계약으로 고정한다 — 동기화·커밋·되돌림
세 곳 모두.

## 3. 가격 조회 성공과 상세지표 성공을 구분한다

수집기는 종목마다 **① 가격(`itemSummary`) → ② 상세 재무지표(`integration`)** 순으로 요청한다.
`receivedAt` 은 **①의 응답 직후**에 찍는다. ②가 늦게 끝나도 그 시각으로 옮기지 않는다
(`detailMetricsOk` 로 ②의 성패만 따로 남는다).

## 4. 실패·재사용을 뭉뚱그리지 않는다

| 상황 | 상태 | 관측시각 |
|---|---|---|
| 가격 응답을 새로 받음 | `FRESH` | 이번 응답 시각 |
| 가격 성공 · 상세지표만 실패 | `FRESH` + `detailMetricsOk: false` | 이번 **가격** 응답 시각 |
| 가격 실패 → 이전 값 유지, 이전 출처 있음 | `REUSED_PREVIOUS` + `detailMetricsOk: null` | **원래 관측시각 그대로** + `reusedFromRoundId` |
| 가격 실패 → 이전 값 유지, 이전 출처 없음 | `REUSED_PREVIOUS_UNVERIFIED` | `null` (확인 불가) |

`detailMetricsOk` 의 `false`(요청했는데 실패)와 `null`(이번 회차엔 아예 요청하지 않음)은
다른 사실이다. 재사용 회차는 `null` 이다 — '실패'로 세지 않는다.
| 신규 수집 0건 | — | `data.js` 도 출처도 **건드리지 않는다** |
| 공급자가 기준시각 미제공 | `sourceAsOfState: NOT_PROVIDED_BY_SOURCE` | 수신시각으로 대체하지 않는다 |

## 5. 회차가 섞이지 않게 하는 방법

* `snapshotId` = `data.js` 에 실제로 쓰인 `stocks` 딕셔너리의 내용 해시.
  출처 기록이 그 값을 품고, 분석 산출물이 그 값을 `priceSnapshotId` 로 들고 다닌다.
* `roundId` = **출처 기록 자신의 내용 해시**(`roundId` 를 뺀 나머지 전부). 읽을 때마다 다시
  계산해 맞춰 본다. 저장된 뒤 한 글자라도 고쳐졌으면 **읽지 않는다**(고쳐서 쓰지 않는다).
* 원장에 붙일 때 **네 가지가 전부 맞아야** 연결된다 — 회차(`snapshotId`) · 종목 · 실제 사용 가격(`base`) ·
  관측시각이 판단시각보다 앞일 것. 하나라도 어긋나면 사유와 함께 **연결을 거부**한다.

| 거부 사유 | 뜻 |
|---|---|
| `analysis_snapshot_id_missing` | 판단이 어느 회차를 읽었는지 안 남겼다 |
| `provenance_file_missing` | 출처 파일이 없거나, 깨졌거나, 저장 뒤 내용이 고쳐졌다(`roundId` 불일치) |
| `provenance_round_superseded` | 그 사이 다른 회차가 덮어썼다 (같은 가격 숫자여도 붙이지 않는다) |
| `ticker_not_in_provenance` / `price_value_mismatch` | 종목·가격이 어긋난다 |
| `price_observed_after_decision` | 판단보다 나중에 받은 가격이다 |
| `previous_price_provenance_missing` / `previous_price_value_mismatch` | 재사용한 이전 값의 출처를 확인할 수 없다 |

## 6. 보존 방식 — 새 저장 시스템을 만들지 않았다

* `price_provenance.json` 은 **`data.js` 와 같은 방식**으로 회차마다 덮어쓴다. 회차별 보존은
  ① 파일 안의 내용 식별자(`roundId`·`snapshotId`)와 ② git 커밋 기록이 담당한다.
* **영구 보존은 기존 봉인 원장**(`research_archive/decisions/originals/`, 회차별 불변 파일 + gzip)이
  맡는다. 판단 기록마다 `priceProvenance` 가 함께 봉인된다. 별도의 새 아카이브는 만들지 않았다.

### 실측 용량 (600종목 기준, 2026-09-15)

| 항목 | 값 |
|---|---|
| `price_provenance.json` 1회차 | 원본 196,690B (192KB) · gzip 13,761B (13KB) · 압축 14.3배 |
| 봉인 원장 1회차 (판단 600건) | 출처 전 gzip 21,753B → 출처 후 gzip 36,271B |
| 회차당 순증 | **gzip 14,518B (14.2KB)** (원본 기준 504,000B) |
| 하루(장중 30분 주기 ≈ 14회차) | 약 **198KB**(gzip) |
| 20거래일 | 약 **3.9MB** |
| 참고 — 현재 `originals/` 전체 | 719KB · 저장소 `.git` 2.8GB |

## 7. 과거 기록은 손대지 않았다

* 이미 봉인된 7,200행의 `priceObservedAt: null` 을 **소급해서 채우지 않았다.**
* hash·recordId 재생성 없음, 새 출처 파일로 과거 보강 없음, 재조회 값을 당시 값처럼 기록 없음.
* `test_price_provenance.Ledger.test_15_*` 가 과거 원본 파일의 **바이트 해시 불변**을 검사한다.
* ⚠️ **"9월 18일부터 기존 1,800건을 채점할 수 있다"는 보장은 없다.** 과거 기록에는 관측시각이
  영원히 없다.

## 8. A / B / C 를 분리해서 본다

| 구분 | 상태 | 근거 |
|---|---|---|
| **A. 가격 관측 사실 보존** | 구현·시험 완료 (`IMPLEMENTED_AND_TESTED`) | 41개 시험 통과 + 가드 9개 고의 파괴 확인 |
| **B. 신규 판단 원장 연결** | 구현·시험 완료 (합성 자료) | `Ledger` 시험군 — 압축·되읽기 뒤에도 보존 |
| **C. 현행 가격 비교 조건 충족** | **미충족** | 아래 표 |

### C 가 남겨 둔 조건 (`comparison_evidence._price_proof`)

| # | 요구 | 이번 변경 뒤 |
|---|---|---|
| 5 | `record.priceObservedAt` 존재 · `decisionAt` 이전 · KST 날짜 == 판단일 | **신규 판단부터 충족 예정** (자연 실행 확인 필요) |
| 1 | `recordId` 일치 + `originalRecordHash == hash(record)` | 미충족 — 증명 문서가 없다 |
| 2 | `ticker`·`period` 바인딩 | 미충족 |
| 3 | `observedAt` 이 평가 종료일 이후 | 미충족 |
| 4 | **`source == 'KRX'`** + 원문 바인딩(`_reference`) | 미충족 — **우리 출처는 네이버다** |
| 6~7 | `basisEvidence`·`originalPriceEvidence` JSON Pointer 바인딩 | 미충족 |
| 8 | 판단일~평가일 **모든 거래일** 종가(`final: true`, 거래정지 아님) | 미충족 |
| 9 | 수정주가면 `adjustment.multiplier` + `receiptIds` | 미충족 |

* 증명 문서를 받아들이는 입구는 이미 있다 — `python3 decision_records.py --price-proof <파일>`.
  **그 문서를 만들어 주는 코드는 저장소에 없고, `research_archive/decisions/price_proofs/` 는 아직 없다.**
* ⚠️ 네이버 응답에 KRX 주소나 `source="KRX"` 를 붙여 공식 근거로 위장하지 않는다.
  로컬 수신시각을 공급자 원문에 원래 있던 필드처럼 끼워 넣지 않는다.
  **hash 는 자료의 동일성을 확인하는 수단이지 공식 출처임을 인증하는 장치가 아니다.**
* ⚠️ "내부 기록 누락을 발견했으므로 외부 자료 문제는 없다"고 단정하지 않는다. 내부 누락은
  **필요조건 하나**였을 뿐이고, 위 8줄은 그것과 별개로 남아 있다.

## 9. 아직 확인하지 못한 것

* **실제 자동 실행 확인: `WAITING_NATURAL_RUN`.** 이 작업은 장 마감 뒤(KST 23:3x)에 했다.
  수집기(`update-prices.yml`)·분석기(`update-analysis.yml`)는 평일 09:00~16:00 KST 에만 돈다.
* 시험은 **저장된 응답 모양**으로 했다. 이 세션에서는 네이버가 403으로 막혀 실제 응답을
  받아보지 못했다 — 그래서 `sourceAsOf` 가 정말 없는지는 **응답이 실제로 도착해야** 확정된다.
  코드는 값이 오면 그대로 적도록 돼 있고(`SOURCE_AS_OF_KEYS`), 안 오면 확인 불가로 남긴다.
* 다음 자연 실행에서 확인할 것: ① `price_provenance.json` 이 main 에 저장되는가
  ② `responseKeysSeen` 에 기준시각 후보 키가 있는가 ③ 새 봉인 기록의 `priceProvenance.linked`
  성공 건수 ④ 회차 불일치(`provenance_round_superseded`) 발생 빈도.

## 10. 확인 명령

```bash
python3 -m unittest test_price_provenance -q          # 41건
python3 gaeo_check.py investment-contract             # 원장·비교 계약
python3 -c "import json,price_provenance as p; d=p.load_round('.'); print(json.dumps(p.counts(d),ensure_ascii=False))"
```
