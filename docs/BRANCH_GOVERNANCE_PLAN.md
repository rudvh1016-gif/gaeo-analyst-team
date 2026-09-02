# GAEO main 브랜치 거버넌스 도입 계획

감사일: 2026-09-02 KST  
감사 기준: `origin/main` `3704c7e1c77c893e049814f04183d0eab659f57b`  
상태: 계획만 작성함. 저장소 설정은 변경하지 않음.

## 1. 현재 상태

- `main` 브랜치 보호: 꺼짐
- repository ruleset: 없음
- 열려 있는 PR: 없음
- CI: `.github/workflows/ci.yml`의 `contract-tests` 잡이 `main` 대상 PR에서 읽기 전용으로 실행됨
- 외부 PR이 쓰기 워크플로를 실행하는 경로: 현재 확인되지 않음
- `pull_request_target` 사용: 없음
- 공개 브라우저의 GitHub Contents API 발행: 이번 Safety Gate에서 제거

이 상태에서 PR 의무, force push 금지, 삭제 금지를 한 번에 강제하면 장중 데이터와 연구 기록을 직접 `main`에 쓰는 자동화가 멈춘다. 보호 규칙을 켜기 전에 각 쓰기 주체의 새 경로가 필요하다.

## 2. main 쓰기 주체 목록

| 분류 | 주체 | 현재 쓰는 범위 | 방식 | 보호 규칙과의 충돌 |
|---|---|---|---|---|
| 사람 코드 | 저장소 소유자와 승인된 작업 에이전트 | 코드, 문서, 콘텐츠 | 브랜치, PR, merge | 없음. 목표 구조와 일치 |
| 가격 생성 | `update-prices.yml` | `data.js` | 장중 반복, 직접 push | PR 의무와 충돌 |
| 분석 생성 | `update-analysis.yml` | 가격 이력, 지표, 자동분석, 판단 기록, 스냅샷, 일부 연구 아카이브 | 장중 반복, 직접 push와 재시도 merge | PR 의무와 충돌 |
| 시장 유니버스 | `market-universe-smoke-test.yml`, `sector-source-refresh.yml` | `market_universe/` | 허용 경로만 직접 push | PR 의무와 충돌 |
| 진화 연구 | `evolution-lab.yml` | `gaeo_evolution/` 연구 산출물 | 주간 직접 `HEAD:main` push | PR 의무와 충돌 |
| 연구 아카이브 | `research-archive.yml`, `dart-live-smoke-test.yml` | 암호화 연구 아카이브 | 직접 main push | PR 의무와 충돌 |
| 순환매 | `rotation-maintenance.yml` | 순환매 모델·스냅샷 | 직접 main push | PR 의무와 충돌 |
| 모의투자 | `paper-trading.yml` | `paper_trading/`, `paper_public.js` | 선택한 ref에 직접 push | main 실행 시 PR 의무와 충돌 |
| 로컬 모의투자 | `scripts/paper_cycle.ps1`, `scripts/paper_cycle.sh` | `paper_trading/`, `paper_public.js` | main fetch/rebase 후 직접 push | PR 의무와 충돌 |
| 레거시 가격 업로더 | `push_if_changed.sh` | `data.js`, `price_history.js` | main pull/rebase 후 직접 push | PR 의무와 충돌 |
| 이력 압축 | `compact-history.yml` | main 전체 Git 이력 | `filter-branch` 후 `--force-with-lease` | force push 금지와 직접 충돌 |
| 운영 제어 | `pipeline-watchdog.yml` | 파일 쓰기 없음 | Actions 실행 취소·재기동 | main 보호와 충돌 없음 |
| 보고·알림 | `paper-evidence-report.yml`, `paper-health-alert.yml` | 파일 쓰기 없음 | Issue 쓰기 | main 보호와 충돌 없음 |
| 테스트 | `ci.yml`, `toss-market-data-smoke-test.yml` | 파일 쓰기 없음 | 읽기 전용 | main 보호와 충돌 없음 |

## 3. 목표 구조

### 사람 코드와 공개 콘텐츠

