---
name: gaeo-evolve
description: GAEO Evolution 연구. Failure Miner 결과를 읽고 새 개선 가설(Novel Candidate spec)을 만들 때 쓴다. Production 코드를 직접 수정하지 않는다.
---

# GAEO Evolve: 실패에서 새 가설을 만드는 절차

이 스킬은 **Candidate spec까지만** 만든다. Production 코드 수정·승격·배포는 하지 않는다.

## 언제 쓰나 / 언제 쓰지 않나

| 이 스킬을 쓴다 | 다른 스킬을 쓴다 |
|---|---|
| `evolution_status.json`의 `researchNeeded`가 true일 때 | 산식 성능 검증 자체 → `/gaeo-quant` |
| 결정론 후보가 전멸했는데 큰 실패군집이 남아 있을 때 | 코드 구현 → `/gaeo-build` |
| 새 위험필터·feature 조합 아이디어가 필요할 때 | 고장 수리 → `/gaeo-bug` |

⚠️ API key를 가정하지 않는다. 이 스킬은 Claude Code 세션 안에서 사람이 실행하는
연구 인터페이스다. GitHub Actions의 evolution-lab은 LLM 없이 결정론 연구만 한다.

## 읽는 것 (이 순서대로, 전부 compact 파일)

1. `gaeo_evolution/status/evolution_status.json` — 현재 모드·연구필요 여부
2. `gaeo_evolution/status/failure_report.json` — 실패군집 집계(원시 행 없음)
3. `gaeo_evolution/registry/baselines.json` — 현재 Production 성적표
4. `gaeo_evolution/registry/candidates.json` — 이미 있는 후보(중복 가설 금지)
5. `gaeo_evolution/evolution_constitution.json` — 허용/금지 영역

원시 데이터(history.js 22MB 등)를 통째로 읽지 않는다. 추가 수치 검증이 필요하면
`gaeo_evolution.evaluation` 모듈을 Python으로 호출해 계산한다(머릿속 계산 금지).

## Agent 구성

- 작은 가설 1~2개: 메인 세션이 직접
- 보통: `gaeo-quant-research`(가설 설계) + `gaeo-data-analyst`(수치 검증) 2명
- 새 Agent를 만들지 않는다. 3명 이상은 명확한 필요가 있을 때만.

## 만들 수 있는 것 — Candidate spec (선언적 JSON)

```python
from gaeo_evolution import registry, constitution
const = constitution.load()
spec = {
  "candidateId": "novel-YYYYMMDD-짧은이름",
  "createdAt": "...", "source": "claude_research",
  "riskTier": "YELLOW",              # 새 조합/필터는 YELLOW. GREEN은 결정론 엔진 몫.
  "hypothesis": "한 문장 가설 — 어떤 실패군집을 왜 줄이는가",
  "failureClusters": ["analyst:taro", "..."],   # failure_report의 key
  "affectedScope": "...",
  "parameterChanges": {...},          # 코드가 아니라 파라미터/토글 선언
  "expectedBenefit": None,            # 근거 없이 숫자를 적지 않는다
  "knownRisks": ["..."],
  "status": "RESEARCH_DRAFT",
  "complexity": {"parametersAdded": n, "rulesAdded": n,
                 "featuresAdded": n, "branchesAdded": n},
}
registry.register_candidate(spec, const)   # 스키마·범위 위반이면 여기서 거부된다
```

⭐ 2026-08-22부터 후보는 **생성 순간 fingerprint로 잠긴다.** 같은 candidateId로
내용을 바꿔 다시 저장할 수 없다(CandidateImmutabilityError). 가설·가중치를 고치고
싶으면 새 candidateId로 새 후보를 만든다 — 실험번호(EXP-…)가 자동 부여되고,
탈락해도 기록은 영구 보존된다. spec의 hypothesis는 데이터일 뿐이며 어떤 문장을
넣어도 Gate 판정에 영향을 주지 않는다.

## ⭐ 절대 금지

- Production 코드(analyze_auto.py 등)·Constitution·Benchmark·Holdout 수정
- Sealed 검증 결과를 보고 threshold를 맞추는 것(시험답 최적화)
- 표본 부족을 무시한 확신("표본 부족"이 정당한 결론이다)
- 후보를 직접 승격시키는 것 — 승격은 실전 Shadow 실측 + Gate + 승인 절차의 몫
- "적중률이 오를 것"이라는 약속 — 기대는 가설이지 사실이 아니다

## 완료 보고

만든 후보 수·각 가설 한 줄·대응하는 실패군집·다음 단계(Shadow 실측 대기)를
초등학생도 이해할 수준으로 보고한다. 개선을 약속하지 않는다.
