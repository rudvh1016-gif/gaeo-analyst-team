#!/bin/bash
# 이전 macOS 로컬 환경과의 호환을 위해 남겨 둔 시세 갱신 보조 도구입니다.
cd "$(dirname "$0")"
python3 update_prices.py
./push_if_changed.sh
echo
read -n 1 -s -r -p "완료! 아무 키나 누르면 창이 닫힙니다."
