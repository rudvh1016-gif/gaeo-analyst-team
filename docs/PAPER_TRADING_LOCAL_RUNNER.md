# 모의투자(Paper Trading) 집 PC 자동운영 — 운영 안내

> 이 문서는 **비개발자가 읽어도 되는 운영 설명서**다.
> 코드 세부는 `scripts/paper_cycle.ps1`, 안전 설계 원본은 `.github/workflows/paper-trading.yml` 주석에 있다.

## 1. 왜 집 PC에서 도는가

토스증권 Open API는 **허용 IP 목록**으로 접근을 막는다. 집 공인 IP는 등록돼 있지만
GitHub Actions 러너(Azure)의 IP는 등록할 수 없다(매번 바뀜). 실제로 GitHub에서 돌리면
403이 난다. 그래서 **모의투자 사이클을 실제로 도는 곳은 집 PC 한 곳뿐**이다.

## 1-1. 원장을 쓰는 러너는 언제나 한 곳뿐 (Single Writer, 2026-08-26)

모의투자 기록은 되돌릴 수 없는 원장이라, 두 컴퓨터가 동시에 쓰면 기록이 갈라진다.
그래서 코드가 막는다.

- 러너는 자기 이름을 환경변수 `GAEO_PAPER_RUNNER`로 선언한다.
  집 PC용 `scripts/paper_cycle.ps1`은 실행할 때 스스로 `WINDOWS`라고 선언하므로
  **대표가 따로 할 일은 없다.**
- 지금 활성인 러너는 저장소의 `paper_runner_config.json`(`activeRunner`)이 정한다.
  지금 값은 `WINDOWS`이고, 그래서 집 PC가 평소처럼 기록한다.
- 활성이 아닌 러너는 **시세 조회도 하지 않고** 아무 것도 남기지 않는다.
- 이 파일은 러너가 커밋할 수 있는 목록 밖이라, 러너가 자기를 활성화할 수 없다.
  전환은 사람이 커밋할 때만 일어난다.

Oracle Cloud Linux VM으로 옮길 준비 자료는 `docs/PAPER_TRADING_ORACLE_RUNNER.md`에 있다.
**집 PC 러너는 삭제하지 않는다.** 되돌릴 곳이 없어지는 게 가장 큰 위험이다.

## 2. 저장소가 두 개로 분리돼 있다 (중요)

| 용도 | 경로 | 누가 쓰나 |
|---|---|---|
| **개발용** | `%USERPROFILE%\Desktop\gaeo-analyst-team` | 사람(Claude Code로 개발·commit·push) |
| **모의투자 전용 러너** | `%LOCALAPPDATA%\GAEO\paper-runner\repo` | 작업 스케줄러만. 사람은 손대지 않음 |

