# PM2 Next.js Fix Summary

## 🔍 Vấn đề phát hiện

### Lỗi chính:
1. **PM2 process `nextjs` (id 4)**: Status `errored`, restart liên tục (23 lần)
2. **Interpreter path không tồn tại**: `/root/.nvm/versions/node/v24.12.0/bin/node` - NVM path không có sẵn trong PM2 context
3. **Port conflict**: Process thủ công (PID 18088) đang chiếm port 4000
4. **Log paths sai**: Logs lưu ở `/root/project/server/logs/` thay vì `/root/project/clone-app/logs/`

## ✅ Giải pháp đã áp dụng

### 1. Fix ecosystem.config.js
- **Xóa interpreter path**: Bỏ dòng `interpreter: '/root/.nvm/versions/node/v24.12.0/bin/node'`
- PM2 sẽ dùng system Node: `/usr/bin/node` (v24.13.0)

### 2. Tạo logs directory
- Tạo folder `/root/project/clone-app/logs/` cho logs

### 3. Kill conflicting processes
- Dừng process thủ công đang chiếm port 4000

### 4. Restart với đúng config
```bash
pm2 delete nextjs  # Xóa process cũ (id 4)
pm2 start ecosystem.config.js --only khoahocgiare-frontend
```

## 📊 Kết quả

### Trước khi fix:
```
│ id │ name    │ status  │ ↺    │
│ 4  │ nextjs  │ errored │ 23   │  ← Crash loop
```

### Sau khi fix:
```
│ id │ name                     │ status  │ ↺    │ uptime │
│ 6  │ khoahocgiare-frontend    │ online  │ 0    │ 10s    │  ← OK!
```

### Test API:
```bash
curl http://localhost:4000/api/admin/simple-test
# Response: {"success":true,"message":"Simple test route works",...}
```

## 🔧 File đã sửa

**`/root/project/clone-app/ecosystem.config.js`**:
- Removed: `interpreter: '/root/.nvm/versions/node/v24.12.0/bin/node'`
- Log paths: Đã đúng (`/root/project/clone-app/logs/`)
- Script: Sử dụng system Node (`/usr/bin/node` v24.13.0)

## 📝 Notes

- **NVM paths**: PM2 không tự động load NVM environment. Nếu cần dùng Node từ NVM, phải:
  1. Source NVM trước khi chạy PM2: `source ~/.nvm/nvm.sh && pm2 start ...`
  2. Hoặc dùng system Node (đã có sẵn)
  
- **System Node**: Đang dùng `/usr/bin/node` v24.13.0 - hoàn toàn OK cho Next.js

- **Port 4000**: Đảm bảo không có process khác chiếm port trước khi start PM2

## ✅ Status: FIXED

- PM2 process: `online`
- Restarts: `0` (không còn crash)
- API: Hoạt động bình thường
- Logs: Lưu đúng thư mục
