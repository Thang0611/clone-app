# Phân tích Sự kiện Mua hàng (Purchase Event)

## 📊 Tổng quan

Phân tích luồng tracking Purchase event và cách đảm bảo **chỉ track khi đã nhận được tiền** (payment confirmed).

---

## 🔍 Phân tích hiện trạng

### Luồng hiện tại có **2 điểm** track Purchase:

#### 1. ❌ **Track Purchase khi tạo Order** (SAI - chưa nhận tiền)

**File:** `hooks/useCoursePayment.ts` (dòng 163-170)

```typescript
// Step 3.6: Track purchase after payment confirmation
// ⚠️ COMMENT NÓI "after payment confirmation" NHƯNG THỰC TẾ CHƯA CÓ TIỀN

await trackPurchase(
  orderData.orderCode,
  totalAmount,
  'VND',
  purchaseItems,
  'bank_transfer',
  email
);
```

**Khi nào fire:**
- ✅ User click nút "Thanh toán" → Tạo order → **NGAY LẬP TỨC** track purchase
- ❌ **CHƯA** có tiền → CHƯA thanh toán → **SAI!**

**Vấn đề:**
- Track purchase **TRƯỚC** khi có tiền
- Có thể track purchase cho order mà user không thanh toán
- Gây sai số trong conversion tracking

---

#### 2. ✅ **Track Purchase khi Payment Confirmed** (ĐÚNG - đã nhận tiền)

**File:** `app/order/[orderCode]/page.tsx` (dòng 44-76)

```typescript
onSuccess: async (paymentData) => {
  // Check for duplicate tracking using localStorage
  const trackingKey = `tracking_sent_${orderCode}`;
  const alreadyTracked = localStorage.getItem(trackingKey);
  
  if (!alreadyTracked && paymentData.status === 'paid' && orderData) {
    // ... prepare items ...
    
    // Track confirmed purchase
    await trackPurchase(
      orderCode,
      paymentData.amount || orderData.totalAmount,
      'VND',
      items,
      'bank_transfer',
      orderData.email
    );

    // Mark as tracked to prevent duplicates
    localStorage.setItem(trackingKey, 'true');
  }
}
```

**Khi nào fire:**
- ✅ User đã thanh toán
- ✅ API `/api/v1/payment/check-status/${orderCode}` trả về `status: 'paid'`
- ✅ Polling hook (`usePolling`) detect payment success
- ✅ **ĐÚNG!** - Chỉ track khi **ĐÃ NHẬN ĐƯỢC TIỀN**

**Cơ chế đảm bảo:**
- Polling liên tục check payment status
- Chỉ fire khi `data.status === 'paid'` (từ API backend)
- Có duplicate prevention (localStorage)
- Amount lấy từ `paymentData.amount` (API confirmed amount)

---

## 📈 Luồng hoàn chỉnh

### 1. User tạo Order

```
User điền form → Click "Thanh toán"
  ↓
useCoursePayment.handlePayment()
  ↓
API: POST /api/v1/orders (tạo order)
  ↓
orderData = { orderCode, totalAmount, items, ... }
  ↓
❌ trackPurchase() ← FIRE Ở ĐÂY (SAI - chưa có tiền)
  ↓
Navigate to /order/{orderCode}
```

### 2. User thanh toán

```
User mở app banking → Quét QR → Chuyển tiền
  ↓
Backend (SePay) nhận webhook → Update payment_status = 'paid'
  ↓
(Chưa có tracking gì)
```

### 3. Payment Confirmed (Polling)

```
Order page load → usePolling hook start
  ↓
Polling: GET /api/v1/payment/check-status/{orderCode}
  ↓
Response: { status: 'pending' } → Continue polling
  ↓
... (user đang chuyển tiền) ...
  ↓
Response: { status: 'paid', amount: 50000 }
  ↓
usePolling.onSuccess({ status: 'paid', amount: 50000 })
  ↓
✅ trackPurchase() ← FIRE Ở ĐÂY (ĐÚNG - đã có tiền)
  ↓
localStorage.setItem('tracking_sent_${orderCode}', 'true')
  ↓
Toast: "Thanh toán thành công!"
```

---

## ⚠️ Vấn đề hiện tại

### Vấn đề 1: Double Tracking

**Hiện tại:**
- Purchase event được track **2 lần**:
  1. Khi tạo order (useCoursePayment) - ❌ SAI
  2. Khi payment confirmed (order page) - ✅ ĐÚNG

**Hậu quả:**
- Facebook Test Events hiển thị duplicate events
- Conversion tracking sai số (tăng gấp đôi)
- Không phản ánh đúng thực tế (track trước khi có tiền)

---

### Vấn đề 2: Track Purchase khi chưa có tiền

