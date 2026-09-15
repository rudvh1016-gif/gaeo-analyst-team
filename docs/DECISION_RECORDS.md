# 실제 자동판단 원본과 검증 성적표

2026-09-13부터 `archive_analysis.py --auto`가 기존 일별 이력을 갱신하기 **전에** 실제 `LIVE_AUTO`를 보존한다. 이미 있던 2026-09-11 16:14 실제 자동분석 600건도 보존했다. `decisionAt`은 원래 생성 시각이고 `capturedAt`은 이번 보존 시각이다. 과거 자료로 판단을 재구성하지 않았다.

## 저장과 공개 경로

1. `decision_records.capture` → 기존 `ResearchArchiveStore`의 공개 `production_decision` 유형 → `research_archive/decisions/originals/YYYY/MM/DD/<round>.jsonl.gz`와 manifest.
2. 저장 내용을 다시 읽고 원본 ID·압축 내용·manifest를 확인한다. 동일 회차의 내용이 바뀌면 덮어쓰지 않고 실패한다. 새 장중 회차는 별도 파일에 남긴다.
3. `decision_records.refresh` → 별도 `outcomes/YYYY-MM.json`. 원본은 수정하지 않는다. 평가 완료 결과도 다시 쓰지 않는다.
4. 다시 읽은 결과로 `status.json`을 만들고, 기존 `build_model_scoreboard.py`가 `MODEL_SCOREBOARD.decisionTrace`에 연결한다. 공개 JS는 약 44KB이며 원본 자동 다운로드는 없다. 성적표의 실제 예시에서 공개 GitHub의 원본과 결과 파일을 직접 열 수 있다. 기존 Pages의 `research_archive/` 배포 제외는 유지한다.

`build_model_scoreboard.py --decision-trace-only`는 현재 보관된 연구 집계를 그대로 두고 이 연결만 갱신한다. Research 암호화 키를 읽거나 연구 원본을 공개하지 않는다. 기본 실행은 기존 연구·모델 집계를 계속 생산한다.

## 집계와 미확인 경계

- 전체 원본 건수와 성적에 쓰는 일별 건수는 다르다. **종목·판단일마다 마지막 실제 자동판단 1건**을 선택한 뒤 모델별로 나눈다. 하루 중 모델이 바뀌어도 두 모델에 같은 종목·날짜를 중복 집계하지 않는다. 선택되지 않은 장중 원본과 저장된 결과는 삭제하지 않는다.
- 자동분석만 이 원본 연결 성적에 포함한다. 정밀분석·재구성 연구·기존 일별 이력 성적은 다른 이름과 분모를 유지한다. 종목이 현재 목록에서 빠져도 과거 원본과 결과를 유지한다.
- 기본모델은 기존 **5거래일** 채점과 `score_call`을 쓴다. 연구의 **5·20·60거래일**은 그대로다. 가중치·임계값·모델 버전·확정된 검증 일정은 바꾸지 않는다.
- `pending`: 아직 평가일 종가가 확정되기 전. `blocked`: 가격 누락·가격 기준 미확인·기업행사 비교 미확인 등. `withheld`: 원래 판단이 보류. `evaluated`: 근거를 확인한 뒤 기존 기준으로 채점한 결과. 보류·누락을 실패나 0% 수익으로 바꾸지 않는다.
- 현재 실제 원본에는 가격 관측 시각과 수정주가/비수정주가 기준의 충분한 증명이 없다. **600건 모두 미래 대기이며, 평가일이 와도 증명 전에는 평가 보류로 남는다.** 아래 가격 비교 안전장치가 기존 결과 생산 경로에 연결됐다. 과거 원본의 빈 증명을 사후에 채우지 않는다.
- 적중률 분모는 적중+실패이고, 거래 수익률과 다르다. 기존 최소 20개의 서로 다른 평가 판단일을 충족하기 전에는 비율을 표시하지 않는다. 숫자만 많다고 검증 완료로 표시하지 않는다.

