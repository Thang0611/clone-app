# 🔧 Hướng Dẫn Sửa Lỗi Đăng Nhập

## ✅ Đã Fix

1. ✅ **Email normalization** - Bây giờ email sẽ được trim và lowercase để so sánh
2. ✅ **Better debug logging** - Thêm logs chi tiết trong development mode
3. ✅ **Error handling** - Improved error messages trong login form

---

## 🔍 Vấn Đề

- Password test **PASS** ✅
- Nhưng login vẫn **FAIL** ❌

**Nguyên nhân có thể:**
1. Email không khớp chính xác (spaces, case sensitivity)
2. Server chưa restart sau khi update env
3. Browser cache hoặc session cũ
4. NextAuth configuration issue

---

## 🚀 Cách Sửa

### Bước 1: Test với Email Chính Xác

**Email trong .env.local:** `getcourses.net@gmail.com`

Test với script:
```bash
cd /root/project/clone-app
node scripts/test-login.js getcourses.net@gmail.com "your-password"
```

Script sẽ test cả email và password, cho biết cái nào sai.

---

### Bước 2: Restart Server

**Quan trọng:** Sau khi update code hoặc env, PHẢI restart server!

```bash
cd /root/project/clone-app

# Kill existing server
lsof -ti:4000 | xargs kill -9 2>/dev/null
sleep 2

# Clear cache
rm -rf .next

# Restart
NODE_ENV=development npm run dev
```

Hoặc dùng script tự động:
```bash
cd /root/project/clone-app
bash /tmp/fix-login.sh
```

---

### Bước 3: Check Debug Logs

Sau khi restart, login lại và xem logs:

```bash
# Terminal running server sẽ hiển thị debug logs
# Tìm các dòng:
#   🔍 [AUTH DEBUG] Email mismatch
#   🔍 [AUTH DEBUG] Password comparison failed
#   ✅ [AUTH DEBUG] User validated successfully
```

Nếu thấy logs, sẽ biết chính xác vấn đề ở đâu.

---

### Bước 4: Clear Browser Cache

1. Mở browser trong **Incognito/Private mode**
2. Hoặc clear cache và cookies
3. Hoặc hard refresh: `Ctrl+Shift+R` (Windows/Linux) hoặc `Cmd+Shift+R` (Mac)

---

### Bước 5: Verify Login

1. Mở: http://localhost:4000/admin
2. Nhập **exact email**: `getcourses.net@gmail.com`
3. Nhập password của bạn
4. Click "Đăng nhập"

**Check:**
- Nếu vẫn fail, xem browser console (F12) và server logs
- Debug logs sẽ hiển thị chi tiết

---

## 🧪 Test Commands

### Test 1: Full Login Test
```bash
node scripts/test-login.js getcourses.net@gmail.com "your-password"
```

### Test 2: Password Only
```bash
node scripts/test-password.js "your-password"
```

### Test 3: Check Server Logs
```bash
tail -f /tmp/nextjs-dev.log | grep -i "auth\|debug\|error"
```

---

## ⚠️ Common Issues

### Issue 1: Email không khớp

**Symptom:** Password test PASS nhưng login FAIL

**Solution:**
- Sử dụng **exact email**: `getcourses.net@gmail.com`
- Không có spaces trước/sau
- Check case sensitivity (bây giờ đã normalize)

### Issue 2: Server chưa restart

**Symptom:** Code changes không có effect

**Solution:**
```bash
lsof -ti:4000 | xargs kill -9
rm -rf .next
npm run dev
```

### Issue 3: Browser cache

**Symptom:** Old errors persist

**Solution:**
- Use Incognito mode
- Clear cache
- Hard refresh

---

## 📋 Checklist

- [ ] Test với exact email: `getcourses.net@gmail.com`
- [ ] Password test PASS: `node scripts/test-password.js "password"`
- [ ] Server restarted sau khi update code/env
- [ ] Clear browser cache hoặc dùng Incognito
- [ ] Check debug logs trong server console
- [ ] Check browser console (F12) cho client-side errors

---

## 🔍 Debug Information

Sau khi login, check:

1. **Server logs** (terminal running `npm run dev`):
   ```
   🔍 [AUTH DEBUG] Email mismatch
   🔍 [AUTH DEBUG] Password comparison failed
   ✅ [AUTH DEBUG] User validated successfully
   ```

2. **Browser console** (F12):
   ```
   Login error: CredentialsSignin
   ```

3. **Network tab** (F12):
   - Check `/api/auth/callback/credentials` request
   - Status code: 200, 401, 500?
   - Response body?

---

## ✅ Expected Result

Sau khi fix:
- ✅ Password test: `SUCCESS`
- ✅ Login test: `SUCCESS`
- ✅ Server logs: `User validated successfully`
- ✅ Browser redirects to `/admin`
- ✅ Can access admin dashboard

---

## 📞 Still Not Working?

Nếu vẫn không được:

1. **Run full test:**
   ```bash
   node scripts/test-login.js getcourses.net@gmail.com "your-password"
   ```

2. **Copy output** và kiểm tra:
   - Email match: ✅ or ❌?
   - Password match: ✅ or ❌?

3. **Check server logs** sau khi thử login

4. **Check browser console** (F12) for errors

5. **Try incognito mode** để loại trừ cache issues
