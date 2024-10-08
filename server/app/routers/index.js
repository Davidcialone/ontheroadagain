import { Router } from "express";

import { router as userRouter } from "./userRouter.js";
import { router as tripRouter } from "./tripsRouter.js";
import { router as uploadRouter } from "./uploadRouter.js";
import { router as visitRouter } from "./visitRouter.js";

export const router = Router();

// Préfixer les routes
router.use("/api/users", userRouter);
router.use("/api/uploads", uploadRouter);
router.use("/api/me/trips", tripRouter); // Assurez-vous que les routes de trips sont bien préfixées
router.use("/api/visits", visitRouter);

// Middleware 404 (API)
router.use((req, res) => {
  res.status(404).json({ error: "Ressource not found" });
});
