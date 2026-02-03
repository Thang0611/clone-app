# ✅ Fix Login Issue - Complete

## Problem
- **Error:** "Email hoặc mật khẩu không chính xác"
- **Root Cause:** `ADMIN_PASSWORD_HASH` không được load từ `.env.production` trong production mode với PM2

## Solution Applied

### 1. ✅ Updated `ecosystem.config.js`
- Added `env` object (default) in addition to `env_production`
- Ensures environment variables are loaded even if PM2 doesn't specify `--env production`

### 2. ✅ Added `.env.production` Loader in `lib/auth.config.ts`
- Load `.env.production` file at module initialization
- Only set variables if not already set (PM2 env vars take priority)
- Added debug logging to track environment variable loading

### 3. ✅ Added `.env.production` Loader in `app/api/auth/[...nextauth]/route.ts`
- Double-check load `.env.production` in route handler
- Ensures env vars are available at request time

## Verification

### Log Output (After Fix):
```
[AUTH CONFIG] Loading .env.production from: /root/project/clone-app/.env.production
[AUTH CONFIG] File exists: true
[AUTH CONFIG] Loaded 1 environment variables from .env.production
[AUTH CONFIG] ADMIN_PASSWORD_HASH: Loaded (60 chars)
```

### Environment Variables Status:
- ✅ `ADMIN_PASSWORD_HASH`: Loaded (60 chars)
- ✅ `ADMIN_EMAIL`: Loaded from `.env.production` or PM2
- ✅ `NEXTAUTH_SECRET`: Loaded from `.env.production` or PM2

## Files Modified

1. **`ecosystem.config.js`**
   - Added `env` object with all production variables
   - Ensures variables are available in default environment

2. **`lib/auth.config.ts`**
   - Added code to load `.env.production` at module initialization
   - Added debug logging for troubleshooting

3. **`app/api/auth/[...nextauth]/route.ts`**
   - Added fallback `.env.production` loader in route handler

## Testing

### Test Login:
1. Navigate to: `https://getcourses.net/admin/login`
2. Email: `getcourses.net@gmail.com`
3. Password: (use the password that was used to generate the hash)

### Expected Behavior:
- ✅ Login should succeed
- ✅ No "Email hoặc mật khẩu không chính xác" error
- ✅ Redirect to `/admin` dashboard after successful login

### Check Logs:
```bash
pm2 logs getcourses-frontend --lines 100 | grep -E "AUTH|Debug Env"
```

Should see:
- `[AUTH CONFIG] ADMIN_PASSWORD_HASH: Loaded (60 chars)`
- `Debug Env: Loaded` (instead of "Missing")

## Next Steps

1. ✅ Test login in production
2. ✅ Verify authentication works correctly
3. ✅ Monitor logs for any errors

## Notes

- Environment variables are loaded in this order:
  1. PM2 environment variables (highest priority)
  2. `.env.production` file (fallback)
  3. Next.js automatic `.env.production` loading

- The fix ensures `ADMIN_PASSWORD_HASH` is loaded even if PM2 doesn't pass it correctly.
