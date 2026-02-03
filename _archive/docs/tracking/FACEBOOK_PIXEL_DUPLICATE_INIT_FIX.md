# Fix: Facebook Pixel Activated 2 Times - Duplicate Initialization

## 🔴 Vấn đề

Meta Pixel Helper báo cảnh báo:
> **"The Facebook pixel activated 2 times on this web page, which can cause errors in your event tracking"**

**Hậu quả:**
- Events bị track 2 lần (duplicate)
- Conversion data sai số
- Budget allocation sai
- Ad performance tracking không chính xác

---

## 🔍 Nguyên nhân

Facebook Pixel đang được **init 2 lần** từ 2 nơi khác nhau:

### 1. ✅ Init từ App (ĐÚNG - Giữ lại)

**File:** `components/MetaPixel.tsx`
```javascript
fbq('init', pixelId, {}, opts);
```

**Khi nào fire:**
- Page load → Component render → `fbq('init')` fire

---

### 2. ❌ Init từ GTM (SAI - Cần tắt)

**Có thể có trong GTM:**
- Tag **"Meta Pixel - Base Code"** (Custom HTML)
- Hoặc Custom HTML tag khác gọi `fbq('init', ...)`

**Khi nào fire:**
- GTM load → Tag fire → `fbq('init')` fire lần 2

---

## ✅ Giải pháp

### Option 1: Tắt tag "Meta Pixel - Base Code" trong GTM (KHUYẾN NGHỊ)

**Lý do:**
- Pixel đã được init từ app (`MetaPixel.tsx`)
- GTM chỉ cần track events (`fbq('track', ...)`)
- Không cần init lại trong GTM

**Các bước:**

