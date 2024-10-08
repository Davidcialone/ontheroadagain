import { Trip, Visit, Place, VisitPhoto, User } from "../models/index.js";
import {
  tripIdSchema,
  createTripSchema,
  updateTripSchema,
} from "../schema/trip.schema.js";

/**
 * Retrieve all trips associated with the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.user - The authenticated user object.
 * @param {number} req.user.id - The ID of the authenticated user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 *
 */
export async function getMyTrips(req, res) {
  const { error } = tripIdSchema.validate({ id: req.user.id });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).send("Utilisateur non trouvé.");
  }

  const trips = await Trip.findAll({
    where: { user_id: user.id },
    include: [
      {
        model: Visit,
        as: "visits",
        include: [
          {
            model: Place,
            as: "place",
          },
        ],
      },
    ],
  });
  res.status(200).json(trips);
}

/**
 * Retrieve all visits associated with a specific trip for the authenticated user.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.id - The ID of the trip.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
export async function getVisitsForTrip(req, res) {
  // const { error } = tripIdSchema.validate({ id: req.params.id });
  // if (error) {
  //   return res.status(400).send(error.details[0].message);
  // }

  const tripId = parseInt(req.params.id);

  const trip = await Trip.findByPk(tripId, {
    include: [
      {
        model: Visit,
        as: "visits",
      },
    ],
  });
  if (!trip) {
    return res.status(404).json({ error: "Le voyage n'a pas été retrouvé" });
  }
  res.json(trip);
}

/**
 * Create a new trip.
 *
 * @param {Object} req - The request object.
 * @param {string} req.body - The trip information.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// POST /api/me/trips
export async function createTrip(req, res) {
  console.log(req.body);
  const { error, value } = createTripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { dateStart, dateEnd, photo, title, description, note, user_id } =
    value;

  try {
    const trip = await Trip.create({
      dateStart,
      dateEnd,
      photo,
      title,
      description,
      note,
      user_id,
    });
    res.status(201).json(trip);
  } catch (err) {
    res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de la création du voyage.",
      });
  }
}

/**
 * Update an existing trip.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The trip ID.
 * @param {string} req.body - The trip information.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// PATCH /api/me/trips/:id
export async function updateTrip(req, res) {
  const tripId = parseInt(req.params.id);
  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found." });
  }

  const { error, value } = updateTripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { dateStart, dateEnd, photo, title, description, note } = value;

  if (dateStart !== undefined) trip.dateStart = dateStart;
  if (dateEnd !== undefined) trip.dateEnd = dateEnd;
  if (photo !== undefined) trip.photo = photo;
  if (title !== undefined) trip.title = title;
  if (description !== undefined) trip.description = description;
  if (note !== undefined) trip.note = note;

  await trip.save();
  res.json(trip);
}

/**
 * Delete an existing trip.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The trip ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// DELETE /api/me/trips/:id
export async function deleteTrip(req, res) {
  const { error } = tripIdSchema.validate({ id: req.params.id });
  if (error) {
    return res
      .status(400)
      .json({ error: "Invalid trip ID: " + error.details[0].message });
  }

  const tripId = parseInt(req.params.id);
  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found." });
  }
  await trip.destroy();
  res.status(204).send();
}
