# GA4 Không Có Data - Quick Check

## ⚡ Checklist nhanh (5 phút)

### 1. Kiểm tra Measurement ID mới (1 phút)
- [ ] Vào **GA4 → Admin → Data Streams → Web**
- [ ] Copy **Measurement ID** mới (format: `G-XXXXXXXXXX`)
- [ ] Verify Website URL đúng domain của bạn

### 2. Kiểm tra Code Configuration (1 phút)
- [ ] Check `.env.production`:
  - Nếu load GA4 từ GTM: `NEXT_PUBLIC_GA4_VIA_GTM=true`
  - Nếu load GA4 từ code: `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX` (ID mới)
- [ ] Verify `components/GoogleAnalytics.tsx`:
  - Nếu `ga4ViaGTM=true` → Component return `null` ✅
  - Nếu `ga4ViaGTM=false` → Component load với ID mới ✅

### 3. Kiểm tra GTM Configuration (2 phút)
- [ ] Vào **GTM → Tags**
- [ ] Tìm tag: **GA4 - Configuration**
- [ ] **Nếu chưa có → Tạo:**
  - Tag Type: **Google Analytics: GA4 Configuration**
  - Measurement ID: `G-XXXXXXXXXX` (ID mới)
  - Trigger: **All Pages**
  - Save
- [ ] **Nếu đã có → Kiểm tra:**
  - Measurement ID = ID mới ✅
  - Trigger = **All Pages** ✅
  - Tag status = **Active** (không bị pause) ✅

### 4. Publish GTM (30 giây)
- [ ] Click **Submit** → **Publish**
- [ ] Verify container version mới nhất có tag `GA4 - Configuration`

### 5. Test (30 giây)
- [ ] **GTM Preview Mode:**
  - Tag `GA4 - Configuration` fire ✅
- [ ] **Network Tab:**
  - Request đến `gtag/js?id=G-XXXXXXXXXX` (ID mới) ✅
- [ ] **GA4 Real-time:**
  - Active users > 0 ✅
  - Page views được track ✅

---

## ❌ Nếu vẫn không có data

### Case 1: GA4 Configuration tag không fire
→ **Vấn đề:** Trigger sai hoặc tag bị pause
→ **Fix:** Kiểm tra trigger = **All Pages**, tag status = **Active**

### Case 2: Tag fire nhưng GA4 không có data
→ **Vấn đề:** Measurement ID sai hoặc Data Stream chưa setup
→ **Fix:** 
1. Verify Measurement ID trong tag = Measurement ID trong GA4 Data Stream
2. Verify Data Stream Website URL đúng domain

### Case 3: GA4 load cả từ code và GTM
→ **Vấn đề:** Conflict - 2 Measurement ID khác nhau
→ **Fix:** Set `NEXT_PUBLIC_GA4_VIA_GTM=true` để tắt GA4 component trong code

### Case 4: Events không có data
→ **Vấn đề:** GA4 Event tags chưa được tạo hoặc trigger sai
→ **Fix:** Tạo GA4 Event tags trong GTM với trigger đúng

---

## 📚 Chi tiết

Xem: [GA4 No Data Fix](./GA4_NO_DATA_FIX.md) - Hướng dẫn troubleshooting chi tiết
