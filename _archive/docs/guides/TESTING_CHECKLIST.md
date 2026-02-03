# ✅ Testing Checklist - Admin Dashboard

**Deployment Date:** January 14, 2026  
**Frontend:** https://getcourses.net  
**Backend API:** https://api.getcourses.net  
**Admin Dashboard:** https://getcourses.net/admin

---

## 🚀 Deployment Status

### ✅ Successfully Completed

- ✅ Build successful (0 errors)
- ✅ PM2 process running: `getcourses-frontend`
- ✅ Homepage responding: HTTP 200
- ✅ Admin page responding: HTTP 200
- ✅ Environment files created
- ✅ Logs directory created
- ✅ Configuration updated for production

---

## 🧪 Local Testing (Port 4000)

### Test 1: Homepage

```bash
curl -I http://localhost:4000
# Expected: HTTP/1.1 200 OK
```

**Result:** ✅ PASSED (HTTP 200)

### Test 2: Admin Dashboard

```bash
curl -I http://localhost:4000/admin
# Expected: HTTP/1.1 200 OK
```

**Result:** ✅ PASSED (HTTP 200)

### Test 3: Admin API - Orders

```bash
curl http://localhost:4000/api/admin/orders?status=paid
# Expected: JSON response with orders data
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_code": "DH123456",
      "user_email": "customer@example.com",
      "total_amount": 300000,
      "order_status": "processing",
      "payment_status": "paid",
      "stats": {
        "totalTasks": 3,
        "completedTasks": 1,
        "failedTasks": 0,
        "progressPercentage": 33
      }
    }
  ]
}
```

### Test 4: Admin API - Stats

```bash
curl http://localhost:4000/api/admin/stats
# Expected: JSON response with dashboard statistics
```

### Test 5: Admin API - Audit Logs

```bash
curl http://localhost:4000/api/admin/orders/1/logs
# Expected: JSON response with audit logs
```

---

## 🌐 Production Testing (Domain Names)

### Prerequisites

1. **DNS Configuration:**
   - `getcourses.net` → Your server IP
   - `api.getcourses.net` → Your server IP

2. **Nginx Configuration:**
   - Frontend reverse proxy configured
   - Backend reverse proxy configured
   - SSL certificates installed

### Test 1: Frontend Homepage

```bash
curl -I https://getcourses.net
# Expected: HTTP/2 200
```

### Test 2: Admin Dashboard

**Browser Test:**
1. Open: https://getcourses.net/admin
2. Check for:
   - ✅ Dashboard loads without errors
   - ✅ Sidebar visible
   - ✅ Stats cards display
   - ✅ Orders table visible
   - ✅ Connection status indicator

**Console Check:**
```javascript
// Open browser console (F12)
// Should NOT see any errors
// Should see: [Socket] Connected to server: XXXX (if backend is ready)
```

### Test 3: Backend API Health

```bash
curl -I https://api.getcourses.net/health
# Expected: HTTP/2 200
```

### Test 4: Backend API - Orders

```bash
curl https://api.getcourses.net/api/admin/orders?status=paid
# Expected: JSON response with real orders from database
```

### Test 5: WebSocket Connection

**Browser Test:**
1. Open: https://getcourses.net/admin
2. Open DevTools → Network tab → WS (WebSocket)
3. Look for: `socket.io/?EIO=4&transport=websocket`
4. Status should be: `101 Switching Protocols`

**Connection Status:**
- 🟢 **"Live Updates Active"** = WebSocket connected
- 🔴 **"Disconnected"** = Backend not running or CORS issue

---

## 📊 Feature Testing

### Feature 1: Order Table

**Steps:**
1. Navigate to https://getcourses.net/admin
2. Verify orders table displays
3. Check columns: Order ID, Customer, Total, Status, Progress
4. Test search functionality (type order code or email)
5. Click "Refresh" button

**Expected:**
- ✅ Table loads with mock/real data
- ✅ Progress bars visible
- ✅ Status badges colored correctly
- ✅ Search filters table
- ✅ Refresh reloads data

