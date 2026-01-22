# Fix: Không nhận được email ở Advanced Matching sau khi chuyển sang Facebook Pixel Template

## 🔴 Vấn đề

Sau khi chuyển sang dùng **Facebook Pixel Template** trong GTM và dùng **account GA4 khác**, không nhận được email ở **Advanced Matching** trong Facebook Test Events.

**Triệu chứng:**
- ❌ Trong Facebook Test Events → Advanced Matching → **KHÔNG có email hash**
- ❌ Chỉ thấy IP Address, User Agent (không có User → email_hash)
- ❌ Match quality thấp vì thiếu email identifier

---

## 🔍 Nguyên nhân có thể

### 1. Facebook Pixel Template chưa cấu hình User Data → Email

**Vấn đề:**
- Trong GTM, Facebook Pixel Template tags chưa điền `{{DLV - email_hash}}` vào field **User Data → Email**
- Hoặc điền sai variable name

**Giải pháp:**
- Kiểm tra và cấu hình lại **User Data → Email** trong tất cả Facebook Pixel Template tags

---

### 2. Variable `DLV - email_hash` chưa được tạo hoặc cấu hình sai

**Vấn đề:**
- Variable `DLV - email_hash` chưa được tạo trong GTM
- Hoặc Data Layer Variable Name sai (không phải `email_hash`)

**Giải pháp:**
- Tạo hoặc kiểm tra lại variable `DLV - email_hash`

---

### 3. Email hash không được push vào dataLayer

**Vấn đề:**
- Code app không push `email_hash` vào dataLayer khi fire event
- Hoặc email hash bị undefined/null

**Giải pháp:**
- Kiểm tra code app có push `email_hash` vào dataLayer không
- Verify email hash có giá trị trước khi push

---

### 4. Timing issue - Email hash chưa có khi tag fire

**Vấn đề:**
- Facebook Pixel Template tag fire **TRƯỚC** khi `email_hash` được push vào dataLayer
- Hoặc `email_hash` được push trong event khác, không cùng event với Facebook tag

**Giải pháp:**
- Đảm bảo `email_hash` được push **CÙNG** event với Facebook Pixel tag
- Ví dụ: `form_submit` event phải có cả `email_hash` và Facebook Pixel tag fire cùng lúc

---

## ✅ Giải pháp Step-by-Step

### Bước 1: Kiểm tra Variable `DLV - email_hash` trong GTM

1. **Vào GTM → Variables**
2. **Tìm variable:** `DLV - email_hash`
3. **Nếu chưa có → Tạo mới:**

   **Variable Configuration:**
   - **Variable Type:** `Data Layer Variable`
   - **Data Layer Variable Name:** `email_hash`
   - **Data Layer Version:** `Version 2`
   - **Variable Name:** `DLV - email_hash`

4. **Save**

---

### Bước 2: Kiểm tra Facebook Pixel Template Tags

Kiểm tra **TẤT CẢ** Facebook Pixel Template tags có cấu hình **User Data → Email**:

#### 2.1 Tag: Meta Pixel - Lead

1. **Vào GTM → Tags → `Meta Pixel - Lead`**
2. **Click vào tag để edit**
3. **Scroll xuống phần:** `Advanced Matching` hoặc `User Data`
4. **Kiểm tra field:** `Email`
5. **Phải có giá trị:** `{{DLV - email_hash}}`
6. **Nếu trống hoặc sai → Sửa:**
   - Điền: `{{DLV - email_hash}}`
   - Save

#### 2.2 Tag: Meta Pixel - InitiateCheckout

1. **Vào GTM → Tags → `Meta Pixel - InitiateCheckout`**
2. **Kiểm tra:** `Advanced Matching → Email` = `{{DLV - email_hash}}`
3. **Nếu sai → Sửa**

#### 2.3 Tag: Meta Pixel - Purchase

1. **Vào GTM → Tags → `Meta Pixel - Purchase`**
2. **Kiểm tra:** `Advanced Matching → Email` = `{{DLV - email_hash}}`
3. **Nếu sai → Sửa**

---

### Bước 3: Kiểm tra Code App có push `email_hash` vào dataLayer

#### 3.1 Kiểm tra Form Submit (Lead event)

**File:** `hooks/useTracking.ts`

**Code phải có:**
```typescript
const emailHash = email ? await hashEmail(email) : undefined;
trackFormSubmit(formId, formName, formLocation, courseCount, emailHash);
```

