# Tracking Quick Start - Testing Guide

Quick guide to test tracking before Phase 4.

---

## 🚀 Quick Test (5 minutes)

### Step 1: Run Test Script
```bash
./scripts/test-tracking.sh
```

This checks:
- ✅ Environment variables
- ✅ Dependencies installed
- ✅ Tracking files exist
- ✅ Dev server running

### Step 2: Open Browser Console Test

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser**:
   - Visit: `http://localhost:4000`
   - Open DevTools (F12)
   - Go to Console tab

3. **Paste test script**:
   - Open `docs/TRACKING_CONSOLE_TEST.js`
   - Copy all content
   - Paste into browser console
   - Press Enter

4. **Check results**:
   - Should see checklist of events
   - ✅ = Event found
   - ❌ = Event missing

---

## 📋 Manual Test Checklist

### Basic Setup (30 seconds)
- [ ] Visit homepage
- [ ] Open Console (F12)
- [ ] Run: `window.dataLayer`
- [ ] Should see array with events

### Page View (10 seconds)
- [ ] Navigate to different page
- [ ] Check console: `[PageViewTracker] Page view tracked: /path`
- [ ] Run: `window.dataLayer.filter(e => e.event === 'page_view')`
- [ ] Should see page_view events

### ViewContent (30 seconds)
- [ ] Visit homepage
- [ ] Scroll to form
- [ ] Wait 3+ seconds
- [ ] Check console: `[Tracking] Event pushed to dataLayer: { event: 'view_content', ... }`

### FormStart (10 seconds)
- [ ] Click on email input
- [ ] Check console: `[Tracking] Event pushed to dataLayer: { event: 'form_start', ... }`

### FormSubmit (1 minute)
- [ ] Fill form: `test@example.com` + `https://www.udemy.com/course/test/`
- [ ] Click submit
- [ ] **IMMEDIATELY** check console (before API completes)
- [ ] Should see: `form_submit` event
- [ ] After API success: `form_submit_success` event

### BeginCheckout (30 seconds)
- [ ] After form submit success (modal opens)
- [ ] Check console: `[Tracking] Event pushed to dataLayer: { event: 'begin_checkout', ... }`

### Purchase (2 minutes)
- [ ] Complete payment flow
- [ ] After order created
- [ ] Check console: `[Tracking] Event pushed to dataLayer: { event: 'purchase', ... }`

---

## 🔍 Quick Verification

Run this in console after testing:

```javascript
// Quick check
const events = window.dataLayer.map(e => e.event).filter(Boolean);
const required = ['page_view', 'view_content', 'form_start', 'form_submit', 'begin_checkout', 'purchase'];
required.forEach(e => console.log(events.includes(e) ? `✅ ${e}` : `❌ ${e}`));
```

---

## 📊 Expected Results

After completing all tests, you should see:

```
✅ page_view
✅ set_user_properties
✅ view_content
✅ form_start
✅ form_submit
✅ form_submit_success
✅ begin_checkout
✅ purchase
```

---

## ⚠️ Common Issues

### No events in dataLayer
- Check `.env.local` exists
- Verify `NEXT_PUBLIC_ENABLE_TRACKING=true`
- Restart dev server

### Events not firing
- Check browser console for errors
- Verify tracking IDs are correct
- Check network tab for GTM/GA4 requests

### Duplicate events
- This is normal for some events
- FormStart should only fire once (duplicate prevention)

---

## 📚 Full Documentation

For detailed testing:
- **Complete Guide**: `docs/TRACKING_TEST_GUIDE.md`
- **Checklist**: `docs/TRACKING_TEST_CHECKLIST.md`
- **Console Test**: `docs/TRACKING_CONSOLE_TEST.js`

---

## ✅ Ready for Phase 4?

Once all tests pass:
1. ✅ All events firing correctly
2. ✅ Data structure correct
3. ✅ No console errors
4. ✅ Events visible in dataLayer

**Then proceed to Phase 4: GTM Configuration**