자동 모의투자는 **러너 저장소에서만** 돈다. 개발용 저장소는 절대 건드리지 않는다.
안전장치로, 러너 루트(`%LOCALAPPDATA%\GAEO\paper-runner\`)에 있는 마커 파일
`.gaeo-paper-runner`가 없으면 사이클 스크립트가 **실행을 거부**한다. 개발용 저장소에는
이 마커가 없으므로 실수로도 개발 파일을 건드릴 수 없다.

## 3. 평일에 무슨 일이 일어나는가

작업 스케줄러 작업 이름: **GAEO Paper Trading**
평일(월~금) 09:05부터 30분 간격으로 6시간 → 마지막 실행 15:05.

한 사이클에서 벌어지는 일:

1. 부트스트랩(`%LOCALAPPDATA%\GAEO\run-paper.ps1`)이 DPAPI로 암호화된 Toss 키를
   **메모리에서만** 복호화해 환경변수로 넣는다.
2. 러너 저장소가 없으면 GitHub에서 clone, 있으면 그대로 사용.
3. `scripts/paper_cycle.ps1`이 실행되어:
   - 러너 저장소에 예상치 못한 변경이 있으면 **아무것도 고치지 않고 중단**한다.
   - GitHub 최신 `main`을 안전하게(fast-forward 또는 rebase) 반영한다.
   - `paper_engine.py`(V1) → `paper_momentum.py`(기본 OFF) → `paper_smart_v2.py`(Shadow,
     기본 ON · `GAEO_PAPER_SMART_V2=0`으로 끔) → `paper_report.py` → `paper_public.py`
     순으로 실행. V1 외 전략은 실패해도 기록 커밋을 막지 않고, 각자 별도 폴더
     (`paper_trading/momentum`, `paper_trading/smart_v2`)에만 쓴다.
   - `paper_trading/`과 `paper_public.js` **만** 커밋한다(화이트리스트 검사 통과 필수).
   - 결과 변경이 없으면 커밋도 push도 하지 않고 정상 종료.
   - push가 거부되면 fetch→rebase 후 최대 4회 재시도. 충돌이 나면 **자동 병합하지 않고**
     로컬 커밋으로 보존한 뒤 실패로 끝낸다(다음 사이클에서 재시도).

`git push --force`, `git reset --hard`, 자동 충돌 해결은 **어느 경로에도 없다.**

## 4. 실제 주문은 절대 없다

- Toss API 중 **시세(Market Data)만** 호출한다. 허용 경로는
  `paper_market_data.py`의 `ALLOWED_PATHS`가 강제하며, 목록에 없는 경로는 즉시 예외다.
- `POST`가 허용되는 곳은 **토큰 발급(`/oauth2/token`) 한 곳뿐**이고 나머지 쓰기형
  호출(PUT/PATCH/DELETE)은 전면 차단된다.
- 계좌 헤더(`X-Tossinvest-Account`)를 쓰지 않고, 계좌·보유종목·주문 API는 호출하지 않는다.
- 자금은 전부 **가상자금**(초기 1,000만원)이다.

## 5. 결과가 사이트에 반영되는 경로

```
집 PC 러너 → paper_trading/ · paper_public.js 커밋 → GitHub main
→ GitHub Pages 배포 → gaeoteam.com (index.html이 paper_public.js를 읽음)
```

`paper_public.js`는 `paper_trading/`에서 **파생만** 한 공개 요약이고 Secret은 들어가지 않는다.

## 6. 로그 보는 법

```
%LOCALAPPDATA%\GAEO\logs\paper-YYYY-MM-DD.log
```

한 사이클마다 시작 시각(KST), 러너 HEAD, 동기화 결과, 엔진/리포트/공개요약 성공 여부,
커밋 생성 여부, push 결과, 최종 exit code가 남는다. 30일이 지난 로그는 자동 삭제된다.
**Client ID/Secret·토큰은 값 자체를 마스킹**해서 로그에 남지 않는다.

주요 exit code:

| code | 의미 |
|---|---|
| 0 | 정상 (변경 없어 커밋 안 한 경우 포함) |
| 2 | 러너 저장소·마커 문제 |
| 3 | 브랜치가 main이 아님 등 상태 이상 |
| 4 | 예상치 못한 변경이 있어 안전 중단 |
| 5 | 네트워크/fetch 실패로 사이클 건너뜀 |
| 6 | 동기화(ff/rebase) 실패 — 수동 확인 필요. 원격 이력이 재작성돼 공통 조상이 없는데 **로컬에 아직 안 올린 기록이 있을 때**도 이 코드다(9절) |
| 7 | Paper 엔진 비정상 |
| 8 | 화이트리스트 위반 등 커밋 단계 실패 |
| 9 | push 실패(기록은 로컬 커밋으로 보존됨) |

## 7. 집 IP가 바뀌면 생기는 증상

인터넷 공유기 재부팅 등으로 공인 IP가 바뀌면 Toss 허용 IP와 어긋난다. 그때는
로그에 시세 관련 실패(`TOSS_MARKET_DATA_UNAVAILABLE` 또는 `HTTP 403`)가 찍히고,
엔진은 **가짜 체결을 만들지 않고** 해당 신호를 건너뛰거나 보류한다.
해결: 토스 개발자 콘솔에서 현재 공인 IP를 다시 등록한다.

## 7-1. 안 돌 때 한 번에 진단하기 (paper_doctor)

원인을 하나씩 찾아 헤매지 말고 진단 스크립트를 돌린다. **읽기 전용이라 아무것도 고치지 않고**
무엇이 잘못됐는지와 고치는 방법만 알려준다. Secret 값은 출력하지 않는다.

PowerShell 창에서(개발용 저장소 폴더에서 실행해도 된다):

```powershell
powershell -ExecutionPolicy Bypass -File scripts\paper_doctor.ps1
```

검사 항목:

| 검사 | 왜 보는가 |
|---|---|
| 예약 작업 존재·상태 | 작업이 없거나 꺼져 있으면 아예 안 돈다 |
| **실행 대상이 부트스트랩인가** | `paper_cycle.ps1`을 직접 부르면 인증정보가 안 들어가 시세를 못 받는다 |
| **로그온 방식이 InteractiveToken인가** | 아니면 Windows가 저장된 키를 복호화하지 못한다 |
| 부트스트랩 파일 존재 | 없으면 최초 설치를 다시 해야 한다 |
| 러너 저장소·마커 | 마커가 없으면 사이클이 실행을 거부한다 |
| 최근 로그의 실패 줄 | 실제 에러 문구를 바로 보여준다 |
| `state.json`의 마지막 결과 | `CYCLE_OK`가 아니면 사유를 표시한다 |

2026-08-19 사고(자격증명 유실로 12사이클 연속 실패)의 원인 후보를 그대로 항목화한 것이다.

## 8. 작업 스케줄러가 정상인지 확인하는 법

작업 스케줄러 → 작업 스케줄러 라이브러리 → **GAEO Paper Trading**

- **마지막 실행 결과**가 `0x0`이면 정상.
- **상태**가 `준비`면 정상(실행 중이 아닐 때).
- 더 자세히 보려면 위의 로그 파일을 연다.

PC는 켜두고 **Windows 로그인 상태**여야 한다(작업이 "사용자가 로그온할 때만 실행"이라서).
화면만 꺼지는 건 상관없다.

## 9. 원격 이력이 재작성됐을 때 (2026-09-02 실제 사고 · 2026-09-10 대응)

2026-09-02 08:25 KST `compact-history` 워크플로가 main의 과거 커밋을 전부 새 번호로 바꿔 썼다(force push).
러너 전용 저장소는 옛 번호를 HEAD로 갖고 있어서 origin/main과 **공통 조상이 없어졌고**, 동기화 코드는
"갈라짐 → rebase → 충돌 → abort → exit 6"만 매 사이클 반복했다. 엔진은 한 번도 돌지 않아 거래일 8일이 비었다.

2026-09-10부터 `paper_cycle.ps1`·`paper_cycle.sh`는 이 상황(공통 조상 없음)을 따로 알아본다. 첫 판은 `state.json`의 `lastCycleAt`이
같거나 원격이 더 새로우면 "원격이 다 가졌다"고 봤는데, 시각은 거래·수량·현금·보유·다른 계좌(smart_v2·scalp_v3) 기록이 들어 있다는 증거가
아니라서 같은 날 구간 A에서 **내용 검증**으로 바꿨다(`paper_ledger_inclusion.py`; `test_paper_runner_sync.py` B2 기대값 0→6 정정 — 완화가 아니라 강화).

| 상황 | 동작 |
|---|---|
| 공통 조상 없음 + `paper_ledger_inclusion.py check`가 **COVERED**(모든 장부 파일 바이트 동일, 또는 이벤트 원장(jsonl) 줄 전부 원격에 포함 + 원격이 더 뒤 회차 + 보유 투영 증명(로컬 OPEN 거래가 전부 원격 원장에 있고 양쪽 보유 목록이 각자 원장과 일치)) | ① 백업 `%LOCALAPPDATA%\GAEO\backups\prerepoint-<시각>\` (paper_trading 복사 + 옛 HEAD bundle + sha256 manifest, 만든 뒤 검증) → ② 옛 HEAD를 `refs/gaeo-backup/head-<시각>`에 보존 → ③ `git checkout -B main origin/main` → **정상 진행** |
| 공통 조상 없음 + **NOT_COVERED**(로컬에만 있는 거래·이벤트 줄, 같은 회차인데 내용이 다름, 로컬이 더 새로움, 로컬에만 있는 파일·계좌) 또는 **UNDETERMINED**(빈·깨진 파일, `lastCycleAt`·`openMeta` 없음, 보유 목록 불일치, 판정 모듈 없음) | 자동으로 버리지 않는다. exit 6으로 멈추고 복구 도구 검사 모드를 안내한다 |
| 얕은 복제(shallow clone) · `merge-base` 조회 오류 · 재기준 전 백업 실패 · 다른 실행이 잠금을 쥠 | 재기준하지 않는다(exit 6, 잠금은 exit 3) |

옛 HEAD 작업트리(2026-09-10 이전 clone)에는 판정 모듈이 없으므로 러너는 `origin/main`에서 `paper_ledger_inclusion.py`를 꺼내 쓴다.
파이썬은 동기화 전에 먼저 찾는다(없으면 exit 7, 아무것도 바꾸지 않은 상태).

백업의 실제 크기(별도 검토자 지적, 2026-09-10): 공통 조상이 없으면 `--not origin/main`은 아무것도 빼지 못해 bundle이 **옛 이력 전체**가 된다.
집 PC 러너 clone은 9/2 압축 전 전체 이력이라 수 GB가 될 수 있으므로, 저장소 객체가 상한(`GAEO_PAPER_BUNDLE_MAX_MB`, 기본 512)을 넘거나
디스크 여유가 모자라면 bundle을 **만들지 않고** manifest에 그렇게 적는다(장부 복사본과 sha256 manifest는 항상 만든다). 옛 커밋은 저장소 안
`refs/gaeo-backup/head-<시각>`이 GC에서 지켜 준다. 백업 도중 실패한 폴더는 `<이름>.failed`로 이름이 바뀐다(정상 백업으로 오인 방지).
잠금은 러너 루트(마커 옆)의 `cycle.lock`(sh) / 이름 있는 뮤텍스 `GAEO-Paper-Cycle`(ps1)이라 로그 폴더 위치와 무관하게 사이클·복구 도구가 서로를 본다.

**복구 도구**(2026-09-10 구간 A 신설): `scripts/paper_recover.ps1`(집 PC) / `scripts/paper_recover.sh`(Linux). 기본은 검사 모드(아무것도
바꾸지 않음, fetch만), `-Mode apply`가 실행 모드다. 실행 모드도 위 표의 COVERED일 때만 재기준하고, 아니면 미전송 기록을
`backups\unsent-<시각>\`에 따로 보존한 뒤 exit 11로 멈춘다. 종료코드: 0 할 일 없음(또는 apply 완료) · 10 재기준 가능(check) ·
11 수동 확인 · 2 저장소/마커/원격 주소/브랜치 불일치(다른 저장소에서는 절대 돌지 않는다) · 3 잠금 · 5 fetch 실패 · 6 apply 단계 실패 · 7 파이썬 없음.
집 PC 절차는 `docs/operations/HOME_PC_CHECKLIST.md` 3절.

`git reset --hard`·`git push --force`·`git clean`·`git stash`·`--allow-unrelated-histories`는 어느 경로에도 없다. 계약 테스트:
`test_paper_ledger_inclusion.py`(합성 장부로 판정·백업), `test_paper_runner_sync.py`(임시 저장소에서 재작성을 재현해 sh를 실제 실행 E1~E10,
ps1은 정적 대조), `test_paper_recover.py`(복구 도구 R1~R12). ⚠️ ps1 두 파일의 **실제 Windows 실행 검증은 2026-09-10 원격 세션에서는
하지 못했다**(PowerShell 없음). 집 PC 첫 실행이 곧 실검증이므로 반드시 검사 모드부터 돌린다.
