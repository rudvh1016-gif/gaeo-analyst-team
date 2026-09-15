# GAEO 북극성 — 이 저장소는 무엇을 위해 존재하는가

작성 2026-09-15 · 근거: 소유자 지시 「GAEO — PERFORMANCE FIRST FOUNDATION」(2026-09-15)
· 시작 main `4b6a893638` / 실측 main `3e81022bfa`

> 읽는 순서: `AGENTS.md`(지도) → **이 문서**(왜) → `docs/HARNESS.md`(어떻게) →
> `docs/operations/STATUS.md`(지금 어디).
>
> 이 문서는 **방향**만 고정한다. 진도는 STATUS, 절차는 HARNESS, 경계·구간은 MASTER_PLAN,
> 통계 규칙은 `docs/gaeo_validation_policy.md`에 있다. 같은 내용을 여기에 복사하지 않는다.

---

## 1. 한 문장

**GAEO가 매일 내리는 600종목 판단이 실제로 투자자에게 도움이 되었는지를, 증거로 말할 수
있는 상태를 만드는 것**이 이 저장소의 목적이다.

"도움이 되었다"는 기분이나 화면 문구가 아니라 **채점된 실제 판단 기록**으로만 말한다.

## 2. 목적 · 제약 · 수단 (충돌하면 이 순서로 판단한다)

### 목적 (이루려는 것) — 단 하나

**판단의 질.** 실제로 낸 BUY/HOLD/SELL이 그 뒤 시장에서 어떻게 됐는가.

### 제약 (목적보다 우선하며 절대 넘지 않는 선)

1. **정직.** 증거가 없으면 성과를 주장하지 않는다. 표본이 모자라면 `INSUFFICIENT_EVIDENCE`
   라고 쓰고 숫자를 비워 둔다. 성과를 좋아 보이게 만들려고 표본 조건·채점 기준·임계값을
   완화하지 않는다. 결과를 본 뒤 가설을 바꾸지 않는다(`docs/gaeo_validation_policy.md` §13).
2. **원본 불변.** 과거 판단·과거 결과·원장은 소급 수정하지 않는다. 재구성 자료를 실전
   판단으로 둔갑시키지 않는다.
3. **비용 0.** 새 유료 API·새 서버·런타임 LLM을 늘리지 않는다. 600종목 자동분석의 LLM
   호출은 영구히 0이다.
4. **실주문 0.** 실제 주문·정정·취소·계좌 자금 이동은 구현하지도 호출하지도 않는다.

### 수단 (목적을 위한 것 — 목적 자체가 아니다)

실행 안정성(수집·분석 파이프라인이 끊기지 않는 것) · 감시와 워치독 · 화면과 디자인 ·
콘텐츠와 SEO · 성장과 수익화.

> ⚠️ 흔한 착각: "파이프라인이 안 끊기고 매일 잘 돌았다"는 **판단이 좋아졌다는 뜻이 아니다.**
> `docs/operations/MASTER_PLAN.md` §0-6이 같은 말을 한다 — "안정적인 실행과 꾸준한 수익은
> 별개다". 운영 지표가 전부 초록불이어도 §3의 성적표가 `INSUFFICIENT_EVIDENCE`면
> 목적은 아직 달성되지 않은 것이다.

## 3. "돈이 되었는가"를 무엇으로 재는가

**단일 집계 입구는 `real_outcome_scorecard.py`다**(사람용 요약 `python3 real_outcome_scorecard.py`,
기계용 `--json`). 이 스크립트는 **새로 계산하지 않는다** — 이미 있는 채점기를 불러 모으기만 한다.

| 무엇을 | 어디서 (원천 — 여기 말고 딴 데서 다시 만들지 말 것) |
|---|---|
| 판단 채점 규칙 | `compute_team_weights.score_call` (BUY ret>+1 적중 / SELL ret<−1 적중 / HOLD \|ret\|≤5 적중) |
| 결과 가격 | 판단일 **다음 N번째 거래일 종가**(달력일 아님) |
| 표본 선별 | `build_model_scoreboard.load_base_rows` (tier=auto · recon 제외 · withheld 분리 · 모델버전 분리) |
| 성적 블록 | `build_model_scoreboard.summarize_rows` → `model_scoreboard.js` |
| 원장 품질 | `decision_quality.summarize` → `model_scoreboard.js` `decisionTrace.quality` |
| 신뢰구간 | 판단일 블록 부트스트랩만 (`compute_team_weights._block_bootstrap`) |
| 공개 최소 표본 | `build_model_scoreboard.MIN_UNIQUE_DATES = 20` 판단일 |
| 사전등록 가설 | `evaluate_preregistered_buy_filters.py` (창 2026-09-07~, 평가 10/19) |

### 이 저장소가 채점하지 **않는** 것 (의도된 공백)

