import { Router } from "express";
import * as tripsController from "../controllers/tripsController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";
import { jwtService } from "../middlewares/jwt.service.js";

/**
 * Routes for trip management.
 * @module router
 */
export const router = Router();

// Middleware that validates the JWT token.
router.use(jwtService);

/**
 * @route GET /me/trips
 * @group Trips - Operations about user trips
 * @returns {Array.<Trip>} 200 - An array of user trips
 * @security JWT
 */
router.get('/me/trips', cw(tripsController.getMyTrips));

/**
 * @route GET /me/trips/:id
 * @group Trips - Operations about user trips
 * @param {string} id.path.required - The ID of the trip
 * @returns {Array.<Visit>} 200 - An array of visits for the trip
 * @returns {Error} 404 - Trip not found
 * @security JWT
 */
router.get("/me/trips/:id", cw(tripsController.getVisitsForTrip));

/**
 * @route POST /me/trips
 * @group Trips - Operations about user trips
 * @param {Trip.model} trip.body.required - New trip object
 * @returns {Trip} 201 - The created trip object
 * @returns {Error} 400 - Bad request
 * @security JWT
 */
router.post("/me/trips", cw(tripsController.createTrip));

/**
 * @route PATCH /me/trips/:id
 * @group Trips - Operations about user trips
 * @param {string} id.path.required - The ID of the trip
 * @param {Trip.model} trip.body.required - Trip object that needs to be updated
 * @returns {Trip} 200 - The updated trip object
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Trip not found
 * @security JWT
 */
router.patch("/me/trips/:id", cw(tripsController.updateTrip));

/**
 * @route DELETE /me/trips/:id
 * @group Trips - Operations about user trips
 * @param {string} id.path.required - The ID of the trip
 * @returns {Message} 200 - Trip successfully deleted
 * @returns {Error} 404 - Trip not found
 * @security JWT
 */
router.delete("/me/trips/:id", cw(tripsController.deleteTrip));


