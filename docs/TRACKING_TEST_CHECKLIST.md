# Tracking Test Checklist

Quick checklist for testing all tracking events.

---

## Pre-Test Setup

- [ ] `.env.local` file exists with all IDs
- [ ] `NEXT_PUBLIC_ENABLE_TRACKING=true` (for dev testing)
- [ ] Dev server running: `npm run dev`
- [ ] Browser DevTools open (F12)
- [ ] Console tab visible

---

## Test 1: Basic Setup ✅

### GTM Loading
- [ ] Visit `http://localhost:4000`
- [ ] Check Network tab for `gtm.js` (200 status)
- [ ] Run `window.dataLayer` in console
- [ ] Should see array with events

### GA4 Loading
- [ ] Check Network tab for GA4 requests
- [ ] No console errors related to GA4

### DataLayer
- [ ] `window.dataLayer` exists
- [ ] Contains initial events

---

## Test 2: Page View ✅

- [ ] Visit homepage
- [ ] Console shows: `[PageViewTracker] Page view tracked: /`
- [ ] `window.dataLayer` contains `page_view` event
- [ ] Navigate to different page
- [ ] New `page_view` event fires

---

## Test 3: User Properties ✅

- [ ] Visit homepage
- [ ] `window.dataLayer` contains `set_user_properties` event
- [ ] Properties include: user_type, device_type, browser, traffic_source

---

## Test 4: ViewContent ✅

- [ ] Visit homepage
- [ ] Scroll to Hero section (form visible)
- [ ] Wait 3+ seconds
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'view_content', ... }`
- [ ] `window.dataLayer` contains `view_content` event

---

## Test 5: FormStart ✅

- [ ] Visit homepage
- [ ] Click on email input field
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'form_start', ... }`
- [ ] `window.dataLayer` contains `form_start` event
- [ ] Click email input again - event should NOT fire (duplicate prevention)

---

## Test 6: FormSubmit ✅

### Form Submit (Before API)
- [ ] Fill form: email + course URL
- [ ] Click submit button
- [ ] **IMMEDIATELY** check console (before API completes)
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'form_submit', ... }`
- [ ] `window.dataLayer` contains `form_submit` event

### Form Submit Success
- [ ] After API success
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'form_submit_success', ... }`
- [ ] Event includes: course_count, valid_courses

### Form Submit Error
- [ ] Submit form with invalid URL
- [ ] After API error
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'form_submit_error', ... }`
- [ ] Event includes: error_message

---

## Test 7: BeginCheckout ✅

- [ ] Submit form successfully (modal opens)
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'begin_checkout', ... }`
- [ ] Event includes: currency, value, items array, transaction_id
- [ ] Items array has correct structure

---

## Test 8: Purchase ✅

- [ ] Complete payment flow
- [ ] Order created successfully
- [ ] Console shows: `[Tracking] Event pushed to dataLayer: { event: 'purchase', ... }`
- [ ] Event includes: transaction_id, value, currency, items, payment_type
- [ ] Event includes: email_hash (SHA-256, not plain email)

---

## Platform Testing

### GTM Preview
- [ ] Open GTM Preview mode
- [ ] Connect to site
- [ ] Navigate through site
- [ ] Check Tags panel - tags firing
- [ ] Check Data Layer panel - events visible

### GA4 DebugView
- [ ] Enable debug mode
- [ ] Visit site
- [ ] Check GA4 DebugView
- [ ] Events appear in real-time

### Facebook Events Manager
- [ ] Open Test Events
- [ ] Visit site
- [ ] Events appear in real-time

---

## Final Verification

Run this in console:

```javascript
// Quick verification script
const events = window.dataLayer?.map(e => e.event).filter(Boolean) || [];
const required = [
  'page_view',
  'set_user_properties',
  'view_content',
  'form_start',
  'form_submit',
  'begin_checkout',
  'purchase'
];

required.forEach(event => {
  const found = events.includes(event);
  console.log(`${found ? '✅' : '❌'} ${event}: ${found ? 'Found' : 'Missing'}`);
});
```

---

## Test Results

**Date:** ___________

**All Tests Pass:** [ ] Yes [ ] No

**Issues Found:**
1. ___________
2. ___________

**Ready for Phase 4:** [ ] Yes [ ] No

---

## Notes

___________
___________
