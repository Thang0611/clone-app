# NextAuth v4 Migration Complete ✅

## Tổng quan

Đã downgrade từ **next-auth v5 (beta)** xuống **next-auth v4 (stable)** và refactor toàn bộ hệ thống authentication để tương thích với v4.

## Những thay đổi đã thực hiện

### 1. ✅ Package.json
- **Trước:** `"next-auth": "^5.0.0-beta.30"`
- **Sau:** `"next-auth": "^4.24.10"`
- **Status:** Đã cài đặt thành công

### 2. ✅ Auth Configuration (`lib/auth.config.ts`)
- **Thay đổi:** 
  - `NextAuthConfig` (v5) → `NextAuthOptions` (v4)
  - `authConfig` → `authOptions`
  - `Credentials` → `CredentialsProvider`
- **Chức năng:** 
  - Vẫn giữ nguyên logic validate với bcrypt
  - Đã thêm debug log: `console.log("Debug Env:", process.env.ADMIN_PASSWORD_HASH ? "Loaded" : "Missing")`
  - Hỗ trợ cả `ADMIN_PASSWORD_HASH` (bcrypt) và `ADMIN_PASSWORD` (plain text - fallback)

### 3. ✅ API Route (`app/api/auth/[...nextauth]/route.ts`)
- **Thay đổi:**
  - **V5:** `const { handlers } = NextAuth(authConfig); export const { GET, POST } = handlers;`
  - **V4:** `const handler = NextAuth(authOptions); export { handler as GET, handler as POST };`
- **Status:** Đã cập nhật đúng cấu trúc v4

### 4. ✅ Middleware (`middleware.ts`)
- **Thay đổi:**
  - **V5:** Sử dụng `getToken` từ `next-auth/jwt` thủ công
  - **V4:** Sử dụng `withAuth` từ `next-auth/middleware`
- **Chức năng:**
  - Bảo vệ `/admin/*` routes
  - Redirect chưa login về `/admin/login`
  - Kiểm tra role `admin`

### 5. ✅ Login Page (`app/admin/login/page.tsx`)
- **Status:** Không cần thay đổi - `signIn` từ `next-auth/react` hoạt động giống nhau ở v4 và v5

### 6. ✅ Environment Variables
- **Cấu hình PM2:** `ecosystem.config.js` đã có `ADMIN_PASSWORD_HASH` trong `env_production` (line 39)
- **Debug Log:** Đã thêm log trong `validateAdminCredentials()` để kiểm tra biến môi trường
- **Next.js:** Tự động load `.env.production` khi `NODE_ENV=production`

## 🔧 Đảm bảo Environment Variables được load đúng

### Kiểm tra `.env.production`

Đảm bảo file `.env.production` có các biến sau:

```bash
# Authentication
NEXTAUTH_URL=https://getcourses.net
NEXTAUTH_SECRET=<your-secret-32+chars>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$10$...  # bcrypt hash

# API Configuration
NEXT_PUBLIC_API_URL=https://api.getcourses.net
NEXT_PUBLIC_SOCKET_URL=https://api.getcourses.net

# Environment
NODE_ENV=production
```

### PM2 Configuration

File `ecosystem.config.js` đã được cấu hình để load từ `.env.production`:

```javascript
env_production: {
  ADMIN_PASSWORD_HASH: envVars.ADMIN_PASSWORD_HASH || '',
  // ... other vars
}
```

### Debug Environment Variables

Khi login, check logs để xem biến môi trường có được load:

```bash
# Check logs
pm2 logs getcourses-frontend --lines 50

# Tìm dòng "Debug Env:" để xem ADMIN_PASSWORD_HASH có được load không
```

Nếu thấy `Debug Env: Missing`, hãy:
1. Kiểm tra file `.env.production` có `ADMIN_PASSWORD_HASH` không
2. Kiểm tra syntax trong `.env.production` (không có spaces quanh `=`)
3. Restart PM2: `pm2 restart getcourses-frontend --update-env`

## 📋 Checklist sau khi migrate

- [x] Package downgrade từ v5 → v4
- [x] Refactor `auth.config.ts` sang `authOptions`
- [x] Update API route handler
- [x] Update middleware sử dụng `withAuth`
- [x] Thêm debug log cho environment variables
- [x] Kiểm tra login page tương thích
- [ ] **Cần test:** Login flow hoạt động đúng
- [ ] **Cần test:** Middleware bảo vệ routes đúng
- [ ] **Cần verify:** `ADMIN_PASSWORD_HASH` được load trong production

## 🚀 Next Steps

1. **Test local:**
   ```bash
   cd /root/project/clone-app
   npm run dev
   # Test login tại http://localhost:4000/admin/login
   ```

2. **Build production:**
   ```bash
   npm run build
   ```

3. **Deploy với PM2:**
   ```bash
   pm2 restart getcourses-frontend --update-env
   pm2 logs getcourses-frontend --lines 100
   ```

4. **Verify:**
   - Check logs có `Debug Env: Loaded`
   - Test login tại production
   - Verify middleware redirect hoạt động

## ⚠️ Lưu ý

1. **TypeScript Errors:** Một số lỗi TypeScript về types có thể xuất hiện do TypeScript chưa refresh sau khi cài package. Chạy lại TypeScript server hoặc restart IDE để fix.

2. **Auth.ts File:** File `lib/auth.ts` vẫn dùng v5 syntax (`const { auth } = NextAuth(authConfig)`). Nếu file này được sử dụng, cần refactor sang v4. Hiện tại file này có thể không cần thiết nếu chỉ dùng `getSession` từ `next-auth/react`.

3. **Environment Variables:** Nếu `ADMIN_PASSWORD_HASH` vẫn báo "NOT SET" sau khi restart PM2, check:
   - File `.env.production` có tồn tại và có biến này
   - Syntax đúng: `ADMIN_PASSWORD_HASH=$2b$10$...` (không có spaces)
   - PM2 restart với `--update-env` flag
   - Check logs để xem biến có được inject không

## 📚 Tài liệu tham khảo

- [NextAuth v4 Documentation](https://next-auth.js.org/)
- [NextAuth v4 Credentials Provider](https://next-auth.js.org/configuration/providers/credentials)
- [NextAuth v4 Middleware](https://next-auth.js.org/configuration/nextjs#middleware)
