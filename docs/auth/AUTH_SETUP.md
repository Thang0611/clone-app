# Hướng dẫn cài đặt Gateway Authentication

Tài liệu này hướng dẫn cài đặt và cấu hình hệ thống xác thực theo mô hình Gateway cho dự án Next.js + Express.

## Kiến trúc

- **Next.js (Frontend + BFF)**: Sử dụng NextAuth.js làm Gateway Authentication
- **Express Server**: Xác thực JWT token từ Next.js

## 1. Biến môi trường cần thiết

### Next.js App (`clone-app/.env.local`)

Tạo file `.env.local` trong thư mục `clone-app/` với các biến sau:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars-generate-with-openssl

# Admin Credentials (initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Lưu ý quan trọng:**
- `NEXTAUTH_SECRET`: Phải **GIỐNG NHAU** với Express server
- Sử dụng lệnh sau để generate secret:
  ```bash
  openssl rand -base64 32
  ```
- Trong production, đặt `NEXTAUTH_URL` thành domain thực tế (VD: `https://getcourses.net`)

### Express Server (`server/.env`)

Thêm các biến sau vào file `.env` trong thư mục `server/`:

```env
# JWT Authentication (MUST match Next.js NEXTAUTH_SECRET)
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars-generate-with-openssl
```

**Quan trọng:** `NEXTAUTH_SECRET` phải **GIỐNG HỆT** với giá trị trong Next.js app.

## 2. Cài đặt Dependencies

### Next.js App

Dependencies đã được cài đặt:
- `next-auth@beta` (NextAuth.js v5)
- `jsonwebtoken` và `@types/jsonwebtoken`

### Express Server

Dependencies đã được cài đặt:
- `jsonwebtoken`

## 3. Cấu trúc File

### Next.js App

```
clone-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API route
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # Admin login page
│   │   └── page.tsx                  # Admin dashboard (protected)
│   └── providers.tsx                 # SessionProvider wrapper
├── lib/
│   ├── auth.config.ts                # NextAuth configuration
│   ├── auth.ts                       # Server-side auth utilities
│   ├── auth-utils.ts                 # API route auth utilities
│   └── api-admin.ts                  # Authenticated API client (optional)
├── middleware.ts                     # Route protection middleware
└── types/
    └── auth.d.ts                     # TypeScript definitions
```

### Express Server

```
server/
├── src/
│   ├── middleware/
│   │   └── auth.middleware.js        # JWT verification middleware
│   └── routes/
│       └── admin.routes.js           # Protected admin routes
└── server.js                         # Main server file
```

## 4. Luồng xác thực

### Đăng nhập

1. User truy cập `/admin` → Middleware kiểm tra chưa đăng nhập → Redirect đến `/admin/login`
2. User nhập email/password → NextAuth xác thực với `ADMIN_EMAIL`/`ADMIN_PASSWORD`
3. NextAuth tạo JWT token chứa thông tin user (id, email, role)
4. Token được lưu trong session cookie
5. User được redirect về `/admin`

### Gọi API sang Express

1. Next.js API route gọi `getAuthHeader(request)` để lấy JWT token
2. Token được đính kèm vào header: `Authorization: Bearer <token>`
3. Request được gửi đến Express server
4. Express middleware `verifyToken` kiểm tra và giải mã token
5. Middleware `verifyAdmin` kiểm tra role là 'admin'
6. Request được tiếp tục xử lý

## 5. Bảo vệ Routes

### Next.js (Frontend Routes)

Middleware tự động bảo vệ:
- `/admin/*` (trừ `/admin/login`)
- Tất cả `/api/admin/*` routes đã được cập nhật để yêu cầu authentication

### Express Server

Tất cả routes trong `/api/admin/*` đã được bảo vệ:
- `verifyToken`: Kiểm tra JWT token hợp lệ
- `verifyAdmin`: Kiểm tra role là 'admin'

## 6. Mở rộng cho User Login (Future)

Hệ thống được thiết kế để dễ dàng mở rộng:

1. **Thêm User Provider trong `auth.config.ts`**:
   - Thêm Credentials provider mới cho user
   - Hoặc thêm OAuth providers (Google, Facebook, etc.)

2. **Tạo User Model trong Database**:
   ```javascript
   // server/src/models/user.model.js
   // User model với email, password_hash, role
   ```

3. **Cập nhật `validateAdminCredentials`**:
   - Thay thế bằng database query
   - Sử dụng bcrypt để hash/verify password

4. **Bảo vệ User Routes**:
   - Sử dụng `verifyToken` + `verifyUser` middleware
   - `verifyUser` cho phép cả 'admin' và 'user' role

## 7. Testing

### Test Login Flow

1. Truy cập `http://localhost:4000/admin`
2. Sẽ được redirect đến `/admin/login`
3. Nhập email/password từ `.env.local`
4. Sau khi đăng nhập, có thể truy cập admin dashboard

### Test API Authentication

```bash
# Get JWT token (sau khi login)
# Token được lưu trong cookie, hoặc extract từ browser DevTools

# Test Express API với token
curl -X GET http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 8. Troubleshooting

### Lỗi "Unauthorized"

- Kiểm tra `NEXTAUTH_SECRET` có giống nhau giữa Next.js và Express
- Kiểm tra token có được gửi trong header `Authorization: Bearer <token>`
- Kiểm tra token chưa hết hạn (mặc định 24h)

### Lỗi "Not authenticated"

- Kiểm tra session cookie có tồn tại
- Kiểm tra `NEXTAUTH_URL` đúng với domain hiện tại
- Clear cookies và thử lại

### Lỗi "Admin access required"

- Kiểm tra role trong JWT token là 'admin'
- Kiểm tra `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong `.env.local`

## 9. Security Best Practices

1. **Production Secret**:
   - Sử dụng secret ngẫu nhiên mạnh (32+ ký tự)
   - Không commit secret vào Git
   - Sử dụng environment variables hoặc secret manager

2. **HTTPS**:
   - Luôn sử dụng HTTPS trong production
   - JWT tokens trong cookies cần `Secure` flag khi dùng HTTPS

3. **Password**:
   - Sử dụng password mạnh cho admin account
   - Trong production, nên lưu password hash trong database
   - Cân nhắc sử dụng 2FA cho admin accounts

4. **Token Expiry**:
   - Token mặc định hết hạn sau 24h
   - Có thể điều chỉnh trong `auth.config.ts`: `session.maxAge`

5. **Rate Limiting**:
   - Nên thêm rate limiting cho login endpoint
   - Ngăn chặn brute force attacks

## 10. Deployment

### Next.js

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<production-secret>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<secure-password>
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Express Server

```env
NEXTAUTH_SECRET=<same-production-secret>
# ... other env vars
```

**Quan trọng:** Đảm bảo `NEXTAUTH_SECRET` giống nhau giữa Next.js và Express trong production!

## Support

Nếu gặp vấn đề, kiểm tra:
1. Logs trong Next.js console
2. Logs trong Express server
3. Network tab trong browser DevTools để xem token có được gửi
