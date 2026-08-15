# GAEO Research v2.0 계획 — OpenDART + 장기 저장 인프라

작성 2026-08-15

> **오늘 시작하는 것**: DART 공시·재무 수집, 장기 Research 저장 인프라.
> **오늘 시작하지 않는 것**: DART를 판단에 쓰는 일.
>
> `research_v1.0` / `research_v1.1`은 동결이다. DART 코드가 완성돼도 두 버전은
> 수정하지 않는다. DART가 실제 Feature가 되는 최초 버전은 `research_v2.0`이다.
> **데이터 수집 시작일과 모델 사용 시작일이 다른 것은 정상이다.**

두 트랙이 병렬로 돈다.

| Track | 내용 | 상태 |
| --- | --- | --- |
| A | v1.0 / v1.1의 Live Shadow OOS 기록 수집 | 진행 중(동결 상태로 축적) |
| B | OpenDART 수집 + 장기 저장 인프라 | 이 문서 |

---

## 1. OpenDART Architecture

**절대 만들지 않는 구조**

```
for stock in 500 stocks:          # ✕ 10분마다 500번 호출
    call DART(stock)
```

**실제 구조**

```
최근 신규공시 목록 조회 (list.json, 페이지 단위)
        ↓
GAEO Universe corp_code와 매칭
        ↓
우리 종목에 해당하는 신규공시만 선택
        ↓
필요한 경우에만 상세 API 호출
        ↓
저장 (날짜별 Segment)
```

호출 수는 **페이지 수**에 비례하고 종목 수(500)에는 비례하지 않는다.
`list_filings()`에 `corp_code`를 넘기지 않는 것이 핵심이며, 테스트가 이를 강제한다
(`NoPerStockPolling.test_no_corp_code_filter_in_list_call`).

공식 호출 한도는 구현 시 공식 문서를 기준으로 확인할 값이라 상수로 박지 않았다.
대신 매 실행 사용량을 계측해서 남긴다.

| 계측 항목 | 의미 |
| --- | --- |
| `requests_per_run` | 이번 실행 총 호출 수 |
| `new_filings_detected` | 목록에서 본 공시 수 |
| `matched_gaeo_filings` | 우리 유니버스에 해당하는 수 |
| `detail_requests` | 상세 API 호출 수 |
| `duplicate_skipped` | rcept_no 중복으로 건너뛴 수 |
| `api_errors` | 실패 수 |
| `processing_duration` | 처리 시간 |

---

## 2. 기업 Mapping

`dart_pipeline.build_corp_map()` — `research_archive/dart/corp_map.json`.

**stock_code(6자리) 완전일치로만 연결한다.** 회사명이 비슷하다는 이유로 매칭하지 않는다.

| 상황 | 처리 |
| --- | --- |
| 종목코드 완전일치 1건 | `mapped_by: STOCK_CODE_EXACT` |
| 일치 없음 | `UNKNOWN_MAPPING` |
| 일치 후보 2건 이상 | `UNKNOWN_MAPPING` + 후보 목록 보존. **고르지 않는다** |

보존 필드: `corp_code` · `stock_code` · `ticker` · `company_name`
(추가로 `dart_corp_name` — DART 표기가 우리 표기와 다를 수 있어 따로 남긴다).

테스트가 "삼성전자서비스"가 "삼성전자"에 붙지 않는지 확인한다.

---

## 3. Official Event Pipeline

### 중복 제거

`rcept_no`가 고유 Event 식별자다. 이미 처리한 접수번호는 새 Event로 저장하지 않는다
(`SeenRegistry`, 파일로 영속).

### 정정공시

정정공시는 그 자체로 **새로운 rcept_no**를 받으므로 별개 Event로 들어온다.
원본과의 관계는 추적 가능하게 남기되 **추측으로 확정하지 않는다**.

| 상황 | `corrects_rcept_no` | `correction_link_basis` |
| --- | --- | --- |
| 같은 종목·같은 보고서명 후보 1건 | 그 접수번호 | `SAME_TICKER_SAME_REPORT_NAME` |
| 후보 2건 이상 | `NOT_AVAILABLE` | `AMBIGUOUS_NOT_LINKED` |
| 후보 없음 | `NOT_AVAILABLE` | (없음) |

### Raw Record 필드

`source` · `corp_code` · `stock_code` · `ticker` · `rcept_no` · `report_name` ·
`corp_cls` · `rcept_dt` · `detected_at` · `fetched_at` · `is_correction` ·
`processing_status` · `raw_source_reference`

### ⚠️ rcept_dt를 시각으로 해석하지 않는다

`rcept_dt`는 **공식 접수일자**다. 시:분:초 정보가 아니다.
필드에 `rcept_dt_note: "OFFICIAL_RECEIPT_DATE_ONLY_NO_TIME"`를 함께 박아 둔다.

