# Script để copy private key từ server về Windows
# Chạy script này trên Windows (PowerShell)

Write-Host "=== Copy SSH Private Key từ Server về Windows ===" -ForegroundColor Green
Write-Host ""

# Nhập thông tin server
Write-Host "Nhập địa chỉ IP hoặc domain của server:" -ForegroundColor Yellow
$serverIP = Read-Host "Server IP"
Write-Host "Nhập username trên server (mặc định: root):" -ForegroundColor Yellow
$serverUser = Read-Host "Username"
if ([string]::IsNullOrWhiteSpace($serverUser)) {
    $serverUser = "root"
}

# Tạo thư mục .ssh
$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -Path $sshDir -ItemType Directory -Force | Out-Null
    Write-Host "✓ Đã tạo thư mục: $sshDir" -ForegroundColor Green
}

# Copy private key từ server
$localKeyPath = "$sshDir\id_ed25519_server"
Write-Host ""
Write-Host "Đang copy private key từ server..." -ForegroundColor Yellow
Write-Host "Lần đầu sẽ yêu cầu nhập mật khẩu của server" -ForegroundColor Yellow
Write-Host ""

try {
    scp "${serverUser}@${serverIP}:/root/.ssh/id_ed25519" $localKeyPath
    Write-Host ""
    Write-Host "✓ Đã copy private key về: $localKeyPath" -ForegroundColor Green
    
    # Đặt permissions
    Write-Host ""
    Write-Host "Đặt permissions cho private key..." -ForegroundColor Yellow
    icacls $localKeyPath /inheritance:r /grant:r "$env:USERNAME:(R)" 2>&1 | Out-Null
    Write-Host "✓ Permissions đã được đặt" -ForegroundColor Green
    
    # Tạo SSH config
    Write-Host ""
    Write-Host "Tạo SSH config..." -ForegroundColor Yellow
    Write-Host "Nhập tên alias cho server này (ví dụ: myserver):" -ForegroundColor Yellow
    $aliasName = Read-Host "Alias"
    if ([string]::IsNullOrWhiteSpace($aliasName)) {
        $aliasName = "myserver"
    }
    
    $configPath = "$sshDir\config"
    $configContent = @"
Host $aliasName
    HostName $serverIP
    User $serverUser
    IdentityFile $localKeyPath
    IdentitiesOnly yes

"@
    
    if (Test-Path $configPath) {
        Add-Content -Path $configPath -Value $configContent
    } else {
        Set-Content -Path $configPath -Value $configContent
    }
    
    Write-Host "✓ SSH config đã được tạo" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Hoàn thành! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Bây giờ bạn có thể SSH vào server bằng:" -ForegroundColor Cyan
    Write-Host "  ssh $aliasName" -ForegroundColor White
    Write-Host "  hoặc" -ForegroundColor White
    Write-Host "  ssh -i $localKeyPath $serverUser@$serverIP" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "✗ Lỗi khi copy key: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Bạn có thể copy thủ công bằng cách:" -ForegroundColor Yellow
    Write-Host "1. SSH vào server và hiển thị private key:" -ForegroundColor White
    Write-Host "   ssh $serverUser@$serverIP" -ForegroundColor Cyan
    Write-Host "   cat ~/.ssh/id_ed25519" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Copy toàn bộ nội dung (từ -----BEGIN đến -----END)" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Tạo file trên Windows: $localKeyPath" -ForegroundColor White
    Write-Host "   và paste nội dung vào" -ForegroundColor White
}
