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
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: [
      "https://ontheroadagain-client.vercel.app", // Allow main production client
      "http://localhost:3000", // Allow local development
    ],
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
    credentials: true, // Include credentials in cross-origin requests
  })
);

// Middleware pour le parsing des JSON et des données encodées en URL
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration de multer pour le stockage sur Cloudinary
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

// Route de vérification de l'état du serveur
app.get("/", (req, res) => {
  res.send("API est en cours d'exécution");
});

// Route de test
app.get("/api/test", (req, res) => {
  res.json({ message: "Test de l'API réussi !" });
});

// Routes de l'API
app.use("/api", apiRouter);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
  });
}

// Démarrage du serveur
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données :", error);
  }
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