실시간 GAEO에서 의미 있는 시각은 **`detected_at`** — 우리가 그 공시를 처음 발견한 시각이다.

### Event 상태 (점수를 만들지 않는다)

공시를 발견했다고 자동으로 BUY/SELL 점수를 만들지 않는다. 상태를 정확히 만드는 데만 집중한다.

| 상태 | 뜻 |
| --- | --- |
| `EVENT_DETECTED` | 우리 종목의 신규 공시를 발견 |
| `NO_OFFICIAL_EVENT_DETECTED` | 공식 공시가 없음 |
| `EVENT_COVERAGE_INCOMPLETE` | 키 없음 등으로 커버리지 불완전 |
| `EVENT_DATA_ERROR` | API 실패 |

**`NO_OFFICIAL_EVENT_DETECTED`는 "뉴스 없음"이 아니다.**
일반 언론뉴스 Coverage가 아예 없어서 공식 공시만 본 결과다. 코드에 이 문구를 상수로 박아 뒀다.

---

## 4. Financial Statement Pipeline

`fnlttSinglAcntAll.json`에서 아래 항목을 노린다. **없으면 `NOT_AVAILABLE`. 0으로 만들지 않는다.**

| 수집 항목 | 쓰일 곳 |
| --- | --- |
| 매출액 / 매출원가 / 매출총이익 | Gross Profitability |
| 영업이익 | Operating Profitability |
| 당기순이익 | Accruals, ROE |
| 총자산 | Asset Growth, Gross Profitability, Leverage |
| 총부채 / 자본 | Leverage |
| 영업활동현금흐름 | Cash Flow Quality, Accruals |
| 투자활동현금흐름 | Investment |

### 현재 DIANA의 구멍과 DART로 메울 수 있는 것

`research_v1.x`의 DIANA는 `VALUE_ONLY_DIANA`다. PER/PBR/ROE만 있고 나머지는 `missing`이다.

| DIANA missing 항목 | DART로 가능? | 필요한 계정 |
| --- | --- | --- |
| `grossProfitability` | 가능 | 매출액, 매출원가(또는 매출총이익), 자산총계 |
| `operatingProfitability` | 가능 | 영업이익, 자산총계 |
| `assetGrowth` | 가능(2개 기간 필요) | 자산총계 |
| `accruals` | 가능 | 당기순이익, 영업활동현금흐름 |
| `leverage` | 가능 | 부채총계, 자본총계 |

즉 v1.x에서 비어 있던 5개 축을 **전부** DART로 채울 수 있다. 단 실제 응답에 그 계정이
있는지는 수집을 시작해 봐야 안다. 커버리지를 `coverage` 값으로 매 건 기록한다.

---

## 5. Point-in-Time Rule

### EVENT

```
event_detected_at <= prediction_timestamp
```

공시가 "오늘 존재한다"는 것과 "그 시각에 우리가 알고 있었다"는 것은 다르다.
14:20에 처음 탐지한 공시는 14:20 **이전** Prediction에서 쓸 수 없다.
`event_visible_at()` / `events_for_prediction()`이 이 조건을 강제하며,
경계값(같은 시각)은 사용 가능으로 처리한다.

### 재무

회계기간과 시장 공개 시점을 분리한다.

```
accountingPeriod : {year, reprtCode}     ← 그 숫자가 어느 기간의 것인가
disclosedAt      : 공시 접수 시점         ← 모르면 NOT_AVAILABLE. 만들어내지 않는다
detectedAt       : GAEO가 알게 된 시각
usableFrom       : detectedAt            ← 이 시점 이후 Prediction에서만 Feature로 사용
usableFromBasis  : "GAEO_DETECTED_AT"
```

2026 Q2 실적이라고 2026 Q2 내내 쓸 수 있는 게 아니다. 정정공시도 같은 규칙이다.

### Backfill과 실시간을 섞지 않는다

| `sourceMode` | 뜻 |
| --- | --- |
| `LIVE_DART_PIT` | 오늘부터 실시간으로 탐지한 자료. 공개 시각을 우리가 안다 |
| `HISTORICAL_DART_BACKFILL` | 과거 소급 수집. 장중 공개시각을 입증할 수 없다 |

두 자료를 같은 품질로 취급하지 않는다. **임의의 공개시각을 만들어내지 않는다.**

---

## 6. Consensus 금지

DART는 **실제 실적**만 준다. 애널리스트 예상치가 아니다.

```
consensus : "CONSENSUS_DATA_UNAVAILABLE"
surprise  : "NOT_COMPUTABLE_WITHOUT_CONSENSUS"
```

