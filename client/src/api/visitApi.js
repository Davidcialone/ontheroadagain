import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie";
import { piexif } from "piexifjs";

// Informations Cloudinary directement intégrées
const VITE_CLOUDINARY_CLOUD_NAME = "dn1y58few";
const CLOUDINARY_UPLOAD_PRESET = "ontheroadagain";

// Fonction pour vérifier si le token est expiré
function isTokenExpired(decodedToken) {
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

// Fonction pour récupérer l'ID utilisateur à partir du token
export function getUserIdFromToken() {
  const yourJWTToken = Cookies.get("token");
  if (!yourJWTToken) {
    console.error("Token non trouvé");
    throw new Error("Token non trouvé");
  }

  const decodedToken = jwt.decode(yourJWTToken);
  console.log("Token décodé:", decodedToken);

  if (!decodedToken || isTokenExpired(decodedToken)) {
    console.error("Le token a expiré ou est invalide");
    throw new Error("Le token a expiré ou est invalide");
  }

  const userId = decodedToken.user_id || decodedToken.sub || decodedToken.id;
  if (!userId) {
    console.error("ID d'utilisateur non trouvé dans le token");
    throw new Error("ID d'utilisateur non trouvé dans le token");
  }

  console.log("ID utilisateur récupéré:", userId);
  return userId;
}

// Fonction pour compresser l'image
export function compressImage(imageFile) {
  return new Promise((resolve, reject) => {
    new Compressor(imageFile, {
      quality: 0.6,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export async function uploadImageToCloudinary(imageFile) {
  // Validation initiale
  if (!(imageFile instanceof File)) {
    throw new Error("Le premier argument doit être un objet File ou Blob.");
  }

  // Vérification des variables d'environnement
  if (!CLOUDINARY_UPLOAD_PRESET || !VITE_CLOUDINARY_CLOUD_NAME) {
    throw new Error("Configuration Cloudinary manquante");
  }

  console.log("Détails du fichier:", {
    name: imageFile.name,
    type: imageFile.type,
    size: imageFile.size,
  });

  // Compression de l'image
  console.log("Début de la compression...");
  let compressedImage;
  try {
    compressedImage = await compressImage(imageFile);
    console.log("Image compressée avec succès:", {
      type: compressedImage.type,
      size: compressedImage.size,
    });
  } catch (error) {
    console.error("Erreur lors de la compression:", error);
    throw new Error("Échec de la compression de l'image");
  }

  // Préparation du FormData
  const formData = new FormData();
  formData.append("file", compressedImage);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("context", "keep_metadata");

  // Log des données envoyées
  console.log("Upload preset:", CLOUDINARY_UPLOAD_PRESET);
  console.log("Cloud name:", VITE_CLOUDINARY_CLOUD_NAME);

  try {
    console.log("Début de l'upload vers Cloudinary...");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    // Log de la réponse complète en cas d'erreur
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Détails de l'erreur Cloudinary:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
      });
      throw new Error(`Erreur Cloudinary: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Upload réussi:", {
      publicId: data.public_id,
      url: data.url,
      format: data.format,
      metadata: data.image_metadata,
    });

    return data;
  } catch (error) {
    console.error("Erreur détaillée:", error);
    throw error; // Propager l'erreur avec les détails
  }
}

// Fonction utilitaire pour vérifier si une image est valide
export function validateImage(file) {
  // Vérification du type MIME
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error(`Type de fichier non supporté: ${file.type}`);
  }

  // Vérification de la taille (ex: 10MB max)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(
      `Fichier trop volumineux (max: ${maxSize / 1024 / 1024}MB)`
    );
  }

  return true;
}

// Utilisation
export async function handleImageUpload(imageFile) {
  try {
    // Validation préalable
    validateImage(imageFile);

    // Upload
    const result = await uploadImageToCloudinary(imageFile);
    return result;
  } catch (error) {
    console.error("Erreur lors du processus d'upload:", error);
    throw error;
  }
}

// Fonction pour récupérer les visites pour un voyage
export async function getVisitsForTrip(tripId) {
  console.log("Récupération des visites...");

  try {
    const userId = getUserIdFromToken();
    console.log("Récupération des visites pour l'ID utilisateur:", userId);

    if (!tripId) {
      console.error("tripId est manquant.");
      throw new Error("tripId est manquant.");
    }

    console.log(
      "Envoi de la requête pour récupérer les visites pour le tripId:",
      tripId
    );
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(
      `${API_BASE_URL}/api/me/trips/${tripId}/visits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    // Log de la réponse brute pour le débogage
    const responseText = await response.text(); // Lire la réponse comme texte pour le log
    console.log("Réponse brute du serveur:", responseText);

    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des visites:",
        response.statusText
      );
      throw new Error(
        `Erreur lors de la récupération des visites: ${response.statusText}`
      );
    }

    const tripData = JSON.parse(responseText);
    // console.log("Détails du voyage récupérés avec succès:", tripData); // Log des détails récupérés

    const visits = Array.isArray(tripData)
      ? tripData.map((visit) => ({
          id: visit.id,
          title: visit.title,
          photo: visit.photo || "default_image.png", // Utilisez une image par défaut si photo est nulle
          dateStart: new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "long",
          }).format(new Date(visit.dateStart)), // Format de date en français (ex: 19 novembre 2024)
          dateEnd: new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "long",
          }).format(new Date(visit.dateEnd)),
          rating: Number(visit.rating) || 0, // Assurez-vous que la note est un nombre
          comment: visit.comment || "Aucun commentaire disponible", // Gérer les commentaires nuls
          place: visit.place || "Lieu non spécifié", // Gérer les lieux nuls
          place_id: visit.place_id || null, // Gérer les IDs de lieu nuls
        }))
      : [];

    console.log("Visites mappées:", visits); // Log des visites après le mappage

    if (visits.length === 0) {
      console.warn("Aucune visite trouvée pour ce voyage.");
    }

    return visits;
  } catch (error) {
    console.error("Erreur lors de la récupération des visites:", error);
    throw new Error("Échec de la récupération des visites");
  }
}

