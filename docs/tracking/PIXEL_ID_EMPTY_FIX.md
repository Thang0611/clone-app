# 🔧 Fix Meta Pixel với ID rỗng "pixelId"

## 🔴 Vấn đề

Trong **Meta Pixel Helper** hoặc **Facebook Events Manager**, xuất hiện pixel với ID là chuỗi **"pixelId"** (không phải ID thực 15-16 chữ số).

**Triệu chứng:**
- Meta Pixel Helper hiển thị: `Pixel ID: pixelId, {}, opts`
- Hoặc trong Events Manager có pixel với ID là "pixelId"
- Events không được track đúng vì pixel ID sai

**Nguyên nhân:**
- Có tag trong **GTM** đang init pixel với ID sai:
  - Biến `{{Meta Pixel ID}}` có giá trị là chuỗi "pixelId" (không phải ID thực)
  - Hoặc tag có hardcoded `fbq('init', 'pixelId')`

---

## ✅ Giải pháp

### Option 1: Tắt tag init pixel trong GTM (KHUYẾN NGHỊ)

**Vì pixel đã được init từ app (`components/MetaPixel.tsx`), không cần init lại trong GTM.**

#### Bước 1: Tìm tag init pixel trong GTM

1. Vào [Google Tag Manager](https://tagmanager.google.com)
2. Chọn container của bạn
3. Vào **Tags**
4. Search: `Meta Pixel` hoặc `fbq('init`

#### Bước 2: Tìm tag có ID sai

Tìm các tag có:
- **Tag Name:** `Meta Pixel - Base Code` hoặc tương tự
- **Code có:** `fbq('init', ...)` hoặc `fbq('init', 'pixelId')`
- **Variable:** `{{Meta Pixel ID}}` với giá trị = "pixelId"

#### Bước 3: Pause/Disable tag

1. Click vào tag
2. Click **Pause** (hoặc **Disable**)
   - ⚠️ **KHÔNG XÓA** - Giữ lại để reference
3. Click **Save**

#### Bước 4: Publish container

1. Click **Submit** → **Publish**
2. Nhập **Version name**: `Fix: Remove duplicate pixel with empty ID`
3. Click **Publish**

---

### Option 2: Sửa variable {{Meta Pixel ID}} trong GTM

**Nếu muốn giữ tag trong GTM nhưng sửa ID:**

#### Bước 1: Kiểm tra Variable

1. Vào **Variables** trong GTM
2. Tìm variable `Meta Pixel ID` (hoặc tên tương tự)
3. Kiểm tra **Value:**
   - ❌ Nếu là `pixelId` → SAI
   - ✅ Nếu là ID thực (15-16 chữ số) → Đúng

#### Bước 2: Sửa Variable

1. Click vào variable `Meta Pixel ID`
2. Thay đổi **Value** thành Pixel ID thực:
   - Ví dụ: `3259804720845489` (15-16 chữ số từ Facebook Events Manager)
3. Click **Save**

#### Bước 3: Publish container

1. Click **Submit** → **Publish**

---

### Option 3: Sửa code trong tag

**Nếu tag có hardcoded "pixelId":**

1. Vào tag → **Edit**
2. Tìm code: `fbq('init', 'pixelId')`
3. Sửa thành:
   - `fbq('init', '{{Meta Pixel ID}}')` (dùng variable)
   - Hoặc `fbq('init', '3259804720845489')` (hardcoded ID thực)
4. Click **Save**
5. **Publish** container

---

## 🔍 Cách xác định nguyên nhân

### Kiểm tra trong Console

1. Mở website
2. Mở **DevTools** → **Console**
3. Search: `fbq('init`
4. Xem các lần gọi `fbq('init')`:
   ```javascript
   // Nếu thấy:
   fbq('init', 'pixelId', ...)  // ❌ SAI - từ GTM
   fbq('init', '3259804720845489', ...)  // ✅ ĐÚNG - từ app
   ```

### Kiểm tra trong Network tab

1. Mở **DevTools** → **Network**
2. Filter: `facebook.com/tr`
3. Xem requests:
   - Request với `ids=pixelId` → ❌ SAI
   - Request với `ids=3259804720845489` → ✅ ĐÚNG

### Kiểm tra trong GTM Preview

1. Enable **GTM Preview Mode**
2. Load page
3. Check **Tags Fired** tab
4. Tìm tag có `fbq('init')`
5. Click vào tag → Xem **Variables** tab
6. Kiểm tra `{{Meta Pixel ID}}` có giá trị gì

---

## ✅ Test sau khi fix

### Test 1: Verify trong Console

1. Reload trang
2. Mở **Console**
3. Search: `fbq('init`
4. ✅ Verify:
   - Chỉ có **1** lần gọi `fbq('init')`
   - ID là số thực (15-16 chữ số), KHÔNG phải "pixelId"

### Test 2: Verify trong Meta Pixel Helper

1. Reload trang
2. Mở **Meta Pixel Helper** extension
3. ✅ Verify:
   - Chỉ có **1** pixel
   - Pixel ID là số thực (15-16 chữ số)
   - KHÔNG còn pixel với ID "pixelId"

### Test 3: Verify trong Network tab

1. Reload trang
2. Mở **Network** tab → Filter: `facebook.com/tr`
3. ✅ Verify:
   - Chỉ có requests với `ids=` số thực
   - KHÔNG có requests với `ids=pixelId`

---

## 📊 So sánh Before/After

### ❌ Before (SAI)

**Có 2 pixels:**
1. Pixel từ app: ID = `3259804720845489` ✅
2. Pixel từ GTM: ID = `pixelId` ❌

**Kết quả:**
- ⚠️ Meta Pixel Helper hiển thị 2 pixels
- ⚠️ Events có thể bị track vào pixel sai
- ⚠️ Data không chính xác

### ✅ After (ĐÚNG)

**Chỉ có 1 pixel:**
1. Pixel từ app: ID = `3259804720845489` ✅
2. GTM: Không init pixel (chỉ track events) ✅

**Kết quả:**
- ✅ Chỉ có 1 pixel với ID đúng
- ✅ Events track đúng vào pixel thực
- ✅ Data chính xác

---

## ⚠️ Lưu ý quan trọng

### 1. Pixel đã được init từ app

**File:** `components/MetaPixel.tsx`

Pixel được init với ID từ:
- Environment variable: `NEXT_PUBLIC_META_PIXEL_ID`
- File: `.env` hoặc `.env.production`

**→ GTM KHÔNG CẦN init lại pixel!**

### 2. GTM chỉ cần track events

GTM tags chỉ nên gọi `fbq('track', ...)`, KHÔNG gọi `fbq('init', ...)`:

```javascript
// ✅ ĐÚNG - Track events
fbq('track', 'Lead', eventParams);
fbq('track', 'ViewContent', eventParams);

// ❌ SAI - Init pixel
fbq('init', '{{Meta Pixel ID}}');  // Không cần!
```

### 3. Nếu muốn dùng GTM init pixel

**Nếu bạn muốn init pixel từ GTM thay vì từ app:**

1. **Tắt** MetaPixel component trong `app/layout.tsx`
2. **Sửa** variable `{{Meta Pixel ID}}` trong GTM = ID thực
3. **Bật** tag "Meta Pixel - Base Code" trong GTM

**Nhưng:**
- ⚠️ Không nên init từ cả 2 nơi (duplicate)
- ✅ Nên chọn 1 cách: app HOẶC GTM

---

## ✅ Quick Fix Checklist

- [ ] Vào GTM → Tags
- [ ] Tìm tag "Meta Pixel - Base Code" (hoặc tag có `fbq('init')`)
- [ ] Kiểm tra variable `{{Meta Pixel ID}}` có giá trị = "pixelId" không
- [ ] Pause/Disable tag (hoặc sửa variable)
- [ ] Publish GTM container
- [ ] Test trong Console → Verify chỉ có 1 pixel với ID đúng
- [ ] Test trong Meta Pixel Helper → Verify không còn pixel "pixelId"
- [ ] Test trong Network tab → Verify không có requests với `ids=pixelId`

---

## 📚 Files liên quan

- ✅ `components/MetaPixel.tsx` - Init pixel từ app (GIỮ NGUYÊN)
- ✅ `app/layout.tsx` - Import MetaPixel component
- ⚠️ **GTM Container** - Cần tắt/pause tag init pixel với ID sai

**Reference docs:**
- `docs/TRACKING_ONE_PIXEL_ONLY.md` - Hướng dẫn về duplicate pixel và pixel với ID sai
- `docs/FACEBOOK_PIXEL_DUPLICATE_INIT_FIX.md` - Fix duplicate pixel init
- `docs/TRACKING_META_PIXEL_NULL_FIX.md` - Fix pixel ID null

---

**Last Updated:** 2024  
**Version:** 1.0