# 🚀 PM2 Auto-Start Setup - Hướng dẫn đầy đủ

## 📋 Mục tiêu

1. ✅ **Tối giản lệnh PM2** - Dùng script ngắn gọn thay vì lệnh dài
2. ✅ **Auto-start khi boot** - PM2 tự động start khi server khởi động lại

---

## 🔧 Setup Auto-Start PM2 khi boot

### Bước 1: Save PM2 process list hiện tại

```bash
cd /root/project/clone-app
pm2 save
```

**Lệnh này:** Lưu danh sách process hiện tại vào `~/.pm2/dump.pm2`

### Bước 2: Setup PM2 startup script

```bash
pm2 startup systemd -u root --hp /root
```

**Output sẽ hiện:**
```bash
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Chạy lệnh được output (với sudo):**
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Lệnh này sẽ:**
- Tạo systemd service file: `/etc/systemd/system/pm2-root.service`
- Enable service để auto-start khi boot
- Configure PATH để PM2 tìm được node binary

### Bước 3: Verify startup script

```bash
# Check service status
systemctl status pm2-root.service

# Check if enabled
systemctl is-enabled pm2-root.service
# Should output: enabled
```

### Bước 4: Test (tùy chọn)

```bash
# Restart systemd daemon (không cần reboot)
sudo systemctl daemon-reload

# Test service
sudo systemctl start pm2-root.service
sudo systemctl status pm2-root.service
```

**⚠️ Lưu ý:** 
- Sau khi reboot server, PM2 sẽ tự động restore processes từ `~/.pm2/dump.pm2`
- Không cần chạy `pm2 start` sau reboot

---

## 📝 Script tối giản PM2 Commands

Đã tạo file `pm2.sh` để tối giản các lệnh PM2:

### Sử dụng:

```bash
cd /root/project/clone-app

# Start
./pm2.sh start

# Restart (với --update-env)
./pm2.sh restart

# Stop
./pm2.sh stop

# Status
./pm2.sh status

# Logs (real-time)
./pm2.sh logs

# Logs (last 50 lines)
./pm2.sh logs-tail

# Save process list
./pm2.sh save

# Delete process
./pm2.sh delete

# Setup auto-start
./pm2.sh setup
```

### Thêm alias (tùy chọn)

Thêm vào `~/.bashrc` hoặc `~/.bash_aliases`:

```bash
# PM2 shortcuts
alias pm2-start='cd /root/project/clone-app && ./pm2.sh start'
alias pm2-restart='cd /root/project/clone-app && ./pm2.sh restart'
alias pm2-stop='cd /root/project/clone-app && ./pm2.sh stop'
alias pm2-status='cd /root/project/clone-app && ./pm2.sh status'
alias pm2-logs='cd /root/project/clone-app && ./pm2.sh logs'
```

**Sau đó:**
```bash
source ~/.bashrc

# Giờ có thể dùng:
pm2-restart
pm2-status
pm2-logs
```

---

## 🔄 Workflow sau khi setup

### Startup thông thường:

**Trước (dài):**
```bash
cd /root/project/clone-app
pm2 restart getcourses-frontend --update-env
```

**Sau (ngắn):**
```bash
./pm2.sh restart
# hoặc
pm2-restart  # nếu đã setup alias
```

### Sau khi thay đổi code:

```bash
cd /root/project/clone-app

# 1. Build
npm run build

# 2. Restart (tự động update env)
./pm2.sh restart

# 3. Check logs
./pm2.sh logs-tail
```

### Sau khi thay đổi .env.production:

```bash
cd /root/project/clone-app

# 1. Edit .env.production
nano .env.production

# 2. Restart (--update-env tự động load)
./pm2.sh restart

# 3. Verify env vars loaded
./pm2.sh logs-tail | grep "AUTH CONFIG"
```

---

## 🔍 Troubleshooting

### PM2 không auto-start sau reboot

**Check startup service:**
```bash
systemctl status pm2-root.service
systemctl is-enabled pm2-root.service
```

**Re-setup nếu cần:**
```bash
# Disable old service
sudo systemctl disable pm2-root.service

# Remove old service file
sudo rm /etc/systemd/system/pm2-root.service

# Re-setup
pm2 startup systemd -u root --hp /root
# Copy và chạy lệnh được output

# Save processes
pm2 save
```

### Check PM2 dump file

```bash
# Xem processes đã save
cat ~/.pm2/dump.pm2

# Re-save nếu cần
pm2 save --force
```

### Verify PM2 can find node

```bash
# Check PATH in service file
sudo cat /etc/systemd/system/pm2-root.service | grep PATH

# Should include node binary path
# Example: /usr/bin or /root/.nvm/versions/node/...
```

---

## 📚 Các lệnh PM2 hữu ích

### Management:
```bash
pm2 list                    # List all processes
pm2 describe <name>         # Show process details
pm2 monit                   # Monitor dashboard
pm2 flush                   # Clear logs
```

### Logs:
```bash
pm2 logs                    # All processes logs
pm2 logs <name>             # Specific process
pm2 logs --lines 100        # Last 100 lines
pm2 logs --nostream         # No tail -f
```

### Information:
```bash
pm2 info <name>             # Process info
pm2 env 0                   # Environment variables for process 0
pm2 jlist                   # JSON output
```

---

## ✅ Checklist

- [ ] `pm2 save` - Save process list
- [ ] `pm2 startup` - Setup auto-start
- [ ] `sudo systemctl enable pm2-root.service` - Enable service
- [ ] `systemctl is-enabled pm2-root.service` - Verify enabled
- [ ] Test: Restart server → PM2 auto-start
- [ ] `chmod +x pm2.sh` - Make script executable
- [ ] Test `./pm2.sh restart` - Verify script works

---

## 🎯 Summary

### Trước setup:
```bash
cd /root/project/clone-app
pm2 restart getcourses-frontend --update-env
pm2 save
pm2 logs getcourses-frontend --lines 50
```

### Sau setup:
```bash
./pm2.sh restart           # Auto update env, auto save
./pm2.sh logs-tail         # Quick logs view
```

### Auto-start:
- ✅ PM2 tự động start khi server boot
- ✅ Không cần manual start sau reboot
- ✅ Processes được restore từ dump.pm2

---

## 🔐 Security Notes

- `pm2 save` lưu process config vào `~/.pm2/dump.pm2`
- File này có thể chứa env vars → Keep secure
- Service file `/etc/systemd/system/pm2-root.service` chỉ readable bởi root
