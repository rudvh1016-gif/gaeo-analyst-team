#!/usr/bin/env bash
#
#  GAEO Paper Trading : Linux(Oracle Cloud) 러너 사이클 (가상매매 전용)
#
#  scripts/paper_cycle.ps1(집 Windows PC 러너)의 안전 설계를 그대로 옮긴 것이다.
#  새로 발명한 규칙은 없다. 순서·판정·exit code가 전부 같다.
#
#  이 스크립트는 "전용 러너 저장소" 안에서만 돈다. 개발용 저장소에서는 절대 실행되지
#  않는다 : 러너 루트 마커(.gaeo-paper-runner)가 없으면 즉시 중단한다.
#
#  ⚠️ 안전 원칙 (paper-trading.yml · paper_cycle.ps1의 철학 그대로)
#    · 실주문·계좌·보유종목 API 호출 0. Toss 시세(Market Data)만 쓴다.
#      (경로 화이트리스트는 paper_market_data.py의 ALLOWED_PATHS가 강제한다)
#    · Secret은 이 파일에 없다. systemd EnvironmentFile이 환경변수로만 넘겨준다.
#      로그에도 절대 남기지 않는다(redact가 값 자체를 마스킹).
#    · SILENT DATA LOSS 금지. Paper 기록이 remote에 저장되지 않았는데
#      성공(exit 0)으로 끝나는 경로는 존재하면 안 된다.
#    · 자동 충돌 해결 금지 · force push 금지 · reset --hard 금지.
#    · 상태가 예상과 다르면 "최신화보다 데이터 보존". 엔진을 돌리지 않고 멈춘다.
#    · Single Writer : 활성 러너가 아니면 엔진이 스스로 아무 것도 하지 않는다
#      (판정은 paper_single_writer.py, 활성 러너는 paper_runner_config.json).
#
#  Secret 없음 / 개인 경로 하드코딩 없음. 공개 저장소에 있어도 안전한 스크립트.
#
#  쓰는 법:
#      bash scripts/paper_cycle.sh --repo /opt/gaeo-paper/repo
#      (systemd가 부르는 방식은 scripts/systemd/gaeo-paper.service 참고)
#
#  exit code (paper_cycle.ps1과 동일)
#      0 정상(변경 없어 커밋 안 한 경우·실행 시간대가 아닌 경우 포함)
#      2 러너 저장소·마커 문제
#      3 브랜치가 main이 아님 등 상태 이상
#      4 예상치 못한 변경이 있어 안전 중단
#      5 네트워크/fetch 실패로 사이클 건너뜀
#      6 동기화(ff/rebase) 실패. 수동 확인 필요
#      7 Paper 엔진 비정상(파이썬 없음 포함)
#      8 화이트리스트 위반 등 커밋 단계 실패
#      9 push 실패(기록은 로컬 커밋으로 보존됨)

set -uo pipefail        # -e 는 쓰지 않는다. 모든 실패를 우리가 직접 판정한다.

REPO_PATH=""
BRANCH="main"
LOG_DIR="${GAEO_PAPER_LOG_DIR:-$HOME/.local/state/gaeo-paper/logs}"
LOG_RETENTION_DAYS=30
IGNORE_WINDOW="${GAEO_PAPER_IGNORE_WINDOW:-0}"

WHITELIST_DIR="paper_trading"
WHITELIST_FILE="paper_public.js"
MARKER_NAME=".gaeo-paper-runner"

# 실행 시간대(KST). 예약 실행은 평일 09:05~15:05이고 앞뒤 여유를 둔 값이다.
WINDOW_DAY_MAX=5        # 1=월 … 5=금
WINDOW_START=855        # 08:55
WINDOW_END=1535         # 15:35

