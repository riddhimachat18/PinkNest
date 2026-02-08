# Vercel Deployment Fix - API Connection Issue

## Problem
Your Vercel app is trying to connect to `localhost:5000` instead of your deployed backend.

## Solution

### Step 1: Update API Configuration (Already Done)
The `src/services/api.js` file has been updated to use environment variables.

### Step 2: Deploy Your Backend First

#### Option A: Deploy to Render (Recommended - Free)

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `pinknest-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Add Environment Variables in Render:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://chaturvediriddhima18_db_user:AU0bTB5dvmhTr1Xh@userbase.jcuszgb.mongodb.net/?appName=UserBase
   JWT_SECRET=1260a5b688fcc33616df7a969a706101rcabcnk
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy your backend URL (e.g., `https://pinknest-backend.onrender.com`)

#### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)
6. In Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
7. Deploy and copy your URL

### Step 3: Configure Vercel Environment Variable

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api` (replace with your actual backend URL)
   - **Environment**: Production, Preview, Development (select all)

4. Click "Save"

### Step 4: Redeploy Your Vercel App

#### Option A: Through Vercel Dashboard
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"

#### Option B: Through Git Push
```bash
git add .
git commit -m "Configure production API URL"
git push origin main
```

Vercel will automatically redeploy.

### Step 5: Update CORS on Backend

After deploying backend, update `backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-vercel-app.vercel.app',  // Replace with your Vercel URL
    'http://localhost:8081'  // Keep for local development
  ],
  credentials: true
}));
```

Then commit and push to trigger backend redeployment.

---

## Quick Fix Commands

### 1. Update .env.production file
Edit `.env.production` and replace with your backend URL:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 2. Commit and push
```bash
git add .
git commit -m "Add production API URL"
git push origin main
```

### 3. Add environment variable in Vercel
- Go to Vercel Dashboard → Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
- Redeploy

---

## Verify It's Working

### Test Backend
```bash
curl https://your-backend-url.onrender.com/api/auth/me
```
Should return: `{"success":false,"message":"Not authorized to access this route"}`

### Test Frontend
1. Open your Vercel app
2. Open browser DevTools (F12) → Network tab
3. Try to login
4. Check the API call - it should go to your backend URL, not localhost

---

## Common Issues

### Issue 1: Backend URL not updating
**Solution**: Clear Vercel cache and redeploy
```bash
# In Vercel dashboard
Deployments → Click "..." → Redeploy → Clear cache and redeploy
```

### Issue 2: CORS errors
**Solution**: Add your Vercel URL to backend CORS whitelist
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:8081']
}));
```

### Issue 3: Environment variable not loading
**Solution**: Make sure variable name starts with `VITE_`
- ✅ Correct: `VITE_API_URL`
- ❌ Wrong: `API_URL` or `REACT_APP_API_URL`

---

## Current Status

✅ API service updated to use environment variables
✅ .env files created
⏳ Need to deploy backend
⏳ Need to add VITE_API_URL to Vercel
⏳ Need to update CORS on backend

---

## Your Backend Credentials (from .env)

```
MONGODB_URI=mongodb+srv://chaturvediriddhima18_db_user:AU0bTB5dvmhTr1Xh@userbase.jcuszgb.mongodb.net/?appName=UserBase
JWT_SECRET=1260a5b688fcc33616df7a969a706101rcabcnk
```

Use these when deploying to Render/Railway.

---

## Next Steps

1. **Deploy backend to Render** (follow Step 2 above)
2. **Copy your backend URL** (e.g., `https://pinknest-backend.onrender.com`)
3. **Add to Vercel**: 
   - Settings → Environment Variables
   - `VITE_API_URL` = `https://pinknest-backend.onrender.com/api`
4. **Redeploy Vercel app**
5. **Test login** - should work now!

---

## Need Help?

If you're stuck at any step, let me know:
- Which deployment platform you chose (Render/Railway)
- Your backend URL once deployed
- Any error messages you see
