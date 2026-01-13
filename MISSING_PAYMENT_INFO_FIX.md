# 🔧 Missing Payment Info & Date Fix

**Date:** January 13, 2026  
**Issues:** 
1. Ngày đặt hàng shows "N/A"
2. Không hiện QR code và bank info khi click "Tiếp tục thanh toán"

**Status:** ✅ FIXED

---

## 🐛 Problems

### Issue 1: Date Shows "N/A"

**API Response:**
```json
{
  "order_code": "DH895352",
  "status": "pending",
  "payment_status": "pending",
  "created_at": null,  ← No date at order level
  "items": [
    {
      "created_at": "2026-01-13T14:51:35.000Z"  ← Date only in items
    }
  ]
}
```

**Problem:** 
- Lookup API doesn't return `created_at` at order level
- Only items have `created_at`
- Code expects order-level date

### Issue 2: Missing Payment Info

**Flow:**
```
Track Order → Find order DH895352 (pending) → Click "Tiếp tục thanh toán"
→ Navigate to /order/DH895352 → Fetch order from API
→ API returns: { order_code, status, items } ← NO QR CODE!
→ Page shows nothing
```

**Problem:**
- Lookup API only returns order status, not payment details
- QR code and bank info are only returned when creating order
- Old orders retrieved via lookup don't have payment info

---

## ✅ Solutions

### Fix 1: Smart Date Fallback

```typescript
// Use order.created_at if available, otherwise use first item's created_at
const dateToFormat = order.created_at || 
                     (order.items && order.items[0]?.created_at);
return dateToFormat ? formatDate(dateToFormat) : 'N/A';
```

**Priority:**
1. Order-level `created_at` (if exists)
2. First item's `created_at` (fallback)
3. "N/A" (if neither exists)

### Fix 2: Payment Info Detection

**Track Order Page:**
```tsx
{order.payment_status === 'pending' && (
  <div className="space-y-3">
    {/* Warning message */}
    <div className="p-4 bg-amber-50 border-2 border-amber-200">
      <p>⚠️ Đơn hàng chưa thanh toán</p>
      <p>Vui lòng liên hệ support để nhận thông tin thanh toán</p>
    </div>
    
    {/* Action buttons */}
    <div className="flex gap-3">
      <Button onClick={contactSupport}>
        📧 Liên hệ support
      </Button>
      <Button onClick={viewOrder}>
        Xem đơn hàng
      </Button>
    </div>
  </div>
)}
```

**Order Page:**
```tsx
{!isPaid && !isExpired && (
  <>
    {!orderData.qrCodeUrl && !orderData.bankInfo ? (
      // Show "Payment info not available" message
      <Card className="border-amber-200 bg-amber-50">
        <AlertCircle />
        <h2>Thông tin thanh toán không khả dụng</h2>
        <p>Vui lòng liên hệ support để được hỗ trợ</p>
        <Button onClick={contactSupport}>
          📧 Liên hệ support
        </Button>
      </Card>
    ) : (
      // Show QR code and bank info (normal flow)
      <PaymentInfoCard />
    )}
  </>
)}
```

---

## 🎯 User Experience

### Before Fix

**Track Order:**
```
Search email → Find order DH895352
Date: N/A  ❌
Click "Tiếp tục thanh toán" → Navigate to order page → Blank page ❌
```

### After Fix

**Track Order:**
```
Search email → Find order DH895352
Date: 13 tháng 1 năm 2026, 14:51  ✅

Click "Xem đơn hàng" → Navigate to order page
Shows: "Thông tin thanh toán không khả dụng"  ✅
       "Liên hệ support" button  ✅
```

---

## 📊 Scenarios

### Scenario 1: Fresh Order (Just Created)
```
Create order → Get QR + bank info → Store in cache
→ Navigate to /order/DH000123
→ Has full payment info → Shows QR code ✅
```

### Scenario 2: Old Order (Via Lookup)
```
Track order → API returns minimal data (no QR/bank)
→ Click "Xem đơn hàng" → Navigate to /order/DH895352
→ No payment info → Shows contact support message ✅
```

### Scenario 3: Cached Order
```
Track order → Find in localStorage (full data)
→ Navigate to /order/DH895352
→ Has QR + bank info → Shows payment form ✅
```

---

## 🔍 Technical Details

### Date Detection Logic

```typescript
// Priority order:
1. order.created_at          // If API returns it
2. order.items[0].created_at // Fallback to first item
3. "N/A"                     // If nothing available
```

### Payment Info Detection

```typescript
// Check if payment info exists
if (!orderData.qrCodeUrl && !orderData.bankInfo) {
  // Show "contact support" message
} else {
  // Show payment form
}
```

---

## 📝 API Response Handling

### Lookup API Response
```json
{
  "success": true,
  "data": [{
    "order_code": "DH895352",
    "status": "pending",
    "payment_status": "pending",
    "total_amount": "2000",
    // ❌ No created_at here
    // ❌ No qrCodeUrl
    // ❌ No bankInfo
    "items": [{
      "created_at": "2026-01-13T14:51:35.000Z",  // ✅ Use this
      // ...
    }]
  }]
}
```

### Create Order Response
```json
{
  "success": true,
  "orderCode": "DH000123",
  "qrCodeUrl": "https://...",  // ✅ Has payment info
  "bankInfo": {                // ✅ Has bank info
    "bankName": "...",
    "accountNo": "...",
    "accountName": "..."
  },
  "totalAmount": 2000
}
```

---

## ✅ Files Modified

| File | Changes |
|------|---------|
| `app/track-order/page.tsx` | ✅ Smart date fallback<br>✅ Payment warning message<br>✅ Contact support button<br>✅ Updated action buttons |
| `app/order/[orderCode]/page.tsx` | ✅ Payment info detection<br>✅ Fallback message card<br>✅ Contact support flow |

---

## 🚀 Deployment

### Build Status
```
✅ Build: Successful
✅ TypeScript: No errors
✅ Linter: No errors
✅ Production ready
```

### Testing Checklist
- [x] Date shows correctly from items
- [x] "N/A" displays when no date available
- [x] Payment info missing message shows
- [x] Contact support button works
- [x] Fresh orders still show QR code
- [x] Cached orders work correctly

---

## 💡 Recommendations

### For Backend Team

**Add to Lookup API Response:**
```json
{
  "order_code": "DH895352",
  "created_at": "2026-01-13T14:51:35.000Z",  // ← Add this
  "updated_at": "2026-01-13T14:51:35.000Z",  // ← Add this
  // Payment info for pending orders:
  "qrCodeUrl": "https://...",    // ← Add this if pending
  "bankInfo": {                   // ← Add this if pending
    "bankName": "...",
    "accountNo": "...",
    "accountName": "..."
  }
}
```

This would allow users to complete payment for old orders!

---

## 🎯 Result

**Date Issue:** ✅ Fixed - Shows date from items  
**Payment Info:** ✅ Fixed - Shows helpful message with contact support  
**User Experience:** ✅ Improved - Clear guidance for users  

Users can now:
- ✅ See order creation date
- ✅ Understand why payment info is missing
- ✅ Contact support easily
- ✅ View order details

---

**Status:** 🚀 Ready for production deployment!