usage() {
    cat <<'USAGE'
GAEO Paper Trading Linux 사이클 러너

  --repo PATH          러너 전용 저장소 경로 (필수)
  --branch NAME        대상 브랜치 (기본 main)
  --log-dir PATH       로그 디렉터리 (기본 ~/.local/state/gaeo-paper/logs)
  --retention-days N   로그 보존 일수 (기본 30)
  --ignore-window      실행 시간대(평일 KST 08:55~15:35) 검사를 건너뛴다(수동 시험용)
  -h, --help           이 도움말
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --repo|-r)        REPO_PATH="${2:-}"; shift 2 ;;
        --branch)         BRANCH="${2:-}"; shift 2 ;;
        --log-dir)        LOG_DIR="${2:-}"; shift 2 ;;
        --retention-days) LOG_RETENTION_DAYS="${2:-}"; shift 2 ;;
        --ignore-window)  IGNORE_WINDOW=1; shift ;;
        -h|--help)        usage; exit 0 ;;
        *) echo "알 수 없는 인자: $1" >&2; usage; exit 2 ;;
    esac
done

# ─────────────────────────────────────────────────────────────────────────────
# 시간 · 로그
# ─────────────────────────────────────────────────────────────────────────────
kst_date() { TZ=Asia/Seoul date "$@"; }

# 로그에 Secret이 흘러들어가는 것을 값 단위로 차단한다.
redact() {
    local text="$1" name value
    for name in TOSS_INVEST_CLIENT_ID TOSS_INVEST_CLIENT_SECRET; do
        value="${!name:-}"
        if [ "${#value}" -ge 4 ]; then
            text="${text//"$value"/***REDACTED***}"
        fi
    done
    # 혹시 모를 Authorization 헤더·토큰 문자열도 통째로 마스킹
    printf '%s' "$text" | sed -E 's/([Bb]earer|[Aa]uthorization|[Aa]ccess_token|[Cc]lient_secret)[[:space:]]*[:=][[:space:]]*[^[:space:]]+/\1: ***REDACTED***/g'
}

LOG_FILE=""
log() {
    local level="${2:-INFO}" stamp line
    stamp="$(kst_date '+%Y-%m-%d %H:%M:%S')"
    line="[$stamp KST] [$level] $(redact "$1")"
    printf '%s\n' "$line"
    if [ -n "$LOG_FILE" ]; then
        printf '%s\n' "$line" >> "$LOG_FILE" 2>/dev/null || true
    fi
}

init_log() {
    mkdir -p "$LOG_DIR" 2>/dev/null || true
    if [ -d "$LOG_DIR" ] && [ -w "$LOG_DIR" ]; then
        LOG_FILE="$LOG_DIR/paper-$(kst_date '+%Y-%m-%d').log"
        # 보존 정책 : 오래된 로그 삭제(디스크·비용 $0 유지)
        find "$LOG_DIR" -maxdepth 1 -name 'paper-*.log' -type f \
             -mtime "+${LOG_RETENTION_DAYS}" -delete 2>/dev/null || true
    else
        printf '%s\n' "[경고] 로그 디렉터리를 쓸 수 없어 화면에만 남긴다: $LOG_DIR" >&2
    fi
}

stop_cycle() {   # stop_cycle "사유" code [LEVEL]
    log "$1" "${3:-ERROR}"
    log "최종 exit code: $2"
    exit "$2"
}

# ─────────────────────────────────────────────────────────────────────────────
# git 헬퍼 : 성공 판정은 언제나 종료코드로 한다
# ─────────────────────────────────────────────────────────────────────────────
GIT_OUT=""
GIT_CODE=0
git_run() {
    GIT_OUT="$(git "$@" 2>&1)"
    GIT_CODE=$?
    return 0
}

git_ok() {   # git_ok "무엇" -> 직전 git_run 결과 판정
    if [ "$GIT_CODE" -ne 0 ]; then
        log "$1 실패 (exit $GIT_CODE): $GIT_OUT" ERROR
        return 1
    fi
    return 0
}

# ─────────────────────────────────────────────────────────────────────────────
# 0. 준비 · 안전 가드
# ─────────────────────────────────────────────────────────────────────────────
init_log
log '===== GAEO Paper Trading 사이클 시작 (Linux) ====='

