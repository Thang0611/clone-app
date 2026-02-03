# KẾ HOẠCH REFACTORING DỰ ÁN

## 📋 TỔNG QUAN
Dự án Next.js cần được tổ chức lại để chuyên nghiệp, gọn gàng và dễ bảo trì hơn.

---

## 🗂️ PHẦN 1: TỔ CHỨC LẠI THƯ MỤC (RESTRUCTURE FOLDERS)

### 1.1. Di chuyển tất cả file .md vào thư mục `docs/`
**Mục tiêu:** Gom tất cả tài liệu vào một nơi duy nhất

**Files cần di chuyển (29 files):**
- ACCORDION_UI_REFACTOR.md
- ADMIN_DASHBOARD_COMPLETE.md
- ADMIN_DASHBOARD_README.md
- ADMIN.md
- API_DOCS_VI.md
- API_QUICK_REFERENCE.md
- BUILD_SUCCESS.md
- COURSE_MODAL_REFACTOR.md
- COURSES_PAGE_SUMMARY.md
- DATE_PARSING_FIX.md
- DEPLOYMENT_GUIDE.md
- DYNAMIC_ROUTING_REFACTOR.md
- FIXES_SUMMARY.md
- FRONTEND_VERIFICATION_REPORT.md
- IMPROVEMENT_COMPLETE.md
- IMPROVEMENT_PLAN.md
- MISSING_PAYMENT_INFO_FIX.md
- MOBILE_LAYOUT_FIX.md
- NAVBAR_FOOTER_FIX.md
- PRODUCTION_CONFIG.md
- PROJECT_COMPLETE.md
- QUICK_START.md
- README.md (giữ lại ở root, nhưng có thể tạo README.md mới trong docs/)
- REFACTOR_SUMMARY.md
- TESTING_CHECKLIST.md
- TRACK_ORDER_EMAIL_ONLY.md
- TRACK_ORDER_ERROR_FIX.md
- TRACK_ORDER_PAGE_SUMMARY.md
- UI_REFACTOR_SUMMARY.md

**Lưu ý:** README.md sẽ được giữ lại ở root (theo chuẩn GitHub), nhưng các file khác sẽ di chuyển vào `docs/`

### 1.2. Tổ chức lại cấu trúc thư mục
**Cấu trúc mới đề xuất:**
```
/root/project/clone-app/
├── docs/                    # Tất cả tài liệu .md (trừ README.md)
├── config/                  # Các file cấu hình
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   ├── tsconfig.json
│   └── ecosystem.config.js
├── scripts/                 # Các script tự động
│   └── TEST_DEPLOYMENT.sh
├── app/                     # Next.js app directory (giữ nguyên)
├── components/              # React components (giữ nguyên)
├── hooks/                   # Custom hooks (giữ nguyên)
├── lib/                     # Utilities và API client (giữ nguyên)
├── types/                   # TypeScript types (giữ nguyên)
├── public/                  # Static assets (giữ nguyên)
├── logs/                    # Log files (có thể xóa hoặc di chuyển)
├── package.json
├── package-lock.json
└── README.md                # Giữ lại ở root
```

---

## 🔧 PHẦN 2: REFACTOR SOURCE CODE

### 2.1. Files cần refactor (>200 dòng)

#### 2.1.1. `app/order/[orderCode]/page.tsx` (603 dòng)
**Vấn đề:** File quá dài, xử lý nhiều logic hỗn tạp
**Giải pháp:**
- Tách logic countdown timer → `hooks/useCheckoutTimer.ts`
- Tách logic polling payment status → đã có `usePolling`, nhưng có thể cải thiện
- Tách UI components:
  - `components/order/OrderHeader.tsx`
  - `components/order/PaymentSection.tsx`
  - `components/order/OrderItemsList.tsx`
  - `components/order/CheckoutTimer.tsx`

