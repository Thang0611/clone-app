# Facebook Pixel Template - Quick Reference

## 📋 Quick Setup Guide

File này là quick reference để copy/paste khi setup Facebook Pixel Template trong GTM.

---

## 🔧 Step 1: Tạo Custom JavaScript Variables

### Variable: `JS - contents`

**Type:** Custom JavaScript  
**Name:** `JS - contents`

```javascript
function() {
  var items = {{DLV - items}} || [];
  return items.map(function(item) {
    return {
      id: item.item_id || item.id,
      quantity: item.quantity || 1,
      item_price: Number(item.price) || 0
    };
  });
}
```

---

### Variable: `JS - content_ids`

**Type:** Custom JavaScript  
**Name:** `JS - content_ids`

```javascript
function() {
  var items = {{DLV - items}} || [];
  return items.map(function(item) {
    return item.item_id || item.id || '';
  }).filter(function(id) {
    return id !== '';
  });
}
```

---

### Variable: `JS - num_items`

**Type:** Custom JavaScript  
**Name:** `JS - num_items`

```javascript
function() {
  var items = {{DLV - items}} || [];
  return items.length;
}
```

---

### Variable: `JS - value_number` (Optional - nếu cần)

**Type:** Custom JavaScript  
**Name:** `JS - value_number`

```javascript
function() {
  return Number({{DLV - value}}) || 0;
}
```

---

## 🏷️ Step 2: Template Tag Configurations

### Tag 1: Meta Pixel - ViewContent

**Tag Type:** `Facebook Pixel`  
**Tag Name:** `Meta Pixel - ViewContent`

| Field | Value |
|-------|-------|
| **Pixel ID** | `{{Meta Pixel ID}}` |
| **Event Name** | `ViewContent` |
| **Event Parameters** | |
| → `content_type` | `{{DLV - content_type}}` |
| → `content_name` | `{{DLV - content_name}}` |
| → `content_category` | `{{DLV - content_category}}` |
| **User Data** | |
| → Email | (để trống) |
| **Trigger** | `Event - view_content` |

---

### Tag 2: Meta Pixel - Lead

**Tag Type:** `Facebook Pixel`  
**Tag Name:** `Meta Pixel - Lead`

| Field | Value |
|-------|-------|
| **Pixel ID** | `{{Meta Pixel ID}}` |
| **Event Name** | `Lead` |
| **Event Parameters** | |
| → `content_name` | `{{DLV - form_name}}` |
| → `content_category` | `{{DLV - form_location}}` |
| **User Data** | |
| → **Email** | `{{DLV - email_hash}}` ⚠️ QUAN TRỌNG |
| **Trigger** | `Event - form_submit` |

---

### Tag 3: Meta Pixel - InitiateCheckout

**Tag Type:** `Facebook Pixel`  
**Tag Name:** `Meta Pixel - InitiateCheckout`

| Field | Value |
|-------|-------|
| **Pixel ID** | `{{Meta Pixel ID}}` |
| **Event Name** | `InitiateCheckout` |
| **Event Parameters** | |
| → `value` | `{{DLV - value}}` (hoặc `{{JS - value_number}}`) |
| → `currency` | `{{DLV - currency}}` |
| → `contents` | `{{JS - contents}}` ⚠️ Array |
| → `content_ids` | `{{JS - content_ids}}` ⚠️ Array |
| → `num_items` | `{{JS - num_items}}` |
| → `content_type` | `product` (hardcoded) |
| **User Data** | |
| → **Email** | `{{DLV - email_hash}}` ⚠️ QUAN TRỌNG |
| **Trigger** | `Event - begin_checkout` |

---

### Tag 4: Meta Pixel - Purchase

**Tag Type:** `Facebook Pixel`  
**Tag Name:** `Meta Pixel - Purchase`

| Field | Value |
|-------|-------|
| **Pixel ID** | `{{Meta Pixel ID}}` |
| **Event Name** | `Purchase` |
| **Event Parameters** | |
| → `value` | `{{DLV - value}}` (hoặc `{{JS - value_number}}`) |
| → `currency` | `{{DLV - currency}}` |
| → `contents` | `{{JS - contents}}` ⚠️ Array |
| → `content_ids` | `{{JS - content_ids}}` ⚠️ Array |
| → `content_type` | `product` (hardcoded) |
| **User Data** | |
| → **Email** | `{{DLV - email_hash}}` ⚠️ QUAN TRỌNG |
| **Trigger** | `Event - purchase` |

