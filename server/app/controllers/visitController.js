import { Visit} from '../models/index.js';
// import { tripIdSchema, createTripSchema, updateTripSchema } from '../schema/visit.schema.js';

// export async function getVisit(req, res) {
//   try {
//     // const visits = await Visit.findAll({ 
//     //     where: { trip_id: req.params.tripId }
//     // });
//     const visits = await Visit.findAll();
//     res.status(200).json(visits);
// } catch (error) {
//     console.error('Error fetching visits:', error);
//     res.status(500).json({ error: 'Failed to fetch visits' });
// }
// };
/**
 * Create a new visit.
 * 
 * @param {Object} req - The request object.
 * @param {string} req.body - The visit information.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// POST /api/me/trips/:id/visit/
export async function createVisit(req, res) {
//   console.log(req.body);
//   const { error, value } = createTripSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ error: error.details[0].message });
//   }

const { title, dateStart, dateEnd, comment, note, photo,geo, place_id, trip_id } = req.body;

  try {
    const visit = await Visit.create({
      title,
      dateStart,
      dateEnd,
      comment,
      note,
      photo,
      geo,
      place_id,
      trip_id,
    });
    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création du voyage.' });
  }
}

/**
 * Update an existing visit.
 * 
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The visit ID.
 * @param {string} req.body - The visit information.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// PATCH /api/me/trips/:id/visit/:id
export async function updateVisit(req, res) {
  const { id } = req.params;
  const { title,dateStart, dateEnd, comment, note, photo, geo, place_id, trip_id } = req.body;

  try {
    const visit = await Visit.findByPk(id);
    if (!visit) {
      return res.status(404).json({ error: 'Visite non trouvée.' });
    }

    // Mettre à jour les champs de la visite
    visit.title = title !== undefined ? title : visit.title; 
    visit.dateStart = dateStart !== undefined ? dateStart : visit.dateStart;
    visit.dateEnd = dateEnd !== undefined ? dateEnd : visit.dateEnd;
    visit.comment = comment !== undefined ? comment : visit.comment;
    visit.note = note !== undefined ? note : visit.note;
    visit.photo = photo !== undefined ? photo : visit.photo;
    visit.geo = geo !== undefined ? geo : visit.geo;
    visit.place_id = place_id !== undefined ? place_id : visit.place_id;
    visit.trip_id = trip_id !== undefined ? trip_id : visit.trip_id;

    // Enregistrer les modifications
    await visit.save();

    res.status(200).json(visit);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la visite:', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la visite.' });
  }
}

/**
 * Delete an existing visit.
 * 
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The visit ID.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 */

// DELETE /api/me/trips/:id/visit/:id
export async function deleteVisit(req, res) {
//   const { error } = visitIdSchema.validate({ id: req.params.id });
//   if (error) {
//     return res.status (400).json({ error: 'Invalid visit ID: ' + error.details[0].message });
//   }

  const visitId = parseInt(req.params.id);
  const visit = await Visit.findByPk(visitId);
  if (!visit) {
    return res.status(404).json({ error: "Trip not found." });
  }
  await visit.destroy();
  res.status(200).json({ message: 'Visite supprimé avec succès' });
}