별도의 신뢰 가능한 Consensus Source가 없으면 "예상보다 +15%" 같은 Surprise를 만들지 않는다.

---

## 7. 보안 · Graceful Failure

**키 보안**: `OPEN_DART_API_KEY` 환경변수에서만 읽는다. 소스코드·HTML·클라이언트 JS·
공개 JSON·로그·저장소 어디에도 넣지 않는다. GitHub Actions에서는 Secrets로 주입한다.

DART는 키를 쿼리스트링으로 받기 때문에 예외 메시지에 URL이 그대로 찍히면 그게 유출이다.
`dart_client.redact()`가 (a) 아는 키 값, (b) 키를 몰라도 `crtfc_key=` 뒤의 값을
모든 출력에서 지운다. 테스트가 두 경우 다 검사한다.

**Graceful Failure**: 키가 없거나 API가 죽어도 `collect_dart.py`는 항상 종료코드 0을 낸다.
Price · TARO · DIANA · FLOW · ROTATION 워크플로를 절대 중단시키지 않는다.
워크플로에서도 `|| echo`로 한 번 더 막아 둔다.

---

## 8. Storage Architecture

### 계층

| 계층 | 위치 | 형태 |
| --- | --- | --- |
| HOT | `research_archive/live/YYYY/MM/DD.jsonl` | 오늘. 압축 안 함 |
| WARM | `research_archive/live/YYYY/MM/DD.jsonl.gz` | 닫힌 날. gzip |
| COLD | `research_archive/archive/YYYY/MM/` | 월간 묶음 + manifest |

DART Raw도 같은 정책을 쓴다(`research_archive/dart/` 아래 동일 구조).

### Daily Immutable Segment

- 오늘 파일은 `ACTIVE`. 계속 쓰고, 압축하지 않는다.
- 날이 바뀌면 `CLOSED`. 그 뒤로는 **쓰기 자체가 거부된다**(`PermissionError`).
- `COMPRESSED`가 되면 더더욱 손대지 않는다.

### gzip 절차 (순서를 지킨다)

1. 원본 Daily Segment 종료 확인
2. record count 계산
3. SHA256 계산
4. gzip 생성
5. 압축파일 decompress test
6. 압축 전/후 record count 비교
7. hash/manifest 검증
8. **검증 성공 후에만** 원본 정리

압축 실패나 무결성 검증 실패 상태에서는 **원본을 절대 삭제하지 않는다.**
실패 시 gzip 파일을 지우고 원본을 그대로 둔 채 `ARCHIVE_INTEGRITY_ERROR`를 낸다.

압축은 **저장형태만** 바꾸는 작업이다. 연구 데이터 내용은 바꾸지 않는다
(테스트: 압축 전후 `read_day()` 결과가 동일).

### Weekly Rolling

`research_archive/archive/YYYY/<week_id>/manifest.json`
기록: `week_id` · `included_days` · `record_count` · `first_timestamp` ·
`last_timestamp` · `model_versions` · `file_hashes` · `archive_created_at`.
**개별 Prediction 값을 재계산하지 않는다.**

### Monthly Rolling

`research_archive/archive/YYYY/MM/research-YYYY-MM.jsonl.gz` + `manifest.json`

원본 Segment의 hash와 record count를 **먼저 검증**하고, 하나라도 깨져 있으면
묶음을 만들지 않고 `ARCHIVE_INTEGRITY_ERROR`를 낸다.
묶음이 정상이라는 것이 확인되기 전에는 원본을 제거하지 않는다.

### Manifest 필드

`archive_version` · `created_at` · `period` · `record_count` · `model_versions` ·
`feature_versions` · `label_versions` · `first_prediction_timestamp` ·
`last_prediction_timestamp` · `sha256` · `source_files` · `compression` · `schema_version`

### 보관기간

**정하지 않았다.** 7일·30일 같은 임의 규칙을 처음부터 만들지 않는다.
실제 저장량과 필요량을 측정한 뒤 결정한다.
테스트가 `RETENTION_DAYS` 같은 상수가 코드에 들어오지 않았는지 감시한다.

연구 초기에는 `prediction` · `input metadata` · `model version` · `timestamp` ·
`maturity` · `reason code`를 장기 보존한다. Label 변경·버그 발견·Scorecard 재검증이
나중에 필요할 수 있기 때문이다. **Aggregate Scorecard만 남기고 Raw를 지우는 구조는 만들지 않는다.**

---

## 9. Storage Abstraction

`research_store.ResearchArchiveStore` — 저장 backend와 Research 계산 코드를 분리한다.

```
append_predictions()     close_daily_segment()    compress_segment()
rollup_week()            rollup_month()           verify_archive()
restore_test()           storage_report()         maintain()
```

`archive_analysis.py`는 이 메서드들만 부른다. 나중에 저장소가 바뀌어도 호출부는 그대로다.

