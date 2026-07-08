#!/bin/bash
# 개오 애널리스트팀 — 시세(data.js)만 갱신 · 토큰 0
# ※ AI 재분석(analysis.js)은 이 스크립트에서 돌리지 않습니다. (토큰 소모 방지)
#    분석이 필요하면 Claude Code에게 "○○종목만 분석해줘"로 원하는 종목만 수동 실행하세요.
cd "$(dirname "$0")"
LOG="update.log"
echo "===== $(date '+%F %T') 시세 갱신 시작 =====" >> "$LOG"

# 시세 갱신 (네이버 정규장 현재가/종가 · 로그인 불필요 · 토큰 0)
python3 update_prices.py >> "$LOG" 2>&1

# 시세가 바뀌었으면 GitHub에 업로드 → 공개 사이트 자동 갱신
./push_if_changed.sh >> "$LOG" 2>&1

echo "===== $(date '+%F %T') 완료 (분석은 수동 전용) =====" >> "$LOG"
echo "" >> "$LOG"
