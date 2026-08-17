<#
  GAEO Paper Trading — 로컬 Windows 러너 사이클 (가상매매 전용)

  이 스크립트는 "전용 러너 저장소" 안에서만 돈다. 개발용 저장소(Desktop)에서는
  절대 실행되지 않는다 — 러너 루트 마커(.gaeo-paper-runner)가 없으면 즉시 중단한다.

  ⚠️ 안전 원칙 (paper-trading.yml의 철학을 그대로 로컬로 옮긴 것)
    · 실주문·계좌·보유종목 API 호출 0 — Toss 시세(Market Data)만 쓴다.
      (경로 화이트리스트는 paper_market_data.py의 ALLOWED_PATHS가 강제한다)
    · Secret은 이 파일에 없다. 부트스트랩이 환경변수로만 넘겨준다.
      로그에도 절대 남기지 않는다(Protect-Log가 값 자체를 마스킹).
    · SILENT DATA LOSS 금지 — Paper 기록이 remote에 저장되지 않았는데
      성공(exit 0)으로 끝나는 경로는 존재하면 안 된다.
    · 자동 충돌 해결 금지 · force push 금지 · reset --hard 금지.
    · 상태가 예상과 다르면 "최신화보다 데이터 보존" — 엔진을 돌리지 않고 멈춘다.

  Secret 없음 / 개인 경로 하드코딩 없음 — 공개 저장소에 있어도 안전한 스크립트.
#>

[CmdletBinding()]
param(
    # 러너 전용 저장소 경로 (부트스트랩이 넘겨준다)
    [Parameter(Mandatory = $true)]
    [string]$RepoPath,

    # 로그 디렉터리
    [string]$LogDir = (Join-Path $env:LOCALAPPDATA 'GAEO\logs'),

    # 대상 브랜치
    [string]$Branch = 'main',

    # 로그 보존 일수
    [int]$LogRetentionDays = 30
)

# 네이티브 명령의 stderr가 예외로 승격되지 않게 한다(PS 5.1 NativeCommandError 회피)
$ErrorActionPreference = 'Continue'

$WHITELIST_DIR  = 'paper_trading'
$WHITELIST_FILE = 'paper_public.js'
$MARKER_NAME    = '.gaeo-paper-runner'

# ─────────────────────────────────────────────────────────────────────────────
# 시간 · 로그
# ─────────────────────────────────────────────────────────────────────────────
function Get-KstNow {
    try {
        $tz = [System.TimeZoneInfo]::FindSystemTimeZoneById('Korea Standard Time')
        return [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $tz)
    }
    catch {
        return (Get-Date)   # 타임존 ID를 못 찾는 환경이면 로컬 시각으로 대체
    }
}

# 로그에 Secret이 흘러들어가는 것을 값 단위로 차단한다.
function Protect-Log {
    param([string]$Text)
    if ([string]::IsNullOrEmpty($Text)) { return $Text }
    foreach ($name in @('TOSS_INVEST_CLIENT_ID', 'TOSS_INVEST_CLIENT_SECRET')) {
        $v = [Environment]::GetEnvironmentVariable($name)
        if (-not [string]::IsNullOrWhiteSpace($v) -and $v.Length -ge 4) {
            $Text = $Text.Replace($v, '***REDACTED***')
        }
    }
    # 혹시 모를 Authorization 헤더·토큰 문자열도 통째로 마스킹
    $Text = [Regex]::Replace($Text, '(?i)(bearer|authorization|access_token|client_secret)\s*[:=]\s*\S+', '$1: ***REDACTED***')
    return $Text
}

$script:LogFile = $null
$script:Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $stamp = (Get-KstNow).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "[$stamp KST] [$Level] " + (Protect-Log $Message)
    Write-Host $line
    if ($script:LogFile) {
        try { [System.IO.File]::AppendAllText($script:LogFile, $line + "`r`n", $script:Utf8NoBom) } catch { }
    }
}

