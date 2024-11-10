import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import { router } from "./app/routers/index.js";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Modifier les CORS options pour accepter votre frontend déployé
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ontheroadagain-client.vercel.app/", // Ajoutez l'URL de votre frontend déployé
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ontheroadagain",
    allowedFormats: ["jpg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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

app.use("/", router);

// Route de test
apiRouter.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Initialisation de la base de données
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await sequelize.sync({ alter: true });
      console.log("Base de données synchronisée avec succès.");

      const port = process.env.PORT || 5000;
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.error("Erreur lors de la synchronisation :", error);
    }
  };
  startServer();
}

// Export pour Vercel
export default app;
