# Quick Test Meta Pixel với Test Event Code

## Test Event Code: TEST59193

---

## Cách Test Nhanh (2 phút)

### Bước 1: Mở trang với test code

```
http://localhost:4000?test_event_code=TEST59193
```

### Bước 2: Chạy test script

1. Mở **DevTools** (F12)
2. Vào tab **Console**
3. Copy và paste script:
   ```bash
   # File: scripts/test-pixel-with-code.js
   ```
4. Nhấn **Enter**

### Bước 3: Kiểm tra kết quả

1. Vào **Facebook Events Manager**: https://business.facebook.com/events_manager2/
2. Chọn **Pixel** của bạn
3. Vào tab **"Test Events"**
4. Nhập code: **TEST59193**
5. Xem events trong real-time

---

## Tự Động Thêm Test Code

Tracking code đã được cập nhật để **tự động** thêm test event code vào mọi events khi có trong URL.

**Không cần làm gì thêm!** Chỉ cần:
- Thêm `?test_event_code=TEST59193` vào URL
- Tất cả events sẽ tự động có test event code

---

## Events Sẽ Được Test

- ✅ **PageView** - Khi load trang
- ✅ **ViewContent** - Khi xem content (sau 3 giây)
- ✅ **FormStart** - Khi focus vào form
- ✅ **FormSubmit** - Khi submit form
- ✅ **BeginCheckout** - Khi mở checkout modal
- ✅ **Purchase** - Khi hoàn thành thanh toán

---

## Kiểm tra trong Console

```javascript
// Check test event code có trong URL không
new URLSearchParams(window.location.search).get('test_event_code')
// Should return: "TEST59193"

// Check events có test code không
window.dataLayer.filter(e => e.test_event_code === 'TEST59193')
// Should show all events with test code
```

---

## Troubleshooting

### Events không hiện trong Facebook?

1. ✅ Check URL có `?test_event_code=TEST59193` không
2. ✅ Check Meta Pixel có load không: `typeof window.fbq !== 'undefined'`
3. ✅ Check GTM tags có fire không (nếu dùng GTM)
4. ✅ Check Network tab: filter `facebook.com/tr`

### Test code không được thêm?

1. ✅ Check URL có test code không
2. ✅ Restart dev server: `npm run dev`
3. ✅ Clear browser cache và reload

---

## Files Đã Tạo

- ✅ `scripts/test-pixel-with-code.js` - Test script với test code
- ✅ `docs/PIXEL_TEST_EVENT_CODE.md` - Hướng dẫn chi tiết
- ✅ `lib/tracking.ts` - Đã cập nhật để tự động thêm test code

---

## Next Steps

1. ✅ Test với URL: `http://localhost:4000?test_event_code=TEST59193`
2. ✅ Chạy test script trong console
3. ✅ Kiểm tra trong Facebook Events Manager
4. ✅ Verify events có test code

---

## Support

Xem thêm:
- `docs/PIXEL_TRACKING_TEST.md` - Hướng dẫn test chi tiết
- `docs/PIXEL_TEST_EVENT_CODE.md` - Hướng dẫn test event code
- `docs/TRACKING_TEST_GUIDE.md` - Hướng dẫn test đầy đủ
