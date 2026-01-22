# Đổi tên miền – Cần sửa gì trên Google Tag Manager (GTM)

Khi đổi tên miền (vd: getcourses.net → tenmoi.com), trong **Google Tag Manager** cần rà và sửa những chỗ sau.

---

## 1. Cài đặt Container (Admin)

| Vị trí | Cần sửa? | Ghi chú |
|--------|----------|---------|
| **Admin** → **Container Settings** → **Container Name** | Tùy chọn | Chỉ để nhận diện (vd: `getcourses.net` → `tenmoi.com`). Không ảnh hưởng hoạt động. |
| **Container ID** (GTM-XXXXXXX) | ❌ Không | Giữ nguyên. Cùng container dùng cho miền mới. |

---

## 2. Triggers (Kích hoạt)

Chỉ sửa nếu trigger **giới hạn theo URL / hostname**.

| Trigger | Thường gặp | Hành động |
|---------|------------|-----------|
| **Page View - All Pages** | Fires on: **All Pages** | ❌ Không sửa |
| **Page View - History Change** | **All History Change** | ❌ Không sửa |
| **Event - view_content, form_submit, begin_checkout, purchase…** | **All Custom Events** | ❌ Không sửa |

**Cần sửa** nếu bạn đã thêm điều kiện kiểu:

- **Page Hostname** equals `getcourses.net`
- **Page URL** contains `getcourses.net`
- **Page Path** starts with `...` (chỉ sửa nếu path thay đổi theo miền)

**Cách làm:**

1. **Triggers** → mở từng trigger có bộ lọc.
2. Trong **This trigger fires on** → nếu có điều kiện **Page Hostname**, **Page URL**, **Page Domain**… đang dùng tên miền cũ → đổi thành miền mới (vd: `tenmoi.com`, `www.tenmoi.com`).
3. **Save**.

---

## 3. Variables (Biến)

| Loại | Cần sửa? | Ghi chú |
|------|----------|---------|
| **Built-in:** Page URL, Page Hostname, Page Path, Page Domain | ❌ Không | Tự lấy từ trang hiện tại. Sang miền mới sẽ trả giá trị mới. |
| **Data Layer Variables** (DLV - content_type, value, items…) | ❌ Không | Lấy từ `dataLayer`, không gắn tên miền. |
| **Constant** kiểu **"Site URL"**, **"Domain"**, **"Base URL"** | ✅ Có thể | Nếu có biến Constant chứa `https://getcourses.net` hoặc `getcourses.net` → đổi thành miền mới. |
| **Meta Pixel ID**, **GA4 ID** | ❌ Không | Không phụ thuộc miền. |

**Cách làm:**

1. **Variables** → **User-Defined Variables**.
2. Mở từng **Constant** (hoặc biến tương tự) có giá trị là URL/domain.
3. Đổi `https://getcourses.net` → `https://tenmoi.com` (và `www` nếu dùng).
4. **Save**.

---

## 4. Tags (Thẻ)

| Tag | Cần sửa? | Ghi chú |
|-----|----------|---------|
| **Google Tag (gtag) / GA4** | ❌ Thường không | Cấu hình stream/URL nằm ở **GA4**, không phải trong tag GTM. |
| **Meta Pixel - Base Code, ViewContent, Lead, InitiateCheckout, Purchase** | ❌ Thường không | Chỉ dùng Pixel ID và event. Không chứa tên miền. |
| **Custom HTML** tùy chỉnh | ✅ Cần kiểm tra | Nếu trong code có `getcourses.net`, `https://getcourses.net`, `api.getcourses.net`… → tìm và đổi sang miền mới. |

**Cách làm:**

1. **Tags** → mở từng tag, đặc biệt **Custom HTML**.
2. Tìm trong nội dung: `getcourses`, `khoahocgiare`, domain cũ.
3. Thay bằng domain mới nếu có.
4. **Save**.

---

## 5. Preview / Debug

| Việc | Ghi chú |
|------|---------|
| **Preview** (chế độ xem trước) | Khi bấm **Preview**, ô **Enter URL** → nhập **miền mới** (vd: `https://tenmoi.com`) để test. |
| **Tag Assistant / Debug** | Test trên trang miền mới. |

---

## 6. Publish

Sau khi sửa Triggers / Variables / Tags:

1. **Submit** (Publish) phiên bản mới.
2. Ghi chú version, vd: `Đổi domain getcourses.net → tenmoi.com`.

---

## 7. Ngoài GTM – Cũng cần đổi khi đổi miền

| Nền tảng | Chỗ cần sửa |
|----------|-------------|
| **GA4** | **Admin** → **Data Streams** → Web → **Website URL** (vd: `https://getcourses.net` → `https://tenmoi.com`). Có thể thêm stream mới cho domain mới tùy cách bạn dùng. |
| **Meta / Facebook** | Events Manager → Pixel → **Settings** (hoặc **Domain**) → **Website URL** nếu có. |
| **Google Ads** | Nếu dùng conversion/remarketing gắn domain cũ → cập nhật theo hướng dẫn của Google Ads. |
| **Ứng dụng (code, env)** | `NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`, v.v. trong `.env` / host. |

---

## 8. Checklist nhanh

- [ ] **GTM – Container:** Đổi tên (nếu muốn).
- [ ] **GTM – Triggers:** Rà điều kiện **Page Hostname / Page URL / Page Domain** → đổi miền cũ → miền mới.
- [ ] **GTM – Variables:** Rà Constant **Site URL / Domain / Base URL** → đổi miền.
- [ ] **GTM – Tags:** Rà **Custom HTML** (và tag khác) có hardcode domain → đổi.
- [ ] **GTM – Preview:** Test với URL miền mới.
- [ ] **GTM – Publish** phiên bản mới.
- [ ] **GA4:** Cập nhật **Website URL** trong Data Stream (hoặc thêm stream mới).
- [ ] **Meta:** Cập nhật **Website URL** của Pixel (nếu có).
- [ ] **Code / .env:** `NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`, `NEXTAUTH_URL`, v.v.

---

**Lưu ý:** GTM **không** khóa container theo domain. Cùng **Container ID** (GTM-XXXXXXX) vẫn chạy trên miền mới nếu bạn nhúng đúng snippet. Các mục trên chủ yếu để sửa **bộ lọc** và **biến/tag** có gắn tên miền cũ.
