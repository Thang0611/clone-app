# PM2 Logs Analysis & Fixes

## Phân tích Log PM2

### 1. ⚠️ Dotenv Tips Spam (Không nghiêm trọng)

**Vấn đề:**
- Rất nhiều log từ dotenv về tips: `[dotenv@17.2.3] injecting env (0) from .env -- tip: ...`
- Làm log rối và khó đọc

**Nguyên nhân:**
- Next.js tự động load `.env` files
- Dotenv package log tips mặc định

**Giải pháp:**
- Thêm env variable `DOTENV_QUIET=true` trong ecosystem.config.js
- Hoặc config trong next.config.ts (nếu có)

**Fix:**
```javascript
// ecosystem.config.js
env: {
  ...
  DOTENV_QUIET: 'true', // Tắt dotenv tips
}
```

---

### 2. ⚠️ Metadata Warnings (Next.js 16)

**Vấn đề:**
```
⚠ Unsupported metadata colorScheme is configured in metadata export in /order/[orderCode]. 
Please move it to viewport export instead.
⚠ Unsupported metadata themeColor is configured in metadata export in /order/[orderCode]. 
Please move it to viewport export instead.
```

**Nguyên nhân:**
- Next.js 16 yêu cầu `colorScheme` và `themeColor` phải ở trong `viewport` export, không phải `metadata` export

**Giải pháp:**
- Tìm file export metadata với colorScheme/themeColor
- Di chuyển sang `viewport` export

**Fix:**
```typescript
// app/order/[orderCode]/layout.tsx hoặc page.tsx
import { Viewport } from 'next';

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
};

// Xóa khỏi metadata export nếu có
```

---

### 3. ❌ Image Errors

**Vấn đề:**
```
⨯ The requested resource isn't a valid image for /images/logo.webp received null
⨯ The requested resource isn't a valid image for /images/udemy-1.webp received null
```

**Nguyên nhân:**
- Image files không tồn tại hoặc path sai
- Next.js Image component không tìm thấy file

**Giải pháp:**
- Kiểm tra file có tồn tại trong `public/images/`
- Verify image paths trong code
- Thêm fallback images

**Fix:**
```bash
# Kiểm tra files
ls -la public/images/

# Nếu thiếu, tạo placeholder hoặc fix paths
```

---

### 4. ❌ Server Action Errors

**Vấn đề:**
```
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.
```

**Nguyên nhân:**
- Cache issue sau khi deploy
- Server Action không được build đúng
- Client đang dùng old build

**Giải pháp:**
- Clear Next.js cache
- Rebuild app
- Restart PM2

**Fix:**
```bash
# Clear cache và rebuild
rm -rf .next
npm run build
pm2 restart getcourses-frontend
```

---

### 5. ❌ Backend API 502 Errors

**Vấn đề:**
```
Error fetching orders from backend: Error: Backend API returned 502: Bad Gateway
Error fetching stats from backend: Error: Backend API returned 502: Bad Gateway
```

**Nguyên nhân:**
- Backend API không chạy hoặc down
- Nginx không route đúng
- Backend crash

**Giải pháp:**
- Kiểm tra backend status
- Check Nginx config
- Verify API URL

**Fix:**
```bash
# Kiểm tra backend
pm2 status
curl https://api.getcourses.net/health

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

### 6. ⚠️ Auth UntrustedHost Errors

**Vấn đề:**
```
[auth][error] UntrustedHost: Host must be trusted. URL was: https://khoahocgiare.info/api/auth/session
```

**Nguyên nhân:**
- NextAuth không trust domain `khoahocgiare.info`
- AUTH_URL không match với request domain

**Giải pháp:**
- Thêm domain vào `AUTH_URL` hoặc `NEXTAUTH_URL`
- Update trusted hosts trong NextAuth config

**Fix:**
```env
# .env.production
NEXTAUTH_URL=https://getcourses.net
AUTH_URL=https://getcourses.net,https://khoahocgiare.info
```

---

## Priority Fixes

### High Priority (Fix ngay)

1. ✅ **Backend API 502** - Ảnh hưởng functionality
2. ✅ **Server Action errors** - Ảnh hưởng user experience
3. ✅ **Auth UntrustedHost** - Ảnh hưởng authentication

### Medium Priority

4. ⚠️ **Metadata warnings** - Không ảnh hưởng nhưng nên fix
5. ⚠️ **Image errors** - Ảnh hưởng UI nhưng không critical

### Low Priority

6. ℹ️ **Dotenv tips** - Chỉ làm log rối, không ảnh hưởng functionality

---

## Implementation

### Fix 1: Tắt Dotenv Tips

```javascript
// ecosystem.config.js
env: {
  NODE_ENV: 'production',
  PORT: 4000,
  DOTENV_QUIET: 'true', // ← Thêm dòng này
  ...
}
```

### Fix 2: Fix Metadata Warnings

Tìm file có export metadata với colorScheme/themeColor và move sang viewport.

### Fix 3: Clear Cache & Rebuild

```bash
cd /root/project/clone-app
rm -rf .next
npm run build
pm2 restart getcourses-frontend
```

---

## Monitoring

Sau khi fix, monitor logs:

```bash
# Real-time logs
pm2 logs getcourses-frontend --lines 50

# Error logs only
pm2 logs getcourses-frontend --err --lines 50

# Check specific errors
pm2 logs getcourses-frontend | grep -i "error\|warning"
```

---

## Next Steps

1. [ ] Fix dotenv tips (thêm DOTENV_QUIET)
2. [ ] Fix metadata warnings (move colorScheme/themeColor)
3. [ ] Verify image files exist
4. [ ] Clear cache và rebuild
5. [ ] Check backend API status
6. [ ] Update NextAuth trusted hosts
