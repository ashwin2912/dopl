import rateLimit from "express-rate-limit";

/**
 * Rate limiter for chat endpoint
 * 15 messages per hour per IP (allows real conversations)
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // 15 requests per hour per IP
  message: {
    response:
      "You've sent too many messages. Please wait a bit before trying again. (Limit: 15 messages per hour)",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipFailedRequests: true, // Don't count failed requests (e.g., moderation blocks)
  handler: (req, res) => {
    console.log(`[RATE LIMIT] Chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      response:
        "You've sent too many messages. Please wait a bit before trying again. (Limit: 15 messages per hour)",
    });
  },
});

/**
 * Global rate limiter for chat endpoint
 * 200 total messages per hour across all users (safety net)
 */
export const chatGlobalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // 200 requests per hour globally
  message: {
    response:
      "The server is experiencing high traffic. Please try again in a few minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: true,
  // Use a shared store key for global limiting
  keyGenerator: () => "global",
  handler: (req, res) => {
    console.log(`[RATE LIMIT] Global chat rate limit exceeded`);
    res.status(429).json({
      response:
        "The server is experiencing high traffic. Please try again in a few minutes.",
    });
  },
});

/**
 * Rate limiter for blog/bio endpoints
 * 100 requests per hour per IP (generous for reading)
 */
export const readRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour per IP
  message: {
    error: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`[RATE LIMIT] Read rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many requests. Please try again later.",
    });
  },
});
