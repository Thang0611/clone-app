# Sửa: Facebook không nhận tracking – sai Pixel ID

## Nguyên nhân

- **Meta Pixel Helper** trên getcourses.net báo **1 pixel: 123456789** (placeholder 9 số, không hợp lệ).
- **Events Manager** bạn đang xem pixel **2048390439314825** (khoahocgiare.info_1) → “chưa nhận hoạt động” vì site đang gửi sang **123456789**, không phải 2048390439314825.

`NEXT_PUBLIC_META_PIXEL_ID=123456789` trong **.env.local** đã được dùng khi build → code init `fbq('init', '123456789')` nên toàn bộ event gửi sang pixel sai.

---

## Đã sửa

- **.env.local:** `NEXT_PUBLIC_META_PIXEL_ID=123456789` → `NEXT_PUBLIC_META_PIXEL_ID=2048390439314825` (đúng với pixel **khoahocgiare.info_1** bạn đang mở trong Events Manager).

---

## Việc bạn cần làm

### 1. Build và deploy lại

```bash
npm run build
# Rồi deploy / restart (PM2, Vercel, v.v.)
```

Build mới sẽ dùng `2048390439314825` (từ .env.local khi build trên máy có .env.local).

### 2. Production (getcourses.net) dùng env nào?

- **Build trên máy có .env.local:** đã dùng 2048390439314825.
- **Build trên CI/server không có .env.local:** sẽ dùng **.env.production** hoặc biến môi trường trên host.

Hiện **.env.production** đang là `NEXT_PUBLIC_META_PIXEL_ID=3259804720845489`. Nếu bạn muốn **getcourses.net gửi sang 2048390439314825**:

- Sửa **.env.production:**  
  `NEXT_PUBLIC_META_PIXEL_ID=2048390439314825`  
  **hoặc**
- Trên host/CI (Vercel, PM2, v.v.): set  
  `NEXT_PUBLIC_META_PIXEL_ID=2048390439314825`

### 3. GTM – tránh trùng Pixel ID

Đang dùng **Cách 2** (init Meta Pixel từ app), nên trong GTM:

- **Tắt** tag **Meta Pixel - Base Code** (để không init thêm pixel khác, đặc biệt nếu GTM vẫn set 123456789).

### 4. Kiểm tra sau khi deploy

1. Mở getcourses.net → bật **Meta Pixel Helper**.
2. Phải thấy **1 pixel: 2048390439314825** (hoặc 3259804720845489 nếu bạn chọn dùng pixel đó).
3. **Events Manager** → chọn đúng pixel **2048390439314825** (khoahocgiare.info_1) → tab **Sự kiện thử nghiệm / Test Events** để xem event realtime (có thể trễ tối đa ~30 phút ở tab Overview).

---

## Tóm tắt 3 Pixel ID

| Nguồn | Pixel ID | Ghi chú |
|-------|----------|---------|
| Cũ trong .env.local | 123456789 | Placeholder, đã đổi thành 2048390439314825 |
| .env.production | 3259804720845489 | Giữ nếu bạn muốn production dùng pixel này |
| Pixel trong ảnh Events Manager | 2048390439314825 | khoahocgiare.info_1 – đã set trong .env.local |

Chỉ khi **site gửi đúng vào pixel bạn đang mở trong Events Manager** thì mới thấy “đã nhận hoạt động”.
