# PinkNest - Deployment Guide

Complete guide for deploying your collaborative to-do list application to production.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ MongoDB Atlas account (or MongoDB instance)
- ✅ Git repository with your code
- ✅ Node.js 18+ installed locally
- ✅ All features tested locally

---

## Backend Deployment

### Option 1: Deploy to Render (Recommended - Free Tier Available)

#### Step 1: Prepare Backend
1. Ensure `backend/package.json` has a start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create `backend/.gitignore` if not exists:
```
node_modules/
.env
*.log
.DS_Store
```

#### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Configure:
   - **Name**: `pinknest-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://pinknest-backend.onrender.com`)

---

### Option 2: Deploy to Railway

#### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "Add variables" and add:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   ```

5. In Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

6. Deploy and copy your backend URL

---

### Option 3: Deploy to Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### Step 2: Create Heroku App
```bash
cd backend
heroku create pinknest-backend
```

#### Step 3: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
```

#### Step 4: Deploy
```bash
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a pinknest-backend
git push heroku main
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Update API URL
Edit `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

#### Step 2: Create `.env.production`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

#### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy"
7. Your app will be live at `https://your-app.vercel.app`

---

### Option 2: Deploy to Netlify

#### Step 1: Create `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

6. Click "Deploy site"

---

### Option 3: Deploy to GitHub Pages

#### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### Step 2: Update `package.json`
```json
{
  "homepage": "https://yourusername.github.io/pinknest",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Step 3: Update `vite.config.ts`
```typescript
export default defineConfig({
  base: '/pinknest/',
  // ... rest of config
});
```

#### Step 4: Deploy
```bash
npm run deploy
```

---

## Environment Configuration

### Backend Environment Variables

**Required Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_super_secret_random_string_min_32_chars
JWT_EXPIRE=7d
```

**Generate Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Environment Variables

**Required Variables:**
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## MongoDB Atlas Setup

### Step 1: Create Cluster
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/login
3. Create a free cluster (M0)
4. Choose a cloud provider and region

### Step 2: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Set privileges to "Read and write to any database"

### Step 3: Whitelist IP Addresses
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Add your current IP
4. For production: Add `0.0.0.0/0` (allow from anywhere)
   - **Note**: This is less secure but necessary for cloud deployments

### Step 4: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `pinknest`)

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/pinknest?retryWrites=true&w=majority
```

---

## Post-Deployment

### 1. Update CORS Settings

Edit `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:8081' // Keep for local development
  ],
  credentials: true
}));
```

### 2. Test Your Deployment

#### Test Backend
```bash
# Health check
curl https://your-backend-url.com/api/auth/me