// Fonction pour ajouter une nouvelle visite
export async function addVisit(visitData, existingVisits = []) {
  console.log("Ajout d'une nouvelle visite avec les données:", visitData);

  const tripId = visitData.tripId; // Vérification et extraction du tripId
  console.log("tripId extrait de visitData:", tripId); // Log pour vérifier tripId

  try {
    if (!tripId) {
      console.error("tripId est manquant dans visitData.");
      throw new Error("tripId est manquant.");
    }

    console.log("Données de visite avant transformation:", visitData);

    // Créer un objet pour envoyer les données
    const { title, photo, dateStart, dateEnd, rating, comment } = visitData;

    if (!title || !dateStart || !dateEnd) {
      console.error("Données de visite incomplètes :", {
        title,
        dateStart,
        dateEnd,
      });
      throw new Error(
        "Les données de visite doivent contenir title, dateStart et dateEnd."
      );
    }

    // Vérification des doublons
    const visitExists =
      Array.isArray(existingVisits) &&
      existingVisits.some(
        (visit) =>
          visit.title === title &&
          visit.dateStart === dateStart &&
          visit.dateEnd === dateEnd &&
          visit.rating === rating && // Inclure le rating si c'est pertinent
          visit.comment === comment // Inclure le commentaire si c'est pertinent
      );

    if (visitExists) {
      throw new Error("Une visite avec les mêmes détails existe déjà.");
    }

    // Préparez l'objet de données de visite
    const visitDataToSend = {
      title: title.trim(),
      photo: photo || null,
      dateStart,
      dateEnd,
      rating: isNaN(Number(rating)) ? 3 : Number(rating),
      comment: comment || null,
      trip_id: tripId,
    };

    console.log("Données de visite à envoyer:", visitDataToSend); // Log des données de visite
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    // Envoi de la requête POST
    const response = await fetch(
      `${API_BASE_URL}/api/me/trips/${tripId}/visits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(visitDataToSend),
      }
    );
    console.log("Réponse de la requête POST:", response); // Log de la réponse brute
    const responseText = await response.text(); // Lire la réponse comme texte pour le log
    console.log("Réponse brute du serveur:", responseText);

    if (!response.ok) {
      console.error(
        "Erreur lors de l'ajout de la visite:",
        response.statusText,
        "Code de statut:",
        response.status
      );
      throw new Error(
        `Erreur lors de l'ajout de la visite: ${response.statusText}`
      );
    }

    const result = JSON.parse(responseText); // Parsez la réponse JSON
    console.log("Visite ajoutée avec succès:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la visite:", error);
    throw new Error("Échec de l'ajout de la visite");
  }
}

// Fonction pour mettre à jour une visite
export async function updateVisit(visitId, visitData, tripId) {
  console.log("Mise à jour de la visite avec l'ID:", visitId);
  console.log("tripId reçu dans updateVisit:", tripId); // Log ajouté
  console.log("visitData reçu dans updateVisit:", visitData); // Log ajouté
  try {
    if (!tripId) {
      console.error("tripId est manquant.");
      throw new Error("tripId est manquant.");
    }
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    console.log("Envoi de la requête pour mettre à jour la visite:", visitId);
    const response = await fetch(
      `${API_BASE_URL}/api/me/trips/${tripId}/visits/${visitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(visitData),
      }
    );

    if (!response.ok) {
      console.error(
        "Erreur lors de la mise à jour de la visite:",
        response.statusText
      );
      throw new Error(
        `Erreur lors de la mise à jour de la visite: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Visite mise à jour avec succès:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la visite:", error);
    throw new Error("Échec de la mise à jour de la visite");
  }
}

// Fonction pour supprimer une visite
export async function deleteVisit(visitId) {
  console.log("Suppression de la visite avec l'ID:", visitId);
  // Vérifier si les identifiants de visite et de voyage sont bien fournis
  if (!visitId) {
    console.error("visitId est manquant.");
    throw new Error("visitId est manquant.");
  }
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    // Envoi de la requête pour supprimer la visite
    const response = await fetch(`${API_BASE_URL}/api/me/visits/${visitId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!response.ok) {
      console.error(
        "Erreur lors de la suppression de la visite:",
        response.statusText
      );
      throw new Error(
        `Erreur lors de la suppression de la visite: ${response.statusText}`
      );
    }

    console.log("Visite supprimée avec succès:", visitId);
    return visitId; // Retourne l'ID de la visite supprimée
  } catch (error) {
    console.error("Erreur lors de la suppression de la visite:", error);
    throw new Error("Échec de la suppression de la visite");
  }
}
