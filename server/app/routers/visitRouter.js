import { Router } from "express";
import * as visitController from "../controllers/visitController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";
import { jwtService } from "../middlewares/jwt.service.js";

export const router = Router();

// Applique le middleware d'authentification à toutes les routes
router.use(jwtService);

// Récupérer toutes les visites pour un voyage donné
router.get("/trips/:tripId/visits", cw(visitController.getVisit));

// Créer une nouvelle visite pour un voyage donné
router.post("/trips/:tripId/visit", cw(visitController.createVisit));

// Mettre à jour une visite spécifique
router.patch("/trips/:tripId/visit/:visitId", cw(visitController.updateVisit));

// Supprimer une visite spécifique
router.delete("/trips/:tripId/visit/:visitId", cw(visitController.deleteVisit));
