# GTM Tags Reference - Quick Copy/Paste

Quick reference for GTM tag configurations. Copy and paste these into GTM.

---

## Meta Pixel Tags

### 1. Meta Pixel - Base Code

**Tag Type:** Custom HTML  
**Trigger:** Page View - All Pages

**Quan trọng:** Tạo **Variable** (Constant) tên `Meta Pixel ID` = Pixel ID thật (15–16 chữ số). Dùng `{{Meta Pixel ID}}` trong code. Nếu biến trống → `fbq('init', null)` → lỗi **Invalid PixelID: null**. Xem `docs/TRACKING_META_PIXEL_NULL_FIX.md`.

```html
<!-- Meta Pixel Code - dùng {{Meta Pixel ID}} và có guard tránh null -->
<script>
(function() {
  var pixelId = '{{Meta Pixel ID}}';
  if (!pixelId || pixelId === '') return;
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', pixelId);
  fbq('track', 'PageView');
})();
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={{Meta Pixel ID}}&ev=PageView&noscript=1"/>
</noscript>
```

**GTM:** Variable `Meta Pixel ID` (Constant) = ID từ [Events Manager](https://business.facebook.com/events_manager2/).

---

### 2. Meta Pixel - ViewContent

**Tag Type:** Custom HTML  
**Trigger:** Event - view_content

Để gửi thêm **content_ids** (mã khóa học): tạo DLV `content_ids` và thêm `content_ids: {{DLV - content_ids}}` vào object.

```html
<script>
fbq('track', 'ViewContent', {
  content_type: '{{DLV - content_type}}',
  content_name: '{{DLV - content_name}}',
  content_category: '{{DLV - content_category}}'
});
</script>
```

---

### 3. Meta Pixel - Lead (Form Submit)

**Tag Type:** Custom HTML  
**Trigger:** Event - form_submit

Gửi thêm **email_hash** (Advanced Matching) để Facebook match user tốt hơn.

```html
<script>
// Prepare event parameters
var eventParams = {
  content_name: '{{DLV - form_name}}',
  content_category: '{{DLV - form_location}}'
};

// Set user data for Advanced Matching (sẽ hiển thị trong Advanced Matching, không phải Parameters)
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  fbq('set', 'user', { em: emailHash });
}

fbq('track', 'Lead', eventParams);
</script>
```

**Quan trọng:**
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters) - QUAN TRỌNG NHẤT
- ✅ Chỉ set user data nếu có `email_hash`

---

### 4. Meta Pixel - InitiateCheckout

**Tag Type:** Custom HTML  
**Trigger:** Event - begin_checkout

Gửi thêm **contents**, **content_ids** (thông tin khóa học) và **email_hash** (Advanced Matching) để Facebook nhận đủ.

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
  
  // Set user data for Advanced Matching (sẽ hiển thị trong Advanced Matching, không phải Parameters)
  var emailHash = {{DLV - email_hash}};
  if (emailHash && emailHash.trim() !== '') {
    fbq('set', 'user', { em: emailHash });
  }
  
  fbq('track', 'InitiateCheckout', eventParams);
})();
</script>
```

**Quan trọng:**
- ✅ `value` và `item_price` được convert sang Number
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters) - QUAN TRỌNG NHẤT
- ✅ Chỉ set user data nếu có `email_hash`

---

### 5. Meta Pixel - Purchase

**Tag Type:** Custom HTML  
**Trigger:** Event - purchase

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

// Set user data for Advanced Matching (sẽ hiển thị trong Advanced Matching, không phải Parameters)
var emailHash = {{DLV - email_hash}};
if (emailHash && emailHash.trim() !== '') {
  fbq('set', 'user', { em: emailHash });
}

fbq('track', 'Purchase', eventParams);
</script>
```

**Quan trọng:**
- ✅ `value` và `item_price` được convert sang Number
- ✅ `email_hash` được set bằng `fbq('set', 'user', { em: emailHash })` → hiển thị trong **Advanced Matching** (không phải Parameters) - QUAN TRỌNG NHẤT
- ✅ Chỉ set user data nếu có `email_hash`

---

## GA4 Event Tags

### GA4 Event - view_content

**Tag Type:** Google Analytics: GA4 Event  
**Configuration Tag:** (Your GA4 Configuration tag)  
**Event Name:** `view_content`  
**Event Parameters:**
- `content_type`: `{{DLV - content_type}}`
- `content_name`: `{{DLV - content_name}}`
- `content_category`: `{{DLV - content_category}}`  
**Trigger:** Event - view_content

