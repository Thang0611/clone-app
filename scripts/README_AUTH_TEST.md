# Authentication Test Script

Script để test và debug authentication credentials.

## Cách sử dụng

### 1. Test credentials hiện tại

```bash
node scripts/test-auth-credentials.js [email] [password]
```

Ví dụ:
```bash
node scripts/test-auth-credentials.js getcourses.net@gmail.com yourpassword
```

Script sẽ:
- ✅ Kiểm tra environment variables có được load đúng không
- ✅ Kiểm tra email có khớp không
- ✅ Kiểm tra password hash có đúng không
- ✅ Hiển thị chi tiết lỗi nếu có

### 2. Generate password hash mới

Nếu bạn muốn tạo hash mới cho password:

```bash
node scripts/test-auth-credentials.js --generate-hash [password]
```

Ví dụ:
```bash
node scripts/test-auth-credentials.js --generate-hash mynewpassword
```

Output sẽ là:
```
ADMIN_PASSWORD_HASH=$2b$10$...
```

Copy hash này vào file `.env` hoặc `.env.production`.

## Troubleshooting

### Lỗi: "ADMIN_EMAIL is not set"
- Kiểm tra file `.env` hoặc `.env.production` có chứa `ADMIN_EMAIL` không
- Đảm bảo file được đặt đúng thư mục root của project

### Lỗi: "ADMIN_PASSWORD_HASH is not set"
- Kiểm tra file `.env` có chứa `ADMIN_PASSWORD_HASH` không
- Hoặc sử dụng `ADMIN_PASSWORD` (plain text) cho development

### Lỗi: "Email mismatch"
- Đảm bảo email bạn nhập khớp chính xác với `ADMIN_EMAIL` trong `.env`
- Email sẽ được normalize (lowercase, trim) trước khi so sánh

### Lỗi: "Password invalid"
- Đảm bảo password bạn nhập đúng với password đã dùng để generate hash
- Nếu không nhớ password, generate hash mới và cập nhật trong `.env`

### Lỗi: "NEXTAUTH_SECRET is not set"
- Kiểm tra file `.env` có chứa `NEXTAUTH_SECRET` không
- `NEXTAUTH_SECRET` phải có ít nhất 32 ký tự

## Ví dụ output thành công

```
============================================================
🧪 TESTING ADMIN CREDENTIALS
============================================================

📁 Loading environment from: /root/project/clone-app/.env
   NODE_ENV: development
   File exists: true

✅ Loaded 5 environment variables

📋 Environment Variables:
   ADMIN_EMAIL: ✅ Set (getcourses.net@gmail.com)
   ADMIN_PASSWORD_HASH: ✅ Set (60 chars)
   ADMIN_PASSWORD (plain): ❌ NOT SET
   NEXTAUTH_SECRET: ✅ Set (44 chars)
   NEXTAUTH_URL: ✅ Set (https://getcourses.net)

📧 Testing Email:
   Entered: "getcourses.net@gmail.com"
   Expected: "getcourses.net@gmail.com"
   Normalized entered: "getcourses.net@gmail.com"
   Normalized expected: "getcourses.net@gmail.com"
   ✅ Email matches!

🔐 Testing Password:
   Using bcrypt comparison...
   Result: ✅ Valid

============================================================
✅ ALL TESTS PASSED! Credentials are valid.
============================================================
```
