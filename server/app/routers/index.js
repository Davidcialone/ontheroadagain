import { Router } from "express";
import { router as userRouter } from "./userRouter.js";
import { router as tripRouter } from "./tripsRouter.js";
import { router as uploadRouter } from "./uploadRouter.js";
import { router as visitRouter } from "./visitRouter.js";
import { router as visitPhotosRouter } from "./visitPhotosRouter.js";

export const router = Router();

// Préfixer les routes
router.use("/users", userRouter);
router.use("/uploads", uploadRouter);
router.use("/me/trips", tripRouter); // Assurez-vous que ceci est correct
router.use("/me", visitRouter); // Ceci peut être correct si le visitRouter gère des sous-routes
router.use("/me", visitPhotosRouter);

// Middleware 404 (API)
router.use((req, res) => {
  res.status(404).json({ error: "Ressource not found" });
});
