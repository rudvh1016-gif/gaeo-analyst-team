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
    · 원격 이력이 재작성돼 공통 조상이 없어도, 로컬 장부가 원격에 전부 들어 있음을 **내용으로**
      증명(paper_ledger_inclusion.py)하고 백업(복사·bundle·manifest)까지 검증한 뒤에만 재기준한다.
      시각(lastCycleAt) 비교로 판단하지 않는다(2026-09-10 구간 A).

  Secret 없음 / 개인 경로 하드코딩 없음 — 공개 저장소에 있어도 안전한 스크립트.
  ⚠️ 이 파일의 실제 Windows 실행 검증은 2026-09-10 원격 세션에서는 하지 못했다(PowerShell 없음).
     test_paper_runner_sync.py 가 같은 경로·문구·순서를 정적으로 대조하고, sh 판은 실제로 실행해 검증한다.
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
    [int]$LogRetentionDays = 30,

    # 재기준(원격 이력 재작성) 전 백업 폴더 — 클라우드 동기화가 안 되는 로컬 경로여야 한다
    [string]$BackupDir = (Join-Path $env:LOCALAPPDATA 'GAEO\backups')
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
# 로그는 BOM 있는 UTF-8로 쓴다 — 메모장·PowerShell 등 Windows 기본 도구가
# BOM 없는 UTF-8을 cp949로 오독해 한글이 깨져 보이기 때문이다.
# (AppendAllText는 파일이 비어 있을 때만 BOM을 쓰므로 중복되지 않는다)
$script:LogEnc = New-Object System.Text.UTF8Encoding($true)

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $stamp = (Get-KstNow).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "[$stamp KST] [$Level] " + (Protect-Log $Message)
    Write-Host $line
    if ($script:LogFile) {
        try { [System.IO.File]::AppendAllText($script:LogFile, $line + "`r`n", $script:LogEnc) } catch { }
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

# stdout 만 필요한 git 명령(예: show 로 파일 내용을 꺼낼 때). stderr 경고가 파일 내용에 섞이면 안 된다.
function Invoke-GitStdout {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    $raw = & git @GitArgs 2>$null
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
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
function Release-CycleMutex {
    if ($script:CycleMutex) { try { $script:CycleMutex.ReleaseMutex() } catch { } ; try { $script:CycleMutex.Dispose() } catch { } ; $script:CycleMutex = $null }
}
function Stop-Cycle {
    param([string]$Reason, [int]$Code, [string]$Level = 'ERROR')
    Write-Log $Reason $Level
    Write-Log "최종 exit code: $Code"
    Release-CycleMutex   # ISE·dot-source 로 시험할 때 호스트가 뮤텍스를 계속 쥐지 않게
    exit $Code
}

# ─────────────────────────────────────────────────────────────────────────────
# 겹쳐 돌기 방지 — 사이클과 복구 도구(paper_recover.ps1)가 같은 이름의 뮤텍스를 쓴다.
#   프로세스가 죽으면 OS 가 뮤텍스를 풀어 주므로 오래된 잠금이 남지 않는다.
# ─────────────────────────────────────────────────────────────────────────────
$script:CycleMutex = $null
function Lock-Cycle {
    try {
        try { $script:CycleMutex = New-Object System.Threading.Mutex($false, 'Global\GAEO-Paper-Cycle') }
        catch [System.UnauthorizedAccessException] { $script:CycleMutex = New-Object System.Threading.Mutex($false, 'Local\GAEO-Paper-Cycle') }
        $got = $false
        try { $got = $script:CycleMutex.WaitOne(0) }
        catch [System.Threading.AbandonedMutexException] { $got = $true }
        if (-not $got) {
            Stop-Cycle '다른 사이클(또는 복구 도구)이 실행 중이다(뮤텍스 Global\GAEO-Paper-Cycle) — 겹쳐 돌지 않는다' 3
        }
    }
    catch {
        Stop-Cycle "잠금을 만들 수 없다: $($_.Exception.Message)" 3
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# 파이썬 — 엔진(3단계)뿐 아니라 2단계(원격 이력 재작성 판정)에도 필요하므로 동기화 전에 찾는다.
#   py 런처 우선, 없으면 python. 못 찾으면 exit 7 (아무것도 바꾸지 않은 상태에서 멈춘다).
# ─────────────────────────────────────────────────────────────────────────────
$script:PyExe = $null; $script:PyPre = @()
function Resolve-Python {
    if (Get-Command 'py' -ErrorAction SilentlyContinue) { $script:PyExe = 'py'; $script:PyPre = @('-3'); return $true }
    if (Get-Command 'python' -ErrorAction SilentlyContinue) { $script:PyExe = 'python'; $script:PyPre = @(); return $true }
    return $false
}

function Invoke-Python {   # Invoke-Python 파일 인자… -> @{ Code; Output }
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$PyArgs)
    $callArgs = @()
    if ($script:PyPre.Count -gt 0) { $callArgs += $script:PyPre }
    $callArgs += $PyArgs
    $raw = & $script:PyExe @callArgs 2>&1
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
    return [pscustomobject]@{ Code = $code; Output = $text.TrimEnd() }
}

# 장부 포함성 모듈(paper_ledger_inclusion.py)을 찾는다. 옛 HEAD 작업트리(2026-09-10 이전 clone)에는 없으므로
# 그때는 origin/$Branch 에서 꺼내 임시 파일로 쓴다(러너는 어차피 동기화 뒤 저장소의 파이썬을 실행한다 — 같은 신뢰 수준).
$script:InclusionModule = $null
$script:InclusionModuleTmp = $null
function Resolve-InclusionModule {
    $inTree = Join-Path $RepoPath 'paper_ledger_inclusion.py'
    if (Test-Path $inTree) { $script:InclusionModule = $inTree; return $true }
    $show = Invoke-GitStdout show "origin/${Branch}:paper_ledger_inclusion.py"
    if ($show.Code -ne 0 -or [string]::IsNullOrWhiteSpace($show.Output)) { return $false }
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("gaeo-paper-inclusion-" + [guid]::NewGuid().ToString('N') + ".py")
    try { [System.IO.File]::WriteAllText($tmp, $show.Output, (New-Object System.Text.UTF8Encoding($false))) } catch { return $false }
    $script:InclusionModuleTmp = $tmp
    $script:InclusionModule = $tmp
    return $true
}
function Remove-InclusionModuleTmp {
    if ($script:InclusionModuleTmp -and (Test-Path $script:InclusionModuleTmp)) {
        Remove-Item -Force -ErrorAction SilentlyContinue $script:InclusionModuleTmp
    }
}

# 원격 이력이 재작성됐을 때 "로컬 장부가 원격에 전부 들어 있는가"를 **내용으로** 판정한다(2026-09-10 구간 A).
#   paper_ledger_inclusion.py check 가 이벤트 원장 줄(거래 ID·수량·가격·현금)·state 보유 투영·다른 계좌 폴더까지
#   대조한다. 종료코드 0(COVERED)일 때만 포함. 1(NOT_COVERED)·2(UNDETERMINED = 빈 파일·해석 불가·모듈 없음)는
#   전부 "증명 못 함" = 포함 아님(fail closed → 사이클은 exit 6). 시각(lastCycleAt) 비교 fallback 은 없다 —
#   시각이 같거나 새롭다는 것은 거래·수량·현금·보유가 들어 있다는 증거가 아니다.
$script:InclusionVerdict = 'UNDETERMINED'
$script:InclusionReport = ''
function Test-LocalLedgerCoveredByRemote {
    if (-not (Resolve-InclusionModule)) {
        $script:InclusionReport = "포함성 모듈(paper_ledger_inclusion.py)을 작업트리·origin/$Branch 어디서도 찾지 못했다"
        $script:InclusionVerdict = 'UNDETERMINED'
        return $false
    }
    $r = Invoke-Python $script:InclusionModule 'check' '--repo' $RepoPath '--local' 'HEAD' '--remote' "origin/$Branch"
    $script:InclusionReport = $r.Output
    $code = $r.Code
    # 판정 헤더가 없는 출력은 모듈 자체의 오류(traceback 등)다 — exit 1 이라도 NOT_COVERED 로 표기하지 않는다.
    if ($code -ne 0 -and -not ($r.Output -like '*[장부 포함성]*')) { $code = 2 }
    switch ($code) {
        0 { $script:InclusionVerdict = 'COVERED' }
        1 { $script:InclusionVerdict = 'NOT_COVERED' }
        default { $script:InclusionVerdict = 'UNDETERMINED' }
    }
    return ($code -eq 0)
}

# 재기준 전 백업 — 작업트리 paper_trading 복사(바이트 대조) + 옛 HEAD bundle(verify) + sha256 manifest.
#   실패하면 재기준하지 않는다. 옛 커밋이 원격에 이미 다 있으면 bundle 은 만들지 않고 manifest 에 그렇게 적는다.
$script:BackupTarget = ''
function Backup-BeforeRepoint {
    $label = 'prerepoint-' + (Get-KstNow).ToString('yyyyMMddTHHmmss')
    $r = Invoke-Python $script:InclusionModule 'backup' '--repo' $RepoPath '--dest' $BackupDir '--label' $label '--not-ref' "origin/$Branch" '--json'
    if ($r.Code -ne 0) {
        Write-Log "백업 출력: $($r.Output)" 'ERROR'
        return $false
    }
    $m = [regex]::Match($r.Output, '"dir":\s*"([^"]*)"')
    if ($m.Success) { $script:BackupTarget = $m.Groups[1].Value.Replace('\\', '\') }
    return $true
}

# ─────────────────────────────────────────────────────────────────────────────
# 0. 준비 · 안전 가드
# ─────────────────────────────────────────────────────────────────────────────
# 파이썬 출력·캡처를 UTF-8 로 고정한다 — 2단계(포함성 판정·모듈 추출)도 3단계처럼 한글을 다루기 때문에 잠금보다 먼저 둔다.
$env:PYTHONUTF8 = '1'
$env:PYTHONIOENCODING = 'utf-8'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }

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

# 🔒 겹쳐 돌기 방지 — 다른 사이클·복구 도구가 돌고 있으면 아무것도 하지 않는다.
Lock-Cycle

# 파이썬은 엔진(3단계)뿐 아니라 2단계 판정에도 필요하다. 없으면 여기서 멈춘다(아무것도 바꾸지 않은 상태).
if (-not (Resolve-Python)) { Stop-Cycle 'Python 실행기를 찾을 수 없다(py·python 모두 없음)' 7 }

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
$mbRes     = Invoke-Git merge-base HEAD "origin/$Branch"
$baseSha   = $mbRes.Output

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
elseif ($mbRes.Code -ne 0 -and $mbRes.Code -ne 1) {
    # merge-base 가 1 이 아닌 오류(128 등)로 끝났다 = "공통 조상 없음"이 아니라 조회 실패. 모른다를 고장으로도
    # 괜찮다로도 바꾸지 않는다 — 아무것도 옮기지 않고 멈춘다.
    Stop-Cycle "merge-base 조회 실패(exit $($mbRes.Code)) — 재작성인지 알 수 없어 재기준하지 않는다: $baseSha" 6
}
elseif ($mbRes.Code -ne 0 -or [string]::IsNullOrWhiteSpace($baseSha)) {
    # 🧭 공통 조상 없음 = 원격 이력이 재작성됐다(예: compact-history 의 filter-branch + force push,
    #    2026-09-02 08:25 KST 실측). 이 상태에서 rebase 는 저장소 첫 커밋부터 전부 다시 적용하려다
    #    반드시 충돌하고, 사이클은 매번 exit 6 으로 끝나며 엔진은 한 번도 돌지 않는다
    #    (2026-09-02 부터 집 PC 러너가 8거래일 침묵한 경위 — docs/operations/STATUS.md).
    #    로컬 장부가 원격에 **내용으로** 전부 들어 있음이 증명될 때만 origin/main 으로 재기준한다: 잃을 것이 없다.
    #    순서: ① 얕은 복제 아님 확인 → ② 포함성 판정(paper_ledger_inclusion.py) → ③ 백업(복사·bundle·manifest 검증)
    #          → ④ 옛 HEAD 를 refs/gaeo-backup/ 에 보존 → ⑤ 브랜치 포인터만 옮김. 어느 단계든 실패하면 재기준하지 않는다.
    #    "reset --hard 금지" 원칙과 충돌하지 않는다 — 깨끗한 트리에서 브랜치 포인터만 옮기고 옛 포인터를 보존한다.
    $shallow = Invoke-Git rev-parse --is-shallow-repository
    if ($shallow.Code -ne 0 -or $shallow.Output -eq 'true') {
        Stop-Cycle "얕은 복제(shallow clone)이거나 판정 불가($($shallow.Output))라 공통 조상 없음을 재작성으로 단정할 수 없다 — 재기준하지 않는다. 수동: git fetch --unshallow origin 뒤 다시 실행" 6
    }
    $originUrl = (Invoke-Git remote get-url origin).Output
    Write-Log "remote sync: 공통 조상 없음 — origin=$originUrl 로컬=$localSha 원격=$remoteSha" 'WARN'
    if (Test-LocalLedgerCoveredByRemote) {
        Write-Log "장부 포함성 판정: $($script:InclusionVerdict)"
        foreach ($l in ($script:InclusionReport -split "`n")) { if (-not [string]::IsNullOrWhiteSpace($l)) { Write-Log "  $l" } }
        if (-not (Backup-BeforeRepoint)) {
            Remove-InclusionModuleTmp
            Stop-Cycle "재기준 전 백업 실패(백업 폴더: $BackupDir) — 재기준하지 않고 중단한다. 수동 확인: powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -RepoPath `"$RepoPath`" -Mode check" 6
        }
        Write-Log "재기준 전 백업 완료(복사·bundle·manifest 검증 통과): $($script:BackupTarget)"
        $backupRef = "refs/gaeo-backup/head-$((Get-KstNow).ToString('yyyyMMddTHHmmss'))"
        $b = Invoke-Git update-ref $backupRef HEAD
        if (-not (Test-GitOk $b 'git update-ref(옛 HEAD 백업)')) { Remove-InclusionModuleTmp; Stop-Cycle '옛 HEAD 백업 실패 — 재기준하지 않고 중단' 6 }
        $co = Invoke-Git checkout -B $Branch "origin/$Branch"
        if (-not (Test-GitOk $co 'git checkout -B(재기준)')) { Remove-InclusionModuleTmp; Stop-Cycle "원격 이력 재작성 뒤 재기준 실패 — $($co.Output) (옛 HEAD: $backupRef, 백업: $($script:BackupTarget))" 6 }
        Remove-InclusionModuleTmp
        Write-Log "remote sync: 원격 이력 재작성 감지(공통 조상 없음) — 로컬 장부가 원격에 전부 포함됨을 내용으로 확인해 origin/$Branch 로 재기준했다 → $((Invoke-Git rev-parse HEAD).Output) (옛 HEAD 보존: $backupRef, 백업: $($script:BackupTarget))" 'WARN'
    }
    else {
        Write-Log "장부 포함성 판정: $($script:InclusionVerdict)" 'ERROR'
        foreach ($l in ($script:InclusionReport -split "`n")) { if (-not [string]::IsNullOrWhiteSpace($l)) { Write-Log "  $l" 'ERROR' } }
        Remove-InclusionModuleTmp
        Stop-Cycle "원격 이력이 재작성됐고(공통 조상 없음) 로컬 장부가 원격에 전부 들어 있음을 증명하지 못했다(판정 $($script:InclusionVerdict)) — 자동으로 버리지 않는다. 수동 확인 필요: powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -RepoPath `"$RepoPath`" -Mode check (docs/PAPER_TRADING_LOCAL_RUNNER.md 9절)" 6
    }
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
# 🔒 Single Writer — 이 스크립트는 집 Windows PC 전용이므로 자기 이름을 스스로 선언한다.
#    (사람이 부트스트랩에 환경변수를 넣는 걸 잊어도 러너 이름이 비지 않게 한다.
#     이미 선언돼 있으면 존중한다 — 수동 시험 실행에서 덮어쓰지 않는다)
#    실제 활성 러너는 저장소의 paper_runner_config.json이 정하고, 판정은 엔진이 한다.
#    ⚠️ 여기서 미리 게이트를 걸어 종료하면 안 된다. 원격 동기화(2단계)를 먼저 해야
#       "내가 활성으로 바뀌었다"는 설정 변경을 러너가 읽을 수 있기 때문이다.
if ([string]::IsNullOrWhiteSpace($env:GAEO_PAPER_RUNNER)) { $env:GAEO_PAPER_RUNNER = 'WINDOWS' }
Write-Log "Single Writer 선언: $($env:GAEO_PAPER_RUNNER) (활성 러너는 paper_runner_config.json이 정한다)"

# Windows 콘솔 기본 코드페이지(cp949)에서는 '—' 같은 문자 출력이
# UnicodeEncodeError로 죽는다. UTF-8 모드를 강제한다.
$env:PYTHONUTF8 = '1'
$env:PYTHONIOENCODING = 'utf-8'
# 파이썬이 UTF-8로 써도 PowerShell이 자식 프로세스 stdout을 콘솔 코드페이지(cp949)로
# 디코딩하면 로그에 한글이 깨져 들어간다. 엔진 오류 메시지를 읽어야 할 때 치명적이라
# 캡처 인코딩도 UTF-8로 맞춘다.
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }

# 파이썬 실행기는 0단계(Resolve-Python)에서 이미 정했다: $script:PyExe / $script:PyPre
$pyExe = $script:PyExe; $pyPre = $script:PyPre

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

# 🧪 두 번째 전략(업종 흐름 급등주 단기 보유) — 기본 OFF.
#    GAEO_PAPER_MOMENTUM=1 일 때만 실제로 돈다. 스크립트가 스스로 꺼짐을 판단해
#    즉시 종료하므로 여기서는 조건 없이 부른다(켜고 끄는 데 코드 수정이 필요 없다).
#    ⚠️ 실패해도 기존 전략의 기록 커밋을 막지 않는다.
if (Test-Path (Join-Path $RepoPath 'paper_momentum.py')) {
    Invoke-PaperScript 'paper_momentum.py' -ContinueOnError | Out-Null
}

# 🧪 세 번째 전략(Smart V2 — 5거래일은 청산일이 아니라 재평가일) — 기본 ON.
#    끄려면 GAEO_PAPER_SMART_V2=0. 스크립트가 스스로 꺼짐을 판단해 즉시 종료하므로
#    여기서는 조건 없이 부른다(켜고 끄는 데 코드 수정이 필요 없다).
#    ⚠️ 별도 폴더(paper_trading/smart_v2) + 별도 environment라 V1 기록과 섞이지 않고,
#       실패해도 기존 전략의 기록 커밋을 막지 않는다.
if (Test-Path (Join-Path $RepoPath 'paper_smart_v2.py')) {
    Invoke-PaperScript 'paper_smart_v2.py' -ContinueOnError | Out-Null
}

# 🧪 네 번째 전략(Scalp V3 — 시장 폭 게이트 + 단기 모멘텀 + 익절/손절 단타) — 기본 ON.
#    끄려면 GAEO_PAPER_SCALP_V3=0. 스크립트가 스스로 꺼짐을 판단해 즉시 종료하므로
#    여기서는 조건 없이 부른다(켜고 끄는 데 코드 수정이 필요 없다).
#    ⚠️ 별도 폴더(paper_trading/scalp_v3) + 별도 environment라 V1·V2 기록과 섞이지 않고,
#       실패해도 기존 전략의 기록 커밋을 막지 않는다.
if (Test-Path (Join-Path $RepoPath 'paper_scalp_v3.py')) {
    Invoke-PaperScript 'paper_scalp_v3.py' -ContinueOnError | Out-Null
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
            Release-CycleMutex
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
Release-CycleMutex
exit 0
