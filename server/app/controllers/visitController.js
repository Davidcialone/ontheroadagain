import { Visit } from "../models/index.js";

// GET /api/me/trips/:tripId/visits
export async function getVisit(req, res) {
  try {
    const tripId = parseInt(req.params.tripId);
    if (isNaN(tripId)) {
      return res.status(400).json({ error: "Paramètre tripId invalide." });
    }

    const visits = await Visit.findAll({
      where: { trip_id: tripId }, // Corrected here
    });

    if (visits.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune visite trouvée pour ce voyage." });
    }

    res.status(200).json(visits);
  } catch (error) {
    console.error("Erreur lors de la récupération des visites:", error.message);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des visites." });
  }
}

// POST /api/me/trips/:tripId/visit
export async function createVisit(req, res) {
  const { title, dateStart, dateEnd, comment, note, photo, geo, place_id } =
    req.body;

  const tripId = parseInt(req.params.tripId); // trip_id doit venir des paramètres de la route
  if (isNaN(tripId)) {
    return res.status(400).json({ error: "Paramètre tripId invalide." });
  }

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
      trip_id: tripId, // Utilise le tripId extrait des paramètres
    });
    res.status(201).json(visit);
  } catch (err) {
    console.error("Erreur lors de la création de la visite:", err);
    res.status(500).json({
      error: "Une erreur est survenue lors de la création de la visite.",
    });
  }
}

// PATCH /api/me/trips/:tripId/visit/:visitId
export async function updateVisit(req, res) {
  const visitId = parseInt(req.params.visitId);
  const tripId = parseInt(req.params.tripId);

  if (isNaN(visitId) || isNaN(tripId)) {
    return res.status(400).json({ error: "Paramètres invalides." });
  }

  const { title, dateStart, dateEnd, comment, note, photo, geo, place_id } =
    req.body;

  try {
    const visit = await Visit.findByPk(visitId);
    if (!visit || visit.trip_id !== tripId) {
      return res
        .status(404)
        .json({ error: "Visite non trouvée pour ce voyage." });
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

    await visit.save();

    res.status(200).json(visit);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la visite:", err);
    res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour de la visite.",
    });
  }
}

// DELETE /api/me/trips/:tripId/visit/:visitId
export async function deleteVisit(req, res) {
  const visitId = parseInt(req.params.visitId);
  const tripId = parseInt(req.params.tripId);

  if (isNaN(visitId) || isNaN(tripId)) {
    return res.status(400).json({ error: "Paramètres invalides." });
  }

  try {
    const visit = await Visit.findByPk(visitId);
    if (!visit || visit.trip_id !== tripId) {
      return res
        .status(404)
        .json({ error: "Visite non trouvée pour ce voyage." });
    }

    await visit.destroy();
    res.status(200).json({ message: "Visite supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de la visite:", err);
    res.status(500).json({
      error: "Une erreur est survenue lors de la suppression de la visite.",
    });
  }
}
