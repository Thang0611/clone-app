# 🔍 Frontend Verification Report

**Ngày:** 12/01/2026  
**Mục đích:** Verify frontend implementation với API Documentation

---

## ✅ NHỮNG ĐIỂM ĐÚNG

### 1️⃣ API Get Course Info - `Hero.tsx`
- ✅ **Endpoint:** `/api/v1/get-course-info` - ĐÚNG
- ✅ **Method:** POST - ĐÚNG
- ✅ **Request Body:** `{ urls: [...] }` - ĐÚNG
- ✅ **Response Handling:** Xử lý `data.results` array - ĐÚNG
- ✅ **Error Handling:** Có timeout 30s và error handling - TỐT
- ✅ **Loading State:** Có loading indicator - TỐT

### 2️⃣ Polling Logic - `app/order/page.tsx`
- ✅ **Polling Interval:** 3 giây - ĐÚNG (theo docs)
- ✅ **Status Check:** Kiểm tra `status === 'paid'` - ĐÚNG
- ✅ **Cleanup:** Có cleanup khi unmount - TỐT
- ✅ **Conditional Polling:** Chỉ poll khi `isPaid === false` - TỐT
- ✅ **Timeout Handling:** Có AbortController 10s - TỐT

### 3️⃣ UI/UX
- ✅ **QR Code Display:** Hiển thị QR từ API response
- ✅ **Order Code Display:** Hiển thị orderCode từ API
- ✅ **Bank Info:** Parse bank info từ QR URL
- ✅ **Success State:** Hiển thị success khi paid

---

## ❌ NHỮNG VẤN ĐỀ CẦN SỬA

### 🚨 CRITICAL - Sai API Endpoint

#### **Vấn đề 1: Create Order API thiếu `/v1`**

**File:** `components/CourseModal.tsx` (Line 58)

**Hiện tại:**
```typescript
const response = await fetch("https://api.khoahocgiare.info/api/payment/create-order", {
```

**Theo docs (API_DOCS_VI.md Line 131):**
```
POST /api/v1/payment/create-order
```

**✏️ FIX:** Thêm `/v1` vào URL
```typescript
const response = await fetch("https://api.khoahocgiare.info/api/v1/payment/create-order", {
```

---

#### **Vấn đề 2: Check Status API thiếu `/v1`**

**File:** `app/order/page.tsx` (Line 364)

**Hiện tại:**
```typescript
const response = await fetch(
  `${API_URL}/api/payment/check-status/${orderData.orderCode}`,
```

**Theo docs (API_DOCS_VI.md Line 209):**
```
GET /api/v1/payment/check-status/{orderCode}
```

**✏️ FIX:** Thêm `/v1` vào URL
```typescript
const response = await fetch(
  `${API_URL}/api/v1/payment/check-status/${orderData.orderCode}`,
```

---

### ⚠️ MEDIUM - Request Body không đầy đủ

#### **Vấn đề 3: Thiếu `courseId` khi create order**

**File:** `components/CourseModal.tsx` (Line 48-55)

**Hiện tại:**
```typescript
const requestBody = {
  email: email.trim(),
  courses: successfulCourses.map(course => ({
    url: course.url || "",
    price: course.price || 50000,
    title: course.title || "Khóa học",
  })),
};
```

**Theo docs (API_DOCS_VI.md Line 138-145):**
```json
{
  "email": "customer@example.com",
  "courses": [
    {
      "url": "...",
      "title": "...",
      "courseId": "1234567",  // ← THIẾU FIELD NÀY
      "price": 2000
    }
  ]
}
```

**✏️ FIX:** Thêm `courseId` vào request
```typescript
const requestBody = {
  email: email.trim(),
  courses: successfulCourses.map(course => ({
    url: course.url || "",
    title: course.title || "Khóa học",
    courseId: course.courseId,  // ← THÊM FIELD NÀY
    price: course.price || 50000,
  })),
};
```

---

### ⚠️ MEDIUM - Giá mặc định không khớp

#### **Vấn đề 4: Giá default là 50000 thay vì 2000**

**File:** `components/CourseModal.tsx` (Line 52, 226)

**Hiện tại:**
```typescript
price: course.price || 50000,  // Default 50k
```

**Theo docs (API_DOCS_VI.md Line 5):**
```
Giá mỗi khóa học: 2,000 VND
```

**✏️ FIX:** Đổi default price thành 2000
```typescript
price: course.price || 2000,  // Default 2k theo docs
```

**Lưu ý:** Có thể giá 50k là giá thực tế của hệ thống, nhưng cần confirm với backend.

---

### 💡 SUGGESTIONS - Cải thiện

#### **Suggestion 1: Thêm validation orderCode format**

**File:** `app/order/page.tsx`

**Theo docs (API_DOCS_VI.md Line 582):**
- Order code phải có format: `DH + 6 số` (VD: DH000123)

**Đề xuất:** Thêm validation
```typescript
useEffect(() => {
  if (orderData?.orderCode) {
    const orderCodePattern = /^DH\d{6}$/;
    if (!orderCodePattern.test(orderData.orderCode)) {
      console.warn("Invalid orderCode format:", orderData.orderCode);
    }
  }
}, [orderData]);
```

---

#### **Suggestion 2: Thêm timeout cho polling (5 phút)**

**File:** `app/order/page.tsx`

**Theo docs (API_DOCS_VI.md Line 258-262):**
```javascript
// Dừng sau 5 phút (nếu user không thanh toán)
setTimeout(() => {
  clearInterval(interval);
  alert('⏱️ Hết thời gian chờ.');
}, 300000); // 5 minutes
```

