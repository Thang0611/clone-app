# ✅ SSL Auto-Renewal Status - GetCourses.net

## Trạng thái hiện tại

✅ **Auto-Renewal đã được cài đặt và kích hoạt!**

---

## 📊 Thông tin Timer

**Service:** `certbot.timer`  
**Status:** ✅ Active (enabled)  
**Schedule:** 2 lần mỗi ngày (12:00 AM và 12:00 PM)  
**Randomized Delay:** 12 giờ (để tránh tải server)  
**Next Run:** Kiểm tra với `sudo systemctl list-timers certbot.timer`

---

## ⚠️ Lưu ý về Rate Limit

Lỗi rate limit khi test là **bình thường** sau khi vừa cài đặt certificates mới.

**Let's Encrypt Rate Limits:**
- 50 certificates per registered domain per week
- 5 duplicate certificates per week
- 5 failed validations per account per hostname per hour

Certbot timer sẽ tự động renew certificates **chỉ khi chúng gần expire** (trong vòng 30 ngày), không phải mỗi lần chạy.

---

## 🔍 Kiểm tra Status

```bash
# Check timer status
sudo systemctl status certbot.timer

# Check next run time
sudo systemctl list-timers certbot.timer

# List certificates
sudo certbot certificates

# View logs
sudo tail -50 /var/log/letsencrypt/letsencrypt.log
```

---

## ✅ Verification Commands

```bash
# Quick status check
sudo systemctl status certbot.timer && sudo certbot certificates

# Check if timer is enabled
sudo systemctl is-enabled certbot.timer

# Check if timer is active
sudo systemctl is-active certbot.timer
```

---

## 🔄 Renewal Behavior

**Certbot tự động:**
- ✅ Chạy 2 lần mỗi ngày
- ✅ Kiểm tra certificates
- ✅ **Chỉ renew khi certificate < 30 ngày trước khi expire**
- ✅ Tự động reload Nginx sau khi renew
- ✅ Gửi email thông báo (nếu có)

**Certificates hiện tại:**
- Expiry: 2026-04-17 (89 days valid)
- Auto-renew sẽ chạy vào khoảng tháng 3/2026

---

## 📝 Manual Renewal (Nếu cần)

Nếu muốn force renewal sớm (tránh rate limit):

```bash
# Wait 7 days after initial setup, then:
sudo certbot renew --force-renewal

# Or renew specific certificate
sudo certbot renew --cert-name getcourses.net --force-renewal
```

---

## 📚 Documentation

Chi tiết đầy đủ: `SSL_AUTO_RENEW_SETUP.md`

---

**Status:** ✅ **AUTO-RENEWAL ACTIVE**  
**Last Updated:** 2026-01-18
