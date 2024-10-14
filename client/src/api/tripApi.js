export async function fetchTrips() {
  try {
    const yourJWTToken = "votreTokenJWT"; // Remplacez par votre méthode pour obtenir le token JWT

    const response = await fetch(
      "http://localhost:5000/ontheroadagain/api/me/trips",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourJWTToken}`, // Si vous n'utilisez pas de token, commentez cette ligne
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
