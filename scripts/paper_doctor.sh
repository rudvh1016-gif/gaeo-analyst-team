#!/usr/bin/env bash
#
#  GAEO Paper Doctor (Linux) : 모의투자 러너가 왜 안 도는지 진단한다.
#
#  쓰는 법:
#      bash scripts/paper_doctor.sh
#      bash scripts/paper_doctor.sh --repo /opt/gaeo-paper/repo --env-file /etc/gaeo-paper/paper.env
#
#  이 스크립트는 읽기 전용이다. 아무것도 고치지 않고 무엇이 잘못됐는지만 알려준다.
#  ⚠️ Secret 값은 어디에도 출력하지 않는다. "있음/없음"과 파일 권한만 본다.
#     (scripts/paper_doctor.ps1의 원칙을 그대로 옮긴 것)

set -uo pipefail

REPO_PATH="${GAEO_PAPER_REPO:-/opt/gaeo-paper/repo}"
ENV_FILE="${GAEO_PAPER_ENV_FILE:-/etc/gaeo-paper/paper.env}"
SERVICE="${GAEO_PAPER_SERVICE:-gaeo-paper}"
# 로그 위치: 서비스가 쓰는 곳(/opt/gaeo-paper/logs)을 먼저 본다.
# ⚠️ 이 기본값이 왜 두 갈래인가 (2026-08-27 감사)
#    운영 VM에서는 systemd가 GAEO_PAPER_LOG_DIR=/opt/gaeo-paper/logs 를 넣어주지만,
#    사람이 문서 안내대로 `sudo bash scripts/paper_doctor.sh` 로 직접 돌리면 그 값이
#    안 넘어온다. 그때 $HOME 아래만 보면 로그가 멀쩡히 있는데도 [9]번이 늘
#    "로그 파일이 없습니다"로 나와 진단 정보 하나가 통째로 빈다.
#    그래서 서비스 경로가 실제로 있으면 그쪽을 쓰고, 없으면 개발용 기본값으로 돌아간다.
_default_log_dir() {
    if [ -d /opt/gaeo-paper/logs ]; then
        printf '%s' /opt/gaeo-paper/logs
    else
        printf '%s' "$HOME/.local/state/gaeo-paper/logs"
    fi
}
LOG_DIR="${GAEO_PAPER_LOG_DIR:-$(_default_log_dir)}"
MARKER_NAME=".gaeo-paper-runner"
CHECK_REMOTE=1

usage() {
    cat <<'USAGE'
GAEO Paper Doctor (Linux) : 읽기 전용 진단

  --repo PATH        러너 저장소 (기본 /opt/gaeo-paper/repo)
  --env-file PATH    자격증명 EnvironmentFile (기본 /etc/gaeo-paper/paper.env)
  --service NAME     systemd 유닛 이름 (기본 gaeo-paper)
  --log-dir PATH     로그 디렉터리 (기본 ~/.local/state/gaeo-paper/logs)
  --no-remote        원격(GitHub) 읽기 시험을 건너뛴다
  -h, --help         이 도움말
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --repo)     REPO_PATH="${2:-}"; shift 2 ;;
        --env-file) ENV_FILE="${2:-}"; shift 2 ;;
        --service)  SERVICE="${2:-}"; shift 2 ;;
        --log-dir)  LOG_DIR="${2:-}"; shift 2 ;;
        --no-remote) CHECK_REMOTE=0; shift ;;
        -h|--help)  usage; exit 0 ;;
        *) echo "알 수 없는 인자: $1" >&2; usage; exit 2 ;;
    esac
done

PROBLEMS=()
say()  { printf '%s\n' "$1"; }
ok()   { printf '[O] %s\n' "$1"; }
bad()  { printf '[X] %s\n' "$1"; PROBLEMS+=("$1"$'\n'"    고치는 법: $2"); }
warn() { printf '[!] %s\n' "$1"; }
info() { printf '    %s\n' "$1"; }

