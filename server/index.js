import express from "express";
import path from "path";
import cors from "cors";
import sequelize from "./db.js";
import { router as apiRouter } from "./app/routers/index.js";
import cloudinaryPkg from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Chargement des variables d'environnement
dotenv.config();
const { v2: cloudinary } = cloudinaryPkg;
const app = express();

// Configuration CORS
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ontheroadagain-client.vercel.app/", // URL du frontend déployé
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware pour JSON et données URL-encoded
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

// Configuration de stockage pour multer avec Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ontheroadagain",
    allowedFormats: ["jpg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier : 5MB
});

// Route pour uploader une image
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (req.file) {
      res.status(200).json({
        message: "Image téléchargée avec succès",
        imageUrl: req.file.path,
      });
    } else {
      res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    res.status(error instanceof multer.MulterError ? 400 : 500).json({
      message: error.message || "Erreur lors du téléchargement de l'image.",
    });
  }
});

// Routes de l'API
app.use("/api", apiRouter);

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(process.cwd(), "client/dist")));

// Route pour servir l'application frontend pour toutes les routes non-API
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
});

// Route de vérification de santé
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Initialisation de la base de données (non exécutable en production)
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log("Base de données synchronisée avec succès.");
    } catch (error) {
      console.error("Erreur lors de la synchronisation :", error);
    }
  };
  startServer();
}

// Démarrage du serveur en local (uniquement si pas déployé sur Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
  });
}

// Export de l'application pour les fonctions serverless de Vercel
export default app;
