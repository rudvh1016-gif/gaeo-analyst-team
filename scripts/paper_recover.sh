#!/usr/bin/env bash
#
#  GAEO Paper 러너 복구 도구 (Linux 판) : 원격 이력이 재작성된 뒤 러너 전용 저장소를 안전하게 되살린다.
#  scripts/paper_recover.ps1(집 Windows PC 판)과 같은 단계·같은 판정·같은 종료코드다.
#
#  기본은 검사 모드(--mode check) : 아무것도 바꾸지 않는다(fetch 만 한다). 상태·판정·계획을 보여 준다.
#  실행 모드(--mode apply) : 로컬 장부가 원격에 전부 들어 있음이 **내용으로** 증명될 때만
#      백업(paper_trading 복사·옛 HEAD bundle·sha256 manifest 를 만들고 검증) → 옛 HEAD 를 refs/gaeo-backup/ 에 보존
#      → 브랜치 포인터만 origin/main 으로 옮긴다(checkout -B). 증명 못 하면 미전송 기록을 별도 폴더에 보존하고
#      exit 11 로 멈춘다(재기준하지 않는다). 단계마다 실패하면 그 자리에서 멈춘다.
#
#  하지 않는 것 : reset --hard · clean · force push · stash · allow-unrelated-histories · 원격 이력 재작성 ·
#      실주문 · 다른 저장소(retailpulse·gaeo-private·gaeo-gateway 등)에서 실행 — 원격 주소가 다르면 exit 2.
#
#  쓰는 법:
#      bash scripts/paper_recover.sh --repo /opt/gaeo-paper/repo                 # 검사만
#      bash scripts/paper_recover.sh --repo /opt/gaeo-paper/repo --mode apply    # 복구 실행
#
#  종료코드
#      0  할 일 없음(이미 최신·fast-forward 가능·안 올린 커밋만·갈라짐 — 사이클이 스스로 처리) / apply 에서 재기준 완료
#      10 (check) 재기준 가능 — 로컬 장부가 원격에 전부 포함됨이 증명됐다. --mode apply 로 실행하면 된다
#      11 수동 확인 필요(포함 증명 실패·판정 불가·외부 변경·얕은 복제·조회 실패). apply 면 미전송 기록을 보존해 둔다
#      2  저장소·마커·원격 주소·브랜치 불일치(다른 저장소에서는 절대 돌지 않는다)
#      3  다른 사이클·복구 도구가 실행 중(잠금)
#      5  fetch 실패
#      6  apply 단계 실패(백업 실패 등) — 재기준하지 않았다
#      7  파이썬 없음·포함성 모듈 없음

set -uo pipefail

REPO_PATH=""
MODE="check"
BRANCH="main"
EXPECT_REMOTE="${GAEO_PAPER_EXPECT_REMOTE:-rudvh1016-gif/gaeo-analyst-team}"
LOG_DIR="${GAEO_PAPER_LOG_DIR:-$HOME/.local/state/gaeo-paper/logs}"
BACKUP_DIR="${GAEO_PAPER_BACKUP_DIR:-$HOME/.local/state/gaeo-paper/backups}"
LOCK_DIR="${GAEO_PAPER_LOCK_DIR:-}"
RUN_CYCLE=0
SERVICE="${GAEO_PAPER_SERVICE:-gaeo-paper}"

WHITELIST_DIR="paper_trading"
WHITELIST_FILE="paper_public.js"
MARKER_NAME=".gaeo-paper-runner"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