1. 별도 브랜치에서 변경한다.
2. PR을 만든다.
3. `contract-tests` 성공과 대화 해결을 요구한다.
4. force push와 branch 삭제로 `main`을 바꾸지 못하게 한다.
5. 긴급 상황도 가능하면 revert PR로 복구한다.

### 생성 데이터

권장안은 생성 전용 `data-live` 브랜치와 Pages 배포 잡을 분리하는 것이다.

```text
사람 코드 PR -> protected main
자동 생성 -> data-live의 허용 경로
Pages 배포 -> main 코드 + data-live 최신 데이터 -> 배포 artifact
```

이 구조면 10분마다 PR을 만들지 않고도 `main`을 코드 경계로 보호할 수 있다. Pages가 현재 `main` 파일을 그대로 서비스하므로, 배포 artifact 전환과 캐시·신선도 검증을 먼저 완료해야 한다. 이 마이그레이션은 별도 작업으로 진행하며 운영 데이터를 조용히 멈추지 않는다.

차선안은 전용 GitHub App을 만들어 필요한 자동화만 제한된 토큰을 발급받고 ruleset bypass actor로 지정하는 것이다. 다만 branch bypass는 파일 경로별 권한이 아니므로, App 토큰을 얻은 워크플로가 `main` 전체를 쓸 수 있다. 워크플로 파일을 CODEOWNERS로 잠그고, 토큰을 untrusted PR에 절대 노출하지 않는 추가 통제가 필요하다. 기본 `github-actions[bot]` 전체를 bypass actor로 두는 방식은 권장하지 않는다.

## 4. 권장 ruleset

Ruleset 이름: `main-release-safety`  
대상: 기본 브랜치 `main`

1. 첫 주에는 `Evaluate`로 만들고 위반 기록만 관찰한다.
2. 다음 규칙을 목표로 한다.
   - Restrict deletions
   - Block force pushes
   - Require a pull request before merging
   - Required approvals: 소유자 1인 저장소라면 0으로 시작하고, 외부 승인자가 생기면 1로 올림
   - Require conversation resolution
   - Require status checks: `contract-tests`
   - Require branches to be up to date: 데이터 생성 빈도가 높으므로 마이그레이션 후 충돌률을 본 뒤 결정
3. Signed commits와 linear history는 GitHub Actions 및 현재 merge 전략과 충돌하므로 1차 도입에 포함하지 않는다.
4. bypass는 기본적으로 비워 둔다. 긴급 복구가 필요하면 저장소 관리자 역할에 `For pull requests only`를 우선 검토한다.