#### 2.1.2. `app/track-order/page.tsx` (573 dòng)
**Vấn đề:** File quá dài, logic tìm kiếm và hiển thị đơn hàng lẫn lộn
**Giải pháp:**
- Tách logic API call → `hooks/useOrderLookup.ts`
- Tách UI components:
  - `components/track-order/SearchForm.tsx`
  - `components/track-order/OrderList.tsx`
  - `components/track-order/OrderCard.tsx`

#### 2.1.3. `app/courses/page.tsx` (461 dòng)
**Vấn đề:** Mock data và logic filter lẫn lộn
**Giải pháp:**
- Di chuyển mock data → `lib/data/mockCourses.ts`
- Tách logic filter → `hooks/useCourseFilter.ts`
- Tách UI components:
  - `components/courses/CourseFilters.tsx`
  - `components/courses/CourseGrid.tsx`

#### 2.1.4. `components/CourseModal.tsx` (435 dòng)
**Vấn đề:** Logic payment và UI lẫn lộn
**Giải pháp:**
- Tách logic payment → `hooks/useCoursePayment.ts`
- Tách UI components:
  - `components/course-modal/CourseModalHeader.tsx`
  - `components/course-modal/CourseScrollList.tsx`
  - `components/course-modal/CourseCard.tsx` (trong modal)
  - `components/course-modal/PaymentFooter.tsx`

#### 2.1.5. `components/admin/LogViewer.tsx` (386 dòng)
**Vấn đề:** Logic parsing log và UI lẫn lộn
**Giải pháp:**
- Tách logic parsing → `lib/utils/logParser.ts`
- Tách UI components:
  - `components/admin/log-viewer/LogViewerHeader.tsx`
  - `components/admin/log-viewer/LogContent.tsx`
  - `components/admin/log-viewer/LogFilters.tsx`

#### 2.1.6. `app/contact/page.tsx` (367 dòng)
**Vấn đề:** Form logic và validation lẫn lộn
**Giải pháp:**
- Tách form logic → `hooks/useContactForm.ts`
- Tách UI components:
  - `components/contact/ContactForm.tsx`
  - `components/contact/ContactInfo.tsx`

#### 2.1.7. `app/courses/[id]/page.tsx` (349 dòng)
**Vấn đề:** Logic fetch course và UI lẫn lộn
**Giải pháp:**
- Tách logic → `hooks/useCourseDetail.ts`
- Tách UI components:
  - `components/course-detail/CourseHero.tsx`
  - `components/course-detail/CourseContent.tsx`
  - `components/course-detail/CourseSidebar.tsx`

#### 2.1.8. `components/Hero.tsx` (298 dòng)
**Vấn đề:** Component quá dài với nhiều section
**Giải pháp:**
- Tách thành các sub-components:
  - `components/hero/HeroSection.tsx`
  - `components/hero/HeroFeatures.tsx`
  - `components/hero/HeroCTA.tsx`

### 2.2. Cải thiện Naming Convention

#### 2.2.1. Variables
- Đảm bảo tất cả biến có tên rõ ràng, mô tả đúng mục đích
- Sử dụng camelCase cho variables và functions
- Sử dụng PascalCase cho components và types

#### 2.2.2. Functions
- Đảm bảo tên function mô tả rõ ràng chức năng
- Tránh tên generic như `handleClick`, `handleSubmit` → đổi thành `handlePaymentClick`, `handleOrderSubmit`

### 2.3. Áp dụng DRY (Don't Repeat Yourself)

#### 2.3.1. Tạo shared utilities
- `lib/utils/validation.ts` - Tập trung validation logic
- `lib/utils/formatting.ts` - Tập trung formatting functions (đã có một phần trong utils.ts)
- `lib/utils/date.ts` - Date utilities

#### 2.3.2. Tạo shared hooks
- `hooks/useDebounce.ts` - Nếu chưa có
- `hooks/useLocalStorage.ts` - Quản lý localStorage
- `hooks/useToast.ts` - Wrapper cho toast notifications

