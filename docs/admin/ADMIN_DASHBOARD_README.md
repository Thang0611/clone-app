# 🎯 Admin Dashboard - Real-time Download Monitor

**Built:** January 14, 2026  
**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Socket.io Client

---

## 📋 Overview

A professional real-time admin dashboard for monitoring the `udemy-dl` download system. This dashboard provides live progress tracking, system audit logs, and comprehensive order management for paid orders.

## ✨ Features

### 1. **SaaS-Style Layout**
- Clean, professional sidebar navigation
- Dark/light mode friendly (system preference)
- Responsive design with mobile support
- Lucide React icons throughout

### 2. **Real-time Order Monitoring**
- Live WebSocket connection status indicator
- Automatic progress updates without page refresh
- Master table showing all paid orders
- Visual progress bars with percentage display
- Current file name and download speed display

### 3. **Order Details Drawer**
- Slide-over panel from the right
- **Section A: Download Tasks (Visual Layer)**
  - Individual task progress bars
  - Real-time speed indicators (MB/s)
  - Current file name display
  - Status badges with icons
  - Google Drive links for completed tasks
  - Error messages for failed tasks
- **Section B: System Audit Logs (Audit Layer)**
  - Collapsible timeline view
  - Color-coded severity levels (info, warning, error, critical)
  - Category icons (payment 💳, enrollment 📝, download ⬇️, system ⚙️, notification 📧)
  - Detailed event information with expandable details
  - Status transition tracking

### 4. **Dashboard Statistics**
- Total paid orders count
- Processing orders count
- Completed orders count
- Failed orders count
- Real-time connection status

---

## 🗂️ Project Structure

```
/root/clone-app/
├── app/
│   └── admin/
│       ├── page.tsx              # Main admin dashboard page
│       └── layout.tsx            # Admin layout metadata
│   └── api/
│       └── admin/
│           ├── orders/
│           │   ├── route.ts      # GET /api/admin/orders
│           │   └── [orderId]/
│           │       └── logs/
│           │           └── route.ts  # GET /api/admin/orders/:id/logs
│           └── stats/
│               └── route.ts      # GET /api/admin/stats
│
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx      # Sidebar navigation
│       ├── StatsCard.tsx         # Statistics card component
│       ├── StatusBadge.tsx       # Status badge with icons
│       ├── OrderTable.tsx        # Master orders table
│       ├── OrderDetailsDrawer.tsx # Slide-over drawer
│       ├── TaskProgress.tsx      # Task progress card
│       └── LogViewer.tsx         # Audit logs timeline
│
├── hooks/
│   ├── useSocket.ts              # Socket.io client hook
│   └── useAdminOrders.ts         # Orders data + real-time updates
│
└── types/
    └── index.ts                  # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

1. **Backend Server Running** (Node.js + Socket.io + Redis)
   - Server should be running on `http://localhost:3001`
   - WebSocket server initialized
   - Redis Pub/Sub configured

2. **Install Dependencies**
   ```bash
   cd /root/clone-app
   npm install
   ```

### Environment Setup

1. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure Socket.io URL:
   ```env
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

### Run the Dashboard

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit: **http://localhost:4000/admin**

---

## 🔌 WebSocket Integration

### Connection Management

The dashboard uses a custom `useSocket` hook for WebSocket lifecycle:

```typescript
const { socket, isConnected, subscribe, unsubscribe, on, off } = useSocket({
  url: 'http://localhost:3001',
  enabled: true
});
```

### Event Subscriptions

**Subscribe to Order Progress:**
```typescript
subscribe('order', orderId);
```

**Subscribe to Task Progress:**
```typescript
subscribe('task', taskId);
```

**Listen for Updates:**
```typescript
on('progress', (event: ProgressEvent) => {
  console.log(event.data.percent, event.data.currentFile);
});

on('status', (event: StatusEvent) => {
  console.log(event.data.newStatus, event.data.previousStatus);
});
```

### Event Payloads

**Progress Event:**
```json
{
  "scope": "task",
  "id": 456,
  "type": "progress",
  "data": {
    "taskId": 456,
    "percent": 45,
    "currentFile": "Lecture 5.mp4",
    "speed": 2500000,
    "timestamp": 1705234567890
  }
}
```

**Status Event:**
```json
{
  "scope": "task",
  "id": 456,
  "type": "status",
  "data": {
    "taskId": 456,
    "newStatus": "completed",
    "previousStatus": "downloading",
    "timestamp": 1705234567890
  }
}
```

---

## 🎨 UI Components Guide

### StatusBadge
```tsx
<StatusBadge status="downloading" size="md" />
```

**Supported Statuses:**
- `pending` - ⏳ Gray
- `enrolled` - 📝 Purple
- `downloading` - ⬇️ Yellow (animated pulse)
- `processing` - 🔄 Blue
- `completed` - ✅ Green
- `failed` - ❌ Red

### TaskProgress
```tsx
<TaskProgress task={downloadTask} />
```

**Features:**
- Real-time progress bar
- Current file name
- Download speed (MB/s)
- Google Drive link (when completed)
- Error message display (when failed)

### LogViewer
```tsx
<LogViewer orderId={123} />
```

**Features:**
- Timeline layout with colored dots
- Severity filtering (all, info, warning, error, critical)
- Expandable details section
- Status transition tracking
- Source attribution

---

## 🔧 API Endpoints

### 1. Get Paid Orders
```http
GET /api/admin/orders?status=paid&page=1&limit=20
```

**Response:**
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
      },
      "tasks": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 127,
    "totalPages": 7
  }
}
```

