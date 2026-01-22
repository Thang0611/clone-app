# Fix: Facebook Pixel Email Error - Invalid Email Format

## 🔴 Vấn đề

Facebook Events Manager báo lỗi:
> **"Thêm địa chỉ email hợp lệ vào Pixel"**
> 
> "Địa chỉ email bạn cung cấp cùng với pixel không hợp lệ và có thể không đúng định dạng."

---

## 🔍 Nguyên nhân

### Vấn đề trong `components/MetaPixel.tsx` (dòng 49):

```javascript
fbq('init', pixelId, {em: '{{DLV - email_hash}}' }, opts);
```

**Vấn đề:**
1. ❌ `{{DLV - email_hash}}` là **GTM variable syntax**, không phải JavaScript
2. ❌ Khi render trong React component, nó trở thành **literal string** `'{{DLV - email_hash}}'`
3. ❌ Facebook nhận được email hash = `'{{DLV - email_hash}}'` → **Invalid format**
4. ❌ Facebook không thể parse → Báo lỗi "email không hợp lệ"

**Kết quả:**
- Email hash không được gửi đúng
- Advanced Matching không hoạt động
- Facebook không thể match user
- Ảnh hưởng đến ad performance

---

## ✅ Giải pháp

### Option 1: Remove email hash khỏi `fbq('init')` (KHUYẾN NGHỊ)

**Lý do:**
- `fbq('init')` chỉ nên có `pixelId`
- Email hash nên được set bằng `fbq('set', 'user', { em: emailHash })` **SAU** khi init
- Email hash thường không có sẵn khi page load (chỉ có sau khi user submit form)

**Code fix:**

```javascript
// ❌ SAI
fbq('init', pixelId, {em: '{{DLV - email_hash}}' }, opts);

// ✅ ĐÚNG
fbq('init', pixelId, {}, opts);
```

**Sau đó set email hash khi có:**
- Trong `app/order/[orderCode]/page.tsx` → Đã có `fbq('set', 'user', { em: hashed })`
- Trong GTM tags → Dùng Facebook Pixel Template với User Data → Email

---

### Option 2: Set email hash từ dataLayer (Nếu cần)

Nếu muốn set email hash ngay khi init, cần:

1. **Check dataLayer có email_hash không:**
```javascript
fbq('init', pixelId, {}, opts);

// Check dataLayer for email_hash
if (window.dataLayer) {
  const emailHash = window.dataLayer.find(item => item.email_hash);
  if (emailHash && emailHash.email_hash) {
    fbq('set', 'user', { em: emailHash.email_hash });
  }
}
```

**Nhưng:** Thường không cần vì email chỉ có sau khi user submit form.

---

## 🔧 Cách sửa

### Bước 1: Sửa `components/MetaPixel.tsx`

**Tìm dòng 49:**
```javascript
fbq('init', pixelId, {em: '{{DLV - email_hash}}' }, opts);
```

**Thay bằng:**
```javascript
fbq('init', pixelId, {}, opts);
```

**Lý do:**
- Remove email hash khỏi init
- Email hash sẽ được set sau bằng `fbq('set', 'user', ...)` khi có email

---

### Bước 2: Verify email hash được set đúng cách

**Kiểm tra các nơi set email hash:**

1. ✅ `app/order/[orderCode]/page.tsx` (dòng 116-119):
```typescript
hashEmail(email).then((hashed) => {
  const fbq = (typeof window !== 'undefined' && window) ? (window as { fbq?: (cmd: string, ...args: any[]) => void }).fbq : undefined;
  if (hashed && fbq) fbq('set', 'user', { em: hashed });
});
```
→ ✅ **ĐÚNG** - Set email hash sau khi có email

2. ✅ GTM Tags (Facebook Pixel Template):
- User Data → Email: `{{DLV - email_hash}}`
→ ✅ **ĐÚNG** - Template tự động xử lý

---

### Bước 3: Test

**Test trong Facebook Test Events:**

1. Load page → Verify `fbq('init')` không có email hash
2. Submit form → Verify email hash được set bằng `fbq('set', 'user', ...)`
3. Check Advanced Matching → Verify email hash hiển thị đúng

---

## 📊 So sánh Before/After

### Before (❌ SAI)

```javascript
// MetaPixel.tsx
fbq('init', pixelId, {em: '{{DLV - email_hash}}' }, opts);
```