## DART/KIND 관찰

기존 `gaeo_coverage/corporate_action_evidence.json`과 `kind_market_action_evidence.json`만 읽는다. 새 조회·과거 대량 수집·모델 호출은 없다. 종목 식별·API 성공·범위·수집 시각·유효기간·페이지 수집 완전성·분류 근거를 확인한다.

공개 상태는 사건 발견 / 확인 범위에서 사건 없음 / 확인 불가 / 추가 확인 필요다. 실패·만료·누락·독립성이 없는 파생 경로를 정상 확인으로 세지 않는다. 사건이 발견되어도 SELL이나 감점을 추가하지 않는다.

`events/<receipt>.json`은 최초 보존된 사건이다. 이후 확인 상태는 별도 내용 해시 기반 `disclosures/*.json.gz`에 남긴다. 접수일만 있으면 공개 분·초를 만들지 않는다. `firstObservedAt`은 보존 가능한 수집기 관측 시각 중 가장 이른 시각으로, 공시 공식 공개 시각이나 시스템의 전체 과거 관측 이력을 뜻하지 않는다. 같은 접수번호의 제목 등이 충돌하면 추가 확인 상태로 남긴다. 현재 관찰을 과거 판단 당시 정보로 소급하지 않는다.

## 운영과 충돌 복구

기존 `update-analysis.yml`의 보존→채점→집계 순서와 일상 점검을 사용한다. `ops_status.check_decisions`는 원본 manifest, 실제 저장 결과, 공개 성적표와 가격 비교 근거의 해시·원본 연결·개수를 직접 대조한다. 미래 대기와 자료 부족, 저장·연결 실패, 갱신 누락을 구분한다. 기존 Evolution 및 예약 검증은 유지한다.

러너의 `decision_records.py --merge-ref origin/main`은 양쪽 ID를 합친다. 겹치는 불변 원본이 다르거나 평가 완료 결과가 충돌하면 실패한다. 병합은 미확정 상태에서 원본 보존·결과 합집합·요약 읽기 검증까지 수행하고, 모두 성공해야 커밋한다. 실패하면 병합 전 HEAD와 작업 트리를 복원한다. 파일 수정 시각만으로 원장을 고르지 않는다.

러너 종료 시 원격 main에 아직 없는 공개 판단 증거가 있으면 검증한 `gaeo-decision-recovery` Actions artifact로 14일 보관한다. 복구가 필요하면 해당 실행의 artifact를 별도 작업 폴더에 내려받아 원본/manifest를 대조하고, `merge_outcomes`로 ID를 합쳐 생산자로 요약을 다시 만든다. 기존 파일 위에 압축을 바로 풀거나 수정 시각만 보고 고르지 않는다. 정상 PR 병합을 사용한다.

## 검사

`test_decision_records.py`는 실제 임시 Git 저장소를 써서 장중 보존·동일 회차 중복 방지·원본 변조 차단·양쪽 기록 병합·실패 시 복원을 확인한다. 결과 대기/누락/보류, 모델별 동일 분모, 공시 실패와 최초 관측 시각, 운영 연결 단절도 검사한다. 이 테스트는 `gaeo_check.py investment-contract`와 기존 CI에 포함된다. 테스트용 판단·가격·공시는 임시 폴더에만 둔다.

## 기업행사로 인한 거짓 채점 방지 (2026-09-13)

`comparison_evidence.assess`가 일별 실제 판단마다 판단일~5거래일 결과일의 기업행사와 가격 비교 기준을 자동 확인한다. 기존 DART/KIND 종목별 수집 결과를 재사용하고 네트워크를 호출하지 않는다. `comparisons/<content-hash>.json.gz`에 종목·원본 해시·기간·확인 시각·공식 출처/접수번호·원문 확인 근거·정정 이력·보류 사유를 보존한다. 결과 파일의 `comparisonEvidenceRef`가 이를 가리킨다. 동일 내용의 재시도는 같은 파일을 재사용한다. 실제 조회 시각은 각 출처의 `queriedAt`이며, 비교 실행 시각 `checkedAt`과 다르다.