**Kịch bản:**
1. User tạo order → **Purchase event fire** ❌
2. User KHÔNG thanh toán → Order expire
3. → **Purchase event đã được track** nhưng **KHÔNG có tiền**

**Hậu quả:**
- Conversion rate sai
- Facebook Pixel tracking không chính xác
- Budget allocation sai

---

## ✅ Giải pháp

### Chỉ track Purchase khi đã nhận được tiền

**Hành động:**
1. ❌ **XÓA/COMMENT** `trackPurchase` trong `useCoursePayment.ts`
2. ✅ **GIỮ** `trackPurchase` trong `app/order/[orderCode]/page.tsx` (khi payment confirmed)

---

## 🔧 Cách sửa

### Bước 1: Sửa `hooks/useCoursePayment.ts`

**Tìm đoạn code (dòng 144-170):**

```typescript
// Step 3.6: Track purchase after payment confirmation
// Helper function to extract platform from URL
const getPlatformFromUrl = (url?: string): string => {
  if (!url) return 'Unknown';
  if (url.includes('udemy.com')) return 'Udemy';
  if (url.includes('coursera.org')) return 'Coursera';
  if (url.includes('linkedin.com/learning')) return 'LinkedIn Learning';
  return 'Unknown';
};

const purchaseItems = successfulCourses.map((course, index) => ({
  item_id: String(course.courseId || `course_${index}`),
  item_name: course.title || 'Khóa học',
  item_category: 'education',
  item_brand: getPlatformFromUrl(course.url),
  price: course.price || 2000,
  quantity: 1,
}));

await trackPurchase(
  orderData.orderCode,
  totalAmount,
  'VND',
  purchaseItems,
  'bank_transfer', // Payment method
  email
);
```

**Thay bằng:**

```typescript
// ❌ REMOVED: Track purchase khi tạo order (chưa có tiền)
// ✅ Purchase event sẽ được track khi payment confirmed
// Xem: app/order/[orderCode]/page.tsx (usePolling.onSuccess)
```

Hoặc comment:

```typescript
// Step 3.6: Track purchase - REMOVED
// ❌ Không track purchase ở đây vì chưa có tiền
// ✅ Purchase sẽ được track khi payment confirmed (app/order/[orderCode]/page.tsx)
// 
// await trackPurchase(
//   orderData.orderCode,
//   totalAmount,
//   'VND',
//   purchaseItems,
//   'bank_transfer',
//   email
// );
```

---

### Bước 2: Verify `app/order/[orderCode]/page.tsx`

**Kiểm tra:** Purchase tracking đã có trong `onSuccess` callback (dòng 44-76)

**Đảm bảo:**
- ✅ Check duplicate: `localStorage.getItem(trackingKey)`
- ✅ Check payment status: `paymentData.status === 'paid'`
- ✅ Track purchase: `await trackPurchase(...)`
- ✅ Mark as tracked: `localStorage.setItem(trackingKey, 'true')`

---

### Bước 3: Remove unused import (optional)

**File:** `hooks/useCoursePayment.ts`

Nếu không dùng `trackPurchase` nữa, có thể remove import:

```typescript
// ❌ Remove nếu không dùng
import { useTracking } from './useTracking';

// ❌ Remove
const { trackPurchase } = useTracking();
```

**Lưu ý:** Giữ lại nếu có thể dùng sau này hoặc để tương thích.

---

## 📊 So sánh Before/After

### Before (❌ SAI)

| Thời điểm | Event | Có tiền? | Đúng/Sai |
|-----------|-------|----------|----------|
| Tạo order | Purchase | ❌ Không | ❌ **SAI** |
| Payment confirmed | Purchase | ✅ Có | ✅ Đúng |
| **Tổng** | **2 events** | - | **1 SAI, 1 ĐÚNG** |

### After (✅ ĐÚNG)

| Thời điểm | Event | Có tiền? | Đúng/Sai |
|-----------|-------|----------|----------|
| Tạo order | (Không track) | ❌ Không | ✅ **ĐÚNG** - Không track |
| Payment confirmed | Purchase | ✅ Có | ✅ **ĐÚNG** - Track |
| **Tổng** | **1 event** | - | **100% ĐÚNG** |

---

## 🧪 Testing

### Test Scenario 1: Normal Flow

**Steps:**
1. User tạo order
2. **Verify:** ❌ KHÔNG có Purchase event trong GTM Preview
3. User thanh toán (chuyển tiền)
4. Polling detect `status: 'paid'`
5. **Verify:** ✅ CÓ Purchase event trong GTM Preview
6. **Verify:** ✅ Purchase event có `value`, `items`, `email_hash`

