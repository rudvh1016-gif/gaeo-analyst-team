# 모의투자(Paper Trading) Oracle Cloud Linux 러너 준비 문서

> 이 문서는 **비개발자가 읽어도 되는 준비·설치 설명서**다.
> 집 Windows PC 러너 설명서는 `docs/PAPER_TRADING_LOCAL_RUNNER.md`에 있고, 이 문서는
> 그 러너를 Oracle Cloud의 Linux VM으로 **옮길 수 있게 미리 만들어 둔 자료**다.

## 0. 지금 상태 한 줄 요약

**아직 아무것도 옮기지 않았다.** 코드와 설치 절차만 준비했다.
지금 실제로 도는 러너는 여전히 집 Windows PC 하나뿐이고(`paper_runner_config.json`의
`activeRunner`가 `WINDOWS`), Oracle VM은 설치해도 기본값이 비활성이라 기록을 남기지 않는다.

이번 라운드에서 **자동 Failover(집 PC가 죽으면 Oracle이 자동으로 이어받는 기능)는 만들지 않았다.**
전환은 사람이 설정 파일 한 줄을 고쳐 커밋할 때만 일어난다.

---

## 1. 원장을 쓰는 러너는 언제나 한 곳뿐 (Single Writer)

모의투자 기록(`paper_trading/trades.jsonl` 등)은 되돌릴 수 없는 원장이다. 두 러너가
같은 시간에 각자 사이클을 돌면 같은 신호를 두 번 사는 일이 생기고, 서로의 커밋 위로
rebase가 겹치면서 기록이 갈라진다. 갈라진 뒤에는 어느 쪽이 진짜인지 판정할 방법이 없다.

그래서 코드가 이걸 강제한다.

| 무엇 | 어디 | 누가 정하나 |
|---|---|---|
| 이 컴퓨터는 누구인가 | 환경변수 `GAEO_PAPER_RUNNER` (`WINDOWS` / `ORACLE`) | 러너 스크립트가 스스로 선언 |
| 지금 활성인 러너는 누구인가 | 저장소 `paper_runner_config.json`의 `activeRunner` | **사람이 커밋해야만** 바뀐다 |

- 판정은 `paper_single_writer.py`가 하고, 엔진 진입점(`paper_engine.py`·`paper_smart_v2.py`·
  `paper_momentum.py`·`paper_public.py`)에서 **시세 조회 전에** 걸린다.
  토스는 client 하나당 유효 토큰이 1개라, 비활성 러너가 토큰을 발급받는 것만으로도
  활성 러너의 토큰을 무효로 만들 수 있기 때문이다.
- 비활성이면 **매매 계산 0 · 원장 변경 0 · 커밋 0 · push 0**으로 끝난다.
- `paper_runner_config.json`은 러너의 커밋 화이트리스트(`paper_trading/`·`paper_public.js`)
  **밖**에 있다. 즉 러너가 자기 손으로 자기를 활성화할 수 없다.
- 선언이 없으면(환경변수 미설정) **비활성으로 본다.** 안 도는 쪽이 안전하기 때문이다.
  이 선택 때문에 조용히 멈추는 일이 생기지 않도록, 거래일인데 기록이 0건이면
  `paper-health-alert` 워크플로가 이슈(`🛑 [GAEO Paper] 오늘 모의투자가 실행되지 않았습니다`)를 연다.

검증: `python3 test_paper_single_writer.py` (비활성 러너로 사이클을 돌려도 파일 해시가
그대로이고 시세 provider가 0회 생성되는지 기계로 확인한다).

---

## 2. 정직하게 적어 두는 것: 우리가 **모르는** 것

이 준비 작업을 한 세션에는 OCI CLI도, `~/.oci` 설정도, `OCI_*` 환경변수도 없었다.
그래서 NOVA가 쓰는 VM에 대해 아래는 **전부 확인하지 못했다(UNKNOWN)**. 추측해서 채우지 않는다.

| 항목 | 값 |
|---|---|
| VM Shape (예: VM.Standard.A1.Flex / E2.1.Micro) | **UNKNOWN** |
| OCPU 수 | **UNKNOWN** |
| RAM | **UNKNOWN** |
| 현재 CPU 사용률 | **UNKNOWN** |
| 현재 메모리 사용률 | **UNKNOWN** |
| 현재 네트워크 사용률 | **UNKNOWN** |
| 남은 디스크 | **UNKNOWN** |

확인하는 방법(대표가 VM에 접속해서 직접):

