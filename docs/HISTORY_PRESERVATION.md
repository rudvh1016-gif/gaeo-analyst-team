# 저장소 이력 보존 — compact-history 의 위험, 결정, 비파괴 대안 (2026-09-10, 구간 8)

## 1. 무슨 일이 있었나 (사실)

- `compact-history.yml` 은 **매달 2일 06:30 KST** 에 "30일보다 오래된 커밋"을 `git replace --graft` + `git filter-branch` 로 하나의 뿌리로 합치고
  `git push --force-with-lease origin main` 을 했다. 첫 실행 2026-09-02 08:25 KST: 커밋 3,151개(`67c8d6ffb9` → `852814dfe8`)의 번호가 바뀌었다.
- graft 는 뿌리만 바꾸는 것 같지만 **뿌리 뒤의 모든 커밋 SHA 도 바뀐다**(부모가 바뀌면 SHA 가 바뀐다). 화면(HEAD 트리)은 같아도
  **커밋 번호로 가리키던 모든 참조가 끊긴다**: PR·문서(`docs/operations/STATUS.md` 의 기준 SHA)·검증 원장(`docs/audits/validation_runs/`의 `gitSha`)·
  다른 clone 의 HEAD.
- 실제 피해: 모의투자 러너 clone 이 공통 조상을 잃어 매 사이클 exit 6 → **8거래일(9/2~9/11) 기록 공백**(`docs/PAPER_TRADING_LOCAL_RUNNER.md` §9, 구간 1 에서 자가 복구 추가).
- 다음 예약 실행은 **2026-10-02 06:30 KST** 였다 — 사전등록 검증 창(9/7~10/19, 재확인 11/16) 한가운데다. 그날 다시 쓰면 9/15·9/23 검증 기록의 `gitSha` 가 저장소에 없는 번호가 된다.

## 2. 용량 사실 (2026-09-10 실측)

| 항목 | 값 | 어떻게 잰 것 |
|---|---|---|
| GitHub 집계 저장소 크기 | **1,972,394 KB ≈ 1.88 GiB** | GitHub API `size` (압축 8일 뒤) |
| 최근 7일 새로 생긴 이력 객체 | **542.7 MB** (≈ 2.3 GB/월 속도) | 이 세션 clone 에서 `git rev-list --objects --since=7d` + `cat-file objectsize:disk` |
| 하루 커밋 수 | 83~115건(거래일) | `update-prices`(10분)·`update-analysis`(30분) 자동 커밋 |
| 큰 생성 파일 | `analysis_data.json` 22.7 MB · `history.js` 19.8 MB (매 사이클 통째로 재커밋) | `ls -l` |
| GitHub 권장 | 1 GB 미만 권장, **5 GB** 를 넘지 않기를 강하게 권장. 파일 1개 50 MB 경고·100 MB 차단 | GitHub 문서(일반 상식 수준, 이 세션에서 재확인 못 함) |

이 속도면 압축 없이 **약 5~6주마다 1 GB** 가 늘어 2026년 11월 중순쯤 4 GiB, 2026년 12월에 5 GiB 근처에 닿는다(선형 가정. 실제 델타 압축률에 따라 다르다).
`check_history_evidence.py --report` 가 GitHub 집계값을 매일(ops-daily) 남기고 **3 GiB 에서 NOTICE, 4.5 GiB 에서 PROTECT** 로 표시한다.
토큰이 없거나 조회에 실패하면 **확인 불가**(UNKNOWN)로 적는다 — 정상으로 읽지 않는다. 로컬 clone 의 pack 크기는 얕은 clone 이면 뜻이 없어 참고로만 함께 적는다.

## 3. 결정 (2026-09-10, 이번 작업)

1. **월간 자동 재작성을 끈다.** `compact-history.yml` 에서 `schedule` 을 제거했다. 이제 사람이 `workflow_dispatch` 로 `confirm = COMPACT-MAIN-HISTORY` 를
   쳐야만 돈다. 되돌리기는 `schedule` 한 줄을 다시 넣는 것이지만, 그 전에 아래 4절의 대안을 먼저 본다.
2. 돌리더라도 **사전 점검을 통과해야 한다**(`check_history_evidence.py --precheck`): 얕은 clone 이면 거부 · KST 평일 08:30~16:40(수집기가 main 에 커밋) 거부 ·
   모의투자 러너 최근 2시간 활동 거부 · **검증 원장이 가리키는 커밋이 사라지면 거부**(`--allow-evidence-loss` 를 사람이 명시할 때만).
