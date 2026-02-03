# 🔍 Debug: Không nhận được email ở Advanced Matching

## 📋 Checklist Debugging

### ✅ Bước 1: Kiểm tra Code App có push `email_hash` vào dataLayer

#### 1.1 Lead Event (form_submit)

**File:** `components/Hero.tsx`

Kiểm tra dòng 107:
```typescript
await trackForm('hero_course_form', 'Course Request Form', 'hero_section', urls.length, email);
```

**Phải có:**
- ✅ Tham số cuối cùng là `email` (không phải undefined)
- ✅ Email được lấy từ form input: `const email = formData.get("email") as string;`

**Debug:**
1. Mở Console khi submit form
2. Chạy: `window.dataLayer.filter(e => e.event === 'form_submit')`
3. Kiểm tra event cuối cùng có `email_hash` không
4. Nếu không có → Email không được truyền vào `trackForm()`

---

#### 1.2 InitiateCheckout Event (begin_checkout)

**File:** `app/order/[orderCode]/page.tsx`

Kiểm tra dòng 135-140:
```typescript
trackCheckout(
  orderData.totalAmount,
  'VND',
  items,
  orderCode,
  orderData.email  // ← PHẢI CÓ EMAIL
);
```

**Phải có:**
- ✅ `orderData.email` phải có giá trị (không undefined, không rỗng)
- ✅ Email được truyền vào `trackCheckout()`

**Debug:**
1. Mở trang order (trang QR code)
2. Console: `window.dataLayer.filter(e => e.event === 'begin_checkout')`
3. Kiểm tra event có `email_hash` không
4. Nếu không có → `orderData.email` có thể undefined

**Fix nếu thiếu email:**
```typescript
// Đảm bảo orderData.email có giá trị trước khi track
if (orderData && orderData.email && orderData.email.trim()) {
  trackCheckout(
    orderData.totalAmount,
    'VND',
    items,
    orderCode,
    orderData.email.trim() // Trim để đảm bảo không có space
  );
}
```

---

#### 1.3 Purchase Event (purchase)

**File:** `app/order/[orderCode]/page.tsx`

Kiểm tra dòng 69-76:
```typescript
await trackPurchase(
  orderCode,
  paymentData.amount || orderData.totalAmount,
  'VND',
  items,
  'bank_transfer',
  orderData.email  // ← PHẢI CÓ EMAIL
);
```

**Phải có:**
- ✅ `orderData.email` phải có giá trị khi payment confirmed
- ✅ Email được truyền vào `trackPurchase()`

**Debug:**
1. Sau khi thanh toán thành công
2. Console: `window.dataLayer.filter(e => e.event === 'purchase')`
3. Kiểm tra event có `email_hash` không
4. Nếu không có → `orderData.email` có thể undefined khi payment confirmed

---

### ✅ Bước 2: Kiểm tra Variable `DLV - email_hash` trong GTM

1. **Vào GTM → Variables**
2. **Tìm:** `DLV - email_hash`
3. **Kiểm tra cấu hình:**

   - **Variable Type:** `Data Layer Variable`
   - **Data Layer Variable Name:** `email_hash` (phải chính xác, không có space)
   - **Data Layer Version:** `Version 2`
   - **Variable Name:** `DLV - email_hash`

4. **Nếu chưa có → Tạo mới:**
   - Click "New"
   - Variable Type: `Data Layer Variable`
   - Data Layer Variable Name: `email_hash`
   - Variable Name: `DLV - email_hash`
   - Save

---

### ✅ Bước 3: Kiểm tra Facebook Pixel Template Tags

#### 3.1 Meta Pixel - Lead

1. **GTM → Tags → `Meta Pixel - Lead`** (hoặc `Facebook Pixel - Lead`)
2. **Kiểm tra Trigger:** Phải là `Event - form_submit`
3. **Kiểm tra Event Name:** `Lead`
4. **Kiểm tra Advanced Matching:**
   - Scroll xuống phần `Advanced Matching` hoặc `User Data` hoặc `Customer Information Data Parameters`
   - Tìm field **Email**
   - **Phải có giá trị:** `{{DLV - email_hash}}`
   - **KHÔNG được để trống**
   - **KHÔNG được là:** `{{email_hash}}` (thiếu DLV -)

**Nếu sai → Sửa:**
- Click vào tag để edit
- Tìm field **Email**
- Điền: `{{DLV - email_hash}}`
- Save

---

#### 3.2 Meta Pixel - InitiateCheckout

1. **GTM → Tags → `Meta Pixel - InitiateCheckout`** (hoặc tương tự)
2. **Kiểm tra Trigger:** Phải là `Event - begin_checkout`
3. **Kiểm tra Event Name:** `InitiateCheckout`
4. **Kiểm tra Advanced Matching:**
   - Field **Email** = `{{DLV - email_hash}}`

**Nếu sai → Sửa tương tự như trên**

---

#### 3.3 Meta Pixel - Purchase

1. **GTM → Tags → `Meta Pixel - Purchase`** (hoặc tương tự)
2. **Kiểm tra Trigger:** Phải là `Event - purchase`
3. **Kiểm tra Event Name:** `Purchase`
4. **Kiểm tra Advanced Matching:**
   - Field **Email** = `{{DLV - email_hash}}`

