# 📋 Hướng dẫn Setup GA4 trong GTM - Step by Step

## ⚠️ Lưu ý quan trọng

Bạn đang tạo **GA4 Event tag**, nhưng cần tạo **GA4 Configuration tag** trước!

## ✅ Bước 1: Tạo GA4 Configuration Tag (Base Tag)

### 1.1. Tạo tag mới
- Vào **Tags** > **New**
- Click vào **Tag Configuration** area

### 1.2. Chọn loại tag
- Chọn: **Google Analytics: GA4 Configuration** (KHÔNG phải GA4 Event)
- Icon: Biểu đồ cột màu xanh

### 1.3. Cấu hình
- **Measurement ID**: `G-Z68W3D9YRF`
- **Triggering**: Chọn **All Pages**

### 1.4. Đặt tên tag
- **Tag Name**: `GA4 - Configuration` (hoặc tên bạn muốn)

### 1.5. Lưu
- Click **Save**

---

## ✅ Bước 2: Tạo GA4 Event Tags (Optional)

Sau khi có Configuration tag, bạn mới tạo các Event tags:

### 2.1. Tạo Event tag
- **Tags** > **New**
- Chọn: **Google Analytics: GA4 Event**

### 2.2. Cấu hình
- **Measurement ID**: `G-Z68W3D9YRF` (sẽ tự động link với Configuration tag)
- **Event Name**: Tên event (ví dụ: `purchase`, `form_submit`, etc.)
- **Event Parameters**: Thêm parameters nếu cần
- **Triggering**: Chọn trigger phù hợp

---

## 🔍 Kiểm tra

Sau khi tạo GA4 Configuration tag:
- ✅ Warning "Không tìm thấy thẻ Google nào" sẽ biến mất
- ✅ Các GA4 Event tags sẽ tự động link với Configuration tag
- ✅ Measurement ID sẽ hiển thị với icon xanh (đã link)

---

## 📝 Checklist

- [ ] Đã tạo **GA4 Configuration tag** (base tag)
- [ ] Measurement ID: `G-Z68W3D9YRF`
- [ ] Trigger: **All Pages**
- [ ] Đã **Save** tag
- [ ] Đã **Submit** và **Publish** container
- [ ] Đã test trong **Preview mode**
- [ ] Đã verify trong **GA4 Real-time**

---

## 🎯 Thứ tự đúng

1. ✅ **GA4 Configuration** tag (bắt buộc) - Base tag
2. ⚙️ **GA4 Event** tags (tùy chọn) - Custom events
3. 📊 **GA4 Custom** tags (tùy chọn) - Advanced tracking

---

## 💡 Lưu ý

- **GA4 Configuration tag** là bắt buộc để GA4 hoạt động
- **GA4 Event tags** chỉ dùng cho custom events
- Nếu chỉ cần track page views, chỉ cần Configuration tag là đủ
