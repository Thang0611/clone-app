# Advanced Matching Email - Quick Check

## ⚡ Checklist nhanh (5 phút)

### 1. GTM Variable (30 giây)
- [ ] Vào **GTM → Variables**
- [ ] Tìm: `DLV - email_hash`
- [ ] **Nếu chưa có → Tạo:**
  - Type: `Data Layer Variable`
  - Name: `email_hash`
  - Variable Name: `DLV - email_hash`

### 2. Facebook Pixel Template Tags (2 phút)
- [ ] Vào **GTM → Tags**
- [ ] **Tag: Meta Pixel - Lead**
  - [ ] Click edit
  - [ ] Scroll xuống **Advanced Matching** hoặc **User Data**
  - [ ] Field **Email** = `{{DLV - email_hash}}`
  - [ ] Save
- [ ] **Tag: Meta Pixel - InitiateCheckout**
  - [ ] **User Data → Email** = `{{DLV - email_hash}}`
  - [ ] Save
- [ ] **Tag: Meta Pixel - Purchase**
  - [ ] **User Data → Email** = `{{DLV - email_hash}}`
  - [ ] Save

### 3. Test trong GTM Preview (2 phút)
- [ ] Vào **GTM → Preview**
- [ ] Connect website
- [ ] **Submit form** (hoặc trigger event)
- [ ] Click vào event → Tab **Variables**
- [ ] Tìm: `DLV - email_hash`
- [ ] **Phải có giá trị:** 64 ký tự hex (ví dụ: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`)
- [ ] Click vào tag → Tab **Variables**
- [ ] Tìm: **User Data** hoặc **Advanced Matching**
- [ ] **Phải có:** `em` = email hash

### 4. Test trong Facebook Test Events (30 giây)
- [ ] Vào **Facebook Events Manager → Test Events**
- [ ] Trigger event trên website
- [ ] Click vào event
- [ ] Scroll xuống **Advanced Matching**
- [ ] **Phải thấy:** **User → em** = email hash

---

## ❌ Nếu không có email hash

### Case 1: Variable `DLV - email_hash` = undefined
→ **Vấn đề:** Code app không push `email_hash` vào dataLayer
→ **Fix:** Kiểm tra code app có gọi `trackFormSubmit(..., emailHash)` không

### Case 2: Variable có giá trị, nhưng Template không nhận
→ **Vấn đề:** Facebook Pixel Template chưa cấu hình **User Data → Email**
→ **Fix:** Điền `{{DLV - email_hash}}` vào field **Email** trong Template

### Case 3: Preview Mode có, nhưng Facebook Test Events không có
→ **Vấn đề:** Email hash format sai hoặc Template không gửi đúng
→ **Fix:** Kiểm tra email hash format (64 ký tự hex, lowercase)

---

## 📚 Chi tiết

Xem: [Advanced Matching Email Not Received Fix](./ADVANCED_MATCHING_EMAIL_NOT_RECEIVED_FIX.md)
