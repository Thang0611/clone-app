# 🔧 Troubleshooting Login Issues

## ❌ "Mật khẩu không chính xác" Error

Nếu bạn gặp lỗi "mật khẩu không chính xác" khi đăng nhập, hãy làm theo các bước sau:

---

## 🔍 Bước 1: Test Password với Script

Chạy script test để kiểm tra password:

```bash
cd /root/project/clone-app

# Test với password bạn đang dùng
node scripts/test-password.js "your-password-here"
```

Script này sẽ:
- ✅ Kiểm tra environment variables
- ✅ Test password với bcrypt hash (nếu có)
- ✅ Test password với plain text (nếu có)
- ✅ Hiển thị kết quả chi tiết

**Output mẫu khi SUCCESS:**
```
✅ SUCCESS: Password is CORRECT!
   Authentication method: bcrypt.compare()
```

**Output mẫu khi FAILED:**
```
❌ FAILED: Password is INCORRECT!
   Authentication method: bcrypt.compare()

💡 Solutions:
   1. Check if password has extra spaces or special characters
   2. Regenerate hash: node scripts/generate-hash.js "<password>"
   3. Verify ADMIN_PASSWORD_HASH in .env.local
```

---

## 🔍 Bước 2: Kiểm Tra Environment Variables

### Check .env.local

```bash
cd /root/project/clone-app

# Xem có những biến nào được set
cat .env.local | grep -E "ADMIN_EMAIL|ADMIN_PASSWORD"
```

**Yêu cầu:**
- ✅ `ADMIN_EMAIL` phải được set
- ✅ `ADMIN_PASSWORD_HASH` HOẶC `ADMIN_PASSWORD` phải được set
- ✅ Nếu dùng hash, `ADMIN_PASSWORD` nên được xóa hoặc comment

### Verify Values

```bash
# Check email (value sẽ hiển thị)
grep ADMIN_EMAIL .env.local

# Check password (chỉ hiển thị length)
grep ADMIN_PASSWORD .env.local | sed 's/=.*/=***/'
```

---

## 🔍 Bước 3: Kiểm Tra Hash (Nếu dùng ADMIN_PASSWORD_HASH)

### Scenario A: Hash không đúng

Nếu bạn đã migrate sang hash nhưng hash không đúng với password:

```bash
# 1. Generate hash mới từ password
node scripts/generate-hash.js "your-password"

# 2. Copy hash từ output
# Output: ADMIN_PASSWORD_HASH=$2b$10$...

# 3. Update .env.local
nano .env.local
# Thay ADMIN_PASSWORD_HASH=... bằng hash mới

# 4. Restart server
pkill -f "next dev"
npm run dev
```

### Scenario B: Hash bị corrupt hoặc sai format

Kiểm tra hash format:
- ✅ Phải bắt đầu với `$2a$`, `$2b$`, hoặc `$2y$`
- ✅ Phải có độ dài khoảng 60 ký tự
- ✅ Không có spaces hoặc ký tự đặc biệt ngoài bcrypt format

```bash
# Test hash format
node -e "
const hash = process.env.ADMIN_PASSWORD_HASH || '';
console.log('Hash starts with $2:', hash.startsWith('$2'));
console.log('Hash length:', hash.length);
console.log('Hash format valid:', /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(hash));
"
```

---

## 🔍 Bước 4: Kiểm Tra Email

Đảm bảo email bạn nhập **chính xác** với `ADMIN_EMAIL`:

```bash
# Xem ADMIN_EMAIL
grep ADMIN_EMAIL .env.local

# Email phải khớp HOÀN TOÀN (case-sensitive trong một số trường hợp)
# Ví dụ: admin@example.com ≠ Admin@example.com
```

**Lưu ý:**
- Email comparison là **case-sensitive** trong một số trường hợp
- Không có spaces trước/sau email
- Check các ký tự đặc biệt

---

## 🔍 Bước 5: Kiểm Tra Server Logs

Nếu server đang chạy, kiểm tra logs:

```bash
# Development logs
tail -f logs/out.log | grep -i "auth\|password\|error"

# Hoặc console output nếu chạy npm run dev
```

Tìm các thông báo:
- `🔍 [AUTH DEBUG]` - Debug info trong development
- `Error comparing password hash` - Lỗi bcrypt
- `ADMIN_PASSWORD_HASH or ADMIN_PASSWORD must be set` - Missing env var

---

## 🔍 Bước 6: Restart Server

Sau khi thay đổi `.env.local`, **PHẢI restart server**:

```bash
# Development
pkill -f "next dev"
cd /root/project/clone-app
npm run dev

# Production
pm2 restart getcourses-frontend --update-env
```

**Important:** Environment variables chỉ được load khi server start. Thay đổi `.env.local` không tự động reload!

