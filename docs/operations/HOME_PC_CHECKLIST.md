# 집 PC에서 할 일 — 모의투자 러너 되살리기 (2026-09-10 작성 · 같은 날 구간 A로 안전 절차 교체)

> 이 문서는 대표가 집 Windows PC 앞에서 그대로 따라 하는 순서다. 원격 세션은 집 PC에 접근할 수 없어(2026-09-10 확인: 클라우드 VM,
> 원격 제어 연결 없음) 여기까지만 준비했다. 각 단계의 "확인" 줄이 맞으면 다음으로 간다. 맞지 않으면 **그 자리에서 멈추고** 화면 내용을 복사해 둔다.
> Secret(토스 Client ID/Secret)은 어디에도 붙여넣지 않는다. 걸리는 시간은 약속하지 않는다 — 단계마다 멈출 조건이 있기 때문이다.

## 0. 왜 멈췄나 (유력 가설 — 집 PC 로그로 확인하기 전까지는 확정이 아니다)

9월 2일 새벽 GitHub의 "저장소 이력 압축" 작업이 main의 과거 커밋을 전부 새 번호로 바꿔 썼다. 집 PC의 러너 전용 저장소가 옛 번호를
기억하고 있으면 매 사이클 "원격과 갈라짐 → 합치기 실패 → 중단(exit 6)"만 반복하고 엔진은 한 번도 돌지 않는다.
원격에서 볼 수 있는 근거(9/2 08:25 KST force push, 그 뒤 집 PC 커밋 0건)는 이 가설과 맞지만, **집 PC 로그를 아직 아무도 읽지 않았다.**
1단계에서 로그를 읽어야 확정된다. 다른 원인(PC 꺼짐·절전, 예약 작업 꺼짐, 토스 허용 IP 변경, 디스크·권한)일 수도 있다. (근거: `docs/operations/STATUS.md`)

## 1. 로그 읽기 (읽기만) — 여기서 원인이 갈린다

메모장으로 연다: `%LOCALAPPDATA%\GAEO\logs\paper-2026-09-02.log`
(탐색기 주소창에 `%LOCALAPPDATA%\GAEO\logs` 를 붙여 넣으면 폴더가 열린다)

- 아래 세 줄이 보이면 0절 가설이 맞는 것이다(원인 확정). 2절 → 3절로 간다.
  - `remote sync: 로컬/원격이 갈라짐`
  - `rebase 충돌 — abort했다`
  - `최종 exit code: 6`
- 보이지 않으면 원인이 다른 것이다. 2절 진단 결과와 가장 최근 로그 마지막 10줄을 복사해 두고 **3절로 가지 않는다**(보고 먼저).
- 로그 파일 자체가 없으면 그날 러너가 아예 안 돈 것이다(PC 꺼짐·예약 작업 꺼짐 쪽). 역시 2절 결과를 복사해 보고한다.

## 2. 진단 스크립트 (읽기 전용, 아무것도 고치지 않음)

개발용 저장소 폴더(`%USERPROFILE%\Desktop\gaeo-analyst-team`)에서 PowerShell을 열고 — `git pull`이 "관련 없는 이력" 오류로
실패하면 개발용 저장소도 9/2 재작성 전 상태다. 그때는 8절을 먼저 한 뒤 돌아온다.

```powershell
git pull
powershell -ExecutionPolicy Bypass -File scripts\paper_doctor.ps1
```

- 확인: `[O] 예약 작업 있음: GAEO Paper Trading`, `[O] 부트스트랩(run-paper.ps1)을 실행합니다`, 러너 저장소·마커 정상.
- `[X]` 항목이 있으면 그 옆의 "고치는 법"을 먼저 따른다(예약 작업이 꺼져 있음, 부트스트랩 경로 잘못됨 등).

## 3. 러너 저장소 안전 복구 (복구 도구 — 손으로 git 명령을 치지 않는다)

⚠️ 예전 문서에 있던 "paper_trading 복사 → `git checkout -B main origin/main`" 손 절차는 **쓰지 않는다.** 아직 GitHub에 올라가지 못한
모의투자 기록이 있으면 그 절차가 활성 장부에서 기록을 빼 버릴 수 있다. 대신 복구 도구가 ① 기록이 전부 원격에 있는지 **내용으로**
확인하고 ② 백업을 만들어 검증한 뒤 ③ 그때만 저장소를 최신 main에 다시 맞춘다. 단계마다 실패하면 그 자리에서 멈춘다.
(도구: `scripts/paper_recover.ps1`. 이 도구의 실제 Windows 실행은 원격 세션에서 검증하지 못했다 — 그래서 검사 모드를 먼저 돌린다.)

### 3-1. 검사 모드 (아무것도 바꾸지 않는다)

