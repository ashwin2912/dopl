import express, { Request, Response } from 'express';
import GoogleDriveService from '../services/googleDrive.js';

const router = express.Router();

/**
 * SETUP ROUTES - Only use these during initial OAuth setup
 * Remove or comment out these routes in production!
 */

/**
 * GET /setup/google-auth
 * Generates and redirects to Google OAuth URL
 */
router.get('/google-auth', (req: Request, res: Response) => {
  try {
    const authUrl = GoogleDriveService.generateAuthUrl();
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google OAuth Setup</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #c0c0c0;
            }
            .container {
              background: white;
              padding: 30px;
              border: 2px solid black;
              box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
            }
            h1 { color: #333; }
            a {
              display: inline-block;
              background: #0000ff;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border: 2px solid black;
              margin-top: 20px;
            }
            a:hover { background: #0000cc; }
            .warning {
              background: #ffff00;
              padding: 10px;
              border: 2px solid #000;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔐 Google OAuth Setup</h1>
            <p>Click the link below to authorize your application to access Google Drive and Docs.</p>

            <div class="warning">
              ⚠️ <strong>Important:</strong> Make sure you sign in with the Google account that has access to your portfolio Google Doc!
            </div>

            <a href="${authUrl}" target="_blank">
              AUTHORIZE WITH GOOGLE →
            </a>

            <h3>Steps:</h3>
            <ol>
              <li>Click the authorization link above</li>
              <li>Sign in to your Google account</li>
              <li>Grant the requested permissions</li>
              <li>You'll be redirected back with your refresh token</li>
              <li>Copy the refresh token to your .env file</li>
            </ol>

            <div class="warning">
              ⚠️ <strong>Security Note:</strong> Remove or comment out these setup routes before deploying to production!
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).send('Error generating authentication URL');
  }
});

/**
 * GET /setup/callback
 * OAuth callback - exchanges code for refresh token
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (!code) {
      res.status(400).send('No authorization code provided');
      return;
    }

    const refreshToken = await GoogleDriveService.getRefreshToken(code);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Success</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #c0c0c0;
            }
            .container {
              background: white;
              padding: 30px;
              border: 2px solid black;
              box-shadow: 4px 4px 0 rgba(0,0,0,0.3);
            }
            h1 { color: #00ff00; }
            .token {
              background: #f0f0f0;
              padding: 15px;
              border: 1px solid #333;
              font-family: monospace;
              word-break: break-all;
              margin: 20px 0;
            }
            .instructions {
              background: #ffffcc;
              padding: 15px;
              border: 2px solid #000;
              margin: 20px 0;
            }
            button {
              background: #0000ff;
              color: white;
              padding: 10px 20px;
              border: 2px solid black;
              cursor: pointer;
              font-family: 'Courier New', monospace;
            }
            button:hover { background: #0000cc; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Authorization Successful!</h1>

            <p>Your refresh token has been generated. Copy it to your <code>backend/.env</code> file:</p>

            <div class="token" id="token">${refreshToken}</div>

            <button onclick="copyToken()">📋 COPY TOKEN</button>

            <div class="instructions">
              <h3>Next Steps:</h3>
              <ol>
                <li>Copy the token above</li>
                <li>Open <code>backend/.env</code></li>
                <li>Set <code>GOOGLE_REFRESH_TOKEN=</code> to this value</li>
                <li>Restart your backend server</li>
                <li>Your Digital Twin should now be able to access your Google Doc! 🎉</li>
              </ol>
            </div>

            <div class="warning" style="background: #ff6b6b; color: white; padding: 15px; border: 2px solid #000;">
              🔒 <strong>Security:</strong> Keep this token secret! Don't commit it to Git or share it publicly.
            </div>
          </div>

          <script>
            function copyToken() {
              const tokenText = document.getElementById('token').textContent;
              navigator.clipboard.writeText(tokenText).then(() => {
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: monospace; padding: 50px;">
          <h1 style="color: red;">❌ Error</h1>
          <p>Failed to exchange authorization code for refresh token.</p>
          <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p><a href="/setup/google-auth">← Try Again</a></p>
        </body>
      </html>
    `);
  }
});

export default router;
