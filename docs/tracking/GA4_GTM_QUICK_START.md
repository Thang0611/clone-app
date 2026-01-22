# 🚀 GA4 + GTM Quick Start

## ⚡ Cách nhanh nhất để kết nối GA4 với GTM

### Bước 1: Tắt GA4 component trong code

Thêm vào `.env.production`:
```bash
NEXT_PUBLIC_GA4_VIA_GTM=true
```

### Bước 2: Cấu hình trong GTM

1. Vào **Google Tag Manager** > Container `GTM-5TL3J9D8`
2. **Tags** > **New** > **Google Analytics: GA4 Configuration**
3. **Measurement ID**: `G-Z68W3D9YRF`
4. **Triggering**: **All Pages**
5. **Save** > **Submit** > **Publish**

### Bước 3: Test

1. GTM **Preview** mode → Verify tag fires
2. GA4 **Real-time** reports → Verify data

✅ **Xong!** GA4 giờ load hoàn toàn qua GTM.

---

## 📖 Chi tiết đầy đủ

Xem: [GA4_GTM_CONNECTION_GUIDE.md](./GA4_GTM_CONNECTION_GUIDE.md)