### 2. Get Audit Logs
```http
GET /api/admin/orders/123/logs?severity=error
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": 123,
    "logs": [
      {
        "id": 1,
        "order_id": 123,
        "task_id": 1,
        "event_type": "payment_received",
        "event_category": "payment",
        "severity": "info",
        "message": "Payment received: 300000 VND",
        "details": { "amount": 300000, "bank": "MB Bank" },
        "created_at": "2026-01-14T10:30:00Z"
      }
    ],
    "total": 15
  }
}
```

### 3. Get Dashboard Stats
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": {
      "total": 127,
      "pending": 8,
      "processing": 15,
      "completed": 98,
      "failed": 6
    },
    "tasks": {
      "total": 381,
      "pending": 12,
      "enrolled": 23,
      "downloading": 34,
      "completed": 294,
      "failed": 18
    },
    "revenue": {
      "total": 38100000,
      "today": 1500000,
      "thisWeek": 8200000,
      "thisMonth": 15600000
    }
  }
}
```

---

## 🔄 Connecting to Backend

### Replace Mock Data with Real Database

The API routes currently use mock data. To connect to your MySQL database:

**Edit `/root/clone-app/app/api/admin/orders/route.ts`:**

```typescript
// Replace mock data with actual Sequelize query
const { Order, DownloadTask } = require('@/server/models');

const orders = await Order.findAll({
  where: { payment_status: status },
  include: [{
    model: DownloadTask,
    as: 'tasks'
  }],
  order: [['created_at', 'DESC']],
  limit,
  offset: (page - 1) * limit
});
```

**Edit `/root/clone-app/app/api/admin/orders/[orderId]/logs/route.ts`:**

```typescript
const { OrderAuditLog, DownloadTask } = require('@/server/models');

const logs = await OrderAuditLog.findAll({
  where: severity ? { order_id: orderId, severity } : { order_id: orderId },
  include: [{
    model: DownloadTask,
    as: 'task',
    attributes: ['course_url', 'title']
  }],
  order: [['created_at', 'DESC']],
  limit: 100
});
```

---

## 🧪 Testing

### Manual Testing Checklist

**1. Dashboard Loads:**
- [ ] Statistics cards display correctly
- [ ] Orders table populates
- [ ] Connection status shows "Live Updates Active"

**2. Real-time Updates:**
- [ ] Progress bars update without refresh
- [ ] Status badges change dynamically
- [ ] Current file names appear

**3. Order Details:**
- [ ] Drawer opens when clicking a row
- [ ] Task progress cards display
- [ ] Audit logs load when expanded

**4. Empty States:**
- [ ] "No orders found" shows when search returns nothing
- [ ] "No tasks found" shows for empty order
- [ ] "No logs found" shows for empty logs

**5. Error Handling:**
- [ ] API errors display user-friendly messages
- [ ] Connection loss shows "Disconnected" status
- [ ] Failed tasks show error messages

### Simulating Real-time Updates

When the backend isn't running, you can test the UI by modifying the mock data in the API routes to simulate progress changes.

---

## 📝 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* your brand colors */ },
      }
    }
  }
}
```

### Connection Polling

Edit `useAdminOrders` hook to enable auto-refresh:

```typescript
const { orders } = useAdminOrders({
  status: 'paid',
  autoRefresh: true,
  refreshInterval: 30000 // 30 seconds
});
```

---

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem:** Dashboard shows "Disconnected"

**Solutions:**
1. Verify backend server is running on `http://localhost:3001`
2. Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
3. Ensure Socket.io server is initialized in backend `server.js`
4. Check browser console for CORS errors

### API Errors

**Problem:** "Failed to fetch orders"

**Solutions:**
1. Verify API routes are accessible
2. Check database connection in backend
3. Look at browser Network tab for failed requests
4. Ensure models are properly exported in backend

### Progress Not Updating

**Problem:** Progress bars don't update in real-time

**Solutions:**
1. Check WebSocket connection status
2. Verify Redis Pub/Sub is working on backend
3. Ensure Python worker is emitting progress events
4. Check browser console for event subscription logs

---

## 🔒 Security Notes

### Production Considerations

1. **Authentication:**
   - Add admin authentication middleware
   - Implement JWT or session-based auth
   - Protect `/admin` routes

2. **Authorization:**
   - Verify admin permissions
   - Rate limit API endpoints
   - Sanitize user inputs

3. **CORS:**
   - Configure CORS for Socket.io server
   - Whitelist frontend domain

4. **Environment Variables:**
   - Never commit `.env.local` to git
   - Use secure WebSocket (wss://) in production

---

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.1 | React framework |
| react | 19.2.3 | UI library |
| socket.io-client | 4.8.1 | WebSocket client |
| lucide-react | 0.562.0 | Icons |
| tailwindcss | 4.x | Styling |
| typescript | 5.x | Type safety |

---

## 🎯 Next Steps

### Immediate:
1. Replace mock data with real database queries
2. Add authentication to admin routes
3. Test with live backend server

### Future Enhancements:
- [ ] Export order data to CSV
- [ ] Email notifications for failed tasks
- [ ] Order search and filtering
- [ ] Task retry functionality
- [ ] Download speed charts
- [ ] Mobile app version

---

## 📞 Support

For issues or questions:
1. Check `ADMIN.md` for backend integration details
2. Review WebSocket event documentation
3. Check browser console for error logs
4. Verify backend server is running correctly

---

**Built with ❤️ by Senior Frontend Developer**  
**Last Updated:** January 14, 2026