| 상태 | 의미 | 채점 |
|---|---|---|
| `comparable` | 두 공식 경로의 완료된 기간 확인 + 동일 가격 기준 증명 | 평가일 경과 후 기존 채점식 사용 |
| `adjustment_required` | 가격에 영향을 줄 수 있는 행사, 적용일 또는 조정 근거 부족 | 보류 |
| `unknown` | 실패·만료·범위 부족·가격 기준/원래 가격 시각 미확인 | 보류, 사건 없음으로 바꾸지 않음 |
| `review_required` | 공시 상태·정정 관계·출처 식별·별도 가격 근거 충돌 | 보류, 사건 없음으로 바꾸지 않음 |

이 상태는 미래 결과 대기/원래 판단보류와 별도다. 화면은 상태와 쉬운 설명을 접지 않고 보여 주며, 행사 영향이 확인된 경우 “기업행사 영향으로 아직 성적을 계산하지 않았어요.”라고 표시한다.

- 기존 DART의 `findings/events/eventCounts/unresolvedHistorical`는 그대로다. 같은 응답에서만 `comparisonScopeVersion`과 `comparisonFindings`를 추가해 현금배당·주식병합 등 가격 비교용 범위를 넓혔다. 추가 요청·점수 반영·Private 변경은 없다. 새 범위 표식이 없는 옛 빈 목록은 안전 증명이 아니다.
- KIND의 현재 `openCount`나 종료 상태로 과거 기간의 행사가 없었다고 결론 내리지 않는다. 원래 공시 제목과 공식 적용일을 확인한다. 접수일은 적용일이 아니다. 적용일이 없으면 잠재적 영향을 보류한다. 거래정지나 거래량 0인 날을 가짜 종가 결과로 만들지 않는다.
- 같은 접수번호는 중복 제거하고 두 출처를 보존한다. DART/KIND의 번호가 달라도 종목·접수일·공백 제거 후 제목이 같으면 하나의 **동일 사건 여부 미확정 그룹**으로 묶고 추가 확인 상태로 둔다. 번호 변환이나 비슷한 제목을 근거로 확정하지 않는다.
- 정정은 공식 원문의 `originalReceiptId` 연결이 검증되어야 한다. 단일 부모 체인의 최신 상태를 사용하면서 모든 이전 접수 정보를 남긴다. 연결 누락·분기·순환·같은 번호의 다른 사실은 추가 확인으로 닫는다. 판단 원본과 이미 평가한 결과는 다시 쓰지 않는다.

### 나중에 확보한 공식 가격 근거

`price_proofs/<sha256>.json`은 원본과 별도로 보존한다. 기존 Naver 가격 배열에는 수정 여부·정확한 관측 시각 증명이 없으므로 현재 값을 수정주가로 추측하거나 판단 시점 정보로 소급하지 않는다. 정상 채점 검사에 쓰인 가격/공시 문서는 **테스트용**이며 운영 파일에는 넣지 않았다.

공식 자료를 실제 확보했을 때만 다음 생산 경로를 사용한다. 새 API나 자동 수집기를 추가하지 않았으며, 현재 600건의 빈 `priceObservedAt`을 고쳐 채점할 수 없다.

