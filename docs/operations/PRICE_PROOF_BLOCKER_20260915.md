# 왜 봉인 원장은 한 건도 채점되지 않는가 — 역추적 결과 (2026-09-15)

근거 main `f6e9908239` · 전부 읽기 전용 실측 · LLM 0 · 네트워크 0

> ## 한 줄 결론
>
> **막고 있는 것은 KRX 자료 접근 권한이 아니다.** 판단을 저장하는 쪽(생산자)이
> **기준가격을 언제 관측했는지를 기록하지 않아서**, 지금 있는 **7,200행 전부가**
> 구조적으로 `comparable` 이 될 수 없다. 어떤 공식 가격 자료를 가져와도 마찬가지다.

---

## 1. 실측 — 봉인 원장 7,200행

```
전체 봉인 원본 행: 7,200  (파일 12개, research_archive/decisions/originals/)
  priceObservedAt 있음        0  (0.0%)
  priceObservedAt null    7,200  (100.0%)
  priceBasis  {"verified": false, "reason": "price_basis_unverified"}  → 7,200건
판단일: 2026-09-11 600 · 2026-09-14 600 · 2026-09-15 6,000
comparisonState: unknown 1,800 · comparable 0 · adjustment_required 0 · review_required 0
```

## 2. 역추적 — `comparable` 이 되려면 무엇이 필요한가

`comparison_evidence.py` `_price_proof()` 가 요구하는 것(전부 통과해야 함):

| # | 요구 | 근거 위치 |
|---|---|---|
| 1 | `recordId` 일치 + `originalRecordHash == hash(record)` | `_price_proof` 앞부분 |
| 2 | `ticker == record.code`, `period == {from: 판단일, to: 5번째 거래일}` | 〃 |
| 3 | `observedAt` 이 평가 종료일 **이후**이고 now 이전 | 〃 |
| 4 | `source == 'KRX'` + `_reference(proof)`(원문 바인딩) | 〃 |
| 5 | **`record.priceObservedAt` 이 존재하고, `decisionAt` 이전이며, 그 KST 날짜가 판단일과 같을 것** | `not original_at or original_at > ... or original_at.date() != start` |
| 6 | `basisEvidence` — basis(adjusted/unadjusted)를 JSON Pointer 로 원문에 바인딩 | 〃 |
| 7 | `originalPriceEvidence.value == record.base`, `basis == 'unadjusted'`, 경로 바인딩 | 〃 |
| 8 | `prices` 가 판단일~평가일 **모든 거래일**을 빠짐없이, 각각 `final: true`·양수 종가·거래정지 아님 | 〃 |
| 9 | `basis == 'adjusted'` 면 `adjustment.multiplier` + `receiptIds` + 경로 바인딩 | 〃 |

**5번에서 전부 막힌다.** `priceObservedAt` 이 `None` 이면 `not original_at` → `price_evidence_invalid`.
6~9번을 아무리 완벽히 갖춰도 5번을 넘지 못한다.

## 3. 왜 비어 있나 — 생산자 쪽 공백

```
decision_records.make_record()   'priceObservedAt': stock.get('priceObservedAt')   ← 여기서 읽는다
        ↑
auto_analysis.js (analyze_auto)  종목 객체에 priceObservedAt 를 담지 않는다
        ↑
data.js (update_prices)          종목 필드: cap · div · eps · name · pbr · per ·
                                 price · rate · roe · stale · w52   → 관측시각 없음
                                 전역 라벨만 있다: "2026-09-15 종가 (16:00 수집) · ⚠️ 1종목 지연"
```

`decision_records.py` 의 주석이 이 상황을 이미 알고 있고, **일부러** 라벨에서 시각을 추측하지 않는다:

> `# Preserve source values; never infer a price-observation minute from a label.`

**이 판단은 옳다.** 저 라벨은 회차 전체에 붙는 사람용 문구이고, 같은 회차 안에서도
「1종목 지연」처럼 종목마다 사정이 다르다. 라벨을 종목별 관측시각으로 바꿔 쓰면
**없던 정밀도를 지어내는 것**이 된다.

즉 이건 버그가 아니라 **아직 만들지 않은 생산 단계**다.

## 4. 그래서 무엇이 참이고 무엇이 거짓인가

| 흔한 추측 | 실측 |
|---|---|
| "KRX API 접근 권한이 없어서 막혔다" | **아니다.** 5번 조건은 외부 자료와 무관하다. 우리가 저장하지 않은 것이다 |
| "기업행사(DART·KIND) 증거를 채우면 채점이 시작된다" | **아니다.** 그건 C 칸(기업행사 근거)이고, 5번은 B 칸(가격 근거)이다. C 를 다 채워도 B 에서 막힌다 |
| "5거래일이 지나면 채점된다" | **아니다.** 결과 미도래(A)가 풀려도 B 가 남는다 |
| "과거 기록을 소급해서 채울 수 있다" | **하면 안 된다.** 판단 당시 없던 정보를 그때 알고 있었던 것처럼 넣는 것이다 |