**Kết quả mong đợi:**
- ✅ Chỉ có **1** Purchase event
- ✅ Purchase event fire **SAU** khi payment confirmed
- ✅ Purchase event có đầy đủ thông tin

---

### Test Scenario 2: User không thanh toán

**Steps:**
1. User tạo order
2. **Verify:** ❌ KHÔNG có Purchase event
3. User **KHÔNG** thanh toán (đóng trang)
4. Order expire
5. **Verify:** ❌ VẪN KHÔNG có Purchase event

**Kết quả mong đợi:**
- ✅ **KHÔNG** có Purchase event nếu không thanh toán
- ✅ Conversion tracking chính xác

---

### Test Scenario 3: Duplicate Prevention

**Steps:**
1. User thanh toán
2. Purchase event fire
3. User refresh page
4. Polling detect `status: 'paid'` lại
5. **Verify:** ❌ KHÔNG có Purchase event thứ 2

**Kết quả mong đợi:**
- ✅ `localStorage` có key `tracking_sent_${orderCode}`
- ✅ Purchase event **KHÔNG** fire lại

---

## 📝 Checklist

### Code Changes
- [ ] Remove/comment `trackPurchase` trong `hooks/useCoursePayment.ts`
- [ ] Verify `trackPurchase` trong `app/order/[orderCode]/page.tsx` vẫn còn
- [ ] Remove unused imports (optional)

### Testing
- [ ] Test: Tạo order → Verify KHÔNG có Purchase event
- [ ] Test: Thanh toán → Verify CÓ Purchase event
- [ ] Test: Không thanh toán → Verify KHÔNG có Purchase event
- [ ] Test: Refresh page sau payment → Verify KHÔNG có duplicate

### Verify trong GTM/Facebook
- [ ] GTM Preview: Verify chỉ có 1 Purchase event sau payment
- [ ] Facebook Test Events: Verify Purchase event có Advanced Matching
- [ ] Facebook Test Events: Verify Purchase event có `value`, `items`, `email_hash`

---

## 🎯 Kết quả mong đợi

### Sau khi sửa:

✅ **Purchase event CHỈ fire khi:**
- Payment status = `'paid'` (từ API)
- API confirm đã nhận được tiền
- Có duplicate prevention

✅ **Purchase event KHÔNG fire khi:**
- Tạo order (chưa thanh toán)
- Order expire (chưa thanh toán)
- Refresh page (đã track rồi)

✅ **Tracking chính xác:**
- Conversion rate đúng
- Facebook Pixel tracking đúng
- Budget allocation đúng

---

## 📚 Files liên quan

### Files cần sửa:
1. ✅ `hooks/useCoursePayment.ts` - **REMOVE** trackPurchase

### Files đã đúng (giữ nguyên):
1. ✅ `app/order/[orderCode]/page.tsx` - **KEEP** trackPurchase (khi payment confirmed)
2. ✅ `hooks/usePolling.ts` - **KEEP** (polling payment status)
3. ✅ `lib/tracking.ts` - **KEEP** (trackPurchase function)

### Files reference:
- `docs/TRACKING_CONFIRMED_PURCHASE.md` - Document về confirmed purchase
- `docs/GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md` - GTM setup
- `docs/GTM_FACEBOOK_PIXEL_TEMPLATE_QUICK_REFERENCE.md` - Quick reference

---

## ⚠️ Lưu ý quan trọng

### 1. Purchase event vs InitiateCheckout

**Purchase:**
- ✅ **CHỈ** track khi payment confirmed
- ✅ Đại diện cho **confirmed conversion**

**InitiateCheckout:**
- ✅ Track khi user click "Thanh toán" (begin_checkout event)
- ✅ Đại diện cho **intent to purchase**
- ✅ KHÔNG cần payment confirmed

**→ Có thể có cả 2 events:**
- `InitiateCheckout` → User click thanh toán
- `Purchase` → Payment confirmed

---

### 2. GTM Configuration

**Trong GTM, cần có tag:**
- ✅ `Meta Pixel - InitiateCheckout` → Trigger: `begin_checkout` event
- ✅ `Meta Pixel - Purchase` → Trigger: `purchase` event

**→ Cả 2 events đều có thể track, nhưng:**
- `InitiateCheckout` = Intent (có thể không convert)
- `Purchase` = Confirmed conversion (đã có tiền)

---

### 3. Facebook Conversion Tracking

**Facebook Ads Manager có thể setup:**
- **Conversion Event:** `Purchase` (chỉ track khi có tiền)
- **Optimization Goal:** `Purchase` (tối ưu cho conversions có tiền)

**→ Cần đảm bảo Purchase event CHỈ fire khi đã có tiền!**

---

**Last Updated:** $(date)  
**Version:** 1.0
