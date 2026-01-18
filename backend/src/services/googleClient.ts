import { google } from "googleapis";
import config from "../config/env.js";

/**
 * Factory for creating authenticated Google API clients
 * Supports both Service Account (recommended) and OAuth2 authentication
 */
class GoogleClientFactory {
  private static authClient: any = null;

  /**
   * Get or create the authenticated Google client
   */
  static getAuthClient() {
    if (this.authClient) {
      return this.authClient;
    }

    // Option 1: Service Account (preferred - never expires)
    if (config.googleServiceAccountEmail && config.googleServiceAccountKey) {
      console.log("🔑 Using Google Service Account authentication");
      this.authClient = new google.auth.GoogleAuth({
        credentials: {
          client_email: config.googleServiceAccountEmail,
          private_key: config.googleServiceAccountKey.replace(/\\n/g, "\n"),
        },
        scopes: [
          "https://www.googleapis.com/auth/documents.readonly",
          "https://www.googleapis.com/auth/drive.readonly",
        ],
      });
    }
    // Option 2: OAuth2 with Refresh Token (fallback - can expire)
    else {
      console.log("🔑 Using Google OAuth2 authentication");
      const oauth2Client = new google.auth.OAuth2(
        config.googleClientId,
        config.googleClientSecret,
        config.googleRedirectUri,
      );

      oauth2Client.setCredentials({
        refresh_token: config.googleRefreshToken,
      });

      this.authClient = oauth2Client;
    }

    return this.authClient;
  }

  /**
   * Get Google Drive client
   */
  static getDriveClient() {
    const auth = this.getAuthClient();
    return google.drive({ version: "v3", auth });
  }

  /**
   * Get Google Docs client
   */
  static getDocsClient() {
    const auth = this.getAuthClient();
    return google.docs({ version: "v1", auth });
  }

  /**
   * Reset the cached auth client (useful for testing)
   */
  static reset() {
    this.authClient = null;
  }
}

export default GoogleClientFactory;