---

### GA4 Event - form_start

**Tag Type:** Google Analytics: GA4 Event  
**Event Name:** `form_start`  
**Event Parameters:**
- `form_id`: `{{DLV - form_id}}`
- `form_name`: `{{DLV - form_name}}`
- `form_location`: `{{DLV - form_location}}`  
**Trigger:** Event - form_start

---

### GA4 Event - form_submit

**Tag Type:** Google Analytics: GA4 Event  
**Event Name:** `form_submit`  
**Event Parameters:**
- `form_id`: `{{DLV - form_id}}`
- `form_name`: `{{DLV - form_name}}`
- `course_count`: `{{DLV - course_count}}`  
**Trigger:** Event - form_submit

---

### GA4 Event - begin_checkout

**Tag Type:** Google Analytics: GA4 Event  
**Event Name:** `begin_checkout`  
**Event Parameters:**
- `value`: `{{DLV - value}}`
- `currency`: `{{DLV - currency}}`
- `items`: `{{DLV - items}}`  
**Trigger:** Event - begin_checkout

---

### GA4 Event - purchase

**Tag Type:** Google Analytics: GA4 Event  
**Event Name:** `purchase`  
**Event Parameters:**
- `transaction_id`: `{{DLV - transaction_id}}`
- `value`: `{{DLV - value}}`
- `currency`: `{{DLV - currency}}`
- `items`: `{{DLV - items}}`
- `payment_type`: `{{DLV - payment_type}}`  
**Trigger:** Event - purchase

---

## Data Layer Variables to Create

Create these variables in GTM → Variables:

| Variable Name | Type | Data Layer Variable Name |
|--------------|------|-------------------------|
| `DLV - content_type` | Data Layer Variable | `content_type` |
| `DLV - content_name` | Data Layer Variable | `content_name` |
| `DLV - content_category` | Data Layer Variable | `content_category` |
| `DLV - form_id` | Data Layer Variable | `form_id` |
| `DLV - form_name` | Data Layer Variable | `form_name` |
| `DLV - form_location` | Data Layer Variable | `form_location` |
| `DLV - course_count` | Data Layer Variable | `course_count` |
| `DLV - value` | Data Layer Variable | `value` |
| `DLV - currency` | Data Layer Variable | `currency` |
| `DLV - items` | Data Layer Variable | `items` |
| `DLV - transaction_id` | Data Layer Variable | `transaction_id` |
| `DLV - payment_type` | Data Layer Variable | `payment_type` |
| `DLV - email_hash` | Data Layer Variable | `email_hash` |

---

## Trigger Configuration

### Page View Triggers

1. **Page View - All Pages**
   - Type: Page View
   - Fires on: All Pages

2. **Page View - History Change**
   - Type: History Change
   - Fires on: All History Change Events

### Custom Event Triggers

For each event, create a trigger:

1. **Event - view_content**
   - Type: Custom Event
   - Event name: `view_content`

2. **Event - form_start**
   - Type: Custom Event
   - Event name: `form_start`

3. **Event - form_submit**
   - Type: Custom Event
   - Event name: `form_submit`

4. **Event - form_submit_success**
   - Type: Custom Event
   - Event name: `form_submit_success`

5. **Event - begin_checkout**
   - Type: Custom Event
   - Event name: `begin_checkout`

6. **Event - purchase**
   - Type: Custom Event
   - Event name: `purchase`

---

## Quick Setup Checklist

1. [ ] Create all triggers (7 triggers)
2. [ ] Create all data layer variables (13 variables)
3. [ ] Create Meta Pixel base code tag
4. [ ] Create Meta Pixel event tags (4 tags)
5. [ ] Create GA4 event tags (5 tags, optional)
6. [ ] Test in GTM Preview mode
7. [ ] Publish GTM container
8. [ ] Verify in Facebook Events Manager
9. [ ] Verify in GA4 DebugView
10. [ ] Set up conversions in Facebook
11. [ ] Import conversions in Google Ads

---

## Notes

- Replace `YOUR_PIXEL_ID_HERE` with actual Pixel ID
- Use GTM variables (e.g., `{{DLV - value}}`) instead of hardcoding
- Test in Preview mode before publishing
- Keep GTM container exported as backup
