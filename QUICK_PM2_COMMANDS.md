# ⚡ PM2 Quick Commands - Tối giản lệnh

## 🚀 Script tối giản

Sử dụng `pm2.sh` thay vì lệnh PM2 dài:

```bash
cd /root/project/clone-app

# Start
./pm2.sh start

# Restart (tự động --update-env)
./pm2.sh restart

# Stop
./pm2.sh stop

# Status
./pm2.sh status

# Logs real-time
./pm2.sh logs

# Logs last 50 lines
./pm2.sh logs-tail

# Save process list
./pm2.sh save

# Setup auto-start
./pm2.sh setup
```

## 📋 So sánh

### ❌ Trước (dài):
```bash
cd /root/project/clone-app
pm2 restart khoahocgiare-frontend --update-env
pm2 save
pm2 logs khoahocgiare-frontend --lines 50
```

### ✅ Sau (ngắn):
```bash
./pm2.sh restart      # Auto update env + save
./pm2.sh logs-tail    # Quick logs
```

## 🔄 Auto-Start Setup

PM2 đã được setup để **tự động start khi server boot**:

```bash
# Check status
systemctl is-enabled pm2-root.service
# Output: enabled ✅

# Check service
systemctl status pm2-root.service
```

**Không cần chạy `pm2 start` sau reboot!** PM2 sẽ tự động restore từ `~/.pm2/dump.pm2`

## 🎯 Common Workflows

### 1. Deploy code mới:
```bash
cd /root/project/clone-app
npm run build
./pm2.sh restart
./pm2.sh logs-tail
```

### 2. Thay đổi .env.production:
```bash
nano .env.production
./pm2.sh restart  # Tự động load .env.production
./pm2.sh logs-tail | grep "AUTH CONFIG"
```

### 3. Check status nhanh:
```bash
./pm2.sh status
```

### 4. Xem logs nhanh:
```bash
./pm2.sh logs-tail  # Last 50 lines
# hoặc
./pm2.sh logs       # Real-time (Ctrl+C để exit)
```

## 📝 Thêm Alias (Optional)

Thêm vào `~/.bashrc`:
```bash
alias pm2-start='cd /root/project/clone-app && ./pm2.sh start'
alias pm2-restart='cd /root/project/clone-app && ./pm2.sh restart'
alias pm2-stop='cd /root/project/clone-app && ./pm2.sh stop'
alias pm2-status='cd /root/project/clone-app && ./pm2.sh status'
alias pm2-logs='cd /root/project/clone-app && ./pm2.sh logs'
```

Sau đó:
```bash
source ~/.bashrc
pm2-restart  # Ngắn hơn nữa!
```

## ✅ Verification

### Check PM2 auto-start:
```bash
# Should be enabled
systemctl is-enabled pm2-root.service

# Check service status
systemctl status pm2-root.service
```

### Test script:
```bash
./pm2.sh status    # Should show PM2 processes
./pm2.sh logs-tail # Should show logs
```

---

**Summary:** 
- ✅ Script `pm2.sh` - Tối giản lệnh
- ✅ Auto-start enabled - Tự động start khi boot
- ✅ Quick commands - `./pm2.sh restart` thay vì lệnh dài
