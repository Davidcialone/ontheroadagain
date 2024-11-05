// server.js
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

const apiRouter = express.Router();

// Configure CORS with environment-aware origins
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL
      : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

// Middleware
apiRouter.use(cors(corsOptions));
apiRouter.use(express.json({ limit: "10mb" }));
apiRouter.use(express.urlencoded({ limit: "10mb", extended: true }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with memory storage for serverless
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ontheroadagain",
    allowed_formats: ["jpg", "png"],
    transformation: [{ width: 1000, crop: "limit" }], // Optional: optimize uploads
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: "File Upload Error",
      message: err.message,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
};

// Upload route with error handling
apiRouter.post("/upload", async (req, res, next) => {
  const uploadMiddleware = upload.single("image");

  try {
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    next(error);
  }
});

// Database initialization
const initializeDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected and synced");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error; // Let the error propagate
  }
};

// Main routes with database connection check
apiRouter.use("/", async (req, res, next) => {
  try {
    // Ensure database is connected
    await sequelize.authenticate();
    router(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Initialize database on first request
apiRouter.use(async (req, res, next) => {
  if (!sequelize.initialized) {
    try {
      await initializeDb();
      sequelize.initialized = true;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Error handling must be last
apiRouter.use(errorHandler);

export default apiRouter;
