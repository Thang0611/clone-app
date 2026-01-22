# Kết quả kiểm tra DataLayer (Console)

## Kết quả mẫu của bạn

| Kiểm tra | Kết quả | Ghi chú |
|----------|---------|---------|
| DataLayer exists | ✅ true | |
| DataLayer length | 9 | |
| **page_view** | ✅ true | Khi load/chuyển trang |
| **set_user_properties** | ✅ true | Khi load (device, source, v.v.) |
| **view_content** | ✅ true | Hero form trong viewport ≥3s |
| form_start | ❌ false | Chỉ khi **focus** ô email |
| form_submit | ❌ false | Chỉ khi **submit** form Hero |
| begin_checkout | ❌ false | Chỉ khi **mở CourseModal** có khóa học |
| purchase | ❌ false | Chỉ khi **thanh toán xong** hoặc API trả paid |

**Latest event:** `view_content` với `content_type: course_form`, `content_name: main_hero_form`, `content_category: education` → đúng spec.

---

## Cách test từng event còn thiếu

### 1. `form_start`
- **Cần làm:** Click/focus vào ô **Gmail** trong form Hero.
- **Chạy lại trong Console:**
  `window.dataLayer?.map(e => e.event).filter(Boolean).includes('form_start')`
- **Lưu ý:** Có thể throttle 1 lần/session.

### 2. `form_submit`
- **Cần làm:** Điền email + ít nhất 1 link Udemy/Coursera/LinkedIn → bấm **Gửi**.
- **Chạy lại:** `...includes('form_submit')` và `...includes('form_submit_success')` hoặc `form_submit_error` tùy API.

### 3. `begin_checkout`
- **Cần làm:** Submit form Hero thành công → **CourseModal mở** với danh sách khóa học.
- **Chạy lại:** `...includes('begin_checkout')`

### 4. `purchase`
- **Cần làm:** Chọn gói, bấm thanh toán → tạo đơn → (hoặc mô phỏng API `check-status` trả `paid`).
- **Chạy lại:** `...includes('purchase')`

---

## Kết luận

- **page_view, set_user_properties, view_content** → Đã fire đúng khi load/scroll.
- **form_start, form_submit, begin_checkout, purchase** → Chỉ fire khi user thực hiện từng bước; `false` trong lần test đầu là bình thường.

Muốn thấy đủ 7 event: làm lần lượt **focus email → submit form → mở modal checkout → thanh toán (hoặc mô phỏng paid)** rồi chạy lại script kiểm tra.
