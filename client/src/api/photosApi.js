import jwt from "jsonwebtoken";
import Compressor from "compressorjs";
import Cookies from "js-cookie";

// Informations Cloudinary directement intégrées
const CLOUDINARY_CLOUD_NAME = "dn1y58few";
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
  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
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
  console.log("Cloud name:", CLOUDINARY_CLOUD_NAME);

  try {
    console.log("Début de l'upload vers Cloudinary...");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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

async function handleMultipleImageUploads(imageFiles) {
  const uploadResults = []; // Tableau pour stocker les résultats des uploads
  const errorResults = []; // Tableau pour stocker les fichiers qui échouent à la validation

  for (const imageFile of imageFiles) {
    try {
      // Validation préalable
      validateImage(imageFile);

      // Upload
      const result = await uploadImageToCloudinary(imageFile);

      // Ajouter le résultat au tableau si l'upload est réussi
      uploadResults.push(result);
    } catch (error) {
      console.error("Erreur lors du processus d'upload:", error);
      // Ajouter l'image à la liste des erreurs si elle échoue à la validation ou à l'upload
      errorResults.push({
        fileName: imageFile.name,
        errorMessage: error.message,
      });
    }
  }

  // Afficher les résultats finaux
  console.log("Résultats des uploads réussis:", uploadResults);
  console.log("Erreurs rencontrées lors des uploads:", errorResults);

  return {
    successfulUploads: uploadResults,
    errors: errorResults,
  };
}

// Exemple d'appel de la fonction avec un tableau de fichiers d'images
const imageFiles = [
  /* tableau de fichiers d'images (File ou Blob) */
];
handleMultipleImageUploads(imageFiles)
  .then((results) => {
    // Traitement des résultats finaux
    console.log("Tous les uploads traités:", results);
  })
  .catch((error) => {
    console.error("Erreur générale lors du traitement des uploads:", error);
  });

// Fonction pour récupérer les photos d'une visite
export async function getPhotosForVisit(visitId) {
  console.log(`Début de récupération des photos pour la visite: ${visitId}`);

  try {
    // Validation de l'ID de visite
    if (!visitId || isNaN(visitId)) {
      console.error("Erreur: ID de visite invalide", { visitId });
      throw new Error("ID de visite invalide");
    }

    console.log("Envoi de la requête GET pour récupérer les photos...");

    const response = await fetch(
      `http://localhost:5000/api/me/visits/${visitId}/photos`, // Ajustez l'URL selon votre API
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );

    // Vérifiez que la réponse est correcte avant de la lire
    if (!response.ok) {
      console.error(
        "Erreur lors de la récupération des photos:",
        response.statusText
      );
      throw new Error(
        `Erreur lors de la récupération des photos: ${response.statusText}`
      );
    }

    // Lire directement le corps de la réponse en tant que JSON
    const photosData = await response.json();
    const photoUrls = photosData.map((photo) => photo.photo); // Transformer en tableau de chaînes d'URL

    // console.log("Photos récupérées avec succès:", photoUrls);
    return photoUrls;
  } catch (error) {
    console.error("Erreur lors de la récupération des photos:", error);
    throw error;
  }
}

// Fonction pour ajouter des photos à une visite
export async function addPhotosToVisit(visitId, photos) {
  // Validation de l'ID de visite
  console.log(`Début de l'ajout de photos pour la visite: ${visitId}`);
  console.log("Photos à ajouter:", photos, "type", typeof photos);
  if (!visitId || isNaN(visitId) || !Number.isInteger(Number(visitId))) {
    console.error("Erreur: ID de visite invalide", { visitId });
    throw new Error("ID de visite invalide");
  }

  // Vérifiez que photos est bien un tableau non vide
  if (!Array.isArray(photos) || photos.length === 0) {
    console.error("photos n'est pas un tableau valide", { photos });
    throw new Error("photos doit être un tableau non vide.");
  }

  try {
    console.log("Envoi de la requête POST pour ajouter plusieurs photos...");

    const url = `http://localhost:5000/api/me/visits/${visitId}/photos`;
    console.log(`URL de la requête: ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify({ photos }), // Envoi d'un tableau de photos
    });

    // Vérifiez si la réponse est correcte
    if (!response.ok) {
      const errorText = await response.text(); // Récupération de la réponse en texte si la requête échoue
      console.error(
        `Erreur lors de l'ajout de photos:`,
        response.statusText,
        errorText
      );
      throw new Error(
        `Erreur lors de l'ajout de photos: ${response.statusText} - ${errorText}`
      );
    }

    // Analyser le texte de réponse en JSON
    const photoResponseData = await response.json(); // Récupération de la réponse en JSON si elle est réussie
    console.log("Photos ajoutées avec succès:", photoResponseData);

    return photoResponseData; // Retourne les photos ajoutées avec succès
  } catch (error) {
    console.error("Erreur lors de l'ajout de photos:", error.message);
    throw error; // Renvoyer l'erreur pour une gestion ultérieure
  }
}
