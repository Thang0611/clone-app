#!/bin/bash

echo "🔄 Restarting Next.js Dev Server..."
echo ""

cd /root/project/clone-app || exit 1

# Kill existing server
echo "1. Stopping existing server..."
lsof -ti:4000 | xargs kill -9 2>/dev/null
sleep 2

# Verify port is free
if lsof -ti:4000 > /dev/null 2>&1; then
  echo "   ⚠️  Port still in use, trying again..."
  sleep 2
  lsof -ti:4000 | xargs kill -9 2>/dev/null
fi

echo "   ✅ Server stopped"
echo ""

# Clear cache
echo "2. Clearing Next.js cache..."
rm -rf .next
echo "   ✅ Cache cleared"
echo ""

# Start server
echo "3. Starting server..."
echo "   Logs will be shown below..."
echo "   Press Ctrl+C to stop"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

NODE_ENV=development npm run dev