---

## ✅ Checklist

### Variables
- [ ] `Meta Pixel ID` (Constant) - Pixel ID 15-16 chữ số
- [ ] `DLV - items` (Data Layer Variable: `items`)
- [ ] `DLV - value` (Data Layer Variable: `value`)
- [ ] `DLV - currency` (Data Layer Variable: `currency`)
- [ ] `DLV - email_hash` (Data Layer Variable: `email_hash`)
- [ ] `DLV - content_type` (Data Layer Variable: `content_type`)
- [ ] `DLV - content_name` (Data Layer Variable: `content_name`)
- [ ] `DLV - content_category` (Data Layer Variable: `content_category`)
- [ ] `DLV - form_name` (Data Layer Variable: `form_name`)
- [ ] `DLV - form_location` (Data Layer Variable: `form_location`)
- [ ] `JS - contents` (Custom JavaScript)
- [ ] `JS - content_ids` (Custom JavaScript)
- [ ] `JS - num_items` (Custom JavaScript)
- [ ] `JS - value_number` (Optional - Custom JavaScript)

### Tags
- [ ] `Meta Pixel - ViewContent` (Facebook Pixel Template)
- [ ] `Meta Pixel - Lead` (Facebook Pixel Template)
- [ ] `Meta Pixel - InitiateCheckout` (Facebook Pixel Template)
- [ ] `Meta Pixel - Purchase` (Facebook Pixel Template)

### Actions
- [ ] Pause Custom HTML tags cũ (ViewContent, Lead, InitiateCheckout, Purchase)
- [ ] Test trong Preview Mode
- [ ] Publish container
- [ ] Test trong Facebook Test Events

---

## 🔍 Test trong Facebook Test Events

Sau khi publish, test từng event:

### Test Lead
1. Submit form trên website
2. Vào [Facebook Events Manager](https://business.facebook.com/events_manager2/) → **Test Events**
3. Verify:
   - ✅ **Parameters:** `content_name`, `content_category`
   - ✅ **Advanced Matching → User:** `em` = email hash (64 ký tự hex)

### Test InitiateCheckout
1. Trigger checkout event
2. Verify:
   - ✅ **Parameters:** `value`, `currency`, `contents`, `content_ids`, `num_items`, `content_type`
   - ✅ **Advanced Matching → User:** `em` = email hash
   - ✅ `contents` = `[{id, quantity, item_price}]`
   - ✅ `content_ids` = `["id1"]`

### Test Purchase
1. Complete purchase
2. Verify:
   - ✅ **Parameters:** `value`, `currency`, `contents`, `content_ids`, `content_type`
   - ✅ **Advanced Matching → User:** `em` = email hash
   - ✅ `contents` = `[{id, quantity, item_price}]`
   - ✅ `content_ids` = `["id1"]`

---

## ⚠️ Lưu ý quan trọng

### 1. Advanced Matching
- **Email hash** phải điền vào **User Data → Email** (KHÔNG phải Event Parameters)
- Template tự động format đúng cho Advanced Matching
- Không cần `fbq('set', 'user', ...)` nữa!

### 2. Array Parameters
- `contents` và `content_ids` phải là **Array** (dùng Custom JS Variables)
- `contents` format: `[{id, quantity, item_price}]`
- `content_ids` format: `["id1", "id2"]`

### 3. Number Parameters
- `value` và `item_price` phải là **Number** (không phải string)
- Template tự động convert, nhưng nên dùng `{{JS - value_number}}` để chắc chắn

### 4. Pause Custom HTML Tags
- **QUAN TRỌNG:** Phải pause Custom HTML tags cũ để tránh double tracking
- Không xóa - giữ lại để reference

### 5. Test trước khi Publish
- Test trong Preview Mode trước
- Verify Network requests (`facebook.com/tr`)
- Verify không có double tracking

---

## 🐛 Quick Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Template không fire | Kiểm tra Trigger, Pixel ID, Data Layer |
| Email không trong Advanced Matching | Kiểm tra User Data → Email có giá trị không |
| contents/content_ids sai | Kiểm tra Custom JS Variables (`JS - contents`, `JS - content_ids`) |
| value không phải Number | Dùng `{{JS - value_number}}` thay vì `{{DLV - value}}` |
| Double tracking | Pause Custom HTML tags cũ |
| Template không có trong dropdown | Upgrade GTM container hoặc add từ Community Template Gallery |

---

**Reference:** Xem `GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md` để có hướng dẫn chi tiết hơn.
