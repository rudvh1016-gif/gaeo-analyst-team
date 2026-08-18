# 공유 Toss 토큰 (선택 기능 · 기본 꺼짐)

## 문제

토스증권 공식 계약상 **client 당 유효 access token은 1개**다.
새로 발급하면 이전에 발급된 토큰은 **즉시 무효화된다.**

집 PC에서 같은 Client ID/Secret 을 쓰는 프로그램이 둘 이상이면
(이 Paper Runner + 계좌 조회용 GAEO Gateway) 각자 토큰을 발급하는 순간 서로를 끊는다:

```
Runner  발급 → tok-1        Gateway: 401
Gateway 발급 → tok-2        Runner:  401
Runner  발급 → tok-3        Gateway: 401
…
```

무한 루프는 아니다(양쪽 다 401 재발급을 1회로 제한한다). 하지만 조회가 계속 실패한다.

## 해법

핵심은 "누가 발급하느냐"가 아니라 **"토큰이 하나만 존재하느냐"** 다.
발급 결과를 한 곳에 두고 두 프로그램이 같은 값을 쓴다.

```
Paper Runner ─┐
              ├→ 공유 토큰 저장소 (DPAPI) ─→ Toss /oauth2/token
GAEO Gateway ─┘      + 프로세스 간 잠금
```

- 토큰이 필요하면 먼저 공유 저장소를 본다
- 유효하면 **그대로 쓴다** (발급 0회)
- 만료됐거나 401을 받았을 때만, **잠금 안에서** 한 번 발급하고 저장한다

**이 방식은 어떤 상시 프로세스에도 의존하지 않는다.** 파일과 잠금뿐이므로
Gateway가 설치돼 있지 않거나 꺼져 있어도 Paper Runner는 그대로 동작한다.

## 켜는 법

```powershell
$env:GAEO_SHARED_TOSS_TOKEN = "1"
```

끄려면 변수를 지우면 된다. **기본값은 꺼짐이고, 꺼져 있으면 기존 동작이 100% 그대로다.**

| 환경변수 | 기본 | 설명 |
|---|---|---|
| `GAEO_SHARED_TOSS_TOKEN` | (없음) | `1` 이면 공유 토큰 사용 |
| `GAEO_SECRETS_DIR` | `%LOCALAPPDATA%\GAEO\secrets` | 공유 저장소 위치 |

## 보안

- Windows에서는 **DPAPI**(현재 사용자 계정)로 암호화해 저장한다
- 저장 위치는 **git 저장소 바깥**이다
- 토큰 값을 로그·예외 메시지에 넣지 않는다
- 같은 Windows 사용자만 복호화할 수 있는데, 그 사용자는 어차피 `client_secret` 도
  읽을 수 있으므로 **새로운 노출 등급이 생기지 않는다**

### 하지 않는 것

Paper Runner가 Gateway의 **공개 터널 주소에서 토큰을 받아오는** 설계는 쓰지 않는다.
그러면 access token이 인터넷 경로를 타게 된다.
Gateway에는 토큰을 반환하는 endpoint 자체가 없다.

## 이 변경이 건드리지 않은 것

Trading Logic은 **한 줄도** 바뀌지 않았다:

BUY / SELL / HOLD 판정 · position size · entry / exit · 5거래일 규칙 ·
best ask / best bid · session / NXT · paper state · ledger · ranking

변경된 파일은 `paper_market_data.py` 의 토큰 획득 부분 하나뿐이고,
나머지는 새로 추가된 파일이다.

## 전환 순서 (권장)

1. GAEO Gateway를 집 PC에서 실기 검증한다
2. 검증이 끝나면 `GAEO_SHARED_TOSS_TOKEN=1` 을 켠다
3. Paper Runner를 한 사이클 돌려 정상 동작을 확인한다
4. 문제가 있으면 변수를 지운다 (즉시 원래대로, 코드 revert 불필요)

**전환 전까지는 두 프로그램을 동시에 돌리지 않는 것이 가장 안전하다.**

## 테스트

```bash
python3 test_shared_toss_token.py
```

기본 OFF 동작, 공유 시 발급 1회, **대조군(공유하지 않으면 실제로 서로 무효화됨)**,
만료 갱신 공유, 401 중복 발급 방지, 손상 캐시 복구를 확인한다.
