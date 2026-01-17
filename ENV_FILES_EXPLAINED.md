# 📋 Giải thích các file .env trong Next.js

## Tổng quan

Next.js tự động load các file `.env` theo thứ tự ưu tiên. Các file có priority cao hơn sẽ override các file có priority thấp hơn.

---

## 🔄 Thứ tự ưu tiên (từ thấp → cao)

```
1. .env                    (Thấp nhất - default cho mọi môi trường)
2. .env.local              (Override mọi môi trường - IGNORE bởi git)
3. .env.[NODE_ENV]         (.env.development, .env.production, .env.test)
4. .env.[NODE_ENV].local   (Override theo môi trường - IGNORE bởi git)
```

**Ví dụ:** Nếu `NODE_ENV=production`:
- Load: `.env` → `.env.production` → `.env.local` → `.env.production.local`
- File sau override file trước nếu có biến trùng tên

---

## 📁 Chi tiết từng loại file

### 1. `.env` - Default Environment Variables

**Mục đích:** Biến môi trường mặc định cho TẤT CẢ môi trường (development, production, test)

**Khi nào dùng:**
- Biến chung cho mọi môi trường
- Biến không nhạy cảm (có thể commit vào git)

**Ví dụ:**
```bash
# .env
NODE_ENV=development
NEXT_PUBLIC_SITE_NAME=Khóa Học Giá Rẻ
NEXT_PUBLIC_VERSION=1.0.0
```

**Git:** ✅ **CÓ THỂ commit** (nếu không chứa secrets)

**Priority:** Thấp nhất - bị override bởi các file khác

---

### 2. `.env.local` - Local Overrides

**Mục đích:** Override cho mọi môi trường - dùng cho local development

**Khi nào dùng:**
- Secrets/credentials cho development local
- Biến riêng tư không muốn share với team
- Override mọi môi trường

**Ví dụ:**
```bash
# .env.local
ADMIN_EMAIL=admin@local.dev
ADMIN_PASSWORD_HASH=$2b$10$...your-local-hash...
NEXTAUTH_SECRET=local-dev-secret-min-32-chars-long
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Git:** ❌ **KHÔNG BAO GIỜ commit** - đã có trong `.gitignore`

**Priority:** Cao - override `.env` và `.env.[NODE_ENV]`

**⚠️ Lưu ý:** File này được **ignore bởi git**, an toàn để chứa secrets

---

### 3. `.env.local.example` - Template/Example File

**Mục đích:** Template để hướng dẫn team setup `.env.local`

**Khi nào dùng:**
- Tạo template với structure và comments
- Hướng dẫn developer mới setup local environment
- Document các biến cần thiết

**Ví dụ:**
```bash
# .env.local.example
# Copy this file to .env.local and fill in your actual values
# Never commit .env.local to git!

# Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=your-bcrypt-hash-here
NEXTAUTH_SECRET=generate-a-strong-secret-min-32-chars
NEXTAUTH_URL=http://localhost:4000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Git:** ✅ **CÓ THỂ commit** - không chứa secrets thực tế

**Priority:** Không được load - chỉ là template

**Usage:**
```bash
# Developer mới copy file này
cp .env.local.example .env.local
# Sau đó edit .env.local với values thực tế
```

---

### 4. `.env.production` - Production Environment Variables

**Mục đích:** Biến môi trường cho **production mode**

**Khi nào dùng:**
- Chạy production build: `npm run build && npm start`
- Deploy lên server với PM2
- Biến cần thiết cho production

**Khi nào được load:**
- Khi `NODE_ENV=production`
- Tự động load khi chạy `npm start` sau `npm run build`

**Ví dụ:**
```bash
# .env.production
NODE_ENV=production
NEXTAUTH_URL=https://khoahocgiare.info
NEXTAUTH_SECRET=NsZHJGXFgrOd2ImUvJTcA7aq5ZA26PgLK17hWzd+41o=
ADMIN_EMAIL=khoahocgiare.info@gmail.com
ADMIN_PASSWORD_HASH=$2b$10$PoJ16TotjPMPuyyCR2S3NOLLQaL1wdLNVogFrUnbwXCGc7wiva8o6
NEXT_PUBLIC_API_URL=https://api.khoahocgiare.info
NEXT_PUBLIC_SOCKET_URL=https://api.khoahocgiare.info
```

**Git:** ❌ **KHÔNG BAO GIỜ commit** - chứa production secrets

**Priority:** Cao - chỉ load khi `NODE_ENV=production`

**⚠️ Lưu ý:** 
- File này **KHÔNG tự động load** khi chạy `npm run dev`
- Chỉ load khi `NODE_ENV=production`
- Cần **build lại** sau khi thay đổi

---

## 🎯 So sánh nhanh

