# 🚀 Deployment Guide - Admin Dashboard

**Target Servers:**
- Frontend: `khoahocgiare.info`
- Backend API: `api.khoahocgiare.info`

---

## 📋 Pre-deployment Checklist

### Backend Server (api.khoahocgiare.info)

- [ ] Node.js backend is running
- [ ] Socket.io server is initialized
- [ ] Redis Pub/Sub is configured
- [ ] MySQL database is accessible
- [ ] CORS is configured to allow `khoahocgiare.info`
- [ ] SSL certificate is installed (HTTPS)
- [ ] Port 3001 is open and accessible

### Frontend Server (khoahocgiare.info)

- [ ] Node.js 20+ is installed
- [ ] PM2 is installed (for process management)
- [ ] Nginx is configured (reverse proxy)
- [ ] SSL certificate is installed (HTTPS)
- [ ] Domain DNS is pointing to server

---

## 🔧 Step 1: Configure Backend CORS

Edit your backend server configuration to allow connections from the frontend:

**File: `/root/server/src/index.js` or `server.js`**

```javascript
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configure CORS for Express
app.use(cors({
  origin: [
    'https://khoahocgiare.info',
    'https://www.khoahocgiare.info',
    'http://localhost:4000' // For local testing
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: [
      'https://khoahocgiare.info',
      'https://www.khoahocgiare.info',
      'http://localhost:4000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  },
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

// Your routes and socket handlers...

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ WebSocket server ready at wss://api.khoahocgiare.info`);
});
```

---

## 🔧 Step 2: Configure Nginx (Backend)

**File: `/etc/nginx/sites-available/api.khoahocgiare.info`**

```nginx
upstream backend_server {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name api.khoahocgiare.info;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.khoahocgiare.info;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.khoahocgiare.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.khoahocgiare.info/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API endpoints
    location /api/ {
        proxy_pass http://backend_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # WebSocket endpoint
    location /socket.io/ {
        proxy_pass http://backend_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Health check
    location /health {
        proxy_pass http://backend_server;
        access_log off;
    }
}
```

**Enable and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/api.khoahocgiare.info /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Step 3: Build Frontend for Production

```bash
cd /root/clone-app

# Install dependencies (if not already installed)
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

**Verify build output:**
```
Route (app)
├ ○ /admin                         ← Admin dashboard
├ ƒ /api/admin/orders              ← API routes
├ ƒ /api/admin/orders/[orderId]/logs
├ ƒ /api/admin/stats
```

---

## 🔧 Step 4: Deploy Frontend with PM2

**Create PM2 ecosystem file:**

**File: `/root/clone-app/ecosystem.config.js`**

Update or verify the configuration:

```javascript
module.exports = {
  apps: [
    {
      name: 'khoahocgiare-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4000',
      cwd: '/root/clone-app',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        NEXT_PUBLIC_SOCKET_URL: 'https://api.khoahocgiare.info',
        NEXT_PUBLIC_API_URL: 'https://api.khoahocgiare.info'
      },
      error_file: '/root/clone-app/logs/error.log',
      out_file: '/root/clone-app/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false
    }
  ]
};
```

**Create logs directory:**
```bash
mkdir -p /root/clone-app/logs
```

**Start with PM2:**
```bash
cd /root/clone-app

# Stop existing process (if any)
pm2 stop khoahocgiare-frontend
pm2 delete khoahocgiare-frontend

# Start new process
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Enable PM2 startup on boot
pm2 startup
```

**Monitor the application:**
```bash
pm2 status
pm2 logs khoahocgiare-frontend
pm2 monit
```

---

## 🔧 Step 5: Configure Nginx (Frontend)

**File: `/etc/nginx/sites-available/khoahocgiare.info`**

```nginx
upstream frontend_server {
    server 127.0.0.1:4000;
}

server {
    listen 80;
    server_name khoahocgiare.info www.khoahocgiare.info;
    
    # Redirect HTTP to HTTPS
    return 301 https://khoahocgiare.info$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.khoahocgiare.info;
    
    # Redirect www to non-www
    return 301 https://khoahocgiare.info$request_uri;
}

server {
    listen 443 ssl http2;
    server_name khoahocgiare.info;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/khoahocgiare.info/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/khoahocgiare.info/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss;

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://frontend_server;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Next.js images
    location /_next/image {
        proxy_pass http://frontend_server;
        proxy_cache_valid 200 60m;
    }

    # All other requests
    location / {
        proxy_pass http://frontend_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Admin routes (optional: add authentication here)
    location /admin {
        # Add basic auth or custom authentication
        # auth_basic "Admin Area";
        # auth_basic_user_file /etc/nginx/.htpasswd;
        
        proxy_pass http://frontend_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/khoahocgiare.info /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧪 Step 6: Testing

### Test 1: Backend API Health Check

```bash
# Test backend is running
curl https://api.khoahocgiare.info/health

# Test admin orders endpoint
curl https://api.khoahocgiare.info/api/admin/orders?status=paid

# Test stats endpoint
curl https://api.khoahocgiare.info/api/admin/stats
```

### Test 2: Frontend Access

**Open in browser:**
```
https://khoahocgiare.info
https://khoahocgiare.info/admin
```

### Test 3: WebSocket Connection

**Open browser console on admin page:**
```javascript
// Check connection status
// Should see: "[Socket] Connected to server: XXXX"

// In Network tab, filter by WS (WebSocket)
// Should see: socket.io/?EIO=4&transport=websocket
// Status: 101 Switching Protocols
```

### Test 4: Real-time Updates

1. Open admin dashboard: `https://khoahocgiare.info/admin`
2. Check connection indicator (should show "Live Updates Active")
3. Click on an order to open the drawer
4. Click "Show System Logs"
5. Verify logs load correctly

---

## 🔒 Step 7: Security (Important!)

### Add Admin Authentication

**Create htpasswd file:**
```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
# Enter password when prompted
```

**Update Nginx config for /admin route:**
```nginx
location /admin {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    proxy_pass http://frontend_server;
    # ... rest of proxy settings
}
```

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

---

## 📊 Step 8: Monitoring

### Check Application Logs

```bash
# Frontend logs
pm2 logs khoahocgiare-frontend

# Backend logs
pm2 logs udemy-backend  # or your backend process name

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Monitor System Resources

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
df -h
free -h
```

---

## 🐛 Troubleshooting

### Issue: WebSocket shows "Disconnected"

**Solution:**
1. Check backend is running: `pm2 status`
2. Check Nginx is running: `sudo systemctl status nginx`
3. Verify CORS settings in backend
4. Check browser console for errors
5. Test WebSocket endpoint: `curl -i https://api.khoahocgiare.info/socket.io/`

### Issue: 502 Bad Gateway

**Solution:**
1. Check backend is running on port 3001: `netstat -tlnp | grep 3001`
2. Check Nginx upstream configuration
3. Restart backend: `pm2 restart all`

### Issue: CORS Errors

**Solution:**
1. Add `khoahocgiare.info` to CORS origins in backend
2. Ensure credentials: true in CORS config
3. Check SSL certificates are valid

### Issue: Admin page shows "Failed to fetch orders"

**Solution:**
1. Check API endpoints are accessible
2. Verify database connection in backend
3. Check backend logs: `pm2 logs`
4. Test API directly: `curl https://api.khoahocgiare.info/api/admin/orders`

---

## ✅ Post-Deployment Checklist

- [ ] Frontend accessible at `https://khoahocgiare.info`
- [ ] Admin dashboard accessible at `https://khoahocgiare.info/admin`
- [ ] Backend API responding at `https://api.khoahocgiare.info`
- [ ] WebSocket connection shows "Live Updates Active"
- [ ] Orders table loads with data
- [ ] Click order opens drawer
- [ ] Task progress displays correctly
- [ ] System logs load when clicked
- [ ] No console errors in browser
- [ ] SSL certificates valid (no warnings)
- [ ] Admin authentication working (if enabled)
- [ ] PM2 processes running and stable
- [ ] Logs are being written correctly

---

## 🔄 Deployment Commands Summary

```bash
# Backend
cd /root/server
pm2 restart udemy-backend

# Frontend
cd /root/clone-app
npm run build
pm2 restart khoahocgiare-frontend

# Nginx
sudo nginx -t
sudo systemctl reload nginx

# Check status
pm2 status
pm2 logs
```

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check browser console for JavaScript errors
4. Verify environment variables: `pm2 env 0`

---

**Deployment Date:** January 14, 2026  
**Status:** Ready for Production Deployment 🚀