## 5. 고칠 수 있는 것 — 미래 판단부터만

**판단 공식은 손대지 않는다. 출처 보존만 더한다.**

필요한 최소 변경(설계):

1. `update_prices.py` 가 종목을 가져올 때 **그 종목의 응답을 받은 시각**을 남긴다.
2. 그 값을 `auto_analysis.js` 의 종목 객체까지 전달한다(`analyze_auto.py`).
3. `make_record` 는 이미 `stock.get('priceObservedAt')` 를 읽으므로 **코드 변경 없이** 채워진다.
4. 보존 시작일을 선언하고, 그 이전 기록은 영원히 `null` 로 남긴다(소급 금지).

### ⚠️ 이번에 구현하지 않은 이유

- 2·3 은 **`data.js` 종목 스키마에 필드를 더하는 일**이다. `data.js` 는 공개 화면과
  **Private 쪽도 읽는 공용 출력**이라, 필드 추가는 공용 계약 영향을 먼저 확인해야 한다
  (`MASTER_PLAN` §2 「공용 출력의 의미·경로·필드를 바꾸면 영향을 줄 수 있다」).
- 대안으로 `data.js` 를 건드리지 않고 **별도 출처 파일**에 종목별 관측시각을 쓰는 방법이 있다.
  이쪽이 공용 계약에 안전하지만, 어느 쪽이든 **실제 수집 러너가 한 번 돌아야** 검증된다.
- 지금은 장 마감 후(16:00 이후)라 수집기가 돌지 않는다. 코드만 넣고 실제 실행을 못 본 채
  "자료 공급을 고쳤다" 고 보고하지 않기 위해 **다음 작업으로 넘긴다.**

### OWNER_DECISION_REQUIRED — 하나

**종목별 가격 관측시각을 어디에 저장할 것인가**
- (a) `data.js` 종목 객체에 `priceObservedAt` 필드 추가 — 경로가 짧지만 공용 출력 스키마가 바뀐다
- (b) 별도 출처 파일(예: `research_archive/decisions/price_provenance/<날짜>.json`) — 공용 출력 무변경, 연결 한 단계 추가

이것만 정해지면 나머지는 기계적이다.

## 6. 그때까지 정직하게 보이는 것

`real_outcome_scorecard.py` 의 `readiness` 가 §7 다섯 칸으로 가른다.
「기다리는 중」과 「근거가 없어 못 함」을 섞지 않고, **모르는 사유는 정상 대기로 세지 않는다**
(`UNCLASSIFIED`). 오늘 실측은 A(결과 미도래) 1,800건 · comparable 0건이다.

A 가 풀리는 첫날(2026-09-18 전후)에 **B 가 드러날 것**이다. 그때 이 문서가 그 이유를 이미 설명한다.

---

## 7. 후속 (2026-09-15 밤) — 소유자가 (b) 를 택했고, 생산자 쪽은 닫혔다

소유자 확정: **(b) 별도 출처 파일 방식.** `data.js` 공개 구조 무변경.

구현·시험 완료. 자세한 내용은 **`docs/operations/PRICE_PROVENANCE_20260915.md`**.

이 문서의 §5 에서 예시로 적었던 경로(`research_archive/decisions/price_provenance/<날짜>.json`)는
**쓰지 않았다.** 날짜 파일 하나를 매 회차 덮어쓰면 회차가 섞이기 때문이다. 대신:

* 한 회차의 출처 = 저장소 최상위 `price_provenance.json` (`data.js` 와 같은 주기로 덮어씀,
  내용 식별자 `roundId`·`snapshotId` 를 품는다)
* 영구 보존 = **기존 봉인 원장**(`research_archive/decisions/originals/`)에 판단 기록마다 함께 봉인.
  새 아카이브를 따로 만들지 않았다.

### 위 §2 표의 5번은 이제 신규 판단에 한해 풀린다 — 나머지 8줄은 그대로다

`priceObservedAt` 이 채워져도 `_price_proof` 는 **여전히 통과하지 않는다.** 1~4·6~9번은
**외부 KRX 가격증명 문서**를 요구하는데, 그 문서를 만드는 코드가 저장소에 없다
(`decision_records.py --price-proof <파일>` 입구만 있고, `price_proofs/` 디렉터리는 아직 없다).

즉 **"내부 기록 누락"은 필요조건 하나였을 뿐이고, 외부 자료 요구는 그대로 남아 있다.**
`test_price_provenance.Ledger.test_18_*` 가 "출처 기록만으로는 공식 가격증명을 통과하지 못한다"를
계약으로 고정한다.

### §6 의 예고는 그대로 유효하다

과거 7,200행은 **소급 수리하지 않았다.** A(결과 미도래)가 풀리는 첫날에도 그 1,800건은
관측시각이 없어 채점되지 않는다. 바뀌는 것은 **이 변경 이후의 새 판단**부터다.
