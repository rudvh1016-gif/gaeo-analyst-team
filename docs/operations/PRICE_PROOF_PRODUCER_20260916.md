# 공식 결과가격 증명 생산자 — 판단 하나가 채점까지 가는 마지막 사슬 (PHASE 4, 2026-09-16)

시작 main `f3afcd2763` · 이 세션은 KRX·DART 호스트에 닿지 않는다(프록시 403) → 공식 API 계약은 아래 §3 방법으로 확인했다.

> ## 한 줄 결론
>
> 봉인 판단 하나가 **당시 가격 근거 → 5거래일 뒤 공식 결과가격 → 기업행사 확인 → 공정한 비교 →
> 기존 채점 → 결과 보존 → 되읽기**까지 가는 길을 코드로 열었고, 합성 자료로 처음부터 끝까지 한 번
> 통과시켰다. **실제 Production 이 열리려면 KRX Open API 인증키 하나(Actions Secret
> `KRX_OPENAPI_AUTH_KEY`)가 필요하다.** 그 전까지 생산자는 계획·상태·OWNER_ACTION_REQUIRED 만 남긴다.
> 채점 공식·임계값·가중치·비교 검사 조건은 하나도 바꾸지 않았다.

---

## 1. 현행 검사조건 역추적 — `comparison_evidence._price_proof()` / `assess()` 가 요구하는 것 (main 코드 기준)

| # | 조건(코드 그대로) | 이번 작업 전 | 이번 작업 후 | 생산자 |
|---|---|---|---|---|
| 1 | `schemaVersion==1`, `recordId==record.recordId`, `originalRecordHash==hash(record)` | 생산자 없음 | **생산됨** — `collect_price_proof.build_proof` 가 봉인 기록에서 그대로 만든다 | 있음 |
| 2 | `ticker==record.code`, `period=={from: 판단일, to: 5번째 거래일}` (`future_trading_period` 그대로) | 생산자 없음 | **생산됨** — 기간 계산은 기존 함수 재사용, 5D 그대로 | 있음 |
| 3 | `observedAt` 이 now 이전이고 KST 날짜가 기간 종료일 **이후** | 생산자 없음 | **생산됨** — 결과일 다음 날부터만 생산(`period_not_final`) | 있음 |
| 4 | `source=='KRX'` + `_reference(proof)`: 공식 https 호스트 `sourceRef` · `document` · `responseRef==sha256(document)` | 생산자 없음 · **공식 자료 필요** | **생산됨** — KRX Open API 서비스 주소를 `sourceRef` 로, 추출 문서를 `document` 로 바인딩. 서비스 호스트 `data-dbg.krx.co.kr` 를 `OFFICIAL_HOSTS` 에 추가(§3) | 있음 (**인증키 필요**) |
| 5 | `record.priceObservedAt` 존재 · `decisionAt` 이전 · KST 날짜 == 판단일 | PHASE 3 에서 신규 판단부터 생산 | 그대로(planner 가 없는 판단을 `MISSING_PROVENANCE` 로 거른다) | 있음(PHASE 3) |
| 6 | `basis∈{adjusted,unadjusted}` · `basisEvidence` 가 같은 `basis`·`datasetId`·`period` 를 JSON Pointer 로 바인딩 | 생산자 없음 · 공식 자료 필요 | **생산됨** — `unadjusted` 선언 + 근거(§4) | 있음 |
| 7 | `originalPriceEvidence.value==record.base`, `basis=='unadjusted'`, 종목·관측시각·값·기준 바인딩 | 생산자 없음 · 공식 자료 필요 | **조건부 생산** — 관측이 장 마감(15:30 KST) 뒤이고 `base` 가 그 날 공식 종가와 **정확히 같을 때만**(§4) | 있음 |
| 8 | `prices` 가 판단일~결과일 **모든 거래일**(`krx_calendar`) 을 빠짐없이, 각 `final:true`·양수 종가·`volume≠0`·정지 아님 | 생산자 없음 · 공식 자료 필요 | **생산됨** — 하루라도 없으면 만들지 않는다. 거래량 0 은 그대로 적어 소비자가 `trading_halt` 로 막게 둔다 | 있음 |
| 9 | `basis=='adjusted'` 면 `adjustment.multiplier`·`receiptIds`·기간·바인딩 | 생산자 없음 | **만들지 않는다**(조정계수 계산 금지). 창 안에서 기준가격이 바뀐 흔적이면 증명 자체를 만들지 않는다(§4) | 없음(설계상) |
| 10 | `assess()`: DART·KIND 두 경로 증거가 유효(TTL)·기간 포함·결과일 이후 조회·미해석 0 | 수집기 있음(수동 dispatch) | 그대로 — 가격증명과 **독립**. planner 가 `BLOCKED_CORPORATE_EVIDENCE` 로 따로 센다 | 있음(기존) |
| 11 | 같은 판단에 증명이 둘이면 `review_required`(`load_price_proofs`) | — | 생산자는 증명이 있는 판단을 다시 만들지 않는다(`PROOF_SAVED_*`) | — |
| 12 | `evaluate()`: `comparable` 일 때만 `score_call` 로 채점, 평가 완료 결과는 덮어쓰기 금지 | 있음 | 그대로(변경 0) | — |

