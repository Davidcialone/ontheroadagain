import jwt from "jsonwebtoken";
import Compressor from "compressorjs";

// Informations Cloudinary directement intégrées
const CLOUDINARY_CLOUD_NAME = "dn1y58few"; // Remplacez par votre Cloudinary Cloud Name
const CLOUDINARY_UPLOAD_PRESET = "ontheroadagain"; // Remplacez par votre Cloudinary Upload Preset

function isTokenExpired(decodedToken) {
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

export function getUserIdFromToken() {
  const yourJWTToken = localStorage.getItem("token");
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

async function uploadImageToCloudinary(imageFile) {
  if (!(imageFile instanceof File)) {
    throw new Error("Le premier argument doit être un objet File ou Blob.");
  }

  // Compression de l'image
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
      console.error(`Erreur d'upload sur Cloudinary : ${errorText}`);
      throw new Error(`Cloudinary upload error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Image uploadée avec succès:", data);
    return data;
  } catch (error) {
    console.error(
      "Erreur lors du téléchargement de l'image sur Cloudinary:",
      error
    );
    throw new Error("Échec du téléchargement de l'image sur Cloudinary");
  }
}

export { uploadImageToCloudinary };

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorMessage}`
      );
    }

    const trips = await response.json();
    console.log("Trips fetched:", trips);
    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
}

export async function addTrip(newTrip, imageFile) {
  try {
    const userId = getUserIdFromToken();
    console.log("Adding trip for user ID:", userId);

    // Uploader l'image sur Cloudinary
    const uploadedImageUrl = await uploadImageToCloudinary(imageFile);

    // Préparer les données du voyage avec l'URL de l'image
    const tripWithUserId = {
      ...newTrip,
      user_id: userId,
      image_url: uploadedImageUrl, // Ajout de l'URL de l'image
    };

    console.log("Trip data to be sent:", JSON.stringify(tripWithUserId));

    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(tripWithUserId),
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error details: ${errorMessage}`);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorMessage}`
      );
    }

    const addedTrip = await response.json();
    return addedTrip;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