# Should return 401 Unauthorized (expected without token)
```

#### Test Frontend
1. Visit your frontend URL
2. Register a new account
3. Create a task
4. Send a message
5. Check all features work

### 3. Monitor Your Application

**Render Dashboard:**
- View logs in real-time
- Monitor resource usage
- Check deployment status

**Vercel Dashboard:**
- View deployment logs
- Monitor analytics
- Check build status

### 4. Set Up Custom Domain (Optional)

#### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

#### For Render:
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records

---

## Security Checklist

Before going live, ensure:

- [ ] JWT_SECRET is a strong, random string (32+ characters)
- [ ] MongoDB connection string uses strong password
- [ ] CORS is configured to allow only your frontend domain
- [ ] Environment variables are set in production (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] HTTPS is enabled (automatic on Vercel/Render/Netlify)
- [ ] Input validation is working on backend
- [ ] Error messages don't expose sensitive information

---

## Performance Optimization

### Backend Optimizations

1. **Enable Compression:**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Rate Limiting:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Frontend Optimizations

1. **Already optimized with Vite:**
   - Code splitting
   - Tree shaking
   - Minification
   - Asset optimization

2. **Add loading states** (already implemented)
3. **Implement caching** with React Query (configured but can be enhanced)

---

## Troubleshooting

### Backend Issues

**Problem: MongoDB connection fails**
```
Solution:
1. Check MongoDB Atlas IP whitelist
2. Verify connection string format
3. Ensure database user has correct permissions
4. Check if cluster is active
```

**Problem: JWT authentication not working**
```
Solution:
1. Verify JWT_SECRET is set in environment
2. Check token is being sent in Authorization header
3. Ensure token format is "Bearer <token>"
4. Check token expiration
```

**Problem: CORS errors**
```
Solution:
1. Add frontend URL to CORS whitelist
2. Ensure credentials: true if using cookies
3. Check preflight OPTIONS requests are handled
```

### Frontend Issues

**Problem: API calls fail**
```
Solution:
1. Verify VITE_API_URL is set correctly
2. Check backend is running and accessible
3. Inspect network tab for actual error
4. Ensure CORS is configured on backend
```

**Problem: Build fails**
```
Solution:
1. Run `npm install` to ensure all dependencies
2. Check for TypeScript errors: `npm run build`
3. Verify all imports are correct
4. Check environment variables are set
```

**Problem: Routes not working (404 on refresh)**
```
Solution:
1. Ensure redirects are configured (netlify.toml or vercel.json)
2. For Vercel: Add vercel.json with rewrites
3. For Netlify: Ensure netlify.toml has redirects
```

---

## Monitoring & Maintenance

### Logging

**Backend Logging:**
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Error Tracking

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage tracking

---

## Backup Strategy

### Database Backups

**MongoDB Atlas:**
1. Go to "Backup" tab
2. Enable Cloud Backup (available on paid tiers)
3. Or use `mongodump` for manual backups:

```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/pinknest"
```

### Code Backups

- Keep code in GitHub/GitLab
- Tag releases: `git tag v1.0.0`
- Create branches for production: `git checkout -b production`

---

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Database connections maxed out

### Scaling Options

**Backend:**
- Upgrade Render/Railway instance
- Add Redis for caching
- Implement database indexing
- Use CDN for static assets

**Frontend:**
- Already scaled via CDN (Vercel/Netlify)
- Implement service workers for offline support
- Add lazy loading for routes

**Database:**
- Upgrade MongoDB Atlas tier
- Add database indexes
- Implement connection pooling

---

## Cost Estimates

### Free Tier (Suitable for MVP/Testing)

- **MongoDB Atlas**: Free (M0 - 512MB)
- **Render**: Free (750 hours/month, sleeps after 15 min inactivity)
- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Total**: $0/month

### Production Tier (Recommended for Live App)

- **MongoDB Atlas**: $9/month (M10 - 2GB)
- **Render**: $7/month (always-on instance)
- **Vercel**: Free (sufficient for most apps)
- **Total**: ~$16/month

---

## Deployment Checklist

### Pre-Deployment
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database migrations ready (if any)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Security review completed

### Deployment
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set
- [ ] Database connected
- [ ] CORS configured
- [ ] Custom domain configured (optional)

### Post-Deployment
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Create backup strategy
- [ ] Document deployment process
- [ ] Share app with users!

---

## Quick Deploy Commands

### Deploy Backend to Render
```bash
# Push to GitHub
git add .
git commit -m "Deploy backend"
git push origin main

# Render will auto-deploy from GitHub
```

### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## Support & Resources

### Documentation
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Express.js Docs](https://expressjs.com/)
- [Vite Docs](https://vitejs.dev/)

### Community
- [Stack Overflow](https://stackoverflow.com/)
- [MongoDB Community](https://www.mongodb.com/community)
- [React Community](https://react.dev/community)

---

## 🎉 Congratulations!

Your PinkNest app is now deployed and ready for users!

**Next Steps:**
1. Share your app URL with team members
2. Gather user feedback
3. Monitor performance and errors
4. Iterate and improve

**Your Deployed URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/api`

Happy deploying! 🚀
