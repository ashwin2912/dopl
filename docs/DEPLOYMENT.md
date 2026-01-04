# Deployment Guide

This guide covers deploying your Digital Twin Portfolio to production.

## Pre-Deployment Checklist

### Security

- [ ] Remove or comment out setup routes in `backend/src/server.ts`
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Use strong, unique API keys for production
- [ ] Set `NODE_ENV=production` in backend
- [ ] Update CORS to only allow your frontend domain
- [ ] Review all environment variables

### Testing

- [ ] Test the application locally end-to-end
- [ ] Verify Google Drive integration works
- [ ] Test AI responses are accurate
- [ ] Check error handling

## Frontend Deployment (Vercel)

Vercel is recommended for the React frontend.

### Step 1: Prepare Frontend

```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
cd frontend
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Set root directory to `frontend`
5. Framework preset: Vite
6. Build command: `npm run build`
7. Output directory: `dist`

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `VITE_API_URL` = Your backend URL (e.g., `https://your-backend.railway.app`)

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

## Backend Deployment (Railway)

Railway is recommended for the Node.js backend.

### Step 1: Prepare Backend

1. Ensure `package.json` has correct start script:
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

2. Build locally to verify:
```bash
cd backend
npm run build
```

### Step 2: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Set root directory: `backend`

### Step 3: Configure Environment Variables

In Railway dashboard, add all variables from `.env.example`:

```
PORT=3001
NODE_ENV=production
ANTHROPIC_API_KEY=sk-ant-xxxxx
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=https://your-backend-url.railway.app/auth/google/callback
GOOGLE_REFRESH_TOKEN=xxxxx
GOOGLE_DOC_ID=xxxxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 4: Deploy

Railway will automatically deploy. Check logs for any errors.

## Alternative: Backend on Render

### Step 1: Create New Web Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your repository
4. Configure:
   - Name: `digital-twin-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Step 2: Environment Variables

Add all variables from `.env.example` in Render dashboard.

### Step 3: Deploy

Click "Create Web Service"

## Alternative: Backend on Heroku

### Step 1: Create Procfile

In `backend/` directory:

```
web: npm start
```

### Step 2: Deploy

```bash
cd backend
heroku create your-app-name
heroku config:set ANTHROPIC_API_KEY=xxxxx
heroku config:set GOOGLE_CLIENT_ID=xxxxx
# ... set all other env vars
git push heroku main
```

## Post-Deployment

### Update Frontend CORS

In `backend/src/server.ts`, update CORS settings:

```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app',
  credentials: true,
}));
```

### Remove Setup Routes

In `backend/src/server.ts`, comment out:

```typescript
// SETUP ROUTES - REMOVED IN PRODUCTION
// app.use('/setup', authSetupRouter);
```

### Test Production

1. Visit your frontend URL
2. Try chatting with the AI
3. Check that responses are working
4. Monitor backend logs for errors

## Monitoring

### Railway

- View logs in Railway dashboard
- Set up log drains for external monitoring
- Configure health checks

### Vercel

- Check deployment logs
- View analytics in dashboard
- Set up monitoring alerts

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Production
```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

## Updating Your Google Doc

The backend automatically fetches updates from your Google Doc every 5 minutes. To change this:

In `backend/src/services/knowledgeBase.ts`:

```typescript
private updateInterval: number = 5 * 60 * 1000; // Change this value
```

## Custom Domain (Optional)

### Vercel Frontend

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Railway Backend

1. Go to Settings → Networking
2. Click "Generate Domain" or add custom domain
3. Update FRONTEND_URL environment variable
4. Update CORS settings in code

## Troubleshooting

### Build Failures

**Frontend:**
- Ensure all dependencies are in `package.json`
- Check TypeScript errors: `npm run build` locally
- Verify environment variables are set

**Backend:**
- Check TypeScript compilation: `npm run build` locally
- Verify all imports use `.js` extensions
- Ensure all environment variables are set

### Runtime Errors

**"Knowledge base not initialized"**
- Check Google credentials are correct
- Verify Google Doc ID is right
- Check backend logs for Google API errors

**CORS Errors**
- Verify FRONTEND_URL matches your actual frontend domain
- Check CORS configuration in `server.ts`
- Ensure credentials are enabled if needed

**API Rate Limits**
- Monitor Anthropic API usage
- Implement rate limiting if needed
- Consider caching common responses

## Scaling Considerations

### For High Traffic

1. **Add Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

2. **Cache Knowledge Base**
   - Already implemented with 5-minute refresh
   - Adjust interval as needed

3. **Add Authentication** (see Future Enhancements in README)

4. **Implement Request Queue**
   - Use Redis for queue management
   - Handle concurrent requests efficiently

### Database (Future)

For conversation history and user management:

- PostgreSQL for user data
- Redis for session management
- MongoDB for conversation logs

## Cost Estimation

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- 100 hours build time/month

**Railway:**
- $5 credit/month (covers small apps)

**Render:**
- Free tier available (spins down after inactivity)

**Anthropic API:**
- Pay per token
- Monitor usage at https://console.anthropic.com/

### Estimated Monthly Costs

For ~1000 conversations/month:
- Hosting: $5-10 (Railway/Render)
- Anthropic API: $5-20 (depending on usage)
- Total: ~$10-30/month

## Security Best Practices

1. **API Keys**
   - Never commit to Git
   - Use separate keys for dev/prod
   - Rotate regularly

2. **Rate Limiting**
   - Implement on all endpoints
   - Protect against abuse

3. **HTTPS**
   - Both platforms provide this automatically
   - Ensure redirect from HTTP to HTTPS

4. **Input Validation**
   - Validate all user inputs
   - Sanitize before sending to AI

5. **Error Messages**
   - Don't expose internal errors in production
   - Log detailed errors server-side only

## Rollback Strategy

### Vercel
- Click "Rollback" on any previous deployment

### Railway
- Redeploy from previous Git commit
- Or use Railway's deployment history

## Support

If you encounter issues:

1. Check platform-specific documentation
2. Review deployment logs
3. Test API endpoints individually
4. Verify all environment variables
5. Open a GitHub issue for project-specific help

---

Good luck with your deployment! 🚀