---

## 10. 무결성 · 복원 테스트

`test_research_store.py` 26건.

| 검사 | 실패 시 |
| --- | --- |
| gzip decompress 성공 | `ARCHIVE_INTEGRITY_ERROR` |
| JSONL parse 성공 | `ARCHIVE_INTEGRITY_ERROR` |
| record count 동일 | `ARCHIVE_INTEGRITY_ERROR` |
| SHA256 manifest 일치 | `ARCHIVE_INTEGRITY_ERROR` |
| `modelVersion` 누락 없음 | `ARCHIVE_INTEGRITY_ERROR` |
| `predictionTimestamp` 누락 없음 | `ARCHIVE_INTEGRITY_ERROR` |
| duplicate key 없음 | `ARCHIVE_INTEGRITY_ERROR` |
| Append-only violation 없음 | 되돌리고 경고 |

`restore_test(day)`는 압축 Archive → 복원 → parse → count/version/timestamp를 확인한다.
월 1회 또는 적절한 주기로 돌릴 수 있게 만들어 뒀다.

---

## 11. Public Website와 Raw Data 분리

Research Raw History는 `auto_analysis.js` · `history.js` · `data.js` 등
**사용자가 웹사이트에서 내려받는 파일에 넣지 않는다.**

- `index.html`의 `GaeoFeatures` 지연로딩 목록에 `research_archive`가 없다.
- `robots.txt`에 `Disallow: /research_archive/`를 넣었다.
- 한 사이클짜리 전달 파일 `research_shadow.json`은 `.gitignore`다.

### Git 저장소 비대화 방지

매일 커지는 하나의 거대한 파일을 계속 수정·커밋하는 방식을 피한다.
Git은 과거 버전까지 보존하므로 나중에 지워도 저장소 용량이 돌아오지 않는다.

그래서 **날짜별 Segment**로 나눴다. 하루가 지나면 그 파일은 다시 수정되지 않고
gzip으로 굳어 더 이상 커밋 diff를 만들지 않는다.

`STORAGE_MIGRATION_RECOMMENDED` 상태를 실측 증가량으로 판정한다.
임의의 크기 한계를 하드코딩하지 않고, 1년 예상치가 큰 규모에 접근하면 경고를 낸다.
기존 main repository를 위험하게 Migration하지 않는다.

---

## 12. 계층 분리

```
dart_raw                  DART가 준 원본 그대로
dart_normalized           우리 스키마로 정규화한 Event
research_event_features   research_v2.0에서 생성 (지금은 만들지 않는다)
research_shadow           Research Prediction (별도 파일)
```

공시 원본을 분석점수로 바로 덮어쓰지 않는다.
같은 원칙으로 `raw_prediction_archive`(Source of Truth)와 `derived_scorecard`(빠른 조회)도 분리한다.
Scorecard는 언제든 Raw에서 다시 만들 수 있어야 한다.

---

## 13. v1.x vs v2.0 비교 방법

`research_v2.0` Candidate 구성:

```
v1.x의 가격·기술·수급
  + DART 기반 DIANA 강화 (Gross/Operating Profitability, Asset Growth, Accruals, Leverage)
  + DART EVENT
  + Reliability 개선 (지금은 500종목 전부 같은 등급이라 변별력이 없다)
```

비교 규칙:

- v1.0 · v1.1 · v2.0을 **각각 별도로** 측정한다.
- 각 버전은 자기 `model_version` · `config_hash`로 기록이 분리돼 있다.
- Horizon별 Maturity를 충족한 뒤에만 비교한다.
- 한 버전의 미래결과를 보고 그 버전을 과거로 돌아가 고치지 않는다.
- **DART를 추가했다고 정확도가 좋아졌다고 가정하지 않는다.**

---

## 14. 현재 상태

| 항목 | 상태 |
| --- | --- |
| DART 수집 코드 | 구현 완료 |
| DART API 실연결 | **이 세션에서는 검증 못 함** (키 없음 + egress 프록시 403) |
| corp_map | API 키 주입 후 첫 실행에서 생성 |
| Research Segment 저장 | 동작 확인 |
| gzip · manifest · 무결성 | 동작 확인 |
| Weekly / Monthly Rollup | 구현 + 테스트 완료 |
| DART가 v1.x 판단에 반영 | **되지 않음**(테스트로 강제) |
| research_v2.0 점수 | **아직 만들지 않음** |
| Timestamp Live Verification | `IMPLEMENTED_PENDING_LIVE_VERIFICATION` |

OpenDART와 장기 Research 저장 인프라는 준비되었지만,
DART 정보가 포함된 research_v2.0이 기존 GAEO보다 정확하다는 결론은 아직 내리지 않는다.
