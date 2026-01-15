# Tracking Testing Guide

Complete testing guide to verify all tracking events are working correctly before Phase 4.

---

## Prerequisites

Before testing, ensure:

1. ✅ **Environment Variables Set**
   ```bash
   # Check .env.local exists and has:
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
   NEXT_PUBLIC_ENABLE_TRACKING=true  # Enable for testing
   ```

2. ✅ **Development Server Running**
   ```bash
   npm run dev
   ```

3. ✅ **Browser Extensions Installed**
   - Google Tag Assistant Legacy (Chrome)
   - Facebook Pixel Helper (Chrome)
   - GA Debugger (Chrome) - Optional

---

## Testing Checklist

### ✅ Phase 1: Basic Setup

#### Test 1.1: GTM Loading
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Visit `http://localhost:4000`
- [ ] Check for `gtm.js` request (should return 200)
- [ ] Check Console for: `[Tracking]` logs
- [ ] Run `window.dataLayer` in console - should show array with events

**Expected Result:**
```javascript
window.dataLayer
// Should show array with events like:
// [{ event: 'gtm.js', ... }, { event: 'set_user_properties', ... }, { event: 'page_view', ... }]
```

#### Test 1.2: GA4 Loading
- [ ] Check Network tab for `analytics.js` or GA4 requests
- [ ] Check Console - no errors related to GA4
- [ ] Verify GA4 ID is correct in `.env.local`

#### Test 1.3: DataLayer Initialization
- [ ] Open Console
- [ ] Type: `window.dataLayer`
- [ ] Should see array with at least:
  - `gtm.js` event
  - `set_user_properties` event
  - `page_view` event

---

### ✅ Phase 2: Page View Tracking

#### Test 2.1: Initial Page Load
- [ ] Visit homepage
- [ ] Check Console for: `[PageViewTracker] Page view tracked: /`
- [ ] Check `window.dataLayer` for `page_view` event
- [ ] Verify event has:
  - `event: 'page_view'`
  - `page_path: '/'`
  - `page_title` (should match page title)

#### Test 2.2: Route Navigation
- [ ] Click on navigation links (if any)
- [ ] Navigate to different pages
- [ ] Check Console for each route change
- [ ] Verify `page_view` events fire for each route

**Expected Console Output:**
```
[PageViewTracker] Page view tracked: /
[PageViewTracker] Page view tracked: /courses
[PageViewTracker] Page view tracked: /track-order
```

---

### ✅ Phase 3: User Properties Tracking

#### Test 3.1: Automatic Detection
- [ ] Visit homepage
- [ ] Check `window.dataLayer` for `set_user_properties` event
- [ ] Verify properties include:
  - `user_type: 'new'` or `'returning'`
  - `device_type: 'desktop' | 'mobile' | 'tablet'`
  - `browser: 'chrome' | 'safari' | 'firefox' | 'edge'`
  - `traffic_source: 'direct' | 'facebook' | 'google' | etc.`

**Expected dataLayer Event:**
```javascript
{
  event: 'set_user_properties',
  user_properties: {
    user_type: 'new',
    device_type: 'desktop',
    browser: 'chrome',
    traffic_source: 'direct'
  }
}
```

---

### ✅ Phase 4: ViewContent Tracking

#### Test 4.1: Form in Viewport
- [ ] Visit homepage
- [ ] Scroll to Hero section (form should be visible)
- [ ] Wait 3+ seconds
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'view_content', ... }`
- [ ] Check `window.dataLayer` for `view_content` event

**Expected Event:**
```javascript
{
  event: 'view_content',
  content_type: 'course_form',
  content_name: 'main_hero_form',
  content_category: 'education'
}
```

**Note:** This event fires only once per page load (after 3 seconds in viewport).

---

### ✅ Phase 5: FormStart Tracking

#### Test 5.1: Email Input Focus
- [ ] Visit homepage
- [ ] Click on email input field
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'form_start', ... }`
- [ ] Check `window.dataLayer` for `form_start` event

**Expected Event:**
```javascript
{
  event: 'form_start',
  form_id: 'hero_course_form',
  form_name: 'Course Request Form',
  form_location: 'hero_section'
}
```

**Note:** This should only fire once per session (duplicate prevention).

#### Test 5.2: Duplicate Prevention
- [ ] Focus email input again
- [ ] Verify event does NOT fire again (check console)
- [ ] This confirms duplicate prevention is working

---

### ✅ Phase 6: FormSubmit Tracking

