# Confirmed Purchase Tracking Implementation

## Overview

Added **Confirmed Purchase Tracking** event that fires when payment status API confirms a transaction is 100% successful (`paymentStatus === 'paid'`).

---

## Implementation Details

### Location
- **Hook**: `hooks/usePolling.ts` - Modified to pass payment data to `onSuccess` callback
- **Component**: `app/order/[orderCode]/page.tsx` - Added tracking in `onSuccess` callback

### Flow

1. **Payment Status Check**: `usePolling` hook continuously polls `/api/v1/payment/check-status/${orderCode}`
2. **Payment Confirmed**: When API returns `{ status: 'paid', amount: number }`
3. **Duplicate Check**: Checks `localStorage` for `tracking_sent_${orderCode}`
4. **Track Purchase**: If not already tracked, fires `trackPurchase` event
5. **Mark as Sent**: Sets `localStorage.setItem('tracking_sent_${orderCode}', 'true')`

---

## Code Changes

### 1. Modified `hooks/usePolling.ts`

**Changed `onSuccess` callback signature:**
```typescript
// Before
onSuccess?: () => void;

// After
onSuccess?: (data: { status: 'paid'; amount: number }) => void;
```

**Updated success handler:**
```typescript
if (data.status === 'paid' && !isPaymentSuccessHandledRef.current) {
  isPaymentSuccessHandledRef.current = true;
  setStatus('paid');
  stopPolling();
  onSuccess?.({ status: 'paid', amount: data.amount }); // Pass payment data
}
```

### 2. Modified `app/order/[orderCode]/page.tsx`

**Added tracking imports:**
```typescript
import { useTracking } from "@/hooks/useTracking";
```

**Added tracking hook:**
```typescript
const { trackPurchase } = useTracking();
```

**Updated `onSuccess` callback:**
```typescript
onSuccess: async (paymentData) => {
  // Check for duplicate tracking using localStorage
  const trackingKey = `tracking_sent_${orderCode}`;
  const alreadyTracked = localStorage.getItem(trackingKey);
  
  if (!alreadyTracked && paymentData.status === 'paid' && orderData) {
    // Prepare items for tracking
    const getPlatformFromUrl = (url?: string): string => {
      if (!url) return 'Unknown';
      if (url.includes('udemy.com')) return 'Udemy';
      if (url.includes('coursera.org')) return 'Coursera';
      if (url.includes('linkedin.com/learning')) return 'LinkedIn Learning';
      return 'Unknown';
    };

    const items = orderData.items.map((item, index) => ({
      item_id: String(item.courseId || `course_${index}`),
      item_name: item.title || 'Khóa học',
      item_category: 'education',
      item_brand: getPlatformFromUrl(item.url),
      price: item.price || 0,
      quantity: 1,
    }));

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

  // ... rest of success handler
}
```

---

## Event Data Structure

### Purchase Event (Confirmed)
```typescript
{
  event: 'purchase',
  transaction_id: 'ORD_ABC123', // orderCode
  value: 199000, // paymentData.amount from API
  currency: 'VND',
  tax: 0,
  shipping: 0,
  items: [
    {
      item_id: '12345',
      item_name: 'React Complete Guide',
      item_category: 'education',
      item_brand: 'Udemy',
      price: 50000,
      quantity: 1
    }
  ],
  payment_type: 'bank_transfer',
  email_hash: 'sha256_hash_here' // Hashed email
}
```

---

## Duplicate Prevention

### Mechanism
- Uses `localStorage` key: `tracking_sent_${orderCode}`
- Checks before tracking: `localStorage.getItem(trackingKey)`
- Sets after tracking: `localStorage.setItem(trackingKey, 'true')`

### Why This Works
- `localStorage` persists across page refreshes
- Each order code has unique key
- Prevents tracking if user refreshes page after payment confirmation
- Prevents tracking if polling detects payment multiple times

---

## Testing

### Test Scenario 1: Normal Flow
1. User completes payment
2. Polling detects `status: 'paid'`
3. Check `localStorage` - key should NOT exist
4. `trackPurchase` fires
5. Check `localStorage` - key should exist: `tracking_sent_ORD_ABC123`
6. Refresh page
7. Polling detects `status: 'paid'` again
8. Check `localStorage` - key exists, tracking does NOT fire again ✅

### Test Scenario 2: Verify Event Data
1. Complete payment flow
2. Open browser console
3. Check `window.dataLayer` for `purchase` event
4. Verify:
   - `transaction_id` = order code
   - `value` = amount from API response
   - `items` array has correct structure
   - `email_hash` is hashed (not plain email)

### Test Scenario 3: Multiple Orders
1. Complete Order 1 payment
2. Check `localStorage` - should have `tracking_sent_ORD_001`
3. Complete Order 2 payment
4. Check `localStorage` - should have `tracking_sent_ORD_002`
5. Both should track independently ✅

---

## Key Features

✅ **Duplicate Prevention**: Uses localStorage to prevent duplicate tracking  
✅ **Uses API Amount**: Uses `paymentData.amount` from API response  
✅ **Full Item Data**: Includes all order items with platform detection  
✅ **Email Hashing**: Automatically hashes email (SHA-256)  
✅ **Error Safe**: Won't break if tracking fails  
✅ **Type Safe**: Full TypeScript support  

---

## Differences from Initial Purchase Tracking

| Aspect | Initial Purchase (Phase 3) | Confirmed Purchase (This) |
|--------|---------------------------|---------------------------|
| **When** | When order is created | When payment is confirmed |
| **Trigger** | `useCoursePayment` hook | `usePolling` hook |
| **Amount Source** | `orderData.totalAmount` | `paymentData.amount` (API) |
| **Duplicate Check** | None (fires once per order creation) | localStorage check |
| **Reliability** | May fire before payment | Only fires after confirmed payment |

---

## Notes

- This is a **confirmed purchase** event, meaning payment is 100% verified
- The initial purchase event (from Phase 3) fires when order is created
- This event fires when payment is actually confirmed via API
- Both events may fire for the same order (this is intentional - different conversion points)
- GTM can be configured to use either or both events for conversion tracking

---

## Files Modified

1. `hooks/usePolling.ts` - Modified `onSuccess` callback signature
2. `app/order/[orderCode]/page.tsx` - Added confirmed purchase tracking

---

## Next Steps

1. Test the implementation
2. Verify events in GTM Preview
3. Configure GTM to use this event for conversion tracking
4. Update Phase 4 documentation if needed
