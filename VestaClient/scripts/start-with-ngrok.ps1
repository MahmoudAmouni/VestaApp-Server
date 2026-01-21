
# Script to start ngrok and Expo properly
Write-Host "Starting Ngrok tunnel..." -ForegroundColor Cyan

# Determine path to ngrok
$localNgrok = ".\node_modules\.bin\ngrok.cmd"
$ngrokCmd = if (Test-Path $localNgrok) { $localNgrok } else { "ngrok" }

# Check if ngrok is already running to avoid multiple instances
if (!(Get-Process ngrok -ErrorAction SilentlyContinue)) {
    Start-Process $ngrokCmd -ArgumentList "http 8000" -WindowStyle Minimized
}

# Wait for ngrok to initialize and get the public URL
$maxRetries = 10
$retryCount = 0
$publicUrl = $null

while ($retryCount -lt $maxRetries) {
    try {
        $ngrokTunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -ErrorAction Stop
        $publicUrl = $ngrokTunnels.tunnels[0].public_url
        
        if ($publicUrl) {
            break
        }
    }
    catch {
        Write-Host "Waiting for ngrok tunnel... ($($retryCount + 1)/$maxRetries)" -ForegroundColor DarkGray
    }
    
    Start-Sleep -Seconds 2
    $retryCount++
}

try {
    if (-not $publicUrl) {
        throw "No tunnel found after waiting."
    }

    Write-Host "Tunnel established at: $publicUrl" -ForegroundColor Green
    
    # Set the environment variable for the current process
    $env:EXPO_PUBLIC_API_URL = $publicUrl
    
    # Start Expo
    Write-Host "Starting Expo..." -ForegroundColor Cyan
    npx expo start
}
catch {
    Write-Host "Error: Could not retrieve ngrok URL. Make sure ngrok is installed and running." -ForegroundColor Red
    Write-Host $_
}