#### Test 6.1: Form Submission (Before API)
- [ ] Fill out form:
  - Email: `test@example.com`
  - Course Links: `https://www.udemy.com/course/test/`
- [ ] Click "Kiểm tra khóa học" button
- [ ] **IMMEDIATELY** check Console (before API completes)
- [ ] Should see: `[Tracking] Event pushed to dataLayer: { event: 'form_submit', ... }`

**Expected Event:**
```javascript
{
  event: 'form_submit',
  form_id: 'hero_course_form',
  form_name: 'Course Request Form',
  form_location: 'hero_section',
  course_count: 1
}
```

#### Test 6.2: Form Submit Success
- [ ] After API completes successfully
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'form_submit_success', ... }`
- [ ] Verify event includes:
  - `course_count: 1` (or number of URLs submitted)
  - `valid_courses: 1` (or number of valid courses)

**Expected Event:**
```javascript
{
  event: 'form_submit_success',
  form_id: 'hero_course_form',
  course_count: 1,
  valid_courses: 1
}
```

#### Test 6.3: Form Submit Error
- [ ] Submit form with invalid URL (e.g., `not-a-url`)
- [ ] Wait for API error
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'form_submit_error', ... }`
- [ ] Verify event includes `error_message`

**Expected Event:**
```javascript
{
  event: 'form_submit_error',
  form_id: 'hero_course_form',
  error_message: 'Error message here'
}
```

---

### ✅ Phase 7: BeginCheckout Tracking

#### Test 7.1: Modal Opens with Courses
- [ ] Submit form successfully (should open modal)
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'begin_checkout', ... }`
- [ ] Verify event includes:
  - `currency: 'VND'`
  - `value: [total amount]`
  - `items: [array of course items]`
  - `transaction_id: 'temp_...'`

**Expected Event:**
```javascript
{
  event: 'begin_checkout',
  currency: 'VND',
  value: 2000,
  items: [
    {
      item_id: '12345',
      item_name: 'Course Title',
      item_category: 'education',
      item_brand: 'Udemy',
      price: 2000,
      quantity: 1
    }
  ],
  transaction_id: 'temp_1234567890'
}
```

**Note:** This fires when modal opens AND courses are loaded.

---

### ✅ Phase 8: Purchase Tracking

#### Test 8.1: Order Creation Success
- [ ] Complete full flow:
  1. Submit form
  2. Modal opens
  3. Click payment button
  4. Order created successfully
- [ ] Check Console for: `[Tracking] Event pushed to dataLayer: { event: 'purchase', ... }`
- [ ] Verify event includes:
  - `transaction_id: 'ORD_...'` (actual order code)
  - `value: [total amount]`
  - `currency: 'VND'`
  - `items: [array]`
  - `payment_type: 'bank_transfer'`
  - `email_hash: '[sha256 hash]'`

**Expected Event:**
```javascript
{
  event: 'purchase',
  transaction_id: 'ORD_ABC123',
  value: 2000,
  currency: 'VND',
  tax: 0,
  shipping: 0,
  items: [
    {
      item_id: '12345',
      item_name: 'Course Title',
      item_category: 'education',
      item_brand: 'Udemy',
      price: 2000,
      quantity: 1
    }
  ],
  payment_type: 'bank_transfer',
  email_hash: 'sha256_hash_here'
}
```

**Note:** Email should be hashed (SHA-256), not plain text.

---

## Platform-Specific Testing

### Google Tag Manager (GTM) Preview Mode

#### Setup:
1. Go to https://tagmanager.google.com/
2. Select your container
3. Click "Preview" button
4. Enter your site URL: `http://localhost:4000`
5. Click "Connect"

#### Testing:
- [ ] GTM Preview window opens
- [ ] Navigate through your site
- [ ] Check "Tags" panel - should see tags firing
- [ ] Check "Variables" panel - should see dataLayer variables
- [ ] Check "Data Layer" panel - should see all events

**Expected Tags:**
- Google Analytics: Configuration
- Meta Pixel: PageView, Lead, InitiateCheckout, Purchase

---

### Google Analytics 4 (GA4) DebugView

#### Setup:
1. Go to https://analytics.google.com/
2. Select your GA4 property
3. Go to Admin > DebugView
4. Enable debug mode (add `?debug_mode=true` to URL or use GA Debugger extension)

#### Testing:
- [ ] Visit site with debug mode enabled
- [ ] Go to GA4 DebugView
- [ ] Should see real-time events
- [ ] Verify events:
  - `page_view`
  - `view_content`
  - `form_start`
  - `form_submit`
  - `begin_checkout`
  - `purchase`

