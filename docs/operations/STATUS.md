# 운영 안정화 진도 (인계장)

> 계획·경계·합격 기준은 `MASTER_PLAN.md`. 이 문서는 **최신 진도·확인된 근거·막힘·다음 행동**만 적는다.
> 민감정보(토큰·계좌·IP)와 거대한 원시 로그는 넣지 않는다.

## 2026-09-19 — 점검 판정이 알림까지 가지 않던 결함 수리 (ops-daily 결과 전달 · 저장 수리와 별개)

### 한 줄

**점검 프로그램은 "장애 1건"이라고 말했는데, 알림 단계는 `CODE: 0`("정상")을 받았다.**
`run` 블록 한 줄 때문이다 — `python3 … | tee A | tee -a B || code=$?` 에서 bash 파이프라인의 종료코드는
**마지막 명령(tee)** 것이라, 점검이 1(장애)·2(확인 불가)로 끝나도 tee 가 성공하면 `||` 가 발동하지 않고 `code` 가 0 으로 남았다.
파이프라인 **직후에** `PIPESTATUS` 배열을 통째로 보존하고 점검 코드(PS[0])와 로그 복사 코드(PS[1]·PS[2])를 따로 읽게 고쳤다.

### 실측 근거 (run 35363327604 · job 105659675599 · 2026-09-18 15:35 UTC)

- 점검 본문: `결론: 장애 1건 — 조치 필요 (예약 실행 실측(워치독·일일 점검))` · 수리 요청서 `INC-214b8601d4.md` 생성 → `ops_status.py` 는 **1** 로 끝났다.
- 장애 이슈 스텝 env: `CODE: 0` · `SIG: 214b8601d4` → 로그 `정상`. 서명만 넘어가고 판정은 0 으로 바뀌어 있었다.
  그 장애 이슈가 열려 있었다면 **"통합 점검 정상"으로 자동 닫혔다.**
- 결과 판정 스텝 env: `CODE: 0`(실행기) → `정상 종료`. 같은 결함이 실행기 경로에도 있었다.
- ⚠️ 이 장애의 내용 자체는 **이전 schedule run 실패**를 가리킨다 — 새로운 시세 장애가 아니다. 이번 수리 대상은 "판정이 전달 중 정상으로 바뀌는 것"이다.

### 고친 곳 (`.github/workflows/ops-daily.yml` 만 · 산식·정책·게이트·수집기 변경 0)

같은 `Python | tee → 종료코드` 구조가 네 곳에 있었고, 각 프로그램의 **기존 계약 그대로** 되살렸다(exit 2 를 한 뜻으로 뭉치지 않는다).

| 스텝 | 프로그램 계약 | 고친 뒤 |
| --- | --- | --- |
| 통합 상태 점검 | 0 정상 · 1 장애 · 2 확인 불가 | 그대로 전달. 2·미확인이면 이슈 스텝이 아예 안 돈다(닫지도 않는다) |
| 저장소 용량 보고 | 0 OK/NOTICE · 1 PROTECT · 2 UNKNOWN | 그대로 전달(`continue-on-error` 유지 — 알림만) |
| 저장 실패 결과 회수 | 0 회수 성공 · 1 회수 실패 | 그대로 전달. 회수 목록은 코드와 무관하게 남긴다 |
| 예정 시험 실행기 | 0 정상 · 1 실패·사람 확인 · 2 BLOCKED·구조 가드 | 그대로 전달 → 마지막 판정이 run 을 빨갛게 |

- 보고서(`ops.json`)가 없거나 깨졌으면 **정상으로 적지 않는다**: 판정 0 이면 확인 불가(2)로 낮추고(장애 1 은 유지), 마지막 판정에서 run 을 빨갛게.
- 로그 복사(tee) 실패는 **점검 판정과 분리**해 적는다(`log=fail`) — 성공으로 숨기지 않고, 기록·알림을 다 마친 뒤 마지막 판정에서 드러낸다.
- **바꾸지 않은 것**: 점검이 찾은 장애(1·2)는 여전히 run 을 실패시키지 않는다 — 제목 고정 이슈로 알리는 기존 설계다.
  예정 시험 실패·저장(main push) 실패는 계속 정확히 run 실패로 남긴다. 전역 `defaults.run.shell` 같은 일괄 설정은 넣지 않았다.

### 검증 (네트워크 0 · 서비스키 0 · 운영 수집기 재호출 0)

`test_validation_runner.py` **102건 통과**(기존 69 + 신규 33). 신규 33건은 **실제 workflow 의 run 블록을 그대로 꺼내
임시 디렉터리에서 `bash -e` 로 실행**하고, 점검·실행기 자리에는 정해진 본문·보고서·종료코드를 내는 대역을 둔다(Bash 연결부까지 시험).

- 수리 **전** 옛 워크플로에 같은 33건을 돌리면 **22건 실패**(A 0 전달 · B 1 전달 · C 2 전달 · D 보고서 누락·손상 · E tee 실패 분리 · F 실행기 1·2 전달 · 회수·용량 계약).
- PR #590 의 Git 저장 시험 `CommitStepRealGit` **9건 그대로 통과**(선택 경로 없음·생김·삭제·원장 append-only·push 실패·서비스키 0).
- 회귀 가드 `TeeNeverSwallowsVerdict`: 앞으로 `python3 … | tee …` 뒤에 `|| x=$?` 를 쓰면 실패한다. `PIPESTATUS` 는 파이프라인 **바로 다음 줄**에서 배열 통째로만 보존하게 잠갔다.
- `test_workflow_size.py` 23건 · `test_ci_parity.py` · `test_ops_status.py` · `gaeo_check.py schedule` 3파일 통과. 가장 큰 `run:` 블록은 여전히 `update-analysis.yml`(19,758B) — ops-daily 최대 블록은 2,943B(안 고친 기록 커밋 스텝).

### 하지 않은 것

- 장애를 정상으로 바꾸는 기준 변경 · 과거 schedule 실패 기록 삭제 · 중복 Issue 생성 · 공식자료 서비스키·법적 게이트 변경
- 시세·공시 공급자 추가 호출 · 도래하지 않은 사전등록 시험 실행 · 투자 산식·가중치·임계값 변경 · 과거 원장 수정 · Team PAPER·Private 변경
- 새 cron·Routine·워크플로 · 새 하네스 · 저장소 전체 Bash 재작성 · force push
- **PR #590 저장 수리는 되돌리지도 재구축하지도 않았다**(병합 `ff78d8ac`, 실제 저장 `f7516472` 유지).

### 소유자 조치

없음. 다음 정기 발화(평일 17:05 KST)에서 `점검 판정 전달: <코드>` 줄이 점검 본문의 결론과 같은지 한 번 확인하면 된다.
지금 열려 있는 「예약 실행 실측」 장애는 이번 수리로 **제대로 알림까지 가게** 됐을 뿐, 그 장애 자체의 해결은 별개 항목이다.

## 2026-09-17 낮 — 공식 일별 주가(금융위원회_주식시세정보 15094808) 실제 전환 준비 (PR-1: 구현·시험·워크플로 · 스위치 OFF)

### 한 줄

**가격 차트 하나를 네이버 일봉에서 공식 공공데이터로 바꿀 준비를 끝까지 만들었고, 실제 전환 스위치는 실응답 검증 뒤에 켠다.**
기존 어댑터(`data_supply/fsc_stock_price.py`)를 운영 수준으로 고치고(수신시각·완전성·중복/상충·범위 밖 행·NaN/음수·인코딩키 이중 인코딩·
리다이렉트 사전 차단·요청 상한), 공식 자료를 별도 저장소(`official_prices/fsc_15094808/`, 원문 행+해시+출처+정정 이력)에 보존하며,
종목 화면 '최근 가격 흐름' 캔들차트만 읽는 파생 파일(`official_price_history.js`)과 읽기 경로(app.js)를 분리했다.
`config/source_compliance.json` 의 `fsc_public_data` 는 **15094808 한정 APPROVED_WITH_CONDITIONS** 로 정정했다(소유자 2026-09-17 직접 확인:
이용허락범위 제한 없음·무료·자동승인·T+1 · 이 세션의 직접 열람은 EGRESS_BLOCKED 라 "소유자 확인 기록"이지 "직접 열람 완료"가 아니다).
상태 **IMPLEMENTED_WAITING_CREDENTIALS** — 이 세션은 data.go.kr 에 나갈 수 없고 Actions Secret `DATA_GO_KR_SERVICE_KEY` 존재 여부도
워크플로가 돌아야 불리언으로 알 수 있다. 새 워크플로(`fsc-daily-price-verify.yml`, dispatch 전용)는 main 에 있어야 dispatch 되므로
PR-1 병합 뒤 1회 돌려 결과에 따라 PR-2(스위치 ON + 검증 기록)를 낸다.

### 교체 범위 (이번 PR 에서 실제로 바뀌는 것 / 안 바뀌는 것)

- 바뀜(준비): 일별 시가·고가·저가·종가·거래량의 **공식 보존**(기준일·수신시각·해시·완전성) · 차트 전용 읽기 경로 · ops-daily 기존 발화에 하루 1회 `--if-due`(요청 상한 6) 수집
- 안 바뀜: 장중 현재가(data.js) · 수급 · 컨센서스 · PER/PBR 재계산 · BUY/HOLD/SELL 입력 · `price_history.js`(채점·순환매·반등이 읽는 공용 파일) ·
  `update_price_history.py` 의 네이버 siseJson 요청(≈9,030/거래일 — 다른 소비자 때문에 유지 → 차트가 켜져도 "PARTIAL_CONSUMER_MIGRATED")
- 채점: 공식 가격자료를 **확보·보존**하는 단계다. `comparison_evidence`(source == KRX · 가격 기준 증거 · 기업행사)에는 인정하지 않는다(위장 0 · 허용 공급자 추가 0).

### 검증

`test_fsc_daily_price.py` 58건(§13 목록: 키 없음/인증 실패/승인 안 됨 · 키 유출 0 · receivedAt 순서 · 기준일≠수신일 · totalCount 누락/불일치/중간 실패 ·
범위 밖 행 · 중복/상충 · 빈 값≠0 · 음수/NaN · 미발행 미채움 · 조정 여부 미승격 · 정정 이력 · 네이버 복귀 0 · data.js 불변 · 판단 입력 불변 · 채점 게이트 자동 통과 금지 ·
워크플로/Pages/준법 범위) · `test_data_supply_migration.py` 28건 · `test_validation_runner.py` 59건(허용 경로 5곳) · `legal_source_gate` 0 findings ·
premerge: `test_radar.py` 1건은 main 에서도 같은 자료(장중 radar.json 에 지연 종목 1건이 전날 기준일)로 실패하는 기존 건 — 이번 변경과 무관.

### 소유자 조치 한 가지

공공데이터포털 활용신청(15094808)이 승인된 serviceKey 를 Actions Secret `DATA_GO_KR_SERVICE_KEY` 로 저장한다(값은 아무 데도 적지 않는다).
그 뒤는 이 세션이 `fsc-daily-price-verify`(mode=verify · 요청 상한 50 · 10거래일 · 표본 20종목)를 돌려 결과로 PR-2 를 낸다.

## 2026-09-17 새벽 — LEGAL DATA SUPPLY MIGRATION PHASE 1 FINAL CLOSURE (최신 main 위 재검증 · PR)

### 한 줄

