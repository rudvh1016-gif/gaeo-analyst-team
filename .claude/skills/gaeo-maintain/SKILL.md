---
name: gaeo-maintain
description: GAEO 운영 유지보수 진입점. STATUS·통합 점검·수리 요청서를 먼저 읽고 필요한 역할만 쓴다. 기본 동작은 진단이며 사용자가 요청한 수정은 서버가 정상이어도 수행한다.
---

# gaeo-maintain

사람이 개발 AI(Claude Code / Codex)를 켰을 때의 **첫 행동 순서**다. 평소 점검에는 AI가 상주하지 않는다 —
`pipeline-watchdog.yml`(장중 15분)·`ops-daily`(평일 17:15 KST)·`paper-health-alert`(16:30)가 LLM 호출 0으로 돌고,
이 스킬을 부르는 순간부터 구독 사용량이 든다. Codex는 이 문서를 일반 절차서로 읽고 그대로 따른다(`docs/agent/MIGRATION_MAP.md`).

## 0. 읽을 것 (이 순서, 이것만)
1. `docs/operations/STATUS.md` — 구간별 상태·기준 SHA·확정된 사실·다음 행동
2. `docs/HARNESS.md` — 검사 명령·배포·복구·중단 기준
3. 사고가 있으면 `docs/operations/repair_requests/INC-*.md`(같은 서명 = 같은 사고) 또는 최근 `pipeline-watchdog` run의 Step Summary
4. `AGENTS.md`의 작업 지도와 절대규칙은 항상 유효하다

## 1. 기본 동작 = 진단 (AI 0명)
```
python3 gaeo_check.py preflight
python3 ops_status.py --deep
python3 gaeo_check.py quick
```
- **점검만 요청받았고** 장애·확인 불가가 없으면 여기서 끝낸다. 정상 서버를 프롬프트 줄 채우려고 바꾸지 않는다.
- **사용자가 수정을 요청했으면**(예: "버튼 크기 고쳐줘") 서버가 정상이더라도 그 수정을 한다. "정상이면 종료"는 점검 요청에만 적용된다.
- 장애가 있으면 원인/의심/정상/확인 불가 표를 먼저 만든다. 로그의 꼬리만 읽고 단정하지 않는다(`docs/PIPELINE_WATCHDOG.md` 교훈 ⑤).

## 2. 역할 분담 (필요할 때만, 동시 2명 이내)
- 기본은 작업자 1명. 문구·화면·소규모 버그에 다중 Agent를 쓰지 않는다.
- 보안·원장·투자 성적 의미·배포 경계 변경만 분리된 검토 1명(다른 컨텍스트)을 거친다. 검토자는 findings와 근거만 돌려준다.
- 자식 Agent의 추가 생성 금지. 모델별 자동 배정·라우팅 설정을 만들지 않는다.

## 3. 수정·병합·배포 조건
- 실패 재현 검사 → 최소 수정 → `python3 gaeo_check.py quick`(해당 묶음) → `premerge` → PR → CI → 병합.
- 승인 범위는 그 세션의 사용자 지시 안에서만 유효하다(`docs/HARNESS.md` §3). 파괴적 작업은 항상 명시 승인.
- 장중(08:58~16:05 KST 평일)에 수집 워크플로 파일을 고쳐 올릴 때는 `branches: [main]` 가드와 `run:` 블록 크기를 먼저 잰다.

## 4. 끝낼 때
- `docs/operations/STATUS.md`의 해당 구간·"남은 위험·다음 행동"을 갱신하고 커밋한다.
- 설치됨 / 실제 작동함 / 성과 검증됨을 구분해 적는다. 확인 못 한 것은 "확인 불가"로 남긴다.
