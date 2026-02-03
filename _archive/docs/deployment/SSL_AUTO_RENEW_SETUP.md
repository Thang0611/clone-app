# 🔄 SSL Auto-Renewal Setup for GetCourses.net

## Trạng thái Auto-Renewal

Certbot đã tự động setup auto-renewal khi cài đặt SSL certificates. Systemd timer chạy 2 lần mỗi ngày để kiểm tra và renew certificates khi cần.

---

## ✅ Kiểm tra Auto-Renewal

### 1. Kiểm tra Certbot Timer

```bash
# Check timer status
sudo systemctl status certbot.timer

# List all timers
sudo systemctl list-timers | grep certbot

# Enable timer (if not enabled)
sudo systemctl enable certbot.timer

# Start timer
sudo systemctl start certbot.timer
```

### 2. Test Auto-Renewal (Dry Run)

```bash
# Test renewal without actually renewing
sudo certbot renew --dry-run
```

---

## 📋 Cấu hình Auto-Renewal

### Systemd Timer (Default - Recommended)

Certbot sử dụng systemd timer để auto-renew certificates:

**Timer file:** `/lib/systemd/system/certbot.timer`

**Chạy:** 2 lần mỗi ngày (12h và 12h + random delay)

**Enable:**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**Check next run:**
```bash
sudo systemctl list-timers | grep certbot
```

---

## 🔧 Manual Renewal (Nếu cần)

### Renew tất cả certificates

```bash
sudo certbot renew
```

### Renew một domain cụ thể

```bash
sudo certbot renew --cert-name getcourses.net
sudo certbot renew --cert-name api.getcourses.net
```

### Renew và reload Nginx

```bash
sudo certbot renew --reload
# Hoặc
sudo certbot renew && sudo systemctl reload nginx
```

---

## 📅 Cron Job (Alternative Method)

Nếu muốn sử dụng cron thay vì systemd timer:

```bash
# Edit crontab
sudo crontab -e

# Add this line (runs daily at 2:30 AM and reloads nginx)
30 2 * * * certbot renew --quiet --reload
```

---

## 🔍 Monitoring & Logs

### Check Certbot Logs

```bash
# View logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# View last renewal
sudo grep "renew" /var/log/letsencrypt/letsencrypt.log | tail -5
```

### Check Certificate Expiry

```bash
# List all certificates
sudo certbot certificates

# Check expiry date
sudo certbot certificates | grep "Expiry Date"
```

### Check Systemd Timer Logs

```bash
# View timer status
sudo systemctl status certbot.timer

# View service logs
sudo journalctl -u certbot.timer -n 50
sudo journalctl -u certbot.service -n 50
```

---

## ⚙️ Advanced Configuration

### Renewal Configuration

File config: `/etc/letsencrypt/renewal/getcourses.net.conf`

```ini
# Certbot sẽ tự động tạo file này
# Có thể chỉnh sửa để customize renewal behavior
```

### Pre/Post Renewal Hooks

Tạo hooks để chạy commands trước/sau renewal:

**Pre-renewal hook:**
```bash
sudo nano /etc/letsencrypt/renewal-hooks/pre/reload-services.sh
```

Content:
```bash
#!/bin/bash
# Backup configs before renewal
sudo cp /etc/nginx/sites-available/getcourses.net /etc/nginx/sites-available/getcourses.net.backup
```

**Post-renewal hook:**
```bash
sudo nano /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Content:
```bash
#!/bin/bash
# Reload nginx after renewal
sudo systemctl reload nginx
```

Make executable:
```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/pre/*.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/*.sh
```

---

## 🔔 Email Notifications (Optional)

Certbot có thể gửi email khi certificates sắp expire:

```bash
# Update email in renewal config
sudo nano /etc/letsencrypt/renewal/getcourses.net.conf

# Add email under [renewalparams]
email = support@getcourses.net
```

Hoặc khi renew:
```bash
sudo certbot renew --email support@getcourses.net
```

---

## ✅ Verification Checklist

- [ ] Certbot timer is enabled and active
- [ ] Test dry-run renewal works: `sudo certbot renew --dry-run`
- [ ] Certificates list: `sudo certbot certificates`
- [ ] Check next renewal time: `sudo systemctl list-timers | grep certbot`
- [ ] Logs are accessible: `/var/log/letsencrypt/letsencrypt.log`

---

## 🚨 Troubleshooting

### Timer not running

```bash
# Enable and start
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check status
sudo systemctl status certbot.timer
```

### Renewal fails

```bash
# Check logs
sudo tail -50 /var/log/letsencrypt/letsencrypt.log

# Test renewal manually
sudo certbot renew --dry-run --verbose

# Check Nginx config
sudo nginx -t
```

### Certificate not renewing

```bash
# Check if certificate is close to expiry (renews when <30 days left)
sudo certbot certificates | grep "Expiry Date"

# Force renewal (even if not close to expiry)
sudo certbot renew --force-renewal
```

---

## 📚 Useful Commands

```bash
# Quick status check
sudo systemctl status certbot.timer && sudo certbot certificates

# Force renewal test
sudo certbot renew --dry-run --verbose

# Renew and reload nginx
sudo certbot renew --reload && sudo systemctl reload nginx

# Check certificate expiry
sudo openssl x509 -in /etc/letsencrypt/live/getcourses.net/fullchain.pem -noout -dates

# List all certbot timers
sudo systemctl list-timers certbot.timer
```

---

**Last Updated:** 2026-01-18  
**Status:** ✅ Auto-Renewal Enabled and Active
