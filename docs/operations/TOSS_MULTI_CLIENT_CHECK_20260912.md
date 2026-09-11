# Toss Open API 복수 Client 확인 (2026-09-12)

## 결론

현재 공개된 토스증권 공식 문서만으로는 **한 개인 계정에서 `client_id` / `client_secret`을 2개 이상 동시에 발급·유지할 수 있는지 확인할 수 없다.** 따라서 확인 전까지 GAEO Team PAPER의 Oracle 이전은 진행하지 않는다.

GAEO Private 보호가 최우선이며, `paper_runner_config.json`의 `activeRunner=WINDOWS`를 유지한다.

## 공식 문서에서 확인된 사실

- 토스증권 Open API는 OAuth 2.0 Client Credentials Grant를 사용한다.
- 공식 OpenAPI 명세는 **client 당 유효한 access token은 1개**라고 명시한다.
- 같은 client에서 토큰을 재발급하면 이전 access token은 즉시 무효화된다.
- 허용 IP에 없는 요청은 403으로 차단된다.
- Rate limit은 client × API group 단위다.
- `MARKET_DATA` 공식 한도는 현재 초당 최대 15회로 문서화돼 있다.
- `/api/v1/prices`는 한 요청에 최대 200개 심볼을 지원한다.

공식 출처:
- https://developers.tossinvest.com/
- https://developers.tossinvest.com/docs
- https://openapi.tossinvest.com/openapi-docs/latest/openapi.json

## 아직 공식 공개 문서에서 확인되지 않은 것

1. 개인 사용자 1명이 복수 client를 동시에 생성할 수 있는가
2. 가능하다면 최대 개수는 몇 개인가
3. 서로 다른 client A/B의 access token이 완전히 독립적인가
4. 허용 IP가 client별로 독립 관리되는가
5. 같은 증권계정에서 Client A는 계좌 조회, Client B는 시장데이터 조회 전용으로 동시에 사용하는 것이 정책상 허용되는가

위 항목을 추측으로 채우지 않는다.

## 공식 문의

2026-09-12 토스증권 공식 고객지원(support@tossinvest.com)에 다음 내용을 문의했다.

- 동일 계정에서 복수 Client ID 동시 발급 가능 여부
- 최대 발급 개수
- 서로 다른 Client ID 사이의 access token 독립성
- 허용 IP 설정의 client별 독립 여부
- 동일 계정에서 조회용 Client A/B 동시 사용 정책

공식 답변 전에는 별도 client가 가능하다고 가정하지 않는다.

## Oracle 이전 게이트

다음 조건 전부 충족 전에는 Oracle 이전 금지:

1. 복수 client 허용 및 토큰 독립성이 공식 확인될 것
2. Team 전용 client를 실제로 별도 발급할 수 있을 것
3. Team 전용 client의 허용 IP를 Oracle IP로 별도 설정할 수 있을 것
4. Team 자격증명을 Private/Gateway와 완전히 분리할 것
5. 기존 Gateway token issuer 구조를 변경하지 않을 것
6. Oracle 저장공간 문제를 Private/NOVA에 영향 없이 해결할 것
7. Oracle 비활성 시험 후 Private/Gateway/NOVA 건강 상태가 작업 전과 동일할 것
8. Single Writer 전환 절차를 지켜 WINDOWS와 ORACLE이 동시에 장부를 쓰지 않을 것

위 조건 중 하나라도 FALSE 또는 UNKNOWN이면 **WINDOWS 유지**가 정상 판정이다.

## 현재 상태

- GAEO Private / Gateway / NOVA: 기존 정상 상태 유지
- GAEO Team PAPER: Windows 정상 운영
- Oracle Team PAPER: 설치하지 않음
- `activeRunner`: WINDOWS
- Private 토큰 구조: 변경 없음