**Expected Events in DebugView:**
```
page_view
view_content
form_start
form_submit
form_submit_success
begin_checkout
purchase
```

---

### Facebook Events Manager

#### Setup:
1. Go to https://business.facebook.com/events_manager2/
2. Select your Pixel
3. Go to "Test Events" tab

#### Testing:
- [ ] Visit your site
- [ ] Check Test Events panel
- [ ] Should see events in real-time
- [ ] Verify events:
  - `PageView`
  - `ViewContent`
  - `Lead` (from form_submit)
  - `InitiateCheckout`
  - `Purchase`

**Note:** Events may be mapped differently in Facebook (e.g., `form_submit` → `Lead`).

---

## Quick Test Script

Run this in browser console to test all events:

```javascript
// Test 1: Check dataLayer exists
console.log('DataLayer exists:', typeof window.dataLayer !== 'undefined');
console.log('DataLayer length:', window.dataLayer?.length || 0);

// Test 2: List all events
console.log('All events:', window.dataLayer?.map(e => e.event).filter(Boolean));

// Test 3: Check specific events
const events = window.dataLayer?.map(e => e.event).filter(Boolean) || [];
console.log('Has page_view:', events.includes('page_view'));
console.log('Has set_user_properties:', events.includes('set_user_properties'));
console.log('Has view_content:', events.includes('view_content'));
console.log('Has form_start:', events.includes('form_start'));
console.log('Has form_submit:', events.includes('form_submit'));
console.log('Has begin_checkout:', events.includes('begin_checkout'));
console.log('Has purchase:', events.includes('purchase'));

// Test 4: Check latest event
const latestEvent = window.dataLayer?.[window.dataLayer.length - 1];
console.log('Latest event:', latestEvent);
```

---

## Common Issues & Troubleshooting

### Issue 1: No events in dataLayer

**Symptoms:**
- `window.dataLayer` is empty or undefined
- No console logs

**Solutions:**
1. Check `.env.local` exists and has correct IDs
2. Verify `NEXT_PUBLIC_ENABLE_TRACKING=true` (for dev)
3. Restart dev server: `npm run dev`
4. Clear browser cache and reload

---

### Issue 2: Events fire but not in GTM Preview

**Symptoms:**
- Events in console/dataLayer
- But not showing in GTM Preview

**Solutions:**
1. Check GTM container ID is correct
2. Verify GTM container is published
3. Check GTM Preview connection
4. Verify tags are configured in GTM

---

### Issue 3: Duplicate events

**Symptoms:**
- Same event fires multiple times
- Events in dataLayer appear duplicated

**Solutions:**
1. Check if component re-renders multiple times
2. Verify duplicate prevention logic (form_start, view_content)
3. Check useEffect dependencies

---

### Issue 4: Events missing data

**Symptoms:**
- Events fire but missing required fields
- `items` array is empty

**Solutions:**
1. Check course data structure
2. Verify course URLs are valid
3. Check platform detection logic
4. Verify item_id is string (not number)

---

### Issue 5: Email not hashed

**Symptoms:**
- `email_hash` is empty or undefined
- Plain email in purchase event

**Solutions:**
1. Check `hashEmail()` function
2. Verify email is passed to `trackPurchase()`
3. Check browser supports `crypto.subtle`

---

## Test Results Template

Use this template to document your test results:

```
Date: ___________
Tester: ___________

Phase 1: Basic Setup
[ ] GTM Loading
[ ] GA4 Loading
[ ] DataLayer Initialization

Phase 2: Page View
[ ] Initial Page Load
[ ] Route Navigation

Phase 3: User Properties
[ ] Automatic Detection

Phase 4: ViewContent
[ ] Form in Viewport

Phase 5: FormStart
[ ] Email Input Focus
[ ] Duplicate Prevention

Phase 6: FormSubmit
[ ] Form Submission
[ ] Form Submit Success
[ ] Form Submit Error

Phase 7: BeginCheckout
[ ] Modal Opens

Phase 8: Purchase
[ ] Order Creation

Platform Testing:
[ ] GTM Preview
[ ] GA4 DebugView
[ ] Facebook Events Manager

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## Next Steps

Once all tests pass:

1. ✅ Document any issues found
2. ✅ Fix any bugs
3. ✅ Re-test fixed issues
4. ✅ Proceed to Phase 4: GTM Configuration

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify environment variables
3. Check GTM/GA4/Meta Pixel dashboards
4. Review code comments in tracking files
5. Check `docs/TRACKING_USAGE_GUIDE.md` for usage examples
