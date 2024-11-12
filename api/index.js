import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Configuration CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ontheroadagain-client.vercel.app/", // URL du frontend déployé
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour JSON et données URL-encoded
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Route de vérification de l'état du serveur
app.get("/", (req, res) => {
  res.send("API est en cours d'exécution");
});

// Route de test
app.get("/api/test", (req, res) => {
  console.log("Test route accessed");
  res.json({
    message: "Server is working",
    timestamp: new Date().toISOString(),
  });
});

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(process.cwd(), "client/dist")));

// Route pour servir l'application frontend pour toutes les routes non-API
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

// Exporter l'application pour Vercel
export default (req, res) => {
  app(req, res);
};
