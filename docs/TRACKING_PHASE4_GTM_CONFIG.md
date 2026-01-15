# Phase 4: GTM Configuration Guide

Complete guide to configure Google Tag Manager, Meta Pixel, and Google Ads for tracking.

---

## Prerequisites

Before starting, ensure:
- ✅ Phase 1-3 are complete
- ✅ GTM container created and ID configured
- ✅ GA4 property created and ID configured
- ✅ Meta Pixel created and ID configured
- ✅ All tracking IDs are in `.env.local`

---

## Step 4.1: Create GTM Triggers

### Trigger 1: Page View

**Purpose:** Fire on every page view (including route changes)

1. **Go to GTM** → Your Container → **Triggers** → **New**
2. **Trigger Name:** `Page View - All Pages`
3. **Trigger Type:** `Page View`
4. **This trigger fires on:** `All Pages`
5. **Click Save**

**Additional Trigger for History Changes:**
1. **Trigger Name:** `Page View - History Change`
2. **Trigger Type:** `History Change`
3. **This trigger fires on:** `All History Change Events`
4. **Click Save**

**Why both?** Next.js App Router uses client-side navigation, so we need both triggers to catch all page views.

---

### Trigger 2: View Content

1. **Trigger Name:** `Event - view_content`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `view_content`
4. **This trigger fires on:** `All Custom Events` (or specific: `view_content`)
5. **Click Save**

---

### Trigger 3: Form Start

1. **Trigger Name:** `Event - form_start`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `form_start`
4. **This trigger fires on:** `All Custom Events`
5. **Click Save**

---

### Trigger 4: Form Submit

1. **Trigger Name:** `Event - form_submit`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `form_submit`
4. **This trigger fires on:** `All Custom Events`
5. **Click Save**

---

### Trigger 5: Form Submit Success

1. **Trigger Name:** `Event - form_submit_success`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `form_submit_success`
4. **This trigger fires on:** `All Custom Events`
5. **Click Save**

---

### Trigger 6: Begin Checkout

1. **Trigger Name:** `Event - begin_checkout`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `begin_checkout`
4. **This trigger fires on:** `All Custom Events`
5. **Click Save**

---

### Trigger 7: Purchase

1. **Trigger Name:** `Event - purchase`
2. **Trigger Type:** `Custom Event`
3. **Event name:** `purchase`
4. **This trigger fires on:** `All Custom Events`
5. **Click Save**

---

## Step 4.2: Create GTM Tags

### Tag 1: Meta Pixel - Base Code

**Purpose:** Initialize Meta Pixel on all pages