say ''
say '===== GAEO 모의투자 러너 진단 (Linux) ====='
say ''

# 1) 기본 도구 ─────────────────────────────────────────────────────────────────
say '[1] 기본 도구'
PY=""
for c in python3 python; do command -v "$c" >/dev/null 2>&1 && { PY="$c"; break; }; done
if [ -n "$PY" ]; then
    ok "파이썬 있음: $($PY --version 2>&1)"
else
    bad "파이썬이 없습니다(python3·python 모두)." "파이썬을 설치하세요: sudo dnf install -y python3 (또는 apt install python3)"
fi
if command -v git >/dev/null 2>&1; then
    ok "git 있음: $(git --version)"
else
    bad "git이 없습니다." "git을 설치하세요: sudo dnf install -y git (또는 apt install git)"
fi

# 2) 러너 저장소 ───────────────────────────────────────────────────────────────
say ''
say '[2] 러너 저장소'
REPO_OK=0
if [ -d "$REPO_PATH" ]; then
    ok "저장소 있음: $REPO_PATH"
    RUNNER_ROOT="$(cd "$REPO_PATH/.." 2>/dev/null && pwd)"
    if [ -e "$RUNNER_ROOT/$MARKER_NAME" ]; then
        ok "러너 마커 있음: $RUNNER_ROOT/$MARKER_NAME"
    else
        bad "러너 마커($MARKER_NAME)가 없습니다. 사이클이 실행을 거부합니다." \
            "러너 루트에 마커를 만드세요: touch $RUNNER_ROOT/$MARKER_NAME"
    fi
    if git -C "$REPO_PATH" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        REPO_OK=1
        BR="$(git -C "$REPO_PATH" symbolic-ref --short -q HEAD || echo '(detached)')"
        if [ "$BR" = "main" ]; then ok "브랜치: main"
        else bad "브랜치가 main이 아닙니다: $BR" "러너 저장소에서 main을 체크아웃하세요: git -C $REPO_PATH checkout main"; fi
        info "HEAD: $(git -C "$REPO_PATH" rev-parse --short HEAD 2>/dev/null)"
        DIRTY="$(git -C "$REPO_PATH" status --porcelain 2>/dev/null | wc -l)"
        FOREIGN="$(git -C "$REPO_PATH" status --porcelain 2>/dev/null \
                   | cut -c4- | grep -v -E '^(paper_trading/|paper_public\.js$)' | wc -l)"
        if [ "$FOREIGN" -gt 0 ]; then
            bad "Paper 산출물이 아닌 변경이 ${FOREIGN}건 있습니다. 사이클이 안전을 위해 중단합니다." \
                "무엇이 바뀌었는지 보고 사람이 직접 정리하세요: git -C $REPO_PATH status"
        else
            ok "작업트리 상태 정상(변경 ${DIRTY}건, 전부 Paper 산출물)"
        fi
        # 커밋 신원 : 없으면 커밋 단계에서 실패한다.
        GN="$(git -C "$REPO_PATH" config user.name || true)"
        GE="$(git -C "$REPO_PATH" config user.email || true)"
        if [ -n "$GN" ] && [ -n "$GE" ]; then ok "git 커밋 신원 설정됨"
        else bad "git user.name/user.email이 설정되지 않았습니다." \
                 "러너 사용자로 설정하세요: git -C $REPO_PATH config user.name '...' && git -C $REPO_PATH config user.email '...'"; fi
        # 원격 주소는 호스트까지만 보여준다(토큰이 URL에 박혀 있어도 새지 않게).
        URL="$(git -C "$REPO_PATH" remote get-url origin 2>/dev/null || echo '')"
        case "$URL" in
            *@*:*)   info "origin: ssh 방식 (호스트 ${URL##*@}) " ;;
            https://*) info "origin: https 방식 (호스트 $(printf '%s' "$URL" | cut -d/ -f3 | sed 's/.*@//'))" ;;
            "")      bad "origin 원격이 없습니다." "clone을 다시 하거나 git remote add origin ...을 하세요" ;;
            *)       info "origin: 로컬 경로 또는 기타 형식(운영 VM에서는 ssh 배포키 방식을 씁니다)" ;;
        esac
        if [ "$CHECK_REMOTE" = "1" ] && [ -n "$URL" ]; then
            if timeout 25 git -C "$REPO_PATH" ls-remote --heads origin main >/dev/null 2>&1; then
                ok "원격 읽기 성공(GitHub 접속·인증 OK)"
            else
                bad "원격(GitHub)에서 읽지 못했습니다." \
                    "네트워크·방화벽·인증(배포키)을 확인하세요: git -C $REPO_PATH ls-remote --heads origin"
            fi
        fi
    else
        bad "git 저장소가 아닙니다: $REPO_PATH" "러너 저장소를 다시 clone 하세요"
    fi