개발용 저장소 폴더(2절과 같은 창)에서:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1
```

화면 마지막 줄 `복구 도구 종료코드: N` 을 본다.

| N | 뜻 | 다음 |
|---|---|---|
| `10` | 기록이 전부 원격에 있음이 내용으로 확인됐다. 계획이 화면에 있다 | 3-2로 |
| `0` | 복구할 것이 없다(이미 최신이거나 사이클이 스스로 처리한다) | 4절로 |
| `11` | 원격에 없는 기록이 있거나 판정을 못 했다 | **멈춘다.** 화면 전체를 복사해 보고. 3-2를 하지 않는다 |
| `2` | 저장소 경로·마커·원격 주소·브랜치가 예상과 다르다(다른 저장소에서 실행했을 가능성) | 멈추고 보고 |
| `3` | 다른 사이클(또는 도구)이 돌고 있다 | 5분 뒤 다시 3-1 |
| `5` | 인터넷/GitHub 연결 실패 | 잠시 뒤 다시 3-1 |
| `7` | 파이썬이 없다 | 멈추고 보고(러너가 파이썬으로 돌았다면 나올 수 없는 값) |

### 3-2. 실행 모드 (3-1이 `10`일 때만)

```powershell
powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -Mode apply
```

- 확인: `[7/8] 백업 완료·검증 통과` → `[7/8] 재기준 완료` → `[8/8] 재기준 뒤 장부(계좌별)` 줄들(root(V1)·smart_v2·scalp_v3 각각 마지막 회차·거래 줄·보유) → `복구 도구 종료코드: 0`.
- 백업은 `%LOCALAPPDATA%\GAEO\backups\prerepoint-<시각>\` 에 남는다(지우지 말 것). 옛 커밋은 저장소 안 `refs/gaeo-backup/`에도 남는다.
  저장소가 크면(기본 512MB 초과) `repo.bundle` 파일은 만들지 않고 장부 복사본과 `manifest.json`만 남는다 — 정상이다(옛 커밋은 `refs/gaeo-backup/`이 지킨다).
  `<이름>.failed` 폴더가 보이면 그 백업은 실패한 것이다(도구는 그때 재기준하지 않았다). 지우지 말고 보고한다.
- 종료코드가 0이 아니면 그 줄까지 화면을 복사해 보고한다. 도구는 실패한 단계에서 멈추고 그 앞 단계까지만 바꾼다
  (`6` = 백업 실패라 재기준 안 함 · `11` = 미전송 기록을 `backups\unsent-<시각>\`에 보존하고 재기준 안 함 · `2`/`3`/`5`/`7`은 3-1과 같음).
- 절대 하지 않는 것: `git reset --hard`, `git push --force`, `paper_trading` 폴더 삭제, 백업 폴더 삭제, 손으로 `git checkout -B`.

## 4. 한 사이클 돌리기

3-2에 `-RunCycle`을 붙이면(`... -Mode apply -RunCycle`) 도구가 재기준 뒤 작업 스케줄러 작업 **GAEO Paper Trading**을 대신 실행하고
최대 4분 동안 오늘 로그에서 `최종 exit code` 줄을 기다려 보여 준다. 붙이지 않았으면 작업 스케줄러 → 작업 스케줄러 라이브러리 →
**GAEO Paper Trading** → 마우스 오른쪽 → **실행**. 몇 분 뒤(길면 10분) 오늘 로그(`%LOCALAPPDATA%\GAEO\logs\paper-YYYY-MM-DD.log`) 마지막 부분을 본다.

- 확인(정상): `remote sync: 이미 최신` 또는 `fast-forward 완료` → `paper_engine.py 정상 종료(exit 0)` → `push 결과: 성공` → `최종 exit code: 0`
- 장이 닫힌 시간(16시 이후·주말)에 돌리면 엔진이 `CYCLE_OK — 장외 시간 — 신규 진입 보류`로 끝나는 것이 **정상**이다.
  기록(`paper_trading/state.json`의 `lastCycleAt`)이 오늘 시각으로 바뀌고 push 되면 성공이다.
- `최종 exit code: 6`이 다시 나오면 로그의 `장부 포함성 판정` 줄들을 복사해 보고한다(재기준하지 않고 멈춘 것이며, 기록은 그대로 있다).
- `TOSS_MARKET_DATA_UNAVAILABLE` 또는 `HTTP 403`이 보이면 집 공인 IP가 바뀌었을 **가능성**이 있다(다른 원인: 토스 점검·키 만료). 토스 개발자센터
  허용 IP를 현재 IP와 대조한 뒤 다르면 다시 등록한다(`docs/PAPER_TRADING_LOCAL_RUNNER.md` 7절). 같은데도 403이면 보고한다.

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
3. 3단계 복구 도구 화면 전체(검사 모드·실행 모드 각각, 종료코드 줄 포함)
4. 4단계 로그의 마지막 5줄

## 8. 개발용 저장소(`Desktop\gaeo-analyst-team`)도 한 번 맞추기 (9/2 이력 재작성 뒤)

러너 저장소만이 아니라 **개발용 저장소**도 9/2 재작성 전 커밋을 HEAD 로 갖고 있으면 `git pull` 이 "관련 없는 이력" 오류로 실패한다.
PowerShell 에서 개발용 폴더로 가서:

```powershell
git status --porcelain          # 뭔가 나오면 먼저 다른 폴더에 복사해 보관(지우지 말 것)
git fetch origin main
git update-ref refs/gaeo-backup/dev-20260910 HEAD    # 옛 HEAD 보존(지우지 않음)
git checkout -B main origin/main
```

앞으로는 이런 재작성이 **자동으로 일어나지 않는다**(2026-09-10 부터 `compact-history` 는 사람이 confirm 을 쳐야 돌고, 돌면 옛→새 SHA 지도를 남긴다 —
`docs/HISTORY_PRESERVATION.md`).
