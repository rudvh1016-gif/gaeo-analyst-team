<#
  GAEO Paper Doctor — 모의투자 러너가 왜 안 도는지 진단한다.

  쓰는 법 (PowerShell 창에서):
      powershell -ExecutionPolicy Bypass -File scripts\paper_doctor.ps1

  이 스크립트는 읽기 전용이다. 아무것도 고치지 않고 무엇이 잘못됐는지만 알려준다.
  Secret 값은 어디에도 출력하지 않는다(있는지 없는지만 본다).
#>

[CmdletBinding()]
param(
    [string]$TaskName = 'GAEO Paper Trading'
)

$ErrorActionPreference = 'Continue'
$GaeoRoot   = Join-Path $env:LOCALAPPDATA 'GAEO'
$Bootstrap  = Join-Path $GaeoRoot 'run-paper.ps1'
$RunnerRepo = Join-Path $GaeoRoot 'paper-runner\repo'
$LogDir     = Join-Path $GaeoRoot 'logs'

$problems = @()
$oks      = @()

function Say([string]$t, [string]$c = 'Gray') { Write-Host $t -ForegroundColor $c }

Say ''
Say '===== GAEO 모의투자 러너 진단 =====' 'Cyan'
Say ''

# 1) 작업 스케줄러 --------------------------------------------------------------
$task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if (-not $task) {
    $problems += "작업 스케줄러에 '$TaskName' 작업이 없습니다. 러너가 아예 등록돼 있지 않습니다."
    Say "[X] 예약 작업 없음: $TaskName" 'Red'
} else {
    Say "[O] 예약 작업 있음: $TaskName (상태: $($task.State))" 'Green'
    $oks += '예약 작업 존재'

    # 1-a) 무엇을 실행하는가 — 부트스트랩이어야 한다
    $acts = @($task.Actions)
    $cmdline = ($acts | ForEach-Object { "$($_.Execute) $($_.Arguments)" }) -join ' | '
    Say "     실행 대상: $cmdline" 'DarkGray'
    if ($cmdline -match 'run-paper\.ps1') {
        Say '[O] 부트스트랩(run-paper.ps1)을 실행합니다 = 정상' 'Green'
        $oks += '부트스트랩 경유'
    } elseif ($cmdline -match 'paper_cycle\.ps1') {
        $problems += @'
작업이 부트스트랩을 건너뛰고 paper_cycle.ps1을 직접 실행하고 있습니다.
   → paper_cycle.ps1에는 토스 인증정보가 없습니다. 부트스트랩(run-paper.ps1)이
     인증정보를 넣어주는 역할인데 그걸 건너뛰어서 시세를 못 받는 것입니다.
   → [고치는 법] 작업 스케줄러 > GAEO Paper Trading > 속성 > 동작 > 편집에서
     프로그램을 powershell.exe, 인수를 다음으로 바꾸세요:
     -ExecutionPolicy Bypass -File "%LOCALAPPDATA%\GAEO\run-paper.ps1"
'@
        Say '[X] paper_cycle.ps1을 직접 실행 = 인증정보 없이 도는 상태' 'Red'
    } else {
        $problems += "작업이 예상과 다른 것을 실행합니다: $cmdline"
        Say '[?] 실행 대상이 예상과 다릅니다' 'Yellow'
    }

    # 1-b) 로그온 방식 — DPAPI 복호화에 결정적
    # 주의: 같은 설정을 Task Scheduler XML은 'InteractiveToken', PowerShell API는 'Interactive'로
    # 부른다(PowerShell enum에는 'InteractiveToken'이라는 값이 아예 없다). 둘 다 정상으로 본다.
    $lt = "$($task.Principal.LogonType)"
    Say "     로그온 방식: $lt" 'DarkGray'
    if ($lt -eq 'Interactive' -or $lt -eq 'InteractiveToken') {
        Say '[O] "사용자가 로그온할 때만 실행" = 정상' 'Green'
        $oks += '로그온 방식 정상'
    } else {
        $problems += @"
작업의 로그온 방식이 '$lt' 입니다(정상값: InteractiveToken).
   → 이 상태면 Windows가 저장된 인증정보를 풀지 못해 토스 키를 읽을 수 없습니다.
   → [고치는 법] 작업 스케줄러 > GAEO Paper Trading > 속성 > 일반 탭에서
     "사용자가 로그온할 때만 실행"을 선택하고 확인을 누르세요.
"@
        Say "[X] 로그온 방식이 '$lt' = 인증정보 복호화 실패 원인" 'Red'
    }

    if ($task.State -eq 'Disabled') {
        $problems += '작업이 사용 안 함(Disabled) 상태입니다. 작업을 마우스 오른쪽 > 사용으로 켜세요.'
        Say '[X] 작업이 꺼져 있습니다' 'Red'
    }
}

