#!/bin/bash
# 이전 macOS 로컬 환경과의 호환을 위해 남겨 둔 미리보기 보조 도구입니다.
# 운영 사이트의 데이터는 GitHub Actions가 자동으로 갱신합니다.
cd "$(dirname "$0")"
echo "최신 시세 받아오는 중..."
python3 update_prices.py
./push_if_changed.sh
open index.html
