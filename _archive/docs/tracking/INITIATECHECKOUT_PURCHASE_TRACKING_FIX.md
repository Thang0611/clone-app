# Fix: InitiateCheckout và Purchase Event Tracking

## 📋 Yêu cầu

- ✅ **InitiateCheckout:** Chỉ fire khi vào trang order (trang show QR code)
- ✅ **Purchase:** Chỉ fire khi thanh toán thành công (payment confirmed)

---

## 🔍 Phân tích hiện trạng

### InitiateCheckout (begin_checkout)

**Trước đây:**
- ❌ Fire trong `CourseModal.tsx` khi modal mở với courses
- ❌ Fire quá sớm - user chưa vào trang thanh toán

**Vấn đề:**
- User mở modal checkout → InitiateCheckout fire
- Nhưng user có thể đóng modal mà không thanh toán
- → InitiateCheckout fire nhưng không có conversion

---

### Purchase

**Hiện tại:**
- ✅ Fire trong `app/order/[orderCode]/page.tsx` khi payment confirmed
- ✅ Đã đúng - chỉ fire khi `status === 'paid'`

**→ Không cần sửa Purchase**

---

## ✅ Giải pháp

### 1. Remove InitiateCheckout từ CourseModal

**File:** `components/CourseModal.tsx`

**Đã remove:**
- Code track `begin_checkout` khi modal mở
- Comment giải thích lý do

**Lý do:**
- Modal chỉ là preview, chưa phải trang thanh toán thực sự
- Trang order (`/order/[orderCode]`) mới là trang show QR code

---

### 2. Thêm InitiateCheckout vào Order Page

**File:** `app/order/[orderCode]/page.tsx`

**Đã thêm:**
- Track `begin_checkout` khi page load với orderData
- Chỉ track khi:
  - ✅ Có `orderData` (đã load xong)
  - ✅ Chưa thanh toán (`isNotPaid`)
  - ✅ Chưa track rồi (duplicate prevention)

**Code:**
```typescript
// Track InitiateCheckout khi vào trang order (trang show QR) - CHỈ khi chưa paid
const checkoutTracked = useRef(false);
useEffect(() => {
  if (orderData && isNotPaid && !checkoutTracked.current) {
    // Prepare items...
    trackCheckout(
      orderData.totalAmount,
      'VND',
      items,
      orderCode,
      orderData.email
    );
    checkoutTracked.current = true;
  }
}, [orderData, isNotPaid, orderCode, trackCheckout]);
```

---

## 📊 Luồng mới

### 1. User submit form → Tạo order

```
User điền form → Click "Thanh toán"
  ↓
useCoursePayment.handlePayment()
  ↓
API: POST /api/v1/orders (tạo order)
  ↓
Navigate to /order/{orderCode}
  ↓
(Không track InitiateCheckout ở đây)
```

### 2. User vào trang order (show QR)

```
Order page load → /order/{orderCode}
  ↓
useOrderData fetch orderData
  ↓
orderData loaded → orderData.items, orderData.totalAmount
  ↓
✅ trackCheckout() → begin_checkout event
  ↓
GTM: Meta Pixel - InitiateCheckout tag fire
  ↓
Facebook: InitiateCheckout event
```

### 3. User thanh toán → Payment confirmed

```
User chuyển tiền → Backend update status = 'paid'
  ↓
usePolling detect status = 'paid'
  ↓
onSuccess callback fire
  ↓
✅ trackPurchase() → purchase event
  ↓
GTM: Meta Pixel - Purchase tag fire
  ↓
Facebook: Purchase event
```

---

## 🎯 Kết quả

### InitiateCheckout

**Fire khi:**
- ✅ User vào trang order (`/order/[orderCode]`)
- ✅ Page load xong với orderData
- ✅ Chưa thanh toán (`paymentStatus !== 'paid'`)

**Không fire khi:**
- ❌ Mở modal checkout (CourseModal)
- ❌ Đã thanh toán (`paymentStatus === 'paid'`)
- ❌ Page chưa load xong

---

### Purchase

**Fire khi:**
- ✅ Payment confirmed (`status === 'paid'`)
- ✅ API `/api/v1/payment/check-status` trả về `paid`
- ✅ Polling hook detect payment success

**Không fire khi:**
- ❌ Tạo order (chưa thanh toán)
- ❌ Vào trang order (chưa thanh toán)
- ❌ Order expire (chưa thanh toán)

---

## 📝 Files đã sửa

### 1. `components/CourseModal.tsx`

**Đã remove:**
- Code track `begin_checkout` khi modal mở
- Comment giải thích lý do remove

**Before:**
```typescript
// Step 3.5: Track begin_checkout when modal opens with courses
useEffect(() => {
  if (isOpen && successfulCourses.length > 0 && !isLoading && !checkoutTracked.current) {
    trackCheckout(totalAmount, 'VND', items, undefined, email);
    checkoutTracked.current = true;
  }
}, [isOpen, successfulCourses, isLoading, totalAmount, trackCheckout, email]);
```

**After:**
```typescript
// ❌ REMOVED: Track begin_checkout khi mở modal
// ✅ InitiateCheckout sẽ được track khi vào trang order (trang show QR)
// Xem: app/order/[orderCode]/page.tsx - Track khi page load với orderData
```

---

### 2. `app/order/[orderCode]/page.tsx`

**Đã thêm:**
- Import `trackCheckout` từ `useTracking`
- useEffect để track InitiateCheckout khi page load
- Duplicate prevention với `checkoutTracked` ref

