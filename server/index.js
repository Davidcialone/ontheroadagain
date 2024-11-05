const express = require("express");
const app = express();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Log detailed error information
  console.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    body: req.body,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.headers["x-vercel-id"],
  });
});

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global error catcher for unhandled promises
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Express error handler for async routes
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = app;

// For local development
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