**Hiện tại:** Frontend không có timeout, poll vô hạn

**✏️ FIX:** Thêm timeout 5 phút
```typescript
useEffect(() => {
  if (!orderData || !orderData.orderCode || isPaid) {
    return;
  }

  let intervalId: NodeJS.Timeout | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  let isMounted = true;

  // ... existing code ...

  // Thêm timeout 5 phút
  timeoutId = setTimeout(() => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (isMounted) {
      alert('⏱️ Hết thời gian chờ thanh toán.\n\nNếu bạn đã thanh toán, vui lòng kiểm tra email hoặc liên hệ support.');
    }
  }, 300000); // 5 minutes

  // Cleanup
  return () => {
    isMounted = false;
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);  // ← CLEANUP TIMEOUT
    setIsChecking(false);
  };
}, [orderData, isPaid]);
```

---

#### **Suggestion 3: Hiển thị thời gian còn lại**

**Đề xuất:** Thêm countdown timer để user biết còn bao lâu
```typescript
const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds

useEffect(() => {
  if (isPaid || !orderData) return;
  
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 0) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(timer);
}, [isPaid, orderData]);

// Display in UI
<p className="text-sm text-slate-500">
  Thời gian còn lại: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
</p>
```

---

## 📊 SUMMARY

| Category | Status | Count |
|----------|--------|-------|
| ✅ Correct | PASS | 11 |
| ❌ Critical Issues | **MUST FIX** | **2** |
| ⚠️ Medium Issues | Should Fix | 2 |
| 💡 Suggestions | Nice to Have | 3 |

---

## 🔧 ACTION ITEMS (Priority Order)

### 🚨 **HIGH PRIORITY - MUST FIX IMMEDIATELY**

1. **Fix Create Order API URL** (CourseModal.tsx:58)
   - Thêm `/v1` vào endpoint
   - Impact: API call sẽ fail 404

2. **Fix Check Status API URL** (order/page.tsx:364)
   - Thêm `/v1` vào endpoint
   - Impact: Polling không hoạt động, user không thấy paid status

### ⚠️ **MEDIUM PRIORITY - FIX SOON**

3. **Thêm courseId vào request body** (CourseModal.tsx:50-55)
   - Impact: Backend có thể cần courseId để xử lý

4. **Kiểm tra lại giá default** (CourseModal.tsx:52)
   - Confirm với backend: 2000 hay 50000?
   - Impact: Hiển thị giá sai cho user

### 💡 **LOW PRIORITY - IMPROVEMENTS**

5. **Thêm timeout 5 phút cho polling**
6. **Thêm validation orderCode format**
7. **Thêm countdown timer UI**

---

## 📝 CODE CHANGES NEEDED

### File 1: `components/CourseModal.tsx`

**Line 58:** Sửa API URL
```diff
- const response = await fetch("https://api.khoahocgiare.info/api/payment/create-order", {
+ const response = await fetch("https://api.khoahocgiare.info/api/v1/payment/create-order", {
```

**Line 50-55:** Thêm courseId
```diff
  courses: successfulCourses.map(course => ({
    url: course.url || "",
    title: course.title || "Khóa học",
+   courseId: course.courseId,
    price: course.price || 50000,
  })),
```

**Line 52:** Sửa giá default (nếu cần)
```diff
- price: course.price || 50000,
+ price: course.price || 2000,  // Theo docs
```

---

### File 2: `app/order/page.tsx`

**Line 364:** Sửa API URL
```diff
  const response = await fetch(
-   `${API_URL}/api/payment/check-status/${orderData.orderCode}`,
+   `${API_URL}/api/v1/payment/check-status/${orderData.orderCode}`,
```

**Line 339-479:** Thêm timeout 5 phút
```diff
  useEffect(() => {
    if (!orderData || !orderData.orderCode || isPaid) {
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;
+   let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    // ... existing polling code ...

+   // Timeout after 5 minutes
+   timeoutId = setTimeout(() => {
+     if (intervalId) {
+       clearInterval(intervalId);
+       intervalId = null;
+     }
+     if (isMounted) {
+       alert('⏱️ Hết thời gian chờ thanh toán.\n\nNếu bạn đã thanh toán, vui lòng kiểm tra email hoặc liên hệ support.');
+     }
+   }, 300000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
+     if (timeoutId) clearTimeout(timeoutId);
      setIsChecking(false);
    };
  }, [orderData, isPaid]);
```

---

## ✅ VERIFICATION CHECKLIST

Sau khi fix, verify lại:

- [ ] Test API Get Course Info với URL thật
- [ ] Test API Create Order với URL có `/v1`
- [ ] Test API Check Status với URL có `/v1`
- [ ] Verify request body có đầy đủ fields (url, title, courseId, price)
- [ ] Test polling logic: status pending → paid
- [ ] Test timeout 5 phút
- [ ] Check console không có error
- [ ] Test với nhiều khóa học (1, 2, 5, 10)
- [ ] Test với URL sai
- [ ] Test với email sai format

---

## 🎯 CONCLUSION

**Tổng quan:** Frontend implementation **CƠ BẢN ĐÚNG** nhưng có **2 lỗi CRITICAL** về API endpoints thiếu `/v1`.

**Risk Level:** 🔴 **HIGH** - App sẽ không hoạt động nếu không fix 2 issues này.

**Estimated Fix Time:** 15-30 phút

**Next Steps:**
1. Fix 2 critical issues ngay
2. Test lại toàn bộ flow
3. Deploy và monitor

---

**Người verify:** AI Assistant  
**Ngày hoàn thành:** 12/01/2026
