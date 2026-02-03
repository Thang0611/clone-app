# Meta Pixel Tracking Test Guide

Quick guide to test Meta Pixel tracking functionality.

---

## Quick Test (2 minutes)

### Option 1: CLI Test (Recommended)

Run the command-line test script:

```bash
node scripts/test-pixel-tracking-cli.js
```

This will check:
- ✅ Environment variables configured
- ✅ Tracking files exist
- ✅ Dev server running
- ✅ Configuration correct

### Option 2: Browser Console Test

1. **Start dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser**:
   - Visit: `http://localhost:4000`
   - Open DevTools (F12)
   - Go to Console tab

3. **Run test script**:
   - Open `scripts/test-pixel-tracking.js`
   - Copy all content
   - Paste into browser console
   - Press Enter

4. **Check results**:
   - Should see detailed test results
   - ✅ = Working correctly
   - ⚠️ = Warning (may be OK)
   - ❌ = Error (needs fixing)

---

## Detailed Testing

### Step 1: Verify Setup

```bash
# Run CLI test
node scripts/test-pixel-tracking-cli.js

# Should show:
# ✓ .env.local file exists
# ✓ NEXT_PUBLIC_META_PIXEL_ID is set
# ✓ Tracking enabled for development
# ✓ All tracking files exist
```

### Step 2: Test in Browser

1. **Open site**: `http://localhost:4000`
2. **Open DevTools** (F12)
3. **Check Console**:
   ```javascript
   // Check dataLayer
   window.dataLayer
   
   // Should see array with events like:
   // [{ event: 'gtm.js', ... }, { event: 'page_view', ... }]
   ```

4. **Check Network tab**:
   - Filter: `fbevents.js` (Meta Pixel script)
   - Filter: `facebook.com/tr` (Meta Pixel tracking requests)
   - Filter: `gtm.js` (Google Tag Manager)

5. **Run browser test**:
   - Paste `scripts/test-pixel-tracking.js` in console
   - Review test results

### Step 3: Test Events

#### Test Page View
- Navigate between pages
- Check console: `[PageViewTracker] Page view tracked: /path`
- Check dataLayer: `window.dataLayer.filter(e => e.event === 'page_view')`

#### Test View Content
- Visit homepage
- Scroll to form
- Wait 3+ seconds
- Check console: `[Tracking] Event pushed to dataLayer: { event: 'view_content', ... }`

#### Test Form Start
- Click on email input field
- Check console: `[Tracking] Event pushed to dataLayer: { event: 'form_start', ... }`

#### Test Form Submit
- Fill form and submit
- Check console: `[Tracking] Event pushed to dataLayer: { event: 'form_submit', ... }`

#### Test Checkout
- After form submit (modal opens)
- Check console: `[Tracking] Event pushed to dataLayer: { event: 'begin_checkout', ... }`

#### Test Purchase
- Complete payment flow
- Check console: `[Tracking] Event pushed to dataLayer: { event: 'purchase', ... }`

---

## Verify Meta Pixel is Working

### Method 1: Browser Extensions

Install **Facebook Pixel Helper** (Chrome extension):
1. Install from Chrome Web Store
2. Visit your site
3. Click extension icon
4. Should show:
   - ✅ Pixel ID detected
   - ✅ Events firing
   - ⚠️ Any errors

### Method 2: Facebook Events Manager

1. Go to: https://business.facebook.com/events_manager2/
2. Select your Pixel
3. Go to **Test Events** tab
4. Visit your site and perform actions
5. Should see events in real-time:
   - `PageView`
   - `ViewContent`
   - `Lead` (from form_submit)
   - `InitiateCheckout`
   - `Purchase`

### Method 3: Network Tab

1. Open DevTools > Network tab
2. Filter: `facebook.com/tr`
3. Perform actions on site
4. Should see requests like:
   ```
   https://www.facebook.com/tr?id=123456789&ev=PageView&...
   ```

