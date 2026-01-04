import express, { Request, Response } from "express";
import claudeService, { ConversationMessage } from "../services/claude.js";
import knowledgeBaseService from "../services/knowledgeBase.js";

const router = express.Router();

interface ChatRequest {
  message: string;
  conversationHistory?: ConversationMessage[];
}

interface ChatResponse {
  response: string;
}

/**
 * POST /api/chat
 * Send a message to the AI and get a response
 */
router.post(
  "/",
  async (req: Request<{}, {}, ChatRequest>, res: Response<ChatResponse>) => {
    try {
      const { message, conversationHistory = [] } = req.body;

      // Validate request
      if (!message || typeof message !== "string") {
        res.status(400).json({
          response: "Invalid request: message is required",
        } as any);
        return;
      }

      // FUTURE: Add authentication check here
      // const userId = req.user?.id;
      // if (!userId) {
      //   return res.status(401).json({ response: 'Unauthorized' });
      // }

      // FUTURE: Check user's conversation limits/credits
      // const hasCredits = await checkUserCredits(userId);
      // if (!hasCredits) {
      //   return res.status(403).json({
      //     response: 'You have reached your message limit. Please upgrade your plan.'
      //   });
      // }

      // Limit conversation history to last 10 messages to manage context
      const recentHistory = conversationHistory.slice(-10);

      // Get response from Claude
      const response = await claudeService.chat(message, recentHistory);

      // FUTURE: Decrement user's credits
      // await decrementUserCredits(userId);

      // FUTURE: Log conversation for analytics
      // await logConversation(userId, message, response);

      res.json({ response });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({
        response: "Sorry, I encountered an error. Please try again later.",
      } as any);
    }
  },
);

/**
 * GET /api/chat/health
 * Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/chat/bio
 * Get the bio information from the knowledge base
 */
router.get("/bio", (req: Request, res: Response) => {
  try {
    const kb = knowledgeBaseService.getKnowledgeBase();
    res.json({
      name: kb.name,
      bio: kb.bio,
      lastUpdated: kb.lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching bio:", error);
    res.status(500).json({
      error: "Failed to fetch bio information",
    });
  }
});

export default router;
