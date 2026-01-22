# 🚀 Quick Start Guide - Admin Dashboard

**Production URL:** https://getcourses.net/admin  
**Local URL:** http://localhost:4000/admin

---

## ✅ Current Status

```
✅ Frontend: DEPLOYED & RUNNING
✅ Admin Dashboard: ACCESSIBLE (HTTP 200)
✅ PM2 Process: getcourses-frontend (online)
✅ Build: SUCCESS (0 errors)
⏳ Backend API: Ready to connect
⏳ WebSocket: Ready to connect
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Homepage** | https://getcourses.net |
| **Admin Dashboard** | https://getcourses.net/admin |
| **Backend API** | https://api.getcourses.net |
| **API Orders** | https://api.getcourses.net/api/admin/orders |
| **API Stats** | https://api.getcourses.net/api/admin/stats |

---

## 🎯 What's Working Now

### ✅ Frontend (Local - Port 4000)

```bash
# Check status
pm2 status

# Output:
┌────┬───────────────────────┬─────────┬─────────┐
│ id │ name                  │ pid     │ status  │
├────┼───────────────────────┼─────────┼─────────┤
│ 0  │ getcourses-frontend │ 81617   │ online  │
└────┴───────────────────────┴─────────┴─────────┘
```

### ✅ Test Endpoints

```bash
# Homepage
curl -I http://localhost:4000
# Response: HTTP/1.1 200 OK ✅

# Admin Dashboard
curl -I http://localhost:4000/admin
# Response: HTTP/1.1 200 OK ✅
```

### ✅ Features Available

1. **Dashboard Layout** ✅
   - Professional sidebar navigation
   - Stats cards (Total, Processing, Completed, Failed)
   - Clean, modern design

2. **Order Table** ✅
   - Display paid orders
   - Search functionality
   - Progress bars
   - Status badges

3. **Order Details Drawer** ✅
   - Slide-over panel
   - Order summary
   - Task progress cards
   - System audit logs timeline

4. **Mock Data** ✅
   - Sample orders for testing
   - Sample tasks with progress
   - Sample audit logs
   - All UI components functional

---

## 🔧 Next Steps to Complete Setup

### Step 1: Configure Backend CORS

Edit your backend server file:

```javascript
// In /root/server/src/index.js or server.js
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors({
  origin: [
    'https://getcourses.net',
    'http://localhost:4000'
  ],
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: [
      'https://getcourses.net',
      'http://localhost:4000'
    ],
    credentials: true
  }
});
```

### Step 2: Replace Mock Data with Real Database

Edit API routes to use real data:

```bash
# Edit these files:
nano /root/clone-app/app/api/admin/orders/route.ts
nano /root/clone-app/app/api/admin/orders/[orderId]/logs/route.ts
nano /root/clone-app/app/api/admin/stats/route.ts
```

Replace mock data with Sequelize queries (see `DEPLOYMENT_GUIDE.md`)

### Step 3: Restart Backend

```bash
cd /root/server
pm2 restart backend
pm2 logs backend
```

### Step 4: Configure Nginx

See `DEPLOYMENT_GUIDE.md` for complete Nginx configuration.

**Quick Setup:**
```bash
# Frontend proxy
sudo nano /etc/nginx/sites-available/getcourses.net

# Backend proxy
sudo nano /etc/nginx/sites-available/api.getcourses.net

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🧪 Testing

### Local Testing (Works Now)

```bash
# Test homepage
curl http://localhost:4000

# Test admin dashboard
curl http://localhost:4000/admin

# Test admin API
curl http://localhost:4000/api/admin/orders?status=paid
curl http://localhost:4000/api/admin/stats

# View in browser
xdg-open http://localhost:4000/admin  # Linux
open http://localhost:4000/admin      # macOS
```

### Browser Testing

1. Open: http://localhost:4000/admin
2. You should see:
   - ✅ Sidebar with navigation
   - ✅ 4 stats cards at top
   - ✅ Orders table with sample data
   - ✅ Search bar
   - ✅ Connection status (shows "Disconnected" until backend connected)

3. Click any order row:
   - ✅ Drawer slides in from right
   - ✅ Order details display
   - ✅ Task cards show progress
   - ✅ Click "Show System Logs" to see timeline

---

## 🔄 Common Commands

### PM2 Management