**Code mới:**
```typescript
const { trackPurchase, trackCheckout } = useTracking();

// Track InitiateCheckout khi vào trang order (trang show QR) - CHỈ khi chưa paid
const checkoutTracked = useRef(false);
useEffect(() => {
  if (orderData && isNotPaid && !checkoutTracked.current) {
    // Prepare items...
    trackCheckout(
      orderData.totalAmount,
      'VND',
      items,
      orderCode,
      orderData.email
    );
    checkoutTracked.current = true;
  }
}, [orderData, isNotPaid, orderCode, trackCheckout]);
```

---

## 🧪 Testing

### Test 1: InitiateCheckout fire khi vào trang order

**Steps:**
1. User submit form → Tạo order
2. Navigate to `/order/{orderCode}`
3. **Verify:**
   - ✅ InitiateCheckout event fire trong GTM Preview
   - ✅ InitiateCheckout event có `value`, `items`, `email_hash`
   - ✅ Facebook Test Events có InitiateCheckout event

**Kết quả mong đợi:**
- ✅ InitiateCheckout fire **1 lần** khi vào trang order
- ✅ Không fire khi mở modal checkout

---

### Test 2: InitiateCheckout không fire khi đã paid

**Steps:**
1. User thanh toán → Payment confirmed
2. Reload trang order
3. **Verify:**
   - ❌ InitiateCheckout event **KHÔNG** fire lại
   - ✅ Chỉ có Purchase event (nếu chưa track)

**Kết quả mong đợi:**
- ✅ InitiateCheckout chỉ fire khi `isNotPaid = true`

---

### Test 3: Purchase fire khi payment confirmed

**Steps:**
1. User vào trang order → InitiateCheckout fire
2. User thanh toán (chuyển tiền)
3. Polling detect `status = 'paid'`
4. **Verify:**
   - ✅ Purchase event fire trong GTM Preview
   - ✅ Purchase event có `value`, `items`, `email_hash`
   - ✅ Facebook Test Events có Purchase event

**Kết quả mong đợi:**
- ✅ Purchase fire **1 lần** khi payment confirmed
- ✅ Không fire khi tạo order hoặc vào trang order

---

### Test 4: Không có duplicate events

**Steps:**
1. User vào trang order → InitiateCheckout fire
2. Reload trang order
3. **Verify:**
   - ❌ InitiateCheckout **KHÔNG** fire lại (duplicate prevention)

**Kết quả mong đợi:**
- ✅ `checkoutTracked.current = true` → Prevent duplicate

---

## ✅ Checklist

### Code Changes
- [x] Remove InitiateCheckout từ `CourseModal.tsx`
- [x] Thêm InitiateCheckout vào `app/order/[orderCode]/page.tsx`
- [x] Verify Purchase chỉ fire khi payment confirmed (đã đúng)

### Testing
- [ ] Test: Vào trang order → Verify InitiateCheckout fire
- [ ] Test: Mở modal checkout → Verify InitiateCheckout KHÔNG fire
- [ ] Test: Thanh toán → Verify Purchase fire
- [ ] Test: Reload trang order → Verify không duplicate

### Verify trong GTM/Facebook
- [ ] GTM Preview: Verify InitiateCheckout fire khi vào trang order
- [ ] GTM Preview: Verify Purchase fire khi payment confirmed
- [ ] Facebook Test Events: Verify InitiateCheckout có đầy đủ data
- [ ] Facebook Test Events: Verify Purchase có đầy đủ data

---

## 📊 So sánh Before/After

### Before

| Event | Khi nào fire | Đúng/Sai |
|-------|--------------|----------|
| **InitiateCheckout** | Mở modal checkout | ❌ **SAI** - Chưa vào trang thanh toán |
| **Purchase** | Payment confirmed | ✅ **ĐÚNG** |

---

### After

| Event | Khi nào fire | Đúng/Sai |
|-------|--------------|----------|
| **InitiateCheckout** | Vào trang order (show QR) | ✅ **ĐÚNG** - Đã vào trang thanh toán |
| **Purchase** | Payment confirmed | ✅ **ĐÚNG** |

---

## 🎯 Kết quả mong đợi

Sau khi sửa:

✅ **InitiateCheckout:**
- Fire khi user vào trang order (trang show QR)
- Không fire khi mở modal checkout
- Chỉ fire 1 lần (duplicate prevention)

✅ **Purchase:**
- Fire khi payment confirmed (`status === 'paid'`)
- Không fire khi tạo order hoặc vào trang order
- Chỉ fire 1 lần (duplicate prevention)

✅ **Tracking chính xác:**
- InitiateCheckout = Intent to purchase (vào trang thanh toán)
- Purchase = Confirmed conversion (đã có tiền)

---

## 📚 Files liên quan

### Files đã sửa:
1. ✅ `components/CourseModal.tsx` - Remove InitiateCheckout
2. ✅ `app/order/[orderCode]/page.tsx` - Thêm InitiateCheckout

### Files đã đúng (giữ nguyên):
1. ✅ `app/order/[orderCode]/page.tsx` - Purchase tracking (khi payment confirmed)
2. ✅ `hooks/usePolling.ts` - Polling payment status
3. ✅ `lib/tracking.ts` - trackBeginCheckout, trackPurchase functions

### Files reference:
- `docs/PURCHASE_EVENT_ANALYSIS.md` - Phân tích Purchase event
- `docs/GTM_FACEBOOK_PIXEL_TEMPLATE_MIGRATION.md` - GTM setup

---

**Last Updated:** $(date)  
**Version:** 1.0
