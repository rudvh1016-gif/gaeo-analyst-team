# 판단 영향 그림자 비교 (OFFLINE SHADOW) — 2026-09-16

입력: analysis_data.json 2026-09-16 16:02 · data.js `2026-09-16 종가 (16:01 수집) · ⚠️ 1종목 지연` · 600종목 · 시장국면 down_low

baseline 판정 {'BUY': 28, 'HOLD': 423, 'SELL': 149, 'JUDGMENT_WITHHELD': 0} (평가 600종목) · Production 변경 0 · 네트워크 0

| 시나리오 | 판정 바뀜 | 전이 | 종합점수 |Δ| 평균/p90/최대 | TARO/DIANA/QUANT/FLOW |Δ| 평균 | 축 소실 | 보류 |
|---|---|---|---|---|---|---|
| `lag1_official_close` | 72 (12.0%) | BUY→HOLD 8 HOLD→BUY 15 HOLD→SELL 21 SELL→HOLD 28 | 1.83/5/15 | 5.82/0.47/2.08/0.0 | - | 0 |
| `no_consensus` | 51 (8.5%) | BUY→HOLD 9 HOLD→SELL 42 | 0.94/2/3 | 0.0/7.59/0.0/0.0 | - | 0 |
| `no_flow` | 99 (16.5%) | HOLD→BUY 49 HOLD→SELL 41 SELL→HOLD 9 | 2.35/5/10 | 0.0/0.0/0.0/- | flow:599 | 0 |
| `per_pbr_from_close_eps_bps` | 0 (0.0%) | - | 0.0/0/2 | 0.0/0.01/0.0/0.0 | - | 0 |
| `official_free_only` | 133 (22.2%) | BUY→HOLD 4 HOLD→BUY 44 HOLD→SELL 66 SELL→HOLD 19 | 3.53/8/24 | 5.82/7.62/2.08/- | flow:599 | 0 |

시나리오 설명:
- `lag1_official_close`: T+1 공식 자료만 있을 때(마지막 봉 제거 · 가격=직전 확정 종가 · PER/PBR/목표가 괴리 재계산)
- `no_consensus`: 컨센서스(목표주가·추정EPS·투자의견) 없음
- `no_flow`: 수급(외국인·기관·개인) 없음 → CHIEF 3축 재정규화
- `per_pbr_from_close_eps_bps`: PER/PBR 을 종가÷EPS·BPS 로 재계산(DART 재구성 시 정의 차이)
- `official_free_only`: lag1 + no_consensus + no_flow + per_pbr 재계산(무료 공식 자료만 쓸 때의 근사)

⚠️ 점수 차이는 같은 산식·같은 가중치로 입력만 바꿔 다시 계산한 값이다. 네이버 값을 정답으로 두지 않았다. 종목별 원자료 값은 싣지 않는다.
