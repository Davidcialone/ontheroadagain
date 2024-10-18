import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie"; // Importation de la bibliothèque js-cookie

// Informations Cloudinary directement intégrées
const CLOUDINARY_CLOUD_NAME = "dn1y58few"; // Remplacez par votre Cloudinary Cloud Name
const CLOUDINARY_UPLOAD_PRESET = "ontheroadagain"; // Remplacez par votre Cloudinary Upload Preset

function isTokenExpired(decodedToken) {
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

export function getUserIdFromToken() {
  // Récupérer le token depuis les cookies
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

export async function uploadImageToCloudinary(imageFile) {
  if (!(imageFile instanceof File)) {
    throw new Error("Le premier argument doit être un objet File ou Blob.");
  }

  // Compresser l'image avant de la télécharger
  const compressedImage = await new Promise((resolve, reject) => {
    new Compressor(imageFile, {
      quality: 0.6, // Ajustez la qualité selon vos besoins
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

export async function fetchTrips() {
  console.log("Fetching trips...");

  try {
    const userId = getUserIdFromToken();
    console.log("Fetching trips for user ID:", userId);

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Utilisation du token stocké dans les cookies
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des voyages: ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Trips fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des voyages:", error);
    throw error;
  }
}

export async function addTrip(newTrip) {
  const { title, photo, dateStart, dateEnd, note, description } = newTrip;

  try {
    const userId = getUserIdFromToken(); // Obtenez l'ID utilisateur
    console.log("Adding trip for user ID:", userId);

    if (!photo) {
      throw new Error("Aucune image fournie pour le téléchargement.");
    }

    // Préparez l'objet avec les données du voyage
    const tripData = {
      title,
      photo,
      dateStart,
      dateEnd,
      note,
      description,
      user_id: userId, // Incluez l'ID utilisateur ici
    };

    const response = await fetch(
      "http://localhost:5000/ontheroadagain/api/me/trips",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`, // Utilisation du token du cookie
        },
        body: JSON.stringify(tripData), // Envoyez les données au format JSON
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du voyage.");
    }

    const result = await response.json(); // Récupérez la réponse JSON
    console.log("Voyage ajouté avec succès:", result);
    return result; // Renvoie le résultat
  } catch (error) {
    console.error("Erreur lors de l'ajout du voyage:", error);
    throw error; // Relancez l'erreur pour le gérer plus haut dans la chaîne
  }
}

export async function deleteTrip(tripId) {
  try {
    const userId = getUserIdFromToken();
    console.log("Deleting trip for user ID:", userId);

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips/${tripId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`, // Utilisation du token du cookie
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorMessage}`
      );
    }

    const deletedTrip = await response.json();
    return deletedTrip;
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
}

export async function updateTrip(tripId, updatedTrip) {
  try {
    const userId = getUserIdFromToken();
    console.log("Updating trip for user ID:", userId);

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips/${tripId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`, // Utilisation du token du cookie
        },
        body: JSON.stringify(updatedTrip),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorMessage}`
      );
    }

    const updatedTripData = await response.json();
    return updatedTripData;
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
}
