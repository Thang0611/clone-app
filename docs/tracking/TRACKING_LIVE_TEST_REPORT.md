# Báo cáo test Tracking / GTM / Pixel (thực tế)

**Ngày:** 2026-01-18  
**URL test:** http://localhost:4000 (và production tương ứng)

---

## 1. Kết quả tự động (scripts/verify-tracking-live.js)

```bash
node scripts/verify-tracking-live.js http://localhost:4000
```

| Kiểm tra | Kết quả | Ghi chú |
|----------|---------|---------|
| **Fetch** | PASS | Trang trả về HTTP 200 |
| **GTM noscript** | PASS | Có `googletagmanager.com/ns.html?id=GTM-5TL3J9D8` |
| **GTM script** | PASS | gtm.js load bằng JS (afterInteractive) — kiểm tra DevTools Network |
| **GA4** | PASS | Có `gtag/js?id=G-RJD9SBFJ59` |
| **Meta Pixel trong HTML** | (tùy chọn) | Thường load qua GTM, không bắt buộc thấy trong HTML |

**GTM Container ID:** `GTM-5TL3J9D8`  
**GA4 Measurement ID:** `G-RJD9SBFJ59`

### Kiểm tra URL trực tiếp

- `https://www.googletagmanager.com/gtm.js?id=GTM-5TL3J9D8` → **HTTP 200**
- `https://www.googletagmanager.com/gtag/js?id=G-RJD9SBFJ59` → **HTTP 200**

→ GTM và GA4 hợp lệ, có thể tải được.

---

## 2. Đã có trên HTML (kiểm tra bằng curl/grep)

- **GTM noscript iframe:**
  - `https://www.googletagmanager.com/ns.html?id=GTM-5TL3J9D8`
- **GA4:**
  - Preload: `googletagmanager.com/gtag/js?id=G-RJD9SBFJ59`

→ GTM và GA4 đã được nhúng đúng.

---

## 3. Kiểm tra trên trình duyệt (dataLayer & events)

Cần chạy trên trang thật (có JS):

1. Mở: `http://localhost:4000` (hoặc `https://getcourses.net`)
2. **F12** → tab **Console**
3. Chạy:

```javascript
// 1) dataLayer có tồn tại không
console.log('dataLayer:', typeof window.dataLayer !== 'undefined' ? 'CÓ' : 'KHÔNG');
console.log('Số event:', window.dataLayer?.length ?? 0);

// 2) Các event đã push
console.log('Events:', window.dataLayer?.map(e => e.event).filter(Boolean));

// 3) GTM đã load chưa
console.log('google_tag_manager:', typeof window.google_tag_manager !== 'undefined' ? 'CÓ' : 'KHÔNG');
```

**Kỳ vọng khi chạy đúng:**

- `dataLayer`: CÓ
- `Số event`: ≥ 2 (ít nhất `gtm.js`, `page_view`, `set_user_properties`)
- `google_tag_manager`: CÓ (sau khi gtm.js chạy)

---

## 4. Trang /debug – Kiểm tra Tracking

1. Mở: `http://localhost:4000/debug`
2. Kéo tới mục **「Tracking / GTM / Pixel」**
3. Bấm **「🔄 Kiểm tra lại」**

Các field cần có (sau khi load xong):

- `dataLayerExists`: true  
- `dataLayerLength`: > 0  
- `dataLayerEvents`: có `page_view`, `set_user_properties`  
- `gtmLoaded`: true  

---

## 5. Network (F12 → Network)

- **gtm.js:** Request tới  
  `https://www.googletagmanager.com/gtm.js?id=GTM-5TL3J9D8`  
  → Status **200**  
- **gtag/js:** Request tới  
  `https://www.googletagmanager.com/gtag/js?id=G-RJD9SBFJ59`  
  → Status **200**  

Nếu có cấu hình Meta trong GTM:  
- **fbevents.js** (hoặc tên tương tự) → 200.

---

## 6. Tóm tắt

| Hạng mục | Trạng thái |
|----------|------------|
| GTM Container (GTM-5TL3J9D8) | Đã nhúng, gtm.js trả 200 |
| GA4 (G-RJD9SBFJ59) | Đã nhúng, gtag/js trả 200 |
| GTM noscript iframe | Có trong HTML |
| dataLayer / events | Cần xác nhận trên browser (Console hoặc /debug) |
| Meta Pixel | Load qua GTM; kiểm tra trong GTM và Facebook Events Manager |

---

## 7. Cách chạy test nhanh

```bash
# Trên máy có Node
node scripts/verify-tracking-live.js http://localhost:4000

# Hoặc production
node scripts/verify-tracking-live.js https://getcourses.net
```

---

## 8. Tài liệu liên quan

- `docs/TRACKING_GTM_VERIFICATION.js` – Script paste vào Console
- `docs/TRACKING_TEST_GUIDE.md` – Hướng dẫn test chi tiết
- `app/debug/page.tsx` – Trang /debug có mục Tracking
