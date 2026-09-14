# GAEO Team PAPER → Oracle 이전 검토 결과 (2026-09-12)

> **판정: C — PRIVATE 안전을 위해 Oracle 이전을 하지 않는다. `activeRunner=WINDOWS` 유지.**
>
> 이 검토는 **읽기 전용**으로 수행했다. Oracle 서버에는 **아무것도 설치·수정·삭제하지 않았다.**
> 집 Windows PC의 PAPER도 그대로 정상 가동 중이다.

> ## ⚠️ 2026-09-15 후속 — 이 문서의 결론은 **초과됐다(superseded)**
>
> 위 판정 C 는 "Oracle 로 옮기지 않고 **WINDOWS 를 유지한다**"였다. 소유자가 그 다음 수순으로
> **개오 애널리스트팀(Team)의 모의투자 자체를 접기로** 결정했다(2026-09-15). 모의투자는
> **PRIVATE 사이트에서만** 계속한다. 따라서 `activeRunner` 는 더 이상 `WINDOWS` 가 아니라
> `RETIRED` 다. 아래 §1~§6 의 **조사 내용과 근거는 그대로 유효**하다 — 바뀐 것은 결론뿐이다.
>
> 이 결정의 뿌리는 이 문서가 이미 밝힌 차단 1번이다: 토스는 **client 당 유효 토큰이 1개**이고
> Team 과 Gateway 가 같은 자격증명을 쓴다. Team 이 토큰을 발급하면 Private 이 즉시 끊긴다.
> 옮기든 안 옮기든 그 충돌은 Team 이 모의투자를 하는 한 사라지지 않으므로, 소유자는 Team 쪽을
> 접는 쪽을 택했다.
>
> **은퇴는 삭제가 아니다.** 상세는 아래 [§7 은퇴](#7-2026-09-15-team-모의투자-은퇴-삭제-아님).
>
> 조사자: 집 Windows PC(`DESKTOP-24KN8TP`) 세션 · Oracle `161.33.128.159` (`nexus-vcn`) SSH 읽기 전용.

## 0. 한 줄 요약

Oracle로 옮기려면 **Private(Gateway·Bridge·NOVA)를 건드려야만 한다.** 건드리지 않고 옮길 방법이
현재 구조에 없다. 그래서 옮기지 않기로 했다. 이것은 실패가 아니라 설계된 **fail-closed** 동작이다.

---

## 1. Oracle 현재 상태 (변경 전 = 변경 후, 아무것도 안 바꿨으므로)

| 항목 | 실측값 |
|---|---|
| OS / arch | Ubuntu 24.04.4 LTS · **aarch64** · kernel 6.17.0-1020-oracle |
| CPU | **1 vCPU** (Neoverse-N1) · load 0.00 |
| RAM | 5.8 GiB (사용 978 MiB · 가용 4.8 GiB) · **swap 0** |
| 디스크 `/` | 45 G 중 **31 G 사용(71%) · 여유 14 G** |
| timezone | UTC |

### 돌고 있던 서비스 (기준점)

| 서비스 | 상태 | 재시작 | 포트 | 역할 |
|---|---|---|---|---|
| `gaeo-gateway.service` | active | **0** | 127.0.0.1:8787 | Toss read-only gateway — **유일한 토큰 발급자** |
| `gaeo-intelligence-bridge.service` | active | **0** | 127.0.0.1:8790 | loopback 전용 인증 read bridge (발급·쓰기 없음) |
| `gaeo-mcp.service` | active | **0** | 127.0.0.1:8791 | 격리 read-only MCP |
| `nova-nova-1` (docker) | **healthy** | 0 | 127.0.0.1:8000 | NOVA |
| `gaeo-intelligence.timer` / `.service` | waiting / oneshot | — | — | 평일 연구 슬롯 |
| `gaeo-intelligence-monitor.timer` | waiting(1분) | — | — | 슬롯 감시 |
| GitHub Actions runner ×2 | active | — | — | `gaeo-gateway` · `gaeo-private` |

- **failed unit 0건.**
- 최근 24시간 `gaeo-gateway`·`gaeo-intelligence-bridge` 로그에서 **401/403/token 오류 0건.**
- NOVA `/health/live` 200 · `/health/ready` 200.
- Gateway `/v1/portfolio` → 200 정상 응답 지속.

---

## 2. Toss 토큰 발급 주체 감사 (STEP B — 가장 중요)

**현재 Oracle에서 `/oauth2/token`을 호출하는 코드는 단 하나다.**

- `/opt/gaeo-gateway/releases/<rel>/src/gaeo_gateway/toss/token_manager.py` (`grant_type=client_credentials`)
- Toss 자격증명(`toss_client_id`·`toss_client_secret`)을 `LoadCredentialEncrypted`로 받는 유닛도
  **`gaeo-gateway.service` 하나뿐이다.**
- Bridge·MCP·Intelligence 유닛은 `gateway_auth_token`만 받는다. Toss 자격증명 접근 **0건**.
- Bridge의 `ExistingTokenReader`는 공유 저장소를 **읽기만** 하고, 없거나 만료면
  `RuntimeError('Existing token unavailable')`로 **실패한다(발급하지 않는다).**
- Gateway에는 이미 `tests/test_token_single_issuer.py` 불변조건 테스트가 있다.
- 토큰 캐시: `/run/gaeo-gateway/toss_shared_access_token.bin` (0600, `gaeo-gateway` 소유) + `toss_token.lock`.

> ✅ **불변조건 「토큰 발급자는 Gateway 하나」는 현재 지켜지고 있다. 이번 작업으로 바뀌지 않았다.**

---

## 3. 이전을 막은 세 가지 차단 사유 (하나만 걸려도 중단)

### 차단 1 — 토큰 발급자가 늘어난다 (§6 절대 불변조건 위반)

토스는 **client 하나당 유효 토큰이 1개**고, 재발급하면 이전 토큰이 **즉시 무효**가 된다
(근거: `docs/PAPER_TRADING_ORACLE_RUNNER.md` §1, `paper_market_data.py` 공유 토큰 주석).

그리고 **Team PAPER와 GAEO Gateway는 같은 Toss client 자격증명을 쓴다.** 집 PC 사이클 로그가
매 회차 이렇게 경고한다:

```
[toss] 경고: 공유 토큰 저장소가 이미 있는데 GAEO_SHARED_TOSS_TOKEN 가 꺼져 있습니다.
       지금 토큰을 발급하면 다른 프로그램(GAEO Gateway)의 토큰이 끊깁니다.
```

따라서 Oracle에서 Team이 시세를 받으려면 둘 중 하나인데 **둘 다 막혀 있다**:

1. Team이 스스로 발급 → **Gateway 토큰 즉시 무효 → Private 중단.** 절대 불가.
2. Team이 Gateway의 공유 토큰 저장소(`/run/gaeo-gateway/`, 0700 `gaeo-gateway` 소유)를 공유
   → Private의 토큰 자료에 Team 접근 권한을 줘야 하고, `gaeo_shared_token.acquire()`는
   **발급 경로를 포함**하므로 Team은 여전히 "발급할 수 있는 주체"가 된다. §6 위반.

남는 유일한 안전 설계는 **Team이 Toss를 아예 모르는 BRIDGE 전용 모드**인데 — 차단 2로 막힌다.

### 차단 2 — Bridge로는 Team 데이터를 공급할 수 없고, 늘리려면 Private를 고쳐야 한다 (§9)

Team PAPER가 **실제로** 쓰는 시장자료를 코드에서 목록화(`paper_market_data.py`)하고
Bridge 실제 payload와 1:1 대조한 결과:

| Team 필요 | Toss 경로 | Bridge 제공 | 판정 |
|---|---|---|---|
| 시장 달력(전일/당일/익일) | `/api/v1/market-calendar/KR` | `/v1/calendar` | **AVAILABLE** |
| 호가 best ask/bid + 수량 | `/api/v1/orderbook?symbol=` | `/v1/market` 안에 `bestAsk`·`askQuantity`·`bestBid`·`bidQuantity`·`bookObservedAt` | **부분** — 아래 참조 |
| 현재가(최대 200종목 배치) | `/api/v1/prices?symbols=` | `/v1/market` 안에 포함 | **부분** — 아래 참조 |
| 종목 메타 | `/api/v1/stocks` | `/v1/market` 안에 포함 | **부분** |
| 최근 체결 | `/api/v1/trades` | 없음 | **해당 없음** — Team 코드에 호출부가 없다(주석·allowlist에만 존재). 요구사항 아님 |

**"부분"의 정체가 결정적이다.** Bridge의 `/v1/market`은 임의 조회 API가 아니라 **고정 범위 수집기**다:

- `MarketCollector(..., max_candidates=50)` — **최대 50종목**.
- 시드는 **Private의** `candidates.json`(`holdings` + `gaeo30`) + KR 랭킹 top-100 3종의 합집합.
- payload가 스스로 `coverage.fullMarket = False`,
  `scope = 'holdings + GAEO30 seeds + three top-100 KR rankings union'`이라고 선언한다.
- 호출자가 종목을 지정할 수 없다(`route()`가 받는 건 경로뿐, 쿼리 파라미터 없음).

반면 **Team PAPER의 유니버스는 `tickers.js` 기준 600종목**이고, 보유/후보 종목의 호가를
**그때그때 지정해서** 받아야 한다(`paper_engine.py`의 `get_orderbook(code)`·`get_prices(codes)`).

→ Bridge로 Team을 먹이려면 **호출자가 종목 목록을 넘기는 새 엔드포인트**를 `bridge.py`에 추가해야 한다.
그건 고정 범위 read 수집기를 **범용 Toss 프록시로 바꾸는 것**이고, `gaeo-intelligence-bridge`는
**Private 운영 서비스**다. §3 「Private 기능을 Team 때문에 변경」 금지에 정면으로 걸린다.

덧붙여 그렇게 하면 Team의 트래픽(평일 13회차 × 최대 수십 건의 orderbook GET)이
**Private와 같은 토큰**을 타고 나간다. 토스 rate limit은 **수치가 공표되지 않았고**
(`paper_market_data.py` 19행), Gateway는 이미 `toss ratelimit endpoint=holdings` 를 로그에 남기고 있다.
429나 토큰 무효가 나면 그 피해는 Private이 본다.

> §9 규정 그대로: **「조금이라도 기존 Private에 영향을 줄 가능성이 있으면 Bridge를 수정하지 않는다.
> Team Oracle 이전도 하지 않는다. WINDOWS를 유지한다.」**

### 차단 3 — 같은 root disk를 압박한다 (§14)

| 항목 | 실측 |
|---|---|
| Oracle `/` 여유 | **14 G** (45 G 중 31 G 사용) |
| `gaeo-analyst-team` `.git` | **2.0 GB** (`size-pack 1.96 GiB`) |
| 커밋 유입 | 최근 7일 **459커밋** · 30일 **2,788커밋** (자동 생성물) |
| 이력 증가 속도 | **약 2.3 GB/월** (`STATUS.md` 확정된 사실 8·9) |

clone 하는 순간 2.0 GB+ 를 먹고, 매달 2.3 GB씩 늘어 **4~5개월이면 14 G를 다 쓴다.**
그 디스크에는 **Private의 SQLite(`research-v2.db`)와 NOVA가 같이 얹혀 있다.**
디스크가 차면 Private이 먼저 죽는다.

얕은 복제(shallow clone)로 줄이는 우회도 **불가**하다 — PAPER 복구 도구가 얕은 복제를
`exit 11`로 거부한다(`scripts/paper_recover.ps1` [4/8] 단계: "공통 조상을 판정할 수 없다").

> §14 규정 그대로: **「Private/NOVA의 저장공간을 압박할 위험이 있으면 같은 root disk에 Team을 추가하지 않는다.」**
> 유료 storage는 만들지 않는다(§14·§1).

### 참고 — 결정적이진 않지만 같은 방향인 제약

**CPU 1개, swap 0.** Team은 평일 13회차마다 engine·smart_v2·scalp_v3·report·public 5개 파이썬
프로세스를 연달아 돌린다. 그 부하가 Gateway·Bridge·NOVA·GitHub runner 2개와 **단일 코어**를 나눠 쓴다.
Team은 최하위 우선순위(`Nice=10`)로 낮출 수 있으니 이것만으로 중단할 사유는 아니지만,
차단 1~3과 같은 방향을 가리킨다.

---

## 4. 그래서 이번에 한 것 / 하지 않은 것

**한 것 (전부 읽기 전용)**
- Oracle 자원·서비스·타이머·포트·docker 전수 조사
- Toss 토큰 발급 주체 코드 감사
- Bridge 엔드포인트·payload 필드 대조
- Team PAPER의 실제 시장자료 요구 목록화
- Private/Gateway/NOVA 건강 확인

**하지 않은 것 (의도적)**
- Oracle에 파일 생성·설치·수정·삭제 **0건**
- `gaeo-paper` 사용자·`/opt/gaeo-paper`·systemd 유닛 **만들지 않음**
- 저장소 clone **하지 않음** (차단 3)
- `bridge.py`·Gateway·NOVA·Private **손대지 않음**
- `paper_runner_config.json` **그대로** (`activeRunner=WINDOWS`)
- Toss 토큰 **새로 발급하지 않음**
- Windows 예약 작업 **그대로 켜둠**

---

## 5. 나중에 이전을 다시 검토하려면 (선행 조건)

아래가 **전부** 해결돼야 §19의 12개 조건을 따질 수 있다. 하나라도 미해결이면 다시 WINDOWS 유지다.

1. **저장소 비대 문제 해결** — `STATUS.md` 구간 8의 소유자 결정(커밋 빈도 줄이기 / data-live 분리 /
   이력 압축 재개)이 먼저다. 월 2.3 GB 증가가 유지되는 한 어떤 디스크에 얹어도 시한폭탄이다.
2. **디스크 분리** — Private/NOVA와 **다른 볼륨**을 쓸 수 있어야 한다(무료 범위 안에서).
3. **Team 전용 Toss client 자격증명 분리** — Team이 Gateway와 **다른 client**를 쓰면
   "1 client 1 token" 충돌이 원천적으로 사라진다. 이게 가장 깨끗한 해법이며,
   토스 개발자센터에서 별도 앱을 발급받을 수 있는지가 관건이다(비용·정책 확인 필요).
   이 경로면 Bridge를 고칠 필요도 없다.
4. **또는** Private 쪽이 자기 필요로 범용 조회 엔드포인트를 갖게 되는 경우
   (Team 때문이 아니라 Private 자신의 요구로). 그때는 §9의 additive 조건을 다시 따진다.

> 3번이 가장 유망하다. 나머지를 건드리지 않고 차단 1·2를 동시에 없앤다.

---

## 6. 남은 UNKNOWN (추측하지 않고 남긴다)

- 토스가 **한 계정에 복수 client(앱) 발급**을 허용하는지 — 확인 안 했다(개발자센터 접근 필요).
- Oracle VM shape의 **무료 한도 잔여 블록 스토리지** — OCI CLI·콘솔 접근이 없어 확인 못 했다.
- Team이 BRIDGE 모드로 돌 때의 **실제 장중 데이터 충분성** — 애초에 Bridge가 600종목을
  못 주므로 시험 자체를 하지 않았다(UNKNOWN이 아니라 **해당 없음**).

---

## 7. 2026-09-15 Team 모의투자 은퇴 (삭제 아님)

### 무엇을 멈췄나

| 멈춘 것 | 어떻게 |
|---|---|
| 매매 계산·원장 신규 기록·러너 push | `paper_runner_config.json` `activeRunner: "RETIRED"` → `paper_single_writer` 가 **모든** 러너를 거부(fail closed). 집 PC 작업 스케줄러가 켜져 있어도 사이클이 돌지 않는다. |
| 토스 토큰 요청 | 위 게이트가 시세 provider 를 만들기 **전에** 막는다. Team 이 Private 토큰을 끊을 경로가 사라진다. |
| 거래일 미실행 알림 이슈 | `paper-health-alert.yml` schedule 주석 처리(2026-09-15) |
| 주간 Evidence 보고 이슈 | `paper-evidence-report.yml` schedule 주석 처리(2026-09-15) |

### 무엇을 그대로 뒀나 (⭐ 이게 은퇴와 삭제의 차이다)

| 남긴 것 | 왜 |
|---|---|
| `paper_trading/` 원장 전체(1.7 MB) | **실제로 기록된 거래 이력**이다. 가게 문을 닫는 것이지 장부를 태우는 게 아니다. 기존 금지선에 "PAPER 원장"이 명시돼 있다 — 지우거나 재작성하지 않는다. |
| 워크플로 파일 3개 | 되살릴 때 참조할 원본이고, 판정 로직의 계약 테스트가 아직 이 파일들을 읽는다. |
| 원장 보호·단일 기록자 계약 테스트 | 동결된 원장을 지키는 역할은 은퇴 뒤에 오히려 더 중요하다. |
| `ops_status.check_paper()` 감시 | **끄지 않는다.** 아래 참조. |

### ⭐ 감시를 끄지 않는 이유

감시를 지우면, 꺼두지 않은 러너가 은퇴 뒤에 몰래 원장을 다시 써도 아무도 모른다.
그래서 `ops_status` 는 계속 본다:

- 평소: `RETIRED`(은퇴, 기록 보존) — **정상도 장애도 확인 불가도 아닌 별도 어휘**다.
  `OK` 로 적으면 "잘 돌고 있다"로, `FAULT` 로 적으면 "고쳐야 한다"로 잘못 읽힌다.
  종료코드에도 장애로 세지 않는다.
- 은퇴 날짜 뒤에 원장에 새 회차가 생기면: `FAULT` `PAPER_WROTE_AFTER_RETIREMENT`.
- 은퇴 날짜(`retired.at`)를 못 읽으면: 여전히 `RETIRED` 이되 **"신규 기록 감시는 못 한다"**
  고 상세에 밝힌다(모른다를 괜찮다로 바꾸지 않는다).

계약 테스트: `test_ops_status.Verdicts` 4건 · `test_paper_single_writer` 3a-1~3a-5.

### 되살리려면

1. 토스 토큰 충돌이 해소됐는지 먼저 확인한다(위 §5 의 3번 — Team 전용 client 분리가 가장 깨끗하다).
2. `paper_runner_config.json` 의 `activeRunner` 를 `WINDOWS` 또는 `ORACLE` 로 되돌려 `main` 에 커밋한다.
   러너는 이 파일을 커밋할 수 없으므로 **사람이 해야만** 살아난다.
3. `paper-health-alert.yml` · `paper-evidence-report.yml` 의 `schedule` 주석을 푼다.
4. 집 PC 작업 스케줄러를 다시 켠다.

되돌리면 감시도 예전 판정 그대로 돌아온다(계약 테스트
`test_은퇴를_되돌리면_예전_판정이_그대로_돌아온다` 가 이것을 고정한다).

### 사람이 해야 할 일 (남은 것)

- 집 Windows PC 의 작업 스케줄러 「GAEO Paper Trading」 을 해제한다.
  게이트가 막고 있어 켜져 있어도 원장은 안 쓰지만, 매 사이클 헛돌며 로그만 쌓인다.
  절차: `docs/operations/HOME_PC_CHECKLIST.md`