분류 요약: **이미 생산됨** 5 · **생산자 있음(이번)** 1·2·3·4·6·7·8 · **생산자 없음(설계상 만들지 않음)** 9 · **공식 자료 필요** 4·6·7·8(인증키 뒤에 열린다) · **확인 불가** — 실제 응답 구조의 라이브 확인(§3, 첫 실행에서 검증).

## 2. 만든 것

| 파일 | 역할 |
|---|---|
| `krx_openapi_client.py` (신규) | KRX Open API 일별매매정보 호출·구조 검증·원문 보존(`research_archive/decisions/price_sources/`)·키 가리기·표본(smoke) |
| `price_proof_planner.py` (신규) | due-record planner. `ALREADY_EVALUATED / NOT_GRADEABLE / MISSING_PROVENANCE / WAITING_MATURITY / PROOF_SAVED_AWAITING_GRADING / BLOCKED_CORPORATE_EVIDENCE / BLOCKED_PRICE_EVIDENCE / READY_FOR_PRICE_PROOF` |
| `collect_price_proof.py` (신규) | 생산자. 계획 → 원문 확보(재사용 우선, 날짜당 2요청) → 증명 조립 → 소비자 검사로 자기검증 → `save_price_proof` → 상태 파일 `gaeo_coverage/price_proof_status.json` |
| `.github/workflows/price-proof.yml` (신규) | `workflow_dispatch` 전용. 시험 → 표본 구조 확인 → 생산 → 허용 경로 3곳만 커밋 |
| `comparison_evidence.py` | `OFFICIAL_HOSTS` 에 `data-dbg.krx.co.kr` 추가(검사 조건 변경 0) |
| `decision_records.py` | 러너 병합 불변 목록에 `price_sources` 추가 |
| `real_outcome_scorecard.py` | readiness 에 생산자 관점(`priceProofProducer`) 덧붙임 · `price_evidence_conflict`→B, `corporate_action_adjustment_required`→C 로 분류 |
| `ops_status.py` | 기업행사 증거 점검 상세에 「공식 가격증명: …」 한 줄 추가(판정 불변) |
| `test_price_proof_producer.py` (신규) | 35건 + 고의 파괴 12건 확인 |

## 3. 공식 자료 — 무엇을 어떻게 확인했나 (추측 금지)

