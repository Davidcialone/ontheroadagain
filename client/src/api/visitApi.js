import { convertFileToBase64, uploadImage } from "./apiPhotos.js";

const getToken = () => {
  return localStorage.getItem("token");
};
getToken();

// fonction pour récupérer le tripId depuis le local storage
function getTripIdFromLocalStorage() {
  return localStorage.getItem("tripId");
}

// fonction  pour récupérer visitId depuis le local storage
function getVisitIdFromLocalStorage() {
  return localStorage.getItem("visitId");
}

// fonction pour récupérer les visites d'un voyage
export async function getVisits(tripId) {
  getTripIdFromLocalStorage();

  try {
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    getTripIdFromLocalStorage(), console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const tripData = await response.json();
    if (Array.isArray(tripData.visits)) {
      console.log("Visits:", tripData.visits);
      return tripData.visits;
    } else {
      console.error("Visits is not an array");
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// fonction pour créer des nouvelles visites d'un voyage
export async function createVisit(visitData, tripId) {
  // CHECK PHOTO
  if (visitData.photo) {
    const file = visitData.photo;
    if (file instanceof Blob) {
      const base64String = await convertFileToBase64(file);
      visitData.photo = base64String;
      await uploadImage(visitData);
    } else {
      console.error("The selected file is not valid.");
    }
  }
  // END CHECK PHOTO
  tripId = localStorage.getItem("tripId");
  console.log("Youpi", visitData);
  try {
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}/visit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(visitData),
      }
    )
      .then((response) => response.json())
      .then(function (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("visitId", response.visitId);
      });
  } catch (error) {
    console.error("Failed to create visit:", error);
  }
}

// fonction pour modifier une visite
export async function updateVisit(tripId, visitId, updatedVisitData) {
  getTripIdFromLocalStorage();
  getVisitIdFromLocalStorage();
  try {
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}/visit/${visitId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updatedVisitData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update visit");
    }
    const updatedVisit = await response.json();
    console.log("Success:", updatedVisit);
    return updatedVisit;
  } catch (error) {
    console.error("Failed to update visit:", error);
  }
}

// fonction pour supprimer une visite
export async function deleteVisit(tripId, visitId) {
  getTripIdFromLocalStorage();
  getVisitIdFromLocalStorage();
  try {
    const response = await fetch(
      `http://localhost:3000/api/me/trips/${tripId}/visit/${visitId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (response.status === 204) {
      console.log("Success: Visit deleted");
    } else {
      const errorData = await response.json();
      throw new Error(`Error: ${response.status} - ${errorData.message}`);
    }
  } catch (error) {
    console.error("Failed to delete visit:", error);
  }
}
