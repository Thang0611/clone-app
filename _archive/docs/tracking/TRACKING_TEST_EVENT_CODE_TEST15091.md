# Test Meta Pixel với test_event_code: TEST15091

## Cách dùng

Thêm `?test_event_code=TEST15091` vào URL rồi mở site:

```
https://getcourses.net?test_event_code=TEST15091
```

Local:

```
http://localhost:4000?test_event_code=TEST15091
```

---

## Những gì đã hoạt động

| Thành phần | test_event_code |
|------------|------------------|
| **MetaPixel (fbq)** | Có: `fbq('init', ...)` và `fbq('track', 'PageView')` đều gửi `{ test_event_code: 'TEST15091' }` khi có trong URL. |
| **dataLayer** | Có: mọi event (page_view, view_content, form_submit, …) từ `lib/tracking.ts` đều kèm `test_event_code` nếu URL có. |

---

## Kiểm tra trong Facebook

1. Vào [Events Manager](https://business.facebook.com/events_manager2/) → chọn Pixel **3259804720845489**.
2. Mở tab **Test Events**.
3. Ở ô **Test events**, chọn hoặc nhập: **TEST15091**.
4. Mở site với `?test_event_code=TEST15091` → trong vài giây sẽ thấy **PageView** (và ViewContent nếu form Hero vào viewport).

---

## GTM (nếu cần event khác hiện trong Test Events)

Các tag Meta trong GTM (ViewContent, Lead, InitiateCheckout, Purchase) gọi `fbq('track', ...)`. Để `test_event_code` gửi kèm:

1. **Variable:** tạo **Data Layer Variable**  
   - Name: `DLV - test_event_code`  
   - Data Layer Variable Name: `test_event_code`  
   - Data Layer Version: **Version 2** (hoặc tùy container).
2. Trong **Custom HTML** của từng tag, thêm tham số options khi có `test_event_code`:

   ```html
   <script>
   (function(){
     var tc = {{DLV - test_event_code}};
     var opts = (tc && typeof tc === 'string') ? { test_event_code: tc } : {};
     fbq('track', 'ViewContent', {
       content_type: '{{DLV - content_type}}',
       content_name: '{{DLV - content_name}}',
       content_category: '{{DLV - content_category}}'
     }, opts);
   })();
   </script>
   ```

   (Tương tự cho Lead, InitiateCheckout, Purchase.)

---

## Test nhanh trong Console

```javascript
// 1) URL có test_event_code?
new URLSearchParams(window.location.search).get('test_event_code')
// Kỳ vọng: "TEST15091"

// 2) dataLayer có test_event_code?
window.dataLayer?.filter(e => e.test_event_code === 'TEST15091')
// Nên thấy các object event có test_event_code

// 3) fbq đã load?
typeof window.fbq !== 'undefined'
// Kỳ vọng: true
```

---

## Lưu ý

- **TEST15091** phải khớp chính xác (viết hoa, không dấu cách) với code trong Events Manager.
- Chỉ dùng để test; event có `test_event_code` chỉ hiện ở **Test Events**, không tính production.
- Bỏ `?test_event_code=TEST15091` khi test xong.