- **자료**: KRX 정보데이터시스템 OPEN API(포털 `openapi.krx.co.kr`) 「주식」 카테고리 **유가증권 일별매매정보 `sto/stk_bydd_trd`** · **코스닥 일별매매정보 `sto/ksq_bydd_trd`**. 기준일자(`basDd`) 하나에 그 날 전 종목 매매기록 → 날짜당 2요청으로 600종목을 덮는다. 무료 · 인증키당 일 10,000회.
- **호출 계약**(요청 `GET https://data-dbg.krx.co.kr/svc/apis/<경로>.json?basDd=YYYYMMDD` + 헤더 `AUTH_KEY` · 성공 200 `{"OutBlock_1":[…]}` · 실패 200 + `respCode/respMsg`(401 = 키 거부/서비스 미승인) · 429 = 한도 · 403 = 잘못된 키/주소 · 값은 쉼표 문자열 · 필드 `BAS_DD ISU_CD ISU_NM MKT_NM SECT_TP_NM TDD_CLSPRC CMPPREVDD_PRC FLUC_RT TDD_OPNPRC TDD_HGPRC TDD_LWPRC ACC_TRDVOL ACC_TRDVAL MKTCAP LIST_SHRS`)은 이 세션에서 포털에 닿지 않아(프록시 403) **실제 API 를 호출해 검증한 독립 오픈소스 두 개의 소스코드**(github.com/seokhoonj/krx-openapi `_endpoint.py`·`session.py`·`catalog.py`, github.com/kyo504/krx-cli `client.ts`·`response-fields.ts`·`krx-number.ts`)에서 교차 확인했다. 둘이 일치했다.
- **그래서 코드는 응답이 올 때마다 구조를 다시 대조한다**(`verify_structure`: 필드 15개 전부, 행마다 `BAS_DD == basDd`). 하나라도 어긋나면 `RESPONSE_SHAPE_UNEXPECTED` 로 보존도 증명도 하지 않는다. 워크플로의 표본 스텝(`--smoke`, KRX 공개 표본 키·고정 날짜 20200414)이 러너에서 실제 구조를 Step Summary 에 남긴다 — 표본 값은 증명에 절대 쓰지 않는다(`save_source` 가 거부).
- ~~**확인 불가로 남긴 것**: 러너(GitHub Actions, 해외 IP)에서 `data-dbg.krx.co.kr` 에 닿는지. 첫 dispatch 의 smoke 스텝이 답한다.~~
  → **2026-09-16 01:04Z 첫 dispatch(run `35042575105`)에서 확정**: 표본 엔드포인트 두 개 모두 HTTP 200 · 10행 · `missingFields: []` ·
  `allVerified: true`. 러너는 KRX 에 닿고, 응답 구조는 §3 의 계약과 같다.
- **쓰지 않은 것**: `data.krx.co.kr` 화면 스크래핑(로그인·이용조건·해외 IP 차단 이슈), 네이버 값에 KRX 이름 붙이기.

## 4. 가격 기준과 판단 당시 가격 — 근거 없이는 만들지 않는다

- **기준(basis) = `unadjusted`** 선언의 근거 세 가지(`krx_openapi_client.BASIS_GROUNDS`): ① 기준일자별 조회(시계열 아님) ② 종가 필드 `TDD_CLSPRC`, 이 서비스에는 수정주가 인자가 없다(참고: `data.krx.co.kr` [12003] 에는 `adjStkPrc` 1/2 인자가 있다 — 쓰지 않는다) ③ **응답 자체로 실측**: 창 안의 연속 거래일 쌍마다 `종가[D] == 종가[D-1] + 전일대비[D]` 를 검사한다. 분할·병합·권리락·배당락처럼 기준가격이 바뀌면 KRX 전일대비는 조정 기준가 대비라 이 등식이 깨진다 → 그 창은 **증명하지 않는다**(`price_basis_continuity_broken`). 조정계수는 계산하지 않는다.
- **판단 당시 가격(`base`) 의 공식 대응**: 관측시각(`priceObservedAt`, KST)이 판단일 정규장 종료 15:30 이후이고 `base` 가 그 날 공식 종가와 **정확히 같을 때만** `originalPriceEvidence` 를 만든다. 장중 가격은 일별 공식 자료로 증명할 수 없어 `original_price_intraday_not_in_daily_dataset` 로 막는다(예: 2026-09-14 의 일별 대표 판단은 13:13 장중이었다 — 그런 날은 채점되지 않는 것이 맞다). 관측시각·값의 출처(수집기 시계·네이버 응답)는 문서에 **그대로 적고** KRX 것처럼 꾸미지 않는다.
- 알려진 한계(OWNER_REVIEW 아님, 기록만): 수능일 등 장 마감이 늦춰지는 날은 15:30 규칙이 느슨하다(그날 16:30 전 관측이 공식 종가와 우연히 같으면 통과). 달력 모듈이 특별 장시간을 모른다. 1년에 하루이며 값 일치까지 겹쳐야 한다.

## 5. 기업행사·거래정지와 함께 닫힌다 (변경 0)

증명이 있어도 `assess()` 의 기업행사 검사는 그대로다: 두 경로(DART·KIND) 증거가 유효·완결·결과일 이후 조회일 때만 `comparable`. 행사가 창에 걸치면 비수정 증명으로는 풀리지 않는다(`adjustment_required`). 거래량 0 인 날은 `trading_halt`. UNKNOWN 을 NO_EVENT 로 바꾸지 않는다. planner 는 이 상태를 `BLOCKED_CORPORATE_EVIDENCE` 로 따로 세고, 생산자는 그것과 무관하게 공식 가격을 받아 둔다(요청은 날짜 단위라 종목별 추가 비용이 없고, 가격증명은 독립된 사실이다).

