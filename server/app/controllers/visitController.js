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
  const { tripId } = req.params; // Extraire tripId de req.params
  const { title, dateStart, dateEnd, comment, rating, photo, geo } = req.body; // Extraire tripId de req.body

  // Vérifiez si tripId est présent
  if (!tripId || isNaN(tripId)) {
    return res.status(400).json({ error: "Paramètre tripId invalide." });
  }

  console.log("tripId reçu:", tripId); // Log pour vérifier la valeur du tripId

  // Vérifiez si les champs requis sont présents
  if (!title || !dateStart || !dateEnd) {
    return res
      .status(400)
      .json({ error: "Les champs title, dateStart et dateEnd sont requis." });
  }

  try {
    const visit = await Visit.create({
      title,
      photo,
      dateStart,
      dateEnd,
      comment,
      rating,
      geo,
      trip_id: tripId, // Utiliser le tripId extrait de visitData
    });
    console.log("Données de la visite reçues:", req.body);

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

  const { title, dateStart, dateEnd, comment, rating, geo, place_id } =
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
    visit.rating = rating !== undefined ? rating : visit.rating;
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
