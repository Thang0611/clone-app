# 🔧 Fix: Extension Content Script Error

## ❌ Lỗi

```
content_script.js:4669 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'postMessage')
    at o (content_script.js:4669:14022)
```

## 🔍 Nguyên nhân

**Đây KHÔNG phải lỗi từ code của project**, mà là lỗi từ **browser extension** (content script).

**Nguyên nhân:**
- Extension đang cố gắng gọi `postMessage` trên một object đã bị null/unmounted
- Thường xảy ra khi:
  - Extension inject script vào page
  - Page navigation hoặc component unmount
  - Extension cố gắng giao tiếp với iframe/window đã bị remove

## ✅ Giải pháp

### Option 1: Bỏ qua lỗi (Khuyến nghị)

**Lỗi này không ảnh hưởng đến website của bạn.** Đây là bug của extension, không phải code của bạn.

**Cách xử lý:**
- Bỏ qua lỗi này trong console
- Nếu cần test clean, tắt extension tạm thời

---

### Option 2: Tắt Extension gây lỗi

1. **Xác định extension gây lỗi:**
   - Mở Developer Tools → Console
   - Click vào lỗi → Xem stack trace
   - Tìm extension name trong stack trace

2. **Tắt extension tạm thời:**
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
   - Tắt extension một cách để test

3. **Test lại:**
   - Refresh page
   - Kiểm tra lỗi có còn không

---

### Option 3: Suppress Error trong Console (Chỉ dành cho development)

Nếu lỗi làm phiền quá nhiều khi develop, có thể suppress bằng cách wrap error handler:

**File:** `app/layout.tsx` hoặc `app/providers.tsx`

```typescript
useEffect(() => {
  // Suppress extension errors in development
  if (process.env.NODE_ENV === 'development') {
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      // Suppress extension content script errors
      if (typeof source === 'string' && source.includes('content_script.js')) {
        console.warn('[Suppressed] Extension error:', message);
        return true; // Suppress error
      }
      // Call original error handler for other errors
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };

    return () => {
      window.onerror = originalError;
    };
  }
}, []);
```

**⚠️ Lưu ý:** Chỉ dùng cho development, không dùng trong production.

---

### Option 4: Thêm CSP Headers (Nếu cần)

Nếu muốn block extension inject scripts (không khuyến nghị vì có thể block legit extensions):

**File:** `next.config.ts`

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;"
        },
      ],
    },
  ];
}
```

**⚠️ Lưu ý:** CSP có thể block một số legit functionality, chỉ dùng nếu thực sự cần.

---

## 📋 Checklist

- [ ] Xác nhận lỗi đến từ extension (không phải code project)
- [ ] Test với extension tắt → Lỗi biến mất
- [ ] Bỏ qua lỗi nếu không ảnh hưởng đến functionality
- [ ] Nếu cần, suppress error trong development mode

---

## 💡 Best Practice

1. **Bỏ qua extension errors** - Không ảnh hưởng đến website
2. **Test với extension tắt** khi cần test clean
3. **Không suppress errors** trong production code
4. **Report extension bugs** cho extension developers nếu lỗi quá nghiêm trọng

---

## 🔗 References

- [MDN: window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Chrome Extension Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Next.js Error Handling](https://nextjs.org/docs/advanced-features/error-handling)
