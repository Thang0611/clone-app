# Hướng dẫn cập nhật GTM Tags - Initiate Checkout & Purchase

## Tổng quan

Cần cập nhật 2 tag Meta Pixel trong GTM để gửi đúng `contents` và `content_ids` từ `{{DLV - items}}` cho Facebook Events Manager.

---

## 1. Meta Pixel - InitiateCheckout

### Tag hiện tại cần sửa
- **Tag Name:** `Meta Pixel - InitiateCheckout`
- **Tag Type:** Custom HTML
- **Trigger:** `Event - begin_checkout`

### Code mới (theo TRACKING_GTM_TAGS_REFERENCE.md)

```html
<script>
(function(){
  var items = {{DLV - items}} || [];
  var contents = items.map(function(item) {
    return { id: item.item_id, quantity: item.quantity || 1, item_price: item.price || 0 };
  });
  var contentIds = items.map(function(item) { return item.item_id; });
  fbq('track', 'InitiateCheckout', {
    value: {{DLV - value}},
    currency: '{{DLV - currency}}',
    num_items: items.length,
    contents: contents,
    content_type: 'product',
    content_ids: contentIds
  });
})();
</script>
```

### Các thay đổi chính:
1. ✅ Lấy `items` từ `{{DLV - items}}`
2. ✅ Map `items` → `contents` (array với `id`, `quantity`, `item_price`)
3. ✅ Map `items` → `content_ids` (array các `item_id`)
4. ✅ Thêm `num_items`, `content_type: 'product'`

---

## 2. Meta Pixel - Purchase

### Tag hiện tại cần kiểm tra
- **Tag Name:** `Meta Pixel - Purchase`
- **Tag Type:** Custom HTML
- **Trigger:** `Event - purchase`

### Code đúng (theo TRACKING_GTM_TAGS_REFERENCE.md)

```html
<script>
var items = {{DLV - items}};
var contents = items.map(function(item) {
  return {
    id: item.item_id,
    quantity: item.quantity,
    item_price: item.price
  };
});

var contentIds = items.map(function(item) {
  return item.item_id;
});

fbq('track', 'Purchase', {
  value: {{DLV - value}},
  currency: '{{DLV - currency}}',
  contents: contents,
  content_type: 'product',
  content_ids: contentIds
});
</script>
```

### Kiểm tra:
1. ✅ Dùng `{{DLV - items}}` (không hardcode)
2. ✅ Map `items` → `contents` với đúng structure: `{ id, quantity, item_price }`
3. ✅ Map `items` → `content_ids` (array các `item_id`)
4. ✅ Có `content_type: 'product'`

---

## 3. Data Layer Variable cần có

Đảm bảo các DLV sau đã được tạo trong GTM:

| Variable Name | Type | Data Layer Variable Name |
|--------------|------|-------------------------|
| `DLV - value` | Data Layer Variable | `value` |
| `DLV - currency` | Data Layer Variable | `currency` |
| `DLV - items` | Data Layer Variable | `items` |

### Cấu trúc `items` từ app:

```javascript
items: [
  {
    item_id: "6168777",           // String - ID khóa học
    item_name: "Khóa học ABC",     // String - Tên khóa học
    item_category: "education",    // String - Category
    item_brand: "Udemy",           // String - Platform
    price: 50000,                  // Number - Giá
    quantity: 1                    // Number - Số lượng
  }
]
```

---

## 4. Các bước thực hiện trong GTM

