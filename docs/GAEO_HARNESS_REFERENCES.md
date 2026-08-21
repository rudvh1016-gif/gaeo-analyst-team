# GAEO Harness 외부 참고자료 (확인일: 2026-08-21)

짧은 조사 원칙에 따라 1차 자료 중심으로만 확인했다. 외부 코드를 dependency로
넣지 않았고, 원리만 가져왔다.

## 확인한 자료

| 자료 | 형태 | 참고한 원리 |
|---|---|---|
| Self-Harness: Harnesses That Improve Themselves (arXiv 2606.09498) | 논문 | held-in/held-out 분리, "어느 쪽도 후퇴 없고 한쪽은 개선"일 때만 후보 수용 |
| Towards Trustworthy Agentic AI (arXiv 2605.23989) | 서베이 논문 | shadow/canary 단계 배포 + 자동 수용/롤백 기준 |
| Next-Gen Agentic RL Systems (arXiv 2607.01120) | 논문 | versioned resource·commit·rollback을 1급 객체로 |
| 10 Layers of Self-Improving Harness Stack (AlphaSignal) | 기술 글 | "모든 변경에 diff·이유·점수·되돌릴 길" 게이트 규칙 |
| What 1,000+ Harness Experiments Taught Me (henrypan.com) | 실무 글 | 한 split 개선이 다른 split 후퇴를 대가로 승격되는 것 금지 |
| How self-improving harnesses are rewriting… (TechTalks) | 기술 기사 | regression gate가 연쇄 고장(1개 고치고 3개 깨짐)을 막는 이유 |

OpenClaw 관련: 검색에서 공식 1차 문서를 특정하지 못해 **확인 불가로 기록한다**
(추측으로 인용하지 않는다). 대신 위 자료들이 같은 계열의 원리(memory lifecycle,
failure→경험, sandbox/shadow, budget)를 다룬다.

## GAEO에 채택한 것

- Regression Gate: 어떤 지표 하나가 좋아져도 다른 보호지표(방향균형·커버리지·
  Brier)가 후퇴하면 승격하지 않는다 → gate.py
- Baseline vs Challenger + Shadow: 기존 research_shadow 체계를 그대로 재사용
- Versioning·Trace: registry.py + manifest.py
- Memory lifecycle(candidate→validated→stale→deprecated): memory.py
- Budget/Permission boundary: Constitution + workflow allowlist

## 의도적으로 채택하지 않은 것

- 무제한 자기 코드 수정 · Benchmark/검증기준 자기 변경 (RED 영역으로 금지)
- 상시 수십 Agent swarm (기존 GAEO 운영규칙과 충돌 — 1~5명 원칙 유지)
- 전 종목 LLM 분석 (LLM 토큰 0 원칙 유지)
- 외부 Harness 프레임워크 통째 도입 (기존 구조 보존 우선)

원문 링크는 대화 기록(2026-08-21 WebSearch)에 있으며, arXiv 번호로 재검색 가능하다.