GitHub의 ruleset은 여러 규칙을 함께 적용하고 evaluate 상태에서 영향을 미리 볼 수 있다. bypass 권한은 규칙 전체를 건너뛸 수 있으므로 최소화해야 한다. 공식 설명: [repository ruleset 만들기](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [사용 가능한 규칙](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [ruleset 개요](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

## 5. 단계별 도입 순서

### 0단계: 현재 완료

- PR CI가 읽기 전용인지 확인
- 공개 브라우저의 PAT 저장과 직접 main 쓰기 제거
- main 쓰기 주체 전수 목록화
- 저장소 설정은 그대로 유지

### 1단계: 관찰

- `main-release-safety` ruleset을 `Evaluate`로 생성
- 7일 동안 어떤 워크플로가 PR, force push, 최신 브랜치 요구에 걸리는지 기록
- 파이프라인 신선도 경고와 실제 산출물 시각을 함께 확인

### 2단계: 파괴적 이력 변경 제거

- `compact-history.yml` 예약 실행을 멈추기 전에 저장소 용량 대안을 확정
- 이미 서비스 중인 최신 파일은 보존
- 신규 생성 원본을 Git 이력 밖 artifact 또는 별도 데이터 저장소로 옮기는 방안을 검증
- 정상 이력에서 force push가 더 이상 필요하지 않게 만든 뒤 Block force pushes를 활성화

### 3단계: 생성 데이터 분리

- `data-live` 브랜치와 Pages artifact 배포를 시험
- `update-prices`, `update-analysis`, market universe, research, rotation, paper writer의 허용 경로를 각각 테스트
- 최신 시세와 분석 시각, 오프라인 캐시, 스냅샷 로딩이 기존과 같은지 확인
- 최소 1거래일 shadow 검증 뒤 writer를 하나씩 전환

### 4단계: main 강제 보호

- PR 의무, `contract-tests`, 대화 해결, 삭제 금지, force push 금지를 Active로 전환
- 기본 Actions 권한은 읽기로 유지하고 각 workflow에 필요한 권한만 명시
- 쓰기용 secret은 `pull_request`와 fork 실행에 제공하지 않음
- workflow 파일 변경은 CODEOWNERS와 소유자 검토 대상으로 지정

## 6. 예상 중단과 예외

- 지금 PR 의무를 활성화하면 직접 main에 쓰는 가격, 분석, 연구, 순환매, 모의투자 갱신이 실패한다.
- 지금 force push를 막으면 월간 `compact-history`가 실패한다.
- GitHub Actions 전체를 bypass로 지정하면 악성 또는 실수로 병합된 workflow가 보호를 우회할 수 있다.
- `pull_request_target`은 현재 없으며 추가하지 않는다. 이 이벤트에서 PR 코드를 checkout한 뒤 write token이나 secret을 쓰면 신뢰하지 않는 코드가 권한을 얻을 수 있다. GitHub 공식 보안 안내: [GitHub Actions의 GITHUB_TOKEN](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication), [workflow 보안](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).

## 7. 장애 복구와 롤백

### 잘못된 코드·콘텐츠 병합

1. 해당 PR의 merge commit을 찾는다.
2. GitHub의 Revert 기능 또는 새 브랜치의 `git revert`로 되돌림 커밋을 만든다.
3. 같은 `contract-tests`를 통과시킨 뒤 복구 PR을 병합한다.
4. force push나 `reset --hard`로 공개 이력을 지우지 않는다.

### 잘못된 생성 데이터

1. 해당 writer를 수동 중지하거나 재기동 체인을 일시 중단한다.
2. 마지막 정상 생성 커밋과 잘못된 파일 경로를 확인한다.
3. 정상 입력으로 재생성하는 것을 우선한다.
4. 재생성이 불가능하면 마지막 정상본의 해당 생성 파일만 복구 커밋으로 되돌린다.
5. `history.js`와 모의투자 원장은 append-only 의미를 확인하고, 이미 공개된 기록을 덮어쓰기 전에 별도 사고 메모를 남긴다.

### ruleset 자체가 운영을 막음

1. 저장소 소유자가 Rules 화면에서 실패한 규칙과 actor를 확인한다.
2. 데이터 신선도에 실제 영향이 있으면 ruleset을 `Evaluate`로 되돌린다.
3. 전체 삭제 대신 문제 규칙 하나만 비활성화한다.
4. 원인과 해제 시각, 영향을 문서화하고 수정 PR 후 다시 Active로 전환한다.

## 8. 정확한 수동 설정 절차

자동으로 실행하지 않는다. 저장소 소유자가 생성 데이터 마이그레이션 준비를 확인한 뒤 수행한다.

1. GitHub 저장소의 `Settings`를 연다.
2. 왼쪽 메뉴 `Rules`에서 `Rulesets`를 연다.
3. `New ruleset`에서 `New branch ruleset`을 선택한다.
4. 이름을 `main-release-safety`로 입력하고 Enforcement status를 `Evaluate`로 둔다.
5. Target branches에서 `Include default branch`를 선택한다.
6. 4절의 규칙을 선택하되, 처음에는 bypass actor를 추가하지 않는다.
7. Required status checks에서 최근 PR에 실제 표시된 `contract-tests`를 선택한다.
8. 저장 후 7일 동안 Insights의 rule evaluation과 Actions 실패를 확인한다.
9. `compact-history`와 직접 main writer가 전환되기 전에는 Active로 바꾸지 않는다.
10. 전환과 shadow 검증이 끝난 뒤 Enforcement status를 `Active`로 변경한다.

브랜치 보호는 force push 허용과 삭제 허용을 별도로 제어한다. 공식 설명: [protected branches 관리](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