**PHASE 1(2026-09-16 밤)을 새 기능 없이 최신 main 위에서 끝까지 검증해 병합 경로에 올렸다.** 7d43e4109a 를 `origin/main` 6234c693e0
(PR #584 GPT 보고 훅 포함)과 merge(21a28001dc · rebase 0 · force push 0)한 트리에서 premerge **143 PASS / 0 FAIL** ·
`legal_source_gate.py` **0 findings** · 이관 시험 **28 OK**. 독립 코드 대조에서 나온 정정 5건(집계 문구 READY_TO_REPLACE 0→1(형식상) ·
DIANA 비대칭 한계값 +12/−10·+8/−6·+8/−6·+6/−5 · pos52w 연구 소비자 · lastClosePrice/cnsPer · 업종 가중치 주석)을 **문서에만** 반영했다.
판정(OWNER_APPROVAL_REQUIRED 17 · NO_SAFE_REPLACEMENT_FOUND 5 · READY_TO_REPLACE 1(형식상) · READY_FOR_SHADOW 0)과 Production 스위치(전부 0)는 그대로다.
결론: **네이버 완전 제거는 지금 불가**(수급·컨센서스·거래정지 대체 없음 + 광고 사이트 상업 이용 허용 원문 확인 0건) · 가장 쉬운 교체 1순위는 **환율(표시 전용)**.
광고는 해결책이 아니라서 제거하지 않았다(광고를 떼도 네이버 자동수집 사전 승낙·KIND·공공데이터 재배포 조건은 남는다).

### 이번에 추가한 것(문서만)

`docs/legal/SOURCE_REPLACEMENT_MATRIX.md` §10 FINAL CLOSURE(열 가지 감사 질문의 답 위치 · 상품별 6열 판정 · A–H · 공개 파일 4분류 · 정정 목록 · 스위치) ·
`docs/legal/NAVER_DEPENDENCY_MAP.md` 한계값·소비자 정정 · 이 항목. 코드·JSON·워크플로 변경 0.

### 공개 파일 4분류 요약

CURRENTLY_REQUIRED: `data.js` `price_history.js` `index_history.js` `krx_list.json` `market_universe/full_market_latest.json.gz` `source_verify.json`(수집기) `price_provenance.json` `research_archive/decisions/originals` `snap/stock/*` ·
DERIVED_ONLY_REPLACEMENT_POSSIBLE: `analysis_data.json`(사이트 미사용 · Pages 제외 · 재구성 시점 OWNER) · OWNER_REVIEW_REQUIRED: `flow_history/`(대체 불가) · `price_history.js` 네이버 유래 과거분 ·
SAFE_TO_STOP_FUTURE_WRITES 확정 파일 0(후보는 analysis_data.json 안의 LEGACY_UNUSED 필드뿐). 과거 Git history 삭제 0 · 검증 없는 제거 0.

### 하지 않은 것

네이버 Production OFF 0 · 새 공급자 Production ON 0 · 광고 제거 0 · 산식/가중치/임계값/Promotion Floor 변경 0 · 과거 원장 변경 0 · Team PAPER/Private/Gateway 변경 0 ·
runtime LLM 0 · 새 schedule/Routine/GPT 자동개발 연결 0 · 유료 API 0 · 네이버 endpoint/호출량/종목수/UA 변경 0 · 새 scraping 0 · force push 0.

### 소유자 조치(변경 없음 — 매트릭스 §8)

① 15094808 이용허락범위(공공누리 유형)·정보이용계약 안내 원문 확인 ② 허용이면 활용신청·serviceKey·게이트 열기 → 5~20종목 shadow 실호출 ③ 15094807·15094775 유형
④ OpenDART terms.do ⑤ 환율 후보(ECOS 작성기관 · 수출입은행 유형) — 1순위 ⑥ 수급·컨센서스 방향(축 제거/유료/네이버 승낙) ⑦ 네이버 유래 공개 파일 처리.

## 2026-09-16 밤 — 네이버 의존도 해체 준비 + 합법적 공식 데이터 공급망 조사 (LEGAL DATA SUPPLY MIGRATION PHASE 1)

### 한 줄

**완료 상태 = OWNER_CONFIRMATION_REQUIRED.** 네이버가 담당하는 데이터를 23개 상품으로 쪼개 코드 기준 의존성 지도를 만들고
(`docs/legal/NAVER_DEPENDENCY_MAP.md` · `config/data_supply_migration.json`), 상품별 공식 대체 후보를 조사했다
(`docs/legal/SOURCE_REPLACEMENT_MATRIX.md`). 가장 유력한 무료 공식 후보(공공데이터포털 금융위원회_주식시세정보, T+1)의
**상업 이용 허용 여부(공공누리 유형)를 원문으로 확인하지 못했고**(egress 차단 · 형제 데이터셋은 제2·4유형 상업 이용금지),
수급·컨센서스는 무료 공식 대체가 없다(NO_SAFE_REPLACEMENT_FOUND). 그래도 할 수 있는 건 다 했다: shadow 어댑터
(`data_supply/fsc_stock_price.py`, 합성 픽스처 · 게이트 닫힘 · 실호출 0)와 오프라인 판단 영향 비교(실자료 600종목).

### 판단 영향(shadow · 2026-09-16 16:02 회차 · Production 변경 0 · 네트워크 0)

| 시나리오 | 판정 바뀜 | 종합점수 \|Δ\| 평균/p90/최대 |
|---|---|---|
| T+1 공식 자료만(하루 시차) | 72 (12.0%) | 1.83 / 5 / 15 |
| 컨센서스 없음 | 51 (8.5%) | 0.94 / 2 / 3 |
| 수급 없음(FLOW 축 소실 599) | 99 (16.5%) | 2.35 / 5 / 10 |
| PER/PBR 종가÷EPS·BPS 재계산 | 0 | 0 / 0 / 2 |
| 무료 공식 자료만(위 합산) | **133 (22.2%)** | 3.53 / 8 / 24 |

판단 보류 0 — 네이버 없이도 판단은 *만들* 수 있으나 *같게* 유지되지 않는다. baseline 은 `auto_analysis.js` 를 600/600 재현(시험이 잠금).

### 만든 것

`data_supply/`(contracts · fsc_stock_price 어댑터 · shadow_compare · 합성 픽스처) · `config/data_supply_migration.json` ·
`config/source_compliance.json` 에 `fsc_public_data` 등록(전 게이트 닫힘) + replacementOptions 갱신 · `test_data_supply_migration.py`(28건, pipeline·compatibility 묶음) ·
`docs/legal/shadow/DECISION_SHADOW_20260916.*` · `_config.yml` 에 `data_supply/`·`config/` Pages 제외.

### 확인 환경의 한계

data.go.kr · fsc.go.kr · kogl.or.kr · opendart · KRX · 토스 · 한투 · ECOS · 수출입은행 전부 egress 차단. 근거는 검색 스니펫(2차)이며 소유자가 원문을 열어 재확인해야 한다.

### 하지 않은 것

네이버 Production OFF 0 · 새 공급자 Production ON 0 · 산식/가중치/임계값 변경 0 · 유료 API 0 · 런타임 LLM 0 · Private/Team PAPER 변경 0 ·
새 endpoint/호출량/종목수/UA 변경 0 · 새 scraping 0 · 새 schedule/Routine/자동 PR 0 · Git history 삭제 0 · 수집 코드 변경 0.

### 소유자 조치

`docs/legal/SOURCE_REPLACEMENT_MATRIX.md` §8 — ① 15094808 이용허락범위(공공누리 유형)·정보이용계약 안내 확인 ② 허용이면 활용신청·serviceKey·게이트 열기 → 5~20종목 shadow 실호출 ③ 지수·상장종목정보 유형 ④ OpenDART 약관 ⑤ 환율 후보 라이선스(가장 쉬운 교체 1순위) ⑥ 수급·컨센서스 방향(축 제거/유료/네이버 승낙) ⑦ 네이버 유래 공개 파일 처리.

## 2026-09-16 저녁 — 데이터 출처 준법 감사 + 위험 경로 차단 (LEGAL / COPYRIGHT ZERO-RISK GATE)

### 한 줄

**허용 근거가 없는 출처는 `PERMISSION_NOT_VERIFIED` 로 두고 확대를 막았다.** 외부 데이터 경로 14개를 전수조사해 판정표
(`docs/legal/SOURCE_COMPLIANCE_MATRIX.md` · `config/source_compliance.json`)를 만들고, KRX 원자료 공개 저장을 코드에서
fail closed 로 닫았고(생산자 요청 0·원자료 0), KIND dispatch 워크플로 4개에 게이트를 달았고, 자동 준법 검사기
`legal_source_gate.py`(12규칙, LLM 없음)를 premerge 에 넣었다. **가장 큰 미해소 위험은 네이버 금융** — 사이트 유일의 시세
출처가 비공식 endpoint 자동수집이고 광고가 붙은 공개 저장소에 응답 필드 원문이 실려 있다. 즉시 중단은 사이트 정지라
기존 기능 보호 원칙(§13)에 따라 유지하되 endpoint·호출빈도·UA·종목수 확대를 검사기로 동결했고, 계속 사용 여부는 소유자 결정 사항이다.

### 판정 요약

| 출처 | 판정 | 게이트(자동수집 / 공개저장 / 파생공개 / 상업) | 조치 |
|---|---|---|---|
| 네이버 금융(3 host · 8 endpoint) | PERMISSION_NOT_VERIFIED | 전부 NOT_VERIFIED | 확대 동결 · 공개 로그 시세 600줄 제거 · 표본값 제거 · analysis_data.json/flow_history/dart_financials Pages 제외 |
| KRX Open API | OWNER_CONFIRMATION_REQUIRED | OWNER / **PROHIBITED** / OWNER / **PROHIBITED** | 생산자 fail closed(`KRX_LEGAL_USE_UNVERIFIED`) · save_source 거부 · artifact 에서 proofs 제거 |
| KIND | PERMISSION_NOT_VERIFIED | 전부 NOT_VERIFIED | kind-* 4개 워크플로 첫 스텝 게이트(종료코드 2) · 업종 맵 schedule 은 레거시 보호 |
| OpenDART | OWNER_CONFIRMATION_REQUIRED | CONDITIONS / OWNER / OWNER / OWNER | 변경 없음(기존 기능) · terms.do 원문 확인 요청 |
| 토스증권 | OWNER_CONFIRMATION_REQUIRED | CONDITIONS / OWNER / OWNER / OWNER | 변경 없음(비가동) |
| GitHub · IndexNow · 자기 사이트 | APPROVED | 전부 APPROVED | — |
| AdSense · GA4 · AdFit · KVdb | APPROVED_WITH_CONDITIONS | — | disclaimer §7 에 AdFit 명시 |
| 폰트·아이콘·벤더 스킬·pip | APPROVED / APPROVED_WITH_CONDITIONS | — | THIRD_PARTY_NOTICES.md · 루트 LICENSE · LICENSE 사본 9폴더 · changelog CDN 폰트 제거 |

### 확인 환경의 한계

감사 세션은 KRX·네이버·KIND·OpenDART 사이트로의 egress 가 차단되어 **약관 원문을 직접 열지 못했다.** KRX 조항은 공식 페이지
스니펫(검색), 네이버 정책은 2차 자료 일치로 확인. 판정표의 URL 을 소유자가 직접 열어 재확인해야 한다.

### 하지 않은 것

투자 판단 공식·가중치·임계값·과거 원장 변경 0 · force push/이력 재작성 0 · 사이트 기능 중단 0 · 새 schedule 0 · 유료 API 0 · runtime LLM 0.

### 소유자 조치

`docs/legal/SOURCE_COMPLIANCE_MATRIX.md` §12 (네이버 결정 · KRX 서면 확인 · OpenDART/KIND/Toss 약관 원문 · OG 서체).

## 2026-09-16 장중 — 가격 출처 원장 실제 자연 실행 확정 + 채점 대상 중심 증거 수집 (PHASE 5)

### 한 줄

**PHASE 3 가 실제 운영에서 작동했다.** 오늘 09:58 자연 회차의 신규 판단 600건 중 **599건에 가격 출처가 실제로
붙었다**(1건은 이전 값 재사용·출처 없음으로 정직하게 확인 불가). main 저장·되읽기 확인. 공식 채점(KRX)은 여전히
인증키 하나가 막고 있고(`auth.present: false` 실측), 그 다음 병목인 기업행사 증거는 **채점 후보만 갱신하는 모드**를
만들어 두었다(새 예약 0).

### 실측 — 09:35 회차 (출처 파일이 아직 없던 회차)

| 항목 | 값 |
|---|---|
| 봉인 파일 | `originals/2026/09/16/a87a26aeac80b3e81ac9a4b1.jsonl.gz` · 600건 |
| `priceProvenance` | 600건 전부 `linked: false · reason: analysis_snapshot_id_missing` |
| `priceObservedAt` | 600건 null |
| 당시 origin/main 에 `price_provenance.json` | **없었다** — 첫 생성 커밋 `947e9ae4a9` 09:37:52 |
| 사용한 시세 라벨(`baseAt`) | `2026-09-15 종가 (16:00 수집)` — **전날 종가** |
| 처리 | 수정 0. 설계대로 "확인 불가"로 남았다 |

### 실측 — 09:58 회차 (09:37 이후 첫 자연 분석) → NATURAL_RUN_VERIFIED

| 항목 | 값 |
|---|---|
| 실행 신원 | update-analysis run `35036388002` · `workflow_dispatch` by `github-actions[bot]`(체인 재기동) · 08:36 KST 시작 · head `de7b22bb62` |
| 사용한 시세 | `data.js` 09:49 회차 = `price_provenance.json` roundId `34999baebb212bf1a3c74c95` · snapshotId `679f3a79…` **일치** |
| 판단 산출물 | `auto_analysis.js` generatedAt 09:58 · `priceSnapshotId 679f3a79…` · `priceProvenanceState OK` |
| 봉인 파일 | `originals/2026/09/16/d87211dcb6c3c7455ca27b36.jsonl.gz` · **600건** |
| `priceObservedAt` 있음 | **599** |
| `priceProvenance.linked` | **599** (전부 `priceState: FRESH`, `detailMetricsOk: true`, `officialPriceProof: false`) |
| 연결 안 됨 | **1** — `082640` `previous_price_provenance_missing`(첫 회차 시세 실패 → 이전 값 재사용 → 이전 출처 없음) |
| `provenance_round_superseded` / `price_value_mismatch` / `price_observed_after_decision` / `provenance_file_missing` | **0 / 0 / 0 / 0** |
| main 저장 | `130eb68626`(09:59:37) · `53d4eb1a7a`(09:59:41, 원장 보존) |
| origin/main 되읽기 | PASS — 위 숫자는 전부 `git cat-file origin/main:…` 로 다시 읽은 값 |

### 실측 — 출처 파일(시세 수집기, run `35040701020` · `github-actions[bot]` 체인)

회차 3개(09:37:52 · 09:49:07 · 10:00:20) 모두 600종목 · fresh 599 · unverified 1(`082640`) · `sourceAsOfMissing` 600.
`responseKeysSeen = [amount, diff, eps, high, low, marketSum, now, pbr, per, quant, rate, risefall]` —
**기준시각·거래일 필드가 하나도 없다.** 어제 "확인 불가"로 적은 것이 오늘 실측으로 확정됐다.

### 오늘 「분석 → 시세」 순서가 뒤바뀐 이유 — 구조적 race 가 아니다

* 시세 run `35033757755`: 08:01:25 기동 → `개장 전 기동 — 3376s 대기` → **08:06:38 외부 취소**(`The operation was canceled`).
  `concurrency.cancel-in-progress` 는 false 고 push 트리거 run 도 없었다 → API/UI 취소. 취소 주체는 run 메타데이터에
  남지 않아 **확인 불가**(#580 병합 08:05:28 의 70초 뒤). 
* 그 뒤 09:36:23 까지 시세 run 이 없었다. `pipeline-watchdog.yml` schedule 은 오늘 **0회** 발화(마지막 9/15 18:38).
  09:36 에 분석 잡이 **사이클 끝**의 상호 감시(`alive update-prices.yml`)로 살렸다 → 첫 시세 09:37:52.
* 최근 거래일(9/10 · 9/11 · 9/15)은 모두 08:59 시세 → 09:1x~09:35 분석, **시세가 먼저**였다. 설계는 맞다.
* 그래서 스케줄을 바꾸지 않았다. 대신 소생 논리를 `gaeo-chain.sh` 의 `revive_partner()` 하나로 모아
  **사이클 시작에도** 부른다(개장 전 대기가 끝나는 08:58 첫 사이클 시작에 살렸으면 09:00 전후부터 수집됐다). `update-analysis.yml` 큰 블록
  19,833B → 19,758B(여유 742B).

### PHASE 4 실제 준비도 — 첫 dispatch 실측 (MANUAL)

price-proof run `35042575105`(이 세션이 소유자 토큰으로 dispatch → actor `rudvh1016-gif` = **수동**).
`gaeo_coverage/price_proof_status.json` 커밋 `d4642dea69`: **`auth.present: false`** — Secret `KRX_OPENAPI_AUTH_KEY` 없음 확정.
계획: MISSING_PROVENANCE 1,801 · WAITING_MATURITY 599 · READY 0(첫 결과일 = 9/23 종가 → 9/24 부터 READY).
⚠️ 발견: READY 0 이라 `ownerActionRequired` 가 **비어 있었다**(종료코드 0) — 문서(종료코드 2)와 어긋났다.
키 발급·승인은 시간이 걸리므로 **판단이 없어도 키 없음은 항상 OWNER_ACTION 으로 남기게** 고쳤다.

**OWNER_ACTION_REQUIRED(유지): `KRX_OPENAPI_AUTH_KEY`** — 절차는 `docs/operations/PRICE_PROOF_PRODUCER_20260916.md` §8.

### 다음 병목 — 기업행사 증거 → 채점 대상 중심 모드

DART·KIND 증거 둘 다 9/12 04:08Z 이후 갱신 없음 → 유효 **0**(120·80 종목 전부 만료, TTL 20h). 수집기는 커서 순회
40종목/회차라 600종목 유지에 하루 15회가 필요했다. 채점에 필요한 것은 **지금 채점 후보인 종목**만이다.

| 파일 | 변경 |
|---|---|
| `due_targets.py` (신규) | 대상 선정 규칙 하나 — 커서 순회(기존) / `--tickers-file`(신규, 커서 보존, 빈 파일=0종목) |
| `price_proof_planner.py` | `due_tickers(planned)` — 결과일 도달 + 출처 있음 + 미채점 종목 |
| `collect_price_proof.py` | `--plan-only --due-tickers-out <파일>` · 키 없음 상시 OWNER_ACTION |
| `collect_corporate_action_evidence.py` · `collect_kind_market_action.py` | `--tickers-file` · 산출물에 `targetMode/targetRequested/notInUniverse` 덧붙임(기존 필드 뜻 불변) |
| `corporate-action-evidence.yml` · `kind-market-action.yml` | 입력 `due_only`(기본 false) — planner 목록을 수집기에 넘김. **schedule 없음** |

한 번 실행 흐름(수동 3 dispatch): `price-proof`(계획·증명) → `corporate-action-evidence due_only=true` → `kind-market-action due_only=true`.
한 워크플로로 묶는 것은 검토만 했다(§9, `PRICE_PROOF_PRODUCER` 문서) — OPEN_DART 키를 price-proof 에도 넘겨야 하고 KIND 는 0.4초 간격 스크래핑이라 20분 상한을 다시 재야 한다.

### 연구 준비도 재판정 (최신 자료)

봉인 판단일 4(9/11 · 9/14 · 9/15 · 9/16) · 출처가 붙은 판단일 **1**(9/16) · 사전등록 최소 조건 **익은 판단일 20일**.
→ 경계 점수 오답 · 높은 확신 오답 · HOLD 큰 움직임 · SELL 뒤 급등 · FLOW 추가 가치 **전부 「아직 대기」**.
FLOW 6-arm 정의는 소유자 검토 대기(`NOT_READY`). Production 공식 변경 0.

### 검증

`test_corporate_action_evidence`(+5) · `test_kind_market_action_collect`(+2) · `test_price_proof_producer`(+6) · `test_workflow_size`(+7) ·
`test_price_provenance`(시각 의존 시험 1건 정정). `gaeo_check.py premerge` 전부 통과. 과거 원장·09:35 원본 수정 0.

### 하지 않은 것

새 cron·schedule 0 · 새 Claude Routine 0 · GPT/Codex 자동개발 0 · 런타임 LLM 0 · 유료 API 0 · Team PAPER 0 ·
BUY/HOLD/SELL 공식·가중치·임계값·Promotion Floor·사전등록 변경 0 · 과거 7,200건·09:35 600건 수정 0 · force push 0.

---

## 2026-09-16 아침 — 공식 결과가격 증명 생산자: 판단 하나가 채점까지 가는 마지막 사슬 (PHASE 4)

전체 내용: `docs/operations/PRICE_PROOF_PRODUCER_20260916.md`

### 한 줄

봉인 판단이 **당시 가격 근거 → 5거래일 뒤 공식 결과가격(KRX Open API 원문) → 기업행사 확인 → comparable →
기존 evaluate/score_call → outcome 저장 → 되읽기**까지 가는 길을 코드로 열고 합성 자료로 한 번 통과시켰다.
**실제 Production 은 Actions Secret `KRX_OPENAPI_AUTH_KEY` 하나가 있어야 열린다**(OWNER_ACTION_REQUIRED).

### 만든 것

`krx_openapi_client.py`(공식 API 호출·구조 검증·원문 보존) · `price_proof_planner.py`(due-record planner) ·
`collect_price_proof.py`(생산자, 상태 파일 `gaeo_coverage/price_proof_status.json`) · `.github/workflows/price-proof.yml`
(`workflow_dispatch` 전용) · `test_price_proof_producer.py`(35건). `comparison_evidence.OFFICIAL_HOSTS` 에 KRX Open API
서비스 호스트 `data-dbg.krx.co.kr` 추가(검사 조건 변경 0). 성적표 readiness 에 생산자 관점 덧붙임. ops_status 상세 한 줄.

### 상태 구분

| 단계 | 상태 |
|---|---|
| 공식 응답 계약·파서·저장·hash 연결·증명 생성기·planner | `IMPLEMENTED_AND_TESTED` (합성) |
| 정상 전체 사슬 1건(판단→증명→comparable→채점→저장→되읽기) | `PASSED_SYNTHETIC` |
| 고의 파괴 12건 | 전부 FAIL 확인 후 복구 |
| 실제 공식 결과가격 확보 | **`BLOCKED_PRICE_SOURCE`** — 인증키 없음(`KRX_OPENAPI_AUTH_KEY_MISSING`) |
| 실제 판단 채점 | 0건 — 봉인 1,800건은 전부 `MISSING_PROVENANCE`(과거), 신규 판단은 결과일(5거래일) 전 |
| PHASE 3 자연 실행 확인 | 아래 별도 절 |

### 하지 않은 것

새 cron 0 · 새 Claude Routine 0 · GPT/Codex 자동개발 연결 0 · 런타임 LLM 0 · 유료 API 0 · 채점 공식/임계값/가중치/사전등록 상수 변경 0 ·
과거 원장 변경 0 · 완료 outcome 변경 0 · 조정계수 계산 0 · Team PAPER/Private/Gateway 변경 0.

---

## 2026-09-15 밤 — 가격 출처 원장: 실제 수집 → 관측시각 보존 → 신규 판단 연결 (PHASE 3)

소유자 확정 설계 **(b) 별도 출처 파일 방식**. 전체 내용: `docs/operations/PRICE_PROVENANCE_20260915.md`

### 한 줄

시세 수집기가 **가격 응답을 받은 그 순간**을 종목마다 적고, 그 기록이 **같은 회차의 판단에만**
붙는다. 어긋나면 사유와 함께 연결을 거부한다. **공식 가격증명(KRX)은 여전히 별개로 남아 있다.**

### 만든 것

| 파일 | 역할 |
|---|---|
| `price_provenance.py` (신규) | 스키마 · 회차 식별자(`roundId`/`snapshotId`) · 연결/거부 규칙 |
| `price_provenance.json` (신규 산출물) | 한 회차의 종목별 가격 출처. `data.js` 와 같은 주기 |
| `update_prices.py` | 이미 받은 응답으로 출처 생성. **추가 시세 API 호출 0회** |
| `compute_indicators.py` | 지금 읽은 `data.js` 와 출처가 같은 입력인지 확인 |
| `analyze_auto.py` | 판단 산출물에 `priceSnapshotId` 한 칸 추가 |
| `decision_records.py` | 봉인 기록에 `priceObservedAt` + `priceProvenance` 채움 |
| `test_price_provenance.py` (신규) | §11 18개 시험 + 어휘 위장 방지 + 러너 배선 계약 (41건) |

### 상태 구분 (섞지 않는다)

| 단계 | 상태 |
|---|---|
| A. 가격 관측 사실 보존 | `IMPLEMENTED_AND_TESTED` |
| B. 신규 판단 원장 연결 | `IMPLEMENTED_AND_TESTED` (합성 자료) |
| C. 공식 가격 비교 조건 충족 | **미충족** — `_price_proof` 9줄 중 8줄이 KRX 증명 문서를 요구 |
| 실제 자동 실행 확인 | **`WAITING_NATURAL_RUN`** — 장 마감 뒤 작업(KST 23:3x). 다음 평일 09:00 KST 수집부터 |
| 결과 채점 / 성능 개선 입증 | 아직 아님 |

### 검증

* `python3 -m unittest test_price_provenance -q` → 41건 통과
* **가드 9개를 하나씩 고의로 깨뜨려** 검사가 실제로 잡는지 확인 후 원상복구 — 9/9 잡음.
  (가격 일치 · 회차 일치 · 다른 회차 차단 · 이전 값에 새 시각 금지 · 판단 이후 관측 거부 ·
  가격 시각 밀림 · 출처 파일 변조(`roundId`) · 러너 동기화 배선 · 저장 마감검사 소유권)
  첫 시도에서 1개를 못 잡아 **시험을 고쳤다** — 두 회차가 같은 초에 끝나 구분이 안 됐다 →
  회차 시계를 고정하도록 수정.
* 과거 봉인 원본 **바이트 해시 불변** 검사 통과. 7,200행 소급 수리 없음.
* 동일 입력 판단 결과 불변(판단 필드 18개 비교) 통과.

### 러너 배선 (이걸 놓치면 기능이 조용히 죽는다)

`update-analysis.yml` 은 매 사이클 `data.js` 만 원격 최신본으로 덮고 있었다. 출처 파일을
같이 안 덮으면 회차가 어긋나 **모든 판단이 '확인 불가'** 가 된다. 두 워크플로의 입력
재동기화를 공용 함수 `sync_inputs()`(`.github/scripts/gaeo-chain.sh`)로 합쳐 함께 받게 했다.
받아온 뒤 **돌려주는 것도** 같이 넣었다 — 분석 잡이 출처 파일을 `HEAD` 로 되돌리지 않으면
매 사이클 '더러운 파일'로 남아 `verify_save_closure.py` 가 **커밋 전체를 생략**시킨다
(그 스크립트가 막으려던 PR #564 계열 사고를 그 스크립트가 일으키는 모양).
덕분에 `update-analysis.yml` 큰 `run:` 블록 여유가 **204B → 667B** 로 늘었다.

### 실측 용량 (600종목)

회차당 gzip 순증 **14.2KB** → 하루(≈14회차) 약 **198KB** → 20거래일 약 **3.9MB**.
(현재 `originals/` 전체 719KB, 저장소 `.git` 2.8GB)

### 하지 않은 것

새 cron 0 · 새 Claude Routine 0 · 새 자동개발 연결 0 · 런타임 LLM 0 · 새 유료 API 0 ·
Team PAPER 재활성화 0 · Production 투자 산식 변경 0 · 과거 원장 수정 0 · force push 0 ·
실제 시세 API 추가 호출 0.

---

## 2026-09-15 밤 — 수집기가 「손도 못 댄 것」을 실패로 세던 결함 (PHASE 2 / PR C)

지시서 §6 이 짚은 곳을 실제로 확인했더니 **두 가지가 재현됐다.**

### 결함 1 — KIND 수집기의 KeyError (`collect_kind_market_action.py`)

```python
for ticker in todo:              # ← 계획한 전체
    error = evidence[ticker]...  # ← 예산이 떨어져 break 한 뒤의 종목은 항목이 없다
```

수집 루프는 `budget['left'] <= 0` 이면 `break` 한다. 그 뒤 집계 루프가 `todo` **전체**를
돌며 `evidence[ticker]` 를 직접 인덱싱한다. 첫 회차처럼 이월 기록이 없으면 **KeyError 로
죽고**, 이월 기록이 있으면 **지난 회차의 실패를 이번 회차 실패로** 센다.

### 결함 2 — 두 수집기 모두 미처리를 실패로 셌다

```python
summary['failed'] = len(todo) - len(done)   # 시도도 못 한 종목이 실패가 된다
```

`collect_kind_market_action.py` · `collect_corporate_action_evidence.py` 둘 다 같았다.
예산이 떨어져 **손도 못 댄** 종목이 전부 「실패」로 집계된다. 그러면 로그만 보고
"수집기가 망가졌다" 고 오해하게 되고, 진짜 실패율을 알 수 없다.

### 수리

`round_summary(todo, attempted, done, evidence)` 를 만들어 **이번 회차에 실제로 시도한
것만** 분모로 쓴다. 못 댄 것은 `notProcessed` + `notProcessedReason:
budget_exhausted_before_attempt` 로 **따로** 남긴다 — 0건·성공·단순 실패로 뭉개지 않는다.

실측 재현(예산이 2번째에서 소진, todo 5종목):
| | 수리 전 | 수리 후 |
|---|---|---|
| failed | **4** (미처리 3건 포함) | **1** |
| notProcessed | 없음 | **3** (`budget_exhausted_before_attempt`) |
| failureReasons | 지난 회차 실패까지 포함 | 이번 회차 시도분만 |

⚠️ **공용 계약 보존**: 저장되는 산출물(`kind_market_action_evidence.json`)의 기존 필드
`attempted`(=계획 수)의 뜻은 **그대로 두고**, `processed`·`notProcessed` 를 **덧붙이기만**
했다. Private 도 읽는 공용 출력이라 기존 필드의 의미를 바꾸지 않는다.

검사 `test_kind_market_action_collect.BudgetExhaustionAccounting` 5건.

### 이번에도 하지 않은 것

**새 cron·schedule 추가 0.** 수집 주기 문제(TTL 20시간 대비 예약 0회)는 여전히 남아 있고,
Actions 무료 한도 계산이 먼저다. 이번 수리는 **돌았을 때 정직하게 세는 것**까지다.

## 2026-09-15 밤 — 채점이 왜 한 건도 안 되는지 역추적 (PHASE 2 / PR B)

### 결론부터 — 막고 있는 것은 KRX 접근 권한이 아니다

`comparison_evidence._price_proof()` 를 역추적한 결과, **봉인 원장 7,200행 전부가
구조적으로 `comparable` 이 될 수 없다.** 이유는 외부 자료가 아니라 **우리가 저장하지 않은 것**이다.

```
전체 봉인 원본 7,200행 → priceObservedAt 있음 0건 (0.0%) · null 7,200건 (100%)
priceBasis 전부 {"verified": false, "reason": "price_basis_unverified"}
comparisonState: unknown 1,800 · comparable 0
```

`_price_proof` 는 **`record.priceObservedAt` 이 있고, `decisionAt` 이전이며, 그 KST 날짜가
판단일과 같을 것**을 요구한다. `None` 이면 `not original_at` → `price_evidence_invalid`.
가격 시계열·조정계수·기업행사 증거를 아무리 완벽히 갖춰도 **이 조건을 먼저 넘지 못한다.**

생산자 쪽 공백이다: `data.js` 종목 객체에 관측시각 필드가 없고(전역 라벨
`"2026-09-15 종가 (16:00 수집) · ⚠️ 1종목 지연"` 만 있다), `auto_analysis.js` 도 담지 않는다.
`decision_records.make_record` 는 `stock.get('priceObservedAt')` 를 읽지만 늘 `None` 을 받는다.
그 파일 주석이 이미 **일부러** 라벨에서 시각을 추측하지 않는다고 적어 뒀다 —
`# never infer a price-observation minute from a label`. **그 판단은 옳다.**

전체 역추적과 9개 요구조건 표는 `docs/operations/PRICE_PROOF_BLOCKER_20260915.md`.

### 흔한 추측 네 가지가 전부 틀렸다

| 추측 | 실측 |
|---|---|
| KRX API 권한이 없어서 막혔다 | **아니다** — 이 조건은 외부 자료와 무관하다 |
| 기업행사(DART·KIND) 증거를 채우면 채점이 시작된다 | **아니다** — 그건 C 칸이고 가격 근거는 B 칸이다 |
| 5거래일이 지나면 채점된다 | **아니다** — 결과 미도래(A)가 풀려도 B 가 남는다 |
| 과거 기록을 소급해 채우면 된다 | **하면 안 된다** — 판단 당시 없던 정보를 그때 알던 것처럼 넣는 것이다 |

### 이번에 만든 것 — 「기다리는 것」과 「못 하는 것」을 가른다

`real_outcome_scorecard.py` 에 `readiness` 추가(§7 다섯 칸):
A 결과 미도래 · B 가격 근거 부족 · C 기업행사 근거 부족 · D 채점 가능 · E 채점+main 되읽기 확인.

⚠️ **모르는 사유를 정상 대기로 세지 않는다**(`UNCLASSIFIED`). 새 사유가 생겼을 때 그것이
"기다리는 중" 으로 둔갑하는 것을 막는다. 채점만 되고 main 되읽기가 없으면 E 가 아니라 D 다.

오늘 실측: **A 1,800건 · comparable 0건.** A 가 풀리는 첫날(2026-09-18 전후)에 **B 가 드러난다.**

### 구현하지 않은 것과 그 이유

생산자 수리(종목별 관측시각 기록)는 **넣지 않았다.** `data.js` 는 공개 화면과 Private 도 읽는
**공용 출력**이라 필드 추가는 공용 계약 영향 확인이 먼저고, 어느 방식이든 **실제 수집 러너가
한 번 돌아야** 검증된다. 지금은 장 마감 후라 수집기가 돌지 않는다. 코드만 넣고 실제 실행을
못 본 채 "자료 공급을 고쳤다" 고 보고하지 않기 위해 다음 작업으로 넘긴다.

**OWNER_DECISION_REQUIRED 하나** — 종목별 가격 관측시각을 어디에 저장할 것인가:
(a) `data.js` 종목 객체에 필드 추가(경로 짧음 · 공용 스키마 변경) vs
(b) 별도 출처 파일(`research_archive/decisions/price_provenance/`)(공용 출력 무변경 · 연결 한 단계 추가).
이것만 정해지면 나머지는 기계적이다.

## 2026-09-15 저녁 — 잘못된 비교검사 수리 + 성적표 설명 정정 (PHASE 2 / PR A)

### 고친 것 1 — DIANA 비교검사가 오늘 파일을 오늘 파일과 비교했다

17:41 시험은 `movePct` 전부 **0.00% · OK** 를 냈는데, 그 비교 기준이 기준시각
(9/15 00:00 KST)을 16시간 넘긴 **당일 커밋**(`deef3f11c8`, 16:34)이었다. 그 파일의
`generatedAt` 은 현재 파일과 똑같은 `2026-09-15 16:32` 다. 숫자는 틀리지 않았지만
**하루 이동폭을 전혀 재지 못한 답**이었다.

원인 둘:
1. `previous_version_api` 가 `until=2026-09-15T00:00:00+09:00` 을 질의문자열에 **날것으로**
   붙였다. 질의문자열에서 `+` 는 공백으로 읽히므로 기준시각이 깨진다.
2. 더 근본적으로, **어느 경로로 받았든 반환된 자료의 시각을 다시 재지 않았다** —
   API 가 돌려줬다는 사실을 적격의 근거로 삼았다.

수리: `until` 을 같은 순간의 UTC(Z)로 바꾸고 `urlencode` 로 싣는다 + `previous_eligibility()`
가 커밋시각·생성시각을 **다시 잰다**(fail closed) + git·API 두 후보 중 적격한 쪽을 고르고
거부 사유를 `rejectedCandidates` 에 남긴다 + 부적격이면 OK 가 아니라 기존
`UNKNOWN_PREVIOUS` 와 구체적 사유로 보고한다.

**수리된 도구로 다시 재니 DIANA 하루 이동 +0.73%** (기준 ±1.5% 안). taro +0.29% ·
nova +0.15% · flow −0.72%. 즉 **원래 확인하려던 것은 통과했고, 잘못된 것은 비교 방법이었다.**

⚠️ 임계값(1.5%/5.0%)·산식·사전비중은 **변경 0**. 원본 원장(`20260915T174153.json`)은
**덮어쓰지 않았고**, 별도 감사 기록
`docs/audits/validation_runs/corrections/VS-20260915-DIANA-SHRINKAGE-CHECK.correction-01.json`
에 원래 실행 ID·문제·수정본·새 근거를 연결했다. 사전등록 효과평가 조기 실행 0.

검사 `test_validation_checks.PreviousVersionEligibility` 13건. 가드를 일부러 무력화하니
8건이 실제로 FAIL 하는 것까지 확인하고 원상복구했다.

### 고친 것 2 — 성적표가 임의의 50%로 실력을 판정했다

`real_outcome_scorecard.py` 가 전체 적중률 95% 구간이 50%를 걸치면 **「동전 던지기와
구분되지 않는다」** 고 단정했다. 그런데 그 분모에는 BUY·HOLD·SELL 이 섞여 있고 셋의 적중
정의가 다르다(BUY `ret>+1` · SELL `ret<−1` · HOLD `|ret|≤5`). 특히 **HOLD 가 판단의 72%**
를 차지하는데 "크게 안 움직이면 적중" 이라 기준선 자체가 50% 가 아니다.

이제 **구간의 위치라는 사실만** 말하고, 「50%는 이 성적의 기준선이 아니다(비교 기준선
미등록)」를 함께 붙인다. 적중률·신뢰구간 **숫자와 계산은 그대로**다. 유리한 기준선을
결과를 보고 고르지 않기 위해 기준선은 등록으로만 생긴다(`BASELINE_NOT_REGISTERED`).

`MEASURED` 의 뜻도 코드에 박았다 — **"기준에 따라 측정값을 보여줄 수 있다"이지
"돈을 벌게 하는 실력이 입증됐다"가 아니다.**

### 고친 것 3 — 미래에 틀리게 되는 고정 문장

「봉인 원본은 아직 한 건도 채점되지 않았다」·「60D 는 0건」·「비용 가정이 등록되지 않았다」를
**오늘의 값에서 만들도록** 바꿨다. 없는 horizon(`NOT_APPLICABLE`)과 결과를 기다리는
horizon(`PENDING_NOT_MATURED`)과 표본 부족(`INSUFFICIENT_EVIDENCE`)을 서로 다른 문장으로
구분한다. 비용은 **등록(`registered`)과 실제 적용(`appliedInCalculation`)을 분리** —
등록만으로 순수익 표시를 켜지 않는다.

### 고친 것 4 — 내가 쓴 해석이 틀렸다 (`avgRet5Pct`)

`DATA_GAP_FINDINGS_20260915.md` 에서 확신 높은 오판의 `+8.74%` 를 **「한 건당 손실」**
이라고 적었다. 틀렸다. `failure_miner.py:33` 기준 이 값은 그 군집 종목들의 **5거래일
수익률 평균(부호 포함)** 이다. 부호가 +라는 것은 그 종목들이 **올랐다**는 뜻이고,
SELL·HOLD 오판이면 계좌 손실이 아니라 **놓친 상승**이다. 군집의 방향별 구성은 기록에
없어 **미측정**으로 남겼다. 채점 결과·숫자·순위는 바꾸지 않고 해석·문구만 정정했으며,
무엇이 왜 틀렸는지를 그 문서 §1-2 에 남겼다.

## 2026-09-15 성능 최우선 기반 — 북극성 · 실제 성적표 한 장 · 침묵하던 데이터 공백

소유자 지시 「PERFORMANCE FIRST FOUNDATION」. **새 자동개발 체계를 만드는 작업이 아니다.**
목적을 저장소에 고정하고, 성적을 공정하게 말할 근거를 한 곳에 모으고, 판단 품질을 깎는
실제 공백을 찾아 **말하게** 만드는 것까지다.

### 한 줄 결론

**지금 GAEO 성적은 "아직 말할 수 없다"가 정답이다.** 지금 쓰는 모델
(`base-2026-08-15-parity-hotfix`)의 판단일이 **17일**로 공개 기준 20일에 3일 모자란다.
옛 모델(`PRE_HOTFIX_BASE`, 500종목)은 33일치가 있지만 전체 적중률 **51.0%**,
95% 구간 **45.4~57.4%** 로 **동전 던지기와 구분되지 않는다**. `python3 real_outcome_scorecard.py`.

### 무엇을 만들었나

| 무엇 | 왜 | 새 계산기인가 |
|---|---|---|
| `docs/operations/GAEO_NORTH_STAR.md` | 목적(판단의 질)·제약(정직·원본불변·비용0·실주문0)·수단(운영·화면·성장)의 순서를 고정. "파이프라인 초록불 = 성적 좋음"이 아님을 못박음 | — |
| `real_outcome_scorecard.py` + 계약 검사 21건 | 숫자는 이미 있었는데 **흩어져** 있어 아무도 한 문장으로 답하지 못했다. **기존 채점기를 불러 모으기만 한다 — 채점 공식 0줄** | **아니다(의도)** |
| `config/scorecard_cost_assumption.json` | 판단 성적표용 거래비용 가정이 **등록돼 있지 않다**. 임의로 빼지 않고 `COST_ASSUMPTION_NOT_REGISTERED` 로 표시. 소유자 결정 4건 대기 | — |
| `ops_status.check_comparison_evidence()` + 검사 9건 | **이번 작업에서 실제로 고친 결함** → 아래 | — |
| `docs/operations/DATA_GAP_FINDINGS_20260915.md` | 실패 유형 7종 순위 + 기업행사 UNKNOWN 원인 A~G 실측 | — |
| `docs/FLOW_6ARM_PREREGISTRATION_DRAFT.md` | 정의 4건 제안. **OWNER REVIEW REQUIRED — 등록 아님** | — |

### 실제로 고친 결함 — 초록불이 "확인했다"가 아니라 "아무도 안 봤다"였다

`ops_status.py` 에 기업행사·시장조치 증거를 보는 점검이 **아예 없었다.** 그래서 증거가
전량 만료돼 판단 1,800건이 전부 채점 불가인데도 통합 상태는 계속 초록불이었다.

실측(9/15): DART 120종목·KIND 80종목 **유효 0 / 만료 200**, 마지막 수집 2026-09-12,
`comparisonState` **unknown 1,800 · comparable 0**. 원인은 두 수집 워크플로가
`on: workflow_dispatch:` 단독이라는 것 — **소비자(`update-analysis.yml`)는 장중 30분마다
돌고 생산자는 사람이 눌러야만 돈다.**

이제 `DATA_INSUFFICIENT · COMPARISON_EVIDENCE_EXPIRED` 로 유효·만료 건수, 막힌 판단 수,
예약 없는 워크플로 이름까지 말한다. **장애로는 적지 않는다** — 수집기는 성공했고 갱신이
예약 안 됐을 뿐이다(교훈 ③ 모른다를 괜찮다로 바꾸지 마라 · ④ 모른다를 고장으로 바꾸지도 마라).

### 고칠 수 있어 보였지만 고치지 않은 것

조사에서 "`추가상장`·`상장안내` 를 KIND 분류표의 `LISTING` 에 넣으면 UNKNOWN 21건 중
14건이 사라진다"는 제안이 나왔다. **코드를 끝까지 읽고 기각했다** — `LISTING` 은
`DURATION_PERSISTENT`(해제 문구가 나올 때까지 연다)인데 `추가상장` 은 해제 문구가 원래
나오지 않는 하루짜리 안내라, 옮기면 그 종목이 **영원히 막힌다**. 2026-09-11 에 이미 고친
'배당락 안내가 1년 내내 열린 조치로 남던' 결함과 같은 모양이다. 기존 분류가 더 안전했다.
경위는 `DATA_GAP_FINDINGS_20260915.md` §2-2.

### 건드리지 않은 것

산식·가중치·임계값·사전등록 상수 **0** · 새 cron·schedule·Routine **0** · 새 유료 API·서버 **0** ·
과거 판단·원장 수정 **0** · 실주문·계좌 **0** · Team PAPER 는 `RETIRED` 유지.
이번 작업이 바꾼 실행 동작은 `ops_status` 가 **한 줄 더 보고하는 것**뿐이다.

### 남은 것 (소유자 결정 · 관찰 대기)

1. **거래비용 가정 등록** — `config/scorecard_cost_assumption.json` 의 결정 4건(진입가·회전·SELL 처리·슬리피지)
2. **FLOW 6-arm 정의 확정** — 표본 예상 충족일 **2026-09-30 전에** 정해야 사전등록이 된다
3. **기업행사 증거 갱신 주기** — 예약 추가는 이번 범위 밖(§11). Actions 무료 한도 계산이 먼저
4. **판단일 20일 도달** — 3일 남았다. 그때 성적표가 처음으로 숫자를 낸다

## 2026-09-15 모의투자(PAPER) 은퇴 — 삭제가 아니라 스위치

소유자 결정: **개오 애널리스트팀(Team)의 모의투자를 접는다. 모의투자는 PRIVATE 사이트에서만 계속한다.**
사유는 2026-09-12 `ORACLE_PAPER_MIGRATION_DECISION.md`(판정 C)가 이미 밝힌 차단 1번이다 —
토스는 **client 당 유효 토큰이 1개**이고 Team 과 Private Gateway 가 같은 자격증명을 쓴다.
Team 이 토큰을 발급하면 Private 이 즉시 끊긴다. 옮기든 안 옮기든 Team 이 모의투자를 하는 한
그 충돌은 사라지지 않으므로 Team 쪽을 접었다. 그 문서의 **결론만 초과(superseded)** 됐고
조사 내용·근거는 그대로 유효하다.

- ⚠️ **착수 전 실측**: 이 결정은 저장소 **어디에도 기록돼 있지 않았다.** "기타" 절 없음 · 삭제 커밋
  모든 브랜치 0건 · "모의투자 삭제/폐지/종료" 문구 0건. 반면 코드·워크플로·원장·알림은 전부 살아 있었고
  `ops_status` 는 매 점검마다 PAPER 를 **장애**로 보고했으며 Issue #567 이 매일 자동 갱신되고 있었다.
  즉 결정은 사람 머릿속에만 있었고 기계는 계속 "고장났다"고 외치는 상태였다. **먼저 적어두는 것**이
  이 작업의 1순위였던 이유다.
- **멈춘 것**: 매매 계산 · 원장 신규 기록 · 러너 push · **토스 토큰 요청** · 거래일 미실행 알림 이슈 ·
  주간 Evidence 보고 이슈.
  방식은 기존 단일 기록자 스위치 하나다 — `paper_runner_config.json` 의 `activeRunner` 를 `RETIRED` 로.
  `paper_single_writer` 가 **모든** 러너를 거부한다(fail closed). 집 PC 스케줄러가 켜져 있어도 원장은 안 쓴다.
  새 메커니즘을 만들지 않았고, 사람이 커밋해야만 되돌아간다(러너는 이 파일을 커밋할 수 없다).
- **그대로 둔 것**: `paper_trading/` 원장 전체(1.7 MB) · 워크플로 파일 3개 · 원장 보호/단일 기록자 계약 테스트 ·
  **`ops_status` 감시**. 기존 금지선에 "PAPER 원장"이 명시돼 있다 — 지우거나 재작성하지 않았다.
  마지막 회차는 `2026-09-11T15:05:09+09:00` 그대로 읽힌다.
- ⭐ **감시를 끄지 않은 이유**: 지워 버리면 꺼두지 않은 러너가 은퇴 뒤에 몰래 원장을 다시 써도 아무도 모른다.
  새 어휘 `RETIRED`(은퇴, 기록 보존)를 추가했다 — **정상도 장애도 확인 불가도 아니다.** `OK` 로 적으면
  "잘 돌고 있다"로, `FAULT` 로 적으면 "고쳐야 한다"로 잘못 읽힌다. 종료코드에 장애로 세지 않는다.
  은퇴 날짜 뒤에 새 회차가 생기면 `FAULT PAPER_WROTE_AFTER_RETIREMENT`.
  은퇴 날짜를 못 읽으면 여전히 `RETIRED` 이되 "신규 기록 감시는 못 한다"고 상세에 밝힌다.
- **검증**: `test_ops_status.Verdicts` 4건 신규(은퇴≠장애≠확인불가 · 은퇴 뒤 기록=장애 · 날짜 못 읽으면 밝힘 ·
  되돌리면 예전 판정 복귀) · `test_paper_single_writer` 3a-1~3a-5 신규. 두 가드를 각각 일부러 깨뜨려
  실제로 FAIL 하는 것까지 확인 후 원상복구(`'RETIRED' != 'FAULT'`, `'OK' != 'RETIRED'`).
- **사람이 할 일 1건**: 집 Windows PC 작업 스케줄러 「GAEO Paper Trading」 해제.
  게이트가 막고 있어 원장은 안 쓰지만 매 사이클 헛돌며 로그만 쌓인다. → `docs/operations/HOME_PC_CHECKLIST.md`

## 2026-09-15 AI-0 후속 — 자연 실행 실증 · 실행 신원/main 되읽기 · 끊긴 연구 자격 연결부

바로 아래 2026-09-14 기록의 후속이다. 그날 "아직 실증 안 됨"으로 남긴 항목 중 **하나가 실제 증거로 바뀌었고**,
나머지 하나는 그대로다. 오래된 문구를 그대로 두지 않기 위해 아래에 무엇이 바뀌고 무엇이 안 바뀌었는지 분리해 적는다.

- ⭐ **`ops-daily` 자연 예약 실행이 실증됐다 (PENDING_NATURAL_RUN → NATURAL_RUN_SUCCESS).** 이 세션은 **아무것도 dispatch 하지 않았다.**
  GitHub run 사실로 확인: run `34858114587`(event=`schedule`, head `76e5727e67`, 2026-09-14 23:49 KST, success) → run `34860513624`(event=`schedule`, head `c51f42e47a`, 2026-09-15 00:11 KST, success).
  앞 run 이 `executionReceipt`(runId·runAttempt·headSha·workflowRef·stateHash)를 main 에 저장했고, **다음 자연 run 이 그걸 main 에서 다시 읽어 대조해** `docs/operations/repair_requests/performance_orchestrator.json` 의 `naturalRunAcceptance` 를 `NATURAL_RUN_SUCCESS`(runId `34858114587`, `sameRunArtifactVerified: true`)로 기록했다 — 사람이 끼어들지 않고 사슬이 스스로 닫혔다.
  이 세션에서도 실제 run 사실을 넣어 `performance_orchestrator.verify_natural_run()` 을 독립적으로 다시 돌렸고 같은 결과였다(stateHash 재계산 일치).
  ⚠️ 범위 한정: 이것은 **`ops-daily` 한 워크플로**의 실증이다. 아래 9/14 기록의 `update-analysis.yml` 콜드스타트 항목은 **여전히 PENDING_NATURAL_RUN(미실증, 장애 아님)** 이고 이번에도 인위 재현을 하지 않았다.
- **판단 원본의 "실행 신원"과 "정말 main 에 들어갔나"를 따로 각인**(`decision_records.py`). 지금까지 status.json 은 "몇 건이 저장됐다"만 알았고, 그 회차를 만든 실행이 예약이었는지 수동이었는지, 그 원본이 main 트리에 실제로 들어갔는지는 어디에도 없었다.
  - `execution_identity()` — `GITHUB_EVENT_NAME`/`RUN_ID`/`RUN_ATTEMPT`/`SHA` + 회차 id + manifest sha256 을 `status.json.execution` 에 덧붙인다. **Actions 밖에서는 값을 지어내지 않고 `None`** 으로 둔다(수동 실행이 예약 실행으로 둔갑하지 않게).
  - `verify_saved_to_main()` (CLI `--verify-main`) — 회차 원본을 ref 트리에서 **다시 읽어** blob 대조한다. `MAIN_VERIFIED` / `NOT_IN_MAIN` / `UNVERIFIED` 세 값이고, 조회를 못 하면 정상도 장애도 아닌 `UNVERIFIED` 다. 판정은 본질적으로 사후라서(같은 run 안에서는 아직 커밋 전이 정상) `ops_status` 는 이 값을 **관찰로만** 싣고 component status 를 올리거나 내리지 않는다.
  - 실측: 2026-09-14 회차 `e1bb71a2b16d3d9d00154752`(1,200건) 의 `.jsonl.gz`·`.manifest.json` 둘 다 `origin/main` 트리에 존재 → `MAIN_VERIFIED`.
- 🐛 **끊겨 있던 연결부 하나를 찾아 닫았다 — 연구 자격이 영원히 열리지 않는 버그.** `evaluation.split_research_eval()` 이 데이터가 **충분할 때**의 note 에만 `uniqueDays`/`requiredDays` 를 빠뜨렸고, `performance_orchestrator.research_focus()` 는 그 값을 `0` 으로 읽어 `0 >= 30` 비교에서 항상 탈락시켰다. 즉 판단일이 30일을 넘겨도 상태는 영원히 `WAITING_EVIDENCE` 였다. 사실값(집계된 날 수)일 뿐 임계값이 아니므로 양쪽 note 에 똑같이 담는 것으로 고쳤다 — **문턱·가중치·산식은 한 글자도 바꾸지 않았다.**
  오늘 시점의 `WAITING_EVIDENCE` 자체는 **옳다**(main 실측 `observedDecisionDays: 20` < `requiredDecisionDays: 30`). 이 버그는 아직 잘못 보고한 적이 없는 **잠복 결함**이었고, 30일에 도달하는 순간 드러날 예정이었다.
- **사슬 전체를 한 번에 재는 시험**(`test_gaeo_evolution.ChallengerChainTest`, 신규 4건). 부품별 시험은 이미 있었지만 **이어 붙인 자리**를 재는 시험이 없었다(그래서 위 버그가 1,500여 건을 다 통과했다). 합성 데이터로 `성숙 판단일 → 연구/평가 분리 → Failure Mining(최소지지 8행·5일) → 연구 자격 → 결정론 후보 → Cheap Filter → Registry 등록 → Shadow 원장 → Promotion Gate` 를 끝까지 통과시키고, **근거가 부족하면 후보가 0개인 것**도 같이 고정했다. offline 성적이 아무리 좋아도 gate 는 `BOOTSTRAP_SHADOW` 를 내놓는다(실전 Shadow 실측 없이 승격 불가) — 이것도 시험에 박아뒀다.
- **고의 고장 시험 지도**를 `docs/HARNESS.md` §5-1 에 표로 남겼다(16가지 고장 ↔ 지키는 검사 ↔ 나와야 하는 판정). 전수 대조 결과 **진짜로 비어 있던 칸은 1개**였고 그것만 채웠다: 예약 실행 증거 없이 로컬 산출물만 말끔할 때 `check_evolution_liveness()` 가 `UNKNOWN(EVOLUTION_LOCAL_EVIDENCE_ONLY)` 로 남는 경로에 시험이 없었다(`test_performance_orchestrator.Liveness` 에 추가). 나머지 15칸은 이미 있는 시험으로 덮여 있어 **중복 작성하지 않았다.**
  새 시험 3건은 각각 **핵심 가드를 일부러 깨뜨려 실제로 FAIL 하는 것까지 확인한 뒤 원상복구**했다(`'WAITING_EVIDENCE' != 'ACTIONABLE'`, `'OK' != 'UNKNOWN'`).
- **현재 실측 상태**(`ops_status.py`, 2026-09-15 09:00 KST 기준): 정상 4 · 정상 대기 4 · **장애 1** · 확인 불가 1.
  - 장애 1건은 **모의투자(PAPER)** 다 — 2026-09-14 거래일 회차 0건, 마지막 회차 09-11 15:05, 활성 러너 `WINDOWS`(집 PC). 이번 작업 범위 밖이며 손대지 않았다. 조치는 `docs/operations/HOME_PC_CHECKLIST.md`.
  - 확인 불가 1건은 위에 적은 `EVOLUTION_LOCAL_EVIDENCE_ONLY`(토큰 없이 돌면 예약 실행 여부를 못 읽는다) — 정상이라는 뜻이 아니고, 장애라는 뜻도 아니다.
- **바꾸지 않은 것(명시)**: BUY/HOLD/SELL 공식 · Production 점수·가중치·임계값 · Promotion floor · Constitution 핵심 안전조건 · 실제 판단 원본 · PAPER 원장 · tickers.js · DART 과거 사실 · 사전등록 결과 — 전부 0건 변경. LLM 호출·유료 API 추가 0건. main Branch Protection 도 그대로(읽기 전용 검토만, 아래 9/14 항목의 제안 유지).

## 2026-09-14 AI-0 운영 사슬 증거 연결 (Champion/Challenger 조사 + SAVE_CLOSURE_FAILURE 일반화)

- 시작 main `253d1198d2`(PR #566, 같은 날 시황 발행 직후). 지시는 "새 투자 엔진을 만들지 말고 기존 Harness·Evolution·Champion/Challenger 사이 끊긴 연결만 닫아라"였다. 읽기 전용 조사원 2명을 먼저 보내 관련 문서·코드를 전수 확인했고, 중복 구축 없이 확인된 사실만 아래에 남긴다. 같은 시각 `codex/ai0-evidence-lifecycle-20260913`·`codex/ai0-performance-orchestration-20260913`·`codex/dart-shadow-evidence-20260913`·`codex/analysis-save-recovery-20260914` 등 비슷한 주제의 다른 세션 브랜치도 존재한다 — 아직 main에 없어 이번 조사·구현과는 겹치지 않았다.
- **#564 저장 사고**: `rebound_watch.js`가 저장 목록에서 빠져 `decision_records.safe_merge()`가 가격 병합을 계속 거부한 사고. 같은 날 다른 세션이 이미 그 파일을 목록에 추가해 고쳤다(commit `03822c70fb`, main에 병합됨, 전용 회귀 테스트 `test_decision_records.py::MergeEvidence`도 이미 있음). **이번에 한 일**: "그 파일 하나"가 아니라 **아직 이름도 모르는 미래의 새 생성물**이 같은 실수로 빠져도 잡히도록 일반화했다. 신규 `verify_save_closure.py`가 저장 목록 add가 끝난 직후 `git status`를 다시 검사해, 아직 지저분한 파일이 있으면 그게 (a) 다른 파이프라인 소유(`data.js`/`analysis.js`가 HEAD로 안 돌아간 경우)인지 (b) 저장 목록에 없거나 예상 밖 변경인지 구분해 알리고, 이번 사이클 커밋만 조용히 보류한다 — exit으로 죽이지 않아 chain() 재기동은 그대로 간다(2026-07-22 575분 무갱신 사고의 재발 방지 원칙을 그대로 따름). `update-analysis.yml`에는 호출 두 줄만 추가했다(그 run: 블록은 21,000바이트 한도에 여유가 361바이트뿐이라 로직은 전부 별도 .py로 뺐다 — 지금 남은 여유 204바이트, `test_workflow_size`가 계속 지킨다). 신규 `test_verify_save_closure.py`가 실제 워크플로 조각을 bash로 그대로 실행해 임의의 새 파일명으로 사고를 재현해서 잡히는 것과, 정상 사이클은 그대로 커밋되는 것을 둘 다 확인한다. `gaeo_check.py`의 `pipeline` 묶음에도 등록해 로컬 부분검사에서 빠지지 않게 했다(`test_gaeo_check.py` 자체 점검으로 확인).
- **"자연 실행"(예약이 저절로 돎) 판정**: `ops_status.py`의 `_judge_scheduled`와 `performance_orchestrator.verify_natural_run`은 이미 schedule 이벤트와 workflow_dispatch를 정확히 구분하는 코드가 있다 — 다만 대상이 각각 `pipeline-watchdog.yml`/`ops-daily.yml`/`evolution-lab.yml`, `ops-daily.yml`뿐이고 **`update-analysis.yml`은 원래 대상이 아니다.** 코드 주석을 실제로 읽어보니 이유가 있었다: `update-analysis.yml`은 "한 번 깨면 스스로 320분씩 자면서 계속 이어달리는 체인"으로 설계됐고, schedule cron 두 개(`1-31/3 0 * * 1-5`·`8,38 1-6 * * 1-5`)는 "체인이 완전히 죽었을 때만 쓰는 보험"이다. 이 워크플로에 그 두 판정을 그대로 얹으면 건강한 체인을 장애로 오판하기 쉽다(체인이 잘 돌 때 예비 schedule run은 GitHub 자체 동시성 규칙으로 매번 취소되는데, 그걸 "예약 실패"로 읽으면 안 된다). 실측: `#564` 병합 이후 관찰된 schedule 이벤트 run 2건(`34807012649`·`34812140150`) 모두 `cancelled` — 체인이 건강해서 밀린 것으로 보이지만, **"체인이 완전히 죽었을 때 이 보험이 실제로 콜드스타트에 성공하는지"는 아직 한 번도 실증되지 않았다.** 이번 작업에서는 이 워크플로를 억지로 `_judge_scheduled` 대상에 넣지 않았다(설계가 다른 것을 같은 잣대로 재면 새 오탐이 생긴다) — 대신 이 사실을 정직하게 남긴다: **PENDING_NATURAL_RUN(실증 안 됨, 장애 아님)**. 실제 파이프라인 건강 판정은 지금처럼 `pipeline_watchdog.py`의 산출물 신선도(시세 25분·자동분석 60분)가 계속 담당하며 이건 이미 정확하다. 다음에 체인이 실제로 완전히 멈추는 사고가 나면, 그때 이 백업망이 실제로 콜드스타트에 성공하는지를 로그로 확인해야 한다(인위적 재현이 어려워 이번엔 못 했다).
- **Champion/Challenger/Evolution 상태(확인만, 코드 변경 없음)**: 실제 파일을 직접 읽어 확인. Champion = `gaeo_evolution/production_config.json`의 `productionConfigVersion="base"`(override 없음), `analyze_auto.BASE_MODEL_VERSION="base-2026-08-15-parity-hotfix"`. Evolution `mode="BOOTSTRAP_SHADOW"`, `candidateGeneration`·`shadowSummaries`·`lastPromotion`·`lastRollback` 전부 0/빈값/null, `systemHealth="OK"`(Safe Mode 아님) — 실패가 아니라 실전 성숙 판단일이 15일뿐이라 정상적으로 기다리는 중이다(결정론 후보 연구 재개 기준 약 30판단일). Promotion Gate 문턱(`evolution_constitution.json`)도 손대지 않았다: 실전표본500·행동표본100·정밀도+1.5%p·Brier+0.005·커버리지15%·40거래일·국면3개·BUY/SELL각50건 등 그대로.
- **DART Forward 증거(확인만)**: `research_archive/decisions/dart_research/status.json`을 직접 읽음. PROTECTED_FORWARD 코호트 rawRows=600·completeWindowRows=597·confirmedAbsentRows=597·unknownRows=3·maturedRows=0·collectionReceipts=1·forwardRounds=1, `candidateCreated=false`·`accuracyImprovementProven=false`. 성숙한 판단일이 아직 1일뿐이라 5개 비교군 전부 `INSUFFICIENT_EVIDENCE`다 — 정상 대기이지 장애가 아니다.
- **main Branch Protection**: 실측 결과 여전히 `protected: false`. 이번 작업에서는 바꾸지 않았다(자동분석·시세 산출물이 main에 직접 commit되는 구조라 일반적인 보호를 바로 켜면 정상 자동화가 멈출 수 있음) — 제안만 남긴다: 사람 코드 변경은 PR+CI 필수로 하되 자동 생성 데이터 commit은 제한된 bypass를 허용하거나, 코드와 자동 생성 데이터의 저장 경로를 아예 분리하는 방향을 다음에 owner와 함께 검토할 것.
- **검증**: 관련 기존 회귀 스위트(`test_workflow_size`·`test_decision_records`·`test_ci_parity`·`test_workflow_branch_exec`·`test_ops_status`·`test_pipeline_watchdog`·`test_gaeo_evolution`·`test_dart_research`·`test_holiday_guard`·`test_validation_*`·`test_gaeo_check`) + 신규 `test_verify_save_closure` 전부 통과. 저장소 전체 `test_*.py` 1,500여 건 discover 실행도 전부 통과.
- **바꾸지 않은 것(명시)**: BUY/HOLD/SELL 공식·가중치·임계값·Promotion floor·Constitution 핵심 안전조건·실제 판단 원본·PAPER 원장·tickers.js·DART 과거 사실 — 전부 0건 변경. LLM·유료 API 추가 0건.
- **다음 확인 1가지**: `update-analysis.yml`의 schedule 백업망이 체인이 실제로 완전히 멈췄을 때 콜드스타트에 성공하는지는 여전히 미검증 — 다음 실제 사고 때 로그로 확인.

## 2026-09-13 600종목 시장지도

- `?m=marketmap` 전용 화면과 상단·전체 메뉴, 홈의 작은 요약을 연결했다. `market-map.js/css`는 기존 `tickers.js`·`data.js`를 읽는다. 홈에는 종목 칸을 만들지 않고 화면을 떠나면 600개 칸도 해제한다.
- 업종은 기존 GAEO 24개 분류, 가격은 기존 네이버 시세다. 시장 구분만 기존 `market_universe/full_market_latest.json.gz`에서 읽는다. 종목마다 동일 비중이며, 확인되지 않은 시가총액으로 크기를 추정하지 않는다. 지연·누락 시세는 중립색으로 표시하고 상승·하락·보합·업종 평균에서 제외한다.
- 시작 main `014efe5d`: 600종목, 상승217·하락356·보합26·자료확인1. 코스피411·코스닥188·시장미확인1(동양생명). 미확인 종목도 전체 화면에는 남기며 시장을 추측하지 않는다. 검색과 시장 전환은 메모리 안에서 처리한다.
- DART 자연 실행: `PENDING_NATURAL_RUN`. 9월13일 확인한 최근 schedule 목록에서 update-analysis는 #561 이전 9월11일 실행까지다. main의 DART 연구표는 collectionReceipts=0, forwardRounds=0, completeWindowRows=0, confirmedAbsentRows=0이다. push 연구 실행은 자연 실행으로 세지 않는다. DART·일정·전략 코드는 수정하지 않았다.
- 로컬 브라우저 주소는 실행 환경의 보안정책으로 차단됐다. 실제 자료 계약·디자인 계약 후 필수 CI를 거치며 화면 동작은 정상 Pages 배포에서 확인한다. Production 판단 산식·가중치·임계값·원본 자료는 변경하지 않는다.

## 2026-09-13 DART 당시 정보 가치 연구

- 시작 main `6fbcdddf` 기준으로 #559/#560 보존. 기존 DART 클라이언트·수집·암호화 저장·실연결·Evolution·AI-0 경로를 재사용한다. [절차와 경계](../DART_RESEARCH.md).
- 전날 공시의 완전 조회 증거와 같은 실행에서 생성된 실제 판단을 별도 불변 파일로 연결한다. 공개시각 불명·미래 확인·나중 정정·불완전 조회를 공시 없음으로 바꾸지 않는다. 고객 성적표·Production 공식은 변경하지 않는다.
- 현재 기존 연구 입력 11,980행·20판단일, 성숙 결과 8,970행·15판단일. 보호된 실제 판단은 600행·1일이지만 보호된 DART 증거는 아직 0일이다. 과거/보호된 비교표는 독립 분모이며, 실제 확인된 수치는 생성된 `research_archive/decisions/dart_research/status.json`을 따른다.
- 배포 시 기존 DART 점검 workflow가 기존 암호화 자료로 한 번 연구표를 갱신한다(API 추가 호출 0). 이는 push 실행이며 자연 예약 실행으로 기록하지 않는다. 이후 기존 분석·Evolution 경로가 갱신한다.
- ops-daily의 기존 cron 3개는 유지한다. 완료된 schedule run과 같은 runId·내용의 main 저장을 대조하도록 연결했다. 새 실행의 첫 증거가 없으면 PENDING_NATURAL_RUN이 정상이다.
- 연구 신호와 투자 정확도 개선은 별개다. 후보 spec·가중치·임계값·투표를 자동 생성하거나 변경하지 않는다. 다음 우선순위는 완전 조회를 보존한 보호된 판단일·성숙 결과·대응 비교군 축적이다.

## 2026-09-13 AI-0 성능 운영 연결

- 기준 main `9ddf31f0`(PR #558), #556/#558 보존. 직접 git fetch는 원격 연결 제한으로 완료되지 않았고 GitHub 연결 도구에서 최신 main SHA·파일 blob을 확인해 작업했다. [기능 분류·연결·정책](../PERFORMANCE_ORCHESTRATION.md).
- 기존 Harness/Evolution/Failure Miner/Watchdog를 재사용했다. 부족했던 보호 결과 기반 확신도·판단범위, 안정된 문제 ID와 우선순위·대기·해결 상태, 연구 필요 근거, 예약→종료→저장→평가 연결을 더했다. 관찰/운영 기록 외 전략 writer는 없다.
- 현재 실제 판단 600건·1판단일: BUY41/HOLD447/SELL112/판단보류0, 최신 회차 판단 가능100%. 보호 결과 평가0·미래대기600. 확신도 구간별 성공률은 기록 부족으로 표시한다. 기존 성적표의 다른 집계와 원본·평가 결과는 유지했다.
- 오늘 기존 Evolution 자연 예약 `34728435516` 성공, 평가 자료20판단일/연구 분리 필요30, 후보0/Shadow0/실험0, Safe Mode 없음. 현재는 자료 대기이며, 높은 확신 오답206건·15판단일은 기존 연구의 후속 검토 후보다. 실제 보호 성적으로 검증된 약점이라고 부르지 않는다.
- 다음 확인: 기존 ops-daily/Watchdog에서 새 코드의 자연 실행·상태 저장, 9월18일 이후 가격 비교 근거와 결과 성숙. 기존 실행 성공/코드 작성/검사/병합/배포/새 자연 실행/투자 정확도 개선은 각각 별도 사실이다.

## 2026-09-13 기업행사 가격 비교 안전장치

- 시작 기준 `origin/main=605fc91d`, PR #556 병합 후의 기존 판단 원본·결과·성적표를 그대로 사용했다. `comparison_evidence.py`가 DART/KIND 자료와 판단~결과일 가격 기준을 검증한 뒤 기존 채점기에 연결한다. 새 성적표·PAPER·Evolution·유료 API·수집 일정은 없다.
- 비교 가능 / 행사 조정 필요 / 자료 부족 / 충돌을 구분한다. 기간 전 조회·만료·실패·옛 DART 수집 범위·불명확한 적용일·원래 가격 시각·수정 여부는 정상 확인으로 바꾸지 않는다. 원문과 종목·시각·가격 자료가 연결되어야 보류를 해제한다.
- 나중에 확보한 공식 가격·행사 본문은 별도 불변 근거로 붙인다. DART/KIND 중복 후보는 하나의 미확정 그룹으로 보존하고 정정 체인은 공식 원문으로 확인한다. 원본 및 평가 완료 결과는 재작성하지 않는다. 상세 계약은 [DECISION_RECORDS.md](../DECISION_RECORDS.md).
- 실제 기존 판단 600건에 비교 근거를 연결했다. 평가 완료 0 / 미래 대기 600, 평가일 2026-09-18. 현재 비교 증명은 자료 부족이며, 기존 원본에 없던 정확한 가격 관측 시각을 만들어 넣지 않았다.
- 관련 회귀 검사와 독립 검토에서 분할에 의한 거짓 오답, 잘못된 증거 연결, 거래정지, 조회 실패, 정정·중복·재시도·저장 연결 단절을 확인했다. 운영 자동실행을 수동 재가동하지 않았다. **자연 실행 확인 전**이며 배포/실사이트 결과는 PR 및 작업 완료 보고서에서 별도로 기록한다.
- 다음 핵심 작업: **점수가 높을수록 실제로 더 잘 맞는지 확인하는 확신도 검사 + HOLD와 판단보류 구분 강화**.

## 2026-09-13 — 실제 판단 원본·검증 성적표 연결

- 최신 확인 기준 `origin/main=4f0825fb`. 기존 일별 이력·모델 성적표·DART/KIND 수집·Harness/Evolution은 재사용했다. 부족했던 장중 원본 보존과 ID별 결과, 고객 설명을 연결했다. 상세 경로와 한계: [DECISION_RECORDS.md](../DECISION_RECORDS.md).
- 실제 2026-09-11 16:14 자동판단 600건 → 압축 원본/manifest → 5거래일 결과 상태 → 공개 `decisionTrace`가 연결됐다. 원본 600 / 일별 600 / 서로 다른 판단일 1 / 평가 완료 0 / 미래 대기 600. 예시 성공률·수익률은 넣지 않았다.
- 아직 가격 기준·기업행사 조정 증명이 없어 평가일이 지나도 확인 전에는 보류한다. 다음 우선 과제는 이 증명의 증분 수집 연결이며, 원본을 사후 수정하지 않는다.
- 일상 점검이 원본·저장 결과·공개 집계의 내용 연결까지 확인한다. 러너의 미전송 증거는 종료 시 읽기 검증한 Actions artifact로 보존한다. 기존 수집/연구 일정과 LLM 호출 수는 유지했다.
- 기존 자연 실행 근거: Evolution `34001666660`(2026-09-06 schedule 성공), 일일 점검 `34604609795`(2026-09-11 schedule 성공). 새 연결의 다음 자연 실행은 아직 확인 전이다. 과거 실행 성공과 새 코드 자연 실행 성공을 혼동하지 않는다.
- PUBLIC PAPER의 메뉴 진입만 숨겼다. 사용자 보유정보·관심종목·정밀분석·종목공부·원장은 보존했다. Private는 원래 요청이 허용한 3개 소스 읽기 외 수정·재시작이 없다. 잘못 추가된 PRIVATE 작업은 수행하지 않았다.


## 2026-09-12 01:10 KST — Oracle 이전 검토 → **중단(WINDOWS 유지)** · Private 무변경

> 전문: `docs/operations/ORACLE_PAPER_MIGRATION_DECISION.md`
> **Oracle 서버에 설치·수정·삭제 0건(읽기 전용 조사만).** `activeRunner=WINDOWS` 그대로.

**판정: C — PRIVATE 안전을 위해 Oracle 이전을 하지 않는다.** fail-closed 설계대로의 정상 결과다.

Private 기준점(조사 전후 동일, 아무것도 안 바꿨으므로): `gaeo-gateway`·`gaeo-intelligence-bridge`·
`gaeo-mcp` 전부 active **재시작 0회** · NOVA healthy(`/health/live` 200, `/health/ready` 200) ·
최근 24h **401/403/token 오류 0건** · failed unit 0건.

**토큰 발급자 = `gaeo-gateway` 하나** (`toss/token_manager.py` 단독, Toss 자격증명을 가진 유닛도 그것뿐).
Bridge는 `ExistingTokenReader`로 **읽기만** 하고 없으면 실패한다. 이 불변조건은 이번에 바뀌지 않았다.

중단 사유 3개 (하나만 걸려도 중단 — 셋 다 걸렸다):

| # | 사유 | 근거 |
|---|---|---|
| 1 | **토큰 발급자가 늘어난다**(§6 위반) | 토스는 client 1개당 유효 토큰 1개. Team과 Gateway가 **같은 client 자격증명**을 쓴다(집 PC 로그가 매 회차 "지금 토큰을 발급하면 Gateway 토큰이 끊깁니다"라고 경고). Team이 발급하면 Private 즉시 중단, 공유 저장소를 주면 Team이 발급 가능 주체가 된다 |
| 2 | **Bridge로 Team 데이터 공급 불가 → 늘리려면 Private 수정**(§9) | Bridge `/v1/market`은 임의 조회가 아니라 **고정 범위 수집기**(`max_candidates=50`, 시드는 Private의 holdings+GAEO30+랭킹, `coverage.fullMarket=False`). Team 유니버스는 **600종목** + 종목 지정 호가 필요. 새 엔드포인트 추가 = Private 운영 서비스 변경(§3 금지) + Team 트래픽이 Private 토큰을 타고 나가 rate limit(수치 미공표) 위험 |
| 3 | **같은 root disk 압박**(§14) | Oracle `/` 여유 **14G**. `.git` **2.0GB**, 이력 **월 ~2.3GB** 증가(7일 459커밋) → **4~5개월이면 고갈**. 같은 디스크에 Private SQLite·NOVA가 있다. 얕은 복제 우회는 복구 도구가 exit 11로 거부 |

참고 제약(결정적이진 않음): **CPU 1개·swap 0** 환경을 Gateway·Bridge·NOVA·runner 2개와 공유.

데이터 대조 결과: 달력 **AVAILABLE**(`/v1/calendar`) · 호가/현재가/메타 **부분**(50종목 한도) ·
`/api/v1/trades` 는 Team 코드에 **호출부가 없어 요구사항 아님**(주석·allowlist에만 존재).

**다시 검토하려면(선행 조건)**: ① 저장소 비대 해결(구간 8 소유자 결정) ② Private/NOVA와 **다른 볼륨**
③ **Team 전용 Toss client 분리**(가장 유망 — 차단 1·2를 동시에 없애고 Bridge를 안 고쳐도 된다)
④ 또는 Private이 자기 필요로 범용 조회를 갖게 될 때.
남은 UNKNOWN: 토스가 한 계정에 복수 client 발급을 허용하는지(개발자센터 확인 필요) · OCI 무료 블록스토리지 잔여.

## 2026-09-11 00:20 KST — 집 PC PAPER 복구 **완료** (집 PC 실측 세션)

> 이 절이 아래 「확정된 사실」 1번(“PAPER 마지막 회차 = 2026-09-01”)을 **대체한다.**
> 실행 위치: 집 Windows PC(`DESKTOP-24KN8TP`) 직접 세션. 원격 세션이 아니다.

**현재 상태 — 복구 끝. 중간에 끊긴 작업 없음. 미커밋 작업 없음.**

| 항목 | 결과 | 근거 |
|---|---|---|
| 9/2 정지 원인 | **확정** — 사실 3+4 가설이 맞았다 | `paper-2026-09-02.log`: `remote sync: 로컬/원격이 갈라짐` → `rebase 충돌 — abort했다` → `최종 exit code: 6`. 9/2·3·4·7·8·10 각 13회차 전부 exit 6 |
| 집 PC에만 있던 기록 | **없음** | 복구 도구 check = **exit 10 / COVERED**(로컬 27파일 = 원격 27파일, 전 바이트 동일). 별도 교차검증: `paper_trading`·`smart_v2`·`scalp_v3` **tree 해시 3개 모두 원격과 일치**, `paper_public.js` blob 일치 |
| 장부 보존 | **완료** | 백업 `%LOCALAPPDATA%\GAEO\backups\prerepoint-20260911T001714\`(manifest 검증 통과) · 옛 HEAD `refs/gaeo-backup/head-20260911T001714` → `dbd9d86e4e` · 거래 줄 수 372/224/20 **복구 전후 동일**, 기존 줄 바이트 무변경(소급 수정 0) |
| 러너 저장소 재기준 | **완료** | `paper_recover.ps1 -Mode apply` **exit 0**. HEAD `dbd9d86e4e` → `8d4ff6a233`(=origin/main), 작업트리 깨끗 |
| 개발용 저장소 재기준 | **완료** | 옛 HEAD `da99ce79c3` → `refs/gaeo-backup/dev-20260911` 보존 후 `checkout -B main origin/main`. 옛 HEAD 내용은 새 이력 `2188a3f2b8`에 tree 동일로 이미 보존돼 있었다(손실 0) |
| 실제 PAPER 1회차 | **완료(성공)** | 작업 스케줄러 `GAEO Paper Trading` 실행 → `remote sync: 이미 최신` → engine/momentum/smart_v2/scalp_v3/report/public **전부 exit 0** → `최종 exit code: 0` |
| **장중 자연 회차** | **완료(2026-09-11 실측)** | 09:05·09:35·10:05·10:35·11:05·11:35·12:05 **7회차 전부 exit 0**(사람 개입 0). 토스 403/시세불가 **0건**(`PRICE_HISTORY_599`). 09:35부터 신규 진입 재개, scalp_v3 도 12:05 에 진입 재개. 세 장부 활성: V1 438줄/보유 10 · smart_v2 280줄/보유 10 · scalp_v3 23줄/보유 3 |
| GitHub 새 기록 | **완료** | 커밋 `a7cb305160` push 성공, `origin/main` 반영 확인. 화이트리스트 밖 파일 0건. 세 장부 `lastCycleAt` 전부 `2026-09-11T00:20` |
| 관측 공백 정직성 | **완료 — 설계대로 기록됨** | 9/11 09:05 회차가 보유 10건을 `MAX_HOLDING_5D` 로 **오늘 실제 시세에 청산**(합계 실현손익 **-357,881 KRW**). `holding_trading_days` = **12일 7건 · 8일 3건**(한도 5일 초과 = 지연 청산이 그대로 보임). 10건 전부 `observation_gap_business_days = [09-02 … 09-10]` 기록. **소급 체결 0건, 과거 날짜 거래 0건** |
| 다음 거래일 자동 실행 | **준비됨** | 작업 스케줄러 Ready·Enabled, Mon–Fri 09:05 + 30분 간격 6시간, `NextRunTime = 2026-09-11 09:05`. `paper_doctor.ps1` 전 항목 `[O]`, exit 0. `paper_health_check.py` → `status=OK reason=CYCLE_OK` |

**이번에 새로 밝혀진 별개 원인 (9/2 git 문제와 무관)**

- **9/9(수)만 로그가 아예 없다.** 작업 스케줄러는 13회 전부 발화했지만 **이벤트 332 ×13**으로 전부 차단됐다:
  「시작 조건이 충족되었을 때 "DESKTOP-24KN8TP\개오" 사용자가 로그온한 상태가 아니므로 …」.
  그날 06:21~06:24 Windows Update(TrustedInstaller)가 재부팅했고 로그온이 안 된 상태였다.
  작업이 `LogonType=Interactive`(사용자 로그온 시에만 실행)라서 생긴 구조적 위험이며 **아직 안 고쳤다**
  (고치려면 계정 비밀번호 저장이 필요 → 자격증명 작업이라 이번 승인 범위 밖).

**다음 첫 명령 — 2026-09-11 12:10 KST 에 위 3개 모두 실행해 확인 완료.** 남은 확인은 하나뿐이다:

```powershell
# 16:30 KST 이후: paper-health-alert 가 Issue #481 을 자동으로 닫았는지 (사람이 닫지 말 것)
gh issue view 481 --json state,updatedAt
```

**절대 하지 말 것 (이어받는 세션용)**

- Issue #481을 **사람이 직접 닫지 않는다.** 16:30 KST `paper-health-alert`가 오늘 `CYCLE_OK`를 보고 자동으로 닫는다.
- 9/2~9/10 공백을 **과거 날짜 거래로 메우지 않는다.** `backfilledBusinessDates`에 공백으로 남기는 것이 설계된 정상 동작이다.
- 보유 10건을 **손으로 청산 처리하지 않는다.** 다음 개장 회차가 `MAX_HOLDING_5D`로 처리하며, `holding_trading_days`가 5보다 크게 찍히는 건 지연 청산이라 정상이다.
- `git reset --hard` · `git clean` · force push · `--allow-unrelated-histories` · 백업 폴더/`refs/gaeo-backup/*` 삭제 금지.
- 산식·가중치·BUY/HOLD/SELL 기준·사전등록 조건·`tickers.js`·`activeRunner`(=`WINDOWS` 유지) 변경 금지.
- **Oracle 이전 전제 조건은 2026-09-11 에 충족됐다**(장중 7회차 연속 정상). 다만 이전 자체는 **별도 작업**이며, 시작 전에 STATUS 의 「이번에 하지 않는 다음 단계」 2~8번(Oracle 자원 확인 · Linux 실행 시험 · **동시 writer 방지** · Windows 정지 순서)을 먼저 설계해야 한다. `activeRunner` 를 성급히 바꾸면 두 러너가 같은 장부를 쓴다.

**남은 위험 (해결 안 됨)**

1. 9/9형 사고 재발 — PC가 재부팅되고 아무도 로그인하지 않으면 그날 PAPER는 통째로 안 돈다. (사용자 조치: 평일 장중 PC를 켜고 로그인 상태로 두기)
2. 토스 공유 토큰 경고 — 매 회차 `GAEO_SHARED_TOSS_TOKEN 가 꺼져 있습니다 … Gateway의 토큰이 끊깁니다`가 뜬다. PAPER 자체는 정상이지만 Gateway와 함께 쓰면 충돌 가능. 이번 범위 밖이라 손대지 않았다.
3. ~~장중 실거래 회차 미검증~~ → **해소(2026-09-11)**. 장중 7회차 전부 정상, 토스 403 0건.
4. 회계 버전 혼재(위험 아님, 기록용) — 2026-08-26 이전 진입분은 `accounting_version=None` 이라 수수료·세금이 0원이고, 9/1 진입분부터 `ACCOUNTING_V2_NET` 으로 비용이 붙는다. 8/18~8/25 청산분도 같아서 **이번 복구로 생긴 회귀가 아니다.** 성과를 비교할 때 두 구간을 섞지 말 것.

## 기준 (2026-09-10 09:00 KST 시작)

- `origin/main` = `a003e02bda` (PR #529, indicators.json 출처 필드 보완). 열린 PR 0건.
- 작업 브랜치: `claude/auto-analysis-failure-prevention-94we7m` (origin/main에서 재기준. 예전 같은 이름 브랜치는 83커밋 뒤처진 빈 포인터였다).
- 동시 작업: `gaeo-private` 안정화 세션(다른 Fable)이 09-10 09:42 KST에 "구간 D 자연 회차 확인"을 예약해 둠(`trig_01T1jGMP3dttUZHshoANGAca`, 그 저장소의 `docs/stabilization/STATUS.md`에 기록). 공개 저장소 쪽 변경(PR #529 `compute_indicators.py`)은 이미 병합됐고 이번 작업은 그 파일을 만지지 않는다.
- 기준 검사(변경 전, `a003e02bda`): Python 계약 테스트 `test_*.py` 73개 파일 전부 PASS (이 세션 실측, 로그는 스크래치에만).
- 프라이빗 저장소는 읽기 전용으로 받아 연결 관계만 확인했다(`gaeo-private` `8d09699`, `gaeo-gateway` `a4f1c1c`). 어떤 파일도 고치지 않는다.

## 구간별 상태

상태 어휘: 미착수 / 진행 / 완료 / 부분 완료 / 접근 불가 / 자연 실행 대기

| 구간 | 상태 | 이미 있던 것 | 이번 실제 변경 | 검사 | 커밋/PR | 남은 위험·다음 행동 |
|---|---|---|---|---|---|---|
| 0 최신 사실·일정 보존 | 완료 | 예약시험 4건은 Claude Routine에만 있었음. `docs/CURRENT_STATUS.md`에 문장으로만 기록 | `docs/operations/MASTER_PLAN.md`·`STATUS.md`, `config/validation_schedule.json`(원본) + `docs/VALIDATION_SCHEDULE.md`(생성) + `render_validation_schedule.py` + `test_validation_schedule.py` | `test_validation_schedule.py` 7건 PASS | 이 브랜치 | 일정 실행기(구간 5) 전까지는 Claude Routine이 유일한 실행 경로다 |
| 1 PAPER 복구 | 부분 완료(원격 몫 완료 · 집 PC 적용 대기) | Single Writer·doctor·health-alert·Oracle 자료 전부 있음 | `scripts/paper_cycle.sh`·`.ps1`: 공통 조상 없음(원격 이력 재작성) 분기 추가 — 안 올린 기록 없으면 옛 HEAD를 `refs/gaeo-backup/`에 남기고 `checkout -B main origin/main`, 있으면 exit 6 유지. `docs/operations/HOME_PC_CHECKLIST.md`(집에서 할 일 7단계), `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9 | `test_paper_runner_sync.py` 6건(sh 실제 실행 A/B/B2/C/C2 + ps1 정적 대조) PASS · `test_paper_safety_boundary`·`test_paper_single_writer`·`test_secret_hygiene`·`test_ci_parity` PASS | 이 브랜치 | 러너 clone은 동기화가 막혀 고친 코드를 못 받는다 → 집에서 한 번 `checkout -B main origin/main` 필요(체크리스트 3절). Oracle 전환 보류(조건 미충족). 끊긴 기간 장부: 보유 10건 지연 청산(MAX_HOLDING_5D)·dataGaps 자동 기록이 설계된 정상 동작, 소급 체결 0 |
| 2 통합 건강검진 | 완료(코드·연결) · 실제 작동은 병합 뒤 워치독 run에서 확인 | check_pipeline·pipeline_watchdog·check_workflow_health·paper_health_check·evolution status(각각 따로 봄) | `ops_status.py`(LLM 0, 어휘 6종, 달력·유예·회차창, 예정시험 지연 감지, 서명 기반 수리요청서 `--repair-request`) · `pipeline-watchdog.yml` 마지막 스텝에 요약 추가(`--github`, continue-on-error) · Evolution 🟢 주간 이슈 고정 제목 1개로 통합 + 옛 날짜 이슈 자동 정리(`gaeo_evolution/notification.py`, `evolution-lab.yml`) · `docs/PIPELINE_WATCHDOG.md` 절 추가 | `test_ops_status.py` 16건(격리: 금지 모듈 0·기본 실행 네트워크 0·차단 시 확인 불가 / 판정 10건 / CLI 종료코드) PASS · `test_gaeo_evolution` 195건 · `test_workflow_size`·`test_workflow_branch_exec`·`test_pipeline_watchdog`·`test_paper_health_check`·`test_holiday_guard` PASS | 이 브랜치 | 사이트 전달(`--probe-pages`)은 이 세션에서 egress 차단이라 실제 확인 못 함(확인 불가로 종료하는 것만 검증). 공개 화면 표시는 이번에 바꾸지 않음. Claude Routine: 매시 안전망 v6는 워치독 cron 지연을 메우는 dispatch 역할이라 **유지**, 금요 Health 제안은 일일 ops 점검(구간 5 워크플로) 가동 뒤 중지 후보 |
| 3 하네스 | 완료 | GAEO_HARNESS.md(Evolution용)·AGENTS.md 45.7KB(Codex 32KiB 한도 초과)·CLAUDE.md·스킬 8개 | `docs/HARNESS.md`(시작·검사·배포·복구·중단 한 장) · `gaeo_check.py`(preflight/quick/pipeline/paper/investment-contract/schedule/compatibility/premerge/postdeploy/browser) · `AGENTS.md`에 🧭 작업 지도(절대규칙 8줄+읽을 것/검사 표) 신설, 세부 절 5개를 `docs/rules/*.md`로 **원문 그대로 이동**(45.7KB→28.5KB) · `docs/agent/RULES_MAP.md` 대응표 · `CLAUDE.md` 시작 순서·Routine 항목 갱신 | `test_gaeo_check.py`(묶음 전수·없는 파일 FAIL·실패 전파) · `test_rules_map.py`(원문 이동 앵커·32KiB·지도 링크·중복 없음) · `python3 gaeo_check.py compatibility`/`quick` PASS · AGENTS.md를 읽는 기존 테스트(deep_analysis_pipeline·gaeo_evolution·design_contract·secret_hygiene) PASS | 이 브랜치 | Codex 32KiB 기본값은 설치본에서 재확인 필요(문서화). 브라우저 smoke는 목록만 제공(실행은 확인된 환경에서) |
| 4 오케스트레이션 | 완료 | 스킬 공통 규칙("항상 3명 review"·"health 기본 4명"·"build 마지막 항상 qa"·"strategy 4명 동시") · 팀 문서와 AGENTS의 배포 승인 규칙 충돌 | 8개 스킬 공통 절 개정(정상 점검 0명·메인 1명·동시 2명 이내·관점 순서대로·읽기 전용은 지침) · review/health/build/bug/strategy 개별 절 개정 · `/gaeo-maintain` 신설(STATUS→ops_status→수리요청서, 요청한 수정은 서버 정상이어도 수행) · `docs/gaeo_team_system.md` 개정 절 · 배포 승인 공통 기준(`HARNESS.md` §3) | 스킬 파일은 문서(정적). `test_rules_map.py`가 대응표를 잠금 | 이 브랜치 | 모델 지정 없음 확인(역할 파일에 `model:` 0건). Codex 순차 수행은 미확인 |
| 5 일정 실행기 | 완료(코드·워크플로·검사) · 실제 작동은 병합 뒤 첫 run에서 확인 | 없음(Claude Routine만) | `run_validation_schedule.py`(계획/실행/원장/동결 입력/`--replay`/후속 명세/수리 요청서, 재확인 상한 RECHECK_LIMIT·실패 3회 ESCALATED·anomalyRules→ANOMALY) · `check_team_weights_transition.py`(9/15 DIANA 전환: 직전 판 git/API 비교, ±1.5%/5%) · `check_flow_validation_readiness.py`(9/23 FLOW 표본 조건만, 채점 없음) · `config/validation_schedule.json`(모든 단계 available, `runner` 블록, `anomalyRules`) · `.github/workflows/ops-daily.yml`(평일 17:05 KST: `gaeo_check schedule` → `ops_status --deep --github` → 실행기 → 허용 경로 3곳만 커밋 → 이슈 2종 제목 고정) · `render_validation_schedule.py` 실행기 절 · `gaeo_check` schedule 묶음 확장 | `test_validation_runner.py` 42건(계획 규칙·allowlist·판정·임시 저장소 실제 실행·원장 append-only 바이트 비교·동결/재현·워크플로 정적) · `test_validation_checks.py` 19건(임시 git 저장소 2판 비교·FLOW 합성 표본) · `gaeo_check schedule`/`quick` PASS · `test_workflow_size`·`test_ci_parity`·`test_secret_hygiene`·`test_rules_map`·`test_workflow_health` PASS | 이 브랜치 | 실제 due 시험은 9/15가 첫 회. Claude Routine 4건은 **병합 뒤** `update_trigger`로 "GitHub 원장 확인 + §3 후속만"으로 재작성(원장이 실제 due 시험을 기록하는 것을 본 뒤 끄기). 실행기의 ANOMALY/FAILED는 수리 요청서만 쓰고 산식을 건드리지 않음 |
| 6 Codex 호환 | 완료(파일·정적 검사) · 실제 앱 확인은 미확인 | `.claude/` 전용. `.agents/`·`.codex/` 없음. MIGRATION_MAP 골격만 | `sync_agent_compat.py`(생성기, `--check`) → `.agents/skills/<13개>/SKILL.md`(같은 name/description + 원본 경로 + Claude 메커니즘 대응표, 절차 복제 없음) · `.codex/agents/<14개>.toml`(형식 미확인 표시, model 키 없음) · `docs/agent/ROLES.md`(역할 14개 표) · `docs/agent/CODEX_SCENARIOS.md`(시나리오 4개 + 기록표) · MIGRATION_MAP 갱신(모델 지정 정정: 외부 seo-* 원문에 `model: sonnet` 있음, GAEO 14개는 없음) | `test_agent_compat.py` 11건(동기 바이트 비교·이름 일치·복제 없음·참조 경로 존재·TOML 파싱·model 없음·ROLES 전수) · `gaeo_check compatibility` PASS | 이 브랜치 | Codex 공식 문서는 egress 차단으로 읽지 못함 → 레이아웃·형식 미확인. Codex가 있는 환경에서 `CODEX_SCENARIOS.md` §5 표를 채워야 "실제 앱 확인"이 된다 |
| 7 투자검증 GAP | 완료 | 사전등록 평가·계약 테스트·기준선 공개·Evolution·Forward 분리·성적표(전부 코드·연결 있음, 표본은 전부 부족) | `docs/operations/INVESTMENT_VALIDATION_GAP.md`(11항목 × 코드/연결/기록/표본/효과 5칸, 9/10 실측: 사전등록 익은 판단일 0/20 · FLOW 공통 날짜 12/20 · DIANA n=0 NOT_GRADED_YET · Evolution BOOTSTRAP_SHADOW validated 0 · PAPER 9/1 이후 정지) · `test_validation_negative_control.py`(무관한 합성 자료에서 PASS 0·효과 0·재현성·config↔등록 상수·기준일 고정) · `gaeo_check investment-contract` 추가 | `test_validation_negative_control.py` 7건 PASS · 등록 테스트 변경 0 | 이 브랜치 | 산식·가중치·임계값·등록 상수 변경 0. FLOW 6-arm 은 정의 4건을 코드로 확정하는 새 등록이 먼저(자동 채점 없음) |
| 8 이력 보존 | 완료(코드·문서) · 소유자 결정 대기(용량 정책) | `compact-history.yml` 월 1회 force push(실행 1회: 2026-09-02 08:25 KST, 커밋 3,151개 번호 변경 → PAPER 러너 8거래일 정지). 다음 예약 2026-10-02 06:30 KST(사전등록 창 안) | `compact-history.yml`: **schedule 제거 → 수동(confirm=COMPACT-MAIN-HISTORY)** + 사전 점검(얕은 clone·KST 평일 08:30~16:40·러너 2시간 활동·검증 원장 증거 손실 거부) + 옛→새 **SHA 지도** `docs/audits/history_rewrites/` 커밋(tree·author-time 검산 실패 시 push 안 함) + 재기준 안내 이슈 · `check_history_evidence.py`(`--report`/`--precheck`/`--sha-map`/`--translate`) · `ops-daily` 매일 용량 보고(3 GiB NOTICE·4.5 GiB PROTECT — **이 프로젝트가 정한 경고선**이지 GitHub 공식 한도가 아니다. GitHub 은 1 GB 이하 권장·5 GB 미만 강력 권고) · `docs/HISTORY_PRESERVATION.md`(사실·결정·대안 A~E·소유자 결정 4개) · `BRANCH_GOVERNANCE_PLAN` 2단계 진행 표시 · `HOME_PC_CHECKLIST` 개발 clone 재기준 절 | `test_history_preservation.py` 11건(워크플로 정적 + 실제 임시 git 재작성 재현·지도·번역 + 사전 점검 거부 조건 + 토큰 없는 보고=확인 불가·네트워크 0) PASS | 이 브랜치 | 실측: GitHub 집계 1.88 GiB(9/10), 최근 7일 이력 +542.7 MB(≈2.3 GB/월) → 12월 5 GiB 근처. 압축을 끈 것은 되돌릴 수 있다(schedule 한 줄). 커밋 빈도 줄이기(B)·data-live(C)는 소유자 결정·별도 설계 |
| 9 통합·최종 보고 | 완료(병합·배포·첫 실행 확인) | CI(`ci.yml`)·워치독 | `docs/operations/FINAL_REPORT_KO.md`(10문항) · PR #530 → **main `4cdba5a7d7`**(merge commit, 2026-09-10 10:50 KST) · Claude Routine 4건 프롬프트·시각 재작성(17:40 KST, "GitHub 원장 확인 + §3 후속만", 직접 평가 금지) | `gaeo_check premerge` 123 PASS / 0 FAIL(= **테스트 파일** 123개 전부 통과, py 84 + js 39 — 개별 테스트 건수가 아니다) · CI contract-tests 성공(head 8f781b78) · 브라우저 smoke 2건 PASS · **병합 뒤**: `ops-daily` workflow_dispatch(apply=false) run #1 성공(21초, 계획 모드 NOT_DUE 4건) · main 작업트리에서 `ops_status.py --probe-pages`: 정상 7 · 정상 대기 1 · 장애 1(PAPER) · 사이트 전달 정상(10:51 시세, 저장소 대비 0분 차) · 지표 출처 정상(PR #529 필드가 10:32 생성물에 반영됨) | PR #530 병합 | 남은 것: 집 PC 러너 재기준(HOME_PC_CHECKLIST) · 9/15 17:05 첫 실제 due 시험 기록 확인 · Codex 실기동 미확인 · GitHub cron **미발화** 실측(워치독 schedule 발화 하루 두 번꼴 · ops-daily 첫 예정 17:05 발화 0회 → 구간 D 에서 실측 항목·예비 발화 추가. 매시 Routine 은 9/15 까지만) |

## 확정된 사실 (다시 조사하지 말 것)

1. **PAPER는 2026-09-01 15:05 KST 회차가 마지막이다.** `paper_trading/state.json` `lastCycleAt=2026-09-01T15:05:09+09:00`, `lastCycleResult=CYCLE_OK`. 9/2·3·4·7·8·9 거래일 전부 기록 0건 → `paper-health-alert`가 Issue #481(`NO_CYCLE_TODAY`)을 매일 갱신 중. 이것은 "실행 후 실패"가 아니라 **"실행되지 않음"**이다(FAIL 판정이 아니라 MISSING).
2. `paper_runner_config.json` `activeRunner=WINDOWS`. Oracle은 설치되지 않았다(문서상 준비만). 두 러너가 동시에 쓴 흔적 없음.
3. **2026-09-02 08:25~08:30 KST `compact-history` 워크플로가 main 이력을 재작성하고 force push했다** (run 33570927997, 커밋 3,151개 재작성, `67c8d6ffb9 → 852814dfe8` forced update). 그 뒤 main의 모든 커밋 SHA가 바뀌었다. 현재 main의 뿌리 커밋은 2026-08-31 16:00 KST 두 개.
4. 러너 동기화 코드(`scripts/paper_cycle.ps1` 227~253행, `.sh` 동일)는 로컬 HEAD와 origin/main의 공통 조상이 없으면 "갈라짐 → rebase → 충돌 → abort → exit 6(수동 확인 필요)"로 끝나고 엔진을 돌리지 않는다. 이 상태는 매 사이클 반복된다.
5. 시세·자동분석 파이프라인은 정상이다(9/9 auto_analysis.js 30분 간격 커밋, 워치독 run 42회 success, 9/9 16:20 team_weights 갱신).
6. Claude Routine 실측(2026-09-10 오전, 15건 중 활성 9건 → 오후 구간 E 에서 월·금 제안 2건을 꺼 **활성 7건**): 아래 표. 예약시험 4건은 전부 이 세션(`session_01Ng1xLMndUQQiSYMcjHY4TJ`)에 묶여 있고 9/23 건만 "새 세션 생성형"이다.
7. Evolution은 `BOOTSTRAP_SHADOW`, 주간 run 정상(9/6). 주간 이슈(#436·#464·#509)가 매주 새로 열리고 닫히지 않는다(제목에 날짜) → 구간 2 정리 대상.
8. 저장소 팩 크기 약 2.3GB(이 컨테이너 실측). 압축 1회(9/2) 뒤에도 하루 50~75커밋(자동 생성물)씩 는다.
9. **GitHub cron 은 이 저장소에서 문서대로 발화하지 않는다(2026-09-10 실측).** 워치독 `*/15` 의 schedule 발화는 하루 두 번꼴(03:38Z·08:2xZ 부근)이었고, `ops-daily` 의 첫 예정 발화(17:05 KST)는 20:40 KST 까지 0회였다(run 목록에 dispatch 1건뿐). 시세·자동분석이 그동안 산 것은 러너 자기 재기동(chain, dispatch)과 매시 Claude Routine 덕이다. 구간 D 가 이것을 `ops_status --github` 「예약 실행 실측」 항목으로 잰다(비활성/기록 없음/잘못된 ref/실패/미실행/대기 구분). 보완으로 ops-daily 예비 발화(17:37·18:11)·워치독 분 흩기(`4,19,34,49`)를 넣었지만 **보장이 아니다**.

## 유력하지만 아직 확정되지 않은 것 (단정 금지)

- **PAPER 중단의 가장 유력한 원인**: 사실 3+4. 집 PC 러너 전용 clone(`%LOCALAPPDATA%\GAEO\paper-runner\repo`)의 HEAD는 09-01 15:05 회차 커밋(재작성 **전** SHA)이고, 09-02 08:30 이후 origin/main은 재작성된 이력이라 **공통 조상이 없다**. 09-02 09:05 첫 사이클부터 exit 6이 반복됐을 것이다. **확정 근거는 집 PC 로그** `%LOCALAPPDATA%\GAEO\logs\paper-2026-09-02.log`에 `remote sync: 로컬/원격이 갈라짐` → `rebase 충돌` → `최종 exit code: 6`이 있는지다. 그 줄이 없으면 이 가설은 틀린 것이고, `paper_doctor.ps1`로 다시 진단한다.
- 09-07 84분 시세 공백이 09-08과 같은 원인(러너-GitHub 통신 단절)인지: 로그 미확인(`docs/CURRENT_STATUS.md` 인계 그대로).

## 아직 모르는 것

- 집 PC 전원·로그인·작업 스케줄러 상태(원격 확인 불가).
- Oracle VM의 Shape·여유 자원(`docs/PAPER_TRADING_ORACLE_RUNNER.md` §2 전부 UNKNOWN 그대로). Private 안정화 작업이 같은 VM에서 진행 중이므로 이번에 개오팀 PAPER를 Oracle에 설치하지 않는다(조건 미충족 → 보류).
- GitHub 쪽 저장소 실제 용량과 한도 경고 여부(API로 확인 예정, 구간 8).

## Claude Routine 실측 목록 (2026-09-10 `list_triggers`)

| ID | 이름 | 일정 | 상태 | 이 작업에서의 처리 |
|---|---|---|---|---|
| trig_016K7aG2LNfyo6mK4APHnTeK | DIANA 채점 시작 전환 확인 | **2026-09-15 17:40 KST** 1회 | 활성 | **재작성 완료(2026-09-10)**: GitHub 원장(`VS-20260915-DIANA-SHRINKAGE-CHECK`) 확인 → 숫자 보고 → ANOMALY 일 때만 수리 요청서 기준 최소 수정. 직접 평가 금지. 기록이 없으면 ops-daily 를 1회 dispatch |
| trig_015MuVabAYTLDXistNBJ8wE4 | FLOW 표본 조건 + BUY 표본 점검 | **2026-09-23 17:40 KST 1회**(매년 cron → 1회로 변경), 새 세션 생성 | 활성 | **재작성 완료**: 원장(`VS-20260923-FLOW-READINESS-PREREG-SAMPLE`) 확인 → 표본 수 보고 → 6-arm 채점은 하지 않고 정의 4건을 코드로 확정하는 새 등록 제안만 |
| trig_015gDtdaSXyuJnnU76PYcdDA | BUY 필터 사전등록 확정 평가 | **2026-10-19 17:40 KST** 1회 | 활성 | **재작성 완료**: 원장(`VS-20261019-PREREG-BUY-EVAL`) 확인 → `--replay` 재현 확인 → §3 표 후속만(H2 표시 추가·경고 제거·H0 기록; H1 은 기록만). 성적표 첫 호는 EVALUATED 일 때만 |
| trig_018TwrTbybyiLUdjr4gUHzm8 | H1 40판단일 재확인 | **2026-11-16 17:40 KST** 1회 | 활성 | **재작성 완료**: 원장(`VS-20261116-PREREG-H1-RECONFIRM`) 확인 → 재현 확인 → H1 PASS(≥40일) 일 때만 §3 산식 변경(급등 BUY→HOLD) PR |
| trig_019ZqRJzaM1upVRoQEfGkFzz | 장중 매시 kickoff 안전망 v6 | 평일 매시 09~16 KST | 활성 | **9/15 까지 유지, 구독 종료와 함께 소멸.** 대체: 러너 자기 재기동(chain)·수집기 자진 사퇴·워치독 cron 분 흩기(구간 D)·`ops_status --github` 예약 실행 실측. 사람이 따로 할 일 없음 |
| trig_019pCrEkMQwuqxdEWCnzxZfk | 매일 시장분석 자동 발행 | 평일 16:30 KST | 활성 | 콘텐츠 발행(LLM 필요). **9/15 이후 소멸 — 대체 없음**(사람 또는 다른 AI 세션이 `.claude/skills/뉴스분석 스킬/SKILL.md` 절차로 발행) |
| trig_01JiZ2PJFkB65o1XbELP1MeC | 월요 Strategy 제안 | 월 09:00 KST | **비활성(2026-09-10 구간 E 에서 끔)** | 제안형(실행·커밋 없음). 코드 점검(`ops-daily`)이 대체. 다시 켜려면 `update_trigger enabled=true` |
| trig_01Af1D2fAUvWgaRamx6wbmKA | 금요 Health 제안 | 금 09:00 KST | **비활성(2026-09-10 구간 E 에서 끔)** | 구간 2 코드 점검이 대체(`ops-daily` 매일 실행) |
| trig_01T1jGMP3dttUZHshoANGAca | 구간 D 09:42 확인 | 2026-09-10 09:42 KST 1회 | 활성 | **다른 세션(gaeo-private) 소유. 건드리지 않는다** |
| (비활성 6건) | 옛 안전망 v2/v3, 옛 방 이전본 | - | 비활성 | 그대로 둔다 |

과거 9/7 「월요일 러너 첫 가동 뒤 건강검진」(trig_0194BTtAr4D4UkHDa5a5Ebwx)은 발화 후 목록에서 사라졌고, PR #520 메시지가 "전 항목 정상"을 남겼다 → `VS-20260907-MONDAY-RUNNER-HEALTH`로 과거 기록만 보존.

## 후속 실행 (2026-09-10 오후, 「Fable 후속 실행 지시서」) 구간 A~F — 완료 구분표

"구간 완료"는 코드·검사·PR 병합까지를 뜻한다. **집 PC 적용 · Codex 검증 · Claude 없이 운영**은 별개의 칸이며, 이 세션에서 확인할 수 없는 것은 ✗ 로 적는다.

| 구간 | 구간 완료(코드·검사·병합) | 집 PC 적용 | Codex 검증 | Claude 없이 운영 | 근거 |
|---|---|---|---|---|---|
| A 원장 보존 결함 수리 | ✔ PR #532 → main `603254f8b3`(15:55 KST). `paper_ledger_inclusion.py`(내용 기반 포함성 COVERED/NOT_COVERED/UNDETERMINED, fail-closed) · `scripts/paper_cycle.sh`/`.ps1`(공통 조상 없음 → 얕은 clone 거부 → 포함성 → 백업+검증 → `refs/gaeo-backup/` → 재기준; 잠금) · 복구 도구 `scripts/paper_recover.sh`/`.ps1`(check/apply, 안 올린 기록 export). 테스트 37+18+12=67건. 별도 세션 검토자 1명: P0 없음, 옛 코드의 E1 손실 재현 확인 | ✗ 접근 불가(구간 B) | 해당 없음 | ✔ 러너·복구 도구는 일반 프로그램 | `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9 · `HOME_PC_CHECKLIST.md` §0~§4 |
| B 집 PC 복구 | 도구 완료 · **적용 미완** | ✗ **ACCESS_BLOCKED** — 이 세션은 클라우드 VM, Remote Control 없음, 집 PC 로그·스케줄러·러너 clone 을 볼 수 없다. 원격 복사본 수리를 집 PC 설치로 보고하지 않는다 | 해당 없음 | 적용 뒤에는 ✔ | 사람이 1회: `HOME_PC_CHECKLIST.md` §3(`scripts\paper_recover.ps1` 검사 모드 → `-Mode apply`) |
| C 예정 시험 실행기 보강 | ✔ PR #533 → main `b40f54815e`(16:05 KST). 계획 모드 0실행 · 확인 시험(9/15·9/23)은 표본 수만(`prereg_sample_count.py`) · expectJson/requiredFields → FAILED · 평가 시험 동결 입력 필수·공식 판정은 동결 입력에서 · 저장 실패는 `validation-inbox-<run_id>` 브랜치+artifact 보존 후 다음 run 회수 · 재확인 기준일 전진 · 실행기 크래시 기록. 테스트 57건 | 해당 없음 | 해당 없음 | ✔ 단, **GitHub cron 이 발화해야** 한다(사실 9) — 미발화면 사람이 Actions 탭에서 `ops-daily` `apply=true` 1회 | `docs/VALIDATION_SCHEDULE.md` · `config/validation_schedule.json` |
| D Claude 없는 감시 정직화 | PR #535(커밋 `237269df6e`·`191bc0ff5e`) — CI 뒤 병합. `ops_status --github` 「예약 실행 실측」(워치독·ops-daily 각각: 비활성/기록 없음/잘못된 ref/실패/미실행/대기/수동만) · `check_validation_schedule` `lastLedger.resultFileExists` · ops-daily 예비 발화 · 워치독 분 흩기. 테스트 26건 | 해당 없음 | 해당 없음 | ✔ (감시 자체가 cron 에 실리므로 "실행된 run 안에서" 잰다 — cron 이 전혀 안 뜨면 아무도 못 잰다: 한계 명시) | `docs/PIPELINE_WATCHDOG.md` 2026-09-10 절 |
| E Codex 인계 | ✔ PR #534 → main `62f3fd3551`(16:10 KST). `.codex/agents/*.toml` 을 지시서의 공식 스펙 키 넷(`name`·`description`·`developer_instructions`·`sandbox_mode`)으로 · 독립 검토 ≠ 같은 AI 역할 교대 · 동시 AI ≤ 2 · Routine 월·금 제안 2건 비활성. 테스트 14건 | 해당 없음 | ✗ **미확인** — 이 세션에 Codex 없음, 공식 문서(developers.openai.com) egress 차단으로 직접 대조 못 함. `docs/agent/CODEX_SCENARIOS.md` §5 표를 Codex 있는 환경에서 채워야 확인 | ✔ 파일은 남는다 | `docs/agent/MIGRATION_MAP.md` |
| F 문서 정정·최종 보고 | 이 문서·`FINAL_REPORT_KO.md`·`HARNESS.md`·`MASTER_PLAN.md`·`CLAUDE.md` 정정(원인 확정→유력 가설, 시간 약속 제거, 123 PASS 뜻, 완료 구분표, 용량 경고선, Routine 실태) + 채팅 최종 보고 | - | - | - | PR #535 에 포함(문서 5개, 코드 변경 없음) |

## 9/15 이후(Claude 구독 종료) 의존성 표

| 기능 | Claude 없이 | 무엇이 대신하나 | 남는 위험 |
|---|---|---|---|
| 시세·자동분석 수집 | ✔ | `update-prices.yml`·`update-analysis.yml` 자기 재기동 + 자진 사퇴 | 체인이 끊기면(둘 다 죽음) cron 이 살려야 하는데 cron 이 불확실 → 사람이 Actions 에서 dispatch |
| 워치독(좀비 취소·재기동·상태 요약) | △ | cron `4,19,34,49 0-7`(실측 하루 두 번꼴) + 마커 push(Routine 소멸 뒤에는 없음) | 좀비 감지가 몇 시간 늦을 수 있다 |
| 예정 시험 실행·기록(9/23·10/19·11/16) | △ | `ops-daily` cron 17:05(+17:37·18:11) → 원장 | 첫 예정일 발화 0회 실측. 미발화면 사람이 `apply=true` 1회(지연은 기록에 남는다) |
| 시험 결과 확인·후속 조치 PR | ✗ | 원장·이슈는 남는다. 후속은 사람 또는 개발 AI 세션이 등록 문서 §3 표대로 | 아무도 안 읽으면 후속이 없다 |
| 매시 안전망 Routine | ✗ 소멸 | 위 워치독·러너 자기 재기동 | 없음(보조 신호였다) |
| 매일 시황 글 발행 | ✗ 소멸 | 없음(사람/다른 AI 가 `뉴스분석 스킬` 절차로) | 글이 안 나온다 |
| 월·금 제안 Routine | 이미 껐음 | `ops-daily` 코드 점검 | 없음 |
| 모의투자 러너(집 PC) | — **은퇴(2026-09-15)** | 해당 없음. 모의투자는 PRIVATE 사이트에서만 한다 | 없음. 원장은 보존되고, 은퇴 뒤 신규 기록은 `ops_status` 가 장애로 잡는다 |
| 공개 화면 정직 표시 | ✔ | 정적 파일 | 없음 |

## 다음 행동 (정확히)

1. ~~구간 1 원격 몫~~ 완료. 집 PC 몫은 `HOME_PC_CHECKLIST.md`.
2. ~~구간 2~~ 완료.
3. ~~구간 3·4~~ 완료.
4. ~~구간 5~~ 완료(코드). 병합 뒤: `ops-daily` 를 `workflow_dispatch`(apply=false)로 한 번 돌려 계획 출력 확인 → Claude Routine 4건 프롬프트 재작성(`update_trigger`).
5. ~~구간 6~~ 완료(파일·정적 검사). Codex 실제 확인은 그 도구가 있는 환경에서 `docs/agent/CODEX_SCENARIOS.md`.
6. ~~구간 7·8~~ 완료(코드·문서). 소유자 결정: 용량 정책(`docs/HISTORY_PRESERVATION.md` §5).
7. ~~구간 9~~ 완료: PR #530 병합(main `4cdba5a7d7`) · ops-daily 첫 실행 성공 · 사이트 전달 확인 · Routine 4건 재작성.
8. ~~후속 실행 구간 A·C·E~~ 완료(PR #532·#533·#534 병합). 구간 D 와 구간 F(이 문서 정정)는 PR #535.
9. **다음 담당자의 첫 행동(순서대로)**: (1) ~~집 PC 러너 복구~~ **SUPERSEDED 2026-09-15** — 모의투자 은퇴. 집 PC 에서 할 일은 작업 스케줄러의 「GAEO Paper Trading」 해제 하나뿐이다(`HOME_PC_CHECKLIST.md` 상단) (2) 9/15(월) 17:05 뒤 `docs/audits/validation_runs/ledger.jsonl` 에 `VS-20260915-DIANA-SHRINKAGE-CHECK` 줄이 생겼는지 — 없으면 Actions 탭에서 `ops-daily` 를 `apply=true` 로 1회 (3) 용량 정책 결정(`docs/HISTORY_PRESERVATION.md` §5) (4) Codex 가 있는 환경에서 `docs/agent/CODEX_SCENARIOS.md` §5 표 채우기 (5) 9/15 이후 매일 시황 글은 사람 또는 다른 AI 세션이 발행.
