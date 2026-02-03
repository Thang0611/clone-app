# GTM Tags - Copy/Paste Ready

## ⚠️ QUAN TRỌNG: Cập nhật 3 tag này trong GTM (Lead, InitiateCheckout, Purchase)

---

## 1. Meta Pixel - InitiateCheckout

**Tag Type:** Custom HTML  
**Trigger:** `Event - begin_checkout`

### Code (Copy toàn bộ):

```html
<script>
(function(){
  var items = {{DLV - items}} || [];
  var contents = items.map(function(item) {
    return { id: item.item_id, quantity: item.quantity || 1, item_price: Number(item.price) || 0 };
  });
  var contentIds = items.map(function(item) { return item.item_id; });
  
  // Prepare event parameters
  var eventParams = {
    value: Number({{DLV - value}}) || 0,
    currency: '{{DLV - currency}}' || 'VND',
    num_items: items.length,
    contents: contents,
    content_type: 'product',
    content_ids: contentIds
  };
  
  // Set user data for Advanced Matching (parameter 4 of fbq track)
  var emailHash = {{DLV - email_hash}};
  if (emailHash && emailHash.trim() !== '') {
    fbq('set', 'user', { em: emailHash });
  }
  
  fbq('track', 'InitiateCheckout', eventParams);
})();
</script>
```

**Quan trọng:**
- ✅ `value` được convert sang Number để đảm bảo format đúng
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters)
- ✅ Chỉ set user data nếu có `email_hash`

---

## 2. Meta Pixel - Lead (Form Submit)

**Tag Type:** Custom HTML  
**Trigger:** `Event - form_submit`

### Code (Copy toàn bộ):

```html
<script>
// Prepare event parameters
var eventParams = {
  content_name: '{{DLV - form_name}}',
  content_category: '{{DLV - form_location}}'
};

// Set user data for Advanced Matching (parameter 4 of fbq track)
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  fbq('set', 'user', { em: emailHash });
}

fbq('track', 'Lead', eventParams);
</script>
```

**Quan trọng:**
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters)
- ✅ Chỉ set user data nếu có `email_hash`

---

## 3. Meta Pixel - Purchase

**Tag Type:** Custom HTML  
**Trigger:** `Event - purchase`

### Code (Copy toàn bộ):

```html
<script>
var items = {{DLV - items}} || [];
var contents = items.map(function(item) {
  return {
    id: item.item_id,
    quantity: item.quantity || 1,
    item_price: Number(item.price) || 0
  };
});

var contentIds = items.map(function(item) {
  return item.item_id;
});

// Prepare event parameters
var eventParams = {
  value: Number({{DLV - value}}) || 0,
  currency: '{{DLV - currency}}' || 'VND',
  contents: contents,
  content_type: 'product',
  content_ids: contentIds
};

// Set user data for Advanced Matching (parameter 4 of fbq track)
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  fbq('set', 'user', { em: emailHash });
}

fbq('track', 'Purchase', eventParams);
</script>
```

**Quan trọng:**
- ✅ `value` được convert sang Number để đảm bảo format đúng
- ✅ `item_price` được convert sang Number
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters)
- ✅ Chỉ set user data nếu có `email_hash`

---

## 4. Kiểm tra Variables

Đảm bảo các Variables này đã có trong GTM:

- ✅ `DLV - items` (Data Layer Variable: `items`)
- ✅ `DLV - value` (Data Layer Variable: `value`)
- ✅ `DLV - currency` (Data Layer Variable: `currency`)
- ✅ `DLV - email_hash` (Data Layer Variable: `email_hash`) - **QUAN TRỌNG cho Advanced Matching**

---

## 5. Sau khi cập nhật

1. **Test trong Preview Mode:**
   - Fire `form_submit` → Kiểm tra tag có `email_hash` trong `user_data.em`
   - Fire `begin_checkout` → Kiểm tra tag có `contents`, `content_ids`, `email_hash`
   - Fire `purchase` → Kiểm tra tag có `contents`, `content_ids`, `email_hash`

2. **Publish Container:**
   - Version Name: `Update Lead, InitiateCheckout & Purchase with email_hash and contents/content_ids`
   - Publish

3. **Test trong Facebook Test Events:**
   - Submit form → Xem Lead có `email_hash` trong Advanced Matching
   - Mở modal checkout → Xem Initiate Checkout có `content_ids`, `contents`, `email_hash`
   - Hoàn thành thanh toán → Xem Purchase có `content_ids`, `contents`, `email_hash`

---

## 6. Kết quả mong đợi

Sau khi cập nhật và deploy:

✅ **Lead (Form Submit)** trong Test Events sẽ có:
- `content_name`: `"Course Request Form"`
- `content_category`: `"hero_section"`
- **Advanced Matching → User:**
  - `em`: `"sha256_hash_of_email"` (SHA-256 hashed email)

✅ **Initiate Checkout** trong Test Events sẽ có:
- `value`: `50000` (Number, không phải string)
- `currency`: `"VND"`
- `contents`: `[{id: "6168777", quantity: 1, item_price: 50000}]`
- `content_ids`: `["6168777"]`
- `num_items`: `1`
- `content_type`: `"product"`
- **Advanced Matching → User:**
  - `em`: `"sha256_hash_of_email"` (SHA-256 hashed email)

✅ **Purchase** trong Test Events sẽ có:
- `value`: `50000` (Number, không phải string)
- `currency`: `"VND"`
- `contents`: `[{id: "6168777", quantity: 1, item_price: 50000}]`
- `content_ids`: `["6168777"]`
- `content_type`: `"product"`
- **Advanced Matching → User:**
  - `em`: `"sha256_hash_of_email"` (SHA-256 hashed email)

✅ **Advanced Matching** sẽ có:
- IP Address
- User Agent
- **User (email_hash)** - QUAN TRỌNG NHẤT cho match quality
