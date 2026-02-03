# Lead Event - Email Hash Update Summary

## Tổng quan

Đã cập nhật **Lead event (form submit)** để gửi `email_hash` trong Advanced Matching, tương tự như InitiateCheckout và Purchase.

---

## 1. Source Code Updates

### ✅ `lib/tracking.ts`
- `trackFormSubmit()` nhận thêm parameter `emailHash?: string`
- Push `email_hash` vào data layer

### ✅ `hooks/useTracking.ts`
- `trackForm()` nhận thêm parameter `email?: string`
- Tự động hash email trước khi gửi

### ✅ `components/Hero.tsx`
- Gửi email khi track form submit: `await trackForm(..., email)`
- Email được hash và push vào data layer

---

## 2. GTM Tag Update

### Meta Pixel - Lead (Form Submit)

**Tag Type:** Custom HTML  
**Trigger:** `Event - form_submit`

### Code mới:

```html
<script>
// Prepare event parameters
var eventParams = {
  content_name: '{{DLV - form_name}}',
  content_category: '{{DLV - form_location}}'
};

// Add email_hash for Advanced Matching if available
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  eventParams.user_data = {
    em: emailHash
  };
}

fbq('track', 'Lead', eventParams);
</script>
```

**Thay đổi:**
- ✅ Thêm logic để gửi `email_hash` trong `user_data.em`
- ✅ Chỉ gửi `user_data` nếu có `email_hash`

---

## 3. Flow hoàn chỉnh

1. **User nhập email và submit form** → `Hero.tsx`
2. **App hash email** → `hashEmail(email)` (SHA-256)
3. **App push data layer:**
   ```javascript
   {
     event: 'form_submit',
     form_id: 'hero_course_form',
     form_name: 'Course Request Form',
     form_location: 'hero_section',
     course_count: 3,
     email_hash: 'sha256...' // SHA-256 hash
   }
   ```
4. **GTM tag nhận và gửi:**
   ```javascript
   fbq('track', 'Lead', {
     content_name: 'Course Request Form',
     content_category: 'hero_section',
     user_data: {
       em: 'sha256...'  // Advanced Matching
     }
   });
   ```

---

## 4. Kiểm tra trong Facebook Test Events

### Lead Event

✅ **Parameters:**
- `content_name`: `"Course Request Form"`
- `content_category`: `"hero_section"`

✅ **Advanced Matching → User:**
- `em`: `"sha256_hash_here"` (SHA-256 hashed email)

---

## 5. Checklist

### Source Code
- [x] `trackFormSubmit()` nhận `emailHash` parameter
- [x] `useTracking.trackForm()` hash email trước khi gửi
- [x] `Hero.tsx` gửi email khi track form submit

### GTM Configuration
- [ ] Variable `DLV - email_hash` đã có (nếu chưa tạo)
- [ ] Tag `Meta Pixel - Lead` cập nhật với `user_data.em`
- [ ] Test trong GTM Preview → Verify `email_hash` có trong data layer
- [ ] Test trong GTM Preview → Verify tag gửi `user_data.em`

### Testing
- [ ] Test trong Facebook Test Events → Verify Advanced Matching có `em`
- [ ] Submit form → Xem Lead event có email hash

---

## 6. Các bước thực hiện

1. **Cập nhật GTM Tag:**
   - Vào GTM → Tags → `Meta Pixel - Lead`
   - Thay code mới (có `user_data.em`)
   - Save

2. **Test trong Preview Mode:**
   - Fire `form_submit` event
   - Kiểm tra Variables → `DLV - email_hash` có giá trị?
   - Kiểm tra Tag → Có gửi `user_data.em`?

3. **Publish Container:**
   - Version Name: `Update Lead with email_hash for Advanced Matching`
   - Publish

4. **Deploy App:**
   - Code đã được cập nhật, chỉ cần deploy

5. **Test trong Facebook Test Events:**
   - Submit form trên website
   - Xem Lead event trong Test Events
   - Verify Advanced Matching có `em` (email hash)

---

## 7. Kết quả mong đợi

Sau khi cập nhật và deploy:

✅ **Lead** trong Test Events sẽ có:
- `content_name`: `"Course Request Form"`
- `content_category`: `"hero_section"`
- **Advanced Matching → User:**
  - `em`: `"sha256_hash_of_email"` (SHA-256 hashed email)

✅ **Advanced Matching** sẽ có:
- IP Address
- User Agent
- **User (email_hash)** - QUAN TRỌNG NHẤT cho match quality

---

## 8. Files Updated

- ✅ `lib/tracking.ts` - Added emailHash to trackFormSubmit
- ✅ `hooks/useTracking.ts` - Added email hashing to trackForm
- ✅ `components/Hero.tsx` - Pass email to trackForm
- ✅ `docs/TRACKING_GTM_TAGS_REFERENCE.md` - Updated Lead tag
- ✅ `docs/GTM_TAGS_COPY_PASTE.md` - Added Lead tag code

---

## 9. Tham chiếu

- **Meta Pixel Documentation:** [Advanced Matching](https://www.facebook.com/business/help/611774685654668)
- **Best Practices:** `docs/META_PIXEL_EMAIL_VALUE_BEST_PRACTICES.md`
- **GTM Tags Reference:** `docs/TRACKING_GTM_TAGS_REFERENCE.md`
- **Copy/Paste Ready:** `docs/GTM_TAGS_COPY_PASTE.md`
