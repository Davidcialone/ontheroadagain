import jwt from "jsonwebtoken";

export async function fetchTrips() {
  try {
    // Retrieve JWT token from local storage
    const yourJWTToken = localStorage.getItem("token");
    if (!yourJWTToken) {
      throw new Error("Token non trouvé"); // Handle missing token
    }

    // Decode the JWT token to get user ID
    const decodedToken = jwt.decode(yourJWTToken);
    if (!decodedToken || !decodedToken.id) {
      throw new Error("ID d'utilisateur non trouvé dans le token"); // Handle missing user ID in token
    }

    const userId = decodedToken.id; // Extract user ID from the token
    console.log("Fetching trips for user ID:", userId);

    // Fetch trips for the specific user ID
    const response = await fetch(
      `http://localhost:5000/ontheroadagain/api/me/trips/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${yourJWTToken}`, // Use the JWT for authentication
        },
      }
    );

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
    }

    const trips = await response.json(); // Parse the JSON response
    return trips; // Return the trips data
  } catch (error) {
    console.error("Error fetching trips:", error); // Log the error to the console
    throw error; // Re-throw the error for further handling
  }
}
