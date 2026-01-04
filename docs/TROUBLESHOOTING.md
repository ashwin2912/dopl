# Troubleshooting Guide

Common issues and solutions for the Digital Twin Portfolio.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Google Drive Issues](#google-drive-issues)
- [Claude API Issues](#claude-api-issues)
- [General Issues](#general-issues)

---

## Installation Issues

### `npm install` fails

**Problem**: Dependencies fail to install

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

### Node version issues

**Problem**: "Unsupported engine" error

**Solution**:
```bash
# Check your Node version
node --version

# You need Node 20+. Install nvm if you don't have it:
# https://github.com/nvm-sh/nvm

# Then install Node 20:
nvm install 20
nvm use 20
```

---

## Backend Issues

### "Knowledge base not initialized"

**Problem**: Backend can't load knowledge base from Google Doc

**Check**:
1. Is your `GOOGLE_DOC_ID` correct?
   ```bash
   # Should look like: 1AbC_dEfGhIjKlMnOpQrStUvWxYz
   echo $GOOGLE_DOC_ID
   ```

2. Is your Google Doc accessible?
   - Open the Google Doc in a browser
   - Make sure you're signed in with the same account used for OAuth
   - Check sharing settings

3. Are your Google credentials valid?
   ```bash
   # Check these are set:
   echo $GOOGLE_CLIENT_ID
   echo $GOOGLE_CLIENT_SECRET
   echo $GOOGLE_REFRESH_TOKEN
   ```

4. Check backend logs:
   ```bash
   cd backend
   npm run dev
   # Look for "Knowledge base updated successfully"
   ```

**Solution**:
```bash
# Test your refresh token by visiting:
http://localhost:3001/setup/google-auth

# Get a new refresh token if needed
```

### "Failed to get response from AI"

**Problem**: Claude API calls failing

**Check**:
1. Is your Anthropic API key valid?
   ```bash
   echo $ANTHROPIC_API_KEY
   ```

2. Do you have API credits?
   - Visit https://console.anthropic.com/
   - Check your usage and billing

3. Check the error in backend logs:
   ```bash
   # Look for specific error messages from Anthropic SDK
   ```

**Common errors**:
- `401 Unauthorized`: Invalid API key
- `429 Too Many Requests`: Rate limited
- `402 Payment Required`: No credits

### Port already in use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or use a different port in .env
PORT=3002
```

### TypeScript compilation errors

**Problem**: `tsc` fails to compile

**Solution**:
```bash
cd backend
npm run build

# Fix any TypeScript errors shown
# Common issues:
# - Missing .js extensions in imports
# - Type mismatches
# - Missing dependencies
```

---

## Frontend Issues

### "Failed to fetch" or CORS errors

**Problem**: Frontend can't connect to backend

**Check**:
1. Is backend running?
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok",...}
   ```

2. Is `VITE_API_URL` set correctly?
   ```bash
   # In frontend/.env
   VITE_API_URL=http://localhost:3001
   ```

3. Check CORS configuration in `backend/src/server.ts`:
   ```typescript
   app.use(cors({
     origin: 'http://localhost:3000', // Must match frontend URL
     credentials: true,
   }));
   ```

**Solution**:
```bash
# Restart both servers
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### Vite build fails

**Problem**: `npm run build` fails in frontend

**Solution**:
```bash
# Check TypeScript errors
cd frontend
npm run build

# Common issues:
# - Unused imports (remove them)
# - Type errors (fix type mismatches)
# - Missing dependencies (npm install)
```

### Blank page / White screen

**Problem**: Frontend loads but shows nothing

**Check**:
1. Browser console for errors (F12)
2. Network tab for failed requests

**Solution**:
```bash
# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Restart dev server
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Styling issues

**Problem**: Retro styling not appearing

**Solution**:
```bash
# Make sure Tailwind is configured
cd frontend
npm install -D tailwindcss postcss autoprefixer

# Check that index.css imports Tailwind
cat src/index.css
# Should have: @tailwind base; @tailwind components; @tailwind utilities;
```

---

## Google Drive Issues

### "Invalid credentials"

**Problem**: Google authentication failing

**Solutions**:

1. **Check OAuth credentials**:
   - Go to Google Cloud Console
   - Verify Client ID and Secret
   - Check redirect URI matches exactly

2. **Regenerate refresh token**:
   ```bash
   # Start backend
   cd backend && npm run dev
   
   # Visit in browser
   http://localhost:3001/setup/google-auth
   
   # Follow OAuth flow
   # Copy new refresh token to .env
   ```

3. **Check API enablement**:
   - Google Cloud Console → APIs & Services
   - Ensure enabled:
     - Google Drive API ✓
     - Google Docs API ✓

### "Access denied" or "Permission denied"

**Problem**: Can't access Google Doc

**Check**:
1. Are you using the correct Google account?
   - The account that authorized OAuth
   - Should have access to the Doc

2. Is the Doc ID correct?
   - From URL: `https://docs.google.com/document/d/DOC_ID_HERE/edit`
   - Should be alphanumeric string

3. Doc sharing settings:
   - Doc must be accessible by the authorized account
   - Private docs require account to have explicit access

**Solution**:
```bash
# Try accessing the doc manually
# Sign in to Google with the authorized account
# Visit: https://docs.google.com/document/d/YOUR_DOC_ID/edit
# If you can't access it, sharing settings need updating
```

### "Invalid refresh token"

**Problem**: Refresh token expired or invalid

**Solution**:
```bash
# Refresh tokens can expire. Get a new one:

# Option 1: OAuth Playground
# https://developers.google.com/oauthplayground

# Option 2: Setup route
http://localhost:3001/setup/google-auth

# Update .env with new token
GOOGLE_REFRESH_TOKEN=new_token_here

# Restart backend
```

---

## Claude API Issues

### Rate limiting

**Problem**: "429 Too Many Requests"

**Solution**:
```typescript
// Add rate limiting in backend/src/routes/chat.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5 // 5 requests per minute
});

router.post('/', limiter, async (req, res) => {
  // ... existing code
});
```

### Token limit exceeded

**Problem**: "Maximum tokens exceeded"

**Solution**:
```typescript
// In backend/src/services/claude.ts
// Reduce max_tokens or conversation history

// Limit history
const recentHistory = conversationHistory.slice(-5); // Only last 5 messages

// Reduce max tokens
max_tokens: 512 // Instead of 1024
```

### Slow responses

**Problem**: AI takes too long to respond

**Solutions**:

1. **Reduce max tokens**:
```typescript
max_tokens: 512 // Faster but shorter responses
```

2. **Implement streaming** (already available):
```typescript
// In frontend, implement SSE for streaming responses
// Use claude.ts streamChat() method
```

3. **Add loading indicators** (already implemented):
- Typing indicator shows while waiting
- User knows something is happening

---

## General Issues

### Environment variables not loading

**Problem**: `.env` variables are undefined

**Check**:
```bash
# Backend: .env must be in backend/ directory
ls backend/.env

# Frontend: .env must be in frontend/ directory
ls frontend/.env

# Variables must be prefixed with VITE_ in frontend
# ✅ VITE_API_URL
# ❌ API_URL
```

**Solution**:
```bash
# Restart dev servers after changing .env
# Environment variables are loaded at startup
```

### Different behavior in development vs production

**Problem**: Works locally but not in production

**Check**:
1. Environment variables set in hosting platform
2. CORS allows production frontend URL
3. API URLs point to production backend
4. `NODE_ENV=production` is set

**Solution**:
```typescript
// Update CORS for production in backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL, // Should be production URL
  credentials: true,
}));
```

### Memory issues / Performance

**Problem**: Application is slow or crashes

**Solutions**:

1. **Limit conversation history**:
```typescript
// In backend/src/routes/chat.ts
const recentHistory = conversationHistory.slice(-10);
```

2. **Increase knowledge base refresh interval**:
```typescript
// In backend/src/services/knowledgeBase.ts
private updateInterval: number = 30 * 60 * 1000; // 30 minutes instead of 5
```

3. **Monitor memory usage**:
```bash
# Check Node.js memory
node --max-old-space-size=512 dist/server.js
```

---

## Debugging Tips

### Enable verbose logging

**Backend**:
```typescript
// In backend/src/server.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
});
```

**Frontend**:
```typescript
// In frontend/src/api.ts
console.log('Sending request:', { message, conversationHistory });
console.log('Response:', data);
```

### Test API endpoints directly

```bash
# Health check
curl http://localhost:3001/health

# Chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","conversationHistory":[]}'
```

### Check browser console

Press F12 in browser:
- Console tab: JavaScript errors
- Network tab: API requests
- Application tab: Local storage, cookies

### Use debugging tools

**Backend**:
```bash
# Run with debugger
cd backend
node --inspect dist/server.js

# Or use VS Code debugger
# Add breakpoints and press F5
```

---

## Still Having Issues?

1. **Check logs**:
   - Backend console output
   - Browser console (F12)
   - Network requests in DevTools

2. **Search existing issues**:
   - GitHub Issues
   - Stack Overflow

3. **Create minimal reproduction**:
   - Isolate the problem
   - Test with minimal code

4. **Ask for help**:
   - Open GitHub issue
   - Include error messages
   - Share relevant code snippets
   - Describe what you've tried

---

## Quick Diagnostic Checklist

When something's not working:

- [ ] Backend server is running
- [ ] Frontend server is running  
- [ ] All environment variables are set
- [ ] Google credentials are valid
- [ ] Anthropic API key is valid
- [ ] Google Doc is accessible
- [ ] Doc has correct format (BIO: and RESUME: sections)
- [ ] CORS is configured correctly
- [ ] Ports are not in use by other processes
- [ ] npm dependencies are installed
- [ ] No TypeScript compilation errors
- [ ] Browser console shows no errors
- [ ] Network requests are succeeding (check DevTools)

Run through this checklist first - it solves 90% of issues!
