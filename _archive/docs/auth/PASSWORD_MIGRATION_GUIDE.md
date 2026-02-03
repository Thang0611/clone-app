# 🔐 Hướng dẫn Migration Password sang Bcrypt Hash

## 📋 Tổng Quan

Để nâng cấp bảo mật, hệ thống đã được cập nhật để sử dụng **bcrypt hash** thay vì plain text password.

### ✅ Đã Cập Nhật
- ✅ Cài đặt `bcryptjs`
- ✅ Update `lib/auth.config.ts` để sử dụng bcrypt
- ✅ Tạo script `scripts/generate-hash.js` để generate hash
- ✅ Hỗ trợ backward compatibility (có thể dùng plain text tạm thời)

---

## 🚀 Các Bước Migration

### Bước 1: Generate Password Hash

**Cách 1: Từ password plain text**
```bash
cd /root/project/clone-app

# Generate hash từ password trực tiếp
node scripts/generate-hash.js "your-password-here"
```

**Cách 2: Từ biến môi trường**
```bash
# Set password trong .env.local trước
export ADMIN_PASSWORD="your-password-here"

# Sau đó chạy script
node scripts/generate-hash.js
```

**Cách 3: Từ file .env**
```bash
# Script tự động đọc từ .env.local
node scripts/generate-hash.js
# Nhập password khi được hỏi
```

**Output mẫu:**
```
✅ Password hash generated successfully!

📋 Copy this hash to your .env.production file:
─────────────────────────────────────────────────────
ADMIN_PASSWORD_HASH=$2a$10$rQ8x3k9vL5mN2pW1sT8YqeJ4H6K7L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3
─────────────────────────────────────────────────────

⚠️  IMPORTANT:
   1. Copy the hash above
   2. Replace ADMIN_PASSWORD with ADMIN_PASSWORD_HASH in .env.production
   3. Delete or secure your original plain text password
   4. Never commit the plain text password to git

✅ Hash verification: SUCCESS
```

### Bước 2: Cập Nhật File Environment

**Development (.env.local):**
```bash
# Mở file
nano /root/project/clone-app/.env.local

# Thay đổi từ:
ADMIN_PASSWORD=your-plain-text-password

# Thành:
ADMIN_PASSWORD_HASH=$2a$10$rQ8x3k9vL5mN2pW1sT8YqeJ4H6K7L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3

# ⚠️ Xóa hoặc comment dòng ADMIN_PASSWORD cũ:
# ADMIN_PASSWORD=your-plain-text-password
```

**Production (.env.production):**
```bash
# Mở file
nano /root/project/clone-app/.env.production

# Thay đổi từ:
ADMIN_PASSWORD=your-plain-text-password

# Thành:
ADMIN_PASSWORD_HASH=$2a$10$rQ8x3k9vL5mN2pW1sT8YqeJ4H6K7L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3

# ⚠️ XÓA dòng ADMIN_PASSWORD cũ (KHÔNG COMMENT)
# Không để plain text password trong production
```

### Bước 3: Restart Server

```bash
# Development
pkill -f "next dev"
cd /root/project/clone-app
npm run dev

# Production
cd /root/project/clone-app
pm2 restart getcourses-frontend --update-env
```

### Bước 4: Test Login

1. Mở browser: http://localhost:4000/admin
2. Redirect đến: http://localhost:4000/admin/login
3. Nhập:
   - **Email**: Email từ `ADMIN_EMAIL`
   - **Password**: **Plain text password** (không phải hash)
4. Click "Đăng nhập"
5. ✅ Login should work!

**Lưu ý**: Bạn vẫn nhập **plain text password** khi login. Hệ thống sẽ tự động hash và so sánh với `ADMIN_PASSWORD_HASH`.

---

## 🔒 Security Best Practices

### ✅ DO (Nên Làm)

1. ✅ **Sử dụng ADMIN_PASSWORD_HASH** trong production
2. ✅ **Xóa ADMIN_PASSWORD** sau khi migration
3. ✅ **Set strong password** (16+ chars, mixed case, numbers, special)
4. ✅ **Rotate password** định kỳ (3-6 tháng)
5. ✅ **Set file permissions**: `chmod 600 .env.production`
6. ✅ **Verify .env* files** trong `.gitignore`

### ❌ DON'T (Không Nên)

1. ❌ **KHÔNG commit** `.env*` files vào git
2. ❌ **KHÔNG dùng ADMIN_PASSWORD** plain text trong production
3. ❌ **KHÔNG share** password hash (cũng là sensitive data)
4. ❌ **KHÔNG hardcode** password trong code
5. ❌ **KHÔNG log** password hoặc hash trong logs

---

## 🔄 Migration Workflow

### Scenario 1: Development Environment

```bash
# 1. Generate hash từ password hiện tại
cd /root/project/clone-app
node scripts/generate-hash.js "your-dev-password"

# 2. Copy hash vào .env.local
# Thay ADMIN_PASSWORD bằng ADMIN_PASSWORD_HASH

# 3. Restart dev server
pkill -f "next dev"
npm run dev

# 4. Test login với plain text password
```

