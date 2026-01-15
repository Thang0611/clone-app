#!/bin/bash

# Tracking Test Script
# This script helps verify tracking setup

echo "=========================================="
echo "Tracking System Test Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
echo "1. Checking environment variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check for required variables
    if grep -q "NEXT_PUBLIC_GTM_ID" .env.local; then
        GTM_ID=$(grep "NEXT_PUBLIC_GTM_ID" .env.local | cut -d '=' -f2)
        if [ -z "$GTM_ID" ]; then
            echo -e "${RED}✗${NC} NEXT_PUBLIC_GTM_ID is empty"
        else
            echo -e "${GREEN}✓${NC} NEXT_PUBLIC_GTM_ID is set: $GTM_ID"
        fi
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_GTM_ID not found"
    fi
    
    if grep -q "NEXT_PUBLIC_GA4_ID" .env.local; then
        GA4_ID=$(grep "NEXT_PUBLIC_GA4_ID" .env.local | cut -d '=' -f2)
        if [ -z "$GA4_ID" ]; then
            echo -e "${RED}✗${NC} NEXT_PUBLIC_GA4_ID is empty"
        else
            echo -e "${GREEN}✓${NC} NEXT_PUBLIC_GA4_ID is set: $GA4_ID"
        fi
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_GA4_ID not found"
    fi
    
    if grep -q "NEXT_PUBLIC_META_PIXEL_ID" .env.local; then
        PIXEL_ID=$(grep "NEXT_PUBLIC_META_PIXEL_ID" .env.local | cut -d '=' -f2)
        if [ -z "$PIXEL_ID" ]; then
            echo -e "${RED}✗${NC} NEXT_PUBLIC_META_PIXEL_ID is empty"
        else
            echo -e "${GREEN}✓${NC} NEXT_PUBLIC_META_PIXEL_ID is set: $PIXEL_ID"
        fi
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_META_PIXEL_ID not found"
    fi
    
    # Check tracking enabled
    if grep -q "NEXT_PUBLIC_ENABLE_TRACKING=true" .env.local; then
        echo -e "${GREEN}✓${NC} Tracking enabled for development"
    else
        echo -e "${YELLOW}⚠${NC} Tracking may be disabled (NEXT_PUBLIC_ENABLE_TRACKING not set to true)"
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    echo "   Create .env.local from .env.local.example"
fi

echo ""

# Check if node_modules exists
echo "2. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    
    # Check for @next/third-parties
    if [ -d "node_modules/@next/third-parties" ]; then
        echo -e "${GREEN}✓${NC} @next/third-parties installed"
    else
        echo -e "${RED}✗${NC} @next/third-parties not found"
        echo "   Run: npm install @next/third-parties"
    fi
else
    echo -e "${RED}✗${NC} node_modules not found"
    echo "   Run: npm install"
fi

echo ""

# Check if tracking files exist
echo "3. Checking tracking files..."
TRACKING_FILES=(
    "lib/tracking.ts"
    "lib/tracking-config.ts"
    "hooks/useTracking.ts"
    "components/GoogleTagManager.tsx"
    "components/GoogleAnalytics.tsx"
    "components/PageViewTracker.tsx"
    "components/UserPropertiesTracker.tsx"
)

for file in "${TRACKING_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file not found"
    fi
done

echo ""

# Check if dev server is running
echo "4. Checking if dev server is running..."
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Dev server is running on port 4000"
    echo "   Visit: http://localhost:4000"
else
    echo -e "${YELLOW}⚠${NC} Dev server not running on port 4000"
    echo "   Start with: npm run dev"
fi

echo ""

# Summary
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open http://localhost:4000 in browser"
echo "2. Open DevTools (F12)"
echo "3. Check Console for [Tracking] logs"
echo "4. Run: window.dataLayer in console"
echo "5. Follow TRACKING_TEST_GUIDE.md for detailed testing"
echo ""
echo "For detailed testing instructions, see:"
echo "  - docs/TRACKING_TEST_GUIDE.md"
echo "  - docs/TRACKING_TEST_CHECKLIST.md"
echo ""