# 2) 부트스트랩 파일 ------------------------------------------------------------
if (Test-Path $Bootstrap) {
    Say "[O] 부트스트랩 파일 있음: $Bootstrap" 'Green'
    $oks += '부트스트랩 파일 존재'
} else {
    $problems += @"
부트스트랩 파일이 없습니다: $Bootstrap
   → 이 파일이 토스 인증정보를 안전하게 보관하고 넘겨주는 역할입니다.
   → 파일이 사라졌다면 최초 설치 절차를 다시 해야 합니다
     (docs/PAPER_TRADING_LOCAL_RUNNER.md 참고).
"@
    Say "[X] 부트스트랩 파일 없음: $Bootstrap" 'Red'
}

# 2-b) credential 파일 — 부트스트랩과 같은 방식으로 실제로 읽어본다 (값은 절대 출력하지 않음)
Add-Type -AssemblyName System.Security
$SecretDir = Join-Path $GaeoRoot 'secrets'
foreach ($credName in 'toss_client_id', 'toss_client_secret') {
    $credPath = Join-Path $SecretDir "$credName.dpapi"
    if (-not (Test-Path $credPath)) {
        $problems += "credential 파일이 없습니다: $credPath — 토스 키가 등록돼 있지 않습니다."
        Say "[X] credential 파일 없음: $credName" 'Red'
        continue
    }
    try {
        $credBytes = [System.IO.File]::ReadAllBytes($credPath)
        if ($credBytes.Length -ge 4 -and $credBytes[0] -eq 1 -and $credBytes[1] -eq 0 -and $credBytes[2] -eq 0 -and $credBytes[3] -eq 0) {
            # GAEO Gateway 형식 (원시 DPAPI blob + entropy)
            $credEntropy = [System.Text.Encoding]::UTF8.GetBytes('GAEO-Gateway-v1')
            $credPlain = [System.Security.Cryptography.ProtectedData]::Unprotect(
                $credBytes, $credEntropy, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
            [Array]::Clear($credPlain, 0, $credPlain.Length)
        } else {
            # 구 형식 (ConvertFrom-SecureString 16진 텍스트)
            $null = [System.IO.File]::ReadAllText($credPath).Trim() | ConvertTo-SecureString -ErrorAction Stop
        }
        Say "[O] credential 읽기 가능: $credName" 'Green'
        $oks += "credential 읽기 가능($credName)"
    } catch {
        $problems += @"
credential 파일을 읽지 못했습니다: $credPath
   → 파일은 있지만 이 Windows 사용자로 복호화되지 않거나, 형식이 러너가 아는 두 방식이 아닙니다.
   → 다른 사용자/PC에서 만든 파일이거나, 다른 도구가 다른 형식으로 덮어쓴 경우입니다.
     (오류 종류: $(if ($_.Exception.InnerException) { $_.Exception.InnerException.GetType().Name } else { $_.Exception.GetType().Name }))
"@
        Say "[X] credential 읽기 실패: $credName" 'Red'
    }
}

# 3) 러너 전용 저장소 ------------------------------------------------------------
$marker = Join-Path (Split-Path $RunnerRepo -Parent) '.gaeo-paper-runner'
if (Test-Path $RunnerRepo) {
    Say "[O] 러너 저장소 있음: $RunnerRepo" 'Green'
    if (Test-Path $marker) { Say '[O] 러너 마커 있음' 'Green'; $oks += '러너 저장소 정상' }
    else {
        $problems += "러너 마커(.gaeo-paper-runner)가 없습니다. 사이클이 실행을 거부합니다: $marker"
        Say '[X] 러너 마커 없음' 'Red'
    }
} else {
    $problems += "러너 저장소가 없습니다: $RunnerRepo (첫 실행 때 자동 clone 되지만, 계속 없으면 설치 확인 필요)"
    Say "[!] 러너 저장소 없음: $RunnerRepo" 'Yellow'
}

# 4) 최근 로그에서 실패 사유 -----------------------------------------------------
if (Test-Path $LogDir) {
    $log = Get-ChildItem $LogDir -Filter 'paper-*.log' -ErrorAction SilentlyContinue |
           Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($log) {
        Say ''
        Say "최근 로그: $($log.FullName)  ($($log.LastWriteTime))" 'Cyan'
        $tail = Get-Content $log.FullName -Tail 40 -ErrorAction SilentlyContinue
        $hit = $tail | Where-Object { $_ -match 'TOSS_MARKET_DATA_UNAVAILABLE|credential|HTTP 40[13]|CYCLE_OK|ERROR|실패' }
        if ($hit) { $hit | Select-Object -Last 8 | ForEach-Object { Say "   $_" 'DarkGray' } }
        else { $tail | Select-Object -Last 5 | ForEach-Object { Say "   $_" 'DarkGray' } }
    } else { Say '[!] 로그 파일이 없습니다.' 'Yellow' }
} else { Say "[!] 로그 폴더가 없습니다: $LogDir" 'Yellow' }

# 5) 마지막 사이클 결과 ----------------------------------------------------------
$stateFile = Join-Path $RunnerRepo 'paper_trading\state.json'
if (Test-Path $stateFile) {
    try {
        $st = Get-Content $stateFile -Raw -Encoding UTF8 | ConvertFrom-Json
        Say ''
        Say "마지막 시도: $($st.lastCycleAt)" 'Cyan'
        Say "마지막 결과: $($st.lastCycleResult)" 'Cyan'
        if ("$($st.lastCycleResult)" -like 'CYCLE_OK*') {
            Say '[O] 마지막 사이클은 성공했습니다.' 'Green'; $oks += '마지막 사이클 성공'
        } else {
            $problems += "마지막 사이클이 실패로 끝났습니다: $($st.lastCycleResult)"
        }
    } catch { Say '[!] state.json을 읽지 못했습니다.' 'Yellow' }
}

# 6) 결론 ------------------------------------------------------------------------
Say ''
Say '===== 진단 결과 =====' 'Cyan'
if ($problems.Count -eq 0) {
    Say '문제를 찾지 못했습니다. 러너 설정은 정상으로 보입니다.' 'Green'
    Say '그래도 기록이 안 쌓이면 토스 개발자 콘솔의 허용 IP가 현재 공인 IP와 맞는지 확인하세요.' 'Yellow'
} else {
    Say "고쳐야 할 것 $($problems.Count)건:" 'Red'
    $i = 1
    foreach ($p in $problems) { Say ''; Say "[$i] $p" 'White'; $i++ }
    Say ''
    Say '위 항목을 고친 뒤, 작업 스케줄러에서 GAEO Paper Trading을 마우스 오른쪽 > 실행 으로' 'Yellow'
    Say '한 번 돌려보고 이 스크립트를 다시 실행하세요.' 'Yellow'
}
Say ''
