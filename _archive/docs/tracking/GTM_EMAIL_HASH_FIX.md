# 🔧 Fix: Email Hash Không Hiển Thị Trong Facebook Pixel Helper

## ✅ Đã Xác Nhận

- ✅ Code app đã push `email_hash` vào dataLayer đúng cách
- ✅ `form_submit` event có `email_hash`: `b7e8e5db2210172119d1eb099b8efc577de82182e4c0b27d1e25f7e6f7bd0250`
- ✅ `begin_checkout` event có `email_hash`: `b7e8e5db2210172119d1eb099b8efc577de82182e4c0b27d1e25f7e6f7bd0250`
- ❌ Facebook Pixel Helper KHÔNG thấy `email_hash` trong InitiateCheckout event

## 🔴 Vấn Đề

**Facebook Pixel Helper không hiển thị email_hash trong "CUSTOM PARAMETERS SENT"**

→ **Nguyên nhân:** GTM Facebook Pixel Template tag chưa được cấu hình đúng để pass email_hash vào Facebook Pixel

---

## ✅ Giải Pháp: Cấu Hình GTM

### Bước 1: Kiểm Tra Variable `DLV - email_hash`

1. **Vào GTM → Variables**
2. **Tìm:** `DLV - email_hash`
3. **Kiểm tra cấu hình:**

   - **Variable Type:** `Data Layer Variable`
   - **Data Layer Variable Name:** `email_hash` (phải chính xác, không có space, không có dấu `{{}}`)
   - **Data Layer Version:** `Version 2`
   - **Variable Name:** `DLV - email_hash`

4. **Nếu chưa có → Tạo mới:**
   - Click "New"
   - Variable Type: `Data Layer Variable`
   - Data Layer Variable Name: `email_hash`
   - Data Layer Version: `Version 2`
   - Variable Name: `DLV - email_hash`
   - Save

---

### Bước 2: Kiểm Tra Facebook Pixel InitiateCheckout Tag

1. **Vào GTM → Tags → `Meta Pixel - InitiateCheckout`** (hoặc tên tag tương tự)
2. **Click vào tag để edit**
3. **Kiểm tra phần "Advanced Matching" hoặc "User Data" hoặc "Customer Information Data Parameters"**

   **PHẢI CÓ:**
   - Section: **Advanced Matching** hoặc **User Data** hoặc **Customer Information Data Parameters**
   - Field: **Email**
   - Value: `{{DLV - email_hash}}` (phải có dấu ngoặc nhọn `{{}}`)

4. **Nếu CHƯA CÓ hoặc SAI:**

   - Scroll xuống tìm section **Advanced Matching** hoặc **User Data**
   - Nếu không thấy → Click "Enable Advanced Matching" (checkbox)
   - Tìm field **Email**
   - Điền: `{{DLV - email_hash}}`
   - **Lưu ý quan trọng:**
     - ✅ Phải có dấu ngoặc nhọn: `{{DLV - email_hash}}`
     - ❌ KHÔNG được điền: `email_hash` (thiếu `{{DLV - }}`)
     - ❌ KHÔNG được điền: `DLV - email_hash` (thiếu dấu ngoặc nhọn)
     - ❌ KHÔNG được điền: `{{email_hash}}` (thiếu `DLV - `)

5. **Save tag**

---

### Bước 3: Kiểm Tra Facebook Pixel Lead Tag

1. **Vào GTM → Tags → `Meta Pixel - Lead`** (hoặc `Facebook Pixel - Lead`)
2. **Kiểm tra tương tự như Bước 2:**
   - Section: **Advanced Matching** hoặc **User Data**
   - Field: **Email** = `{{DLV - email_hash}}`
3. **Nếu sai → Sửa tương tự**
4. **Save tag**

---

### Bước 4: Kiểm Tra Facebook Pixel Purchase Tag

1. **Vào GTM → Tags → `Meta Pixel - Purchase`** (hoặc tên tag tương tự)
2. **Kiểm tra tương tự:**
   - Section: **Advanced Matching** hoặc **User Data**
   - Field: **Email** = `{{DLV - email_hash}}`
3. **Nếu sai → Sửa tương tự**
4. **Save tag**

---

## ✅ Test Trong GTM Preview Mode

1. **Mở GTM → Preview Mode**
2. **Điền URL:** `https://getcourses.net` (hoặc domain của bạn)
3. **Thực hiện action:**
   - Submit form → Lead event
   - Vào trang order → InitiateCheckout event

