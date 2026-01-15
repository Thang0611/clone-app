# 🎨 Frontend UX/UI Improvement Plan

**Ngày:** 12/01/2026  
**Mục tiêu:** Clean, Minimalist, Interactive, Type-safe

---

## 📊 Phân Tích Hiện Tại

### ✅ Đã có sẵn:
- ✅ Next.js 16.1.1 (App Router)
- ✅ React 19.2.3
- ✅ TypeScript 5
- ✅ Tailwind CSS v4
- ✅ Cấu trúc component cơ bản

### ❌ Còn thiếu:
- ❌ Toast notifications
- ❌ Real-time polling UI feedback
- ❌ Loading states đầy đủ
- ❌ Error boundaries
- ❌ Custom hooks để reuse logic
- ❌ Animations/Transitions mượt mà

---

## 🎯 Improvement Goals

### 1. **Visual Design (Clean & Minimalist)**
- ✨ Gradient buttons với hover effects
- ✨ Card shadows và borders tinh tế
- ✨ Color palette nhất quán
- ✨ Typography hierarchy rõ ràng
- ✨ Spacing system consistent

### 2. **UX & Interactive**
- 🔄 Real-time polling với progress indicator
- 🎉 Toast notifications (success/error/info)
- ⏳ Loading states cho mọi action
- 🎭 Smooth animations/transitions
- 🚫 Prevent double-click submissions
- 📱 Responsive design hoàn chỉnh

### 3. **Code Quality**
- 🏗️ Component architecture tốt hơn
- 🪝 Custom hooks cho logic reuse
- 🛡️ Error boundaries
- 📝 Type-safe với TypeScript
- 🧪 Easy to test
- 📦 Bundle size optimization

---

## 📦 Thư Viện Cần Cài

```bash
# Toast Notifications (Modern, lightweight)
npm install sonner

# Icons (Optional but recommended)
npm install lucide-react

# Animation library (Optional - cho advanced animations)
npm install framer-motion
```

### So sánh Toast libraries:

| Library | Size | API | Recommendation |
|---------|------|-----|----------------|
| `sonner` | ~3kb | Simple | ⭐⭐⭐⭐⭐ Best |
| `react-hot-toast` | ~4kb | Simple | ⭐⭐⭐⭐ Good |
| `react-toastify` | ~12kb | Complex | ⭐⭐⭐ OK |

**→ Chọn `sonner`** - Nhẹ nhất, API đơn giản, đẹp nhất

---

## 🏗️ Cấu Trúc Mới

```
/root/clone-app/
├── app/
│   ├── page.tsx                    # ← Refactor (Hero section)
│   └── order/
│       └── page.tsx                # ← Refactor (Polling UI)
├── components/
│   ├── ui/                         # ← NEW: Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Spinner.tsx
│   │   └── Badge.tsx
│   ├── CourseModal.tsx             # ← Refactor
│   ├── Hero.tsx                    # ← Refactor
│   ├── Navbar.tsx
│   └── ...
├── hooks/                          # ← NEW: Custom hooks
│   ├── usePolling.ts               # Polling logic
│   ├── useFormState.ts             # Form state management
│   └── useCourseAPI.ts             # API calls
├── lib/                            # ← NEW: Utils
│   ├── api.ts                      # API client
│   ├── constants.ts                # Constants
│   └── utils.ts                    # Helper functions
└── types/                          # ← NEW: TypeScript types
    └── index.ts                    # Shared types
```

---

## 🎨 Design System

### Color Palette (Tailwind)

```typescript
// Primary: Indigo/Blue gradient
primary: {
  50: '#eef2ff',
  100: '#e0e7ff',
  600: '#4f46e5',  // Main
  700: '#4338ca',
  800: '#3730a3',
}

// Success: Green
success: '#10b981'

// Error: Red
error: '#ef4444'

// Warning: Amber
warning: '#f59e0b'

// Neutral: Slate
neutral: slate
```

### Component Styles

```typescript
// Button variants
- Primary: Gradient indigo-600 → indigo-700
- Secondary: White with border
- Ghost: Transparent with hover
- Danger: Red

// Loading states
- Spinner: Rotating border animation
- Skeleton: Pulse animation
- Progress bar: Linear progress

// Toast positions
- Top-right (default)
- Top-center (for important messages)
```

---

## 🔧 Implementation Steps

### **PHASE 1: Setup & Foundation** ⏱️ 30 mins

1. ✅ Cài đặt dependencies
2. ✅ Tạo folder structure
3. ✅ Setup types & constants
4. ✅ Create UI components library
5. ✅ Create custom hooks

### **PHASE 2: Refactor Existing Components** ⏱️ 45 mins

6. ✅ Refactor `Hero.tsx`
   - Add loading states
   - Integrate toast notifications
   - Improve form validation
   - Better error handling

7. ✅ Refactor `CourseModal.tsx`
   - Loading spinner during API call
   - Disable buttons appropriately
   - Toast on success/error

8. ✅ Refactor `app/order/page.tsx`
   - Real-time polling UI
   - Progress indicator
   - Countdown timer
   - Better status display

### **PHASE 3: Polish & Optimize** ⏱️ 30 mins

9. ✅ Add error boundary
10. ✅ Add animations/transitions
11. ✅ Test responsive design
12. ✅ Optimize performance

---

## 📝 Code Examples

### Example 1: Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled,
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "rounded-xl font-semibold transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size]
      )}
      {...props}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
}
```

### Example 2: usePolling Hook

```typescript
// hooks/usePolling.ts
export function usePolling(
  orderCode: string,
  onSuccess: () => void,
  interval = 3000,
  timeout = 300000 // 5 minutes
) {
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderCode || status === 'paid') return;

    let intervalId: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/v1/payment/check-status/${orderCode}`);
        const data = await response.json();
        
        if (data.status === 'paid') {
          setStatus('paid');
          onSuccess();
          clearInterval(intervalId);
        }
      } catch (err) {
        setError('Failed to check status');
      }
    };

    setIsPolling(true);
    checkStatus(); // Check immediately
    intervalId = setInterval(checkStatus, interval);
    
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setIsPolling(false);
      setError('Timeout');
    }, timeout);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      setIsPolling(false);
    };
  }, [orderCode, status, interval, timeout, onSuccess]);

  return { status, isPolling, error };
}
```

### Example 3: Toast Integration

```typescript
// In any component
import { toast } from 'sonner';

// Success
toast.success('Khóa học đã được thêm!', {
  description: 'Bạn sẽ nhận email trong 15-30 phút',
  duration: 5000,
});

// Error
toast.error('Có lỗi xảy ra', {
  description: error.message,
  action: {
    label: 'Thử lại',
    onClick: () => handleRetry(),
  },
});

// Loading (promise-based)
toast.promise(
  fetchCourseInfo(urls),
  {
    loading: 'Đang lấy thông tin khóa học...',
    success: 'Lấy thông tin thành công!',
    error: 'Không thể lấy thông tin',
  }
);
```

---

## 🎯 Success Metrics

### Before vs After

| Metric | Before | After (Target) |
|--------|--------|----------------|
| Time to Interactive | ~2s | **~1s** |
| User Confusion | High | **Low** |
| Error Handling | Basic | **Graceful** |
| Loading Feedback | Partial | **Complete** |
| Mobile Experience | OK | **Great** |
| Code Maintainability | 6/10 | **9/10** |

---

## 🚀 Let's Start!

**Next Step:** Bắt đầu với PHASE 1 - Setup & Foundation

Bạn có muốn tôi bắt đầu ngay không? 🎉
