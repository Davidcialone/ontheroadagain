import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie";

// Informations Cloudinary directement intégrées
const CLOUDINARY_CLOUD_NAME = "dn1y58few";
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
  if (!(imageFile instanceof File)) {
    throw new Error("Le premier argument doit être un objet File ou Blob.");
  }

  // Compresser l'image avant de la télécharger
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
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Cloudinary upload error! Status: ${response.status}, Details: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Échec du téléchargement de l'image sur Cloudinary");
  }
}

export async function fetchTrips() {
  console.log("Fetching trips...");

  try {
    const userId = getUserIdFromToken();
    const response = await fetch(`http://localhost:5000/api/me/trips`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

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
  const { title, photo, dateStart, dateEnd, rating, description } = newTrip;

  if (!title || !dateStart || !dateEnd) {
    throw new Error("Titre, date de début et date de fin sont obligatoires.");
  }

  if (!photo) {
    throw new Error("Aucune image fournie pour le téléchargement.");
  }
  const userId = getUserIdFromToken();
  // Vérification des doublons : utiliser le tableau existant des voyages
  const tripExists =
    Array.isArray(existingTrips) &&
    existingTrips.some(
      (trip) =>
        trip.title === title &&
        trip.dateStart === dateStart &&
        trip.dateEnd === dateEnd
    );

  if (tripExists) {
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

  const response = await fetch("http://localhost:5000/api/me/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur lors de l'ajout du voyage: ${errorText}`);
  }

  return await response.json(); // Renvoyer la réponse JSON
}

export async function deleteTrip(tripId) {
  try {
    const userId = getUserIdFromToken();
    const response = await fetch(
      `http://localhost:5000/api/me/trips/${tripId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Erreur lors de la suppression du voyage: ${errorMessage}`
      );
    }
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

export async function updateTrip(tripId, updatedTrip) {
  try {
    const userId = getUserIdFromToken();

    const tripData = {
      ...updatedTrip,
      photo: updatedTrip.photo.public_id
        ? `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${updatedTrip.photo.public_id}.jpeg`
        : updatedTrip.photo.endsWith(".jpeg")
        ? updatedTrip.photo
        : `${updatedTrip.photo}.jpeg`,
    };

    const response = await fetch(
      `http://localhost:5000/api/me/trips/${tripId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(tripData),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Erreur lors de la mise à jour du voyage: ${errorMessage}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
}
