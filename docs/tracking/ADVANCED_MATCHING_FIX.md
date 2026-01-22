# Advanced Matching Fix - Email Hash hiển thị đúng vị trí

## Vấn đề

Email hash hiện đang hiển thị trong **Parameters** (Thông số) thay vì **Advanced Matching** trong Facebook Test Events.

## Nguyên nhân

Code GTM đang gửi `email_hash` trong event parameters như:
```javascript
eventParams.user_data = { em: emailHash };
fbq('track', 'InitiateCheckout', eventParams);
```

Cách này khiến `user_data` hiển thị trong Parameters thay vì Advanced Matching.

## Giải pháp

Sử dụng `fbq('set', 'user', { em: emailHash })` **TRƯỚC** khi gọi `fbq('track', ...)`.

### Code đúng:

```html
<script>
// Set user data for Advanced Matching
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  fbq('set', 'user', { em: emailHash });
}

// Track event (email sẽ tự động được gửi trong Advanced Matching)
fbq('track', 'InitiateCheckout', {
  value: Number({{DLV - value}}) || 0,
  currency: '{{DLV - currency}}',
  contents: contents,
  content_ids: contentIds
});
</script>
```

## Cách hoạt động

1. `fbq('set', 'user', { em: emailHash })` → Set email hash cho Advanced Matching
2. `fbq('track', 'InitiateCheckout', eventParams)` → Track event, email hash sẽ tự động được gửi trong Advanced Matching section

## Kết quả

Sau khi cập nhật:
- ✅ Email hash sẽ hiển thị trong **Advanced Matching → User** (không phải Parameters)
- ✅ Parameters chỉ có: `value`, `currency`, `contents`, `content_ids`, etc.
- ✅ Advanced Matching có: **User (email_hash)**, IP Address, User Agent

## Các tag cần cập nhật

1. ✅ **Meta Pixel - Lead** (Form Submit)
2. ✅ **Meta Pixel - InitiateCheckout**
3. ✅ **Meta Pixel - Purchase**

Tất cả đã được cập nhật trong:
- `docs/GTM_TAGS_COPY_PASTE.md`
- `docs/TRACKING_GTM_TAGS_REFERENCE.md`

## Các bước thực hiện

1. **Cập nhật 3 GTM tags:**
   - Thay code cũ bằng code mới (dùng `fbq('set', 'user', ...)`)
   - Save

2. **Test trong Preview Mode:**
   - Fire events
   - Verify không có `user_data` trong Parameters

3. **Publish GTM Container**

4. **Test trong Facebook Test Events:**
   - Verify email hash hiển thị trong **Advanced Matching → User**
   - Verify không có `user_data` trong Parameters
