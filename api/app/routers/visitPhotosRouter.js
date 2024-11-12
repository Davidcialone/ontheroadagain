import { Router } from "express";
import * as visitsPhotosController from "../controllers/visitsPhotosController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";
import { jwtService } from "../middlewares/jwt.service.js";

export const router = Router();

// Middleware d'authentification
router.use((req, res, next) => {
  console.log(`Middleware jwtService appelé pour: ${req.method} ${req.url}`);
  jwtService(req, res, next);
});

// Log de requête
router.use((req, res, next) => {
  console.log(`Requête visitPhotosRouter: ${req.method} ${req.url}`);
  next();
});

// Récupérer toutes les photos pour une visite donnée
router.get(
  "/visits/:visitId/photos/",
  cw(visitsPhotosController.getVisitPhotos)
);

// Ajouter de nouvelles photos pour une visite donnée
router.post(
  "/visits/:visitId/photos/",
  (req, res, next) => {
    console.log(
      `Params dans le routeur principal: visitId: ${req.params.visitId}`
    );
    const { visitId } = req.params; // Récupération de tripId et visitId
    const { photo } = req.body;
    console.log(
      "Requête reçue pour ajouter une photo à la visite:",
      req.params
    );
    console.log("visitId:", visitId, "photo:", photo);
    next();
  },
  cw(visitsPhotosController.createVisitPhotos)
);

// Supprimer une photo spécifique
router.delete("/:photoId", cw(visitsPhotosController.deleteVisitPhoto));