function Initialize-Log {
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    $script:LogFile = Join-Path $LogDir ("paper-" + (Get-KstNow).ToString('yyyy-MM-dd') + ".log")
    # 보존 정책 — 오래된 로그 삭제(디스크·비용 $0 유지)
    try {
        $cutoff = (Get-Date).AddDays(-$LogRetentionDays)
        Get-ChildItem -Path $LogDir -Filter 'paper-*.log' -File -ErrorAction SilentlyContinue |
            Where-Object { $_.LastWriteTime -lt $cutoff } |
            Remove-Item -Force -ErrorAction SilentlyContinue
    }
    catch { }
}

# ─────────────────────────────────────────────────────────────────────────────
# git 헬퍼 — 성공 판정은 항상 $LASTEXITCODE로 한다($?는 PS 5.1에서 신뢰 불가)
# ─────────────────────────────────────────────────────────────────────────────
function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    $raw = & git @GitArgs 2>&1
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
    # ⚠️ TrimEnd만 쓴다. Trim()을 쓰면 `git status --porcelain`의 선행 공백(" M path")이
    # 사라져 경로가 한 글자씩 밀리고, 정상 Paper 파일이 위반으로 오판된다.
    return [pscustomobject]@{ Code = $code; Output = $text.TrimEnd() }
}

function Test-GitOk {
    param($Result, [string]$What)
    if ($Result.Code -ne 0) {
        Write-Log "$What 실패 (exit $($Result.Code)) — $($Result.Output)" 'ERROR'
        return $false
    }
    return $true
}

$script:ExitCode = 0
function Stop-Cycle {
    param([string]$Reason, [int]$Code, [string]$Level = 'ERROR')
    Write-Log $Reason $Level
    Write-Log "최종 exit code: $Code"
    exit $Code
}

# ─────────────────────────────────────────────────────────────────────────────
# 0. 준비 · 안전 가드
# ─────────────────────────────────────────────────────────────────────────────
Initialize-Log
Write-Log '===== GAEO Paper Trading 사이클 시작 ====='

if (-not (Test-Path $RepoPath)) {
    Stop-Cycle "러너 저장소를 찾을 수 없다: $RepoPath" 2
}

# ⚠️ 개발용 저장소 오작동 방지 — 러너 루트에만 있는 마커를 확인한다.
$runnerRoot = Split-Path -Path $RepoPath -Parent
$marker = Join-Path $runnerRoot $MARKER_NAME
if (-not (Test-Path $marker)) {
    Stop-Cycle "러너 마커($MARKER_NAME)가 없다 — 개발용 저장소일 수 있어 실행을 거부한다: $RepoPath" 2
}

Set-Location -Path $RepoPath

$inside = Invoke-Git rev-parse --is-inside-work-tree
if ($inside.Code -ne 0 -or $inside.Output -ne 'true') {
    Stop-Cycle "git 저장소가 아니다: $RepoPath" 2
}

# 분리된 HEAD·다른 브랜치에서는 절대 자동 실행하지 않는다.
$cur = Invoke-Git symbolic-ref --short -q HEAD
if ($cur.Code -ne 0 -or $cur.Output -ne $Branch) {
    Stop-Cycle "현재 브랜치가 '$Branch'가 아니다(detached이거나 다른 브랜치): '$($cur.Output)' — 자동 실행 중단" 3
}

$headBefore = (Invoke-Git rev-parse HEAD).Output
Write-Log "러너 HEAD(시작): $headBefore"

