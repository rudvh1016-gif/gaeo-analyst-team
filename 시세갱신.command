#!/bin/bash
# 더블클릭하면 시세를 갱신합니다 (data.js 재생성)
cd "$(dirname "$0")"
python3 update_prices.py
./push_if_changed.sh
echo
read -n 1 -s -r -p "완료! 아무 키나 누르면 창이 닫힙니다."