---

## 🛠️ Common Issues và Solutions

### Issue 1: Hash không khớp với password

**Nguyên nhân:**
- Hash được generate từ password khác
- Hash bị copy sai (thiếu ký tự, có spaces)
- Password có ký tự đặc biệt không được escape đúng

**Solution:**
```bash
# Regenerate hash
node scripts/generate-hash.js "exact-password-you-use"

# Copy hash CHÍNH XÁC (không có spaces)
# Update .env.local
# Restart server
```

### Issue 2: Vẫn dùng ADMIN_PASSWORD plain text

**Nguyên nhân:**
- Chưa migrate sang hash
- Plain text password không đúng

**Solution:**
```bash
# Option 1: Migrate sang hash (recommended)
node scripts/generate-hash.js "your-password"
# Update ADMIN_PASSWORD_HASH in .env.local
# Remove ADMIN_PASSWORD

# Option 2: Keep plain text (temporary)
# Verify ADMIN_PASSWORD in .env.local matches exactly
# Restart server
```

### Issue 3: Environment variables không được load

**Nguyên nhân:**
- File `.env.local` không đúng location
- Server chưa restart sau khi thay đổi env
- Syntax error trong `.env.local`

**Solution:**
```bash
# Check file location
ls -la .env.local

# Check syntax (no spaces around =)
cat .env.local | grep "ADMIN_"

# Should be:
# ADMIN_EMAIL=admin@example.com
# ADMIN_PASSWORD_HASH=$2b$10$...

# NOT:
# ADMIN_EMAIL = admin@example.com  (spaces around =)
# ADMIN_PASSWORD_HASH = $2b$10$...  (spaces around =)
```

### Issue 4: Email không khớp

**Nguyên nhân:**
- Email nhập sai
- Case sensitivity
- Spaces trong email

**Solution:**
```bash
# Check exact email
grep ADMIN_EMAIL .env.local

# Use EXACT email when logging in
# No spaces before/after
# Check case (uppercase/lowercase)
```

---

## ✅ Quick Fix Checklist

Nếu login vẫn fail, làm theo checklist này:

- [ ] Test password với script: `node scripts/test-password.js "password"`
- [ ] Verify ADMIN_EMAIL matches exactly
- [ ] Check ADMIN_PASSWORD_HASH hoặc ADMIN_PASSWORD is set
- [ ] If using hash, regenerate với exact password: `node scripts/generate-hash.js "password"`
- [ ] Copy hash chính xác (no spaces, full hash)
- [ ] Update .env.local correctly (no spaces around =)
- [ ] Restart server after env changes
- [ ] Check server logs for errors
- [ ] Try logging in again

---

## 🧪 Test Commands

### Test 1: Verify Environment
```bash
cd /root/project/clone-app
node -e "
require('fs').readFileSync('.env.local', 'utf8')
  .split('\\n')
  .filter(l => l.includes('ADMIN_'))
  .forEach(l => console.log(l.split('=')[0] + '=***'));
"
```

### Test 2: Test Password
```bash
node scripts/test-password.js "your-password-here"
```

### Test 3: Generate New Hash
```bash
node scripts/generate-hash.js "your-password-here"
```

### Test 4: Check Server Logs
```bash
tail -50 logs/out.log | grep -i "auth\|password"
```

---

## 📞 Still Having Issues?

Nếu vẫn không được, hãy:

1. **Run test script và copy output:**
   ```bash
   node scripts/test-password.js "your-password" > /tmp/test-output.txt
   cat /tmp/test-output.txt
   ```

2. **Check environment setup:**
   ```bash
   cd /root/project/clone-app
   echo "ADMIN_EMAIL: $(grep ADMIN_EMAIL .env.local | cut -d'=' -f2)"
   echo "Has ADMIN_PASSWORD_HASH: $(grep -c ADMIN_PASSWORD_HASH .env.local)"
   echo "Has ADMIN_PASSWORD: $(grep -c '^ADMIN_PASSWORD=' .env.local)"
   ```

3. **Verify server is running:**
   ```bash
   ps aux | grep "next dev"
   ```

4. **Check browser console** for client-side errors

---

## 🎯 Expected Behavior

Sau khi fix:

1. ✅ Test script shows: `SUCCESS: Password is CORRECT!`
2. ✅ Server logs show no auth errors
3. ✅ Login page accepts credentials
4. ✅ Redirects to `/admin` after login
5. ✅ Session persists (stays logged in)

---

## 📚 Related Files

- `scripts/test-password.js` - Password testing script
- `scripts/generate-hash.js` - Hash generation script
- `lib/auth.config.ts` - Authentication logic
- `.env.local` - Environment variables
- `docs/PASSWORD_MIGRATION_GUIDE.md` - Migration guide
