import { Router } from "express";
import { router as userRouter } from "./userRouter.js";
import { router as tripRouter } from "./tripsRouter.js";
import { router as uploadRouter } from "./uploadRouter.js";
import { router as visitRouter } from "./visitRouter.js";
import { router as visitPhotosRouter } from "./visitPhotosRouter.js";

export const router = Router();

// Préfixer les routes
router.use("/api/users", userRouter);
router.use("/api/uploads", uploadRouter);
router.use("/api/me/trips", tripRouter); // Assurez-vous que ceci est correct
router.use("/api/me", visitRouter); // Ceci peut être correct si le visitRouter gère des sous-routes
router.use("/api/me", visitPhotosRouter);

// Middleware 404 (API)
router.use((req, res) => {
  res.status(404).json({ error: "Ressource not found" });
});
