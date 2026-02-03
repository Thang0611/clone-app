# 🔗 Hướng dẫn kết nối GA4 với GTM

## 📋 Tình trạng hiện tại

Hiện tại GA4 đang được load **trực tiếp** qua component `GoogleAnalytics.tsx` sử dụng `@next/third-parties`. Để kết nối GA4 với GTM, bạn có 2 lựa chọn:

---

## ✅ Cách 1: Load GA4 hoàn toàn qua GTM (Recommended)

**Ưu điểm:**
- Quản lý tập trung tất cả tags trong GTM
- Dễ dàng thay đổi cấu hình GA4 mà không cần deploy code
- Tránh duplicate tracking
- Tận dụng các tính năng của GTM (triggers, variables, etc.)

### Bước 1: Tắt component GoogleAnalytics trong code

**Option A: Comment out trong layout.tsx**

```tsx
// app/layout.tsx
<body className="antialiased">
  <GoogleTagManager />
  
  {/* Tắt GA4 component - Load qua GTM thay thế */}
  {/* <GoogleAnalytics /> */}
  
  <UserPropertiesTracker />
  ...
</body>
```

**Option B: Tạo flag để control**

Cập nhật `components/GoogleAnalytics.tsx`:

```tsx
export default function GoogleAnalytics() {
  // Nếu muốn load GA4 qua GTM, set NEXT_PUBLIC_GA4_VIA_GTM=true
  const loadViaGTM = process.env.NEXT_PUBLIC_GA4_VIA_GTM === 'true';
  
  if (loadViaGTM) {
    return null; // Tắt component, load qua GTM
  }
  
  // Chỉ render nếu GA4 ID được cấu hình và không load qua GTM
  if (!trackingConfig.ga4Id || !validateTrackingConfig()) {
    return null;
  }

  return <NextGoogleAnalytics gaId={trackingConfig.ga4Id} />;
}
```

Sau đó trong `.env.production`:
```
NEXT_PUBLIC_GA4_VIA_GTM=true
```

### Bước 2: Cấu hình GA4 Tag trong GTM

1. **Đăng nhập Google Tag Manager**
   - Vào: https://tagmanager.google.com/
   - Chọn container: `GTM-5TL3J9D8`

2. **Tạo GA4 Configuration Tag**
   - Vào **Tags** > **New**
   - Chọn tag type: **Google Analytics: GA4 Configuration**
   - **Measurement ID**: `G-Z68W3D9YRF` (từ `.env.production`)
   - **Triggering**: Chọn **All Pages**

3. **Cấu hình Advanced Settings (Optional)**
   - **Fields to Set**:
     - `send_page_view`: `true` (tự động gửi page view)
   - **User Properties** (nếu cần):
     - `user_id`: `{{User ID}}` (nếu có)
     - `user_type`: `{{User Type}}`

4. **Lưu và Publish**
   - Click **Save**
   - Click **Submit** > **Publish**

### Bước 3: Verify trong GTM Preview

1. Vào GTM > **Preview**
2. Nhập URL website: `https://getcourses.net`
3. Kiểm tra:
   - ✅ GA4 Configuration tag có fire không
   - ✅ Measurement ID đúng: `G-Z68W3D9YRF`
   - ✅ Page View event được gửi

### Bước 4: Verify trong GA4

1. Vào Google Analytics > **Reports** > **Real-time**
2. Mở website trong tab mới
3. Kiểm tra:
   - ✅ Real-time users hiển thị
   - ✅ Page views được track

---

## 🔄 Cách 2: Load GA4 cả trong code và GTM (Dual Setup)

**Khi nào dùng:**
- Muốn có backup tracking
- Cần test so sánh giữa 2 cách load
- Migration đang trong quá trình

**Lưu ý:** Cần cấu hình đúng để tránh duplicate events.

### Cấu hình trong GTM

