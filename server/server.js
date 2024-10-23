import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import { router } from "./app/routers/index.js";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configurer CORS pour permettre uniquement les requêtes de ton frontend
const corsOptions = {
  origin: "http://localhost:3000", // Remplace par l'URL de ton frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

// Utiliser CORS avec les options définies
app.use(cors(corsOptions));

// Increase payload size limits
app.use(express.json({ limit: "10mb" })); // Increase JSON body size limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded body size limit

// Configurer Cloudinary avec tes informations d'authentification
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurer Multer pour utiliser Cloudinary comme stockage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ontheroadagain", // Dossier où les images seront stockées
    allowedFormats: ["jpg", "png"], // Formats acceptés
  },
});

// Initialize Multer with storage and set limits for file size
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set file size limit to 5 MB
  },
});

// Route pour gérer l'upload d'une image
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log(
      "Taille du fichier:",
      req.file ? req.file.size : "Aucun fichier"
    );
    if (req.file) {
      res.status(200).json({
        message: "Image téléchargée avec succès",
        imageUrl: req.file.path,
      });
    } else {
      res.status(400).json({ message: "Aucune image n'a été téléchargée." });
    }
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image : ", error);
    if (error instanceof multer.MulterError) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Erreur lors du téléchargement de l'image." });
    }
  }
});

// Utiliser les routes principales de ton application
app.use("/ontheroadagain", router);

// Synchroniser la base de données
const startServer = async () => {
  try {
    // Synchroniser avec la base de données
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée avec succès.");

    // Lancer le serveur
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation avec la base de données :",
      error
    );
  }
};

// Démarrer le serveur
startServer();