### Method 4: Console Check

```javascript
// Check if Meta Pixel is loaded
typeof window.fbq !== 'undefined'
// Should return: true

// Test Meta Pixel directly
window.fbq('track', 'TestEvent', { test: true })
// Should not throw error

// Check dataLayer for events
window.dataLayer.filter(e => e.event)
// Should show array of events
```

---

## Troubleshooting

### Issue: Meta Pixel not loaded

**Symptoms:**
- `typeof window.fbq === 'undefined'`
- No `fbevents.js` in Network tab

**Solutions:**
1. Check GTM is configured (if using GTM):
   - Verify GTM container ID is correct
   - Check GTM container is published
   - Verify Meta Pixel tags are created in GTM

2. Check environment variables:
   ```bash
   # .env.local should have:
   NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
   NEXT_PUBLIC_ENABLE_TRACKING=true
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

### Issue: Events not firing

**Symptoms:**
- Events in dataLayer but not in Facebook
- No requests to `facebook.com/tr`

**Solutions:**
1. Check GTM tags are configured:
   - Meta Pixel base code tag
   - Event tags (ViewContent, Lead, etc.)
   - Triggers are set correctly

2. Check GTM Preview mode:
   - Open GTM Preview
   - Visit your site
   - Verify tags fire on events

3. Check Pixel ID:
   - Verify Pixel ID is correct
   - Check Facebook Events Manager

### Issue: Events missing data

**Symptoms:**
- Events fire but missing parameters
- Empty `items` array

**Solutions:**
1. Check event data in dataLayer:
   ```javascript
   window.dataLayer.filter(e => e.event === 'purchase')
   // Check if items array is populated
   ```

2. Verify tracking functions are called with correct data
3. Check console for errors

---

## Test Scripts

### CLI Test
```bash
node scripts/test-pixel-tracking-cli.js
```

### Browser Console Test
Paste in browser console:
```javascript
// See scripts/test-pixel-tracking.js
```

### GTM Verification
Paste in browser console:
```javascript
// See docs/TRACKING_GTM_VERIFICATION.js
```

---

## Expected Results

### ✅ All Tests Pass

- Environment variables configured
- Tracking files exist
- Dev server running
- dataLayer initialized
- Events firing correctly
- Meta Pixel loaded (via GTM or direct)
- Events visible in Facebook Events Manager

### ⚠️ Warnings (May be OK)

- Meta Pixel not loaded directly (OK if using GTM)
- Some events missing (OK if not yet triggered)
- GTM not loaded (OK if using direct pixel)

### ❌ Errors (Need Fixing)

- Environment variables missing
- Tracking files missing
- dataLayer not initialized
- Meta Pixel not loading
- Events not firing

---

## Next Steps

Once tests pass:

1. ✅ Configure GTM tags (if using GTM)
   - Follow: `docs/TRACKING_PHASE4_GTM_CONFIG.md`

2. ✅ Verify in Facebook Events Manager
   - Check Test Events tab
   - Verify events are received

3. ✅ Set up conversions
   - Follow: `docs/TRACKING_FACEBOOK_CONVERSIONS.md`

4. ✅ Test in production
   - Deploy to production
   - Verify tracking works
   - Check Facebook Events Manager

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify environment variables
3. Check GTM/GA4/Meta Pixel dashboards
4. Review code comments in tracking files
5. See `docs/TRACKING_TEST_GUIDE.md` for detailed testing

---

## Quick Reference

| Test | Command | Location |
|------|---------|----------|
| CLI Test | `node scripts/test-pixel-tracking-cli.js` | Terminal |
| Browser Test | Paste `scripts/test-pixel-tracking.js` | Browser Console |
| GTM Test | Paste `docs/TRACKING_GTM_VERIFICATION.js` | Browser Console |
| Full Guide | See `docs/TRACKING_TEST_GUIDE.md` | Documentation |