# 실행 시간대 밖이면 아무 것도 하지 않는다.
# ⚠️ VM 시간대가 UTC로 남아 있으면 systemd timer의 OnCalendar가 UTC로 해석돼
#    엉뚱한 시각에 깨어난다. 그때 조용히 매매를 돌리지 않도록 스크립트가 스스로
#    KST 기준으로 한 번 더 확인한다(시각 판정은 TZ=Asia/Seoul로 고정).
if [ "$IGNORE_WINDOW" != "1" ]; then
    dow="$(kst_date '+%u')"
    hm="$((10#$(kst_date '+%H%M')))"
    if [ "$dow" -gt "$WINDOW_DAY_MAX" ] || [ "$hm" -lt "$WINDOW_START" ] || [ "$hm" -gt "$WINDOW_END" ]; then
        log "실행 시간대가 아니라 이번 사이클을 건너뛴다 (KST $(kst_date '+%a %H:%M'), 허용 평일 08:55~15:35)" WARN
        log '최종 exit code: 0'
        exit 0
    fi
fi

if [ -z "$REPO_PATH" ]; then
    stop_cycle '러너 저장소 경로(--repo)가 지정되지 않았다' 2
fi
if [ ! -d "$REPO_PATH" ]; then
    stop_cycle "러너 저장소를 찾을 수 없다: $REPO_PATH" 2
fi

# ⚠️ 개발용 저장소 오작동 방지 : 러너 루트에만 있는 마커를 확인한다.
RUNNER_ROOT="$(cd "$REPO_PATH/.." && pwd)"
if [ ! -e "$RUNNER_ROOT/$MARKER_NAME" ]; then
    stop_cycle "러너 마커($MARKER_NAME)가 없다. 개발용 저장소일 수 있어 실행을 거부한다: $REPO_PATH" 2
fi

cd "$REPO_PATH" || stop_cycle "저장소로 이동할 수 없다: $REPO_PATH" 2

git_run rev-parse --is-inside-work-tree
if [ "$GIT_CODE" -ne 0 ] || [ "$GIT_OUT" != "true" ]; then
    stop_cycle "git 저장소가 아니다: $REPO_PATH" 2
fi

# 분리된 HEAD·다른 브랜치에서는 절대 자동 실행하지 않는다.
git_run symbolic-ref --short -q HEAD
if [ "$GIT_CODE" -ne 0 ] || [ "$GIT_OUT" != "$BRANCH" ]; then
    stop_cycle "현재 브랜치가 '$BRANCH'가 아니다(detached이거나 다른 브랜치): '$GIT_OUT'. 자동 실행 중단" 3
fi

git_run rev-parse HEAD
log "러너 HEAD(시작): $GIT_OUT"

# 🔒 Single Writer : 이 스크립트는 Linux(Oracle) 러너 전용이므로 자기 이름을 스스로 선언한다.
#    이미 선언돼 있으면 존중한다(수동 시험 실행에서 덮어쓰지 않는다).
#    ⚠️ 여기서 게이트를 걸어 미리 종료하면 안 된다. 아래 2단계 원격 동기화를 먼저 해야
#       "내가 활성으로 바뀌었다"는 설정 변경(paper_runner_config.json)을 읽을 수 있다.
#       실제 판정은 엔진 진입점(paper_single_writer.allow)이 한다.
if [ -z "${GAEO_PAPER_RUNNER:-}" ]; then
    export GAEO_PAPER_RUNNER="ORACLE"
fi
log "Single Writer 선언: $GAEO_PAPER_RUNNER (활성 러너는 paper_runner_config.json이 정한다)"

