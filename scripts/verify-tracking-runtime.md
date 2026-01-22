# 🔍 Hướng dẫn kiểm tra Tracking Runtime

## ✅ Kết quả kiểm tra cấu hình

Tất cả các ID đã được cấu hình đúng trong `.env.production`:

- **GTM ID**: `GTM-5TL3J9D8` ✓
- **GA4 ID**: `G-Z68W3D9YRF` ✓  
- **Meta Pixel ID**: `3259804720845489` ✓

## 🧪 Cách kiểm tra trong Browser

### 1. Kiểm tra GTM (Google Tag Manager)

**Mở Console (F12) và chạy:**
```javascript
// Kiểm tra dataLayer
console.log('dataLayer:', window.dataLayer);

// Kiểm tra GTM container
console.log('GTM loaded:', typeof window.google_tag_manager !== 'undefined');

// Kiểm tra GTM ID trong DOM
const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
console.log('GTM Script:', gtmScript ? 'Found' : 'Not found');
```

**Kết quả mong đợi:**
- `dataLayer` phải là một array
- `window.google_tag_manager` phải tồn tại
- Script GTM phải có trong DOM

### 2. Kiểm tra GA4 (Google Analytics 4)

**Mở Console (F12) và chạy:**
```javascript
// Kiểm tra GA4
console.log('GA4 gtag:', typeof window.gtag !== 'undefined');

// Kiểm tra GA4 config
if (window.gtag) {
  window.gtag('get', 'G-Z68W3D9YRF', 'client_id', (clientId) => {
    console.log('GA4 Client ID:', clientId);
  });
}

// Kiểm tra GA4 script
const ga4Script = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
console.log('GA4 Script:', ga4Script ? 'Found' : 'Not found');
```

**Kết quả mong đợi:**
- `window.gtag` phải là function
- GA4 script phải có trong DOM

### 3. Kiểm tra Meta Pixel

**Mở Console (F12) và chạy:**
```javascript
// Kiểm tra fbq
console.log('fbq:', typeof window.fbq !== 'undefined');

// Kiểm tra Pixel ID đã init
if (window.fbq) {
  console.log('fbq loaded:', true);
  // Kiểm tra Pixel ID trong network requests
  console.log('Check Network tab for fbevents.js requests');
}

// Kiểm tra Pixel script
const pixelScript = document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]');
console.log('Pixel Script:', pixelScript ? 'Found' : 'Not found');

// Kiểm tra Pixel ID trong code
const pixelInit = document.querySelector('script#meta-pixel-init');
console.log('Pixel Init Script:', pixelInit ? 'Found' : 'Not found');
```

**Kết quả mong đợi:**
- `window.fbq` phải là function
- Pixel script phải có trong DOM
- Pixel ID `3259804720845489` phải có trong init code

### 4. Kiểm tra Network Requests

**Mở Network tab (F12 > Network) và filter:**

1. **GTM**: Tìm requests đến `googletagmanager.com/gtm.js?id=GTM-5TL3J9D8`
2. **GA4**: Tìm requests đến `googletagmanager.com/gtag/js?id=G-Z68W3D9YRF`
3. **Pixel**: Tìm requests đến `connect.facebook.net/en_US/fbevents.js`

**Kết quả mong đợi:**
- Tất cả 3 requests phải có status 200
- Requests phải được gửi khi page load

### 5. Kiểm tra không có Duplicate

**Mở Console và chạy:**
```javascript
// Đếm số lượng GTM scripts
const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
console.log('GTM Scripts count:', gtmScripts.length); // Phải = 1

// Đếm số lượng GA4 scripts
const ga4Scripts = document.querySelectorAll('script[src*="gtag/js"]');
console.log('GA4 Scripts count:', ga4Scripts.length); // Phải = 1

// Đếm số lượng Pixel scripts
const pixelScripts = document.querySelectorAll('script[src*="fbevents.js"]');
console.log('Pixel Scripts count:', pixelScripts.length); // Phải = 1
```

**Kết quả mong đợi:**
- Mỗi script chỉ có 1 instance

## 🎯 Test Events

### Test Meta Pixel với Test Event Code

Thêm `?test_event_code=TEST15091` vào URL:
```
https://getcourses.net?test_event_code=TEST15091
```

Sau đó kiểm tra trong Facebook Events Manager > Test Events

### Test GA4 Real-time

1. Vào Google Analytics > Reports > Real-time
2. Mở website trong tab mới
3. Xem real-time report có hiển thị user không

### Test GTM Preview

1. Vào Google Tag Manager > Preview
2. Nhập URL website
3. Kiểm tra các tags có fire không

## ⚠️ Lưu ý

- **Production**: Tracking chỉ hoạt động khi `NODE_ENV=production` hoặc `NEXT_PUBLIC_ENABLE_TRACKING=true`
- **Development**: Có thể cần set `NEXT_PUBLIC_ENABLE_TRACKING=true` trong `.env.local` để test
- **Rebuild**: Sau khi sửa `.env.production`, cần rebuild app để áp dụng thay đổi

## 📝 Checklist

- [ ] GTM ID đúng format: `GTM-XXXXXXX`
- [ ] GA4 ID đúng format: `G-XXXXXXXXXX`
- [ ] Pixel ID đúng format: `15-16 digits`
- [ ] Không có duplicate scripts
- [ ] Tất cả scripts load thành công (200 status)
- [ ] Test events hoạt động trong Facebook Events Manager
- [ ] Real-time data hiển thị trong GA4
- [ ] GTM Preview mode hoạt động
