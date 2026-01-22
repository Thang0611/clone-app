# 🔧 Fix Lead Event Duplicate - Gửi 2 Lần

## 🔴 Vấn đề

Khi click "Kiểm tra khóa học" (submit form), Lead event được gửi **2 lần** tới Facebook Pixel:
- Lần 1: Khi submit form
- Lần 2: Khi show thông tin khóa học (hoặc cùng lúc)

**Hậu quả:**
- Conversion data sai số (double counting)
- Budget allocation không chính xác
- Ad performance tracking bị lệch

---

## 🔍 Nguyên nhân có thể

### 1. Duplicate trong Code (Đã fix)

**File:** `components/Hero.tsx`

**Trước (SAI):**
- `trackForm()` được gọi mỗi lần submit → có thể bị gọi 2 lần

**Sau (ĐÚNG):**
- Thêm `formSubmitTracked` ref để prevent duplicate
- Chỉ track Lead 1 lần mỗi lần submit form
- Reset flag khi modal đóng để cho phép track lại khi submit lại

### 2. Duplicate trong GTM (Cần kiểm tra)

**Có thể có:**
- 2 tags Facebook Pixel cùng listen event `form_submit`
- 1 tag Custom HTML + 1 tag Template cùng track Lead
- Button click auto-detection của Facebook cũng track Lead

---

## ✅ Giải pháp đã áp dụng

### Fix trong Code

**File:** `components/Hero.tsx`

1. **Thêm ref để track:**
```typescript
const formSubmitTracked = useRef(false); // Prevent duplicate Lead event
```

2. **Prevent duplicate khi submit:**
```typescript
// Prevent duplicate Lead event - chỉ track 1 lần mỗi lần submit form
if (!formSubmitTracked.current) {
  await trackForm('hero_course_form', 'Course Request Form', 'hero_section', urls.length, email);
  formSubmitTracked.current = true;
}
```

3. **Reset flag khi modal đóng:**
```typescript
// Reset form submit tracking flag when modal closes
useEffect(() => {
  if (!isModalOpen) {
    formSubmitTracked.current = false;
  }
}, [isModalOpen]);
```

---

## 🔍 Kiểm tra GTM - Duplicate Tags

### Bước 1: Kiểm tra có bao nhiêu tags track Lead

