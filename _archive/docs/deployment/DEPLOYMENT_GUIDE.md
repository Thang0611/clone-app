# 🚀 Deployment Guide for GetCourses.net

## Tổng quan

Hướng dẫn deploy ứng dụng GetCourses.net lên production với PM2 và Nginx.

---

## 📋 Yêu cầu

- Ubuntu/Debian server
- Node.js 18+ và npm
- PM2 (sẽ được cài đặt tự động)
- Nginx (sẽ được cài đặt tự động)
- Certbot (cho SSL certificates)
- Domain: `getcourses.net` và `api.getcourses.net` trỏ về server IP

---

## 🚀 Quick Deploy (Recommended)

Chạy script tự động để setup tất cả:

```bash
cd /root/project/clone-app
sudo bash DEPLOY_GETCOURSES.sh
```

Script này sẽ:
1. ✅ Kiểm tra và cài đặt prerequisites
2. ✅ Tạo file `.env.production`
3. ✅ Build ứng dụng Next.js
4. ✅ Setup PM2
5. ✅ Cấu hình Nginx
6. ✅ Hướng dẫn setup SSL

---

## 📝 Manual Setup

### Bước 1: Environment Variables

Tạo file `.env.production`:

```bash
cd /root/project/clone-app
nano .env.production
```

Nội dung:

```bash
NODE_ENV=production

# Frontend URL
NEXTAUTH_URL=https://getcourses.net
NEXT_PUBLIC_SITE_URL=https://getcourses.net

# Backend API URLs
NEXT_PUBLIC_API_URL=https://api.getcourses.net
NEXT_PUBLIC_SOCKET_URL=https://api.getcourses.net

# Authentication (Generate strong secrets)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=support@getcourses.net
ADMIN_PASSWORD_HASH=$(node -e "const bcrypt=require('bcrypt');console.log(bcrypt.hashSync('your-password',10))")
```

**Quan trọng:**
- Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Generate `ADMIN_PASSWORD_HASH`: Sử dụng bcrypt hash cho password admin

Set permissions:
```bash
chmod 600 .env.production
```

---

### Bước 2: Build Application

```bash
cd /root/project/clone-app

# Install dependencies
npm ci --production=false

# Build for production
npm run build
```

---

### Bước 3: Setup PM2

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command output by pm2 startup

# Check status
pm2 status
pm2 logs getcourses-frontend
```

**PM2 Commands:**
```bash
# View logs
pm2 logs getcourses-frontend

# Restart
pm2 restart getcourses-frontend --update-env

# Stop
pm2 stop getcourses-frontend

# Delete
pm2 delete getcourses-frontend

# Monitor
pm2 monit
```

---

### Bước 4: Setup Nginx

#### 4.1. Copy Nginx Configuration

```bash
sudo cp /root/project/server/nginx-getcourses.conf /etc/nginx/sites-available/getcourses.net
```

#### 4.2. Enable Site

```bash
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/getcourses.net /etc/nginx/sites-enabled/
```

#### 4.3. Test and Reload

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

---

### Bước 5: Setup SSL Certificates

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d getcourses.net -d www.getcourses.net
sudo certbot --nginx -d api.getcourses.net

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

---

## 🔧 Configuration Files

### PM2 Configuration

File: `/root/project/clone-app/ecosystem.config.js`

- **App name:** `getcourses-frontend`
- **Port:** `4000`
- **Environment:** Production
- **Auto restart:** Enabled

### Nginx Configuration

File: `/etc/nginx/sites-available/getcourses.net`

- **Frontend:** `getcourses.net` → `localhost:4000`
- **Backend:** `api.getcourses.net` → `localhost:3000`
- **WebSocket:** Supported via `/socket.io/` path
- **SSL:** Let's Encrypt certificates

---

## 📊 Monitoring & Logs

### PM2 Logs

```bash
# Real-time logs
pm2 logs getcourses-frontend

# Last 50 lines
pm2 logs getcourses-frontend --lines 50 --nostream

# Error logs only
pm2 logs getcourses-frontend --err
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/getcourses.net.access.log
sudo tail -f /var/log/nginx/api.getcourses.net.access.log

# Error logs
sudo tail -f /var/log/nginx/getcourses.net.error.log
sudo tail -f /var/log/nginx/api.getcourses.net.error.log
```

### Application Logs

```bash
# PM2 logs directory
/root/project/clone-app/logs/error.log
/root/project/clone-app/logs/out.log
```

---

## 🔍 Troubleshooting

### PM2 Issues

**Application not starting:**
```bash
# Check logs
pm2 logs getcourses-frontend --lines 100

# Check environment
pm2 env 0

# Restart with fresh env
pm2 restart getcourses-frontend --update-env
```

**Port already in use:**
```bash
# Check what's using port 4000
sudo lsof -i :4000

# Kill process if needed
sudo kill -9 <PID>
```

### Nginx Issues

**Configuration errors:**
```bash
# Test configuration
sudo nginx -t

# View error details
sudo nginx -t 2>&1 | less
```

**502 Bad Gateway:**
- Check if application is running: `pm2 status`
- Check if port 4000 is listening: `netstat -tuln | grep 4000`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/getcourses.net.error.log`

**WebSocket not working:**
- Verify `/socket.io/` location block in Nginx config
- Check WebSocket upgrade headers are present
- Verify backend is running on port 3000

### SSL Issues

**Certificate renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

---

## 🔄 Update Deployment

### Update Application

```bash
cd /root/project/clone-app

# Pull latest code
git pull

# Install dependencies
npm ci --production=false

# Build
npm run build

# Restart PM2
pm2 restart getcourses-frontend --update-env
```

### Update Nginx Config

```bash
# Edit config
sudo nano /etc/nginx/sites-available/getcourses.net

# Test
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 📞 Support

### Useful Commands

```bash
# Quick status check
pm2 status && sudo systemctl status nginx

# Check ports
sudo netstat -tuln | grep -E ":(3000|4000)"

# Test connectivity
curl -I http://localhost:4000
curl -I http://localhost:3000
```

### Emergency Commands

```bash
# Stop everything
pm2 stop all
sudo systemctl stop nginx

# Start everything
pm2 start all
sudo systemctl start nginx

# Full restart
pm2 restart all --update-env
sudo systemctl restart nginx
```

---

## ✅ Checklist

- [ ] Server có Node.js 18+ và npm
- [ ] Domain `getcourses.net` trỏ về server IP
- [ ] Domain `api.getcourses.net` trỏ về server IP
- [ ] File `.env.production` đã tạo và cấu hình đúng
- [ ] Application đã build thành công
- [ ] PM2 đã start và app đang chạy
- [ ] Nginx đã cấu hình và reload
- [ ] SSL certificates đã cài đặt
- [ ] Test frontend: `curl https://getcourses.net`
- [ ] Test backend: `curl https://api.getcourses.net/health`
- [ ] WebSocket hoạt động (test từ frontend)

---

**Last Updated:** 2026-01-17  
**Version:** 1.0
