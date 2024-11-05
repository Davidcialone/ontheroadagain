import express from "express";
import path from "path";
import apiRouter from "./server.js"; // Importez votre routeur API

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

// Utilisez votre routeur API
app.use("/api", apiRouter);

// Servir les fichiers statiques du client
app.use(express.static(path.join(process.cwd(), "client/dist")));

// Route pour servir le frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