3. 돌린 뒤 **SHA 지도**를 남긴다: 옛 커밋 → 새 커밋 짝을 `docs/audits/history_rewrites/<시각>.json` 에 커밋한다(tree·author-time 으로 검산, 어긋나면 push 하지 않는다).
   `python3 check_history_evidence.py --translate <옛 SHA>` 로 증거 참조를 새 번호로 옮길 수 있다.
4. force push 는 여전히 `--force-with-lease` 만. `reset --hard`·`push --force` 없음.
5. 재작성 뒤 다른 clone 이 할 일을 이슈로 알린다(개발용 PC clone: `git fetch origin && git checkout -B main origin/main`, 로컬 변경은 먼저 보관.
   모의투자 러너는 안 올린 기록이 없으면 스스로 재기준한다 — 구간 1).

## 4. 비파괴 대안 (순서대로, 증거가 있어야 다음 단계)

| 대안 | 무엇 | 조건·증거 | 상태 |
|---|---|---|---|
| A. 용량 보고 | `check_history_evidence.py --report` 를 ops-daily 가 매일 남김. NOTICE/PROTECT 단계 표시 | 없음(읽기만) | **적용(이번)** |
| B. 커밋 빈도·크기 줄이기 | `analysis_data.json`(22.7 MB)·`history.js`(19.8 MB)를 매 사이클 통째로 커밋하는 것이 성장의 대부분. 예: 장중에는 `data.js` 만 커밋하고 큰 파일은 하루 1~2회 | 수집 워크플로(`update-*.yml`)는 "건드리지 말고 이해만" 대상 + `run:` 블록 여유 349~389B → 별도 설계·시험 필요. 화면·오프라인 캐시·성적표가 어느 파일의 어느 시각을 읽는지 표부터 | 미착수(설계 필요) |
| C. `data-live` 브랜치 분리 | 생성 데이터는 `data-live`, 코드는 보호된 `main`, Pages 는 둘을 합쳐 배포(`docs/BRANCH_GOVERNANCE_PLAN.md` 3단계) | (1) Pages artifact 배포 전환·캐시·신선도 검증 (2) **소비자 전환**: gaeo-private 가 `raw.githubusercontent.com/…/main/auto_analysis.js`·`tickers.js`·`indicators.json`·`dart_today.js` 를 읽는다 → URL 을 `data-live` 로 바꿔야 한다(다른 저장소 변경, 이번 범위 밖) (3) writer 6종(update-prices·update-analysis·market universe·research·rotation·paper) 허용 경로 각각 시험 (4) 최소 1거래일 shadow. `main` 이력은 멈추지만 `data-live` 는 그대로 자란다 — **용량 문제의 해결이 아니라 이동**이다. 용량은 B 또는 D 로만 준다 | 후보(보류) |
| D. 아카이브 저장소 | 오래된 이력을 별도 저장소로 밀어 두고 main 은 최근 N일만(지금 압축과 같은 효과이되 옛 이력이 **다른 저장소에 남는다**) | 재작성은 여전히 필요(SHA 지도 필수). 아카이브 저장소도 GitHub 용량이다 | 후보 |
| E. 수동 압축(가드 포함) | 3절 절차 | PROTECT(4.5 GiB) 도달 + 사전등록 창 밖(11/16 이후) + 사람 confirm | **비상용** |

## 5. 소유자가 정할 것

1. 압축을 끈 채로 두어도 되는가(≈ 2.3 GB/월 성장, 12월 5 GiB 근처) — 예: "PROTECT 표시가 나오기 전까지는 끄고, 그 사이 B 를 설계".
2. B(커밋 빈도 줄이기)를 설계할 것인가 — 수집 워크플로를 건드리는 일이라 별도 승인.
3. C(data-live)는 gaeo-private 쪽 URL 변경까지 따라오므로 두 저장소를 같이 다루는 작업으로만.
4. 압축을 정말 다시 켠다면 시점은 **2026-11-16 재확인 뒤**, 그리고 SHA 지도가 커밋되는 것을 한 번 확인한 뒤.

## 6. 관련 파일

`.github/workflows/compact-history.yml`(수동·가드) · `check_history_evidence.py` · `test_history_preservation.py` · `docs/audits/history_rewrites/`(지도) ·
`docs/BRANCH_GOVERNANCE_PLAN.md`(보호 규칙 단계) · `docs/PAPER_TRADING_LOCAL_RUNNER.md` §9 · `docs/operations/HOME_PC_CHECKLIST.md`
