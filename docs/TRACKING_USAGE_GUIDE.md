# Tracking Usage Guide

Quick reference guide for using the tracking system in components.

---

## Quick Start

### Option 1: Using the Hook (Recommended)

```typescript
'use client';

import { useTracking } from '@/hooks/useTracking';

export default function MyComponent() {
  const { trackEvent, trackForm, trackContent } = useTracking();

  // Use tracking functions
  const handleClick = () => {
    trackEvent('button_click', { button_name: 'cta' });
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

### Option 2: Direct Functions

```typescript
import { trackEvent, trackFormSubmit } from '@/lib/tracking';

// Use directly
trackEvent('custom_event', { data: 'value' });
trackFormSubmit('form_id', 'Form Name', 'location', 2);
```

---

## Common Tracking Scenarios

### 1. Track Form Submission

```typescript
import { useTracking } from '@/hooks/useTracking';

const { trackForm, trackFormSuccess, trackFormError } = useTracking();

const handleSubmit = async (formData) => {
  // Track form start (only once per form)
  trackFormBegin('hero_form', 'Course Request Form', 'hero_section');

  // Track form submit (before API call)
  trackForm('hero_form', 'Course Request Form', 'hero_section', courseCount);

  try {
    const result = await submitForm(formData);
    
    // Track success
    trackFormSuccess('hero_form', courseCount, result.validCourses);
  } catch (error) {
    // Track error
    trackFormError('hero_form', error.message);
  }
};
```

### 2. Track Content View

```typescript
import { useTracking } from '@/hooks/useTracking';
import { useEffect } from 'react';

export default function Hero() {
  const { trackContent } = useTracking();

  useEffect(() => {
    // Track when component is in viewport for 3+ seconds
    const timer = setTimeout(() => {
      trackContent('course_form', 'main_hero_form', 'education');
    }, 3000);

    return () => clearTimeout(timer);
  }, [trackContent]);

  return <div>...</div>;
}
```

### 3. Track Checkout

```typescript
import { useTracking } from '@/hooks/useTracking';

const { trackCheckout } = useTracking();

const handleCheckout = (courses) => {
  const items = courses.map(course => ({
    item_id: course.id,
    item_name: course.title,
    item_category: course.category,
    item_brand: course.platform,
    price: course.price,
    quantity: 1,
  }));

  const totalValue = courses.reduce((sum, c) => sum + c.price, 0);

  trackCheckout(totalValue, 'VND', items);
};
```

### 4. Track Purchase

```typescript
import { useTracking } from '@/hooks/useTracking';

const { trackPurchase } = useTracking();

const handlePurchaseSuccess = async (order) => {
  const items = order.courses.map(course => ({
    item_id: course.id,
    item_name: course.title,
    item_category: course.category,
    item_brand: course.platform,
    price: course.price,
    quantity: 1,
  }));

  await trackPurchase(
    order.transactionId,
    order.total,
    'VND',
    items,
    order.paymentMethod,
    order.email // Will be automatically hashed
  );
};
```

### 5. Track Custom Events

```typescript
import { useTracking } from '@/hooks/useTracking';

const { trackEvent } = useTracking();

// Track button click
const handleButtonClick = () => {
  trackEvent('button_click', {
    button_name: 'get_started',
    button_location: 'hero_section',
  });
};

// Track video play
const handleVideoPlay = () => {
  trackEvent('video_play', {
    video_title: 'How it works',
    video_duration: 120,
  });
};
```

### 6. Track User Engagement

```typescript
import { useTracking } from '@/hooks/useTracking';

const { trackEngagement } = useTracking();

// Track scroll depth
useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    
    if (scrollPercent >= 50 && scrollPercent < 75) {
      trackEngagement('scroll', 50);
    } else if (scrollPercent >= 75) {
      trackEngagement('scroll', 75);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [trackEngagement]);

