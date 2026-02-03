# Hướng dẫn SSH không cần mật khẩu trên Windows

## Cách 1: Dùng OpenSSH trên Windows (Khuyến nghị - Windows 10/11)

### Bước 1: Kiểm tra OpenSSH có sẵn chưa
Mở **PowerShell** hoặc **Command Prompt** và chạy:
```powershell
ssh -V
```

Nếu không có, cài đặt qua Settings > Apps > Optional Features > Add OpenSSH Client

### Bước 2: Tạo SSH key trên Windows
Mở **PowerShell** hoặc **Command Prompt** và chạy:

```powershell
# Tạo thư mục .ssh nếu chưa có
mkdir $env:USERPROFILE\.ssh -Force

# Tạo SSH key mới (khuyến nghị)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Hoặc dùng RSA:
# ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Nhấn Enter để dùng đường dẫn mặc định: C:\Users\YourUsername\.ssh\id_ed25519
# Có thể đặt passphrase hoặc Enter để bỏ qua
```

### Bước 3: Copy public key lên server
Sau khi tạo key, copy public key lên server:

```powershell
# Cách 1: Dùng ssh-copy-id (nếu có)
ssh-copy-id root@YOUR_SERVER_IP

# Cách 2: Copy thủ công (nếu ssh-copy-id không có)
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh root@YOUR_SERVER_IP "cat >> ~/.ssh/authorized_keys"

# Cách 3: Copy thủ công bằng nhiều bước
# Bước 3.1: Hiển thị public key
type $env:USERPROFILE\.ssh\id_ed25519.pub
# Copy toàn bộ nội dung (từ ssh-ed25519 đến ...email)

# Bước 3.2: SSH vào server và thêm key vào authorized_keys
ssh root@YOUR_SERVER_IP
# Trên server, chạy:
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit
```

### Bước 4: Tạo SSH config để dễ dùng hơn
Tạo file config trong Windows:

```powershell
# Tạo file config
New-Item -Path $env:USERPROFILE\.ssh\config -ItemType File -Force

# Thêm nội dung vào config (thay YOUR_SERVER_IP bằng IP thật)
@"
Host myserver
    HostName YOUR_SERVER_IP
    User root
    IdentityFile $env:USERPROFILE\.ssh\id_ed25519
    IdentitiesOnly yes
"@ | Out-File -FilePath $env:USERPROFILE\.ssh\config -Encoding utf8
```

**Lưu ý:** Trên Windows, đường dẫn trong config phải dùng dấu gạch chéo `/` hoặc dấu backslash `\` kép `\\`

### Bước 5: SSH vào server (không cần mật khẩu)
```powershell
# Dùng alias
ssh myserver

# Hoặc dùng IP trực tiếp
ssh root@YOUR_SERVER_IP
```

---

## Cách 2: Copy private key từ server về Windows

### Bước 1: Copy private key từ server về Windows

**Trên Windows, mở PowerShell và chạy:**
```powershell
# Tạo thư mục .ssh nếu chưa có
mkdir $env:USERPROFILE\.ssh -Force

# Copy private key từ server về (thay YOUR_SERVER_IP)
scp root@YOUR_SERVER_IP:/root/.ssh/id_ed25519 $env:USERPROFILE\.ssh\id_ed25519_server

# Đặt permissions (Windows không cần chmod nhưng vẫn an toàn)
icacls $env:USERPROFILE\.ssh\id_ed25519_server /inheritance:r /grant:r "$env:USERNAME:(R)"
```

### Bước 2: Tạo SSH config
```powershell
# Tạo hoặc thêm vào config
@"
Host myserver
    HostName YOUR_SERVER_IP
    User root
    IdentityFile $env:USERPROFILE\.ssh\id_ed25519_server
    IdentitiesOnly yes
"@ | Add-Content -Path $env:USERPROFILE\.ssh\config
```

### Bước 3: SSH vào server
```powershell
ssh myserver
# hoặc
ssh -i $env:USERPROFILE\.ssh\id_ed25519_server root@YOUR_SERVER_IP
```

---

## Cách 3: Dùng Git Bash (Nếu đã cài Git for Windows)

Nếu bạn đã cài Git for Windows, có thể dùng Git Bash với các lệnh Linux quen thuộc:

1. Mở **Git Bash**
2. Dùng các lệnh giống như Linux:
```bash
# Tạo key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy key lên server
ssh-copy-id root@YOUR_SERVER_IP

# Hoặc copy thủ công
cat ~/.ssh/id_ed25519.pub | ssh root@YOUR_SERVER_IP "cat >> ~/.ssh/authorized_keys"
```

3. Tạo config:
```bash
cat >> ~/.ssh/config << EOF
Host myserver
    HostName YOUR_SERVER_IP
    User root
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

---

## Cách 4: Dùng WSL (Windows Subsystem for Linux)

Nếu bạn có WSL, có thể dùng như Linux bình thường:

1. Mở **WSL** (Ubuntu/Debian/etc)
2. Dùng các lệnh Linux như bình thường
3. SSH key sẽ được lưu trong WSL filesystem: `~/.ssh/`

---

## Kiểm tra kết nối

Sau khi thiết lập, kiểm tra bằng cách:

```powershell
# Với verbose để xem chi tiết
ssh -v root@YOUR_SERVER_IP
```

Nếu thấy dòng:
```
debug1: Authentication succeeded (publickey).
```
Thì đã thành công!

---

## Đường dẫn SSH trên Windows

- SSH keys: `C:\Users\YourUsername\.ssh\`
- Config: `C:\Users\YourUsername\.ssh\config`
- Public key: `C:\Users\YourUsername\.ssh\id_ed25519.pub`
- Private key: `C:\Users\YourUsername\.ssh\id_ed25519`

**Trong PowerShell, dùng:** `$env:USERPROFILE\.ssh\`
**Trong CMD, dùng:** `%USERPROFILE%\.ssh\`

---

## Khắc phục lỗi thường gặp

### Lỗi: "Permission denied (publickey)"
- Kiểm tra public key đã có trong `~/.ssh/authorized_keys` trên server chưa
- Kiểm tra permissions: `~/.ssh` phải là 700, `authorized_keys` phải là 600

### Lỗi: "Bad permissions"
- Trên Windows, dùng `icacls` để sửa permissions:
```powershell
icacls $env:USERPROFILE\.ssh /inheritance:r
icacls $env:USERPROFILE\.ssh /grant:r "$env:USERNAME:(F)"
icacls $env:USERPROFILE\.ssh\* /inheritance:r
icacls $env:USERPROFILE\.ssh\* /grant:r "$env:USERNAME:(F)"
```

### Lỗi: Config file không hoạt động
- Kiểm tra đường dẫn trong config phải đúng
- Trên Windows, dùng đường dẫn đầy đủ hoặc dấu `/` thay vì `\`
