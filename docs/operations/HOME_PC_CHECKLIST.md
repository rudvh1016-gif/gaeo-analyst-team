# 집 PC에서 할 일 — 모의투자 러너 되살리기 (2026-09-10 작성)

> 이 문서는 대표가 집 Windows PC 앞에서 그대로 따라 하는 순서다. 원격 세션은 집 PC에 접근할 수 없어
> 여기까지만 준비했다. 각 단계의 "확인" 줄이 맞으면 다음으로 간다. 맞지 않으면 그 자리에서 멈추고 결과를 복사해 둔다.
> Secret(토스 Client ID/Secret)은 어디에도 붙여넣지 않는다.

## 0. 왜 멈췄나 (한 줄)

9월 2일 새벽 GitHub의 "저장소 이력 압축" 작업이 main의 과거 커밋을 전부 새 번호로 바꿔 썼다. 집 PC의 러너 전용 저장소는
옛 번호를 기억하고 있어서, 매 사이클 "원격과 갈라짐 → 합치기 실패 → 중단(exit 6)"만 반복했다. 엔진은 한 번도 돌지 않았다.
(가장 유력한 원인이며 1단계 로그로 확정한다. 자세한 근거: `docs/operations/STATUS.md`)

## 1. 로그로 원인 확정 (읽기만)

메모장으로 연다: `%LOCALAPPDATA%\GAEO\logs\paper-2026-09-02.log`
(탐색기 주소창에 `%LOCALAPPDATA%\GAEO\logs` 를 붙여 넣으면 폴더가 열린다)

- 확인: 아래 세 줄이 보이면 원인 확정.
  - `remote sync: 로컬/원격이 갈라짐`
  - `rebase 충돌 — abort했다`
  - `최종 exit code: 6`
- 보이지 않으면: 2단계(진단 스크립트) 결과를 복사해 둔다. 원인이 다른 것이다.
- 가장 최근 로그(`paper-2026-09-09.log` 등)의 마지막 10줄도 복사해 둔다(보고용).

## 2. 진단 스크립트 (읽기 전용, 아무것도 고치지 않음)

개발용 저장소 폴더(`%USERPROFILE%\Desktop\gaeo-analyst-team`)에서 PowerShell을 열고:

```powershell
git pull
powershell -ExecutionPolicy Bypass -File scripts\paper_doctor.ps1
```

- 확인: `[O] 예약 작업 있음: GAEO Paper Trading`, `[O] 부트스트랩(run-paper.ps1)을 실행합니다`, 러너 저장소·마커 정상.
- `[X]` 항목이 있으면 그 옆의 "고치는 법"을 먼저 따른다(예약 작업이 꺼져 있음, 부트스트랩 경로 잘못됨 등).

## 3. 러너 저장소를 최신 main에 다시 맞추기 (이번 한 번은 손으로)

⚠️ 고친 코드(자동 재기준)는 GitHub main에 있지만, 러너 저장소는 **동기화가 안 돼서** 그 코드를 아직 못 받는다.
그래서 이번 한 번만 손으로 맞춘다. 다음부터는 코드가 스스로 처리한다.

러너 전용 저장소로 이동:

```powershell
cd $env:LOCALAPPDATA\GAEO\paper-runner\repo
git status --porcelain
```

- 확인: 아무 것도 출력되지 않으면(깨끗함) 계속. `paper_trading/...` 줄이 보이면 **먼저** 폴더 `paper_trading` 전체를
  바탕화면 등에 복사해 보관한 뒤 계속한다(잃지 않기 위해).

```powershell
git fetch origin main
git log --oneline -3 origin/main
git update-ref refs/gaeo-backup/manual-20260910 HEAD
git checkout -B main origin/main
git log --oneline -1
```

- 확인: 마지막 줄의 커밋이 `git log --oneline -3 origin/main` 첫 줄과 같다.
- 절대 하지 않는 것: `git reset --hard`, `git push --force`, `paper_trading` 폴더 삭제.

## 4. 한 사이클 손으로 돌리기

작업 스케줄러 → 작업 스케줄러 라이브러리 → **GAEO Paper Trading** → 마우스 오른쪽 → **실행**.
1~3분 뒤 오늘 로그(`%LOCALAPPDATA%\GAEO\logs\paper-YYYY-MM-DD.log`) 마지막 부분을 본다.

- 확인(정상): `remote sync: 이미 최신` 또는 `fast-forward 완료` → `paper_engine.py 정상 종료(exit 0)` → `push 결과: 성공` → `최종 exit code: 0`
- 장이 닫힌 시간(16시 이후·주말)에 돌리면 엔진이 `CYCLE_OK — 장외 시간 — 신규 진입 보류`로 끝나는 것이 **정상**이다.
  기록(`paper_trading/state.json`의 `lastCycleAt`)이 오늘 시각으로 바뀌고 push 되면 성공이다.
- `TOSS_MARKET_DATA_UNAVAILABLE` 또는 `HTTP 403`이 보이면: 집 공인 IP가 바뀐 것이다. 토스 개발자센터 허용 IP를 현재 IP로 다시 등록한다
  (`docs/PAPER_TRADING_LOCAL_RUNNER.md` 7절).

## 5. 다음 거래일 확인 (자동)

- 평일 09:05 첫 회차 뒤 GitHub `main`에 `paper: 가상매매 사이클 기록 (local runner) [skip ci]` 커밋이 30분마다 올라온다.
- 16:30 KST `paper-health-alert` 점검이 오늘 기록을 보면 Issue #481을 자동으로 닫는다. 사람이 닫지 않는다.
- 예상되는 **정상** 현상: 9/1에 들어간 보유 10건은 첫 장중 회차에 `MAX_HOLDING_5D`(5거래일 초과) 사유로 한꺼번에 청산된다.
  `holding_trading_days`가 5보다 크게 찍히고(지연 청산), 요약의 `dataGaps`에 9/2~복구일 날짜가 "관측 공백"으로 남는다.
  과거 날짜로 거래를 만들어 넣지 않는다(소급 금지). 이것은 고장이 아니라 공백을 정직하게 남기는 설계다.

## 6. 하지 않는 것

- Oracle VM에 개오팀 PAPER를 설치·전환하지 않는다(이번 작업 범위에서 조건 미충족: VM 자원 미확인, Private 안정화 작업이 같은 VM에서 진행 중).
- `paper_runner_config.json`의 `activeRunner`를 바꾸지 않는다(계속 `WINDOWS`).
- 러너 저장소에서 개발 작업을 하지 않는다.

## 7. 보고용으로 복사해 둘 것

1. 1단계 로그의 해당 세 줄(있으면) 또는 없다는 사실
2. 2단계 진단 결과의 `===== 진단 결과 =====` 아래 부분
3. 4단계 로그의 마지막 5줄