**Verify:**
- ✅ `trackFormSubmit()` nhận parameter `emailHash`
- ✅ `emailHash` được hash từ email user nhập

**File:** `lib/tracking.ts`

**Code phải có:**
```typescript
export function trackFormSubmit(
  formId: string,
  formName: string,
  formLocation?: string,
  courseCount?: number,
  emailHash?: string  // ← Phải có parameter này
): void {
  pushToDataLayer({
    event: 'form_submit',
    form_id: formId,
    form_name: formName,
    form_location: formLocation,
    course_count: courseCount,
    email_hash: emailHash,  // ← Phải push vào dataLayer
  });
}
```

#### 3.2 Kiểm tra Begin Checkout (InitiateCheckout event)

**File:** `hooks/useTracking.ts`

**Code phải có:**
```typescript
const emailHash = email ? await hashEmail(email) : undefined;
trackBeginCheckout(value, currency, items, transactionId, emailHash);
```

**File:** `lib/tracking.ts`

**Code phải có:**
```typescript
export function trackBeginCheckout(
  value: number,
  currency: string,
  items: Array<...>,
  transactionId?: string,
  emailHash?: string  // ← Phải có
): void {
  pushToDataLayer({
    event: 'begin_checkout',
    currency: currency,
    value: value,
    items: items,
    transaction_id: transactionId,
    email_hash: emailHash,  // ← Phải push
  });
}
```

#### 3.3 Kiểm tra Purchase event

**File:** `lib/tracking.ts`

**Code phải có:**
```typescript
export function trackPurchase(
  transactionId: string,
  value: number,
  currency: string,
  items: Array<...>,
  paymentType?: string,
  emailHash?: string  // ← Phải có
): void {
  pushToDataLayer({
    event: 'purchase',
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
    email_hash: emailHash,  // ← Phải push
  });
}
```

---

### Bước 4: Test trong GTM Preview Mode

1. **Vào GTM → Preview**
2. **Nhập URL website → Connect**
3. **Trigger event** (ví dụ: Submit form)
4. **Trong Preview Mode:**

   **a. Kiểm tra Variables:**
   - Click vào event `form_submit` (hoặc `begin_checkout`, `purchase`)
   - Vào tab **Variables**
   - Tìm: `DLV - email_hash`
   - **Phải có giá trị:** SHA-256 hash (64 ký tự hex, lowercase)
   - **Nếu undefined/null → Vấn đề ở code app**

   **b. Kiểm tra Tag:**
   - Click vào tag `Meta Pixel - Lead` (hoặc InitiateCheckout, Purchase)
   - Vào tab **Variables**
   - Tìm: `User Data` hoặc `Advanced Matching`
   - **Phải có:** `em` = email hash value
   - **Nếu trống → Vấn đề ở cấu hình Template**

   **c. Kiểm tra Data Layer:**
   - Vào tab **Data Layer**
   - Tìm event object có `email_hash`
   - **Phải có:** `email_hash: "sha256..."` (64 ký tự)
   - **Nếu không có → Vấn đề ở code app**

---

### Bước 5: Test trong Facebook Test Events

1. **Vào Facebook Events Manager**
2. **Chọn Pixel của bạn**
3. **Vào Test Events**
4. **Trigger event trên website** (ví dụ: Submit form)
5. **Xem event trong Test Events:**

   **Kiểm tra Advanced Matching:**
   - Click vào event (Lead, InitiateCheckout, Purchase)
   - Scroll xuống **Advanced Matching**
   - **Phải thấy:**
     - ✅ **User → em** = email hash (64 ký tự hex)
     - ✅ IP Address
     - ✅ User Agent
   - **Nếu không có User → em → Vấn đề ở GTM Template cấu hình**

---

## 🐛 Troubleshooting

### Vấn đề 1: Variable `DLV - email_hash` = undefined trong Preview Mode

**Nguyên nhân:**
- Code app không push `email_hash` vào dataLayer
- Hoặc push sai key name (không phải `email_hash`)

**Giải pháp:**
1. Kiểm tra code app có gọi `trackFormSubmit(..., emailHash)` với `emailHash` không
2. Kiểm tra `lib/tracking.ts` có push `email_hash: emailHash` không
3. Test trong Console:
   ```javascript
   // Sau khi submit form, check:
   console.log(window.dataLayer);
   // Tìm object có event: 'form_submit'
   // Phải có: email_hash: "sha256..."
   ```

