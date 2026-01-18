import express from "express";
import BlogService from "../services/blog.js";
import { readRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const blogService = new BlogService();

/**
 * GET /api/blog/topics
 * List all blog topics (Google Docs from configured folder)
 * Protected by: Read rate limit (100/hour per IP)
 */
router.get("/topics", readRateLimiter, async (req, res, next) => {
  try {
    const topics = await blogService.listBlogTopics();

    res.json({
      topics,
      count: topics.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/blog/topics/:docId
 * Get a specific blog topic with all its paragraphs
 * Protected by: Read rate limit (100/hour per IP)
 */
router.get("/topics/:docId", readRateLimiter, async (req, res, next) => {
  try {
    const { docId } = req.params;
    const topic = await blogService.getBlogTopic(docId);

    res.json(topic);
  } catch (error) {
    next(error);
  }
});

export default router;
