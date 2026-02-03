# Script tự động thiết lập SSH không cần mật khẩu trên Windows
# Chạy script này trong PowerShell với quyền Administrator (nếu cần)

Write-Host "=== Thiết lập SSH không cần mật khẩu trên Windows ===" -ForegroundColor Green
Write-Host ""

# Kiểm tra OpenSSH
Write-Host "[1/5] Kiểm tra OpenSSH..." -ForegroundColor Yellow
try {
    $sshVersion = ssh -V 2>&1
    Write-Host "✓ OpenSSH đã có: $sshVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ OpenSSH chưa được cài đặt" -ForegroundColor Red
    Write-Host "  Vui lòng cài đặt OpenSSH Client qua Settings > Apps > Optional Features" -ForegroundColor Yellow
    exit 1
}

# Tạo thư mục .ssh
Write-Host ""
Write-Host "[2/5] Tạo thư mục .ssh..." -ForegroundColor Yellow
$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -Path $sshDir -ItemType Directory -Force | Out-Null
    Write-Host "✓ Đã tạo thư mục: $sshDir" -ForegroundColor Green
} else {
    Write-Host "✓ Thư mục đã tồn tại: $sshDir" -ForegroundColor Green
}

# Đặt permissions cho thư mục .ssh
Write-Host ""
Write-Host "[3/5] Đặt permissions cho .ssh..." -ForegroundColor Yellow
try {
    icacls $sshDir /inheritance:r /grant:r "$env:USERNAME:(F)" 2>&1 | Out-Null
    Write-Host "✓ Permissions đã được đặt" -ForegroundColor Green
} catch {
    Write-Host "⚠ Không thể đặt permissions (có thể cần chạy với quyền Administrator)" -ForegroundColor Yellow
}

# Kiểm tra hoặc tạo SSH key
Write-Host ""
Write-Host "[4/5] Kiểm tra SSH key..." -ForegroundColor Yellow
$privateKeyPath = "$sshDir\id_ed25519"
$publicKeyPath = "$sshDir\id_ed25519.pub"

if (Test-Path $privateKeyPath) {
    Write-Host "✓ SSH key đã tồn tại: $privateKeyPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Public key của bạn:" -ForegroundColor Cyan
    Get-Content $publicKeyPath
} else {
    Write-Host "⚠ SSH key chưa tồn tại" -ForegroundColor Yellow
    Write-Host "  Bạn có muốn tạo SSH key mới không? (Y/N)" -ForegroundColor Yellow
    $createKey = Read-Host
    if ($createKey -eq "Y" -or $createKey -eq "y") {
        Write-Host ""
        Write-Host "Tạo SSH key mới..." -ForegroundColor Yellow
        ssh-keygen -t ed25519 -C "$env:USERNAME@$env:COMPUTERNAME"
        Write-Host ""
        Write-Host "✓ SSH key đã được tạo!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Public key của bạn:" -ForegroundColor Cyan
        Get-Content $publicKeyPath
    }
}

# Tạo hoặc cập nhật SSH config
Write-Host ""
Write-Host "[5/5] Cấu hình SSH config..." -ForegroundColor Yellow
Write-Host "Nhập địa chỉ IP hoặc domain của server (ví dụ: 192.168.1.100):" -ForegroundColor Yellow
$serverIP = Read-Host "Server IP"
Write-Host "Nhập username trên server (mặc định: root):" -ForegroundColor Yellow
$serverUser = Read-Host "Username" 
if ([string]::IsNullOrWhiteSpace($serverUser)) {
    $serverUser = "root"
}

Write-Host ""
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
    IdentityFile $sshDir\id_ed25519
    IdentitiesOnly yes

"@

if (Test-Path $configPath) {
    # Kiểm tra xem host đã tồn tại chưa
    $existingConfig = Get-Content $configPath -Raw
    if ($existingConfig -match "Host $aliasName") {
        Write-Host "⚠ Host '$aliasName' đã tồn tại trong config" -ForegroundColor Yellow
        Write-Host "  Bạn có muốn ghi đè không? (Y/N)" -ForegroundColor Yellow
        $overwrite = Read-Host
        if ($overwrite -eq "Y" -or $overwrite -eq "y") {
            # Xóa host cũ
            $lines = Get-Content $configPath
            $newLines = @()
            $skip = $false
            foreach ($line in $lines) {
                if ($line -match "^Host $aliasName$") {
                    $skip = $true
                } elseif ($skip -and ($line -match "^Host ")) {
                    $skip = $false
                    $newLines += $line
                } elseif (-not $skip) {
                    $newLines += $line
                }
            }
            $newLines | Set-Content $configPath
            Add-Content -Path $configPath -Value $configContent
        }
    } else {
        Add-Content -Path $configPath -Value $configContent
    }
} else {
    Set-Content -Path $configPath -Value $configContent
}

Write-Host ""
Write-Host "✓ SSH config đã được tạo/cập nhật" -ForegroundColor Green

# Hướng dẫn copy public key
Write-Host ""
Write-Host "=== BƯỚC TIẾP THEO ===" -ForegroundColor Green
Write-Host ""
Write-Host "Bây giờ bạn cần copy public key lên server:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Cách 1: Dùng ssh-copy-id (nếu có)" -ForegroundColor Cyan
Write-Host "  ssh-copy-id $serverUser@$serverIP" -ForegroundColor White
Write-Host ""
Write-Host "Cách 2: Copy thủ công" -ForegroundColor Cyan
Write-Host "  type $publicKeyPath | ssh $serverUser@$serverIP `"cat >> ~/.ssh/authorized_keys`"" -ForegroundColor White
Write-Host ""
Write-Host "Cách 3: Copy key này và paste vào server:" -ForegroundColor Cyan
Get-Content $publicKeyPath
Write-Host ""
Write-Host "Sau đó trên server, chạy:" -ForegroundColor Yellow
Write-Host "  echo 'PASTE_KEY_HERE' >> ~/.ssh/authorized_keys" -ForegroundColor White
Write-Host "  chmod 600 ~/.ssh/authorized_keys" -ForegroundColor White
Write-Host ""
Write-Host "Sau khi copy key, bạn có thể SSH bằng:" -ForegroundColor Green
Write-Host "  ssh $aliasName" -ForegroundColor Cyan
Write-Host "  hoặc" -ForegroundColor White
Write-Host "  ssh $serverUser@$serverIP" -ForegroundColor Cyan
