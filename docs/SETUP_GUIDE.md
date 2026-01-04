# Quick Setup Guide

This guide will help you get your Digital Twin Portfolio running in under 15 minutes.

## Step-by-Step Checklist

### ☐ 1. Get Your API Keys (5 minutes)

#### Anthropic API Key
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys
4. Click "Create Key"
5. Copy your API key ✓

#### Google Cloud Setup
1. Visit https://console.cloud.google.com/
2. Create a new project
3. Enable these APIs:
   - Google Drive API
   - Google Docs API
4. Create OAuth 2.0 credentials:
   - Go to Credentials → Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3001/auth/google/callback`
5. Save your Client ID and Client Secret ✓

### ☐ 2. Prepare Your Content (2 minutes)

1. Create a new Google Doc
2. Format it like this:

```
BIO:
I'm a software developer passionate about AI and web technologies. 
I love building innovative products that solve real problems.

RESUME:
EXPERIENCE:
- Senior Developer at TechCo (2020-Present)
  Built scalable web applications using React and Node.js

- Junior Developer at StartupXYZ (2018-2020)
  Developed mobile apps and RESTful APIs

EDUCATION:
- BS Computer Science, University Name (2018)

SKILLS:
JavaScript, TypeScript, React, Node.js, Python, AI/ML
```

3. Copy the document ID from the URL ✓
   - URL looks like: `https://docs.google.com/document/d/YOUR_DOC_ID_HERE/edit`

### ☐ 3. Get Google Refresh Token (3 minutes)

Option A - Using OAuth Playground (Easier):

1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In Step 1, find and select:
   - `https://www.googleapis.com/auth/drive.readonly`
   - `https://www.googleapis.com/auth/documents.readonly`
6. Click "Authorize APIs"
7. Sign in with your Google account
8. Click "Exchange authorization code for tokens"
9. Copy the "Refresh token" ✓

Option B - Using the backend helper:

1. Set up backend .env with Client ID and Secret (skip refresh token for now)
2. Add a temporary route in `backend/src/server.ts`:

```typescript
app.get('/auth/setup', (req, res) => {
  const url = GoogleDriveService.generateAuthUrl();
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const token = await GoogleDriveService.getRefreshToken(code);
  res.send(`Your refresh token: ${token}`);
});
```

3. Start backend and visit `http://localhost:3001/auth/setup`
4. Copy the refresh token ✓

### ☐ 4. Configure Environment Variables (2 minutes)

#### Backend

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development

ANTHROPIC_API_KEY=sk-ant-xxxxx  # Your Anthropic key
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
GOOGLE_REFRESH_TOKEN=xxxxx  # Your refresh token
GOOGLE_DOC_ID=xxxxx  # Your Google Doc ID

FRONTEND_URL=http://localhost:3000
```

#### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### ☐ 5. Install and Run (3 minutes)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

Wait for: `DIGITAL TWIN API SERVER RUNNING` ✓

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Wait for: `Local: http://localhost:3000` ✓

### ☐ 6. Test It Out!

1. Open browser to http://localhost:3000
2. You should see a retro-styled chat interface
3. Try asking:
   - "Tell me about yourself"
   - "What's your experience?"
   - "What skills do you have?"

The AI should respond using info from your Google Doc! ✓

## Common Issues

### "Knowledge base not initialized"
- The backend couldn't load your Google Doc
- Check that all Google credentials are correct
- Verify the Google Doc ID is right
- Make sure the Doc is accessible by the Google account you authorized

### "Failed to get response from AI"
- Check your Anthropic API key is valid
- Verify you have API credits
- Check backend console for detailed errors

### Frontend shows "Failed to fetch"
- Make sure backend is running on port 3001
- Check `VITE_API_URL` in frontend/.env
- Verify CORS is configured correctly

### Google Auth errors
- Double-check your Client ID and Secret
- Verify redirect URI matches exactly
- Make sure you're using a refresh token, not an access token
- Check that Drive and Docs APIs are enabled

## Next Steps

Once everything is working:

1. **Customize the UI**: Edit colors in `frontend/tailwind.config.js`
2. **Improve the AI**: Modify system prompt in `backend/src/services/knowledgeBase.ts`
3. **Add more content**: Update your Google Doc with more details
4. **Deploy**: Follow deployment guide in README.md

## Need Help?

- Check the main README.md for detailed documentation
- Look at the Troubleshooting section
- Open a GitHub issue

Happy coding! 🚀
