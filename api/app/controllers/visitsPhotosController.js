import { VisitPhoto } from "../models/index.js";

// GET /api/me/trips/:tripId/visits/:visitId/photos
export async function getVisitPhotos(req, res) {
  console.log("Requête pour récupérer les photos de visite");
  const visitId = req.params.visitId;

  // Vérifiez si visitId est valide
  if (!visitId || isNaN(visitId)) {
    return res.status(400).json({ error: "Paramètre visitId invalide." });
  }

  try {
    const visitPhotos = await VisitPhoto.findAll({
      where: { visit_id: visitId },
    });

    if (visitPhotos.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucune photo trouvée pour cette visite." });
    }

    res.status(200).json(visitPhotos);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des photos de visite:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des photos de visite." });
  }
}

// POST /api/me/trips/:tripId/visits/:visitId/photos
export async function createVisitPhotos(req, res) {
  console.log("Requête pour créer des photos de visite");

  // Log pour voir les paramètres de la requête
  console.log("Requête reçue:", req.params);

  const { visitId } = req.params; // Récupération des paramètres
  const { photos } = req.body; // Attendez-vous à un tableau de photos

  console.log("Paramètres reçus:", {
    visitId,
    photos: photos || "Aucune donnée de photo fournie",
  });

  // Vérifiez si visitId est valide
  if (!visitId || isNaN(visitId)) {
    console.error("Erreur: visitId invalide:", visitId);
    return res.status(400).json({ error: "Paramètre visitId invalide." });
  }

  // Vérifiez si photos est un tableau et qu'il n'est pas vide
  if (!Array.isArray(photos) || photos.length === 0) {
    console.error("Erreur: Les données de photos sont invalides:", photos);
    return res.status(400).json({
      error: "Le champ photos est requis et doit être un tableau.",
    });
  }

  // Vérifiez que chaque photo a un url et un publicId
  for (const photo of photos) {
    if (!photo || !photo.url || !photo.publicId) {
      console.error("Erreur: Une photo a des données invalides:", photo);
      return res.status(400).json({
        error: "Chaque photo doit contenir un URL et un publicId.",
      });
    }
  }

  try {
    // Créer les photos de visite en utilisant bulkCreate
    const visitPhotos = await VisitPhoto.bulkCreate(
      photos.map((photo) => ({
        photo: photo.url, // Enregistre l'URL de la photo
        publicId: photo.publicId, // Enregistre le publicId de la photo
        visit_id: visitId, // Associe à la visite
      }))
    );

    console.log("Photos de visite créées avec succès:", visitPhotos);
    res.status(201).json(visitPhotos);
  } catch (error) {
    console.error(
      "Erreur lors de la création des photos de visite:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la création des photos de visite." });
  }
}

// DELETE /api/me/trips/:tripId/visits/:visitId/photos/:photoId
export async function deleteVisitPhoto(req, res) {
  const { visitId, photoId } = req.params;

  // Vérifiez si photoId est valide
  if (!photoId || isNaN(photoId)) {
    return res.status(400).json({ error: "Paramètre photoId invalide." });
  }

  try {
    const visitPhoto = await VisitPhoto.findByPk(photoId);

    if (!visitPhoto) {
      return res
        .status(404)
        .json({ error: "Aucune photo trouvée pour cet identifiant." });
    }

    await visitPhoto.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de la photo de visite:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la photo de visite." });
  }
}
