import jwt from "jsonwebtoken";

export async function fetchTrips() {
  try {
    const yourJWTToken = localStorage.getItem("token");
    if (!yourJWTToken) {
      throw new Error("Token non trouvé");
    }

    const decodedToken = jwt.decode(yourJWTToken);
    if (!decodedToken || !decodedToken.id) {
      throw new Error("ID d'utilisateur non trouvé dans le token");
    }

    console.log("Fetching trips for user ID:", decodedToken.id); // Juste pour vérifier

    // Appel à la route /me/trips sans l'ID dans l'URL car l'API peut utiliser le JWT
    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourJWTToken}`, // Utilisez le JWT pour l'authentification
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trips = await response.json();
    return trips;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
}