else
    bad "러너 저장소가 없습니다: $REPO_PATH" \
        "docs/PAPER_TRADING_ORACLE_RUNNER.md의 설치 절차대로 clone 하세요"
fi

# 3) 자격증명 (있음/없음만) ────────────────────────────────────────────────────
say ''
say '[3] 토스 자격증명 (값은 출력하지 않습니다)'
for v in TOSS_INVEST_CLIENT_ID TOSS_INVEST_CLIENT_SECRET; do
    if [ -n "${!v:-}" ]; then ok "$v: 현재 셸에 있음"; else info "$v: 현재 셸에는 없음(서비스 환경에는 있을 수 있습니다)"; fi
done
if [ -f "$ENV_FILE" ]; then
    ok "자격증명 파일 있음: $ENV_FILE"
    PERM="$(stat -c '%a' "$ENV_FILE" 2>/dev/null || echo '?')"
    OWNER="$(stat -c '%U:%G' "$ENV_FILE" 2>/dev/null || echo '?')"
    info "권한 $PERM · 소유 $OWNER"
    case "$PERM" in
        600|400) ok "권한 정상(주인만 읽기)" ;;
        *) bad "자격증명 파일 권한이 $PERM 입니다. 다른 사용자도 읽을 수 있습니다." \
               "sudo chmod 600 $ENV_FILE 로 좁히세요" ;;
    esac
    for key in TOSS_INVEST_CLIENT_ID TOSS_INVEST_CLIENT_SECRET; do
        # ⚠️ 값은 절대 읽지 않는다. 키 이름이 있는지만 본다.
        if grep -qE "^[[:space:]]*${key}=" "$ENV_FILE" 2>/dev/null; then
            ok "$key 항목 있음"
        else
            bad "$key 항목이 자격증명 파일에 없습니다." \
                "$ENV_FILE 에 ${key}=... 한 줄을 추가하세요(값은 토스 개발자센터에서만 복사)"
        fi
    done
else
    warn "자격증명 파일이 없습니다: $ENV_FILE"
    if [ -z "${TOSS_INVEST_CLIENT_ID:-}" ]; then
        PROBLEMS+=("토스 자격증명이 없습니다(파일도 환경변수도 없음)."$'\n'"    고치는 법: $ENV_FILE 을 만들고 권한을 600으로 두세요. 값은 토스 개발자센터에서 이 VM으로만 옮기고, 저장소·채팅에는 절대 붙여넣지 않습니다")
    fi
fi