# ─────────────────────────────────────────────────────────────────────────────
# 1. 작업트리 점검 : Paper 산출물 이외의 변경이 있으면 손대지 않고 중단
# ─────────────────────────────────────────────────────────────────────────────
is_whitelisted() {
    local p="${1//\\//}"
    p="${p#\"}"; p="${p%\"}"
    [ "$p" = "$WHITELIST_FILE" ] && return 0
    case "$p" in
        "$WHITELIST_DIR"/*) return 0 ;;
    esac
    return 1
}

git_run status --porcelain
git_ok 'git status' || stop_cycle 'git status 실패. 중단' 3
STATUS_OUT="$GIT_OUT"

DIRTY=()
FOREIGN=()
while IFS= read -r line; do
    [ -z "${line//[[:space:]]/}" ] && continue
    # porcelain v1 형식: XY<공백><경로>  (X,Y는 각각 1글자 상태코드)
    if [ "${#line}" -lt 4 ]; then
        stop_cycle "git status 출력을 해석할 수 없다: '$line'. 안전을 위해 중단" 4
    fi
    path="${line:3}"
    case "$path" in
        *' -> '*) path="${path##* -> }" ;;
    esac
    DIRTY+=("$path")
    is_whitelisted "$path" || FOREIGN+=("$path")
done <<< "$STATUS_OUT"

if [ "${#FOREIGN[@]}" -gt 0 ]; then
    stop_cycle "예상하지 못한 변경이 러너 저장소에 있다. reset/stash 하지 않고 중단한다: ${FOREIGN[*]}" 4
fi

# 직전 사이클이 push까지 못 간 채 남긴 Paper 산출물이면 먼저 커밋해 보존한다.
RECOVERED=0
if [ "${#DIRTY[@]}" -gt 0 ]; then
    log "직전 사이클의 미커밋 Paper 산출물 발견. 삭제하지 않고 커밋해 보존한다: ${DIRTY[*]}" WARN
    git_run add -- "$WHITELIST_DIR" "$WHITELIST_FILE"
    git_ok 'git add(복구)' || stop_cycle '복구 스테이징 실패. 중단' 4
    git_run diff --cached --quiet
    if [ "$GIT_CODE" -ne 0 ]; then
        git_run commit -m 'paper: 직전 사이클 미커밋 결과 보존 (linux runner) [skip ci]'
        git_ok 'git commit(복구)' || stop_cycle '복구 커밋 실패. 중단' 4
        log '미커밋 Paper 산출물을 복구 커밋으로 보존했다.'
        RECOVERED=1
    fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# 2. 원격 동기화 : 안전할 때만 최신 main을 반영한다
# ─────────────────────────────────────────────────────────────────────────────
git_run fetch origin "$BRANCH"
if [ "$GIT_CODE" -ne 0 ]; then
    # 네트워크·GitHub 장애. 엔진도 어차피 인터넷이 필요하니 이번 사이클은 건너뛴다.
    log "원격 fetch 실패. 이번 사이클은 건너뛴다(데이터 보존 우선). $GIT_OUT" WARN
    log 'remote sync: SKIPPED'
    stop_cycle '사이클 건너뜀 (fetch 실패)' 5 WARN
fi

git_run rev-parse HEAD;                  LOCAL_SHA="$GIT_OUT"
git_run rev-parse "origin/$BRANCH";      REMOTE_SHA="$GIT_OUT"
git_run merge-base HEAD "origin/$BRANCH"; BASE_SHA="$GIT_OUT"

if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
    log 'remote sync: 이미 최신(동일 커밋)'
elif [ "$LOCAL_SHA" = "$BASE_SHA" ]; then
    # 로컬이 뒤처짐 → fast-forward만 허용
    git_run merge --ff-only "origin/$BRANCH"
    if [ "$GIT_CODE" -ne 0 ]; then
        stop_cycle "fast-forward 실패. 자동 병합하지 않고 중단한다. $GIT_OUT" 6
    fi
    git_run rev-parse HEAD
    log "remote sync: fast-forward 완료 → $GIT_OUT"
elif [ "$REMOTE_SHA" = "$BASE_SHA" ]; then
    log 'remote sync: 로컬에 아직 push되지 않은 Paper 커밋이 있다(뒤에서 push 시도)'
else
    # 갈라짐 : Paper 커밋을 최신 main 위로 재적용(자동 충돌 해결 금지)
    log 'remote sync: 로컬/원격이 갈라짐. Paper 커밋을 최신 main 위로 rebase 시도'
    git_run rebase "origin/$BRANCH"
    if [ "$GIT_CODE" -ne 0 ]; then
        rebase_out="$GIT_OUT"
        git_run rebase --abort
        stop_cycle "rebase 충돌. abort했다. Paper 기록은 로컬에 그대로 보존된다. 수동 확인 필요. $rebase_out" 6
    fi
    git_run rev-parse HEAD
    log "remote sync: rebase 완료 → $GIT_OUT"
fi

git_run rev-parse HEAD
log "러너 HEAD(동기화 후): $GIT_OUT"

# ─────────────────────────────────────────────────────────────────────────────
# 3. Paper 엔진 실행 (시세 전용)
# ─────────────────────────────────────────────────────────────────────────────
export PYTHONUTF8=1
export PYTHONIOENCODING=utf-8

PY=""
for candidate in python3 python; do
    if command -v "$candidate" >/dev/null 2>&1; then PY="$candidate"; break; fi
done
[ -n "$PY" ] || stop_cycle 'Python 실행기를 찾을 수 없다(python3·python 모두 없음)' 7

run_paper_script() {   # run_paper_script 파일 [continue_on_error]
    local script="$1" cont="${2:-0}" out code line
    out="$("$PY" "$script" 2>&1)"
    code=$?
    while IFS= read -r line; do
        [ -n "${line//[[:space:]]/}" ] && log "  $script | $line"
    done <<< "$out"
    if [ "$code" -ne 0 ]; then
        if [ "$cont" = "1" ]; then
            log "$script 실패(exit $code). 기록 커밋은 계속" WARN
        else
            log "$script 실패(exit $code)" ERROR
        fi
    else
        log "$script 정상 종료(exit 0)"
    fi
    return "$code"
}

[ -f "$REPO_PATH/paper_engine.py" ] || stop_cycle 'paper_engine.py가 러너 저장소에 없다. 중단' 7

run_paper_script paper_engine.py
ENGINE_CODE=$?
if [ "$ENGINE_CODE" -ne 0 ]; then
    # 엔진은 설계상 항상 exit 0이다. 0이 아니면 비정상. 가짜 데이터를 만들지 않고 중단.
    stop_cycle "Paper Engine 비정상 종료(exit $ENGINE_CODE). 결과를 커밋하지 않는다" 7
fi

# 🧪 두 번째 전략(업종 흐름 급등주 단기 보유) : 기본 OFF.
#    GAEO_PAPER_MOMENTUM=1 일 때만 실제로 돈다. 스크립트가 스스로 꺼짐을 판단해
#    즉시 종료하므로 여기서는 조건 없이 부른다.
#    ⚠️ 실패해도 기존 전략의 기록 커밋을 막지 않는다.
[ -f "$REPO_PATH/paper_momentum.py" ] && run_paper_script paper_momentum.py 1 || true

# 🧪 세 번째 전략(Smart V2) : 기본 ON. 끄려면 GAEO_PAPER_SMART_V2=0.
#    별도 폴더(paper_trading/smart_v2)라 V1 기록과 섞이지 않고,
#    실패해도 기존 전략의 기록 커밋을 막지 않는다.
[ -f "$REPO_PATH/paper_smart_v2.py" ] && run_paper_script paper_smart_v2.py 1 || true

# 🧪 네 번째 전략(Scalp V3 — 단타) : 기본 ON. 끄려면 GAEO_PAPER_SCALP_V3=0.
#    별도 폴더(paper_trading/scalp_v3)라 V1·V2 기록과 섞이지 않고,
#    실패해도 기존 전략의 기록 커밋을 막지 않는다.
[ -f "$REPO_PATH/paper_scalp_v3.py" ] && run_paper_script paper_scalp_v3.py 1 || true

# 워크플로와 동일한 의미: report·public 실패는 기록 커밋을 막지 않는다.
run_paper_script paper_report.py 1 || true
run_paper_script paper_public.py 1 || true

# ─────────────────────────────────────────────────────────────────────────────
# 4. 화이트리스트 커밋 : Paper 산출물 외에는 절대 커밋하지 않는다
# ─────────────────────────────────────────────────────────────────────────────
git_run add -- "$WHITELIST_DIR" "$WHITELIST_FILE"
git_ok 'git add(결과)' || stop_cycle '결과 스테이징 실패. 중단' 8

git_run diff --cached --name-only
git_ok 'git diff --cached' || stop_cycle 'staged 목록 조회 실패. 중단' 8

STAGED=()
VIOLATIONS=()
while IFS= read -r line; do
    [ -z "${line//[[:space:]]/}" ] && continue
    STAGED+=("$line")
    is_whitelisted "$line" || VIOLATIONS+=("$line")
done <<< "$GIT_OUT"

if [ "${#VIOLATIONS[@]}" -gt 0 ]; then
    git_run reset
    stop_cycle "허용되지 않은 파일이 staged 되었다. 커밋하지 않고 실패 처리한다: ${VIOLATIONS[*]}" 8
fi

if [ "${#STAGED[@]}" -eq 0 ]; then
    if [ "$RECOVERED" = "1" ]; then
        log 'Paper 결과 변경 없음(단, 복구 커밋이 있어 push는 진행)'
    else
        # 로컬에 push 안 된 커밋이 남아있을 수 있으니 확인 후 종료 판단
        git_run rev-list --count "origin/$BRANCH..HEAD"
        if [ "$GIT_OUT" = "0" ]; then
            log 'commit 생성 여부: 없음 (Paper 결과 변경 없음). push 없이 정상 종료'
            log '최종 exit code: 0'
            log '===== 사이클 종료 ====='
            exit 0
        fi
        log "commit 생성 여부: 없음, 다만 push 안 된 커밋 ${GIT_OUT}건이 있어 push를 진행한다" WARN
    fi
else
    log "커밋 대상(화이트리스트 검증 통과): ${STAGED[*]}"
    git_run commit -m 'paper: 가상매매 사이클 기록 (linux runner) [skip ci]'
    git_ok 'git commit' || stop_cycle '커밋 실패. 중단' 8
    git_run rev-parse HEAD
    log "commit 생성 여부: 생성됨 → $GIT_OUT"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 5. push : 재시도·rebase·충돌 시 중단(force 금지, 자동 충돌 해결 금지)
# ─────────────────────────────────────────────────────────────────────────────
PUSHED=0
for i in 1 2 3 4; do
    git_run push origin "HEAD:refs/heads/$BRANCH"
    if [ "$GIT_CODE" -eq 0 ]; then PUSHED=1; break; fi

    wait_sec=$((1 << i))
    log "push 실패 (시도 $i/4). ${wait_sec}초 대기 후 fetch/rebase. $GIT_OUT" WARN
    sleep "$wait_sec"

    git_run fetch origin "$BRANCH"
    if [ "$GIT_CODE" -ne 0 ]; then
        log "fetch 실패. 다음 재시도로 진행. $GIT_OUT" WARN
        continue
    fi
    # 이미 만든 Paper 커밋을 새 main 위로 replay할 뿐. 엔진을 다시 돌리지 않는다.
    git_run rebase "origin/$BRANCH"
    if [ "$GIT_CODE" -ne 0 ]; then
        rebase_out="$GIT_OUT"
        git_run rebase --abort
        stop_cycle "rebase 충돌. 자동 병합하지 않는다. Paper 기록은 로컬 커밋으로 보존됨(다음 사이클에서 재시도). $rebase_out" 9
    fi
done

if [ "$PUSHED" -ne 1 ]; then
    stop_cycle 'push 4회 재시도 모두 실패. Paper 기록이 remote에 저장되지 않았다(로컬 커밋으로 보존, 다음 사이클 재시도)' 9
fi

git_run rev-parse HEAD
log "push 결과: 성공 ($BRANCH) → $GIT_OUT"
log '최종 exit code: 0'
log '===== 사이클 종료 ====='
exit 0