## 6. 합성 사슬 (test_price_proof_producer.FullChain)

`실제 판단(출처 연결) → 결과일 도달 → 공식 원문 12개 수신·보존 → 증명 1건 → assess=comparable → evaluate → score_call(BUY +2.0% = hit) → outcomes 저장 → 되읽기 일치 → 재실행 불변 → 원본 바이트 불변 → ops_status DECISIONS_VERIFIED`. 부족한 조각(결과일 전·출처 없음·하루 누락·미확정·정지·행사·UNKNOWN·근거 없는 기준·다른 판단의 증명·덮어쓰기·비공식 출처)은 각각 그 자리에서 닫힌다 — 시험 35건.

고의 파괴 12건(http 출처 허용 · 연속성 검사 제거 · 장중 허용 · 종가 불일치 허용 · 출처 없는 판단 허용 · 미확정 종가 허용 · 필드 누락 허용 · 표본 보존 허용 · 표본 키 전송 · 키 가리기 제거 · 원본 hash 검사 제거 · 평가 결과 덮어쓰기)을 하나씩 깨뜨려 전부 FAIL 을 확인한 뒤 복구했다.

## 7. 실측 크기

증명 1건(6거래일) `price_proofs/*.json` 약 5KB(gzip 1.3KB) · 원문 1일치 2파일(유가증권 ~950행 · 코스닥 ~1,800행 추정) gzip 약 165KB. 하루 600건 기준 증명 ~3MB(원문 JSON, git 은 압축 저장) + 원문 165KB. 20거래일 ≈ 증명 60MB(원문 기준) — 원장이 커지면 월별 분할·gzip 은 별도 제안(§9).

## 8. OWNER_ACTION_REQUIRED — 하나

**2026-09-16 실측(PHASE 5)**: 첫 dispatch 의 상태 파일(`gaeo_coverage/price_proof_status.json`, 커밋 `d4642dea69`)에
`auth.present: false` — Secret 이 **없다**. 계획은 MISSING_PROVENANCE 1,801 · WAITING_MATURITY 599 · READY 0
(9/16 판단의 결과일은 9/23 종가 → **9/24 부터 READY**). 그날 키가 없으면 첫 채점이 통째로 밀린다.

⚠️ 그 실측에서 결함 하나: READY 가 0 이라 생산자가 키를 확인하기 전에 돌아가 `ownerActionRequired` 가 **비어 있었다**
(종료코드 0 · 아래 문단의 "종료코드 2" 와 어긋남). 키 발급·서비스 승인에는 시간이 걸리므로 **증명할 판단이 없어도
키가 없으면 항상 `KRX_OPENAPI_AUTH_KEY_MISSING` 을 남기고 종료코드 2** 로 바꿨다(`test_price_proof_producer.KeyMissingIsAlwaysReported`).

`KRX_OPENAPI_AUTH_KEY` (GitHub Actions Secret). 절차: ① openapi.krx.co.kr 회원가입 → 인증키 발급 신청(승인) ② 「주식」 유가증권·코스닥 일별매매정보 서비스 이용신청·승인 ③ Settings → Secrets → `KRX_OPENAPI_AUTH_KEY` ④ Actions → `price-proof` dispatch. 키 없이 dispatch 하면 상태 파일에 `KRX_OPENAPI_AUTH_KEY_MISSING` 이 남고 종료코드 2(경고)로 끝난다 — 가짜로 우회하지 않는다.

## 9. OWNER_REVIEW_REQUIRED — 정책 제안(이번에 바꾸지 않음)

1. 생산 예약: 지금은 수동 dispatch 만이다(새 cron 0). 결과일 다음 날 자동으로 돌리려면 `ops-daily` 에 스텝을 더하거나 별도 schedule 이 필요하다 — Actions 무료 한도 계산 뒤 결정.
2. 증명 원장 크기: 하루 600건 × ~5KB. 월 분할/gzip 저장은 소비자(`load_price_proofs`·`ops_status`) 변경이 필요하다.
3. 기업행사 증거 갱신 주기(TTL 20h vs 수동 dispatch)는 PHASE 2 에서 이미 지적된 그대로다. 가격증명이 있어도 이것이 막으면 `BLOCKED_CORPORATE_EVIDENCE` 다.

## 10. 기업행사 증거를 「채점 대상 중심」으로 (PHASE 5, 2026-09-16)