**Kết quả:**
- Facebook nhận: `em: '{{DLV - email_hash}}'` (literal string)
- Facebook báo lỗi: "Email không hợp lệ"
- Advanced Matching không hoạt động

---

### After (✅ ĐÚNG)

```javascript
// MetaPixel.tsx
fbq('init', pixelId, {}, opts);

// app/order/[orderCode]/page.tsx (khi có email)
fbq('set', 'user', { em: hashedEmail });
```

**Kết quả:**
- Facebook nhận: `em: 'sha256_hash_here'` (64 ký tự hex)
- Facebook validate thành công
- Advanced Matching hoạt động đúng

---

## 🧪 Testing Checklist

### Test 1: Verify init không có email hash
- [ ] Load page
- [ ] Open DevTools → Console
- [ ] Check `fbq('init')` call → Verify không có `em` parameter

### Test 2: Verify email hash được set đúng
- [ ] Submit form với email
- [ ] Open DevTools → Network tab
- [ ] Filter: `facebook.com/tr`
- [ ] Check request → Verify `ud[em]` có giá trị (64 ký tự hex)

### Test 3: Verify trong Facebook Test Events
- [ ] Vào Facebook Events Manager → Test Events
- [ ] Trigger event (Lead, Purchase, etc.)
- [ ] Check Advanced Matching → Verify có `em` (email hash)
- [ ] Verify không còn lỗi "Email không hợp lệ"

---

## 📝 Code Changes

### File: `components/MetaPixel.tsx`

**Before:**
```javascript
fbq('init', pixelId, {em: '{{DLV - email_hash}}' }, opts);
```

**After:**
```javascript
fbq('init', pixelId, {}, opts);
```

**Full context:**
```javascript
fbq('init', pixelId, {}, opts);
fbq('track', 'PageView', {}, opts);
```

---

## ⚠️ Lưu ý quan trọng

### 1. Email hash format

**Yêu cầu của Facebook:**
- SHA-256 hash (64 ký tự hex)
- Lowercase
- No prefix/suffix
- Valid email đã được hash

**Code hiện tại (`lib/tracking.ts`):**
```typescript
export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

→ ✅ **ĐÚNG format** - Không cần sửa

---

### 2. Khi nào set email hash

**Đúng:**
- ✅ Sau khi user submit form (có email)
- ✅ Trong order page (có orderData.email)
- ✅ Trong GTM tags (khi có email_hash trong dataLayer)

**Sai:**
- ❌ Trong `fbq('init')` (chưa có email)
- ❌ Với literal string `'{{DLV - email_hash}}'` (GTM syntax)

---

### 3. GTM Template vs Custom Code

**Nếu dùng Facebook Pixel Template trong GTM:**
- ✅ Template tự động validate email hash
- ✅ Template tự động format đúng
- ✅ Chỉ cần điền `{{DLV - email_hash}}` vào User Data → Email

**Nếu dùng Custom HTML:**
- ✅ Phải dùng `fbq('set', 'user', { em: emailHash })`
- ✅ Phải validate email hash trước khi set
- ✅ Phải check email hash không empty

---

## 🎯 Kết quả mong đợi

Sau khi sửa:

✅ **Facebook Events Manager:**
- Không còn lỗi "Email không hợp lệ"
- Advanced Matching hoạt động đúng
- Email hash hiển thị trong Advanced Matching → User

✅ **Tracking:**
- Email hash được set đúng cách
- Advanced Matching match user tốt hơn
- Conversion tracking chính xác hơn

✅ **Performance:**
- Ad reach tốt hơn (match được nhiều user hơn)
- Ad results tốt hơn (targeting chính xác hơn)

---

## 📚 Files liên quan

### Files cần sửa:
1. ✅ `components/MetaPixel.tsx` - Remove email hash khỏi init

### Files đã đúng (giữ nguyên):
1. ✅ `app/order/[orderCode]/page.tsx` - Set email hash đúng cách
2. ✅ `lib/tracking.ts` - hashEmail function đúng format
3. ✅ GTM Tags - Dùng Facebook Pixel Template

### Files reference:
- `docs/GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md` - GTM setup
- `docs/ADVANCED_MATCHING_FIX.md` - Advanced Matching guide
- `docs/META_PIXEL_EMAIL_VALUE_BEST_PRACTICES.md` - Best practices

---

**Last Updated:** $(date)  
**Version:** 1.0
