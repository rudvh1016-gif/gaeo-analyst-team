#!/usr/bin/env bash
# 개오 수집 워크플로 공용 함수 — update-prices.yml · update-analysis.yml이 함께 쓴다.
#
# 왜 파일로 뺐나 (2026-09-09):
#   GitHub은 `run:` 블록 하나를 UTF-8 21,000바이트로 제한한다. 한글 주석은 글자당 3바이트라
#   금방 찬다. 2026-09-07에 update-analysis.yml의 큰 블록이 이 한도를 넘겨 **파일 전체가
#   무효**가 됐다(job 0개 생성 + workflow_dispatch 거부 = 파이프라인이 스스로 못 살아남).
#   그 뒤로도 그 블록은 20,220B(안전선의 98.6%)로 꽉 차 있어서, 꼭 필요한 안전장치조차
#   못 넣는 상태였다. 두 워크플로에 **똑같이 복사돼 있던** 이 함수들을 여기로 옮겨
#   ① 큰 블록에 약 1.5KB의 숨 쉴 자리를 만들고 ② 복사본이 갈라지는 것도 막는다.
#
# 쓰는 법: 워크플로의 run: 블록 맨 앞에서 `. .github/scripts/gaeo-chain.sh`
#   필요한 환경변수 — GH_API · GH_AUTH · IS_MAIN · SELF_WORKFLOW
#   ⚠️ 별도 스텝이 아니라 **같은 스텝에서 source**해야 한다. 셸 함수는 스텝을 넘지 못한다.
#
# ⏱️ 2026-08-04: 아래 curl 두 곳에 시간 제한이 없어, GitHub API가 응답을 안 주면 잡이
# 몇 시간이고 그냥 멈춰 있었다(체인이 안 끊기고 hang만 남는 조용한 사고 유형).
# timeout으로 감싸면 실패해도 "이번 시도 실패"로 처리되고 루프는 계속 돈다.

dispatch() {  # $1=워크플로우 파일명 — main 브랜치로 workflow_dispatch (3회 재시도)
  for i in 1 2 3; do
    code=$(timeout 20 curl -s -o /dev/null -w '%{http_code}' -X POST \
      -H "$GH_AUTH" -H "Accept: application/vnd.github+json" \
      "$GH_API/$1/dispatches" -d '{"ref":"main"}')
    [ "$code" = "204" ] && { echo "dispatch $1 → OK"; return 0; }
    echo "dispatch $1 실패(HTTP $code) — 재시도 $i/3"; sleep 5
  done
  return 1
}

alive() {  # $1=워크플로우 파일명 — main에 queued/in_progress 실행이 있으면 0
  for st in in_progress queued; do
    n=$(timeout 20 curl -s -H "$GH_AUTH" \
      "$GH_API/$1/runs?branch=main&status=$st&per_page=1" \
      | python3 -c "import json,sys;print(json.load(sys.stdin).get('total_count',0))" 2>/dev/null || echo 0)
    [ "${n:-0}" -gt 0 ] && return 0
  done
  return 1
}

chain() {  # 자기 재기동(체인) — main에서만. 실패해도 cron·Routine 안전망이 남는다.
  [ -n "$IS_MAIN" ] || { echo "비 main 브랜치 — 체인 생략"; return 0; }
  dispatch "$SELF_WORKFLOW" || echo "[경고] 체인 재기동 실패 — cron/Routine 안전망에 위임"
}

# 입력 파일 재동기화 — 수집 잡들이 **읽기만** 하는 파일은 매 사이클 원격 최신본으로 덮는다.
#   data.js               = 짝꿍 update-prices가 쓰는 시세
#   price_provenance.json = 그 시세의 가격 출처(같은 회차의 짝, snapshotId로 묶여 있다)
#   analysis.js           = Claude가 쓰는 정밀분석
# ⚠️ data.js와 price_provenance.json은 **반드시 함께** 받아와야 한다(2026-09-15). 하나만
#    새것이면 회차가 어긋나 그 회차 출처가 통째로 '확인 불가'가 된다 — 기능이 조용히 죽는다.
# ⚠️ 파일마다 따로 checkout 한다. 한 번에 여러 경로를 주면 아직 원격에 없는 파일 하나 때문에
#    명령 전체가 실패해 나머지도 안 받아진다.
# 실패해도 루프를 죽이지 않는다(로컬본으로 진행).
sync_inputs() {   # $@ = 받아올 파일(생략하면 입력 3종)
  local ref="${GITHUB_REF_NAME:-main}"
  [ $# -eq 0 ] && set -- data.js price_provenance.json analysis.js
  timeout 120 git fetch origin "$ref" --quiet \
    || { echo "[경고] fetch 실패 — 로컬 입력 파일로 진행"; return 1; }
  for inp in "$@"; do
    git checkout "origin/$ref" -- "$inp" 2>/dev/null || true
  done
  return 0
}
