. C:\Users\user2\Documents\WindowsPowerShell\profile.ps1
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$pythonExe = (Get-Command python.exe).Source
$monitorScript = Join-Path $PSScriptRoot 'monitor-site.py'
$principal = New-ScheduledTaskPrincipal -UserId 'DESKTOP-UDV0C7O\user2' -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 5) -MultipleInstances IgnoreNew
foreach ($kind in @('Daily', 'Weekly')) {
    $name = 'Kateiso-Site-' + $kind
    if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) { throw "Task already exists: $name. Inspect it before changing." }
    $extra = if ($kind -eq 'Weekly') { ' --weekly' } else { '' }
    $action = New-ScheduledTaskAction -Execute $pythonExe -Argument ('"' + $monitorScript + '"' + $extra) -WorkingDirectory $projectRoot
    $trigger = if ($kind -eq 'Weekly') { New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At '10:15' } else { New-ScheduledTaskTrigger -Daily -At '09:15' }
    $trigger.EndBoundary = '2027-01-10T00:00:00+08:00'
    Register-ScheduledTask -TaskName $name -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Bounded personal site integrity checks through 2027-01-09; no paid API calls.' | Out-Null
}
Start-ScheduledTask -TaskName 'Kateiso-Site-Daily'
$finalName = 'Kateiso-Site-Final-Report'
if (Get-ScheduledTask -TaskName $finalName -ErrorAction SilentlyContinue) { throw "Task already exists: $finalName" }
$finalAction = New-ScheduledTaskAction -Execute $pythonExe -Argument ('"' + $monitorScript + '" --final-report') -WorkingDirectory $projectRoot
$finalTrigger = New-ScheduledTaskTrigger -Once -At '2027-01-09T23:45:00'
Register-ScheduledTask -TaskName $finalName -Action $finalAction -Trigger $finalTrigger -Settings $settings -Principal $principal -Description 'Write the 90-day local outcome and gaps report; no ranking success presumed.' | Out-Null
