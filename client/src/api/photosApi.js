import { getToken, getUserIdFromToken } from "./utils.js";

export async function getPhotos(tripId, visitId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}/visit/${visitId}/photos`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const photos = await response.json();
    console.log("Success:", photos);
    return photos;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Converti un fichier blob en string base64
export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(data) {
  try {
    const response = await fetch("http://localhost:3000/api/uploadVisit", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// Fonction pour créer les photos
export async function createPhotos(photosData, visitId) {
  try {
    // Fonction pour vérifier et convertir chaque photo
    const checkAndConvertPhoto = async (photoData) => {
      if (photoData.photo) {
        const file = photoData.photo;
        // Vérifier si le fichier est un Blob
        if (file instanceof Blob) {
          const base64String = await convertFileToBase64(file); // Convertir le fichier en base64
          photoData.photo = base64String; // Mettre à jour photoData avec la chaîne base64
          await uploadImage(photoData); // Télécharger l'image convertie
        } else {
          throw new Error("Le fichier sélectionné n'est pas valide.");
        }
      } else {
        throw new Error("Aucune photo trouvée dans les données.");
      }
      return photoData; // Retourner photoData mis à jour
    };

    // Vérifier si photosData est un tableau
    if (!Array.isArray(photosData)) {
      throw new TypeError("photosData doit être un tableau");
    }

    // Obtenir l'ID du voyage à partir du token utilisateur
    const tripId = getUserIdFromToken();

    // Convertir et vérifier chaque photo de manière asynchrone
    const processedPhotos = await Promise.all(
      photosData.map((photoData) => checkAndConvertPhoto(photoData))
    );

    // Ajouter visitId à chaque photoData
    const photosWithVisitId = processedPhotos.map((photoData) => ({
      ...photoData,
      "visit-id": visitId, // Ajouter visit-id à chaque objet photo
    }));

    // Effectuer une requête POST pour envoyer les photos converties
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}/visit/${visitId}/photos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ photos: photosWithVisitId }), // Envoyer les données converties sous forme de JSON
      }
    );

    // Vérifier si la requête s'est déroulée avec succès
    if (!response.ok) {
      throw new Error("Ressource non trouvée");
    }

    // Récupérer la réponse au format JSON
    const result = await response.json();
    console.log("Photos créées avec succès:", result);
    return result; // Retourner le résultat de la création des photos
  } catch (error) {
    console.error("Échec de la création des photos:", error.message);
    if (error instanceof TypeError) {
      console.error("Type d'erreur:", error.message);
    }
    throw error; // Propager l'erreur pour une gestion ultérieure
  }
}
