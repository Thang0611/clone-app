# Hướng dẫn SSH không cần mật khẩu

## Trên Server (Đã hoàn thành ✓)
- ✓ Public key đã có trong ~/.ssh/authorized_keys
- ✓ Permissions đã đúng (700 cho ~/.ssh, 600 cho authorized_keys)
- ✓ Private key đã có trong ~/.ssh/id_ed25519

## Trên Máy Local (Client)

Bạn có 2 cách:

### Cách 1: Copy private key từ server về máy local

**Bước 1:** Copy private key từ server về máy local
```bash
# Trên máy local, chạy lệnh này để copy key từ server
scp root@YOUR_SERVER_IP:/root/.ssh/id_ed25519 ~/.ssh/id_ed25519_server
chmod 600 ~/.ssh/id_ed25519_server
```

**Bước 2:** Tạo file SSH config để tự động dùng key này
```bash
# Tạo hoặc sửa file ~/.ssh/config
cat >> ~/.ssh/config << EOF
Host myserver
    HostName YOUR_SERVER_IP
    User root
    IdentityFile ~/.ssh/id_ed25519_server
    IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

**Bước 3:** SSH vào server
```bash
ssh myserver
```

### Cách 2: Tạo key mới trên máy local (Khuyến nghị)

**Bước 1:** Tạo SSH key mới trên máy local (nếu chưa có)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Nhấn Enter để dùng đường dẫn mặc định
# Có thể đặt passphrase hoặc để trống
```

**Bước 2:** Copy public key lên server
```bash
ssh-copy-id root@YOUR_SERVER_IP
```

**Bước 3:** Thử SSH vào server (không cần mật khẩu)
```bash
ssh root@YOUR_SERVER_IP
```

## Kiểm tra

Để kiểm tra xem SSH key có hoạt động không:
```bash
ssh -v root@YOUR_SERVER_IP
```

Nếu thấy dòng:
```
debug1: Authentication succeeded (publickey)
```
Thì đã thành công!

## Public key hiện tại trên server:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILANaTqzf80hCusCsQGHOU/3ltYAFr8jU7HhARi4uF6y Nguyenhuuthanga3@gmail.com
```
