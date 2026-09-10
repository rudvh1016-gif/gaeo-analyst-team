<#
  GAEO Paper 러너 복구 도구 (집 Windows PC 판) — 원격 이력이 재작성된 뒤 러너 전용 저장소를 안전하게 되살린다.
  scripts/paper_recover.sh(Linux 판)와 같은 단계·같은 판정·같은 종료코드다.

  쓰는 법 (개발용 저장소 폴더에서 PowerShell 창을 열고):
      powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1                     # 검사만 (아무것도 안 바꿈)
      powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -Mode apply         # 복구 실행
      powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -Mode apply -RunCycle   # 복구 뒤 사이클 1회

  기본은 검사 모드(-Mode check) : 아무것도 바꾸지 않는다(fetch 만 한다). 상태·판정·계획을 보여 준다.
  실행 모드(-Mode apply) : 로컬 장부가 원격에 전부 들어 있음이 **내용으로** 증명될 때만
      백업(paper_trading 복사·옛 HEAD bundle·sha256 manifest 를 만들고 검증) → 옛 HEAD 를 refs/gaeo-backup/ 에 보존
      → 브랜치 포인터만 origin/main 으로 옮긴다(checkout -B). 증명 못 하면 미전송 기록을 별도 폴더에 보존하고
      exit 11 로 멈춘다(재기준하지 않는다). 단계마다 실패하면 그 자리에서 멈춘다.

  하지 않는 것 : reset --hard · clean · force push · stash · allow-unrelated-histories · 원격 이력 재작성 ·
      실주문 · 다른 저장소(retailpulse·gaeo-private·gaeo-gateway 등)에서 실행 — 원격 주소가 다르면 exit 2.
  Secret 값은 어디에도 출력하지 않는다.

  종료코드
      0  할 일 없음(이미 최신·fast-forward 가능·안 올린 커밋만·갈라짐 — 사이클이 스스로 처리) / apply 에서 재기준 완료
      10 (check) 재기준 가능 — 로컬 장부가 원격에 전부 포함됨이 증명됐다. -Mode apply 로 실행하면 된다
      11 수동 확인 필요(포함 증명 실패·판정 불가·외부 변경·얕은 복제·조회 실패). apply 면 미전송 기록을 보존해 둔다
      2  저장소·마커·원격 주소·브랜치 불일치(다른 저장소에서는 절대 돌지 않는다)
      3  다른 사이클·복구 도구가 실행 중(뮤텍스)
      5  fetch 실패
      6  apply 단계 실패(백업 실패 등) — 재기준하지 않았다
      7  파이썬 없음·포함성 모듈 없음

  ⚠️ 이 파일의 실제 Windows 실행 검증은 2026-09-10 원격 세션에서는 하지 못했다(PowerShell 없음).
     test_paper_recover.py 가 sh 판을 실제로 실행해 검증하고, 이 파일은 같은 단계·문구·순서를 정적으로 대조한다.
#>

[CmdletBinding()]
param(
    [string]$RepoPath = (Join-Path $env:LOCALAPPDATA 'GAEO\paper-runner\repo'),
    [ValidateSet('check', 'apply')][string]$Mode = 'check',
    [string]$Branch = 'main',
    [string]$ExpectRemote = 'rudvh1016-gif/gaeo-analyst-team',
    [string]$BackupDir = (Join-Path $env:LOCALAPPDATA 'GAEO\backups'),
    [string]$LogDir = (Join-Path $env:LOCALAPPDATA 'GAEO\logs'),
    [switch]$RunCycle,
    [string]$TaskName = 'GAEO Paper Trading',
    [int]$CycleWaitSeconds = 240
)

$ErrorActionPreference = 'Continue'
$WHITELIST_DIR  = 'paper_trading'
$WHITELIST_FILE = 'paper_public.js'
$MARKER_NAME    = '.gaeo-paper-runner'

