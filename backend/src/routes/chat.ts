import express, { Request, Response } from "express";
import claudeService, { ConversationMessage } from "../services/claude.js";
import knowledgeBaseService from "../services/knowledgeBase.js";
import moderationService from "../services/moderation.js";
import captchaService from "../services/captcha.js";
import {
  chatRateLimiter,
  chatGlobalRateLimiter,
  readRateLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

interface ChatRequest {
  message: string;
  conversationHistory?: ConversationMessage[];
  captchaToken?: string;
}

interface ChatResponse {
  response: string;
}

/**
 * POST /api/chat
 * Send a message to the AI and get a response
 * Protected by: Global rate limit (200/hour) + Per-IP rate limit (15/hour)
 */
router.post(
  "/",
  chatGlobalRateLimiter, // Apply global limit first
  chatRateLimiter, // Then per-IP limit
  async (req: Request<{}, {}, ChatRequest>, res: Response<ChatResponse>) => {
    try {
      const { message, conversationHistory = [], captchaToken } = req.body;

      // Validate request
      if (!message || typeof message !== "string") {
        res.status(400).json({
          response: "Invalid request: message is required",
        } as any);
        return;
      }

      // Verify CAPTCHA token
      if (!captchaToken) {
        res.status(400).json({
          response:
            "CAPTCHA verification required. Please refresh the page and try again.",
        } as any);
        return;
      }

      const isCaptchaValid = await captchaService.verifyToken(captchaToken);
      if (!isCaptchaValid) {
        res.status(400).json({
          response:
            "CAPTCHA verification failed. You might be a bot. Please refresh and try again.",
        } as any);
        return;
      }

      // Moderate the question
      console.log("[MODERATION] Starting moderation check...");
      console.log("[MODERATION] Message:", message.substring(0, 100));

      const kb = knowledgeBaseService.getKnowledgeBase();
      console.log("[MODERATION] User name from KB:", kb.name);

      const moderation = await moderationService.moderateQuestion(
        message,
        kb.name,
      );

      console.log("[MODERATION] Result:", JSON.stringify(moderation));

      if (!moderation.allowed) {
        console.log(
          "[MODERATION] Question blocked -",
          moderation.category,
          ":",
          moderation.reason,
        );

        let errorMessage =
          "I'm here to answer questions about my professional background and work.";

        if (moderation.category === "inappropriate") {
          errorMessage =
            "I can't respond to inappropriate content. Please keep questions professional and respectful.";
        } else if (moderation.category === "off-topic") {
          errorMessage =
            "I'm here to discuss my professional background, skills, and projects. Let's keep the conversation focused on that!";
        } else if (moderation.category === "spam") {
          errorMessage =
            "Please avoid spam or promotional content. Ask me about my work or experience instead!";
        }

        res.status(400).json({
          response: errorMessage,
        } as any);
        return;
      }

      console.log("[MODERATION] Question approved, proceeding to chat...");

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
 * Protected by: Read rate limit (100/hour per IP)
 */
router.get("/bio", readRateLimiter, (req: Request, res: Response) => {
  try {
    const kb = knowledgeBaseService.getKnowledgeBase();
    res.json({
      name: kb.name,
      bio: kb.bio,
      lastUpdated: kb.lastUpdated,
    });

    // Refresh knowledge base in the background on each visit
    knowledgeBaseService.refresh().catch((error) => {
      console.error("Background knowledge base refresh failed:", error);
    });
  } catch (error) {
    console.error("Error fetching bio:", error);
    res.status(500).json({
      error: "Failed to fetch bio information",
    });
  }
});

export default router;
