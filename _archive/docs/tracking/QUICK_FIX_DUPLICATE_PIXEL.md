# Quick Fix: Facebook Pixel Activated 2 Times

## 🔴 Vấn đề

Meta Pixel Helper báo:
> **"The Facebook pixel activated 2 times on this web page"**

---

## ✅ Giải pháp nhanh (5 phút)

### Bước 1: Vào Google Tag Manager

1. Đăng nhập [tagmanager.google.com](https://tagmanager.google.com)
2. Chọn container của bạn

### Bước 2: Tìm và Pause tag "Meta Pixel - Base Code"

1. Vào **Tags** (menu bên trái)
2. Tìm tag có tên:
   - `Meta Pixel - Base Code`
   - `Facebook Pixel - Base Code`
   - Hoặc bất kỳ tag nào có code `fbq('init', ...)`

3. Click vào tag → Click **Pause** (hoặc **Disable**)

### Bước 3: Publish GTM Container

1. Click **Submit** (góc trên bên phải)
2. **Version Name:** `Fix duplicate pixel initialization`
3. Click **Publish**

### Bước 4: Test

1. Reload website
2. Mở **Meta Pixel Helper** extension
3. Verify: ✅ Không còn warning "activated 2 times"

---

## 🔍 Tại sao bị duplicate?

**Pixel đang được init từ 2 nơi:**

1. ✅ **App** (`components/MetaPixel.tsx`) → `fbq('init', pixelId)` - **GIỮ LẠI**
2. ❌ **GTM** (tag "Meta Pixel - Base Code") → `fbq('init', pixelId)` - **CẦN TẮT**

**→ Giải pháp:** Tắt tag trong GTM, chỉ giữ init từ app.

---

## ✅ Tags nên giữ lại trong GTM

Các tag **CHỈ** track events (không init pixel):
- ✅ `Meta Pixel - ViewContent` → `fbq('track', 'ViewContent', ...)`
- ✅ `Meta Pixel - Lead` → `fbq('track', 'Lead', ...)`
- ✅ `Meta Pixel - InitiateCheckout` → `fbq('track', 'InitiateCheckout', ...)`
- ✅ `Meta Pixel - Purchase` → `fbq('track', 'Purchase', ...)`

---

## ❌ Tags cần tắt

Các tag **INIT** pixel (gây duplicate):
- ❌ `Meta Pixel - Base Code` → `fbq('init', ...)` - **PAUSE**
- ❌ Bất kỳ Custom HTML nào có `fbq('init', ...)` - **PAUSE**

---

## 🧪 Verify sau khi fix

### Test 1: Console
```javascript
// Mở DevTools → Console
// Search: fbq('init
// Verify: Chỉ có 1 lần gọi fbq('init')
```

### Test 2: Meta Pixel Helper
- ✅ Không còn warning "activated 2 times"
- ✅ Chỉ có 1 PageView event
- ✅ Events không duplicate

### Test 3: GTM Preview
- ✅ Tags Fired → Không có tag nào gọi `fbq('init')`
- ✅ Chỉ có tags track events

---

## 📚 Tài liệu chi tiết

Xem `docs/FACEBOOK_PIXEL_DUPLICATE_INIT_FIX.md` để có hướng dẫn chi tiết hơn.

---

**Last Updated:** $(date)  
**Version:** 1.0