1. **Go to Tags** → **New**
2. **Tag Name:** `Meta Pixel - Base Code`
3. **Tag Type:** `Custom HTML`
4. **HTML:**

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{Meta Pixel ID}}');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={{Meta Pixel ID}}&ev=PageView&noscript=1"/>
</noscript>
```

5. **Triggering:** `Page View - All Pages`
6. **Advanced Settings:**
   - **Tag firing priority:** `100`
   - **Tag firing options:** `Once per page`
7. **Click Save**

**Note:** Replace `{{Meta Pixel ID}}` with your actual Pixel ID, or create a variable.

---

### Tag 2: Meta Pixel - ViewContent

1. **Tag Name:** `Meta Pixel - ViewContent`
2. **Tag Type:** `Custom HTML`
3. **HTML:**

```html
<script>
fbq('track', 'ViewContent', {
  content_type: '{{DLV - content_type}}',
  content_name: '{{DLV - content_name}}',
  content_category: '{{DLV - content_category}}'
});
</script>
```

4. **Triggering:** `Event - view_content`
5. **Click Save**

---

### Tag 3: Meta Pixel - Lead (Form Submit)

1. **Tag Name:** `Meta Pixel - Lead`
2. **Tag Type:** `Custom HTML`
3. **HTML:**

```html
<script>
fbq('track', 'Lead', {
  content_name: '{{DLV - form_name}}',
  content_category: '{{DLV - form_location}}'
});
</script>
```

4. **Triggering:** `Event - form_submit`
5. **Click Save**

---

### Tag 4: Meta Pixel - InitiateCheckout

1. **Tag Name:** `Meta Pixel - InitiateCheckout`
2. **Tag Type:** `Custom HTML`
3. **HTML:**

```html
<script>
fbq('track', 'InitiateCheckout', {
  value: {{DLV - value}},
  currency: '{{DLV - currency}}',
  num_items: {{DLV - items.length}}
});
</script>
```

4. **Triggering:** `Event - begin_checkout`
5. **Click Save**

---

### Tag 5: Meta Pixel - Purchase

1. **Tag Name:** `Meta Pixel - Purchase`
2. **Tag Type:** `Custom HTML`
3. **HTML:**

```html
<script>
fbq('track', 'Purchase', {
  value: {{DLV - value}},
  currency: '{{DLV - currency}}',
  contents: [
    {{#each DLV - items}}
    {
      id: '{{item_id}}',
      quantity: {{quantity}},
      item_price: {{price}}
    }{{#unless @last}},{{/unless}}
    {{/each}}
  ],
  content_type: 'product',
  content_ids: [
    {{#each DLV - items}}
    '{{item_id}}'{{#unless @last}},{{/unless}}
    {{/each}}
  ]
});
</script>
```

**Alternative (Simpler):**

```html
<script>
var items = {{DLV - items}};
var contents = items.map(function(item) {
  return {
    id: item.item_id,
    quantity: item.quantity,
    item_price: item.price
  };
});

fbq('track', 'Purchase', {
  value: {{DLV - value}},
  currency: '{{DLV - currency}}',
  contents: contents,
  content_type: 'product',
  content_ids: items.map(function(item) { return item.item_id; })
});
</script>
```

4. **Triggering:** `Event - purchase`
5. **Click Save**

---

### Tag 6: GA4 - Event Configuration

**Note:** If using `@next/third-parties` for GA4 (recommended), you may not need separate GA4 event tags. However, if you want to track events through GTM:

1. **Tag Name:** `GA4 Event - view_content`
2. **Tag Type:** `Google Analytics: GA4 Event`
3. **Configuration Tag:** (Select your GA4 Configuration tag, or create one)
4. **Event Name:** `view_content`
5. **Event Parameters:**
   - `content_type`: `{{DLV - content_type}}`
   - `content_name`: `{{DLV - content_name}}`
   - `content_category`: `{{DLV - content_category}}`
6. **Triggering:** `Event - view_content`
7. **Click Save**

**Repeat for other events:**
- `GA4 Event - form_start`
- `GA4 Event - form_submit`
- `GA4 Event - begin_checkout`
- `GA4 Event - purchase`

---

### Tag 7: Google Ads - Conversion (via GA4)

**Note:** Google Ads conversions are typically imported from GA4, not set up directly in GTM. However, if you need direct tracking:

1. **Tag Name:** `Google Ads - Conversion`
2. **Tag Type:** `Google Ads: Conversion Tracking`
3. **Conversion ID:** (Your Google Ads Conversion ID)
4. **Conversion Label:** (Your Conversion Label)
5. **Conversion Value:** `{{DLV - value}}`
6. **Currency Code:** `{{DLV - currency}}`
7. **Triggering:** `Event - purchase`
8. **Click Save**

**Better Approach:** Import conversions from GA4 (see Step 4.4)

---

## Step 4.3: Create GTM Variables

### Data Layer Variables

Create variables to access dataLayer values:

1. **Go to Variables** → **New**
2. **Variable Name:** `DLV - content_type`
3. **Variable Type:** `Data Layer Variable`
4. **Data Layer Variable Name:** `content_type`
5. **Data Layer Version:** `Version 2`
6. **Click Save**

**Repeat for:**
- `DLV - content_name`
- `DLV - content_category`
- `DLV - form_id`
- `DLV - form_name`
- `DLV - form_location`
- `DLV - value`
- `DLV - currency`
- `DLV - items`
- `DLV - transaction_id`
- `DLV - payment_type`
- `DLV - email_hash`

### Constant Variables

1. **Variable Name:** `Meta Pixel ID`
2. **Variable Type:** `Constant`
3. **Value:** Your Meta Pixel ID (e.g., `1234567890123456`)
4. **Click Save**

---

## Step 4.4: Configure Meta Pixel Events Mapping

### Event Mapping Table

| dataLayer Event | Meta Pixel Event | GTM Tag |
|----------------|------------------|---------|
| `page_view` | `PageView` | Meta Pixel - Base Code |
| `view_content` | `ViewContent` | Meta Pixel - ViewContent |
| `form_submit` | `Lead` | Meta Pixel - Lead |
| `begin_checkout` | `InitiateCheckout` | Meta Pixel - InitiateCheckout |
| `purchase` | `Purchase` | Meta Pixel - Purchase |

### Verification

1. **Open GTM Preview Mode**
2. **Visit your site**
3. **Perform actions:**
   - Navigate pages → Should see `PageView`
   - Wait 3 seconds on homepage → Should see `ViewContent`
   - Focus email input → Should see `Lead` (if configured)
   - Submit form → Should see `Lead`
   - Open checkout → Should see `InitiateCheckout`
   - Complete payment → Should see `Purchase`
4. **Check Facebook Events Manager** → Test Events
5. **Verify events appear in real-time**

---

## Step 4.5: Set Up Conversions

### Facebook: Custom Conversions

1. **Go to Facebook Events Manager**
2. **Navigate to:** Data Sources → Your Pixel → Custom Conversions
3. **Click:** `Create Custom Conversion`

#### Conversion 1: Lead

1. **Conversion Name:** `Form Submit - Lead`
2. **Event:** `Lead`
3. **Conditions:**
   - `content_name` contains `Course Request Form`
   - OR `Event` equals `Lead`
4. **Value:** `None` (or set value if needed)
5. **Click Create**

#### Conversion 2: Purchase

1. **Conversion Name:** `Purchase - Confirmed`
2. **Event:** `Purchase`
3. **Conditions:**
   - `Event` equals `Purchase`
4. **Value:** Use `value` parameter
5. **Click Create**

---

### Google Ads: Import from GA4

1. **Go to Google Ads**
2. **Navigate to:** Tools & Settings → Conversions
3. **Click:** `+` (New conversion action)
4. **Select:** `Import`
5. **Select:** `Google Analytics 4`
6. **Choose:** Your GA4 property
7. **Select conversions to import:**
   - `purchase`
   - `begin_checkout` (optional)
   - `form_submit` (optional)
8. **Click Import**

**Alternative: Manual Setup**

1. **Go to Google Ads** → Conversions
2. **Click:** `+` (New conversion action)
3. **Category:** `Purchase`
4. **Value:** Use different values for each conversion
5. **Count:** `One`
6. **Attribution:** `Data-driven` (recommended)
7. **Click Create and continue**

---

## Step 4.6: Testing & Validation

### GTM Preview Mode Testing

1. **Open GTM Preview Mode**
2. **Connect to your site**
3. **Navigate through user journey:**
   - Homepage → Check `PageView` tag fires
   - Wait 3 seconds → Check `ViewContent` tag fires
   - Focus email → Check `form_start` event (if tagged)
   - Submit form → Check `Lead` tag fires
   - Open checkout → Check `InitiateCheckout` tag fires
   - Complete payment → Check `Purchase` tag fires

### Facebook Events Manager Testing

1. **Go to Facebook Events Manager**
2. **Open:** Test Events tab
3. **Visit your site**
4. **Verify events appear:**
   - `PageView`
   - `ViewContent`
   - `Lead`
   - `InitiateCheckout`
   - `Purchase`

### GA4 DebugView Testing

1. **Enable debug mode** (add `?debug_mode=true` to URL or use GA Debugger extension)
2. **Visit your site**
3. **Go to GA4** → DebugView
4. **Verify events:**
   - `page_view`
   - `view_content`
   - `form_start`
   - `form_submit`
   - `begin_checkout`
   - `purchase`

### Google Ads Testing

1. **Go to Google Ads** → Conversions
2. **Check conversion actions are active**
3. **Test conversion** (may take 24-48 hours to see data)

---

## Common Issues & Solutions

### Issue 1: Tags Not Firing

**Symptoms:** Events in dataLayer but tags not firing

**Solutions:**
1. Check trigger configuration
2. Verify event names match exactly
3. Check tag firing conditions
4. Verify GTM container is published

### Issue 2: Meta Pixel Events Not Appearing

**Symptoms:** Tags fire but events don't show in Facebook

**Solutions:**
1. Verify Pixel ID is correct
2. Check Facebook Pixel Helper extension
3. Verify events are using correct Meta Pixel event names
4. Check browser console for errors

### Issue 3: GA4 Events Not Showing

**Symptoms:** Events fire but don't appear in GA4

**Solutions:**
1. Verify GA4 Measurement ID
2. Check GA4 DebugView
3. Verify events are configured in GA4
4. Check data retention settings

### Issue 4: Conversion Values Incorrect

**Symptoms:** Conversion values are wrong

**Solutions:**
1. Check dataLayer variable names
2. Verify value format (number, not string)
3. Check currency code
4. Verify variable mapping

---

## GTM Container Export

Once configured, export your GTM container:

1. **Go to GTM** → Admin → Export Container
2. **Select version** to export
3. **Download JSON**
4. **Save for backup/version control**

---

## Next Steps

After Phase 4 is complete:

1. ✅ Test all events in GTM Preview
2. ✅ Verify events in Facebook Events Manager
3. ✅ Verify events in GA4 DebugView
4. ✅ Monitor conversions in Google Ads
5. ✅ Set up conversion reporting dashboards
6. ✅ Document any custom configurations

---

## Summary Checklist

- [ ] GTM triggers created (Page View, Custom Events)
- [ ] Meta Pixel tags created (Base, ViewContent, Lead, InitiateCheckout, Purchase)
- [ ] GA4 event tags created (if needed)
- [ ] Data Layer variables created
- [ ] Meta Pixel events mapped correctly
- [ ] Facebook custom conversions created
- [ ] Google Ads conversions imported/configured
- [ ] All tags tested in GTM Preview
- [ ] Events verified in Facebook Events Manager
- [ ] Events verified in GA4 DebugView
- [ ] GTM container published

---

**Status:** Ready for Configuration

**Note:** This phase requires manual configuration in GTM, Facebook, and Google Ads web interfaces. Follow the steps above to complete the setup.