```bash
# Check status
pm2 status

# View logs
pm2 logs getcourses-frontend

# Restart
pm2 restart getcourses-frontend

# Stop
pm2 stop getcourses-frontend

# Monitor
pm2 monit
```

### Rebuild & Deploy

```bash
cd /root/clone-app

# Rebuild
npm run build

# Restart PM2
pm2 restart getcourses-frontend

# Check status
pm2 status
pm2 logs --lines 50
```

### Test Endpoints

```bash
# Frontend
curl -I http://localhost:4000
curl -I http://localhost:4000/admin

# Backend (after configuration)
curl -I https://api.getcourses.net/health
curl https://api.getcourses.net/api/admin/orders?status=paid
```

---

## 🐛 Troubleshooting

### Problem: Port 4000 already in use

```bash
# Find what's using port 4000
netstat -tlnp | grep 4000

# Kill process if needed
pm2 stop getcourses-frontend
# or
kill -9 <PID>
```

### Problem: PM2 process not starting

```bash
# Check logs
pm2 logs getcourses-frontend --lines 100

# Delete and restart
pm2 delete getcourses-frontend
cd /root/clone-app
pm2 start ecosystem.config.js
```

### Problem: 404 on /admin page

```bash
# Rebuild application
cd /root/clone-app
npm run build
pm2 restart getcourses-frontend

# Wait 5 seconds and test
sleep 5
curl -I http://localhost:4000/admin
```

### Problem: WebSocket shows "Disconnected"

**This is expected** until backend is configured.

**Solution:**
1. Configure backend CORS (see Step 1 above)
2. Ensure Socket.io server is running
3. Check backend logs: `pm2 logs backend`

### Problem: API returns mock data

**This is intentional** for testing.

**Solution:**
1. Edit API routes (see Step 2 above)
2. Replace mock data with database queries
3. Restart application

---

## 📁 Important Files

```
/root/clone-app/
├── app/admin/page.tsx              # Main dashboard page
├── app/api/admin/                  # API routes (currently mock data)
├── components/admin/               # UI components
├── hooks/                          # React hooks (useSocket, useAdminOrders)
├── .env.production                 # Production env vars
├── .env.local                      # Local env vars
├── ecosystem.config.js             # PM2 configuration
├── DEPLOYMENT_GUIDE.md             # Complete deployment guide
├── TESTING_CHECKLIST.md            # Testing checklist
└── QUICK_START.md                  # This file
```

---

## 📊 Current Configuration

### Environment Variables (Production)

```env
NEXT_PUBLIC_SOCKET_URL=https://api.getcourses.net
NEXT_PUBLIC_API_URL=https://api.getcourses.net
```

### PM2 Configuration

```javascript
{
  name: 'getcourses-frontend',
  script: './node_modules/next/dist/bin/next',
  args: 'start -p 4000',
  env: {
    NODE_ENV: 'production',
    PORT: 4000,
    NEXT_PUBLIC_SOCKET_URL: 'https://api.getcourses.net',
    NEXT_PUBLIC_API_URL: 'https://api.getcourses.net'
  }
}
```

---

## ✅ Verification Checklist

- [x] ✅ Node.js 24.12.0 installed
- [x] ✅ Dependencies installed
- [x] ✅ Build successful (0 errors)
- [x] ✅ PM2 process running
- [x] ✅ Port 4000 accessible
- [x] ✅ Homepage responds (HTTP 200)
- [x] ✅ Admin dashboard responds (HTTP 200)
- [x] ✅ Environment files created
- [x] ✅ Logs directory created
- [ ] ⏳ Backend API connected
- [ ] ⏳ WebSocket connected
- [ ] ⏳ Nginx configured
- [ ] ⏳ SSL certificates installed

---

## 📞 Getting Help

1. **Check logs:**
   ```bash
   pm2 logs getcourses-frontend --lines 100
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Verify backend:**
   ```bash
   pm2 logs backend
   curl http://localhost:3001/health
   ```

4. **Review documentation:**
   - `DEPLOYMENT_GUIDE.md` - Complete deployment steps
   - `TESTING_CHECKLIST.md` - All tests
   - `ADMIN_DASHBOARD_README.md` - Feature documentation

---

**Status:** ✅ **READY TO USE**  
**Next:** Configure backend API and Nginx for production

**Last Updated:** January 14, 2026
