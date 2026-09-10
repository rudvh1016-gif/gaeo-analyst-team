# 예정 검증 시험 실행 기록 (append-only)

- 원본 일정: `config/validation_schedule.json` · 사람용 표: `docs/VALIDATION_SCHEDULE.md` · 실행기: `run_validation_schedule.py` · 워크플로: `.github/workflows/ops-daily.yml`(평일 17:05 KST)
- `ledger.jsonl`: 한 줄 = 한 번의 공식 실행(scheduleId · runAt · cutoffDate · status · resultPath · nextCheckAt · gitSha · runner · lateHours). **덧붙이기만 한다.** 워크플로가 지워진 줄을 발견하면 커밋을 거부한다.
- `<scheduleId>/<시각>.json`: 결과 전문(단계별 exit·stdout 꼬리·JSON, 입력 SHA-256, main 커밋 SHA). 새 파일로만 쓴다.
- `<scheduleId>/<시각>.inputs.json.gz`: 사전등록 평가의 동결 입력(창 안 판단 기록 + date·close). `python3 run_validation_schedule.py --replay <gz> --result <json>` 으로 같은 판정을 재현한다.
- `<scheduleId>/<시각>.followup.md`: EVALUATED 결과의 후속 조치 **명세**. 코드 변경은 하지 않는다 — 등록 문서 §3 표에 미리 적힌 것만 사람/개발 AI 세션이 그대로 적용한다.
- 상태: COMPLETED · INSUFFICIENT(표본 부족, nextCheckAt) · ANOMALY(이상 → 수리 요청서) · FAILED(단계 실패 → 수리 요청서) · BLOCKED(미구현 명령). 계획 상태 ESCALATED(실패 3회)·RECHECK_LIMIT(재확인 상한)은 사람 확인 필요.
- 결과를 보고 임계값·가설·절차를 바꾸면 사전등록이 소멸한다. 여기 있는 파일은 되돌리기(revert)에서도 다시 쓰지 않는다(`docs/HARNESS.md` §3).