### Scenario 2: Production Environment

```bash
# 1. Generate hash từ production password
cd /root/project/clone-app
node scripts/generate-hash.js "your-production-password"

# 2. Copy hash vào .env.production
# Thay ADMIN_PASSWORD bằng ADMIN_PASSWORD_HASH
# XÓA dòng ADMIN_PASSWORD cũ

# 3. Verify permissions
chmod 600 .env.production

# 4. Restart PM2 với updated env
pm2 restart getcourses-frontend --update-env
pm2 save

# 5. Test login
# Visit: https://getcourses.net/admin
```

---

## ⚠️ Backward Compatibility

Hệ thống vẫn hỗ trợ `ADMIN_PASSWORD` plain text **tạm thời** để:
- Migration dễ dàng
- Không break existing setups
- Có thời gian migrate

**Tuy nhiên**:
- ⚠️ Production sẽ log warning nếu dùng plain text
- ⚠️ Nên migrate sang hash càng sớm càng tốt
- ⚠️ Plain text support có thể bị remove trong tương lai

**Priority order**:
1. `ADMIN_PASSWORD_HASH` - ✅ Preferred (secure)
2. `ADMIN_PASSWORD` - ⚠️ Fallback (less secure)

---

## 🧪 Testing

### Test Hash Generation
```bash
# Test script
node scripts/generate-hash.js "test-password-123"

# Verify output
# Should see: ✅ Hash verification: SUCCESS
```

### Test Login with Hash
```bash
# 1. Set ADMIN_PASSWORD_HASH in .env.local
# 2. Remove ADMIN_PASSWORD
# 3. Restart server
# 4. Login with plain text password
# 5. Should succeed
```

### Test Login with Plain Text (Backward Compatibility)
```bash
# 1. Set ADMIN_PASSWORD in .env.local
# 2. Remove ADMIN_PASSWORD_HASH
# 3. Restart server
# 4. Login with same plain text password
# 5. Should succeed (with warning in production)
```

---

## 🔍 Troubleshooting

### Lỗi: "ADMIN_PASSWORD_HASH or ADMIN_PASSWORD must be set"
**Nguyên nhân**: Không có password nào được set  
**Giải pháp**: Set `ADMIN_PASSWORD_HASH` hoặc `ADMIN_PASSWORD` trong `.env`

### Lỗi: Login fails với hash
**Nguyên nhân**: 
- Hash không đúng
- Password nhập sai
- Bcrypt version mismatch

**Giải pháp**:
```bash
# Re-generate hash
node scripts/generate-hash.js "correct-password"
# Copy hash mới vào .env
# Restart server
```

### Warning: "Using plain text password in production"
**Nguyên nhân**: Đang dùng `ADMIN_PASSWORD` thay vì `ADMIN_PASSWORD_HASH`  
**Giải pháp**: Migrate sang `ADMIN_PASSWORD_HASH` ngay

### Hash verification failed
**Nguyên nhân**: Hash bị corrupt hoặc sai format  
**Giải pháp**: Re-generate hash và update `.env`

---

## 📝 Example Configuration

### Before Migration (.env.production)
```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=MyPassword123!
```

### After Migration (.env.production)
```env
ADMIN_EMAIL=admin@example.com
# Use hashed password (secure)
ADMIN_PASSWORD_HASH=$2a$10$rQ8x3k9vL5mN2pW1sT8YqeJ4H6K7L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3
# Old plain text password removed
```

---

## ✅ Migration Checklist

- [ ] Install bcryptjs: `npm install bcryptjs`
- [ ] Generate password hash: `node scripts/generate-hash.js`
- [ ] Update `.env.production` with `ADMIN_PASSWORD_HASH`
- [ ] Remove `ADMIN_PASSWORD` from production env
- [ ] Update `.env.local` for development
- [ ] Restart server
- [ ] Test login với plain text password
- [ ] Verify login works correctly
- [ ] Check logs for warnings (should be none)
- [ ] Verify `.env*` files are in `.gitignore`

---

## 🎯 Quick Start

```bash
# 1. Generate hash
cd /root/project/clone-app
node scripts/generate-hash.js "your-password"

# 2. Copy hash to .env.production
# ADMIN_PASSWORD_HASH=<hash-from-step-1>

# 3. Remove old ADMIN_PASSWORD line

# 4. Restart
pm2 restart getcourses-frontend --update-env

# 5. Test
# Login with plain text password
```

---

## 📚 Related Files

- `lib/auth.config.ts` - Authentication logic với bcrypt
- `scripts/generate-hash.js` - Hash generation script
- `.env.example` - Environment template
- `docs/PASSWORD_MIGRATION_GUIDE.md` - This file

---

## ✅ Conclusion

Migration sang bcrypt hash đã hoàn tất. Hệ thống bây giờ:
- ✅ Hỗ trợ bcrypt hashed passwords (secure)
- ✅ Backward compatible với plain text (temporary)
- ✅ Có script tiện ích để generate hash
- ✅ Có đầy đủ documentation

**Action**: Generate hash và update `.env.production` ngay!
