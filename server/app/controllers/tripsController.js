import { Trip, Visit, Place, User } from "../models/index.js";
import {
  tripIdSchema,
  createTripSchema,
  updateTripSchema,
} from "../schema/trip.schema.js";

/**
 * Retrieve all trips associated with the authenticated user.
 */
export async function getMyTrips(req, res) {
  const { error } = tripIdSchema.validate({ id: req.user.id });
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).send("User not found.");
  }

  const trips = await Trip.findAll({
    where: { user_id: user.id },
    include: [
      {
        model: Visit,
        as: "visits",
        include: [{ model: Place, as: "place" }],
      },
    ],
  });

  res.status(200).json(trips);
}

/**
 * Retrieve all visits associated with a specific trip for the authenticated user.
 */
export async function getVisitsForTrip(req, res) {
  const tripId = parseInt(req.params.id);
  const trip = await Trip.findByPk(tripId, {
    include: [
      {
        model: Visit,
        as: "visits",
        include: [{ model: Place, as: "place" }],
      },
    ],
  });

  if (!trip) {
    return res.status(404).send("Trip not found.");
  }

  res.status(200).json(trip.visits);
}

/**
 * Create a new trip.
 */
export async function createTrip(req, res) {
  const { error, value } = createTripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newTrip = await Trip.create(value);
    res.status(201).json(newTrip);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the trip." });
  }
}

/**
 * Update an existing trip.
 */
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

  Object.assign(trip, value);
  await trip.save();
  res.json(trip);
}

/**
 * Delete an existing trip.
 */
export async function deleteTrip(req, res) {
  const tripId = parseInt(req.params.id);
  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    return res.status(404).json({ error: "Trip not found." });
  }

  await trip.destroy();
  res.status(204).send();
}
