import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie";

const VITE_CLOUDINARY_CLOUD_NAME = "dn1y58few";
const CLOUDINARY_UPLOAD_PRESET = "ontheroadagain";

function isTokenExpired(decodedToken) {
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

export function getUserIdFromToken() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("Token non trouvé");
  }

  const decodedToken = jwt.decode(token);
  if (!decodedToken || isTokenExpired(decodedToken)) {
    throw new Error("Le token a expiré ou est invalide");
  }

  const userId = decodedToken.user_id || decodedToken.sub || decodedToken.id;
  if (!userId) {
    throw new Error("ID d'utilisateur non trouvé dans le token");
  }

  return userId;
}

export async function uploadImageToCloudinary(imageFile) {
  console.log("Début de l'upload de l'image vers Cloudinary...");

  if (!(imageFile instanceof File)) {
    throw new Error("Le premier argument doit être un objet File ou Blob.");
  }

  const compressedImage = await new Promise((resolve, reject) => {
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

  const formData = new FormData();
  formData.append("file", compressedImage);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("Réponse de Cloudinary reçue.");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cloudinary upload error! Status: ${response.status}, Details: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image sur Cloudinary:",
      error
    );
    throw new Error("Échec du téléchargement de l'image sur Cloudinary");
  }
}

export async function fetchTrips() {
  console.log("Début de fetchTrips...");

  try {
    const userId = getUserIdFromToken();
    console.log(`User ID récupéré pour fetchTrips: ${userId}`);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Récupération de l'URL de base de l'API
    const response = await fetch(`${API_BASE_URL}/me/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    console.log("Réponse de fetchTrips reçue.");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erreur lors de la récupération des voyages: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des voyages:", error);
    throw error;
  }
}

export async function addTrip(newTrip, existingTrips = []) {
  console.log("Début de addTrip...");

  const { title, photo, dateStart, dateEnd, rating, description } = newTrip;

  if (!title || !dateStart || !dateEnd) {
    throw new Error("Titre, date de début et date de fin sont obligatoires.");
  }

  if (!photo) {
    throw new Error("Aucune image fournie pour le téléchargement.");
  }
  const userId = getUserIdFromToken();

  console.log(`User ID récupéré pour addTrip: ${userId}`);
  console.log(`Vérification des doublons pour le voyage ${title}`);

  const tripExists =
    Array.isArray(existingTrips) &&
    existingTrips.some(
      (trip) =>
        trip.title === title &&
        trip.dateStart === dateStart &&
        trip.dateEnd === dateEnd
    );

  if (tripExists) {
    console.log("Un voyage avec le même titre et les mêmes dates existe déjà.");
    throw new Error(
      "Un voyage avec le même titre et les mêmes dates existe déjà."
    );
  }

  const tripData = {
    title,
    photo,
    dateStart,
    dateEnd,
    rating: Number(rating),
    description,
    user_id: userId,
  };

  console.log("Appel de l'API pour ajouter un nouveau voyage.");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Utilisation de l'URL de base
  const response = await fetch(`${API_BASE_URL}/me/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(tripData),
  });

  console.log("Réponse de l'API pour addTrip reçue.");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur lors de l'ajout du voyage: ${errorText}`);
  }

  return await response.json();
}

export async function deleteTrip(tripId) {
  console.log(`Début de deleteTrip pour le voyage ID ${tripId}...`);

  try {
    const userId = getUserIdFromToken();
    console.log(`User ID récupéré pour deleteTrip: ${userId}`);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Utilisation de l'URL de base
    const response = await fetch(`${API_BASE_URL}/me/trips/${tripId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    console.log("Réponse de l'API pour deleteTrip reçue.");

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Erreur lors de la suppression du voyage: ${errorMessage}`
      );
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du voyage:", error);
    throw error;
  }
}

export async function updateTrip(tripId, updatedTrip) {
  console.log(`Début de updateTrip pour le voyage ID ${tripId}...`);

  try {
    const userId = getUserIdFromToken();
    console.log(`User ID récupéré pour updateTrip: ${userId}`);

    const tripData = {
      ...updatedTrip,
      photo: updatedTrip.photo.public_id
        ? `https://res.cloudinary.com/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${updatedTrip.photo.public_id}.jpeg`
        : updatedTrip.photo.endsWith(".jpeg")
        ? updatedTrip.photo
        : `${updatedTrip.photo}.jpeg`,
    };

    console.log("Appel de l'API pour mettre à jour le voyage.");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Utilisation de l'URL de base
    const response = await fetch(`${API_BASE_URL}/me/trips/${tripId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(tripData),
    });

    console.log("Réponse de l'API pour updateTrip reçue.");

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Erreur lors de la mise à jour du voyage: ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du voyage:", error);
    throw error;
  }
}