# 4) Single Writer 상태 ────────────────────────────────────────────────────────
say ''
say '[4] Single Writer (원장을 쓰는 러너는 언제나 한 곳뿐)'
DECL="${GAEO_PAPER_RUNNER:-}"
if [ -n "$DECL" ]; then info "이 셸의 선언(GAEO_PAPER_RUNNER): $DECL"
else info "이 셸의 선언(GAEO_PAPER_RUNNER): 없음 (사이클 스크립트는 실행 시 ORACLE로 선언합니다)"; fi
if [ "$REPO_OK" = "1" ] && [ -f "$REPO_PATH/paper_runner_config.json" ] && [ -n "$PY" ]; then
    ACTIVE="$("$PY" -c "import json,sys; print(json.load(open(sys.argv[1],encoding='utf-8')).get('activeRunner',''))" \
              "$REPO_PATH/paper_runner_config.json" 2>/dev/null || echo '')"
    if [ -n "$ACTIVE" ]; then
        ok "설정상 활성 러너: $ACTIVE"
        EFFECTIVE="${DECL:-ORACLE}"
        if [ "$EFFECTIVE" = "$ACTIVE" ]; then
            ok "이 VM이 활성 러너입니다(기록을 남깁니다)"
        else
            warn "이 VM은 비활성입니다(선언 $EFFECTIVE · 활성 $ACTIVE). 매매 계산·기록·push를 하지 않습니다."
            info "정상입니다. 전환하려면 저장소의 paper_runner_config.json 을 사람이 고쳐 커밋하세요."
        fi
    else
        bad "paper_runner_config.json 에서 activeRunner를 읽지 못했습니다." \
            "파일 형식을 확인하세요(러너는 이 파일을 커밋하지 않습니다)"
    fi
else
    warn "활성 러너 설정을 확인하지 못했습니다(저장소·파이썬 확인 필요)."
fi

# 5) 시각 ──────────────────────────────────────────────────────────────────────
say ''
say '[5] 시각 (예약 실행은 KST 기준입니다)'
SYSTZ="$(timedatectl show -p Timezone --value 2>/dev/null || cat /etc/timezone 2>/dev/null || echo '?')"
info "시스템 시간대: $SYSTZ"
info "UTC:  $(date -u '+%Y-%m-%d %H:%M')"
info "KST:  $(TZ=Asia/Seoul date '+%Y-%m-%d %H:%M (%a)')"
if [ "$SYSTZ" = "Asia/Seoul" ]; then
    ok "시간대가 Asia/Seoul 입니다(systemd timer의 OnCalendar가 KST로 해석됩니다)"
else
    bad "시스템 시간대가 Asia/Seoul이 아닙니다: $SYSTZ" \
        "sudo timedatectl set-timezone Asia/Seoul 로 맞추세요. 안 맞추면 timer가 UTC로 해석돼 엉뚱한 시각에 깨어납니다"
fi
DOW="$(TZ=Asia/Seoul date '+%u')"; HM="$((10#$(TZ=Asia/Seoul date '+%H%M')))"
if [ "$DOW" -le 5 ] && [ "$HM" -ge 855 ] && [ "$HM" -le 1535 ]; then
    ok "지금은 실행 시간대(평일 KST 08:55~15:35) 안입니다"
else
    info "지금은 실행 시간대 밖입니다. 이 시간에 사이클이 안 도는 것은 정상입니다."
fi

# 6) systemd ───────────────────────────────────────────────────────────────────
say ''
say '[6] 예약 실행(systemd)'
if command -v systemctl >/dev/null 2>&1; then
    if systemctl list-unit-files "${SERVICE}.timer" 2>/dev/null | grep -q "${SERVICE}.timer"; then
        ok "타이머 유닛 있음: ${SERVICE}.timer"
        info "enabled: $(systemctl is-enabled "${SERVICE}.timer" 2>&1)"
        info "active : $(systemctl is-active "${SERVICE}.timer" 2>&1)"
        if [ "$(systemctl is-active "${SERVICE}.timer" 2>/dev/null)" != "active" ]; then
            bad "타이머가 켜져 있지 않습니다." \
                "sudo systemctl enable --now ${SERVICE}.timer 로 켜세요"
        fi
        systemctl list-timers "${SERVICE}*" --all --no-pager 2>/dev/null | sed -n '1,3p' | while IFS= read -r l; do info "$l"; done
        info "마지막 실행 결과: $(systemctl show -p Result --value "${SERVICE}.service" 2>/dev/null || echo '?')"
    else
        bad "타이머 유닛이 설치돼 있지 않습니다: ${SERVICE}.timer" \
            "docs/PAPER_TRADING_ORACLE_RUNNER.md의 설치 절차(systemd 유닛 복사)를 따르세요"
    fi
