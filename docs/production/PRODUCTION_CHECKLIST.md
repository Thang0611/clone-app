# ✅ Production Deployment Checklist

## 🔴 CRITICAL - Must Fix Before Production

### Security
- [ ] **Remove fallback secret** in `lib/auth.config.ts`
  ```typescript
  // ❌ REMOVE THIS
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-dev',
  
  // ✅ USE THIS
  secret: process.env.NEXTAUTH_SECRET!, // Require it
  ```

- [ ] **Add environment validation** - Create `lib/env-validation.ts`
- [ ] **Add security headers** in `next.config.ts`
- [ ] **Replace console.log** with logger in production
- [ ] **Generate strong secrets**:
  ```bash
  openssl rand -base64 32  # For NEXTAUTH_SECRET
  ```

- [ ] **Set strong admin password** (16+ chars, mixed case, numbers, special)

### Environment Variables
- [ ] Create `.env.production` with all required variables
- [ ] Verify `NEXTAUTH_URL` matches production domain
- [ ] Verify `NEXTAUTH_SECRET` is strong (32+ chars)
- [ ] Verify `ADMIN_PASSWORD` is strong
- [ ] Set file permissions: `chmod 600 .env.production`
- [ ] Verify `.env*` files are in `.gitignore`

### Configuration
- [ ] Update `ecosystem.config.js` for production
- [ ] Update `next.config.ts` with security headers
- [ ] Remove dev-only configs in production
- [ ] Disable debug mode in production

---

## 🟡 IMPORTANT - Should Fix

### Code Quality
- [ ] Fix all TypeScript errors: `npm run build`
- [ ] Fix all ESLint warnings: `npm run lint`
- [ ] Remove or document TODO/FIXME comments
- [ ] Review console.log statements (293 found)

### Testing
- [ ] Test authentication flow end-to-end
- [ ] Test all admin API routes
- [ ] Test error handling
- [ ] Test production build locally

### Performance
- [ ] Verify image optimization
- [ ] Check bundle size
- [ ] Test page load times
- [ ] Verify static generation working

---

## 🟢 RECOMMENDED - Nice to Have

- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Set up error tracking (Sentry)
- [ ] Add health check endpoint
- [ ] Set up monitoring
- [ ] Add unit tests
- [ ] Add E2E tests

---

## 📋 Pre-Deployment Steps

### 1. Code Review
```bash
cd /root/project/clone-app

# Check for issues
npm run lint
npm run build

# Check for secrets in code
grep -r "password\|secret\|token" --include="*.ts" --include="*.tsx" | grep -v node_modules
```

### 2. Environment Setup
```bash
# Create production env file
cp .env.local.example .env.production

# Edit with production values
nano .env.production

# Set permissions
chmod 600 .env.production
```

### 3. Build Test
```bash
# Clean build
rm -rf .next
npm run build

# Test production build
NODE_ENV=production npm run start
# Test at http://localhost:4000
```

### 4. Security Audit
```bash
# Check for exposed secrets
grep -r "ADMIN_PASSWORD\|NEXTAUTH_SECRET" --include="*.ts" --include="*.tsx" --include="*.md"

# Verify .gitignore
cat .gitignore | grep ".env"
```

---

## 🚀 Deployment Steps

### 1. Server Preparation
```bash
# Install dependencies
npm ci --production=false

# Create production env
cat > .env.production << 'EOF'
# ... (see template)
EOF

chmod 600 .env.production
```

### 2. Build
```bash
NODE_ENV=production npm run build
```

### 3. Deploy with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Verify
```bash
pm2 status
pm2 logs getcourses-frontend
curl http://localhost:4000
```

---

## ✅ Post-Deployment Verification

### Functional Tests
- [ ] Homepage loads: `https://getcourses.net`
- [ ] Admin redirect works: `/admin` → `/admin/login`
- [ ] Login works with credentials
- [ ] Admin dashboard loads
- [ ] API routes work with auth
- [ ] Error pages display correctly

### Security Tests
- [ ] HTTPS working (no mixed content)
- [ ] Security headers present
- [ ] Authentication required for admin
- [ ] API protected (401 without token)
- [ ] CORS configured correctly

### Performance Tests
- [ ] Page load < 3s
- [ ] API response < 1s
- [ ] Images load correctly
- [ ] No console errors

---

## 📊 Success Criteria

✅ **All critical items** fixed  
✅ **Build succeeds** without errors  
✅ **All routes** accessible  
✅ **Authentication** working  
✅ **No security vulnerabilities**  
✅ **Performance** acceptable  
✅ **Monitoring** configured  
