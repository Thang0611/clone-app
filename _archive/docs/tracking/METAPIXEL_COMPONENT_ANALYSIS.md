# MetaPixel Component - Phân tích và Cấu hình

## Tổng quan

Component `MetaPixel.tsx` **ĐANG ĐƯỢC SỬ DỤNG** trong `app/layout.tsx` để init Meta Pixel từ app thay vì từ GTM.

---

## 1. Trạng thái hiện tại

### ✅ Đang được sử dụng

- **File:** `components/MetaPixel.tsx`
- **Vị trí:** `app/layout.tsx` (dòng 52)
- **Chức năng:** Init Meta Pixel với `fbq('init', pixelId)`

### Cách hoạt động

```javascript
// MetaPixel.tsx
fbq('init', pixelId, {}, opts);
fbq('track', 'PageView', {}, opts);
```

- Init pixel từ `NEXT_PUBLIC_META_PIXEL_ID` trong `.env`
- Track PageView tự động
- Hỗ trợ test event code từ URL

---

## 2. Có ghi đè GTM config không?

### ❌ KHÔNG ghi đè GTM config

- **MetaPixel component** chỉ init pixel (load script + `fbq('init')`)
- **GTM tags** chỉ track events (`fbq('track', ...)`)
- Không có conflict về config

### ⚠️ NHƯNG có vấn đề tiềm ẩn

Trong `app/order/[orderCode]/page.tsx` có code gọi lại `fbq('init', ...)`:

```javascript
// ❌ SAI - Gọi lại init có thể gây conflict
fbq('init', trackingConfig.metaPixelId, { em: hashed });
```

**Vấn đề:**
- Pixel đã được init bởi MetaPixel component
- Gọi lại `fbq('init')` có thể reset pixel state
- Nên dùng `fbq('set', 'user', { em: hashed })` thay vì `fbq('init', ...)`

**Đã sửa:** ✅ Dùng `fbq('set', 'user', { em: hashed })` thay vì `fbq('init', ...)`

---

## 3. Cấu hình GTM

### Theo doc `TRACKING_ONE_PIXEL_ONLY.md`:

- ✅ **TẮT** tag "Meta Pixel - Base Code" trong GTM
- ✅ **GIỮ** các tag chỉ gọi `fbq('track', ...)`:
  - Meta Pixel - ViewContent
  - Meta Pixel - Lead
  - Meta Pixel - InitiateCheckout
  - Meta Pixel - Purchase

### Lý do

- Pixel đã được init bởi MetaPixel component
- GTM chỉ cần track events, không cần init lại
- Tránh init 2 lần → lỗi hoặc duplicate events

---

## 4. Flow hoàn chỉnh

### Init (1 lần duy nhất)

1. **App load** → `MetaPixel.tsx` init pixel:
   ```javascript
   fbq('init', '3259804720845489', {}, opts);
   fbq('track', 'PageView', {}, opts);
   ```

### Advanced Matching (khi có email)

2. **Order page** → Set user data:
   ```javascript
   fbq('set', 'user', { em: emailHash });
   ```

### Track Events (từ GTM)

3. **GTM tags** track events:
   ```javascript
   fbq('track', 'Lead', eventParams);
   fbq('track', 'InitiateCheckout', eventParams);
   fbq('track', 'Purchase', eventParams);
   ```

---

## 5. Best Practices

### ✅ Đúng

1. **Init 1 lần** từ MetaPixel component
2. **Set user data** bằng `fbq('set', 'user', ...)` khi có email
3. **Track events** từ GTM tags

### ❌ Sai

1. ❌ Gọi `fbq('init', ...)` nhiều lần
2. ❌ Có tag "Meta Pixel - Base Code" trong GTM
3. ❌ Gọi `fbq('init', ...)` trong order page

---

## 6. Checklist

### Source Code
- [x] MetaPixel component được import trong layout
- [x] MetaPixel init pixel đúng cách
- [x] Order page dùng `fbq('set', 'user', ...)` thay vì `fbq('init', ...)`

### GTM Configuration
- [ ] Tag "Meta Pixel - Base Code" đã TẮT
- [ ] Chỉ có tags track events (`fbq('track', ...)`)
- [ ] Tags track events có set user data bằng `fbq('set', 'user', ...)`

### Testing
- [ ] Chỉ có 1 pixel ID trong Meta Pixel Helper
- [ ] Events track đúng
- [ ] Advanced Matching có email hash

---

## 7. Tóm tắt

| Aspect | Status | Notes |
|--------|--------|-------|
| **MetaPixel component** | ✅ Đang dùng | Init pixel từ app |
| **GTM Base Code tag** | ❌ Phải TẮT | Tránh init 2 lần |
| **GTM Event tags** | ✅ Đang dùng | Track events |
| **Order page init** | ✅ Đã sửa | Dùng `fbq('set', 'user', ...)` |
| **Conflict với GTM** | ❌ Không có | Component init, GTM track |

---

## 8. Files liên quan

- `components/MetaPixel.tsx` - Init pixel từ app
- `app/layout.tsx` - Import và sử dụng MetaPixel
- `app/order/[orderCode]/page.tsx` - Set user data (đã sửa)
- `docs/TRACKING_ONE_PIXEL_ONLY.md` - Hướng dẫn cấu hình GTM

---

## 9. Kết luận

**MetaPixel component:**
- ✅ Đang được sử dụng
- ✅ Không ghi đè GTM config
- ✅ Init pixel đúng cách
- ✅ Cần đảm bảo GTM không có Base Code tag

**Đã sửa:**
- ✅ Order page dùng `fbq('set', 'user', ...)` thay vì `fbq('init', ...)`
