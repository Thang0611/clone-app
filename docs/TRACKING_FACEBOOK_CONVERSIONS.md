# Facebook Custom Conversions Setup Guide

Step-by-step guide to create custom conversions in Facebook Events Manager.

---

## Prerequisites

- ✅ Meta Pixel is installed and firing events
- ✅ Events are visible in Facebook Events Manager → Test Events
- ✅ You have admin access to Facebook Business Manager

---

## Step 1: Access Events Manager

1. Go to: https://business.facebook.com/events_manager2/
2. Select your Pixel
3. Click on **"Custom Conversions"** in the left sidebar

---

## Step 2: Create Lead Conversion

### Conversion Details

1. **Click:** `Create Custom Conversion`
2. **Conversion Name:** `Form Submit - Lead`
3. **Description:** `Tracks when user submits course request form`

### Event Configuration

1. **Event:** Select `Lead`
2. **URL Contains:** (Leave empty - we'll use event parameters)
3. **Event Parameter:** 
   - **Parameter:** `content_name`
   - **Operator:** `contains`
   - **Value:** `Course Request Form`

**OR** (Simpler option):
- **Event:** `Lead`
- **All URL traffic:** (Leave as default)

### Value Settings

1. **Conversion Value:** `None` (or set a value if you want)
2. **Currency:** `VND` (if setting value)

### Attribution Window

1. **Click-through:** `7 days` (default)
2. **View-through:** `1 day` (default)

### Click Create

---

## Step 3: Create Purchase Conversion

### Conversion Details

1. **Conversion Name:** `Purchase - Confirmed Payment`
2. **Description:** `Tracks confirmed purchases when payment status is paid`

### Event Configuration

1. **Event:** Select `Purchase`
2. **Event Parameter:**
   - **Parameter:** `value`
   - **Operator:** `greater than`
   - **Value:** `0`

### Value Settings

1. **Conversion Value:** `Use the value parameter`
2. **Currency:** `VND`

### Attribution Window

1. **Click-through:** `7 days`
2. **View-through:** `1 day`

### Click Create

---

## Step 4: Verify Conversions

### Test Conversion 1: Lead

1. **Go to:** Custom Conversions → `Form Submit - Lead`
2. **Visit your site**
3. **Submit the form**
4. **Go back to:** Custom Conversions
5. **Check:** Should see conversion count increase

### Test Conversion 2: Purchase

1. **Go to:** Custom Conversions → `Purchase - Confirmed Payment`
2. **Complete a test purchase**
3. **Wait for payment confirmation**
4. **Go back to:** Custom Conversions
5. **Check:** Should see conversion count increase

---

## Advanced: Multiple Conversion Rules

### Option 1: Form Submit by Location

Create separate conversions for different form locations:

- **Conversion Name:** `Lead - Hero Section`
  - Event: `Lead`
  - Parameter: `content_category` equals `hero_section`

- **Conversion Name:** `Lead - Other Sections`
  - Event: `Lead`
  - Parameter: `content_category` not equals `hero_section`

### Option 2: Purchase by Value

Create value-based conversions:

- **Conversion Name:** `Purchase - Low Value (< 100k)`
  - Event: `Purchase`
  - Parameter: `value` less than `100000`

- **Conversion Name:** `Purchase - High Value (>= 100k)`
  - Event: `Purchase`
  - Parameter: `value` greater than or equal `100000`

---

## Conversion Optimization

### For Facebook Ads:

1. **Go to:** Facebook Ads Manager
2. **Create Campaign** → Conversion Campaign
3. **Optimization Event:** Select your custom conversion
   - `Form Submit - Lead` (for lead generation)
   - `Purchase - Confirmed Payment` (for sales)

### Best Practices:

- Use **Purchase** conversion for sales campaigns
- Use **Lead** conversion for lead generation campaigns
- Set appropriate attribution windows
- Monitor conversion values

---

## Troubleshooting

### Conversion Not Tracking

**Check:**
1. Events are firing (Test Events tab)
2. Event names match exactly (`Lead`, `Purchase`)
3. Event parameters are correct
4. Conversion rules match event data

### Wrong Conversion Values

**Check:**
1. `value` parameter is being sent
2. Value is a number (not string)
3. Currency code is correct

### Conversions Not Showing in Ads

**Check:**
1. Attribution window hasn't expired
2. Conversion is selected in campaign settings
3. Enough data for optimization (usually 50+ conversions)

---

## Summary

✅ **Lead Conversion:** Tracks form submissions  
✅ **Purchase Conversion:** Tracks confirmed payments  
✅ **Value Tracking:** Uses event value parameter  
✅ **Attribution:** 7-day click-through, 1-day view-through  

---

**Next:** Set up Google Ads conversions (see main Phase 4 guide)
