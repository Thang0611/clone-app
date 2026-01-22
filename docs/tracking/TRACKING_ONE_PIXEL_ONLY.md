# Chỉ dùng 1 Meta Pixel: 3259804720845489

## Vấn đề: 3 pixels trên getcourses.net

Meta Pixel Helper báo **3 pixel**:

| Pixel ID | Nguồn | Cách xử lý |
|----------|--------|------------|
| **2048390439314825** (đuôi 25) | `.env.local` cũ = 2048390439314825 | ✅ Đã đổi `.env.local` → `3259804720845489` |
| **00** | Tag trong **GTM** gọi `fbq('init', ...)` với giá trị rỗng/sai | ⚠️ Tắt tag đó trong GTM |
| **pixelId** | Tag trong **GTM** gọi `fbq('init', 'pixelId')` hoặc biến `{{Meta Pixel ID}}` = chuỗi "pixelId" | ⚠️ Tắt hoặc sửa tag đó trong GTM |

---

## Đã sửa trong code

- **.env.local:** `NEXT_PUBLIC_META_PIXEL_ID=2048390439314825` → `NEXT_PUBLIC_META_PIXEL_ID=3259804720845489`
- **.env.production:** đã là `3259804720845489`
- **tracking-config.ts:** fallback = `3259804720845489`

→ App (component **MetaPixel**) chỉ init **1 pixel: 3259804720845489**.

---

## Bạn cần làm trong GTM: tắt mọi tag gọi `fbq('init', ...)`

Đang dùng **Cách 2** (init Meta Pixel từ app), nên trong GTM **không được** có tag nào gọi `fbq('init', ...)`.

### Bước 1: Tìm tag gây pixel "00" và "pixelId"

1. **GTM** → **Tags**.
2. Tìm các tag:
   - **Meta Pixel - Base Code**
   - Bất kỳ **Custom HTML** nào chứa `fbq('init'` hoặc `fbq("init"`.
3. Mở từng tag, xem **HTML** hoặc cấu hình:
   - Nếu có `fbq('init', '{{Meta Pixel ID}}')` hoặc `fbq('init', pixelId)` mà biến trống/sai → có thể tạo pixel "00" hoặc "pixelId".

### Bước 2: Tắt (hoặc xóa) các tag đó

- **Meta Pixel - Base Code:** **Pause / Disable** (hoặc xóa).
- **Custom HTML** có `fbq('init', ...)`: **Pause / Disable** (hoặc xóa).

Chỉ **giữ** các tag **chỉ** gọi `fbq('track', ...)` (ViewContent, Lead, InitiateCheckout, Purchase); những tag này không init pixel.

### Bước 3: Kiểm tra biến (nếu còn dùng)

- Nếu vẫn có tag dùng `{{Meta Pixel ID}}` cho `fbq('track', ...)` (không dùng cho `init`):  
  Variable **Meta Pixel ID** = `3259804720845489`.  
- Nếu không dùng nữa: có thể để nguyên hoặc xóa.

### Bước 4: Publish

- **Submit** (Publish) container GTM.

---

## Sau khi sửa

1. **Build & deploy** (để app dùng `3259804720845489` từ .env).
2. **Publish** GTM (để tắt tag init sai).
3. Vào getcourses.net → **Meta Pixel Helper**:
   - Chỉ còn **1 pixel: 3259804720845489**.
   - Các event: PageView, ViewContent, … gắn với pixel này.

---

## Tóm tắt

- **Đuôi 25** (2048390439314825): do `.env.local` cũ → đã đổi sang **3259804720845489**.
- **00** và **pixelId**: do tag trong GTM gọi `fbq('init', ...)` với giá trị sai → cần **tắt** các tag đó trong GTM.
- **Pixel cần dùng:** **3259804720845489**, do component **MetaPixel** (app) init; GTM chỉ dùng cho `fbq('track', ...)`.