---

### Vấn đề 2: Variable `DLV - email_hash` có giá trị, nhưng Template không nhận

**Nguyên nhân:**
- Facebook Pixel Template chưa cấu hình **User Data → Email**
- Hoặc điền sai variable name

**Giải pháp:**
1. Vào tag → **Advanced Matching** section
2. Điền: `{{DLV - email_hash}}` vào field **Email**
3. **Lưu ý:** Phải dùng `{{DLV - email_hash}}` (có dấu ngoặc nhọn và tên variable đúng)
4. Save tag

---

### Vấn đề 3: Email hash có trong Preview Mode, nhưng không có trong Facebook Test Events

**Nguyên nhân:**
- Facebook Pixel Template không gửi email hash đúng cách
- Hoặc email hash format sai (không phải SHA-256, 64 ký tự hex)

**Giải pháp:**
1. Kiểm tra email hash format:
   ```javascript
   // Trong Console:
   console.log({{DLV - email_hash}});
   // Phải là: 64 ký tự hex (0-9, a-f), lowercase
   // Ví dụ: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
   ```

2. Kiểm tra Facebook Pixel Template có validate email hash không
3. Xem Network request:
   - DevTools → Network → Filter: `facebook.com/tr`
   - Click vào request
   - Xem **Payload** → **Form Data**
   - Tìm: `ud[em]` = email hash
   - **Nếu không có → Template không gửi email hash**

---

### Vấn đề 4: Chỉ một số events có email, events khác không có

**Nguyên nhân:**
- Một số tags chưa cấu hình **User Data → Email**
- Hoặc một số events không push `email_hash` vào dataLayer

**Giải pháp:**
1. Kiểm tra **TẤT CẢ** Facebook Pixel Template tags:
   - Meta Pixel - Lead
   - Meta Pixel - InitiateCheckout
   - Meta Pixel - Purchase
2. Đảm bảo **TẤT CẢ** đều có **User Data → Email** = `{{DLV - email_hash}}`
3. Kiểm tra code app có push `email_hash` cho tất cả events không

---

## 📋 Checklist

### GTM Configuration
- [ ] Variable `DLV - email_hash` đã tạo (Data Layer Variable: `email_hash`)
- [ ] Tag `Meta Pixel - Lead` có **User Data → Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - InitiateCheckout` có **User Data → Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - Purchase` có **User Data → Email** = `{{DLV - email_hash}}`

### Code App
- [ ] `trackFormSubmit()` nhận parameter `emailHash?: string`
- [ ] `trackFormSubmit()` push `email_hash: emailHash` vào dataLayer
- [ ] `trackBeginCheckout()` nhận parameter `emailHash?: string`
- [ ] `trackBeginCheckout()` push `email_hash: emailHash` vào dataLayer
- [ ] `trackPurchase()` nhận parameter `emailHash?: string`
- [ ] `trackPurchase()` push `email_hash: emailHash` vào dataLayer
- [ ] `hooks/useTracking.ts` hash email trước khi gọi tracking functions

### Testing
- [ ] GTM Preview Mode → Variables → `DLV - email_hash` có giá trị
- [ ] GTM Preview Mode → Tag → User Data có `em` = email hash
- [ ] Facebook Test Events → Advanced Matching → User → `em` có email hash
- [ ] Network request → `ud[em]` có email hash trong payload

---

## 🎯 Kết quả mong đợi

Sau khi fix:

✅ **GTM Preview Mode:**
- Variable `DLV - email_hash` có giá trị (64 ký tự hex)
- Tag → User Data → `em` = email hash

✅ **Facebook Test Events:**
- Advanced Matching → **User → em** = email hash (64 ký tự hex)
- Advanced Matching có: IP Address, User Agent, **User (email_hash)**

✅ **Network Request:**
- Request đến `facebook.com/tr` có `ud[em]` = email hash trong payload

---

## 📚 Tài liệu tham khảo

- [Facebook Pixel Template Migration Guide](./GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md)
- [Advanced Matching Fix](./ADVANCED_MATCHING_FIX.md)
- [Meta Pixel Email Best Practices](./META_PIXEL_EMAIL_VALUE_BEST_PRACTICES.md)

---

**Last Updated:** 2024  
**Author:** Troubleshooting Guide  
**Version:** 1.0
