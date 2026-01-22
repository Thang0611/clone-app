# Tracking Setup Guide

## Phase 1: Setup & Configuration

This guide will help you set up Google Tag Manager (GTM), Google Analytics 4 (GA4), and Meta Pixel for tracking on getcourses.net.

---

## Step 1.1: Install Dependencies ✅

**Status:** COMPLETED

The `@next/third-parties` package has been installed. No additional packages are needed for GTM (it loads via script tag).

---

## Step 1.2: Create GTM Container

### Instructions:

1. **Go to Google Tag Manager**
   - Visit: https://tagmanager.google.com/
   - Sign in with your Google account

2. **Create a New Account** (if you don't have one)
   - Click "Create Account"
   - Account Name: `khoahocgiare` (or your preferred name)
   - Country: Vietnam
   - Click "Continue"

3. **Create a Container**
   - Container Name: `getcourses.net`
   - Target Platform: **Web**
   - Click "Create"

4. **Get Your GTM ID**
   - After creating the container, you'll see your Container ID
   - Format: `GTM-XXXXXXX`
   - Copy this ID

5. **Add GTM ID to Environment Variables**
   - Create `.env.local` file in the project root (copy from `.env.example`)
   - Add: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` (replace with your actual ID)

---

## Step 1.3: Configure GA4

### Instructions:

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account

2. **Create a GA4 Property** (if you don't have one)
   - Click "Admin" (gear icon)
   - Under "Property", click "Create Property"
   - Property Name: `getcourses.net`
   - Reporting Time Zone: `(GMT+07:00) Ho Chi Minh`
   - Currency: `Vietnamese Dong (VND)`
   - Click "Next"

3. **Set Up Data Stream**
   - Select "Web"
   - Website URL: `https://getcourses.net`
   - Stream Name: `getcourses.net Web`
   - Click "Create Stream"

4. **Get Your Measurement ID**
   - After creating the stream, you'll see your Measurement ID
   - Format: `G-XXXXXXXXXX`
   - Copy this ID

5. **Link GA4 to Google Ads** (if you use Google Ads)
   - Go to Admin > Property Settings
   - Under "Google Ads Linking", click "Link"
   - Select your Google Ads account
   - Follow the linking wizard

6. **Add GA4 ID to Environment Variables**
   - Add to `.env.local`: `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX` (replace with your actual ID)

---

## Step 1.4: Configure Meta Pixel

### Instructions:

1. **Go to Facebook Events Manager**
   - Visit: https://business.facebook.com/events_manager2/
   - Sign in with your Facebook Business account

2. **Create a Meta Pixel** (if you don't have one)
   - Click "Connect Data Sources" > "Web"
   - Select "Meta Pixel"
   - Click "Connect"
   - Pixel Name: `getcourses.net`
   - Website URL: `https://getcourses.net`
   - Click "Continue"

3. **Get Your Pixel ID**
   - After creating the pixel, you'll see your Pixel ID
   - Format: `1234567890123456` (15-16 digits)
   - Copy this ID

4. **Add Pixel to GTM** (We'll do this in Phase 4)
   - For now, just save your Pixel ID

5. **Add Pixel ID to Environment Variables**
   - Add to `.env.local`: `NEXT_PUBLIC_META_PIXEL_ID=1234567890123456` (replace with your actual ID)

---

## Environment Variables Setup

Create a `.env.local` file in the project root with the following:

```bash
# Google Tag Manager ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX

# Meta Pixel ID
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456

# Enable tracking in development (optional)
NEXT_PUBLIC_ENABLE_TRACKING=false

# Site domain (optional)
NEXT_PUBLIC_SITE_DOMAIN=getcourses.net
```

**Important:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Replace all placeholder values with your actual IDs
- Restart your development server after adding environment variables

---

## Verification Steps

After setting up all IDs:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Check the browser console:**
   - Open DevTools (F12)
   - Look for tracking initialization messages
   - You should see `[Tracking]` logs in development mode

3. **Verify GTM:**
   - Install "Tag Assistant Legacy" Chrome extension
   - Visit your site
   - Check if GTM container is loaded

4. **Verify GA4:**
   - Go to GA4 > Reports > Realtime
   - Visit your site
   - You should see yourself as an active user

5. **Verify Meta Pixel:**
   - Install "Facebook Pixel Helper" Chrome extension
   - Visit your site
   - Check if pixel is firing (will show after GTM setup in Phase 4)

---

## Next Steps

Once all IDs are configured:

1. ✅ Phase 1 is complete
2. → Proceed to **Phase 2: Core Tracking Infrastructure**
3. → Then **Phase 3: Event Implementation**
4. → Finally **Phase 4: GTM Configuration**

---

## Troubleshooting

### GTM not loading:
- Check that `NEXT_PUBLIC_GTM_ID` is set correctly
- Verify GTM container is published
- Check browser console for errors

### GA4 not tracking:
- Check that `NEXT_PUBLIC_GA4_ID` is set correctly
- Verify GA4 property is active
- Check GA4 DebugView for events

### Environment variables not working:
- Restart your development server
- Check that variables start with `NEXT_PUBLIC_`
- Verify `.env.local` is in the project root

---

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all IDs are correct
3. Ensure environment variables are loaded (restart server)
4. Check GTM/GA4/Meta Pixel dashboards for any setup errors
