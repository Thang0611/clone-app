# Meta Pixel Test Event Code Guide

Hướng dẫn test Meta Pixel với Test Event Code: **TEST59193**

---

## Cách Test với Test Event Code

### Bước 1: Mở trang với Test Event Code

Thêm `?test_event_code=TEST59193` vào URL:

```
http://localhost:4000?test_event_code=TEST59193
```

Hoặc trong production:

```
https://getcourses.net?test_event_code=TEST59193
```

### Bước 2: Chạy Test Script

1. **Mở DevTools** (F12)
2. **Vào tab Console**
3. **Copy và paste** script:
   ```bash
   # Copy nội dung file:
   scripts/test-pixel-with-code.js
   ```
4. **Nhấn Enter**

### Bước 3: Kiểm tra trong Facebook Events Manager

1. **Truy cập**: https://business.facebook.com/events_manager2/
2. **Chọn Pixel** của bạn
3. **Vào tab "Test Events"**
4. **Nhập Test Event Code**: `TEST59193`
5. **Xem events** trong real-time

---

## Test Script Tự Động

Script sẽ tự động gửi các events sau với test event code:

- ✅ **PageView** - Test page view tracking
- ✅ **ViewContent** - Test content view tracking
- ✅ **Lead** - Test form submission tracking
- ✅ **InitiateCheckout** - Test checkout initiation
- ✅ **Purchase** - Test purchase tracking

---

## Cách Sử Dụng Test Event Code

### Option 1: Thêm vào URL

```
http://localhost:4000?test_event_code=TEST59193
```

### Option 2: Thêm vào Tracking Code

Nếu muốn tự động thêm test event code vào mọi events:

```javascript
// Trong GTM tag hoặc tracking code
fbq('track', 'PageView', {
  test_event_code: 'TEST59193'
});
```

### Option 3: Sử dụng trong dataLayer

```javascript
window.dataLayer.push({
  event: 'page_view',
  test_event_code: 'TEST59193',
  // ... other data
});
```

---

## Kiểm tra Kết Quả

### Trong Browser Console

Sau khi chạy script, bạn sẽ thấy:

```
✅ Test event code found in URL: TEST59193
✅ dataLayer exists
✅ Meta Pixel (fbq) is loaded
✅ Pushed to dataLayer: PageView
✅ Tracked via fbq: PageView
...
```

### Trong Facebook Events Manager

1. Vào **Test Events** tab
2. Nhập code: `TEST59193`
3. Bạn sẽ thấy:
   - PageView event
   - ViewContent event
   - Lead event
   - InitiateCheckout event
   - Purchase event

Mỗi event sẽ có:
- ✅ Timestamp
- ✅ Event parameters
- ✅ Test event code: TEST59193

---

## Troubleshooting

### Issue: Events không hiện trong Facebook

**Kiểm tra:**
1. Test event code có đúng không: `TEST59193`
2. URL có chứa `?test_event_code=TEST59193` không
3. Meta Pixel có load không (check `window.fbq`)
4. GTM tags có fire không (check GTM Preview)

**Giải pháp:**
- Thêm test event code vào URL
- Chạy lại test script
- Kiểm tra Network tab (filter: `facebook.com/tr`)

### Issue: Test event code không được gửi

**Kiểm tra:**
```javascript
// Trong console
window.dataLayer.filter(e => e.test_event_code)
// Should show events with test_event_code
```

**Giải pháp:**
- Đảm bảo test event code được thêm vào mọi events
- Check GTM tags có pass test_event_code không

---

## Quick Test Commands

### Test trong Console

```javascript
// Test với test event code
window.dataLayer.push({
  event: 'test_event',
  test_event_code: 'TEST59193',
  test: true
});

// Nếu fbq loaded
if (typeof window.fbq !== 'undefined') {
  window.fbq('track', 'PageView', {
    test_event_code: 'TEST59193'
  });
}
```

### Test URL

```
http://localhost:4000?test_event_code=TEST59193
```

### Check Events

```javascript
// Check events với test code
window.dataLayer.filter(e => e.test_event_code === 'TEST59193')
```

---

## Lưu Ý

1. **Test Event Code chỉ dùng để test**
   - Không ảnh hưởng đến production data
   - Chỉ hiện trong Test Events tab
   - Tự động expire sau một thời gian

2. **Test Event Code phải match chính xác**
   - Phải viết hoa: `TEST59193`
   - Không có khoảng trắng
   - Phải match với code trong Facebook Events Manager

3. **Events với test code sẽ:**
   - Hiện trong Test Events tab
   - Không tính vào production metrics
   - Có thể filter bằng test event code

---

## Next Steps

Sau khi test thành công:

1. ✅ Verify events hiện trong Facebook
2. ✅ Check event parameters đúng
3. ✅ Test với real user actions
4. ✅ Remove test event code khi deploy production

---

## Support

Nếu gặp vấn đề:

1. Check browser console for errors
2. Verify test event code: `TEST59193`
3. Check Facebook Events Manager
4. Review GTM configuration
5. See `docs/PIXEL_TRACKING_TEST.md` for more details