### Bước 1: Mở GTM Container
1. Đăng nhập [Google Tag Manager](https://tagmanager.google.com)
2. Chọn container của website

### Bước 2: Cập nhật InitiateCheckout Tag
1. Vào **Tags** → Tìm `Meta Pixel - InitiateCheckout`
2. Click vào tag để edit
3. Thay toàn bộ code trong **HTML** bằng code mới ở trên
4. Kiểm tra **Trigger** = `Event - begin_checkout`
5. Click **Save**

### Bước 3: Kiểm tra Purchase Tag
1. Vào **Tags** → Tìm `Meta Pixel - Purchase`
2. Click vào tag để edit
3. So sánh code hiện tại với code đúng ở trên
4. Nếu khác → Thay bằng code đúng
5. Kiểm tra **Trigger** = `Event - purchase`
6. Click **Save**

### Bước 4: Kiểm tra Variables
1. Vào **Variables** → Tìm các DLV:
   - `DLV - value`
   - `DLV - currency`
   - `DLV - items`
2. Nếu thiếu → Tạo mới:
   - **Type:** Data Layer Variable
   - **Data Layer Variable Name:** `value` / `currency` / `items`
   - **Data Layer Version:** Version 2

### Bước 5: Test trong Preview Mode
1. Click **Preview** ở góc trên bên phải
2. Nhập URL website → Connect
3. Mở modal checkout → Fire `begin_checkout`
4. Hoàn thành thanh toán → Fire `purchase`
5. Kiểm tra trong **Tags Fired**:
   - `Meta Pixel - InitiateCheckout` có `contents`, `content_ids`?
   - `Meta Pixel - Purchase` có `contents`, `content_ids`?
6. Kiểm tra Network tab → Request đến `facebook.com/tr` có params `content_ids`, `contents`

### Bước 6: Publish Container
1. Click **Submit** ở góc trên bên phải
2. Điền **Version Name:** `Update InitiateCheckout & Purchase tags with contents/content_ids`
3. Điền **Version Description:**
   ```
   - Updated InitiateCheckout tag to map items → contents/content_ids
   - Verified Purchase tag uses items → contents/content_ids correctly
   - Added num_items and content_type to InitiateCheckout
   ```
4. Click **Publish**

---

## 5. Kiểm tra sau khi deploy

### Trong Facebook Events Manager → Test Events:

#### Initiate Checkout:
- ✅ **Parameters** có:
  - `value`: số tiền
  - `currency`: "VND"
  - `num_items`: số lượng items
  - `contents`: array với `id`, `quantity`, `item_price`
  - `content_ids`: array các `item_id`
  - `content_type`: "product"
- ✅ **Advanced Matching** có:
  - IP Address
  - User Agent
  - (User - email_hash sẽ có sau khi thêm Advanced Matching)

#### Purchase:
- ✅ **Parameters** có:
  - `value`: số tiền
  - `currency`: "VND"
  - `contents`: array với `id`, `quantity`, `item_price`
  - `content_ids`: array các `item_id`
  - `content_type`: "product"
- ✅ **Advanced Matching** có:
  - IP Address
  - User Agent
  - (User - email_hash sẽ có sau khi thêm Advanced Matching)

---

## 6. Lưu ý về Advanced Matching (User)

Hiện tại các event chưa có `email_hash` trong Advanced Matching. Để thêm:

1. **Option 1:** Gửi `email_hash` trong data layer khi có email
2. **Option 2:** Dùng Meta Pixel Advanced Matching tự động (cần cấu hình trong Events Manager)

Sẽ được xử lý trong bước tiếp theo.

---

## 7. Checklist

- [ ] Cập nhật `Meta Pixel - InitiateCheckout` tag với code mới
- [ ] Kiểm tra `Meta Pixel - Purchase` tag đúng format
- [ ] Kiểm tra các DLV (`value`, `currency`, `items`) đã có
- [ ] Test trong GTM Preview mode
- [ ] Verify Network requests có `content_ids`, `contents`
- [ ] Publish GTM container
- [ ] Deploy app (nếu có thay đổi code)
- [ ] Test lại trong Facebook Test Events
- [ ] Verify `contents` và `content_ids` hiển thị trong Test Events

---

## 8. Troubleshooting

### Vấn đề: `contents` hoặc `content_ids` không hiển thị trong Test Events

**Nguyên nhân có thể:**
1. DLV `items` không lấy được từ data layer
2. Cấu trúc `items` không đúng (thiếu `item_id`, `price`, `quantity`)
3. Tag không fire (trigger không match)
4. Code GTM có lỗi syntax

**Cách fix:**
1. Kiểm tra GTM Preview → Variables → `DLV - items` có giá trị?
2. Kiểm tra data layer trong Console: `window.dataLayer` có event `begin_checkout`/`purchase` với `items`?
3. Kiểm tra Network tab → Request `facebook.com/tr` có params `content_ids`?
4. Kiểm tra GTM Debug Console có lỗi?

### Vấn đề: `items` là undefined hoặc empty array

**Nguyên nhân:**
- App chưa push `items` vào data layer
- Timing issue: tag fire trước khi data layer push

**Cách fix:**
- Kiểm tra code app: `trackBeginCheckout()` và `trackPurchase()` có push `items`?
- Thêm guard: `var items = {{DLV - items}} || [];`

---

## 9. Tham chiếu

- **Reference Document:** `docs/TRACKING_GTM_TAGS_REFERENCE.md` (dòng 79-136)
- **Tracking Code:** `lib/tracking.ts` (dòng 179-230)
- **App Events:** 
  - `begin_checkout`: `components/CourseModal.tsx` (dòng 76)
  - `purchase`: `app/order/[orderCode]/page.tsx` (dòng 69)
