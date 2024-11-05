import express from "express";
import path from "path";
import apiRouter from "./server.js"; // Import your API router

const app = express();
// const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Use your API router
app.use(apiRouter);

// Serve static files from the client
app.use(express.static(path.join(process.cwd(), "client/dist")));

// Route to serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

// Export the Express app as a serverless function
export default app;