```bash
# Shape·OCPU·RAM
nproc; free -h; cat /proc/cpuinfo | grep -m1 'model name'
# 현재 부하
uptime; top -b -n1 | head -12
# 디스크
df -h /
```
Console(웹)에서는 Compute > Instances > 해당 인스턴스에서 Shape와 OCPU/Memory를 볼 수 있다.

### 2-1. NOVA와 같은 VM을 쓸 것인가

**UNKNOWN.** 위 값을 모르는 상태에서 "같이 써도 된다"고 말할 수 없다.
**NOVA 안정성이 최우선이다. 조금이라도 자원이 빠듯할 위험이 있으면 같은 VM에 넣지 않는다.**

같은 VM을 쓰기로 한다면 아래를 **전부** 지켜 완전히 격리한다.

| 구분 | NOVA | GAEO Paper |
|---|---|---|
| 디렉터리 | `/opt/nova` | `/opt/gaeo-paper` |
| Linux 사용자 | NOVA 전용 계정 | `gaeo-paper` 전용 계정 |
| 작업 디렉터리 | NOVA 저장소 | `/opt/gaeo-paper/repo` (전용 clone) |
| systemd 유닛 | NOVA 유닛 | `gaeo-paper.service` · `gaeo-paper.timer` |
| Secret | NOVA 것 | `/etc/gaeo-paper/paper.env` (권한 600, 따로 보관) |
| 로그 | NOVA 것 | `/opt/gaeo-paper/logs` + `journalctl -u gaeo-paper` |

추가로 `gaeo-paper.service`에는 `Nice=10` · `CPUWeight=20` · `IOWeight=20` · `MemoryMax=1G`를
넣어 두었다. Paper가 NOVA보다 항상 뒤로 양보한다는 뜻이다.
⚠️ `MemoryMax=1G`는 VM의 실제 RAM을 모르는 상태의 보수적 상한이다. RAM을 확인한 뒤
작은 Shape면 더 낮추고, 이 값 때문에 사이클이 죽으면 `journalctl -u gaeo-paper`에
oom 관련 줄이 남으니 그때 조정한다.

---

## 3. Always Free VM이 회수될 수 있는가 (Idle 정책)

### 3-1. 이번에 **직접 확인한 것** (2026-08-26 확인)

출처: Oracle Cloud Free Tier FAQ, <https://www.oracle.com/cloud/free/faq/> (당일 접속 확인)

> "Accounts left idle for 30 days or more may be deemed abandoned and become eligible
> for suspension or termination."
> (계정을 30일 이상 놀려 두면 방치된 것으로 보고 정지·해지 대상이 될 수 있다)

이건 **계정** 이야기다. 인스턴스 단위 회수 기준은 이 FAQ에 없다.

### 3-2. 이번에 **확인하지 못한 것** (중요)

인스턴스(컴퓨트) 단위 Idle 회수 기준은 Oracle 공식 문서
<https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm>
에 있는데, **이 작업 세션의 네트워크가 `docs.oracle.com`을 막아서(2026-08-26, CONNECT 403)
현재 문서 원문을 직접 읽지 못했다.** 그래서 아래 내용은 "우리가 알고 있는 조건"일 뿐
**이번에 확인된 사실이 아니다.**

- 알려진 조건(미확인): 연속 **7일 동안** ① CPU 사용률 95th percentile < 20% ·
  ② 네트워크 사용률 < 20% · ③ 메모리 사용률 < 20%(A1 Shape에만 해당)를
  **모두** 만족하면 Idle로 판단해 회수(reclaim)할 수 있다.
- 즉 **"7일 지나면 무조건 삭제"가 아니다.** 세 조건을 모두 만족해야 한다는 뜻이다.
- 동시에 **"절대 회수 안 된다"고 말할 수도 없다.** 조건을 다 만족하면 회수 대상이 된다.

👉 **대표가 할 일**: 위 링크를 브라우저로 한 번 열어 현재 문구를 확인하고, 확인한 날짜와
문구를 이 절에 갱신한다. 조건이 바뀌어 있으면 그 내용이 우선이다.

### 3-3. Idle Risk 평가

**UNKNOWN이다.** NOVA VM의 실제 CPU·메모리·네트워크 사용량을 볼 수 없으므로
"지금 회수 위험이 있다/없다"를 말할 수 없다.