#### 2.3.3. Tạo shared components
- `components/shared/EmptyState.tsx` - Component hiển thị khi không có data
- `components/shared/LoadingState.tsx` - Component loading state
- `components/shared/ErrorState.tsx` - Component error state

---

## 🧹 PHẦN 3: DỌN DẸP (CLEANUP)

### 3.1. Xóa file rác
- `logs/client-dev.log` - Log file không cần thiết trong repo
- `public/test-api.html` - File test có thể xóa hoặc di chuyển vào docs

### 3.2. Xóa code comment không còn dùng
- Rà soát và xóa các comment cũ, không còn liên quan
- Giữ lại các comment JSDoc quan trọng

### 3.3. Xóa unused imports
- Sử dụng ESLint để phát hiện và xóa unused imports

---

## 🔒 PHẦN 4: AN TOÀN (SAFETY CHECK)

### 4.1. Cập nhật import paths
Sau khi di chuyển file, cần cập nhật:
- Tất cả `import` statements
- Tất cả `require` statements
- Tất cả `@/` path aliases (nếu có thay đổi)

### 4.2. Kiểm tra build
- Chạy `npm run build` để đảm bảo không có lỗi
- Chạy `npm run lint` để kiểm tra code quality

### 4.3. Cập nhật tsconfig.json
- Đảm bảo path aliases vẫn hoạt động đúng
- Kiểm tra `include` và `exclude` paths

---

## 📝 PHẦN 5: THỨ TỰ THỰC HIỆN

### Bước 1: Di chuyển file .md vào docs/
- Tạo thư mục `docs/`
- Di chuyển tất cả file .md (trừ README.md)
- Không cần cập nhật import (vì .md không được import)

### Bước 2: Tổ chức lại config files
- Tạo thư mục `config/`
- Di chuyển các file config
- Cập nhật paths trong package.json scripts nếu cần

### Bước 3: Di chuyển scripts
- Tạo thư mục `scripts/`
- Di chuyển TEST_DEPLOYMENT.sh
- Cập nhật paths nếu có reference

### Bước 4: Refactor các file lớn
- Bắt đầu với file lớn nhất
- Tách logic và UI components
- Test sau mỗi refactor

### Bước 5: Cải thiện naming và DRY
- Rà soát và đổi tên biến/hàm
- Tạo shared utilities và hooks
- Tạo shared components

### Bước 6: Dọn dẹp
- Xóa file rác
- Xóa unused code
- Xóa unused imports

### Bước 7: Kiểm tra và test
- Chạy build
- Chạy lint
- Test các chức năng chính

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Backup:** Đảm bảo có backup hoặc commit trước khi bắt đầu
2. **Incremental:** Refactor từng phần, test sau mỗi bước
3. **Git:** Commit thường xuyên với message rõ ràng
4. **Testing:** Test kỹ các chức năng sau mỗi thay đổi lớn
5. **Documentation:** Cập nhật README.md nếu cần

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Di chuyển tất cả .md files vào docs/
- [ ] Tạo và di chuyển config files vào config/
- [ ] Tạo và di chuyển scripts vào scripts/
- [ ] Refactor app/order/[orderCode]/page.tsx
- [ ] Refactor app/track-order/page.tsx
- [ ] Refactor app/courses/page.tsx
- [ ] Refactor components/CourseModal.tsx
- [ ] Refactor components/admin/LogViewer.tsx
- [ ] Refactor app/contact/page.tsx
- [ ] Refactor app/courses/[id]/page.tsx
- [ ] Refactor components/Hero.tsx
- [ ] Cải thiện naming convention
- [ ] Tạo shared utilities
- [ ] Tạo shared hooks
- [ ] Tạo shared components
- [ ] Xóa file rác
- [ ] Xóa unused code
- [ ] Cập nhật tất cả import paths
- [ ] Chạy build thành công
- [ ] Chạy lint không có lỗi
- [ ] Test các chức năng chính