가격증명이 생겨도 `assess()` 는 DART·KIND 증거가 **유효(TTL 20h)** 해야 `comparable` 을 낸다. 실측: 두 증거 모두 9/12 04:08Z
이후 갱신이 없어 **유효 0**(DART 120·KIND 80 종목 전부 만료). 기존 수집기는 커서 순회 40종목/회차라 600종목을 유지하려면
하루 15회가 필요하고, 예약은 없다.

채점에 필요한 것은 **지금 채점 후보인 종목**(결과일 도달 + 출처 있음 + 미채점)만이다. 그래서:

| 구성 | 내용 |
|---|---|
| `price_proof_planner.due_tickers(planned)` | `READY_FOR_PRICE_PROOF · PROOF_SAVED_AWAITING_GRADING · BLOCKED_CORPORATE_EVIDENCE · BLOCKED_PRICE_EVIDENCE` 상태의 종목코드(정렬·중복 제거). 비어 있으면 비어 있는 대로 |
| `collect_price_proof.py --plan-only --due-tickers-out <파일>` | 네트워크 0. 위 목록을 한 줄에 하나씩 쓴다(후보 0 이면 빈 파일) |
| `due_targets.py` (신규) | 대상 선정 규칙 하나 — 기본 커서 순회(기존 그대로) / `--tickers-file`(파일 종목 ∩ 유니버스, **커서 보존**, 빈 파일 = 0종목 처리, 전체 순회로 되돌아가지 않음) |
| `collect_corporate_action_evidence.py` · `collect_kind_market_action.py` | `--tickers-file` 인자. 산출물에 `targetMode · targetRequested · notInUniverse` 를 **덧붙인다**(기존 필드 뜻 불변 — Private 도 읽는 공용 출력) |
| `corporate-action-evidence.yml` · `kind-market-action.yml` | 입력 `due_only`(기본 false). true 면 planner 목록을 `$RUNNER_TEMP` 에 쓰고 `--tickers-file` 로 넘긴다. **schedule 없음** |

한 번 실행 흐름(수동 3 dispatch): ① `price-proof`(계획 → 증명) ② `corporate-action-evidence` `due_only=true` ③ `kind-market-action` `due_only=true`
→ 다음 분석 사이클의 `decision_records.refresh()` 가 채점한다. 9/24 첫 결과일 기준 후보는 최대 599종목이라 첫날은 사실상 전체
유니버스와 같다 — 이 모드의 이득은 **그 뒤**(판단 보류·비거래일·출처 없음으로 빠지는 종목 제외, 커서와 무관하게 필요한 것만) 와
"어느 종목을 왜 긁었나"가 산출물에 남는 것이다.

### 한 워크플로로 묶기 — 검토만 (구현 안 함)

`price-proof.yml` 안에서 계획 → DART/KIND `due_only` 수집 → 증명까지 한 번에 도는 것은 가능해 보이지만 이번에는 넣지 않았다:
(a) `OPEN_DART_API_KEY` 를 price-proof 잡에도 노출해야 한다(비밀 범위 확대) (b) KIND 는 0.4초 간격 스크래핑 · 40페이지 상한이라
600종목이면 수 분~수십 분 — 20분 `timeout-minutes` 를 다시 재야 한다 (c) 요청 예산: DART 실측 1.2요청/종목(49/40) → 600종목 ≈ 720요청
(일 한도 20,000 안) · KIND 1.1요청/종목(44/40) → ≈ 660요청 · KRX 날짜당 2 → 6거래일 12요청. 셋 다 한도 안이지만 **한 잡 20분**이 병목이다.
새 schedule 도 만들지 않았다 — 필요 횟수는 결과일이 있는 날 하루 1회(3 dispatch)이고, Actions 무료 분(월 2,000분) 계산 뒤 소유자 결정.

## 11. 확인 명령

```bash
python3 -m unittest test_price_proof_producer -q            # 35건
python3 collect_price_proof.py --plan-only                  # 네트워크 0 · 계획 집계
python3 collect_price_proof.py --plan-only --due-tickers-out /tmp/due.txt   # 채점 후보 종목 목록(기업행사 수집기 입력)
python3 collect_corporate_action_evidence.py --tickers-file /tmp/due.txt --tickers 600   # 채점 후보만(커서 보존)
python3 gaeo_check.py investment-contract                   # 원장·비교·성적표 계약
```
