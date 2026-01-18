import config from "../config/env.js";
import GoogleClientFactory from "./googleClient.js";

export interface BlogParagraph {
  id: string;
  heading: string;
  content: string;
}

export interface BlogTopic {
  id: string;
  title: string;
  docId: string;
  paragraphs?: BlogParagraph[];
}

class BlogService {
  private drive;
  private docs;

  constructor() {
    this.drive = GoogleClientFactory.getDriveClient();
    this.docs = GoogleClientFactory.getDocsClient();
  }

  /**
   * List all Google Docs in the configured blog folder
   * Each doc represents a blog topic
   */
  async listBlogTopics(): Promise<BlogTopic[]> {
    try {
      const folderId = config.googleBlogFolderId;

      // Query for all Google Docs in the specified folder
      const query = `'${folderId}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`;

      const response = await this.drive.files.list({
        q: query,
        fields: "files(id, name)",
        orderBy: "modifiedTime desc",
      });

      const files = response.data.files || [];

      return files.map((file) => ({
        id: file.id || "",
        title: file.name || "Untitled",
        docId: file.id || "",
      }));
    } catch (error) {
      console.error("Error listing blog topics:", error);
      throw new Error("Failed to fetch blog topics from Google Drive");
    }
  }

  /**
   * Fetch a single blog topic with its paragraphs
   * Each tab in the doc becomes a paragraph
   */
  async getBlogTopic(docId: string): Promise<BlogTopic> {
    try {
      console.log(`Fetching blog topic: ${docId}`);

      // Fetch document with tabs content included
      const response: any = await this.docs.documents.get({
        documentId: docId,
        includeTabsContent: true,
      } as any);

      const doc = response.data;
      const title = doc.title || "Untitled";
      const paragraphs: BlogParagraph[] = [];

      console.log(`Document title: ${title}`);
      console.log(`Document has ${doc.tabs?.length || 0} tabs`);

      // Process each tab as a paragraph
      if (doc.tabs && doc.tabs.length > 0) {
        for (const tab of doc.tabs) {
          const tabTitle = tab.tabProperties?.title || "Untitled Tab";
          const tabId = tab.tabProperties?.tabId || "";
          let tabContent = "";

          console.log(`Processing tab: ${tabTitle} (ID: ${tabId})`);

          // Extract text from the tab's document content
          if (tab.documentTab?.body?.content) {
            for (const element of tab.documentTab.body.content) {
              if (element.paragraph?.elements) {
                for (const paragraphElement of element.paragraph.elements) {
                  if (paragraphElement.textRun?.content) {
                    tabContent += paragraphElement.textRun.content;
                  }
                }
              }
            }
          }

          if (tabContent.trim()) {
            paragraphs.push({
              id: tabId,
              heading: tabTitle,
              content: tabContent.trim(),
            });
          }
        }
      } else {
        // Fallback: if no tabs, use the document body as a single paragraph
        console.log("No tabs found, using document body");
        let bodyContent = "";

        if (doc.body?.content) {
          for (const element of doc.body.content) {
            if (element.paragraph?.elements) {
              for (const paragraphElement of element.paragraph.elements) {
                if (paragraphElement.textRun?.content) {
                  bodyContent += paragraphElement.textRun.content;
                }
              }
            }
          }
        }

        if (bodyContent.trim()) {
          paragraphs.push({
            id: "default",
            heading: title,
            content: bodyContent.trim(),
          });
        }
      }

      console.log(`Found ${paragraphs.length} paragraphs from tabs`);

      return {
        id: docId,
        title,
        docId,
        paragraphs,
      };
    } catch (error) {
      console.error("Error fetching blog topic:", error);
      throw new Error("Failed to fetch blog topic from Google Drive");
    }
  }
}

export default BlogService;