usage() {
    cat <<'USAGE'
GAEO Paper 러너 복구 도구 (Linux)

  --repo PATH            러너 전용 저장소 경로 (필수)
  --mode check|apply     검사만(기본) / 복구 실행
  --branch NAME          대상 브랜치 (기본 main)
  --expect-remote TEXT   origin 주소에 이 문자열이 있어야 한다 (기본 rudvh1016-gif/gaeo-analyst-team)
  --backup-dir PATH      백업 폴더 (기본 ~/.local/state/gaeo-paper/backups) — 클라우드 동기화가 안 되는 곳
  --log-dir PATH         로그 폴더 (기본 ~/.local/state/gaeo-paper/logs)
  --lock-dir PATH        잠금 폴더 (기본 <러너 루트>/cycle.lock — 사이클과 같은 잠금)
  --run-cycle            (apply) 재기준 뒤 systemd 서비스로 사이클 1회 기동 (있을 때만)
  --service NAME         systemd 유닛 이름 (기본 gaeo-paper)
  -h, --help             이 도움말
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --repo|-r)        REPO_PATH="${2:-}"; shift 2 ;;
        --mode)           MODE="${2:-}"; shift 2 ;;
        --branch)         BRANCH="${2:-}"; shift 2 ;;
        --expect-remote)  EXPECT_REMOTE="${2:-}"; shift 2 ;;
        --backup-dir)     BACKUP_DIR="${2:-}"; shift 2 ;;
        --log-dir)        LOG_DIR="${2:-}"; shift 2 ;;
        --lock-dir)       LOCK_DIR="${2:-}"; shift 2 ;;
        --run-cycle)      RUN_CYCLE=1; shift ;;
        --service)        SERVICE="${2:-}"; shift 2 ;;
        -h|--help)        usage; exit 0 ;;
        *) echo "알 수 없는 인자: $1" >&2; usage; exit 2 ;;
    esac
done
case "$MODE" in check|apply) ;; *) echo "--mode 는 check 또는 apply 여야 한다: $MODE" >&2; exit 2 ;; esac

# ─────────────────────────────────────────────────────────────────────────────
# 로그 · 잠금 · git 헬퍼 (paper_cycle.sh 와 같은 규칙)
# ─────────────────────────────────────────────────────────────────────────────
kst_date() { TZ=Asia/Seoul date "$@"; }
redact() {
    local text="$1" name value
    for name in TOSS_INVEST_CLIENT_ID TOSS_INVEST_CLIENT_SECRET; do
        value="${!name:-}"
        [ "${#value}" -ge 4 ] && text="${text//"$value"/***REDACTED***}"
    done
    printf '%s' "$text" | sed -E 's/([Bb]earer|[Aa]uthorization|[Aa]ccess_token|[Cc]lient_secret)[[:space:]]*[:=][[:space:]]*[^[:space:]]+/\1: ***REDACTED***/g'
}
LOG_FILE=""
log() {
    local level="${2:-INFO}" line
    line="[$(kst_date '+%Y-%m-%d %H:%M:%S') KST] [$level] $(redact "$1")"
    printf '%s\n' "$line"
    [ -n "$LOG_FILE" ] && { printf '%s\n' "$line" >> "$LOG_FILE" 2>/dev/null || true; }
    return 0
}
init_log() {
    mkdir -p "$LOG_DIR" 2>/dev/null || true
    if [ -d "$LOG_DIR" ] && [ -w "$LOG_DIR" ]; then
        LOG_FILE="$LOG_DIR/recover-$(kst_date '+%Y-%m-%d').log"
    fi
}
finish() {   # finish "사유" code [LEVEL]
    log "$1" "${3:-INFO}"
    log "복구 도구 종료코드: $2 (모드 $MODE)"
    exit "$2"
}

