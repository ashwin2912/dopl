import GoogleDriveService, { GoogleDocContent } from "./googleDrive.js";

export interface KnowledgeBase {
  name: string;
  bio: string;
  resume: string;
  systemPrompt: string;
  lastUpdated: Date;
}

class KnowledgeBaseService {
  private knowledgeBase: KnowledgeBase | null = null;
  private googleDriveService: GoogleDriveService;
  private updateInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.googleDriveService = new GoogleDriveService();
    this.initialize();
  }

  /**
   * Initialize and start periodic updates
   */
  private async initialize() {
    try {
      await this.updateKnowledgeBase();

      // Set up periodic updates
      setInterval(() => {
        this.updateKnowledgeBase().catch((error) => {
          console.error("Error updating knowledge base:", error);
        });
      }, this.updateInterval);
    } catch (error) {
      console.error("Failed to initialize knowledge base:", error);
      throw error;
    }
  }

  /**
   * Fetch latest content from Google Drive and update knowledge base
   */
  async updateKnowledgeBase(): Promise<void> {
    try {
      const content = await this.googleDriveService.fetchDocumentContent();

      this.knowledgeBase = {
        name: content.name,
        bio: content.bio,
        resume: content.resume,
        systemPrompt: this.buildSystemPrompt(content),
        lastUpdated: new Date(),
      };

      console.log(
        "Knowledge base updated successfully at",
        this.knowledgeBase.lastUpdated,
      );
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      throw error;
    }
  }

  /**
   * Build the system prompt for Claude AI
   */
  private buildSystemPrompt(content: GoogleDocContent): string {
    return `You are a digital twin AI assistant representing a real person. Your role is to answer questions about this person as if you ARE them, using first-person language.

IMPORTANT INSTRUCTIONS:
1. Always respond in the first person (I, me, my) as if you are the person
2. Only share information that is explicitly mentioned in the knowledge base below
3. If asked about something not in your knowledge base, politely say you don't have that information
4. Be conversational, friendly, and authentic
5. Do not make up or infer information that isn't in the knowledge base
6. Stay in character as the person at all times

KNOWLEDGE BASE:

=== BIO ===
${content.bio || "No bio information available."}

=== RESUME/CV ===
${content.resume || "No resume information available."}

Remember: You ARE this person. Respond naturally as them, but only using the information provided above.`;
  }

  /**
   * Get the current knowledge base
   */
  getKnowledgeBase(): KnowledgeBase {
    if (!this.knowledgeBase) {
      throw new Error("Knowledge base not initialized");
    }
    return this.knowledgeBase;
  }

  /**
   * Get the system prompt for Claude
   */
  getSystemPrompt(): string {
    return this.getKnowledgeBase().systemPrompt;
  }

  /**
   * Force refresh the knowledge base
   */
  async refresh(): Promise<void> {
    await this.updateKnowledgeBase();
  }
}

// Export singleton instance
export default new KnowledgeBaseService();
