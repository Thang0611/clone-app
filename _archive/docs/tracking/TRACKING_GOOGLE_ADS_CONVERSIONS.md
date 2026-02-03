# Google Ads Conversions Setup Guide

Step-by-step guide to set up conversions in Google Ads (via GA4 import or manual setup).

---

## Prerequisites

- ✅ GA4 property is set up and tracking events
- ✅ Google Ads account is created
- ✅ GA4 is linked to Google Ads account
- ✅ You have admin access to Google Ads

---

## Method 1: Import from GA4 (Recommended)

### Step 1: Link GA4 to Google Ads

1. **Go to:** Google Ads → Tools & Settings → Linked accounts
2. **Find:** Google Analytics (GA4)
3. **Click:** Details → Link
4. **Select:** Your GA4 property
5. **Click:** Link accounts

**OR** (From GA4):
1. **Go to:** GA4 → Admin → Google Ads Links
2. **Click:** Link → Select Google Ads account
3. **Click:** Confirm

---

### Step 2: Import Conversions

1. **Go to:** Google Ads → Tools & Settings → Conversions
2. **Click:** `+` (New conversion action)
3. **Select:** `Import`
4. **Select:** `Google Analytics 4`
5. **Choose:** Your GA4 property
6. **Select conversions to import:**
   - ✅ `purchase` (Primary conversion)
   - ⚪ `begin_checkout` (Optional)
   - ⚪ `form_submit` (Optional)

7. **Click:** Import and continue

---

### Step 3: Configure Imported Conversions

For each imported conversion:

1. **Click on conversion** to edit
2. **Category:** 
   - `purchase` → `Purchase`
   - `begin_checkout` → `Add to cart`
   - `form_submit` → `Submit lead form`

3. **Value:**
   - `purchase` → Use different values for each conversion
   - Others → Don't use a value

4. **Count:**
   - `purchase` → `One` (count once per transaction)
   - Others → `Every` (count every occurrence)

5. **Attribution Model:**
   - Recommended: `Data-driven` (if available)
   - Alternative: `Last click`

6. **Click:** Save

---

## Method 2: Manual Setup (Alternative)

If you prefer manual setup or need more control:

### Step 1: Create Conversion Action

1. **Go to:** Google Ads → Conversions
2. **Click:** `+` (New conversion action)
3. **Select:** `Website`
4. **Category:** `Purchase`

### Step 2: Configure Conversion

1. **Conversion Name:** `Purchase - Confirmed Payment`
2. **Value:**
   - **Use different values:** Yes
   - **Value:** Use the value from your tag
   - **Currency:** `VND`

3. **Count:**
   - **How many:** `One` (count once per transaction)

4. **Attribution Model:**
   - **Model:** `Data-driven` (recommended)
   - **Or:** `Last click`

5. **Click-through conversion window:** `30 days`
6. **View-through conversion window:** `1 day`

### Step 3: Get Conversion Tag

1. **After creating conversion**, you'll get:
   - **Conversion ID:** `AW-XXXXXXXXX`
   - **Conversion Label:** `AbCdEfGhIj`

2. **Add to GTM** (if using GTM):
   - Create Google Ads Conversion Tracking tag
   - Use Conversion ID and Label
   - Trigger on `purchase` event

**OR** (If not using GTM):
- Add conversion tag directly to site
- Fire on purchase confirmation

---

## Method 3: Enhanced Conversions (Recommended)

### Setup Enhanced Conversions

1. **Go to:** Google Ads → Conversions
2. **Select:** Your conversion action
3. **Click:** Edit settings
4. **Enable:** Enhanced conversions
5. **Choose:** 
   - `Automatic collection` (recommended)
   - OR `Manual collection` (if you want more control)

### Benefits

- Better attribution
- More accurate conversion tracking
- Improved optimization

---

## Conversion Optimization

### For Google Ads Campaigns:

1. **Go to:** Google Ads → Campaigns
2. **Create Campaign** → Conversion campaign
3. **Bidding Strategy:**
   - **Target CPA** (if you have conversion data)
   - **Maximize conversions** (if starting out)
   - **Target ROAS** (if tracking revenue)

4. **Conversion Action:** Select your `purchase` conversion

---

## Verification

### Test Conversion Tracking

1. **Complete a test purchase**
2. **Wait 24-48 hours** (conversions may take time to appear)
3. **Go to:** Google Ads → Conversions
4. **Check:** Conversion count should increase

### Real-Time Verification

1. **Go to:** Google Ads → Tools & Settings → Conversions
2. **Select:** Your conversion
3. **Check:** Recent conversions (may take a few hours)

---

## Best Practices

### Conversion Settings

- ✅ Use `purchase` as primary conversion
- ✅ Set value to track revenue
- ✅ Use "One" count for purchases
- ✅ Use data-driven attribution
- ✅ Enable enhanced conversions

### Campaign Optimization

- ✅ Start with "Maximize conversions"
- ✅ Switch to "Target CPA" after 30+ conversions
- ✅ Use "Target ROAS" if tracking revenue
- ✅ Monitor conversion quality

---

## Troubleshooting

### Conversions Not Importing

**Check:**
1. GA4 is linked to Google Ads
2. Events are firing in GA4
3. Event names match exactly
4. Enough time has passed (24-48 hours)

### Wrong Conversion Values

**Check:**
1. `value` parameter is sent in GA4 events
2. Value is a number (not string)
3. Currency is correct

### Conversions Not Optimizing

**Check:**
1. Enough conversions (usually 30+)
2. Conversion action is selected in campaign
3. Bidding strategy is set correctly

---

## Summary

✅ **Method 1 (Recommended):** Import from GA4  
✅ **Method 2:** Manual setup with conversion tag  
✅ **Enhanced Conversions:** Enable for better tracking  
✅ **Optimization:** Use in campaign bidding  

---

**Next:** Test and verify all conversions are working