그리고 **모의투자를 추가한다고 해서 사용률이 자동으로 20%를 넘는다고 가정하지 않는다.**
Paper 사이클은 30분에 한 번, 몇 초에서 몇 분이면 끝나는 작은 작업이다(시세 조회 + 파일 쓰기 +
git push). 하루 13번 돌아도 24시간 평균 CPU에는 거의 영향이 없을 수 있다.
여기에 임의의 퍼센트를 지어내지 않는다.

### 3-4. 절대 하지 않는 것

**Idle 회수를 피하려고 가짜 부하를 만들지 않는다.** CPU 태우기(burner), 메모리 채우기(filler),
의미 없는 트래픽 발생기 같은 것을 넣지 않는다. 서비스 약관에 어긋날 소지가 있을 뿐 아니라,
NOVA가 쓰는 자원을 우리가 먼저 잡아먹는 자해 행위다.
Idle 위험이 실제로 확인되면, 그때 "이 VM을 계속 무료로 둘 것인지" 자체를 다시 판단한다.

---

## 4. 설치 절차 (대표가 나중에 그대로 따라 하면 되는 순서)

> ⚠️ **Secret(토스 Client ID/Secret, 배포키의 개인키)을 채팅창이나 GitHub에 붙여넣지 않는다.**
> 값은 토스 개발자센터 화면에서 VM 터미널로만 옮긴다. 이 저장소에는 어떤 형태로도 넣지 않는다.

### 4-1. 사용자·디렉터리 만들기

```bash
sudo useradd --system --create-home --home-dir /opt/gaeo-paper --shell /bin/bash gaeo-paper
sudo mkdir -p /opt/gaeo-paper/logs
sudo chown -R gaeo-paper:gaeo-paper /opt/gaeo-paper
```

### 4-2. 시간대를 KST로 (가장 흔한 사고 지점)

```bash
sudo timedatectl set-timezone Asia/Seoul
timedatectl        # Time zone: Asia/Seoul (KST, +0900) 인지 확인
```
Oracle VM은 기본이 UTC다. 안 바꾸면 systemd 타이머의 `09:05`가 UTC 09:05(= KST 18:05)로
해석돼 장이 닫힌 뒤에 돈다. 안전망으로 `scripts/paper_cycle.sh`가 실행 순간 KST를 다시 확인해
평일 08:55~15:35 밖이면 아무 것도 하지 않고 끝내지만, 시간대는 반드시 맞춰 둔다.

### 4-3. 저장소 clone + 러너 마커

러너는 **전용 clone에서만** 돈다. 마커 파일이 없으면 사이클이 실행을 거부한다.

```bash
sudo -u gaeo-paper -H bash -lc '
  cd /opt/gaeo-paper
  git clone https://github.com/rudvh1016-gif/gaeo-analyst-team.git repo
  cd repo && git checkout main
  git config user.name  "GAEO Paper Runner"
  git config user.email "paper-runner@gaeoteam.com"
'
sudo -u gaeo-paper touch /opt/gaeo-paper/.gaeo-paper-runner   # 러너 마커(필수)
```

### 4-4. GitHub에 push할 수 있게 만들기 (배포키)

개인 액세스 토큰 대신 **저장소 전용 배포키(Deploy key)** 를 쓴다. 키는 VM에서 만들고
**공개키만** GitHub에 붙여넣는다. 개인키는 VM 밖으로 나가지 않는다.

```bash
sudo -u gaeo-paper -H bash -lc 'mkdir -p ~/.ssh && chmod 700 ~/.ssh'
sudo -u gaeo-paper -H ssh-keygen -t ed25519 -N "" -f /opt/gaeo-paper/.ssh/id_ed25519
sudo -u gaeo-paper -H cat /opt/gaeo-paper/.ssh/id_ed25519.pub    # 이 줄만 복사
```
GitHub 저장소 > Settings > Deploy keys > Add deploy key에 붙여넣고
**Allow write access를 켠다.** 그다음 원격 주소를 ssh로 바꾼다.

```bash
sudo -u gaeo-paper -H bash -lc '
  cd /opt/gaeo-paper/repo
  git remote set-url origin git@github.com:rudvh1016-gif/gaeo-analyst-team.git
  ssh-keyscan github.com >> /opt/gaeo-paper/.ssh/known_hosts
  git ls-remote --heads origin main >/dev/null && echo "원격 읽기 OK"
'
```

### 4-5. 토스 자격증명 파일

```bash
sudo mkdir -p /etc/gaeo-paper
sudo install -m 600 /dev/null /etc/gaeo-paper/paper.env
sudo nano /etc/gaeo-paper/paper.env
```
파일 내용은 이 두 줄뿐이다(값은 토스 개발자센터에서 복사).