# ─────────────────────────────────────────────────────────────────────────────
# 로그 · 잠금 · git 헬퍼 (paper_cycle.ps1 과 같은 규칙)
# ─────────────────────────────────────────────────────────────────────────────
function Get-KstNow {
    try { $tz = [System.TimeZoneInfo]::FindSystemTimeZoneById('Korea Standard Time'); return [System.TimeZoneInfo]::ConvertTimeFromUtc([DateTime]::UtcNow, $tz) }
    catch { return (Get-Date) }
}
function Protect-Log {
    param([string]$Text)
    if ([string]::IsNullOrEmpty($Text)) { return $Text }
    foreach ($name in @('TOSS_INVEST_CLIENT_ID', 'TOSS_INVEST_CLIENT_SECRET')) {
        $v = [Environment]::GetEnvironmentVariable($name)
        if (-not [string]::IsNullOrWhiteSpace($v) -and $v.Length -ge 4) { $Text = $Text.Replace($v, '***REDACTED***') }
    }
    return [Regex]::Replace($Text, '(?i)(bearer|authorization|access_token|client_secret)\s*[:=]\s*\S+', '$1: ***REDACTED***')
}
$script:LogFile = $null
$script:LogEnc = New-Object System.Text.UTF8Encoding($true)
function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $line = "[$((Get-KstNow).ToString('yyyy-MM-dd HH:mm:ss')) KST] [$Level] " + (Protect-Log $Message)
    $color = 'Gray'; if ($Level -eq 'ERROR') { $color = 'Red' } elseif ($Level -eq 'WARN') { $color = 'Yellow' }
    Write-Host $line -ForegroundColor $color
    if ($script:LogFile) { try { [System.IO.File]::AppendAllText($script:LogFile, $line + "`r`n", $script:LogEnc) } catch { } }
}
function Initialize-Log {
    try {
        if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }
        $script:LogFile = Join-Path $LogDir ("recover-" + (Get-KstNow).ToString('yyyy-MM-dd') + ".log")
    } catch { $script:LogFile = $null }
}
$script:CycleMutex = $null
$script:InclusionModuleTmp = $null
function Release-All {
    if ($script:InclusionModuleTmp -and (Test-Path $script:InclusionModuleTmp)) { Remove-Item -Force -ErrorAction SilentlyContinue $script:InclusionModuleTmp }
    if ($script:CycleMutex) { try { $script:CycleMutex.ReleaseMutex() } catch { } ; $script:CycleMutex = $null }
}
function Finish {   # Finish "사유" code [LEVEL]
    param([string]$Reason, [int]$Code, [string]$Level = 'INFO')
    Write-Log $Reason $Level
    Write-Log "복구 도구 종료코드: $Code (모드 $Mode)"
    Release-All
    exit $Code
}
function Lock-Cycle {
    try {
        try { $script:CycleMutex = New-Object System.Threading.Mutex($false, 'Global\GAEO-Paper-Cycle') }
        catch [System.UnauthorizedAccessException] { $script:CycleMutex = New-Object System.Threading.Mutex($false, 'Local\GAEO-Paper-Cycle') }
        $got = $false
        try { $got = $script:CycleMutex.WaitOne(0) } catch [System.Threading.AbandonedMutexException] { $got = $true }
        if (-not $got) { $script:CycleMutex = $null; Finish '다른 사이클(또는 복구 도구)이 실행 중이다(뮤텍스 Global\GAEO-Paper-Cycle) — 겹쳐 돌지 않는다. 끝나기를 기다렸다가 다시 실행' 3 'ERROR' }
    }
    catch { Finish "잠금을 만들 수 없다: $($_.Exception.Message)" 3 'ERROR' }
}
function Invoke-GitStdout {   # stdout 만(파일 내용을 꺼낼 때 stderr 경고가 섞이지 않게)
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    $raw = & git @GitArgs 2>$null
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
    return [pscustomobject]@{ Code = $code; Output = $text.TrimEnd() }
}
function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)
    $raw = & git @GitArgs 2>&1
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
    return [pscustomobject]@{ Code = $code; Output = $text.TrimEnd() }
}
$script:PyExe = $null; $script:PyPre = @()
function Resolve-Python {
    if (Get-Command 'py' -ErrorAction SilentlyContinue) { $script:PyExe = 'py'; $script:PyPre = @('-3'); return $true }
    if (Get-Command 'python' -ErrorAction SilentlyContinue) { $script:PyExe = 'python'; $script:PyPre = @(); return $true }
    return $false
}
function Invoke-Python {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$PyArgs)
    $callArgs = @(); if ($script:PyPre.Count -gt 0) { $callArgs += $script:PyPre }; $callArgs += $PyArgs
    $raw = & $script:PyExe @callArgs 2>&1
    $code = $LASTEXITCODE
    $text = ''
    if ($null -ne $raw) { $text = (($raw | ForEach-Object { $_.ToString() }) -join "`n") }
    return [pscustomobject]@{ Code = $code; Output = $text.TrimEnd() }
}
function Test-Whitelisted {
    param([string]$Path)
    $p = $Path.Replace('\', '/').Trim().Trim('"')
    if ($p -eq $WHITELIST_FILE) { return $true }
    if ($p.StartsWith($WHITELIST_DIR + '/')) { return $true }
    return $false
}
function Get-JsonDir {   # backup --json 출력에서 "dir" 값
    param([string]$Text)
    $m = [regex]::Match($Text, '"dir":\s*"([^"]*)"')
    if ($m.Success) { return $m.Groups[1].Value.Replace('\\', '\') }
    return ''
}

# ─────────────────────────────────────────────────────────────────────────────
# [1/8] 저장소 확인 : 경로·마커·git·원격 주소·브랜치. 하나라도 다르면 아무것도 하지 않는다.
# ─────────────────────────────────────────────────────────────────────────────
$env:PYTHONUTF8 = '1'; $env:PYTHONIOENCODING = 'utf-8'
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }
Initialize-Log
Write-Log "===== GAEO Paper 러너 복구 도구 (Windows) 시작 — 모드 $Mode ====="
if (-not (Test-Path $RepoPath)) { Finish "러너 저장소를 찾을 수 없다: $RepoPath" 2 'ERROR' }
$runnerRoot = Split-Path -Path $RepoPath -Parent
if (-not (Test-Path (Join-Path $runnerRoot $MARKER_NAME))) {
    Finish "[1/8] 러너 마커($MARKER_NAME)가 $runnerRoot 에 없다 — 러너 전용 저장소가 아니면 실행하지 않는다(개발용 저장소·다른 프로젝트에서 돌리지 말 것)" 2 'ERROR'
}
Set-Location -Path $RepoPath
$inside = Invoke-Git rev-parse --is-inside-work-tree
if ($inside.Code -ne 0 -or $inside.Output -ne 'true') { Finish "[1/8] git 저장소가 아니다: $RepoPath" 2 'ERROR' }
$originRes = Invoke-Git remote get-url origin
if ($originRes.Code -ne 0) { Finish "[1/8] origin 원격이 없다: $($originRes.Output)" 2 'ERROR' }
$originUrl = $originRes.Output
$originNorm = ($originUrl.ToLowerInvariant() -replace '\.git/?$', '').TrimEnd('/')
$expectNorm = ($ExpectRemote.ToLowerInvariant() -replace '\.git/?$', '').TrimEnd('/')
if (-not [string]::IsNullOrWhiteSpace($expectNorm) -and -not $originNorm.Contains($expectNorm)) {
    Finish "[1/8] origin 주소가 예상 저장소($ExpectRemote)가 아니다: $originUrl — 다른 저장소에서는 절대 복구를 돌리지 않는다" 2 'ERROR'
}
$cur = Invoke-Git symbolic-ref --short -q HEAD
if ($cur.Code -ne 0 -or $cur.Output -ne $Branch) { Finish "[1/8] 현재 브랜치가 '$Branch'가 아니다(detached 이거나 다른 브랜치): '$($cur.Output)' — 손대지 않는다" 2 'ERROR' }
$headStart = (Invoke-Git rev-parse HEAD).Output
Write-Log "[1/8] 저장소 확인 OK: $RepoPath · origin=$originUrl · 브랜치 $Branch · HEAD $headStart"

# ─────────────────────────────────────────────────────────────────────────────
# [2/8] 잠금 · 파이썬
# ─────────────────────────────────────────────────────────────────────────────
Lock-Cycle
if (-not (Resolve-Python)) { Finish '[2/8] Python 실행기를 찾을 수 없다(py·python 모두 없음)' 7 'ERROR' }
Write-Log "[2/8] 잠금 확보(Global\GAEO-Paper-Cycle) · 파이썬 $($script:PyExe)"

# ─────────────────────────────────────────────────────────────────────────────
# [3/8] 작업트리 : Paper 산출물 이외의 변경이 있으면 멈춘다. Paper 산출물은 apply 에서 복구 커밋으로 보존한다.
# ─────────────────────────────────────────────────────────────────────────────
$statusRes = Invoke-Git status --porcelain
if ($statusRes.Code -ne 0) { Finish "[3/8] git status 실패: $($statusRes.Output)" 11 'ERROR' }
$dirty = @()
if ($statusRes.Output) {
    foreach ($line in ($statusRes.Output -split "`n")) {
        $l = $line.TrimEnd("`r")
        if ([string]::IsNullOrWhiteSpace($l)) { continue }
        if ($l.Length -lt 4) { Finish "[3/8] git status 출력을 해석할 수 없다: '$l'" 11 'ERROR' }
        $path = $l.Substring(3)
        if ($path -match '->') { $path = ($path -split '->')[-1].Trim() }
        $dirty += $path
    }
}
$foreign = @($dirty | Where-Object { -not (Test-Whitelisted $_) })
if ($foreign.Count -gt 0) {
    Finish ("[3/8] Paper 산출물이 아닌 변경이 러너 저장소에 있다: " + ($foreign -join ', ') + " — reset/stash 하지 않는다. 사람이 확인해 치운 뒤(다른 곳에 옮기거나 커밋) 다시 실행") 11 'ERROR'
}
$recovered = $false
if ($dirty.Count -gt 0) {
    if ($Mode -eq 'apply') {
        Write-Log ("[3/8] 미커밋 Paper 산출물 $($dirty.Count)개 → 삭제하지 않고 복구 커밋으로 보존한다: " + ($dirty -join ', ')) 'WARN'
        $addRes = Invoke-Git add -- $WHITELIST_DIR $WHITELIST_FILE
        if ($addRes.Code -ne 0) { Finish "[3/8] 복구 스테이징 실패: $($addRes.Output)" 6 'ERROR' }
        $diffCached = Invoke-Git diff --cached --quiet
        if ($diffCached.Code -ne 0) {
            $c = Invoke-Git commit -m 'paper: 복구 도구가 미커밋 결과 보존 [skip ci]'
            if ($c.Code -ne 0) { Finish "[3/8] 복구 커밋 실패: $($c.Output)" 6 'ERROR' }
            $recovered = $true
            Write-Log "[3/8] 복구 커밋 생성 → $((Invoke-Git rev-parse HEAD).Output)"
        }
    }
    else {
        Write-Log ("[3/8] 미커밋 Paper 산출물 $($dirty.Count)개(검사 모드라 손대지 않음; apply 에서 복구 커밋으로 보존): " + ($dirty -join ', ')) 'WARN'
    }
}
else { Write-Log '[3/8] 작업트리 깨끗함' }

# ─────────────────────────────────────────────────────────────────────────────
# [4/8] 얕은 복제 · fetch
# ─────────────────────────────────────────────────────────────────────────────
$shallow = Invoke-Git rev-parse --is-shallow-repository
if ($shallow.Code -ne 0 -or $shallow.Output -eq 'true') {
    Finish "[4/8] 얕은 복제(shallow clone)라 공통 조상을 판정할 수 없다($($shallow.Output)) — 재기준하지 않는다. 수동: git fetch --unshallow origin 뒤 다시 실행" 11 'ERROR'
}
$fetch = Invoke-Git fetch origin $Branch
if ($fetch.Code -ne 0) { Finish "[4/8] 원격 fetch 실패(네트워크·인증·GitHub 상태 확인): $($fetch.Output)" 5 'ERROR' }
$localSha  = (Invoke-Git rev-parse HEAD).Output
$remoteSha = (Invoke-Git rev-parse "origin/$Branch").Output
$mbRes     = Invoke-Git merge-base HEAD "origin/$Branch"
$baseSha   = $mbRes.Output
$aheadN    = (Invoke-Git rev-list --count "origin/$Branch..HEAD").Output
$behindN   = (Invoke-Git rev-list --count "HEAD..origin/$Branch").Output
Write-Log "[4/8] fetch OK · 로컬 $localSha · 원격 $remoteSha · 로컬에만 있는 커밋 $aheadN · 원격에만 있는 커밋 $behindN"

# ─────────────────────────────────────────────────────────────────────────────
# [5/8] 분류
# ─────────────────────────────────────────────────────────────────────────────
$state = 'DIVERGED'
if ($localSha -eq $remoteSha) { $state = 'SAME' }
elseif ($mbRes.Code -eq 0 -and $localSha -eq $baseSha) { $state = 'BEHIND' }
elseif ($mbRes.Code -eq 0 -and $remoteSha -eq $baseSha) { $state = 'AHEAD' }
elseif ($mbRes.Code -eq 1 -or ($mbRes.Code -eq 0 -and [string]::IsNullOrWhiteSpace($baseSha))) { $state = 'NO_COMMON_ANCESTOR' }
elseif ($mbRes.Code -ne 0) { $state = 'QUERY_FAILED' }
Write-Log "[5/8] 상태 분류: $state"
switch ($state) {
    'SAME'     { Finish '[5/8] 이미 최신(로컬 = 원격) — 복구할 것이 없다' 0 }
    'BEHIND'   { Finish "[5/8] 로컬이 뒤처짐(fast-forward 가능, 원격에만 있는 커밋 $behindN) — 다음 사이클이 스스로 반영한다. 복구 도구가 할 일 없음" 0 }
    'AHEAD'    { Finish "[5/8] 로컬에 아직 push 되지 않은 커밋 $aheadN개(공통 조상 있음) — 다음 사이클이 push 한다. 복구 도구가 할 일 없음" 0 }
    'DIVERGED' { Finish '[5/8] 로컬/원격이 갈라졌지만 공통 조상이 있다 — 사이클이 rebase 로 처리한다(충돌이면 사이클 로그 exit 6 → 수동). 복구 도구가 할 일 없음' 0 }
    'QUERY_FAILED' { Finish "[5/8] merge-base 조회 실패(exit $($mbRes.Code)): $baseSha — 재작성인지 알 수 없어 아무것도 하지 않는다" 11 'ERROR' }
}

# ─────────────────────────────────────────────────────────────────────────────
# [6/8] 공통 조상 없음 = 원격 이력 재작성. 로컬 장부 포함성을 내용으로 판정한다.
# ─────────────────────────────────────────────────────────────────────────────
$inclusionModule = $null
$candidates = @((Join-Path $PSScriptRoot '..\paper_ledger_inclusion.py'), (Join-Path $RepoPath 'paper_ledger_inclusion.py'))
foreach ($c in $candidates) { if (Test-Path $c) { $inclusionModule = (Resolve-Path $c).Path; break } }
if (-not $inclusionModule) {
    $show = Invoke-GitStdout show "origin/${Branch}:paper_ledger_inclusion.py"
    if ($show.Code -eq 0 -and -not [string]::IsNullOrWhiteSpace($show.Output)) {
        $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("gaeo-paper-inclusion-" + [guid]::NewGuid().ToString('N') + ".py")
        try { [System.IO.File]::WriteAllText($tmp, $show.Output, (New-Object System.Text.UTF8Encoding($false))); $script:InclusionModuleTmp = $tmp; $inclusionModule = $tmp } catch { }
    }
}
if (-not $inclusionModule) { Finish "[6/8] 포함성 모듈(paper_ledger_inclusion.py)을 스크립트 폴더·작업트리·origin/$Branch 어디서도 찾지 못했다" 7 'ERROR' }
$checkArgs = @($inclusionModule, 'check', '--repo', $RepoPath, '--local', 'HEAD', '--remote', "origin/$Branch")
if ($Mode -eq 'check' -and $dirty.Count -gt 0) { $checkArgs += '--worktree' }
$incl = Invoke-Python @checkArgs
$inclCode = $incl.Code
# 판정 헤더가 없는 출력은 모듈 자체의 오류(traceback 등)다 — exit 1 이라도 NOT_COVERED 로 표기하지 않는다.
if ($inclCode -ne 0 -and -not ($incl.Output -like '*[장부 포함성]*')) { $inclCode = 2 }
$verdict = 'UNDETERMINED'
if ($inclCode -eq 0) { $verdict = 'COVERED' } elseif ($inclCode -eq 1) { $verdict = 'NOT_COVERED' }
Write-Log "[6/8] 원격 이력 재작성(공통 조상 없음) · 장부 포함성 판정: $verdict"
foreach ($l in ($incl.Output -split "`n")) { if (-not [string]::IsNullOrWhiteSpace($l)) { Write-Log "    $l" } }

# ─────────────────────────────────────────────────────────────────────────────
# [7/8] 계획(check) 또는 실행(apply)
# ─────────────────────────────────────────────────────────────────────────────
if ($verdict -ne 'COVERED') {
    if ($Mode -eq 'apply') {
        $label = 'unsent-' + (Get-KstNow).ToString('yyyyMMddTHHmmss')
        $bk = Invoke-Python $inclusionModule 'backup' '--repo' $RepoPath '--dest' $BackupDir '--label' $label '--not-ref' "origin/$Branch" '--json'
        if ($bk.Code -eq 0) {
            $unsentDir = Get-JsonDir $bk.Output
            if ([string]::IsNullOrWhiteSpace($unsentDir) -or -not (Test-Path $unsentDir)) {
                Write-Log "[7/8] 백업은 성공했다고 하는데 폴더 경로를 읽지 못했다: $($bk.Output)" 'ERROR'
            }
            else {
                $rep = Invoke-Python $inclusionModule 'check' '--repo' $RepoPath '--local' 'HEAD' '--remote' "origin/$Branch" '--json'
                $wrote = $true
                try { [System.IO.File]::WriteAllText((Join-Path $unsentDir 'inclusion.json'), $rep.Output, (New-Object System.Text.UTF8Encoding($false))) } catch { $wrote = $false }
                if ($wrote) { Write-Log "[7/8] 미전송 기록을 별도 보존했다(활성 장부는 그대로): $unsentDir (판정 파일 inclusion.json)" 'WARN' }
                else { Write-Log "[7/8] 미전송 기록은 $unsentDir 에 보존했지만 판정 파일(inclusion.json)은 쓰지 못했다" 'ERROR' }
            }
        }
        else { Write-Log "[7/8] 미전송 기록 별도 보존 실패: $($bk.Output) — 활성 장부는 그대로다" 'ERROR' }
    }
    Finish "[7/8] 로컬 장부가 원격에 전부 들어 있음을 증명하지 못했다(판정 $verdict) — 재기준하지 않는다. 위 판정 줄의 파일·거래 ID 를 사람이 확인해야 한다(docs/PAPER_TRADING_LOCAL_RUNNER.md 9절)" 11 'ERROR'
}

if ($Mode -eq 'check') {
    Write-Log "[7/8] 계획(apply 모드에서 할 일): ① 백업 $BackupDir\prerepoint-<시각>\ (paper_trading 복사 + 옛 HEAD bundle + manifest, 검증) → ② 옛 HEAD $localSha 를 refs/gaeo-backup/head-<시각> 에 보존 → ③ git checkout -B $Branch origin/$Branch ($remoteSha) → ④ 검증(HEAD=원격·작업트리 깨끗)"
    if ($dirty.Count -gt 0) { Write-Log "[7/8] (먼저 미커밋 Paper 산출물 $($dirty.Count)개를 복구 커밋으로 보존한 뒤 위 순서)" 'WARN' }
    Finish "[7/8] 재기준 가능 — 로컬 장부가 원격에 전부 포함됨이 내용으로 증명됐다. 실행: powershell -ExecutionPolicy Bypass -File scripts\paper_recover.ps1 -Mode apply" 10
}

# apply
$label = 'prerepoint-' + (Get-KstNow).ToString('yyyyMMddTHHmmss')
$bk = Invoke-Python $inclusionModule 'backup' '--repo' $RepoPath '--dest' $BackupDir '--label' $label '--not-ref' "origin/$Branch" '--json'
if ($bk.Code -ne 0) { Finish "[7/8] 재기준 전 백업 실패(백업 폴더 $BackupDir): $($bk.Output) — 재기준하지 않았다" 6 'ERROR' }
$backupTarget = Get-JsonDir $bk.Output
$vb = Invoke-Python $inclusionModule 'verify-backup' '--dir' $backupTarget
if ($vb.Code -ne 0) { Finish "[7/8] 백업 재검증 실패: $backupTarget — 재기준하지 않았다" 6 'ERROR' }
Write-Log "[7/8] 백업 완료·검증 통과: $backupTarget"
$backupRef = "refs/gaeo-backup/head-$((Get-KstNow).ToString('yyyyMMddTHHmmss'))"
$b = Invoke-Git update-ref $backupRef HEAD
if ($b.Code -ne 0) { Finish "[7/8] 옛 HEAD 보존(update-ref) 실패: $($b.Output) — 재기준하지 않았다" 6 'ERROR' }
$co = Invoke-Git checkout -B $Branch "origin/$Branch"
if ($co.Code -ne 0) { Finish "[7/8] 재기준(checkout -B) 실패: $($co.Output) (옛 HEAD 는 $backupRef 와 $backupTarget 에 있다)" 6 'ERROR' }
$headNew = (Invoke-Git rev-parse HEAD).Output
$statusAfter = (Invoke-Git status --porcelain).Output
if ($headNew -ne $remoteSha) { Finish "[7/8] 재기준 뒤 HEAD($headNew)가 원격($remoteSha)과 다르다 — 수동 확인" 6 'ERROR' }
if (-not [string]::IsNullOrWhiteSpace($statusAfter)) { Finish "[7/8] 재기준 뒤 작업트리가 깨끗하지 않다: $statusAfter — 수동 확인" 6 'ERROR' }
Write-Log "[7/8] 재기준 완료: HEAD $localSha → $headNew (옛 HEAD 보존 $backupRef · 백업 $backupTarget · 복구 커밋 $recovered)"

# ─────────────────────────────────────────────────────────────────────────────
# [8/8] 결과 보고 (계좌별) · 선택: 사이클 1회 기동(작업 스케줄러 → 부트스트랩 → 인증정보 포함)
# ─────────────────────────────────────────────────────────────────────────────
Write-Log '[8/8] 재기준 뒤 장부(계좌별):'
$sm = Invoke-Python $inclusionModule 'summary' '--repo' $RepoPath
foreach ($l in ($sm.Output -split "`n")) { if (-not [string]::IsNullOrWhiteSpace($l)) { Write-Log "  $l" } }
if ($RunCycle) {
    Release-All   # 사이클이 같은 뮤텍스를 쓰므로 먼저 놓는다
    $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
    if ($task) {
        $todayLog = Join-Path $LogDir ("paper-" + (Get-KstNow).ToString('yyyy-MM-dd') + ".log")
        $before = 0; if (Test-Path $todayLog) { $before = (Get-Content $todayLog -ErrorAction SilentlyContinue | Measure-Object -Line).Lines }
        Start-ScheduledTask -TaskName $TaskName
        Write-Log "[8/8] 작업 스케줄러 '$TaskName' 기동 요청 — 최대 ${CycleWaitSeconds}초 동안 오늘 로그($todayLog)에서 '최종 exit code' 를 기다린다"
        $deadline = (Get-Date).AddSeconds($CycleWaitSeconds); $done = $false
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Seconds 5
            if (Test-Path $todayLog) {
                $tail = @(Get-Content $todayLog -ErrorAction SilentlyContinue | Select-Object -Skip $before)
                $hit = @($tail | Where-Object { $_ -match '최종 exit code: (\d+)' })
                if ($hit.Count -gt 0) { $done = $true; foreach ($l in $tail) { Write-Log "    사이클 | $l" }; break }
            }
        }
        if (-not $done) { Write-Log "[8/8] ${CycleWaitSeconds}초 안에 사이클 종료 줄을 못 봤다 — 로그를 직접 확인: $todayLog" 'WARN' }
    }
    else { Write-Log "[8/8] 작업 스케줄러에 '$TaskName' 이 없어 사이클을 자동 기동하지 않았다 — 작업 스케줄러에서 직접 실행" 'WARN' }
}
Finish '[8/8] 복구 완료(러너 저장소 재기준). 실제 매매 기록은 다음 정상 사이클이 만든다 — 과거 날짜 거래를 만들어 넣지 않는다' 0
