# 🔧 Fix Cảnh báo Lead Event - "Pixel Activated 2 Times"

## 🔴 Vấn đề

**Meta Pixel Helper** hiển thị cảnh báo trên **Lead event**:
> ⚠️ **"The Facebook pixel activated 2 times on this web page, which can cause errors in your event tracking"**

**Nguyên nhân có thể:**
- Facebook Pixel được **init 2 lần** từ các nguồn sau:
  1. ✅ Từ app: `components/MetaPixel.tsx` → `fbq('init', pixelId)`
  2. ❌ **Từ GTM Facebook Pixel Template:** Template tự động init pixel nếu detect chưa init
  3. ❌ **Race condition:** GTM tags fire trước khi MetaPixel component init xong

**Hậu quả:**
- Lead event bị track **2 lần** (duplicate)
- Conversion data sai số
- Budget allocation không chính xác
- Ad performance tracking bị lệch

---

## ✅ Giải pháp

### Trường hợp 1: Nếu dùng **Custom HTML Tags** trong GTM

**Bước 1: Tắt tag "Meta Pixel - Base Code"**

1. Vào [tagmanager.google.com](https://tagmanager.google.com) → **Tags**
2. Tìm tag: `Meta Pixel - Base Code` hoặc `Facebook Pixel - Base Code`
3. Click **Pause** (không xóa)
4. **Publish** container

---

### Trường hợp 2: Nếu dùng **Facebook Pixel Template** trong GTM (KHÔNG có Custom HTML)

**Facebook Pixel Template tự động init pixel** nếu detect pixel chưa được init. Vấn đề là **race condition**: Template tags có thể fire trước khi `MetaPixel.tsx` init xong.

**Giải pháp: Đảm bảo MetaPixel init TRƯỚC khi GTM tags fire**

#### Option A: Đã sửa - MetaPixel load sớm hơn GTM (ĐÃ ÁP DỤNG)

**Đã thực hiện:**

1. **File:** `components/MetaPixel.tsx` - Đổi strategy thành `beforeInteractive`
2. **File:** `app/layout.tsx` - Di chuyển `<MetaPixel />` vào `<head>` để load sớm hơn

**Kết quả:**
- ✅ MetaPixel init TRƯỚC khi GTM tags fire
- ✅ Tránh race condition
- ✅ Facebook Pixel Template sẽ detect pixel đã init và không init lại

**Nếu vẫn còn vấn đề, thử Option B hoặc C.**

#### Option B: Thêm delay vào GTM triggers

Trong GTM, thêm delay cho các Facebook Pixel Template tags:

1. Vào **Tags** → Chọn tag Facebook Pixel (ví dụ: `Meta Pixel - Lead`)
2. Vào **Triggering** → Click trigger hiện tại
3. Thêm **Trigger Condition:**
   - **Condition Type:** Custom Event
   - **Event name:** `gtm.dom` hoặc `gtm.load`
   - Hoặc thêm delay: **Trigger fires on:** `Page View` → **Delay:** 500ms

#### Option C: Kiểm tra Pixel ID trong Template

Đảm bảo tất cả Facebook Pixel Template tags dùng **CÙNG Pixel ID** với `MetaPixel.tsx`:

1. Vào mỗi tag Facebook Pixel Template
2. Kiểm tra **Pixel ID** field
3. Verify Pixel ID = Pixel ID trong `.env` (biến `NEXT_PUBLIC_META_PIXEL_ID`)

---

### Bước cuối: Publish container

1. Click **Submit** trong GTM
2. Nhập **Version name**: `Fix: Prevent duplicate pixel init`
3. Click **Publish**

---

## 🧪 Kiểm tra sau khi fix

### Test 1: Verify trong Console

1. Mở website trong trình duyệt
2. Mở **DevTools** (F12) → **Console**
3. Search: `fbq('init`
4. ✅ Verify: Chỉ có **1** lần gọi `fbq('init')`

### Test 2: Verify trong Meta Pixel Helper

1. Reload trang (Ctrl+R hoặc F5)
2. Mở **Meta Pixel Helper** extension
3. ✅ Verify:
   - **KHÔNG CÒN** warning "activated 2 times"
   - Chỉ có **1** PageView event
   - Lead event không còn cảnh báo màu vàng

### Test 3: Test Lead event

1. Submit form (Lead event)
2. Mở **Meta Pixel Helper**
3. ✅ Verify:
   - Chỉ có **1** Lead event (không duplicate)
   - Lead event có **dấu tích xanh** ✅ (không còn cảnh báo)
   - Advanced Matching Parameters hiển thị đúng

---

## 📝 Lưu ý quan trọng

### ✅ Tags nên GIỮ LẠI trong GTM:

Những tag này **CHỈ track events**, không init pixel:
- ✅ `Meta Pixel - ViewContent` → `fbq('track', 'ViewContent', ...)`
- ✅ `Meta Pixel - Lead` → `fbq('track', 'Lead', ...)`
- ✅ `Meta Pixel - InitiateCheckout` → `fbq('track', 'InitiateCheckout', ...)`
- ✅ `Meta Pixel - Purchase` → `fbq('track', 'Purchase', ...)`

### ❌ Tags cần TẮT:

- ❌ `Meta Pixel - Base Code` → `fbq('init', ...)` ❌
- ❌ Bất kỳ Custom HTML tag nào có `fbq('init', ...)` ❌

---

## 🔍 Tại sao pixel đã được init từ app?

**File:** `components/MetaPixel.tsx`

```javascript
fbq('init', pixelId, {}, opts);
```

Pixel đã được init khi:
- Component `<MetaPixel />` render (trong `app/layout.tsx`)
- Page load → Component mount → `fbq('init')` fire

**→ GTM KHÔNG CẦN init lại pixel!**

GTM chỉ cần track events:
```javascript
fbq('track', 'Lead', eventParams);  // ✅ Đúng
fbq('init', pixelId);                // ❌ Sai - duplicate
```

---

## 📊 So sánh Before/After

### ❌ Before (SAI)

**Init từ 2 nơi:**
1. `components/MetaPixel.tsx` → `fbq('init', pixelId)`
2. GTM tag "Meta Pixel - Base Code" → `fbq('init', pixelId)`

**Kết quả:**
- ⚠️ Pixel init 2 lần
- ⚠️ Lead event track 2 lần
- ⚠️ Meta Pixel Helper báo warning màu vàng

### ✅ After (ĐÚNG)

**Init từ 1 nơi:**
1. `components/MetaPixel.tsx` → `fbq('init', pixelId)` ✅
2. GTM tags → Chỉ `fbq('track', ...)` ✅

**Kết quả:**
- ✅ Pixel init 1 lần
- ✅ Lead event track 1 lần
- ✅ Không còn warning
- ✅ Lead event có dấu tích xanh ✅

---

## 🚨 Nếu vẫn còn cảnh báo sau khi fix

### Kiểm tra thêm:

1. **Verify trong Console:**
   ```javascript
   // Mở DevTools → Console
   // Search: fbq('init
   // Chỉ nên có 1 lần gọi fbq('init')
   ```

2. **Check thứ tự load:**
   - Mở **Network** tab → Filter: `facebook.com/tr`
   - Xem requests: Request đầu tiên phải là PageView từ MetaPixel.tsx
   - Nếu có 2 PageView requests → Pixel init 2 lần

3. **GTM Preview Mode:**
   - Enable GTM Preview
   - Load page
   - Check **Tags Fired** tab
   - Xem tag Facebook Pixel nào fire đầu tiên
   - Verify: Tag đầu tiên không init pixel (chỉ track events)

4. **Check timing:**
   - Mở Console → Search: `fbq('init`
   - Xem timestamp của lần gọi `fbq('init')`
   - Nếu có 2 lần với timestamp khác nhau → Race condition

5. **Kiểm tra multiple Pixel IDs:**
   - Verify tất cả tags dùng cùng Pixel ID
   - Check `.env`: `NEXT_PUBLIC_META_PIXEL_ID`
   - Check GTM: Variable `Meta Pixel ID`

---

## ✅ Quick Fix Checklist

### Nếu dùng Custom HTML Tags:
- [ ] Vào GTM → Tags
- [ ] Tìm tag "Meta Pixel - Base Code"
- [ ] Pause tag (không xóa)
- [ ] Publish GTM container

### Nếu dùng Facebook Pixel Template:
- [ ] Sửa `MetaPixel.tsx`: `strategy="beforeInteractive"` (hoặc thêm delay vào GTM triggers)
- [ ] Verify tất cả tags dùng cùng Pixel ID
- [ ] Publish GTM container

### Test sau khi fix:
- [ ] Test trong Console → Verify chỉ có 1 lần `fbq('init')`
- [ ] Test trong Meta Pixel Helper → Verify không còn warning
- [ ] Submit form → Verify Lead event không duplicate
- [ ] Check Network tab → Chỉ có 1 PageView request

---

## 📚 Files liên quan

- ✅ `components/MetaPixel.tsx` - Init pixel từ app (GIỮ NGUYÊN)
- ✅ `lib/tracking.ts` - Track Lead event qua dataLayer
- ✅ `components/Hero.tsx` - Gọi `trackForm()` khi submit form
- ⚠️ **GTM Container** - Cần tắt tag "Meta Pixel - Base Code"

**Reference docs:**
- `docs/FACEBOOK_PIXEL_DUPLICATE_INIT_FIX.md` - Hướng dẫn chi tiết về duplicate pixel
- `docs/LEAD_EMAIL_UPDATE_SUMMARY.md` - Lead event với email hash

---

**Last Updated:** 2024  
**Version:** 1.0