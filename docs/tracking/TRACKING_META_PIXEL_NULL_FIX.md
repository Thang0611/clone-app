# Sửa lỗi: [Meta Pixel] - Invalid PixelID: null

## Nguyên nhân

Tag **Meta Pixel - Base Code** trong GTM gọi `fbq('init', '{{Meta Pixel ID}}')`.  
Biến **{{Meta Pixel ID}}** đang trống hoặc chưa được tạo → `fbq('init', null)` → lỗi **Invalid PixelID: null**.

---

## Cách 1: Sửa trong GTM (khuyến nghị)

### Bước 1: Tạo biến Constant "Meta Pixel ID"

1. Vào **GTM** → Container của site → **Variables** → **User-Defined Variables** → **New**.
2. **Variable type:** Constant.
3. **Name:** `Meta Pixel ID`.
4. **Value:** **Pixel ID thật** từ Facebook (15–16 chữ số).
   - Lấy tại: [Facebook Events Manager](https://business.facebook.com/events_manager2/) → chọn Pixel → **Settings** → **Pixel ID**.
5. **Save**.

### Bước 2: Cập nhật tag "Meta Pixel - Base Code"

1. **Tags** → mở tag **Meta Pixel - Base Code**.
2. Trong Custom HTML, **đổi** từ:
   - `fbq('init', 'YOUR_PIXEL_ID_HERE');`  
   hoặc
   - `fbq('init', '{{Meta Pixel ID}}');` (nếu biến chưa có giá trị)
3. **Dùng đoạn dưới** (có kiểm tra tránh `null`):

```html
<!-- Meta Pixel Code - with null guard -->
<script>
(function() {
  var pixelId = '{{Meta Pixel ID}}';
  if (!pixelId || pixelId === '' || pixelId === 'YOUR_PIXEL_ID_HERE') {
    console.warn('[Meta Pixel] Bỏ qua init: Pixel ID chưa cấu hình trong GTM variable "Meta Pixel ID"');
    return;
  }
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

4. **Save** → **Submit** container (Publish).

### Bước 3: Kiểm tra

- **Variables:** "Meta Pixel ID" = 1 constant, giá trị là dãy số (vd: `1234567890123456`), không để trống.
- **Tag:** Base Code dùng `{{Meta Pixel ID}}` và đoạn code có `if (!pixelId...)` như trên.
- Trên site: Console không còn `Invalid PixelID: null`; có request tới `facebook.com/tr` hoặc `fbevents.js`.

---

## Cách 2: Init Meta Pixel từ app (thay cho Base Code trong GTM)

Nếu không sửa được GTM (ví dụ: không có quyền sửa biến), có thể init Meta Pixel trong app từ `NEXT_PUBLIC_META_PIXEL_ID` và **tắt** tag **Meta Pixel - Base Code** trong GTM.

### Trong app

- Thêm component `MetaPixel` (`components/MetaPixel.tsx`) init từ `NEXT_PUBLIC_META_PIXEL_ID`.
- Trong `app/layout.tsx`, import và đặt `<MetaPixel />` (sau `GoogleTagManager`, trước `GoogleAnalytics`). Component chỉ render khi `NEXT_PUBLIC_META_PIXEL_ID` có giá trị và tracking bật.

### Trong GTM

- **Tắt** (hoặc xóa) tag **Meta Pixel - Base Code** để tránh:
  - `fbq('init', null)`
  - Init hai lần (app + GTM).
- Các tag **chỉ gọi** `fbq('track', ...)` (ViewContent, Lead, InitiateCheckout, Purchase) **giữ nguyên**; chúng dùng `fbq` đã được app init.

### Lưu ý

- Pixel ID trong app lấy từ `NEXT_PUBLIC_META_PIXEL_ID` (ví dụ trong `.env` / `.env.production`).
- Pixel ID phải đúng ID 15–16 chữ số từ Facebook Events Manager; giá trị mẫu như `123456789` thường không đúng.

---

## Checklist nhanh

- [ ] Trong GTM: Variable **Meta Pixel ID** (Constant) đã tạo và có **giá trị ID thật** (15–16 chữ số).
- [ ] Tag **Meta Pixel - Base Code** dùng `{{Meta Pixel ID}}` và có đoạn kiểm tra `if (!pixelId...)` như trên.
- [ ] Đã **Publish** container GTM.
- [ ] Trên site: Console không còn `Invalid PixelID: null`; có `fbevents.js` và request `facebook.com/tr` trong Network.

Nếu dùng **Cách 2**:

- [ ] `NEXT_PUBLIC_META_PIXEL_ID` trong env = ID thật.
- [ ] Component `MetaPixel` được mount trong layout.
- [ ] Tag **Meta Pixel - Base Code** trong GTM đã **tắt**.