LOCK_HELD=0
INCLUSION_MODULE_TMP=""
release_lock() {
    if [ "$LOCK_HELD" = "1" ] && [ -d "$LOCK_DIR" ]; then rm -rf "$LOCK_DIR" 2>/dev/null || true; LOCK_HELD=0; fi
    [ -n "$INCLUSION_MODULE_TMP" ] && rm -f "$INCLUSION_MODULE_TMP" 2>/dev/null
    return 0
}
trap release_lock EXIT
lock_pid_alive() {   # lock_pid_alive DIR -> 0 이면 잠금을 쥔 실행이 살아 있다(또는 아직 판정할 수 없다)
    local pid age now mtime
    if [ ! -f "$1/pid" ]; then
        # mkdir 직후 pid 를 쓰기 전의 짧은 창일 수 있다 — 30초 안 된 잠금은 살아 있는 것으로 본다(빼앗지 않는다).
        mtime="$(stat -c %Y "$1" 2>/dev/null || stat -f %m "$1" 2>/dev/null || echo 0)"
        now="$(date +%s)"; age=$((now - mtime))
        [ "$age" -lt 30 ]
        return
    fi
    pid="$(tr -cd '0-9' < "$1/pid" 2>/dev/null)"
    [ -n "$pid" ] || return 1
    # kill -0 은 권한이 없어도(다른 사용자 프로세스) 실패하므로 /proc 도 본다 — 모르면 살아 있는 쪽으로.
    kill -0 "$pid" 2>/dev/null || [ -d "/proc/$pid" ]
}
acquire_lock() {
    # 기본 잠금 위치는 러너 루트(마커 옆) — 사이클(paper_cycle.sh)과 같은 잠금.
    [ -n "$LOCK_DIR" ] || LOCK_DIR="$RUNNER_ROOT/cycle.lock"
    mkdir -p "$(dirname "$LOCK_DIR")" 2>/dev/null || true
    if ! mkdir "$LOCK_DIR" 2>/dev/null; then
        if lock_pid_alive "$LOCK_DIR"; then
            finish "다른 사이클(또는 복구 도구)이 실행 중이다(잠금: $LOCK_DIR, pid $(cat "$LOCK_DIR/pid" 2>/dev/null)). 겹쳐 돌지 않는다. 끝나기를 기다렸다가 다시 실행" 3 ERROR
        fi
        log "오래된 잠금(죽은 프로세스)을 넘겨받는다: $LOCK_DIR" WARN
        rm -rf "$LOCK_DIR" 2>/dev/null
        mkdir "$LOCK_DIR" 2>/dev/null || finish "잠금을 만들 수 없다: $LOCK_DIR" 3 ERROR
    fi
    printf '%s\n' "$$" > "$LOCK_DIR/pid" 2>/dev/null || true
    LOCK_HELD=1
}

GIT_OUT=""; GIT_CODE=0
git_run() { GIT_OUT="$(git "$@" 2>&1)"; GIT_CODE=$?; return 0; }

