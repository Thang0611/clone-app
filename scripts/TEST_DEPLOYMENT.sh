#!/bin/bash

# ============================================
# Deployment Testing Script
# Frontend: khoahocgiare.info
# Backend API: api.khoahocgiare.info
# ============================================

set -e  # Exit on error

echo "🚀 Starting Deployment Testing..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo ""
echo "📦 Checking Node.js version..."
node -v
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Node.js is installed${NC}"
else
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run from /root/clone-app${NC}"
    exit 1
fi

# Create logs directory
echo ""
echo "📁 Creating logs directory..."
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Create environment files
echo ""
echo "🔧 Creating environment files..."

cat > .env.production << 'EOF'
NEXT_PUBLIC_SOCKET_URL=https://api.khoahocgiare.info
NEXT_PUBLIC_API_URL=https://api.khoahocgiare.info
EOF

cat > .env.local << 'EOF'
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF

chmod 600 .env.production .env.local
echo -e "${GREEN}✅ Environment files created${NC}"
ls -la .env* | tail -2

# Install dependencies
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules exists, skipping npm install${NC}"
else
    echo "Installing dependencies..."
    npm install
fi

# Build for production
echo ""
echo "🔨 Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Test production build locally
echo ""
echo "🧪 Testing production build locally..."
echo "Starting Next.js server on port 4000..."
echo "Press Ctrl+C after verification (waiting 10 seconds)..."

# Start server in background
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 10

# Test if server is responding
echo ""
echo "Testing HTTP response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo -e "${GREEN}✅ Server is responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Server is not responding properly (HTTP $HTTP_CODE)${NC}"
fi

# Test admin page
echo "Testing admin page..."
ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/admin)
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "304" ]; then
    echo -e "${GREEN}✅ Admin page is accessible (HTTP $ADMIN_CODE)${NC}"
else
    echo -e "${YELLOW}⚠️  Admin page returned HTTP $ADMIN_CODE${NC}"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "=================================="
echo -e "${GREEN}✅ Deployment Testing Complete!${NC}"
echo "=================================="
echo ""
echo "📋 Next Steps:"
echo "1. Deploy with PM2: pm2 start ecosystem.config.js"
echo "2. Save PM2 config: pm2 save"
echo "3. Check status: pm2 status"
echo "4. View logs: pm2 logs khoahocgiare-frontend"
echo ""
echo "🌐 Access URLs:"
echo "  - Production: https://khoahocgiare.info"
echo "  - Admin: https://khoahocgiare.info/admin"
echo "  - Backend API: https://api.khoahocgiare.info"
echo ""
