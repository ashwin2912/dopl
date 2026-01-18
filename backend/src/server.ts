import express from "express";
import cors from "cors";
import config from "./config/env.js";
import chatRouter from "./routes/chat.js";
import authSetupRouter from "./routes/auth-setup.js";
import blogRouter from "./routes/blog.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/chat", chatRouter);
app.use("/api/blog", blogRouter);

// SETUP ROUTES - Only for initial OAuth setup
// TODO: Comment out or remove these routes in production!
app.use("/setup", authSetupRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Digital Twin API",
    version: "1.0.0",
    endpoints: {
      chat: "/api/chat",
      health: "/health",
    },
  });
});

// FUTURE: Authentication routes
// app.use('/api/auth', authRouter);
// app.post('/api/auth/login', ...);
// app.post('/api/auth/signup', ...);
// app.post('/api/auth/logout', ...);

// FUTURE: Payment routes
// app.use('/api/payments', paymentsRouter);
// app.post('/api/payments/create-checkout', ...);
// app.post('/api/payments/webhook', ...);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal server error",
      message:
        config.nodeEnv === "development" ? err.message : "Something went wrong",
    });
  },
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   DIGITAL TWIN API SERVER RUNNING     ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                         ║
║  Environment: ${config.nodeEnv}        ║
║  Frontend: ${config.frontendUrl}       ║
╚════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

export default app;