### Feature 2: Order Details Drawer

**Steps:**
1. Click any order row in the table
2. Drawer should slide in from right
3. Verify sections:
   - Order Summary (email, total, status, date)
   - Download Tasks (individual task cards)
   - Progress bars for each task
   - Status badges

**Expected:**
- ✅ Drawer opens smoothly
- ✅ Order details display correctly
- ✅ Task cards visible
- ✅ Progress bars show percentages
- ✅ Close button works

### Feature 3: Task Progress

**Steps:**
1. In order drawer, examine task cards
2. Check for:
   - Course title and URL
   - Status badge
   - Progress bar
   - Current file name (if downloading)
   - Download speed (if downloading)
   - Google Drive link (if completed)
   - Error message (if failed)

**Expected:**
- ✅ All task information displays
- ✅ Status colors correct
- ✅ Progress bars animated
- ✅ Links clickable

### Feature 4: System Audit Logs

**Steps:**
1. In order drawer, click "Show System Logs"
2. Logs section expands
3. Check timeline view:
   - Events in chronological order
   - Color-coded by severity
   - Category icons visible
   - Timestamps display

**Expected:**
- ✅ Logs load successfully
- ✅ Timeline renders correctly
- ✅ Colors match severity (info=blue, error=red)
- ✅ Icons display (💳 📝 ⬇️ ⚙️ 📧)
- ✅ "Show details" expands JSON

### Feature 5: Severity Filtering

**Steps:**
1. In logs section, click filter buttons:
   - All
   - Info
   - Warning
   - Error
   - Critical

**Expected:**
- ✅ Logs filter by selected severity
- ✅ Active button highlighted
- ✅ Count updates correctly

### Feature 6: Real-time Updates (Requires Backend)

**Steps:**
1. Open admin dashboard
2. Trigger a download on backend
3. Watch for live updates:
   - Progress bars should update
   - Status badges should change
   - Current file names should appear
   - Speed indicators should update

**Expected:**
- ✅ Progress updates without refresh
- ✅ Status changes reflect immediately
- ✅ No page reload needed
- ✅ Smooth animations

### Feature 7: Empty States

**Steps:**
1. Test with no orders (backend returns empty array)
2. Test with no tasks in an order
3. Test with no logs

**Expected:**
- ✅ "No orders found" message
- ✅ "No tasks found" message
- ✅ "No logs found" message
- ✅ Graceful UI handling

### Feature 8: Error Handling

**Steps:**
1. Stop backend server
2. Click refresh on admin dashboard
3. Try to load order details
4. Try to load logs

**Expected:**
- ✅ Error messages display
- ✅ UI doesn't break
- ✅ Connection status shows "Disconnected"
- ✅ User-friendly error text

---

## 🔧 System Testing

### Test 1: PM2 Process

```bash
pm2 status
# Expected: getcourses-frontend status = online
```

**Result:**
```
┌────┬───────────────────────┬──────┬──────────┐
│ id │ name                  │ mode │ status   │
├────┼───────────────────────┼──────┼──────────┤
│ 0  │ getcourses-frontend │ cluster │ online   │
└────┴───────────────────────┴──────┴──────────┘
```

### Test 2: PM2 Logs

```bash
pm2 logs getcourses-frontend --lines 20
# Should show Next.js server logs
```

### Test 3: Memory Usage

```bash
pm2 monit
# Check memory stays under 1GB
```

### Test 4: Auto-restart

```bash
# Kill process
pm2 stop getcourses-frontend

# Should auto-restart
pm2 status
# Status should return to "online"
```

### Test 5: Port Availability

```bash
netstat -tlnp | grep 4000
# Should show Next.js listening on port 4000
```

---

## 🌐 Browser Compatibility Testing

### Desktop Browsers

- [ ] **Chrome** (latest)
  - Navigate to admin dashboard
  - Test all features
  - Check console for errors

- [ ] **Firefox** (latest)
  - Same tests as Chrome