else
    warn "systemctl이 없습니다(컨테이너·최소 이미지일 수 있습니다)."
fi

# 7) 디스크 ────────────────────────────────────────────────────────────────────
say ''
say '[7] 디스크'
TARGET="$REPO_PATH"; [ -d "$TARGET" ] || TARGET="$HOME"
DF_LINE="$(df -Pk "$TARGET" 2>/dev/null | tail -1)"
if [ -n "$DF_LINE" ]; then
    AVAIL_KB="$(printf '%s' "$DF_LINE" | awk '{print $4}')"
    info "$(df -Ph "$TARGET" 2>/dev/null | tail -1)"
    if [ "${AVAIL_KB:-0}" -lt 1048576 ]; then
        bad "남은 디스크가 1GB 미만입니다." "로그·git 개체를 정리하거나 볼륨을 늘리세요"
    else
        ok "디스크 여유 충분"
    fi
fi

# 8) 마지막 사이클 결과 ────────────────────────────────────────────────────────
say ''
say '[8] 마지막 사이클'
STATE="$REPO_PATH/paper_trading/state.json"
if [ -f "$STATE" ] && [ -n "$PY" ]; then
    "$PY" - "$STATE" <<'PY' || warn "state.json을 읽지 못했습니다."
import json, sys
d = json.load(open(sys.argv[1], encoding="utf-8"))
at = d.get("lastCycleAt") or "(없음)"
res = str(d.get("lastCycleResult") or "(없음)")
print(f"    마지막 시도: {at}")
print(f"    마지막 결과: {res[:120]}")
print("[O] 마지막 사이클은 성공했습니다." if res.startswith("CYCLE_OK")
      else "[!] 마지막 사이클이 CYCLE_OK가 아닙니다(휴장·비활성이면 정상일 수 있습니다).")
PY
else
    warn "state.json이 없습니다(아직 한 번도 안 돌았거나 저장소 경로가 다릅니다)."
fi

# 9) 최근 로그 ─────────────────────────────────────────────────────────────────
say ''
say '[9] 최근 로그'
LATEST="$(ls -1t "$LOG_DIR"/paper-*.log 2>/dev/null | head -1 || true)"
if [ -n "$LATEST" ]; then
    info "파일: $LATEST"
    # 로그 자체가 이미 마스킹된 상태지만, 한 번 더 걸러서 보여준다.
    grep -E 'ERROR|WARN|실패|TOSS_MARKET_DATA_UNAVAILABLE|single-writer|최종 exit code' "$LATEST" 2>/dev/null \
        | tail -8 \
        | sed -E 's/([Bb]earer|[Aa]uthorization|[Aa]ccess_token|[Cc]lient_secret)[[:space:]]*[:=][[:space:]]*[^[:space:]]+/\1: ***REDACTED***/g' \
        | while IFS= read -r l; do info "$l"; done
else
    warn "로그 파일이 없습니다: $LOG_DIR"
fi

# 10) 결론 ─────────────────────────────────────────────────────────────────────
say ''
say '===== 진단 결과 ====='
if [ "${#PROBLEMS[@]}" -eq 0 ]; then
    say '문제를 찾지 못했습니다. 러너 설정은 정상으로 보입니다.'
    say '그래도 기록이 안 쌓이면 토스 개발자센터의 허용 IP가 이 VM의 공인 IP와 같은지 확인하세요.'
    exit 0
fi
say "고쳐야 할 것 ${#PROBLEMS[@]}건:"
i=1
for p in "${PROBLEMS[@]}"; do
    say ''
    say "[$i] $p"
    i=$((i + 1))
done
say ''
say '위 항목을 고친 뒤 한 사이클을 손으로 돌려 보고(sudo systemctl start '"${SERVICE}"'.service)'
say '이 스크립트를 다시 실행하세요.'
exit 1
