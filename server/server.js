import express from "express";

const app = express();

// Route de test API
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Serveur les fichiers statiques (frontend)
app.use(express.static("client/dist"));

// Route de fallback pour le frontend
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "client/dist" });
});

// Export pour Vercel
export default app;