- [ ] **Safari** (latest)
  - Same tests as Chrome

- [ ] **Edge** (latest)
  - Same tests as Chrome

### Mobile Browsers

- [ ] **Chrome Mobile**
  - Responsive layout
  - Touch interactions
  - Drawer opens correctly

- [ ] **Safari iOS**
  - Same tests as Chrome Mobile

### Expected Results:

- ✅ All features work across browsers
- ✅ No console errors
- ✅ Responsive design works on mobile
- ✅ WebSocket connects successfully

---

## 🔒 Security Testing

### Test 1: HTTPS Enforcement

```bash
curl -I http://getcourses.net
# Expected: Redirect to https://
```

### Test 2: CORS Configuration

```bash
# From different domain, try to access API
curl -H "Origin: https://example.com" \
     -I https://api.getcourses.net/api/admin/orders
# Should be blocked by CORS (or allowed if configured)
```

### Test 3: Admin Route Access

**If authentication enabled:**
```bash
curl -I https://getcourses.net/admin
# Expected: HTTP 401 Unauthorized (without credentials)
```

---

## 📈 Performance Testing

### Test 1: Load Time

**Steps:**
1. Open DevTools → Network tab
2. Hard refresh admin dashboard (Ctrl+Shift+R)
3. Check DOMContentLoaded time

**Expected:**
- ✅ < 2 seconds initial load
- ✅ < 500ms for subsequent navigations

### Test 2: Bundle Size

```bash
ls -lh /root/clone-app/.next/static/chunks/
# Check JavaScript bundle sizes
```

**Expected:**
- ✅ Total bundle < 500KB (gzipped)

### Test 3: Real-time Update Latency

**With backend running:**
- Progress update → UI refresh: < 100ms
- Status change → UI update: < 100ms

---

## ✅ Final Verification

### Critical Checks

- [x] ✅ Build successful (0 TypeScript errors)
- [x] ✅ PM2 process running
- [x] ✅ Homepage accessible (HTTP 200)
- [x] ✅ Admin dashboard accessible (HTTP 200)
- [x] ✅ Environment files configured
- [x] ✅ Logs directory created
- [ ] ⏳ Backend API connected (pending backend configuration)
- [ ] ⏳ WebSocket connection working (pending backend)
- [ ] ⏳ Real-time updates working (pending backend)

### Configuration Files

- [x] ✅ `.env.production` created
- [x] ✅ `.env.local` created
- [x] ✅ `ecosystem.config.js` updated
- [x] ✅ `lib/config.ts` created
- [ ] ⏳ Nginx frontend config (needs setup)
- [ ] ⏳ Nginx backend config (needs setup)

---

## 🐛 Known Issues & Solutions

### Issue 1: WebSocket shows "Disconnected"

**Cause:** Backend Socket.io server not running or CORS not configured

**Solution:**
1. Check backend is running: `pm2 status`
2. Verify CORS allows `getcourses.net`
3. Check Nginx WebSocket proxy configuration

### Issue 2: API returns mock data

**Cause:** API routes still using mock data (by design for testing)

**Solution:**
1. Edit `/root/clone-app/app/api/admin/orders/route.ts`
2. Replace mock queries with Sequelize database queries
3. See `DEPLOYMENT_GUIDE.md` for examples

### Issue 3: 404 on admin page

**Cause:** Old build cached or PM2 not restarted

**Solution:**
```bash
cd /root/clone-app
npm run build
pm2 restart getcourses-frontend
```

---

## 📞 Support Commands

```bash
# View frontend logs
pm2 logs getcourses-frontend

# View all logs
pm2 logs

# Restart frontend
pm2 restart getcourses-frontend

# Check status
pm2 status

# Monitor resources
pm2 monit

# Test endpoints
curl http://localhost:4000
curl http://localhost:4000/admin
curl http://localhost:4000/api/admin/orders

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

**Testing Status:** ✅ Core Functionality Verified  
**Next Step:** Configure backend API and test real-time updates  
**Last Updated:** January 14, 2026