is_whitelisted() {
    local p="${1//\\//}"; p="${p#\"}"; p="${p%\"}"
    [ "$p" = "$WHITELIST_FILE" ] && return 0
    case "$p" in "$WHITELIST_DIR"/*) return 0 ;; esac
    return 1
}

# ─────────────────────────────────────────────────────────────────────────────
# [1/8] 저장소 확인 : 경로·마커·git·원격 주소·브랜치. 하나라도 다르면 아무것도 하지 않는다.
# ─────────────────────────────────────────────────────────────────────────────
init_log
log "===== GAEO Paper 러너 복구 도구 (Linux) 시작 — 모드 $MODE ====="
[ -n "$REPO_PATH" ] || finish '러너 저장소 경로(--repo)가 지정되지 않았다' 2 ERROR
[ -d "$REPO_PATH" ] || finish "러너 저장소를 찾을 수 없다: $REPO_PATH" 2 ERROR
RUNNER_ROOT="$(cd "$REPO_PATH/.." && pwd)"
[ -e "$RUNNER_ROOT/$MARKER_NAME" ] || finish "[1/8] 러너 마커($MARKER_NAME)가 $RUNNER_ROOT 에 없다. 러너 전용 저장소가 아니면 실행하지 않는다(개발용 저장소·다른 프로젝트에서 돌리지 말 것)" 2 ERROR
cd "$REPO_PATH" || finish "저장소로 이동할 수 없다: $REPO_PATH" 2 ERROR
git_run rev-parse --is-inside-work-tree
{ [ "$GIT_CODE" -eq 0 ] && [ "$GIT_OUT" = "true" ]; } || finish "[1/8] git 저장소가 아니다: $REPO_PATH" 2 ERROR
git_run remote get-url origin
[ "$GIT_CODE" -eq 0 ] || finish "[1/8] origin 원격이 없다: $GIT_OUT" 2 ERROR
ORIGIN_URL="$GIT_OUT"
origin_norm="$(printf '%s' "$ORIGIN_URL" | tr 'A-Z' 'a-z' | sed -E 's#\.git/?$##; s#/+$##')"
expect_norm="$(printf '%s' "$EXPECT_REMOTE" | tr 'A-Z' 'a-z' | sed -E 's#\.git/?$##; s#/+$##')"
if [ -n "$expect_norm" ]; then
    case "$origin_norm" in
        *"$expect_norm"*) ;;
        *) finish "[1/8] origin 주소가 예상 저장소($EXPECT_REMOTE)가 아니다: $ORIGIN_URL. 다른 저장소에서는 절대 복구를 돌리지 않는다" 2 ERROR ;;
    esac
fi
git_run symbolic-ref --short -q HEAD
{ [ "$GIT_CODE" -eq 0 ] && [ "$GIT_OUT" = "$BRANCH" ]; } || finish "[1/8] 현재 브랜치가 '$BRANCH'가 아니다(detached 이거나 다른 브랜치): '$GIT_OUT'. 손대지 않는다" 2 ERROR
git_run rev-parse HEAD; HEAD_START="$GIT_OUT"
log "[1/8] 저장소 확인 OK: $REPO_PATH · origin=$ORIGIN_URL · 브랜치 $BRANCH · HEAD $HEAD_START"

# ─────────────────────────────────────────────────────────────────────────────
# [2/8] 잠금 · 파이썬
# ─────────────────────────────────────────────────────────────────────────────
acquire_lock
PY=""
for candidate in python3 python; do command -v "$candidate" >/dev/null 2>&1 && { PY="$candidate"; break; }; done
[ -n "$PY" ] || finish '[2/8] Python 실행기를 찾을 수 없다(python3·python 모두 없음)' 7 ERROR
log "[2/8] 잠금 확보($LOCK_DIR) · 파이썬 $PY"

# ─────────────────────────────────────────────────────────────────────────────
# [3/8] 작업트리 : Paper 산출물 이외의 변경이 있으면 멈춘다. Paper 산출물은 apply 에서 복구 커밋으로 보존한다.
# ─────────────────────────────────────────────────────────────────────────────
git_run status --porcelain
[ "$GIT_CODE" -eq 0 ] || finish "[3/8] git status 실패: $GIT_OUT" 11 ERROR
DIRTY=(); FOREIGN=()
while IFS= read -r line; do
    [ -z "${line//[[:space:]]/}" ] && continue
    [ "${#line}" -ge 4 ] || finish "[3/8] git status 출력을 해석할 수 없다: '$line'" 11 ERROR
    path="${line:3}"; case "$path" in *' -> '*) path="${path##* -> }" ;; esac
    DIRTY+=("$path"); is_whitelisted "$path" || FOREIGN+=("$path")
done <<< "$GIT_OUT"
if [ "${#FOREIGN[@]}" -gt 0 ]; then
    finish "[3/8] Paper 산출물이 아닌 변경이 러너 저장소에 있다: ${FOREIGN[*]} — reset/stash 하지 않는다. 사람이 확인해 치운 뒤(다른 곳에 옮기거나 커밋) 다시 실행" 11 ERROR
fi
RECOVERED=0
if [ "${#DIRTY[@]}" -gt 0 ]; then
    if [ "$MODE" = "apply" ]; then
        log "[3/8] 미커밋 Paper 산출물 ${#DIRTY[@]}개 → 삭제하지 않고 복구 커밋으로 보존한다: ${DIRTY[*]}" WARN
        git_run add -- "$WHITELIST_DIR" "$WHITELIST_FILE"
        [ "$GIT_CODE" -eq 0 ] || finish "[3/8] 복구 스테이징 실패: $GIT_OUT" 6 ERROR
        git_run diff --cached --quiet
        if [ "$GIT_CODE" -ne 0 ]; then
            git_run commit -m 'paper: 복구 도구가 미커밋 결과 보존 [skip ci]'
            [ "$GIT_CODE" -eq 0 ] || finish "[3/8] 복구 커밋 실패: $GIT_OUT" 6 ERROR
            RECOVERED=1
            git_run rev-parse HEAD; log "[3/8] 복구 커밋 생성 → $GIT_OUT"
        fi
    else
        log "[3/8] 미커밋 Paper 산출물 ${#DIRTY[@]}개(검사 모드라 손대지 않음; apply 에서 복구 커밋으로 보존): ${DIRTY[*]}" WARN
    fi
else
    log "[3/8] 작업트리 깨끗함"
fi

# ─────────────────────────────────────────────────────────────────────────────
# [4/8] 얕은 복제 · fetch
# ─────────────────────────────────────────────────────────────────────────────
git_run rev-parse --is-shallow-repository
if [ "$GIT_CODE" -ne 0 ] || [ "$GIT_OUT" = "true" ]; then
    finish "[4/8] 얕은 복제(shallow clone)라 공통 조상을 판정할 수 없다($GIT_OUT). 재기준하지 않는다. 수동: git fetch --unshallow origin 뒤 다시 실행" 11 ERROR
fi
git_run fetch origin "$BRANCH"
[ "$GIT_CODE" -eq 0 ] || finish "[4/8] 원격 fetch 실패(네트워크·인증·GitHub 상태 확인): $GIT_OUT" 5 ERROR
git_run rev-parse HEAD; LOCAL_SHA="$GIT_OUT"
git_run rev-parse "origin/$BRANCH"; REMOTE_SHA="$GIT_OUT"
git_run merge-base HEAD "origin/$BRANCH"; BASE_SHA="$GIT_OUT"; BASE_CODE="$GIT_CODE"
git_run rev-list --count "origin/$BRANCH..HEAD"; AHEAD_N="$GIT_OUT"
git_run rev-list --count "HEAD..origin/$BRANCH"; BEHIND_N="$GIT_OUT"
log "[4/8] fetch OK · 로컬 $LOCAL_SHA · 원격 $REMOTE_SHA · 로컬에만 있는 커밋 $AHEAD_N · 원격에만 있는 커밋 $BEHIND_N"

# ─────────────────────────────────────────────────────────────────────────────
# [5/8] 분류
# ─────────────────────────────────────────────────────────────────────────────
if [ "$LOCAL_SHA" = "$REMOTE_SHA" ]; then
    STATE="SAME"
elif [ "$BASE_CODE" -eq 0 ] && [ "$LOCAL_SHA" = "$BASE_SHA" ]; then
    STATE="BEHIND"
elif [ "$BASE_CODE" -eq 0 ] && [ "$REMOTE_SHA" = "$BASE_SHA" ]; then
    STATE="AHEAD"
elif [ "$BASE_CODE" -eq 1 ] || { [ "$BASE_CODE" -eq 0 ] && [ -z "$BASE_SHA" ]; }; then
    STATE="NO_COMMON_ANCESTOR"
elif [ "$BASE_CODE" -ne 0 ]; then
    STATE="QUERY_FAILED"
else
    STATE="DIVERGED"
fi
log "[5/8] 상태 분류: $STATE"
case "$STATE" in
    SAME)   finish "[5/8] 이미 최신(로컬 = 원격). 복구할 것이 없다" 0 ;;
    BEHIND) finish "[5/8] 로컬이 뒤처짐(fast-forward 가능, 원격에만 있는 커밋 $BEHIND_N). 다음 사이클이 스스로 반영한다. 복구 도구가 할 일 없음" 0 ;;
    AHEAD)  finish "[5/8] 로컬에 아직 push 되지 않은 커밋 $AHEAD_N개(공통 조상 있음). 다음 사이클이 push 한다. 복구 도구가 할 일 없음" 0 ;;
    DIVERGED) finish "[5/8] 로컬/원격이 갈라졌지만 공통 조상이 있다. 사이클이 rebase 로 처리한다(충돌이면 사이클 로그 exit 6 → 수동). 복구 도구가 할 일 없음" 0 ;;
    QUERY_FAILED) finish "[5/8] merge-base 조회 실패(exit $BASE_CODE): $BASE_SHA — 재작성인지 알 수 없어 아무것도 하지 않는다" 11 ERROR ;;
esac

# ─────────────────────────────────────────────────────────────────────────────
# [6/8] 공통 조상 없음 = 원격 이력 재작성. 로컬 장부 포함성을 내용으로 판정한다.
# ─────────────────────────────────────────────────────────────────────────────
INCLUSION_MODULE=""
if [ -f "$SCRIPT_DIR/../paper_ledger_inclusion.py" ]; then INCLUSION_MODULE="$SCRIPT_DIR/../paper_ledger_inclusion.py"
elif [ -f "$REPO_PATH/paper_ledger_inclusion.py" ]; then INCLUSION_MODULE="$REPO_PATH/paper_ledger_inclusion.py"
else
    INCLUSION_MODULE_TMP="$(mktemp "${TMPDIR:-/tmp}/gaeo-paper-inclusion-XXXXXX")" || finish '[6/8] 임시 파일을 만들 수 없다' 7 ERROR
    if git show "origin/$BRANCH:paper_ledger_inclusion.py" > "$INCLUSION_MODULE_TMP" 2>/dev/null && [ -s "$INCLUSION_MODULE_TMP" ]; then
        INCLUSION_MODULE="$INCLUSION_MODULE_TMP"
    else
        finish "[6/8] 포함성 모듈(paper_ledger_inclusion.py)을 스크립트 폴더·작업트리·origin/$BRANCH 어디서도 찾지 못했다" 7 ERROR
    fi
fi
WT_FLAG=()
[ "$MODE" = "check" ] && [ "${#DIRTY[@]}" -gt 0 ] && WT_FLAG=(--worktree)
INCLUSION_REPORT="$("$PY" "$INCLUSION_MODULE" check --repo "$REPO_PATH" --local HEAD --remote "origin/$BRANCH" ${WT_FLAG[@]+"${WT_FLAG[@]}"} 2>&1)"
INCLUSION_CODE=$?
# 판정 헤더가 없는 출력은 모듈 자체의 오류(traceback 등)다 — exit 1 이라도 NOT_COVERED 로 표기하지 않는다.
case "$INCLUSION_REPORT" in *"[장부 포함성]"*) ;; *) [ "$INCLUSION_CODE" -eq 0 ] || INCLUSION_CODE=2 ;; esac
case "$INCLUSION_CODE" in 0) VERDICT="COVERED" ;; 1) VERDICT="NOT_COVERED" ;; *) VERDICT="UNDETERMINED" ;; esac
log "[6/8] 원격 이력 재작성(공통 조상 없음) · 장부 포함성 판정: $VERDICT"
while IFS= read -r line; do [ -n "${line//[[:space:]]/}" ] && log "    $line"; done <<< "$INCLUSION_REPORT"

# ─────────────────────────────────────────────────────────────────────────────
# [7/8] 계획(check) 또는 실행(apply)
# ─────────────────────────────────────────────────────────────────────────────
if [ "$VERDICT" != "COVERED" ]; then
    if [ "$MODE" = "apply" ]; then
        label="unsent-$(kst_date '+%Y%m%dT%H%M%S')"
        out="$("$PY" "$INCLUSION_MODULE" backup --repo "$REPO_PATH" --dest "$BACKUP_DIR" --label "$label" --not-ref "origin/$BRANCH" --json 2>&1)"
        if [ $? -eq 0 ]; then
            unsent_dir="$(printf '%s' "$out" | sed -n 's/^ *"dir": *"\(.*\)",\{0,1\}$/\1/p' | head -1)"
            "$PY" "$INCLUSION_MODULE" check --repo "$REPO_PATH" --local HEAD --remote "origin/$BRANCH" --json > "$unsent_dir/inclusion.json" 2>/dev/null || true
            log "[7/8] 미전송 기록을 별도 보존했다(활성 장부는 그대로): $unsent_dir (판정 파일 inclusion.json)" WARN
        else
            log "[7/8] 미전송 기록 별도 보존 실패: $out — 활성 장부는 그대로다" ERROR
        fi
    fi
    finish "[7/8] 로컬 장부가 원격에 전부 들어 있음을 증명하지 못했다(판정 $VERDICT). 재기준하지 않는다. 위 판정 줄의 파일·거래 ID 를 사람이 확인해야 한다(docs/PAPER_TRADING_LOCAL_RUNNER.md 9절)" 11 ERROR
fi

if [ "$MODE" = "check" ]; then
    log "[7/8] 계획(apply 모드에서 할 일): ① 백업 $BACKUP_DIR/prerepoint-<시각>/ (paper_trading 복사 + 옛 HEAD bundle + manifest, 검증) → ② 옛 HEAD $LOCAL_SHA 를 refs/gaeo-backup/head-<시각> 에 보존 → ③ git checkout -B $BRANCH origin/$BRANCH ($REMOTE_SHA) → ④ 검증(HEAD=원격·작업트리 깨끗)"
    [ "${#DIRTY[@]}" -gt 0 ] && log "[7/8] (먼저 미커밋 Paper 산출물 ${#DIRTY[@]}개를 복구 커밋으로 보존한 뒤 위 순서)" WARN
    finish "[7/8] 재기준 가능 — 로컬 장부가 원격에 전부 포함됨이 내용으로 증명됐다. 실행: bash scripts/paper_recover.sh --repo $REPO_PATH --mode apply" 10
fi

# apply
out="$("$PY" "$INCLUSION_MODULE" backup --repo "$REPO_PATH" --dest "$BACKUP_DIR" --label "prerepoint-$(kst_date '+%Y%m%dT%H%M%S')" --not-ref "origin/$BRANCH" --json 2>&1)"
[ $? -eq 0 ] || finish "[7/8] 재기준 전 백업 실패(백업 폴더 $BACKUP_DIR): $out — 재기준하지 않았다" 6 ERROR
BACKUP_TARGET="$(printf '%s' "$out" | sed -n 's/^ *"dir": *"\(.*\)",\{0,1\}$/\1/p' | head -1)"
"$PY" "$INCLUSION_MODULE" verify-backup --dir "$BACKUP_TARGET" >/dev/null 2>&1 || finish "[7/8] 백업 재검증 실패: $BACKUP_TARGET — 재기준하지 않았다" 6 ERROR
log "[7/8] 백업 완료·검증 통과: $BACKUP_TARGET"
backup_ref="refs/gaeo-backup/head-$(kst_date '+%Y%m%dT%H%M%S')"
git_run update-ref "$backup_ref" HEAD
[ "$GIT_CODE" -eq 0 ] || finish "[7/8] 옛 HEAD 보존(update-ref) 실패: $GIT_OUT — 재기준하지 않았다" 6 ERROR
git_run checkout -B "$BRANCH" "origin/$BRANCH"
[ "$GIT_CODE" -eq 0 ] || finish "[7/8] 재기준(checkout -B) 실패: $GIT_OUT (옛 HEAD 는 $backup_ref 와 $BACKUP_TARGET 에 있다)" 6 ERROR
git_run rev-parse HEAD; HEAD_NEW="$GIT_OUT"
git_run status --porcelain; STATUS_AFTER="$GIT_OUT"
[ "$HEAD_NEW" = "$REMOTE_SHA" ] || finish "[7/8] 재기준 뒤 HEAD($HEAD_NEW)가 원격($REMOTE_SHA)과 다르다. 수동 확인" 6 ERROR
[ -z "${STATUS_AFTER//[[:space:]]/}" ] || finish "[7/8] 재기준 뒤 작업트리가 깨끗하지 않다: $STATUS_AFTER. 수동 확인" 6 ERROR
log "[7/8] 재기준 완료: HEAD $LOCAL_SHA → $HEAD_NEW (옛 HEAD 보존 $backup_ref · 백업 $BACKUP_TARGET · 복구 커밋 $RECOVERED)"

# ─────────────────────────────────────────────────────────────────────────────
# [8/8] 결과 보고 (계좌별) · 선택: 사이클 1회 기동
# ─────────────────────────────────────────────────────────────────────────────
log "[8/8] 재기준 뒤 장부(계좌별):"
while IFS= read -r line; do [ -n "${line//[[:space:]]/}" ] && log "  $line"; done <<< "$("$PY" "$INCLUSION_MODULE" summary --repo "$REPO_PATH" 2>&1)"
if [ "$RUN_CYCLE" = "1" ]; then
    release_lock
    if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files "$SERVICE.service" >/dev/null 2>&1; then
        if systemctl start "$SERVICE" 2>&1; then log "[8/8] 사이클 1회 기동 요청: systemctl start $SERVICE → 로그 $LOG_DIR/paper-$(kst_date '+%Y-%m-%d').log 확인"
        else log "[8/8] systemctl start $SERVICE 실패 — 수동으로 기동" WARN; fi
    else
        log "[8/8] systemd 서비스($SERVICE)가 없어 사이클을 자동 기동하지 않았다. 수동: bash scripts/paper_cycle.sh --repo $REPO_PATH" WARN
    fi
fi
finish "[8/8] 복구 완료(러너 저장소 재기준). 실제 매매 기록은 다음 정상 사이클이 만든다 — 과거 날짜 거래를 만들어 넣지 않는다" 0