**Nếu sai → Sửa tương tự như trên**

---

### ✅ Bước 4: Test trong GTM Preview Mode

1. **Mở GTM → Preview**
2. **Điền URL website**
3. **Thực hiện action:**
   - Submit form (Lead)
   - Vào trang order (InitiateCheckout)
   - Thanh toán (Purchase)

4. **Trong Preview Mode:**
   - Click vào event `form_submit` / `begin_checkout` / `purchase`
   - Vào tab **Variables**
   - Tìm: `DLV - email_hash`
   - **Kiểm tra:**
     - Có giá trị không? (64 ký tự hex)
     - Không phải `undefined`
     - Không phải empty string

5. **Trong tab Tags:**
   - Xem Facebook Pixel tags có fire không
   - Click vào tag → Xem **Tag Details**
   - Kiểm tra `User Data` có email hash không

---

### ✅ Bước 5: Test trong Facebook Test Events

1. **Vào Facebook Events Manager**
2. **Vào Test Events**
3. **Có test event code không?**
   - Nếu có → Add `?test_event_code=XXXXX` vào URL
   - Ví dụ: `https://yoursite.com/?test_event_code=TEST12345`

4. **Thực hiện action:**
   - Submit form
   - Vào trang order
   - Thanh toán

5. **Kiểm tra trong Test Events:**
   - Click vào event
   - Vào tab **Advanced Matching** hoặc **User Data**
   - **Phải có:**
     - ✅ User → email_hash (64 ký tự)
     - ✅ IP Address
     - ✅ User Agent

6. **Nếu KHÔNG có email_hash:**
   - Variable `DLV - email_hash` trong GTM Preview = undefined
   - HOẶC Facebook Pixel tag không được cấu hình đúng

---

## 🐛 Common Issues & Fixes

### Issue 1: Variable `DLV - email_hash` = undefined trong Preview Mode

**Nguyên nhân:**
- Code app không push `email_hash` vào dataLayer
- Email không được truyền vào tracking functions

**Fix:**
1. Kiểm tra Console: `window.dataLayer.filter(e => e.email_hash)`
2. Nếu không có → Email không được truyền vào `trackForm()`, `trackCheckout()`, hoặc `trackPurchase()`
3. Sửa code để đảm bảo email được truyền

---

### Issue 2: Variable có giá trị, nhưng Facebook không nhận

**Nguyên nhân:**
- Facebook Pixel Template tag chưa điền `{{DLV - email_hash}}` vào field Email
- Hoặc điền sai variable name

**Fix:**
1. Vào từng Facebook Pixel tag
2. Kiểm tra field **Email** trong Advanced Matching
3. Điền: `{{DLV - email_hash}}` (chính xác, có dấu ngoặc nhọn)

---

### Issue 3: Email hash được push trong event khác, không cùng event với Facebook tag

**Nguyên nhân:**
- `email_hash` được push trong event A
- Facebook Pixel tag fire trên event B
- Không cùng lúc → Variable undefined

**Fix:**
1. Đảm bảo `email_hash` được push **CÙNG** event với Facebook tag
2. Ví dụ: `form_submit` event phải có cả `email_hash` và Facebook Pixel tag fire cùng lúc

---

### Issue 4: Email là undefined hoặc empty string

**Nguyên nhân:**
- `orderData.email` có thể undefined khi track InitiateCheckout hoặc Purchase
- Email chưa được lưu trong orderData

**Fix:**
1. Kiểm tra `orderData.email` có giá trị không
2. Nếu undefined → Cần đảm bảo email được lưu khi tạo order
3. Thêm validation:
```typescript
if (!orderData.email || !orderData.email.trim()) {
  console.warn('Email is missing in orderData');
  return; // Không track nếu không có email
}
```

---

## ✅ Final Checklist

- [ ] Variable `DLV - email_hash` đã tạo (Data Layer Variable: `email_hash`)
- [ ] Tag `Meta Pixel - Lead` có **Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - InitiateCheckout` có **Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - Purchase` có **Email** = `{{DLV - email_hash}}`
- [ ] Code app: `trackForm()` nhận parameter `email`
- [ ] Code app: `trackCheckout()` nhận parameter `email`
- [ ] Code app: `trackPurchase()` nhận parameter `email`
- [ ] GTM Preview Mode → Variables → `DLV - email_hash` có giá trị (64 ký tự)
- [ ] Facebook Test Events → Advanced Matching → Có email_hash

---

## 🔧 Quick Fix Script

Nếu cần debug nhanh, chạy script này trong Console:

```javascript
// Check email_hash trong dataLayer
const events = window.dataLayer || [];
const eventsWithEmail = events.filter(e => e.email_hash);
console.log('Events with email_hash:', eventsWithEmail);

// Check từng event type
const formSubmit = events.filter(e => e.event === 'form_submit');
const beginCheckout = events.filter(e => e.event === 'begin_checkout');
const purchase = events.filter(e => e.event === 'purchase');

console.log('form_submit:', formSubmit[formSubmit.length - 1]);
console.log('begin_checkout:', beginCheckout[beginCheckout.length - 1]);
console.log('purchase:', purchase[purchase.length - 1]);
```