1. Vào [Google Tag Manager](https://tagmanager.google.com)
2. Chọn container của bạn
3. Vào **Tags**
4. Search: `Lead` hoặc `form_submit`
5. Kiểm tra các tags:

**Tags có thể track Lead:**
- `Meta Pixel - Lead` (Facebook Pixel Template)
- `Meta Pixel - Lead` (Custom HTML) - nếu còn
- Bất kỳ tag nào có trigger `Event - form_submit`

### Bước 2: Kiểm tra triggers

Với mỗi tag, kiểm tra **Trigger:**

**Trigger có thể fire Lead:**
- `Event - form_submit` → Tag này sẽ fire khi có event `form_submit` trong dataLayer
- Button Click Auto-detection (Facebook tự động)

### Bước 3: Xác định duplicate

**Nếu có 2 tags cùng:**
- Listen event: `Event - form_submit`
- Track event: `Lead`

→ **Đây là nguyên nhân duplicate!**

---

## ✅ Fix trong GTM

### Option 1: Pause/Disable duplicate tag

1. Tìm tag duplicate (ví dụ: có cả Custom HTML và Template)
2. **Pause** tag cũ (Custom HTML) - giữ Template
3. **Publish** container

### Option 2: Kiểm tra Button Click Auto-detection

1. Vào **Tags**
2. Tìm tag có tên như:
   - `Facebook Pixel - Button Click Auto-detected`
   - `Meta Pixel - Auto Click`
   - Hoặc bất kỳ tag nào có trigger `All Pages` hoặc `Click` và track `Lead`

3. **Pause** tag này nếu có

### Option 3: Thêm condition vào trigger

Nếu muốn giữ cả 2 tags nhưng chỉ track 1 lần:

1. Vào tag → **Triggering**
2. Thêm **Trigger Condition:**
   - **Condition Type:** Custom Event
   - **Condition:** `{{Event}}` equals `form_submit`
   - **Additional Condition:** `{{form_id}}` equals `hero_course_form` (chỉ track form này)

---

## 🧪 Test sau khi fix

### Test 1: Verify trong Console

1. Mở website
2. Mở **DevTools** → **Console**
3. Submit form
4. Check `window.dataLayer`:
   ```javascript
   window.dataLayer.filter(e => e.event === 'form_submit')
   ```
5. ✅ Verify: Chỉ có **1** event `form_submit`

### Test 2: Verify trong GTM Preview

1. Enable GTM Preview Mode
2. Submit form
3. Check **Tags Fired** tab
4. ✅ Verify: Chỉ có **1** tag "Meta Pixel - Lead" fire

### Test 3: Verify trong Meta Pixel Helper

1. Reload trang
2. Mở **Meta Pixel Helper** extension
3. Submit form
4. ✅ Verify:
   - Chỉ có **1** Lead event
   - Lead event có **dấu tích xanh** ✅
   - Không còn duplicate

### Test 4: Verify trong Network tab

1. Mở **DevTools** → **Network**
2. Filter: `facebook.com/tr`
3. Submit form
4. ✅ Verify: Chỉ có **1** request với event Lead

---

## 📊 So sánh Before/After

### ❌ Before (SAI)

**Lead event được track 2 lần:**
- Lần 1: Từ `trackForm()` trong code
- Lần 2: Từ duplicate tag trong GTM hoặc button click auto-detection

**Kết quả:**
- ⚠️ Lead event track 2 lần
- ⚠️ Conversion data sai số
- ⚠️ Meta Pixel Helper có thể không báo nhưng data vẫn duplicate

### ✅ After (ĐÚNG)

**Lead event được track 1 lần:**
- Code: Prevent duplicate với `formSubmitTracked` ref
- GTM: Chỉ có 1 tag track Lead

**Kết quả:**
- ✅ Lead event track 1 lần
- ✅ Conversion data chính xác
- ✅ Meta Pixel Helper hiển thị đúng

---

## 🔍 Debug Steps

### Step 1: Identify duplicate source

**Trong Console:**
```javascript
// Check form_submit events
console.log('Form submit events:', 
  window.dataLayer.filter(e => e.event === 'form_submit')
);
```

**Trong Network tab:**
- Filter: `facebook.com/tr`
- Xem requests → Nếu có 2 requests với event Lead → Duplicate

### Step 2: Check GTM tags

**Trong GTM Preview:**
1. Load page
2. Submit form
3. Check **Tags Fired** tab
4. Đếm số tag "Meta Pixel - Lead" fire → Nếu > 1 → Duplicate

### Step 3: Check button click auto-detection

**Trong Meta Pixel Helper:**
1. Submit form
2. Xem Lead event details
3. Check **Setup Method:**
   - `Manual` → Từ code/GTM
   - `Automatic` → Facebook tự động detect → Có thể duplicate với Manual

---

## ⚠️ Lưu ý quan trọng

### 1. Button Click Auto-detection của Facebook

Facebook có thể tự động detect button click và track Lead nếu:
- Button có text như "Submit", "Send", "Kiểm tra", etc.
- Button nằm trong form

**Giải pháp:**
- Tắt auto-detection trong Facebook Events Manager
- Hoặc đảm bảo chỉ có 1 nguồn track (code hoặc auto, không phải cả 2)

### 2. Multiple GTM containers

**Nếu có nhiều GTM containers:**
- Kiểm tra tất cả containers
- Đảm bảo không có container nào khác track Lead

### 3. Event ID deduplication

**Nếu dùng Conversion API:**
- Đảm bảo `event_id` giống nhau giữa Pixel và API
- Facebook sẽ tự động deduplicate

---

## ✅ Quick Fix Checklist

- [x] Thêm `formSubmitTracked` ref trong Hero component
- [x] Prevent duplicate trong `handleSubmit`
- [x] Reset flag khi modal đóng
- [ ] Kiểm tra GTM → Tìm tags track Lead
- [ ] Verify chỉ có 1 tag track Lead
- [ ] Pause duplicate tags nếu có
- [ ] Publish GTM container
- [ ] Test trong Console → Verify chỉ có 1 `form_submit` event
- [ ] Test trong GTM Preview → Verify chỉ có 1 tag fire
- [ ] Test trong Meta Pixel Helper → Verify chỉ có 1 Lead event

---

## 📚 Files liên quan

- ✅ `components/Hero.tsx` - Prevent duplicate với `formSubmitTracked` ref
- ✅ `hooks/useTracking.ts` - `trackForm()` function
- ✅ `lib/tracking.ts` - `trackFormSubmit()` push event vào dataLayer
- ⚠️ **GTM Container** - Cần kiểm tra duplicate tags

**Reference docs:**
- `docs/LEAD_EVENT_WARNING_FIX.md` - Fix warning "Pixel activated 2 times"
- `docs/FACEBOOK_PIXEL_DUPLICATE_INIT_FIX.md` - Fix duplicate pixel init

---

**Last Updated:** 2024  
**Version:** 1.0