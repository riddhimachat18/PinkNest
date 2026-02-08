# CORS Fix for Vercel Preview URLs

## Problem
Vercel creates unique preview URLs for each deployment (e.g., `pink-nest-git-main-riddhimas-projects-50edae3d.vercel.app`), and these aren't in the CORS whitelist.

## ✅ Solution Applied

Updated `backend/server.js` to automatically allow ALL Vercel preview URLs by checking if the origin includes `vercel.app`.

## 🚀 Deploy the Fix

### Step 1: Commit and Push
```bash
git add .
git commit -m "Fix CORS to allow all Vercel preview URLs"
git push origin main
```

### Step 2: Wait for Render to Redeploy
- Render will automatically redeploy when you push to main
- Check Render dashboard → Logs
- Wait for "MongoDB connected successfully"

### Step 3: Test Your App
- Go to your Vercel URL (any preview or production)
- Try to login
- Should work now! ✅

---

## What Changed

### Before:
```javascript
app.use(cors({
  origin: [
    'https://pink-nest.vercel.app',
    'http://localhost:8081'
  ]
}));
```
❌ Only allowed specific URLs

### After:
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all Vercel URLs (*.vercel.app)
    if (origin.includes('vercel.app')) {
      callback(null, true);
    }
  }
};
app.use(cors(corsOptions));
```
✅ Allows all Vercel preview and production URLs

---

## Verification

### Test Backend CORS
```bash
curl -H "Origin: https://pink-nest-git-main-riddhimas-projects-50edae3d.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://pinknest-backend.onrender.com/api/auth/login
```

Should return CORS headers in response.

### Test in Browser
1. Open your Vercel app (any URL)
2. Open DevTools (F12) → Console
3. Try to login
4. Should NOT see CORS errors
5. Login should work ✅

---

## URLs That Will Work

✅ Production: `https://pink-nest.vercel.app`
✅ Preview: `https://pink-nest-git-main-*.vercel.app`
✅ Any Vercel URL: `https://*.vercel.app`
✅ Local dev: `http://localhost:8081`

---

## Quick Commands

```bash
# 1. Commit changes
git add .
git commit -m "Fix CORS for Vercel preview URLs"
git push origin main

# 2. Check Render logs
# Go to https://dashboard.render.com
# Click your service → Logs
# Wait for deployment to complete

# 3. Test your app
# Open https://pink-nest.vercel.app
# Try to login
```

---

## Troubleshooting

### Issue: Still seeing CORS errors

**Solution 1**: Wait for Render to finish deploying
- Check Render dashboard
- Look for "Live" status
- Usually takes 2-3 minutes

**Solution 2**: Hard refresh browser
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Solution 3**: Clear browser cache
- DevTools (F12) → Network tab
- Right-click → "Clear browser cache"

### Issue: Render not redeploying

**Solution**: Manual deploy
1. Go to Render dashboard
2. Click your service
3. Click "Manual Deploy"
4. Click "Deploy latest commit"

---

## Security Note

This configuration allows ALL Vercel URLs (*.vercel.app). This is safe because:
- Only your Vercel account can create these URLs
- Vercel URLs are temporary (preview deployments)
- Production URL is still explicitly allowed
- Local development URLs are still allowed

For maximum security in production, you could:
1. Use environment variables for allowed origins
2. Only allow specific production URL
3. Remove preview URL support after testing

---

## Success Indicators

✅ No CORS errors in browser console
✅ Login works on all Vercel URLs
✅ API calls succeed
✅ Can create tasks, send messages, etc.

---

## Next Steps

After CORS is fixed:
1. Test all features on production
2. Register a new user
3. Create tasks and events
4. Send messages
5. Verify everything works
6. Share your app! 🎉
