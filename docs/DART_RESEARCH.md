# DART 당시 정보 가치 연구 v1

목적은 실제 판단의 반복 오답과 공시의 관계를 관찰하는 것이다.
공시를 점수로 바꾸거나 새 BUY/HOLD/SELL을 계산하지 않는다.
상관관계가 발견돼도 투자 정확도 개선이나 인과효과를 입증한 것은 아니다.

## 기존 기능 분류

| 구성 | 작업 시작 상태 |
| --- | --- |
| dart_client.py | COMPLETE |
| DART 수집·저장·실연결 점검 | COMPLETE |
| research_archive | COMPLETE |
| Failure Miner | COMPLETE |
| Evolution·기존 후보·Shadow | COMPLETE |
| performance_orchestrator.py | COMPLETE |
| 실제 판단 원본·결과 저장 | COMPLETE |
| 당시 DART 증거와 실제 오답 비교 | PARTIAL |
| 보호된 Forward DART 증거 연결 | MISSING |
| 같은 ops-daily 실행의 main 저장 수용검사 | PARTIAL |

## 미리 고정한 연구 절차

- 주 노출: **판단 전날 KST 달력일에 접수된 중요 공시 존재 여부**.
  주말도 달력일로 정의한다. 거래일로 임의 연장하지 않는다.
  기존 수집기의 조회 시작일만 전날로 넓힌다. 기존 페이지·API 예산 한도는 유지한다.
  판정 당일 전체 페이지 수집 완료, 종목 매핑 확인, 수집 오류·저장 대기 없음이
  증명돼야 전날의 공시 없음을 인정한다. 예전 장 마감 조회는 밤 공시의 부재 증거가 아니다.
- 같은 날 공식 공개시각의 출처가 없으면 제외한다. 공식 시각이 있더라도
  판단 이후이면 제외한다. 최초 발견 시각을 공식 발표 시각으로 바꾸지 않는다.
  같은 날 공시는 주 비교 창에 섞지 않는다.
- 공시 날짜·최초 발견·해당 메타데이터 확인 시각 모두 검증한다.
  나중 정정 내용을 예전 최초 발견 시각에 붙이지 않는다.
- 분류는 주식수, 합병·분할, 상장·거래, 실적·매출, 자금조달, 지분, 계약, 배당, 기타.
  기타를 제외한 분류의 존재가 주 노출이며, 방향·감성·가산점은 없다.
- 주 비교: Failure Miner의 높은 확신 오답 대 동일 판단일·판단 방향·모델 버전·
  Production 구성·확신도 10점 구간의 일반 판단. 확신도는 확률이 아니다.
  BUY 실패/급락, SELL 후 급등, HOLD 후 큰 움직임, 공시 분류표는 설명용이다.
  이 설명용 표 중 우연히 좋은 값 하나를 골라 후보를 만들지 않는다.
- 공시 확인이 불완전한 행은 비교군의 공시 없음으로 세지 않는다.
  행 수와 판단일 수를 함께 공개하며, 대응 가능한 층을 날짜 안에서 평균하고
  날짜마다 같은 비중을 준다. 기존 판단일 block bootstrap을 사용한다.
- Constitution의 연구 10일·평가 20일, Failure Miner의 8행·5일 조건을 재사용한다.
  연구 결과일은 평가 시작일보다 앞서야 한다. 이 제외 후에도 연구일을 채워야 한다.
  주 비교의 양쪽 구간에 필요한 대응 판단일이 있고 양쪽 95% 구간 하단이
  0보다 클 때만 RESEARCH_SIGNAL_FOUND. 이는 추가 연구 근거일 뿐이다.
  표본이 부족하면 INSUFFICIENT_EVIDENCE, 충분하지만 반복 신호가 없으면 NO_RESEARCH_SIGNAL.

## 증거와 실행 경로

`collect_dart.py`가 이미 조회한 행을 재사용해 전날 공시의 접수번호·분류·시각만
`research_archive/decisions/dart_research/collections/`에 내용 해시 파일로 저장한다.
이미 저장한 공시라서 수집기에서 건너뛴 행도 이번 조회의 증거에는 포함한다.
본문·API Key·원문 제목·오류 문자열은 이 파일에 저장하지 않는다.

`archive_analysis.py --auto`는 기존 실제 원본을 검증한 다음, 같은 GitHub 실행에서
새로 생성된 판단에만 `forward/` 증거를 연결한다. 원본 해시·recordId·판단시각과
수집 확인 시각을 함께 보존한다. 분 단위 판단시각은 그 분의 시작으로 보수적으로 자른다.
실패한 첫 증거를 나중에 성공한 자료로 교체하지 않는다. 과거 원본은 다시 쓰지 않는다.

`build_model_scoreboard.py`의 기존 정상 경로가 별도 내부 `status.json` 연구표를 만든다.
공개 성적표의 분모에는 넣지 않는다. Evolution은 자기 기존 허용 경로
`gaeo_evolution/status/dart_research.json`에 같은 연구를 기록하고 Failure Report에
`dartResearchFocus`만 전달한다. CandidateSpec·가중치·임계값·Production 활성화는 생성하지 않는다.
실제 후보가 생기려면 별도 연구 설계와 기존 Shadow/Gate가 필요하다.

기존 `dart-live-smoke-test`는 연구 코드가 main에 반영될 때 API 재수집 없이
저장된 암호화 자료로 한 번 비교표를 갱신한다. 기존 Secret은 러너 안에서만 사용한다.
이 push 실행은 자연 예약 실행이 아니다. 새 cron은 없다.

과거 일별 판단에는 정확한 시각이 없으므로 KST 자정을 기준으로 복원한다.
그 이전 확인 기록만 참고하며, 검증된 부재 증거가 없으면 UNKNOWN이다.
HISTORICAL_RECONSTRUCTED와 PROTECTED_FORWARD는 표·분모·표본 조건이 분리된다.
기존 PR #558 가격 비교를 통과해 `evaluated`로 저장된 결과만 보호된 결과에 연결한다.
기존 #559/#560 원본·판단범위·사건 이력·자동복구는 그대로 유지한다.

## 자연 예약 실행 수용검사

기존 ops-daily가 상태에 event·runId·attempt·workflowRef·headSha·내용 해시를 남긴다.
다음 기존 예약 점검은 완료된 schedule run과 main에서 읽은 상태가 같은지 확인한다.
`performance_orchestrator.verify_natural_run`은 수동/local, 미완료, 실패, 다른 실행,
다른 내용, main 저장 미확인을 모두 PENDING_NATURAL_RUN으로 둔다.
생성·커밋 성공만으로 NATURAL_RUN_SUCCESS를 쓰지 않는다.

검사: `python -m unittest test_dart_research` 및 기존 DART·판단·성능·ops 계약 검사.
