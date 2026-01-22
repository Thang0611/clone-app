# Meta Pixel - Email Hash & Value Best Practices

## Tổng quan

Theo chuẩn Meta Pixel, **email_hash** và **value (total price)** là 2 thông tin QUAN TRỌNG NHẤT cho Advanced Matching và conversion tracking.

---

## 1. Email Hash (Advanced Matching)

### Tại sao quan trọng?

- **Advanced Matching** giúp Facebook match user tốt hơn → tăng match quality
- Email hash là identifier mạnh nhất (tốt hơn IP, User Agent)
- Cải thiện conversion tracking và attribution

### Cách hash email (SHA-256)

```javascript
// App code: lib/tracking.ts
export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Quan trọng:**
- ✅ Normalize email: `toLowerCase().trim()` trước khi hash
- ✅ Dùng SHA-256 (không phải MD5)
- ✅ Hash trên client-side (browser) hoặc server-side

### Gửi email_hash trong Data Layer

```javascript
// App code: lib/tracking.ts
export function trackBeginCheckout(
  value: number,
  currency: string,
  items: Array<...>,
  transactionId?: string,
  emailHash?: string  // ← Thêm emailHash
): void {
  pushToDataLayer({
    event: 'begin_checkout',
    value: value,
    currency: currency,
    items: items,
    email_hash: emailHash,  // ← Push vào data layer
  });
}
```

### Gửi email_hash trong GTM Tag

```html
<script>
// Lấy email_hash từ data layer
var emailHash = {{DLV - email_hash}};

// Prepare event parameters
var eventParams = {
  value: Number({{DLV - value}}) || 0,
  currency: '{{DLV - currency}}',
  contents: contents,
  content_ids: contentIds
};

// Add email_hash for Advanced Matching
if (emailHash && emailHash.trim() !== '') {
  eventParams.user_data = {
    em: emailHash  // ← Gửi trong user_data.em
  };
}

fbq('track', 'InitiateCheckout', eventParams);
</script>
```

**Quan trọng:**
- ✅ Gửi trong `user_data.em` (không phải `email_hash` trực tiếp)
- ✅ Chỉ gửi nếu có `email_hash` (không gửi empty string)
- ✅ Meta Pixel sẽ tự động xử lý Advanced Matching

---

## 2. Value (Total Price)

### Tại sao quan trọng?

- **Value** là số tiền conversion → dùng để tính ROAS, revenue
- Phải là **Number** (không phải string) → Meta Pixel yêu cầu
- Phải đúng format → không có dấu phẩy, không có ký tự

### Format đúng

```javascript
// ✅ ĐÚNG - Number
value: 50000

// ❌ SAI - String
value: "50000"
value: "50,000"
value: "50000 VND"
```

### Gửi value trong Data Layer

```javascript
// App code: lib/tracking.ts
pushToDataLayer({
  event: 'begin_checkout',
  value: 50000,  // ← Number, không phải string
  currency: 'VND',
  items: items
});
```

### Gửi value trong GTM Tag

```html
<script>
// Convert sang Number để đảm bảo format đúng
var eventParams = {
  value: Number({{DLV - value}}) || 0,  // ← Convert sang Number
  currency: '{{DLV - currency}}' || 'VND',
  contents: contents,
  content_ids: contentIds
};