# ─────────────────────────────────────────────────────────────────────────────
# 1. 작업트리 점검 — Paper 산출물 이외의 변경이 있으면 손대지 않고 중단
# ─────────────────────────────────────────────────────────────────────────────
function Test-Whitelisted {
    param([string]$Path)
    # 경로 추출 후 남을 수 있는 CR·따옴표 제거(여기서의 Trim은 경로 자체에만 적용된다)
    $p = $Path.Replace('\', '/').Trim().Trim('"')
    if ($p -eq $WHITELIST_FILE) { return $true }
    if ($p.StartsWith($WHITELIST_DIR + '/')) { return $true }
    return $false
}

$statusRes = Invoke-Git status --porcelain
if (-not (Test-GitOk $statusRes 'git status')) { Stop-Cycle 'git status 실패 — 중단' 3 }

$dirty = @()
if ($statusRes.Output) {
    foreach ($line in ($statusRes.Output -split "`n")) {
        $l = $line.TrimEnd("`r")
        if ([string]::IsNullOrWhiteSpace($l)) { continue }
        # porcelain v1 형식: XY<공백><경로>  (X,Y는 각각 1글자 상태코드)
        if ($l.Length -lt 4) {
            Stop-Cycle "git status 출력을 해석할 수 없다: '$l' — 안전을 위해 중단" 4
        }
        $path = $l.Substring(3)
        if ($path -match '->') { $path = ($path -split '->')[-1].Trim() }
        $dirty += $path
    }
}

$foreign = @($dirty | Where-Object { -not (Test-Whitelisted $_) })
if ($foreign.Count -gt 0) {
    Stop-Cycle ("예상하지 못한 변경이 러너 저장소에 있다 — reset/stash 하지 않고 중단한다: " + ($foreign -join ', ')) 4
}

# 직전 사이클이 push까지 못 간 채 남긴 Paper 산출물이면 먼저 커밋해 보존한다.
$recovered = $false
if ($dirty.Count -gt 0) {
    Write-Log ("직전 사이클의 미커밋 Paper 산출물 발견 — 삭제하지 않고 커밋해 보존한다: " + ($dirty -join ', ')) 'WARN'
    $addRes = Invoke-Git add -- $WHITELIST_DIR $WHITELIST_FILE
    if (-not (Test-GitOk $addRes 'git add(복구)')) { Stop-Cycle '복구 스테이징 실패 — 중단' 4 }
    $diffCached = Invoke-Git diff --cached --quiet
    if ($diffCached.Code -ne 0) {
        $c = Invoke-Git commit -m 'paper: 직전 사이클 미커밋 결과 보존 (local runner) [skip ci]'
        if (-not (Test-GitOk $c 'git commit(복구)')) { Stop-Cycle '복구 커밋 실패 — 중단' 4 }
        Write-Log '미커밋 Paper 산출물을 복구 커밋으로 보존했다.'
        $recovered = $true
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. 원격 동기화 — 안전할 때만 최신 main을 반영한다
# ─────────────────────────────────────────────────────────────────────────────
$fetch = Invoke-Git fetch origin $Branch
if ($fetch.Code -ne 0) {
    # 네트워크·GitHub 장애. 엔진도 어차피 인터넷이 필요하니 이번 사이클은 건너뛴다.
    Write-Log "원격 fetch 실패 — 이번 사이클은 건너뛴다(데이터 보존 우선). $($fetch.Output)" 'WARN'
    Write-Log 'remote sync: SKIPPED'
    Stop-Cycle '사이클 건너뜀 (fetch 실패)' 5 'WARN'
}

$localSha  = (Invoke-Git rev-parse HEAD).Output
$remoteSha = (Invoke-Git rev-parse "origin/$Branch").Output
$baseSha   = (Invoke-Git merge-base HEAD "origin/$Branch").Output

if ($localSha -eq $remoteSha) {
    Write-Log 'remote sync: 이미 최신(동일 커밋)'
}
elseif ($localSha -eq $baseSha) {
    # 로컬이 뒤처짐 → fast-forward만 허용
    $ff = Invoke-Git merge --ff-only "origin/$Branch"
    if ($ff.Code -ne 0) {
        Stop-Cycle "fast-forward 실패 — 자동 병합하지 않고 중단한다. $($ff.Output)" 6
    }
    Write-Log "remote sync: fast-forward 완료 → $((Invoke-Git rev-parse HEAD).Output)"
}
elseif ($remoteSha -eq $baseSha) {
    Write-Log 'remote sync: 로컬에 아직 push되지 않은 Paper 커밋이 있다(뒤에서 push 시도)'
}
else {
    # 갈라짐 — Paper 커밋을 최신 main 위로 재적용(자동 충돌 해결 금지)
    Write-Log 'remote sync: 로컬/원격이 갈라짐 — Paper 커밋을 최신 main 위로 rebase 시도'
    $rb = Invoke-Git rebase "origin/$Branch"
    if ($rb.Code -ne 0) {
        Invoke-Git rebase --abort | Out-Null
        Stop-Cycle "rebase 충돌 — abort했다. Paper 기록은 로컬에 그대로 보존된다. 수동 확인 필요. $($rb.Output)" 6
    }
    Write-Log "remote sync: rebase 완료 → $((Invoke-Git rev-parse HEAD).Output)"
}

Write-Log "러너 HEAD(동기화 후): $((Invoke-Git rev-parse HEAD).Output)"

# ─────────────────────────────────────────────────────────────────────────────
# 3. Paper 엔진 실행 (시세 전용)
# ─────────────────────────────────────────────────────────────────────────────
# Windows 콘솔 기본 코드페이지(cp949)에서는 '—' 같은 문자 출력이
# UnicodeEncodeError로 죽는다. UTF-8 모드를 강제한다.
$env:PYTHONUTF8 = '1'
$env:PYTHONIOENCODING = 'utf-8'

# 파이썬 실행기 결정 — py 런처 우선, 없으면 python
$pyExe = 'py'; $pyPre = @('-3')
if (-not (Get-Command 'py' -ErrorAction SilentlyContinue)) {
    $pyExe = 'python'; $pyPre = @()
    if (-not (Get-Command 'python' -ErrorAction SilentlyContinue)) {
        Stop-Cycle 'Python 실행기를 찾을 수 없다(py·python 모두 없음)' 7
    }
}

function Invoke-PaperScript {
    param([string]$Script, [switch]$ContinueOnError)
    $callArgs = @()
    if ($pyPre.Count -gt 0) { $callArgs += $pyPre }
    $callArgs += $Script
    $raw = & $pyExe @callArgs 2>&1
    $code = $LASTEXITCODE
    if ($null -ne $raw) {
        foreach ($l in $raw) {
            $s = $l.ToString()
            if (-not [string]::IsNullOrWhiteSpace($s)) { Write-Log "  $Script | $s" }
        }
    }
    if ($code -ne 0) {
        if ($ContinueOnError) {
            Write-Log "$Script 실패(exit $code) — 기록 커밋은 계속" 'WARN'
        }
        else {
            Write-Log "$Script 실패(exit $code)" 'ERROR'
        }
    }
    else {
        Write-Log "$Script 정상 종료(exit 0)"
    }
    return $code
}

if (-not (Test-Path (Join-Path $RepoPath 'paper_engine.py'))) {
    Stop-Cycle 'paper_engine.py가 러너 저장소에 없다 — 중단' 7
}

$engineCode = Invoke-PaperScript 'paper_engine.py'
if ($engineCode -ne 0) {
    # 엔진은 설계상 항상 exit 0이다. 0이 아니면 비정상 — 가짜 데이터를 만들지 않고 중단.
    Stop-Cycle "Paper Engine 비정상 종료(exit $engineCode) — 결과를 커밋하지 않는다" 7
}

# 워크플로와 동일한 의미: report·public 실패는 기록 커밋을 막지 않는다.
Invoke-PaperScript 'paper_report.py' -ContinueOnError | Out-Null
Invoke-PaperScript 'paper_public.py' -ContinueOnError | Out-Null

# ─────────────────────────────────────────────────────────────────────────────
# 4. 화이트리스트 커밋 — Paper 산출물 외에는 절대 커밋하지 않는다
# ─────────────────────────────────────────────────────────────────────────────
$addRes = Invoke-Git add -- $WHITELIST_DIR $WHITELIST_FILE
if (-not (Test-GitOk $addRes 'git add(결과)')) { Stop-Cycle '결과 스테이징 실패 — 중단' 8 }

$stagedRes = Invoke-Git diff --cached --name-only
if (-not (Test-GitOk $stagedRes 'git diff --cached')) { Stop-Cycle 'staged 목록 조회 실패 — 중단' 8 }

$staged = @()
if ($stagedRes.Output) {
    $staged = @($stagedRes.Output -split "`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

$violations = @($staged | Where-Object { -not (Test-Whitelisted $_) })
if ($violations.Count -gt 0) {
    Invoke-Git reset | Out-Null
    Stop-Cycle ("허용되지 않은 파일이 staged 되었다 — 커밋하지 않고 실패 처리한다: " + ($violations -join ', ')) 8
}

if ($staged.Count -eq 0) {
    if ($recovered) {
        Write-Log 'Paper 결과 변경 없음(단, 복구 커밋이 있어 push는 진행)'
    }
    else {
        # 로컬에 push 안 된 커밋이 남아있을 수 있으니 확인 후 종료 판단
        $ahead = (Invoke-Git rev-list --count "origin/$Branch..HEAD").Output
        if ($ahead -eq '0') {
            Write-Log 'commit 생성 여부: 없음 (Paper 결과 변경 없음) — push 없이 정상 종료'
            Write-Log '최종 exit code: 0'
            Write-Log '===== 사이클 종료 ====='
            exit 0
        }
        Write-Log "commit 생성 여부: 없음, 다만 push 안 된 커밋 ${ahead}건이 있어 push를 진행한다" 'WARN'
    }
}
else {
    Write-Log ("커밋 대상(화이트리스트 검증 통과): " + ($staged -join ', '))
    $commitRes = Invoke-Git commit -m 'paper: 가상매매 사이클 기록 (local runner) [skip ci]'
    if (-not (Test-GitOk $commitRes 'git commit')) { Stop-Cycle '커밋 실패 — 중단' 8 }
    Write-Log "commit 생성 여부: 생성됨 → $((Invoke-Git rev-parse HEAD).Output)"
}

# ─────────────────────────────────────────────────────────────────────────────
# 5. push — 재시도·rebase·충돌 시 중단(force 금지, 자동 충돌 해결 금지)
# ─────────────────────────────────────────────────────────────────────────────
$pushed = $false
for ($i = 1; $i -le 4; $i++) {
    $p = Invoke-Git push origin "HEAD:refs/heads/$Branch"
    if ($p.Code -eq 0) { $pushed = $true; break }

    $wait = [Math]::Pow(2, $i)
    Write-Log "push 실패 (시도 $i/4) — ${wait}초 대기 후 fetch/rebase. $($p.Output)" 'WARN'
    Start-Sleep -Seconds $wait

    $f = Invoke-Git fetch origin $Branch
    if ($f.Code -ne 0) {
        Write-Log "fetch 실패 — 다음 재시도로 진행. $($f.Output)" 'WARN'
        continue
    }
    # 이미 만든 Paper 커밋을 새 main 위로 replay할 뿐 — 엔진을 다시 돌리지 않는다.
    $rb = Invoke-Git rebase "origin/$Branch"
    if ($rb.Code -ne 0) {
        Invoke-Git rebase --abort | Out-Null
        Stop-Cycle "rebase 충돌 — 자동 병합하지 않는다. Paper 기록은 로컬 커밋으로 보존됨(다음 사이클에서 재시도). $($rb.Output)" 9
    }
}

if (-not $pushed) {
    Stop-Cycle 'push 4회 재시도 모두 실패 — Paper 기록이 remote에 저장되지 않았다(로컬 커밋으로 보존, 다음 사이클 재시도)' 9
}

Write-Log "push 결과: 성공 ($Branch) → $((Invoke-Git rev-parse HEAD).Output)"
Write-Log '최종 exit code: 0'
Write-Log '===== 사이클 종료 ====='
exit 0