- **SELL을 공매도 손익으로 환산하지 않는다.** GAEO의 SELL은 "숏 진입"이 아니라
  **보유 청산·회피 신호**다. "SELL 뒤 −10%였으니 +10% 벌었다"는 계산은 저장소 어디에도
  없고, 만들지 않는다. 그건 없는 상품의 성과를 발명하는 것이다.
  `test_real_outcome_scorecard.py`가 이 금지를 잠근다.
- **거래비용을 뺀 순수익을 헤드라인 숫자로 쓰지 않는다.** 판단 성적표용 비용 가정이
  **등록되어 있지 않기 때문이다**(성적표는 `COST_ASSUMPTION_NOT_REGISTERED`로 표시한다).
  모의투자에는 등록된 비용 모델이 있었지만(`paper_engine.COST_MODEL_V1_2026H2`, 왕복 0.230%)
  그건 실측 호가 체결 기준이라 종가 채점에 그대로 옮길 수 없다. 참고값으로만 병기한다.
- **60D 성적은 표시하지 않는다.** 표본이 부족한 게 아니라 0건이다(정책 §4).

## 4. 오늘 실제 위치 (2026-09-15 실측 · `model_scoreboard.js` 03:34 UTC 생성분)

| 구간 | 판단일 | 성적 | 판정 |
|---|---|---|---|
| 현재 모델 `base-2026-08-15-parity-hotfix` · 600종목 | **17일** | 공개 안 함 | `INSUFFICIENT_EVIDENCE` (최소 20일) |
| 옛 모델 `PRE_HOTFIX_BASE` · 500종목 (~2026-08-14) | 33일 | 전체 51.0% (95% 구간 45.4~57.4) · BUY 38.2% · SELL 53.9% · HOLD 50.7% | 구간이 50%를 포함 → **실력 입증 아님** |

**그래서 지금 말할 수 있는 것은 "아직 말할 수 없다" 뿐이다.** 현재 모델은 3판단일이
모자라고, 옛 모델은 동전 던지기와 구분되지 않는다. 옛 모델의 BUY는 5거래일 평균
−1.34%였고 이건 거래비용을 빼기 **전** 값이다.

## 5. 대체되는 과거 계획 (지우지 않고 표시만 한다)

| 문서·항목 | 상태 | 이유 |
|---|---|---|
| `MASTER_PLAN.md` §1 구간 1 「개오팀 PAPER 실행 중단 확인·복구」 | **RETIRED (2026-09-15)** | 개오팀 모의투자는 은퇴했다. 모의투자는 PRIVATE 사이트에서만 한다 |
| `INVESTMENT_VALIDATION_GAP.md` 「모의투자(PAPER) 성과」 행의 다음 관문 | **RETIRED (2026-09-15)** | 같은 이유. 원장은 보존하고 신규 기록은 장애로 잡는다 |
| `operations/FINAL_REPORT_KO.md` 의 「집 PC 복구 도구 1회 실행」 | **HISTORICAL** | 2026-09-10 시점 보고다. 지금 집 PC에서 할 일은 스케줄러 해제 하나뿐 |
| `operations/STATUS.md` 「다음 담당자의 첫 행동」 (1) `paper_recover.ps1` | **SUPERSEDED** | 되살리기 절차는 참조본으로만 남는다(`HOME_PC_CHECKLIST.md` 상단) |
| `PAPER_TRADING_LOCAL_RUNNER.md` · `PAPER_TRADING_ORACLE_RUNNER.md` · `ORACLE_PAPER_MIGRATION_DECISION.md` | **RETIRED (표시 완료)** | 2026-09-15 은퇴 배너가 이미 붙어 있다 |
| `docs/FINAL_PRODUCT_MATURITY_PLAN.md` PR 4·5 | **HISTORICAL — 보류** | 화면·성장 작업이라 §2 「수단」에 속한다. 판단의 질보다 먼저 하지 않는다 |

**은퇴는 삭제가 아니다.** 코드·원장·문서·테스트는 전부 그대로 있고, 스위치만 내려갔다
(`paper_runner_config.json` `activeRunner: "RETIRED"`). 되살리려면 그 파일 하나를 되돌리면 된다.

## 6. 이 문서를 고치는 규칙

- §2의 목적·제약 순서를 바꾸는 것은 **소유자만** 할 수 있다. 에이전트가 "이게 더 급해
  보인다"는 이유로 순서를 바꾸지 않는다.
- §3의 원천 표에 줄을 추가하려면 **기존에 같은 계산이 없다는 것을 먼저 확인**한다.
  같은 데이터로 적중률이 70.7%와 51.2%로 갈렸던 사고가 실제로 있었다
  (`compute_team_weights.py` `score_call` 주석).
- §4의 숫자는 손으로 적지 않는다. `python3 real_outcome_scorecard.py`가 내는 값을 옮긴다.
- §5에 줄을 추가할 때 **원본 문서를 지우지 않는다.** 배너·표시만 붙인다.
