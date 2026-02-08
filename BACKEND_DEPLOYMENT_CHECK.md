# Backend Deployment Verification & Fix

## Current Issue
Getting 404 errors on `/api/auth/login` - This means the backend URL is wrong or backend isn't deployed.

---

## ✅ Step-by-Step Fix

### Step 1: Check if Backend is Deployed

Open these URLs in your browser:

**Test 1: Root URL**
```
https://pinknest-backend.onrender.com
```
Should see: Some response (not 404)

**Test 2: API Endpoint**
```
https://pinknest-backend.onrender.com/api/auth/me
```
Should see: `{"success":false,"message":"Not authorized to access this route"}`

**If you get 404 on both** → Backend is NOT deployed yet

---

## 🚀 Deploy Backend to Render (5 Minutes)

### Option 1: Deploy via Render Dashboard

1. **Go to Render**: https://render.com
2. **Sign in** with GitHub
3. **New Web Service**: Click "New +" → "Web Service"
4. **Connect Repository**: 
   - Click "Connect account" if needed
   - Select repository: `riddhimachat18/PinkNest`
   - Click "Connect"

5. **Configure Service**:
   ```
   Name: pinknest-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" for each:
   
   ```
   PORT = 5000
   ```
   ```
   MONGODB_URI = mongodb+srv://chaturvediriddhima18_db_user:AU0bTB5dvmhTr1Xh@userbase.jcuszgb.mongodb.net/?appName=UserBase
   ```
   ```
   JWT_SECRET = 1260a5b688fcc33616df7a969a706101rcabcnk
   ```
   ```
   JWT_EXPIRE = 7d
   ```
   ```
   NODE_ENV = production
   ```

7. **Create Web Service**: Click "Create Web Service"

8. **Wait for Deployment**: 
   - Watch the logs (5-10 minutes)
   - Look for "MongoDB connected successfully"
   - Look for "Server running on port 5000"

9. **Copy Your URL**: 
   - At the top of the page, you'll see your URL
   - Example: `https://pinknest-backend-abc123.onrender.com`
   - **IMPORTANT**: Copy this exact URL!

---

### Option 2: Deploy via Render Blueprint (Faster)

1. Create `render.yaml` in your project root:

```yaml
services:
  - type: web
    name: pinknest-backend
    runtime: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 5000
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRE
        value: 7d
```

2. Push to GitHub:
```bash
git add render.yaml
git commit -m "Add Render blueprint"
git push origin main
```

3. Go to Render → "New +" → "Blueprint"
4. Connect your repo
5. Add the secret environment variables manually
6. Deploy

---

## 📝 After Backend is Deployed

### Step 1: Verify Backend Works

Test in browser or terminal:

```bash
# Test 1: Health check
curl https://YOUR-BACKEND-URL.onrender.com/api/auth/me

# Should return:
# {"success":false,"message":"Not authorized to access this route"}
```

### Step 2: Update .env.production

Edit `.env.production` with your ACTUAL backend URL:

```env
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

**Example**:
```env
VITE_API_URL=https://pinknest-backend-abc123.onrender.com/api
```

### Step 3: Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Select "pink-nest" project
3. Settings → Environment Variables
4. **If variable exists**: Click "Edit" and update the value
5. **If variable doesn't exist**: Click "Add New"
   ```
   Name: VITE_API_URL
   Value: https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
   Environments: Production, Preview, Development (select all)
   ```
6. Click "Save"

### Step 4: Commit and Push

```bash
git add .env.production
git commit -m "Update production backend URL"
git push origin main
```

### Step 5: Redeploy Vercel

**Option A**: Automatic (wait 1-2 minutes for auto-deploy)

**Option B**: Manual
1. Go to Vercel → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Check "Clear cache and redeploy"
5. Click "Redeploy"

---

## 🔍 Troubleshooting

### Issue: Render deployment fails

**Check Logs**:
1. Go to Render dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for errors

**Common Issues**:

1. **"Cannot find module"**
   - Solution: Make sure `Root Directory` is set to `backend`

2. **"MongoDB connection error"**
   - Solution: Check MongoDB Atlas IP whitelist
   - Add `0.0.0.0/0` to allow all IPs

3. **"Port already in use"**
   - Solution: Make sure `PORT` environment variable is set to `5000`

### Issue: Backend deploys but returns 404

**Check**:
1. Root Directory is `backend` (not empty)
2. Start Command is `npm start` (not `node server.js`)
3. `backend/package.json` has:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

### Issue: Vercel still shows old URL

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check DevTools → Network tab for actual URL being called
4. Verify `VITE_API_URL` is set in Vercel
5. Redeploy with cache cleared

---

## 📊 Deployment Checklist

### Backend (Render)
- [ ] Service created on Render
- [ ] Root Directory set to `backend`
- [ ] All environment variables added
- [ ] Deployment successful (check logs)
- [ ] MongoDB connected (check logs)
- [ ] Server running (check logs)
- [ ] URL copied (e.g., `https://pinknest-backend-xyz.onrender.com`)
- [ ] Test endpoint works: `/api/auth/me` returns 401 error

### Frontend (Vercel)
- [ ] `.env.production` updated with real backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] `VITE_API_URL` added to Vercel environment variables
- [ ] Vercel redeployed
- [ ] Test login on https://pink-nest.vercel.app
- [ ] No CORS errors in console
- [ ] No 404 errors in console
- [ ] Login works!

---

## 🎯 Quick Test Commands

### Test Backend Locally
```bash
cd backend
npm start
# Should see: "Server running on port 5000"
# Should see: "MongoDB connected successfully"
```

### Test Backend on Render
```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/auth/me
# Should return: {"success":false,"message":"Not authorized..."}
```

### Test Frontend Locally
```bash
npm run dev
# Open http://localhost:8081
# Try to login
# Should work if backend is running
```

---

## 🆘 Still Stuck?

Tell me:
1. **Have you deployed backend to Render?** (Yes/No)
2. **If yes, what's your backend URL?**
3. **What do you see when you visit**: `https://YOUR-BACKEND-URL.onrender.com/api/auth/me`
4. **What's in your `.env.production` file?**
5. **Screenshot of Vercel environment variables?**

---

## 💡 Pro Tips

1. **Render Free Tier**: Spins down after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - Keep backend awake with a cron job (optional)

2. **Check Render Logs**: Always check logs when something doesn't work
   - Render Dashboard → Your Service → Logs

3. **Environment Variables**: Make sure they're set in Render, not just in `.env`
   - Render doesn't read `.env` files
   - Must add each variable manually in dashboard

4. **CORS**: Already fixed in your `backend/server.js`
   - Allows requests from `https://pink-nest.vercel.app`

---

## ✅ Success Indicators

When everything works, you should see:

**In Browser Console (F12)**:
- ✅ No CORS errors
- ✅ No 404 errors
- ✅ API calls go to your Render URL
- ✅ Login returns 200 status

**In Render Logs**:
- ✅ "MongoDB connected successfully"
- ✅ "Server running on port 5000"
- ✅ No error messages

**In Your App**:
- ✅ Can register new user
- ✅ Can login
- ✅ Redirects to dashboard
- ✅ Can create tasks
- ✅ Can send messages

---

## 🎉 Next Steps After Success

1. Test all features on production
2. Share app with friends
3. Monitor Render logs for errors
4. Consider upgrading to paid tier for always-on backend
5. Add custom domain (optional)
6. Set up monitoring (optional)