**2026-09-16 (PHASE 4)** — 이제 생산자가 있다: `collect_price_proof.py` 가 `price_proof_planner.py` 로 「출처 있음 + 결과일 도달 + 미채점 + 증명 없음」인 판단만 고르고, KRX Open API 일별매매정보(`krx_openapi_client.py`, 기준일자별 전 종목, 날짜당 2요청) 원문을 `price_sources/`(내용주소)에 보존한 뒤 위 계약대로 증명을 조립해 `save_price_proof` 로 저장한다. 가격 기준은 응답의 전일대비 연속성으로 창 안에서 실측하고, 판단 당시 가격은 장 마감 뒤 관측이면서 공식 종가와 정확히 같을 때만 대응시킨다. 조정계수는 만들지 않는다. 인증키(`KRX_OPENAPI_AUTH_KEY`)가 없으면 계획·상태만 남긴다. 상세: `docs/operations/PRICE_PROOF_PRODUCER_20260916.md`.

```text
python decision_records.py --price-proof /path/to/official-proof.json
python build_model_scoreboard.py --decision-trace-only
```

가격 근거 계약(`schemaVersion=1`):

- `recordId`, 전체 원본의 `originalRecordHash`, `ticker`, 정확한 `period.from/to`, 실제 `observedAt`, `source=KRX`, `basis=adjusted|unadjusted`, `datasetId`.
- 각 원응답 묶음은 `sourceRef`(공식 HTTPS 주소), `document`(보관한 JSON 원문), `responseRef=sha256:<정규 JSON 해시>`를 가진다. 루트의 `tickerPath/periodPath/pricesPath/datasetIdPath`는 원문의 실제 값에 연결되는 JSON Pointer다. 해시는 보관 무결성을 확인하며 출처의 전자서명을 뜻하지 않는다. 입력 자료의 진위와 정확한 추출은 정상 PR 검토 경계에서 확인한다. 주소만 적거나 실제 원문 대신 증명용 내용을 만들어 넣으면 안 된다.
- `basisEvidence`는 같은 `datasetId`·기간과 수정 여부를 연결한다(`valuePath/datasetIdPath/periodPath`). `originalPriceEvidence`는 원래 `base`·비수정 기준·종목·원본의 정확한 `priceObservedAt`에 연결한다(`valuePath/basisPath/tickerPath/observedAtPath`). 원래 가격 시각이 없거나 판단일과 다른 날이거나 판단 후면 보류한다. 오래된 가격과 판단 사이의 행사를 놓치지 않기 위한 제한이다.
- `prices`는 기간 내 모든 실제 거래일의 양수 확정 종가이며 중복·누락이 없어야 한다. `adjustment`는 공식 원문에 묶인 양수 `multiplier`, 해당 `receiptIds`, 정확한 `fromDate/toDate`, 종목과 동일 가격 자료 식별자를 요구한다. 원본 가격은 바꾸지 않고 결과에만 `comparisonBase`를 보존한다.
- `filingDetails`는 이미 수집한 접수번호를 키로 공식 본문을 나중에 붙이는 선택 필드다. `detailEvidence`의 `tickerPath/receiptIdPath/fromPath/toPath/parentPath`가 종목·접수번호·적용일·정정 부모를 원문에 연결해야 한다. 기존 수집 사실과 충돌하면 보류한다. 수집 파일이나 과거 판단을 수정하지 않는다.
- 가격 근거를 정정할 때는 새 파일에 기존 근거 해시를 `supersedes`로 붙인다. 단일 연결이 아닌 두 근거, 누락된 부모, 순환은 충돌로 보류한다. 파일 시각으로 최신을 추측하지 않는다.

`test_comparison_evidence.py`가 평상일, 분할/병합/감자/증자/권리락/배당락/상장조치/거래정지, 실패·불완전 수집, 정정·중복, 공식 원문 연결 오류, 오래된 원가격, 결과 재개와 원본 보존, 재시도 및 근거 삭제 감지를 검사한다. 기존 `investment-contract`/CI에 포함된다.

다음 로드맵은 **점수가 높을수록 실제로 더 잘 맞는지 확인하는 확신도 검사 + HOLD와 판단보류 구분 강화**다. 이번 안전장치를 정확도를 높인 새 전략이나 성적 향상으로 해석하지 않는다.
