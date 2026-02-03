# 🔍 Google Search Console Setup Guide

**Date:** 17/01/2026  
**Website:** getcourses.net

---

## 📋 Mục Tiêu

Submit sitemap và verify website trên Google Search Console để:
- ✅ Google index website nhanh hơn
- ✅ Monitor search performance
- ✅ Fix indexing issues
- ✅ Track keywords và rankings

---

## 🚀 Bước 1: Verify Website

### Option 1: HTML Tag (Recommended)

1. **Truy cập:** [Google Search Console](https://search.google.com/search-console)
2. **Add Property** → Chọn **URL prefix**
3. **Verification method:** HTML tag
4. **Copy verification code** (ví dụ: `<meta name="google-site-verification" content="abc123..." />`)

5. **Thêm vào `app/layout.tsx`:**
```typescript
export const metadata: Metadata = generateSEOMetadata({
  // ... existing metadata
  verification: {
    google: 'your-verification-code-here', // Thêm code này
  },
});
```

6. **Deploy và verify** trên Google Search Console

### Option 2: DNS Record

1. **Verification method:** DNS record
2. **Add TXT record** vào DNS:
   ```
   Type: TXT
   Name: @
   Value: google-site-verification=abc123...
   ```
3. **Verify** trên Google Search Console

---

## 🗺️ Bước 2: Submit Sitemap

### 1. **Truy cập Sitemap:**
- URL: `https://getcourses.net/sitemap.xml`
- Verify sitemap hoạt động đúng

### 2. **Submit trong Google Search Console:**

1. Vào **Sitemaps** trong menu bên trái
2. Nhập sitemap URL: `sitemap.xml`
3. Click **Submit**
4. Đợi Google crawl (có thể mất vài giờ đến vài ngày)

### 3. **Verify Sitemap:**

Sau khi submit, bạn sẽ thấy:
- ✅ **Status:** Success
- ✅ **Discovered URLs:** Số lượng pages được discover
- ✅ **Indexed:** Số lượng pages đã được index

---

## 📊 Bước 3: Monitor Performance

### 1. **Performance Report:**
- Vào **Performance** tab
- Xem:
  - Total clicks
  - Total impressions
  - Average CTR
  - Average position
  - Top queries
  - Top pages

### 2. **Coverage Report:**
- Vào **Coverage** tab
- Check:
  - Valid pages
  - Errors (404, 500, etc.)
  - Warnings
  - Excluded pages

### 3. **Core Web Vitals:**
- Vào **Core Web Vitals** tab
- Monitor:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)

---

## 🔧 Bước 4: Fix Common Issues

### Issue 1: Pages Not Indexed

**Solution:**
1. Check **robots.txt** - Ensure pages are not blocked
2. Check **noindex** tags - Remove if needed
3. Request indexing manually:
   - Vào **URL Inspection** tool
   - Nhập URL
   - Click **Request Indexing**

### Issue 2: Sitemap Errors

**Solution:**
1. Check sitemap format (XML)
2. Verify all URLs are accessible
3. Check for duplicate URLs
4. Ensure sitemap is not blocked by robots.txt

### Issue 3: Mobile Usability Issues

**Solution:**
1. Test với **Mobile-Friendly Test**
2. Fix responsive issues
3. Ensure touch targets are large enough
4. Check viewport meta tag

---

## 📈 Bước 5: Optimize Further

### 1. **Add More Structured Data:**
- Course schema (đã có function)
- Article schema (đã có function)
- Review/Rating schema

### 2. **Improve Content:**
- Add more unique content
- Optimize meta descriptions
- Add internal links

### 3. **Monitor Keywords:**
- Track target keywords
- Monitor rankings
- Optimize based on performance

---

## 🎯 Best Practices

### ✅ Do:
- Submit sitemap ngay sau khi deploy
- Monitor performance thường xuyên
- Fix errors ngay lập tức
- Update sitemap khi có content mới
- Use structured data

### ❌ Don't:
- Submit duplicate sitemaps
- Block important pages in robots.txt
- Use noindex on important pages
- Ignore errors và warnings

---

## 📝 Checklist

### Setup:
- [ ] Verify website ownership
- [ ] Submit sitemap.xml
- [ ] Verify sitemap is processed
- [ ] Check for errors

### Monitoring:
- [ ] Check performance weekly
- [ ] Monitor Core Web Vitals
- [ ] Fix indexing issues
- [ ] Track keyword rankings

### Optimization:
- [ ] Add structured data
- [ ] Optimize meta descriptions
- [ ] Improve content quality
- [ ] Build internal links

---

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 📊 Expected Timeline

| Task | Timeline |
|------|----------|
| Verification | Immediate |
| Sitemap Processing | 1-3 days |
| Initial Indexing | 1-7 days |
| Full Indexing | 1-4 weeks |
| Performance Data | 3-7 days |

---

## ✅ Summary

1. **Verify website** với HTML tag hoặc DNS
2. **Submit sitemap** (`sitemap.xml`)
3. **Monitor performance** thường xuyên
4. **Fix issues** ngay lập tức
5. **Optimize** dựa trên data

**Status:** Ready to submit! 🚀

---

**Last Updated:** 17/01/2026  
**Version:** 1.0
