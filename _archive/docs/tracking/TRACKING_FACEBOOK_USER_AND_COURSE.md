# Facebook Test Events: User (Advanced Matching) và Khóa học

## 1. Đã ổn chưa?

**Có.** Các event (View Content, PageView, Purchase, Initiate Checkout, Lead) đã nhận và **Đã xử lý**.  
View Content có `content_type`, `content_name`, `content_category`.  
Purchase/Initiate Checkout có `value`, `currency`; thông tin **khóa học** (contents, content_ids) phụ thuộc GTM.

---

## 2. Vì sao không thấy User, Khóa học trong Test Events?

### User (Advanced Matching)

- Meta **không** dùng email/phone dạng text trong event; dùng **Advanced Matching** với dữ liệu đã **hash** (SHA-256).
- Cách gửi: `fbq('init', pixelId, { em: hashedEmail })`. Khi có `em`, Meta dùng để match user (trong Test Events có thể chỉ hiện “IP, User Agent” nếu chưa gửi `em`).

**Đã làm trong app:**

- **Trang Order** (`/order/[orderCode]`): khi có `orderData.email`, hash email và gọi `fbq('init', pixelId, { em: hashed })` để bật Advanced Matching cho user đó.  
- Các event **sau** (Purchase, v.v.) trên trang order sẽ gắn với user tốt hơn.

### Khóa học (content_ids, contents)

| Event | dataLayer | GTM → Meta | Ghi chú |
|-------|-----------|------------|---------|
| **View Content** | `content_type`, `content_name`, `content_category` | Đã gửi. Có thể thêm `content_ids` nếu app push. | `trackViewContent(..., contentIds?)` đã hỗ trợ `content_ids`. Hero thường chưa có danh sách khóa lúc view → không bắt buộc. |
| **Initiate Checkout** | `items` (item_id, item_name, price, quantity, …) | **Đã cập nhật:** tag GTM gửi `contents`, `content_ids`, `content_type`, `num_items`. | Cần tag **Initiate Checkout** trong GTM dùng đúng mẫu trong `TRACKING_GTM_TAGS_REFERENCE.md`. |
| **Purchase** | `items`, `transaction_id`, `value`, `currency`, `email_hash` | Tag GTM gửi `contents`, `content_ids`, `value`, `currency`. | Đảm bảo **DLV - items** đúng và tag Purchase dùng `items` map sang `contents`/`content_ids`. |

- **contents**: `[{ id, quantity, item_price }]` (Meta format).
- **content_ids**: `[item_id, ...]`.

Nếu GTM chưa gửi `contents`/`content_ids` cho Initiate Checkout hoặc Purchase, Test Events sẽ không hiện chi tiết khóa học.

---

## 3. Đã thay đổi trong code / GTM

### App

- **Order page:** khi có `orderData.email` → `hashEmail` → `fbq('init', pixelId, { em: hashed })`.
- **trackViewContent:** thêm tham số tùy chọn `contentIds?: string[]`; khi có thì push `content_ids` lên dataLayer.

### GTM (chỉ trong tài liệu, bạn cần sửa trong GTM)

- **Meta Pixel - Initiate Checkout:** gửi thêm `contents`, `content_ids`, `content_type`, `num_items` (xem `docs/TRACKING_GTM_TAGS_REFERENCE.md`).
- **Meta Pixel - View Content:** có thể thêm `content_ids: {{DLV - content_ids}}` nếu tạo DLV `content_ids` và app push `content_ids`.

### Purchase

- Tag **Meta Pixel - Purchase** trong `TRACKING_GTM_TAGS_REFERENCE.md` đã có `contents`, `content_ids` từ `items`.  
- Kiểm tra **DLV - items** có lấy đúng từ event `purchase` và cấu trúc `item_id`, `price`, `quantity`.

---

## 4. Cách kiểm tra

### User (Advanced Matching)

1. Vào trang **Order** (có `orderData.email`).
2. Console: `(window as any).fbq` có tồn tại; không cần gọi thêm.
3. Trong Test Events, event từ trang Order (vd. Purchase) sau khi thanh toán có thể hiện thêm thông tin match (tùy Meta).

### Khóa học (Initiate Checkout / Purchase)

1. Trong GTM Preview, fire **begin_checkout** và **purchase**.
2. Kiểm tra tag **Initiate Checkout** và **Purchase**: request sang `facebook.com/tr` (tab Network) phải có `content_ids`, `contents` (hoặc tương đương).
3. Trong Test Events, mở chi tiết **Initiate Checkout** / **Purchase** → phần **Thông số** (Parameters) nên có `content_ids`, `contents` (hoặc các field Meta map từ đó).

---

## 5. Tóm tắt

- **Trạng thái:** Tracking cơ bản ổn; User (Advanced Matching) và Khóa học đã được bổ sung trong app và hướng dẫn GTM.
- **User:** `fbq('init', pixelId, { em: hashedEmail })` trên **trang Order** khi có email.
- **Khóa học:**  
  - **View Content:** `trackViewContent(..., contentIds?)`; GTM View Content có thể thêm `content_ids` nếu dùng DLV.  
  - **Initiate Checkout / Purchase:** GTM tag gửi `contents`, `content_ids` từ `items`; cần cập nhật đúng theo `TRACKING_GTM_TAGS_REFERENCE.md` và DLV `items`.
