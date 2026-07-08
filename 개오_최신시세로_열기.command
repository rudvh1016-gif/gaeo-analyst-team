#!/bin/bash
# 더블클릭하면: 최신 시세를 받아온 뒤(무료) → 홈페이지를 엽니다.
# "홈페이지 틀 때마다 최신 반영" 용도. AI 분석은 돌리지 않음(토큰 0).
cd "$(dirname "$0")"
echo "최신 시세 받아오는 중..."
python3 update_prices.py
open index.html