// Track time on page
useEffect(() => {
  const startTime = Date.now();
  
  return () => {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    trackEngagement('time', timeOnPage);
  };
}, [trackEngagement]);
```

---

## Available Tracking Functions

### From `useTracking` Hook:

- `trackPage(path?, title?)` - Track page view
- `trackEvent(eventName, data?)` - Track custom event
- `trackContent(type, name?, category?)` - Track content view
- `trackFormBegin(id, name, location?)` - Track form start
- `trackForm(id, name, location?, courseCount?)` - Track form submit
- `trackFormSuccess(id, courseCount, validCourses)` - Track form success
- `trackFormError(id, errorMessage)` - Track form error
- `trackCheckout(value, currency, items, transactionId?)` - Track checkout
- `trackPurchase(...)` - Track purchase (with email hashing)
- `setUserProperties(properties)` - Set user properties
- `trackEngagement(type, value, data?)` - Track engagement

### From `lib/tracking` (Direct):

- `pushToDataLayer(data)` - Push custom data to dataLayer
- `trackPageView(path, title?)` - Track page view
- `trackViewContent(...)` - Track content view
- `trackFormStart(...)` - Track form start
- `trackFormSubmit(...)` - Track form submit
- `trackFormSubmitSuccess(...)` - Track form success
- `trackFormSubmitError(...)` - Track form error
- `trackBeginCheckout(...)` - Track checkout
- `trackPurchase(...)` - Track purchase
- `setUserProperties(...)` - Set user properties
- `trackCustomEvent(...)` - Track custom event
- `trackUserEngagement(...)` - Track engagement
- `hashEmail(email)` - Hash email (SHA-256)

---

## Best Practices

### 1. Use Hooks in Client Components

Always use `'use client'` directive when using the `useTracking` hook:

```typescript
'use client';

import { useTracking } from '@/hooks/useTracking';
```

### 2. Track Events at the Right Time

- **Form Start**: When user focuses on first input
- **Form Submit**: Immediately when form is submitted (before API call)
- **Form Success**: After successful API response
- **Form Error**: On API error
- **Checkout**: When checkout modal opens
- **Purchase**: After payment confirmation

### 3. Include Relevant Data

Always include relevant context in events:

```typescript
// Good
trackEvent('button_click', {
  button_name: 'cta_button',
  button_location: 'hero_section',
  page_path: window.location.pathname,
});

// Bad
trackEvent('button_click');
```

### 4. Hash Sensitive Data

Email addresses are automatically hashed in `trackPurchase()`. For other sensitive data, use `hashEmail()`:

```typescript
const emailHash = await hashEmail(userEmail);
trackEvent('user_action', { email_hash: emailHash });
```

### 5. Prevent Duplicate Events

The `trackFormBegin()` function automatically prevents duplicates per session. For other events, track them conditionally:

```typescript
const [hasTracked, setHasTracked] = useState(false);

useEffect(() => {
  if (!hasTracked) {
    trackContent('page_load', 'homepage');
    setHasTracked(true);
  }
}, [hasTracked]);
```

---

## Debugging

### Check Events in Console

In development mode, all events are logged to console:

```
[Tracking] Event pushed to dataLayer: { event: 'page_view', ... }
```

### Check dataLayer

Open browser console and run:

```javascript
window.dataLayer
```

This shows all events pushed to dataLayer.

### GTM Preview Mode

1. Open GTM Preview mode
2. Visit your site
3. Check events in GTM Preview
4. Verify dataLayer pushes

### GA4 DebugView

1. Enable debug mode in GA4
2. Visit your site
3. Check DebugView in GA4
4. Verify events are firing

---

## Troubleshooting

### Events Not Firing

1. Check that tracking IDs are configured in `.env.local`
2. Verify `NEXT_PUBLIC_ENABLE_TRACKING=true` in development
3. Check browser console for errors
4. Verify component has `'use client'` directive

### Duplicate Events

1. Use `trackFormBegin()` which prevents duplicates
2. Add state to track if event was already fired
3. Check GTM Preview for duplicate events

### Missing Data

1. Verify all required parameters are passed
2. Check dataLayer in console
3. Verify event structure matches expected format

---

## Examples in Codebase

See these files for real-world examples:

- `components/Hero.tsx` - Form submission tracking (Phase 3)
- `components/CourseModal.tsx` - Checkout tracking (Phase 3)
- `hooks/useCoursePayment.ts` - Purchase tracking (Phase 3)

---

**For more details, see:**
- `docs/TRACKING_SETUP.md` - Setup instructions
- `docs/TRACKING_PHASE1_COMPLETE.md` - Phase 1 summary
- `docs/TRACKING_PHASE2_COMPLETE.md` - Phase 2 summary