1. **Vào Google Tag Manager**
   - Đăng nhập [tagmanager.google.com](https://tagmanager.google.com)
   - Chọn container của bạn

2. **Tìm tag "Meta Pixel - Base Code"**
   - Vào **Tags** → Tìm tag có tên:
     - `Meta Pixel - Base Code`
     - `Facebook Pixel - Base Code`
     - Hoặc bất kỳ tag nào có code: `fbq('init', ...)`

3. **Pause/Disable tag**
   - Click vào tag
   - Click **Pause** (hoặc **Disable**)
   - **KHÔNG XÓA** - Giữ lại để reference

4. **Publish container**
   - Click **Submit** → **Publish**

---

### Option 2: Kiểm tra Custom HTML tags khác

**Tìm tất cả tags có `fbq('init')`:**

1. **Vào Tags trong GTM**
2. **Search:** `fbq('init` hoặc `fbq("init`
3. **Kiểm tra từng tag:**
   - Nếu có `fbq('init', ...)` → **Pause**
   - Chỉ giữ tags có `fbq('track', ...)` (không có `init`)

---

## 🔧 Cách kiểm tra trong GTM

### Bước 1: Tìm tags có `fbq('init')`

**Trong GTM:**
1. Vào **Tags**
2. Click **Filter** → **Search**
3. Search: `init` hoặc `fbq`
4. Xem tất cả tags có chứa từ khóa này

**Hoặc kiểm tra thủ công:**
- Mở từng tag
- Xem code có `fbq('init', ...)` không
- Nếu có → Pause

---

### Bước 2: Verify trong Preview Mode

**Test trong GTM Preview:**

1. **Enable Preview Mode**
   - Click **Preview** ở góc trên bên phải
   - Nhập URL website

2. **Check Tags Fired**
   - Xem tab **Tags Fired**
   - Tìm tag có `fbq('init')`
   - Verify chỉ có **1** tag init pixel

3. **Check Console**
   - Mở DevTools → Console
   - Search: `fbq('init`
   - Verify chỉ có **1** lần gọi `fbq('init')`

---

### Bước 3: Verify trong Meta Pixel Helper

**Sau khi fix:**

1. **Reload page**
2. **Mở Meta Pixel Helper extension**
3. **Verify:**
   - ✅ Không còn warning "activated 2 times"
   - ✅ Chỉ có **1** PageView event
   - ✅ Events không bị duplicate

---

## 📊 So sánh Before/After

### Before (❌ SAI)

**Init từ 2 nơi:**
1. `components/MetaPixel.tsx` → `fbq('init', pixelId)`
2. GTM tag "Meta Pixel - Base Code" → `fbq('init', pixelId)`

**Kết quả:**
- Pixel init 2 lần
- Events bị track 2 lần
- Meta Pixel Helper báo warning

---

### After (✅ ĐÚNG)

**Init từ 1 nơi:**
1. `components/MetaPixel.tsx` → `fbq('init', pixelId)` ✅
2. GTM tags → Chỉ `fbq('track', ...)` ✅

**Kết quả:**
- Pixel init 1 lần
- Events track 1 lần
- Không còn warning

---

## 🧪 Testing Checklist

### Test 1: Verify chỉ có 1 lần init

- [ ] Mở DevTools → Console
- [ ] Search: `fbq('init`
- [ ] Verify chỉ có **1** lần gọi `fbq('init')`

### Test 2: Verify trong GTM Preview

- [ ] Enable GTM Preview Mode
- [ ] Load page
- [ ] Check Tags Fired
- [ ] Verify không có tag nào gọi `fbq('init')` (chỉ có track events)

### Test 3: Verify trong Meta Pixel Helper

- [ ] Reload page
- [ ] Mở Meta Pixel Helper
- [ ] Verify không còn warning "activated 2 times"
- [ ] Verify chỉ có **1** PageView event

### Test 4: Verify events không duplicate

- [ ] Submit form (Lead event)
- [ ] Check Meta Pixel Helper
- [ ] Verify chỉ có **1** Lead event (không duplicate)

---

## 📝 Cấu hình GTM đúng

### Tags nên có trong GTM:

✅ **Giữ lại (chỉ track events):**
- `Meta Pixel - ViewContent` → `fbq('track', 'ViewContent', ...)`
- `Meta Pixel - Lead` → `fbq('track', 'Lead', ...)`
- `Meta Pixel - InitiateCheckout` → `fbq('track', 'InitiateCheckout', ...)`
- `Meta Pixel - Purchase` → `fbq('track', 'Purchase', ...)`

❌ **Pause/Disable (init pixel):**
- `Meta Pixel - Base Code` → `fbq('init', ...)` ❌
- Bất kỳ Custom HTML nào có `fbq('init', ...)` ❌

---

## ⚠️ Lưu ý quan trọng

### 1. Không init pixel trong GTM

**Sai:**
```html
<!-- GTM Custom HTML - SAI -->
<script>
fbq('init', '{{Meta Pixel ID}}');
</script>
```

**Đúng:**
- Pixel đã được init từ app (`MetaPixel.tsx`)
- GTM chỉ track events

---

### 2. Nếu dùng Facebook Pixel Template trong GTM

**Template tự động:**
- Template tự động check pixel đã init chưa
- Nếu chưa init → Template sẽ init
- Nếu đã init → Template chỉ track events

**→ Vẫn có thể bị duplicate nếu:**
- App init pixel (`MetaPixel.tsx`)
- Template cũng init pixel (nếu detect chưa init)

**Giải pháp:**
- Đảm bảo app init pixel trước khi GTM load
- Hoặc tắt init trong Template (nếu có option)

---

### 3. Check multiple containers

**Nếu có nhiều GTM containers:**
- Check tất cả containers
- Đảm bảo không có container nào init pixel

---

## 🎯 Kết quả mong đợi

Sau khi fix:

✅ **Meta Pixel Helper:**
- Không còn warning "activated 2 times"
- Chỉ có 1 PageView event
- Events không duplicate

✅ **Tracking:**
- Events track chính xác (không duplicate)
- Conversion data đúng
- Ad performance tracking chính xác

✅ **Performance:**
- Không có duplicate requests
- Faster page load (ít hơn 1 request)

---

## 📚 Files liên quan

### Files đã đúng (giữ nguyên):
1. ✅ `components/MetaPixel.tsx` - Init pixel từ app (1 lần)
2. ✅ `app/layout.tsx` - Import MetaPixel component
3. ✅ `app/order/[orderCode]/page.tsx` - Dùng `fbq('set', 'user', ...)` (không init)

### Files cần kiểm tra:
1. ⚠️ **GTM Container** - Check tags có `fbq('init')` không

### Files reference:
- `docs/TRACKING_ONE_PIXEL_ONLY.md` - Hướng dẫn về duplicate pixel
- `docs/METAPIXEL_COMPONENT_ANALYSIS.md` - Phân tích MetaPixel component
- `docs/FACEBOOK_PIXEL_EMAIL_ERROR_FIX.md` - Fix email error

---

## 🔍 Debug Steps

### Step 1: Identify duplicate source

**Trong Console:**
```javascript
// Check how many times fbq('init') was called
console.log('Pixel init count:', window._fbq ? window._fbq.queue.length : 0);
```

**Trong Network tab:**
- Filter: `facebook.com/tr`
- Check requests → Nếu có 2 requests với cùng event → Duplicate

---

### Step 2: Check GTM tags

**Trong GTM Preview:**
1. Load page
2. Check **Tags Fired** tab
3. Tìm tag có `fbq('init')`
4. Note tag name và trigger

---

### Step 3: Fix duplicate

**Nếu duplicate từ GTM:**
1. Pause tag trong GTM
2. Publish container
3. Test lại

**Nếu duplicate từ code:**
1. Check `components/MetaPixel.tsx` - Chỉ có 1 lần init
2. Check không có component nào khác init pixel

---

## ✅ Quick Fix Checklist

- [ ] Vào GTM → Tags
- [ ] Tìm tag "Meta Pixel - Base Code" (hoặc tag có `fbq('init')`)
- [ ] Pause tag
- [ ] Publish GTM container
- [ ] Test trong Meta Pixel Helper → Verify không còn warning
- [ ] Test events → Verify không duplicate

---

**Last Updated:** $(date)  
**Version:** 1.0
