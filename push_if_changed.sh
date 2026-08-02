#!/bin/bash
# 시세 파일이 바뀌었으면 커밋 후 GitHub에 업로드 → 공개 사이트(GitHub Pages) 자동 갱신
# update_prices.py 실행 직후에 호출됨 (cron·바탕화면 실행기 공용)
cd "$(dirname "$0")"

FILES="data.js price_history.js"

if git diff --quiet -- $FILES; then
  echo "[push] 변경 없음 — 업로드 생략"
  exit 0
fi

git add $FILES
git commit -q -m "자동 시세갱신 $(date '+%F %H:%M')"

# 폰(클라우드) 등에서 먼저 올라간 변경이 있으면 받아서 그 위에 얹음
if ! git pull --rebase --autostash -q origin main 2>&1; then
  git rebase --abort >/dev/null 2>&1
  echo "[push] ⚠️ 원격과 충돌 — 이번 업로드 건너뜀 (다음 갱신 때 재시도)"
  exit 0
fi

if git push -q origin main 2>&1; then
  echo "[push] ✅ 사이트 업로드 완료 ($(date '+%H:%M'))"
else
  echo "[push] ⚠️ 업로드 실패 — 네트워크/인증 확인 필요"
fi
