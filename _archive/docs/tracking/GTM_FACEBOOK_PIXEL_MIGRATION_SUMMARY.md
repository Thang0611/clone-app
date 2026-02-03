# Facebook Pixel Migration Summary

## 📋 Tổng quan Migration

**Mục tiêu:** Chuyển từ Custom HTML tags sang Facebook Pixel Template trong GTM để dễ quản lý và tránh lỗi Advanced Matching.

**Thời gian ước tính:** 30-60 phút

**Độ khó:** Trung bình

---

## 🔄 So sánh Custom HTML vs Facebook Pixel Template

| Tính năng | Custom HTML Tag | Facebook Pixel Template |
|-----------|----------------|------------------------|
| **Setup** | Phải viết JavaScript code | UI form, không cần code |
| **Advanced Matching** | Phải manual `fbq('set', 'user', ...)` | Tự động xử lý đúng cách |
| **Validation** | Phải tự validate | Template tự validate |
| **Error Handling** | Phải tự handle | Template tự handle |
| **Debug** | Khó debug | Dễ debug trong Preview |
| **Maintenance** | Phải maintain code | Dễ maintain |
| **Best Practices** | Phải tự implement | Template tuân thủ standards |
| **Performance** | Tùy code | Template tối ưu |

---

## 📊 Event Mapping Table

### Events cần migrate:

| Event | Custom HTML Tag | Facebook Pixel Template | Status |
|-------|----------------|------------------------|--------|
| **ViewContent** | `Meta Pixel - ViewContent` (Custom HTML) | `Meta Pixel - ViewContent` (Template) | ⏳ Cần migrate |
| **Lead** | `Meta Pixel - Lead` (Custom HTML) | `Meta Pixel - Lead` (Template) | ⏳ Cần migrate |
| **InitiateCheckout** | `Meta Pixel - InitiateCheckout` (Custom HTML) | `Meta Pixel - InitiateCheckout` (Template) | ⏳ Cần migrate |
| **Purchase** | `Meta Pixel - Purchase` (Custom HTML) | `Meta Pixel - Purchase` (Template) | ⏳ Cần migrate |

---

## 🎯 Key Changes

### 1. Advanced Matching Fix

**Trước (Custom HTML):**
```javascript
fbq('set', 'user', { em: emailHash }); // Phải manual
fbq('track', 'Lead', eventParams);
```

**Sau (Template):**
- Chỉ cần điền `{{DLV - email_hash}}` vào **User Data → Email**
- Template tự động xử lý đúng cách

### 2. Array Parameters

**Trước (Custom HTML):**
```javascript
var contents = items.map(function(item) {
  return { id: item.item_id, quantity: item.quantity, item_price: Number(item.price) };
});
var contentIds = items.map(function(item) { return item.item_id; });
```

**Sau (Template):**
- Tạo Custom JS Variables: `JS - contents`, `JS - content_ids`
- Template tự động format array đúng cách

### 3. Number Parameters

**Trước (Custom HTML):**
```javascript
value: Number({{DLV - value}}) || 0
```

**Sau (Template):**
- Template tự động convert, hoặc dùng `{{JS - value_number}}`

---

## 📝 Migration Steps (Tóm tắt)

### 1. Chuẩn bị (5 phút)
- [ ] Backup GTM container
- [ ] Verify tất cả Variables đã có
- [ ] Tạo Custom JS Variables: `JS - contents`, `JS - content_ids`, `JS - num_items`

### 2. Tạo Template Tags (15 phút)
- [ ] `Meta Pixel - ViewContent` (Template)
- [ ] `Meta Pixel - Lead` (Template)
- [ ] `Meta Pixel - InitiateCheckout` (Template)
- [ ] `Meta Pixel - Purchase` (Template)

### 3. Test trong Preview Mode (10 phút)
- [ ] Test từng event
- [ ] Verify parameters đúng
- [ ] Verify Advanced Matching có email

### 4. Publish (5 phút)
- [ ] Pause Custom HTML tags cũ
- [ ] Publish container
- [ ] Test trên Production

### 5. Verify trong Facebook (10 phút)
- [ ] Test trong Facebook Test Events
- [ ] Verify Advanced Matching
- [ ] Verify không có double tracking

---

## 📚 Tài liệu tham khảo

### Hướng dẫn chi tiết:
1. **`GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md`** - Hướng dẫn step-by-step chi tiết
2. **`GTM_FACEBOOK_PIXEL_TEMPLATE_QUICK_REFERENCE.md`** - Quick reference để copy/paste

### Tài liệu liên quan:
- `TRACKING_GTM_TAGS_REFERENCE.md` - Custom HTML tags cũ (reference)
- `GTM_TAGS_COPY_PASTE.md` - Code cũ (reference)
- `ADVANCED_MATCHING_FIX.md` - Vấn đề Advanced Matching

---

## ✅ Checklist Migration

### Trước khi bắt đầu
- [ ] Backup GTM container (Export)
- [ ] Đọc hướng dẫn chi tiết: `GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md`
- [ ] Chuẩn bị sẵn Pixel ID (15-16 chữ số)

### Setup Variables
- [ ] `Meta Pixel ID` (Constant)
- [ ] Tất cả DLV variables
- [ ] `JS - contents` (Custom JavaScript)
- [ ] `JS - content_ids` (Custom JavaScript)
- [ ] `JS - num_items` (Custom JavaScript)

### Tạo Template Tags
- [ ] `Meta Pixel - ViewContent` (Template)
- [ ] `Meta Pixel - Lead` (Template)
- [ ] `Meta Pixel - InitiateCheckout` (Template)
- [ ] `Meta Pixel - Purchase` (Template)

### Test
- [ ] Test trong Preview Mode
- [ ] Verify parameters đúng
- [ ] Verify Advanced Matching có email
- [ ] Verify Network requests (`facebook.com/tr`)

### Publish
- [ ] Pause Custom HTML tags cũ
- [ ] Publish container
- [ ] Test trên Production
- [ ] Verify trong Facebook Test Events
- [ ] Verify không có double tracking

---

## 🎯 Kết quả mong đợi

Sau khi hoàn thành migration:

✅ **Advanced Matching hoạt động đúng:**
- Email hash hiển thị trong Advanced Matching (không phải Parameters)
- Template tự động format đúng

✅ **Dễ quản lý hơn:**
- Không cần maintain JavaScript code
- UI rõ ràng, dễ thêm/sửa parameters

✅ **Better error handling:**
- Template tự validate fields
- Better error messages

✅ **Performance tốt hơn:**
- Template tối ưu code
- Faster loading time

---

## 🚀 Bắt đầu Migration

1. **Đọc hướng dẫn chi tiết:**
   - `GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md` - Full guide
   - `GTM_FACEBOOK_PIXEL_TEMPLATE_QUICK_REFERENCE.md` - Quick reference

2. **Follow checklist:**
   - Checklist Migration ở trên

3. **Test kỹ trước khi publish:**
   - Preview Mode
   - Facebook Test Events

4. **Nếu gặp vấn đề:**
   - Xem Troubleshooting section trong full guide
   - Check GTM Preview Mode → Console tab
   - Check Facebook Test Events → Event details

---

**Last Updated:** $(date)  
**Version:** 1.0