fbq('track', 'InitiateCheckout', eventParams);
</script>
```

**Quan trọng:**
- ✅ Luôn convert `{{DLV - value}}` sang Number: `Number({{DLV - value}})`
- ✅ Có fallback: `|| 0` để tránh NaN
- ✅ `item_price` trong `contents` cũng phải là Number

---

## 3. Flow hoàn chỉnh

### Initiate Checkout

1. **User nhập email** → `Hero.tsx`
2. **User mở modal checkout** → `CourseModal.tsx`
3. **App hash email** → `hashEmail(email)`
4. **App push data layer:**
   ```javascript
   {
     event: 'begin_checkout',
     value: 50000,           // Number
     currency: 'VND',
     items: [...],
     email_hash: 'sha256...' // SHA-256 hash
   }
   ```
5. **GTM tag nhận và gửi:**
   ```javascript
   fbq('track', 'InitiateCheckout', {
     value: 50000,
     currency: 'VND',
     contents: [...],
     content_ids: [...],
     user_data: {
       em: 'sha256...'  // Advanced Matching
     }
   });
   ```

### Purchase

1. **Payment success** → `order/[orderCode]/page.tsx`
2. **App hash email** → `hashEmail(orderData.email)`
3. **App push data layer:**
   ```javascript
   {
     event: 'purchase',
     transaction_id: 'DH000050',
     value: 50000,           // Number
     currency: 'VND',
     items: [...],
     email_hash: 'sha256...' // SHA-256 hash
   }
   ```
4. **GTM tag nhận và gửi:**
   ```javascript
   fbq('track', 'Purchase', {
     value: 50000,
     currency: 'VND',
     contents: [...],
     content_ids: [...],
     user_data: {
       em: 'sha256...'  // Advanced Matching
     }
   });
   ```

---

## 4. Kiểm tra trong Facebook Test Events

### Initiate Checkout

✅ **Parameters:**
- `value`: `50000` (Number, không phải string)
- `currency`: `"VND"`
- `contents`: `[{id: "6168777", quantity: 1, item_price: 50000}]`
- `content_ids`: `["6168777"]`

✅ **Advanced Matching → User:**
- `em`: `"sha256_hash_here"` (SHA-256 hashed email)

### Purchase

✅ **Parameters:**
- `value`: `50000` (Number, không phải string)
- `currency`: `"VND"`
- `contents`: `[{id: "6168777", quantity: 1, item_price: 50000}]`
- `content_ids`: `["6168777"]`

✅ **Advanced Matching → User:**
- `em`: `"sha256_hash_here"` (SHA-256 hashed email)

---

## 5. Checklist

### Source Code
- [x] `trackBeginCheckout()` nhận `emailHash` parameter
- [x] `trackPurchase()` nhận `emailHash` parameter
- [x] `useTracking.trackCheckout()` hash email trước khi gửi
- [x] `CourseModal` gửi email khi track checkout
- [x] `value` được push là Number (không phải string)

### GTM Configuration
- [ ] Variable `DLV - email_hash` đã tạo
- [ ] Tag `Meta Pixel - InitiateCheckout` có `user_data.em`
- [ ] Tag `Meta Pixel - Purchase` có `user_data.em`
- [ ] Tag convert `value` sang Number: `Number({{DLV - value}})`
- [ ] Tag convert `item_price` sang Number

### Testing
- [ ] Test trong GTM Preview → Verify `email_hash` có trong data layer
- [ ] Test trong GTM Preview → Verify `value` là Number
- [ ] Test trong Facebook Test Events → Verify Advanced Matching có `em`
- [ ] Test trong Facebook Test Events → Verify `value` là Number

---

## 6. Troubleshooting

### Vấn đề: Advanced Matching không có email

**Nguyên nhân:**
1. `email_hash` không được push vào data layer
2. GTM tag không gửi `user_data.em`
3. Email chưa được hash đúng format

**Cách fix:**
1. Kiểm tra Console: `window.dataLayer` có `email_hash`?
2. Kiểm tra GTM Preview → Variables → `DLV - email_hash` có giá trị?
3. Kiểm tra Network tab → Request `facebook.com/tr` có `user_data.em`?
4. Verify email hash format: 64 ký tự hex (SHA-256)

### Vấn đề: Value là string thay vì Number

**Nguyên nhân:**
1. App push `value` là string
2. GTM tag không convert sang Number

**Cách fix:**
1. Kiểm tra app code: `value: 50000` (không phải `value: "50000"`)
2. Kiểm tra GTM tag: `value: Number({{DLV - value}})` (có `Number()`)

### Vấn đề: Email hash không match

**Nguyên nhân:**
1. Email không được normalize (có uppercase, spaces)
2. Hash algorithm không đúng (dùng MD5 thay vì SHA-256)

**Cách fix:**
1. Normalize email: `email.toLowerCase().trim()` trước khi hash
2. Dùng SHA-256: `crypto.subtle.digest('SHA-256', ...)`

---

## 7. Tham chiếu

- **Meta Pixel Documentation:** [Advanced Matching](https://www.facebook.com/business/help/611774685654668)
- **Source Code:**
  - `lib/tracking.ts` - Hash email và push data layer
  - `hooks/useTracking.ts` - React hook cho tracking
  - `components/CourseModal.tsx` - Track checkout với email
  - `app/order/[orderCode]/page.tsx` - Track purchase với email
- **GTM Tags:**
  - `docs/GTM_TAGS_COPY_PASTE.md` - Code ready to copy
  - `docs/TRACKING_GTM_TAGS_REFERENCE.md` - Full reference

---

## 8. Best Practices Summary

1. ✅ **Email Hash:**
   - Normalize: `toLowerCase().trim()`
   - Hash: SHA-256
   - Gửi trong: `user_data.em`
   - Chỉ gửi nếu có (không gửi empty)

2. ✅ **Value (Total Price):**
   - Format: Number (không phải string)
   - Convert: `Number({{DLV - value}})`
   - Fallback: `|| 0`
   - `item_price` cũng phải là Number

3. ✅ **Testing:**
   - GTM Preview → Verify data layer
   - Facebook Test Events → Verify Advanced Matching
   - Network tab → Verify request parameters