1. Tạo GA4 Configuration tag như Cách 1
2. **Quan trọng**: Trong GA4 tag, set:
   - **Fields to Set** > `send_page_view`: `false` (vì code đã gửi)
   - Hoặc dùng **Custom Event** thay vì Configuration tag

### Hoặc: Chỉ track custom events qua GTM

- Giữ GA4 base tracking trong code
- Chỉ track custom events (purchase, lead, etc.) qua GTM

---

## 🧪 Test và Verify

### Test trong Browser Console

```javascript
// Kiểm tra GA4 được load qua GTM
console.log('GA4 via GTM:', window.dataLayer?.some(item => 
  item.event === 'gtm.load' || item['gtm.start']
));

// Kiểm tra GA4 config
if (window.gtag) {
  console.log('GA4 gtag available:', typeof window.gtag);
  
  // Get GA4 config
  window.gtag('get', 'G-Z68W3D9YRF', 'send_page_view', (value) => {
    console.log('GA4 send_page_view:', value);
  });
}

// Kiểm tra không có duplicate
const ga4Scripts = document.querySelectorAll('script[src*="gtag/js"]');
console.log('GA4 Scripts count:', ga4Scripts.length); // Phải = 1
```

### Test trong Network Tab

1. Mở DevTools > **Network**
2. Filter: `gtag/js`
3. Kiểm tra:
   - ✅ Chỉ có 1 request đến `gtag/js?id=G-Z68W3D9YRF`
   - ✅ Request được gửi từ GTM (check referrer)

### Test trong GA4 Real-time

1. Vào GA4 > **Reports** > **Real-time**
2. Thực hiện actions trên website:
   - Page view
   - Click button
   - Form submit
3. Kiểm tra events hiển thị trong real-time

---

## 📝 Checklist

### Trước khi deploy:
- [ ] Đã tắt `GoogleAnalytics` component (nếu dùng Cách 1)
- [ ] Đã tạo GA4 Configuration tag trong GTM
- [ ] Đã set đúng Measurement ID: `G-Z68W3D9YRF`
- [ ] Đã test trong GTM Preview mode
- [ ] Đã verify trong GA4 Real-time
- [ ] Không có duplicate scripts

### Sau khi deploy:
- [ ] GA4 Real-time reports hoạt động
- [ ] Page views được track đúng
- [ ] Custom events (nếu có) hoạt động
- [ ] Không có lỗi trong console

---

## 🔧 Troubleshooting

### Vấn đề: GA4 không track

**Kiểm tra:**
1. GTM Preview mode - tag có fire không?
2. Browser console - có lỗi JavaScript không?
3. Network tab - request đến GA4 có được gửi không?
4. GA4 Real-time - có data không?

**Giải pháp:**
- Verify Measurement ID đúng
- Check GTM tag configuration
- Check triggers đã set đúng chưa
- Clear browser cache và test lại

### Vấn đề: Duplicate events

**Nguyên nhân:**
- GA4 được load cả trong code và GTM
- Page view được gửi 2 lần

**Giải pháp:**
- Tắt `GoogleAnalytics` component (Cách 1)
- Hoặc set `send_page_view: false` trong GTM tag

### Vấn đề: Events không hiển thị trong GA4

**Kiểm tra:**
1. GTM tag có fire không?
2. Event name đúng format không?
3. GA4 property đúng không?
4. Có delay 24-48h cho standard reports (real-time thì ngay lập tức)

---

## 📚 Tài liệu tham khảo

- [GTM GA4 Configuration Tag](https://support.google.com/tagmanager/answer/9442095)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GTM Preview Mode](https://support.google.com/tagmanager/answer/6107056)

---

## 💡 Best Practices

1. **Nên dùng Cách 1** (load hoàn toàn qua GTM) để quản lý tập trung
2. **Test kỹ** trong GTM Preview trước khi publish
3. **Monitor** GA4 Real-time sau khi deploy
4. **Document** các custom events và triggers trong GTM
5. **Backup** GTM container trước khi thay đổi lớn
