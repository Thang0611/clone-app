# Hướng dẫn chuyển từ Custom HTML Tag sang Facebook Pixel Template trong GTM

## 📋 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Phân tích hiện trạng](#phân-tích-hiện-trạng)
3. [Lợi ích của Facebook Pixel Template](#lợi-ích-của-facebook-pixel-template)
4. [Mapping giữa Custom HTML và Template](#mapping-giữa-custom-html-và-template)
5. [Hướng dẫn Step-by-Step](#hướng-dẫn-step-by-step)
6. [Xử lý Advanced Matching](#xử-lý-advanced-matching)
7. [Troubleshooting](#troubleshooting)

---

## 📊 Tổng quan

### Vấn đề hiện tại
- Đang dùng **Custom HTML tags** để track Facebook Pixel events
- Phải maintain JavaScript code thủ công trong GTM
- Dễ bị lỗi Advanced Matching nếu code không đúng
- Khó debug và troubleshoot

### Giải pháp
- Chuyển sang **Facebook Pixel Template** (built-in template của GTM)
- Template tự động xử lý Advanced Matching đúng cách
- Dễ dàng quản lý và debug
- Tương thích với Facebook Events Manager

---

## 🔍 Phân tích hiện trạng

### Hiện tại đang có các Custom HTML tags:

1. **Meta Pixel - Base Code** (Đã tắt, vì init từ app)
2. **Meta Pixel - ViewContent** (Custom HTML)
3. **Meta Pixel - Lead** (Custom HTML) 
4. **Meta Pixel - InitiateCheckout** (Custom HTML)
5. **Meta Pixel - Purchase** (Custom HTML)

### Code hiện tại đang dùng:

```javascript
// Pattern chung:
fbq('set', 'user', { em: emailHash }); // Advanced Matching
fbq('track', 'EventName', eventParams); // Event tracking
```

### Data Layer Variables đang dùng:

- `DLV - items` (array of items)
- `DLV - value` (number)
- `DLV - currency` (string)
- `DLV - email_hash` (string, SHA-256)
- `DLV - content_type`, `DLV - content_name`, `DLV - content_category`
- `DLV - form_name`, `DLV - form_location`

---

## ✅ Lợi ích của Facebook Pixel Template

### 1. Tự động xử lý Advanced Matching
- Template tự động format email hash đúng cách
- Không cần manual `fbq('set', 'user', ...)`
- Hiển thị đúng trong Facebook Test Events → Advanced Matching

### 2. Validation và Error Handling
- Template validate các fields trước khi gửi
- Tự động convert data types (number, string, array)
- Better error messages nếu có lỗi

### 3. Dễ quản lý
- UI rõ ràng, không cần viết code
- Dễ thêm/sửa parameters
- Preview mode hiển thị rõ ràng hơn

### 4. Best Practices
- Tuân thủ Facebook Pixel API standards
- Tự động handle edge cases
- Tối ưu performance

---

## 🔄 Mapping giữa Custom HTML và Template

### Mapping Table

| Custom HTML Code | Facebook Pixel Template Field |
|------------------|-------------------------------|
| `fbq('track', 'EventName', {...})` | **Event Name** dropdown |
| Event parameters object | **Event Parameters** (table) |
| `fbq('set', 'user', { em: emailHash })` | **User Data** → Email |
| `{{Meta Pixel ID}}` | **Pixel ID** (variable) |
| `{{DLV - value}}` | **Event Parameters** → `value` |
| `{{DLV - currency}}` | **Event Parameters** → `currency` |
| `{{DLV - items}}` → `contents` | **Event Parameters** → `contents` (array) |
| `{{DLV - items}}` → `content_ids` | **Event Parameters** → `content_ids` (array) |

### Event Parameters Mapping

| Event | Custom HTML Parameter | Template Parameter | Type |
|-------|----------------------|-------------------|------|
| **Lead** | `content_name` | `content_name` | String |
| **Lead** | `content_category` | `content_category` | String |
| **InitiateCheckout** | `value` | `value` | Number |
| **InitiateCheckout** | `currency` | `currency` | String |
| **InitiateCheckout** | `contents` (from items) | `contents` | Array |
| **InitiateCheckout** | `content_ids` (from items) | `content_ids` | Array |
| **InitiateCheckout** | `num_items` | `num_items` | Number |
| **InitiateCheckout** | `content_type` | `content_type` | String |
| **Purchase** | `value` | `value` | Number |
| **Purchase** | `currency` | `currency` | String |
| **Purchase** | `contents` (from items) | `contents` | Array |
| **Purchase** | `content_ids` (from items) | `content_ids` | Array |
| **Purchase** | `content_type` | `content_type` | String |

---

## 📝 Hướng dẫn Step-by-Step

### Bước 1: Chuẩn bị

#### 1.1 Kiểm tra Variables trong GTM

Đảm bảo các Variables sau đã có:

- ✅ `Meta Pixel ID` (Constant) = Pixel ID của bạn (15-16 chữ số)
- ✅ `DLV - items` (Data Layer Variable: `items`)
- ✅ `DLV - value` (Data Layer Variable: `value`)
- ✅ `DLV - currency` (Data Layer Variable: `currency`)
- ✅ `DLV - email_hash` (Data Layer Variable: `email_hash`)
- ✅ `DLV - content_type` (Data Layer Variable: `content_type`)
- ✅ `DLV - content_name` (Data Layer Variable: `content_name`)
- ✅ `DLV - content_category` (Data Layer Variable: `content_category`)
- ✅ `DLV - form_name` (Data Layer Variable: `form_name`)
- ✅ `DLV - form_location` (Data Layer Variable: `form_location`)

#### 1.2 Tạo Custom JavaScript Variable (nếu cần transform data)

Vì Template cần `contents` và `content_ids` là array riêng, bạn có thể tạo JavaScript Variables để transform:

**Variable: `JS - contents`** (Transform `items` → `contents` array)

**Type:** Custom JavaScript  
**JavaScript Code:**
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

**Variable: `JS - content_ids`** (Transform `items` → `content_ids` array)

**Type:** Custom JavaScript  
**JavaScript Code:**
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

**Variable: `JS - num_items`** (Count items)

**Type:** Custom JavaScript  
**JavaScript Code:**
```javascript
function() {
  var items = {{DLV - items}} || [];
  return items.length;
}
```

---

### Bước 2: Tạo Facebook Pixel Template Tags

#### 2.1 Tag: Meta Pixel - ViewContent

**Tag Configuration:**
1. **Tag Type:** `Facebook Pixel`
2. **Tag Name:** `Meta Pixel - ViewContent`

**Settings:**
- **Pixel ID:** `{{Meta Pixel ID}}`
- **Event Name:** `ViewContent`
- **Event Parameters:**
  - `content_type` = `{{DLV - content_type}}`
  - `content_name` = `{{DLV - content_name}}`
  - `content_category` = `{{DLV - content_category}}`

**Trigger:** `Event - view_content`

**Advanced Matching (User Data):**
- Không cần email cho ViewContent

---

#### 2.2 Tag: Meta Pixel - Lead

**Tag Configuration:**
1. **Tag Type:** `Facebook Pixel`
2. **Tag Name:** `Meta Pixel - Lead`

**Settings:**
- **Pixel ID:** `{{Meta Pixel ID}}`
- **Event Name:** `Lead`
- **Event Parameters:**
  - `content_name` = `{{DLV - form_name}}`
  - `content_category` = `{{DLV - form_location}}`

**Trigger:** `Event - form_submit`

**Advanced Matching (User Data):**
- ✅ **Email:** `{{DLV - email_hash}}` (QUAN TRỌNG - sẽ tự động xử lý đúng cách)

**Lưu ý:** 
- Template tự động nhận email hash và format đúng cho Advanced Matching
- Không cần `fbq('set', 'user', ...)` nữa!

---

#### 2.3 Tag: Meta Pixel - InitiateCheckout

**Tag Configuration:**
1. **Tag Type:** `Facebook Pixel`
2. **Tag Name:** `Meta Pixel - InitiateCheckout`

**Settings:**
- **Pixel ID:** `{{Meta Pixel ID}}`
- **Event Name:** `InitiateCheckout`
- **Event Parameters:**
  - `value` = `{{DLV - value}}` (Number)
  - `currency` = `{{DLV - currency}}`
  - `contents` = `{{JS - contents}}` (Array - dùng Custom JS Variable)
  - `content_ids` = `{{JS - content_ids}}` (Array - dùng Custom JS Variable)
  - `num_items` = `{{JS - num_items}}` (Number)
  - `content_type` = `product`

**Trigger:** `Event - begin_checkout`

**Advanced Matching (User Data):**
- ✅ **Email:** `{{DLV - email_hash}}`

**Lưu ý:**
- `value` phải là Number → Template tự động convert nếu cần
- `contents` và `content_ids` phải là Array → Dùng Custom JS Variables để transform

---

#### 2.4 Tag: Meta Pixel - Purchase

**Tag Configuration:**
1. **Tag Type:** `Facebook Pixel`
2. **Tag Name:** `Meta Pixel - Purchase`

**Settings:**
- **Pixel ID:** `{{Meta Pixel ID}}`
- **Event Name:** `Purchase`
- **Event Parameters:**
  - `value` = `{{DLV - value}}` (Number)
  - `currency` = `{{DLV - currency}}`
  - `contents` = `{{JS - contents}}` (Array)
  - `content_ids` = `{{JS - content_ids}}` (Array)
  - `content_type` = `product`

**Trigger:** `Event - purchase`

**Advanced Matching (User Data):**
- ✅ **Email:** `{{DLV - email_hash}}`

**Lưu ý:**
- Tương tự InitiateCheckout, cần transform `items` → `contents` và `content_ids`

---

### Bước 3: Test trong Preview Mode

#### 3.1 Enable Preview Mode trong GTM

1. Click **Preview** ở góc trên bên phải
2. Nhập URL website của bạn
3. Click **Connect**

#### 3.2 Test từng event

**Test ViewContent:**
1. Navigate đến page có ViewContent event
2. Trong GTM Preview, kiểm tra tag `Meta Pixel - ViewContent` đã fire
3. Click vào tag → Xem **Variables** tab
4. Verify các parameters:
   - `content_type` có giá trị
   - `content_name` có giá trị
   - `content_category` có giá trị

**Test Lead:**
1. Submit form
2. Trong GTM Preview, kiểm tra tag `Meta Pixel - Lead` đã fire
3. Click vào tag → Xem **Variables** tab
4. Verify:
   - **Event Parameters:** `content_name`, `content_category`
   - **User Data:** `em` (email hash) có giá trị

**Test InitiateCheckout:**
1. Trigger `begin_checkout` event
2. Trong GTM Preview, kiểm tra tag `Meta Pixel - InitiateCheckout` đã fire
3. Click vào tag → Xem **Variables** tab
4. Verify:
   - **Event Parameters:**
     - `value` là Number (không phải string)
     - `currency` là string
     - `contents` là Array có format: `[{id, quantity, item_price}]`
     - `content_ids` là Array: `["id1", "id2"]`
     - `num_items` là Number
   - **User Data:** `em` (email hash) có giá trị

**Test Purchase:**
1. Trigger `purchase` event
2. Tương tự InitiateCheckout, verify các parameters

#### 3.3 Kiểm tra Network Request

1. Mở **DevTools** → **Network** tab
2. Filter: `facebook.com/tr`
3. Trigger event (ví dụ: Purchase)
4. Click vào request `facebook.com/tr`
5. Xem **Payload** tab → **Form Data** hoặc **Query String Parameters**

**Verify:**
- ✅ `ev` = Event Name (Lead, InitiateCheckout, Purchase)
- ✅ `cd[value]` = value (number)
- ✅ `cd[currency]` = currency (string)
- ✅ `cd[contents]` = JSON array
- ✅ `cd[content_ids]` = JSON array
- ✅ `ud[em]` = email hash (trong Advanced Matching, KHÔNG phải Parameters)

---

### Bước 4: Pause/Tắt các Custom HTML Tags cũ

**QUAN TRỌNG:** Trước khi publish, phải tắt các Custom HTML tags cũ để tránh double tracking!

1. Vào **Tags** trong GTM
2. Tìm các tags:
   - ❌ `Meta Pixel - ViewContent` (Custom HTML) → **Pause**
   - ❌ `Meta Pixel - Lead` (Custom HTML) → **Pause**
   - ❌ `Meta Pixel - InitiateCheckout` (Custom HTML) → **Pause**
   - ❌ `Meta Pixel - Purchase` (Custom HTML) → **Pause**
3. Click vào từng tag → Click **Pause** (hoặc Disable)
4. **KHÔNG XÓA** - giữ lại để reference nếu cần

---

### Bước 5: Publish Container

1. Click **Submit** ở góc trên bên phải
2. **Version Name:** `Migrate Facebook Pixel to Template (Advanced Matching Fix)`
3. **Version Description:**
   ```
   - Chuyển từ Custom HTML tags sang Facebook Pixel Template
   - Fix Advanced Matching (email hash hiển thị đúng trong Advanced Matching)
   - Dễ quản lý và maintain hơn
   ```
4. Click **Publish**

---

### Bước 6: Test trên Production

#### 6.1 Test trong Facebook Test Events

1. Vào [Facebook Events Manager](https://business.facebook.com/events_manager2/)
2. Chọn Pixel của bạn
3. Vào **Test Events**
4. Trigger events trên website:

**Test Lead:**
- Submit form
- Trong Test Events, xem event **Lead**
- Verify:
  - ✅ **Parameters:** `content_name`, `content_category`
  - ✅ **Advanced Matching → User:** `em` = email hash (SHA-256)
  - ✅ **Advanced Matching:** IP Address, User Agent

**Test InitiateCheckout:**
- Trigger checkout event
- Verify:
  - ✅ **Parameters:** `value`, `currency`, `contents`, `content_ids`, `num_items`, `content_type`
  - ✅ **Advanced Matching → User:** `em` = email hash
  - ✅ `contents` là array: `[{id, quantity, item_price}]`
  - ✅ `content_ids` là array: `["id1"]`

**Test Purchase:**
- Tương tự InitiateCheckout
- Verify tất cả parameters

#### 6.2 Kiểm tra không có double tracking

1. Mở **DevTools** → **Network** tab
2. Filter: `facebook.com/tr`
3. Trigger event (ví dụ: Lead)
4. **Kết quả mong đợi:** Chỉ có **1 request** đến `facebook.com/tr` với event Lead
5. Nếu có 2 requests → Còn Custom HTML tag đang chạy → Kiểm tra lại Bước 4

---

## 🔐 Xử lý Advanced Matching

### Vấn đề với Custom HTML

**Code cũ (SAI):**
```javascript
var eventParams = { value: 100, currency: 'VND' };
eventParams.user_data = { em: emailHash }; // ❌ SAI - sẽ hiển thị trong Parameters
fbq('track', 'Purchase', eventParams);
```

**Code cũ (ĐÚNG nhưng phức tạp):**
```javascript
fbq('set', 'user', { em: emailHash }); // ✅ ĐÚNG nhưng phải manual
fbq('track', 'Purchase', eventParams);
```

### Giải pháp với Facebook Pixel Template

**Template tự động xử lý:**
1. Vào tag → **User Data** section
2. Nhập `{{DLV - email_hash}}` vào field **Email**
3. Template tự động:
   - Validate email hash format
   - Set đúng vị trí (Advanced Matching, không phải Parameters)
   - Format đúng theo Facebook API

**Kết quả:**
- ✅ Email hash hiển thị trong **Advanced Matching → User**
- ✅ Không cần viết code `fbq('set', 'user', ...)`
- ✅ Tự động validate và error handling

### Lưu ý về Email Hash

**Format yêu cầu:**
- SHA-256 hash (64 ký tự hex)
- Lowercase
- No prefix/suffix

**Code app đang hash email:**
```typescript
// lib/tracking.ts
export async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
```

**Kết quả:** Đã đúng format → Chỉ cần dùng `{{DLV - email_hash}}` trong Template

---

## 🐛 Troubleshooting

### Vấn đề 1: Template không fire

**Triệu chứng:**
- Tag không fire trong Preview Mode
- Không có request đến `facebook.com/tr`

**Giải pháp:**
1. Kiểm tra **Trigger** đã đúng chưa
2. Kiểm tra **Pixel ID** variable có giá trị không
3. Kiểm tra Data Layer có push event chưa
4. Xem **Console** tab trong Preview Mode có lỗi không

---

### Vấn đề 2: Advanced Matching không hiển thị email

**Triệu chứng:**
- Trong Facebook Test Events, không thấy email hash trong Advanced Matching
- Hoặc thấy trong Parameters thay vì Advanced Matching

**Giải pháp:**
1. Kiểm tra **User Data → Email** trong Template có giá trị không
2. Verify `{{DLV - email_hash}}` có giá trị trong Preview Mode
3. Kiểm tra email hash format (64 ký tự hex, lowercase)
4. Xem Network request → `ud[em]` có trong request không

**Debug:**
```javascript
// Trong Console, check:
console.log('Email hash:', {{DLV - email_hash}});
// Phải là: 64 ký tự hex (0-9, a-f)
```

---

### Vấn đề 3: contents/content_ids không đúng format

**Triệu chứng:**
- Facebook Test Events hiển thị `contents` sai
- Hoặc `content_ids` là empty array

**Giải pháp:**
1. Kiểm tra Custom JS Variables (`JS - contents`, `JS - content_ids`)
2. Verify `{{DLV - items}}` có data chưa
3. Test JS Variables trong Preview Mode → Variables tab

**Debug:**
```javascript
// Trong Preview Mode → Variables tab, check:
// JS - contents: phải là array [{id, quantity, item_price}]
// JS - content_ids: phải là array ["id1", "id2"]
```

---

### Vấn đề 4: value không phải Number

**Triệu chứng:**
- `value` hiển thị là string trong Facebook Test Events
- Hoặc có lỗi validation

**Giải pháp:**
1. Template tự động convert, nhưng nếu vẫn sai:
2. Tạo Custom JS Variable để convert:
   ```javascript
   // JS - value_number
   function() {
     return Number({{DLV - value}}) || 0;
   }
   ```
3. Dùng `{{JS - value_number}}` trong Template

---

### Vấn đề 5: Double tracking (2 requests cùng event)

**Triệu chứng:**
- Trong Network tab, có 2 requests `facebook.com/tr` với cùng event
- Facebook Test Events hiển thị duplicate events

**Giải pháp:**
1. Kiểm tra đã **Pause** Custom HTML tags cũ chưa (Bước 4)
2. Kiểm tra có tag nào khác cũng fire event này không
3. Verify trong Preview Mode → Tags Fired → Chỉ có 1 tag mới

---

### Vấn đề 6: Template không có trong Tag Type dropdown

**Triệu chọn:**
- Không thấy "Facebook Pixel" trong Tag Type dropdown

**Giải pháp:**
1. Facebook Pixel Template là **built-in template** của GTM
2. Nếu không thấy, có thể container cũ → Upgrade GTM container
3. Hoặc dùng **Community Template Gallery**:
   - Vào **Templates** → **Tag Templates** → **Browse Template Gallery**
   - Search: "Facebook Pixel"
   - Click **Add to Workspace**

---

## 📊 Checklist

### Trước khi bắt đầu
- [ ] Backup GTM container (Export container)
- [ ] Verify tất cả Variables đã có
- [ ] Tạo Custom JS Variables (contents, content_ids, num_items) nếu cần

### Tạo Tags
- [ ] Meta Pixel - ViewContent (Template)
- [ ] Meta Pixel - Lead (Template)
- [ ] Meta Pixel - InitiateCheckout (Template)
- [ ] Meta Pixel - Purchase (Template)

### Test
- [ ] Test trong Preview Mode - ViewContent
- [ ] Test trong Preview Mode - Lead (verify Advanced Matching)
- [ ] Test trong Preview Mode - InitiateCheckout (verify contents, content_ids)
- [ ] Test trong Preview Mode - Purchase (verify contents, content_ids)
- [ ] Verify Network requests (facebook.com/tr)

### Publish
- [ ] Pause Custom HTML tags cũ
- [ ] Publish container
- [ ] Test trên Production - Facebook Test Events
- [ ] Verify không có double tracking

### Verify trong Facebook
- [ ] Lead event có email trong Advanced Matching
- [ ] InitiateCheckout có contents/content_ids
- [ ] Purchase có contents/content_ids
- [ ] Tất cả events có value/currency đúng format

---

## 📚 Tài liệu tham khảo

### Facebook Pixel Documentation
- [Facebook Pixel API](https://developers.facebook.com/docs/facebook-pixel/api-reference)
- [Advanced Matching](https://www.facebook.com/business/help/611774685654668)
- [Facebook Pixel Template in GTM](https://support.google.com/tagmanager/answer/9442095)

### GTM Documentation
- [Custom Templates](https://support.google.com/tagmanager/topic/7683284)
- [Data Layer Variables](https://support.google.com/tagmanager/answer/6164469)
- [Preview Mode](https://support.google.com/tagmanager/answer/6107056)

### Code References
- `docs/TRACKING_GTM_TAGS_REFERENCE.md` - Custom HTML tags cũ (reference)
- `docs/GTM_TAGS_COPY_PASTE.md` - Code cũ (reference)
- `docs/ADVANCED_MATCHING_FIX.md` - Vấn đề Advanced Matching
- `lib/tracking.ts` - Tracking functions (push data to dataLayer)

---

## 🎯 Kết quả mong đợi

Sau khi hoàn thành migration:

✅ **Dễ quản lý hơn:**
- Không cần maintain JavaScript code trong GTM
- UI rõ ràng, dễ thêm/sửa parameters

✅ **Advanced Matching hoạt động đúng:**
- Email hash hiển thị trong Advanced Matching (không phải Parameters)
- Tự động validate và format

✅ **Better error handling:**
- Template tự động validate fields
- Better error messages

✅ **Performance tốt hơn:**
- Template tối ưu hóa code
- Faster loading time

✅ **Tương thích với Facebook:**
- Tuân thủ Facebook Pixel API standards
- Tương thích với Events Manager

---

## 📞 Support

Nếu gặp vấn đề, check:
1. Troubleshooting section ở trên
2. GTM Preview Mode → Console tab (xem lỗi)
3. Facebook Test Events → Xem event details
4. Network tab → Xem request payload

---

**Last Updated:** $(date)  
**Author:** Migration Guide  
**Version:** 1.0