```
TOSS_INVEST_CLIENT_ID=여기에_붙여넣기
TOSS_INVEST_CLIENT_SECRET=여기에_붙여넣기
```
- 권한은 **600**이어야 한다. 이 파일은 systemd(root)가 읽어 서비스에 넘겨준다.
- 이 값은 저장소·이슈·채팅 어디에도 남기지 않는다.

### 4-6. systemd 유닛 설치

```bash
sudo cp /opt/gaeo-paper/repo/scripts/systemd/gaeo-paper.service /etc/systemd/system/
sudo cp /opt/gaeo-paper/repo/scripts/systemd/gaeo-paper.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now gaeo-paper.timer
systemctl list-timers gaeo-paper*      # 다음 실행 시각이 KST 기준으로 맞는지 확인
```
저장소 파일을 심볼릭 링크하지 말고 **복사**한다. 링크로 걸어 두면 러너가 git pull 할 때
systemd 동작이 예고 없이 바뀔 수 있다.

### 4-7. 손으로 한 사이클 돌려 보기

```bash
sudo systemctl start gaeo-paper.service
journalctl -u gaeo-paper -n 50 --no-pager
```
이 시점의 정상 결과는 **"single-writer: 이 러너는 비활성입니다"** 다.
아직 `activeRunner`가 `WINDOWS`이기 때문이고, 기록을 안 남기는 게 맞다.

---

## 5. Oracle 연결 전 순서 (이 순서를 지킨다)

전환 버튼을 누르기 전에 아래 7단계를 차례로 통과해야 한다.
**하나라도 실패하면 그 앞에서 멈추고, `activeRunner`는 건드리지 않는다.**

| # | 할 일 | 통과 기준 |
|---|---|---|
| ① | **Git read test** | `git ls-remote --heads origin main`이 성공한다 |
| ② | **Git write 인증 준비** | 배포키 등록 + write access. (실제 push는 활성 전환 후 첫 사이클에서 확인) |
| ③ | **Toss Market Data smoke test** | 시세 API가 이 VM의 IP로 200을 준다(아래 5-1) |
| ④ | **Linux Paper Doctor** | `bash scripts/paper_doctor.sh`가 "고쳐야 할 것 0건" |
| ⑤ | **Reserved Public IP 확인** | VM의 공인 IP가 Reserved(고정)인지 확인. Ephemeral이면 재부팅 때 바뀌어 ⑥이 깨진다 |
| ⑥ | **Toss IP Allowlist 등록** | 토스 개발자센터 허용 IP에 이 VM의 공인 IP를 추가 |
| ⑦ | **Single Writer 확인** | Doctor의 [4]번 항목이 "이 VM은 비활성"이라고 말한다(아직 전환 전이므로 정상) |

그 뒤에야 6절의 Active Runner 전환을 한다.

### 5-1. ③ Toss Market Data smoke test

자격증명이 실린 상태에서 엔진을 한 번 돌려 보고 결과 문구만 확인한다.
(전환 전이라 게이트에 막히므로, 시험할 때만 활성 러너 이름을 흉내 내서 부른다.
아래 명령은 파일을 임시 폴더에 쓰게 해서 **진짜 원장을 건드리지 않는다.**)

```bash
sudo -u gaeo-paper -H bash -lc '
  set -a; . /etc/gaeo-paper/paper.env; set +a
  cd /opt/gaeo-paper/repo
  python3 - <<PY
import paper_market_data as pmd
p = pmd.TossMarketDataProvider()
print("시세 호출 결과:", "OK" if p.get_market_calendar_kr() else "빈 응답")
PY
'
```
- 성공하면 캘린더 응답이 온다. `403`이 나오면 ⑥ 허용 IP 문제다.
- 이 명령은 **시세(Market Data)만** 부른다. 주문·계좌 API는 코드에 아예 없다.

---

## 6. Active Runner 전환 (집 PC → Oracle)

1. 5절 7단계를 전부 통과했는지 다시 확인한다.
2. 저장소에서 `paper_runner_config.json` 한 줄만 고쳐 `main`에 커밋·push 한다.
   ```json
   "activeRunner": "ORACLE"
   ```
3. 두 러너 모두 다음 사이클에서 이 파일을 읽는다.
   - Oracle VM: 활성이 되어 기록·커밋·push를 시작한다.
   - 집 Windows PC: 자동으로 비활성이 된다(작업 스케줄러를 꺼도 되고, 켜 둬도 아무 일 없다).