| File | Môi trường | Git | Priority | Khi nào dùng |
|------|-----------|-----|----------|--------------|
| `.env` | Tất cả | ✅ Có thể | Thấp | Biến chung, không nhạy cảm |
| `.env.local` | Tất cả | ❌ Không | **Cao** | Secrets local, override mọi thứ |
| `.env.local.example` | - | ✅ Có thể | - | Template cho team |
| `.env.production` | Production | ❌ Không | **Cao** (khi NODE_ENV=production) | Production config |

---

## 🔍 Thứ tự load khi NODE_ENV=production

```
1. .env                              (load trước)
2. .env.production                   (override .env)
3. .env.local                        (override tất cả)
4. .env.production.local             (cao nhất - nếu có)
```

**Kết quả:** Biến trong file sau cùng sẽ được sử dụng

**Ví dụ:**
```bash
# .env
API_URL=http://default

# .env.production
API_URL=https://api.production.com

# .env.local
API_URL=http://localhost:3001

# Kết quả: API_URL = http://localhost:3001
# (vì .env.local có priority cao nhất)
```

---

## ⚙️ Cách Next.js load env vars

### Development Mode (`npm run dev`)
```bash
NODE_ENV=development (tự động set)

Load order:
1. .env
2. .env.development (nếu có)
3. .env.local
4. .env.development.local (nếu có)
```

### Production Mode (`npm run build && npm start`)
```bash
NODE_ENV=production (tự động set)

Load order:
1. .env
2. .env.production
3. .env.local
4. .env.production.local (nếu có)
```

### Test Mode (`npm test`)
```bash
NODE_ENV=test (tự động set)

Load order:
1. .env
2. .env.test
3. .env.local
4. .env.test.local (nếu có)
```

---

## 🔐 Security Best Practices

### ✅ Nên làm:

1. **Commit `.env.local.example`** - Template không chứa secrets
2. **Commit `.env`** - Nếu chỉ chứa biến public (NEXT_PUBLIC_*)
3. **`.gitignore` bảo vệ:**
   ```
   .env.local
   .env.production
   .env.*.local
   ```

4. **Set permissions cho production:**
   ```bash
   chmod 600 .env.production  # Chỉ owner read/write
   ```

### ❌ Không nên:

1. **❌ Commit `.env.local`** - Chứa local secrets
2. **❌ Commit `.env.production`** - Chứa production secrets
3. **❌ Commit bất kỳ file nào có `*.local`** - Private overrides

---

## 🚀 Production với PM2

### Vấn đề:

Next.js **KHÔNG tự động load** `.env.production` khi chạy `next start` trong PM2.

### Giải pháp 1: PM2 ecosystem.config.js

```javascript
// ecosystem.config.js
const fs = require('fs');
const path = require('path');

// Load .env.production
const envPath = path.join(__dirname, '.env.production');
let envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
}

module.exports = {
  apps: [{
    name: 'app',
    env_production: {
      ADMIN_PASSWORD_HASH: envVars.ADMIN_PASSWORD_HASH || '',
      // ... other vars
    }
  }]
};
```

### Giải pháp 2: Load trong code (đã áp dụng)

```typescript
// lib/auth.config.ts
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(process.cwd(), '.env.production');
  
  if (fs.existsSync(envPath)) {
    // Load .env.production manually
    const content = fs.readFileSync(envPath, 'utf8');
    // ... parse and set process.env
  }
}
```

---

## 📝 Checklist setup

### Development:
- [ ] Copy `.env.local.example` → `.env.local`
- [ ] Fill `.env.local` với local values
- [ ] Verify `.env.local` in `.gitignore`
- [ ] Test: `npm run dev`

### Production:
- [ ] Create `.env.production` trên server
- [ ] Set permissions: `chmod 600 .env.production`
- [ ] Verify `.env.production` in `.gitignore`
- [ ] Configure PM2 ecosystem.config.js
- [ ] Build: `npm run build`
- [ ] Start: `pm2 start ecosystem.config.js --env production`

---

## 🔍 Debug Environment Variables

### Check env vars trong code:
```typescript
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? 'Set' : 'Missing');
```

### Check PM2 env vars:
```bash
pm2 env 0 | grep ADMIN
```

### Check loaded env vars:
```bash
pm2 logs app --lines 100 | grep "AUTH CONFIG"
```

---

## 📚 Tài liệu tham khảo

- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
- [Next.js .env Files](https://nextjs.org/docs/pages/api-reference/next-config-js/env)

---

## ✅ Summary

| File | Dùng cho | Git | Load khi |
|------|----------|-----|----------|
| `.env` | Default cho mọi môi trường | ✅ | Luôn |
| `.env.local` | Local overrides | ❌ | Luôn (ưu tiên cao) |
| `.env.local.example` | Template | ✅ | Không (chỉ là template) |
| `.env.production` | Production only | ❌ | Khi NODE_ENV=production |

**Quan trọng nhất:**
- `.env.local` - Cho local development (ignore git)
- `.env.production` - Cho production (ignore git, cần setup thủ công trên server)
