import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie";

// Fonction pour vérifier si le token est expiré
function isTokenExpired(decodedToken) {
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

// Fonction pour récupérer l'ID utilisateur à partir du token
export function getUserIdFromToken() {
  const yourJWTToken = Cookies.get("token");
  if (!yourJWTToken) {
    throw new Error("Token non trouvé");
  }

  const decodedToken = jwt.decode(yourJWTToken);

  if (!decodedToken || isTokenExpired(decodedToken)) {
    throw new Error("Le token a expiré ou est invalide");
  }

  const userId = decodedToken.user_id || decodedToken.sub || decodedToken.id;
  if (!userId) {
    throw new Error("ID d'utilisateur non trouvé dans le token");
  }

  return userId;
}

// Fonction pour télécharger une image compressée sur Cloudinary
export async function uploadImageToCloudinary(imageFile) {
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
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      console.log(`Cloudinary upload error! status: ${response.status}`);
      const errorText = await response.text();
      console.log(`Cloudinary upload error details: ${errorText}`);
      throw new Error(`Cloudinary upload error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Échec du téléchargement de l'image sur Cloudinary");
  }
}

export async function getVisitsForTrip(tripId) {
  console.log("Fetching visits...");

  try {
    const userId = getUserIdFromToken();
    console.log("Fetching trips for user ID:", userId);

    if (!tripId) {
      throw new Error("tripId est manquant.");
    }

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips/${tripId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des visites: ${response.statusText}`
      );
    }

    const tripData = await response.json();
    console.log(
      "Trip details fetched successfully:",
      JSON.stringify(tripData, null, 2)
    );

    // Ici, nous avons les visites directement dans tripData
    const visits = tripData || []; // Utilise tripData directement
    console.log("Visits fetched successfully:", visits);

    if (visits.length === 0) {
      console.warn("Aucune visite trouvée pour ce voyage.");
    }

    return visits;
  } catch (error) {
    console.error("Error fetching visits:", error);
    throw new Error("Échec de la récupération des visites");
  }
}

// Fonction pour ajouter une nouvelle visite
export async function addVisit(visitData, tripId) {
  try {
    if (!tripId) {
      throw new Error("tripId est manquant.");
    }

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips/${tripId}/visits`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(visitData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors de l'ajout de la visite: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Visite ajoutée avec succès:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la visite:", error);
    throw new Error("Échec de l'ajout de la visite");
  }
}
