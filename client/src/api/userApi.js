import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

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
  // console.log("Mon user id", userId);
  if (!userId) {
    throw new Error("ID d'utilisateur non trouvé dans le token");
  }

  return userId;
}

export async function fetchUser() {
  try {
    const userId = getUserIdFromToken();
    // Déterminer l'URL de base en fonction de l'environnement
    let API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Récupération de l'URL de base de l'API
    if (import.meta.env.MODE === "production") {
      // Supprimer le slash initial en production si nécessaire
      API_BASE_URL = API_BASE_URL.replace(/\/$/, ""); // Supprime le slash final éventuel
    }
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    // console.log("Réponse de l'API concernant l'user:", response);
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw error;
  }
}