4. **Trong Preview Mode:**
   - Click vào event `begin_checkout`
   - Vào tab **Variables**
   - Tìm: `DLV - email_hash`
   - **Phải có giá trị:** `b7e8e5db2210172119d1eb099b8efc577de82182e4c0b27d1e25f7e6f7bd0250` (64 ký tự hex)

5. **Trong tab Tags:**
   - Xem Facebook Pixel InitiateCheckout tag có fire không
   - Click vào tag → Xem **Tag Details**
   - Tìm phần **User Data** hoặc **Parameters**
   - **Phải thấy:** `email` hoặc `email_hash` với giá trị hash

---

## ✅ Test Trong Facebook Pixel Helper

1. **Refresh page**
2. **Mở Facebook Pixel Helper extension**
3. **Thực hiện action:**
   - Submit form → Check Lead event
   - Vào trang order → Check InitiateCheckout event

4. **Kiểm tra InitiateCheckout event:**
   - Click vào event trong Pixel Helper
   - Xem phần **"CUSTOM PARAMETERS SENT"**
   - **Lưu ý:** `email_hash` KHÔNG hiển thị trong "CUSTOM PARAMETERS SENT" vì nó nằm trong **User Data**, không phải Custom Parameters

5. **Kiểm tra User Data:**
   - Scroll xuống tìm phần **"USER DATA"** hoặc **"ADVANCED MATCHING"**
   - **Phải thấy:**
     - ✅ `email` hoặc `email_hash` với giá trị hash
     - ✅ IP Address
     - ✅ User Agent

---

## 🔍 Tại Sao Email Hash Không Hiển Thị Trong "CUSTOM PARAMETERS SENT"?

**Lý do:**
- Facebook Pixel Helper hiển thị **Custom Parameters** và **User Data** ở 2 section khác nhau
- `email_hash` là **User Data** (Advanced Matching), KHÔNG phải Custom Parameter
- Vì vậy nó KHÔNG hiển thị trong "CUSTOM PARAMETERS SENT"
- Phải xem trong phần **"USER DATA"** hoặc **"ADVANCED MATCHING"**

---

## ✅ Checklist Final

- [ ] Variable `DLV - email_hash` đã tạo (Data Layer Variable: `email_hash`)
- [ ] Tag `Meta Pixel - Lead` có **Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - InitiateCheckout` có **Email** = `{{DLV - email_hash}}`
- [ ] Tag `Meta Pixel - Purchase` có **Email** = `{{DLV - email_hash}}`
- [ ] GTM Preview Mode → Variables → `DLV - email_hash` có giá trị (64 ký tự)
- [ ] GTM Preview Mode → Tags → Facebook Pixel tags → Tag Details có User Data với email
- [ ] Facebook Pixel Helper → Event → User Data có email hash

---

## 🐛 Nếu Vẫn Không Hoạt Động

### Issue 1: Variable `DLV - email_hash` = undefined trong Preview Mode

**Nguyên nhân:**
- Variable chưa được tạo
- Hoặc Data Layer Variable Name sai

**Fix:**
1. Kiểm tra lại Variable configuration
2. Đảm bảo Data Layer Variable Name = `email_hash` (chính xác)

---

### Issue 2: Variable có giá trị, nhưng Tag không nhận

**Nguyên nhân:**
- Facebook Pixel Template tag chưa điền `{{DLV - email_hash}}` vào field Email
- Hoặc điền sai variable name

**Fix:**
1. Vào từng Facebook Pixel tag
2. Kiểm tra field **Email** trong Advanced Matching
3. Điền: `{{DLV - email_hash}}` (chính xác, có dấu ngoặc nhọn)

---

### Issue 3: Tag fire nhưng Facebook không nhận email_hash

**Nguyên nhân:**
- Facebook Pixel Template version cũ
- Hoặc template không hỗ trợ Advanced Matching đúng cách

**Fix:**
1. Cập nhật Facebook Pixel Template tag lên version mới nhất
2. Hoặc recreate tag với template mới nhất

---

## 💡 Lưu Ý Quan Trọng

1. **Email hash KHÔNG hiển thị trong "CUSTOM PARAMETERS SENT"** - đây là bình thường
2. **Email hash nằm trong "USER DATA" hoặc "ADVANCED MATCHING"** - phải xem ở section này
3. **Facebook Pixel Helper có thể không hiển thị User Data rõ ràng** - cần test trong Facebook Events Manager
4. **Cách test tốt nhất:** Vào Facebook Events Manager → Test Events → Xem Advanced Matching

---

## 🔗 Next Steps

Sau khi cấu hình xong:
1. Submit & Publish GTM container
2. Test lại với Facebook Pixel Helper
3. Vào Facebook Events Manager → Test Events → Verify Advanced Matching có email hash