4. 첫 사이클 뒤 확인:
   ```bash
   journalctl -u gaeo-paper -n 60 --no-pager     # "활성 러너입니다" + push 성공
   ```
   그리고 GitHub `main`에 `paper: 가상매매 사이클 기록 (linux runner) [skip ci]` 커밋이 올라오는지 본다.

### 되돌리기

`activeRunner`를 다시 `WINDOWS`로 커밋하면 끝난다. 집 PC가 켜져 있고 작업 스케줄러가
살아 있으면 그다음 사이클부터 다시 집 PC가 기록한다.
**⚠️ 집 Windows 러너를 삭제하지 않는다.** 되돌릴 곳이 없어지면 그게 가장 큰 위험이다.

---

## 7. 평소 운영

### 로그 보기

```bash
journalctl -u gaeo-paper -n 100 --no-pager        # systemd 저널
sudo -u gaeo-paper tail -n 100 /opt/gaeo-paper/logs/paper-$(date +%F).log
```
Client ID/Secret·토큰은 **값 자체를 마스킹**해서 로그에 남지 않는다. 30일이 지난 로그는 자동 삭제된다.

### 안 돌 때 한 번에 진단

```bash
sudo bash /opt/gaeo-paper/repo/scripts/paper_doctor.sh
```
읽기 전용이라 아무것도 고치지 않는다. Secret 값은 출력하지 않고 있음/없음과 파일 권한만 본다.
(자격증명 파일은 root만 읽을 수 있으므로 그 항목까지 보려면 `sudo`로 실행한다)

검사 항목: 파이썬·git / 러너 저장소·마커·브랜치·작업트리·커밋 신원·원격 읽기 /
자격증명 유무와 권한 / **Single Writer 상태** / 시간대와 실행 시간대 / systemd 타이머 상태 /
디스크 여유 / 마지막 사이클 결과 / 최근 로그.

### exit code (집 PC 러너와 같은 표)

| code | 의미 |
|---|---|
| 0 | 정상 (변경 없어 커밋 안 한 경우·실행 시간대가 아닌 경우 포함) |
| 2 | 러너 저장소·마커 문제 |
| 3 | 브랜치가 main이 아님 등 상태 이상 |
| 4 | 예상치 못한 변경이 있어 안전 중단 |
| 5 | 네트워크/fetch 실패로 사이클 건너뜀 |
| 6 | 동기화(ff/rebase) 실패, 수동 확인 필요 |
| 7 | Paper 엔진 비정상 |
| 8 | 화이트리스트 위반 등 커밋 단계 실패 |
| 9 | push 실패(기록은 로컬 커밋으로 보존됨) |

### 조용히 죽으면 알림이 온다

평일 16:30 KST에 `paper-health-alert` 워크플로가 저장소 파일만 읽고 판정한다.

| 상황 | 결과 |
|---|---|
| 오늘 사이클이 실패로 끝남 | 이슈 `🛑 모의투자 러너 사이클 실패 ...` |
| 거래일인데 오늘 기록이 0건 | 이슈 `🛑 [GAEO Paper] 오늘 모의투자가 실행되지 않았습니다` |
| 휴장일 / 거래일 증거를 못 읽음 | **아무 말도 하지 않는다**(허위 알림보다 침묵) |
| 다시 정상으로 돌기 시작 | 열려 있던 이슈를 자동으로 닫는다 |

거래일 판정은 러너가 쓰는 파일이 아니라 `price_history.js`(GitHub Actions가 갱신하는 일봉)로 한다.
러너가 죽어도 이 증거는 살아 있기 때문이다.

---

## 8. 이 러너가 하지 않는 것

- **실제 주문·계좌 API 호출 0.** 토스는 시세(Market Data)만 쓴다. 허용 경로는
  `paper_market_data.py`의 `ALLOWED_PATHS`가 강제하고, `POST`가 허용되는 곳은
  토큰 발급 한 곳뿐이다. 주문·정정·취소·보유종목·매수가능금액 API는 코드에 존재하지 않는다.
- **`git push --force` · `git reset --hard` · 자동 충돌 해결 없음.** 어느 경로에도 없다.
- **`paper_trading/`과 `paper_public.js` 외의 파일은 커밋하지 않는다**(화이트리스트 강제).
- **자동 Failover 없음.** 집 PC가 죽어도 Oracle이 스스로 이어받지 않는다.
- **Idle 회피용 가짜 부하 없음.**
