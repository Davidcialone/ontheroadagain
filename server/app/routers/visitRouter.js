import { Router } from "express";
import * as visitController from "../controllers/visitController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";
import { jwtService } from "../middlewares/jwt.service.js";

export const router = Router();

// Applique le middleware d'authentification à toutes les routes
router.use(jwtService);

// Récupérer toutes les visites pour un voyage donné
/**
 * @route GET /api/trips/:tripId/visits
 * @group Visits - Operations about trip visits
 * @param {string} tripId.path.required - The ID of the trip
 * @returns {Array.<Visit>} 200 - An array of visits for the trip
 * @returns {Error} 404 - Trip not found
 * @security JWT
 */
router.get("/:tripId/visits", cw(visitController.getVisit));

// Créer une nouvelle visite pour un voyage donné
/**
 * @route POST /api/trips/:tripId/visits
 * @group Visits - Operations about trip visits
 * @param {Visit.model} visit.body.required - New visit object
 * @returns {Visit} 201 - The created visit object
 * @returns {Error} 400 - Bad request
 * @security JWT
 */
router.post("/:tripId/visits", cw(visitController.createVisit));

// Mettre à jour une visite spécifique
/**
 * @route PATCH /api/trips/:tripId/visits/:visitId
 * @group Visits - Operations about trip visits
 * @param {string} tripId.path.required - The ID of the trip
 * @param {string} visitId.path.required - The ID of the visit
 * @param {Visit.model} visit.body.required - Visit object that needs to be updated
 * @returns {Visit} 200 - The updated visit object
 * @returns {Error} 404 - Visit not found
 * @security JWT
 */
router.patch("/:tripId/visits/:visitId", cw(visitController.updateVisit));

// Supprimer une visite spécifique
/**
 * @route DELETE /api/trips/:tripId/visits/:visitId
 * @group Visits - Operations about trip visits
 * @param {string} tripId.path.required - The ID of the trip
 * @param {string} visitId.path.required - The ID of the visit
 * @returns {Message} 200 - Visit successfully deleted
 * @returns {Error} 404 - Visit not found
 * @security JWT
 */
router.delete("/visits/:visitId", cw(visitController.deleteVisit));
