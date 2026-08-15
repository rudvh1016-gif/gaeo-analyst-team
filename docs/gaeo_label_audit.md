# GAEO 라벨(정답 기준) 감사

작성일 2026-08-15 · PHASE A · Production 로직 변경 없음

---

## 1. 현재 실제 코드의 정답 기준 (LEGACY_LABEL)

`index.html` `scoreCall(call, retPct)`:

```
BUY  : retPct >  1  → 적중 / retPct < -1 → 빗나감 / 그 외 중립
SELL : retPct < -1  → 적중 / retPct >  1 → 빗나감 / 그 외 중립
HOLD : |retPct| <= 5 → 적중 / 그 외 중립
```

`retPct`는 판단 기준가(base) 대비 **5거래일 뒤 종가**의 절대 수익률이다.

## 2. 확인된 문제 2가지

### 2-1. 밴드 폭이 판단 종류마다 다르다 (±1% vs ±5%)

화면 설명대로 BUY/SELL은 ±1%, HOLD는 ±5%를 쓴다.
따라서 세 숫자를 나란히 놓고 비교하는 것은 **공정하지 않다**.

같은 밴드로 통일해 다시 계산한 실측 결과:

| 통일 기준 | BUY | HOLD | SELL |
|---|---|---|---|
| ±1% | 43.3% | **12.3%** | 53.7% |
| ±3% | 42.3% | 33.9% | 53.6% |
| ±5% | 40.7% | **50.2%** | 52.9% |

HOLD 적중률은 밴드 폭에 따라 12.3%에서 50.2%까지 움직인다.
즉 HOLD 성적의 상당 부분은 실력이 아니라 **밴드 폭 선택의 결과**다.

### 2-2. 절대수익률 기준이라 시장 방향을 측정한다

HOLD 분기는 `miss`를 반환하는 경로가 아예 없다(적중 아니면 중립).
이 부분은 2026-08-14에 성적표 표시용으로 `scTally(holdStrict)`가 도입돼
±5% 이탈 시 빗나감으로 세도록 보완됐으나, `scoreCall` 원본은 그대로다.

절대수익률 채점의 구조적 결과는 `gaeo_sell_forensic_audit.md` 6장 참조.
요약하면 시장이 오른 주에는 BUY가, 내린 주에는 SELL이 자동으로 맞는다.

## 3. LEGACY_LABEL 보존

위 정의를 `LEGACY_LABEL`로 그대로 보존한다. 삭제하지 않는다.
Research 결과와 항상 같은 Timestamp에서 나란히 비교할 수 있어야 한다.

## 4. RESEARCH_LABEL 후보 (PHASE B에서 검증, 아직 미적용)

```
excess = future_return - 같은 날 시장(500종목) 중앙값 수익률

BUY  : excess >  +delta
HOLD : -delta <= excess <= +delta
SELL : excess <  -delta
```

추가 후보: 변동성 조정 delta(종목별 변동성으로 delta를 스케일).

**delta는 TRAIN/VALIDATION에서만 정한다. FINAL TEST 결과를 보고 바꾸지 않는다.**

## 5. Horizon 분리 (PHASE B)

현재는 5거래일 단일이다. 최소 5D / 20D / 60D로 분리하고
각 Horizon마다 라벨, 모델, 확률, Calibration, 성적표를 따로 가진다.
1D는 충분한 검증 전까지 EXPERIMENTAL로 둔다.

## 6. 아직 답하지 못한 것

- 변동성 조정 delta가 고정 delta보다 실제로 나은지 (PHASE D에서 OOS 확인 필요)
- HOLD를 "적극적 판단"으로 볼지 "판단 보류"로 볼지의 정의 문제
