// import express from "express";
// import path from "path";
// import cors from "cors";
// import sequelize from "./db.js";
// import { router as apiRouter } from "./app/routers/index.js";
// import cloudinaryPkg from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import dotenv from "dotenv";

// dotenv.config();
// const { v2: cloudinary } = cloudinaryPkg;
// const app = express();

// // CORS configuration
// const corsOptions = {
//   origin: [
//     "http://localhost:3000",
//     "https://ontheroadagain-client.vercel.app/", // URL du frontend déployé
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.VITE_CLOUDINARY_API_KEY,
//   api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "ontheroadagain",
//     allowedFormats: ["jpg", "png", "webp"],
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// app.post("/upload", upload.single("image"), (req, res) => {
//   try {
//     if (req.file) {
//       res.status(200).json({
//         message: "Image téléchargée avec succès",
//         imageUrl: req.file.path,
//       });
//     } else {
//       res.status(400).json({ message: "Aucune image n'a été téléchargée." });
//     }
//   } catch (error) {
//     console.error("Erreur lors de l'upload de l'image : ", error);
//     res.status(error instanceof multer.MulterError ? 400 : 500).json({
//       message: error.message || "Erreur lors du téléchargement de l'image.",
//     });
//   }
// });

// // API routes
// app.use("/api", apiRouter);

// // Serve static files from the client
// app.use(express.static(path.join(process.cwd(), "client/dist")));

// // Route to serve the frontend
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "client/dist", "index.html"));
// });

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.json({ status: "OK" });
// });

// // Initialisation de la base de données (non exécutable en production)
// if (process.env.NODE_ENV !== "production") {
//   const startServer = async () => {
//     try {
//       await sequelize.sync({ alter: true });
//       console.log("Base de données synchronisée avec succès.");
//     } catch (error) {
//       console.error("Erreur lors de la synchronisation :", error);
//     }
//   };
//   startServer();
// }

// // Export the app for Vercel serverless function
// export default app;
