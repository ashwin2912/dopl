import { google } from "googleapis";
import config from "../config/env.js";

export interface GoogleDocContent {
  name: string;
  bio: string;
  resume: string;
  rawContent: string;
}

class GoogleDriveService {
  private drive;
  private docs;

  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri,
    );

    oauth2Client.setCredentials({
      refresh_token: config.googleRefreshToken,
    });

    this.drive = google.drive({ version: "v3", auth: oauth2Client });
    this.docs = google.docs({ version: "v1", auth: oauth2Client });
  }

  /**
   * Fetch and parse content from Google Doc
   * Expected format in the Google Doc:
   *
   * BIO:
   * [bio content here]
   *
   * RESUME:
   * [resume/CV content here]
   */
  async fetchDocumentContent(): Promise<GoogleDocContent> {
    try {
      const response = await this.docs.documents.get({
        documentId: config.googleDocId,
      });

      const doc = response.data;
      let rawContent = "";

      // Extract text from the document
      if (doc.body?.content) {
        for (const element of doc.body.content) {
          if (element.paragraph?.elements) {
            for (const paragraphElement of element.paragraph.elements) {
              if (paragraphElement.textRun?.content) {
                rawContent += paragraphElement.textRun.content;
              }
            }
          }
        }
      }

      // Parse the content into name, bio and resume sections
      const { name, bio, resume } = this.parseContent(rawContent);

      return {
        name,
        bio,
        resume,
        rawContent,
      };
    } catch (error) {
      console.error("Error fetching Google Doc:", error);
      throw new Error("Failed to fetch document from Google Drive");
    }
  }

  /**
   * Parse raw content into structured sections
   */
  private parseContent(content: string): {
    name: string;
    bio: string;
    resume: string;
  } {
    const nameMatch = content.match(/NAME:\s*([\s\S]*?)(?=BIO:|RESUME:|$)/i);
    const bioMatch = content.match(/BIO:\s*([\s\S]*?)(?=RESUME:|$)/i);
    const resumeMatch = content.match(/RESUME:\s*([\s\S]*?)$/i);

    const name = nameMatch ? nameMatch[1].trim() : "";
    const bio = bioMatch ? bioMatch[1].trim() : "";
    const resume = resumeMatch ? resumeMatch[1].trim() : "";

    return { name, bio, resume };
  }

  /**
   * Generate OAuth URL for initial setup
   * This is a helper method for setting up the refresh token
   */
  static generateAuthUrl(): string {
    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri,
    );

    const scopes = [
      "https://www.googleapis.com/auth/documents.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ];

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });
  }

  /**
   * Exchange authorization code for refresh token
   * Helper method for initial OAuth setup
   */
  static async getRefreshToken(code: string): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleRedirectUri,
    );

    const { tokens } = await oauth2Client.getToken(code);
    return tokens.refresh_token || "";
  }
}

export default GoogleDriveService;
